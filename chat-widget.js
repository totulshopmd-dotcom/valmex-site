(()=>{'use strict';
const API='https://qejnbbzhpvfjeqzwotwt.supabase.co/functions/v1/valmex-chat-api';
const KEY='sb_publishable_xbF3ggFeZ475werOTmFWvA_Ho_cxYov';
const STORE='valmex_public_chat_session_v1';
if(document.getElementById('valmex-chat-root'))return;
const css=`
#valmex-chat-root{position:fixed;right:20px;bottom:22px;z-index:99990;font-family:Arial,system-ui,sans-serif;color:#20242b}
#vm-chat-launch{width:62px;height:62px;border:0;border-radius:50%;background:#d83232;color:#fff;box-shadow:0 8px 28px #0005;cursor:pointer;font-size:25px}
#vm-chat-panel{display:none;position:absolute;right:0;bottom:76px;width:min(380px,calc(100vw - 28px));height:min(580px,calc(100dvh - 120px));background:#fff;border-radius:16px;box-shadow:0 12px 45px #0004;overflow:hidden;flex-direction:column}
#vm-chat-panel.vm-open{display:flex}#vm-chat-head{background:#171b22;color:#fff;padding:16px 17px;display:flex;justify-content:space-between;align-items:center}
#vm-chat-head strong{font-size:16px}#vm-chat-head small{display:block;color:#c0c5cc;margin-top:4px;font-size:11px}
#vm-chat-close{border:0;background:transparent;color:#fff;font-size:24px;cursor:pointer}
#vm-chat-content{padding:16px;overflow:auto;flex:1;background:#f5f6f8}
#vm-chat-start p{font-size:13px;color:#59616d;line-height:1.5;margin:0 0 13px}
#vm-chat-start input:not([type=checkbox]){width:100%;padding:11px;border:1px solid #d8dce2;border-radius:8px;margin:0 0 9px;font-size:14px;box-sizing:border-box}
#vm-chat-consent{font-size:11px;color:#68717d;display:flex;gap:7px;align-items:flex-start;margin:4px 0 13px;line-height:1.4}
#vm-chat-consent input{margin:2px 0 0}
#vm-chat-start button,#vm-chat-send{border:0;background:#d83232;color:#fff;font-weight:700;border-radius:8px;padding:12px 14px;cursor:pointer}
#vm-chat-start button{width:100%}#vm-chat-start button:disabled,#vm-chat-send:disabled{opacity:.55;cursor:wait}
#vm-chat-log{display:flex;flex-direction:column;gap:9px}#vm-chat-log[hidden],#vm-chat-compose[hidden]{display:none}
.vm-chat-msg{max-width:88%;padding:9px 11px;border-radius:12px;background:#e6e9ee;color:#222;font-size:13px;line-height:1.45;white-space:pre-wrap;overflow-wrap:anywhere;align-self:flex-start}
.vm-chat-msg.vm-me{align-self:flex-end;background:#d83232;color:#fff}
.vm-chat-msg.vm-ai{border-left:3px solid #d83232;background:#fff}
.vm-chat-msg small{display:block;font-size:9px;opacity:.72;margin-top:4px}
#vm-chat-compose{display:flex;gap:7px;padding:11px;border-top:1px solid #e5e7eb;background:#fff}
#vm-chat-text{flex:1;min-width:0;resize:none;height:42px;max-height:90px;border:1px solid #d8dce2;border-radius:8px;padding:10px;font:13px Arial;box-sizing:border-box}
#vm-chat-send{padding:0 13px}#vm-chat-error{font-size:11px;color:#b42318;padding:0 12px 8px;display:none}
#vm-chat-status{font-size:11px;color:#667085;padding:0 12px 7px;min-height:20px}
@media(max-width:520px){#valmex-chat-root{right:12px;bottom:16px}#vm-chat-launch{width:58px;height:58px}#vm-chat-panel{position:fixed;right:8px;bottom:84px;width:calc(100vw - 16px);height:min(620px,calc(100dvh - 110px))}}
`;
const style=document.createElement('style');style.textContent=css;document.head.appendChild(style);
const root=document.createElement('div');root.id='valmex-chat-root';
root.innerHTML=`
<section id="vm-chat-panel" aria-label="Chat VALMEX">
<header id="vm-chat-head"><div><strong>Discută cu VALMEX</strong><small>Asistent virtual · Consultant VALMEX</small></div><button id="vm-chat-close" aria-label="Închide">×</button></header>
<div id="vm-chat-content"><div id="vm-chat-start"><p>Scrie întrebarea ta. Poți începe conversația fără să introduci date de contact.</p>
<input id="vm-chat-name" maxlength="120" placeholder="Nume (opțional)" autocomplete="name">
<input id="vm-chat-phone" maxlength="40" placeholder="Telefon (opțional)" autocomplete="tel">
<label id="vm-chat-consent"><input id="vm-chat-accept" type="checkbox"><span>Sunt de acord să transmit numele și/sau telefonul introduse pentru gestionarea solicitării. Datele nu sunt trimise dacă această căsuță rămâne nebifată.</span></label>
<button id="vm-chat-begin">Începe conversația</button></div><div id="vm-chat-log" hidden></div></div>
<div id="vm-chat-error" role="status" aria-live="polite"></div><div id="vm-chat-status">VALMEX · Republica Moldova</div>
<div id="vm-chat-compose" hidden><textarea id="vm-chat-text" maxlength="4000" placeholder="Scrie mesajul…"></textarea><button id="vm-chat-send" aria-label="Trimite mesaj">➤</button></div>
</section><button id="vm-chat-launch" aria-label="Deschide chatul VALMEX">✉</button>`;
document.body.appendChild(root);
const $=id=>document.getElementById(id);let token='',poll=null,lastCount=-1,busy=false;
function showError(s){$('vm-chat-error').textContent=s;$('vm-chat-error').style.display='block'}function clearError(){$('vm-chat-error').style.display='none'}
async function api(action,data={}){const response=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json','apikey':KEY},body:JSON.stringify({action,...data})});let result={};try{result=await response.json()}catch{}if(!response.ok||result.error)throw Error(result.error||'Chatul nu este disponibil momentan.');return result}
function restore(){try{const saved=JSON.parse(localStorage.getItem(STORE)||'null');if(saved?.token){token=saved.token;return true}}catch{}return false}
function save(){try{localStorage.setItem(STORE,JSON.stringify({token}))}catch{}}
function showChat(){$('vm-chat-start').hidden=true;$('vm-chat-log').hidden=false;$('vm-chat-compose').hidden=false}
function escapeHTML(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function senderLabel(t){return t==='visitor'?'Tu':t==='ai'?'Asistent VALMEX':t==='operator'?'Consultant VALMEX':'VALMEX'}
async function history(){if(!token)return;const result=await api('visitor_history',{session_token:token});showChat();const messages=result.messages||[];if(messages.length===lastCount)return;lastCount=messages.length;$('vm-chat-log').innerHTML=messages.map(m=>`<div class="vm-chat-msg ${m.sender_type==='visitor'?'vm-me':m.sender_type==='ai'?'vm-ai':''}">${escapeHTML(m.body)}<small>${senderLabel(m.sender_type)} · ${new Date(m.created_at).toLocaleTimeString('ro-MD',{hour:'2-digit',minute:'2-digit'})}</small></div>`).join('');$('vm-chat-content').scrollTop=$('vm-chat-content').scrollHeight}
async function begin(){if(busy)return;const name=$('vm-chat-name').value.trim(),phone=$('vm-chat-phone').value.trim(),consent=$('vm-chat-accept').checked;if((name||phone)&&!consent){showError('Bifează acordul pentru a transmite datele de contact sau șterge câmpurile și continuă fără ele.');return}busy=true;$('vm-chat-begin').disabled=true;clearError();try{const result=await api('start',{name:consent?name:'',phone:consent?phone:'',consent});token=result.session_token;save();await history();startPolling();$('vm-chat-text').focus()}catch(e){showError(e.message)}finally{busy=false;$('vm-chat-begin').disabled=false}}
async function send(){const input=$('vm-chat-text'),message=input.value.trim();if(!message||busy||!token)return;busy=true;$('vm-chat-send').disabled=true;$('vm-chat-status').textContent='Se transmite mesajul…';clearError();try{const result=await api('visitor_send',{session_token:token,message});input.value='';lastCount=-1;await history();$('vm-chat-status').textContent=result.ai_error?'Mesaj trimis. Un consultant VALMEX poate reveni în conversație.':'VALMEX · Asistent virtual activ'}catch(e){showError(e.message);$('vm-chat-status').textContent='VALMEX · Republica Moldova'}finally{busy=false;$('vm-chat-send').disabled=false;input.focus()}}
function startPolling(){stopPolling();poll=setInterval(async()=>{if(!token||!$('vm-chat-panel').classList.contains('vm-open'))return;try{lastCount=-1;await history()}catch(e){stopPolling();showError('Conexiunea a fost întreruptă. Redeschide chatul.')}},4500)}
function stopPolling(){if(poll){clearInterval(poll);poll=null}}
$('vm-chat-launch').onclick=async()=>{$('vm-chat-panel').classList.add('vm-open');$('vm-chat-launch').style.display='none';clearError();if(restore()){try{await history();startPolling()}catch{localStorage.removeItem(STORE);token='';$('vm-chat-start').hidden=false;$('vm-chat-log').hidden=true;$('vm-chat-compose').hidden=true;showError('Sesiunea anterioară a expirat. Începe o conversație nouă.')}}};
$('vm-chat-close').onclick=()=>{$('vm-chat-panel').classList.remove('vm-open');$('vm-chat-launch').style.display='block';stopPolling()};
$('vm-chat-begin').onclick=begin;$('vm-chat-send').onclick=send;$('vm-chat-text').onkeydown=e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send()}};
})();
    var s = list[i], fz = s.slice(-1) === '~'; if (fz) s = s.slice(0, -1);
    for (var j = 0; j < ws.length; j++) {
      var w = ws[j];
      if (w.indexOf(s) === 0) return true;
      if (fz && w.length >= s.length - 1 && lev(w.slice(0, s.length), s) <= (s.length >= 7 ? 2 : 1)) return true;
    }
  }
  return false;
}
function money(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }
function show(n) { return String(n).replace('.', ','); }
function num(s) { s = s.replace(/[.,]+$/, ''); return /^\d{1,3}([.,]\d{3})+$/.test(s) ? +s.replace(/[.,]/g, '') : +s.replace(',', '.'); }

