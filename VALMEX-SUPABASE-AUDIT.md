# VALMEX — Audit Supabase (read-only)
**Data verificării:** 19 noiembrie 2026  
**Proiect:** `Valmex.md/angajati`  
**Project ref:** `qejnbbzhpvfjeqzwotwt`  
**Regiune:** `eu-west-1`  
**PostgreSQL:** `17.11.0.019`  
**Status proiect:** `ACTIVE_HEALTHY`  
**Mod de lucru:** audit read-only. Nu s-au efectuat modificări în baza de date, Storage, Edge Functions sau setările proiectului.

## 1. Rezumat

| Element | Rezultat |
|---|---:|
| Tabele în schema `public` | 33 |
| Tabele cu RLS activ | 33 din 33 |
| Politici RLS în `public` | 92 |
| View-uri | 3 |
| View-uri cu `security_invoker=true` | 3 din 3 |
| Funcții în `public` | 12 |
| Funcții `SECURITY DEFINER` | 11 |
| Funcții `SECURITY DEFINER` executabile de `anon` | 0 |
| Funcții `SECURITY DEFINER` executabile de `authenticated` | 8 |
| Edge Functions active | 4 |
| Bucket-uri Storage | 2, ambele private |
| Migrații înregistrate | 9 |
| Tabele publice cu grant direct către `anon` | 0 |

Toate cele 33 de tabele publice au RLS activ. Nu au fost identificate tabele publice fără RLS. Cele trei view-uri au `security_invoker=true`, ceea ce păstrează aplicarea drepturilor utilizatorului care interoghează view-ul.

## 2. Tabele și date existente

Tabelele existente acoperă:
- utilizatori și roluri: `profiles`;
- CRM: `clients`, `projects`, `activities`, `tasks`, `client_reminders`;
- măsurători și oferte: `measurements`, `quotations`, `quotation_items`;
- contracte și bani: `contracts`, `contract_documents`, `payments`;
- materiale și lucrări: `material_catalog`, `project_materials`, `warranties`, `interventions`;
- documente și fotografii: `documents`, `project_photos`;
- pontaj: `work_sessions`, `work_session_pauses`, `work_session_corrections`, `work_session_activity`;
- chat: `chat_conversations`, `chat_messages`, `chat_assignment_history`, `chat_attachments`, `chat_status_events`, `chat_quick_replies`, `chat_ratings`, `chat_rate_limits`, `chat_ai_reports`, `chat_action_items`, `chat_control_events`.

Există deja date în CRM și chat. Numerele de rânduri estimate de inventarul Supabase includ, de exemplu, 9 clienți, 9 proiecte, 8 oferte, 22 poziții de ofertă, 2 conversații și 7 mesaje. Nu au fost extrase date personale ale clienților sau angajaților.

## 3. Baza centrală de prețuri și costuri

**Concluzie: catalogul central nu este încă implementat în forma cerută de Master Plan.**

Tabelul existent `material_catalog` este gol și are câmpuri descriptive pentru material:
- denumire, categorie, producător, model;
- grosime, culoare și cod culoare;
- unitate, furnizor, descriere;
- status activ și date de audit.

Nu conține câmpuri distincte pentru preț de vânzare și cost intern.

În alte module există valori financiare locale:
- `quotation_items.unit_price`;
- `project_materials.planned_unit_price`;
- `project_materials.actual_unit_price`;
- `payments.amount`;
- `contracts.advance_amount`.

Aceste câmpuri nu înlocuiesc un catalog central. Înainte de proiectare trebuie stabilit cum vor fi separate prețurile publice, prețurile comerciale și costurile interne, fără a altera ofertele istorice.

## 4. Politici RLS și securitate

### Confirmări pozitive
- RLS este activ pe toate cele 33 de tabele publice.
- Sunt definite 92 de politici RLS în schema `public`.
- Nu există granturi directe către rolul `anon` pentru tabelele publice.
- Cele 3 view-uri au `security_invoker=true`.
- Bucket-urile Storage sunt private.
- Funcțiile `SECURITY DEFINER` nu sunt executabile de rolul `anon`.

