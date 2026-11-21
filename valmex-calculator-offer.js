/* VALMEX calculator offer flow – customer details are requested only after calculation. */
(function () {
  'use strict';
  var kind = document.getElementById('facadeCalcBtn') ? 'facade' : (document.getElementById('amkCalcBtn') ? 'amk' : '');
  if (!kind) return;
  var button = document.getElementById(kind === 'facade' ? 'facadeCalcBtn' : 'amkCalcBtn');
  var result = document.getElementById(kind === 'facade' ? 'facadeCalcResult' : 'amkCalcResult');
  var oldOffer = document.querySelector('.calc-card .openLeadModal');
  if (oldOffer) oldOffer.hidden = true;
  var captured = null, lead = null;
  var panel = document.createElement('section');
  panel.id = 'valmexCalculatorOffer';
  panel.style.cssText = 'display:none;margin-top:20px;padding:20px;border:1px solid #ddd;border-radius:14px;background:#fff;color:#222';
  result.insertAdjacentElement('afterend', panel);

  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"]/g, function (c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  function money(v) { return Math.round(v).toLocaleString('ro-RO') + ' lei'; }
  function snapshot() {
    var area = Number(document.getElementById(kind === 'facade' ? 'facadeArea' : 'amkArea').value);
    if (!(area > 0)) return null;
    if (kind === 'facade') {
      var type = document.getElementById('facadeType').value;
      var windows = Number(document.getElementById('facadeWindows').value) || 0;
      var net = Math.max(0, area - windows * 1.5);
      var pricePer = Number(window.VALMEX_CMS && window.VALMEX_CMS.prices && window.VALMEX_CMS.prices.facade);
      return { service:'Fațadă decorativă', area:area, netArea:net, type:type, windows:windows,
        adhesive:Math.ceil(net*5), mesh:Math.ceil(net*1.1), primer:Math.ceil(net*.3),
        pricePer:pricePer > 0 ? pricePer : null, total:pricePer > 0 ? Math.ceil(net*pricePer) : null };
    }
    var model = document.getElementById('amkModel').value;
    return { service:'Fațadă AMK', area:area, model:model, panels:Math.ceil(area/.36),
      adhesive:Math.ceil(area*4), screws:Math.ceil(area*12), total:null };
  }
  function summaryRows(d) {
    var rows = kind === 'facade' ? [
      ['Tip lucrare',d.type],['Suprafață introdusă',d.area+' m²'],['Suprafață netă estimată',d.netArea.toFixed(1)+' m²'],
      ['Adeziv',d.adhesive+' kg'],['Plasă de armare',d.mesh+' m²'],['Grund',d.primer+' L'],
      ['Preț estimativ',d.total ? 'de la '+money(d.total) : 'Se confirmă prin ofertă']
    ] : [
      ['Model',d.model],['Suprafață',d.area+' m²'],['Panouri AMK',d.panels+' buc.'],
      ['Adeziv',d.adhesive+' kg'],['Dibluri',d.screws+' buc.'],['Preț', 'Se confirmă prin ofertă']
    ];
    return rows;
  }
  function render() {
    captured = snapshot();
    if (!captured) return;
    var rows = summaryRows(captured);
    result.insertAdjacentHTML('beforeend','<p class="valmex-estimate-note" style="margin-top:12px;color:#555">Estimarea cantităților este orientativă. Oferta finală se confirmă după verificarea proiectului.</p>');
    panel.style.display = 'block';
    panel.innerHTML = '<h3 style="margin:0 0 8px">Primește oferta pentru proiectul tău</h3><p>Calculul este gata. Introdu datele de contact pentru a înregistra solicitarea și a pregăti oferta PDF.</p><form id="valmexCalcLead" autocomplete="on"><label style="display:block;margin:10px 0 4px">Nume și prenume *</label><input name="name" required autocomplete="name" style="width:100%;padding:12px;border:1px solid #ccc;border-radius:8px"><label style="display:block;margin:10px 0 4px">Telefon *</label><input name="phone" type="tel" required autocomplete="tel" placeholder="06X XXX XXX" style="width:100%;padding:12px;border:1px solid #ccc;border-radius:8px"><label style="display:block;margin:10px 0 4px">Localitate *</label><input name="locality" required style="width:100%;padding:12px;border:1px solid #ccc;border-radius:8px"><button type="submit" style="margin-top:14px;padding:13px 20px;background:#e30613;color:#fff;border:0;border-radius:8px;font-weight:700">Înregistrează și pregătește oferta</button><p id="valmexCalcLeadStatus" role="status" style="margin-top:10px"></p></form><button id="valmexCalcPdf" type="button" hidden style="margin-top:12px;padding:13px 20px;background:#222;color:#fff;border:0;border-radius:8px;font-weight:700">Descarcă oferta PDF</button><p id="valmexCalcAfter" hidden style="margin-top:10px">Solicitarea a fost înregistrată. Un consultant VALMEX va reveni pentru discutarea ofertei.</p>';
    document.getElementById('valmexCalcLead').addEventListener('submit', submitLead);
    document.getElementById('valmexCalcPdf').addEventListener('click', downloadPDF);
  }
  function submitLead(e) {
    e.preventDefault();
    var form = e.currentTarget, fd = new FormData(form);
    lead = { name:fd.get('name').trim(), phone:fd.get('phone').trim(), locality:fd.get('locality').trim() };
    var status = document.getElementById('valmexCalcLeadStatus'), submit = form.querySelector('button[type=submit]');
    submit.disabled = true; submit.textContent = 'Se înregistrează...';
    if (!window.VALMEX_LEAD_TRACKER) { status.textContent='Serviciul de înregistrare nu este disponibil. Reîncearcă.'; submit.disabled=false; return; }
    window.VALMEX_LEAD_TRACKER.submit({
      source: kind === 'facade' ? 'facade_calculator' : 'amk_calculator',
      name:lead.name, phone:lead.phone, locality:lead.locality, service:'VALMEX | Calculator '+captured.service,
      details:{ calculator:kind, input:captured, estimate:summaryRows(captured) }
    }, 'valmexCalcLeadStatus').then(function(ok) {
      if (!ok) { submit.disabled=false; submit.textContent='Reîncearcă înregistrarea'; return; }
      form.hidden=true;
      document.getElementById('valmexCalcPdf').hidden=false;
      document.getElementById('valmexCalcAfter').hidden=false;
    });
  }
  function downloadPDF() {
    if (!lead || !captured) return;
    var w = window.open('', '_blank');
    if (!w) { alert('Permite deschiderea ferestrelor pentru a genera oferta PDF.'); return; }
    var rows = [['Client',lead.name],['Telefon',lead.phone],['Localitate',lead.locality]].concat(summaryRows(captured));
    w.document.write('<!doctype html><html lang="ro"><meta charset="utf-8"><title>Ofertă VALMEX</title><style>body{font:15px Arial;color:#222;padding:36px;max-width:780px;margin:auto}h1{color:#e30613}table{width:100%;border-collapse:collapse;margin:24px 0}td{padding:12px;border-bottom:1px solid #ddd}td:first-child{font-weight:bold;width:42%}.note{margin-top:28px;color:#555;font-size:13px}</style><h2>VALMEX</h2><h1>Ofertă estimativă – '+esc(captured.service)+'</h1><table>'+rows.map(function(r){return '<tr><td>'+esc(r[0])+'</td><td>'+esc(r[1])+'</td></tr>';}).join('')+'</table><p class="note">Cantitățile și valorile sunt estimative, calculate pe baza datelor introduse. Oferta finală și prețul lucrării se confirmă după evaluarea proiectului. VALMEX.md · +373 780 26212 · Valmex.md@gmail.com</p><script>window.onload=function(){window.print();};<\/script></html>');
    w.document.close();
  }
  button.addEventListener('click', function () { setTimeout(render, 0); });
})();