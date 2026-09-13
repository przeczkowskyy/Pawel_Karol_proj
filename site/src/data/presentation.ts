/* Treść ośmiu scen prezentacji klarow.com. JEDNO źródło dla komponentów scen
 * i dla shellu prerendera.
 *
 * Decyzja foundera z 2026-09-13: „Chciałbym żeby to była prezentacja. Jedna wielka
 * animacja wraz ze scrollowaniem, broszura. Bez zakładek, bez niczego." Wcześniej
 * dwa razy padło „za dużo tekstu". Stąd twardy limit tego pliku:
 *
 *   NA SCENĘ PRZYPADA JEDNO ZDANIE.
 *
 * Nie akapit, nie trzy punkty. Zdanie, które widz przeczyta w dwie sekundy, bo
 * przewija. Limity egzekwowane przy przeglądzie:
 *   headline  <= 9 słów, jedno zdanie,
 *   sub       <= 14 słów i TYLKO wtedy, gdy scena bez niego nie ma sensu,
 *   caption   <= 7 słów, bez kropki na końcu (to podpis liczby, nie zdanie).
 * Kto chce coś dopisać, najpierw niech coś usunie.
 *
 * LICZBY. Każda ma wiersz w `.claude/skills/klarow-guardian/references/allowed-numbers.md`
 * i lustro w `MESSAGING.allowedNumbers`. Liczba bez źródła nie wchodzi na ekran,
 * nawet jeśli „wszyscy ją znają". Zakazane mimo pokusy: procent oszczędności bez
 * pomiaru u klienta, „raport Deloitte o czasie w Excelu" (nie ma oryginału),
 * framing odejmowania etatu, kwoty za nasze usługi.
 *
 * SCENY 7 I 8 NIE MAJĄ WŁASNEGO COPY. Zdania efektu stoją w `data/home.ts`,
 * zdania zamknięcia w `data/messaging.ts`. Ten plik je IMPORTUJE, nie przepisuje:
 * kopia zdania marki to błąd, nawet gdy brzmi identycznie. Gdy `pages/Home.tsx`
 * przestanie istnieć, cztery linie efektu PRZENIEŚ tutaj i usuń import z home.ts
 * (nie duplikuj ich wcześniej, bo wtedy rozjadą się po pierwszej korekcie).
 */

import { MESSAGING } from "./messaging";
import { OUTCOMES } from "./home";

export type Bilingual = { pl: string; en: string };

/** Osiem beatów scenariusza (`docs/plan/prezentacja-scenariusz.md`), w kolejności. */
export type SceneId =
  | "hook"
  | "scale"
  | "time"
  | "cost"
  | "turn"
  | "proof"
  | "outcome"
  | "contact";

/** Jednostka liczby. Zapis buduje formatter w `presentation/scenes/format.ts`,
 *  osobno dla PL i EN, żeby w danych nie leżał gotowy string „121 000 zł"
 *  (jedna liczba, jedno miejsce; separator tysięcy zależy od języka). */
export type FigureUnit = "percent" | "pln" | "plain";

export interface SceneFigure {
  /** wartość końcowa licznika. Brak = liczbę podaje komponent, bo zna ją z danych
   *  (scena „proof" liczy pozycje w `tools.ts`, więc nie wolno jej tu wpisać z ręki). */
  to?: number;
  unit: FigureUnit;
  /** „≈" przed liczbą: wynik jest przybliżeniem, nie kwotą z faktury */
  approx?: boolean;
  /** DZIAŁANIE, z którego bierze się liczba, widoczne obok wyniku.
   *  Czytelnik ma móc sprawdzić rachunek, a nie uwierzyć w wynik. */
  math?: Bilingual;
  /** co ta liczba mierzy */
  caption: Bilingual;
}

export interface Scene {
  id: SceneId;
  headline: Bilingual;
  sub?: Bilingual;
  figure?: SceneFigure;
  /** skąd liczba; renderowane pod sceną drobnym stopniem. Jeden string na obie
   *  wersje językowe: nazwisko, instytucja i rok wydania nie mają tłumaczenia. */
  source?: string;
  /** wiersze efektu (tylko scena „outcome"); jedyne źródło: `data/home.ts` */
  beats?: readonly { icon: string; pl: string; en: string }[];
  /** etykieta przycisku (tylko scena „contact"); jedyne źródło: `MESSAGING.cta` */
  cta?: Bilingual;
}

