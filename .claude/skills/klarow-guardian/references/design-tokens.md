# Tokeny koloru i tabela kontrastu (jedyne źródło par dla `a11y-contrast`)

> **Po co ten plik.** `rules/a11y-contrast.md` wymaga, żeby KAŻDA para „kolor tekstu × tło" z tokenów
> miała policzony kontrast. Tutaj ta tabela jest kompletna i policzona (WCAG 2.x, wzór na luminancję
> względną, wartości zaokrąglone w dół do dwóch miejsc). Skrypt `scripts/audit-contrast.mjs` jest
> planowany — do czasu jego powstania ten plik JEST bramką: nowy albo zmieniony token koloru wymaga
> przeliczenia wiersza i wpisu w `references/decisions-log.md`.
>
> **Stan:** wartości pochodzą z projektu `site/src/styles/tokens.css` (synthesis §2.5.2, warstwa 1–2).
> Plik `tokens.css` powstaje w fazie 1 — do tego czasu tabela opisuje stan DOCELOWY, a nie zastany,
> i jest wzorcem, do którego `tokens.css` ma być napisany (nie odwrotnie).

## 1. Prymitywy (nigdy w komponentach)

| Grupa | Wartości |
|---|---|
| stal | `--steel-50 #EFF3F7` · `--steel-100 #E2E8EF` · `--steel-200 #C8D2DD` · `--steel-300 #A8B4C2` · `--steel-400 #8895A6` · `--steel-500 #69788C` · `--steel-600 #55677C` · `--steel-700 #42526E` · `--steel-800 #2C3947` · `--steel-900 #1A212B` |
| szarości | `--gray-0 #FAFAFA` · `--gray-100 #E5E5E5` · `--gray-300 #B4B4B9` · `--gray-500 #8B8B90` · `--gray-700 #404040` · `--gray-800 #3A3A3A` · `--gray-850 #2E2E2E` · `--gray-900 #262626` · `--gray-925 #1F1F1F` · `--gray-950 #171717` · `--gray-975 #121212` |
| statusy (tylko dashboardy) | `--green-400 #34D399` · `--red-400 #F87171` · `--red-500 #EF4444` · `--amber-400 #FBBF24` · `--blue-300 #93C5FD` |

Akcent marki to **stal `#A8B4C2`** (`--steel-300`) i jest JEDYNYM akcentem (`brand-single-accent-steel`).
Złoto `#FFA914` nie istnieje w żadnej warstwie (`brand-no-gold`).

## 2. Aliasy semantyczne (motyw ciemny = domyślny)

| Alias | Wartość | Rola |
|---|---|---|
| `--background` | `#121212` (`--gray-975`) | tło strony; `color-scheme: dark`, `meta theme-color` |
| `--surface` | `#262626` (`--gray-900`) | panel, karta w dashboardzie |
| `--surface-muted` | `#1F1F1F` (`--gray-925`) | pasek, wiersz naprzemienny |
| `--surface-raised` | `#2E2E2E` (`--gray-850`) | hover panelu, komórka bento |
| `--surface-overlay` | `#171717` (`--gray-950`) | nav, dialog, menu (zawsze NIEPRZEZROCZYSTE — `design-sticky-opaque`) |
| `--foreground` | `#E5E5E5` (`--gray-100`) | tekst podstawowy |
| `--foreground-strong` | `#FAFAFA` (`--gray-0`) | nagłówki |
| `--foreground-muted` | `#B4B4B9` (`--gray-300`) | lead, opis, etykieta |
| `--foreground-faint` | `#8B8B90` (`--gray-500`) | placeholder, meta (kit miał 3,29:1 — ta wartość naprawia AA) |
| `--accent` | `#A8B4C2` (`--steel-300`) | akcent, ikony, `--ring` |
| `--accent-text` | `#D9E0E8` | akcent jako TEKST na ciemnym tle |
| `--cta` / `--on-cta` | `#FAFAFA` / `#121212` | primary CTA: płaska biel, czarny tekst |
| `--border` / `--border-strong` | `#3A3A3A` / `#404040` | hairline strukturalny / obrys kontrolki |
| `--ok` `--warn` `--bad` `--info` | `#34D399` `#FBBF24` `#F87171` `#93C5FD` | WYŁĄCZNIE statusy w dashboardach (`design-status-semantics`) |

## 3. Tabela kontrastu (motyw ciemny, WCAG 2.x)

Próg: **≥ 4,5:1** dla tekstu < 24 px (lub < 19 px bold), **≥ 3:1** dla tekstu ≥ 24 px, ikon, obrysów
kontrolek i wskaźnika fokusu. Wiersz `--on-cta` czytaj tylko w kolumnie `--cta` (to para przycisku).

