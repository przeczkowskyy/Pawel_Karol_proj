import { useEffect, useRef, useState } from "react";
import type { MotionValue } from "motion/react";
import { pick, useLang } from "@/i18n";
import type { Bilingual } from "@/data/messaging";
import { MEDIA_ENABLED } from "@/motion/tokens";
import { useScene } from "./context";

/* ── SceneVideo ─────────────────────────────────────────────────────────────
   CO ROBI: tło wideo STEROWANE PRZEWIJANIEM, nie odtwarzane. Pozycja
   przewijania ustawia `currentTime`, więc ruch idzie dokładnie tak szybko, jak
   przewija użytkownik, staje, gdy on staje, i cofa się razem z nim. Element
   nigdy nie dostaje `play()`: nie ma `autoplay`, nie ma `loop`, nie ma
   `controls`.

   DLACZEGO TO NIE JEST TO SAMO CO `HeroMedia`: tamten komponent ODTWARZA
   ośmiosekundowe nagranie własnym tempem i dlatego musi mieć przycisk pauzy
   (WCAG 2.2.2, treść ruszająca się dłużej niż 5 s bez udziału użytkownika).
   Tutaj każda klatka jest skutkiem gestu widza, więc pauzy nie ma czego
   dotyczyć: przestaje przewijać, obraz stoi. Kontrolka „odtwórz" byłaby wręcz
   błędem (reguła `media-video-gating`: przycisk URUCHAMIAJĄCY wideo po
   odrzuceniu bramek jest zakazany).

   BRAMKI, każda osobno i w tej kolejności (`media-video-gating`):
     1. brak pliku                   -> sam kadr
     2. `MEDIA_ENABLED` = false      -> sam kadr (kill-switch `motion-tier-flag`)
     3. `prefers-reduced-motion`     -> sam kadr
     4. `pointer: coarse` (telefon)  -> sam kadr (decyzja z lipca zostaje)
     5. `saveData` albo 2g/3g        -> sam kadr
   W KAŻDEJ z tych gałęzi renderujemy POSTER jako `<img>`, nigdy pustkę.
   Wideo nie powstaje w DOM: „powstaje i stoi zapauzowane" nadal pobiera dane.

   DLACZEGO `currentTime` WYŁĄCZNIE W `requestAnimationFrame` I Z PROGIEM:
   `currentTime` to zapis synchroniczny, po którym dekoder szuka klatki.
   Ustawiany przy każdej zmianie wartości ruchu (a tych bywa kilkaset na
   sekundę na gładkim gładziku) zatyka dekoder: obraz zastyga, a wątek główny
   stoi w `seek`. Dlatego zmiana postępu tylko PLANUJE ramkę (jedna na klatkę
   ekranu, `frame.current` pilnuje, żeby nie było dwóch naraz), a w ramce zapis
   wykonuje się tylko wtedy, gdy różnica przekracza jedną klatkę materiału.
   Mniejsza różnica i tak nie zmieniłaby obrazu, a kosztowałaby cały seek.

   WARUNEK PO STRONIE PLIKU: materiał musi mieć GĘSTE KLATKI KLUCZOWE (patrz
   `sceneMedia.ts`). Przy rzadkich klatkach kluczowych każdy skok cofa dekoder
   do poprzedniego I-frame i przewijanie skacze zamiast płynąć. Tego nie da się
   naprawić w kodzie.

   WYDAJNOŚĆ: pętla istnieje wyłącznie, gdy scena jest w zasięgu (`inView`
   z kontekstu sceny). Scena poza ekranem nie planuje ramek i nie rusza
   `currentTime`.

   SPRZĄTANIE (`motion-cleanup-required`): `cancelAnimationFrame`, odpięcie
   subskrypcji wartości ruchu i `removeEventListener` na zapytaniu medialnym
   siedzą w cleanupach efektów. */

/** Klatka materiału w sekundach: klipy eksportujemy w 30 fps (pipeline Higgsfield). */
const FRAME_STEP = 1 / 30;

/** cały postęp sceny mapuje się na całą długość nagrania */
const FULL_RANGE: [number, number] = [0, 1];

/** wymiary jawne na kadrze i nagraniu: CLS 0 (`perf-images-policy`) */
const DEFAULT_W = 1600;
const DEFAULT_H = 1000;

type SaveDataNavigator = Navigator & {
  connection?: { saveData?: boolean; effectiveType?: string };
};

/** Kolejność warunków jest wiążąca (`media-video-gating`). */
function wantsScrub(): boolean {
  if (typeof window === "undefined" || !MEDIA_ENABLED) return false;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (!matchMedia("(pointer: fine)").matches) return false;
  const connection = (navigator as SaveDataNavigator).connection;
  if (connection?.saveData === true) return false;
  if (/^(slow-2g|2g|3g)$/.test(connection?.effectiveType ?? "")) return false;
  return true;
}

/** `requestIdleCallback` z zapasowym `setTimeout` (starsze Safari go nie ma). */
function idle(run: () => void): () => void {
  if (typeof requestIdleCallback === "function") {
    const id = requestIdleCallback(run, { timeout: 1500 });
    return () => cancelIdleCallback(id);
  }
  const id = window.setTimeout(run, 200);
  return () => window.clearTimeout(id);
}

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

