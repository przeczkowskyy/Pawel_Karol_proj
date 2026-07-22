import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check, Clock, Hourglass, Play, ArrowRightLeft, TrendingUp } from "lucide-react";
import { findTool, getTools, CATEGORY_LABEL, type ToolStatus } from "@/data/tools";
import { useLang, pick } from "@/i18n";
import DemoReport from "@/components/DemoReport";
import ProductionDashboard from "@/components/dashboards/ProductionDashboard";
import QualityGate from "@/components/dashboards/QualityGate";
import TaskTimeline from "@/components/dashboards/TaskTimeline";
import PaymentCalculator from "@/components/dashboards/PaymentCalculator";
import ImportReconciliation from "@/components/dashboards/ImportReconciliation";
import G703Billing from "@/components/dashboards/G703Billing";

/* Podstrona narzędzia /narzedzia/:slug — opis + OSADZONY interaktywny dashboard
   (dla status:"live"). Normalny scroll dokumentu (poza deckiem landingu).
   Dane fikcyjne, marka źródłowa nieujawniona (zasada #3). */

const T = {
  pl: {
    notFound: "Nie znaleziono narzędzia",
    back: "Wróć na stronę główną",
    all: "Wszystkie narzędzia",
    status: { live: "DZIAŁA NA ŻYWO", preview: "PODGLĄD WKRÓTCE", soon: "NA ROADMAPIE" } as Record<ToolStatus, string>,
    liveHint: "Poniżej działa pełna wersja — na danych przykładowych, w całości w Twojej przeglądarce.",
    whatItDoes: "Co robi",
    replaces: "Co zastępuje",
    io: "Wejście → wyjście",
    whatYouGet: "Co dostajesz",
    dashboard: "Interaktywny dashboard",
    previewTitle: "Dashboard w budowie",
    previewBody: "Opis jest gotowy — interaktywną wersję tego narzędzia wpinamy tu wkrótce. Chcesz zobaczyć je na swoich danych już teraz?",
    soonTitle: "Na roadmapie narzędzi",
    soonBody: "To narzędzie odtwarzamy w kolejnym podejściu. Napisz, jeśli akurat ten proces boli Cię najbardziej — spriorytetyzujemy.",
    cta: "Umów bezpłatną diagnozę",
    otherTools: "Inne narzędzia",
    tryLive: "Zobacz narzędzie działające na żywo",
  },
  en: {
    notFound: "Tool not found",
    back: "Back to the homepage",
    all: "All tools",
    status: { live: "LIVE", preview: "PREVIEW SOON", soon: "ROADMAP" } as Record<ToolStatus, string>,
    liveHint: "The full version runs below — on sample data, entirely in your browser.",
    whatItDoes: "What it does",
    replaces: "What it replaces",
    io: "Input → output",
    whatYouGet: "What you get",
    dashboard: "Interactive dashboard",
    previewTitle: "Dashboard in build",
    previewBody: "The description is ready — we're wiring up the interactive version here soon. Want to see it on your data now?",
    soonTitle: "On the tools roadmap",
    soonBody: "We're rebuilding this one in a later pass. Tell us if this is the process that hurts most — we'll prioritise it.",
    cta: "Book a free diagnosis",
    otherTools: "Other tools",
    tryLive: "See a tool running live",
  },
};

function statusChip(status: ToolStatus, label: string) {
  if (status === "live")
    return (
      <span className="st st-green">
        <Play className="st-ico" /> {label}
      </span>
    );
  if (status === "preview")
    return (
      <span className="st st-accent">
        <Clock className="st-ico" /> {label}
      </span>
    );
  return (
    <span className="st st-gray st-open">
      <Hourglass className="st-ico" /> {label}
    </span>
  );
}

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
  const firstLive = getTools(lang).find((x) => x.status === "live" && x.slug !== tool.slug);

  return (
    <div className="max-w-6xl mx-auto px-6 pt-32 pb-24">
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
            {statusChip(tool.status, t.status[tool.status])}
            <span className="chip">{pick(lang, CATEGORY_LABEL[tool.category])}</span>
          </div>
          <p className="mt-4 max-w-3xl text-[15px] leading-relaxed" style={{ color: "var(--foreground)" }}>
            {tool.tagline}
          </p>
        </div>
      </div>

      {/* interaktywny dashboard (live) */}
      {tool.status === "live" && tool.dashboard && (
        <div className="mt-8">
          <div className="flex items-center gap-2" style={{ marginBottom: 10 }}>
            <span className="lbl-sm">{t.dashboard}</span>
            <span className="text-[12px]" style={{ color: "var(--muted-foreground)" }}>
              {t.liveHint}
            </span>
          </div>
          {tool.dashboard === "report" && <DemoReport />}
          {tool.dashboard === "production" && <ProductionDashboard />}
          {tool.dashboard === "quality" && <QualityGate />}
          {tool.dashboard === "timeline" && <TaskTimeline />}
          {tool.dashboard === "payments" && <PaymentCalculator />}
          {tool.dashboard === "reconciliation" && <ImportReconciliation />}
          {tool.dashboard === "g703" && <G703Billing />}
        </div>
      )}

      {/* preview / soon — brak live */}
      {tool.status !== "live" && (
        <div className="card mt-8" style={{ padding: 24 }}>
          <h2 className="text-[16px] font-extrabold" style={{ color: "var(--heading)" }}>
            {tool.status === "preview" ? t.previewTitle : t.soonTitle}
          </h2>
          <p className="mt-2 text-[13.5px] leading-relaxed max-w-2xl" style={{ color: "var(--muted-foreground)" }}>
            {tool.status === "preview" ? t.previewBody : t.soonBody}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button className="btn btn-primary" type="button" onClick={onBook}>
              {t.cta}
            </button>
            {firstLive && (
              <Link className="btn btn-secondary" to={`/narzedzia/${firstLive.slug}`}>
                <Play size={15} /> {t.tryLive}
              </Link>
            )}
          </div>
        </div>
      )}

      {/* opis: co zastępuje / we-wy / co dostajesz */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
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

      {/* inne narzędzia */}
      <div className="mt-10">
        <div className="lbl-sm" style={{ marginBottom: 10 }}>{t.otherTools}</div>
        <div className="flex flex-wrap gap-2">
          {getTools(lang)
            .filter((x) => x.slug !== tool.slug)
            .slice(0, 8)
            .map((x) => (
              <Link key={x.slug} to={`/narzedzia/${x.slug}`} className="st st-gray" style={{ cursor: "pointer" }}>
                {x.status === "live" && <Play className="st-ico" />}
                {x.name}
              </Link>
            ))}
        </div>
      </div>

      <div className="mt-10">
        <button className="btn btn-primary" type="button" onClick={onBook}>
          {t.cta}
        </button>
      </div>
    </div>
  );
}
