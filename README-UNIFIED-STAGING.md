# VALMEX Unified Staging — revizia 5 (structură extinsă)

## Scop
Pachet local de integrare pentru verificare. Reunește redesignul public VALMEX, CRM-ul existent și CMS-ul website-ului într-o structură coerentă. Această arhivă nu este publicată în GitHub și nu modifică producția.

## Intrare și navigare
- `/` — website public VALMEX V2.
- `/admin.html` — intrare în autentificarea CRM; nu ocolește autentificarea.
- `/Crm/index.html` — autentificare Supabase comună.
- `/Crm/dashboard.html` — Dashboard central după autentificare.
- `/Crm/admin.html` — CMS Website: texte, prețuri, proiecte, imagini, SEO, popup-uri, cereri, istoric și backup.
- `/Crm/angajati.html` — administrarea angajaților.
- `/Crm/clienti.html`, `/Crm/proiecte.html`, `/Crm/calculator-live.html`, `/Crm/chat.html`, `/Crm/pontaj.html`, `/Crm/fisa-proiect.html` — module CRM păstrate.

## Extindere structurală — revizia 3
- Au fost adăugate servicii comune locale: `Crm/services/supabase.js`, `auth.js` și `permissions.js`.
- A fost adăugat registrul modulelor și shell-ul comun responsive: `Crm/modules/module-registry.js`, `Crm/components/app-shell.js`.
- Au fost create paginile structurale pentru Oferte, Sarcini, Documente, Contracte, Materiale, Financiar, Garanții, Intervenții, Rapoarte, Notificări, Configurări și Jurnal de audit.
- Dashboard-ul oferă acum acces vizual la modulele nou introduse.
- Paginile noi verifică sesiunea Supabase și profilul activ. Ele sunt momentan schelete UI și nu scriu/citesc date operaționale; conectarea la schema existentă urmează în etapele următoare.
- Nu au fost create tabele, politici RLS, RPC-uri sau Edge Functions și nu au fost executate migrații.

## Modificări păstrate din revizia 2
1. Dashboard-ul are intrări separate pentru CMS Website și Administrare angajați.
2. Am corectat eticheta și destinația administrării: `Crm/admin.html` este CMS Website; `Crm/angajati.html` este administrarea angajaților.
3. CMS-ul este afișat doar pentru roluri administrator/admin, iar pagina CMS verifică din nou profilul activ și rolul înainte de conectarea la bridge.
4. Verificarea rolului CMS acceptă atât `administrator`, cât și `admin`, normalizate fără diferență între litere mari/mici.
5. `/admin.html` trimite către autentificarea comună `/Crm/index.html`, nu direct către o pagină protejată.
6. Au fost restaurate din arhiva CRM sursă fișierele statice lipsă: imagini, favicon-uri, manifest, scriptul `products.js`, calculatorul public `calculator-acoperis.html`, `valmex.css` și fișierul de verificare Google.
7. A fost restaurat aliasul de logo cerut de calculatorul public existent.

## CMS și conexiunea securizată
CMS-ul existent folosește Supabase Auth și Edge Function `github-repo-bridge`; nu solicită token GitHub în browser. Operațiile sunt direcționate către ramura izolată `cms-staging`. Sunt disponibile în interfață editarea conținutului, media library, SEO/sitemap, popup-uri, export/import și istoric/restaurare. Publicarea în `main` nu este făcută de acest pachet.

**Notă:** simpla prezență a interfeței și a codului de integrare nu confirmă că fiecare operație bridge funcționează în mediul real. Salvarea prin bridge, permisiunile și restaurarea trebuie testate cu un cont administrator real înainte de folosire.

## Protecția prețurilor și formulelor
- Nu au fost schimbate datele din `cms/content.json`.
- Nu au fost modificate câmpurile de preț din CMS.
- `Crm/calculator-live.html` a fost păstrat nemodificat.
- Nu au fost schimbate formulele Calculatorului LIVE sau alte formule comerciale.
- Nu au fost executate migrații Supabase.

## Active care lipsesc din arhiva-sursă
După restaurarea tuturor activelor disponibile, au rămas referințe către câteva imagini care nu există în arhiva CRM primită:
- `images/amk/fatade-amk-finisat-6.jpg`
- `images/amk/fatda-amk-finisat-8.jpg`
- `images/amk/fatade-amk-proiect-finisat-5.jpg`
- `images/garduri/porti.jpg`

