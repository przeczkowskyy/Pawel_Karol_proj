// ui-audit.js — zapisany workflow strażnika Klarow: głęboki audyt UI/kodu klarow.com
// z automatyczną naprawą tego, co mechaniczne. Uruchamianie: Workflow({name: "ui-audit", args: {...}})
// (skill /ui-audit składa args). Skrypt NIE ma dostępu do fs ani do Date/Math.random —
// datę przekazuje args.date, pliki piszą agenci.
//
// args:
//   date        (wymagane) data ISO, np. "2026-09-12" — katalog .claude/work/audit/<date>/
//   scope       "diff" (domyślnie) | "site" | "route:/oferta" | "component:Navbar" | ["site/src/App.tsx", ...]
//   fix         true (domyślnie) | false  — false = tylko raport
//   reportOnly  alias dla fix=false
//   frozen      DODATKOWE ścieżki nietykalne (prefiksy) — dopisywane do domyślnych, nigdy ich nie zastępują;
//               domyślne: .env*, site/src/lib/pdf.ts, dashboards/PdfButton.tsx, site/src/components/dashboards/
//   maxRounds   liczba rund fix → re-audyt (domyślnie 2)
//   maxVerify   ile HIGH/BLOCKER weryfikować adwersaryjnie (domyślnie 40; reszta zostaje „niezweryfikowane”)
//   build       true (domyślnie) | false — false pomija `npm run build` (szybki przebieg bez verify-site na dist)
//   baseline    ścieżka JSONL długu (domyślnie: najnowszy plik w .claude/skills/klarow-guardian/baseline/)
//   noBaseline  true = pokaż cały dług (bez --baseline)
//   expectedHtml liczba statycznych HTML dla verify-site (domyślnie: z sitemap.xml)

export const meta = {
  name: "ui-audit",
  description: "Głęboki audyt UI/kodu klarow.com: bramki skryptowe, 7 audytorów read-only, weryfikacja adwersaryjna, naprawy mechaniczne, re-audyt, INDEX.md",
  whenToUse: "Przed pushem większych zmian w site/, przed publikacją, po każdej fazie redesignu; skill /ui-audit",
  phases: [
    { title: "Static", detail: "audit-static, find-integrations, check-secrets, tsc, build, verify-site → JSONL" },
    { title: "Audit", detail: "7 audytorów read-only równolegle (ui, motion, code, integration, seo, copy, brand-leak)" },
    { title: "Verify", detail: "3 niezależnych refuterów per HIGH/BLOCKER; obalony dopiero gdy ≥2 OBALĄ, zweryfikowany przy ≥2 głosach" },
    { title: "Fix", detail: "1 fixer per plik, wyłącznie naprawy mechaniczne; pliki zamrożone nietykane" },
    { title: "Reaudit", detail: "Static + audytorzy wszystkich prefiksów obecnych w dotkniętych plikach; reszta findings przenoszona bez zmian" },
    { title: "Report", detail: "INDEX.md z tabelą przed/po i listą pozycji do decyzji founderów" },
  ],
};

// ───────────────────────────── argumenty ─────────────────────────────
// `typeof args` (nie gołe `args`) — dla NIEZADEKLAROWANEGO identyfikatora `typeof` zwraca
// "undefined" zamiast rzucić ReferenceError. Dzięki temu samo zaimportowanie pliku (np. przez
// hosta, żeby odczytać `export const meta`) nie wywala się na ReferenceError, a uruchomienie
// bez daty daje czytelny komunikat, a nie surowy błąd silnika.
if (typeof args === "undefined" || !args || typeof args !== "object" || typeof args.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(args.date)) {
  throw new Error('Workflow ui-audit wymaga args.date w formacie ISO (np. {date: "2026-09-12"}). Data nie może pochodzić z Date.now() — podaj ją w args.');
}
const DATE = args.date;
const SCOPE = args.scope === undefined || args.scope === null || args.scope === "" ? "diff" : args.scope;
const FIX = args.reportOnly === true ? false : args.fix !== false;
const MAX_ROUNDS = Number.isFinite(Number(args.maxRounds)) ? Number(args.maxRounds) : 2;
const MAX_VERIFY = Number.isFinite(Number(args.maxVerify)) ? Number(args.maxVerify) : 40;
const BUILD = args.build !== false;
const NO_BASELINE = args.noBaseline === true;
const BASELINE = typeof args.baseline === "string" ? args.baseline : null;
const EXPECTED_HTML = Number.isFinite(Number(args.expectedHtml)) ? Number(args.expectedHtml) : null;
const DEFAULT_FROZEN = [".env", "leadscout/.env", "leadscout/.chat_id", "site/src/lib/pdf.ts", "site/src/components/dashboards/PdfButton.tsx", "site/src/components/dashboards/"];
// args.frozen tylko DODAJE. Domyślnych nie wolno wycinać: pdf.ts, PdfButton.tsx i dashboards/
// refaktoruje inne okno (rozstrzygnięcie nadrzędne), a .env* nie dotyka nikt.
const FROZEN = Array.isArray(args.frozen) ? [...new Set([...DEFAULT_FROZEN, ...args.frozen])] : DEFAULT_FROZEN;

const GUARD = ".claude/skills/klarow-guardian";
const SCRIPTS = `${GUARD}/scripts`;
const AUDIT_DIR = `.claude/work/audit/${DATE}`;

