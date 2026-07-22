import { useMemo, useRef, useState } from "react";
import {
  Check,
  ClipboardPaste,
  Clock,
  Download,
  FileSpreadsheet,
  FileUp,
  Info,
  Play,
  TriangleAlert,
} from "lucide-react";
import {
  aggregate,
  parseCsv,
  projectsToCsv,
  fmtAmount,
  fmtMln,
  fmtPct,
  fmtPp,
  OK_PP,
  RISK_PP,
  STAGE_TOLERANCE_PP,
  type ReportAgg,
  type RowStatus,
} from "@/lib/report";
import { DEMO_SAMPLE } from "@/data/demo-sample";
import { useLang, pick, type Lang } from "@/i18n";

/* Żywe DEMO modułu M2 „Raport zarządczy” — 100% client-side, dane fikcyjne.
   Wejście: załaduj przykład / wklej CSV (także wklejka z Excela, tab) /
   wgraj plik. Wyjście: 3 KPI + wykres per-etap (statyczny SVG w gramatyce
   kitu) + tabela projektów z komentarzami PM + jawna ścieżka wyliczenia.
   Odtworzenie wzorca od zera — zero kodu z wcześniejszych wdrożeń. */

const T = {
  pl: {
    loadExample: "Załaduj przykładowe dane",
    paste: "Wklej dane",
    upload: "Wgraj plik CSV",
    formatHint:
      "Format: Projekt; Etap; Budżet; Koszt; Zaawansowanie %; Komentarz — separator „;”, przecinek lub tabulator (wklejka prosto z Excela działa).",
    emptyTitle: "Raport zbuduje się tutaj — z Twoich danych",
    emptyBody: "Jedno kliknięcie na przykładowych danych albo wklej własną tabelę z Excela.",
    pastePh: "Projekt;Etap;Budżet;Koszt;Zaawansowanie;Komentarz\nHala A;Montaż;2400000;1620000;68;…",
    compute: "Przelicz raport",
    close: "Zamknij",
    srcExample: "dane przykładowe (fikcyjne)",
    srcPaste: "dane wklejone",
    errTitle: "Walidacja wejścia — pominięte wiersze:",
    errLine: "wiersz",
    kBudget: "Budżet portfela",
    kBudgetFoot: (p: number, r: number) => `${p} projektów · ${r} pozycji kosztowych`,
    kCost: "Koszt dotychczas",
    kCostFoot: (costPct: string, prog: string) => `${costPct} budżetu · zaawansowanie prac ${prog}`,
    kRisk: "Projekty w ryzyku",
    kRiskFootOk: "wszystkie projekty w normie",
    kRiskFoot: (name: string) => `największe odchylenie: ${name}`,
    chartTitle: "Koszt vs zaawansowanie — per etap",
    chartSub: "wykorzystanie budżetu (%) na tle zaawansowania prac (%) — tu widać, którędy wycieka marża",
    demoTag: "DEMO · dane fikcyjne",
    legProgress: "zaawansowanie prac",
    legOk: "koszt w normie",
    legOver: (t: number) => `koszt przekracza postęp o >${t} p.p.`,
    tableTitle: "Projekty — szczegóły i komentarze",
    thProject: "Projekt",
    thBudget: "Budżet",
    thCost: "Koszt",
    thProgress: "Zaawans.",
    thDev: "Odchylenie",
    thStatus: "Status",
    thComment: "Komentarz PM",
    total: "RAZEM",
    stOk: "OK",
    stWatch: "Obserwuj",
    stRisk: "Ryzyko",
    pathBtn: "Ścieżka wyliczenia",
    downloadBtn: "Pobierz wynik (CSV)",
    pathTitle: "Jawna ścieżka wyliczenia — kalkulator, nie wróżka",
    pathIntro:
      "Te same dane zawsze dają ten sam wynik: zero modeli językowych, zero losowości, zero sieci. Każdą liczbę z raportu można sprawdzić ręcznie:",
    path1: (cost: string, budget: string, pctv: string) => `Wykorzystanie budżetu = Σ koszt / Σ budżet = ${cost} / ${budget} = ${pctv}`,
    path2: (prog: string) => `Zaawansowanie portfela = Σ (budżet pozycji × zaawansowanie) / Σ budżet = ${prog}`,
    path3: (costPct: string, prog: string, dev: string) => `Odchylenie = ${costPct} − ${prog} = ${dev}`,
    path4: `Status projektu: OK ≤ ${OK_PP} p.p. · Obserwuj ${OK_PP}–${RISK_PP} p.p. · Ryzyko > ${RISK_PP} p.p.`,
    footFake: "Dane w tym demo są fikcyjne — to prezentacja modułu „Raport zarządczy”.",
    footLocal: "100% w Twojej przeglądarce: zero serwera, zero wysyłki danych (sprawdź w DevTools → Sieć).",
    footMs: (ms: string) => `przeliczono w ${ms} ms`,
  },
  en: {
    loadExample: "Load example data",
    paste: "Paste data",
    upload: "Upload CSV file",
    formatHint:
      "Format: Project; Stage; Budget; Cost; Progress %; Comment — separated by “;”, comma or tab (pasting straight from Excel works).",
    emptyTitle: "The report builds itself here — from your data",
    emptyBody: "One click on example data, or paste your own table from Excel.",
    pastePh: "Project;Stage;Budget;Cost;Progress;Comment\nHall A;Assembly;2400000;1620000;68;…",
    compute: "Compute the report",
    close: "Close",
    srcExample: "example data (fictional)",
    srcPaste: "pasted data",
    errTitle: "Input validation — skipped rows:",
    errLine: "line",
    kBudget: "Portfolio budget",
    kBudgetFoot: (p: number, r: number) => `${p} projects · ${r} cost line items`,
    kCost: "Cost to date",
    kCostFoot: (costPct: string, prog: string) => `${costPct} of budget · work progress ${prog}`,
    kRisk: "Projects at risk",
    kRiskFootOk: "all projects within range",
    kRiskFoot: (name: string) => `largest deviation: ${name}`,
    chartTitle: "Cost vs progress — per stage",
    chartSub: "budget used (%) against work progress (%) — this is where the margin leaks",
    demoTag: "DEMO · fictional data",
    legProgress: "work progress",
    legOk: "cost within range",
    legOver: (t: number) => `cost ahead of progress by >${t} pp`,
    tableTitle: "Projects — details and comments",
    thProject: "Project",
    thBudget: "Budget",
    thCost: "Cost",
    thProgress: "Progress",
    thDev: "Deviation",
    thStatus: "Status",
    thComment: "PM comment",
    total: "TOTAL",
    stOk: "OK",
    stWatch: "Watch",
    stRisk: "Risk",
    pathBtn: "Calculation path",
    downloadBtn: "Download result (CSV)",
    pathTitle: "Explicit calculation path — a calculator, not a fortune teller",
    pathIntro:
      "The same data always gives the same result: no language models, no randomness, no network. Every number in the report can be checked by hand:",
    path1: (cost: string, budget: string, pctv: string) => `Budget used = Σ cost / Σ budget = ${cost} / ${budget} = ${pctv}`,
    path2: (prog: string) => `Portfolio progress = Σ (line budget × progress) / Σ budget = ${prog}`,
    path3: (costPct: string, prog: string, dev: string) => `Deviation = ${costPct} − ${prog} = ${dev}`,
    path4: `Project status: OK ≤ ${OK_PP} pp · Watch ${OK_PP}–${RISK_PP} pp · Risk > ${RISK_PP} pp`,
    footFake: "The data in this demo is fictional — a showcase of the “Board report” module.",
    footLocal: "Runs 100% in your browser: no server, no data upload (check DevTools → Network).",
    footMs: (ms: string) => `computed in ${ms} ms`,
  },
};

