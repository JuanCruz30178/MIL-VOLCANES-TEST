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
var PRODUCTS = {
  "premium-sauvblanc-torrontes": { title: "Mil Volcanes — Sauvignon Blanc & Torrontés", price: 8500 },
  "premium-malbec-bonarda": { title: "Mil Volcanes — Malbec & Bonarda", price: 9000 },
  "premium-cabsauv-merlot": { title: "Mil Volcanes — Cabernet Sauvignon & Merlot", price: 9500 },
  "sv-malbec": { title: "Mil Volcanes — Malbec Single Vineyard", price: 22000 },
  "sv-cabfranc": { title: "Mil Volcanes — Cabernet Franc Single Vineyard", price: 22000 }
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

  var items = [];
  for (var i = 0; i < cart.length; i++) {
    var line = cart[i] || {};
    var product = PRODUCTS[line.id];
    if (!product) {
      return { statusCode: 400, body: JSON.stringify({ error: "Producto inválido: " + line.id }) };
    }
    var qty = Math.max(1, Math.min(24, parseInt(line.qty, 10) || 1));
    items.push({
      id: line.id,
      title: product.title,
      quantity: qty,
      unit_price: product.price,
      currency_id: "ARS"
    });
  }

  var origin = (event.headers && (event.headers.origin || (event.headers.host && "https://" + event.headers.host))) || "";

  var preference = {
    items: items,
    back_urls: {
      success: origin + "/?compra=exito",
      failure: origin + "/?compra=error",
      pending: origin + "/?compra=pendiente"
    },
    auto_return: "approved",
    statement_descriptor: "MIL VOLCANES"
  };

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
