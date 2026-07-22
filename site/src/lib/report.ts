import type { Lang } from "@/i18n";

/* Silnik DEMO „Raport zarządczy” (M2) — czyste funkcje, 100% deterministyczne:
   parseCsv (autodetekcja separatora ; \t , + tolerancyjne nagłówki PL/EN)
   → aggregate (projekty, etapy, sumy portfela). Zero sieci, zero losowości,
   zero dat systemowych — te same dane zawsze dają ten sam wynik (jawna
   ścieżka wyliczenia jest pokazywana w UI). Odtworzenie wzorca od zera —
   żaden kod nie pochodzi z wcześniejszych wdrożeń. */

export interface ParsedRow {
  line: number;
  project: string;
  stage: string;
  budget: number;
  cost: number;
  progress: number; // 0–100
  comment: string;
}

export interface ParseError {
  line: number;
  msg: { pl: string; en: string };
}

export interface ParseResult {
  rows: ParsedRow[];
  errors: ParseError[];
}

export type RowStatus = "ok" | "watch" | "risk";

export interface ProjectAgg {
  name: string;
  budget: number;
  cost: number;
  costPct: number;
  progress: number;
  deviation: number; // p.p. = costPct − progress; dodatnie = koszt wyprzedza postęp
  status: RowStatus;
  criticalStage: string;
  comment: string;
}

export interface StageAgg {
  name: string;
  budget: number;
  cost: number;
  costPct: number;
  progress: number;
  deviation: number;
}

export interface ReportAgg {
  projects: ProjectAgg[];
  stages: StageAgg[];
  totals: {
    budget: number;
    cost: number;
    costPct: number;
    progress: number;
    deviation: number;
    atRisk: number;
    projectCount: number;
    rowCount: number;
  };
}

/* Progi statusu (jawne — pokazywane w „ścieżce wyliczenia”): */
export const OK_PP = 2; // odchylenie ≤ 2 p.p. → OK
export const RISK_PP = 8; // odchylenie > 8 p.p. → ryzyko; pomiędzy → obserwuj
export const STAGE_TOLERANCE_PP = 3; // wykres per-etap: koszt% > postęp% + 3 p.p. → przekroczenie

const strip = (s: string) =>
  s
    .toLowerCase()
    .replace(/ł/g, "l")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\[.*?\]/g, "")
    .trim();

const HEADER_ALIASES: Record<keyof Omit<ParsedRow, "line">, string[]> = {
  project: ["projekt", "project", "inwestycja", "nazwa"],
  stage: ["etap", "stage", "faza", "phase"],
  budget: ["budzet", "budget", "plan"],
  cost: ["koszt", "cost", "actual", "wykonanie kosztowe"],
  progress: ["zaawansowanie", "postep", "progress", "wykonanie", "completion"],
  comment: ["komentarz", "comment", "uwagi", "notes"],
};

function detectSeparator(headerLine: string): string {
  const candidates = [";", "\t", ","];
  let best = ";";
  let bestCount = -1;
  for (const c of candidates) {
    const n = headerLine.split(c).length - 1;
    if (n > bestCount) {
      best = c;
      bestCount = n;
    }
  }
  return best;
}

function parseNumber(raw: string): number {
  const cleaned = raw.replace(/[\s ]/g, "").replace(/z[lł]$/i, "").replace(",", ".");
  if (cleaned === "") return NaN;
  return Number(cleaned);
}

