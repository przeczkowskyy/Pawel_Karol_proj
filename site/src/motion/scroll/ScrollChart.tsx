import { useMemo, useRef } from "react";
import * as m from "motion/react-m";
import { useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { pick, useLang, type Lang } from "@/i18n";
import { aggregate, fmtPct, parseCsv, type StageAgg } from "@/lib/report";
import { DEMO_SAMPLE } from "@/data/demo-sample";
import { DUR, STAGGER } from "../tokens";
import { useScrollWillChange, WILL_CHANGE_INHERITED } from "./useScrollWillChange";

/* ── ScrollChart ────────────────────────────────────────────────────────────
   CO ROBI: słupkowy wykres wykorzystania budżetu, który ROŚNIE WRAZ Z RUCHEM
   KÓŁKA. Nie jest to „animacja po wejściu w ekran": nie ma czasu trwania,
   jest wyłącznie odwzorowanie postępu przewijania na wysokość słupka. Scroll
   w górę odtwarza ruch wstecz, zatrzymanie w połowie zatrzymuje wykres
   w połowie. To jedyna forma, przy której widz czuje, że to ON rysuje wykres.

   CZYM JEST STEROWANY: `useScroll({ target, offset: ["start 80%", "center 55%"] })`.
   Wykres zaczyna rosnąć, gdy górna krawędź sekcji minie 80 % wysokości okna,
   a kończy, gdy jej środek dojdzie do 55 % wysokości okna. Każdy słupek ma
   własne okno postępu przesunięte o krok fazy, więc rosną falą od lewej.
   Krok fazy NIE jest zmyśloną liczbą: to STAGGER (50 ms) w skali DUR.reveal
   (420 ms), czyli dokładnie ten sam rytm, co kaskada wejść w `Reveal`.

   REDUCED MOTION: `useReducedMotion()` przełącza `scaleY` i przezroczystość
   etykiet z wartości ruchu na LICZBY KOŃCOWE. Widz dostaje gotowy wykres
   z kompletem podpisów, a nie pustą oś ani zamrożony stan początkowy.
   Uwaga: `MotionConfig reducedMotion="user"` z providera NIE załatwia tego
   przypadku, bo dotyczy animacji (`animate`, warianty), a nie wartości ruchu
   wpiętych bezpośrednio w `style`. Gałąź musi być jawna.

   PUŁAPKA, KTÓREJ UNIKA: wysokość słupka idzie przez `scaleY` z
   `transform-origin: bottom`, nigdy przez `height`. `height` przeliczane
   w każdej klatce to layout i paint całego wiersza słupków (jank na
   telefonie); `scaleY` to sam kompozytor. Druga pułapka: etykieta wartości
   NIE siedzi w skalowanym elemencie (zostałaby rozciągnięta razem z nim),
   tylko jest jego rodzeństwem zaczepionym na STAŁEJ, znanej z danych
   wysokości docelowej; animuje się na niej wyłącznie `opacity`.
   Trzecia: hooki nie mogą stać w pętli, więc każdy słupek jest osobnym
   komponentem i sam subskrybuje wspólną wartość postępu. */

/* krok fazy między słupkami w przestrzeni postępu (0–1), wyprowadzony z tokenów ruchu */
const PHASE_STEP = STAGGER / DUR.reveal;
/* łączne przesunięcie fali nie zjada więcej niż 60 % okna, żeby ostatni słupek zdążył dorosnąć */
const MAX_TOTAL_PHASE = 0.6;
/* etykieta zapala się, gdy słupek ma około 80 % swojej wartości */
const LABEL_IN = 0.8;
const LABEL_FULL = 0.95;

type BarProps = {
  stage: StageAgg;
  index: number;
  step: number;
  span: number;
  scaleMax: number;
  lang: Lang;
  progress: MotionValue<number>;
  reduce: boolean;
};

function Bar({ stage, index, step, span, scaleMax, lang, progress, reduce }: BarProps) {
  /* ułamek wysokości toru, jaki zajmuje gotowy słupek; to samo liczy pozycja etykiety */
  const ratio = Math.min(1, stage.costPct / scaleMax);
  const start = index * step;
  const end = start + span;
  const scaleY = useTransform(progress, [start, end], [0, ratio]);
  const labelOpacity = useTransform(
    progress,
    [start + span * LABEL_IN, start + span * LABEL_FULL],
    [0, 1]
  );

  return (
    <div style={{ position: "relative", flex: "1 1 0%", minWidth: 0, height: "100%" }}>
      <m.div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "100%",
          transformOrigin: "bottom",
          scaleY: reduce ? ratio : scaleY,
          background: "var(--chart-3)",
          /* podpowiedź dla kompozytora dziedziczona z toru; żyje tylko w trakcie
             rysowania wykresu (patrz useScrollWillChange), nie przez całą stronę */
          willChange: reduce ? "auto" : WILL_CHANGE_INHERITED,
        }}
      />
      <m.span
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: `calc(${(ratio * 100).toFixed(2)}% + 6px)`,
          textAlign: "center",
          fontSize: "var(--text-2xs)",
          lineHeight: 1.2,
          color: "var(--accent-text)",
          fontVariantNumeric: "tabular-nums",
          opacity: reduce ? 1 : labelOpacity,
        }}
      >
        {fmtPct(stage.costPct, lang, 0)}
      </m.span>
    </div>
  );
}

