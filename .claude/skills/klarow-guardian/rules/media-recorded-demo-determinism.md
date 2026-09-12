---
id: media-recorded-demo-determinism
title: Nagrania narzędzi wchodzą do repo wyłącznie jako re-enkod z wyodrębnionych klatek 24 fps CFR; manifest CLIPS.json trzyma hashe klatek, nie kontenera; rozjazd z UI = czerwony build
impact: HIGH
tags: [media, video, determinism, playwright, ffmpeg]
source: docs/plan/strona-v2-plan.md §7.5a i §7.4 M9 (2026-09-12 wieczór, D35/D37) · docs/plan/warstwa-wrazenia.md §9 · perf-images-policy p.5 (determinizm zrzutów) · CLAUDE.md zasada #6 (determinizm jako obietnica produktowa)
added: 2026-09-12
---

## Zasada

Nagrania z `site/scripts/record-demos.mjs` (v1: `hero-production-v<N>.*` plus cztery klipy hover `tools/<slug>-v<N>.webm`) powstają **dwuetapowo** i nigdy nie trafiają do `public/` prosto z Playwrighta:

1. **Nagraj** w kontekście deterministycznym identycznym ze `shoot-tools.mjs` (zamrożony `Date` na `2026-07-22T09:00:00.000Z`, `Math.random` = `mulberry32(0xC10A12)`, `localStorage.clear()`, `colorScheme: "dark"`, `locale: "pl-PL"`, `timezoneId: "Europe/Warsaw"`, `hasTouch: false`, `addStyleTag` gaszący karetkę, scrollbar i pierścień fokusu), z jedną różnicą: **`reducedMotion: "no-preference"`**, bo treścią nagrania są własne reveale dashboardu.
2. **Wyodrębnij klatki** (`ffmpeg -vf fps=24` → PNG), policz `sha256` każdej klatki, zapisz **digest listy klatek** do manifestu.
3. **Re-enkoduj z klatek** na stałych 24 fps CFR (VP9 plus H.264 dla hero). Do repo wchodzi wyłącznie ten plik.

**Manifest `site/media/CLIPS.json`** (commitowany, stabilny JSON: klucze posortowane, wcięcie 2, **bez dat**, tak jak `SHOTS.json`): po jednym wpisie na nagranie z polami `file`, `slug`, `scene`, `w`, `h`, `fps`, `durationMs`, `bytes`, `crf`, `framesSha256` (digest listy hashy klatek), `posterPsnrDb`, `engine`.

**Bramka `check:clips`** w `npm run check` (lokalnie, nie na CI: CI nie ma przeglądarki):
- `--verify` powtarza nagranie i potok klatkowy i porównuje `framesSha256`: **różnica = wyjście 1 z nazwą sluga**,
- zawsze, także bez przeglądarki: `bytes` w budżecie (`media-video-budgets`), `durationMs` w tolerancji ±200 ms, `fps` = 24, 0 strumieni audio, **PSNR klatki 0 wobec zrzutu tego samego narzędzia ≥ 45 dB** (po przeskalowaniu obu do wspólnego rozmiaru: nagranie powstaje w skali 1×, zrzut w 2×).

**Scenariusze wyłącznie na rolach i widocznym tekście** (`getByRole`, `getByText`): `components/dashboards/**` i `DemoReport.tsx` są w v1 zamrożone (`strona-v2-plan.md` §12.1), więc **nie wolno dokładać w nich `data-shot`**. Dozwolone są tylko `data-dashboard` i `data-ready` z `DashboardMount`. Scenariusz cytuje etykietę i numer linii źródła w komentarzu; **brak trafienia = twardy błąd z nazwą sluga, nigdy puste nagranie**.

**ffmpeg**: wymagana pełna instalacja (`winget install Gyan.FFmpeg`). Build `ffmpeg-1011` dostarczany z Playwrightem ma wyłącznie `libvpx_vp8` (bez VP9, x264, WebP i AV1) i nie nadaje się do produkcji plików. **Build strony nigdy nie woła ffmpeg**: do gita wchodzą gotowe pliki, więc brak ffmpeg u kogokolwiek nie psuje `npm run build` ani CI. Wersja ffmpeg i pełne komendy idą do wpisu w `site/media/SOURCES.md`.

## Mechanizm awarii (dlaczego)

