// Validates a coupon code when the customer clicks "Aplicar" in the cart.
// Only a preview — create-preference.js re-validates the same code and is
// the one that decides the actual charged price.
var couponValidate = require("./lib/coupon-validate");

exports.handler = async function (event) {
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: JSON.stringify({ valid: false }) };
  }

  var code = (event.queryStringParameters && event.queryStringParameters.code) || "";

  try {
    var result = await couponValidate.validateCoupon(code);
    console.log("[check-coupon] code=" + code + " result=" + JSON.stringify(result));
    return { statusCode: 200, body: JSON.stringify(result) };
  } catch (err) {
    console.log("[check-coupon] ERROR code=" + code + " message=" + (err && err.message) + " stack=" + (err && err.stack));
    return { statusCode: 200, body: JSON.stringify({ valid: false }) };
  }
};
