# Katalog `media/` usunięty celowo

Paczka zawierała dwa kafle tła jako PNG: `tlo-d-kafel.png` (10,7 MB) i `tlo-m-kafel.png` (5,9 MB).
Razem 16 MB w **publicznym** repozytorium, bez żadnej korzyści — to te same obrazy, które mamy już jako WebP:

| Plik w paczce | Wymiary | Nasz odpowiednik | Wymiary | Rozmiar |
|---|---|---|---|---|
| `media/tlo-m-kafel.png` | 1080×3870 | `site/public/podglad/tlo-m-kafel.webp` | 1440×5160 | 124 KB |
| `media/tlo-d-kafel.png` | 2560×2858 | `site/public/podglad/tlo-d-kafel.webp` | 2560×2858 | 156 KB |

Wersja mobilna z paczki jest **mniejsza** od naszej (1080 px zamiast 1440 px), więc i tak nie nadawała się na produkcję.
Przy C1 używamy naszych plików, generowanych przepisem z `design/prompty/higgsfield/03-pipeline-ffmpeg.md`, sekcja H.
Oryginały 4K: `_mastery/` (poza gitem).
