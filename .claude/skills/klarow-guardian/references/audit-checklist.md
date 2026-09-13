# Checklista audytu: 14 kategorii, mapowanie severity i pokrycie regułami strażnika

> Skondensowana lista kontrolna dla agentów audytu (`.claude/agents/*`, workflow `/ui-audit`) na stack
> **Vite 7 + React 19.2 + react-router 7.18 + Tailwind v4 + prerender**. Źródła: `research/vercel.md` §3–§10
> (analiza skilli `react-best-practices`, `composition-patterns`, `react-view-transitions`,
> `web-design-guidelines`, `writing-guidelines`, stan 2026-09-11), `references/wig-command.md`,
> `references/writing-command.md` (kopie lokalne, bez WebFetch), `rules/*.md`.
>
> Konwencja ID: `[źródło:id]`, gdzie źródło ∈ `RBP` (react-best-practices), `CP` (composition-patterns),
> `VT` (react-view-transitions), `WIG` (web-interface-guidelines), `WG` (writing-guidelines), `KL` (reguła własna Klarow).
> **Reguła z `rules/` zawsze wygrywa z regułą źródłową.** Ta checklista jest siatką pokrycia i listą rzeczy,
> których nie mamy jeszcze w `rules/` — nie jest źródłem prawa.
>
> Kolejność pracy: bramki skryptowe (`audit-static.mjs`, `find-integrations.mjs`, `check-secrets.mjs`,
> `tsc`, `npm run build`, `verify-site.mjs`) → agenci read-only z tą checklistą → weryfikacja adwersaryjna
> HIGH/BLOCKER → raport w formacie z §6.
>
> **Istnieją dokładnie te skrypty:** `audit-static.mjs`, `verify-site.mjs`, `find-integrations.mjs`,
> `check-secrets.mjs`, `build-index.mjs`, `screenshots.mjs`, `hook-post-edit.mjs`, `hook-pre-tool.mjs`.
> Linia testu w `rules/*.md` poprzedzona **`# PLANOWANE (F3, …)`** albo **`# DOCELOWO (skrypt planowany…)`**
> (dwa zapisy, to samo znaczenie) to bramka, której NIE MA
> (brakujący skrypt albo tryb, którego `verify-site.mjs` nie parsuje). Takiej linii nie uruchamiamy
> i nie wolno jej zielonego wyniku traktować jako dowodu — obok każdej stoi działający grep albo
> obsługiwane wywołanie. `verify-site.mjs` przyjmuje wyłącznie: `--dist`, `--expected`,
> `--min-tool-links`, `--budget`, `--json`, `--quiet`, `--fail-on`, `--write-baseline`, `--help`; nieznaną flagę
> **ignoruje po cichu** (pozycja otwarta: ma kończyć `exit 2`).

---

## 1. Bilans reguł `react-best-practices` dla naszego stacku (zbiór źródłowy: 70 reguł)

Nasz bilans: **✅ 45 · 🔁 10 · ⚠️ 3 · ❌ 11 = 69 przypisanych pozycji**. Bilans w `vercel.md` l. 308 podaje
„❌ 12", bo liczy `server-hoist-static-io` dwa razy: w §3 tamtego dokumentu reguła jest oznaczona 🔁
(dotyczy `prerender.mjs`) i mimo to wchodzi do kubełka ❌. U nas zostaje wyłącznie w §1.2. Różnica
70 − 69 = jedna reguła RBP bez przypisania w źródle — do uzupełnienia przy najbliższym przeglądzie
`vercel.md`; nie zgłaszamy jej, dopóki nie wiadomo, która to. Legenda: ✅ dotyczy wprost · 🔁 dotyczy po przekładzie
Next → Vite · ⚠️ dotyczy warunkowo (tylko gdy wzorzec pojawi się w kodzie) · ❌ nie dotyczy.

### 1.1 ✅ 45 reguł dotyczących wprost (audytujemy zawsze)

- **`async-`** (1): `async-parallel`.
- **`bundle-`** (3): `bundle-analyzable-paths`, `bundle-conditional`, `bundle-preload`.
- **`client-`** (2): `client-passive-event-listeners`, `client-localstorage-schema`.
- **`rerender-`** (15, cała sekcja 5): `rerender-derived-state-no-effect`, `rerender-defer-reads`,
  `rerender-simple-expression-in-memo`, `rerender-no-inline-components`, `rerender-memo-with-default-value`,
  `rerender-memo`, `rerender-dependencies`, `rerender-move-effect-to-event`, `rerender-split-combined-hooks`,
  `rerender-derived-state`, `rerender-functional-setstate`, `rerender-lazy-state-init`, `rerender-transitions`,
  `rerender-use-deferred-value`, `rerender-use-ref-transient-values`.
- **`rendering-`** (6): `rendering-animate-svg-wrapper`, `rendering-content-visibility`, `rendering-hoist-jsx`,
  `rendering-svg-precision`, `rendering-activity`, `rendering-conditional-render`.
- **`js-`** (14, cała sekcja 7): `js-batch-dom-css`, `js-index-maps`, `js-cache-property-access`,
  `js-cache-function-results`, `js-cache-storage`, `js-combine-iterations`, `js-request-idle-callback`,
  `js-length-check-first`, `js-early-exit`, `js-hoist-regexp`, `js-flatmap-filter`, `js-min-max-loop`,
  `js-set-map-lookups`, `js-tosorted-immutable`.
- **`advanced-`** (4, cała sekcja 8): `advanced-effect-event-deps`, `advanced-init-once`,
  `advanced-event-handler-refs`, `advanced-use-latest`.

### 1.2 🔁 10 reguł po przekładzie Next → Vite

| RBP | Przekład na nasz stack |
|---|---|
| `async-suspense-boundaries` | Suspense wokół lazy-chunków (`GLSLHills`, dashboardy), nigdy wokół treści SEO z shella prerenderu |
| `bundle-barrel-imports` | `lucide-react` zostaje (Rollup tree-shake; koszt tylko w dev boot) — u nas LOW; flagujemy `lodash`, `date-fns`, `react-icons` |
| `bundle-dynamic-imports` | `next/dynamic` → `React.lazy` + `Suspense` (pdfmake, three, 12 dashboardów) |
| `bundle-defer-third-party` | analityka po hydracji / `requestIdleCallback`, nigdy w bundlu głównym |
| `server-hoist-static-io` | dotyczy wyłącznie `site/scripts/prerender.mjs`: szablon HTML czytany raz, nie per trasa |
| `client-event-listeners` | bez SWR: moduł-level `Set` subskrybentów (`useAnimatedBg`, `resize`, skróty klawiszowe) |
| `rendering-hydration-no-flicker` | język z `localStorage` ustawiany inline-skryptem przed pierwszym renderem (`i18n-lang-before-paint`) |
| `rendering-hydration-suppress-warning` | tylko tam, gdzie różnica jest oczekiwana (daty w modalu rezerwacji) |
| `rendering-script-defer-async` | `site/index.html`: skrypt samonaprawy inline, Vite wstawia `type="module"` (= deferred) |
| `rendering-resource-hints` | API `react-dom` → `<link rel="preload" as="font">` i `fetchpriority` w `index.html` (wspólny szablon 19 HTML) |

