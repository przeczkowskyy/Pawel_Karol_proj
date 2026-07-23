/* FAQ landingu = typowe obiekcje + nasze kontry (plan strategiczny §2.5), PL/EN.
   JEDNO źródło prawdy: konsumują je komponent Faq (akordeon), FAQPage JSON-LD
   (GEO — treść cytowalna przez LLM-y) i prerender statycznego HTML. */

export interface FaqEntry {
  id: string;
  q: string;
  a: string;
}

export const FAQ_I18N: { pl: FaqEntry[]; en: FaqEntry[] } = {
  pl: [
    {
      id: "cena",
      q: "„Za drogo.”",
      a: "Sprint kosztuje mniej niż dwa miesięczne koszty etatu kontrolera, a eliminuje jego 3–4 dni pracy co miesiąc — zwraca się przed końcem kwartału. Dla porównania: moduł raportowy ERP to zwykle 6+ miesięcy i kwoty od 100 tys. zł. Nie sprzedajemy godzin — sprzedajemy zamknięty rezultat za stałą cenę.",
    },
    {
      id: "dane",
      q: "„Nasze dane są wrażliwe.”",
      a: "Dlatego nic nie wychodzi z firmy. Narzędzia działają lokalnie, na Waszych komputerach, na Waszych plikach. Po wdrożeniu nie mamy dostępu do danych. Hostowany panel KPI to opcja — i nawet on dostaje wyłącznie zagregowane wskaźniki, które sami zatwierdzicie.",
    },
    {
      id: "custom",
      q: "„Custom software = wolno i drogo.”",
      a: "Custom u nas to tylko cienka warstwa dopasowania. Silnik — bezpieczny zapis, backup, walidacja, log audytowy — jest gotowy i sprawdzony w produkcji. Dlatego stała cena i dni robocze na piśmie, a nie wycena godzinowa bez końca.",
    },
    {
      id: "makro",
      q: "„Zepsujecie nam działające makro.”",
      a: "Nie ruszamy makra. Budujemy obok, na kopii, a Wy porównujecie wyniki nowego i starego na tych samych danych. Stare makro zostaje jako zapas tak długo, jak chcecie. Przed każdym zapisem na oryginale: pełna lista zmian i automatyczny backup.",
    },
    {
      id: "erp",
      q: "„Mamy już ERP.”",
      a: "Świetnie — nie zastępujemy ERP. Automatyzujemy te ~40% pracy, które dzieją się PO eksporcie z niego: przeklejanie, sklejanie, raporty dla zarządu. Wchodzimy tam, gdzie ERP się kończy, a zaczyna Excel.",
    },
    {
      id: "kim",
      q: "„Kim wy w ogóle jesteście?”",
      a: "Zespół, który ten problem rozwiązał od środka w firmie produkcyjno-budowlanej działającej w Polsce i USA — kilkanaście narzędzi na produkcji, import ~10 tys. wierszy miesięcznie, raport zarządczy w kilkanaście sekund. Jesteśmy mali, dlatego dajemy to, czego duzi nie dadzą: kod i dokumentacja zostają u Was, druga rata po działającym odbiorze, a rozmawiacie zawsze z osobą, która narzędzie zbudowała.",
    },
  ],
  en: [
    {
      id: "cena",
      q: "“Too expensive.”",
      a: "A sprint costs less than two monthly salaries of a controller and removes 3–4 days of their work every month — it pays for itself before the quarter ends. For comparison: an ERP reporting module usually means 6+ months and six-figure budgets. We don't sell hours — we sell a finished result at a fixed price.",
    },
    {
      id: "dane",
      q: "“Our data is sensitive.”",
      a: "That's exactly why nothing leaves your company. The tools run locally, on your machines, on your files. After deployment we have no access to your data. The hosted KPI panel is optional — and even it receives only aggregated indicators you approve yourselves.",
    },
    {
      id: "custom",
      q: "“Custom software = slow and expensive.”",
      a: "In our case, custom is just a thin adaptation layer. The engine — safe writes, backup, validation, audit log — is ready and production-proven. That's why you get a fixed price and business days in writing, not an open-ended hourly estimate.",
    },
    {
      id: "makro",
      q: "“You'll break our working macro.”",
      a: "We don't touch the macro. We build alongside, on a copy, and you compare the old and new results on the same data. The old macro stays as a fallback for as long as you want. Before any write to the original: a full change list and an automatic backup.",
    },
    {
      id: "erp",
      q: "“We already have an ERP.”",
      a: "Great — we don't replace your ERP. We automate the ~40% of work that happens AFTER the export: pasting, stitching, management reports. We step in where the ERP ends and Excel begins.",
    },
    {
      id: "kim",
      q: "“Who even are you?”",
      a: "The team that solved this problem from the inside at a manufacturing-and-construction company operating in Poland and the US — a dozen-plus tools in production, ~10k rows imported monthly, a board report in seconds. We're small, so we offer what the big players won't: the code and documentation stay with you, the second instalment is due after a working handover, and you always talk to the person who built the tool.",
    },
  ],
};
