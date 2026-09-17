import type { Bilingual } from "./messaging";

/* ── Treść strony głównej v3 ────────────────────────────────────────────────
   JEDNO ŹRÓDŁO dla komponentów Reacta i dla shella prerendera.

   PO CO TAK: 13 września trasa `/` renderowała prezentację, a `HomeShell`
   w `prerender/entry.tsx` wypisywał jeszcze poprzednie hero. Crawler bez JS
   dostawał INNĄ stronę niż człowiek i nikt tego nie zauważył, bo build był
   zielony. Dopóki obie warstwy czytają ten sam moduł, ta awaria nie może wrócić.

   ZASADA REDAKCYJNA. Nagłówek jest krótki (`copy-minimal-text`: H2 ≤ 6 słów,
   lead ≤ 20 słów), a gęstość siedzi w `body`. To nie jest kompromis: nagłówek
   ma się przeczytać w locie, a akapit jest tym, co czyta Google i co cytują
   modele językowe. Referencja Karola (`automatyzacje.ai`) ma ~1900 słów na
   jednej stronie i to JEST mechanizm jej pozycji, nie technika.

   LICZBY. Każda pochodzi z `references/allowed-numbers.md`. Na tej stronie żyją
   dokładnie cztery: 13, 12, 88 % (Panko, ze źródłem w zdaniu) i 30 minut.
   Kwoty za usługi są zakazane, „AI" w sprzedaży jest zakazane, pauza „—" też. */

export type HomeSection = {
  /** kotwica i klucz; kolejność w tablicy = kolejność w dokumencie */
  id: string;
  /** H2 (H1 tylko w hero), ≤ 6 słów */
  headline: Bilingual;
  /** jedno zdanie pod nagłówkiem, ≤ 20 słów */
  lead: Bilingual;
  /** akapit 60–140 słów: warstwa SEO i to, co cytują modele */
  body: Bilingual;
  /** rzeczy sprawdzalne; 0–4 pozycje */
  points?: readonly Bilingual[];
};

/* Hero stoi osobno, bo rządzi nim `design-hero-discipline`: dokładnie cztery
   elementy tekstowe (H1, lead, dwa CTA) i realny wizual. Nie ma tu `body`
   ani punktów, i to jest celowe. */
export const HOME_HERO = {
  /** H1 = MESSAGING.oneLiner, nie duplikat: patrz copy-one-liner-single-source */
  ctaPrimary: { pl: "Wrzuć swój plik", en: "Drop your file" },
  ctaSecondary: { pl: "Umów 30 minut", en: "Book 30 minutes" },
  /** podpis pod ramą instrumentu; mówi, że liczby nie są obrazkiem */
  caption: {
    pl: "To nie jest zrzut ekranu. Przesuń suwak tygodnia.",
    en: "This is not a screenshot. Move the week slider.",
  },
} as const;

