# Dzienniki przeglądów assetów (wzory wpisów)

Plik referencyjny strażnika: **wzory** wpisów dziennika dla assetów medialnych i log decyzji
o wejściach do generatora. Reguły trzymają tylko zasadę i test; dzienniki (długie, rosnące,
zmieniane przy każdym assecie) mieszkają tutaj, żeby `rules/*.md` zostały w standardzie sekcji
`Zasada · Mechanizm awarii · Niepoprawnie · Poprawnie · Test · Wyjątki`
(`scripts/build-index.mjs` ostrzega o każdej dodatkowej sekcji `##` w regule).

- Reguła bramki przeglądu: [`rules/media-asset-review-gate.md`](../rules/media-asset-review-gate.md)
- Reguła wejść do generatora: [`rules/media-higgsfield-inputs-policy.md`](../rules/media-higgsfield-inputs-policy.md)
- Reguła wersjonowania plików: [`rules/media-headers-versioning.md`](../rules/media-headers-versioning.md)

**Prawdziwy dziennik żyje w repo strony: `site/media/SOURCES.md`** (jeden wpis na plik w
`site/public/media/` i `site/public/thumbs/`). Ten plik jest wzorcem formatu, nie miejscem zapisu
realnych przeglądów: nie kopiuj tu wyników, tylko trzymaj tu format i zmieniaj go świadomie.

Kolejność w `SOURCES.md` dla jednego assetu: (1) wpis wejść i generacji
(`media-higgsfield-inputs-policy`), (2) tabela przeglądu 12 pozycji z werdyktem
(`media-asset-review-gate`). Asset bez `WYNIK: PASS 12/12` nie wchodzi do `site/public/`.

## 1. Wzór: tabela przeglądu assetu (media-asset-review-gate)

Wypełnia agent `media-auditor` (read-only), potwierdza Karol („oko marki"). Wszystkie 12 pozycji
musi być `TAK`; `FAIL` = numery pozycji + decyzja (dogrywka / postprodukcja / odrzucenie).
Nowa wersja pliku (`-v2`) = nowy przegląd od zera.

```
## hero-v1 · przegląd (2026-09-2x) · audytor: media-auditor · potwierdził: Karol
| # | wynik | dowód |
| 1 | TAK | 2/2 osób: „nie widać"; brak AI-tell na spawie (psnr 47,3 dB) |
| 2 | TAK | 10 klatek fps=1: brak sylwetek |
| 3 | TAK | tesseract 10 klatek: 0 znaków |
| 4 | TAK | H śr. 214°, S 11 %; najjaśniejszy px (178,186,196) |
| 5 | TAK | DOM bez <video>: treść identyczna |
| 6 | TAK | klatka YMAX 6,8 s + overlay: lead 6,1:1, H1 9,4:1 |
| 7 | TAK | iPhone OLED 100 %: brak pasów; ΔYAVG max 0,9 % |
| 8 | TAK | psnr last/first 47,3 dB |
| 9 | TAK | poster vs klatka 0: 51,0 dB |
| 10 | TAK | webm 1 402 KB · mp4 1 488 KB · poster 54 KB · 24 fps · -an · 9,96 s |
| 11 | TAK | obok master-still-v1: ta sama satyna, key light L-górny |
| 12 | TAK | image_references = media/src/master-still-v1.png |
WYNIK: PASS 12/12 → public/media/hero-v1.*
```

Numery pozycji 1–12 są zdefiniowane w `rules/media-asset-review-gate.md` (tabela w sekcji
`## Zasada`); dziennik podaje tylko wynik i dowód, nigdy nie przepisuje pytań.

## 2. Wzór: wpis wejść i generacji (media-higgsfield-inputs-policy)

Jeden wpis na asset, uzupełniany PRZED generacją (wejścia, prompt) i po niej (koszt, wybór,
postprodukcja, usunięcie generacji z konta dostawcy).

```
## hero-v1 (2026-09-2x)
- model: kling3_0 · mode: std → pro (finał) · duration: 10 · sound: off · AR 16:9
- start_image = end_image: media/src/master-still-v1.png (nano_banana_pro 4k, T-IMG-1, generacja <ID>)
- prompt: [T-VID-1 pełny tekst]
- podejścia: 6 × std (14 kr) + 2 × pro (30 kr) = 144 kr · plan: PLUS (faktura JDG)
- wybrany: generacja <ID> (podejście 5) · odrzucone: 1–4 (flicker), 6 (dryf ekspozycji)
- postprodukcja: ffmpeg cfr 24 → trim N-1 → crop 1920×820 → webm crf33 (1 402 KB) / mp4 crf24 (1 488 KB) / poster q80 (54 KB)
- wynik: public/media/hero-v1.{webm,mp4,poster.webp,lqip.webp}
- generacje na koncie usunięte: 2026-10-xx (po sprincie)
```

Twarde warunki wpisu (z reguły): `image_references` wyłącznie z `site/media/src/` (własne stille,
rendery Blender/three.js); zero zrzutów narzędzi, danych klientów, twarzy i materiałów firmy
źródłowej; prompt bez nazw firm, produktów i osób; źródła wideo (`site/media/src/*.mp4`, `*.mov`)
poza gitem.

## 3. Test dziennika (jedno miejsce, jeden grep)

```bash
# każdy plik w public/media ma wpis i PASS 12/12 w site/media/SOURCES.md
for f in site/public/media/*.webm; do b=$(basename "$f" .webm); grep -A 16 "## $b" site/media/SOURCES.md | grep -q 'WYNIK: PASS 12/12' || echo "BRAK PASS dla $b"; done
[ -f site/media/SOURCES.md ] || echo "BRAK SOURCES.md"
```
