/* Golden-test silnika „Audyt jakości danych" (src/lib/qualityGate.ts).
   Reguły strażnika: demo-golden-tests, demo-determinism, code-lint-and-tests-gate.

   Co sprawdza:
   1. dwa przebiegi na tym samym wejściu dają IDENTYCZNY wynik (deepStrictEqual + ten sam JSON),
   2. znane wejście daje znane wyjście: zamrożony golden znalezisk i macierzy, cztery reguły
      (PM_MINUS, NEG_WEEK, E_NONZERO, BAD_DATE), progi półgrosza i salda, tydzień ISO na
      przełomie roku,
   3. wynik nie zależy od strefy czasowej (ten sam JSON w dwóch procesach z różnym TZ).

   Golden zamraża STRUKTURĘ znalezisk (linia, inwestycja, severity, kod, komórka), a nie treść
   komunikatów: teksty PL/EN to copy i zmieni je sweep typograficzny fazy F0, a wtedy golden
   pilnowałby copy zamiast logiki. Obecność pary PL + EN i nazwy etapu w komunikacie sprawdzamy
   osobno, bez zamrażania całego zdania.

   Uruchomienie: npm run test (node --test --experimental-strip-types "src/lib/*.test.mjs"). */

import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { auditRows, fmtDate, isoWeekMonday, parseAudit } from "./qualityGate.ts";

/* TZ ustawiamy jawnie, żeby przebieg lokalny i CI liczyły w tych samych warunkach.
   W ESM importy wykonują się przed tą linią, więc to zabezpieczenie dla kodu testu,
   a nie dla silnika: silnik buduje daty przez Date.UTC z jawnego wejścia. */
process.env.TZ = "UTC";

/* determinizm: stała referencyjna tygodnia raportu, nie zegar systemowy */
const YEAR = 2026;
const WEEK = 30; // poniedziałek 20.07.2026, niedziela 26.07.2026

const CSV_AUDIT = [
  "Inwestycja;Etap;Estymacja PM;W tym tygodniu;Saldo;Data",
  "Hala A;Fundamenty;12000;3500;0;20.07.2026",
  "Hala A;Konstrukcja;-800;1200;0;22.07.2026",
  "Hala B;Fundamenty;9000;-250;0;2026-07-23",
  "Hala B;Wykończenie;4000;1000;12,5;24.07.2026",
  "Hala C;Fundamenty;1000;500;0;15.07.2026",
  "Hala C;Konstrukcja;1000;500;0;32.07.2026",
].join("\n");

const CSV_CLEAN = ["Inwestycja;Etap;Estymacja PM;W tym tygodniu;Saldo;Data", "Hala A;Fundamenty;12000;3500;0;20.07.2026"].join("\n");

const CASES = { audit: CSV_AUDIT, clean: CSV_CLEAN, empty: "", header_only: "Inwestycja;Etap", no_columns: "Kolumna;Inna\na;b" };

/* Struktura znalezisk dla CSV_AUDIT w tygodniu 30/2026. Zmiana tych liczb bez zmiany
   danych wejściowych oznacza zmianę zachowania silnika: sprawdź, czy jest zamierzona. */
const GOLDEN_AUDIT = `{
  "findings": [
    { "line": 3, "investment": "Hala A", "severity": "error", "code": "PM_MINUS", "cell": "Konstrukcja" },
    { "line": 4, "investment": "Hala B", "severity": "warn", "code": "NEG_WEEK", "cell": "Fundamenty" },
    { "line": 5, "investment": "Hala B", "severity": "error", "code": "E_NONZERO", "cell": "Wykończenie" },
    { "line": 6, "investment": "Hala C", "severity": "error", "code": "BAD_DATE", "cell": "Fundamenty" },
    { "line": 7, "investment": "Hala C", "severity": "error", "code": "BAD_DATE", "cell": "Konstrukcja" }
  ],
  "matrix": [
    { "investment": "Hala A", "status": "error", "errors": 1, "warns": 0, "rows": 2 },
    { "investment": "Hala B", "status": "error", "errors": 1, "warns": 1, "rows": 2 },
    { "investment": "Hala C", "status": "error", "errors": 2, "warns": 0, "rows": 2 }
  ],
  "totals": { "investments": 3, "rows": 6, "errors": 4, "warns": 1, "clean": false }
}`;