const SEV = ["BLOCKER", "HIGH", "MEDIUM", "LOW"];
const sevRank = (s) => {
  const i = SEV.indexOf(String(s || "").toUpperCase());
  return i === -1 ? 3 : i;
};

// ───────────────────────────── schematy ─────────────────────────────
const FINDING = {
  type: "object",
  properties: {
    file: { type: "string" },
    line: { type: "integer" },
    severity: { type: "string", enum: SEV },
    rule: { type: "string" },
    msg: { type: "string" },
    fix: { type: ["string", "null"] },
    confidence: { type: "string", enum: ["CONFIRMED", "PLAUSIBLE"] },
    mechanical: { type: "boolean" },
  },
  required: ["file", "line", "severity", "rule", "msg", "confidence"],
};
const FINDINGS = { type: "array", items: FINDING };
const STATIC_SCHEMA = {
  type: "object",
  properties: {
    files: { type: "array", items: { type: "string" } },
    findings: FINDINGS,
    truncated: { type: "integer" },
    tsc_ok: { type: "boolean" },
    build_ok: { type: "boolean" },
    verify_ok: { type: "boolean" },
    dist_exists: { type: "boolean" },
    jsonl_path: { type: "string" },
    notes: { type: "string" },
  },
  required: ["files", "findings", "tsc_ok", "build_ok", "verify_ok", "dist_exists", "jsonl_path"],
};
const AUDIT_SCHEMA = {
  type: "object",
  properties: {
    verdict: { type: "string", enum: ["PASS", "FAIL"] },
    findings: FINDINGS,
    report_path: { type: "string" },
    checked: { type: "array", items: { type: "string" } },
    unchecked: { type: "array", items: { type: "string" } },
  },
  required: ["verdict", "findings", "report_path"],
};
const VERDICT_SCHEMA = {
  type: "object",
  properties: {
    refuted: { type: "boolean" },
    reason: { type: "string" },
    mechanical: { type: "boolean" },
    severity: { type: "string", enum: SEV },
  },
  required: ["refuted", "reason", "mechanical"],
};
const FIX_SCHEMA = {
  type: "object",
  properties: {
    file: { type: "string" },
    changed: { type: "boolean" },
    applied: { type: "array", items: { type: "object", properties: { rule: { type: "string" }, line: { type: "integer" }, what: { type: "string" } }, required: ["rule", "what"] } },
    skipped: { type: "array", items: { type: "object", properties: { rule: { type: "string" }, line: { type: "integer" }, reason: { type: "string" } }, required: ["rule", "reason"] } },
  },
  required: ["file", "changed", "applied", "skipped"],
};
const REPORT_SCHEMA = {
  type: "object",
  properties: { index_path: { type: "string" }, summary: { type: "string" } },
  required: ["index_path", "summary"],
};

// ───────────────────────────── audytorzy i reguły ─────────────────────────────
const AUDITORS = [
  { type: "ui-auditor", prefixes: ["design", "a11y", "media", "brand"] },
  { type: "motion-auditor", prefixes: ["motion", "media", "perf"] },
  { type: "code-auditor", prefixes: ["code", "demo", "perf", "secret"] },
  { type: "integration-scanner", prefixes: ["integ", "secret", "legal"] },
  { type: "seo-auditor", prefixes: ["seo", "i18n", "legal"] },
  { type: "copy-auditor", prefixes: ["copy", "legal", "i18n", "brand"] },
  { type: "brand-leak-auditor", prefixes: ["brand"] },
];
// Reguły Vercela raportowane jako „RBP:<id>" / „CP:<id>" są własnością code-auditora
// (rules/_sections.md, kolumna „Właściciel"). Bez tego mapowania zdjęcie prefiksu dawało
// „rerender"/„bundle"/„effects", czyli prefiks, którego nie ma żaden audytor — findings
// z fazy Static nie trafiały do nikogo ani w rundzie 1, ani w re-audycie.
const prefixOf = (rule) => {
  const s = String(rule || "");
  return /^(RBP|CP):/i.test(s) ? "code" : s.replace(/^[A-Z]+:/, "").split("-")[0];
};

// naprawy o zerowym ryzyku semantycznym (uzgodnione z guardian-orchestrator.md §5)
const MECHANICAL_RULES = new Set([
  "motion-no-transition-all-no-linear",
  "a11y-focus-visible-everywhere",
  "code-no-forwardref-react19",
  "code-use-not-usecontext",
  "media-video-embed-spec",
  "design-overflow-rules",
  "perf-images-policy",
  "code-tosorted-safari13",
  "RBP:rerender-functional-setstate",
]);
// i18n-pl-typography NIE jest hurtowo mechaniczna: em-dash w zdaniu wymaga przebudowy zdania.
// Mechaniczny jest tylko zakres liczbowy („5 — 10" → „5–10"), rozpoznawany po treści fixa.
const isMechanical = (f) => f.mechanical === true || MECHANICAL_RULES.has(f.rule) || (f.rule === "i18n-pl-typography" && /–|półpauz/.test(f.fix || ""));
const isFrozen = (file) => /(^|\/)\.env/.test(file) || FROZEN.some((fz) => file === fz || file.startsWith(fz));
const isEligible = (f) => {
  if (!f || !f.file || isFrozen(f.file)) return false;
  const r = sevRank(f.severity);
  if (r >= 2) return f.confidence === "CONFIRMED"; // MEDIUM/LOW potwierdzone → fixer próbuje (skip przy ryzyku)
  return f.verified === true && isMechanical(f); // HIGH/BLOCKER → tylko po weryfikacji i tylko mechaniczne
};

