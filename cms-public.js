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
  function decoratePrice(el,db) {
    var key=el.getAttribute('data-cms').slice(7), cfg=(db.priceDisplay||{})[key]||{}, base=Number((db.prices||{})[key]);
    var prefix=document.querySelectorAll('[data-cms-prefix="prices.'+key+'"]');
    var showFrom=cfg.showFrom!==false;
    prefix.forEach(function(node){node.hidden=!showFrom;});
    if(!isFinite(base)||base<=0)return;
    var mode=cfg.mode||'from', amount=Number(cfg.discountValue), final=base, active=mode==='promo';
    var today=new Date(), y=today.getFullYear(), m=String(today.getMonth()+1).padStart(2,'0'), d=String(today.getDate()).padStart(2,'0'), date=y+'-'+m+'-'+d;
    if(cfg.start&&date<cfg.start)active=false;
    if(cfg.end&&date>cfg.end)active=false;
    if(active){
      if(cfg.discountType==='percent')final=base*(1-amount/100);
      else if(cfg.discountType==='amount')final=base-amount;
      else final=amount;
      active=cfg.discountValue!==''&&cfg.discountValue!=null&&isFinite(final)&&final>=0&&final<base;
    }
    var old=el.parentNode.querySelector('[data-valmex-old-price="'+key+'"]');
    if(old)old.remove();
    var tag=el.parentNode.querySelector('[data-valmex-promo-label="'+key+'"]');
    if(tag)tag.remove();
    el.textContent=new Intl.NumberFormat('ro-MD',{maximumFractionDigits:2}).format(active?final:base);
    if(active){
      old=document.createElement('span');old.setAttribute('data-valmex-old-price',key);
      old.style.cssText='text-decoration:line-through;opacity:.65;margin-left:.5em;font-size:.72em;white-space:nowrap';
      old.textContent=new Intl.NumberFormat('ro-MD',{maximumFractionDigits:2}).format(base);
      el.insertAdjacentElement('afterend',old);
      if(cfg.label){
        tag=document.createElement('span');tag.setAttribute('data-valmex-promo-label',key);
        tag.style.cssText='display:inline-block;margin-left:.5em;font-size:.72em;font-weight:600;white-space:nowrap';
        tag.textContent=cfg.label;old.insertAdjacentElement('afterend',tag);
      }
    }
  }
  function apply(db) {
    document.querySelectorAll('[data-cms]').forEach(function (el) {
      var v = value(el.getAttribute('data-cms'), get(db, el.getAttribute('data-cms')));
      if (v !== null) { el.textContent = fmt(v, el.getAttribute('data-cms-fmt')); if(el.getAttribute('data-cms').indexOf('prices.')===0) decoratePrice(el,db); }
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
