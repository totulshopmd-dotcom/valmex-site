(function(){
  'use strict';
  if (typeof PROJECTS === 'undefined') return;
  let LIST = PROJECTS;

  const grid = document.getElementById('projectsGrid');
  const toolbar = document.getElementById('projectsFilter');
  if (!grid) return;

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');

  function cardHtml(p){
    const hasMulti = p.images.length > 1;
    const thumbs = hasMulti ? (
      '<div class="story-thumbs">' +
      p.images.map((img,i)=>{
        const url = window.resolveImg ? window.resolveImg(img) : img;
        return '<button class="story-thumb' + (i===0?' active':'') + '" data-src="' + url + '" style="background-image:url(\'' + url + '\')" aria-label="Imagine ' + (i+1) + '"></button>';
      }).join('') +
      '</div>'
    ) : '';
    return '<div class="story-card">' +
      '<div class="story-main">' +
        '<span class="story-cat">' + p.category + '</span>' +
        '<img class="story-main-img" src="' + (window.resolveImg ? window.resolveImg(p.images[0]) : p.images[0]) + '" alt="' + p.title + '">' +
      '</div>' +
      thumbs +
      '<div class="story-body">' +
        '<h3 class="story-title">' + p.title + ' — ' + p.location + '</h3>' +
        '<p class="story-desc">' + p.description + '</p>' +
      '</div>' +
    '</div>';
  }

  function render(list){
    grid.innerHTML = list.map(cardHtml).join('');
    grid.querySelectorAll('.story-card').forEach(card=>{
      const mainImg = card.querySelector('.story-main-img');
      card.querySelectorAll('.story-thumb').forEach(thumb=>{
        thumb.addEventListener('click', (e)=>{
          e.stopPropagation();
          card.querySelectorAll('.story-thumb').forEach(t=>t.classList.remove('active'));
          thumb.classList.add('active');
          mainImg.src = thumb.dataset.src;
        });
      });
      if(mainImg && lightbox){
        mainImg.style.cursor = 'zoom-in';
        mainImg.addEventListener('click', ()=>{
          lightboxImg.src = mainImg.src;
          lightbox.classList.add('active');
          document.body.style.overflow='hidden';
        });
      }
    });
  }

  function buildFilters(){
    if(!toolbar) return;
    const cats = ['Toate', ...Array.from(new Set(LIST.map(p=>p.category)))];
    toolbar.innerHTML = cats.map((c,i)=>
      '<button class="filter-pill' + (i===0?' active':'') + '" data-cat="' + c + '">' + c + '</button>'
    ).join('');
    toolbar.querySelectorAll('.filter-pill').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        toolbar.querySelectorAll('.filter-pill').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.cat;
        render(cat==='Toate' ? LIST : LIST.filter(p=>p.category===cat));
      });
    });
  }

  /* Sursa proiectelor: dacă panoul (cms/content.json) are proiecte publicate, ele înlocuiesc lista din projects-data.js.
     Dacă fișierul lipsește sau nu are proiecte, rămâne projects-data.js neschimbat. */
  function fromCms(db){
    if(!db || !Array.isArray(db.projects)) return null;
    const out = db.projects.filter(p=>p && p.published && p.title && Array.isArray(p.photos) && p.photos.length)
      .sort((a,b)=>(a.order||0)-(b.order||0))
      .map(p=>{
        const imgs = p.photos.filter(x=>typeof x==='string' && x);
        if(p.cover && imgs.indexOf(p.cover)>0){ imgs.splice(imgs.indexOf(p.cover),1); imgs.unshift(p.cover); }
        return { id:String(p.id||''), category:String(p.category||''), location:String(p.place||''), title:String(p.title), description:String(p.desc||''), images:imgs };
      });
    return out.length ? out : null;
  }
  let started = false;
  function go(db){
    if(started) return; started = true;
    LIST = fromCms(db) || PROJECTS;
    buildFilters();
    if(window.VALMEX_IMAGES_READY){
      window.VALMEX_IMAGES_READY.then(()=> render(LIST));
    } else {
      render(LIST);
    }
  }
  if(window.VALMEX_CMS_DONE) go(window.VALMEX_CMS);
  else {
    document.addEventListener('valmex:cms-done', e=>go(e.detail));
    setTimeout(()=>go(null), 2500);
  }
})();
