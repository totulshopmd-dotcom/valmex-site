/* VALMEX Contact Widget — WhatsApp, Viber, apel și chat pe site */
(function(){
'use strict';
if(document.getElementById('valmex-contact-widget')) return;
const phone='+37378026212';
const wa='https://wa.me/37378026212?text='+encodeURIComponent('Bună ziua! Doresc informații despre serviciile VALMEX.');
const viber='viber://chat?number=%2B37378026212';
const style=document.createElement('style');
style.textContent=`
#valmex-contact-widget{position:fixed;right:12px;bottom:16px;z-index:99999;font-family:inherit;pointer-events:none}
#valmex-contact-widget *{box-sizing:border-box}
#valmex-contact-widget .vm-panel{position:absolute;right:0;bottom:72px;pointer-events:auto;width:236px;padding:13px 14px;border:1px solid rgba(255,255,255,.42);border-radius:20px;background:rgba(255,255,255,.78);backdrop-filter:blur(18px) saturate(150%);-webkit-backdrop-filter:blur(18px) saturate(150%);box-shadow:0 16px 48px rgba(20,25,35,.17),inset 0 1px rgba(255,255,255,.8);opacity:0;visibility:hidden;transform:translateY(12px) scale(.96);transform-origin:bottom right;transition:opacity .24s ease,transform .3s cubic-bezier(.2,.8,.2,1),visibility .24s}
#valmex-contact-widget.is-open .vm-panel{opacity:1;visibility:visible;transform:none}
#valmex-contact-widget .vm-heading{margin:1px 3px 9px;color:#20242b;font-size:13px;font-weight:750}
#valmex-contact-widget .vm-links{display:grid;gap:5px}
#valmex-contact-widget .vm-link{display:flex;align-items:center;gap:11px;padding:9px 7px;border-radius:12px;color:#20242b;text-decoration:none;font-size:14px;font-weight:650;transition:background .18s,transform .18s}
#valmex-contact-widget .vm-link:hover{background:rgba(20,25,35,.055);transform:translateX(-2px)}
#valmex-contact-widget .vm-icon{width:39px;height:39px;flex:0 0 39px;border-radius:13px;display:grid;place-items:center;color:#fff;box-shadow:0 5px 13px rgba(0,0,0,.14)}
#valmex-contact-widget .vm-icon svg,#valmex-contact-widget .vm-icon img{width:23px;height:23px;display:block;object-fit:contain}
#valmex-contact-widget .vm-call{background:linear-gradient(145deg,#fa3440,#d90016)}
#valmex-contact-widget .vm-wa{background:#20bd65}
#valmex-contact-widget .vm-viber{background:#7360c8}
#valmex-contact-widget .vm-chat{background:#27364a}
#valmex-contact-widget .vm-link small{display:block;margin-top:2px;color:#737b86;font-size:11px;font-weight:500}
#valmex-contact-widget .vm-main{position:relative;width:58px;height:58px;border:0;border-radius:19px;display:grid;place-items:center;background:linear-gradient(145deg,#f12635,#c90013);color:#fff;box-shadow:0 9px 25px rgba(198,0,18,.3),inset 0 1px rgba(255,255,255,.35);cursor:pointer;transition:transform .22s,box-shadow .22s}
#valmex-contact-widget .vm-main:hover{transform:translateY(-3px);box-shadow:0 13px 30px rgba(198,0,18,.36)}
#valmex-contact-widget .vm-main svg{width:25px;height:25px;transition:transform .25s}
#valmex-contact-widget.is-open .vm-main svg{transform:rotate(45deg)}
#valmex-contact-widget .vm-main:focus-visible,#valmex-contact-widget a:focus-visible{outline:3px solid rgba(227,6,19,.35);outline-offset:3px}
#valmex-contact-widget .vm-pulse{position:absolute;inset:-5px;border:1px solid rgba(227,6,19,.35);border-radius:50%;animation:vmPulse 2.8s ease-out infinite;pointer-events:none}
#valmex-contact-widget.is-open .vm-pulse{animation:none;opacity:0}
@keyframes vmPulse{0%{transform:scale(.92);opacity:.7}100%{transform:scale(1.28);opacity:0}}
@media(max-width:600px){#valmex-contact-widget{right:12px;bottom:16px}#valmex-contact-widget .vm-panel{bottom:68px;width:225px}}
@media(prefers-reduced-motion:reduce){#valmex-contact-widget *,#valmex-contact-widget *:before{animation:none!important;transition:none!important}}
`;
document.head.appendChild(style);
const root=document.createElement('div');root.id='valmex-contact-widget';
root.innerHTML=`
<div class="vm-panel" id="vmContactPanel" aria-hidden="true">
<div class="vm-heading">Alege cum dorești să discutăm</div><div class="vm-links">
<a class="vm-link" href="tel:+37378026212"><span class="vm-icon vm-call"><svg viewBox="0 0 24 24"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.11.37 2.31.56 3.58.56a1 1 0 011 1V20a1 1 0 01-1 1C10.61 21 3 13.39 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.27.19 2.47.56 3.58a1 1 0 01-.25 1.01l-2.19 2.2z"/></svg></span><span>Sună-ne<small>+373 780 26212</small></span></a>
<a class="vm-link" href="${wa}" target="_blank" rel="noopener"><span class="vm-icon vm-wa"><img src="https://cdn.simpleicons.org/whatsapp/FFFFFF" alt="" width="23" height="23"></span><span>WhatsApp<small>Scrie-ne un mesaj</small></span></a>
<a class="vm-link" href="${viber}"><span class="vm-icon vm-viber"><img src="https://cdn.simpleicons.org/viber/FFFFFF" alt="" width="23" height="23"></span><span>Viber<small>Discută prin Viber</small></span></a>
<a class="vm-link" href="#" data-vm-chat><span class="vm-icon vm-chat"><svg viewBox="0 0 24 24"><path d="M4 4h16a2 2 0 012 2v10a2 2 0 01-2 2h-8l-5.5 3.5V18H4a2 2 0 01-2-2V6a2 2 0 012-2zm3 5v2h10V9H7zm0 4v2h7v-2H7z"/></svg></span><span>Chat pe site<small>Discută direct cu VALMEX</small></span></a>
</div></div>
`;
document.body.appendChild(root);
const trigger=document.getElementById('vm-chat-launch'),panel=root.querySelector('.vm-panel');
if(!trigger){return;}
const openChat=trigger.onclick;
trigger.style.boxShadow='0 9px 25px rgba(198,0,18,.30),inset 0 1px rgba(255,255,255,.35)';
trigger.style.transition='transform .22s,box-shadow .22s';
trigger.style.position='relative';
trigger.insertAdjacentHTML('beforeend','<span class="vm-pulse" aria-hidden="true"></span>');
function setOpen(open){root.classList.toggle('is-open',open);trigger.setAttribute('aria-expanded',String(open));trigger.setAttribute('aria-label',open?'Închide opțiunile de contact':'Deschide opțiunile de contact');panel.setAttribute('aria-hidden',String(!open));}
trigger.onclick=(e)=>{e.preventDefault();e.stopPropagation();setOpen(!root.classList.contains('is-open'));};
document.addEventListener('click',e=>{if(!root.contains(e.target)&&e.target!==trigger&&!trigger.contains(e.target))setOpen(false);});
document.addEventListener('keydown',e=>{if(e.key==='Escape')setOpen(false);});
root.querySelector('[data-vm-chat]').addEventListener('click',e=>{
e.preventDefault();setOpen(false);
const siteChat=document.getElementById('vm-chat-launch');
if(siteChat){if(typeof openChat==='function')openChat.call(siteChat,e);else siteChat.click();return;}
if(window.jivo_api&&typeof window.jivo_api.open==='function'){window.jivo_api.open();return;}
if(window.JivoSite&&typeof window.JivoSite.open==='function'){window.JivoSite.open();return;}
alert('Chatul online nu este disponibil momentan. Ne poți contacta prin telefon, WhatsApp sau Viber.');
});
})();