export const HOME_SECTIONS: readonly HomeSection[] = [
  {
    id: "plik",
    headline: {
      pl: "Sprawdź to na swoim pliku",
      en: "Try it on your own file",
    },
    lead: {
      pl: "Wrzuć arkusz. Liczy się tutaj, w tej karcie przeglądarki.",
      en: "Drop a spreadsheet. It computes here, in this browser tab.",
    },
    body: {
      pl: "Prosimy zwykle o najgorszy arkusz w firmie, bo najgorszy jest najbardziej reprezentatywny: ma sklejone nagłówki, sumy pośrednie wpisane w środek danych i kolumnę, której znaczenie zna jedna osoba. Tutaj możesz to sprawdzić bez rozmowy i bez rejestracji. Narzędzie czyta plik, pokazuje, które wiersze odrzuciło i dlaczego, a potem liczy z niego zestawienie. Wszystko dzieje się w Twojej przeglądarce, więc plik nigdzie nie jest wysyłany. Możesz to sprawdzić w narzędziach programisty: zakładka z ruchem sieciowym zostaje pusta.",
      en: "We usually ask for the worst spreadsheet in the company, because the worst one is the most representative: merged headers, subtotals typed into the middle of the data, and a column whose meaning one person knows. Here you can check it without a call and without signing up. The tool reads the file, shows which rows it rejected and why, then computes a summary from it. Everything happens in your browser, so the file is never uploaded. You can verify that in developer tools: the network tab stays empty.",
    },
    points: [
      {
        pl: "Plik nie opuszcza przeglądarki",
        en: "The file never leaves your browser",
      },
      {
        pl: "Widać, które wiersze odpadły i z jakiego powodu",
        en: "You see which rows dropped out and why",
      },
      {
        pl: "Pod tabelą stoi jawna ścieżka wyliczenia",
        en: "The calculation path is visible under the table",
      },
    ],
  },

  {
    id: "dowod",
    headline: {
      pl: "Kalkulator, nie wróżka",
      en: "A calculator, not a fortune teller",
    },
    lead: {
      pl: "Te same dane dają ten sam wynik. Zawsze, co do grosza.",
      en: "Same data, same result. Always, to the last cent.",
    },
    body: {
      pl: "Badania nad arkuszami kalkulacyjnymi prowadzone przez Raymonda Panko z University of Hawai'i pokazują, że 88 procent arkuszy zawiera błędy w formułach. To nie jest opowieść o niekompetencji, tylko o materiale: arkusz nie ma testów, nie ma historii zmian i nie mówi, kiedy ktoś nadpisał formułę liczbą. Narzędzie, które budujemy, liczy zwykłym, deterministycznym kodem. Nie zgaduje i nie dopowiada. Każdą liczbę da się odtworzyć ręcznie, bo ścieżka wyliczenia jest widoczna, a kwoty liczymy na liczbach całkowitych w groszach, więc sumy zgadzają się co do grosza, a nie w przybliżeniu.",
      en: "Research on spreadsheets by Raymond Panko at the University of Hawai'i shows that 88 percent of spreadsheets contain formula errors. This is not a story about incompetence but about the material: a spreadsheet has no tests, no change history, and never tells you when someone overwrote a formula with a number. The tools we build compute with plain, deterministic code. They do not guess and do not fill in blanks. Every number can be reproduced by hand, because the calculation path is visible, and amounts are computed as integers in cents, so totals match to the last cent rather than approximately.",
    },
    points: [
      {
        pl: "Dwa przebiegi na tych samych danych dają identyczny wynik",
        en: "Two runs on the same data give an identical result",
      },
      {
        pl: "Kwoty liczone w groszach, bez błędu zaokrągleń",
        en: "Amounts computed in cents, with no rounding drift",
      },
      {
        pl: "Uzgodnienie kończy się dowodem PASS albo FAIL, nie opinią",
        en: "Reconciliation ends with a PASS or FAIL proof, not an opinion",
      },
    ],
  },

  {
    id: "narzedzia",
    headline: {
      pl: "Trzynaście narzędzi, wszystkie klikalne",
      en: "Thirteen tools, all clickable",
    },
    lead: {
      pl: "Dwanaście liczy na żywo w tej przeglądarce. Wybierz i sprawdź.",
      en: "Twelve compute live in this browser. Pick one and try it.",
    },
    body: {
      pl: "Nie mamy zamkniętego katalogu produktów, bo procesy w firmach nie są takie same. Jest za to sposób pracy, który powtarza się niezależnie od działu: znaleźć miejsce, w którym dane przechodzą z rąk do rąk, i zastąpić to przejście czymś, co liczy zawsze tak samo. Poniżej stoją narzędzia zbudowane dokładnie w ten sposób, w kontrolingu, finansach, produkcji, danych i administracji. Każde działa na danych przykładowych i każde możesz uruchomić od razu. Trzynaste jest naszym własnym produktem i pracuje na oficjalnym interfejsie Krajowego Systemu e-Faktur.",
      en: "We have no fixed product catalogue, because processes differ from company to company. What repeats is a way of working, regardless of department: find the place where data passes from hand to hand, and replace that handover with something that always computes the same way. Below are tools built exactly like that, across controlling, finance, production, data and administration. Each runs on sample data and each can be started right away. The thirteenth is our own product and works against the official Polish e-invoicing system interface.",
    },
  },

  {
    id: "jak",
    headline: {
      pl: "Jak to wygląda u Ciebie",
      en: "How this works with you",
    },
    lead: {
      pl: "Jeden proces, kopia danych, zamrożony zakres, termin z góry.",
      en: "One process, a copy of the data, frozen scope, a date up front.",
    },
    body: {
      pl: "Zaczynamy od jednego procesu, który realnie boli, i od kopii danych, a nie od audytu całej firmy. Zakres zamrażamy przed startem, więc termin i cena są znane, zanim cokolwiek powstanie. Narzędzie budujemy tak, żeby działało u Was, na Waszej maszynie, i żeby dane nie musiały nigdzie wychodzić. Po zakończeniu zostaje Wam działający program razem z dokumentacją i kodem, a nie dostęp, który wygasa wraz z fakturą. Jeśli po pierwszym procesie uznacie, że to nie jest dla Was, nie ma czego wypowiadać.",
      en: "We start with one process that genuinely hurts, and with a copy of the data, not with an audit of the whole company. Scope is frozen before we start, so the date and the price are known before anything is built. We build the tool to run on your side, on your machine, so the data never has to leave. When it is done you keep a working program together with its documentation and source, not access that expires with an invoice. If after the first process you decide it is not for you, there is nothing to terminate.",
    },
    points: [
      {
        pl: "Zamrożony zakres i termin znany przed startem",
        en: "Frozen scope and a delivery date known before we start",
      },
      {
        pl: "Działa na Waszym sprzęcie, dane zostają u Was",
        en: "Runs on your hardware, the data stays with you",
      },
      {
        pl: "Zostaje program z dokumentacją, nie abonament",
        en: "You keep a program with documentation, not a subscription",
      },
    ],
  },
];

/** Zamknięcie: jedno zdanie i jeden przycisk (`design-one-cta-per-screen`). */
export const HOME_CLOSING = {
  headline: {
    pl: "Pokaż nam proces, który boli",
    en: "Show us the process that hurts",
  },
  lead: {
    pl: "W 30 minut powiemy, co da się z nim zrobić, również wtedy, gdy odpowiedź brzmi: nic.",
    en: "In 30 minutes we will tell you what can be done with it, including when the answer is nothing.",
  },
} as const;
