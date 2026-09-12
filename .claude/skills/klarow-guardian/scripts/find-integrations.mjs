#!/usr/bin/env node
/*
  find-integrations.mjs — skaner połączeń z aplikacjami/usługami zewnętrznymi (repo Klarow).
  Właściciel: reguły integ-* / secret-* (rejestr: references/integrations-registry.md).
  Node 24, ZERO zależności, ZERO npx (ścieżka repo ma „&" i spację — binarki wołamy przez node).
  Deterministyczny: bez Date.now/Math.random; wyniki sortowane po (severity, plik, linia).

  Co wykrywa (per plik:linia):
    url              https?://host (host z domeną; własna domena = wpis `self-klarow`)
    net-call         fetch( / XMLHttpRequest / WebSocket / EventSource / sendBeacon
                     (definicja handlera `async fetch(request, env, ctx)` w Workerze NIE liczy się)
    script-src       <script src="http(s)://…"> lub "//host/…"
    link-href        <link href="http(s)://…">
    iframe           <iframe src="…">
    css-url          @import url(https://…) / url(https://…) w CSS
    mailto / tel     linki mailto: / tel:
    pkg-import       import/require pakietów SIECIOWYCH (lista NETWORK_PACKAGES)
    env-var          process.env.X / import.meta.env.X / env.X (TYLKO nazwy, nigdy wartości)
    service-mention  słowo kluczowe usługi w kodzie (telegram, anthropic, resend, cal.com, …)

  Porównuje z rejestrem: tabela „Identyfikatory do skanera" w integrations-registry.md
  (kolumny: id · zakres · status · identyfikatory skanera w backtickach: hosty, `*.domena`,
  `mailto:`/`tel:`, nazwy pakietów sieciowych, NAZWY_ENV, słowa kluczowe · słowa pomocnicze
  — ostatnia kolumna to dokumentacja/audyt zależności, skaner jej NIE dopasowuje).
  Z tabeli głównej czyta dodatkowo kolumnę „wpis w /rodo?" (TAK/NIE) per id.

  Ocena (ID reguł = pliki rules/integ-*.md):
    BLOCKER  integracja o statusie „zakazana" obecna w kodzie          [integ-no-external-scripts-on-site / integ-dependency-audit]
    HIGH     NIEZAREJESTROWANE połączenie strukturalne                  [integ-registry-required]
             wpis istnieje, ale status „planowana" — połączenie strukturalne albo net-call
             wdrożone przed decyzją founderów / sekcją w /rodo / CSP     [integ-embed-requires-privacy]
             wpis ma „w /rodo? = TAK", a host nie występuje w site/dist/rodo.html
             albo w Content-Security-Policy w site/public/_headers       [integ-embed-requires-privacy]
             połączenie poza dozwolonym zakresem (np. Anthropic w site/) [integ-telegram-anthropic-only-in-bots / integ-data-egress-review]
             wywołanie sieciowe w silniku demo (lib/, dashboards/, DemoReport) [integ-no-llm-api-in-client-tools]
    MEDIUM   niezarejestrowany mailto:/tel:; net-call bez rozpoznanego hosta; host-stała w bundlu bez wpisu;
             dowodu /rodo nie da się sprawdzić (brak site/dist/rodo.html — strona niezbudowana)
    LOW      niezarejestrowana wzmianka o usłudze (tylko słowo w kodzie)   [integ-data-egress-review]
    INFO     zarejestrowane i zgodne (nie trafia do JSONL problemów; widoczne w --inventory i --all-findings);
             pliki przykładowe (`*.example.json`, `*.example.ts`…) niczego nie aktywują → INFO także przy „planowana"

  Podsumowanie: linia kontraktu „Σ BLOCKER n · HIGH n · MEDIUM n · LOW n" (identycznie jak check-secrets.mjs),
  a pod nią osobna linia informacyjna „informacyjnie: INFO n · NIEZAREJESTROWANE n".

  Użycie:
    node ".claude/skills/klarow-guardian/scripts/find-integrations.mjs" [ścieżki…] [opcje]
      ścieżki…           pliki/katalogi względem root (domyślnie: DEFAULT_PATHS niżej — site/ ze
                         scripts i functions, ui-kit, post-bot, leadscout, demo, .mcp.json,
                         .claude/{settings.json,agents,workflows} i mcp*.json skilli)
      --paths a,b,c      to samo, jako lista po przecinku
      --root <dir>       korzeń repo (domyślnie: wyliczony z położenia skryptu)
      --registry <file>  rejestr (domyślnie ../references/integrations-registry.md)
      --json <file>      JSONL PROBLEMÓW wg CONTRACT audytu:
                         {file,line,col,severity,rule,msg,fix,confidence,source,snippet,key,kind,target,service?,envVar?,registryId}
      --inventory <file> pełny inwentarz JSON (wszystkie wykrycia, także INFO): {root,paths,registry,summary,findings[]}
      --strict           exit 1 także przy HIGH (nie tylko BLOCKER)
      --dist             dołącz site/dist (po buildzie; .html/.css/.js/.txt/.xml)
      --include-md       skanuj też *.md (domyślnie pominięte: README/zrodla.md = szum URL-i)
      --all-findings     wypisz też INFO (zarejestrowane) w tabeli
      --quiet            tylko problemy + podsumowanie
  Exit: 0 czysto (lub tylko MEDIUM/LOW), 1 gdy BLOCKER (zawsze) lub HIGH (z --strict), 2 błąd użycia.

  Pomijane zawsze: node_modules, dist (bez --dist), dist-ssr, .git, .env*, *.lock, package-lock.json,
  .chat_id, leads.json (dane leadów — nie czytamy), digesty/, pliki binarne.
*/

