// Automatically creates the OCA shipment ("Crear envío" / IngresoORMultiplesRetiros_v2)
// once a Mercado Pago payment is approved, so it doesn't have to be typed by
// hand into the OCA e-Pak panel for every order.
//
// Left as ConfirmarRetiro=False on purpose: the shipment lands in OCA's own
// "Carrito de Envíos" waiting for a human to review and confirm it there,
// rather than being finalized automatically. Once this has run reliably for
// a while, ConfirmarRetiro can be switched to "True" to skip that step.
//
// Uses OCA's QA/test environment by default (OCA_ENV unset or "qa"). Set
// OCA_ENV=production in Netlify only after a successful test run.
//
// Reference data for Mil Volcanes' OCA e-Pak account — confirm with the
// business before changing any of this:
//   CUIT: 27-28401090-1        Número de cuenta: 187844/000
//   Centro de costo: 1         Operativa: 472287 (Sucursal a Puerta —
//   se despacha llevando las cajas a la sucursal, no van a buscarlas a domicilio)
//   Centro de Imposición de origen: 117 (Sucursal OCA Mendoza, Av. Juan B. Justo 130)
//   Caja x6 botellas: 9 kg, 30 (alto) x 26 (ancho) x 16.5 (largo) cm
var blobsStore = require("./blobs-store");

var CUIT = "27-28401090-1";
var NRO_CUENTA = "187844/000";
var CENTRO_COSTO = "1";
var OPERATIVA = 472287;
var ID_CENTRO_IMPOSICION_ORIGEN = "117";
var ORIGEN = {
  calle: "AV. JUAN B JUSTO",
  nro: "130",
  localidad: "MENDOZA",
  provincia: "MENDOZA",
  cp: "5500"
};
var CAJA = { peso: 9, alto: 30, ancho: 26, largo: 16.5 };

function shipmentsStore() {
  return blobsStore("oca-shipments");
}

async function hasShipmentBeenCreated(paymentId) {
  var record = await shipmentsStore().get(String(paymentId), { type: "json" });
  return !!record;
}

async function markShipmentCreated(paymentId, info) {
  await shipmentsStore().setJSON(String(paymentId), Object.assign({ createdAt: new Date().toISOString() }, info || {}));
}

function xmlEscape(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function todayYYYYMMDD() {
  var d = new Date();
  var mm = String(d.getMonth() + 1).padStart(2, "0");
  var dd = String(d.getDate()).padStart(2, "0");
  return "" + d.getFullYear() + mm + dd;
}

function splitName(fullName) {
  var parts = String(fullName || "").trim().split(/\s+/);
  return {
    nombre: parts[0] || "",
    apellido: parts.length > 1 ? parts.slice(1).join(" ") : parts[0] || ""
  };
}

// order: { nroremito, cantidadCajas, destinatario: { nombreCompleto, calle,
// numero, pisoDepto, ciudad, provincia, cp, telefono, email } }
function buildEnvioXml(order) {
  var d = order.destinatario;
  var name = splitName(d.nombreCompleto);
  var cantidadCajas = Math.max(1, order.cantidadCajas || 1);

  var paquetes = "";
  for (var i = 0; i < cantidadCajas; i++) {
    paquetes +=
      '<paquete alto="' + CAJA.alto + '" ancho="' + CAJA.ancho + '" largo="' + CAJA.largo +
      '" peso="' + CAJA.peso + '" valor="0" cant="1" />';
  }

  return (
    '<?xml version="1.0" encoding="iso-8859-1" standalone="yes"?>' +
    "<ROWS>" +
    '<cabecera ver="2.0" nrocuenta="' + xmlEscape(NRO_CUENTA) + '" origen="API" />' +
    "<origenes>" +
    '<origen calle="' + xmlEscape(ORIGEN.calle) + '" nro="' + xmlEscape(ORIGEN.nro) +
    '" piso="" depto="" cp="' + xmlEscape(ORIGEN.cp) + '" localidad="' + xmlEscape(ORIGEN.localidad) +
    '" provincia="' + xmlEscape(ORIGEN.provincia) + '" contacto="" email="" solicitante="" observaciones=""' +
    ' centrocosto="' + xmlEscape(CENTRO_COSTO) + '" idfranjahoraria="1"' +
    ' idcentroimposicionorigen="' + xmlEscape(ID_CENTRO_IMPOSICION_ORIGEN) + '" fecha="' + todayYYYYMMDD() + '">' +
    "<envios>" +
    '<envio idoperativa="' + OPERATIVA + '" nroremito="' + xmlEscape(order.nroremito) + '">' +
    '<destinatario apellido="' + xmlEscape(name.apellido) + '" nombre="' + xmlEscape(name.nombre) +
    '" calle="' + xmlEscape(d.calle) + '" nro="' + xmlEscape(d.numero) + '" piso="' + xmlEscape(d.pisoDepto || "") +
    '" depto="" localidad="' + xmlEscape(d.ciudad) + '" provincia="' + xmlEscape(d.provincia) + '" cp="' + xmlEscape(d.cp) +
    '" telefono="' + xmlEscape(d.telefono) + '" email="' + xmlEscape(d.email) + '" celular="' + xmlEscape(d.telefono) +
    '" observaciones="' + xmlEscape("Mil Volcanes - Pedido " + order.nroremito) + '" />' +
    "<paquetes>" + paquetes + "</paquetes>" +
    "</envio>" +
    "</envios>" +
    "</origen>" +
    "</origenes>" +
    "</ROWS>"
  );
}

function endpointUrl() {
  var env = (process.env.OCA_ENV || "qa").toLowerCase();
  return env === "production"
    ? "https://webservice.oca.com.ar/ePak_tracking/Oep_TrackEPak.asmx/IngresoORMultiplesRetiros_v2"
    : "https://integraciones.ocadev.com.ar/epak_tracking_test/Oep_TrackEPak.asmx/IngresoORMultiplesRetiros_v2";
}

async function createShipment(order) {
  var user = process.env.OCA_USER;
  var password = process.env.OCA_PASSWORD;
  if (!user || !password) {
    return { ok: false, error: "Faltan OCA_USER / OCA_PASSWORD en Netlify." };
  }

  var xml = buildEnvioXml(order);
  var body = new URLSearchParams({
    usr: user,
    psw: password,
    XML_Datos: xml,
    ConfirmarRetiro: "False",
    // OCA's own docs mark these as "internal use" (not to be filled), but
    // the endpoint rejects the request with "Missing parameter:
    // ArchivoCliente" if they're left out entirely — send them empty.
    ArchivoCliente: "",
    ArchivoProceso: ""
  });

  try {
    var resp = await fetch(endpointUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString()
    });
    var text = await resp.text();
    if (!resp.ok) {
      return { ok: false, error: "OCA respondió " + resp.status, raw: text };
    }
    return { ok: true, raw: text };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

module.exports = {
  CUIT: CUIT,
  buildEnvioXml: buildEnvioXml,
  createShipment: createShipment,
  hasShipmentBeenCreated: hasShipmentBeenCreated,
  markShipmentCreated: markShipmentCreated
};
