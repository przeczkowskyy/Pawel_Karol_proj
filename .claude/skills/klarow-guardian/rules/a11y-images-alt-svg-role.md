---
id: a11y-images-alt-svg-role
title: Obrazy: alt (lub alt="") + width/height + loading; SVG z danymi: role="img" + aria-label; ikony aria-hidden
impact: HIGH
tags: [a11y, images, svg, alt, cls, icons]
source: WIG Accessibility (images need alt; decorative icons aria-hidden) + Images (width/height, loading=lazy, fetchpriority) / site-audit.md §3.2 p.7 (SVG role="img" w DemoReport, CollaborationFlow) / synthesis a11y-img, a11y-svg, design-icons, §2.3 S1 (poster jako LCP z preload)
added: 2026-09-12
---

## Zasada

1. Każdy `<img>` ma `alt`: opisowy, gdy niesie treść (zrzut dashboardu: „Raport zarządczy: 3 KPI i wykres koszt vs postęp na danych przykładowych"), `alt=""` gdy dekoracyjny (poster hero, still „brushed steel", duotone portret ma `alt="Imię Nazwisko"`). Zawsze jawne `width` i `height` (CLS), `loading="lazy"` poniżej folda, `decoding="async"`; poster hero `fetchPriority="high"` + `<link rel="preload" as="image">` w `index.html`.
2. SVG z danymi lub znaczeniem (`CollaborationFlow`, `KsefFlow`, wykresy `DemoReport`, ilustracje case) ma `role="img"` + `aria-label` streszczający dane (liczby, kierunek strzałek: „KSeF API → connector → baza u Ciebie → pulpity; brak strzałki zwrotnej"); węzły tekstowe wewnątrz SVG nie zastępują `aria-label`.
3. Ikony lucide obok tekstu: `aria-hidden="true"`; ikona jako jedyna treść kontrolki: kontrolka ma `aria-label` (nie ikona). Ikona sama nigdy nie niesie statusu (kolor + ikona + tekst).
4. Zero `<img>` z `src` zewnętrznym (`integ-no-external-scripts-on-site`), zero placeholderów `picsum`/`unsplash` w `dist`.

## Mechanizm awarii (dlaczego)

`<img>` bez wymiarów przesuwa layout po załadowaniu (CLS > 0,1 = czerwony Core Web Vital, budżet synthesis §2.4.9 < 0,1); bez `alt` czytnik czyta nazwę pliku `hero-v1.poster.webp`. Wykres jako `<svg>` bez `role="img"` jest dla czytnika listą setek `<path>`; z `aria-label` staje się jednym zdaniem z danymi. Ikona bez `aria-hidden` obok tekstu podwaja komunikat („ikona check OK"); przycisk ikonowy bez `aria-label` to „button" bez nazwy (WIG Anti-patterns). `radial-orbital-timeline.tsx:288,397` ma `<img` bez wymiarów (martwy plik, ale wzorzec do niepowielania).

## Niepoprawnie

```tsx
<img src="/thumbs/raport-zarzadczy-640.webp" />
<svg viewBox="0 0 800 300">{bars}</svg>
<button onClick={onClose}><X size={15} /></button>
<Check size={14} /> OK
```

## Poprawnie

```tsx
<img src="/thumbs/raport-zarzadczy-640.webp" width={640} height={400} loading="lazy" decoding="async"
     alt={pick(lang, { pl: "Raport zarządczy: 3 KPI i wykres koszt vs postęp, dane przykładowe", en: "Management report: 3 KPIs and cost vs progress chart, sample data" })} />
<svg viewBox="0 0 800 300" role="img" aria-label={t.chartSummary(kpis)}>{bars}</svg>
<button type="button" onClick={onClose} aria-label={t.close}><X size={16} aria-hidden="true" /></button>
<span className="st st-ok"><Check size={14} aria-hidden="true" /> OK</span>
{/* index.html: <link rel="preload" as="image" href="/media/hero-v1.poster.webp" fetchpriority="high"> */}
```

## Test

```bash
grep -rnE "<img\b" site/src --include=*.tsx | grep -vE "alt=" ;  grep -rnE "<img\b" site/src --include=*.tsx | grep -vE "width=\{?[0-9]" | grep -vE "height="   # 0 i 0
grep -rnE "<svg\b" site/src --include=*.tsx | grep -vE "role=\"img\"|aria-hidden=\"true\""   # 0
grep -rnE "<(Check|X|Menu|Phone|Mail|ArrowRight|ChevronDown)[^>]*/>" site/src --include=*.tsx | grep -v "aria-hidden"   # przegląd; oczekiwane 0 poza samodzielnymi ikonami w kontrolce z aria-label
grep -rlE "picsum|unsplash" site/dist                                        # 0
# ESLint jsx-a11y/alt-text; Lighthouse: „Image elements have explicit width and height"
```

Severity: HIGH.

## Wyjątki

`<img alt="">` dekoracyjny bez `role="presentation"` wystarcza. SVG czysto dekoracyjne (hairline łącznik kroków) mają `aria-hidden="true"` zamiast `role="img"`.
