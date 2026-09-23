// Shared helper: tracks which customer emails have already completed a
// Mercado Pago purchase, so the "20% off first order" promo can only be
// used once per customer. Backed by Netlify Blobs (zero-config key/value
// storage available automatically to Netlify Functions — no extra account
// or credentials needed, unlike Mercado Pago/Andreani).
var { getStore } = require("@netlify/blobs");

function store() {
  return getStore("buyers");
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

async function hasPurchased(email) {
  email = normalizeEmail(email);
  if (!email) return false;
  var record = await store().get(email, { type: "json" });
  return !!record;
}

async function markPurchased(email, info) {
  email = normalizeEmail(email);
  if (!email) return;
  var record = Object.assign({ firstOrderAt: new Date().toISOString() }, info || {});
  await store().setJSON(email, record);
}

module.exports = { normalizeEmail: normalizeEmail, hasPurchased: hasPurchased, markPurchased: markPurchased };
