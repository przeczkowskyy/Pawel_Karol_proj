# Nowy asset: obraz, poster, wideo, zrzut, OG, font (checklista przed wejściem do `public/`)

> Uzupełnia `checklists/definition-of-done.md` §E i bramkę 12 pozycji z `rules/media-asset-review-gate.md`.
> Pipeline generatywny (modele, prompty, ffmpeg, budżety): `references/higgsfield-pipeline.md`.
> Wynik przeglądu (PASS 12/12 albo FAIL z numerami) wpisujesz do `site/media/SOURCES.md` przy assecie
> i do `references/asset-review-log.md`. Asset bez `PASS` nie wchodzi do `site/public/`.
> Kopiuj do `.claude/work/<zadanie>/plan.md` i odhaczaj.

## 1. Zanim powstanie (decyzja, nie produkcja)

- [ ] Sekcja bez assetu NIE powstaje: asset jest po to, by coś pokazać, nie by wypełnić miejsce (`design-hero-discipline`, `copy-minimal-text`)
- [ ] Wybrany typ: zrzut dema (Playwright/WebKit, preferowany) · poster · pętla wideo · portret · OG · font
- [ ] Zero stocku, zero `picsum`/`unsplash`, zero „fake UI z divów" (`perf-images-policy`, `media-*`)
- [ ] Do generatora nie trafia nic poza abstrakcją i własnymi stillami: zero danych klientów, zero nazwy poprzedniej firmy, zero twarzy, zero sekretów (`media-higgsfield-inputs-policy`, `secret-no-secrets-in-prompts-or-logs`)
- [ ] Jedno ruchome tło na trasę (wideo ALBO GLSL, nigdy oba); ≤ 1 autoplay `<video>` na trasę (`media-one-autoplay-per-route`)

## 2. Produkcja

- [ ] Zrzut dema: dane przykładowe, `?demo=1`, brak kursora, 1280×800, WebP q80 ≤ 120 KB; w DOM przed zrzutem zero nazwy poprzedniej firmy (grep)
- [ ] Wideo: 6–10 s, ≤ 30 fps, `-an` (bez audio), webm vp9 + mp4 avc1, ≤ 1,5 MB per format (`media-video-budgets`)
- [ ] Poster = **pierwsza klatka pętli** (nie „najładniejsza" ze środka), ≤ 60 KB, 1920×820 (`media-poster-first-frame`)
- [ ] Miniatura ≤ 40 KB (640×400), OG 1200×630 ≤ 200 KB, font ≤ 100 KB łącznie (woff2, `unicode-range`)
- [ ] Nazwa z wersją: `hero-v1.poster.webp`, `tools/raport-zarzadczy-v1.webp` (`public/` nie dostaje hasha; `_headers` immutable dla `/media/*`)
- [ ] Metadane wyczyszczone: `grep -a -i nuconic <plik>` → 0; brak promptu i nazwy projektu w EXIF/XMP

## 3. Bramka 12 pozycji (`media-asset-review-gate`) — wszystkie muszą być TAK

- [ ] 1. Osoba spoza zespołu nie rozpozna AI w 5 s
- [ ] 2. Zero ludzi, rąk, twarzy, sylwetek
- [ ] 3. Zero tekstu, cyfr, logo, znaków wodnych, imitacji UI (OCR pusty)
- [ ] 4. Paleta: stal na czerni; zero ciepłych barw (złoto, pomarańcz, neon)
- [ ] 5. Asset zdejmowalny bez straty treści
- [ ] 6. Kontrast tekstu na NAJJAŚNIEJSZEJ klatce: lead ≥ 4,5:1, H1 ≥ 24 px ≥ 3:1 (metoda i overlay: `references/design-tokens.md` §3)
- [ ] 7. Brak bandingu i migotania na OLED (iPhone, 100 % jasności, ciemne pomieszczenie)
- [ ] 8. Spaw pętli niewidoczny (ostatnia klatka = pierwsza)
- [ ] 9. Poster = klatka 0
- [ ] 10. Budżety z §2 spełnione
- [ ] 11. Spójność z kitem (hairline 1 px, satyna, jedno chłodne światło, kamera bez ruchu)
- [ ] 12. Wejścia zgodne z polityką (lista `image_references` w `SOURCES.md`)

## 4. Osadzenie w kodzie

- [ ] `<img>` z `width`, `height`, `alt` (albo `alt=""` dla dekoracji), `loading="lazy"` poniżej folda, `fetchpriority="high"` tylko dla LCP
- [ ] `<video muted playsInline loop poster preload="metadata" aria-hidden>` wyłącznie przez `HeroMedia` w `MediaBoundary`; tylko `pointer: fine`; reduced-motion / saveData / oszczędzanie baterii → poster (`media-video-gating`)
- [ ] `<video>` NIE występuje w shellu prerenderu (`grep -c "<video" site/dist/*.html` = 0)
- [ ] Poster ma `<link rel="preload">` w `index.html` (`perf-lcp-poster-preload`)
- [ ] `_headers`: `/media/*` i `/thumbs/*` immutable (`media-headers-versioning`)

## 5. Zapis i weryfikacja

- [ ] Wpis w `site/media/SOURCES.md`: pochodzenie, licencja/zgoda, prompt bez danych wrażliwych, wynik `PASS 12/12`
- [ ] Wiersz w `references/asset-review-log.md` (data, plik, wynik, kto potwierdził)
- [ ] `node .claude/skills/klarow-guardian/scripts/verify-site.mjs` — budżety bez regresji
- [ ] Zrzuty 390 / 1440 z assetem, w trybie normalnym i reduced-motion, ścieżki w planie
- [ ] Dla zmian w hero: realny iPhone po deployu (pełna treść, brak „samego tła")
