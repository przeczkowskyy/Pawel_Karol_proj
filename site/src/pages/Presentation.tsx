/* klarow.com jako prezentacja: osiem scen w ramie dzielonej.
 *
 * UKŁAD (decyzja 2026-09-14, po pomiarze kontrastu i po uwadze Karola
 * „animacja musi stanowić większą część strony"):
 * lewa kolumna to CZYTANIE w zwykłym przepływie, prawa — szersza, 60 % —
 * to jedyny przyklejony element na stronie: kolumna medialna.
 *
 * DLACZEGO NIE PEŁNY EKRAN, mimo wcześniejszej prośby o „wideo pełnoekranowe
 * pod każdą sceną": zmierzyliśmy kontrast ciemnego tekstu na gęstej ilustracji
 * i bezpieczna była wyłącznie dolna ćwiartka kadru. Pełny ekran nie spełnia
 * jednocześnie dwóch wymagań, które padły razem — „kadr ma być gęsty" i „do
 * tego musi dojść tekst". Tutaj animacja jest gęsta w pełnej sile koloru, bez
 * ani jednego procenta zasłony, a tekst leży na nieprzezroczystym papierze.
 *
 * Ten plik jest WYŁĄCZNIE montażem: bierze osiem beatów ze scenariusza i mapuje
 * je na komponenty treści. Żadnej logiki ruchu (jest w `presentation/Scene.tsx`),
 * żadnego copy (jest w `data/presentation.ts`), żadnej wiedzy o materiale
 * (jest w `presentation/StageMedia.tsx`).
 */

import { Scene, Stage } from "@/presentation";
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
          <Scene key={s.id} id={s.id} entry={i > 0}>
            {(scene) => <Content progress={scene.progress} onBook={onBook} />}
          </Scene>
        );
      })}
    </Stage>
  );
}
