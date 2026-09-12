# Rejestr liczb dozwolonych publicznie (jedyne źródło dla `brand-allowed-numbers-only`)

> Zasada: liczba, której nie ma w tym pliku, nie może pojawić się w `dist/`, `llms.txt`, meta, JSON-LD, OG,
> PDF, postach bota, szablonach outboundu ani one-pagerze. Lustro w kodzie: `MESSAGING.allowedNumbers`
> (`{ value, pl, en, source }`) w `site/src/data/messaging.ts`; oba miejsca zmieniają się w tym samym commicie.
> Nowa liczba = decyzja founderów (wpis w `docs/DECISIONS.md`) + wiersz tutaj z datą i źródłem.
> Statusy: **OK** = wolno używać; **DO POTWIERDZENIA** = wolno dopiero po potwierdzeniu founderów (do tego czasu
> zostaje dotychczasowe sformułowanie); **ZAMROŻONE** = tylko tam, gdzie już jest, nie na `/`, nie dodawać nowych.

## 1. Liczby własne Klarow (dowód z własnych repozytoriów; `portfolio.md` §4)

| Liczba | Sformułowanie (PL) | Źródło (dowód) | Od kiedy | Gdzie używana | Status |
|---|---|---|---|---|---|
| 12 | „12 dem liczy na żywo na tej stronie" | `site/src/data/tools.ts`: 12 wpisów `kind: "demo"` (liczone w buildzie) | 2026-07-22 (cz. 5) | pasek „W liczbach" (`/`), `llms.txt`, hub | OK |
| 13 | „Cztery z trzynastu" / „Wszystkie realizacje i dema (13)" | `tools.ts`: 12 demo + 1 własny produkt (KSeF) | 2026-07-27 | `/` S3 caption, `/narzedzia` | OK (rośnie automatycznie z `tools.ts`) |
| 17 → 19 | liczba prerenderowanych plików HTML (techniczna, nie marketingowa): **19 na dysku = 17 tras indeksowanych w sitemapie + `/rodo` (`noindex` do przeglądu radcy, D-21) + `404.html`**; po zdjęciu `noindex` w sitemapie jest 18 (tyle sprawdza `verify-site.mjs`) | `prerenderAll()` w `src/prerender/entry.tsx`; `verify-site.mjs` | 2026-07-23 / 19 od v2 (`/rodo` + `404`) | tylko dokumentacja i DoD, nie na stronie | OK (nie publikować jako „19 stron") |
| 3 dni | „3 dni od pierwszej linii kodu do działającego produktu" | git własnego produktu KSeF: 33 commity, 2026-06-14 → 2026-06-16 (`portfolio.md` §4 S5) | 2026-09-12 (v2) | pasek „W liczbach" (`/`), `/oferta` (uzasadnienie „dni, nie miesiące") | DO POTWIERDZENIA (K: potwierdzić zakres „działający produkt" = tryb mock) |
| 89 | „89 testów automatycznych w jednym produkcie" | `grep def test_` w testach produktu KSeF (`portfolio.md` §4 S7) | 2026-09-12 | tylko podstrona `kontroling-ksef` (nie na `/`: język programisty, `brand-icp.md` §2.2) | DO POTWIERDZENIA |
| 12 dni | „klarow.com z 12 demami w 12 dni" | git repo strony: 64 commity, 2026-07-21 → 2026-08-02 (`portfolio.md` §4 S5) | 2026-09-12 | `/oferta` lub FAQ („jak szybko?"), nie w hero | DO POTWIERDZENIA (P+K) |
| ≥ 15 / „kilkanaście" | „kilkanaście integracji: od API Ministerstwa Finansów po płatności i komunikatory" | inwentarz integracji własnych produktów i narzędzi (`portfolio.md` §4 S4); bez nazw serwisów spoza ICP | 2026-09-12 | `/oferta` (typ pracy „Integracje"), `llms.txt` | DO POTWIERDZENIA (founderzy: które nazwy integracji wolno wymienić; do tego czasu „kilkanaście") |
| 3 | „3 własne produkty" | `portfolio.md` §2.C (KSeF + 2 produkty spoza ICP) | 2026-09-12 | NIE publikować do decyzji D-22 (produkty spoza ICP poza stroną) | DO POTWIERDZENIA |
| 30 minut | „Umów 30 minut" / „W 30 minut powiemy, co da się zrobić" | oferta (plan §1.4; `MESSAGING.cta.primary`) | 2026-07-22 | CTA na każdej trasie, `closing` | OK |
| 20–250 osób | ICP publiczne | plan strategiczny §2; `Seo.tsx`, `App.tsx:432` | 2026-07-27 | hero subtext, meta, JSON-LD, `llms.txt` | OK |
| ≤ 10 dni, dzień 0 / dni 1–4 / dzień 5, 50/50 | mechanika „Pilotu na kopii" | plan strategiczny §1.4, `strategy.md` B6 | 2026-07-22 | `/oferta` (5 kroków), FAQ | OK |
| 5–10 dni / „etapami" | pole `delivery` per karta | decyzja D-03 (b) | 2026-09-12 | karty narzędzi, podstrony | OK |
| 786 296 426 / +48 786 296 426 / kontakt@klarow.com | NAP | `src/data/contact.ts` (jedno źródło) | 2026-07-21 | stopka, JSON-LD, `/rodo`, `llms.txt` | OK |
| 2026 | rok w stopce © | data | 2026-07-22 | stopka | OK |
| co do grosza | „kontrola sum co do grosza w każdym imporcie" (nie liczba, ale metryka) | silniki `lib/*.ts` (grosze integer, Σ dowód PASS/FAIL) | 2026-07-22 | pasek „W liczbach", podstrony importów | OK |

