---
id: seo-canonical-og-twitter
title: Canonical bez www i bez parametrów, og:* i twitter:* w prerenderze, og:image per trasa
impact: HIGH
tags: [seo, canonical, open-graph, twitter, prerender, og-image]
source: site-audit.md §3.4 p.13 (twitter:* tylko klientowo), §5 p.3 (canonical bez www) / synthesis §2.8 p.3 (twitter:* w prerender.mjs), S9 (og.mjs: OG per trasa, faza 3), §2.3 Hub (canonical /narzedzia bez ?dzial=) / prerender.mjs:32-51
added: 2026-09-12
---

## Zasada

Każdy prerenderowany HTML (poza `404`) ma w `<head>`: `<link rel="canonical" href="https://klarow.com<path>">` (bez `www`, bez trailing slash poza `/`, bez query; hub z filtrem `?dzial=` kanonizuje do `/narzedzia`), `og:title`, `og:description`, `og:url` (= canonical), `og:type: website`, `og:site_name: Klarow`, `og:image` (1200×630, absolutny URL), `og:locale: pl_PL` (+ `og:locale:alternate: en_US`), `twitter:card: summary_large_image`, `twitter:title`, `twitter:description`, `twitter:image`. `prerender.mjs` zdejmuje z szablonu i wstawia komplet per trasa (dziś zdejmuje 6 tagów, `twitter:*` ustawia tylko klient). Klientowy `<Seo>` ustawia te same wartości po nawigacji SPA (scrapery bez JS czytają HTML, użytkownik dzielący link po nawigacji też dostaje poprawny `og:url`). `og:image` per trasa generowany deterministycznie (`scripts/og.mjs`, SVG → PNG, faza 3); do tego czasu jeden obraz `/klarow-logo-512.png` jest akceptowany z zastrzeżeniem, że 512×512 nie spełnia 1200×630 dla `summary_large_image` (raport LOW).

## Mechanizm awarii (dlaczego)

`twitter:*` ustawiane wyłącznie w `Seo.tsx:51-53` nie istnieje w statycznym HTML, więc LinkedIn/Slack/Teams (scrapery bez JS) pokazują kartę bez tytułu lub z domyślnym tytułem szablonu; LinkedIn to główny kanał ciepłego ruchu (`strategy.md` §3.2). Canonical z parametrami filtrów tworzy w Google 10+ duplikatów huba. `og:url` różny od canonical rozdziela sygnały udostępnień między dwa adresy. Zdjęcie 512×512 na `summary_large_image` jest kadrowane do paska.

## Niepoprawnie

```js
// prerender.mjs: brak twitter:* w head; og:image z szablonu (512×512) dla wszystkich tras
```
```tsx
<Seo path={`/narzedzia?dzial=${dzial}`} />   // canonical z parametrem
```

## Poprawnie

```js
// prerender.mjs (fragment head; replacement jako funkcja)
const head = [
  `<title>${esc(r.title)}</title>`, `<meta name="description" content="${esc(r.description)}" />`,
  `<link rel="canonical" href="${url}" />`,
  `<meta property="og:title" content="${esc(r.title)}" />`, `<meta property="og:description" content="${esc(r.description)}" />`,
  `<meta property="og:url" content="${url}" />`, `<meta property="og:type" content="website" />`, `<meta property="og:site_name" content="Klarow" />`,
  `<meta property="og:locale" content="pl_PL" />`, `<meta property="og:locale:alternate" content="en_US" />`,
  `<meta property="og:image" content="${ORIGIN}${r.ogImage ?? "/og/default.png"}" />`,
  `<meta name="twitter:card" content="summary_large_image" />`, `<meta name="twitter:title" content="${esc(r.title)}" />`,
  `<meta name="twitter:description" content="${esc(r.description)}" />`, `<meta name="twitter:image" content="${ORIGIN}${r.ogImage ?? "/og/default.png"}" />`,
  r.noindex ? `<meta name="robots" content="noindex" />` : "",
  `<script type="application/ld+json" id="seo-jsonld">${jsonLdSafe(r.jsonLd)}</script>`,
].join("\n    ");
```
```tsx
<Seo path="/narzedzia" … />   // canonical stały; filtr w URL, ale nie w canonical
```

## Test

```bash
for f in $(find site/dist -name "*.html" ! -name "404.html"); do
  for k in 'rel="canonical"' 'property="og:url"' 'property="og:image"' 'name="twitter:card"' 'name="twitter:title"'; do
    [ "$(grep -c "$k" "$f")" = 1 ] || echo "FAIL $k $f"; done; done
grep -ohE "rel=\"canonical\" href=\"[^\"]+\"" site/dist/**/*.html site/dist/*.html | grep -E "www\.|\?|/$" | grep -v "klarow.com/\"$"   # 0
grep -c "og:image" site/dist/index.html                                                         # 1
node .claude/skills/klarow-guardian/scripts/verify-site.mjs                                    # m.in. brak <link rel="canonical"> per plik HTML
# PLANOWANE (F3, verify-site.mjs nie zna tego trybu): node .claude/skills/klarow-guardian/scripts/verify-site.mjs --meta-tags
```

Severity: HIGH. Auto-fix dozwolony (fixer `seo-auditor`): dopisanie `twitter:*`/`og:locale` w `prerender.mjs`.

## Wyjątki

`404.html`: canonical i og pominięte, `noindex` obowiązkowy. Do czasu `og.mjs` jeden wspólny `og:image` z raportem LOW o rozmiarze.
