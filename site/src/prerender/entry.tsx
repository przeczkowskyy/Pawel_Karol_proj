import { renderToStaticMarkup } from "react-dom/server";
import { getTools, DEPTS, type ToolItem } from "@/data/tools";
import { FAQ_I18N } from "@/data/faq";
import { ORG_JSONLD, toolJsonLd, faqPageJsonLd } from "@/components/Seo";

/* Prerender (SSG) — budowany osobno przez `vite build --ssr` i odpalany
   node'em PO buildzie klienta (scripts/prerender.mjs). Generuje:
   - statyczny HTML „SEO shell" dla / i 12 podstron /narzedzia/* — meta,
     JSON-LD i PEŁNA treść tekstowa strony są w HTML-u bez JS (crawlery
     Google/Bing/LLM bez wykonywania JS widzą wszystko; przy okazji strona
     degraduje się łaskawie, gdy JS w ogóle nie wstanie),
   - sitemap.xml i llms.txt liczone z tools.ts (jedno źródło prawdy).
   React po zamontowaniu PODMIENIA zawartość #root (createRoot().render
   czyści kontener) — shell żyje tylko do startu aplikacji.
   Zero window/document, zero dat, zero losowości — czysty render. */

const ORIGIN = "https://klarow.com";
const EMAIL = "kontakt@klarow.com";
const PHONE_DISPLAY = "786 296 426";
const PHONE_HREF = "tel:+48786296426";

