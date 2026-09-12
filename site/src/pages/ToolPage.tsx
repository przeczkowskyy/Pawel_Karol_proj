import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRightLeft, Building2, Check, Play, TrendingUp } from "lucide-react";
import {
  getTools,
  CATEGORY_LABEL,
  DEPT_LABEL,
  type ToolKind,
} from "@/data/tools";
/* meta i FAQ per slug: wersja z SEO, bo ten plik jest chunkiem lazy podstrony */
import { findToolWithSeo } from "@/data/toolsSeo";
import { MAIL_WORST_EXCEL } from "@/data/contact";
import { MESSAGING, type Bilingual } from "@/data/messaging";
import { useLang, pick } from "@/i18n";
import Seo, { toolJsonLd, faqPageJsonLd } from "@/components/Seo";
import { DashboardMount } from "@/motion/DashboardMount";

/* Podstrona narzędzia /narzedzia/:slug. Dashboard wchodzi przez DashboardMount:
   osobny chunk per narzędzie (mapa literalnych import() w src/motion/DashboardMount.tsx),
   montaż dopiero przy zbliżeniu do ekranu, zarezerwowana wysokość szkieletu, więc
   treść pod spodem nie skacze (code-lazy-routes-and-dashboards, perf-code-split-dashboards).
   Scroll na górę przy zmianie trasy robi <ScrollToTop /> w App.tsx; drugi listener
   w tym pliku był duplikatem.

   Dane fikcyjne, marka źródłowa nieujawniona (zasada #3 CLAUDE.md). */

/* Etykieta dowodu z JEDNEGO źródła (brand-honest-labels: „WDROŻONE” bez pokrycia
   wysadza wiarygodność pozostałych kart). tools.ts zna dziś tylko „demo” i „case”,
   a jedyny wpis „case” to KSeF, czyli WŁASNY produkt bez klienta zewnętrznego
   (decyzja D-10), stąd mapa na proofLabels.product. Gdy model tools.ts dostanie
   trzeci rodzaj („product”, plan §8.3), mapa dostaje trzeci klucz, a ten akapit znika. */
const PROOF_LABEL: Record<ToolKind, Bilingual> = {
  demo: MESSAGING.proofLabels.demo,
  case: MESSAGING.proofLabels.product,
};

const T = {
  pl: {
    notFound: "Nie znaleziono narzędzia",
    back: "Wróć na stronę główną",
    all: "Wszystkie realizacje i dema",
    liveHint: "Pełna wersja działa poniżej, w całości w Twojej przeglądarce, bez logowania.",
    caseTitle: "Własny produkt, nie demo w przeglądarce",
    caseHint:
      "Integracja z zewnętrznym API i praca po stronie serwera, więc nie odpali się na tej stronie. Niżej opisujemy, co robi i jak jest zbudowana; na żywo pokażemy ją na Twoich danych.",
    replaces: "Co zastępuje",
    io: "Wejście i wyjście",
    whatYouGet: "Co dostajesz",
    otherTools: "Inne realizacje i dema",
    faqHead: "Częste pytania o to narzędzie",
    ctaSub: "Chcesz zobaczyć to narzędzie na swoich danych?",
  },
  en: {
    notFound: "Tool not found",
    back: "Back to the homepage",
    all: "All work and demos",
    liveHint: "The full version runs below, entirely in your browser, no sign-up.",
    caseTitle: "Our own product, not an in-browser demo",
    caseHint:
      "It integrates with an external API and runs server-side, so it cannot run on this page. Below we describe what it does and how it is built; we'll show it live on your data.",
    replaces: "What it replaces",
    io: "Input and output",
    whatYouGet: "What you get",
    otherTools: "Other work and demos",
    faqHead: "Common questions about this tool",
    ctaSub: "Want to see this tool on your own data?",
  },
};

