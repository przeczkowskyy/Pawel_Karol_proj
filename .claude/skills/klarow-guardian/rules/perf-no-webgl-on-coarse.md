---
id: perf-no-webgl-on-coarse
title: Na pointer: coarse (telefony, tablety) zero canvasu WebGL, zero wideo autoplay, zero elementów fixed poza navem; tło = statyczny gradient .bg-layer
impact: BLOCKER
tags: [perf, mobile, ios, webgl, video]
source: CLAUDE.md „Stan operacyjny" 2026-07-24 (naprawa u źródła: canvas tylko desktop) i 2026-07-26 · site-audit §1.7 · synthesis §2.4.8 tabela degradacji/§2.4.9 fallback mobile · higgsfield §4.5 p.5 · feasibility-perf §9 p.7
added: 2026-09-12
---

## Zasada

Na urządzeniach z `matchMedia("(pointer: coarse)").matches === true` (iPhone, iPad, Android; także laptopy z dotykiem, gdy główne urządzenie wskazujące jest dotykowe):

1. Nie montuje się żaden `<canvas>` (WebGL ani 2D) poza ewentualnymi statycznymi SVG (`KsefFlow`, mini-wykresy) i wykresami dashboardów (SVG, nie canvas).
2. Nie montuje się żaden `<video>` z automatycznym odtwarzaniem; hero = poster `<img>` (`media-video-gating`).
3. Tło = `.bg-layer` ze statycznym gradientem stalowym (`globals.css:13-38`), bez żadnych dzieci.
4. Elementy `position: fixed`: tylko `Navbar` (i natywny `<dialog>`); nic nowego.
5. Reveale (`whileInView`, fadeUp 12 px), liczniki, `PageFade`, menu mobilne w `AnimatePresence` zostają (tanie, na kompozytorze).
6. Decyzja jest podejmowana raz, przez `matchMedia` w `useEffect` (SSR/prerender = `false`), nie przez User-Agent i nie przez szerokość okna (iPad w landscape ma 1024+ px, ale jest `coarse`).

Powrót animowanego tła na mobile (np. wzgórza z promocją warstw `translateZ(0)`) jest dopuszczalny WYŁĄCZNIE po potwierdzeniu na realnym iPhonie Karola (iOS 26) i po wpisie decyzji w CLAUDE.md „Stan operacyjny"; do tego czasu niezawodność > ozdoba.

## Mechanizm awarii (dlaczego)

- 2026-07-24: na iOS Safari kompozytor GPU komponował pełnoekranowy `fixed` canvas WebGL NAD rodzeństwem `fixed` (nav, deck, stopka): cała treść znikała mimo poprawnego z-index; software WebKit (Playwright na Windows) tego nie odtwarza, więc każda „weryfikacja Playwrightem" przechodziła, a telefon Karola pokazywał czarny ekran. Naprawa u źródła: brak canvasu na coarse.
- 2026-07-26 (przyczyna właściwa potwierdzona zrzutem `?debug=1`): `content-layer` z `z-index` uwięził `fixed` pod `overflow:hidden`. Oba incydenty mają wspólny mianownik: dodatkowe warstwy kompozycji na iOS = ryzyko nieodtwarzalne lokalnie. BLOCKER, bo to jedyna klasa błędu, która wyłączyła całą stronę u głównego kanału (LinkedIn → telefon).
- Dekoder wideo/GPU na telefonie = bateria, Low Power Mode blokuje autoplay i pokazuje przycisk play nad dekoracją; 1,5 MB na 4G to koszt bez zysku dla persony, która i tak nie klika w tło.
- Detekcja po szerokości pomija tablety i laptopy dotykowe; po UA jest krucha (iPadOS udaje macOS).

## Niepoprawnie

```tsx
const isMobile = window.innerWidth < 768;                       // iPad landscape = "desktop" → canvas na iOS
const ua = /iPhone|Android/.test(navigator.userAgent);          // iPadOS = "Macintosh"
{!isMobile ? <GLSLHills /> : null}
<video autoPlay muted playsInline loop className="fixed inset-0" />   // fixed w treści, autoplay na coarse
```

## Poprawnie

```tsx
// src/hooks/useCoarsePointer.ts
export function useCoarsePointer(): boolean {
  const [coarse, setCoarse] = useState(false);       // SSR/prerender: false; decyzja w efekcie
  useEffect(() => {
    const mq = matchMedia("(pointer: coarse)");
    const update = () => setCoarse(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return coarse;
}
// użycie: HeroMedia (wantsVideo sprawdza "(pointer: fine)"), plan B tła (useIdleDesktopBg sprawdza "(pointer: fine)")
```

```css
/* globals.css: tło mobile = to, co jest */
.bg-layer { position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: -1; pointer-events: none; background: radial-gradient(120% 85% at 50% 100%, rgba(168,180,194,.14) 0%, rgba(168,180,194,.05) 45%, rgba(18,18,18,0) 75%), #121212; isolation: isolate; }
```

## Test

```bash
# detekcja wyłącznie przez matchMedia pointer (oczekiwane: 0 dla UA/szerokości w kontekście mediów)
grep -rnE 'userAgent|innerWidth\s*<|matchMedia\("\(max-width' site/src --include=*.tsx --include=*.ts | grep -iE 'video|canvas|bg|hills|media'   # = 0
grep -rnE '\(pointer: (fine|coarse)\)' site/src | wc -l      # ≥ 1 (HeroMedia; App.tsx w planie B)
# runtime: Playwright WebKit iPhone 390×844 (hasTouch: true, isMobile: true) na dist przez vite preview, każda z 19 tras:
#   document.querySelector("canvas") === null; [...document.querySelectorAll("video")].filter(v => !v.paused).length === 0;
#   [...document.querySelectorAll("*")].filter(e => getComputedStyle(e).position === "fixed").map(e => e.className) ⊆ {navbar, bg-layer}
#   document.elementFromPoint(195, 422) należy do treści (nie do .bg-layer, nie do canvas)
# realny iPhone Karola po każdej zmianie w hero/tle/globals.css: pełna treść; zrzut ?debug=1 w razie wątpliwości.
```

Docelowo `scripts/verify-site.mjs` krok `coarse` (WebKit ze scratchpadu; pakiet `playwright-core` + `executablePath` do `~/AppData/Local/ms-playwright/webkit-*`, bo scratchpad nie ma `&` w ścieżce).

## Wyjątki

- Wykresy dashboardów są SVG; jeśli kiedyś dashboard potrzebowałby `<canvas>` 2D (np. heatmapa 10 k komórek), to tylko w trybie `tool`, bez `fixed`, z `IntersectionObserver` pauzą i osobną decyzją; na stronie marketingowej nadal 0.
