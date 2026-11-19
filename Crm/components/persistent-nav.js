(function(){
'use strict';
const links=[
['dashboard','⌂','Dashboard','dashboard.html'],
['CRM','CRM ȘI VÂNZĂRI',''],['clients','♙','Clienți','clienti.html'],['projects','▦','Proiecte','proiecte.html'],['calculator','⌗','Calculator LIVE','calculator-live.html'],['offers','▤','Oferte','oferte.html'],['projectfile','▧','Fișa proiectului','fisa-proiect.html'],
['OPS','OPERAȚIUNI',''],['tasks','☑','Sarcini','sarcini.html'],['time','◷','Pontaj','pontaj.html'],['materials','▥','Materiale','materiale.html'],['docs','▧','Documente','documente.html'],['contracts','▣','Contracte','contracte.html'],
['COM','COMUNICARE',''],['chat','✉','Chat VALMEX AI','chat.html'],['notifs','♢','Notificări','notificari.html'],
['MAN','MANAGEMENT',''],['finance','₾','Financiar','financiar.html'],['reports','▥','Rapoarte','rapoarte.html'],['warranty','◇','Garanții','garantii.html'],['interventions','⚒','Intervenții','interventii.html'],
['ADMIN','ADMINISTRARE',''],['employees','♧','Angajați','angajati.html'],['cms','⚙','CMS Website','admin.html'],['settings','⚙','Setări','setari.html'],['audit','≋','Audit','audit.html']
];
const file=location.pathname.split('/').pop();
const active=links.find(x=>x[3]===file)?.[0]||'';
const style=`:root{--vnav-w:252px;--vnav-bg:#111722;--vnav-red:#e30613}body{padding-left:var(--vnav-w)!important}.vnav{position:fixed;z-index:9998;inset:0 auto 0 0;width:var(--vnav-w);background:linear-gradient(165deg,#192231,#10151e 68%);color:#f5f7fa;display:flex;flex-direction:column;padding:19px 13px 12px;box-shadow:8px 0 28px #0a101b1c;font-family:Inter,system-ui,Arial,sans-serif}.vnav-brand{font-size:25px;font-weight:900;letter-spacing:-1.4px;padding:4px 12px 16px;border-bottom:1px solid #ffffff18}.vnav-brand span{color:#ed1b2a}.vnav-sub{font-size:9px;color:#8e9aaa;letter-spacing:2px;margin:4px 12px 12px}.vnav-scroll{overflow:auto;min-height:0;scrollbar-width:thin;scrollbar-color:#485364 transparent}.vnav-cap{font-size:9px;letter-spacing:1.5px;color:#8390a1;font-weight:800;margin:17px 10px 7px}.vnav a{display:flex;align-items:center;gap:11px;text-decoration:none;color:#c4ccd7;padding:8px 10px;margin:2px 0;border-radius:10px;font-size:12px;font-weight:650;min-height:40px;transition:.15s}.vnav a:hover{background:#ffffff10;color:#fff}.vnav a.active{background:linear-gradient(90deg,#e3061333,#e306130d);color:#fff;box-shadow:inset 3px 0 #ed1b2a}.vnav-ico{width:28px;height:28px;display:grid;place-items:center;border-radius:8px;background:#ffffff12;color:#dbe2eb;font-size:15px;flex:none}.vnav a.active .vnav-ico{background:#e30613;color:white}.vnav-foot{border-top:1px solid #ffffff18;padding:12px 10px 3px;color:#8490a0;font-size:10px;line-height:1.5}.vnav-toggle{display:none!important;position:fixed;z-index:10000;top:12px;left:12px;width:40px;height:40px;border:1px solid #e5e8ed;border-radius:11px;background:#fff;color:#1b2430;font-size:20px;box-shadow:0 4px 14px #10182818}.vnav-shade{display:none;position:fixed;z-index:9997;inset:0;background:#0c1424a3}.vnav-shade.on{display:block}body.vnav-mobile{padding-left:0!important}.vnav-mobile .vnav{transform:translateX(-105%);transition:transform .22s}.vnav-mobile .vnav.open{transform:translateX(0)}.vnav-mobile .vnav-toggle{display:block!important}@media(max-width:900px){body{padding-left:0!important}.vnav{transform:translateX(-105%);transition:transform .22s}.vnav.open{transform:translateX(0)}.vnav-toggle{display:block!important}}
`;
const s=document.createElement('style');s.textContent=style;document.head.appendChild(s);
const aside=document.createElement('aside');aside.className='vnav';aside.id='valmexPersistentNav';
let html='<div class="vnav-brand">VAL<span>MEX</span></div><div class="vnav-sub">BUSINESS MANAGEMENT</div><nav class="vnav-scroll">';
for(const x of links){if(['CRM','OPS','COM','MAN','ADMIN'].includes(x[0])){html+=`<div class="vnav-cap">${x[1]}</div>`;continue;}html+=`<a class="${active===x[0]?'active':''}" href="${x[3]}"><span class="vnav-ico">${x[1]}</span>${x[2]}</a>`;}
html+='</nav><div class="vnav-foot">VALMEX.md · Spațiu intern de lucru</div>';aside.innerHTML=html;
const toggle=document.createElement('button');toggle.className='vnav-toggle';toggle.type='button';toggle.setAttribute('aria-label','Deschide navigarea');toggle.textContent='☰';
const shade=document.createElement('div');shade.className='vnav-shade';
function close(){aside.classList.remove('open');shade.classList.remove('on')}
toggle.addEventListener('click',()=>{aside.classList.toggle('open');shade.classList.toggle('on')});shade.addEventListener('click',close);aside.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
document.body.append(aside,toggle,shade);
})();