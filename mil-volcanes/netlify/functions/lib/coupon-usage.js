// Tracks how many times each coupon has been redeemed, so a "maxUses"
// limit set in coupons.js can actually be enforced. Only incremented once
// Mercado Pago confirms a payment was approved (see mp-webhook.js) — never
// on merely starting checkout.
var blobsStore = require("./blobs-store");

function store() {
  return blobsStore("coupon-usage");
}

async function getUsage(code) {
  var record = await store().get(code, { type: "json" });
  return (record && record.count) || 0;
}

async function incrementUsage(code) {
  var current = await getUsage(code);
  await store().setJSON(code, { count: current + 1 });
}

module.exports = { getUsage: getUsage, incrementUsage: incrementUsage };
