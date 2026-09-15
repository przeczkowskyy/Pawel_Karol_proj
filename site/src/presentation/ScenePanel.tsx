import { useEffect, useRef, useState } from "react";
import { MEDIA_ENABLED } from "@/motion/tokens";
import { type SceneId } from "@/data/presentation";
import { sceneMedia, loopSources } from "./sceneMedia";
import { zglosPanel, zglosWidocznosc } from "./loopConductor";

/* ── ScenePanel ─────────────────────────────────────────────────────────────
   JEDEN KADR PIONOWEGO PASKA. Osiem takich paneli leży jeden pod drugim
   i tworzy jeden ciągły obraz wnętrza budynku, po którym jedzie przewijanie.

   DECYZJA KAROLA 2026-09-15, która zastąpiła przeloty dronem:
   „Zrobimy jeden wielki obraz połączony z tych 8 faz i złączymy potem osobno
   te zdjęcia jedno pod drugim. Każde pojedyncze z tych zdjęć będzie
   POWTARZAJĄCYM SIĘ ŁAGODNIE GIFEM. Nie ma przejść po korytarzach żadnych.
   Po prostu jak scrolujesz to przescrolowuje się to jedno duże złączone
   zdjęcie. Scroll nie triggeruje jakichś dodatkowych animacji."

   DLATEGO TEN PLIK NIE ZAWIERA ANI JEDNEJ LINII STEROWANIA PRZEWIJANIEM.
   Panel nie zna pozycji scrolla, nie ustawia `currentTime`, nie liczy postępu.
   Pasek jedzie, bo jest w zwykłym przepływie dokumentu — przeglądarka robi to
   sama i za darmo. Poprzednik tego komponentu (`SceneVideo`) przypinał czas
   filmu do scrolla; został usunięty razem z przelotami.

   „GIF" ROBIMY WIDEO, NIE GIF-EM. Cztery sekundy 900×900 w GIF-ie to kilka
   megabajtów przy 256 kolorach i widocznym pasmowaniu na ścianach; ten sam
   materiał w VP9 mieści się w ~200 KB przy pełnej palecie. Formatu nie widać,
   a rachunek za niego widać: budżet całej wizyty to 2,5 MB
   (`media-video-budgets`). Drugi zysk jest dostępnościowy: GIF-a nie da się
   zatrzymać, a `<video>` owszem — i WCAG 2.2.2 tego wymaga.

   BRAMKI, po kolei (`media-video-gating`). W KAŻDEJ odrzucającej gałęzi
   zostaje nieruchomy kadr, nigdy pustka:
     1. brak pliku pętli               -> sam kadr
     2. `MEDIA_ENABLED` = false        -> sam kadr (kill-switch `motion-tier-flag`)
     3. `prefers-reduced-motion`       -> sam kadr
     4. `pointer: coarse` (telefon)    -> sam kadr (decyzja z lipca zostaje)
     5. `saveData` albo 2g/3g          -> sam kadr
   Wideo nie powstaje wtedy w DOM. „Powstanie i będzie stało zapauzowane" to
   nie to samo: element i tak negocjuje połączenie i zajmuje pamięć.

   KTO NACISKA PLAY: nie ten komponent, tylko `loopConductor`. Panel melduje
   dyrygentowi, ile go widać, a dyrygent pozwala grać jednemu. Atrybutu
   `autoPlay` tu nie ma (jest zakazany wprost w `media-video-gating`).

   KADR POD SPODEM JEST KLATKĄ ZERO PĘTLI (`media-poster-first-frame`) i zostaje
   w DOM na zawsze: pętla jest generowana z tej samej klatki jako początkowej
   i końcowej, więc przejście kadr → nagranie i zapętlenie są niewidoczne.

   DOSTĘPNOŚĆ: panel jest dekoracją (`aria-hidden`), a puste `alt` jest tu
   POPRAWNĄ wartością, nie zaniedbaniem (`a11y-images-alt-svg-role` p.1:
   puste `alt` dla obrazu dekoracyjnego). Obraz niesie ten sam komunikat co
   nagłówek leżący obok — opisanie go słowami kazałoby czytnikowi ekranu
   przeczytać tę samą myśl dwa razy. */

/** Czy wolno zamontować pętlę. Kolejność warunków jest częścią reguły. */
function wantsLoop(): boolean {
  if (typeof window === "undefined" || !MEDIA_ENABLED) return false;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (!matchMedia("(pointer: fine)").matches) return false;
  const c = (navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
  }).connection;
  if (c?.saveData === true) return false;
  if (/^(slow-2g|2g|3g)$/.test(c?.effectiveType ?? "")) return false;
  return true;
}