### 1.3 ⚠️ 3 reguły warunkowe

`async-cheap-condition-before-await`, `async-defer-await`, `async-dependencies` — dziś tylko `lib/pdf.ts`
(lazy pdfmake); dema nie mają I/O ani sieci (`demo-determinism`). Wracają, gdy pojawi się fetch.

### 1.4 ❌ 11 reguł niedotyczących (imiennie — nie zgłaszamy ich nigdy)

Sekcja 3 `server-` (Next RSC / Server Actions / runtime serwerowy, którego nie mamy — hosting to
statyczne Cloudflare Pages) **bez `server-hoist-static-io`, która jest w §1.2 (🔁, dotyczy
`scripts/prerender.mjs`) i nie jest liczona drugi raz tutaj**:
1. `server-auth-actions` — auth i authz wewnątrz Server Action,
2. `server-dedup-props` — serializacja RSC po referencji,
3. `server-no-shared-module-state` — mutowalny stan modułu między requestami,
4. `server-cache-lru` — LRU między requestami,
5. `server-serialization` — przekazywanie tylko używanych pól do client component,
6. `server-parallel-fetching` — kompozycja rodzeństwa RSC,
7. `server-parallel-nested-fetching` — `Promise.all` po zagnieżdżonych fetchach,
8. `server-cache-react` — `React.cache()` per request,
9. `server-after-nonblocking` — `after()` na pracę po odpowiedzi,
10. `async-api-routes` (1.4) — API routes / Server Actions,
11. `client-swr-dedup` (4.3) — SWR do deduplikacji fetchy (nie dodajemy zależności; brak fetchy).

**Uwaga na przyszłość:** `server-auth-actions`, `server-no-shared-module-state` i `server-after-nonblocking`
(`ctx.waitUntil`) wracają jako obowiązujące, jeśli powstanie Cloudflare Worker albo Pages Function
(`post-bot/`, endpoint zdarzeń, formularz PKE) — izolaty współdzielą moduł między requestami.

---

## 2. Mapowanie impact Vercel → severity strażnika

| Nasza severity | Znaczenie | Mapowanie z `impact` Vercela | Blokuje commit / push? |
|---|---|---|---|
| **BLOCKER** | twarda zasada CLAUDE.md albo prawo: nazwa poprzedniej firmy, złoto `#FFA914`, logo graficzne, sekrety, determinizm dem, reduced-motion, `/rodo`, PKE, dane osobowe w repo. **Severity a11y bierzemy z pliku reguły, nie stąd** — brak etykiety i brak obsługi klawiatury to HIGH (`a11y-form-labels-errors`, `a11y-controls-native`), bo tak rozstrzygają nowsze, szczegółowe reguły | — (własne; Vercel nie ma tego poziomu) | TAK |
| **HIGH** | realny, mierzalny efekt dla użytkownika, SEO albo bundla | CRITICAL, HIGH | TAK dla nowych plików; istniejący dług = ticket w „Otwarte" |
| **MEDIUM** | poprawność i utrzymywalność bez natychmiastowego efektu | MEDIUM-HIGH, MEDIUM | NIE (raport) |
| **LOW** | mikro-optymalizacja, styl, typografia | LOW-MEDIUM, LOW | NIE (raport) |

**Zasada „impact Vercela ≠ nasza severity".** Mapowanie jest domyślne, każda reguła w `rules/` może je nadpisać
i wtedy obowiązuje wersja z `rules/`. Przykłady rozjazdu:

| Reguła | Vercel | U nas | Powód |
|---|---|---|---|
| `RBP:bundle-barrel-imports` | CRITICAL (cold start serverless) | **LOW** (`code-no-barrel-imports`) | Rollup tree-shake w buildzie, brak serwera; koszt tylko w dev |
| `RBP:js-tosorted-immutable` | LOW-MEDIUM | **HIGH** (`code-tosorted-safari13`) | `build.target safari13`: `toSorted` nie jest polyfillowany, kod pada na starszym Safari |
| `WIG:motion-reduced` | (bez skali) | **BLOCKER** (`motion-reduced-motion-three-layers`) | CLAUDE.md zasada 2 |
| `WIG:type-quotes`, `type-ellipsis` | LOW | **HIGH** w PL (`i18n-pl-typography`) | typografia PL jest częścią marki i wchodzi do meta oraz PDF |
| `WG:copy-headings-sentence-case` | MEDIUM | **MEDIUM** (`i18n-sentence-case-headings`) | ale z odwrotnym rozstrzygnięciem niż Vercel dla nav labels (sentence case wszędzie) |
| `RBP:server-*` | HIGH | **nie dotyczy** | brak runtime serwerowego |

---

## 3. Checklista: 14 kategorii

Skróty w kolumnie „Reguła": plik w `rules/` bez rozszerzenia. Pusto = reguła audytowana wyłącznie z tej
checklisty (raport, bez blokowania) — lista zbiorcza w §3.15.

### 3.1 `A-REN` rendering i perf renderu