// ───────────────────────────── narzędzia czyste ─────────────────────────────
const key = (f) => `${f.file}|${f.line}|${f.rule}`;
function dedupe(list) {
  const m = new Map();
  for (const f of list) {
    if (!f || typeof f.file !== "string" || !f.rule) continue;
    const norm = { ...f, line: Number.isFinite(Number(f.line)) ? Number(f.line) : 1, severity: SEV[sevRank(f.severity)], confidence: f.confidence === "CONFIRMED" ? "CONFIRMED" : "PLAUSIBLE" };
    const k = key(norm);
    const prev = m.get(k);
    if (!prev) m.set(k, norm);
    else {
      if (prev.confidence !== "CONFIRMED" && norm.confidence === "CONFIRMED") prev.confidence = "CONFIRMED";
      if (!prev.fix && norm.fix) prev.fix = norm.fix;
      if (norm.mechanical === true) prev.mechanical = true;
      if (sevRank(norm.severity) < sevRank(prev.severity)) prev.severity = norm.severity;
      if (norm.verified === true) prev.verified = true;
      prev.sources = [...new Set([...(prev.sources || []), ...(norm.sources || []), norm.source].filter(Boolean))];
    }
  }
  return [...m.values()].sort((a, b) => sevRank(a.severity) - sevRank(b.severity) || a.file.localeCompare(b.file) || a.line - b.line);
}
const counts = (list) => list.reduce((acc, f) => ({ ...acc, [f.severity]: (acc[f.severity] || 0) + 1 }), { BLOCKER: 0, HIGH: 0, MEDIUM: 0, LOW: 0 });
const fmtCounts = (c) => `BLOCKER ${c.BLOCKER} · HIGH ${c.HIGH} · MEDIUM ${c.MEDIUM} · LOW ${c.LOW}`;
const fmtFinding = (f) => `${f.file}:${f.line} - ${f.severity} [${f.rule}] ${f.msg}${f.fix ? `\n  → fix: ${f.fix}` : ""}`;
const rotate = (arr, i) => (arr.length ? [...arr.slice(i % arr.length), ...arr.slice(0, i % arr.length)] : arr);
const compactList = (list, cap) => {
  const head = list.slice(0, cap).map(fmtFinding).join("\n");
  return list.length > cap ? `${head}\n… (+${list.length - cap} więcej w JSONL)` : head;
};
const RULES_HINT = `Zasady wspólne: korzeń repo = katalog roboczy sesji (ścieżka może zawierać „&” i spację — cytuj KAŻDĄ ścieżkę w cudzysłowie; npx NIE działa, binarki przez node node_modules/...); wszystkie ścieżki niżej podajemy względem korzenia repo. Nigdy nie czytaj .env*, *.pem, credentials*, .chat_id, leadscout/leads.json. Nigdy nie wpisuj nazwy poprzedniej firmy ani starego złota #FFA914 do plików pod site/, demo/, ui-kit/. Format findings: "ścieżka:linia - SEV [id-reguły] komunikat" (+ opcjonalnie "  → fix: …"), Σ na końcu; JSONL {file,line,severity,rule,msg,fix,confidence}. ID reguł = pliki ${GUARD}/rules/<id>.md.`;

