---
id: code-use-not-usecontext
title: use(Context) zamiast useContext(Context)
impact: MEDIUM
tags: [react19, context, hooks, code]
source: CP:react19-no-forwardref (część use) / vercel.md §4, §13 / react.dev reference use
added: 2026-09-12
---

## Zasada

Kontekst czytamy przez `use(LangContext)` (import `use` z `react`), nie przez `useContext`. Obowiązuje dla każdego nowego kontekstu (`LangContext`, przyszły `BookingContext`, `MotionProvider`). Jedyne dziś wystąpienie: `site/src/i18n.tsx:40` (`export const useLang = () => useContext(LangContext)`), do zamiany w fazie 0.

## Mechanizm awarii (dlaczego)

`use()` jest API docelowym React 19: czyta kontekst i promisy tym samym wywołaniem, wolno je wołać warunkowo i po wczesnym `return` (czego `useContext` zabrania regułami hooków). Trzymanie dwóch API do tej samej rzeczy w jednym repo daje dwa style w kodzie i dwie ścieżki lintowania; agent, który widzi `useContext` w `i18n.tsx`, kopiuje go do kolejnych providerów. Zamiana jest mechaniczna i bez ryzyka semantycznego, więc dług nie ma uzasadnienia.

## Niepoprawnie

```tsx
// site/src/i18n.tsx:1,40
import { createContext, useContext, useEffect, useState } from "react";
export const useLang = () => useContext(LangContext);
```

## Poprawnie

```tsx
import { createContext, use, useEffect, useState } from "react";
export const useLang = () => use(LangContext);

// warunkowe czytanie jest legalne (useContext by tego nie pozwolił):
function Price({ show }: { show: boolean }) {
  if (!show) return null;
  const { lang } = use(LangContext);
  return <span>{pick(lang, LABEL)}</span>;
}
```

## Test

```bash
grep -rnE "\buseContext\b" site/src --include=*.tsx --include=*.ts   # oczekiwane: 0
grep -rnE "import \{[^}]*\buse\b[^}]*\} from \"react\"" site/src/i18n.tsx   # oczekiwane: 1
```

Severity: MEDIUM. Auto-fix dozwolony (fixer): `useContext(` → `use(` + import.

## Wyjątki

Brak. `demo/` jest statycznym HTML bez Reacta, więc reguła dotyczy wyłącznie `site/`.