| ID | Co sprawdzić | Sev | Jak wykryć | Reguła |
|---|---|---|---|---|
| `A-REN-01` | zero komponentów definiowanych wewnątrz komponentów (remount, utrata fokusa) `[RBP:rerender-no-inline-components]` | HIGH | `function [A-Z]` / `const [A-Z]\w* = \(` w ciele komponentu | `code-effects-hygiene` |
| `A-REN-02` | wartości pochodne liczone w renderze, nie `useState` + `useEffect` `[RBP:rerender-derived-state-no-effect]` | MEDIUM | `set\w+\(` w `useEffect` zależnym tylko od props | `code-effects-hygiene` |
| `A-REN-03` | logika akcji użytkownika w handlerze, nie w efekcie `[RBP:rerender-move-effect-to-event]` | MEDIUM | `useState(false)` + `useEffect(if(flag))` | `code-effects-hygiene` |
| `A-REN-04` | `setX(curr => …)` gdy nowy stan zależy od starego `[RBP:rerender-functional-setstate]` | MEDIUM | `setX([...x`, `setX(x.filter` | `code-effects-hygiene` |
| `A-REN-05` | deps prymitywne, nie obiekty `[RBP:rerender-dependencies]` | LOW | `}, [obj])` przy użyciu `obj.id` | `code-effects-hygiene` |
| `A-REN-06` | `useMemo` tylko dla drogiej pracy, osobne hooki dla niezależnych deps `[RBP:rerender-simple-expression-in-memo, split-combined-hooks, memo-with-default-value]` | LOW | `useMemo(() => a \|\| b` | `code-memo-policy` |
| `A-REN-07` | `useState(() => …)` dla `JSON.parse` / storage `[RBP:rerender-lazy-state-init]` | MEDIUM | `useState(JSON.parse(`, `useState(localStorage` | — |
| `A-REN-08` | `startTransition` / `useDeferredValue` przy suwaku, filtrze, szukajce `[RBP:rerender-transitions, use-deferred-value]` | MEDIUM | `setState` w `onScroll`/`onPointerMove`; `items.filter(… query` w renderze | — |
| `A-REN-09` | wartości per-klatkę przez `useRef` + DOM, nie `useState` `[RBP:rerender-use-ref-transient-values]` | HIGH | `setState` w `mousemove`/rAF | `motion-gpu-props-only` |
| `A-REN-10` | zero odczytów layoutu w renderze; batch odczyt/zapis `[RBP:js-batch-dom-css, WIG:perf-no-layout-reads]` | HIGH | `getBoundingClientRect\|offsetWidth\|offsetHeight\|scrollTop` poza `useEffect`/rAF | `perf-no-zoom-root` |
| `A-REN-11` | `cond ? <X/> : null` zamiast `n && <X/>` `[RBP:rendering-conditional-render]` | MEDIUM | `\.length && <` | — |
| `A-REN-12` | `content-visibility: auto` na długich listach i sekcjach poniżej folda `[RBP:rendering-content-visibility, WIG:perf-virtualize]` | MEDIUM | `.map(` > 50 wierszy bez wirtualizacji | `perf-code-split-dashboards` |
| `A-REN-13` | statyczny JSX i duże SVG jako stała modułu; animujemy `<div>` wokół SVG `[RBP:rendering-hoist-jsx, animate-svg-wrapper]` | LOW | inline `<svg>` w renderze, `<svg className="animate-` | `motion-gpu-props-only` |
| `A-REN-14` | inline-skrypt ustawia język przed pierwszym malowaniem `[RBP:rendering-hydration-no-flicker]` | HIGH | `localStorage` w `useState`/`useEffect` wpływające na pierwszy render | `i18n-lang-before-paint` |
| `A-REN-15` | determinizm silników: zero `Date.now`, `new Date()`, `Math.random`, sieci `[KL:determinism]` | BLOCKER | grep w `lib/**`, `dashboards/**` | `demo-determinism` |
| `A-REN-16` | zero błędów i ostrzeżeń runtime w konsoli na 5 trasach (WebKit, z JS i bez) `[KL:no-runtime-errors]` | BLOCKER | konsola w Playwright; error boundary wokół tła | `code-no-runtime-errors` |

### 3.2 `A-BUN` bundle

| ID | Co sprawdzić | Sev | Jak wykryć | Reguła |
|---|---|---|---|---|
| `A-BUN-01` | ciężkie moduły (three, pdfmake, 12 dashboardów) przez `lazy()` + `Suspense` `[RBP:bundle-dynamic-imports]` | HIGH | statyczny `import` modułu > 50 KB gz w pliku trasy | `code-lazy-routes-and-dashboards`, `perf-code-split-dashboards` |
| `A-BUN-02` | moduły ładowane po aktywacji; guard `typeof window` dla buildu SSR prerenderu `[RBP:bundle-conditional]` | HIGH | `import("three")` poza guardem | `motion-no-motion-in-prerender` |
| `A-BUN-03` | mapy `{slug: () => import("./x")}`, nigdy `import(\`./${x}\`)` `[RBP:bundle-analyzable-paths]` | MEDIUM | template literal w `import(` | `code-lazy-routes-and-dashboards` |
| `A-BUN-04` | preload chunku na hover/focus `[RBP:bundle-preload]` | LOW | `Link` do `/narzedzia/:slug` bez `onMouseEnter`/`onFocus` | — |
| `A-BUN-05` | analityka i skrypty trzecie po hydracji `[RBP:bundle-defer-third-party]` | MEDIUM | `import` analityki w `main.tsx` | `legal-analytics-cookieless-or-consent` |
| `A-BUN-06` | barrel-files: `lodash`, `date-fns`, `react-icons` zakazane; `lucide-react` OK `[RBP:bundle-barrel-imports]` | LOW | `from "lodash"` | `code-no-barrel-imports` |
| `A-BUN-07` | budżety: JS krytyczny `/` ≤ 175 KB gz (zapas 35 KB znakowany na warstwę scroll-narracyjną), chunk Motion ≤ 35 KB gz, CSS ≤ 20 KB `[KL:bundle-budget]` | HIGH | `verify-site.mjs` (gzip level 9) | `perf-js-budget-home`, `perf-chunk-size-gate`, `motion-bundle-budget-motion` |
| `A-BUN-08` | zgodność z `build.target es2019/safari13` `[KL:build-target]` | HIGH | grep `toSorted`, `\.at(`, `structuredClone`, `findLast`, `Object.hasOwn`, `color-mix`, `oklch` | `code-tosorted-safari13`, `perf-build-target`, `code-build-target-policy` |

### 3.3 `A-HOO` hooki i cykl życia

| ID | Co sprawdzić | Sev | Reguła |
|---|---|---|---|
| `A-HOO-01` | `{ passive: true }` na `scroll`, `wheel`, `touchstart` bez `preventDefault` `[RBP:client-passive-event-listeners]` | MEDIUM | — |
| `A-HOO-02` | jeden globalny listener na N instancji (moduł-level `Set`) `[RBP:client-event-listeners]` | LOW | — |
| `A-HOO-03` | klucz `localStorage` z wersją (`klarow:<name>:v1`), minimalne pola, zawsze `try/catch` `[RBP:client-localstorage-schema]` | LOW | `legal-analytics-cookieless-or-consent` (zakaz identyfikatorów) |
| `A-HOO-04` | `useEffectEvent` dla stabilnych subskrypcji; nigdy w deps `[RBP:advanced-*]` | LOW | `code-effects-hygiene` |
| `A-HOO-05` | init aplikacji z guardem modułowym, nie `useEffect([])` (StrictMode = 2×) `[RBP:advanced-init-once]` | LOW | `code-effects-hygiene` |
| `A-HOO-06` | każdy rAF, WebGL, timer, observer: cleanup, pauza na `document.hidden`, brak canvasu na `pointer: coarse` `[KL:raf-hygiene]` | BLOCKER | `motion-cleanup-required`, `perf-no-webgl-on-coarse`, `perf-three-js-policy` |
| `A-HOO-07` | `ref` jako prop, `use(Ctx)` zamiast `useContext` `[CP:react19-no-forwardref]` | MEDIUM | `code-no-forwardref-react19`, `code-use-not-usecontext` |

### 3.4 `A-COM` kompozycja

