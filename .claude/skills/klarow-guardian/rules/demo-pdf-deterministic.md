---
id: demo-pdf-deterministic
title: PDF z dem jest deterministyczny (te same dane → identyczna definicja i bajty), 1 strona A4, stopka DEMO, polskie znaki, pobieranie zamiast okna druku, lazy pdfmake
impact: HIGH
tags: [demo, pdf, determinism, documents]
source: CLAUDE.md „Dokumenty PDF" (pdfmake lazy, A4 jednostronicowy, stopka DEMO) · synthesis §5.4.11 determ-pdf · ui-kit-habits H (dokumenty) · rozstrzygnięcie (2): Roboto zostaje, parametr font w API pdfDoc; refaktor pdf.ts robi inne okno (ta reguła nie zmienia pdf.ts w fazie 1) · demo-golden-tests p.5 (zero wartościowych importów przez alias @/ w src/lib/**)
added: 2026-09-12
---

## Zasada

`site/src/lib/pdf.ts` + `dashboards/PdfButton.tsx` (5 dokumentów: protokół robocizny, plan płatności, raport importu, podsumowanie tygodnia PM, rejestr umów):

1. **Determinizm definicji**: `pdfDoc(input, { lang, font, labels })` jest czystą funkcją → `TDocumentDefinitions`; zero `new Date()` (data dokumentu = stała z danych dema, np. `TODAY`), zero `Math.random`; `info: { title, subject: opts.labels.subject, creator: "Klarow", producer: "Klarow", creationDate: new Date("2026-07-22T00:00:00Z"), modDate: new Date("2026-07-22T00:00:00Z") }` (stałe daty w metadanych, inaczej bajty PDF różnią się przy każdym pobraniu).
   **Teksty wchodzą ARGUMENTEM, nie importem**: `pdf.ts` leży w `src/lib/**`, więc obowiązuje `demo-golden-tests` p.5 — zero wartościowych importów przez alias `@/` (`pick`, `MESSAGING`). Gotowe stringi (`labels.subject`, `labels.footer`) składa wołający (`PdfButton.tsx`), który ma prawo importować `@/i18n` i `@/data/messaging`. Bez tego `npm run test` (Node + `--experimental-strip-types`) nie wczyta `pdf.ts`: alias `@/` nie jest rozwiązywany, a `@/i18n` to plik JSX.
