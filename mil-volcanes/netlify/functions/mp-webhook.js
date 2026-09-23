// Mercado Pago calls this URL (configured as "notification_url" on the
// preference in create-preference.js) whenever a payment's status changes.
// This is the only place that marks a customer as "already used their first
// purchase discount" — it re-fetches the payment from Mercado Pago's API
// with our own access token, so it can't be spoofed by hitting the
// checkout's success page without actually paying.
var buyers = require("./lib/buyers");
var couponUsage = require("./lib/coupon-usage");
var oca = require("./lib/oca");

exports.handler = async function (event) {
  try {
    var accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!accessToken) return { statusCode: 200, body: "" };

    var params = event.queryStringParameters || {};
    var paymentId = params["data.id"] || params.id;
    var type = params.type || params.topic;

    if (!paymentId && event.body) {
      try {
        var parsed = JSON.parse(event.body);
        paymentId = paymentId || (parsed.data && parsed.data.id);
        type = type || parsed.type;
      } catch (e) {
        // Ignore malformed bodies — Mercado Pago also sends the id via
        // query string, which is already covered above.
      }
    }

    if (type !== "payment" || !paymentId) {
      return { statusCode: 200, body: "" };
    }

    var resp = await fetch("https://api.mercadopago.com/v1/payments/" + paymentId, {
      headers: { Authorization: "Bearer " + accessToken }
    });
    if (!resp.ok) return { statusCode: 200, body: "" };
    var payment = await resp.json();

    if (payment.status === "approved") {
      var metadata = payment.metadata || {};
      var email = metadata.shipping_email || (payment.payer && payment.payer.email) || "";
      var dni = metadata.shipping_dni || "";
      if (email || dni) {
        await buyers.markPurchased({ email: email, dni: dni }, { paymentId: paymentId });
      }
      if (metadata.applied_coupon) {
        await couponUsage.incrementUsage(metadata.applied_coupon);
      }

      // Auto-create the OCA shipment. Guarded so a webhook retry (Mercado
      // Pago can call this more than once for the same payment) never
      // creates a second real shipment for the same order.
      // Logged deliberately: check Netlify → Functions → mp-webhook →
      // logs after a test purchase to see how this went.
      try {
        var alreadyCreated = await oca.hasShipmentBeenCreated(paymentId);
        if (alreadyCreated) {
          console.log("[oca] shipment already created for payment " + paymentId + ", skipping.");
        } else {
          var items = (payment.additional_info && payment.additional_info.items) || [];
          var cantidadCajas = items.reduce(function (sum, item) {
            return sum + (parseInt(item.quantity, 10) || 0);
          }, 0) || 1; // Fallback: assume 1 box if Mercado Pago didn't echo the items back.

          console.log("[oca] creating shipment for payment " + paymentId + ", cantidadCajas=" + cantidadCajas);
          var result = await oca.createShipment({
            nroremito: String(paymentId),
            cantidadCajas: cantidadCajas,
            destinatario: {
              nombreCompleto: metadata.shipping_nombre || "",
              calle: metadata.shipping_calle || "",
              numero: metadata.shipping_numero || "",
              pisoDepto: metadata.shipping_pisoDepto || "",
              ciudad: metadata.shipping_ciudad || "",
              provincia: metadata.shipping_provincia || "",
              cp: metadata.shipping_cp || "",
              telefono: metadata.shipping_telefono || "",
              email: metadata.shipping_email || ""
            }
          });
          console.log("[oca] result ok=" + result.ok + " error=" + (result.error || "") + " raw=" + (result.raw || "").slice(0, 1000));
          await oca.markShipmentCreated(paymentId, { ok: result.ok, error: result.error || null });
        }
      } catch (e) {
        // Best-effort: never let an OCA problem break the webhook response
        // or the buyer/coupon bookkeeping above. Falls back to creating the
        // shipment by hand in the OCA panel for this order.
        console.log("[oca] unexpected error: " + (e && e.message));
      }
    }

    return { statusCode: 200, body: "" };
  } catch (err) {
    // Mercado Pago retries on non-2xx, but a bug here shouldn't loop forever.
    return { statusCode: 200, body: "" };
  }
};
