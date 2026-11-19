# VALMEX MASTER PLAN

## Document central de arhitectură, reguli și strategie

**Versiune:** 1.1\
**Data:** 18 noiembrie 2026\
**Statut:** Structura vizuală VALMEX Business System aprobată de utilizator la 18 noiembrie 2026; implementarea locală este în desfășurare.\
**Proiect:** VALMEX Business Management System + Website CMS\
**Website:** https://valmex.md\
**Repository cunoscut:** `totulshopmd-dotcom/valmex-site`\
**Platformă backend cunoscută:** Supabase\
**Principiu arhitectural aprobat:** sistem complet, modular, extensibil;
module independente la nivel de interfață și logică, conectate la
aceeași infrastructură și la aceeași bază de date comună.

------------------------------------------------------------------------

# 1. Scopul documentului

Acest document este sursa principală de adevăr pentru proiectarea,
dezvoltarea, testarea și întreținerea sistemului VALMEX.

Înainte de orice intervenție tehnică, asistentul sau dezvoltatorul
trebuie să consulte acest document, să verifice starea reală a
repository-ului și a backendului și să compare situația existentă cu
arhitectura aprobată.

Documentul trebuie actualizat după fiecare etapă importantă, decizie
arhitecturală sau schimbare confirmată. Nu se consideră implementată o
funcție doar pentru că este descrisă aici.

## 1.1 Obiective

-   Un singur sistem central pentru administrarea activității VALMEX.
-   Module distincte, cu responsabilități clare, dar conectate la
    aceeași bază de date.
-   O singură identitate de client, angajat, proiect și document în
    întregul sistem.
-   Acces controlat în funcție de rol și permisiuni individuale.
-   Protejarea datelor financiare, comerciale și personale.
-   Administrarea website-ului VALMEX din același sistem.
-   Integrarea chatului website cu CRM-ul și angajații.
-   Istoric verificabil, versiuni, backup și posibilitate de restaurare.
-   Interfață coerentă pe desktop, tabletă și telefon.
-   Extindere ulterioară fără reconstruirea modulelor existente.

## 1.2 Ce nu înseamnă arhitectura aprobată

„Sistem complet" nu înseamnă un singur fișier HTML uriaș sau o aplicație
monolitică greu de întreținut. Înseamnă o platformă unificată pentru
utilizator, cu module separate logic și tehnic, servicii comune și un
model de date coerent.

Modulele nu trebuie să copieze datele unele de la altele. Ele folosesc
aceleași înregistrări și identificatori.

------------------------------------------------------------------------

# 2. Reguli obligatorii de lucru

Aceste reguli se aplică tuturor intervențiilor.

1.  **Consultă MASTER PLAN înainte de lucru.** Verifică și
    deciziile/istoricul actualizat.
2.  **Inspectează starea reală.** Citește fișierul existent, schema
    bazei de date, funcțiile, politicile și integrarea relevantă înainte
    de modificare.
3.  **Nu reconstrui fără motiv și aprobare.** Păstrează funcțiile care
    lucrează și modifică punctual.
4.  **Nu presupune că o funcție există.** Confirmă prin cod, test sau
    rezultat verificabil.
5.  **Nu declara succes fără confirmare.** Commit, migrare, deploy,
    upload sau configurare sunt considerate reușite numai după răspuns
    pozitiv verificabil.
6.  **Nu modifica tarife, formule, condiții comerciale sau calcule fără
    instrucțiune explicită.**
7.  **Nu introduce chei secrete în HTML, JavaScript public, repository
    sau loguri.**
8.  **Nu utiliza tokenuri personale GitHub în browser ca mecanism
    permanent de administrare.**
9.  **Securitatea se impune în backend.** Ascunderea unui buton în
    interfață nu reprezintă control de acces.
10. **Fiecare modul trebuie să respecte navigarea, autentificarea,
    designul și permisiunile comune.**
11. **Orice modificare de schemă se face prin migrare versionată**, cu
    verificarea impactului și plan de rollback.
12. **Nu șterge definitiv date sau fișiere folosite** fără verificarea
    referințelor, backup și aprobare.
13. **Nu schimba structuri sau nume publice de API fără verificarea
    tuturor consumatorilor.**
14. **Testează scenariile normale, erorile și permisiunile** înainte de
    publicare.
15. **Actualizează acest document** cu ce s-a schimbat, ce s-a testat,
    ce a rămas și ce riscuri există.
16. **Separă clar**: existent și verificat / existent dar neverificat /
    propus / în lucru / finalizat.
17. **Nu expune datele unui client sau angajat altor utilizatori fără un
    motiv operațional și permisiune.**
18. **Nu modifica direct producția** când poate fi folosită o ramură de
    test/staging și o verificare înainte de publicare.

------------------------------------------------------------------------

# 3. Principii arhitecturale

## 3.1 Platformă unificată, module independente

Sistemul va avea: - o autentificare comună; - un model comun de
utilizatori, clienți și proiecte; - un strat comun de permisiuni; -
servicii comune pentru notificări, fișiere, audit și configurări; -
module UI independente; - API-uri/RPC-uri documentate și stabile; - o
bază de date comună Supabase, organizată pe domenii logice.

Un modul trebuie să poată fi dezvoltat sau înlocuit fără să oblige
reconstruirea întregii platforme.

## 3.2 Separarea responsabilităților

