// Promo codes. To launch a new coupon, ask Claude to add an entry here —
// it's a small code change and goes live on the next deploy, usually a
// couple of minutes. Fields:
//   code       the code customers type, not case-sensitive (e.g. "VERANO15")
//   percentOff a whole number, 1-100
//   label      short text shown in the cart once applied (optional)
//   active     set to false to pause a code without deleting it
//   expiresAt  ISO date string ("2026-12-31") or null for no expiry
//   maxUses    total redemptions allowed across all customers, or null for unlimited
//
// A coupon never stacks with the automatic "first purchase" discount —
// whichever of the two is bigger is the one applied.
module.exports = [
  // Example (disabled) — copy this shape for a real promo:
  // { code: "BIENVENIDA15", percentOff: 15, label: "Bienvenida", active: true, expiresAt: null, maxUses: null }

  // Internal test coupon for the OCA shipment integration — 99% off so the
  // Mercado Pago charge still goes through normally (a $0 charge would be
  // rejected). Deactivate or delete once the OCA test is confirmed working.
  { code: "TESTOCA99", percentOff: 99, label: "Prueba OCA", active: true, expiresAt: null, maxUses: 10 }
];