// ───────────────────────────── faza Static ─────────────────────────────
function staticPrompt(files, round) {
  const scopeDesc = files
    ? `Zakres jest ZADANY (re-audyt rundy ${round}): dokładnie te pliki:\n${files.map((f) => `- ${f}`).join("\n")}`
    : Array.isArray(SCOPE)
      ? `Zakres zadany listą:\n${SCOPE.map((f) => `- ${f}`).join("\n")}`
      : SCOPE === "site"
        ? "Zakres: cały site/src + site/index.html + site/public/_headers + site/public/_redirects."
        : SCOPE.startsWith("route:") || SCOPE.startsWith("component:")
          ? `Zakres: ${SCOPE} — ustal pliki przez Grep (trasa: komponent strony w src/App.tsx lub src/pages/** + użyte komponenty; komponent: plik src/components/<Nazwa>.tsx + jego importy z src/).`
          : "Zakres: diff — pliki z `git diff --name-only HEAD`, `git diff --cached --name-only` i `git ls-files --others --exclude-standard`, filtr site/ (bez dist/node_modules), istniejące. Gdy lista jest PUSTA → użyj całego site/src (i zapisz w notes: „brak zmian w diffie — pełny zakres”).";
  return `Jesteś krokiem „Static” workflowu ui-audit (data ${DATE}, runda ${round}). NIE edytujesz żadnego pliku poza katalogiem ${AUDIT_DIR}. ${RULES_HINT}

${scopeDesc}

Wykonaj po kolei (Bash, z katalogu repo; każdy wynik cytuj sobie, nie streszczaj przed zapisaniem):
1. mkdir -p "${AUDIT_DIR}"
2. Baseline: ${NO_BASELINE ? "NIE używaj baseline (pokaż cały dług)." : BASELINE ? `użyj --baseline "${BASELINE}".` : `znajdź NAJNOWSZY plik ${GUARD}/baseline/audit-static-*.jsonl (sortuj po nazwie) i użyj go jako --baseline; brak pliku = bez baseline.`}
3. node "${SCRIPTS}/audit-static.mjs" <pliki zakresu rozdzielone spacją, każda ścieżka w cudzysłowie> --json "${AUDIT_DIR}/static${round > 1 ? "-r" + round : ""}.jsonl" --no-pass [--baseline …]
4. node "${SCRIPTS}/find-integrations.mjs" --dist --json "${AUDIT_DIR}/integrations${round > 1 ? "-r" + round : ""}.jsonl" --quiet
5. node "${SCRIPTS}/check-secrets.mjs" --dist --json "${AUDIT_DIR}/secrets${round > 1 ? "-r" + round : ""}.jsonl" --quiet
6. cd site && node node_modules/typescript/bin/tsc --noEmit  → tsc_ok (błąd = finding BLOCKER {rule:"code-lint-and-tests-gate", file: plik z pierwszego błędu, line: linia, msg: pierwszy komunikat})
7. ${BUILD ? "cd site && npm run build (ok. 1–2 min; bez npx) → build_ok (błąd = finding BLOCKER code-lint-and-tests-gate z pierwszym komunikatem)" : "POMIŃ build (args.build=false) → build_ok=true, ale zapisz w notes „build pominięty”"}
8. node "${SCRIPTS}/verify-site.mjs" --json "${AUDIT_DIR}/verify${round > 1 ? "-r" + round : ""}.jsonl"${EXPECTED_HTML ? ` --expected ${EXPECTED_HTML}` : ""}
   → verify_ok policz Z ZAPISANEGO JSONL, nie z kodu wyjścia: verify_ok = true tylko wtedy, gdy w tym pliku NIE MA ani jednej linii z "severity":"BLOCKER" ANI z "severity":"HIGH". Liczbę BLOCKER i HIGH z tego JSONL dopisz do "notes" (np. „verify: 1 BLOCKER (brak /rodo), 2 HIGH"). Kod wyjścia skryptu domyślnie ignoruje HIGH, więc sam w sobie nie jest dowodem, że bramka buildu przeszła.
   dist_exists = czy site/dist/index.html istnieje
9. Sklej wszystkie JSONL z tej rundy w "${AUDIT_DIR}/static-all${round > 1 ? "-r" + round : ""}.jsonl" (cat) — to jest jsonl_path.
10. Wczytaj sklejony JSONL. Zwróć findings jako tablicę obiektów {file,line,severity,rule,msg,fix,confidence} — maksymalnie 400 pozycji w kolejności BLOCKER → HIGH → MEDIUM → LOW, potem plik, linia; liczbę pominiętych podaj w "truncated" (0 gdy nic nie pominięto). files = lista plików zakresu (ścieżki od korzenia repo, z "/").
Nie wymyślaj findings — wyłącznie to, co wypisały skrypty i tsc/build.`;
}

// ───────────────────────────── faza Audit ─────────────────────────────
function auditPrompt(auditor, idx, files, findingsForIt, distExists, round) {
  const rotated = rotate(files, idx);
  const reportPath = `${AUDIT_DIR}/${auditor.type}${round > 1 ? "-r" + round : ""}.md`;
  return `Audyt klarow.com, data ${DATE}, runda ${round}. Jesteś ${auditor.type} (Twoje prefiksy reguł: ${auditor.prefixes.join(", ")}). ${RULES_HINT}

Pliki zakresu W TEJ KOLEJNOŚCI (zacznij od pierwszego; nie sortuj alfabetycznie):
${rotated.length ? rotated.map((f) => `- ${f}`).join("\n") : "- (brak listy — użyj domyślnego zakresu z własnej definicji)"}

Pliki ZAMROŻONE (raportuj, ale nie proponuj edycji — inne okno je refaktoruje): ${FROZEN.join(", ")}
site/dist ${distExists ? "ISTNIEJE (możesz robić zrzuty/sprawdzać build)" : "NIE istnieje (nie buduj; wpisz „nie sprawdzano: dist”)"}.
Wszystkie findings bramek tej rundy: ${AUDIT_DIR}/static-all${round > 1 ? "-r" + round : ""}.jsonl. Findings bramek dla Twoich prefiksów (${findingsForIt.length}):
${compactList(findingsForIt, 60) || "(brak)"}

Jesteś READ-ONLY poza jedną ścieżką: JEDYNY prefiks, do którego wolno Ci pisać, to ".claude/work/audit/" (tu: "${reportPath}"). Zero zapisów pod site/, demo/, ui-kit/ — także pośrednich przez Bash (>, >>, tee, sed -i, heredoc, Set-Content/Out-File). Naprawy robi osobny krok „Fix”, nie Ty.
Zapisz pełny raport (4 sekcje: ## Werdykt · ## Naruszenia · ## Co sprawdzono i przeszło · ## Niepewne (PLAUSIBLE); + ## Nie sprawdzano w tej rundzie) do "${reportPath}" przez Bash heredoc (mkdir -p katalogu). Nie edytuj innych plików.
Zwróć StructuredOutput: verdict ("FAIL" gdy ≥1 BLOCKER/HIGH CONFIRMED spoza baseline), findings (WSZYSTKIE Twoje naruszenia i niepewne, każde z file/line/severity/rule/msg/fix/confidence/mechanical; confidence CONFIRMED tylko z dowodem w kodzie/skrypcie/zrzucie), report_path, checked (co sprawdzono i przeszło, krótko), unchecked (czego nie sprawdzono i dlaczego).`;
}

