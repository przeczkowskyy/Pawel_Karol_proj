import * as m from "motion/react-m";
import { useReducedMotion, type MotionValue } from "motion/react";
import { pick, useLang } from "@/i18n";
import { MESSAGING } from "@/data/messaging";
import { PHONE_DISPLAY, PHONE_HREF } from "@/data/contact";

/* ── PresentationChrome ─────────────────────────────────────────────────────
   Komponenty STAŁE prezentacji: widoczne niezależnie od tego, gdzie stoi
   przewijanie. Prośba Karola z 2026-09-14: „Musimy do strony dodać komponenty
   które będą stałe, nie ważne od scroll."

   TRZY ELEMENTY, ŚWIADOMIE NIE WIĘCEJ:
   1. pasek postępu — cienka linia pod nawigacją, rośnie wraz z przewijaniem;
   2. kolofon sceny — numer i nazwa beatu w rogu, drobnym drukiem;
   3. zakładka kontaktowa przy lewej krawędzi — jedyna stała droga do akcji.

   PUŁAPKA, KTÓRA KOSZTOWAŁA TĘ STRONĘ TYDZIEŃ (2026-07-24/26): element
   `position: fixed` UWIĘZIONY w kontekście stackingu przodka z `overflow`
   nie jest malowany przez iOS — znikała wtedy CAŁA treść, nie tylko ten
   element. Dlatego chroma jest RODZEŃSTWEM warstwy treści, montowanym
   portalem na `document.body`, a nie dzieckiem sceny ani ramy.

   KOLEJNOŚĆ FOKUSU: chroma stoi w DOM PO `</main>`, więc skip-link „przejdź
   do treści" przeskakuje ją w całości, a klawiatura wchodzi w zakładkę
   kontaktową dopiero po przejściu przez treść strony. */

type ChromeProps = {
  /** postęp całego dokumentu, 0–1 */
  progress: MotionValue<number>;
  /** numer aktywnej sceny, licząc od 1; 0 = jeszcze nieustalony */
  index: number;
  total: number;
  /** nazwa aktywnego beatu do kolofonu */
  label?: { pl: string; en: string };
  onBook?: () => void;
};

export function PresentationChrome({ progress, index, total, label, onBook }: ChromeProps) {
  const reduce = useReducedMotion();
  const { lang } = useLang();

  const kontakt = pick(lang, MESSAGING.cta.primary);

  return (
    <div className="pr-chrome">
      {/* PASEK POSTĘPU. `scaleX` na gotowej szerokości, nigdy `width`:
          szerokość przeliczana w klatce to layout całej strony, skala to sam
          kompozytor (reguła `motion-gpu-props-only`). Przy ograniczonym ruchu
          znika — w JS i drugi raz w CSS. */}
      {reduce ? null : (
        <div className="pr-rail" aria-hidden="true">
          <m.div className="pr-rail-fill" style={{ scaleX: progress }} />
        </div>
      )}

      {/* KOLOFON SCENY. `aria-hidden`, bo to powtórzenie struktury, którą
          czytnik ekranu ma już w nagłówkach sekcji; ogłaszanie „scena 3 z 8"
          przy każdym przewinięciu byłoby hałasem, nie informacją. */}
      {index > 0 && total > 0 ? (
        <p className="pr-count" aria-hidden="true">
          <span className="pr-count-num">
            {String(index).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          {label ? <span className="pr-count-label">{pick(lang, label)}</span> : null}
        </p>
      ) : null}

      {/* STOPKA STAŁA w lewym dolnym rogu (prośba Karola 2026-09-14:
          „w lewym dolnym rogu zawsze widoczną stopkę, przycisk zachęcający do
          kontaktu z nami").

          Jest tu przycisk i telefon, i nic poza tym. Stała stopka rywalizuje
          o uwagę z treścią przez całą długość strony, więc każdy dołożony
          element kosztuje podwójnie: raz miejscem, raz rozproszeniem.

          ETYKIETA PRZYCISKU przychodzi z `MESSAGING` (reguła `copy-cta-labels`:
          jedna intencja, jedna etykieta w całym serwisie) — nie tworzymy tu
          wariantu „Skontaktuj się z nami". Telefon z jedynego źródła NAP
          (`data/contact.ts`), żeby numer nie rozjechał się z resztą serwisu. */}
      <div className="pr-footer">
        <button type="button" className="btn btn-primary pr-footer-cta" onClick={onBook}>
          {kontakt}
        </button>
        <a className="pr-footer-tel" href={PHONE_HREF}>
          {PHONE_DISPLAY}
        </a>
      </div>
    </div>
  );
}

export default PresentationChrome;
