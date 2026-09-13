import { pick, useLang } from "@/i18n";
import type { SceneFigure } from "@/data/presentation";
import { ScrollCounter } from "@/motion/scroll/ScrollCounter";
import { figureFormatter } from "./format";

/* ── SceneFigure ────────────────────────────────────────────────────────────
   Liczba sceny: wartość, opcjonalne DZIAŁANIE pod nią i podpis, co ta liczba
   mierzy. Trzy sceny jej używają (skala, koszt, dowód), więc rysunek stoi raz.

   Liczbę liczy `ScrollCounter`: rośnie postępem przewijania, nie zegarem, więc
   widz czuje, że to on ją wylicza. Licznik renderuje w JSX od razu wartość
   KOŃCOWĄ, czyli bez JavaScriptu i w prerenderze w DOM zostaje liczba niosąca
   sens, a nie zero.

   IMPORT PROSTO Z MODUŁU, nie z `@/motion/scroll`: barrel ciągnie za sobą
   `ScrollChart` (a z nim silnik raportu i zestaw DEMO) oraz `ChaosToOrder`,
   czyli kilkadziesiąt kilobajtów do chunku, który potrzebuje jednego licznika.
   Te dwa komponenty wchodzą do scen osobno, przez `React.lazy`.

   DZIAŁANIE obok wyniku jest wymogiem, nie ozdobą: „121 000" bez „8 350 × 12 ×
   1,2048" byłoby liczbą do uwierzenia, a nie do sprawdzenia. */

type SceneFigureProps = {
  figure: SceneFigure;
  /** nadpisanie wartości, gdy liczba pochodzi z danych, a nie z treści sceny
   *  (scena dowodu liczy pozycje w `tools.ts`) */
  to?: number;
};

export function SceneFigureBlock({ figure, to }: SceneFigureProps) {
  const { lang } = useLang();
  const value = to ?? figure.to ?? 0;
  const format = figureFormatter(figure.unit, lang, { approx: figure.approx });
  const caption = pick(lang, figure.caption);

  return (
    <div className="pres-figure">
      <ScrollCounter
        className="pres-figure-value"
        to={value}
        format={format}
        label={`${format(value)} ${caption}`}
      />
      {figure.math ? <span className="pres-figure-math">{pick(lang, figure.math)}</span> : null}
      <span className="pres-figure-caption">{caption}</span>
    </div>
  );
}
