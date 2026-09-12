/* Treść trasy /rodo: klauzula informacyjna z art. 14 RODO i polityka
   prywatności serwisu w jednym dokumencie (plan „strona v2” §4.6; reguła
   legal-rodo-page-required).

   Ten moduł karmi DWIE powierzchnie tą samą treścią: komponent RodoPage
   (React) i RodoShell w src/prerender/entry.tsx (statyczny HTML). Proza
   przepisana ręcznie w shellu = rozjazd dokumentu prawnego, więc obie strony
   renderują z tej tablicy.

   Trzy rzeczy, których nie wolno tu zepsuć:
   1. Źródła danych są KONKRETNE i nazwane. Formuła „ze źródeł publicznie
      dostępnych” (i każdy jej wariant) jest zakazana: to ją zakwestionowano
      w sprawie zakończonej karą 943 470 zł, potwierdzoną przez NSA.
   2. Prawo sprzeciwu stoi w osobnym, wyróżnionym bloku (pole objection),
      renderowanym PRZED sekcją „prawa”, nigdy jako punkt listy praw. Wymaga
      tego wprost art. 21 ust. 4 RODO.
   3. Okres przechowywania jest konkretny. Zwrot „przez okres niezbędny do
      realizacji celu” nie spełnia obowiązku informacyjnego.

   Trasa ma noindex do przeglądu radcy (decyzja D-21) i nie wchodzi do
   sitemapy; jest publiczna i linkowana ze stopki na każdej trasie oraz
   z każdego szablonu outboundu. */

import type { Bilingual } from "@/data/messaging";
import {
  EMAIL,
  MAIL_RODO_OBJECTION,
  PHONE_DISPLAY,
  PHONE_E164,
  UODO,
  UODO_ADDRESS,
} from "@/data/contact";

/* BRAMKA PUBLIKACJI. Dopóki w sekcji „administrator” stoi marker
   [DECYZJA FOUNDERÓW: …], klauzula nie jest kompletna w rozumieniu art. 14
   ust. 1 lit. a RODO (brak tożsamości administratora), więc strona nie może
   pójść na produkcję ani do outboundu. Po wpisaniu nazwy, adresu i NIP:
   podmienić marker i ustawić RODO_READY = true w tym samym commicie.
   Bramka verify-site.mjs ma sprawdzać oba warunki naraz. */
export const RODO_READY = false;

export interface RodoSection {
  id: string;
  title: Bilingual;
  /** „text” = akapity, „list” = pozycje listy */
  variant: "text" | "list";
  body: { pl: readonly string[]; en: readonly string[] };
  /** zdanie pod listą albo pod akapitami */
  note?: Bilingual;
}

export interface RodoObjection {
  id: "sprzeciw";
  /** blok renderowany odrębnie i wyróżnienie graficzne (obrys, wyższy stopień
   *  pisma), zawsze PRZED sekcją o tym id (art. 21 ust. 4 RODO) */
  renderBefore: string;
  title: Bilingual;
  body: { pl: readonly string[]; en: readonly string[] };
  cta: { label: Bilingual; href: Bilingual };
}

export interface RodoAuthority {
  name: Bilingual;
  address: string;
  note: Bilingual;
}

export interface RodoContent {
  h1: Bilingual;
  lead: Bilingual;
  /** data ostatniej aktualizacji, wpisana ręcznie; nigdy Date.now ani new Date */
  updated: string;
  disclaimer: Bilingual;
  sections: readonly RodoSection[];
  objection: RodoObjection;
  authority: RodoAuthority;
}

