# VALMEX Unified Staging — instrucțiuni de verificare

## Important
Aceasta este o arhivă locală de staging. Nu a fost publicată în GitHub Pages și nu trebuie copiată peste `main` înainte de revizie și aprobare.

## Acces
1. Deschide local sau pe un server de test rădăcina arhivei.
2. Pentru administrare, accesează `/admin.html` sau `/Crm/index.html`.
3. Autentifică-te cu un cont VALMEX existent.
4. După autentificare se deschide `/Crm/dashboard.html`.
5. Conturile cu rol administrator pot accesa:
   - `Crm/admin.html` — CMS Website;
   - `Crm/angajati.html` — administrarea angajaților.
6. Celelalte module CRM sunt accesibile din Dashboard conform interfeței existente și politicilor Supabase.

## CMS Website
CMS-ul folosește sesiunea Supabase comună și Edge Function `github-repo-bridge`. În configurația de staging, operațiile CMS țintesc ramura `cms-staging`. Nu se introduce token GitHub în browser. Pentru testarea operațiilor de scriere este necesar ca Edge Function și drepturile contului să fie funcționale.

## Limitele acestui pachet
- Nu publica arhiva direct în producție.
- Nu modifica prețurile sau formulele Calculatorului LIVE în timpul reviziei.
- Nu considera un mesaj „salvat” drept dovadă că site-ul public a fost actualizat.
- Verifică manual conturi cu roluri diferite, RLS, Edge Function, încărcarea imaginilor, preview și restaurarea versiunilor.
- Activele originale care nu se găseau în arhiva sursă sunt enumerate în `README-UNIFIED-STAGING.md`.

## Structură
- `index.html` — website public V2.
- `Crm/` — autentificare și module CRM.
- `Crm/dashboard.html` — punct central de navigare.
- `Crm/admin.html` — CMS Website.
- `Crm/angajati.html` — administrare angajați.
- `cms/content.json` — date CMS publice; păstrate fără modificări în această etapă.
- `docs/` — master plan și promptul de implementare.