| ID | Co sprawdzić | Sev | Reguła |
|---|---|---|---|
| `A-COM-01` | ≥ 3 boolean props sterujące strukturą → jawne warianty `[CP:architecture-avoid-boolean-props]` | HIGH | `code-file-size-cap` (kontekst) |
| `A-COM-02` | wspólny shell dashboardu jako compound (`Dashboard.Frame/.Kpis/.Table/.Proof/.Actions`) `[CP:architecture-compound-components]` | MEDIUM | — |
| `A-COM-03` | `ToolCardDemo` / `ToolCardCase` zamiast `if (kind)` w JSX `[CP:patterns-explicit-variants]` | MEDIUM | — |
| `A-COM-04` | `children` zamiast `renderX` (poza `renderItem`) `[CP:patterns-children-over-render-props]` | LOW | — |
| `A-COM-05` | stan współdzielony w Providerze; zero `useEffect` syncującego w górę i zero „ref do odczytu przy submit" `[CP:state-lift-state]` | MEDIUM | `code-effects-hygiene` |
| `A-COM-06` | kontekst jako `{ state, actions, meta }`; UI nie zna źródła stanu `[CP:state-context-interface, state-decouple-implementation]` | LOW | — |
| `A-COM-07` | plik komponentu ≤ 300 linii `[KL:file-size]` | MEDIUM | `code-file-size-cap` |
| `A-COM-08` | jedno źródło copy i kontaktu (`data/*.ts`), zero duplikatów w shellu prerenderu | HIGH | `code-single-source-copy`, `code-contact-single-source` |
| `A-COM-09` | zero martwego kodu: plik bez importera, zależność bez importu, nieaktualny komentarz | MEDIUM | `code-no-dead-code` |
| `A-COM-10` | zero kolorów i rozmiarów inline oraz arbitralnych wartości Tailwinda (`text-[13px]`, `from-[#…]`) | HIGH | `code-no-inline-style-colors`, `code-no-arbitrary-tailwind-values` |
| `A-COM-11` | bramka przed pushem zielona: tsc, ESLint, golden-testy, build, `verify-site.mjs`, `audit-static.mjs` | BLOCKER | `code-lint-and-tests-gate` |

### 3.5 `A-A11` dostępność

| ID | Co sprawdzić | Sev | Reguła |
|---|---|---|---|
| `A-A11-01` | `aria-label` na przyciskach ikonowych `[WIG:a11y-icon-button-label]` | HIGH | `a11y-images-alt-svg-role` |
| `A-A11-02` | każda kontrolka ma `<label>` albo `aria-label`; błędy inline z fokusem `[WIG:a11y-form-label, form-errors-inline-focus]` | HIGH | `a11y-form-labels-errors` |
| `A-A11-03` | `<button>` dla akcji, `<a>`/`<Link>` dla nawigacji; zero `<div onClick>` i `navigate()` w `onClick` `[WIG:a11y-semantic, nav-real-links]` | HIGH | `a11y-controls-native` |
| `A-A11-04` | widoczny fokus wszędzie, `:focus-visible`, nigdy `outline: none` bez zamiennika; sticky nie zasłania fokusa `[WIG:focus-visible, focus-not-covered]` | HIGH | `a11y-focus-visible-everywhere`, `design-sticky-opaque` |
| `A-A11-05` | jeden `<h1>` na trasę, hierarchia bez przeskoków, skip-link, `scroll-margin-top` na kotwicach `[WIG:a11y-headings-skiplink, a11y-scroll-margin]` | HIGH | `a11y-headings-order-one-h1`, `a11y-main-and-skip-link` |
| `A-A11-06` | obrazy z `alt` (albo `alt=""`), ikony `aria-hidden`, SVG z danymi `role="img"` `[WIG:a11y-img-alt, a11y-decorative-hidden]` | HIGH | `a11y-images-alt-svg-role` |
| `A-A11-07` | dialog: `<dialog>` albo `role="dialog" aria-modal`, focus-trap, zwrot fokusu, Esc, `overscroll-behavior: contain` `[WIG:touch-overscroll-contain]` | HIGH | `a11y-dialog-semantics`, `a11y-touch-targets-44` |
| `A-A11-08` | zamknięte menu przez `inert`/`hidden`, nie `opacity-0 + pointer-events-none` | HIGH | `a11y-inert-hidden-menus` |
| `A-A11-09` | kontrast: tekst ≥ 4,5:1, elementy UI i obrysy ≥ 3:1, tekst na wideo na najjaśniejszej klatce | HIGH | `a11y-contrast`, `design-contrast-aa` |
| `A-A11-10` | cele dotykowe ≥ 44 × 44 px, `touch-action: manipulation`, `-webkit-tap-highlight-color` ustawiony `[WIG:touch-*]` | MEDIUM | `a11y-touch-targets-44` |
| `A-A11-11` | `color-scheme` na `<html>`, `<meta name="theme-color">` zgodny z tłem, `<select>` z jawnym kolorem `[WIG:dark-*]` | MEDIUM | `design-page-theme-lock`, `design-light-ready-tokens` |
| `A-A11-12` | bez przewijania poziomego na 390 px, `100dvh` z fallbackiem, `env(safe-area-inset-*)` `[WIG:layout-*]` | HIGH | `a11y-safe-area-dvh`, `design-overflow-rules` |
| `A-A11-13` | akordeon (FAQ, panel filtrów) z `aria-expanded` + `aria-controls`; odpowiedź zawsze w DOM | MEDIUM | `a11y-faq-aria-controls` |
| `A-A11-15` | komunikaty asynchroniczne (toast, stan ładowania dema, PASS/FAIL rekoncyliacji, liczba wyników filtra) w regionie `role="status"` + `aria-live="polite"`, obecnym w DOM od pierwszego renderu `[WIG:a11y-async-live]` | MEDIUM | `a11y-form-labels-errors` (p. 12) |
| `A-A11-14` | zero `title` jako tooltipa `[WIG:a11y-*]` | LOW | `a11y-no-title-tooltips` |

### 3.6 `A-UX` interakcja i nawigacja

| ID | Co sprawdzić | Sev | Reguła |
|---|---|---|---|
| `A-UX-01` | stan nawigacyjny (dział hubu, zakładka, rozwinięty panel) w URL `[WIG:nav-url-state]` | MEDIUM | `code-state-in-url` |
| `A-UX-02` | linki jako `<a>`/`<Link>` (Cmd-klik, środkowy przycisk) `[WIG:nav-real-links]` | HIGH | `a11y-controls-native`, `seo-links-in-dom` |
| `A-UX-03` | akcje destrukcyjne z potwierdzeniem albo cofnięciem (CRUD w rejestrze umów) `[WIG:nav-destructive-confirm]` | MEDIUM | — |
| `A-UX-04` | stany hover/active/focus wyraźniejsze niż spoczynek; hover bez skoku layoutu i z fallbackiem dla dotyku `[WIG:hover-*]` | MEDIUM | `motion-hover-fallback` |
| `A-UX-05` | długie treści: `truncate`/`line-clamp`, `min-w-0` w gridach, stany puste `[WIG:content-*]` | MEDIUM | `design-overflow-rules` |
| `A-UX-06` | obrazy z jawnymi `width`/`height`, `loading="lazy"` poniżej folda, `fetchpriority="high"` dla LCP `[WIG:img-*]` | HIGH | `perf-images-policy`, `perf-lcp-poster-preload` |
| `A-UX-07` | wideo zamiast GIF-a: `muted playsInline loop preload=metadata poster`, alternatywa statyczna `[WIG:video-*]` | HIGH | `media-video-embed-spec`, `media-video-gating`, `media-poster-first-frame` |
| `A-UX-08` | jeden primary CTA na ekran, jedna etykieta na intencję | HIGH | `design-one-cta-per-screen`, `copy-cta-labels` |
| `A-UX-09` | hydration: input z `value` ma `onChange` (albo `defaultValue`), daty pod kontrolą `[WIG:hydration-*]` | MEDIUM | — |

