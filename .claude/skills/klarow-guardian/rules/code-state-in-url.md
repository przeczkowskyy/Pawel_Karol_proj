---
id: code-state-in-url
title: Stan nawigacyjny (filtry hubu, zakładki, rozwinięte panele) w URL, nie w useState
impact: MEDIUM
tags: [router, url, state, hub, seo, code]
source: WIG „Navigation & State" (URL reflects state; deep-link) / RBP:rerender-defer-reads / site-audit.md §3.6 p.1 (ToolsGrid chowa 13 linków) / synthesis §2.3 Hub (`?dzial=&typ=`, canonical bez parametrów, D-08 działy = filtry)
added: 2026-09-12
---

## Zasada

Stan, który użytkownik chciałby udostępnić, cofnąć przyciskiem „wstecz" albo odświeżyć, żyje w URL: filtr działu i typu na hubie `/narzedzia` (`?dzial=kontroling&typ=demo`), aktywna zakładka dashboardu w trybie `tool` (`?tab=`), rozwinięty panel FAQ (`#faq-cena`). Czytamy go przez `useSearchParams` z `react-router-dom` (tylko gdy render zależy od parametru; w handlerach `new URLSearchParams(location.search)`), zapisujemy przez `setSearchParams(next, { replace: true })`. Filtr NIGDY nie odmontowuje kart: 13 kart hubu jest zawsze w DOM, filtr dodaje atrybut `hidden`. `rel="canonical"` huba wskazuje `/narzedzia` bez parametrów. Stan UI nieudostępnialny (otwarty dialog, hover, krok kreatora w demie) zostaje w `useState`.

## Mechanizm awarii (dlaczego)

`ToolsGrid.tsx:67` trzyma wybrany dział w `useState`: po starcie Reacta DOM `/narzedzia` nie ma żadnego linku do 13 podstron (linki pojawiają się po kliknięciu), więc Googlebot z JS widzi inną stronę niż prerender i traci sygnał linkowania wewnętrznego (`site-audit.md` §3.6). Link z LinkedIn „zobacz nasze narzędzia dla finansów" nie da się wysłać, „wstecz" wraca na home zamiast do poziomu działów, odświeżenie kasuje wybór. Odmontowanie kart przy filtrze psuje też prerender (`ToolsShell` ma 13 linków, DOM po JS mniej) i bramkę shell-vs-DOM.

## Niepoprawnie

```tsx
// ToolsGrid.tsx:67
const [openDept, setOpenDept] = useState<Dept | null>(null);
if (openDept === null) { /* przyciski działów, ZERO linków do narzędzi */ }
const inDept = tools.filter((x) => x.dept === openDept);   // reszta kart nie istnieje w DOM
```

## Poprawnie

```tsx
import { useSearchParams, Link } from "react-router-dom";
const [params, setParams] = useSearchParams();
const dzial = params.get("dzial");          // null = wszystkie
const typ = params.get("typ");              // "demo" | "case" | null
const setFilter = (next: Record<string, string | null>) =>
  setParams((p) => { const q = new URLSearchParams(p); for (const [k, v] of Object.entries(next)) v ? q.set(k, v) : q.delete(k); return q; }, { replace: true });

{tools.map((t) => (
  <li key={t.slug} hidden={(dzial !== null && t.dept !== dzial) || (typ !== null && t.kind !== typ)}>
    <Link to={`/narzedzia/${t.slug}`}>…</Link>   {/* zawsze w DOM */}
  </li>
))}
```

Chipy filtrów to `<button type="button" aria-pressed={dzial === d.key}>`; `<Seo path="/narzedzia" />` (canonical bez query).

## Test

```bash
# hub: brak useState dla działu/typu, jest useSearchParams
grep -nE "useState<Dept|useState<.*dept" site/src/components/ToolsGrid.tsx site/src/pages/Tools.tsx 2>/dev/null   # 0
grep -nE "useSearchParams" site/src/components/ToolsGrid.tsx site/src/pages/Tools.tsx 2>/dev/null                # ≥ 1
# 13 linków w DOM po JS (Playwright WebKit ze scratchpadu; tryb --dom PLANOWANY, F3)
node .claude/skills/klarow-guardian/scripts/verify-site.mjs --min-tool-links 13                 # shell hubu: ≥ 13 linków /narzedzia/<slug>
# PLANOWANE (F3, verify-site.mjs nie zna tego trybu): node .claude/skills/klarow-guardian/scripts/verify-site.mjs --dom /narzedzia --expect-links 13
```

Severity: MEDIUM (raport); brak 13 linków w DOM = BLOCKER z reguły `seo-links-in-dom`.

## Wyjątki

Stan dem w trybie `tool` (wklejony CSV, wybrany tydzień na suwaku) nie trafia do URL: determinizm i prywatność danych użytkownika (adres z danymi w historii przeglądarki to wyciek).
