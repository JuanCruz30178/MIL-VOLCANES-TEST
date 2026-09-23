// Shared helper: tracks which customers have already completed a Mercado
// Pago purchase, so the "20% off first order" promo can only be used once
// per customer. Backed by Netlify Blobs (zero-config key/value storage
// available automatically to Netlify Functions — no extra account or
// credentials needed, unlike Mercado Pago/Andreani).
//
// Customers are matched by email OR DNI (whichever was collected) — email
// alone would let someone just type a new address each time to keep
// re-using the discount; DNI is far harder to "renew".
var blobsStore = require("./blobs-store");

function store() {
  return blobsStore("buyers");
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function normalizeDni(dni) {
  return String(dni || "").replace(/\D/g, "");
}

function keysFor(identity) {
  identity = identity || {};
  var keys = [];
  var email = normalizeEmail(identity.email);
  var dni = normalizeDni(identity.dni);
  if (email) keys.push("email:" + email);
  if (dni) keys.push("dni:" + dni);
  return keys;
}

async function hasPurchased(identity) {
  var keys = keysFor(identity);
  if (!keys.length) return false;
  var s = store();
  for (var i = 0; i < keys.length; i++) {
    var record = await s.get(keys[i], { type: "json" });
    if (record) return true;
  }
  return false;
}

async function markPurchased(identity, info) {
  var keys = keysFor(identity);
  if (!keys.length) return;
  var s = store();
  var record = Object.assign({ firstOrderAt: new Date().toISOString() }, info || {});
  for (var i = 0; i < keys.length; i++) {
    await s.setJSON(keys[i], record);
  }
}

module.exports = {
  normalizeEmail: normalizeEmail,
  normalizeDni: normalizeDni,
  hasPurchased: hasPurchased,
  markPurchased: markPurchased
};
