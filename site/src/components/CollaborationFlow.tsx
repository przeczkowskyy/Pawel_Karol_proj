import { useLang, pick } from "@/i18n";

/* Schemat blokowy współpracy Klarow ↔ klient — klasyczna notacja z podstaw
   logiki: owal = start/stop, prostokąt = proces, romb = decyzja, strzałki
   z grotami, pętle powrotne (poprawki, kolejny moduł). Czysty SVG na
   tokenach kitu; na mobile scroll poziomy (reguła kitu dla szerokiej treści). */

const T = {
  pl: {
    start: ["START", "Twój „najgorszy Excel”"],
    demo: ["Demo na próbce", "30 min · MY"],
    d1: ["Wchodzisz", "w pilota?"],
    day0: ["Dzień 0 · diagnoza", "zamrożony zakres · WSPÓLNIE"],
    build: ["Dni 1–4 · budowa", "na kopiach Twoich plików · MY"],
    end: ["Do usłyszenia", "demo zostaje u Ciebie"],
    show: ["Dzień 5 · pokaz", "diff na Twoich danych"],
    d2: ["Akceptujesz", "wynik?"],
    prod: ["PROD u Ciebie", "dwuklik · backup · log · TY"],
    care: ["Opieka / retainer", "next-business-day · MY"],
    yes: "TAK",
    no: "NIE",
    fixes: "NIE · poprawki w zakresie",
    nextModule: "kolejny moduł",
    legend: "Owal = start/stop · prostokąt = proces · romb = decyzja · linia przerywana = pętla „kolejny moduł”",
  },
  en: {
    start: ["START", "your “worst Excel”"],
    demo: ["Demo on a sample", "30 min · US"],
    d1: ["Do you start", "the pilot?"],
    day0: ["Day 0 · diagnosis", "scope frozen · TOGETHER"],
    build: ["Days 1–4 · build", "on copies of your files · US"],
    end: ["Talk soon", "the demo stays with you"],
    show: ["Day 5 · live demo", "diff on your real data"],
    d2: ["Do you accept", "the result?"],
    prod: ["PROD at your place", "double-click · backup · log · YOU"],
    care: ["Care / retainer", "next-business-day · US"],
    yes: "YES",
    no: "NO",
    fixes: "NO · in-scope fixes",
    nextModule: "next module",
    legend: "Oval = start/stop · rectangle = process · diamond = decision · dashed line = “next module” loop",
  },
};

const HEAD = { fontWeight: 800, fontSize: 12.5, fill: "var(--heading)" } as const;
const SUB = { fontWeight: 600, fontSize: 10.5, fill: "var(--muted-foreground)" } as const;
const LINE = { stroke: "var(--chart-neutral)", strokeWidth: 1.6, fill: "none" } as const;

function Shape2({
  cx,
  cy,
  lines,
}: {
  cx: number;
  cy: number;
  lines: string[];
}) {
  return (
    <>
      <text x={cx} y={cy - 3} textAnchor="middle" style={HEAD}>
        {lines[0]}
      </text>
      <text x={cx} y={cy + 13} textAnchor="middle" style={SUB}>
        {lines[1]}
      </text>
    </>
  );
}

function Rect({ x, y, w, lines }: { x: number; y: number; w: number; lines: string[] }) {
  return (
    <>
      <rect
        x={x}
        y={y}
        width={w}
        height={64}
        rx={8}
        fill="var(--card)"
        stroke="var(--border)"
        strokeWidth={1.2}
      />
      <Shape2 cx={x + w / 2} cy={y + 32} lines={lines} />
    </>
  );
}

function Stadium({ x, y, w, lines }: { x: number; y: number; w: number; lines: string[] }) {
  return (
    <>
      <rect
        x={x}
        y={y}
        width={w}
        height={56}
        rx={28}
        fill="rgba(168,180,194,.14)"
        stroke="var(--primary)"
        strokeWidth={1.4}
      />
      <Shape2 cx={x + w / 2} cy={y + 28} lines={lines} />
    </>
  );
}

function Diamond({ cx, cy, lines }: { cx: number; cy: number; lines: string[] }) {
  return (
    <>
      <polygon
        points={`${cx - 85},${cy} ${cx},${cy - 48} ${cx + 85},${cy} ${cx},${cy + 48}`}
        fill="rgba(66,82,110,.32)"
        stroke="var(--primary-600)"
        strokeWidth={1.4}
      />
      <Shape2 cx={cx} cy={cy} lines={lines} />
    </>
  );
}

