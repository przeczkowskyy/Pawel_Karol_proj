import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarClock } from "lucide-react";
import { useLang } from "@/i18n";

/* Dashboard „Oś czasu zadań / Gantt" — LIVE, read-only, dane fikcyjne,
   deterministyczne. Compare-mode: każdy task = dwa pasy (poprzedni snapshot
   „Old" muted + bieżący „New" saturated) z etykietą dryfu +Nd/−Nd; zielony
   słupek start→min(plan,teraz) + czerwony ogon przy obsuwie. Oś o stałej
   gęstości px/dobę (scroll poziomy), suwak daty + „Dziś". Odbrandowane
   odtworzenie na wzór (zasada #3). „Dziś" = stała referencyjna, nie Date.now(). */

const TODAY = "2026-07-22"; // stała referencyjna (determinizm)

interface Task {
  id: string;
  project: string;
  scope: string;
  status: "in_progress" | "new" | "done";
  start?: string;
  originalFinish?: string;
  oldFinish?: string; // poprzedni snapshot
  newFinish?: string; // bieżący snapshot
  existsInOld: boolean;
  existsInNew: boolean;
}

const TASKS: Task[] = [
  { id: "25011", project: "Hala Poznań", scope: "Prefabrykacja", status: "in_progress", start: "2026-05-18", originalFinish: "2026-07-10", oldFinish: "2026-07-12", newFinish: "2026-07-24", existsInOld: true, existsInNew: true },
  { id: "25011", project: "Hala Poznań", scope: "Montaż", status: "in_progress", start: "2026-06-22", originalFinish: "2026-08-14", oldFinish: "2026-08-14", newFinish: "2026-08-21", existsInOld: true, existsInNew: true },
  { id: "25014", project: "Moduły Gdańsk", scope: "Prefabrykacja", status: "in_progress", start: "2026-06-01", originalFinish: "2026-08-07", oldFinish: "2026-08-10", newFinish: "2026-08-04", existsInOld: true, existsInNew: true },
  { id: "25014", project: "Moduły Gdańsk", scope: "Instalacje", status: "new", existsInOld: false, existsInNew: true },
  { id: "25020", project: "Biurowiec Łódź", scope: "Montaż", status: "in_progress", start: "2026-06-15", originalFinish: "2026-08-28", oldFinish: "2026-08-28", newFinish: "2026-09-18", existsInOld: true, existsInNew: true },
  { id: "25020", project: "Biurowiec Łódź", scope: "Wykończenia", status: "in_progress", start: "2026-07-06", originalFinish: "2026-09-25", oldFinish: "2026-09-25", newFinish: "2026-09-25", existsInOld: true, existsInNew: true },
  { id: "25027", project: "Centrum Toruń", scope: "Prefabrykacja", status: "done", start: "2026-05-04", originalFinish: "2026-07-03", oldFinish: "2026-07-03", newFinish: "2026-07-03", existsInOld: true, existsInNew: true },
  { id: "25027", project: "Centrum Toruń", scope: "Montaż", status: "in_progress", start: "2026-07-06", originalFinish: "2026-09-11", oldFinish: "2026-09-04", newFinish: "2026-09-09", existsInOld: true, existsInNew: true },
  { id: "25031", project: "Magazyn Wrocław", scope: "Fundamenty", status: "in_progress", start: "2026-06-29", originalFinish: "2026-08-21", oldFinish: "2026-08-18", newFinish: "2026-08-18", existsInOld: false, existsInNew: true },
  { id: "25009", project: "Rozbudowa Katowice", scope: "Instalacje", status: "in_progress", start: "2026-05-25", originalFinish: "2026-07-17", oldFinish: "2026-07-31", existsInOld: true, existsInNew: false },
];

const DAY = 86400000;
const dayNum = (iso: string) => Math.floor(Date.parse(iso + "T00:00:00Z") / DAY);
const daysBetween = (a: string, b: string) => dayNum(b) - dayNum(a);
const addDaysIso = (iso: string, d: number) => {
  const t = new Date(dayNum(iso) * DAY + d * DAY);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${t.getUTCFullYear()}-${p(t.getUTCMonth() + 1)}-${p(t.getUTCDate())}`;
};
const fmtShort = (iso: string) => {
  const t = new Date(dayNum(iso) * DAY);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(t.getUTCDate())}.${p(t.getUTCMonth() + 1)}`;
};

