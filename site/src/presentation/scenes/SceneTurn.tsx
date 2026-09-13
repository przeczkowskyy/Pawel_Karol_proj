import { pick, useLang } from "@/i18n";
import { scene } from "@/data/presentation";
import { SceneProse } from "./SceneProse";
import { SceneStep } from "./SceneStep";
import type { SceneContentProps } from "./types";

/* Scena 5: ZWROT.
   „Zamiast opisać proces, budujemy go na nowo."

   PIERWSZE ZDANIE O NAS W CAŁEJ PREZENTACJI pada dopiero tutaj, po czterech
   scenach o kliencie. To nie jest skromność, tylko kolejność: kto zaczyna od
   siebie, ten nie zostaje przeczytany.

   ZMIANA WOBEC WERSJI 1: było „Zamiast poprawiać plik, budujemy narzędzie",
   czyli znowu o pliku. Teraz zdanie odcina nas od konsultanta, który oddaje
   MAPĘ procesu i zostawia ten sam proces. To jest realny konkurent w tym
   segmencie i to od niego trzeba się odróżnić, nie od Excela.

   Podlinia niesie mechanikę pilotu: zakres, kopia danych i termin. To jedyne
   trzy rzeczy, o które klient pyta na tym etapie, a „do 10 dni" ma wiersz
   w rejestrze liczb dozwolonych.

   BEZ ILUSTRACJI. Scena ma cztery kroki kaskady (nagłówek, podlinia, akapit,
   punkty) i to jest limit `SceneStep`. Piąty element wchodziłby już w chwili,
   gdy scena ustępuje następnej — a pod spodem i tak gra materiał tła, który
   w tej scenie niesie cały obraz zwrotu. */
const DATA = scene("turn");

export function SceneTurn({ progress }: SceneContentProps) {
  const { lang } = useLang();
  return (
    <div className="pres-scene">
      <div className="pres-lede">
        <SceneStep progress={progress} step={0}>
          <h2 className="pres-headline">{pick(lang, DATA.headline)}</h2>
        </SceneStep>
        <SceneStep progress={progress} step={1}>
          <p className="pres-sub">{pick(lang, DATA.sub)}</p>
        </SceneStep>
      </div>
      <SceneProse progress={progress} body={DATA.body} points={DATA.points} from={2} />
    </div>
  );
}

export default SceneTurn;