/** `requestIdleCallback` z zapasem dla Safari, które go nie ma. */
function idle(f: () => void): () => void {
  const w = window as Window & {
    requestIdleCallback?: (cb: () => void) => number;
    cancelIdleCallback?: (h: number) => void;
  };
  if (typeof w.requestIdleCallback === "function") {
    const h = w.requestIdleCallback(f);
    return () => w.cancelIdleCallback?.(h);
  }
  const t = window.setTimeout(f, 200);
  return () => window.clearTimeout(t);
}

export function ScenePanel({ id }: { id: SceneId }) {
  const media = sceneMedia(id);
  const ref = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);

  /* 1) Montaż pętli dopiero po `load` i po bezczynności. Do tego czasu w DOM
        jest wyłącznie kadr — i to on, a nie wideo, jest kandydatem na LCP. */
  useEffect(() => {
    if (!media.loop) return;
    let cancelIdle: (() => void) | undefined;
    const start = () => {
      cancelIdle = idle(() => setEnabled(wantsLoop()));
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      window.removeEventListener("load", start);
      cancelIdle?.();
    };
  }, [media.loop]);

  /* 2) Zmiana ustawień ruchu w locie: włączenie „ogranicz ruch" w systemie
        ma zdjąć pętlę natychmiast, bez przeładowania strony. */
  useEffect(() => {
    if (!enabled) return;
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => {
      if (mq.matches) setEnabled(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [enabled]);

  /* 3) Ile panelu widać -> dyrygent. Obserwator stoi NIEZALEŻNIE od tego, czy
        pętla istnieje: dzięki temu w chwili, gdy `enabled` zaskoczy, dyrygent
        zna już aktualną widoczność i nie czeka na następne przewinięcie. */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        zglosWidocznosc(id, e?.isIntersecting ? e.intersectionRatio : 0);
      },
      /* Gęsta drabinka progów: bez niej obserwator melduje tylko przecięcie
         i dwa panele przy szwie mają identyczny wynik, więc zwycięzca migocze. */
      { threshold: [0, 0.1, 0.25, 0.4, 0.55, 0.7, 0.85, 1] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [id]);

  /* 4) Zgłoszenie do dyrygenta: to on woła `play()` i `pause()`. */
  useEffect(() => {
    if (!enabled) return;
    return zglosPanel(
      id,
      () => {
        const el = video.current;
        if (!el || !el.paused) return;
        /* `play()` jest asynchroniczne i wolno mu odmówić (iOS Low Power Mode,
           polityka autoodtwarzania). Odmowa = zostaje kadr, bez przycisku
           „odtwórz": taki przycisk jest zakazany w `media-video-gating`. */
        el.play().catch(() => setEnabled(false));
      },
      () => {
        const el = video.current;
        if (el && !el.paused) el.pause();
      },
    );
  }, [enabled, id]);

  const sources = media.loop ? loopSources(media.loop) : [];

  return (
    <div className="pr-panel" ref={ref} aria-hidden="true">
      {media.still ? (
        <img
          className="pr-panel-still"
          src={media.still}
          alt=""
          width={1024}
          height={1024}
          decoding="async"
          loading="lazy"
        />
      ) : null}

      {enabled && sources.length > 0 ? (
        <video
          ref={video}
          className="pr-panel-clip"
          data-ready={ready ? "true" : "false"}
          muted
          loop
          playsInline
          preload="none"
          /* Ten sam plik co kadr pod spodem, więc żadnego dodatkowego transferu:
             przeglądarka ma go już w cache. Wymagany przez `media-video-embed-spec`
             i sensowny sam w sobie — zanim dekoder wypluje pierwszą klatkę,
             element pokazuje dokładnie ten obraz, który i tak leży niżej. */
          poster={media.still}
          tabIndex={-1}
          onCanPlay={() => setReady(true)}
          onError={() => setEnabled(false)}
        >
          {sources.map((s) => (
            <source key={s.src} src={s.src} type={s.type} />
          ))}
        </video>
      ) : null}

      {/* Wygaszenie przy krawędzi tekstu: kadr ma wyglądać na wydrukowany na
          tym samym arkuszu co tekst, a nie wklejony. Gradient jest poziomy,
          więc sąsiadujące panele składają się w jeden ciągły pas bez szwu.
          Cień jest zakazany (Shape Lock). */}
      <div className="pr-panel-veil" />
    </div>
  );
}

export default ScenePanel;