### 3.7 `A-FRM` formularze

| ID | Co sprawdzić | Sev | Reguła |
|---|---|---|---|
| `A-FRM-01` | `autocomplete` i sensowny `name`; `type` + `inputmode` (`email`, `tel`, `url`, `number`) `[WIG:form-autocomplete-name, form-type-inputmode]` | HIGH | `a11y-form-labels-errors` |
| `A-FRM-02` | nigdy nie blokujemy wklejania (`onPaste` + `preventDefault`) `[WIG:form-no-paste-block]` | HIGH | `a11y-form-labels-errors` |
| `A-FRM-03` | etykieta klikalna, checkbox i etykieta w jednym celu, bez martwych stref `[WIG:form-label-clickable, form-hit-target]` | HIGH | `a11y-form-labels-errors`, `a11y-touch-targets-44` |
| `A-FRM-04` | `spellCheck={false}` na mailach, kodach, identyfikatorach `[WIG:form-spellcheck-off]` | LOW | — |
| `A-FRM-05` | przycisk wysyłki aktywny do startu żądania, potem stan pracy z wielokropkiem `[WIG:form-submit-enabled]` | MEDIUM | `i18n-pl-typography` (PL: „Wysyłam…") |
| `A-FRM-06` | placeholder kończy się wielokropkiem i pokazuje wzór; nie zastępuje etykiety `[WIG:form-placeholder-ellipsis]` | LOW | `a11y-form-labels-errors` |
| `A-FRM-07` | ostrzeżenie przed opuszczeniem formularza z niezapisanymi zmianami `[WIG:form-unsaved-guard]` | LOW | — |
| `A-FRM-08` | **zgody: zero `checked`/`defaultChecked`, osobna zgoda na kanał, treść zgody z `data/consent.ts` z wersją** `[KL]` | BLOCKER | `legal-pke-consent-forms` |
| `A-FRM-09` | formularz nie wysyła danych do obcego hosta bez rejestru, `/rodo` i CSP `[KL]` | HIGH | `legal-privacy-before-embeds`, `integ-registry-required` |

### 3.8 `A-TYP` typografia i copy

| ID | Co sprawdzić | Sev | Reguła |
|---|---|---|---|
| `A-TYP-01` | `…` zamiast trzech kropek; stany ładowania z wielokropkiem `[WIG:type-ellipsis, type-loading-ellipsis]` | HIGH (PL) | `i18n-pl-typography` |
| `A-TYP-02` | cudzysłowy PL „ " i EN “ ”, zero prostych w treści `[WIG:type-quotes]` | HIGH (PL) | `i18n-pl-typography` |
| `A-TYP-03` | zero pauzy „—"; półpauza tylko w zakresach liczbowych `[WG:punctuation]` (nadpisuje Vercela: my dopuszczamy „–" w zakresach) | HIGH | `i18n-pl-typography` |
| `A-TYP-04` | twarde spacje: jednostki, spójniki jednoliterowe, wordmark `[WIG:type-nbsp]` | LOW | `i18n-pl-typography` |
| `A-TYP-05` | `tabular-nums` w KPI, tabelach i kwotach; kwoty `nowrap` `[WIG:type-tabular-nums]` | MEDIUM | `demo-money-integers`, `design-overflow-rules` |
| `A-TYP-06` | `text-wrap: balance` na nagłówkach `[WIG:type-balance]` | LOW | `design-typography-scale` |
| `A-TYP-07` | pisownia zdaniowa nagłówków i etykiet w PL i EN `[WG:headings]` (odstępstwo od Title Case Vercela) | MEDIUM | `i18n-sentence-case-headings` |
| `A-TYP-08` | strona czynna, druga osoba, zero pytań retorycznych, zero banned words `[WG:voice, banned-words]` | MEDIUM | `copy-voice-and-tone` |
| `A-TYP-09` | zero tells generatora (streszczenia poprzedniego akapitu, głos katalogu, personifikacja) `[WG:ai-tells]` | MEDIUM | `copy-voice-and-tone` |
| `A-TYP-10` | każda liczba rynkowa ze źródłem i rokiem; zakaz „Deloitte/IDC" `[WG:concision + KL]` | HIGH | `legal-sources-for-market-numbers`, `copy-numbers-with-source` |
| `A-TYP-11` | minimum tekstu: lead ≤ 20 słów, nagłówek ≤ 6 słów, karta 2–6 słów | HIGH | `copy-minimal-text`, `design-hero-discipline` |
| `A-TYP-12` | zero słowa „AI" w sprzedaży, zero nazw dostawców modeli (jedyny wyjątek: odpowiedź FAQ „Czy AI liczy moje dane?") | BLOCKER | `brand-no-ai-word-in-sales` |

### 3.9 `A-MOT` ruch i media

| ID | Co sprawdzić | Sev | Reguła |
|---|---|---|---|
| `A-MOT-01` | `prefers-reduced-motion` w trzech warstwach (MotionConfig, `useReducedMotion`, CSS) `[WIG:motion-reduced, VT:reduced-motion]` | BLOCKER | `motion-reduced-motion-three-layers`, `a11y-reduced-motion-media-query` |
| `A-MOT-02` | animujemy tylko `transform`, `opacity`, `clipPath`, wyjątkowo `filter` `[WIG:motion-transform-opacity]` | HIGH | `motion-gpu-props-only` |
| `A-MOT-03` | zero `transition: all` i krzywych `linear`/`ease-in-out` na interakcjach `[WIG:motion-no-transition-all]` | HIGH | `motion-no-transition-all-no-linear` |
| `A-MOT-04` | `transform-origin` ustawiony; SVG animowany na `<g>` z `transform-box: fill-box` `[WIG:motion-origin, motion-svg-g]` | MEDIUM | `motion-tokens-only` |
| `A-MOT-05` | animacje przerywalne; VT nigdy na elementach interaktywnych `[WIG:motion-interruptible]` | HIGH | `motion-view-transition-rules` |
| `A-MOT-06` | pętla > 5 s obok treści ma pauzę albo ukrycie; jedno autoplay na trasę `[WIG:motion-autoplay-controls]` | HIGH | `media-one-autoplay-per-route`, `media-video-gating` |
| `A-MOT-07` | animacja nazywa relację (shared / reveal / list / state / route); brak zdania motywacji = brak animacji `[VT:motion-communicates]` | MEDIUM | `motion-motivated` |
| `A-MOT-08` | budżety czasu: trasa ≤ 250 ms, reveal ≤ 400 ms, toggle ≤ 200 ms, morph ≤ 500 ms `[VT:motion-timing-budget]` | MEDIUM | `motion-tokens-only`, `motion-stagger-caps` |
| `A-MOT-09` | navbar, stopka i toasty nie animują się razem ze stroną `[VT:motion-chrome-isolated]` | MEDIUM | `motion-view-transition-rules` |
| `A-MOT-10` | narzędzie: wykres statyczny, reveal panelu raz ≤ 450 ms, zero „rysowania"; marketing: budowanie wykresu wolno TYLKO postępem scrolla, na właściwościach akcelerowanych, z reduced-motion w stanie końcowym `[KL:charts-static]` | BLOCKER | `motion-charts-static` |
| `A-MOT-11` | tła tylko canvas/WebGL z pauzą na `document.hidden` i cleanupem; zero na `pointer: coarse` `[KL:gpu-bg-hygiene]` | BLOCKER | `perf-no-webgl-on-coarse`, `motion-cleanup-required` |
| `A-MOT-12` | zero scroll-hijacku, parallaxu, marquee, karuzel i własnego kursora; sceny sticky ≤ 2 na trasę, ≤ 300vh, z gałęzią reduced-motion (`height: auto` + stan końcowy) | BLOCKER | `motion-no-pinning-no-scroll-hijack` |
| `A-MOT-13` | treść z shella prerenderu nie startuje ukryta (`initial={false}` nad foldem) | BLOCKER | `motion-no-initial-hidden-above-fold` |

