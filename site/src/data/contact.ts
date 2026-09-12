/* NAP i stałe kontaktowe KLAROW: JEDYNE źródło (reguła code-contact-single-source).

   Dziś te same wartości siedzą w czterech plikach naraz (BookingModal.tsx,
   App.tsx, Seo.tsx, prerender/entry.tsx); po fazie wiringu każdy z nich
   importuje stąd. Literał telefonu, adresu e-mail albo domeny poza tym plikiem
   jest błędem; jedyny dozwolony wyjątek to site/index.html, który nie importuje
   modułów TS (canonical i og:url w szablonie Vite, podmieniane per trasa przez
   scripts/prerender.mjs).

   W dist wolno zobaczyć dokładnie cztery warianty: „786 296 426”,
   „+48 786 296 426”, „tel:+48786296426” i adres kontakt@klarow.com. Każdy inny
   zapis numeru rozjeżdża NAP między JSON-LD, stopką i llms.txt. */

export const ORIGIN = "https://klarow.com";

/** Nazwa organizacji w JSON-LD i w tytułach. Znak marki na stronie to tekstowy
 *  wordmark KLAROW (komponent BrandMark), nie ten string. */
export const ORG_NAME = "Klarow";

export const EMAIL = "kontakt@klarow.com";
export const MAIL_HREF = `mailto:${EMAIL}`;

export const PHONE_DISPLAY = "786 296 426";
/** forma międzynarodowa: JSON-LD, wizytówka, powierzchnie EN */
export const PHONE_E164 = "+48 786 296 426";
export const PHONE_HREF = "tel:+48786296426";

export const AREA_SERVED = ["PL", "US"] as const;

/** Tematy wiadomości dla gotowych linków mailto. Widoczne dla odbiorcy,
 *  więc para PL/EN (i18n-pl-en-pair-required). */
export const MAIL_SUBJECTS = {
  worstExcel: { pl: "Najgorszy Excel", en: "Worst spreadsheet" },
  rodoObjection: { pl: "Sprzeciw RODO", en: "GDPR objection" },
} as const;

/** Buduje href mailto z zakodowanym tematem i treścią. Czysta funkcja:
 *  zero dat, zero losowości, ten sam wynik dla tych samych argumentów. */
export function mailHref(subject?: string, body?: string): string {
  const params: string[] = [];
  if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
  if (body) params.push(`body=${encodeURIComponent(body)}`);
  return params.length ? `${MAIL_HREF}?${params.join("&")}` : MAIL_HREF;
}

/** Hak „Przyślij najgorszy Excel”: inbound, więc bez zgody z art. 398 PKE. */
export const MAIL_WORST_EXCEL = {
  pl: mailHref(MAIL_SUBJECTS.worstExcel.pl),
  en: mailHref(MAIL_SUBJECTS.worstExcel.en),
};

/** Mechanizm sprzeciwu z /rodo (art. 21 RODO): gotowy temat, żadnego backendu. */
export const MAIL_RODO_OBJECTION = {
  pl: mailHref(MAIL_SUBJECTS.rodoObjection.pl),
  en: mailHref(MAIL_SUBJECTS.rodoObjection.en),
};

/* Profile LinkedIn founderów: puste do decyzji D-05 (czy i które profile
   podajemy publicznie). Pusty string = brak linku; JSON-LD pomija wtedy pole
   sameAs, a stopka nie renderuje ikony. Po decyzji wpisać pełne adresy tutaj,
   w jednym miejscu, i nigdzie indziej. */
export const LINKEDIN: { pawel: string; karol: string } = {
  pawel: "",
  karol: "",
};

/** sameAs do JSON-LD: pusta tablica, dopóki nie ma decyzji D-05. */
export const SAME_AS: readonly string[] = [LINKEDIN.pawel, LINKEDIN.karol].filter(
  (url) => url.length > 0
);

/** Organ nadzorczy dla klauzuli z art. 14 RODO (konsumuje /rodo). */
export const UODO = {
  name: {
    pl: "Prezes Urzędu Ochrony Danych Osobowych",
    en: "President of the Personal Data Protection Office (Poland)",
  },
  street: "ul. Stawki 2",
  postalCode: "00-193",
  city: "Warszawa",
} as const;

/** „ul. Stawki 2, 00-193 Warszawa” w jednej linii. */
export const UODO_ADDRESS = `${UODO.street}, ${UODO.postalCode} ${UODO.city}`;
