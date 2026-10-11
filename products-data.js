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
    image: "acoperisuri-dakia-7024-0",
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
    image: "acoperisuri-melano-7024",
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
    image: "acoperisuri-lider-7024-0",
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
    image: "acoperisuri-kvadro-7024",
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
    image: "acoperisuri-florentia-7024-0",
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
    image: "acoperisuri-karelia-7024-0",
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
    image: "acoperisuri-acoperis-finisat2",
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
    image: "fatade-file-00000000175471f4aad6bcf08160e2a1",
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
    image: "fatade-file-00000000a7b471f4a884db13ef465c65",
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
    image: "fatade-file-00000000e430720a85f058e12fd70bef",
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
    image: "fatade-file-000000007ee8720aa15b1ec47f1c9389",
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
    image: "fatade-file-00000000ab1071f4942254af5b99e366",
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
    image: "fatade-file-00000000047c72468f41b75b87369f70",
    shortDescription: "Elemente decorative care adaugă eleganță și profunzime fațadei.",
    description: "Elemente decorative (brâuri, cornișe, rame de ferestre) care adaugă eleganță, profunzime și un aspect arhitectural distinct fațadei. Personalizabile în funcție de proiect.",
    specs: [
      { label: "Utilizare", value: "Decor fațadă" },
      { label: "Personalizare", value: "La cerere" },
      { label: "Preț", value: "La cerere, în funcție de proiect" }
    ]
  },

  // ---------------- MATERIALE (Tencuieli, Izolații — Caparol) ----------------
  {
    id: "material-tencuiala-buntsteinputz",
    category: "Materiale",
    title: "Tencuială Mozaicată Caparol Buntsteinputz",
    price: 2199,
    unit: "lei/căldare 25kg",
    image: "materiale-buntsteinputz---tencuial-mozaicat-pentru-socl-22397-1-17889393957614",
    shortDescription: "Tencuială mozaicată decorativă, ideală pentru soclu, rezistentă la impact și umiditate.",
    description: "Tencuială mozaicată Caparol Buntsteinputz, recomandată pentru soclul clădirii. Rezistență ridicată la impact, umiditate și murdărire, cu aspect decorativ mozaicat.",
    specs: [
      { label: "Brand", value: "Caparol" },
      { label: "Ambalaj", value: "Căldare 25 kg" },
      { label: "Utilizare recomandată", value: "Soclu clădire" }
    ]
  },
  {
    id: "material-tencuiala-carbon-k15",
    category: "Materiale",
    title: "Tencuială Caparol Carbon Fassadenputz K15",
    price: 1849,
    unit: "lei/căldare 25kg",
    image: "materiale-carbon-fassadenputz-k15-alb-25-kg-22522-1-1790237789869",
    shortDescription: "Tencuială decorativă structurată K15, culoare albă, pentru fațade exterioare.",
    description: "Tencuială decorativă Caparol Carbon Fassadenputz K15, culoare albă, cu structură granulară fină. Rezistentă la intemperii, potrivită pentru fațade exterioare.",
    specs: [
      { label: "Brand", value: "Caparol" },
      { label: "Structură", value: "K15" },
      { label: "Culoare", value: "Alb" },
      { label: "Ambalaj", value: "Căldare 25 kg" }
    ]
  },
  {
    id: "material-tencuiala-carbon-r20",
    category: "Materiale",
    title: "Tencuială Caparol Carbon Fassadenputz R20",
    price: 1749,
    unit: "lei/căldare 25kg",
    image: "materiale-carbon-fassadenputz-r20-alb-25-kg-22523-1-17905964456161",
    shortDescription: "Tencuială decorativă structurată R20, culoare albă, pentru fațade exterioare.",
    description: "Tencuială decorativă Caparol Carbon Fassadenputz R20, culoare albă, cu structură rilată. Rezistentă la intemperii, potrivită pentru fațade exterioare.",
    specs: [
      { label: "Brand", value: "Caparol" },
      { label: "Structură", value: "R20" },
      { label: "Culoare", value: "Alb" },
      { label: "Ambalaj", value: "Căldare 25 kg" }
    ]
  },
  {
    id: "material-tencuiala-silicon-k15",
    category: "Materiale",
    title: "Tencuială Silicon Caparol K15",
    price: 1749,
    unit: "lei/căldare 25kg",
    image: "materiale-caparolsiliconfassadenputzk15-12197-1-1603984353",
    shortDescription: "Tencuială siliconică structurată K15, rezistență ridicată la murdărire.",
    description: "Tencuială siliconică Caparol, structură K15. Rezistență ridicată la murdărire și dezvoltare de mucegai/alge, respirabilă, pentru fațade exterioare.",
    specs: [
      { label: "Brand", value: "Caparol" },
      { label: "Tip", value: "Siliconică" },
      { label: "Structură", value: "K15" },
      { label: "Ambalaj", value: "Căldare 25 kg" }
    ]
  },
  {
    id: "material-tencuiala-silicon-r20",
    category: "Materiale",
    title: "Tencuială Silicon Caparol R20",
    price: 1679,
    unit: "lei/căldare 25kg",
    image: "materiale-caparolsiliconfassadenputzr20-12228-1-1605087611",
    shortDescription: "Tencuială siliconică structurată R20, rezistență ridicată la murdărire.",
    description: "Tencuială siliconică Caparol, structură R20. Rezistență ridicată la murdărire și dezvoltare de mucegai/alge, respirabilă, pentru fațade exterioare.",
    specs: [
      { label: "Brand", value: "Caparol" },
      { label: "Tip", value: "Siliconică" },
      { label: "Structură", value: "R20" },
      { label: "Ambalaj", value: "Căldare 25 kg" }
    ]
  },
  {
    id: "material-tencuiala-silikat-k15",
    category: "Materiale",
    title: "Tencuială Silikat Caparol K15",
    price: 1749,
    unit: "lei/căldare 25kg",
    image: "materiale-caparolsilikatfassadenputzk15-12258-1-1603984419",
    shortDescription: "Tencuială silicatică structurată K15, foarte respirabilă și durabilă.",
    description: "Tencuială silicatică Caparol, structură K15. Foarte respirabilă, cu durabilitate ridicată a culorii, recomandată pentru fațade exterioare.",
    specs: [
      { label: "Brand", value: "Caparol" },
      { label: "Tip", value: "Silicatică" },
      { label: "Structură", value: "K15" },
      { label: "Ambalaj", value: "Căldare 25 kg" }
    ]
  },
  {
    id: "material-grund-caparol",
    category: "Materiale",
    title: "Grund Caparol Putzgrund",
    price: 1499,
    unit: "lei/căldare 25kg",
    image: "materiale-caparolputzgrundgrund25kgalb-12073-1-1607348403",
    shortDescription: "Grund de amorsare Caparol, culoare albă, pregătire suport înainte de tencuială.",
    description: "Grund de amorsare Caparol Putzgrund, culoare albă. Asigură aderență uniformă a tencuielii decorative pe suport și reduce absorbția.",
    specs: [
      { label: "Brand", value: "Caparol" },
      { label: "Culoare", value: "Alb" },
      { label: "Ambalaj", value: "Căldare 25 kg" },
      { label: "Utilizare", value: "Amorsare înainte de tencuială decorativă" }
    ]
  },
  {
    id: "material-polistiren-ct80",
    category: "Materiale",
    title: "Polistiren Expandat Caparol CT80 (30mm)",
    price: null,
    unit: "lei",
    image: "materiale-caparolct80fpolistirenexapandat30mm-20780-1-1607948741",
    shortDescription: "Polistiren expandat pentru termoizolație fațadă, grosime 30mm.",
    description: "Polistiren expandat Caparol CT80, grosime 30mm, pentru termoizolarea fațadelor. Densitate potrivită pentru sisteme ETICS.",
    specs: [
      { label: "Brand", value: "Caparol" },
      { label: "Grosime", value: "30 mm" },
      { label: "Utilizare", value: "Termoizolație fațadă" },
      { label: "Preț", value: "La cerere, în funcție de cantitate" }
    ]
  },
  {
    id: "material-polistiren-dalmatino",
    category: "Materiale",
    title: "Polistiren Expandat Caparol Dalmatino (30mm)",
    price: null,
    unit: "lei",
    image: "materiale-caparoldalmatinapolistirenexpandat30mm-20787-1-1607949806",
    shortDescription: "Polistiren expandat Dalmatino, termoizolație fațadă, grosime 30mm.",
    description: "Polistiren expandat Caparol Dalmatino, grosime 30mm, pentru termoizolarea fațadelor în sisteme ETICS.",
    specs: [
      { label: "Brand", value: "Caparol" },
      { label: "Grosime", value: "30 mm" },
      { label: "Utilizare", value: "Termoizolație fațadă" },
      { label: "Preț", value: "La cerere, în funcție de cantitate" }
    ]
  },
  {
    id: "material-vata-bazaltica-100mm",
    category: "Materiale",
    title: "Vată Bazaltică pentru Termoizolații (100mm)",
    price: null,
    unit: "lei",
    image: "materiale-vat-bazaltic-pentrutermoizola-ii100mm-20798-1-1607950466",
    shortDescription: "Vată bazaltică, grosime 100mm, izolație termică și fonică pentru fațade.",
    description: "Vată bazaltică pentru termoizolații, grosime 100mm. Oferă izolare termică și fonică superioară, incombustibilă, recomandată pentru fațade ventilate sau ETICS.",
    specs: [
      { label: "Grosime", value: "100 mm" },
      { label: "Utilizare", value: "Termoizolație / izolație fonică fațadă" },
      { label: "Preț", value: "La cerere, în funcție de cantitate" }
    ]
  },
  {
    id: "material-vata-bazaltica-fawori",
    category: "Materiale",
    title: "Vată Bazaltică Fawori TR10 (100mm)",
    price: null,
    unit: "lei",
    image: "materiale-vata-bazaltica-fawori-tr10-30kpa-100-mm-21024-1-16285793302419",
    shortDescription: "Vată bazaltică Fawori TR10, rezistență 30kPa, grosime 100mm.",
    description: "Vată bazaltică Fawori TR10, cu rezistență la compresiune de 30 kPa și grosime de 100mm. Recomandată pentru termoizolarea fațadelor.",
    specs: [
      { label: "Brand", value: "Fawori" },
      { label: "Rezistență compresiune", value: "30 kPa" },
      { label: "Grosime", value: "100 mm" },
      { label: "Preț", value: "La cerere, în funcție de cantitate" }
    ]
  },

  // ---------------- AMK (Panouri Decorative) ----------------
  {
    id: "amk-mix-100",
    category: "AMK",
    title: "AMK Mix 100",
    price: null,
    unit: "lei/m²",
    image: "amk-100",
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
    image: "amk-200",
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
    image: "amk-241",
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
    image: "amk-300",
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
    image: "amk-322",
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
    image: "amk-410",
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
    image: "amk-001",
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
    image: "amk-002",
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
    image: "amk-010",
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
    image: "pavaj-01kkqdka5wyb78shej82eck5pr",
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