/* priorytety sitemap jak w dotychczasowym ręcznym pliku */
const SITEMAP_PRIORITY: Record<string, string> = {
  "raport-zarzadczy": "0.9",
  "audyt-jakosci-danych": "0.9",
  "dashboard-produkcji": "0.8",
  "os-czasu-zadan": "0.8",
  "import-z-rekoncyliacja": "0.8",
  "importy-erp": "0.8",
  "kontroling-kosztow": "0.8",
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

function ContactLine() {
  return (
    <p className="mt-6 text-sm" style={BODY}>
      Kontakt: <a href={`mailto:${EMAIL}`} style={{ color: "var(--accent-foreground)", fontWeight: 700 }}>{EMAIL}</a>
      {" · "}
      <a href={PHONE_HREF} style={{ color: "var(--accent-foreground)", fontWeight: 700 }}>{PHONE_DISPLAY}</a>
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

/* ── shell strony głównej ───────────────────────────────────────────── */

function HomeShell({ pl, en }: { pl: ToolItem[]; en: ToolItem[] }) {
  return (
    <ShellChrome>
      <span className="brand-word" style={{ fontSize: 15 }}>KLAROW</span>
      <h1 className="mt-4 text-4xl font-extrabold tracking-tight" style={HEAD}>
        Porządek w danych dla firm, które wyrosły na Excelu.
      </h1>
      <p className="mt-4 max-w-3xl text-lg" style={BODY}>
        Zamieniamy ręczne przeklejanie, kruche makra i mailowy obieg dokumentów w audytowalne
        narzędzia. <strong>Wdrożenie w dni, nie w miesiące</strong> — a Twoje dane nie opuszczają
        firmy. Raport zarządczy w kilkanaście sekund zamiast godzin. Dla firm 20–250 osób,
        środowisko Windows + Excel, narzędzia działają on-premise.
      </p>
      <ContactLine />

      <H2>Narzędzia — każde działa na tej stronie na żywo, na danych przykładowych</H2>
      <p className="mt-2 max-w-3xl text-sm" style={MUTED}>
        Klikasz, liczysz, pobierasz dokumenty — dokładnie tak, jak u klienta: lokalnie, bez chmury,
        bez logowania. Zbudowaliśmy wcześniej ekosystem kilkunastu takich narzędzi dla firmy
        produkcyjno-budowlanej (~30 równoległych projektów, klienci w USA): ~10 000 wierszy kosztów
        z ERP miesięcznie, raport zarządczy w kilkanaście sekund, zamknięcie ~30 projektów jednym
        przyciskiem i kontrola sum co do grosza.
      </p>
      {DEPTS.map((d) => (
        <section key={d.key}>
          <h3 className="mt-5 text-[15px] font-bold" style={HEAD}>{d.label.pl}</h3>
          <p className="text-[13px]" style={MUTED}>{d.desc.pl}</p>
          <ul className="mt-2 flex flex-col gap-1.5">
            {pl.filter((t) => t.dept === d.key).map((t) => (
              <li key={t.slug} className="text-[13.5px]" style={BODY}>
                <a href={`/narzedzia/${t.slug}`} style={{ color: "var(--accent-foreground)", fontWeight: 700 }}>
                  {t.name}
                </a>
                {" — "}
                {t.tagline}
              </li>
            ))}
          </ul>
        </section>
      ))}

      <H2>Dwa twarde wyróżniki: zero chmury i zero wróżenia</H2>
      <p className="mt-2 max-w-3xl text-sm" style={BODY}>
        „On-premise" deklaruje dziś każdy — my idziemy krok dalej. Narzędzia Klarow nie mają nawet
        którędy wysłać Twoich danych: działają lokalnie, bez API, bez serwera, a dema na tej
        stronie liczą w 100% w przeglądarce. Druga rzecz: determinizm. Te same dane wejściowe dają
        zawsze ten sam wynik — kalkulator, nie wróżka — więc każdą liczbę możesz policzyć ręcznie.
      </p>

      <H2>Oferta: Pilot na kopii — jeden proces, stała cena, ≤10 dni roboczych</H2>
      <ul className="mt-2 flex flex-col gap-1.5 text-sm" style={BODY}>
        <li>· Dzień 0: wybór procesu i zamrożenie zakresu (wliczony)</li>
        <li>· Dni 1–4: budowa wyłącznie na kopiach Twoich plików</li>
        <li>· Dzień 5: pokaz na żywo + raport błędów z Twoich prawdziwych danych</li>
        <li>· Płatność 50/50 — druga rata po działającym odbiorze</li>
        <li>· Zanim cokolwiek kupisz: przyślij nam swój najgorszy Excel — w 30 minut pokażemy na próbce, co da się z nim zrobić</li>
      </ul>

      <H2>Najczęstsze obiekcje — odpowiadamy wprost</H2>
      {FAQ_I18N.pl.map((f) => (
        <section key={f.id} className="mt-4 max-w-3xl">
          <h3 className="text-[14px] font-bold" style={HEAD}>{f.q}</h3>
          <p className="mt-1 text-[13px] leading-relaxed" style={MUTED}>{f.a}</p>
        </section>
      ))}

      <section lang="en">
        <H2>Klarow in English</H2>
        <p className="mt-2 max-w-3xl text-sm" style={BODY}>
          Order in the data of 20–250-person companies that grew up on Excel. We turn manual
          copy-pasting, fragile macros and email-driven document flows into auditable tools —
          deployed in days, not months, running on-premise so your data never leaves your company.
          Live demos of all tools run on this site, entirely in your browser.
        </p>
        <ul className="mt-3 flex flex-col gap-1.5 text-[13.5px]" style={BODY}>
          {en.map((t) => (
            <li key={t.slug}>
              <a href={`/narzedzia/${t.slug}`} style={{ color: "var(--accent-foreground)", fontWeight: 700 }}>
                {t.name}
              </a>
              {" — "}
              {t.tagline}
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-8 text-xs" style={MUTED}>
        Interaktywna wersja strony (żywe dema, deck) uruchamia się z JavaScriptem.
        © 2026 Klarow · Automatyzacja i porządek w danych dla MŚP · Polska / USA
      </p>
    </ShellChrome>
  );
}

/* ── shell podstrony narzędzia ──────────────────────────────────────── */

function ToolShell({ pl, en, all }: { pl: ToolItem; en: ToolItem; all: ToolItem[] }) {
  return (
    <ShellChrome>
      <p className="text-[13px]" style={MUTED}>
        <a href="/" style={{ color: "var(--accent-foreground)", fontWeight: 700 }}>KLAROW</a>
        {" · "}
        <a href="/#narzedzia" style={{ color: "var(--accent-foreground)", fontWeight: 700 }}>Wszystkie narzędzia</a>
      </p>
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight" style={HEAD}>{pl.name}</h1>
      <p className="mt-3 max-w-3xl text-[15px] leading-relaxed" style={BODY}>{pl.tagline}</p>
      <p className="mt-2 text-[12.5px]" style={MUTED}>
        DEMO na danych przykładowych — pełna, interaktywna wersja działa na tej stronie po
        uruchomieniu JavaScriptu: w całości w Twojej przeglądarce, bez logowania i bez chmury.
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
            <a href={`/narzedzia/${x.slug}`} style={{ color: "var(--accent-foreground)", fontWeight: 700 }}>
              {x.name}
            </a>
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
      </section>

      <ContactLine />
    </ShellChrome>
  );
}

/* ── wyjścia ────────────────────────────────────────────────────────── */

function sitemapXml(tools: ToolItem[]): string {
  const urls = [
    `  <url><loc>${ORIGIN}/</loc><priority>1.0</priority></url>`,
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

> Automatyzacja, upraszczanie i porządek w danych dla firm 20–250 osób, które „wyrosły na Excelu"
> (produkcja, budownictwo, dystrybucja; Windows + Excel). Wdrożenie w dni, nie w miesiące.
> Narzędzia działają on-premise — dane nie opuszczają firmy.

Dwa twarde wyróżniki:
- Prawdziwie zero chmury: narzędzia działają lokalnie, bez API i bez serwera — nie mają nawet
  którędy wysłać danych. Dema na klarow.com liczą w 100% w przeglądarce, bez logowania.
- Determinizm: te same dane wejściowe zawsze dają ten sam wynik („kalkulator, nie wróżka");
  każdą liczbę można sprawdzić ręcznie dzięki jawnej ścieżce wyliczenia.

Oferta wejściowa: „Pilot na kopii" — jeden proces, stała cena, ≤10 dni roboczych, budowa na
kopiach plików, pierwszy efekt w dniu 5, płatność 50/50 (druga rata po działającym odbiorze).
Przed zakupem: „przyślij nam swój najgorszy Excel" — bezpłatna 30-minutowa diagnoza na próbce.

## Narzędzia (każde z działającym demo na żywo)

${toolsPl}

## FAQ

Odpowiedzi na typowe obiekcje (koszt, bezpieczeństwo danych, „mamy już ERP", ryzyko dla
działających makr): ${ORIGIN}/#faq

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
      title: "Klarow — automatyzacja danych i narzędzia kontrolingu. Wdrożenie w dni.",
      description:
        "Porządek w danych dla firm 20–250 osób, które wyrosły na Excelu. Działające demo narzędzi: raport zarządczy, kontroling kosztów, audyt jakości danych, importy ERP, płatności. Dane zostają u Ciebie (on-premise).",
      jsonLd: [ORG_JSONLD, faqPageJsonLd(FAQ_I18N.pl)],
      bodyHtml: renderToStaticMarkup(<HomeShell pl={pl} en={en} />),
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
