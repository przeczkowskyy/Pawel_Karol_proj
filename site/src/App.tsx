import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
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
  Check,
  X as XIcon,
  Phone,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import BookingModal, { PHONE_DISPLAY, PHONE_HREF } from "@/components/BookingModal";
import CollaborationFlow from "@/components/CollaborationFlow";
import Faq from "@/components/Faq";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";
import ModulePage from "@/pages/ModulePage";
import { MODULES } from "@/data/modules";

/* Landing Klarow v0.2 — dark-only. Komponenty i tokeny: kit company-ui,
   Tailwind wyłącznie do layoutu. Motion: scroll-reveal (CSS + IO) i
   auto-animate (FAQ, kalendarz) — oba szanują prefers-reduced-motion. */

const STEEL_BRIGHT = [226, 232, 239] as number[];
const STEEL = [168, 180, 194] as number[];

const CanvasRevealEffect = lazy(() =>
  import("@/components/ui/canvas-reveal-effect").then((m) => ({
    default: m.CanvasRevealEffect,
  }))
);

/* scroll-reveal: sekcja dostaje .in przy pierwszym wejściu w viewport */
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          el.classList.add("in");
          io.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

function Section({
  id,
  title,
  sub,
  children,
  wide = false,
}: {
  id?: string;
  title: string;
  sub?: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  const ref = useReveal<HTMLElement>();
  return (
    <section
      id={id}
      ref={ref}
      className={`reveal ${wide ? "" : "max-w-6xl mx-auto"} px-6 py-14`}
    >
      <div className={wide ? "max-w-6xl mx-auto" : ""}>
        <h2
          className="text-[26px] md:text-[30px] font-extrabold tracking-tight"
          style={{ color: "var(--heading)" }}
        >
          {title}
        </h2>
        {sub ? (
          <p className="mt-2 mb-8 max-w-3xl text-[15px]" style={{ color: "var(--muted-foreground)" }}>
            {sub}
          </p>
        ) : (
          <div className="mb-8" />
        )}
        {children}
      </div>
    </section>
  );
}

function Hero({ onBook }: { onBook: () => void }) {
  return (
    <section id="top" className="relative min-h-[92vh] flex flex-col">
      <div className="absolute inset-0 z-0">
        <Suspense fallback={null}>
          <CanvasRevealEffect
            animationSpeed={3}
            containerClassName="bg-[#121212]"
            colors={[STEEL_BRIGHT, STEEL]}
            dotSize={6}
            showGradient={true}
          />
        </Suspense>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(18,18,18,0.92)_0%,_transparent_100%)]" />
        <div className="absolute top-0 left-0 right-0 h-1/4 bg-gradient-to-b from-[#121212] to-transparent" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pt-24 pb-10">
        <span className="brand-word" style={{ fontSize: 15 }}>
          KLAROW
        </span>
        <h1
          className="mt-5 max-w-3xl text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.08]"
          style={{ color: "var(--heading)" }}
        >
          Porządek w danych dla firm,
          <br className="hidden md:block" /> które wyrosły na Excelu.
        </h1>
        <p className="mt-5 max-w-2xl text-lg md:text-xl" style={{ color: "var(--foreground)" }}>
          Zamieniamy ręczne przeklejanie, kruche makra i mailowy obieg dokumentów
          w audytowalne narzędzia. <strong>Wdrożenie w dni, nie w miesiące</strong> —
          a Twoje dane nie opuszczają firmy.
        </p>
        <p className="mt-3 text-sm font-semibold tracking-wide" style={{ color: "var(--accent-foreground)" }}>
          Raport zarządczy w kilkanaście sekund zamiast godzin.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button className="btn btn-primary" type="button" onClick={onBook}>
            Umów bezpłatną diagnozę
          </button>
          <a className="btn btn-secondary" href="#moduly">
            Zobacz moduły
          </a>
        </div>
        <a
          href={PHONE_HREF}
          className="mt-4 inline-flex items-center gap-2 text-sm font-bold"
          style={{ color: "var(--muted-foreground)" }}
        >
          <Phone size={14} style={{ color: "var(--primary)" }} /> {PHONE_DISPLAY}
        </a>
        <p className="mt-6 text-xs" style={{ color: "var(--muted-foreground)" }}>
          Dla firm 20–250 osób · środowisko Windows + Excel · narzędzia działają on-premise, u Ciebie
        </p>
      </div>
    </section>
  );
}

