# site/media/SOURCES.md

Dziennik pochodzenia każdego pliku medialnego w `site/public/**` (reguły `media-*`,
bramka `checklists/new-asset.md`). Jeden wiersz = jeden plik albo jedna rodzina plików:
co to jest, czym zrobione, kiedy, z jakimi parametrami i ile kosztowało.
Pliki bez wpisu tutaj nie wchodzą do repozytorium.

## Karty społecznościowe (`public/og/*.png`)

| Pozycja | Wartość |
|---|---|
| Co | 19 kart Open Graph 1200x630 PNG: 6 tras z `pagesSeo.ts` (`home`, `narzedzia`, `oferta`, `faq`, `rodo`, `404`) i 13 narzędzi z `tools.ts` (nazwa pliku = slug narzędzia) |
| Czym | `site/scripts/og.mjs` (Node 24, zero zależności npm) + headless Chromium z cache Playwrighta; rasteryzacja z `file://`, bez serwera i bez sieci |
| Kiedy | 2026-09-12, faza F2 przebudowy v2 |
| Parametry | szablon HTML na tokenach czytanych z `src/styles/tokens.css`; tło: pionowy gradient `--steel-900` do `--background` (tymczasowy grunt, do podmiany na fakturę z H3 wg planu §7.3); font Nunito Sans wbudowany jako `data:` woff2; stopień pisma tytułu wybierany z długości; `--disable-lcd-text`, `--force-device-scale-factor=1` |
| Treść | wordmark KLAROW (płaski, bez gradientu), hairline, tytuł z jednego źródła SEO, hook narzędzia (pomijany, gdy powtarza nazwę), ścieżka kanoniczna, chip dowodu na kartach narzędzi. Zero zdjęć, zero twarzy, zero materiału zewnętrznego |
| Rozmiary | razem 835.8 KB, największa 52.6 KB; limit z `perf-images-policy` to 200 KB na kartę |
| Koszt | 0 kredytów, 0 USD (zero narzędzi generatywnych) |
| Determinizm | zero `Date`, zero `Math.random`, zero sieci; bramka: `node scripts/og.mjs --verify` porównuje sha256 regeneracji z plikami w `public/og` |
| Odtworzenie | `cd site && node scripts/og.mjs` (po każdej zmianie tytułów w `pagesSeo.ts` albo nazw i hooków w `tools.ts`); nie wchodzi do `npm run build` |
| Przegląd | bramka `media-asset-review-gate` nie dotyczy: materiał jest w 100% wygenerowany z tokenów i copy repozytorium, bez modelu generatywnego |

## Zrzuty narzędzi (`public/thumbs/*.webp`)

