# VALMEX — MASTER PLAN ȘI STRATEGIE DE LUCRU

**Document de referință pentru dezvoltarea VALMEX.md**  
**Versiune:** 1.0  
**Data:** 19 noiembrie 2026  
**Statut:** Plan aprobat pentru audit și implementare. Nu autorizează publicarea în producție.

## 1. Scop

Acest document păstrează cerințele, prioritățile, regulile tehnice și criteriile de verificare pentru următoarea versiune VALMEX. Se păstrează în repository și se actualizează după fiecare etapă.

Înainte de orice modificare, se verifică versiunea reală a codului și se compară cu acest plan.

## 2. Obiective aprobate

Sunt aprobate șase direcții:
1. Baza centrală de prețuri și costuri.
2. Finalizarea și conectarea modulelor CRM.
3. Chat, mesaje și notificări.
4. OneSignal și notificări web.
5. Redesign, logo și adaptare mobilă.
6. SEO și performanță.

## 3. Reguli obligatorii

1. Nu reconstruim proiectul de la zero; continuăm pe arhitectura existentă.
2. Nu modificăm funcționalități confirmate ca funcționale fără cerință explicită.
3. Calculatoarele acoperiș, fațadă și AMK sunt confirmate de utilizator ca funcționale. Păstrăm formulele și logica lor.
4. Nu schimbăm prețuri, formule, condiții comerciale sau reguli de calcul fără instrucțiuni explicite.
5. Nu scriem și nu publicăm direct în GitHub. Lucrăm pe copia locală furnizată de utilizator.
6. Nu publicăm în producție fără aprobare explicită.
7. Nu eliminăm funcții sau fișiere fără verificarea dependențelor și documentarea motivului.
8. Nu introducem parole, tokenuri, chei API private sau alte secrete în cod public, repository ori arhiva de livrare.
9. Nu folosim token GitHub introdus în browser.
10. Modificările bazei de date, RLS, RPC și Edge Functions se fac după inspectarea structurii existente și aprobarea schimbărilor cu impact.
11. Nu declarăm o funcție testată fără test efectiv și rezultat verificabil.
12. Păstrăm compatibilitatea cu datele și ofertele existente.
13. Actualizăm acest document și registrul de progres după fiecare etapă.
14. Dacă o cerință este ambiguă sau există risc de pierdere a datelor, ne oprim și cerem clarificări.

## 4. Arhitectură și sursa datelor

- **GitHub:** versionarea codului.
- **Supabase:** bază de date, autentificare, politici de acces și funcții backend.
- **OneSignal:** abonamente și notificări web, în limitele suportului browserelor.
- **CRM:** interfața administrativă pentru clienți, proiecte, oferte, prețuri, costuri și activități.
- **Site și calculatoare:** consumă datele permise din backend.

Aceste conexiuni nu se consideră funcționale până nu sunt verificate.

## 5. Baza centrală de prețuri și costuri

### 5.1. Principiu

CRM administrează un catalog central în Supabase. După salvare, noua valoare trebuie să fie disponibilă imediat tuturor paginilor, calculatoarelor și modulelor conectate.

### 5.2. Categorii

**Prețuri de vânzare:**
- Acoperiș la cheie și servicii de acoperiș.
- Țiglă metalică și alte materiale.
- Accesorii și sisteme pluviale.
- Fațade.
- AMK.
- Alte servicii și produse aprobate.

**Costuri interne:**
- Lemn și materiale.
- Manoperă.
- Comisioane Microinvest.
- Transport.
- Alte cheltuieli de proiect.

Prețurile de vânzare și costurile interne trebuie separate logic și prin drepturi de acces. Costurile interne nu se expun pe paginile publice sau în documentele pentru clienți.

### 5.3. Câmpuri recomandate

- Cod unic și stabil.
- Denumire și categorie.
- Valoare numerică.
- Monedă și unitate de măsură.
- Tip: preț de vânzare sau cost intern.
- Status activ/inactiv.
- Data modificării și utilizatorul care a modificat.