const PAINS = [
  { icon: UserX, title: "Makro po kimś, kto odszedł", body: "Nikt nie wie, jak działa w środku — więc wszyscy boją się je ruszyć." },
  { icon: ClipboardPaste, title: "Ręczne przeklejanie", body: "Tysiące wierszy między ERP a arkuszami, co tydzień, na piechotę." },
  { icon: AlertTriangle, title: "Ciche pomyłki", body: "Zły wiersz, zła kolumna — wychodzi po fakcie, u zarządu albo w wycenie." },
  { icon: Hourglass, title: "Raport składany godzinami", body: "Zbieranie metryk z dziesiątek plików, formatowanie, wysyłka. Co cykl." },
  { icon: User, title: "Wszystko na jednej osobie", body: "Gdy „człowiek-Excel” jest na urlopie, firma nie zna swoich liczb." },
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
  const ref = useReveal<HTMLElement>();
  return (
    <section
      id="moduly"
      ref={ref}
      className="reveal relative py-14"
      style={{
        background:
          "radial-gradient(circle at center, rgba(168,180,194,0.07) 0%, transparent 55%)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-[26px] md:text-[30px] font-extrabold tracking-tight" style={{ color: "var(--heading)" }}>
          Moduły — mapa tego, co automatyzujemy
        </h2>
        <p className="mt-2 max-w-3xl text-[15px]" style={{ color: "var(--muted-foreground)" }}>
          Każdy moduł to sprawdzony wzorzec dopasowywany do Twoich plików.{" "}
          <strong>Najedź na węzeł</strong>, żeby zobaczyć podgląd narzędzia;{" "}
          <strong>kliknij</strong>, żeby poznać szczegóły i powiązania. Każdy moduł ma też
          własną podstronę z pełnym opisem.
        </p>
      </div>
      <RadialOrbitalTimeline timelineData={MODULES} />
      <div className="max-w-6xl mx-auto px-6 -mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs" style={{ color: "var(--muted-foreground)" }}>
        <span><span className="st st-accent" style={{ marginRight: 6 }}>DOSTĘPNY</span> sprzedajemy od dziś</span>
        <span><span className="st st-gray" style={{ marginRight: 6 }}>FALA 2</span> po pierwszych wdrożeniach</span>
        <span><span className="st st-gray st-open" style={{ marginRight: 6 }}>ROADMAPA</span> w przygotowaniu</span>
      </div>
    </section>
  );
}

function Collaboration() {
  return (
    <Section
      id="wspolpraca"
      title="Jak wygląda współpraca — krok po kroku"
      sub="Sześć kroków z życia: od pierwszej wiadomości do działającego narzędzia i opieki. Zawsze widzisz, kto co robi i za co płacisz."
    >
      <CollaborationFlow />
    </Section>
  );
}

const STEPS = [
  { icon: Copy, title: "1 · Diagnoza na kopiach", body: "Pracujemy wyłącznie na kopiach Twoich plików. Zakres zamrażamy na piśmie w Dniu 0." },
  { icon: FileCode2, title: "2 · Budowa na wzorcach", body: "Silnik — bezpieczny zapis, walidacja, backup, log — jest gotowy. Dopasowujemy mapowania i reguły." },
  { icon: Eye, title: "3 · TEST bez zapisu", body: "Identyczna ścieżka kodu, pełna lista zmian do przejrzenia — a w Twoich plikach nic się nie dzieje." },
  { icon: Save, title: "4 · PROD z backupem", body: "Zapis dopiero po Twojej akceptacji: automatyczny backup przed każdą zmianą i log audytowy każdej operacji." },
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
      sub="Ekosystem kilkunastu narzędzi zbudowany dla firmy produkcyjno-budowlanej (~30 równoległych projektów, klienci w USA). Kilka twardych liczb — realne zrzuty ekranu z wdrożeń pojawią się tu wkrótce:"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PROOF.map((p) => (
          <div key={p.lbl} className="card stat">
            <div className="lbl">{p.lbl}</div>
            <div className="val" style={{ fontSize: "clamp(18px,1.1vw + 12px,26px)" }}>{p.val}</div>
            <div className="foot">{p.foot}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}

const FIT = [
  "Produkcja, budownictwo, dystrybucja, logistyka — dużo powtarzalnych danych operacyjnych",
  "20–250 osób; jest ERP, ale raportowanie i tak żyje w Excelu",
  "Środowisko Windows + Excel; 1–3 osoby „od liczb”",
  "Chcesz efektu w dni, nie projektu wdrożeniowego na pół roku",
];

const NOFIT = [
  "Szukasz migracji do chmury / zamiany ERP — tego nie robimy",
  "Pracujecie na Google Sheets / Mac — moduły zapisujące wymagają Windows + Excel",
  "Potrzebujesz zespołu do body-leasingu — sprzedajemy rezultat, nie godziny",
];

function ForWhom() {
  return (
    <Section id="dla-kogo" title="Dla kogo (i dla kogo nie)">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <div className="lbl-sm" style={{ marginBottom: 12 }}>Będzie nam po drodze, jeśli…</div>
          <ul className="flex flex-col gap-2.5">
            {FIT.map((t) => (
              <li key={t} className="flex items-start gap-2 text-[13px]" style={{ color: "var(--foreground)" }}>
                <Check size={14} style={{ color: "var(--funded)", flex: "0 0 auto", marginTop: 2 }} />
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="card">
          <div className="lbl-sm" style={{ marginBottom: 12 }}>Uczciwie: to nie dla Ciebie, jeśli…</div>
          <ul className="flex flex-col gap-2.5">
            {NOFIT.map((t) => (
              <li key={t} className="flex items-start gap-2 text-[13px]" style={{ color: "var(--muted-foreground)" }}>
                <XIcon size={14} style={{ color: "var(--rejected)", flex: "0 0 auto", marginTop: 2 }} />
                {t}
              </li>
            ))}
          </ul>
        </div>
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

function TrustOffer({ onBook }: { onBook: () => void }) {
  return (
    <Section id="oferta" title="Zaufanie na mechanizmach, nie na przymiotnikach">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        <div className="flex flex-col gap-3">
          {TRUST.map((t, i) => (
            <div key={i} className="card flex flex-row items-start gap-3" style={{ padding: 16 }}>
              <t.icon size={18} style={{ color: "var(--primary)", flex: "0 0 auto", marginTop: 2 }} />
              <p className="text-[13px] leading-relaxed" style={{ color: "var(--foreground)" }}>{t.text}</p>
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
            <button className="btn btn-primary" type="button" onClick={onBook}>
              Umów diagnozę — wybierz termin
            </button>
            <a className="btn btn-secondary" href={PHONE_HREF}>
              <Phone size={15} /> {PHONE_DISPLAY}
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

function FaqSection() {
  return (
    <Section
      id="faq"
      title="Najczęstsze obiekcje — odpowiadamy wprost"
      sub="Te same pytania słyszymy w każdej rozmowie. Oto odpowiedzi, zanim zdążysz zapytać."
    >
      <div className="max-w-3xl">
        <Faq />
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
          <a className="text-sm font-bold inline-flex items-center gap-2" style={{ color: "var(--accent-foreground)" }} href={PHONE_HREF}>
            <Phone size={14} /> {PHONE_DISPLAY}
          </a>
          <a className="text-sm font-bold" style={{ color: "var(--accent-foreground)" }} href="mailto:kontakt@klarow.com">
            kontakt@klarow.com
          </a>
          <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
            © 2026 Klarow · strona robocza v0.2
          </p>
        </div>
      </div>
    </footer>
  );
}

function Landing({ onBook }: { onBook: () => void }) {
  const { hash } = useLocation();
  useEffect(() => {
    if (!hash) return;
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, [hash]);

  return (
    <>
      <Hero onBook={onBook} />
      <Pain />
      <Modules />
      <Collaboration />
      <How />
      <Proof />
      <ForWhom />
      <TrustOffer onBook={onBook} />
      <FaqSection />
      <Footer />
    </>
  );
}

export default function App() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const onBook = () => setBookingOpen(true);

  return (
    <div style={{ background: "var(--body-bg)" }}>
      <Navbar onBook={onBook} />
      <Routes>
        <Route path="/" element={<Landing onBook={onBook} />} />
        <Route
          path="/moduly/:slug"
          element={
            <>
              <ModulePage onBook={onBook} />
              <Footer />
            </>
          }
        />
      </Routes>
      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </div>
  );
}