type SceneVideoProps = {
  /** źródła w kolejności od najmniejszego transferu; z `videoSources()` w `sceneMedia.ts` */
  sources: { src: string; type: string }[];
  /** KLATKA ZERO nagrania; widoczna, dopóki dekoder nie ma klatek */
  poster: string;
  /** opis kadru; brak = kadr jest dekoracją (`alt=""`) */
  alt?: Bilingual;
  /** postęp; domyślnie lokalny postęp sceny z kontekstu */
  progress?: MotionValue<number>;
  /** fragment postępu sceny, na który rozciąga się nagranie; domyślnie cała scena */
  range?: [number, number];
  /** kadr nad pierwszym zgięciem ładujemy od razu, nie leniwie */
  eager?: boolean;
  width?: number;
  height?: number;
  className?: string;
};

/** Tło wideo przewijane pozycją scrolla; poza bramkami degraduje się do kadru. */
export function SceneVideo({
  sources,
  poster,
  alt,
  progress,
  range = FULL_RANGE,
  eager = false,
  width = DEFAULT_W,
  height = DEFAULT_H,
  className,
}: SceneVideoProps) {
  const { lang } = useLang();
  const scene = useScene();

  const value = progress ?? scene?.progress ?? null;
  const inView = scene?.inView ?? true;
  const hasFile = sources.length > 0;

  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  /* 0 oznacza „brak zaplanowanej ramki"; `requestAnimationFrame` nigdy nie zwraca 0 */
  const frame = useRef(0);

  /* Tablica w propsie zmienia tożsamość przy każdym renderze rodzica, więc do
     zależności efektu wchodzą liczby, nie referencja. */
  const [rangeStart, rangeEnd] = range;

  /* 1) Montaż dopiero po `load` i po bezczynności wątku głównego: kadr jest
        kandydatem LCP i ma wygrać (`perf-lcp-poster-preload`). */
  useEffect(() => {
    if (!hasFile || !value) return;
    let cancelIdle: (() => void) | null = null;
    const arm = () => {
      cancelIdle = idle(() => setEnabled(wantsScrub()));
    };
    if (document.readyState === "complete") arm();
    else window.addEventListener("load", arm, { once: true });
    return () => {
      window.removeEventListener("load", arm);
      cancelIdle?.();
    };
  }, [hasFile, value]);

  /* 2) Zmiana preferencji ruchu w locie: element ZNIKA, nie „pauzuje się". */
  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => {
      if (!mq.matches) return;
      setEnabled(false);
      setReady(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  /* 3) Przewijanie materiału. Jedyna pętla w tym pliku i jedyne miejsce, które
        pisze `currentTime`. Istnieje wyłącznie, gdy scena jest w zasięgu. */
  useEffect(() => {
    if (!enabled || !value || !inView) return;

    const apply = () => {
      frame.current = 0;
      const el = videoRef.current;
      /* readyState < 2 = dekoder nie ma jeszcze bieżącej klatki; zostaje kadr */
      if (!el || el.readyState < 2) return;
      const duration = el.duration;
      if (!Number.isFinite(duration) || duration <= 0) return;
      const span = rangeEnd - rangeStart;
      if (span <= 0) return;
      const target = clamp01((value.get() - rangeStart) / span) * duration;
      /* próg jednej klatki: mniejszy skok nie zmieniłby obrazu, a kosztowałby seek */
      if (Math.abs(target - el.currentTime) > FRAME_STEP) el.currentTime = target;
    };

    const schedule = () => {
      if (frame.current === 0) frame.current = requestAnimationFrame(apply);
    };

    schedule();
    const stop = value.on("change", schedule);

    return () => {
      stop();
      if (frame.current !== 0) {
        cancelAnimationFrame(frame.current);
        frame.current = 0;
      }
    };
    /* `ready` w zależnościach: pierwsza klatka po wczytaniu materiału ma trafić
       na aktualną pozycję przewijania, a nie czekać na następny ruch kółkiem. */
  }, [enabled, value, inView, ready, rangeStart, rangeEnd]);

  return (
    <div className={className ? `pr-media ${className}` : "pr-media"}>
      {/* Kadr jest ZAWSZE w DOM i zawsze pod nagraniem: to on niesie obraz,
          gdy bramki odpadną, gdy plik się nie wczyta i zanim dekoder ruszy. */}
      <img
        className="pr-media-still"
        src={poster}
        alt={alt ? pick(lang, alt) : ""}
        width={width}
        height={height}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        decoding="async"
      />

      {enabled && hasFile ? (
        <video
          ref={videoRef}
          className="pr-media-clip"
          data-ready={ready ? "true" : "false"}
          muted
          playsInline
          preload="metadata"
          poster={poster}
          disablePictureInPicture
          disableRemotePlayback
          aria-hidden="true"
          tabIndex={-1}
          width={width}
          height={height}
          onLoadedData={() => setReady(true)}
          onError={() => setEnabled(false)}
        >
          {sources.map((s) => (
            <source key={s.src} src={s.src} type={s.type} />
          ))}
        </video>
      ) : null}
    </div>
  );
}
