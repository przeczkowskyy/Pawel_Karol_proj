import type { Bilingual } from "./messaging";

/* ── Treść strony głównej v3 ────────────────────────────────────────────────
   JEDNO ŹRÓDŁO dla komponentów Reacta i dla shella prerendera. 13 września
   trasa `/` renderowała co innego niż shell i crawler dostawał inną stronę niż
   człowiek. Dopóki obie warstwy czytają ten moduł, ta awaria nie może wrócić.

   ── CIĘCIE 2026-09-17 ─────────────────────────────────────────────────────
   Karol: „Załadujmy 90% mniej tekstu. (...) Tekstu jest o tonę za dużo."
   Poprzednia wersja miała 1272 słowa w statycznym HTML. Ta ma około 120.

   DLACZEGO TO NIE JEST STRATA SEO, TYLKO PRZENIESIENIE. Długi ogon żyje na
   podstronach, które już go mają i już łapią ruch: `toolsSeo.ts` daje cztery
   pytania i odpowiedzi na każde z trzynastu narzędzi, do tego `/oferta` i `/faq`.
   Strona główna dostaje rolę, którą i tak pełniła lepiej: marka plus linkowanie.
   Ryzyko jest małe i odwracalne — cztery dni temu miała 65 słów.

   CZEGO NIE WOLNO ZROBIĆ: zostawić gęstego shella przy rzadkiej stronie.
   Crawler dostałby wtedy inną treść niż człowiek, a to jest cloaking, nie
   optymalizacja. Shell wypisuje dokładnie te zdania, co komponenty.

   ── OŚ: CZERWONE → ZIELONE ────────────────────────────────────────────────
   Karol: „scrolując próbujmy coś udowodnić". Strona dowodzi jednej rzeczy
   i robi to narzędziami, nie zdaniami: najpierw audyt pokazuje czerwony werdykt
   na danych z zasianymi błędami, potem uzgodnienie pokazuje zielone PASS
   z równaniem zgadzającym się co do grosza.

   To są DWA RÓŻNE narzędzia na dwóch różnych zestawach i tak są podpisane.
   Zdanie „te same dane przed i po" byłoby nieprawdą, a `brand-honest-labels`
   nie pozwala kupować dramaturgii kłamstwem. */

export type HomeBeat = {
  /** kotwica i klucz; kolejność w tablicy = kolejność w dokumencie */
  id: string;
  /** H2, ≤ 6 słów (`copy-minimal-text`) */
  headline: Bilingual;
  /** jedno zdanie i nic więcej; ≤ 16 słów */
  line: Bilingual;
};

/* Hero: cztery elementy tekstowe, ani jednego więcej
   (`design-hero-discipline`). H1 przychodzi z `MESSAGING.oneLiner`. */
export const HOME_HERO = {
  ctaPrimary: { pl: "Wrzuć swój plik", en: "Drop your file" },
  ctaSecondary: { pl: "Umów 30 minut", en: "Book 30 minutes" },
} as const;

/* Dwa uderzenia dowodu. Każde to jeden nagłówek, jedno zdanie i jedno
   DZIAŁAJĄCE narzędzie pod spodem. Żadnych akapitów, żadnych punktów. */
export const HOME_BEATS: readonly HomeBeat[] = [
  {
    id: "audyt",
    headline: { pl: "Tak wyglądają dane dzisiaj", en: "This is your data today" },
    line: {
      pl: "Audyt czyta arkusz i mówi, czego nie wolno publikować.",
      en: "The audit reads the sheet and says what must not be published.",
    },
  },
  {
    id: "uzgodnienie",
    headline: { pl: "Tak wyglądają po przebudowie", en: "This is after the rebuild" },
    line: {
      pl: "Uzgodnienie kończy się dowodem, który zgadza się co do grosza.",
      en: "Reconciliation ends with a proof that matches to the last cent.",
    },
  },
];

/* Przykłady, nie katalog. Karol: „Nie popisujmy się aż tak narzędziami, bo
   możemy zrobić dużo więcej niż to, co przedstawiamy. Parę przykładów
   wymieniamy (...) bez opisów, bez historii."

   Stąd same nazwy i slugi. Opis, tagline i FAQ zostają na podstronach, gdzie
   pracują dla wyszukiwarki; tutaj byłyby tylko szumem. */
export const HOME_EXAMPLES = {
  headline: { pl: "Kilka rzeczy, które zbudowaliśmy", en: "A few things we have built" },
  line: {
    pl: "Katalogu nie mamy. Budujemy pod proces.",
    en: "We have no catalogue. We build around the process.",
  },
  /* TRZY ZRZUTY, NIE TRZYNAŚCIE. Karol: „jedynie parę screenów max z nich,
     bez opisów, bez historii". Wybrane pod RÓŻNORODNOŚĆ OBRAZU, nie pod
     ważność narzędzia: oś czasu to wykres Gantta, kontroling to paski
     i bramka, obieg to macierz czternastu dni. Trzynaście dashboardów dzieli
     ten sam kit, więc zrzuty dobrane po nazwie dałyby trzy podobne ciemne
     prostokąty i cała sekcja wyglądałaby na powielony jeden obraz.

     Świadomie NIE pokazujemy tu audytu ani uzgodnienia: te dwa liczą wyżej
     na żywo, więc zrzut byłby powtórzeniem tego, co widz właśnie widział. */
  shots: ["os-czasu-zadan", "kontroling-kosztow", "obieg-przelewow"],
  /** slugi z `tools.ts`; nazwy bierzemy stamtąd, żeby nie powstała druga lista */
  slugs: [
    "raport-zarzadczy",
    "kontroling-kosztow",
    "import-z-rekoncyliacja",
    "kontroling-ksef",
    "os-czasu-zadan",
    "obieg-przelewow",
  ],
  more: { pl: "Wszystkie narzędzia", en: "All tools" },
} as const;

/** Zamknięcie: jedno zdanie i jeden przycisk (`design-one-cta-per-screen`). */
export const HOME_CLOSING = {
  headline: { pl: "Pokaż nam proces, który boli", en: "Show us the process that hurts" },
  line: {
    pl: "W 30 minut powiemy, co da się z nim zrobić. Także wtedy, gdy odpowiedź brzmi: nic.",
    en: "In 30 minutes we will tell you what can be done. Including when the answer is nothing.",
  },
} as const;
