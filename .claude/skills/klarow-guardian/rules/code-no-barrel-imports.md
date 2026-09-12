---
id: code-no-barrel-imports
title: Zero importów z barrel-files (lodash, react-icons, date-fns); lucide-react akceptowany
impact: LOW
tags: [bundle, imports, tree-shaking, code]
source: RBP:bundle-barrel-imports / vercel.md §3.2 (kalibracja: Rollup tree-shake, brak serwera) / vercel.md §10.3 „Vercel impact ≠ nasza severity"
added: 2026-09-12
---

## Zasada

Nie importujemy z pakietów-agregatów, których wejście re-eksportuje setki modułów bez pełnego ESM tree-shakingu: `lodash` (użyj własnej funkcji w `lib/` albo `lodash-es/<fn>`), `react-icons`, `date-fns` (root), `@mui/*`, `rxjs` (root). `lucide-react` jest dopuszczony świadomie: Vite/Rollup tree-shake'uje go w buildzie produkcyjnym, koszt to tylko dev-boot; deep-importy lucide nie mają typów `.d.ts`, więc nie wymuszamy ich. Własne barrel-files w `site/src` (`components/index.ts`, `data/index.ts`) są zakazane: importujemy z pliku komponentu lub danych.

## Mechanizm awarii (dlaczego)

U Vercela reguła ma impact CRITICAL, bo w Next/serverless barrel z 1 583 modułów kosztuje 200–800 ms cold startu. U nas nie ma serwera: Rollup usuwa nieużywane eksporty ESM, więc realny koszt to dłuższy `vite dev` i HMR oraz ryzyko, że pakiet CJS (jak `lodash`) wejdzie w całości (~70 KB gz). Własny barrel `components/index.ts` psuje z kolei code-splitting z `code-lazy-routes-and-dashboards`: `import { Card } from "@/components"` ciągnie cały indeks (w tym dashboardy) do chunku strony głównej.

## Niepoprawnie

```ts
import { debounce } from "lodash";            // CJS, cały pakiet
import { FaCheck } from "react-icons/fa";     // barrel ~1 500 ikon
import { format } from "date-fns";            // root barrel
import { Card, Chip } from "@/components";    // własny barrel: zabija lazy chunki
```

## Poprawnie

```ts
import { Check } from "lucide-react";         // akceptowane (ESM, tree-shake)
import { Card } from "@/components/Card";
import { Chip } from "@/components/Chip";
// daty i liczby: Intl.* zamiast date-fns (WIG „Locale & i18n"); debounce: 8 linii własnego kodu w lib/
```

## Test

```bash
grep -rnE "from \"(lodash|react-icons|date-fns|rxjs|@mui/[a-z-]+)\"" site/src   # oczekiwane: 0
grep -rnE "from \"@/(components|data|lib)\"" site/src                                 # oczekiwane: 0
test ! -f site/src/components/index.ts && echo "OK: brak barrela"
grep -nE "\"(lodash|react-icons|date-fns)\"" site/package.json                        # oczekiwane: 0
```

Severity: LOW (raport). Podniesienie do HIGH, gdy chunk strony głównej przekroczy budżet 140 KB gz i winowajcą jest barrel.

## Wyjątki

`lucide-react` (patrz wyżej). `react-router-dom` i `motion/react` to barrele biblioteczne z poprawnym tree-shakingiem; nie flagować.