import { readFileSync, writeFileSync, existsSync, statSync, readdirSync, mkdirSync } from "node:fs";
import { resolve, relative, join, dirname, basename, extname, sep } from "node:path";
import { fileURLToPath } from "node:url";

/* ───────────────────────── argumenty ───────────────────────── */

const argv = process.argv.slice(2);
const opt = {
  root: null,
  paths: [],
  registry: null,
  json: null,
  inventory: null,
  strict: false,
  dist: false,
  includeMd: false,
  allFindings: false,
  quiet: false,
};
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  const next = () => argv[++i];
  if (a === "--root") opt.root = next();
  else if (a === "--paths") opt.paths.push(...next().split(",").map((s) => s.trim()).filter(Boolean));
  else if (a === "--registry") opt.registry = next();
  else if (a === "--json" || a === "--jsonl") opt.json = next();
  else if (a === "--inventory") opt.inventory = next();
  else if (a === "--strict") opt.strict = true;
  else if (a === "--dist") opt.dist = true;
  else if (a === "--include-md") opt.includeMd = true;
  else if (a === "--all-findings") opt.allFindings = true;
  else if (a === "--quiet") opt.quiet = true;
  else if (a === "-h" || a === "--help") {
    console.log(readFileSync(fileURLToPath(import.meta.url), "utf8").split("*/")[0].replace(/^\/\*\s*/, ""));
    process.exit(0);
  } else if (a.startsWith("-")) {
    console.error(`Nieznana opcja: ${a} (użyj --help)`);
    process.exit(2);
  } else opt.paths.push(a);
}

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(opt.root ?? resolve(SCRIPT_DIR, "..", "..", "..", ".."));
const REGISTRY = resolve(opt.registry ?? resolve(SCRIPT_DIR, "..", "references", "integrations-registry.md"));

/* Domyślny zasięg bramki. `site/functions` (Pages Functions — jedyne sankcjonowane miejsce na sekrety
   po stronie strony, `integ-telegram-anthropic-only-in-bots`) i `ui-kit` (kit obiecuje: zero hostów,
   zero nazw zmiennych, zero SDK) MUSZĄ tu być, inaczej reguły egzekwują się tylko przy ręcznym podaniu
   ścieżki. `.claude/agents` i `.claude/workflows` to kod orkiestracji — też potrafi wołać sieć. */
const DEFAULT_PATHS = [
  "site/src",
  "site/public",
  "site/index.html",
  "site/vite.config.ts",
  "site/scripts",
  "site/functions",
  "site/package.json",
  "ui-kit",
  "post-bot",
  "leadscout",
  "demo",
  ".mcp.json",
  ".claude/settings.json",
  ".claude/agents",
  ".claude/workflows",
  ".claude/skills/*/mcp*.json",
];

/* ───────────────────────── stałe skanera ───────────────────────── */

const SKIP_DIRS = new Set(["node_modules", "dist-ssr", ".git", "digesty"]);
const SKIP_DIR_UNLESS_DIST = new Set(["dist"]);
const SKIP_FILE_NAMES = new Set([".chat_id", "leads.json", "package-lock.json", ".gitkeep", ".DS_Store"]);
const SKIP_FILE_RE = /^\.env(\..*)?$|\.lock$|\.dev\.vars$/i;
const CODE_EXT = new Set([
  ".ts", ".tsx", ".js", ".mjs", ".cjs", ".jsx", ".json", ".html", ".htm", ".css",
  ".svg", ".xml", ".toml", ".txt", ".yaml", ".yml",
]);
const EXTLESS_OK = new Set(["_headers", "_redirects"]);
const FILE_EXT_TOKEN_RE = /\.(js|mjs|cjs|ts|tsx|jsx|json|css|html|htm|toml|md|txt|png|jpg|jpeg|svg|webp|woff2?|ico|xml|yml|yaml|pdf|mp4|webm)$/i;

/* pakiety, które potrafią wychodzić do sieci — bare import = połączenie do rejestru */
const NETWORK_PACKAGES = new Set([
  "axios", "node-fetch", "undici", "got", "ky", "superagent", "ws", "socket.io-client", "socket.io",
  "@anthropic-ai/sdk", "anthropic", "openai", "@google/generative-ai", "@google-cloud/vertexai",
  "resend", "nodemailer", "@sendgrid/mail", "postmark", "mailgun.js",
  "telegraf", "node-telegram-bot-api", "grammy",
  "stripe", "@stripe/stripe-js", "@stripe/react-stripe-js",
  "@higgsfield/client", "higgsfield-client",
  "@sentry/browser", "@sentry/react", "@sentry/node", "posthog-js", "posthog-node",
  "@vercel/analytics", "@vercel/speed-insights", "react-ga", "react-ga4", "@amplitude/analytics-browser",
  "@calcom/embed-react", "@calcom/embed-core", "@calcom/embed-snippet",
  "firebase", "@supabase/supabase-js", "pusher-js", "ably", "expo-server-sdk",
  "googleapis", "@octokit/rest", "@octokit/core",
  "playwright", "playwright-core", "puppeteer", "puppeteer-core",
  "@cloudflare/workers-types", "wrangler",
  "@manus/sdk", "cloudscraper",
]);