export function parseCsv(text: string): ParseResult {
  const rows: ParsedRow[] = [];
  const errors: ParseError[] = [];
  const lines = text.replace(/\r\n?/g, "\n").split("\n");

  let headerIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() !== "") {
      headerIdx = i;
      break;
    }
  }
  if (headerIdx === -1) {
    return { rows, errors: [{ line: 1, msg: { pl: "Pusty plik — brak danych.", en: "Empty file — no data." } }] };
  }

  const sep = detectSeparator(lines[headerIdx]);
  const headerCells = lines[headerIdx].split(sep).map(strip);

  const col: Partial<Record<keyof Omit<ParsedRow, "line">, number>> = {};
  headerCells.forEach((cell, idx) => {
    (Object.keys(HEADER_ALIASES) as (keyof typeof HEADER_ALIASES)[]).forEach((field) => {
      if (col[field] === undefined && HEADER_ALIASES[field].some((a) => cell.startsWith(a))) {
        col[field] = idx;
      }
    });
  });

  const required: (keyof typeof HEADER_ALIASES)[] = ["project", "stage", "budget", "cost", "progress"];
  const missing = required.filter((f) => col[f] === undefined);
  if (missing.length > 0) {
    return {
      rows,
      errors: [
        {
          line: headerIdx + 1,
          msg: {
            pl: `Nagłówek: nie rozpoznano kolumn: ${missing.join(", ")}. Oczekiwane: Projekt; Etap; Budżet; Koszt; Zaawansowanie; Komentarz.`,
            en: `Header: unrecognized columns: ${missing.join(", ")}. Expected: Project; Stage; Budget; Cost; Progress; Comment.`,
          },
        },
      ],
    };
  }

  for (let i = headerIdx + 1; i < lines.length; i++) {
    const raw = lines[i];
    if (raw.trim() === "") continue;
    const lineNo = i + 1;
    const cells = raw.split(sep);

    const project = (cells[col.project!] ?? "").trim();
    const stage = (cells[col.stage!] ?? "").trim();
    if (project === "" || stage === "") {
      errors.push({
        line: lineNo,
        msg: { pl: "Brak nazwy projektu lub etapu.", en: "Missing project or stage name." },
      });
      continue;
    }

    const budget = parseNumber(cells[col.budget!] ?? "");
    const cost = parseNumber(cells[col.cost!] ?? "");
    const progress = parseNumber((cells[col.progress!] ?? "").replace("%", ""));

    if (!Number.isFinite(budget) || budget < 0) {
      errors.push({ line: lineNo, msg: { pl: "Budżet nie jest poprawną liczbą.", en: "Budget is not a valid number." } });
      continue;
    }
    if (!Number.isFinite(cost) || cost < 0) {
      errors.push({ line: lineNo, msg: { pl: "Koszt nie jest poprawną liczbą.", en: "Cost is not a valid number." } });
      continue;
    }
    if (!Number.isFinite(progress) || progress < 0 || progress > 100) {
      errors.push({
        line: lineNo,
        msg: { pl: "Zaawansowanie musi być liczbą 0–100.", en: "Progress must be a number 0–100." },
      });
      continue;
    }

    rows.push({
      line: lineNo,
      project,
      stage,
      budget,
      cost,
      progress,
      comment: col.comment !== undefined ? (cells[col.comment] ?? "").trim() : "",
    });
  }

  return { rows, errors };
}

const statusOf = (deviation: number): RowStatus =>
  deviation <= OK_PP ? "ok" : deviation <= RISK_PP ? "watch" : "risk";

const pct = (num: number, den: number) => (den > 0 ? (num / den) * 100 : 0);

