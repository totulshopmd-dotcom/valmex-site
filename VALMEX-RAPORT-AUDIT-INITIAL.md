# VALMEX — Raport de audit inițial
**Arhivă analizată:** `VALMEX-UNIFIED-STAGING-REV12.zip`  
**Document de referință:** `VALMEX-MASTER-PLAN-STRATEGIE.md`  
**Data auditului:** 19 noiembrie 2026  
**Statut:** Audit static preliminar; fără modificări în proiect, Supabase, GitHub sau producție.

## 1. Inventarul arhivei

- 185 fișiere.
- 61 fișiere HTML.
- 22 fișiere JavaScript externe.
- 4 fișiere CSS.
- 34 imagini PNG, 39 JPG, 10 WebP și 2 JPEG.
- Sunt prezente site-ul public, calculatoarele, CRM-ul, CMS-ul, documentația și resursele statice.

## 2. Verificări efectuate

### JavaScript
- Au fost verificate static 80 de unități JavaScript: fișiere externe și scripturi inline executabile.
- Rezultat: 0 erori de sintaxă detectate.
- Datele JSON-LD și import maps au fost excluse corect din verificarea de sintaxă JavaScript.
- Verificarea sintaxei nu înlocuiește testarea în browser.

### Fișiere și resurse
Au fost găsite 7 referințe către imagini locale care nu există în arhivă:
- `images/amk/fatade-amk-proiect-finisat-5.jpg`
- `images/amk/fatade-amk-finisat-6.jpg`
- `images/amk/fatda-amk-finisat-8.jpg`
- `images/garduri/porti.jpg`

Prima imagine este referită în mai multe pagini. Lista conține 4 căi unice; numărul total de referințe este mai mare din cauza reutilizării imaginilor. Nu au fost inventate înlocuitoare.

Linkurile `wa:site.contact.whats` și `viber://...` sunt scheme de contact, nu fișiere locale lipsă. Referințele dinamice din template-uri nu pot fi validate printr-o verificare simplă `href/src`.

## 3. Probleme confirmate în codul arhivei

### 3.1. Module CRM structurale
Următoarele 11 pagini sunt în principal shell-uri de interfață și nu conțin implementarea operațională a modulelor:
- Oferte
- Sarcini
- Documente
- Contracte
- Materiale
- Garanții
- Intervenții
- Rapoarte
- Notificări
- Setări
- Jurnal de audit

Fișierele încarcă serviciile comune și configurația shell-ului, dar nu implementează fluxurile de date descrise în Master Plan. Modulul Financiar are o pagină wrapper și un script separat read-only; nu trebuie confundat cu un modul financiar complet.

### 3.2. Calculator LIVE și CRM
În cod există:
- inițializarea clientului Supabase;
- verificarea sesiunii și a profilului activ;
- apel RPC `valmex_live_save_offer`;
- încărcarea PDF-ului în Storage și înregistrarea lui în `documents`;
- sincronizarea mementourilor.

Acestea sunt dovezi de implementare în frontend, nu confirmarea că RPC-ul, politicile RLS, bucket-ul Storage și fluxul complet funcționează în backend. Sunt necesare teste cu un cont autorizat și date de test controlate.

### 3.3. Chat public și Inbox CRM
Paginile publice includ `chat-widget.js`. Widgetul folosește endpoint-ul `valmex-chat-api`, stochează un token de sesiune publică și face polling pentru istoricul conversației. CRM Chat folosește același endpoint conform codului și documentației arhivei.

Rămân neverificate:
- existența și comportamentul real al Edge Function;
- salvarea și asocierea mesajelor;
- răspunsurile AI și răspunsurile operatorului;
- RLS și izolarea conversațiilor;
- notificarea operatorului când pagina CRM nu este deschisă;
- comportamentul după închiderea browserului.

### 3.4. OneSignal
Sunt prezente:
- SDK-ul OneSignal Web SDK v16 în Calculatorul LIVE;
- `OneSignalSDKWorker.js`, care încarcă worker-ul oficial;
- inițializarea cu App ID;
- asocierea utilizatorului autentificat prin `OneSignal.login`;
- solicitarea permisiunii la apăsarea butonului de activare.

Diferență față de cerința Master Plan: în codul verificat solicitarea permisiunii este declanșată de buton, nu de un flux automat de primă vizită cu reafișare controlată la vizita următoare. Nu se poate confirma livrarea push în fundal fără teste pe Android, iOS și desktop.

### 3.5. Pagină legacy pentru token GitHub
Arhiva conține `admin-legacy-token-github.html`. Pagina implementează un flux în care utilizatorul introduce un token GitHub în browser și codul îl folosește pentru apeluri directe către GitHub API.

