import { pick, useLang } from "@/i18n";
import { scene } from "@/data/presentation";
import { MAIL_HREF } from "@/data/contact";
import { SceneProse } from "./SceneProse";
import { SceneStep } from "./SceneStep";
import type { SceneContentProps } from "./types";

/* Scena 8: KONTAKT.
   Ostatni kadr, jedno zdanie i jeden przycisk. Żadnego formularza, żadnej listy
   kanałów, żadnego „albo napisz do nas na".

   ZDANIA MARKI, NIE NASZE. Tytuł, podlinia i etykieta przycisku przychodzą
   z `MESSAGING` (reguły `copy-one-liner-single-source` i `copy-cta-labels`).
   Wariantów w rodzaju „Umów bezpłatną diagnozę", „Skontaktuj się", „Dowiedz się
   więcej" nie tworzymy: jedna intencja, jedna etykieta w całym serwisie.

   AKAPIT ZDEJMUJE PRÓG. Ostatnia scena tradycyjnie traci ludzi nie dlatego, że
   oferta jest zła, tylko dlatego, że czytelnik nie wie, ile go to będzie
   kosztowało wysiłku. Dlatego akapit mówi wprost: nie trzeba specyfikacji, nie
   trzeba zwoływać zespołu, a odpowiedź „nie warto tego przebudowywać" też jest
   dopuszczalnym wynikiem rozmowy. Deklaracja, że diagnoza bywa negatywna, jest
   najtańszym dowodem, że nie sprzedajemy na siłę.

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
      <SceneProse progress={progress} body={DATA.body} from={2} />
      <SceneStep progress={progress} step={3}>
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
