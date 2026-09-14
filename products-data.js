/* =====================================================================
   VALMEX.MD — BAZA DE DATE PRODUSE
   =====================================================================
   Aici adaugi, ștergi sau modifici produsele care apar în magazin
   (produse.html). NU trebuie să știi programare — doar copiază un
   bloc { ... } întreg, lipește-l înainte de "];" de la finalul
   fișierului, și schimbează valorile.

   CÂMPURI:
   id            - un cod unic, fără spații (ex: "tigla-dakia")
   category      - una din: "Acoperișuri", "Fațade", "AMK", "Pavaj"
                   (poți adăuga o categorie nouă, apare automat în filtre)
   title         - numele produsului
   price         - un NUMĂR (fără text), sau null dacă nu ai preț fix
   unit          - unitatea de preț, ex: "lei/m²", "lei/buc"
   badge         - text scurt pe imagine, ex: "NOU", "-10%" (opțional, șterge linia dacă nu vrei)
   image         - link către imagine (poza produsului)
   shortDescription - 1-2 propoziții, apar pe cardul din grilă
   description   - descriere completă, apare când se deschide produsul
   specs         - listă de caracteristici tehnice { label, value }
   ===================================================================== */

const PRODUCTS = [

  // ---------------- ACOPERIȘURI (Țiglă Metalică) ----------------
  {
    id: "tigla-dakia",
    category: "Acoperișuri",
    title: "Țiglă Metalică Dakia",
    price: 136,
    unit: "lei/m²",
    badge: "Popular",
    image: "https://krovli.lider.md/sites/default/files/2025-10/Dakia_7024_0.png",
    shortDescription: "Profil modern și rezistență ridicată. Cea mai populară alegere pentru acoperișuri în Moldova.",
    description: "Țiglă metalică premium cu profil modern și rezistență ridicată la intemperii, radiații UV și variații de temperatură. Cea mai populară alegere pentru acoperișuri în Moldova, datorită raportului excelent între aspect, durabilitate și preț. Montaj rapid, întreținere minimă.",
    specs: [
      { label: "Grosime oțel", value: "0.45 mm" },
      { label: "Strat de protecție", value: "Poliester mat" },
      { label: "Lățime utilă", value: "1.19 m" },
      { label: "Garanție", value: "15 ani" },
      { label: "Culori disponibile", value: "La cerere" }
    ]
  },
  {
    id: "tigla-melano",
    category: "Acoperișuri",
    title: "Țiglă Metalică Melano",
    price: 136,
    unit: "lei/m²",
    image: "https://krovli.lider.md/sites/default/files/2025-10/Melano_7024.png",
    shortDescription: "Design elegant pentru proiecte moderne și premium. Finisaj impecabil.",
    description: "Design elegant, potrivit pentru proiecte moderne și premium. Finisaj impecabil și durabilitate superioară, cu un profil care pune în valoare arhitectura casei. Rezistentă la coroziune și la condiții climatice dure.",
    specs: [
      { label: "Grosime oțel", value: "0.45 mm" },
      { label: "Strat de protecție", value: "Poliester mat" },
      { label: "Lățime utilă", value: "1.19 m" },
      { label: "Garanție", value: "15 ani" }
    ]
  },
  {
    id: "tigla-lider",
    category: "Acoperișuri",
    title: "Țiglă Metalică Lider",
    price: 136,
    unit: "lei/m²",
    image: "https://krovli.lider.md/sites/default/files/2025-10/Lider_7024_0.png",
    shortDescription: "Raport excelent preț-calitate. Ideal pentru bugete optimizate fără compromisuri.",
    description: "Raport excelent între preț, calitate și durabilitate. Ideal pentru bugete optimizate, fără compromisuri la rezistență sau aspect. O alegere sigură pentru orice tip de construcție.",
    specs: [
      { label: "Grosime oțel", value: "0.45 mm" },
      { label: "Strat de protecție", value: "Poliester mat" },
      { label: "Lățime utilă", value: "1.19 m" },
      { label: "Garanție", value: "15 ani" }
    ]
  },
  {
    id: "tigla-kvadro",
    category: "Acoperișuri",
    title: "Țiglă Metalică Kvadro",
    price: 136,
    unit: "lei/m²",
    badge: "NOU",
    image: "https://krovli.lider.md/sites/default/files/2026-06/Kvadro_7024.png",
    shortDescription: "Relief puternic, design modern. Construit pentru rezistență maximă.",
    description: "Relief puternic și design modern. Construită pentru rezistență maximă în timp și în condiții climatice extreme. Cel mai nou model din gama noastră, recomandat pentru proiecte contemporane.",
    specs: [
      { label: "Grosime oțel", value: "0.45 mm" },
      { label: "Strat de protecție", value: "Poliester mat" },
      { label: "Lățime utilă", value: "1.19 m" },
      { label: "Garanție", value: "15 ani" }
    ]
  },
  {
    id: "tigla-florentia",
    category: "Acoperișuri",
    title: "Țiglă Metalică Florenția",
    price: 136,
    unit: "lei/m²",
    image: "https://krovli.lider.md/sites/default/files/2025-10/Florentia_7024_0.png",
    shortDescription: "Eleganță clasică cu profil premium bine conturat.",
    description: "Eleganță clasică, cu un profil premium bine conturat. Aspect rafinat, potrivit pentru case deosebite care pun accent pe stil și tradiție arhitecturală.",
    specs: [
      { label: "Grosime oțel", value: "0.45 mm" },
      { label: "Strat de protecție", value: "Poliester mat" },
      { label: "Lățime utilă", value: "1.19 m" },
      { label: "Garanție", value: "15 ani" }
    ]
  },
  {
    id: "tigla-karelia",
    category: "Acoperișuri",
    title: "Țiglă Metalică Karelia",
    price: 136,
    unit: "lei/m²",
    image: "https://krovli.lider.md/sites/default/files/2025-10/Karelia_7024_0.png",
    shortDescription: "Design sofisticat și finisaj elegant pentru case de calitate.",
    description: "Design sofisticat și finisaj elegant, pentru case care pun accent pe detalii și calitate. Combină estetica nordică cu rezistența necesară climatului local.",
    specs: [
      { label: "Grosime oțel", value: "0.45 mm" },
      { label: "Strat de protecție", value: "Poliester mat" },
      { label: "Lățime utilă", value: "1.19 m" },
      { label: "Garanție", value: "15 ani" }
    ]
  },
  {
    id: "acoperis-la-cheie",
    category: "Acoperișuri",
    title: "Acoperiș Complet La Cheie",
    price: 950,
    unit: "lei/m²",
    badge: "Ofertă",
    image: "https://i.ibb.co/XfbsDsQg/Acoperis-finisat2.png",
    shortDescription: "Materiale + montaj profesional complet, de la măsurători până la finisaj.",
    description: "Serviciu complet de montaj acoperiș: măsurători la fața locului, materiale (țiglă metalică, folie anticondens, șuruburi, accesorii) și echipă profesională de montaj. Predare la cheie, cu garanție extinsă și consultanță gratuită.",
    specs: [
      { label: "Include", value: "Materiale + Montaj" },
      { label: "Consultanță", value: "Gratuită" },
      { label: "Termen execuție", value: "În funcție de proiect" },
      { label: "Garanție montaj", value: "Extinsă" }
    ]
  },

  // ---------------- FAȚADE ----------------
  {
    id: "fatada-tencuiala-decorativa",
    category: "Fațade",
    title: "Tencuială Decorativă",
    price: 850,
    unit: "lei/m²",
    badge: "Popular",
    image: "https://i.ibb.co/Cp1XsLy8/file-00000000175471f4aad6bcf08160e2a1.png",
    shortDescription: "Finisaj premium pentru exterior, rezistent la UV și intemperii.",
    description: "Finisaj premium pentru exterior, rezistent la radiații UV, ploaie și variații de temperatură. Paletă largă de culori și texturi, aplicată de o echipă profesională, la cheie.",
    specs: [
      { label: "Rezistență UV", value: "Da" },
      { label: "Aplicare", value: "Exterior" },
      { label: "Texturi disponibile", value: "Multiple" },
      { label: "Garanție", value: "10 ani" }
    ]
  },
  {
    id: "fatada-moderna",
    category: "Fațade",
    title: "Fațadă Modernă (ETICS)",
    price: 850,
    unit: "lei/m²",
    image: "https://i.ibb.co/n8zSxp6L/file-00000000a7b471f4a884db13ef465c65.png",
    shortDescription: "Design contemporan cu eficiență termică ridicată.",
    description: "Sistem complet de termoizolație și finisare fațadă (ETICS): design contemporan, eficiență termică ridicată și aspect premium. Reduce costurile de încălzire și îmbunătățește confortul locuinței.",
    specs: [
      { label: "Include", value: "Termoizolație + Finisaj" },
      { label: "Eficiență termică", value: "Ridicată" },
      { label: "Aplicare", value: "Exterior" },
      { label: "Garanție", value: "10 ani" }
    ]
  },
  {
    id: "fatada-finisaje-decorative",
    category: "Fațade",
    title: "Finisaje Decorative",
    price: 850,
    unit: "lei/m²",
    image: "https://i.ibb.co/cSQfyjZw/file-00000000e430720a85f058e12fd70bef.png",
    shortDescription: "Gamă variată de texturi decorative pentru fațade elegante.",
    description: "Gamă variată de texturi decorative pentru fațade elegante, moderne și durabile în timp. Se adaptează oricărui stil arhitectural, de la clasic la contemporan.",
    specs: [
      { label: "Rezistență UV", value: "Da" },
      { label: "Aplicare", value: "Exterior" },
      { label: "Garanție", value: "10 ani" }
    ]
  },
  {
    id: "fatada-adezivi-armare",
    category: "Fațade",
    title: "Adezivi și Materiale de Armare",
    price: null,
    unit: "lei",
    image: "https://i.ibb.co/5xvVPs1n/file-000000007ee8720aa15b1ec47f1c9389.png",
    shortDescription: "Produse profesionale pentru lipire și armare a fațadelor.",
    description: "Produse profesionale pentru lipire și armare, oferind aderență puternică și rezistență pe termen lung. Compatibile cu sistemele de termoizolație și tencuială decorativă.",
    specs: [
      { label: "Utilizare", value: "Lipire polistiren / plasă armare" },
      { label: "Aplicare", value: "Exterior" },
      { label: "Preț", value: "La cerere, în funcție de cantitate" }
    ]
  },
  {
    id: "fatada-polistiren",
    category: "Fațade",
    title: "Polistiren pentru Termoizolare",
    price: null,
    unit: "lei",
    image: "https://i.ibb.co/q3xzzXs4/file-00000000ab1071f4942254af5b99e366.png",
    shortDescription: "Izolație fiabilă pentru fațade, confort termic sporit.",
    description: "Izolație fiabilă pentru fațade, oferind confort termic sporit și economie de energie. Disponibil în mai multe grosimi, în funcție de necesarul de izolare al construcției.",
    specs: [
      { label: "Utilizare", value: "Termoizolație fațadă" },
      { label: "Grosimi disponibile", value: "La cerere" },
      { label: "Preț", value: "La cerere, în funcție de cantitate" }
    ]
  },
  {
    id: "fatada-detalii-arhitecturale",
    category: "Fațade",
    title: "Detalii Arhitecturale",
    price: null,
    unit: "lei",
    image: "https://i.ibb.co/8nJr17wm/file-00000000047c72468f41b75b87369f70.png",
    shortDescription: "Elemente decorative care adaugă eleganță și profunzime fațadei.",
    description: "Elemente decorative (brâuri, cornișe, rame de ferestre) care adaugă eleganță, profunzime și un aspect arhitectural distinct fațadei. Personalizabile în funcție de proiect.",
    specs: [
      { label: "Utilizare", value: "Decor fațadă" },
      { label: "Personalizare", value: "La cerere" },
      { label: "Preț", value: "La cerere, în funcție de proiect" }
    ]
  },

  // ---------------- AMK (Panouri Decorative) ----------------
  {
    id: "amk-mix-100",
    category: "AMK",
    title: "AMK Mix 100",
    price: null,
    unit: "lei/m²",
    image: "https://amk.md/wp-content/uploads/2023/07/100.jpg",
    shortDescription: "Textură premium cu aspect natural de piatră și finisaj elegant.",
    description: "Panou decorativ AMK Mix 100, cu textură premium și aspect natural de piatră. Finisaj elegant, potrivit pentru fațade și interioare moderne.",
    specs: [
      { label: "Tip", value: "Panou decorativ compozit" },
      { label: "Aplicare", value: "Fațadă / Interior" },
      { label: "Fixare", value: "Mecanică, fără lucrări umede" }
    ]
  },
  {
    id: "amk-mix-200",
    category: "AMK",
    title: "AMK Mix 200",
    price: null,
    unit: "lei/m²",
    image: "https://amk.md/wp-content/uploads/2023/07/200.jpg",
    shortDescription: "Aspect luxos pentru proiecte și vile moderne.",
    description: "Panou decorativ AMK Mix 200, cu aspect luxos, recomandat pentru proiecte și vile moderne care pun accent pe eleganță și rafinament.",
    specs: [
      { label: "Tip", value: "Panou decorativ compozit" },
      { label: "Aplicare", value: "Fațadă / Interior" },
      { label: "Fixare", value: "Mecanică, fără lucrări umede" }
    ]
  },
  {
    id: "amk-mix-241",
    category: "AMK",
    title: "AMK Mix 241",
    price: null,
    unit: "lei/m²",
    image: "https://amk.md/wp-content/uploads/2023/07/241.jpg",
    shortDescription: "Design modern, execuție profesională și durabilitate maximă.",
    description: "Panou decorativ AMK Mix 241, cu design modern. Execuție profesională și durabilitate maximă în timp, rezistent la intemperii.",
    specs: [
      { label: "Tip", value: "Panou decorativ compozit" },
      { label: "Aplicare", value: "Fațadă / Interior" },
      { label: "Fixare", value: "Mecanică, fără lucrări umede" }
    ]
  },
  {
    id: "amk-mix-300",
    category: "AMK",
    title: "AMK Mix 300",
    price: null,
    unit: "lei/m²",
    image: "https://amk.md/wp-content/uploads/2023/07/300.jpg",
    shortDescription: "Marmură naturală cu textură autentică și rezistență superioară.",
    description: "Panou decorativ AMK Mix 300, cu aspect de marmură naturală, textură autentică și rezistență superioară la factorii de mediu.",
    specs: [
      { label: "Tip", value: "Panou decorativ compozit" },
      { label: "Aplicare", value: "Fațadă / Interior" },
      { label: "Fixare", value: "Mecanică, fără lucrări umede" }
    ]
  },
  {
    id: "amk-mix-322",
    category: "AMK",
    title: "AMK Mix 322",
    price: null,
    unit: "lei/m²",
    image: "https://amk.md/wp-content/uploads/2023/07/322.jpg",
    shortDescription: "Marmură naturală în nuanțe calde pentru un aspect primitor.",
    description: "Panou decorativ AMK Mix 322, în nuanțe calde de marmură naturală, pentru un aspect primitor și elegant al fațadei sau interiorului.",
    specs: [
      { label: "Tip", value: "Panou decorativ compozit" },
      { label: "Aplicare", value: "Fațadă / Interior" },
      { label: "Fixare", value: "Mecanică, fără lucrări umede" }
    ]
  },
  {
    id: "amk-mix-410",
    category: "AMK",
    title: "AMK Mix 410",
    price: null,
    unit: "lei/m²",
    image: "https://amk.md/wp-content/uploads/2023/07/410.jpg",
    shortDescription: "Marmură naturală în tonuri reci pentru un design contemporan.",
    description: "Panou decorativ AMK Mix 410, în tonuri reci de marmură naturală, ideal pentru un design contemporan și minimalist.",
    specs: [
      { label: "Tip", value: "Panou decorativ compozit" },
      { label: "Aplicare", value: "Fațadă / Interior" },
      { label: "Fixare", value: "Mecanică, fără lucrări umede" }
    ]
  },
  {
    id: "amk-mono-001",
    category: "AMK",
    title: "AMK Mono 001",
    price: null,
    unit: "lei/m²",
    image: "https://amk.md/wp-content/uploads/2023/07/001.jpg",
    shortDescription: "Marmură naturală în nuanță uniformă, clasică și elegantă.",
    description: "Panou decorativ AMK Mono 001, în nuanță uniformă de marmură naturală, cu aspect clasic și elegant, potrivit pentru orice tip de proiect.",
    specs: [
      { label: "Tip", value: "Panou decorativ compozit" },
      { label: "Aplicare", value: "Fațadă / Interior" },
      { label: "Fixare", value: "Mecanică, fără lucrări umede" }
    ]
  },
  {
    id: "amk-mono-002",
    category: "AMK",
    title: "AMK Mono 002",
    price: null,
    unit: "lei/m²",
    image: "https://amk.md/wp-content/uploads/2023/07/002.jpg",
    shortDescription: "Marmură naturală cu finisaj mat și aspect sofisticat.",
    description: "Panou decorativ AMK Mono 002, cu finisaj mat și aspect sofisticat, recomandat pentru proiecte care caută un stil discret și rafinat.",
    specs: [
      { label: "Tip", value: "Panou decorativ compozit" },
      { label: "Aplicare", value: "Fațadă / Interior" },
      { label: "Fixare", value: "Mecanică, fără lucrări umede" }
    ]
  },
  {
    id: "amk-mono-010",
    category: "AMK",
    title: "AMK Mono 010",
    price: null,
    unit: "lei/m²",
    image: "https://amk.md/wp-content/uploads/2023/07/010.jpg",
    shortDescription: "Marmură naturală în tonuri deschise pentru luminozitate maximă.",
    description: "Panou decorativ AMK Mono 010, în tonuri deschise de marmură naturală, pentru un aspect luminos și spațios al fațadei.",
    specs: [
      { label: "Tip", value: "Panou decorativ compozit" },
      { label: "Aplicare", value: "Fațadă / Interior" },
      { label: "Fixare", value: "Mecanică, fără lucrări umede" }
    ]
  },

  // ---------------- PAVAJ ----------------
  {
    id: "pavaj-arka",
    category: "Pavaj",
    title: "Pavaj Arka 20×20 / 15×20 / 20×10",
    price: null,
    unit: "lei/m²",
    image: "https://movipavaje.md/storage/products/01KKQDKA5WYB78SHEJ82ECK5PR.png",
    shortDescription: "Grosime 4.5cm. Textură premium cu aspect natural de piatră.",
    description: "Pavaj Arka, grosime 4.5cm, cu textură premium și aspect natural de piatră. Finisaj elegant, ideal pentru curți și terase moderne. Rezistent la îngheț și trafic pietonal/auto ușor.",
    specs: [
      { label: "Grosime", value: "4.5 cm" },
      { label: "Dimensiuni", value: "20×20 / 15×20 / 20×10 cm" },
      { label: "Rezistență la îngheț", value: "Da" },
      { label: "Recomandat pentru", value: "Curți, terase, alei" }
    ]
  }

];
