---
name: ui-audit
description: Głęboki audyt UI i kodu klarow.com kontra reguły strażnika klarow-guardian — bramki skryptowe (audit-static, find-integrations, check-secrets, tsc, build, verify-site), 7 audytorów read-only (design/a11y, motion/media, kod/determinizm, integracje/sekrety, SEO/prerender, copy/prawo, wycieki marki), weryfikacja adwersaryjna HIGH/BLOCKER, automatyczne naprawy WYŁĄCZNIE mechaniczne, re-audyt i INDEX.md z tabelą przed/po. Wywołuj przed pushem zmian w site/, przed publikacją, po każdej fazie redesignu, albo gdy użytkownik prosi o „audyt UI”, „sprawdź stronę”, „przegląd designu/dostępności/SEO/kodu”. Domyślny zakres: git diff w site/ (pusty diff = cały site/src).
argument-hint: "[zakres: diff|site|route:/oferta|component:Navbar|ścieżki…] [--fix|--report-only] [--frozen a,b] [--rounds N] [--verify N] [--no-build] [--no-baseline]"
---

# /ui-audit — audyt strażnika Klarow

Cienki skill: składa argumenty i uruchamia zapisany workflow `ui-audit`
(`.claude/workflows/ui-audit.js`). Cała wiedza o regułach siedzi w `.claude/skills/klarow-guardian/`
(`rules/*.md`, `references/*.md`, `scripts/*.mjs`, `baseline/`), a ocena w agentach z `.claude/agents/`.

## Argumenty

| Argument | Znaczenie | Domyślnie |
|---|---|---|
| `zakres` | `diff` (pliki z `git diff` pod `site/`), `site` (cały `site/src`), `route:/oferta`, `component:Navbar`, albo lista ścieżek | `diff`; pusty diff → cały `site/src` |
| `--fix` / `--report-only` | naprawiać mechanicznie czy tylko raportować | `--fix` |
| `--frozen a,b` | ścieżki nietykalne DOPISYWANE do domyślnych (własna lista nigdy ich nie zastępuje). Zawsze zamrożone: `.env*`, `site/src/lib/pdf.ts`, `site/src/components/dashboards/PdfButton.tsx`, `site/src/components/dashboards/` (refaktor pdf.ts robi inne okno) | jak obok |
| `--rounds N` | liczba rund naprawa → re-audyt | `2` |
| `--no-build` | pomiń `npm run build` (szybki przebieg; verify-site tylko gdy `dist` już jest) | build włączony |
| `--no-baseline` | pokaż cały dług, nie tylko nowe naruszenia | najnowszy `baseline/audit-static-*.jsonl` |
| `--verify N` | ile HIGH/BLOCKER weryfikować adwersaryjnie (3 refuterów każdy) | `40` |

## Procedura

1. **Data.** Pobierz datę ISO przez Bash: `date +%F` (workflow nie ma dostępu do zegara — data MUSI przyjść
   w `args.date`; nigdy `Date.now()` w skrypcie).
2. **Uruchom workflow** (args jako prawdziwy obiekt JSON, nie string):
   ```
   Workflow({
     name: "ui-audit",
     args: {
       date: "<YYYY-MM-DD>",
       scope: "diff" | "site" | "route:/oferta" | "component:Navbar" | ["site/src/App.tsx", "..."],
       fix: true | false,
       frozen: ["site/src/lib/pdf.ts", "..."],   // tylko gdy --frozen; domyślne i tak są dodane
       maxRounds: 2,
       build: true | false,
       noBaseline: false,
       maxVerify: 40
     }
   })
   ```
   Wynik: `{before, after, remaining, index_path, rounds, fixed, skipped, refuted, unverified, reports, summary}`.
3. **Po zakończeniu** przeczytaj `index_path` (`.claude/work/audit/<data>/INDEX.md`) i przekaż użytkownikowi:
   Σ przed → po, liczba napraw, 5 najważniejszych pozycji „do decyzji founderów”, „nie sprawdzano” i dlaczego.
   Bez słów wewnętrznych („sub-agent”, „LLM”, „gate”). Nie commituj — pokaż `git diff --stat` i zapytaj.
4. **Przerwany przebieg**: `Workflow({scriptPath: "<ścieżka z wyniku>", resumeFromRunId: "<runId>"})` z TYM SAMYM
   `args.date` — zakończone kroki wracają z cache.

## Fallback bez narzędzia Workflow

Gdy `Workflow` jest niedostępny (inny klient, sesja bez uprawnień):

