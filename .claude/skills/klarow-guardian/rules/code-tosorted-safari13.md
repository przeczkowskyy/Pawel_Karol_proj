---
id: code-tosorted-safari13
title: [...a].sort() zamiast toSorted(); zero metod nowszych niż safari13 bez polyfilla
impact: HIGH
tags: [build-target, safari, compat, js, code]
source: RBP:js-tosorted-immutable (+ uwaga vercel.md §3.7 o safari13) / vite.config.ts build.target ["es2019","safari13"] / synthesis D-19 (cssTarget safari13 zostaje w fazie 1) / CLAUDE.md sesja 2026-07-24 (esbuild nie polyfilluje)
added: 2026-09-12
---

## Zasada

Immutability przy sortowaniu props/state realizujemy przez `[...arr].sort(cmp)` (kopia + sort), nie `arr.toSorted(cmp)`. Ta sama zasada dla pozostałych metod spoza `es2019`: `Array.prototype.at`, `toReversed`, `toSpliced`, `with`, `findLast`, `Object.hasOwn`, `structuredClone`, `Array.prototype.flat` jest OK (ES2019), `String.prototype.replaceAll` NIE (ES2021), `Promise.any`, `AggregateError`, `WeakRef`. Dopóki `vite.config.ts` ma `build.target: ["es2019", "safari13"]`, każde użycie takiej metody wymaga albo zamiennika, albo jawnego polyfilla w `main.tsx` z komentarzem. Zmiana targetu = decyzja D-19 po publikacji, nie decyzja agenta.

## Mechanizm awarii (dlaczego)

esbuild transpiluje SKŁADNIĘ (optional chaining, `??`, klasy) do targetu, ale NIE polyfilluje METOD: `toSorted` (Safari 16+), `at` (Safari 15.4+), `structuredClone` (Safari 15.4+), `replaceAll` (Safari 13.1+) przechodzą do bundla bez zmian i rzucają `TypeError: x.toSorted is not a function` na starszym WebKicie. Objaw dla użytkownika to pusty `#root` (React zdejmuje drzewo po wyjątku w renderze), czyli dokładnie „strona tylko z tłem", którą Karol widział na iPhonie w lipcu 2026. Reguła Vercela `js-tosorted-immutable` zakłada nowoczesny target; u nas jej literalne zastosowanie psuje produkcję.

## Niepoprawnie

```ts
const view = rows.toSorted((a, b) => a.cost - b.cost);   // TypeError na Safari < 16
const last = rows.at(-1);                                 // TypeError na Safari < 15.4
const copy = structuredClone(state);                      // ReferenceError na Safari < 15.4
const clean = s.replaceAll(",", ".");                     // ES2021
```

## Poprawnie

```ts
const view = [...rows].sort((a, b) => a.cost - b.cost);  // kopia + sort; rows nietknięte
const last = rows[rows.length - 1];
const copy = JSON.parse(JSON.stringify(state)) as State;  // dane dem są czystym JSON-em
const clean = s.replace(/,/g, ".");                        // RegExp hoistowany poza pętlę (RBP 7.10)
```

Sortowanie w miejscu jest dozwolone tylko na tablicy lokalnej utworzonej w tej samej funkcji (silniki `lib/**`), nigdy na props/state.

## Test

```bash
grep -rnE "\.(toSorted|toReversed|toSpliced|findLast|findLastIndex|replaceAll)\(|\.at\(-?[0-9]|structuredClone\(|Object\.hasOwn\(|Promise\.any\(|new WeakRef\(" site/src --include=*.ts --include=*.tsx --include=*.mjs   # oczekiwane: 0
# sort w miejscu na props/state (heurystyka: sort( bez spreadu w tej samej linii)
grep -rnE "\b(props|state|rows|items|tools|data)\.[a-zA-Z_.]*sort\(" site/src --include=*.tsx | grep -v "\[\.\.\."   # przegląd ręczny
grep -nE "target: \[\"es2019\", \"safari13\"\]" site/vite.config.ts   # oczekiwane: 1
```

Severity: HIGH (metoda bez polyfilla = wyjątek na realnym urządzeniu). Auto-fix dozwolony dla `toSorted` → `[...a].sort` i `at(-1)`.

## Wyjątki

`scripts/*.mjs` i `.claude/skills/klarow-guardian/scripts/*.mjs` działają w Node 24 (nie w przeglądarce): `toSorted`, `at`, `structuredClone` są tam dozwolone. Po podniesieniu targetu (D-19) reguła zwęża się do listy metod nowszych niż nowy target.