/* Suprafața: număr cu unitate (120 m2) sau număr simplu */
function areaOf(t) {
  var m = t.replace(/[?!]+$/, '').match(/(\d[\d.,]*)\s*(m2|m²|mp|metri(?: patrati)?|m)?(?![a-z0-9])/);
  if (!m) return null;
  var rest = t.replace(m[0], ' ').replace(/[?!.,]+/g, ' ').trim();
  return { n: num(m[1]), unit: !!m[2], filler: /^(?:(?:cam|circa|aprox\w*|are|este|am|suprafata|de|la|vreau|in jur de)\s*)*$/.test(rest) };
}

function areaReply(n, tp) {
  if (tp === 'tile' && C.tilePrice && isFinite(n) && n >= 5 && n <= 10000) {
    var m = n * C.tilePrice, wa = m * (1 + C.accPct / 100);
    return {
      t: 'Pentru **' + show(n) + ' m²** de țiglă metalică: doar materialul, fără accesorii = **' + money(m) + ' lei** (' + C.tilePrice + ' lei/m²). Cu accesorii (orientativ +' + C.accPct + '%) rezultă aproximativ **' + money(wa) + ' lei**.\nEste o estimare orientativă; calculul final îl face echipa Valmex.',
      acts: [A.offer, A.call],
      chips: [Q.contact, Q.roof],
      topic: 'roof',
      area: n
    };
  }
  if (tp === 'tile') tp = 'roof';
  if (isFinite(n) && n >= 5 && n <= 10000 && !(tp === 'roof' ? C.roofFrom : C.facadeFrom))
    return { t: 'Pentru **' + show(n) + ' m²** nu pot da o estimare: prețul se confirmă de operator după evaluarea proiectului. Îți pregătesc solicitarea?', acts: [A.offer, A.call], chips: [Q.calc, Q.contact], topic: tp, area: n };
  if (!isFinite(n)) return { t: 'Nu am înțeles suprafața. Scrie un număr, de exemplu „120 m²”.', topic: tp, awaitArea: true };
  if (n < 5 || n > 10000) return { t: 'Suprafața introdusă (' + show(n) + ' m²) nu pare validă. Scrie o valoare între 5 și 10 000 m².', topic: tp, awaitArea: true };
  var roof = tp === 'roof', p = roof ? C.roofFrom : C.facadeFrom;
  return {
    t: 'Pentru **' + show(n) + ' m²** de ' + (roof ? 'acoperiș' : 'fațadă') + ', la prețul minim publicat (de la ' + p + ' lei/m²), rezultă **de la ' + money(n * p) + ' lei**.\nEste o estimare orientativă, nu o ofertă finală: prețul depinde de model, complexitate și accesorii și îl confirmă echipa Valmex.',
    cards: [roof ? CARDS.cRoof : CARDS.cFac],
    acts: [A.offer, A.call],
    chips: [Q.contact, Q.calc],
    topic: tp,
    area: n
  };
}

