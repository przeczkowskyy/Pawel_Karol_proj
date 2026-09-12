---
id: demo-golden-tests
title: Każdy silnik ma golden-test node --test: dwa przebiegi = identyczny JSON i zgodność z zamrożonym plikiem golden; zero wartościowych importów przez alias @/ w src/lib/**; nowy silnik bez testu = fail
impact: BLOCKER
tags: [demo, tests, determinism, engines, ci]
source: CLAUDE.md #6 („dwa przebiegi muszą dać identyczny JSON") · synthesis §1.3 P9/§2.7.1 (`node --test` dla report/qualityGate/tranches/g703)/§5.4.11 determ-golden · feasibility-perf §7 · bklit-ui §10.3 (zasada testów)
added: 2026-09-12
---

## Zasada

1. Silniki liczące to czyste moduły w `site/src/lib/`: `report.ts` (`parseCsv`, `aggregate`), `qualityGate.ts` (`auditRows`, tydzień ISO), `tranches.ts` (`allocateGrosze` wyciągnięte z `PaymentCalculator.tsx:21`), `g703.ts` (`proposalFor` wyciągnięte z `G703Billing.tsx:36-41`), `pdf.ts` (definicja dokumentu). Każdy nowy dashboard z logiką liczącą dostaje moduł w `lib/` PRZED komponentem.
2. Każdy silnik ma plik `site/tests/<silnik>.test.mjs` (Node 24: `node --experimental-strip-types --test`, bez frameworka, bez `npx`), który:
   - **dwa przebiegi**: wywołuje silnik 2× na tym samym wejściu (`DEMO_SAMPLE` i ≥ 1 przypadek brzegowy) i asertuje `assert.deepStrictEqual(run1, run2)` oraz `JSON.stringify(run1) === JSON.stringify(run2)` (kolejność kluczy i tablic),
   - **golden**: porównuje `JSON.stringify(run1, null, 2)` z zamrożonym plikiem `site/tests/golden/<silnik>.<case>.json`; różnica = fail z diffem; aktualizacja golden tylko przez własną zmienną (`GOLDEN_UPDATE=1 npm run test`) w commicie `Demo: nowy golden <silnik> (powód)`,
   - **niezmienniki domenowe**: `tranches`: Σ alokacji == kwota co do grosza dla 1 000 wag z seedowanego generatora (`hashFract`), zero ujemnych; `g703`: `earned = roundHalfUp(D × M)`, propozycja 0 poniżej progu 40 % dla `base`, brak progu dla `change_order`, clawback ujemny NIEPRZYCINANY; `qualityGate`: reguły PM<0 / tydzień<0 / saldo≠0 / data poza tygodniem ISO na przypadkach z obu formatów dat; `report`: separator `;`/`\t`/`,` daje ten sam wynik, nagłówki PL/EN równoważne,
   - **brak zależności od środowiska**: test ustawia `TZ=UTC` (`process.env.TZ = "UTC"` na początku pliku) i nie czyta zegara.
3. Testy są uruchamiane w `npm run check` przez `npm run test`, którego JEDYNA definicja to `node --experimental-strip-types --test tests/` (Node 24, bez `npx`). Nigdzie nie piszemy gołego `node --test tests/` — bez `--experimental-strip-types` Node nie wczyta `../src/lib/<silnik>.ts`. Reguły cytują komendę jako `npm run test`, żeby nie rozjechały się warianty.
4. Silnik importowany przez dashboard MUSI być tym samym, który testujemy (dashboard `import { allocateGrosze } from "@/lib/tranches"`, nie lokalna kopia).
5. **Zero WARTOŚCIOWYCH importów przez alias `@/` w `src/lib/**`** (twardy warunek uruchamialności testów). Node nie czyta ani `paths` z `site/tsconfig.json:14` (`"@/*": ["src/*"]`), ani aliasu Vite (`site/vite.config.ts:12`), a `site/src/i18n.tsx` to JSX, którego `--experimental-strip-types` nie umie wczytać w ogóle. W `src/lib/**` dozwolone są wyłącznie:
   - `import type { Lang } from "@/i18n"` — import TYPU, wycinany przez strip-types (stąd `lib/report.ts:1` i `lib/money.ts` działają dziś),
   - importy względne wewnątrz `lib/` z JAWNYM rozszerzeniem: `import { fmtMoney } from "./money.ts"` (ESM w Node wymaga rozszerzenia; Vite je akceptuje, TS wymaga `allowImportingTsExtensions: true` obok `noEmit: true`).
   Wszystko inne — język, teksty (`MESSAGING`), etykiety walut, formatery — wchodzi do silnika ARGUMENTEM (`opts.lang`, `opts.labels`), nie importem. To ta sama zasada co „silniki = czyste funkcje" (`demo-events-outside-engines` p.6): warstwa prezentacji (komponent, `PdfButton`) woła `pick()` i podaje gotowe stringi.
   Konsekwencja dla `lib/pdf.ts`: `pdfDoc(input, opts)` dostaje `opts.labels.subject` i `opts.labels.footer` (patrz `demo-pdf-deterministic`), NIE importuje `@/i18n` ani `@/data/messaging`.
   Importy w `src/lib/**` piszemy jednolinijkowo (bramka poniżej jest liniowa).

## Mechanizm awarii (dlaczego)

- CLAUDE.md #6: „determinizm jest obietnicą produktową (i tak testujemy: dwa przebiegi muszą dać identyczny JSON)". Bez testu obietnica jest deklaracją; z testem jest bramką → BLOCKER.
- Wyciągnięcie `allocateGrosze` i `proposalFor` z komponentów (P9) daje 0 ryzyka i testowalność: dziś te funkcje żyją w TSX i nie da się ich uruchomić w Node bez Reacta.
- Golden łapie zmiany „przy okazji" (ktoś poprawia zaokrąglenie, zmienia się 40 wyników w demie, zrzuty i PDF-y się rozjeżdżają); diff golden pokazuje to w PR.
- Testy niezmienników (Σ co do grosza na 1 000 losowych-seedowanych wag) chronią obietnicę „co do grosza" z paska S5 (`allowedNumbers`).
- `TZ`: `new Date(Date.UTC(...))` jest odporne, ale `toLocaleDateString` bez `timeZone: "UTC"` daje różne wyniki na CI (UTC) i u Karola (Europe/Warsaw).
- Pierwszy `import { pick } from "@/i18n"` w `src/lib/**` wywala `ERR_MODULE_NOT_FOUND` (alias) albo błąd parsera JSX (gdyby alias rozwiązać hookiem), a BLOCKER-owa bramka `npm run check` przestaje ruszać z miejsca — i to nie na zmianie w teście, tylko na „niewinnym" imporcie w silniku. Dlatego zakaz jest w regule, a nie w resolverze: resolver i tak nie wczyta `i18n.tsx`.

## Niepoprawnie

```ts
// PaymentCalculator.tsx: silnik w komponencie, brak testu
function allocateGrosze(weights: number[], targetGr: number): number[] { … }
```

```
site/tests/            # katalog nie istnieje; „testowaliśmy ręcznie w konsoli"
```

```ts
// site/src/lib/pdf.ts — wartościowy import przez alias: `npm run test` przestaje startować
import { pick } from "@/i18n";
import { MESSAGING } from "@/data/messaging";
const subject = pick(opts.lang, MESSAGING.proofFooter);
```

## Poprawnie

```ts
// site/src/lib/tranches.ts — silnik bez aliasu @/ w wartościach (tylko import type, jeśli w ogóle)
export function allocateGrosze(weights: number[], targetGr: number): number[] {
  const s = weights.reduce((a, b) => a + b, 0);
  const out: number[] = []; let running = 0;
  for (let i = 0; i < weights.length; i++) {
    if (s <= 0) out.push(0);
    else if (i < weights.length - 1) { const amt = Math.round((weights[i] / s) * targetGr); out.push(amt); running += amt; }
    else out.push(targetGr - running);   // reszta zaokrągleń na ostatniej pozycji → Σ == target
  }
  return out;
}
```

```js
// site/tests/tranches.test.mjs   (uruchomienie: npm run test = node --experimental-strip-types --test tests/)
process.env.TZ = "UTC";
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { allocateGrosze } from "../src/lib/tranches.ts";

const hashFract = (n) => { const x = Math.sin(n) * 43758.5453; return x - Math.floor(x); };
const CASES = { basic: [[148500, 96200, 61300], 12_345_678], zeros: [[0, 0, 0], 100], single: [[5], 999] };

test("dwa przebiegi = identyczny JSON", () => {
  for (const [name, [w, t]] of Object.entries(CASES)) {
    const a = allocateGrosze(w, t), b = allocateGrosze(w, t);
    assert.deepStrictEqual(a, b, name);
    assert.equal(JSON.stringify(a), JSON.stringify(b), name);
  }
});

test("golden", () => {
  for (const [name, [w, t]] of Object.entries(CASES)) {
    const out = JSON.stringify(allocateGrosze(w, t), null, 2);
    const path = new URL(`./golden/tranches.${name}.json`, import.meta.url);
    if (process.env.GOLDEN_UPDATE === "1") writeFileSync(path, out + "\n");
    assert.equal(out + "\n", readFileSync(path, "utf8"), `golden ${name}`);
  }
});

test("Σ co do grosza dla 1000 seedowanych wag", () => {
  for (let i = 0; i < 1000; i++) {
    const w = Array.from({ length: 1 + (i % 7) }, (_, k) => Math.floor(hashFract(i * 13 + k) * 1_000_000));
    const t = Math.floor(hashFract(i) * 100_000_000);
    const out = allocateGrosze(w, t);
    assert.equal(out.reduce((a, b) => a + b, 0), w.some((x) => x > 0) ? t : 0);
    assert.ok(out.every((x) => Number.isInteger(x)));
  }
});
```

```json
// site/package.json (scripts)
"test": "node --experimental-strip-types --test tests/",
// (jedyna definicja komendy testowej; reguły cytują `npm run test`)
"check": "node node_modules/typescript/bin/tsc --noEmit && npm run test && npm run build && node ../.claude/skills/klarow-guardian/scripts/verify-site.mjs && node ../.claude/skills/klarow-guardian/scripts/audit-static.mjs --fail-on BLOCKER,HIGH --baseline ../.claude/skills/klarow-guardian/baseline/audit-static-2026-09-12.jsonl"
```

## Test

```bash
# każdy silnik ma test i golden
for e in report qualityGate tranches g703; do [ -f site/tests/$e.test.mjs ] || echo "BRAK testu: $e"; ls site/tests/golden/$e.*.json >/dev/null 2>&1 || echo "BRAK golden: $e"; done
# silniki nie żyją w komponentach (oczekiwane: 0)
grep -rnE '^function (allocateGrosze|proposalFor|aggregate|auditRows|parseCsv)\b' site/src/components
grep -nE 'from "@/lib/tranches"' site/src/components/dashboards/PaymentCalculator.tsx | wc -l   # = 1
grep -nE 'from "@/lib/g703"' site/src/components/dashboards/G703Billing.tsx | wc -l            # = 1
# testy przechodzą, TZ ustawione
cd site && npm run test      # exit 0 (= node --experimental-strip-types --test tests/)
# p.5: zero wartościowych importów przez alias @/ w silnikach (oczekiwane: 0 wierszy)
grep -rnE 'from "@/' site/src/lib --include=*.ts | grep -vE ':import type '
# cross-importy w lib mają jawne rozszerzenie .ts (oczekiwane: 0 wierszy bez rozszerzenia)
grep -rnE 'from "\./[A-Za-z0-9_-]+"' site/src/lib --include=*.ts
# komenda testowa nie rozjeżdża się między plikami (oczekiwane: 0 wierszy)
# UWAGA: dziś zwraca 2 wiersze z `rules/code-lint-and-tests-gate.md` (sekcja `code`) — do ujednolicenia
# przez właściciela tamtej reguły; `site/package.json` nie ma jeszcze skryptu `test` (dług F0).
grep -rn 'node --test tests/' .claude/skills/klarow-guardian/rules site/package.json | grep -v 'experimental-strip-types' 
grep -L 'process.env.TZ = "UTC"' site/tests/*.test.mjs   # = 0 plików bez TZ
# golden aktualizowany tylko świadomie
git log --format=%s -- site/tests/golden | grep -vE '^Demo: nowy golden' && echo "golden zmieniony poza commitem Demo:"
```

## Wyjątki

- **Dług fazy 0 (F0), nie regresja**: do końca fazy 0 katalog `site/tests/` NIE ISTNIEJE (stan repo 2026-09-12), więc audyt bazowy raportuje brak testów i brak golden jako pozycję długu (ticket F0 „golden-testy silników"), nie jako naruszenie do naprawy w bieżącym commicie. Po zamknięciu F0 ten sam wynik = BLOCKER. Ta sama zasada co `perf-no-zoom-root` („do końca fazy 0…").
- `pdf.ts`: golden na `JSON.stringify(docDefinition)` (definicja dokumentu), nie na binarnym PDF (pdfmake wstawia datę utworzenia w metadanych; ustawić `info.creationDate` na stałą, patrz `demo-pdf-deterministic`).
- Dashboardy bez logiki liczącej (`ContractRegister` CRUD, `LabourProtocols` kreator) testują reduktory stanu (`nextId`, przejścia DRAFT→FINAL) tym samym wzorcem „dwa przebiegi", bez golden.
