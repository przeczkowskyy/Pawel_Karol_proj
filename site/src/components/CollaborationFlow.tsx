import { ArrowRight, ArrowDown, ArrowLeft } from "lucide-react";

/* Schemat blokowy współpracy Klarow ↔ klient — 6 kroków „z życia”,
   z oznaczeniem, kto działa (TY / MY / WSPÓLNIE). Desktop: 2 rzędy po 3
   bloki ze strzałkami; mobile: pion. */

type Who = "TY" | "MY" | "WSPÓLNIE";

const WHO_STYLE: Record<Who, string> = {
  TY: "st st-gray",
  MY: "st st-accent",
  "WSPÓLNIE": "st st-gray st-open",
};

const STEPS: { who: Who; title: string; body: string; time: string }[] = [
  {
    who: "TY",
    title: "„Najgorszy Excel”",
    body: "Wysyłasz próbkę pliku, który boli najbardziej. W 30 minut pokazujemy na niej, co da się zrobić.",
    time: "30 min",
  },
  {
    who: "WSPÓLNIE",
    title: "Dzień 0 · diagnoza",
    body: "Wybieramy JEDEN proces, spisujemy i zamrażamy zakres. Ustalamy stałą cenę — na piśmie.",
    time: "1 spotkanie",
  },
  {
    who: "MY",
    title: "Dni 1–4 · budowa na kopiach",
    body: "Pracujemy wyłącznie na kopiach Twoich plików. Twoje oryginały i makra — nietknięte.",
    time: "4 dni",
  },
  {
    who: "WSPÓLNIE",
    title: "Dzień 5 · pokaz i odbiór",
    body: "Widzisz pełną listę zmian (diff) na prawdziwych danych. Druga rata dopiero po akceptacji.",
    time: "1 spotkanie",
  },
  {
    who: "TY",
    title: "PROD u Ciebie",
    body: "Narzędzie uruchamiasz dwuklikiem. Backup przed każdym zapisem, log każdej operacji. Kod i dokumentacja zostają u Ciebie.",
    time: "od dnia 5",
  },
  {
    who: "MY",
    title: "Opieka i kolejne moduły",
    body: "Retainer z reakcją next-business-day. Pomysły wycięte ze sprintu #1 stają się backlogiem sprintu #2.",
    time: "stale",
  },
];

function StepCard({ s, n }: { s: (typeof STEPS)[number]; n: number }) {
  return (
    <div className="card flex-1 min-w-0" style={{ padding: 16 }}>
      <div className="flex items-center justify-between gap-2">
        <span className={WHO_STYLE[s.who]}>{s.who}</span>
        <span className="text-[10.5px] font-bold tracking-wider" style={{ color: "var(--muted-foreground)" }}>
          {s.time}
        </span>
      </div>
      <h3 className="mt-3 text-[13.5px] font-extrabold" style={{ color: "var(--heading)" }}>
        {n}. {s.title}
      </h3>
      <p className="mt-1.5 text-[12px] leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
        {s.body}
      </p>
    </div>
  );
}

function Arrow({ down = false, left = false }: { down?: boolean; left?: boolean }) {
  return (
    <div
      className={`flex items-center justify-center ${down ? "py-1" : "px-1"} shrink-0`}
      style={{ color: "var(--primary)" }}
      aria-hidden="true"
    >
      {down ? <ArrowDown size={18} /> : left ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
    </div>
  );
}

export default function CollaborationFlow() {
  return (
    <div>
      {/* desktop: 3 + 3 ze strzałkami */}
      <div className="hidden md:flex items-stretch">
        <StepCard s={STEPS[0]} n={1} />
        <Arrow />
        <StepCard s={STEPS[1]} n={2} />
        <Arrow />
        <StepCard s={STEPS[2]} n={3} />
      </div>
      <div className="hidden md:flex justify-end pr-24">
        <Arrow down />
      </div>
      <div className="hidden md:flex items-stretch flex-row-reverse">
        <StepCard s={STEPS[3]} n={4} />
        <Arrow left />
        <StepCard s={STEPS[4]} n={5} />
        <Arrow left />
        <StepCard s={STEPS[5]} n={6} />
      </div>

      {/* mobile: pion */}
      <div className="md:hidden flex flex-col">
        {STEPS.map((s, i) => (
          <div key={s.title} className="flex flex-col">
            <StepCard s={s} n={i + 1} />
            {i < STEPS.length - 1 && (
              <div className="flex justify-center">
                <Arrow down />
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="mt-4 text-[12px]" style={{ color: "var(--muted-foreground)" }}>
        Strzałka z kroku 6 wraca do kroku 2 — kolejne moduły wdrażamy tym samym, sprawdzonym cyklem.
      </p>
    </div>
  );
}
