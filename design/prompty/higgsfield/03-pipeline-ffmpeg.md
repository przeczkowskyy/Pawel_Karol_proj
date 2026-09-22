# Pipeline ffmpeg: od generacji do pliku na stronę

> **W v1 potrzebna jest tylko sekcja „H. Tło statyczne”.** Reszta pliku (blokada statyki, pętla, kodowanie
> wideo) dotyczy ruchu, który od 22.09 jest opcją na później — patrz `02-ruch-opcjonalny.md`.

Komendy są przetestowane 2026-09-22 na ffmpeg 9 (build gyan full) na materiale syntetycznym.
Uruchamiamy je w Git Bash z katalogu repo. Wszystkie pliki robocze leżą w `_mastery/`, poza gitem.
Pośredniki zapisujemy bezstratnie (`ffv1` w `.mkv`), więc jakość tracimy tylko raz, przy finalnym kodowaniu.

## A. Master stilla: przycięcie do 9:16 (nigdy od dołu) i 1080×1920
```bash
ffmpeg -i _mastery/hero-m-master-4k.png \
  -vf "crop=w='min(iw,ih*9/16)':h='min(ih,iw*16/9)':x='(iw-ow)/2':y='ih-oh',scale=1080:1920:flags=lanczos" \
  -frames:v 1 _mastery/hero-m-start-1080x1920.png
```
- Ten sam plik pełni trzy role: klatka startowa (w V-A także końcowa) w Seedance, wzorzec blokady statyki i baza pomiaru `data-exit`.
- `data-exit` mierzymy w Photopea: x środka pnia na dolnej krawędzi podzielone przez 1080, np. `0.20,1`.

## B. Blokada statyki (obowiązkowa)
Zasada: piksel, który różni się od mastera mniej niż próg, bierzemy z mastera; resztę, czyli światło, z wideo.
Efekty:
- statyka jest bit w bit równa posterowi (w teście PSNR = ∞),
- szew pętli dotyczy tylko światła,
- plik jest mniejszy.

**B0. Podgląd maski**, żeby dobrać próg: zaczynamy od 18, zakres 12–24. Białe mają być wyłącznie pakiety i diody.
```bash
D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 _mastery/raw.mp4)
ffmpeg -i _mastery/raw.mp4 -loop 1 -framerate 24 -i _mastery/hero-m-start-1080x1920.png -filter_complex \
 "[0:v]fps=24,scale=1080:1920:flags=lanczos:in_color_matrix=bt709,format=gbrp[v];[1:v]format=gbrp[s];\
[v][s]blend=all_mode=difference,format=gray,geq=lum='if(gt(lum(X,Y),18),255,0)'[m]" \
 -map "[m]" -t $D -c:v libx264 -crf 18 _mastery/maska-podglad.mp4
```
Jeśli maska pokazuje **całe kontury**, generacja ma dryf kamery albo skali i ją odrzucamy.

**B1. Blokada:**
```bash
ffmpeg -i _mastery/raw.mp4 -loop 1 -framerate 24 -i _mastery/hero-m-start-1080x1920.png -filter_complex \
 "[0:v]fps=24,scale=1080:1920:flags=lanczos:in_color_matrix=bt709,format=gbrp,split[v1][v2];[1:v]format=gbrp,split[s1][s2];\
[v1][s1]blend=all_mode=difference,format=gray,geq=lum='if(gt(lum(X,Y),18),255,0)',dilation,dilation,gblur=sigma=3,format=gbrp[m];\
[s2][v2][m]maskedmerge[out]" \
 -map "[out]" -t $D -c:v ffv1 -an _mastery/locked.mkv
```

## C. Domknięcie pętli
Wybieramy jedną z dwóch ścieżek. **Nigdy obu po kolei.**

**C1. Strategia V-A** (start = end): odcinamy ostatnią klatkę, bo jest duplikatem pierwszej.
```bash
N=$(ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=nb_read_frames -of csv=p=0 _mastery/locked.mkv)
ffmpeg -i _mastery/locked.mkv -vf "trim=end_frame=$((N-1)),setpts=PTS-STARTPTS" -c:v ffv1 -an _mastery/loop.mkv
```

