---
id: motion-no-pinning-no-scroll-hijack
title: Zakaz produktowy pinowania, sticky-scen, horizontal-pan, parallaxu, marquee, scroll-hijack i własnego kursora
impact: BLOCKER
tags: [motion, product-decision, seo, a11y, scroll]
source: decyzja Karola 2026-07-26 (deck usunięty) i 2026-07-22 (karuzela usunięta) · CLAUDE.md „Architektura strony" · synthesis §1.6/§1.7 p.14/§2.4.7 · showreel M3/M5 (przepisane na zakaz) · taste §7.5/§7.7 · motion-dev §0 p.11
added: 2026-09-12
---

## Zasada

Na landingu klarow.com (wszystkie trasy `/`, `/narzedzia`, `/narzedzia/:slug`, `/oferta`, `/faq`, `/rodo`) NIEZALEŻNIE OD TECHNIKI (Motion, CSS `animation-timeline`, GSAP, `position: sticky` z torem, three.js, wideo sterowane scrollem) zakazane są:

- sceny pinowane (`sticky` + kontener o wysokości N × 100vh, „scrollytelling", `PinnedScene`),
- horizontal-pan / poziome przewijanie sterowane pionowym scrollem,
- scroll-hijack: przechwytywanie `wheel`/`touchmove`/klawiszy, smooth-scroll z inercją (Lenis i podobne), `overflow: hidden` na `html`/`body` poza otwartym dialogiem,
- parallax (`useScroll` + `useTransform` na tle/obrazie, `background-attachment: fixed`),
- marquee/ticker (logotypy, hasła) i „kinetyczna typografia",
- własny kursor (`Cursor` z Motion+, `cursor: none`), magnetyczne przyciski,
- karuzele/orbity/decki slajdów (historia: karuzela orbitalna i deck usunięte na polecenie Karola),
- `window.addEventListener("scroll", ...)`, `window.scrollY`/`scrollTop` w stanie React, pętle rAF piszące do `useState`.

Dozwolone: zwykły scroll dokumentu, `whileInView`/`IntersectionObserver` do jednorazowych wejść, `position: sticky` WYŁĄCZNIE dla navbara i nagłówków tabel w dashboardach (bez toru), natywny `scroll-snap` w poziomej liście na `pointer: coarse` (tylko w trybie `tool`, nigdy na home).

Ta reguła nie ma trybu „po decyzji": zmiana wymaga wpisu w `docs/plan/plan-strategiczny.md` podpisanego przez Karola i Pawła oraz aktualizacji tego pliku.

## Mechanizm awarii (dlaczego)

- Decyzja Karola 2026-07-26: deck (slajdy przełączane scrollem) usunięty, bo „rozbicie na trasy o odrębnej intencji jest lepsze pod SEO"; 2026-07-22: karuzela orbitalna usunięta („usuń te koła"). Sędzia marki (brand-icp) zdyskwalifikował showreel właśnie za scenę pinowaną. Każdy powrót do tych wzorców to powrót do już odrzuconej decyzji.
- Scena pinowana 300dvh opóźnia pierwszy dowód o ~3 viewporty na desktopie i nie działa na mobile (główny kanał wejść z LinkedIn).
- Scroll-hijack łamie a11y (czytniki, klawiatura, `prefers-reduced-motion`), psuje „Znajdź na stronie", historię przewijania i `ScrollToTop` przy zmianie trasy.
- Parallax = motion values poza `MotionConfig` (reduced motion ich nie wyłącza) + 12,9 KB hooków + ryzyko pomiarów pod `zoom` roota. Persona (CFO firmy produkcyjnej) czyta parallax jako „agencja", nie „kalkulator".
- `addEventListener("scroll")` w React = re-render co klatkę; taste §7.5 wpisuje to na listę zakazanych.

## Niepoprawnie

```tsx
// PinnedScene.tsx
const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
const y = useTransform(scrollYProgress, [0, 1], [24, -24]);
<div ref={ref} style={{ height: "300vh" }}><div style={{ position: "sticky", top: 0, height: "100vh" }}>…</div></div>
```

```tsx
useEffect(() => {
  const onScroll = () => setProgress(window.scrollY / document.body.scrollHeight);
  window.addEventListener("scroll", onScroll);
  return () => window.removeEventListener("scroll", onScroll);
}, []);
```

```css
html, body { overflow: hidden; }            /* relikt decka */
.hero { background-attachment: fixed; }     /* parallax CSS */
.marquee-track { animation: marquee 40s linear infinite; }
```

## Poprawnie

```tsx
// wejście jednorazowe: whileInView + VIEWPORT_ONCE, bez toru scrolla
<m.section variants={fadeUp} initial="hidden" whileInView="show" viewport={VIEWPORT_ONCE}>…</m.section>

// logotypy/hasła: statyczna siatka zamiast marquee
<ul className="logo-grid">{items.map((it) => <li key={it.id}>{it.node}</li>)}</ul>

// dialog: blokada scrolla tylko przez natywny <dialog> (showModal) + CSS :modal, bez overflow:hidden na body
```

## Test

```bash
# wszystkie oczekiwane: 0
grep -rnE 'useScroll\(|useTransform\(|useVelocity\(|useSpring\(' site/src --include=*.tsx --include=*.ts
grep -rnE 'addEventListener\(\s*["'"'"'](scroll|wheel|touchmove)["'"'"']' site/src
grep -rnE 'window\.scrollY|document\.documentElement\.scrollTop|scrollTop\b' site/src --include=*.tsx | grep -vE 'ScrollToTop|scrollTo\('
grep -rnE 'position:\s*sticky|sticky' site/src --include=*.tsx --include=*.css | grep -vE 'Navbar|thead|th\b|table|kit-overflow'
grep -rnE 'height:\s*"?[2-9]00(vh|dvh)|animation-timeline|scroll-timeline|background-attachment:\s*fixed' site/src
grep -rnE 'marquee|ticker|Cursor\b|cursor:\s*none|lenis|locomotive|smooth-scroll' site/src -i
grep -rnE '(html|body)[^{]*\{[^}]*overflow:\s*hidden' site/src --include=*.css
grep -rnE 'carousel|orbital|SlideDeck|\.deck\b|\.slide\b' site/src -i | grep -v 'ui/radial-orbital-timeline.tsx'   # zapas poza bundlem
# zapas poza bundlem: radial-orbital-timeline nie może być importowany
grep -rnE 'radial-orbital-timeline|canvas-reveal-effect' site/src --include=*.tsx | grep import   # = 0
```

Docelowo `node scripts/check-motion.mjs` sekcja `scroll`.

## Wyjątki

- `Navbar` `position: sticky`/`fixed` (jedna linia, 64/56 px) i nagłówki tabel dashboardów (`thead` sticky w scrollboxie) są dozwolone.
- `ScrollToTop` (scroll na górę przy zmianie trasy) to nawigacja, nie animacja; zostaje.
- `WipeCompare` (faza 2, podstrony dem) używa `clip-path` sterowanego suwakiem `<input type="range">`, nie scrollem; dozwolone.
