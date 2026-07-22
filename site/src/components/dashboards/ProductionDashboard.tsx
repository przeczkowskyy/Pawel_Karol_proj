import { useMemo, useState } from "react";
import { Check, Clock, TriangleAlert, Factory } from "lucide-react";
import { useLang } from "@/i18n";

/* Dashboard produkcji — LIVE, read-only, dane fikcyjne, w pełni deterministyczne
   (zero losowości / dat systemowych). Odtworzony od zera na wzór wewnętrznego
   „Production Dashboard" — bez marki i liczb źródłowych (zasada #3). Siatka
   kafli per hala + wspólny suwak tygodnia; klik w kafel → rozbicie na etapy. */

const WEEKS = 12;
const WEEK_START = 27; // etykieta „T27..T38" — czysto kosmetyczna, fikcyjna

interface Hall {
  name: string;
  pace: number; // >1 szybciej, <1 wolniej
  costBias: number; // >1 koszt wyprzedza postęp
}

const HALLS_PL: Hall[] = [
  { name: "Hala Poznań", pace: 1.06, costBias: 0.98 },
  { name: "Moduły Gdańsk", pace: 0.9, costBias: 1.01 },
  { name: "Biurowiec Łódź", pace: 0.82, costBias: 1.13 },
  { name: "Magazyn Wrocław", pace: 0.72, costBias: 1.0 },
  { name: "Hala Katowice", pace: 0.95, costBias: 1.15 },
  { name: "Centrum Toruń", pace: 1.0, costBias: 0.99 },
];

const HALLS_EN: Hall[] = [
  { name: "Poznań hall", pace: 1.06, costBias: 0.98 },
  { name: "Gdańsk modules", pace: 0.9, costBias: 1.01 },
  { name: "Łódź office", pace: 0.82, costBias: 1.13 },
  { name: "Wrocław warehouse", pace: 0.72, costBias: 1.0 },
  { name: "Katowice hall", pace: 0.95, costBias: 1.15 },
  { name: "Toruń centre", pace: 1.0, costBias: 0.99 },
];

interface Stage {
  pl: string;
  en: string;
  budget: number; // mln zł
  start: number; // tydzień startu
  dur: number; // czas trwania w tygodniach
}

const STAGES: Stage[] = [
  { pl: "Projektowanie", en: "Design", budget: 0.5, start: 0, dur: 3 },
  { pl: "Prefabrykacja", en: "Prefabrication", budget: 2.6, start: 2, dur: 5 },
  { pl: "Montaż", en: "Assembly", budget: 2.3, start: 5, dur: 5 },
  { pl: "Instalacje", en: "Installations", budget: 0.9, start: 8, dur: 4 },
  { pl: "Wykończenia", en: "Finishes", budget: 0.5, start: 10, dur: 4 },
];

const clamp = (v: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, v));

/* deterministyczny postęp etapu w danym tygodniu (0–100) */
function stageProgress(hall: Hall, s: Stage, week: number): number {
  return clamp(((week - s.start) / s.dur) * 100 * hall.pace);
}

interface HallAgg {
  progress: number;
  costPct: number;
  deviation: number;
  labour: number; // RBH tego tygodnia
  status: "ok" | "watch" | "risk";
  stages: { name: string; progress: number; costPct: number; budget: number }[];
}

function aggregateHall(hall: Hall, week: number, lang: "pl" | "en"): HallAgg {
  const totalBudget = STAGES.reduce((s, x) => s + x.budget, 0);
  let wProg = 0;
  let wCost = 0;
  let labour = 0;
  const stages = STAGES.map((s) => {
    const p = stageProgress(hall, s, week);
    const pPrev = stageProgress(hall, s, week - 1);
    const cost = clamp(p * hall.costBias);
    wProg += s.budget * p;
    wCost += s.budget * cost;
    labour += (p - pPrev) * s.budget * 42; // RBH ~ przyrost postępu × budżet
    return { name: lang === "pl" ? s.pl : s.en, progress: p, costPct: cost, budget: s.budget };
  });
  const progress = wProg / totalBudget;
  const costPct = wCost / totalBudget;
  const deviation = costPct - progress;
  const status = deviation > 8 ? "risk" : deviation > 3 ? "watch" : "ok";
  return { progress, costPct, deviation, labour: Math.round(labour), status, stages };
}

