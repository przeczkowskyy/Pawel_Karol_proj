import { pick, useLang } from "@/i18n";
import { scene } from "@/data/presentation";
import { SceneProse } from "./SceneProse";
import { SceneHeadline } from "./SceneHeadline";
import { SceneStep } from "./SceneStep";
import type { SceneContentProps } from "./types";

/* Scena 1: HAK.
   „Firma urosła. Proces został ten sam."

   ZDANIE NIE OSKARŻA. To jest cała robota tej sceny. Poprzednia wersja zaczynała
   od tego, że klient pracuje na plikach pełnych błędów — czyli pierwszym, co
   widział odwiedzający, był zarzut wobec jego firmy. Founder podsumował efekt
   jednym zdaniem: „Wejście na stronę zachęca mnie do wyjścia z niej".
   Teraz pierwsze zdanie mówi o wzroście, czyli o sukcesie, a problemem jest
   proces, który za tym wzrostem nie nadążył. Nikt nie musi się tu tłumaczyć.

   NAGŁÓWEK STRONY. To jedyna scena, która renderuje `h1`. Jeżeli silnik albo
   shell prerendera dokłada własny `h1`, ZDEJMIJ jeden z nich: dwa `h1` na stronie
   to sygnał dla wyszukiwarki, że strona nie wie, o czym jest. */
const DATA = scene("hook");

export function SceneHook({ progress }: SceneContentProps) {
  const { lang } = useLang();
  return (
    <div className="pres-scene">
      <div className="pres-lede">
        <SceneStep progress={progress} step={0}>
          <SceneHeadline as="h1" text={pick(lang, DATA.headline)} />
        </SceneStep>
      </div>
      <SceneProse progress={progress} body={DATA.body} points={DATA.points} />
    </div>
  );
}

export default SceneHook;
