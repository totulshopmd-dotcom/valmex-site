/* VALMEX OneSignal: first-visit invitation, explicit opt-in only. */
(function(){
'use strict';
var KEY='valmexPushInviteV1',APP='4b147332-d5be-4573-b11e-a4aa8a4c2391';
function read(){try{return localStorage.getItem(KEY)}catch(e){return null}}
function write(v){try{localStorage.setItem(KEY,v)}catch(e){}}
function init(){
 window.OneSignalDeferred=window.OneSignalDeferred||[];
 var sdk=document.querySelector('script[data-valmex-onesignal]');
 if(!sdk){sdk=document.createElement('script');sdk.src='https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js';sdk.defer=true;sdk.dataset.valmexOnesignal='1';document.head.appendChild(sdk)}
 window.OneSignalDeferred.push(async function(OS){
  try{await OS.init({appId:APP,notifyButton:{enable:false}});if(read()||Notification.permission!=='default'||!OS.Notifications.isPushSupported())return;setTimeout(show,7500)}
  catch(e){console.warn('VALMEX OneSignal:',e)}
 });
}
function show(){
 if(read()||Notification.permission!=='default'||document.hidden)return;
 if(document.querySelector('#vm-chat-panel.vm-open,.valmex-consent,.modal.active')){setTimeout(show,5000);return}
 var box=document.createElement('aside');box.id='valmex-push-invite';box.setAttribute('role','dialog');box.setAttribute('aria-label','Activează notificările VALMEX');
 box.innerHTML='<button type="button" class="vpi-close" aria-label="Închide">×</button><div class="vpi-copy"><strong>Noutăți VALMEX</strong><span>Primește notificări despre serviciile și ofertele noastre.</span></div><button type="button" class="vpi-allow">Activează</button>';
 document.body.appendChild(box);requestAnimationFrame(function(){box.classList.add('vpi-show')});
 function close(choice){write(choice);box.classList.remove('vpi-show');setTimeout(function(){box.remove()},250)}
 box.querySelector('.vpi-close').onclick=function(){close('dismissed')};
 box.querySelector('.vpi-allow').onclick=function(){var b=this;b.disabled=true;b.textContent='Se deschide…';window.OneSignalDeferred.push(async function(OS){try{await OS.Slidedown.promptPush();close('prompted')}catch(e){b.disabled=false;b.textContent='Încearcă din nou';console.warn(e)}})};
}
var st=document.createElement('style');st.textContent='#valmex-push-invite{position:fixed;left:16px;right:16px;bottom:92px;z-index:99988;max-width:430px;margin:auto;display:flex;align-items:center;gap:12px;padding:14px 42px 14px 15px;background:#fff;border:1px solid #eee;border-left:4px solid #e30613;border-radius:13px;box-shadow:0 12px 34px #0002;font-family:Arial,system-ui,sans-serif;opacity:0;transform:translateY(12px);transition:opacity .25s,transform .25s}#valmex-push-invite.vpi-show{opacity:1;transform:none}#valmex-push-invite .vpi-copy{display:flex;flex:1;min-width:0;flex-direction:column;gap:4px}#valmex-push-invite strong{font-size:13px;color:#20242b}#valmex-push-invite span{font-size:11px;line-height:1.4;color:#606875}#valmex-push-invite .vpi-allow{border:0;border-radius:8px;background:#e30613;color:#fff;padding:10px 12px;font-weight:700;font-size:12px;white-space:nowrap}#valmex-push-invite .vpi-close{position:absolute;right:8px;top:5px;border:0;background:none;color:#667;font-size:20px}#onesignal-bell-container,#onesignal-bell-launcher,.onesignal-bell-launcher,.onesignal-bell-launcher-button,[id*="onesignal-bell"]{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important}@media(prefers-reduced-motion:reduce){#valmex-push-invite{transition:none}}';document.head.appendChild(st);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();