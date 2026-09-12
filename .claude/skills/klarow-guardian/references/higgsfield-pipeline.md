# Higgsfield: pipeline assetów dla klarow.com (plan zakupu, modele, prompty, ffmpeg, osadzenie, budżety, przegląd)

> Referencja dla `rules/media-*` i `checklists/new-asset.md`. Źródła: `research/higgsfield.md` (odczyt MCP 2026-09-11, bez generacji), synthesis §2.6, decyzje nadrzędne. Higgsfield jest dostępny w Claude Code przez MCP „creative engine" (logowanie kontem, bez kluczy API). Twarde zasady: do modelu trafiają wyłącznie abstrakcje i własne stille (`rules/media-higgsfield-inputs-policy`); zero marki firmy źródłowej, klientów, twarzy; finały tylko na planie płatnym; generacje usuwane po sprincie; każdy asset przechodzi bramkę `rules/media-asset-review-gate`.

## 1. Zakres v1: co powstaje generatywnie, a co nie

| Powstaje (Higgsfield) | NIE powstaje generatywnie |
|---|---|
| G1 board stylu (10 stilli) · G2 master still hero · **G3 hero-loop 8–10 s (jedyne wideo w serwisie)** · G4 macro still 4:5 (S7) · G5 tło OG · G6 deflicker/upscale finału (tylko gdy banding) | przejście „chaos → porządek" (jeśli kiedyś: kodem, deterministycznie) · ikony (lucide) · tła sekcyjne/podstron · pętla mobile 9:16 (mobile = poster) · ludzie, hale, biura · fałszywe UI/arkusze · zrzuty dem (Playwright `shoot-tools.mjs`) · hover-klipy (Playwright `record-demos.mjs`) · OG per trasa (`og.mjs`) · portrety founderów (Photoshop lokalnie) |

