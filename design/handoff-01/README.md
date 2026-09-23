# Hand-off: klarow.com — strona wizytówka (runda 4)

Paczka dla Claude Code. Wygląd jest zamknięty w rundach 1–3; tu jest ten sam projekt przepisany na czysty, semantyczny HTML + CSS.

- **Wierność:** hi-fi. Kolory, kroje, odstępy i stany są ostateczne. Liczby w CSS przepisuj 1:1.
- **Czym są te pliki:** działającą referencją (otwierają się w przeglądarce), a nie gotową produkcją. Claude Code dokłada: self-hosting fontów, logikę kalkulatora, „Prześlij dalej”, plik `.vcf` i podstrony, które jeszcze nie istnieją (patrz „Do potwierdzenia”).
- **Copy:** ostateczne, z briefu. Nie zmieniono ani jednego słowa. Dodane są tylko etykiety `aria-label` przy przyciskach bez tekstu.

## Pliki

```
README.md        ten plik
tokens.css       tokeny z briefu + skale --odstep-*, --promien-*, --czas-*
strona.css       komponenty, mobile-first, desktop od @media (min-width: 64em)
index.html       strona główna
przyklady.html   /przyklady, sześć grup z kotwicami
stany.html       arkusz stanów i ikon z rundy 3 (na tych samych CSS)
ikony/           znak.svg, znak-mono.svg, favicon.svg, strzalka.svg,
                 magazyn.svg, ksiegowosc.svg, integracje.svg, czat-ai.svg, generatory.svg, raporty.svg
media/           tlo-m-kafel.png, tlo-d-kafel.png
```

Każdy korzeń komponentu w HTML ma atrybut `data-port="…"`: to nazwa komponentu docelowego w kodzie (np. `data-port="Kafel"` → komponent `Kafel`).

---

## 1. Mapa: sekcja → komponent → data-port → stany → animowana właściwość

Wszystkie przejścia animują wyłącznie `opacity` albo `transform`. Stany hover, focus i wciśnięcia są zbudowane z warstw `::before` / `::after` o `z-index: -1` w elemencie z `isolation: isolate`. Dzięki temu leżą nad tłem elementu, a pod jego treścią. Focus to wszędzie `outline: 2px solid var(--sygnal)` z odstępem 3 px (kafel 5 px), bez przejścia.

