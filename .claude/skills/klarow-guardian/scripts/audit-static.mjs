#!/usr/bin/env node
/**
 * audit-static.mjs — mechaniczne bramki strażnika Klarow (warstwa 1, zero LLM).
 *
 * Node 24, zero zależności, zero npx. Uruchamiaj z dowolnego katalogu:
 *   node ".claude/skills/klarow-guardian/scripts/audit-static.mjs" [ścieżki|globy...] [opcje]
 *
 * Domyślny zakres: site/src, site/index.html, site/public/_headers, site/public/_redirects
 * (+ dla reguł marki: site/public, demo, ui-kit).
 *
 * Opcje:
 *   --json <plik>        zapisz findings jako JSONL (1 finding = 1 linia)
 *   --changed            zakres = pliki z git diff (working tree + staged + untracked) pod site/
 *   --baseline <plik>    pomiń ZNANE findings HIGH/MEDIUM/LOW z baseline JSONL (klucz: plik|reguła|snippet).
 *                        BLOCKER nie jest nigdy tłumiony: twarde zasady CLAUDE.md i prawo nie mają długu
 *                        (SKILL.md §Bramka). Wpisy BLOCKER w pliku baseline są ignorowane.
 *   --fail-on <lista>    severity, które dają exit 1 (domyślnie BLOCKER); np. BLOCKER,HIGH
 *   --no-pass            nie wypisuj plików „✓ pass” (tylko naruszenia i Σ)
 *   --quiet              nie wypisuj tekstu (tylko JSONL i exit code)
 *
 * Wyjście tekstowe (CONTRACT): grupowanie per plik, linia
 *   "ścieżka:linia - SEV [ID-reguły] komunikat", opcjonalnie "  → fix: …",
 *   na końcu "Σ BLOCKER n · HIGH n · MEDIUM n · LOW n · ✓ pass k plików".
 * Wyjście JSONL: {file,line,col,severity,rule,msg,fix,confidence,source,snippet,key}
 *
 * Determinizm: bez Date.now/Math.random; findings sortowane po (plik, linia, reguła).
 * ID reguł = ISTNIEJĄCE pliki rules/<id>.md strażnika (bez wyjątków: findings cytują ID, więc
 * czytelnik musi trafić do reguły). Nową bramkę dokładamy razem z plikiem reguły;
 * `build-index.mjs` ostrzega, gdy ID w scripts/*.mjs nie ma pliku w rules/.
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..", "..", "..", "..");

// ───────────────────────────── argumenty ─────────────────────────────
const argv = process.argv.slice(2);
const opts = { json: null, changed: false, baseline: null, failOn: ["BLOCKER"], noPass: false, quiet: false };
const targets = [];
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === "--json") opts.json = argv[++i];
  else if (a === "--changed") opts.changed = true;
  else if (a === "--baseline") opts.baseline = argv[++i];
  else if (a === "--fail-on") opts.failOn = String(argv[++i] || "").split(",").map((s) => s.trim().toUpperCase()).filter(Boolean);
  else if (a === "--no-pass") opts.noPass = true;
  else if (a === "--quiet") opts.quiet = true;
  else if (a === "--help" || a === "-h") {
    console.log(fs.readFileSync(__filename, "utf8").split("*/")[0].replace(/^\/\*\*?/, ""));
    process.exit(0);
  } else targets.push(a);
}

// ───────────────────────────── narzędzia plikowe ─────────────────────────────
const SCAN_EXT = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".css", ".html", ".md", ".txt", ".json", ".yml", ".yaml", ".svg"]);
const SKIP_DIRS = new Set(["node_modules", "dist", "dist-ssr", ".git", ".claude", "fonts", "assets"]);

const toPosix = (p) => p.split(path.sep).join("/");
const rel = (abs) => toPosix(path.relative(REPO_ROOT, abs));

function walk(dir, out) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    if (e.name.startsWith(".") && e.name !== ".gitkeep") continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (SKIP_DIRS.has(e.name)) continue;
      walk(p, out);
    } else if (e.isFile()) {
      const ext = path.extname(e.name);
      if (SCAN_EXT.has(ext) || ext === "") out.push(p);
    }
  }
  return out;
}

function globToRegex(glob) {
  let re = "";
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];
    if (c === "*") {
      if (glob[i + 1] === "*") {
        re += ".*";
        i++;
        if (glob[i + 1] === "/") i++;
      } else re += "[^/]*";
    } else if (c === "?") re += "[^/]";
    else if (c === "{") {
      const end = glob.indexOf("}", i);
      const alts = glob.slice(i + 1, end).split(",").map((s) => s.replace(/[.+^$()|[\]\\]/g, "\\$&"));
      re += "(" + alts.join("|") + ")";
      i = end;
    } else if (".+^$()|[]\\".includes(c)) re += "\\" + c;
    else re += c;
  }
  return new RegExp("^" + re + "$");
}