-   **Interfața:** afișează datele și oferă acțiuni permise.
-   **Serviciile de aplicație:** validează și coordonează fluxurile.
-   **Baza de date:** păstrează datele și integritatea relațiilor.
-   **RLS și funcțiile securizate:** impun accesul și regulile
    sensibile.
-   **Storage:** păstrează fișierele cu politici de acces.
-   **Realtime:** transmite schimbările autorizate.
-   **GitHub:** versionarea codului și a fișierelor website-ului.
-   **OneSignal:** livrarea notificărilor push, în condițiile
    configurării verificate.

## 3.3 Identificatori unici

Toate modulele trebuie să utilizeze identificatori stabili, nu nume sau
numere generate separat în browser. Codurile lizibile pentru
client/proiect se generează atomic în backend, pentru a evita
duplicatele la operațiuni simultane.

------------------------------------------------------------------------

# 4. Structura funcțională a platformei

## 4.1 Dashboard central

-   indicatori operaționali;
-   clienți și solicitări noi;
-   proiecte active și stări;
-   sarcini restante;
-   conversații noi/nepreluate;
-   activitatea angajaților;
-   alerte și notificări;
-   acces rapid la module, conform permisiunilor.

Dashboard-ul nu trebuie să expună automat toate datele financiare
tuturor utilizatorilor.

## 4.2 Clienți și solicitări

-   registru unic de clienți;
-   date de contact și localitate;
-   sursa solicitării;
-   istoric de apeluri, mesaje și activități;
-   legături cu conversații, oferte și proiecte;
-   status comercial;
-   căutare, filtrare și arhivare;
-   prevenirea duplicatelor și unificare controlată.

## 4.3 Calculator LIVE și ofertare

-   păstrarea calculatorului existent și a formulelor verificate;
-   măsurări și parametri;
-   materiale și servicii;
-   ofertă pentru client;
-   versiuni ale ofertelor;
-   export document;
-   legătură cu clientul și proiectul;
-   protecția calculelor interne și a costurilor;
-   salvare atomică și tratarea conflictelor.

**Regulă comercială:** tarifele și formulele actuale nu se schimbă în
cadrul unei reorganizări tehnice. Orice schimbare comercială necesită
aprobare explicită.

## 4.4 Proiecte și fișa proiectului

-   date client și adresă/localitate;
-   măsurări;
-   oferte și revizii;
-   contracte;
-   materiale și consum;
-   fotografii înainte/în timpul/după;
-   documente;
-   sarcini și responsabili;
-   plăți și cheltuieli, cu acces restricționat;
-   garanții și intervenții;
-   jurnal cronologic al proiectului.

## 4.5 Administrare angajați

-   cont și stare activ/inactiv;
-   nume și rol intern;
-   fotografie de profil;
-   date de contact interne;
-   permisiuni individuale;
-   module accesibile;
-   activitate și istoric;
-   preferințe de notificare.

Angajatul poate actualiza câmpurile proprii aprobate, inclusiv
fotografia de profil. Administratorul controlează contul, rolul și
permisiunile. Datele publice pentru chat se separă de datele private de
personal.

## 4.6 Chat VALMEX

Chatul website-ului este un modul oficial al CRM-ului, nu o componentă
izolată.

Funcții planificate: - inbox central; - conversații noi, nealocate,
alocate mie, în lucru, în așteptarea clientului, escaladate și
închise; - profil public al operatorului: fotografie, nume,
rol/descriere aprobată și stare de disponibilitate; - mesaje text și
atașamente; - note interne invizibile clientului; - atribuire, transfer
și preluare conversație; - asociere cu clientul și proiectul; - istoric
complet; - șabloane de răspuns; - notificări și mențiuni interne; -
priorități, ore de lucru și indicatori de timp de răspuns; - evaluarea
conversației; - reguli anti-spam și limitare abuz; - mesaje offline și
solicitări de revenire.

Etape de canale: 1. chat pe valmex.md; 2. ulterior, integrarea canalelor
externe numai prin API-uri și aprobări oficiale: WhatsApp Business,
Facebook Messenger, Instagram Direct și email.

Nu se presupune că aceste canale sunt deja conectate.

## 4.7 Administrare Website / CMS

Se integrează în platforma centrală și include funcțiile din exemplul
`admin.html`: - administrarea textelor și secțiunilor; - prețuri publice
și servicii; - date de contact; - proiecte executate; - bibliotecă
imagini; - SEO per pagină; - sitemap și robots; - popup-uri și reguli de
afișare; - formulare și cereri; - istoric, restaurare și
export/import; - previzualizare; - publicare controlată.

### Flux de publicare

1.  utilizatorul modifică datele;
2.  sistemul validează câmpurile;
3.  se salvează o versiune de lucru;
4.  se generează previzualizarea;
5.  utilizatorul autorizat aprobă;
6.  sistemul publică;
7.  se verifică rezultatul live;
8.  se înregistrează cine, ce și când a publicat.

Nu se publică direct modificări nevalidate. CMS-ul trebuie să evite
suprascrierea concurentă și să aibă versiuni/rollback.

## 4.8 Materiale și aprovizionare

-   catalog de materiale;
-   unități de măsură;
-   prețuri de achiziție cu permisiuni;
-   materiale planificate și consumate pe proiect;
-   furnizori, dacă modulul va fi confirmat;
-   mișcări și ajustări cu audit.

