import { pick, useLang } from "@/i18n";
import type { Bilingual } from "@/data/messaging";

/* ── SceneFallbackMedia ─────────────────────────────────────────────────────
   CO ROBI: tło sceny na czas, gdy nie ma jeszcze materiału z Higgsfielda.
   Stalowa łuna wstająca od dołu kadru, winieta domykająca rogi i opcjonalna
   siatka komórek wygaszona maską. Do tego opcjonalny kadr (zrzut narzędzia
   albo faktura), przytłumiony tak, żeby był podłożem, a nie drugą treścią
   konkurującą z tekstem sceny.

   DLACZEGO ISTNIEJE: prezentacja musi działać i wyglądać sensownie BEZ ani
   jednego pliku wideo, bo subskrypcja Higgsfielda nie jest kupiona, a agent
   nie uruchamia zakupu ani generacji (scenariusz, sekcja „Materiał z Higgsfield").
   To tło ma czytać się jak DECYZJA, nie jak dziura po pliku: stąd winieta
   i siatka, a nie płaski szary prostokąt.

   To samo tło jest zarazem zapasem na trzech innych ścieżkach, więc scena
   nigdy nie zostaje pusta: telefon (`pointer: coarse`), ograniczony ruch
   i awaria pliku wideo.

   RUCH: ZERO. Tło jest statyczne, więc nie ma czego gasić przy
   `prefers-reduced-motion`, nie ma warstwy kompozytora do utrzymania i nie ma
   ani jednej klatki pracy na telefonie. Wygaszanie i zapalanie tła przy
   przejściu między scenami robi `Scene`, jedną wartością `opacity`.

   KOLORY: wyłącznie tokeny, w `presentation.css` (`.pr-fallback*`). W tym
   pliku nie ma ani jednej wartości wizualnej. */

type SceneFallbackMediaProps = {
  /** opcjonalny kadr pod gradientem; ścieżka zawsze z `sceneMedia.ts` */
  still?: string;
  /**
   * Opis kadru dla czytnika. Brak opisu = kadr jest DEKORACJĄ (`alt=""`),
   * co jest tu domyślne i poprawne: informację niesie tekst sceny, a nie
   * faktura tła (reguła `a11y-images-alt-svg-role`).
   */
  alt?: Bilingual;
  /** siatka komórek pod gradientem; scenariusz przewiduje ją dla scen „plikowych" */
  grid?: boolean;
  className?: string;
};

/** Statyczne tło zastępcze sceny: stal, winieta i opcjonalna siatka. */
export function SceneFallbackMedia({ still, alt, grid = false, className }: SceneFallbackMediaProps) {
  const { lang } = useLang();

  return (
    <div className={className ? `pr-fallback ${className}` : "pr-fallback"}>
      {still ? (
        <img
          className="pr-media-still"
          src={still}
          alt={alt ? pick(lang, alt) : ""}
          /* Wymiary jawne mimo `object-fit: cover`: bez nich przeglądarka nie zna
             proporcji przed pobraniem pliku i układ skacze (reguła perf-images-policy).
             Wartości to natywny rozmiar kadru pulpitu z `data/media.ts`. */
          width={1920}
          height={1200}
          loading="lazy"
          decoding="async"
        />
      ) : null}
      <div className="pr-fallback-steel" aria-hidden="true" />
      {grid ? <div className="pr-fallback-grid" aria-hidden="true" /> : null}
    </div>
  );
}
