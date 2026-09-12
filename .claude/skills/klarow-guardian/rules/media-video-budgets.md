---
id: media-video-budgets
title: Budżety wideo: ≤ 1,5 MB na format, poster ≤ 60 KB WebP, pętla 6–10 s, 24 fps, bez audio, LQIP ≤ 2 KB
impact: HIGH
tags: [media, video, budget, performance, lcp]
source: higgsfield §4.4 (pipeline ffmpeg, bramka rozmiaru) · synthesis §2.4.9/§2.6.1 · showreel §5.9 · feasibility-perf §9 p.5
added: 2026-09-12
---

## Zasada

Każdy plik w `site/public/media/` spełnia:

| Plik | Limit | Parametry |
|---|---|---|
| `hero-v<N>.webm` (VP9) | ≤ 1 572 864 B (1,5 MB) | 1920×820, 24 fps CFR, `-an`, `yuv420p`, GOP 240, `crf` dobrany do limitu |
| `hero-v<N>.mp4` (H.264) | ≤ 1 572 864 B | `profile high`, `level 4.1`, `+faststart`, `-an`, `yuv420p` |
| `hero-v<N>.av1.mp4` (opcjonalny) | ≤ 1 572 864 B | `libsvtav1`, `+faststart`, `-an` |
| `hero-v<N>.poster.webp` | ≤ 61 440 B (60 KB) | 1920×820, q ≈ 80, PIERWSZA klatka pętli |
| `hero-v<N>.lqip.webp` (opcjonalny) | ≤ 2 048 B | 48 px szerokości |
| hover-klipy `tools/<slug>-v<N>.webm` (faza 2) | ≤ 614 400 B (600 KB) | 1280×800, 6 s, 24 fps, `-an`, `preload="none"` |
| zrzuty dem `tools/<slug>-1280.webp` | ≤ 122 880 B (120 KB) | 1280×800, q 80 (patrz `perf-images-policy`) |
| miniatury `thumbs/<slug>-640.webp` | ≤ 40 960 B (40 KB) | 640×400 |

Długość pętli hero: 6–10 s (Kling 3.0 `duration 8–10`; po odcięciu zdublowanej klatki). Zawsze stałe 24 fps (`-r 24`), zawsze bez ścieżki audio, zawsze dithering `noise=alls=3:allf=t+u` na ciemnych gradientach (anty-banding na OLED). Transfer `/` desktop z wideo ≤ 2,5 MB; mobile (bez wideo) ≤ 350 KB.

Bramka: `scripts/verify-site.mjs` krok `media-video-budgets` liczy rozmiary w `dist/media` i `dist/thumbs` i porównuje z tabelą; przekroczenie = fail buildu.

## Mechanizm awarii (dlaczego)

- 1,5 MB na 4G (≈ 5–8 Mb/s realnie) to 2–3 s pobierania po `window.load`; większy plik opóźnia crossfade poza „pierwsze wrażenie" i zjada budżet transferu 2,5 MB.
- Poster jest LCP: 60 KB WebP ładuje się w < 200 ms na 4G; JPG 300 KB przesuwa LCP mobile poza 2,5 s (Lighthouse mobile ≥ 90 nie przejdzie).
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
ffmpeg -y -i src.mp4 -r 24 -an -vf "noise=alls=3:allf=t+u" -c:v libx264 -crf 14 -pix_fmt yuv420p cfr.mp4
ffmpeg -y -i cfr.mp4 -vf "trim=end_frame=N-1,setpts=PTS-STARTPTS" -c:v libx264 -crf 14 loop.mp4        # N z ffprobe -count_frames
ffmpeg -y -i loop.mp4 -vf "scale=1920:-2:flags=lanczos,crop=1920:820" -c:v libx264 -crf 14 hero_master.mp4
ffmpeg -y -i hero_master.mp4 -c:v libvpx-vp9 -b:v 0 -crf 33 -row-mt 1 -deadline good -cpu-used 2 -g 240 -pix_fmt yuv420p -an hero-v1.webm
ffmpeg -y -i hero_master.mp4 -c:v libx264 -profile:v high -level 4.1 -preset slow -tune film -crf 24 -g 240 -pix_fmt yuv420p -an -movflags +faststart hero-v1.mp4
ffmpeg -y -i hero_master.mp4 -frames:v 1 -vf "scale=1920:-2" -c:v libwebp -quality 80 hero-v1.poster.webp
ffmpeg -y -i hero_master.mp4 -frames:v 1 -vf "scale=48:-2" -c:v libwebp -quality 50 hero-v1.lqip.webp
Get-ChildItem hero-v1.* | Select-Object Name, Length      # bramka ręczna przed kopiowaniem do site/public/media
```

## Test

```bash
# rozmiary (Git Bash; oczekiwane: brak wierszy „PRZEKROCZENIE")
cd site/public/media 2>/dev/null && for f in *.webm *.mp4; do [ -f "$f" ] && [ $(stat -c%s "$f") -gt 1572864 ] && echo "PRZEKROCZENIE $f"; done
for f in *.poster.webp; do [ -f "$f" ] && [ $(stat -c%s "$f") -gt 61440 ] && echo "PRZEKROCZENIE $f"; done
for f in *.lqip.webp; do [ -f "$f" ] && [ $(stat -c%s "$f") -gt 2048 ] && echo "PRZEKROCZENIE $f"; done
# parametry (ffprobe ze scratchpadu)
ffprobe -v error -show_entries stream=codec_type,width,height,r_frame_rate,pix_fmt:format=duration -of default=nw=1 hero-v1.mp4
#   oczekiwane: 1 strumień video (0 audio), 1920×820, 24/1, yuv420p, duration 6–10
# transfer strony (Lighthouse desktop na dist przez `node node_modules/vite/bin/vite.js preview`): Total byte weight ≤ 2,5 MB z wideo; mobile ≤ 350 KB
```

Docelowo `scripts/verify-site.mjs` krok `media-video-budgets` (rozmiary) + Lighthouse w fazie 4.

## Wyjątki

- AV1 jest opcjonalny; brak pliku `.av1.mp4` nie jest błędem. Jeśli jest, obowiązuje ten sam limit.
- Portrety founderów (`public/media/founders/*.webp` ≤ 90 KB przy 960×1200) i OG (`≤ 200 KB`) mają osobne limity w `perf-images-policy`.
