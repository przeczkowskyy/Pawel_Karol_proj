import type { SceneId } from "@/data/presentation";

/* ── Mapa scen na materiał ──────────────────────────────────────────────────
   JEDNO miejsce, w którym prezentacja wie, co leży pod którą sceną. Komponent
   sceny nie zna ani jednej ścieżki do pliku (reguła `media-headers-versioning`
   p. 4: zero literałów ścieżek rozsianych po komponentach).

   ── CO SIĘ ZMIENIŁO 2026-09-15 ────────────────────────────────────────────
   Do wczoraj pod scenami miały leżeć PRZELOTY: siedem klipów łączących kadr
   sceny N z kadrem sceny N+1, przewijanych pozycją scrolla. Wygenerowaliśmy
   komplet i Karol je odrzucił: „Animacje nie są płynne. Wyglądają generatywnie.
   Podczas przejść, przejścia po budynku są nierealne." W jednym klipie model
   dorobił drzwi, których nie było ani w klatce startowej, ani końcowej.

   Przyczyna jest strukturalna, nie jakościowa: przelot każe modelowi WYMYŚLIĆ
   przestrzeń między dwoma kadrami, a wymyślona architektura nie ma prawa się
   zgadzać z niczym. Nowy układ tę pracę modelowi odbiera.

   NOWY UKŁAD: osiem osobnych kadrów tego samego wnętrza, ułożonych jeden pod
   drugim w jeden pionowy pas, po którym jedzie przewijanie strony. Każdy kadr
   ma u góry poziomą drewnianą belkę, a u dołu pas pustej podłogi — belka jest
   szwem, który łączy kadr z kadrem leżącym nad nim, więc przejście między
   scenami jest ciągłe bez ani jednej klatki wygenerowanego ruchu.

   Ruch został wyłącznie WEWNĄTRZ kadru: każdy panel to łagodna pętla (kurz
   w smudze światła, para z czajnika, jeden mały gest rąk), która zaczyna się
   i kończy na tej samej klatce. Nie ma przejść, nie ma cięć, nie ma przewijania
   filmu scrollem.

   ── WERSJONOWANIE ─────────────────────────────────────────────────────────
   Pliki z `public/` nie dostają hasha Vite, a `public/_headers` podaje je jako
   `immutable`. Zmiana treści = NOWA NAZWA, nigdy nadpisanie istniejącego pliku.
   Stare kadry `scene-<id>-v4.webp` należą do układu z przelotami i nie są już
   używane; nowy zestaw to `panel-<id>-v1.*`. */

/** Dwa kodeki jednej pętli. Kadr zerowy leży osobno, w polu `still`. */
export type SceneLoopAsset = {
  /** VP9; mniejszy transfer, pierwszy w kolejności źródeł */
  webm: string;
  /** H.264; pewny dekoder na wszystkim, co nie zna VP9 */
  mp4: string;
};

export type SceneMediaEntry = {
  id: SceneId;
  /** nieruchomy kadr panelu; JEST klatką zerową pętli (`media-poster-first-frame`) */
  still?: string;
  /** łagodna pętla grana w miejscu; brak wpisu = panel stoi na samym kadrze */
  loop?: SceneLoopAsset;
};

/* Kolejność źródeł = od najmniejszego transferu do najpewniejszego dekodera.
   `type` z kodekiem jest obowiązkowe: bez niego Safari pobiera nagłówki
   każdego pliku, zanim go odrzuci. Te same wartości co `data/media.ts`. */
const WEBM = 'video/webm; codecs="vp9"';
const MP4 = 'video/mp4; codecs="avc1.640029"';

/** Zamienia wpis pętli na listę `<source>` dla `ScenePanel`. */
export function loopSources(asset: SceneLoopAsset): { src: string; type: string }[] {
  return [
    { src: asset.webm, type: WEBM },
    { src: asset.mp4, type: MP4 },
  ];
}

/** Komplet plików jednego panelu. Nazwy trzymane w jednym miejscu. */
const panel = (id: SceneId): SceneMediaEntry => ({
  id,
  still: `/media/presentation/panel-${id}-v1.webp`,
  loop: {
    webm: `/media/presentation/panel-${id}-v1.webm`,
    mp4: `/media/presentation/panel-${id}-v1.mp4`,
  },
});

/* Identyfikatory scen NIE powstają tutaj. Jedynym źródłem ośmiu beatów jest
   `src/data/presentation.ts` (tam leży też copy każdej sceny), a ten plik mówi
   wyłącznie, co pod którą sceną LEŻY. Rekord jest typowany
   `Record<SceneId, ...>`, więc dopisanie beatu bez materiału nie skompiluje się
   i nikt nie dowie się o brakującym panelu dopiero na produkcji.

   KOLEJNOŚĆ JEST TREŚCIĄ: te osiem paneli czyta się z góry na dół jako jeden
   obraz, więc zamiana miejscami dwóch wpisów psuje ciągłość budynku, a nie
   tylko kolejność argumentów. */
export const SCENE_MEDIA: Record<SceneId, SceneMediaEntry> = {
  /* 1. Wzrost: składzik upchany znacznie wyżej, niż był projektowany. */
  hook: panel("hook"),
  /* 2. Przekazanie: ściana przegródek, w nich praca czekająca na odbiór. */
  handover: panel("handover"),
  /* 3. Czas: długi stół rachunkowy, dzień się kończy, zestawienie nie. */
  time: panel("time"),
  /* 4. Koszt: biurko zawalone papierem obok pustego biurka do myślenia. */
  cost: panel("cost"),
  /* 5. Zwrot: hala, w której LUDZIE budują nowy ciąg stołów. Oś całej strony. */
  turn: panel("turn"),
  /* 6. Rzemiosło: cztery różne stanowiska, ten sam sposób pracy. */
  craft: panel("craft"),
  /* 7. Efekt: równy rząd gotowych tac i ludzie bez pośpiechu. */
  outcome: panel("outcome"),
  /* 8. Kontakt: izba przy wejściu, jedno krzesło wolne i odsunięte. */
  contact: panel("contact"),
};

/** Materiał dla sceny; zawsze zwraca wpis, nigdy `undefined`. */
export function sceneMedia(id: SceneId): SceneMediaEntry {
  return SCENE_MEDIA[id];
}