## 4.9 Sarcini, pontaj și operațiuni

-   sarcini atribuite;
-   responsabil și termen;
-   status și comentarii;
-   sesiuni de lucru;
-   pauze și corectări;
-   aprobarea corectărilor;
-   legătură cu proiectul;
-   istoric și rapoarte.

## 4.10 Financiar

Datele financiare se separă logic și prin permisiuni: - valoarea de
vânzare; - contracte și încasări; - avansuri și restanțe; - costuri
materiale; - lemn; - manoperă; - transport; - cheltuieli diverse; -
comisioane de finanțare; - lucrări suplimentare; - cost final și
marjă/profit.

Accesul la prețul clientului nu implică automat acces la costul intern
sau profit. Dacă este necesară confidențialitate la nivel de câmp,
aceasta trebuie aplicată prin tabele, view-uri sau RPC-uri securizate,
nu doar prin ascunderea câmpurilor în HTML.

## 4.11 Notificări

-   centru central în Dashboard;
-   preferințe per angajat;
-   notificări pentru chat, sarcini, proiecte, clienți, termene și
    aprobări;
-   configurare administrativă;
-   OneSignal pentru push, după verificarea abonamentului, identității
    și permisiunilor;
-   funcționare independentă de menținerea deschisă a calculatorului;
-   stări de livrare și erori verificabile.

## 4.12 Rapoarte și audit

-   rapoarte operaționale;
-   performanță și volum de lucru;
-   istoric modificări;
-   jurnal de autentificare și acțiuni importante;
-   export conform permisiunilor;
-   păstrarea trasabilității.

------------------------------------------------------------------------

# 5. Navigare și interfață

Toate paginile autentificate folosesc un sistem comun de navigare: -
sidebar pe desktop; - meniu compact pe mobil; - breadcrumb și titlu
consistent; - profilul angajatului și fotografia; - notificări; - link
către Dashboard; - module afișate conform permisiunilor.

Navigarea nu trebuie copiată și întreținută separat în fiecare pagină.
Se recomandă un layout comun și componente reutilizabile.

Designul trebuie să fie coerent, rapid, lizibil și responsive. Interfața
nu trebuie să sacrifice funcționalitatea pe ecrane mici.

------------------------------------------------------------------------

# 6. Model de date și domenii

Schema actuală cunoscută include tabele precum: `profiles`, `clients`,
`projects`, `activities`, `tasks`, `work_sessions`, `documents`,
`project_photos`, `payments`, `measurements`, `quotations`,
`quotation_items`, `contracts`, `contract_documents`,
`material_catalog`, `project_materials`, `warranties`, `interventions`,
`work_session_pauses`, `work_session_corrections`,
`work_session_activity`, `client_reminders`.

Acestea sunt inventarul cunoscut din auditul anterior, nu o confirmare
că schema este completă sau corectă. Înainte de migrare trebuie extrasă
schema reală, constrângerile, indexurile, trigger-ele, politicile și
dependențele.

## 6.1 Domenii logice propuse

-   Identity & Access: profiles, roles, permissions, role_permissions,
    user_permissions.
-   CRM: clients, client_contacts, client_activities.
-   Projects: projects, measurements, project_photos, project_events.
-   Sales: quotations, quotation_items, quotation_revisions.
-   Operations: tasks, work_sessions, pauses, corrections.
-   Documents: documents, contracts, contract_documents.
-   Inventory: material_catalog, project_materials, stock movements dacă
    se aprobă.
-   Finance: payments, costs, commissions, project_finance.
-   Service: warranties, interventions.
-   Chat: conversations, messages, assignments, participants,
    internal_notes, attachments, status_events.
-   CMS: website_content, website_pages, website_media,
    website_releases, seo_metadata, popup_rules.
-   Notifications: notification_preferences, notification_events,
    delivery_logs.
-   Governance: audit_logs, system_settings, integration_settings.

Acestea sunt domenii de proiectare. Nu se creează automat toate
tabelele; mai întâi se compară cu schema existentă și se reutilizează ce
este corect.

## 6.2 Relații obligatorii

-   conversația poate fi asociată cu un client și opțional cu un
    proiect;
-   oferta aparține unui client și poate aparține unui proiect;
-   proiectul aparține unui client;
-   documentele au proprietar logic și legătură cu clientul/proiectul;
-   sarcinile pot fi asociate cu proiectul și responsabilul;
-   plățile și costurile sunt legate de proiect/contract;
-   mesajele aparțin unei conversații și au autor;
-   acțiunile CMS au autor și versiune.

Nu se creează înregistrări duplicate în module doar pentru a afișa
aceeași informație.

------------------------------------------------------------------------

# 7. Securitate și permisiuni

## 7.1 Principiu

Accesul este refuzat implicit și acordat explicit. Permisiunile se
verifică în backend la fiecare operațiune sensibilă.

## 7.2 Exemple de permisiuni

-   `clients.view`, `clients.create`, `clients.update`,
    `clients.archive`;
-   `projects.view`, `projects.create`, `projects.update`,
    `projects.archive`;
-   `quotations.view`, `quotations.create`, `quotations.approve`;
-   `finance.sale_price.view`;
-   `finance.material_cost.view`;
-   `finance.labor_cost.view`;
-   `finance.commission.view`;
-   `finance.profit.view`;
-   `finance.update`;
-   `cms.content.edit`;
-   `cms.prices.edit`;
-   `cms.seo.edit`;
-   `cms.publish`;
-   `chat.view_all`, `chat.reply`, `chat.assign`, `chat.manage`;
-   `employees.manage`;
-   `permissions.manage`;
-   `audit.view`.

