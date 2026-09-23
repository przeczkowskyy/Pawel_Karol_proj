/**
 * Kalkulator „ile kosztuje ręczna robota”.
 *
 * Wzór: osoby × godziny tygodniowo × 44 tygodnie × udział × koszt godziny.
 * 44 tygodnie = 52 minus urlop, święta i choroby.
 *
 * Zaokrąglamy zawsze W DÓŁ (godziny i dni do całości, kwoty do 100 zł), czyli zawsze
 * na niekorzyść wyniku. Wolimy pokazać mniej niż obiecać za dużo.
 */

export const TYGODNIE = 44;
export const GODZIN_W_DNIU = 8;

export type Dane = { osoby: number; godziny: number; koszt: number; udzial: number };

export type Wynik = {
  godzinyRok: number;
  dniRobocze: number;
  kwota: number;
  zakresDolem: number;
  zakresGora: number;
};

const doStu = (x: number) => Math.floor(x / 100) * 100;

export function policz({ osoby, godziny, koszt, udzial }: Dane): Wynik {
  const bazaGodzin = osoby * godziny * TYGODNIE;
  const godzinyRok = bazaGodzin * (udzial / 100);
  return {
    godzinyRok: Math.floor(godzinyRok),
    dniRobocze: Math.floor(godzinyRok / GODZIN_W_DNIU),
    kwota: doStu(godzinyRok * koszt),
    zakresDolem: doStu(bazaGodzin * 0.3 * koszt),
    zakresGora: doStu(bazaGodzin * 0.7 * koszt),
  };
}

/** Polskie grupowanie także dla liczb czterocyfrowych: 8 300, nie 8300. */
const liczba = new Intl.NumberFormat("pl-PL", { useGrouping: "always", maximumFractionDigits: 0 });

export const formatujLiczbe = (x: number) => liczba.format(x).replace(/ |\s/g, " ");

/** Twarda spacja przed „zł”, żeby jednostka nigdy nie została sama w nowej linii. */
export const formatujZl = (x: number) => `${formatujLiczbe(x)} zł`;

export const tekstKwoty = (w: Wynik) => `≈ ${formatujZl(w.kwota)} rocznie`;

export const tekstCzasu = (w: Wynik) =>
  `≈ ${formatujLiczbe(w.godzinyRok)} godzin · ${formatujLiczbe(w.dniRobocze)} dni roboczych`;

export const tekstZakresu = (w: Wynik) =>
  `Przy udziale 30–70%: ≈ ${formatujLiczbe(w.zakresDolem)} – ${formatujZl(w.zakresGora)}`;

export const tekstWzoru = (d: Dane) =>
  `${d.osoby} os. × ${d.godziny} h × ${TYGODNIE} tyg. × ${d.udzial}% × ${d.koszt} zł`;
