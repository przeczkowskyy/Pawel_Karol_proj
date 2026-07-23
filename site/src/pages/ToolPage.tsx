import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRightLeft, Check, Play, TrendingUp } from "lucide-react";
import { findTool, getTools, CATEGORY_LABEL, DEPT_LABEL, type DashboardKey } from "@/data/tools";
import { useLang, pick } from "@/i18n";
import Seo, { toolJsonLd, faqPageJsonLd } from "@/components/Seo";
import DemoReport from "@/components/DemoReport";
import ProductionDashboard from "@/components/dashboards/ProductionDashboard";
import QualityGate from "@/components/dashboards/QualityGate";
import TaskTimeline from "@/components/dashboards/TaskTimeline";
import PaymentCalculator from "@/components/dashboards/PaymentCalculator";
import ImportReconciliation from "@/components/dashboards/ImportReconciliation";
import G703Billing from "@/components/dashboards/G703Billing";
import PaymentFlow from "@/components/dashboards/PaymentFlow";
import CostControl from "@/components/dashboards/CostControl";
import ErpImports from "@/components/dashboards/ErpImports";
import LabourProtocols from "@/components/dashboards/LabourProtocols";
import ContractRegister from "@/components/dashboards/ContractRegister";

/* Podstrona narzędzia /narzedzia/:slug — KAŻDE narzędzie działa na żywo na
   danych DEMO (bez statusów). Osobna podzakładka per narzędzie = SEO/trust.
   Normalny scroll dokumentu (poza deckiem landingu). Dane fikcyjne,
   marka źródłowa nieujawniona (zasada #3). */

const DASHBOARDS: Record<DashboardKey, React.ComponentType> = {
  report: DemoReport,
  production: ProductionDashboard,
  quality: QualityGate,
  timeline: TaskTimeline,
  payments: PaymentCalculator,
  reconciliation: ImportReconciliation,
  g703: G703Billing,
  paymentflow: PaymentFlow,
  costcontrol: CostControl,
  erpimports: ErpImports,
  protocols: LabourProtocols,
  contracts: ContractRegister,
};

const T = {
  pl: {
    notFound: "Nie znaleziono narzędzia",
    back: "Wróć na stronę główną",
    all: "Wszystkie narzędzia",
    demo: "DEMO — dane przykładowe",
    liveHint: "Pełna wersja działa poniżej — w całości w Twojej przeglądarce, bez logowania.",
    replaces: "Co zastępuje",
    io: "Wejście → wyjście",
    whatYouGet: "Co dostajesz",
    otherTools: "Inne narzędzia",
    faqHead: "Częste pytania o to narzędzie",
    cta: "Umów bezpłatną diagnozę",
    ctaSub: "Chcesz zobaczyć to narzędzie na SWOICH danych? Przyślij nam swój najgorszy Excel.",
  },
  en: {
    notFound: "Tool not found",
    back: "Back to the homepage",
    all: "All tools",
    demo: "DEMO — sample data",
    liveHint: "The full version runs below — entirely in your browser, no sign-up.",
    replaces: "What it replaces",
    io: "Input → output",
    whatYouGet: "What you get",
    otherTools: "Other tools",
    faqHead: "Common questions about this tool",
    cta: "Book a free diagnosis",
    ctaSub: "Want to see this tool on YOUR data? Send us your worst Excel.",
  },
};

