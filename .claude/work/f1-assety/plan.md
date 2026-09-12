# F1 + pierwszy blok F2: bramki, build i zrzuty nowego hero

> Data: 2026-09-12 · Tryb strażnika: `marketing` · Źródła decyzji: `docs/plan/warstwa-wrazenia.md`,
> `docs/plan/strona-v2-plan.md` §3 S1, §6, §7
> Rola tego okna: NIE produkcja assetów (zrobiły ją okna F1 i F2), tylko **bramka wyjściowa**:
> build, audyty, budżety i materiał do pokazania founderowi.

## Cel

Zamknąć fazę mechanicznie (tsc, lint, testy, build, `verify-site`, `audit-static`), zmierzyć
budżety transferu na zbudowanej stronie i zrobić pięć zrzutów nowego hero, na których widać,
co Karol dostaje: kadr produktu, kadr w ruchu, telefon bez wideo, ograniczony ruch i całą
stronę główną w kontekście.

## Zakres zamrożony

`site/src/lib/pdf.ts` (okno c1), linia importu i wywołania `downloadPdf` w `PdfButton.tsx`,
wszystkie `.env`, `.claude/settings.json`, `CLAUDE.md`. Zero kredytów: ani jednego wywołania
narzędzia generatywnego. Edycja plików tylko po to, żeby naprawić to, co pękło.

## Kroki

- [x] 1. `tsc --noEmit` — 0 błędów.
- [x] 2. `npm run lint` — 0 ostrzeżeń, `npm test` — 15/15 (378 ms).
- [x] 3. `npm run build` — 19 plików HTML, 17 `<loc>` w sitemapie; `dist/index.html` z H1, leadem,
      dwoma CTA i `<img class="hero-shot">`, bez `<video>` (0 wystąpień).
- [x] 4. `verify-site.mjs` — po naprawie skryptu 0 BLOCKER, 0 HIGH, 1 LOW (brak `lastmod`).
- [x] 5. `audit-static.mjs --baseline` — 58 plików, 0 BLOCKER / 0 HIGH / 0 MEDIUM / 0 LOW,
      215 wpisów długu pominiętych z bazy odniesienia.
- [x] 6. Budżety zmierzone na `dist` serwowanym z gzipem (Chromium 149, `request.sizes()`).
- [x] 7. Pięć zrzutów hero + `report.json` i `transfer.json` w scratchpadzie (`hero/`).

## Wynik

### Bramki

| Bramka | Wynik |
|---|---|
| `node node_modules/typescript/bin/tsc --noEmit` | 0 błędów |
| `npm run lint` | 0 problemów |
| `npm test` | 15 pass / 0 fail, 378,8 ms |
| `npm run build` | 19 HTML (13 podstron narzędzi), 17 w sitemapie, `/rodo` i `404` z `noindex` |
| `verify-site.mjs` | Σ BLOCKER 0 · HIGH 0 · MEDIUM 0 · LOW 1 |
| `audit-static.mjs --baseline` | Σ 0 · 0 · 0 · 0 na 58 plikach |

### Budżety (zmierzone, nie szacowane)

| Pozycja | Zmierzone | Budżet | Zapas |
|---|---|---|---|
| chunk wejściowy `index-Cip7lYi7.js` | 135 589 B = **132,4 KB gz** | 140 KB | 7,6 KB |
| CSS startowy | 16 409 B = 16,0 KB gz | 20 KB | 4,0 KB |
| kadr hero 1600x1000 | 64 546 B | 110 KB | 47 KB |
| kadr hero 800x500 | 25 100 B | 55 KB | 30 KB |
| nagranie hero WebM | 340 581 B | 1,2 MB | 918 KB |
| nagranie hero MP4 | 350 567 B | 1,4 MB | 1,1 MB |
| transfer `/` desktop do `load` | **184 042 B**, w tym 0 B wideo | 700 KB | 526 KB |
| transfer `/` desktop pełna wizyta | **836 281 B** (wideo 340 832 B) | 2,5 MB | 1,66 MB |
| transfer `/` mobile | **286 305 B**, wideo **0 B** | 350 KB, 0 B wideo | 64 KB |

### Zrzuty (scratchpad `.../scratchpad/hero/`)

