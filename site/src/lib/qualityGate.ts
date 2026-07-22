/* Silnik „Audytu jakości danych" — odbrandowane, deterministyczne odtworzenie
   bramki jakości plików budżetowych (read-only). 1:1 co do reguł, ale na
   danych fikcyjnych i bez marki źródłowej (zasada #3). Zero sieci/losowości.

   Reguły (z blueprintu „Globalna Formuła Sprawdzająca"):
   - estymacja PM < 0            → BŁĄD  (PM_MINUS)      — PM estymuje na minusie
   - „w tym tygodniu" < 0        → UWAGA (NEG)           — ujemna kwota tygodnia
   - saldo kontrolne (E) ≠ 0     → BŁĄD  (E_NONZERO)     — rozjazd salda
   - data wpisu poza tygodniem   → BŁĄD  (BAD_DATE)      — zły stempel daty
   Wynik: znaleziska + macierz pewności OK / UWAGA / BŁĄD per inwestycja. */

export type Severity = "error" | "warn";

export interface AuditRow {
  line: number;
  investment: string;
  stage: string;
  pmEstimate: number;
  weekAmount: number;
  balance: number;
  date: Date | null;
  dateRaw: string;
}

export interface Finding {
  line: number;
  investment: string;
  severity: Severity;
  code: string;
  msg: { pl: string; en: string };
  cell: string;
}

export interface ParseIssue {
  line: number;
  msg: { pl: string; en: string };
}

export type InvStatus = "ok" | "warn" | "error";

export interface InvResult {
  investment: string;
  status: InvStatus;
  errors: number;
  warns: number;
  rows: number;
}

export interface AuditResult {
  rows: AuditRow[];
  parseIssues: ParseIssue[];
  findings: Finding[];
  matrix: InvResult[];
  totals: { investments: number; rows: number; errors: number; warns: number; clean: boolean };
}

const NEG_EPSILON = 0.005; // pół grosza
const E_EPSILON = 1e-6;

const strip = (s: string) =>
  s
    .toLowerCase()
    .replace(/ł/g, "l")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\[.*?\]/g, "")
    .trim();

const HEADER_ALIASES = {
  investment: ["inwestycja", "investment", "projekt", "project"],
  stage: ["etap", "stage", "faza"],
  pmEstimate: ["estymacja pm", "estymacja", "pm estimate", "estimate"],
  weekAmount: ["w tym tygodniu", "tydzien", "this week", "week amount"],
  balance: ["saldo", "kontrola", "balance", "check"],
  date: ["data", "date"],
} as const;

type Field = keyof typeof HEADER_ALIASES;

function detectSeparator(header: string): string {
  const cands = [";", "\t", ","];
  let best = ";";
  let bestN = -1;
  for (const c of cands) {
    const n = header.split(c).length - 1;
    if (n > bestN) {
      best = c;
      bestN = n;
    }
  }
  return best;
}

function parseNumber(raw: string): number {
  const c = raw.replace(/[\s ]/g, "").replace(/z[lł]$/i, "").replace(/%$/, "").replace(",", ".");
  if (c === "") return NaN;
  return Number(c);
}

/* daty: DD.MM.YYYY | YYYY-MM-DD (UTC, bez dryfu strefy) */
function parseDate(raw: string): Date | null {
  const s = raw.trim();
  let m = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/.exec(s);
  if (m) return new Date(Date.UTC(+m[3], +m[2] - 1, +m[1]));
  m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(s);
  if (m) return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  return null;
}

/* poniedziałek tygodnia ISO danego roku (dla kontroli daty wpisu) */
export function isoWeekMonday(year: number, week: number): Date {
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const dow = (jan4.getUTCDay() + 6) % 7; // Mon=0
  const week1Mon = new Date(jan4);
  week1Mon.setUTCDate(jan4.getUTCDate() - dow);
  const mon = new Date(week1Mon);
  mon.setUTCDate(week1Mon.getUTCDate() + (week - 1) * 7);
  return mon;
}