// ───────────────────────────── faza Verify ─────────────────────────────
const LENSES = [
  "REPRODUKCJA: otwórz plik i linię; czy wzorzec naprawdę tam występuje, czy to komentarz, string testowy, plik nieużywany (martwy kod), wyjątek oznaczony token-exempt/determ-exempt albo przesunięta linia?",
  "REGUŁA: przeczytaj rules/<id>.md (sekcje Zasada, Test, Wyjątki) i rules/_sections.md; czy reguła faktycznie tego zakazuje w tym trybie (marketing vs tool: dashboardy/lib/DemoReport = tool) i czy severity jest zgodna z tabelą impact?",
  "SKUTEK: czy naruszenie ma realny efekt (bundle/a11y/SEO/prawo/marka) w kontekście tej strony, czy jest już objęte baseline długu (.claude/skills/klarow-guardian/baseline/) i nie jest NOWE? Naruszenie z baseline nie jest obalone, ale zaznacz to w reason.",
];
function refutePrompt(f, lens, i) {
  return `Weryfikacja adwersaryjna (${i + 1}/3), data ${DATE}. Spróbuj OBALIĆ ten finding audytu klarow.com. Pracujesz read-only (Read/Grep/Glob/Bash tylko do odczytu; nie edytuj plików). ${RULES_HINT}

Finding:
${fmtFinding(f)}
confidence: ${f.confidence}; źródła: ${(f.sources || [f.source]).filter(Boolean).join(", ") || "audytor"}

Twoja soczewka: ${lens}

Zasada: jeśli nie potrafisz wskazać konkretnego dowodu, że finding jest fałszywy albo nie dotyczy tego repo, refuted=false. Domyślnie refuted=true TYLKO gdy masz dowód (cytat linii, treść reguły, wyjątek). Odpowiedz też: mechanical (czy naprawa jest czysto mechaniczna o zerowym ryzyku semantycznym: transition-all→lista, focus:→focus-visible:, forwardRef→ref prop, useContext→use, n&&→ternary, —→– w zakresie liczb, atrybuty muted/playsInline/width/height/aria-hidden/loading, h-screen→min-h-[100dvh]; zmiana koloru na token, copy, layout, IA, integracje, sekrety = NIE mechaniczna) oraz severity, jaką uważasz za właściwą wg tabeli impact.`;
}

// ───────────────────────────── faza Fix ─────────────────────────────
function fixPrompt(file, list, round) {
  return `Fixer, data ${DATE}, runda ${round}. Naprawiasz WYŁĄCZNIE plik "${file}" (Edit; nie twórz innych plików, nie dotykaj innych ścieżek). ${RULES_HINT}

Potwierdzone findings do naprawy (${list.length}):
${list.map(fmtFinding).join("\n")}

Zasady naprawy:
- Tylko zmiany o zerowym ryzyku semantycznym. Dozwolone: transition-all → lista właściwości; linear/ease-in-out → var(--ease-out) lub EASE_OUT z src/motion/tokens.ts (jeśli plik istnieje; inaczej pomiń); focus: → focus-visible: (nie na input/textarea/select); outline-none bez wskaźnika → dodaj focus-visible:outline; forwardRef → ref jako prop; useContext(X) → use(X) (import { use } from "react"); n && <X/> → n > 0 ? <X/> : null; „—” w zakresie liczbowym → „–”; „...” → „…”; cudzysłowy „ ” w PL; aria-hidden na ikonie obok tekstu; loading="lazy" na obrazie poniżej folda; width/height na <img> o znanym rozmiarze (sprawdź plik w site/public); muted playsInline na <video>; h-screen → min-h-[100dvh]; toSorted → [...a].sort; .at(-1) → [a.length-1]; usunięcie nieaktualnego komentarza.
- Kolor literałem → token TYLKO gdy w site/src/styles/tokens.css lub company-ui.css istnieje zmienna o dokładnie tej wartości (np. #a8b4c2 → var(--accent)); w przeciwnym razie POMIŃ z powodem „brak tokenu o tej wartości”.
- Em-dash w zdaniu, liczby, etykiety, tytuły/opisy SEO, layout, kształt kart, hero, integracje, sekrety, slugi, zależności → POMIŃ z powodem (to decyzja founderów).
- Zero „Nuconic” i zero #FFA914 w wynikowym pliku; zero Date.now/Math.random/fetch w site/src/lib/** i dashboards/**.
- Po edycji uruchom: node "${SCRIPTS}/audit-static.mjs" "${file}" --no-pass  i upewnij się, że naprawione reguły zniknęły, a NOWYCH findings nie przybyło; jeśli przybyło — cofnij tę zmianę.
- Nie uruchamiaj builda (zrobi to następna faza). Nie commituj.
Zwróć StructuredOutput: file, changed, applied [{rule,line,what}], skipped [{rule,line,reason}].`;
}

