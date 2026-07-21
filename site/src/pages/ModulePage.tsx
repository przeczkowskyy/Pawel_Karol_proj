import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check, Clock, TrendingUp } from "lucide-react";
import { findModule, MODULES } from "@/data/modules";

/* Podstrona modułu /moduly/:slug — szablon. Szczegółowe opisy narzędzi,
   realne zrzuty ekranu i liczby oszczędności dostarczą founderzy (plan:
   „opis narzędzi dodamy potem”) — placeholdery są jawnie oznaczone. */

const STATUS_LABEL = {
  completed: "DOSTĘPNY — sprzedajemy od dziś",
  "in-progress": "FALA 2 — po pierwszych wdrożeniach",
  pending: "ROADMAPA — w przygotowaniu",
} as const;

export default function ModulePage({ onBook }: { onBook: () => void }) {
  const { slug } = useParams<{ slug: string }>();
  const mod = slug ? findModule(slug) : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!mod) {
    return (
      <div className="max-w-3xl mx-auto px-6 pt-36 pb-24 text-center">
        <h1 className="text-2xl font-extrabold" style={{ color: "var(--heading)" }}>
          Nie znaleziono modułu
        </h1>
        <Link className="btn btn-secondary mt-6 inline-flex" to="/">
          <ArrowLeft size={15} /> Wróć na stronę główną
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
        <ArrowLeft size={14} /> Wszystkie moduły
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
              {STATUS_LABEL[mod.status]}
            </span>
            <span className="st st-gray">
              <Clock size={12} className="st-ico" /> wdrożenie: {mod.date}
            </span>
            <span className="chip">{mod.category}</span>
          </div>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        <div className="lg:col-span-3 flex flex-col gap-6">
          <img
            src={mod.image}
            alt={`Zrzut ekranu narzędzia: ${mod.title}`}
            className="w-full rounded-xl border"
            style={{ borderColor: "var(--border)" }}
          />
          <div className="card">
            <h2 className="text-[16px] font-extrabold" style={{ color: "var(--heading)" }}>
              Co robi to narzędzie
            </h2>
            <p className="mt-3 text-[14px] leading-relaxed" style={{ color: "var(--foreground)" }}>
              {mod.content}
            </p>
            <p className="mt-4 text-[12px] italic" style={{ color: "var(--muted-foreground)" }}>
              Szczegółowy opis wdrożenia, realne zrzuty ekranu i studium przypadku dodamy wkrótce.
            </p>
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="card stat">
            <div className="lbl">
              <TrendingUp size={13} style={{ verticalAlign: "-2px", marginRight: 5 }} />
              Co oszczędzasz
            </div>
            <p className="mt-2 text-[14.5px] font-bold leading-snug" style={{ color: "var(--heading)" }}>
              {mod.saves}
            </p>
            <div className="foot">dokładne liczby z wdrożeń — wkrótce</div>
          </div>

          <div className="card">
            <div className="lbl-sm" style={{ marginBottom: 10 }}>Co dostajesz</div>
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
              <div className="lbl-sm" style={{ marginBottom: 10 }}>Dobrze łączy się z</div>
              <div className="flex flex-wrap gap-2">
                {mod.relatedIds.map((rid) => {
                  const rel = MODULES.find((m) => m.id === rid);
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

          <button className="btn btn-primary w-full justify-center" type="button" onClick={onBook}>
            Umów bezpłatną diagnozę
          </button>
        </div>
      </div>
    </div>
  );
}
