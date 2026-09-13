import { Suspense, lazy } from "react";
import { pick, useLang } from "@/i18n";
import { scene } from "@/data/presentation";
import { SceneStep } from "./SceneStep";
import type { SceneContentProps } from "./types";

/* Scena 5: ZWROT.
   Pierwsze zdanie o nas w całej prezentacji pada dopiero tutaj, po czterech
   scenach o kliencie. „Zamiast poprawiać plik" odcina nas od konsultanta, który
   porządkuje arkusz i zostawia ten sam arkusz.

   Podlinia niesie mechanikę pilotu: kopia danych i termin. To jedyne dwie rzeczy,
   o które klient pyta na tym etapie, i obie są w rejestrze liczb dozwolonych
   („do 10 dni", zakres: strona główna).

   WYKRES BUDUJE SIĘ PRZY PRZEWIJANIU i to jest cała treść wizualna sceny: widz
   ma zobaczyć narzędzie przy pracy, a nie zrzut narzędzia. Dane liczy silnik
   raportu na zestawie DEMO, więc ten sam plik zawsze daje ten sam wykres.
   `React.lazy` z literalnej ścieżki modułu (nie z barrela): chunk sceny nie ma
   ciągnąć `ChaosToOrder`, którego tu nie ma. */
const DATA = scene("turn");

const ScrollChart = lazy(() =>
  import("@/motion/scroll/ScrollChart").then((mod) => ({ default: mod.ScrollChart })),
);

export function SceneTurn({ progress }: SceneContentProps) {
  const { lang } = useLang();
  return (
    <div className="pres-scene">
      <SceneStep progress={progress} step={0}>
        <h2 className="pres-headline">{pick(lang, DATA.headline)}</h2>
      </SceneStep>
      <SceneStep progress={progress} step={1}>
        <p className="pres-sub">{pick(lang, DATA.sub)}</p>
      </SceneStep>
      <SceneStep progress={progress} step={2}>
        <div className="pres-illo">
          <Suspense fallback={<div className="pres-illo-skeleton" aria-hidden />}>
            <ScrollChart />
          </Suspense>
        </div>
      </SceneStep>
    </div>
  );
}

export default SceneTurn;