/* słowa kluczowe usług — wzmianka w kodzie = kandydat do rejestru (LOW gdy brak wpisu).
   Lista musi pokrywać słowa kluczowe z rejestru, inaczej wpis w tabeli identyfikatorów jest
   martwą dokumentacją, której skaner nigdy nie dopasuje (integrations-registry.md §2). */
const SERVICE_KEYWORDS = [
  "telegram", "anthropic", "resend", "cal.com", "calcom", "cloudflare", "wrangler", "zaraz",
  "stripe", "higgsfield", "motion.dev", "google", "gtag", "sentry", "plausible.io", "umami",
  "hotjar", "posthog", "manus", "openai", "ksef", "smtp", "workers.dev", "pages.dev",
  "gus", "krs", "ecb", "autenti", "railway", "expo", "nunito", "localstorage", "sessionstorage",
  "onedrive", "npmjs", "claude.ai",
];
const SERVICE_RE = new RegExp(
  "(?<![a-z0-9_])(" + SERVICE_KEYWORDS.map((k) => k.replace(/\./g, "\\.")).join("|") + ")(?![a-z0-9_])",
  "gi"
);

const BENIGN_ENV = new Set(["NODE_ENV", "CI", "MODE", "DEV", "PROD", "SSR", "BASE_URL", "PATH", "HOME", "TEMP", "TMP"]);

/* pliki, w których JAKIEKOLWIEK wywołanie sieciowe = złamanie determinizmu dem */
const ENGINE_PATH_RE = /^site\/src\/(lib\/|components\/dashboards\/|components\/DemoReport\.tsx)/;

/* ───────────────────────── rejestr ───────────────────────── */

/* tabela główna: id → czy kolumna „wpis w /rodo?" mówi TAK (dowód mechaniczny: host w dist/rodo.html + CSP) */
function parseMainTable(lines) {
  const rodo = new Map();
  let headerIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i].toLowerCase();
    if (l.startsWith("|") && l.includes("| id ") && l.includes("usługa")) {
      headerIdx = i;
      break;
    }
  }
  if (headerIdx < 0) return rodo;
  for (let i = headerIdx + 2; i < lines.length; i++) {
    const row = lines[i];
    if (!row.trim().startsWith("|")) break;
    const cells = row.split("|").slice(1, -1).map((c) => c.trim());
    if (cells.length < 9) continue;
    const id = cells[0].replace(/`/g, "").trim();
    if (!/^[a-z0-9][a-z0-9-]*$/.test(id)) continue;
    rodo.set(id, /^tak\b/i.test(cells[cells.length - 1].replace(/[*_`]/g, "").trim()));
  }
  return rodo;
}

