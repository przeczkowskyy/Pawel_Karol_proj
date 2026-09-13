import { pick, useLang } from "@/i18n";
import { scene } from "@/data/presentation";
import { SceneProse } from "./SceneProse";
import { SceneStep } from "./SceneStep";
import type { SceneContentProps } from "./types";

/* Scena 2: PRZEKAZANIE. Nowa scena wersji 2, w miejsce usuniętej „skali chaosu".
   „Praca nie stoi u ludzi. Stoi między nimi."

   TO JEST SEDNO CAŁEJ NOWEJ NARRACJI. Poprzednia wersja stawiała tu 88 %
   arkuszy z błędem w formule — liczba prawdziwa, ze źródłem, ale opowiadająca
   nie tę historię. Founder: „Zły writing. Nie skupiamy się na błędach w excelu".

   Różnica nie jest kosmetyczna. „Twoje arkusze mają błędy" mówi, że zespół
   pracuje źle, więc czytelnik zaczyna się bronić. „Praca stoi między ludźmi"
   mówi, że zespół pracuje dobrze, a traci go proces — czyli jedyna rzecz
   w całym zdaniu, którą da się przebudować, i akurat ta, którą sprzedajemy.
   Ta sama prawda, druga strona stołu.

   ŻADNEJ LICZBY. Nie zmierzyliśmy czasu przekazań u żadnego klienta, więc nie
   ma tu procentu ani liczby godzin. Akapit opisuje mechanizm, który czytelnik
   rozpozna u siebie sam — to działa lepiej niż cudza statystyka i nie łamie
   rejestru liczb dozwolonych. */
const DATA = scene("handover");

export function SceneHandover({ progress }: SceneContentProps) {
  const { lang } = useLang();
  return (
    <div className="pres-scene">
      <div className="pres-lede">
        <SceneStep progress={progress} step={0}>
          <h2 className="pres-headline">{pick(lang, DATA.headline)}</h2>
        </SceneStep>
      </div>
      <SceneProse progress={progress} body={DATA.body} points={DATA.points} />
    </div>
  );
}

export default SceneHandover;
