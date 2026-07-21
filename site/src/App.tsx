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
import RadialOrbitalTimeline, { type OrbitalUi } from "@/components/ui/radial-orbital-timeline";
import ModulePage from "@/pages/ModulePage";
import { getModules } from "@/data/modules";
import { useLang, pick } from "@/i18n";

/* Landing Klarow v0.3 — dark-only, PL/EN. Tło dot-matrix (shader, lazy chunk)
   pokrywa CAŁĄ stronę jako warstwa fixed; treść na z-10. Komponenty i tokeny:
   kit company-ui, Tailwind wyłącznie do layoutu. */

const STEEL_BRIGHT = [226, 232, 239] as number[];
const STEEL = [168, 180, 194] as number[];

const CanvasRevealEffect = lazy(() =>
  import("@/components/ui/canvas-reveal-effect").then((m) => ({
    default: m.CanvasRevealEffect,
  }))
);

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
}: {
  id?: string;
  title: string;
  sub?: string;
  children: React.ReactNode;
}) {
  const ref = useReveal<HTMLElement>();
  return (
    <section id={id} ref={ref} className="reveal max-w-6xl mx-auto px-6 py-14">
      <h2 className="text-[26px] md:text-[30px] font-extrabold tracking-tight" style={{ color: "var(--heading)" }}>
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
    </section>
  );
}

/* ── HERO ── */
const HERO = {
  pl: {
    h1a: "Porządek w danych dla firm,",
    h1b: "które wyrosły na Excelu.",
    lead1: "Zamieniamy ręczne przeklejanie, kruche makra i mailowy obieg dokumentów w audytowalne narzędzia. ",
    leadStrong: "Wdrożenie w dni, nie w miesiące",
    lead2: " — a Twoje dane nie opuszczają firmy.",
    proof: "Raport zarządczy w kilkanaście sekund zamiast godzin.",
    ctaMain: "Umów bezpłatną diagnozę",
    ctaModules: "Zobacz moduły",
    qualifier: "Dla firm 20–250 osób · środowisko Windows + Excel · narzędzia działają on-premise, u Ciebie",
  },
  en: {
    h1a: "Order in the data of companies",
    h1b: "that grew up on Excel.",
    lead1: "We turn manual copy-pasting, fragile macros and email-driven document flows into auditable tools. ",
    leadStrong: "Deployed in days, not months",
    lead2: " — and your data never leaves your company.",
    proof: "A board report in seconds instead of hours.",
    ctaMain: "Book a free diagnosis",
    ctaModules: "See the modules",
    qualifier: "For companies of 20–250 people · Windows + Excel environment · tools run on-premise, at your site",
  },
};

function Hero({ onBook }: { onBook: () => void }) {
  const { lang } = useLang();
  const t = pick(lang, HERO);
  return (
    <section id="top" className="relative min-h-[92vh] flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 pt-24 pb-10">
        <span className="brand-word" style={{ fontSize: 15 }}>KLAROW</span>
        <h1
          className="mt-5 max-w-3xl text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.08]"
          style={{ color: "var(--heading)" }}
        >
          {t.h1a}
          <br className="hidden md:block" /> {t.h1b}
        </h1>
        <p className="mt-5 max-w-2xl text-lg md:text-xl" style={{ color: "var(--foreground)" }}>
          {t.lead1}
          <strong>{t.leadStrong}</strong>
          {t.lead2}
        </p>
        <p className="mt-3 text-sm font-semibold tracking-wide" style={{ color: "var(--accent-foreground)" }}>
          {t.proof}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button className="btn btn-primary" type="button" onClick={onBook}>
            {t.ctaMain}
          </button>
          <a className="btn btn-secondary" href="#moduly">
            {t.ctaModules}
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
          {t.qualifier}
        </p>
      </div>
    </section>
  );
}

