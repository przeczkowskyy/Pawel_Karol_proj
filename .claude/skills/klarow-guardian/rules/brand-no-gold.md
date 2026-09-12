---
id: brand-no-gold
title: Zero złota #FFA914 i jego śladów w publicznym kodzie
impact: BLOCKER
tags: [brand, color, css, svg, legacy]
source: CLAUDE.md #1 / rebrand 2026-07-21 (stal zamiast złota) / ui-kit-habits.md §3 R3
added: 2026-09-12
---

## Zasada

Złoto `#FFA914` (oraz jego zapisy: `#ffa914`, `rgb(255, 169, 20)`, `rgba(255,169,20,…)`,
`hsl(41 100% 55%)`) i słowa `gold` / „złoty" jako nazwa koloru, klasy, tokenu, parametru
(`gold=true`), komentarza albo nazwy pliku **nie istnieją** w `site/**`, `demo/**`,
`ui-kit/skills/company-ui/assets/**`, `public/**`, `dist/**`, SVG, PDF ani w assetach graficznych.
Jedyny akcent marki to stal `#A8B4C2` przez token `--accent` (patrz `brand-single-accent-steel`).

## Mechanizm awarii (dlaczego)

Złoto było akcentem poprzedniej marki. Każdy ślad (nawet komentarz `/* gold ring */` w CSS)
to (a) sygnał pochodzenia kodu, sprzeczny z `brand-no-nuconic`, (b) pułapka dla agentów, którzy
kopiują „istniejący wzorzec" i przywracają stary kolor w nowym komponencie, (c) drugi akcent
na stronie, czyli złamany Color Consistency Lock (taste §4.2). Kit miał 3 takie komentarze
(`app.css:800, 819, 850`) i makro `stat_card(gold=…)`; to dokładnie ta droga dryfu.

## Niepoprawnie

```css
/* app.css */
.stat-ico.gold { color: #FFA914; }           /* gold active */
.btn-primary  { background: linear-gradient(180deg, #ffd27a, #ffa914); }
```

```tsx
<Sparkline stroke="#FFA914" />
<StatCard gold />
```

## Poprawnie

```css
.stat-ico.accent { color: var(--accent); background: var(--accent-a12); }
.btn-primary { background: var(--cta); color: var(--on-cta); }
```

```tsx
<Sparkline stroke="var(--accent)" />
<StatCard tone="accent" />
```

## Test

```bash
# 0 trafień = PASS (kod źródłowy, kit, build)
grep -rniE "#ffa914|255,\s*169,\s*20|\bgold\b|złot(y|a|e|ego|ej)\b" site/src site/public site/index.html demo ui-kit/skills/company-ui/assets
grep -rliE "#ffa914|\bgold\b" site/dist
```

Skrypt `audit-static.mjs` zgłasza `[brand-no-gold]` jako BLOCKER. Nowa paleta może wejść wyłącznie
jako prymityw w `site/src/styles/tokens.css` z komentarzem decyzji (`docs/DECISIONS.md`).

## Wyjątki

Brak. Komentarze historyczne też usuwamy (historia jest w gicie i w `docs/DECISIONS.md`).