function parseRegistry(file) {
  const reg = { file, ok: false, entries: [], byId: new Map(), hosts: new Map(), wildcards: [], schemes: new Map(), envs: new Map(), tokens: new Map(), mainRows: 0 };
  if (!existsSync(file)) return reg;
  const lines = readFileSync(file, "utf8").split(/\r?\n/);
  const rodoById = parseMainTable(lines);
  reg.mainRows = rodoById.size;
  let headerIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i].toLowerCase();
    if (l.startsWith("|") && l.includes("| id") && (l.includes("identyfikator") || l.includes("hosty"))) {
      headerIdx = i;
      break;
    }
  }
  if (headerIdx < 0) return reg;
  for (let i = headerIdx + 2; i < lines.length; i++) {
    const row = lines[i];
    if (!row.trim().startsWith("|")) break;
    const cells = row.split("|").slice(1, -1).map((c) => c.trim());
    if (cells.length < 4) continue;
    const id = cells[0].replace(/`/g, "").trim();
    if (!/^[a-z0-9][a-z0-9-]*$/.test(id)) continue;
    const scopes = cells[1].replace(/`/g, "").split(/[,\s]+/).map((s) => s.trim()).filter(Boolean);
    const status = cells[2].replace(/`/g, "").trim().toLowerCase();
    const idents = [...cells[3].matchAll(/`([^`]+)`/g)].map((m) => m[1].trim()).filter(Boolean);
    const entry = {
      id,
      scopes,
      status,
      forbidden: status.startsWith("zakazana"),
      planned: status.startsWith("planowana"),
      rodo: rodoById.get(id) === true,
      idents,
      hosts: [],
      wildcards: [],
      schemes: [],
      envs: [],
      tokens: [],
    };
    for (const t of idents) {
      if (/^\*\.[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(t)) {
        entry.wildcards.push(t.slice(2).toLowerCase());
        reg.wildcards.push({ suffix: t.slice(2).toLowerCase(), id });
      } else if (/^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(t) && !FILE_EXT_TOKEN_RE.test(t)) {
        entry.hosts.push(t.toLowerCase());
        if (!reg.hosts.has(t.toLowerCase())) reg.hosts.set(t.toLowerCase(), id);
      } else if (/^[a-z]+:$/i.test(t)) {
        entry.schemes.push(t.toLowerCase());
        if (!reg.schemes.has(t.toLowerCase())) reg.schemes.set(t.toLowerCase(), id);
      } else if (/^[A-Z][A-Z0-9_]{2,}$/.test(t)) {
        entry.envs.push(t);
        if (!reg.envs.has(t)) reg.envs.set(t, id);
      } else {
        entry.tokens.push(t.toLowerCase());
        if (!reg.tokens.has(t.toLowerCase())) reg.tokens.set(t.toLowerCase(), id);
      }
    }
    reg.entries.push(entry);
    reg.byId.set(id, entry);
  }
  reg.ok = reg.entries.length > 0;
  return reg;
}

function lookupHost(reg, host) {
  const h = host.toLowerCase();
  if (reg.hosts.has(h)) return reg.hosts.get(h);
  for (const w of reg.wildcards) {
    if (h === w.suffix || h.endsWith("." + w.suffix)) return w.id;
  }
  return null;
}

/* Słowo kluczowe bywa zapisane w rejestrze jako HOST (`cal.com`, `motion.dev`) — wtedy parser
   wrzuca je do entry.hosts, nie do entry.tokens. Bez sprawdzenia hostów każde takie słowo daje
   stały fałszywy alarm „wzmianka o usłudze bez wpisu" (i test bramki jest nieosiągalny). */
function lookupKeyword(reg, kw) {
  const k = kw.toLowerCase();
  const candidates = [];
  for (const e of reg.entries) {
    const hostHit =
      e.hosts.some((h) => h === k || h.endsWith("." + k)) ||
      e.wildcards.some((w) => w === k || k === w || k.endsWith("." + w));
    if (e.tokens.includes(k) || hostHit || e.id === k || e.id.includes(k)) candidates.push(e);
  }
  if (!candidates.length) return null;
  const notForbidden = candidates.find((e) => !e.forbidden);
  return (notForbidden ?? candidates[0]).id;
}

/* ───────────────────────── lista plików ───────────────────────── */

function expandGlobDir(pattern) {
  // obsługa wzorca "<dir>/*/<prefix>*.json" (np. .claude/skills/*/mcp*.json)
  const parts = pattern.split("/");
  const starIdx = parts.indexOf("*");
  if (starIdx < 0) return [pattern];
  const base = join(ROOT, ...parts.slice(0, starIdx));
  if (!existsSync(base)) return [];
  const rest = parts.slice(starIdx + 1).join("/");
  const restRe = new RegExp("^" + rest.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*") + "$", "i");
  const out = [];
  for (const d of readdirSync(base, { withFileTypes: true })) {
    if (!d.isDirectory()) continue;
    const dir = join(base, d.name);
    for (const f of readdirSync(dir, { withFileTypes: true })) {
      if (f.isFile() && restRe.test(f.name)) out.push(relative(ROOT, join(dir, f.name)).split(sep).join("/"));
    }
  }
  return out;
}

function shouldScanFile(abs) {
  const name = basename(abs);
  if (SKIP_FILE_NAMES.has(name) || SKIP_FILE_RE.test(name)) return false;
  const ext = extname(name).toLowerCase();
  if (ext === ".md") return opt.includeMd;
  if (ext === "") return EXTLESS_OK.has(name);
  return CODE_EXT.has(ext);
}

function walk(abs, out) {
  if (!existsSync(abs)) return;
  const st = statSync(abs);
  if (st.isFile()) {
    if (shouldScanFile(abs)) out.push(abs);
    return;
  }
  for (const d of readdirSync(abs, { withFileTypes: true })) {
    if (d.isDirectory()) {
      if (SKIP_DIRS.has(d.name)) continue;
      if (SKIP_DIR_UNLESS_DIST.has(d.name) && !opt.dist) continue;
      walk(join(abs, d.name), out);
    } else if (d.isFile()) {
      const p = join(abs, d.name);
      if (shouldScanFile(p)) out.push(p);
    }
  }
}

function collectFiles() {
  const paths = opt.paths.length ? opt.paths : [...DEFAULT_PATHS, ...(opt.dist ? ["site/dist"] : [])];
  const files = [];
  for (const p of paths) {
    const expanded = p.includes("*") ? expandGlobDir(p) : [p];
    for (const e of expanded) walk(resolve(ROOT, e), files);
  }
  return [...new Set(files)].sort();
}

function isBinary(buf) {
  const n = Math.min(buf.length, 1024);
  for (let i = 0; i < n; i++) if (buf[i] === 0) return true;
  return false;
}

/* ───────────────────────── skan pliku ───────────────────────── */

const URL_RE = /\bhttps?:\/\/([a-z0-9-]+(?:\.[a-z0-9-]+)+)(?::\d+)?/gi;
const PROTO_REL_RE = /\b(?:src|href)\s*=\s*["']\/\/([a-z0-9-]+(?:\.[a-z0-9-]+)+)/gi;
const SCRIPT_SRC_RE = /<script\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/gi;
const LINK_HREF_RE = /<link\b[^>]*\bhref\s*=\s*["']([^"']+)["']/gi;
const IFRAME_RE = /<iframe\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/gi;
const CSS_URL_RE = /(?:@import\s+(?:url\()?\s*["']?|url\(\s*["']?)(https?:\/\/[^"')\s]+)/gi;
const NET_CALL_RE = /(?<![\w.$])(?:new\s+)?(fetch|XMLHttpRequest|WebSocket|EventSource|sendBeacon)\s*\(/g;
const MAILTO_RE = /\bmailto:([^\s"'`?)>]*)/gi;
const TEL_RE = /\btel:(\+?[0-9-]*)/gi;
const IMPORT_RE = /\b(?:import|from|require)\s*\(?\s*["']([^"'./\s][^"'\s]*)["']/g;
const ENV_RE = /\b(?:process\.env|import\.meta\.env|env)\.([A-Z][A-Z0-9_]{2,})\b/g;

function hostOf(value) {
  const m = /^(?:https?:)?\/\/([a-z0-9-]+(?:\.[a-z0-9-]+)+)/i.exec(value);
  return m ? m[1].toLowerCase() : null;
}

function pkgName(spec) {
  if (spec.startsWith("node:")) return null;
  const parts = spec.split("/");
  return spec.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0];
}

function scanFile(abs) {
  const rel = relative(ROOT, abs).split(sep).join("/");
  const buf = readFileSync(abs);
  if (isBinary(buf)) return [];
  const text = buf.toString("utf8");
  const lines = text.split(/\r?\n/);
  const found = [];
  const seen = new Set();
  const push = (f) => {
    // net-call: każde wywołanie osobno (per linia); reszta: dedupe per plik+cel (licznik)
    const key = f.kind === "net-call" ? `${f.kind}|${f.line}|${f.target}` : `${f.kind}|${f.target}`;
    if (seen.has(key)) {
      const prev = found.find((x) => x.kind === f.kind && x.target === f.target && (f.kind !== "net-call" || x.line === f.line));
      if (prev) prev.count += 1;
      return;
    }
    seen.add(key);
    found.push({ file: rel, count: 1, ...f });
  };
  const serviceSeen = new Set();
  const isDistJs = rel.startsWith("site/dist/") && /\.js$/i.test(rel);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const ln = i + 1;
    if (line.length > 20000 && !isDistJs) continue;

    for (const m of line.matchAll(URL_RE)) push({ line: ln, kind: "url", target: m[1].toLowerCase(), host: m[1].toLowerCase() });
    for (const m of line.matchAll(PROTO_REL_RE)) push({ line: ln, kind: "url", target: m[1].toLowerCase(), host: m[1].toLowerCase() });

    for (const m of line.matchAll(SCRIPT_SRC_RE)) {
      const h = hostOf(m[1]);
      if (h) push({ line: ln, kind: "script-src", target: m[1], host: h });
    }
    for (const m of line.matchAll(LINK_HREF_RE)) {
      const h = hostOf(m[1]);
      if (h) push({ line: ln, kind: "link-href", target: m[1], host: h });
    }
    for (const m of line.matchAll(IFRAME_RE)) {
      const h = hostOf(m[1]);
      push({ line: ln, kind: "iframe", target: m[1], host: h });
    }
    if (/\.css$/i.test(rel) || /<style/i.test(line) || /style=/.test(line)) {
      for (const m of line.matchAll(CSS_URL_RE)) push({ line: ln, kind: "css-url", target: m[1], host: hostOf(m[1]) });
    }

    if (isDistJs) continue; // w zminifikowanym JS reszta wzorców = szum; liczą się hosty

    for (const m of line.matchAll(NET_CALL_RE)) {
      // definicja metody/funkcji `async fetch(request, env, ctx)` (handler Workera) to nie wywołanie
      const before = line.slice(0, m.index);
      if (/\basync\s*$/.test(before) || /\bfunction\s*$/.test(before)) continue;
      if (/^\s*(export\s+)?(async\s+)?(function\s+)?fetch\s*\([^)]*\)\s*\{/.test(line)) continue;
      const hostsOnLine = [...line.matchAll(URL_RE)].map((u) => u[1].toLowerCase());
      // literał względny: fetch("/api/…"), fetch(`./dane.json`) — ten sam origin, zero egressu
      const relativeTarget = /^\s*(["'`])(?:\/(?!\/)|\.{1,2}\/|[?#])/.test(line.slice(m.index + m[0].length));
      push({ line: ln, kind: "net-call", target: m[1] + "(", hostsOnLine, relativeTarget });
    }
    for (const m of line.matchAll(MAILTO_RE)) push({ line: ln, kind: "mailto", target: "mailto:" + m[1] });
    for (const m of line.matchAll(TEL_RE)) push({ line: ln, kind: "tel", target: "tel:" + m[1] });

    if (/\.(ts|tsx|js|mjs|cjs|jsx)$/i.test(rel)) {
      for (const m of line.matchAll(IMPORT_RE)) {
        const name = pkgName(m[1]);
        if (name && NETWORK_PACKAGES.has(name)) push({ line: ln, kind: "pkg-import", target: name });
      }
      for (const m of line.matchAll(ENV_RE)) {
        if (!BENIGN_ENV.has(m[1])) push({ line: ln, kind: "env-var", target: m[1], envVar: m[1] });
      }
    }

    for (const m of line.matchAll(SERVICE_RE)) {
      const kw = m[1].toLowerCase();
      if (serviceSeen.has(kw)) continue;
      serviceSeen.add(kw);
      push({ line: ln, kind: "service-mention", target: kw, service: kw });
    }
  }

  // service = z hosta (np. api.telegram.org → telegram) — informacyjnie do JSON
  const hostsInFile = [...new Set(found.filter((f) => f.host).map((f) => f.host))];
  for (const f of found) {
    if (f.host && !f.service) {
      const kw = SERVICE_KEYWORDS.find((k) => f.host.includes(k.replace(".dev", "").replace(".com", "")));
      if (kw) f.service = kw;
    }
    if (f.kind === "net-call") f.hostsInFile = hostsInFile;
    if (isDistJs && f.host) f.bundled = true;
  }
  return found;
}

/* ───────────────────────── ocena vs rejestr ───────────────────────── */

const STRUCTURAL = new Set(["url", "script-src", "link-href", "iframe", "css-url", "pkg-import", "env-var"]);
/* rodzaje, które REALNIE ładują cudzy zasób w przeglądarce użytkownika (embed/beacon/font/obraz) */
const RUNTIME_EXTERNAL = new Set(["script-src", "link-href", "iframe", "css-url"]);
/* plik przykładowy (mcp.example.json, foo.example.ts) niczego nie aktywuje — to dokumentacja */
const EXAMPLE_FILE_RE = /\.example\.[a-z0-9]+$/i;

const RODO_HTML = "site/dist/rodo.html";
const HEADERS_FILE = "site/public/_headers";

/* Dowód mechaniczny dla warunków (2) sekcja w /rodo i (3) CSP z nagłówka rejestru.
   Czytane raz, leniwie; brak plików = brak dowodu (nie udajemy, że jest OK). */
let privacyCache = null;
function privacyEvidence() {
  if (privacyCache) return privacyCache;
  const rodoAbs = resolve(ROOT, RODO_HTML);
  const headersAbs = resolve(ROOT, HEADERS_FILE);
  const headers = existsSync(headersAbs) ? readFileSync(headersAbs, "utf8") : "";
  privacyCache = {
    rodo: existsSync(rodoAbs) ? readFileSync(rodoAbs, "utf8").toLowerCase() : null,
    headers: headers.toLowerCase(),
    hasCsp: /content-security-policy/i.test(headers),
  };
  return privacyCache;
}

function topDir(rel) {
  return rel.split("/")[0];
}

function scopeAllows(entry, rel) {
  if (!entry || !entry.scopes.length) return true;
  const top = topDir(rel);
  for (const s of entry.scopes) {
    if (s === "*" || s === "wszędzie" || s === "wszedzie") return true;
    if (s === top) return true;
    if (s === "dev" && (top === ".claude" || rel.startsWith("site/scripts"))) return true;
  }
  return false;
}

function evaluate(findings, reg) {
  for (const f of findings) {
    let id = null;
    if (f.kind === "url" || f.kind === "script-src" || f.kind === "link-href" || f.kind === "iframe" || f.kind === "css-url") {
      id = f.host ? lookupHost(reg, f.host) : null;
    } else if (f.kind === "mailto") id = reg.schemes.get("mailto:") ?? null;
    else if (f.kind === "tel") id = reg.schemes.get("tel:") ?? null;
    else if (f.kind === "pkg-import") id = reg.tokens.get(f.target.toLowerCase()) ?? null;
    else if (f.kind === "env-var") id = reg.envs.get(f.target) ?? null;
    else if (f.kind === "service-mention") id = lookupKeyword(reg, f.target);
    else if (f.kind === "net-call") {
      for (const h of f.hostsOnLine ?? []) {
        id = lookupHost(reg, h);
        if (id) break;
      }
      if (!id && f.relativeTarget && reg.byId.has("self-klarow")) {
        id = "self-klarow";
        f.selfOrigin = true;
      }
      if (!id) {
        // fetch(`${API}/…`) — host zdefiniowany wyżej w tym samym pliku: przypisanie po pliku (PLAUSIBLE)
        for (const h of f.hostsInFile ?? []) {
          id = lookupHost(reg, h);
          if (id) {
            f.assumed = true;
            break;
          }
        }
      }
    }
    const entry = id ? reg.byId.get(id) : null;
    f.registryId = id;
    f.registered = Boolean(id);
    f.rule = "integ-registry-required";
    f.msg = "";
    f.fix = "";

    if (f.bundled && !(entry && entry.forbidden)) {
      // host jako stała w zbundlowanej bibliotece (site/dist/assets/*.js) — nie musi być requestem
      f.severity = entry ? "INFO" : "MEDIUM";
      f.rule = "integ-no-external-scripts-on-site";
      f.msg = entry ? `zarejestrowane jako ${id} (stała w bundlu)` : `host „${f.target}" w zbundlowanym JS — sprawdź, czy to request runtime czy stała biblioteki; jeśli stała: wpis \`bundled-lib-strings\``;
      f.fix = entry ? "" : "DevTools → Network po wejściu na stronę: 0 requestów do tego hosta; wtedy dopisz host do wpisu bundled-lib-strings";
      continue;
    }
    if (entry && entry.forbidden && (STRUCTURAL.has(f.kind) || f.kind === "net-call")) {
      f.severity = "BLOCKER";
      f.rule = f.kind === "pkg-import" ? "integ-dependency-audit" : "integ-no-external-scripts-on-site";
      f.msg = `integracja ZAKAZANA w rejestrze (${id}) obecna w kodzie: ${f.target}`;
      f.fix = "usuń połączenie albo zmień status w rejestrze po decyzji founderów";
      continue;
    }
    if (f.kind === "net-call" && ENGINE_PATH_RE.test(f.file)) {
      f.severity = "HIGH";
      f.rule = "integ-no-llm-api-in-client-tools";
      f.msg = `wywołanie sieciowe ${f.target} w silniku demo/narzędzia — łamie determinizm i „zero chmury dostawcy"`;
      f.fix = "silnik liczy lokalnie; dane wejściowe przez props/plik, zero fetch";
      continue;
    }
    if (entry && STRUCTURAL.has(f.kind) && !scopeAllows(entry, f.file)) {
      f.severity = "HIGH";
      f.rule = id && /anthropic|telegram/.test(id) ? "integ-telegram-anthropic-only-in-bots" : "integ-data-egress-review";
      f.msg = `${f.target} (${id}) poza dozwolonym zakresem [${entry.scopes.join(", ")}] — plik w „${topDir(f.file)}/"`;
      f.fix = "przenieś do dozwolonego katalogu albo rozszerz zakres w rejestrze po decyzji founderów";
      continue;
    }
    /* Status „planowana" = decyzja founderów (D-15/D-16), sekcja w /rodo i CSP jeszcze NIE istnieją.
       Kod, który taką integrację uruchamia, jest faktem dokonanym przed procedurą — a nie INFO. */
    if (entry && entry.planned && (STRUCTURAL.has(f.kind) || f.kind === "net-call") && !EXAMPLE_FILE_RE.test(f.file)) {
      f.severity = "HIGH";
      f.rule = "integ-embed-requires-privacy";
      f.msg = `${f.target} — wpis istnieje (${id}), ale status \`planowana\`: brak decyzji founderów / sekcji w /rodo / CSP; wdrożenie przed zmianą statusu = obejście procedury`;
      f.fix = `najpierw decyzja (docs/DECISIONS.md) + sekcja w /rodo + CSP w ${HEADERS_FILE}, potem status \`aktywna\` w references/integrations-registry.md, dopiero na końcu kod`;
      continue;
    }
    /* Wpis „w /rodo? = TAK" ma mieć pokrycie w treści: host w zbudowanym /rodo i w CSP.
       Bez tego warunki (2) i (3) z nagłówka rejestru pozostają deklaracją, nie bramką. */
    if (entry && entry.rodo && f.host && RUNTIME_EXTERNAL.has(f.kind) && f.file.startsWith("site/") && !f.file.startsWith("site/dist/")) {
      const ev = privacyEvidence();
      const gaps = [];
      let unbuiltOnly = false;
      if (ev.rodo === null) {
        gaps.push(`nie zweryfikowano sekcji w /rodo (brak ${RODO_HTML} — zbuduj stronę)`);
        unbuiltOnly = true;
      } else if (!ev.rodo.includes(f.host)) {
        gaps.push(`host nie występuje w ${RODO_HTML} (brak opisu odbiorcy danych)`);
      }
      if (!ev.hasCsp || !ev.headers.includes(f.host)) {
        gaps.push(`host nie występuje w Content-Security-Policy w ${HEADERS_FILE}`);
        unbuiltOnly = false;
      }
      if (gaps.length) {
        f.severity = unbuiltOnly ? "MEDIUM" : "HIGH";
        f.rule = "integ-embed-requires-privacy";
        f.msg = `${f.target} (${id}, „wpis w /rodo? = TAK") — ${gaps.join("; ")}`;
        f.fix = `dopisz usługę jako odbiorcę danych w /rodo i host do CSP w ${HEADERS_FILE} (rules/integ-embed-requires-privacy.md)`;
        continue;
      }
    }
    if (f.registered) {
      f.severity = "INFO";
      if (f.selfOrigin) f.msg = `wywołanie o adresie względnym (własny origin) → ${id}`;
      else if (f.assumed) f.msg = `wywołanie sieciowe przypisane po pliku do ${id} (host zdefiniowany wyżej w pliku)`;
      else if (entry && entry.planned && EXAMPLE_FILE_RE.test(f.file)) f.msg = `zarejestrowane jako ${id} (status \`planowana\`; plik przykładowy — nie aktywuje połączenia)`;
      else f.msg = `zarejestrowane jako ${id}`;
      continue;
    }
    if (STRUCTURAL.has(f.kind)) {
      f.severity = "HIGH";
      f.msg = `NIEZAREJESTROWANE połączenie (${f.kind}): ${f.target}`;
      f.fix = "dopisz wpis do references/integrations-registry.md (obie tabele) PRZED kodem; decyzja founderów + /rodo jeśli runtime-external";
    } else if (f.kind === "mailto" || f.kind === "tel") {
      f.severity = "MEDIUM";
      f.msg = `niezarejestrowany link ${f.kind}: ${f.target}`;
      f.fix = "dopisz `mailto:`/`tel:` do identyfikatorów wpisu w rejestrze";
    } else if (f.kind === "net-call") {
      f.severity = "MEDIUM";
      f.msg = `wywołanie sieciowe ${f.target} bez rozpoznanego hosta w tej linii — sprawdź ręcznie, dokąd idą dane`;
      f.fix = "host w tej samej linii albo wpis w rejestrze z opisem danych";
    } else {
      f.severity = "LOW";
      f.rule = "integ-data-egress-review";
      f.msg = `wzmianka o usłudze „${f.target}" bez wpisu w rejestrze`;
      f.fix = "jeśli to realne połączenie — wpis w rejestrze; jeśli tylko copy — dopisz słowo kluczowe do istniejącego wpisu";
    }
  }
}

/* ───────────────────────── wyjście ───────────────────────── */

const SEV_ORDER = { BLOCKER: 0, HIGH: 1, MEDIUM: 2, LOW: 3, INFO: 4 };

function pad(s, n) {
  s = String(s ?? "");
  return s.length >= n ? s : s + " ".repeat(n - s.length);
}

function printTable(rows) {
  const cols = [
    ["SEV", 7],
    ["RODZAJ", 15],
    ["PLIK:LINIA", 52],
    ["CEL", 40],
    ["REJESTR", 24],
  ];
  const head = cols.map(([n, w]) => pad(n, w)).join(" ");
  console.log(head);
  console.log("-".repeat(head.length));
  for (const r of rows) {
    const loc = `${r.file}:${r.line}` + (r.count > 1 ? ` (×${r.count})` : "");
    console.log(
      [pad(r.severity, 7), pad(r.kind, 15), pad(loc.length > 52 ? "…" + loc.slice(-51) : loc, 52), pad(r.target.length > 40 ? r.target.slice(0, 39) + "…" : r.target, 40), pad(r.registryId ?? "—", 24)].join(" ")
    );
  }
}

function writeOut(file, content) {
  const abs = resolve(ROOT, file);
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, content, "utf8");
}

function main() {
  const reg = parseRegistry(REGISTRY);
  const files = collectFiles();
  const findings = [];
  for (const f of files) findings.push(...scanFile(f));
  evaluate(findings, reg);
  findings.sort((a, b) => SEV_ORDER[a.severity] - SEV_ORDER[b.severity] || a.file.localeCompare(b.file) || a.line - b.line || a.kind.localeCompare(b.kind) || a.target.localeCompare(b.target));

  const summary = { BLOCKER: 0, HIGH: 0, MEDIUM: 0, LOW: 0, INFO: 0, files: files.length, findings: findings.length, unregistered: 0 };
  for (const f of findings) {
    summary[f.severity] += 1;
    if (!f.registered) summary.unregistered += 1;
  }

  const relReg = relative(ROOT, REGISTRY).split(sep).join("/");
  if (!opt.quiet) {
    console.log(`# find-integrations · root=${ROOT}`);
    console.log(`rejestr: ${relReg} — ${reg.ok ? reg.entries.length + " wpisów" : "BRAK / nieczytelny (wszystko będzie NIEZAREJESTROWANE)"}`);
    console.log(`plików przeskanowanych: ${files.length}${opt.dist ? " (z site/dist)" : ""}${opt.includeMd ? " (z *.md)" : ""}\n`);
    const rows = opt.allFindings ? findings : findings.filter((f) => f.severity !== "INFO");
    if (rows.length) {
      printTable(rows);
    } else {
      console.log("(brak problemów — użyj --all-findings, aby zobaczyć zarejestrowane połączenia)");
    }
    const byId = new Map();
    for (const f of findings) {
      if (!f.registryId) continue;
      const cur = byId.get(f.registryId) ?? { n: 0, files: new Set() };
      cur.n += f.count;
      cur.files.add(f.file);
      byId.set(f.registryId, cur);
    }
    if (byId.size) {
      console.log("\nZarejestrowane integracje wykryte w kodzie:");
      for (const [id, v] of [...byId.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
        console.log(`  ${pad(id, 30)} ${String(v.n).padStart(3)} trafień w ${v.files.size} pl.`);
      }
    }
    console.log("");
  }

  const problems = findings.filter((f) => f.severity !== "INFO");
  if (problems.length) {
    console.log("Problemy (format audytu):");
    let lastFile = null;
    for (const p of problems) {
      if (p.file !== lastFile) {
        console.log(`\n## ${p.file}`);
        lastFile = p.file;
      }
      console.log(`${p.file}:${p.line} - ${p.severity} [${p.rule}] ${p.msg}${p.fix ? `\n  → fix: ${p.fix}` : ""}`);
    }
    console.log("");
  }
  // linia kontraktu audytu — identyczna jak w check-secrets.mjs; INFO/NIEZAREJESTROWANE osobno
  console.log(`Σ BLOCKER ${summary.BLOCKER} · HIGH ${summary.HIGH} · MEDIUM ${summary.MEDIUM} · LOW ${summary.LOW}`);
  console.log(`informacyjnie: INFO ${summary.INFO} · NIEZAREJESTROWANE ${summary.unregistered}`);

  if (opt.json) {
    const lines = problems.map((p) =>
      JSON.stringify({
        file: p.file,
        line: p.line,
        col: 1,
        severity: p.severity,
        rule: p.rule,
        msg: p.msg,
        fix: p.fix || null,
        confidence: p.kind === "service-mention" || p.kind === "net-call" || p.bundled || p.assumed ? "PLAUSIBLE" : "CONFIRMED",
        source: "find-integrations",
        snippet: p.target,
        key: `${p.rule}|${p.file}|${p.kind}|${p.target}`,
        kind: p.kind,
        target: p.target,
        ...(p.service ? { service: p.service } : {}),
        ...(p.envVar ? { envVar: p.envVar } : {}),
        registryId: p.registryId,
      })
    );
    writeOut(opt.json, lines.join("\n") + (lines.length ? "\n" : ""));
    if (!opt.quiet) console.log(`JSONL (problemy): ${opt.json}`);
  }
  if (opt.inventory) {
    const out = {
      root: ROOT,
      paths: opt.paths.length ? opt.paths : DEFAULT_PATHS,
      registry: { file: relReg, entries: reg.entries.length },
      summary,
      findings: findings.map((f) => ({
        file: f.file,
        line: f.line,
        kind: f.kind,
        target: f.target,
        ...(f.service ? { service: f.service } : {}),
        ...(f.envVar ? { envVar: f.envVar } : {}),
        count: f.count,
        registered: f.registered,
        registryId: f.registryId,
        ...(f.assumed ? { assumed: true } : {}),
        ...(f.bundled ? { bundled: true } : {}),
        severity: f.severity,
        rule: f.rule,
        msg: f.msg,
      })),
    };
    writeOut(opt.inventory, JSON.stringify(out, null, 2) + "\n");
    if (!opt.quiet) console.log(`Inwentarz JSON: ${opt.inventory}`);
  }

  if (summary.BLOCKER > 0) process.exit(1);
  if (opt.strict && summary.HIGH > 0) process.exit(1);
  process.exit(0);
}

main();
