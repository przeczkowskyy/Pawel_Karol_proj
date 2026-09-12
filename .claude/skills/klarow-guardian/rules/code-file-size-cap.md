---
id: code-file-size-cap
title: Plik komponentu ≤ 300 linii; App.tsx rozbity na pages/ + data/ + layout/
impact: MEDIUM
tags: [architecture, file-size, refactor, code]
source: site-audit.md §3.4 p.5 (App.tsx 845 linii god-file) / synthesis §2.7.2 (App.tsx ~150 l.; pages/Home Tools Tool Offer Faq Privacy NotFound) / vercel.md §9.4 KL:file-size / zadanie strażnika (limit 300)
added: 2026-09-12
---

## Zasada

Plik `.tsx` w `site/src/components/**` i `site/src/pages/**` ma ≤ 300 linii (liczone po sformatowaniu, bez pustych na końcu). `App.tsx` = wyłącznie routing, layout (`Navbar`/`Footer`/`PageMain`/`SkipLink`), `ScrollToTop`, lazy strony i `BookingDialog` (~150 linii). Sekcje home to osobne komponenty (`Hero`, `Bento`, `CaseFrames`, `Outcomes`, `MetricsStrip`, `Steps`, `Contrast`, `Founders`, `ClosingCta`), a ich copy siedzi w `data/home.ts` (`code-single-source-copy`). Plik danych (`data/*.ts`) i silnik (`lib/*.ts`) nie mają limitu linii, ale mają limit odpowiedzialności: jeden moduł = jedno źródło (tools, toolsSeo, faq, messaging).

## Mechanizm awarii (dlaczego)

`App.tsx` ma 845 linii: 11 obiektów i18n, 12 komponentów sekcji, 4 strony, routing, stopkę, `PageMain` i modal w jednym pliku. Skutki: (1) `React.lazy` stron jest niemożliwy, bo wszystko jest w jednym module (`code-lazy-routes-and-dashboards`); (2) każdy agent edytujący hero ładuje do kontekstu 845 linii i ryzykuje kolizję z równoległą edycją stopki; (3) `git diff` sekcji jest nieczytelny; (4) `rerender-no-inline-components` (RBP 5.4, HIGH) łatwo złamać, definiując helper renderujący wewnątrz komponentu-giganta. Dashboardy (`QualityGate.tsx` 378, `TaskTimeline.tsx` 324, `ProductionDashboard.tsx` 312, `DemoReport.tsx` 524) przekraczają limit, ale są w `--baseline` do czasu refaktoru okna c1 (nie dotykać w fazie 1).

## Niepoprawnie

```
site/src/App.tsx          845 linii: HERO/CAPS/PROOF/PAIN/OFFER/FOOT + Hero + Capabilities + ProofBand + Pain + … + HomePage/ToolsPage/OfferPage/FaqPage + Footer + PageMain + ScrollToTop + App
```

## Poprawnie

```
site/src/App.tsx            ~150   routing + lazy pages + layout + BookingDialog
site/src/pages/Home.tsx     ~120   składa sekcje z data/home.ts
site/src/components/Hero.tsx, Bento.tsx, Outcomes.tsx, MetricsStrip.tsx, Steps.tsx, Contrast.tsx, Founders.tsx, ClosingCta.tsx   każdy ≤ 150
site/src/components/layout/Navbar.tsx, Footer.tsx, PageMain.tsx, SkipLink.tsx
site/src/data/home.ts, oferta.ts, founders.ts, messaging.ts, contact.ts
```

## Test

```bash
# pliki komponentów/stron > 300 linii (bez dashboardów w baseline)
find site/src/components site/src/pages -name "*.tsx" -not -path "*/dashboards/*" -not -name "DemoReport.tsx" | xargs wc -l | awk '$1 > 300 && $2 != "total" {print "FAIL", $0}'
wc -l site/src/App.tsx   # cel: ≤ 200 po fazie 0
# komponenty definiowane wewnątrz komponentów (RBP 5.4): funkcja z JSX wewnątrz innej funkcji z JSX
# DOCELOWO (skrypt planowany, jeszcze nie istnieje — dziś: NIE SPRAWDZANO): node .claude/skills/klarow-guardian/scripts/check-code.mjs --inline-components
```

Severity: MEDIUM (raport); `App.tsx` > 300 po fazie 0 = pozycja do naprawy w planie, nie ticket odległy.

## Wyjątki

`dashboards/*.tsx` i `DemoReport.tsx` (baseline, własność okna c1 w fazie 1). `prerender/entry.tsx` może przekraczać 300 linii, dopóki shelle nie zostaną przepisane na dane; po fazie 3 obowiązuje ten sam limit (shelle w osobnych plikach `prerender/shells/*.tsx`).