### 3.10 `A-I18` PL + EN

| ID | Co sprawdzić | Sev | Reguła |
|---|---|---|---|
| `A-I18-01` | każdy string UI to `{ pl, en }` + `pick()`; zero gołych stringów w JSX `[KL:i18n-pair]` | HIGH | `i18n-pl-en-pair-required` |
| `A-I18-02` | daty i liczby przez `Intl.*` z jednym helperem `[WIG:i18n-intl-*]` | MEDIUM | `demo-money-integers` |
| `A-I18-03` | `translate="no"` na `KLAROW`, `KSeF`, `G703`, identyfikatorach `[WIG:i18n-translate-no]` | LOW | `i18n-pl-typography` |
| `A-I18-04` | język z wyboru użytkownika i `navigator.languages`, nigdy z IP `[WIG:i18n-lang-detect]` | LOW | `i18n-lang-before-paint` |
| `A-I18-05` | brak mignięcia PL → EN przy starcie (inline-skrypt przed renderem) `[RBP:rendering-hydration-no-flicker]` | HIGH | `i18n-lang-before-paint` |
| `A-I18-06` | title i description PL + EN w `pagesSeo.ts` / `toolsSeo.ts`, identyczne dla klienta i prerenderu `[KL:seo-pair]` | HIGH | `seo-pageseo-single-source`, `seo-toolsseo-required-for-new-slug` |
| `A-I18-07` | hreflang i trasy `/pl/ /en/` odroczone: nie dodawać hreflang do jednego URL | MEDIUM | `seo-hreflang-deferred` |

### 3.11 `A-SEO` prerender, sitemap, dane strukturalne

| ID | Co sprawdzić | Sev | Reguła |
|---|---|---|---|
| `A-SEO-01` | 19 statycznych HTML, każdy z pełną treścią w `#root`, `<main id="main">`, 1 `<h1>` i `id="seo-jsonld"` dokładnie raz | BLOCKER | `seo-prerender-must-keep` |
| `A-SEO-02` | `sitemap.xml` i `llms.txt` generowane w buildzie; zero ręcznego `public/sitemap.xml`; 17 `<loc>` (bez `404` i bez `/rodo`, dopóki ma `noindex`) | BLOCKER | `seo-sitemap-llms-generated` |
| `A-SEO-03` | hub: ≥ 13 `<a href="/narzedzia/<slug>">` w shellu i w DOM po JS; home linkuje 4 realizacje + huby; filtr ukrywa `hidden`, nie odmontowuje | BLOCKER | `seo-links-in-dom`, `code-state-in-url` |
| `A-SEO-04` | każdy alias 301/302 jednocześnie w `_redirects` i w `references/redirects-registry.md`; zmiana sluga tylko z 301 | BLOCKER | `seo-redirects-registry` |
| `A-SEO-05` | trasa `/rodo` istnieje i jest prerenderowana, link „RODO i prywatność" w stopce KAŻDEJ trasy, alias `/polityka-prywatnosci` 301 | BLOCKER | `legal-rodo-page-required` |
| `A-SEO-06` | JSON-LD per rodzaj trasy (Organization / FAQPage / SoftwareApplication), parsuje się, pokryty dosłownie treścią DOM | HIGH | `seo-jsonld-per-kind`, `copy-faq-single-source` |
| `A-SEO-07` | canonical bez `www` i bez parametrów; `og:*` i `twitter:*` w shellu, nie tylko klientowo | HIGH | `seo-canonical-og-twitter` |
| `A-SEO-08` | title ≤ 60 zn. (narzędzia ≤ 62), description 130–165 zn., PL + EN, jedno źródło `pagesSeo.ts` / `toolsSeo.ts`; nowy slug = komplet pól | HIGH | `seo-pageseo-single-source`, `seo-toolsseo-required-for-new-slug` |
| `A-SEO-09` | `404.html` z prawdziwym `noindex`, poza sitemapą; zero linków wewnętrznych do nieistniejących tras | MEDIUM | `seo-404-noindex-real-404` |
| `A-SEO-10` | `<lastmod>` z daty commitu pliku danych (`git log`), nigdy `Date.now()`; dwa buildy = identyczna sitemapa | MEDIUM | `seo-lastmod-from-git-not-now` |
| `A-SEO-11` | zero `hreflang` przy jednym URL (trasy `/pl/ /en/` odroczone); GSC i pomiar wyłącznie wg D-16 | MEDIUM | `seo-hreflang-deferred`, `seo-gsc-and-analytics` |

### 3.12 `A-BRD` marka, dowód, liczby

