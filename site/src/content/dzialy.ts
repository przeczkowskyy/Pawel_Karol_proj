/**
 * Podstrony działów. Jeden kształt danych dla wszystkich sześciu, żeby kolejne powstawały
 * przez dopisanie treści, a nie przez kopiowanie układu.
 *
 * Zasady treści (z panelu projektowego):
 * - punkt ≤ 10 słów, zdanie ≤ 14 słów, cała strona 380–480 słów;
 * - podmiotem są dane, nie my: „trafia”, „powstaje”, „schodzi”, „czeka”;
 * - zero liczb opisujących efekt, zero kwot, zero nazw klientów;
 * - pierwsze zdanie odpowiedzi w FAQ musi odpowiadać samo.
 */

export type Krok = {
  /** 2–4 słowa, wersaliki w interfejsie. */
  nazwa: string;
  /** Co niesie ten krok — chip przy węźle, ≤ 4 słowa. */
  ladunek: string;
  /** Pełne zdanie, ≤ 12 słów. Bez JS czyta się jako punkt listy. */
  opis: string;
  /** Odgałęzienie albo wyjątek. Pokazujemy w węźle, nie jako osobny krok. */
  wyjatek?: string;
};

export type Dzial = {
  slug: string;
  url: string;
  /** Nazwa w nawigacji i na rozdrożu. */
  nazwa: string;
  h1: string;
  tytul: string;
  opis: string;
  lead: string;
  demo: { tytul: string; kroki: Krok[] };
  wchodzi: string[];
  wychodzi: string[];
  zadania: string[];
  czegoNieRobi: string[];
  start: { zdanie: string; kroki: string[] };
  faq: { pytanie: string; odpowiedz: string }[];
  cta: string;
  /** Sąsiedztwo wg kierunku przepływu danych, nie wg kolejności działów. */
  sasiedzi: { slug: string; powod: string }[];
};

export const magazyn: Dzial = {
  slug: "magazyn",
  url: "/dokumenty-magazynowe",
  nazwa: "Magazyn",
  h1: "Magazyn bez przepisywania",
  tytul: "Dokumenty magazynowe: WZ, PZ i stany bez przepisywania | Klarow",
  opis:
    "Dokumenty magazynowe powstają z danych, które już macie. Schemat pokazuje, jak zgłoszenie z budowy zamienia się w rezerwację, WZ i sygnał o braku materiału.",
  lead:
    "Zgłoszenie z hali albo z budowy wchodzi raz, a stan, dokumenty magazynowe i sygnał o braku powstają same.",
  demo: {
    tytul: "Od zgłoszenia do wydania",
    kroki: [
      {
        nazwa: "Zgłoszenie",
        ladunek: "mail albo zdjęcie",
        opis: "Mail, formularz albo zdjęcie listy z budowy.",
      },
      {
        nazwa: "Odczyt pozycji",
        ladunek: "pozycje i termin",
        opis: "Opis zamienia się w pozycje: co, ile, na kiedy.",
      },
      {
        nazwa: "Stan i rezerwacja",
        ladunek: "rezerwacja",
        opis: "Wolny stan sprawdzony, materiał zarezerwowany na zlecenie.",
        wyjatek: "brak materiału → zapotrzebowanie z terminem idzie do zakupów",
      },
      {
        nazwa: "Dokument WZ",
        ladunek: "WZ i nowy stan",
        opis: "WZ z ciągłą numeracją, stan schodzi w tej samej chwili.",
        wyjatek: "ilość się nie zgadza → przepływ czeka na decyzję człowieka",
      },
      {
        nazwa: "Powiadomienie",
        ladunek: "wiadomość i wpis",
        opis: "Budowa wie, co jedzie, a w rejestrze zostaje kto i kiedy.",
      },
    ],
  },
  wchodzi: ["mail albo formularz z budowy", "plik ze stanami", "dokument dostawcy", "zamówienie z ERP"],
  wychodzi: ["WZ i PZ", "zaktualizowany stan", "zapotrzebowanie do zakupów", "powiadomienie i ślad w rejestrze"],
  zadania: [
    "Stany schodzą przy wydaniu, wchodzą przy przyjęciu.",
    "WZ i PZ powstają z danych, numeracja ciągła.",
    "Rezerwacja materiału pod zlecenie albo budowę.",
    "Sygnał o braku, zanim praca stanie.",
    "Inwentaryzacja: różnice wypisane, nie szukane.",
    "Zamówienie do dostawcy z brakujących pozycji.",
  ],
  czegoNieRobi: [
    "Nie wymienia programu magazynowego — dokłada przepływ obok.",
    "Nie zgaduje stanu. Różnicę pokazuje, nie wyrównuje po cichu.",
    "Nie decyduje o zakupie. Akceptacja zostaje u Was.",
  ],
  start: {
    zdanie:
      "W firmie produkcyjnej albo budowlanej najmniejsza wersja to jeden formularz i jedna lista braków.",
    kroki: [
      "Zgłoszenia z budowy wchodzą jednym formularzem.",
      "WZ powstaje z tego formularza, numeracja ciągła.",
      "Braki lądują na jednej liście z terminem.",
    ],
  },
  faq: [
    {
      pytanie: "Czy musimy zmieniać program magazynowy?",
      odpowiedz:
        "Nie. Najczęściej zostaje program, z którego korzystacie, a przepływ dokładamy obok: dane wchodzą raz i zapisują się tam, gdzie mają trafić. Wymiana systemu jest osobną decyzją, nie warunkiem startu.",
    },
    {
      pytanie: "Skąd narzędzie wie, że zabraknie materiału?",
      odpowiedz:
        "Porównuje wolny stan i rezerwacje z tym, co jest zaplanowane na najbliższe dni. Kiedy zapotrzebowanie przekracza wolny stan, wysyła sygnał z pozycją, ilością i terminem — zanim praca stanie.",
    },
    {
      pytanie: "Co, jeśli stan w systemie nie zgadza się z półką?",
      odpowiedz:
        "Przepływ zatrzymuje się i pokazuje różnicę. Osoba wydająca materiał potwierdza albo poprawia ilość, a w rejestrze zostaje kto, kiedy i na jakiej podstawie. Rozbieżności nie da się przeoczyć na koniec miesiąca.",
    },
    {
      pytanie: "Ile to kosztuje?",
      odpowiedz:
        "Rozliczamy etapami, bez abonamentu. Pierwszy etap wyceniamy po rozmowie, w której widzimy Wasz proces — wcześniej każda kwota byłaby zgadywaniem. Kolejne etapy wchodzą dopiero wtedy, gdy poprzedni działa.",
    },
  ],
  cta: "Opowiedzcie, jak dziś wygląda u Was wydanie materiału.",
  sasiedzi: [
    { slug: "raporty", powod: "stan i wydania kończą w zestawieniu" },
    { slug: "ksiegowosc", powod: "dokument z magazynu ma ciąg dalszy w kosztach" },
    { slug: "integracje", powod: "te same dane muszą trafić do ERP i sklepu" },
  ],
};

export const dzialyPodstrony: Dzial[] = [magazyn];

/** Adres działu: własna podstrona, jeśli już istnieje, w przeciwnym razie kotwica na rozdrożu. */
export const adresDzialu = (slug: string): string =>
  dzialyPodstrony.find((d) => d.slug === slug)?.url ?? `/przyklady#${slug}`;

/** Czy dział ma już własną podstronę (rozdroże dokłada wtedy link „zobaczcie, jak płyną dane"). */
export const maPodstrone = (slug: string): boolean => dzialyPodstrony.some((d) => d.slug === slug);
