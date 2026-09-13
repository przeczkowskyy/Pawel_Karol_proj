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
 * DŁUGOŚĆ TORU decyduje o tempie i w wersji 2 URosła. Powód: scena niesie teraz
 * nie samo zdanie, tylko zdanie plus akapit plus trzy punkty (`data/presentation.ts`,
 * sekcja o objętości). Tor z wersji 1 wyprowadzałby treść, zanim ktokolwiek zdążyłby
 * ją przeczytać. Suma to około 17 ekranów — tyle trwa przejrzenie broszury.
 *
 * MATERIAŁ WIDEO: dziś każda scena gra tłem zastępczym, bo nie ma jeszcze materiału
 * z Higgsfield (konto bez kredytów, stan na 2026-09-13). Gdy powstanie, podmiana
 * jest w `sceneMedia.ts`, nie tutaj: ten plik nie wie, czy pod sceną leży wideo,
 * czy gradient. Prompty do ośmiu klipów: `docs/plan/prezentacja-scenariusz.md` §4.5.
 */

import { Scene, SceneFallbackMedia, SceneVideo, Stage, videoSources } from "@/presentation";
import { SCENE_CONTENT } from "@/presentation/scenes";
import { sceneMedia } from "@/presentation/sceneMedia";
import { SCENES, type SceneId } from "@/data/presentation";

/** Tor przewijania na scenę. Więcej treści na scenie = dłuższy tor. */
const LENGTH: Record<SceneId, string> = {
  hook: "200vh",
  handover: "220vh",
  /* Scena 3 ma własny wykres budujący się przy przewijaniu: musi mieć tor,
     na którym zdąży się zbudować, zanim tekst zacznie wyjeżdżać. */
  time: "260vh",
  cost: "240vh",
  turn: "220vh",
  craft: "240vh",
  outcome: "200vh",
  contact: "180vh",
};

/* SIATKA KOMÓREK ZESZŁA ZE SCENY (wersja 2). Była ilustracją arkusza
   kalkulacyjnego i należała do narracji o Excelu, której już nie prowadzimy
   („Nie skupiamy się na błędach w excelu"). Prop `grid` w `SceneFallbackMedia`
   zostaje jako opcja, ale żadna scena go dziś nie włącza — świadomie. */

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
              <SceneFallbackMedia still={media.still} />
            )
          }>
            {(scene) => <Content progress={scene.progress} onBook={onBook} />}
          </Scene>
        );
      })}
    </Stage>
  );
}
