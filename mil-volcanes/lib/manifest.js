(function () {
  "use strict";
  window.__BRAND__ = {
    name: "Mil Volcanes",
    location: "Mendoza, Argentina",
    founded: 2018,
    tagline: "Vinos de altura nacidos en la Reserva Natural La Payunia.",
    contact: {
      person: "Silvina Santi",
      role: "Co-Founder",
      phone: "+54 9 2615454993",
      phoneWa: "5492615454993",
      email: "silvina@milvolcanes.net",
      instagram: "@milvolcanes.wines",
      instagramUrl: "https://instagram.com/milvolcanes.wines",
      website: "www.milvolcanes.net",
      address: "Vistalba, Luján de Cuyo, Mendoza, Argentina"
    },
    /* PRECIOS DE EJEMPLO — reemplazar por los precios reales (ARS, por botella)
       antes de publicar la tienda. El "id" debe coincidir con el data-wine-id
       de cada tarjeta en index.html. */
    shop: {
      currency: "ARS",
      products: [
        { id: "premium-sauvblanc-torrontes", name: "Sauvignon Blanc · Torrontés", line: "Premium Blends", price: 8500 },
        { id: "premium-malbec-bonarda", name: "Malbec · Bonarda", line: "Premium Blends", price: 9000 },
        { id: "premium-cabsauv-merlot", name: "Cabernet Sauvignon · Merlot", line: "Premium Blends", price: 9500 },
        { id: "sv-malbec", name: "Malbec Single Vineyard", line: "Single Vineyard", price: 22000 },
        { id: "sv-cabfranc", name: "Cabernet Franc Single Vineyard", line: "Single Vineyard", price: 22000 },
        { id: "sv-cabsauv", name: "Cabernet Sauvignon Single Vineyard", line: "Single Vineyard", price: 22000 }
      ]
    }
  };
})();
