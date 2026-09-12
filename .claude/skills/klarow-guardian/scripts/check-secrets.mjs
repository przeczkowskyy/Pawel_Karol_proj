#!/usr/bin/env node
/*
  check-secrets.mjs — higiena sekretów (repo Klarow). Właściciel: reguły secret-*.
  Node 24, ZERO zależności, ZERO npx. Deterministyczny (bez Date.now; wyniki sortowane).
  NIGDY nie wypisuje wartości sekretu — tylko plik:linia, nazwę wzorca i maskę (4 znaki + długość).

  Tryby:
    (bez argumentów) / --all      wszystkie pliki śledzone przez git (`git ls-files`)
    --staged                      pliki z `git diff --cached --name-only` (pre-commit)
    --dist                        dodatkowo site/dist (sekrety w buildzie)
    <plik> [<plik>…]              wskazane pliki/katalogi (rekurencyjnie; np. audit/ docs/)
    --history [N]                 `git log -p --all` (ostatnie N commitów; domyślnie wszystkie) —
                                  skan PRZED upublicznieniem repo; wzorce w DODANYCH liniach + zabronione pliki
    --claude-hook                 wariant hooka PreToolUse Claude Code: czyta JSON ze stdin, odmawia dostępu
                                  do plików z sekretami (.env i .env.*, .dev.vars, .chat_id, credentials*,
                                  *.pem/*.p12/*.key, id_rsa*, Klucze*, RAILWAY-VARS*, PROMO_CODES*, secrets.json)
                                  oraz komend wypisujących/szukających wartości sekretu (echo/cat/Get-Content,
                                  grep/rg/Select-String/findstr po całym repo). UWAGA: w repo hook rejestrujemy
                                  przez scripts/hook-pre-tool.mjs (ten sam zakaz + marka) — patrz
                                  hooks.settings.example.json i rules/secret-never-read-env.md; ten tryb służy
                                  do testów logiki i jako wariant zapasowy.
    --json <file>                 JSONL wg CONTRACT audytu: {file,line,col,severity,rule,msg,fix,confidence,source,snippet,key,pattern,commit?}
    --quiet                       tylko podsumowanie

  Wyjście: 0 = czysto, 1 = znaleziono sekret / zabroniony plik, 2 = błąd użycia.
  Hook: zawsze exit 0 + JSON {hookSpecificOutput:{hookEventName,permissionDecision:"deny"|"allow",permissionDecisionReason}} na stdout.

  Linia z komentarzem `secrets:allow` jest pomijana (świadome wyjątki, np. dokumentacja wzorca).
  Szablony .env.example / .env.sample / .env.template: luźne wzorce (NAZWA=wartość, przypisania) pominięte,
  wzorce dostawców (sk-ant-, token bota Telegram, AKIA…) nadal obowiązują.

  Rejestracja hooka w Claude Code: gotowy plik hooks.settings.example.json (skopiuj do .claude/settings.json),
  matcher "Read|Edit|Write|MultiEdit|NotebookEdit|Bash|PowerShell|Grep|Glob", komenda: scripts/hook-pre-tool.mjs.
  Wariant zapasowy (bez reguł marki), ten sam matcher:
    { "type": "command", "command": "node \".claude/skills/klarow-guardian/scripts/check-secrets.mjs\" --claude-hook" }
  Pre-commit (.git/hooks/pre-commit, bez husky):
    node ".claude/skills/klarow-guardian/scripts/check-secrets.mjs" --staged --quiet || exit 1
*/

import { readFileSync, writeFileSync, existsSync, statSync, readdirSync, mkdirSync } from "node:fs";
import { resolve, relative, join, extname, dirname, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

/* ───────────────────────── argumenty ───────────────────────── */

const argv = process.argv.slice(2);
const opt = { mode: "all", files: [], historyN: 0, dist: false, json: null, quiet: false, hook: false, root: null };
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === "--staged") opt.mode = "staged";
  else if (a === "--all") opt.mode = "all";
  else if (a === "--dist") opt.dist = true;
  else if (a === "--history") {
    opt.mode = "history";
    if (argv[i + 1] && /^\d+$/.test(argv[i + 1])) opt.historyN = Number(argv[++i]);
  } else if (a === "--claude-hook") opt.hook = true;
  else if (a === "--json" || a === "--jsonl") opt.json = argv[++i];
  else if (a === "--quiet") opt.quiet = true;
  else if (a === "--root") opt.root = argv[++i];
  else if (a === "-h" || a === "--help") {
    console.log(readFileSync(fileURLToPath(import.meta.url), "utf8").split("*/")[0].replace(/^\/\*\s*/, ""));
    process.exit(0);
  } else if (a.startsWith("-")) {
    console.error(`Nieznana opcja: ${a} (użyj --help)`);
    process.exit(2);
  } else {
    opt.mode = "files";
    opt.files.push(a);
  }
}

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(opt.root ?? resolve(SCRIPT_DIR, "..", "..", "..", ".."));

