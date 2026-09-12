---
id: media-video-budgets
title: Budżety wideo: nagranie hero ≤ 1,2 MB WebM / ≤ 1,4 MB H.264, klip hover ≤ 320 KB, poster = kadr produktu ≤ 110 KB, 6–10 s, 24 fps CFR, bez audio
impact: HIGH
tags: [media, video, budget, performance, lcp]
source: higgsfield §4.4 (pipeline ffmpeg, bramka rozmiaru) · synthesis §2.4.9/§2.6.1 · showreel §5.9 · feasibility-perf §9 p.5 · docs/plan/strona-v2-plan.md §6.7 i §7 (2026-09-12 wieczór, D37) · docs/plan/warstwa-wrazenia.md §5
added: 2026-09-12
---

## Zasada

Każdy plik w `site/public/media/` spełnia:

| Plik | Limit | Parametry |
|---|---|---|
| `hero-production-v<N>.webm` (VP9): **nagranie narzędzia, niesie tekst UI** | ≤ 1 258 291 B (1,2 MB) | 1600×1000, 8 s, 24 fps CFR, `-an`, `yuv420p`, GOP 192, **bez `loop`** |
| `hero-production-v<N>.mp4` (H.264) | ≤ 1 468 006 B (1,4 MB) | `profile high`, `level 4.1`, `+faststart`, `-an`, `yuv420p` |
| `hero-production-v<N>.av1.mp4` (opcjonalny) | ≤ 943 718 B (0,9 MB) | `libsvtav1`, `+faststart`, `-an` |
| **poster hero** `hero-production-v<N>.webp` (kadr produktu, **element LCP**) | ≤ 112 640 B (110 KB); wariant 800×500 ≤ 56 320 B | 1600×1000, q ≈ 80, **KLATKA 0 pliku wideo**; osobnego „postera pętli" NIE MA |
| `hero-ground-v<N>.webp` (grunt, still Higgsfield) | ≤ 71 680 B (70 KB); wariant 800 px ≤ 30 720 B | `loading="lazy"`, nigdy preload (`perf-images-policy`) |
| `hero-production-v<N>.lqip.webp` (opcjonalny) | ≤ 2 048 B | 48 px szerokości |
| klipy hover `tools/<slug>-v<N>.webm` (**v1, dokładnie 4**) | ≤ 327 680 B (320 KB) | 960×600, 6–7 s, 24 fps, `-an`, `loop`, `preload="none"`; suma na trasie ≤ 1 331 200 B |
| zrzuty dem `tools/<slug>-v<N>-1280.webp` | ≤ 122 880 B (120 KB) | 1280×800, q 80 (patrz `perf-images-policy`) |
| miniatury `thumbs/<slug>-v<N>-640.webp` | ≤ 40 960 B (40 KB) | 640×400 |

Długość: nagranie hero 8 s (dopuszczalne 6–10 s), klip hover 6–7 s. Zawsze stałe 24 fps (`-r 24`), zawsze bez ścieżki audio, zawsze dithering `noise=alls=3:allf=t+u` na ciemnych gradientach (anty-banding na OLED). **Transfer `/` desktop: ≤ 716 800 B (700 KB) do zdarzenia `load`** (bramka przeciw przemyceniu wideo przed LCP) **i ≤ 2 621 440 B (2,5 MB) na pełną wizytę bez klipów hover**; mobile ≤ 358 400 B (350 KB), w tym **0 B** mediów wideo.

**Gdyby wrócił wariant D37(b)** (pętla generatywna jako tekstura pod scrimem `.88` zamiast nagrania): obowiązuje inny zestaw, bo pod scrimem nie widać szczegółu: WebM ≤ 737 280 B, MP4 ≤ 1 003 520 B, AV1 ≤ 573 440 B, kadr 1440×616, plus osobny poster pętli ≤ 46 080 B, który **nigdy nie jest preloadowany**. Zestawów nie wolno mieszać: obowiązuje ten zgodny z wybranym wariantem D37.

Bramka: `scripts/verify-site.mjs` krok `media-video-budgets` liczy rozmiary w `dist/media` i `dist/thumbs` i porównuje z tabelą; przekroczenie = fail buildu.

## Mechanizm awarii (dlaczego)

- 1,2 MB na 4G (≈ 5–8 Mb/s realnie) to 1,5–2 s pobierania po `window.load`; większy plik opóźnia crossfade poza „pierwsze wrażenie" i zjada budżet transferu 2,5 MB.
- Poster jest LCP: 110 KB WebP ładuje się w < 250 ms na 4G; JPG 300 KB przesuwa LCP mobile poza 2,5 s (Lighthouse mobile ≥ 90 nie przejdzie).
- Budżet nagrania hero jest zaostrzony także **od dołu**: poniżej ok. 1 MB VP9 rozkłada cyfry KPI i hairline 1 px (artefakty wokół tekstu), a to jest treść kadru. Gdy plik nie mieści się w 1,2 MB przy `crf 34`, **skracamy scenę albo zawężamy kadr, nigdy nie rozmywamy obrazu**.
- Audio w pliku blokuje autoplay na iOS nawet przy `muted` w niektórych wersjach i dodaje ~100–200 KB.
- 30/60 fps podnoszą rozmiar o 25–100 % bez zysku na „extremely slow motion"; zmienna klatka (VFR z generatorów) psuje pętlę (skok na spawie).
- Banding: 8-bit VP9/H.264 na stalowych gradientach robi pasy widoczne na OLED (iPhone Karola); `noise=3` + niższy CRF w ciemnych scenach to jedyne tanie remedium (higgsfield §8).