Aceste imagini nu au fost inventate sau înlocuite cu alte fotografii. Unele pagini vechi pot afișa un spațiu gol în locul acestor imagini până când fișierele originale sunt furnizate. Referințele dinamice din șabloanele JavaScript nu sunt considerate linkuri statice lipsă.

## Ce nu este încă integrat complet
1. CMS-ul salvează conținutul în `cms-staging`; fluxul complet de aprobare formală, promovare în `main`, verificare live și rollback operațional trebuie testat și completat.
2. Chatul public de pe website nu este încă unificat funcțional cu inbox-ul CRM. Fișierele CRM de chat au fost păstrate, dar integrarea publică/realtime trebuie testată.
3. Unele module din master plan (devize, contracte, materiale, sarcini, documente, garanții, intervenții și financiar) nu există ca pagini separate în arhiva CRM furnizată. Nu au fost inventate.
4. Dashboard-ul afișează statistici în limita tabelelor și politicilor RLS accesibile utilizatorului autentificat; `—` indică o interogare indisponibilă.
5. Nu s-a efectuat test real de browser cu conturi din roluri diferite, nici test HTTP complet pentru Edge Functions.

## Ce nu s-a făcut
- Nicio scriere în GitHub din această sesiune.
- Nicio publicare în GitHub Pages sau pe `valmex.md`.
- Nicio migrare sau modificare în Supabase.
- Nicio modificare de preț sau formulă.
- Nicio ștergere din proiectul sursă.

## Teste locale prevăzute pentru această revizie
- Sintaxă JavaScript inline pentru Dashboard, CMS și autentificare.
- Verificarea rutelor locale și a fișierelor statice restaurate.
- Compararea hash-ului Calculatorului LIVE cu arhiva CRM sursă.
- Compararea hash-ului `cms/content.json` cu arhiva V2 sursă.
- Verificarea structurii ZIP și a integrității arhivei.


## Limitele reviziei 3
- Structura modulelor este prezentă local, dar modulele noi nu sunt încă legate la tabelele backend.
- Navigarea comună este folosită de paginile noi; paginile CRM preexistente își păstrează momentan propriul layout pentru a evita regresii.
- Permisiunile din `permissions.js` controlează doar vizibilitatea UI. RLS și autorizarea server-side rămân obligatorii și nu sunt înlocuite de acest fișier.
- Nu s-a făcut test cu autentificare reală, browser complet sau utilizatori cu roluri diferite.


## Extindere financiară — etapa 6
- `Crm/financiar.html` încarcă modulul read-only `Crm/finance/finance.js`.
- Afișează contracte, încasări, solduri contractuale și costuri materiale din sursele existente `contracts`, `payments`, `contract_financial_summary` și `project_materials`.
- Accesul UI este restricționat temporar la rolurile `admin` și `administrator`; RLS rămâne obligatoriu.
- Nu se calculează profit și nu se inventează costuri lipsă. Lemnul, manopera, transportul, comisioanele și cheltuielile diverse necesită confirmarea schemei de date înainte de centralizare.
- Modulul este read-only; nu scrie în Supabase și nu execută migrări.


## Financiar — extindere revizia 5
- Export CSV pentru Excel cu sumar, contracte, încasări și materiale.
- Export PDF prin funcția de tipărire a browserului.
- Calculator rapid: adunare, scădere, înmulțire, împărțire, egal și resetare.
- Exportul folosește exclusiv datele deja citite de modul și accesibile contului. Nu inventează costuri lipsă și nu calculează profit.
- CRM Chat folosește endpoint-ul `valmex-chat-api` și reîmprospătare periodică. Fișierul `chat-widget.js` este configurat pentru același endpoint, dar nu este inclus în paginile publice; acestea păstrează Jivo. Integrarea widgetului public rămâne neactivată până la aprobarea înlocuirii furnizorului actual.

## Limitări de verificare
- Exportul PDF/CSV trebuie probat în browser cu un cont autorizat.
- RLS, Edge Function și datele reale Supabase nu au fost testate în această etapă.
- Nu s-au efectuat modificări în Supabase, GitHub sau producție.


## REV6 — Dashboard și Chat VALMEX