Rolurile sunt presetări pentru atribuirea inițială a permisiunilor, nu
înlocuitor pentru permisiunile individuale.

## 7.3 Verificări obligatorii

-   audit complet RLS;
-   verificarea funcțiilor `SECURITY DEFINER` și a granturilor;
-   protecția Storage;
-   validarea utilizatorului în RPC;
-   verificarea accesului între clienți/proiecte;
-   protejarea secretelor;
-   limitarea uploadurilor și validarea tipurilor;
-   protecție anti-spam și rate limiting pentru chat/formulare;
-   logarea operațiunilor sensibile;
-   verificarea politicilor de ștergere și arhivare.

În auditul anterior au fost observate politici SELECT largi pentru
utilizatori autentificați în unele tabele, inclusiv profiles, clients și
projects, precum și avertizări privind funcții SECURITY DEFINER și
setări de securitate. Aceste observații trebuie reverificate în starea
actuală înainte de orice schimbare. Nu se presupune că au fost remediate
integral.

------------------------------------------------------------------------

# 8. Fișiere, imagini și Storage

-   fotografiile angajaților se păstrează într-un spațiu dedicat și
    controlat;
-   imaginile publice ale website-ului pot avea acces public numai dacă
    sunt destinate publicării;
-   documentele clientului, contractele și documentele interne nu
    trebuie să fie publice;
-   atașamentele chatului respectă accesul conversației;
-   validare MIME, extensie, dimensiune și conținut;
-   denumiri stabile și metadate;
-   ștergerea se face cu verificarea referințelor;
-   se păstrează istoric și backup conform politicii aprobate.

------------------------------------------------------------------------

# 9. GitHub, medii și publicare

Repository cunoscut: `totulshopmd-dotcom/valmex-site`.

Se verifică ramurile reale, workflow-urile, GitHub Pages și configurația
actuală înainte de utilizare.

Strategie propusă: - `main`: producție; - ramură de integrare/staging,
de exemplu `cms-staging` sau altă denumire confirmată după audit; -
branch-uri scurte pentru funcții și remedieri; - pull request sau
verificare echivalentă înainte de integrare; - teste și verificare
vizuală; - publicare și smoke test.

Nu se presupune că `cms-staging` există sau este configurată corect până
la verificarea repository-ului.

Secretele de server rămân în Supabase Secrets / GitHub Secrets sau
mecanisme echivalente. Tokenul GitHub nu se păstrează în localStorage și
nu se expune în frontend.

------------------------------------------------------------------------

# 10. Integrări

## Supabase

Auth, PostgreSQL, RLS, Storage, Realtime și Edge Functions. Se verifică
toate serviciile și configurațiile existente înainte de extindere.

## OneSignal

Push notifications. Se verifică App ID, worker, abonamente, external ID,
permisiuni, targetare, livrare și loguri. Cheile REST/API rămân exclusiv
server-side.

## GitHub

Versionarea codului și a conținutului website-ului. Scrierea se face
prin backend securizat sau workflow autorizat, nu prin token expus în
browser.

## Alte canale

WhatsApp, Facebook, Instagram și email sunt extensii viitoare, numai
după verificarea API-urilor, accesului și cerințelor fiecărui furnizor.

------------------------------------------------------------------------

# 11. Calitatea datelor și fiabilitate

-   constrângeri și chei străine;
-   indexuri pentru coloanele de filtrare și relații;
-   tranzacții pentru operațiuni compuse;
-   idempotency pentru operațiuni repetabile;
-   tratarea conflictelor concurente;
-   validare server-side;
-   paginare pentru liste mari;
-   căutare eficientă;
-   logging fără secrete;
-   retry controlat;
-   stări explicite pentru erori și operațiuni în așteptare.

------------------------------------------------------------------------

# 12. Testare și criterii de acceptare

Nicio etapă nu este completă până când: 1. funcția este implementată; 2.
permisiunile sunt testate cu utilizatori din roluri diferite; 3.
scenariile normale și de eroare sunt testate; 4. datele sunt verificate
în baza de date; 5. interfața este verificată pe desktop și mobil; 6.
integrarea cu modulele dependente este verificată; 7. logurile nu conțin
secrete; 8. există plan de rollback; 9. documentația este actualizată;
10. rezultatul este confirmat printr-un test real.

Teste de securitate obligatorii: - angajat fără permisiune nu poate
apela direct RPC/API; - angajat nu poate accesa date financiare
interzise; - operator chat nu poate citi conversații nealocate dacă
politica nu îi permite; - utilizator public nu poate citi date CRM; -
uploadurile nu pot fi folosite pentru acces la documente private; - un
utilizator dezactivat nu mai poate efectua operațiuni.

------------------------------------------------------------------------

# 13. Strategie de implementare

## Etapa 0 --- Audit și inventar

-   repository complet: fișiere, pagini, linkuri, scripturi, branch-uri,
    workflow-uri;
-   Supabase: tabele, coloane, chei, indexuri, views, RPC, triggers,
    policies, buckets, Edge Functions, cron;
-   OneSignal: SDK, worker, identitate, abonamente și funcții
    server-side;
