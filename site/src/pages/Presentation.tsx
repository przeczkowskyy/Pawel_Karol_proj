/* klarow.com jako prezentacja: osiem scen w jednym ciągu, bez zakładek.
 *
 * Decyzja Karola (2026-09-13): „Chciałbym żeby to była prezentacja. Jedna wielka
 * animacja wraz ze scrollowaniem, broszura. Bez zakładek, bez niczego."
 *
 * Ten plik jest WYŁĄCZNIE montażem: bierze osiem beatów ze scenariusza, dla każdego
 * dokłada tło z `sceneMedia.ts` i treść z `scenes/index.ts`. Żadnej logiki ruchu
 * (jest w `presentation/Scene.tsx`), żadnego copy (jest w `data/presentation.ts`).
 * Dodanie sceny to wpis w danych plus komponent treści; tutaj nie trzeba nic robić
 * poza ewentualną zmianą długości toru przewijania.
 *
 * DŁUGOŚĆ TORU decyduje o tempie. Scena, która niesie tylko jedno zdanie, dostaje
 * krótszy tor (150vh), bo dłuższy każe przewijać przez pustkę. Sceny z liczbą albo
 * z ilustracją dostają 220vh, żeby ruch zdążył się wydarzyć, zanim tekst wyjedzie.
 * Suma torów to około 14 ekranów, czyli tyle, ile trwa obejrzenie broszury.
 *
 * MATERIAŁ WIDEO: dziś każda scena gra tłem zastępczym, bo nie ma jeszcze materiału
 * z Higgsfield (konto bez kredytów, stan na 2026-09-13). Gdy powstanie, podmiana
 * jest w `sceneMedia.ts`, nie tutaj: ten plik nie wie, czy pod sceną leży wideo,
 * czy gradient.
 */

import { Scene, SceneFallbackMedia, SceneVideo, Stage, videoSources } from "@/presentation";
import { SCENE_CONTENT } from "@/presentation/scenes";
import { sceneMedia } from "@/presentation/sceneMedia";
import { SCENES, type SceneId } from "@/data/presentation";

/** Tor przewijania na scenę. Krótkie zdanie: krócej. Liczba albo ilustracja: dłużej. */
const LENGTH: Record<SceneId, string> = {
  hook: "180vh",
  scale: "220vh",
  time: "180vh",
  cost: "220vh",
  turn: "200vh",
  proof: "240vh",
  outcome: "200vh",
  contact: "160vh",
};

/** Scena 2 dostaje siatkę komórek w tle: to jej temat, nie ozdoba. */
const GRID_SCENES: ReadonlySet<SceneId> = new Set<SceneId>(["scale"]);

export default function Presentation({ onBook }: { onBook: () => void }) {
  return (
    <Stage>
      {SCENES.map((s) => {
        const media = sceneMedia(s.id);
        const Content = SCENE_CONTENT[s.id];
        return (
          <Scene key={s.id} id={s.id} length={LENGTH[s.id]} media={
            media.video ? (
              <SceneVideo sources={videoSources(media.video)} poster={media.video.poster} />
            ) : (
              <SceneFallbackMedia still={media.still} grid={GRID_SCENES.has(s.id)} />
            )
          }>
            {(scene) => <Content progress={scene.progress} onBook={onBook} />}
          </Scene>
        );
      })}
    </Stage>
  );
}
