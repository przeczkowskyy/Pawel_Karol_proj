import { pick, useLang } from "@/i18n";
import { scene } from "@/data/presentation";
import { MAIL_HREF } from "@/data/contact";
import { SceneStep } from "./SceneStep";
import type { SceneContentProps } from "./types";

/* Scena 8: KONTAKT.
   Ostatni kadr gaśnie do czerni, zostaje jedno zdanie i jeden przycisk. Nic poza
   tym: żadnego formularza, żadnej listy kanałów, żadnego „albo napisz do nas na".

   ZDANIA MARKI, NIE NASZE. Tytuł, podlinia i etykieta przycisku przychodzą
   z `MESSAGING` (reguły `copy-one-liner-single-source` i `copy-cta-labels`).
   Wariantów w rodzaju „Umów bezpłatną diagnozę", „Skontaktuj się", „Dowiedz się
   więcej" nie tworzymy: jedna intencja, jedna etykieta w całym serwisie.

   PRZYCISK. Domyślnie otwiera modal rezerwacji (`onBook` podaje silnik). Gdy go
   nie dostanie, zamiast martwego przycisku idzie link pocztowy z jedynego źródła
   NAP (`data/contact.ts`): prezentacja bez działającego kontaktu nie ma sensu. */
const DATA = scene("contact");

export function SceneContact({ progress, onBook }: SceneContentProps) {
  const { lang } = useLang();
  const label = pick(lang, DATA.cta);

  return (
    <div className="pres-scene pres-scene--center">
      <SceneStep progress={progress} step={0}>
        <h2 className="pres-headline">{pick(lang, DATA.headline)}</h2>
      </SceneStep>
      <SceneStep progress={progress} step={1}>
        <p className="pres-sub">{pick(lang, DATA.sub)}</p>
      </SceneStep>
      <SceneStep progress={progress} step={2}>
        {onBook ? (
          <button type="button" className="btn btn-primary pres-cta" onClick={onBook}>
            {label}
          </button>
        ) : (
          <a className="btn btn-primary pres-cta" href={MAIL_HREF}>
            {label}
          </a>
        )}
      </SceneStep>
    </div>
  );
}

export default SceneContact;
