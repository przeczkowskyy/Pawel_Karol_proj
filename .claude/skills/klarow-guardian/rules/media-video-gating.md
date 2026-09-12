---
id: media-video-gating
title: Wideo tylko po bramkach: pointer fine, brak reduced-motion, brak saveData/2g-3g, po window.load, IO play/pause, visibilitychange, pauza użytkownika w sessionStorage, iOS Low Power Mode → poster
impact: BLOCKER
tags: [media, video, reduced-motion, ios, battery, lcp]
source: CLAUDE.md #2 i 2026-07-24 (brak WebGL na coarse) · higgsfield §4.5 p.1–6/§8 · synthesis §2.4.4 wantsVideo()/§2.4.8 · showreel §5.4 · motion-dev §4.11/§5.1 p.6 · lesniakrafal (LPM) · WebKit 6784
added: 2026-09-12
---

## Zasada

`HeroMedia` montuje `<video>` wyłącznie, gdy WSZYSTKIE warunki są spełnione, sprawdzane w tej kolejności:

```ts
function wantsVideo(): boolean {
  if (typeof window === "undefined" || !MEDIA_ENABLED) return false;              // SSR / kill-switch
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return false;      // a11y (BLOCKER)
  if (!matchMedia("(pointer: fine)").matches) return false;                       // telefony/tablety = poster (spójnie z WebGL od 2026-07-24)
  const c = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  if (c?.saveData === true) return false;                                         // Data Saver
  if (/^(slow-2g|2g|3g)$/.test(c?.effectiveType ?? "")) return false;            // wolne łącze
  return true;
}
```

Cykl życia po przejściu bramek:

1. **Ładowanie po `window.load` ORAZ po `requestIdleCallback`** (fallback `setTimeout 200`): `useEffect` → jeśli `document.readyState === "complete"` → `rIC(() => setEnabled(wantsVideo()))`, inaczej listener `load` (z cleanupem), a w nim to samo `rIC`. Do tego czasu w DOM jest tylko poster `<img>` (LCP). Samo „po `load`" nie wystarcza: okno, w którym przeglądarka jeszcze aktualizuje kandydata LCP, sięga poza `load`, a pierwsza klatka wideo malowana na całej szerokości hero potrafi ten tytuł przejąć (R-M2).
   **Bezpiecznik 4 s:** jeśli od montażu nie przyjdzie `canplay` w 4 s, `setEnabled(false)` i zostaje poster. Bez tego crossfade wchodzi przy zapchanym łączu po kilkunastu sekundach, gdy użytkownik czyta już następną sekcję, i czyta się jako usterka.
