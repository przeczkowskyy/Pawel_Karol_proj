import { CalendarCheck, Clock, ShieldAlert, Umbrella, type LucideIcon } from "lucide-react";
import { pick, useLang } from "@/i18n";
import { scene } from "@/data/presentation";
import { SceneProse } from "./SceneProse";
import { SceneStep } from "./SceneStep";
import type { SceneContentProps } from "./types";

/* Scena 7: EFEKT.
   Cztery linie, po jednej na wymiar: czas, termin, ryzyko, spokój. Żadna nie ma
   liczby, bo żadnej z nich nie zmierzyliśmy u klienta.

   ZERO WŁASNEGO COPY W NAGŁÓWKU I W LINIACH. Przychodzą z `data/home.ts` przez
   `data/presentation.ts`. Gdyby ktoś przepisał je tutaj „dla czytelności",
   powstałaby druga wersja tych samych zdań i po pierwszej korekcie rozjechałyby
   się z resztą serwisu.

   Akapit (`body`) jest już własny i celowo mówi o czymś innym niż cztery linie:
   one nazywają wymiary efektu, on nazywa MIARĘ — że efektem nie jest szybsza
   praca, tylko praca, która przestaje istnieć. Bez tego zdania scena brzmi jak
   lista obietnic.

   Ikony mapuje ten plik, a nie dane: moduł treści nie ma zależeć od biblioteki
   ikon. Nieznana nazwa ikony degraduje się do zegara zamiast wysadzać scenę. */
const DATA = scene("outcome");

const ICONS: Record<string, LucideIcon> = {
  Clock,
  CalendarCheck,
  ShieldAlert,
  Umbrella,
};

export function SceneOutcome({ progress }: SceneContentProps) {
  const { lang } = useLang();
  return (
    <div className="pres-scene">
      <div className="pres-lede">
        <SceneStep progress={progress} step={0}>
          <h2 className="pres-headline">{pick(lang, DATA.headline)}</h2>
        </SceneStep>
        <SceneStep progress={progress} step={1}>
          <ul className="pres-beats">
            {DATA.beats.map((b) => {
              const Icon = ICONS[b.icon] ?? Clock;
              return (
                <li key={b.icon} className="pres-beat">
                  <Icon size={22} strokeWidth={1.5} aria-hidden />
                  <span>{pick(lang, b)}</span>
                </li>
              );
            })}
          </ul>
        </SceneStep>
      </div>
      <SceneProse progress={progress} body={DATA.body} from={2} />
    </div>
  );
}

export default SceneOutcome;
