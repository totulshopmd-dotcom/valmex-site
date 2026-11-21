/* VALMEX Smart Conversion – popup-uri contextuale bazate pe semnale reale de interacțiune și vizibilitate.
   Nu detectează privirea. Funcționează doar după acceptarea cookie-urilor (cheia valmexCookieConsent=accepted).
   Configurarea vine din panou (cms/content.json → smart). Fără configurare activă, nu afișează nimic.
   Module: Store · Consent · Signals · Engine · UI. Debug: window.ValmexSC.state() */
(function () {
  'use strict';
  var PRODUCT_TOPIC = { 'acoperis-la-cheie': 'acoperisuri', 'tigla-metalica': 'acoperisuri', 'fatada-la-cheie': 'fatade', 'panouri-amk': 'fatade', 'tencuiala-decorativa': 'fatade', 'pavaj': 'pavaje' };
  var SECTION_TOPIC = { amk: 'fatade' };
  var LABEL = { acoperisuri: 'Acoperiș metalic', fatade: 'Fațade decorative', 'rate-0': 'Rate 0%', proiecte: 'Proiecte', produse: 'Produse și materiale' };
  var KEY = 'valmexSC', CONSENT_KEY = 'valmexCookieConsent', CHAT_KEY = 'valmexChatInvite', DAY = 864e5, WARMUP = 8000;

  /* ---------- Store: stare persistentă între pagini (doar cu consimțământ) ---------- */
  var Store = {
    load: function () { try { return JSON.parse(localStorage.getItem(KEY)) || { t: {}, dismissed: {}, done: {} }; } catch (e) { return { t: {}, dismissed: {}, done: {} }; } },
    save: function (s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} },
    sessionCount: function () { try { return +sessionStorage.getItem(KEY + 'n') || 0; } catch (e) { return 0; } },
    bumpSession: function () { try { sessionStorage.setItem(KEY + 'n', this.sessionCount() + 1); } catch (e) {} }
  };
  /* ---------- Consent ---------- */
  var Consent = { ok: function () { try { return localStorage.getItem(CONSENT_KEY) === 'accepted'; } catch (e) { return false; } } };

  var cfg = null, state = null, started = false, shownNow = null;
  function topicsOf(el) {
    var t = {}, s = el.closest && el.closest('[data-valmex-section]'), p = el.closest && el.closest('[data-valmex-product]'), o = el.closest && el.closest('[data-valmex-offer]');
    if (s) { var v = s.getAttribute('data-valmex-section'); t[SECTION_TOPIC[v] || v] = 1; }
    if (p) { var pr = p.getAttribute('data-valmex-product'); if (PRODUCT_TOPIC[pr]) t[PRODUCT_TOPIC[pr]] = 1; }
    if (o) t[o.getAttribute('data-valmex-offer')] = 1;
    return Object.keys(t);
  }
  var MODE_TOPIC = { roof: 'acoperisuri', facade: 'fatade', amk: 'fatade' };
  function calcTopics(el) {
    var t = topicsOf(el), panel = el.closest('#ratePanel');
    if (panel) {
      var tab = el.closest('.tab') || panel.querySelector('.tab.active,.tab[aria-selected="true"]');
      var m = tab && tab.getAttribute('data-mode'); if (m && MODE_TOPIC[m]) t.push(MODE_TOPIC[m]);
      t.push('rate-0');
    }
    return t;
  }
  function T(k) { return state.t[k] || (state.t[k] = { ms: 0, entries: 0, calc: 0, prices: 0, rates: 0, last: 0 }); }

  /* ---------- Signals ---------- */
  var Signals = {
    visible: {}, inView: {}, dwell: {},
    init: function () {
      var self = this;
      if (!('IntersectionObserver' in window)) return;
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          var id = e.target.__vsc; if (id == null) return;
          var was = !!self.inView[id], now = e.isIntersecting && e.intersectionRatio >= 0.35;
          self.inView[id] = now;
          if (now && !was) topicsOf(e.target).forEach(function (k) { var t = T(k); if (Date.now() - t.last > 30000) t.entries++; t.last = Date.now(); });
          if (!now) topicsOf(e.target).forEach(function (k) { T(k).last = Date.now(); });
        });
      }, { threshold: [0, 0.35, 0.6] });
      var n = 0;
      document.querySelectorAll('[data-valmex-section],[data-valmex-offer],[data-valmex-product]').forEach(function (el) { el.__vsc = n++; self.visible[el.__vsc] = el; io.observe(el); });
      /* interacțiuni reale: calculator, prețuri, rate */
      document.addEventListener('click', function (e) {
        var el = e.target; if (!el.closest) return;
        if (el.closest('button,select,input,.tab,[role=tab]') && el.closest('[data-valmex-product^="calculator"],[data-valmex-product="acoperis-la-cheie"],[data-valmex-product="fatada-la-cheie"],[data-valmex-product="panouri-amk"],#ratePanel,.calc-card'))
          calcTopics(el).forEach(function (k) { T(k).calc = 1; });
        if (el.closest('[data-valmex-offer="rate-0"] details,[data-valmex-offer="rate-0"] a,[data-valmex-offer="rate-0"] button')) T('rate-0').rates = 1;
      }, true);
      document.addEventListener('input', function (e) { if (e.target.closest && e.target.closest('#ratePanel,.calc-card')) calcTopics(e.target).forEach(function (k) { T(k).calc = 1; }); }, true);
    },
    tick: function (dt) {
      /* Citirea paginii este activitate: acumulăm timpul cât tabul este vizibil,
         fără să cerem mișcare, scroll sau click la fiecare 5 secunde. */
      var active = !document.hidden;
      var seen = {};
      for (var id in this.inView) if (this.inView[id]) {
        var el = this.visible[id];
        topicsOf(el).forEach(function (k) { seen[k] = 1; });
        if (el.matches('.ptable,.ptable *')) topicsOf(el).forEach(function (k) { if (active) { var d = (Signals.dwell['p' + k] = (Signals.dwell['p' + k] || 0) + dt); if (d >= 3000) T(k).prices = 1; } });
        if (el.getAttribute('data-valmex-offer') === 'rate-0' && active) { var d2 = (Signals.dwell.rate = (Signals.dwell.rate || 0) + dt); if (d2 >= 3000) T('rate-0').rates = 1; }
      }
      if (active) for (var k in seen) T(k).ms += dt;
    }
  };

  /* ---------- Engine ---------- */
  var Engine = {
    ready: function (p, t) {
      var s = p.signals || [], ok = false;
      if (s.indexOf('time') > -1 && t.ms >= (p.activeSeconds || 20) * 1000) ok = true;
      if (s.indexOf('return') > -1 && t.entries >= 2) ok = true;
      if (s.indexOf('calc') > -1 && t.calc) ok = true;
      if (s.indexOf('prices') > -1 && t.prices) ok = true;
      if (s.indexOf('rates') > -1 && t.rates) ok = true;
      return ok;
    },
    blocked: function () {
      if (shownNow) return true;
      if (Date.now() - T0 < WARMUP) return true;
      if (Store.sessionCount() >= (cfg.maxPerSession || 1)) return true;
      if (document.hidden) return true;
      if (document.querySelector('.modal.active,.cookie-banner.show,.lightbox.active,.product-detail-modal.active')) return true;
      var a = document.activeElement; if (a && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)) return true;
      return false;
    },
    check: function () {
      if (this.blocked()) return;
      var now = Date.now();
      for (var i = 0; i < cfg.popups.length; i++) {
        var p = cfg.popups[i]; if (!p.enabled || !p.question) continue;
        var until = (state.dismissed[p.key] || state.done[p.key]) ? ((state.dismissed[p.key] || state.done[p.key]) + (p.cooldownDays || 30) * DAY) : 0;
        if (until > now) continue;
        if (this.ready(p, T(p.key))) { UI.show(p); return; }
      }
    }
  };
  var T0 = Date.now();

  /* ---------- Chat contextual: folosește aceleași semnale Smart Conversion ---------- */
  var CHAT_COPY = {
    acoperisuri: { text: 'Te interesează un acoperiș la cheie?', seed: 'Mă interesează un acoperiș la cheie. Aș dori să aflu ce variante sunt potrivite.' },
    fatade: { text: 'Te interesează soluțiile pentru fațadă?', seed: 'Mă interesează soluțiile pentru fațada casei. Aș dori mai multe detalii.' },
    pavaje: { text: 'Planifici amenajarea curții?', seed: 'Mă interesează lucrările de pavaj pentru curte. Aș dori mai multe detalii.' },
    'rate-0': { text: 'Te interesează plata în rate?', seed: 'Mă interesează condițiile de plată în rate pentru lucrările VALMEX.' },
    produse: { text: 'Cauți detalii despre materiale?', seed: 'Aș dori detalii despre materialele prezentate pe site.' },
    proiecte: { text: 'Ai un proiect asemănător?', seed: 'Am consultat proiectele VALMEX și aș dori să discut despre o lucrare asemănătoare.' }
  };
  var chatInviteShown = false, chatInviteState = null;
  function chatTopic() {
    var order = ['acoperisuri','fatade','pavaje','rate-0','produse','proiecte'];
    var best = null, score = 0;
    order.forEach(function (k) {
      var t = T(k), v = (t.calc ? 5 : 0) + (t.prices ? 4 : 0) + (t.rates ? 4 : 0) + Math.min(t.entries, 3) * 2 + Math.min(t.ms / 10000, 3);
      if (v > score && CHAT_COPY[k]) { score = v; best = k; }
    });
    return best && score >= 5 ? best : null;
  }
  function chatInviteCheck() {
    if (!Consent.ok() || chatInviteShown || !state || !cfg || shownNow || document.hidden) return;
    if (Date.now() - T0 < WARMUP) return;
    try { if (sessionStorage.getItem(CHAT_KEY + ':shown') === '1') return; } catch (e) {}
    if (document.querySelector('.modal.active,.cookie-banner.show,.lightbox.active,.product-detail-modal.active,#vm-chat-panel.vm-open,.vsc.on,#valmex-push-invite')) return;
    var active = document.activeElement;
    if (active && /^(INPUT|TEXTAREA|SELECT)$/.test(active.tagName)) return;
    var topic = chatTopic(); if (!topic) return;
    var t = T(topic);
    if (t.ms < 10000 || !(t.calc || t.prices || t.rates || t.entries >= 2)) return;
    var saved = {};
    try { saved = JSON.parse(localStorage.getItem(CHAT_KEY) || '{}') || {}; } catch (e) {}
    if (saved[topic] && Date.now() - saved[topic] < 30 * DAY) return;
    chatInviteShown = true; try { sessionStorage.setItem(CHAT_KEY + ':shown','1'); } catch (e) {}
    var copy = CHAT_COPY[topic], node = document.createElement('div');
    node.className = 'vsc-chat-invite';
    node.setAttribute('role','status'); node.setAttribute('aria-live','polite');
    node.innerHTML = '<button type="button" class="vsc-chat-close" aria-label="Închide">×</button><button type="button" class="vsc-chat-open"><span></span><b></b></button>';
    node.querySelector('span').textContent = copy.text;
    node.querySelector('b').textContent = 'Scrie-ne';
    document.body.appendChild(node);
    requestAnimationFrame(function(){node.classList.add('on');});
    var dismissed = false;
    function close(mark) {
      if (dismissed) return; dismissed = true;
      node.classList.remove('on'); setTimeout(function(){node.remove();},250);
      if (mark) { var x={}; try{x=JSON.parse(localStorage.getItem(CHAT_KEY)||'{}')||{};}catch(e){} x[topic]=Date.now(); try{localStorage.setItem(CHAT_KEY,JSON.stringify(x));}catch(e){} }
    }
    node.querySelector('.vsc-chat-close').onclick=function(){close(true);};
    node.querySelector('.vsc-chat-open').onclick=function(){
      close(true);
      document.dispatchEvent(new CustomEvent('valmex:chat-context',{detail:{topic:topic,message:copy.seed}}));
      var launch=document.getElementById('vm-chat-launch'); if(launch) launch.click();
    };
    setTimeout(function(){close(false);},9000);
  }

  /* ---------- UI: mic, discret, fără overlay, fără furt de focus ---------- */
  var UI = {
    el: null,
    mk: function (html) { var d = document.createElement('div'); d.className = 'vsc'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-live', 'polite'); d.setAttribute('aria-label', 'Sugestie Valmex'); d.innerHTML = html; document.body.appendChild(d); requestAnimationFrame(function () { d.classList.add('on'); }); return d; },
    esc: function (s) { var d = document.createElement('div'); d.textContent = s == null ? '' : s; return d.innerHTML; },
    show: function (p) {
      shownNow = p; Store.bumpSession();
      this.el = this.mk('<button class="vsc-x" type="button" aria-label="Închide">×</button><p class="vsc-q">' + this.esc(p.question) + '</p><div class="vsc-a"><button class="vsc-yes" type="button">' + this.esc(p.yes || 'Da') + '</button><button class="vsc-no" type="button">' + this.esc(p.no || 'Nu') + '</button></div>');
      var self = this;
      this.el.querySelector('.vsc-yes').onclick = function () { self.yes(p); };
      this.el.querySelector('.vsc-no').onclick = this.el.querySelector('.vsc-x').onclick = function () { self.dismiss(p); };
      document.dispatchEvent(new CustomEvent('valmex:sc-shown', { detail: p.key }));
    },
    close: function () { var e = this.el; if (e) { e.classList.remove('on'); setTimeout(function () { e.remove(); }, 300); } this.el = null; shownNow = null; },
    dismiss: function (p) { state.dismissed[p.key] = Date.now(); Store.save(state); this.close(); document.dispatchEvent(new CustomEvent('valmex:sc-dismissed', { detail: p.key })); },
    yes: function (p) {
      state.done[p.key] = Date.now(); Store.save(state);
      var self = this, whats = (cfg.whats || '37378026212').replace(/\D/g, ''), btns = '';
      var label = this.esc(p.ctaLabel || 'Cere ofertă');
      if (p.cta === 'whatsapp') btns = '<button class="vsc-go" data-k="wa" type="button">WhatsApp</button>';
      else if (p.cta === 'link') btns = '<button class="vsc-go" data-k="link" type="button">' + label + '</button>';
      else btns = '<button class="vsc-go" data-k="offer" type="button">' + label + '</button><button class="vsc-alt" data-k="wa" type="button">WhatsApp</button>';
      this.el.innerHTML = '<button class="vsc-x" type="button" aria-label="Închide">×</button>' + (p.after ? '<p class="vsc-q">' + this.esc(p.after) + '</p>' : '') + '<div class="vsc-a">' + btns + '</div>';
      this.el.querySelector('.vsc-x').onclick = function () { self.close(); };
      this.el.querySelectorAll('[data-k]').forEach(function (b) {
        b.onclick = function () {
          var k = b.getAttribute('data-k');
          if (k === 'wa') window.open('https://wa.me/' + whats + '?text=' + encodeURIComponent('Bună ziua, doresc o ofertă (' + (document.title.split('|')[0].trim()) + ')'), '_blank', 'noopener');
          else if (k === 'link') location.href = p.ctaLink;
          else if (p.key === 'acoperisuri') { location.href = '/calculator-acoperis.html'; }
          else if (p.key === 'fatade') { location.href = location.pathname.toLowerCase().indexOf('amk') > -1 ? '/calculator-amk.html' : '/calculator-fatada.html'; }
          else { var o = document.querySelector('.openLeadModal'); if (o) { var old = o.getAttribute('data-service'); o.setAttribute('data-service', LABEL[p.key] || p.key); o.click(); if (old != null) o.setAttribute('data-service', old); } else location.href = (location.pathname.indexOf('/blog/') > -1 ? '../' : '') + 'contact.html'; }
          document.dispatchEvent(new CustomEvent('valmex:sc-converted', { detail: { topic: p.key, action: k } }));
          self.close();
        };
      });
      document.dispatchEvent(new CustomEvent('valmex:sc-yes', { detail: p.key }));
    }
  };

  /* ---------- pornire ---------- */
  function valid(db) {
    var s = db && db.smart; if (!s || s.enabled !== true || !Array.isArray(s.popups)) return null;
    if (s.pausedUntil && s.pausedUntil >= new Date().toISOString().slice(0, 10)) return null;
    return { maxPerSession: Math.min(3, Math.max(1, +s.maxPerSession || 1)), popups: s.popups.filter(function (p) { return p && typeof p.key === 'string' && typeof p.question === 'string'; }), whats: db.site && db.site.contact && db.site.contact.whats };
  }
  function start(db) {
    if (started) return; cfg = valid(db); if (!cfg) return;
    started = true; state = Store.load(); Signals.init();
    if (!document.getElementById('valmex-chat-invite-css')) { var st=document.createElement('style'); st.id='valmex-chat-invite-css'; st.textContent=".vsc-chat-invite{position:fixed;right:22px;bottom:94px;z-index:99989;width:min(260px,calc(100vw - 38px));opacity:0;transform:translateY(10px) scale(.98);transition:opacity .25s,transform .25s;font-family:Arial,system-ui,sans-serif}.vsc-chat-invite.on{opacity:1;transform:none}.vsc-chat-open{width:100%;display:flex;align-items:center;gap:10px;padding:13px 15px;border:1px solid #f1c4c7;border-radius:14px;background:#fff;color:#20242b;text-align:left;box-shadow:0 10px 30px #0002;cursor:pointer}.vsc-chat-open:before{content:' ';width:10px;height:10px;flex:0 0 10px;border-radius:50%;background:#e30613;box-shadow:0 0 0 5px #e306131c}.vsc-chat-open span{font-size:13px;font-weight:700;line-height:1.35;flex:1}.vsc-chat-open b{font-size:11px;color:#e30613;white-space:nowrap}.vsc-chat-close{position:absolute;right:-5px;top:-9px;width:24px;height:24px;border:0;border-radius:50%;background:#252525;color:#fff;font-size:16px;cursor:pointer;z-index:1}@media(max-width:520px){.vsc-chat-invite{right:16px;bottom:88px;width:min(250px,calc(100vw - 32px))}}@media(prefers-reduced-motion:reduce){.vsc-chat-invite{transition:none}}"; document.head.appendChild(st); }
    var last = Date.now(), saved = 0;
    setInterval(function () {
      if (!Consent.ok()) return;               /* fără consimțământ nu urmărim și nu salvăm nimic */
      var now = Date.now(), dt = now - last; last = now; if (dt > 3000) dt = 1000;
      Signals.tick(dt); Engine.check(); chatInviteCheck();
      if (now - saved > 5000) { Store.save(state); saved = now; }
    }, 1000);
    addEventListener('pagehide', function () { if (Consent.ok()) Store.save(state); });
  }
  window.ValmexSC = { state: function () { return state; }, config: function () { return cfg; }, reset: function () { try { localStorage.removeItem(KEY); sessionStorage.removeItem(KEY + 'n'); } catch (e) {} } };
  if (window.VALMEX_CMS) start(window.VALMEX_CMS); else document.addEventListener('valmex:cms', function (e) { start(e.detail); });
})();
