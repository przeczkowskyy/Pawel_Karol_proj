---
id: media-video-placement
title: Wideo i tło wyłącznie w kontenerze hero (absolute + overflow:hidden) albo w .bg-layer; nigdy nowy position:fixed ani kontekst stackingu w .content-layer
impact: BLOCKER
tags: [media, video, ios, stacking, layout]
source: CLAUDE.md „Stan operacyjny" 2026-07-24/26 (bug iOS „samo tło") · site-audit §1.7 · higgsfield §4.5 p.9/§11 · synthesis §2.3 S1/§2.8 p.10 · feasibility-perf §9 p.7 · globals.css:13-54
added: 2026-09-12
---

## Zasada

Szkielet strony jest zamrożony (`site/src/styles/globals.css:13-54`):

- `.bg-layer { position: fixed; inset: 0; z-index: -1; pointer-events: none; isolation: isolate }` z gradientem awaryjnym `#121212`,
- `.content-layer { position: relative }` BEZ `z-index`, BEZ `isolation`, BEZ `transform`, BEZ `filter`, BEZ `will-change`, BEZ `contain: paint` (żadnej właściwości tworzącej kontekst stackingu ani containing block).

Media ruchome mają DOKŁADNIE dwa dozwolone miejsca:

1. **Kontener hero**: `.hero { position: relative; overflow: hidden }` + `.hero-media { position: absolute; inset: 0; overflow: hidden }` z `<img>` posterem (kadr produktu), opcjonalnym `<img>` gruntu i `<video>` (`object-fit: cover`); ewentualny overlay jako `::after` w tym samym kontenerze. Kolejność malowania wynika z **kolejności w DOM**, nie z `z-index`: grunt → poster → wideo → `::after` → `.hero-content` (`position: relative`, bez `z-index`); przycisk pauzy stoi PO `.hero-media`, więc maluje się wyżej bez `z-index`.
2. **Kafel ściany S3** dla klipów hover: `.tool-tile { position: relative; overflow: hidden }` + `<video>` `position: absolute` z longhandami, `pointer-events: none`. Nigdy `fixed`, nigdy poza kafel.
3. **`.bg-layer`** (tylko plan B: `GLSLHills` canvas na desktopie; w v1 nieaktywny, bo `three` jest poza `dependencies`).

