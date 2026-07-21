import {
  ShieldCheck,
  Copy,
  Eye,
  Save,
  UserX,
  ClipboardPaste,
  AlertTriangle,
  Hourglass,
  User,
  Lock,
  FileCode2,
  ScrollText,
} from "lucide-react";
import { lazy, Suspense } from "react";
import Navbar from "@/components/Navbar";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";
import { MODULES } from "@/data/modules";

/* three.js (~1 MB) ładuje się leniwie PO pierwszym paincie — hero renderuje
   się natychmiast na tle --body-bg, kropki dołączają, gdy chunk dojedzie. */
const CanvasRevealEffect = lazy(() =>
  import("@/components/ui/canvas-reveal-effect").then((m) => ({
    default: m.CanvasRevealEffect,
  }))
);

/* Landing Klarow v0.1 — dark-only. Komponenty i tokeny: kit company-ui
   (klasy .card/.btn/.st/.stat…), Tailwind wyłącznie do layoutu. */

const STEEL = { a: [168, 180, 194] as number[], b: [191, 201, 214] as number[] };

function Section({
  id,
  title,
  sub,
  children,
}: {
  id?: string;
  title: string;
  sub?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="max-w-6xl mx-auto px-6 py-20">
      <h2
        className="text-[26px] md:text-[30px] font-extrabold tracking-tight"
        style={{ color: "var(--heading)" }}
      >
        {title}
      </h2>
      {sub && (
        <p className="mt-2 mb-8 text-[15px]" style={{ color: "var(--muted-foreground)" }}>
          {sub}
        </p>
      )}
      {!sub && <div className="mb-8" />}
      {children}
    </section>
  );
}

function Hero() {
  return (
    <section id="top" className="relative min-h-screen flex flex-col">
      <div className="absolute inset-0 z-0">
        <Suspense fallback={null}>
          <CanvasRevealEffect
            animationSpeed={3}
            containerClassName="bg-[#121212]"
            colors={[STEEL.a, STEEL.b]}
            dotSize={4}
            opacities={[0.04, 0.04, 0.06, 0.06, 0.08, 0.08, 0.1, 0.12, 0.14, 0.18]}
            showGradient={true}
          />
        </Suspense>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(18,18,18,0.9)_0%,_transparent_100%)]" />
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-[#121212] to-transparent" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pt-28 pb-16">
        <span className="brand-word" style={{ fontSize: 15 }}>
          KLAROW
        </span>
        <h1
          className="mt-6 max-w-3xl text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.08]"
          style={{ color: "var(--heading)" }}
        >
          Porządek w danych dla firm,
          <br className="hidden md:block" /> które wyrosły na Excelu.
        </h1>
        <p className="mt-6 max-w-2xl text-lg md:text-xl" style={{ color: "var(--foreground)" }}>
          Zamieniamy ręczne przeklejanie, kruche makra i mailowy obieg dokumentów
          w audytowalne narzędzia. <strong>Wdrożenie w dni, nie w miesiące</strong> —
          a Twoje dane nie opuszczają firmy.
        </p>
        <p className="mt-4 text-sm font-semibold tracking-wide" style={{ color: "var(--accent-foreground)" }}>
          Raport zarządczy w kilkanaście sekund zamiast godzin.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a className="btn btn-primary" href="mailto:kontakt@klarow.com?subject=Diagnoza%20automatyzacji">
            Umów bezpłatną diagnozę
          </a>
          <a className="btn btn-secondary" href="#moduly">
            Zobacz moduły
          </a>
        </div>
        <p className="mt-8 text-xs" style={{ color: "var(--muted-foreground)" }}>
          Dla firm 20–250 osób · środowisko Windows + Excel · narzędzia działają on-premise, u Ciebie
        </p>
      </div>
    </section>
  );
}

const PAINS = [
  {
    icon: UserX,
    title: "Makro po kimś, kto odszedł",
    body: "Nikt nie wie, jak działa w środku — więc wszyscy boją się je ruszyć.",
  },
  {
    icon: ClipboardPaste,
    title: "Ręczne przeklejanie",
    body: "Tysiące wierszy między ERP a arkuszami, co tydzień, na piechotę.",
  },
  {
    icon: AlertTriangle,
    title: "Ciche pomyłki",
    body: "Zły wiersz, zła kolumna — wychodzi po fakcie, u zarządu albo w wycenie.",
  },
  {
    icon: Hourglass,
    title: "Raport składany godzinami",
    body: "Zbieranie metryk z dziesiątek plików, formatowanie, wysyłka. Co cykl.",
  },
  {
    icon: User,
    title: "Wszystko na jednej osobie",
    body: "Gdy „człowiek-Excel” jest na urlopie, firma nie zna swoich liczb.",
  },
];

