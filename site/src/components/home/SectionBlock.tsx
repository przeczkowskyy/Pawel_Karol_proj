import type { ReactNode } from "react";
import { pick, useLang } from "@/i18n";
import type { HomeSection } from "@/data/homeSections";

/* ── SectionBlock ───────────────────────────────────────────────────────────
   Jedna sekcja strony głównej: nagłówek, jedno zdanie, akapit, rzeczy
   sprawdzalne i opcjonalnie coś działającego.

   UKŁAD: tekst po lewej w wąskiej kolumnie, dowód po prawej w szerokiej.
   Akapit ma `max-width: 60ch` (`design-typography-scale`), bo dłuższy wiersz
   przestaje się czytać, a nie dlatego, że tak wyszło z siatki.

   STRUKTURĘ NIESIE HAIRLINE, NIE PUDEŁKO. Sekcja ma jedną linię 1 px u góry
   i nic poza tym: zero cienia, zero tła karty, zero zaokrągleń na ramie
   (`design-no-glass-no-blur`, `design-shape-lock`). Decyzja Karola z lipca
   brzmiała „linie, nie boxy" i obowiązuje dalej.

   BEZ `whileInView` I BEZ WEJŚĆ: treść jest w shellu prerendera, więc nie może
   startować ukryta (`motion-no-initial-hidden-above-fold`). Ruch na tej stronie
   robią narzędzia, nie akapity. */

type SectionBlockProps = {
  section: HomeSection;
  /** dowód: instrument, wykres albo lista narzędzi */
  children?: ReactNode;
  /** dowód zajmuje pełną szerokość zamiast prawej kolumny */
  wide?: boolean;
};

export function SectionBlock({ section, children, wide = false }: SectionBlockProps) {
  const { lang } = useLang();

  return (
    <section
      id={section.id}
      className={wide ? "home-sec home-sec--wide" : "home-sec"}
      aria-labelledby={`${section.id}-title`}
    >
      <div className="home-sec-text">
        <h2 id={`${section.id}-title`} className="home-sec-title">
          {pick(lang, section.headline)}
        </h2>
        <p className="home-sec-lead">{pick(lang, section.lead)}</p>
        <p className="home-sec-body">{pick(lang, section.body)}</p>

        {section.points ? (
          <ul className="home-sec-points">
            {section.points.map((p) => (
              <li key={p.pl}>{pick(lang, p)}</li>
            ))}
          </ul>
        ) : null}
      </div>

      {children ? <div className="home-sec-proof">{children}</div> : null}
    </section>
  );
}

export default SectionBlock;
