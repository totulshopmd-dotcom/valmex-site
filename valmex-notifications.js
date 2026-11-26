/* VALMEX OneSignal: push invitation is initiated only by unified consent. */
(function(){
'use strict';
var PUSH='valmexPushConsentV2',APP='4b147332-d5be-4573-b11e-a4aa8a4c2391',ready=null,attempted=false;
function read(){try{return localStorage.getItem(PUSH)}catch(e){return null}}
function init(){
 window.OneSignalDeferred=window.OneSignalDeferred||[];
 var sdk=document.querySelector('script[data-valmex-onesignal]');
 if(!sdk){sdk=document.createElement('script');sdk.src='https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js';sdk.defer=true;sdk.dataset.valmexOnesignal='1';document.head.appendChild(sdk)}
 window.OneSignalDeferred.push(async function(OS){try{await OS.init({appId:APP,notifyButton:{enable:false}});ready=OS}catch(e){console.warn('VALMEX OneSignal:',e)}});
}
async function requestPush(){
 if(attempted)return;attempted=true;
 if(read()!=='accepted')return;
 if(!('Notification' in window)||Notification.permission!=='default')return;
 window.OneSignalDeferred=window.OneSignalDeferred||[];
 window.OneSignalDeferred.push(async function(OS){try{if(OS.Notifications.isPushSupported())await OS.Slidedown.promptPush()}catch(e){console.warn('VALMEX push opt-in:',e)}});
}
document.addEventListener('valmex:consent-accepted',requestPush);
document.addEventListener('valmex:consent-rejected',function(){});
/* Don't show any independent invite, launcher, or repeat prompt. */
var st=document.createElement('style');st.textContent='#onesignal-bell-container,#onesignal-bell-launcher,.onesignal-bell-launcher,.onesignal-bell-launcher-button,[id*="onesignal-bell"],#valmex-push-invite{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important}';document.head.appendChild(st);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();