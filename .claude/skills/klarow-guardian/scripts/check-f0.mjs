#!/usr/bin/env node
/**
 * check-f0.mjs: jedna komenda, która sprawdza, czy faza F0 przebudowy klarow.com jest zamknięta.
 *
 * Node 24, zero zależności, zero npx (znak „&" w ścieżce repo łamie shimy cmd).
 * Uruchamiaj z dowolnego katalogu:
 *   node ".claude/skills/klarow-guardian/scripts/check-f0.mjs" [opcje]
 *
 * Uruchamia po kolei bramki z reguły `code-lint-and-tests-gate`:
 *   1. tsc --noEmit
 *   2. ESLint (site/eslint.config.js: react-hooks + jsx-a11y + typescript-eslint)
 *   3. node --test (golden-testy silników z `src/lib`)
 *   4. npm run build (klient + SSR + prerender)
 *   5. verify-site.mjs (site/dist po buildzie)
 *   6. audit-static.mjs --fail-on BLOCKER,HIGH --baseline baseline/audit-static-2026-09-12.jsonl
 *      (flagi WYŁĄCZNIE ze spacją: parser audit-static.mjs nie zna formy „--fail-on=…" i cicho
 *      bierze ją za ścieżkę do skanowania, więc bramka kończyłaby się exit 0 bez sprawdzenia)
 *
 * Plus asercje samej fazy F0 (to, czego żadna z tamtych bramek nie widzi):
 *   - `site/src/data/messaging.ts` istnieje i eksportuje `oneLiner` (jedno zdanie marki),
 *   - `site/src/data/contact.ts` istnieje (jedno źródło NAP),
 *   - trasa `/rodo` jest w `site/dist` (i ma `noindex` do czasu przeglądu radcy),
 *   - martwe pliki `components/ui/*`, `lib/utils.ts`, `content/`, `data/` są usunięte,
 *   - zdjęte zależności nie wróciły do `package.json`, a `motion` stoi na 13.2.0,
 *   - każdy silnik w `src/lib` ma golden-test (`demo-golden-tests`).
 *
 * Opcje:
 *   --skip-build     pomiń krok 4 (dist bywa współdzielony między oknami; wtedy kroki oparte
 *                    o `site/dist` czytają artefakt z POPRZEDNIEGO buildu i raport to zaznacza)
 *   --expected <n>   przekazywane do verify-site.mjs (domyślnie: liczba <url> w sitemap.xml)
 *   --fail-on <lista>  severity dające exit 1 (domyślnie BLOCKER)
 *   --json <plik>    zapisz findings jako JSONL
 *   --quiet          bez tekstu (tylko JSONL i kod wyjścia)
 *
 * Wyjście (CONTRACT strażnika): tabela bramek, potem findings per plik
 *   "ścieżka:linia - SEV [ID-reguły] komunikat" (+ opcjonalnie "  → fix: …"),
 *   na końcu "Σ BLOCKER n · HIGH n · MEDIUM n · LOW n".
 *
 * Determinizm: zero Date.now / Math.random; findings sortowane po (plik, linia, reguła).
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const GUARDIAN = path.resolve(__dirname, "..");
const REPO_ROOT = path.resolve(__dirname, "..", "..", "..", "..");
const SITE = path.join(REPO_ROOT, "site");
const BASELINE = path.join(GUARDIAN, "baseline", "audit-static-2026-09-12.jsonl");

// ───────────────────────────── argumenty ─────────────────────────────
const argv = process.argv.slice(2);
const opts = { skipBuild: false, expected: null, failOn: ["BLOCKER"], json: null, quiet: false };
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === "--skip-build") opts.skipBuild = true;
  else if (a === "--expected") opts.expected = String(argv[++i]);
  else if (a === "--fail-on") opts.failOn = String(argv[++i] || "").split(",").map((s) => s.trim().toUpperCase()).filter(Boolean);
  else if (a === "--json") opts.json = argv[++i];
  else if (a === "--quiet") opts.quiet = true;
  else if (a === "--help" || a === "-h") {
    console.log(fs.readFileSync(__filename, "utf8").split("*/")[0].replace(/^\/\*\*?/, ""));
    process.exit(0);
  }
}

// ───────────────────────────── findings ─────────────────────────────
const findings = [];
const toPosix = (p) => p.split(path.sep).join("/");
const rel = (abs) => toPosix(path.relative(REPO_ROOT, abs));

function add(file, line, severity, rule, msg, fix) {
  findings.push({ file: typeof file === "string" ? file : rel(file), line: line || 1, severity, rule, msg, fix: fix || null });
}