function faqMatch(ws) {
  var F = (KB.faq && KB.faq.faq) || [];
  for (var i = 0; i < F.length; i++) {
    var e = F[i];
    if (!e.keywords || !hit(ws, e.keywords.join(' '))) continue;
    if (typeof e.answer === 'string' && e.answer)
      return { t: e.answer, acts: [A.offer, A.call], chips: [Q.contact] };
    return { t: 'Nu am această informație confirmată: o stabilește echipa Valmex pentru proiectul tău.', acts: [A.call, A.offer] };
  }
  return null;
}

/* route(text, ctx) -> { t, cards?, acts?, chips?, form?, topic?, awaitArea?, area? } */
function routeGeneral(raw, ctx) {
  var t = norm(raw), ws = words(raw);
  var roof = hit(ws, 'acoperi~ sarpant'), fac = hit(ws, 'fatad~ tencuial~ silicon termoizol');
  if (hit(ws, 'ofert solicit comand masur consultat programar')) return { startLead: true, t: '' };
  var a = areaOf(t);
  if (a && !a.unit && !ctx.awaitArea && !roof && !fac) a = null;
  if (a) {
    var tp = roof && !fac ? 'roof' : fac && !roof ? 'facade' : (!roof && !fac && ctx.awaitArea && a.filler ? ctx.topic : null);
    if (tp) return areaReply(a.n, tp);
    if (a.unit) return { t: 'La ce lucrare se referă suprafața de **' + show(a.n) + ' m²**?', chips: ['Acoperiș ' + show(a.n) + ' m²', 'Fațadă ' + show(a.n) + ' m²'] };
  }

  if (hit(ws, 'calculator~ calcul')) {
    if (hit(ws, 'amk panou')) return { t: 'Calculatorul AMK estimează numărul de panouri și materialele de montaj.', cards: [CARDS.cAmk], chips: [Q.amk] };
    if (fac) return { t: 'Calculatorul de fațadă te ajută cu materialele pentru tencuială decorativă și termoizolație.', cards: [CARDS.cFac], chips: [Q.facade] };
    if (roof) return { t: 'Calculatorul de acoperiș estimează suprafața, șuruburile și folia necesare.', cards: [CARDS.cRoof], chips: [Q.roof] };
    return { t: 'Pe site ai trei calculatoare online. Alege-l pe cel potrivit proiectului tău:', cards: [CARDS.cRoof, CARDS.cFac, CARDS.cAmk], chips: [Q.contact] };
  }

  if (hit(ws, 'ofert solicit comand masur consultat programar')) return { startLead: true, t: '' };

  if (hit(ws, 'contact~ telefon~ numar whatsapp~ viber email mail orar adresa facebook social suna program'))
    return {
      t: 'Ne poți contacta **luni–sâmbătă, 09:00–18:00**:\n• Telefon / WhatsApp / Viber: [' + C.telShow + '](tel:' + C.tel + ')\n• Email: [' + C.mail + '](mailto:' + C.mail + ')\n• Facebook: [pagina Valmex](' + C.fb + ')',
      acts: [A.call, A.wa, { l: 'Viber', h: C.viber }, A.contact],
      chips: [Q.calc]
    };

  if (hit(ws, 'grosime~ vopsea otel coreea lungime~ latime~ dimensiun~ rate plata avans culor~ include~ inclus')) {
    var fq0 = faqMatch(ws);
    if (fq0) return fq0;
  }

  var pm = productMatch(raw);
  if (pm.length) return prodReply(pm);

  if (hit(ws, 'proiect~ lucrar~ portofoliu poze imagini foto exemple inainte')) {
    var pcat = '';
    PCAT.forEach(function (x) { if (!pcat && hit(ws, x[0])) pcat = x[1]; });
    var pcs = projCards(pcat);
    return pcs.length
      ? { t: 'Valmex are **500+ proiecte** finalizate. Iată ' + (pcat ? 'proiecte reale din categoria aleasă' : 'câteva proiecte reale') + ', iar galeria completă e pe site:', cards: pcs, acts: [A.offer], chips: [Q.contact] }
      : { t: 'Pentru această categorie nu am încă imagini cu proiecte reale în chat. Galeria completă o găsești pe site:', acts: [btnProj(), A.offer] };
  }

  if (C.tilePrice && hit(ws, 'tigla~') && hit(ws, 'cost pret cat lei'))
    return {
      t: 'Țigla metalică (doar materialul, fără accesorii) costă **' + C.tilePrice + ' lei/m²**. Dacă vrei și accesoriile, adaugă orientativ **' + C.accPct + '%**, iar calculul final îl face operatorul.\nCe suprafață ai? (ex. „120 m²”) și îți calculez o estimare.',
      cards: [CARDS.roof],
      acts: [A.offer],
      chips: [Q.roof, Q.contact],
      topic: 'tile',
      awaitArea: true
    };

  if (hit(ws, 'tigla~ dakia melano lider kvadro florenti karelia'))
    return {
      t: 'Modele de țiglă metalică: **' + C.tiles.join(', ') + '**.\nDisponibilitatea și culorile se confirmă cu echipa Valmex. Spune-mi suprafața și îți arăt o estimare orientativă.',
      cards: [CARDS.roof],
      acts: [A.offer],
      chips: [Q.roof, Q.calc],
      topic: 'roof',
      awaitArea: true
    };

  if (roof && fac)
    return {
      t: (C.roofFrom && C.facadeFrom ? 'Prețuri: acoperișuri de la **' + C.roofFrom + ' lei/m²**, fațade decorative de la **' + C.facadeFrom + ' lei/m²**. ' : 'Prețurile se confirmă de operator în funcție de proiect. ') + 'Pentru ce lucrare vrei o estimare?',
      chips: [Q.roof, Q.facade]
    };

  if (roof)
    return {
      t: (C.roofFrom ? 'Montajul de acoperiș la cheie pornește de la **' + C.roofFrom + ' lei/m²**' + (incl('roofing_prices', 'lucrare la cheie') ? ' și include ' + incl('roofing_prices', 'lucrare la cheie') + '. Prețul final depinde de model și complexitate.' : ', în funcție de modelul de țiglă, complexitate și accesorii.') : 'Prețul unui acoperiș depinde de modelul de țiglă, suprafață, complexitate și accesorii, și se confirmă de operator.') + '\nCe suprafață are acoperișul tău? (ex. „120 m²”)',
      cards: [CARDS.roof, CARDS.cRoof],
      acts: [A.offer],
      chips: [Q.tile, Q.contact],
      topic: 'roof',
      awaitArea: true
    };

  if (hit(ws, 'amk panou marmur'))
    return {
      t: 'Panourile **AMK** sunt din marmură naturală, în variantele **Mix** și **Mono**, pentru un exterior premium și durabil.\nNu am un preț confirmat pentru ele: echipa Valmex îți dă oferta exactă.',
      cards: [CARDS.amk, CARDS.cAmk],
      acts: [A.offer],
      chips: [Q.facade, Q.contact],
      topic: 'amk'
    };

  if (fac)
    return {
      t: 'Realizăm fațade decorative din tencuială siliconată. ' + (C.facadeFrom ? 'Prețul pornește de la **' + C.facadeFrom + ' lei/m²**, la cheie: include materialele (tencuială decorativă, polistiren) și manopera. Prețul final depinde de finisaj și suprafață.' : 'Prețul depinde de finisaj, suport și suprafață, și se confirmă de operator.') + '\nCe suprafață are fațada? (ex. „200 m²”)',
      cards: [CARDS.facade, CARDS.cFac],
      acts: [A.offer],
      chips: [Q.amk, Q.contact],
      topic: 'facade',
      awaitArea: true
    };

  var pv = hit(ws, 'pavaj~ dale terasa curte'), gd = hit(ws, 'gard poart porti');
  if (pv) return {
    t: 'Montăm pavaj profesional pentru curți și terase.' + (gd ? ' Executăm și garduri și porți, la comandă.' : '') + ' Prețul depinde de model și suprafață, deci îl confirmă echipa.',
    cards: gd ? [CARDS.pavaj, CARDS.gard, CARDS.poarta] : [CARDS.pavaj, CARDS.gard],
    acts: [A.offer],
    chips: [Q.contact],
    topic: 'pavaj'
  };

  if (gd) return {
    t: 'Executăm **garduri** metalice și din lemn și **porți** auto sau pietonale (culisante sau batante, cu automatizare opțională), la comandă.\nPentru preț ai nevoie de dimensiuni și model: cere o ofertă.',
    cards: [CARDS.gard, CARDS.poarta, CARDS.pavaj],
    acts: [A.offer],
    chips: [Q.contact],
    topic: 'gard'
  };

  if (hit(ws, 'renov')) return {
    t: 'Facem renovări complete de acoperișuri și fațade: diagnosticare, soluții și execuție de la A la Z.',
    cards: [CARDS.renov],
    acts: [A.offer],
    topic: 'renov'
  };

  if (hit(ws, 'proiect lucrar portofoliu exemple poze imagini foto inainte')) return {
    t: 'Valmex are **500+ proiecte** finalizate. Un proiect real prezentat pe site este acoperișul din Negureni; restul lucrărilor sunt în galeria de proiecte:',
    cards: [CARDS.negur],
    acts: [{ l: 'Toate proiectele', h: U('proiecte.html') }, A.offer]
  };

  if (hit(ws, 'garanti~')) {
    var fw = faqMatch(ws);
    if (fw) return fw;
  }
  if (hit(ws, 'garanti~')) return {
    t: 'Valmex oferă garanție extinsă pentru lucrările executate. Durata și condițiile se confirmă de echipă pentru fiecare proiect.',
    acts: [A.call, A.offer]
  };

  if (hit(ws, 'livr transport raion chisinau balti orhei zona localit')) return {
    t: 'Livrăm și montăm în toată Republica Moldova. Măsurarea și oferta personalizată sunt gratuite.',
    acts: [A.offer, A.call]
  };

  if (hit(ws, 'despre experient echipa firma companie cine')) return {
    t: 'Valmex.md are **7+ ani de experiență** și **500+ proiecte**: acoperișuri metalice, fațade decorative, panouri AMK, pavaj, garduri și porți. Executăm și montăm lucrările, nu doar vindem materiale.',
    acts: [{ l: 'Despre noi', h: U('despre.html') }, A.offer]
  };

  if (hit(ws, 'pret cost tarif')) return {
    t: 'La ce serviciu te referi? ' + (C.roofFrom && C.facadeFrom ? 'Acoperișuri de la **' + C.roofFrom + ' lei/m²**, fațade decorative de la **' + C.facadeFrom + ' lei/m²**. ' : 'Prețul final depinde de proiect și îl confirmă operatorul. ') + 'Pentru restul serviciilor oferta se confirmă de echipă.',
    chips: [Q.roof, Q.facade, Q.amk, Q.fence]
  };

  if (hit(ws, 'multumesc mersi merci')) return { t: 'Cu plăcere! Mai pot ajuta cu ceva?', chips: [Q.contact, Q.calc] };
  if (hit(ws, 'salut buna hello hei servus')) return { t: 'Salut! 👋 Cu ce te pot ajuta: acoperișuri, fațade, AMK, pavaj, garduri sau o ofertă?', chips: [Q.roof, Q.facade, Q.contact] };
  if (ws.indexOf('chei') >= 0 || hit(ws, 'geam')) return { t: 'Pentru acest serviciu nu am informații confirmate. Echipa Valmex îți poate răspunde exact.', acts: [A.call, A.offer] };
  var fq = faqMatch(ws);
  if (fq) return fq;
  return { fallback: true, t: 'Nu am această informație confirmată. Alege un subiect sau contactează echipa Valmex:', acts: [A.call, A.wa, A.offer], chips: [Q.roof, Q.facade, Q.calc] };
}

