import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  BarChart3,
  FileSpreadsheet,
  HardHat,
  Play,
  Stamp,
} from "lucide-react";
import RadialOrbitalTimeline, { type TimelineItem, type OrbitalUi } from "@/components/ui/radial-orbital-timeline";
import { getTools, DEPTS, CATEGORY_LABEL, type Dept } from "@/data/tools";
import { useLang, pick } from "@/i18n";

/* Sekcja „Narzędzia" — DRILL-DOWN:
   poziom 1 = BOXY DZIAŁÓW (czytelne ikony domenowe),
   poziom 2 = DYNAMICZNA KARUZELA ORBITALNA narzędzi działu (powrót
   radial-orbital-timeline z v0.4; klik węzła → karta → podstrona narzędzia).
   Na mobile (≤768px) karuzela ustępuje miejsca zwykłemu gridowi.
   KAŻDE narzędzie działa na żywo na danych DEMO. */

const DEPT_ICON: Record<Dept, React.ComponentType<{ size?: number | string; className?: string }>> = {
  kontroling: BarChart3, // wykresy = raportowanie/kontroling
  finanse: Banknote, // banknot = finanse i płatności
  produkcja: HardHat, // kask = budowa/produkcja
  dane: FileSpreadsheet, // arkusz = dane i importy Excel
  administracja: Stamp, // pieczątka = dokumenty i administracja
};

const T = {
  pl: {
    toolsIn: (n: number) => `${n} narzędzi${n === 2 || n === 3 ? "a" : ""} — każde działa na żywo`,
    back: "Wszystkie działy",
    open: "Otwórz narzędzie",
    demoNote: "Wszystkie narzędzia działają na danych przykładowych — klikasz i korzystasz, bez logowania.",
    orbitalHint: "Kliknij węzeł na orbicie, żeby zobaczyć szczegóły i otworzyć narzędzie.",
  },
  en: {
    toolsIn: (n: number) => `${n} tools — each runs live`,
    back: "All departments",
    open: "Open the tool",
    demoNote: "All tools run on sample data — click and use, no sign-up.",
    orbitalHint: "Click a node on the orbit to see details and open the tool.",
  },
};

const ORBITAL_UI: Record<"pl" | "en", OrbitalUi> = {
  pl: {
    statusLabels: { completed: "DEMO — NA ŻYWO", "in-progress": "DEMO", pending: "DEMO" },
    readiness: "",
    related: "Inne narzędzia działu",
    fullDesc: "Otwórz narzędzie",
    hoverHint: "kliknij węzeł, aby zobaczyć szczegóły",
  },
  en: {
    statusLabels: { completed: "DEMO — LIVE", "in-progress": "DEMO", pending: "DEMO" },
    readiness: "",
    related: "Other tools in this department",
    fullDesc: "Open the tool",
    hoverHint: "click a node to see details",
  },
};

