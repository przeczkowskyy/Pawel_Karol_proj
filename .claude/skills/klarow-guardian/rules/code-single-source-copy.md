---
id: code-single-source-copy
title: Jedno źródło copy: data/*.ts konsumowane przez React i shelle prerendera
impact: HIGH
tags: [data, prerender, seo, copy, i18n, code]
source: site-audit.md §3.4 p.4 (dwa źródła copy: App.tsx vs entry.tsx) / synthesis §2.8 p.2 (shelle z danych), S5 (bramka shell-vs-DOM), §2.7.2 (data/home.ts, oferta.ts, founders.ts, messaging.ts) / strategy.md T6, T12
added: 2026-09-12
---

## Zasada

Każdy tekst widoczny na stronie mieszka w module `site/src/data/*.ts` jako obiekt `{ pl, en }` (`messaging.ts`, `home.ts`, `oferta.ts`, `founders.ts`, `tools.ts`, `toolsSeo.ts`, `faq.ts`, `pagesSeo.ts`, `contact.ts`). Komponenty React i shelle prerendera w `src/prerender/entry.tsx` importują te same moduły; w `entry.tsx` nie ma ręcznie pisanej prozy ani duplikatów stałych (`ORIGIN`, `EMAIL`, `PHONE_*` z `contact.ts`). Stałe copy w komponentach (`const HERO = { pl, en }` w `App.tsx`) są zakazane poza mikro-etykietami samego komponentu (`aria-label` ikony, „Zamknij"). Zmiana zdania = zmiana w jednym pliku; shell i DOM po starcie Reacta zawierają identyczny zbiór H1/H2/akapitów.

## Mechanizm awarii (dlaczego)

Dziś sekcje React (`App.tsx`: `HERO`, `CAPS`, `PROOF`, `PAIN`, `OFFER`, `HOME_NEXT`, `FOOT`) i shelle prerendera (`entry.tsx:103-417`, ręczna proza PL + skrót EN) to dwa osobne źródła. Przykład: bullety oferty `App.tsx:405-410` vs `entry.tsx:257-263`, lead hero `App.tsx:100-102` vs `entry.tsx:110-115` (inne brzmienie). Google indeksuje DOM po JS, ale snippet i cache pochodzą z HTML; użytkownik i crawler czytają dwie wersje jednego zdania, a każda zmiana copy wymaga dwóch edycji i zwykle jedna jest pomijana. Dwie wersje = dwa miejsca, w których może pojawić się liczba spoza `allowedNumbers` albo nazwa poprzedniej firmy.

## Niepoprawnie

```tsx
// App.tsx (sekcja React)
const HERO = { pl: { h1: "Narzędzia pod Twój proces…", lead: "Kontroling, integracje…" }, en: { … } };

// prerender/entry.tsx (shell pisany ręcznie, inne słowa)
function HomeShell() { return <main><h1>Automatyzacja danych dla firm 20–250 osób…</h1><p>…</p></main>; }
```

## Poprawnie

```ts
// site/src/data/home.ts
import { MESSAGING } from "./messaging";
export const HOME = {
  hero: { h1: MESSAGING.oneLiner, lead: MESSAGING.subtext, primary: MESSAGING.cta.primary, secondary: MESSAGING.cta.secondary },
  outcomes: { title: { pl: "Co osiągniesz", en: "What you gain" }, items: [ /* { icon, title: {pl,en}, line: {pl,en} } */ ] },
} as const;
```

```tsx
// components/Hero.tsx (React) i prerender/entry.tsx (HomeShell) importują ten sam HOME:
const t = pick(lang, HOME.hero.h1);            // React
<h1>{HOME.hero.h1.pl}</h1>                     // shell (PL kanoniczne) + sekcja lang="en" z HOME.hero.h1.en
```

## Test

```bash
# stałe copy w komponentach (obiekt { pl: { … }, en: { … } } poza data/)
grep -rnE "^const [A-Z_]+ = \{\s*$|^const [A-Z_]+ = \{ pl:" site/src --include=*.tsx | grep -v "site/src/data/"   # oczekiwane: 0 (poza mikro-etykietami `T` w dashboardach: baseline)
# ręczna proza w shellach: akapity z literałami zamiast pick/data
grep -nE "<(h1|h2|p)>[A-ZŻŹĆĄŚĘŁÓŃ][^<{]{20,}</" site/src/prerender/entry.tsx   # oczekiwane: 0
# duplikaty stałych kontaktowych
grep -rnE "^const (ORIGIN|EMAIL|PHONE_DISPLAY|PHONE_HREF) =" site/src | grep -v "data/contact.ts"   # oczekiwane: 0
# bramka shell-vs-DOM (faza 3): zbiory H1/H2/p identyczne
# PLANOWANE (F3, verify-site.mjs nie zna tego trybu): node .claude/skills/klarow-guardian/scripts/verify-site.mjs --shell-vs-dom / /narzedzia
```

Severity: HIGH. Nowa sekcja bez wpisu w `data/*.ts` = do naprawy przed merge.

## Wyjątki

Etykiety wewnętrzne dashboardów (`const T = { pl, en }` w `dashboards/*.tsx`) zostają przy komponencie (tryb `tool`, nie są w shellu). `aria-label` i teksty przycisków ikonowych mogą żyć przy komponencie, ale nadal jako `{ pl, en }`.
