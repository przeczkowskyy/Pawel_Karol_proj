---
id: media-video-embed-spec
title: Specyfikacja elementu <video>: muted playsInline loop preload=metadata poster, źródła AV1→VP9→H.264, aria-hidden, disablePictureInPicture, MediaBoundary, przycisk pauzy tła (WCAG 2.2.2)
impact: HIGH
tags: [media, video, a11y, ios, lcp]
source: higgsfield §4.5 (szkic HeroVideo, wymagania 1–9) · synthesis §2.4.4 HeroMedia · showreel §5.4 · WebKit „New video policies for iOS" · WIG · WCAG 2.2.2 (Pause, Stop, Hide) · docs/plan/strona-v2-plan.md §3 S1 (przycisk pauzy + sessionStorage; etykieta „Zatrzymaj podgląd / Pause preview" po D37)
added: 2026-09-12
---

## Zasada

Każdy `<video>` na stronie (v1: `HeroMedia` na `/` i klipy hover w `ToolWall`) ma DOKŁADNIE ten zestaw atrybutów:

```tsx
<video
  muted playsInline
  // loop: TAK dla klipów hover (pętla 6–7 s); NIE dla nagrania hero (jedno odtworzenie, stop na ostatniej klatce)
  preload="metadata"                       // klipy hover: "none"
  poster={POSTER}                          // ten sam plik co <img> LCP; KLATKA 0 pliku wideo
  disablePictureInPicture disableRemotePlayback
  aria-hidden="true" tabIndex={-1}
  width={1600} height={1000}               // wymiary jawne = CLS 0 (klipy hover: 960×600)
  onCanPlay / onSuspend / onError          // obsługa w media-video-gating
>
  <source src="/media/hero-production-v1.av1.mp4" type='video/mp4; codecs="av01.0.05M.08"' />   {/* opcjonalny, najmniejszy */}
  <source src="/media/hero-production-v1.webm"    type='video/webm; codecs="vp9"' />
  <source src="/media/hero-production-v1.mp4"     type='video/mp4; codecs="avc1.640028"' />     {/* fallback Safari/iOS */}
</video>
```