## 2. Liczby rynkowe ze źródłem (`peer-legal.md` §1.3; cytować ZAWSZE ze źródłem w tym samym zdaniu lub przypisie)

| Liczba | Sformułowanie (PL) | Źródło | Od kiedy | Gdzie używana | Status |
|---|---|---|---|---|---|
| 8 350 zł brutto/mies. (P25 7 000, P75 9 800) | mediana wynagrodzenia kontrolera | Ogólnopolskie Badanie Wynagrodzeń Sedlak & Sedlak 2026 | 2026-09-12 | one-pager, `/oferta` (kontekst kosztu etatu), outbound | OK (ze źródłem) |
| 20,48 % | składki pracodawcy (9,76 + 6,50 + ~1,67 + 2,45 + 0,10) | ZUS 2026 | 2026-09-12 | j.w., z działaniem `8 350 × 12 × 1,2048 ≈ 121 000` | OK (ze źródłem) |
| ~121 tys. zł/rok; fully-loaded 140–160 tys. | roczny koszt etatu kontrolera | Sedlak & Sedlak 2026 + ZUS 2026 | 2026-09-12 | j.w.; framing „żeby te 121 tys. kupowało analizę, nie sklejanie arkuszy" | OK (ze źródłem; zakaz framingu odejmowania etatu) |
| ~141 tys. zł/rok | analityk danych mid | Sedlak & Sedlak 2026 + ZUS 2026 | 2026-09-12 | one-pager | OK (ze źródłem) |
| 33 dni / 56 dni | Time to Hire / Time to Fill | dane rynkowe PL, II poł. 2025 (wskazać publikację przy użyciu) | 2026-09-12 | one-pager, outbound | OK (ze źródłem) |
| 15–20 % rocznego brutto (15–20 tys. zł) | fee agencji rekrutacyjnej | rynek rekrutacyjny PL 2026 (wskazać publikację przy użyciu) | 2026-09-12 | one-pager | OK (ze źródłem) |
| 88 % (45 % logiczne, 23 % mechaniczne, 31 % pominięcia) | arkuszy kalkulacyjnych zawiera błędy w formułach | Panko, University of Hawai'i, „What We Know About Spreadsheet Errors" (recenzowane) | 2026-09-12 | `/oferta`, podstrona audytu jakości, one-pager; najmocniejsza liczba | OK (ze źródłem) |
| 19–20 % czasu | pracownicy wiedzy na wyszukiwanie informacji | McKinsey Global Institute, **2012** (rok obowiązkowo w cytacie) | 2026-09-12 | one-pager | OK (ze źródłem i rokiem) |
| 943 470 zł; 500 tys. zł; 3 % przychodu albo 1 mln zł | kary: Bisnode (UODO, NSA); Tani Opał (UKE); sankcja z PKE | decyzje UODO/NSA; UKE; art. 398 PKE | 2026-09-12 | tylko `/rodo` i dokumenty wewnętrzne (nie w sprzedaży) | OK (tylko kontekst prawny) |

## 3. Zestaw ZAMROŻONY (anonimowe liczby z poprzedniej firmy; decyzja D-07 b; do umowy IP NIE dodawać nowych, NIE przenosić na `/`)

