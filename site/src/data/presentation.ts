/* Treść ośmiu scen prezentacji klarow.com. JEDNO źródło dla komponentów scen
 * i dla shellu prerendera.
 *
 * ── WERSJA 2 (2026-09-13) ──────────────────────────────────────────────────
 * Poprzednia wersja opowiadała o błędach w arkuszach i kończyła się ścianą
 * zrzutów z narzędzi. Founder odrzucił jedno i drugie:
 *   „Zły writing. Nie skupiamy się na błędach w excelu."
 *   „Nie musimy przedstawiać już narzędzi które zrobiłem. Możemy o tym zapomnieć."
 *
 * Stąd dwie zmiany, które trzeba rozumieć, zanim ktoś tu cokolwiek dopisze:
 *
 * 1. BOHATEREM PROBLEMU NIE JEST PLIK, TYLKO PRZEKAZANIE PRACY. Firma urosła,
 *    proces został ten sam; praca nie stoi u ludzi, stoi między nimi. To ta sama
 *    prawda co wcześniej, powiedziana bez pogardy dla narzędzia, którego klient
 *    używa codziennie. Słowo „Excel" nie pada w tym pliku ani razu i ma nie paść.
 *    Scena `scale` (88 % arkuszy z błędem) została USUNIĘTA — liczba była
 *    prawdziwa i miała źródło, ale opowiadała nie tę historię.
 *
 * 2. NIE POKAZUJEMY SWOICH NARZĘDZI. Scena `proof` (trzynaście zrzutów) została
 *    USUNIĘTA. W jej miejsce wchodzi `craft`: rodzaje pracy, które umiemy przejąć.
 *    Klient ma zobaczyć SWÓJ proces, nie nasz interfejs.
 *
 * ── OBJĘTOŚĆ: ZMIANA ZASADY ────────────────────────────────────────────────
 * Do wersji 1 obowiązywało „jedno zdanie na scenę" i całość miała 65 słów.
 * Founder wskazał `automatyzacje.ai` jako wzór treści („treściwie i wysoko
 * w SEO"). Tamta strona ma ok. 1 900 słów na jednej stronie i to jest CAŁY
 * sekret jej pozycji — nie technika, tylko gęstość. Nasz prerender jest lepszy
 * od ich SPA i mieliśmy 30× mniej tekstu.
 *
 * Dlatego scena ma teraz trzy warstwy o różnych zadaniach:
 *   headline — dwa fragmenty, <= 9 słów. Leży NA wideo, czyta się w ruchu.
 *   body     — 60–120 słów. Konkret. To jest warstwa, która robi SEO.
 *   points   — dokładnie trzy pozycje, <= 12 słów każda. Rzeczy sprawdzalne.
 * Nagłówek zostaje krótki jak był. Objętość idzie do `body` i `points`, których
 * w wersji 1 po prostu nie było.
 *
 * WARUNEK: `body` i `points` MUSZĄ trafić do prerenderu (`prerender/entry.tsx`).
 * Tekst, który istnieje tylko po starcie Reacta, nie robi SEO — wtedy cała ta
 * praca idzie w próżnię.
 *
 * ── LICZBY ─────────────────────────────────────────────────────────────────
 * Każda ma wiersz w `.claude/skills/klarow-guardian/references/allowed-numbers.md`
 * i lustro w `MESSAGING.allowedNumbers`. Liczba bez źródła nie wchodzi na ekran,
 * nawet jeśli „wszyscy ją znają". Zakazane mimo pokusy: procent oszczędności bez
 * pomiaru u klienta, „raport Deloitte o czasie w Excelu" (nie ma oryginału),
 * framing odejmowania etatu, kwoty za nasze usługi.
 *
 * SCENY 7 I 8 NIE MAJĄ WŁASNEGO COPY nagłówka. Zdania efektu stoją w `data/home.ts`,
 * zdania zamknięcia w `data/messaging.ts`. Ten plik je IMPORTUJE, nie przepisuje:
 * kopia zdania marki to błąd, nawet gdy brzmi identycznie.
 *
 * Scenariusz wiążący: `docs/plan/prezentacja-scenariusz.md`.
 */