/* ───────────────────────── wzorce ───────────────────────── */

/* Ścieżki, których agent nie czyta, nie cytuje i nie commituje (secret-never-read-env). */
const FORBIDDEN_PATH_RE = [
  // dowolna liczba segmentów: .env, .env.local, .env.production.local (standard Vite) — szablony odsiewa TEMPLATE_ENV_RE
  { name: "plik .env (poza .env.example/.sample/.template)", re: /(^|[\\/])\.env(\.[A-Za-z0-9_-]+)*$/i },
  { name: "Cloudflare .dev.vars", re: /(^|[\\/])\.dev\.vars$/i },
  { name: "cache chat_id Telegrama", re: /(^|[\\/])\.chat_id$/i },
  { name: "plik poświadczeń credentials*", re: /(^|[\\/])credentials[^\\/]*\.(json|yaml|yml|toml|txt)$/i },
  { name: "katalog credentials/", re: /(^|[\\/])credentials[\\/]/i },
  { name: "klucz prywatny (*.pem/*.p12/*.pfx/*.key/*.keystore)", re: /\.(pem|p12|pfx|key|keystore|jks)$/i },
  { name: "klucz SSH", re: /(^|[\\/])id_(rsa|ed25519|ecdsa|dsa)(\.pub)?$/i },
  { name: 'plik "Klucze API.txt" (OneDrive/Trading_Bot)', re: /(^|[\\/])Klucze[^\\/]*\.txt$/i },
  { name: "RAILWAY-VARS-TO-PASTE.env", re: /RAILWAY-VARS[^\\/]*$/i },
  { name: "PROMO_CODES.txt", re: /(^|[\\/])PROMO_CODES[^\\/]*$/i },
  { name: "secrets.json / service-account*.json", re: /(^|[\\/])(secrets|service-account[^\\/]*)\.json$/i },
];
/* leadscout/leads.json NIE jest tu: to baza leadów commitowana świadomie przez /lead-scout (dedupe wymaga
   odczytu). Obowiązują za to reguły secret-no-secrets-in-prompts-or-logs i integ-data-egress-review:
   treści z leads.json nie cytujemy w raportach ani nie wysyłamy do MCP/Higgsfield/Manus/LLM. */

/* szablony z NAZWAMI zmiennych (bez wartości): .env.example, .env.production.example, .env.sample, .env.template */
const TEMPLATE_ENV_RE = /(^|[\\/])\.env(\.[A-Za-z0-9_-]+)*\.(example|sample|template)$/i;

