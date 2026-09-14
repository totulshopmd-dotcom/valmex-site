(function(){
  'use strict';
  if (typeof PRODUCTS === 'undefined') return;

  const grid = document.getElementById('productsGrid');
  const toolbar = document.getElementById('productsFilter');
  const emptyMsg = document.getElementById('productsEmpty');
  const detailModal = document.getElementById('productDetailModal');
  if (!grid) return;

  function fmtPrice(p, unit){
    if (p === null || p === undefined) return 'Preț la cerere';
    return p.toLocaleString('ro-RO') + ' ' + unit;
  }

  function cardHtml(p){
    return '<div class="product-card" data-id="' + p.id + '">' +
      '<div class="product-card-img">' +
        (p.badge ? '<span class="product-badge">' + p.badge + '</span>' : '') +
        '<img src="' + p.image + '" alt="' + p.title + '" loading="lazy">' +
      '</div>' +
      '<div class="product-card-body">' +
        '<span class="product-card-cat">' + p.category + '</span>' +
        '<h3 class="product-card-title">' + p.title + '</h3>' +
        '<p class="product-card-desc">' + p.shortDescription + '</p>' +
        '<div class="product-card-footer">' +
          '<span class="product-card-price">' + fmtPrice(p.price, p.unit) + '</span>' +
          '<span class="product-card-more">Vezi Detalii →</span>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function render(list){
    if(!list.length){
      grid.innerHTML='';
      if(emptyMsg) emptyMsg.style.display='block';
      return;
    }
    if(emptyMsg) emptyMsg.style.display='none';
    grid.innerHTML = list.map(cardHtml).join('');
    grid.querySelectorAll('.product-card').forEach(card=>{
      card.addEventListener('click', ()=> openDetail(card.dataset.id));
    });
  }

  function buildFilters(){
    if(!toolbar) return;
    const cats = ['Toate', ...Array.from(new Set(PRODUCTS.map(p=>p.category)))];
    toolbar.innerHTML = cats.map((c,i)=>
      '<button class="filter-pill' + (i===0?' active':'') + '" data-cat="' + c + '">' + c + '</button>'
    ).join('');
    toolbar.querySelectorAll('.filter-pill').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        toolbar.querySelectorAll('.filter-pill').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.cat;
        render(cat==='Toate' ? PRODUCTS : PRODUCTS.filter(p=>p.category===cat));
      });
    });
  }

  function openDetail(id){
    const p = PRODUCTS.find(x=>x.id===id);
    if(!p || !detailModal) return;
    detailModal.querySelector('.pd-image').src = p.image;
    detailModal.querySelector('.pd-image').alt = p.title;
    detailModal.querySelector('.pd-category').textContent = p.category;
    detailModal.querySelector('.pd-title').textContent = p.title;
    detailModal.querySelector('.pd-price').textContent = fmtPrice(p.price, p.unit);
    detailModal.querySelector('.pd-description').textContent = p.description;
    const specsEl = detailModal.querySelector('.pd-specs');
    specsEl.innerHTML = (p.specs||[]).map(s=>
      '<div class="pd-spec-row"><span>' + s.label + '</span><b>' + s.value + '</b></div>'
    ).join('');
    const ctaBtn = detailModal.querySelector('.pd-cta');
    if(ctaBtn) ctaBtn.dataset.service = p.title;
    detailModal.classList.add('active');
    document.body.style.overflow='hidden';
  }

  function closeDetail(){
    detailModal.classList.remove('active');
    document.body.style.overflow='';
  }

  if(detailModal){
    const closeBtn = detailModal.querySelector('.pd-close');
    if(closeBtn) closeBtn.addEventListener('click', closeDetail);
    detailModal.addEventListener('click', e=>{ if(e.target===detailModal) closeDetail(); });
    const ctaBtn = detailModal.querySelector('.pd-cta');
    if(ctaBtn){
      ctaBtn.addEventListener('click', ()=>{
        closeDetail();
        const modal = document.getElementById('leadModal');
        const serviceText = document.getElementById('serviceText');
        if(modal){
          if(serviceText) serviceText.textContent = 'Serviciu: ' + ctaBtn.dataset.service;
          modal.classList.add('active');
          document.body.style.overflow='hidden';
        }
      });
    }
  }

  buildFilters();
  render(PRODUCTS);
})();