function resolveTarget(t) {
  const posix = toPosix(t);
  if (/[*?{]/.test(posix)) {
    const base = posix.split(/[*?{]/)[0].replace(/\/[^/]*$/, "") || ".";
    const all = walk(path.resolve(REPO_ROOT, base), []);
    const re = globToRegex(posix.replace(/^\.\//, ""));
    return all.filter((p) => re.test(rel(p)));
  }
  const abs = path.isAbsolute(posix) ? posix : path.resolve(REPO_ROOT, posix);
  if (!fs.existsSync(abs)) return [];
  const st = fs.statSync(abs);
  return st.isDirectory() ? walk(abs, []) : [abs];
}

function gitChangedFiles() {
  const run = (args) => {
    try {
      return execFileSync("git", args, { cwd: REPO_ROOT, encoding: "utf8" }).split(/\r?\n/).filter(Boolean);
    } catch {
      return [];
    }
  };
  const set = new Set([
    ...run(["diff", "--name-only", "HEAD"]),
    ...run(["diff", "--name-only", "--cached"]),
    ...run(["ls-files", "--others", "--exclude-standard"]),
  ]);
  return [...set]
    .filter((f) => f.startsWith("site/") && !f.startsWith("site/dist") && !f.includes("node_modules"))
    .map((f) => path.resolve(REPO_ROOT, f))
    .filter((p) => fs.existsSync(p) && fs.statSync(p).isFile());
}

// ───────────────────────────── zakres ─────────────────────────────
const DEFAULT_TARGETS = ["site/src", "site/index.html", "site/public/_headers", "site/public/_redirects"];
const BRAND_EXTRA_TARGETS = ["site/public", "demo", "ui-kit"];

let files;
let brandOnlyFiles = [];
if (opts.changed) files = gitChangedFiles();
else if (targets.length) files = targets.flatMap(resolveTarget);
else {
  files = DEFAULT_TARGETS.flatMap(resolveTarget);
  const main = new Set(files.map((p) => p));
  brandOnlyFiles = BRAND_EXTRA_TARGETS.flatMap(resolveTarget).filter((p) => !main.has(p));
}
files = [...new Set(files)].sort((a, b) => rel(a).localeCompare(rel(b)));
brandOnlyFiles = [...new Set(brandOnlyFiles)].sort((a, b) => rel(a).localeCompare(rel(b)));

// ───────────────────────────── katalog reguł ─────────────────────────────
// INWARIANT: klucz = istniejący plik `rules/<id>.md`, `sev` = `impact` z jego frontmatteru.
// Świadome obniżenia severity (heurystyka o niższej pewności) przekazujemy w add(..., { severity }),
// nigdy przez rozjazd w tej tabeli. Startowa samokontrola niżej wypisuje każdy rozjazd na stderr.
// severity wg CONTRACT: BLOCKER = twarde zasady CLAUDE.md/prawo; HIGH = a11y/perf/SEO/copy
// z liczbą bez źródła; MEDIUM = spójność design/motion; LOW = szlif.
const RULES = {
  "brand-no-nuconic": { sev: "BLOCKER", msg: "nazwa poprzedniej firmy w kodzie publicznym (CLAUDE.md #3: case = „firma produkcyjno-budowlana”)" },
  "brand-no-gold": { sev: "BLOCKER", msg: "złoto #FFA914 (stara marka) — jedyny akcent to stal #A8B4C2" },
  "demo-determinism": { sev: "BLOCKER", msg: "niedeterminizm w silniku/dashboardzie (Date.now/Math.random/performance.now/new Date()/localStorage) albo sieć w demie" },
  "motion-no-pinning-no-scroll-hijack": { sev: "BLOCKER", msg: "listener scroll/wheel/touchmove — zakaz scroll-hijack/pinowania (decyzje Karola 2026-07-22/26)" },
  "motion-one-library-lazymotion": { sev: "HIGH", msg: "import { motion } — używaj m z motion/react-m pod LazyMotion domAnimation strict" },
  "motion-no-motion-in-prerender": { sev: "HIGH", msg: "import motion/* w prerender/** — shell SSR ma być wolny od bibliotek ruchu" },
  "i18n-pl-typography": { sev: "HIGH", msg: "em-dash „—” w tekście UI/danych — użyj przecinka, dwukropka, kropki albo „–” tylko w zakresie liczb" },
  "copy-banned-claims": { sev: "BLOCKER", msg: "zakazane źródło liczby (Deloitte/IDC) — nie dotarliśmy do oryginału raportu; jedna liczba bez źródła kasuje wiarygodność pozostałych" },
  "brand-no-ai-word-in-sales": { sev: "BLOCKER", msg: "„AI” w copy sprzedażowym — zero słowa „AI” poza odpowiedzią FAQ „Czy AI liczy moje dane?”" },
  "media-video-embed-spec": { sev: "HIGH", msg: "<video> bez kompletu muted/playsInline/poster (iOS autoplay, LCP, reduced-motion)" },
  "perf-images-policy": { sev: "HIGH", msg: "<img> bez width/height — CLS" },
  "design-overflow-rules": { sev: "HIGH", msg: "h-screen/100vh bez fallbacku dvh — ucięty viewport na mobile" },
  "a11y-focus-visible-everywhere": { sev: "HIGH", msg: "focus: / outline-none bez focus-visible: — fokus klawiatury niewidoczny lub miga przy kliku" },
  "design-tokens-only": { sev: "HIGH", msg: "kolor/rozmiar poza tokenami (hex/rgba/oklch) — użyj tokenów z tokens.css" },
  "code-no-arbitrary-tailwind-values": { sev: "HIGH", msg: "arbitralna wartość Tailwind (text-[Npx]/bg-[#…]) — utility z @theme/tokeny" },
  "code-no-inline-style-colors": { sev: "HIGH", msg: "style={{ … }} z kolorem literałem — klasa kitu albo var(--token)" },
  "design-shape-lock": { sev: "MEDIUM", msg: "promień poza Shape Lock (marketing {0,8,999}; tool {8,10,12,999})" },
  "design-no-glass-no-blur": { sev: "HIGH", msg: "backdrop-filter/backdrop-blur — zero glassmorphizmu (kit §1, taste §9.A)" },
  "design-icons-lucide-one-family": { sev: "MEDIUM", msg: "emoji/glif w tekście UI — tylko lucide-react" },
  "design-eyebrow-cap": { sev: "MEDIUM", msg: "za dużo eyebrow (.lbl-sm/uppercase tracking) w jednym pliku (limit 3)" },
  "motion-no-transition-all-no-linear": { sev: "HIGH", msg: "transition-all lub linear/ease-in-out — lista właściwości + easing z tokenów" },
  "design-animation-fill-backwards": { sev: "HIGH", msg: "will-change na stałe — trwała warstwa GPU; ustawiaj tylko na czas animacji i zdejmuj po niej" },
  "code-no-forwardref-react19": { sev: "MEDIUM", msg: "forwardRef → ref jako zwykły prop (React 19)" },
  "code-use-not-usecontext": { sev: "MEDIUM", msg: "useContext(Ctx) → use(Ctx) (React 19)" },
  "code-lazy-routes-and-dashboards": { sev: "HIGH", msg: "dashboardy importowane statycznie — React.lazy + import() z literalną ścieżką" },
  "code-contact-single-source": { sev: "HIGH", msg: "telefon/e-mail zaszyte poza contact.ts — jedno źródło NAP" },
};

// ───────────────────────────── pomocnicze ─────────────────────────────
const findings = [];
function add(file, line, col, rule, msg, extra = {}) {
  const r = RULES[rule];
  findings.push({
    file: rel(file),
    line: line || 1,
    col: col || 1,
    severity: extra.severity || r.sev,
    rule,
    msg: msg || r.msg,
    fix: extra.fix || null,
    confidence: "CONFIRMED",
    source: "grep",
    snippet: (extra.snippet || "").trim().slice(0, 160),
  });
}

function lineOf(content, index) {
  let line = 1;
  for (let i = 0; i < index && i < content.length; i++) if (content.charCodeAt(i) === 10) line++;
  return line;
}
function lineText(lines, n) {
  return lines[n - 1] || "";
}

/** Usuwa komentarze blokowe, HTML-owe i pełnoliniowe //, zachowując numery linii. */
function stripComments(content, ext) {
  let out = content;
  const blank = (m) => m.replace(/[^\n]/g, " ");
  if ([".ts", ".tsx", ".js", ".jsx", ".mjs", ".css"].includes(ext)) out = out.replace(/\/\*[\s\S]*?\*\//g, blank);
  if ([".html", ".svg", ".md"].includes(ext)) out = out.replace(/<!--[\s\S]*?-->/g, blank);
  if ([".ts", ".tsx", ".js", ".jsx", ".mjs"].includes(ext)) out = out.replace(/^[ \t]*\/\/[^\n]*/gm, blank);
  return out;
}

/** Zwraca literały stringów (", ', `) z pozycją startu — po zdjęciu komentarzy. */
function stringLiterals(src) {
  const res = [];
  let i = 0;
  const n = src.length;
  while (i < n) {
    const c = src[i];
    if (c === '"' || c === "'" || c === "`") {
      const q = c;
      let j = i + 1;
      let buf = "";
      while (j < n) {
        const d = src[j];
        if (d === "\\") {
          buf += src[j + 1] || "";
          j += 2;
          continue;
        }
        if (d === q) break;
        if (d === "\n" && q !== "`") break; // niedomknięty string w linii — przerwij
        buf += d;
        j++;
      }
      res.push({ start: i, text: buf });
      i = j + 1;
    } else i++;
  }
  return res;
}

/** Tekst JSX/HTML pomiędzy tagami: segmenty ">...<" bez nawiasów klamrowych. */
function jsxTexts(src) {
  const res = [];
  const re = />([^<>{}]+)</g;
  let m;
  while ((m = re.exec(src))) {
    if (m[1].trim()) res.push({ start: m.index + 1, text: m[1] });
  }
  return res;
}

/** Zbiera całe tagi <name ...> także wielolinijkowe. */
function tags(src, name) {
  const res = [];
  const re = new RegExp("<" + name + "(?=[\\s/>])[^>]*>", "g");
  let m;
  while ((m = re.exec(src))) res.push({ start: m.index, text: m[0] });
  return res;
}

/**
 * Pliki WEWNĘTRZNE: wolno w nich pisać nazwę poprzedniej firmy jako kontekst decyzji
 * (rules/brand-no-nuconic.md §Wyjątki: CLAUDE.md, docs/**, ui-kit/README.md, .claude/**,
 * leadscout/** poza szablonami wysyłanymi na zewnątrz) — dopóki repo jest prywatne.
 * Wyjątek dotyczy WYŁĄCZNIE `brand-no-nuconic`; złoto #FFA914 nie ma wyjątków.
 * Wszystko, co ląduje w `site/`, `demo/`, `public/`, `dist/`, pozostaje BLOCKER-em.
 */
const isInternalDoc = (r) =>
  r === "CLAUDE.md" ||
  r.startsWith("docs/") ||
  r.startsWith(".claude/") ||
  r === "ui-kit/README.md" ||
  (r.startsWith("leadscout/") && !/szablon|template|outbound|playbook/i.test(r));

const isTokensFile = (r) => /(^|\/)(tokens|company-ui|app)\.css$/.test(r) || r.startsWith("ui-kit/");
const isDashboardOrEngine = (r) => /^site\/src\/(lib\/|components\/dashboards\/|components\/DemoReport\.tsx$)/.test(r);
const isPrerender = (r) => r.startsWith("site/src/prerender/");
const isContactFile = (r) => /^site\/src\/(data|lib)\/contact\.ts$/.test(r);
const isTypes = (r) => r.startsWith("site/src/types/");
const isCss = (ext) => ext === ".css";
const isJsx = (ext) => ext === ".tsx" || ext === ".jsx";
const isCode = (ext) => [".ts", ".tsx", ".js", ".jsx", ".mjs"].includes(ext);

const ALLOWED_RADII_PX = new Set([0, 8, 10, 12, 999, 9999]);

// czy repo ma już domMax (wtedy layout/layoutId/drag są legalne)
const domMaxPresent = (() => {
  try {
    const all = walk(path.resolve(REPO_ROOT, "site/src"), []);
    return all.some((p) => /\.(ts|tsx)$/.test(p) && fs.readFileSync(p, "utf8").includes("domMax"));
  } catch {
    return false;
  }
})();

// ───────────────────────────── reguły marki (wszystkie pliki) ─────────────────────────────
function brandRules(file, content, lines) {
  const r = rel(file);
  let m;
  if (!isInternalDoc(r)) {
    const reNuconic = /nuconic/gi;
    while ((m = reNuconic.exec(content))) {
      const ln = lineOf(content, m.index);
      // BEZ snippetu: nazwa poprzedniej firmy nie wychodzi ze skryptu nawet jako cytat
      // (checklists/audit-report-template.md — ten sam zakaz mają wszyscy audytorzy).
      // Plik:linia wystarcza, żeby ją znaleźć; baseline i tak nigdy nie tłumi BLOCKER-ów,
      // więc klucz bez snippetu nie unieważnia żadnego wpisu długu.
      add(file, ln, m.index - content.lastIndexOf("\n", m.index - 1), "brand-no-nuconic");
    }
  }
  const reGold = /#?ffa914\b/gi;
  while ((m = reGold.exec(content))) {
    const ln = lineOf(content, m.index);
    add(file, ln, 1, "brand-no-gold", undefined, { snippet: lineText(lines, ln), fix: "zamień na var(--accent) / #A8B4C2 (stal)" });
  }
  void r;
}

// ───────────────────────────── reguły dla zakresu głównego ─────────────────────────────
function mainRules(file, raw) {
  const r = rel(file);
  const ext = path.extname(file).toLowerCase();
  const lines = raw.split("\n");
  const src = stripComments(raw, ext);
  const strings = isCode(ext) ? stringLiterals(src) : [];
  const texts = isJsx(ext) || ext === ".html" ? jsxTexts(src) : [];
  let m;

  // ── copy: em-dash / en-dash w stringach i tekście JSX ──
  if (!isTypes(r)) {
    const textual = isCss(ext) ? stringLiterals(src) : [...strings, ...texts];
    for (const s of textual) {
      let idx = s.text.indexOf("—");
      while (idx !== -1) {
        const ln = lineOf(src, s.start + idx);
        add(file, ln, 1, "i18n-pl-typography", undefined, {
          snippet: lineText(lines, ln),
          fix: /\d\s?—\s?\d/.test(s.text) ? "zakres liczbowy → „–” (półpauza)" : null,
        });
        idx = s.text.indexOf("—", idx + 1);
      }
      if (s.text.includes("–") && s.text.length < 60 && !/\d\s?–\s?\d/.test(s.text)) {
        const ln = lineOf(src, s.start + s.text.indexOf("–"));
        // heurystyka o niższej pewności (półpauza bywa poprawna w prozie) → świadome LOW
        add(file, ln, 1, "i18n-pl-typography", "półpauza „–” w krótkim stringu poza zakresem liczbowym — sprawdź, czy to nie zamiennik em-dasha", { snippet: lineText(lines, ln), severity: "LOW" });
      }
    }
  }

  // ── copy: zakazane źródła liczb ──
  if (r.startsWith("site/src/")) {
    const reSrc = /\b(Deloitte|IDC)\b/g;
    while ((m = reSrc.exec(src))) {
      const ln = lineOf(src, m.index);
      add(file, ln, 1, "copy-banned-claims", undefined, { snippet: lineText(lines, ln) });
    }
  }
  // ── copy: „AI” w danych ──
  if (r.startsWith("site/src/data/")) {
    const reAi = /\bAI\b|sztuczn(?:a|ej|ą) inteligencj/g;
    for (const s of strings) {
      while ((m = reAi.exec(s.text))) {
        const ln = lineOf(src, s.start + m.index);
        add(file, ln, 1, "brand-no-ai-word-in-sales", undefined, { snippet: lineText(lines, ln) });
      }
    }
  }

  // ── design: tokeny ──
  if (!isTokensFile(r) && !isTypes(r)) {
    const reColor = /#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?|oklch|oklab)\(/g;
    while ((m = reColor.exec(src))) {
      const ln = lineOf(src, m.index);
      const lt = lineText(lines, ln);
      if (/theme-color|token-exempt|--_/.test(lt)) continue;
      if (/^#[0-9a-fA-F]{3,8}$/.test(m[0]) && /(href|to|id)=["']#/.test(lt)) continue; // kotwice
      if (/^#/.test(m[0]) && src.slice(Math.max(0, m.index - 2), m.index) === "-[") continue; // zgłasza reguła arbitralnych klas
      /* `rgba(var(--coś-rgb), .5)` TO JEST użycie tokenu, i to dokładnie ten wzorzec,
         który `tokens.css` zaleca dla przezroczystości (color-mix odpada przez
         cssTarget safari13). Reguła zgłaszała go jako literał, więc warstwa scen
         dostała 13 fałszywych HIGH na gradientach zbudowanych poprawnie.
         Literałem jest dopiero rgba( z liczbą zaraz za nawiasem. */
      if (/^(?:rgba?|hsla?)\($/.test(m[0])) {
        const after = src.slice(m.index + m[0].length, m.index + m[0].length + 12);
        if (/^\s*var\(--/.test(after)) continue;
      }
      add(file, ln, 1, "design-tokens-only", `kolor literałem ${m[0]} — użyj tokenu`, { snippet: lt });
    }
    if (isJsx(ext)) {
      const reStyle = /style=\{\{[\s\S]*?\}\}/g;
      while ((m = reStyle.exec(src))) {
        const inner = m[0];
        if (/token-exempt|--_/.test(inner)) continue;
        if (!/\b(color|background|backgroundColor|border|borderColor|fill|stroke|boxShadow|outline)\b/.test(inner)) continue;
        if (!/#[0-9a-fA-F]{3,8}|rgba?\(|hsla?\(|oklch\(|\b(white|black|red|blue|green|gray|grey|silver|gold|orange|yellow)\b/.test(inner)) continue;
        const ln = lineOf(src, m.index);
        add(file, ln, 1, "code-no-inline-style-colors", "style={{ … }} z kolorem literałem — klasa kitu albo var(--token)", { snippet: lineText(lines, ln) });
      }
      const reArb = /\b(?:text-\[\d+(?:\.\d+)?px\]|(?:bg|text|border|from|to|via|ring|fill|stroke|shadow|outline|decoration|accent|caret|divide|placeholder)-\[#[0-9a-fA-F]{3,8}\])/g;
      while ((m = reArb.exec(src))) {
        const ln = lineOf(src, m.index);
        add(file, ln, 1, "code-no-arbitrary-tailwind-values", `arbitralna wartość Tailwind ${m[0]} — token/utility z @theme`, { snippet: lineText(lines, ln) });
      }
    }
    if (isCss(ext)) {
      const reFs = /font-size:\s*\d+(?:\.\d+)?px/g;
      while ((m = reFs.exec(src))) {
        const ln = lineOf(src, m.index);
        add(file, ln, 1, "design-tokens-only", `${m[0]} — skala typograficzna w rem/tokenach`, { snippet: lineText(lines, ln) });
      }
    }
  }

  // ── design: Shape Lock ──
  if (!isTokensFile(r)) {
    if (isJsx(ext) || ext === ".html") {
      const reR = /\brounded(?:-(?:t|r|b|l|tl|tr|br|bl|s|e|ss|se|es|ee))?(?:-(xs|sm|md|lg|xl|2xl|3xl|full|none))?\b(?!-\[)/g;
      while ((m = reR.exec(src))) {
        const size = m[1];
        if (size === "lg" || size === "full" || size === "none") continue;
        const ln = lineOf(src, m.index);
        add(file, ln, 1, "design-shape-lock", `${m[0]} → rounded-lg (8px) / rounded-full / rounded-none`, { snippet: lineText(lines, ln) });
      }
      const reRpx = /\brounded(?:-[a-z]{1,2})?-\[(\d+)px\]/g;
      while ((m = reRpx.exec(src))) {
        if (ALLOWED_RADII_PX.has(Number(m[1]))) continue;
        const ln = lineOf(src, m.index);
        add(file, ln, 1, "design-shape-lock", `${m[0]} poza zbiorem {0,8,10,12,999}`, { snippet: lineText(lines, ln) });
      }
    }
    if (isCss(ext)) {
      const reBr = /border(?:-(?:top|bottom)-(?:left|right))?-radius:\s*([^;]+);/g;
      while ((m = reBr.exec(src))) {
        const vals = m[1].match(/\d+(?:\.\d+)?px/g) || [];
        const bad = vals.filter((v) => !ALLOWED_RADII_PX.has(Number(v.replace("px", ""))));
        if (!bad.length) continue;
        const ln = lineOf(src, m.index);
        add(file, ln, 1, "design-shape-lock", `border-radius ${bad.join(" ")} poza zbiorem {0,8,10,12,999} — var(--radius*)`, { snippet: lineText(lines, ln) });
      }
    }
  }

  // ── design: glass / will-change ──
  if (!isTokensFile(r)) {
    const reGlass = /backdrop-filter|backdrop-blur/g;
    while ((m = reGlass.exec(src))) {
      const ln = lineOf(src, m.index);
      add(file, ln, 1, "design-no-glass-no-blur", undefined, { snippet: lineText(lines, ln) });
    }
    /* Wyjątek z reguły: tło i hero-media mogą mieć stały will-change (nie zawierają treści).
       Dokumentacja (.md) jest wyłączona, bo opisuje regułę, a nie ją łamie: DEMO.md
       tłumaczył WŁAŚNIE zdejmowanie podpowiedzi po ruchu i dostawał za to HIGH.
       Wzorzec łapie oba zapisy: CSS `will-change` i reactowe `willChange` w obiekcie
       stylu. Luka znaleziona 2026-09-13: komponent z `style={{ willChange: "transform" }}`
       przechodził audyt na zielono, choć trzymał trwałą warstwę GPU. */
    if (!/glsl-hills|hero-media|bg-layer/.test(r) && !r.endsWith(".md")) {
      const reWc = /will-change|willChange/g;
      while ((m = reWc.exec(src))) {
        const ln = lineOf(src, m.index);
        const text = lineText(lines, ln);
        /* Regułę łamie podpowiedź wpisana NA STAŁE, nie samo jej użycie. Wartość
           przełączana (zmienna, wyrażenie warunkowe, własność custom) jest wzorcem
           POPRAWNYM i tak właśnie działa hook w motion/scroll: podnosi warstwę na
           czas ruchu i zdejmuje po nim. Zgłaszamy więc tylko literał inny niż
           `auto`, np. `will-change: transform;` albo `willChange: "transform"`. */
        const literalAlways = /will-?[cC]hange\s*[:=]\s*["']?(?!auto\b)[a-z-]+/.test(text);
        const toggled = /\?|:\s*[A-Z_a-z$]|var\(--/.test(text.replace(/will-?[cC]hange\s*:/, ""));
        if (literalAlways && !toggled) {
          add(file, ln, 1, "design-animation-fill-backwards", undefined, { snippet: text });
        }
      }
    }
  }

  // ── motion: transition-all, linear/ease-in-out ──
  if (!isTokensFile(r)) {
    const reTa = /\btransition-all\b|transition:\s*all\b/g;
    while ((m = reTa.exec(src))) {
      const ln = lineOf(src, m.index);
      add(file, ln, 1, "motion-no-transition-all-no-linear", "transition-all → lista właściwości (np. transition-[color,opacity])", {
        snippet: lineText(lines, ln),
        fix: "transition-[color,background-color,border-color,opacity,transform]",
      });
    }
    const reEase = /\bease-linear\b|\bease-in-out\b|transition[^;{}]*\b(?:linear|ease-in-out)\b|ease:\s*["'](?:linear|easeInOut)["']/g;
    while ((m = reEase.exec(src))) {
      const ln = lineOf(src, m.index);
      add(file, ln, 1, "motion-no-transition-all-no-linear", "linear/ease-in-out na interakcji → var(--ease-out) / EASE_OUT z tokens", { snippet: lineText(lines, ln) });
    }
  }

  // ── motion: scroll-hijack ──
  if (isCode(ext)) {
    const reScroll = /addEventListener\(\s*["'](scroll|wheel|touchmove)["']/g;
    while ((m = reScroll.exec(src))) {
      const ln = lineOf(src, m.index);
      add(file, ln, 1, "motion-no-pinning-no-scroll-hijack", `addEventListener("${m[1]}") — użyj IntersectionObserver / useInView`, { snippet: lineText(lines, ln) });
    }
  }

  // ── motion: jedna biblioteka ──
  if (isCode(ext)) {
    const reMotion = /import\s*\{[^}]*\bmotion\b[^}]*\}\s*from\s*["']motion\/react["']|from\s*["']framer-motion["']/g;
    while ((m = reMotion.exec(src))) {
      const ln = lineOf(src, m.index);
      add(file, ln, 1, "motion-one-library-lazymotion", undefined, {
        snippet: lineText(lines, ln),
        fix: 'import * as m from "motion/react-m" (+ LazyMotion domAnimation strict w provider.tsx)',
      });
    }
    if (isPrerender(r)) {
      const rePre = /from\s*["']motion(?:\/[a-z-]+)?["']/g;
      while ((m = rePre.exec(src))) {
        const ln = lineOf(src, m.index);
        add(file, ln, 1, "motion-no-motion-in-prerender", undefined, { snippet: lineText(lines, ln) });
      }
    }
    if (isJsx(ext) && !domMaxPresent) {
      const reLayout = /<m\.[a-zA-Z]+[^>]*\s(layout|layoutId|drag|dragConstraints)[\s=>/]/g;
      while ((m = reLayout.exec(src))) {
        const ln = lineOf(src, m.index);
        add(file, ln, 1, "motion-one-library-lazymotion", `${m[1]} wymaga domMax (brak decyzji founderów) — pod domAnimation jest cicho ignorowane`, { snippet: lineText(lines, ln) });
      }
    }
  }

  // ── demo: determinizm i brak sieci w silnikach ──
  if (isCode(ext) && isDashboardOrEngine(r)) {
    const reRand = /\b(Date\.now|Math\.random|performance\.now|new Date\(\)|localStorage|sessionStorage)\b/g;
    while ((m = reRand.exec(src))) {
      const ln = lineOf(src, m.index);
      const lt = lineText(lines, ln);
      if (/determ-exempt/.test(lt) || /determ-exempt/.test(lineText(lines, ln - 1))) continue;
      add(file, ln, 1, "demo-determinism", `${m[1]} w silniku/dashboardzie — stała TODAY / seed / hashFract`, { snippet: lt });
    }
    const reNet = /\b(fetch\(|XMLHttpRequest|new WebSocket|navigator\.sendBeacon)/g;
    while ((m = reNet.exec(src))) {
      const ln = lineOf(src, m.index);
      add(file, ln, 1, "demo-determinism", "sieć w silniku/dashboardzie (fetch/XHR/WebSocket/sendBeacon) — dema liczą 100% client-side", { snippet: lineText(lines, ln) });
    }
  }

  // ── media: video / img ──
  if (isJsx(ext) || ext === ".html") {
    for (const t of tags(src, "video")) {
      const missing = ["muted", "playsInline", "poster"].filter((a) => !new RegExp("\\b" + a + "\\b", "i").test(t.text));
      if (!missing.length) continue;
      const ln = lineOf(src, t.start);
      add(file, ln, 1, "media-video-embed-spec", `<video> bez: ${missing.join(", ")}`, { snippet: lineText(lines, ln), fix: "muted playsInline loop preload=\"metadata\" poster=\"…\" aria-hidden" });
    }
    for (const t of tags(src, "img")) {
      if (/\.\.\./.test(t.text)) continue; // spread propsów — ocena LLM
      const hasW = /\bwidth\s*=/.test(t.text);
      const hasH = /\bheight\s*=/.test(t.text);
      if (hasW && hasH) continue;
      const ln = lineOf(src, t.start);
      add(file, ln, 1, "perf-images-policy", `<img> bez ${!hasW && !hasH ? "width/height" : !hasW ? "width" : "height"} — CLS`, { snippet: lineText(lines, ln) });
    }
  }

  // ── a11y: viewport dvh ──
  if (!isTokensFile(r)) {
    if (isJsx(ext) || ext === ".html") {
      const reHs = /\b(?:min-|max-)?h-screen\b|\[\d+vh\]/g;
      while ((m = reHs.exec(src))) {
        const ln = lineOf(src, m.index);
        const lt = lineText(lines, ln);
        if (/dvh/.test(lt)) continue;
        add(file, ln, 1, "design-overflow-rules", `${m[0]} bez dvh → min-h-[100dvh] (z fallbackiem 100vh w CSS)`, { snippet: lt });
      }
    }
    if (isCss(ext)) {
      const reVh = /\b\d+vh\b/g;
      while ((m = reVh.exec(src))) {
        const blockStart = src.lastIndexOf("{", m.index);
        const blockEnd = src.indexOf("}", m.index);
        const block = src.slice(blockStart, blockEnd === -1 ? undefined : blockEnd);
        if (/dvh/.test(block)) continue;
        const ln = lineOf(src, m.index);
        add(file, ln, 1, "design-overflow-rules", `${m[0]} bez pary dvh w tej samej regule`, { snippet: lineText(lines, ln) });
      }
    }
  }

  // ── a11y: focus-visible ──
  if (isJsx(ext) || ext === ".html") {
    const reCls = /class(?:Name)?=\{?["'`]([^"'`]*)["'`]/g;
    while ((m = reCls.exec(src))) {
      const cls = m[1];
      const hasFocus = /(^|\s)focus:/.test(cls) || /\boutline-none\b/.test(cls);
      if (!hasFocus || /focus-visible:/.test(cls)) continue;
      // pola formularza: :focus (także z myszy) jest poprawnym wskaźnikiem (WIG Forms)
      if (/<(input|textarea|select)\b[^>]*$/.test(src.slice(Math.max(0, m.index - 400), m.index))) continue;
      const ln = lineOf(src, m.index);
      add(file, ln, 1, "a11y-focus-visible-everywhere", undefined, { snippet: lineText(lines, ln), fix: "focus: → focus-visible: ; outline-none tylko razem z focus-visible:ring/outline" });
    }
  }
  if (isCss(ext)) {
    const reFocus = /:focus(?!-visible|-within)\b[^{]*\{([^}]*)\}/g;
    while ((m = reFocus.exec(src))) {
      if (/:focus-visible/.test(m[0])) continue;
      const body = m[1] || "";
      if (!/outline:\s*(none|0)\b/.test(body)) continue; // outline zostaje = wskaźnik jest
      if (/box-shadow|border(-color)?:/.test(body)) continue; // zamiennik wskaźnika (ring/obrys)
      const ln = lineOf(src, m.index);
      add(file, ln, 1, "a11y-focus-visible-everywhere", ":focus → :focus-visible (outline 2.5px solid var(--ring); offset 2px)", { snippet: lineText(lines, ln) });
    }
  }

  // ── design: emoji i glify w tekście ──
  if (!isTypes(r)) {
    const textual = [...strings, ...texts];
    const reEmoji = /\p{Extended_Pictographic}/u;
    const reGlyph = /[✓✔✕✖▲▼►◄←-⇿]/;
    for (const s of textual) {
      const em = s.text.match(reEmoji);
      if (em && !/[©®™←-⇿]/.test(em[0])) {
        const ln = lineOf(src, s.start + s.text.indexOf(em[0]));
        add(file, ln, 1, "design-icons-lucide-one-family", `emoji „${em[0]}” w tekście — ikona lucide albo tekst`, { snippet: lineText(lines, ln) });
      }
      const gl = s.text.match(reGlyph);
      if (gl) {
        const ln = lineOf(src, s.start + s.text.indexOf(gl[0]));
        add(file, ln, 1, "design-icons-lucide-one-family", `glif „${gl[0]}” w tekście — ikona lucide (Check/X/ArrowRight) z aria-hidden`, { snippet: lineText(lines, ln), severity: "LOW" });
      }
    }
  }

  // ── code: React 19 ──
  if (isCode(ext) && !isTypes(r)) {
    const reFr = /\bforwardRef\b/g;
    while ((m = reFr.exec(src))) {
      const ln = lineOf(src, m.index);
      add(file, ln, 1, "code-no-forwardref-react19", "forwardRef → ref jako zwykły prop (React 19)", { snippet: lineText(lines, ln), fix: "function X({ ref, ...props }: Props & { ref?: React.Ref<HTMLElement> })" });
    }
    if (!/^site\/src\/i18n\.tsx$/.test(r)) {
      const reUc = /\buseContext\(/g;
      while ((m = reUc.exec(src))) {
        const ln = lineOf(src, m.index);
        add(file, ln, 1, "code-use-not-usecontext", "useContext(Ctx) → use(Ctx) (React 19)", { snippet: lineText(lines, ln), fix: "const ctx = use(Ctx)" });
      }
    }
  }

  // ── design: eyebrow cap per plik ──
  if (isJsx(ext) && !r.includes("/dashboards/")) {
    let count = 0;
    let first = 0;
    const reEyebrow = /class(?:Name)?=\{?["'`]([^"'`]*)["'`]/g;
    while ((m = reEyebrow.exec(src))) {
      const cls = m[1];
      if (/\blbl-sm\b/.test(cls) || (/\buppercase\b/.test(cls) && /\btracking-/.test(cls))) {
        count++;
        if (!first) first = lineOf(src, m.index);
      }
    }
    if (count > 3) add(file, first, 1, "design-eyebrow-cap", `${count} eyebrow w pliku (limit 3; home = 0)`, { snippet: lineText(lines, first) });
  }

  // ── perf: lazy dashboards w ToolPage ──
  if (/(^|\/)ToolPage\.tsx$/.test(r)) {
    const reImp = /^import\s+[^;]*from\s*["'][^"']*dashboards\/[^"']*["'];?/gm;
    const statics = [];
    while ((m = reImp.exec(src))) statics.push(m.index);
    if (statics.length && !/\blazy\(/.test(src)) {
      const ln = lineOf(src, statics[0]);
      add(file, ln, 1, "code-lazy-routes-and-dashboards", `${statics.length} dashboardów w statycznym imporcie — React.lazy(() => import("…"))`, { snippet: lineText(lines, ln) });
    }
  }

  // ── code: jedno źródło NAP ──
  if (!isContactFile(r) && !isTypes(r)) {
    const reNap = /786\s?296\s?426|\+48\s?786|kontakt@klarow\.com/g;
    while ((m = reNap.exec(src))) {
      const ln = lineOf(src, m.index);
      add(file, ln, 1, "code-contact-single-source", `${m[0]} zaszyte — importuj z contact.ts`, { snippet: lineText(lines, ln) });
    }
  }
}

// ───────────────────────────── uruchomienie ─────────────────────────────
const MAX_FILE_BYTES = 2 * 1024 * 1024;
const scanned = [];
for (const f of files) {
  let raw;
  try {
    if (fs.statSync(f).size > MAX_FILE_BYTES) continue;
    raw = fs.readFileSync(f, "utf8");
  } catch {
    continue;
  }
  if (raw.includes("\0")) continue; // binarny
  scanned.push(rel(f));
  const lines = raw.split("\n");
  brandRules(f, raw, lines);
  mainRules(f, raw);
}
for (const f of brandOnlyFiles) {
  let raw;
  try {
    if (fs.statSync(f).size > MAX_FILE_BYTES) continue;
    raw = fs.readFileSync(f, "utf8");
  } catch {
    continue;
  }
  if (raw.includes("\0")) continue;
  brandRules(f, raw, raw.split("\n"));
}

// klucz baseline: plik|reguła|znormalizowany snippet (odporny na przesunięcia linii)
const norm = (s) => (s || "").replace(/\s+/g, " ").trim().toLowerCase();
for (const f of findings) f.key = `${f.file}|${f.rule}|${norm(f.snippet) || "L" + f.line}`;

// dedupe identycznych (ten sam plik/linia/reguła/msg)
const seen = new Set();
let uniq = findings.filter((f) => {
  const k = `${f.file}|${f.line}|${f.rule}|${f.msg}`;
  if (seen.has(k)) return false;
  seen.add(k);
  return true;
});

let baselineSkipped = 0;
let baselineBlockerIgnored = 0;
if (opts.baseline) {
  const bp = path.isAbsolute(opts.baseline) ? opts.baseline : path.resolve(REPO_ROOT, opts.baseline);
  if (fs.existsSync(bp)) {
    const keys = new Set();
    for (const line of fs.readFileSync(bp, "utf8").split(/\r?\n/)) {
      if (!line.trim()) continue;
      try {
        const o = JSON.parse(line);
        // BLOCKER nigdy nie wchodzi do zbioru tłumionych: baseline zamraża dług HIGH/MEDIUM/LOW,
        // ale twarde zasady CLAUDE.md i prawo muszą blokować push nawet w dniu zero (SKILL.md §Bramka).
        if (String(o.severity || "").toUpperCase() === "BLOCKER") {
          baselineBlockerIgnored++;
          continue;
        }
        keys.add(o.key || `${o.file}|${o.rule}|${norm(o.snippet) || "L" + o.line}`);
      } catch {
        /* pomiń uszkodzoną linię */
      }
    }
    const before = uniq.length;
    // druga bramka na wypadek baseline bez pola `severity`: BLOCKER zostaje zawsze
    uniq = uniq.filter((f) => f.severity === "BLOCKER" || !keys.has(f.key));
    baselineSkipped = before - uniq.length;
    if (baselineBlockerIgnored && !opts.quiet) {
      console.error(`[audit-static] baseline zawiera ${baselineBlockerIgnored} wpis(ów) BLOCKER — zignorowane (BLOCKER nie podlega tłumieniu)`);
    }
  } else if (!opts.quiet) console.error(`[audit-static] baseline nie istnieje: ${rel(bp)} (pomijam)`);
}

const SEV_ORDER = { BLOCKER: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
uniq.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line || a.rule.localeCompare(b.rule));

// ───────────────────────────── wyjście ─────────────────────────────
const byFile = new Map();
for (const f of uniq) {
  if (!byFile.has(f.file)) byFile.set(f.file, []);
  byFile.get(f.file).push(f);
}
const counts = { BLOCKER: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
for (const f of uniq) counts[f.severity]++;
const passFiles = scanned.filter((p) => !byFile.has(p));

if (!opts.quiet) {
  const out = [];
  for (const [file, list] of byFile) {
    const maxSev = list.reduce((acc, f) => (SEV_ORDER[f.severity] < SEV_ORDER[acc] ? f.severity : acc), "LOW");
    out.push(`## ${file} (${list.length}, ${maxSev})`);
    for (const f of list) {
      out.push(`${f.file}:${f.line} - ${f.severity} [${f.rule}] ${f.msg}`);
      if (f.fix) out.push(`  → fix: ${f.fix}`);
    }
  }
  if (!opts.noPass) {
    for (const p of passFiles) {
      out.push(`## ${p}`);
      out.push("✓ pass");
    }
  }
  out.push("");
  out.push(`Σ BLOCKER ${counts.BLOCKER} · HIGH ${counts.HIGH} · MEDIUM ${counts.MEDIUM} · LOW ${counts.LOW} · ✓ pass ${passFiles.length} plików` + (baselineSkipped ? ` · baseline: pominięto ${baselineSkipped}` : ""));
  process.stdout.write(out.join("\n") + "\n");
}

if (opts.json) {
  const jp = path.isAbsolute(opts.json) ? opts.json : path.resolve(process.cwd(), opts.json);
  fs.mkdirSync(path.dirname(jp), { recursive: true });
  fs.writeFileSync(jp, uniq.map((f) => JSON.stringify(f)).join("\n") + (uniq.length ? "\n" : ""), "utf8");
  if (!opts.quiet) console.error(`[audit-static] JSONL: ${jp} (${uniq.length} findings)`);
}

const fail = uniq.some((f) => opts.failOn.includes(f.severity));
process.exit(fail ? 1 : 0);
