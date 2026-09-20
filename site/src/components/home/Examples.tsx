import { useMemo } from "react";
import { Link } from "react-router-dom";
import { pick, useLang } from "@/i18n";
import { HOME_EXAMPLES } from "@/data/homeSections";
import { getTools } from "@/data/tools";

/* ── Examples ───────────────────────────────────────────────────────────────
   Kilka nazw i nic poza nazwami.

   Karol 2026-09-17: „Nie popisujmy się aż tak narzędziami, bo możemy zrobić
   dużo więcej niż to, co przedstawiamy. Parę przykładów wymieniamy (...)
   bez opisów, bez historii."

   To jest zmiana pozycjonowania, nie oszczędność miejsca. Lista dwunastu
   opisanych narzędzi czyta się jak KATALOG, czyli jak zamknięty zbiór tego,
   co umiemy. Sześć nazw bez opisu czyta się jak PRÓBKA. Zdanie obok mówi
   wprost, że katalogu nie ma.

   NAZWY BIERZEMY Z `tools.ts`, nie przepisujemy ich tutaj: druga lista tych
   samych nazw rozjechałaby się przy pierwszej korekcie (`code-single-source-copy`).
   Tutaj stoją wyłącznie slugi, czyli wybór, a nie treść.

   KOMPLET LINKÓW ZOSTAJE W DOM. Sześć przykładów plus link do huba; pozostałe
   siedem narzędzi jest osiągalnych z `/narzedzia`, więc przepływ linków się nie
   rwie (`seo-links-in-dom`). */

export function Examples() {
  const { lang } = useLang();
  const tools = useMemo(() => getTools(lang), [lang]);

  const picked = useMemo(
    () =>
      HOME_EXAMPLES.slugs
        .map((slug) => tools.find((t) => t.slug === slug))
        .filter((t): t is NonNullable<typeof t> => Boolean(t)),
    [tools],
  );

  return (
    <section className="hm-examples" aria-labelledby="examples-title">
      <div className="hm-beat-head">
        <h2 id="examples-title" className="hm-beat-title">
          {pick(lang, HOME_EXAMPLES.headline)}
        </h2>
        <p className="hm-beat-line">{pick(lang, HOME_EXAMPLES.line)}</p>
      </div>

      {/* TRZY ZRZUTY BEZ PODPISÓW. Mają pokazać, jak te narzędzia wyglądają,
          i nic więcej — opis pod obrazem zamieniłby próbkę z powrotem w katalog.
          `alt` jest puste, bo obok stoi lista nazw: czytnik ekranu usłyszałby
          tę samą informację dwa razy (`a11y-images-alt-svg-role` p.1).
          Jawne `width`/`height` trzymają CLS, `loading="lazy"` bo sekcja jest
          głęboko pod pierwszym ekranem. */}
      <ul className="hm-examples-shots" aria-hidden="true">
        {HOME_EXAMPLES.shots.map((slug) => (
          <li key={slug}>
            <img
              src={`/thumbs/${slug}-v1-640.webp`}
              srcSet={`/thumbs/${slug}-v1-320.webp 320w, /thumbs/${slug}-v1-640.webp 640w`}
              sizes="(max-width: 48rem) 100vw, 33vw"
              alt=""
              width={640}
              height={400}
              loading="lazy"
              decoding="async"
            />
          </li>
        ))}
      </ul>

      <ul className="hm-examples-list">
        {picked.map((t) => (
          <li key={t.slug}>
            <Link to={`/narzedzia/${t.slug}`} className="hm-examples-item">
              {t.name}
            </Link>
          </li>
        ))}
      </ul>

      <p className="hm-examples-more">
        <Link to="/narzedzia">{pick(lang, HOME_EXAMPLES.more)}</Link>
      </p>
    </section>
  );
}

export default Examples;
