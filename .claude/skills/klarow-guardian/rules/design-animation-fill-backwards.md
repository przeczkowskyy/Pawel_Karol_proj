---
id: design-animation-fill-backwards
title: Wejścia CSS z animation-fill-mode backwards; po animacji element nie zostaje z transform
impact: HIGH
tags: [design, motion, css, fixed, containing-block, dialog]
source: company-ui §8 i app.css:150-161 (komentarz o `backwards`) / ui-kit-habits.md F1 (M1) / CSS Transforms Module (transform tworzy containing block dla fixed) / CLAUDE.md 2026-07-26 (fixed uwięziony)
added: 2026-09-12
---

## Zasada

Każda animacja wejścia w CSS (`riseIn`, kaskady `animation-delay`) używa
`animation-fill-mode: backwards` (skrót `animation: riseIn .35s var(--ease-out) backwards`),
**nigdy** `both` ani `forwards`. Po zakończeniu animacji element nie może zostać z żadnym
`transform`, `filter`, `will-change: transform`, `perspective` ani `contain: paint` na przodku
elementów `position: fixed` / natywnego `<dialog>` otwartego przez `showModal()` z rodzica
poza top layer. To samo dotyczy Motion: `m.*` z `initial={{ y: 12 }}` → `animate={{ y: 0 }}` kończy
z `transform: none` (Motion zdejmuje `transform` przy wartości identycznościowej); nie ustawiać
`style={{ transform }}` ręcznie po `onAnimationComplete`, nie zostawiać `will-change` na stałe.

## Mechanizm awarii (dlaczego)

Wypełniony `transform` (fill-mode `forwards`/`both`) robi z elementu **containing block dla
`position: fixed`** (CSS Transforms §3): modal, tooltip albo navbar wewnątrz animowanej sekcji
pozycjonuje się względem tej sekcji i ląduje poza viewportem lub przewija się z treścią. Kit
trafił na to w Chromium (`app.css:152-154`: „modale wewnątrz .main lądowały poza viewportem")
i dlatego kaskada `.main > *` ma `backwards`. Ten sam mechanizm (kontekst stackingu +
`overflow: hidden`) stał za tygodniem „samego tła" na iOS. `will-change: transform` na stałe
ma identyczny skutek i dodatkowo trzyma warstwę kompozytora w pamięci.

## Niepoprawnie

```css
.section { animation: riseIn .5s ease both; }            /* transform zostaje po animacji */
.card { will-change: transform; }                         /* na stałe */
.reveal-done { transform: translateY(0); }               /* „identyczność" nadal tworzy containing block */
```

```tsx
<m.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ transform: "translateZ(0)" }}>
  <dialog>…</dialog>   {/* dialog bez showModal() = w drzewie, dziedziczy containing block */}
</m.section>
```

## Poprawnie

```css
@keyframes riseIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
.main > * { animation: riseIn .35s var(--ease-out) backwards; }
.main > *:nth-child(2) { animation-delay: .05s; }
@media (prefers-reduced-motion: reduce) { .main > * { animation: none; } }
```

```tsx
<m.section variants={fadeUp} initial="hidden" whileInView="show" viewport={VIEWPORT_ONCE}>…</m.section>
{/* BookingDialog: natywny <dialog> otwierany showModal() -> top layer, niezależny od transformów rodziców */}
```

## Test

```bash
# fill-mode forwards/both w wejściach: 0 trafień
grep -rnE "animation(-fill-mode)?:[^;]*\b(forwards|both)\b" site/src ui-kit/skills/company-ui/assets --include=*.css
# will-change na stałe / transform w style po animacji: 0 trafień
grep -rnE "will-change|transform:\s*translateZ\(0\)|style=\{\{[^}]*transform" site/src --include=*.tsx --include=*.css | grep -vE "glsl-hills|hero-media"
# dialog przez showModal (top layer)
grep -rn "showModal()" site/src/components/BookingDialog.tsx
```

DevTools po zakończeniu wejścia sekcji: Computed → `transform: none` na sekcji; otwarty dialog ma
`position` liczone względem viewportu (Elements → Layout).

## Wyjątki

Tło (`glsl-hills.tsx`, `.hero-media video`) może mieć stały `transform` / `will-change`, bo nie zawiera
elementów `fixed` ani dialogów. Hover `:active { transform: scale(.98) }` na przycisku jest przejściowy
i nie obejmuje potomków `fixed`.
