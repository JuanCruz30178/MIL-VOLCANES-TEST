// Netlify Blobs' zero-config mode (just getStore("name")) is supposed to
// work automatically inside any Netlify Function, but on this site it
// fails with "MissingBlobsEnvironmentError" — a known Netlify issue on
// some sites. Falls back to the documented manual mode (explicit siteID +
// token) when NETLIFY_BLOBS_SITE_ID / NETLIFY_BLOBS_TOKEN are set.
var { getStore } = require("@netlify/blobs");

function blobsStore(name) {
  var siteID = process.env.NETLIFY_BLOBS_SITE_ID;
  var token = process.env.NETLIFY_BLOBS_TOKEN;
  if (siteID && token) {
    return getStore({ name: name, siteID: siteID, token: token });
  }
  return getStore(name);
}

module.exports = blobsStore;
