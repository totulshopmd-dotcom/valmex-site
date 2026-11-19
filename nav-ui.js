/* VALMEX – meniu mobil cu submeniuri persistente */
(function(){
 'use strict';
 var header=document.getElementById('mainHeader'); if(!header) return;
 var nav=document.getElementById('nav');
 header.querySelectorAll('.dd>.dd-t').forEach(function(link){
   link.setAttribute('aria-haspopup','true'); link.setAttribute('aria-expanded','false');
   link.addEventListener('click',function(e){
     if(window.matchMedia('(max-width: 900px)').matches){
       e.preventDefault(); e.stopPropagation();
       var item=link.parentElement,was=item.classList.contains('open');
       header.querySelectorAll('.dd.open').forEach(function(x){x.classList.remove('open');var t=x.querySelector('.dd-t');if(t)t.setAttribute('aria-expanded','false')});
       if(!was){item.classList.add('open');link.setAttribute('aria-expanded','true')}
     }
   });
 });
 header.querySelectorAll('.dd-m a').forEach(function(link){link.addEventListener('click',function(){if(nav)nav.classList.remove('open');header.querySelectorAll('.dd.open').forEach(function(x){x.classList.remove('open');var t=x.querySelector('.dd-t');if(t)t.setAttribute('aria-expanded','false')})})});
})();