Zakazane w `.content-layer` i jego potomkach: nowe `position: fixed` (poza `Navbar` i `<dialog>` natywnym), `z-index` na wrapperach sekcji, `transform`/`filter`/`backdrop-filter`/`perspective`/`will-change` na przodkach elementów `fixed`/`sticky`, `mix-blend-mode` na elemencie zawierającym treść, nieprzezroczyste tło na wrapperze roota (`#121212` na `.content-layer` zasłoniło tło w commicie 640a6f9: „Fix: tło znów widoczne").

Tailwind: zero `fixed`, `inset-0`, `z-*` na elementach layoutu (szkielet na czystym CSS: stare WebKity potrafią wyciąć `@layer` Tailwinda v4).

## Mechanizm awarii (dlaczego)

- 2026-07-26 (zreprodukowane zrzutem `?debug=1`): `.content-layer` z `z-index: 10` był kontekstem stackingu; iOS pod `overflow: hidden` nie malował uwięzionych w nim elementów `fixed` → strona „samo tło". Fix: `.content-layer` bez z-index, `.bg-layer` z `z-index: -1`. Każdy nowy kontekst stackingu na tej ścieżce może przywrócić bug, którego nie da się odtworzyć w Playwright/WebKit na Windows (software WebKit nie komponuje jak GPU iOS).
- 2026-07-24: pełnoekranowy `fixed` canvas WebGL był komponowany przez GPU iOS nad rodzeństwem `fixed`; stąd zasada „zero canvasu/wideo `fixed` w treści; na coarse nic ruchomego".
- `transform`/`filter`/`perspective` na przodku tworzą containing block dla `position: fixed` (Navbar/dialog lądują w środku sekcji zamiast w viewporcie); kit opisuje to samo przy `animation-fill-mode` (`app.css:150-161`).
- `mix-blend-mode: screen` na `<video>` w kontenerze hero jest OK (blend z posterem pod spodem), ale na elemencie z tekstem zmienia kontrast poniżej AA.

## Niepoprawnie

```tsx
<div className="content-layer" style={{ zIndex: 10, background: "#121212" }}>       // kontekst stackingu + zasłania tło
  <video className="fixed inset-0 -z-10 object-cover" … />                          // fixed w treści
  <section className="relative z-20 backdrop-blur-sm">…</section>                    // z-index + backdrop-filter na sekcji
```

```css
.content-layer { transform: translateZ(0); will-change: transform; }   /* „promocja warstwy" psuje fixed */
```

## Poprawnie

```css
/* globals.css: bez zmian */
.bg-layer { position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: -1; pointer-events: none; isolation: isolate; background: … #121212; }
.content-layer { position: relative; display: flex; flex-direction: column; min-height: 100dvh; }

/* hero: media absolute w kontenerze z overflow hidden */
.hero { position: relative; overflow: hidden; min-height: min(86dvh, 820px); }
.hero-media { position: absolute; top: 0; right: 0; bottom: 0; left: 0; overflow: hidden; }
.hero-media img, .hero-media video { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; }
.hero-media::after { content: ""; position: absolute; top: 0; right: 0; bottom: 0; left: 0; background: linear-gradient(180deg, rgba(18,18,18,.15), rgba(18,18,18,.85)); }
.hero-content { position: relative; }   /* tekst nad mediami przez kolejność w DOM, bez z-index */
```

## Test

```bash
# szkielet zamrożony
grep -nE '^\.content-layer\s*\{' -A 12 site/src/styles/globals.css | grep -E 'z-index|isolation|transform|filter|will-change|contain|background' && echo "content-layer: ZAKAZANA właściwość"
grep -nE '^\.bg-layer' -A 25 site/src/styles/globals.css | grep -qE 'z-index:\s*-1' || echo "bg-layer: brak z-index:-1"
# nowe fixed/z-index w komponentach (oczekiwane: tylko Navbar, dialog)
grep -rnE 'position:\s*fixed|className="[^"]*\bfixed\b' site/src --include=*.tsx --include=*.css | grep -vE 'Navbar|BookingDialog|BookingModal|bg-layer|globals\.css'
grep -rnE 'z-index|\bz-\[?[0-9]' site/src --include=*.tsx --include=*.css | grep -vE 'Navbar|BookingDialog|BookingModal|bg-layer|company-ui\.css|thead|sticky'
# wideo tylko w .hero-media (hero) i .tool-tile (klipy hover)
grep -rnE '<video' -B 3 site/src/components/HeroMedia.tsx | grep -q 'hero-media' || echo "video poza .hero-media"
grep -rnE '<video' -B 3 site/src/components/ToolWall.tsx | grep -q 'tool-tile' || echo "klip poza .tool-tile"
grep -rlE '<video' site/src | grep -vE 'HeroMedia\.tsx|ToolWall\.tsx'   # = 0
# transform/filter na przodkach fixed (ocena: DevTools → Navbar → Computed → sprawdzić przodków)
# realny iPhone Karola po każdej zmianie w hero/globals: pełna treść widoczna; ?debug=1 zrzut w razie wątpliwości.
```

Docelowo krok `stacking` w `scripts/verify-site.mjs` + WebKit 390×844 `elementFromPoint` w środku ekranu = element treści (jak w sesji 2026-07-24).

## Wyjątki

- `Navbar` (`position: sticky`/`fixed`, `z-index` własny, tło nieprzezroczyste `--surface-overlay`) i natywny `<dialog>` (top layer, bez z-index) są jedynymi elementami poza flow.
- `isolation: isolate` na `.bg-layer` jest częścią fixu, nie naruszeniem.
