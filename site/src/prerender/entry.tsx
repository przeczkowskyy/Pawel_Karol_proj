import { renderToStaticMarkup } from "react-dom/server";
import { DEPTS, type ToolItem } from "@/data/tools";
import { getToolsWithSeo } from "@/data/toolsSeo";
import { FAQ_I18N } from "@/data/faq";
import { NOT_FOUND_COPY, PAGES_SEO, SKIP_LINK } from "@/data/pagesSeo";
import { MESSAGING } from "@/data/messaging";
import { RODO, type RodoObjection, type RodoSection } from "@/data/rodo";
import { EMAIL, MAIL_HREF, ORIGIN, PHONE_DISPLAY, PHONE_E164, PHONE_HREF } from "@/data/contact";
import {
  HERO_ALT,
  HERO_H,
  HERO_POSTER,
  HERO_POSTER_SIZES,
  HERO_POSTER_SRCSET,
  HERO_W,
} from "@/data/media";
import { ORG_JSONLD, toolJsonLd, faqPageJsonLd } from "@/components/Seo";

/* Prerender (SSG): budowany osobno przez `vite build --ssr` i odpalany
   node'em PO buildzie klienta (scripts/prerender.mjs). Generuje:
   - statyczny HTML „SEO shell” dla tras /, /narzedzia, /oferta, /faq, /rodo,
     404 i 13 podstron /narzedzia/*; meta, JSON-LD i PEŁNA treść tekstowa
     są w HTML-u bez JS (crawlery Google/Bing/LLM bez wykonywania JS widzą
     wszystko; strona degraduje się łaskawie, gdy JS nie wstanie),
   - sitemap.xml (trasy BEZ noindex) i llms.txt, liczone z tools.ts
     i messaging.ts (jedno źródło prawdy).
   React po zamontowaniu PODMIENIA zawartość #root (createRoot().render
   czyści kontener): shell żyje tylko do startu aplikacji.

   Zasady tego pliku: zero window/document, zero dat, zero losowości, zero
   importów z motion/* (SSR build pada na `window is not defined`), zero prozy
   pisanej tutaj: copy przychodzi z src/data/* dokładnie tak samo jak do
   komponentów Reacta (code-single-source-copy). */

/* priorytety sitemap dla podstron narzędzi */
const SITEMAP_PRIORITY: Record<string, string> = {
  "raport-zarzadczy": "0.9",
  "audyt-jakosci-danych": "0.9",
  "dashboard-produkcji": "0.8",
  "os-czasu-zadan": "0.8",
  "import-z-rekoncyliacja": "0.8",
  "importy-erp": "0.8",
  "kontroling-kosztow": "0.8",
  "kontroling-ksef": "0.8",
};

export interface RouteOut {
  /* ścieżka pliku względem dist/, np. "index.html", "narzedzia/rejestr-umow.html" */
  file: string;
  title: string;
  description: string;
  /* kanoniczny path, np. "/" albo "/narzedzia/rejestr-umow" */
  path: string;
  jsonLd: object[];
  bodyHtml: string;
  /* trasa poza indeksem: meta robots noindex i brak wpisu w sitemap.xml */
  noindex?: boolean;
  /* priorytet w sitemapie; pomijany dla tras z noindex */
  priority?: string;
}

/* ── wspólne drobiazgi układu shella (klasy z kitu + utility już użyte
      w aplikacji, Tailwind na pewno je wygenerował) ─────────────────── */

const MUTED = { color: "var(--muted-foreground)" } as const;
const HEAD = { color: "var(--heading)" } as const;
const BODY = { color: "var(--foreground)" } as const;
const LINK = { color: "var(--accent-foreground)", fontWeight: 700 } as const;

function ShellChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="bg-layer" aria-hidden="true"></div>
      <div className="content-layer">
        {/* ten sam komplet landmarków co po starcie Reacta: skip-link, potem
            dokładnie jeden <main id="main"> (a11y-main-and-skip-link) */}
        <a
          href="#main"
          className="skip-link btn btn-secondary"
          style={{ position: "fixed", left: 16, top: -9999, zIndex: 100 }}
        >
          {SKIP_LINK.pl}
        </a>
        <main
          id="main"
          className="max-w-6xl mx-auto px-6"
          style={{ paddingTop: 40, paddingBottom: 64 }}
        >
          {children}
        </main>
      </div>
    </>
  );
}

