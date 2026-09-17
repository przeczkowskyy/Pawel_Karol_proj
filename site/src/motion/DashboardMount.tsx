import { Suspense, lazy, useEffect, useRef, useState, type ComponentType, type RefObject } from "react";
import type { DashboardKey } from "@/data/tools";
import { useLang, pick } from "@/i18n";
import { MediaBoundary } from "./MediaBoundary";

/* Osadzanie dashboardów: kod narzędzia schodzi z krytycznej ścieżki i wchodzi dopiero,
   gdy kontener zbliża się do ekranu. Zero zależności od biblioteki ruchu w tym pliku,
   bo chunk podstrony narzędzia nie ma ciągnąć rdzenia animacji (reguła perf-code-split-dashboards). */

/* Ścieżki muszą być LITERALNE, inaczej Rollup nie zrobi z nich osobnych chunków.
   Klucze dokładnie jak unia DashboardKey w src/data/tools.ts. */
type DashProps = { autoStart?: boolean };

const LOADERS: Record<DashboardKey, () => Promise<{ default: ComponentType<DashProps> }>> = {
  report: () => import("@/components/DemoReport"),
  production: () => import("@/components/dashboards/ProductionDashboard"),
  quality: () => import("@/components/dashboards/QualityGate"),
  timeline: () => import("@/components/dashboards/TaskTimeline"),
  payments: () => import("@/components/dashboards/PaymentCalculator"),
  reconciliation: () => import("@/components/dashboards/ImportReconciliation"),
  g703: () => import("@/components/dashboards/G703Billing"),
  paymentflow: () => import("@/components/dashboards/PaymentFlow"),
  costcontrol: () => import("@/components/dashboards/CostControl"),
  erpimports: () => import("@/components/dashboards/ErpImports"),
  protocols: () => import("@/components/dashboards/LabourProtocols"),
  contracts: () => import("@/components/dashboards/ContractRegister"),
};

/* Wysokości zmierzone na szerokości 1280 px. Trzymają miejsce przed montażem, więc treść pod
   dashboardem nie skacze (CLS bliskie zeru). Aktualizować przy zmianie układu dashboardu. */
const MIN_HEIGHT: Record<DashboardKey, number> = {
  report: 720,
  production: 640,
  quality: 600,
  timeline: 640,
  payments: 560,
  reconciliation: 620,
  g703: 560,
  paymentflow: 640,
  costcontrol: 600,
  erpimports: 620,
  protocols: 680,
  contracts: 640,
};

/* Komponenty lazy tworzone raz na klucz i zapamiętane: React wymaga stabilnej referencji,
   inaczej każdy render montowałby dashboard od nowa. */
const LAZY = new Map<DashboardKey, ComponentType<DashProps>>();

function lazyDashboard(key: DashboardKey): ComponentType<DashProps> {
  const cached = LAZY.get(key);
  if (cached) return cached;
  const created = lazy(LOADERS[key]);
  LAZY.set(key, created);
  return created;
}

/** requestIdleCallback z zapasowym setTimeout (brak API w starszych Safari); zwraca funkcję odwołującą */
function idle(run: () => void, timeout = 1500): () => void {
  if (typeof requestIdleCallback === "function") {
    const id = requestIdleCallback(run, { timeout });
    return () => cancelIdleCallback(id);
  }
  const id = window.setTimeout(run, 16);
  return () => window.clearTimeout(id);
}

/* Kolejka szeregowa: gdy na jednej stronie stoi więcej niż jeden dashboard, montujemy je
   po kolei z odstępem 150 ms, zamiast zablokować wątek główny jednym długim zadaniem. */
type MountTask = { run: () => void; cancelled: boolean };

const queue: MountTask[] = [];
let draining = false;

function drain() {
  const next = queue.shift();
  if (!next) {
    draining = false;
    return;
  }
  draining = true;
  idle(() => {
    if (!next.cancelled) next.run();
    window.setTimeout(drain, 150);
  });
}

/* Zadanie zdejmuje się z kolejki przez zwróconą funkcję. Flaga `cancelled` jest potrzebna osobno:
   drain() zdejmuje zadanie z tablicy, zanim odpali je bezczynność, więc samo wyszukanie w kolejce
   nie wystarczy, gdy komponent zniknie w tym oknie. */
