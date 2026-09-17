import { pick, useLang } from "@/i18n";
import { MESSAGING } from "@/data/messaging";
import { HOME_HERO } from "@/data/homeSections";
import { DashboardMount } from "@/motion/DashboardMount";

/* ── HeroV3 ─────────────────────────────────────────────────────────────────
   Nagłówek, jedno zdanie, dwa przyciski i DZIAŁAJĄCE narzędzie. Cztery elementy
   tekstowe, ani jednego więcej (`design-hero-discipline`).

   DLACZEGO WIZUALEM JEST NARZĘDZIE, A NIE JEGO ZDJĘCIE: reguła i tak wymaga
   w hero „realnego wizualu", a różnica między kadrem a rzeczą jest jedna, ale
   decyduje o wszystkim — kadr trzeba obejrzeć, narzędzie można ruszyć. Suwak
   tygodnia działa pod palcem od pierwszej sekundy wizyty.

   PULPIT PRODUKCJI, NIE RAPORT: ma najsilniejsze rozpoznanie branżowe z dwóch
   metrów (kafle, procenty, paski) i zero drobnego tekstu tabel, który po
   przeskalowaniu robi się szumem.

   PODPIS POD RAMĄ ZNIKNĄŁ przy cięciu tekstu 2026-09-17. Mówił „to nie jest
   zrzut ekranu" — zdanie prawdziwe, ale tłumaczące obraz zamiast pozwolić mu
   działać. Suwak, który reaguje, mówi to samo i nie zajmuje wiersza. */

export function HeroV3({ onBook }: { onBook: () => void }) {
  const { lang } = useLang();

  return (
    <section className="hm-hero" aria-labelledby="hero-title">
      {/* Nagłówek na pełną szerokość pierwszego wiersza siatki: jedno zdanie
          marki ma 64 znaki i w wąskiej kolumnie łamie się na trzy wiersze,
          a reguła daje dwa od 1024 px. */}
      <h1 id="hero-title" className="hm-hero-title">
        {pick(lang, MESSAGING.oneLiner)}
      </h1>

      <div className="hm-hero-text">
        <p className="hm-hero-lead">{pick(lang, MESSAGING.subtext)}</p>
        <div className="hm-hero-cta">
          <a className="btn btn-primary" href="#audyt">
            {pick(lang, HOME_HERO.ctaPrimary)}
          </a>
          <button type="button" className="btn btn-secondary" onClick={onBook}>
            {pick(lang, HOME_HERO.ctaSecondary)}
          </button>
        </div>
      </div>

      <div className="hm-hero-frame">
        <DashboardMount dashboard="production" />
      </div>
    </section>
  );
}

export default HeroV3;
