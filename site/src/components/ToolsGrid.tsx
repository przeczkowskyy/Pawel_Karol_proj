import { useState } from "react";
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
import { getTools, DEPTS, type Dept } from "@/data/tools";
import { useLang, pick } from "@/i18n";

/* Sekcja „Narzędzia" — DRILL-DOWN (rewizja 2026-07-22 wieczór):
   poziom 1 = PANEL KOLUMN DZIAŁÓW (jeden pas na scrimie, kolumny rozdzielone
   strukturalnymi liniami 1px — celowo NIE osobne boxy), poziom 2 = siatka
   kart narzędzi działu (powrót do wcześniejszej wersji; karuzela orbitalna
   usunięta decyzją Karola). KAŻDE narzędzie działa na żywo na danych DEMO. */

const DEPT_ICON: Record<Dept, React.ComponentType<{ size?: number | string; className?: string }>> = {
  kontroling: BarChart3, // wykresy = raportowanie/kontroling
  finanse: Banknote, // banknot = finanse i płatności
  produkcja: HardHat, // kask = budowa/produkcja
  dane: FileSpreadsheet, // arkusz = dane i importy Excel
  administracja: Stamp, // pieczątka = dokumenty i administracja
};

const T = {
  pl: {
    tools: (n: number) => `${n} ${n === 1 ? "narzędzie" : n <= 4 ? "narzędzia" : "narzędzi"}`,
    back: "Wszystkie działy",
    open: "Otwórz narzędzie",
    demoNote: "Wszystkie narzędzia działają na danych przykładowych — klikasz i korzystasz, bez logowania.",
  },
  en: {
    tools: (n: number) => `${n} ${n === 1 ? "tool" : "tools"}`,
    back: "All departments",
    open: "Open the tool",
    demoNote: "All tools run on sample data — click and use, no sign-up.",
  },
};

export default function ToolsGrid() {
  const { lang } = useLang();
  const t = pick(lang, T);
  const [openDept, setOpenDept] = useState<Dept | null>(null);

  const tools = getTools(lang);

  if (openDept === null) {
    /* poziom 1: pas kolumn działów — jeden panel, kolumny rozdzielone liniami */
    return (
      <div className="nc-tab-swap" key="depts">
        <div
          className="tools-strip grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 overflow-hidden"
          style={{
            background: "var(--scrim)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
          }}
        >
          {DEPTS.map((d) => {
            const Icon = DEPT_ICON[d.key];
            const inDept = tools.filter((x) => x.dept === d.key);
            return (
              <button
                key={d.key}
                type="button"
                onClick={() => setOpenDept(d.key)}
                className="tools-col text-left flex flex-col gap-3"
                style={{ padding: "26px 22px 20px", cursor: "pointer" }}
              >
                <span className="inline-flex" style={{ color: "var(--primary)" }}>
                  <Icon size={30} />
                </span>
                <span className="text-[15px] font-extrabold leading-snug" style={{ color: "var(--heading)" }}>
                  {pick(lang, d.label)}
                </span>
                <span className="text-[12px] leading-relaxed flex-1" style={{ color: "var(--muted-foreground)" }}>
                  {pick(lang, d.desc)}
                </span>
                <span
                  className="inline-flex items-center gap-1.5 text-[12px] font-bold pt-3 border-t w-full"
                  style={{ color: "var(--accent-foreground)", borderColor: "var(--border)" }}
                >
                  {t.tools(inDept.length)}
                  <span className="st st-green" style={{ marginLeft: "auto" }}>
                    <Play className="st-ico" /> DEMO
                  </span>
                  <ArrowRight size={13} style={{ color: "var(--primary)" }} />
                </span>
              </button>
            );
          })}
        </div>
        <p className="mt-4 text-[12px]" style={{ color: "var(--muted-foreground)" }}>{t.demoNote}</p>
      </div>
    );
  }

  /* poziom 2: siatka kart narzędzi wybranego działu */
  const dept = DEPTS.find((d) => d.key === openDept)!;
  const DeptIcon = DEPT_ICON[openDept];
  const inDept = tools.filter((x) => x.dept === openDept);

  return (
    <div className="nc-tab-swap" key={openDept}>
      <div className="flex items-center gap-3 flex-wrap" style={{ marginBottom: 16 }}>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {inDept.map((tool) => (
          <Link
            key={tool.id}
            to={`/narzedzia/${tool.slug}`}
            className="card h-full flex flex-col gap-3"
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
            <p className="text-[12.5px] leading-relaxed flex-1" style={{ color: "var(--muted-foreground)" }}>
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
    </div>
  );
}