### Funcții SECURITY DEFINER
Există 11 funcții `SECURITY DEFINER`; 8 sunt executabile de rolul `authenticated`. Advisor-ul Supabase le semnalează ca avertisment. Inspecția definițiilor a confirmat verificări explicite de autentificare și/sau proprietate/rol pentru funcțiile inspectate, inclusiv:
- `current_user_role`;
- `classify_activity_event`;
- `start_work_session`;
- `pause_work_session`;
- `resume_work_session`;
- `end_work_session`;
- `review_work_session_correction`;
- `valmex_live_save_offer`.

Acest lucru nu echivalează cu un test RLS adversarial. Trebuie testate separat apelurile cu utilizatori de roluri diferite și ID-uri care aparțin altor utilizatori.

Funcția `valmex_insert_ai_reply` are `EXECUTE` dezactivat pentru `anon` și `authenticated`; este separată de funcțiile RPC apelabile de utilizatorii autentificați.

Tabelul `chat_rate_limits` are RLS activ și nu are politici. Acesta pare destinat accesului exclusiv prin backend/service role; nu trebuie adăugate politici client fără analiză.

### Avertismente Security Advisor
1. `authenticated_security_definer_function_executable`: 8 funcții `SECURITY DEFINER` pot fi apelate de utilizatori autentificați. Necesită verificarea scopului și teste de autorizare; nu se revocă automat, deoarece unele sunt folosite de aplicație.
2. `auth_leaked_password_protection`: protecția pentru parole compromise este dezactivată în Supabase Auth. Recomandare: activare după verificarea impactului asupra autentificării.

## 5. Storage

Bucket-uri:
- `valmex-chat` — privat, limită 10 MB, tipuri permise: JPEG, PNG, WebP, PDF și text simplu.
- `valmex-clienti` — privat, fără limită de dimensiune sau listă MIME configurată la nivel de bucket.

Există politici Storage pentru accesul angajaților activi și pentru ștergerea fișierelor din bucket-ul clienților de către administrator. Trebuie verificat dacă lipsa limitei MIME/dimensiune la `valmex-clienti` este intenționată și dacă aplicația validează fișierele înainte de upload.

## 6. Edge Functions

| Funcție | Status | Versiune | `verify_jwt` |
|---|---|---:|---|
| `valmex-reminder-push` | ACTIVE | 6 | false |
| `valmex-chat-api` | ACTIVE | 8 | false |
| `admin-manage-employees` | ACTIVE | 14 | false |
| `github-repo-bridge` | ACTIVE | 6 | true |

Inspecția codului:
- `valmex-reminder-push` verifică un secret dedicat în header (`x-valmex-cron-secret`) înainte de a procesa mementouri și a apela OneSignal.
- `valmex-chat-api` implementează autentificare separată pentru angajați prin verificarea tokenului cu `auth.getUser`; vizitatorii folosesc token de sesiune de chat. CORS este limitat la domeniile VALMEX.
- `admin-manage-employees` verifică tokenul utilizatorului și rolul `administrator` plus statusul activ înainte de operații administrative.
- `github-repo-bridge` are `verify_jwt=true` și verifică suplimentar rolul administratorului înainte de a folosi secretul GitHub.

Trei funcții au `verify_jwt=false`, dar codul lor implementează verificări proprii. Acest model trebuie testat cu cereri fără token, token invalid, utilizator inactiv și utilizator fără rolul necesar. Nu s-au apelat endpoint-urile în producție în acest audit.

## 7. Migrații

Sunt înregistrate 9 migrații:
- `harden_security_definer_function_grants`
- `create_valmex_live_reminders`
- `enable_cron_and_net_for_valmex_reminders`
- `create_valmex_chat_core`
- `enable_valmex_chat_realtime_and_storage`
- `add_valmex_chat_rate_limits`
- `add_chat_ai_handoff_and_reports`
- `atomic_valmex_ai_reply_guard`
- `lock_valmex_ai_reply_mode_guard`

