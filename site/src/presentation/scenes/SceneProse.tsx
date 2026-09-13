import { pick, useLang } from "@/i18n";
import type { Bilingual } from "@/data/presentation";
import { SceneStep } from "./SceneStep";
import type { SceneContentProps } from "./types";

/* ── SceneProse ─────────────────────────────────────────────────────────────
   Prawa kolumna sceny: akapit i trzy rzeczy sprawdzalne.

   DLACZEGO TO W OGÓLE ISTNIEJE. Wersja 1 prezentacji miała 65 słów na osiem
   ekranów i founder wskazał `automatyzacje.ai` jako wzór treści („treściwie
   i wysoko w SEO"). Tamta strona ma ok. 1 900 słów i to jest cały mechanizm jej
   pozycji: gęstość, nie technika. Nasz prerender jest lepszy od ich SPA, tylko
   nie miał czego renderować.

   Ten komponent jest jedynym miejscem, w którym ta warstwa powstaje, więc
   wszystkie osiem scen wygląda tak samo i nikt nie wymyśla ósmego wariantu
   akapitu. Treść przychodzi z `data/presentation.ts`; tutaj nie ma ani jednego
   zdania copy.

   KROKI KASKADY. Akapit i punkty to DWA osobne kroki `SceneStep`, bo wchodzą
   po nagłówku, a nie razem z nim. Numer pierwszego kroku podaje scena
   (`from`), bo sceny mają różną liczbę elementów przed prozą: `hook` ma sam
   nagłówek, `cost` ma jeszcze liczbę nad nim. Limit `SceneStep` to cztery
   kroki (0–3) i tego limitu nie wolno przekroczyć — piąty element wchodziłby
   już w chwili, gdy scena ustępuje następnej. */

type SceneProseProps = Pick<SceneContentProps, "progress"> & {
  body?: Bilingual;
  /** rzeczy sprawdzalne; scena bez nich po prostu ich nie podaje */
  points?: readonly Bilingual[];
  /** numer kroku kaskady dla akapitu; punkty wchodzą krok później */
  from?: number;
};

export function SceneProse({ progress, body, points, from = 1 }: SceneProseProps) {
  const { lang } = useLang();
  if (!body && !points) return null;

  return (
    <div className="pres-prose">
      {body ? (
        <SceneStep progress={progress} step={from}>
          <p className="pres-body">{pick(lang, body)}</p>
        </SceneStep>
      ) : null}
      {points && points.length > 0 ? (
        <SceneStep progress={progress} step={from + 1}>
          <ul className="pres-points">
            {points.map((p) => (
              <li key={p.pl} className="pres-point">
                {pick(lang, p)}
              </li>
            ))}
          </ul>
        </SceneStep>
      ) : null}
    </div>
  );
}

export default SceneProse;
