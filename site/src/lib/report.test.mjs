/* Golden-test silnika „Raport zarządczy" (src/lib/report.ts).
   Reguły strażnika: demo-golden-tests, demo-determinism, code-lint-and-tests-gate.

   Co sprawdza:
   1. dwa przebiegi na tym samym wejściu dają IDENTYCZNY wynik (deepStrictEqual + ten sam JSON),
   2. znane wejście daje znane wyjście (zamrożony golden + wartości brzegowe),
   3. wynik nie zależy od strefy czasowej (ten sam JSON w dwóch procesach z różnym TZ),
   4. wynik nie zależy od separatora ani od języka nagłówków.

   Uruchomienie: npm run test (node --test --experimental-strip-types "src/lib/*.test.mjs").
   Plik jest testem, nie silnikiem: nie wchodzi do bundla, bo nikt go nie importuje.

   Aktualizacja goldenów: świadomie, w commicie „Demo: nowy golden report (powód)",
   po sprawdzeniu, że zmiana liczb jest zamierzona. */

import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { aggregate, fmtAmount, fmtMln, fmtPct, fmtPp, parseCsv, projectsToCsv } from "./report.ts";

/* TZ ustawiamy jawnie, żeby przebieg lokalny i CI liczyły w tych samych warunkach.
   W ESM importy wykonują się przed tą linią, więc to zabezpieczenie dla kodu testu,
   a nie dla silnika: silnik nie czyta zegara ani strefy (demo-determinism). */
process.env.TZ = "UTC";

const NBSP = " ";

/* Dane fikcyjne: trzy inwestycje, dwa komentarze PM, jedna kwota z groszami
   i separatorem tysięcy w postaci spacji nierozdzielającej (tak wygląda wklejka z Excela). */
const CSV_DEMO = [
  "Projekt;Etap;Budżet;Koszt;Zaawansowanie;Komentarz",
  `Hala A;Fundamenty;120${NBSP}000 zł;72${NBSP}000 zł;55;Zbrojenie droższe niż w ofercie`,
  "Hala A;Konstrukcja;300000;96000;40;",
  "Hala B;Fundamenty;80000;40000;50;",
  "Hala B;Wykończenie;200000;180000;60;Podwykonawca spóźnia dostawy",
  "Hala C;Fundamenty;1 234,56;617,28;50;",
].join("\n");

const CSV_SINGLE = ["Projekt;Etap;Budzet;Koszt;Zaawansowanie", "Hala A;Fundamenty;100000;25000;20"].join("\n");

const CSV_BAD = [
  "Projekt;Etap;Budzet;Koszt;Zaawansowanie",
  ";Fundamenty;1;1;1",
  "Hala;;1;1;1",
  "Hala;Etap;abc;1;1",
  "Hala;Etap;1;-5;1",
  "Hala;Etap;1;1;120",
  "Hala;Etap;10;5;50",
].join("\n");

const CASES = { demo: CSV_DEMO, single: CSV_SINGLE, bad: CSV_BAD, empty: "", header_only: "Projekt;Etap;Budzet;Koszt;Zaawansowanie" };