/* ── BÓL ── */
const PAIN = {
  pl: {
    title: "To działa, więc boisz się ruszać. Słusznie.",
    sub: "Dlatego nie każemy Ci migrować z Excela ani zmieniać sposobu pracy — wchodzimy obok Twoich plików.",
    items: [
      { icon: UserX, title: "Makro po kimś, kto odszedł", body: "Nikt nie wie, jak działa w środku — więc wszyscy boją się je ruszyć." },
      { icon: ClipboardPaste, title: "Ręczne przeklejanie", body: "Tysiące wierszy między ERP a arkuszami, co tydzień, na piechotę." },
      { icon: AlertTriangle, title: "Ciche pomyłki", body: "Zły wiersz, zła kolumna — wychodzi po fakcie, u zarządu albo w wycenie." },
      { icon: Hourglass, title: "Raport składany godzinami", body: "Zbieranie metryk z dziesiątek plików, formatowanie, wysyłka. Co cykl." },
      { icon: User, title: "Wszystko na jednej osobie", body: "Gdy „człowiek-Excel” jest na urlopie, firma nie zna swoich liczb." },
    ],
  },
  en: {
    title: "It works, so you're afraid to touch it. Rightly so.",
    sub: "That's why we don't ask you to migrate off Excel or change how you work — we build alongside your files.",
    items: [
      { icon: UserX, title: "A macro by someone long gone", body: "Nobody knows how it works inside — so everyone is afraid to touch it." },
      { icon: ClipboardPaste, title: "Manual copy-pasting", body: "Thousands of rows between the ERP and spreadsheets, every week, by hand." },
      { icon: AlertTriangle, title: "Silent mistakes", body: "Wrong row, wrong column — discovered after the fact, at the board meeting or in a quote." },
      { icon: Hourglass, title: "Reports assembled for hours", body: "Collecting metrics from dozens of files, formatting, sending. Every cycle." },
      { icon: User, title: "Everything rests on one person", body: "When the “Excel person” is on holiday, the company doesn't know its numbers." },
    ],
  },
};

