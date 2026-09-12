/* Jedno źródło ścieżek do plików medialnych w `site/public/media/**`
   (reguła media-headers-versioning p.4: zero literałów ścieżek rozsianych po
   komponentach). Pliki z `public/` nie dostają hasha Vite, więc wersja siedzi
   w NAZWIE (`-v1`) i `public/_headers` podaje je jako `immutable`: zmiana
   treści = nowa nazwa `-v2`, nigdy nadpisanie.

   Kadr hero (`HERO_POSTER`) jest tym samym plikiem w trzech miejscach:
   1. `<img class="hero-shot">` w `components/HeroMedia.tsx` (element LCP),
   2. `<img>` w shellu prerendera (`prerender/entry.tsx`), bo shell nie ma
      ani Reacta, ani znacznika video,
   3. atrybut `poster` na nagraniu w `HeroMedia`
   plus `<link rel="preload" as="image">` w `site/index.html`.
   Plik jest KLATKĄ ZERO nagrania `hero-production-v1.webm` (PSNR 52,92 dB wobec
   klatki 0, `site/media/CLIPS.json`), więc crossfade poster → nagranie jest
   niewidoczny (reguła media-poster-first-frame).

   Klipy hover ściany narzędzi (`/media/tools/<slug>-v1.webm`) dopisuje okno F3
   w tym samym module: to ma zostać jedno miejsce na całe `public/media`. */

import type { Bilingual } from "@/data/messaging";

/** kadr produktu: poster nagrania i element LCP na „/” (1600×1000, 64 546 B) */
export const HERO_POSTER = "/media/hero-production-v1.webp";
/** ten sam kadr w wariancie mobilnym (800×500, 25 100 B) */
export const HERO_POSTER_800 = "/media/hero-production-v1-800.webp";

/* Kandydat `srcset` i `sizes` musi być IDENTYCZNY z `imagesrcset`/`imagesizes`
   w `site/index.html`, inaczej przeglądarka pobierze dwa pliki: raz z preloadu,
   raz z `<img>` (zmarnowane pasmo na ścieżce LCP, perf-lcp-poster-preload).
   Przy zmianie tych dwóch stałych zmień ten sam tekst w index.html. */
export const HERO_POSTER_SRCSET = `${HERO_POSTER_800} 800w, ${HERO_POSTER} 1600w`;
export const HERO_POSTER_SIZES = "(max-width: 1023px) 100vw, 50vw";

/** wymiary jawne na obrazie i na nagraniu: CLS 0 (perf-images-policy) */
export const HERO_W = 1600;
export const HERO_H = 1000;

/* Kolejność źródeł = od najmniejszego transferu do najpewniejszego dekodera.
   `type` z kodekiem jest obowiązkowe: bez niego Safari pobiera nagłówki każdego
   pliku, zanim go odrzuci. Wartości zweryfikowane ffprobe na plikach w repo:
   WebM = VP9 profile 0, MP4 = H.264 High level 4.1 (`avc1.6400` + `29` = 41 hex).
   Wariantu AV1 nie ma (opcjonalny wg planu §6.7). */
export const HERO_SOURCES = [
  { src: "/media/hero-production-v1.webm", type: 'video/webm; codecs="vp9"' },
  { src: "/media/hero-production-v1.mp4", type: 'video/mp4; codecs="avc1.640029"' },
] as const;

/** opis kadru dla czytników; treść z planu §3 S1 (i18n-pl-en-pair-required) */
export const HERO_ALT: Bilingual = {
  pl: "Pulpit produkcji: kafle hal i suwak tygodnia, dane przykładowe",
  en: "Production dashboard: hall tiles and a week slider, sample data",
};

/* Etykiety kontroli pauzy (WCAG 2.2.2). Mówią prawdę: w hero nie stoi tło,
   tylko PODGLĄD prawdziwego narzędzia (brand-honest-labels). */
export const HERO_TOGGLE: { pause: Bilingual; play: Bilingual } = {
  pause: { pl: "Zatrzymaj podgląd", en: "Pause preview" },
  play: { pl: "Odtwórz podgląd", en: "Play preview" },
};