-   verificarea fiecărui modul actual;
-   hartă a dependențelor;
-   registru de probleme și riscuri.

**Livrabil:** raport de audit cu status verificat, neverificat, risc și
recomandare.

## Etapa 1 --- Proiectarea fundației

-   modelul de utilizatori;
-   roluri și permisiuni;
-   layout și navigare comună;
-   audit log;
-   servicii comune;
-   convenții de cod și migrare.

**Livrabil:** arhitectură tehnică detaliată și migrații aprobate.

## Etapa 2 --- Stabilizarea modulelor CRM

-   clienți;
-   proiecte;
-   calculator și oferte;
-   fișa proiectului;
-   documente;
-   sarcini și pontaj.

**Livrabil:** module integrate, fără duplicarea datelor.

## Etapa 3 --- CMS Website

-   separarea conținutului de cod;
-   editare cu validare;
-   media library;
-   SEO;
-   preview;
-   versiuni și publicare controlată;
-   restaurare.

## Etapa 4 --- Chat VALMEX

-   inbox;
-   profiluri publice de operator;
-   asignare;
-   mesaje și atașamente;
-   realtime;
-   asociere cu client/proiect;
-   reguli de securitate și retenție.

## Etapa 5 --- Financiar și operațional

-   costuri și încasări;
-   acces la nivel de câmp/domeniu;
-   rapoarte;
-   aprobări;
-   inventar și materiale.

## Etapa 6 --- Notificări și automatizări

-   centru de notificări;
-   OneSignal;
-   notificări pentru chat și activități;
-   reguli și preferințe.

## Etapa 7 --- Consolidare și lansare

-   testare integrală;
-   optimizare;
-   backup și recuperare;
-   documentație;
-   publicare etapizată.

Ordinea poate fi ajustată numai pe baza auditului și a dependențelor
reale. Nu se începe o etapă care depinde de o fundație nesigură.

------------------------------------------------------------------------

# 14. Registrul stării proiectului

Acest registru trebuie actualizat la fiecare sesiune.

  -----------------------------------------------------------------------
  Element                 Stare cunoscută         Ce trebuie verificat
  ----------------------- ----------------------- -----------------------
  Repository GitHub       Repository identificat  ramuri, workflow,
                                                  fișiere actuale și
                                                  acces de scriere

  CRM HTML                Mai multe pagini        cod complet, linkuri,
                          existente               funcții și consistență

  Supabase                Proiect identificat     schema, RLS, RPC,
                                                  Storage, Realtime,
                                                  triggers

  Calculator LIVE         Fișier existent         formule, salvare, PDF,
                                                  notificări și regresii

  OneSignal               SDK și worker observate livrare reală,
                                                  identități, permisiuni
                                                  și loguri

  CMS `admin.html`        Exemplu furnizat și     integrare, securitate
                          analizat                și funcții complete

  Chat CRM                Cerință aprobată        nu este confirmat ca
                                                  implementat

  Navigare comună         Cerință aprobată        implementarea în toate
                                                  paginile

  Permisiuni individuale  Cerință aprobată        model și enforcement
                                                  backend

  Publicare website       flux propus             staging, backend
                                                  securizat și verificare
                                                  live
  -----------------------------------------------------------------------

### Convenție de status

-   **PROPUS** --- descris, neimplementat.
-   **DE AUDITAT** --- există indicii, dar nu este verificat.
-   **VERIFICAT** --- confirmat prin inspectare/test.
-   **ÎN LUCRU** --- implementare începută.
-   **IMPLEMENTAT** --- codul există.
-   **TESTAT** --- testele relevante au trecut.
-   **PUBLICAT** --- disponibil în producție și verificat.
-   **BLOCAT** --- dependență sau problemă nerezolvată.

Nu se schimbă statusul fără dovezi.

------------------------------------------------------------------------

# 15. Jurnalul deciziilor

  -----------------------------------------------------------------------
  Data                    Decizie                 Statut
  ----------------------- ----------------------- -----------------------
  18.11.2026              Arhitectură completă,   Aprobat
                          modulară, extensibilă,  
                          cu bază de date comună  

  18.11.2026              CMS Website face parte  Aprobat
                          din sistemul central    

  18.11.2026              Chatul website este     Aprobat ca direcție
                          modul CRM și va permite 
                          mai mulți operatori cu  
                          fotografie de profil    

  18.11.2026              Modificările website    Aprobat ca direcție
                          trec prin preview,      
                          aprobare și publicare   
                          controlată              

  18.11.2026              Auditul precedă         Regulă obligatorie
                          modificările tehnice    
                          majore                  
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# 16. Protocolul fiecărei sesiuni de lucru

La început: 1. citește acest document și promptul de implementare; 2.
verifică dacă există o versiune mai nouă în repository; 3. identifică
obiectivul exact al sesiunii; 4. inspectează fișierele și serviciile
afectate; 5. notează dependențele și riscurile; 6. prezintă planul de
modificare dacă există risc de regresie.

În timpul lucrului: 1. modifică numai domeniul aprobat; 2. păstrează
funcțiile existente; 3. folosește migrații și backup unde este cazul; 4.
testează fiecare flux; 5. nu expune chei sau date private.