| Pozycja | Wartość |
|---|---|
| Co | 48 plików WebP: 12 działających dem, każde w czterech rozmiarach (1280x800 rama huba i sekcji S3, 640x400 srcset ramy, 480x300 kafel ściany, 320x200 srcset kafla). Nazwa pliku = slug narzędzia + `-v1-<szerokość>` |
| Czym | `site/scripts/shoot-tools.mjs` (Node 24) + WebKit z cache Playwrighta (`webkit-2248`, `playwright-core` 1.58 ze scratchpada, nigdy `npx`) + `sharp` 0.35.4 do konwersji; strony serwowane z `dist` własnym serwerem `node:http` na 127.0.0.1:8772, bez SPA-fallbacku |
| Kiedy | 2026-09-12, faza F1 przebudowy v2 |
| Parametry | viewport 1440 px szerokości (wysokość dobierana do kadru, maks. 1800), `deviceScaleFactor: 2`, `colorScheme: dark`, `reducedMotion: reduce`, `locale: pl-PL`, `timezoneId: Europe/Warsaw`, `hasTouch: false`; kadr liczony z pudełek konkretnych elementów sceny i dopełniany do 16:10 wewnątrz pudełka dashboardu; drabinka jakości WebP 82 → 58, limity 38 / 16 / 12 / 8 KB |
| Treść | wyłącznie dane demo z repozytorium (fikcyjne firmy, kwoty i daty), motyw ciemny, język PL. Zero zdjęć, zero twarzy, zero materiału zewnętrznego, zero AI |
| Sceny | jedna scena na pozycję, dobrana pod RÓŻNY typ obrazu (wykres, kafle hal, macierz statusów, chip PASS z linią dowodu sumy, Gantt, rozpiska alokacji, macierz planu 14 dni, arkusz SOV z suwakami, paski budżetu z ETC, tabela klasyfikacji ze słownikiem, dokument A4, rejestr z paskiem akcji); opis kadru per slug w `public/thumbs/SHOTS.json` |
| Rozmiary | razem 642.4 KB w `public/thumbs` (52 pliki łącznie z kadrem hero: 796.6 KB); największa rama 37.1 KB, największy kafel 9.5 KB (oba `billing-us-g703`) |
| Koszt | 0 kredytów, 0 USD |
| Determinizm | `Date` i `Date.now` zamrożone na 2026-07-22T09:00:00.000Z, `Math.random` = mulberry32(0xC10A12), `localStorage` czyszczony, język ustawiany przed pierwszą farbą; zrzut dopiero po `[data-dashboard][data-ready="true"]`, zniknięciu `.skel`, `document.fonts.ready` i zatrzymaniu wszystkich animacji (`getAnimations`), nigdy po `setTimeout`. Weryfikacja: drugi pełny przebieg `node scripts/shoot-tools.mjs --verify` dał 52/52 zgodnych sum sha256 |
| Odtworzenie | `cd site && npm run build && KLAROW_TOOLS=<katalog z node_modules/{playwright-core,sharp}> node scripts/shoot-tools.mjs`; `--contact-sheet` robi arkusz 4x4 do przeglądu, `--only <slug>` dopisuje pojedynczą pozycję. Nie wchodzi do `npm run build` (CI nie ma przeglądarki) |
| Przegląd | bramka skrócona dla zrzutów z `shoot-tools.mjs` (`media-asset-review-gate` §Wyjątki): pozycje 4, 5, 10 plus brak marki firmy źródłowej w DOM |

### Przegląd skrócony: 12 zrzutów narzędzi (2026-09-12, agent F1, do potwierdzenia przez Karola)

