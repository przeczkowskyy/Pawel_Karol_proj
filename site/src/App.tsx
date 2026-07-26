import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
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
import BgBoundary from "@/components/BgBoundary";
import BookingModal, { PHONE_DISPLAY, PHONE_HREF } from "@/components/BookingModal";
import CollaborationFlow from "@/components/CollaborationFlow";
import Differentiators from "@/components/Differentiators";
import Faq from "@/components/Faq";
import ToolsGrid from "@/components/ToolsGrid";
import Seo, { ORG_JSONLD, faqPageJsonLd } from "@/components/Seo";
import ToolPage from "@/pages/ToolPage";
import { useLang, pick } from "@/i18n";
import { FAQ_I18N } from "@/data/faq";
import { PAGES_SEO } from "@/data/pagesSeo";

/* Landing Klarow — dark-only, PL/EN. Zwykłe podstrony ze standardowym scrollem
   (react-router): / (home) · /narzedzia (hub) · /oferta · /faq · /narzedzia/:slug.
   Każda trasa = własne SEO (title/description/canonical/JSON-LD + prerenderowany
   HTML). Dawny „motion-graphic deck" (slajdy przełączane gestem) usunięty
   2026-07-26 — rozbicie na trasy o odrębnej intencji jest lepsze pod SEO.
   Tło całej strony: GLSL Hills (desktop) / stalowy gradient (mobile). */

const GLSLHills = lazy(() =>
  import("@/components/ui/glsl-hills").then((m) => ({ default: m.GLSLHills }))
);

/* Czy renderować ozdobne tło WebGL (animowane wzgórza).
   NIE na urządzeniach dotykowych (telefony/tablety): iOS Safari potrafi
   błędnie skomponować pełnoekranowy `position:fixed` <canvas> WebGL NAD
   warstwą treści — cała treść znika i zostaje „samo tło" (nawracający bug
   klarow.com na iPhone, diagnoza 2026-07-24). Na mobile zostaje statyczny
   stalowy gradient .bg-layer (zaprojektowany fallback). Desktop (fine pointer)
   dostaje pełne animowane wzgórza. SSR/prerender: false (brak window). */
function useAnimatedBg(): boolean {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    setEnabled(!coarse);
  }, []);
  return enabled;
}

