---
id: code-memo-policy
title: Polityka memoizacji: decyzja o React Compiler; do tego czasu useMemo tylko z pomiarem
impact: MEDIUM
tags: [rerender, memo, react-compiler, perf, code]
source: RBP:rerender-memo, rerender-simple-expression-in-memo, rerender-memo-with-default-value, rerender-split-combined-hooks / vercel.md §3.5, §14 p.8 / synthesis D-18 (React 19.3 = faza 2)
added: 2026-09-12
---

## Zasada

1. Decyzja founderów (pozycja w `docs/DECISIONS.md`; rekomendacja: włączyć `babel-plugin-react-compiler` w Vite razem z upgrade do React 19.3 w fazie 2). Do tej decyzji obowiązuje punkt 2.
2. `useMemo` / `useCallback` / `memo` dodajemy WYŁĄCZNIE z komentarzem `/* memo: <pomiar> */` wskazującym, co zmierzono (React Profiler, `console.time`, liczba wierszy). Bez pomiaru: liczymy w renderze. Nigdy `useMemo` dla prostego wyrażenia z prymitywnym wynikiem (`a || b`, `x > 0`, konkatenacja). Komponent w `memo()` nie może mieć domyślnych propsów-obiektów ani funkcji (`{ onX = () => {} }`); domyślne wartości nie-prymitywne wynosimy do stałych modułu. Jeden `useMemo` = jedna niezależna zależność; `filter` i `sort` z różnymi deps rozdzielamy.
3. Po włączeniu React Compiler: ręczne `memo` / `useMemo` / `useCallback` usuwamy z komponentów (kompilator je generuje); zostają tylko w silnikach `lib/**` jako zwykłe cache'e funkcji (tam kompilator nie działa).

## Mechanizm awarii (dlaczego)

`useMemo` bez pomiaru to koszt (alokacja tablicy deps + porównanie) bez zysku; z 16 wystąpień w `site/src` część liczy silniki `lib/report.ts` (uzasadnione), część owija proste wyrażenia. `memo()` z domyślnym obiektem tworzy nową referencję co render i memoizacja nigdy nie trafia (RBP 5.5). Połączony `useMemo` z `filter + sort` i 3 deps przelicza sortowanie przy każdej zmianie filtra (RBP 5.9). React Compiler rozwiązuje to automatycznie, ale to zmiana pipeline'u Babel w Vite i zależność w RC; dlatego decyzja, nie domyślne włączenie.

## Niepoprawnie

```tsx
const isEmpty = useMemo(() => rows.length === 0, [rows]);                  // prymityw, zbędne
const Row = memo(function Row({ onSelect = () => {} }: RowProps) { /* … */ }); // nowa funkcja co render
const view = useMemo(() => rows.filter(matches(q)).sort(byDate), [rows, q, sortKey]); // 2 zadania, 3 deps
```

## Poprawnie

```tsx
const isEmpty = rows.length === 0;
const NOOP = () => {};
const Row = memo(function Row({ onSelect = NOOP }: RowProps) { /* … */ });
/* memo: ContractRegister, 1 200 wierszy, filtr 38 ms → 4 ms (Profiler 2026-09) */
const filtered = useMemo(() => rows.filter(matches(q)), [rows, q]);
const view = useMemo(() => [...filtered].sort(byKey(sortKey)), [filtered, sortKey]);
```

## Test

```bash
# useMemo/useCallback bez komentarza pomiaru w tej samej lub poprzedniej linii
grep -rnB1 -E "use(Memo|Callback)\(" site/src --include=*.tsx | grep -vE "memo:" | grep -E "use(Memo|Callback)\("
# proste wyrażenia w useMemo
grep -rnE "useMemo\(\(\) => [a-zA-Z_.]+ (\|\||&&|===|>|<) " site/src
# memo() z domyślnym obiektem/funkcją
grep -rnE "memo\(function [A-Za-z]+\(\{[^}]*= (\(\)|\{|\[)" site/src
```

Severity: MEDIUM (raport). Po decyzji o React Compiler audyt zmienia się w „zero ręcznego memo w komponentach".

## Wyjątki

Silniki `lib/**`: cache w `Map` na poziomie modułu jest OK (RBP 7.4). Dashboardy w trybie `tool` z tabelami > 500 wierszy: `memo` na wierszu tabeli dozwolone z pomiarem.
