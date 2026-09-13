import * as m from "motion/react-m";
import { useReducedMotion, useTransform } from "motion/react";
import { pick, useLang } from "@/i18n";
import { scene } from "@/data/presentation";
import { getTools } from "@/data/tools";
import KsefFlow from "@/components/KsefFlow";
import { SceneFigureBlock } from "./SceneFigure";
import { SceneStep } from "./SceneStep";
import type { SceneContentProps } from "./types";

/* Scena 6: DOWÓD.
   Ściana ekranów prawdziwych narzędzi. Bez nazw pod kafelkami, bez opisów, bez
   linków: prezentacja nie ma zakładek, a trzynaście podpisów zamieniłoby scenę
   w katalog. Nazwa narzędzia żyje w `alt`, więc czytnik ekranu dostaje komplet,
   a widz dostaje obraz.

   LICZBA POCHODZI Z DANYCH, nie z literału: `tools.length`. Gdy dojdzie
   czternaste narzędzie, scena policzy je sama, a rejestr liczb tego nie blokuje
   („13" rośnie automatycznie z `tools.ts`). Dlatego scena nie ma pola `source`:
   kafelki stoją na ekranie i widz może je policzyć.

   KSEF NIE MA ZRZUTU, bo to wdrożenie bez pulpitu. Zamiast pustej ramki stoi tam
   diagram przepływu danych w rozmiarze `mini`: mówi więcej niż zrzut listy faktur
   i nie udaje ekranu, którego nie ma. Kadr diagramu ma tę samą proporcję co WebP
   (8:5), więc siatka nie drga. */
const DATA = scene("proof");

/** Jedyna pozycja bez pulpitu: wdrożenie, nie demo. */
const KSEF_SLUG = "kontroling-ksef";

export function SceneProof({ progress }: SceneContentProps) {
  const { lang } = useLang();
  const tools = getTools(lang);
  const reduce = useReducedMotion();

  /* Przesunięcie rzeki: od zera do minus dwóch trzecich jej szerokości. Wartość
     w procentach WŁASNEJ szerokości, nie w pikselach, więc działa tak samo na
     telefonie i na 4K bez mierzenia czegokolwiek. Przy ograniczonym ruchu rząd
     stoi, a użytkownik przewija go sam. */
  const riverX = useTransform(progress, [0.2, 0.9], reduce ? ["0%", "0%"] : ["2%", "-62%"]);

  const wallLabel = pick(lang, {
    pl: `Ściana ${tools.length} narzędzi: zrzuty ekranów działających na danych przykładowych`,
    en: `A wall of ${tools.length} tools: screenshots of them running on sample data`,
  });

  return (
    <div className="pres-scene pres-scene--wide">
      <SceneStep progress={progress} step={0}>
        <h2 className="pres-headline">{pick(lang, DATA.headline)}</h2>
      </SceneStep>
      <SceneStep progress={progress} step={1}>
        <SceneFigureBlock figure={DATA.figure} to={tools.length} />
      </SceneStep>
      {/* RZEKA EKRANÓW, nie siatka (korekta 2026-09-13 po obejrzeniu nagrania).
          Trzynaście kafli ułożonych w siatkę nie mieści się w jednym ekranie:
          nagłówek uciekał pod nawigację, a dolny rząd poniżej zgięcia. W prezentacji
          scena musi zmieścić się w kadrze, więc ekrany idą JEDNYM rzędem i płyną
          w lewo wraz z postępem przewijania. To jest też jedyny układ, w którym
          widać, że narzędzi jest dużo: oko liczy ruch, nie rzędy.
          Przy ograniczonym ruchu rząd stoi i przewija się palcem albo kółkiem
          (`overflow-x: auto` w arkuszu), więc treść jest dostępna tak samo. */}
      <SceneStep progress={progress} step={2}>
        <m.ul className="pres-wall" aria-label={wallLabel} style={{ x: riverX }}>
          {tools.map((t) => (
            <li key={t.slug} className="pres-wall-cell">
              {t.slug === KSEF_SLUG ? (
                <span className="pres-wall-shot pres-wall-shot--diagram">
                  <KsefFlow size="mini" />
                </span>
              ) : (
                <img
                  className="pres-wall-shot"
                  src={`/thumbs/${t.slug}-v1-640.webp`}
                  alt={t.name}
                  width={640}
                  height={400}
                  loading="lazy"
                  decoding="async"
                />
              )}
            </li>
          ))}
        </m.ul>
      </SceneStep>
    </div>
  );
}

export default SceneProof;
