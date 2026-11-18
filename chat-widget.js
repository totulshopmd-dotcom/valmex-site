
(()=>{'use strict';

const API='https://qejnbbzhpvfjeqzwotwt.supabase.co/functions/v1/valmex-chat-api';
const KEY='sb_publishable_xbF3ggFeZ475werOTmFWvA_Ho_cxYov';
const STORE='valmex_public_chat_session_v1';

if(document.getElementById('valmex-chat-root'))return;

const css=`
#valmex-chat-root{position:fixed;right:20px;bottom:22px;z-index:99990;font-family:Arial,system-ui,sans-serif;color:#20242b}
#vm-chat-launch{width:62px;height:62px;border:0;border-radius:50%;background:#d83232;color:white;box-shadow:0 8px 28px #0005;cursor:pointer;font-size:25px}
#vm-chat-panel{display:none;position:absolute;right:0;bottom:76px;width:min(360px,calc(100vw - 28px));height:min(540px,calc(100dvh - 120px));background:white;border-radius:16px;box-shadow:0 12px 45px #0004;overflow:hidden;flex-direction:column}
#vm-chat-panel.vm-open{display:flex}
#vm-chat-head{background:#171b22;color:white;padding:16px 17px;display:flex;justify-content:space-between;align-items:center}
#vm-chat-head strong{font-size:16px}
#vm-chat-head small{display:block;color:#c0c5cc;margin-top:4px;font-size:11px}
#vm-chat-close{border:0;background:transparent;color:white;font-size:24px;cursor:pointer}
#vm-chat-content{padding:16px;overflow:auto;flex:1;background:#f5f6f8}
#vm-chat-start p{font-size:13px;color:#59616d;line-height:1.5;margin:0 0 13px}
#vm-chat-start input:not([type=checkbox]){width:100%;padding:11px;border:1px solid #d8dce2;border-radius:8px;margin:0 0 9px;font-size:14px;box-sizing:border-box}
#vm-chat-consent{font-size:11px;color:#68717d;display:flex;gap:7px;align-items:flex-start;margin:4px 0 13px}
#vm-chat-consent input{margin:2px 0 0}
#vm-chat-start button,#vm-chat-send{border:0;background:#d83232;color:white;font-weight:700;border-radius:8px;padding:12px 14px;cursor:pointer}
#vm-chat-start button{width:100%}
#vm-chat-log{display:flex;flex-direction:column;gap:9px}
.vm-chat-msg{max-width:86%;padding:9px 11px;border-radius:12px;background:#e6e9ee;color:#222;font-size:13px;line-height:1.45;white-space:pre-wrap;overflow-wrap:anywhere}
.vm-chat-msg.vm-me{align-self:flex-end;background:#d83232;color:white}
.vm-chat-msg small{display:block;font-size:9px;opacity:.7;margin-top:4px}
#vm-chat-compose{display:flex;gap:7px;padding:11px;border-top:1px solid #e5e7eb;background:white}
#vm-chat-text{flex:1;min-width:0;resize:none;height:42px;max-height:90px;border:1px solid #d8dce2;border-radius:8px;padding:10px;font:13px Arial;box-sizing:border-box}
#vm-chat-send{padding:0 13px}
#vm-chat-error{font-size:11px;color:#b42318;padding:0 12px 8px;display:none}
#vm-chat-status{font-size:11px;color:#667085;padding:0 12px 7px}
@media(max-width:520px){
#valmex-chat-root{right:12px;bottom:16px}
#vm-chat-launch{width:58px;height:58px}
#vm-chat-panel{position:fixed;right:8px;bottom:84px;width:calc(100vw - 16px);height:min(570px,calc(100dvh - 110px))}
}`;

const style=document.createElement('style');
style.textContent=css;
document.head.appendChild(style);

const root=document.createElement('div');
root.id='valmex-chat-root';

root.innerHTML=`
<section id="vm-chat-panel">
<header id="vm-chat-head">
<div><strong>Discută cu VALMEX</strong>
<small>Scrie-ne. Îți vom răspunde cât mai curând.</small></div>
<button id="vm-chat-close" aria-label="Închide">×</button>
</header>
<div id="vm-chat-content">
<div id="vm-chat-start">
<p>Completează datele de contact și trimite-ne întrebarea ta.</p>
<input id="vm-chat-name" maxlength="120" placeholder="Numele tău" autocomplete="name">
<input id="vm-chat-phone" maxlength="40" placeholder="Telefon" autocomplete="tel">
<label id="vm-chat-consent">
<input id="vm-chat-accept" type="checkbox">
<span>Accept prelucrarea datelor pentru a primi răspuns la solicitare.</span>
</label>
<button id="vm-chat-begin">Începe conversația</button>
</div>
<div id="vm-chat-log" hidden></div>
</div>
<div id="vm-chat-error"></div>
<div id="vm-chat-status">VALMEX · Republica Moldova</div>
<div id="vm-chat-compose" hidden>
<textarea id="vm-chat-text" maxlength="4000" placeholder="Scrie mesajul…"></textarea>
<button id="vm-chat-send">➤</button>
</div>
</section>
<button id="vm-chat-launch" aria-label="Deschide chatul VALMEX">✉</button>`;

document.body.appendChild(root);

const $=id=>document.getElementById(id);
let token='',poll=null,lastCount=-1,busy=false;

function showError(s){
$('vm-chat-error').textContent=s;
$('vm-chat-error').style.display='block';
}
function clearError(){
$('vm-chat-error').style.display='none';
}

async function api(action,data={}){
const response=await fetch(API,{
method:'POST',
headers:{
'Content-Type':'application/json',
'apikey':KEY
},
body:JSON.stringify(Object.assign({action},data))
});
let result={};
try{result=await response.json()}catch(e){}
if(!response.ok||result.error){
throw Error(result.error||'Chatul nu este disponibil momentan.');
}
return result;
}

function restore(){
try{
const saved=JSON.parse(localStorage.getItem(STORE)||'null');
if(saved&&saved.token){token=saved.token;return true;}
}catch(e){}
return false;
}

function save(){
localStorage.setItem(STORE,JSON.stringify({token}));
}

function showChat(){
$('vm-chat-start').hidden=true;
$('vm-chat-log').hidden=false;
$('vm-chat-compose').hidden=false;
}

function escapeHTML(value){
return String(value||'').replace(/[&<>"']/g,c=>({
'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
}[c]));
}

async function history(){
if(!token)return;
const result=await api('visitor_history',{session_token:token});
showChat();
const messages=result.messages||[];
if(messages.length===lastCount)return;
lastCount=messages.length;

$('vm-chat-log').innerHTML=messages.map(m=>`
<div class="vm-chat-msg ${m.sender_type==='visitor'?'vm-me':''}">
${escapeHTML(m.body)}
<small>${m.sender_type==='visitor'?'Tu':'VALMEX'} · ${new Date(m.created_at).toLocaleTimeString('ro-MD',{hour:'2-digit',minute:'2-digit'})}</small>
</div>`).join('');

$('vm-chat-content').scrollTop=$('vm-chat-content').scrollHeight;
}

async function begin(){
if(busy)return;
const name=$('vm-chat-name').value.trim();
const phone=$('vm-chat-phone').value.trim();

if(!name||!phone){
showError('Completează numele și telefonul.');
return;
}
if(!$('vm-chat-accept').checked){
showError('Este necesar acordul pentru prelucrarea datelor.');
return;
}

busy=true;
$('vm-chat-begin').disabled=true;
clearError();

try{
const result=await api('start',{name,phone,consent:true});
token=result.session_token;
save();
await history();
startPolling();
}catch(e){
showError(e.message);
}finally{
busy=false;
$('vm-chat-begin').disabled=false;
}
}

async function send(){
const input=$('vm-chat-text');
const message=input.value.trim();
if(!message||busy||!token)return;

busy=true;
$('vm-chat-send').disabled=true;
clearError();

try{
await api('visitor_send',{session_token:token,message});
input.value='';
lastCount=-1;
await history();
}catch(e){
showError(e.message);
}finally{
busy=false;
$('vm-chat-send').disabled=false;
}
}

function startPolling(){
stopPolling();
poll=setInterval(async()=>{
if(!token||!$('vm-chat-panel').classList.contains('vm-open'))return;
try{
lastCount=-1;
await history();
}catch(e){
stopPolling();
showError('Conexiunea a fost întreruptă. Redeschide chatul.');
}
},5000);
}

function stopPolling(){
if(poll){clearInterval(poll);poll=null;}
}

$('vm-chat-launch').onclick=async()=>{
$('vm-chat-panel').classList.add('vm-open');
$('vm-chat-launch').style.display='none';
clearError();

if(restore()){
try{
await history();
startPolling();
}catch(e){
localStorage.removeItem(STORE);
token='';
$('vm-chat-start').hidden=false;
$('vm-chat-log').hidden=true;
$('vm-chat-compose').hidden=true;
showError('Sesiunea anterioară a expirat. Începe o conversație nouă.');
}
}
};

$('vm-chat-close').onclick=()=>{
$('vm-chat-panel').classList.remove('vm-open');
$('vm-chat-launch').style.display='block';
stopPolling();
};

$('vm-chat-begin').onclick=begin;
$('vm-chat-send').onclick=send;

$('vm-chat-text').onkeydown=e=>{
if(e.key==='Enter'&&!e.shiftKey){
e.preventDefault();
send();
}
};

})(); 
