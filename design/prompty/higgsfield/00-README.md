# Hurtownia promptów: Higgsfield

Kolejność pracy (koncepcja §5):

1. **Runda kierunków** (`01-hero-runda-1.md`)
   - Nano Banana Pro, 9:16, 2K, 4 warianty.
   - 3 kierunki: GŁÓWNY, ALT-1, ALT-2.
   - Każdy prompt obrazu kończy się blokiem STYLE.
2. **Wybór kierunku**, potem ta sama generacja w 4K.
3. **Przygotowanie mastera** (`03-pipeline-ffmpeg.md`, krok A): przycięcie i resampling do `hero-m-start-1080x1920.png`.
4. **Retusz pseudoznaków**
   - ręcznie w Photopea (wypełnienie kolorem),
   - większe poprawki: edycja w Nano Banana,
   - Seedream tylko w ostateczności.
5. **Ruch** (`02-ruch-hero.md`)
   - Seedance 2.0: strategie V-A i V-B, drafty w 720p, finał w 1080p.
6. **Obróbka** (`03-pipeline-ffmpeg.md`)
   - blokada statyki, domknięcie pętli, H.264,
   - poster,
   - placeholder WebP do Claude Design.
7. **v1.1** (`04-v1.1-pozostale-assety.md`): A0, A1d, A2, A3, A4.

## Zasady
- **Oryginały** trafiają do `_mastery/` w katalogu repo: 4K, drafty wideo, `raw.mp4`. Folder jest poza gitem.
  - Do gita idą tylko finalne pliki strony w `site/public/media/`, z wersją w nazwie (`.vN`).
- **Strefa ciemna.** W górnych 60% kadru 9:16 żaden piksel nie może być jaśniejszy niż `#2A313A`. Tam leży tekst hero.
- **Proporcje** ustawiamy zawsze ręcznie, nigdy „Auto”. **Audio** zawsze wyłączone.
- **Kolejność kosztów.** Na wideo nie wydajemy kredytów, dopóki still nie przejdzie wszystkich twardych odrzutów.

## Dziennik generacji (dowód pochodzenia: data, model, prompt, link)

| Data | Asset | Model | Prompt (plik#nagłówek) | Link do generacji | Werdykt |
|---|---|---|---|---|---|
| | | | | | |
