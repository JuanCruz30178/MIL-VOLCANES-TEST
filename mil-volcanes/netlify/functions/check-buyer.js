// Lets the cart show the "20% off first order" discount live, before the
// customer pays. This is only a preview — create-preference.js re-checks
// the same record and is the one that actually decides the charged price,
// so nothing here can be trusted/forged from the browser to get a discount.
var buyers = require("./lib/buyers");

exports.handler = async function (event) {
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  var qs = event.queryStringParameters || {};
  var email = qs.email || "";
  var dni = qs.dni || "";

  try {
    var purchased = await buyers.hasPurchased({ email: email, dni: dni });
    return { statusCode: 200, body: JSON.stringify({ eligible: !purchased }) };
  } catch (err) {
    // If the store is unreachable, fail closed: no discount shown rather
    // than risking one shown and then not honored at checkout.
    return { statusCode: 200, body: JSON.stringify({ eligible: false }) };
  }
};