// ───────────────────────────── faza Report ─────────────────────────────
function reportPrompt(state) {
  const remainingText = compactList(state.remaining, 150);
  return `Krok „Report”, data ${DATE}. Napisz "${AUDIT_DIR}/INDEX.md" (Write/Bash) wg szablonu w ${GUARD}/checklists/audit-report-template.md (sekcja „INDEX.md”). Dopisz też 1 linię per audytor do ".claude/work/audit/INDEX.md" (append-only; utwórz, jeśli brak): "${DATE} · <agent> · PASS/FAIL · B/H/M/L · <ścieżka raportu>". Nie edytuj innych plików. W tekście dla founderów nie używaj słów „sub-agent”, „LLM”, „gate”, „workflow” — pisz „do naprawy”, „obserwacja”, „sprawdzone, bez zmian”, „nie sprawdzano”.

Dane:
- zakres: ${SCOPE === "diff" ? "diff w site/" : Array.isArray(SCOPE) ? SCOPE.join(", ") : SCOPE}; pliki: ${state.files.length}; tryb: ${FIX ? "audyt + naprawy mechaniczne" : "tylko raport"}; rundy naprawcze: ${state.rounds}
- bramki: tsc ${state.tscOk ? "OK" : "BŁĄD"}, build ${state.buildOk ? "OK" : BUILD ? "BŁĄD" : "pominięty"}, verify-site ${state.verifyOk ? "OK" : "z naruszeniami"}, dist ${state.distExists ? "jest" : "brak"}
- werdykty audytorów (runda 1): ${state.verdicts.map((v) => `${v.type}=${v.verdict} (${v.report_path})`).join("; ")}
- PRZED (po deduplikacji, po weryfikacji adwersaryjnej): ${fmtCounts(state.before)}
- PO (stan po ostatniej rundzie): ${fmtCounts(state.after)}
- obalone przez weryfikację (≥ 2 z 3 refuterów wskazało dowód, że finding jest fałszywy): ${state.refutedCount}
- niezweryfikowane (ponad limit ${MAX_VERIFY} albo mniej niż 2 głosy — te NIE są naprawiane automatycznie): ${state.unverifiedCount}
- naprawione (${state.fixedList.length}):
${state.fixedList.slice(0, 80).map((x) => `  - ${x}`).join("\n") || "  (brak)"}
- pominięte przez fixerów z powodem (${state.skippedList.length}):
${state.skippedList.slice(0, 60).map((x) => `  - ${x}`).join("\n") || "  (brak)"}
- POZOSTAŁE do decyzji / obserwacje (${state.remaining.length}; pełna lista w JSONL raportów):
${remainingText || "(brak)"}
- nie sprawdzano: ${state.unchecked.join("; ") || "(nic nie zgłoszono)"}
- raporty audytorów: ${state.reports.join(", ")}

Tabela przed/po per severity i per audytor (przeczytaj raporty, żeby policzyć per audytor), lista naprawionych z ID reguł (link do ${GUARD}/rules/<id>.md), tabela „Do decyzji founderów” (kolumny: pozycja · dlaczego nie automatycznie · rekomendacja · reguła), sekcja „Nie sprawdzano w tej rundzie”, na końcu „Następny krok” (1–3 zdania). Zwróć StructuredOutput: index_path, summary (≤ 8 zdań po polsku).`;
}

// ═════════════════════════════ PRZEBIEG ═════════════════════════════
phase("Static");
log(`ui-audit ${DATE}: zakres=${Array.isArray(SCOPE) ? SCOPE.length + " plików" : SCOPE}, fix=${FIX}, rundy≤${MAX_ROUNDS}, zamrożone=${FROZEN.length}`);
const s1 = await agent(staticPrompt(null, 1), { label: "bramki skryptowe", phase: "Static", schema: STATIC_SCHEMA, effort: "medium" });
if (!s1) throw new Error("Faza Static nie zwróciła wyniku (agent pominięty lub błąd API) — przerwij i uruchom ponownie z tym samym args.date.");
const files = [...new Set((s1.files || []).filter((f) => typeof f === "string" && f.length))];
if (s1.truncated) log(`Static: pominięto ${s1.truncated} findings z JSONL (limit 400) — pełna lista w ${s1.jsonl_path}`);
log(`Static: ${files.length} plików, ${s1.findings.length} findings, tsc=${s1.tsc_ok}, build=${s1.build_ok}, verify=${s1.verify_ok}, dist=${s1.dist_exists}`);

phase("Audit");
const auditResults = await parallel(
  AUDITORS.map((a, i) => () => {
    const mine = s1.findings.filter((f) => a.prefixes.includes(prefixOf(f.rule)));
    return agent(auditPrompt(a, i, files, mine, s1.dist_exists, 1), { label: a.type, phase: "Audit", schema: AUDIT_SCHEMA, agentType: a.type }).then((r) => (r ? { ...r, type: a.type } : null));
  })
);
const audits = auditResults.filter(Boolean);
const missing = AUDITORS.filter((a) => !audits.some((r) => r.type === a.type)).map((a) => a.type);
if (missing.length) log(`UWAGA: bez wyniku od: ${missing.join(", ")} (agent pominięty/błąd) — ich zakres liczy się jako „nie sprawdzano”`);
let current = dedupe([
  ...s1.findings.map((f) => ({ ...f, source: "static" })),
  ...audits.flatMap((r) => r.findings.map((f) => ({ ...f, source: r.type }))),
]);
const unchecked = [...new Set([...audits.flatMap((r) => r.unchecked || []), ...missing.map((m) => `${m}: brak wyniku`)])];
log(`Audit: ${audits.length}/7 audytorów, po deduplikacji ${current.length} findings (${fmtCounts(counts(current))})`);