import { MESSAGING } from "./messaging";
import { OUTCOMES } from "./home";

export type Bilingual = { pl: string; en: string };

/** Osiem beatów scenariusza v2 (`docs/plan/prezentacja-scenariusz.md` §3), w kolejności. */
export type SceneId =
  | "hook"
  | "handover"
  | "time"
  | "cost"
  | "turn"
  | "craft"
  | "outcome"
  | "contact";

/** Jednostka liczby. Zapis buduje formatter w `presentation/scenes/format.ts`,
 *  osobno dla PL i EN, żeby w danych nie leżał gotowy string „121 000 zł"
 *  (jedna liczba, jedno miejsce; separator tysięcy zależy od języka). */
export type FigureUnit = "percent" | "pln" | "plain";

export interface SceneFigure {
  /** wartość końcowa licznika. Brak = liczbę podaje komponent, bo zna ją z danych. */
  to?: number;
  unit: FigureUnit;
  /** „≈" przed liczbą: wynik jest przybliżeniem, nie kwotą z faktury */
  approx?: boolean;
  /** DZIAŁANIE, z którego bierze się liczba, widoczne obok wyniku.
   *  Czytelnik ma móc sprawdzić rachunek, a nie uwierzyć w wynik. */
  math?: Bilingual;
  /** co ta liczba mierzy */
  caption: Bilingual;
}

export interface Scene {
  id: SceneId;
  headline: Bilingual;
  /** Krótka nazwa beatu do kolofonu sceny („02 / 08 · Przekazanie").
   *  Jedno–dwa słowa. NIE jest to skrót nagłówka, tylko etykieta nawigacyjna. */
  label: Bilingual;
  /** Akapit sceny: 60–120 słów. Warstwa, która niesie SEO i konkret.
   *  Musi być w prerenderze, inaczej nie istnieje dla wyszukiwarki. */
  body?: Bilingual;
  /** Dokładnie trzy rzeczy sprawdzalne. Nie hasła — rzeczy, które da się zmierzyć. */
  points?: readonly Bilingual[];
  sub?: Bilingual;
  figure?: SceneFigure;
  /** skąd liczba; renderowane pod sceną drobnym stopniem. Jeden string na obie
   *  wersje językowe: nazwisko, instytucja i rok wydania nie mają tłumaczenia. */
  source?: string;
  /** wiersze efektu (tylko scena „outcome"); jedyne źródło: `data/home.ts` */
  beats?: readonly { icon: string; pl: string; en: string }[];
  /** etykieta przycisku (tylko scena „contact"); jedyne źródło: `MESSAGING.cta` */
  cta?: Bilingual;
}

