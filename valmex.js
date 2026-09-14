/* Valmex.md Premium Scripts v2 */
(function(){
  'use strict';

  /* ---- Theme (dark/light) ---- */
  (function(){
    const root = document.documentElement;
    const KEY = 'valmexTheme';
    function apply(theme){
      root.setAttribute('data-theme', theme);
      try{ localStorage.setItem(KEY, theme); }catch(e){}
    }
    document.querySelectorAll('.theme-toggle').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
        apply(current === 'light' ? 'dark' : 'light');
      });
    });
  })();

  /* ---- Ofertă lunii — countdown (expiră la sfârșitul lunii curente) ---- */
  (function(){
    const els = document.querySelectorAll('[data-countdown]');
    if(!els.length) return;
    function endOfMonth(){
      const now = new Date();
      return new Date(now.getFullYear(), now.getMonth()+1, 1, 0,0,0);
    }
    const target = endOfMonth();
    function tick(){
      const diff = target - new Date();
      if(diff<=0){ els.forEach(el=>el.textContent='—'); return; }
      const d = Math.floor(diff/86400000);
      const h = Math.floor((diff%86400000)/3600000);
      const m = Math.floor((diff%3600000)/60000);
      els.forEach(el=>{ el.textContent = d+'z '+h+'h '+m+'m'; });
    }
    tick();
    setInterval(tick, 60000);
  })();

  /* ---- Exit-intent offer modal ---- */
  (function(){
    const exitModal = document.getElementById('exitModal');
    if(!exitModal) return;
    let shown = false;
    function showExit(){
      if(shown) return;
      try{ if(sessionStorage.getItem('valmexExitShown')) return; }catch(e){}
      shown = true;
      try{ sessionStorage.setItem('valmexExitShown','1'); }catch(e){}
      exitModal.classList.add('active');
      document.body.style.overflow='hidden';
    }
    document.addEventListener('mouseout', e=>{
      if(!e.relatedTarget && e.clientY <= 0) showExit();
    });
    let idleTimer = setTimeout(showExit, 45000);
    ['scroll','keydown','click'].forEach(ev=>document.addEventListener(ev, ()=>{}, {passive:true}));
    const exitClose = document.getElementById('closeExitModal');
    if(exitClose){
      exitClose.addEventListener('click', ()=>{
        exitModal.classList.remove('active');
        document.body.style.overflow='';
      });
    }
    exitModal.addEventListener('click', e=>{
      if(e.target===exitModal){ exitModal.classList.remove('active'); document.body.style.overflow=''; }
    });
    const exitBtn = document.getElementById('sendExitBtn');
    const exitForm = document.getElementById('exitForm');
    async function submitExit(){
        const name = document.getElementById('exitName').value.trim();
        const phone = document.getElementById('exitPhone').value.trim();
        if(!name||!phone){ alert('Completează câmpurile.'); return; }
        exitBtn.disabled = true; exitBtn.textContent='Se trimite...';
        const query = 'https://script.google.com/macros/s/AKfycbyrmwWAe39mXcZYXrlW-MRnmHne70Ak64iFTB4lNLAKrAZVG8TI_eHQOkH0-cVeqxijbg/exec' + '?name=' + encodeURIComponent(name) + '&phone=' + encodeURIComponent(phone) + '&city=' + encodeURIComponent('-') + '&product=' + encodeURIComponent('VALMEX | Ofertă Exit-Intent -5%') + '&price=' + encodeURIComponent('-') + '&t=' + Date.now();
        try{
          await fetch(query,{method:'GET',cache:'no-store'});
          const status = document.getElementById('exitStatus');
          if(status) status.style.display='block';
          document.getElementById('exitName').value='';
          document.getElementById('exitPhone').value='';
          setTimeout(()=>{
            exitModal.classList.remove('active');
            document.body.style.overflow='';
            if(status) status.style.display='none';
          },1800);
        }catch(e){ alert('Eroare la trimitere.'); }
        exitBtn.disabled=false; exitBtn.textContent='Vreau Discountul';
    }
    if(exitBtn){
      if(exitForm){
        exitForm.addEventListener('submit', function(e){ e.preventDefault(); submitExit(); });
      } else {
        exitBtn.addEventListener('click', function(e){ e.preventDefault(); submitExit(); });
      }
    }
  })();

  /* ---- Before/After sliders ---- */
  document.querySelectorAll('.ba-slider').forEach(slider=>{
    const before = slider.querySelector('.ba-before');
    const handle = slider.querySelector('.ba-handle');
    if(!before || !handle) return;
    let dragging = false;
    function setPct(pct){
      pct = Math.max(2, Math.min(98, pct));
      before.style.width = pct + '%';
      handle.style.left = pct + '%';
    }
    function moveFromClientX(clientX){
      const rect = slider.getBoundingClientRect();
      const pct = ((clientX - rect.left) / rect.width) * 100;
      setPct(pct);
    }
    handle.addEventListener('mousedown', ()=>{ dragging = true; });
    slider.addEventListener('mousedown', e=>{ dragging = true; moveFromClientX(e.clientX); });
    window.addEventListener('mouseup', ()=>{ dragging = false; });
    window.addEventListener('mousemove', e=>{ if(dragging) moveFromClientX(e.clientX); });
    slider.addEventListener('touchstart', e=>{ dragging = true; moveFromClientX(e.touches[0].clientX); }, {passive:true});
    slider.addEventListener('touchmove', e=>{ if(dragging) moveFromClientX(e.touches[0].clientX); }, {passive:true});
    slider.addEventListener('touchend', ()=>{ dragging = false; });
  });

  const intro = document.getElementById('introScreen');
  if(intro && !sessionStorage.getItem('valmexIntroShown')){
    sessionStorage.setItem('valmexIntroShown','1');
    setTimeout(()=>{ intro.classList.add('hide'); },2200);
  } else if(intro){
    intro.style.display='none';
  }

  const header = document.getElementById('mainHeader');
  if(header){
    window.addEventListener('scroll',()=>{
      header.classList.toggle('scrolled', window.scrollY > 60);
    },{passive:true});
  }

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
    const heroImages = [
      'https://i.ibb.co/XfbsDsQg/Acoperis-finisat2.png',
      'https://i.ibb.co/mFqGcZWG/file-000000000a5471f499c0bfd7fa150064.png',
      'https://i.ibb.co/mrnmsNR6/Fatade-AMK-proiect-finisat-5.jpg'
    ];
    let hi = 0;
    heroBg.style.backgroundImage = "url('"+heroImages[0]+"')";
    setInterval(()=>{
      hi = (hi+1)%heroImages.length;
      heroBg.style.backgroundImage = "url('"+heroImages[hi]+"')";
    },5000);
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
      const turnkeyPrice = Math.ceil(netArea*850);
      facadeCalcResult.style.display='block';
      facadeCalcResult.innerHTML = '<h3>Rezultat Estimativ</h3><p><b>Tip:</b> '+type+'</p><p><b>Suprafață netă:</b> '+netArea.toFixed(1)+' m²</p><p><b>Adeziv:</b> ~'+adhesive+' kg</p><p><b>Plasă armare:</b> ~'+mesh+' m²</p><p><b>Grund:</b> ~'+primer+' L</p><div style="margin-top:16px;padding-top:16px;border-top:1px solid var(--border)"><p><b>Fațadă decorativă la cheie (de la 850 lei/m²):</b> ~'+turnkeyPrice.toLocaleString('ro-RO')+' lei</p></div><p style="margin-top:10px;font-size:13px;color:#777">*Calcule și prețuri orientative. Contactează-ne pentru ofertă exactă.</p>';
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

})();