| Plik | Co widać |
|---|---|
| `hero-desktop.png` 1440x900 | kadr pulpitu produkcji (63%, 0/6 hal w ryzyku, 15 531 h, suwak T35), H1 w 3 liniach, dwa CTA |
| `hero-desktop-video.png` 1440x900 | ta sama rama w ruchu, `currentTime` 2,002 s: 73%, 17 340 h, trzy kafle na statusie „Obserwuj” |
| `hero-mobile.png` 390x844 | jedna kolumna, kadr pod CTA, `video` w ogóle nie ma w DOM, brak przycisku pauzy |
| `hero-reduced.png` 1440x900 | `reduce`: sam kadr, zero `video`, zero przycisku pauzy, tło WebGL na jednej klatce |
| `home-desktop-full.png` 1440x3414 | cała strona główna: hero, „Co możemy zbudować”, „Co już zrobiliśmy”, ból, dwa wyróżniki, wzorce wdrożeń, „Zobacz konkrety”, stopka |

### Porażki

- **F1-1 · `verify-site.mjs` podniósł fałszywy BLOCKER na `/rodo`** (2026-09-12). FAIL:
  `statycznych HTML indeksowanych: 18, oczekiwano 17`, `noindex: brak`, choć `dist/rodo.html`
  ma `<meta name="robots" content="noindex, follow" />`. Przyczyna: `isNoindex()` czytał
  **pierwsze 8192 bajty** pliku, a prerender dokleja blok SEO na KOŃCU nagłówka, za skryptem
  wejściowym i sondą `?debug=1`. Preload kadru hero (ok. 730 B, dołożony w tej fazie) zepchnął
  `<meta robots>` na znak 8519. PASS: skrypt czyta cały `<head>` (cięcie na `</head>`), nie
  sztywny wycinek. Nauczka: bramka, która czyta „pierwsze N bajtów”, mierzy pozycję w pliku,
  a nie własność strony, i pęknie przy pierwszej zmianie kolejności w nagłówku.

## Otwarte

1. **H1 ma 3 linie na 1440 px**, a `design-hero-discipline` wymaga ≤ 2 na desktopie (≤ 3 na
   390 px, tam limit jest dotrzymany). Zdanie marki ma 60 znaków, więc przy `max-width: 24ch`
   z reguły limit 2 linii jest nieosiągalny bez skrócenia zdania albo poszerzenia kolumny
   tekstu do 7 kolumn. Decyzja foundera / właściciela tokenów, nie mechaniczna poprawka.
2. **Kadr hero pobiera się dwa razy na desktopie**: `<img srcset>` bierze wariant 800w
   (25 299 B), a atrybut `poster` na `<video>` wskazuje na sztywno wariant 1600w (64 745 B),
   którego nikt nie zobaczy, bo pod spodem leży ten sam obraz. Zdjęcie `poster` z `<video>`
   albo związanie go ze `srcset` oszczędza ok. 64 KB na wizytę. Dotyka `media-poster-first-frame`,
   więc rozstrzyga właściciel reguły.
3. **W `public/media/` leży 158 KB kandydatów `hero-production-still-v1-*` (4 pliki), do których
   nic nie linkuje**, oraz 951 KB klipów i posterów ściany narzędzi czekających na okno F3.
   Nie kosztują transferu (nikt ich nie prosi), kosztują wdrożenie. Do rozstrzygnięcia: albo
   przenieść stille do `site/media/src/`, albo zostawić świadomie do wariantu B hero.
4. Dwa primary CTA naraz na pierwszym ekranie (navbar „Umów 30 minut” + hero „Umów 30 minut”)
   kontra `design-one-cta-per-screen`. Reguła nie ma testu mechanicznego; widać to na
   `hero-desktop.png`.
5. Na telefonie rama produktu ma 340x212 px i liczby w kafelkach są nieczytelne. Kadr działa
   jako sygnał („to jest narzędzie”), nie jako dowód. Do decyzji: kadrowanie mobilne na sam
   pas KPI zamiast całego pulpitu.
6. Marker `[DECYZJA FOUNDERÓW]` w `/rodo` wciąż stoi (ostrzeżenie z prerendera przy każdym
   buildzie). Publikacja i outbound zablokowane do czasu podania danych administratora.
7. Dług sprzed fazy bez zmian: 6 BLOCKER-ów dnia zero w plikach zamrożonych i baza odniesienia
   z 215 wpisami (`baseline/audit-static-2026-09-12.jsonl`).

## Czego to okno nie sprawdziło

- Realnego iPhone'a Karola (Playwright na Windows nie odtwarza kompozycji GPU iOS) —
  warunek z `warstwa-wrazenia.md` §9 p. 4 przed publikacją.
- LCP w pomiarze polowym; zmierzony jest transfer i kolejność pobrań, nie czas na łączu 4G.
- Trasy inne niż `/` pod kątem wyglądu (bramki przeszły na wszystkich 19 plikach HTML).
