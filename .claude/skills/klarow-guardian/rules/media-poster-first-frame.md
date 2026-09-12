---
id: media-poster-first-frame
title: Poster to klatka 0 pliku wideo (przy pętli także identyczna z ostatnią), wyciągana z gotowego wideo, ten sam plik w <img>, <video poster> i preload
impact: MEDIUM
tags: [media, video, poster, lcp, loop]
source: higgsfield §7 wskazówka (2) · synthesis §2.4.4 (POSTER = pierwsza klatka) · showreel §5.4 · media-asset-review-gate p.8–9
added: 2026-09-12
---

## Zasada

Dwa przypadki, jedna zasada („poster = klatka 0 gotowego pliku wideo"):

1. **Jedno odtworzenie (v1, hero: nagranie narzędzia).** Poster = klatka 0, plik kończy się na ostatniej klatce i tam zostaje. Klatka N−1 **nie musi** być równa klatce 0; wymóg PSNR dotyczy wyłącznie pary poster/klatka 0.
2. **Pętla (klipy hover ściany, ewentualna pętla generatywna w wariancie D37(b)).** Dodatkowo klatka 0 ≈ klatka N−1 (PSNR ≥ 45 dB), inaczej spaw widać co obrót.

- Poster hero (`hero-production-v<N>.webp`) jest **wyciągany z gotowego pliku wideo** (`ffmpeg -frames:v 1` bez `-ss`), **nigdy nie jest robiony osobnym screenshotem** i nigdy nie pochodzi z master stilla generatora. Powód jest mechaniczny: dwa różne przebiegi renderowania (screenshot Playwright 2× i nagranie 1× po VP9) dają inny antyaliasing i inny kolor, więc crossfade pokazuje przeskok. Ten sam plik jest **kadrem produktu i elementem LCP** (`perf-lcp-poster-preload`).
- Ten sam plik postera jest użyty w trzech miejscach: `<img>` LCP w `HeroMedia` i w shellu prerenderu, atrybut `poster` na `<video>`, `<link rel="preload" as="image">` w `index.html`. Jedna stała `HERO_POSTER` (`media-headers-versioning`). **Osobnego „postera pętli" w v1 nie ma**; gdyby wrócił wariant D37(b), poster pętli jest odrębnym plikiem, który **nigdy nie jest preloadowany** i nie stoi w shellu (inaczej staje się kandydatem LCP).
- Poster klipu hover = zrzut tego samego narzędzia w rozmiarze kafla (`tools/<slug>-v<N>-1280.webp` skalowany do 480×300); klip musi zaczynać się dokładnie od tego stanu (PSNR ≥ 45 dB po przeskalowaniu obu do 960×600: nagranie powstaje w skali 1×, zrzut w 2×).
- Crossfade `poster → video` (600 ms) startuje po `canplay`; pierwsza klatka wideo == poster, więc przejście jest niewidoczne; `<img>` zostaje pod wideo (fallback przy pauzie, awarii i po zakończeniu nagrania).

## Mechanizm awarii (dlaczego)

- Poster inny niż klatka 0 = widoczny „przeskok" w chwili startu wideo (zmiana światła/kadru), który użytkownik czyta jako błąd ładowania; przy pauzie poza viewportem i powrocie wideo wznawia od bieżącej klatki, ale przy awarii (`setEnabled(false)`) wraca poster: kolejny przeskok.
- Poster z generatora obrazów (PNG 4k) różni się od klatki 0 po `noise`/`crop`/`crf`: inna ziarnistość i kolor po enkodowaniu.
- Trzy różne pliki postera (preload jeden, `<img>` drugi) = zmarnowany preload i podwójny transfer na ścieżce LCP.

## Niepoprawnie

```powershell
ffmpeg -y -ss 00:00:04.200 -i hero_master.mp4 -frames:v 1 hero-v1.poster.webp     # klatka ze środka
```

```js
// shoot-tools.mjs robi osobny screenshot hero, a record-demos.mjs osobne nagranie:
// dwa przebiegi renderowania = inny antyaliasing = widoczny przeskok przy crossfade
await page.locator("[data-dashboard]").screenshot({ path: "public/media/hero-production-v1.webp" });
```

```tsx
<img src="/media/master-still-v1.webp" />            // inny plik niż poster wideo
<video poster="/media/hero-v1.poster.webp">            // a preload w index.html wskazuje hero-v1.png
```

## Poprawnie

```powershell
ffmpeg -y -i hero-production-v1.webm -frames:v 1 -c:v libwebp -quality 80 hero-production-v1.webp   # klatka 0 gotowego pliku = kadr produktu = LCP
```

```tsx
import { HERO_POSTER, HERO_SOURCES } from "@/data/media";
<img className="hero-shot" src={HERO_POSTER} alt="Pulpit produkcji: kafle hal i suwak tygodnia, dane przykładowe"
     width={1600} height={1000} fetchPriority="high" decoding="async" />
<video … poster={HERO_POSTER}>{HERO_SOURCES.map(…)}</video>   {/* bez `loop`: nagranie hero gra raz */}
```

```html
<!-- index.html (prerender.mjs wstawia w każdy z 19 HTML tę samą stałą) -->
<link rel="preload" as="image" href="/media/hero-production-v1.webp" fetchpriority="high">
```

## Test

```bash
# klatka 0 vs poster (scratchpad)
ffmpeg -y -i site/public/media/hero-production-v1.webm -vf "select=eq(n\,0)" -frames:v 1 f0.png
ffmpeg -i f0.png -i site/public/media/hero-production-v1.webp -lavfi psnr -f null - 2>&1 | grep -oE 'average:[0-9.]+'   # ≥ 45
# klatka 0 vs ostatnia: TYLKO dla plików zapętlonych (klipy hover, ewentualna pętla D37(b)).
# Dla nagrania hero (jedno odtworzenie, bez `loop`) ten test NIE obowiązuje.
ffmpeg -y -sseof -0.05 -i site/public/media/tools/kontroling-kosztow-v1.webm -frames:v 1 fl.png
ffmpeg -i f0.png -i fl.png -lavfi psnr -f null - 2>&1 | grep -oE 'average:[0-9.]+'   # ≥ 45
# jeden plik postera w trzech miejscach
P=$(grep -oE '/media/hero-production-v[0-9]+\.webp' site/index.html | head -1)
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

- Klipy hover (v1): poster = zrzut dashboardu (`tools/<slug>-v1-1280.webp`), a klip startuje z tej samej klatki (nagranie `record-demos.mjs` zaczyna od stanu po „Załaduj przykład", identycznego ze zrzutem). PSNR liczony po przeskalowaniu obu do 960×600.
