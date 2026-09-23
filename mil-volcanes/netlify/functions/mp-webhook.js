// Mercado Pago calls this URL (configured as "notification_url" on the
// preference in create-preference.js) whenever a payment's status changes.
// This is the only place that marks a customer as "already used their first
// purchase discount" — it re-fetches the payment from Mercado Pago's API
// with our own access token, so it can't be spoofed by hitting the
// checkout's success page without actually paying.
var buyers = require("./lib/buyers");

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
    }

    return { statusCode: 200, body: "" };
  } catch (err) {
    // Mercado Pago retries on non-2xx, but a bug here shouldn't loop forever.
    return { statusCode: 200, body: "" };
  }
};