const T = {
  pl: {
    week: "Tydzień",
    completion: "wykonanie",
    labour: "robocizna (RBH)",
    hall: "Hala / projekt",
    portfolio: "Portfel — tydzień",
    kAvg: "Średnie wykonanie",
    kRisk: "Hale w ryzyku",
    kLabour: "Robocizna w tygodniu",
    stOk: "OK",
    stWatch: "Obserwuj",
    stRisk: "Ryzyko",
    breakdown: "Rozbicie na etapy",
    pickHint: "Kliknij kafel, aby zobaczyć rozbicie na etapy",
    progress: "postęp",
    cost: "koszt",
    demoTag: "DEMO · dane fikcyjne",
    foot: "Read-only · 100% w przeglądarce · te same dane zawsze dają ten sam obraz.",
  },
  en: {
    week: "Week",
    completion: "completion",
    labour: "labour (h)",
    hall: "Hall / project",
    portfolio: "Portfolio — week",
    kAvg: "Average completion",
    kRisk: "Halls at risk",
    kLabour: "Labour this week",
    stOk: "OK",
    stWatch: "Watch",
    stRisk: "Risk",
    breakdown: "Stage breakdown",
    pickHint: "Click a tile to see the stage breakdown",
    progress: "progress",
    cost: "cost",
    demoTag: "DEMO · fictional data",
    foot: "Read-only · 100% in the browser · the same data always gives the same picture.",
  },
};

function statusChip(status: "ok" | "watch" | "risk", t: (typeof T)["pl"]) {
  if (status === "ok")
    return (
      <span className="st st-green">
        <Check className="st-ico" /> {t.stOk}
      </span>
    );
  if (status === "watch")
    return (
      <span className="st st-accent">
        <Clock className="st-ico" /> {t.stWatch}
      </span>
    );
  return (
    <span className="st st-brick">
      <TriangleAlert className="st-ico" /> {t.stRisk}
    </span>
  );
}

const fmtPct0 = (v: number) => `${Math.round(v)}%`;

