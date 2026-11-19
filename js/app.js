/* 82567.com — shared layout, consent, forms (vanilla JS) */
(function () {
  'use strict';
  function rv(s) { return s.split('').reverse().join(''); }
  var MAIL = [rv('moc.liamg'), '@', rv('1askrowbew')].reverse().join('');
  var BIZ = rv('tcatnoc/skrow.bew//:sptth');
  var NAV = [['index.html', 'Home'], ['calculators.html', 'Calculators'], ['numbers.html', 'Number Explorer'], ['guides.html', 'Guides'], ['videos.html', 'Videos'], ['get-quote.html', 'Get Expert Help'], ['support.html', 'Support & Contests']];
  var page = (location.pathname.split('/').pop() || 'index.html');

  function header() {
    var links = NAV.map(function (n) { return '<a href="' + n[0] + '"' + (n[0] === page ? ' aria-current="page"' : '') + '>' + n[1] + '</a>'; }).join('');
    return '<div class="topbar"><a href="#" data-biz>📩 Contact, if you are interested in this website / domain name / Sponsorship / Advertisement / Partnership</a></div>' +
      '<header class="site-h"><div class="wrap hrow"><a class="logo" href="index.html" aria-label="82567 home"><span class="lg">82<i>567</i></span><small>Prime Calculators</small></a>' +
      '<nav class="nav" id="nav">' + links + '</nav><div class="hact"><select id="cur" aria-label="Currency"><option>USD</option><option>CAD</option><option>EUR</option><option>GBP</option><option>INR</option><option>AUD</option></select>' +
      '<button class="icon" id="theme" aria-label="Toggle dark mode">🌓</button><button class="icon burger" id="burger" aria-label="Menu" aria-expanded="false">☰</button></div></div></header>';
  }
  function footer() {
    return '<footer class="site-f"><div class="wrap fgrid">' +
      '<div><a class="logo" href="index.html"><span class="lg">82<i>567</i></span></a><p>Free, fast, private calculators for money, business, AI and everyday numbers. Named after 82,567 — a prime number, because good math should be indivisible.</p>' +
      '<form class="nl" data-form="Newsletter"><input type="email" name="email" placeholder="Your email" required aria-label="Email"><input type="text" name="_honey" class="hp" tabindex="-1" autocomplete="off"><button class="btn sm">Get weekly money math</button><p class="fmsg" role="status"></p></form></div>' +
      '<div><h4>Calculators</h4><a href="calculators.html#loan">Loan / EMI</a><a href="calculators.html#mortgage">Mortgage</a><a href="calculators.html#compound">Compound interest</a><a href="calculators.html#break-even">Break-even</a><a href="calculators.html#llm-cost">LLM API cost</a></div>' +
      '<div><h4>Company</h4><a href="about.html">About</a><a href="contact.html">Contact</a><a href="get-quote.html">Get expert help</a><a href="support.html#donate">Donate</a><a href="support.html#careers">Careers</a><a href="support.html#contest">Contests</a></div>' +
      '<div><h4>Legal</h4><a href="privacy.html">Privacy Policy</a><a href="terms.html">Terms of Use</a><a href="disclaimer.html">Disclaimer & Trademark</a><a href="#" id="cookie-settings">Cookie settings</a><a href="sitemap.xml">Sitemap</a></div>' +
      '</div><div class="wrap fine">© ' + new Date().getFullYear() + ' 82567.com. All rights reserved. Calculators provide estimates for educational purposes and are not financial, legal, tax or medical advice. “82567” is used here only as a domain name; no affiliation with any company, product or trademark that uses the same digits is implied.</div></footer>' +
      '<div class="consent" id="consent" hidden><p>We use cookies for analytics and to show ads (Google AdSense). Ad partners may use cookies to personalize ads. <a href="privacy.html">Learn more</a>.</p><div><button class="btn sm" data-consent="all">Accept</button><button class="btn ghost sm" data-consent="essential">Essential only</button></div></div>' +
      '<button class="totop" id="totop" aria-label="Back to top">↑</button>';
  }

  function post(form) {
    var msg = form.querySelector('.fmsg'), data = {};
    new FormData(form).forEach(function (v, k) { data[k] = data[k] ? data[k] + ', ' + v : v; });
    if (data._honey) return;
    delete data._honey;
    data._subject = '82567.com — ' + (form.dataset.form || 'Form') + ' submission';
    data._template = 'table'; data._captcha = 'false'; data.page = location.href;
    var btn = form.querySelector('button[type=submit],button:not([type])'); if (btn) btn.disabled = true;
    if (msg) { msg.className = 'fmsg'; msg.textContent = 'Sending…'; }
    fetch('https://formsubmit.co/ajax/' + MAIL, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) })
      .then(function (r) { return r.json(); })
      .then(function (r) {
        if (r && (r.success === true || r.success === 'true')) { form.reset(); if (msg) { msg.className = 'fmsg ok'; msg.textContent = form.dataset.ok || '✅ Thank you! We received your message and will reply within 1–2 business days.'; } if (form.dataset.after) location.hash = form.dataset.after; }
        else throw new Error();
      })
      .catch(function () { if (msg) { msg.className = 'fmsg err'; msg.textContent = 'Something went wrong. Please try again in a minute.'; } })
      .then(function () { if (btn) btn.disabled = false; });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var h = document.getElementById('hdr'), f = document.getElementById('ftr');
    if (h) h.outerHTML = header();
    if (f) f.outerHTML = footer();
    document.querySelectorAll('[data-biz]').forEach(function (a) { a.href = BIZ; a.target = '_blank'; a.rel = 'noopener'; });

    var root = document.documentElement, th = null; try { th = localStorage.getItem('theme'); } catch (e) {}
    if (th) root.dataset.theme = th;
    document.getElementById('theme').onclick = function () { var t = root.dataset.theme === 'dark' ? 'light' : 'dark'; root.dataset.theme = t; try { localStorage.setItem('theme', t); } catch (e) {} };
    var cur = document.getElementById('cur'); try { cur.value = localStorage.getItem('cur') || 'USD'; } catch (e) {}
    cur.onchange = function () { try { localStorage.setItem('cur', cur.value); } catch (e) {} location.reload(); };
    var bg = document.getElementById('burger'), nav = document.getElementById('nav');
    bg.onclick = function () { var o = nav.classList.toggle('open'); bg.setAttribute('aria-expanded', o); };

    var c = document.getElementById('consent'), k = null; try { k = localStorage.getItem('consent'); } catch (e) {}
    if (!k) c.hidden = false;
    c.addEventListener('click', function (e) { var b = e.target.closest('[data-consent]'); if (!b) return; try { localStorage.setItem('consent', b.dataset.consent); } catch (x) {} c.hidden = true;
      if (b.dataset.consent === 'essential') { (window.adsbygoogle = window.adsbygoogle || []).requestNonPersonalizedAds = 1; } });
    document.getElementById('cookie-settings').onclick = function (e) { e.preventDefault(); c.hidden = false; };
    try { if (localStorage.getItem('consent') === 'essential') (window.adsbygoogle = window.adsbygoogle || []).requestNonPersonalizedAds = 1; } catch (e) {}

    var tt = document.getElementById('totop'); window.addEventListener('scroll', function () { tt.classList.toggle('show', scrollY > 600); }, { passive: true }); tt.onclick = function () { scrollTo({ top: 0, behavior: 'smooth' }); };

    document.addEventListener('submit', function (e) { var fm = e.target.closest('form[data-form]'); if (!fm) return; e.preventDefault(); if (!fm.checkValidity()) { fm.reportValidity(); return; } post(fm); });

    /* multi-step lead form */
    document.querySelectorAll('.steps').forEach(function (fm) {
      var steps = fm.querySelectorAll('.step'), bar = fm.querySelector('.bar i'), i = 0;
      function show(n) { steps.forEach(function (s, j) { s.hidden = j !== n; }); if (bar) bar.style.width = ((n + 1) / steps.length * 100) + '%'; i = n; }
      fm.addEventListener('click', function (e) {
        if (e.target.closest('[data-next]')) { var ok = true; steps[i].querySelectorAll('input,select,textarea').forEach(function (x) { if (!x.checkValidity()) { x.reportValidity(); ok = false; } }); if (ok) show(Math.min(i + 1, steps.length - 1)); }
        if (e.target.closest('[data-prev]')) show(Math.max(i - 1, 0));
      });
      var topic = new URLSearchParams(location.search).get('topic'); if (topic && fm.elements.details) fm.elements.details.value = 'I was using the ' + topic + ' and need help with: ';
      show(0);
    });

    /* donation amount chips */
    document.querySelectorAll('[data-amt]').forEach(function (b) { b.addEventListener('click', function () { var t = document.getElementById(b.dataset.target || 'don-amount'); if (t) t.value = b.dataset.amt; document.querySelectorAll('[data-amt]').forEach(function (x) { x.classList.toggle('on', x === b); }); }); });

    /* lite YouTube embeds */
    document.querySelectorAll('.yt').forEach(function (y) {
      y.style.backgroundImage = 'url(https://i.ytimg.com/vi/' + y.dataset.id + '/hqdefault.jpg)';
      y.addEventListener('click', function () { y.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + y.dataset.id + '?autoplay=1&rel=0" title="' + (y.dataset.title || 'Video') + '" allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowfullscreen loading="lazy"></iframe>'; }, { once: true });
    });

    /* home quick search */
    var qs = document.getElementById('quick');
    if (qs && window.P82567) {
      var list = document.getElementById('quick-list');
      qs.addEventListener('input', function () { var q = qs.value.toLowerCase().trim(); list.innerHTML = !q ? '' : window.P82567.calcs.filter(function (c) { return (c.name + c.desc + c.cat).toLowerCase().indexOf(q) > -1; }).slice(0, 6)
        .map(function (c) { return '<a href="calculators.html#' + c.id + '">' + c.icon + ' ' + window.P82567.esc(c.name) + '</a>'; }).join('') || '<span class="muted">No match — <a href="get-quote.html">request a calculator</a></span>'; });
    }
    /* stats counter */
    document.querySelectorAll('[data-count]').forEach(function (el) { var n = +el.dataset.count, s = 0, st = Math.max(1, Math.round(n / 40)); var t = setInterval(function () { s = Math.min(n, s + st); el.textContent = s.toLocaleString(); if (s >= n) clearInterval(t); }, 25); });
    /* number of the day */
    var nd = document.getElementById('nod');
    if (nd) fetch('data/daily.json', { cache: 'no-store' }).then(function (r) { return r.json(); }).then(function (d) { nd.innerHTML = '<b>' + Number(d.number).toLocaleString() + '</b> <span>' + window.P82567.esc(d.fact) + '</span> <a href="numbers.html?n=' + d.number + '">Explore →</a>'; }).catch(function () {});
  });
})();
