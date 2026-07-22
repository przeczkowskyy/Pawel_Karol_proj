import { useState } from "react";
import { Link } from "react-router-dom";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Play, Check, Clock, Hourglass, ArrowRight } from "lucide-react";
import { getTools, CATEGORY_LABEL, type ToolCategory, type ToolStatus } from "@/data/tools";
import { useLang, pick } from "@/i18n";

/* Sekcja „Narzędzia" — katalog dashboardów odtworzonych od zera (na danych
   fikcyjnych, bez marki źródłowej). Karta klikalna → /narzedzia/:slug, gdzie
   żyje pełny interaktywny dashboard (dla status:"live"). Filtr kategorii +
   auto-animate; wyróżnione narzędzia „live" idą na początek. */

type Filter = "all" | ToolCategory;

const T = {
  pl: {
    allLabel: "Wszystkie",
    status: { live: "DZIAŁA NA ŻYWO", preview: "PODGLĄD WKRÓTCE", soon: "NA ROADMAPIE" } as Record<ToolStatus, string>,
    open: "Otwórz dashboard",
    details: "Zobacz opis",
    legendLive: "klikasz i korzystasz teraz",
    legendPreview: "opis gotowy, dashboard w budowie",
    legendSoon: "kolejne w kolejce",
  },
  en: {
    allLabel: "All",
    status: { live: "LIVE", preview: "PREVIEW SOON", soon: "ROADMAP" } as Record<ToolStatus, string>,
    open: "Open dashboard",
    details: "See description",
    legendLive: "click and use it now",
    legendPreview: "description ready, dashboard in build",
    legendSoon: "next in the queue",
  },
};

function statusChip(status: ToolStatus, label: string) {
  if (status === "live")
    return (
      <span className="st st-green">
        <Play className="st-ico" /> {label}
      </span>
    );
  if (status === "preview")
    return (
      <span className="st st-accent">
        <Clock className="st-ico" /> {label}
      </span>
    );
  return (
    <span className="st st-gray st-open">
      <Hourglass className="st-ico" /> {label}
    </span>
  );
}

const STATUS_ORDER: Record<ToolStatus, number> = { live: 0, preview: 1, soon: 2 };

export default function ToolsGrid() {
  const { lang } = useLang();
  const t = pick(lang, T);
  const [filter, setFilter] = useState<Filter>("all");
  const [parent] = useAutoAnimate();

  const cats = Array.from(new Set(getTools(lang).map((x) => x.category)));
  const tools = getTools(lang)
    .filter((x) => filter === "all" || x.category === filter)
    .sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status] || a.id - b.id);

  return (
    <div>
      <div className="overflow-x-auto pb-1 -mb-1">
        <div className="seg" role="tablist" aria-label={lang === "pl" ? "Filtr kategorii" : "Category filter"}>
          <a
            role="tab"
            aria-selected={filter === "all"}
            className={filter === "all" ? "active" : ""}
            style={{ cursor: "pointer", whiteSpace: "nowrap" }}
            onClick={() => setFilter("all")}
          >
            {t.allLabel}
          </a>
          {cats.map((c) => (
            <a
              key={c}
              role="tab"
              aria-selected={filter === c}
              className={filter === c ? "active" : ""}
              style={{ cursor: "pointer", whiteSpace: "nowrap" }}
              onClick={() => setFilter(c)}
            >
              {pick(lang, CATEGORY_LABEL[c])}
            </a>
          ))}
        </div>
      </div>

      <div ref={parent} className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <Link
            key={tool.id}
            to={`/narzedzia/${tool.slug}`}
            className="card h-full flex flex-col gap-3"
            style={{
              color: "inherit",
              textDecoration: "none",
              ...(tool.status === "live" ? { borderColor: "var(--funded-border)" } : null),
            }}
          >
            <div className="flex items-start justify-between gap-2">
              <div
                className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0"
                style={{ background: "rgba(168,180,194,.14)", color: "var(--primary)" }}
              >
                <tool.icon size={17} />
              </div>
              {statusChip(tool.status, t.status[tool.status])}
            </div>

            <h3 className="text-[15px] font-bold leading-snug" style={{ color: "var(--heading)" }}>
              {tool.name}
            </h3>

            <p className="text-[12.5px] leading-relaxed flex-1" style={{ color: "var(--muted-foreground)" }}>
              {tool.tagline}
            </p>

            <div
              className="flex items-center justify-between gap-2 pt-3 border-t"
              style={{ borderColor: "var(--border)" }}
            >
              <span className="chip">{pick(lang, CATEGORY_LABEL[tool.category])}</span>
              <span
                className="inline-flex items-center gap-1.5 text-[12.5px] font-bold"
                style={{ color: tool.status === "live" ? "var(--funded)" : "var(--accent-foreground)" }}
              >
                {tool.status === "live" ? t.open : t.details}
                {tool.status === "live" ? <Play size={13} /> : <ArrowRight size={13} />}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs" style={{ color: "var(--muted-foreground)" }}>
        <span>{statusChip("live", t.status.live)}&nbsp; {t.legendLive}</span>
        <span>{statusChip("preview", t.status.preview)}&nbsp; {t.legendPreview}</span>
        <span>{statusChip("soon", t.status.soon)}&nbsp; {t.legendSoon}</span>
      </div>
    </div>
  );
}