const GOLDEN_DEMO = `{
  "projects": [
    {
      "name": "Hala A",
      "budget": 420000,
      "cost": 168000,
      "costPct": 40,
      "progress": 44.285714285714285,
      "deviation": -4.285714285714285,
      "status": "ok",
      "criticalStage": "Fundamenty",
      "comment": "Zbrojenie droższe niż w ofercie (Fundamenty)"
    },
    {
      "name": "Hala B",
      "budget": 280000,
      "cost": 220000,
      "costPct": 78.57142857142857,
      "progress": 57.142857142857146,
      "deviation": 21.428571428571423,
      "status": "risk",
      "criticalStage": "Wykończenie",
      "comment": "Podwykonawca spóźnia dostawy (Wykończenie)"
    },
    {
      "name": "Hala C",
      "budget": 1234.56,
      "cost": 617.28,
      "costPct": 50,
      "progress": 50,
      "deviation": 0,
      "status": "ok",
      "criticalStage": "Fundamenty",
      "comment": ""
    }
  ],
  "stages": [
    {
      "name": "Fundamenty",
      "budget": 201234.56,
      "cost": 112617.28,
      "costPct": 55.96319041818661,
      "progress": 52.98159520909331,
      "deviation": 2.9815952090933067
    },
    {
      "name": "Konstrukcja",
      "budget": 300000,
      "cost": 96000,
      "costPct": 32,
      "progress": 40,
      "deviation": -8
    },
    {
      "name": "Wykończenie",
      "budget": 200000,
      "cost": 180000,
      "costPct": 90,
      "progress": 60,
      "deviation": 30
    }
  ],
  "totals": {
    "budget": 701234.56,
    "cost": 388617.28,
    "costPct": 55.41901414556636,
    "progress": 49.42957745836143,
    "deviation": 5.989436687204929,
    "atRisk": 1,
    "projectCount": 3,
    "rowCount": 5
  }
}`;

const run = (csv) => aggregate(parseCsv(csv).rows);

test("dwa przebiegi na tym samym wejściu dają identyczny wynik", () => {
  for (const [name, csv] of Object.entries(CASES)) {
    const a = run(csv);
    const b = run(csv);
    assert.deepStrictEqual(a, b, name);
    assert.equal(JSON.stringify(a), JSON.stringify(b), name);
  }
});

test("golden: zamrożony wynik dla danych demo", () => {
  assert.equal(JSON.stringify(run(CSV_DEMO), null, 2), GOLDEN_DEMO);
});

test("wartości brzegowe: pusty plik, sam nagłówek, jeden wiersz, złe dane", () => {
  const empty = parseCsv("");
  assert.deepStrictEqual(empty.rows, []);
  assert.equal(empty.errors.length, 1);
  assert.equal(empty.errors[0].line, 1);
  assert.ok(empty.errors[0].msg.pl.startsWith("Pusty plik"));
  assert.ok(empty.errors[0].msg.en.startsWith("Empty file"));

  assert.deepStrictEqual(aggregate([]).totals, {
    budget: 0,
    cost: 0,
    costPct: 0,
    progress: 0,
    deviation: 0,
    atRisk: 0,
    projectCount: 0,
    rowCount: 0,
  });

  const single = parseCsv(CSV_SINGLE);
  assert.equal(single.errors.length, 0);
  assert.deepStrictEqual(single.rows, [
    { line: 2, project: "Hala A", stage: "Fundamenty", budget: 100000, cost: 25000, progress: 20, comment: "" },
  ]);
  const singleAgg = aggregate(single.rows);
  assert.equal(singleAgg.projects[0].costPct, 25);
  assert.equal(singleAgg.projects[0].deviation, 5);
  assert.equal(singleAgg.projects[0].status, "watch"); // 2 p.p. < 5 p.p. <= 8 p.p.

  /* pięć wierszy odrzuconych z podaniem numeru linii, szósty poprawny */
  const bad = parseCsv(CSV_BAD);
  assert.equal(bad.rows.length, 1);
  assert.deepStrictEqual(bad.errors.map((e) => e.line), [2, 3, 4, 5, 6]);

  /* brak rozpoznanych kolumn: błąd wskazuje linię nagłówka, zero wierszy */
  const noHeader = parseCsv(["Kolumna;Inna", "a;b"].join("\n"));
  assert.deepStrictEqual(noHeader.rows, []);
  assert.deepStrictEqual(noHeader.errors.map((e) => e.line), [1]);
});

test("kwoty z groszami: separator tysięcy, przecinek dziesiętny, symbol waluty", () => {
  const agg = run(CSV_DEMO);
  const halaC = agg.projects[2];
  assert.equal(halaC.budget, 1234.56);
  assert.equal(halaC.cost, 617.28);
  assert.equal(halaC.costPct, 50);
  /* spacja nierozdzielająca w kwocie 120 000 zł nie psuje liczby */
  assert.equal(agg.projects[0].budget, 420000);
  assert.equal(agg.totals.budget, 701234.56);
});