1. `Agent` → `guardian-orchestrator` z promptem: „Audyt `<zakres>`, data `<YYYY-MM-DD>`, fix=`<true|false>`,
   frozen=`<lista>`, maxRounds=`<N>`. Wykonaj procedurę z własnej definicji i zwróć Σ przed/po + ścieżkę INDEX.md.”
   Orkiestrator sam uruchamia skrypty, deleguje do 7 audytorów przez `Agent`, naprawia to, co mechaniczne,
   re-audytuje i pisze INDEX.md.
2. Albo ręcznie (minimalna bramka, bez oceny LLM):
   ```
   node ".claude/skills/klarow-guardian/scripts/audit-static.mjs" --changed --no-pass --baseline ".claude/skills/klarow-guardian/baseline/audit-static-2026-09-12.jsonl"
   node ".claude/skills/klarow-guardian/scripts/find-integrations.mjs" --dist --quiet
   node ".claude/skills/klarow-guardian/scripts/check-secrets.mjs" --dist --quiet
   cd site && node node_modules/typescript/bin/tsc --noEmit && npm run build && cd ..
   node ".claude/skills/klarow-guardian/scripts/verify-site.mjs"
   node ".claude/skills/klarow-guardian/scripts/screenshots.mjs" --out ".claude/work/audit/<data>/shots"   # wymaga playwright-core (instrukcja w wyjściu)
   ```
   Potem po jednym `Agent` na audytora (`ui-auditor`, `motion-auditor`, `code-auditor`, `integration-scanner`,
   `seo-auditor`, `copy-auditor`, `brand-leak-auditor`) z datą, listą plików i ścieżką raportu
   `.claude/work/audit/<data>/<agent>.md`; scal wg `checklists/audit-report-template.md`.

## Jak czytać INDEX.md

- **Werdykty** per audytor: `PASS` = zero BLOCKER/HIGH `CONFIRMED` spoza baseline; `FAIL` = jest coś do naprawy.
- **Tabela przed/po**: „przed” = po deduplikacji i po odrzuceniu findings obalonych przez weryfikację adwersaryjną;
  „po” = stan po ostatniej rundzie naprawczej. Spadek tylko w MEDIUM/LOW jest normalny — HIGH/BLOCKER
  naprawiane są wyłącznie mechanicznie.
- **Naprawione**: każda pozycja ma `[id-reguły]` → `.claude/skills/klarow-guardian/rules/<id>.md` (dlaczego).
- **Do decyzji founderów**: copy, liczby, etykiety dowodu, layout, IA/slugi, integracje (nowy host), sekrety,
  ruch poza tokenami, brak `/rodo` — nic z tego nie jest naprawiane automatycznie.
- **Obserwacja / PLAUSIBLE**: ocena bez dowodu w kodzie; do potwierdzenia ręcznie lub w następnym audycie.
- **Nie sprawdzano**: najczęściej zrzuty (brak `playwright-core` — instrukcja w `scripts/screenshots.mjs`)
  albo `dist` (build pominięty). To NIE jest PASS.
- Dług istniejący (769 pozycji na 2026-09-12) siedzi w `baseline/audit-static-2026-09-12.jsonl` — audyt pokazuje
  domyślnie tylko NOWE naruszenia; pełny dług: `--no-baseline`. Baseline aktualizuje się świadomie
  (nowy plik z nową datą po sprincie spłaty długu), nigdy „żeby było zielono”.

## Hooki (opcjonalnie, jednorazowo)

Gotowy fragment `settings.json`: `.claude/skills/klarow-guardian/hooks.settings.example.json`
(PreToolUse `Read|Edit|Write|MultiEdit|Bash|PowerShell|Grep|Glob` → `hook-pre-tool.mjs` blokuje `.env`/klucze/`chat_id`
— także w komendach typu `cd leadscout && cat .env` — oraz treść z nazwą poprzedniej firmy lub `#FFA914`
pod `site/`, `demo/`, `ui-kit/`, w tym zapis przez powłokę (`>`, `tee`, `sed -i`, heredoc); PostToolUse
`Edit|Write|MultiEdit` → `hook-post-edit.mjs` dopisuje findings `audit-static` NOWE wobec baseline dla
edytowanego pliku. Matcher musi wymieniać `PowerShell` i `MultiEdit` — w tym środowisku PowerShell jest
powłoką podstawową, a bez nich odpowiednie gałęzie hooka nigdy się nie uruchomią.) Komendy wołają `node`
ze ścieżką `$CLAUDE_PROJECT_DIR/...` w cudzysłowie (ścieżka repo ma „&” i spację, a repo jest wspólne
z drugim founderem). Skill nie edytuje `settings.json` sam; użytkownik wkleja fragment (albo `/update-config`).
Test regresyjny bramki sekretów: `node ".claude/skills/klarow-guardian/scripts/hook-pre-tool.mjs" --selftest`.
