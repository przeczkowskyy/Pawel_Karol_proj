#!/usr/bin/env node
/**
 * hook-pre-tool.mjs — hook Claude Code PreToolUse
 * (matcher: Read|Edit|Write|MultiEdit|Bash|PowerShell|Grep|Glob — patrz ../hooks.settings.example.json;
 * PowerShell jest w tym środowisku powłoką podstawową, a MultiEdit zwykłym narzędziem edycji,
 * więc oba MUSZĄ być w matcherze — inaczej gałęzie niżej są martwe).
 *
 * Czyta JSON ze stdin ({tool_name, tool_input}). Blokuje (exit 2 + powód na stderr):
 *   1. dostęp do plików sekretów po ścieżce ALBO w komendzie powłoki: .env (bez .env.example),
 *      .env.*, .dev.vars, *.pem, credentials*.json, .chat_id / chat_id, Klucze*. Lewa granica
 *      wzorca obejmuje separatory powłoki (spacja, tabulator, „=", „:", cudzysłów, nawias),
 *      więc łapie także „cat .env", „cd leadscout && cat .env", „type .env", „Get-Content .env"
 *      — nie tylko zapis ze ścieżką („cat leadscout/.env"). W komendach dochodzi luźniejszy
 *      wzorzec celu (plik „env" bez kropki, ścieżka sklejona ze zmiennej, .dev.vars, .chat_id)
 *      przy czasowniku czytającym/kopiującym oraz jawne odwołania do
 *      TELEGRAM_BOT_TOKEN / ANTHROPIC_API_KEY;
 *   2. Edit/Write/MultiEdit pod site/**, demo/**, ui-kit/** z treścią zawierającą nazwę
 *      poprzedniej firmy (case-insensitive) albo stare złoto „#FFA914" / „FFA914";
 *   3. ZAPIS przez powłokę do site/**, demo/**, ui-kit/** (>, >>, tee, sed -i / perl -i,
 *      heredoc, Set-Content/Add-Content/Out-File/New-Item) z tą samą treścią. Bez p. 3 bramka
 *      marki była do obejścia jednym `cat > site/... <<EOF`, a audytorzy mają wyłącznie
 *      Read/Grep/Glob/Bash i piszą raporty właśnie heredokiem.
 * Wszystko inne: exit 0 (cisza). „Mask, don't remove": narzędzie zostaje, odmowa ma powód,
 * więc model uczy się w tej samej sesji.
 *
 * Test regresyjny (bez hosta): node hook-pre-tool.mjs --selftest
 * — wypisuje PASS/FAIL dla przypadków granicznych (m.in. `cat .env`, `cd X && cat .env`,
 *   `type .env`, `Get-Content .env`) i kończy exit 1, gdy którykolwiek FAIL.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..", "..", "..");

// ───────────────────────────── wzorce ─────────────────────────────
// Lewa granica: początek, separator ścieżki ALBO separator powłoki. Prawa granica jako lookahead,
// żeby „.env" na końcu komendy również trafiało.
const SECRET_PATH =
  /(^|[\\/\s=:"'`(])(\.env(?!\.example)(\.[\w.-]*)?|\.dev\.vars|[^\\/\s"'`]*\.pem|credentials[^\\/\s"'`]*\.json|\.?chat_id|Klucze[^\\/\s"'`]*)(?=$|[\\/\s"'`;,)|&>])/i;
const SECRET_WORDS = /\b(TELEGRAM_BOT_TOKEN|ANTHROPIC_API_KEY|WEBHOOK_SECRET)\b/;
// Luźniejszy wzorzec TYLKO dla komend: plik „env" bez kropki, ścieżka sklejona ze zmiennej,
// .dev.vars, .chat_id, katalog „Klucze". Wymaga czasownika czytającego/kopiującego, żeby
// „git commit -m 'porzadki: env'" nie był blokowany.
const READ_VERB =
  /(^|[\s;|&(])(cat|type|more|less|head|tail|sed|awk|grep|rg|egrep|fgrep|strings|xxd|od|base64|cp|copy|mv|move|scp|rsync|curl|wget|nc|source|dotenv|Get-Content|gc|Select-String|Get-Item|Format-Hex|Import-Csv|Copy-Item|Move-Item)\b/i;
const SECRET_CMD_TARGET = /(^|[\s=:"'`\\/(])\.?env(\.[\w.-]+)?(?=$|[\s;|&)"'`,])|\.dev\.vars|\.chat_id|\bKlucze\b/i;
const SECRET_ECHO = /(echo|printenv|Get-ChildItem Env|\$env:|cat|type|Get-Content|set |export )/i;

const BRAND_NAME = /nuconic/i;
const BRAND_GOLD = /#?ffa914\b/i;
const PUBLIC_DIR = /^(site|demo|ui-kit)\//;
const PUBLIC_ANYWHERE = /(^|\/)(site|demo|ui-kit)\//;

/** Ścieżki, do których komenda ZAPISUJE (redirect, tee, sed -i / perl -i, cmdlety PowerShella). */
function shellWriteTargets(cmd) {
  const out = [];
  const push = (s) => {
    const t = String(s || "")
      .replace(/^["'`]+|["'`]+$/g, "")
      .replace(/\\/g, "/");
    if (t) out.push(t);
  };
  for (const m of cmd.matchAll(/(?:^|[^0-9<>&])>>?\s*(["'`]?)([^\s"'`|;&<>]+)\1/g)) push(m[2]);
  for (const m of cmd.matchAll(/(?:^|[\s;|&(])tee\s+(?:-a\s+)?(["'`]?)([^\s"'`|;&]+)\1/gi)) push(m[2]);
  for (const m of cmd.matchAll(/(?:^|[\s;|&(])(?:Set-Content|Add-Content|Out-File|New-Item|Copy-Item|Move-Item)\b([^|;&]*)/gi)) {
    for (const tok of String(m[1] || "").split(/\s+/)) if (/[\\/.]/.test(tok)) push(tok);
  }
  if (/(?:^|[\s;|&(])(?:sed|perl)\b[^|;&]*?\s-i\b/i.test(cmd)) {
    for (const tok of cmd.split(/[\s;|&]+/)) if (/[\\/]/.test(tok)) push(tok);
  }
  return out;
}
const writesToPublic = (cmd) => shellWriteTargets(cmd).some((t) => PUBLIC_DIR.test(t.replace(/^\.\//, "")) || PUBLIC_ANYWHERE.test(t));

// ───────────────────────────── ocena (czysta funkcja) ─────────────────────────────
/** @returns {string|null} powód odmowy albo null (przepuszczamy). */
function evaluate(payload) {
  const tool = (payload && payload.tool_name) || "";
  const ti = (payload && payload.tool_input) || {};

  // 1. ścieżki plików (Read/Edit/Write/MultiEdit/Glob/Grep)
  const pathFields = [ti.file_path, ti.path, ti.notebook_path, ti.pattern].filter((v) => typeof v === "string");
  for (const p of pathFields) {
    if (SECRET_PATH.test(p)) {
      return `dostęp do pliku sekretów (${p}). Zasada secret-never-read-env: agent nigdy nie czyta ani nie cytuje .env/kluczy/chat_id (CLAUDE.md #6). Jeśli potrzebujesz wartości — poproś foundera, nie plik.`;
    }
  }

  // 2. komendy powłoki (Bash i PowerShell — tu PowerShell jest powłoką podstawową)
  if ((tool === "Bash" || tool === "PowerShell") && typeof ti.command === "string") {
    const cmd = ti.command;
    if (SECRET_PATH.test(cmd) || (READ_VERB.test(cmd) && SECRET_CMD_TARGET.test(cmd))) {
      return `komenda odwołuje się do pliku sekretów. Zasada secret-never-read-env: nie cat/type/Get-Content/echo na .env (także po „cd" do innego katalogu), *.pem, credentials*, .chat_id. Użyj wartości z Menedżera poświadczeń Windows / sekretów Cloudflare, nie z pliku.`;
    }
    if (SECRET_WORDS.test(cmd) && SECRET_ECHO.test(cmd)) {
      return `komenda wypisuje/ustawia sekret (${cmd.match(SECRET_WORDS)[0]}). Sekrety nie trafiają do transkryptu (secret-no-secrets-in-prompts-or-logs).`;
    }
    // 3. zapis przez powłokę pod site/**, demo/**, ui-kit/**
    if (writesToPublic(cmd)) {
      if (BRAND_NAME.test(cmd)) {
        return `komenda zapisuje pod site/ | demo/ | ui-kit/ treść z nazwą poprzedniej firmy (brand-no-nuconic). CLAUDE.md #3: ta marka nie może pojawić się publicznie przed umową IP — pisz „firma produkcyjno-budowlana". Audytorzy piszą WYŁĄCZNIE do .claude/work/audit/<data>/.`;
      }
      if (BRAND_GOLD.test(cmd)) {
        return `komenda zapisuje pod site/ | demo/ | ui-kit/ stare złoto poprzedniej marki (brand-no-gold). Jedyny akcent to stal #A8B4C2 (var(--accent)).`;
      }
    }
  }

  // 4. treść edycji pod site/**, demo/**, ui-kit/**
  if ((tool === "Edit" || tool === "Write" || tool === "MultiEdit") && typeof ti.file_path === "string") {
    const abs = path.isAbsolute(ti.file_path) ? ti.file_path : path.resolve(REPO_ROOT, ti.file_path);
    const rel = path.relative(REPO_ROOT, abs).split(path.sep).join("/");
    if (PUBLIC_DIR.test(rel)) {
      const contents = [ti.content, ti.new_string, ...(Array.isArray(ti.edits) ? ti.edits.map((e) => e && e.new_string) : [])].filter((v) => typeof v === "string");
      const joined = contents.join("\n");
      if (BRAND_NAME.test(joined)) {
        return `treść edycji ${rel} zawiera nazwę poprzedniej firmy (brand-no-nuconic). CLAUDE.md #3: ta marka nie może pojawić się publicznie przed umową IP — pisz „firma produkcyjno-budowlana".`;
      }
      if (BRAND_GOLD.test(joined)) {
        return `treść edycji ${rel} zawiera stare złoto poprzedniej marki (brand-no-gold). Jedyny akcent to stal #A8B4C2 (var(--accent)).`;
      }
    }
  }
  return null;
}

// ───────────────────────────── test regresyjny ─────────────────────────────
const CASES = [
  { name: "Bash: cat .env", payload: { tool_name: "Bash", tool_input: { command: "cat .env" } }, deny: true },
  { name: "Bash: cd leadscout && cat .env", payload: { tool_name: "Bash", tool_input: { command: "cd leadscout && cat .env" } }, deny: true },
  { name: "Bash: type .env", payload: { tool_name: "Bash", tool_input: { command: "type .env" } }, deny: true },
  { name: "PowerShell: Get-Content .env", payload: { tool_name: "PowerShell", tool_input: { command: "Get-Content .env" } }, deny: true },
  { name: "Bash: sed -n 1p .env", payload: { tool_name: "Bash", tool_input: { command: "sed -n 1p .env" } }, deny: true },
  { name: "Bash: cat leadscout/.env", payload: { tool_name: "Bash", tool_input: { command: "cat leadscout/.env" } }, deny: true },
  { name: "PowerShell: Get-Content $HOME\\.env", payload: { tool_name: "PowerShell", tool_input: { command: "Get-Content $HOME\\.env" } }, deny: true },
  { name: "Bash: cat leadscout/env (plik bez kropki)", payload: { tool_name: "Bash", tool_input: { command: "cat leadscout/env" } }, deny: true },
  { name: "Bash: echo $TELEGRAM_BOT_TOKEN", payload: { tool_name: "Bash", tool_input: { command: "echo $TELEGRAM_BOT_TOKEN" } }, deny: true },
  { name: "Read: leadscout/.chat_id", payload: { tool_name: "Read", tool_input: { file_path: "leadscout/.chat_id" } }, deny: true },
  { name: "Read: site/.env.example (dozwolone)", payload: { tool_name: "Read", tool_input: { file_path: "site/.env.example" } }, deny: false },
  { name: "Bash: npm run build (dozwolone)", payload: { tool_name: "Bash", tool_input: { command: "cd site && npm run build" } }, deny: false },
  { name: "Bash: git commit ze slowem env w opisie (dozwolone)", payload: { tool_name: "Bash", tool_input: { command: 'git commit -m "porzadki: env i skrypty"' } }, deny: false },
  { name: "Bash: node -e process.env.CI (dozwolone)", payload: { tool_name: "Bash", tool_input: { command: 'node -e "console.log(process.env.CI)"' } }, deny: false },
  { name: "MultiEdit: nazwa poprzedniej firmy pod site/", payload: { tool_name: "MultiEdit", tool_input: { file_path: "site/src/App.tsx", edits: [{ new_string: 'const x = "Nuconic";' }] } }, deny: true },
  { name: "Write: stare zloto pod site/", payload: { tool_name: "Write", tool_input: { file_path: "site/src/styles/globals.css", content: "a{color:#FFA914}" } }, deny: true },
  { name: "Bash: heredoc z nazwa firmy pod site/", payload: { tool_name: "Bash", tool_input: { command: 'cat > site/src/x.tsx <<EOF\nconst a = "Nuconic";\nEOF' } }, deny: true },
  { name: "Bash: sed -i ze starym zlotem pod site/", payload: { tool_name: "Bash", tool_input: { command: "sed -i s/x/#FFA914/ site/src/styles/globals.css" } }, deny: true },
  { name: "Bash: raport audytu heredokiem (dozwolone)", payload: { tool_name: "Bash", tool_input: { command: "cat > .claude/work/audit/2026-09-12/r.md <<'KONIEC'\nsite/src/App.tsx:1 - HIGH [a11y-lang] brak lang\nKONIEC" } }, deny: false },
  { name: "Bash: grep marki z przekierowaniem poza site/ (dozwolone)", payload: { tool_name: "Bash", tool_input: { command: "grep -ril nuconic site/dist > /tmp/out.txt" } }, deny: false },
  { name: "Write: zwykla edycja pod site/ (dozwolone)", payload: { tool_name: "Write", tool_input: { file_path: "site/src/App.tsx", content: "export default function App() { return null; }" } }, deny: false },
];

if (process.argv.includes("--selftest")) {
  let failed = 0;
  for (const c of CASES) {
    const got = evaluate(c.payload) !== null;
    const ok = got === c.deny;
    if (!ok) failed++;
    process.stdout.write(`${ok ? "PASS" : "FAIL"}  ${c.name} -> ${got ? "DENY" : "ALLOW"} (oczekiwano ${c.deny ? "DENY" : "ALLOW"})\n`);
  }
  process.stdout.write(`\nSuma: ${CASES.length - failed}/${CASES.length} PASS\n`);
  process.exit(failed ? 1 : 0);
}

// ───────────────────────────── uruchomienie jako hook ─────────────────────────────
let payload = {};
try {
  payload = JSON.parse(fs.readFileSync(0, "utf8") || "{}");
} catch {
  process.exit(0);
}
const reason = evaluate(payload);
if (reason) {
  process.stderr.write(`[klarow-guardian] ZABLOKOWANE: ${reason}\n`);
  process.exit(2);
}
process.exit(0);