/* projekcja bez treści komunikatów, w jednej linii na wpis (czytelny diff w PR) */
const slim = (res) => {
  const one = (o) => `{ ${Object.entries(o).map(([k, v]) => `"${k}": ${JSON.stringify(v)}`).join(", ")} }`;
  const findings = res.findings.map((f) => one({ line: f.line, investment: f.investment, severity: f.severity, code: f.code, cell: f.cell }));
  const matrix = res.matrix.map((m) => one({ investment: m.investment, status: m.status, errors: m.errors, warns: m.warns, rows: m.rows }));
  const totals = one(res.totals);
  return [
    "{",
    '  "findings": [',
    findings.map((f) => `    ${f}`).join(",\n"),
    "  ],",
    '  "matrix": [',
    matrix.map((m) => `    ${m}`).join(",\n"),
    "  ],",
    `  "totals": ${totals}`,
    "}",
  ].join("\n");
};

const run = (csv) => auditRows(csv, YEAR, WEEK);

test("dwa przebiegi na tym samym wejściu dają identyczny wynik", () => {
  for (const [name, csv] of Object.entries(CASES)) {
    const a = run(csv);
    const b = run(csv);
    assert.deepStrictEqual(a, b, name);
    assert.equal(JSON.stringify(a), JSON.stringify(b), name);
  }
});

test("golden: zamrożona struktura znalezisk i macierzy", () => {
  assert.equal(slim(run(CSV_AUDIT)), GOLDEN_AUDIT);
});

test("cztery reguły bramki zapalają się na właściwych wierszach", () => {
  const res = run(CSV_AUDIT);
  assert.deepStrictEqual(res.findings.map((f) => f.code), ["PM_MINUS", "NEG_WEEK", "E_NONZERO", "BAD_DATE", "BAD_DATE"]);
  /* severity: ujemny tydzień to ostrzeżenie, reszta to błędy */
  assert.deepStrictEqual(res.findings.map((f) => f.severity), ["error", "warn", "error", "error", "error"]);
  assert.equal(res.totals.clean, false);

  /* komunikat ma parę PL + EN; trzy reguły nazywają etap, BAD_DATE nazywa datę wpisu
     (treść zdań nie jest zamrożona, sprawdzamy tylko, że wskazują miejsce w pliku) */
  for (const f of res.findings) {
    assert.ok(f.msg.pl.length > 0 && f.msg.en.length > 0, f.code);
    assert.notEqual(f.msg.pl, f.msg.en, f.code);
    if (f.code === "BAD_DATE") assert.ok(/\d{2}\.\d{2}\.\d{4}/.test(f.msg.pl), "BAD_DATE: komunikat bez daty");
    else assert.ok(f.msg.pl.includes(f.cell), `${f.code}: komunikat bez nazwy etapu`);
  }

  const clean = run(CSV_CLEAN);
  assert.deepStrictEqual(clean.findings, []);
  assert.equal(clean.totals.clean, true);
  assert.deepStrictEqual(clean.matrix, [{ investment: "Hala A", status: "ok", errors: 0, warns: 0, rows: 1 }]);
});

test("progi: pół grosza dla kwot i 1e-6 dla salda kontrolnego", () => {
  const below = ["Inwestycja;Etap;Estymacja PM;W tym tygodniu;Saldo", "Hala E;Etap;0;-0,004;0,0000001"].join("\n");
  assert.deepStrictEqual(run(below).findings, []);

  const above = ["Inwestycja;Etap;Estymacja PM;W tym tygodniu;Saldo", "Hala E;Etap;-0,01;-0,01;0,01"].join("\n");
  assert.deepStrictEqual(run(above).findings.map((f) => f.code), ["PM_MINUS", "NEG_WEEK", "E_NONZERO"]);
});

test("data wpisu: oba formaty, granice tygodnia raportu", () => {
  const rows = (date) => ["Inwestycja;Etap;Data", `Hala A;Fundamenty;${date}`].join("\n");
  const codes = (date) => run(rows(date)).findings.map((f) => f.code);

  assert.deepStrictEqual(codes("20.07.2026"), [], "poniedziałek tygodnia raportu");
  assert.deepStrictEqual(codes("2026-07-26"), [], "niedziela tygodnia raportu, format ISO");
  assert.deepStrictEqual(codes("19.07.2026"), ["BAD_DATE"], "dzień przed tygodniem");
  assert.deepStrictEqual(codes("27.07.2026"), ["BAD_DATE"], "dzień po tygodniu");
  assert.deepStrictEqual(codes("wczoraj"), ["BAD_DATE"], "data nie do sparsowania");
  assert.deepStrictEqual(codes(""), [], "brak daty nie jest błędem");

  /* Date.UTC przelicza dzień 32 na 1. sierpnia, więc wpis i tak wypada poza tydzień.
     Zachowanie zamrożone świadomie: silnik nie odrzuca przepełnionych dat osobnym kodem. */
  const overflow = parseAudit(rows("32.07.2026"));
  assert.equal(overflow.rows[0].date.toISOString(), "2026-08-01T00:00:00.000Z");
  assert.deepStrictEqual(codes("32.07.2026"), ["BAD_DATE"]);

  assert.equal(fmtDate(new Date(Date.UTC(2026, 6, 20))), "20.07.2026");
});