function Section({
  title,
  sub,
  children,
}: {
  title: string;
  sub?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="max-w-6xl mx-auto px-6 py-8 w-full">
      <h2 className="text-[26px] md:text-[30px] font-extrabold tracking-tight" style={{ color: "var(--heading)" }}>
        {title}
      </h2>
      {sub ? (
        <p className="mt-2 mb-7 max-w-3xl text-[15px]" style={{ color: "var(--muted-foreground)" }}>
          {sub}
        </p>
      ) : (
        <div className="mb-7" />
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
    ctaModules: "Zobacz narzędzia",
    qualifier: "Dla firm 20–250 osób · środowisko Windows + Excel · narzędzia działają on-premise, u Ciebie",
    quickNav: [
      { to: "/narzedzia", label: "Narzędzia" },
      { to: "/oferta", label: "Oferta" },
      { to: "/faq", label: "FAQ" },
    ],
  },
  en: {
    h1a: "Order in the data of companies",
    h1b: "that grew up on Excel.",
    lead1: "We turn manual copy-pasting, fragile macros and email-driven document flows into auditable tools. ",
    leadStrong: "Deployed in days, not months",
    lead2: " — and your data never leaves your company.",
    proof: "A board report in seconds instead of hours.",
    ctaMain: "Book a free diagnosis",
    ctaModules: "See the tools",
    qualifier: "For companies of 20–250 people · Windows + Excel environment · tools run on-premise, at your site",
    quickNav: [
      { to: "/narzedzia", label: "Tools" },
      { to: "/oferta", label: "Offer" },
      { to: "/faq", label: "FAQ" },
    ],
  },
};

function Hero({ onBook }: { onBook: () => void }) {
  const { lang } = useLang();
  const t = pick(lang, HERO);
  return (
    <div className="flex flex-col items-center text-center px-6">
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
        <Link className="btn btn-secondary" to="/narzedzia">
          {t.ctaModules}
        </Link>
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
      {/* szybka nawigacja do głównych podstron */}
      <div className="mt-7 flex flex-wrap items-center justify-center gap-2 max-w-2xl">
        {t.quickNav.map((q) => (
          <Link key={q.to} className="btn btn-secondary btn-sm" to={q.to}>
            {q.label}
          </Link>
        ))}
      </div>
    </div>
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

/* ── NARZĘDZIA (interaktywne dashboardy) ── */
const TOOLS_TXT = {
  pl: {
    title: "Narzędzia — wybierz dział i korzystaj",
    sub: "Wszystkie nasze narzędzia działają na tej stronie na żywo, na danych przykładowych: klikasz, liczysz, pobierasz dokumenty — dokładnie tak, jak u klienta (lokalnie, bez chmury, bez logowania). Wybierz dział, żeby zobaczyć narzędzia.",
    proof:
      "Zrobiliśmy to już od środka: ekosystem kilkunastu takich narzędzi zbudowaliśmy dla firmy produkcyjno-budowlanej (~30 równoległych projektów, klienci w USA) — ~10 000 wierszy kosztów z ERP miesięcznie, raport zarządczy w kilkanaście sekund zamiast godzin, zamknięcie ~30 projektów jednym przyciskiem i kontrola sum co do grosza.",
  },
  en: {
    title: "Tools — pick a department and use them",
    sub: "All our tools run live on this page, on sample data: click, compute, download documents — exactly like at the client (locally, no cloud, no sign-up). Pick a department to see the tools.",
    proof:
      "We've already done this from the inside: we built an ecosystem of a dozen-plus such tools for a manufacturing-and-construction company (~30 parallel projects, US clients) — ~10,000 ERP cost rows a month, a board report in seconds instead of hours, ~30 projects closed with one click and totals controlled to the cent.",
  },
};

function Tools() {
  const { lang } = useLang();
  const t = pick(lang, TOOLS_TXT);
  return (
    <Section title={t.title} sub={t.sub}>
      <p
        className="mb-6 max-w-3xl text-[13px] leading-relaxed -mt-3"
        style={{ color: "var(--accent-foreground)" }}
      >
        {t.proof}
      </p>
      <ToolsGrid />
    </Section>
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
    <Section title={t.title} sub={t.sub}>
      <CollaborationFlow />
    </Section>
  );
}

/* ── WYRÓŻNIKI (zero chmury + determinizm) ── */
const DIFF_TXT = {
  pl: {
    title: "Dwa twarde wyróżniki: zero chmury i zero wróżenia",
    sub: "„On-premise” deklaruje dziś każdy. My idziemy krok dalej — narzędzie nie ma nawet którędy wysłać Twoich danych, a każdą liczbę możesz policzyć ręcznie.",
  },
  en: {
    title: "Two hard differentiators: zero cloud, zero fortune-telling",
    sub: "Everyone claims “on-premise” these days. We go one step further — the tool has no way to send your data anywhere, and you can verify every number by hand.",
  },
};

function DiffSection() {
  const { lang } = useLang();
  const t = pick(lang, DIFF_TXT);
  return (
    <Section title={t.title} sub={t.sub}>
      <Differentiators />
    </Section>
  );
}

/* ── OFERTA (skondensowana: pilot + dlaczego-dni + zaufanie + dla-kogo) ── */
const OFFER = {
  pl: {
    title: "Oferta: Pilot na kopii — efekt w dni, nie w miesiące",
    sub: "Jeden proces, stała cena, ≤10 dni roboczych. Wszystko, co musisz wiedzieć, na jednym ekranie: jak pracujemy, na czym stoi zaufanie i czy będzie nam po drodze.",
    offerTag: "OFERTA WEJŚCIOWA",
    offerTitle: "Pilot na kopii",
    offerBody1: "Budujemy na kopii Twoich plików, pierwszy namacalny efekt (raport błędów z Twoich prawdziwych danych) widzisz ",
    offerStrong: "w dniu 5",
    offerBody2: ". Zapis na oryginałach — dopiero po Twojej akceptacji.",
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
    whyHead: "Dlaczego dni, nie miesiące",
    why: [
      { icon: Copy, text: "Diagnoza na kopiach Twoich plików — zakres zamrożony na piśmie w Dniu 0" },
      { icon: FileCode2, text: "Budowa na gotowych wzorcach — silnik (zapis, walidacja, backup, log) już istnieje" },
      { icon: Eye, text: "TEST bez zapisu: pełna lista zmian do przejrzenia, w Twoich plikach nic się nie dzieje" },
      { icon: Save, text: "PROD po Twojej akceptacji — backup przed każdą zmianą i log audytowy operacji" },
    ],
    trustHead: "Zaufanie na mechanizmach, nie przymiotnikach",
    trust: [
      { icon: Lock, text: "On-premise: dane nie opuszczają firmy; po wdrożeniu nie mamy do nich dostępu" },
      { icon: ScrollText, text: "Kod, dokumentacja i runbook zostają u Ciebie — narzędzie działa nawet bez nas" },
      { icon: ShieldCheck, text: "Stała cena i zakres na piśmie; druga rata po działającym odbiorze" },
    ],
    yesHead: "Będzie nam po drodze",
    noHead: "Uczciwie: to nie dla Ciebie",
    yes: [
      "Produkcja / budownictwo / dystrybucja, 20–250 osób, Windows + Excel",
      "Raportowanie i tak żyje w Excelu, a Ty chcesz efektu w dni",
    ],
    no: [
      "Migracja do chmury / zamiana ERP — tego nie robimy",
      "Google Sheets / Mac · body-leasing — sprzedajemy rezultat, nie godziny",
    ],
  },
  en: {
    title: "The offer: Pilot on a copy — results in days, not months",
    sub: "One process, a fixed price, ≤10 business days. Everything you need to know on one screen: how we work, what the trust stands on and whether we're a fit.",
    offerTag: "ENTRY OFFER",
    offerTitle: "Pilot on a copy",
    offerBody1: "We build on a copy of your files; you see the first tangible result (an error report from your real data) ",
    offerStrong: "on day 5",
    offerBody2: ". Writes to the originals — only after your approval.",
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
    whyHead: "Why days, not months",
    why: [
      { icon: Copy, text: "Diagnosis on copies of your files — scope frozen in writing on Day 0" },
      { icon: FileCode2, text: "Built on ready patterns — the engine (writes, validation, backup, log) already exists" },
      { icon: Eye, text: "TEST without writing: a full change list to review, nothing happens in your files" },
      { icon: Save, text: "PROD after your approval — a backup before every change and an audit log" },
    ],
    trustHead: "Trust built on mechanisms, not adjectives",
    trust: [
      { icon: Lock, text: "On-premise: data never leaves your company; we have no access after deployment" },
      { icon: ScrollText, text: "Code, documentation and runbook stay with you — the tool works even without us" },
      { icon: ShieldCheck, text: "Fixed price and scope in writing; second instalment after a working handover" },
    ],
    yesHead: "We'll get along",
    noHead: "Honestly: not for you",
    yes: [
      "Manufacturing / construction / distribution, 20–250 people, Windows + Excel",
      "Reporting lives in Excel anyway and you want results in days",
    ],
    no: [
      "Cloud migration / ERP replacement — we don't do that",
      "Google Sheets / Mac · body-leasing — we sell results, not hours",
    ],
  },
};

function OfferSection({ onBook }: { onBook: () => void }) {
  const { lang } = useLang();
  const t = pick(lang, OFFER);
  return (
    <Section title={t.title} sub={t.sub}>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-start">
        {/* karta oferty z CTA */}
        <div className="card lg:col-span-2" style={{ padding: 24 }}>
          <span className="st st-accent">{t.offerTag}</span>
          <h3 className="mt-3 text-[21px] font-extrabold" style={{ color: "var(--heading)" }}>{t.offerTitle}</h3>
          <p className="mt-3 text-[13.5px] leading-relaxed" style={{ color: "var(--foreground)" }}>
            {t.offerBody1}
            <strong>{t.offerStrong}</strong>
            {t.offerBody2}
          </p>
          <ul className="mt-3 flex flex-col gap-1.5 text-[12.5px]" style={{ color: "var(--muted-foreground)" }}>
            {t.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap gap-3">
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

        {/* skondensowane: dlaczego dni + zaufanie + dla kogo */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="card" style={{ padding: 18 }}>
            <div className="lbl-sm" style={{ marginBottom: 10 }}>{t.whyHead}</div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2.5">
              {t.why.map((x, i) => (
                <li key={i} className="flex items-start gap-2 text-[12.5px]" style={{ color: "var(--foreground)" }}>
                  <x.icon size={14} style={{ color: "var(--primary)", flex: "0 0 auto", marginTop: 2 }} />
                  {x.text}
                </li>
              ))}
            </ul>
          </div>

          <div className="card" style={{ padding: 18 }}>
            <div className="lbl-sm" style={{ marginBottom: 10 }}>{t.trustHead}</div>
            <ul className="flex flex-col gap-2.5">
              {t.trust.map((x, i) => (
                <li key={i} className="flex items-start gap-2 text-[12.5px]" style={{ color: "var(--foreground)" }}>
                  <x.icon size={14} style={{ color: "var(--primary)", flex: "0 0 auto", marginTop: 2 }} />
                  {x.text}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="card" style={{ padding: 18 }}>
              <div className="lbl-sm" style={{ marginBottom: 10 }}>{t.yesHead}</div>
              <ul className="flex flex-col gap-2.5">
                {t.yes.map((x) => (
                  <li key={x} className="flex items-start gap-2 text-[12.5px]" style={{ color: "var(--foreground)" }}>
                    <Check size={14} style={{ color: "var(--funded)", flex: "0 0 auto", marginTop: 2 }} />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card" style={{ padding: 18 }}>
              <div className="lbl-sm" style={{ marginBottom: 10 }}>{t.noHead}</div>
              <ul className="flex flex-col gap-2.5">
                {t.no.map((x) => (
                  <li key={x} className="flex items-start gap-2 text-[12.5px]" style={{ color: "var(--muted-foreground)" }}>
                    <XIcon size={14} style={{ color: "var(--rejected)", flex: "0 0 auto", marginTop: 2 }} />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          </div>
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
    <Section title={t.title} sub={t.sub}>
      <div className="max-w-3xl">
        <Faq />
      </div>
    </Section>
  );
}

/* ── „Zobacz też" — crosslinki z home do głównych podstron (SEO wewnętrzne + UX) ── */
const HOME_NEXT = {
  pl: {
    title: "Zobacz konkrety",
    open: "Otwórz →",
    items: [
      { to: "/narzedzia", h: "Narzędzia", d: "12 działających demo — kliknij, policz, pobierz dokument. Bez logowania, bez chmury." },
      { to: "/oferta", h: "Oferta: Pilot na kopii", d: "Jeden proces, stała cena, efekt w dni. Budujemy na kopii Twoich plików." },
      { to: "/faq", h: "Najczęstsze pytania", d: "Bezpieczeństwo danych, koszt, zgodność z ERP, los działających makr — wprost." },
    ],
  },
  en: {
    title: "See the specifics",
    open: "Open →",
    items: [
      { to: "/narzedzia", h: "Tools", d: "12 live demos — click, compute, download a document. No sign-up, no cloud." },
      { to: "/oferta", h: "Offer: Pilot on a copy", d: "One process, a fixed price, results in days. We build on a copy of your files." },
      { to: "/faq", h: "Common questions", d: "Data security, cost, ERP compatibility, the fate of existing macros — head-on." },
    ],
  },
};

function HomeNext() {
  const { lang } = useLang();
  const t = pick(lang, HOME_NEXT);
  return (
    <Section title={t.title}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {t.items.map((x) => (
          <Link key={x.to} to={x.to} className="card" style={{ display: "block" }}>
            <h3 className="text-[15px] font-bold" style={{ color: "var(--heading)" }}>{x.h}</h3>
            <p className="mt-2 text-[13px] leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{x.d}</p>
            <span className="mt-3 inline-block text-[12.5px] font-bold" style={{ color: "var(--accent-foreground)" }}>
              {t.open}
            </span>
          </Link>
        ))}
      </div>
    </Section>
  );
}

/* ── STOPKA ── */
const FOOT = {
  pl: { tagline: "Automatyzacja i porządek w danych dla MŚP · Polska / USA", note: "© 2026 Klarow · strona robocza v0.8" },
  en: { tagline: "Automation and order in SME data · Poland / USA", note: "© 2026 Klarow · working draft v0.8" },
};

const EMAIL = "kontakt@klarow.com";

const FOOT_NAV = {
  pl: [
    { to: "/narzedzia", label: "Narzędzia" },
    { to: "/oferta", label: "Oferta" },
    { to: "/faq", label: "FAQ" },
  ],
  en: [
    { to: "/narzedzia", label: "Tools" },
    { to: "/oferta", label: "Offer" },
    { to: "/faq", label: "FAQ" },
  ],
};

/* pełna stopka — kontakt + nawigacja, na każdej podstronie (normalny scroll) */
function Footer() {
  const { lang } = useLang();
  const t = pick(lang, FOOT);
  const nav = pick(lang, FOOT_NAV);
  return (
    <footer
      id="kontakt"
      className="border-t"
      style={{ borderColor: "var(--border)", background: "var(--background)" }}
    >
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center sm:items-start gap-2">
          <Link to="/" className="brand-word" style={{ fontSize: 14 }}>KLAROW</Link>
          <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{t.tagline}</p>
          <nav className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} className="text-xs font-bold" style={{ color: "var(--muted-foreground)" }}>
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-col items-center sm:items-end gap-2">
          <a className="text-sm font-bold inline-flex items-center gap-2" style={{ color: "var(--accent-foreground)" }} href={PHONE_HREF}>
            <Phone size={14} /> {PHONE_DISPLAY}
          </a>
          <a className="text-sm font-bold" style={{ color: "var(--accent-foreground)" }} href={`mailto:${EMAIL}`}>
            {EMAIL}
          </a>
          <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{t.note}</p>
        </div>
      </div>
    </footer>
  );
}

/* wspólny padding górny podstron (pod pływającym navbarem) */
function PageMain({ children }: { children: React.ReactNode }) {
  return <div style={{ paddingTop: 96 }}>{children}</div>;
}

/* ── PODSTRONY ── */

function HomePage({ onBook }: { onBook: () => void }) {
  const { lang } = useLang();
  return (
    <>
      <Seo
        title={pick(lang, PAGES_SEO.home.title)}
        description={pick(lang, PAGES_SEO.home.description)}
        path="/"
        jsonLd={[ORG_JSONLD]}
      />
      <PageMain>
        <div className="pb-4">
          <Hero onBook={onBook} />
        </div>
        <Pain />
        <div id="wyrozniki">
          <DiffSection />
        </div>
        <HomeNext />
      </PageMain>
      <Footer />
    </>
  );
}

function ToolsPage() {
  const { lang } = useLang();
  return (
    <>
      <Seo
        title={pick(lang, PAGES_SEO.tools.title)}
        description={pick(lang, PAGES_SEO.tools.description)}
        path="/narzedzia"
        jsonLd={[ORG_JSONLD]}
      />
      <PageMain>
        <Tools />
      </PageMain>
      <Footer />
    </>
  );
}

function OfferPage({ onBook }: { onBook: () => void }) {
  const { lang } = useLang();
  return (
    <>
      <Seo
        title={pick(lang, PAGES_SEO.oferta.title)}
        description={pick(lang, PAGES_SEO.oferta.description)}
        path="/oferta"
        jsonLd={[ORG_JSONLD]}
      />
      <PageMain>
        <OfferSection onBook={onBook} />
        <div id="wspolpraca">
          <Collaboration />
        </div>
      </PageMain>
      <Footer />
    </>
  );
}

function FaqPage() {
  const { lang } = useLang();
  return (
    <>
      <Seo
        title={pick(lang, PAGES_SEO.faq.title)}
        description={pick(lang, PAGES_SEO.faq.description)}
        path="/faq"
        jsonLd={[faqPageJsonLd(pick(lang, FAQ_I18N))]}
      />
      <PageMain>
        <FaqSection />
      </PageMain>
      <Footer />
    </>
  );
}

/* każda zmiana trasy → scroll na górę (react-router nie robi tego sam) */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const onBook = () => setBookingOpen(true);
  /* zoom tła — stały (bez decka nie ma per-slajd zoomu); pętla GLSL i tak czyta ref */
  const zoomRef = useRef(1);
  /* animowane tło WebGL tylko na desktopie — na mobile statyczny gradient .bg-layer */
  const animatedBg = useAnimatedBg();

  return (
    <div style={{ background: "var(--body-bg)" }}>
      {/* tło CAŁEJ strony: GLSL Hills (lazy chunk z three.js), spowolnione.
          .bg-layer/.content-layer = czysty CSS (globals). Na urządzeniach
          dotykowych canvas WebGL się NIE renderuje (bug iOS) — zostaje gradient. */}
      <div className="bg-layer" aria-hidden="true">
        {animatedBg && (
          <BgBoundary>
            <Suspense fallback={null}>
              <GLSLHills width="100%" height="100%" speed={0.2} zoomRef={zoomRef} />
            </Suspense>
          </BgBoundary>
        )}
      </div>

      <div className="content-layer">
        <ScrollToTop />
        <Navbar onBook={onBook} />
        <Routes>
          <Route path="/" element={<HomePage onBook={onBook} />} />
          <Route path="/narzedzia" element={<ToolsPage />} />
          <Route path="/oferta" element={<OfferPage onBook={onBook} />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route
            path="/narzedzia/:slug"
            element={
              <>
                <ToolPage onBook={onBook} />
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
