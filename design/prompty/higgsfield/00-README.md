# Hurtownia promptów: Higgsfield

> **Kierunek od 22.09:** strona dostaje **jedno duże, wyciszone tło** z okablowania i sieci neuronowej,
> wygaszane do czerni. Kabel z impulsem przez całą stronę został odrzucony. Styl ma być **poważny, bez kreskówki**.

## Kolejność pracy
1. **Runda tła** (`01-tlo-i-hero.md`, rozdział „Runda 2”)
   - Nano Banana Pro, 9:16, 2K, 4 warianty, blok **STYLE 2** na końcu promptu.
   - Wybór kadru według listy twardych odrzutów.
2. **Zwycięzca w 4K** → `_mastery/`.
3. **Eksport na stronę** (`03-pipeline-ffmpeg.md`, sekcja **H**): przycięcie i skalowanie, resztę robi Astro w buildzie.
4. **Wersja pozioma (TLO-D)** dla desktopu, z TLO-M jako referencją.
5. **Ruch** (`02-ruch-opcjonalny.md`) — dopiero po starcie v1, jeśli w ogóle.
6. **v1.1** (`04-v1.1-pozostale-assety.md`): grafiki sekcji, jeśli okażą się potrzebne.

Ikony sześciu działów oferty **rysujemy w wektorze**, nie w generatorze. Tylko rysunek daje jednakową grubość
linii, tę samą siatkę i symetrię.

## Zasady
- **Oryginały** (4K, drafty) trafiają do `_mastery/`, poza gitem. Do repo idzie tylko plik źródłowy strony w `site/src/assets/`.
- **Ciemna strefa tekstu.** W górnych 55% kadru pionowego (na desktopie w lewych 45%) żaden piksel nie może być
  jaśniejszy niż `#2A313A`. Wygaszanie do czerni robi CSS, więc obraz ma mieć równe tło `#0D1014`.
- **Zero kreskówki.** Grube obrysy, śrubki, opaski i pękate kształty są powodem odrzucenia generacji.
- **Proporcje** ustawiamy ręcznie, nigdy „Auto”.
- Na wideo nie wydajemy kredytów, dopóki v1 nie jest na produkcji.

## Dziennik generacji (data, model, prompt, link, werdykt)

| Data | Asset | Model | Prompt (plik#rozdział) | Link do generacji | Werdykt |
|---|---|---|---|---|---|
| 2026-09-22 | hero runda 1 (12 szt.) | Nano Banana Pro | `01-tlo-i-hero.md#archiwum-runda-1` | konto webowe Higgsfield | odrzucone: za bardzo kreskówkowe, jasna góra kadru |