Schema exactă se stabilește după inspectarea bazei Supabase existente. Nu se creează tabele duplicate fără verificare.

### 5.4. Actualizare și istoric

- Salvarea în CRM actualizează sursa centrală.
- Toate modulele conectate citesc noua valoare.
- Erorile de conexiune nu trebuie să producă prețuri zero sau calcule incorecte.
- Istoricul păstrează valoarea veche, valoarea nouă, autorul și momentul modificării.
- Trebuie să existe o metodă controlată de restabilire a unei valori anterioare.
- Modificarea este permisă doar rolurilor autorizate.

### 5.5. Oferte istorice

O ofertă emisă păstrează un instantaneu al prețurilor, costurilor relevante și condițiilor folosite în momentul emiterii. Modificările ulterioare din catalog nu rescriu ofertele istorice. Ofertele noi folosesc valorile centrale actuale.

### 5.6. Module conectate

- Calculator acoperiș.
- Calculator fațadă.
- Calculator AMK.
- Calculator LIVE.
- Oferte CRM.
- Pagini publice care afișează prețuri.
- Rapoarte interne de cost și profit.

Conectarea prețurilor nu autorizează modificarea formulelor calculatoarelor. Formula și prețul sunt tratate separat.

## 6. CRM — finalizare și integrare

### 6.1. Module de auditat

| Modul | Rezultat urmărit |
|---|---|
| Dashboard | Indicatori bazați pe date reale |
| Clienți | Creare, editare, căutare și istoric |
| Proiecte | Legătura cu clientul și lucrarea |
| Oferte | Creare, salvare, versiuni și PDF |
| Angajați | Conturi și roluri |
| Sarcini | Responsabili, termene și statusuri |
| Documente | Oferte, contracte și fișiere |
| Materiale | Catalog, consum și costuri |
| Achiziții | Furnizori, comenzi și cheltuieli |
| Finanțe | Încasări, costuri și profit |
| Inbox | Mesaje și conversații |
| Setări | Configurări și permisiuni |

### 6.2. Legături obligatorii

- Fiecare client are un identificator unic.
- Proiectele sunt asociate clientului.
- Ofertele sunt asociate clientului și proiectului.
- Plățile sunt asociate proiectului sau documentului relevant.
- Documentele sunt asociate clientului/proiectului.
- Mesajele sunt asociate clientului când identitatea poate fi stabilită sigur.
- Dashboard-ul citește date reale din module.

### 6.3. Clasificarea stării

Fiecare modul se marchează:
- Funcțional și testat.
- Parțial funcțional.
- Structural / doar interfață.
- Neimplementat.
- Neverificat.

Nu se prezintă o interfață ca funcționalitate completă fără testarea operațiunilor și a persistenței datelor.

### 6.4. Securitate

Permisiunile vizuale nu sunt suficiente. Accesul trebuie impus și în Supabase prin RLS, funcții backend și verificări de rol. Se verifică accesul între conturi și clienți diferiți.

## 7. Chat, mesaje și notificări

### Pentru client
- Fereastră adaptată telefonului, tabletei și desktopului.
- Indicator de mesaje necitite.
- Notificare sonoră configurabilă, în condițiile permise de browser.
- Istoric conversație și confirmarea trimiterii.
- Păstrarea conversației la revenire.
- Notificare la răspuns, dacă există permisiune și canal suportat.

### Pentru administrator
- Inbox central în CRM.
- Indicator pentru mesaje necitite.
- Notificare la mesaj nou.
- Identificarea clientului, când este posibil.
- Statusuri pentru conversații.
- Răspuns direct din CRM.
- Istoric complet.

### Verificări
- API și Edge Function.
- Salvarea mesajelor.
- Asocierea corectă a sesiunii și destinatarului.
- RLS și acces la conversații.
- Actualizare în timp real sau polling sigur.
- Comportament când fereastra este închisă.
- Erori și reconectare.

