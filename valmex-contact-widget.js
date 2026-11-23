/* VALMEX Contact Widget — WhatsApp, Viber, apel și chat pe site */
(function(){
'use strict';
if(document.getElementById('valmex-contact-widget')) return;
const phone='+37378026212';
const wa='https://wa.me/37378026212?text='+encodeURIComponent('Bună ziua! Doresc informații despre serviciile VALMEX.');
const viber='viber://chat?number=%2B37378026212';
const style=document.createElement('style');
style.textContent=`
#valmex-contact-widget{position:fixed;right:22px;bottom:102px;z-index:9998;font-family:inherit}
#valmex-contact-widget *{box-sizing:border-box}
#valmex-contact-widget .vm-panel{position:absolute;right:0;bottom:76px;width:236px;padding:13px 14px;border:1px solid rgba(255,255,255,.42);border-radius:20px;background:rgba(255,255,255,.78);backdrop-filter:blur(18px) saturate(150%);-webkit-backdrop-filter:blur(18px) saturate(150%);box-shadow:0 16px 48px rgba(20,25,35,.17),inset 0 1px rgba(255,255,255,.8);opacity:0;visibility:hidden;transform:translateY(12px) scale(.96);transform-origin:bottom right;transition:opacity .24s ease,transform .3s cubic-bezier(.2,.8,.2,1),visibility .24s}
#valmex-contact-widget.is-open .vm-panel{opacity:1;visibility:visible;transform:none}
#valmex-contact-widget .vm-heading{margin:1px 3px 9px;color:#20242b;font-size:13px;font-weight:750}
#valmex-contact-widget .vm-links{display:grid;gap:5px}
#valmex-contact-widget .vm-link{display:flex;align-items:center;gap:11px;padding:9px 7px;border-radius:12px;color:#20242b;text-decoration:none;font-size:14px;font-weight:650;transition:background .18s,transform .18s}
#valmex-contact-widget .vm-link:hover{background:rgba(20,25,35,.055);transform:translateX(-2px)}
#valmex-contact-widget .vm-icon{width:39px;height:39px;flex:0 0 39px;border-radius:13px;display:grid;place-items:center;color:#fff;box-shadow:0 5px 13px rgba(0,0,0,.14)}
#valmex-contact-widget .vm-icon svg{width:22px;height:22px;display:block;fill:currentColor}
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
#valmex-contact-widget .vm-pulse{position:absolute;inset:-5px;border:1px solid rgba(227,6,19,.35);border-radius:23px;animation:vmPulse 2.8s ease-out infinite;pointer-events:none}
#valmex-contact-widget.is-open .vm-pulse{animation:none;opacity:0}
@keyframes vmPulse{0%{transform:scale(.92);opacity:.7}100%{transform:scale(1.28);opacity:0}}
@media(max-width:600px){#valmex-contact-widget{right:15px;bottom:94px}#valmex-contact-widget .vm-panel{bottom:70px;width:225px}#valmex-contact-widget .vm-main{width:55px;height:55px;border-radius:18px}}
@media(prefers-reduced-motion:reduce){#valmex-contact-widget *,#valmex-contact-widget *:before{animation:none!important;transition:none!important}}
`;
document.head.appendChild(style);
const root=document.createElement('div');root.id='valmex-contact-widget';
root.innerHTML=`
<div class="vm-panel" id="vmContactPanel" aria-hidden="true">
<div class="vm-heading">Alege cum dorești să discutăm</div><div class="vm-links">
<a class="vm-link" href="tel:+37378026212"><span class="vm-icon vm-call"><svg viewBox="0 0 24 24"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.11.37 2.31.56 3.58.56a1 1 0 011 1V20a1 1 0 01-1 1C10.61 21 3 13.39 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.27.19 2.47.56 3.58a1 1 0 01-.25 1.01l-2.19 2.2z"/></svg></span><span>Sună-ne<small>+373 780 26212</small></span></a>
<a class="vm-link" href="${wa}" target="_blank" rel="noopener"><span class="vm-icon vm-wa"><svg viewBox="0 0 24 24"><path d="M20.52 3.48A11.8 11.8 0 0012.1 0C5.57 0 .25 5.3.25 11.83c0 2.08.55 4.12 1.6 5.92L.15 24l6.4-1.68a11.9 11.9 0 005.54 1.4h.01c6.53 0 11.85-5.31 11.85-11.84 0-3.16-1.23-6.13-3.43-8.4zM12.1 21.7a9.85 9.85 0 01-5.02-1.37l-.36-.21-3.8 1 1.02-3.7-.24-.38a9.82 9.82 0 01-1.5-5.21c0-5.43 4.43-9.85 9.88-9.85a9.8 9.8 0 016.98 2.9 9.8 9.8 0 012.89 6.98c0 5.44-4.43 9.85-9.85 9.85zm5.42-7.38c-.3-.15-1.78-.88-2.05-.98-.27-.1-.47-.15-.67.15-.2.3-.77.98-.94 1.18-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.78-1.68-2.08-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.47 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.48.71.3 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.78-.73 2.03-1.43.25-.7.25-1.3.18-1.43-.08-.12-.28-.2-.58-.35z"/></svg></span><span>WhatsApp<small>Scrie-ne un mesaj</small></span></a>
<a class="vm-link" href="${viber}"><span class="vm-icon vm-viber"><svg viewBox="0 0 24 24"><path d="M17.6 2.1A28 28 0 006.4 2C3.8 2.5 2.2 4.1 1.8 6.7a29 29 0 000 10.6c.4 2.5 2 4.2 4.6 4.6l.2 0-.3 1.5c-.1.5.4.8.8.5l2.5-1.7c2.7.1 5.4 0 8-.5 2.6-.4 4.2-2.1 4.6-4.6a29 29 0 000-10.5c-.4-2.6-2-4.2-4.6-4.5zM7.3 6.2c.2-.2.5-.2.7 0l1.4 1.7c.2.2.2.5 0 .7l-.8.8c.6 1.3 1.6 2.3 2.9 2.9l.8-.8c.2-.2.5-.2.7 0l1.7 1.4c.2.2.2.5 0 .7l-.8 1c-.4.5-1 .7-1.6.5-3.4-1-5.8-3.4-6.8-6.8-.2-.6 0-1.2.5-1.6l1.3-.5zm8.8 8.1a5.9 5.9 0 00-5.3-5.3V7.5a7.4 7.4 0 016.8 6.8h-1.5zm0-4.2a10.1 10.1 0 00-5.3-2.6V6a11.7 11.7 0 017.8 7.8h-1.5a10.1 10.1 0 00-1-3.7z"/></svg></span><span>Viber<small>Discută prin Viber</small></span></a>
<a class="vm-link" href="#" data-vm-chat><span class="vm-icon vm-chat"><svg viewBox="0 0 24 24"><path d="M4 4h16a2 2 0 012 2v10a2 2 0 01-2 2h-8l-5.5 3.5V18H4a2 2 0 01-2-2V6a2 2 0 012-2zm3 5v2h10V9H7zm0 4v2h7v-2H7z"/></svg></span><span>Chat pe site<small>Discută direct cu VALMEX</small></span></a>
</div></div>
<button class="vm-main" type="button" aria-label="Deschide opțiunile de contact" aria-expanded="false" aria-controls="vmContactPanel"><span class="vm-pulse"></span><svg viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg></button>`;
document.body.appendChild(root);
const trigger=root.querySelector('.vm-main'),panel=root.querySelector('.vm-panel');
function setOpen(open){root.classList.toggle('is-open',open);trigger.setAttribute('aria-expanded',String(open));trigger.setAttribute('aria-label',open?'Închide opțiunile de contact':'Deschide opțiunile de contact');panel.setAttribute('aria-hidden',String(!open));}
trigger.addEventListener('click',()=>setOpen(!root.classList.contains('is-open')));
document.addEventListener('click',e=>{if(!root.contains(e.target))setOpen(false);});
document.addEventListener('keydown',e=>{if(e.key==='Escape')setOpen(false);});
root.querySelector('[data-vm-chat]').addEventListener('click',e=>{
e.preventDefault();setOpen(false);
const siteChat=document.getElementById('vm-chat-launch');
if(siteChat){siteChat.click();return;}
if(window.jivo_api&&typeof window.jivo_api.open==='function'){window.jivo_api.open();return;}
if(window.JivoSite&&typeof window.JivoSite.open==='function'){window.JivoSite.open();return;}
alert('Chatul online nu este disponibil momentan. Ne poți contacta prin telefon, WhatsApp sau Viber.');
});
})();