phase("Verify");
let refutedCount = 0;
let unverifiedCount = 0;
async function verify(list) {
  const cands = list.filter((f) => sevRank(f.severity) <= 1 && f.verified !== true);
  const toVerify = cands.slice(0, MAX_VERIFY);
  if (cands.length > MAX_VERIFY) {
    unverifiedCount += cands.length - MAX_VERIFY;
    log(`Verify: ${cands.length} HIGH/BLOCKER, weryfikuję ${MAX_VERIFY} (BLOCKER najpierw); ${cands.length - MAX_VERIFY} zostaje jako niezweryfikowane (nie będą naprawiane automatycznie)`);
  }
  const results = await pipeline(toVerify, (f) =>
    parallel(LENSES.map((lens, i) => () => agent(refutePrompt(f, lens, i), { label: `refuter ${i + 1}: ${f.rule}@${f.file.split("/").pop()}:${f.line}`, phase: "Verify", schema: VERDICT_SCHEMA, effort: "medium" }))).then((votes) => ({ f, votes: votes.filter(Boolean) }))
  );
  const refutedKeys = new Set();
  let noVote = 0;
  let thinVote = 0;
  for (const r of results) {
    if (!r) continue;
    const votes = r.votes;
    // BRAK GŁOSU ≠ OBALENIE. Gdy wszyscy refuterzy padli (błąd API / pominięcie agenta),
    // finding zostaje NIEZWERYFIKOWANY: nie kasujemy go i nie wpuszczamy do naprawy.
    if (!votes.length) {
      noVote++;
      unverifiedCount++;
      continue;
    }
    // Obalenie wymaga WIĘKSZOŚCI OBALAJĄCYCH (≥ 2 z 3), a nie „mniej niż 2 nieobalających”
    // — inaczej awaria dwóch refuterów kasowała BLOCKER na podstawie jednego głosu.
    if (votes.filter((v) => v.refuted).length >= 2) {
      refutedKeys.add(key(r.f));
      continue;
    }
    const ok = votes.filter((v) => !v.refuted);
    // `verified` tylko przy ≥ 2 realnych głosach: jeden ocalały głos nie wystarcza,
    // żeby HIGH/BLOCKER przeszedł przez isEligible do automatycznej naprawy.
    r.f.verified = votes.length >= 2;
    if (!r.f.verified) {
      thinVote++;
      unverifiedCount++;
    }
    r.f.mechanical = r.f.mechanical === true || ok.filter((v) => v.mechanical).length >= 2;
    const sevVotes = ok.map((v) => v.severity).filter(Boolean);
    if (sevVotes.length >= 2 && sevVotes.every((s) => s === sevVotes[0]) && sevVotes[0] !== r.f.severity) {
      r.f.severity = sevVotes[0];
      r.f.reseverity = true;
    }
    r.f.refuteReasons = ok.map((v) => v.reason).slice(0, 2);
  }
  if (noVote || thinVote) log(`Verify: ${noVote} findings bez ani jednego głosu, ${thinVote} z jednym głosem — zostają jako NIEZWERYFIKOWANE (nie są ani obalone, ani naprawiane automatycznie)`);
  refutedCount += refutedKeys.size;
  return list.filter((f) => !refutedKeys.has(key(f)));
}
current = await verify(current);
const before = counts(current);
log(`Verify: obalono ${refutedCount}; stan PRZED naprawami: ${fmtCounts(before)}`);