/* Wzorce wartości sekretów w treści. */
const SECRET_PATTERNS = [
  { id: "anthropic-key", re: /\bsk-ant-[A-Za-z0-9_-]{20,}/g, sev: "BLOCKER" },
  { id: "openai-key", re: /\bsk-(?:proj-|svcacct-)?[A-Za-z0-9_-]{32,}/g, sev: "BLOCKER" },
  { id: "stripe-key", re: /\b[sr]k_(?:live|test)_[A-Za-z0-9]{16,}/g, sev: "BLOCKER" },
  { id: "aws-access-key", re: /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/g, sev: "BLOCKER" },
  { id: "github-token", re: /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{36,}\b/g, sev: "BLOCKER" },
  { id: "github-pat", re: /\bgithub_pat_[A-Za-z0-9_]{60,}\b/g, sev: "BLOCKER" },
  { id: "telegram-bot-token", re: /\b[0-9]{8,10}:[A-Za-z0-9_-]{35}\b/g, sev: "BLOCKER" },
  { id: "google-api-key", re: /\bAIza[0-9A-Za-z_-]{35}\b/g, sev: "BLOCKER" },
  { id: "slack-token", re: /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/g, sev: "BLOCKER" },
  { id: "resend-key", re: /\bre_[A-Za-z0-9]{20,}\b/g, sev: "BLOCKER" },
  { id: "higgsfield-cloud-key", re: /\bKey\s+[A-Za-z0-9-]{16,}:[A-Za-z0-9_-]{16,}/g, sev: "BLOCKER" },
  { id: "private-key-block", re: /-----BEGIN (?:RSA |EC |DSA |OPENSSH |PGP |ENCRYPTED )?PRIVATE KEY(?: BLOCK)?-----/g, sev: "BLOCKER" },
  { id: "jwt", re: /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g, sev: "HIGH" },
  { id: "bearer-literal", re: /\bBearer\s+[A-Za-z0-9._~+/-]{20,}=*/g, sev: "HIGH" },
  {
    id: "generic-assignment",
    re: /\b(?:api[_-]?key|apikey|secret|token|passw(?:or)?d|auth[_-]?token|access[_-]?key)\s*[:=]\s*["'`]([^"'`\s]{16,})["'`]/gi,
    sev: "HIGH",
    valueGroup: 1,
  },
  {
    id: "env-line-with-value",
    re: /^\s*(?:TELEGRAM_BOT_TOKEN|ANTHROPIC_API_KEY|WEBHOOK_SECRET|ALLOWED_CHAT_ID|OPENAI_API_KEY|STRIPE_SECRET_KEY|RESEND_API_KEY|CLOUDFLARE_API_TOKEN|HIGGSFIELD_KEY_SECRET|HIGGSFIELD_KEY_ID)\s*=\s*["']?(\S{8,})["']?\s*$/gm,
    sev: "BLOCKER",
    valueGroup: 1,
  },
];

const PLACEHOLDER_RE = /[<>…]|\$\{|\{\{|\bxxx+\b|your[_-]?|example|placeholder|changeme|redacted|\.\.\.|^[a-z_-]+$/i;

/* Hook: szukanie sekretu po TREŚCI. `grep -rn TELEGRAM_BOT_TOKEN .` wypisuje dopasowane linie,
   więc wartość z .env ląduje w transkrypcie (secret-never-read-env: „nie grepuje po treści").
   Blokujemy tylko wariant groźny: nazwa sekretu + narzędzie wyszukujące + (wzorzec łapiący WARTOŚĆ
   albo zasięg całego repo). Zawężony grep (`grep -rn TOKEN site demo ui-kit`) przechodzi — to
   dokumentowany test reguły integ-telegram-anthropic-only-in-bots. */
const SECRET_NAME_RE = /\b(TELEGRAM_BOT_TOKEN|ANTHROPIC_API_KEY|WEBHOOK_SECRET|ALLOWED_CHAT_ID|OPENAI_API_KEY|STRIPE_SECRET_KEY|RESEND_API_KEY|CLOUDFLARE_API_TOKEN|HIGGSFIELD_KEY_ID|HIGGSFIELD_KEY_SECRET)\b/;
const SEARCH_VERB_RE = /(?:^|[\s|;&(])(grep|egrep|fgrep|rg|ripgrep|ack|ag|findstr|select-string|sls|awk|sed)\b/i;
const VALUE_CAPTURE_RE = /\b(?:TELEGRAM_BOT_TOKEN|ANTHROPIC_API_KEY|WEBHOOK_SECRET|ALLOWED_CHAT_ID|OPENAI_API_KEY|STRIPE_SECRET_KEY|RESEND_API_KEY|CLOUDFLARE_API_TOKEN|HIGGSFIELD_KEY_ID|HIGGSFIELD_KEY_SECRET)\s*[:=]/;
const ROOT_SCOPE_RE = /(?:^|\s)(?:\.|\.\/|\.\\|\*|\/|~|-Path\s+\.)(?=\s|$)/;

const SKIP_DIRS = new Set(["node_modules", ".git", "dist-ssr"]);
const BINARY_EXT = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".avif", ".ico", ".woff", ".woff2", ".ttf", ".otf", ".pdf", ".zip", ".mp4", ".webm", ".mov", ".mp3", ".wasm", ".pptx", ".docx", ".xlsx"]);
const SELF = relative(ROOT, fileURLToPath(import.meta.url)).split(sep).join("/");

/* ───────────────────────── narzędzia ───────────────────────── */

function git(args) {
  const r = spawnSync("git", args, { cwd: ROOT, encoding: "utf8", maxBuffer: 1 << 30 });
  if (r.status !== 0) {
    const err = (r.stderr || "").trim();
    throw new Error(`git ${args.join(" ")} → exit ${r.status}${err ? ": " + err : ""}`);
  }
  return r.stdout;
}

function mask(s) {
  if (!s) return "";
  return s.slice(0, 4) + "***" + ` (${s.length} zn.)`;
}

function isBinaryBuf(buf) {
  const n = Math.min(buf.length, 2048);
  for (let i = 0; i < n; i++) if (buf[i] === 0) return true;
  return false;
}

function forbiddenPath(p) {
  const norm = p.split("\\").join("/");
  if (TEMPLATE_ENV_RE.test(norm)) return null; // szablon wolno czytać (secret-never-read-env §Wyjątki)
  for (const f of FORBIDDEN_PATH_RE) if (f.re.test(norm)) return f.name;
  return null;
}

function scanText(text, file, findings, { lineOffset = 0, commit = null } = {}) {
  const lines = text.split(/\r?\n/);
  const isTemplateEnv = TEMPLATE_ENV_RE.test(file);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes("secrets:allow")) continue;
    if (line.length > 50000) continue;
    for (const p of SECRET_PATTERNS) {
      // szablon .env.example: wartości-placeholdery nie łapią luźnych wzorców; wzorce dostawców nadal tak
      if (isTemplateEnv && (p.id === "env-line-with-value" || p.id === "generic-assignment")) continue;
      p.re.lastIndex = 0;
      let m;
      while ((m = p.re.exec(line)) !== null) {
        const value = p.valueGroup ? m[p.valueGroup] : m[0];
        if (p.valueGroup && PLACEHOLDER_RE.test(value)) continue;
        if (p.id === "generic-assignment" && !/[0-9]/.test(value) && value === value.toLowerCase()) continue; // słowa, nie klucze
        findings.push({ file, line: i + 1 + lineOffset, pattern: p.id, severity: p.sev, masked: mask(value), ...(commit ? { commit } : {}) });
        if (m[0].length === 0) p.re.lastIndex++;
      }
    }
  }
}

function listFilesRecursive(abs, out) {
  if (!existsSync(abs)) return;
  const st = statSync(abs);
  if (st.isFile()) return void out.push(abs);
  for (const d of readdirSync(abs, { withFileTypes: true })) {
    if (d.isDirectory()) {
      if (SKIP_DIRS.has(d.name)) continue;
      if (d.name === "dist" && !opt.dist) continue;
      listFilesRecursive(join(abs, d.name), out);
    } else if (d.isFile()) out.push(join(abs, d.name));
  }
}

function scanFiles(absFiles, findings, trackedCheck) {
  let scanned = 0;
  for (const abs of absFiles) {
    const rel = relative(ROOT, abs).split(sep).join("/");
    if (rel === SELF) continue;
    const fp = forbiddenPath(rel);
    if (fp) {
      if (trackedCheck) findings.push({ file: rel, line: 0, pattern: "forbidden-file-in-git", severity: "BLOCKER", masked: fp });
      continue; // NIE czytamy plików z sekretami — nawet do skanu
    }
    if (BINARY_EXT.has(extname(rel).toLowerCase())) continue;
    if (!existsSync(abs) || !statSync(abs).isFile()) continue;
    if (statSync(abs).size > 8 * 1024 * 1024) continue;
    const buf = readFileSync(abs);
    if (isBinaryBuf(buf)) continue;
    scanned += 1;
    scanText(buf.toString("utf8"), rel, findings);
  }
  return scanned;
}

/* ───────────────────────── tryby ───────────────────────── */

function runStaged(findings) {
  const out = git(["diff", "--cached", "--name-only", "--diff-filter=ACMR", "-z"]);
  const files = out.split("\0").filter(Boolean).map((f) => resolve(ROOT, f));
  return { files: files.length, scanned: scanFiles(files, findings, true) };
}

function runAll(findings) {
  const out = git(["ls-files", "-z"]);
  const files = out.split("\0").filter(Boolean).map((f) => resolve(ROOT, f));
  if (opt.dist) {
    const distFiles = [];
    listFilesRecursive(resolve(ROOT, "site", "dist"), distFiles);
    files.push(...distFiles);
  }
  return { files: files.length, scanned: scanFiles(files, findings, true) };
}

function runFiles(findings) {
  const files = [];
  for (const f of opt.files) listFilesRecursive(resolve(ROOT, f), files);
  return { files: files.length, scanned: scanFiles(files, findings, false) };
}

function runHistory(findings) {
  const args = ["log", "-p", "--all", "--no-color", "--format=__COMMIT__ %H %s"];
  if (opt.historyN > 0) args.push(`-n${opt.historyN}`);
  const log = git(args);
  let commit = null;
  let file = null;
  let newLine = 0; // numer linii w NOWEJ wersji pliku (z nagłówka hunka @@ -a,b +c,d @@)
  let addedLines = 0;
  let commits = 0;
  for (const raw of log.split(/\r?\n/)) {
    if (raw.startsWith("__COMMIT__ ")) {
      commit = raw.slice(11, 18) + " " + raw.slice(52).slice(0, 60);
      commits += 1;
      continue;
    }
    if (raw.startsWith("+++ b/")) {
      file = raw.slice(6);
      newLine = 0;
      const fp = forbiddenPath(file);
      if (fp) findings.push({ file, line: 0, pattern: "forbidden-file-in-history", severity: "BLOCKER", masked: fp, commit });
      continue;
    }
    if (raw.startsWith("@@")) {
      const m = /\+(\d+)/.exec(raw);
      newLine = m ? Number(m[1]) : 0;
      continue;
    }
    if (raw.startsWith("+") && !raw.startsWith("+++")) {
      addedLines += 1;
      scanText(raw.slice(1), file ?? "?", findings, { commit, lineOffset: newLine - 1 });
      newLine += 1;
    } else if (raw.startsWith(" ")) {
      newLine += 1;
    }
  }
  return { files: commits, scanned: addedLines };
}

function runHook() {
  let input = "";
  try {
    input = readFileSync(0, "utf8");
  } catch {
    input = "";
  }
  let data = {};
  try {
    data = JSON.parse(input || "{}");
  } catch {
    data = {};
  }
  const ti = data.tool_input ?? {};
  const candidates = [];
  for (const k of ["file_path", "path", "notebook_path", "command"]) {
    if (typeof ti[k] === "string" && ti[k]) candidates.push({ key: k, value: ti[k] });
  }
  let reason = null;
  for (const c of candidates) {
    // w komendzie shell sprawdzamy każdy token wyglądający jak ścieżka
    const tokens = c.key === "command" ? c.value.split(/[\s"'`;&|<>()]+/).filter(Boolean) : [c.value];
    for (const t of tokens) {
      const fp = forbiddenPath(t);
      if (fp) {
        reason = `Odmowa (secret-never-read-env): "${t}" to ${fp}. Agent nie czyta, nie cytuje i nie edytuje plików z sekretami. Sekrety trzymamy poza gitem (Cloudflare secrets, Menedżer poświadczeń Windows, leadscout/.env edytowany ręcznie przez foundera). Jeśli potrzebujesz NAZWY zmiennej — jest w .env.example / README.`;
        break;
      }
    }
    if (reason) break;
    if (c.key === "command" && /\b(TELEGRAM_BOT_TOKEN|ANTHROPIC_API_KEY|WEBHOOK_SECRET|RESEND_API_KEY|CLOUDFLARE_API_TOKEN)\s*=\s*["']?\S{12,}/.test(c.value)) {
      reason = "Odmowa (secret-no-secrets-in-prompts-or-logs): komenda zawiera literalną wartość sekretu. Sekret ustawia founder ręcznie (wrangler secret put / dashboard Cloudflare / plik .env) — nie przez agenta.";
      break;
    }
    if (c.key === "command" && SECRET_NAME_RE.test(c.value) && SEARCH_VERB_RE.test(c.value) && (VALUE_CAPTURE_RE.test(c.value) || ROOT_SCOPE_RE.test(c.value))) {
      reason =
        "Odmowa (secret-never-read-env): rekurencyjne szukanie nazwy sekretu po całym repo (grep/rg/Select-String/findstr/awk/sed) wypisze DOPASOWANE LINIE — a więc wartość z .env — do transkryptu; to ekspozycja wymagająca rotacji (secret-rotate-on-exposure). Zawęź wyszukiwanie do katalogów bez sekretów (np. `site demo ui-kit`) albo odczytaj samą NAZWĘ z .env.example / README / rejestru integracji.";
      break;
    }
  }
  const outJson = reason
    ? { hookSpecificOutput: { hookEventName: "PreToolUse", permissionDecision: "deny", permissionDecisionReason: reason } }
    : { hookSpecificOutput: { hookEventName: "PreToolUse", permissionDecision: "allow" } };
  process.stdout.write(JSON.stringify(outJson) + "\n");
  process.exit(0);
}

