(function(){
 const root=document.getElementById('heroCarousel'); if(!root)return;
 const slides=[...root.querySelectorAll('.hero-slide')],dots=[...root.querySelectorAll('[data-go]')];
 const bg=document.querySelector('.hero-bg'); if(!slides.length)return;
 let index=0,timer=null,bgTimer=null;
 let layer=null;
 if(bg){
  layer=document.createElement('div');
  layer.className='hero-bg-crossfade';
  bg.appendChild(layer);
 }
 function setBackground(image){
  if(!bg||!image)return;
  const layers='linear-gradient(90deg,rgba(255,255,255,.97) 0%,rgba(255,255,255,.88) 43%,rgba(255,255,255,.18) 100%),linear-gradient(0deg,#fff 0%,rgba(255,255,255,0) 42%),url("'+image+'")';
  if(!layer){bg.style.backgroundImage=layers;return}
  clearTimeout(bgTimer);
  layer.style.backgroundImage=layers;
  layer.classList.add('is-visible');
  bgTimer=setTimeout(()=>{
   bg.style.backgroundImage=layers;
   layer.classList.remove('is-visible');
  },1050);
 }
 function show(n){
  index=(n+slides.length)%slides.length;
  slides.forEach((s,i)=>{
   const active=i===index;
   s.classList.toggle('is-active',active);
   s.setAttribute('aria-hidden',String(!active));
  });
  dots.forEach((d,i)=>{
   d.classList.toggle('is-active',i===index);
   d.setAttribute('aria-pressed',String(i===index));
  });
  setBackground(slides[index].dataset.image);
 }
 function stop(){if(timer){clearInterval(timer);timer=null}}
 function start(){
  stop();
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  timer=setInterval(()=>show(index+1),8500);
 }
 dots.forEach(d=>d.addEventListener('click',()=>{show(Number(d.dataset.go));start()}));
 root.addEventListener('mouseenter',stop);
 root.addEventListener('mouseleave',start);
 root.addEventListener('focusin',stop);
 root.addEventListener('focusout',e=>{if(!root.contains(e.relatedTarget))start()});
 document.addEventListener('visibilitychange',()=>document.hidden?stop():start());
 slides.forEach(s=>{const src=s.dataset.image;if(src){const im=new Image();im.src=src}});
 show(0);start();
})();