import { useEffect, useRef, type Ref } from "react";
import { pick, useLang, type Lang } from "@/i18n";
import { DUR, EASE_OUT, STAGGER } from "@/motion/tokens";

/* Diagram przepływu danych narzędzia kontrolingowego na KSeF (plan §4.3).
   Cztery węzły w poziomie: API KSeF (Ministerstwo Finansów) → konektor → baza u Ciebie →
   pulpity i raporty, plus PRZEKREŚLONA strzałka zwrotna: narzędzie nie wysyła faktur.
   To jedyna treść tej sekcji, więc diagram jest dowodem, nie ozdobą.

   Kontrakt (reguła motion-no-motion-in-prerender): `KsefFlowView` jest czystą funkcją
   props → JSX. Zero `window`, `document`, `IntersectionObserver` w ścieżce renderu, zero
   importu biblioteki ruchu, więc shell prerendera może go renderować bez dociągania Motion.
   Z `src/motion/*` wchodzą WYŁĄCZNIE stałe z `tokens.ts` (moduł bez efektów ubocznych):
   czasy i krzywa ruchu mają jedno źródło (reguła motion-tokens-only).

   Kolory, promienie i grubości linii: wyłącznie tokeny (`design-tokens-only`, `design-shape-lock`).
   Stopnie pisma są liczbami w JEDNOSTKACH UŻYTKOWNIKA viewBox (skalują się z diagramem),
   a nie skalą typograficzną strony: rem w `viewBox` dawałby rozmiar zależny od `clamp()`
   na `:root` i diagram zmieniałby proporcje przy zmianie szerokości okna.

   Dostępność (`a11y-images-alt-svg-role`): `role="img"` + `aria-label` z pełnym opisem
   przepływu; węzły tekstowe w SVG go NIE zastępują (czytnik pomija poddrzewo). */

export type KsefFlowSize = "mini" | "full";

type NodeCopy = { title: string[]; note: string[] };
type FlowCopy = { nodes: NodeCopy[]; cross: string; aria: string };

/* Etykiety trzymane jako TABLICE LINII: `mini` renderuje każdą linię osobno (wąski kafel),
   `full` używa tych samych linii w większym stopniu pisma. Jedno źródło, dwa rysunki. */
const FLOW: { pl: FlowCopy; en: FlowCopy } = {
  pl: {
    nodes: [
      { title: ["API KSeF"], note: ["Ministerstwo Finansów"] },
      { title: ["Konektor"], note: ["u Ciebie"] },
      { title: ["Baza"], note: ["u Ciebie"] },
      { title: ["Pulpity", "i raporty"], note: ["budżet vs wykonanie", "prognoza cashflow"] },
    ],
    cross: "nie wysyła faktur: tylko czyta i liczy",
    aria:
      "Diagram przepływu danych w czterech krokach: API KSeF Ministerstwa Finansów, konektor u Ciebie, " +
      "baza u Ciebie, pulpity i raporty. Strzałki prowadzą w jedną stronę. Strzałka powrotna do KSeF " +
      "jest przekreślona: narzędzie nie wysyła faktur, tylko czyta i liczy.",
  },
  en: {
    nodes: [
      { title: ["KSeF API"], note: ["Ministry of Finance"] },
      { title: ["Connector"], note: ["on your premises"] },
      { title: ["Database"], note: ["on your premises"] },
      { title: ["Dashboards", "and reports"], note: ["budget vs actual", "cash flow forecast"] },
    ],
    cross: "never sends invoices: it only reads and computes",
    aria:
      "A data flow diagram in four steps: the Ministry of Finance KSeF API, a connector on your premises, " +
      "a database on your premises, dashboards and reports. The arrows run one way. The return arrow to " +
      "KSeF is crossed out: the tool never sends invoices, it only reads and computes.",
  },
};

/* Geometria per wariant. `mini` jedzie do kafla ściany narzędzi (kadr 8:5, ten sam co WebP
   480×300), `full` na podstronę KSeF. W `mini` podpis pod nazwą zostaje TYLKO przy pierwszym
   węźle (skąd płyną dane); przy pozostałych nazwa wystarcza, a trzy podpisy w kafelku są
   nieczytelne. Pełną treść niesie `aria-label` i opis obok kafla. */
