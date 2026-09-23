(function () {
  "use strict";

  var data = window.__BRAND__ || {};
  var $ = function (sel, scope) { return (scope || document).querySelector(sel); };
  var $$ = function (sel, scope) { return Array.prototype.slice.call((scope || document).querySelectorAll(sel)); };
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  function safe(fn, name) {
    try { fn(); } catch (e) { if (window.console) console.warn("[" + name + "]", e); }
  }

  /* ---------------- Splash ---------------- */
  function initSplash() {
    var splash = $("[data-splash]");
    if (!splash) return;
    var hide = function () { splash.classList.add("is-out"); };
    if (document.readyState === "complete") setTimeout(hide, 500);
    else window.addEventListener("load", function () { setTimeout(hide, 350); });
    setTimeout(hide, 3200);
  }

  /* ---------------- Confirm modal ---------------- */
  function initConfirmModal() {
    var modal = $("[data-confirm-modal]");
    if (!modal) return;
    var textEl = $("[data-confirm-text]", modal);
    var okBtn = $("[data-confirm-ok]", modal);
    var cancelBtn = $("[data-confirm-cancel]", modal);
    var resolveFn = null;

    function close(result) {
      modal.hidden = true;
      document.body.style.overflow = "";
      var resolve = resolveFn;
      resolveFn = null;
      if (resolve) resolve(result);
    }

    if (okBtn) okBtn.addEventListener("click", function () { close(true); });
    if (cancelBtn) cancelBtn.addEventListener("click", function () { close(false); });
    modal.addEventListener("click", function (e) { if (e.target === modal) close(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !modal.hidden) close(false);
    });

    window.__mvConfirm = function (message) {
      return new Promise(function (resolve) {
        resolveFn = resolve;
        if (textEl) textEl.textContent = message;
        modal.hidden = false;
        document.body.style.overflow = "hidden";
      });
    };
  }

  /* ---------------- Post-purchase modal ---------------- */
  function initPostPurchaseModal() {
    var modal = $("[data-postpurchase-modal]");
    if (!modal) return;
    var sendBtn = $("[data-postpurchase-send]", modal);
    var closeBtn = $("[data-postpurchase-close]", modal);

    function close() {
      modal.hidden = true;
      document.body.style.overflow = "";
    }
    if (closeBtn) closeBtn.addEventListener("click", close);
    if (sendBtn) sendBtn.addEventListener("click", close);
    modal.addEventListener("click", function (e) { if (e.target === modal) close(); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !modal.hidden) close();
    });

    window.__mvShowPostPurchase = function () {
      if (sendBtn) {
        var subject = "Comprobante de pago — Pedido Mil Volcanes";
        var ship = readShipping();
        var body = "Hola! Les escribo para enviar el comprobante de mi compra realizada a través de Mercado Pago.\n\n(Adjuntar el comprobante o captura de pantalla del pago a este email.)";
        if (shippingIsComplete(ship)) body += "\n\nDatos de envío:\n" + formatShipping(ship);
        var email = (data.contact && data.contact.email) || "info@milvolcanes.net";
        sendBtn.href = "mailto:" + email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      }
      modal.hidden = false;
      document.body.style.overflow = "hidden";
    };
  }

  /* ---------------- Promo badge ---------------- */
  function initPromoBadge() {
    var badge = $("[data-promo-badge]");
    if (!badge) return;
    var KEY = "mv_promo_badge_dismissed";
    var dismissed = false;
    try { dismissed = window.localStorage.getItem(KEY) === "1"; } catch (e) {}
    if (dismissed) return;
    setTimeout(function () { badge.hidden = false; }, 1200);
    var closeBtn = $("[data-promo-badge-close]", badge);
    if (closeBtn) closeBtn.addEventListener("click", function () {
      badge.hidden = true;
      try { window.localStorage.setItem(KEY, "1"); } catch (e) {}
    });
  }

  /* ---------------- Nav ---------------- */
  function initNav() {
    var nav = $(".nav");
    if (!nav) return;
    var onScroll = function () {
      if (scrollY > 60) nav.classList.add("is-scrolled");
      else nav.classList.remove("is-scrolled");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    var burger = $("[data-nav-burger]");
    var mobile = $("[data-nav-mobile]");
    if (burger && mobile) {
      var toggle = function (open) {
        burger.setAttribute("aria-expanded", open ? "true" : "false");
        mobile.setAttribute("data-open", open ? "true" : "false");
        document.body.style.overflow = open ? "hidden" : "";
      };
      burger.addEventListener("click", function () {
        toggle(burger.getAttribute("aria-expanded") !== "true");
      });
      $$("a", mobile).forEach(function (a) {
        a.addEventListener("click", function () { toggle(false); });
      });
    }
  }

  /* ---------------- Smooth anchors ---------------- */
  function initSmoothAnchors() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute("href");
      if (!id || id === "#") return;
      var el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      var navOffset = 76;
      var top = el.getBoundingClientRect().top + window.scrollY - navOffset;
      window.scrollTo({ top: top, behavior: reduced ? "auto" : "smooth" });
    });
  }

  /* ---------------- Reveal on scroll ---------------- */
  function initReveals() {
    var els = $$("[data-reveal]");
    if (!els.length || !("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-revealed"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.01, rootMargin: "0px 0px -2% 0px" });
    els.forEach(function (el) { io.observe(el); });

    setTimeout(function () {
      $$("[data-reveal]:not(.is-revealed)").forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("is-revealed");
      });
    }, 6000);
  }

  /* ---------------- Split headline (vanilla, no GSAP) ---------------- */
  function escHTML(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function splitWords(el) {
    el.setAttribute("aria-label", el.textContent.trim().replace(/\s+/g, " "));
    var wrap = function (text) {
      return text.split(/(\s+)/).map(function (w) {
        return /^\s+$/.test(w) ? w : '<span class="split-word" aria-hidden="true">' + escHTML(w) + "</span>";
      }).join("");
    };
    var html = Array.prototype.map.call(el.childNodes, function (node) {
      if (node.nodeType === 3) return wrap(node.textContent);
      if (node.nodeName === "BR") return "<br>";
      if (node.nodeType === 1) {
        var tag = node.tagName.toLowerCase();
        return "<" + tag + ">" + wrap(node.textContent) + "</" + tag + ">";
      }
      return "";
    }).join("");
    el.innerHTML = html;
    return $$(".split-word", el);
  }
  function initSplitHeadline() {
    var targets = $$("[data-split]");
    if (!targets.length) return;
    targets.forEach(function (el) {
      var words = splitWords(el);
      words.forEach(function (w, i) { w.style.transitionDelay = Math.min(i * 45, 640) + "ms"; });
      el.classList.add("is-split");
      var parentReveal = el.closest("[data-reveal]") || el;
      if ("IntersectionObserver" in window) {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) { el.classList.add("is-revealed"); io.unobserve(el); }
          });
        }, { threshold: 0.01, rootMargin: "0px 0px -2% 0px" });
        io.observe(parentReveal);
      } else {
        el.classList.add("is-revealed");
      }
    });
  }

  /* ---------------- Floating labels on <select> fields ---------------- */
  // A <select> has no :placeholder-shown, so the floating-label CSS can't
  // tell on its own whether one has a value — it needs a .has-value class
  // toggled by hand (this affects every .field select on the site, e.g.
  // the "Tipo de consulta" field, not just the checkout shipping form).
  function initSelectLabels() {
    $$(".field select").forEach(function (select) {
      var field = select.closest(".field");
      if (!field) return;
      function sync() { field.classList.toggle("has-value", select.value !== ""); }
      sync();
      select.addEventListener("change", sync);
    });
  }

  /* ---------------- Contact form -> mailto ---------------- */
  function initContactForm() {
    var form = $("[data-contact-form]");
    var success = $("[data-contact-success]");
    if (!form) return;
    var contact = data.contact || {};

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;

      var name = (form.elements.nombre && form.elements.nombre.value || "").trim();
      var empresa = (form.elements.empresa && form.elements.empresa.value || "").trim();
      var pais = (form.elements.pais && form.elements.pais.value || "").trim();
      var interes = (form.elements.interes && form.elements.interes.value || "").trim();
      var mensaje = (form.elements.mensaje && form.elements.mensaje.value || "").trim();

      var subject = "Consulta de ventas · " + (empresa || name || "Mil Volcanes");
      var bodyLines = [
        "Nombre: " + name,
        "Empresa: " + empresa,
        "País: " + pais,
        "Interés: " + interes,
        "",
        mensaje
      ];
      var mailto = "mailto:" + encodeURIComponent(contact.email || "info@milvolcanes.net") +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(bodyLines.join("\n"));

      window.location.href = mailto;

      if (success) {
        form.hidden = true;
        success.classList.add("is-visible");
      }
    });
  }

  /* ---------------- Cart + Mercado Pago checkout ---------------- */
  var CART_KEY = "mv_cart_v1";

  function money(n) {
    try { return "$" + Math.round(n).toLocaleString("es-AR"); }
    catch (e) { return "$" + Math.round(n); }
  }
  function readCart() {
    try { return JSON.parse(window.localStorage.getItem(CART_KEY)) || []; }
    catch (e) { return []; }
  }
  function writeCart(cart) {
    try { window.localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) {}
  }
  function findProduct(id) {
    var products = (data.shop && data.shop.products) || [];
    for (var i = 0; i < products.length; i++) if (products[i].id === id) return products[i];
    return null;
  }
  function cartImage(id) {
    var card = document.querySelector('[data-wine-id="' + id + '"] .wine-card-figure img');
    return card ? card.getAttribute("src") : "";
  }

  var SHIP_KEY = "mv_shipping_v1";
  var SHIP_FIELDS = ["nombre", "email", "telefono", "dni", "direccion", "ciudad", "cp", "provincia"];
  function readShipping() {
    try { return JSON.parse(window.localStorage.getItem(SHIP_KEY)) || {}; }
    catch (e) { return {}; }
  }
  function writeShipping(ship) {
    try { window.localStorage.setItem(SHIP_KEY, JSON.stringify(ship)); } catch (e) {}
  }
  function shippingIsComplete(ship) {
    return SHIP_FIELDS.every(function (key) { return ship && String(ship[key] || "").trim(); });
  }
  var SHIP_LABELS = {
    nombre: "Nombre y apellido", email: "Email", telefono: "Teléfono", dni: "DNI",
    direccion: "Dirección", ciudad: "Ciudad", cp: "Código postal", provincia: "Provincia"
  };
  function formatShipping(ship) {
    return SHIP_FIELDS.map(function (key) { return SHIP_LABELS[key] + ": " + (ship[key] || ""); }).join("\n");
  }

  function initCart() {
    var overlay = $("[data-cart-overlay]");
    var drawer = $("[data-cart-drawer]");
    var itemsBox = $("[data-cart-items]");
    var emptyMsg = $("[data-cart-empty]");
    var footBox = $("[data-cart-foot]");
    var subtotalRowEl = $("[data-cart-subtotal-row]");
    var subtotalEl = $("[data-cart-subtotal]");
    var discountRowEl = $("[data-cart-discount-row]");
    var discountEl = $("[data-cart-discount]");
    var totalEl = $("[data-cart-total]");
    var countEl = $("[data-cart-count]");
    var errorEl = $("[data-cart-error]");
    if (!drawer || !overlay) return;

    // "20% off first order": shown live once the customer types an email we
    // haven't seen an approved payment for. This is only a preview — the
    // server (create-preference.js) decides and charges the real price.
    var FIRST_PURCHASE_DISCOUNT = (data.shop && data.shop.firstPurchaseDiscount) || 0;
    var firstPurchaseEligible = null;
    var lastCheckedKey = "";
    // Matches by email AND DNI (both already required in the shipping form)
    // — email alone would let someone just type a new address each time to
    // keep re-using the discount. The server re-checks this for real when
    // creating the payment preference; this is only a live preview.
    function checkFirstPurchase(email, dni) {
      email = String(email || "").trim().toLowerCase();
      dni = String(dni || "").replace(/\D/g, "");
      if (!FIRST_PURCHASE_DISCOUNT || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        firstPurchaseEligible = null;
        renderCart();
        return;
      }
      var key = email + "|" + dni;
      if (key === lastCheckedKey) return;
      lastCheckedKey = key;
      var url = "/.netlify/functions/check-buyer?email=" + encodeURIComponent(email);
      if (dni) url += "&dni=" + encodeURIComponent(dni);
      fetch(url)
        .then(function (resp) { return resp.json(); })
        .then(function (result) {
          if (key !== lastCheckedKey) return;
          firstPurchaseEligible = !!(result && result.eligible);
          renderCart();
        })
        .catch(function () { firstPurchaseEligible = null; });
    }
    function computeTotals(cart) {
      var subtotal = cart.reduce(function (sum, line) {
        var product = findProduct(line.id);
        return sum + (product ? product.price * line.qty : 0);
      }, 0);
      var discountActive = FIRST_PURCHASE_DISCOUNT > 0 && firstPurchaseEligible === true && cart.length > 0;
      var discount = discountActive ? Math.round(subtotal * FIRST_PURCHASE_DISCOUNT) : 0;
      return { subtotal: subtotal, discount: discount, total: subtotal - discount, discountActive: discountActive };
    }

    // Shipping details: restore from a previous visit, persist as the customer types.
    var shipFields = $$("[data-ship-field]");
    var shipErrorEl = $("[data-ship-error]");
    var savedShip = readShipping();
    var emailFieldEl = null;
    var dniFieldEl = null;
    shipFields.forEach(function (field) {
      var key = field.dataset.shipField;
      if (key === "email") emailFieldEl = field;
      if (key === "dni") dniFieldEl = field;
      if (savedShip[key]) field.value = savedShip[key];
      field.addEventListener("input", function () {
        var ship = readShipping();
        ship[key] = field.value;
        writeShipping(ship);
        if (shipErrorEl) shipErrorEl.hidden = true;
      });
      field.addEventListener("change", function () {
        var ship = readShipping();
        ship[key] = field.value;
        writeShipping(ship);
        if (shipErrorEl) shipErrorEl.hidden = true;
      });
      if (key === "email" || key === "dni") {
        field.addEventListener("blur", function () {
          checkFirstPurchase(emailFieldEl ? emailFieldEl.value : "", dniFieldEl ? dniFieldEl.value : "");
        });
      }
    });
    if (savedShip.email) checkFirstPurchase(savedShip.email, savedShip.dni);

    function renderCart() {
      var cart = readCart();
      var count = cart.reduce(function (n, l) { return n + l.qty; }, 0);
      if (countEl) {
        countEl.textContent = String(count);
        countEl.hidden = count === 0;
      }
      if (!itemsBox) return;

      $$(".cart-item", itemsBox).forEach(function (el) { el.remove(); });
      if (emptyMsg) emptyMsg.hidden = cart.length > 0;
      if (footBox) footBox.hidden = cart.length === 0;

      cart.forEach(function (line) {
        var product = findProduct(line.id);
        if (!product) return;
        var lineTotal = product.price * line.qty;

        var el = document.createElement("div");
        el.className = "cart-item";
        el.innerHTML =
          '<div class="cart-item-figure"><img src="' + escHTML(cartImage(line.id)) + '" alt="" loading="lazy"></div>' +
          '<div class="cart-item-info">' +
            '<div class="cart-item-name">' + escHTML(product.name) + '</div>' +
            '<div class="cart-item-unit">' + money(product.price) + ' ' + (window.__mvT ? window.__mvT("cart-each") : "c/u") + '</div>' +
            '<div class="cart-item-row">' +
              '<span class="qty-stepper">' +
                '<button type="button" class="qty-btn" data-cart-qty-minus>−</button>' +
                '<input type="number" class="qty-input" value="' + line.qty + '" min="1" max="24" data-cart-qty-input>' +
                '<button type="button" class="qty-btn" data-cart-qty-plus>+</button>' +
              '</span>' +
              '<span class="cart-item-price">' + money(lineTotal) + '</span>' +
            '</div>' +
            '<button type="button" class="cart-item-remove" data-cart-remove>' + (window.__mvT ? window.__mvT("cart-remove") : "Quitar") + '</button>' +
          '</div>';
        el.dataset.id = line.id;
        itemsBox.appendChild(el);
      });

      var totals = computeTotals(cart);
      if (subtotalRowEl) subtotalRowEl.hidden = !totals.discountActive;
      if (subtotalEl) subtotalEl.textContent = money(totals.subtotal);
      if (discountRowEl) discountRowEl.hidden = !totals.discountActive;
      if (discountEl) discountEl.textContent = "-" + money(totals.discount);
      if (totalEl) totalEl.textContent = money(totals.total);
      if (errorEl) errorEl.hidden = true;
    }

    function setQty(id, qty) {
      var cart = readCart();
      qty = Math.max(1, Math.min(24, qty || 1));
      var found = false;
      cart = cart.map(function (l) {
        if (l.id === id) { found = true; return { id: id, qty: qty }; }
        return l;
      });
      if (!found) cart.push({ id: id, qty: qty });
      writeCart(cart);
      renderCart();
    }
    function addToCart(id, qty) {
      var cart = readCart();
      var found = false;
      cart = cart.map(function (l) {
        if (l.id === id) { found = true; return { id: id, qty: l.qty + qty }; }
        return l;
      });
      if (!found) cart.push({ id: id, qty: qty });
      writeCart(cart);
      renderCart();
    }
    function removeFromCart(id) {
      writeCart(readCart().filter(function (l) { return l.id !== id; }));
      renderCart();
    }

    function openCart() {
      overlay.hidden = false; drawer.hidden = false;
      requestAnimationFrame(function () {
        overlay.classList.add("is-open"); drawer.classList.add("is-open");
      });
      document.body.style.overflow = "hidden";
    }
    function closeCart() {
      overlay.classList.remove("is-open"); drawer.classList.remove("is-open");
      document.body.style.overflow = "";
      setTimeout(function () { overlay.hidden = true; drawer.hidden = true; }, 450);
    }

    $$("[data-cart-open]").forEach(function (btn) { btn.addEventListener("click", openCart); });
    $$("[data-cart-close]").forEach(function (btn) { btn.addEventListener("click", closeCart); });
    overlay.addEventListener("click", closeCart);
    var closeLink = $("[data-cart-close-link]");
    if (closeLink) closeLink.addEventListener("click", closeCart);

    // Quantity steppers on each wine card
    $$(".wine-card[data-wine-id]").forEach(function (card) {
      var input = $(".qty-input", card);
      var minus = $("[data-qty-minus]", card);
      var plus = $("[data-qty-plus]", card);
      var addBtn = $("[data-add-cart]", card);
      if (minus) minus.addEventListener("click", function () {
        input.value = Math.max(1, (parseInt(input.value, 10) || 1) - 1);
      });
      if (plus) plus.addEventListener("click", function () {
        input.value = Math.min(24, (parseInt(input.value, 10) || 1) + 1);
      });
      if (addBtn) addBtn.addEventListener("click", function () {
        var id = card.dataset.wineId;
        var qty = Math.max(1, Math.min(24, parseInt(input.value, 10) || 1));
        addToCart(id, qty);
        openCart();
      });
    });

    // Delegated events for items inside the drawer (rendered dynamically)
    itemsBox.addEventListener("click", function (e) {
      var row = e.target.closest(".cart-item");
      if (!row) return;
      var id = row.dataset.id;
      if (e.target.closest("[data-cart-remove]")) {
        if (id.indexOf("mix-") === 0) {
          var msg = window.__mvT ? window.__mvT("confirm-remove-pack") : "¿Estás seguro que deseas eliminar este item? Se eliminarán todos los productos del pack.";
          if (window.__mvConfirm) {
            window.__mvConfirm(msg).then(function (ok) { if (ok) removeFromCart(id); });
          } else if (window.confirm(msg)) {
            removeFromCart(id);
          }
        } else {
          removeFromCart(id);
        }
      }
      else if (e.target.closest("[data-cart-qty-minus]")) {
        var cur = readCart().find(function (l) { return l.id === id; });
        setQty(id, (cur ? cur.qty : 1) - 1);
      } else if (e.target.closest("[data-cart-qty-plus]")) {
        var cur2 = readCart().find(function (l) { return l.id === id; });
        setQty(id, (cur2 ? cur2.qty : 1) + 1);
      }
    });
    itemsBox.addEventListener("change", function (e) {
      if (!e.target.matches("[data-cart-qty-input]")) return;
      var row = e.target.closest(".cart-item");
      if (row) setQty(row.dataset.id, parseInt(e.target.value, 10) || 1);
    });

    // Payment method: Mercado Pago (Checkout Pro, itemized) or bank transfer (email comprobante)
    var bank = data.bank || {};
    var paymentMethod = "mercadopago";
    var paymentBtns = $$("[data-payment-btn]");
    var bankTransferBox = $("[data-bank-transfer]");
    var checkoutBtn = $("[data-checkout]");
    var cartNoteEl = $("[data-cart-note]");

    var bankNameEl = $("[data-bank-name]");
    var bankHolderEl = $("[data-bank-holder]");
    var bankCbuEl = $("[data-bank-cbu]");
    var bankAliasEl = $("[data-bank-alias]");
    if (bankNameEl) bankNameEl.textContent = bank.name || "—";
    if (bankHolderEl) bankHolderEl.textContent = bank.holder || "—";
    if (bankCbuEl) bankCbuEl.textContent = bank.cbu || "—";
    if (bankAliasEl) bankAliasEl.textContent = bank.alias || "—";

    function setPaymentMethod(method) {
      paymentMethod = method;
      paymentBtns.forEach(function (btn) {
        var active = btn.dataset.paymentBtn === method;
        btn.classList.toggle("is-active", active);
        btn.setAttribute("aria-pressed", active ? "true" : "false");
      });
      if (bankTransferBox) bankTransferBox.hidden = method !== "transferencia";
      if (checkoutBtn) {
        var labelKey = method === "transferencia" ? "btn-checkout-transfer" : "btn-checkout";
        checkoutBtn.textContent = window.__mvT ? window.__mvT(labelKey) : (method === "transferencia" ? "Enviar comprobante" : "Finalizar compra");
      }
      if (cartNoteEl) {
        var noteKey = method === "transferencia" ? "cart-note-transfer" : "cart-note";
        cartNoteEl.textContent = window.__mvT ? window.__mvT(noteKey) : cartNoteEl.textContent;
      }
    }
    paymentBtns.forEach(function (btn) {
      btn.addEventListener("click", function () { setPaymentMethod(btn.dataset.paymentBtn); });
    });

    function buildTransferEmail(cart, totals, ship) {
      var lines = cart.map(function (line) {
        var product = findProduct(line.id);
        return product ? ("- " + product.name + " x" + line.qty + ": " + money(product.price * line.qty)) : null;
      }).filter(Boolean);
      var totalLines = "Subtotal: " + money(totals.subtotal);
      if (totals.discountActive) {
        totalLines += "\nDescuento primera compra (20%): -" + money(totals.discount);
      }
      totalLines += "\nTotal: " + money(totals.total);
      var subject = "Comprobante de transferencia — Pedido Mil Volcanes";
      var body = "Hola! Les escribo para enviar el comprobante de mi pedido:\n\n" +
        lines.join("\n") + "\n\n" + totalLines +
        "\n\n(Adjuntar el comprobante de la transferencia a este email.)" +
        "\n\nDatos de envío:\n" + formatShipping(ship);
      return "mailto:" + (data.contact && data.contact.email ? data.contact.email : "info@milvolcanes.net") +
        "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    }

    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", function () {
        var cart = readCart();
        if (!cart.length) return;
        if (errorEl) errorEl.hidden = true;

        var ship = readShipping();
        if (!shippingIsComplete(ship)) {
          if (shipErrorEl) {
            shipErrorEl.hidden = false;
            shipErrorEl.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
          }
          return;
        }

        if (paymentMethod === "transferencia") {
          window.location.href = buildTransferEmail(cart, computeTotals(cart), ship);
          return;
        }

        var restingLabel = checkoutBtn.textContent;
        checkoutBtn.disabled = true;
        checkoutBtn.textContent = window.__mvT ? window.__mvT("btn-checkout-loading") : "Procesando…";

        fetch("/.netlify/functions/create-preference", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: cart, shipping: ship })
        })
          .then(function (resp) {
            return resp.json().then(function (data) { return { ok: resp.ok, data: data }; });
          })
          .then(function (result) {
            if (result.ok && result.data && result.data.init_point) {
              window.location.href = result.data.init_point;
              return;
            }
            throw new Error((result.data && result.data.error) || "No se pudo iniciar el pago.");
          })
          .catch(function (err) {
            checkoutBtn.disabled = false;
            checkoutBtn.textContent = restingLabel;
            if (errorEl) {
              errorEl.textContent = err.message || (window.__mvT ? window.__mvT("checkout-error") : "Hubo un problema al iniciar el pago. Probá de nuevo.");
              errorEl.hidden = false;
            }
          });
      });
    }

    // Post-purchase banner via ?compra=exito|error|pendiente
    var params = new URLSearchParams(window.location.search);
    var compra = params.get("compra");
    if (compra === "exito") {
      writeCart([]);
      if (window.__mvShowPostPurchase) window.__mvShowPostPurchase();
      else window.alert(window.__mvT ? window.__mvT("alert-exito") : "¡Gracias por tu compra! Te vamos a escribir por email para coordinar el envío.");
    } else if (compra === "pendiente") {
      window.alert(window.__mvT ? window.__mvT("alert-pendiente") : "Tu pago está pendiente de confirmación. Te avisamos por email en cuanto se acredite.");
    } else if (compra === "error") {
      window.alert(window.__mvT ? window.__mvT("alert-error") : "Hubo un problema con el pago. No se realizó ningún cobro — probá de nuevo.");
    }

    renderCart();
    window.__mvRenderCart = function () {
      renderCart();
      setPaymentMethod(paymentMethod);
    };
  }

  function boot() {
    safe(initSplash, "initSplash");
    safe(initPromoBadge, "initPromoBadge");
    safe(initConfirmModal, "initConfirmModal");
    safe(initPostPurchaseModal, "initPostPurchaseModal");
    safe(initNav, "initNav");
    safe(initSmoothAnchors, "initSmoothAnchors");
    safe(initReveals, "initReveals");
    safe(initSplitHeadline, "initSplitHeadline");
    safe(initContactForm, "initContactForm");
    safe(initCart, "initCart");
    safe(initSelectLabels, "initSelectLabels");
    document.documentElement.classList.add("is-ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
