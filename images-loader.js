/* =====================================================================
   VALMEX.MD — ÎNCĂRCĂTOR CENTRAL DE IMAGINI
   =====================================================================
   Toate pozele site-ului sunt listate într-un singur fișier:
   images-config.csv (cheie, cale către fișier).

   CA SĂ SCHIMBI O POZĂ (banner, logo, poză de catalog etc.):
   1. Deschide images-config.csv
   2. Găsește rândul cu cheia potrivită (ex: banner-fundal-pagina-principala)
   3. Schimbă valoarea din coloana a doua cu noua cale a pozei
   4. Salvează — poza se schimbă automat, pe toate paginile unde apare.

   NU trebuie să cauți prin fiecare pagină HTML. Acest fișier citește
   CSV-ul și pune poza corectă peste tot unde găsește un element cu
   atributul data-img-key="cheia-ta".
   ===================================================================== */
(function(){
  'use strict';

  const isBlog = location.pathname.includes('/blog/');
  const base = isBlog ? '../' : '';

  window.VALMEX_IMAGES = {};

  function parseCsv(text){
    const lines = text.replace(/\r/g, '').split('\n').filter(l => l.trim().length);
    for(let i = 1; i < lines.length; i++){ // skip header row
      const idx = lines[i].indexOf(',');
      if(idx === -1) continue;
      const key = lines[i].slice(0, idx).trim();
      const path = lines[i].slice(idx + 1).trim();
      if(key) window.VALMEX_IMAGES[key] = base + path;
    }
  }

  function applyToDom(){
    document.querySelectorAll('[data-img-key]').forEach(el=>{
      const key = el.getAttribute('data-img-key');
      const url = window.VALMEX_IMAGES[key];
      if(!url) return;
      if(el.tagName === 'IMG'){
        el.src = url;
      } else {
        el.style.backgroundImage = "url('" + url + "')";
      }
    });
  }

  window.VALMEX_IMAGES_READY = fetch(base + 'images-config.csv', {cache:'no-store'})
    .then(r => r.text())
    .then(text => {
      parseCsv(text);
      applyToDom();
      return window.VALMEX_IMAGES;
    })
    .catch(err => {
      console.error('Nu am putut încărca images-config.csv — pozele rămân cele implicite din HTML.', err);
      return window.VALMEX_IMAGES;
    });

  // Helper used by products.js / projects.js / valmex.js to resolve a key to a URL,
  // falling back to the value itself if it's already a direct path (not a key).
  window.resolveImg = function(key){
    if(window.VALMEX_IMAGES && window.VALMEX_IMAGES[key]) return window.VALMEX_IMAGES[key];
    return key;
  };

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', ()=>{ if(Object.keys(window.VALMEX_IMAGES).length) applyToDom(); });
  }
})();
