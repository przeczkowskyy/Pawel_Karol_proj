# handoff-01 — skąd jest i co z nim zrobiono

**Data:** 2026-09-23 · **Źródło:** Claude Design, projekt „Decyzje dotyczące designu projektu”, runda 4
**Design system:** projekt **Klarow** (`744d1b81-74b1-4452-9215-26cc98773a18`), podłączony przez `/design-login`
**Użyte prompty:** `design/prompty/claude-design/01-brief.md` → `02-hero.md` → `03-tlo-ikony-stany.md` → `04-handoff.md`
**Załączniki wysłane do Claude Design:** `_mastery/tlo-m-do-claude-design.png`, `_mastery/tlo-d-do-claude-design.png`

## Kontrola względem kontraktu z briefu — PRZESZŁA

Sprawdzone maszynowo na `index.html`, `przyklady.html`, `stany.html`, `strona.css`, `tokens.css`:

| Wymóg | Wynik |
|---|---|
| Brak `<script>` | ✅ 0 wystąpień |
| Brak `style="…"` | ✅ 0 |
| Brak `data:…base64` | ✅ 0 |
| Brak `@import` | ✅ 0 |
| Brak `backdrop-filter`, `filter`, `blur()` | ✅ 0 |
| Brak `scroll-snap`, `position: sticky`, paralaksy, `background-attachment` | ✅ 0 |
| CDN tylko jedna linia Google Fonts | ✅ jedyny zasób zewnętrzny |
| Kolory wyłącznie z tokenów | ✅ **zero** literałów hex poza `tokens.css` |
| `tokens.css` zgodny z naszym | ✅ identyczny (diff pusty) |
| Animowane tylko `transform` / `opacity` | ✅ trzy reguły `transition`, obie właściwości dozwolone |
| Formy zależne od płci | ✅ brak („dwaj”, „obaj”, „szefowi”, „handlowiec”, „inżynier”) |
| Sekcje z `id` | ✅ `start`, `co-robimy`, `oszczednosci`, `jak-pracujemy`, `kim-jestesmy`, `kontakt` |
| Kotwice `/przyklady` | ✅ `magazyn`, `ksiegowosc`, `integracje`, `czat-ai`, `generatory`, `raporty` |
| Kalkulator jako `<form>` | ✅ z prawdziwymi polami, presety jako `radio` (działają bez JS) |
| Linki | ✅ `tel:`, trzy `mailto:` z tematami, `/klarow.vcf`, `/polityka-prywatnosci`, `/przyklady`, `/cv` |

**To jest czysta paczka.** Nie znalazłem ani jednego naruszenia, co przy tak długim kontrakcie jest rzadkie.

## Co zmieniono po rozpakowaniu

1. **Usunięty katalog `media/`** (16 MB PNG) — powody i tabela porównawcza w `MEDIA-USUNIETE.md`.
2. Spłaszczona struktura: zawartość `design_handoff_klarow/` przeniesiona do katalogu paczki.

## Do zrobienia przy wchłanianiu (C1)

1. **Zdjąć metadane C2PA z SVG.** Każda ikona waży 8 KB, z czego treść to 222–718 B. Po SVGO całość zejdzie
   z 82 KB do ok. 4,5 KB.
2. **Podmienić tło** na nasze WebP (`site/src/assets/`) zamiast PNG z paczki; mobilny kafel z paczki ma tylko 1080 px.
3. **Fonty self-hosted** przez `@fontsource` zamiast linii Google Fonts (w paczce oznaczonej „TYLKO PODGLĄD”).
4. **Dopisać `/404`** — nie ma jej w paczce (odchylenie 15 w README paczki), jest tylko w makiecie z rundy 1.
5. **Ujednolicić kotwice**: paczka używa `czat-ai` i `generatory`; nasz szkic treści miał `ai` i `dokumenty`.
   **Przyjmujemy wersję z paczki**, bo `index.html` i `przyklady.html` są ze sobą zgodne.
6. Kalkulator: policzyć wynik w kodzie (paczka ma wyrenderowany preset domyślny, zgodnie z briefem).

## Odchylenia zgłoszone przez Claude Design (wszystkie zaakceptowane)

Pełna lista w `README.md` paczki, sekcja 2. Najważniejsze:
- tło przewija się i powtarza przez odbicie **zapisane w obrazie** (CSS nie umie odbijać przy `repeat`);
- „zamiast” i „teraz” to etykiety mono w `--recznie` / `--dane`, bo `--recznie` nie osiąga 7:1 dla tekstu ciągłego;
- H1 bez `text-wrap: balance`, bo balansowanie dawało 4 linie na 390 px;
- presety kalkulatora jako `radio` ze stanem `:checked`, więc wybór działa bez JS;
- pasek kontaktu chowa się bez JS: `#kontakt` i stopka leżą nad nim.