test("wynik nie zależy od separatora ani od języka nagłówków", () => {
  const cells = [
    ["Projekt", "Etap", "Budzet", "Koszt", "Zaawansowanie"],
    ["Hala A", "Fundamenty", "120000", "72000", "55"],
    ["Hala A", "Konstrukcja", "300000", "96000", "40"],
  ];
  const joinWith = (sep) => cells.map((row) => row.join(sep)).join("\n");
  const semicolon = JSON.stringify(run(joinWith(";")));
  assert.equal(JSON.stringify(run(joinWith("\t"))), semicolon, "tabulator");
  assert.equal(JSON.stringify(run(joinWith(","))), semicolon, "przecinek");

  const en = [
    ["Project", "Stage", "Budget", "Cost", "Progress"],
    ["Hala A", "Fundamenty", "120000", "72000", "55"],
    ["Hala A", "Konstrukcja", "300000", "96000", "40"],
  ];
  assert.equal(JSON.stringify(aggregate(parseCsv(en.map((row) => row.join(";")).join("\n")).rows)), semicolon, "nagłówki EN");
});

test("formatery i eksport CSV: znane wejście, znany napis", () => {
  assert.equal(fmtAmount(701234.56, "pl"), `701${NBSP}235 zł`);
  assert.equal(fmtAmount(701234.56, "en"), "PLN 701,235");
  assert.equal(fmtAmount(1234.56, "pl"), "1235 zł");
  assert.equal(fmtMln(701234.56, "pl"), "0,7 mln zł");
  assert.equal(fmtPct(55.41901414556636, "pl"), "55,4%");
  assert.equal(fmtPct(55.41901414556636, "en"), "55.4%");
  assert.equal(fmtPp(5.989436687204929, "pl"), "+6,0 p.p.");
  assert.equal(fmtPp(-4.285714285714285, "pl"), "-4,3 p.p.");
  assert.equal(fmtPp(5.989436687204929, "en"), "+6.0 pp");

  const csv = projectsToCsv(run(CSV_DEMO), "pl").split("\n");
  assert.equal(csv.length, 5);
  assert.equal(csv[0], "Projekt;Budżet;Koszt;Zaawansowanie %;Wykorzystanie budżetu %;Odchylenie p.p.;Status;Etap krytyczny;Komentarz PM");
  assert.equal(csv[1], "Hala A;420000;168000;44.3;40.0;-4.3;OK;Fundamenty;Zbrojenie droższe niż w ofercie (Fundamenty)");
  assert.equal(csv[4], "RAZEM;701235;388617;49.4;55.4;6.0;;;");
});

/* Strefa czasowa: ustawienie process.env.TZ w trakcie życia procesu nie jest na Windows
   wiarygodne, więc porównujemy dwa OSOBNE procesy Node z różnym TZ (to jest warunek
   z reguły demo-golden-tests: wynik ma nie zależeć od środowiska). */
const aggregateInTz = (tz, csv) => {
  const engine = JSON.stringify(new URL("./report.ts", import.meta.url).href);
  const code = [
    `import { parseCsv, aggregate } from ${engine};`,
    "process.stdout.write(JSON.stringify(aggregate(parseCsv(process.argv[1]).rows)));",
  ].join("\n");
  const child = spawnSync(process.execPath, ["--experimental-strip-types", "--input-type=module", "-e", code, csv], {
    encoding: "utf8",
    env: { ...process.env, TZ: tz },
  });
  assert.equal(child.status, 0, child.stderr);
  return child.stdout;
};

test("wynik nie zależy od strefy czasowej", () => {
  const utc = aggregateInTz("UTC", CSV_DEMO);
  const kiritimati = aggregateInTz("Pacific/Kiritimati", CSV_DEMO); // UTC+14
  const honolulu = aggregateInTz("Pacific/Honolulu", CSV_DEMO); // UTC-10
  assert.equal(utc, kiritimati);
  assert.equal(utc, honolulu);
  assert.equal(utc, JSON.stringify(run(CSV_DEMO)));
});