Plan B tła: jeśli Karol odrzuci hero-loop po trialu („da się poznać, że to AI"), GLSL Hills (three.js) wraca na desktop po idle (`rules/perf-three-js-policy`), a Higgsfield kończy się na boardzie i OG.

## 2. Plan zakupu (kolejność, koszty, anulowanie)

| Krok | Co | Kredyty / koszt | Warunek przejścia dalej |
|---|---|---|---|
| 1 | **Trial 3-dniowy PLUS przez MCP**: 100 kr, $0 dziś, karta wymagana, auto-odnowienie na PLUS $49/mies.; kredyty widoczne TYLKO w MCP | G1 (10 × 2 = 20) + G2 (3 × 3 ≈ 10) + 2–3 podejścia G3 std 8 s (3 × 14 ≈ 42) ≈ 72 kr | Karol i Paweł oceniają na OLED: „nie da się poznać, że to AI?" (bramka §8); przypomnienie w kalendarzu na dzień 3 |
| 2a | **Odrzucenie**: `cancel_trial_auto_renewal` → `confirm_trial_cancel` w czacie MCP w dniu ≤ 3 | $0 | GLSL Hills plan B; koniec |
| 2b | **Akceptacja**: świadome przejście w **PLUS miesięczny $49** (1 000 kr, 6 równoległych wideo) | patrz tabela „Budżet kredytowy v1" poniżej: **≈ 200–395 kr** (koperta planistyczna 450) łącznie z trialem | po sprincie anulować (kredyty przepadają co miesiąc) |
| 3 | Po sprincie: usunąć generacje z konta (`show_generations` = 0), wpis w `SOURCES.md` | $0 | kończy licencję treningową ToU |

**Dlaczego PLUS, skoro research rekomendował ULTRA:** `research/higgsfield.md` §0 p.3 i §3.2 p.2 rekomendują ULTRA na JEDEN miesiąc ($129, 3 000 kr) — ale dla PEŁNEJ listy assetów (13 pozycji, w tym dwa przejścia Seedance, tła-pętle podstron i mikro-animacje ikon: **≈ 1 300–2 200 kr**, przy czym PLUS 1 000 kr nie domyka się bez top-upów). Zakres v1 został po syntezie ścięty do **1 pętli hero + 3 stilli** (G1/G2 board i master, G4, G5) — to ≈ 200–395 kr, więc PLUS (1 000 kr) starcza z zapasem 2,5×. Jeśli wrócą przejścia „chaos → porządek", tła sekcyjne albo mikro-animacje ikon, wracamy do rekomendacji ULTRA z researchu i przeliczamy budżet od nowa.

Nie kupować (przy zakresie v1): ULTRA ($129; 1 wideo + 3 stille nie potrzebują 3 000 kr), API `cloud.higgsfield.ai` (osobne rozliczenie), planu rocznego (tylko przy decyzji o stałej produkcji treści LinkedIn; bonus „7-day unlimited Kling 3.0" działa web-only, nie z MCP), top-upów bez aktywnej subskrypcji (wygasają po 90 dniach). Konto i faktura: JDG Pawła (D-17). Cennik zmienia się co kilka miesięcy: przed zakupem `show_plans_and_credits` i budżet z zapasem 25 %.

Higiena kredytów: `get_cost: true` przed każdą serią; `sound: off` / `generate_audio: false` ZAWSZE (muted autoplay; audio blokuje autoplay iOS); 480p/720p do selekcji, 1080p/`pro` tylko finał; `generate_video_batch` + `jobs_wait` + jedno `show_generation_by_ids` dla równoległych podejść; **1 finał = 4–8 podejść** (≈ 1 na 4–5 klipów nadaje się do pętli) — ta liczba jest podstawą poniższej tabeli i wzorca wpisu w §9 (6 × std + 2 × pro = 144 kr mieści się w widełkach).

**Budżet kredytowy v1** (jedyne miejsce z arytmetyką; zgodne z „4–8 podejść"):

| Pozycja | Podejścia × koszt | Kredyty |
|---|---|---|
| G1 board stylu (10 stilli) | 10 × 2 | 20 |
| G2 master still 4k + dogrywki | 10 × 2–3 | 20–30 |
| G3 hero-loop — selekcja `std` 8–10 s | **4–8 × 14** | **56–112** |
| G3 hero-loop — finały `pro` | 2 × 30 | 60 |
| G4 macro still 4:5 (S7) | 5 × 2 | 10 |
| G5 tło OG | 5 × 2 | 10 |
| G6 deflicker/upscale (tylko gdy banding) | 0–4 × ~30 | 0–120 |
| **Suma bez rezerwy** | | **176–342** |
| Rezerwa 15 % | | 26–53 |
| **Razem v1** | | **≈ 200–395 kr** |

Do budżetowania przyjmujemy górną kopertę **450 kr** (zaokrąglenie + jedna dogrywka finału). Dostępne: trial 100 kr + PLUS 1 000 kr = 1 100 kr, czyli ≥ 2,4× zapasu. Część G1/G2 i 2–3 podejścia G3 mieszczą się jeszcze w puli trialu (≈ 58–72 kr).

## 3. Modele per zadanie (id w MCP)

| Zadanie | Model | Parametry | Dlaczego |
|---|---|---|---|
| Stille boardu, master still, still S7, tło OG | `nano_banana_pro` | `resolution: 2k` (board) / `4k` (master); `image_references` = zatwierdzony master still (style lock) | ~2 kr/obraz; jedyny realny mechanizm spójności (brak `seed` w MCP) |
| Stille zapas | `seedream_v4_5` (4K), `flux_2_pro_outpaint` (rozszerzenie do 21:9) | | |
| Ikony / glify płaskie (gdyby lucide nie wystarczyło) | `recraft_v4_1` | `model_type: "vector"`, `colors: ["#A8B4C2"]`, `background_color: "#121212"` | jedyny model z kolorami hex; w v1 nieużywany (lucide) |
| Still z alphą (shard/wstęga do CSS) | `gpt_image_2_5` | `background: "transparent"` | w v1 nieużywany |
| **Hero-loop** | **`kling3_0`** | `start_image = end_image = master still`, `duration: 8–10`, `mode: std` (selekcja) → `pro` (2 finały), `sound: off`, AR 16:9 (crop do 1920×820 w ffmpeg) | pętla start=end, tanio (~14 kr/10 s std), 3–15 s |
| Pętla zapas | `kling3_0_turbo` (tylko start_image), `kling2_6` | | eksploracja |
| Pętla długa / 21:9 / 1080p | `seedance_2_5` | 4–30 s, `bitrate_mode: high`, `mode: omni_reference` + `image_references`, `video_extension` | gdy Kling nie da 21:9 bez cropu |
| Przejście A→B (NIE w v1) | `seedance_2_5` lub `flux_3_video` | start+end frame, `generate_audio: false`, 720p → 1080p | tylko po decyzji; „chaos → porządek" domyślnie kodem |
| Transfer ruchu (eksperyment) | `hf_mult_motion_control` (Genjutsu) | `video_references` = 10 s **izolowanego renderu canvasu GLSL** (osobna strona testowa `?bg-only=1`: zero UI, zero tekstu, zero danych dem), nagranego lokalnie do `site/media/src/` — **nigdy nagranie klarow.com**; obraz = nowy still | spójność „wzgórz" między kodem a wideo; tylko na kredytach z rezerwy. Zgodność z `media-higgsfield-inputs-policy` p.1: dozwolone są wyłącznie własne abstrakcyjne rendery, a „nagranie ekranu strony" jest zakazane (model uczy się layoutu narzędzi) |
| Postprodukcja w chmurze | `video_deflicker`, `bytedance_video_upscale` (`preset: aigc`, 24 fps, 1080p), `topaz_video` | tylko gdy banding/migotanie po ffmpeg | koszt nieznany do momentu generacji (widżet potwierdzenia) |

Presety `presets_show` (Earth Zoom, Orbit 360, Wireframe, Point Cloud, Glitch…) i workflowy (`brand-asset-creation`, `website-builder-flow`) są projektowane pod osobę w kadrze / inne cele: NIE używać. Efekty „Lidar transition"/„Vanish" z pierwotnego briefu nie istnieją w bibliotece.

## 4. Stałe promptu (wklejać do KAŻDEGO promptu)

Paleta: `#A8B4C2` polerowana/satynowa stal, `#8895A6` i `#69788C` półtony, tło `#121212`–`#171717` grafitowa czerń, akcent chłodny, bez ciepłych barw. Materiały: brushed steel, satin chrome, graphite, frosted glass, 1px hairlines. Światło: soft edge light, single cool key, no lens flare. Kadr: locked-off camera, seamless loop, extremely slow motion, ambient, first and last frame identical.

**Negatywy (zawsze):** `no people, no hands, no faces, no text, no letters, no numbers, no logo, no watermark, no gold, no orange, no neon, no sparks, no explosions, no dust storm, no camera shake, no cuts, no flicker, no lens flare, no warm colors`.

## 5. Szablony promptów (kopiowane z `research/higgsfield.md` §7, 1:1)

### 5.1 Stille (Nano Banana Pro / Seedream 4.5)

```
[T-IMG-1 · hero master, 21:9]
Abstract macro landscape of gently undulating brushed-steel surface, low rolling waves like a topographic field, matte satin finish in cool steel grey #A8B4C2 with graphite shadows #121212, single soft cool key light from upper left, faint 1px hairline contour lines following the surface, thin drifting specks of light like data points, deep black background at the top third, ultra-minimal, premium B2B tech aesthetic, photoreal render, 8k, cinematic still, no people, no text, no logo, no lens flare, no warm colors.
```

```
[T-IMG-2 · „chaos" — start frame przejścia]
Thousands of tiny matte steel tiles scattered irregularly across a black graphite plane, overlapping, some tilted, subtle cool rim light, shallow depth of field, top-down 30° angle, cool grey #A8B4C2 on #121212, minimal, no text, no people, no logo.
```

```
[T-IMG-3 · „porządek" — end frame przejścia (ta sama kamera, to samo światło)]
The same tiny matte steel tiles now perfectly aligned into a clean orthogonal grid with equal gaps, calm, precise, thin hairline guides between rows, identical camera angle and lighting as before, cool grey #A8B4C2 on #121212, minimal, no text, no people, no logo.
```

```
[T-IMG-4 · tło sekcji, prawie statyczne]
Close-up of a satin chrome plane with a very soft vertical gradient of light, extremely subtle horizontal brushing texture, 90% of the frame near-black #171717, a single soft band of cool steel light #A8B4C2 at 35% opacity, no objects, no text, no people, seamless texture.
```

```
[T-IMG-5 · Recraft V4.1, tryb vector, ikony działów]
Minimal line icon of [bar chart / banknote / hard hat / spreadsheet / stamp], 1.5px stroke, rounded joins, single color, isolated on solid background, no text, no shadow, no gradient.
parametry: model_type: "vector", colors: ["#A8B4C2"], background_color: "#121212", resolution: "1k"
```

Dodatkowe stille v1 (synthesis §2.6.1):

```
[G4 · macro brushed-steel still 4:5, S7 second-read moment; image_references = master still]
Extreme close-up of brushed stainless steel, fine linear grain, single cool edge light, 80% near-black #121212, cool grey #A8B4C2 highlights, matte, no objects, no text, no people, vertical 4:5.
```

```
[G5 · tło OG 1200×630; wordmark i zdanie dodawane w kodzie (og.mjs), NIE w modelu]
wariant T-IMG-1 z większym „oddechem" pustej grafitowej przestrzeni w dolnej połowie kadru, horizontal 1.9:1, no text, no logo.
```

### 5.2 Image-to-video (Kling 3.0 / Seedance 2.5 / FLUX 3)

```
[T-VID-1 · pętla hero — Kling 3.0, start_image = end_image = T-IMG-1, duration 10, mode std→pro, sound off, AR 16:9]
Extremely slow ambient motion: the steel waves breathe and drift almost imperceptibly, the soft light band glides slowly from left to right, tiny specks of light float upward, camera completely locked off, no zoom, no pan, no cuts, seamless loop, first and last frame identical, no people, no text, no flicker, consistent exposure.
```

```
[T-VID-2 · przejście chaos→porządek — Seedance 2.5, start_image = T-IMG-2, end_image = T-IMG-3, duration 6, 720p→1080p, generate_audio false, AR 21:9 lub 16:9]
The scattered steel tiles slide and rotate smoothly into a perfect aligned grid, motion eases out gently, no bouncing, no camera movement, constant lighting, calm and precise, no people, no text, no flicker.
```

```
[T-VID-3 · tekstura pod wordmark — Kling 3.0 loop, start=end = T-IMG-4, duration 8]
A soft band of cool light sweeps slowly across the satin chrome surface from left to right and fades, brushing texture barely visible, everything else static, seamless loop, no camera motion, no text, no flicker.
```

```
[T-VID-4 · Cinema Studio v2 (opcjonalnie) — powolny dolly nad stalowym polem]
mode std, sound off, speedramp slowmo, cfg_scale 0.6, genre auto: Very slow forward dolly a few centimetres above a rolling brushed-steel landscape, cool key light, fog-free, no lens flare, no people, no text, 8 seconds, steady.
```

```
[T-VID-5 · „przed/po" abstrakcyjne — Seedance 2.5 omni_reference, image_references = [master still], start=T-IMG-2, end=T-IMG-3, 8 s]
Chaotic overlapping steel fragments gradually settle into thin clean horizontal hairlines, like data being sorted, slow and inevitable, no camera motion, no text, no people.
```

W v1 używane: T-IMG-1 (G1/G2), T-IMG-4 (G1), G4, G5, T-VID-1 (G3). T-IMG-2/3, T-VID-2/3/4/5 zostają jako szablony na później (wymagają decyzji founderów i mieszczą się w zakazie „jedno ruchome tło na witrynę").

Wskazówki: każde podejście w 480p/720p, finał 1080p; poster = ZAWSZE pierwsza klatka pętli (identyczna z ostatnią), nie „najładniejsza" ze środka; flicker → `video_deflicker` (MCP) albo `ffmpeg -vf "deflicker=size=5:mode=pm"`; prompty i ID generacji do `site/media/SOURCES.md`.

## 6. Pobranie i postprodukcja lokalna (ffmpeg)

Instalacja: `winget install Gyan.FFmpeg` (PowerShell), nowa sesja terminala. Praca w katalogu BEZ `&` w ścieżce (scratchpad), jak przy Playwright. Wyniki z MCP to URL-e CDN (`show_generation_by_ids` / `job_display`), ważne ~7 dni: pobierać natychmiast `curl -L -o src.mp4 "<url>"` do `site/media/src/` (poza `public/`, źródła > 5 MB w `.gitignore`).

```powershell
# 0) inspekcja: fps, rozdzielczość, czas, rozmiar, liczba klatek
ffprobe -v error -show_entries stream=width,height,r_frame_rate,pix_fmt,nb_read_frames:format=duration,size -count_frames -of default=nw=1 src.mp4

# 1) normalizacja: stałe 24 fps, bez audio, 8-bit 4:2:0, lekki dithering przeciw bandingowi na ciemnych gradientach
ffmpeg -y -i src.mp4 -r 24 -an -vf "noise=alls=3:allf=t+u" -c:v libx264 -crf 14 -pix_fmt yuv420p cfr.mp4

# 2a) pętla bezszwowa — klip generowany ze start=end frame: odetnij zdublowaną ostatnią klatkę (N = nb_read_frames)
ffmpeg -y -i cfr.mp4 -vf "trim=end_frame=N-1,setpts=PTS-STARTPTS" -c:v libx264 -crf 14 loop.mp4

# 2b) pętla bezszwowa — dowolny klip: crossfade końca w początek (D = długość, F = 1.0 s; offset = D-2F; wynik D-F)
ffmpeg -y -i cfr.mp4 -filter_complex "[0:v]split[a][b];[a]trim=end=1,setpts=PTS-STARTPTS[head];[b]trim=start=1,setpts=PTS-STARTPTS[tail];[tail][head]xfade=transition=fade:duration=1:offset=8,format=yuv420p[v]" -map "[v]" -c:v libx264 -crf 14 loop.mp4

# 2c) ping-pong (TYLKO ruch symetryczny, np. oddychające światło; NIE dla przepływów kierunkowych jak T-VID-1)
ffmpeg -y -i cfr.mp4 -filter_complex "[0:v]reverse[r];[0:v][r]concat=n=2:v=1[v]" -map "[v]" -c:v libx264 -crf 14 loop.mp4

# 3) kadrowanie do hero 1920×820
ffmpeg -y -i loop.mp4 -vf "scale=1920:-2:flags=lanczos,crop=1920:820" -c:v libx264 -crf 14 hero_master.mp4

# 4) enkody web (bez audio, GOP 240 = 10 s, faststart)
ffmpeg -y -i hero_master.mp4 -c:v libvpx-vp9 -b:v 0 -crf 33 -row-mt 1 -deadline good -cpu-used 2 -g 240 -pix_fmt yuv420p -an hero-v1.webm
ffmpeg -y -i hero_master.mp4 -c:v libsvtav1 -crf 38 -preset 6 -g 240 -pix_fmt yuv420p -an -movflags +faststart hero-v1.av1.mp4   # opcjonalny
ffmpeg -y -i hero_master.mp4 -c:v libx264 -profile:v high -level 4.1 -preset slow -tune film -crf 24 -g 240 -pix_fmt yuv420p -an -movflags +faststart hero-v1.mp4

# 5) poster (LCP) z KLATKI 0 + LQIP
ffmpeg -y -i hero_master.mp4 -frames:v 1 -vf "scale=1920:-2" -c:v libwebp -quality 80 hero-v1.poster.webp
ffmpeg -y -i hero_master.mp4 -frames:v 1 -vf "scale=48:-2" -c:v libwebp -quality 50 hero-v1.lqip.webp

# 6) bramka rozmiaru: każdy format ≤ 1,5 MB, poster ≤ 60 KB, LQIP ≤ 2 KB; w razie przekroczenia: crf +2 i ponów
Get-ChildItem hero-v1.* | Select-Object Name, Length

# 7) kontrola spawu i postera (PSNR ≥ 45 dB) + migotanie (ΔYAVG ≤ 2 %)
ffmpeg -y -i hero-v1.mp4 -vf "select=eq(n\,0)" -frames:v 1 first.png
ffmpeg -y -sseof -0.05 -i hero-v1.mp4 -frames:v 1 last.png
ffmpeg -i first.png -i last.png -lavfi psnr -f null -
ffmpeg -i first.png -i hero-v1.poster.webp -lavfi psnr -f null -
ffmpeg -i hero-v1.mp4 -vf signalstats -f null - 2>&1 | Select-String "YAVG"
```

Alpha: żaden model nie oddaje kanału alpha; dla Klarow generujemy od razu na docelowej czerni (`#121212`) i osadzamy bez alphy (najwyższa jakość, brak obrzeży). Jeśli kiedyś warstwa świetlna nad treścią: generować na `#000` i komponować `mix-blend-mode: screen` + maski CSS; natywna alpha (VP9 `yuva420p` + HEVC-alpha na macOS) tylko dla grafik z Blender/AE/Remotion.

## 7. Osadzenie w `site/` (skrót; pełny kod w `references/motion-cheatsheet.md` §7)

1. Pliki: `site/public/media/hero-v1.{webm,mp4,poster.webp,lqip.webp}` (+ `.av1.mp4` opcjonalnie); wersja w nazwie; `public/_headers`: `/media/*` i `/thumbs/*` `Cache-Control: public, max-age=31536000, immutable`.
2. Stałe ścieżek w `src/data/media.ts` (`HERO_POSTER`, `HERO_SOURCES`); literały ścieżek poza tym modułem = 0.
3. `HeroMedia`: `<img>` poster (LCP, `fetchPriority="high"`, `width/height`) + `<video muted playsInline loop preload="metadata" poster disablePictureInPicture disableRemotePlayback tabIndex={-1}>` z `<source>` VP9 → H.264, w kontenerze `.hero-media { position:absolute; inset (longhandy); overflow:hidden }`, pod `MediaBoundary`; obok kontenera (POZA `aria-hidden`) przycisk `hero-media-toggle` „Zatrzymaj tło / Odtwórz tło" z `aria-pressed` i stanem w `sessionStorage` — WCAG 2.2.2 (`media-video-embed-spec`).
4. Bramki `wantsVideo()`: `MEDIA_ENABLED` → reduced-motion → `pointer: fine` → `saveData` → 2g/3g; ładowanie po `window.load`; IO ≥ 25 % play/pause; `visibilitychange`; `play().catch` + `onSuspend` (iOS LPM) → poster.
5. `index.html`: `<link rel="preload" as="image" href="/media/hero-v1.poster.webp" fetchpriority="high">` (prerender usuwa na trasach bez hero); shell prerenderu renderuje tylko `<img>`.
6. CSS: `@media (prefers-reduced-motion: reduce) { .hero-media video { display:none } }`; overlay gradient dla kontrastu tekstu (AA na najjaśniejszej klatce).
7. Nigdy: `fixed` w treści, drugi autoplay, wideo + GLSL Hills naraz, wideo na `pointer: coarse`.

## 8. Budżety (bramki mechaniczne; `rules/media-video-budgets`, `rules/perf-*`)

| Metryka | Limit |
|---|---|
| Hero wideo | ≤ 1,5 MB każdy format; 1920×820; 24 fps CFR; `-an`; 6–10 s; GOP 240 |
| Poster | ≤ 60 KB WebP q≈80, klatka 0 |
| LQIP | ≤ 2 KB, 48 px |
| Transfer `/` desktop z wideo | ≤ 2,5 MB |
| Transfer `/` mobile (bez wideo) | ≤ 350 KB |
| LCP | mobile < 2,5 s, desktop < 1,8 s (poster preloadowany, H1 w shellu) |
| Autoplay per trasa | 1 (`/`); ruchome tła per trasa: 1 |
| Kredyty v1 | ≈ 200–395 (koperta planistyczna 450; trial 100 + PLUS 1 000 = ≥ 2,4× zapasu) — rozpiska w §2 |
| Zrzuty dem | 1280×800 WebP ≤ 120 KB; miniatury 640×400 ≤ 40 KB (0 kr, Playwright) |
| Hover-klipy (faza 2) | WebM ≤ 600 KB, 6 s, 24 fps, `preload="none"` (0 kr, Playwright) |
| OG per trasa | PNG 1200×630 ≤ 200 KB (`og.mjs`, deterministyczny) |

## 9. `site/media/SOURCES.md`: szablon wpisu

```markdown
# SOURCES: pochodzenie assetów klarow.com (bez sekretów, bez URL-i CDN po 7 dniach)

## hero-v1 (YYYY-MM-DD)
- rodzina: hero-loop · trasa: / · reguły: media-video-embed-spec, media-video-gating, media-video-budgets
- model: kling3_0 · mode: std (selekcja) → pro (finał) · duration: 10 · sound: off · AR: 16:9
- start_image = end_image: media/src/master-still-v1.png (nano_banana_pro, resolution 4k, prompt T-IMG-1, generacja <ID>)
- prompt (pełny): [T-VID-1 …]
- negatywy: [lista z §4]
- podejścia: 6 × std (14 kr) + 2 × pro (30 kr) = 144 kr · plan: PLUS miesięczny · faktura: JDG
- wybrany: generacja <ID> (podejście 5) · odrzucone: 1–4 (flicker), 6 (dryf ekspozycji)
- postprodukcja: cfr 24 + noise 3 → trim N-1 → crop 1920×820 → webm crf 33 (1 402 KB) / mp4 crf 24 (1 488 KB) / poster q80 (54 KB) / lqip (1,6 KB)
- kontrola: psnr first/last 47,3 dB · psnr poster/first 51,0 dB · ΔYAVG max 0,9 %
- wynik: public/media/hero-v1.{webm,mp4,poster.webp,lqip.webp} · _headers immutable: tak
- przegląd (rules/media-asset-review-gate): tabela 12 pozycji poniżej · WYNIK: PASS 12/12 · audytor: media-auditor · potwierdził: Karol (data)
- generacje na koncie usunięte: (data po sprincie)

## master-still-v1 (YYYY-MM-DD)
- model: nano_banana_pro · resolution: 4k · prompt: T-IMG-1 · image_references: media/src/board/still-03.png
- podejścia: 6 × 3 kr = 18 kr · wybrany: <ID> · użycie: style lock (image_references) dla G3, G4, G5
- wynik: media/src/master-still-v1.png (poza public/; w gicie tak, ≤ 5 MB)
```

## 10. Procedura przeglądu adwersarialnego assetu (przed kopiowaniem do `public/`)

1. **Agent `media-auditor` (read-only)** dostaje: ścieżkę plików w `site/media/src/`, wpis `SOURCES.md`, master still. Wykonuje kroki mechaniczne z `rules/media-asset-review-gate` (klatki co 1 s → OCR, histogram, PSNR spawu i postera, `signalstats`, rozmiary, fps, `-an`) i wypełnia tabelę 12 pozycji z dowodami.
2. **Przegląd adwersarialny**: agent celowo szuka powodów do FAIL („gdzie jest AI-tell?", „czy da się to zdjąć bez straty treści?", „czy najjaśniejsza klatka nie zbija kontrastu leadu poniżej 4,5:1?", „czy w kadrze nie ma cienia sylwetki/litery?"); brak znalezisk musi być uzasadniony dowodem, nie „wygląda OK".
3. **Founderzy**: Karol (oko marki) i Paweł oglądają 10 s pętli 3 pełne obroty na OLED (iPhone, jasność 100 %, ciemne pomieszczenie) i na laptopie; pytanie zamknięte: „czy osoba spoza zespołu zgadnie w 5 s, że to AI?". Odpowiedź obu = wpis w tabeli.
4. **Decyzja**: `PASS 12/12` → `public/media/` + `_headers` + `data/media.ts` + preload + commit `Media: hero-v1 (PASS 12/12)`; `FAIL` → dogrywka (nowe podejścia z tym samym master stillem), postprodukcja (deflicker/crf) albo odrzucenie (plan B). Każda nowa wersja = nowy wpis i nowy przegląd.
5. **Po wdrożeniu**: test na produkcji przez `curl -sI` (nagłówek immutable), Playwright WebKit coarse/fine, realny iPhone; Lighthouse LCP; wpis w CLAUDE.md „Stan operacyjny".

## 11. Alternatywy 0 kr (deterministyczne)

| Narzędzie | Do czego | Uwagi |
|---|---|---|
| **`scripts/shoot-tools.mjs`** (Playwright WebKit ze scratchpadu, `playwright-core` + `executablePath` do `~/AppData/Local/ms-playwright/webkit-*`) | **12 zrzutów dem** (11 dashboardów + `DemoReport`) + 3 zrzuty KSeF (mock) = 15 kadrów × 2 rozmiary, WebP przez `sharp` | deterministyczne dane = identyczne bajty; czeka na `[data-dashboard][data-ready='true']` (flaga ustawiana PO `Suspense`) i na zniknięcie `.skel`, klika „Załaduj przykład", grep DOM na markę źródłową (`SRC_BRAND_RE`) przed zrzutem |
| **`scripts/record-demos.mjs`** (Playwright `recordVideo` 1280×800, deterministyczny skrypt klików) → ffmpeg VP9 ≤ 600 KB, 6 s, 24 fps | hover-klipy ram S3 (faza 2) | start od stanu identycznego ze zrzutem (poster = klatka 0); `preload="none"` |
| **`scripts/og.mjs`** (SVG → PNG w buildzie, `sharp`/`resvg`) | OG 1200×630 per trasa: tło G5 + wordmark `KLAROW` + tytuł z `pagesSeo.ts` | deterministyczny (bez dat), ≤ 200 KB; nowa trasa w `prerenderAll()` = nowy OG automatycznie |
| **Blender 4.4/5.0 (EEVEE Next)**, zainstalowany u Karola | proceduralne „stalowe" pętle (noise displacement + anisotropic shader), PNG-sekwencja z alphą, 24 fps, 240 klatek | deterministyczne, hex koloru w shaderze, dowolne 21:9/4K; kilka godzin setupu; kanon tła, gdy Higgsfield zawiedzie |
| **three.js GLSL Hills** (w repo) | plan B tła desktop | 0 kr, deterministyczne, GPU-higiena gotowa; 118 KB gz po idle |
| **After Effects 2026 + Media Encoder** (u Karola) | kompozycja, color match do master stilla, ProRes 4444 (alpha) → ffmpeg; plugin Higgsfield działa z AE 2026 | eksport WebM z AE przez ffmpeg z ProRes/PNG, nie wtyczką |
| **CSS-only** (`mask-image` + `@keyframes translateX` warstwy `--accent`, 12 s, reduced → none) | light-sweep pod wordmark (jeśli kiedyś) | 0 KB; w v1 nieużywany (jedno ruchome tło) |
| **Lottie/Rive** | mikro-animacje ikon | w v1 nieużywane (lucide statyczne); nie dublować z Motion |

## 12. Fakty z repo, do których stosuje się agent osadzania

- `globals.css`: `.bg-layer` fixed `z-index:-1`, gradient awaryjny `#121212`, `isolation: isolate`; `.content-layer` BEZ z-index (bug iOS 2026-07-26); nowe media tylko w kontenerze hero `absolute` + `overflow:hidden`.
- `App.tsx`: `useAnimatedBg()` gasi canvas na `pointer: coarse` (2026-07-24); do zdjęcia w fazie 0, wraca tylko w planie B.
- Kit: `--background:#171717`, `--body-bg:#121212`, `--primary:#a8b4c2`, `--scrim:rgba(18,18,18,.72)`, `--ease-out:cubic-bezier(.22,1,.36,1)`, `--ease-soft:cubic-bezier(.3,.7,.3,1)`; wideo generowane pod DARK; motyw jasny nieużywany na stronie (Page Theme Lock).
- `public/_headers`: HTML `no-cache`, `/assets/*` i `/fonts/*` immutable → dopisać `/media/*`, `/thumbs/*`.
- Prerender: 17 → 19 HTML; shell z pustym `#root` w `index.html` (assert), bez `<video>` i bez przycisku pauzy, tylko `<img>` poster.
- `npx` nie działa w repo; ffmpeg/Playwright/CLI uruchamiać ze scratchpadu bez `&` w ścieżce; skrypty przez `node scripts/...`.
