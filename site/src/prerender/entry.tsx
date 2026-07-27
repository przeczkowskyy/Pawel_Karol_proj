import { renderToStaticMarkup } from "react-dom/server";
import { getTools, DEPTS, type ToolItem } from "@/data/tools";
import { FAQ_I18N } from "@/data/faq";
import { PAGES_SEO } from "@/data/pagesSeo";
import { ORG_JSONLD, toolJsonLd, faqPageJsonLd } from "@/components/Seo";

/* Prerender (SSG) — budowany osobno przez `vite build --ssr` i odpalany
   node'em PO buildzie klienta (scripts/prerender.mjs). Generuje:
   - statyczny HTML „SEO shell" dla stron głównych (/, /narzedzia, /oferta,
     /faq) i 12 podstron /narzedzia/* — meta, JSON-LD i PEŁNA treść tekstowa
     są w HTML-u bez JS (crawlery Google/Bing/LLM bez wykonywania JS widzą
     wszystko; strona degraduje się łaskawie, gdy JS nie wstanie),
   - sitemap.xml i llms.txt liczone z tools.ts (jedno źródło prawdy).
   React po zamontowaniu PODMIENIA zawartość #root (createRoot().render
   czyści kontener) — shell żyje tylko do startu aplikacji.
   Zero window/document, zero dat, zero losowości — czysty render. */

const ORIGIN = "https://klarow.com";
const EMAIL = "kontakt@klarow.com";
const PHONE_DISPLAY = "786 296 426";
const PHONE_HREF = "tel:+48786296426";

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
}

/* ── wspólne drobiazgi układu shella (klasy z kitu + utility już użyte
      w aplikacji — Tailwind na pewno je wygenerował) ─────────────────── */

const MUTED = { color: "var(--muted-foreground)" } as const;
const HEAD = { color: "var(--heading)" } as const;
const BODY = { color: "var(--foreground)" } as const;
const LINK = { color: "var(--accent-foreground)", fontWeight: 700 } as const;

function ShellChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="bg-layer" aria-hidden="true"></div>
      <div className="content-layer">
        <main className="max-w-6xl mx-auto px-6" style={{ paddingTop: 40, paddingBottom: 64 }}>
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

