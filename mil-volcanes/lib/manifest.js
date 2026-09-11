(function () {
  "use strict";
  window.__BRAND__ = {
    name: "Mil Volcanes",
    location: "Mendoza, Argentina",
    founded: 2018,
    tagline: "Vinos de altura nacidos en la Reserva Natural La Payunia.",
    contact: {
      email: "info@milvolcanes.net",
      instagram: "@milvolcanes.wines",
      instagramUrl: "https://instagram.com/milvolcanes.wines",
      website: "www.milvolcanes.net",
      address: "Vistalba, Luján de Cuyo, Mendoza, Argentina"
    },
    /* PRECIOS DE EJEMPLO — reemplazar por los precios reales (ARS, por CAJA
       de 6 botellas) antes de publicar la tienda. El "id" debe coincidir con
       el data-wine-id de cada tarjeta en index.html. Se vende por caja, no
       por botella suelta. */
    shop: {
      currency: "ARS",
      unit: "caja",
      freeShippingNote: "Envío gratis a todo el país a partir de 1 caja (6 botellas). Excepción Tierra del Fuego.",
      products: [
        { id: "premium-sauvblanc-torrontes", name: "Sauvignon Blanc · Torrontés", line: "Premium Blends", price: 51000 },
        { id: "premium-malbec-bonarda", name: "Malbec · Bonarda", line: "Premium Blends", price: 54000 },
        { id: "premium-cabsauv-merlot", name: "Cabernet Sauvignon · Merlot", line: "Premium Blends", price: 57000 },
        { id: "sv-malbec", name: "Malbec Single Vineyard", line: "Single Vineyard", price: 132000 },
        { id: "sv-cabfranc", name: "Cabernet Franc Single Vineyard", line: "Single Vineyard", price: 132000 },
        { id: "sv-cabsauv", name: "Cabernet Sauvignon Single Vineyard", line: "Single Vineyard", price: 132000 },
        { id: "caja-mixta", name: "Caja Mixta · Premium Blends", line: "Caja Mixta", price: 51000 }
      ]
    }
  };
})();