## Niepoprawnie

```
public/media/hero.mp4            4 812 331 B   30 fps VFR, AAC audio, 1080p, 14 s
public/media/hero-poster.jpg       318 902 B
```

## Poprawnie

```powershell
# pipeline (scratchpad, bez `&` w ścieżce; ffmpeg z `winget install Gyan.FFmpeg`)
# nagranie narzędzia: klatki PNG z record-demos.mjs -> re-enkod 24 fps CFR (media-recorded-demo-determinism)
ffmpeg -y -framerate 24 -i frames\f_%04d.png -r 24 -an -vf "scale=1600:-2:flags=lanczos,crop=1600:1000" `
  -c:v libvpx-vp9 -b:v 0 -crf 34 -row-mt 1 -deadline good -cpu-used 2 -g 192 -pix_fmt yuv420p hero-production-v1.webm
ffmpeg -y -framerate 24 -i frames\f_%04d.png -r 24 -an -vf "scale=1600:-2:flags=lanczos,crop=1600:1000" `
  -c:v libx264 -profile:v high -level 4.1 -preset slow -tune film -crf 24 -g 192 -pix_fmt yuv420p -movflags +faststart hero-production-v1.mp4
ffmpeg -y -i hero-production-v1.webm -frames:v 1 -c:v libwebp -quality 80 hero-production-v1.webp      # poster = klatka 0 = LCP
ffmpeg -y -i hero-production-v1.webm -frames:v 1 -vf "scale=800:-2" -c:v libwebp -quality 80 hero-production-v1-800.webp
Get-ChildItem hero-production-v1.* | Select-Object Name, Length   # bramka ręczna przed kopiowaniem do site/public/media
```

## Test

```bash
# rozmiary (Git Bash; oczekiwane: brak wierszy „PRZEKROCZENIE")
cd site/public/media 2>/dev/null || exit 0
for f in hero-production-v*.webm; do [ -f "$f" ] && [ $(stat -c%s "$f") -gt 1258291 ] && echo "PRZEKROCZENIE $f"; done
for f in hero-production-v*.mp4;  do [ -f "$f" ] && [ $(stat -c%s "$f") -gt 1468006 ] && echo "PRZEKROCZENIE $f"; done
for f in hero-production-v*.webp; do [ -f "$f" ] && [ $(stat -c%s "$f") -gt 112640 ] && echo "PRZEKROCZENIE $f"; done
for f in hero-ground-v*.webp;     do [ -f "$f" ] && [ $(stat -c%s "$f") -gt 71680 ]  && echo "PRZEKROCZENIE $f"; done
for f in tools/*-v*.webm;         do [ -f "$f" ] && [ $(stat -c%s "$f") -gt 327680 ] && echo "PRZEKROCZENIE $f"; done
for f in *.lqip.webp;             do [ -f "$f" ] && [ $(stat -c%s "$f") -gt 2048 ]   && echo "PRZEKROCZENIE $f"; done
# suma klipów hover na trasie ≤ 1,3 MB (oczekiwane: SUMA OK)
S=$(stat -c%s tools/*-v*.webm 2>/dev/null | awk '{n+=$1} END {print n+0}'); [ "$S" -le 1331200 ] && echo "SUMA OK ($S)" || echo "SUMA PRZEKROCZONA ($S)"
# parametry (ffprobe ze scratchpadu)
ffprobe -v error -show_entries stream=codec_type,width,height,r_frame_rate,pix_fmt:format=duration -of default=nw=1 hero-production-v1.mp4
#   oczekiwane: 1 strumień video (0 audio), 1600×1000, 24/1, yuv420p, duration 6–10
# transfer strony (Lighthouse desktop na dist przez `node node_modules/vite/bin/vite.js preview`):
#   Total byte weight ≤ 2,5 MB z nagraniem hero; do zdarzenia `load` ≤ 700 KB (bramka runtime sumuje content-length przed `load`);
#   mobile ≤ 350 KB i ZERO requestów do /media/*.webm|mp4
```

Docelowo `scripts/verify-site.mjs` krok `media-video-budgets` (rozmiary) + Lighthouse w fazie 4.

## Wyjątki

- AV1 jest opcjonalny; brak pliku `.av1.mp4` nie jest błędem. Jeśli jest, obowiązuje limit z tabeli.
- Klipy hover nie wliczają się do budżetu „pełnej wizyty" (startują wyłącznie z intencji użytkownika), ale mają własny limit sumy 1,3 MB na trasę.
- Portrety founderów (`public/media/founders/*.webp` ≤ 90 KB przy 960×1200) i OG (`≤ 200 KB`) mają osobne limity w `perf-images-policy`.
