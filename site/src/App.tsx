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
  Mail,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import BookingModal, { PHONE_DISPLAY, PHONE_HREF } from "@/components/BookingModal";
import CollaborationFlow from "@/components/CollaborationFlow";
import Differentiators from "@/components/Differentiators";
import Faq from "@/components/Faq";
import ToolsGrid from "@/components/ToolsGrid";
import SlideDeck, { type SlideDef } from "@/components/SlideDeck";
import Seo, { ORG_JSONLD } from "@/components/Seo";
import ToolPage from "@/pages/ToolPage";
import { useLang, pick } from "@/i18n";

/* Landing Klarow v0.6 — motion-graphic deck, dark-only, PL/EN. Strona jest
   STATYCZNA (zero scrolla dokumentu): gest scrolla / swipe / klawiatura
   przełącza sekcje-slajdy (SlideDeck) z przejściem zoom+fade; tło GLSL Hills
   (warstwa fixed pod całością, lazy chunk z three.js) robi zoom w głąb wraz
   z kolejnymi slajdami. Kolejność: hero (+szybka nawigacja) → ból → moduły
   (oś problemowa) → wyróżniki → współpraca → jak → dowód → dla kogo →
   oferta → FAQ → kontakt/stopka. Komponenty i tokeny: kit company-ui. */

const GLSLHills = lazy(() =>
  import("@/components/ui/glsl-hills").then((m) => ({ default: m.GLSLHills }))
);

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
      { id: "narzedzia", label: "Narzędzia" },
      { id: "wyrozniki", label: "Wyróżniki" },
      { id: "wspolpraca", label: "Współpraca" },
      { id: "oferta", label: "Oferta" },
      { id: "faq", label: "FAQ" },
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
      { id: "narzedzia", label: "Tools" },
      { id: "wyrozniki", label: "Differentiators" },
      { id: "wspolpraca", label: "How we work" },
      { id: "oferta", label: "Offer" },
      { id: "faq", label: "FAQ" },
    ],
  },
};