/* karuzela wymaga miejsca — na wąskich ekranach pokazujemy grid */
function useIsNarrow(): boolean {
  const [narrow, setNarrow] = useState(() => window.matchMedia("(max-width: 768px)").matches);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const on = (e: MediaQueryListEvent) => setNarrow(e.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return narrow;
}

export default function ToolsGrid() {
  const { lang } = useLang();
  const t = pick(lang, T);
  const [openDept, setOpenDept] = useState<Dept | null>(null);
  const narrow = useIsNarrow();

  const tools = getTools(lang);

  if (openDept === null) {
    /* poziom 1: boxy działów */
    return (
      <div className="nc-tab-swap" key="depts">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DEPTS.map((d) => {
            const Icon = DEPT_ICON[d.key];
            const inDept = tools.filter((x) => x.dept === d.key);
            return (
              <button
                key={d.key}
                type="button"
                className="card h-full text-left flex flex-col gap-3"
                style={{ cursor: "pointer" }}
                onClick={() => setOpenDept(d.key)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "rgba(168,180,194,.16)", color: "var(--primary)" }}
                  >
                    <Icon size={24} />
                  </div>
                  <span className="st st-green">
                    <Play className="st-ico" /> DEMO
                  </span>
                </div>
                <h3 className="text-[16px] font-extrabold leading-snug" style={{ color: "var(--heading)" }}>
                  {pick(lang, d.label)}
                </h3>
                <p className="text-[12.5px] leading-relaxed flex-1" style={{ color: "var(--muted-foreground)" }}>
                  {pick(lang, d.desc)}
                </p>
                <div
                  className="flex items-center justify-between gap-2 pt-3 border-t"
                  style={{ borderColor: "var(--border)" }}
                >
                  <span className="text-[12px] font-bold" style={{ color: "var(--accent-foreground)" }}>
                    {t.toolsIn(inDept.length)}
                  </span>
                  <ArrowRight size={14} style={{ color: "var(--primary)" }} />
                </div>
              </button>
            );
          })}
        </div>
        <p className="mt-4 text-[12px]" style={{ color: "var(--muted-foreground)" }}>{t.demoNote}</p>
      </div>
    );
  }

  /* poziom 2: narzędzia wybranego działu */
  const dept = DEPTS.find((d) => d.key === openDept)!;
  const DeptIcon = DEPT_ICON[openDept];
  const inDept = tools.filter((x) => x.dept === openDept);

  const orbitalItems: TimelineItem[] = inDept.map((tool) => ({
    id: tool.id,
    title: tool.name,
    date: "DEMO",
    content: tool.tagline,
    category: pick(lang, CATEGORY_LABEL[tool.category]),
    icon: tool.icon,
    relatedIds: inDept.filter((x) => x.id !== tool.id).map((x) => x.id),
    status: "completed" as const,
    energy: 0, // pasek gotowości ukryty — wszystko działa na żywo
    slug: tool.slug,
  }));

  return (
    <div className="nc-tab-swap" key={openDept}>
      <div className="flex items-center gap-3 flex-wrap">
        <button className="btn btn-secondary btn-sm" type="button" onClick={() => setOpenDept(null)}>
          <ArrowLeft size={14} /> {t.back}
        </button>
        <span className="flex items-center gap-2 text-[17px] font-extrabold" style={{ color: "var(--heading)" }}>
          <span className="inline-flex shrink-0" style={{ color: "var(--primary)" }}>
            <DeptIcon size={18} />
          </span>
          {pick(lang, dept.label)}
        </span>
      </div>

      {narrow ? (
        /* mobile: zwykły grid */
        <div className="mt-4 grid grid-cols-1 gap-4">
          {inDept.map((tool) => (
            <Link
              key={tool.id}
              to={`/narzedzia/${tool.slug}`}
              className="card flex flex-col gap-3"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              <div className="flex items-start justify-between gap-2">
                <div
                  className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0"
                  style={{ background: "rgba(168,180,194,.14)", color: "var(--primary)" }}
                >
                  <tool.icon size={17} />
                </div>
                <span className="st st-green">
                  <Play className="st-ico" /> DEMO
                </span>
              </div>
              <h3 className="text-[15px] font-bold leading-snug" style={{ color: "var(--heading)" }}>
                {tool.name}
              </h3>
              <p className="text-[12.5px] leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                {tool.tagline}
              </p>
              <div
                className="flex items-center justify-end gap-1.5 pt-3 border-t text-[12.5px] font-bold"
                style={{ borderColor: "var(--border)", color: "var(--funded)" }}
              >
                {t.open} <Play size={13} />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        /* desktop: dynamiczna karuzela orbitalna */
        <>
          <RadialOrbitalTimeline timelineData={orbitalItems} ui={ORBITAL_UI[lang]} />
          <p className="-mt-6 text-[12px]" style={{ color: "var(--muted-foreground)" }}>{t.orbitalHint}</p>
        </>
      )}
    </div>
  );
}