/* ───────────────────────── main ───────────────────────── */

/* ID reguły musi odpowiadać temu, co znalezisko faktycznie łamie (kontrakt findings: [ID-reguły]).
   Raporty, digesty, dokumentacja i pliki sesji agentów = „zero sekretów w promptach i logach";
   zabroniony plik w gicie / wzorzec w śledzonym pliku = „sekrety poza gitem"; historia = skan przed publikacją. */
const PROMPT_LOG_PATH_RE = /(^|\/)(audit|digesty|docs|\.claude)\//i;

function ruleFor(f) {
  if (opt.mode === "history") return "secret-git-history-scan-before-public";
  if (f.pattern.startsWith("forbidden-file")) return "secret-secrets-outside-git";
  if (opt.mode === "files" && PROMPT_LOG_PATH_RE.test(f.file)) return "secret-no-secrets-in-prompts-or-logs";
  return "secret-secrets-outside-git";
}

function main() {
  if (opt.hook) return runHook();
  const findings = [];
  let stats;
  try {
    if (opt.mode === "staged") stats = runStaged(findings);
    else if (opt.mode === "all") stats = runAll(findings);
    else if (opt.mode === "files") stats = runFiles(findings);
    else if (opt.mode === "history") stats = runHistory(findings);
  } catch (e) {
    console.error(`check-secrets: ${e.message}`);
    process.exit(2);
  }

  // dedupe (ten sam commit+plik+linia+wzorzec) + sortowanie deterministyczne
  const seen = new Set();
  const uniq = findings.filter((f) => {
    const k = `${f.commit ?? ""}|${f.file}|${f.line}|${f.pattern}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  uniq.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line || a.pattern.localeCompare(b.pattern) || String(a.commit ?? "").localeCompare(String(b.commit ?? "")));

  const summary = { BLOCKER: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
  for (const f of uniq) summary[f.severity] = (summary[f.severity] ?? 0) + 1;

  const modeLabel = { staged: "staged (pre-commit)", all: "git ls-files" + (opt.dist ? " + site/dist" : ""), files: "wskazane pliki", history: `git log -p --all${opt.historyN ? ` -n${opt.historyN}` : ""}` }[opt.mode];
  if (!opt.quiet) {
    console.log(`# check-secrets · tryb: ${modeLabel} · root=${ROOT}`);
    if (opt.mode === "history") console.log(`commitów: ${stats.files} · dodanych linii przeskanowanych: ${stats.scanned}`);
    else console.log(`plików: ${stats.files} · przeskanowanych (tekstowych, dozwolonych): ${stats.scanned}`);
    console.log("");
  }
  if (uniq.length) {
    let last = null;
    for (const f of uniq) {
      if (f.file !== last) {
        console.log(`## ${f.file}`);
        last = f.file;
      }
      const where = f.commit ? ` (commit ${f.commit})` : "";
      console.log(`${f.file}:${f.line} - ${f.severity} [${ruleFor(f)}] ${f.pattern}: ${f.masked}${where}`);
    }
    console.log("");
    console.log("→ fix: usuń wartość z pliku/commita, ZROTUJ klucz u dostawcy (secret-rotate-on-exposure), przenieś do Cloudflare secrets / Menedżera poświadczeń; jeśli to świadomy wzorzec w dokumentacji — dopisz `secrets:allow` w tej linii.");
  } else if (!opt.quiet) {
    console.log("✓ pass — brak wzorców sekretów i zabronionych plików");
  }
  console.log(`Σ BLOCKER ${summary.BLOCKER} · HIGH ${summary.HIGH} · MEDIUM ${summary.MEDIUM} · LOW ${summary.LOW}`);

  if (opt.json) {
    const abs = resolve(ROOT, opt.json);
    mkdirSync(dirname(abs), { recursive: true });
    const lines = uniq.map((f) =>
      JSON.stringify({
        file: f.file,
        line: f.line,
        col: 1,
        severity: f.severity,
        rule: ruleFor(f),
        msg: `${f.pattern}: ${f.masked}${f.commit ? ` (commit ${f.commit})` : ""}`,
        fix: "usuń z repo + rotacja u dostawcy + przeniesienie do Cloudflare secrets / Menedżera poświadczeń",
        confidence: f.pattern === "generic-assignment" || f.pattern === "bearer-literal" || f.pattern === "jwt" ? "PLAUSIBLE" : "CONFIRMED",
        source: "check-secrets",
        snippet: f.masked,
        key: `${ruleFor(f)}|${f.file}|${f.line}|${f.pattern}`,
        pattern: f.pattern,
        ...(f.commit ? { commit: f.commit } : {}),
      })
    );
    writeFileSync(abs, lines.join("\n") + (lines.length ? "\n" : ""), "utf8");
  }
  process.exit(uniq.length ? 1 : 0);
}

main();
