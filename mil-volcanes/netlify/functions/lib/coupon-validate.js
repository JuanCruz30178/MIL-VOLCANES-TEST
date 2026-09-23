var coupons = require("./coupons");
var usage = require("./coupon-usage");

function normalizeCode(code) {
  return String(code || "").trim().toUpperCase();
}

function findCoupon(code) {
  code = normalizeCode(code);
  if (!code) return null;
  var match = null;
  coupons.forEach(function (c) {
    if (normalizeCode(c.code) === code) match = c;
  });
  return match;
}

async function validateCoupon(code) {
  var coupon = findCoupon(code);
  if (!coupon || coupon.active === false) return { valid: false };

  if (coupon.expiresAt && new Date(coupon.expiresAt).getTime() < Date.now()) {
    return { valid: false };
  }

  if (coupon.maxUses) {
    var used = await usage.getUsage(normalizeCode(coupon.code));
    if (used >= coupon.maxUses) return { valid: false };
  }

  var percentOff = Math.max(0, Math.min(100, Number(coupon.percentOff) || 0));
  if (!percentOff) return { valid: false };

  return {
    valid: true,
    code: normalizeCode(coupon.code),
    percentOff: percentOff,
    label: coupon.label || coupon.code
  };
}

module.exports = { normalizeCode: normalizeCode, validateCoupon: validateCoupon };