| Liczba | Sformułowanie | Gdzie jest dziś | Status |
|---|---|---|---|
| „kilkanaście" | „kilkanaście narzędzi w jednej firmie produkcyjno-budowlanej" | `App.tsx:240` (pasek), `faq.ts:41` | ZAMROŻONE; „15" dopiero po potwierdzeniu, że liczenie narzędzi jest poza zakazem (D-07) |
| ≈ 10 000 wierszy / „~10 tys." | „wierszy kosztów z ERP miesięcznie" | `App.tsx:241`, `entry.tsx:135, 206`, `toolsSeo.ts:474`, `faq.ts:41` | ZAMROŻONE; z `/` usunąć w v2 (pasek liczb = tylko liczby własne) |
| ~30 | „równoległych projektów" | `entry.tsx:135, 206`, `toolsSeo.ts:36, 60, 86, 110, 136` | ZAMROŻONE (opisy podstron) |
| „kilkanaście sekund zamiast godzin" (galeria: „z ~6 godz.") | czas raportu zarządczego | `entry.tsx:136, 207`, `toolsSeo.ts:19, 24, 36`, `faq.ts:41` | ZAMROŻONE |
| „klienci w USA" | rynek poprzedniej firmy | `entry.tsx:135, 206` | ZAMROŻONE; nie mylić z klientami Klarow (`brand-honest-labels`) |
| „mniej niż dwa miesięczne koszty etatu kontrolera"; „moduł raportowy ERP 6+ miesięcy i od 100 tys. zł" | kotwice porównawcze w FAQ (nie cennik) | `faq.ts:16` | ZAMROŻONE (kotwica, nie kwota usługi) |
| API KSeF 2.0, FA(3), prognoza 13 tyg., raporty XLSX, Flask + SQLite + React | fakty techniczne własnego produktu | `tools.ts:640–644`, `toolsSeo.ts:615–663` | OK (własny produkt; bez nazwy produktu i domeny) |

## 4. ZAKAZANE (nigdy publicznie)

| Co | Dlaczego | Źródło zakazu |
|---|---|---|
| „raport Deloitte / IDC o czasie traconym w Excelu" i każda liczba z niego | brak oryginału; jedna niepodparta liczba kasuje wiarygodność pozostałych | `peer-legal.md` §1.3 |
| framing odejmowania etatu: „oszczędzimy Wam etat", „nie zatrudniajcie", „zastąpimy kontrolera" | firma z wakatem właśnie wybrała człowieka; mówimy, że etat ma kupować analizę, nie sklejanie arkuszy | `peer-legal.md` §1.3 |
| „wdrożone u klientów" / „nasi klienci" (liczba mnoga) do 2. płacącego klienta Klarow; „liczba klientów" | zero płatnych klientów na dziś | `brand-honest-labels`, `portfolio.md` §4 |
| kwoty per narzędzie / usługę: pilot 18–26 tys., podłoga 12 tys., retainer 1,9–4,9 tys./mies., panel 0,99–1,99 tys./mies., USA $9,5–15 tys. | ladder cen jest wewnętrzny; publicznie „wycena po bezpłatnej diagnozie" | CLAUDE.md 2026-07-27, plan §1.4 |
| „lata doświadczenia", „X lat na rynku" | repozytoria od 03.2026; nieuczciwe | `portfolio.md` §4 |
| liczby poprzedniej firmy poza zestawem zamrożonym (m.in. ~30 inwestycji / 29 zarchiwizowanych, ~9 inwestycji G703, 163 testy importu, 18 201 tokenów, delta +1 040 238,82 PLN, 31 etapów, 5–15 MB plików, porty i adresy LAN, nazwiska ról) | przypisywalne firmie; umowa IP nie podpisana | `portfolio.md` §6.2, CLAUDE.md #3 |
| liczby użytkowników / przychodów produktów własnych spoza ICP | decyzja D-22: produkty poza stroną | `portfolio.md` §2.C |
| „99 %", „50 %", „10×", „∞" i inne fake-perfect | taste §9.D: NO fake-perfect numbers | taste-locks §C |
| liczby testów, commitów, linii kodu na `/` | język programisty; CFO nie mierzy testami | `brand-icp.md` §2.2 p.4 |

## 5. Procedura dodania liczby

1. Founder (P albo K) podaje liczbę + dowód (plik, git, publikacja z rokiem) → wpis w `docs/DECISIONS.md`.
2. Wiersz w tabeli 1 albo 2 tego pliku (status OK) + wpis w `MESSAGING.allowedNumbers` z polem `source`.
3. Użycie w copy zawsze z tym samym sformułowaniem (PL i EN) i, dla liczb rynkowych, ze źródłem w zdaniu.
4. `node .claude/skills/klarow-guardian/scripts/audit-static.mjs` (reguła `brand-allowed-numbers-only`) porównuje
   inwentarz liczb z `dist/` z tym rejestrem; nowa liczba bez wiersza = BLOCKER.
