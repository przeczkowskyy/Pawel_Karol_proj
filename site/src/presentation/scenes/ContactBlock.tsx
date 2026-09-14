import { pick, useLang } from "@/i18n";
import { MESSAGING } from "@/data/messaging";
import { EMAIL, MAIL_HREF, PHONE_DISPLAY, PHONE_HREF } from "@/data/contact";

/* ── ContactBlock ───────────────────────────────────────────────────────────
   Zamknięcie prezentacji jako BLOK, nie jako goły przycisk.

   Prośba Karola 2026-09-14: „przycisk do umówienia 30 min ma być całym blokiem
   zachęcającym. Że za darmo konsultacja i poznanie możliwości, z kalendarzem
   w tle i estetycznie."

   CO BLOK OBIECUJE i skąd to wiadomo:
   - „bezpłatna" i „nie zobowiązuje" — z akapitu sceny `contact`
     (`data/presentation.ts`), gdzie stoi też najważniejsze zdanie: z rozmowy
     wychodzimy z oceną RÓWNIEŻ wtedy, gdy brzmi ona „nie warto";
   - „30 minut" — to jest liczba z rejestru dozwolonych (`allowed-numbers.md`,
     zakres: cta, home, oferta, faq), ta sama co w etykiecie przycisku;
   - etykieta przycisku z `MESSAGING.cta.primary` (reguła `copy-cta-labels`:
     jedna intencja, jedna etykieta w całym serwisie).

   KALENDARZ JEST RYSOWANY, NIE OBRAZKIEM. Siatka dni powstaje z hairline'ów
   w tokenach, więc waży zero bajtów transferu, skaluje się bez rozmycia
   i sama chodzi za motywem. Leży pod treścią z `aria-hidden`, bo to ozdoba:
   nie ma w nim żadnej daty, której czytnik ekranu miałby nie usłyszeć.

   DLACZEGO BEZ DAT. Kalendarz z konkretnymi liczbami dni byłby albo
   zmyśleniem (dowolny miesiąc), albo obietnicą terminu, której nie składamy.
   Zaznaczone jest JEDNO pole, bez numeru: „jest wolny termin", nie „jest
   wolny 14-ego". */

/** Ile pól rysuje tło kalendarza: 6 tygodni × 7 dni, jak w prawdziwym miesiącu. */
const DNI = Array.from({ length: 42 }, (_, i) => i);
/** Pole zaznaczone jako wolny termin. Stała, nie losowa: determinizm. */
const WOLNY = 17;

export function ContactBlock({ onBook }: { onBook?: () => void }) {
  const { lang } = useLang();

  const zalety = [
    { pl: "Bezpłatna konsultacja", en: "Free consultation" },
    { pl: "30 minut, bez zobowiązań", en: "30 minutes, no strings" },
    { pl: "Wychodzisz z oceną, co da się zrobić", en: "You leave knowing what can be done" },
  ];

  return (
    <div className="pres-contact-block">
      {/* TŁO: kalendarz rysowany hairline'ami. Dekoracja, poza drzewem dostępności. */}
      <div className="pres-cal" aria-hidden="true">
        <div className="pres-cal-grid">
          {DNI.map((d) => (
            <span key={d} className="pres-cal-day" data-free={d === WOLNY ? "true" : undefined} />
          ))}
        </div>
      </div>

      <div className="pres-contact-body">
        <ul className="pres-contact-list">
          {zalety.map((z) => (
            <li key={z.pl} className="pres-contact-item">
              {pick(lang, z)}
            </li>
          ))}
        </ul>

        {/* Przycisk otwiera modal rezerwacji; bez niego zostaje link pocztowy
            z jedynego źródła NAP, żeby blok nigdy nie był ślepy. */}
        {onBook ? (
          <button type="button" className="btn btn-primary pres-contact-cta" onClick={onBook}>
            {pick(lang, MESSAGING.cta.primary)}
          </button>
        ) : (
          <a className="btn btn-primary pres-contact-cta" href={MAIL_HREF}>
            {pick(lang, MESSAGING.cta.primary)}
          </a>
        )}

        <p className="pres-contact-nap">
          <a href={PHONE_HREF}>{PHONE_DISPLAY}</a>
          <span aria-hidden="true"> · </span>
          <a href={MAIL_HREF}>{EMAIL}</a>
        </p>
      </div>
    </div>
  );
}

export default ContactBlock;
