---
id: motion-gpu-props-only
title: Animujemy tylko opacity, transform, clipPath i filter; nigdy właściwości layoutu i paint
impact: HIGH
tags: [motion, performance, compositor]
source: motion-dev §3.3/§3.4 · showreel M2 · taste §7.6 (6.A) · ui-kit-habits P1/P2 · Motion AI Kit best-practices/index.md
added: 2026-09-12
---

## Zasada

Każda animacja (Motion, CSS transition, CSS keyframes) zmienia wyłącznie:

- `opacity`,
- `transform` (w Motion: `x`, `y`, `scale`, `rotate` albo cały string `transform`),
- `clipPath` (reveal wykresów, wipe),
- `filter` wyjątkowo i nigdy `blur()` na urządzeniach dotykowych ani w wejściach sekcji.

Zakazane w `animate`/`initial`/`whileHover`/`whileInView`/`exit`/`variants` i w CSS `transition`/`@keyframes`: `width`, `height`, `top`, `left`, `right`, `bottom`, `margin*`, `padding*`, `border*`, `boxShadow`/`box-shadow`, `fontSize`, `letterSpacing`, `backgroundPosition`, `inset`, `gap`. Kolor (`backgroundColor`, `color`, `borderColor`) jest dozwolony TYLKO w hoverach kitu przez CSS (`--duration-fast`), nie przez Motion.

Zamienniki: `boxShadow` → `filter: drop-shadow()` (albo statyczny cień + `opacity` warstwy), `borderRadius` → `clipPath: inset(0 round 8px)`, „rozwijanie wysokości" → `grid-template-rows: 0fr → 1fr` (jak `.faq-answer`) albo `AnimatePresence` z `opacity`, przesunięcie w tekście inline → brak animacji.

Duże powierzchnie (hero, całe sekcje, ramy S3): tylko `opacity`; przesunięcie `y` ≤ `SHIFT` (12 px) na elementach ≤ 1/3 viewportu.

## Mechanizm awarii (dlaczego)

- Zmiana `width/height/top/left` wymusza layout całego poddrzewa; Motion docs: „Re-renders can exceed 100ms" per klatka. Na laptopie z GPU zintegrowanym i 12 dashboardów w tle spadek do 20–30 fps.
- `boxShadow` i `borderRadius` to paint, nie compositor: każda klatka maluje warstwę od nowa. Kit `company-ui` wprost: hover „bez transformu i bez kolorowej poświaty: zero layout shift" (SKILL.md:161-167).
- `filter: blur()` w wejściach (`translate-y-16 blur-md opacity-0` z `high-end-visual-design`) = pełnoekranowa tekstura filtra na GPU telefonu; kit zakazuje `filter` na animowanych grupach (`app.css:1-4`, `78-82`: „SVG compositor layers caused navigation lag").
- Motion zrzuca na WAAPI/kompozytor tylko `opacity`, `transform` (string), `clipPath`, `filter`, od 12.43 `backgroundColor` i SVG; reszta liczy się w JS per klatka i wraca przez layout.

## Niepoprawnie

```tsx
<m.div animate={{ height: open ? "auto" : 0, boxShadow: "0 8px 24px rgba(0,0,0,.4)" }} />
<m.article whileHover={{ boxShadow: "0 2px 8px rgba(0,0,0,.4)", borderRadius: 12 }} />
<m.section initial={{ opacity: 0, y: 64, filter: "blur(12px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }} />
```

```css
.card { transition: width .3s var(--ease-out), padding .3s var(--ease-out); }
.card:hover { box-shadow: 0 12px 40px rgba(0,0,0,.5); transition: box-shadow .2s; }
```

## Poprawnie

```tsx
// wejście: opacity + y ≤ 12 px
<m.li variants={fadeUp} />
// hover obrazu w ramie (transform w overflow:hidden)
<a className="case-frame"><img /></a>   /* CSS: .case-frame img{transition:transform var(--duration-base) var(--ease-out)} .case-frame:hover img{transform:scale(1.02)} */
// rozwinięcie: AnimatePresence + opacity, nie height
<AnimatePresence initial={false}>
  {open ? <m.div key="panel" initial={{ opacity: 0, y: SHIFT }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} /> : null}
</AnimatePresence>
// reveal wykresu: clipPath
<m.div initial={{ clipPath: "inset(0 100% 0 0)" }} animate={{ clipPath: "inset(0 0 0 0)" }} transition={{ duration: 0.42, ease: EASE_SOFT }} />
```

```css
.cell { transition: background-color var(--duration-fast) var(--ease-out), border-color var(--duration-fast) var(--ease-out); }
.faq-answer { display: grid; grid-template-rows: 0fr; transition: grid-template-rows var(--duration-base) var(--ease-out); }
```

## Test

```bash
# Motion: zakazane klucze w obiektach animacji (oczekiwane: 0)
grep -rnE '(animate|initial|whileHover|whileInView|whileTap|exit|hidden|show)\s*[=:]\s*\{[^}]*\b(width|height|top|left|right|bottom|margin[A-Z]?|padding[A-Z]?|border[A-Z]?[a-zA-Z]*|boxShadow|fontSize|letterSpacing|inset|gap)\b' site/src --include=*.tsx --include=*.ts
# CSS: transition/keyframes na właściwościach layout/paint (oczekiwane: 0 poza company-ui.css do czasu przycięcia)
grep -rnE 'transition:[^;]*\b(width|height|top|left|right|bottom|margin|padding|border(?!-color)|box-shadow|font-size|inset|gap)\b' site/src --include=*.css | grep -v company-ui.css
grep -rnE 'blur\(' site/src --include=*.tsx | grep -E 'animate|initial|whileInView|whileHover'
# DevTools (ręcznie, przed publikacją): Performance → nagranie scrolla przez całą stronę:
#   zero wpisów „Layout"/„Recalculate Style" w trakcie animacji; Rendering → Paint flashing: brak zielonych błysków przy hover/reveal.
```

Docelowo `node scripts/check-motion.mjs` sekcja `props`.

## Wyjątki

- `.faq-answer` animuje `grid-template-rows` (jedyny sposób na rozwijanie do `auto` bez JS); dozwolone, bo działa na jednym elemencie o małej powierzchni i ma `prefers-reduced-motion` → `transition: none`.
- `backgroundColor`/`borderColor` przez CSS w hoverach kitu (`--duration-fast`).
- `filter: drop-shadow()` na małym elemencie (ikona, chip) w hover, nigdy w pętli.
