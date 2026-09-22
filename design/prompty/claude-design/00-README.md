# Hurtownia promptów: Claude Design

## Kolejność
1. **PROMPT #1** (`01-brief.md`): brief razem z załącznikami. Dostajesz ekrany A–E i karty K1–K17.
2. **PROMPT #2** (`02-hero.md`): hero na 360×640.
3. **PROMPT #3** (`03-stany.md`): stany zasilenia.
4. **PROMPT #4** (`04-handoff.md`): uporządkowana paczka do hand-offu.
5. **PROMPT R** (`R-powrot-do-kontraktu.md`): tylko gdy projekt odjedzie od tokenów albo od copy.

Timebox całości to ok. 4 h. Claude Design korzysta z tej samej puli użycia co reszta pracy z Claude, dlatego rundy #2–#4 są celowo wąskie.

## Onboarding w Claude Design
- Wybierz **„bez design systemu”**.
- **Nie** podpinaj starego repo ani zrzutów starej strony, ani jako design systemu, ani jako codebase'u.
- Nie załączaj logo, grafik stockowych ani dokumentów firmowych.

## Załączniki do PROMPTU #1

| Plik | Skąd | Status |
|---|---|---|
| `A1m-hero-m.png` | pierwsza klatka zakodowanej pętli albo zatwierdzony still `hero-m-start-1080x1920.png` | wymagany |
| `A1m-hero-m.webp` | placeholder animowany (`../higgsfield/03-pipeline-ffmpeg.md`, krok G) | jeśli pętla już jest |
| `A0-karta-stylu.png` | karta stylu zmniejszona do szerokości 2560 px | opcjonalny, tylko referencja |

Pliki robocze leżą w `_mastery/placeholdery/`. Do Claude Design nigdy nie wysyłamy MP4 ani masterów 4K.

## Hand-off do Claude Code
1. Po rundzie #4 wybierz **Export → Send to Claude Code**. Plan B: **Export → ZIP** i rozpakowanie do `design/handoff-01/`.
2. W Claude Code, w katalogu repo, wklej poniższy tekst, a pod nim prompt wygenerowany przez Claude Design:

````text
Poniżej prompt hand-offu z Claude Design. NIE implementuj projektu i nie dotykaj site/. Zadanie:
1. Zapisz paczkę 1:1 w design/handoff-01/ (bez przeformatowania). Jeśli pobranie wymaga logowania, zatrzymaj się i poproś o ZIP.
2. Dopisz design/handoff-01/ZRODLO.md: data, link do projektu w Claude Design, lista załączników, użyte prompty (design/prompty/claude-design/).
3. Sprawdź paczkę względem kontraktu z design/prompty/claude-design/01-brief.md i WYPISZ naruszenia, nie poprawiaj: kolory spoza tokens.css; backdrop-filter/filter/blur; scroll-snap; position: sticky; <script>; style="…"; base64; CDN inne niż jedna linia Google Fonts oznaczona TYLKO PODGLĄD; animowane właściwości inne niż transform/opacity; brak id sekcji lub data-port; tekst w obrazach; formy zależne od płci; zmienione copy.
4. Pokaż git status i zaproponuj commit „design: handoff-01 z Claude Design”.

[tu wklej prompt wygenerowany przez Claude Design]
````

3. Wchłonięcie hand-offu w `site/` to osobny krok, czyli commit **C1** (koncepcja §10).
   - **Bierzemy** z hand-offu: układ, odstępy, wygląd komponentów.
   - **Nie bierzemy:** JS, fontów z CDN, stylów inline, mediów base64, placeholderów WebP.
4. Kolejne rundy (np. A2 i A3 w v1.1) zaczynamy od **zrzutu produkcji**, nie od starego prototypu. Zapisujemy je do `design/handoff-02/` i dalej.