const fixedList = [];
const skippedList = [];
let rounds = 0;
let lastStatic = s1;
if (!FIX) log("Tryb tylko-raport: faza Fix pominięta (args.fix=false).");
while (FIX && rounds < MAX_ROUNDS) {
  const eligible = current.filter(isEligible);
  const frozenHits = current.filter((f) => f.file && isFrozen(f.file)).length;
  if (frozenHits) log(`Fix: ${frozenHits} findings w plikach zamrożonych — tylko raport`);
  if (!eligible.length) {
    log("Fix: brak potwierdzonych, naprawialnych findings — kończę pętlę");
    break;
  }
  rounds++;
  phase("Fix");
  const byFile = new Map();
  for (const f of eligible) {
    if (!byFile.has(f.file)) byFile.set(f.file, []);
    byFile.get(f.file).push(f);
  }
  const groups = [...byFile.entries()].map(([file, list]) => ({ file, list }));
  log(`Fix runda ${rounds}: ${eligible.length} findings w ${groups.length} plikach`);
  const fixResults = (await pipeline(groups, (g) => agent(fixPrompt(g.file, g.list, rounds), { label: `fix ${g.file.split("/").pop()}`, phase: "Fix", schema: FIX_SCHEMA }))).filter(Boolean);
  const touched = fixResults.filter((r) => r.changed).map((r) => r.file);
  for (const r of fixResults) {
    for (const a of r.applied || []) fixedList.push(`${r.file}:${a.line || "?"} [${a.rule}] ${a.what}`);
    for (const s of r.skipped || []) skippedList.push(`${r.file}:${s.line || "?"} [${s.rule}] ${s.reason}`);
  }
  log(`Fix runda ${rounds}: zmienione pliki ${touched.length}, naprawy ${fixResults.reduce((n, r) => n + (r.applied || []).length, 0)}, pominięte ${fixResults.reduce((n, r) => n + (r.skipped || []).length, 0)}`);
  if (!touched.length) break;

  phase("Reaudit");
  const s2 = await agent(staticPrompt(touched, rounds + 1), { label: `bramki po naprawach r${rounds}`, phase: "Reaudit", schema: STATIC_SCHEMA, effort: "medium" });
  if (!s2) {
    log("Reaudit: brak wyniku bramek — przerywam pętlę, stan po naprawach nieznany (sprawdź ręcznie tsc/build)");
    break;
  }
  lastStatic = s2;
  const touchedSet = new Set(touched);
  // Do re-audytu wracają audytorzy KAŻDEGO prefiksu obecnego w findings dotkniętych plików,
  // a nie tylko tych z reguł faktycznie naprawionych. Inaczej ocena LLM z innego prefiksu
  // (np. copy-banned-claims w App.tsx przy naprawie motion-*) znikała po cichu z kolumny „PO”.
  const touchedPrefixes = new Set(current.filter((f) => touchedSet.has(f.file)).map((f) => prefixOf(f.rule)));
  const relevant = AUDITORS.filter((a) => a.prefixes.some((p) => touchedPrefixes.has(p)));
  const reResults = (
    await parallel(
      relevant.map((a, i) => () => {
        const mine = s2.findings.filter((f) => a.prefixes.includes(prefixOf(f.rule)) && touched.includes(f.file));
        return agent(auditPrompt(a, i, touched, mine, s2.dist_exists, rounds + 1), { label: `${a.type} r${rounds + 1}`, phase: "Reaudit", schema: AUDIT_SCHEMA, agentType: a.type }).then((r) => (r ? { ...r, type: a.type } : null));
      })
    )
  ).filter(Boolean);
  const rerunTypes = new Set(reResults.map((r) => r.type));
  const rerunPrefixes = new Set(AUDITORS.filter((a) => rerunTypes.has(a.type)).flatMap((a) => a.prefixes));
  /** Czy ktokolwiek, kto to zgłosił, sprawdził ten plik PONOWNIE w tej rundzie? */
  const reScanned = (f) => {
    const src = f.sources && f.sources.length ? f.sources : [f.source].filter(Boolean);
    if (!src.length) return rerunPrefixes.has(prefixOf(f.rule));
    return src.some((s) => s === "static" || rerunTypes.has(s));
  };
  const eligibleKeys = new Set(eligible.map(key));
  const untouched = current.filter((f) => !touchedSet.has(f.file));
  // Findings z plików dotkniętych, których w tej rundzie NIKT nie naprawiał i których nikt
  // nie sprawdził ponownie — przenosimy wprost. Brak ponownego wykrycia ≠ naprawione.
  const carried = current.filter((f) => touchedSet.has(f.file) && !eligibleKeys.has(key(f)) && !reScanned(f));
  if (carried.length) log(`Reaudit r${rounds + 1}: ${carried.length} findings z dotkniętych plików przeniesione bez zmian (nikt ich nie naprawiał ani nie sprawdzał ponownie)`);
  const fresh = dedupe([
    ...s2.findings.filter((f) => touchedSet.has(f.file) || sevRank(f.severity) === 0).map((f) => ({ ...f, source: "static" })),
    ...reResults.flatMap((r) => r.findings.filter((f) => touchedSet.has(f.file)).map((f) => ({ ...f, source: r.type }))),
  ]);
  const verifiedFresh = await verify(fresh);
  current = dedupe([...untouched, ...carried, ...verifiedFresh]);
  log(`Reaudit r${rounds + 1}: ${relevant.length} audytorów, tsc=${s2.tsc_ok}, build=${s2.build_ok}; stan: ${fmtCounts(counts(current))}`);
  if (!s2.tsc_ok || !s2.build_ok) {
    log("Reaudit: tsc/build CZERWONE po naprawach — przerywam pętlę; INDEX.md dostanie to jako BLOCKER do ręcznego przejrzenia");
    break;
  }
}

phase("Report");
const after = counts(current);
const remaining = current.map((f) => ({
  ...f,
  msg: `${f.msg}${isFrozen(f.file) ? " [plik zamrożony]" : f.confidence !== "CONFIRMED" ? " [obserwacja, do potwierdzenia]" : sevRank(f.severity) <= 1 && f.verified !== true ? " [niezweryfikowane]" : sevRank(f.severity) <= 1 && !isMechanical(f) ? " [niemechaniczne — decyzja]" : ""}`,
}));
const report = await agent(
  reportPrompt({
    files,
    rounds,
    tscOk: lastStatic.tsc_ok,
    buildOk: lastStatic.build_ok,
    verifyOk: lastStatic.verify_ok,
    distExists: lastStatic.dist_exists,
    verdicts: audits.map((r) => ({ type: r.type, verdict: r.verdict, report_path: r.report_path })),
    before,
    after,
    refutedCount,
    unverifiedCount,
    fixedList,
    skippedList,
    remaining,
    unchecked,
    reports: audits.map((r) => r.report_path),
  }),
  { label: "INDEX.md", phase: "Report", schema: REPORT_SCHEMA, effort: "low" }
);
const indexPath = report ? report.index_path : `${AUDIT_DIR}/INDEX.md`;
log(`Gotowe: PRZED ${fmtCounts(before)} → PO ${fmtCounts(after)}; ${fixedList.length} napraw, ${remaining.length} pozycji do decyzji/obserwacji; ${indexPath}`);

return {
  before,
  after,
  remaining: remaining.map((f) => ({ file: f.file, line: f.line, severity: f.severity, rule: f.rule, msg: f.msg, confidence: f.confidence })),
  index_path: indexPath,
  rounds,
  fixed: fixedList,
  skipped: skippedList,
  refuted: refutedCount,
  unverified: unverifiedCount,
  reports: audits.map((r) => r.report_path),
  summary: report ? report.summary : "Raport końcowy nie został zwrócony — przeczytaj raporty audytorów w " + AUDIT_DIR,
};