- Dashboard central modernizat cu carduri și pictograme, navigare laterală fixă pe desktop și meniu compact pe mobil.
- Shell-ul comun include Dashboard și pictograme în navigarea modulelor.
- Linkurile de revenire în CRM și Calculator LIVE sunt săgeți compacte, fără textul „Înapoi la Dashboard”.
- Scripturile Jivo au fost înlocuite în paginile publice cu `/chat-widget.js`, widgetul VALMEX conectat la endpoint-ul `valmex-chat-api`.
- Fragmentul legacy orfan din `chat-widget.js` a fost eliminat; verificarea live a răspunsului AI rămâne necesară.
- Nu s-au făcut scrieri în GitHub/Supabase și nu s-a publicat în producție.


## REV8 — Ajustări design website public
- Eliminat comutatorul Dark/Light; site-ul rămâne permanent în Light Mode.
- Antetul public și dropdown-urile au stil alb, lizibil, cu accent VALMEX.
- Meniurile Servicii și Calculatoare au submeniuri mobile compacte, cu deschidere prin apăsare.
- Adăugat `nav-ui.js` pentru interacțiunile dropdown pe mobil.
- Pictograma chat a fost înlocuită cu SVG de conversație, fără simbolul plic. API-ul și logica chatului au rămas neschimbate.
- Verificare statică JavaScript trecută; test vizual în browser și conversație live încă neefectuate.

## REV9 – traseul clientului și verificarea popup-urilor (local)

- Adăugat un ghid de acces rapid pe toate cele 20 de pagini publice: Acoperișuri, Fațade, AMK, Pavaje, Produse, Proiecte, Calculatoare, Rate 0% și Contact.
- Adăugat pe pagina principală un bloc „Cu ce te putem ajuta?” cu trasee directe către serviciile, catalogul, proiectele și calculatoarele potrivite.
- Corectate semnalele de interes pentru calculatorul de acoperiș.
- Verificare popup-uri: `popup.enabled=false` pentru popup-ul generic vechi; `smart.enabled=true` pentru cele 3 popup-uri contextuale: acoperișuri, fațade și rate 0%.
- Smart Conversion rulează numai după acceptarea explicită a analizei în bannerul de consimțământ. Refuzul nu activează urmărirea.
- Frecvență: maximum un popup pe sesiune; după „Nu” sau conversie se aplică pauza de 30 zile per subiect.
- Declanșare contextuală prin semnale de interes (interacțiune cu calculatorul, vizualizarea prețurilor, revenire sau timp activ); nu există popup automat doar la încărcarea paginii.
- Toate cele 20 de pagini publice încarcă `nav-ui.js`, `cms-public.js`, `smart-conversion.js` și `cookie-consent.js`.
- Verificări locale: sintaxă JavaScript, validitate JSON și referințe către pagini HTML locale. Nu s-a confirmat încă rularea live în browser sau comportamentul pe domeniul public.


## REV10 – eliminarea barei duplicate „Cauți?”

- Eliminată bara suplimentară de acces rapid inserată sub antet pe paginile publice.
- Păstrat meniul principal existent ca singur punct de navigare.
- Păstrate comportamentele de deschidere/închidere a submeniurilor pe mobil din `nav-ui.js`.
- Eliminat CSS-ul dedicat barei duplicate.
- Nu au fost modificate paginile de conținut, linkurile meniului principal, calculatoarele, popup-urile sau integrarea chat.


## REV11 – navigare, hero și coerență CRM (19.11.2026)
- Meniul mobil nu se mai închide la apăsarea declanșatorului „Servicii”/„Calculatoare”; submeniul rămâne vizibil până la alegerea unei pagini.
- Eliminată promoția artificială „Oferta lunii” și logica de countdown asociată în pagina principală.
- Hero-ul are acum un carusel accesibil cu mesaje despre acoperișuri, fațade, AMK și rate 0% pentru lucrările eligibile; oprire la hover/focus și respectă prefers-reduced-motion.
- CMS Admin și Dashboard folosesc aceeași paletă, sidebar închis, accent roșu, carduri și antet. Admin are link vizibil „Dashboard” în antet și în sidebar.
- Nu au fost modificate prețuri, formule, baze de date, endpoint-uri sau publicarea.

## REV12 – banner principal și responsive

- Caruselul principal schimbă textul și fotografia corespunzătoare pentru acoperișuri, fațade, AMK și rate 0%.
- Textul de sub carusel este scurtat și încadrat într-un bloc cu contrast și lățime controlate.
- `valmex-responsive.css` este inclus în toate cele 14 pagini publice care au meta viewport.
- Verificarea statică HTML/JS/CSS a trecut. Captura Chromium headless a expirat, deci testarea vizuală pe dispozitive reale rămâne necesară.