| Sekcja (id) | Komponent | data-port | Stany | Animowana właściwość: od → do, czas |
|---|---|---|---|---|
| każda strona | nagłówek (nieprzyklejony) | `Naglowek` | link telefonu na desktopie: hover, focus | `::before` (obrys `--papier-2`) opacity 0 → 1, 150 ms |
| każda strona | znak | `Znak` | focus | — |
| `#start` | hero + CTA | `Hero` | CTA: hover, focus, `:active` | `::before` (`--papier`) opacity 0 → 0,16, 150 ms · `::after` (`--obrys`) opacity 0 → 0,28, 0 ms (powrót 150 ms) |
| `#co-robimy` | siatka działów | `Dzialy` | — | — |
| `#co-robimy` | kafel ×6 | `Kafel` | hover, focus, `:active`, `:visited` | `::before` (obrys `--papier-2`) opacity 0 → 1, 150 ms · `.ikona__punkt` opacity 0,7 → 1, 150 ms · `::after` (`--obrys`) opacity 0 → 0,35, 0 ms (powrót 150 ms) · `:visited`: strzałka `--sygnal` → `--linia` (kolor, bez przejścia) |
| `#co-robimy` | ikona działu (inline SVG) | — | dziedziczy z kafla | — |
| `#oszczednosci` | kalkulator (`<form>`) | `Kalkulator` | — | — |
| `#oszczednosci` | presety (`<fieldset>`) | `Presety` | — | — |
| `#oszczednosci` | preset (`radio`) | `Preset` | hover, focus, `:active`, `:checked` | `::before` opacity 0 → 1, 150 ms · `::after` opacity 0 → 0,35, 0 ms / 150 ms · kropka `::after` (`--sygnal`) opacity 0 → 1, 150 ms · obrys `--papier` i tło `--powierzchnia-2` bez przejścia |
| `#oszczednosci` | krokomierz | `Krokomierz` | przyciski − / +: hover, focus, `:active` | jak kafel: `::before` 0 → 1, 150 ms · `::after` 0 → 0,35, 0 ms / 150 ms |
| `#oszczednosci` | suwak + pole liczby | `Suwak` | hover, focus, `:active` | uchwyt: pierścień przez `box-shadow` (bez przejścia) · `transform` scale(1) → scale(1,15), 150 ms |
| `#oszczednosci` | pole kwoty (zł) | `PoleKwoty` | hover, focus | `border-color` `--linia` → `--papier-2` (bez przejścia) · outline na `:has(input:focus-visible)` |
| `#oszczednosci` | informacja „i” (`<details>`) | `Info` | `[open]` | `.info__tresc` opacity 0 → 1, 250 ms (keyframes `pojaw`) |
| `#oszczednosci` | karta wyniku (`<output>`) | `KartaWyniku` | — | — |
| `#oszczednosci` | wzór | `Wzor` | — | — |
| `#oszczednosci`, `#kontakt` | „Prześlij rachunek dalej”, „Prześlij dalej” | `Udostepnij` | jak przycisk drugorzędny | jak przycisk drugorzędny |
| `#jak-pracujemy` | kroki (`<ol>`) | `Kroki` | — | — |
| `#jak-pracujemy` | obawy / obawa (`<details>`) | `Obawy` / `Obawa` | hover, focus, `:active`, `[open]` | linia pod pytaniem opacity 0 → 1, 150 ms · cień opacity 0 → 0,35, 0 ms / 150 ms · strzałka `transform` rotate(0) → rotate(180deg), 250 ms · odpowiedź opacity 0 → 1, 250 ms |
| `#kim-jestesmy` | osoba (bez zdjęcia) | `Osoba` | — | — |
| `#kontakt` | kontakt | `Kontakt` | przyciski: hover, focus, `:active` | główny: jak CTA · drugorzędny: `::before` 0 → 1, 150 ms · `::after` 0 → 0,35, 0 ms / 150 ms |
| — | stopka | `Stopka` | linki: focus | — |
| — | dolny pasek (tylko mobile) | `PasekKontaktu` | widoczny / zakryty | bez animacji: `#kontakt` i stopka mają `z-index: 2` i tło `--tlo`, więc wjeżdżając na dół ekranu zakrywają pasek |
| `/przyklady` | grupa ×6 | `Przyklad` | — | — |
| wszystkie | — | — | `prefers-reduced-motion: reduce` | wszystkie czasy → 0 ms |

**Tło (każda strona):** jedna warstwa pod treścią.
- `.tlo` to `position: absolute; inset: 0; z-index: -1` w `body` z `isolation: isolate`. Przewija się razem z treścią; nie ma `position: fixed` ani paralaksy.
- Obraz to `<picture>`: `<source data-slot="TLO-D">` od 64em, a `<img data-slot="TLO-M">`.
- Od drugiego ekranu ten sam plik powtarza się pionowo jako `background-image` z `repeat-y` na `.tlo`, w tym samym położeniu co `<img>`, więc szwu nie widać.
- Wygaszenie (`.tlo__wygaszenie`) ma wartości z briefu, w pikselach:
  - mobile: od przezroczystego, przez `--tlo` 60% na 2590 px, do pełnego `--tlo` na 5550 px;
  - desktop: 2240 px i 4800 px.
- `/przyklady` ma mocniejsze wygaszenie: 35% na starcie, 80% na 1144 px, pełne `--tlo` na 2860 px (desktop: 792 px i 1980 px). Kadr jest przesunięty o −0,644 wysokości kafla (desktop −0,684).

**Przyciemnienia pod tekstem (runda 3, kontrast):**
- H2: `--tlo` 60% plus pierścień 10 px (`box-shadow`, statyczny).
- Blok tekstu hero: `--tlo` 45% plus 12 px.
- Karty tekstu: `--powierzchnia` 72%.

**Zmierzony kontrast (runda 3, najjaśniejszy piksel pod każdą linią tekstu):**
- tekst ciągły: min. 9,6:1;
- etykiety mono: min. 5,5:1 („zamiast” w `--recznie`);
- H2: min. 11,3:1;
- hero: 13:1, a w symulacji pełnego słońca (360×640, 15% odbitego światła) 8,3:1.

## 2. Odchylenia od briefu

