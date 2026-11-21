/* VALMEX Auto Lead Tracker – sends public enquiries to the protected Supabase Edge Function. */
(function () {
  'use strict';
  if (window.VALMEX_LEAD_TRACKER) return;
  var API = 'https://qejnbbzhpvfjeqzwotwt.supabase.co/functions/v1/valmex-lead-intake';
  var KEY = 'sb_publishable_xbF3ggFeZ475werOTmFWvA_Ho_cxYov';
  var busy = false;

  function pageSource() {
    var p = location.pathname.toLowerCase();
    if (p.indexOf('calculator-acoperis') > -1) return 'roof_calculator';
    if (p.indexOf('calculator-fatada') > -1) return 'facade_calculator';
    if (p.indexOf('calculator-amk') > -1) return 'amk_calculator';
    if (p.indexOf('contact') > -1) return 'contact_form';
    return 'website_form';
  }
  function status(message, error, id) {
    var el = document.getElementById(id || 'leadStatus');
    if (!el) return;
    el.textContent = message;
    el.style.display = 'block';
    el.style.color = error ? '#b42318' : '#16803c';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
  }
  async function submit(payload, statusId) {
    if (busy) return false;
    busy = true;
    try {
      var response = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'apikey': KEY },
        body: JSON.stringify(Object.assign({
          source: pageSource(),
          page_url: location.href,
          details: {}
        }, payload))
      });
      var result = {};
      try { result = await response.json(); } catch (_) {}
      if (!response.ok || result.success !== true || !result.lead_id) {
        throw new Error(result.error || 'Serverul nu a confirmat înregistrarea solicitării.');
      }
      status('Solicitarea a fost înregistrată. Vă vom contacta în cel mai scurt timp.', false, statusId);
      return true;
    } catch (error) {
      status(error.message || 'Solicitarea nu a putut fi trimisă. Încearcă din nou.', true, statusId);
      return false;
    } finally {
      busy = false;
    }
  }
  function value(id) { var el = document.getElementById(id); return el ? String(el.value || '').trim() : ''; }

  document.addEventListener('submit', function (event) {
    var form = event.target;
    if (!form || !form.matches) return;
    if (form.id === 'leadForm') {
      event.preventDefault(); event.stopImmediatePropagation();
      var service = (document.getElementById('leadServiceText') || {}).textContent || 'Solicitare ofertă';
      submit({ source: pageSource(), name: value('leadName'), phone: value('leadPhone'), service: service }, 'leadStatus')
        .then(function (ok) {
          if (ok) {
            form.reset();
            var modal = document.getElementById('leadModal');
            if (modal) { modal.classList.remove('active'); document.body.style.overflow = ''; }
          }
        });
    } else if (form.id === 'gateForm') {
      event.preventDefault(); event.stopImmediatePropagation();
      var saved = {};
      try { saved = JSON.parse(localStorage.getItem('valmex_roof_config_v1') || '{}') || {}; } catch (_) {}
      submit({
        source: 'roof_calculator',
        name: value('leadName'),
        phone: value('leadPhone'),
        locality: value('leadLocality'),
        service: 'Calculator Acoperiș 3D',
        details: { configuration: saved, page: 'calculator-acoperis.html' }
      }, 'leadStatus').then(function (ok) {
        if (ok) {
          var result = document.getElementById('result');
          if (result) result.scrollIntoView({ behavior: 'smooth', block: 'start' });
          var form = document.getElementById('gateForm');
          if (form) form.reset();
        }
      });
    }
  }, true);

  document.addEventListener('click', function (event) {
    var button = event.target && event.target.closest ? event.target.closest('#contactSendBtn') : null;
    if (!button) return;
    event.preventDefault(); event.stopImmediatePropagation();
    submit({
      source: 'contact_form',
      name: value('contactName'),
      phone: value('contactPhone'),
      service: 'Formular contact VALMEX',
      details: { message: value('contactMessage') }
    }, 'contactStatus').then(function (ok) {
      if (ok) {
        ['contactName','contactPhone','contactMessage'].forEach(function (id) {
          var el = document.getElementById(id); if (el) el.value = '';
        });
      }
    });
  }, true);

  window.VALMEX_LEAD_TRACKER = { submit: submit };
})();