const exists = (p) => fs.existsSync(path.isAbsolute(p) ? p : path.join(REPO_ROOT, p));
const readIf = (p) => {
  const abs = path.isAbsolute(p) ? p : path.join(REPO_ROOT, p);
  try {
    return fs.readFileSync(abs, "utf8");
  } catch {
    return null;
  }
};
const lineOfMatch = (text, needle) => {
  if (!text) return 1;
  const idx = text.indexOf(needle);
  return idx === -1 ? 1 : text.slice(0, idx).split("\n").length;
};

// ───────────────────────────── bramki (procesy potomne) ─────────────────────────────
const gates = [];

function runNode(args, cwd) {
  return spawnSync(process.execPath, args, { cwd, encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
}
function runNpm(args) {
  // npm na Windows to shim .cmd, więc shell: true; cwd ustawia spawn, nie „cd", więc znak & w ścieżce nie trafia do cmd
  return spawnSync("npm", args, { cwd: SITE, encoding: "utf8", shell: true, maxBuffer: 32 * 1024 * 1024 });
}
const tail = (text, n) => String(text || "").trimEnd().split("\n").slice(-n).join("\n");
const sigma = (text) => (String(text || "").match(/^Σ .*$/m) || [null])[0];

/* 1. tsc */
{
  const r = runNode([path.join(SITE, "node_modules", "typescript", "bin", "tsc"), "--noEmit"], SITE);
  const errors = String(r.stdout || "").split("\n").filter((l) => /error TS\d+/.test(l));
  gates.push({ name: "tsc --noEmit", ok: r.status === 0, note: errors.length ? `${errors.length} błędów typów` : "0 błędów" });
  for (const line of errors.slice(0, 10)) {
    const m = /^(.*?)\((\d+),\d+\): (error TS\d+: .*)$/.exec(line.trim());
    if (m) add(toPosix(path.relative(REPO_ROOT, path.resolve(SITE, m[1]))), Number(m[2]), "BLOCKER", "code-lint-and-tests-gate", m[3]);
    else add("site/tsconfig.json", 1, "BLOCKER", "code-lint-and-tests-gate", `tsc: ${line.trim()}`);
  }
  if (r.status !== 0 && errors.length === 0) add("site/tsconfig.json", 1, "BLOCKER", "code-lint-and-tests-gate", `tsc zakończył się kodem ${r.status}`, tail(r.stdout || r.stderr, 3));
}

/* 2. ESLint */
{
  const config = path.join(SITE, "eslint.config.js");
  if (!exists(config)) {
    gates.push({ name: "eslint src", ok: false, note: "brak eslint.config.js" });
    add("site/eslint.config.js", 1, "BLOCKER", "code-lint-and-tests-gate", "brak konfiguracji ESLint (bramka nr 2 nie istnieje)", "flat config z react-hooks i jsx-a11y");
  } else {
    const r = runNode([path.join(SITE, "node_modules", "eslint", "bin", "eslint.js"), "src", "--format", "json"], SITE);
    let results = [];
    try {
      results = JSON.parse(String(r.stdout || "[]").trim() || "[]");
    } catch {
      results = [];
    }
    let errs = 0;
    let warns = 0;
    for (const f of results) {
      errs += f.errorCount || 0;
      warns += f.warningCount || 0;
      for (const m of f.messages || []) {
        if (m.severity !== 2) continue;
        add(toPosix(path.relative(REPO_ROOT, f.filePath)), m.line || 1, "BLOCKER", "code-lint-and-tests-gate", `ESLint ${m.ruleId || "parser"}: ${m.message}`);
      }
    }
    if (warns > 0) {
      add("site/package.json", lineOfMatch(readIf("site/package.json"), '"lint"'), "HIGH", "code-lint-and-tests-gate", `ESLint: ${warns} ostrzeżeń (bramka docelowo biegnie z --max-warnings 0)`, "napraw ostrzeżenia albo świadomie je wycisz w eslint.config.js");
    }
    gates.push({ name: "eslint src", ok: errs === 0, note: `${errs} błędów, ${warns} ostrzeżeń` });
  }
}

/* 3. testy: najpierw czy skrypt `test` w ogóle celuje w istniejące pliki, potem przebieg */
{
  const pkgRaw = readIf("site/package.json");
  const pkg = pkgRaw ? JSON.parse(pkgRaw) : {};
  const cmd = pkg.scripts?.test || "";
  const testFiles = listTests();
  if (!cmd) {
    gates.push({ name: "npm run test", ok: false, note: "brak skryptu test" });
    add("site/package.json", lineOfMatch(pkgRaw, '"scripts"'), "BLOCKER", "demo-golden-tests", "package.json bez skryptu test", 'node --test --experimental-strip-types "src/lib/*.test.mjs"');
  } else {
    const patterns = cmd
      .split(/\s+/)
      .map((t) => t.replace(/^["']|["']$/g, ""))
      .filter((t) => !t.startsWith("-") && !["node", "npm", "run"].includes(t) && /[*/.]/.test(t));
    const matched = patterns.flatMap(matchPattern);
    /* pusty zbiór plików to pułapka cichego PASS: `node --test` bez trafionego wzorca
       kończy się exit 0, więc bramka przechodziłaby, nie uruchamiając ani jednego testu */
    if (patterns.length && matched.length === 0) {
      add("site/package.json", lineOfMatch(pkgRaw, '"test"'), "BLOCKER", "demo-golden-tests", `skrypt test nie trafia w żaden plik (${patterns.join(" ")})`, `pliki testów leżą w ${testFiles.length ? testFiles.map(rel).join(", ") : "nigdzie"}`);
    }
    const r = runNpm(["run", "test"]);
    const pass = (String(r.stdout).match(/^# pass (\d+)\s*$/m) || [])[1];
    const fail = (String(r.stdout).match(/^# fail (\d+)\s*$/m) || [])[1];
    const ran = Number(pass || 0) + Number(fail || 0);
    gates.push({
      name: "npm run test",
      ok: r.status === 0 && matched.length > 0 && ran > 0,
      note: matched.length === 0 ? "0 plików testowych trafionych wzorcem" : pass ? `${pass} zielonych, ${fail || 0} czerwonych` : `exit ${r.status}`,
    });
    if (r.status !== 0) add("site/package.json", lineOfMatch(pkgRaw, '"test"'), "BLOCKER", "demo-golden-tests", `golden-testy silników nie przechodzą (exit ${r.status})`, tail(r.stdout || r.stderr, 3));
    else if (matched.length > 0 && ran === 0) add("site/package.json", lineOfMatch(pkgRaw, '"test"'), "BLOCKER", "demo-golden-tests", "przebieg testów nie uruchomił żadnego testu (exit 0 bez asercji)");
  }

  /* każdy silnik w src/lib ma swój test (nowy silnik bez testu = fail) */
  const engines = fs.existsSync(path.join(SITE, "src", "lib"))
    ? fs.readdirSync(path.join(SITE, "src", "lib")).filter((f) => /\.ts$/.test(f) && !/\.d\.ts$/.test(f) && !/\.test\./.test(f))
    : [];
  const testedNames = new Set(testFiles.map((f) => path.basename(f).replace(/\.test\.(mjs|ts)$/, "")));
  for (const engine of engines) {
    const base = engine.replace(/\.ts$/, "");
    // pdf.ts: golden na definicji dokumentu wchodzi po refaktorze okna c1 (demo-golden-tests, Wyjątki)
    if (base === "pdf" || base === "utils") continue;
    if (!testedNames.has(base)) {
      add(`site/src/lib/${engine}`, 1, "BLOCKER", "demo-golden-tests", `silnik bez golden-testu: ${base}`, `site/src/lib/${base}.test.mjs (dwa przebiegi = ten sam JSON + zamrożony golden)`);
    }
  }
}

function listTests() {
  const dirs = [path.join(SITE, "src", "lib"), path.join(SITE, "tests")];
  const out = [];
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir).sort()) if (/\.test\.(mjs|ts)$/.test(f)) out.push(path.join(dir, f));
  }
  return out;
}

/* prosty matcher: katalog („tests/") albo wzorzec z gwiazdką („src/lib/*.test.mjs") */
function matchPattern(pattern) {
  const abs = path.resolve(SITE, pattern);
  if (!/[*?]/.test(pattern)) {
    if (!fs.existsSync(abs)) return [];
    return fs.statSync(abs).isDirectory()
      ? fs.readdirSync(abs).filter((f) => /\.test\.(mjs|ts)$/.test(f)).map((f) => path.join(abs, f))
      : [abs];
  }
  const dir = path.dirname(abs);
  if (!fs.existsSync(dir)) return [];
  const re = new RegExp("^" + path.basename(abs).replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, "[^/]*").replace(/\?/g, "[^/]") + "$");
  return fs.readdirSync(dir).filter((f) => re.test(f)).map((f) => path.join(dir, f));
}

/* 4. build */
if (opts.skipBuild) {
  gates.push({ name: "npm run build", ok: true, note: "POMINIĘTY (--skip-build): site/dist jest z poprzedniego buildu" });
} else {
  const r = runNpm(["run", "build"]);
  gates.push({ name: "npm run build", ok: r.status === 0, note: r.status === 0 ? "klient + SSR + prerender" : `exit ${r.status}` });
  if (r.status !== 0) add("site/package.json", lineOfMatch(readIf("site/package.json"), '"build"'), "BLOCKER", "code-lint-and-tests-gate", `build nie przechodzi (exit ${r.status})`, tail(r.stdout || r.stderr, 5));
}

/* 5. verify-site */
{
  const args = [path.join(GUARDIAN, "scripts", "verify-site.mjs")];
  if (opts.expected) args.push("--expected", opts.expected);
  const r = runNode(args, REPO_ROOT);
  const s = sigma(r.stdout);
  gates.push({ name: "verify-site.mjs", ok: r.status === 0, note: (s || `exit ${r.status}`) + (opts.skipBuild ? " (dist z poprzedniego buildu)" : "") });
  if (r.status !== 0) add("site/dist", 1, "BLOCKER", "seo-prerender-must-keep", `verify-site zgłasza BLOCKER (${s || "exit " + r.status})`, "uruchom osobno: node .claude/skills/klarow-guardian/scripts/verify-site.mjs");
}

/* 6. audit-static z baseline (flagi ze spacją, nie przez „=") */
{
  if (!exists(BASELINE)) add(rel(BASELINE), 1, "HIGH", "code-lint-and-tests-gate", "brak pliku baseline audytu (bramka 6 policzy stary dług jako nowy)");
  const r = runNode([path.join(GUARDIAN, "scripts", "audit-static.mjs"), "--fail-on", "BLOCKER,HIGH", "--baseline", BASELINE, "--no-pass"], REPO_ROOT);
  const s = sigma(r.stdout);
  gates.push({ name: "audit-static.mjs", ok: r.status === 0, note: s || `exit ${r.status}` });
  if (r.status !== 0) {
    const first = String(r.stdout || "").split("\n").filter((l) => / - (BLOCKER|HIGH) \[/.test(l)).slice(0, 5);
    add("site/src", 1, "BLOCKER", "code-lint-and-tests-gate", `audyt statyczny nie przechodzi (${s || "exit " + r.status})`, first.length ? first.join(" | ") : null);
  }
}

// ───────────────────────────── asercje fazy F0 ─────────────────────────────

/* jedno zdanie marki */
{
  const p = "site/src/data/messaging.ts";
  const src = readIf(p);
  if (!src) add(p, 1, "HIGH", "copy-one-liner-single-source", "brak messaging.ts (jedno zdanie marki nie ma źródła)", "export const MESSAGING = { oneLiner: { pl, en }, … }");
  else if (!/\boneLiner\b/.test(src)) add(p, 1, "HIGH", "copy-one-liner-single-source", "messaging.ts bez oneLiner", "oneLiner: { pl, en } zasila H1, meta, JSON-LD i llms.txt");
  else if (!/export\s+(const|default)/.test(src)) add(p, 1, "HIGH", "copy-one-liner-single-source", "messaging.ts nic nie eksportuje");
}

/* jedno źródło NAP */
{
  const p = "site/src/data/contact.ts";
  if (!exists(p)) add(p, 1, "HIGH", "code-contact-single-source", "brak contact.ts (telefon i e-mail zostają rozsiane po komponentach)", "export const CONTACT = { phone, phoneHref, email, … }");
}

/* trasa /rodo w dist */
{
  const rodo = ["site/dist/rodo.html", "site/dist/rodo/index.html"].find(exists);
  if (!rodo) {
    add("site/dist", 1, "BLOCKER", "legal-rodo-page-required", "brak trasy /rodo w dist (strona nie może zbierać kontaktu bez informacji o przetwarzaniu danych)", opts.skipBuild ? "uruchom bez --skip-build albo npm run build" : "dodaj trasę /rodo do routingu i do prerenderu (entry.tsx)");
  } else if (!/name=["']robots["'][^>]*noindex/i.test(readIf(rodo) || "")) {
    add(rodo, 1, "MEDIUM", "legal-rodo-page-required", "/rodo bez meta robots noindex (treść czeka na przegląd radcy)", "zdejmij noindex dopiero po przeglądzie prawnym i podbij liczbę tras w sitemapie");
  }
}

/* martwy kod zdjęty w F0 */
{
  const DEAD = [
    "site/src/components/ui/button.tsx",
    "site/src/components/ui/badge.tsx",
    "site/src/components/ui/card.tsx",
    "site/src/components/ui/canvas-reveal-effect.tsx",
    "site/src/components/ui/radial-orbital-timeline.tsx",
    "site/src/lib/utils.ts",
    "site/content",
    "site/data",
    "site/public/screens/placeholder.svg",
    "Logo.zip",
  ];
  for (const p of DEAD) {
    if (exists(p)) add(p, 1, "MEDIUM", "code-no-dead-code", "plik miał zniknąć w F0 (nikt go nie importuje)", "usuń z main; kod na zapas trzymamy w gałęzi zapas/<nazwa>");
  }
}

/* zależności: zdjęte nie wracają, motion przypięty na 13.2.0 */
{
  const p = "site/package.json";
  const raw = readIf(p);
  if (!raw) add(p, 1, "BLOCKER", "integ-dependency-audit", "brak package.json");
  else {
    const pkg = JSON.parse(raw);
    const all = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
    const REMOVED = ["@react-three/fiber", "@radix-ui/react-slot", "class-variance-authority", "clsx", "tailwind-merge"];
    for (const dep of REMOVED) {
      if (all[dep]) add(p, lineOfMatch(raw, `"${dep}"`), "HIGH", "integ-dependency-audit", `zależność zdjęta w F0 wróciła: ${dep}`, "usuń z package.json i z rejestru integracji w jednym commicie");
    }
    /* three i @formkit/auto-animate schodzą dopiero po decyzji D-12 o tle i animacjach list */
    for (const dep of ["three", "@formkit/auto-animate"]) {
      if (all[dep]) add(p, lineOfMatch(raw, `"${dep}"`), "LOW", "integ-dependency-audit", `${dep} czeka na decyzję founderów (D-12: wideo zamiast tła WebGL)`, "zostaw do decyzji, potem usuń razem z importami");
    }
    const motion = pkg.dependencies?.motion;
    if (!motion) add(p, lineOfMatch(raw, '"dependencies"'), "HIGH", "integ-dependency-audit", "brak pakietu motion w dependencies", '"motion": "13.2.0" (wersja przypięta, bez ^)');
    else if (motion !== "13.2.0") add(p, lineOfMatch(raw, '"motion"'), "HIGH", "integ-dependency-audit", `motion na wersji ${motion}, a budżet i API liczone dla 13.2.0`, '"motion": "13.2.0"');
  }
}

// ───────────────────────────── wyjście ─────────────────────────────
const SEV_ORDER = { BLOCKER: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
findings.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line || a.rule.localeCompare(b.rule));

const counts = { BLOCKER: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
for (const f of findings) counts[f.severity]++;

if (opts.json) {
  fs.writeFileSync(path.resolve(REPO_ROOT, opts.json), findings.map((f) => JSON.stringify(f)).join("\n") + (findings.length ? "\n" : ""), "utf8");
}

if (!opts.quiet) {
  const out = ["## bramki F0"];
  const width = Math.max(...gates.map((g) => g.name.length));
  for (const g of gates) out.push(`${g.name.padEnd(width)}  ${g.ok ? "PASS" : "FAIL"}  ${g.note}`);
  out.push("");

  const byFile = new Map();
  for (const f of findings) {
    if (!byFile.has(f.file)) byFile.set(f.file, []);
    byFile.get(f.file).push(f);
  }
  for (const [file, list] of byFile) {
    const maxSev = list.reduce((acc, f) => (SEV_ORDER[f.severity] < SEV_ORDER[acc] ? f.severity : acc), "LOW");
    out.push(`## ${file} (${list.length}, ${maxSev})`);
    for (const f of list) {
      out.push(`${f.file}:${f.line} - ${f.severity} [${f.rule}] ${f.msg}`);
      if (f.fix) out.push(`  → fix: ${f.fix}`);
    }
  }
  if (!findings.length) out.push("## brak findings");
  out.push("");
  out.push(`Σ BLOCKER ${counts.BLOCKER} · HIGH ${counts.HIGH} · MEDIUM ${counts.MEDIUM} · LOW ${counts.LOW}`);
  process.stdout.write(out.join("\n") + "\n");
}

const failing = opts.failOn.some((sev) => counts[sev] > 0);
process.exit(failing ? 1 : 0);
