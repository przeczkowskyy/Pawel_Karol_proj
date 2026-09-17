import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { pick, useLang } from "@/i18n";
import { getTools, type DashboardKey } from "@/data/tools";
import { DashboardMount } from "@/motion/DashboardMount";

/* ── ToolTabs ───────────────────────────────────────────────────────────────
   Ściana narzędzi, która NIE jest ścianą zrzutów: wybrane narzędzie liczy tu
   na żywo, na danych przykładowych.

   JEDEN DASHBOARD NARAZ, I TO JEST WYMÓG, NIE OSZCZĘDNOŚĆ. Dwanaście
   zamontowanych naraz to dwanaście drzew Reacta i dwanaście zestawów
   obserwatorów; na telefonie zjadłoby INP (`perf-js-budget-home`, budżet
   interakcji). Zakładki dają ten sam dowód „to działa" za koszt jednego
   montażu, a chunk narzędzia (2,6–5,8 KB gz) schodzi z sieci dopiero przy
   kliknięciu, nie przy wejściu na stronę.

   KAŻDE NARZĘDZIE MA TEŻ LINK DO SWOJEJ PODSTRONY. To nie jest ozdoba:
   `seo-links-in-dom` wymaga, żeby trzynaście adresów `/narzedzia/<slug>` stało
   w DOM, a nie powstawało dopiero po kliknięciu. Zakładka przełącza widok,
   link obok prowadzi do pełnej podstrony z opisem i FAQ.

   DOSTĘPNOŚĆ: natywny wzorzec `tablist` z obsługą strzałek. Zakładki są
   przyciskami, nie divami z `onClick` (`a11y-controls-native`), a panel ma
   `aria-labelledby` wskazujące aktywną zakładkę.

   KSeF (`kind: "case"`) nie ma dashboardu, bo jest wdrożonym produktem, a nie
   demem. Zakładki dostają więc tylko narzędzia z `dashboard`, a KSeF stoi
   w stopce sekcji jako link. Etykietowanie go jako demo łamałoby
   `brand-honest-labels`. */

const T = {
  aria: { pl: "Narzędzia do sprawdzenia", en: "Tools to try" },
  open: { pl: "Otwórz podstronę", en: "Open the page" },
  all: { pl: "Wszystkie narzędzia (13)", en: "All tools (13)" },
};

export function ToolTabs() {
  const { lang } = useLang();
  const tools = useMemo(() => getTools(lang), [lang]);

  /* Tylko narzędzia z żywym dashboardem trafiają na zakładki. */
  const playable = useMemo(
    () => tools.filter((t): t is typeof t & { dashboard: DashboardKey } => Boolean(t.dashboard)),
    [tools],
  );

  /* Start NIE na pierwszym narzędziu z listy, bo pierwszy jest raport zarządczy,
     a on liczy już sekcję wyżej (tam przyjmuje plik odwiedzającego). Otwieranie
     zakładek na tym samym ekranie wyglądałoby na usterkę. Audyt jakości jest
     najlepszym startem z innego powodu niż kolejność: ma werdykt na pełną
     szerokość i kolorową macierz, więc czyta się w sekundę, bez czytania. */
  const START: DashboardKey = "quality";
  const [active, setActive] = useState(() => {
    const i = playable.findIndex((t) => t.dashboard === START);
    return i < 0 ? 0 : i;
  });
  const btns = useRef<(HTMLButtonElement | null)[]>([]);

  /* Strzałki wędrują po zakładkach i przenoszą fokus; Home i End skaczą na
     krańce. Bez tego lista dwunastu przycisków jest pułapką dla klawiatury. */
  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = playable.length - 1;
    const map: Record<string, number> = {
      ArrowRight: active === last ? 0 : active + 1,
      ArrowLeft: active === 0 ? last : active - 1,
      Home: 0,
      End: last,
    };
    const next = map[e.key];
    if (next === undefined) return;
    e.preventDefault();
    setActive(next);
    btns.current[next]?.focus();
  };

  const current = playable[active];

  return (
    <div className="tooltabs">
      <div className="tooltabs-list" role="tablist" aria-label={pick(lang, T.aria)} onKeyDown={onKeyDown}>
        {playable.map((t, i) => (
          <button
            key={t.slug}
            ref={(el) => {
              btns.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`tab-${t.slug}`}
            aria-selected={i === active}
            aria-controls="tooltabs-panel"
            tabIndex={i === active ? 0 : -1}
            className="tooltabs-tab"
            onClick={() => setActive(i)}
          >
            {t.name}
          </button>
        ))}
      </div>

      <div
        className="tooltabs-panel"
        role="tabpanel"
        id="tooltabs-panel"
        aria-labelledby={`tab-${current.slug}`}
      >
        {/* `key` wymusza świeży montaż przy zmianie zakładki: bez niego React
            trzymałby stan poprzedniego narzędzia pod nowym chunkiem. */}
        <DashboardMount key={current.slug} dashboard={current.dashboard} />

        <p className="tooltabs-foot">
          <Link to={`/narzedzia/${current.slug}`}>
            {pick(lang, T.open)}: {current.name}
          </Link>
        </p>
      </div>

      {/* Komplet linków w DOM od pierwszego renderu (`seo-links-in-dom`).
          Dla człowieka to spis sekcji, dla crawlera trzynaście adresów. */}
      <ul className="tooltabs-index">
        {tools.map((t) => (
          <li key={t.slug}>
            <Link to={`/narzedzia/${t.slug}`}>{t.name}</Link>
          </li>
        ))}
        <li>
          <Link to="/narzedzia">{pick(lang, T.all)}</Link>
        </li>
      </ul>
    </div>
  );
}

export default ToolTabs;