export function fmtDate(d: Date | null): string {
  if (!d) return "—";
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getUTCDate())}.${p(d.getUTCMonth() + 1)}.${d.getUTCFullYear()}`;
}

export function parseAudit(text: string): { rows: AuditRow[]; parseIssues: ParseIssue[] } {
  const rows: AuditRow[] = [];
  const parseIssues: ParseIssue[] = [];
  const lines = text.replace(/\r\n?/g, "\n").split("\n");

  let hIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() !== "") {
      hIdx = i;
      break;
    }
  }
  if (hIdx === -1) return { rows, parseIssues: [{ line: 1, msg: { pl: "Pusty plik.", en: "Empty file." } }] };

  const sep = detectSeparator(lines[hIdx]);
  const header = lines[hIdx].split(sep).map(strip);
  const col: Partial<Record<Field, number>> = {};
  header.forEach((cell, idx) => {
    (Object.keys(HEADER_ALIASES) as Field[]).forEach((f) => {
      if (col[f] === undefined && HEADER_ALIASES[f].some((a) => cell.startsWith(a))) col[f] = idx;
    });
  });

  const required: Field[] = ["investment", "stage"];
  const missing = required.filter((f) => col[f] === undefined);
  if (missing.length) {
    return {
      rows,
      parseIssues: [
        {
          line: hIdx + 1,
          msg: {
            pl: "Nagłówek: wymagane kolumny Inwestycja i Etap.",
            en: "Header: Investment and Stage columns are required.",
          },
        },
      ],
    };
  }

  for (let i = hIdx + 1; i < lines.length; i++) {
    const raw = lines[i];
    if (raw.trim() === "") continue;
    const cells = raw.split(sep);
    const investment = (cells[col.investment!] ?? "").trim();
    const stage = (cells[col.stage!] ?? "").trim();
    if (investment === "") {
      parseIssues.push({ line: i + 1, msg: { pl: "Brak nazwy inwestycji.", en: "Missing investment name." } });
      continue;
    }
    const num = (f: Field) => (col[f] !== undefined ? parseNumber(cells[col[f]!] ?? "") : 0);
    const dateRaw = col.date !== undefined ? (cells[col.date] ?? "").trim() : "";
    rows.push({
      line: i + 1,
      investment,
      stage,
      pmEstimate: num("pmEstimate"),
      weekAmount: num("weekAmount"),
      balance: num("balance"),
      date: dateRaw ? parseDate(dateRaw) : null,
      dateRaw,
    });
  }
  return { rows, parseIssues };
}

export function auditRows(text: string, year: number, week: number): AuditResult {
  const { rows, parseIssues } = parseAudit(text);
  const findings: Finding[] = [];
  const monday = isoWeekMonday(year, week);
  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);

  for (const r of rows) {
    if (Number.isFinite(r.pmEstimate) && r.pmEstimate < -NEG_EPSILON) {
      findings.push({
        line: r.line,
        investment: r.investment,
        severity: "error",
        code: "PM_MINUS",
        msg: {
          pl: `PM estymuje na minusie na etapie „${r.stage}” (${r.pmEstimate.toLocaleString("pl-PL")})`,
          en: `PM estimate is negative at stage “${r.stage}” (${r.pmEstimate.toLocaleString("en-US")})`,
        },
        cell: r.stage,
      });
    }
    if (Number.isFinite(r.weekAmount) && r.weekAmount < -NEG_EPSILON) {
      findings.push({
        line: r.line,
        investment: r.investment,
        severity: "warn",
        code: "NEG_WEEK",
        msg: {
          pl: `Ujemna kwota „w tym tygodniu” na etapie „${r.stage}” (${r.weekAmount.toLocaleString("pl-PL")})`,
          en: `Negative “this week” amount at stage “${r.stage}” (${r.weekAmount.toLocaleString("en-US")})`,
        },
        cell: r.stage,
      });
    }
    if (Number.isFinite(r.balance) && Math.abs(r.balance) > E_EPSILON) {
      findings.push({
        line: r.line,
        investment: r.investment,
        severity: "error",
        code: "E_NONZERO",
        msg: {
          pl: `Rozjazd salda kontrolnego na etapie „${r.stage}” (powinno być 0, jest ${r.balance.toLocaleString("pl-PL")})`,
          en: `Control balance mismatch at stage “${r.stage}” (should be 0, is ${r.balance.toLocaleString("en-US")})`,
        },
        cell: r.stage,
      });
    }
    if (r.dateRaw !== "") {
      const outside = r.date === null || r.date < monday || r.date > sunday;
      if (outside) {
        findings.push({
          line: r.line,
          investment: r.investment,
          severity: "error",
          code: "BAD_DATE",
          msg: {
            pl: `Data wpisu ${r.date ? fmtDate(r.date) : `„${r.dateRaw}”`} poza tygodniem raportu (${fmtDate(monday)}–${fmtDate(sunday)})`,
            en: `Entry date ${r.date ? fmtDate(r.date) : `“${r.dateRaw}”`} outside the report week (${fmtDate(monday)}–${fmtDate(sunday)})`,
          },
          cell: r.stage,
        });
      }
    }
  }

  // macierz per inwestycja (kolejność wystąpienia)
  const order: string[] = [];
  const byInv = new Map<string, InvResult>();
  for (const r of rows) {
    if (!byInv.has(r.investment)) {
      byInv.set(r.investment, { investment: r.investment, status: "ok", errors: 0, warns: 0, rows: 0 });
      order.push(r.investment);
    }
    byInv.get(r.investment)!.rows++;
  }
  for (const f of findings) {
    const inv = byInv.get(f.investment);
    if (!inv) continue;
    if (f.severity === "error") inv.errors++;
    else inv.warns++;
  }
  for (const inv of byInv.values()) inv.status = inv.errors > 0 ? "error" : inv.warns > 0 ? "warn" : "ok";

  const matrix = order.map((n) => byInv.get(n)!);
  const errors = findings.filter((f) => f.severity === "error").length;
  const warns = findings.filter((f) => f.severity === "warn").length;

  return {
    rows,
    parseIssues,
    findings,
    matrix,
    totals: { investments: matrix.length, rows: rows.length, errors, warns, clean: errors === 0 },
  };
}