/* ===== Consultant: extragere de date și flux de solicitare ===== */
var LBL = { roof: 'Acoperiș', facade: 'Fațadă decorativă', amk: 'Fațadă AMK', pavaj: 'Pavaj', gard: 'Garduri', poarta: 'Porți', renov: 'Renovare', callback: 'Cerere de apel' };
var NEEDS_M2 = { roof: 1, facade: 1, amk: 1, pavaj: 1 };
var PLACES = ['Chișinău', 'Bălți', 'Orhei', 'Ungheni', 'Cahul', 'Soroca', 'Edineț', 'Comrat', 'Strășeni', 'Căușeni', 'Anenii Noi', 'Ialoveni', 'Hâncești', 'Criuleni', 'Telenești', 'Florești', 'Rezina', 'Drochia', 'Nisporeni', 'Dubăsari', 'Sângerei', 'Fălești', 'Cimișlia', 'Ștefan Vodă', 'Basarabeasca', 'Leova', 'Cantemir', 'Taraclia', 'Ocnița', 'Briceni', 'Rîșcani', 'Glodeni', 'Șoldănești', 'Călărași', 'Codru', 'Durlești', 'Cricova', 'Vadul lui Vodă'];

function cap(s) { return s.replace(/(^|[\s-])([a-zăâîșț])/g, function (m, a, b) { return a + b.toUpperCase(); }); }
function serviceOf(ws) {
  if (hit(ws, 'renov')) return 'renov';
  if (hit(ws, 'amk panou marmur')) return 'amk';
  if (hit(ws, 'pavaj~')) return 'pavaj';
  if (hit(ws, 'fatad~ tencuial~')) return 'facade';
  if (hit(ws, 'acoperi~ sarpant tigla~')) return 'roof';
  if (hit(ws, 'poart porti')) return 'poarta';
  if (hit(ws, 'gard')) return 'gard';
  return null;
}
function placeOf(ws) {
  var s = ' ' + ws.join(' ') + ' ';
  for (var i = 0; i < PLACES.length; i++)
    if (s.indexOf(' ' + norm(PLACES[i]) + ' ') >= 0) return PLACES[i];
  return null;
}
function phoneOf(raw) {
  var m = raw.match(/\+?\d[\d\s().-]{6,}\d/);
  if (!m) return null;
  var d = m[0].replace(/\D/g, '');
  if (d.length < 8 || d.length > 15) return null;
  if (/^373\d{8}$/.test(d)) return '+' + d;
  if (/^0\d{8}$/.test(d)) return '+373' + d.slice(1);
  if (d.length === 8) return '+373' + d;
  return '+' + d;
}
var NOT_NAME = /^(interesat|interesata|de|din|aici|client|in|la|un|o|sigur|gata|ok|bine)$/;
function trailingName(raw) {
  var m = raw.match(/\d\s+([A-Za-zĂÂÎȘȚăâîșț]{2,20})\s*$/);
  return m && !NOT_NAME.test(norm(m[1])) ? cap(m[1].toLowerCase()) : null;
}
function nameOf(raw) {
  var m = raw.match(/(?:m[aă] numesc|m[aă] cheam[aă]|numele meu (?:este|e))\s+([A-Za-zĂÂÎȘȚăâîșț-]{2,}(?:\s+[A-Za-zĂÂÎȘȚăâîșț-]{2,})?)/i);
  return m && !NOT_NAME.test(norm(m[1])) ? cap(m[1].toLowerCase()) : null;
}
function shortWords(raw, max) {
  var s = raw.trim();
  if (words(s).some(function (w) { return ['nu', 'sunt', 'vreau', 'nush', 'stiu', 'da', 'ok', 'bine', 'poate', 'cat', 'cum', 'ce', 'de', 'si'].indexOf(w) >= 0; })) return null;
  return /^[A-Za-zĂÂÎȘȚăâîșț .'-]{2,}$/.test(s) && s.length <= max ? s : null;
}
function estOf(L) {
  if (!(L.area > 0) || !(L.svc === 'roof' ? C.roofFrom : L.svc === 'facade' ? C.facadeFrom : 0) || (L.svc !== 'roof' && L.svc !== 'facade')) return '';
  return 'de la ' + money(L.area * (L.svc === 'roof' ? C.roofFrom : C.facadeFrom)) + ' lei (orientativ)';
}
function areaStr(L) { return L.area ? show(L.area) + ' m²' : (L.areaText || '—'); }
function filled(L) { return [L.svc, L.area || L.areaText || L.svc === 'callback', L.loc, L.name, L.phone, L.consent].filter(Boolean).length; }

function nextPrompt(ctx) {
  var L = ctx.lead;
  if (!L.svc) return { t: 'Perfect, pregătim o ofertă. **Ce lucrare te interesează?**', tiles: true, expect: 'svc' };
  if (!L.area && !L.areaText && L.svc !== 'callback') return { t: NEEDS_M2[L.svc] ? 'Ce **suprafață** are lucrarea? Scrie-o în m², de exemplu „120”. Dacă nu o știi, nu e o problemă.' : 'Ce **dimensiuni** are lucrarea (lungime, înălțime sau suprafață)?', opts: ['Nu știu încă'], expect: 'area' };
    if (!L.loc) return { t: L.svc === 'callback' ? 'În ce **localitate** te aflii?' : 'În ce **localitate** se află obiectul?', opts: ['Chișinău', 'Bălți', 'Orhei'], expect: 'loc' };
  if (!L.detDone && L.svc !== 'callback') return { t: 'Ai preferințe sau detalii (model, culoare, termen dorit)? Dacă nu, poți sări peste.', opts: ['Sari peste'], expect: 'details' };
  if (!L.name) return { t: 'Cum te numești? (poți sări peste)', opts: ['Sari peste'], expect: 'name' };
  if (!L.phone) return { t: 'La ce **număr de telefon** te poate contacta echipa Valmex?', expect: 'phone' };
  if (!L.consent) return { t: 'Pentru a transmite solicitarea, am nevoie de acordul tău ca datele (nume, telefon, localitate, detalii) să fie folosite pentru a pregăti oferta. [Politica de confidențialitate](' + C.privacy + ')', opts: ['Sunt de acord', 'Nu sunt de acord'], expect: 'consent' };
  return { t: 'Gata! Iată **fișa proiectului**. Verific-o, apoi o trimit echipei Valmex.', ticket: true, expect: 'send' };
}
function startLead(raw, ctx) {
  var ws = words(raw), L = ctx.lead = {};
  L.svc = serviceOf(ws) || ({ roof: 1, facade: 1, amk: 1, pavaj: 1, gard: 1, renov: 1 }[ctx.topic] ? ctx.topic : null);
  if (ctx.area && (L.svc === 'roof' || L.svc === 'facade') && L.svc === ctx.topic) L.area = ctx.area;
  var a = areaOf(norm(raw)); if (a && a.unit && a.n >= 5 && a.n <= 10000) L.area = a.n;
  L.loc = placeOf(ws) || undefined; L.phone = phoneOf(raw) || undefined; L.name = nameOf(raw) || (L.svc === 'callback' ? trailingName(raw) : null) || undefined;
  ctx.flow = 'lead'; ctx.sent = false; var p = nextPrompt(ctx); ctx.expect = p.expect; p.acts = (p.acts || []).concat(p.expect === 'svc' ? [A.form] : []);
  return p;
}
/* În timpul fluxului: completează câmpul așteptat; întrebările din afara fluxului primesc răspuns, apoi se reia solicitarea */
function flowStep(raw, ctx) {
  var L = ctx.lead, ws = words(raw), t = norm(raw), ex = ctx.expect, ok = false, g;
  if (hit(ws, 'anuleaz renunt stop las')) { ctx.flow = null; ctx.expect = null; return { t: 'Am oprit solicitarea. Spune-mi dacă vrei să o reluăm sau cu ce te mai pot ajuta.', chips: [Q.roof, Q.facade, Q.contact] }; }
  var ph = phoneOf(raw), pl = placeOf(ws), nm = nameOf(raw);
  if (ph && ex !== 'phone') L.phone = L.phone || ph; if (pl && ex !== 'loc') L.loc = L.loc || pl; if (nm && ex !== 'name') L.name = L.name || nm;
  var digress = /\?/.test(raw) || hit(ws, 'pret cost contact~ telefon~ calcul~ garanti~ proiect livr despre program orar');
  if (ex === 'svc') { var sv = serviceOf(ws); if (sv) { L.svc = sv; ok = true; } }
  else if (ex === 'area') {
    var a = areaOf(t);
    if (hit(ws, 'nu stiu nush nu am inca')) { L.areaText = 'încă nu știe'; ok = true; }
    else if (a && a.n >= 5 && a.n <= 10000 && (a.unit || a.filler)) { L.area = a.n; ok = true; }
    else if (!NEEDS_M2[L.svc] && !digress && raw.length <= 80) { L.areaText = raw.trim(); ok = true; }
  } else if (ex === 'loc') { var v = pl || (!digress && shortWords(raw, 40)); if (v) { L.loc = v; ok = true; } }
  else if (ex === 'details') { if (hit(ws, 'sari nu nimic fara')) L.detDone = L.details = '—'; else if (!digress) { L.details = raw.trim().slice(0, 300); L.detDone = true; } ok = !!L.detDone; }
  else if (ex === 'name') { if (hit(ws, 'sari prefer anonim')) { L.name = '(nespecificat)'; ok = true; } var n = ok ? null : nm || (!digress && shortWords(raw, 40)); if (n && !NOT_NAME.test(norm(n))) { L.name = cap(n.toLowerCase()); ok = true; } }
  else if (ex === 'phone') { if (ph) { L.phone = ph; ok = true; } }
  else if (ex === 'consent') {
    if (/^nu\b/.test(t)) { ctx.flow = null; ctx.expect = null; ctx.lead = {}; return { t: 'Înțeleg. Fără acord nu pot transmite datele. Poți suna direct echipa Valmex:', acts: [A.call, A.wa] }; }
    if (hit(ws, 'acord da ok bine sigur')) { L.consent = true; ok = true; }
  }
  if (!ok && digress) {
    var r = routeGeneral(raw, ctx), p = nextPrompt(ctx); r.awaitArea = false; r.expect = p.expect;
    r.t += '\n\nRevenind la solicitarea ta: ' + p.t; r.opts = p.opts; r.tiles = p.tiles; r.acts = (r.acts || []).concat(p.acts || []); return r;
  }
  if (!ok) { var q = nextPrompt(ctx); q.t = (ex === 'phone' ? 'Numărul nu pare valid. Scrie-l cu 8–15 cifre, de exemplu 078 026 212. ' : ex === 'area' ? 'Nu am înțeles suprafața. Scrie un număr între 5 și 10 000 (m²). ' : 'Nu am înțeles. ') + (ex === 'svc' ? q.t : ''); return q; }
  var nx = nextPrompt(ctx); ctx.expect = nx.expect; if (nx.ticket) ctx.flow = 'confirm'; return nx;
}
function route(raw, ctx) {
  ctx.lead = ctx.lead || {};
  if (ctx.flow === 'lead') return flowStep(raw, ctx);
  if (phoneOf(raw) && !/\?/.test(raw)) { var cp = startLead(raw, ctx); if (!ctx.lead.svc) { ctx.lead.svc = 'callback'; ctx.lead.name = ctx.lead.name || trailingName(raw) || undefined; cp = nextPrompt(ctx); ctx.expect = cp.expect; } cp.t = 'Am înțeles, pregătesc o **cerere de apel** pentru numărul ' + ctx.lead.phone + '. ' + cp.t; return cp; }
  var r = routeGeneral(raw, ctx);
  if (r.startLead) { var p = startLead(raw, ctx); p.t = (ctx.lead.svc ? 'Cu plăcere! ' : 'Cu plăcere! Vei vedea un rezumat înainte de trimitere. ') + p.t; return p; }
  return r;
}

/*BRAIN-END*/

/* ===== Interfață ===== */
var REDUCED = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
var $ = function (id) { return document.getElementById(id); };
var ICON = {
  roof: '<path d="M3 12l9-8 9 8M6 10v10h12V10M10 20v-5h4v5"/>', facade: '<path d="M5 21V4h9v17M14 9h5v12M8 8h3M8 12h3M8 16h3M3 21h18"/>',
  panel: '<path d="M4 6h16v12H4zM4 12h16M10 6v12M15 12v6"/>', pavaj: '<path d="M3 9l5-3 5 3-5 3zM11 11l5-3 5 3-5 3zM3 14l5 3 5-3M11 16l5 3 5-3"/>',
  gate: '<path d="M4 20V5M20 20V5M4 8h16M8 8v12M12 8v12M16 8v12"/>', calc: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 11h2M12 11h2M8 15h2M12 15h2M8 18h2M12 18h2"/>',
  bolt: '<path d="M13 3L5 14h6l-1 7 8-11h-6z"/>', chev: '<path d="M9 6l6 6-6 6"/>', send: '<path d="M3 20l18-8L3 4v6l11 2-11 2z" fill="currentColor"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>', redo: '<path d="M20 12a8 8 0 1 1-2.5-5.8M20 4v5h-5"/>', chat: '<path d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-5 4v-4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.500 8-8 9-4.500-1-8-4-8-9V6z"/><path d="M8.500 12l2.500 2.500L16 9.500"/>', clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', star: '<path d="M12 3l2.700 5.600 6.100.8-4.500 4.200 1.100 6.100L12 16.800 6.600 19.700l1.100-6.100L3.200 9.400l6.100-.8z"/>'
};
function svg(n, s) { return '<svg width="' + (s || 24) + '" height="' + (s || 24) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICON[n] + '</svg>'; }
var BOT = '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="22" fill="#fff" stroke="#e30613" stroke-width="3"/><rect x="11" y="15" width="26" height="19" rx="8" fill="#16161a"/><circle cx="19" cy="24" r="2.800" fill="#fff"/><circle cx="29" cy="24" r="2.800" fill="#fff"/><path d="M24 15v-4" stroke="#16161a" stroke-width="2.500" stroke-linecap="round"/><circle cx="24" cy="10" r="2" fill="#e30613"/></svg>';

var log = $('vxLog'), input = $('vxInput'), sendBtn = $('vxSend'), root = $('valmex-chat'), panel = $('vxPanel'), launch = $('vxLaunch');
var ctx = { lead: {} }, busy = false, closed = false, finishTyping = null;

function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function fmt(text) {
  return esc(text).replace(/\[([^\]]+)\]\(((?:https?:\/\/|tel:|mailto:|viber:\/\/)[^)\s]+)\)|\*\*([^*]+)\*\*/g, function (m, label, url, bold) {
    if (bold) return '<strong>' + bold + '</strong>';
    return '<a href="' + url + '"' + (/^https?:/.test(url) ? ' target="_blank" rel="noopener"' : '') + '>' + label + '</a>';
  }).replace(/\n/g, '<br>');
}
function now() { var d = new Date(); return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); }
function down(smooth, force) { if (force || log.scrollHeight - log.scrollTop - log.clientHeight < 140) log.scrollTo({ top: log.scrollHeight, behavior: smooth && !REDUCED ? 'smooth' : 'auto' }); }