Acest mecanism contravine regulii din Master Plan de a nu folosi token GitHub introdus în browser. CMS-ul nou din `Crm/admin.html` folosește Supabase Edge Function `github-repo-bridge`. Pagina legacy trebuie izolată și eliminată din calea publică numai după verificarea legăturilor și dependențelor; nu a fost modificată în acest audit.

### 3.6. Prețuri publice care necesită revizie
În conținutul blogului există valori istorice și exemple comerciale hardcodate. Un exemplu FAQ din `blog/etapele-montarii-acoperisului-tigla-metalica.html` menționează 950 lei/m² pentru acoperiș la cheie. Valoarea nu corespunde reperului actual din informațiile aprobate pentru VALMEX (de la 1.150 MDL/m²).

Acest lucru este semnalat pentru revizie editorială, nu modificat. Alte exemple de preț pentru țiglă, fațade și AMK necesită confirmarea actualității înainte de centralizare. Nu se schimbă automat nicio valoare.

## 4. Elemente existente care trebuie protejate

- `calculator-acoperis.html`
- `calculator-fatada.html`
- `calculator-amk.html`
- `Crm/calculator-live.html`
- formulele și regulile comerciale din calculatoare;
- `cms/content.json`;
- paginile publice și URL-urile indexabile;
- fluxul CMS securizat prin `github-repo-bridge`.

Codul calculatoarelor este prezent în arhivă. Funcționarea lor comercială nu a fost retestată interactiv în browser în acest audit.

## 5. Ce nu a putut fi confirmat

Nu au fost efectuate:
- autentificare reală în Supabase;
- interogări live pentru inspectarea schemei, RLS, RPC sau Edge Functions;
- teste de salvare/recuperare a datelor CRM;
- teste de trimitere și primire chat;
- teste reale de notificări OneSignal;
- teste vizuale responsive pe dispozitive;
- teste complete SEO, Lighthouse sau Core Web Vitals;
- testarea operațiilor CMS prin cont administrator;
- verificarea repository-ului GitHub sau a ramurii `cms-staging`.

Prin urmare, conexiunile Supabase, OneSignal și GitHub Bridge rămân **neverificate live**.

## 6. Ordinea recomandată după audit

1. Testarea în browser a paginilor publice și a calculatoarelor, fără modificarea formulelor.
2. Testarea autentificării CRM și a modulelor deja operaționale.
3. Verificarea backend-ului Supabase: tabele, coloane, RLS, RPC, Storage și Edge Functions.
4. Proiectarea catalogului central de prețuri și costuri pe schema existentă; fără tabele duplicate.
5. Implementarea administrării prețurilor și costurilor, cu separarea drepturilor și istoric.
6. Conectarea controlată a calculatoarelor la catalog, păstrând formulele.
7. Finalizarea modulelor CRM structurale.
8. Testarea integrării Chat/Inbox și OneSignal, inclusiv scenariile în fundal.
9. Revizia prețurilor publice și completarea activelor lipsă după confirmarea surselor.
10. Audit responsive, SEO și performanță; apoi testare integrală și arhivă de livrare.

## 7. Decizii necesare înainte de implementare

- Confirmarea valorilor comerciale din articolele publice care nu sunt acoperite de catalogul central.
- Confirmarea imaginilor originale lipsă.
- Aprobarea modului de tratare a paginii `admin-legacy-token-github.html`.
- Acces de test Supabase și conturi CRM cu roluri diferite pentru verificarea RLS și a fluxurilor.
- Stabilirea platformelor și browserelor țintă pentru testele OneSignal.

## 8. Registru de progres actualizat

| Activitate | Stare după audit static |
|---|---|
| Inventar ZIP | Efectuat |
| Verificare sintaxă JavaScript | Efectuat — fără erori detectate |
| Verificare referințe către imagini | Efectuată — 4 căi unice lipsă |
| Audit CRM structural | Efectuat preliminar |
| Audit static OneSignal | Efectuat preliminar |
| Audit static Chat/Inbox | Efectuat preliminar |
| Audit static prețuri publice | Efectuat preliminar |
| Teste browser | Neefectuate |
| Teste Supabase/RLS/RPC | Neefectuate |
| Teste OneSignal reale | Neefectuate |
| Teste CMS/GitHub Bridge | Neefectuate |
| Catalog central de prețuri | Neînceput |
| Implementare și corectări | Neîncepute |

**Concluzie:** arhiva are o bază tehnică extinsă și nu prezintă erori de sintaxă JavaScript în verificarea statică efectuată. Există însă module CRM structurale, integrări care nu au fost testate live, active lipsă și o pagină legacy cu flux de token GitHub în browser. Următorul pas este validarea funcțională și inspectarea backend-ului, nu reconstruirea proiectului și nu modificarea directă a codului.
