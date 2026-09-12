---
id: demo-money-integers
title: Kwoty liczone w groszach/centach jako liczby całkowite, formatowane jednym helperem fmtMoney (PLN 12 345,67 zł / USD $1,234,567.89), tabular-nums + nowrap
impact: HIGH
tags: [demo, money, numbers, formatting, i18n]
source: ui-kit-habits C1 (N1) · synthesis §5.4.11 determ-money · PaymentCalculator.tsx:21-37 (allocateGrosze) · G703Billing.tsx:7 („centy, int") · CLAUDE.md (kalkulator transz „Σ co do grosza")
added: 2026-09-12
---

## Zasada

1. **Jednostka liczenia**: grosze (PLN) i centy (USD) jako `number` całkowite (`Number.isInteger`). Konwersja z wejścia użytkownika („1 234,56") do groszy następuje RAZ przy parsowaniu (`toGrosze(text): number`), a do wyświetlenia RAZ przy formatowaniu. Żadnych `0.1 + 0.2` po drodze: mnożenie procentów przez kwotę kończy się `Math.round` (albo `roundHalfUp = Math.floor(v + 0.5)` jak w G703, spójnie w całym silniku), reszta zaokrągleń na ostatniej pozycji (`allocateGrosze`).
2. **Jeden helper**: `src/lib/money.ts` eksportuje `fmtMoney(minor: number, currency: "PLN" | "USD" | "EUR", lang: Lang): string` i `toMinor(text: string): number | null`. `Lang` wchodzi jako `import type` (`demo-golden-tests` p.5: w `src/lib/**` zero WARTOŚCIOWYCH importów przez alias `@/`; `money.ts` nie importuje `pick` ani `MESSAGING` — dostaje `lang` argumentem). Format:
   - PL: `12 345,67 zł` (spacja niełamliwa U+00A0 między tysiącami, przecinek dziesiętny, symbol po kwocie), USD w PL: `1 234 567,89 USD`,
   - EN: `PLN 12,345.67`, `$1,234,567.89`, `€1,234.56`,
   - minus typograficzny `−` (U+2212), nigdy `-`; ujemne w nawiasach tylko w tabelach księgowych na jawne żądanie (nie w demie),
   - zero końcowych „,00" NIE jest ucinane w tabelach (wyrównanie kolumny); w KPI dopuszczalne `k`/`tys.` przez osobny `fmtMoneyCompact`.
   Lokalne helpery w komponentach (`fmtZl`, `usd`, `fmtPln`, `money` w `ContractRegister.tsx:33`, `ErpImports.tsx:54`, `CostControl.tsx:31`, `PaymentCalculator.tsx:44`, `G703Billing.tsx:44`) zastępuje import z `lib/money.ts` (faza 0/1).
3. **Typografia**: każda liczba w tabeli/KPI/wykresie ma `font-variant-numeric: tabular-nums` (klasa kitu `.tnum` albo utility `tabular-nums`) i `white-space: nowrap` (`.nowrap`); kwoty/daty nigdy nie łamią się w środku; duże KPI skalują się `clamp()` zamiast zawijać.
4. **Wejście**: `<input inputMode="decimal">` z parserem tolerującym spację/przecinek/kropkę; niepoprawne wejście → `null` + komunikat kitu, nie `NaN` w wyniku.
5. **Waluty i kursy**: `FX` fikcyjne, deterministyczne (`demo-determinism`); przeliczenie `Math.round(minor * rate)` w minor jednostkach; suma po przeliczeniu liczona z pozycji, nie z sumy (jawna „ścieżka wyliczenia" w UI).
6. **PDF**: te same helpery (`fmtMoney`) w `lib/pdf.ts`; kolumny kwot wyrównane do prawej; polskie znaki (Roboto z pdfmake ma `ł`, `ż`).

## Mechanizm awarii (dlaczego)

- `0.1 + 0.2 = 0.30000000000000004`: na 30 pozycjach transzy różnica groszowa w sumie = złamana obietnica „co do grosza" z paska S5 (`allowedNumbers`: „kontrola sum w każdym imporcie co do grosza"). Kit (`SKILL.md:84-86, 402-403`): „grosze/centy jako jednostka liczenia".
- Pięć różnych helperów formatowania = pięć różnych formatów (`12 345,67 zł` vs `PLN 12 345.67` vs `12345.67 zł`) w jednym serwisie; klient widzi niespójność i wątpi w „porządek w danych".
- Bez `tabular-nums` cyfry proporcjonalne mają różne szerokości: kolumny „tańczą" przy zmianie wejścia, a `Counter` przesuwa sąsiadów (CLS).
- Zwykły minus `-` w PL łamie się na końcu linii i wygląda jak myślnik; `−` (U+2212) ma szerokość cyfry w `tabular-nums`.
- `toLocaleString` bez jawnego `lang` bierze locale przeglądarki: Karol (pl-PL) i CI (en-US) formatują inaczej → golden-testy i zrzuty niestabilne.

## Niepoprawnie

```ts
const net = 148500.5 * 0.23;                                   // float w logice
const fmtZl = (gr) => `${(gr / 100).toLocaleString()} zł`;    // locale z przeglądarki, helper lokalny
<td>{total.toFixed(2)} zł</td>                                 // toFixed = float + kropka w PL, brak tnum
<span>-1 234,00 zł</span>                                      // zwykły minus, może się złamać
```

## Poprawnie

```ts
// src/lib/money.ts
import type { Lang } from "@/i18n";
export type Currency = "PLN" | "USD" | "EUR";
const NBSP = " ", MINUS = "−";
export function toMinor(text: string): number | null {
  const norm = text.replace(/[\s ]/g, "").replace(",", ".");
  if (!/^-?\d+(\.\d{1,2})?$/.test(norm)) return null;
  const [int, frac = ""] = norm.replace("-", "").split(".");
  const minor = Number(int) * 100 + Number((frac + "00").slice(0, 2));
  return norm.startsWith("-") ? -minor : minor;
}
export function fmtMoney(minor: number, currency: Currency, lang: Lang): string {
  if (!Number.isInteger(minor)) throw new Error("fmtMoney: minor units must be an integer");
  const neg = minor < 0, abs = Math.abs(minor);
  const body = (abs / 100).toLocaleString(lang === "pl" ? "pl-PL" : "en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/\s/g, NBSP);
  const sign = neg ? MINUS : "";
  if (lang === "pl") return `${sign}${body}${NBSP}${currency === "PLN" ? "zł" : currency}`;
  const symbol = currency === "USD" ? "$" : currency === "EUR" ? "€" : "PLN ";
  return `${sign}${symbol}${body}`;
}
```

```tsx
<td className="tnum nowrap" style={{ textAlign: "right" }}>{fmtMoney(row.netGr, "PLN", lang)}</td>
<input className="input tnum" inputMode="decimal" value={raw} onChange={(e) => { setRaw(e.target.value); setMinor(toMinor(e.target.value)); }} aria-invalid={minor === null} />
```

## Test

```bash
# jeden helper; lokalne kopie usunięte (oczekiwane: 0)
grep -rnE 'const (fmtZl|fmtPln|usd|money|fmtMoney|fmtUsd) = ' site/src/components site/src/lib/report.ts   # = 0 poza lib/money.ts
grep -rnE 'toLocaleString\(\)' site/src                            # = 0 (bez locale)
grep -rnE '\.toFixed\(2\)' site/src/lib site/src/components/dashboards   # = 0
# float w silnikach: mnożenie kwot bez round (ocena LLM + test niezmienników Σ w demo-golden-tests)
grep -rnE '\* (VAT|rate|m|mPct / 100)\b' site/src/lib | grep -vE 'Math\.round|roundHalfUp'   # = 0
# tnum/nowrap w tabelach z kwotami (oczekiwane: każdy <td z fmtMoney ma tnum lub tabular-nums)
grep -rnE '<td[^>]*>\{fmtMoney' site/src | grep -vE 'tnum|tabular-nums'   # = 0
# minus typograficzny: szukamy ZNAKU U+2212, nie sekwencji „\u2212" (w kodzie jest literał „−")
grep -rnE '"-\$\{|`-\$\{' site/src/lib/money.ts     # = 0 (zwykły minus w szablonie)
rg -c '\x{2212}' site/src/lib/money.ts                  # ≥ 1 (U+2212 MINUS SIGN)
rg -c '\x{00A0}' site/src/lib/money.ts                  # ≥ 1 (U+00A0 NBSP)
# (GNU grep bez -P nie zna \x{...}: alternatywa `grep -c $'\u2212' site/src/lib/money.ts` w bashu ≥ 4.2)
# test jednostkowy helpera (npm run test): toMinor("1 234,56")=123456; fmtMoney(123456,"PLN","pl")="1 234,56 zł" (NBSP); fmtMoney(-5,"USD","en")="−$0.05"
# import typu, nie wartości (demo-golden-tests p.5; oczekiwane: 0 wierszy)
grep -nE 'from "@/' site/src/lib/money.ts | grep -vE ':import type ' 
```

## Wyjątki

- Procenty i wskaźniki (`costPct`, `deviation` w p.p., marża %) są liczbami zmiennoprzecinkowymi z jawnym `maximumFractionDigits: 1`; nie są kwotami.
- `fmtMoneyCompact` (`1,2 mln zł`, `$4.2M`) tylko w KPI i wykresach, nigdy w tabelach ani PDF.
