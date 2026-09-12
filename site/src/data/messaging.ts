/* Zdania marki KLAROW: JEDYNE źródło (plan „strona v2” §1.1–1.4 i §8.3;
   reguła strażnika copy-one-liner-single-source).

   Powierzchnie, które konsumują ten moduł BEZ przepisywania treści:
   1. Hero na „/” (H1 = oneLiner, lead = subtext) i zamknięcie strony (closing).
   2. src/data/pagesSeo.ts: description strony głównej zawiera oneLiner DOSŁOWNIE
      (ręczny literał w limicie 130–165 znaków, nigdy sklejka przez .slice()).
   3. src/components/Seo.tsx: ORG_JSONLD.description = oneLiner + subtext.
   4. src/prerender/entry.tsx: shelle statyczne oraz llms.txt (one-liner, filary,
      etykiety dowodu, kontakt).
   5. site/index.html: fallback meta description, kopia 1:1 tego samego zdania.
   6. post-bot/worker.js (SYSTEM_PROMPT): plik leży poza site/, więc żadna bramka
      go nie pilnuje. Kopiujemy RĘCZNIE w tym samym commicie, z komentarzem
      „messaging.ts@<sha>” nad stałą.
   7. Nagłówki LinkedIn founderów (checklista checklists/messaging-sync.md).

   Zmiana któregokolwiek zdania = jeden commit dotykający wszystkich siedmiu
   powierzchni; audyt porównuje je znak po znaku. Komponent importuje, nie
   przepisuje: lokalna kopia zdania to błąd, nawet gdy brzmi identycznie. */

export interface Bilingual {
  pl: string;
  en: string;
}

export type PillarId = "process" | "days" | "data";

export interface Pillar {
  id: PillarId;
  /** nazwa ikony lucide-react; strokeWidth 1.5 (1.75 dla ikon 16 px) */
  icon: "Blocks" | "CalendarClock" | "ServerOff";
  name: Bilingual;
  text: Bilingual;
}

/** Lustro statusów z references/allowed-numbers.md:
 *  ok        = wolno używać wszędzie w zadeklarowanym scope,
 *  frozen    = zamrożony zestaw anonimowy z poprzedniej firmy: zostaje tam,
 *              gdzie już jest, nie trafia na „/” i nie rośnie do umowy IP,
 *  toConfirm = czeka na potwierdzenie founderów; do tego czasu nie publikujemy. */
export type NumberStatus = "ok" | "frozen" | "toConfirm";

export interface AllowedNumber {
  value: Bilingual;
  label: Bilingual;
  status: NumberStatus;
  /** dowód: plik, repozytorium albo publikacja z rokiem; bez tego pola liczba nie istnieje */
  source: string;
  /** gdzie wolno jej użyć: „home”, „hub”, „oferta”, „faq”, „llms”, slug podstrony */
  scope: readonly string[];
}

export interface Messaging {
  oneLiner: Bilingual;
  subtext: Bilingual;
  pillars: readonly Pillar[];
  determinism: Bilingual;
  zeroVendorCloud: Bilingual;
  cta: { primary: Bilingual; secondary: Bilingual; file: Bilingual };
  closing: { title: Bilingual; lead: Bilingual };
  proofLabels: { demo: Bilingual; product: Bilingual; case: Bilingual };
  allowedNumbers: readonly AllowedNumber[];
  bannedWords: { pl: readonly string[]; en: readonly string[] };
}

/* ZAMROŻONY ZESTAW LICZB Z POPRZEDNIEJ FIRMY (decyzja D-07 b, rejestr §3).
   Nie dodawać nowych pozycji i nie przenosić istniejących na stronę główną:
   czekamy na umowę IP. Zestaw obejmuje: „kilkanaście narzędzi w jednej firmie
   produkcyjno-budowlanej” (jedyna pozycja obecna niżej jako dana, bo stoi na
   pasku liczb), „okolo 10 000 wierszy kosztów z ERP miesięcznie”, „okolo 30
   równoległych projektów”, „raport w kilkanaście sekund zamiast godzin”,
   „klienci w USA”. Te cztery zostają wyłącznie w istniejących opisach podstron
   i w FAQ. Nowa liczba = decyzja founderów w docs/DECISIONS.md + wiersz
   w references/allowed-numbers.md + wpis tutaj, nigdy „z pamięci”. */

/* SŁOWA ZAKAZANE: lista w bannedWords jest świadomie niepełna.
   Reguła copy-banned-claims p. 7 wymaga, żeby bannedWords.pl zawierało także
   frazy ze słowem na „A” („… liczy”, „sztuczna inteligencja analizuje”,
   „inteligentna analiza”, „…-powered”, „asystent …”). Nie wolno ich wpisać
   jako danych: bramka brand-no-ai-word-in-sales (BLOCKER) skanuje literały
   w site/src/data/** i zgłasza każde wystąpienie tego słowa, także wewnątrz
   listy zakazów. Do czasu decyzji właściciela skilla (whitelista bloku
   bannedWords w audit-static.mjs) te frazy żyją w tym komentarzu i obowiązują
   dokładnie tak samo jak lista niżej. */

