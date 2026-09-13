/* Treść strony głównej v2. JEDNO źródło dla komponentów React i dla shellu prerendera.
 *
 * Reguła nadrzędna tego pliku, wprost od foundera (2026-09-13): „za dużo tekstu".
 * Poprzednia strona główna miała sześć sekcji zbudowanych z kart typu ikona plus
 * nagłówek plus akapit. Tutaj sekcja ma NAJWYŻEJ nagłówek i jedną linię, a resztę
 * mówi ruch: wykres, który buduje się przy scrollu, i siatka, która układa się
 * z chaosu w tabelę. Jeśli kolejna sesja będzie chciała coś dopisać, niech najpierw
 * usunie coś innego: limit to jedna linia na sekcję i sześć słów na kafel.
 *
 * Limity, które mają być egzekwowane przy przeglądzie:
 *   nagłówek sekcji  <= 5 słów
 *   linia pod nim    <= 14 słów, i tylko wtedy, gdy ruch sam nie wystarcza
 *   etykieta kafla   <= 6 słów, bez kropki na końcu
 */

export type Bilingual = { pl: string; en: string };

/** Scena „chaos w porządek": dwa podpisy, po jednym na każdy koniec animacji. */
export const CHAOS = {
  start: {
    pl: "Tak wygląda to dzisiaj",
    en: "This is what it looks like today",
  },
  end: {
    pl: "Tak wygląda po nas",
    en: "This is what it looks like after us",
  },
  /** Widoczne dopiero na końcu sceny, gdy siatka jest już tabelą. */
  columns: {
    pl: ["Projekt", "Etap", "Wykonanie", "Koszt"],
    en: ["Project", "Stage", "Progress", "Cost"],
  },
} as const;

/** Sekcja z wykresem budującym się przy scrollu. */
export const CHART = {
  title: { pl: "Raport zarządu w sekundy", en: "The board report in seconds" },
  line: {
    pl: "Ten wykres liczy się z pliku, który wrzucisz. Bez wysyłania go gdziekolwiek.",
    en: "This chart is computed from the file you drop in. Nothing is sent anywhere.",
  },
  caption: {
    pl: "Dane przykładowe. Te same dane dają zawsze ten sam wynik.",
    en: "Sample data. The same input always gives the same result.",
  },
} as const;

/** Ściana narzędzi: nagłówek i nic więcej. Nazwy narzędzi niosą treść. */
export const WALL = {
  title: { pl: "Co zbudowaliśmy", en: "What we have built" },
  line: {
    pl: "Trzynaście narzędzi. Każde otwierasz i liczysz na danych przykładowych.",
    en: "Thirteen tools. Open any of them and compute on sample data.",
  },
  cta: { pl: "Wszystkie narzędzia", en: "All tools" },
} as const;

/** Co zyskuje klient. Cztery linie, zero akapitów, zero liczb bez źródła. */
export const OUTCOMES = {
  title: { pl: "Co zyskujesz", en: "What you gain" },
  items: [
    {
      icon: "Clock",
      pl: "Godziny kontrolera wracają do kontrolingu",
      en: "Your controller's hours go back to controlling",
    },
    {
      icon: "CalendarCheck",
      pl: "Zamknięcie miesiąca w dni, nie w tygodnie",
      en: "Month-end close in days, not weeks",
    },
    {
      icon: "ShieldAlert",
      pl: "Błąd widać przed zarządem, nie po",
      en: "Errors surface before the board, not after",
    },
    {
      icon: "Umbrella",
      pl: "Urlop bez telefonów o plik",
      en: "A holiday without calls about the file",
    },
  ],
} as const;

/** Sekcja o ludziach: bez firmy stoją za tym dwie osoby i ich artefakty. */
export const PEOPLE = {
  title: {
    pl: "Rozmawiasz z tym, kto to zbudował",
    en: "You talk to the person who built it",
  },
  line: {
    pl: "Dwie osoby, zero pośredników. Kod i dokumentacja zostają u Ciebie.",
    en: "Two people, no middlemen. The code and docs stay with you.",
  },
} as const;

/** Zamknięcie. Jedno zdanie i jeden przycisk. */
export const CLOSING = {
  title: { pl: "Pokaż nam proces, który boli", en: "Show us the process that hurts" },
  line: {
    pl: "W 30 minut powiemy, co da się z nim zrobić.",
    en: "In 30 minutes we will tell you what can be done with it.",
  },
} as const;