export const RODO = {
  h1: {
    pl: "Skąd mamy Twoje dane i jak je usunąć",
    en: "Where your data comes from and how to delete it",
  },

  lead: {
    pl: "Ta strona mówi wprost, skąd mamy Twoje dane, po co je przetwarzamy, jak długo je trzymamy i jak jednym mailem powiedzieć „nie”.",
    en: "This page says plainly where your data comes from, why we process it, how long we keep it and how to say no in one email.",
  },

  updated: "2026-09-12",

  disclaimer: {
    pl: "Wersja polska jest wiążąca. Tłumaczenie angielskie ma charakter informacyjny.",
    en: "The Polish version is binding. The English translation is provided for information only.",
  },

  sections: [
    {
      id: "administrator",
      title: { pl: "Administrator danych", en: "Data controller" },
      variant: "text",
      body: {
        pl: [
          "[DECYZJA FOUNDERÓW: pełna nazwa działalności, adres siedziby, NIP. Do czasu wpisania tych danych strona nie idzie na produkcję i nie wychodzi ani jeden kontakt handlowy.]",
          `We wszystkich sprawach dotyczących danych napisz na ${EMAIL} albo zadzwoń: ${PHONE_DISPLAY}.`,
        ],
        en: [
          "[DECYZJA FOUNDERÓW: pełna nazwa działalności, adres siedziby, NIP. Do czasu wpisania tych danych strona nie idzie na produkcję i nie wychodzi ani jeden kontakt handlowy.]",
          `For anything concerning your data write to ${EMAIL} or call ${PHONE_E164}.`,
        ],
      },
    },
    {
      id: "zrodla",
      title: { pl: "Skąd mamy Twoje dane", en: "Where your data comes from" },
      variant: "list",
      body: {
        pl: [
          "z ogłoszenia o pracę opublikowanego na portalu pracuj.pl albo w LinkedIn Jobs; datę publikacji ogłoszenia zapisujemy i podajemy w pierwszej wiadomości",
          "z Krajowego Rejestru Sądowego (KRS)",
          "z Centralnej Ewidencji i Informacji o Działalności Gospodarczej (CEIDG)",
          "z rejestru REGON prowadzonego przez Główny Urząd Statystyczny",
          "z publicznego profilu firmy albo osoby kontaktowej na LinkedIn",
          "ze strony internetowej Twojej firmy",
        ],
        en: [
          "from a job advertisement published on pracuj.pl or LinkedIn Jobs; we record the publication date and quote it in our first message",
          "from the National Court Register (KRS)",
          "from the Central Register and Information on Economic Activity (CEIDG)",
          "from the REGON register kept by Statistics Poland",
          "from a public company or contact-person profile on LinkedIn",
          "from your company website",
        ],
      },
      note: {
        pl: "Nie kupujemy baz danych, nie korzystamy z brokerów danych i nie zbieramy adresów pocztowych automatycznie ze stron internetowych. W pierwszej wiadomości zawsze podajemy konkretne źródło, z którego mamy Twoje dane.",
        en: "We do not buy databases, we do not use data brokers and we do not harvest email addresses from websites. Our first message always names the specific source your data came from.",
      },
    },
    {
      id: "kategorie",
      title: { pl: "Jakie dane przetwarzamy", en: "What data we process" },
      variant: "list",
      body: {
        pl: [
          "imię i nazwisko oraz stanowisko osoby kontaktowej",
          "służbowy adres e-mail i służbowy numer telefonu",
          "nazwę, adres i dane rejestrowe firmy",
          "treść ogłoszenia albo innego publicznego sygnału, który był powodem kontaktu",
          "treść korespondencji, którą z nami prowadzisz",
        ],
        en: [
          "the contact person's name and job title",
          "a business email address and a business phone number",
          "the company name, address and registration data",
          "the job advertisement or other public signal that prompted our contact",
          "the content of your correspondence with us",
        ],
      },
    },
    {
      id: "podstawa",
      title: { pl: "Po co i na jakiej podstawie", en: "Why and on what legal basis" },
      variant: "text",
      body: {
        pl: [
          "Podstawą jest art. 6 ust. 1 lit. f RODO, czyli nasz prawnie uzasadniony interes: marketing bezpośredni własnych usług, kierowany do firm o profilu odpowiadającym naszej ofercie (motyw 47 RODO).",
          "Na czym ten interes polega: chcemy zaproponować firmom z produkcji, budownictwa i dystrybucji narzędzia do pracy na danych. Piszemy do osób odpowiedzialnych za kontroling, finanse albo zarząd, jednorazowo, z możliwością odmowy w każdej chwili.",
          "Informację handlową w rozumieniu art. 398 Prawa komunikacji elektronicznej wysyłamy wyłącznie po Twojej uprzedniej zgodzie. Pierwsza wiadomość jest prośbą o zgodę, nie ofertą.",
          "Gdy sam piszesz do nas albo rezerwujesz rozmowę, przetwarzamy dane także na podstawie art. 6 ust. 1 lit. b RODO, czyli działań przed zawarciem umowy.",
        ],
        en: [
          "The basis is Article 6(1)(f) GDPR, our legitimate interest: direct marketing of our own services addressed to companies matching our offer (recital 47 GDPR).",
          "What that interest is: we want to offer data tools to manufacturing, construction and distribution companies. We write once to the people responsible for controlling, finance or management, and you can decline at any moment.",
          "Commercial information within the meaning of Article 398 of the Polish Electronic Communications Law is sent only after your prior consent. Our first message asks for that consent, it is not an offer.",
          "When you write to us or book a call, we also process data under Article 6(1)(b) GDPR, that is steps taken before entering into a contract.",
        ],
      },
    },
    {
      id: "okres",
      title: { pl: "Jak długo trzymamy dane", en: "How long we keep the data" },
      variant: "text",
      body: {
        pl: [
          "Do wniesienia sprzeciwu. Jeśli sprzeciw nie wpłynie, a rozmowa się nie zacznie, usuwamy dane najpóźniej po 12 miesiącach od pierwszego kontaktu.",
          "Korespondencję, w której doszło do zawarcia umowy, przechowujemy przez okres wymagany przepisami podatkowymi.",
        ],
        en: [
          "Until you object. If no objection arrives and no conversation starts, we delete the data no later than 12 months after the first contact.",
          "Correspondence that led to a contract is kept for the period required by tax law.",
        ],
      },
    },
    {
      id: "odbiorcy",
      title: {
        pl: "Komu przekazujemy dane",
        en: "Who we share the data with",
      },
      variant: "text",
      body: {
        pl: [
          "Nie sprzedajemy danych. Poza osobami prowadzącymi Klarow dane widzą wyłącznie dostawcy, z których korzystamy: Cloudflare (hosting strony i pomiar ruchu bez cookies), dostawca poczty (Google, Resend) oraz Cal.com, jeśli rezerwujesz przez niego rozmowę.",
          `Część tych dostawców przetwarza dane na serwerach w USA. Podstawą takiego przekazania są standardowe klauzule umowne (SCC) albo Data Privacy Framework, w zależności od dostawcy; kopię zabezpieczeń wyślemy na prośbę wysłaną na ${EMAIL}.`,
        ],
        en: [
          "We do not sell data. Apart from the people running Klarow, your data is seen only by the providers we use: Cloudflare (site hosting and cookieless traffic measurement), our mail provider (Google, Resend) and Cal.com if you book a call through it.",
          `Some of these providers process data on servers in the USA. Such transfers are based on standard contractual clauses (SCC) or the Data Privacy Framework, depending on the provider; we will send a copy of the safeguards on request to ${EMAIL}.`,
        ],
      },
    },
    {
      id: "profilowanie",
      title: {
        pl: "Zautomatyzowane decyzje i profilowanie",
        en: "Automated decisions and profiling",
      },
      variant: "text",
      body: {
        pl: [
          "Nie podejmujemy wobec Ciebie decyzji wyłącznie w sposób zautomatyzowany i nie profilujemy Cię jako osoby.",
          "Firmy oceniamy wstępnie prostą punktacją dopasowania do naszego profilu klienta: branża, wielkość zatrudnienia, publiczny sygnał zakupowy, na przykład ogłoszenie o pracę. Punktacja dotyczy firmy, nie Ciebie, i niczego nie przesądza: o tym, czy i do kogo napiszemy, decyduje człowiek.",
        ],
        en: [
          "We do not make decisions about you based solely on automated processing, and we do not profile you as an individual.",
          "We score companies on a simple fit scale: industry, headcount, a public buying signal such as a job posting. The score describes the company, not you, and decides nothing on its own: a human decides whether and whom we contact.",
        ],
      },
    },
    {
      id: "prawa",
      title: { pl: "Twoje prawa", en: "Your rights" },
      variant: "list",
      body: {
        pl: [
          "dostęp do danych i otrzymanie ich kopii",
          "sprostowanie danych, które są nieprawidłowe",
          "usunięcie danych",
          "ograniczenie przetwarzania",
          "przeniesienie danych, gdy przetwarzamy je na podstawie umowy",
          "skarga do organu nadzorczego",
        ],
        en: [
          "access to your data and a copy of it",
          "rectification of data that is incorrect",
          "erasure of your data",
          "restriction of processing",
          "data portability, where we process data under a contract",
          "a complaint to the supervisory authority",
        ],
      },
      note: {
        pl: "Prawo sprzeciwu opisujemy wyżej, w osobnym bloku, bo wymaga tego art. 21 ust. 4 RODO.",
        en: "The right to object is described above in a separate block, as required by Article 21(4) GDPR.",
      },
    },
    {
      id: "strona",
      title: { pl: "Strona klarow.com", en: "The klarow.com website" },
      variant: "list",
      body: {
        pl: [
          "nie używamy cookies analitycznych ani marketingowych",
          "ruch mierzymy wyłącznie narzędziem bez cookies (Cloudflare Web Analytics); nie zapisujemy identyfikatorów osób i nie profilujemy odwiedzających",
          "w pamięci przeglądarki (localStorage) trzymamy dwie rzeczy: wybór języka i jednorazowy znacznik samonaprawy pamięci podręcznej",
          "liczymy kliknięcia w przyciski kontaktu, bez identyfikatorów osób",
          "jeśli powstanie formularz zapisu, zgoda będzie odrębna, niezaznaczona domyślnie i potwierdzona mailem (double opt-in)",
        ],
        en: [
          "we use no analytics or marketing cookies",
          "traffic is measured only with a cookieless tool (Cloudflare Web Analytics); we store no personal identifiers and do not profile visitors",
          "browser storage (localStorage) holds two things: your language choice and a one-off cache self-repair marker",
          "we count clicks on contact buttons, without personal identifiers",
          "if a sign-up form appears, consent will be separate, unticked by default and confirmed by email (double opt-in)",
        ],
      },
    },
    {
      id: "zmiany",
      title: { pl: "Zmiany tego dokumentu", en: "Changes to this document" },
      variant: "text",
      body: {
        pl: [
          "Datę ostatniej aktualizacji podajemy na górze strony. Każdą zmianę publikujemy w tym samym miejscu, pod tym samym adresem.",
        ],
        en: [
          "The date of the last update is shown at the top of this page. Every change is published in the same place, at the same address.",
        ],
      },
    },
  ],

  objection: {
    id: "sprzeciw",
    renderBefore: "prawa",
    title: { pl: "Prawo sprzeciwu", en: "Right to object" },
    body: {
      pl: [
        "Masz prawo w dowolnym momencie wnieść sprzeciw wobec przetwarzania Twoich danych do celów marketingu bezpośredniego, w tym wobec kontaktu handlowego.",
        "Wystarczy jeden mail o treści „sprzeciw”. Po jego otrzymaniu natychmiast przestajemy przetwarzać dane w tym celu, usuwamy Cię z bazy kontaktów w ciągu 7 dni i potwierdzamy to mailem.",
      ],
      en: [
        "You have the right to object at any time to the processing of your data for direct marketing, including sales contact.",
        "One email with the word objection is enough. From the moment it arrives we stop processing your data for that purpose, remove you from our contact list within 7 days and confirm it by email.",
      ],
    },
    cta: {
      label: { pl: "Wyślij sprzeciw", en: "Send an objection" },
      href: { pl: MAIL_RODO_OBJECTION.pl, en: MAIL_RODO_OBJECTION.en },
    },
  },

  authority: {
    name: { pl: UODO.name.pl, en: UODO.name.en },
    address: UODO_ADDRESS,
    note: {
      pl: "Jeśli uważasz, że przetwarzamy Twoje dane niezgodnie z prawem, możesz wnieść skargę do organu nadzorczego.",
      en: "If you believe we process your data unlawfully, you can lodge a complaint with the supervisory authority.",
    },
  },
} as const satisfies RodoContent;