La final: 1. listează fișierele/tabelele/funțiile modificate; 2. descrie
testele efectuate și rezultatele; 3. declară explicit ce nu a fost
verificat; 4. raportează riscurile rămase; 5. actualizează registrul și
jurnalul; 6. nu pretinde că s-a publicat dacă nu există confirmare.

------------------------------------------------------------------------

# 17. Regula supremă

**VALMEX se dezvoltă ca un singur sistem coerent, nu ca o colecție de
pagini independente.** Fiecare modul își păstrează responsabilitatea și
poate evolua separat, dar folosește aceeași identitate, aceeași bază de
date, aceleași reguli de acces și aceleași servicii comune.

Orice soluție care dublează date, expune secrete, ocolește permisiunile
sau compromite funcțiile existente trebuie respinsă și reproiectată.


------------------------------------------------------------------------

# 18. Jurnal implementare locală — 18.11.2026

## Revizia Unified Staging 2

**Statut: IMPLEMENTAT LOCAL / TESTARE PARȚIALĂ / NEPUBLICAT**

### Confirmat în fișiere
- Website-ul V2 și CRM-ul existent sunt reunite în aceeași structură de directoare.
- Dashboard-ul are legături distincte pentru CMS Website și administrarea angajaților.
- `Crm/admin.html` este CMS Website și verifică sesiunea Supabase, profilul activ și rolul administrator/admin.
- `Crm/angajati.html` rămâne pagina separată pentru administrarea angajaților.
- `/admin.html` intră prin autentificarea CRM, nu ocolește pagina de login.
- CMS-ul existent utilizează Edge Function `github-repo-bridge`; tokenul GitHub nu este solicitat în browser.
- Activele statice disponibile din arhiva CRM au fost restaurate în rădăcina site-ului.

### Protecții respectate
- `Crm/calculator-live.html` nu a fost modificat.
- `cms/content.json` nu a fost modificat.
- Nu au fost schimbate tarife, formule sau reguli comerciale.
- Nu au fost executate migrări Supabase.
- Nu s-a scris în GitHub și nu s-a publicat în producție.

### Teste locale
- Sintaxa JavaScript inline pentru paginile de autentificare, Dashboard și CMS.
- Existența rutelor și a activelor restaurate.
- Hash-uri comparative pentru fișierele protejate.
- Integritatea arhivei ZIP.

### Neverificat / blocat
- Autentificarea și rolurile cu conturi reale în browser.
- Operațiile reale ale Edge Function `github-repo-bridge` din pagina CMS.
- RLS pentru fiecare tabel și rol.
- Testarea vizuală completă pe telefon și desktop.
- Fluxul formal de aprobare, promovare și rollback în producție.
- Patru imagini menționate în `README-UNIFIED-STAGING.md` nu se găseau în arhiva sursă.

Această etapă nu schimbă statutul modulelor ca PUBLICAT. Pachetul rămâne local, pentru revizie.


------------------------------------------------------------------------

# 14. Decizie aprobată și jurnal de implementare — 18 noiembrie 2026

Utilizatorul a aprobat structura vizuală VALMEX Business System și a
confirmat continuarea implementării complete locale, păstrând
mecanismele existente. Strategia de lucru este incrementală: se
construiește structura și se integrează mecanismele deja disponibile;
verificarea aprofundată a conexiunilor și corectarea problemelor se
continuă ulterior. Această decizie nu anulează regulile de protecție a
prețurilor, formulelor, datelor și producției.

## 14.1 Structură adăugată local în revizia 3

- servicii comune frontend: Supabase client, sesiune/autentificare și
  ajutor de vizibilitate a modulelor;
- registru central al modulelor;
- shell UI comun responsive pentru paginile noi;
- pagini structurale: oferte, sarcini, documente, contracte, materiale,
  financiar, garanții, intervenții, rapoarte, notificări, configurări și
  jurnal de audit;
- legături către modulele noi în Dashboard.

## 14.2 Clasificarea implementării

- **EXISTENT / PĂSTRAT:** Login, Dashboard, CMS Website, administrare
  angajați, clienți, proiecte, Calculator LIVE, Chat CRM, pontaj și fișa
  proiectului.
- **IMPLEMENTAT — structură UI:** modulele enumerate la 14.1 și
  infrastructura comună pentru paginile noi.
- **NEIMPLEMENTAT:** operațiunile CRUD și fluxurile reale ale modulelor
  noi; integrarea completă a tuturor paginilor vechi în shell comun;
  conectarea integrală a chatului public cu inbox-ul CRM; fluxul complet
  de publicare CMS; rapoartele și automatizările backend.
- **NEVERIFICAT:** sesiuni reale, permisiuni/RLS, citire/scriere prin
  Supabase, OneSignal și bridge în condiții reale.

## 14.3 Protecții respectate în revizia 3

- nu s-au modificat formulele sau tarifele calculatorului;
- nu s-a modificat `cms/content.json`;
- nu s-au executat migrații sau modificări în Supabase;
- nu s-a scris în GitHub și nu s-a publicat website-ul;
- nu s-au șters fișiere sau date existente.

## 14.4 Următoarea etapă

Integrarea graduală a modulelor existente și noi cu modelul de date
existent, începând cu fișa unică Client → Proiect → Ofertă, apoi Sarcini,
Documente, Materiale, Financiar și Chat. Înaintea oricărei migrări se
compară schema reală și se reutilizează tabelele existente.


------------------------------------------------------------------------

# 15. Implementare locală — Etapa 6: Financiar și costuri interne

