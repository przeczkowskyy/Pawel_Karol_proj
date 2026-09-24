/**
 * Treść strony /cv. Lista, nie opowieść: jedno narzędzie = jedna linijka.
 * Kto chce szczegółów, zadzwoni — po to jest numer na górze.
 *
 * Granice (zasady 2 i 4 z CLAUDE.md): żadnej nazwy firmy, klienta ani pracodawcy,
 * żadnej liczby z cudzych danych, opisujemy mechanizm, nie czyjeś wyniki.
 * Źródło opisów: lista narzędzi spisana przez Karola, tag archiwum/strona-v1.
 */

export type GrupaCv = {
  slug: "kontroling" | "finanse" | "dane" | "produkcja" | "administracja";
  tytul: string;
  ikona: "raporty" | "ksiegowosc" | "integracje" | "magazyn" | "generatory";
  narzedzia: { nazwa: string; robi: string }[];
};

export const grupyCv: GrupaCv[] = [
  {
    slug: "kontroling",
    tytul: "Kontroling i raportowanie",
    ikona: "raporty",
    narzedzia: [
      { nazwa: "Raport zarządczy", robi: "Panel dla zarządu z dziesiątek plików jednym przebiegiem. Widać etapy, na których wycieka marża." },
      { nazwa: "Kontroling kosztów projektu", robi: "Budżet, wydatek i przekroczenie na każdym etapie, z prognozą marży i bramką „zatwierdź tydzień”." },
      { nazwa: "Kontroling na danych z KSeF", robi: "Faktury z oficjalnego API, budżet wobec wykonania i prognoza płynności na 13 tygodni. Tylko odczyt." },
    ],
  },
  {
    slug: "finanse",
    tytul: "Finanse i płatności",
    ikona: "ksiegowosc",
    narzedzia: [
      { nazwa: "Obieg akceptacji przelewów", robi: "Od wniosku do przelewu: plan 14-dniowy, decyzja przy każdej pozycji, akceptacja na cztery oczy, ślad." },
      { nazwa: "Kalkulator transz i walut", robi: "Rozbija wpłaty na projekty razem z VAT-em, bez dryfu groszy. Saldo zawsze się spina." },
      { nazwa: "Fakturowanie AIA G702/G703", robi: "Amerykańskie arkusze rozliczeniowe: ile fakturować teraz, z retencją i progiem depozytu." },
    ],
  },
  {
    slug: "dane",
    tytul: "Dane i importy",
    ikona: "integracje",
    narzedzia: [
      { nazwa: "Importy z ERP", robi: "Godziny, materiał i koszty z ERP: klasyfikacja słownikiem, tylko nowe wiersze, tryb testowy i kopia." },
      { nazwa: "Import z rekoncyliacją", robi: "Różnica wobec poprzedniej wersji i zgodność sum co do grosza, zanim cokolwiek zatwierdzicie." },
      { nazwa: "Audyt jakości danych", robi: "Bramka przed raportem: sprawdza pliki regułami i buduje macierz pewności. Niczego nie zapisuje." },
    ],
  },
  {
    slug: "produkcja",
    tytul: "Produkcja i harmonogram",
    ikona: "magazyn",
    narzedzia: [
      { nazwa: "Dashboard produkcji", robi: "Cały portfel w jednym kadrze: kafel to obiekt, suwak przesuwa tydzień, kliknięcie rozkłada na etapy." },
      { nazwa: "Oś czasu zadań", robi: "Dwa pasy na zadanie — harmonogram poprzedni i bieżący — z obsuwą podaną w dniach." },
    ],
  },
  {
    slug: "administracja",
    tytul: "Administracja i dokumenty",
    ikona: "generatory",
    narzedzia: [
      { nazwa: "Protokoły robocizny", robi: "Z rejestrów godzin miesięczne protokoły kosztu pracy, przez akceptacje aż do faktury." },
      { nazwa: "Rejestr umów", robi: "Umowy ze skanami i wymianą z arkuszem. Koniec z psującymi się ścieżkami do plików." },
    ],
  },
];

/** Cztery zasady widoczne w samej budowie tych narzędzi. */
export const zasadyCv = [
  "Dane zostają u Was: liczenie idzie na Waszym sprzęcie albo Waszym serwerze.",
  "Najpierw czytać, potem zapisywać: tryb testowy, kopia przed zapisem, audyt bez prawa zapisu.",
  "Każdą liczbę da się przejść ręcznie — wynik pokazuje, skąd się wziął.",
  "Widać, kto zatwierdził. Przy pieniądzach akceptacja idzie na cztery oczy.",
];