**C2. Strategia V-B** (tylko klatka startowa, klip 10 s): najpierw wycinamy okno 9 s, potem przenikamy 1 s.
Wynik to pętla o długości D − 1 s (tu 8 s). `offset = D − 2`.
```bash
ffmpeg -ss 0.5 -i _mastery/locked.mkv -t 9 -c:v ffv1 -an _mastery/okno.mkv
D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 _mastery/okno.mkv)
OFF=$(python -c "print(round($D-2,3))")
ffmpeg -i _mastery/okno.mkv -filter_complex \
 "[0:v]fps=24,split[a][b];[a]trim=start=1,setpts=PTS-STARTPTS[body];[b]trim=end=1,setpts=PTS-STARTPTS[head];\
[body][head]xfade=transition=fade:duration=1:offset=$OFF[v]" \
 -map "[v]" -c:v ffv1 -an _mastery/loop.mkv
```

**Zakaz boomerangu** (odtwarzania w przód i w tył): odwraca kierunek przepływu.

## D. Plik na stronę: H.264 720×1280
Jawne tagi kolorów robi `setparams`. Bez niego przeglądarka dostaje `unknown` i może przesunąć barwy.
```bash
ffmpeg -i _mastery/loop.mkv \
  -vf "scale=720:1280:flags=lanczos+accurate_rnd+full_chroma_int:out_color_matrix=bt709:out_range=tv,format=yuv420p,setparams=colorspace=bt709:color_primaries=bt709:color_trc=bt709:range=tv" \
  -c:v libx264 -preset veryslow -tune animation -crf 27 -profile:v high -g 180 -keyint_min 180 \
  -movflags +faststart -an site/public/media/hero-m.v1.h264.mp4
```
- **Budżet:** cel 1,3 MB, sufit 1,6 MB. Jeśli plik jest za duży, podnosimy CRF o 1–2.
- **Filtr `hqdn3d=0:0:3:3`** dokładamy na końcu `-vf` tylko wtedy, gdy światło migocze. Po blokadzie statyki zwykle nie jest potrzebny.
- **Nazwy plików:** każda nowa wersja dostaje nową nazwę (`.v2`, `.v3`). Pliki w `/media` są cache'owane jako `immutable`.

## E. Poster
Poster bierzemy z **zakodowanego** pliku, nie z PNG z generatora. Dzięki temu start wideo nie zmienia tonu.
```bash
ffmpeg -i site/public/media/hero-m.v1.h264.mp4 -frames:v 1 site/src/assets/hero-m.v1.poster.png
```
Astro (`<Picture>`) robi z niego AVIF w buildzie.

## F. Kontrole
```bash
# kolor tła (RGB narożnika 8x8)
ffmpeg -v error -i site/public/media/hero-m.v1.h264.mp4 -vf "crop=8:8:0:0,scale=1:1:flags=area,format=rgb24" \
  -frames:v 1 -f rawvideo - | od -An -tu1
# szew: 3 obiegi pod rząd, oglądamy moment zawinięcia
ffmpeg -stream_loop 2 -i site/public/media/hero-m.v1.h264.mp4 -c copy _mastery/szew-3x.mp4
```
**Kolor tła.** W teście `#0D1014` po kodowaniu dał `#0A0F12`, czyli ok. 2–3 poziomy różnicy. To normalne dla ciemnych
kolorów w 8-bitowym H.264. Nie korygujemy wideo: `--tlo` w `tokens.css` ustawiamy na kolor zmierzony próbnikiem na zrzucie
ekranu z Safari iOS i z Chrome Android.