**Data:** 19 noiembrie 2026  
**Statut:** INTERFAȚĂ FUNCȚIONALĂ DE CITIRE / FĂRĂ MIGRĂRI / NEVERIFICATĂ ÎN PRODUCȚIE

## 15.1 Implementat

- `Crm/financiar.html` încarcă modulul dedicat `Crm/finance/finance.js`.
- Modulul folosește autentificarea și shell-ul comun VALMEX.
- Accesul UI la modulul Financiar este limitat momentan la rolurile
  `admin` și `administrator`; aceasta este o măsură temporară de
  interfață, nu înlocuiește RLS.
- Sunt citite sursele existente folosite deja în CRM: `contracts`,
  `payments`, `project_materials` și view-ul `contract_financial_summary`.
- Sunt afișate valoarea contractelor, încasările, soldurile contractuale
  returnate de view, costul planificat și costul efectiv al materialelor.
- Costul materialelor efective se calculează exclusiv ca
  `actual_quantity × actual_unit_price`; planificatul ca
  `planned_quantity × planned_unit_price`.
- Interogările au limite explicite, stări de încărcare și raportarea
  erorilor individuale ale surselor.
- Modulul este read-only: nu introduce, editează sau șterge înregistrări.

## 15.2 Limite și elemente neimplementate

- Nu a fost confirmată în fișierele proiectului o schemă pentru tabelele
  `costs`, `commissions` sau `project_finance`; nu au fost inventate
  coloane și nu au fost create tabele.
- Lemnul, manopera, transportul, comisioanele și cheltuielile diverse
  sunt afișate ca surse de cost care necesită centralizare, nu ca valori
  zero.
- Nu se calculează profit sau marjă; costul materialelor nu reprezintă
  costul total al proiectului.
- Încasările folosesc `contract_financial_summary.total_paid` când view-ul
  este disponibil; dacă view-ul nu poate fi citit, interfața folosește
  suma din `payments` și marchează această limitare.
- Nu au fost create formulare de introducere a cheltuielilor deoarece
  schema și regulile backend pentru registrul de costuri nu sunt încă
  confirmate.

## 15.3 Protecții și teste

- Nu s-au modificat tarife, formule sau Calculatorul LIVE.
- Nu s-au executat migrări și nu s-a scris în Supabase sau GitHub.
- Sintaxa JavaScript pentru modulul financiar, shell și configurația
  modulelor a fost verificată local cu `node --check`.
- Verificările statice confirmă încărcarea modulului și referințele la
  sursele de date existente.
- Interogările reale, permisiunile RLS și valorile returnate trebuie
  verificate ulterior cu un cont autorizat.

## 15.4 Următorul pas

Continuarea integrării financiare după confirmarea schemei backend:
registru de costuri interne cu categorii, documente justificative,
responsabil, dată, proiect și audit; centralizarea costurilor din
calculator și materiale; apoi calculul marjei/profitului numai după
validarea regulilor contabile și comerciale VALMEX.


## 15.5 Extindere locală — export financiar și calculator rapid

**Data:** 19 noiembrie 2026  
**Statut:** IMPLEMENTAT LOCAL / NEVERIFICAT ÎN BROWSER CU DATE REALE

- Modulul Financiar include export CSV compatibil cu Excel, cu secțiuni separate pentru sumar, contracte, încasări și materiale. Fișierul folosește UTF-8 BOM și separator `;` pentru compatibilitate practică cu setările regionale.
- Modulul include export pentru tipărire / salvare PDF prin dialogul browserului. Raportul conține sumarul și tabelele contractelor, încasărilor și materialelor.
- Exporturile includ numai datele deja încărcate și accesibile contului; nu includ costuri interne pentru care nu există sursă confirmată și nu calculează profit.
- Accesul la export este în aceeași interfață administrativă ca modulul Financiar. Restricția UI nu substituie autorizarea backend. Înregistrarea exportului în audit nu a fost adăugată deoarece schema jurnalului nu a fost confirmată.
- A fost adăugat un calculator rapid cu operațiile `+`, `−`, `×`, `÷`, `=` și resetare. Calculatorul este independent, nu scrie în CRM și nu modifică formule comerciale.
- `Crm/chat.html` folosește endpoint-ul Edge Function `valmex-chat-api` și are acțiuni pentru inbox, mesaje, asignare, schimbare status, preluare conversație, note interne și raport. Reîmprospătarea inbox-ului este periodică la 12 secunde; Realtime nu este confirmat.
- `chat-widget.js` este configurat să folosească același endpoint, dar verificarea paginilor HTML publice nu a găsit includerea acestui fișier. Paginile publice păstrează scriptul Jivo. Prin urmare, integrarea efectivă a widgetului VALMEX cu chatul public NU este considerată activă; nu am schimbat furnizorul de chat fără aprobare.

## 15.6 Teste suplimentare

- `node --check` pentru `Crm/finance/finance.js` — trecut.
- Verificare statică a controalelor de export CSV/PDF și a operațiilor aritmetice — trecută.
- Exportul propriu-zis în browser, deschiderea ferestrei de tipărire, compatibilitatea Excel pe dispozitive și citirea datelor live Supabase — rămân de verificat cu sesiune autorizată.


## 15.7 Extindere locală — Dashboard modern și înlocuirea Jivo cu Chat VALMEX