1. **Tło nie jest przypięte** (brief pkt 6 mówił `position: fixed`). Decyzja z rundy 2: tło przewija się z treścią, a kafel to kadr plus jego odbicie w pionie. Pliki w `media/` mają odbicie zapisane w obrazie, bo CSS nie umie odbijać przy powtarzaniu.
2. **Kafle działów:** słowa „zamiast” / „teraz” to etykiety mono w `--recznie` / `--dane`, a reszta zdania jest w `--papier`. Powód: `--recznie` nie osiąga 7:1 dla tekstu ciągłego.
3. **Wysokość kafli:** kafle w jednym rzędzie mają równą wysokość, ale rzędy mogą się różnić. Wspólna wysokość dla wszystkich zostawiała puste pół kafla przy krótkich tekstach.
4. **Przyciemnienia pod H2 i hero** (runda 3). Poprawki kontrastu weszły w kolejności z briefu: najpierw przyciemnienie, kolor tekstu bez zmian.
5. **H1 hero** bez `text-wrap: balance` (runda 2). Balansowanie dawało 4 linie przy 390 px; bez niego od 360 do 430 px są 3 linie. Nagłówek mobile ma 56 px (runda 2).
6. **Kotwice `/przyklady`:** `czat-ai` i `generatory` zamiast `ai` i `dokumenty` z rundy 1, zgodnie z tym poleceniem. Kafle linkują do nowych kotwic.
7. **Presety** to pola `radio` (stan przez `:checked`), a nie przyciski. Dzięki temu wybór działa bez JS.
8. **Pseudoklasy spoza listy briefu:** poza `:hover`, `:focus-visible` i `[open]` używam `:active` (stan wciśnięty z rundy 3), `:visited` (kafel odwiedzony z rundy 1), `:checked` i `:has()`. Nie ma żadnych klas stanu sterowanych skryptem.
9. **Pasek kontaktu** chowa się bez JS i bez animacji: sekcja `#kontakt` i stopka leżą nad nim. Jedyna konsekwencja: te dwa bloki mają tło w kolorze `--tlo`, czyli takim samym jak dół strony.
10. **Przycisk główny** na hover dostaje rozjaśnienie `--papier` 16% zamiast jaśniejszego obrysu, bo nie ma obramowania.
11. **Pola liczbowe i suwak** nie mają pseudo-elementów. Ich hover (obrys) i pierścień uchwytu zmieniają się bez przejścia, więc nic nie jest animowane poza `transform` uchwytu.
12. **Stopka `/przyklady`** ma te same linki co stopka strony głównej. Makieta z rundy 1 pokazywała tu zwykły tekst.
13. **Półprzezroczyste kolory** są liczone przez `color-mix()` z tokenów. `tokens.css` nie dostał nowych kolorów.
14. **Znak w `ikony/znak.svg`** to sam port (pierścień z kropką). Wordmark „klarow” jest tekstem HTML, żeby nie było tekstu w obrazie.
15. **Strony /404** nie ma w paczce. Jest w makiecie z rundy 1: sama typografia i link na stronę główną.

## 3. Teksty, które się nie zmieściły

Brak. Wszystkie teksty mieszczą się od 360 px. Sprawdzone najdłuższe przypadki:
- H1 hero: 3 linie od 360 do 430 px;
- „≈ 21 100 zł rocznie” i „≈ 10 500 – 24 600 zł” w karcie wyniku na 360 px;
- „Zapisz kontakt” w pasku przy 360 px;
- etykiety sekcji w jednej linii.

## 4. [DO POTWIERDZENIA]

1. **Pliki tła:** `<img>` pokazuje pierwszy kafel, a dalej powtarza się ten sam plik jako `background-image` (jedno pobranie). Czy to akceptowalne, czy wolicie tło wyłącznie z CSS?
2. **Wygaszenie w tokenach:** system Klarow ma w swoim `tokens.css` zmienną `--wygaszenie` o innych wartościach niż brief. Paczka używa wartości z briefu. Czy zaktualizować token w systemie?
3. **„Przyślijcie plik, który Was męczy”** na `/przyklady` prowadzi do `mailto:` bez tematu. Czy dodać temat, np. taki jak przy „najgorszym Excelu”?
4. **Kalkulator (JS, Claude Code):**
   - przeliczanie wyniku;
   - synchronizacja suwak ↔ pole;
   - aktualizacja zmiennej `--postep` na suwaku (wypełnienie ścieżki w WebKit);
   - blokada wysyłki formularza klawiszem Enter.

   Wynik w HTML jest wyrenderowany dla presetu 1: 3 os. × 3 h × 44 tyg. × 60% × 70 zł ≈ 16 600 zł.
