import { Suspense, lazy } from "react";
import { pick, useLang } from "@/i18n";
import { scene } from "@/data/presentation";
import { SceneFigureBlock } from "./SceneFigure";
import { SceneStep } from "./SceneStep";
import type { SceneContentProps } from "./types";

/* Scena 2: SKALA CHAOSU.
   Liczba jest bohaterem, zdanie ją tylko nazywa. Dlatego kolejność w DOM i w
   kaskadzie to najpierw liczba, potem zdanie: widz czyta z góry, a 88 % ma
   trafić pierwsze.

   ŹRÓDŁO STOI NA EKRANIE, nie w przypisie na dole strony. Panko to jedyna
   recenzowana publikacja, do której dotarliśmy; liczba bez niej byłaby kolejnym
   „wiadomo, że" i kasowałaby wiarygodność pozostałych liczb w prezentacji.

   ILUSTRACJA. `ChaosToOrder` wchodzi przez `React.lazy` z LITERALNEJ ścieżki
   modułu, nie z barrela `@/motion/scroll`: barrel dociągnąłby także `ScrollChart`
   razem z silnikiem raportu i zestawem DEMO.

   RYZYKO DO UZGODNIENIA Z SILNIKIEM: ten komponent ma WŁASNY wyzwalacz
   przewijania (`useScroll` po swoim refie, offset „start 85 %" do „end 45 %"),
   którego nie da się wpiąć w lokalny postęp sceny bez zmiany pliku w
   `motion/scroll` (cudzy katalog). W scenie przyklejonej `sticky` jego postęp
   dobiega do końca JESZCZE W FAZIE WJAZDU, więc w chwili, gdy widz czyta „to nie
   jest wyjątek, to reguła", siatka jest już uporządkowaną tabelą, czyli mówi
   dokładnie odwrotnie niż scena. Degradacja jest łagodna (stan końcowy, nie
   pustka), ale narracyjnie błędna. Najtańsza naprawa: przenieść ilustrację do
   sceny „turn", gdzie „chaos w porządek" JEST treścią, a scenie 2 zostawić samą
   liczbę na tle silnika. */
const DATA = scene("scale");

const ChaosToOrder = lazy(() =>
  import("@/motion/scroll/ChaosToOrder").then((mod) => ({ default: mod.ChaosToOrder })),
);

export function SceneScale({ progress }: SceneContentProps) {
  const { lang } = useLang();
  return (
    <div className="pres-scene">
      <SceneStep progress={progress} step={0}>
        <SceneFigureBlock figure={DATA.figure} />
      </SceneStep>
      <SceneStep progress={progress} step={1}>
        <h2 className="pres-headline">{pick(lang, DATA.headline)}</h2>
      </SceneStep>
      <SceneStep progress={progress} step={2}>
        <div className="pres-illo">
          <Suspense fallback={<div className="pres-illo-skeleton" aria-hidden />}>
            <ChaosToOrder count={72} />
          </Suspense>
        </div>
        <p className="pres-source">{DATA.source}</p>
      </SceneStep>
    </div>
  );
}

export default SceneScale;
