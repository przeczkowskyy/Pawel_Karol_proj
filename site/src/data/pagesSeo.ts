/* SEO tras nie-narzędziowych: JEDNO źródło title i description, konsumowane
   przez klientowy <Seo> (App.tsx) i przez prerender (src/prerender/entry.tsx).
   Dzięki temu meta w statycznym HTML i po starcie Reacta są IDENTYCZNE.

   Limity twarde (reguła seo-pageseo-single-source): title ≤ 60 znaków
   (Google ucina ~55–60), description 130–165 znaków, w OBU językach, zero
   długiej pauzy typograficznej. Nazwa marki w title jako „Klarow”, nie wordmark wersalikami.
   PL jest kanoniczne (crawler bez localStorage renderuje PL); EN ożyje dla
   Google przy trasach /pl/ i /en/ (plan §4.2), na razie służy przełącznikowi
   i botom bez JS.

   Zdanie marki: description strony głównej zawiera MESSAGING.oneLiner
   DOSŁOWNIE (reguła copy-one-liner-single-source). Literał zamiast sklejki
   jest świadomy: limit 130–165 znaków liczy się po znakach, a .slice()
   uciąłby zdanie w połowie.

   Zakazane w meta: „wdrożenie w dni” jako obietnica globalna
   (copy-honest-time-claims), Excel jako tożsamość firmy
   (copy-excel-as-symptom-not-identity). */

import { MESSAGING } from "@/data/messaging";

export interface PageSeo {
  title: { pl: string; en: string };
  description: { pl: string; en: string };
  /** trasa poza indeksem: <meta name="robots" content="noindex, follow">
   *  i brak wpisu w sitemap.xml (seo-404-noindex-real-404, /rodo do przeglądu radcy) */
  noindex?: true;
}

/** Klucze tras, które mają własny plik HTML w prerenderze.
 *  `notFound` to dist/404.html: plik istnieje, ale nie jest trasą w sitemapie. */
export type PageKey = "home" | "tools" | "oferta" | "faq" | "rodo" | "notFound";

export const PAGES_SEO: Record<PageKey, PageSeo> = {
  home: {
    title: {
      pl: "Klarow: narzędzia pod Twój proces. Działają w dni.",
      en: "Klarow: tools built around your process, in days.",
    },
    /* pierwsze zdanie PL i EN = MESSAGING.oneLiner znak w znak */
    description: {
      pl: "Narzędzia pod Twój proces. Działają w dni, dane zostają u Ciebie. Kontroling, integracje (KSeF), importy z ERP, obieg dokumentów, panele.",
      en: "Tools built around your process. Working in days, your data stays with you. Controlling, KSeF, ERP imports, document workflows, panels.",
    },
  },
  tools: {
    title: {
      pl: "Realizacje i dema Klarow: 13 narzędzi do otwarcia",
      en: "Klarow work and demos: 13 tools you can open",
    },
    description: {
      pl: "Raport zarządczy, kontroling kosztów, integracja z KSeF, importy z ERP, płatności i obieg dokumentów. Każde otwierasz i liczysz na danych przykładowych.",
      en: "Management report, cost controlling, KSeF integration, ERP imports, payments and document workflows. Open any of them and compute on sample data.",
    },
  },
  oferta: {
    title: {
      pl: "Oferta Klarow: pilot na kopii Twoich danych",
      en: "Klarow offer: a pilot on a copy of your data",
    },
    description: {
      pl: "Pilot na kopii: jeden proces, do 10 dni roboczych, pierwszy efekt w dniu 5, płatność 50/50. Wycena po bezpłatnej diagnozie. Dane nie opuszczają firmy.",
      en: "Pilot on a copy: one process, within 10 business days, first result on day 5, 50/50 payment. Price set after a free diagnosis. Data never leaves you.",
    },
  },
  faq: {
    title: {
      pl: "FAQ Klarow: bezpieczeństwo danych, koszt, ERP",
      en: "Klarow FAQ: data security, cost, your ERP",
    },
    description: {
      pl: "Odpowiedzi na najczęstsze obiekcje: bezpieczeństwo danych, koszt pilota, zgodność z Twoim ERP i los działających makr. Dane zostają u Ciebie, on-premise.",
      en: "Answers to the usual objections: data security, pilot cost, fit with your ERP and the fate of macros that work. Your data stays with you, on-premise.",
    },
  },
  rodo: {
    title: {
      pl: "RODO: skąd mamy Twoje dane i jak je usunąć",
      en: "GDPR: where your data comes from and how to delete it",
    },
    description: {
      pl: "Skąd mamy Twoje dane, po co je przetwarzamy, jak długo je trzymamy i jak jednym mailem wnieść sprzeciw wobec kontaktu. Klauzula z art. 14 RODO.",
      en: "Where your data comes from, why we process it, how long we keep it and how to object to sales contact in one email. Notice under Article 14 GDPR.",
    },
    noindex: true,
  },
  notFound: {
    title: {
      pl: "Nie ma takiej strony | Klarow",
      en: "There is no such page | Klarow",
    },
    description: {
      pl: "Pod tym adresem nie ma strony. Sprawdź pisownię albo przejdź do realizacji i dem: kontroling, integracje, importy z ERP, obieg dokumentów, panele.",
      en: "There is no page at this address. Check the spelling or go to our work and demos: controlling, integrations, ERP imports, document workflows, panels.",
    },
    noindex: true,
  },
};

/* Mikro-copy tras, które nie mają własnego modułu danych. Mieszka tutaj, a nie
   przy komponencie, bo te same zdania renderuje React (App.tsx) i statyczny
   shell prerendera (prerender/entry.tsx): jedno źródło, dwie powierzchnie
   (code-single-source-copy). Etykieta linku do realizacji przychodzi
   z MESSAGING.cta.secondary, żeby nie tworzyć drugiej wersji tego CTA. */

export const SKIP_LINK = {
  pl: "Przejdź do treści",
  en: "Skip to content",
} as const;

export const NOT_FOUND_COPY = {
  h1: { pl: "Nie ma takiej strony.", en: "There is no such page." },
  line: {
    pl: "Sprawdź adres albo przejdź do realizacji.",
    en: "Check the address or go to our work.",
  },
  toTools: MESSAGING.cta.secondary,
  toHome: { pl: "Strona główna", en: "Home page" },
} as const;
