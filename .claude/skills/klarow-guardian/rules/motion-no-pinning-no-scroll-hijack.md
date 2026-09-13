---
id: motion-no-pinning-no-scroll-hijack
title: Scroll-hijack zakazany bez wyjątku; scena sticky dozwolona warunkowo (≤ 2 na trasę, ≤ 300vh, gałąź reduced-motion); parallax, marquee, karuzele i własny kursor dalej zakazane
impact: BLOCKER
tags: [motion, product-decision, seo, a11y, scroll, sticky]
source: decyzja Karola 2026-07-26 (deck usunięty) i 2026-07-22 (karuzela usunięta) · decyzja Karola 2026-09-13 (sticky-scena odblokowana dla warstwy narracyjnej; hijack zostaje zakazany) · CLAUDE.md „Architektura strony" · synthesis §1.6/§1.7 p.14/§2.4.7 · taste §7.5/§7.7 · motion-dev §0 p.11
added: 2026-09-12
---

## Zasada

Stary zapis sklejał dwa różne pojęcia w jeden zakaz („zero pinowania i scroll-hijacku"). Rozdzielamy je,
bo tylko jedno z nich odbiera użytkownikowi kontrolę.

### A. Scroll-hijack: ZAKAZANY, bez trybu „po decyzji"

Na wszystkich trasach (`/`, `/narzedzia`, `/narzedzia/:slug`, `/oferta`, `/faq`, `/rodo`, `404`) i niezależnie
od techniki (Motion, CSS, GSAP, three.js, wideo) zakazane są:

- przechwytywanie zdarzeń wejścia: listenery `wheel`, `touchmove`, `scroll`, `keydown` z `preventDefault()`,
- blokowanie przewijania dokumentu: `overflow: hidden` na `html`/`body` poza otwartym `<dialog>`,
- przewijanie sterowane skryptem: `scrollTo`/`scrollIntoView` w pętli rAF, smooth-scroll z inercją
  (Lenis, Locomotive), `scroll-behavior: smooth` narzucone globalnie,
- slajdy przełączane gestem: deck, karuzela, orbita, horizontal-pan sterowany pionowym scrollem,
- `window.addEventListener("scroll", …)`, `window.scrollY`/`scrollTop` w stanie React, pętle rAF piszące do `useState`.

Zakazane pozostają także (osobne decyzje produktowe, nieobjęte odblokowaniem sticky): parallax na tle i obrazach
(`background-attachment: fixed`, `useTransform` na warstwie tła), marquee/ticker i „kinetyczna typografia",
własny kursor (`Cursor` z Motion+, `cursor: none`), magnetyczne przyciski.

### B. Sticky: DOZWOLONY warunkowo, bo nie odbiera kontroli

`position: sticky` w kontenerze o JAWNEJ wysokości, w którym użytkownik scrolluje normalnie, a treść zmienia
się wraz z postępem (wykres się buduje, kroki procesu się odsłaniają), jest dozwolony. Pasek przewijania
zachowuje się zwyczajnie, „Znajdź na stronie" działa, historia przewijania i `ScrollToTop` działają.

Limity, wszystkie twarde:

1. **najwyżej DWIE sceny sticky na trasę** (licząc każdy kontener z torem, nie licząc navbara i `thead`),
2. **każda scena ≤ 300vh** wysokości kontenera (tor krótszy = mniej czekania na treść),
3. **obowiązkowa gałąź reduced-motion**: przy `prefers-reduced-motion: reduce` kontener wraca do
   `height: auto`, element przestaje być `sticky` (`position: static`), a treść pokazuje **stan końcowy**
   (nie początkowy, nie pusty),
4. **odczyt postępu wyłącznie pasywny**: `useScroll({ target, offset })` + `useTransform` w
   `site/src/motion/scroll/**` albo CSS `animation-timeline: view()`/`scroll()` w `globals.css`; żadnego
   własnego listenera (patrz A),
5. tylko właściwości akcelerowane (`motion-gpu-props-only`), `will-change` zdejmowane po scenie
   (`motion-cleanup-required`),
6. scena nie zaczyna się nad foldem i nie ukrywa treści obecnej w shellu prerenderu
   (`motion-no-initial-hidden-above-fold`); na `pointer: coarse` scena albo działa tak samo, albo degraduje
   się do stanu końcowego, nigdy do pustego ekranu.

Dozwolone poza scenami: zwykły scroll dokumentu, `whileInView`/`IntersectionObserver` do jednorazowych wejść,
`position: sticky` dla navbara i nagłówków tabel w dashboardach, natywny `scroll-snap` w poziomej liście na
`pointer: coarse` (tylko w trybie `tool`, nigdy na home).

Zmiana zakresu A wymaga wpisu w `docs/plan/plan-strategiczny.md` podpisanego przez Karola i Pawła oraz
aktualizacji tego pliku. Zakres B odblokowała decyzja Karola z 2026-09-13 (wiersz w
`references/decisions-log.md`); rozszerzenie limitów z §B wymaga nowej decyzji, nie oceny agenta.

## Mechanizm awarii (dlaczego)

- **Dlaczego hijack zostaje zakazany.** Deck (slajdy przełączane scrollem) został skasowany 2026-07-26, bo
  „rozbicie na trasy o odrębnej intencji jest lepsze pod SEO", a karuzela orbitalna 2026-07-22 („usuń te koła").
  Wspólny mianownik obu: gest użytkownika znaczył co innego, niż użytkownik chciał. Hijack łamie a11y
  (czytniki, klawiatura), psuje „Znajdź na stronie", historię przewijania i `ScrollToTop` przy zmianie trasy,
  a na telefonie zamienia przewijanie w loterię.
