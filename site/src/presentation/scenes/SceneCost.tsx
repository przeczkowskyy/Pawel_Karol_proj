import { pick, useLang } from "@/i18n";
import { scene } from "@/data/presentation";
import { SceneFigureBlock } from "./SceneFigure";
import { SceneProse } from "./SceneProse";
import { SceneStep } from "./SceneStep";
import type { SceneContentProps } from "./types";

/* Scena 4: KOSZT PIENIĘDZY.
   Najdelikatniejsza scena w całej prezentacji, bo mówi o czyimś etacie.

   TON. To nie jest zarzut wobec kontrolera ani sugestia, że da się go odjąć.
   Firma, która zatrudniła kontrolera, właśnie wybrała człowieka; my mówimy, na co
   ma iść jego czas. Framing „zwolnisz etat", „nie zatrudniajcie", „zastąpimy
   kontrolera" jest zakazany wprost (rejestr `allowed-numbers.md`, sekcja 4),
   a akapit mówi to zdaniem wprost: „To nie jest powód, żeby kogokolwiek odejmować".
   Ta linia ma zostać — bez niej scena czyta się dokładnie odwrotnie.

   DZIAŁANIE, NIE WYNIK. Pod liczbą stoi rachunek `8 350 × 12 × 1,2048`, więc
   czytelnik może go sprawdzić w dwie sekundy zamiast brać na wiarę. Mediana
   z Ogólnopolskiego Badania Wynagrodzeń i stawka składek pracodawcy są podpisane
   pod sceną: obie liczby mają wiersz w rejestrze i obie cytujemy razem ze źródłem.

   JEDYNA LICZBA, KTÓRA PRZETRWAŁA PRZEPISANIE NARRACJI. Zostaje, bo nie mówi nic
   o arkuszach ani o błędach — mówi o tym, za co firma płaci. Działa tak samo
   dobrze w historii o przekazywaniu pracy. */
const DATA = scene("cost");

export function SceneCost({ progress }: SceneContentProps) {
  const { lang } = useLang();
  return (
    <div className="pres-scene">
      <div className="pres-lede">
        <SceneStep progress={progress} step={0}>
          <SceneFigureBlock figure={DATA.figure} />
        </SceneStep>
        <SceneStep progress={progress} step={1}>
          <h2 className="pres-headline">{pick(lang, DATA.headline)}</h2>
        </SceneStep>
      </div>
      {/* Proza rusza krok później niż w innych scenach: nad nią stoją DWA
          elementy (liczba i nagłówek), a nie jeden. */}
      <SceneProse progress={progress} body={DATA.body} from={2} />
      <p className="pres-source">{DATA.source}</p>
    </div>
  );
}

export default SceneCost;
