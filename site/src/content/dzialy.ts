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
  demo: {
    tytul: string;
    kroki: Krok[];
    /** Jedno zdanie, które niesie sens całego przepływu. Stoi pod schematem. */
    zasada?: string;
  };
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
    "Zapotrzebowanie wchodzi raz — z maila, harmonogramu, formularza albo z ERP — a stan, dokumenty i sygnał o braku powstają same.",
  demo: {
    tytul: "Od zgłoszenia do wydania",
    kroki: [
      {
        nazwa: "Źródło",
        ladunek: "mail, harmonogram, ERP",
        opis: "Pozycje wchodzą z maila, harmonogramu, formularza albo wprost z ERP.",
        wyjatek: "nowe źródło → podłączamy je zamiast przepisywać ręcznie",
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
    zasada:
      "Zasada jest jedna: żadna pozycja nie przechodzi przez ręczne przepisywanie. Człowiek decyduje i akceptuje, dane przenoszą się same.",
  },
  wchodzi: [
    "mail albo formularz z budowy",
    "harmonogram robót albo plan produkcji",
    "plik ze stanami",
    "dokument dostawcy",
    "zamówienie z ERP",
  ],
  wychodzi: ["WZ i PZ", "zaktualizowany stan", "zapotrzebowanie do zakupów", "powiadomienie i ślad w rejestrze"],
  zadania: [
    "Pozycje wchodzą z maila, harmonogramu, formularza albo z ERP.",
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


export const ksiegowosc: Dzial = {
  slug: "ksiegowosc",
  url: "/dokumenty-kosztowe",
  nazwa: "Księgowość",
  h1: "Faktury trafiają na miejsce",
  tytul: "Dokumenty kosztowe: obieg, dekretacja i akceptacja | Klarow",
  opis:
    "Dokumenty kosztowe trafiają do właściwego zlecenia, z kontem księgowym i centrum kosztowym. Schemat pokazuje cały obieg: od wpłynięcia do pliku dla księgowości.",
  lead:
    "Dokument kosztowy wchodzi raz — z KSeF, maila albo zdjęcia — i sam trafia do zlecenia, konta i osoby, która go akceptuje.",
  demo: {
    tytul: "Od dokumentu do księgowania",
    kroki: [
      {
        nazwa: "Źródło",
        ladunek: "KSeF, mail, zdjęcie",
        opis: "Faktury krajowe z KSeF, reszta z maila, skanu albo zdjęcia.",
        wyjatek: "dokument zagraniczny → ten sam obieg, inny zestaw pól",
      },
      {
        nazwa: "Odczyt",
        ladunek: "kontrahent i kwota",
        opis: "Z dokumentu schodzą kontrahent, numer, kwota i data.",
      },
      {
        nazwa: "Przypisanie",
        ladunek: "zlecenie i konto",
        opis: "Reguły nadają zlecenie, konto księgowe i centrum kosztowe.",
        wyjatek: "brak dopasowania → dokument czeka z pytaniem, nie wchodzi w złe miejsce",
      },
      {
        nazwa: "Akceptacja",
        ladunek: "decyzja i ślad",
        opis: "Osoba odpowiedzialna akceptuje z telefonu, ślad zostaje w rejestrze.",
      },
      {
        nazwa: "Księgowość",
        ladunek: "plik importu",
        opis: "Zaakceptowany dokument idzie do programu księgowego w jego formacie.",
      },
    ],
    zasada:
      "Dekretacja jest propozycją, nie wyrokiem: reguły przygotowują opis, a decyzja i akceptacja zostają po Waszej stronie.",
  },
  wchodzi: [
    "faktury krajowe z KSeF",
    "faktury zagraniczne, rachunki i noty",
    "zdjęcia dokumentów z budowy",
    "transakcje z konta, również z Revolut",
    "plan kont i lista zleceń",
  ],
  wychodzi: [
    "rejestr z filtrem po zleceniu i statusie",
    "plik importowy w formacie Waszej księgowości",
    "przypisane konto i centrum kosztowe",
    "przypomnienie o dokumentach bez akceptacji",
  ],
  zadania: [
    "Dokumenty spoza KSeF wchodzą jednym kanałem.",
    "Koszt przypisany do zlecenia albo budowy.",
    "Konto księgowe i centrum kosztowe nadane regułą.",
    "Akceptacja z telefonu, bez krążenia maili.",
    "Transakcje z konta dopasowane do dokumentów.",
    "Sygnał o dokumentach, które czekają za długo.",
  ],
  czegoNieRobi: [
    "Nie prowadzi ksiąg. Przygotowuje dane, księguje księgowość.",
    "Nie rozstrzyga kwalifikacji podatkowej.",
    "Nie akceptuje za nikogo. Propozycja czeka na decyzję.",
  ],
  start: {
    zdanie: "Najmniejsza wersja to jedna kategoria dokumentów i jedna reguła przypisania.",
    kroki: [
      "Dokumenty wpadają na jedną wspólną skrzynkę.",
      "Reguła nadaje zlecenie i konto księgowe.",
      "Akceptacja wchodzi jednym kliknięciem z telefonu.",
    ],
  },
  faq: [
    {
      pytanie: "Czy to zastąpi nasz program księgowy?",
      odpowiedz:
        "Nie. Program księgowy zostaje, a obieg dokładamy przed nim: dokument wchodzi raz, dostaje opis i akceptację, a do księgowości trafia gotowy plik w jej formacie.",
    },
    {
      pytanie: "Skąd narzędzie wie, na które zlecenie wrzucić koszt?",
      odpowiedz:
        "Z reguł, które ustalacie: numer zamówienia na dokumencie, kontrahent, projekt albo słowo w opisie. Gdy żadna reguła nie pasuje, dokument czeka z pytaniem, zamiast trafić w złe miejsce.",
    },
    {
      pytanie: "Jak rozliczacie taki projekt?",
      odpowiedz:
        "Etapami, bez abonamentu. Pierwszy etap wyceniamy po rozmowie, w której widzimy Wasze dokumenty i reguły. Kolejny wchodzi dopiero wtedy, gdy poprzedni działa u Was na produkcji.",
    },
  ],
  cta: "Pokażcie, jak dziś krąży u Was faktura kosztowa.",
  sasiedzi: [
    { slug: "integracje", powod: "dokument musi trafić do programu księgowego" },
    { slug: "raporty", powod: "koszty kończą w zestawieniu" },
    { slug: "generatory", powod: "z tych samych danych powstają dokumenty" },
  ],
};

export const integracje: Dzial = {
  slug: "integracje",
  url: "/integracje-erp",
  nazwa: "Integracje",
  h1: "Programy, które się dogadują",
  tytul: "Integracja systemów: ERP, CRM, sklep i Excel | Klarow",
  opis:
    "Ten sam dokument nie jest wpisywany dwa razy. Schemat pokazuje, jak zmiana w jednym systemie trafia do drugiego i co dzieje się, gdy zapis się nie uda.",
  lead:
    "Zmiana w jednym systemie sama trafia do pozostałych, a to, czego nie da się dopasować, ląduje na liście wyjątków.",
  demo: {
    tytul: "Od zmiany do potwierdzenia",
    kroki: [
      {
        nazwa: "Zdarzenie",
        ladunek: "nowy rekord",
        opis: "Zamówienie, kontrahent albo cena zmienia się w systemie źródłowym.",
      },
      {
        nazwa: "Mapowanie",
        ladunek: "pola i indeksy",
        opis: "Pola i indeksy tłumaczą się na słownik drugiego systemu.",
        wyjatek: "brak indeksu → rekord czeka na liście wyjątków z przyczyną",
      },
      {
        nazwa: "Zapis",
        ladunek: "dokument w celu",
        opis: "Dane zapisują się w drugim systemie przez API.",
      },
      {
        nazwa: "Potwierdzenie",
        ladunek: "status zwrotny",
        opis: "System docelowy potwierdza zapis, a status wraca do źródła.",
        wyjatek: "brak odpowiedzi → kolejka i ponowienie, bez gubienia rekordu",
      },
      {
        nazwa: "Dziennik",
        ladunek: "ślad wymiany",
        opis: "W dzienniku zostaje każda wymiana i każdy błąd.",
      },
    ],
    zasada:
      "Integracja nie zgaduje. Czego nie da się dopasować jednoznacznie, zatrzymuje się z opisem przyczyny, zamiast wejść po cichu z błędem.",
  },
  wchodzi: ["ERP", "CRM", "sklep internetowy", "arkusze i pliki wymiany", "API dostawcy albo przewoźnika"],
  wychodzi: [
    "ten sam dokument po obu stronach",
    "lista wyjątków z przyczyną zatrzymania",
    "dziennik wymiany: co, kiedy, z jakim skutkiem",
    "powiadomienie o zerwanym połączeniu",
  ],
  zadania: [
    "Zamówienie ze sklepu ląduje w ERP.",
    "Kontrahent z CRM zakłada się w ERP.",
    "Ceny i stany jadą w drugą stronę.",
    "Pliki wymiany zamiast ręcznych eksportów.",
    "Kolejka i ponowienia, gdy system nie odpowiada.",
  ],
  czegoNieRobi: [
    "Nie zastępuje ERP ani CRM.",
    "Nie poprawia danych u źródła. Pokazuje, co nie pasuje.",
    "Nie kasuje ani nie nadpisuje rekordów po cichu.",
  ],
  start: {
    zdanie: "Najmniejsza wersja to jeden kierunek i jeden typ dokumentu.",
    kroki: [
      "Wybieramy jeden dokument, na przykład zamówienie.",
      "Uruchamiamy wymianę w jedną stronę.",
      "Przez tydzień patrzymy na listę wyjątków.",
    ],
  },
  faq: [
    {
      pytanie: "Co, gdy system nie ma API?",
      odpowiedz:
        "Wtedy używamy tego, co jest: eksportu do pliku, bazy danych, arkusza na dysku albo importu wsadowego. Brak API wydłuża pierwszy etap, ale rzadko przekreśla integrację.",
    },
    {
      pytanie: "Co się stanie, gdy drugi system nie odpowie?",
      odpowiedz:
        "Rekord trafia do kolejki i jest ponawiany. Nic nie ginie po drodze, a gdy przerwa się przedłuża, przychodzi powiadomienie z liczbą dokumentów czekających w kolejce.",
    },
    {
      pytanie: "Czy integracja zmieni coś w naszych systemach?",
      odpowiedz:
        "Tylko to, na co się zgodzicie. Najczęściej dokładamy zapisy przez API i nie ruszamy ustawień. Zakres uzgadniamy przed startem i zapisujemy w dokumentacji, którą dostajecie.",
    },
  ],
  cta: "Powiedzcie, które dwa programy nie rozmawiają ze sobą u Was.",
  sasiedzi: [
    { slug: "magazyn", powod: "dokumenty magazynowe jadą tą samą drogą" },
    { slug: "ksiegowosc", powod: "koszty muszą trafić do księgowości" },
    { slug: "raporty", powod: "uzgodnione dane kończą w zestawieniu" },
  ],
};

export const czatAi: Dzial = {
  slug: "czat-ai",
  url: "/asystent-ai",
  nazwa: "Asystent AI",
  h1: "Odpowiedzi z Waszych dokumentów",
  tytul: "Asystent AI po dokumentach firmowych | Klarow",
  opis:
    "Czat, który odpowiada wyłącznie na podstawie Waszych dokumentów i pokazuje źródło odpowiedzi. Schemat prowadzi pytanie krok po kroku, aż do przekazania sprawy człowiekowi.",
  lead:
    "Pytanie zadane zwykłym zdaniem dostaje odpowiedź z Waszych dokumentów, ze wskazaniem miejsca, z którego pochodzi.",
  demo: {
    tytul: "Od pytania do odpowiedzi",
    kroki: [
      {
        nazwa: "Pytanie",
        ladunek: "zdanie od osoby",
        opis: "Pytanie z czatu, komunikatora albo maila.",
      },
      {
        nazwa: "Wyszukanie",
        ladunek: "fragmenty dokumentów",
        opis: "Asystent szuka w zbiorach, do których ma dostęp.",
      },
      {
        nazwa: "Odpowiedź",
        ladunek: "tekst i źródło",
        opis: "Odpowiedź powstaje z tych fragmentów, z odnośnikiem do pliku.",
        wyjatek: "brak podstawy w dokumentach → asystent mówi, że nie wie",
      },
      {
        nazwa: "Sprawdzenie",
        ladunek: "jedno kliknięcie",
        opis: "Osoba pytająca otwiera źródło i widzi pełny kontekst.",
      },
      {
        nazwa: "Przekazanie",
        ladunek: "sprawa u człowieka",
        opis: "Trudne sprawy idą do osoby odpowiedzialnej za obszar.",
        wyjatek: "pytanie bez pokrycia → trafia na listę braków w dokumentacji",
      },
    ],
    zasada:
      "Asystent nie odpowiada z pamięci modelu. Odpowiedź bez źródła w Waszych dokumentach po prostu nie powstaje.",
  },
  wchodzi: ["instrukcje i procedury", "umowy i cenniki", "dokumentacja techniczna", "uprawnienia: kto co widzi"],
  wychodzi: [
    "odpowiedź z odnośnikiem do źródła",
    "lista pytań bez pokrycia w dokumentach",
    "sprawy przekazane do właściwych osób",
  ],
  zadania: [
    "Odpowiedzi o procedury i instrukcje stanowiskowe.",
    "Wyszukanie zapisu w umowie albo cenniku.",
    "Jedno miejsce zamiast krążenia po katalogach.",
    "Lista braków w dokumentacji, zebrana z pytań.",
    "Dostęp ograniczony do wybranych zbiorów.",
  ],
  czegoNieRobi: [
    "Nie odpowiada spoza wskazanych dokumentów.",
    "Nie podejmuje decyzji za zespół.",
    "Nie uzupełnia tego, o czym dokument milczy.",
  ],
  start: {
    zdanie: "Najmniejsza wersja to jeden zbiór dokumentów i jeden zespół.",
    kroki: [
      "Wskazujecie katalog i uprawnienia do niego.",
      "Asystent odpowiada wyłącznie z tego zbioru.",
      "Po tygodniu patrzymy na pytania bez odpowiedzi.",
    ],
  },
  faq: [
    {
      pytanie: "Czy nasze dokumenty trafią do modelu językowego?",
      odpowiedz:
        "Tylko w zakresie, na który się zgodzicie, i tylko te fragmenty, które są potrzebne do odpowiedzi. Dostawcę, miejsce przetwarzania i zakres ustalamy przed startem i zapisujemy w umowie.",
    },
    {
      pytanie: "Skąd wiadomo, że odpowiedź nie jest zmyślona?",
      odpowiedz:
        "Każda odpowiedź ma odnośnik do dokumentu i miejsca w nim. Gdy w dokumentach nie ma podstawy, asystent mówi wprost, że nie wie, i przekazuje sprawę człowiekowi.",
    },
    {
      pytanie: "Czy to zadziała na skanach i plikach PDF?",
      odpowiedz:
        "Tak, choć skany wymagają odczytu tekstu, a wynik zależy od jakości skanu. Dokumenty nieczytelne wskazujemy na starcie, zamiast udawać, że asystent je rozumie.",
    },
  ],
  cta: "Powiedzcie, o co Wasz zespół pyta najczęściej.",
  sasiedzi: [
    { slug: "generatory", powod: "z odpowiedzi często powstaje dokument" },
    { slug: "integracje", powod: "asystent sięga do danych z systemów" },
    { slug: "magazyn", powod: "pytania o stan i dostawy wracają najczęściej" },
  ],
};

export const generatory: Dzial = {
  slug: "generatory",
  url: "/generator-dokumentow",
  nazwa: "Generatory dokumentów",
  h1: "Dokument powstaje z danych",
  tytul: "Generator dokumentów: oferty, umowy, protokoły | Klarow",
  opis:
    "Oferta, umowa i protokół powstają z danych, które już macie. Schemat pokazuje drogę od wybrania danych do wysyłki i podpisu.",
  lead:
    "Oferta, umowa albo protokół składa się z danych, które już macie — a nie z kopiowania poprzedniego pliku.",
  demo: {
    tytul: "Od danych do wysłanego dokumentu",
    kroki: [
      {
        nazwa: "Dane",
        ladunek: "klient i pozycje",
        opis: "Dane klienta i pozycje wchodzą z CRM, arkusza albo formularza.",
      },
      {
        nazwa: "Wzór",
        ladunek: "szablon i warunki",
        opis: "Szablon dobiera sekcje pod typ zlecenia i wariant umowy.",
        wyjatek: "nietypowy zapis → miejsce na własny akapit, reszta bez zmian",
      },
      {
        nazwa: "Wyliczenia",
        ladunek: "ceny i terminy",
        opis: "Ceny, rabaty i terminy liczą się z cennika, nie z pamięci.",
      },
      {
        nazwa: "Sprawdzenie",
        ladunek: "podgląd do akceptacji",
        opis: "Dokument czeka na przejrzenie i akceptację przed wysyłką.",
        wyjatek: "kwota powyżej progu → dodatkowa akceptacja",
      },
      {
        nazwa: "Wysyłka",
        ladunek: "PDF i ślad",
        opis: "PDF idzie mailem, kopia ląduje w katalogu i w rejestrze.",
      },
    ],
    zasada:
      "Dokument nigdy nie powstaje z kopii poprzedniego pliku. Każda liczba pochodzi z danych i z cennika, więc stara stawka nie przechodzi dalej przez przypadek.",
  },
  wchodzi: ["dane klienta z CRM albo arkusza", "cennik i tabela rabatów", "szablony i warianty zapisów", "dane techniczne zlecenia"],
  wychodzi: [
    "PDF z jednolitym układem i numeracją",
    "kopia w katalogu i w rejestrze",
    "wersje dokumentu z historią zmian",
    "gotowy mail z załącznikiem",
  ],
  zadania: [
    "Oferta z aktualnego cennika, nie z zeszłorocznego pliku.",
    "Umowa złożona z zatwierdzonych zapisów.",
    "Protokół odbioru ze zdjęciami z budowy.",
    "Seria dokumentów dla listy klientów naraz.",
    "Jednakowa numeracja i jeden układ w całej firmie.",
  ],
  czegoNieRobi: [
    "Nie pisze treści od zera. Składa z zatwierdzonych bloków.",
    "Nie zastępuje prawnika przy nietypowych zapisach.",
    "Nie wysyła nic bez akceptacji.",
  ],
  start: {
    zdanie: "Najmniejsza wersja to jeden dokument, który powstaje u Was najczęściej.",
    kroki: [
      "Bierzemy jeden wzór, na przykład ofertę.",
      "Podpinamy cennik i dane klienta.",
      "Pierwszy dokument idzie z podglądem do akceptacji.",
    ],
  },
  faq: [
    {
      pytanie: "Czy dokument będzie wyglądał jak nasz?",
      odpowiedz:
        "Tak. Wychodzimy od Waszego istniejącego wzoru: układ, logo, numeracja i stopka zostają. Zmienia się tylko to, skąd biorą się dane w środku.",
    },
    {
      pytanie: "Co z nietypowymi zapisami w umowach?",
      odpowiedz:
        "Szablon ma miejsca na własny akapit, a reszta dokumentu zostaje bez zmian. Nietypowy zapis dopisuje osoba, która za niego odpowiada, i to ona go akceptuje.",
    },
    {
      pytanie: "Czy da się generować dokumenty seriami?",
      odpowiedz:
        "Tak, dla listy klientów albo zleceń naraz. Przed wysyłką dostajecie podgląd całej paczki, więc błąd w danych widać przed wysłaniem, a nie po.",
    },
  ],
  cta: "Przyślijcie wzór dokumentu, który składacie najczęściej.",
  sasiedzi: [
    { slug: "czat-ai", powod: "asystent podpowiada, co wpisać w dokument" },
    { slug: "ksiegowosc", powod: "wystawiony dokument wraca jako koszt" },
    { slug: "integracje", powod: "dane do dokumentu leżą w systemach" },
  ],
};

export const raporty: Dzial = {
  slug: "raporty",
  url: "/raporty-automatyczne",
  nazwa: "Raporty",
  h1: "Raport czeka gotowy",
  tytul: "Raporty automatyczne: zestawienia bez sklejania | Klarow",
  opis:
    "Zestawienie zbiera się samo z kilku źródeł i przychodzi o ustalonej godzinie. Schemat pokazuje, co dzieje się między źródłem a wysłanym raportem.",
  lead:
    "Zestawienie zbiera się samo z kilku źródeł i czeka gotowe o ustalonej godzinie — razem z informacją, czego w nim brakuje.",
  demo: {
    tytul: "Od źródeł do gotowego raportu",
    kroki: [
      {
        nazwa: "Źródła",
        ladunek: "systemy i arkusze",
        opis: "Dane schodzą z ERP, arkuszy i plików z banku.",
      },
      {
        nazwa: "Uzgodnienie",
        ladunek: "wspólne pojęcia",
        opis: "Nazwy, okresy i jednostki sprowadzamy do jednego słownika.",
        wyjatek: "rozjazd między źródłami → widoczny w raporcie, nie zamiatany",
      },
      {
        nazwa: "Liczenie",
        ladunek: "wskaźniki",
        opis: "Marża, zaległości i wykonanie planu liczą się jedną regułą.",
      },
      {
        nazwa: "Kontrola",
        ladunek: "test sensowności",
        opis: "Liczby spoza spodziewanego zakresu podnoszą ostrzeżenie.",
        wyjatek: "brak danych ze źródła → raport idzie z adnotacją, nie po cichu",
      },
      {
        nazwa: "Dostawa",
        ladunek: "mail o 7:00",
        opis: "Raport przychodzi mailem albo czeka na pulpicie.",
      },
    ],
    zasada:
      "Raport pokazuje też własne braki. Gdy jedno źródło milczy, dostajecie zestawienie z adnotacją zamiast ładnej liczby bez pokrycia.",
  },
  wchodzi: ["dane z ERP i magazynu", "arkusze zespołów", "wyciągi i płatności", "plan albo budżet na okres"],
  wychodzi: [
    "raport o ustalonej godzinie",
    "ta sama liczba dla wszystkich działów",
    "ostrzeżenia o wartościach spoza zakresu",
    "adnotacja o brakujących źródłach",
  ],
  zadania: [
    "Poniedziałkowy raport sprzedaży bez sklejania w piątek.",
    "Zaległości i wiekowanie należności.",
    "Marża na zleceniu, gdy koszty są w kilku miejscach.",
    "Wykonanie planu na dziś, nie na zeszły miesiąc.",
    "Jeden komplet definicji dla całej firmy.",
  ],
  czegoNieRobi: [
    "Nie naprawia danych u źródła. Pokazuje rozjazdy.",
    "Nie zastępuje analizy. Podaje liczby, wnioski są Wasze.",
    "Nie prognozuje bez uzgodnionej podstawy.",
  ],
  start: {
    zdanie: "Najmniejsza wersja to jeden raport, który dziś ktoś skleja ręcznie.",
    kroki: [
      "Bierzemy raport, na który czekacie najczęściej.",
      "Uzgadniamy definicje: co liczymy i za jaki okres.",
      "Pierwsza wysyłka idzie o ustalonej godzinie.",
    ],
  },
  faq: [
    {
      pytanie: "Co, gdy dane w dwóch systemach się nie zgadzają?",
      odpowiedz:
        "Raport pokazuje rozjazd zamiast go zamiatać: widzicie obie wartości i źródło każdej z nich. Dopiero wtedy da się rozstrzygnąć, która strona wymaga poprawki.",
    },
    {
      pytanie: "Czy musimy zmieniać arkusze, w których pracujemy?",
      odpowiedz:
        "Nie. Najczęściej czytamy je takie, jakie są. Prosimy tylko o stałe nazwy kolumn i stałe miejsce pliku, bo po tym raport je odnajduje.",
    },
    {
      pytanie: "W czym dostaniemy raport?",
      odpowiedz:
        "W tym, czego już używacie: mail z załącznikiem, arkusz, PDF albo pulpit w przeglądarce. Nie zmuszamy nikogo do logowania się do nowego programu, żeby zobaczyć jedną liczbę.",
    },
  ],
  cta: "Powiedzcie, na który raport czekacie najdłużej.",
  sasiedzi: [
    { slug: "ksiegowosc", powod: "koszty muszą wejść do zestawienia" },
    { slug: "integracje", powod: "dane leżą w kilku systemach" },
    { slug: "magazyn", powod: "stany i braki wchodzą do raportu" },
  ],
};
export const dzialyPodstrony: Dzial[] = [magazyn, ksiegowosc, integracje, czatAi, generatory, raporty];

/** Adres działu: własna podstrona, jeśli już istnieje, w przeciwnym razie kotwica na rozdrożu. */
export const adresDzialu = (slug: string): string =>
  dzialyPodstrony.find((d) => d.slug === slug)?.url ?? `/przyklady#${slug}`;

/** Czy dział ma już własną podstronę (rozdroże dokłada wtedy link „zobaczcie, jak płyną dane"). */
export const maPodstrone = (slug: string): boolean => dzialyPodstrony.some((d) => d.slug === slug);
