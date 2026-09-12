---
id: brand-wordmark-only
title: Znak marki to tekstowy wordmark KLAROW, płaski, bez logo graficznego
impact: BLOCKER
tags: [brand, wordmark, logo, navbar, hero]
source: CLAUDE.md #1 / synthesis §2.2 (nawigacja) / taste §11.F (wordmark never changes silently)
added: 2026-09-12
---

## Zasada

Znak marki na stronie i w narzędziach to **tekst `KLAROW`** renderowany klasą `.brand-word`
(komponent `BrandMark` z kitu), w jednym płaskim kolorze z tokenów (`--accent` albo
`--foreground-strong`), z `translate="no"`. Zakazane: logo graficzne w layoucie strony (SVG/PNG „K",
sygnet, ikona obok tekstu), gradient w tekście (`background-clip: text`), efekty (glow, cień,
obrys), duplikat wordmarku w hero (jest w nawigacji), zmiana litery/kroju/trackingu per sekcja.
Grafika „K" istnieje wyłącznie jako favicon, `apple-touch-icon` i `og:image` w `public/`.

## Mechanizm awarii (dlaczego)

Decyzja marki: brak logo graficznego, znak = słowo. Każde logo w treści strony to (a) nowy
asset do utrzymania w 19 prerenderach, PDF, OG i postach, (b) wejście w estetykę „startup
z sygnetem", którą ICP czyta jako SaaS, (c) w PDF i prerenderze wymaga osadzenia binarium
(`pdfmake` vfs), czyli wzrostu lazy-chunku. Gradient w tekście (`background-clip: text`) był
metaliczną estetyką kitu 2019–2022, kosztuje warstwę kompozytora na iOS i rozjeżdża się
z płaskim białym CTA. Duplikat wordmarku w hero to jeden z 6 elementów, przez które hero
łamie limit 4 (taste §4.7).

## Niepoprawnie

```tsx
// hero: duplikat wordmarku + logo graficzne + gradient w tekście
<img src="/logo-k.svg" alt="Klarow" className="h-8" />
<span className="brand-word" style={{ backgroundImage: "linear-gradient(#c8d2dd,#8895a6)", WebkitBackgroundClip: "text" }}>KLAROW</span>
<h1>…</h1>
```

## Poprawnie

```tsx
// Navbar.tsx (jedyne miejsce w viewport hero) + stopka
<Link to="/" aria-label="KLAROW, strona główna">
  <BrandMark />   {/* <span className="brand-word" translate="no">KLAROW</span> */}
</Link>
```

```css
.brand-word { font-weight: 800; letter-spacing: .14em; text-transform: uppercase; color: var(--accent); }
```

## Test

```bash
# gradient w tekście: 0 trafień
grep -rnE "background-clip:\s*text|WebkitBackgroundClip|-webkit-background-clip" site/src ui-kit/skills/company-ui/assets
# logo graficzne w komponentach strony: 0 trafień (favicon/og tylko w index.html i Seo.tsx)
grep -rniE "<img[^>]+(logo|brand|sygnet)" site/src/components site/src/pages site/src/App.tsx site/src/prerender
# wordmark poza Navbar/Footer/BrandMark: 0 trafień
grep -rn "brand-word" site/src --include=*.tsx | grep -vE "Navbar|Footer|BrandMark"
```

## Wyjątki

`index.html` (`<link rel="icon">`, `apple-touch-icon`) i `Seo.tsx`/`entry.tsx` (`og:image`,
`Organization.logo` w JSON-LD) odwołują się do plików graficznych „K" w `public/`. To metadane,
nie element layoutu.
