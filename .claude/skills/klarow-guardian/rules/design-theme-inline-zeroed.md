---
id: design-theme-inline-zeroed
title: "@theme inline zeruje palety Tailwinda; utility tylko z naszych tokenów"
impact: MEDIUM
tags: [design, tailwind, theme, tokens, css]
source: synthesis §2.5.2 (warstwa 3) / ui-kit-habits.md §5.2 / feasibility-perf.md §1 (wyzerowanie bezpieczne) / decyzja D-19 (safari13: brak color-mix)
added: 2026-09-12
---

## Zasada

`tokens.css` zawiera blok `@theme inline`, który **najpierw zeruje** domyślne przestrzenie nazw
Tailwinda v4 (`--color-*: initial; --shadow-*: initial; --font-*: initial; --radius-*: initial;
--ease-*: initial; --animate-*: initial;`), a potem mapuje wyłącznie nasze aliasy
(`--color-background: var(--background)`, `--color-accent: var(--accent)`, `--color-cta: var(--cta)`,
`--text-*`, `--radius-sm/md/lg/pill`, `--ease-out/soft/std`). Skutek: istnieją tylko utility z tokenów
(`bg-surface`, `text-foreground-muted`, `border-border`, `rounded-sm`), a `bg-blue-500`,
`text-slate-400`, `shadow-md` nie generują nic. Zakazane w `site/src`: utility domyślnej palety,
modyfikatory alfa `bg-accent/12` (kompilują się do `color-mix()`, poza `cssTarget safari13`;
używamy tokenów `--accent-a12`), wariant `dark:` (motyw przez CSS variables, nie klasę).

## Mechanizm awarii (dlaczego)

Dziś strona ładuje dwa systemy naraz (`globals.css` z Tailwindem i `company-ui.css`) bez `@theme`,
więc Tailwind nie zna tokenów kitu, a shadcn-owe `components/ui/*` z `bg-primary` są martwe
(`ui-kit-habits.md` §1.3). Trzy źródła prawdy = dryf gwarantowany. Domyślna paleta Tailwinda to
też najkrótsza droga do „Inter + slate-900 + AI-blue" (taste §0.D). Wyzerowanie jest bezpieczne:
domyślne utility kolorów żyją tylko w `Navbar.tsx` (przepisywany) i martwym
`radial-orbital-timeline.tsx`.

## Niepoprawnie

```css
/* globals.css: Tailwind z pełną paletą, kit obok, zero mapowania */
@import "tailwindcss";
```

```tsx
<section className="bg-zinc-900 text-slate-300 shadow-lg dark:bg-black">
<span className="bg-accent/12 text-blue-300">
```

## Poprawnie

```css
/* tokens.css (warstwa 3) */
@theme inline {
  --color-*: initial; --shadow-*: initial; --font-*: initial; --radius-*: initial; --ease-*: initial; --animate-*: initial;
  --color-background: var(--background); --color-surface: var(--surface); --color-foreground: var(--foreground);
  --color-foreground-muted: var(--foreground-muted); --color-border: var(--border);
  --color-accent: var(--accent); --color-accent-a12: var(--accent-a12); --color-cta: var(--cta); --color-on-cta: var(--on-cta);
  --font-sans: var(--font-sans); --font-display: var(--font-display);
  --text-xs: var(--text-xs); --text-sm: var(--text-sm); --text-base: var(--text-base); --text-lg: var(--text-lg); --text-xl: var(--text-xl);
  --radius-sm: var(--radius-sm); --radius-md: var(--radius-md); --radius-lg: var(--radius-lg); --radius-pill: var(--radius-pill);
  --ease-out: var(--ease-out); --ease-soft: var(--ease-soft); --ease-std: var(--ease-std);
}
@custom-variant tool (&:where([data-surface="tool"], [data-surface="tool"] *));
```

```tsx
<section className="bg-surface text-foreground-muted">
<span className="bg-accent-a12 text-accent-text">
```

## Test

```bash
# blok zerujący istnieje
grep -nE "^\s*--color-\*:\s*initial" site/src/styles/tokens.css
# domyślna paleta Tailwinda w TSX: 0 trafień
grep -rnE "\b(bg|text|border|ring|from|to|via|fill|stroke|decoration|outline)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|white|black)(-[0-9]{2,3})?(/[0-9]+)?\b" site/src --include=*.tsx
# modyfikatory alfa i dark: 0 trafień
grep -rnE "\b(bg|text|border|ring)-[a-z-]+/[0-9]+\b|\bdark:" site/src --include=*.tsx --include=*.css
# build CSS bez color-mix/oklch (safari13)
grep -lE "color-mix\(|oklch\(" site/dist/assets/*.css
```

## Wyjątki

Utility spacingu/layoutu Tailwinda (`grid`, `gap-6`, `p-6`, `max-w-*`, `hidden md:block`) są
dozwolone bez ograniczeń: Tailwind = layout, tokeny = wygląd (kit §0).
