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

  function initCart() {
    var overlay = $("[data-cart-overlay]");
    var drawer = $("[data-cart-drawer]");
    var itemsBox = $("[data-cart-items]");
    var emptyMsg = $("[data-cart-empty]");
    var footBox = $("[data-cart-foot]");
    var totalEl = $("[data-cart-total]");
    var countEl = $("[data-cart-count]");
    var errorEl = $("[data-cart-error]");
    if (!drawer || !overlay) return;

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

      var total = 0;
      cart.forEach(function (line) {
        var product = findProduct(line.id);
        if (!product) return;
        var lineTotal = product.price * line.qty;
        total += lineTotal;

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

      if (totalEl) totalEl.textContent = money(total);
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
      if (e.target.closest("[data-cart-remove]")) removeFromCart(id);
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

    // Checkout -> Mercado Pago (link de pago)
    var MP_LINK = "https://link.mercadopago.com.ar/milvolcaneswines";
    var checkoutBtn = $("[data-checkout]");
    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", function () {
        var cart = readCart();
        if (!cart.length) return;
        if (errorEl) errorEl.hidden = true;
        window.location.href = MP_LINK;
      });
    }

    // Post-purchase banner via ?compra=exito|error|pendiente
    var params = new URLSearchParams(window.location.search);
    var compra = params.get("compra");
    if (compra === "exito") {
      writeCart([]);
      window.alert(window.__mvT ? window.__mvT("alert-exito") : "¡Gracias por tu compra! Te vamos a escribir por email para coordinar el envío.");
    } else if (compra === "pendiente") {
      window.alert(window.__mvT ? window.__mvT("alert-pendiente") : "Tu pago está pendiente de confirmación. Te avisamos por email en cuanto se acredite.");
    } else if (compra === "error") {
      window.alert(window.__mvT ? window.__mvT("alert-error") : "Hubo un problema con el pago. No se realizó ningún cobro — probá de nuevo.");
    }

    renderCart();
    window.__mvRenderCart = renderCart;
  }

  function boot() {
    safe(initSplash, "initSplash");
    safe(initNav, "initNav");
    safe(initSmoothAnchors, "initSmoothAnchors");
    safe(initReveals, "initReveals");
    safe(initSplitHeadline, "initSplitHeadline");
    safe(initContactForm, "initContactForm");
    safe(initCart, "initCart");
    document.documentElement.classList.add("is-ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
