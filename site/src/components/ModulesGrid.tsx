import { useState } from "react";
import { Link } from "react-router-dom";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Check, Clock, Hourglass } from "lucide-react";
import { getModules, type Dept, type ModuleStatus } from "@/data/modules";
import { useLang, pick } from "@/i18n";

/* Sekcja „Moduły” w osi PROBLEMOWEJ (plan strategiczny §4.1 pkt 3):
   karta = problem (głos klienta) → co dostajesz → wartość liczbą →
   dni wdrożenia → status; dział wyłącznie jako filtr. Cała karta jest
   linkiem do podstrony modułu. Filtr animowany auto-animate (rodzic
   gridu zawsze w DOM, klucze = id modułu). */

type Filter = "all" | Dept;

const T = {
  pl: {
    filters: [
      { key: "all" as Filter, label: "Wszystkie" },
      { key: "finanse" as Filter, label: "Finanse i księgowość" },
      { key: "kpi" as Filter, label: "KPI / Zarząd" },
      { key: "produkcja" as Filter, label: "Produkcja" },
      { key: "administracja" as Filter, label: "Administracja" },
      { key: "przekrojowy" as Filter, label: "Przekrojowe" },
    ],
    status: {
      completed: "DOSTĘPNY",
      "in-progress": "FALA 2",
      pending: "ROADMAPA",
    } as Record<ModuleStatus, string>,
    gain: "Co zyskujesz",
    qOpen: "„",
    qClose: "”",
    l1: "sprzedajemy od dziś",
    l2: "po pierwszych wdrożeniach",
    l3: "w przygotowaniu",
  },
  en: {
    filters: [
      { key: "all" as Filter, label: "All" },
      { key: "finanse" as Filter, label: "Finance & accounting" },
      { key: "kpi" as Filter, label: "KPI / Management" },
      { key: "produkcja" as Filter, label: "Production" },
      { key: "administracja" as Filter, label: "Administration" },
      { key: "przekrojowy" as Filter, label: "Cross-cutting" },
    ],
    status: {
      completed: "AVAILABLE",
      "in-progress": "WAVE 2",
      pending: "ROADMAP",
    } as Record<ModuleStatus, string>,
    gain: "What you gain",
    qOpen: "“",
    qClose: "”",
    l1: "selling today",
    l2: "after first deployments",
    l3: "in preparation",
  },
};

function statusChip(status: ModuleStatus, label: string) {
  if (status === "completed")
    return (
      <span className="st st-accent">
        <Check className="st-ico" /> {label}
      </span>
    );
  if (status === "in-progress")
    return (
      <span className="st st-gray">
        <Clock className="st-ico" /> {label}
      </span>
    );
  return (
    <span className="st st-gray st-open">
      <Hourglass className="st-ico" /> {label}
    </span>
  );
}

export default function ModulesGrid() {
  const { lang } = useLang();
  const t = pick(lang, T);
  const [filter, setFilter] = useState<Filter>("all");
  const [parent] = useAutoAnimate();

  const modules = getModules(lang).filter((m) => filter === "all" || m.dept === filter);

  return (
    <div>
      <div className="overflow-x-auto pb-1 -mb-1">
        <div className="seg" role="tablist" aria-label={lang === "pl" ? "Filtr działów" : "Department filter"}>
          {t.filters.map((f) => (
            <a
              key={f.key}
              role="tab"
              aria-selected={filter === f.key}
              className={filter === f.key ? "active" : ""}
              style={{ cursor: "pointer", whiteSpace: "nowrap" }}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </a>
          ))}
        </div>
      </div>

      <div ref={parent} className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((m) => (
          <Link
            key={m.id}
            to={`/moduly/${m.slug}`}
            className="card h-full flex flex-col gap-3"
            style={{ color: "inherit", textDecoration: "none" }}
          >
            <div className="flex items-start justify-between gap-2">
              <div
                className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0"
                style={{ background: "rgba(168,180,194,.14)", color: "var(--primary)" }}
              >
                <m.icon size={17} />
              </div>
              {statusChip(m.status, t.status[m.status])}
            </div>

            <h3 className="text-[14.5px] font-bold leading-snug" style={{ color: "var(--heading)" }}>
              {t.qOpen}
              {m.problem}
              {t.qClose}
            </h3>

            <p className="text-[12.5px] leading-relaxed flex-1" style={{ color: "var(--muted-foreground)" }}>
              {m.content}
            </p>

            <div>
              <div className="lbl-sm" style={{ marginBottom: 4 }}>{t.gain}</div>
              <p className="text-[13px] font-bold leading-snug" style={{ color: "var(--accent-foreground)" }}>
                {m.saves}
              </p>
            </div>

            <div
              className="flex items-center justify-between gap-2 pt-3 border-t"
              style={{ borderColor: "var(--border)" }}
            >
              <span className="chip">{m.category}</span>
              <span className="st st-gray">
                <Clock className="st-ico" /> {m.date}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs" style={{ color: "var(--muted-foreground)" }}>
        <span>{statusChip("completed", t.status.completed)}&nbsp; {t.l1}</span>
        <span>{statusChip("in-progress", t.status["in-progress"])}&nbsp; {t.l2}</span>
        <span>{statusChip("pending", t.status.pending)}&nbsp; {t.l3}</span>
      </div>
    </div>
  );
}