## G. Placeholder do Claude Design (nigdy na produkcję)
```bash
mkdir -p _mastery/placeholdery
ffmpeg -i site/public/media/hero-m.v1.h264.mp4 -vf "fps=10,scale=540:-1:flags=lanczos" -c:v libwebp_anim -q:v 50 -loop 0 _mastery/placeholdery/A1m-hero-m.webp
ffmpeg -i site/public/media/hero-m.v1.h264.mp4 -frames:v 1 _mastery/placeholdery/A1m-hero-m.png
```
Pętli jeszcze nie ma? Wtedy do Claude Design idzie sam PNG ze stilla: `_mastery/hero-m-start-1080x1920.png`.

---

## H. Tło statyczne na stronę (jedyny krok potrzebny w v1)

Master z Higgsfield zostaje w `_mastery/`. Na stronę idzie plik źródłowy w `site/src/assets/`, a warianty AVIF
i WebP w kilku szerokościach generuje **Astro w buildzie** (`<Picture>`).

### H1. Przyciemnienie i skalowanie (zmierzone na masterze z 22.09)
Generator daje tło jaśniejsze niż nasz token: zmierzone `#15181D` zamiast `#0D1014`. Mnożnik **0,62** naprawia
dwie rzeczy naraz — tło trafia w `#0D0F12`, a najjaśniejszy piksel w strefie tekstu spada z 98 do 68, czyli
kontrast dla `--papier` rośnie z **5,4:1 do 9,3:1**. Dzięki temu pod nagłówkiem nie jest potrzebna żadna tabliczka.

```bash
ffmpeg -i _mastery/tlo-m-master.png   -vf "colorchannelmixer=rr=0.62:gg=0.62:bb=0.62,scale=1440:-1:flags=lanczos"   site/src/assets/tlo-m.v1.png
```
Mnożnik dobieramy pod konkretną generację: celem jest narożnik `#0D1014` ±2 i `YMAX` w strefie tekstu poniżej 70.

### H2. Kontrola (obie komendy muszą przejść przed commitem)
```bash
# kolor tła w narożniku — oczekujemy ok. 13 15 18
ffmpeg -v error -i site/src/assets/tlo-m.v1.png -vf "crop=8:8:0:0,scale=1:1:flags=area,format=rgb24"   -frames:v 1 -f rawvideo - | od -An -tu1
# najjaśniejszy piksel w strefie tekstu (górne 55%) — oczekujemy YMAX < 70
ffmpeg -i site/src/assets/tlo-m.v1.png -vf "crop=1440:1419:0:0,signalstats,metadata=print" -f null - 2>&1 | grep YMAX
```

### H3. Kontynuacja przy przewijaniu: odbicie w pionie
Strona jest dłuższa niż jeden kadr, więc tło **powtarzamy z odbiciem**: kadr, ten sam kadr obrócony w pionie,
kadr, i tak dalej. Sprawdzone 22.09 na tym masterze: **szew jest niewidoczny**, bo ścieżki przechodzą przez linię
odbicia bez przerwania. Zero dodatkowych generacji i zero dodatkowych kilobajtów.

W CSS wystarczy druga warstwa z `transform: scaleY(-1)` ustawiona pod pierwszą (albo `background-repeat: repeat-y`
na kaflu złożonym z kadru i jego odbicia). Wygaszanie do czerni i tak przykrywa dolne powtórzenia.

Podgląd szwu do oceny:
```bash
ffmpeg -y -i site/src/assets/tlo-m.v1.png -vf "crop=1440:500:0:2080" _mastery/_a.png
ffmpeg -y -i site/src/assets/tlo-m.v1.png -vf "vflip,crop=1440:500:0:0" _mastery/_b.png
ffmpeg -y -i _mastery/_a.png -i _mastery/_b.png -filter_complex "[0:v][1:v]vstack=inputs=2" _mastery/_szew.png
```

### H4. Rozdzielczość
- **Nie potrzebujemy 4K.** Telefon 390 px przy DPR 3 to 1170 px, więc źródło 1440 px w pełni wystarcza.
- Desktop potrzebuje osobnego kadru poziomego (TLO-D), a nie powiększenia pionowego.
- Po 4K sięgamy dopiero wtedy, gdy na telefonie widać miękkość linii.

**Budżet:** źródło do 2 MB, wariant AVIF serwowany na telefon do 180 KB.
