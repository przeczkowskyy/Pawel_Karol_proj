import type { SceneId } from "@/data/presentation";

/* ── Mapa scen na materiał ──────────────────────────────────────────────────
   JEDNO miejsce, w którym prezentacja wie, co leży pod którą sceną. Komponent
   sceny nie zna ani jednej ścieżki do pliku (reguła `media-headers-versioning`
   p. 4: zero literałów ścieżek rozsianych po komponentach).

   Stan na dziś: Karol nie kupił jeszcze subskrypcji Higgsfielda, więc WSZYSTKIE
   osiem scen wskazuje `fallback`. Prezentacja ma działać i wyglądać sensownie
   bez ani jednego pliku wideo, i działa: gradient stalowy z siatką komórek
   (`SceneFallbackMedia`) jest zaprojektowanym tłem, nie dziurą po pliku.

   Gdy materiał powstanie, podmiana to JEDNA linia na scenę: odkomentuj wpis
   `video` i zmień `fallback` na `"shot"` (poster wideo zostaje kadrem pod
   spodem). Nic więcej w kodzie się nie zmienia.

   Wersjonowanie nazw (`-v1`) jest obowiązkowe: pliki z `public/` nie dostają
   hasha Vite, a `public/_headers` podaje je jako `immutable`. Zmiana treści =
   nowa nazwa `-v2`, NIGDY nadpisanie istniejącego pliku.

   Identyfikatory materiału (V1, V2, V3, S1) i budżet kredytów: patrz
   `docs/plan/prezentacja-scenariusz.md` sekcja „Materiał z Higgsfield". */

/* Identyfikatory scen NIE powstają tutaj. Jedynym źródłem ośmiu beatów jest
   `src/data/presentation.ts` (tam leży też copy każdej sceny), a ten plik mówi
   wyłącznie, co pod którą sceną LEŻY. Rekord poniżej jest typowany
   `Record<SceneId, ...>`, więc dopisanie beatu bez materiału nie skompiluje się
   i nikt nie dowie się o brakującym tle dopiero na produkcji. */

/** Komplet plików jednego nagrania: dwa kodeki plus kadr zerowy. */
export type SceneVideoAsset = {
  /** VP9; mniejszy transfer, pierwszy w kolejności źródeł */
  webm: string;
  /** H.264; pewny dekoder na wszystkim, co nie zna VP9 */
  mp4: string;
  /** KLATKA ZERO nagrania (reguła media-poster-first-frame): przejście kadr → nagranie ma być niewidoczne */
  poster: string;
};

export type SceneMediaEntry = {
  id: SceneId;
  /** nagranie przewijane pozycją scrolla; brak wpisu = scena gra na `fallback` */
  video?: SceneVideoAsset;
  /** statyczny kadr pod gradientem; działa i z wideo (jako poster zapasowy), i bez */
  still?: string;
  /** czym scena gra, dopóki nie ma nagrania */
  fallback: "gradient" | "shot";
};

/* Kolejność źródeł = od najmniejszego transferu do najpewniejszego dekodera.
   `type` z kodekiem jest obowiązkowe: bez niego Safari pobiera nagłówki
   każdego pliku, zanim go odrzuci. Te same wartości co `data/media.ts`. */
const WEBM = 'video/webm; codecs="vp9"';
const MP4 = 'video/mp4; codecs="avc1.640029"';

/** Zamienia wpis materiału na listę `<source>` dla `SceneVideo`. */
export function videoSources(asset: SceneVideoAsset): { src: string; type: string }[] {
  return [
    { src: asset.webm, type: WEBM },
    { src: asset.mp4, type: MP4 },
  ];
}

/* ── Materiał do podmiany, gdy Higgsfield będzie opłacony ──────────────────
   Zakomentowane CELOWO, z docelowymi nazwami plików. Agent nie uruchamia
   zakupu ani generacji (scenariusz, sekcja „Materiał z Higgsfield").

   V1 — scena 1 „Hak": pętla stalowa, powolny ruch materii, bez ludzi i tekstu.
   const V1: SceneVideoAsset = {
     webm: "/media/presentation/scene-hook-steel-v1.webm",
     mp4: "/media/presentation/scene-hook-steel-v1.mp4",
     poster: "/media/presentation/scene-hook-steel-v1.webp",
   };

   V2 — scena 5 „Zwrot": rozsypane elementy zbiegają się w tabelę.
   const V2: SceneVideoAsset = {
     webm: "/media/presentation/scene-turn-order-v1.webm",
     mp4: "/media/presentation/scene-turn-order-v1.mp4",
     poster: "/media/presentation/scene-turn-order-v1.webp",
   };

   V3 — scena 8 „Kontakt": wygaszenie do czerni ze stalowym refleksem.
   const V3: SceneVideoAsset = {
     webm: "/media/presentation/scene-contact-fade-v1.webm",
     mp4: "/media/presentation/scene-contact-fade-v1.mp4",
     poster: "/media/presentation/scene-contact-fade-v1.webp",
   };

   S1 — tło scen 2–4: statyczna faktura stali pod tekstem (obraz, nie wideo).
   const S1 = "/media/presentation/scene-texture-steel-v1.webp";

   WARUNEK DLA WIDEO PRZEWIJANEGO: plik musi mieć GĘSTE KLATKI KLUCZOWE
   (`-g 12` przy 30 fps, czyli klatka kluczowa co ~0,4 s). Bez tego dekoder
   przy każdym skoku `currentTime` cofa się do poprzedniej klatki kluczowej
   i przewijanie zacina. Szczegóły kodowania:
   `.claude/skills/klarow-guardian/references/higgsfield-pipeline.md`. */

/** Co leży pod którą sceną. Dziś: komplet na materiale zastępczym. */
export const SCENE_MEDIA: Record<SceneId, SceneMediaEntry> = {
  /* 1. Hak: „Twoja firma działa na plikach." Docelowo V1. */
  hook: { id: "hook", fallback: "gradient" },

  /* 2. Skala chaosu: 88 % arkuszy ma błąd w formule. Docelowo S1 jako faktura.
     Siatka komórek w tle zastępczym włącza się propsem `grid` na
     `SceneFallbackMedia`, nie tutaj: to decyzja wizualna sceny, nie materiału. */
  scale: { id: "scale", fallback: "gradient" },

  /* 3. Koszt czasu: zamknięcie miesiąca. Docelowo S1. */
  time: { id: "time", fallback: "gradient" },

  /* 4. Koszt pieniędzy: rozbicie działania na ekranie. Docelowo S1. */
  cost: { id: "cost", fallback: "gradient" },

  /* 5. Zwrot: chaos składa się w tabelę, wjeżdża pulpit. Docelowo V2.
     Dziś gra kadrem prawdziwego narzędzia, który i tak jest w repo:
     ta sama klatka co poster hero, więc zero nowego transferu. */
  turn: { id: "turn", fallback: "gradient" },

  /* 6. Dowód: ściana narzędzi. Materiał powstaje ze zrzutów Playwrighta
     za zero kredytów, więc ta scena nigdy nie potrzebuje Higgsfielda. */
  proof: { id: "proof", fallback: "gradient" },

  /* 7. Efekt: cztery zdania na spokojnym tle. Z założenia bez materiału. */
  outcome: { id: "outcome", fallback: "gradient" },

  /* 8. Kontakt: kadr wygasza się do czerni. Docelowo V3. */
  contact: { id: "contact", fallback: "gradient" },
};

/** Materiał dla sceny; zawsze zwraca wpis, nigdy `undefined`. */
export function sceneMedia(id: SceneId): SceneMediaEntry {
  return SCENE_MEDIA[id];
}