- **Dlaczego sticky wraca.** Karol 2026-09-13: „Bardzo liczyłem na motion grafiki, typu że podczas
  scrollowania buduje się jakiś wykres". Scena sticky, w której użytkownik scrolluje normalnie, nie odbiera
  kontroli: zatrzymany scroll zatrzymuje ruch, scroll w tył go cofa, a klawiatura i czytnik dalej przechodzą
  przez treść. Zakaz sticky był zakazem estetycznym doklejonym do zakazu hijacku i kosztował stronę, której
  founder nie chce pokazywać klientom.
- Limit 2 × 300vh pilnuje tego, co pierwotnie uzasadniało zakaz: scena 300dvh opóźnia pierwszy dowód
  o trzy viewporty, a trzy takie sceny robią z landingu przewijankę bez treści.
- `addEventListener("scroll")` w React = re-render co klatkę; taste §7.5 wpisuje to na listę zakazanych.
  `useScroll` czyta postęp pasywnie (Motion używa `ScrollTimeline`/pasywnego listenera wewnątrz biblioteki),
  więc nie generuje re-renderów Reacta — dlatego wolno go użyć w warstwie `motion/scroll/**`, a ręcznego
  listenera nie wolno nigdzie.
- Parallax zostaje zakazany osobno: to ruch tła nieskorelowany z treścią, motion values poza `MotionConfig`
  (reduced motion ich nie wyłącza) i ryzyko pomiarów pod `zoom` roota; persona (CFO firmy produkcyjnej) czyta
  parallax jako „agencja", nie „kalkulator".

## Niepoprawnie

```tsx
// hijack: własny listener + przewijanie sterowane skryptem
useEffect(() => {
  const onWheel = (e: WheelEvent) => { e.preventDefault(); goToSlide(dir(e)); };
  window.addEventListener("wheel", onWheel, { passive: false });
  return () => window.removeEventListener("wheel", onWheel);
}, []);

// hijack: pozycja scrolla w stanie React (re-render co klatkę)
useEffect(() => {
  const onScroll = () => setProgress(window.scrollY / document.body.scrollHeight);
  window.addEventListener("scroll", onScroll);
  return () => window.removeEventListener("scroll", onScroll);
}, []);

// scena bez gałęzi reduced i o torze 600vh (dwa limity złamane naraz)
<div ref={ref} style={{ height: "600vh" }}><div style={{ position: "sticky", top: 0 }}>…</div></div>
```

```css
html, body { overflow: hidden; }            /* relikt decka */
.hero { background-attachment: fixed; }     /* parallax CSS */
.marquee-track { animation: marquee 40s linear infinite; }
```

## Poprawnie

```tsx
// src/motion/scroll/StickyScene.tsx — jedna z najwyżej dwóch scen na trasę
// motion: demonstracja produktu — wykres buduje się w tempie czytelnika
export function StickyScene({ children }: { children: (p: MotionValue<number>) => ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // reduced motion: kontener bez toru (height:auto), treść w stanie końcowym
  if (reduce) return <div className="scene scene--static">{children(MOTION_ONE)}</div>;
  return (
    <div ref={ref} className="scene" style={{ height: "300vh" }}>
      <div className="scene-sticky">{children(scrollYProgress)}</div>
    </div>
  );
}
```

```css
.scene-sticky { position: sticky; top: 0; min-height: 100dvh; }
@media (prefers-reduced-motion: reduce) {
  .scene { height: auto; }                     /* tor znika */
  .scene-sticky { position: static; }           /* treść w stanie końcowym */
}
```