const MONTHS_PL = ["sty", "lut", "mar", "kwi", "maj", "cze", "lip", "sie", "wrz", "paź", "lis", "gru"];
const MONTHS_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const SCALES = { daily: 20, weekly: 6, monthly: 2.4 } as const;
type Scale = keyof typeof SCALES;

const ROW_H = 46;
const LABEL_W = 190;
const PAD_DAYS = 10;
const TOP = 30;

const T = {
  pl: {
    shifted: "przesunięte",
    added: "dodane",
    removed: "usunięte",
    scale: "Skala",
    daily: "Dzień",
    weekly: "Tydzień",
    monthly: "Miesiąc",
    today: "Dziś",
    selected: "Wybrana data",
    old: "Poprzedni snapshot",
    now: "Bieżący",
    legendGreen: "w planie",
    legendRed: "obsuwa (po terminie)",
    legendOld: "poprzedni snapshot",
    badgeNew: "NOWE",
    badgeRemoved: "USUNIĘTE",
    foot: "Dane fikcyjne · read-only · „Dziś” = 22.07.2026 (stała). Dryf liczony między dwoma snapshotami.",
    hint: "Suwak = wybrana data (stalowa linia). Przewiń oś w bok. Czerwony ogon = obsuwa poza pierwotny termin.",
  },
  en: {
    shifted: "shifted",
    added: "added",
    removed: "removed",
    scale: "Scale",
    daily: "Day",
    weekly: "Week",
    monthly: "Month",
    today: "Today",
    selected: "Selected date",
    old: "Previous snapshot",
    now: "Current",
    legendGreen: "on plan",
    legendRed: "slipped (past due)",
    legendOld: "previous snapshot",
    badgeNew: "NEW",
    badgeRemoved: "REMOVED",
    foot: "Fictional data · read-only · “Today” = 2026-07-22 (fixed). Drift computed between two snapshots.",
    hint: "Slider = selected date (steel line). Scroll the axis sideways. Red tail = slip past the original deadline.",
  },
};

