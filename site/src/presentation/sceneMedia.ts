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

   Prompty do wygenerowania materiału (S1–S8, po jednym na scenę), formuła stylu
   i parametry modeli: `docs/plan/prezentacja-scenariusz.md` §4. */

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
   zakupu ani generacji — robi to founder (`docs/plan/prezentacja-scenariusz.md` §6,
   decyzja D-38).

   OSIEM KLIPÓW, PO JEDNYM NA SCENĘ. Wersja 1 planowała trzy nagrania i jedną
   fakturę na resztę scen. Founder poprosił wprost o „wideo pełnoekranowe pod
   każdą sceną", więc plan to komplet S1–S8. Gotowe prompty do każdego z nich
   leżą w scenariuszu §4.5 i są napisane w jednym zablokowanym stylu
   („Editorial Motion Graphics"), żeby osiem klipów czytało się jak jeden film.

   const S = (name: string): SceneVideoAsset => ({
     webm: `/media/presentation/${name}-v1.webm`,
     mp4: `/media/presentation/${name}-v1.mp4`,
     poster: `/media/presentation/${name}-v1.webp`,
   });
   // scene-hook, scene-handover, scene-time, scene-cost,
   // scene-turn, scene-craft, scene-outcome, scene-contact

   DWA WARUNKI KODOWANIA, OBA TWARDE:

   1. GĘSTE KLATKI KLUCZOWE (`-g 12` przy 30 fps, czyli co ~0,4 s). Bez tego
      dekoder przy każdym skoku `currentTime` cofa się do poprzedniej klatki
      kluczowej i przewijanie zacina — a u nas czasem filmu steruje scroll.
   2. BEZ ŚCIEŻKI DŹWIĘKU. Materiał leży pod treścią i nigdy nie gra dźwiękiem;
      ścieżka audio to czysty transfer do wyrzucenia.

   Szczegóły kodowania:
   `.claude/skills/klarow-guardian/references/higgsfield-pipeline.md`. */

/** Co leży pod którą sceną. Dziś: komplet na materiale zastępczym. */
export const SCENE_MEDIA: Record<SceneId, SceneMediaEntry> = {
  /* 1. Hak: firma urosła, proces został ten sam. Docelowo S1. */
  hook: {
    id: "hook",
    still: "/media/presentation/scene-hook-v1.webp",
    fallback: "shot",
  },

  /* 2. Przekazanie: praca stoi między ludźmi. Docelowo S2.
     Siatka komórek w tle zastępczym włącza się propsem `grid` na
     `SceneFallbackMedia`, nie tutaj: to decyzja wizualna sceny, nie materiału. */
  handover: {
    id: "handover",
    still: "/media/presentation/scene-handover-v1.webp",
    fallback: "shot",
  },

  /* 3. Koszt czasu: zamknięcie miesiąca. Docelowo S3.
     Scena ma też własny wykres budujący się przy przewijaniu (SceneTime),
     więc materiał tła musi być SPOKOJNY — dwa ruchy naraz się zabijają. */
  time: {
    id: "time",
    still: "/media/presentation/scene-time-v1.webp",
    fallback: "shot",
  },

  /* 4. Koszt pieniędzy: rozbicie działania na ekranie. Docelowo S4. */
  cost: {
    id: "cost",
    still: "/media/presentation/scene-cost-v1.webp",
    fallback: "shot",
  },

  /* 5. Zwrot: rozsypane elementy składają się w jeden układ. Docelowo S5.
     To jest oś całego filmu i jedyna scena z mocnym uderzeniem w materiale
     (scenariusz §4.5, S5) — reszta scen ma być spokojna, żeby ta jedna zagrała. */
  turn: {
    id: "turn",
    still: "/media/presentation/scene-turn-v1.webp",
    fallback: "shot",
  },

  /* 6. Co potrafimy: sześć rodzajów pracy. Docelowo S6.
     UWAGA: to już NIE jest scena ze zrzutami narzędzi (wersja 2 scenariusza).
     Materiał ma pokazywać rodzaje pracy, nie nasze interfejsy. */
  craft: {
    id: "craft",
    still: "/media/presentation/scene-craft-v1.webp",
    fallback: "shot",
  },

  /* 7. Efekt: plątanina rozplątuje się w równoległe linie. Docelowo S7. */
  outcome: {
    id: "outcome",
    still: "/media/presentation/scene-outcome-v1.webp",
    fallback: "shot",
  },

  /* 8. Kontakt: scena pustoszeje, zostaje jedna karta. Docelowo S8. */
  contact: {
    id: "contact",
    still: "/media/presentation/scene-contact-v1.webp",
    fallback: "shot",
  },
};

/** Materiał dla sceny; zawsze zwraca wpis, nigdy `undefined`. */
export function sceneMedia(id: SceneId): SceneMediaEntry {
  return SCENE_MEDIA[id];
}