- **Kontener z `recordVideo` nie jest bajtowo powtarzalny**: timing klatek VP8 zależy od obciążenia maszyny, więc bramka licząca `sha256` pliku byłaby czerwona losowo i po tygodniu ktoś by ją wyłączył. Klatki PNG są powtarzalne, bo pochodzą z deterministycznego renderu; dopiero one są przedmiotem porównania.
- Bez re-enkodu z klatek plik ma zmienną klatkę (VFR), co psuje zapętlenie klipów hover (skok na spawie) i utrudnia trafienie w budżet.
- **Nagranie rozjeżdża się z UI dokładnie tak samo jak zrzut** (R18): po zmianie dashboardu strona zaczyna pokazywać ruch, którego już nie ma w produkcie. Różnica jest taka, że w nagraniu widać to później niż w zrzucie, bo nikt nie ogląda ośmiu sekund przy każdym buildzie.
- Determinizm dem jest w tym projekcie **obietnicą produktową** („kalkulator, nie wróżka", CLAUDE.md zasada #6): materiał marketingowy, który przy dwóch przebiegach pokazuje inne liczby, podważa dokładnie to zdanie, które sprzedajemy.
- `reducedMotion: "reduce"` w kontekście nagrania daje klip bez ruchu interfejsu, czyli nagranie, w którym „nic się nie dzieje" mimo poprawnych danych.

## Niepoprawnie

```js
// plik prosto z Playwrighta do public/ (VP8, VFR, rozmiar zależny od maszyny)
const raw = await page.video().path();
fs.copyFileSync(raw, "public/media/tools/kontroling-kosztow-v1.webm");
```

```js
// bramka na hashu kontenera: czerwona losowo
if (sha256(fs.readFileSync(out)) !== manifest.sha256) throw new Error("rozjazd");
```

```js
// selektor po klasie CSS zamiast po roli i tekście: milczący FAIL po zmianie kitu
await page.locator(".etc-input").fill("180000");
```

## Poprawnie

```js
// 1) nagraj  2) klatki + hash  3) re-enkod z klatek (24 fps CFR)
await scene.steps(page);
await context.close();                                  // dopiero teraz plik jest kompletny
const raw = await page.video().path();

run(`ffmpeg -y -i "${raw}" -vf fps=24 "${FRAMES}/f_%04d.png"`);
const framesSha256 = sha256(fs.readdirSync(FRAMES).sort().map((f) => sha256(fs.readFileSync(path.join(FRAMES, f)))).join("\n"));

run(`ffmpeg -y -framerate 24 -i "${FRAMES}/f_%04d.png" -r 24 -an -c:v libvpx-vp9 -b:v 0 -crf ${crf} ` +
    `-row-mt 1 -deadline good -cpu-used 2 -g 192 -pix_fmt yuv420p "${out}"`);

// scena: wyłącznie role i widoczny tekst (CostControl.tsx: „Zatwierdź tydzień")
await p.getByRole("spinbutton").first().fill("180000");
await p.getByRole("button", { name: /Zatwierdź tydzień/i }).hover();
```

```json
// site/media/CLIPS.json (fragment; bez dat, klucze posortowane)
{ "tools/kontroling-kosztow-v1.webm": { "slug": "kontroling-kosztow", "scene": "etc-eac-marza",
  "w": 960, "h": 600, "fps": 24, "durationMs": 6500, "bytes": 298112, "crf": 36,
  "framesSha256": "…", "posterPsnrDb": 47.1, "engine": "webkit-2311" } }
```

## Test

```bash
# manifest istnieje, nie ma w nim dat i pokrywa każdy plik wideo z public/media
[ -f site/media/CLIPS.json ] || echo "BRAK CLIPS.json"
grep -nE '"(date|generatedAt|createdAt)"' site/media/CLIPS.json   # = 0 (data zmieniałaby plik przy każdym przebiegu)
for f in site/public/media/tools/*.webm site/public/media/hero-production-v*.webm; do
  [ -f "$f" ] || continue; b=$(basename "$f"); grep -q "$b" site/media/CLIPS.json || echo "BRAK wpisu dla $b"; done
# parametry pliku: 24 fps CFR, zero audio
ffprobe -v error -show_entries stream=codec_type,r_frame_rate,nb_frames -of default=nw=1 site/public/media/hero-production-v1.webm
ffprobe -v error -select_streams a -show_entries stream=codec_type -of csv=p=0 site/public/media/hero-production-v1.webm | wc -l   # = 0
# pełna bramka (lokalnie, wymaga WebKita i ffmpeg): dwa przebiegi = identyczny framesSha256
cd site && node scripts/record-demos.mjs --verify && echo OK
# klatka 0 zgadza się ze zrzutem tego samego narzędzia (≥ 45 dB)
ffmpeg -y -i site/public/media/tools/kontroling-kosztow-v1.webm -frames:v 1 c0.png
ffmpeg -i c0.png -i site/public/media/tools/kontroling-kosztow-v1-1280.webp -lavfi "scale=960:600,psnr" -f null - 2>&1 | grep -oE 'average:[0-9.]+'
# scenariusze bez data-shot w plikach zamrożonych (oczekiwane: 0)
grep -rnE 'data-shot' site/src/components/dashboards site/src/components/DemoReport.tsx
```

Docelowo `npm run check` krok `check:clips` (lokalny, obok `check:shots`).

## Wyjątki

- Brak. Jeśli nagranie nie da się odtworzyć dwa razy z tym samym `framesSha256`, wchodzi wariant bez nagrania (statyczny kadr produktu, `strona-v2-plan.md` §7.1 wariant B), a nie „nagranie bez bramki".
