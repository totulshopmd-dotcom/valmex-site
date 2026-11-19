/* =====================================================================
   VALMEX.MD — BAZA DE DATE PROIECTE (Portofoliu)
   =====================================================================
   Adaugi/modifici proiecte aici. La fel ca la products-data.js — nu ai
   nevoie de cod, doar copiezi un bloc { ... } și schimbi valorile.

   CÂMPURI:
   id          - cod unic, fără spații
   category    - "Acoperișuri" / "Fațade" / "AMK" / "Pavaj" (poți adăuga altă categorie)
   location    - localitatea proiectului (ex: "Chișinău")
   title       - titlul proiectului
   description - descriere scurtă (1-2 propoziții)
   images      - LISTĂ de poze. Poți pune UNA singură, sau MAI MULTE —
                 dacă pui mai multe, pe site apare un rând de thumbnail-uri
                 sub poza mare, pe care vizitatorul le poate apăsa ca să
                 schimbe imaginea principală (exact ca la fatade3d.md).
   ===================================================================== */

const PROJECTS = [
  {
    id: "gard-telenesti-1",
    category: "Garduri",
    location: "Telenești",
    title: "Gard Telenești",
    description: "Transformare completă de gard — de la schița stabilită cu clientul, până la rezultatul final. Un rezultat care merită așteptarea.",
    images: [
      "garduri-proiect-gard-telenesti-dupa",
      "garduri-proiect-gard-telenesti-inainte",
      "garduri-proiect-telenesti-gard-rezultatul-proiectului",
      "garduri-proiect-telenesti-gard-2",
      "garduri-proiect-gard-telenesti-3",
      "garduri-proiect-gard-telenesti-5",
      "garduri-proiect-gard-telenesti-schita-clientului"
    ]
  },
  {
    id: "acoperis-negureni-1",
    category: "Acoperișuri",
    location: "Negureni",
    title: "Acoperiș Negureni",
    description: "Montaj complet acoperiș metalic — transformare completă, de la structura veche până la finisajul final.",
    images: [
      "acoperisuri-acoperis-negureni-dupa-editat",
      "acoperisuri-acoperis-negureni-pina-la"
    ]
  },
  {
    id: "acoperis-chisinau-1",
    category: "Acoperișuri",
    location: "Chișinău",
    title: "Acoperiș Premium",
    description: "Montaj complet acoperiș din țiglă metalică Dakia cu finisaj antracit. Suprafață 180 m².",
    images: ["acoperisuri-acoperis-finisat2"]
  },
  {
    id: "acoperis-balti-1",
    category: "Acoperișuri",
    location: "Bălți",
    title: "Acoperiș Modern",
    description: "Acoperiș din țiglă metalică Melano cu finisaj modern. Suprafață 220 m².",
    images: ["acoperisuri-roofart-acoperisuri-din-tigla-metalica"]
  },
  {
    id: "acoperis-orhei-1",
    category: "Acoperișuri",
    location: "Orhei",
    title: "Acoperiș Elegant",
    description: "Design sofisticat cu țiglă metalică Florenția. Suprafață 150 m².",
    images: ["acoperisuri-germania-simetric-plus-detalii-5"]
  },
  {
    id: "acoperis-cahul-1",
    category: "Acoperișuri",
    location: "Cahul",
    title: "Acoperiș Rezistent",
    description: "Configurație profilată pentru distribuire uniformă a sarcinilor. Suprafață 200 m².",
    images: ["acoperisuri-germania-simetric-plus-detalii-2"]
  },
  {
    id: "amk-chisinau-1",
    category: "AMK",
    location: "Chișinău",
    title: "Fațadă AMK",
    description: "Montaj panouri AMK Mix 200. Aspect premium de marmură naturală. Suprafață 300 m².",
    images: ["amk-fatade-amk-proiect-finisat-5"]
  },
  {
    id: "fatada-ungheni-1",
    category: "Fațade",
    location: "Ungheni",
    title: "Fațadă Decorativă",
    description: "Tencuială siliconată decorativă cu termoizolație. Suprafață 250 m².",
    images: ["fatade-file-00000000175471f4aad6bcf08160e2a1"]
  },
  {
    id: "amk-soroca-1",
    category: "AMK",
    location: "Soroca",
    title: "Proiect AMK",
    description: "Panouri AMK Mono 001 pentru o vilă modernă. Suprafață 180 m².",
    images: ["amk-img-20260713-214057-443"]
  },
  {
    id: "amk-comrat-1",
    category: "AMK",
    location: "Comrat",
    title: "Proiect AMK",
    description: "Montaj rapid panouri AMK Mix 241. Suprafață 220 m².",
    images: ["amk-img-20260713-214227-481"]
  },
  {
    id: "pavaj-chisinau-1",
    category: "Pavaj",
    location: "Chișinău",
    title: "Pavaj Curte",
    description: "Amenajare curte cu pavaj Arka 20×20. Suprafață 120 m².",
    images: ["pavaj-01kkqdka5wyb78shej82eck5pr"]
  }
];
