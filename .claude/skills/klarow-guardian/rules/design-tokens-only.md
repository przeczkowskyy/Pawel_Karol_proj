---
id: design-tokens-only
title: Tokeny są prawem: zero hex/rgba/oklch i wartości ad hoc poza tokens.css
impact: HIGH
tags: [design, tokens, css, tailwind, colors]
source: company-ui SKILL.md §2, §11 („kolory WYŁĄCZNIE tokenami") / ui-kit-habits.md §2 A1 (T1) / synthesis §2.5.2 / taste §8.A (CSS variables jako strategia)
added: 2026-09-12
---

## Zasada

Każdy kolor, rozmiar pisma, promień, cień, easing i czas trwania istnieje **wyłącznie** jako token
w `site/src/styles/tokens.css` (warstwa 1 prymitywy `--steel-*`/`--gray-*`, warstwa 2 aliasy
semantyczne `--background/--surface/--accent/--cta/--ok…` w `:root` i `[data-theme="light"]`,
warstwa 3 `@theme inline`). W TSX i CSS komponentów wolno użyć tylko `var(--token)` albo utility
Tailwinda wygenerowanej z tokenu (`bg-surface`, `text-foreground-muted`, `rounded-sm`).
Zakazane poza `tokens.css`: literały `#hex`, `rgb()/rgba()/hsl()/oklch()`, `style={{ color: … }}`,
`text-[13px]`, `rounded-[10px]`, `duration-[350ms]`, `shadow-[…]`, `px`-owe rozmiary pisma w CSS.
Wartości wyliczane w runtime przekazujemy przez własną zmienną (`style={{ "--pct": pct }}`),
nie przez kolor. Świadomy wyjątek wymaga komentarza `/* token-exempt: <powód> */` w tej samej linii.

## Mechanizm awarii (dlaczego)

Kit sam złamał tę zasadę w 188 miejscach (`app.css`), strona w 62 hexach TSX, 140 `text-[Npx]`
i 371 inline `style` (`ui-kit-habits.md` §1.3). Skutki: zmiana akcentu wymaga edycji dziesiątek
plików, motyw light jest niemożliwy (kolor przypięty do komponentu), wykresy nie przełączają się
z motywem, a audyt nie da się zrobić mechanicznie. Reguła bez narzędzia egzekwującego umiera,
dlatego test jest grepem, nie prośbą.

## Niepoprawnie

```tsx
// Navbar.tsx
<a style={{ color: "#a8b4c2", borderColor: "rgba(168,180,194,.35)" }} className="text-[13px] rounded-[10px]">
```

```css
.hero-lead { color: #b4b4b9; font-size: 14.5px; transition: color 180ms cubic-bezier(.2,.8,.2,1); }
```

## Poprawnie

```tsx
<a className="nav-link text-sm rounded-sm" style={{ "--pct": `${pct}%` } as React.CSSProperties}>
```

```css
.hero-lead { color: var(--foreground-muted); font-size: var(--text-lg); transition: color var(--duration-fast) var(--ease-out); }
```

## Test

```bash
# literały koloru poza tokens.css (i blokiem aliasów kitu do końca fazy 0): 0 trafień
grep -rnE "#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(|oklch\(" site/src --include=*.tsx --include=*.ts --include=*.css | grep -vE "styles/tokens\.css|styles/company-ui\.css|token-exempt"
# wartości arbitralne Tailwinda: 0 trafień
grep -rnoE "\b(text|rounded|duration|shadow|leading|tracking)-\[[^]]+\]" site/src --include=*.tsx
# inline style z kolorem/rozmiarem pisma: 0 trafień
grep -rnE "style=\{\{[^}]*(color|background|fontSize|borderColor|boxShadow)\s*:" site/src --include=*.tsx | grep -v "token-exempt"
```

Skrypt `audit-static.mjs` (reguła `design-tokens-only`) raportuje każde trafienie jako HIGH.

## Wyjątki

`site/src/styles/tokens.css` (jedyne miejsce literałów), blok zgodności aliasów w `company-ui.css`
(do wycięcia w fazie 0), `index.html` `<meta name="theme-color" content="#121212">` (duplikat
tokenu `--background` udokumentowany komentarzem), SVG `fill="none"` / `stroke="currentColor"`,
generator PDF (`lib/pdf.ts`: pdfmake nie czyta CSS; stal `#A8B4C2` i szarości jako stałe modułu
z komentarzem `token-exempt`).
