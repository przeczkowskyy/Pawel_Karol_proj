import { pick, useLang } from "@/i18n";
import { scene } from "@/data/presentation";
import { SceneProse } from "./SceneProse";
import { SceneStep } from "./SceneStep";
import type { SceneContentProps } from "./types";

/* Scena 6: CO POTRAFIMY. Nowa scena wersji 2, w miejsce usuniętego „dowodu".
   „Różne działy. Ten sam sposób pracy."

   CO STĄD ZNIKNĘŁO I DLACZEGO. Poprzednia wersja pokazywała tu ścianę trzynastu
   zrzutów z naszych narzędzi. Founder o tym: „Narzędzia to są po prostu screeny
   z narzędzi xDd", a potem wprost: „Nie musimy przedstawiać już narzędzi które
   zrobiłem. Możemy o tym zapomnieć".

   Miał rację także technicznie: zrzut ciemnego interfejsu na ciemnej stronie
   nigdy nie „wyskoczy" — walczyliśmy z tym obrysami i podbiciem jasności, co
   było leczeniem objawu. Ale problem był głębszy niż kontrast. Klient na tym
   etapie nie kupuje NASZEGO ekranu, tylko sprawdza, czy rozumiemy JEGO proces.
   Trzynaście cudzych interfejsów nie odpowiada na to pytanie.

   CO WESZŁO W ZAMIAN. Rodzaje pracy, nie nazwy narzędzi. Sześć pozycji celowo
   przekrojowych przez działy — kontroling, finanse, produkcja, administracja —
   bo founder prosił, żeby nie zamykać się w jednym dziale („piszmy że jesteśmy
   elastyczni w działach"). Każda pozycja jest opisem CZYNNOŚCI, w której klient
   ma rozpoznać siebie: „uzgodnienie dwóch źródeł danych co do grosza" działa,
   „Rekoncyliacja importów" nie działa.

   PODSTRONY NARZĘDZI ŻYJĄ DALEJ. Trzynaście tras `/narzedzia/:slug` zostaje
   w mapie strony i łapie ruch z wyszukiwarki — prezentacja po prostu przestała
   do nich linkować (decyzja D-39 w scenariuszu). Usunięcie sceny NIE jest
   usunięciem tamtych stron. */
const DATA = scene("craft");

export function SceneCraft({ progress }: SceneContentProps) {
  const { lang } = useLang();
  return (
    <div className="pres-scene">
      <div className="pres-lede">
        <SceneStep progress={progress} step={0}>
          <h2 className="pres-headline">{pick(lang, DATA.headline)}</h2>
        </SceneStep>
      </div>
      {/* Akapit z SceneProse, ale lista WŁASNA: sześć pozycji układa się w dwie
          kolumny, więc nie może korzystać z jednokolumnowej listy wspólnej. */}
      <div className="pres-prose">
        <SceneProse progress={progress} body={DATA.body} />
        <SceneStep progress={progress} step={2}>
          <ul className="pres-points pres-points--grid">
            {DATA.points.map((p) => (
              <li key={p.pl} className="pres-point">
                {pick(lang, p)}
              </li>
            ))}
          </ul>
        </SceneStep>
      </div>
    </div>
  );
}

export default SceneCraft;