/* pasek nawigacji tekstowej (crawler widzi linki między stronami) */
function ShellNav() {
  return (
    <p className="text-[13px]" style={MUTED}>
      <a href="/" style={LINK}>KLAROW</a>
      {" · "}
      <a href="/narzedzia" style={LINK}>Narzędzia</a>
      {" · "}
      <a href="/oferta" style={LINK}>Oferta</a>
      {" · "}
      <a href="/faq" style={LINK}>FAQ</a>
    </p>
  );
}

/* Kontakt plus link do klauzuli: /rodo musi być osiągalne z KAŻDEJ trasy
   (legal-rodo-page-required), a shell nie ma stopki Reacta. */
function ContactLine() {
  return (
    <>
      <p className="mt-6 text-sm" style={BODY}>
        Kontakt: <a href={MAIL_HREF} style={LINK}>{EMAIL}</a>
        {" · "}
        <a href={PHONE_HREF} style={LINK}>{PHONE_DISPLAY}</a>
        {" · Polska / USA"}
      </p>
      <p className="mt-2 text-xs" style={MUTED}>
        <a href="/rodo" style={LINK}>RODO i prywatność</a>
      </p>
    </>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[20px] font-extrabold tracking-tight" style={{ ...HEAD, marginTop: 28 }}>
      {children}
    </h2>
  );
}

/* ── shell strony głównej (/) ───────────────────────────────────────── */

function HomeShell() {
  return (
    <ShellChrome>
      {/* HERO bez JS (plan §3 S1): ten sam H1, ten sam lead z messaging.ts,
          oba CTA jako zwykłe linki i kadr produktu jako obraz. Zero nagrania
          i zero przycisku pauzy: nagranie montuje wyłącznie React po `load`
          (bramka: zero wystąpień elementu video w plikach HTML z dist).
          Kadr jest elementem LCP także tutaj, więc ma fetchPriority="high",
          jawne wymiary i ten sam `srcset`, co preload w index.html. */}
      <h1 className="hero-title" style={HEAD}>{MESSAGING.oneLiner.pl}</h1>
      <p className="hero-lead" style={BODY}>{MESSAGING.subtext.pl}</p>
      <div className="hero-cta">
        <a className="btn btn-primary" href={MAIL_HREF}>{MESSAGING.cta.primary.pl}</a>
        <a className="btn btn-secondary" href="/narzedzia">{MESSAGING.cta.secondary.pl}</a>
      </div>
      <div className="hero-frame" style={{ marginTop: 32 }}>
        <div className="hero-media">
          <img
            className="hero-shot"
            src={HERO_POSTER}
            srcSet={HERO_POSTER_SRCSET}
            sizes={HERO_POSTER_SIZES}
            alt={HERO_ALT.pl}
            width={HERO_W}
            height={HERO_H}
            fetchPriority="high"
            decoding="async"
          />
        </div>
      </div>
      <p className="mt-6 max-w-3xl text-sm" style={MUTED}>
        {MESSAGING.zeroVendorCloud.pl}
      </p>
      <ContactLine />

      {/* Shell strony głównej jest KRÓTKI, bo strona jest krótka (2026-09-13).
          Wcześniej stały tu cztery akapity prozy, których React po starcie nie
          renderował: crawler bez JavaScriptu widział inną stronę niż człowiek.
          Treść long-tail żyje tam, gdzie ma rankować, czyli na /narzedzia,
          /oferta, /faq i na podstronach narzędzi. Tutaj zostaje tyle, ile
          strona naprawdę mówi, plus linkowanie wewnętrzne niżej. */}

      <H2>Zobacz konkrety</H2>
      <ul className="mt-2 flex flex-col gap-1.5 text-sm" style={BODY}>
        <li>
          <a href="/narzedzia" style={LINK}>Przykłady realizacji</a>: klikalne dema i wdrożenia
          u klienta (m.in. integracja z KSeF); to próbki, a Twoje narzędzie budujemy pod Twój proces.
        </li>
        <li>
          <a href="/oferta" style={LINK}>Oferta: pilot na kopii</a>, czyli jeden proces, efekt w dni,
          płatność 50/50; wycena po bezpłatnej diagnozie.
        </li>
        <li>
          <a href="/faq" style={LINK}>Najczęstsze pytania</a>: bezpieczeństwo danych, koszt,
          zgodność z ERP, los działających makr.
        </li>
      </ul>

      <section lang="en">
        <H2>Klarow in English</H2>
        <p className="mt-2 max-w-3xl text-sm" style={BODY}>
          {MESSAGING.oneLiner.en} {MESSAGING.subtext.en}
        </p>
        <p className="mt-2 max-w-3xl text-sm" style={MUTED}>
          {MESSAGING.determinism.en} See the{" "}
          <a href="/narzedzia" style={LINK}>work we've done</a>, the{" "}
          <a href="/oferta" style={LINK}>offer</a>, the <a href="/faq" style={LINK}>FAQ</a> and our{" "}
          <a href="/rodo" style={LINK}>privacy notice</a>.
        </p>
      </section>

      <p className="mt-8 text-xs" style={MUTED}>
        Interaktywna wersja strony (żywe dema) uruchamia się z JavaScriptem.
        © 2026 Klarow · Polska / USA
      </p>
    </ShellChrome>
  );
}

