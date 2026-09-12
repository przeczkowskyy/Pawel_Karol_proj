---
id: code-lint-and-tests-gate
title: Bramka przed pushem: tsc, ESLint (react-hooks, jsx-a11y), node --test golden, build, verify, audit
impact: BLOCKER
tags: [ci, eslint, tests, gate, npm-run-check, code]
source: CLAUDE.md #4, #6 (tsc + vite build przed pushem; npx nie działa) / site-audit.md §1.1 (brak lint/test) / synthesis §2.7.1 „Jakość", §5.8.4 (npm run check), D-23 / peer-legal.md §1.5
added: 2026-09-12
---

## Zasada

Push na `main` tylko po zielonym `npm run check` w `site/`, który uruchamia po kolei (zero `npx`; binarki wprost przez `node node_modules/...`):
1. `node node_modules/typescript/bin/tsc --noEmit`
2. `node node_modules/eslint/bin/eslint.js src --max-warnings 0` z pluginami `eslint-plugin-react-hooks` (`rules-of-hooks`, `exhaustive-deps`) i `eslint-plugin-jsx-a11y` (`recommended`) oraz regułami własnymi `no-restricted-syntax` (forwardRef, useContext, `import { motion }`, `npx`)
3. `node --test tests/` — golden-testy silników `lib/report.ts`, `lib/qualityGate.ts`, `lib/tranches.ts`, `lib/g703.ts`: dwa przebiegi na tym samym wejściu = identyczny JSON (`assert.deepStrictEqual`), plus snapshot JSON w `tests/golden/*.json`
4. `node node_modules/vite/bin/vite.js build` + `npm run prerender`
5. `node ../.claude/skills/klarow-guardian/scripts/verify-site.mjs`
6. `node ../.claude/skills/klarow-guardian/scripts/audit-static.mjs --fail-on BLOCKER,HIGH --baseline ../.claude/skills/klarow-guardian/baseline/audit-static-2026-09-12.jsonl`
   (nazwa skryptu i ścieżka baseline'u dosłownie takie; `scripts/audit-ui.mjs` nie istnieje. Flagi WYŁĄCZNIE ze spacją: parser `audit-static.mjs:41-52` nie zna formy `--fail-on=…` i cicho bierze ją za ścieżkę do skanowania, więc bramka kończy się exit 0 bez sprawdzenia czegokolwiek.)

Czerwony krok 1 lub 4 = BLOCKER (twarda zasada CLAUDE.md #6). Czerwony 2, 3, 5, 6 = BLOCKER po decyzji D-23 (do tego czasu HIGH; agent i tak nie pushuje z czerwonym wynikiem). Nowy silnik w `lib/` bez golden-testu = fail kroku 3.

## Mechanizm awarii (dlaczego)

Repo nie ma dziś ESLint ani testów (`package.json` ma tylko `dev/build/prerender/preview`; komentarz `// eslint-disable-line` w `TaskTimeline.tsx:153` jest martwy). `tsc` nie wykryje brakującego cleanupu w `useEffect`, złych deps, `<div onClick>` bez roli ani `img` bez `alt`; to wyłapują `react-hooks` i `jsx-a11y`. Determinizm dem jest obietnicą produktową (CLAUDE.md #6): bez testu „dwa przebiegi = ten sam JSON" regresja `Math.random`/`Date.now` w silniku przechodzi niezauważona do produkcji. `npx` w skryptach łamie build lokalnie przez `&` w ścieżce repo („'Pawe' is not recognized").

## Niepoprawnie

```json
{ "scripts": { "lint": "npx eslint src", "test": "npx vitest" } }
```
```bash
git push origin main   # po samym `tsc`, bez buildu; albo z czerwonym lintem „bo to tylko warningi"
```

## Poprawnie

```json
{
  "scripts": {
    "typecheck": "node node_modules/typescript/bin/tsc --noEmit",
    "lint": "node node_modules/eslint/bin/eslint.js src --max-warnings 0",
    "test": "node --test tests/",
    "build": "node node_modules/vite/bin/vite.js build && npm run prerender",
    "check": "npm run typecheck && npm run lint && npm run test && npm run build && node ../.claude/skills/klarow-guardian/scripts/verify-site.mjs && node ../.claude/skills/klarow-guardian/scripts/audit-static.mjs --fail-on BLOCKER,HIGH --baseline ../.claude/skills/klarow-guardian/baseline/audit-static-2026-09-12.jsonl"
  }
}
```
```js
// site/tests/report.golden.test.mjs
import { test } from "node:test"; import assert from "node:assert/strict";
import { aggregate, parseCsv } from "../dist-ssr/lib/report.js";   // albo tsx-loader; ważne: ten sam moduł co runtime
import sample from "./fixtures/demo-sample.json" with { type: "json" };
test("report: dwa przebiegi = identyczny JSON", () => {
  const a = JSON.stringify(aggregate(parseCsv(sample.csv)));
  const b = JSON.stringify(aggregate(parseCsv(sample.csv)));
  assert.equal(a, b);
});
```

## Test

```bash
grep -nE "\"check\":" site/package.json                                  # 1
grep -rnE "\bnpx\b" site/package.json site/README.md .claude/skills/klarow-guardian/scripts 2>/dev/null   # 0
ls site/tests/*.test.mjs | wc -l                                          # ≥ 4 (report, qualityGate, tranches, g703)
grep -nE "react-hooks|jsx-a11y" site/eslint.config.js                     # ≥ 2
# krok 6 wskazuje istniejący skrypt i istniejący baseline (audit-ui.mjs NIE istnieje)
grep -n "audit-ui.mjs" site/package.json                                  # 0
test -f .claude/skills/klarow-guardian/scripts/audit-static.mjs && test -f .claude/skills/klarow-guardian/baseline/audit-static-2026-09-12.jsonl && echo "OK bramka 6"
cd site && npm run check                                                  # exit 0 przed każdym pushem
```

## Wyjątki

Commity WIP na gałęzi roboczej (nie `main`) mogą pomijać kroki 5–6; `main` nigdy. Cloudflare Pages CI wykonuje tylko `npm run build` (bez lintu/testów), więc bramka jest lokalna i musi być wykonana przed pushem, nie „naprawiona po deployu".
