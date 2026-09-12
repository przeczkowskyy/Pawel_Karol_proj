---
id: media-asset-review-gate
title: Bramka przeglądu assetu: „nie widać, że AI", brak ludzi/tekstu/ciepłej barwy, zdejmowalne bez straty treści, banding na OLED, budżet
impact: HIGH
tags: [media, review, brand, quality]
source: higgsfield §6.2/§8 („AI-slop", przegląd adwersarialny) · synthesis §2.6.1 (decyzja Karola „nie da się poznać, że to AI") · taste §4.5/§4.7 (Production-Test Tells) · ui-kit-habits P3 (scrim/kontrast)
added: 2026-09-12
---

## Zasada

Żaden plik nie trafia do `site/public/media/` ani `site/public/thumbs/` bez zaliczonej bramki. Bramka = tabela w `site/media/SOURCES.md` pod wpisem assetu, wypełniona przez agenta `media-auditor` (read-only) i potwierdzona przez Karola („oko marki"). Wszystkie pozycje muszą być TAK:

| # | Pytanie | Jak sprawdzić |
|---|---|---|
| 1 | Czy osoba spoza zespołu NIE zgadnie w 5 s, że to generatywne AI? | 2 osoby (Karol, Paweł) oglądają 10 s pętli na OLED; test „gdzie jest AI-tell": zniekształcone krawędzie, pływające tekstury, „mydlany" blur, nieciągłości na spawie pętli |
| 2 | Zero ludzi, rąk, twarzy, sylwetek? | oględziny każdej z klatek co 1 s (`ffmpeg -vf fps=1` → PNG) |
| 3 | Zero tekstu, liter, cyfr, logo, znaków wodnych, UI, arkuszy, wykresów-imitacji? | j.w.; OCR kontrolny (`tesseract` na 10 klatkach; oczekiwane: pusty wynik) |
| 4 | Paleta: tylko stal `#A8B4C2`/`#8895A6`/`#69788C` na `#121212–#171717`; zero ciepłych barw (złoto, pomarańcz, neon, magenta)? | histogram (`ffmpeg -vf "signalstats"` lub Photoshop): średnia H w zakresie 200–230°, S ≤ 25 %; punktowa próbka najjaśniejszego piksela nie może mieć R > B |
| 5 | Zdejmowalne bez straty treści? | usuń `<video>`/obraz z DOM: H1, lead, CTA i każda informacja pozostają; asset nie niesie żadnej treści |
| 6 | Kontrast tekstu na NAJJAŚNIEJSZEJ klatce ≥ 4,5:1 (lead) i ≥ 3:1 (H1 ≥ 24 px)? | klatka o max luminancji (`signalstats` YMAX) + overlay gradient → pomiar kontrastu (docelowy `scripts/audit-contrast.mjs --hero`, dziś Polypane albo DevTools) |
| 7 | Brak bandingu i migotania na OLED? | iPhone Karola, jasność 100 %, ciemne pomieszczenie; na `signalstats` brak skoków YAVG między sąsiednimi klatkami > 2 % |
| 8 | Spaw pętli niewidoczny? | ostatnia klatka == pierwsza (`ffmpeg` różnica klatek → `psnr` ≥ 45 dB); podgląd 3 pełnych obrotów |
| 9 | Poster = pierwsza klatka pętli (nie „najładniejsza" ze środka)? | `psnr` poster vs klatka 0 ≥ 45 dB |
| 10 | Budżety (`media-video-budgets`) spełnione? | rozmiary, fps, `-an`, czas 6–10 s |
| 11 | Spójność z kitem (1px hairlines, satyna, single cool key light, locked-off camera, extremely slow)? | porównanie z master still (`image_references`) obok siebie |
| 12 | Wejścia zgodne z `media-higgsfield-inputs-policy`? | lista `image_references` we wpisie SOURCES.md |

Wynik: `PASS` (12/12) albo `FAIL` z numerami pozycji i decyzją (dogrywka / postprodukcja / odrzucenie). Asset `FAIL` nie wchodzi do `public/`. Przegląd powtarza się przy każdej nowej wersji (`-v2`).

## Mechanizm awarii (dlaczego)

- Persona (CFO firmy produkcyjnej, „kalkulator, nie wróżka") czyta rozpoznawalne AI-wideo jako brak powagi; jedna „hollywoodzka" pętla podważa cały argument „dane zostają u Ciebie" (higgsfield §6.2, §8 „AI-slop: strona traci powagę").
- Tekst/cyfry w generatywnym wideo są zniekształcone; strona ma PRAWDZIWE żywe dashboardy: imitacja obok oryginału to sprzeczność.
- Złoto/pomarańcz = stara marka; presety „NEON CITY" itp. łamią Color Lock (`brand-*`).
- Banding na stalowych gradientach w 8-bit to główna wada generatywnych pętli; widoczny tylko na OLED w ciemności, więc test na laptopie go nie wykryje.
- Ludzie/hale sugerują konkretnego klienta (zasada #3) i są natychmiast rozpoznawalne jako AI.
- Poster ze środka pętli = widoczny przeskok przy crossfade `poster → video` (klatka 0 ≠ poster).

## Niepoprawnie

```
SOURCES.md: „hero-v1: wygląda OK, wrzucam"           # brak tabeli, brak drugiej osoby, brak OLED
poster wybrany z klatki 4,2 s („ładniejsze światło")  # przeskok przy crossfade
prompt bez negatywów → w kadrze cień sylwetki i miękki napis na powierzchni
```

## Poprawnie

Wpis dziennika w `site/media/SOURCES.md`: tabela 12 pozycji z dowodem per pozycja i linia werdyktu,
zgodnie ze wzorem w [`references/asset-review-log.md`](../references/asset-review-log.md) §1
(dziennik trzymamy poza regułą: reguła mówi, CO sprawdzić, dziennik notuje, co wyszło).

```
## hero-v1 · przegląd (2026-09-2x) · audytor: media-auditor · potwierdził: Karol
| # | wynik | dowód |  → 12 wierszy, każdy z dowodem (pomiar, nie opinia)
WYNIK: PASS 12/12 → public/media/hero-v1.*
```

## Test

```bash
# klatki do oględzin i OCR (scratchpad)
ffmpeg -y -i hero-v1.mp4 -vf fps=1 frame_%02d.png && for f in frame_*.png; do tesseract "$f" - 2>/dev/null | grep -E '[A-Za-z0-9]{2,}' && echo "TEKST w $f"; done
# spaw pętli i poster
ffmpeg -i hero-v1.mp4 -vf "select=eq(n\,0)" -frames:v 1 first.png; ffmpeg -sseof -0.05 -i hero-v1.mp4 -frames:v 1 last.png
ffmpeg -i first.png -i last.png -lavfi psnr -f null - 2>&1 | grep -oE 'average:[0-9.]+'      # ≥ 45
ffmpeg -i first.png -i hero-v1.poster.webp -lavfi psnr -f null - 2>&1 | grep -oE 'average:[0-9.]+'   # ≥ 45
# migotanie/banding: statystyki jasności per klatka
ffmpeg -i hero-v1.mp4 -vf signalstats -f null - 2>&1 | grep -oE 'YAVG:[0-9.]+' | head -240   # różnice sąsiednie ≤ 2 %
# wpis PASS w SOURCES.md dla każdego pliku w public/media
for f in site/public/media/*.webm; do b=$(basename "$f" .webm); grep -A 16 "## $b" site/media/SOURCES.md | grep -q 'WYNIK: PASS 12/12' || echo "BRAK PASS dla $b"; done
```

Docelowo `scripts/verify-site.mjs` krok `media-asset-review-gate` (obecność `PASS 12/12` per plik) + `checklists/new-asset.md`.

## Wyjątki

- Zrzuty dem z `shoot-tools.mjs` (nie AI) przechodzą skróconą bramkę: pozycje 4 (paleta kitu z automatu), 5, 10 oraz „brak nazwy firmy źródłowej/produktu w UI" (grep w DOM przed zrzutem).
- Portrety founderów: pozycje 4 (duotone stal), 7, 10 i zgoda obu founderów na publikację (D-05).
