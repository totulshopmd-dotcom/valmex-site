(function(){
 const root=document.getElementById('heroCarousel'); if(!root)return;
 const slides=[...root.querySelectorAll('.hero-slide')],dots=[...root.querySelectorAll('[data-go]')];
 const bg=document.querySelector('.hero-bg'); let index=0,timer=null;
 function show(n){
  index=(n+slides.length)%slides.length;
  slides.forEach((s,i)=>s.classList.toggle('is-active',i===index));
  dots.forEach((d,i)=>{d.classList.toggle('is-active',i===index);d.setAttribute('aria-pressed',String(i===index))});
  const image=slides[index].dataset.image;
  if(bg&&image){bg.style.backgroundImage='linear-gradient(90deg,rgba(255,255,255,.97) 0%,rgba(255,255,255,.88) 43%,rgba(255,255,255,.18) 100%),linear-gradient(0deg,#fff 0%,rgba(255,255,255,0) 42%),url("'+image+'")';bg.dataset.activeImage=image;}
 }
 function stop(){if(timer){clearInterval(timer);timer=null}}
 function start(){if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;stop();timer=setInterval(()=>show(index+1),6500)}
 dots.forEach(d=>d.addEventListener('click',()=>{show(Number(d.dataset.go));start()}));
 root.addEventListener('mouseenter',stop);root.addEventListener('mouseleave',start);root.addEventListener('focusin',stop);root.addEventListener('focusout',start);
 document.addEventListener('visibilitychange',()=>document.hidden?stop():start());
 slides.forEach(s=>{const i=s.dataset.image;if(i){const im=new Image();im.src=i}});
 show(0);start();
})();