export default function ToolPage({ onBook }: { onBook: () => void }) {
  const { lang } = useLang();
  const t = pick(lang, T);
  const { slug } = useParams<{ slug: string }>();
  const tool = slug ? findTool(slug, lang) : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!tool) {
    return (
      <div className="max-w-3xl mx-auto px-6 pt-36 pb-24 text-center">
        <h1 className="text-2xl font-extrabold" style={{ color: "var(--heading)" }}>
          {t.notFound}
        </h1>
        <Link className="btn btn-secondary mt-6 inline-flex" to="/">
          <ArrowLeft size={15} /> {t.back}
        </Link>
      </div>
    );
  }

  const Icon = tool.icon;
  const Dashboard = DASHBOARDS[tool.dashboard];
  const path = `/narzedzia/${tool.slug}`;

  return (
    <div className="max-w-6xl mx-auto px-6 pt-32 pb-24">
      <Seo
        title={tool.seo?.title ?? `${tool.name} — ${lang === "pl" ? "działające demo online" : "live online demo"} | Klarow`}
        description={tool.seo?.description ?? tool.tagline}
        path={path}
        jsonLd={
          tool.faq?.length
            ? [toolJsonLd(tool.name, tool.seo?.description ?? tool.tagline, path), faqPageJsonLd(tool.faq)]
            : toolJsonLd(tool.name, tool.seo?.description ?? tool.tagline, path)
        }
      />

      <Link
        to="/#narzedzia"
        className="inline-flex items-center gap-1.5 text-[13px] font-bold"
        style={{ color: "var(--muted-foreground)" }}
      >
        <ArrowLeft size={14} /> {t.all}
      </Link>

      {/* nagłówek */}
      <div className="mt-6 flex items-start gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "rgba(168,180,194,.14)", color: "var(--primary)" }}
        >
          <Icon size={22} />
        </div>
        <div className="min-w-0">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ color: "var(--heading)" }}>
            {tool.name}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="st st-green">
              <Play className="st-ico" /> {t.demo}
            </span>
            <span className="chip">{pick(lang, DEPT_LABEL[tool.dept])}</span>
            <span className="chip">{pick(lang, CATEGORY_LABEL[tool.category])}</span>
          </div>
          <p className="mt-4 max-w-3xl text-[15px] leading-relaxed" style={{ color: "var(--foreground)" }}>
            {tool.tagline}
          </p>
        </div>
      </div>

      {/* interaktywny dashboard — zawsze */}
      <div className="mt-8">
        <p className="text-[12px]" style={{ color: "var(--muted-foreground)", marginBottom: 10 }}>
          {t.liveHint}
        </p>
        <Dashboard />
      </div>

      {/* opis: co zastępuje / we-wy / co dostajesz */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        <div className="card">
          <div className="lbl-sm" style={{ marginBottom: 8 }}>
            <ArrowRightLeft size={13} style={{ verticalAlign: "-2px", marginRight: 5 }} />
            {t.replaces}
          </div>
          <p className="text-[13px] leading-relaxed" style={{ color: "var(--foreground)" }}>
            {tool.replaces}
          </p>
        </div>
        <div className="card">
          <div className="lbl-sm" style={{ marginBottom: 8 }}>
            <TrendingUp size={13} style={{ verticalAlign: "-2px", marginRight: 5 }} />
            {t.io}
          </div>
          <p className="text-[13px] leading-relaxed" style={{ color: "var(--foreground)" }}>
            {tool.io}
          </p>
        </div>
        <div className="card">
          <div className="lbl-sm" style={{ marginBottom: 10 }}>{t.whatYouGet}</div>
          <ul className="flex flex-col gap-2.5">
            {tool.bullets.map((b) => (
              <li key={b} className="flex items-start gap-2 text-[13px]" style={{ color: "var(--foreground)" }}>
                <Check size={14} style={{ color: "var(--funded)", flex: "0 0 auto", marginTop: 2 }} />
                {b}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* częste pytania (GEO: treść stale w DOM — bez akordeonu) */}
      {tool.faq?.length ? (
        <div className="mt-10">
          <h2 className="text-[20px] font-extrabold tracking-tight" style={{ color: "var(--heading)" }}>
            {t.faqHead}
          </h2>
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
            {tool.faq.map((f) => (
              <div key={f.q} className="card" style={{ padding: 18 }}>
                <h3 className="text-[13.5px] font-bold" style={{ color: "var(--heading)" }}>
                  {f.q}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                  {f.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* inne narzędzia (crosslinki = SEO wewnętrzne) */}
      <div className="mt-10">
        <div className="lbl-sm" style={{ marginBottom: 10 }}>{t.otherTools}</div>
        <div className="flex flex-wrap gap-2">
          {getTools(lang)
            .filter((x) => x.slug !== tool.slug)
            .map((x) => (
              <Link key={x.slug} to={`/narzedzia/${x.slug}`} className="st st-gray" style={{ cursor: "pointer" }}>
                {x.name}
              </Link>
            ))}
        </div>
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-4">
        <button className="btn btn-primary" type="button" onClick={onBook}>
          {t.cta}
        </button>
        <span className="text-[12.5px]" style={{ color: "var(--muted-foreground)" }}>{t.ctaSub}</span>
      </div>
    </div>
  );
}
