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
- [x] usunąć martwy kod bez importerów (`pages/Home.tsx`, `HeroMedia.tsx`,
      `Differentiators.tsx`, `ui/glsl-hills.tsx`, `BgBoundary.tsx`)
- [x] usunąć zależności `three`, `@types/three`, `@formkit/auto-animate`
- [x] motyw ciemny: `index.html` (atrybut + `theme-color`), zdjąć nadpisania
      `html[data-theme="light"]` z `globals.css` i `company-ui.css`
- [x] usunąć martwy CSS `globals.css:369-963` (`.home-*`, `.wall-*`, `.scene-*`,
      `.pres-*`) — **warunek wstępny**, bo CSS ma tylko 2,4 KB zapasu
- [x] bramka: tsc + build + verify-site + audit

### F2 · Nowa strona główna (szkielet)
- [x] `data/homeSections.ts` — jedno źródło copy dla klienta i prerenderu
- [x] `pages/HomeV3.tsx` + `components/home/*`
- [ ] `SectionMount` (lazy poniżej folda)
- [x] synchronizacja `HomeShell` w `prerender/entry.tsx` + bramka słów
- [x] usunąć `src/presentation/**`, `pages/Presentation.tsx`,
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
5. **Dług zastany, nie regresja:** `find-integrations` zgłasza 13 HIGH i 14
   niezarejestrowanych połączeń, wszystkie w skryptach budowania
   (`og.mjs`, `record-demos.mjs`, `shoot-tools.mjs`) oraz w `ui-kit/.../base.html`.
   To zmienne środowiskowe i `127.0.0.1` w narzędziach Node, nie połączenia
   strony. Do rozstrzygnięcia: albo rejestr dostaje sekcję na narzędzia
   deweloperskie, albo skrypt przestaje je skanować.
4. Planer zdalny: przepisanie `integ-no-llm-api-in-client-tools` (BLOCKER)
   — dopiero po punkcie kontrolnym „dzień 9".

## Porażki

- **FAIL** skrypt podmieniający `index.html` wkleił komentarz przed `<!doctype>`
  i zostawił stary blok preloadu (`indexOf` na fragmencie, którego nie było).
  **fix** `git checkout` pliku i podmiana liniowa zamiast na tekście. **PASS**
- **FAIL** przy cięciu martwego CSS wyleciał sam selektor `.sr-only`, bo offset
  w skrypcie policzył komentarz na 4 linie zamiast 2. **fix** dopisany selektor,
  weryfikacja gregiem. **PASS**
- **FAIL** H1 łamał się na 3 wiersze od 1024 px przy limicie 2
  (`design-hero-discipline`): w kolumnie 5/12 nie było na to miejsca przy żadnym
  sensownym stopniu pisma. **fix** nagłówek na pełną szerokość pierwszego wiersza
  siatki. **PASS** (zmierzone: 1024/1280/1440/1920 → 2 wiersze, 390 → 3)
- **FAIL** pierwszy pomiar wierszy H1 przez `getClientRects().length` zawsze dawał
  1, bo element blokowy ma jeden prostokąt niezależnie od zawijania. **fix** pomiar
  wysokością podzieloną przez `line-height`. **PASS**

## Wynik

(uzupełniane na koniec)
