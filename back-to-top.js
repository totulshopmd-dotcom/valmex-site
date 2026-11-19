(function(){
 if(document.getElementById('valmexBackToTop'))return;
 const style=document.createElement('style');
 style.textContent='#valmexBackToTop{position:fixed;right:26px;bottom:112px;z-index:900;width:54px;height:54px;border:1px solid rgba(255,255,255,.28);border-radius:18px;display:grid;place-items:center;color:#fff;background:linear-gradient(145deg,#f21b2b,#c90012);box-shadow:0 10px 28px rgba(160,0,15,.28),inset 0 1px 0 rgba(255,255,255,.22);opacity:0;visibility:hidden;transform:translateY(12px) scale(.92);transition:opacity .25s ease,transform .25s ease,visibility .25s;cursor:pointer;-webkit-tap-highlight-color:transparent}#valmexBackToTop.is-visible{opacity:1;visibility:visible;transform:translateY(0) scale(1)}#valmexBackToTop:hover{transform:translateY(-3px) scale(1.03)}#valmexBackToTop:focus-visible{outline:3px solid rgba(227,6,19,.3);outline-offset:4px}#valmexBackToTop svg{width:23px;height:23px;display:block}@media(max-width:600px){#valmexBackToTop{right:16px;bottom:102px;width:49px;height:49px;border-radius:16px}}@media(prefers-reduced-motion:reduce){#valmexBackToTop{transition:none}}';
 document.head.appendChild(style);
 const b=document.createElement('button');b.id='valmexBackToTop';b.type='button';b.setAttribute('aria-label','Revino la începutul paginii');
 b.innerHTML='<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
 document.body.appendChild(b);
 let busy=false;function update(){b.classList.toggle('is-visible',window.scrollY>420);busy=false}
 window.addEventListener('scroll',()=>{if(!busy){requestAnimationFrame(update);busy=true}},{passive:true});
 b.addEventListener('click',()=>window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}));update();
})();