**Data:** 19 noiembrie 2026  
**Statut:** IMPLEMENTAT LOCAL / TESTE STATICE TRECUTE / CHAT LIVE NEVERIFICAT

- Dashboard-ul central a primit o interfață modernizată: contrast mai clar, carduri cu pictograme, spațiere și ierarhie vizuală simplificate, indicatori și layout adaptat pentru desktop/tabletă/telefon.
- Bara laterală de navigare este fixă și vizibilă pe desktop în Dashboard; pe ecrane mici se deschide ca meniu compact.
- Shell-ul comun al modulelor include Dashboard ca primă destinație, grupuri de navigare și pictograme uniforme.
- În paginile CRM independente și Calculatorul LIVE, linkul cu text „Înapoi la Dashboard” a fost înlocuit cu o săgeată accesibilă (aria-label și tooltip). Chat CRM are aceeași săgeată.
- Scriptul Jivo a fost eliminat din paginile HTML publice care îl încărcau; în locul lui este inclus `/chat-widget.js`, widgetul VALMEX care folosește endpoint-ul Supabase Edge Function `valmex-chat-api`.
- `chat-widget.js` avea un fragment legacy orfan concatenat după prima închidere a widgetului API. Fragmentul a fost eliminat; prima componentă autonomă, conectată la acțiunile `start`, `visitor_history` și `visitor_send`, a fost păstrată.
- Chat CRM existent păstrează inbox-ul, asignarea, statusurile, mesajele, notele interne, preluarea conversației și raportul AI. Nu s-a modificat logica Edge Function sau schema Supabase.

### Limite și verificări

- Nu a fost testată o conversație reală din website până la răspunsul AI/operator; funcționarea endpoint-ului, configurarea modelului AI și politicile backend rămân de verificat cu acces autorizat.
- Nu s-au efectuat modificări în Supabase, GitHub sau producție.
- Nu au fost schimbate formulele sau prețurile Calculatorului LIVE.
- Verificările locale includ sintaxa JavaScript pentru widget și shell, căutarea includerilor Jivo rămase și validarea structurală a fișierelor HTML modificate.


## REV8 — Ajustări design website public
- Eliminat comutatorul Dark/Light; site-ul rămâne permanent în Light Mode.
- Antetul public și dropdown-urile au stil alb, lizibil, cu accent VALMEX.
- Meniurile Servicii și Calculatoare au submeniuri mobile compacte, cu deschidere prin apăsare.
- Adăugat `nav-ui.js` pentru interacțiunile dropdown pe mobil.
- Pictograma chat a fost înlocuită cu SVG de conversație, fără simbolul plic. API-ul și logica chatului au rămas neschimbate.
- Verificare statică JavaScript trecută; test vizual în browser și conversație live încă neefectuate.

------------------------------------------------------------------------

# 18. REV12 – corectarea bannerului principal și verificare responsive

**Data:** 19 noiembrie 2026  
**Statut:** implementat local; verificare statică trecută; test vizual automat blocat de timeout-ul browserului.

- Caruselul principal de pe `index.html` are acum câte o fotografie reală pentru fiecare mesaj: acoperiș, fațadă, AMK și finanțare în rate.
- `hero-carousel.js` schimbă împreună textul, indicatorul activ și fotografia de fundal. Fotografiile sunt preîncărcate.
- În modul luminos, titlurile și descrierile caruselului au contrast întunecat și dimensiuni responsive; descrierea generală de sub carusel este încadrată într-un bloc lizibil, cu lățime controlată.
- Textul introductiv a fost simplificat pentru a explica serviciile și următorul pas al vizitatorului.
- A fost adăugat `valmex-responsive.css` la cele 14 pagini publice cu viewport: paginile de servicii, produse, proiecte, contact, despre, blog, politici și cele trei calculatoare.
- Regulile responsive tratează imaginile, iframe-urile, formularele, blocurile și titlurile la ecrane înguste, medii și late.
- Validări: `node --check` pentru carusel; parsare HTML pentru cele 14 pagini; toate cele patru căi de imagini există; acolade CSS echilibrate; fiecare pagină publică include stylesheet-ul responsive.
- Încercarea de captură Chromium headless la dimensiunea mobilă a expirat; prin urmare, nu se declară test vizual complet pe dispozitive. Recomandare: verificare manuală pe telefon/tabletă și desktop înainte de publicare.
- Nu au fost modificate calculatorul LIVE, `cms/content.json`, datele Supabase sau configurările GitHub. Nu s-a publicat în producție.


---

## REV13 — carusel principal și încărcare imediată (19.11.2026)

- Caruselul din `index.html` folosește titluri cu accent roșu și text negru, în aceeași familie tipografică cu titlurile publice VALMEX.
- Înălțimea cadrului caruselului este stabilizată separat pentru desktop și mobil; schimbarea slide-ului nu trebuie să modifice înălțimea cadrului sau să împingă conținutul paginii.
- Textul descriptiv al slide-urilor și rezumatul de sub carusel au contrast și dimensiuni explicite.
- Eliminată logica rămasă pentru `introScreen` din `valmex.js`; pagina nu mai așteaptă animația introductivă.
- Eliminat stilul `.intro-loader` și animația `spin` neutilizate din `valmex.css`.
- Status: implementat local; verificare statică efectuată. Testarea vizuală pe dispozitive reale și verificarea efectivă a timpului de încărcare în producție rămân necesare.
