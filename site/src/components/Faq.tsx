import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useAutoAnimate } from "@formkit/auto-animate/react";

/* FAQ = typowe obiekcje + nasze kontry (wprost z planu strategicznego §2.5).
   Akordeon animowany auto-animate — ref na rodzicu zwijanej treści (karta),
   stabilne klucze, rodzic zawsze wyrenderowany, szanuje prefers-reduced-motion. */

const FAQ: { id: string; q: string; a: string }[] = [
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
];

function FaqItem({
  q,
  a,
  open,
  onToggle,
}: {
  q: string;
  a: string;
  open: boolean;
  onToggle: () => void;
}) {
  const [parent] = useAutoAnimate();
  return (
    <div ref={parent} className="card" style={{ padding: 0 }}>
      <button
        type="button"
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left cursor-pointer"
        aria-expanded={open}
        onClick={onToggle}
      >
        <span className="text-[14px] font-bold" style={{ color: "var(--heading)" }}>
          {q}
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          style={{ color: "var(--primary)" }}
        />
      </button>
      {open && (
        <p
          key="answer"
          className="px-5 pb-5 text-[13px] leading-relaxed"
          style={{ color: "var(--muted-foreground)" }}
        >
          {a}
        </p>
      )}
    </div>
  );
}

export default function Faq() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-3">
      {FAQ.map((f) => (
        <FaqItem
          key={f.id}
          q={f.q}
          a={f.a}
          open={openId === f.id}
          onToggle={() => setOpenId(openId === f.id ? null : f.id)}
        />
      ))}
    </div>
  );
}
