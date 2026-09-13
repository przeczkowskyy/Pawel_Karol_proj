/* Strona główna v2.
 *
 * Powstała po tym, jak founder zobaczył poprzednią wersję i powiedział: „strona dalej
 * wygląda minimalistycznie, nawet gorzej niż wcześniej, za dużo tekstu (...) bardzo
 * liczyłem na motion grafiki, typu że podczas scrollowania buduje się jakiś wykres".
 *
 * Dwie rzeczy wynikające z tamtej rozmowy, których nie wolno cofnąć bez jego zgody:
 *  1. RUCH NIESIE TREŚĆ. Sekcje, które wcześniej były kartami z akapitem, są teraz
 *     scenami sterowanymi przewijaniem: siatka układa się z chaosu w tabelę, wykres
 *     buduje się słupek po słupku. Tekst jest podpisem pod ruchem, nie odwrotnie.
 *  2. TEKSTU MA BYĆ MAŁO. Treść żyje w `src/data/home.ts`, gdzie na sekcję przypada
 *     nagłówek i najwyżej jedna linia. Poprzednia strona główna miała 219 słów PL
 *     w samych sekcjach, ta ma 107.
 *
 * Kolejność sekcji: hero (dowód od razu) → chaos w porządek (problem) → wykres
 * (rozwiązanie w ruchu) → ściana narzędzi (skala) → co zyskujesz → ludzie → kontakt.
 *
 * Warstwa scroll-motion (`@/motion/scroll`) wchodzi przez `React.lazy`, bo reguła
 * perf-js-budget-home wymaga, żeby wszystko poniżej pierwszego ekranu ładowało się
 * leniwie. Fallbacki pokazują stan KOŃCOWY sceny, nie pustkę: strona bez JavaScriptu
 * i z włączonym ograniczeniem ruchu ma nadal mówić to samo. */

import { Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarCheck,
  Clock,
  ShieldAlert,
  Umbrella,
  type LucideIcon,
} from "lucide-react";
import { pick, useLang } from "@/i18n";
import { MESSAGING } from "@/data/messaging";
import { CHAOS, CHART, CLOSING, OUTCOMES, PEOPLE, WALL } from "@/data/home";
import { getTools } from "@/data/tools";
import KsefFlow from "@/components/KsefFlow";

/** Jedyna pozycja bez pulpitu: wdrożenie, nie demo. Zamiast zrzutu idzie diagram. */
const KSEF_SLUG = "kontroling-ksef";

const ScrollChart = lazy(() =>
  import("@/motion/scroll").then((m) => ({ default: m.ScrollChart }))
);
const ChaosToOrder = lazy(() =>
  import("@/motion/scroll").then((m) => ({ default: m.ChaosToOrder }))
);

/* Mapa ikon: `home.ts` trzyma nazwę, nie komponent, żeby plik treści nie zależał
   od biblioteki ikon (reguła code-single-source-copy: dane to dane). */
const ICONS: Record<string, LucideIcon> = {
  Clock,
  CalendarCheck,
  ShieldAlert,
  Umbrella,
};

/* ─────────────────────────── scena 1: chaos w porządek ─────────────────────────
   Jedyny tekst to dwa podpisy na krańcach animacji. Reszta to ruch. */
function ChaosSection() {
  const { lang } = useLang();
  return (
    <section className="home-scene" aria-labelledby="scene-chaos">
      <h2 id="scene-chaos" className="sr-only">
        {pick(lang, CHAOS.start)}
      </h2>
      <Suspense fallback={<div className="scene-skeleton" aria-hidden />}>
        <ChaosToOrder />
      </Suspense>
    </section>
  );
}

/* ─────────────────────────── scena 2: wykres buduje się ────────────────────────
   Nagłówek, jedna linia, wykres rysowany postępem przewijania. */
function ChartSection() {
  const { lang } = useLang();
  return (
    <section className="home-scene home-scene--chart" aria-labelledby="scene-chart">
      <div className="scene-head">
        <h2 id="scene-chart" className="scene-title">
          {pick(lang, CHART.title)}
        </h2>
        <p className="scene-line">{pick(lang, CHART.line)}</p>
      </div>
      <Suspense fallback={<div className="scene-skeleton" aria-hidden />}>
        <ScrollChart />
      </Suspense>
    </section>
  );
}