const GEO = {
  mini: {
    w: 640, h: 400, x0: 12, nodeW: 131, nodeH: 112, gap: 30, nodeY: 88,
    fsTitle: 15, fsNote: 12, fsCap: 13, drop: 76, head: 7, hair: 1.1, notesAll: false, minW: 0,
  },
  full: {
    w: 1120, h: 320, x0: 14, nodeW: 228, nodeH: 118, gap: 60, nodeY: 40,
    fsTitle: 20, fsNote: 13.5, fsCap: 15, drop: 74, head: 9, hair: 1.3, notesAll: true, minW: 720,
  },
} as const;

type Geo = (typeof GEO)[KsefFlowSize];

/** wysokość wiersza tekstu w jednostkach viewBox */
const LH = 1.35;

const nodeX = (g: Geo, i: number) => g.x0 + i * (g.nodeW + g.gap);

function FlowNode({ g, index, node, showNote }: { g: Geo; index: number; node: NodeCopy; showNote: boolean }) {
  const x = nodeX(g, index);
  const cx = x + g.nodeW / 2;
  const items = [
    ...node.title.map((t) => ({ t, fs: g.fsTitle, strong: true })),
    ...(showNote ? node.note.map((t) => ({ t, fs: g.fsNote, strong: false })) : []),
  ];
  const total = items.reduce((sum, it) => sum + it.fs * LH, 0);
  let cursor = g.nodeY + (g.nodeH - total) / 2;
  const placed = items.map((it) => {
    cursor += it.fs * LH;
    return { ...it, y: cursor - it.fs * 0.42 };
  });
  /* pierwszy węzeł jest po stronie państwa, pozostałe trzy stoją u klienta:
     różnica powierzchni i obrysu mówi to bez dodatkowego podpisu */
  const external = index === 0;
  return (
    <g data-ksef-node={index}>
      <rect
        x={x}
        y={g.nodeY}
        width={g.nodeW}
        height={g.nodeH}
        rx={8}
        fill={external ? "var(--surface-muted)" : "var(--surface)"}
        stroke={external ? "var(--border)" : "var(--border-strong)"}
        strokeWidth={g.hair}
      />
      {placed.map((it) => (
        <text
          key={it.t}
          x={cx}
          y={it.y}
          textAnchor="middle"
          fontSize={it.fs}
          fontWeight={it.strong ? 800 : 600}
          fill={it.strong ? "var(--foreground-strong)" : "var(--foreground-muted)"}
        >
          {it.t}
        </text>
      ))}
    </g>
  );
}

/** strzałka między węzłem `index` a `index + 1`; grot rysowany figurą, nie `marker`
 *  (dwa diagramy na jednej stronie nie mogą dzielić identyfikatora w `defs`) */
function FlowArrow({ g, index }: { g: Geo; index: number }) {
  const y = g.nodeY + g.nodeH / 2;
  const start = nodeX(g, index) + g.nodeW + 6;
  const tip = start + g.gap - 12;
  const wing = g.head * 0.62;
  return (
    <g>
      <line x1={start} y1={y} x2={tip - g.head} y2={y} stroke="var(--accent)" strokeWidth={g.hair + 0.4} />
      <path d={`M${tip} ${y}L${tip - g.head} ${y - wing}L${tip - g.head} ${y + wing}Z`} fill="var(--accent)" />
    </g>
  );
}

/** droga powrotna do KSeF: narysowana i PRZEKREŚLONA. Linia w kolorze obrysu, nie akcentu:
 *  stal jest jedynym akcentem marki i należy do przepływu, który naprawdę istnieje. */
function ReturnPath({ g, label }: { g: Geo; label: string }) {
  const bottom = g.nodeY + g.nodeH;
  const retY = bottom + g.drop;
  const c1 = nodeX(g, 0) + g.nodeW / 2;
  const c4 = nodeX(g, 3) + g.nodeW / 2;
  const mx = (c1 + c4) / 2;
  const k = g.fsCap * 0.75;
  const wing = g.head * 0.62;
  return (
    <g>
      <path
        d={`M${c4} ${bottom}V${retY}H${c1}V${bottom + g.head + 4}`}
        fill="none"
        stroke="var(--border-strong)"
        strokeWidth={g.hair + 0.2}
        strokeLinejoin="round"
      />
      <path
        d={`M${c1} ${bottom + 2}L${c1 - wing} ${bottom + 2 + g.head}L${c1 + wing} ${bottom + 2 + g.head}Z`}
        fill="var(--border-strong)"
      />
      <line
        x1={mx - k}
        y1={retY - k}
        x2={mx + k}
        y2={retY + k}
        stroke="var(--foreground-muted)"
        strokeWidth={g.hair + 1}
        strokeLinecap="round"
      />
      <line
        x1={mx - k}
        y1={retY + k}
        x2={mx + k}
        y2={retY - k}
        stroke="var(--foreground-muted)"
        strokeWidth={g.hair + 1}
        strokeLinecap="round"
      />
      <text x={mx} y={retY + g.fsCap + 14} textAnchor="middle" fontSize={g.fsCap} fontWeight={600} fill="var(--foreground-muted)">
        {label}
      </text>
    </g>
  );
}

