---
id: design-hero-discipline
title: Hero: maksymalnie 4 elementy tekstowe, H1 ≤ 2 linie, lead ≤ 20 słów, realny wizual
impact: HIGH
tags: [design, hero, layout, copy, lcp]
source: taste §4.7 HERO STACK DISCIPLINE, §4.8 („Hero needs a real visual") / taste.md §5.3 (audyt hero: 6 elementów) / synthesis §2.3 S1 / imagegen §4 Absolute Hero Rules
added: 2026-09-12
---

## Zasada

Hero (`/` i nagłówek każdej trasy marketingowej) zawiera **dokładnie te elementy i nic więcej**:
1. `<h1>` = `MESSAGING.oneLiner` (≤ 2 linie na 1024 px, ≤ 3 linie na 390 px, bez `<br>`,
   `max-width: 24ch`, `overflow-wrap: anywhere`), 2. lead `<p>` ≤ 20 słów i ≤ 4 linie
   (`MESSAGING.subtext`), 3. para CTA: 1 primary + 1 ghost, 4. media: realny wizual (poster
   `<img>` z `width/height` i `fetchpriority="high"`, opcjonalnie `<video>` po posterze) jako tło
   bloku hero (`.hero-media { position:absolute; inset:0 }`), nie w `.bg-layer`, nie `fixed`.
Zakazane w hero: eyebrow, duplikat wordmarku, chipy ikonowe / lista funkcji, telefon lub
tagline pod CTA, pasek zaufania / logotypy, wersja („v0.8", „BETA"), scroll cue, dekoracyjny pasek
tekstu, statystyki, widget dema, clip-reveal na treści obecnej w shellu. `padding-top` ≤ 6 rem na
desktopie; H1 `--text-display` `clamp(2.25rem, 5.2vw, 4.25rem)`; blok `min-height: min(86dvh, 820px)`.

## Mechanizm awarii (dlaczego)

taste §4.7: „The hero is a single moment, not a feature list." Dzisiejsze hero ma 6 elementów
tekstowych (wordmark, H1 z `<br>`, lead, chipy, CTA, telefon) na tle GLSL bez zdjęcia, czyli
„Text + gradient blob is not a hero - it's a placeholder" (§4.8). Każdy element ponad limit spycha
CTA pod zgięcie na 390 px; `<br>` w H1 to Tell §9.F; brak posteru = LCP na tekście z późnym fontem.
Hero to jedyne miejsce, gdzie CFO decyduje w 10 s, czy czyta dalej (`strategy.md` §3.2).

## Niepoprawnie

```tsx
<section className="flex-col items-center text-center">
  <span className="brand-word">KLAROW</span>
  <span className="lbl-sm">Automatyzacja dla MŚP</span>
  <h1>Narzędzia pod Twój proces.<br className="hidden md:block" />Działają w dni.</h1>
  <p>{lead}</p>
  <ul>{chips.map(c => <li><Icon/>{c}</li>)}</ul>
  <button className="btn btn-primary">Umów</button><button className="btn btn-primary">Demo</button>
  <a href="tel:+48786296426">786 296 426</a>
</section>
```

## Poprawnie

```tsx
<section className="hero">
  <HeroMedia poster="/media/hero-v1.poster.webp" />                 {/* absolute, overflow hidden, overlay */}
  <div className="hero-copy">
    <h1>{pick(MESSAGING.oneLiner, lang)}</h1>
    <p className="hero-lead">{pick(MESSAGING.subtext, lang)}</p>    {/* 17 słów */}
    <div className="row">
      <button className="btn btn-primary" onClick={openBooking}>{pick(MESSAGING.cta.primary, lang)}</button>
      <Link className="btn btn-secondary" to="/narzedzia">{pick(MESSAGING.cta.secondary, lang)}</Link>
    </div>
  </div>
</section>
```

## Test

```bash
# elementy zakazane w hero (Hero.tsx / sekcja hero w App.tsx): 0 trafień
grep -nE "lbl-sm|brand-word|<br|tel:|chips|st st|BETA|v0\.[0-9]|Scroll" site/src/components/Hero.tsx
# liczba słów leadu ≤ 20 (PL i EN)
node -e "const m=require('fs').readFileSync('site/src/data/messaging.ts','utf8');for(const l of ['pl','en']){const s=m.match(new RegExp('subtext[\\\\s\\\\S]*?'+l+':\\\\s*\"([^\"]+)\"'))[1];console.log(l,s.split(/\\s+/).length)}"
# poster w shellu prerenderu, brak <video>
grep -c "hero-v1.poster" site/dist/index.html; grep -c "<video" site/dist/index.html
```

Playwright 1440×900 i 390×844: H1 ≤ 2 / ≤ 3 linie (`getClientRects().length`), CTA widoczne bez
scrolla, `document.querySelectorAll('.hero p, .hero h1, .hero a, .hero button').length ≤ 4`.

## Wyjątki

Podstrony narzędzi (`/narzedzia/:slug`) mają nagłówek dashboard-first: H1 + 1 zdanie + pasek
akcji dema; nie mają wideo (dashboard jest wizualem). `/rodo`, `/faq`, `404` = H1 + 1 zdanie, bez media.