export const SCENES = [
  /* 1. HAK. Zdanie o widzu, nie o nas, i bez cienia oskarżenia: firma urosła,
     co jest sukcesem, a proces po prostu za tym nie nadążył. Nikt nie musi się
     tu z niczego tłumaczyć, więc nikt nie zamyka karty. */
  {
    id: "hook",
    label: { pl: "Wzrost", en: "Growth" },
    headline: {
      pl: "Firma urosła. Proces został ten sam.",
      en: "The company grew. The process did not.",
    },
    body: {
      pl: "Proces, który powstał, gdy firma miała dwadzieścia osób, zwykle działa do jakiejś granicy, a potem przestaje. Nie pęka z hukiem: po prostu coraz więcej rzeczy wymaga dopytania, potwierdzenia i poprawki. Rośnie liczba zamówień, projektów i faktur, a droga, którą przechodzą, jest ta sama co kiedyś: przez te same ręce, w tej samej kolejności. Firma dokłada więc ludzi tam, gdzie robi się wąsko, i to działa jeszcze przez jakiś czas. Do następnej granicy.",
      en: "A process built when the company had twenty people usually works up to a point, and then stops. It does not break loudly: there are simply more things to ask about, confirm and correct. Orders, projects and invoices multiply, but the path they travel is the one from before: the same hands, the same order. So the company adds people where it gets tight, and that works for a while. Until the next limit.",
    },
    points: [
      { pl: "Ten sam obieg obsługuje trzy razy większy wolumen", en: "The same flow now carries three times the volume" },
      { pl: "Każdy wyjątek wraca do jednej osoby", en: "Every exception goes back to one person" },
      { pl: "Wiedza o procesie nie jest nigdzie zapisana", en: "How the process works is written down nowhere" },
    ],
  },

  /* 2. PRZEKAZANIE. Sedno nowej narracji. Ludzie pracują szybko; czas ucieka
     w przerwach MIĘDZY nimi. To zdanie zdejmuje winę z zespołu i kładzie ją na
     procesie, czyli na jedynej rzeczy, którą da się przebudować. */
  {
    id: "handover",
    label: { pl: "Przekazanie", en: "Handover" },
    headline: {
      pl: "Praca nie stoi u ludzi. Stoi między nimi.",
      en: "Work does not wait on people. It waits between them.",
    },
    body: {
      pl: "Jeśli zmierzyć, ile czasu zajmuje pojedyncza sprawa od zgłoszenia do zamknięcia, prawie zawsze okazuje się, że sama praca to ułamek, a resztę zajmuje czekanie na przekazanie. Dokument leży w skrzynce, aż ktoś go otworzy. Zestawienie czeka na dane z drugiego działu. Zatwierdzenie czeka na powrót z urlopu. Każde przekazanie to też miejsce, w którym coś można przepisać z błędem albo pominąć, a wtedy sprawa wraca na początek. Dlatego dokładanie ludzi do takiego procesu daje coraz mniej: dochodzą kolejne przekazania.",
      en: "Measure how long a single case takes from request to close and the work itself is almost always a fraction of it; the rest is waiting to be handed on. A document sits in an inbox until someone opens it. A summary waits for data from another department. An approval waits for someone to come back from leave. Every handover is also a place where something can be retyped wrongly or skipped, and then the case starts over. That is why adding people to such a process returns less and less: it adds handovers.",
    },
    points: [
      { pl: "Sprawa czeka dłużej, niż trwa jej obsługa", en: "A case waits longer than it takes to handle" },
      { pl: "Każde przepisanie danych to nowe miejsce na błąd", en: "Every retyping of data is a new place to slip" },
      { pl: "Nikt nie widzi, gdzie dokładnie utknęło", en: "Nobody can see where exactly it got stuck" },
    ],
  },

  /* 3. KOSZT CZASU. Bez liczby, bo nie zmierzyliśmy jej u klienta, a „X dni"
     bez pomiaru jest zmyśleniem. Zdanie mówi tyle, ile wiadomo, a akapit
     przenosi ciężar z pracochłonności na OPÓŹNIENIE DECYZJI — to jest koszt,
     który zarząd rozumie od razu. */
  {
    id: "time",
    label: { pl: "Czas", en: "Time" },
    headline: {
      pl: "Zamknięcie miesiąca. Liczone w tygodniach.",
      en: "Month-end close. Counted in weeks.",
    },
    body: {
      pl: "Najdroższy nie jest czas ludzi, którzy zamykają miesiąc. Najdroższe jest to, że zanim raport jest gotowy, opisuje sytuację sprzed kilku tygodni. Decyzja o zakupie, o zatrudnieniu albo o wstrzymaniu projektu zapada wtedy na obrazie, który zdążył się zmienić. Firma nie podejmuje więc złych decyzji, tylko spóźnione, co w praktyce wychodzi na to samo. Dotyczy to całej trójki naraz: raportowania zarządczego, kontroli budżetu i analiz finansowych. Dopóki powstają ręcznie, nikt nie zrobi ich częściej, bo każde powtórzenie kosztuje tyle samo pracy co poprzednie.",
      en: "The expensive part is not the time of the people closing the month. The expensive part is that by the time the report is ready, it describes a situation from several weeks ago. A decision to buy, to hire or to halt a project is then made on a picture that has already moved. So the company does not make bad decisions, only late ones, which in practice comes to the same thing. This holds for all three at once: management reporting, budget control and financial analysis. As long as they are produced by hand, nobody will produce them more often, because every repeat costs as much work as the last.",
    },
    points: [
      { pl: "Raport opisuje stan sprzed kilku tygodni", en: "The report describes a state from weeks ago" },
      { pl: "Budżet i wykonanie rozjeżdżają się między zamknięciami", en: "Budget and actuals drift apart between closes" },
      { pl: "Powtórzenie raportu kosztuje tyle samo co pierwszy", en: "Repeating the report costs as much as the first one" },
    ],
  },

  /* 4. KOSZT PIENIĘDZY. Pokazujemy DZIAŁANIE, nie sam wynik: mediana razy dwanaście
     miesięcy razy składki. Kto chce, przeliczy w dwie sekundy i zobaczy, że nic tu
     nie jest naciągnięte.
     TON: to nie jest zarzut wobec kontrolera. Firma, która go zatrudniła, właśnie
     wybrała człowieka. Zdanie mówi, na co ma iść jego czas, i NIGDY nie sugeruje,
     że kogoś da się odjąć — ta granica jest twarda i pilnuje jej reguła
     `copy-no-headcount-removal`. */
  {
    id: "cost",
    label: { pl: "Koszt", en: "Cost" },
    headline: {
      pl: "Ten etat ma kupować analizę.",
      en: "That role should be buying analysis.",
    },
    body: {
      pl: "Firma, która zatrudnia kontrolera, kupuje jego osąd: ocenę, czy marża na projekcie jest realna i gdzie się psuje. Płaci jednak za cały etat, a nie za te godziny, w których ten osąd faktycznie powstaje. Reszta idzie na zebranie danych, uzgodnienie ich między systemami i złożenie w jedno zestawienie, czyli pracę potrzebną, ale nietworzącą wartości. To nie jest powód, żeby kogokolwiek odejmować. To powód, żeby oddać maszynie zbieranie i uzgadnianie, a człowiekowi zostawić to, za co jest naprawdę płacony.",
      en: "A company that hires a controller is buying their judgement: whether a project margin is real and where it is leaking. But it pays for a whole role, not for the hours in which that judgement actually happens. The rest goes on gathering data, reconciling it between systems and assembling one summary: necessary work that creates nothing. That is not a reason to remove anyone. It is a reason to give the gathering and reconciling to a machine, and leave the person the part they are really paid for.",
    },
    figure: {
      to: 121000,
      unit: "pln",
      approx: true,
      math: {
        pl: "8 350 × 12 × 1,2048",
        en: "8,350 × 12 × 1.2048",
      },
      caption: {
        pl: "tyle rocznie kosztuje etat kontrolera",
        en: "the yearly cost of one controller role",
      },
    },
    source:
      "mediana 8 350 zł brutto: Sedlak & Sedlak, OBW 2026; składki pracodawcy 20,48 %: ZUS 2026",
  },

  /* 5. ZWROT. Pierwsze zdanie o nas w całej prezentacji, dopiero w piątej scenie.
     „Zamiast opisać proces" odcina nas od konsultantów, którzy oddają mapę procesu
     i zostawiają ten sam proces. Podlinia niesie mechanikę pilotu: kopia danych
     i termin, czyli jedyne dwie rzeczy, o które klient pyta na tym etapie. */
  {
    id: "turn",
    label: { pl: "Zwrot", en: "The turn" },
    headline: {
      pl: "Zamiast opisać proces, budujemy go na nowo.",
      en: "Instead of mapping the process, we rebuild it.",
    },
    sub: {
      pl: "Pod Twój proces, na kopii Twoich danych, do 10 dni.",
      en: "Around your process, on a copy of your data, within 10 days.",
    },
    body: {
      pl: "Audyt kończy się dokumentem, a dokument niczego nie robi. My zaczynamy od jednego procesu, który realnie boli, bierzemy kopię danych i budujemy narzędzie, które ten proces wykonuje u Was, na Waszej maszynie. Zakres zamrażamy przed startem, więc cena i termin są znane z góry. Nic nie wychodzi do chmury i nie ma abonamentu, od którego nie da się odejść: jeśli po pilocie zdecydujecie inaczej, zostaje Wam działający program i dokumentacja, a nie faktura za dostęp.",
      en: "An audit ends with a document, and a document does nothing. We start from one process that genuinely hurts, take a copy of the data and build the tool that performs it on your side, on your machine. Scope is frozen before we start, so price and date are known up front. Nothing leaves for a cloud and there is no subscription you cannot leave: if you decide otherwise after the pilot, what stays with you is a working program and its documentation, not a bill for access.",
    },
    points: [
      { pl: "Zamrożony zakres, stała cena, termin do 10 dni", en: "Frozen scope, fixed price, delivery within 10 days" },
      { pl: "Działa na Waszym sprzęcie, dane nie wychodzą", en: "Runs on your hardware, the data stays in" },
      { pl: "Po pilocie zostaje program, nie abonament", en: "After the pilot you keep a program, not a subscription" },
    ],
  },

  /* 6. CO POTRAFIMY. Zastępuje ścianę zrzutów. Klient ma tu rozpoznać SWÓJ proces,
     a nie oglądać nasz interfejs — dlatego to są RODZAJE PRACY, nie nazwy narzędzi
     i nie zrzuty ekranu. Lista jest celowo przekrojowa przez działy: founder prosił,
     żeby nie zamykać się w jednym dziale ani w jednym typie zadania. */
  {
    id: "craft",
    label: { pl: "Rzemiosło", en: "Craft" },
    headline: {
      pl: "Różne działy. Ten sam sposób pracy.",
      en: "Different departments. The same way of working.",
    },
    body: {
      pl: "Nie mamy zamkniętego katalogu produktów, bo procesy w firmach nie są takie same. Jest za to sposób pracy, który powtarza się niezależnie od działu: znaleźć miejsce, w którym dane przechodzą z rąk do rąk, i zastąpić to przejście czymś, co liczy zawsze tak samo. Najczęściej zaczynamy od raportowania, kontroli budżetu i analiz finansowych, bo tam rachunek jest najprostszy do sprawdzenia, a wynik widać po pierwszym zamknięciu. Poniżej rodzaje zadań, które już tak przebudowaliśmy: w kontrolingu, finansach, produkcji i administracji.",
      en: "We do not have a closed product catalogue, because company processes are not alike. What repeats, regardless of department, is a way of working: find the place where data passes from hand to hand, and replace that passage with something that computes the same way every time. We usually start with reporting, budget control and financial analysis, because there the arithmetic is easiest to verify and the result shows after the first close. Below are the kinds of work we have already rebuilt this way: in controlling, finance, production and administration.",
    },
    points: [
      { pl: "Raport zarządczy, który powstaje sam po zamknięciu", en: "A management report that builds itself after close" },
      { pl: "Budżet kontra wykonanie, liczone na bieżąco", en: "Budget against actuals, computed continuously" },
      { pl: "Analiza marży i kosztu projektu co do grosza", en: "Margin and project cost analysis to the last cent" },
      { pl: "Obieg dokumentów: od wpływu do zatwierdzenia", en: "Document flow: from arrival to approval" },
      { pl: "Uzgodnienie dwóch źródeł danych co do grosza", en: "Reconciling two data sources to the last cent" },
      { pl: "Przeniesienie danych między systemami bez przepisywania", en: "Moving data between systems without retyping" },
      { pl: "Rejestry i terminy, których nie wolno przegapić", en: "Registers and deadlines you cannot afford to miss" },
    ],
  },

  /* 7. EFEKT. Zero własnego copy: cztery zdania przychodzą z `home.ts`, gdzie
     przeszły już przegląd. Nagłówek też stamtąd, żeby nie powstała druga wersja
     tego samego tytułu. */
  {
    id: "outcome",
    label: { pl: "Efekt", en: "Outcome" },
    headline: OUTCOMES.title,
    beats: OUTCOMES.items,
    body: {
      pl: "Efekt widać nie w tym, że ktoś pracuje szybciej, tylko w tym, że część pracy przestaje istnieć. Zestawienie, które zajmowało dzień, jest gotowe rano i wygląda tak samo co miesiąc. Uzgodnienie, które kończyło się sporem o to, która wersja pliku jest właściwa, kończy się wydrukiem z jawnym rachunkiem. A ponieważ wynik jest powtarzalny, można na nim oprzeć decyzję, i to jest właściwa miara tego, czy wdrożenie się udało.",
      en: "The effect shows not in someone working faster, but in part of the work ceasing to exist. A summary that took a day is ready in the morning and looks the same every month. A reconciliation that used to end in an argument about which file version was right ends with a printout showing the arithmetic. And because the result is repeatable, a decision can rest on it, which is the proper measure of whether the rollout worked.",
    },
  },

  /* 8. KONTAKT. Zdanie zamknięcia i etykieta przycisku są zdaniami marki
     (`copy-one-liner-single-source`, `copy-cta-labels`): importujemy je, nigdy
     nie przepisujemy. Wariantów w rodzaju „Skontaktuj się" nie tworzymy. */
  {
    id: "contact",
    label: { pl: "Kontakt", en: "Contact" },
    headline: MESSAGING.closing.title,
    sub: MESSAGING.closing.lead,
    cta: MESSAGING.cta.primary,
    body: {
      pl: "Nie trzeba przygotowywać specyfikacji ani zwoływać zespołu. Wystarczy jeden proces, o którym wiadomo, że zajmuje za dużo czasu, i krótka rozmowa o tym, jak dzisiaj przebiega. Z takiej rozmowy wychodzimy z oceną, czy da się go przebudować, ile to zajmie i czy w ogóle warto, również wtedy, gdy odpowiedź brzmi, że nie warto. Diagnoza jest bezpłatna i nie zobowiązuje do niczego dalej.",
      en: "There is no need to prepare a specification or convene a team. One process you know takes too long is enough, plus a short conversation about how it runs today. We leave such a conversation with an assessment of whether it can be rebuilt, how long that takes and whether it is worth it at all, including when the answer is that it is not. The diagnosis is free and commits you to nothing further.",
    },
  },
] as const satisfies readonly Scene[];

/** Kolejność scen jako typ: silnik prezentacji nie może pominąć ani przestawić beatu. */
export type SceneData = (typeof SCENES)[number];

/** Dokładny kształt JEDNEJ sceny: `scene("cost").figure` jest typu `SceneFigure`,
 *  a nie `SceneFigure | undefined`, bo krotka `SCENES` zna swoją zawartość. */
export type SceneOf<K extends SceneId> = Extract<SceneData, { id: K }>;

/* Rzutowanie jest bezpieczne: `SCENES` jest krotką z `as const`, w której każdy
   identyfikator z `SceneId` występuje dokładnie raz (gdyby któryś zniknął,
   `Extract` dałby `never` i wywołanie przestałoby się kompilować). TypeScript nie
   potrafi tego udowodnić przez `.find`, stąd jedno jawne rzutowanie w jednym
   miejscu zamiast ośmiu wykrzykników w scenach. */
/** Scena po identyfikatorze. Czysta funkcja, zero stanu. */
export function scene<K extends SceneId>(id: K): SceneOf<K> {
  return SCENES.find((s) => s.id === id) as SceneOf<K>;
}