/* Efect de scriere: dezvăluie textul caracter cu caracter, păstrând linkurile și formatarea */
function typeInto(node, html, done) {
  node.innerHTML = html;
  if (REDUCED) return done();
  var w = document.createTreeWalker(node, NodeFilter.SHOW_TEXT), list = [], n, total = 0;
  while ((n = w.nextNode())) { list.push([n, n.nodeValue]); total += n.nodeValue.length; n.nodeValue = ''; }
  var shown = 0, k = total > 320 ? 4 : total > 140 ? 2 : 1, timer;
  function paint(upto) { var left = upto; list.forEach(function (p) { var c = Math.max(0, Math.min(p[1].length, left)); p[0].nodeValue = p[1].slice(0, c); left -= c; }); }
  function finish() { clearInterval(timer); paint(total); finishTyping = null; down(); done(); }
  finishTyping = finish;
  timer = setInterval(function () { shown += k; paint(shown); down(); if (shown >= total) finish(); }, 16);
}

function userRow(text) {
  rec('u', text);
  var r = el('div', 'vx-row vx-user'), c = el('div', 'vx-col');
  c.append(el('div', 'vx-bubble', text), el('div', 'vx-time', now())); r.append(c); log.append(r); down(true, true);
}
function botShell() {
  var r = el('div', 'vx-row vx-bot'), av = el('span', 'vx-av'), c = el('div', 'vx-col');
  av.innerHTML = BOT; r.append(av, c); return { r: r, c: c };
}
function btn(a) {
  var b;
  if (a.h) { b = el('a', 'vx-btn' + (a.p ? ' vx-p' : ''), a.l); b.href = a.h; if (/^https?:/.test(a.h)) { b.target = '_blank'; b.rel = 'noopener'; } }
  else { b = el('button', 'vx-btn' + (a.p ? ' vx-p' : ''), a.l); b.type = 'button'; b.onclick = function () { if (a.fn === 'form') showForm(); else if (a.fn === 'wa') window.open(waLink(), '_blank', 'noopener'); else ask('Vreau o ofertă'); }; }
  return b;
}
function renderExtras(col, rep) {
  var delay = 0;
  if (rep.cards) {
    var wrap = el('div', 'vx-cards');
    rep.cards.forEach(function (cd) {
      var a = el('a', 'vx-card'); a.href = cd.h; a.target = '_blank'; a.rel = 'noopener'; a.style.animationDelay = (delay += 90) + 'ms';
      var th;
      if (cd.img) { th = el('img'); th.alt = cd.t; th.loading = 'lazy'; th.decoding = 'async'; th.onerror = function () { var f = el('span', 'vx-ci'); f.innerHTML = svg(cd.fb || 'roof', 30); th.replaceWith(f); }; th.src = cd.img; }
      else { th = el('span', 'vx-ci'); th.innerHTML = svg(cd.icon || cd.fb || 'roof', 28); }
        var p = $('vxProgress'), done = rows.filter(function (r) { return !!r[1]; }).length;
  p.style.width = Math.round(done / rows.length * 100) + '%';
  $('vxSheet').parentNode.setAttribute('data-progress', done + '/' + rows.length);
}
function ask(text) {
  if (busy || closed) return;
  if (finishTyping) finishTyping();
  input.value = text; send();
}
function send() {
  var raw = clean(input.value); if (!raw || busy || closed) return;
  input.value = ''; userRow(raw); busy = true; sendBtn.disabled = true;
  var rep = route(raw, ctx);
  if (rep.ticket) { ctx.flow = 'confirm'; ctx.expect = 'send'; }
  botRow(rep);
  renderSheet();
}
function errRow(text) {
  botRow({ t: text, acts: [A.call, A.wa] }, true);
}
function showForm() {
  var f = buildForm(), s = botShell();
  s.c.append(f); log.append(s.r); down(true, true);
}
function newChat() {
  if (finishTyping) finishTyping();
  endChat('conversație nouă');
  ctx = { lead: {}, tx: [], txSent: 0 };
  log.innerHTML = '';
  closed = false; busy = false;
  sendBtn.disabled = false;
  save(); renderSheet();
  botRow({ t: 'Bună! Sunt asistentul virtual VALMEX. Cu ce te pot ajuta?', tiles: true, chips: [Q.roof, Q.facade, Q.contact] }, true);
}
function closeChat() {
  endChat('închidere');
  closed = true;
  hidePanel();
}
function init() {
  if (restore()) return;
  newChat();
}
sendBtn.addEventListener('click', send);
input.addEventListener('keydown', function (e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    send();
  }
});
launch.addEventListener('click', function () {
  if (root.classList.contains('vx-open')) hidePanel();
  else openPanel();
});
$('vxClose').addEventListener('click', closeChat);
$('vxNew').addEventListener('click', newChat);
window.addEventListener('pagehide', function () { endChat('părăsirea paginii', true); });
init();
      function lift() { var cb = document.querySelector('.cookie-banner.show'); root.style.setProperty('--vx-lift', (cb ? cb.offsetHeight + 16 : 0) + 'px'); }
  if (window.MutationObserver) new MutationObserver(lift).observe(document.body, { subtree: true, attributes: true, attributeFilter: ['class'] }); lift(); window.addEventListener('resize', lift);
  window.addEventListener('pagehide', function () { endChat('pagină închisă', true); });
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') endChat('pagină părăsită', true); });
  /* Înălțime reală (tastatura virtuală pe mobil) */
  function sync() {
  var vv = window.visualViewport, st = root.style;
  st.setProperty('--vvh', (vv ? vv.height : window.innerHeight) + 'px'); 
  if (document.activeElement === input) down(false, true);
}
if (window.visualViewport) { visualViewport.addEventListener('resize', sync); visualViewport.addEventListener('scroll', function () { window.scrollTo(0, 0); }); }
window.addEventListener('resize', sync); sync();
renderSheet();
if (!restore()) welcome();
}
loadKB().then(start, start);

})();
