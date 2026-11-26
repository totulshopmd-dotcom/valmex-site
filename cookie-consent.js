/* VALMEX unified consent: essential site storage + optional analytics + push opt-in. */
(function(){
 'use strict';
 var KEY='valmexCookieConsentV2', PUSH='valmexPushConsentV2';
 function choice(){try{return localStorage.getItem(KEY)}catch(e){return null}}
 function save(v){try{localStorage.setItem(KEY,v);localStorage.setItem(PUSH,v==='accepted'?'accepted':'rejected')}catch(e){}}
 function render(){
  if(choice())return;
  if(document.querySelector('.valmex-consent'))return;
  var box=document.createElement('aside');box.className='valmex-consent';box.setAttribute('role','dialog');box.setAttribute('aria-modal','true');box.setAttribute('aria-label','Preferințe de confidențialitate');
  box.innerHTML='<strong>Preferințe de confidențialitate</strong><p>Cookie-urile tehnice sunt necesare pentru funcționarea site-ului. Dacă accepți, VALMEX poate analiza interacțiunile cu paginile și calculatoarele pentru sugestii relevante și îți poate trimite notificări despre servicii, noutăți și oferte direct pe dispozitiv. Notificările pot fi dezactivate ulterior din setările dispozitivului.</p><div class="valmex-consent-actions"><button type="button" data-choice="rejected">Refuz</button><button type="button" class="primary" data-choice="accepted">Accept</button></div>';
  document.body.appendChild(box);
  box.querySelectorAll('[data-choice]').forEach(function(b){b.addEventListener('click',function(){
    var v=b.getAttribute('data-choice');save(v);box.remove();
    if(v==='accepted')document.dispatchEvent(new CustomEvent('valmex:consent-accepted'));
    else document.dispatchEvent(new CustomEvent('valmex:consent-rejected'));
  })});
 }
 var st=document.createElement('style');st.textContent='.valmex-consent{position:fixed;left:12px;right:12px;bottom:12px;z-index:2147483000;max-width:760px;margin:0 auto;background:#fff;color:#222;border:1px solid #ddd;border-top:3px solid #e30613;border-radius:14px;padding:18px 20px;box-shadow:0 15px 45px #0003;font:14px/1.55 system-ui,Arial}.valmex-consent strong{display:block;font-size:16px;margin-bottom:6px}.valmex-consent p{margin:0 0 14px;color:#51545a}.valmex-consent-actions{display:flex;justify-content:flex-end;gap:10px}.valmex-consent-actions button{border:1px solid #ccc;background:#fff;color:#222;padding:11px 20px;border-radius:8px;font-weight:700;cursor:pointer}.valmex-consent-actions button.primary{background:#e30613;color:#fff;border-color:#e30613}@media(max-width:480px){.valmex-consent{padding:14px;font-size:13px}.valmex-consent-actions button{flex:1}}';document.head.appendChild(st);
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render);else render();
 window.ValmexCookieSettings={reset:function(){try{localStorage.removeItem(KEY);localStorage.removeItem(PUSH)}catch(e){}location.reload()},choice:choice};
})();