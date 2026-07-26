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
      pl: "Porządek w danych dla firm 20–250 osób wyrosłych na Excelu. 12 działających demo: raport zarządczy, importy ERP, audyt danych, płatności. Dane zostają u Ciebie.",
      en: "Order in the data of 20–250-person companies that grew up on Excel. 12 live demos: board report, ERP imports, data audit, payments. Your data stays with you.",
    },
  },
  tools: {
    title: {
      pl: "Narzędzia Klarow — 12 działających demo online",
      en: "Klarow tools — 12 live online demos",
    },
    description: {
      pl: "Raport zarządczy, audyt danych, importy ERP, kontroling kosztów, płatności — 12 narzędzi działających na żywo w przeglądarce. On-premise, dane zostają u Ciebie.",
      en: "Board report, data-quality audit, ERP imports, cost control, payments — 12 tools running live in your browser. On-premise, your data stays with you.",
    },
  },
  oferta: {
    title: {
      pl: "Oferta Klarow: Pilot na kopii — efekt w dni",
      en: "Klarow offer: Pilot on a copy — results in days",
    },
    description: {
      pl: "Jeden proces, stała cena, ≤10 dni roboczych. Budujemy na kopii Twoich plików, pierwszy efekt w dniu 5, płatność 50/50. Twoje dane nie opuszczają firmy.",
      en: "One process, a fixed price, ≤10 business days. We build on a copy of your files, first result on day 5, 50/50 payment. Your data never leaves your company.",
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
