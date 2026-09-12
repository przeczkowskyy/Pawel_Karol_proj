---
id: media-poster-first-frame
title: Poster to pierwsza klatka pętli (identyczna z ostatnią), ten sam plik w <img>, <video poster> i preload
impact: MEDIUM
tags: [media, video, poster, lcp, loop]
source: higgsfield §7 wskazówka (2) · synthesis §2.4.4 (POSTER = pierwsza klatka) · showreel §5.4 · media-asset-review-gate p.8–9
added: 2026-09-12
---

## Zasada

- Pętla generowana ze `start_image = end_image` ma po odcięciu zdublowanej ostatniej klatki właściwość: klatka 0 ≈ klatka N−1 (PSNR ≥ 45 dB).
- Poster (`hero-v<N>.poster.webp`) jest wyekstrahowany z KLATKI 0 pliku finalnego (`-frames:v 1` bez `-ss`), nie z master stilla z generatora obrazów (inne kadrowanie/kolor po ffmpeg) ani z „najładniejszej" klatki ze środka.
- Ten sam plik postera jest użyty w trzech miejscach: `<img>` LCP w `HeroMedia` i w shellu prerenderu, atrybut `poster` na `<video>`, `<link rel="preload" as="image">` w `index.html`. Jedna stała `HERO_POSTER` (`media-headers-versioning`).
- Crossfade `poster → video` (600 ms) startuje po `canplay`; pierwsza klatka wideo == poster, więc przejście jest niewidoczne; `<img>` zostaje pod wideo (fallback przy pauzie/awarii).

## Mechanizm awarii (dlaczego)

- Poster inny niż klatka 0 = widoczny „przeskok" w chwili startu wideo (zmiana światła/kadru), który użytkownik czyta jako błąd ładowania; przy pauzie poza viewportem i powrocie wideo wznawia od bieżącej klatki, ale przy awarii (`setEnabled(false)`) wraca poster: kolejny przeskok.
- Poster z generatora obrazów (PNG 4k) różni się od klatki 0 po `noise`/`crop`/`crf`: inna ziarnistość i kolor po enkodowaniu.
- Trzy różne pliki postera (preload jeden, `<img>` drugi) = zmarnowany preload i podwójny transfer na ścieżce LCP.

## Niepoprawnie

```powershell
ffmpeg -y -ss 00:00:04.200 -i hero_master.mp4 -frames:v 1 hero-v1.poster.webp     # klatka ze środka
```

```tsx
<img src="/media/master-still-v1.webp" />            // inny plik niż poster wideo
<video poster="/media/hero-v1.poster.webp">            // a preload w index.html wskazuje hero-v1.png
```

## Poprawnie

```powershell
ffmpeg -y -i hero_master.mp4 -frames:v 1 -vf "scale=1920:-2" -c:v libwebp -quality 80 hero-v1.poster.webp   # klatka 0 finału
```

```tsx
import { HERO_POSTER, HERO_SOURCES } from "@/data/media";
<img src={HERO_POSTER} alt="" width={1920} height={820} fetchPriority="high" decoding="async" />
<video … poster={HERO_POSTER}>{HERO_SOURCES.map(…)}</video>
```

```html
<!-- index.html (prerender.mjs wstawia w każdy z 19 HTML tę samą stałą) -->
<link rel="preload" as="image" href="/media/hero-v1.poster.webp" fetchpriority="high">
```

## Test

```bash
# klatka 0 vs poster (scratchpad)
ffmpeg -y -i site/public/media/hero-v1.mp4 -vf "select=eq(n\,0)" -frames:v 1 f0.png
ffmpeg -i f0.png -i site/public/media/hero-v1.poster.webp -lavfi psnr -f null - 2>&1 | grep -oE 'average:[0-9.]+'   # ≥ 45
# klatka 0 vs ostatnia
ffmpeg -y -sseof -0.05 -i site/public/media/hero-v1.mp4 -frames:v 1 fl.png
ffmpeg -i f0.png -i fl.png -lavfi psnr -f null - 2>&1 | grep -oE 'average:[0-9.]+'   # ≥ 45
# jeden plik postera w trzech miejscach
P=$(grep -oE '/media/hero-v[0-9]+\.poster\.webp' site/index.html | head -1)
grep -c "$P" site/src/data/media.ts site/dist/index.html     # ≥ 1 każdy; poster w dist/index.html występuje w <link rel=preload> i w <img>
# UWAGA: w buildzie Vite/React atrybuty JSX kompilują się do WŁAŚCIWOŚCI OBIEKTU (`poster:"…"`, `"aria-label":u.close`),
# nie do składni `attr="wartość"` — `grep 'poster="…"' dist/assets/*.js` zawsze da 0 (fałszywy FAIL albo fałszywe „przechodzi").
grep -ohE 'poster:"[^"]+"' site/dist/assets/*.js | sort -u | wc -l   # = 1 (po buildzie jedna wartość)
grep -c "$P" site/dist/assets/*.js | awk -F: '$2 > 0 {n++} END {print n " chunk(ów) z posterem"}'   # ≥ 1
# pewniejsze (Playwright/WebKit ze scratchpadu, po `vite preview`):
#   document.querySelector("video").poster === new URL(document.querySelector(".hero-media img").src).pathname
#   && document.querySelector('link[rel=preload][as=image]').href.endsWith(poster)
```

## Wyjątki

- Hover-klipy (faza 2): poster = zrzut dashboardu (`tools/<slug>-v1-1280.webp`), a klip startuje z tej samej klatki (nagranie `record-demos.mjs` zaczyna od stanu po „Załaduj przykład", identycznego ze zrzutem).
