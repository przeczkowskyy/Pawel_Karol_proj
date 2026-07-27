/* SEO stron głównych (nie-narzędziowych) — JEDNO źródło prawdy dla title/
   description, używane zarówno przez klientowy <Seo> (App.tsx), jak i przez
   prerender (src/prerender/entry.tsx). Dzięki temu meta w statycznym HTML-u
   i po starcie Reacta są IDENTYCZNE (crawler i użytkownik widzą to samo).
   Limity: title ≤60 zn. (Google ucina ~55–60), description ≤165 zn.
   PL jest kanoniczne (crawler bez localStorage renderuje PL); EN ożyje dla
   Google dopiero przy trasach /pl/ /en/ (plan §4.2) — na razie dla przełącznika
   i botów bez JS. */

export interface PageSeo {
  title: { pl: string; en: string };
  description: { pl: string; en: string };
}

export const PAGES_SEO: Record<"home" | "tools" | "oferta" | "faq", PageSeo> = {
  home: {
    title: {
      pl: "Klarow — automatyzacja danych i kontroling. Wdrożenie w dni.",
      en: "Klarow — data automation & controlling. Deployed in days.",
    },
    description: {
      pl: "Custom narzędzia pod Twój proces dla firm wyrosłych na Excelu: kontroling, integracje (KSeF), importy z ERP, obieg dokumentów. Wdrożenie w dni, dane u Ciebie.",
      en: "Custom tools built around your process for companies that grew up on Excel: controlling, integrations (KSeF), ERP imports, document workflows. Deployed in days.",
    },
  },
  tools: {
    title: {
      pl: "Narzędzia Klarow — przykłady realizacji i dema",
      en: "Klarow tools — examples we've built, live demos",
    },
    description: {
      pl: "Przykłady narzędzi, które budujemy: raport zarządczy, kontroling, integracja z KSeF, importy z ERP, płatności. Klikalne dema i wdrożenia. On-premise, dane u Ciebie.",
      en: "Examples of tools we build: board report, controlling, KSeF integration, ERP imports, payments. Clickable demos and client deployments. On-premise, your data stays.",
    },
  },
  oferta: {
    title: {
      pl: "Oferta Klarow: Pilot na kopii — efekt w dni",
      en: "Klarow offer: Pilot on a copy — results in days",
    },
    description: {
      pl: "Pilot na kopii: jeden proces, ≤10 dni roboczych, pierwszy efekt w dniu 5, płatność 50/50. Wycena po bezpłatnej diagnozie. Dane nie opuszczają Twojej firmy.",
      en: "Pilot on a copy: one process, ≤10 business days, first result on day 5, 50/50 payment. Price set after a free diagnosis. Your data never leaves your company.",
    },
  },
  faq: {
    title: {
      pl: "FAQ Klarow — bezpieczeństwo danych, koszt, wdrożenie",
      en: "Klarow FAQ — data security, cost, deployment",
    },
    description: {
      pl: "Odpowiedzi na najczęstsze obiekcje: bezpieczeństwo danych, koszt pilota, zgodność z Twoim ERP, los działających makr. On-premise, wdrożenie w dni.",
      en: "Answers to common objections: data security, pilot cost, compatibility with your ERP, the fate of existing macros. On-premise, deployed in days.",
    },
  },
};
