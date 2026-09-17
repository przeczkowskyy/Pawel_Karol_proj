import { pick, useLang } from "@/i18n";
import { MESSAGING } from "@/data/messaging";
import { HOME_HERO } from "@/data/homeSections";
import { DashboardMount } from "@/motion/DashboardMount";

/* ── HeroV3 ─────────────────────────────────────────────────────────────────
   Hero, w którym wizualem jest DZIAŁAJĄCE narzędzie, a nie jego zdjęcie.

   DECYZJA KAROLA 2026-09-17: „Efekt wow ma brać się z tego, że strona
   URUCHAMIA prawdziwe narzędzia." Poprzednie dwa podejścia budowały wrażenie
   z wygenerowanej ilustracji i oba zostały odrzucone. Różnica między kadrem
   narzędzia a narzędziem jest jedna, ale decyduje o wszystkim: kadr trzeba
   obejrzeć, a narzędzie można ruszyć.

   CZTERY ELEMENTY TEKSTOWE, ANI JEDNEGO WIĘCEJ (`design-hero-discipline`):
   H1, lead i dwa przyciski. Podpis pod ramą nie jest piątym elementem, tylko
   etykietą wizualu: mówi, że to nie jest obrazek, i gdyby go zabrakło, część
   ludzi w ogóle nie spróbowałaby ruszyć suwakiem.

   H1 PRZYCHODZI Z `MESSAGING.oneLiner` i nie wolno go tu przepisać
   (`copy-one-liner-single-source`): to samo zdanie stoi w meta, w JSON-LD,
   w `llms.txt`, w promptcie bota i w nagłówkach LinkedIn founderów.

   DLACZEGO PULPIT PRODUKCJI, A NIE RAPORT: ma najsilniejsze rozpoznanie
   branżowe z dwóch metrów (kafle hal, procenty, paski) i zero drobnego tekstu
   tabel, który po przeskalowaniu robi się szumem. `DemoReport` świadomie nie
   idzie do hero, bo pracuje w sekcji z plikiem ekran niżej. */

export function HeroV3({ onBook }: { onBook: () => void }) {
  const { lang } = useLang();

  return (
    <section className="hero-v3" aria-labelledby="hero-title">
      {/* NAGŁÓWEK NA PEŁNĄ SZEROKOŚĆ, dopiero pod nim dwie kolumny.
          Powód jest mierzalny: `design-hero-discipline` wymaga ≤ 2 wierszy H1
          od 1024 px, a jedno zdanie marki ma 64 znaki. W kolumnie ~510 px
          łamało się na trzy wiersze przy każdym sensownym stopniu pisma;
          na pełnej szerokości mieści się w dwóch i nie trzeba zmniejszać
          nagłówka do rozmiaru, w którym przestaje być nagłówkiem. */}
      <h1 id="hero-title" className="hero-v3-title">
        {pick(lang, MESSAGING.oneLiner)}
      </h1>

      <div className="hero-v3-text">
        <p className="hero-v3-lead">{pick(lang, MESSAGING.subtext)}</p>
        <div className="hero-v3-cta">
          <a className="btn btn-primary" href="#plik">
            {pick(lang, HOME_HERO.ctaPrimary)}
          </a>
          <button type="button" className="btn btn-secondary" onClick={onBook}>
            {pick(lang, HOME_HERO.ctaSecondary)}
          </button>
        </div>
      </div>

      {/* RAMA INSTRUMENTU. `DashboardMount` rezerwuje wysokość przed montażem,
          więc nic nie skacze (CLS), i sam pilnuje lazy-chunku oraz granicy
          błędu. Ten sam komponent obsługuje trzynaście podstron narzędzi, więc
          hero nie wprowadza drugiego mechanizmu montażu. */}
      <div className="hero-v3-frame">
        <DashboardMount dashboard="production" />
        <p className="hero-v3-caption">{pick(lang, HOME_HERO.caption)}</p>
      </div>
    </section>
  );
}

export default HeroV3;
