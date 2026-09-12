---
id: design-shape-lock
title: Shape Lock: promienie tylko ze zbioru {0, 8, 10, 12, 999} rozdzielonego per data-surface
impact: MEDIUM
tags: [design, radius, shape, tailwind, kit]
source: taste §4.4 SHAPE CONSISTENCY LOCK / company-ui §2 (radius 12/8/10/999) / taste.md §3.2 (audyt 16 wariantów) / synthesis §2.5.4
added: 2026-09-12
---

## Zasada

Jeden udokumentowany system promieni, egzekwowany mechanicznie:

| Powierzchnia | Dozwolone promienie | Co dostaje który |
|---|---|---|
| `data-surface="marketing"` (domyślna: home, hub, oferta, faq, otoczka podstron) | **{0, 8, 999}** | ramy, komórki bento, karty, obrazy: `0`; przyciski, inputy: `8` (`--radius-sm`); chipy `.st`: `999` (`--radius-pill`) |
| `data-surface="tool"` (dashboardy, dialog, `demo/`) | **{8, 10, 12, 999}** | kontrolki `8`, przyciski `10` (`--radius-md`), karty/panele/tabele `12` (`--radius-lg`), chipy `999` |

Zakazane: `rounded` (4 px), `rounded-md/lg/xl/2xl/3xl`, `rounded-[Npx]`, `border-radius: 4/5/6/7/14/16/18px`
w CSS, `rounded-full` na kontenerach i CTA (pigułka tylko dla chipów). Wartość zawsze przez token
(`rounded-sm`, `var(--radius-lg)`), nigdy liczba.

## Mechanizm awarii (dlaczego)

taste §4.4: „Round buttons in a square layout, or square cards on a pill-button page, is broken design."
Audyt strony znalazł 7 wariantów Tailwinda (`rounded-full` 13, `rounded-[10px]` 7, `rounded-md` 4,
`rounded-xl` 3…) i 9 wartości px w CSS; kit dodał modal 16 px i login 18 px. Mieszany system jest
dopuszczalny tylko z regułą „kto dostaje który promień" i tylko, gdy reguła jest sprawdzalna, stąd
`data-surface` jako granica i grep jako test. Editorial „linie, nie boxy" na marketingu wymaga `0`,
kit w narzędziach 12/10/8; oba naraz bez granicy = 16 wariantów.

## Niepoprawnie

```tsx
<article className="card rounded-xl">…</article>                 // marketing: 12 px na karcie
<button className="btn btn-primary rounded-full">Umów 30 minut</button>
<img className="rounded-[10px]" … />
```

```css
.frame { border-radius: 6px; }
.modal { border-radius: 16px; }
```

## Poprawnie

```tsx
<main data-surface="marketing">
  <article className="frame">…</article>                          {/* border-radius: 0 */}
  <button className="btn btn-primary">Umów 30 minut</button>       {/* --radius-sm (8) */}
  <span className="st st-accent">Własny produkt</span>            {/* --radius-pill */}
</main>
<section data-surface="tool">
  <div className="card">…</div>                                   {/* --radius-lg (12) */}
  <input className="input" />                                     {/* --radius-sm (8) */}
</section>
```

```css
[data-surface="marketing"] .card, [data-surface="marketing"] .frame { border-radius: var(--radius-0); }
[data-surface="tool"] .card { border-radius: var(--radius-lg); }
```

## Test

```bash
# utility spoza zbioru: 0 trafień
grep -rnoE "\brounded(-(md|lg|xl|2xl|3xl|t|b|l|r|tl|tr|bl|br)|-\[[^]]+\])?\b" site/src --include=*.tsx | grep -vE "rounded-(sm|pill|none)\b"
# px w CSS poza tokens.css: 0 trafień
grep -rnE "border-radius:\s*[0-9.]+px" site/src --include=*.css | grep -v "styles/tokens.css"
# każda trasa marketingowa ma data-surface (domyślna) a dashboard data-surface="tool"
grep -rn 'data-surface="tool"' site/src/components/dashboards site/src/components/DemoReport.tsx | wc -l
```

## Wyjątki

Przejście fazy 0: `rounded` (4 px, ×30) do sprzątnięcia partiami; do tego czasu istniejące trafienia
są długiem w `audit/baseline.jsonl`, nowe = fail. Favicon i OG (bitmapy) nie podlegają regule.