/* ── shell huba narzędzi (/narzedzia) ───────────────────────────────── */

function ToolsShell({ pl, en }: { pl: ToolItem[]; en: ToolItem[] }) {
  return (
    <ShellChrome>
      <ShellNav />
      <h1 className="mt-4 text-4xl font-extrabold tracking-tight" style={HEAD}>
        Przykłady realizacji: dema i wdrożenia
      </h1>
      <p className="mt-4 max-w-3xl text-sm" style={MUTED}>
        To nie pełna lista usług, tylko próbki tego, co już zbudowaliśmy. Większość odpalisz na
        żywo na danych przykładowych (bez logowania); część to realne wdrożenia u klienta, jak
        kontroling na danych z KSeF. Twoje narzędzie budujemy pod Twój proces. Wcześniej
        zbudowaliśmy od środka ekosystem kilkunastu narzędzi dla firmy produkcyjno-budowlanej
        (~30 równoległych projektów, klienci w USA): ~10 000 wierszy kosztów z ERP miesięcznie,
        raport zarządczy w kilkanaście sekund i kontrola sum co do grosza.
      </p>
      {DEPTS.map((d) => (
        <section key={d.key}>
          <h2 className="mt-6 text-[17px] font-bold" style={HEAD}>{d.label.pl}</h2>
          <p className="text-[13px]" style={MUTED}>{d.desc.pl}</p>
          <ul className="mt-2 flex flex-col gap-1.5">
            {pl.filter((t) => t.dept === d.key).map((t) => (
              <li key={t.slug} className="text-[13.5px]" style={BODY}>
                <a href={`/narzedzia/${t.slug}`} style={LINK}>{t.name}</a>
                {": "}
                {t.tagline}
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section lang="en">
        <H2>Tools (English)</H2>
        <ul className="mt-2 flex flex-col gap-1.5 text-[13.5px]" style={BODY}>
          {en.map((t) => (
            <li key={t.slug}>
              <a href={`/narzedzia/${t.slug}`} style={LINK}>{t.name}</a>
              {": "}
              {t.tagline}
            </li>
          ))}
        </ul>
      </section>

      <ContactLine />
    </ShellChrome>
  );
}

/* ── shell oferty (/oferta) ─────────────────────────────────────────── */

function OfferShell() {
  return (
    <ShellChrome>
      <ShellNav />
      <h1 className="mt-4 text-4xl font-extrabold tracking-tight" style={HEAD}>
        Oferta: pilot na kopii, efekt w dni, nie w miesiące
      </h1>
      <p className="mt-4 max-w-3xl text-sm" style={BODY}>
        Jeden proces, stała cena, ≤10 dni roboczych. Budujemy na kopii Twoich plików, a pierwszy
        namacalny efekt (raport błędów z Twoich prawdziwych danych) widzisz w dniu 5. Zapis na
        oryginałach dopiero po Twojej akceptacji.
      </p>
      <ul className="mt-3 flex flex-col gap-1.5 text-sm" style={BODY}>
        <li>· Dzień 0: wybór procesu i zamrożenie zakresu (wliczony)</li>
        <li>· Dni 1–4: budowa wyłącznie na kopiach Twoich plików</li>
        <li>· Dzień 5: pokaz na żywo + raport błędów z Twoich prawdziwych danych</li>
        <li>· Płatność 50/50: druga rata po działającym odbiorze</li>
        <li>· Zanim cokolwiek kupisz: przyślij nam swój najgorszy Excel. W 30 minut pokażemy na próbce, co da się z nim zrobić</li>
      </ul>

      <H2>Dlaczego dni, nie miesiące</H2>
      <p className="mt-2 max-w-3xl text-sm" style={BODY}>
        Diagnoza na kopiach Twoich plików, zakres zamrożony na piśmie w Dniu 0; budowa na gotowych
        wzorcach: silnik (zapis, walidacja, backup, log audytowy) już istnieje; TEST bez zapisu
        (pełna lista zmian do przejrzenia, w Twoich plikach nic się nie dzieje); PROD dopiero po
        Twojej akceptacji, z backupem przed każdą zmianą i logiem operacji.
      </p>

      <H2>Zaufanie na mechanizmach, nie przymiotnikach</H2>
      <p className="mt-2 max-w-3xl text-sm" style={BODY}>
        On-premise: dane nie opuszczają firmy, a po wdrożeniu nie mamy do nich dostępu. Kod,
        dokumentacja i runbook zostają u Ciebie: narzędzie działa nawet bez nas. Stała cena i
        zakres na piśmie; druga rata dopiero po działającym odbiorze.
      </p>

      <H2>Dla kogo (i dla kogo nie)</H2>
      <p className="mt-2 max-w-3xl text-sm" style={BODY}>
        Będzie nam po drodze z firmami produkcyjnymi, budowlanymi i dystrybucyjnymi (20–250 osób,
        Windows + Excel), którym raportowanie i tak żyje w Excelu, a chcą efektu w dni. Nie robimy
        migracji do chmury ani wymiany ERP; nie działamy na Google Sheets / Mac i nie sprzedajemy
        godzin (body-leasing); sprzedajemy rezultat.
      </p>

      <H2>Jak wygląda współpraca</H2>
      <p className="mt-2 max-w-3xl text-sm" style={BODY}>
        Od pierwszej wiadomości, przez bezpłatną diagnozę na próbce i pilot na kopii, do działającego
        narzędzia i opieki, z dwiema decyzjami, które zawsze należą do Ciebie: co budujemy (zakres
        w Dniu 0) i kiedy wchodzimy na oryginały (po akceptacji TEST-u).
      </p>

      <section lang="en">
        <H2>The offer (English)</H2>
        <p className="mt-2 max-w-3xl text-sm" style={BODY}>
          Pilot on a copy: one process, a fixed price, ≤10 business days. We build on a copy of your
          files; you see the first tangible result (an error report from your real data) on day 5.
          Writes to the originals only after your approval. On-premise, deterministic, 50/50 payment.
        </p>
      </section>

      <ContactLine />
    </ShellChrome>
  );
}

/* ── shell FAQ (/faq) ───────────────────────────────────────────────── */

function FaqShell() {
  return (
    <ShellChrome>
      <ShellNav />
      <h1 className="mt-4 text-4xl font-extrabold tracking-tight" style={HEAD}>
        Najczęstsze obiekcje: odpowiadamy wprost
      </h1>
      <p className="mt-3 max-w-3xl text-sm" style={MUTED}>
        Te same pytania słyszymy w każdej rozmowie. Oto odpowiedzi: o bezpieczeństwie danych,
        koszcie pilota, zgodności z Twoim ERP i losie działających makr.
      </p>
      {FAQ_I18N.pl.map((f) => (
        <section key={f.id} className="mt-4 max-w-3xl">
          <h2 className="text-[15px] font-bold" style={HEAD}>{f.q}</h2>
          <p className="mt-1 text-[13px] leading-relaxed" style={MUTED}>{f.a}</p>
        </section>
      ))}

      <section lang="en">
        <H2>FAQ (English)</H2>
        {FAQ_I18N.en.map((f) => (
          <section key={f.id} className="mt-3 max-w-3xl">
            <h3 className="text-[13px] font-bold" style={HEAD}>{f.q}</h3>
            <p className="mt-1 text-[12.5px] leading-relaxed" style={MUTED}>{f.a}</p>
          </section>
        ))}
      </section>

      <ContactLine />
    </ShellChrome>
  );
}

/* ── shell podstrony narzędzia ──────────────────────────────────────── */

function ToolShell({ pl, en, all }: { pl: ToolItem; en: ToolItem; all: ToolItem[] }) {
  return (
    <ShellChrome>
      <p className="text-[13px]" style={MUTED}>
        <a href="/" style={LINK}>KLAROW</a>
        {" · "}
        <a href="/narzedzia" style={LINK}>Wszystkie narzędzia</a>
      </p>
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight" style={HEAD}>{pl.name}</h1>
      <p className="mt-3 max-w-3xl text-[15px] leading-relaxed" style={BODY}>{pl.tagline}</p>
      <p className="mt-2 text-[12.5px]" style={MUTED}>
        {pl.kind === "case"
          ? "WDROŻENIE u klienta: to realna integracja/aplikacja, nie demo w przeglądarce (wymaga połączenia z zewnętrznym systemem i serwera). Poniżej opis, jak działa i jak jest zbudowana; na żywo pokażemy ją na Twoich danych."
          : "DEMO na danych przykładowych: pełna, interaktywna wersja działa na tej stronie po uruchomieniu JavaScriptu: w całości w Twojej przeglądarce, bez logowania i bez chmury."}
      </p>

      <H2>Co zastępuje</H2>
      <p className="mt-2 max-w-3xl text-sm" style={BODY}>{pl.replaces}</p>

      <H2>Wejście → wyjście</H2>
      <p className="mt-2 max-w-3xl text-sm" style={BODY}>{pl.io}</p>

      <H2>Co dostajesz</H2>
      <ul className="mt-2 flex flex-col gap-1.5 text-sm" style={BODY}>
        {pl.bullets.map((b) => (
          <li key={b}>· {b}</li>
        ))}
      </ul>

      {pl.faq?.length ? (
        <>
          <H2>Częste pytania o to narzędzie</H2>
          {pl.faq.map((f) => (
            <section key={f.q} className="mt-4 max-w-3xl">
              <h3 className="text-[14px] font-bold" style={HEAD}>{f.q}</h3>
              <p className="mt-1 text-[13px] leading-relaxed" style={MUTED}>{f.a}</p>
            </section>
          ))}
        </>
      ) : null}

      <H2>Inne narzędzia Klarow</H2>
      <ul className="mt-2 flex flex-col gap-1 text-[13.5px]">
        {all.filter((x) => x.slug !== pl.slug).map((x) => (
          <li key={x.slug}>
            <a href={`/narzedzia/${x.slug}`} style={LINK}>{x.name}</a>
          </li>
        ))}
      </ul>

      <section lang="en" className="mt-6">
        <h2 className="text-[16px] font-extrabold" style={HEAD}>{en.name} (English)</h2>
        <p className="mt-2 max-w-3xl text-[13px]" style={BODY}>{en.tagline}</p>
        <ul className="mt-2 flex flex-col gap-1 text-[13px]" style={BODY}>
          {en.bullets.map((b) => (
            <li key={b}>· {b}</li>
          ))}
        </ul>
        {en.faq?.length
          ? en.faq.map((f) => (
              <section key={f.q} className="mt-3 max-w-3xl">
                <h3 className="text-[13px] font-bold" style={HEAD}>{f.q}</h3>
                <p className="mt-1 text-[12.5px] leading-relaxed" style={MUTED}>{f.a}</p>
              </section>
            ))
          : null}
      </section>

      <ContactLine />
    </ShellChrome>
  );
}

/* ── shell klauzuli RODO (/rodo) ────────────────────────────────────── */

function RodoSectionShell({ section }: { section: RodoSection }) {
  return (
    <section id={section.id} className="mt-6 max-w-3xl">
      <h2 className="text-xl font-extrabold tracking-tight" style={HEAD}>
        {section.title.pl}
      </h2>
      {section.variant === "list" ? (
        <ul className="mt-2 flex flex-col gap-1.5 text-sm" style={BODY}>
          {section.body.pl.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        section.body.pl.map((paragraph) => (
          <p key={paragraph} className="mt-2 text-sm leading-relaxed" style={BODY}>
            {paragraph}
          </p>
        ))
      )}
      {section.note ? (
        <p className="mt-2 text-xs leading-relaxed" style={MUTED}>
          {section.note.pl}
        </p>
      ) : null}
    </section>
  );
}

function RodoObjectionShell({ objection }: { objection: RodoObjection }) {
  return (
    <section id={objection.id} className="card mt-8 max-w-3xl" style={{ padding: 24 }}>
      <h2 className="text-2xl font-extrabold tracking-tight" style={HEAD}>
        {objection.title.pl}
      </h2>
      {objection.body.pl.map((paragraph) => (
        <p key={paragraph} className="mt-2 text-base leading-relaxed" style={BODY}>
          {paragraph}
        </p>
      ))}
      <p className="mt-3 text-sm">
        <a href={objection.cta.href.pl} style={LINK}>{objection.cta.label.pl}</a>
      </p>
    </section>
  );
}

function RodoShell() {
  const o: RodoObjection = RODO.objection;
  return (
    <ShellChrome>
      <ShellNav />
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight" style={HEAD}>
        {RODO.h1.pl}
      </h1>
      <p className="mt-4 max-w-3xl text-base leading-relaxed" style={BODY}>
        {RODO.lead.pl}
      </p>
      <p className="mt-2 text-xs" style={MUTED}>
        {`Ostatnia aktualizacja: ${RODO.updated}`}
      </p>
      <p className="mt-1 text-xs" style={MUTED}>
        {RODO.disclaimer.pl}
      </p>

      {RODO.sections.map((section) => (
        <div key={section.id}>
          {section.id === o.renderBefore ? <RodoObjectionShell objection={o} /> : null}
          <RodoSectionShell section={section} />
        </div>
      ))}

      <section id="organ" className="mt-6 max-w-3xl">
        <h2 className="text-xl font-extrabold tracking-tight" style={HEAD}>
          Skarga do organu nadzorczego
        </h2>
        <p className="mt-2 text-sm leading-relaxed" style={BODY}>
          {RODO.authority.note.pl}
        </p>
        <p className="mt-1 text-sm leading-relaxed" style={BODY}>
          {`${RODO.authority.name.pl}, ${RODO.authority.address}`}
        </p>
      </section>

      <section lang="en" className="mt-8 max-w-3xl">
        <h2 className="text-xl font-extrabold tracking-tight" style={HEAD}>
          {RODO.h1.en}
        </h2>
        <p className="mt-2 text-sm leading-relaxed" style={BODY}>{RODO.lead.en}</p>
        <p className="mt-2 text-sm leading-relaxed" style={BODY}>{o.title.en}: {o.body.en[0]}</p>
        <p className="mt-2 text-sm">
          <a href={o.cta.href.en} style={LINK}>{o.cta.label.en}</a>
        </p>
        <p className="mt-2 text-xs" style={MUTED}>{RODO.disclaimer.en}</p>
      </section>

      <ContactLine />
    </ShellChrome>
  );
}

/* ── shell 404 ──────────────────────────────────────────────────────── */

function NotFoundShell() {
  return (
    <ShellChrome>
      <ShellNav />
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight" style={HEAD}>
        {NOT_FOUND_COPY.h1.pl}
      </h1>
      <p className="mt-4 max-w-3xl text-base" style={MUTED}>
        {NOT_FOUND_COPY.line.pl}
      </p>
      <ul className="mt-4 flex flex-col gap-1.5 text-sm" style={BODY}>
        <li>
          <a href="/narzedzia" style={LINK}>{NOT_FOUND_COPY.toTools.pl}</a>
        </li>
        <li>
          <a href="/" style={LINK}>{NOT_FOUND_COPY.toHome.pl}</a>
        </li>
      </ul>
      <section lang="en" className="mt-6">
        <h2 className="text-xl font-extrabold tracking-tight" style={HEAD}>
          {NOT_FOUND_COPY.h1.en}
        </h2>
        <p className="mt-2 text-sm" style={MUTED}>{NOT_FOUND_COPY.line.en}</p>
      </section>
      <ContactLine />
    </ShellChrome>
  );
}

/* ── wyjścia ────────────────────────────────────────────────────────── */

/* sitemap.xml: WYŁĄCZNIE trasy bez noindex (dziś odpadają 404 i /rodo, które
   czeka na przegląd radcy). Plik jest generowany przy buildzie; ręcznego
   public/sitemap.xml nie ma i nie wolno go odtworzyć (seo-sitemap-llms-generated). */
function sitemapXml(routes: RouteOut[]): string {
  const urls = routes
    .filter((r) => !r.noindex)
    .map(
      (r) =>
        `  <url><loc>${ORIGIN}${r.path === "/" ? "/" : r.path}</loc><priority>${r.priority ?? "0.7"}</priority></url>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<!-- GENEROWANE przy buildzie z src/data/tools.ts i listy tras (scripts/prerender.mjs); nie edytuj ręcznie -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

/* llms.txt: opis firmy ze zdań marki, filary, 13 pozycji z tools.ts, kontakt
   z contact.ts i sekcja EN. /rodo JEST tutaj mimo noindex: to adres klauzuli
   z każdego szablonu kontaktu, a llms.txt nie jest zgłoszeniem do indeksu. */
function llmsTxt(pl: ToolItem[], en: ToolItem[]): string {
  const toolsPl = pl
    .map((t) => `- [${t.name}](${ORIGIN}/narzedzia/${t.slug}): ${t.tagline}`)
    .join("\n");
  const toolsEn = en
    .map((t) => `- [${t.name}](${ORIGIN}/narzedzia/${t.slug}): ${t.tagline}`)
    .join("\n");
  const pillars = MESSAGING.pillars.map((p) => `- ${p.name.pl}: ${p.text.pl}`).join("\n");
  return `# Klarow

> ${MESSAGING.oneLiner.pl} ${MESSAGING.subtext.pl}

Trzy filary:
${pillars}

Główne strony: [Narzędzia](${ORIGIN}/narzedzia) · [Oferta](${ORIGIN}/oferta) · [FAQ](${ORIGIN}/faq) · [RODO i prywatność](${ORIGIN}/rodo)

Dwa twarde wyróżniki:
- ${MESSAGING.zeroVendorCloud.pl} Dema na klarow.com liczą w 100% w przeglądarce, bez logowania.
- ${MESSAGING.determinism.pl} Każdą liczbę można sprawdzić ręcznie dzięki jawnej ścieżce wyliczenia.

Oferta wejściowa „Pilot na kopii”: jeden proces, do 10 dni roboczych, budowa na kopiach plików,
pierwszy efekt w dniu 5, płatność 50/50 (druga rata po działającym odbiorze). Wycena po bezpłatnej
diagnozie: stała cena za zamrożony zakres, bez stawki godzinowej; kolejne narzędzia wyceniane
osobno. Przed zakupem „przyślij nam swój najgorszy Excel”, czyli bezpłatna 30-minutowa diagnoza
na próbce. Szczegóły: ${ORIGIN}/oferta

## Co budujemy

Raporty i kontroling · integracje i e-dokumenty (KSeF, e-faktury, API urzędowe, ERP) · importy
i scalanie danych · obieg dokumentów · panele i dashboardy · porządek w danych (audyt, migracje).

## Narzędzia i realizacje (dema na żywo i wdrożenia u klienta)

${toolsPl}

## FAQ

Odpowiedzi na typowe obiekcje (koszt, bezpieczeństwo danych, „mamy już ERP”, ryzyko dla
działających makr): ${ORIGIN}/faq

## Prywatność

Skąd mamy dane kontaktowe, po co je przetwarzamy, jak długo je trzymamy i jak jednym mailem
wnieść sprzeciw: ${ORIGIN}/rodo

## Kontakt

- E-mail: ${EMAIL}
- Telefon: ${PHONE_E164}
- Obszar działania: Polska i USA
- Strona: ${ORIGIN}

## English

${MESSAGING.oneLiner.en} ${MESSAGING.subtext.en}
${MESSAGING.determinism.en}

${toolsEn}
`;
}

export function prerenderAll(): { routes: RouteOut[]; sitemap: string; llms: string } {
  const pl = getToolsWithSeo("pl");
  const en = getToolsWithSeo("en");

  const routes: RouteOut[] = [
    {
      file: "index.html",
      path: "/",
      title: PAGES_SEO.home.title.pl,
      description: PAGES_SEO.home.description.pl,
      priority: "1.0",
      jsonLd: [ORG_JSONLD],
      bodyHtml: renderToStaticMarkup(<HomeShell />),
    },
    {
      file: "narzedzia.html",
      path: "/narzedzia",
      title: PAGES_SEO.tools.title.pl,
      description: PAGES_SEO.tools.description.pl,
      priority: "0.9",
      jsonLd: [ORG_JSONLD],
      bodyHtml: renderToStaticMarkup(<ToolsShell pl={pl} en={en} />),
    },
    {
      file: "oferta.html",
      path: "/oferta",
      title: PAGES_SEO.oferta.title.pl,
      description: PAGES_SEO.oferta.description.pl,
      priority: "0.9",
      jsonLd: [ORG_JSONLD],
      bodyHtml: renderToStaticMarkup(<OfferShell />),
    },
    {
      file: "faq.html",
      path: "/faq",
      title: PAGES_SEO.faq.title.pl,
      description: PAGES_SEO.faq.description.pl,
      priority: "0.7",
      jsonLd: [faqPageJsonLd(FAQ_I18N.pl)],
      bodyHtml: renderToStaticMarkup(<FaqShell />),
    },
    /* /rodo: publiczna i linkowana ze stopki, ale POZA sitemapą do czasu
       przeglądu radcy (noindex, decyzja D-21). */
    {
      file: "rodo.html",
      path: "/rodo",
      title: PAGES_SEO.rodo.title.pl,
      description: PAGES_SEO.rodo.description.pl,
      noindex: true,
      jsonLd: [ORG_JSONLD],
      bodyHtml: renderToStaticMarkup(<RodoShell />),
    },
    /* 404: plik dla Cloudflare Pages; bez canonical, bez og, poza sitemapą
       i bez JSON-LD (seo-404-noindex-real-404). */
    {
      file: "404.html",
      path: "/404",
      title: PAGES_SEO.notFound.title.pl,
      description: PAGES_SEO.notFound.description.pl,
      noindex: true,
      jsonLd: [],
      bodyHtml: renderToStaticMarkup(<NotFoundShell />),
    },
    ...pl.map((t): RouteOut => {
      const path = `/narzedzia/${t.slug}`;
      const description = t.seo?.description ?? t.tagline;
      const tEn = en.find((x) => x.slug === t.slug)!;
      return {
        file: `narzedzia/${t.slug}.html`,
        path,
        title: t.seo?.title ?? `${t.name}: działające demo online | Klarow`,
        description,
        priority: SITEMAP_PRIORITY[t.slug] ?? "0.7",
        jsonLd: t.faq?.length
          ? [toolJsonLd(t.name, description, path), faqPageJsonLd(t.faq)]
          : [toolJsonLd(t.name, description, path)],
        bodyHtml: renderToStaticMarkup(<ToolShell pl={t} en={tEn} all={pl} />),
      };
    }),
  ];

  return { routes, sitemap: sitemapXml(routes), llms: llmsTxt(pl, en) };
}