function ContactLine() {
  return (
    <p className="mt-6 text-sm" style={BODY}>
      Kontakt: <a href={`mailto:${EMAIL}`} style={LINK}>{EMAIL}</a>
      {" · "}
      <a href={PHONE_HREF} style={LINK}>{PHONE_DISPLAY}</a>
      {" · Polska / USA"}
    </p>
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
      <span className="brand-word" style={{ fontSize: 15 }}>KLAROW</span>
      <h1 className="mt-4 text-4xl font-extrabold tracking-tight" style={HEAD}>
        Porządek w danych dla firm, które wyrosły na Excelu.
      </h1>
      <p className="mt-4 max-w-3xl text-lg" style={BODY}>
        Budujemy <strong>custom narzędzia pod Twój proces</strong>: automatyzacja, kontroling,
        integracje (m.in. z KSeF), importy z ERP i obieg dokumentów. <strong>Wdrożenie w dni,
        nie w miesiące</strong> — a Twoje dane nie opuszczają firmy (on-premise). Dla firm
        20–250 osób, środowisko Windows + Excel.
      </p>
      <ContactLine />

      <H2>Co możemy zbudować</H2>
      <p className="mt-2 max-w-3xl text-sm" style={MUTED}>
        Nie mamy zamkniętego katalogu — jeśli to żyje w Excelu, plikach albo w ERP, zwykle da się
        to zautomatyzować. Rodzaje narzędzi, które robimy:
      </p>
      <ul className="mt-2 flex flex-col gap-1.5 text-sm" style={BODY}>
        <li><strong>Raporty i kontroling</strong> — panele zarządcze, marża i estymaty na żywo, zamknięcie miesiąca.</li>
        <li><strong>Integracje i e-dokumenty</strong> — KSeF, e-faktury, API urzędowe, wymiana z ERP i systemami.</li>
        <li><strong>Importy i scalanie danych</strong> — ERP ↔ Excel, łączenie źródeł, rekoncyliacja co do grosza.</li>
        <li><strong>Obieg dokumentów</strong> — akceptacje, protokoły, rejestry, koniec obiegu w mailu.</li>
        <li><strong>Panele i dashboardy</strong> — produkcja, KPI, płynność w jednym kadrze.</li>
        <li><strong>Porządek w danych</strong> — audyt jakości, deduplikacja, czyszczenie i migracje.</li>
      </ul>

      <H2>Co już zrobiliśmy</H2>
      <p className="mt-2 max-w-3xl text-sm" style={BODY}>
        Zbudowaliśmy od środka ekosystem kilkunastu narzędzi dla firmy produkcyjno-budowlanej
        (~30 równoległych projektów, klienci w USA): ~10 000 wierszy kosztów z ERP miesięcznie,
        raport zarządczy w kilkanaście sekund zamiast godzin, kontrola sum co do grosza.
        Osobnym wdrożeniem jest <a href="/narzedzia/kontroling-ksef" style={LINK}>kontroling na
        danych z KSeF</a> — read-only integracja z oficjalnym API Ministerstwa Finansów.
      </p>

      <H2>To działa, więc boisz się ruszać — słusznie</H2>
      <p className="mt-2 max-w-3xl text-sm" style={MUTED}>
        Nie każemy Ci migrować z Excela ani zmieniać sposobu pracy — wchodzimy obok Twoich plików.
        Makro po kimś, kto odszedł; ręczne przeklejanie tysięcy wierszy między ERP a arkuszami;
        ciche pomyłki wychodzące u zarządu; raport składany godzinami; wszystko na jednej osobie —
        te bóle znamy i to je usuwamy.
      </p>

      <H2>Dwa twarde wyróżniki: zero chmury i zero wróżenia</H2>
      <p className="mt-2 max-w-3xl text-sm" style={BODY}>
        „On-premise" deklaruje dziś każdy — my idziemy krok dalej. Narzędzia Klarow nie mają nawet
        którędy wysłać Twoich danych: działają lokalnie, bez API, bez serwera, a dema na tej
        stronie liczą w 100% w przeglądarce. Druga rzecz: determinizm. Te same dane wejściowe dają
        zawsze ten sam wynik — kalkulator, nie wróżka — więc każdą liczbę możesz policzyć ręcznie.
      </p>

      <H2>Zobacz konkrety</H2>
      <ul className="mt-2 flex flex-col gap-1.5 text-sm" style={BODY}>
        <li>
          <a href="/narzedzia" style={LINK}>Przykłady realizacji</a> — klikalne dema i wdrożenia
          u klienta (m.in. integracja z KSeF); to próbki, a Twoje narzędzie budujemy pod Twój proces.
        </li>
        <li>
          <a href="/oferta" style={LINK}>Oferta: Pilot na kopii</a> — jeden proces, efekt w dni,
          płatność 50/50; wycena po bezpłatnej diagnozie.
        </li>
        <li>
          <a href="/faq" style={LINK}>Najczęstsze pytania</a> — bezpieczeństwo danych, koszt,
          zgodność z ERP, los działających makr.
        </li>
      </ul>

      <section lang="en">
        <H2>Klarow in English</H2>
        <p className="mt-2 max-w-3xl text-sm" style={BODY}>
          We build custom tools around your process — automation, controlling, integrations
          (including KSeF), ERP imports and document workflows — deployed in days, not months,
          running on-premise so your data never leaves your company. For 20–250-person companies
          on Windows + Excel. See the <a href="/narzedzia" style={LINK}>tools we've built</a>, the{" "}
          <a href="/oferta" style={LINK}>offer</a> and the <a href="/faq" style={LINK}>FAQ</a>.
        </p>
      </section>

      <p className="mt-8 text-xs" style={MUTED}>
        Interaktywna wersja strony (żywe dema) uruchamia się z JavaScriptem.
        © 2026 Klarow · Automatyzacja i porządek w danych dla MŚP · Polska / USA
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
        Przykłady realizacji — dema i wdrożenia
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
                {" — "}
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
              {" — "}
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
        Oferta: Pilot na kopii — efekt w dni, nie w miesiące
      </h1>
      <p className="mt-4 max-w-3xl text-sm" style={BODY}>
        Jeden proces, stała cena, ≤10 dni roboczych. Budujemy na kopii Twoich plików, a pierwszy
        namacalny efekt — raport błędów z Twoich prawdziwych danych — widzisz w dniu 5. Zapis na
        oryginałach dopiero po Twojej akceptacji.
      </p>
      <ul className="mt-3 flex flex-col gap-1.5 text-sm" style={BODY}>
        <li>· Dzień 0: wybór procesu i zamrożenie zakresu (wliczony)</li>
        <li>· Dni 1–4: budowa wyłącznie na kopiach Twoich plików</li>
        <li>· Dzień 5: pokaz na żywo + raport błędów z Twoich prawdziwych danych</li>
        <li>· Płatność 50/50 — druga rata po działającym odbiorze</li>
        <li>· Zanim cokolwiek kupisz: przyślij nam swój najgorszy Excel — w 30 minut pokażemy na próbce, co da się z nim zrobić</li>
      </ul>

      <H2>Dlaczego dni, nie miesiące</H2>
      <p className="mt-2 max-w-3xl text-sm" style={BODY}>
        Diagnoza na kopiach Twoich plików, zakres zamrożony na piśmie w Dniu 0; budowa na gotowych
        wzorcach — silnik (zapis, walidacja, backup, log audytowy) już istnieje; TEST bez zapisu
        (pełna lista zmian do przejrzenia, w Twoich plikach nic się nie dzieje); PROD dopiero po
        Twojej akceptacji — z backupem przed każdą zmianą i logiem operacji.
      </p>

      <H2>Zaufanie na mechanizmach, nie przymiotnikach</H2>
      <p className="mt-2 max-w-3xl text-sm" style={BODY}>
        On-premise: dane nie opuszczają firmy, a po wdrożeniu nie mamy do nich dostępu. Kod,
        dokumentacja i runbook zostają u Ciebie — narzędzie działa nawet bez nas. Stała cena i
        zakres na piśmie; druga rata dopiero po działającym odbiorze.
      </p>

      <H2>Dla kogo (i dla kogo nie)</H2>
      <p className="mt-2 max-w-3xl text-sm" style={BODY}>
        Będzie nam po drodze z firmami produkcyjnymi, budowlanymi i dystrybucyjnymi (20–250 osób,
        Windows + Excel), którym raportowanie i tak żyje w Excelu, a chcą efektu w dni. Nie robimy
        migracji do chmury ani wymiany ERP; nie działamy na Google Sheets / Mac i nie sprzedajemy
        godzin (body-leasing) — sprzedajemy rezultat.
      </p>

      <H2>Jak wygląda współpraca</H2>
      <p className="mt-2 max-w-3xl text-sm" style={BODY}>
        Od pierwszej wiadomości, przez bezpłatną diagnozę na próbce i pilot na kopii, do działającego
        narzędzia i opieki — z dwiema decyzjami, które zawsze należą do Ciebie: co budujemy (zakres
        w Dniu 0) i kiedy wchodzimy na oryginały (po akceptacji TEST-u).
      </p>

      <section lang="en">
        <H2>The offer (English)</H2>
        <p className="mt-2 max-w-3xl text-sm" style={BODY}>
          Pilot on a copy — one process, a fixed price, ≤10 business days. We build on a copy of your
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
        Najczęstsze obiekcje — odpowiadamy wprost
      </h1>
      <p className="mt-3 max-w-3xl text-sm" style={MUTED}>
        Te same pytania słyszymy w każdej rozmowie. Oto odpowiedzi — o bezpieczeństwie danych,
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
          ? "WDROŻENIE u klienta — to realna integracja/aplikacja, nie demo w przeglądarce (wymaga połączenia z zewnętrznym systemem i serwera). Poniżej opis, jak działa i jak jest zbudowana; na żywo pokażemy ją na Twoich danych."
          : "DEMO na danych przykładowych — pełna, interaktywna wersja działa na tej stronie po uruchomieniu JavaScriptu: w całości w Twojej przeglądarce, bez logowania i bez chmury."}
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

/* ── wyjścia ────────────────────────────────────────────────────────── */

function sitemapXml(tools: ToolItem[]): string {
  const urls = [
    `  <url><loc>${ORIGIN}/</loc><priority>1.0</priority></url>`,
    `  <url><loc>${ORIGIN}/narzedzia</loc><priority>0.9</priority></url>`,
    `  <url><loc>${ORIGIN}/oferta</loc><priority>0.9</priority></url>`,
    `  <url><loc>${ORIGIN}/faq</loc><priority>0.7</priority></url>`,
    ...tools.map(
      (t) =>
        `  <url><loc>${ORIGIN}/narzedzia/${t.slug}</loc><priority>${SITEMAP_PRIORITY[t.slug] ?? "0.7"}</priority></url>`
    ),
  ].join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<!-- GENEROWANE przy buildzie z site/src/data/tools.ts (scripts/prerender.mjs) — nie edytuj ręcznie -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

function llmsTxt(pl: ToolItem[], en: ToolItem[]): string {
  const toolsPl = pl
    .map((t) => `- [${t.name}](${ORIGIN}/narzedzia/${t.slug}): ${t.tagline}`)
    .join("\n");
  const toolsEn = en
    .map((t) => `- [${t.name}](${ORIGIN}/narzedzia/${t.slug}): ${t.tagline}`)
    .join("\n");
  return `# Klarow

> Custom narzędzia pod proces dla firm 20–250 osób, które „wyrosły na Excelu" (produkcja,
> budownictwo, dystrybucja; Windows + Excel): automatyzacja, kontroling, integracje (m.in. KSeF),
> importy z ERP, obieg dokumentów. Wdrożenie w dni, nie w miesiące. Narzędzia działają on-premise
> — dane nie opuszczają firmy. To nie zamknięty katalog: budujemy narzędzie pod konkretny proces.

Główne strony: [Narzędzia](${ORIGIN}/narzedzia) · [Oferta](${ORIGIN}/oferta) · [FAQ](${ORIGIN}/faq)

Dwa twarde wyróżniki:
- Prawdziwie zero chmury: narzędzia działają lokalnie, bez API i bez serwera — nie mają nawet
  którędy wysłać danych. Dema na klarow.com liczą w 100% w przeglądarce, bez logowania.
- Determinizm: te same dane wejściowe zawsze dają ten sam wynik („kalkulator, nie wróżka");
  każdą liczbę można sprawdzić ręcznie dzięki jawnej ścieżce wyliczenia.

Oferta wejściowa: „Pilot na kopii" — jeden proces, ≤10 dni roboczych, budowa na kopiach plików,
pierwszy efekt w dniu 5, płatność 50/50 (druga rata po działającym odbiorze). Wycena po bezpłatnej
diagnozie: stała cena za zamrożony zakres, bez stawki godzinowej; kolejne narzędzia wyceniane
osobno. Przed zakupem: „przyślij nam swój najgorszy Excel" — bezpłatna 30-minutowa diagnoza na
próbce. Szczegóły: ${ORIGIN}/oferta

## Co budujemy

Raporty i kontroling · integracje i e-dokumenty (KSeF, e-faktury, API urzędowe, ERP) · importy
i scalanie danych · obieg dokumentów · panele i dashboardy · porządek w danych (audyt, migracje).

## Narzędzia i realizacje (dema na żywo + wdrożenia u klienta)

${toolsPl}

## FAQ

Odpowiedzi na typowe obiekcje (koszt, bezpieczeństwo danych, „mamy już ERP", ryzyko dla
działających makr): ${ORIGIN}/faq

## Kontakt

- E-mail: ${EMAIL}
- Telefon: +48 ${PHONE_DISPLAY}
- Obszar działania: Polska i USA
- Strona: ${ORIGIN}

## English

Klarow builds on-premise data automation tools for 20–250-person companies that grew up on
Excel (manufacturing, construction, distribution). Deployed in days, not months; truly
zero-cloud (tools run locally, demos compute entirely in the browser) and deterministic
(same input, same output — every number can be verified by hand).

${toolsEn}
`;
}

export function prerenderAll(): { routes: RouteOut[]; sitemap: string; llms: string } {
  const pl = getTools("pl");
  const en = getTools("en");

  const routes: RouteOut[] = [
    {
      file: "index.html",
      path: "/",
      title: PAGES_SEO.home.title.pl,
      description: PAGES_SEO.home.description.pl,
      jsonLd: [ORG_JSONLD],
      bodyHtml: renderToStaticMarkup(<HomeShell />),
    },
    {
      file: "narzedzia.html",
      path: "/narzedzia",
      title: PAGES_SEO.tools.title.pl,
      description: PAGES_SEO.tools.description.pl,
      jsonLd: [ORG_JSONLD],
      bodyHtml: renderToStaticMarkup(<ToolsShell pl={pl} en={en} />),
    },
    {
      file: "oferta.html",
      path: "/oferta",
      title: PAGES_SEO.oferta.title.pl,
      description: PAGES_SEO.oferta.description.pl,
      jsonLd: [ORG_JSONLD],
      bodyHtml: renderToStaticMarkup(<OfferShell />),
    },
    {
      file: "faq.html",
      path: "/faq",
      title: PAGES_SEO.faq.title.pl,
      description: PAGES_SEO.faq.description.pl,
      jsonLd: [faqPageJsonLd(FAQ_I18N.pl)],
      bodyHtml: renderToStaticMarkup(<FaqShell />),
    },
    ...pl.map((t): RouteOut => {
      const path = `/narzedzia/${t.slug}`;
      const description = t.seo?.description ?? t.tagline;
      const tEn = en.find((x) => x.slug === t.slug)!;
      return {
        file: `narzedzia/${t.slug}.html`,
        path,
        title: t.seo?.title ?? `${t.name} — działające demo online | Klarow`,
        description,
        jsonLd: t.faq?.length
          ? [toolJsonLd(t.name, description, path), faqPageJsonLd(t.faq)]
          : [toolJsonLd(t.name, description, path)],
        bodyHtml: renderToStaticMarkup(<ToolShell pl={t} en={tEn} all={pl} />),
      };
    }),
  ];

  return { routes, sitemap: sitemapXml(pl), llms: llmsTxt(pl, en) };
}
