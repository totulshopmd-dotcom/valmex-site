(()=>{'use strict';
let pendingContext=null;
document.addEventListener('valmex:chat-context',e=>{pendingContext=e.detail||null;const intro=document.querySelector('#vm-chat-start p');if(intro&&pendingContext)intro.textContent='Discutăm despre: '+(pendingContext.message||'serviciul selectat')+' Poți începe fără date de contact.';});
const API='https://qejnbbzhpvfjeqzwotwt.supabase.co/functions/v1/valmex-chat-api';
const KEY='sb_publishable_xbF3ggFeZ475werOTmFWvA_Ho_cxYov';
const STORE='valmex_public_chat_session_v1';
if(document.getElementById('valmex-chat-root'))return;
const css=`
#valmex-chat-root{position:fixed;right:20px;bottom:22px;z-index:99990;font-family:Arial,system-ui,sans-serif;color:#20242b}
#vm-chat-launch{width:62px;height:62px;border:0;border-radius:50%;background:#e30613;color:#fff;box-shadow:0 8px 24px rgba(20,24,32,.22);cursor:pointer;display:grid;place-items:center;transition:transform .22s,box-shadow .22s;animation:vmChatPulse 3.8s ease-in-out infinite}
@keyframes vmChatPulse{0%,82%,100%{box-shadow:0 8px 24px rgba(20,24,32,.22),0 0 0 0 rgba(227,6,19,.24)}90%{box-shadow:0 8px 24px rgba(20,24,32,.22),0 0 0 10px rgba(227,6,19,0)}}
@media(prefers-reduced-motion:reduce){#vm-chat-launch{animation:none}}
#vm-chat-launch:hover{transform:translateY(-2px);box-shadow:0 12px 28px rgba(20,24,32,.28)}
#vm-chat-launch svg{width:27px;height:27px;display:block}
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
async function history(){if(!token)return;const result=await api('visitor_history',{session_token:token});showChat();const messages=result.messages||[];if(messages.length===lastCount)return;lastCount=messages.length;$('vm-chat-log').innerHTML=messages.map(m=>`<div class="vm-chat-msg ${m.sender_type==='visitor'?'vm-me':m.sender_type==='ai'?'vm-ai':''}">${escapeHTML(m.body)}<small>${senderLabel(m.sender_type)} · ${new Date(m.created_at).toLocaleTimeString('ro-MD',{hour:'2-digit',minute:'2-digit'})}</small></div>`).join('');$('vm-chat-content').scrollTop=$('vm-chat-content').scrollHeight}
async function begin(){if(busy)return;const name=$('vm-chat-name').value.trim(),phone=$('vm-chat-phone').value.trim(),consent=$('vm-chat-accept').checked;if((name||phone)&&!consent){showError('Bifează acordul pentru a transmite datele de contact sau șterge câmpurile și continuă fără ele.');return}busy=true;$('vm-chat-begin').disabled=true;clearError();try{const result=await api('start',{name:consent?name:'',phone:consent?phone:'',consent});token=result.session_token;save();if(pendingContext&&pendingContext.message){const first=pendingContext.message;pendingContext=null;await api('visitor_send',{session_token:token,message:first});}await history();startPolling();$('vm-chat-text').focus()}catch(e){showError(e.message)}finally{busy=false;$('vm-chat-begin').disabled=false}}
async function send(){const input=$('vm-chat-text'),message=input.value.trim();if(!message||busy||!token)return;busy=true;$('vm-chat-send').disabled=true;$('vm-chat-status').textContent='Se transmite mesajul…';clearError();try{const result=await api('visitor_send',{session_token:token,message});input.value='';lastCount=-1;await history();$('vm-chat-status').textContent=result.ai_error?'Mesaj trimis. Un consultant VALMEX poate reveni în conversație.':'VALMEX · Asistent virtual activ'}catch(e){showError(e.message);$('vm-chat-status').textContent='VALMEX · Republica Moldova'}finally{busy=false;$('vm-chat-send').disabled=false;input.focus()}}
function startPolling(){stopPolling();poll=setInterval(async()=>{if(!token||!$('vm-chat-panel').classList.contains('vm-open'))return;try{lastCount=-1;await history()}catch(e){stopPolling();showError('Conexiunea a fost întreruptă. Redeschide chatul.')}},4500)}
function stopPolling(){if(poll){clearInterval(poll);poll=null}}
$('vm-chat-launch').onclick=async()=>{$('vm-chat-panel').classList.add('vm-open');$('vm-chat-launch').style.display='none';clearError();if(restore()){try{await history();startPolling()}catch{localStorage.removeItem(STORE);token='';$('vm-chat-start').hidden=false;$('vm-chat-log').hidden=true;$('vm-chat-compose').hidden=true;showError('Sesiunea anterioară a expirat. Începe o conversație nouă.')}}};
$('vm-chat-close').onclick=()=>{$('vm-chat-panel').classList.remove('vm-open');$('vm-chat-launch').style.display='block';stopPolling()};
$('vm-chat-begin').onclick=begin;$('vm-chat-send').onclick=send;$('vm-chat-text').onkeydown=e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send()}};
})();
