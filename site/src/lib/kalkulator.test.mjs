import { test } from "node:test";
import assert from "node:assert/strict";
import { policz, formatujZl, tekstKwoty } from "./kalkulator.ts";

/** Te cztery wiersze są jednocześnie presetami na stronie. Jeśli test padnie, strona kłamie. */
const PRESETY = [
  { nazwa: "raport", dane: { osoby: 3, godziny: 3, koszt: 70, udzial: 60 },
    ocz: { godzinyRok: 237, dniRobocze: 29, kwota: 16600, zakresDolem: 8300, zakresGora: 19400 } },
  { nazwa: "ksef", dane: { osoby: 1, godziny: 8, koszt: 60, udzial: 60 },
    ocz: { godzinyRok: 211, dniRobocze: 26, kwota: 12600, zakresDolem: 6300, zakresGora: 14700 } },
  { nazwa: "magazyn", dane: { osoby: 2, godziny: 6, koszt: 55, udzial: 50 },
    ocz: { godzinyRok: 264, dniRobocze: 33, kwota: 14500, zakresDolem: 8700, zakresGora: 20300 } },
  { nazwa: "oferty", dane: { osoby: 2, godziny: 5, koszt: 80, udzial: 60 },
    ocz: { godzinyRok: 264, dniRobocze: 33, kwota: 21100, zakresDolem: 10500, zakresGora: 24600 } },
];

for (const { nazwa, dane, ocz } of PRESETY) {
  test(`preset ${nazwa}`, () => assert.deepEqual(policz(dane), ocz));
}

test("zaokrąglamy zawsze w dół, nigdy w górę", () => {
  const w = policz({ osoby: 1, godziny: 1, koszt: 199, udzial: 90 });
  assert.equal(w.godzinyRok, 39); // 39,6 h
  assert.equal(w.kwota, 7800); // 7880,4 zł
});

test("polskie grupowanie obejmuje liczby czterocyfrowe", () => {
  assert.equal(formatujZl(8300), "8 300 zł");
  assert.equal(tekstKwoty(policz(PRESETY[0].dane)), "≈ 16 600 zł rocznie");
});
