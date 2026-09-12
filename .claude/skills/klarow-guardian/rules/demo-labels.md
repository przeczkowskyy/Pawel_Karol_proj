---
id: demo-labels
title: Każde demo jest oznaczone „Demo na danych przykładowych" (badge kitu .st) i zdaniem o determinizmie; dane, nazwy i kwoty są jawnie fikcyjne
impact: HIGH
tags: [demo, labels, brand, trust, copy, marketing]
source: synthesis §2.1 proofLabels/§5.4.11 determ-labels · CLAUDE.md zasada #3 (case = „firma produkcyjno-budowlana") i sekcja Narzędzia („KAŻDE z 12 narzędzi działa na żywo na danych DEMO") · brand-icp §2.2 p.6 (uczciwe etykiety dowodu) · taste §4.5 („Jane Doe" Effect)
added: 2026-09-12
---

## Zasada

> **Zakres powierzchni**: reguła dotyczy OBU trybów. Punkt 1 zdanie 2–3 (chipy na kartach huba i w ramach S3) i punkt 6 dotyczą powierzchni MARKETINGOWEJ (`/`, `/narzedzia`), więc audytuje je także `ui-auditor`/`copy-auditor` przez `brand-honest-labels`; reszta to tryb `tool`. Sekcja `demo` w `rules/_sections.md` ma dziś tryb `tool` — dopóki nie zmieni się na `both`, orkiestrator musi ładować tę regułę również w trybie `marketing` (pozycja w `open_points` sesji).

