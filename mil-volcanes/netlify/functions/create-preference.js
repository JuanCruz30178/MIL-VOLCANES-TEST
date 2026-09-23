// Netlify Function: creates a Mercado Pago Checkout Pro preference and
// returns its init_point so the browser can redirect to the hosted
// payment page. Runs server-side only — this is the one place allowed to
// hold the Mercado Pago access token.
//
// Setup required in the Netlify dashboard (Site settings → Environment
// variables): MERCADOPAGO_ACCESS_TOKEN = <access token de producción>.
// Get it from https://www.mercadopago.com.ar/developers/panel — start
// with the TEST token to do a full dry run before switching to PROD.

// Prices are authoritative here — the server NEVER trusts a price sent by
// the browser, only the product id and quantity. Keep this in sync with
// the "shop.products" list in lib/manifest.js.
var buyers = require("./lib/buyers");
var couponValidate = require("./lib/coupon-validate");

// Keep in sync with shop.firstPurchaseDiscount in lib/manifest.js.
var FIRST_PURCHASE_DISCOUNT = 0.1;

var PRODUCTS = {
  "premium-sauvblanc-torrontes": { title: "Mil Volcanes — Sauvignon Blanc & Torrontés (Caja x6)", price: 102000 },
  "premium-malbec-bonarda": { title: "Mil Volcanes — Malbec & Bonarda (Caja x6)", price: 102000 },
  "premium-cabsauv-merlot": { title: "Mil Volcanes — Cabernet Sauvignon & Merlot (Caja x6)", price: 102000 },
  "mix-premium": { title: "Mil Volcanes — Caja Mixta Premium Blends", price: 102000 },
  "sv-malbec": { title: "Mil Volcanes — Malbec Single Vineyard (Caja x6)", price: 180000 },
  "sv-cabfranc": { title: "Mil Volcanes — Cabernet Franc Single Vineyard (Caja x6)", price: 180000 },
  "mix-sv": { title: "Mil Volcanes — Caja Mixta Single Vineyard", price: 180000 }
};

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  var accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Falta configurar MERCADOPAGO_ACCESS_TOKEN en Netlify (Site settings → Environment variables)." })
    };
  }

  var body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: "JSON inválido." }) };
  }

  var cart = Array.isArray(body.items) ? body.items : [];
  if (!cart.length) {
    return { statusCode: 400, body: JSON.stringify({ error: "El carrito está vacío." }) };
  }

  // Shipping details, entered by the customer on our own site (not Mercado
  // Pago's shipments product). Only plain strings, capped in length, are
  // accepted here — this never touches payment amounts.
  var shipIn = body.shipping || {};
  var shipping = {};
  ["nombre", "email", "telefono", "dni", "calle", "numero", "pisoDepto", "ciudad", "cp", "provincia"].forEach(function (key) {
    var value = shipIn[key];
    shipping[key] = typeof value === "string" ? value.slice(0, 200) : "";
  });

  // "10% off first order": decided here, server-side, from our own record
  // of past approved payments — never from anything the browser claims.
  var firstPurchaseDiscount = false;
  try {
    firstPurchaseDiscount = !(await buyers.hasPurchased({ email: shipping.email, dni: shipping.dni }));
  } catch (e) {
    console.log("[create-preference] buyers.hasPurchased ERROR: " + (e && e.message) + " " + (e && e.stack));
    firstPurchaseDiscount = false;
  }
  var firstPurchaseRate = firstPurchaseDiscount ? FIRST_PURCHASE_DISCOUNT : 0;

  // Coupon code: also validated here, never trusted from the browser. A
  // coupon never stacks with the first-purchase discount — whichever of
  // the two is bigger is the one applied.
  var couponResult = { valid: false };
  try {
    couponResult = await couponValidate.validateCoupon(body.couponCode);
    console.log("[create-preference] couponCode=" + body.couponCode + " result=" + JSON.stringify(couponResult));
  } catch (e) {
    console.log("[create-preference] couponValidate ERROR: " + (e && e.message) + " " + (e && e.stack));
    couponResult = { valid: false };
  }
  var couponRate = couponResult.valid ? couponResult.percentOff / 100 : 0;

  var appliedRate = Math.max(firstPurchaseRate, couponRate);
  var appliedCoupon = couponResult.valid && couponRate >= firstPurchaseRate ? couponResult.code : null;

  var items = [];
  for (var i = 0; i < cart.length; i++) {
    var line = cart[i] || {};
    var product = PRODUCTS[line.id];
    if (!product) {
      return { statusCode: 400, body: JSON.stringify({ error: "Producto inválido: " + line.id }) };
    }
    var qty = Math.max(1, Math.min(24, parseInt(line.qty, 10) || 1));
    var unitPrice = appliedRate > 0
      ? Math.round(product.price * (1 - appliedRate))
      : product.price;
    items.push({
      id: line.id,
      title: product.title,
      quantity: qty,
      unit_price: unitPrice,
      currency_id: "ARS"
    });
  }

  var origin = (event.headers && (event.headers.origin || (event.headers.host && "https://" + event.headers.host))) || "";

  // Mercado Pago's metadata only reliably preserves flat string values, so
  // shipping fields are stored as top-level "shipping_*" keys rather than a
  // nested object.
  var metadata = {
    first_purchase_discount: firstPurchaseDiscount,
    applied_coupon: appliedCoupon || ""
  };
  Object.keys(shipping).forEach(function (key) {
    metadata["shipping_" + key] = shipping[key];
  });

  var preference = {
    items: items,
    back_urls: {
      success: origin + "/?compra=exito",
      failure: origin + "/?compra=error",
      pending: origin + "/?compra=pendiente"
    },
    auto_return: "approved",
    statement_descriptor: "MIL VOLCANES",
    notification_url: origin + "/.netlify/functions/mp-webhook",
    metadata: metadata
  };

  if (shipping.nombre || shipping.email || shipping.telefono) {
    var nameParts = shipping.nombre.trim().split(/\s+/);
    preference.payer = {
      name: nameParts[0] || undefined,
      surname: nameParts.length > 1 ? nameParts.slice(1).join(" ") : undefined,
      email: shipping.email || undefined,
      phone: shipping.telefono ? { number: shipping.telefono } : undefined
    };
  }

  try {
    var resp = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + accessToken
      },
      body: JSON.stringify(preference)
    });
    var mpData = await resp.json();

    if (!resp.ok) {
      return {
        statusCode: resp.status,
        body: JSON.stringify({ error: mpData.message || "Mercado Pago rechazó la solicitud." })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ init_point: mpData.init_point, id: mpData.id })
    };
  } catch (err) {
    return { statusCode: 502, body: JSON.stringify({ error: "No se pudo conectar con Mercado Pago." }) };
  }
};
