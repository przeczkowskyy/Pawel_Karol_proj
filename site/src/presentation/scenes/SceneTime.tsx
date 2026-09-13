import { pick, useLang } from "@/i18n";
import { scene } from "@/data/presentation";
import { SceneStep } from "./SceneStep";
import type { SceneContentProps } from "./types";

/* Scena 3: KOSZT CZASU.
   Scena bez liczby i to jest decyzja, nie przeoczenie. „Oszczędzamy X godzin
   tygodniowo" brzmi lepiej, ale nie zmierzyliśmy tego u żadnego klienta, a liczba
   bez pomiaru jest zmyśleniem (rejestr `allowed-numbers.md`, sekcja zakazów).
   Zdanie mówi dokładnie tyle, ile wiadomo, i ani słowa więcej.

   Ciężar niesie tu ruch tła (zegar, kolumna godzin), za który odpowiada silnik.
   Warstwa treści zostaje pusta poza jednym zdaniem. */
const DATA = scene("time");

export function SceneTime({ progress }: SceneContentProps) {
  const { lang } = useLang();
  return (
    <div className="pres-scene">
      <SceneStep progress={progress}>
        <h2 className="pres-headline">{pick(lang, DATA.headline)}</h2>
      </SceneStep>
    </div>
  );
}

export default SceneTime;
