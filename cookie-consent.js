/* VALMEX cookie consent – smart conversion tracking runs only after explicit acceptance. */
(function(){
 'use strict'; var KEY='valmexCookieConsent';
 function choice(){try{return localStorage.getItem(KEY)}catch(e){return null}}
 function render(){if(choice())return;var box=document.createElement('aside');box.className='valmex-consent';box.setAttribute('role','dialog');box.setAttribute('aria-label','Preferințe cookie');box.innerHTML='<strong>Preferințe de confidențialitate</strong><p>Folosim stocare tehnică pentru funcționarea site-ului. Cu acordul tău, analizăm interacțiunile cu paginile și calculatoarele pentru a afișa sugestii relevante. Dacă refuzi, aceste semnale nu sunt colectate.</p><div class="valmex-consent-actions"><button type="button" class="primary" data-choice="accepted">Accept analiza</button><button type="button" data-choice="rejected">Refuz analiza</button></div>';
 document.body.appendChild(box);box.querySelectorAll('[data-choice]').forEach(function(b){b.addEventListener('click',function(){try{localStorage.setItem(KEY,b.getAttribute('data-choice'))}catch(e){}box.remove();});});}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render);else render();
 window.ValmexCookieSettings={reset:function(){try{localStorage.removeItem(KEY)}catch(e){}location.reload()},choice:choice};
})();