| # | wynik | dowód |
|---|---|---|
| 4 | TAK | paleta z tokenów kitu z automatu (zrzut ekranu aplikacji, nie generacja); zero barw spoza `tokens.css`, zero złota |
| 5 | TAK | obrazy są ilustracją, nie treścią: nazwa narzędzia i opis stoją obok w DOM (sekcja S3 i hub), `alt=""` |
| 10 | TAK | 48 plików, limity 38 / 16 / 12 / 8 KB dotrzymane bez wyjątku; największy 37.1 KB |
| marka | TAK | wzorzec marki firmy źródłowej sprawdzany na pełnym DOM przed każdym zrzutem (brak wzorca = twardy błąd skryptu, nie ciche pominięcie); 13 z 13 przebiegów czyste |
WYNIK: PASS 4/4 (bramka skrócona) → public/thumbs/*.webp

## Kadr hero: kandydat statyczny (`public/media/hero-production-still-v1-*.webp`)

| Pozycja | Wartość |
|---|---|
| Co | 4 pliki WebP z pulpitu produkcji w scenie hero (pas KPI z suwakiem tygodnia + pełna siatka kafli hal): 1920x1080 (60.2 KB), 960x540 (24.7 KB), 1600x1000 (49.8 KB), 800x500 (19.6 KB) |
| Czym | ten sam przebieg `shoot-tools.mjs`, scena `hero-kafle-i-suwak`, dwa zestawy proporcji z jednego zrzutu okna |
| Kiedy | 2026-09-12, faza F1 |
| Po co dwa zestawy proporcji | zadanie F1 prosi o 16:9 (1920/960), a `perf-images-policy` i plan §3 S1 mówią o 16:10 (1600/800). Obie pary leżą obok siebie, wybór należy do okna, które składa hero |
| Status | KANDYDAT, nie finalny poster. Plan §3 S1 wymaga, żeby poster LCP był KLATKĄ ZERO nagrania `hero-production-v1.webm` (dwa przebiegi renderowania dają inny antyaliasing, więc crossfade z osobnego zrzutu byłby widocznym przeskokiem). Dlatego nazwa ma człon `still` i nie zajmuje nazwy postera z nagrania |
| Zastosowanie | wariant B hero (bez wideo, plan §7.1) oraz materiał porównawczy do PSNR klatki 0 w bramce `media-poster-first-frame` |
| Limity | 1920: 60.2 KB przy limicie 110 KB; 960: 24.7 KB przy limicie 55 KB |
| Koszt | 0 kredytów, 0 USD |
WYNIK: PASS 4/4 (bramka skrócona) → public/media/hero-production-still-v1-*.webp

## Nagrania narzędzi (`public/media/hero-production-v1.*`, `public/media/tools/*-v1.webm`)

| Pozycja | Wartość |
|---|---|
| Co | 5 nagrań prawdziwych dem: N1 hero (pulpit produkcji przelicza tydzień, 1600x1000, 8 s, jedno odtworzenie, WebM VP9 + MP4 H.264 + poster WebP 1600 i 800 px) oraz N2–N5, klipy najazdu pierwszego rzędu ściany S3 (960x600, 6 s, zapętlone, WebM VP9 + poster WebP 480 px): raport zarządczy, audyt jakości danych, import z rekoncyliacją, oś czasu zadań |
| Czym | `site/scripts/record-demos.mjs` (Node 24, zero zależności repo) + Chromium z cache Playwrighta (`chromium-1228`, `playwright-core` ze scratchpada przez `PW_CORE`, nigdy `npx`) + ffmpeg 9.0.1 full build (`winget install Gyan.FFmpeg`); strony serwowane z `dist` własnym serwerem `node:http` na 127.0.0.1:8771, bez SPA-fallbacku |
| Kiedy | 2026-09-12, faza F1 przebudowy v2 |
| Dlaczego Chromium, a nie WebKit | `recordVideo` jest na WebKicie w tym cache niestabilne; zrzuty statyczne zostają na WebKicie (`shoot-tools.mjs`), więc oba silniki są rozdzielone po typie materiału, nie po scenie |
| Parametry nagrania | viewport = rozmiar wyjściowy plus 32 px paska „klapsa” (wycinanego z kadru), `deviceScaleFactor: 1` (`recordVideo` i tak ignoruje skalę), `colorScheme: dark`, `locale: pl-PL`, `timezoneId: Europe/Warsaw`, `hasTouch: false`, `reducedMotion: no-preference` (treścią nagrania są własne reveale dashboardu) |
| Parametry pliku | VP9: `-b:v 0 -crf 20` (hero) i `-crf 24` (klipy, import 26), `-row-mt 1 -deadline good -cpu-used 2 -g 192 -pix_fmt yuv420p -an`, stałe 24 fps CFR z klatek PNG; H.264: `profile high, level 4.1, preset slow, tune film, crf 18, +faststart, -an`; postery: `libwebp -quality 92` (hero 92), wyciągane z GOTOWEGO pliku wideo przez `-frames:v 1` bez `-ss` |
| Treść | wyłącznie dane demo z repozytorium (fikcyjne firmy, kwoty i daty), motyw ciemny, język PL. Zero zdjęć, zero twarzy, zero materiału zewnętrznego, zero AI, zero marki firmy źródłowej |
| Sceny | N1: rozbicie na etapy otwarte przed ujęciem, potem suwak tygodnia T35 do T36 (KPI, sześć kafli i rozbicie przeliczają się na żywo, dwa kafle wchodzą na status „Obserwuj”), na końcu klik w kafel „Biurowiec Łódź” i jego rozbicie z czerwonym etapem montażu. N2: pusty stan, klik „Załaduj przykładowe dane”, trzy KPI i wykres per etap. N3: pusty stan, klik „Załaduj przykład”, werdykt „WYKRYTO BŁĘDY”, macierz OK/UWAGA/BŁĄD i lista naruszeń. N4: intro, klik „Uruchom import (TEST)”, chip PASS, sumy przed i po oraz pełny diff z wierszem sumy. N5: stalowa linia wybranej daty przejeżdża 38 dni w przód i wraca na „Dziś”, przez ogony obsuwy z etykietami dryfu |
| Rozmiary | hero WebM 340 581 B (limit 1 258 291), hero MP4 350 567 B (limit 1 468 006), poster hero 64 546 B (limit 112 640), poster mobile 25 100 B (limit 56 320); klipy: raport 184 478 B, audyt 318 918 B, import 309 622 B, oś czasu 108 283 B, każdy przy limicie 327 680 B, suma 921 301 B przy limicie 1 331 200 B na trasę; postery klipów 4 846–9 910 B przy limicie 30 720 B |
| Parametry zmierzone | wszystkie pliki: VP9, `yuv420p`, `r_frame_rate 24/1`, zero strumieni audio; hero 192 klatki i 8,000 s, klipy po 144 klatki i 6,000 s |
| Poster = klatka zero | PSNR postera wobec klatki 0 gotowego pliku: hero 52,59 dB, raport 48,31 dB, audyt 47,10 dB, import 47,72 dB, oś czasu 46,91 dB (próg reguły 45 dB). Sumy sha256 postera i klatki 0 różnią się i różnić się muszą: poster to stratny WebP z tej samej klatki, więc bramką jest PSNR, nie hash |
| Zapętlenie | klipy domykane filtrem wtapiającym głowę w ogon (0,4 s), scena N5 dodatkowo wraca stanem do punktu wyjścia; PSNR klatki 0 wobec ostatniej: raport 46,65 dB, audyt 49,64 dB, import 47,65 dB, oś czasu 52,67 dB (próg 45 dB). Nagranie hero nie jest zapętlane |
| Koszt | 0 kredytów, 0 USD (zero narzędzi generatywnych) |
| Determinizm | w kontekście strony: `Date` i `Date.now` zamrożone na 2026-07-22T09:00:00.000Z, `Math.random` = mulberry32(0xC10A12), `localStorage` i `sessionStorage` czyszczone przed kodem aplikacji; ujęcie startuje dopiero po `[data-dashboard][data-ready="true"]`, zniknięciu `.skel` i `document.fonts.status === "loaded"`, nigdy po samym `setTimeout`; początek ujęcia wyznacza treść (pasek klapsa gaszony w czerń, wykrywany przez `blackdetect`), nie zegar. Animowane tło WebGL jest na czas nagrania wygaszone, bo jest sterowane zegarem |
| Powtarzalność zmierzona | drugi pełny przebieg: czas trwania, liczba klatek, fps i brak audio identyczne; rozmiary plików w granicach od −5% do +27%; PSNR nowego nagrania wobec opublikowanego 42,6–45,7 dB (minimum klatkowe 25,5–36,4 dB na klatkach przejścia). `framesSha256` NIE jest powtarzalny i być nie może: kontener Playwrighta jest stratny (VP8), więc klatki PNG z dwóch przebiegów zawsze różnią się szumem dekodera. Dlatego `--verify` porównuje PSNR wobec opublikowanego pliku (próg 38 dB), a `framesSha256` w `CLIPS.json` dokumentuje konkretny przebieg |
| Odtworzenie | `cd site && npm run build && PW_CORE=<katalog node_modules/playwright-core poza ścieżką ze znakiem &> node scripts/record-demos.mjs`; `--only <slug>` dokłada pojedynczą pozycję, `--verify` powtarza nagranie bez zapisu, `--contact-sheet` robi arkusz stop-klatek do przeglądu. Nie wchodzi do `npm run build` (CI nie ma przeglądarki ani ffmpeg) |
| Przegląd | bramka skrócona jak dla zrzutów z `shoot-tools.mjs` (`media-asset-review-gate` §Wyjątki): materiał jest nagraniem ekranu własnej aplikacji na danych fikcyjnych, nie generacją |

### Przegląd skrócony: 5 nagrań (2026-09-12, agent F1, do potwierdzenia przez Karola)

| # | wynik | dowód |
|---|---|---|
| 4 | TAK | paleta wprost z tokenów kitu (nagranie ekranu aplikacji, nie generacja); zero barw spoza `tokens.css`, zero złota |
| 5 | TAK | nagranie jest dowodem, nie ozdobą: pokazuje przeliczenie, werdykt i dowód sumy; treść tekstowa stoi w DOM obok kadru |
| 10 | TAK | wszystkie limity `media-video-budgets` dotrzymane z zapasem; największy plik to 27% swojego limitu |
| marka | TAK | dane w kadrze pochodzą z repozytorium i są fikcyjne; zero nazwy firmy źródłowej, zero twarzy, zero logo obcego |
WYNIK: PASS 4/4 (bramka skrócona) → public/media/hero-production-v1.* i public/media/tools/*-v1.webm
