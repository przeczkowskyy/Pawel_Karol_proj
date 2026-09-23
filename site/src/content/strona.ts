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

export const haslo = "Skomplikowane bierzemy na siebie. Wam zostaje klarownie.";

/** Presety kalkulatora. Liczby sprawdza test w src/lib/kalkulator.test.mjs. */
export const presety = [
  { id: "raport", nazwa: "Raport tygodniowy w Excelu", osoby: 3, godziny: 3, koszt: 70, udzial: 60 },
  { id: "ksef", nazwa: "Dokumenty spoza KSeF i dekretacja", osoby: 1, godziny: 8, koszt: 60, udzial: 60 },
  { id: "magazyn", nazwa: "Stany magazynowe, WZ/PZ", osoby: 2, godziny: 6, koszt: 55, udzial: 50 },
  { id: "oferty", nazwa: "Oferty i umowy", osoby: 2, godziny: 5, koszt: 80, udzial: 60 },
] as const;

/** Sześć działów oferty. Kolejność jest ta sama na stronie głównej i na /przyklady. */
export const dzialy = [
  { slug: "magazyn", nazwa: "Magazyn" },
  { slug: "ksiegowosc", nazwa: "Księgowość" },
  { slug: "integracje", nazwa: "Integracje i API" },
  { slug: "czat-ai", nazwa: "Czat AI" },
  { slug: "generatory", nazwa: "Generatory dokumentów" },
  { slug: "raporty", nazwa: "Raporty" },
] as const;