| Token | `--background` #121212 | `--surface` #262626 | `--surface-muted` #1F1F1F | `--surface-raised` #2E2E2E | `--surface-overlay` #171717 | `--cta` #FAFAFA |
|---|---|---|---|---|---|---|
| `--foreground` #E5E5E5 | 14,87 | 12,01 | 13,08 | 10,78 | 14,23 | 1,21 |
| `--foreground-strong` #FAFAFA | 17,95 | 14,50 | 15,79 | 13,01 | 17,18 | 1,00 |
| `--foreground-muted` #B4B4B9 | 9,07 | 7,33 | 7,98 | 6,58 | 8,68 | 1,98 |
| `--foreground-faint` #8B8B90 | 5,53 | 4,46 | 4,86 | 4,01 | 5,29 | 3,25 |
| `--accent` #A8B4C2 | 8,90 | 7,19 | 7,83 | 6,45 | 8,51 | 2,02 |
| `--accent-text` #D9E0E8 | 14,08 | 11,37 | 12,38 | 10,20 | 13,47 | 1,28 |
| `--on-cta` #121212 | 1,00 | 1,24 | 1,14 | 1,38 | 1,04 | **17,95** |
| `--border` #3A3A3A | 1,65 | 1,33 | 1,45 | 1,19 | 1,58 | 10,90 |
| `--border-strong` #404040 | 1,81 | 1,46 | 1,59 | 1,31 | 1,73 | 9,93 |
| `--ok` #34D399 | 9,74 | 7,87 | 8,57 | 7,06 | 9,33 | 1,84 |
| `--bad` #F87171 | 6,77 | 5,47 | 5,96 | 4,91 | 6,48 | 2,65 |
| `--warn` #FBBF24 | 11,22 | 9,07 | 9,87 | 8,13 | 10,74 | 1,60 |
| `--info` #93C5FD | 10,39 | 8,39 | 9,14 | 7,53 | 9,94 | 1,73 |

### Co z tej tabeli wynika (wiążące)

1. **Tekst przechodzi wszędzie poza `--foreground-faint` na `--surface-raised`** (4,01 < 4,5): na
   podniesionej powierzchni placeholder i meta idą w `--foreground-muted` (6,58), nie `faint`.
2. **`--foreground-faint` na `--surface` to 4,46** — o włos poniżej progu. Traktuj jako minimum dla
   tekstu ≥ 24 px albo podmień na `--foreground-muted`; nie używaj go do tekstu 12–14 px na `--surface`.
   (Przykład w `rules/a11y-contrast.md` §Poprawnie podaje wariant `#8D8D93` — jaśniejszy o jeden stopień,
   4,97:1 na `--surface-muted`. Wartość rozstrzyga się przy pisaniu `tokens.css`: albo `--gray-500`
   zmienia się na `#8D8D93` w warstwie prymitywów, albo `faint` nie wchodzi na `--surface`/`--surface-raised`.
   Cokolwiek wygra, wraca TUTAJ jako przeliczony wiersz i do reguły jako przykład — nie dwa różne hexy.)
3. **`--accent` jest akcentem, nie tekstem na jasnym**: na `--cta` (biel) daje 2,02 — nigdy stal na bieli
   jako tekst. Na ciemnych tłach 6,45–8,90 = tekst i ikony OK.
4. **`--border` i `--border-strong` nie spełniają 3:1 na żadnym ciemnym tle** (1,19–1,81) i to jest
   świadome: hairline jest DEKORACJĄ kompozycji, nie nośnikiem informacji (decyzja „linie, nie boxy",
   `decisions-log.md` §3.1). Granica kontrolki, która niesie znaczenie (input, przełącznik, focus),
   używa `--accent` (`--ring`, 8,90 na `--background`), nie `--border`.
5. **Statusy nigdy nie polegają na kolorze** (`design-status-semantics`): ikona + tekst + kolor.
   Same wartości `--ok/--warn/--bad/--info` przechodzą AA na wszystkich ciemnych tłach.
6. **Czysta czerń `#000000` i czysta biel `#FFFFFF` są zakazane** poza `--cta-hover` (`taste` §8,
   `decisions-log.md` §3.3).

### Tekst na wideo i obrazie (hero S1)

Kontrast liczymy na **najjaśniejszej klatce** (ffmpeg `signalstats`, YMAX) po nałożeniu overlaya
`linear-gradient(180deg, rgba(18,18,18,.15), rgba(18,18,18,.85))`. Poster i wideo mierzymy osobno;
wynik wpisujemy do `references/asset-review-log.md` (pozycja 6 bramki `media-asset-review-gate`).

## 4. Motyw jasny (`[data-theme="light"]`)

Komplet jasnych aliasów powstaje razem z `tokens.css` (`design-light-ready-tokens`: każdy alias ciemny
ma parę jasną). Znane wartości z projektu: `--background #F4F5F7`, `--surface #FFFFFF`,
`--accent var(--steel-700) #42526E`, `--on-accent #FFFFFF`, `--cta #111827`, `--on-cta #FFFFFF`.
Motyw jasny **nie jest używany na stronie** (brak przełącznika — `design-page-theme-lock`); służy
podglądowi PDF, brandkitowi i wdrożeniom u klienta. Tabelę kontrastu dla motywu jasnego dopisujemy
w tym samym commicie, w którym `tokens.css` dostaje komplet `[data-theme="light"]`.

## 5. Procedura zmiany tokenu koloru

1. Zmieniasz wartość w `site/src/styles/tokens.css` (warstwa 1 lub 2).
2. Przeliczasz wiersz/kolumnę w §3 (wzór WCAG: `L = 0,2126 R + 0,7152 G + 0,0722 B` po linearyzacji
   `c ≤ 0,03928 ? c/12,92 : ((c+0,055)/1,055)^2,4`; kontrast `(L₁+0,05)/(L₂+0,05)`).
3. Każda para tekstowa < 4,5:1 albo para UI < 3:1 = zmiana odrzucona albo wyjątek z uzasadnieniem
   w `references/decisions-log.md`.
4. Wpis do `decisions-log.md` §1 (co, dlaczego, które reguły) i przebieg audytu
   (`audit-static.mjs`; docelowo `audit-contrast.mjs`).