Dodatkowo:
- brak atrybutu `autoPlay` w JSX: odtwarzanie startuje z `video.play().catch(...)` po bramkach (`media-video-gating`); brak `controls`, brak `src` na elemencie (tylko `<source>` z `type` z kodekiem, żeby przeglądarka wybrała bez pobierania),
- brak ścieżki audio w pliku (`-an` w ffmpeg); `muted` w JSX jest wymagany mimo to (iOS blokuje autoplay bez `muted` + `playsinline`),
- element siedzi w `MediaBoundary` (error boundary: awaria = poster, treść żyje) i w kontenerze `.hero-media` (`media-video-placement`),
- CSS: `.hero-media img, .hero-media video { position:absolute; inset:0; width:100%; height:100%; object-fit:cover }`; wideo ma `opacity: 0` do `canplay`, potem crossfade `opacity` 600 ms (`--duration-media`, `--ease-out`); `@media (prefers-reduced-motion: reduce) { .hero-media video { display: none } }`,
- zawsze obok: `<img src={POSTER} alt="" width height fetchPriority="high" decoding="async">` renderowany PRZED wideo (także w shellu prerenderu; `<video>` nigdy w shellu),
- nazwy plików z wersją (`hero-v1.*`, `media-headers-versioning`),
- **kontrola pauzy (WYMAGANA, WCAG 2.2.2 Pause, Stop, Hide)**: obok kontenera — POZA `aria-hidden` — renderowany jest przycisk
  `<button type="button" className="btn btn-secondary btn-sm hero-media-toggle" aria-pressed={paused}>Zatrzymaj podgląd / Pause preview</button>`
  (etykieta mówi prawdę: w v1 hero nie jest tłem, tylko **podglądem prawdziwego narzędzia**; „Zatrzymaj tło" byłoby nieprawdziwe i łamałoby `brand-honest-labels`)
  (PL/EN przez `pick()`), widoczny stale (nie tylko na hover), z widocznym `:focus-visible`, polem klikalnym ≥ 44×44 px
  (`a11y-touch-targets-44`) i scrimem pod spodem dla kontrastu AA na najjaśniejszej klatce. Przycisk istnieje TYLKO wtedy,
  gdy `<video>` jest zamontowane (poster sam z siebie się nie rusza, więc nie ma czego pauzować). Wybór użytkownika jest
  zapamiętany w `sessionStorage` pod kluczem `klarow:media:paused` (`"1"`/`"0"`; `docs/plan/strona-v2-plan.md:384`) i czytany
  PRZED pierwszym `play()`; zapis i odczyt w `try/catch` (Safari w trybie prywatnym rzuca). To jedyny dozwolony element
  sterujący: atrybut `controls`, pasek postępu i dźwięk pozostają zakazane (`media-video-gating` „Zakazane").

## Mechanizm awarii (dlaczego)

- iOS: autoplay wymaga `muted` + `playsinline` + braku ścieżki audio; wideo, które zyska audio, zostaje spauzowane (WebKit blog 6784). Bez `playsInline` iPhone otwiera pełnoekranowy odtwarzacz.
- Bez `poster` i `<img>` LCP przesuwa się na pierwszą zdekodowaną klatkę wideo (po `window.load`): LCP > 2,5 s na 4G. `preload="auto"` pobiera 1,5 MB przed LCP.
- `src` bez `type` z kodekiem: Safari pobiera nagłówki każdego pliku, zanim odrzuci; kolejność AV1 → VP9 → H.264 daje najmniejszy transfer tam, gdzie dekoder jest sprzętowy, i pewny fallback wszędzie.
- `disablePictureInPicture`/`disableRemotePlayback`: bez nich Safari pokazuje ikony PiP/AirPlay na dekoracji; `aria-hidden` + `tabIndex=-1`: czytnik i Tab nie zatrzymują się na dekoracji (WIG).
- Bez przycisku pauzy pętla 6–10 s obok treści łamie WCAG 2.2.2 (Pause, Stop, Hide): jedyny wyjątek normy to ruch „essential", a dekoracyjne tło nim nie jest. `aria-hidden` + `tabIndex={-1}` chronią czytnik i Tab, ale nie osobę z zaburzeniami uwagi/przedsionkowymi, która nie ustawiła `prefers-reduced-motion`. Plan (`strona-v2-plan.md:384`) wymaga tego przycisku wprost, więc bez niego audytor przepuściłby build niezgodny z planem, a zgodny przycisk zgłosiłby jako naruszenie „zero kontrolek".
- Bez `MediaBoundary` wyjątek w obsłudze mediów (np. `play()` na odmontowanym elemencie) zdejmuje całe drzewo Reacta (historia `BgBoundary`, 2026-07-23: „#root pusty").

## Niepoprawnie

```tsx
<video autoPlay loop src="/media/hero.mp4" className="absolute inset-0" />                  // brak muted/playsInline/poster/type/wersji; autoPlay bez bramek
<video muted loop playsInline preload="auto" controls poster="/media/hero.jpg">…</video>    // preload auto, controls, poster JPG > 60 KB
```

## Poprawnie

```tsx
// src/components/HeroMedia.tsx (render; logika w media-video-gating)
import { HERO_POSTER, HERO_SOURCES } from "@/data/media";   // media-headers-versioning (zero literalow sciezek)
const TOGGLE = {
  pause: { pl: "Zatrzymaj podgląd", en: "Pause preview" },
  play:  { pl: "Odtwórz podgląd",   en: "Play preview" },
} as const;

return (
  <>
    <div className="hero-media" aria-hidden="true">
      <img className="hero-shot" src={HERO_POSTER} alt="Pulpit produkcji: kafle hal i suwak tygodnia, dane przykładowe"
           width={1600} height={1000} fetchPriority="high" decoding="async" />
      {enabled ? (
        <video ref={ref} muted playsInline preload="metadata" poster={HERO_POSTER}
               disablePictureInPicture disableRemotePlayback tabIndex={-1} width={1600} height={1000}
               onCanPlay={onCanPlay} onSuspend={onSuspend} onError={() => setEnabled(false)}
               style={{ opacity: ready ? 1 : 0, transition: "opacity var(--duration-media) var(--ease-out)" }}>
          {HERO_SOURCES.map((s) => <source key={s.src} src={s.src} type={s.type} />)}
        </video>
      ) : null}
    </div>

    {/* WCAG 2.2.2: POZA aria-hidden; stan w sessionStorage (media-video-gating p.7) */}
    {enabled ? (
      <button type="button" className="btn btn-secondary btn-sm hero-media-toggle"
              aria-pressed={paused} onClick={togglePaused}>
        {pick(lang, paused ? TOGGLE.play : TOGGLE.pause)}
      </button>
    ) : null}
  </>
);
```

```css
/* globals.css: przycisk w kontenerze .hero (position: relative), zawsze widoczny, AA na scrimie */
.hero-media-toggle { position: absolute; right: 16px; bottom: 16px; min-height: 44px; }   /* bez z-index: stoi po .hero-media w DOM, więc maluje się wyżej (media-video-placement) */
.hero-media-toggle::before { content: ""; position: absolute; top: -6px; right: -6px; bottom: -6px; left: -6px; }  /* pole klikalne ≥ 44×44 */
@media (prefers-reduced-motion: reduce) { .hero-media-toggle { display: none; } }   /* wideo i tak nie powstaje */
```

```tsx
// App.tsx
<MediaBoundary fallback={<img className="hero-shot" src={HERO_POSTER} alt="…" width={1600} height={1000} />}><HeroMedia /></MediaBoundary>
```

## Test

Atrybuty sprawdzamy NA ELEMENCIE, nie na linii: JSX jest wieloliniowy, a `onError={() => …}` zawiera `>`,
więc `grep '<video[^>]*controls'` i tak by nie zadziałał, a samo `grep controls` trafia w `const controls = animate(...)`
(nazwa narzucona przez `motion-cleanup-required`). Parser poniżej zamyka element na pierwszym `>` poza `{…}`.

```bash
# statycznie: komplet atrybutow na kazdym <video> (oczekiwane: "video-attrs OK")
node -e '
const fs = require("node:fs"), path = require("node:path");
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
const els = (src, tag) => { const out = [], re = new RegExp("<" + tag + "\\b", "g"); let m;
  while ((m = re.exec(src))) { let i = re.lastIndex, d = 0;
    for (; i < src.length; i++) { const c = src[i]; if (c === "{") d++; else if (c === "}") d--; else if (c === ">" && d === 0) break; }
    out.push(src.slice(m.index, i + 1)); }
  return out; };
const REQ = ["\\bmuted\\b", "\\bplaysInline\\b", "preload=\"(metadata|none)\"", "poster=", "disablePictureInPicture", "disableRemotePlayback", "tabIndex=\\{-1\\}", "width=", "height="];
// `loop` sprawdzamy warunkowo: WYMAGANY w ToolWall.tsx (klipy hover), ZAKAZANY w HeroMedia.tsx (jedno odtworzenie)
const BAD = ["\\bautoPlay\\b", "\\bcontrols\\b(?=[\\s/>=])", "preload=\"auto\"", "\\bsrc="];
let bad = 0;
for (const f of walk("site/src").filter((x) => x.endsWith(".tsx"))) {
  const src = fs.readFileSync(f, "utf8");
  for (const el of els(src, "video")) {
    for (const a of REQ) if (!new RegExp(a).test(el)) { console.log(f + ": BRAK " + a); bad++; }
    for (const a of BAD) if (new RegExp(a).test(el)) { console.log(f + ": ZAKAZANY " + a); bad++; }
    const hero = /HeroMedia\.tsx$/.test(f.replace(/\\/g, "/"));
    if (hero && /\bloop\b/.test(el)) { console.log(f + ": ZAKAZANY loop (hero gra raz)"); bad++; }
    if (!hero && !/\bloop\b/.test(el)) { console.log(f + ": BRAK loop (klip hover jest pętlą)"); bad++; }
  }
}
console.log(bad === 0 ? "video-attrs OK" : "video-attrs: " + bad + " naruszen");'
# zrodla, boundary i kontrola pauzy
F=site/src/components/HeroMedia.tsx
grep -cE 'pointer-events:\s*none' site/src/components/ToolWall.tsx site/src/styles/globals.css   # ≥ 1 (klip nie przechwytuje kliknięcia)
grep -cE '<source[^>]*type=.video/webm; codecs="vp9"' $F       # ≥ 1
grep -cE '<source[^>]*type=.video/mp4; codecs="avc1' $F         # ≥ 1
grep -cE 'MediaBoundary' site/src/App.tsx                       # ≥ 1
grep -cE 'hero-media-toggle' $F                                 # = 1 (WCAG 2.2.2)
grep -cE 'aria-pressed' $F                                      # = 1
grep -cE 'klarow:media:paused' $F                               # = 1 (sessionStorage, plan:384)
grep -nE 'hero-media-toggle[^>]*aria-hidden|aria-hidden[^>]*hero-media-toggle' $F   # = 0 (przycisk POZA aria-hidden)
# plik: brak ścieżki audio (wymaga ffprobe ze scratchpadu)
ffprobe -v error -select_streams a -show_entries stream=codec_type -of csv=p=0 site/public/media/hero-production-v1.mp4 | wc -l   # = 0
# CSS pas bezpieczeństwa
grep -nE 'prefers-reduced-motion[^}]*\.hero-media video[^}]*display:\s*none' -z site/src/styles/globals.css | wc -c   # > 0
```

Docelowo `node scripts/check-motion.mjs` sekcja `video-attrs`.

## Wyjątki

- Klipy hover (v1, `ToolWall`): `preload="none"`, bez `poster` w atrybucie (poster to `<img>` kafla), `loop` **wymagany**, `muted playsInline` tak; wymiary 960×600; `pointer-events: none`. Nie wymagają własnego przycisku pauzy (ruch startuje wyłącznie po `mouseenter`/`focus`, więc nie jest automatyczny w rozumieniu WCAG 2.2.2), ale honorują globalny stan `klarow:media:paused`.
- Nagranie hero (`HeroMedia`): `loop` **zakazany** (jedno odtworzenie, stop na ostatniej klatce). Przycisk pauzy jest mimo to wymagany: ruch trwa 8 s, czyli powyżej progu 5 s z WCAG 2.2.2.
