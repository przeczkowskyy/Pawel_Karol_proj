import type { Lang } from "@/i18n";
import type { FigureUnit } from "@/data/presentation";

/* Zapis liczb scen. Osobno dla PL i EN, bo separator tysięcy i miejsce waluty
   są inne, a w danych ma leżeć LICZBA, nie gotowy string.

   Zero `Intl.NumberFormat`: dane ICU różnią się między silnikami i wersjami
   systemu, więc ten sam build potrafiłby dać „121 000" tu i „121,000" tam.
   Determinizm jest obietnicą produktową (CLAUDE.md #6), więc grupowanie robi
   pętla na cyfrach. Zero `Date.now`, zero `Math.random`.

   Spacja nierozdzielająca (U+00A0) w PL: „121 000 zł" i „88 %" nie mogą się
   złamać w poprzek liczby przy zawijaniu wiersza. */

const NBSP = " ";

/** Grupowanie cyfr po trzy. Czysta funkcja: ten sam argument, ten sam wynik. */
export function groupDigits(n: number, separator: string): string {
  const digits = String(Math.abs(Math.round(n)));
  let out = "";
  for (let i = 0; i < digits.length; i++) {
    if (i > 0 && (digits.length - i) % 3 === 0) out += separator;
    out += digits[i];
  }
  return n < 0 ? `-${out}` : out;
}

type FormatOptions = { approx?: boolean };

/** Zwraca funkcję formatującą dla `ScrollCounter` (licznik woła ją w każdej klatce,
 *  więc nie wolno w niej nic alokować poza wynikiem). */
export function figureFormatter(
  unit: FigureUnit,
  lang: Lang,
  { approx = false }: FormatOptions = {},
): (n: number) => string {
  const prefix = approx ? `≈${NBSP}` : "";
  if (unit === "percent") {
    return lang === "pl"
      ? (n) => `${prefix}${groupDigits(n, NBSP)}${NBSP}%`
      : (n) => `${prefix}${groupDigits(n, ",")}%`;
  }
  if (unit === "pln") {
    return lang === "pl"
      ? (n) => `${prefix}${groupDigits(n, NBSP)}${NBSP}zł`
      : (n) => `${prefix}PLN${NBSP}${groupDigits(n, ",")}`;
  }
  return lang === "pl"
    ? (n) => `${prefix}${groupDigits(n, NBSP)}`
    : (n) => `${prefix}${groupDigits(n, ",")}`;
}
