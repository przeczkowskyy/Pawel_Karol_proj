import { Suspense, lazy } from "react";
import { pick, useLang } from "@/i18n";
import { scene } from "@/data/presentation";
import { SceneProse } from "./SceneProse";
import { SceneHeadline } from "./SceneHeadline";
import { SceneStep } from "./SceneStep";
import type { SceneContentProps } from "./types";

/* Scena 3: KOSZT CZASU.
   „Zamknięcie miesiąca. Liczone w tygodniach."

   SCENA BEZ LICZBY I TO JEST DECYZJA, nie przeoczenie. „Oszczędzamy X godzin
   tygodniowo" brzmi lepiej, ale nie zmierzyliśmy tego u żadnego klienta, a liczba
   bez pomiaru jest zmyśleniem (rejestr `allowed-numbers.md`, sekcja zakazów).

   PRZESUNIĘCIE ARGUMENTU (wersja 2): akapit nie liczy już pracochłonności, tylko
   OPÓŹNIENIE DECYZJI. Powód jest sprzedażowy i prosty — zarząd nie kupuje
   „mniej pracy w księgowości", bo ta praca i tak jest opłacona. Kupuje to, że
   decyzja o zakupie albo o wstrzymaniu projektu przestaje zapadać na obrazie
   sprzed kilku tygodni. Ta sama scena, druga dźwignia.

   WYKRES BUDUJE SIĘ PRZY PRZEWIJANIU — i to jest jedyne miejsce w prezentacji,
   gdzie tak zostało. Founder prosił o to wprost („podczas scrolowania buduje się
   jakiś wykres"), a ta scena jest jedyną, w której to ma sens narracyjny:
   zestawienie powstaje na oczach widza dokładnie tak wolno, jak powstaje
   naprawdę. Dane liczy silnik raportu na zestawie DEMO, więc ten sam build
   zawsze daje ten sam wykres — zero losowości, zero `Date.now`.

   `React.lazy` z LITERALNEJ ścieżki modułu, nie z barrela `@/motion/scroll`:
   barrel dociągnąłby przy okazji `ChaosToOrder`, którego w tej scenie nie ma. */
const DATA = scene("time");

const ScrollChart = lazy(() =>
  import("@/motion/scroll/ScrollChart").then((mod) => ({ default: mod.ScrollChart })),
);

export function SceneTime({ progress }: SceneContentProps) {
  const { lang } = useLang();
  return (
    <div className="pres-scene">
      <div className="pres-lede">
        <SceneStep progress={progress} step={0}>
          <SceneHeadline text={pick(lang, DATA.headline)} />
        </SceneStep>
        <SceneStep progress={progress} step={3}>
          <div className="pres-illo">
            <Suspense fallback={<div className="pres-illo-skeleton" aria-hidden />}>
              <ScrollChart />
            </Suspense>
          </div>
        </SceneStep>
      </div>
      <SceneProse progress={progress} body={DATA.body} points={DATA.points} />
    </div>
  );
}

export default SceneTime;
