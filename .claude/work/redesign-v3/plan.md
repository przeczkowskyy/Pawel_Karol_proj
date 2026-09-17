# Redesign v3: strona, która uruchamia narzędzia

Plan pełny (kontekst, research, architektura, ryzyka):
`C:\Users\bibac\.claude\plans\gentle-tickling-squid.md`

## Cel

Strona główna przestaje opowiadać o narzędziach i zaczyna je uruchamiać.
Efekt „wow" bierze się z prawdziwego, działającego produktu, nie z wygenerowanej
ilustracji — dwa poprzednie podejścia (kreskówka, pętle) founder odrzucił.

## Zakres zamrożony

- Motyw wraca na ciemną stal (decyzja Karola 2026-09-17).
- Strona główna `/` przebudowana wokół żywego instrumentu plikowego.
- 13 podstron narzędzi: dashboard-first + ten sam instrument.
- `/oferta`, `/faq`, `/rodo`: wyłącznie nowe tokeny, bez przebudowy układu.
- **Poza zakresem tej rundy:** planer zdalny (Pages Function + Anthropic).
  Wchodzi dopiero po tym, jak wersja w 100 % lokalna będzie działać
  (punkt kontrolny „dzień 9" z planu głównego).

## Tryb

`marketing` dla `site/src` poza `components/dashboards/**`, `DemoReport.tsx`,
`lib/**`; `tool` dla tych trzech.

## Reguły, których dotykam

Do przepisania (każda z datą, cytatem decyzji i wierszem w `decisions-log.md`):
- `design-page-theme-lock` (MEDIUM) — odwrócenie kierunku na ciemny
- `perf-lcp-poster-preload` (HIGH) — nazwa elementu LCP
- `media-video-budgets` (HIGH) — skasowanie wierszy `presentation/panel-*`
- `design-one-cta-per-screen` (HIGH) — zakres etykiety `MESSAGING.cta.file` o `/`
- `motion-bundle-budget-motion` (HIGH) — **bez zmiany treści**, naprawa martwej
  implementacji w `verify-site.mjs` (detekcja po nazwie pliku → po treści)

Do przestrzegania bez zmian: `design-tokens-only`, `design-shape-lock`,
`design-no-glass-no-blur`, `design-hero-discipline`, `design-no-three-equal-cards`,
`motion-*`, `perf-js-budget-home`, `perf-chunk-size-gate`, `seo-prerender-must-keep`,
`seo-links-in-dom`, `demo-determinism`, `code-no-dead-code`, `i18n-pl-en-pair-required`.

## Kroki

### F1 · Sprzątanie i motyw
- [ ] usunąć martwy kod bez importerów (`pages/Home.tsx`, `HeroMedia.tsx`,
      `Differentiators.tsx`, `ui/glsl-hills.tsx`, `BgBoundary.tsx`)
- [ ] usunąć zależności `three`, `@types/three`, `@formkit/auto-animate`
- [ ] motyw ciemny: `index.html` (atrybut + `theme-color`), zdjąć nadpisania
      `html[data-theme="light"]` z `globals.css` i `company-ui.css`
- [ ] usunąć martwy CSS `globals.css:369-963` (`.home-*`, `.wall-*`, `.scene-*`,
      `.pres-*`) — **warunek wstępny**, bo CSS ma tylko 2,4 KB zapasu
- [ ] bramka: tsc + build + verify-site + audit

### F2 · Nowa strona główna (szkielet)
- [ ] `data/homeSections.ts` — jedno źródło copy dla klienta i prerenderu
- [ ] `pages/HomeV3.tsx` + `components/home/*`
- [ ] `SectionMount` (lazy poniżej folda)
- [ ] synchronizacja `HomeShell` w `prerender/entry.tsx` + bramka słów
- [ ] usunąć `src/presentation/**`, `pages/Presentation.tsx`,
      `data/presentation.ts`, `public/media/presentation/**`
- [ ] lazy-routing `ToolsPage`, `OfferPage`, `FaqPage`, `RodoPage`

### F3 · Pipeline lokalny
- [ ] `lib/sheet/{separator,read,mask,redact,probe}.ts`
- [ ] `lib/plan/{schema,validate,local}.ts`
- [ ] `lib/clean/{apply,emit,toReport}.ts`
- [ ] golden-testy + fixture z brudnym arkuszem

### F4 · UI instrumentu
- [ ] `components/drop/*` — dropzone, podsumowanie, pobranie
- [ ] wpięcie `DemoReport` na prawdziwych danych użytkownika

### F5 · Podstrony narzędzi
- [ ] dashboard-first, `DropIntoTool`, lista hairline zamiast ściany chipów
- [ ] ponowne zrzuty (`shoot-tools.mjs`) i OG (`og.mjs`) w ciemnym

## Otwarte (decyzje founderów)

1. `.xlsx` w fazie 1 (+2 dni) czy tylko CSV/TSV i wklejka, a `.xlsx` wyłącznie
   jako format wyjściowy.
2. Dane administratora do `/rodo` — bloker publikacji od 2026-09-12.
3. Los 13 podstron narzędzi w nawigacji (decyzja D-39, wciąż otwarta).
4. Planer zdalny: przepisanie `integ-no-llm-api-in-client-tools` (BLOCKER)
   — dopiero po punkcie kontrolnym „dzień 9".

## Porażki

(uzupełniane w trakcie: FAIL → fix → PASS)

## Wynik

(uzupełniane na koniec)