export const MESSAGING = {
  oneLiner: {
    pl: "Narzędzia pod Twój proces. Działają w dni, dane zostają u Ciebie.",
    en: "Tools built around your process. Working in days, your data stays with you.",
  },

  subtext: {
    pl: "Kontroling, integracje (KSeF, ERP), importy, obieg dokumentów, panele. Dla firm 20–250 osób z produkcji, budownictwa i dystrybucji.",
    en: "Controlling, integrations (KSeF, ERP), imports, document workflows, dashboards. For 20–250-person manufacturing, construction and distribution companies.",
  },

  /* Filary nie stoją w hero (limit 4 elementów). Żyją w sekcji „Kalkulator,
     nie wróżka”, w llms.txt i w opisie Organization w JSON-LD. */
  pillars: [
    {
      id: "process",
      icon: "Blocks",
      name: { pl: "Proces", en: "Process" },
      text: {
        pl: "Pod Twój proces. Bez zamkniętego katalogu.",
        en: "Around your process. No fixed catalogue.",
      },
    },
    {
      id: "days",
      icon: "CalendarClock",
      name: { pl: "Dni", en: "Days" },
      text: {
        pl: "Pierwszy działający efekt w dni.",
        en: "First working result in days.",
      },
    },
    {
      id: "data",
      icon: "ServerOff",
      name: { pl: "Dane", en: "Data" },
      text: {
        pl: "Dane u Ciebie. Liczby bez wróżenia.",
        en: "Data on your premises. Numbers without guesswork.",
      },
    },
  ],

  /* Kanoniczne zdanie o determinizmie. Obowiązuje wszędzie, gdzie pada wyróżnik
     „kalkulator, nie wróżka”: sekcja S7, stopka panelu dema, llms.txt, PDF,
     outbound. Mówi, CO liczy, a nie czego nie ma. */
  determinism: {
    pl: "Twoje liczby liczy zwykły, deterministyczny kod. Te same dane dają ten sam wynik.",
    en: "Your numbers are computed by plain, deterministic code. Same data, same result.",
  },

  zeroVendorCloud: {
    pl: "Dane zostają u Ciebie. Zero chmury dostawcy: nie trafiają do nas ani do żadnej chmury poza systemami, które sam wskażesz.",
    en: "Your data stays with you. Zero vendor cloud: it never reaches us or any cloud beyond the systems you name.",
  },

  /* Jedna etykieta na intencję (copy-cta-labels). Rozmowa, dowód, plik.
     Wariantów nie tworzymy: „Umów bezpłatną diagnozę”, „Skontaktuj się”,
     „Dowiedz się więcej” są zakazane. */
  cta: {
    primary: { pl: "Umów 30 minut", en: "Book 30 minutes" },
    secondary: { pl: "Zobacz realizacje", en: "See our work" },
    file: { pl: "Przyślij najgorszy Excel", en: "Send us your worst spreadsheet" },
  },

  closing: {
    title: {
      pl: "Pokaż nam proces, który boli.",
      en: "Show us the process that hurts.",
    },
    lead: {
      pl: "W 30 minut powiemy, co da się z nim zrobić.",
      en: "In 30 minutes we'll tell you what can be done with it.",
    },
  },

  /* Etykiety dowodu (brand-honest-labels): dokładnie jedna na kartę, zgodna
     z polem kind w tools.ts. „case” wolno użyć dopiero po wpisie w
     docs/DECISIONS.md z datą zgody (umowa IP) albo po udokumentowanym żywym
     przebiegu u klienta Klarow. */
  proofLabels: {
    demo: { pl: "Demo na danych przykładowych", en: "Demo on sample data" },
    product: { pl: "Własny produkt", en: "Own product" },
    case: {
      pl: "Wdrożone w firmie produkcyjno-budowlanej",
      en: "Deployed at a manufacturing & construction company",
    },
  },

  allowedNumbers: [
    {
      value: { pl: "12", en: "12" },
      label: {
        pl: "dem liczy na żywo na tej stronie",
        en: "live demos computing on this site",
      },
      status: "ok",
      source: "tools.ts: 12 wpisów kind: demo, liczone przy buildzie",
      scope: ["home", "hub", "llms"],
    },
    {
      value: { pl: "13", en: "13" },
      label: {
        pl: "realizacji i dem do otwarcia jednym kliknięciem",
        en: "pieces of work and demos, one click each",
      },
      status: "ok",
      source: "tools.ts: 12 demo + 1 własny produkt (KSeF); rośnie z danymi",
      scope: ["home", "hub", "llms"],
    },
    {
      value: { pl: "kilkanaście", en: "a dozen-plus" },
      label: {
        pl: "narzędzi w jednej firmie produkcyjno-budowlanej",
        en: "tools in one manufacturing & construction company",
      },
      status: "frozen",
      source:
        "zamrożony zestaw anonimowy, references/allowed-numbers.md §3; liczba „15” dopiero po umowie IP (D-07)",
      scope: ["home", "faq"],
    },
    {
      value: { pl: "3 dni", en: "3 days" },
      label: {
        pl: "od pierwszej linii kodu do działającego produktu",
        en: "from the first line of code to a working product",
      },
      status: "toConfirm",
      source:
        "git własnego produktu KSeF: 33 commity, 2026-06-14 do 2026-06-16 (portfolio.md §4 S5); Karol potwierdza zakres słowa „działający”",
      scope: ["home", "kontroling-ksef"],
    },
    {
      value: { pl: "co do grosza", en: "to the cent" },
      label: {
        pl: "kontrola sum w każdym imporcie",
        en: "reconciliation in every import",
      },
      status: "ok",
      source: "silniki lib/*.ts: grosze jako liczby całkowite, dowód PASS/FAIL w demie",
      scope: ["home", "hub", "llms"],
    },
    {
      value: { pl: "30 minut", en: "30 minutes" },
      label: {
        pl: "tyle trwa pierwsza rozmowa, bez zobowiązań",
        en: "that is the first call, no commitment",
      },
      status: "ok",
      source: "oferta wejściowa, plan strategiczny §1.4",
      scope: ["cta", "home", "oferta", "faq"],
    },
    {
      value: { pl: "20–250", en: "20–250" },
      label: {
        pl: "osób w firmie: tyle liczy nasz profil klienta",
        en: "people: the size of company we build for",
      },
      status: "ok",
      source: "profil klienta, plan strategiczny §2",
      scope: ["home", "meta", "jsonld", "llms", "oferta"],
    },
    {
      value: { pl: "5–10 dni", en: "5–10 days" },
      label: {
        pl: "pilot na kopii Twoich danych",
        en: "a pilot on a copy of your data",
      },
      status: "ok",
      source: "mechanika pilotu, plan strategiczny §1.4; decyzja D-03 (b)",
      scope: ["hub", "tool", "oferta"],
    },
    {
      value: { pl: "do 10 dni", en: "within 10 days" },
      label: {
        pl: "od startu do odbioru i trybu produkcyjnego",
        en: "from kick-off to sign-off and production mode",
      },
      status: "ok",
      source: "mechanika pilotu (dzień 0, dni 1–4, dzień 5, płatność 50/50), plan strategiczny §1.4",
      scope: ["home", "oferta", "faq"],
    },
    {
      value: { pl: "88 %", en: "88%" },
      label: {
        pl: "arkuszy kalkulacyjnych zawiera błędy w formułach (Panko, University of Hawai'i)",
        en: "of spreadsheets contain formula errors (Panko, University of Hawai'i)",
      },
      status: "ok",
      source:
        "Panko, University of Hawai'i, „What We Know About Spreadsheet Errors” (publikacja recenzowana); cytować razem ze źródłem",
      scope: ["oferta", "audyt-jakosci-danych", "one-pager"],
    },
    {
      value: { pl: "121 tys. zł", en: "PLN 121k" },
      label: {
        pl: "roczny koszt etatu kontrolera: 8 350 × 12 × 1,2048",
        en: "annual cost of one controller role: 8,350 × 12 × 1.2048",
      },
      status: "ok",
      source:
        "mediana wynagrodzenia kontrolera 8 350 zł brutto (Sedlak & Sedlak, OBW 2026) i składki pracodawcy 20,48 % (ZUS 2026); zawsze z działaniem obok wyniku",
      scope: ["oferta", "one-pager"],
    },
  ],

  /* Lista dla bramki copy i dla ludzi piszących teksty. Trzy pierwsze pozycje PL
     („łatwo”, „prosto”, „szybko”) i ich odpowiedniki EN są zakazane WYŁĄCZNIE
     wtedy, gdy obok nie stoi liczba ze źródłem; reszta jest zakazana zawsze. */
  bannedWords: {
    pl: [
      "łatwo",
      "prosto",
      "szybko",
      "intuicyjnie",
      "bezproblemowo",
      "bezszwowo",
      "podnieś na wyższy poziom",
      "uwolnij potencjał",
      "nowej generacji",
      "rewolucjonizuj",
      "game-changer",
      "kompleksowe rozwiązanie",
      "transformacja cyfrowa",
      "w dzisiejszym świecie",
      "bardzo",
      "po prostu",
      "naprawdę",
      "znacząco",
      "wiele firm",
    ],
    en: [
      "easy",
      "simple",
      "quick",
      "elevate",
      "seamless",
      "unleash",
      "next-gen",
      "revolutionize",
      "game-changer",
      "delve",
      "tapestry",
      "in the world of",
      "very",
      "just",
      "really",
    ],
  },
} as const satisfies Messaging;
