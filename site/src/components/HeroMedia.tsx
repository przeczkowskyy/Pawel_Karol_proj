import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { pick, useLang } from "@/i18n";
import { MEDIA_ENABLED } from "@/motion/tokens";
import {
  HERO_ALT,
  HERO_H,
  HERO_POSTER,
  HERO_POSTER_SIZES,
  HERO_POSTER_SRCSET,
  HERO_SOURCES,
  HERO_TOGGLE,
  HERO_W,
} from "@/data/media";

/* Media hero na „/”: kadr produktu (element LCP) plus nagranie tego samego
   narzędzia, które po chwili zaczyna liczyć. Reguły: media-video-gating
   (bramki i cykl życia), media-video-embed-spec (atrybuty i kontrola pauzy),
   media-video-placement (warstwy), media-poster-first-frame (poster = klatka 0),
   perf-lcp-poster-preload (kadr wygrywa LCP, wideo nigdy nie jest preloadowane).

   Trzy rzeczy, na których ten komponent się wywracał w poprzednich podejściach
   i których nie wolno „uprościć”:
   1. Wideo NIE POWSTAJE, gdy bramka odpada (telefon, reduced-motion, Data Saver).
      „Powstaje i jest zapauzowane” nadal pobiera dane i nadal jest ruchem w DOM.
   2. Montaż dopiero po `load` ORAZ po `requestIdleCallback`: okno, w którym
      przeglądarka aktualizuje kandydata LCP, sięga poza `load`, a pierwsza klatka
      wideo na całej szerokości ramy potrafi ten tytuł przejąć.
   3. Bezpiecznik 4 s: bez `canplay` w tym czasie wracamy do samego kadru.
      Crossfade wchodzący po kilkunastu sekundach czyta się jako usterka.

   Awaria mediów degraduje do kadru, nigdy do pustego drzewa: komponent stoi
   w `MediaBoundary` (App.tsx), a `HeroPoster` jest jego zapasem. */

const PAUSE_KEY = "klarow:media:paused";
/** brak `canplay` w tym czasie od montażu = zostaje sam kadr (plan §3 S1) */
const CANPLAY_TIMEOUT = 4000;

type SaveDataNavigator = Navigator & {
  connection?: { saveData?: boolean; effectiveType?: string };
};

function readPaused(): boolean {
  try {
    return sessionStorage.getItem(PAUSE_KEY) === "1";
  } catch {
    return false; // Safari w trybie prywatnym rzuca przy samym odczycie
  }
}

/** Kolejność warunków jest wiążąca (media-video-gating). */
function wantsVideo(): boolean {
  if (typeof window === "undefined" || !MEDIA_ENABLED) return false;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (!matchMedia("(pointer: fine)").matches) return false;
  const conn = (navigator as SaveDataNavigator).connection;
  if (conn?.saveData === true) return false;
  if (/^(slow-2g|2g|3g)$/.test(conn?.effectiveType ?? "")) return false;
  return true;
}

/** requestIdleCallback z zapasowym setTimeout (starsze Safari go nie ma) */
function idle(run: () => void): () => void {
  if (typeof requestIdleCallback === "function") {
    const id = requestIdleCallback(run, { timeout: 1500 });
    return () => cancelIdleCallback(id);
  }
  const id = window.setTimeout(run, 200);
  return () => window.clearTimeout(id);
}

/* Kadr produktu: ten sam plik co `poster` wideo i co preload w index.html.
   Bez `loading="lazy"` (element nad zgięciem), z jawnymi wymiarami i opisem:
   to treść, nie dekoracja, więc NIE jest schowany przed czytnikiem. */
function PosterImg() {
  const { lang } = useLang();
  return (
    <img
      className="hero-shot"
      src={HERO_POSTER}
      srcSet={HERO_POSTER_SRCSET}
      sizes={HERO_POSTER_SIZES}
      alt={pick(lang, HERO_ALT)}
      width={HERO_W}
      height={HERO_H}
      fetchPriority="high"
      decoding="async"
    />
  );
}

/** Zapas dla `MediaBoundary` i dla wszystkiego, co ma pokazać sam kadr. */
export function HeroPoster() {
  return (
    <div className="hero-media">
      <PosterImg />
    </div>
  );
}

