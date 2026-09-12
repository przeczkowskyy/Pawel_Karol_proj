---
id: motion-no-initial-hidden-above-fold
title: Treść obecna w shellu prerenderu nie może startować ukryta: initial={false} nad foldem
impact: BLOCKER
tags: [motion, prerender, seo, lcp, hero]
source: motion-dev §8.1/§8.2 · synthesis §2.4.3/§2.4.7 · showreel M6 · feasibility-perf §5.2 p.3 · taste §7.4 (uwaga o prerenderze)
added: 2026-09-12
---

## Zasada

Architektura: `scripts/prerender.mjs` wstrzykuje statyczny shell do `<div id="root">`, a `main.tsx` robi `createRoot().render()` (podmiana, nie hydratacja). Wszystko, co shell już pokazał, po starcie Reacta MUSI pojawić się natychmiast w stanie końcowym:

- H1, lead, CTA hero, poster `<img>`: `initial={false}` albo brak `m.*` w ogóle,
- liczby paska „W liczbach" i mini-komponenty S2 renderowane w SSR: bez `ChartReveal`, bez licznika od 0 przy pierwszym montażu (licznik startuje tylko po `useInView`, a element jest poniżej folda),
- `PageFade`: `initial={false}` przy pierwszym montażu (`const [firstPath] = useState(() => pathname)`; animacja tylko gdy `pathname !== firstPath`),
- `whileInView` wyłącznie na elementach poniżej folda (`amount ≤ 0.25`, `margin: "0px 0px -10% 0px"`), nigdy na sekcji S1,
- `ChartReveal` (clip-reveal) wyłącznie poniżej folda i wyłącznie na treści, której NIE MA w shellu (dashboardy montowane lazy).

Po buildzie żaden plik `dist/**/*.html` nie zawiera `opacity:0`, `opacity: 0`, `clip-path: inset(0 100%` ani `visibility:hidden` na elementach z treścią tekstową.

## Mechanizm awarii (dlaczego)

- Sekwencja użytkownika: tekst (shell) → pusto (pierwsza klatka Reacta z `initial={{ opacity: 0 }}`) → fade-in. Na szybkim łączu 100–300 ms migotania, na wolnym sekundy „znikającego hero". To dokładnie ten błąd, który sędzia wykonalności wpisał proof jako wadę (feasibility-perf §5.2 p.3).
- LCP: Chrome liczy największy element w viewporcie; jeśli H1 zniknie i wróci, kandydat LCP przesuwa się na późniejszą klatkę.
- Gdyby kiedyś shell był hydrowany (`hydrateRoot`), `initial={{ opacity: 0 }}` wylądowałoby w HTML jako `style="opacity:0"`: boty bez JS (LLM-y, część crawlerów) zobaczą tekst niewidoczny. Reguła chroni także tę przyszłość.
- Googlebot z JS renderuje pierwszy stan Reacta: elementy `whileInView` poniżej folda mają `opacity:0` do czasu przewinięcia; indeksacja treści działa, ale zrzuty w GSC wyglądają pusto. Stąd `amount ≤ 0.25` i mały ujemny margines (reveal odpala się wcześnie).

## Niepoprawnie

```tsx
// Hero.tsx
<m.section variants={group} initial="hidden" animate="show">
  <m.h1 variants={fadeUp}>{pick(lang, MESSAGING.oneLiner)}</m.h1>      // shell już to pokazał → mignięcie
</m.section>

// PageFade.tsx
const first = useRef(true);
const initial = first.current ? false : { opacity: 0 };   // mutacja ref w renderze; StrictMode renderuje 2× i psuje flagę
first.current = false;

// MetricsStrip.tsx (S5) z ChartReveal na treści SSR
<ChartReveal><MiniBars data={aggregate(DEMO_SAMPLE)} /></ChartReveal>   // słupki znikają i wjeżdżają po podmianie shellu
```

## Poprawnie

```tsx
// Hero.tsx: zero animacji wejścia na treści; jedyny ruch to crossfade poster → wideo w HeroMedia
export function Hero() {
  return (
    <section className="hero">
      <HeroMedia />
      <h1>{pick(lang, MESSAGING.oneLiner)}</h1>
      <p>{pick(lang, MESSAGING.subtext)}</p>
      <div className="hero-cta">…</div>
    </section>
  );
}

// PageFade.tsx (bez mutacji ref w renderze)
export function PageFade({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const [firstPath] = useState(() => pathname);
  const initial = pathname === firstPath ? false : { opacity: 0, y: 6 };
  return (
    <m.div key={pathname} initial={initial} animate={{ opacity: 1, y: 0 }} transition={{ duration: DUR.base, ease: EASE_STD }}>
      {children}
    </m.div>
  );
}

// sekcje poniżej folda
<m.ul variants={group} initial="hidden" whileInView="show" viewport={VIEWPORT_ONCE}>…</m.ul>
```

## Test

```bash
# po `npm run build` (z katalogu site/): shell nie ukrywa treści
grep -rlE 'opacity:\s*0[;"]|clip-path:\s*inset\(0 100%|visibility:\s*hidden' site/dist --include=*.html      # = 0 plików
# hero bez m.* i bez whileInView
grep -nE '<m\.|whileInView|initial=' site/src/components/Hero.tsx site/src/components/HeroMedia.tsx | grep -v 'initial={false}'   # = 0
# PageFade: brak mutacji ref w renderze
grep -nE '\.current\s*=\s*false' site/src/motion/PageFade.tsx    # = 0
grep -nE 'useState\(\(\) => pathname\)' site/src/motion/PageFade.tsx   # = 1
# viewport: amount ≤ 0.25 wszędzie
grep -rnE 'amount:\s*(0\.[3-9]|1|"all")' site/src --include=*.tsx | grep -v 'Counter.tsx'   # = 0 (Counter ma 0.6 celowo)
# Playwright WebKit bez JS (javaScriptEnabled:false) na dist/index.html: H1 i lead widoczne (computed opacity 1);
# z JS: zrzut w 50 ms i 400 ms po DOMContentLoaded → H1 obecny na obu (brak klatki „pusto").
```

Docelowo `scripts/verify-site.mjs` krok `shell-visible` + bramka shell-vs-DOM (faza 3).

## Wyjątki

- Elementy, których NIE MA w shellu (menu mobilne, `BookingDialog`, dashboard po `DashboardMount`), mogą mieć `initial` ukryte: nie ma czego migać.
- `Counter` ma `useInView(amount: 0.6)`: to próg STARTU liczenia, nie reveal; liczba w shellu jest wpisana na stałe i po podmianie React renderuje `0` dopiero gdy element wejdzie w 60 % widoczności. Element paska S5 jest poniżej folda na wszystkich breakpointach (sprawdzić przy zmianie układu home).