export default function ToolPage({ onBook }: { onBook: () => void }) {
  const { lang } = useLang();
  const t = pick(lang, T);
  const { slug } = useParams<{ slug: string }>();
  const tool = slug ? findToolWithSeo(slug, lang) : undefined;

  if (!tool) {
    return (
      <div className="max-w-3xl mx-auto px-6 pt-36 pb-24 text-center">
        <h1 className="text-2xl font-extrabold text-foreground-strong">{t.notFound}</h1>
        <Link className="btn btn-secondary mt-6 inline-flex" to="/">
          <ArrowLeft size={16} strokeWidth={1.75} aria-hidden="true" /> {t.back}
        </Link>
      </div>
    );
  }

  const Icon = tool.icon;
  const path = `/narzedzia/${tool.slug}`;

  return (
    <div className="max-w-6xl mx-auto px-6 pt-32 pb-24">
      <Seo
        title={
          tool.seo?.title ??
          `${tool.name}, ${lang === "pl" ? "działające demo online" : "live online demo"} | Klarow`
        }
        description={tool.seo?.description ?? tool.tagline}
        path={path}
        jsonLd={
          tool.faq?.length
            ? [toolJsonLd(tool.name, tool.seo?.description ?? tool.tagline, path), faqPageJsonLd(tool.faq)]
            : toolJsonLd(tool.name, tool.seo?.description ?? tool.tagline, path)
        }
      />

      <Link to="/narzedzia" className="inline-flex">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground-muted hover:text-foreground-strong">
          <ArrowLeft size={16} strokeWidth={1.75} aria-hidden="true" /> {t.all}
        </span>
      </Link>

      {/* nagłówek */}
      <div className="mt-6 flex items-start gap-4">
        <div className="w-12 h-12 flex items-center justify-center shrink-0 bg-accent-a12 text-accent-text">
          <Icon size={24} />
        </div>
        <div className="min-w-0">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground-strong">
            {tool.name}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {tool.kind === "case" ? (
              <span className="st st-blue">
                <Check className="st-ico" /> {pick(lang, PROOF_LABEL.case)}
              </span>
            ) : (
              <span className="st st-green">
                <Play className="st-ico" /> {pick(lang, PROOF_LABEL.demo)}
              </span>
            )}
            <span className="chip">{pick(lang, DEPT_LABEL[tool.dept])}</span>
            <span className="chip">{pick(lang, CATEGORY_LABEL[tool.category])}</span>
          </div>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-foreground">{tool.tagline}</p>
        </div>
      </div>

      {/* demo → dashboard montowany leniwie; własny produkt → panel „jak działa" */}
      {tool.kind !== "case" && tool.dashboard ? (
        <div className="mt-8">
          <p className="mb-2.5 text-xs text-foreground-muted">{t.liveHint}</p>
          <DashboardMount dashboard={tool.dashboard} />
        </div>
      ) : (
        <div className="mt-8 card" style={{ padding: 22 }}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 flex items-center justify-center shrink-0 bg-accent-a12 text-accent-text">
              <Building2 size={20} strokeWidth={1.5} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-extrabold text-foreground-strong">{t.caseTitle}</h2>
              <p className="mt-1 text-sm leading-relaxed text-foreground-muted">{t.caseHint}</p>
            </div>
          </div>
        </div>
      )}

      {/* opis: co zastępuje / we-wy / co dostajesz */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        <div className="card">
          <div className="lbl-sm mb-2 flex items-center gap-1.5">
            <ArrowRightLeft size={16} strokeWidth={1.75} aria-hidden="true" />
            {t.replaces}
          </div>
          <p className="text-sm leading-relaxed text-foreground">{tool.replaces}</p>
        </div>
        <div className="card">
          <div className="lbl-sm mb-2 flex items-center gap-1.5">
            <TrendingUp size={16} strokeWidth={1.75} aria-hidden="true" />
            {t.io}
          </div>
          <p className="text-sm leading-relaxed text-foreground">{tool.io}</p>
        </div>
        <div className="card">
          <div className="lbl-sm mb-2.5">{t.whatYouGet}</div>
          <ul className="flex flex-col gap-2.5">
            {tool.bullets.map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm text-foreground">
                <Check
                  size={16}
                  strokeWidth={1.75}
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-ok"
                />
                {b}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* częste pytania (GEO: treść stale w DOM, bez akordeonu) */}
      {tool.faq?.length ? (
        <div className="mt-10">
          <h2 className="text-xl font-extrabold tracking-tight text-foreground-strong">
            {t.faqHead}
          </h2>
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
            {tool.faq.map((f) => (
              <div key={f.q} className="card" style={{ padding: 18 }}>
                <h3 className="text-sm font-bold text-foreground-strong">{f.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground-muted">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* inne realizacje i dema (crosslinki = SEO wewnętrzne) */}
      <div className="mt-10">
        {/* zwykła etykieta, nie eyebrow: trzy `.lbl-sm` w kartach wyżej wyczerpują
            limit z design-eyebrow-cap (3 na plik) */}
        <div className="mb-2.5 text-xs font-bold text-foreground-muted">{t.otherTools}</div>
        <div className="flex flex-wrap gap-2">
          {getTools(lang)
            .filter((x) => x.slug !== tool.slug)
            .map((x) => (
              <Link key={x.slug} to={`/narzedzia/${x.slug}`} className="st st-gray cursor-pointer">
                {x.name}
              </Link>
            ))}
        </div>
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-4">
        <button className="btn btn-primary" type="button" onClick={onBook}>
          {pick(lang, MESSAGING.cta.primary)}
        </button>
        <a className="btn btn-secondary" href={pick(lang, MAIL_WORST_EXCEL)}>
          {pick(lang, MESSAGING.cta.file)}
        </a>
        <span className="text-xs text-foreground-muted">{t.ctaSub}</span>
      </div>
    </div>
  );
}
