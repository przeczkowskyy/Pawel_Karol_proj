---
id: design-no-glass-no-blur
title: Zero glassmorphism, backdrop-filter, mask na hover, blur w wejściach, glow i gradientu w tekście
impact: HIGH
tags: [design, gpu, hover, glass, blur, perf]
source: company-ui app.css:1-4 („No mask/backdrop-filter tricks: hover flicker on some GPUs") / taste §5 (glass „Inappropriate for boring B2B"), §9.A (NO neon/outer glows) / taste.md §11.2 / synthesis §2.5.4
added: 2026-09-12
---

## Zasada

W `site/**` i kicie: zero `backdrop-filter`, zero `mask`/`-webkit-mask` w stanach `:hover`/`:focus`,
zero `filter: blur()` w wejściach i przejściach (Motion `filter` też), zero glow/neon
(`box-shadow: 0 0 Npx <kolor>`, `text-shadow` kolorowy), zero gradientu w tekście, zero
„double-bezel" (karta w karcie z wewnętrznym obrysem), zero cieni na stronie marketingowej
(`--shadow-*` kitu tylko w dialogu i menu). Nawigacja sticky ma tło **nieprzezroczyste**
(`--surface-overlay`), nie `backdrop-blur`. Czytelność nad tłem/wideo zapewnia scrim
(`--scrim rgb(18 18 18 / .72)`) albo overlay-gradient w kontenerze hero, nie rozmycie.

## Mechanizm awarii (dlaczego)

Kit zdjął `mask`/`backdrop-filter` po realnym migotaniu hoverów na niektórych GPU (`app.css:1-4`).
`backdrop-filter` na sticky navie wymusza ponowne rozmycie każdej klatki scrolla nad wideo/canvasem
(mobile FPS). Blur w wejściach (`blur-md` → 0) to rasteryzacja warstwy per klatka i „mydło" w tekście
na Retinie. Glow i szkło to rejestr „dark tech / SaaS startup", którego ICP nie kupuje; taste §5:
glass „Inappropriate for dashboards, public-sector, or boring B2B". `high-end-visual-design`
(glass nav, `backdrop-blur-3xl`, blur entrances, double-bezel) jest w precedencji niżej i te sekcje
są wyłączone.

## Niepoprawnie

```css
.nav { position: sticky; background: rgba(18,18,18,.6); backdrop-filter: blur(12px); }
.card:hover { -webkit-mask-image: linear-gradient(#000, transparent); box-shadow: 0 0 32px rgba(168,180,194,.45); }
.reveal-enter { filter: blur(8px); opacity: 0; }
```

```tsx
<m.div initial={{ opacity: 0, filter: "blur(8px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} />
```

## Poprawnie

```css
.nav { position: sticky; top: 0; background: var(--surface-overlay); border-bottom: 1px solid var(--border); }
.card:hover { border-color: var(--accent); background: var(--surface-raised); transition: border-color var(--duration-fast) var(--ease-out), background var(--duration-fast) var(--ease-out); }
.hero-media::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, rgb(18 18 18 / .15), rgb(18 18 18 / .85)); }
```

```tsx
<m.div variants={fadeUp} />   {/* opacity + y 12 px, bez filter */}
```

## Test

```bash
# 0 trafień = PASS
grep -rnE "backdrop-filter|backdrop-blur|-webkit-mask|mask-image|filter:\s*blur|blur\([0-9]|text-shadow:\s*0 0|box-shadow:\s*0 0 [0-9]" site/src ui-kit/skills/company-ui/assets --include=*.css --include=*.tsx
grep -rnE "filter:\s*\"blur|blur-(sm|md|lg|xl)\b" site/src --include=*.tsx
# cienie na trasach marketingowych: 0 trafień
grep -rnE "shadow-(sm|md|lg|xl|2xl)\b|var\(--shadow" site/src/pages site/src/App.tsx site/src/components --include=*.tsx | grep -vE "Dialog|Menu|dashboards/"
```

## Wyjątki

Tło GLSL Hills (`glsl-hills.tsx`) i ewentualny canvas 2D low-res z JEDNYM `filter: blur()` na elemencie
canvas (kit P1) są dozwolone jako tło na desktopie; to nie jest hover ani wejście. `<dialog>` i menu
mobilne mogą mieć `--shadow-md` z tokenów.
