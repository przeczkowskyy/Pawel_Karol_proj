---
id: design-pdf-document-pattern
title: Dokument PDF: pdfmake lazy, deterministyczny, 1 strona A4, nagłówek KLAROW, stopka DEMO, Roboto z parametrem font
impact: MEDIUM
tags: [design, pdf, documents, determinism, pdfmake]
source: CLAUDE.md „Dokumenty PDF" / ui-kit-habits.md H1 (D1) / peer-legal.md §1.2 (refaktor pdfDoc.mjs, decyzja B: Roboto) / uzgodnienie okien 2026-09-12
added: 2026-09-12
---

## Zasada

Wyjście „do klienta" z narzędzia = **PDF pobierany** w przeglądarce (nigdy okno druku):
`lib/pdf.ts` → lazy `import("pdfmake/build/pdfmake")` przy pierwszym kliknięciu → `buildDocDefinition(doc)`
z `lib/pdfDoc.mjs` (czysty ESM, działa też w Node) → `.download(filename)`. Dokument: jedna strona A4,
nagłówek z tekstowym wordmarkiem `KLAROW` (bez logo), linie meta, tabela (`tabular` liczby wyrównane
do prawej, kwoty w formacie PL `12 345,67`), opcjonalne bloki `h · p · ul · kv · quote · table · spacer`,
opcjonalne podpisy, stopka domyślna `"klarow.com · dokument DEMO — dane fikcyjne"` (co do znaku, z API
`footer?: { left?, showPageNumbers? }`). **Deterministyczny**: te same dane → identyczny plik (zero daty
generowania, zero `Date.now`, zero losowych ID w treści DEMO). Font: **Roboto** z wbudowanego vfs
(decyzja B) przez parametr `PdfDoc.font` z domyślną `"Roboto"`; `defaultStyle.font` zawsze jawne.
Akcent w bloku `quote` = stal `#A8B4C2` (stała modułu z `token-exempt`), zero złota. Przycisk:
`.btn-secondary` + ikona `Download` + stan `busy` (`aria-busy`, tekst „Generuję…" w `aria-live="polite"`).
W fazie 1 okno UI **nie dotyka** wnętrza `pdf.ts`, `PdfButton.tsx` ani `dashboards/*.tsx`
(refaktor robi okno c1); UI woła istniejące API.

## Mechanizm awarii (dlaczego)

Okno druku daje inny wynik w każdej przeglądarce i psuje polskie znaki; pdfmake z osadzonym fontem
daje identyczny plik wszędzie. Data generowania w PDF DEMO łamie obietnicę „dwa przebiegi = ten sam
wynik" (CLAUDE.md #6) i uniemożliwia golden-test binarny. Dwie równoległe zmiany w `pdf.ts` (UI i c1)
zderzają się w tym samym pliku; stąd zamrożenie. Osadzenie Nunito w vfs to +~90 KB w lazy-chunku
i wymaga statycznych TTF 400/700/italic (pdfmake nie czyta WOFF2 ani fontów variable); brak
zarejestrowanego stylu `bold`/`italics` = wyjątek w generowaniu.

## Niepoprawnie

```ts
window.print();                                           // okno druku
const dd = { content: [{ text: `Wygenerowano ${new Date().toLocaleString()}` }], defaultStyle: {} };
pdfMake.fonts = { Nunito: { normal: "NunitoSans.woff2", bold: "NunitoSans.woff2" } };   // WOFF2/variable nie działa
```

## Poprawnie

```ts
// lib/pdf.ts (kurczy się do lazy importu + builder)
export async function downloadPdf(doc: PdfDoc): Promise<void> {
  const [{ default: pdfMake }, { default: pdfFonts }] = await Promise.all([import("pdfmake/build/pdfmake"), import("pdfmake/build/vfs_fonts")]);
  pdfMake.vfs = pdfFonts.pdfMake?.vfs ?? pdfFonts.vfs ?? pdfMake.vfs;
  pdfMake.createPdf(buildDocDefinition({ font: "Roboto", ...doc })).download(doc.filename);
}
// lib/pdfDoc.mjs: buildDocDefinition(doc) → { pageSize: "A4", defaultStyle: { font: doc.font ?? "Roboto", fontSize: 8.5 },
//   header: wordmark KLAROW + meta, content: bloki, footer: doc.footer?.left ?? "klarow.com · dokument DEMO — dane fikcyjne" }
```

```tsx
<PdfButton doc={buildProtocolDoc(state)} />   {/* btn-secondary + Download + aria-busy */}
```

## Test

```bash
# brak okna druku i daty w generatorze: 0 trafień
grep -rnE "window\.print|new Date\(|Date\.now|Math\.random|toLocale(Date|Time)?String" site/src/lib/pdf.ts site/src/lib/pdfDoc.mjs
# builder czysty (zero importów) i font jawny
grep -c "^import" site/src/lib/pdfDoc.mjs; grep -nE "font:\s*(doc\.font|\"Roboto\")" site/src/lib/pdfDoc.mjs
# golden: dwa przebiegi buildera dają identyczny JSON definicji
node --test site/tests/pdfDoc.test.mjs
```

Ręcznie po każdej zmianie w `pdf.ts`: kliknąć PDF na `/narzedzia/obieg-przelewow`, porównać layout,
stopkę i znaki `zażółć gęślą jaźń ĄĆĘŁŃÓŚŹŻ` z wersją sprzed zmiany.

## Wyjątki

`@media print` może istnieć wyłącznie jako fallback dla `/rodo` (ukryj nav/tło/wideo, biały papier),
nie dla dokumentów narzędzi. Osadzenie kroju UI w PDF (opcja A) dopiero po decyzji founderów
o foncie v2; wtedy okno UI dostarcza trzy statyczne TTF (Regular 400, Bold 700, Italic 400).
Domyślna stopka zawiera dziś pauzę „—" (tekst zachowany co do znaku przez refaktor c1); em-dash
sweep D-09 zmienia ją na `"klarow.com · dokument DEMO: dane fikcyjne"` w PR okna c1 (właściciel
`pdfDoc.mjs`), razem z aktualizacją tej reguły i golden-testu stopki.