2. **Odtwarzanie sterowane widocznością**: `IntersectionObserver` (`threshold: 0.25`) → `play()` gdy ≥ 25 % w viewporcie, `pause()` poza; `document.addEventListener("visibilitychange")` → `pause()` gdy `document.hidden`, `play()` po powrocie tylko jeśli nadal w viewporcie.
3. **iOS Low Power Mode i blokady autoplay**: podstawowymi detektorami awarii są `play().catch(() => setEnabled(false))` (NotAllowedError → poster, zero przycisku „Odtwórz") i `onError` → `setEnabled(false)`.
   `onSuspend` jest detektorem POMOCNICZYM i wolno go użyć wyłącznie z dwoma zabezpieczeniami: (a) tylko PO pierwszej próbie odtworzenia (`tried.current === true`), (b) z opóźnieniem ≥ 1000 ms i ponownym sprawdzeniem stanu (`paused && !ended && inView && !document.hidden && !paused-użytkownika`). Powód w „Mechanizmie awarii": `suspend` to normalne zdarzenie (koniec pobierania `preload="metadata"`, pełny bufor), a `play()` jest asynchroniczne — bez tych warunków zdrowe wideo gaśnie losowo. Timer czyścimy w cleanupie (`motion-cleanup-required`).
4. **Crossfade**: `onCanPlay` → `setReady(true)` → `opacity` 0 → 1 (600 ms). Poster zostaje pod spodem (nie usuwać `<img>`). Nagranie hero gra **raz, bez `loop`**, i zatrzymuje się na ostatniej klatce: `onEnded` nie wywołuje `play()` i **nie pokazuje przycisku „Odtwórz ponownie"**.
5. **Zmiana warunków w locie**: listener `matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change")` → `setEnabled(false)` gdy `matches`; cleanup w `useEffect`.
6. **Cleanup** (`motion-cleanup-required`): `io.disconnect()`, `removeEventListener` ×3, `clearTimeout` timera `onSuspend`, `pause()`; `removeAttribute("src")` na `<source>` nie jest potrzebne, wystarczy odmontowanie elementu.
7. **Pauza użytkownika (WCAG 2.2.2, wymagana)**: stan `paused` sterowany przyciskiem `hero-media-toggle` (`media-video-embed-spec`, p. „kontrola pauzy"). Odczyt `sessionStorage.getItem("klarow:media:paused") === "1"` w inicjalizatorze stanu (w `try/catch`, PRZED pierwszym `play()`), zapis przy każdym kliknięciu. `paused === true` blokuje `play()` we WSZYSTKICH ścieżkach (IO, `visibilitychange`, `onCanPlay`) i wywołuje `el.pause()`; `paused === false` wznawia tylko wtedy, gdy element jest w viewporcie i karta widoczna. Pauza NIE odmontowuje `<video>` (użytkownik może wrócić) — w odróżnieniu od bramek z `wantsVideo()`, które element usuwają.

Zakazane: `autoPlay` w JSX, `play()` bez `.catch`, poleganie na `pause()` przy reduced-motion (element i tak pobiera dane; przy reduced `<video>` NIE JEST w DOM), `onSuspend` bez zabezpieczeń z p.3, atrybut `controls`, wideo na `pointer: coarse` (także osobny klip 9:16: odrzucony w syntezie §1.6).

Doprecyzowanie zakazu przycisku: zakazany jest przycisk **URUCHAMIAJĄCY** wideo po odrzuceniu bramek (np. „Odtwórz tło" pokazywane przy `prefers-reduced-motion`, `pointer: coarse`, `saveData` albo po `NotAllowedError` na iOS LPM) — tam poprawną odpowiedzią jest poster bez żadnej kontrolki. Przycisk **PAUZY** (p.7) jest WYMAGANY i pojawia się wyłącznie wtedy, gdy wideo faktycznie gra lub jest zapauzowane przez użytkownika.

## Mechanizm awarii (dlaczego)

- Reduced-motion: zasada #2 CLAUDE.md i WCAG 2.3.3; `MotionConfig` nie widzi `<video>`, więc bramka musi być własna (motion-dev §8.11). BLOCKER.
- `pointer: coarse`: od 2026-07-24 mobile nie dostaje WebGL (iOS komponował `fixed` canvas nad treścią). Wideo w kontenerze hero jest bezpieczniejsze niż `fixed` canvas, ale transfer 1,5 MB na 4G + dekoder w tle + Low Power Mode = trzy powody na poster. Decyzja founderów (higgsfield §10 p.4): poster.
- `saveData`/2g-3g: użytkownik jawnie prosi o mniej danych; 1,5 MB dekoracji to naruszenie tej prośby.
- Ładowanie przed `load` konkuruje z fontem, CSS i posterem o pasmo; poster jest kandydatem LCP i musi wygrać.
- iOS LPM: `play()` odrzuca promise `NotAllowedError`, a Safari wstawia duży przycisk play nad dekoracją; bez `.catch` w konsoli wyjątek, a bez `setEnabled(false)` przycisk zostaje (źródła: lesniakrafal.com, forum Webflow).
- Bez IO/visibilitychange wideo dekoduje poza ekranem i w tle (Chrome nie pauzuje niewidocznych), bateria i CPU (kit: „pauza przy `document.hidden`").
- `suspend` NIE jest sygnałem awarii: przeglądarka emituje je za każdym razem, gdy celowo przestaje pobierać dane (skompletowane `preload="metadata"`, zapełniony bufor). Dodatkowo `el.play()` jest asynchroniczne — w oknie między wywołaniem a rozwiązaniem promise `el.paused === true` przy `readyState` 2–4. Heurystyka `readyState >= 2 && paused && !ended` bez warunku „była próba odtworzenia" i bez opóźnienia gasi zdrowe wideo na desktopie, w dodatku bez śladu w konsoli (`onError` nie leci).
- Brak mechanizmu pauzy przy pętli 6–10 s obok treści = naruszenie WCAG 2.2.2 (jedyny wyjątek normy to „essential", a dekoracyjne tło nim nie jest). `aria-hidden` chowa wideo przed czytnikiem, nie przed osobą z zaburzeniami uwagi lub przedsionkowymi, która nie ustawiła `prefers-reduced-motion`.

## Niepoprawnie

```tsx
<video autoPlay muted loop playsInline poster={POSTER} />                                   // zero bramek
useEffect(() => { videoRef.current?.play(); }, []);                                          // bez catch, przed load, bez IO
const reduce = useReducedMotion(); useEffect(() => { if (reduce) videoRef.current?.pause(); }, [reduce]);   // element dalej w DOM i pobiera
const onSuspend = () => { const el = ref.current; if (el && el.readyState >= 2 && el.paused && !el.ended) setEnabled(false); };  // gasi zdrowe wideo (suspend = normalne zdarzenie)
{!enabled ? <button onClick={() => setEnabled(true)}>Odtwórz tło</button> : null}            // przycisk URUCHAMIAJĄCY po odrzuceniu bramek
```

## Poprawnie

```tsx
// src/components/HeroMedia.tsx (logika; render w media-video-embed-spec)
const PAUSE_KEY = "klarow:media:paused";
const readPaused = () => { try { return sessionStorage.getItem(PAUSE_KEY) === "1"; } catch { return false; } };

const [enabled, setEnabled] = useState(false);
const [ready, setReady] = useState(false);
const [paused, setPaused] = useState(readPaused);          // 7) wybór użytkownika z poprzedniej podstrony
const ref = useRef<HTMLVideoElement>(null);
const inView = useRef(false);                               // widoczność dostępna też poza efektem (onSuspend)
const tried = useRef(false);                                // czy była próba play() (warunek p.3a)
const pausedRef = useRef(paused);
const suspendTimer = useRef<number | null>(null);
pausedRef.current = paused;

useEffect(() => {                                   // 1) po load
  const arm = () => setEnabled(wantsVideo());
  if (document.readyState === "complete") { arm(); return; }
  window.addEventListener("load", arm, { once: true });
  return () => window.removeEventListener("load", arm);
}, []);

useEffect(() => {                                   // 5) zmiana reduced-motion w locie
  const mq = matchMedia("(prefers-reduced-motion: reduce)");
  const onChange = () => { if (mq.matches) setEnabled(false); };
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}, []);

useEffect(() => {                                   // 2) + 3) + 6) + 7)
  const el = ref.current; if (!enabled || !el) return;
  const tryPlay = () => { if (pausedRef.current) return; tried.current = true; el.play().catch(() => setEnabled(false)); };
  const io = new IntersectionObserver(([e]) => { inView.current = e.isIntersecting; inView.current && !document.hidden ? tryPlay() : el.pause(); }, { threshold: 0.25 });
  const onVis = () => { document.hidden ? el.pause() : inView.current && tryPlay(); };
  io.observe(el);
  document.addEventListener("visibilitychange", onVis);
  return () => {
    io.disconnect();
    document.removeEventListener("visibilitychange", onVis);
    if (suspendTimer.current !== null) { window.clearTimeout(suspendTimer.current); suspendTimer.current = null; }
    el.pause();
  };
}, [enabled]);

useEffect(() => {                                   // 7) reakcja na przycisk pauzy
  const el = ref.current; if (!enabled || !el) return;
  if (paused) el.pause();
  else if (inView.current && !document.hidden) { tried.current = true; el.play().catch(() => setEnabled(false)); }
}, [paused, enabled]);

const togglePaused = () => setPaused((v) => { const next = !v; try { sessionStorage.setItem(PAUSE_KEY, next ? "1" : "0"); } catch { /* private mode */ } return next; });

const onCanPlay = () => setReady(true);
const onSuspend = () => {                           // 3) detektor pomocniczy: tylko po próbie play() i z opóźnieniem
  if (!tried.current || suspendTimer.current !== null) return;
  suspendTimer.current = window.setTimeout(() => {
    suspendTimer.current = null;
    const el = ref.current;
    if (el && el.paused && !el.ended && inView.current && !document.hidden && !pausedRef.current) setEnabled(false);
  }, 1000);
};
```

## Test

```bash
# kontrakt wantsVideo i cykl życia (oczekiwane: każda linia = 1 trafienie w HeroMedia.tsx)
F=site/src/components/HeroMedia.tsx
grep -cE 'prefers-reduced-motion: reduce' $F; grep -cE '\(pointer: fine\)' $F; grep -cE 'saveData' $F; grep -cE 'slow-2g\|2g\|3g|effectiveType' $F
grep -cE 'readyState === "complete"' $F; grep -cE 'IntersectionObserver' $F; grep -cE 'visibilitychange' $F
grep -cE 'requestIdleCallback' $F    # ≥ 1 (montaż poza oknem aktualizacji LCP)
grep -cE '4000|FOUR_SEC|CANPLAY_TIMEOUT' $F   # ≥ 1 (bezpiecznik 4 s: brak canplay → poster)
grep -cE '\.play\(\)\.catch|\.play\(\)\.then\([^)]*\)\.catch' $F; grep -cE 'onSuspend' $F; grep -cE 'MEDIA_ENABLED' $F
grep -nE 'autoPlay' $F   # = 0
# p.3: onSuspend z zabezpieczeniami (oczekiwane: po ≥ 1 trafieniu)
grep -cE 'tried\.current' $F; grep -cE 'setTimeout\(' $F; grep -cE 'clearTimeout\(' $F
# p.7: pauza użytkownika (WCAG 2.2.2) i jej trwałość w sesji
grep -cE 'klarow:media:paused' $F; grep -cE 'hero-media-toggle' $F; grep -cE 'aria-pressed' $F   # = 1 każdy
grep -cE 'try \{[^}]*sessionStorage' $F   # ≥ 1 (odczyt/zapis w try/catch)
# runtime (Playwright WebKit ze scratchpadu):
#   a) viewport 390×844 (pointer: coarse): document.querySelector("video") === null; poster <img> widoczny
#   b) desktop 1440×900 + reducedMotion:"reduce": video === null
#   c) desktop + emulacja connection.saveData=true (CDP Network.emulateNetworkConditions / override navigator.connection): video === null
#   d) desktop, warunki normalne: po load ≤ 2 s video.paused === false; przewinięcie poza hero → paused === true; document.hidden (page.evaluate visibility) → paused
#   e) desktop, play() mock → reject(NotAllowedError): video znika, poster zostaje, brak przycisku „Odtwórz"
#   f) desktop: klik „Zatrzymaj podgląd" → video.paused === true, aria-pressed="true", sessionStorage klarow:media:paused === "1";
#      nawigacja na /oferta i powrót na / → wideo NIE startuje; klik „Odtwórz podgląd" → paused === false
#   h) desktop: montaż wideo dopiero PO window.load i requestIdleCallback; brak canplay w 4 s → poster i zero <video> w DOM
#   i) desktop: element LCP (PerformanceObserver) = img.hero-shot, nie <video> (perf-lcp-poster-preload)
#   g) desktop: sztuczne `dispatchEvent(new Event("suspend"))` na grającym wideo → po 1,5 s video nadal gra (brak fałszywego wygaszenia)
# realny iPhone Karola w Low Power Mode: hero = poster, brak białego przycisku play.
```

Docelowo `scripts/verify-site.mjs` krok `video-gating` (a, b, d) w fazie 3.

## Wyjątki

- **Klipy hover ściany S3 (v1, dokładnie 4).** Te same bramki `wantsVideo()` plus: `preload="none"`, start dopiero po `mouseenter` z **progiem intencji 120 ms** (kursor przejeżdżający przez kafel nic nie uruchamia) albo po `focus-visible`; `mouseleave`/`blur` → `pause()` + `currentTime = 0`; **singleton modułowy** (nowy start zatrzymuje poprzedni klip); `pointer-events: none` na elemencie, żeby kafel pozostał jednym `<a>`; twarde `pointer: fine` (na dotyku hover nie istnieje, a tap ma otwierać podstronę). Klipy nie mają własnego przycisku pauzy (ruch nie jest automatyczny w rozumieniu WCAG 2.2.2), ale honorują wspólny stan `klarow:media:paused`.
- W trybach `MOTION_TIER = "still"` i `"calm"` `wantsVideo()` zwraca `false` z pierwszej linii (patrz `motion-tier-flag`).
