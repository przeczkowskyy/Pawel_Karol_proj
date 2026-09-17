import { pick, useLang } from "@/i18n";
import { HOME_CLOSING, HOME_SECTIONS } from "@/data/homeSections";
import { MESSAGING } from "@/data/messaging";
import { HeroV3 } from "@/components/home/HeroV3";
import { SectionBlock } from "@/components/home/SectionBlock";
import { ToolTabs } from "@/components/home/ToolTabs";
import { DashboardMount } from "@/motion/DashboardMount";
import "@/styles/home.css";

/* ── Strona główna v3 ───────────────────────────────────────────────────────
   Decyzja Karola 2026-09-17: „Efekt wow ma brać się z tego, że strona
   URUCHAMIA prawdziwe narzędzia." Poprzednie dwa podejścia (kreskówkowe sceny,
   pionowy pas z pętlami) budowały wrażenie z materiału generatywnego i oba
   zostały odrzucone: „te gify zupełnie nam nie wyszły".

   CZTERY SEKCJE, DWA ŻYWE NARZĘDZIA, ZERO WYGENEROWANYCH OBRAZÓW.
   Dowodem nie jest to, co mówimy o narzędziach, tylko to, że działają pod
   palcem odwiedzającego, na jego własnym pliku.

   Ten plik jest WYŁĄCZNIE montażem: copy siedzi w `data/homeSections.ts`
   (to samo źródło czyta shell prerendera, więc crawler i człowiek nie mogą
   zobaczyć dwóch różnych stron), mechanika montażu w `motion/DashboardMount`,
   a wygląd w `styles/home.css`.

   ARKUSZ WCHODZI PRZEZ IMPORT Z TEGO PLIKU, nie z `main.tsx`: strona główna
   jest lazy-chunkiem, więc jej style nie liczą się do CSS krytycznego, a ten
   ma dziś tylko 3,3 KB zapasu do limitu 20 KB (`perf-chunk-size-gate`). */

export default function HomeV3({ onBook }: { onBook: () => void }) {
  const { lang } = useLang();
  const [plik, dowod, narzedzia, jak] = HOME_SECTIONS;

  return (
    <>
      <HeroV3 onBook={onBook} />

      {/* SEKCJA PLIKU. `DemoReport` przyjmuje wklejkę i wgrany plik CSV i liczy
          go w całości lokalnie, więc obietnica „nie wychodzi z przeglądarki"
          jest tu dosłownie prawdziwa i sprawdzalna w narzędziach programisty.
          Rozpoznawanie pokracznych arkuszy (scalone nagłówki, sumy pośrednie)
          dochodzi w następnym kroku i nie zmienia tej granicy. */}
      <SectionBlock section={plik} wide>
        <DashboardMount dashboard="report" />
      </SectionBlock>

      <SectionBlock section={dowod} />

      <SectionBlock section={narzedzia} wide>
        <ToolTabs />
      </SectionBlock>

      <SectionBlock section={jak} />

      {/* ZAMKNIĘCIE: jedno zdanie i jeden przycisk (`design-one-cta-per-screen`). */}
      <section className="home-closing-v3" aria-labelledby="closing-title">
        <h2 id="closing-title" className="home-sec-title">
          {pick(lang, HOME_CLOSING.headline)}
        </h2>
        <p className="home-sec-lead">{pick(lang, HOME_CLOSING.lead)}</p>
        <button type="button" className="btn btn-primary" onClick={onBook}>
          {pick(lang, MESSAGING.cta.primary)}
        </button>
      </section>
    </>
  );
}
