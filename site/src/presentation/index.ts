/* Silnik prezentacji klarow.com: jeden ciąg scen przewijanych myszą, bez
   zakładek i bez nawigacji. Scenariusz ośmiu scen jest wiążący i leży
   w `docs/plan/prezentacja-scenariusz.md`.

   Cztery zasady, których nie wolno obejść w niczym, co tu wchodzi:
   1. zero przechwytywania gestu: ani `wheel`, ani `touchmove`, ani `scroll`,
      ani blokady `overflow` na `body`, ani programowego przewijania,
   2. ruszają się wyłącznie `transform`, `opacity`, `clip-path` i `filter`,
   3. `prefers-reduced-motion` renderuje ciąg statycznych sekcji z KOMPLETEM
      treści w stanie KOŃCOWYM, nigdy w początkowym i nigdy pusto,
   4. zero `Math.random` i zero `Date.now`.

   Nic z tego katalogu NIE MOŻE trafić do `src/prerender/entry.tsx`: shell
   statyczny niesie treść bez biblioteki ruchu (reguła
   `motion-no-motion-in-prerender`). Na trasę prezentacja wchodzi zwykłym
   importem albo przez `React.lazy`.

   Instrukcja: `README.md` w tym katalogu. */

export { Stage } from "./Stage";
export { Scene } from "./Scene";
export { SceneVideo } from "./SceneVideo";
export { SceneFallbackMedia } from "./SceneFallbackMedia";
export { useScene, useStage, type SceneApi, type StageApi } from "./context";
export {
  SCENE_MEDIA,
  sceneMedia,
  videoSources,
  type SceneMediaEntry,
  type SceneVideoAsset,
} from "./sceneMedia";
