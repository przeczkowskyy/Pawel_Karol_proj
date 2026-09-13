import { useRef } from "react";
import * as m from "motion/react-m";
import { useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { pick, useLang } from "@/i18n";
import { useScrollWillChange, WILL_CHANGE_INHERITED } from "./useScrollWillChange";

/* ── ChaosToOrder ───────────────────────────────────────────────────────────
   CO ROBI: metafora produktu wzięta dosłownie. Sto dwadzieścia prostokątów
   startuje rozsypanych, pochylonych i o różnej jasności, a wraz z przewijaniem
   zjeżdża w równe wiersze i kolumny, prostuje się i wyrównuje jasność.
   Ostatnie 20 % postępu zapala nagłówki kolumn, więc rozsypka kończy jako
   czytelna tabela. Dokładnie to robimy z arkuszami klienta, tylko na ekranie.

   CZYM JEST STEROWANY: `useScroll({ target, offset: ["start 85%", "end 45%"] })`.
   Każdy kafel ma własną FAZĘ wyprowadzoną z funkcji haszującej po indeksie,
   więc porządek wykluwa się nierówno, jak sprzątanie, a nie jak jedna klatka
   kluczowa. Zero `Math.random`: dwa przebiegi dają identyczny obraz, a scroll
   w górę odtwarza rozsypkę w tych samych miejscach.

   REDUCED MOTION: `useReducedMotion()` renderuje od razu UPORZĄDKOWANĄ siatkę
   z widocznymi nagłówkami, bez jednej wartości ruchu. Nie zostaje ani chaos,
   ani pustka, tylko stan końcowy, czyli ta sama informacja bez ruchu.

   PUŁAPKA, KTÓREJ UNIKA (wydajność): 120 elementów z `will-change: transform`
   na stałe to 120 warstw kompozytora trzymanych w pamięci przez cały czas
   życia strony, czyli dokładnie ta optymalizacja, która zabija telefon.
   Dlatego podpowiedź kompozytora jest ZMIENNĄ DZIEDZICZONĄ: rodzic przestawia
   jedną własność custom imperatywnie, tylko przy wejściu i wyjściu z zakresu
   animacji (`useScrollWillChange`), a kafle czytają ją przez `var()`. Jedno
   zapisanie stylu zamiast 120, zero renderów Reacta i zero warstw po zakończeniu.
   Druga pułapka: pozycja docelowa NIE jest liczona w JS, tylko przez `grid`.
   Ruch to wyłącznie `translate`/`rotate`/`scale` względem miejsca docelowego,
   więc nic nie przelicza layoutu w klatce, a siatka zostaje responsywna.
   Trzecia: `translate` bez `3d`, bo `translate3d` na 120 elementach wymusiłby
   te same warstwy, których unika przełączanie `will-change`. */

/* model tabeli: sześć kolumn o proporcjach jak w prawdziwym zestawieniu projektowym */
const COLUMNS = ["1.5fr", "1.2fr", "1fr", "1fr", "0.9fr", "0.8fr"];
const DEFAULT_COUNT = 120;

/* geometria rozsypki: x w procentach własnej szerokości (skaluje się z kolumną),
   y w pikselach (kafel ma 10 px, procent własnej wysokości byłby nieczytelnie mały) */
const SPREAD_X = 300;
const SPREAD_Y = 260;
const SPREAD_ROT = 34;
const SCALE_MIN = 0.62;
const SCALE_RANGE = 0.6;

/* okno porządkowania pojedynczego kafla w przestrzeni postępu (0–1) */
const PHASE_MAX = 0.5;
const SETTLE_SPAN = 0.45;
/* nagłówki kolumn: ostatnie 20 % postępu */
const HEADER_IN = 0.8;

const CELL_OPACITY_MIN = 0.12;
const CELL_OPACITY_RANGE = 0.55;
const CELL_OPACITY_FINAL = 0.5;

/* Szerokość kafla jest STATYCZNA (ustawiona raz, nigdy animowana): dzięki niej
   uporządkowany stan czyta się jak wiersze tabeli z różną treścią, a nie jak
   kod kreskowy. Gdyby szerokość się animowała, byłby to layout w każdej klatce. */
const CELL_WIDTH_MIN = 42;
const CELL_WIDTH_RANGE = 58;

/* Deterministyczny zamiennik losowości (CLAUDE.md #6: zero `Math.random`).
   Klasyczny hash z GLSL: część ułamkowa z sin(x) * duża stała. Wartość jest
   stabilna dla tego samego indeksu, więc obraz rozsypki jest powtarzalny. */
function hash(n: number): number {
  const s = Math.sin(n * 12.9898) * 43758.5453;
  return s - Math.floor(s);
}

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
/* smoothstep: kafel rusza i ląduje miękko, bez liniowego „wjechania na twardo" */
const smooth = (t: number) => t * t * (3 - 2 * t);

type Chaos = {
  dx: number;
  dy: number;
  rot: number;
  scale: number;
  phase: number;
  opacity: number;
  width: number;
};

function chaosOf(i: number): Chaos {
  const h1 = hash(i + 1);
  const h2 = hash(i + 101.7);
  const h3 = hash(i + 233.3);
  const h4 = hash(i + 419.1);
  const h5 = hash(i + 613.9);
  const h6 = hash(i + 811.3);
  return {
    dx: (h1 - 0.5) * SPREAD_X,
    dy: (h2 - 0.5) * SPREAD_Y,
    rot: (h3 - 0.5) * SPREAD_ROT,
    scale: SCALE_MIN + h4 * SCALE_RANGE,
    phase: h5 * PHASE_MAX,
    opacity: CELL_OPACITY_MIN + h1 * CELL_OPACITY_RANGE,
    width: CELL_WIDTH_MIN + h6 * CELL_WIDTH_RANGE,
  };
}

type CellProps = { index: number; progress: MotionValue<number>; reduce: boolean };

function Cell({ index, progress, reduce }: CellProps) {
  const c = chaosOf(index);

  /* JEDNA wartość ruchu na kafel buduje cały łańcuch transformacji: trzy osobne
     wartości oznaczałyby trzy zapisy stylu na klatkę zamiast jednego. */
  const transform = useTransform(progress, (p) => {
    const k = 1 - smooth(clamp01((p - c.phase) / SETTLE_SPAN));
    const s = 1 + (c.scale - 1) * k;
    return `translate(${(c.dx * k).toFixed(2)}%, ${(c.dy * k).toFixed(2)}px) rotate(${(
      c.rot * k
    ).toFixed(2)}deg) scale(${s.toFixed(3)})`;
  });

  /* wyrównanie jasności: rozsypka jest nierówna, tabela ma jeden ton */
  const opacity = useTransform(
    progress,
    [c.phase, c.phase + SETTLE_SPAN],
    [c.opacity, CELL_OPACITY_FINAL]
  );

  return (
    <m.div
      style={{
        height: 8,
        width: `${c.width.toFixed(1)}%`,
        background: "var(--chart-3)",
        transform: reduce ? "none" : transform,
        opacity: reduce ? CELL_OPACITY_FINAL : opacity,
        willChange: reduce ? "auto" : WILL_CHANGE_INHERITED,
      }}
    />
  );
}

type ChaosToOrderProps = {
  className?: string;
  /** liczba kafli; domyślnie 120 (sześć kolumn po dwadzieścia wierszy) */
  count?: number;
};

/** Rozsypane prostokąty porządkujące się w tabelę wraz z postępem przewijania. */
export function ChaosToOrder({ className, count = DEFAULT_COUNT }: ChaosToOrderProps) {
  const { lang } = useLang();
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start 85%", "end 45%"] });
  /* ref idzie na SIATKĘ: stamtąd podpowiedź kompozytora dziedziczy się do 120 kafli */
  const gridRef = useScrollWillChange<HTMLDivElement>(scrollYProgress, !reduce);

  const headerOpacity = useTransform(scrollYProgress, [HEADER_IN, 1], [0, 1]);

  const headers = pick(lang, {
    pl: ["Projekt", "Etap", "Budżet", "Koszt", "Postęp", "Status"],
    en: ["Project", "Stage", "Budget", "Cost", "Progress", "Status"],
  });

  const caption = pick(lang, {
    pl: "Ilustracja, nie dane. Rozsypane wiersze zjeżdżają w jedną tabelę z nagłówkami. To jest dokładnie ta robota, którą wykonujemy na arkuszach.",
    en: "An illustration, not data. Scattered rows settle into one table with headers. That is exactly the work we do on spreadsheets.",
  });

  const aria = pick(lang, {
    pl: `Ilustracja: ${count} rozsypanych prostokątów układa się w tabelę o sześciu kolumnach z nagłówkami ${headers.join(", ")}.`,
    en: `Illustration: ${count} scattered rectangles settle into a six-column table with the headers ${headers.join(", ")}.`,
  });

  const template = COLUMNS.join(" ");

  return (
    <figure className={className} style={{ margin: 0 }}>
      <div ref={sectionRef} role="img" aria-label={aria}>
        <m.div
          style={{
            display: "grid",
            gridTemplateColumns: template,
            gap: "0 clamp(6px, 1.4vw, 14px)",
            paddingBottom: 8,
            marginBottom: 10,
            borderBottom: "1px solid var(--border)",
            opacity: reduce ? 1 : headerOpacity,
          }}
        >
          {headers.map((h) => (
            <span
              key={h}
              style={{
                fontSize: "var(--text-2xs)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--chart-label)",
                overflowWrap: "anywhere",
              }}
            >
              {h}
            </span>
          ))}
        </m.div>

        {/* `overflow: hidden` kadruje rozsypkę: kafle przylatują spoza ramki,
            zamiast wchodzić w sąsiednie sekcje strony */}
        <div
          ref={gridRef}
          style={{
            display: "grid",
            gridTemplateColumns: template,
            gap: "7px clamp(6px, 1.4vw, 14px)",
            overflow: "hidden",
          }}
        >
          {Array.from({ length: count }, (_, i) => (
            <Cell key={i} index={i} progress={scrollYProgress} reduce={Boolean(reduce)} />
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
