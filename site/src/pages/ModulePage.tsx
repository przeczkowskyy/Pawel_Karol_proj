import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check, Clock, Play, TrendingUp } from "lucide-react";
import { findModule, getModules } from "@/data/modules";
import { useLang, pick } from "@/i18n";

/* Podstrona modułu /moduly/:slug — szablon PL/EN. Szczegółowe opisy,
   realne zrzuty i liczby oszczędności dostarczą founderzy — placeholdery
   są jawnie oznaczone. */

const T = {
  pl: {
    notFound: "Nie znaleziono modułu",
    back: "Wróć na stronę główną",
    all: "Wszystkie moduły",
    status: {
      completed: "DOSTĘPNY — sprzedajemy od dziś",
      "in-progress": "FALA 2 — po pierwszych wdrożeniach",
      pending: "ROADMAPA — w przygotowaniu",
    } as Record<"completed" | "in-progress" | "pending", string>,
    deploy: "wdrożenie",
    whatItDoes: "Co robi to narzędzie",
    soon: "Szczegółowy opis wdrożenia, realne zrzuty ekranu i studium przypadku dodamy wkrótce.",
    whatYouSave: "Co oszczędzasz",
    numbersSoon: "dokładne liczby z wdrożeń — wkrótce",
    whatYouGet: "Co dostajesz",
    pairsWith: "Dobrze łączy się z",
    cta: "Umów bezpłatną diagnozę",
    screenAlt: "Zrzut ekranu narzędzia",
    liveDemo: "Zobacz żywe demo w przeglądarce",
  },
  en: {
    notFound: "Module not found",
    back: "Back to the homepage",
    all: "All modules",
    status: {
      completed: "AVAILABLE — selling today",
      "in-progress": "WAVE 2 — after first deployments",
      pending: "ROADMAP — in preparation",
    } as Record<"completed" | "in-progress" | "pending", string>,
    deploy: "deployment",
    whatItDoes: "What this tool does",
    soon: "A detailed deployment description, real screenshots and a case study are coming soon.",
    whatYouSave: "What you save",
    numbersSoon: "exact numbers from deployments — coming soon",
    whatYouGet: "What you get",
    pairsWith: "Pairs well with",
    cta: "Book a free diagnosis",
    screenAlt: "Tool screenshot",
    liveDemo: "See the live in-browser demo",
  },
};

export default function ModulePage({ onBook }: { onBook: () => void }) {
  const { lang } = useLang();
  const t = pick(lang, T);
  const { slug } = useParams<{ slug: string }>();
  const mod = slug ? findModule(slug, lang) : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!mod) {
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

  const Icon = mod.icon;

  return (
    <div className="max-w-5xl mx-auto px-6 pt-32 pb-20">
      <Link
        to="/#moduly"
        className="inline-flex items-center gap-1.5 text-[13px] font-bold"
        style={{ color: "var(--muted-foreground)" }}
      >
        <ArrowLeft size={14} /> {t.all}
      </Link>

      <div className="mt-6 flex items-start gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "rgba(168,180,194,.14)", color: "var(--primary)" }}
        >
          <Icon size={22} />
        </div>
        <div className="min-w-0">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ color: "var(--heading)" }}>
            {mod.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className={`st ${mod.status === "completed" ? "st-accent" : "st-gray"}${mod.status === "pending" ? " st-open" : ""}`}>
              {t.status[mod.status]}
            </span>
            <span className="st st-gray">
              <Clock size={12} className="st-ico" /> {t.deploy}: {mod.date}
            </span>
            <span className="chip">{mod.category}</span>
          </div>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        <div className="lg:col-span-3 flex flex-col gap-6">
          <img
            src={mod.image}
            alt={`${t.screenAlt}: ${mod.title}`}
            className="w-full rounded-xl border"
            style={{ borderColor: "var(--border)" }}
          />
          <div className="card">
            <h2 className="text-[16px] font-extrabold" style={{ color: "var(--heading)" }}>
              {t.whatItDoes}
            </h2>
            <p className="mt-3 text-[14px] leading-relaxed" style={{ color: "var(--foreground)" }}>
              {mod.content}
            </p>
            <p className="mt-4 text-[12px] italic" style={{ color: "var(--muted-foreground)" }}>
              {t.soon}
            </p>
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="card stat">
            <div className="lbl">
              <TrendingUp size={13} style={{ verticalAlign: "-2px", marginRight: 5 }} />
              {t.whatYouSave}
            </div>
            <p className="mt-2 text-[14.5px] font-bold leading-snug" style={{ color: "var(--heading)" }}>
              {mod.saves}
            </p>
            <div className="foot">{t.numbersSoon}</div>
          </div>

          <div className="card">
            <div className="lbl-sm" style={{ marginBottom: 10 }}>{t.whatYouGet}</div>
            <ul className="flex flex-col gap-2.5">
              {mod.benefits.map((b) => (
                <li key={b} className="flex items-start gap-2 text-[13px]" style={{ color: "var(--foreground)" }}>
                  <Check size={14} style={{ color: "var(--funded)", flex: "0 0 auto", marginTop: 2 }} />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          {mod.relatedIds.length > 0 && (
            <div className="card">
              <div className="lbl-sm" style={{ marginBottom: 10 }}>{t.pairsWith}</div>
              <div className="flex flex-wrap gap-2">
                {mod.relatedIds.map((rid) => {
                  const rel = getModules(lang).find((m) => m.id === rid);
                  if (!rel) return null;
                  return (
                    <Link key={rid} to={`/moduly/${rel.slug}`} className="st st-gray" style={{ cursor: "pointer" }}>
                      {rel.title}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {mod.slug === "raport-zarzadczy" && (
            <Link className="btn btn-secondary w-full justify-center" to="/#demo">
              <Play size={15} /> {t.liveDemo}
            </Link>
          )}

          <button className="btn btn-primary w-full justify-center" type="button" onClick={onBook}>
            {t.cta}
          </button>
        </div>
      </div>
    </div>
  );
}