5. **„Prześlij rachunek dalej” / „Prześlij dalej”** to na razie zwykłe przyciski. Mają działać przez Web Share. Jaki fallback, gdy przeglądarka go nie ma: kopiowanie linku czy `mailto:`?
6. **Linki do stron, które nie istnieją:** `/cv`, `/polityka-prywatnosci` i `/klarow.vcf`. Do zrobienia osobno.
7. **Fonty:** w produkcji self-hosted (WOFF2, podzbiór latin-ext): Bricolage Grotesque variable (opsz 12–96, wght 200–800) i JetBrains Mono 500. W paczce jest tylko linia podglądu z Google Fonts.
8. **Tytuły `<title>` stron** złożyłem z istniejących słów, bo brief ich nie podaje:
   - „klarow — automatyzacje, integracje, AI”;
   - „Przykłady tego, co budujemy — klarow”.
9. **Favicon:** jest tylko SVG. Czy potrzebne są PNG 32/16 i `apple-touch-icon`?
10. **Znaczenie `data-port`:** przyjąłem, że to nazwa komponentu docelowego. Jeśli ma znaczyć coś innego, atrybuty łatwo przemianować.

## 5. Media

| Slot | Plik | Proporcje | Ścieżka |
|---|---|---|---|
| TLO-M | tlo-m-kafel.png, 1080×3870 (kadr 1080×1935 ≈ 9:16 + odbicie w pionie) | `aspect-ratio: 1080 / 3870` | `media/tlo-m-kafel.png` |
| TLO-D | tlo-d-kafel.png, 2560×2858 (kadr 2560×1429 ≈ 16:9 + odbicie w pionie) | `aspect-ratio: 2560 / 2858` | `media/tlo-d-kafel.png` |

- **Źródła** (poza paczką, w projekcie): `uploads/tlo-m-do-claude-design.png` (1440×2580) i `uploads/tlo-d-do-claude-design.png` (2560×1429).
- **Formaty w produkcji:** warto przekonwertować kafle do AVIF/WebP. Odbicie musi zostać w pliku.
- **Poza tłem** nie ma grafik rastrowych. Znak, ikony i strzałki są w SVG: inline w HTML (kolory przez klasy i `var()`) oraz jako pliki w `ikony/`, z wartościami hex równymi tokenom.

**Ikony działów:**
- siatka 24×24;
- obudowa 21×21 w (1,5; 1,5), promień 5, obrys 1 px bez skalowania;
- punkt ⌀ 2,5 w (19; 5);
- pole rysunku 12×12 (6–18), linia 1,5 z zaokrąglonymi końcami.

W kaflu punkt ma w spoczynku opacity 0,7, a na hover i focus 1.

---

## Lista kontrolna

| Punkt | Wynik |
|---|---|
| Tylko kolory z tokens.css | **tak.** `strona.css` używa wyłącznie `var(--…)`; półprzezroczystość przez `color-mix()` z tokenem i `transparent`. Pliki w `ikony/` mają hex równe tokenom. |
| Brak backdrop-filter, filter, blur | **tak** |
| Brak scroll-snap i sticky | **tak.** Pasek kontaktu ma `position: fixed` z pełnym tłem. |
| Brak paralaksy i ruchu bez interakcji | **tak.** Tło przewija się z treścią, nic nie rusza się samo. |
| Animowane tylko transform / opacity | **tak** |
| Brak `<script>` | **tak** |
| Brak `style="…"` | **tak** |
| Brak base64 | **tak** |
| Brak tekstu w obrazach | **tak.** Wordmark jest tekstem HTML. |
| Wszystkie media z aspect-ratio | **tak.** Tło ma `width`/`height` i `aspect-ratio`; ikony SVG mają kwadratowy `viewBox` i `width`/`height`. |
| Cele dotyku ≥ 48 px | **tak.** Linki w stopce i w tekście mają `min-height: 48px`; „i” ma obszar 48×48. |
| 360 px bez poziomego przewijania | **tak.** Zmierzone dla index i przyklady przy 360×640 i 390×844 (pasek przewijania ukryty jak na telefonie). |