/* ─────────────────────────── ściana narzędzi ───────────────────────────────────
   Trzynaście kafli ze zrzutami prawdziwych narzędzi. Zero akapitów: nazwa narzędzia
   jest całym opisem. Kafle wchodzą kaskadą (CSS, bez biblioteki), a przy ograniczonym
   ruchu pojawiają się od razu. */
function ToolWall() {
  const { lang } = useLang();
  const tools = getTools(lang);
  return (
    <section className="home-wall" aria-labelledby="wall-title">
      <div className="scene-head">
        <h2 id="wall-title" className="scene-title">
          {pick(lang, WALL.title)}
        </h2>
        <p className="scene-line">{pick(lang, WALL.line)}</p>
      </div>
      <ul className="wall-grid">
        {tools.map((t, i) => (
          <li key={t.slug} className="wall-cell" style={{ "--i": i } as React.CSSProperties}>
            <Link to={`/narzedzia/${t.slug}`} className="wall-link">
              {/* KSeF to wdrożenie bez pulpitu, więc nie ma z czego zrobić zrzutu.
                  Zamiast pustej ramki stoi tam diagram przepływu danych: mówi więcej
                  niż zrzut listy faktur i nie udaje ekranu, którego nie ma. */}
              {t.slug === KSEF_SLUG ? (
                <span className="wall-shot wall-shot--diagram">
                  <KsefFlow size="mini" />
                </span>
              ) : (
                <img
                  className="wall-shot"
                  src={`/thumbs/${t.slug}-v1-640.webp`}
                  srcSet={`/thumbs/${t.slug}-v1-640.webp 640w, /thumbs/${t.slug}-v1-1280.webp 1280w`}
                  sizes="(min-width: 1024px) 22rem, (min-width: 640px) 45vw, 90vw"
                  alt=""
                  width={640}
                  height={400}
                  loading="lazy"
                  decoding="async"
                />
              )}
              <span className="wall-name">{t.name}</span>
            </Link>
          </li>
        ))}
      </ul>
      <Link to="/narzedzia" className="wall-more">
        {pick(lang, WALL.cta)}
        <ArrowRight size={16} strokeWidth={1.75} aria-hidden />
      </Link>
    </section>
  );
}

/* ─────────────────────────── co zyskujesz ──────────────────────────────────────
   Cztery linie. Bez akapitów, bez liczb, bez kart z ramką. */
function Outcomes() {
  const { lang } = useLang();
  return (
    <section className="home-outcomes" aria-labelledby="outcomes-title">
      <h2 id="outcomes-title" className="scene-title">
        {pick(lang, OUTCOMES.title)}
      </h2>
      <ul className="outcomes-list">
        {OUTCOMES.items.map((o) => {
          const Icon = ICONS[o.icon] ?? Clock;
          return (
            <li key={o.icon} className="outcome">
              <Icon size={20} strokeWidth={1.5} aria-hidden />
              <span>{pick(lang, o)}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ─────────────────────────── ludzie i zamknięcie ───────────────────────────────
   Bez zarejestrowanej firmy to dwie osoby są tym, co klient kupuje. Zdjęcia wejdą,
   gdy founderzy je dostarczą; do tego czasu sekcja mówi to samo bez portretów,
   bo zdjęcie ze stocku byłoby gorsze od jego braku. */
function People() {
  const { lang } = useLang();
  return (
    <section className="home-people" aria-labelledby="people-title">
      <h2 id="people-title" className="scene-title">
        {pick(lang, PEOPLE.title)}
      </h2>
      <p className="scene-line">{pick(lang, PEOPLE.line)}</p>
    </section>
  );
}

function Closing({ onBook }: { onBook: () => void }) {
  const { lang } = useLang();
  return (
    <section className="home-closing" aria-labelledby="closing-title">
      <h2 id="closing-title" className="closing-title">
        {pick(lang, CLOSING.title)}
      </h2>
      <p className="scene-line">{pick(lang, CLOSING.line)}</p>
      <button className="btn btn-primary" type="button" onClick={onBook}>
        {pick(lang, MESSAGING.cta.primary)}
      </button>
    </section>
  );
}

/** Sekcje strony głównej poniżej hero. Hero zostaje w App.tsx, bo jest nad zgięciem. */
export default function HomeSections({ onBook }: { onBook: () => void }) {
  return (
    <>
      <ChaosSection />
      <ChartSection />
      <ToolWall />
      <Outcomes />
      <People />
      <Closing onBook={onBook} />
    </>
  );
}
