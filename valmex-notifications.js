/* VALMEX OneSignal: SDK and permission prompt are started only after unified consent. */
(function(){
'use strict';
var PUSH='valmexPushConsentV2',APP='4b147332-d5be-4573-b11e-a4aa8a4c2391',started=false;
function read(){try{return localStorage.getItem(PUSH)}catch(e){return null}}
function start(){
 if(started||read()!=='accepted')return;started=true;
 window.OneSignalDeferred=window.OneSignalDeferred||[];
 var sdk=document.querySelector('script[data-valmex-onesignal]');
 if(!sdk){sdk=document.createElement('script');sdk.src='https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js';sdk.defer=true;sdk.dataset.valmexOnesignal='1';document.head.appendChild(sdk)}
 window.OneSignalDeferred.push(async function(OS){try{await OS.init({appId:APP,notifyButton:{enable:false}});if('Notification' in window&&Notification.permission==='default'&&OS.Notifications.isPushSupported())await OS.Slidedown.promptPush()}catch(e){console.warn('VALMEX OneSignal opt-in:',e)}});
}
document.addEventListener('valmex:consent-accepted',start);
/* No prompt or SDK initialization without opt-in. */
var st=document.createElement('style');st.textContent='#onesignal-bell-container,#onesignal-bell-launcher,.onesignal-bell-launcher,.onesignal-bell-launcher-button,[id*="onesignal-bell"],#valmex-push-invite{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important}';document.head.appendChild(st);
})();