export default function TaskTimeline() {
  const { lang } = useLang();
  const t = T[lang];
  const months = lang === "pl" ? MONTHS_PL : MONTHS_EN;
  const [scale, setScale] = useState<Scale>("weekly");
  const scrollRef = useRef<HTMLDivElement>(null);

  const rows = useMemo(() => {
    return TASKS.map((task) => {
      const truthFinish = task.newFinish ?? task.oldFinish ?? null;
      const drift =
        task.oldFinish && task.newFinish ? daysBetween(task.oldFinish, task.newFinish) : null;
      const slipped =
        !!task.originalFinish && !!truthFinish && dayNum(truthFinish) > dayNum(task.originalFinish);
      return { task, truthFinish, drift, slipped };
    });
  }, []);

  const range = useMemo(() => {
    const all: number[] = [dayNum(TODAY)];
    for (const task of TASKS) {
      for (const d of [task.start, task.originalFinish, task.oldFinish, task.newFinish]) {
        if (d) all.push(dayNum(d));
      }
    }
    const min = Math.min(...all) - PAD_DAYS;
    const max = Math.max(...all) + PAD_DAYS;
    return { min, max };
  }, []);

  const pxPerDay = SCALES[scale];
  const plotW = (range.max - range.min) * pxPerDay;
  const height = TOP + TASKS.length * ROW_H + 12;
  const x = (iso: string) => (dayNum(iso) - range.min) * pxPerDay;
  const xDay = (d: number) => (d - range.min) * pxPerDay;

  const [selDay, setSelDay] = useState(dayNum(TODAY));
  const selIso = addDaysIso(`1970-01-01`, selDay);

  // auto-follow: wybrana data ~40% od lewej
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const target = xDay(selDay) - el.clientWidth * 0.4;
    el.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
  }, [selDay, scale]); // eslint-disable-line react-hooks/exhaustive-deps

  // siatka miesięcy
  const monthTicks: { d: number; label: string }[] = [];
  {
    const start = new Date(range.min * DAY);
    let y = start.getUTCFullYear();
    let m = start.getUTCMonth();
    for (let i = 0; i < 24; i++) {
      const d = dayNum(`${y}-${String(m + 1).padStart(2, "0")}-01`);
      if (d > range.max) break;
      if (d >= range.min) monthTicks.push({ d, label: `${months[m]} ${String(y).slice(2)}` });
      m++;
      if (m > 11) {
        m = 0;
        y++;
      }
    }
  }

  const shifted = rows.filter((r) => r.drift !== null && r.drift !== 0).length;
  const added = TASKS.filter((x) => !x.existsInOld).length;
  const removed = TASKS.filter((x) => !x.existsInNew).length;

  return (
    <div>
      {/* KPI chipy + sterowanie */}
      <div className="flex flex-wrap items-center gap-2.5" style={{ marginBottom: 12 }}>
        <span className="st st-brick tnum">{shifted} {t.shifted}</span>
        <span className="st st-accent tnum">{added} {t.added}</span>
        <span className="st st-gray st-open tnum">{removed} {t.removed}</span>
        <div className="grow" style={{ flex: 1 }} />
        <div className="seg">
          {(["daily", "weekly", "monthly"] as Scale[]).map((s) => (
            <a key={s} className={scale === s ? "active" : ""} style={{ cursor: "pointer" }} onClick={() => setScale(s)}>
              {t[s]}
            </a>
          ))}
        </div>
        <button className="btn btn-secondary btn-sm" type="button" onClick={() => setSelDay(dayNum(TODAY))}>
          <CalendarClock size={14} /> {t.today}
        </button>
      </div>

      {/* suwak wybranej daty */}
      <div className="card" style={{ padding: 14, marginBottom: 12 }}>
        <div className="flex items-center justify-between">
          <span className="lbl-sm">{t.selected}</span>
          <span className="st st-accent tnum">{fmtShort(selIso)}.{selIso.slice(2, 4)}</span>
        </div>
        <input
          type="range"
          min={range.min}
          max={range.max}
          value={selDay}
          onChange={(e) => setSelDay(Number(e.target.value))}
          aria-label={t.selected}
          style={{ width: "100%", marginTop: 10, accentColor: "var(--primary)" }}
        />
      </div>

      {/* oś czasu — scroll poziomy, stała gęstość px/dobę */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div ref={scrollRef} style={{ overflowX: "auto", overflowY: "hidden" }}>
          <svg
            width={LABEL_W + plotW}
            height={height}
            role="img"
            aria-label={lang === "pl" ? "Oś czasu zadań — porównanie snapshotów" : "Task timeline — snapshot comparison"}
            style={{ display: "block", fontFamily: "var(--font-sans)" }}
          >
            {/* siatka miesięcy */}
            {monthTicks.map((mt) => (
              <g key={mt.d}>
                <line x1={LABEL_W + xDay(mt.d)} y1={TOP - 8} x2={LABEL_W + xDay(mt.d)} y2={height} stroke="var(--grid-line)" strokeWidth={1} />
                <text x={LABEL_W + xDay(mt.d) + 4} y={TOP - 12} fontSize={9.5} fill="var(--muted-foreground)">
                  {mt.label}
                </text>
              </g>
            ))}

            {/* linia „dziś" */}
            <line x1={LABEL_W + xDay(dayNum(TODAY))} y1={TOP - 8} x2={LABEL_W + xDay(dayNum(TODAY))} y2={height} stroke="var(--chart-neutral)" strokeWidth={1} strokeDasharray="2 3" />

            {/* wybrana data (akcent) */}
            <line x1={LABEL_W + xDay(selDay)} y1={TOP - 14} x2={LABEL_W + xDay(selDay)} y2={height} stroke="var(--primary)" strokeWidth={1.5} strokeDasharray="5 4" />

            {/* wiersze */}
            {rows.map((r, i) => {
              const y = TOP + i * ROW_H;
              const yOld = y + 8;
              const yNew = y + 20;
              const task = r.task;
              const bars: React.ReactNode[] = [];

              // Old pas (muted)
              if (task.start && task.oldFinish && task.existsInOld) {
                const x0 = LABEL_W + x(task.start);
                const x1 = LABEL_W + x(task.oldFinish);
                bars.push(
                  <rect key="old" x={x0} y={yOld} width={Math.max(2, x1 - x0)} height={7} rx={2} fill="rgba(168,180,194,.28)" />
                );
              }

              // New pas (saturated) + ogon obsuwy
              if (task.start && r.truthFinish && task.existsInNew) {
                const xs = LABEL_W + x(task.start);
                const xNow = LABEL_W + x(r.truthFinish);
                const xPlan = task.originalFinish ? LABEL_W + x(task.originalFinish) : xNow;
                const greenEnd = r.slipped ? xPlan : xNow;
                bars.push(
                  <rect key="new-green" x={xs} y={yNew} width={Math.max(2, greenEnd - xs)} height={12} rx={3} fill="var(--funded)" opacity={0.7} />
                );
                if (r.slipped) {
                  bars.push(
                    <rect key="new-red" x={xPlan} y={yNew} width={Math.max(2, xNow - xPlan)} height={12} rx={3} fill="var(--rejected)" opacity={0.8} />
                  );
                }
                bars.push(<circle key="dot" cx={xNow} cy={yNew + 6} r={3} fill="var(--heading)" />);
                // etykieta dryfu
                if (r.drift !== null && r.drift !== 0) {
                  bars.push(
                    <text key="drift" x={xNow + 7} y={yNew + 10} fontSize={9.5} fontWeight={800} fill={r.drift > 0 ? "var(--rejected)" : "var(--primary)"}>
                      {r.drift > 0 ? `+${r.drift}d` : `${r.drift}d`}
                    </text>
                  );
                }
              }

              // badge new/removed / plakietki new/done
              let badge: React.ReactNode = null;
              if (!task.existsInNew) {
                badge = <text x={LABEL_W + 6} y={yNew + 10} fontSize={9} fontWeight={800} fill="var(--muted-foreground)">{t.badgeRemoved}</text>;
              } else if (!task.existsInOld) {
                badge = <text x={(task.start ? LABEL_W + x(task.start) : LABEL_W + 6) + 2} y={yNew + 10} fontSize={9} fontWeight={800} fill="var(--primary)">{t.badgeNew}</text>;
              } else if (task.status === "new") {
                badge = <text x={LABEL_W + 6} y={yNew + 10} fontSize={9.5} fill="var(--muted-foreground)">NEW · 0%</text>;
              }

              return (
                <g key={`${task.id}-${task.scope}-${i}`}>
                  {i % 2 === 1 && <rect x={0} y={y} width={LABEL_W + plotW} height={ROW_H} fill="rgba(255,255,255,.015)" />}
                  {/* etykieta */}
                  <text x={12} y={y + 18} fontSize={12.5} fontWeight={700} fill="var(--heading)">
                    {task.scope}
                  </text>
                  <text x={12} y={y + 32} fontSize={10} fill="var(--muted-foreground)">
                    {task.id} · {task.project}
                  </text>
                  {bars}
                  {badge}
                </g>
              );
            })}

            {/* separator kolumny etykiet */}
            <line x1={LABEL_W} y1={0} x2={LABEL_W} y2={height} stroke="var(--border)" strokeWidth={1} />
          </svg>
        </div>
      </div>

      {/* legenda */}
      <div className="legend">
        <span><i style={{ background: "var(--funded)" }} /> {t.legendGreen}</span>
        <span><i style={{ background: "var(--rejected)" }} /> {t.legendRed}</span>
        <span><i style={{ background: "rgba(168,180,194,.5)" }} /> {t.legendOld}</span>
      </div>
      <p className="mt-2 text-[11.5px]" style={{ color: "var(--muted-foreground)" }}>{t.hint}</p>
      <p className="mt-1 text-[11.5px]" style={{ color: "var(--muted-foreground)" }}>{t.foot}</p>
    </div>
  );
}
