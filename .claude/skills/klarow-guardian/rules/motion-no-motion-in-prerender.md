---
id: motion-no-motion-in-prerender
title: Zero motion/* i zero window/document w src/prerender/entry.tsx i w komponentach renderowanych przez shell
impact: HIGH
tags: [motion, prerender, ssr, build]
source: motion-dev §3.4 p.9/§8.1/§8.2 · synthesis §2.4.2/§2.8 p.2 · showreel M6 · feasibility-perf §5.2 p.4
added: 2026-09-12
---

## Zasada

`src/prerender/entry.tsx` jest budowany osobno (`vite build --ssr`) i uruchamiany w Node przez `scripts/prerender.mjs` (`renderToStaticMarkup`). W tym grafie importów:

- nie ma `motion`, `motion/react`, `motion/react-m`, `src/motion/*` (provider, presets, Reveal, Counter, PageFade, ChartReveal),
- nie ma `window`, `document`, `navigator`, `matchMedia`, `requestAnimationFrame`, `IntersectionObserver` w ścieżce renderu,
- nie ma `<video>`, `<canvas>`, `three`, `@react-three/fiber`, `pdfmake`.

Shelle (`HomeShell`, `ToolsShell`, `ToolShell`, `OfferShell`, `FaqShell`, `PrivacyShell`/`RodoShell`, `NotFoundShell`) renderują z TYCH SAMYCH modułów `src/data/*` i czystych funkcji `src/lib/*` (`aggregate`, `auditRows`), z których korzysta React. Komponenty, które mają być współdzielone między shellem a aplikacją (`MiniReport`, `MiniAudit`, `KsefFlow`), są SSR-safe: czysta funkcja `props → JSX`, a Motion jest wyłącznie w wrapperze (`<Reveal>`, `<ChartReveal>`) dodawanym dopiero w drzewie Reacta.

## Mechanizm awarii (dlaczego)

- `motion` 13.1.1 dodało „Guard animation `window` access in non-browser runtimes": wcześniejsze wersje wywracały `renderToStaticMarkup` w Node. Nawet z guardem import powiększa `dist-ssr` i wprowadza do shellu inline `style` z wartościami `initial` (`opacity:0` w HTML dla botów, motion-dev §8.2).
- `entry.tsx` ma w nagłówku kontrakt: „Zero window/document, zero dat, zero losowości: czysty render". Złamanie go psuje build na CI Cloudflare Pages (brak przeglądarki), a build jest jedyną bramką przed publikacją.
- Druga implementacja prezentacji w shellu (ręczna proza w `entry.tsx:103-417` dziś) to dryf: treść shellu rozjeżdża się z DOM po React. Reguła wymusza „shell z danych", a Motion trzymany w wrapperach pozwala współdzielić komponent bez wciągania biblioteki do SSR.

## Niepoprawnie

```tsx
// src/prerender/entry.tsx
import { Hero } from "@/components/Hero";          // Hero importuje HeroMedia (matchMedia, <video>) i m.* przez Reveal
import { MetricsStrip } from "@/components/MetricsStrip";  // zawiera <Counter> (useInView, animate)
```

```tsx
// src/components/MiniReport.tsx (współdzielony, ale niepoprawnie)
import * as m from "motion/react-m";
export function MiniReport({ rows }: Props) {
  const width = window.innerWidth;                  // crash w Node / niedeterminizm
  return <m.svg initial={{ opacity: 0 }} animate={{ opacity: 1 }}>…</m.svg>;
}
```

## Poprawnie

```tsx
// src/components/MiniReport.tsx: czysty, SSR-safe
import { aggregate } from "@/lib/report";
import { DEMO_SAMPLE } from "@/data/demo-sample";
export function MiniReport({ lang }: { lang: Lang }) {
  const agg = aggregate(parseCsv(DEMO_SAMPLE[lang]).rows);   // deterministyczne, bez window
  return <svg viewBox="0 0 320 120" width={320} height={120} role="img" aria-label={…}>…</svg>;
}

// src/components/Bento.tsx (tylko w drzewie Reacta): wrapper z Motion wokół czystego komponentu
<Reveal><MiniReport lang={lang} /></Reveal>

// src/prerender/entry.tsx: shell używa czystego komponentu bezpośrednio
import { MiniReport } from "@/components/MiniReport";
function HomeShell({ lang }: { lang: Lang }) {
  return <main id="main"><section>…<MiniReport lang={lang} />…</section></main>;
}
```

## Test

```bash
# statycznie: entry.tsx i jego import graph
grep -nE 'from "motion|from "@/motion|from "three|@react-three|pdfmake' site/src/prerender/entry.tsx    # = 0
# graf importów (po build --ssr): bundle SSR nie zawiera motion
cd site && node node_modules/vite/bin/vite.js build --ssr src/prerender/entry.tsx --outDir dist-ssr --emptyOutDir >/dev/null && \
  grep -lE 'framer-motion|motion/react|LazyMotion|MotionConfig' dist-ssr/*.js ; cd ..           # = 0 plików
# komponenty współdzielone: brak window/document/matchMedia poza useEffect
for f in site/src/components/MiniReport.tsx site/src/components/MiniAudit.tsx site/src/components/KsefFlow.tsx; do
  [ -f "$f" ] && grep -nE '\b(window|document|navigator|matchMedia|requestAnimationFrame|IntersectionObserver)\b' "$f" | grep -v useEffect && echo "SSR-unsafe: $f"
done
# shell nie ma <video>/<canvas>
grep -rlE '<video|<canvas' site/dist --include=*.html     # = 0
# prerender przechodzi w Node bez przeglądarki
cd site && node scripts/prerender.mjs && cd ..            # exit 0; 19 plików HTML
```

Docelowo `scripts/verify-site.mjs` krok `ssr-clean` (grep na `dist-ssr`).

## Wyjątki

- `useLang`/`pick` z `src/i18n.tsx` są dozwolone w shellu (lang podawany jawnie jako prop, bez `localStorage` w renderze SSR).
- `Seo.tsx` eksportuje `ORG_JSONLD`/`toolJsonLd`/`faqPageJsonLd` (czyste dane) i te importy są dozwolone; sam komponent `<Seo>` (efekty DOM) nie jest renderowany w shellu.
