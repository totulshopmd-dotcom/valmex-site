(()=>{'use strict';
let pendingContext=null;
document.addEventListener('valmex:chat-context',e=>{pendingContext=e.detail||null;const intro=document.querySelector('#vm-chat-start p');if(intro&&pendingContext)intro.textContent='Discutăm despre: '+(pendingContext.message||'serviciul selectat')+' Poți începe fără date de contact.';});
const API='https://qejnbbzhpvfjeqzwotwt.supabase.co/functions/v1/valmex-chat-api';
const KEY='sb_publishable_xbF3ggFeZ475werOTmFWvA_Ho_cxYov';
const STORE='valmex_public_chat_session_v1';
if(document.getElementById('valmex-chat-root'))return;
const css=`
#valmex-chat-root{position:fixed;right:20px;bottom:22px;z-index:100001;font-family:Arial,system-ui,sans-serif;color:#20242b;pointer-events:none}#valmex-chat-root #vm-chat-launch,#valmex-chat-root #vm-chat-panel{pointer-events:auto}
#vm-chat-launch{width:58px;height:58px;border:0;border-radius:50%;background:#e30613;color:#fff;box-shadow:0 5px 16px rgba(20,24,32,.18);cursor:pointer;display:grid;place-items:center;transition:background .2s,box-shadow .2s}
90%{box-shadow:0 8px 24px rgba(20,24,32,.22),0 0 0 10px rgba(227,6,19,0)}}
#vm-chat-launch:hover{background:#c90010;box-shadow:0 7px 20px rgba(20,24,32,.22)}
#vm-chat-launch svg{width:27px;height:27px;display:block}
#vm-chat-panel{display:none;position:fixed;right:20px;bottom:94px;width:min(400px,calc(100vw - 32px));height:min(640px,calc(100dvh - 120px));max-height:calc(100dvh - 120px);background:#fff;border:1px solid #e8e9ec;border-radius:18px;box-shadow:0 16px 48px rgba(15,20,30,.22);overflow:hidden;flex-direction:column;z-index:100002}
#vm-chat-panel.vm-open{display:flex}#vm-chat-head{background:#171b22;color:#fff;padding:16px 17px;display:flex;justify-content:space-between;align-items:center}
#vm-chat-head strong{font-size:16px}#vm-chat-head small{display:block;color:#c0c5cc;margin-top:4px;font-size:11px}
#vm-chat-close{border:0;background:transparent;color:#fff;font-size:24px;cursor:pointer}
#vm-chat-content{padding:16px;overflow:auto;flex:1;background:#f5f6f8}
#vm-chat-start p{font-size:13px;color:#59616d;line-height:1.5;margin:0 0 13px}
#vm-chat-options{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin:0 0 12px}
#vm-chat-options button{border:1px solid #dfe2e7;background:#fff;color:#303640;border-radius:9px;padding:11px 9px;text-align:left;font-size:12px;font-weight:700;line-height:1.3;min-height:48px}
#vm-chat-options button:hover{border-color:#d83232;background:#fffafa}
#vm-chat-first-message{width:100%;min-height:66px;resize:vertical;border:1px solid #d8dce2;border-radius:8px;padding:10px;font:13px Arial;box-sizing:border-box;margin:0 0 9px}
#vm-chat-start button#vm-chat-begin{width:100%}

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
.vm-chat-file{display:inline-flex;align-items:center;gap:8px;margin-top:5px;padding:10px 12px;border-radius:9px;background:#fff;border:1px solid #d83232;color:#bd2029;text-decoration:none;font-weight:700;font-size:12px}
.vm-chat-file:hover{background:#fff5f5}.vm-chat-file-error{margin-top:5px;padding:9px 11px;border-radius:8px;background:#fff7ed;color:#9a3412;font-size:11px}
.vm-chat-file:before{content:"↓";font-size:17px;line-height:1}

#vm-chat-status{font-size:11px;color:#667085;padding:0 12px 7px;min-height:20px;display:flex;align-items:center;gap:7px}#vm-chat-status.vm-processing{color:#b4232c;font-weight:600}#vm-chat-status.vm-processing:before{content:"";width:7px;height:7px;border-radius:50%;background:#d83232;animation:vmStatusPulse 1s ease-in-out infinite}@keyframes vmStatusPulse{0%,100%{opacity:.35;transform:scale(.8)}50%{opacity:1;transform:scale(1.15)}}@media(prefers-reduced-motion:reduce){#vm-chat-status.vm-processing:before{animation:none}}
#vm-chat-data-consent{display:flex;align-items:flex-start;gap:7px;padding:7px 12px;color:#667085;font-size:10px;line-height:1.35;background:#fff}
#vm-chat-data-consent[hidden]{display:none}
#vm-chat-data-consent input{margin:1px 0 0;flex:none}

@media(max-width:900px){#valmex-chat-root{right:16px;bottom:16px}#vm-chat-panel{right:12px;bottom:88px;width:min(420px,calc(100vw - 24px));height:min(680px,calc(100dvh - 104px));max-height:calc(100dvh - 104px)}}@media(max-width:520px){#valmex-chat-root{right:12px;bottom:14px}#vm-chat-panel{right:8px;bottom:82px;width:calc(100vw - 16px);height:calc(100dvh - 98px);max-height:calc(100dvh - 98px);border-radius:16px}}
`;
const style=document.createElement('style');style.textContent=css;document.head.appendChild(style);
const root=document.createElement('div');root.id='valmex-chat-root';
root.innerHTML=`
<section id="vm-chat-panel" aria-label="Chat VALMEX">
<header id="vm-chat-head"><div><strong>Discută cu VALMEX</strong><small>Asistent VALMEX · Consultantul poate prelua discuția</small></div><button id="vm-chat-close" aria-label="Închide">×</button></header>
<div id="vm-chat-content"><div id="vm-chat-start"><p>Alegeți subiectul sau scrieți întrebarea. Asistentul VALMEX începe discuția, iar un consultant poate prelua conversația în orice moment.</p>
<div id="vm-chat-options">
<button type="button" data-vm-service="Acoperiș la cheie">Acoperiș la cheie</button>
<button type="button" data-vm-service="Țiglă metalică și materiale">Țiglă metalică și materiale</button>
<button type="button" data-vm-service="Fațade decorative">Fațade decorative</button>
<button type="button" data-vm-service="Fațade AMK">Fațade AMK</button>
<button type="button" data-vm-service="Garduri și porți">Garduri și porți</button>
<button type="button" data-vm-service="Rate 0%">Rate 0%</button>
<button type="button" data-vm-service="Calcul estimativ acoperiș">Calcul estimativ acoperiș</button>
<button type="button" data-vm-service="Consultație cu un consultant">Consultant VALMEX</button>
</div>
<textarea id="vm-chat-first-message" maxlength="4000" placeholder="Sau scrieți întrebarea aici…"></textarea>
<button id="vm-chat-begin">Începe conversația</button></div><div id="vm-chat-log" hidden></div></div>
<div id="vm-chat-error" role="status" aria-live="polite"></div><div id="vm-chat-status" role="status" aria-live="polite">VALMEX · Republica Moldova</div>
<label id="vm-chat-data-consent" hidden><input id="vm-chat-consent" type="checkbox"><span>Sunt de acord să transmit numărul de telefon pentru gestionarea solicitării mele.</span></label>
<div id="vm-chat-compose" hidden><textarea id="vm-chat-text" maxlength="4000" placeholder="Scrie mesajul…"></textarea><button id="vm-chat-send" aria-label="Trimite mesaj">➤</button></div>
</section><button id="vm-chat-launch" aria-label="Deschide chatul VALMEX"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20.5 11.5a8.5 8.5 0 0 1-12.9 7.3L3 20l1.2-4.2A8.5 8.5 0 1 1 20.5 11.5Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 11.5h.01M12 11.5h.01M16 11.5h.01" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg></button>`;
document.body.appendChild(root);
const $=id=>document.getElementById(id);let token='',poll=null,lastCount=-1,busy=false;
function showError(s){$('vm-chat-error').textContent=s;$('vm-chat-error').style.display='block'}function clearError(){$('vm-chat-error').style.display='none'}
async function api(action,data={}){const response=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json','apikey':KEY},body:JSON.stringify({action,...data})});let result={};try{result=await response.json()}catch{}if(!response.ok||result.error)throw Error(result.error||'Chatul nu este disponibil momentan.');return result}
function restore(){try{const saved=JSON.parse(localStorage.getItem(STORE)||'null');if(saved?.token){token=saved.token;return true}}catch{}return false}
function save(){try{localStorage.setItem(STORE,JSON.stringify({token}))}catch{}}
function showChat(){$('vm-chat-start').hidden=true;$('vm-chat-log').hidden=false;$('vm-chat-compose').hidden=false}
function escapeHTML(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function senderLabel(t){return t==='visitor'?'Tu':t==='ai'?'Asistent VALMEX':t==='operator'?'Consultant VALMEX':'VALMEX'}
async function history(){if(!token)return null;const result=await api('visitor_history',{session_token:token});const messages=result.messages||[];if(messages.length){showChat()}else{$('vm-chat-start').hidden=false;$('vm-chat-log').hidden=true;$('vm-chat-compose').hidden=true}updateModeStatus(result.conversation);if(messages.length===lastCount)return result;lastCount=messages.length;$('vm-chat-log').innerHTML=messages.map(m=>m.message_type==='attachment'?(`<div class="vm-chat-msg vm-ai">${m.attachment_url?`<a class="vm-chat-file" href="${escapeHTML(m.attachment_url)}" download target="_blank" rel="noopener">Descarcă oferta PDF</a>`:'<div class="vm-chat-file-error">PDF-ul este momentan indisponibil pentru descărcare.</div>'}<small>${senderLabel(m.sender_type)} · ${new Date(m.created_at).toLocaleTimeString('ro-MD',{hour:'2-digit',minute:'2-digit'})}</small></div>`):(`<div class="vm-chat-msg ${m.sender_type==='visitor'?'vm-me':m.sender_type==='ai'?'vm-ai':''}">${escapeHTML(m.body)}<small>${senderLabel(m.sender_type)} · ${new Date(m.created_at).toLocaleTimeString('ro-MD',{hour:'2-digit',minute:'2-digit'})}</small></div>`)).join('');$('vm-chat-content').scrollTop=$('vm-chat-content').scrollHeight;const latest=messages[messages.length-1];if(latest?.sender_type==='ai')setChatStatus('Asistentul VALMEX a răspuns.');else if(latest?.sender_type==='system'&&result.conversation?.response_mode==='human')setChatStatus('Solicitarea a fost transmisă către un consultant VALMEX.');return result}
function chisinauDay(value){return new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Chisinau',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(value))}async function startFreshConversation(){const result=await api('start');token=result.session_token;save();lastCount=-1;return history()}async function begin(initialMessage=''){if(busy)return;const first=String(initialMessage||$('vm-chat-first-message').value||'').trim();if(/(?:\+?373[\s().-]*\d{2}[\s().-]*\d{3}[\s().-]*\d{3}|0\d{2}[\s().-]*\d{3}[\s().-]*\d{3}|\b\d{8}\b)/.test(first)){showError('Începeți conversația fără numărul de telefon. Îl veți putea transmite în chat după confirmarea acordului.');return}busy=true;$('vm-chat-begin').disabled=true;clearError();try{const result=await api('start');token=result.session_token;save();if(pendingContext&&pendingContext.message){const contextMessage=pendingContext.message;pendingContext=null;await api('visitor_send',{session_token:token,message:contextMessage});}if(first)await api('visitor_send',{session_token:token,message:first});await history();startPolling();$('vm-chat-text').focus()}catch(e){showError(e.message)}finally{busy=false;$('vm-chat-begin').disabled=false}}
function phoneInMessage(value){return /(?:\+?373[\s().-]*\d{2}[\s().-]*\d{3}[\s().-]*\d{3}|0\d{2}[\s().-]*\d{3}[\s().-]*\d{3}|\b\d{8}\b)/.test(String(value||''))}function updateConsentVisibility(){const show=phoneInMessage($('vm-chat-text').value);$('vm-chat-data-consent').hidden=!show;if(!show)$('vm-chat-consent').checked=false}function setChatStatus(message,processing=false){const status=$('vm-chat-status');status.textContent=message;status.classList.toggle('vm-processing',processing)}
function updateModeStatus(conversation){if(conversation?.response_mode==='human')setChatStatus('Solicitarea este transmisă către VALMEX. Asistentul automat este oprit.');else setChatStatus('Asistentul VALMEX este activ. Consultantul poate prelua discuția.')}async function send(){const input=$('vm-chat-text'),message=input.value.trim();if(!message||busy||!token)return;const hasPhone=phoneInMessage(message);if(hasPhone&&!$('vm-chat-consent').checked){$('vm-chat-data-consent').hidden=false;showError('Bifați acordul pentru a transmite numărul de telefon.');return}busy=true;$('vm-chat-send').disabled=true;setChatStatus('Mesajul a fost preluat. VALMEX AI pregătește răspunsul…',true);clearError();try{const result=await api('visitor_send',{session_token:token,message,consent:hasPhone});input.value='';$('vm-chat-consent').checked=false;$('vm-chat-data-consent').hidden=true;lastCount=-1;await history();if(result.response_mode==='human')setChatStatus('Mesajul a fost transmis. Consultantul VALMEX gestionează conversația.',false);else setChatStatus(result.ai_pending?'Mesajul a fost trimis. Asistentul VALMEX pregătește răspunsul…':'Mesajul a fost primit. Revenim în chat în scurt timp.',false)}catch(e){if(/conversația este închisă|sesiunea de chat a expirat/i.test(e.message)){try{await startFreshConversation();const retry=await api('visitor_send',{session_token:token,message,consent:hasPhone});input.value='';$('vm-chat-consent').checked=false;$('vm-chat-data-consent').hidden=true;lastCount=-1;await history();setChatStatus('Discuția precedentă s-a încheiat. Mesajul a fost trimis într-un chat nou.',false);return}catch(retryError){showError(retryError.message)}}else{showError(e.message)}setChatStatus('Nu am putut confirma trimiterea. Verificați conexiunea și încercați din nou.',false)}finally{busy=false;$('vm-chat-send').disabled=false;input.focus()}}
function startPolling(){stopPolling();poll=setInterval(async()=>{if(!token||!$('vm-chat-panel').classList.contains('vm-open'))return;try{lastCount=-1;const current=await history();if(current?.conversation?.created_at&&chisinauDay(current.conversation.created_at)!==chisinauDay(Date.now())){await startFreshConversation();setChatStatus('A început o zi nouă. Discuția continuă într-un chat nou.',false)}}catch(e){stopPolling();showError('Conexiunea a fost întreruptă. Redeschide chatul.')}},4500)}
function stopPolling(){if(poll){clearInterval(poll);poll=null}}
async function openValmexChat(){$('vm-chat-panel').classList.add('vm-open');$('vm-chat-launch').style.display='none';clearError();if(restore()){try{const previous=await history();const meta=previous?.conversation;const isNewDay=meta?.created_at&&chisinauDay(meta.created_at)!==chisinauDay(Date.now());if(meta?.status==='inchis'||isNewDay){await startFreshConversation();setChatStatus(meta?.status==='inchis'?'Conversația precedentă a fost încheiată. A început o discuție nouă.':'A început o zi nouă. Discuția continuă într-un chat nou.',false)}startPolling()}catch{localStorage.removeItem(STORE);token='';$('vm-chat-start').hidden=false;$('vm-chat-log').hidden=true;$('vm-chat-compose').hidden=true;showError('Sesiunea anterioară a expirat. Începe o conversație nouă.')}}};
window.VALMEX_CHAT={open:openValmexChat,close:()=>{$('vm-chat-panel').classList.remove('vm-open');$('vm-chat-launch').style.display='grid';stopPolling()}};
$('vm-chat-launch').onclick=openValmexChat;
$('vm-chat-close').onclick=()=>{window.VALMEX_CHAT.close()};
$('vm-chat-begin').onclick=()=>begin();document.querySelectorAll('[data-vm-service]').forEach(button=>button.onclick=()=>begin(button.getAttribute('data-vm-service')));$('vm-chat-first-message').onkeydown=e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();begin()}};$('vm-chat-send').onclick=send;$('vm-chat-text').oninput=updateConsentVisibility;$('vm-chat-text').onkeydown=e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send()}};
})();
