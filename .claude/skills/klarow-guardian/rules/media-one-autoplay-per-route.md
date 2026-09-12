---
id: media-one-autoplay-per-route
title: Najwyżej jedno automatycznie odtwarzane wideo i jedno ruchome tło na trasę; nigdy oba naraz
impact: BLOCKER
tags: [media, video, autoplay, background, performance]
source: synthesis §0 p.7/§2.4.4/§2.6.3 („nigdy dwa ruchome tła na trasie") · showreel M7 · higgsfield §6.1 A · WIG (vercel.md §6.4) · CLAUDE.md #2 · decyzje D35/D36/D37 (2026-09-12 wieczór) · docs/plan/warstwa-wrazenia.md
added: 2026-09-12
---

## Zasada

Na każdej trasie (`/`, `/narzedzia`, `/narzedzia/:slug`, `/oferta`, `/faq`, `/rodo`, `404`) w DOM po starcie Reacta jest:

- **≤ 1 element `<video>` z automatycznym odtwarzaniem, i to wyłącznie na trasie `/`** (`HeroMedia`), wyłącznie przy `pointer: fine` i wyłącznie po `window.load`; na **18 pozostałych trasach twarde 0** (samo „≤ 1 na trasę" formalnie dopuszczałoby klip na `/oferta`),
- **treścią tego jedynego autoodtwarzania jest NAGRANIE PRAWDZIWEGO NARZĘDZIA** (`record-demos.mjs`), nie pętla generatywna (D37): pętla zajęłaby slot dowodu i zostawiła hero bez treści. Nagranie hero gra **raz**, bez `loop`, i zatrzymuje się na ostatniej klatce,
- ≤ 1 ruchome tło łącznie (wideo LUB canvas WebGL `GLSLHills` LUB nic); wideo hero i GLSL Hills nigdy razem. W v1 `three` jest poza `dependencies`, więc realnie: tylko wideo,
- **klipy hover ściany S3 (v1: dokładnie cztery, pierwszy rząd po featured) nie liczą się jako autoplay**, bo startują wyłącznie z intencji użytkownika (`mouseenter` z progiem 120 ms albo `focus-visible`), ale **maksimum jeden gra jednocześnie** (singleton modułowy), a hero jest w tym czasie **zapauzowane** przez `IntersectionObserver`: nigdy dwa dekodery naraz,
- pętle sekcyjne, tła podstron („tło-pętla /oferta", „/narzedzia") NIE POWSTAJĄ (synthesis §2.6.1 „Co NIE powstaje generatywnie").

Wideo nie jest treścią: `aria-hidden="true"`, `tabIndex={-1}`, zero NATYWNYCH kontrolek (`controls`), zero dźwięku, a strona bez niego niczego nie traci (test: zdejmij `<video>` → treść i CTA identyczne).

Jedyny element sterujący, jaki przy wideo MUSI istnieć, to przycisk pauzy (`hero-media-toggle`, etykieta „Zatrzymaj podgląd / Pause preview": wideo hero nie jest tłem, tylko podglądem narzędzia) renderowany POZA kontenerem `aria-hidden` — wymóg WCAG 2.2.2 (Pause, Stop, Hide) dla pętli > 5 s i zapis planu (`docs/plan/strona-v2-plan.md:384`); pełna specyfikacja w `media-video-embed-spec` (p. „kontrola pauzy"). Przycisk nie jest kontrolką odtwarzacza (zero `controls`, zero paska postępu, zero dźwięku) i nie liczy się jako „druga kontrolka".

## Mechanizm awarii (dlaczego)

- Dwa dekodery wideo lub wideo + WebGL na laptopie zintegrowanym = spadek fps całej strony i grzanie; na iOS drugi kontekst GPU zwiększa ryzyko powrotu buga „samo tło" (2026-07-24: kompozycja `fixed` canvasu nad treścią).
- WCAG 2.2.2 / WIG: pętla > 5 s obok treści wymaga mechanizmu pauzy — BEZ wyjątku dla dekoracji. `aria-hidden` chowa wideo przed czytnikiem ekranu, ale nie przed osobą z zaburzeniami uwagi/przedsionkowymi, która NIE ma włączonego `prefers-reduced-motion` (norma zna tylko wyjątek „essential", a tło nim nie jest). Pętla hero ma 6–10 s (`media-video-budgets`), więc kryterium stosuje się wprost.
- Dwa autoplay czynią stronę „reklamą", nie wizytówką wykonawcy narzędzi.
- Budżet transferu `/` desktop ≤ 2,5 MB z nagraniem hero (`media-video-budgets`); drugie autoodtwarzane wideo wysadza budżet i podwaja ryzyko kompozycji na iOS.
- Higgsfield: każdy dodatkowy klip to 70–280 kr i osobna spójność stylu; synteza zamroziła komplet v1 na 1 klip.

## Niepoprawnie

```tsx
// App.tsx: wideo hero + GLSL Hills razem
{animatedBg ? <BgBoundary><GLSLHills … /></BgBoundary> : null}
<Hero><HeroMedia /></Hero>

// OfferPage.tsx: drugi klip jako tło sekcji
<section className="offer-hero"><video autoPlay muted loop playsInline src="/media/offer-v1.mp4" /></section>
```

## Poprawnie

```tsx
// App.tsx (plan A: hero-loop; GLSL Hills zdjęty z bundla)
<Hero><MediaBoundary><HeroMedia /></MediaBoundary></Hero>

// App.tsx (plan B po D-08: GLSL Hills wraca, HeroMedia renderuje TYLKO poster)
const bg = useAnimatedBg() && MEDIA_ENABLED;   // pointer: fine, po idle po load, saveData gate
{bg ? <BgBoundary><Suspense fallback={null}><GLSLHills … /></Suspense></BgBoundary> : null}
<Hero><HeroMedia videoAllowed={false} /></Hero>
```

## Test

```bash
# kod: <video> wyłącznie w HeroMedia (faza 1) i ewentualnie CaseFrame (hover-klipy, faza 2)
grep -rlE '<video' site/src | grep -vE 'components/HeroMedia\.tsx|components/ToolWall\.tsx'     # = 0 (v1: hero + klipy hover ściany)
grep -rnE 'autoPlay' site/src | grep -v 'HeroMedia.tsx'                                          # = 0 (HeroMedia i tak używa play() po gate, nie autoPlay)
# dwa ruchome tła: GLSLHills i HeroMedia z wideo nie mogą być jednocześnie aktywne
grep -nE 'GLSLHills' site/src/App.tsx && grep -nE 'videoAllowed=\{false\}|MEDIA_ENABLED' site/src/App.tsx   # jeśli GLSL jest, HeroMedia bez wideo
# runtime (Playwright WebKit desktop 1440×900, każda z 19 tras):
#   document.querySelectorAll("video:not([paused])").length ≤ 1 i document.querySelectorAll("canvas").length + (videos>0?1:0) ≤ 1
# shell: zero <video> w dist/**/*.html
grep -rlE '<video' site/dist --include=*.html    # = 0
# przycisk pauzy tła istnieje dokładnie tam, gdzie jest autoplay (WCAG 2.2.2)
grep -rlE 'hero-media-toggle' site/src/components/HeroMedia.tsx   # = 1 plik
```

Docelowo `scripts/verify-site.mjs` krok `media-one-autoplay-per-route` (WebKit ze scratchpadu, jak w sesji 2026-07-24).

## Wyjątki

- Klipy hover S3 (v1, D35): ≤ 4 elementy `<video preload="none">` w DOM, żaden nie odtwarza się bez `mouseenter` (próg intencji 120 ms) ani `focus-visible`; test liczy tylko `!paused`. Wymagane dodatkowo: `pointer-events: none` na elemencie (kafel zostaje jednym `<a>`: `seo-links-in-dom`) i `pointer: fine` (na dotyku hover nie istnieje, a tap ma otwierać podstronę).