1. **Badge**: każdy z **12 dashboardów** (11 komponentów w `src/components/dashboards/**` — `PdfButton.tsx` dashboardem nie jest — plus `DemoReport.tsx`) ma w nagłówku panelu chip kitu `<span className="st">` z tekstem z `MESSAGING.proofLabels.demo` („Demo na danych przykładowych" / „Demo on sample data"). Karty w hubie i ramy S3 pokazują ten sam chip dla `kind: "demo"`; `product` → `st st-accent` „Własny produkt"; `case` → `st st-accent` z obrysem „Wdrożone w firmie produkcyjno-budowlanej". `st-blue`/`st-green` na stronie marketingowej nie występują (Color Lock; kolory semantyczne tylko wewnątrz dashboardów jako statusy).
2. **Zdanie determinizmu**: pod każdym dashboardem (stopka panelu) jedna linia z `MESSAGING.determinism` („Te same dane dają ten sam wynik…") ALBO krótszy wariant `MESSAGING.proofFooter` („Dane fikcyjne · te same dane zawsze dają ten sam wynik"), PL/EN przez `pick()`. Zero własnych sformułowań per dashboard (dziś np. `G703Billing.tsx:66` ma własną stopkę: do ujednolicenia).
3. **Dane fikcyjne, ale wiarygodne**: nazwy projektów/inwestycji/kontrahentów z jednej listy `src/data/demo-names.ts` (miasta + typ obiektu: „Hala Poznań", „Moduły Gdańsk"; firmy: „Stalbud Sp. z o.o.", „Prefab-Mont"), bez „Jane Doe"/„Firma A"/„Lorem", bez nazw realnych klientów, bez nazwy firmy źródłowej i jej produktów, bez realnych osób (imię i nazwisko PM-a: z listy fikcyjnej, sygnowanej w komentarzu). Kwoty realistyczne dla ICP (projekty 0,3–5 mln zł; G703 w USD), nie „123 456".
4. **Tryb TEST w importach**: dashboardy piszące (w wersji wdrożeniowej) do plików mają w badge dodatkowo `TEST` i zdanie „w Twoich plikach nic się nie dzieje" (`ErpImports.tsx:60`); to zostaje.
5. **PDF**: stopka „DEMO: dane fikcyjne" na każdym dokumencie (`lib/pdf.ts`), plus zdanie o determinizmie w metadanych `info.subject`.
6. **Zero liczb-obietnic w demie**: opisy dashboardów nie zawierają liczb spoza `MESSAGING.allowedNumbers` (np. „oszczędza 40 godzin miesięcznie") ani nazw dostawców AI; wynik dema nie jest przedstawiany jako wynik klienta.
7. **Etykieta „Wdrożone"** wymaga wpisu `client` w `tools.ts` i decyzji D7 (umowa IP); liczba mnoga „u klientów" zakazana do 2. klienta (`brand-*`).

## Mechanizm awarii (dlaczego)

- Zasada #3 CLAUDE.md: marka firmy źródłowej nie może pojawić się publicznie przed umową IP; demo bez etykiety „dane przykładowe" z realistycznymi nazwami sugeruje realne wdrożenie u realnego klienta = ryzyko prawne i wizerunkowe.
- brand-icp: „każda etykieta „Wdrożone" wymaga dowodu"; nieuczciwe etykiety dowodu były wadą showreel. Uczciwość etykiet to element „kalkulator, nie wróżka".
- „Jane Doe"/„Firma A" (taste §4.5) czyta się jako makieta, nie narzędzie; realistyczne fikcyjne nazwy z jednej listy dają spójność między 12 dashboardami, zrzutami i PDF.
- Bez zdania o determinizmie użytkownik nie wie, że może odświeżyć i porównać; zdanie jest też słowem-kluczem dla LLM-ów (GEO) cytujących stronę.

## Niepoprawnie

```tsx
<h3>Raport zarządczy</h3>                                   // brak badge
<td>Firma A</td><td>Projekt 1</td><td>123 456,00 zł</td>    // makieta
<p>Ten raport oszczędza 40 h miesięcznie u naszych klientów.</p>   // liczba bez źródła, liczba mnoga „klientów"
<span className="st st-blue">WDROŻONE</span>                 // st-blue na stronie marketingowej; „wdrożone" bez client/D7
```

## Poprawnie

```tsx
import { MESSAGING } from "@/data/messaging";
import { DEMO_PROJECTS } from "@/data/demo-names";
<header className="panel-head">
  <h3>{t.title}</h3>
  <span className="st">{pick(lang, MESSAGING.proofLabels.demo)}</span>
  {mode === "test" ? <span className="st st-accent"><Eye className="st-ico" /> TEST</span> : null}
</header>
…
<footer className="panel-foot muted">{pick(lang, MESSAGING.proofFooter)}</footer>
```

```ts
// src/data/demo-names.ts (jedna lista fikcyjnych nazw dla wszystkich dem)
export const DEMO_PROJECTS = [
  { pl: "Hala Poznań", en: "Poznań warehouse" }, { pl: "Moduły Gdańsk", en: "Gdańsk modules" }, { pl: "Biurowiec Łódź", en: "Łódź office block" },
] as const;
export const DEMO_COUNTERPARTIES = ["Stalbud Sp. z o.o.", "Prefab-Mont", "Elektro-Serwis Nowak"] as const;   // fikcyjne
```

## Test

```bash
# badge z messaging w każdym dashboardzie i DemoReport
# 12 = 11 plików w components/dashboards/** (bez PdfButton.tsx) + DemoReport.tsx
# 13 to liczba NARZĘDZI w tools.ts (12 dem + KSeF kind: "case"), nie liczba dashboardów
grep -rlE 'proofLabels\.demo' site/src/components/dashboards site/src/components/DemoReport.tsx | grep -v PdfButton | wc -l   # = 12
grep -rlE 'proofFooter|MESSAGING\.determinism' site/src/components/dashboards site/src/components/DemoReport.tsx | grep -v PdfButton | wc -l   # = 12
# zero własnych stopek/etykiet
grep -rnE '"Dane fikcyjne|DEMO dane|dane DEMO' site/src/components --include=*.tsx | grep -v messaging   # = 0 (poza messaging.ts)
# Color Lock: st-blue/st-green poza dashboardami (oczekiwane: 0)
grep -rnE 'st-(blue|green|violet)' site/src --include=*.tsx | grep -vE 'components/dashboards/|DemoReport.tsx'
# makiety i marka źródłowa (oczekiwane: 0)
grep -rniE 'jane doe|john doe|lorem|firma a\b|projekt 1\b|acme' site/src
# wzorzec marki źródłowej trzymamy w JEDNYM miejscu (brand-no-nuconic / scripts/audit-static.mjs --print-src-brand-re),
# żeby nie mnożyć plików z tym ciągiem w publicznym repo (por. secret-git-history-scan-before-public):
SRC_BRAND_RE=$(node .claude/skills/klarow-guardian/scripts/audit-static.mjs --print-src-brand-re)
grep -rniE "$SRC_BRAND_RE" site/src site/dist 2>/dev/null   # = 0 (BLOCKER brand-no-nuconic)
# nazwy z jednej listy
grep -rnE '"Hala |"Moduły |"Biurowiec ' site/src/components | grep -v demo-names   # = 0 (import z data/demo-names.ts)
# liczby w opisach dem tylko z allowedNumbers (bramka verify-site: każda liczba w dist na liście) · „u klientów” = 0
grep -rniE 'u klientów|at our clients' site/src site/dist 2>/dev/null   # = 0
# PDF: stopka DEMO
grep -nE 'DEMO' site/src/lib/pdf.ts | wc -l   # ≥ 1
```

## Wyjątki

- Karta KSeF (`kind: "product"`) ma badge „Własny produkt" i panel „jak działa" zamiast dema; bez zdania o danych przykładowych (nie ma dema), z zdaniem `zeroVendorCloud`.
- Trasa `/oferta` sekcja kalkulatora transz (jeśli wejdzie) używa tych samych etykiet co dashboard.
