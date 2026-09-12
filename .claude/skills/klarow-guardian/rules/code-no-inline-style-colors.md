---
id: code-no-inline-style-colors
title: Zero kolorów, rozmiarów pisma i promieni w style={{ }}; klasy kitu i tokeny
impact: HIGH
tags: [tokens, css, inline-style, kit, design, code]
source: CLAUDE.md #1 (UI wyłącznie wg company-ui) / company-ui app.css:57 („NEVER re-create these as inline styles") / site-audit.md §3.4 p.1 (455 inline style=, 24× color:var(--heading), 53× var(--muted-foreground)) / synthesis design-tokens-only, §2.5.2 tokens.css
added: 2026-09-12
---

## Zasada

W TSX nie ustawiamy przez `style={{ }}` żadnej wartości wizualnej, którą kit albo `tokens.css` wyrażają klasą lub tokenem: `color`, `background`, `borderColor`, `fontSize`, `borderRadius`, `boxShadow`, `fontWeight`. Zamiast tego klasy kitu (`.t-muted`, `.t-heading`, `.icon-box`, `.card`, `.btn`, `.st`) albo utility Tailwinda mapowane na tokeny w `@theme`. Dozwolone w `style`: wartości runtime, których CSS nie zna z góry (`--_progress`, `minHeight` skeletonu z pomiaru, `viewTransitionName`, `gridTemplateColumns` liczone z danych) i wyłącznie przez zmienne CSS `--_x` lub właściwości layoutu. Wyjątek świadomy oznaczamy komentarzem `/* token-exempt: <powód> */` w tej samej linii.

## Mechanizm awarii (dlaczego)

Stan 2026-09-11: 455 inline `style=` w `site/src` (371 form `style={{`), w tym 24× `style={{ color: "var(--heading)" }}` i 53× `var(--muted-foreground)`; ten sam kwadrat ikony `rgba(168,180,194,.14)` powielony 6× (`App.tsx:220`, `ToolsGrid.tsx:151`, `Differentiators.tsx:171`, `ToolPage.tsx:129,162`, `CollaborationFlow.tsx:97`). Zmiana odcienia akcentu wymaga edycji kilkudziesięciu plików; audyt kontrastu nie widzi kolorów w JSX; `Navbar.tsx` z 12 hexami złamał zasadę #1 (akcent poza kitem). Inline style ma najwyższą specyficzność, więc nadpisuje stany `:hover`/`:focus-visible` kitu, przez co znika fokus na przyciskach.

## Niepoprawnie

```tsx
<span className="text-[15px] font-extrabold" style={{ color: "var(--heading)" }}>{name}</span>
<div style={{ background: "rgba(168,180,194,.14)", borderRadius: 10, padding: 8 }}><Icon size={18} /></div>
<p style={{ color: "#b4b4b9", fontSize: 12.5 }}>{t.note}</p>
```

## Poprawnie

```tsx
<span className="t-heading fs-md font-bold">{name}</span>
<div className="icon-box"><Icon size={18} aria-hidden="true" /></div>
<p className="t-muted fs-sm">{t.note}</p>
{/* runtime, przez zmienną: */}
<div className="meter" style={{ ["--_progress" as string]: `${pct}%` }} />
{/* token-exempt: minHeight skeletonu = wysokość zmierzonego dashboardu (CLS) */}
<div className="skel" style={{ minHeight: 480 }} />
```

Klasy `.t-muted`, `.t-heading`, `.icon-box`, `.fs-*` dodajemy do kitu NAD markerem APP-SPECIFIC (`ui-kit/skills/company-ui/assets/app.css`) i kopiujemy do `site/src/styles/company-ui.css` (jedno źródło).

## Test

```bash
# kolory/rozmiary/promienie w inline style (bez linii z token-exempt)
grep -rnE "style=\{\{[^}]*(color|background|border(Color)?|fontSize|borderRadius|boxShadow|fontWeight)\s*:" site/src --include=*.tsx | grep -v "token-exempt"   # oczekiwane: 0
# hex/rgba poza tokens.css i company-ui.css
grep -rnE "#[0-9a-fA-F]{3,8}\b|rgba?\(" site/src --include=*.tsx | grep -v "token-exempt"   # oczekiwane: 0
# DOCELOWO (skrypt planowany, jeszcze nie istnieje — dziś: NIE SPRAWDZANO): node .claude/skills/klarow-guardian/scripts/check-design.mjs --inline-style
```

Severity: HIGH dla nowych plików i plików trybu `marketing`; migracja 455 wystąpień w dashboardach = dług fazy 2 (synthesis backlog p.9), raportowany z `--baseline`.

## Wyjątki

`dashboards/*.tsx` do czasu migracji (baseline). SVG generowane z danych (`CollaborationFlow`, `KsefFlow`, wykresy): `fill`/`stroke` jako `var(--accent)` w atrybutach SVG są dozwolone (to nie `style`).
