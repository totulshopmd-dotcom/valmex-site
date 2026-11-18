# PROMPT PRINCIPAL DE IMPLEMENTARE --- VALMEX

Lucrezi la proiectul VALMEX Business Management System și Website CMS.

## 1. Documente obligatorii

Înainte de orice analiză sau modificare: 1. Deschide și citește integral
`VALMEX-MASTER-PLAN.md`. 2. Citește acest prompt. 3. Verifică dacă
există versiuni mai noi ale acestor documente în repository. 4. Dacă
documentul lipsește sau este contradictoriu, oprește modificările și
raportează situația.

MASTER PLAN este referința arhitecturală. Nu inventa decizii și nu
ignora deciziile aprobate.

## 2. Regula de bază

Nu începe prin a scrie cod. Începe prin auditarea stării reale a
proiectului și a componentelor care vor fi afectate.

Nu reconstrui proiectul de la zero. Nu elimina funcții existente doar
pentru a simplifica implementarea. Nu modifica tarife, formule
comerciale sau calcule fără aprobare explicită.

## 3. Audit obligatoriu

Pentru fiecare sarcină, verifică doar domeniile relevante, dar suficient
de profund:

### GitHub

-   repository și branch active;
-   fișierele reale și conținutul lor;
-   importuri, linkuri, rute și referințe;
-   workflow-uri și metoda de publicare;
-   diferențele dintre staging și producție.

### Supabase

-   tabele, coloane, relații, constrângeri și indexuri;
-   RLS și toate politicile relevante;
-   funcții SQL/RPC și granturile lor;
-   triggers, views, cron și Edge Functions;
-   Storage buckets și policies;
-   Realtime publications și acces;
-   dependențe și impactul migrațiilor.

### Integrări

-   OneSignal SDK, service worker, identitate, abonamente și livrare;
-   GitHub API și metoda de scriere;
-   orice serviciu extern implicat în sarcină.

Nu presupune că o constatare veche este încă valabilă. Reverifică starea
actuală.

## 4. Clasificarea constatărilor

Folosește explicit: - VERIFICAT --- confirmat prin
cod/configurație/test; - NEVERIFICAT --- nu există suficiente dovezi; -
PROPUS --- idee de arhitectură; - IMPLEMENTAT --- cod prezent, dar încă
netestat; - TESTAT --- testele au trecut; - PUBLICAT --- disponibil în
producție și verificat; - BLOCAT --- există o dependență sau problemă.

Nu prezenta o propunere ca funcție existentă. Nu prezenta codul existent
ca funcție funcțională fără test.

## 5. Plan înainte de implementare

După audit: 1. descrie situația existentă; 2. identifică fișierele și
serviciile care trebuie schimbate; 3. explică impactul asupra modulelor
dependente; 4. propune cea mai mică modificare sigură; 5. descrie
riscurile și planul de rollback; 6. solicită confirmare înainte de
schimbări distructive, migrații cu risc, ștergeri sau modificări de
securitate cu impact larg.

Pentru modificări mici, reversibile și clar cerute, poți continua după
ce prezinți pe scurt constatările și planul.

## 6. Standarde de implementare

-   module UI independente, dar integrate în platforma comună;
-   servicii reutilizabile pentru autentificare, permisiuni, notificări,
    audit și fișiere;
-   o singură sursă de adevăr pentru fiecare entitate;
-   identificatori generați atomic în backend;
-   validare server-side;
-   tranzacții pentru operațiuni compuse;
-   idempotency și tratarea conflictelor;
-   paginare pentru liste;
-   erori explicite și loguri fără secrete;
-   design responsive;
-   accesibilitate și performanță rezonabilă.

Nu introduce duplicări de date sau logici diferite pentru aceeași
operațiune în module separate.

## 7. Securitate

-   Nu pune service role key, GitHub token sau OneSignal REST API key în
    frontend.
-   Nu folosi localStorage pentru secrete.
-   RLS trebuie să protejeze datele indiferent de interfață.
-   Verifică drepturile în RPC/Edge Functions pentru acțiunile
    sensibile.
-   Separă datele publice de cele private.
-   Nu presupune că ascunderea unui buton este autorizare.
-   Testează accesul cu utilizatori din roluri diferite.
-   Protejează documentele, costurile, marjele, conversațiile și
    profilurile.
-   Pentru uploaduri verifică tipul, dimensiunea, permisiunea și calea.
-   Nu șterge fișiere sau înregistrări înainte de verificarea
    referințelor și a backupului.

## 8. Reguli pentru CMS Website

CMS-ul face parte din sistemul central. Fluxul standard: editare →
validare → salvare versiune de lucru → preview → aprobare → publicare →
verificare live. Publicarea trebuie să fie controlată și auditabilă. Nu
permite token personal GitHub în browser ca soluție permanentă. Nu
suprascrie conținut concurent fără detectarea conflictului. Păstrează
istoric și rollback.

## 9. Reguli pentru Chat VALMEX

Chatul este modul CRM: - conversații și mesaje stocate securizat; -
operatori cu profil și fotografie; - atribuire și transfer; - note
interne separate de mesajele clientului; - legături către client și
proiect; - stări și istoric; - fișiere private; - realtime autorizat; -
notificări și protecție anti-spam. Canalele externe sunt viitoare până
când conectarea lor este verificată.

## 10. Testare obligatorie

Testează: - fluxul normal; - câmpuri invalide și erori; - utilizatori
fără permisiuni; - acces direct la API/RPC; - scenarii concurente; -
conexiune întreruptă și reluare; - afișare desktop și mobil; - regresii
în modulele dependente; - confirmarea rezultatului în baza de date și,
când este cazul, în site-ul public.

Nu declara „gata" dacă testele nu au fost efectuate. Menționează
explicit testele imposibil de realizat.

## 11. Raport la finalul fiecărei sarcini

Răspunde cu: 1. **Obiectiv** 2. **Ce am verificat** 3. **Ce am
modificat** --- fișiere, tabele, funcții, politici 4. **Ce am păstrat**
5. **Teste și rezultate** 6. **Securitate și riscuri** 7. **Publicare**
--- nepublicat / publicat și dovada 8. **Ce urmează** 9. **Actualizarea
MASTER PLAN** --- status și jurnal

Nu afirma că ai făcut commit, deploy, migrare sau publicare fără
confirmarea instrumentului.

## 12. Cerința pentru fiecare sesiune

Execută numai sarcina cerută. Dacă observi o problemă în afara scopului,
documenteaz-o și propune o etapă separată; nu extinde unilateral
modificarea.

**Obiectiv final:** un sistem VALMEX complet, modular, sigur, extensibil
și coerent, cu CRM, chat, CMS website, angajați, operațiuni, financiar
și notificări conectate la aceeași infrastructură și bază de date
comună.
