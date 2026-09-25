/** Dane, które powtarzają się na wielu stronach. Prozą zarządzają pliki .astro. */

export const kontakt = {
  osoba: "Karol Balucki",
  telefon: "786 296 426",
  telefonHref: "tel:+48786296426",
  mail: "kontakt@klarow.com",
  mailHref: "mailto:kontakt@klarow.com",
  mailRozmowa: "mailto:kontakt@klarow.com?subject=Rozmowa%20z%20wizyt%C3%B3wki",
  mailRachunek: "mailto:kontakt@klarow.com?subject=Nasz%20rachunek%20z%20klarow.com",
  mailExcel: "mailto:kontakt@klarow.com?subject=Nasz%20najgorszy%20Excel",
  vcard: "/klarow.vcf",
} as const;

/** Formularz pokazuje się dopiero wtedy, gdy w Cloudflare Pages jest sekret RESEND_API_KEY.
 *  Bez niego funkcja /api/kontakt odbija wiadomość, a zepsuty formularz jest gorszy niż jego brak.
 *  Kolejność: sekret w panelu → ponowne wdrożenie → test POST-em → dopiero tutaj true. */
export const formularzWlaczony = false;

export const haslo = "Skomplikowane bierzemy na siebie. Wam zostaje klarownie.";

/** Presety kalkulatora. Liczby sprawdza test w src/lib/kalkulator.test.mjs. */
export const presety = [
  { id: "raport", nazwa: "Raport tygodniowy w Excelu", osoby: 3, godziny: 3, koszt: 70, udzial: 60 },
  { id: "ksef", nazwa: "Dokumenty spoza KSeF i dekretacja", osoby: 1, godziny: 8, koszt: 60, udzial: 60 },
  { id: "magazyn", nazwa: "Stany magazynowe, WZ/PZ", osoby: 2, godziny: 6, koszt: 55, udzial: 50 },
  { id: "oferty", nazwa: "Oferty i umowy", osoby: 2, godziny: 5, koszt: 80, udzial: 60 },
] as const;

/** Pięć działów oferty. Kolejność jest ta sama na stronie głównej i na /przyklady. */
export const dzialy = [
  { slug: "magazyn", nazwa: "Magazyn" },
  { slug: "ksiegowosc", nazwa: "Księgowość" },
  { slug: "integracje", nazwa: "Integracje i API" },
  { slug: "generatory", nazwa: "Generatory dokumentów" },
  { slug: "raporty", nazwa: "Raporty" },
] as const;

/** Mapa stron. Źródło prawdy dla sitemapy i dla strażnika. */
export const strony = [
  { url: "/", wSitemapie: true },
  { url: "/przyklady", wSitemapie: true },
  { url: "/dokumenty-magazynowe", wSitemapie: true },
  { url: "/dokumenty-kosztowe", wSitemapie: true },
  { url: "/integracje-erp", wSitemapie: true },
  { url: "/generator-dokumentow", wSitemapie: true },
  { url: "/raporty-automatyczne", wSitemapie: true },
  { url: "/polityka-prywatnosci", wSitemapie: true },
  { url: "/cv", wSitemapie: true },
  { url: "/start", wSitemapie: false }, // noindex: adres z kodu QR
  { url: "/dziekujemy", wSitemapie: false }, // noindex: strona po wysłaniu formularza bez JS
  { url: "/nie-wyslano", wSitemapie: false }, // noindex: formularz odbił wiadomość, brak JS
  { url: "/404", wSitemapie: false },
] as const;

/** Dane strukturalne strony głównej. Świadomie skromne: bez logo (favicon nim nie jest),
 *  bez adresu i bez NIP, bez areaServed — firma nie jest jeszcze zarejestrowana,
 *  a schema nie jest miejscem na deklaracje, których nie da się potwierdzić. */
export const daneStrukturalne = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://klarow.com/#organizacja",
      name: "Klarow",
      url: "https://klarow.com/",
      description:
        "Automatyzacje i integracje dla firm: magazyn, księgowość, dokumenty i raporty.",
      email: "kontakt@klarow.com",
      telephone: "+48786296426",
      founder: { "@id": "https://klarow.com/#karol" },
    },
    {
      "@type": "Person",
      "@id": "https://klarow.com/#karol",
      name: "Karol Balucki",
      jobTitle: "Automatyzacje i integracje",
      worksFor: { "@id": "https://klarow.com/#organizacja" },
      email: "kontakt@klarow.com",
      telephone: "+48786296426",
    },
    {
      "@type": "WebSite",
      "@id": "https://klarow.com/#strona",
      url: "https://klarow.com/",
      name: "Klarow",
      inLanguage: "pl-PL",
      publisher: { "@id": "https://klarow.com/#organizacja" },
    },
  ],
} as const;

/** Dane strukturalne podstrony: WebPage + okruszki.
 *  Bez FAQPage — Google wycofał te wyniki rozszerzone w maju 2026, a widoczne FAQ zostaje w treści. */
/** Dane strukturalne /cv: profil osoby. Wiąże nazwisko Karola z firmą — to jedyne miejsce,
 *  gdzie mamy do zadeklarowania osobę, a nie usługę. Bez zdjęcia i bez sameAs: nie mamy ich. */
export const schemaCv = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfilePage",
      "@id": "https://klarow.com/cv#strona",
      url: "https://klarow.com/cv",
      name: "Karol Balucki — co zbudowałem",
      inLanguage: "pl-PL",
      isPartOf: { "@id": "https://klarow.com/#strona" },
      mainEntity: { "@id": "https://klarow.com/#karol" },
    },
    {
      "@type": "Person",
      "@id": "https://klarow.com/#karol",
      name: "Karol Balucki",
      jobTitle: "Automatyzacje i integracje",
      worksFor: { "@id": "https://klarow.com/#organizacja" },
      email: "kontakt@klarow.com",
      telephone: "+48786296426",
      knowsAbout: [
        "automatyzacja procesów biznesowych",
        "integracje systemów ERP",
        "kontroling i raportowanie",
        "obieg dokumentów kosztowych",
        "import i uzgadnianie danych",
      ],
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://klarow.com/cv#okruszki",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Strona główna", item: "https://klarow.com/" },
        { "@type": "ListItem", position: 2, name: "CV" },
      ],
    },
  ],
} as const;

export const schemaPodstrony = (url: string, tytul: string, opis: string, nazwa: string) => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `https://klarow.com${url}#strona`,
      url: `https://klarow.com${url}`,
      name: tytul,
      description: opis,
      inLanguage: "pl-PL",
      isPartOf: { "@id": "https://klarow.com/#strona" },
      about: { "@id": "https://klarow.com/#organizacja" },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `https://klarow.com${url}#okruszki`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Strona główna", item: "https://klarow.com/" },
        { "@type": "ListItem", position: 2, name: "Przykłady", item: "https://klarow.com/przyklady" },
        { "@type": "ListItem", position: 3, name: nazwa },
      ],
    },
  ],
});
