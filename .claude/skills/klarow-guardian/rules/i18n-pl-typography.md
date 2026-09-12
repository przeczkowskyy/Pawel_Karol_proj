---
id: i18n-pl-typography
title: Typografia PL/EN: cudzysłowy „ " (PL) i “ ” (EN), zero em-dash „—" w UI/meta/PDF, półpauza tylko w prozie PL ≤ 1 na akapit, EN bez myślników jako interpunkcji, „…" nie „...", twarde spacje
impact: HIGH
tags: [i18n, typography, em-dash, quotes, nbsp, pdf, copy]
source: taste.md §4.8 (EM-DASH BAN; 513 „—" + 44 „–" w site/src), §11.3 / synthesis D-09, §2.8 p.7 (em-dash sweep 621 „—"), brand-em-dash, brand-typography-pl / writing-command.md „Punctuation & typography" / WIG Typography / zadanie strażnika (półpauza w prozie ≤ 1/akapit) / peer-legal.md (PDF na Roboto, decyzja B)
added: 2026-09-12
---

## Zasada

1. Em-dash `—` (U+2014): ZAKAZ CAŁKOWITY w UI, danych (`tools.ts`, `toolsSeo.ts`, `faq.ts`, `pagesSeo.ts`, `home.ts`, `messaging.ts`, `rodo.ts`), meta, JSON-LD, `llms.txt`, `alt`, treści PDF (`pdfDoc` na Roboto; parametr `font` w API `PdfDoc.font`, domyślnie `"Roboto"`; krój UI w PDF dopiero po decyzji founderów o foncie v2, z trzema statycznymi TTF 400/700/italic). Zdanie przebudowujemy: kropka, dwukropek, przecinek, nawias.
2. En-dash `–` (U+2013) w PL: dozwolony (a) w zakresach liczbowych bez spacji („20–250 osób", „5–10 dni", „2018–2026"); (b) jako półpauza ze spacjami WYŁĄCZNIE w prozie (akapit ≥ 60 znaków), maksymalnie 1 na akapit; nigdy w nagłówkach, leadach hero, chipach, przyciskach, etykietach, meta title/description, `alt`, FAQ-pytaniach, stringach < 60 znaków. Dywiz ze spacjami „ - " jako pauza jest w PL błędem typograficznym (zakaz).
3. EN: zero `—` i zero ` – ` jako interpunkcji (Vercel writing); en-dash tylko w zakresach liczbowych („20–250-person").
4. Cudzysłowy: PL „ " (U+201E, U+201D), EN “ ” (U+201C, U+201D); zero prostych `"` w treści widocznej (w kodzie JSX używamy encji lub literału Unicode). Apostrof EN ’ (U+2019).
5. Wielokropek `…` (U+2026), nigdy `...`; stany ładowania kończą się `…` („Generuję PDF…").
6. Twarde spacje (` `): po jednoliterowych spójnikach i przyimkach w PL (a, i, o, u, w, z), między liczbą a jednostką („10 MB", „30 minut", „786 296 426"), w nazwach marek („KLAROW"), przed „zł"/„%”.
7. Nazwy własne/kody z `translate="no"`: `KLAROW`, `KSeF`, `G703`, `G702`, `ERP`, kody statusów.

## Mechanizm awarii (dlaczego)

Em-dash jest najsilniejszym „AI tell" w tekście generowanym (taste §9.G: „#1 visual Tell in production tests"); w `site/src` było 513–621 wystąpień, czyli strona wygląda jak wygenerowana. Półpauza w nagłówku łamie się na końcu linii i daje osierocone znaki; w meta zjada limit 60/165 znaków. Proste `"` w treści renderują się różnie w SERP i w PDF (Roboto ma poprawne glify „ ", ale `"` wygląda jak cal). Brak twardej spacji zostawia „i" na końcu wiersza (błąd składu PL). `...` zamiast `…` to trzy znaki o innej szerokości i łamaniu. `translate="no"` zapobiega przetłumaczeniu `KSeF` na „KSeF (National e-Invoice System)" przez Chrome.

## Niepoprawnie

```ts
title: { pl: "Klarow — automatyzacja danych i kontroling. Wdrożenie w dni." }       // em-dash w meta
hook: { pl: "Raport zarządu – w sekundy" }                                            // półpauza w krótkim stringu
a: 'Sprint kosztuje mniej niż dwa "etaty" - zwraca się przed końcem kwartału...'      // proste cudzysłowy, dywiz jako pauza, ...
```

## Poprawnie

```ts
title: { pl: "Klarow: narzędzia pod Twój proces. Działają w dni." }
hook: { pl: "Raport zarządu w sekundy" }
a: "Sprint kosztuje mniej niż dwa miesięczne koszty etatu kontrolera – zwraca się przed końcem kwartału. Wynik jest deterministyczny: te same dane dają ten sam raport…"   // 1 półpauza w akapicie prozy, „…"
label: { pl: "Generuję PDF…", en: "Generating PDF…" }
<span translate="no">KSeF</span>; „20–250 osób"; "10 MB"; "w dni"
```

## Test

```bash
# em-dash: 0 w źródłach danych, komponentach, dist, PDF-definicjach
grep -rnc "—" site/src site/dist 2>/dev/null | grep -v ":0$"                                   # pusto
# en-dash poza zakresami liczbowymi w krótkich stringach (< 60 zn.) i w nagłówkach/meta
# DOCELOWO (skrypt planowany, jeszcze nie istnieje — dziś: NIE SPRAWDZANO): node .claude/skills/klarow-guardian/scripts/check-copy.mjs --dashes       # fail: „—" wszędzie, „–" w stringach < 60 zn. lub > 1/akapit lub w EN poza zakresem
grep -rnE "[a-ząćęłńóśźż] - [a-ząćęłńóśźż]" site/src/data                                        # 0 (dywiz ze spacjami jako pauza)
grep -rnE "\.\.\." site/src/data site/src/components --include=*.ts --include=*.tsx | grep -vE "\.\.\.[a-zA-Z_{\[]"   # 0 (spread wykluczony)
grep -rnE ":\s*\"[^\"]*[^\\]\"[^\"]*\"" site/src/data/*.ts | grep -E "[a-ząćę]\"[a-ząćę]"        # proste cudzysłowy w treści: 0
grep -rnE "translate=\"no\"" site/src --include=*.tsx | wc -l                                    # ≥ 3 (KLAROW, KSeF, G703)
```

Severity: HIGH (em-dash, półpauza poza prozą, proste cudzysłowy w meta). Auto-fix dozwolony (fixer `copy-auditor`): `...` → `…`, `"x"` → „x", twarde spacje, `–` w zakresach; NIE dla przebudowy zdań z `—` (to zmiana treści, krok osobny: em-dash sweep 1 dzień).

## Wyjątki

Kod, ścieżki, identyfikatory, wartości liczbowe ujemne (`-5 %`), minus w tabelach dem.

**Dokumenty wewnętrzne, które nigdy nie opuszczają Klarow** (np. `brief-<firma>.pdf` z generatora leadów, stopka „dokument wewnętrzny, nie przekazywać poza firmę"; notatki, plany w `.claude/work/`, raporty audytu): reguła ich nie obejmuje, bo nie są powierzchnią marki. Cytat z ogłoszenia czy z maila zostaje tam DOSŁOWNY, razem z oryginalną interpunkcją. Granicę wyznacza odbiorca, nie format: to samo `pdfDoc` generuje `klarow-<firma>.pdf` do koperty i ten dokument regule podlega w całości.

**Cytaty na powierzchniach publicznych** (case study, strona, one-pager handlowy, post): pauzę zamieniamy na dwukropek albo kropkę, brzmienie słów zostaje bez zmian, a cytat oznaczamy jako skrócony. Wierność interpunkcji nie jest tu argumentem, bo to nasz dokument handlowy, nie protokół.