export default function ProductionDashboard() {
  const { lang } = useLang();
  const t = T[lang];
  const halls = lang === "pl" ? HALLS_PL : HALLS_EN;
  const [week, setWeek] = useState(WEEKS - 4); // startowo T35
  const [openHall, setOpenHall] = useState<number | null>(null);

  const aggs = useMemo(() => halls.map((h) => aggregateHall(h, week, lang)), [halls, week, lang]);

  const avg = aggs.reduce((s, a) => s + a.progress, 0) / aggs.length;
  const atRisk = aggs.filter((a) => a.status === "risk").length;
  const labourTotal = aggs.reduce((s, a) => s + a.labour, 0);
  const open = openHall !== null ? aggs[openHall] : null;

  return (
    <div>
      {/* pasek: KPI + suwak tygodnia */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-stretch">
        <div className="card stat">
          <div className="lbl">{t.kAvg}</div>
          <div className="val tnum">{fmtPct0(avg)}</div>
          <div className="foot">{halls.length} {lang === "pl" ? "hal / projektów" : "halls / projects"}</div>
        </div>
        <div className="card stat">
          <div className="lbl">{t.kRisk}</div>
          <div className="val tnum" style={atRisk > 0 ? { color: "var(--rejected)" } : undefined}>
            {atRisk} / {halls.length}
          </div>
          <div className="foot">{lang === "pl" ? "koszt wyprzedza postęp > 8 p.p." : "cost ahead of progress > 8 pp"}</div>
        </div>
        <div className="card stat">
          <div className="lbl">{t.kLabour}</div>
          <div className="val tnum">{labourTotal.toLocaleString(lang === "pl" ? "pl-PL" : "en-US")} h</div>
          <div className="foot">{lang === "pl" ? "przyrost wykonania w tygodniu" : "completion increment this week"}</div>
        </div>
        <div className="card flex flex-col justify-center">
          <div className="flex items-center justify-between">
            <span className="lbl-sm">{t.portfolio}</span>
            <span className="st st-accent tnum">T{WEEK_START + week}</span>
          </div>
          <input
            type="range"
            min={0}
            max={WEEKS - 1}
            value={week}
            onChange={(e) => setWeek(Number(e.target.value))}
            aria-label={t.week}
            style={{ width: "100%", marginTop: 12, accentColor: "var(--primary)" }}
          />
          <div className="flex justify-between text-[10px] tnum" style={{ color: "var(--muted-foreground)", marginTop: 4 }}>
            <span>T{WEEK_START}</span>
            <span>T{WEEK_START + WEEKS - 1}</span>
          </div>
        </div>
      </div>

      {/* siatka kafli hal */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {aggs.map((a, i) => {
          const isOpen = openHall === i;
          return (
            <button
              key={halls[i].name}
              type="button"
              onClick={() => setOpenHall(isOpen ? null : i)}
              className="card text-left"
              style={{
                cursor: "pointer",
                ...(isOpen ? { borderColor: "var(--primary)", boxShadow: "inset 0 0 0 1px var(--primary)" } : null),
              }}
              aria-expanded={isOpen}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Factory size={16} style={{ color: "var(--primary)", flex: "0 0 auto" }} />
                  <strong className="text-[13.5px] truncate" style={{ color: "var(--heading)" }}>
                    {halls[i].name}
                  </strong>
                </div>
                {statusChip(a.status, t)}
              </div>

              <div className="mt-3 flex items-end justify-between gap-2">
                <div>
                  <div className="lbl-sm">{t.completion}</div>
                  <div className="tnum" style={{ fontSize: 26, fontWeight: 800, color: "var(--heading)", lineHeight: 1 }}>
                    {fmtPct0(a.progress)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="lbl-sm">{t.labour}</div>
                  <div className="tnum" style={{ fontSize: 15, fontWeight: 700, color: "var(--accent-foreground)" }}>
                    {a.labour.toLocaleString(lang === "pl" ? "pl-PL" : "en-US")} h
                  </div>
                </div>
              </div>

              {/* pasek postępu + narzut kosztu */}
              <div className="mt-3">
                <div className="bar">
                  <i style={{ width: `${clamp(a.progress)}%` }} />
                </div>
                <div className="flex justify-between text-[10.5px] tnum" style={{ color: "var(--muted-foreground)", marginTop: 5 }}>
                  <span>{t.progress} {fmtPct0(a.progress)}</span>
                  <span style={{ color: a.deviation > 3 ? "var(--rejected)" : "var(--muted-foreground)" }}>
                    {t.cost} {fmtPct0(a.costPct)}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* rozbicie na etapy wybranej hali */}
      {open ? (
        <div className="card mt-4 nc-tab-swap" key={openHall}>
          <div className="flex items-center gap-2" style={{ marginBottom: 12 }}>
            <Factory size={16} style={{ color: "var(--primary)" }} />
            <strong style={{ color: "var(--heading)" }}>
              {halls[openHall!].name} — {t.breakdown} (T{WEEK_START + week})
            </strong>
          </div>
          <div className="flex flex-col gap-3">
            {open.stages.map((s) => (
              <div key={s.name}>
                <div className="flex justify-between text-[12px]" style={{ marginBottom: 4 }}>
                  <span style={{ color: "var(--foreground)", fontWeight: 600 }}>{s.name}</span>
                  <span className="tnum" style={{ color: "var(--muted-foreground)" }}>
                    {t.progress} {fmtPct0(s.progress)} · {t.cost}{" "}
                    <span style={{ color: s.costPct - s.progress > 3 ? "var(--rejected)" : "var(--muted-foreground)" }}>
                      {fmtPct0(s.costPct)}
                    </span>
                  </span>
                </div>
                <div className="bar">
                  <i
                    style={{
                      width: `${clamp(s.progress)}%`,
                      background: s.costPct - s.progress > 3 ? "var(--rejected)" : undefined,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="mt-4 text-[12.5px]" style={{ color: "var(--muted-foreground)" }}>
          {t.pickHint}
        </p>
      )}

      <div className="legend">
        <span>{t.demoTag}</span>
        <span>{t.foot}</span>
      </div>
    </div>
  );
}