function Pain() {
  const { lang } = useLang();
  const t = pick(lang, PAIN);
  return (
    <Section title={t.title} sub={t.sub}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {t.items.map((p) => (
          <div key={p.title} className="card">
            <p.icon size={20} style={{ color: "var(--primary)" }} />
            <h3 className="mt-3 text-[14px] font-bold" style={{ color: "var(--heading)" }}>{p.title}</h3>
            <p className="mt-2 text-[12.5px] leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{p.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ── MODUŁY ── */
const MODULES_TXT = {
  pl: {
    title: "Moduły — mapa tego, co automatyzujemy",
    sub1: "Każdy moduł to sprawdzony wzorzec dopasowywany do Twoich plików. ",
    hover: "Najedź na węzeł",
    sub2: ", żeby zobaczyć podgląd narzędzia; ",
    click: "kliknij",
    sub3: ", żeby poznać szczegóły i powiązania. Każdy moduł ma też własną podstronę z pełnym opisem.",
    l1: "sprzedajemy od dziś",
    l2: "po pierwszych wdrożeniach",
    l3: "w przygotowaniu",
    s1: "DOSTĘPNY",
    s2: "FALA 2",
    s3: "ROADMAPA",
  },
  en: {
    title: "Modules — a map of what we automate",
    sub1: "Every module is a proven pattern adapted to your files. ",
    hover: "Hover over a node",
    sub2: " to preview the tool; ",
    click: "click",
    sub3: " to see details and connections. Each module also has its own page with a full description.",
    l1: "selling today",
    l2: "after first deployments",
    l3: "in preparation",
    s1: "AVAILABLE",
    s2: "WAVE 2",
    s3: "ROADMAP",
  },
};

const ORBITAL_UI_EN: OrbitalUi = {
  statusLabels: { completed: "AVAILABLE", "in-progress": "WAVE 2", pending: "ROADMAP" },
  readiness: "Pattern readiness",
  related: "Related modules",
  fullDesc: "Full module description",
  hoverHint: "click the node to see details",
};

function Modules() {
  const { lang } = useLang();
  const t = pick(lang, MODULES_TXT);
  const ref = useReveal<HTMLElement>();
  return (
    <section
      id="moduly"
      ref={ref}
      className="reveal relative py-14"
      style={{ background: "radial-gradient(circle at center, rgba(168,180,194,0.07) 0%, transparent 55%)" }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-[26px] md:text-[30px] font-extrabold tracking-tight" style={{ color: "var(--heading)" }}>
          {t.title}
        </h2>
        <p className="mt-2 max-w-3xl text-[15px]" style={{ color: "var(--muted-foreground)" }}>
          {t.sub1}
          <strong>{t.hover}</strong>
          {t.sub2}
          <strong>{t.click}</strong>
          {t.sub3}
        </p>
      </div>
      <RadialOrbitalTimeline
        timelineData={getModules(lang)}
        ui={lang === "en" ? ORBITAL_UI_EN : undefined}
      />
      <div className="max-w-6xl mx-auto px-6 -mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs" style={{ color: "var(--muted-foreground)" }}>
        <span><span className="st st-accent" style={{ marginRight: 6 }}>{t.s1}</span> {t.l1}</span>
        <span><span className="st st-gray" style={{ marginRight: 6 }}>{t.s2}</span> {t.l2}</span>
        <span><span className="st st-gray st-open" style={{ marginRight: 6 }}>{t.s3}</span> {t.l3}</span>
      </div>
    </section>
  );
}

/* ── WSPÓŁPRACA (flowchart) ── */
const COLLAB = {
  pl: {
    title: "Jak wygląda współpraca — schemat blokowy",
    sub: "Od pierwszej wiadomości do działającego narzędzia i opieki — z dwiema decyzjami, które zawsze należą do Ciebie.",
  },
  en: {
    title: "How we work together — a flowchart",
    sub: "From the first message to a working tool and ongoing care — with two decisions that are always yours.",
  },
};

function Collaboration() {
  const { lang } = useLang();
  const t = pick(lang, COLLAB);
  return (
    <Section id="wspolpraca" title={t.title} sub={t.sub}>
      <CollaborationFlow />
    </Section>
  );
}

/* ── DLACZEGO DNI ── */
const HOW = {
  pl: {
    title: "Dlaczego dni, a nie miesiące",
    sub: "Biblioteka wzorców z kilkunastu wdrożonych narzędzi · Excel zostaje Twoją warstwą danych (zero migracji) · zero serwera — narzędzie uruchamiasz dwuklikiem · wytwarzanie wspomagane AI. Narzędzie liczy deterministycznie — żadna liczba nie powstaje „z modelu”.",
    steps: [
      { icon: Copy, title: "1 · Diagnoza na kopiach", body: "Pracujemy wyłącznie na kopiach Twoich plików. Zakres zamrażamy na piśmie w Dniu 0." },
      { icon: FileCode2, title: "2 · Budowa na wzorcach", body: "Silnik — bezpieczny zapis, walidacja, backup, log — jest gotowy. Dopasowujemy mapowania i reguły." },
      { icon: Eye, title: "3 · TEST bez zapisu", body: "Identyczna ścieżka kodu, pełna lista zmian do przejrzenia — a w Twoich plikach nic się nie dzieje." },
      { icon: Save, title: "4 · PROD z backupem", body: "Zapis dopiero po Twojej akceptacji: automatyczny backup przed każdą zmianą i log audytowy każdej operacji." },
    ],
  },
  en: {
    title: "Why days, not months",
    sub: "A pattern library from a dozen-plus deployed tools · Excel stays your data layer (zero migration) · zero servers — you launch the tool with a double-click · AI-assisted development. The tool computes deterministically — no number ever comes “from a model”.",
    steps: [
      { icon: Copy, title: "1 · Diagnosis on copies", body: "We work exclusively on copies of your files. The scope is frozen in writing on Day 0." },
      { icon: FileCode2, title: "2 · Built on patterns", body: "The engine — safe writes, validation, backup, log — is ready. We adapt mappings and rules." },
      { icon: Eye, title: "3 · TEST without writing", body: "The identical code path, a full change list to review — and nothing happens in your files." },
      { icon: Save, title: "4 · PROD with backup", body: "Writes only after your approval: an automatic backup before every change and an audit log of every operation." },
    ],
  },
};

function How() {
  const { lang } = useLang();
  const t = pick(lang, HOW);
  return (
    <Section id="jak" title={t.title} sub={t.sub}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {t.steps.map((s) => (
          <div key={s.title} className="card">
            <s.icon size={20} style={{ color: "var(--primary)" }} />
            <h3 className="mt-3 text-[14px] font-bold" style={{ color: "var(--heading)" }}>{s.title}</h3>
            <p className="mt-2 text-[12.5px] leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{s.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ── DOWÓD ── */
const PROOF = {
  pl: {
    title: "Zrobiliśmy to już od środka",
    sub: "Ekosystem kilkunastu narzędzi zbudowany dla firmy produkcyjno-budowlanej (~30 równoległych projektów, klienci w USA). Kilka twardych liczb — realne zrzuty ekranu z wdrożeń pojawią się tu wkrótce:",
    items: [
      { val: "~10 000", lbl: "wierszy kosztów z ERP", foot: "importowanych i klasyfikowanych automatycznie co miesiąc" },
      { val: "kilkanaście s", lbl: "raport dla zarządu", foot: "zamiast godzin ręcznego składania" },
      { val: "~30 projektów", lbl: "zamknięcie wersji", foot: "opublikowanych w kilkanaście sekund" },
      { val: "co do grosza", lbl: "kontrola sum", foot: "przy tygodniowych zmianach rzędu 1 mln zł" },
    ],
  },
  en: {
    title: "We've already done this from the inside",
    sub: "An ecosystem of a dozen-plus tools built for a manufacturing-and-construction company (~30 parallel projects, US clients). A few hard numbers — real deployment screenshots coming soon:",
    items: [
      { val: "~10,000", lbl: "cost rows from the ERP", foot: "imported and classified automatically every month" },
      { val: "seconds", lbl: "board report", foot: "instead of hours of manual assembly" },
      { val: "~30 projects", lbl: "version close", foot: "published in seconds" },
      { val: "to the cent", lbl: "totals control", foot: "with weekly deltas around PLN 1M" },
    ],
  },
};

function Proof() {
  const { lang } = useLang();
  const t = pick(lang, PROOF);
  return (
    <Section id="dowod" title={t.title} sub={t.sub}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {t.items.map((p) => (
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

/* ── DLA KOGO ── */
const FIT = {
  pl: {
    title: "Dla kogo (i dla kogo nie)",
    yesHead: "Będzie nam po drodze, jeśli…",
    noHead: "Uczciwie: to nie dla Ciebie, jeśli…",
    yes: [
      "Produkcja, budownictwo, dystrybucja, logistyka — dużo powtarzalnych danych operacyjnych",
      "20–250 osób; jest ERP, ale raportowanie i tak żyje w Excelu",
      "Środowisko Windows + Excel; 1–3 osoby „od liczb”",
      "Chcesz efektu w dni, nie projektu wdrożeniowego na pół roku",
    ],
    no: [
      "Szukasz migracji do chmury / zamiany ERP — tego nie robimy",
      "Pracujecie na Google Sheets / Mac — moduły zapisujące wymagają Windows + Excel",
      "Potrzebujesz zespołu do body-leasingu — sprzedajemy rezultat, nie godziny",
    ],
  },
  en: {
    title: "Who it's for (and who it isn't)",
    yesHead: "We'll get along if…",
    noHead: "Honestly: not for you if…",
    yes: [
      "Manufacturing, construction, distribution, logistics — lots of repetitive operational data",
      "20–250 people; there is an ERP, but reporting still lives in Excel",
      "Windows + Excel environment; 1–3 “numbers people”",
      "You want results in days, not a six-month implementation project",
    ],
    no: [
      "You're looking for a cloud migration / ERP replacement — we don't do that",
      "You work on Google Sheets / Mac — writing modules require Windows + Excel",
      "You need body-leasing — we sell results, not hours",
    ],
  },
};

function ForWhom() {
  const { lang } = useLang();
  const t = pick(lang, FIT);
  return (
    <Section id="dla-kogo" title={t.title}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <div className="lbl-sm" style={{ marginBottom: 12 }}>{t.yesHead}</div>
          <ul className="flex flex-col gap-2.5">
            {t.yes.map((x) => (
              <li key={x} className="flex items-start gap-2 text-[13px]" style={{ color: "var(--foreground)" }}>
                <Check size={14} style={{ color: "var(--funded)", flex: "0 0 auto", marginTop: 2 }} />
                {x}
              </li>
            ))}
          </ul>
        </div>
        <div className="card">
          <div className="lbl-sm" style={{ marginBottom: 12 }}>{t.noHead}</div>
          <ul className="flex flex-col gap-2.5">
            {t.no.map((x) => (
              <li key={x} className="flex items-start gap-2 text-[13px]" style={{ color: "var(--muted-foreground)" }}>
                <XIcon size={14} style={{ color: "var(--rejected)", flex: "0 0 auto", marginTop: 2 }} />
                {x}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}

/* ── ZAUFANIE + OFERTA ── */
const TRUST = {
  pl: {
    title: "Zaufanie na mechanizmach, nie na przymiotnikach",
    items: [
      { icon: Lock, text: "Narzędzia działają u Ciebie (on-premise) — dane nie opuszczają firmy. Nie mamy do nich dostępu po wdrożeniu." },
      { icon: Eye, text: "Tryb TEST z pełnym podglądem zmian zanim cokolwiek zostanie zapisane." },
      { icon: Save, text: "Automatyczny backup przed każdym zapisem i log audytowy każdej operacji." },
      { icon: ScrollText, text: "Pełny kod źródłowy, dokumentacja i runbook zostają u Ciebie — narzędzie działa nawet bez nas." },
      { icon: ShieldCheck, text: "Stała cena i zakres zamrożony na piśmie. Druga rata płatna po działającym odbiorze." },
    ],
    offerTag: "OFERTA WEJŚCIOWA",
    offerTitle: "Pilot na kopii",
    offerBody1: "Jeden proces, stała cena, ",
    offerStrong: "≤10 dni roboczych",
    offerBody2: ". Budujemy na kopii Twoich plików, pierwszy namacalny efekt (raport błędów z Twoich prawdziwych danych) widzisz w dniu 5. Zapis na oryginałach — dopiero po Twojej akceptacji.",
    bullets: [
      "· Dzień 0: wybór procesu i zamrożenie zakresu (wliczony)",
      "· Dni 1–4: budowa wyłącznie na kopiach",
      "· Dzień 5: pokaz na żywo + raport z Twoich danych",
      "· Płatność 50/50 — druga rata po działającym odbiorze",
    ],
    cta: "Umów diagnozę — wybierz termin",
    worst1: "Zanim cokolwiek kupisz: ",
    worstStrong: "przyślij nam swój najgorszy Excel",
    worst2: " — w 30 minut pokażemy na próbce, co da się z nim zrobić.",
  },
  en: {
    title: "Trust built on mechanisms, not adjectives",
    items: [
      { icon: Lock, text: "The tools run at your site (on-premise) — data never leaves your company. We have no access after deployment." },
      { icon: Eye, text: "A TEST mode with a full change preview before anything is written." },
      { icon: Save, text: "An automatic backup before every write and an audit log of every operation." },
      { icon: ScrollText, text: "Full source code, documentation and a runbook stay with you — the tool works even without us." },
      { icon: ShieldCheck, text: "A fixed price and a scope frozen in writing. The second instalment is due after a working handover." },
    ],
    offerTag: "ENTRY OFFER",
    offerTitle: "Pilot on a copy",
    offerBody1: "One process, a fixed price, ",
    offerStrong: "≤10 business days",
    offerBody2: ". We build on a copy of your files; you see the first tangible result (an error report from your real data) on day 5. Writes to the originals — only after your approval.",
    bullets: [
      "· Day 0: process selection and scope freeze (included)",
      "· Days 1–4: building exclusively on copies",
      "· Day 5: live demo + a report from your data",
      "· 50/50 payment — the second instalment after a working handover",
    ],
    cta: "Book a diagnosis — pick a slot",
    worst1: "Before you buy anything: ",
    worstStrong: "send us your worst Excel",
    worst2: " — in 30 minutes we'll show you, on a sample, what can be done with it.",
  },
};

function TrustOffer({ onBook }: { onBook: () => void }) {
  const { lang } = useLang();
  const t = pick(lang, TRUST);
  return (
    <Section id="oferta" title={t.title}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        <div className="flex flex-col gap-3">
          {t.items.map((x, i) => (
            <div key={i} className="card flex flex-row items-start gap-3" style={{ padding: 16 }}>
              <x.icon size={18} style={{ color: "var(--primary)", flex: "0 0 auto", marginTop: 2 }} />
              <p className="text-[13px] leading-relaxed" style={{ color: "var(--foreground)" }}>{x.text}</p>
            </div>
          ))}
        </div>
        <div className="card" style={{ padding: 26 }}>
          <span className="st st-accent">{t.offerTag}</span>
          <h3 className="mt-4 text-[22px] font-extrabold" style={{ color: "var(--heading)" }}>{t.offerTitle}</h3>
          <p className="mt-3 text-[14px] leading-relaxed" style={{ color: "var(--foreground)" }}>
            {t.offerBody1}
            <strong>{t.offerStrong}</strong>
            {t.offerBody2}
          </p>
          <ul className="mt-4 flex flex-col gap-2 text-[13px]" style={{ color: "var(--muted-foreground)" }}>
            {t.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <button className="btn btn-primary" type="button" onClick={onBook}>{t.cta}</button>
            <a className="btn btn-secondary" href={PHONE_HREF}>
              <Phone size={15} /> {PHONE_DISPLAY}
            </a>
          </div>
          <p className="mt-4 text-[12px]" style={{ color: "var(--muted-foreground)" }}>
            {t.worst1}
            <strong>{t.worstStrong}</strong>
            {t.worst2}
          </p>
        </div>
      </div>
    </Section>
  );
}

/* ── FAQ ── */
const FAQ_TXT = {
  pl: { title: "Najczęstsze obiekcje — odpowiadamy wprost", sub: "Te same pytania słyszymy w każdej rozmowie. Oto odpowiedzi, zanim zdążysz zapytać." },
  en: { title: "Common objections — answered head-on", sub: "We hear the same questions in every conversation. Here are the answers before you even ask." },
};

function FaqSection() {
  const { lang } = useLang();
  const t = pick(lang, FAQ_TXT);
  return (
    <Section id="faq" title={t.title} sub={t.sub}>
      <div className="max-w-3xl">
        <Faq />
      </div>
    </Section>
  );
}

/* ── STOPKA ── */
const FOOT = {
  pl: { tagline: "Automatyzacja i porządek w danych dla MŚP · Polska / USA", note: "© 2026 Klarow · strona robocza v0.3" },
  en: { tagline: "Automation and order in SME data · Poland / USA", note: "© 2026 Klarow · working draft v0.3" },
};

function Footer() {
  const { lang } = useLang();
  const t = pick(lang, FOOT);
  return (
    <footer
      id="kontakt"
      className="border-t"
      style={{ borderColor: "var(--border)", background: "var(--background)" }}
    >
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center sm:items-start gap-2">
          <span className="brand-word" style={{ fontSize: 14 }}>KLAROW</span>
          <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{t.tagline}</p>
        </div>
        <div className="flex flex-col items-center sm:items-end gap-2">
          <a className="text-sm font-bold inline-flex items-center gap-2" style={{ color: "var(--accent-foreground)" }} href={PHONE_HREF}>
            <Phone size={14} /> {PHONE_DISPLAY}
          </a>
          <a className="text-sm font-bold" style={{ color: "var(--accent-foreground)" }} href="mailto:kontakt@klarow.com">
            kontakt@klarow.com
          </a>
          <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{t.note}</p>
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
      {/* tło CAŁEJ strony: matryca kropek (shader, lazy) + przygaszenie pod treść */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
        <Suspense fallback={null}>
          <CanvasRevealEffect
            animationSpeed={3}
            containerClassName="bg-[#121212]"
            colors={[STEEL_BRIGHT, STEEL]}
            dotSize={6}
            showGradient={false}
          />
        </Suspense>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(18,18,18,0.9)_0%,_rgba(18,18,18,0.55)_60%,_transparent_100%)]" />
      </div>

      <div className="relative z-10">
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
    </div>
  );
}