export default function CollaborationFlow() {
  const { lang } = useLang();
  const t = pick(lang, T);

  return (
    <div>
      <div className="overflow-x-auto pb-2">
        <svg
          viewBox="0 0 1180 400"
          className="w-full h-auto"
          style={{ minWidth: 1000 }}
          role="img"
          aria-label={t.legend}
        >
          <defs>
            <marker
              id="fl-arr"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M0,0 L10,5 L0,10 z" fill="var(--chart-neutral)" />
            </marker>
            <marker
              id="fl-arr-accent"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M0,0 L10,5 L0,10 z" fill="var(--primary)" />
            </marker>
          </defs>

          {/* ── rząd 1: START → demo → decyzja → dzień 0 → budowa ── */}
          <Stadium x={20} y={72} w={170} lines={t.start} />
          <line x1={190} y1={100} x2={236} y2={100} style={LINE} markerEnd="url(#fl-arr)" />
          <Rect x={240} y={68} w={190} lines={t.demo} />
          <line x1={430} y1={100} x2={476} y2={100} style={LINE} markerEnd="url(#fl-arr)" />
          <Diamond cx={565} cy={100} lines={t.d1} />
          <text x={660} y={90} style={{ ...SUB, fill: "var(--funded)", fontWeight: 800 }}>
            {t.yes}
          </text>
          <line x1={650} y1={100} x2={686} y2={100} style={LINE} markerEnd="url(#fl-arr)" />
          <Rect x={690} y={68} w={190} lines={t.day0} />
          <line x1={880} y1={100} x2={926} y2={100} style={LINE} markerEnd="url(#fl-arr)" />
          <Rect x={930} y={68} w={190} lines={t.build} />

          {/* decyzja 1 → NIE → stop */}
          <text x={573} y={182} style={{ ...SUB, fill: "var(--rejected)", fontWeight: 800 }}>
            {t.no}
          </text>
          <line x1={565} y1={148} x2={565} y2={206} style={LINE} markerEnd="url(#fl-arr)" />
          <Stadium x={475} y={210} w={180} lines={t.end} />

          {/* budowa → pokaz (w dół) */}
          <line x1={1005} y1={132} x2={1005} y2={294} style={LINE} markerEnd="url(#fl-arr)" />

          {/* ── rząd 2: pokaz → decyzja → PROD → opieka (w lewo) ── */}
          <Rect x={930} y={298} w={190} lines={t.show} />
          <line x1={930} y1={330} x2={884} y2={330} style={LINE} markerEnd="url(#fl-arr)" />
          <Diamond cx={790} cy={330} lines={t.d2} />
          <text x={664} y={320} style={{ ...SUB, fill: "var(--funded)", fontWeight: 800 }}>
            {t.yes}
          </text>
          <line x1={700} y1={330} x2={656} y2={330} style={LINE} markerEnd="url(#fl-arr)" />
          <Rect x={460} y={298} w={190} lines={t.prod} />
          <line x1={460} y1={330} x2={414} y2={330} style={LINE} markerEnd="url(#fl-arr)" />
          <Rect x={220} y={298} w={190} lines={t.care} />

          {/* decyzja 2 → NIE → pętla poprawek do budowy */}
          <path d="M790,282 V240 H1075 V136" style={LINE} markerEnd="url(#fl-arr)" />
          <text x={935} y={232} style={{ ...SUB, fill: "var(--rejected)", fontWeight: 800 }}>
            {t.fixes}
          </text>

          {/* opieka → pętla „kolejny moduł” do dnia 0 (przerywana, akcent) */}
          <path
            d="M315,298 V190 H785 V136"
            style={{ stroke: "var(--primary)", strokeWidth: 1.6, fill: "none" }}
            strokeDasharray="6 5"
            markerEnd="url(#fl-arr-accent)"
            opacity={0.85}
          />
          <text x={660} y={182} style={{ ...SUB, fill: "var(--accent-foreground)", fontWeight: 800 }}>
            {t.nextModule}
          </text>
        </svg>
      </div>
      <p className="mt-2 text-[12px]" style={{ color: "var(--muted-foreground)" }}>
        {t.legend}
      </p>
    </div>
  );
}
