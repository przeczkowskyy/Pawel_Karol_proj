/**
 * Treść strony /cv — wersja dowodowa. Strona firmowa pokazuje możliwości, CV pokazuje,
 * co powstało.
 *
 * Granice, których ta strona nie przekracza (zasady 2 i 4 z CLAUDE.md):
 * - żadnej nazwy firmy, klienta ani pracodawcy,
 * - żadnej liczby pochodzącej z cudzych danych,
 * - opisujemy mechanizm narzędzia, nie czyjeś wyniki.
 * Opisy pochodzą z listy narzędzi spisanej przez Karola (archiwum: tag archiwum/strona-v1).
 */

export type Narzedzie = {
  nazwa: string;
  robi: string;
  zamiast: string;
  weWy: string;
};

export type GrupaCv = {
  slug: "kontroling" | "finanse" | "dane" | "produkcja" | "administracja";
  tytul: string;
  ikona: "raporty" | "ksiegowosc" | "integracje" | "magazyn" | "generatory";
  narzedzia: Narzedzie[];
};

export const grupyCv: GrupaCv[] = [
  {
    slug: "kontroling",
    tytul: "Kontroling i raportowanie",
    ikona: "raporty",
    narzedzia: [
      {
        nazwa: "Raport zarządczy",
        robi: "Panel dla zarządu składany z dziesiątek plików jednym przebiegiem: wskaźniki, wykres kosztu wobec zaawansowania na każdym etapie i tabela projektów z komentarzami. Pokazuje etapy, na których marża wycieka, bo koszt wyprzedza postęp.",
        zamiast: "składania raportu w arkuszu co tydzień od nowa: zapytania, przeklejanie, formatowanie, eksport i rozsyłka",
        weWy: "tabela z pliku → wskaźniki, wykres etapowy, tabela i eksport",
      },
      {
        nazwa: "Kontroling kosztów projektu",
        robi: "Widok dla osoby prowadzącej projekt: paski budżetu, wydatku i przekroczenia na każdym etapie, edytowalna estymata do końca, prognoza marży licząca się na bieżąco i bramka „zatwierdź tydzień” z walidacją.",
        zamiast: "pracy wprost w komórkach arkusza, bez walidacji i bez wersji",
        weWy: "budżet, koszt i estymaty → widok kontrolingowy z zatwierdzaniem",
      },
      {
        nazwa: "Kontroling na danych z KSeF",
        robi: "Warstwa kontrolingu nad Krajowym Systemem e-Faktur: integracja z oficjalnym API, pobranie faktur sprzedaży i zakupu, budżet wobec wykonania i rolująca prognoza płynności na trzynaście tygodni. Tylko czyta — żadnej faktury nie wystawia ani nie wysyła.",
        zamiast: "zestawiania faktur z KSeF w arkuszu i szacowania płynności na oko",
        weWy: "faktury z API KSeF + mapa kategorii → budżet wobec wykonania, prognoza i raporty",
      },
    ],
  },
  {
    slug: "finanse",
    tytul: "Finanse i płatności",
    ikona: "ksiegowosc",
    narzedzia: [
      {
        nazwa: "Obieg akceptacji przelewów",
        robi: "Droga od wniosku do przelewu: walidacja, plan czternastodniowy wyliczony z wniosków, decyzja przy każdej pozycji — całość, część albo przeniesienie — i akceptacja na cztery oczy, w której wnioskująca osoba nie jest osobą akceptującą. Każda decyzja zostawia ślad.",
        zamiast: "wniosków o przelew krążących w mailach i planowania płatności ręcznie w arkuszu",
        weWy: "wnioski o wydatek → plan płatności, decyzje i ślad audytowy",
      },
      {
        nazwa: "Kalkulator transz i walut",
        robi: "Rozbija wpłacone transze proporcjonalnie na projekty, z VAT liczonym tak, żeby grosze się nie rozjeżdżały, i pilnuje salda: ile zapłacono, ile zostało. W komplecie przelicznik walut po zadanym kursie.",
        zamiast: "ręcznego liczenia, ile z wpłaty poszło na który projekt",
        weWy: "wpłaty i rozdzielnik projektów → rozpiska transz, saldo i przeliczenie waluty",
      },
      {
        nazwa: "Fakturowanie w formacie AIA G702/G703",
        robi: "Odwzorowanie amerykańskich arkuszy rozliczeniowych: silnik liczy, ile fakturować teraz — wykonanie razy wartość pozycji minus to, co już zafakturowano — pilnuje retencji i progu depozytu, i prowadzi status każdej pozycji.",
        zamiast: "rozproszonych arkuszy i ręcznego liczenia kwoty do wystawienia",
        weWy: "pozycje harmonogramu wartości → propozycja faktury ze statusem pozycji",
      },
    ],
  },
  {
    slug: "dane",
    tytul: "Dane i importy",
    ikona: "integracje",
    narzedzia: [
      {
        nazwa: "Importy z systemu ERP",
        robi: "Rodzina importów — roboczogodziny, materiał, koszty pozostałe, przerób — z klasyfikacją według słownika, który sami ustawiacie, i z pobieraniem wyłącznie nowych wierszy. Tryb testowy pokazuje pełny podgląd zmian przed zapisem, a przed samym zapisem powstaje kopia.",
        zamiast: "przeklejania tysięcy wierszy z ERP i magazynu do plików co tydzień",
        weWy: "eksporty z ERP → sklasyfikowane nowe wiersze w Waszych plikach, z kopią i logiem",
      },
      {
        nazwa: "Import z rekoncyliacją",
        robi: "Wczytuje surowe pliki, liczy różnicę wobec poprzedniej wersji i sprawdza zgodność sum co do grosza, zanim cokolwiek zostanie zatwierdzone. Widać każdą zmianę, a nie tylko wynik końcowy.",
        zamiast: "odświeżania zapytań i wiary na słowo, że przy imporcie nic nie zginęło",
        weWy: "surowe eksporty → podgląd, różnica i zgodność sum → zatwierdzona wersja",
      },
      {
        nazwa: "Audyt jakości danych",
        robi: "Bramka jakości przed raportem albo przed zamknięciem okresu: jednym przebiegiem sprawdza pliki według reguł ustawionych pod Wasze dane — ujemne estymaty, wartości poza zakresem, daty poza okresem — i buduje macierz pewności dla całego portfela naraz. Tylko czyta, niczego nie zmienia.",
        zamiast: "przeglądania czerwonych komórek w każdym pliku po kolei",
        weWy: "pliki budżetowe i operacyjne → raport błędów i macierz pewności",
      },
    ],
  },
  {
    slug: "produkcja",
    tytul: "Produkcja i harmonogram",
    ikona: "magazyn",
    narzedzia: [
      {
        nazwa: "Dashboard produkcji",
        robi: "Cały portfel w jednym kadrze: kafel to obiekt, a na nim wykonanie procentowe, robocizna i status. Wspólny suwak tygodnia przesuwa widok w czasie, a kliknięcie w kafel rozkłada obiekt na etapy. Tylko odczyt — narzędzie niczego nie nadpisuje.",
        zamiast: "przeglądania plików produkcyjnych obiekt po obiekcie i sklejania obrazu całości ręcznie",
        weWy: "dane wykonania na obiekt, etap i tydzień → siatka kafli z rozbiciem etapowym",
      },
      {
        nazwa: "Oś czasu zadań",
        robi: "Każde zadanie jako dwa pasy — harmonogram poprzedni i bieżący — z etykietą obsuwy w dniach. Od razu widać, co przesunęło się od zeszłego tygodnia, zamiast porównywać dwie wersje wzrokiem.",
        zamiast: "zestawiania dwóch wersji harmonogramu na oko",
        weWy: "tygodniowe migawki harmonogramu → oś czasu z obsuwami i eksportem",
      },
    ],
  },
  {
    slug: "administracja",
    tytul: "Administracja i dokumenty",
    ikona: "generatory",
    narzedzia: [
      {
        nazwa: "Protokoły robocizny",
        robi: "Z rejestrów godzin powstają miesięczne protokoły kosztu pracy dla każdego podwykonawcy i idą przez wielostopniową akceptację aż do faktury. Dokument ma jawny cykl życia, a kalendarz pokazuje koszt pracy w czasie.",
        zamiast: "sumowania godzin ręcznie, przeklejania do dokumentu i pilnowania akceptacji w skrzynce",
        weWy: "rejestry godzin → protokoły PDF, statusy akceptacji i kalendarz kosztu",
      },
      {
        nazwa: "Rejestr umów",
        robi: "Elektroniczny rejestr umów ze skanami, historią zmian i dwukierunkową wymianą z arkuszem. Naprawia duplikaty i psujące się ścieżki do plików, eksport chodzi na odnośnikach względnych.",
        zamiast: "pliku z bezwzględnymi odnośnikami do skanów, które psują się przy każdym przeniesieniu",
        weWy: "formularz albo arkusz → rejestr ze skanami i eksport, który się nie rozsypuje",
      },
    ],
  },
];