Nu se garantează notificări în fundal până când mecanismul nu este implementat și testat pe platformele țintă.

## 8. OneSignal și notificări web

### Comportament solicitat
- La prima vizită se poate afișa solicitarea de abonare.
- Dacă utilizatorul închide solicitarea fără abonare, se încearcă din nou la următoarea vizită.
- Dacă abonarea reușește, solicitarea nu se mai repetă.
- Dacă permisiunea browserului este refuzată, se respectă alegerea browserului; nu se ocolește.
- Utilizatorilor deja abonați nu li se afișează solicitarea din nou.

### Verificări și funcții
- Configurarea aplicației OneSignal.
- SDK și Service Worker.
- Domeniu și permisiuni.
- Identificarea abonamentelor.
- Legătura cu utilizatorii CRM, dacă este justificată și sigură.
- Notificări pentru chat și activități CRM.
- Tratarea abonamentelor expirate și a erorilor.
- Teste Android, iOS și desktop, în limitele browserelor suportate.

## 9. Redesign și adaptare

### Logo și identitate
- Un singur logo și un singur set de reguli vizuale.
- Referință: logo-ul din calculatorul de acoperiș, după verificarea fișierului sursă.
- Același aspect în site, CRM și calculatoare.
- Logo-ul deschide pagina principală VALMEX.
- Contrast, dimensiune și spațiere corecte.

### Meniu și navigare
- Dropdown-uri utilizabile cu mouse, touchscreen și tastatură.
- Pe tabletă, meniurile nu trebuie să se închidă accidental la deplasarea cursorului.
- Deschidere/închidere controlată.
- Închidere la selectarea destinației sau click în exterior, după caz.
- Verificarea tuturor meniurilor.

### Interfață
- Header și footer coerente.
- Butoane și câmpuri standardizate.
- Bannere și imagini corect dimensionate.
- Chat și butoane flotante fără suprapuneri.
- Layout adaptat telefonului, tabletei și desktopului.

### Dispozitive
- Android.
- iPhone.
- Tabletă touchscreen.
- Tabletă cu mouse.
- Desktop și rezoluții diferite.

## 10. SEO și performanță

### SEO tehnic
- Title și meta description.
- H1–H3.
- Canonical.
- Sitemap XML și robots.txt.
- Linkuri interne.
- Pagini 404 și redirecționări.
- Schema.org și date structurate.
- Erori Google Search Console, inclusiv Merchant Listings dacă sunt relevante.
- Paginile indexate și URL-urile existente.

### Imagini și performanță
- ALT pentru imaginile relevante.
- Optimizarea dimensiunilor și formatelor.
- Lazy loading unde este potrivit.
- Eliminarea scripturilor redundante numai după verificarea dependențelor.
- Verificarea CSS/JS.
- Core Web Vitals.
- Încărcarea calculatoarelor și a chatului.

Nu se șterg pagini indexate și nu se schimbă URL-uri fără analiză și redirecționări corespunzătoare.

## 11. Audit inițial — înainte de modificări

După primirea ZIP-ului:
1. Inventarierea fișierelor și directoarelor.
2. Identificarea paginilor publice și modulelor CRM.
3. Identificarea calculatoarelor și scripturilor comune.
4. Căutarea prețurilor hardcodate și a utilizărilor lor.
5. Inventarierea formulelor și regulilor existente.
6. Inspectarea conexiunilor Supabase, OneSignal și GitHub Bridge.
7. Verificarea fișierelor de configurare fără expunerea secretelor.
8. Inventarierea tabelelor, politicilor și funcțiilor backend, în măsura în care accesul permite.
9. Verificarea linkurilor, resurselor lipsă și erorilor JavaScript.
10. Verificarea adaptării telefon/tabletă/desktop.
11. Verificarea SEO și performanței.
12. Compararea rezultatelor cu acest plan.

### Livrabil după audit
Raportul va separa:
- Probleme confirmate.
- Probleme posibile care necesită test suplimentar.
- Funcții deja implementate.
- Funcții parțial implementate.
- Funcții lipsă.
- Riscuri și dependențe.
- Ordinea recomandată de remediere.