Migrațiile arată că infrastructura de mementouri, chat, rate limiting și handoff AI a fost deja adăugată. Nu a fost identificată o migrare pentru catalogul central de prețuri și costuri.

## 8. Performance Advisor

Avertismente raportate:
- 49 de chei străine fără index de acoperire;
- 6 politici RLS care reevaluează funcții Auth per rând;
- 38 de indexuri marcate ca neutilizate;
- 3 cazuri cu politici permissive multiple pentru aceeași acțiune/rol.

Acestea sunt constatări de optimizare, nu instrucțiuni de ștergere. Nu se elimină indexuri fără analizarea interogărilor reale și a utilizării lor. Politicile RLS nu se rescriu fără teste de acces și regresie.

Health Advisor nu a returnat avertismente.

## 9. Ce nu a fost încă verificat

- Teste reale de acces cu conturi de roluri diferite și scenarii negative RLS.
- Teste CRUD complete din CRM.
- Testarea endpoint-urilor Edge Function cu tokenuri valide/invalide.
- Livrarea reală OneSignal și asocierea abonamentelor cu `external_id`.
- Configurația completă a secretelor Edge Functions (valorile nu au fost citite sau afișate).
- Testarea efectivă a upload/download în Storage.
- Testarea realtime pentru chat.
- Compatibilitatea exactă dintre toate scripturile din ZIP și schema live Supabase.

## 10. Ordinea recomandată

1. Teste controlate RLS și roluri, fără modificări de politică.
2. Verificarea funcțiilor RPC `valmex_live_save_offer` și a fluxurilor de oferte.
3. Testarea Edge Functions pentru chat, angajați și mementouri.
4. Verificarea Storage și a politicilor de acces la fișiere.
5. Proiectarea catalogului central de prețuri/costuri pe schema existentă.
6. Aprobarea explicită a oricărei schimbări de schemă, politici sau funcții.
7. Implementare într-o etapă separată, cu verificare după fiecare schimbare.

## 11. Statut

**Audit Supabase read-only: efectuat la nivel de inventar și inspecție statică.**  
**Implementarea catalogului central: neîncepută.**  
**Modificări în Supabase: zero.**

Principiu: păstrăm tabelele, datele și funcțiile existente; nu creăm tabele duplicate și nu modificăm politicile sau funcțiile înainte de teste și aprobare.

## 12. Test RLS controlat — rezultate

Au fost efectuate două simulări de sesiune într-o tranzacție `READ ONLY`, folosind rolul PostgreSQL `authenticated` și identitatea internă a unui profil activ. Tranzacțiile au fost închise cu `ROLLBACK`; nu s-au modificat date.

| Profil simulat | Clienți vizibili | Proiecte vizibile | Oferte vizibile | Conversații chat vizibile |
|---|---:|---:|---:|---:|
| employee activ | 9 | 9 | 8 | 2 |
| administrator activ | 9 | 9 | 8 | 2 |

Rezultatul corespunde politicilor curente: angajații activi și administratorul pot consulta aceste seturi de date. Acest test verifică vizibilitatea la nivel de rol, dar nu confirmă încă toate operațiile INSERT/UPDATE/DELETE sau izolarea fiecărui obiect asociat unui utilizator.

Tabelul `chat_rate_limits` a respins interogarea pentru rolul `authenticated` cu `permission denied`. Tabelul nu are grant SELECT pentru acest rol și nu are politici RLS; accesul este astfel blocat pentru clientul CRM și rămâne destinat backend-ului. Acest comportament este compatibil cu utilizarea sa de către Edge Function, dar trebuie păstrat intenționat.

**Actualizare statut:** test RLS de citire pentru două roluri — efectuat; teste negative și CRUD — neefectuate.
