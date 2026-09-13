import { lazy, Suspense, useEffect, useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import {
  ShieldCheck,
  Copy,
  Eye,
  Save,
  Lock,
  FileCode2,
  ScrollText,
  Check,
  X as XIcon,
  Phone,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import BgBoundary from "@/components/BgBoundary";
import CollaborationFlow from "@/components/CollaborationFlow";
import Faq from "@/components/Faq";
import ToolsGrid from "@/components/ToolsGrid";
import Seo, { ORG_JSONLD, faqPageJsonLd } from "@/components/Seo";
import { useLang, pick } from "@/i18n";
import { FAQ_I18N } from "@/data/faq";
import { NOT_FOUND_COPY, PAGES_SEO, SKIP_LINK } from "@/data/pagesSeo";
import { RODO, type RodoObjection, type RodoSection } from "@/data/rodo";
import { EMAIL, MAIL_HREF, PHONE_DISPLAY, PHONE_HREF } from "@/data/contact";

/* Landing Klarow: dark-only, PL/EN. Zwykłe podstrony ze standardowym scrollem
   (react-router): / (home) · /narzedzia (hub) · /oferta · /faq · /narzedzia/:slug.
   Każda trasa = własne SEO (title/description/canonical/JSON-LD + prerenderowany
   HTML). Dawny „motion-graphic deck” (slajdy przełączane gestem) usunięty
   2026-07-26: rozbicie na trasy o odrębnej intencji jest lepsze pod SEO.
   Tło całej strony: GLSL Hills (desktop) / stalowy gradient (mobile). */

const GLSLHills = lazy(() =>
  import("@/components/ui/glsl-hills").then((m) => ({ default: m.GLSLHills }))
);

/* Chunk krytyczny strony głównej nie płaci za kod, którego home nie renderuje
   (reguły perf-js-budget-home i code-lazy-routes-and-dashboards):
   - podstrona narzędzia wchodzi dopiero przy wejściu na /narzedzia/:slug,
   - okno rezerwacji dopiero po kliknięciu „Umów rozmowę”.
   Ścieżki literalne, inaczej Rollup nie zrobi z nich osobnych chunków. */
const ToolPage = lazy(() => import("@/pages/ToolPage"));
const Presentation = lazy(() => import("@/pages/Presentation"));
const BookingModal = lazy(() => import("@/components/BookingModal"));

/* Czy renderować ozdobne tło WebGL (animowane wzgórza).
   NIE na urządzeniach dotykowych (telefony/tablety): iOS Safari potrafi
   błędnie skomponować pełnoekranowy `position:fixed` <canvas> WebGL NAD
   warstwą treści, przez co cała treść znika i zostaje „samo tło” (nawracający bug
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

/* Pierwsza sekcja podstrony renderuje tytuł jako H1 (`as="h1"`): prerenderowany
   shell ma H1, więc bez tego po starcie Reacta zostawała strona bez nagłówka
   pierwszego poziomu (reguła a11y-headings-order-one-h1; złapane zrzutami
   WebKit na /narzedzia, /oferta i /faq). Wygląd bez zmian: te same klasy. */
function Section({
  title,
  sub,
  children,
  as = "h2",
}: {
  title: string;
  sub?: string;
  children: React.ReactNode;
  as?: "h1" | "h2";
}) {
  const Heading = as;
  return (
    <section className="max-w-6xl mx-auto px-6 py-8 w-full">
      <Heading className="text-[26px] md:text-[30px] font-extrabold tracking-tight" style={{ color: "var(--heading)" }}>
        {title}
      </Heading>
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

/* ── CO MOŻEMY ZBUDOWAĆ (breadth: kafle ikonowe, nie zamknięte menu) ── */


/* ── DOWÓD (pasek statystyk: „co już zrobiliśmy”, liczby anonimowe) ── */


/* ── BÓL ── */


/* ── NARZĘDZIA (interaktywne dashboardy) ── */
const TOOLS_TXT = {
  pl: {
    title: "Przykłady realizacji: kliknij i sprawdź",
    sub: "Próbki tego, co zbudowaliśmy. To nie jest pełna lista: Twoje narzędzie robimy pod Twój proces.",
    proof: "Większość odpalisz na żywo; część to wdrożenia u klienta (np. KSeF). Dane fikcyjne.",
  },
  en: {
    title: "Examples of what we've built: click and try",
    sub: "Samples of what we've built. Not a full list: we build your tool around your process.",
    proof: "Most run live; some are client deployments (e.g. KSeF). Fictional data.",
  },
};

function Tools() {
  const { lang } = useLang();
  const t = pick(lang, TOOLS_TXT);
  return (
    <Section as="h1" title={t.title} sub={t.sub}>
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
    title: "Jak wygląda współpraca: schemat blokowy",
    sub: "Od pierwszej wiadomości do działającego narzędzia i opieki, z dwiema decyzjami, które zawsze należą do Ciebie.",
  },
  en: {
    title: "How we work together: a flowchart",
    sub: "From the first message to a working tool and ongoing care, with two decisions that are always yours.",
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


/* ── OFERTA (skondensowana: pilot + dlaczego-dni + zaufanie + dla-kogo) ── */
const OFFER = {
  pl: {
    title: "Oferta: pilot na kopii, efekt w dni, nie w miesiące",
    sub: "Zaczynamy pilotem: jeden proces, ≤10 dni roboczych, pierwszy efekt w dniu 5, płatność 50/50. Wycenę ustalamy po bezpłatnej diagnozie: stała cena za zamrożony zakres, bez stawki godzinowej.",
    offerTag: "OFERTA WEJŚCIOWA",
    offerTitle: "Pilot na kopii",
    offerBody1: "Budujemy na kopii Twoich plików, pierwszy namacalny efekt (raport błędów z Twoich prawdziwych danych) widzisz ",
    offerStrong: "w dniu 5",
    offerBody2: ". Zapis na oryginałach dopiero po Twojej akceptacji.",
    bullets: [
      "· Dzień 0: wybór procesu i zamrożenie zakresu (wliczony)",
      "· Dni 1–4: budowa wyłącznie na kopiach",
      "· Dzień 5: pokaz na żywo + raport z Twoich danych",
      "· Płatność 50/50: druga rata po działającym odbiorze",
    ],
    cta: "Umów diagnozę: wybierz termin",
    worst1: "Zanim cokolwiek kupisz: ",
    worstStrong: "przyślij nam swój najgorszy Excel",
    worst2: ". W 30 minut pokażemy na próbce, co da się z nim zrobić.",
    priceNote: "Wyceniamy stałą ceną za ustalony zakres, po bezpłatnej diagnozie, bez stawki godzinowej. Kolejne narzędzia wyceniamy osobno.",
    whyHead: "Dlaczego dni, nie miesiące",
    why: [
      { icon: Copy, text: "Diagnoza na kopiach Twoich plików; zakres zamrożony na piśmie w Dniu 0" },
      { icon: FileCode2, text: "Budowa na gotowych wzorcach: silnik (zapis, walidacja, backup, log) już istnieje" },
      { icon: Eye, text: "TEST bez zapisu: pełna lista zmian do przejrzenia, w Twoich plikach nic się nie dzieje" },
      { icon: Save, text: "PROD po Twojej akceptacji: backup przed każdą zmianą i log audytowy operacji" },
    ],
    trustHead: "Zaufanie na mechanizmach, nie przymiotnikach",
    trust: [
      { icon: Lock, text: "On-premise: dane nie opuszczają firmy; po wdrożeniu nie mamy do nich dostępu" },
      { icon: ScrollText, text: "Kod, dokumentacja i runbook zostają u Ciebie: narzędzie działa nawet bez nas" },
      { icon: ShieldCheck, text: "Stała cena i zakres na piśmie; druga rata po działającym odbiorze" },
    ],
    yesHead: "Będzie nam po drodze",
    noHead: "Uczciwie: to nie dla Ciebie",
    yes: [
      "Produkcja / budownictwo / dystrybucja, 20–250 osób, Windows + Excel",
      "Raportowanie i tak żyje w Excelu, a Ty chcesz efektu w dni",
    ],
    no: [
      "Migracja do chmury / zamiana ERP: tego nie robimy",
      "Google Sheets / Mac · body-leasing: sprzedajemy rezultat, nie godziny",
    ],
  },
  en: {
    title: "The offer: a pilot on a copy, results in days, not months",
    sub: "We start with a pilot: one process, ≤10 business days, first result on day 5, 50/50 payment. We set the price after a free diagnosis: a fixed price for a frozen scope, no hourly rate.",
    offerTag: "ENTRY OFFER",
    offerTitle: "Pilot on a copy",
    offerBody1: "We build on a copy of your files; you see the first tangible result (an error report from your real data) ",
    offerStrong: "on day 5",
    offerBody2: ". Writes to the originals only after your approval.",
    bullets: [
      "· Day 0: process selection and scope freeze (included)",
      "· Days 1–4: building exclusively on copies",
      "· Day 5: live demo + a report from your data",
      "· 50/50 payment: the second instalment after a working handover",
    ],
    cta: "Book a diagnosis: pick a slot",
    worst1: "Before you buy anything: ",
    worstStrong: "send us your worst Excel",
    worst2: ". In 30 minutes we'll show you, on a sample, what can be done with it.",
    priceNote: "We price a fixed fee for a defined scope, after a free diagnosis, with no hourly rate. Additional tools are quoted separately.",
    whyHead: "Why days, not months",
    why: [
      { icon: Copy, text: "Diagnosis on copies of your files; scope frozen in writing on Day 0" },
      { icon: FileCode2, text: "Built on ready patterns: the engine (writes, validation, backup, log) already exists" },
      { icon: Eye, text: "TEST without writing: a full change list to review, nothing happens in your files" },
      { icon: Save, text: "PROD after your approval: a backup before every change and an audit log" },
    ],
    trustHead: "Trust built on mechanisms, not adjectives",
    trust: [
      { icon: Lock, text: "On-premise: data never leaves your company; we have no access after deployment" },
      { icon: ScrollText, text: "Code, documentation and runbook stay with you: the tool works even without us" },
      { icon: ShieldCheck, text: "Fixed price and scope in writing; second instalment after a working handover" },
    ],
    yesHead: "We'll get along",
    noHead: "Honestly: not for you",
    yes: [
      "Manufacturing / construction / distribution, 20–250 people, Windows + Excel",
      "Reporting lives in Excel anyway and you want results in days",
    ],
    no: [
      "Cloud migration / ERP replacement: we don't do that",
      "Google Sheets / Mac · body-leasing: we sell results, not hours",
    ],
  },
};

function OfferSection({ onBook }: { onBook: () => void }) {
  const { lang } = useLang();
  const t = pick(lang, OFFER);
  return (
    <Section as="h1" title={t.title} sub={t.sub}>
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
          <p className="mt-3 text-[12px] font-semibold" style={{ color: "var(--accent-foreground)" }}>
            {t.priceNote}
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
  pl: { title: "Najczęstsze obiekcje: odpowiadamy wprost", sub: "Te same pytania słyszymy w każdej rozmowie. Oto odpowiedzi, zanim zdążysz zapytać." },
  en: { title: "Common objections: answered head-on", sub: "We hear the same questions in every conversation. Here are the answers before you even ask." },
};

function FaqSection() {
  const { lang } = useLang();
  const t = pick(lang, FAQ_TXT);
  return (
    <Section as="h1" title={t.title} sub={t.sub}>
      <div className="max-w-3xl">
        <Faq />
      </div>
    </Section>
  );
}

/* ── „Zobacz też”: crosslinki z home do głównych podstron (SEO wewnętrzne + UX) ── */


/* ── STOPKA ── */
const FOOT = {
  pl: { tagline: "Automatyzacja i porządek w danych dla MŚP · Polska / USA", note: "© 2026 Klarow · strona robocza v0.8" },
  en: { tagline: "Automation and order in SME data · Poland / USA", note: "© 2026 Klarow · working draft v0.8" },
};

/* Link „RODO i prywatność” stoi w stopce na KAŻDEJ trasie: to adres klauzuli
   z art. 14 RODO, do którego odsyła każdy szablon kontaktu (legal-rodo-page-required). */
const FOOT_NAV = {
  pl: [
    { to: "/narzedzia", label: "Narzędzia" },
    { to: "/oferta", label: "Oferta" },
    { to: "/faq", label: "FAQ" },
    { to: "/rodo", label: "RODO i prywatność" },
  ],
  en: [
    { to: "/narzedzia", label: "Tools" },
    { to: "/oferta", label: "Offer" },
    { to: "/faq", label: "FAQ" },
    { to: "/rodo", label: "Privacy and GDPR" },
  ],
};

/* pełna stopka: kontakt + nawigacja, na każdej podstronie (normalny scroll) */
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
          <a className="text-sm font-bold" style={{ color: "var(--accent-foreground)" }} href={MAIL_HREF}>
            {EMAIL}
          </a>
          <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{t.note}</p>
        </div>
      </div>
    </footer>
  );
}

/* Jedyny landmark treści na trasie: <main id="main"> z tabIndex -1, żeby
   Safari przeniosło fokus po skoku ze skip-linku (a11y-main-and-skip-link).
   `pad` wyłącza wspólny padding górny tam, gdzie podstrona ma własny
   (podstrona narzędzia). */
function PageMain({ children, pad = true }: { children: React.ReactNode; pad?: boolean }) {
  return (
    <main id="main" tabIndex={-1} style={pad ? { paddingTop: 96 } : undefined}>
      {children}
    </main>
  );
}

/* Skip-link: pierwszy element w warstwie treści, poza ekranem do czasu
   fokusu (WCAG 2.4.1 Bypass Blocks). Pozycję trzyma stan komponentu, bo
   klasa .skip-link nie ma jeszcze reguł w globals.css; po ich dodaniu
   zostaje sama klasa, bez stylu w locie. */
function SkipLink() {
  const { lang } = useLang();
  const [shown, setShown] = useState(false);
  return (
    <a
      href="#main"
      className="skip-link btn btn-secondary"
      style={{ position: "fixed", left: 16, top: shown ? 16 : -9999, zIndex: 100 }}
      onFocus={() => setShown(true)}
      onBlur={() => setShown(false)}
    >
      {pick(lang, SKIP_LINK)}
    </a>
  );
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
      {/* STRONA GŁÓWNA TO PREZENTACJA (decyzja Karola 2026-09-13): osiem scen
          w jednym ciągu, bez zakładek, bez sekcji do wyboru. Scenariusz:
          docs/plan/prezentacja-scenariusz.md. Hero, kafle i listy zdjęte: ich rolę
          przejęły sceny, bo „za dużo tekstu" padło trzy razy z rzędu.
          Prezentacja wchodzi leniwie: osiem scen z biblioteką ruchu to realne
          obciążenie budżetu pierwszego chunku (perf-js-budget-home). */}
      <PageMain pad={false}>
        <Suspense fallback={<div style={{ minHeight: "100dvh" }} aria-hidden />}>
          <Presentation onBook={onBook} />
        </Suspense>
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

/* ── /rodo ── klauzula z art. 14 RODO i polityka prywatności w jednym
   dokumencie. CAŁA treść pochodzi z src/data/rodo.ts; ten komponent tylko ją
   układa, tak samo jak RodoShell w prerenderze. Trasa ma noindex do przeglądu
   radcy, ale jest publiczna i linkowana ze stopki na każdej podstronie. */

function RodoSectionBlock({ section }: { section: RodoSection }) {
  const { lang } = useLang();
  const body = pick(lang, section.body);
  return (
    <section id={section.id} className="mt-8">
      <h2 className="text-xl font-extrabold tracking-tight" style={{ color: "var(--heading)" }}>
        {pick(lang, section.title)}
      </h2>
      {section.variant === "list" ? (
        <ul className="mt-3 flex flex-col gap-2 text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
          {body.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        body.map((paragraph) => (
          <p key={paragraph} className="mt-3 text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
            {paragraph}
          </p>
        ))
      )}
      {section.note ? (
        <p className="mt-3 text-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
          {pick(lang, section.note)}
        </p>
      ) : null}
    </section>
  );
}

/* Prawo sprzeciwu: odrębny, wyróżniony blok PRZED listą pozostałych praw.
   Wymaga tego wprost art. 21 ust. 4 RODO („wyraźnie i odrębnie”), więc nie
   wolno z tego zrobić punktu listy. */
function RodoObjectionBlock() {
  const { lang } = useLang();
  const o: RodoObjection = RODO.objection;
  return (
    <section id={o.id} className="card mt-10" style={{ padding: 24 }}>
      <h2 className="text-2xl font-extrabold tracking-tight" style={{ color: "var(--heading)" }}>
        {pick(lang, o.title)}
      </h2>
      {pick(lang, o.body).map((paragraph) => (
        <p key={paragraph} className="mt-3 text-base leading-relaxed" style={{ color: "var(--foreground)" }}>
          {paragraph}
        </p>
      ))}
      <a className="btn btn-secondary mt-5" href={pick(lang, o.cta.href)}>
        {pick(lang, o.cta.label)}
      </a>
    </section>
  );
}

function RodoPage() {
  const { lang } = useLang();
  return (
    <>
      <Seo
        title={pick(lang, PAGES_SEO.rodo.title)}
        description={pick(lang, PAGES_SEO.rodo.description)}
        path="/rodo"
        jsonLd={[ORG_JSONLD]}
        noindex
      />
      <PageMain>
        <div className="max-w-2xl mx-auto px-6 py-8 w-full">
          <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: "var(--heading)" }}>
            {pick(lang, RODO.h1)}
          </h1>
          <p className="mt-4 text-base leading-relaxed" style={{ color: "var(--foreground)" }}>
            {pick(lang, RODO.lead)}
          </p>
          <p className="mt-3 text-xs" style={{ color: "var(--muted-foreground)" }}>
            {`${pick(lang, { pl: "Ostatnia aktualizacja", en: "Last updated" })}: ${RODO.updated}`}
          </p>
          <p className="mt-1 text-xs" style={{ color: "var(--muted-foreground)" }}>
            {pick(lang, RODO.disclaimer)}
          </p>

          {RODO.sections.map((section) => (
            <div key={section.id}>
              {section.id === RODO.objection.renderBefore ? <RodoObjectionBlock /> : null}
              <RodoSectionBlock section={section} />
            </div>
          ))}

          <section id="organ" className="mt-8">
            <h2 className="text-xl font-extrabold tracking-tight" style={{ color: "var(--heading)" }}>
              {pick(lang, { pl: "Skarga do organu nadzorczego", en: "Complaint to the supervisory authority" })}
            </h2>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
              {pick(lang, RODO.authority.note)}
            </p>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
              {`${pick(lang, RODO.authority.name)}, ${RODO.authority.address}`}
            </p>
          </section>
        </div>
      </PageMain>
      <Footer />
    </>
  );
}

/* ── 404 ── jedna linia i dwa wyjścia; noindex, żeby literówki w adresie nie
   trafiały do indeksu (seo-404-noindex-real-404). */
function NotFound() {
  const { lang } = useLang();
  return (
    <>
      <Seo
        title={pick(lang, PAGES_SEO.notFound.title)}
        description={pick(lang, PAGES_SEO.notFound.description)}
        path="/404"
        noindex
      />
      <PageMain>
        <div className="max-w-3xl mx-auto px-6 py-16 w-full">
          <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: "var(--heading)" }}>
            {pick(lang, NOT_FOUND_COPY.h1)}
          </h1>
          <p className="mt-4 text-base" style={{ color: "var(--muted-foreground)" }}>
            {pick(lang, NOT_FOUND_COPY.line)}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="btn btn-primary" to="/narzedzia">
              {pick(lang, NOT_FOUND_COPY.toTools)}
            </Link>
            <Link className="btn btn-secondary" to="/">
              {pick(lang, NOT_FOUND_COPY.toHome)}
            </Link>
          </div>
        </div>
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
  /* animowane tło WebGL tylko na desktopie: na mobile statyczny gradient .bg-layer */
  /* Animowane wzgórza NIE wchodzą na prezentację (2026-09-13). Każda scena niesie
     własne tło, a wzgórza przebijały się przez wszystkie osiem naraz: zrzut pulpitu,
     wykres i pejzaż nakładały się w jedną szarą breję, nieczytelną na żadnej warstwie.
     Na podstronach (narzędzia, oferta, FAQ, RODO) tło zostaje bez zmian. */
  const isPresentation = useLocation().pathname === "/";
  const animatedBg = useAnimatedBg() && !isPresentation;

  return (
    /* UWAGA: ten wrapper MUSI być bez nieprzezroczystego tła. `.bg-layer` ma
       z-index:-1 (fixed background pod treścią), a wrapper po rozbiciu na
       strony ma pełną wysokość dokumentu, więc nieprzezroczyste tło (np.
       background:var(--body-bg)) zamalowałoby wzgórza/gradient. Podkład #121212
       daje body (company-ui.css) i sama .bg-layer. NIE dodawać tu tła. */
    <div>
      {/* tło CAŁEJ strony: GLSL Hills (lazy chunk z three.js), spowolnione.
          .bg-layer/.content-layer = czysty CSS (globals). Na urządzeniach
          dotykowych canvas WebGL się NIE renderuje (bug iOS), więc zostaje gradient. */}
      <div className="bg-layer" aria-hidden="true">
        {animatedBg && (
          <BgBoundary>
            <Suspense fallback={null}>
              <GLSLHills width="100%" height="100%" speed={0.2} />
            </Suspense>
          </BgBoundary>
        )}
      </div>

      <div className="content-layer">
        <SkipLink />
        <ScrollToTop />
        <Navbar onBook={onBook} />
        <Routes>
          <Route path="/" element={<HomePage onBook={onBook} />} />
          <Route path="/narzedzia" element={<ToolsPage />} />
          <Route path="/oferta" element={<OfferPage onBook={onBook} />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/rodo" element={<RodoPage />} />
          <Route
            path="/narzedzia/:slug"
            element={
              <>
                {/* podstrona narzędzia ma własny padding górny, więc PageMain
                    daje jej wyłącznie landmark <main id="main"> */}
                <PageMain pad={false}>
                  {/* szkielet trzyma wysokość, więc dociągnięcie chunku podstrony
                      nie przesuwa treści (CLS) */}
                  <Suspense
                    fallback={<div className="skel" style={{ minHeight: 480, width: "100%" }} aria-busy="true" />}
                  >
                    <ToolPage onBook={onBook} />
                  </Suspense>
                </PageMain>
                <Footer />
              </>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
        {bookingOpen && (
          <Suspense fallback={null}>
            <BookingModal open onClose={() => setBookingOpen(false)} />
          </Suspense>
        )}
      </div>
    </div>
  );
}