Nu începe implementarea până când raportul și riscurile majore nu sunt clare.

## 12. Ordinea implementării

| Etapă | Activitate | Prioritate |
|---:|---|---|
| 1 | Audit complet și inventar ZIP | Critică |
| 2 | Proiectarea catalogului central | Critică |
| 3 | CRM — administrare prețuri și costuri | Critică |
| 4 | Conectarea paginilor și calculatoarelor | Critică |
| 5 | Integrarea modulelor CRM | Ridicată |
| 6 | Chat și Inbox | Ridicată |
| 7 | OneSignal și notificări | Ridicată |
| 8 | Redesign și adaptare | Ridicată |
| 9 | SEO și performanță | Ridicată |
| 10 | Testare integrală și corectări | Critică |
| 11 | Documentație și arhivă ZIP | Finală |

Ordinea poate fi ajustată numai dacă auditul identifică o dependență tehnică sau un risc. Schimbarea se notează în document.

## 13. Criterii de acceptare

| Funcționalitate | Criteriu |
|---|---|
| Preț central | Modificarea se reflectă în toate modulele conectate |
| Cost intern | Nu este accesibil publicului sau rolurilor neautorizate |
| Istoric prețuri | Se păstrează autor, dată și valori vechi/noi |
| Ofertă emisă | Păstrează snapshot-ul inițial |
| Calculatoare | Formulele aprobate rămân neschimbate |
| CRM | Datele se salvează și se recuperează corect |
| Chat | Mesajul ajunge la conversația corectă |
| Notificări | Sunt livrate abonatului/destinatarului corect |
| Design | Meniurile și componentele funcționează pe dispozitivele țintă |
| SEO | URL-urile și indexarea existentă sunt protejate |
| Livrare | Arhiva se deschide și este însoțită de raport |

## 14. Protocol de livrare și publicare

1. Se livrează arhiva ZIP completă.
2. Se livrează raportul fișierelor modificate.
3. Se enumeră funcțiile implementate și testate.
4. Se enumeră funcțiile implementate, dar neverificate.
5. Se enumeră lucrurile rămase și motivele.
6. Se precizează modificările de schemă sau configurare backend necesare.
7. Se actualizează acest document.
8. Utilizatorul face revizia.
9. Publicarea în GitHub/producție se face numai după aprobarea explicită.

## 15. Registru de progres

Actualizează acest tabel la fiecare etapă. Nu marca o activitate ca finalizată doar pentru că există cod sau interfață.

| Activitate | Stare inițială |
|---|---|
| Audit ZIP | Neînceput |
| Catalog central prețuri | Planificat |
| Catalog costuri interne | Planificat |
| Istoric și snapshot oferte | Planificat |
| Conectare calculatoare | Planificat |
| Integrare CRM | Planificat |
| Chat și Inbox | Planificat |
| OneSignal | Planificat |
| Redesign și adaptare | Planificat |
| SEO și performanță | Planificat |
| Testare finală | Neînceput |
| Arhivă ZIP și raport | Neînceput |

**Ultima actualizare:** 19 noiembrie 2026  
**Următorul pas:** primirea ZIP-ului actual și efectuarea auditului inițial.

## 16. Instrucțiune pentru fiecare sesiune de dezvoltare

1. Citește acest document integral.
2. Verifică starea reală a repository-ului sau arhivei furnizate.
3. Verifică progresul și deciziile documentate.
4. Nu presupune că o funcție este implementată doar pentru că este descrisă aici.
5. Continuă de la ultima etapă verificată.
6. Actualizează Master Plan-ul după orice schimbare aprobată.
7. Nu publica și nu scrie în GitHub fără autorizare explicită.

**Principiu:** păstrăm ceea ce funcționează, reparăm ceea ce este demonstrat ca defect, conectăm datele într-o arhitectură comună și verificăm înainte de livrare.
