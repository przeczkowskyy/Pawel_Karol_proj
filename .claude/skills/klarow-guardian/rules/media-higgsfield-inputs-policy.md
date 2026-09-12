---
id: media-higgsfield-inputs-policy
title: Higgsfield: do modelu trafiają wyłącznie abstrakcje i własne stille; zero zrzutów I NAGRAŃ narzędzi, danych, twarzy i materiałów firmy źródłowej; log SOURCES.md; zakres v1 mieści się w trialu; usuwać generacje po sprincie
impact: BLOCKER
tags: [media, higgsfield, licensing, privacy, brand]
source: higgsfield §0 p.8/§8 (ToU 26.07.2026: licencja treningowa, brak gwarancji IP, znak wodny Free) · synthesis §2.6.1 · CLAUDE.md zasada #3 (marka firmy źródłowej nie publicznie) · peer-legal
added: 2026-09-12
---

## Zasada

Higgsfield (przez MCP „creative engine" w Claude Code) jest narzędziem do 2–3 assetów, których nie zrobi ani kod, ani nagranie ekranu. **Zakres v1 po decyzji D36 (2026-09-12 wieczór): wyłącznie STATYCZNE stille na stronę** (H1 grunt hero 24 kr, H2 master still 15 kr, H3 tło OG 10 kr, rezerwa 7 kr = **≈ 56 kr, czyli 0 USD w trialu**) plus opcjonalna **pętla na LinkedIn, która nie trafia na stronę** (H4 ≈ 166 kr, jeden miesiąc PLUS 49 USD + VAT). **W `site/public/` nie ma ani jednego pliku wideo z Higgsfielda**: jedyne wideo na stronie to nagrania prawdziwych narzędzi (D37). Obowiązuje:

1. **Wejścia (prompt, `image_references`, `start_image`, `end_image`, `video_references`)**: wyłącznie (a) tekst z szablonów T-IMG/T-VID (`references/higgsfield-pipeline.md`), (b) stille wygenerowane w tym samym pipeline, (c) własne abstrakcyjne rendery (Blender/three.js) — w tym izolowany render canvasu GLSL z osobnej strony testowej `?bg-only=1` (zero UI, zero tekstu, zero danych dem), nagrany lokalnie do `site/media/src/`. ZAKAZ wgrywania: zrzutów ekranu narzędzi (własnych i cudzych), **nagrań ekranu narzędzi z `scripts/record-demos.mjs` (nagranie hero i klipy hover: to layout naszego produktu, model nie ma go widzieć, nawet na danych fikcyjnych)**, plików Excel/CSV/PDF, danych klientów lub leadów, dokumentów, zdjęć founderów i jakichkolwiek twarzy, zdjęć hal/biur/placów budowy, logotypów, materiałów z okresu pracy dla firmy źródłowej (obowiązuje umowa IP), nagrań ekranu strony z danymi dem.
2. **Wyjścia**: żadnego tekstu, cyfr, logo, ludzi, rąk, UI w kadrze (negatywy w każdym prompcie; przegląd w `media-asset-review-gate`). Output nie jest używany do trenowania własnych modeli (zakaz ToU).
3. **Plan i dwie rozłączne decyzje finansowe**: **zakres strony (H1–H3, ≈ 56 kr) mieści się w trialu 3-dniowym** (100 kr, **0 USD**, karta wymagana, **auto-odnowienie na PLUS 49 USD**; `cancel_trial_auto_renewal` + `confirm_trial_cancel` w dniu ≤ 3, dwa przypomnienia w kalendarzu ustawione PRZED klikiem). Stille to obrazy, nie wideo, więc na trialu nie ma znaku wodnego blokującego użytek na stronie; **przed użyciem finału potwierdzamy prawa komercyjne planu, z którego powstał** (`strona-v2-plan.md` §7.2 p.4) i zapisujemy plan w `SOURCES.md`. **Zakres social (H4, pętla na LinkedIn poza stroną) wymaga planu płatnego: PLUS 49 USD/mies. (1 000 kr)** i jest osobną decyzją, która nie blokuje publikacji. ULTRA ($129) **nie jest potrzebne**: rekomendacja z `research/higgsfield.md` §3.2 dotyczy PEŁNEJ listy assetów (przejścia, tła sekcyjne, mikro-animacje ikon ≈ 1 300–2 200 kr), której w v1 nie ma. Free = znak wodny i brak prawa użytku komercyjnego. **Konto i karta: administrator danych, faktura na osobę fizyczną, koszt nieodliczalny (D25, D27; nieaktualne „JDG Pawła" z D-17).** Bez API `cloud.higgsfield.ai`, bez planu rocznego. **Agent nie uruchamia trialu ani zakupu**: przygotowuje krok, pokazuje `get_cost` i czeka na świadomą akcję foundera.
4. **Log**: każda generacja użyta (i każda odrzucona seria) ma wpis w `site/media/SOURCES.md`: data, model (`id` MCP), parametry, prompt (pełny), `image_references` (nazwa naszego pliku), ID generacji, koszt w kredytach, decyzja (użyty/odrzucony + powód), ścieżka pliku wynikowego z wersją. Bez sekretów, bez URL-i CDN po 7 dniach (wygasają).
5. **Sprzątanie**: po zakończeniu sprintu assetów wszystkie generacje są usuwane z konta Higgsfield (kończy licencję treningową ToU), pliki źródłowe zostają lokalnie w `site/media/src/` (poza `public/`, w gicie tylko finały ≤ 1,5 MB; źródła > 5 MB w `.gitignore`).
6. **Higiena kredytów**: `get_cost: true` przed serią, `sound: off`/`generate_audio: false` zawsze, 480p/720p do selekcji, 1080p tylko finał, `generate_video_batch` + `jobs_wait` dla równoległych podejść, `mode: std` → `pro` tylko dla 2 finałów.
7. **Zero automatyzacji generacji w repo**: żadnych skryptów, kluczy API ani tokenów Higgsfield w `site/`, `scripts/`, `.env`; generacja tylko interaktywnie przez MCP w sesji z founderem.

## Mechanizm awarii (dlaczego)

- ToU 26.07.2026: Higgsfield ma licencję na trening modeli na inputach i outputach (wygasa po usunięciu treści/konta), nie gwarantuje oryginalności/IP outputu, przerzuca AUP dostawców (Google/OpenAI/ByteDance). Zrzut narzędzia lub dane klienta w prompcie = przekazanie ich stronie trzeciej do treningu = naruszenie zasady #3 CLAUDE.md, umowy IP i (przy danych osobowych) RODO.
- Twarze founderów w generatorze = potencjalne deepfake'i i naruszenie prywatności; portrety powstają w Photoshopie lokalnie (synthesis M2).
- Free plan: znak wodny na finałach i brak prawa komercyjnego; trial auto-odnawia się na $49 (ryzyko operacyjne wpisane przez 3 sędziów).
- Bez `SOURCES.md` nie da się dogrywać wariantów w tym samym stylu (brak `seed` w MCP; spójność = `image_references` + identyczne prompty) ani udowodnić pochodzenia assetu przy pytaniu klienta „skąd to?".
- Skrypt z tokenem w repo = sekret w gicie (hook `PreToolUse` blokuje wzorce kluczy, ale nie każdy token wygląda jak klucz).

## Niepoprawnie

```
# prompt do nano_banana_pro
image_references: ["C:/Users/.../Desktop/zrzut-dashboard-produkcji.png", "C:/Users/.../hala-klienta.jpg"]
"Make a cinematic version of this dashboard with our KLAROW logo and the numbers from the spreadsheet"
```

```
# site/media/SOURCES.md: brak pliku; finały pobrane z planu Free (znak wodny w rogu)
```

## Poprawnie

Wejścia, prompt, koszt, wybór i postprodukcja idą do dziennika `site/media/SOURCES.md` wg wzoru
w [`references/asset-review-log.md`](../references/asset-review-log.md) §2 (pełny wpis `hero-v1`
z polami: model, `start_image`/`end_image`, prompt, podejścia i koszt, wybrana generacja,
postprodukcja, data usunięcia generacji z konta dostawcy).

```
# site/media/SOURCES.md (wpis; pełny wzór: references/asset-review-log.md §2)
## hero-v1 (2026-09-2x)
- start_image = end_image: media/src/master-still-v1.png   ← wyłącznie własny still z site/media/src/
- prompt: [T-VID-1 pełny tekst]                            ← bez nazw firm, produktów, osób
- generacje na koncie usunięte: 2026-10-xx (po sprincie)
```

```
# .gitignore (fragment)
site/media/src/*.mp4
site/media/src/*.mov
```

## Test

```bash
# log istnieje i ma wpis dla każdego pliku w public/media
[ -f site/media/SOURCES.md ] || echo "BRAK SOURCES.md"
for f in $(ls site/public/media/*.{webm,mp4} 2>/dev/null); do b=$(basename "$f" | sed -E 's/\.(webm|mp4)$//'); grep -q "$b" site/media/SOURCES.md || echo "BRAK wpisu dla $b"; done
# zero NAGRAŃ narzędzi wśród wejść: w SOURCES.md żaden wpis start_image/end_image/image_references
# nie może wskazywać na media/tools/*, public/media/* ani na plik z record-demos (oczekiwane: 0)
grep -nE '(start_image|end_image|image_references).*(tools/|public/media|record-demos|hero-production)' site/media/SOURCES.md
# zero sekretów/skryptów Higgsfield w repo (oczekiwane: 0)
grep -rniE 'higgsfield' site/src site/scripts site/package.json .env* 2>/dev/null
grep -rnE 'HIGGSFIELD|hf_[a-z0-9]{20,}|Authorization: Key' . --include=*.{ts,tsx,mjs,js,json,md} -l 2>/dev/null | grep -v klarow-guardian
# przegląd ręczny (founder + agent media-auditor) przed każdą generacją: lista image_references zawiera wyłącznie pliki z site/media/src/ wygenerowane w pipeline lub rendery Blender/three.js; prompt bez nazw firm, produktów, osób.
# po sprincie: `show_generations` w MCP = 0 pozycji; wpis „generacje usunięte: <data>" w SOURCES.md.
```

## Wyjątki

- Brak. Reguła obowiązuje także dla innych generatorów (Midjourney, Runway, Sora, Veo przez inne MCP) i dla „darmowych" narzędzi online: ta sama polityka wejść.
