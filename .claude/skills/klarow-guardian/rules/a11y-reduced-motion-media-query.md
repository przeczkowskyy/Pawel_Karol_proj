---
id: a11y-reduced-motion-media-query
title: Każda animacja CSS pod @media (prefers-reduced-motion: reduce); każdy komponent Motion, wideo i canvas z gałęzią reduced
impact: BLOCKER
tags: [a11y, reduced-motion, animation, video, canvas, css]
source: CLAUDE.md #2 (wszystkie animacje szanują prefers-reduced-motion) / WIG Animation (honor prefers-reduced-motion; muted loops stop) / synthesis §2.4.8 (3 warstwy + tabela degradacji), motion-reduced-3-layers / kit company-ui app.css:89-91 / vercel.md §9.9
added: 2026-09-12
---

## Zasada

Trzy warstwy, wszystkie obowiązkowe:
1. CSS: każdy `@keyframes`, `transition` na `transform`/`opacity` dłuższy niż 100 ms i każde `animation:` w `tokens.css`/`globals.css`/kicie ma odpowiednik w bloku `@media (prefers-reduced-motion: reduce)`, który go wyłącza lub redukuje do `opacity` (globalny reset kitu `company-ui.css:89-91` zostaje; nowe klasy nie mogą go obchodzić przez `!important`). `.hero-media video { display: none }` pod reduced.
2. Motion: `MotionConfig reducedMotion="user"` na korzeniu (zdejmuje transformy, zostawia opacity); `useReducedMotion()` w komponentach, których MotionConfig nie widzi: `HeroMedia` (poster zamiast wideo), `Counter` (`jump` do wartości), `ChartReveal` (`initial={false}`), mini-diagramy, hover-klipy.
3. Canvas/WebGL/wideo: reduced → jedna klatka (`glsl-hills.tsx:224-255` wzorzec) albo poster; nigdy autoplay.
Kryterium: pod reduced-motion żaden element nie zostaje „utknięty w `initial`" (niewidoczny), a wszystkie liczby, wykresy i zrzuty są widoczne od razu.

## Mechanizm awarii (dlaczego)

Reguła #2 CLAUDE.md jest twarda: ruch bez poszanowania ustawienia systemowego wyklucza użytkowników z zaburzeniami przedsionkowymi (WCAG 2.3.3) i jest pierwszym testem, jaki Karol robi na iPhonie („Ogranicz ruch"). `MotionConfig` nie zatrzymuje `<video autoplay>`, canvasu ani motion values (`motion-dev.md` §8.11), więc sama warstwa 2 nie wystarcza. Klasyczny błąd: `whileInView` z `initial={{ opacity: 0 }}` + reduced-motion, który wyłącza animację, ale nie ustawia stanu końcowego; sekcja zostaje przezroczysta. Wideo pod reduced-motion nadal grające to niezaliczenie WIG „muted decorative loops must stop".

## Niepoprawnie

```css
.reveal { animation: fadeUp 420ms var(--ease-out) both; }   /* bez bloku reduced */
```
```tsx
<m.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} />          {/* reduced: zostaje opacity 0 */}
<video autoPlay muted loop playsInline src="/media/hero-v1.webm" />                  {/* gra zawsze */}
```

## Poprawnie

```css
.reveal { animation: fadeUp var(--duration-slow) var(--ease-out) backwards; }
@media (prefers-reduced-motion: reduce) { .reveal { animation: none; } .hero-media video { display: none; } }
```
```tsx
<MotionConfig reducedMotion="user"><LazyMotion features={domAnimation} strict>…</LazyMotion></MotionConfig>
const reduced = useReducedMotion();
<m.div initial={reduced ? false : { opacity: 0, y: SHIFT }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT_ONCE} />
{reduced || coarse || saveData ? <img src={poster} width={1600} height={900} alt="" /> : <video … poster={poster} />}
```

## Test

```bash
# każdy @keyframes / animation: ma nazwę w bloku reduced (skrypt paruje nazwy)
# DOCELOWO (skrypt planowany, jeszcze nie istnieje — dziś: NIE SPRAWDZANO): node .claude/skills/klarow-guardian/scripts/check-motion.mjs --reduced
grep -rnE "reducedMotion=\"user\"" site/src --include=*.tsx                       # 1 (korzeń)
grep -rnE "<video" site/src --include=*.tsx | grep -v "useReducedMotion|reduced"   # 0 (wideo tylko w HeroMedia z gałęzią)
# Playwright WebKit 390×844 + 1440×900 z emulateMedia({ reducedMotion: "reduce" }): zero elementów z computed opacity 0 w viewport po 1 s; brak <video> grającego
# PLANOWANE (F3, verify-site.mjs nie zna tego trybu): node .claude/skills/klarow-guardian/scripts/verify-site.mjs --reduced-motion
```

Severity: BLOCKER (twarda zasada CLAUDE.md #2).

## Wyjątki

Przejścia `opacity` ≤ 200 ms (crossfade zakładek, hover koloru) są dozwolone pod reduced-motion (WCAG: „essential"/nieistotne dla równowagi). Reveal wykresów kitu `.chart-reveal` pod reduced = brak reveal (instant), co jest zgodne z regułą.