export function aggregate(rows: ParsedRow[]): ReportAgg {
  const projOrder: string[] = [];
  const stageOrder: string[] = [];
  const byProject = new Map<string, ParsedRow[]>();
  const byStage = new Map<string, ParsedRow[]>();

  for (const r of rows) {
    if (!byProject.has(r.project)) {
      byProject.set(r.project, []);
      projOrder.push(r.project);
    }
    if (!byStage.has(r.stage)) {
      byStage.set(r.stage, []);
      stageOrder.push(r.stage);
    }
    byProject.get(r.project)!.push(r);
    byStage.get(r.stage)!.push(r);
  }

  const projects: ProjectAgg[] = projOrder.map((name) => {
    const rs = byProject.get(name)!;
    const budget = rs.reduce((s, r) => s + r.budget, 0);
    const cost = rs.reduce((s, r) => s + r.cost, 0);
    const progress = budget > 0 ? rs.reduce((s, r) => s + r.budget * r.progress, 0) / budget : 0;
    const costPct = pct(cost, budget);
    const deviation = costPct - progress;

    /* etap krytyczny = wiersz o największym odchyleniu koszt% − postęp% */
    let critical = rs[0];
    let criticalDev = -Infinity;
    for (const r of rs) {
      const d = pct(r.cost, r.budget) - r.progress;
      if (d > criticalDev) {
        criticalDev = d;
        critical = r;
      }
    }
    /* komentarz PM: z wiersza o największym odchyleniu spośród skomentowanych */
    let comment = "";
    let commentDev = -Infinity;
    let commentStage = "";
    for (const r of rs) {
      if (r.comment === "") continue;
      const d = pct(r.cost, r.budget) - r.progress;
      if (d > commentDev) {
        commentDev = d;
        comment = r.comment;
        commentStage = r.stage;
      }
    }

    return {
      name,
      budget,
      cost,
      costPct,
      progress,
      deviation,
      status: statusOf(deviation),
      criticalStage: critical.stage,
      comment: comment === "" ? "" : `${comment} (${commentStage})`,
    };
  });

  const stages: StageAgg[] = stageOrder.map((name) => {
    const rs = byStage.get(name)!;
    const budget = rs.reduce((s, r) => s + r.budget, 0);
    const cost = rs.reduce((s, r) => s + r.cost, 0);
    const progress = budget > 0 ? rs.reduce((s, r) => s + r.budget * r.progress, 0) / budget : 0;
    const costPct = pct(cost, budget);
    return { name, budget, cost, costPct, progress, deviation: costPct - progress };
  });

  const budget = projects.reduce((s, p) => s + p.budget, 0);
  const cost = projects.reduce((s, p) => s + p.cost, 0);
  const progress = budget > 0 ? projects.reduce((s, p) => s + p.budget * p.progress, 0) / budget : 0;
  const costPct = pct(cost, budget);

  return {
    projects,
    stages,
    totals: {
      budget,
      cost,
      costPct,
      progress,
      deviation: costPct - progress,
      atRisk: projects.filter((p) => p.status === "risk").length,
      projectCount: projects.length,
      rowCount: rows.length,
    },
  };
}

/* ── formatowanie (PL: 12 345 678 zł / EN: PLN 12,345,678) ── */

export function fmtAmount(v: number, lang: Lang): string {
  const n = Math.round(v).toLocaleString(lang === "pl" ? "pl-PL" : "en-US");
  return lang === "pl" ? `${n} zł` : `PLN ${n}`;
}

export function fmtMln(v: number, lang: Lang): string {
  const m = (v / 1_000_000).toLocaleString(lang === "pl" ? "pl-PL" : "en-US", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  return lang === "pl" ? `${m} mln zł` : `PLN ${m}M`;
}

export function fmtPct(v: number, lang: Lang, digits = 1): string {
  return `${v.toLocaleString(lang === "pl" ? "pl-PL" : "en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}%`;
}

export function fmtPp(v: number, lang: Lang): string {
  const sign = v > 0 ? "+" : "";
  const n = v.toLocaleString(lang === "pl" ? "pl-PL" : "en-US", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  return `${sign}${n} ${lang === "pl" ? "p.p." : "pp"}`;
}

/* eksport wyników per-projekt do CSV (dowód client-side: plik powstaje w przeglądarce) */
export function projectsToCsv(agg: ReportAgg, lang: Lang): string {
  const H =
    lang === "pl"
      ? ["Projekt", "Budżet", "Koszt", "Zaawansowanie %", "Wykorzystanie budżetu %", "Odchylenie p.p.", "Status", "Etap krytyczny", "Komentarz PM"]
      : ["Project", "Budget", "Cost", "Progress %", "Budget used %", "Deviation pp", "Status", "Critical stage", "PM comment"];
  const S: Record<RowStatus, string> =
    lang === "pl" ? { ok: "OK", watch: "Obserwuj", risk: "Ryzyko" } : { ok: "OK", watch: "Watch", risk: "Risk" };
  const lines = [H.join(";")];
  for (const p of agg.projects) {
    lines.push(
      [
        p.name,
        Math.round(p.budget),
        Math.round(p.cost),
        p.progress.toFixed(1),
        p.costPct.toFixed(1),
        p.deviation.toFixed(1),
        S[p.status],
        p.criticalStage,
        p.comment.replace(/;/g, ","),
      ].join(";")
    );
  }
  const t = agg.totals;
  lines.push(
    [
      lang === "pl" ? "RAZEM" : "TOTAL",
      Math.round(t.budget),
      Math.round(t.cost),
      t.progress.toFixed(1),
      t.costPct.toFixed(1),
      t.deviation.toFixed(1),
      "",
      "",
      "",
    ].join(";")
  );
  return lines.join("\n");
}