type ViewProps = {
  /** język podawany jawnie: shell prerendera nie ma kontekstu i18n */
  lang: Lang;
  size?: KsefFlowSize;
  className?: string;
  ref?: Ref<HTMLDivElement>;
};

/** Czysty rysunek: props → JSX. Bez hooków, bez API przeglądarki, bez biblioteki ruchu. */
export function KsefFlowView({ lang, size = "full", className, ref }: ViewProps) {
  const g: Geo = GEO[size];
  const copy = pick(lang, FLOW);
  return (
    <div ref={ref} className={className ? `overflow-x-auto ${className}` : "overflow-x-auto"}>
      <svg
        viewBox={`0 0 ${g.w} ${g.h}`}
        className="w-full h-auto"
        style={g.minW ? { minWidth: g.minW } : undefined}
        role="img"
        aria-label={copy.aria}
      >
        {copy.nodes.map((node, i) => (
          <FlowNode key={node.title[0]} g={g} index={i} node={node} showNote={g.notesAll || i === 0} />
        ))}
        {[0, 1, 2].map((i) => (
          <FlowArrow key={i} g={g} index={i} />
        ))}
        <ReturnPath g={g} label={copy.cross} />
      </svg>
    </div>
  );
}

type KsefFlowProps = {
  size?: KsefFlowSize;
  /** sekwencyjne zapalenie węzłów raz po wejściu w ekran; domyślnie diagram jest statyczny */
  animated?: boolean;
  /** nadpisanie języka; domyślnie z kontekstu i18n */
  lang?: Lang;
  className?: string;
};

/* Ograniczony ruch sprawdzany bez biblioteki: `MotionConfig` i tak nie widzi Web Animations API
   (reguła motion-reduced-motion-three-layers, warstwa 2). Brak `window` albo brak `matchMedia`
   oznacza „bez ruchu": zakładamy spokój, nie odwrotnie. */
function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function KsefFlow({ size = "full", animated = false, lang, className }: KsefFlowProps) {
  const ctx = useLang();
  const ref = useRef<HTMLDivElement>(null);

  /* motion: storytelling, kierunek danych od KSeF do pulpitów (rejestr: docs/plan/motion-registry.md).
     Animowana jest WYŁĄCZNIE nieprzezroczystość węzłów (plan §4.3), raz, po wejściu w ekran.
     Stan spoczynkowy elementu to pełna widoczność, a animacja ma `fill: "backwards"`, więc nic
     nie może utknąć w stanie początkowym, gdy JS padnie w połowie (design-animation-fill-backwards). */
  useEffect(() => {
    const root = ref.current;
    if (!animated || !root || prefersReducedMotion()) return;
    if (typeof IntersectionObserver !== "function") return;
    const nodes = Array.from(root.querySelectorAll<SVGGElement>("[data-ksef-node]"));
    if (!nodes.length || typeof nodes[0].animate !== "function") return;

    let running: Animation[] = [];
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        running = nodes.map((node, i) =>
          node.animate([{ opacity: 0 }, { opacity: 1 }], {
            duration: DUR.base * 1000,
            delay: i * STAGGER * 1000,
            easing: `cubic-bezier(${EASE_OUT.join(", ")})`,
            fill: "backwards",
          }),
        );
      },
      { threshold: 0.25 },
    );
    io.observe(root);
    return () => {
      io.disconnect();
      for (const anim of running) anim.cancel();
    };
  }, [animated]);

  return <KsefFlowView ref={ref} lang={lang ?? ctx.lang} size={size} className={className} />;
}
