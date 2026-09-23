// Lists nearby OCA branches for a postal code, so the customer can choose
// where to pick up their order at checkout. Public OCA lookup — no
// credentials needed, same as the shipping-cost quote endpoint.
var oca = require("./lib/oca");

exports.handler = async function (event) {
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: JSON.stringify({ branches: [] }) };
  }

  var cp = (event.queryStringParameters && event.queryStringParameters.cp) || "";

  try {
    var branches = await oca.getBranchesForCP(cp);
    return { statusCode: 200, body: JSON.stringify({ branches: branches }) };
  } catch (err) {
    console.log("[oca-branches] ERROR cp=" + cp + " message=" + (err && err.message));
    return { statusCode: 200, body: JSON.stringify({ branches: [] }) };
  }
};