export const SCENES = [
  /* 1. HAK. Zdanie o widzu, nie o nas. Nikt nie kwestionuje, że działa na plikach,
     więc scena nie musi niczego dowodzić: ma tylko ustawić temat. */
  {
    id: "hook",
    headline: {
      pl: "Twoja firma działa na plikach.",
      en: "Your company runs on files.",
    },
  },

  /* 2. SKALA CHAOSU. Liczba jest tu bohaterem, zdanie tylko ją nazywa. Panko to
     jedyne recenzowane źródło, do którego dotarliśmy, więc stoi na ekranie razem
     z liczbą, a nie w przypisie na dole strony. */
  {
    id: "scale",
    headline: {
      pl: "To nie jest wyjątek, to reguła.",
      en: "This is not the exception, it is the rule.",
    },
    figure: {
      to: 88,
      unit: "percent",
      caption: {
        pl: "arkuszy kalkulacyjnych zawiera błąd w formule",
        en: "of spreadsheets contain a formula error",
      },
    },
    source: "Panko, University of Hawai'i, „What We Know About Spreadsheet Errors”",
  },

  /* 3. KOSZT CZASU. Bez liczby, bo nie zmierzyliśmy jej u klienta, a „X godzin
     tygodniowo" bez pomiaru jest zmyśleniem. Zdanie mówi tyle, ile wiadomo. */
  {
    id: "time",
    headline: {
      pl: "Zamknięcie miesiąca zjada tygodnie.",
      en: "Month-end close eats weeks.",
    },
  },

  /* 4. KOSZT PIENIĘDZY. Pokazujemy DZIAŁANIE, nie sam wynik: mediana razy dwanaście
     miesięcy razy składki. Kto chce, przeliczy w dwie sekundy i zobaczy, że nic tu
     nie jest naciągnięte.
     TON: to nie jest zarzut wobec kontrolera. Firma, która go zatrudniła, właśnie
     wybrała człowieka. Zdanie mówi, na co ma iść jego czas, i nigdy nie sugeruje,
     że kogoś da się odjąć. */
  {
    id: "cost",
    headline: {
      pl: "Ten etat ma kupować analizę, nie sklejanie arkuszy.",
      en: "That role should buy analysis, not spreadsheet stitching.",
    },
    figure: {
      to: 121000,
      unit: "pln",
      approx: true,
      math: {
        pl: "8 350 × 12 × 1,2048",
        en: "8,350 × 12 × 1.2048",
      },
      caption: {
        pl: "tyle rocznie kosztuje etat kontrolera",
        en: "the yearly cost of one controller role",
      },
    },
    source:
      "mediana 8 350 zł brutto: Sedlak & Sedlak, OBW 2026; składki pracodawcy 20,48 %: ZUS 2026",
  },

  /* 5. ZWROT. Pierwsze zdanie o nas w całej prezentacji, dopiero w piątej scenie.
     „Zamiast poprawiać plik" odcina nas od konsultantów, którzy porządkują arkusz
     i zostawiają ten sam arkusz. Podlinia niesie mechanikę pilotu: kopia danych
     i termin, czyli jedyne dwie rzeczy, o które klient pyta na tym etapie. */
  {
    id: "turn",
    headline: {
      pl: "Zamiast poprawiać plik, budujemy narzędzie.",
      en: "Instead of patching the file, we build the tool.",
    },
    sub: {
      pl: "Pod Twój proces, na kopii Twoich danych, do 10 dni.",
      en: "Around your process, on a copy of your data, within 10 days.",
    },
  },

  /* 6. DOWÓD. Trzynaście ekranów stoi na ekranie, więc liczba nie potrzebuje
     przypisu: widz może je policzyć. Dlatego `source` jest tu celowo pusty,
     a wartość licznika bierze się z `tools.ts`, nie z literału. */
  {
    id: "proof",
    headline: {
      pl: "Każdy z tych ekranów liczy naprawdę.",
      en: "Every one of these screens really computes.",
    },
    figure: {
      unit: "plain",
      caption: {
        pl: "narzędzi na danych przykładowych",
        en: "tools running on sample data",
      },
    },
  },

  /* 7. EFEKT. Zero własnego copy: cztery zdania przychodzą z `home.ts`, gdzie
     przeszły już przegląd. Nagłówek też stamtąd, żeby nie powstała druga wersja
     tego samego tytułu. */
  {
    id: "outcome",
    headline: OUTCOMES.title,
    beats: OUTCOMES.items,
  },

  /* 8. KONTAKT. Zdanie zamknięcia i etykieta przycisku są zdaniami marki
     (`copy-one-liner-single-source`, `copy-cta-labels`): importujemy je, nigdy
     nie przepisujemy. Wariantów w rodzaju „Skontaktuj się" nie tworzymy. */
  {
    id: "contact",
    headline: MESSAGING.closing.title,
    sub: MESSAGING.closing.lead,
    cta: MESSAGING.cta.primary,
  },
] as const satisfies readonly Scene[];

/** Kolejność scen jako typ: silnik prezentacji nie może pominąć ani przestawić beatu. */
export type SceneData = (typeof SCENES)[number];

/** Dokładny kształt JEDNEJ sceny: `scene("cost").figure` jest typu `SceneFigure`,
 *  a nie `SceneFigure | undefined`, bo krotka `SCENES` zna swoją zawartość. */
export type SceneOf<K extends SceneId> = Extract<SceneData, { id: K }>;

/* Rzutowanie jest bezpieczne: `SCENES` jest krotką z `as const`, w której każdy
   identyfikator z `SceneId` występuje dokładnie raz (gdyby któryś zniknął,
   `Extract` dałby `never` i wywołanie przestałoby się kompilować). TypeScript nie
   potrafi tego udowodnić przez `.find`, stąd jedno jawne rzutowanie w jednym
   miejscu zamiast ośmiu wykrzykników w scenach. */
/** Scena po identyfikatorze. Czysta funkcja, zero stanu. */
export function scene<K extends SceneId>(id: K): SceneOf<K> {
  return SCENES.find((s) => s.id === id) as SceneOf<K>;
}