| ID | Co sprawdzić | Sev | Reguła |
|---|---|---|---|
| `A-BRD-01` | zero nazwy poprzedniej firmy i jej danych w `site/**`, `demo/**`, `ui-kit/**`, `dist/**` (case = „firma produkcyjno-budowlana") | BLOCKER | `brand-no-nuconic`, `copy-banned-claims` |
| `A-BRD-02` | zero złota `#FFA914`; jedyny akcent to stal `#A8B4C2` | BLOCKER | `brand-no-gold`, `brand-single-accent-steel` |
| `A-BRD-03` | zero słowa „AI" i nazw dostawców modeli w powierzchniach sprzedażowych (wyjątek: odpowiedź FAQ zaprzeczająca) | BLOCKER | `brand-no-ai-word-in-sales` |
| `A-BRD-04` | wordmark tekstowy `KLAROW`, płaski, bez logo graficznego i bez gradientu w tekście | HIGH | `brand-wordmark-only` |
| `A-BRD-05` | każda liczba widoczna w `dist` ma wpis w `references/allowed-numbers.md` i źródło z rokiem | HIGH | `brand-allowed-numbers-only`, `copy-numbers-with-source`, `legal-sources-for-market-numbers` |
| `A-BRD-06` | etykiety dowodu zgodne z `kind`; zero „u klientów" w liczbie mnogiej; zero „stała cena" jako tagu; zero kwot za usługi | BLOCKER | `brand-honest-labels`, `copy-banned-claims` |

### 3.13 `A-SEC` sekrety i wyciek danych

| ID | Co sprawdzić | Sev | Reguła |
|---|---|---|---|
| `A-SEC-01` | zero odczytu `.env`, `.dev.vars`, plików z kluczami — także „tylko żeby sprawdzić" | BLOCKER | `secret-never-read-env` |
| `A-SEC-02` | sekrety poza gitem: `git ls-files` bez `.env`, kluczy, `credentials`; skan historii przed upublicznieniem repo | BLOCKER | `secret-secrets-outside-git`, `secret-git-history-scan-before-public` |
| `A-SEC-03` | zero tokenów w promptach, logach, raportach, JSONL i wiadomościach między agentami | BLOCKER | `secret-no-secrets-in-prompts-or-logs` |
| `A-SEC-04` | ekspozycja klucza = rotacja przed dalszą pracą, nie „potem" | BLOCKER | `secret-rotate-on-exposure` |
| `A-SEC-05` | dane osobowe z researchu nie wchodzą do repo strony ani do narzędzi zewnętrznych; egress przez rejestr integracji | BLOCKER | `legal-no-scraped-personal-data-in-repo`, `integ-data-egress-review`, `integ-registry-required` |

### 3.14 `A-DEM` dema i silniki liczące

| ID | Co sprawdzić | Sev | Reguła |
|---|---|---|---|
| `A-DEM-01` | zero `Date.now`, `new Date()`, `Math.random`, sieci i I/O w `lib/**` i `dashboards/**` | BLOCKER | `demo-determinism` |
| `A-DEM-02` | golden-test per silnik: dwa przebiegi na tym samym wejściu = identyczny JSON | BLOCKER | `demo-golden-tests` |
| `A-DEM-03` | pieniądze jako liczby całkowite (grosze/centy), reszta alokacji na ostatniej pozycji, Σ co do grosza | HIGH | `demo-money-integers` |
| `A-DEM-04` | etykieta „DEMO, dane fikcyjne" w każdym dashboardzie i w każdym PDF-ie | HIGH | `demo-labels` |
| `A-DEM-05` | `track()` i inne zdarzenia wyłącznie w handlerach UI, nigdy w silniku | HIGH | `demo-events-outside-engines` |
| `A-DEM-06` | PDF deterministyczny: brak daty generowania w treści, te same bajty przy dwóch przebiegach | HIGH | `demo-pdf-deterministic` |

### 3.15 Reguły audytowane bez własnego pliku w `rules/`

Zgłaszamy je w raporcie z ID z tej checklisty (`A-REN-07`, `A-REN-08`, `A-REN-11`, `A-BUN-04`, `A-HOO-01`,
`A-HOO-02`, `A-COM-02`, `A-COM-03`, `A-COM-04`, `A-COM-06`, `A-UX-03`, `A-UX-09`, `A-FRM-04`, `A-FRM-07`),
severity MEDIUM lub LOW, **bez blokowania pusha**. Jeśli któraś zacznie wracać w kolejnych rundach — awansuje
do `rules/` (nowy plik + `build-index.mjs`), zamiast zostawać wiecznym „obserwacją" w raporcie.

---

## 4. Reguły Vercela świadomie nadpisane

| Reguła źródłowa | Nasze rozstrzygnięcie | Gdzie zapisane |
|---|---|---|
| `WG`/`WIG`: Title Case w nagłówkach i etykietach nawigacji | pisownia zdaniowa w PL **i** EN | `i18n-sentence-case-headings`, `writing-command.md` §PL.3 |
| `WG`: „`&` over and where space-constrained" | zakaz `&` w copy PL; w EN tylko nawigacja | `writing-command.md` §PL.3 |
| `WG`: „Never em dashes or dashes as punctuation" | tak samo, ale półpauza „–" dozwolona w zakresach liczbowych (D-09 b) | `i18n-pl-typography`, `writing-command.md` §PL.1 |
| `WIG`: `autocomplete="off"` na polach nieautoryzacyjnych | u nas `autocomplete` sensowny (imię, e-mail, telefon): menedżer haseł nie jest problemem, a a11y i wygoda są | `a11y-form-labels-errors` |
| `WIG`: „Numerals for counts" | obowiązuje, ale liczba rynkowa bez źródła i roku jest zakazana | `legal-sources-for-market-numbers` |
| `RBP:bundle-barrel-imports` (CRITICAL) | LOW; `lucide-react` zostaje (jedna rodzina ikon) | `code-no-barrel-imports`, `design-icons-lucide-one-family` |
| `RBP:js-tosorted-immutable` | odwrotnie: `[...a].sort()` z powodu `safari13` | `code-tosorted-safari13` |
| `VT` (cały skill) | React 19.3 `<ViewTransition>` dopiero w fazie 2, tylko wokół `<Routes>` | `motion-view-transition-rules`, D-18 |
| `WG`: `meta.contentType`, `<Steps/>`, katalog modeli, deep-linki do dashboardu | nie dotyczy (konwencje dokumentacji Vercela) | `writing-command.md` §PL.7 |

---

## 5. Pokrycie: która reguła strażnika bierze którą regułę źródłową

W lewej kolumnie są **ID reguł strażnika** (każde ma plik `rules/<id>.md`). W prawej — ID **obce**,
z zewnętrznych skilli: `WIG:` (web-design-guidelines), `RBP:` (react-best-practices), `VT:`
(react-view-transitions), `WG:` (writing-guidelines), `CP:` (composition-patterns), `KL:` (własne
Klarow, bez odpowiednika u Vercela). **Prefiks obowiązuje do końca ciągu po przecinku**, więc
`WIG:img-dimensions, img-lazy, perf-preconnect` to trzy ID WIG. ID z prawej kolumny NIE mają
plików w `rules/` i nigdy nie pojawiają się w findings — cytujemy wyłącznie ID z lewej kolumny.

| Reguła strażnika | Pokrywa |
|---|---|
| `code-effects-hygiene` | `RBP:rerender-derived-state-no-effect`, `rerender-move-effect-to-event`, `rerender-dependencies`, `rerender-functional-setstate`, `advanced-init-once`, `advanced-effect-event-deps`, `advanced-event-handler-refs`, `advanced-use-latest`, `CP:state-lift-state` |
| `code-memo-policy` | `RBP:rerender-memo`, `rerender-simple-expression-in-memo`, `rerender-memo-with-default-value`, `rerender-split-combined-hooks` |
| `code-lazy-routes-and-dashboards` | `RBP:bundle-dynamic-imports`, `bundle-conditional`, `bundle-analyzable-paths` |
| `perf-code-split-dashboards` | `RBP:bundle-dynamic-imports`, `rendering-content-visibility`, `WIG:perf-virtualize` |
| `perf-js-budget-home`, `perf-chunk-size-gate`, `motion-bundle-budget-motion` | `KL:bundle-budget` (mapowane z `RBP` sekcji 2) |
| `code-no-barrel-imports` | `RBP:bundle-barrel-imports` |
| `code-tosorted-safari13`, `perf-build-target`, `code-build-target-policy` | `RBP:js-tosorted-immutable`, `KL:build-target` |
| `perf-no-zoom-root` | `RBP:js-batch-dom-css`, `WIG:perf-no-layout-reads` |
| `perf-images-policy`, `perf-lcp-poster-preload`, `perf-fonts-budget` | `WIG:img-dimensions`, `img-lazy`, `img-priority`, `perf-preconnect`, `perf-font-preload`, `RBP:rendering-resource-hints` |
| `perf-no-webgl-on-coarse`, `perf-three-js-policy`, `motion-cleanup-required` | `KL:raf-hygiene`, `KL:gpu-bg-hygiene`, `RBP:client-event-listeners` |
| `code-no-forwardref-react19`, `code-use-not-usecontext` | `CP:react19-no-forwardref` |
| `code-file-size-cap` | `KL:file-size` (kontekst `CP:architecture-*`) |
| `code-single-source-copy`, `code-contact-single-source` | `CP:state-decouple-implementation` (jedno źródło danych dla UI i shella) |
| `code-state-in-url` | `WIG:nav-url-state` |
| `a11y-controls-native`, `seo-links-in-dom` | `WIG:a11y-semantic`, `nav-real-links` |
| `a11y-form-labels-errors` | `WIG:form-*` (11 reguł) + `a11y-form-label` |
| `a11y-focus-visible-everywhere`, `design-sticky-opaque` | `WIG:focus-visible`, `focus-not-covered` |
| `a11y-headings-order-one-h1`, `a11y-main-and-skip-link` | `WIG:a11y-headings-skiplink`, `a11y-scroll-margin` |
| `a11y-images-alt-svg-role` | `WIG:a11y-img-alt`, `a11y-decorative-hidden`, `a11y-icon-button-label` |
| `a11y-dialog-semantics`, `a11y-touch-targets-44` | `WIG:touch-*`, `a11y-media`, `focus-within` |
| `a11y-safe-area-dvh`, `design-overflow-rules` | `WIG:layout-safe-area`, `layout-no-scrollbar`, `content-*` |
| `design-page-theme-lock`, `design-light-ready-tokens` | `WIG:dark-color-scheme`, `dark-theme-color`, `dark-select` |
| `i18n-pl-typography` | `WIG:type-ellipsis`, `type-quotes`, `type-nbsp`, `type-loading-ellipsis`, `WG:punctuation` |
| `design-typography-scale` | `WIG:type-balance`, `type-tabular-nums` |
| `i18n-sentence-case-headings` | `WG:headings` (z odwróconym rozstrzygnięciem dla nav labels) |
| `copy-voice-and-tone`, `copy-minimal-text` | `WG:voice`, `banned-words`, `concision`, `ai-tells`, `WIG:copy-*` |
| `legal-sources-for-market-numbers`, `copy-numbers-with-source` | `WG:concision` (wagi i liczby ze źródłem) |
| `motion-reduced-motion-three-layers`, `a11y-reduced-motion-media-query` | `WIG:motion-reduced`, `VT:reduced-motion` |
| `motion-gpu-props-only`, `motion-no-transition-all-no-linear`, `motion-tokens-only` | `WIG:motion-transform-opacity`, `motion-no-transition-all`, `motion-origin`, `motion-svg-g`, `VT:motion-timing-budget` |
| `motion-view-transition-rules`, `motion-motivated` | `VT:*`, `WIG:motion-interruptible` |
| `media-video-embed-spec`, `media-video-gating`, `media-one-autoplay-per-route` | `WIG:video-over-gif`, `video-loop-spec`, `motion-autoplay-controls` |
| `i18n-pl-en-pair-required`, `i18n-lang-before-paint` | `KL:i18n-pair`, `RBP:rendering-hydration-no-flicker`, `WIG:i18n-*` |
| `seo-*` (12 reguł) | `KL` (prerender, sitemap, JSON-LD, canonical, redirects, 404, lastmod, hreflang, GSC) — Vercel nie ma odpowiedników dla SSG bez frameworka |
| `demo-*` (6 reguł) | `KL:determinism` + `RBP:js-*` (silniki liczące) |
| `brand-*` (7), `legal-*` (6), `secret-*` (5), `integ-*` (8 reguł) | `KL` (marka, prawo, sekrety, integracje) — poza zakresem skilli Vercela |

**Liczby w nawiasach to `ls rules/<prefiks>-*.md | wc -l`** i muszą się zgadzać po każdej zmianie w `rules/`.
Stan 2026-09-12 (po scaleniu `copy-no-ai-word-in-sales` → `brand-no-ai-word-in-sales`): a11y 15 · brand 7 ·
code 17 · copy 10 · demo 6 · design 18 · i18n 4 · integ 8 · legal 6 · media 9 · motion 17 · perf 10 ·
secret 5 · seo 12 = **144**. Kontrola tej sumy należy do `scripts/build-index.mjs` (pozycja otwarta).

---

## 6. Format wyniku audytu

```text
## site/src/components/Navbar.tsx (2, HIGH)
site/src/components/Navbar.tsx:67 - HIGH [motion-no-transition-all-no-linear] transition-all → transition-[transform,opacity]
site/src/components/Navbar.tsx:122 - HIGH [motion-no-transition-all-no-linear] transition-all w menu mobilnym
## site/src/components/ui/card.tsx (6, MEDIUM)
site/src/components/ui/card.tsx:5 - MEDIUM [code-no-forwardref-react19] React.forwardRef → ref jako prop
  → fix: function Card({ ref, className, ...props }: Props & { ref?: React.Ref<HTMLDivElement> })
## site/src/lib/report.ts
✓ pass

Σ BLOCKER 0 · HIGH 2 · MEDIUM 7 · LOW 0 · ✓ pass 1
```

Zasady: grupowanie per plik, ścieżki relatywne do korzenia repo, `ścieżka:linia - SEV [ID-reguły] komunikat`
(≤ 90 znaków), drugi wiersz `→ fix:` tylko gdy naprawa nieoczywista, podsumowanie na końcu, zero preambuły.
ID to nazwa pliku z `rules/` albo ID z §3, gdy reguła nie ma własnego pliku. Równolegle JSONL w scratchpadzie
(`{file,line,severity,rule,msg,fix,source:grep|ast|llm|build,confidence:CONFIRMED|PLAUSIBLE}`); do repo
trafia wyłącznie świadomie zaktualizowany `baseline/*.jsonl`. W tekście dla founderów: „do naprawy",
„obserwacja", „sprawdzone, bez zmian", „nie sprawdzano w tej rundzie" — bez słów wewnętrznych.
