# Ruch w tle — opcja, nie v1

> **Status: wstrzymane.** W v1 tło jest **nieruchome**. Ten plik zostaje jako gotowy przepis na wypadek,
> gdyby po starcie okazało się, że warto dołożyć delikatny ruch świateł w górnej części strony.
> Wcześniejszy plan (impuls płynący kablem wraz ze scrollem) został odrzucony 22.09.

## Co ewentualnie animujemy
Tylko **światło w liniach** zatwierdzonego tła: kilka morskich znaczników przesuwających się wzdłuż tras
i bursztynowe punkty, które powoli oddychają. Rysunek stoi nieruchomo. Żadnego ruchu kamery, żadnego
pojawiania się nowych obiektów.

## Dlaczego dwie strategie
Ta sama klatka jako start i koniec tłumi ruch mniej więcej 10-krotnie, a Seedance potrafi „dopełnić” klip,
odtwarzając akcję wstecz. Dlatego robimy drafty obu wariantów i wybieramy ten z równym, jednokierunkowym ruchem.

## Ustawienia
- **Model:** Seedance 2.0, image-to-video, proporcje ustawione ręcznie, audio **OFF**.
- **Wejście:** zatwierdzone tło przeskalowane do 1080×1920 (mobile) albo 1920×1080 (desktop).
- **Drafty:** 720p, po 3 generacje na wariant.
  - **V-A:** start = end = ten sam plik, 8 s.
  - **V-B:** tylko klatka startowa, 10 s.
- **Finał:** 1080p, 2 generacje.
- **Plan B:** Kling 3.0, MiniMax H3, FLUX 3 Video (wszystkie przyjmują klatkę startową i końcową).

## Prompt ruchu
Bez bloku STYLE i bez opisu obrazu — Seedance czyta każdy token pozytywnie, więc prompt zawiera tylko ruch i kamerę.
```
Static tripod shot, locked-off camera, one continuous shot. The illustration holds perfectly still exactly as in the first frame: every line, shape and color stays fixed for the whole clip. Only light moves: a few small sea-green marks glide slowly along the existing lines, always in one direction, and two or three amber dots brighten and dim on a steady two-second rhythm. The dark upper area stays dark and still. 24 fps.
```
W wariancie V-A dopisujemy na końcu: `The last frame is identical to the first frame.`

## Odrzuty
1. Ruch kamery, zoom albo dryf skali (widać to na masce blokady statyki: pokazuje wtedy całe kontury).
2. Linie zmieniają kształt albo grubość tam, gdzie przechodzi światło.
3. Znaczniki zawracają.
4. Duże obszary zapalają się naraz albo coś miga częściej niż 3 razy na sekundę.
5. Światło w ciemnej strefie tekstu.
6. Tło pulsuje albo kolor klatki dryfuje.
7. Nowe obiekty, tekst, cyfry.
8. Klip „zamrożony”: mniej niż 3 znaczniki w ruchu przez 2 s.

## Obróbka
Bez zmian: blokada statyki, domknięcie pętli i kodowanie opisane w `03-pipeline-ffmpeg.md`.
Budżet pliku: do 1,6 MB w H.264. Jeśli się nie mieści, zostaje samo statyczne tło.

## Tańsza alternatywa
Ruch świateł da się zrobić w kodzie nad nieruchomym tłem: kilkanaście kropek na ścieżkach SVG,
animowanych przez `offset-path` w takcie 2 s, wyłączanych przy `prefers-reduced-motion`.
Waży kilka kilobajtów, działa też w trybie oszczędzania energii na iOS i nie wymaga kredytów.