/** Zasady wyprowadzone wprost z tego, jak te narzędzia są zbudowane — nie z deklaracji. */
export const zasadyCv = [
  {
    tytul: "Dane zostają u Was",
    opis: "Liczenie dzieje się na Waszym sprzęcie albo na Waszym serwerze. Nie buduję narzędzi, które wysyłają Wasze dokumenty na zewnątrz, żeby coś policzyć.",
  },
  {
    tytul: "Czytać, zanim się zapisze",
    opis: "Tam, gdzie błąd kosztuje, narzędzie najpierw tylko czyta: tryb testowy z podglądem zmian, kopia przed zapisem, a przy audytach w ogóle brak prawa zapisu.",
  },
  {
    tytul: "Każdą liczbę da się sprawdzić",
    opis: "Wynik pokazuje ścieżkę wyliczenia, więc da się go przejść ręcznie. Liczby, których nie da się wytłumaczyć, nie trafiają do raportu.",
  },
  {
    tytul: "Widać, kto zdecydował",
    opis: "Akceptacje mają ślad: kto, kiedy i na jakiej podstawie. Przy pieniądzach akceptacja idzie na cztery oczy — wnioskująca osoba to nie ta sama osoba, która zatwierdza.",
  },
];

export const jakPracuje = [
  { tytul: "Rozmowa, 30 minut, bez zobowiązań.", opis: "Pokazujecie proces albo plik, który najbardziej Was męczy." },
  { tytul: "Pilot na kopii danych.", opis: "Na kopii albo w środowisku testowym — gdzie się da, bez dotykania produkcji." },
  { tytul: "Wdrożenie etapami.", opis: "Najpierw to, co boli najbardziej. Termin każdego etapu ustalamy przed startem." },
  { tytul: "Zostaje u Was.", opis: "Po odbiorze dostajecie kod, dostępy i dokumentację. Prawa do kodu przenosimy w umowie." },
];
