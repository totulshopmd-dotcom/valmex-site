/* Valmex.md Premium Scripts v2 */
(function(){
  'use strict';

  /* ---- Before/After sliders ---- */
  document.querySelectorAll('.ba-slider').forEach(slider=>{
    const before = slider.querySelector('.ba-before');
    const handle = slider.querySelector('.ba-handle');
    if(!before || !handle) return;
    let dragging = false;
    let currentPct = 50;

    handle.setAttribute('role','slider');
    handle.setAttribute('tabindex','0');
    handle.setAttribute('aria-label','Compară înainte și după — trage sau folosește tastele stânga/dreapta');
    handle.setAttribute('aria-valuemin','0');
    handle.setAttribute('aria-valuemax','100');

    function setPct(pct){
      pct = Math.max(2, Math.min(98, pct));
      currentPct = pct;
      before.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
      handle.style.left = pct + '%';
      handle.setAttribute('aria-valuenow', Math.round(pct));
    }
    function moveFromClientX(clientX){
      const rect = slider.getBoundingClientRect();
      const pct = ((clientX - rect.left) / rect.width) * 100;
      setPct(pct);
    }
    function startDrag(){ dragging = true; slider.classList.remove('ba-hint'); }

    handle.addEventListener('mousedown', startDrag);
    slider.addEventListener('mousedown', e=>{ startDrag(); moveFromClientX(e.clientX); });
    window.addEventListener('mouseup', ()=>{ dragging = false; });
    window.addEventListener('mousemove', e=>{ if(dragging) moveFromClientX(e.clientX); });

    slider.addEventListener('touchstart', e=>{ startDrag(); moveFromClientX(e.touches[0].clientX); }, {passive:true});
    slider.addEventListener('touchmove', e=>{ if(dragging){ e.preventDefault(); moveFromClientX(e.touches[0].clientX); } }, {passive:false});
    slider.addEventListener('touchend', ()=>{ dragging = false; });

    handle.addEventListener('keydown', e=>{
      if(e.key==='ArrowLeft'){ e.preventDefault(); slider.classList.remove('ba-hint'); setPct(currentPct-5); }
      else if(e.key==='ArrowRight'){ e.preventDefault(); slider.classList.remove('ba-hint'); setPct(currentPct+5); }
    });

    setPct(50);

    // Hint animation on load: nudge the handle once so visitors see it's draggable
    if('IntersectionObserver' in window){
      const hintObserver = new IntersectionObserver((entries)=>{
        entries.forEach(entry=>{
          if(entry.isIntersecting){
            slider.classList.add('ba-hint');
            setTimeout(()=>setPct(30), 400);
            setTimeout(()=>setPct(50), 1600);
            setTimeout(()=>slider.classList.remove('ba-hint'), 2800);
            hintObserver.unobserve(slider);
          }
        });
      }, {threshold:0.5});
      hintObserver.observe(slider);
    }
  });

  /* ---- Cookie / Privacy consent banner ---- */
  (function(){
    const KEY = 'valmexCookieConsent';
    let consent = null;
    try{ consent = localStorage.getItem(KEY); }catch(e){}
    if(consent) return;
    const banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.innerHTML = '<p>Folosim cookie-uri pentru a-ți oferi cea mai bună experiență pe site. Continuând navigarea, ești de acord cu <a href="' + (location.pathname.includes('/blog/') ? '../' : '') + 'politica-confidentialitate.html">Politica de Confidențialitate</a>.</p>' +
      '<div class="cookie-banner-actions"><button class="cookie-decline" type="button">Refuz</button><button class="cookie-accept" type="button">Accept</button></div>';
    document.body.appendChild(banner);
    requestAnimationFrame(()=> banner.classList.add('show'));
    function setConsent(v){
      try{ localStorage.setItem(KEY, v); }catch(e){}
      banner.classList.remove('show');
      setTimeout(()=> banner.remove(), 300);
    }
    banner.querySelector('.cookie-accept').addEventListener('click', ()=> setConsent('accepted'));
    banner.querySelector('.cookie-decline').addEventListener('click', ()=> setConsent('declined'));
  })();

  // REV13: fără ecran introductiv; pagina se afișează imediat.

  const header = document.getElementById('mainHeader');
  if(header){
    window.addEventListener('scroll',()=>{
      header.classList.toggle('scrolled', window.scrollY > 60);
    },{passive:true});
  }


  /* ---- Buton modern: revenire la inceputul paginii ---- */
  (function(){
    if(document.getElementById('valmexBackToTop')) return;
    const style=document.createElement('style');
    style.textContent=`
      #valmexBackToTop{
        position:fixed;right:26px;bottom:112px;z-index:900;
        width:54px;height:54px;border:1px solid rgba(255,255,255,.28);
        border-radius:18px;display:grid;place-items:center;
        color:#fff;background:linear-gradient(145deg,#f21b2b,#c90012);
        box-shadow:0 10px 28px rgba(160,0,15,.28),inset 0 1px 0 rgba(255,255,255,.22);
        opacity:0;visibility:hidden;transform:translateY(12px) scale(.92);
        transition:opacity .25s ease,transform .25s ease,visibility .25s;
        cursor:pointer; -webkit-tap-highlight-color:transparent;
      }
      #valmexBackToTop.is-visible{opacity:1;visibility:visible;transform:translateY(0) scale(1)}
      #valmexBackToTop:hover{transform:translateY(-3px) scale(1.03);box-shadow:0 14px 32px rgba(160,0,15,.36)}
      #valmexBackToTop:focus-visible{outline:3px solid rgba(227,6,19,.3);outline-offset:4px}
      #valmexBackToTop svg{width:23px;height:23px;display:block}
      @media(max-width:600px){#valmexBackToTop{right:16px;bottom:102px;width:49px;height:49px;border-radius:16px}}
      @media(prefers-reduced-motion:reduce){#valmexBackToTop{transition:none}}
    `;
    document.head.appendChild(style);
    const btn=document.createElement('button');
    btn.id='valmexBackToTop';btn.type='button';btn.setAttribute('aria-label','Revino la începutul paginii');
    btn.innerHTML='<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    document.body.appendChild(btn);
    let ticking=false;
    function update(){
      btn.classList.toggle('is-visible',window.scrollY>420);
      ticking=false;
    }
    window.addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(update);ticking=true}},{passive:true});
    btn.addEventListener('click',()=>window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}));
    update();
  })();

  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link=>{
    if(link.getAttribute('href') === currentPage) link.classList.add('active');
  });

  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  },{threshold:0.08,rootMargin:'0px 0px -50px 0px'});
  reveals.forEach(el=>revealObserver.observe(el));

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  if(lightbox){
    document.querySelectorAll('.gallery-img').forEach(img=>{
      img.addEventListener('click',()=>{
        lightboxImg.src = img.querySelector('img')?.src || img.src;
        lightbox.classList.add('active');
        document.body.style.overflow='hidden';
      });
    });
    lightbox.addEventListener('click',()=>{
      lightbox.classList.remove('active');
      document.body.style.overflow='';
    });
  }

  const modal = document.getElementById('leadModal');
  const closeModalBtn = document.getElementById('closeLeadModal');
  const serviceText = document.getElementById('leadServiceText');
  let selectedService = '';

  document.querySelectorAll('.openLeadModal').forEach(btn=>{
    btn.addEventListener('click',(e)=>{
      e.preventDefault();
      selectedService = btn.dataset.service || 'Oferta Generala';
      if(serviceText) serviceText.textContent = 'Serviciu: ' + selectedService;
      if(modal){ modal.classList.add('active'); document.body.style.overflow='hidden'; }
    });
  });

  if(closeModalBtn){
    closeModalBtn.addEventListener('click',()=>{
      if(modal){ modal.classList.remove('active'); document.body.style.overflow=''; }
    });
  }
  if(modal){
    modal.addEventListener('click',e=>{ if(e.target===modal){ modal.classList.remove('active'); document.body.style.overflow=''; }});
  }

  const WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbyrmwWAe39mXcZYXrlW-MRnmHne70Ak64iFTB4lNLAKrAZVG8TI_eHQOkH0-cVeqxijbg/exec';
  const sendLeadBtn = document.getElementById('sendLeadBtn');
  const leadForm = document.getElementById('leadForm');
  async function submitLead(){
      const name = document.getElementById('leadName').value.trim();
      const phone = document.getElementById('leadPhone').value.trim();
      if(!name||!phone){ alert('Completează câmpurile.'); return; }
      sendLeadBtn.disabled=true; sendLeadBtn.textContent='Se trimite...';
      const query = WEBAPP_URL + '?name=' + encodeURIComponent(name) + '&phone=' + encodeURIComponent(phone) + '&city=' + encodeURIComponent('-') + '&product=' + encodeURIComponent('VALMEX | ' + selectedService) + '&price=' + encodeURIComponent('-') + '&t=' + Date.now();
      try{
        await fetch(query,{method:'GET',cache:'no-store'});
        const status = document.getElementById('leadStatus');
        if(status) status.style.display='block';
        document.getElementById('leadName').value='';
        document.getElementById('leadPhone').value='';
        setTimeout(()=>{
          if(modal){ modal.classList.remove('active'); document.body.style.overflow=''; }
          if(status) status.style.display='none';
        },1800);
      }catch(e){ alert('Eroare la trimitere.'); }
      sendLeadBtn.disabled=false; sendLeadBtn.textContent='Trimite';
  }
  if(sendLeadBtn){
    if(leadForm){
      leadForm.addEventListener('submit', function(e){ e.preventDefault(); submitLead(); });
    } else {
      sendLeadBtn.addEventListener('click', function(e){ e.preventDefault(); submitLead(); });
    }
  }

  const mobileToggle = document.getElementById('mobileToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  if(mobileToggle && mobileMenu){
    mobileToggle.addEventListener('click',()=>{
      mobileToggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('.nav-link').forEach(link=>{
      link.addEventListener('click',()=>{
        mobileToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow='';
      });
    });
    mobileMenu.querySelectorAll('.dropdown-toggle').forEach(toggle=>{
      toggle.addEventListener('click',e=>{
        e.preventDefault();
        toggle.closest('.dropdown').classList.toggle('open');
      });
    });
  }

  document.querySelectorAll('.faq-question').forEach(q=>{
    q.addEventListener('click',()=>{
      const item = q.closest('.faq-item');
      const wasActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(i=>i.classList.remove('active'));
      if(!wasActive) item.classList.add('active');
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach(anchor=>{
    anchor.addEventListener('click',function(e){
      const target = document.querySelector(this.getAttribute('href'));
      if(target){ e.preventDefault(); target.scrollIntoView({behavior:'smooth',block:'start'}); }
    });
  });

  const heroBg = document.getElementById('heroBg');
  if(heroBg){
    const heroSlides = [
      {
        image: 'banner-fundal-pagina-principala',
        title: 'Acoperișuri și Fațade <span style="color:var(--primary)">Premium</span> în Moldova',
        subtitle: 'Montaj profesional de acoperișuri metalice, fațade decorative siliconate și panouri AMK din marmură naturală. Calitate garantată, finisaj impecabil.'
      },
      {
        image: 'acoperisuri-acoperis-finisat2',
        title: 'Acoperișuri Metalice <span style="color:var(--primary)">de Excepție</span>',
        subtitle: 'Țiglă metalică premium, montaj profesional și garanție extinsă de 15 ani pentru acoperișul casei tale.'
      },
      {
        image: 'echipa-file-000000000a5471f499c0bfd7fa150064',
        title: 'O Echipă cu <span style="color:var(--primary)">Experiență Dovedită</span>',
        subtitle: 'Profesioniști dedicați, de la prima consultație până la ultimul detaliu al proiectului tău.'
      },
      {
        image: 'amk-fatade-amk-proiect-finisat-5',
        title: 'Panouri AMK din <span style="color:var(--primary)">Marmură Naturală</span>',
        subtitle: 'Fațade premium cu aspect de marmură naturală, montaj rapid, fără lucrări umede.'
      }
    ];
    const heroTitleEl = document.getElementById('heroTitle');
    const heroSubtitleEl = document.getElementById('heroSubtitle');
    let hi = 0;
    function imgUrl(key){ return window.resolveImg ? window.resolveImg(key) : key; }
    function showSlide(i){
      heroBg.style.opacity = '0';
      setTimeout(()=>{
        heroBg.style.backgroundImage = "url('"+imgUrl(heroSlides[i].image)+"')";
        heroBg.style.opacity = '1';
        if(heroTitleEl) heroTitleEl.innerHTML = heroSlides[i].title;
        if(heroSubtitleEl) heroSubtitleEl.textContent = heroSlides[i].subtitle;
      }, 350);
    }
    function startHeroRotation(){
      heroBg.style.backgroundImage = "url('"+imgUrl(heroSlides[0].image)+"')";
      setInterval(()=>{
        hi = (hi+1)%heroSlides.length;
        showSlide(hi);
      },5500);
    }
    if(window.VALMEX_IMAGES_READY){
      window.VALMEX_IMAGES_READY.then(startHeroRotation);
    } else {
      startHeroRotation();
    }
  }

  const contactSendBtn = document.getElementById('contactSendBtn');
  if(contactSendBtn){
    contactSendBtn.addEventListener('click',async function(){
      const name = document.getElementById('contactName').value.trim();
      const phone = document.getElementById('contactPhone').value.trim();
      const msg = document.getElementById('contactMessage').value.trim();
      if(!name||!phone){ alert('Completează numele și telefonul.'); return; }
      contactSendBtn.disabled=true; contactSendBtn.textContent='Se trimite...';
      const query = WEBAPP_URL + '?name=' + encodeURIComponent(name) + '&phone=' + encodeURIComponent(phone) + '&city=' + encodeURIComponent('-') + '&product=' + encodeURIComponent('VALMEX | Contact Page | ' + msg) + '&price=' + encodeURIComponent('-') + '&t=' + Date.now();
      try{
        await fetch(query,{method:'GET',cache:'no-store'});
        const status = document.getElementById('contactStatus');
        if(status) status.style.display='block';
        document.getElementById('contactName').value='';
        document.getElementById('contactPhone').value='';
        document.getElementById('contactMessage').value='';
        setTimeout(()=>{ if(status) status.style.display='none'; },3000);
      }catch(e){ alert('Eroare la trimitere.'); }
      contactSendBtn.disabled=false; contactSendBtn.textContent='Trimite Mesaj';
    });
  }

  const calcBtn = document.getElementById('calcBtn');
  const calcResult = document.getElementById('calcResult');
  if(calcBtn){
    calcBtn.addEventListener('click',function(){
      const type = parseInt(document.getElementById('roofType').value);
      const length = parseFloat(document.getElementById('roofLength').value)||0;
      const width = parseFloat(document.getElementById('roofWidth').value)||0;
      const slope = parseFloat(document.getElementById('roofSlope').value)||0;
      const eave = (parseFloat(document.getElementById('roofEave').value)||0)/100;
      const model = document.getElementById('roofModel').value;
      if(!length||!width){ alert('Completează dimensiunile.'); return; }
      let area = (length+eave*2)*(width+eave*2);
      if(type===2) area*=1.15; if(type===4) area*=1.25; if(slope>0) area*=1+slope/300;
      const screws = Math.ceil(area*8); const foil = Math.ceil(area*1.1);
      const materialPrice = Math.ceil(area*136);
      const turnkeyPrice = Math.ceil(area*950);
      calcResult.style.display='block';
      calcResult.innerHTML = '<h3>Rezultat Estimativ</h3><p><b>Model:</b> '+model+'</p><p><b>Suprafață:</b> '+area.toFixed(1)+' m²</p><p><b>Șuruburi:</b> ~'+screws+' buc</p><p><b>Folie:</b> ~'+foil+' m²</p><div style="margin-top:16px;padding-top:16px;border-top:1px solid var(--border)"><p><b>Doar țiglă metalică (136 lei/m²):</b> ~'+materialPrice.toLocaleString('ro-RO')+' lei</p><p><b>Montaj la cheie (de la 950 lei/m²):</b> ~'+turnkeyPrice.toLocaleString('ro-RO')+' lei</p></div><p style="margin-top:10px;font-size:13px;color:#777">*Calcule și prețuri orientative. Contactează-ne pentru ofertă exactă.</p>';
    });
  }

  const facadeCalcBtn = document.getElementById('facadeCalcBtn');
  const facadeCalcResult = document.getElementById('facadeCalcResult');
  if(facadeCalcBtn){
    facadeCalcBtn.addEventListener('click',function(){
      const area = parseFloat(document.getElementById('facadeArea').value)||0;
      const type = document.getElementById('facadeType').value;
      const windows = parseInt(document.getElementById('facadeWindows').value)||0;
      if(!area){ alert('Completează suprafața.'); return; }
      const netArea = Math.max(0, area - windows*1.5);
      const adhesive = Math.ceil(netArea * 5);
      const mesh = Math.ceil(netArea * 1.1);
      const primer = Math.ceil(netArea * 0.3);
      const facadePrice = Number(window.VALMEX_CMS && window.VALMEX_CMS.prices && window.VALMEX_CMS.prices.facade);
      const turnkeyPrice = facadePrice > 0 ? Math.ceil(netArea*facadePrice) : null;
      facadeCalcResult.style.display='block';
      facadeCalcResult.innerHTML = '<h3>Rezultat Estimativ</h3><p><b>Tip:</b> '+type+'</p><p><b>Suprafață netă:</b> '+netArea.toFixed(1)+' m²</p><p><b>Adeziv:</b> ~'+adhesive+' kg</p><p><b>Plasă armare:</b> ~'+mesh+' m²</p><p><b>Grund:</b> ~'+primer+' L</p><div style="margin-top:16px;padding-top:16px;border-top:1px solid var(--border)">'+(turnkeyPrice !== null ? '<p><b>Fațadă decorativă (tarif CMS: '+facadePrice+' lei/m²):</b> ~'+turnkeyPrice.toLocaleString('ro-RO')+' lei</p>' : '<p><b>Preț:</b> Se confirmă prin ofertă.</p>')+'</div><p style="margin-top:10px;font-size:13px;color:#777">*Calcule și prețuri orientative. Oferta finală se confirmă după evaluarea proiectului.</p>';
    });
  }

  const amkCalcBtn = document.getElementById('amkCalcBtn');
  const amkCalcResult = document.getElementById('amkCalcResult');
  if(amkCalcBtn){
    amkCalcBtn.addEventListener('click',function(){
      const area = parseFloat(document.getElementById('amkArea').value)||0;
      const model = document.getElementById('amkModel').value;
      if(!area){ alert('Completează suprafața.'); return; }
      const panels = Math.ceil(area / 0.36);
      const adhesive = Math.ceil(area * 4);
      const screws = Math.ceil(area * 12);
      amkCalcResult.style.display='block';
      amkCalcResult.innerHTML = '<h3>Rezultat Estimativ</h3><p><b>Model:</b> '+model+'</p><p><b>Suprafață:</b> '+area.toFixed(1)+' m²</p><p><b>Panouri AMK:</b> ~'+panels+' buc</p><p><b>Adeziv:</b> ~'+adhesive+' kg</p><p><b>Dibluri:</b> ~'+screws+' buc</p><p style="margin-top:10px;font-size:13px;color:#777">*Calcule orientative. Contactează-ne pentru ofertă exactă.</p>';
    });
  }

  /* Load the global VALMEX contact widget on pages using valmex.js. */
  if (!document.getElementById('valmex-contact-widget-loader')) {
    const contactWidgetScript = document.createElement('script');
    contactWidgetScript.id = 'valmex-contact-widget-loader';
    contactWidgetScript.src = '/valmex-contact-widget.js?v=20261123-single-launcher2';
    contactWidgetScript.defer = true;
    document.head.appendChild(contactWidgetScript);
  }

})();
