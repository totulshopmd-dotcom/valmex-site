/* VALMEX CMS – script public. Citește /cms/content.json și actualizează doar elementele marcate cu data-cms.
   Dacă fișierul lipsește sau e invalid, pagina rămâne cu textul din HTML. Nu conține chei sau tokenuri. */
(function () {
  'use strict';
  function get(o, p) { return p.split('.').reduce(function (a, k) { return a == null ? a : a[k]; }, o); }
  function digits(v) { return String(v).replace(/\D/g, ''); }
  function nat(v) { var d = digits(v); if (d.indexOf('373') === 0) d = d.slice(3); else if (d.charAt(0) === '0') d = d.slice(1); return d; }
  var okPhone = /^\+?[\d\s()-]{6,20}$/, okMail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  function value(path, raw) {
    if (raw == null || raw === '') return null;
    if (path.indexOf('prices.') === 0) { var n = Number(raw); return isFinite(n) && n >= 0 ? String(n) : null; }
    if (/contact\.(phone|whats)$/.test(path)) return okPhone.test(String(raw)) ? String(raw) : null;
    if (/contact\.email$/.test(path)) return okMail.test(String(raw)) ? String(raw) : null;
    return typeof raw === 'string' ? raw : null;
  }
  function fmt(v, f) {
    if (f === 'phone' || f === 'phone-intl') {
      var d = nat(v);
      if (d.length === 8) return f === 'phone' ? '0' + d.slice(0, 2) + ' ' + d.slice(2, 5) + ' ' + d.slice(5) : '+373 ' + d.slice(0, 2) + ' ' + d.slice(2, 5) + ' ' + d.slice(5);
    }
    return v;
  }
  function apply(db) {
    document.querySelectorAll('[data-cms]').forEach(function (el) {
      var v = value(el.getAttribute('data-cms'), get(db, el.getAttribute('data-cms')));
      if (v !== null) el.textContent = fmt(v, el.getAttribute('data-cms-fmt'));
    });
    document.querySelectorAll('[data-cms-href]').forEach(function (el) {
      var spec = el.getAttribute('data-cms-href'), i = spec.indexOf(':'), kind = spec.slice(0, i), path = spec.slice(i + 1);
      var v = value(path, get(db, path)); if (v === null) return;
      if (kind === 'tel') el.setAttribute('href', 'tel:+373' + nat(v));
      else if (kind === 'wa') el.setAttribute('href', 'https://wa.me/373' + nat(v));
      else if (kind === 'mailto') el.setAttribute('href', 'mailto:' + v);
    });
    window.VALMEX_CMS = db;
    document.dispatchEvent(new CustomEvent('valmex:cms', { detail: db }));
  }
  function done(db) { window.VALMEX_CMS_DONE = true; document.dispatchEvent(new CustomEvent('valmex:cms-done', { detail: db || null })); }
  fetch('/cms/content.json', { cache: 'no-cache' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (db) { var ok = db && typeof db === 'object'; if (ok) apply(db); done(ok ? db : null); })
    .catch(function () { done(null); });
})();