function Pain() {
  return (
    <Section
      title="To działa, więc boisz się ruszać. Słusznie."
      sub="Dlatego nie każemy Ci migrować z Excela ani zmieniać sposobu pracy — wchodzimy obok Twoich plików."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {PAINS.map((p) => (
          <div key={p.title} className="card">
            <p.icon size={20} style={{ color: "var(--primary)" }} />
            <h3 className="mt-3 text-[14px] font-bold" style={{ color: "var(--heading)" }}>
              {p.title}
            </h3>
            <p className="mt-2 text-[12.5px] leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
              {p.body}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Modules() {
  return (
    <section id="moduly" className="relative py-20">
      <div className="max-w-6xl mx-auto px-6">
        <h2
          className="text-[26px] md:text-[30px] font-extrabold tracking-tight"
          style={{ color: "var(--heading)" }}
        >
          Moduły — mapa tego, co automatyzujemy
        </h2>
        <p className="mt-2 text-[15px]" style={{ color: "var(--muted-foreground)" }}>
          Każdy moduł to sprawdzony wzorzec dopasowywany do Twoich plików.{" "}
          <strong>Kliknij węzeł</strong>, żeby zobaczyć szczegóły, czas wdrożenia i powiązania
          między modułami.
        </p>
      </div>
      <RadialOrbitalTimeline timelineData={MODULES} />
      <div className="max-w-6xl mx-auto px-6 -mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs" style={{ color: "var(--muted-foreground)" }}>
        <span>
          <span className="st st-accent" style={{ marginRight: 6 }}>DOSTĘPNY</span> sprzedajemy od dziś
        </span>
        <span>
          <span className="st st-gray" style={{ marginRight: 6 }}>FALA 2</span> po pierwszych wdrożeniach
        </span>
        <span>
          <span className="st st-gray st-open" style={{ marginRight: 6 }}>ROADMAPA</span> w przygotowaniu
        </span>
      </div>
    </section>
  );
}

const STEPS = [
  {
    icon: Copy,
    title: "1 · Diagnoza na kopiach",
    body: "Pracujemy wyłącznie na kopiach Twoich plików. Zakres zamrażamy na piśmie w Dniu 0.",
  },
  {
    icon: FileCode2,
    title: "2 · Budowa na wzorcach",
    body: "Silnik — bezpieczny zapis, walidacja, backup, log — jest gotowy. Dopasowujemy mapowania i reguły.",
  },
  {
    icon: Eye,
    title: "3 · TEST bez zapisu",
    body: "Identyczna ścieżka kodu, pełna lista zmian do przejrzenia — a w Twoich plikach nic się nie dzieje.",
  },
  {
    icon: Save,
    title: "4 · PROD z backupem",
    body: "Zapis dopiero po Twojej akceptacji: automatyczny backup przed każdą zmianą i log audytowy każdej operacji.",
  },
];

function How() {
  return (
    <Section
      id="jak"
      title="Dlaczego dni, a nie miesiące"
      sub="Biblioteka wzorców z kilkunastu wdrożonych narzędzi · Excel zostaje Twoją warstwą danych (zero migracji) · zero serwera — narzędzie uruchamiasz dwuklikiem · wytwarzanie wspomagane AI. Narzędzie liczy deterministycznie — żadna liczba nie powstaje „z modelu”."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STEPS.map((s) => (
          <div key={s.title} className="card">
            <s.icon size={20} style={{ color: "var(--primary)" }} />
            <h3 className="mt-3 text-[14px] font-bold" style={{ color: "var(--heading)" }}>
              {s.title}
            </h3>
            <p className="mt-2 text-[12.5px] leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
              {s.body}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}

const PROOF = [
  { val: "~10 000", lbl: "wierszy kosztów z ERP", foot: "importowanych i klasyfikowanych automatycznie co miesiąc" },
  { val: "kilkanaście s", lbl: "raport dla zarządu", foot: "zamiast godzin ręcznego składania" },
  { val: "~30 projektów", lbl: "zamknięcie wersji", foot: "opublikowanych w kilkanaście sekund" },
  { val: "co do grosza", lbl: "kontrola sum", foot: "przy tygodniowych zmianach rzędu 1 mln zł" },
];

function Proof() {
  return (
    <Section
      id="dowod"
      title="Zrobiliśmy to już od środka"
      sub="Ekosystem kilkunastu narzędzi zbudowany dla firmy produkcyjno-budowlanej (~30 równoległych projektów, klienci w USA). Kilka twardych liczb:"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PROOF.map((p) => (
          <div key={p.lbl} className="card stat">
            <div className="lbl">{p.lbl}</div>
            <div className="val" style={{ fontSize: "clamp(18px,1.1vw + 12px,26px)" }}>
              {p.val}
            </div>
            <div className="foot">{p.foot}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}

const TRUST = [
  { icon: Lock, text: "Narzędzia działają u Ciebie (on-premise) — dane nie opuszczają firmy. Nie mamy do nich dostępu po wdrożeniu." },
  { icon: Eye, text: "Tryb TEST z pełnym podglądem zmian zanim cokolwiek zostanie zapisane." },
  { icon: Save, text: "Automatyczny backup przed każdym zapisem i log audytowy każdej operacji." },
  { icon: ScrollText, text: "Pełny kod źródłowy, dokumentacja i runbook zostają u Ciebie — narzędzie działa nawet bez nas." },
  { icon: ShieldCheck, text: "Stała cena i zakres zamrożony na piśmie. Druga rata płatna po działającym odbiorze." },
];

function TrustOffer() {
  return (
    <Section
      id="oferta"
      title="Zaufanie na mechanizmach, nie na przymiotnikach"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        <div className="flex flex-col gap-3">
          {TRUST.map((t, i) => (
            <div key={i} className="card flex flex-row items-start gap-3" style={{ padding: 16 }}>
              <t.icon size={18} style={{ color: "var(--primary)", flex: "0 0 auto", marginTop: 2 }} />
              <p className="text-[13px] leading-relaxed" style={{ color: "var(--foreground)" }}>
                {t.text}
              </p>
            </div>
          ))}
        </div>
        <div className="card" style={{ padding: 26 }}>
          <span className="st st-accent">OFERTA WEJŚCIOWA</span>
          <h3 className="mt-4 text-[22px] font-extrabold" style={{ color: "var(--heading)" }}>
            Pilot na kopii
          </h3>
          <p className="mt-3 text-[14px] leading-relaxed" style={{ color: "var(--foreground)" }}>
            Jeden proces, stała cena, <strong>≤10 dni roboczych</strong>. Budujemy na kopii
            Twoich plików, pierwszy namacalny efekt (raport błędów z Twoich prawdziwych danych)
            widzisz w dniu 5. Zapis na oryginałach — dopiero po Twojej akceptacji.
          </p>
          <ul className="mt-4 flex flex-col gap-2 text-[13px]" style={{ color: "var(--muted-foreground)" }}>
            <li>· Dzień 0: wybór procesu i zamrożenie zakresu (wliczony)</li>
            <li>· Dni 1–4: budowa wyłącznie na kopiach</li>
            <li>· Dzień 5: pokaz na żywo + raport z Twoich danych</li>
            <li>· Płatność 50/50 — druga rata po działającym odbiorze</li>
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <a className="btn btn-primary" href="mailto:kontakt@klarow.com?subject=Pilot%20na%20kopii">
              Porozmawiajmy o Twoim procesie
            </a>
          </div>
          <p className="mt-4 text-[12px]" style={{ color: "var(--muted-foreground)" }}>
            Zanim cokolwiek kupisz: <strong>przyślij nam swój najgorszy Excel</strong> — w 30 minut
            pokażemy na próbce, co da się z nim zrobić.
          </p>
        </div>
      </div>
    </Section>
  );
}

function Footer() {
  return (
    <footer id="kontakt" className="border-t" style={{ borderColor: "var(--border)" }}>
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center sm:items-start gap-2">
          <span className="brand-word" style={{ fontSize: 14 }}>KLAROW</span>
          <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
            Automatyzacja i porządek w danych dla MŚP · Polska / USA
          </p>
        </div>
        <div className="flex flex-col items-center sm:items-end gap-2">
          <a
            className="text-sm font-bold"
            style={{ color: "var(--accent-foreground)" }}
            href="mailto:kontakt@klarow.com"
          >
            kontakt@klarow.com
          </a>
          <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
            © 2026 Klarow · strona robocza v0.1
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div style={{ background: "var(--body-bg)" }}>
      <Navbar />
      <Hero />
      <Pain />
      <Modules />
      <How />
      <Proof />
      <TrustOffer />
      <Footer />
    </div>
  );
}
