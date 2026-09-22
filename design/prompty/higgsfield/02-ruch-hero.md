# Hero: ruch (image-to-video)

## Dlaczego dwie strategie
Ta sama klatka jako start i jako koniec tłumi ruch mniej więcej 10-krotnie. Seedance potrafi też „dopełnić” klip,
odtwarzając akcję wstecz. Dlatego robimy drafty obu strategii i wybieramy tę, która daje równy strumień w jedną stronę.

Seedance nie ma pola negative prompt i każdy token czyta pozytywnie. Z tego wynikają zasady promptu:
- krótki, 50–80 słów,
- tylko ruch i kamera,
- **bez** bloku STYLE i bez opisu obrazu,
- bez listy zakazów.

## Ustawienia
- **Model i tryb:** Seedance 2.0, image-to-video, proporcje **9:16** ustawione ręcznie, audio **OFF**.
- **Plik wejściowy:** `hero-m-start-1080x1920.png`, wynik kroku A z `03-pipeline-ffmpeg.md`.
- **Drafty:** 720p w trybie Fast, po 3 generacje na strategię.
  - **V-A:** start = end = ten sam plik, 8 s.
  - **V-B:** tylko klatka startowa, 10 s.
- **Finał** zwycięskiej strategii: 1080p w trybie standard, 2 generacje.
- **Plan B**, ten sam prompt i te same odrzuty:
  - Kling 3.0 (start/end, 3–15 s),
  - MiniMax H3 (start/end, 1440×2560, 24 fps),
  - FLUX 3 Video (start/end, 5–20 s).

## Prompt ruchu (GŁÓWNY)
```
Static tripod shot, locked-off camera, one continuous shot. The illustration holds perfectly still exactly as in the first frame: every line, shape and color stays fixed for the whole clip. Only light travels: small sea-green packets glide steadily along the bright lower cables into the glowing knot, and a calm stream of amber light flows down the main cable and out through the bottom edge. Tiny LEDs blink softly every two seconds. The dark upper area stays dark and still. 24 fps.
```

**Warianty promptu**
- **Tylko V-A:** na końcu dopisujemy `The last frame is identical to the first frame.`
- **ALT-1:** frazę `along the bright lower cables` zamieniamy na `along the bright cables in the front racks`.
- **ALT-2:** frazę `along the bright lower cables` zamieniamy na `along the dendrites`.

## Twarde odrzuty wideo
1. Ruch kamery, zoom albo dryf skali. Wykrywa to maska blokady statyki: pokazuje wtedy całe kontury.
2. Kable albo moduły zmieniają kształt tam, gdzie przechodzi światło.
3. Pakiety zawracają albo płyną w górę pnia.
4. Duże obszary zapalają się naraz albo coś miga częściej niż 3 razy na sekundę.
5. W ciemnej górnej strefie pojawia się światło.
6. Tło pulsuje albo kolor całej klatki dryfuje.
7. Pojawiają się nowe obiekty, tekst albo cyfry.
8. Pień przy dolnej krawędzi zmienia geometrię. Zmiana jasności jest dozwolona.
9. Klip jest „zamrożony”: przez ponad 2 s przepływają mniej niż 3 pakiety.
10. Szarpanie albo powtórzone klatki.

## Plan C: bez wideo
Stosujemy go, gdy nic nie przejdzie odrzutów albo pętla nie zmieści się w budżecie 1,6 MB. Hero składa się wtedy z:
- posteru (still) jako obrazu,
- 10–14 ścieżek SVG obrysowanych ręcznie po głównych kablach i pniu (Inkscape albo Figma, ok. 1–2 h),
- kropek-pakietów na `offset-path` w takcie 2 s:
  - morskie w maszynie, bursztynowe w pniu,
  - halo z `radial-gradient`,
  - wyłączone przy `prefers-reduced-motion`.

Plan C działa także w iOS Low Power Mode. W tym trybie wideo i tak pokazuje tylko poster.