function Hero({ onBook, onGoTo }: { onBook: () => void; onGoTo: (id: string) => void }) {
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
        <button className="btn btn-secondary" type="button" onClick={() => onGoTo("narzedzia")}>
          {t.ctaModules}
        </button>
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
      {/* szybka nawigacja — deck „przezoomowuje" wprost do sekcji */}
      <div className="mt-7 flex flex-wrap items-center justify-center gap-2 max-w-2xl">
        {t.quickNav.map((q) => (
          <button key={q.id} className="btn btn-secondary btn-sm" type="button" onClick={() => onGoTo(q.id)}>
            {q.label}
          </button>
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

/* ── NARZĘDZIA (interaktywne dashboardy — w budowie) ── */
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

/* ── OFERTA (skondensowana: pilot + dlaczego-dni + zaufanie + dla-kogo;
      trzy dawne slajdy złożone do jednego — decyzja Karola 2026-07-22) ── */
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

/* ── STOPKA ── */
const FOOT = {
  pl: { tagline: "Automatyzacja i porządek w danych dla MŚP · Polska / USA", note: "© 2026 Klarow · strona robocza v0.7" },
  en: { tagline: "Automation and order in SME data · Poland / USA", note: "© 2026 Klarow · working draft v0.7" },
};

const EMAIL = "kontakt@klarow.com";

/* pełna stopka — dla podstron narzędzi/modułów (normalny scroll dokumentu) */
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
          <a className="text-sm font-bold" style={{ color: "var(--accent-foreground)" }} href={`mailto:${EMAIL}`}>
            {EMAIL}
          </a>
          <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{t.note}</p>
        </div>
      </div>
    </footer>
  );
}

/* stała, slim stopka landingu (deck) — kontakt ZAWSZE widoczny na dole ekranu */
function FooterBar() {
  const { lang } = useLang();
  const t = pick(lang, FOOT);
  return (
    <footer className="deck-footer" aria-label={lang === "pl" ? "Stopka i kontakt" : "Footer and contact"}>
      <div className="deck-footer-inner">
        <div className="deck-footer-brand">
          <span className="brand-word" style={{ fontSize: 12 }}>KLAROW</span>
          <span className="deck-footer-tag">{t.tagline}</span>
        </div>
        <div className="deck-footer-contact">
          <a href={PHONE_HREF}>
            <Phone size={13} style={{ color: "var(--primary)" }} /> {PHONE_DISPLAY}
          </a>
          <a href={`mailto:${EMAIL}`} className="deck-footer-email">
            <Mail size={13} style={{ color: "var(--primary)" }} /> {EMAIL}
          </a>
        </div>
      </div>
    </footer>
  );
}

/* ── DECK: kolejność slajdów + mapowanie hash ↔ slajd ── */
const SLIDES: { id: string; label: { pl: string; en: string } }[] = [
  { id: "start", label: { pl: "Start", en: "Start" } },
  { id: "bol", label: { pl: "Znasz to?", en: "Sound familiar?" } },
  { id: "narzedzia", label: { pl: "Narzędzia", en: "Tools" } },
  { id: "wyrozniki", label: { pl: "Wyróżniki", en: "Differentiators" } },
  { id: "wspolpraca", label: { pl: "Współpraca", en: "How we work" } },
  { id: "oferta", label: { pl: "Oferta", en: "Offer" } },
  { id: "faq", label: { pl: "FAQ", en: "FAQ" } },
];

/* aliasy starych/pomocniczych hashy → indeks slajdu */
const HASH_ALIAS: Record<string, string> = {
  moduly: "narzedzia",
  kontakt: "oferta",
  demo: "narzedzia",
  dowod: "narzedzia", // sekcja Dowód złożona do nagłówka Narzędzi (2026-07-22)
  jak: "oferta", // „Dlaczego dni" + „Dla kogo" skondensowane w Ofercie (2026-07-22)
  "dla-kogo": "oferta",
};

const slideIndexFromHash = (hash: string): number => {
  const raw = hash.replace(/^#/, "");
  const id = HASH_ALIAS[raw] ?? raw;
  const i = SLIDES.findIndex((s) => s.id === id);
  return i >= 0 ? i : 0;
};

/* zoom tła per slajd — każdy krok w głąb strony przybliża wzgórza */
const ZOOM_STEP = 0.09;

function Landing({
  onBook,
  zoomRef,
}: {
  onBook: () => void;
  zoomRef: React.MutableRefObject<number>;
}) {
  const { lang } = useLang();
  const { hash } = useLocation();
  const [active, setActive] = useState(() => slideIndexFromHash(window.location.hash));

  /* nawigacja hashem (navbar, powrót z podstrony modułu) */
  useEffect(() => {
    if (hash) setActive(slideIndexFromHash(hash));
  }, [hash]);

  /* KLAROW w navbarze → powrót na pierwszy slajd (gdy już jesteśmy na landingu) */
  useEffect(() => {
    const home = () => setActive(0);
    window.addEventListener("klarow:home", home);
    return () => window.removeEventListener("klarow:home", home);
  }, []);

  /* slajd → zoom tła + hash w pasku adresu (replaceState — bez śmiecenia historią) */
  useEffect(() => {
    zoomRef.current = 1 + active * ZOOM_STEP;
    const id = SLIDES[active].id;
    const want = id === "start" ? "" : `#${id}`;
    if (window.location.hash !== want) {
      history.replaceState(null, "", want === "" ? window.location.pathname : want);
    }
  }, [active, zoomRef]);

  /* przy wyjściu z landingu (podstrony modułów scrollują się normalnie) */
  useEffect(() => {
    return () => {
      zoomRef.current = 1;
    };
  }, [zoomRef]);

  const goTo = (id: string) => {
    const i = SLIDES.findIndex((s) => s.id === id);
    if (i >= 0) setActive(i);
  };

  const nodes: React.ReactNode[] = [
    <Hero onBook={onBook} onGoTo={goTo} />,
    <Pain />,
    <Tools />,
    <DiffSection />,
    <Collaboration />,
    <OfferSection onBook={onBook} />,
    <FaqSection />,
  ];

  const slides: SlideDef[] = SLIDES.map((s, i) => ({
    id: s.id,
    label: pick(lang, s.label),
    node: nodes[i],
  }));

  return (
    <>
      <Seo
        title={
          lang === "pl"
            ? "Klarow — automatyzacja danych i narzędzia kontrolingu. Wdrożenie w dni."
            : "Klarow — data automation and controlling tools. Deployed in days."
        }
        description={
          lang === "pl"
            ? "Porządek w danych dla firm 20–250 osób, które wyrosły na Excelu. Działające demo narzędzi: raport zarządczy, kontroling kosztów, audyt jakości danych, importy ERP, płatności. Dane zostają u Ciebie (on-premise)."
            : "Order in the data of 20–250-person companies that grew up on Excel. Live tool demos: board report, cost controlling, data quality audit, ERP imports, payments. Your data stays with you (on-premise)."
        }
        path="/"
        jsonLd={ORG_JSONLD}
      />
      <SlideDeck
        slides={slides}
        active={active}
        onNavigate={setActive}
        dotsLabel={lang === "pl" ? "Nawigacja sekcji" : "Section navigation"}
      />
      <FooterBar />
    </>
  );
}

export default function App() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const onBook = () => setBookingOpen(true);
  /* docelowy zoom tła — mutowany przez Landing, czytany przez pętlę GLSL Hills */
  const zoomRef = useRef(1);

  return (
    <div style={{ background: "var(--body-bg)" }}>
      {/* tło CAŁEJ strony: GLSL Hills (lazy chunk z three.js), spowolnione.
          isolation + z-index: warstwa canvasa (GPU) nie może wyskoczyć ponad
          treść nawet na kapryśnych mobilnych kompozytorach */}
      <div
        className="fixed inset-0 z-0 pointer-events-none bg-[#121212]"
        style={{ top: 0, right: 0, bottom: 0, left: 0, isolation: "isolate" }}
        aria-hidden="true"
      >
        <Suspense fallback={null}>
          <GLSLHills width="100%" height="100%" speed={0.2} zoomRef={zoomRef} />
        </Suspense>
      </div>

      <div className="relative z-10">
        <Navbar onBook={onBook} />
        <Routes>
          <Route path="/" element={<Landing onBook={onBook} zoomRef={zoomRef} />} />
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
