---
id: perf-images-policy
title: Obrazy: WebP (AVIF opcjonalnie), srcset dla ram i portretów, jawne width/height (CLS 0), loading lazy poniżej folda, limity rozmiarów, zero PNG/JPG w treści
impact: HIGH
tags: [perf, images, cls, lcp, webp]
source: synthesis §2.3 S3/§2.6.2 M1–M2/§2.4.9 · taste §7.6 (6.D) · motion-dev §8.8 (obrazy bez wymiarów) · WIG (vercel.md)
added: 2026-09-12
---

## Zasada

| Obraz | Format | Wymiary | Limit | Atrybuty |
|---|---|---|---|---|
| **Kadr produktu w hero** (= poster nagrania = element LCP) | WebP | 1600×1000 (+ 800×500 w `srcset`) | ≤ 110 KB / ≤ 55 KB | `fetchPriority="high"`, bez lazy, klasa `hero-shot` (`perf-lcp-poster-preload`) |
| **Grunt stalowy hero** (tekstura, still Higgsfield) | WebP | 1600 px (+ 800 px) | ≤ 70 KB / ≤ 30 KB | `loading="lazy"`, `decoding="async"`, `aria-hidden`, **nigdy preload, nigdy `fetchpriority`**; wypada bez wpływu na treść |
| **Kafel ściany narzędzi** | WebP | 480×300 (+ 320×200) | ≤ 30 KB / ≤ 16 KB | `loading="lazy"`, `decoding="async"`, `alt=""` (nazwa stoi obok w DOM) |
| Zrzut demo w ramie S3 / hub | WebP | 1280×800 (+ 640×400 w `srcset`) | ≤ 120 KB / ≤ 40 KB | `loading="lazy"` poza pierwszą ramą, `decoding="async"`, `sizes="(min-width: 1024px) 50vw, 100vw"` |
| Miniatura karty | WebP | 640×400 | ≤ 40 KB | `loading="lazy"` |
| Portret foundera | WebP | 960×1200 (+ 480×600) | ≤ 90 KB | `loading="lazy"`, `srcset`, duotone w Photoshop lokalnie |
| Kadr „ścieżki wyliczenia" w S7 | WebP | 1200×1500 (4:5) | ≤ 120 KB | `loading="lazy"` (still generatywny macro **wypadł**: sekcja o determinizmie ma być ilustrowana dowodem determinizmu) |
| OG per trasa | PNG (wymóg crawlerów social) | 1200×630 | ≤ 200 KB | generowany `og.mjs` (faza 3), deterministyczny |
| Ikony | SVG inline (lucide) | 20/24 px | n/d | `aria-hidden` gdy dekoracyjne |
| Schematy (`KsefFlow`, `CollaborationFlow`) | SVG inline | `viewBox` | ≤ 12 KB | tokeny kolorów, statyczne |

