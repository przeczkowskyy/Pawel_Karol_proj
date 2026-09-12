---
id: design-light-ready-tokens
title: Komplet tokenów [data-theme="light"] od dnia 1, bez przełącznika na stronie
impact: MEDIUM
tags: [design, tokens, light, theme, kit]
source: synthesis §2.5.1 p.4 („dark-first, light-ready") / ui-kit-habits.md §4.2 (light: akcent #42526E), R11 / taste §8.D (test in both modes) / company-ui §2
added: 2026-09-12
---

## Zasada

`tokens.css` definiuje **komplet aliasów semantycznych dla `[data-theme="light"]`** (ten sam zestaw
nazw co `:root` dark: `--background/--surface*/--foreground*/--border*/--accent*/--cta*/--ok…/--chart-*/
--scrim`), w tym `color-scheme: light` i inny akcent tekstu (`--accent: var(--steel-700)` = `#42526E`,
`--on-accent: #FFFFFF`, `--cta: #111827`), bo stal `#A8B4C2` nie przechodzi AA na bieli. Motyw light
**nie ma przełącznika na stronie marketingowej** (Page Theme Lock); służy narzędziom on-prem
z toggle kitu, podglądowi PDF, brandkitowi i zrzutom na jasne tło (LinkedIn). Każdy komponent
używa wyłącznie aliasów (nigdy prymitywów `--steel-*`/`--gray-*`), więc przełącza się bez
zmian w kodzie. Nowy alias w `:root` bez pary w `[data-theme="light"]` = fail.

## Mechanizm awarii (dlaczego)

Kit miał 45 linii nadpisań light z hexami w 30 selektorach komponentów (`app.css:556-600`), bez
konsumenta na stronie; martwy kod, który przy zmianie jednego tokenu rozjeżdżał się po cichu.
Jeśli light wraca (narzędzie u klienta, jasny PDF-preview, brandkit), musi wrócić przez tokeny,
nie przez selektory. Komponent z prymitywem `--gray-900` w tle „przypadkiem" zostaje ciemny
w motywie light i daje czarny prostokąt na białej stronie narzędzia.

## Niepoprawnie

```css
:root { --surface: #262626; }
/* brak pary light */
html[data-theme="light"] .st-accent { color: #42526e; background: #eff3f7; }   /* nadpisanie selektora, nie tokenu */
.card { background: var(--gray-900); }                                            /* prymityw w komponencie */
```

## Poprawnie

```css
:root { color-scheme: dark; --background: var(--gray-975); --surface: var(--gray-900); --accent: var(--steel-300); --on-accent: var(--gray-950); --cta: var(--gray-0); --on-cta: var(--gray-975); }
[data-theme="light"] { color-scheme: light; --background: #F4F5F7; --surface: #FFFFFF; --surface-muted: #F9FAFB; --surface-raised: #F3F4F6; --surface-overlay: #FFFFFF;
  --foreground: #262626; --foreground-strong: #111827; --foreground-muted: #6B7280; --foreground-faint: #6B7280;
  --border: #E6E8EC; --border-strong: #C8D2DD; --accent: var(--steel-700); --accent-strong: var(--steel-800); --on-accent: #FFFFFF; --accent-text: var(--steel-700);
  --cta: #111827; --on-cta: #FFFFFF; --cta-hover: #1F2937; --scrim: rgb(255 255 255 / .8);
  --ok: #059669; --bad: #B91C1C; --warn: #B45309; --info: #1D4ED8; --chart-ref: #64748B; }
.card { background: var(--surface); }
```

## Test

```bash
# każdy alias z :root ma parę w [data-theme="light"] (0 linii w wyniku = PASS)
node -e '
const css=require("fs").readFileSync("site/src/styles/tokens.css","utf8");
const grab=sel=>{const m=css.match(new RegExp(sel.replace(/[[\]"=]/g,"\\$&")+"\\s*\\{([\\s\\S]*?)\\n\\}"));return new Set([...(m?m[1]:"").matchAll(/--([a-z0-9-]+)\s*:/g)].map(x=>x[1]).filter(n=>!/^(steel|gray|green|red|amber|blue)-/.test(n)&&!/-rgb$/.test(n)))};
const d=grab(":root"),l=grab("[data-theme=\"light\"]");
for(const n of d) if(!l.has(n)&&!/^(text|font|duration|ease|radius|container|gutter|section|z)-/.test(n)) console.log("brak w light:",n);'
# prymitywy w komponentach: 0 trafień
grep -rnE "var\(--(steel|gray|green|red|amber|blue)-[0-9]+\)" site/src --include=*.tsx --include=*.css | grep -v "styles/tokens.css"
```

Test wizualny (narzędzia/kit): `document.documentElement.dataset.theme = "light"` w konsoli na
dashboardzie → brak czarnych prostokątów, kontrast AA (`design-contrast-aa`).

## Wyjątki

Tokeny geometrii, typografii i ruchu (`--text-*`, `--radius-*`, `--duration-*`, `--ease-*`, `--z-*`)
są wspólne dla obu motywów i nie wymagają pary. Strona marketingowa nigdy nie ustawia `data-theme`.