function statusChip(status: RowStatus, t: (typeof T)["pl"] | (typeof T)["en"]) {
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

function devColor(dev: number): string {
  if (dev > RISK_PP) return "var(--rejected)";
  if (dev > OK_PP) return "var(--warning)";
  return "var(--muted-foreground)";
}

/* Statyczny SVG słupkowy per-etap (gramatyka kitu: .grid/.tick/.axis, tokeny
   var(--…), zero animacji JS — jedyny ruch to fade .chart-reveal na wejściu). */
function StageChart({ agg, lang, t }: { agg: ReportAgg; lang: Lang; t: (typeof T)["pl"] | (typeof T)["en"] }) {
  const stages = agg.stages;
  const W = 720;
  const H = 250;
  const L = 44;
  const R = 8;
  const TOP = 20;
  const B = 32;
  const plotW = W - L - R;
  const plotH = H - TOP - B;
  const maxVal = Math.max(100, ...stages.map((s) => Math.max(s.costPct, s.progress)));
  const maxY = Math.ceil(maxVal / 20) * 20;
  const y = (v: number) => TOP + plotH * (1 - v / maxY);
  const group = plotW / stages.length;
  const bw = Math.min(30, group * 0.26);
  const ticks: number[] = [];
  for (let i = 0; i <= 4; i++) ticks.push((maxY / 4) * i);
  const fmt0 = (v: number) => fmtPct(v, lang, 0);

  return (
    <svg
      className="chart-svg"
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={`${t.chartTitle}: ${stages.map((s) => `${s.name} ${fmt0(s.costPct)} / ${fmt0(s.progress)}`).join(", ")}`}
    >
      {ticks.map((v) => (
        <g key={v}>
          <line className="grid" x1={L} y1={y(v)} x2={W - R} y2={y(v)} />
          <text className="tick" x={L - 6} y={y(v) + 3} textAnchor="end">
            {Math.round(v)}%
          </text>
        </g>
      ))}
      {stages.map((s, i) => {
        const cx = L + group * i + group / 2;
        const over = s.deviation > STAGE_TOLERANCE_PP;
        return (
          <g key={s.name}>
            <rect
              x={cx - bw - 2}
              y={y(s.progress)}
              width={bw}
              height={Math.max(1, plotH * (s.progress / maxY))}
              rx={3}
              fill="var(--primary)"
            />
            <rect
              x={cx + 2}
              y={y(s.costPct)}
              width={bw}
              height={Math.max(1, plotH * (s.costPct / maxY))}
              rx={3}
              fill={over ? "var(--rejected)" : "var(--funded)"}
            />
            <text className="tick tnum" x={cx - 2 - bw / 2} y={y(s.progress) - 4} textAnchor="middle">
              {fmt0(s.progress)}
            </text>
            <text className="tick tnum" x={cx + 2 + bw / 2} y={y(s.costPct) - 4} textAnchor="middle">
              {fmt0(s.costPct)}
            </text>
            <g className="chart-late">
              <text className="tick" x={cx} y={H - 10} textAnchor="middle">
                {s.name}
              </text>
            </g>
          </g>
        );
      })}
      <line className="axis" x1={L} y1={y(0)} x2={W - R} y2={y(0)} />
    </svg>
  );
}

export default function DemoReport() {
  const { lang } = useLang();
  const t = pick(lang, T);
  const [csvText, setCsvText] = useState<string | null>(null);
  const [srcLabel, setSrcLabel] = useState("");
  const [pasteOpen, setPasteOpen] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const [showPath, setShowPath] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const result = useMemo(() => {
    if (csvText === null) return null;
    const t0 = performance.now();
    const parsed = parseCsv(csvText);
    const agg = aggregate(parsed.rows);
    const ms = performance.now() - t0;
    return { parsed, agg, ms };
  }, [csvText]);

  const loadExample = () => {
    setCsvText(DEMO_SAMPLE[lang]);
    setSrcLabel(t.srcExample);
    setPasteOpen(false);
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCsvText(String(reader.result ?? ""));
      setSrcLabel(f.name);
      setPasteOpen(false);
    };
    reader.readAsText(f);
    e.target.value = "";
  };

  const computePaste = () => {
    if (pasteText.trim() === "") return;
    setCsvText(pasteText);
    setSrcLabel(t.srcPaste);
  };

  const downloadCsv = () => {
    if (!result) return;
    /* BOM — Excel PL poprawnie otwiera UTF-8 */
    const blob = new Blob(["\uFEFF" + projectsToCsv(result.agg, lang)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "klarow-demo-raport.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const agg = result?.agg;
  const hasData = !!agg && agg.totals.rowCount > 0;
  const worst =
    agg && agg.projects.length > 0
      ? agg.projects.reduce((a, b) => (b.deviation > a.deviation ? b : a))
      : null;

  return (
    <div>
      {/* pasek wejścia */}
      <div className="card" style={{ padding: 18 }}>
        <div className="flex flex-wrap items-center gap-2.5">
          <button className="btn btn-secondary btn-sm" type="button" onClick={loadExample}>
            <Play size={14} /> {t.loadExample}
          </button>
          <button
            className="btn btn-secondary btn-sm"
            type="button"
            aria-expanded={pasteOpen}
            onClick={() => setPasteOpen((v) => !v)}
          >
            <ClipboardPaste size={14} /> {t.paste}
          </button>
          <button className="btn btn-secondary btn-sm" type="button" onClick={() => fileRef.current?.click()}>
            <FileUp size={14} /> {t.upload}
          </button>
          <input ref={fileRef} type="file" accept=".csv,.txt,text/csv,text/plain" hidden onChange={onFile} />
          {srcLabel !== "" && <span className="chip">{srcLabel}</span>}
        </div>
        <p className="mt-3 text-[11.5px]" style={{ color: "var(--muted-foreground)" }}>
          {t.formatHint}
        </p>
        {pasteOpen && (
          <div className="mt-3">
            <textarea
              className="textarea"
              rows={7}
              spellCheck={false}
              placeholder={t.pastePh}
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              style={{ fontVariantNumeric: "tabular-nums" }}
            />
            <div className="mt-2.5 flex gap-2">
              <button className="btn btn-secondary btn-sm" type="button" onClick={computePaste}>
                {t.compute}
              </button>
              <button className="btn btn-ghost btn-sm" type="button" onClick={() => setPasteOpen(false)}>
                {t.close}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* stan pusty — tu żyje jedyny btn-primary sekcji */}
      {result === null && (
        <div className="empty mt-4">
          <FileSpreadsheet className="e-ico" />
          <div className="e-title">{t.emptyTitle}</div>
          <p>{t.emptyBody}</p>
          <button className="btn btn-primary" type="button" onClick={loadExample}>
            <Play size={15} /> {t.loadExample}
          </button>
        </div>
      )}

      {/* błędy walidacji wejścia */}
      {result && result.parsed.errors.length > 0 && (
        <div className="err mt-4" role="alert">
          <strong>{t.errTitle}</strong>
          <ul className="mt-1.5 flex flex-col gap-0.5 text-[12.5px]">
            {result.parsed.errors.slice(0, 8).map((e, i) => (
              <li key={i}>
                {t.errLine} {e.line}: {pick(lang, e.msg)}
              </li>
            ))}
            {result.parsed.errors.length > 8 && <li>… +{result.parsed.errors.length - 8}</li>}
          </ul>
        </div>
      )}

      {/* raport */}
      {hasData && agg && (
        <div className="nc-tab-swap" key={`${agg.totals.rowCount}-${Math.round(agg.totals.budget)}-${Math.round(agg.totals.cost)}`}>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="card stat">
              <div className="lbl">{t.kBudget}</div>
              <div className="val tnum">{fmtMln(agg.totals.budget, lang)}</div>
              <div className="foot">{t.kBudgetFoot(agg.totals.projectCount, agg.totals.rowCount)}</div>
            </div>
            <div className="card stat">
              <div className="lbl">{t.kCost}</div>
              <div className="val tnum">{fmtMln(agg.totals.cost, lang)}</div>
              <div className="foot">{t.kCostFoot(fmtPct(agg.totals.costPct, lang), fmtPct(agg.totals.progress, lang))}</div>
            </div>
            <div className="card stat">
              <div className="lbl">{t.kRisk}</div>
              <div className="val tnum" style={agg.totals.atRisk > 0 ? { color: "var(--rejected)" } : undefined}>
                {agg.totals.atRisk} / {agg.totals.projectCount}
              </div>
              <div className="foot">
                {agg.totals.atRisk > 0 && worst ? t.kRiskFoot(worst.name) : t.kRiskFootOk}
              </div>
            </div>
          </div>

          <div className="card chart-card mt-4">
            <div className="chart-head">
              <div>
                <h3>{t.chartTitle}</h3>
                <div className="chart-sub">{t.chartSub}</div>
              </div>
              <span className="st st-gray st-open">{t.demoTag}</span>
            </div>
            <div className="chart-reveal">
              <StageChart agg={agg} lang={lang} t={t} />
            </div>
            <div className="legend">
              <span>
                <i style={{ background: "var(--primary)" }} /> {t.legProgress}
              </span>
              <span>
                <i style={{ background: "var(--funded)" }} /> {t.legOk}
              </span>
              <span>
                <i style={{ background: "var(--rejected)" }} /> {t.legOver(STAGE_TOLERANCE_PP)}
              </span>
            </div>
          </div>

          <div className="card mt-4">
            <h3 style={{ fontSize: 14, marginBottom: 12 }}>{t.tableTitle}</h3>
            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{t.thProject}</th>
                    <th className="num">{t.thBudget}</th>
                    <th className="num">{t.thCost}</th>
                    <th className="num">{t.thProgress}</th>
                    <th className="num">{t.thDev}</th>
                    <th>{t.thStatus}</th>
                    <th>{t.thComment}</th>
                  </tr>
                </thead>
                <tbody>
                  {agg.projects.map((p) => (
                    <tr key={p.name}>
                      <td>
                        <strong>{p.name}</strong>
                      </td>
                      <td className="num nowrap">{fmtAmount(p.budget, lang)}</td>
                      <td className="num nowrap">{fmtAmount(p.cost, lang)}</td>
                      <td className="num">{fmtPct(p.progress, lang, 0)}</td>
                      <td className="num nowrap" style={{ color: devColor(p.deviation) }}>
                        {fmtPp(p.deviation, lang)}
                      </td>
                      <td>{statusChip(p.status, t)}</td>
                      <td className="text-[12.5px]" style={{ color: "var(--muted-foreground)", maxWidth: 260 }}>
                        {p.comment === "" ? "—" : p.comment}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td>
                      <strong>{t.total}</strong>
                    </td>
                    <td className="num nowrap">
                      <strong>{fmtAmount(agg.totals.budget, lang)}</strong>
                    </td>
                    <td className="num nowrap">
                      <strong>{fmtAmount(agg.totals.cost, lang)}</strong>
                    </td>
                    <td className="num">
                      <strong>{fmtPct(agg.totals.progress, lang, 0)}</strong>
                    </td>
                    <td className="num nowrap" style={{ color: devColor(agg.totals.deviation) }}>
                      <strong>{fmtPp(agg.totals.deviation, lang)}</strong>
                    </td>
                    <td></td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button className="btn btn-ghost btn-sm" type="button" aria-expanded={showPath} onClick={() => setShowPath((v) => !v)}>
              <Info size={14} /> {t.pathBtn}
            </button>
            <button className="btn btn-secondary btn-sm" type="button" onClick={downloadCsv}>
              <Download size={14} /> {t.downloadBtn}
            </button>
          </div>

          {showPath && (
            <div className="card mt-3" style={{ padding: 18 }}>
              <div className="lbl-sm" style={{ marginBottom: 8 }}>{t.pathTitle}</div>
              <p className="text-[12.5px]" style={{ color: "var(--muted-foreground)" }}>{t.pathIntro}</p>
              <ul className="mt-3 flex flex-col gap-1.5 text-[12.5px] tnum" style={{ color: "var(--foreground)" }}>
                <li>{t.path1(fmtAmount(agg.totals.cost, lang), fmtAmount(agg.totals.budget, lang), fmtPct(agg.totals.costPct, lang))}</li>
                <li>{t.path2(fmtPct(agg.totals.progress, lang))}</li>
                <li>{t.path3(fmtPct(agg.totals.costPct, lang), fmtPct(agg.totals.progress, lang), fmtPp(agg.totals.deviation, lang))}</li>
                <li>{t.path4}</li>
              </ul>
            </div>
          )}

          <div className="legend">
            <span>{t.footFake}</span>
            <span>{t.footLocal}</span>
            <span className="tnum">{t.footMs(result!.ms.toLocaleString(lang === "pl" ? "pl-PL" : "en-US", { maximumFractionDigits: 1 }))}</span>
          </div>
        </div>
      )}
    </div>
  );
}