type ScrollChartProps = { className?: string };

/** Wykres słupkowy rysowany postępem przewijania. Dane: silnik raportu na zestawie DEMO. */
export function ScrollChart({ className }: ScrollChartProps) {
  const { lang } = useLang();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "center 55%"] });
  /* ref idzie na TOR słupków: stamtąd podpowiedź kompozytora dziedziczy się do słupków */
  const trackRef = useScrollWillChange<HTMLDivElement>(scrollYProgress, !reduce);

  /* Dane liczy silnik raportu na zestawie DEMO: zero liczb wpisanych w ten plik,
     zero losowości, zero dat systemowych. Ten sam CSV zawsze da ten sam wykres. */
  const stages = useMemo(() => aggregate(parseCsv(DEMO_SAMPLE[lang]).rows).stages, [lang]);

  /* Skala osi zaokrąglona w górę do pełnych 10 p.p., minimum 100: etap, który przekroczył
     budżet, ma zostać widoczny jako przekroczenie, a nie zostać przycięty do sufitu. */
  const scaleMax = useMemo(
    () => Math.max(10, Math.ceil(Math.max(100, ...stages.map((s) => s.costPct)) / 10) * 10),
    [stages]
  );

  const count = stages.length;
  const step = count > 1 ? Math.min(PHASE_STEP, MAX_TOTAL_PHASE / (count - 1)) : 0;
  const span = 1 - step * Math.max(0, count - 1);

  const caption = pick(lang, {
    pl: "Dane demonstracyjne: wykorzystanie budżetu na pięciu etapach fikcyjnego portfela siedmiu projektów. Pozioma linia to 100 procent budżetu.",
    en: "Demo data: budget utilisation across five stages of a fictional seven-project portfolio. The horizontal line marks 100 percent of budget.",
  });

  const series = stages.map((s) => `${s.name}: ${fmtPct(s.costPct, lang, 0)}`).join(", ");
  const aria = pick(lang, {
    pl: `Wykres słupkowy, wykorzystanie budżetu na etapach fikcyjnego portfela projektów. ${series}.`,
    en: `Bar chart, budget utilisation by stage of a fictional project portfolio. ${series}.`,
  });

  return (
    <figure className={className} style={{ margin: 0 }}>
      <div ref={ref} role="img" aria-label={aria}>
        {/* tor słupków; wysokość w clamp(), bo wykres ma być czytelny i na telefonie, i na 4K */}
        <div
          ref={trackRef}
          style={{
            position: "relative",
            display: "flex",
            alignItems: "flex-end",
            gap: "clamp(6px, 1.6vw, 18px)",
            height: "clamp(160px, 26vw, 240px)",
            borderBottom: "1px solid var(--chart-axis)",
          }}
        >
          {/* linia odniesienia: 100 % budżetu. Statyczna, bo oś nie jest treścią animowaną */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: `${((100 / scaleMax) * 100).toFixed(2)}%`,
              borderTop: "1px dashed var(--chart-ref)",
              pointerEvents: "none",
            }}
          />
          {stages.map((stage, i) => (
            <Bar
              key={stage.name}
              stage={stage}
              index={i}
              step={step}
              span={span}
              scaleMax={scaleMax}
              lang={lang}
              progress={scrollYProgress}
              reduce={Boolean(reduce)}
            />
          ))}
        </div>

        {/* podpisy osi poziomej; --text-2xs (10 px) jest dopuszczone wyłącznie dla osi wykresu */}
        <div aria-hidden="true" style={{ display: "flex", gap: "clamp(6px, 1.6vw, 18px)", marginTop: 8 }}>
          {stages.map((stage) => (
            <span
              key={stage.name}
              style={{
                flex: "1 1 0%",
                minWidth: 0,
                textAlign: "center",
                fontSize: "var(--text-2xs)",
                lineHeight: 1.25,
                color: "var(--chart-label)",
                overflowWrap: "anywhere",
              }}
            >
              {stage.name}
            </span>
          ))}
        </div>
      </div>

      <figcaption
        style={{
          marginTop: 12,
          fontSize: "var(--text-xs)",
          lineHeight: 1.5,
          color: "var(--foreground-muted)",
        }}
      >
        {caption}
      </figcaption>
    </figure>
  );
}