export default function HeroMedia() {
  const { lang } = useLang();
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(false); // nagranie doszło do końca i tam zostaje
  // Czy obraz REALNIE się rusza. Samo zamontowanie <video> nie wystarczy: przy
  // posterze nic się nie porusza, a przycisk pauzy wisiał wtedy nad kadrem i zasłaniał
  // ostatni wiersz pulpitu (podpis „DEMO, dane fikcyjne"). WCAG 2.2.2 mówi o treści,
  // która się PORUSZA dłużej niż 5 s, więc kontrola pojawia się razem z ruchem.
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(readPaused);
  const ref = useRef<HTMLVideoElement>(null);
  const inView = useRef(false); // widoczność potrzebna też poza efektem (onSuspend)
  const tried = useRef(false); // czy była już próba play() (warunek onSuspend)
  const pausedRef = useRef(paused);
  const suspendTimer = useRef<number | null>(null);
  pausedRef.current = paused;

  // 1) montaż dopiero po `load` i po bezczynności wątku głównego
  useEffect(() => {
    let cancelIdle: (() => void) | null = null;
    const arm = () => {
      cancelIdle = idle(() => setEnabled(wantsVideo()));
    };
    if (document.readyState === "complete") arm();
    else window.addEventListener("load", arm, { once: true });
    return () => {
      window.removeEventListener("load", arm);
      cancelIdle?.();
    };
  }, []);

  // 2) zmiana preferencji ruchu w locie: element znika, nie „pauzuje się”
  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => {
      if (mq.matches) setEnabled(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // 3) bezpiecznik: brak `canplay` w 4 s od montażu = zostaje kadr
  useEffect(() => {
    if (!enabled || ready) return;
    const id = window.setTimeout(() => setEnabled(false), CANPLAY_TIMEOUT);
    return () => window.clearTimeout(id);
  }, [enabled, ready]);

  // 4) odtwarzanie sterowane widocznością sekcji i karty przeglądarki
  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) return;
    /* `el.ended` w warunku pilnuje obietnicy „jedno odtworzenie”: bez niego
       powrót do hero po przewinięciu strony (IntersectionObserver) albo powrót
       do karty (visibilitychange) puszczałby nagranie od nowa. */
    const tryPlay = () => {
      if (pausedRef.current || el.ended) return;
      tried.current = true;
      el.play().catch(() => setEnabled(false)); // iOS Low Power Mode, blokada autoplay
    };
    const io = new IntersectionObserver(
      ([e]) => {
        inView.current = e.isIntersecting;
        if (inView.current && !document.hidden) tryPlay();
        else el.pause();
      },
      { threshold: 0.25 }
    );
    const onVis = () => {
      if (document.hidden) el.pause();
      else if (inView.current) tryPlay();
    };
    io.observe(el);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      if (suspendTimer.current !== null) {
        window.clearTimeout(suspendTimer.current);
        suspendTimer.current = null;
      }
      el.pause();
    };
  }, [enabled]);

  // 5) reakcja na przycisk pauzy (pauza NIE odmontowuje elementu)
  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) return;
    if (paused) el.pause();
    else if (inView.current && !document.hidden && !el.ended) {
      tried.current = true;
      el.play().catch(() => setEnabled(false));
    }
  }, [paused, enabled]);

  const togglePaused = () =>
    setPaused((v) => {
      const next = !v;
      try {
        sessionStorage.setItem(PAUSE_KEY, next ? "1" : "0");
      } catch {
        /* tryb prywatny: wybór działa w tej sesji, po prostu się nie zapisze */
      }
      return next;
    });

  /* `suspend` NIE jest sygnałem awarii: leci też po skompletowaniu
     `preload="metadata"` i przy pełnym buforze, a `play()` jest asynchroniczne.
     Stąd dwa zabezpieczenia: tylko po pierwszej próbie odtworzenia i dopiero
     po sekundzie, z ponownym sprawdzeniem stanu. */
  const onSuspend = () => {
    if (!tried.current || suspendTimer.current !== null) return;
    suspendTimer.current = window.setTimeout(() => {
      suspendTimer.current = null;
      const el = ref.current;
      if (el && el.paused && !el.ended && inView.current && !document.hidden && !pausedRef.current) {
        setEnabled(false);
      }
    }, 1000);
  };

  return (
    <>
      {/* guardian-exempt: media-video-embed-spec — kontener NIE dostaje
          aria-hidden, bo kadr produktu jest treścią z opisem (alt z planu §3 S1),
          a nie dekoracją; `aria-hidden` i `tabIndex={-1}` siedzą na <video>. */}
      <div className="hero-media">
        <PosterImg />
        {enabled ? (
          <video
            ref={ref}
            className="hero-clip"
            data-ready={ready ? "true" : "false"}
            muted
            playsInline
            preload="metadata"
            poster={HERO_POSTER}
            disablePictureInPicture
            disableRemotePlayback
            aria-hidden="true"
            tabIndex={-1}
            width={HERO_W}
            height={HERO_H}
            onCanPlay={() => setReady(true)}
            onPlaying={() => setStarted(true)}
            onEnded={() => setDone(true)}
            onSuspend={onSuspend}
            onError={() => setEnabled(false)}
          >
            {HERO_SOURCES.map((s) => (
              <source key={s.src} src={s.src} type={s.type} />
            ))}
          </video>
        ) : null}
      </div>

      {/* WCAG 2.2.2 (Pause, Stop, Hide): nagranie trwa 8 s, czyli powyżej progu
          5 s. Przycisk istnieje TYLKO wtedy, gdy wideo jest zamontowane (kadr
          sam z siebie się nie rusza), stoi POZA kontenerem mediów i jest
          natywnym <button>, więc klawiatura działa bez dodatkowego kodu.
          Po ostatniej klatce przycisk znika: nie ma już czego zatrzymywać, a
          zostawiony byłby w praktyce przyciskiem „odtwórz ponownie”, którego
          reguła media-video-gating zabrania. */}
      {enabled && started && !done ? (
        <button
          type="button"
          className="btn btn-secondary btn-sm hero-media-toggle"
          aria-pressed={paused}
          /* Przycisk ikonowy: wersja tekstowa miała ~120 px i zasłaniała podpis
             „DEMO, dane fikcyjne" na dole kadru. Nazwa dostępna zostaje pełna,
             więc czytnik ekranu i tak mówi „Zatrzymaj podgląd”. */
          aria-label={pick(lang, paused ? HERO_TOGGLE.play : HERO_TOGGLE.pause)}
          title={pick(lang, paused ? HERO_TOGGLE.play : HERO_TOGGLE.pause)}
          onClick={togglePaused}
        >
          {paused ? <Play size={16} strokeWidth={1.75} aria-hidden /> : <Pause size={16} strokeWidth={1.75} aria-hidden />}
        </button>
      ) : null}
    </>
  );
}