test("tydzień ISO: poniedziałki na przełomie roku", () => {
  const iso = (y, w) => isoWeekMonday(y, w).toISOString().slice(0, 10);
  assert.equal(iso(2024, 1), "2024-01-01");
  assert.equal(iso(2025, 1), "2024-12-30"); // tydzień 1/2025 zaczyna się w grudniu 2024
  assert.equal(iso(2026, 1), "2025-12-29"); // tydzień 1/2026 zaczyna się w grudniu 2025
  assert.equal(iso(2026, WEEK), "2026-07-20");
  assert.equal(iso(2026, 53), "2026-12-28"); // rok 2026 ma 53 tygodnie ISO
  assert.equal(iso(2027, 1), "2027-01-04");

  /* niezmiennik: zawsze poniedziałek, a tydzień 1 zawsze zawiera 4 stycznia */
  for (let y = 2020; y <= 2035; y++) {
    const monday = isoWeekMonday(y, 1);
    assert.equal(monday.getUTCDay(), 1, `${y}: nie poniedziałek`);
    const jan4 = Date.UTC(y, 0, 4);
    const diff = (jan4 - monday.getTime()) / 86400000;
    assert.ok(diff >= 0 && diff <= 6, `${y}: tydzień 1 nie zawiera 4 stycznia`);
  }
});

test("parsowanie: pusty plik, brak kolumn, brak nazwy inwestycji", () => {
  const empty = parseAudit("");
  assert.deepStrictEqual(empty.rows, []);
  assert.equal(empty.parseIssues.length, 1);
  assert.equal(empty.parseIssues[0].line, 1);
  assert.ok(empty.parseIssues[0].msg.pl.startsWith("Pusty plik"));

  const noColumns = parseAudit("Kolumna;Inna\na;b");
  assert.deepStrictEqual(noColumns.rows, []);
  assert.deepStrictEqual(noColumns.parseIssues.map((i) => i.line), [1]);

  const noName = parseAudit(["Inwestycja;Etap", "Hala A;Fundamenty", ";Konstrukcja"].join("\n"));
  assert.equal(noName.rows.length, 1);
  assert.deepStrictEqual(noName.parseIssues.map((i) => i.line), [3]);

  /* brak kolumn liczbowych: zera zamiast NaN, zero znalezisk */
  const minimal = run(["Inwestycja;Etap", "Hala A;Fundamenty"].join("\n"));
  assert.deepStrictEqual(minimal.rows[0], {
    line: 2,
    investment: "Hala A",
    stage: "Fundamenty",
    pmEstimate: 0,
    weekAmount: 0,
    balance: 0,
    date: null,
    dateRaw: "",
  });
  assert.deepStrictEqual(minimal.findings, []);
});

/* Strefa czasowa: ustawienie process.env.TZ w trakcie życia procesu nie jest na Windows
   wiarygodne, więc porównujemy dwa OSOBNE procesy Node z różnym TZ (to jest warunek
   z reguły demo-golden-tests: wynik ma nie zależeć od środowiska). */
const auditInTz = (tz, csv) => {
  const engine = JSON.stringify(new URL("./qualityGate.ts", import.meta.url).href);
  const code = [
    `import { auditRows } from ${engine};`,
    `process.stdout.write(JSON.stringify(auditRows(process.argv[1], ${YEAR}, ${WEEK})));`,
  ].join("\n");
  const child = spawnSync(process.execPath, ["--experimental-strip-types", "--input-type=module", "-e", code, csv], {
    encoding: "utf8",
    env: { ...process.env, TZ: tz },
  });
  assert.equal(child.status, 0, child.stderr);
  return child.stdout;
};

test("wynik nie zależy od strefy czasowej", () => {
  const utc = auditInTz("UTC", CSV_AUDIT);
  const kiritimati = auditInTz("Pacific/Kiritimati", CSV_AUDIT); // UTC+14
  const honolulu = auditInTz("Pacific/Honolulu", CSV_AUDIT); // UTC-10
  assert.equal(utc, kiritimati);
  assert.equal(utc, honolulu);
  assert.equal(utc, JSON.stringify(run(CSV_AUDIT)));
});
