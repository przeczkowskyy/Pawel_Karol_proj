---
id: media-higgsfield-inputs-policy
title: Higgsfield: do modelu trafiają wyłącznie abstrakcje i własne stille; zero zrzutów narzędzi, danych, twarzy i materiałów firmy źródłowej; log SOURCES.md; finały tylko na planie płatnym; usuwać generacje po sprincie
impact: BLOCKER
tags: [media, higgsfield, licensing, privacy, brand]
source: higgsfield §0 p.8/§8 (ToU 26.07.2026: licencja treningowa, brak gwarancji IP, znak wodny Free) · synthesis §2.6.1 · CLAUDE.md zasada #3 (marka firmy źródłowej nie publicznie) · peer-legal
added: 2026-09-12
---

## Zasada

Higgsfield (przez MCP „creative engine" w Claude Code) jest narzędziem do 2–3 assetów, które są nieopłacalne ręcznie (hero-loop, master still, OG). Obowiązuje:

1. **Wejścia (prompt, `image_references`, `start_image`, `end_image`, `video_references`)**: wyłącznie (a) tekst z szablonów T-IMG/T-VID (`references/higgsfield-pipeline.md`), (b) stille wygenerowane w tym samym pipeline, (c) własne abstrakcyjne rendery (Blender/three.js) — w tym izolowany render canvasu GLSL z osobnej strony testowej `?bg-only=1` (zero UI, zero tekstu, zero danych dem), nagrany lokalnie do `site/media/src/`. ZAKAZ wgrywania: zrzutów ekranu narzędzi (własnych i cudzych), plików Excel/CSV/PDF, danych klientów lub leadów, dokumentów, zdjęć founderów i jakichkolwiek twarzy, zdjęć hal/biur/placów budowy, logotypów, materiałów z okresu pracy dla firmy źródłowej (obowiązuje umowa IP), nagrań ekranu strony z danymi dem (nawet fikcyjnymi: model uczy się layoutu naszych narzędzi).
2. **Wyjścia**: żadnego tekstu, cyfr, logo, ludzi, rąk, UI w kadrze (negatywy w każdym prompcie; przegląd w `media-asset-review-gate`). Output nie jest używany do trenowania własnych modeli (zakaz ToU).
3. **Plan**: dowód stylu na trialu (100 kr, $0, `cancel_trial_auto_renewal` + `confirm_trial_cancel` w dniu 3), finały WYŁĄCZNIE na planie płatnym — **PLUS $49/mies. (1 000 kr) wystarcza dla ZAKRESU v1** (1 pętla hero + 3 stille ≈ 200–395 kr; rozpiska w `references/higgsfield-pipeline.md` §2). `research/higgsfield.md` §3.2 rekomenduje ULTRA ($129, 3 000 kr) i ta rekomendacja obowiązuje, gdy wróci PEŁNA lista assetów (przejścia, tła sekcyjne, mikro-animacje ikon: ≈ 1 300–2 200 kr) — wtedy plan zakupu przelicza się od nowa. Free = znak wodny + brak prawa użytku komercyjnego. Konto i faktura: JDG Pawła (D-17). Bez API `cloud.higgsfield.ai`, bez planu rocznego bez decyzji o stałej produkcji treści.
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
# zero sekretów/skryptów Higgsfield w repo (oczekiwane: 0)
grep -rniE 'higgsfield' site/src site/scripts site/package.json .env* 2>/dev/null
grep -rnE 'HIGGSFIELD|hf_[a-z0-9]{20,}|Authorization: Key' . --include=*.{ts,tsx,mjs,js,json,md} -l 2>/dev/null | grep -v klarow-guardian
# przegląd ręczny (founder + agent media-auditor) przed każdą generacją: lista image_references zawiera wyłącznie pliki z site/media/src/ wygenerowane w pipeline lub rendery Blender/three.js; prompt bez nazw firm, produktów, osób.
# po sprincie: `show_generations` w MCP = 0 pozycji; wpis „generacje usunięte: <data>" w SOURCES.md.
```

## Wyjątki

- Brak. Reguła obowiązuje także dla innych generatorów (Midjourney, Runway, Sora, Veo przez inne MCP) i dla „darmowych" narzędzi online: ta sama polityka wejść.