Reguły:
1. Każdy `<img>` ma `width` i `height` (albo `aspect-ratio` w CSS na kontenerze) → CLS 0; nigdy obraz bez wymiarów w `whileInView` (przesunięcia layoutu po wejściu).
2. `alt`: pusty (`alt=""`) dla dekoracji i zrzutów opisanych tekstem obok; opisowy dla portretów („Karol, współzałożyciel") i schematów bez tekstu w DOM.
3. Poniżej folda `loading="lazy"` + `decoding="async"`; nad foldem nigdy `lazy`.
4. Brak PNG/JPG w `src/` i `public/media` poza OG i `apple-touch-icon`/`favicon`; konwersja przez `sharp` w `scripts/shoot-tools.mjs`/`og.mjs` (bez npx: `node scripts/...`).
5. Zrzuty dem: deterministyczne (te same dane = identyczny plik), po „Załaduj przykład", bez nazwy firmy źródłowej/produktu w UI (grep w DOM przed zrzutem), ciemny motyw. Warunek zrzutu to `[data-dashboard][data-ready='true']` USTAWIONE PO dociągnięciu chunku (`perf-code-split-dashboards` p.6: flaga wewnątrz `Suspense`, nigdy na wrapperze od stanu `mounted`), plus pas bezpieczeństwa: w kontenerze nie ma już `.skel`, a `document.fonts.ready` jest rozwiązane. Bez tego zrzut łapie raz dashboard, raz skeleton i dwa przebiegi dają różne `sha256`.
6. Obrazy hero/ramy w kontenerze `overflow: hidden` z `object-fit: cover`; `<picture>` z AVIF tylko, gdy oszczędność ≥ 25 % i plik przechodzi przegląd na OLED (banding AVIF na gradientach).

## Mechanizm awarii (dlaczego)

- Obraz bez wymiarów = layout shift przy dociągnięciu (CLS), a przy `whileInView` błędne offsety IO (motion-dev §8.8); na podstronie narzędzia persona z Google widzi skaczący układ.
- JPG 300 KB zrzutu × 4 ramy na home = 1,2 MB transferu na 4G; budżet mobile `/` ≤ 350 KB bez wideo.
- `loading="lazy"` nad foldem opóźnia LCP; brak lazy poniżej folda ładuje 13 obrazów huba naraz (13 = KARTY narzędzi w `tools.ts`: 12 dem + KSeF; dashboardów jest 12).
- Grunt hero jest **dekoracją**: gdyby dostał `fetchpriority` albo preload, konkurowałby z kadrem produktu o LCP i odbierał budżet ścieżce krytycznej, a to jedyna warstwa hero, którą wolno zdjąć bez straty treści.
- Niedeterministyczne zrzuty (data w UI, losowe ID) zmieniają się przy każdym buildzie → cache immutable nie działa, git puchnie. Ten sam skutek ma zrzut zrobiony za wcześnie: `data-ready` ustawione przed dociągnięciem chunku = wyścig sieci ze zrzutem.

## Niepoprawnie

```tsx
<img src="/screens/raport.png" className="w-full" />                                  // PNG 640 KB, brak wymiarów/alt/lazy
<m.img initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} src={thumb} />           // bez width/height → CLS + złe offsety IO
```

## Poprawnie

```tsx
<a className="case-frame" href={`/narzedzia/${tool.slug}`}>
  <img
    src={tool.media.wide}
    srcSet={`${tool.media.thumb} 640w, ${tool.media.wide} 1280w`}
    sizes="(min-width: 1024px) 50vw, 100vw"
    width={1280} height={800}
    alt=""
    loading={index === 0 ? undefined : "lazy"}
    decoding="async"
  />
</a>
```

```js
// scripts/shoot-tools.mjs (fragment): WebP q80, dwa rozmiary, deterministyczne
// wzorzec marki źródłowej trzymamy w JEDNYM miejscu (brand-no-nuconic); tutaj tylko go czytamy
const SRC_BRAND_RE = new RegExp(process.env.SRC_BRAND_RE ?? "", "i");
if (!SRC_BRAND_RE.source || SRC_BRAND_RE.source === "(?:)") throw new Error("brak SRC_BRAND_RE (patrz brand-no-nuconic)");

await page.goto(`${base}/narzedzia/${slug}`);
await page.waitForSelector("[data-dashboard][data-ready='true']");          // flaga PO Suspense
await page.waitForSelector("[data-dashboard] .skel", { state: "detached" }); // pas bezpieczeństwa
await page.evaluate(() => document.fonts.ready);
const html = await page.content(); if (SRC_BRAND_RE.test(html)) throw new Error(`marka źródłowa w DOM: ${slug}`);
const png = await page.locator("[data-dashboard]").screenshot();
await sharp(png).resize(1280, 800, { fit: "cover" }).webp({ quality: 80 }).toFile(`public/media/tools/${slug}-v1-1280.webp`);
await sharp(png).resize(640, 400, { fit: "cover" }).webp({ quality: 78 }).toFile(`public/thumbs/${slug}-v1-640.webp`);
```

## Test

```bash
# formaty (oczekiwane: 0 poza OG/ikonami)
find site/public/media site/public/thumbs site/src -type f \( -name '*.png' -o -name '*.jpg' -o -name '*.jpeg' \) 2>/dev/null | grep -vE 'og/|apple-touch-icon|favicon|klarow-logo'
# limity rozmiarów
find site/public/media/tools -name '*-1280.webp' -size +120k 2>/dev/null; find site/public/thumbs -name '*.webp' -size +40k 2>/dev/null; find site/public/media/founders -name '*.webp' -size +90k 2>/dev/null
# width/height/alt na KAŻDYM <img> — dopasowanie na ELEMENCIE, nie na linii
# (JSX jest wieloliniowy: w bloku „Poprawnie" `<img` stoi w osobnej linii, a `width`/`height` dwie niżej,
#  więc `grep '<img' | grep -v width=` flagowałby własny wzorzec tej reguły)
node -e '
const fs = require("node:fs"), path = require("node:path");
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
const els = (src, tag) => { const out = [], re = new RegExp("<" + tag + "\\b", "g"); let m;
  while ((m = re.exec(src))) { let i = re.lastIndex, d = 0;
    for (; i < src.length; i++) { const c = src[i]; if (c === "{") d++; else if (c === "}") d--; else if (c === ">" && d === 0) break; }
    out.push(src.slice(m.index, i + 1)); }
  return out; };
let bad = 0;
for (const f of walk("site/src").filter((x) => x.endsWith(".tsx"))) {
  const src = fs.readFileSync(f, "utf8");
  for (const el of els(src, "img")) for (const a of ["width", "height", "alt"]) if (!new RegExp("\\b" + a + "=").test(el)) { console.log(f + ": BRAK " + a + " → " + el.slice(0, 70).replace(/\s+/g, " ")); bad++; }
}
console.log(bad === 0 ? "img-attrs OK" : "img-attrs: " + bad + " naruszen");'
# (docelowo: ESLint jsx-a11y/alt-text + własna reguła na width/height — bramka node zostaje dla CI)
# lazy nad foldem (Hero) = 0; lazy poniżej folda (hub, ramy 2–4) ≥ 1
grep -rnE 'loading="lazy"' site/src/components/Hero.tsx site/src/components/HeroMedia.tsx 2>/dev/null   # = 0
grep -rcE 'loading=' site/src/components/CaseFrame.tsx site/src/pages/Tools.tsx 2>/dev/null               # ≥ 1
# determinizm zrzutów: dwa przebiegi shoot-tools.mjs → identyczne sumy (SRC_BRAND_RE z brand-no-nuconic)
cd site && SRC_BRAND_RE="$SRC_BRAND_RE" node scripts/shoot-tools.mjs && sha256sum public/media/tools/*.webp > /tmp/a && node scripts/shoot-tools.mjs && sha256sum public/media/tools/*.webp | diff - /tmp/a && echo OK
# Lighthouse: CLS < 0,05; „Properly size images", „Serve images in next-gen formats" bez ostrzeżeń
```

## Wyjątki

- `favicon.ico`, `apple-touch-icon.png`, `klarow-logo-512.png` (JSON-LD `logo`) zostają w PNG/ICO.
- OG per trasa PNG ≤ 200 KB (LinkedIn/X nie renderują WebP w podglądach niezawodnie).
