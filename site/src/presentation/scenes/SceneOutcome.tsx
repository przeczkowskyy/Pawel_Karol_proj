import { CalendarCheck, Clock, ShieldAlert, Umbrella, type LucideIcon } from "lucide-react";
import { pick, useLang } from "@/i18n";
import { scene } from "@/data/presentation";
import { SceneStep } from "./SceneStep";
import type { SceneContentProps } from "./types";

/* Scena 7: EFEKT.
   Jedyna scena, w której zdań jest więcej niż jedno, bo efekt to lista, nie teza.
   Cztery linie, po jednej na wymiar: czas, termin, ryzyko, spokój. Żadna nie ma
   liczby, bo żadnej z nich nie zmierzyliśmy u klienta.

   ZERO WŁASNEGO COPY. Nagłówek i cztery linie przychodzą z `data/home.ts` przez
   `data/presentation.ts`. Gdyby ktoś przepisał je tutaj „dla czytelności",
   powstałaby druga wersja tych samych zdań i po pierwszej korekcie rozjechałyby
   się z resztą serwisu.

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
  );
}

export default SceneOutcome;
