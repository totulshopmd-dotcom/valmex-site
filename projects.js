(function(){
  'use strict';
  if (typeof PROJECTS === 'undefined') return;

  const grid = document.getElementById('projectsGrid');
  const toolbar = document.getElementById('projectsFilter');
  if (!grid) return;

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');

  function cardHtml(p){
    const hasMulti = p.images.length > 1;
    const thumbs = hasMulti ? (
      '<div class="story-thumbs">' +
      p.images.map((img,i)=>'<button class="story-thumb' + (i===0?' active':'') + '" data-src="' + img + '" style="background-image:url(\'' + img + '\')" aria-label="Imagine ' + (i+1) + '"></button>').join('') +
      '</div>'
    ) : '';
    return '<div class="story-card">' +
      '<div class="story-main">' +
        '<span class="story-cat">' + p.category + '</span>' +
        '<img class="story-main-img" src="' + p.images[0] + '" alt="' + p.title + '">' +
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
    const cats = ['Toate', ...Array.from(new Set(PROJECTS.map(p=>p.category)))];
    toolbar.innerHTML = cats.map((c,i)=>
      '<button class="filter-pill' + (i===0?' active':'') + '" data-cat="' + c + '">' + c + '</button>'
    ).join('');
    toolbar.querySelectorAll('.filter-pill').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        toolbar.querySelectorAll('.filter-pill').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.cat;
        render(cat==='Toate' ? PROJECTS : PROJECTS.filter(p=>p.category===cat));
      });
    });
  }

  buildFilters();
  render(PROJECTS);
})();