2. **Determinizm bajtów**: golden-test porównuje `JSON.stringify(pdfDoc(sample))` (zawsze) i, w fazie 3, `sha256` bufora z `pdfMake.createPdf(def).getBuffer()` uruchomionego w Node z tym samym vfs (jeśli pdfmake w Node jest stabilny; jeśli nie, tylko definicja).
3. **Format**: A4 pionowo, 1 strona (tabela ograniczona do N wierszy z linią „… i M kolejnych pozycji" zamiast łamania strony), nagłówek `KLAROW` tekstowy (wordmark, bez logo graficznego), meta (nazwa dokumentu, data z danych, wersja DEMO), tabela z kwotami wyrównanymi do prawej (`fmtMoney`), stopka „DEMO: dane fikcyjne · te same dane zawsze dają ten sam dokument", opcjonalne pola podpisów.
4. **Font**: Roboto wbudowane w pdfmake (decyzja B); parametr `font` w API istnieje (`"Roboto"` domyślnie), osadzenie kroju UI dopiero po decyzji founderów o foncie v2 (wymaga TRZECH statycznych TTF: Regular 400, Bold 700, Italic 400 — kursywa jest używana w bloku cytatu). Polskie znaki: Roboto z `vfs_fonts` je ma; test na `„ąćęłńóśźż ĄĆĘŁŃÓŚŹŻ”`.
5. **Ładowanie**: `pdfmake` + `vfs_fonts` (~830 KB gz) WYŁĄCZNIE po kliknięciu „Pobierz PDF" (`import()` w handlerze), nigdy w `modulepreload`, nigdy w chunku podstrony; przycisk pokazuje stan ładowania kitu (`aria-busy`), błąd → komunikat kitu, nie `alert()`.
6. **Pobieranie, nie druk**: `createPdf(def).download(fileName)` z nazwą deterministyczną `klarow-<dokument>-demo.pdf` (bez daty w nazwie), zero `window.print()`, zero `.print-only`/`.print-area` w CSS (usunięte w cz. 6).
7. **Zdarzenie** `pdf_download` emitowane w `PdfButton` (poza `pdf.ts`), z nazwą dokumentu, bez treści.
8. **Marka**: zero nazwy firmy źródłowej, zero złota, zero logo graficznego w PDF; akcent stal w liniach tabeli (`#A8B4C2`), tekst `#121212` na białym (dokument drukowalny: jasne tło jest tu poprawne, Page Theme Lock dotyczy UI).

## Mechanizm awarii (dlaczego)

- pdfmake wstawia `CreationDate` z zegara: dwa pobrania tych samych danych dają różne pliki; klient porównujący PDF-y (np. w mailu) widzi „coś się zmieniło", a obietnica „te same dane, ten sam wynik" ma obejmować także dokument.
- Wielostronicowy PDF z dema łamie tabelę i podpisy w losowym miejscu; 1 strona A4 = przewidywalny wydruk, o który prosi persona (protokół, plan płatności).
- Okno druku (`window.print`) było w cz. 5 i zostało zastąpione pobieraniem w cz. 6: na iOS Safari druk strony SPA jest zawodny; PDF pobrany działa wszędzie.
- 830 KB gz w ścieżce krytycznej = 5× cała reszta strony (site-audit §3.1 p.8); lazy przy kliknięciu jest jedynym akceptowalnym miejscem.

## Niepoprawnie

```ts
const def = { info: { title: "Protokół" }, content: [ { text: `Data: ${new Date().toLocaleDateString()}` }, … ] };   // zegar w treści i metadanych
import pdfMake from "pdfmake/build/pdfmake";           // statyczny import (830 KB w chunku podstrony)
window.print();                                        // okno druku
```

## Poprawnie

```ts
// src/lib/pdf.ts (kontrakt; szczegóły implementacji w oknie refaktoru)
import type { Lang } from "@/i18n";            // TYLKO typ (wycinany przez --experimental-strip-types)
import { fmtMoney } from "./money.ts";         // cross-import w lib: względny, z jawnym rozszerzeniem

export interface PdfLabels { subject: string; footer: string }         // gotowe stringi PL/EN od wołającego
export interface PdfOptions { lang: Lang; font?: "Roboto"; labels: PdfLabels }
const DOC_DATE = new Date("2026-07-22T00:00:00Z");     // stała: determinizm metadanych

export function pdfDoc(input: PdfInput, opts: PdfOptions): TDocumentDefinitions {
  return {
    pageSize: "A4", pageMargins: [40, 48, 40, 56],
    info: { title: input.title, subject: opts.labels.subject, creator: "Klarow", producer: "Klarow", creationDate: DOC_DATE, modDate: DOC_DATE },
    defaultStyle: { font: opts.font ?? "Roboto", fontSize: 9.5 },
    header: { text: "KLAROW", margin: [40, 20, 40, 0], bold: true, fontSize: 12 },
    content: [ …meta z danych (input.date = TODAY)…, { table: { headerRows: 1, body: rows(input, opts.lang) }, layout: KLAROW_TABLE_LAYOUT } ],
    footer: { text: opts.labels.footer, alignment: "center", fontSize: 8, margin: [40, 16, 40, 0] },
  };
}

// dashboards/PdfButton.tsx — warstwa prezentacji składa teksty (tu `pick` i MESSAGING są na miejscu)
onClick={async () => {
  setBusy(true);
  try {
    const [{ default: pdfMake }, { default: vfs }] = await Promise.all([import("pdfmake/build/pdfmake"), import("pdfmake/build/vfs_fonts")]);
    pdfMake.vfs = vfs.pdfMake?.vfs ?? vfs;
    const labels = { subject: pick(lang, MESSAGING.proofFooter), footer: pick(lang, MESSAGING.pdfFooter) };
    pdfMake.createPdf(pdfDoc(input, { lang, labels })).download(`klarow-${docKey}-demo.pdf`);
    track("pdf_download", { doc: docKey });
  } catch { setError(pick(lang, T.pdfError)); } finally { setBusy(false); }
}}
```

## Test

```bash
# zegar/losowość w pdf.ts (oczekiwane: 0 poza stałą DOC_DATE)
grep -nE 'new Date\(\)|Date\.now\(|Math\.random' site/src/lib/pdf.ts                # = 0
grep -nE 'creationDate|modDate' site/src/lib/pdf.ts | wc -l                          # ≥ 2 (stałe)
# lazy: pdfmake tylko w import() w PdfButton
grep -rnE '^import .*pdfmake' site/src                                               # = 0
grep -nE 'import\("pdfmake' site/src/components/dashboards/PdfButton.tsx | wc -l     # ≥ 1
grep -nE 'modulepreload[^>]*(pdfmake|vfs_fonts)' site/dist/index.html site/dist/narzedzia/*.html   # = 0
# druk
grep -rnE 'window\.print|\.print-only|\.print-area|@media print' site/src            # = 0
# teksty argumentem, nie importem (demo-golden-tests p.5; oczekiwane: 0 wierszy)
grep -nE 'from "@/' site/src/lib/pdf.ts | grep -vE ':import type '
grep -nE '\bpick\(|MESSAGING' site/src/lib/pdf.ts                                    # = 0
# golden definicji (demo-golden-tests): npm run test (tests/pdf.test.mjs) → identyczny JSON dla 2 przebiegów i zgodny z golden
# ręcznie: pobrać każdy z 5 PDF-ów 2× → `sha256sum` identyczne; 1 strona; „ąćęłńóśźż” poprawne; stopka DEMO; brak nazwy firmy źródłowej (pdftotext | grep -i)
```

## Wyjątki

- Faza 1: `pdf.ts` refaktoruje inne okno (rozstrzygnięcie nadrzędne 4: `pdf.ts` → `pdfDoc.mjs`); do tego czasu istniejące 5 dokumentów przechodzą tylko testy „zero zegara w treści" i „lazy". Stałe daty w `info`, `labels` w `PdfOptions` i usunięcie `pick`/`MESSAGING` z `pdf.ts` wchodzą razem z tym refaktorem — kontrakt powyżej jest dla niego wiążący.
- Jeśli pdfmake w Node okaże się niestabilny (vfs, fonty), golden bajtów jest pomijany; golden definicji zostaje obowiązkowy.
