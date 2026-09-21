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

- **≤ 1 element `<video>` GRAJĄCY JEDNOCZEŚNIE, i to wyłącznie na trasie `/`**, wyłącznie przy `pointer: fine` i wyłącznie po `window.load`; na **18 pozostałych trasach twarde 0** (samo „≤ 1 na trasę" formalnie dopuszczałoby klip na `/oferta`),

  **POWRÓT DO D37 2026-09-21 (decyzja Karola: „Musimy wrócić do punktu wyjścia").**
  Wyjątek z 15 września na osiem paneli z pętlami generatywnymi **WYGASŁ razem
  z prezentacją**: `src/presentation/**` i `loopConductor.ts` nie istnieją, trasa `/`
  jest znów zwykłym landingiem. Obowiązuje pierwotne brzmienie: na `/` gra
  **jedno nagranie prawdziwego narzędzia w hero** (`components/HeroMedia.tsx`,
  `hero-production-v1.webm/mp4`), raz, bez `loop`, zatrzymane na ostatniej klatce.
  **Mechanizm awarii jest niezmienny od pierwszej wersji reguły** (dwa dekodery =
  spadek fps i grzanie, na iOS dodatkowy kontekst GPU), więc „jeden naraz" nigdy
  nie było negocjowalne — negocjowalna była tylko liczba elementów w DOM i ta
  negocjacja właśnie się skończyła.
- **treść tego odtwarzania:** wyłącznie nagranie prawdziwego narzędzia (D37).
  Pętla generatywna na jakiejkolwiek trasie jest złamaniem reguły — trzy podejścia
  (13.09 kreskówka, 15.09 pętle, 17.09 instrument) founder odrzucił, a materiał
  generatywny został wycofany ze strony w całości.
- ≤ 1 ruchome tło łącznie (wideo LUB canvas WebGL `GLSLHills` LUB nic); wideo hero i GLSL Hills nigdy razem.

  **⚠️ TEN PUNKT JEST DZIŚ ZŁAMANY I JEST TO DŁUG ZASTANY, NIE REGRESJA.**
  Zmierzone w Chromium 2026-09-21 na `dist`, 1440×900: `/` ma **jedno grające
  `<video>` (`hero-production-v1.webm`, `currentTime` 3,2 s) ORAZ jeden canvas
  WebGL 1440×900** — dwie ruchome warstwy naraz, dokładnie to, czego punkt
  zabrania. Wcześniejsze brzmienie tej reguły tłumaczyło się zdaniem „w v1 `three`
  jest poza `dependencies`, więc realnie: tylko wideo" — **to zdanie nigdy nie było
  prawdziwe**: `three` stoi w `site/package.json` i `App.tsx` renderuje `<GLSLHills>`
  przy `pointer: fine`. Reguła opisywała stan zamierzony, nie zmierzony, i dlatego
  nie złapała tego przez dziewięć dni.
  Na `pointer: coarse` konfliktu nie ma: canvas się nie renderuje (bug kompozytora
  iOS, `useAnimatedBg`), a wideo jest odcięte przez `(pointer: fine)`.
  **Do rozstrzygnięcia przez foundera, bo to wybór wyglądu, nie usterka do cichej
  naprawy:** albo tło WebGL schodzi z `/` (zostaje gradient `.bg-layer`, wideo hero
  gra), albo wideo hero schodzi do kadru statycznego (`HeroPoster`, wzgórza zostają).
  Tańsza i mniej widoczna jest druga droga — kadr i tak jest elementem LCP.
- **klipy hover ściany S3 (v1: dokładnie cztery, pierwszy rząd po featured) nie liczą się jako autoplay**, bo startują wyłącznie z intencji użytkownika (`mouseenter` z progiem 120 ms albo `focus-visible`), ale **maksimum jeden gra jednocześnie** (singleton modułowy), a hero jest w tym czasie **zapauzowane** przez `IntersectionObserver`: nigdy dwa dekodery naraz,
- pętle sekcyjne i tła PODSTRON („tło-pętla /oferta", „/narzedzia") NIE POWSTAJĄ (synthesis §2.6.1 „Co NIE powstaje generatywnie"). Wyjątek z 2026-09-15 na panele prezentacji **wygasł 2026-09-21 razem z prezentacją**; dopisanie pętli na JAKIEJKOLWIEK trasie, włącznie z `/`, jest dziś złamaniem reguły.

Wideo nie jest treścią: `aria-hidden="true"`, `tabIndex={-1}`, zero NATYWNYCH kontrolek (`controls`), zero dźwięku, a strona bez niego niczego nie traci (test: zdejmij `<video>` → treść i CTA identyczne).

Jedyny element sterujący, jaki przy wideo MUSI istnieć, to przycisk pauzy renderowany POZA kontenerem `aria-hidden` — wymóg WCAG 2.2.2 (Pause, Stop, Hide) dla ruchu > 5 s i zapis planu (`docs/plan/strona-v2-plan.md:384`); pełna specyfikacja w `media-video-embed-spec` (p. „kontrola pauzy"). Przycisk nie jest kontrolką odtwarzacza (zero `controls`, zero paska postępu, zero dźwięku) i nie liczy się jako „druga kontrolka".

Dwa warianty tego przycisku, zależnie od tego, co gra na trasie:

| Gdzie | Element | Etykieta |
|---|---|---|
| hero z nagraniem narzędzia (`/`, aktywne od 2026-09-21) | `hero-media-toggle` w `HeroMedia.tsx` | „Zatrzymaj podgląd / Pause preview" — bo to podgląd narzędzia, nie tło |

Stan pauzy jest **jeden na całą witrynę** (`sessionStorage`, klucz `klarow:media:paused`): dla człowieka „zatrzymaj ruch" jest decyzją o stronie, a nie o pliku. Przycisk pojawia się WYŁĄCZNIE, gdy coś faktycznie gra — po odrzuceniu bramek (`pointer: coarse`, `prefers-reduced-motion`, `saveData`) nie ma go wcale, bo kontrolka URUCHAMIAJĄCA ruch po odrzuceniu bramek jest zakazana (`media-video-gating`).

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
