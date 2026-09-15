/* klarow.com jako prezentacja: osiem scen, po jednej na wiersz.
 *
 * UKŁAD (decyzja Karola 2026-09-15): lewa kolumna to CZYTANIE, prawa — szersza,
 * 60 % — to jeden panel obrazu na scenę. Osiem paneli leży jeden pod drugim
 * i tworzy JEDEN ciągły pionowy obraz wnętrza budynku: „jak scrolujesz to
 * przescrolowuje się to jedno duże złączone zdjęcie".
 *
 * SZWEM JEST BELKA. Każdy kadr ma u góry poziomą drewnianą belkę, a u dołu pas
 * pustej podłogi, więc styk dwóch scen czyta się jako podłoga górnego
 * pomieszczenia i belka, która ją niesie — a nie jako cięcie montażowe.
 *
 * PRZEWIJANIE NICZEGO NIE URUCHAMIA. Pas jedzie, bo jest w zwykłym przepływie
 * dokumentu. Ruch jest wyłącznie WEWNĄTRZ kadru: każdy panel to łagodna pętla
 * grana w miejscu. Poprzedni układ (przeloty dronem przewijane scrollem) został
 * odrzucony: „Animacje nie są płynne. Wyglądają generatywnie. Podczas przejść,
 * przejścia po budynku są nierealne."
 *
 * DLACZEGO NIE PEŁNY EKRAN, mimo wcześniejszej prośby o „wideo pełnoekranowe
 * pod każdą sceną": zmierzyliśmy kontrast ciemnego tekstu na gęstej ilustracji
 * i bezpieczna była wyłącznie dolna ćwiartka kadru. Tutaj obraz jest gęsty
 * w pełnej sile koloru, bez ani jednego procenta zasłony, a tekst leży obok, na
 * nieprzezroczystym papierze.
 *
 * Ten plik jest WYŁĄCZNIE montażem: bierze osiem beatów ze scenariusza i mapuje
 * je na komponenty treści. Żadnej logiki ruchu (jest w `presentation/Scene.tsx`),
 * żadnego copy (jest w `data/presentation.ts`), żadnej wiedzy o materiale
 * (jest w `presentation/sceneMedia.ts`).
 */

import { Scene, ScenePanel, Stage } from "@/presentation";
import { SCENE_CONTENT } from "@/presentation/scenes";
import { SCENES } from "@/data/presentation";

export default function Presentation({ onBook }: { onBook: () => void }) {
  return (
    <Stage onBook={onBook}>
      {SCENES.map((s, i) => {
        const Content = SCENE_CONTENT[s.id];
        return (
          /* Scena 1 nie animuje wejścia: treść nad pierwszym zgięciem nie może
             startować niewidoczna (reguła `motion-no-initial-hidden-above-fold`). */
          <Scene key={s.id} id={s.id} entry={i > 0} media={<ScenePanel id={s.id} />}>
            {(scene) => <Content progress={scene.progress} onBook={onBook} />}
          </Scene>
        );
      })}
    </Stage>
  );
}