function enqueue(run: () => void): () => void {
  const task: MountTask = { run, cancelled: false };
  queue.push(task);
  if (!draining) drain();
  return () => {
    task.cancelled = true;
    const i = queue.indexOf(task);
    if (i >= 0) queue.splice(i, 1);
  };
}

const MSG = {
  pl: "Demo nie wczytało się. Odśwież stronę.",
  en: "The demo did not load. Refresh the page.",
} as const;

type DashboardMountProps = {
  dashboard: DashboardKey;
  /** wysokość rezerwowana przed montażem; domyślnie wartość zmierzona dla danego dashboardu */
  minHeight?: number;
  /** zmiana wartości montuje dashboard od nowa (przycisk „Odtwórz") */
  replayKey?: number;
  /** dashboard startuje od razu na wbudowanej próbce zamiast czekać na klik;
   *  obsługują to QualityGate i ImportReconciliation, reszta ignoruje */
  autoStart?: boolean;
};

export function DashboardMount({ dashboard, minHeight, replayKey = 0, autoStart }: DashboardMountProps) {
  const { lang } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const reserved = minHeight ?? MIN_HEIGHT[dashboard];

  useEffect(() => {
    const el = ref.current;
    if (!el || mounted) return;
    let cancelQueued: (() => void) | null = null;
    let ro: ResizeObserver | null = null;

    const arm = () => {
      io.disconnect();
      ro?.disconnect();
      cancelQueued = enqueue(() => setMounted(true));
    };

    /* PUŁAPKA SZEROKOŚCI ZERO (zweryfikowana w src/components/dashboards/TaskTimeline.tsx:151):
       oś Gantta ustawia przewinięcie na `xDay(selDay) - el.clientWidth * 0.4`. Gdy komponent
       montuje się w kontenerze o szerokości 0 (szkielet innej szerokości, podmiana w trakcie
       przejścia, montaż poza układem), clientWidth wynosi 0 i oś otwiera się dosunięta do lewej
       zamiast wyśrodkowana na dniu „Dziś". Nic się nie wywraca, po prostu wygląda na zepsute,
       a przyczyna jest nie do skojarzenia po kilku tygodniach. Dlatego:
       1. szkielet ma szerokość 100% i realną wysokość (nigdy display:none, nigdy zero),
       2. realny komponent montuje się dopiero, gdy kontener ma niezerową szerokość
          (jeśli w chwili wejścia w ekran jest zerowa, czekamy na pomiar z ResizeObserver). */
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        if (el.clientWidth > 0) {
          arm();
          return;
        }
        if (typeof ResizeObserver !== "function") {
          arm();
          return;
        }
        if (!ro) {
          ro = new ResizeObserver(() => {
            if (el.clientWidth > 0) arm();
          });
          ro.observe(el);
        }
      },
      { rootMargin: "0px 0px 20% 0px" },
    );

    io.observe(el);
    return () => {
      io.disconnect();
      ro?.disconnect();
      cancelQueued?.();
    };
  }, [mounted]);

  const Dashboard = lazyDashboard(dashboard);
  const skeleton = <div className="skel" style={{ minHeight: reserved, width: "100%" }} aria-busy="true" />;
  const failed = (
    <p className="empty" role="alert">
      {pick(lang, MSG)}
    </p>
  );

  return (
    <div ref={ref} data-dashboard={dashboard} style={{ minHeight: reserved }}>
      {mounted ? (
        <MediaBoundary fallback={failed}>
          <Suspense fallback={skeleton}>
            <Dashboard key={replayKey} autoStart={autoStart} />
            <ReadyFlag host={ref} />
          </Suspense>
        </MediaBoundary>
      ) : (
        skeleton
      )}
    </div>
  );
}

/* Znacznik gotowości dla skryptu zrzutów. Musi siedzieć WEWNĄTRZ Suspense: efekt wykona się
   w tym samym commicie co montaż dashboardu, więc zrzuty są deterministyczne. Postawiony na
   opakowaniu sterowanym stanem `mounted` znaczyłby tylko „zaczynamy pobierać chunk". */
function ReadyFlag({ host }: { host: RefObject<HTMLDivElement | null> }) {
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    el.dataset.ready = "true";
    return () => {
      delete el.dataset.ready;
    };
  }, [host]);
  return null;
}
