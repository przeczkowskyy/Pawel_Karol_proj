import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Database,
  Factory,
  FileSignature,
  Play,
  Wallet,
} from "lucide-react";
import { getTools, DEPTS, type Dept } from "@/data/tools";
import { useLang, pick } from "@/i18n";

/* Sekcja „Narzędzia" — DRILL-DOWN (decyzja 2026-07-22):
   poziom 1 = BOXY DZIAŁÓW (Kontroling, Finanse, Produkcja, Dane, Administracja),
   poziom 2 = narzędzia wybranego działu. KAŻDE narzędzie działa na żywo na
   danych DEMO (bez statusów) — karta prowadzi do /narzedzia/:slug z pełnym
   dashboardem. */

const DEPT_ICON: Record<Dept, React.ComponentType<{ size?: number | string }>> = {
  kontroling: BarChart3,
  finanse: Wallet,
  produkcja: Factory,
  dane: Database,
  administracja: FileSignature,
};

const T = {
  pl: {
    toolsIn: (n: number) => `${n} narzędzi${n === 2 || n === 3 ? "a" : ""} — każde działa na żywo`,
    back: "Wszystkie działy",
    open: "Otwórz narzędzie",
    demoNote: "Wszystkie narzędzia działają na danych przykładowych — klikasz i korzystasz, bez logowania.",
  },
  en: {
    toolsIn: (n: number) => `${n} tools — each runs live`,
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
                    className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0"
                    style={{ background: "rgba(168,180,194,.14)", color: "var(--primary)" }}
                  >
                    <Icon size={19} />
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
  const inDept = tools.filter((x) => x.dept === openDept);

  return (
    <div className="nc-tab-swap" key={openDept}>
      <div className="flex items-center gap-3 flex-wrap" style={{ marginBottom: 16 }}>
        <button className="btn btn-secondary btn-sm" type="button" onClick={() => setOpenDept(null)}>
          <ArrowLeft size={14} /> {t.back}
        </button>
        <h3 className="text-[17px] font-extrabold" style={{ color: "var(--heading)" }}>
          {pick(lang, dept.label)}
        </h3>
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