```tsx
// wejście jednorazowe poza sceną: whileInView + VIEWPORT_ONCE, bez toru scrolla
<m.section variants={fadeUp} initial="hidden" whileInView="show" viewport={VIEWPORT_ONCE}>…</m.section>

// logotypy i hasła: statyczna siatka zamiast marquee
<ul className="logo-grid">{items.map((it) => <li key={it.id}>{it.node}</li>)}</ul>

// dialog: blokada scrolla tylko przez natywny <dialog> (showModal) + CSS :modal, bez overflow:hidden na body
```

## Test

```bash
# ── A. scroll-hijack: zawsze 0 ──
grep -rnE 'addEventListener\(\s*["'"'"'](scroll|wheel|touchmove)["'"'"']' site/src
grep -rnE 'window\.scrollY|document\.documentElement\.scrollTop|scrollTop\b' site/src --include=*.tsx | grep -vE 'ScrollToTop|scrollTo\('
grep -rnE 'lenis|locomotive|smooth-scroll|scroll-behavior:\s*smooth' site/src -i
grep -rnE '(html|body)[^{]*\{[^}]*overflow:\s*hidden' site/src --include=*.css
grep -rnE 'marquee|ticker|Cursor\b|cursor:\s*none' site/src -i
grep -rnE 'background-attachment:\s*fixed' site/src
grep -rnE 'carousel|orbital|SlideDeck|\.deck\b|\.slide\b' site/src -i | grep -v 'ui/radial-orbital-timeline.tsx'   # zapas poza bundlem
grep -rnE 'radial-orbital-timeline|canvas-reveal-effect' site/src --include=*.tsx | grep import                     # = 0

# ── B. sticky: dozwolony w granicach ──
# 1) odczyt postępu tylko w warstwie narracyjnej
grep -rlE 'useScroll\(|useTransform\(|scrollYProgress' site/src --include=*.tsx --include=*.ts | grep -v '^site/src/motion/scroll/'   # = 0
# 2) sticky poza navbarem, tabelami i warstwą scroll (oczekiwane: 0)
grep -rnE 'position:\s*sticky|sticky' site/src --include=*.tsx --include=*.css | grep -vE 'Navbar|thead|th\b|table|kit-overflow|motion/scroll|scene-sticky'
# 3) tor sceny ≤ 300vh (każde trafienie musi być ≤ 300 i leżeć w kontenerze sceny)
grep -rnE 'height:\s*"?[0-9]+(vh|dvh)' site/src --include=*.tsx --include=*.css | grep -vE '\b(1|2|3)00(vh|dvh)'                      # = 0
# 4) ≤ 2 sceny na trasę (licznik per plik trasy; > 2 = FAIL)
for p in site/src/pages/*.tsx site/src/App.tsx; do echo "$p: $(grep -cE 'StickyScene' "$p")"; done
# 5) każda scena ma gałąź reduced w JS i w CSS
for f in site/src/motion/scroll/*.tsx; do grep -qE 'useReducedMotion' "$f" || echo "BRAK gałęzi reduced: $f"; done
grep -nE 'prefers-reduced-motion' -A6 site/src/styles/globals.css | grep -E 'height:\s*auto|position:\s*static'                        # ≥ 1, gdy istnieje scena
# 6) Playwright WebKit 390×844 i 1440×900: scroll całej trasy klawiaturą (PageDown) dochodzi do stopki;
#    z reducedMotion:"reduce" zrzut pokazuje treść sceny w stanie końcowym, a wysokość dokumentu spada
#    (tor sceny zniknął); „Znajdź na stronie" znajduje tekst ze sceny bez przewijania myszą.
```

Docelowo `node scripts/check-motion.mjs` sekcja `scroll`.

## Wyjątki

- `Navbar` `position: sticky`/`fixed` (jedna linia, 64/56 px) i nagłówki tabel dashboardów (`thead` sticky w scrollboxie) są dozwolone i NIE liczą się do limitu dwóch scen.
- `ScrollToTop` (scroll na górę przy zmianie trasy) to nawigacja, nie animacja; zostaje.
- `WipeCompare` (faza 2, podstrony dem) używa `clip-path` sterowanego suwakiem `<input type="range">`, nie scrollem; dozwolone i nie liczy się do limitu.
- Tryb `tool` (dashboardy, `DemoReport`, `demo/**`) nie ma scen sticky w ogóle: w narzędziu wynik jest natychmiastowy (`motion-charts-static` §A).
