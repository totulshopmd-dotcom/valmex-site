/* VALMEX Finance — reads only schema already referenced by the existing CRM.
   No writes, schema changes, pricing changes, or profit assumptions in this stage. */
(function (w, d) {
  'use strict';
  const money = v => new Intl.NumberFormat('ro-RO', { maximumFractionDigits: 2 }).format(Number(v || 0)) + ' lei';
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const date = v => v ? new Date(v + (String(v).length === 10 ? 'T00:00:00' : '')).toLocaleDateString('ro-RO') : '—';
  const sum = (arr, fn) => arr.reduce((n, x) => n + (Number(fn(x)) || 0), 0);
  function card(label, value, note) { return `<article class="fin-stat"><span>${esc(label)}</span><strong>${money(value)}</strong><small>${esc(note || '')}</small></article>`; }
  function table(headers, rows, empty) {
    return `<div class="fin-table-wrap"><table class="fin-table"><thead><tr>${headers.map(x=>`<th>${esc(x)}</th>`).join('')}</tr></thead><tbody>${rows.length ? rows.join('') : `<tr><td colspan="${headers.length}" class="fin-empty">${esc(empty)}</td></tr>`}</tbody></table></div>`;
  }
  function section(title, note, content) { return `<section class="fin-panel"><div class="fin-panel-head"><div><h2>${esc(title)}</h2><p>${esc(note || '')}</p></div></div>${content}</section>`; }
  function styles() {
    if (d.getElementById('vm-finance-style')) return;
    const s=d.createElement('style'); s.id='vm-finance-style'; s.textContent=`
      .fin-alert{padding:12px 14px;border:1px solid #f0dfb8;background:#fff8e8;color:#745a20;border-radius:9px;font-size:12px;line-height:1.55;margin:0 0 15px}
      .fin-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin:16px 0}
      .fin-stat,.fin-panel{background:#fff;border:1px solid #e8e8e8;border-radius:11px}
      .fin-stat{padding:15px;min-width:0}.fin-stat span{display:block;color:#777;font-size:11px}.fin-stat strong{display:block;font-size:21px;margin:8px 0 4px;overflow-wrap:anywhere}.fin-stat small{font-size:10px;color:#888}
      .fin-panel{margin:14px 0;overflow:hidden}.fin-panel-head{padding:15px 17px;border-bottom:1px solid #eee}.fin-panel-head h2{font-size:14px;margin:0 0 5px}.fin-panel-head p{font-size:11px;color:#888;margin:0;line-height:1.5}
      .fin-table-wrap{overflow:auto}.fin-table{width:100%;border-collapse:collapse;min-width:700px}.fin-table th,.fin-table td{text-align:left;padding:11px 12px;border-bottom:1px solid #eee;font-size:11px;vertical-align:top}.fin-table th{background:#fafafa;color:#777;font-weight:700;white-space:nowrap}.fin-table td.num{text-align:right;white-space:nowrap;font-variant-numeric:tabular-nums}.fin-empty{text-align:center;color:#888;padding:25px!important}
      .fin-toolbar{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin:12px 0}.fin-toolbar input,.fin-toolbar select{border:1px solid #ddd;background:#fff;border-radius:7px;padding:9px 10px;font-size:12px;min-width:180px}.fin-calc{display:flex;gap:8px;flex-wrap:wrap;align-items:center;padding:14px;background:#f7f7f7;border:1px solid #e8e8e8;border-radius:10px}.fin-calc input{width:130px;max-width:30%;padding:10px;border:1px solid #ddd;border-radius:7px}.fin-calc button{border:1px solid #ccc;background:#fff;border-radius:7px;padding:9px 13px;font-weight:800}.fin-calc output{font-weight:800;min-width:140px}.fin-export{display:flex;gap:8px;flex-wrap:wrap}.fin-btn{border:0;border-radius:7px;padding:10px 13px;background:#171717;color:#fff;font-size:11px;font-weight:700}.fin-muted{color:#888;font-size:10px;line-height:1.5}.fin-pill{display:inline-block;padding:4px 7px;border-radius:20px;background:#f1f1f1;color:#555;font-size:10px}
      @media(max-width:900px){.fin-stats{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:560px){.fin-stats{grid-template-columns:1fr 1fr}.fin-stat{padding:12px}.fin-stat strong{font-size:17px}}
    `; d.head.appendChild(s);
  }
  async function mount(host, ctx) {
    styles();
    const db=w.VALMEX_DB, role=String(ctx?.profile?.role||'').toLowerCase();
    if (!['admin','administrator'].includes(role)) {
      host.innerHTML='<div class="fin-alert">Accesul la situația financiară completă este restricționat. Permisiunile finale trebuie aplicate și verificate în Supabase RLS.</div>';
      return;
    }
    host.innerHTML=`<div class="vm-head"><div><div class="vm-eyebrow">MANAGEMENT FINANCIAR</div><h1>Financiar</h1><p class="vm-sub">Încasări contractuale și costuri materiale înregistrate în dosarele proiectelor.</p></div><div class="fin-export"><button class="fin-btn" id="finCsv">Export CSV (Excel)</button><button class="fin-btn" id="finPrint">Export PDF / Tipărire</button><button class="fin-btn" id="finReload">Reîncarcă datele</button></div></div>
      <div class="fin-alert"><b>Notă privind datele:</b> acest modul citește tabele și view-uri deja folosite de CRM. Nu introduce cheltuieli noi și nu estimează profitul. Costurile de lemn, manoperă, transport, comisioane și cheltuieli diverse vor fi centralizate după confirmarea schemei de date și a regulilor de calcul.</div>
      <div class="fin-panel"><div class="fin-panel-head"><div><h2>Calculator rapid</h2><p>Operații simple pentru verificări manuale. Nu modifică înregistrările din CRM.</p></div></div><div class="fin-calc"><input id="finA" type="number" step="any" placeholder="Valoarea A"><div id="finOps"><button type="button" data-op="+">+</button> <button type="button" data-op="-">−</button> <button type="button" data-op="*">×</button> <button type="button" data-op="/">÷</button></div><input id="finB" type="number" step="any" placeholder="Valoarea B"><button type="button" id="finEquals">=</button><output id="finResult">Rezultat: —</output><button type="button" id="finClear">C</button></div></div><div id="finStatus" class="fin-muted">Se încarcă datele financiare…</div><div id="finBody"></div>`;
    d.getElementById('finReload').addEventListener('click', load);
    let finData={contracts:[],payments:[],materials:[],summaries:[],collected:0,contractValue:0,outstanding:null,materialActual:0,materialPlanned:0};
    let finOperator='+';
    d.querySelectorAll('[data-op]').forEach(b=>b.addEventListener('click',()=>{finOperator=b.dataset.op;d.querySelectorAll('[data-op]').forEach(x=>x.style.background=x===b?'#ffe8e8':'#fff');}));
    d.getElementById('finEquals').addEventListener('click',()=>{const a=Number(d.getElementById('finA').value),b=Number(d.getElementById('finB').value);if(d.getElementById('finA').value===''||d.getElementById('finB').value===''){d.getElementById('finResult').textContent='Introdu ambele valori';return;}let v=finOperator==='+'?a+b:finOperator==='-'?a-b:finOperator==='*'?a*b:b===0?NaN:a/b;d.getElementById('finResult').textContent='Rezultat: '+(Number.isFinite(v)?new Intl.NumberFormat('ro-MD',{maximumFractionDigits:4}).format(v):'operație imposibilă');});
    d.getElementById('finClear').addEventListener('click',()=>{d.getElementById('finA').value='';d.getElementById('finB').value='';d.getElementById('finResult').textContent='Rezultat: —';});
    d.getElementById('finCsv').addEventListener('click',exportCsv);
    d.getElementById('finPrint').addEventListener('click',exportPrint);
    await load();
    async function load() {
      const status=d.getElementById('finStatus'), body=d.getElementById('finBody');
      status.textContent='Se citesc contractele, plățile și materialele…'; body.innerHTML='';
      const [cr, pr, mr, vr] = await Promise.all([
        db.from('contracts').select('id,project_id,contract_code,title,contract_value,advance_amount,status').limit(1000),
        db.from('payments').select('id,project_id,contract_id,payment_date,amount,method,notes').order('payment_date',{ascending:false}).limit(2000),
        db.from('project_materials').select('id,project_id,material_name,unit,planned_quantity,actual_quantity,planned_unit_price,actual_unit_price,status').limit(3000),
        db.from('contract_financial_summary').select('contract_id,project_id,total_paid,remaining_balance').limit(2000)
      ]);
      const errors=[];
      if(cr.error) errors.push('contracte: '+cr.error.message);
      if(pr.error) errors.push('plăți: '+pr.error.message);
      if(mr.error) errors.push('materiale: '+mr.error.message);
      if(vr.error) errors.push('rezumat financiar: '+vr.error.message);
      const contracts=cr.data||[], payments=pr.data||[], materials=mr.data||[], summaries=vr.data||[];
      const summaryById=new Map(summaries.map(x=>[x.contract_id,x]));
      const paidFromView=sum(summaries,x=>x.total_paid);
      const paidFromPayments=sum(payments,x=>x.amount);
      const collected=vr.error ? paidFromPayments : paidFromView;
      const contractValue=sum(contracts,x=>x.contract_value);
      const outstanding=vr.error ? null : sum(summaries,x=>x.remaining_balance);
      const materialActual=sum(materials,x=>x.actual_quantity!==null&&x.actual_quantity!==''&&Number(x.actual_quantity)>0&&x.actual_unit_price!==null&&x.actual_unit_price!==''&&Number(x.actual_unit_price)>=0?Number(x.actual_quantity)*Number(x.actual_unit_price):0);
      const materialPlanned=sum(materials,x=>x.planned_quantity!==null&&x.planned_quantity!==''&&Number(x.planned_quantity)>0&&x.planned_unit_price!==null&&x.planned_unit_price!==''&&Number(x.planned_unit_price)>=0?Number(x.planned_quantity)*Number(x.planned_unit_price):0);
      finData={contracts,payments,materials,summaries,collected,contractValue,outstanding,materialActual,materialPlanned,summaryAvailable:!vr.error};
      const contractRows=contracts.map(c=>{
        const s=summaryById.get(c.id), paid=s?Number(s.total_paid||0):null, remain=s?Number(s.remaining_balance||0):null;
        return `<tr><td><b>${esc(c.contract_code||'—')}</b><br>${esc(c.title||'Fără titlu')}</td><td>${esc(c.project_id||'—')}</td><td class="num">${money(c.contract_value)}</td><td class="num">${paid===null?'—':money(paid)}</td><td class="num">${remain===null?'—':money(remain)}</td><td>${esc(c.status||'—')}</td></tr>`;
      });
      const paymentRows=payments.map(p=>`<tr><td>${date(p.payment_date)}</td><td class="num"><b>${money(p.amount)}</b></td><td>${esc(p.project_id||'—')}</td><td>${esc(p.method||'—')}</td><td>${esc(p.notes||'—')}</td></tr>`);
      const materialRows=materials.map(m=>{
        const q=Number(m.actual_quantity||0), unit=Number(m.actual_unit_price||0), hasCost=m.actual_quantity!==null&&m.actual_quantity!==''&&q>0&&m.actual_unit_price!==null&&m.actual_unit_price!==''&&unit>=0, cost=hasCost?q*unit:null;
        const hasPlan=m.planned_quantity!==null&&m.planned_quantity!==''&&Number(m.planned_quantity)>0&&m.planned_unit_price!==null&&m.planned_unit_price!==''&&Number(m.planned_unit_price)>=0;
        return `<tr><td>${esc(m.material_name||'—')}</td><td>${esc(m.project_id||'—')}</td><td class="num">${hasPlan?money(Number(m.planned_quantity)*Number(m.planned_unit_price)):'—'}</td><td class="num">${cost===null?'—':money(cost)}</td><td>${esc(m.status||'—')}</td></tr>`;
      });
      body.innerHTML=`<div class="fin-stats">${card('Valoare contracte',contractValue,'Contracte accesibile contului')}${card('Încasări înregistrate',collected,vr.error?'Total din tabelul plăților; sumarul contractual nu este disponibil.':'Total din sumarul financiar contractual')}${card('Sold contractual',outstanding===null?0:outstanding,outstanding===null?'Indisponibil fără view-ul financiar':'Sold raportat de contract_financial_summary')}${card('Cost materiale efective',materialActual,'Cantitate reală × preț unitar real')}</div>
        ${section('Contracte și solduri','Soldurile sunt afișate numai dacă view-ul contractual returnează date.',table(['Contract','ID proiect','Valoare','Achitat','Sold','Status'],contractRows,'Nu există contracte accesibile.'))}
        ${section('Încasări','Înregistrări din tabelul payments.',table(['Data','Sumă','ID proiect','Metodă','Note'],paymentRows,'Nu există plăți înregistrate.'))}
        ${section('Costuri materiale','Valoarea efectivă este calculată din cantitatea reală și prețul unitar real existente în project_materials.',`<div class="fin-stats" style="padding:12px 14px 0">${card('Cost planificat materiale',materialPlanned,'Cantitate planificată × preț planificat')}${card('Cost efectiv materiale',materialActual,'Cantitate reală × preț real')}</div>${table(['Material','ID proiect','Cost planificat','Cost efectiv','Status'],materialRows,'Nu există materiale înregistrate.')}`)}
        ${section('Costuri interne care urmează a fi centralizate','Nu sunt însumate în costul materialelor și nu sunt considerate zero.',`<div class="fin-table-wrap"><table class="fin-table"><tbody>${['Lemn și debitare','Manoperă','Transport','Comisioane de finanțare','Cheltuieli diverse','Lucrări suplimentare'].map(x=>`<tr><td>${x}</td><td><span class="fin-pill">Necesită sursă de date confirmată</span></td></tr>`).join('')}</tbody></table></div>`)}
        <p class="fin-muted">${errors.length?'Atenție: unele surse nu au putut fi citite: '+esc(errors.join(' · ')):'Sursele interogate au răspuns fără erori raportate.'} Valorile afișate depind de accesul RLS al contului. Costul materialelor nu reprezintă costul total al proiectului. Nu se calculează profit sau marjă în această versiune.</p>`;
      status.textContent=`Actualizat: ${new Date().toLocaleString('ro-RO')} · ${contracts.length} contracte · ${payments.length} plăți · ${materials.length} poziții materiale`;
    }
    function csvCell(v){const x=String(v??'');return '"'+x.replace(/"/g,'""')+'"'}
    function exportCsv(){
      const x=finData,lines=[];const add=(title,headers,rows)=>{lines.push(csvCell(title));lines.push(headers.map(csvCell).join(';'));rows.forEach(r=>lines.push(r.map(csvCell).join(';')));lines.push('');};
      add('REZUMAT FINANCIAR',['Indicator','Valoare MDL'],[['Valoare contracte',x.contractValue],['Încasări înregistrate',x.collected],['Sold contractual',x.outstanding===null?'Indisponibil':x.outstanding],['Cost materiale planificat',x.materialPlanned],['Cost materiale efectiv',x.materialActual]]);
      add('CONTRACTE',['Cod','Titlu','ID proiect','Valoare MDL','Achitat MDL','Sold MDL','Status'],x.contracts.map(c=>{const z=x.summaries.find(a=>a.contract_id===c.id);return[c.contract_code,c.title,c.project_id,c.contract_value,z?.total_paid??'',z?.remaining_balance??'',c.status]}));
      add('INCASARI',['Data','Suma MDL','ID proiect','Metoda','Note'],x.payments.map(p=>[p.payment_date,p.amount,p.project_id,p.method,p.notes]));
      add('MATERIALE',['Material','ID proiect','UM','Cantitate planificata','Pret planificat','Cost planificat','Cantitate reala','Pret real','Cost efectiv','Status'],x.materials.map(m=>[m.material_name,m.project_id,m.unit,m.planned_quantity,m.planned_unit_price,m.planned_quantity!==null&&m.planned_quantity!==''&&m.planned_unit_price!==null&&m.planned_unit_price!==''?(Number(m.planned_quantity)||0)*(Number(m.planned_unit_price)||0):'',m.actual_quantity,m.actual_unit_price,m.actual_quantity!==null&&m.actual_quantity!==''&&m.actual_unit_price!==null&&m.actual_unit_price!==''?(Number(m.actual_quantity)||0)*(Number(m.actual_unit_price)||0):'',m.status]));
      const blob=new Blob(['\ufeff'+lines.join('\r\n')],{type:'text/csv;charset=utf-8;'}),url=URL.createObjectURL(blob),a=d.createElement('a');a.href=url;a.download='VALMEX-raport-financiar-'+new Date().toISOString().slice(0,10)+'.csv';d.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
    }
    function exportPrint(){
      const x=finData,fmt=v=>money(v),esc2=esc;const rows=(h,arr)=>`<table><thead><tr>${h.map(v=>`<th>${esc2(v)}</th>`).join('')}</tr></thead><tbody>${arr.length?arr.map(r=>`<tr>${r.map(v=>`<td>${esc2(v??'—')}</td>`).join('')}</tr>`).join(''):`<tr><td colspan="${h.length}">Nu există date.</td></tr>`}</tbody></table>`;
      const w2=window.open('','_blank');if(!w2){alert('Permite deschiderea ferestrei pentru export PDF.');return;}
      w2.document.write(`<!doctype html><html lang="ro"><head><meta charset="utf-8"><title>Raport financiar VALMEX</title><style>body{font:12px Arial;color:#222;padding:24px}h1{font-size:22px}h2{font-size:15px;margin-top:24px}p{color:#666}table{width:100%;border-collapse:collapse;margin:8px 0 18px}th,td{border:1px solid #ddd;padding:7px;text-align:left;font-size:10px}th{background:#f2f2f2}.summary{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.summary div{border:1px solid #ddd;padding:10px}@media print{button{display:none}}</style></head><body><h1>VALMEX — Raport financiar</h1><p>Generat: ${esc2(new Date().toLocaleString('ro-MD'))} · Monedă: MDL</p><div class="summary"><div>Contracte: <b>${fmt(x.contractValue)}</b></div><div>Încasări: <b>${fmt(x.collected)}</b></div><div>Sold: <b>${x.outstanding===null?'Indisponibil':fmt(x.outstanding)}</b></div><div>Materiale planificate: <b>${fmt(x.materialPlanned)}</b></div><div>Materiale efective: <b>${fmt(x.materialActual)}</b></div></div><h2>Contracte</h2>${rows(['Cod / titlu','Proiect','Valoare','Achitat','Sold','Status'],x.contracts.map(c=>{const z=x.summaries.find(a=>a.contract_id===c.id);return[(c.contract_code||'')+' '+(c.title||''),c.project_id,fmt(c.contract_value),z?fmt(z.total_paid):'—',z?fmt(z.remaining_balance):'—',c.status]}))}<h2>Încasări</h2>${rows(['Data','Sumă','Proiect','Metodă','Note'],x.payments.map(p=>[date(p.payment_date),fmt(p.amount),p.project_id,p.method,p.notes]))}<h2>Materiale</h2>${rows(['Material','Proiect','UM','Cost planificat','Cost efectiv','Status'],x.materials.map(m=>[m.material_name,m.project_id,m.unit,m.planned_quantity!==null&&m.planned_quantity!==''&&m.planned_unit_price!==null&&m.planned_unit_price!==''?fmt(Number(m.planned_quantity)*Number(m.planned_unit_price)):'—',m.actual_quantity!==null&&m.actual_quantity!==''&&m.actual_unit_price!==null&&m.actual_unit_price!==''?fmt(Number(m.actual_quantity)*Number(m.actual_unit_price)):'—',m.status]))}<p>Raport generat din înregistrările accesibile contului. Costurile care nu au sursă confirmată nu sunt incluse; acest raport nu reprezintă calculul profitului.</p><script>window.onload=()=>window.print()<\/script></body></html>`);w2.document.close();
    }
  }
  w.VALMEX_FINANCE=Object.freeze({mount});
})(window,document);
