import { pick, useLang } from "@/i18n";
import { scene } from "@/data/presentation";
import { SceneFigureBlock } from "./SceneFigure";
import { SceneStep } from "./SceneStep";
import type { SceneContentProps } from "./types";

/* Scena 4: KOSZT PIENIĘDZY.
   Najdelikatniejsza scena w całej prezentacji, bo mówi o czyimś etacie.

   TON. To nie jest zarzut wobec kontrolera ani sugestia, że da się go odjąć.
   Firma, która zatrudniła kontrolera, właśnie wybrała człowieka; my mówimy, na co
   ma iść jego czas. Framing „zwolnisz etat", „nie zatrudniajcie", „zastąpimy
   kontrolera" jest zakazany wprost (rejestr `allowed-numbers.md`, sekcja 4).

   DZIAŁANIE, NIE WYNIK. Pod liczbą stoi rachunek `8 350 × 12 × 1,2048`, więc
   czytelnik może go sprawdzić w dwie sekundy zamiast brać na wiarę. Mediana
   z Ogólnopolskiego Badania Wynagrodzeń i stawka składek pracodawcy są podpisane
   pod sceną: obie liczby mają wiersz w rejestrze i obie cytujemy razem ze źródłem. */
const DATA = scene("cost");

export function SceneCost({ progress }: SceneContentProps) {
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
        <p className="pres-source">{DATA.source}</p>
      </SceneStep>
    </div>
  );
}

export default SceneCost;
