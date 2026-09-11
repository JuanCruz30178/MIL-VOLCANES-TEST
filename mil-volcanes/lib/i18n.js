(function () {
  "use strict";
  var LANG_KEY = "mv_lang";
  var SUPPORTED = ["es", "en", "pt"];

  window.__I18N__ = {
  "es": {
    "skip-link": "Saltar al contenido",
    "nav-historia": "Historia",
    "nav-terroir": "Terroir",
    "nav-payunia": "La Payunia",
    "nav-vinos": "Vinos",
    "nav-bodega": "Bodega",
    "nav-contacto": "Contacto",
    "nav-cta": "Solicitar cotización",
    "hero-copy": "Un proyecto familiar y exportador, fruto de más de diez años de estudio, trabajo y perseverancia: una línea exclusiva de vinos premium, auténtica y fiel al terroir de Mendoza.",
    "hero-btn-discover": "Descubrir los vinos",
    "hero-scroll": "Scroll",
    "historia-kicker": "Somos Mil Volcanes",
    "historia-h2": "Espíritu libre, entusiasta y soñador.",
    "historia-lede": "Nos mueve la energía de la naturaleza.",
    "historia-figcaption": "Reserva Natural La Payunia, Malargüe, sur de Mendoza",
    "historia-p1": "De espíritu libre, entusiastas, emprendedores y soñadores, así creamos <strong>Mil Volcanes</strong>: un proyecto familiar y exportador que nació de más de diez años de estudio, trabajo, pasión y perseverancia.",
    "historia-p2": "Nuestro objetivo fue desarrollar una línea exclusiva de vinos premium, auténtica, única y fresca, llena de magia volcánica, que invita a descubrir la Reserva Natural La Payunia, en el sur de Mendoza.",
    "historia-p3": "Nuestros vinos reflejan el trabajo integral en equipo, la búsqueda de sofisticación y la fiel expresión de nuestro maravilloso terroir: Mendoza.",
    "founder-role": "Co-Founder",
    "terroir-kicker": "Terroir",
    "terroir-h2": "Donde la montaña escribe el suelo.",
    "terroir-p1": "Nuestros terruños en el Valle de Uco se definen por la cercanía a la montaña: la majestuosa Cordillera de los Andes. Ella nos regala el clima semidesértico de Mendoza, las piedras de nuestros suelos y esa altura extrema tan característica de nuestro terroir.",
    "terroir-p2": "Trabajamos fincas de altura en Alto Agrelo (Luján de Cuyo) y en distintos rincones del Valle de Uco, como Vista Flores, Los Sauces, Los Chacayes y Los Árboles, cada una aportando una expresión distinta de Malbec, Cabernet Sauvignon, Cabernet Franc y Sauvignon Blanc.",
    "unit-msnm": "msnm",
    "payunia-kicker": "La Payunia",
    "payunia-h2": "Cada etiqueta lleva el dibujo de este volcán.",
    "payunia-body": "Un desierto de más de ochocientos volcanes en el sur de Mendoza: el paisaje que le dio nombre y espíritu a Mil Volcanes.",
    "payunia-cta": "Recorrer la reserva →",
    "bodega-kicker": "La Bodega",
    "bodega-h2": "Tradición y tecnología en Vistalba.",
    "bodega-body": "La bodega se localiza en Vistalba, Luján de Cuyo, y posee la más alta tecnología para la elaboración de vinos de alta gama.",
    "coleccion-kicker": "Nuestros vinos",
    "line-premium-title": "Línea Premium Blends",
    "line-premium-copy": "Vinos jóvenes, vibrantes y vivaces, de gran intensidad aromática, frutados, versátiles y muy frescos.",
    "line-badge-premium": "Presentación <b>6&nbsp;·&nbsp;750&nbsp;ml</b>",
    "note-sauvblanc-torrontes": "Cremoso y afrutado: jazmín, flor de naranjo, cítricos y melón, con un final suave y refrescante. Servir 10–12°C.",
    "note-malbec-bonarda": "Vibrante y dinámico: cerezas, ciruelas, frambuesas y violetas, con taninos suaves y un final largo. Servir 16–18°C.",
    "note-cabsauv-merlot": "Moras, ciruelas y pimiento verde, taninos redondos y untuosos, final persistente y elegante. Servir 16–18°C.",
    "note-sv-malbec": "El poder y la energía de un volcán: ciruelas, frambuesas maduras, violetas y notas balsámicas con vainilla de barrica. Concentrado y persistente.",
    "note-sv-cabfranc": "Rojo rubí intenso: pimiento asado, tomate deshidratado, chocolate y cuero de su paso por roble. Taninos redondos, final persistente.",
    "btn-add-cart": "Agregar al carrito",
    "wine-cta-wholesale": "Consulta por mayor →",
    "line-sv-title": "Línea Single Vineyard",
    "line-sv-copy": "Vinos de gran intensidad aromática, concentración y elegancia. Carácter, estructura y sofisticación, con crianza en roble francés por 10 meses.",
    "line-badge-sv": "Presentación <b>6&nbsp;·&nbsp;750&nbsp;ml</b>",
    "ventas-kicker": "Ventas &amp; Exportación",
    "ventas-h2": "Llevamos Mendoza al mundo.",
    "ventas-body": "Somos una bodega familiar y exportadora. Si representás una importadora, distribuidora, restaurante o wine shop y querés sumar Mil Volcanes a tu portfolio, escribinos: te respondemos personalmente.",
    "ventas-contact-title": "Contacto directo",
    "form-label-nombre": "Nombre y apellido",
    "form-label-empresa": "Empresa",
    "form-label-pais": "País",
    "form-label-interes": "Tipo de consulta",
    "opt-distribucion": "Distribución / Importación",
    "opt-retail": "Wine shop / Retail",
    "opt-restaurante": "Restaurante / Hotelería",
    "opt-eventos": "Eventos",
    "opt-otra": "Otra consulta",
    "form-label-mensaje": "Mensaje",
    "btn-enviar": "Enviar consulta",
    "form-success-title": "Gracias por escribirnos.",
    "form-success-body": "Se abrió tu cliente de correo con la consulta lista para enviar.",
    "footer-tag": "Bodega familiar y exportadora. Vinos premium de Mendoza, Argentina, inspirados en la Reserva Natural La Payunia, Malargüe.",
    "footer-nav-title": "Navegación",
    "footer-contact-title": "Contacto",
    "footer-rights": "Mil Volcanes. Todos los derechos reservados.",
    "cart-title": "Tu carrito",
    "cart-empty-html": "Todavía no agregaste vinos. Elegí alguno en <a href=\"#coleccion\" data-cart-close-link>la colección</a>.",
    "cart-total-label": "Total",
    "btn-checkout": "Finalizar compra",
    "cart-note": "Pago seguro con Mercado Pago. Envíos a coordinar por email tras la compra.",
    "cart-each": "c/u",
    "cart-remove": "Quitar",
    "alert-exito": "¡Gracias por tu compra! Te vamos a escribir por email para coordinar el envío.",
    "alert-pendiente": "Tu pago está pendiente de confirmación. Te avisamos por email en cuanto se acredite.",
    "alert-error": "Hubo un problema con el pago. No se realizó ningún cobro — probá de nuevo.",
    "meta-title": "Mil Volcanes — Vinos de altura de Mendoza, Argentina",
    "meta-description": "Mil Volcanes es una bodega familiar de Mendoza, Argentina. Vinos premium de Malbec, Cabernet Sauvignon y Cabernet Franc nacidos junto a la Reserva Natural La Payunia. Solicitá cotización para distribución y exportación.",
    "age-gate-text1": "Para poder navegar este sitio, debes tener la edad legal para consumir alcohol en tu país de residencia.",
    "age-gate-text2": "Al presionar el botón «SÍ», certificás que cumplís con la edad legal.",
    "age-gate-yes": "SÍ",
    "age-gate-no": "NO",
    "age-gate-no-msg": "Para navegar este sitio debes tener la edad legal para consumir alcohol.",
    "promo-bar": "Envío gratis a todo el país a partir de 6 botellas <span class=\"promo-bar-note\">(excepto Tierra del Fuego)</span>",
    "case-badge": "Caja x 6",
    "mix-premium-title": "Caja Mixta Premium Blends",
    "mix-premium-note": "2 botellas de cada: Sauvignon Blanc & Torrontés, Malbec & Bonarda y Cabernet Sauvignon & Merlot.",
    "mix-sv-title": "Caja Mixta Single Vineyard",
    "mix-sv-origin": "Selección de nuestra línea Single Vineyard",
    "mix-sv-note": "3 botellas de Malbec y 3 de Cabernet Franc.",
    "mix-origin": "Selección de nuestras tres etiquetas",
    "promo-badge-text": "20% OFF por primera compra"
  },
  "en": {
    "skip-link": "Skip to content",
    "nav-historia": "Our Story",
    "nav-terroir": "Terroir",
    "nav-payunia": "La Payunia",
    "nav-vinos": "Wines",
    "nav-bodega": "Winery",
    "nav-contacto": "Contact",
    "nav-cta": "Request a Quote",
    "hero-copy": "A family-run, export-driven project, the result of more than ten years of study, work and perseverance: an exclusive line of premium wines, authentic and true to the terroir of Mendoza.",
    "hero-btn-discover": "Discover the Wines",
    "hero-scroll": "Scroll",
    "historia-kicker": "We Are Mil Volcanes",
    "historia-h2": "Free-spirited, enthusiastic and dreaming.",
    "historia-lede": "We're driven by the energy of nature.",
    "historia-figcaption": "La Payunia Natural Reserve, Malargüe, southern Mendoza",
    "historia-p1": "Free-spirited, enthusiastic, entrepreneurial and dreaming — that's how we created <strong>Mil Volcanes</strong>: a family-run, export-driven project born from more than ten years of study, work, passion and perseverance.",
    "historia-p2": "Our goal was to develop an exclusive line of premium wines — authentic, unique and fresh, full of volcanic magic — that invites you to discover the La Payunia Natural Reserve in southern Mendoza.",
    "historia-p3": "Our wines reflect thorough teamwork, a pursuit of sophistication and the true expression of our wonderful terroir: Mendoza.",
    "founder-role": "Co-Founder",
    "terroir-kicker": "Terroir",
    "terroir-h2": "Where the mountain writes the soil.",
    "terroir-p1": "Our vineyard sites in the Valle de Uco are defined by their closeness to the mountains: the majestic Andes range. It gives us Mendoza's semi-desert climate, the stones in our soils and the extreme altitude so characteristic of our terroir.",
    "terroir-p2": "We work high-altitude vineyards in Alto Agrelo (Luján de Cuyo) and various corners of the Valle de Uco, such as Vista Flores, Los Sauces, Los Chacayes and Los Árboles, each contributing a distinct expression of Malbec, Cabernet Sauvignon, Cabernet Franc and Sauvignon Blanc.",
    "unit-msnm": "masl",
    "payunia-kicker": "La Payunia",
    "payunia-h2": "Every label carries the drawing of this volcano.",
    "payunia-body": "A desert of more than eight hundred volcanoes in southern Mendoza: the landscape that gave Mil Volcanes its name and spirit.",
    "payunia-cta": "Explore the Reserve →",
    "bodega-kicker": "The Winery",
    "bodega-h2": "Tradition and technology in Vistalba.",
    "bodega-body": "The winery is located in Vistalba, Luján de Cuyo, and features state-of-the-art technology for crafting high-end wines.",
    "coleccion-kicker": "Our Wines",
    "line-premium-title": "Premium Blends Line",
    "line-premium-copy": "Young, vibrant and lively wines, with great aromatic intensity, fruity, versatile and very fresh.",
    "line-badge-premium": "Case of <b>6&nbsp;·&nbsp;750&nbsp;ml</b>",
    "note-sauvblanc-torrontes": "Creamy and fruity: jasmine, orange blossom, citrus and melon, with a smooth, refreshing finish. Serve at 50–54°F.",
    "note-malbec-bonarda": "Vibrant and dynamic: cherries, plums, raspberries and violets, with soft tannins and a long finish. Serve at 61–64°F.",
    "note-cabsauv-merlot": "Blackberries, plums and green pepper, round and velvety tannins, a persistent, elegant finish. Serve at 61–64°F.",
    "note-sv-malbec": "The power and energy of a volcano: plums, ripe raspberries, violets and balsamic notes with barrel vanilla. Concentrated and persistent.",
    "note-sv-cabfranc": "Intense ruby red: roasted pepper, sun-dried tomato, chocolate and leather from its time in oak. Round tannins, persistent finish.",
    "btn-add-cart": "Add to Cart",
    "wine-cta-wholesale": "Wholesale Inquiries →",
    "line-sv-title": "Single Vineyard Line",
    "line-sv-copy": "Wines of great aromatic intensity, concentration and elegance. Character, structure and sophistication, aged in French oak for 10 months.",
    "line-badge-sv": "Case of <b>6&nbsp;·&nbsp;750&nbsp;ml</b>",
    "ventas-kicker": "Sales &amp; Export",
    "ventas-h2": "We bring Mendoza to the world.",
    "ventas-body": "We are a family-run, export-focused winery. If you represent an importer, distributor, restaurant or wine shop and want to add Mil Volcanes to your portfolio, write to us — we'll respond personally.",
    "ventas-contact-title": "Direct Contact",
    "form-label-nombre": "Full Name",
    "form-label-empresa": "Company",
    "form-label-pais": "Country",
    "form-label-interes": "Type of Inquiry",
    "opt-distribucion": "Distribution / Import",
    "opt-retail": "Wine Shop / Retail",
    "opt-restaurante": "Restaurant / Hospitality",
    "opt-eventos": "Events",
    "opt-otra": "Other Inquiry",
    "form-label-mensaje": "Message",
    "btn-enviar": "Send Inquiry",
    "form-success-title": "Thank you for reaching out.",
    "form-success-body": "Your email client has opened with the inquiry ready to send.",
    "footer-tag": "A family-run, export-focused winery. Premium wines from Mendoza, Argentina, inspired by the La Payunia Natural Reserve, Malargüe.",
    "footer-nav-title": "Navigation",
    "footer-contact-title": "Contact",
    "footer-rights": "Mil Volcanes. All rights reserved.",
    "cart-title": "Your Cart",
    "cart-empty-html": "You haven't added any wines yet. Choose one from <a href=\"#coleccion\" data-cart-close-link>the collection</a>.",
    "cart-total-label": "Total",
    "btn-checkout": "Complete Purchase",
    "cart-note": "Secure payment with Mercado Pago. Shipping arranged by email after purchase.",
    "cart-each": "each",
    "cart-remove": "Remove",
    "alert-exito": "Thank you for your purchase! We'll email you to coordinate shipping.",
    "alert-pendiente": "Your payment is pending confirmation. We'll notify you by email once it's confirmed.",
    "alert-error": "There was a problem with the payment. No charge was made — please try again.",
    "meta-title": "Mil Volcanes — High-Altitude Wines from Mendoza, Argentina",
    "meta-description": "Mil Volcanes is a family-run winery in Mendoza, Argentina. Premium Malbec, Cabernet Sauvignon and Cabernet Franc wines born next to the La Payunia Natural Reserve. Request a quote for distribution and export.",
    "age-gate-text1": "To browse this site, you must be of legal drinking age in your country of residence.",
    "age-gate-text2": "By pressing “YES”, you certify that you meet the legal age requirement.",
    "age-gate-yes": "YES",
    "age-gate-no": "NO",
    "age-gate-no-msg": "You must be of legal drinking age to browse this site.",
    "promo-bar": "Free shipping nationwide on orders of 6+ bottles <span class=\"promo-bar-note\">(except Tierra del Fuego)</span>",
    "case-badge": "Case of 6",
    "mix-premium-title": "Premium Blends Mixed Case",
    "mix-premium-note": "2 bottles of each: Sauvignon Blanc & Torrontés, Malbec & Bonarda and Cabernet Sauvignon & Merlot.",
    "mix-sv-title": "Single Vineyard Mixed Case",
    "mix-sv-origin": "A selection of our Single Vineyard line",
    "mix-sv-note": "3 bottles of Malbec and 3 of Cabernet Franc.",
    "mix-origin": "A selection of our three labels",
    "promo-badge-text": "20% OFF on your first order"
  },
  "pt": {
    "skip-link": "Pular para o conteúdo",
    "nav-historia": "Nossa História",
    "nav-terroir": "Terroir",
    "nav-payunia": "La Payunia",
    "nav-vinos": "Vinhos",
    "nav-bodega": "Vinícola",
    "nav-contacto": "Contato",
    "nav-cta": "Solicitar Cotação",
    "hero-copy": "Um projeto familiar e exportador, fruto de mais de dez anos de estudo, trabalho e perseverança: uma linha exclusiva de vinhos premium, autêntica e fiel ao terroir de Mendoza.",
    "hero-btn-discover": "Descobrir os Vinhos",
    "hero-scroll": "Scroll",
    "historia-kicker": "Somos Mil Volcanes",
    "historia-h2": "Espírito livre, entusiasta e sonhador.",
    "historia-lede": "Nos move a energia da natureza.",
    "historia-figcaption": "Reserva Natural La Payunia, Malargüe, sul de Mendoza",
    "historia-p1": "De espírito livre, entusiastas, empreendedores e sonhadores, assim criamos <strong>Mil Volcanes</strong>: um projeto familiar e exportador que nasceu de mais de dez anos de estudo, trabalho, paixão e perseverança.",
    "historia-p2": "Nosso objetivo foi desenvolver uma linha exclusiva de vinhos premium, autêntica, única e fresca, cheia de magia vulcânica, que convida a descobrir a Reserva Natural La Payunia, no sul de Mendoza.",
    "historia-p3": "Nossos vinhos refletem o trabalho integral em equipe, a busca pela sofisticação e a fiel expressão do nosso maravilhoso terroir: Mendoza.",
    "founder-role": "Cofundador(a)",
    "terroir-kicker": "Terroir",
    "terroir-h2": "Onde a montanha escreve o solo.",
    "terroir-p1": "Nossos terroirs no Valle de Uco se definem pela proximidade com a montanha: a majestosa Cordilheira dos Andes. Ela nos presenteia com o clima semidesértico de Mendoza, as pedras dos nossos solos e essa altitude extrema tão característica do nosso terroir.",
    "terroir-p2": "Trabalhamos com propriedades de altitude em Alto Agrelo (Luján de Cuyo) e em diferentes cantos do Valle de Uco, como Vista Flores, Los Sauces, Los Chacayes e Los Árboles, cada uma contribuindo com uma expressão distinta de Malbec, Cabernet Sauvignon, Cabernet Franc e Sauvignon Blanc.",
    "unit-msnm": "m alt.",
    "payunia-kicker": "La Payunia",
    "payunia-h2": "Cada rótulo carrega o desenho deste vulcão.",
    "payunia-body": "Um deserto de mais de oitocentos vulcões no sul de Mendoza: a paisagem que deu nome e espírito a Mil Volcanes.",
    "payunia-cta": "Explorar a Reserva →",
    "bodega-kicker": "A Vinícola",
    "bodega-h2": "Tradição e tecnologia em Vistalba.",
    "bodega-body": "A vinícola está localizada em Vistalba, Luján de Cuyo, e possui a mais alta tecnologia para a elaboração de vinhos de alta gama.",
    "coleccion-kicker": "Nossos Vinhos",
    "line-premium-title": "Linha Premium Blends",
    "line-premium-copy": "Vinhos jovens, vibrantes e vivazes, de grande intensidade aromática, frutados, versáteis e muito frescos.",
    "line-badge-premium": "Caixa de <b>6&nbsp;·&nbsp;750&nbsp;ml</b>",
    "note-sauvblanc-torrontes": "Cremoso e frutado: jasmim, flor de laranjeira, cítricos e melão, com um final suave e refrescante. Servir a 10–12°C.",
    "note-malbec-bonarda": "Vibrante e dinâmico: cerejas, ameixas, framboesas e violetas, com taninos suaves e um final longo. Servir a 16–18°C.",
    "note-cabsauv-merlot": "Amoras, ameixas e pimentão verde, taninos redondos e untuosos, final persistente e elegante. Servir a 16–18°C.",
    "note-sv-malbec": "O poder e a energia de um vulcão: ameixas, framboesas maduras, violetas e notas balsâmicas com baunilha de barrica. Concentrado e persistente.",
    "note-sv-cabfranc": "Vermelho rubi intenso: pimentão assado, tomate desidratado, chocolate e couro de sua passagem por carvalho. Taninos redondos, final persistente.",
    "btn-add-cart": "Adicionar ao Carrinho",
    "wine-cta-wholesale": "Consulta por Atacado →",
    "line-sv-title": "Linha Single Vineyard",
    "line-sv-copy": "Vinhos de grande intensidade aromática, concentração e elegância. Caráter, estrutura e sofisticação, com envelhecimento em carvalho francês por 10 meses.",
    "line-badge-sv": "Caixa de <b>6&nbsp;·&nbsp;750&nbsp;ml</b>",
    "ventas-kicker": "Vendas &amp; Exportação",
    "ventas-h2": "Levamos Mendoza para o mundo.",
    "ventas-body": "Somos uma vinícola familiar e exportadora. Se você representa uma importadora, distribuidora, restaurante ou loja de vinhos e quer adicionar a Mil Volcanes ao seu portfólio, escreva para nós: respondemos pessoalmente.",
    "ventas-contact-title": "Contato Direto",
    "form-label-nombre": "Nome Completo",
    "form-label-empresa": "Empresa",
    "form-label-pais": "País",
    "form-label-interes": "Tipo de Consulta",
    "opt-distribucion": "Distribuição / Importação",
    "opt-retail": "Loja de Vinhos / Varejo",
    "opt-restaurante": "Restaurante / Hotelaria",
    "opt-eventos": "Eventos",
    "opt-otra": "Outra Consulta",
    "form-label-mensaje": "Mensagem",
    "btn-enviar": "Enviar Consulta",
    "form-success-title": "Obrigado por nos escrever.",
    "form-success-body": "Seu cliente de e-mail foi aberto com a consulta pronta para enviar.",
    "footer-tag": "Vinícola familiar e exportadora. Vinhos premium de Mendoza, Argentina, inspirados na Reserva Natural La Payunia, Malargüe.",
    "footer-nav-title": "Navegação",
    "footer-contact-title": "Contato",
    "footer-rights": "Mil Volcanes. Todos os direitos reservados.",
    "cart-title": "Seu Carrinho",
    "cart-empty-html": "Você ainda não adicionou vinhos. Escolha um na <a href=\"#coleccion\" data-cart-close-link>coleção</a>.",
    "cart-total-label": "Total",
    "btn-checkout": "Finalizar Compra",
    "cart-note": "Pagamento seguro com Mercado Pago. Envio a combinar por e-mail após a compra.",
    "cart-each": "cada",
    "cart-remove": "Remover",
    "alert-exito": "Obrigado pela sua compra! Vamos escrever para você por e-mail para combinar o envio.",
    "alert-pendiente": "Seu pagamento está pendente de confirmação. Avisaremos por e-mail assim que for confirmado.",
    "alert-error": "Houve um problema com o pagamento. Nenhuma cobrança foi realizada — tente novamente.",
    "meta-title": "Mil Volcanes — Vinhos de Altitude de Mendoza, Argentina",
    "meta-description": "Mil Volcanes é uma vinícola familiar de Mendoza, Argentina. Vinhos premium de Malbec, Cabernet Sauvignon e Cabernet Franc nascidos ao lado da Reserva Natural La Payunia. Solicite uma cotação para distribuição e exportação.",
    "age-gate-text1": "Para navegar neste site, você deve ter a idade legal para consumir álcool em seu país de residência.",
    "age-gate-text2": "Ao pressionar o botão «SIM», você certifica que atende à idade legal exigida.",
    "age-gate-yes": "SIM",
    "age-gate-no": "NÃO",
    "age-gate-no-msg": "Você precisa ter a idade legal para navegar neste site.",
    "promo-bar": "Frete grátis para todo o país a partir de 6 garrafas <span class=\"promo-bar-note\">(exceto Tierra del Fuego)</span>",
    "case-badge": "Caixa x 6",
    "mix-premium-title": "Caixa Mista Premium Blends",
    "mix-premium-note": "2 garrafas de cada: Sauvignon Blanc & Torrontés, Malbec & Bonarda e Cabernet Sauvignon & Merlot.",
    "mix-sv-title": "Caixa Mista Single Vineyard",
    "mix-sv-origin": "Seleção da nossa linha Single Vineyard",
    "mix-sv-note": "3 garrafas de Malbec e 3 de Cabernet Franc.",
    "mix-origin": "Uma seleção dos nossos três rótulos",
    "promo-badge-text": "20% OFF na primeira compra"
  }
};

  function getSavedLang() {
    try {
      var v = window.localStorage.getItem(LANG_KEY);
      if (v && SUPPORTED.indexOf(v) !== -1) return v;
    } catch (e) {}
    return "es";
  }

  window.__LANG__ = getSavedLang();

  window.__mvT = function (key) {
    var dict = window.__I18N__[window.__LANG__] || window.__I18N__.es;
    return (dict && Object.prototype.hasOwnProperty.call(dict, key)) ? dict[key] : key;
  };

  function applyI18n(lang) {
    if (SUPPORTED.indexOf(lang) === -1) lang = "es";
    window.__LANG__ = lang;
    try { window.localStorage.setItem(LANG_KEY, lang); } catch (e) {}

    var dict = window.__I18N__[lang] || window.__I18N__.es;
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.classList.toggle("hide-promo-bar", lang !== "es");

    var nodes = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < nodes.length; i++) {
      var key = nodes[i].getAttribute("data-i18n");
      if (dict && Object.prototype.hasOwnProperty.call(dict, key)) {
        nodes[i].innerHTML = dict[key];
      }
    }

    var titleEl = document.querySelector("[data-i18n-title]");
    if (titleEl && dict["meta-title"]) titleEl.textContent = dict["meta-title"];
    var descEl = document.querySelector("[data-i18n-desc]");
    if (descEl && dict["meta-description"]) descEl.setAttribute("content", dict["meta-description"]);

    var btns = document.querySelectorAll("[data-lang-btn]");
    for (var b = 0; b < btns.length; b++) {
      var isActive = btns[b].getAttribute("data-lang-btn") === lang;
      btns[b].setAttribute("aria-pressed", isActive ? "true" : "false");
    }

    if (typeof window.__mvRenderCart === "function") {
      try { window.__mvRenderCart(); } catch (e) {}
    }
  }
  window.__mvApplyI18n = applyI18n;

  function initLangSwitcher() {
    var btns = document.querySelectorAll("[data-lang-btn]");
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener("click", function () {
        applyI18n(this.getAttribute("data-lang-btn"));
      });
    }
    applyI18n(window.__LANG__);
  }

  function initAgeGate() {
    var gate = document.getElementById("age-gate");
    if (!gate) return;
    var KEY = "mv_age_ok";
    var ok = false;
    try { ok = window.localStorage.getItem(KEY) === "1"; } catch (e) {}
    if (ok) { gate.hidden = true; return; }
    document.body.style.overflow = "hidden";
    var yes = gate.querySelector("[data-age-yes]");
    var no = gate.querySelector("[data-age-no]");
    if (yes) yes.addEventListener("click", function () {
      try { window.localStorage.setItem(KEY, "1"); } catch (e) {}
      gate.hidden = true;
      document.body.style.overflow = "";
    });
    if (no) no.addEventListener("click", function () {
      window.location.href = "https://www.google.com";
    });
  }

  function initEarly() {
    initLangSwitcher();
    initAgeGate();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initEarly);
  } else {
    initEarly();
  }
})();
