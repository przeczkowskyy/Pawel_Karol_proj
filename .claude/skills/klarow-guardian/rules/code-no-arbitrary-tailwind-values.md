---
id: code-no-arbitrary-tailwind-values
title: Zero arbitralnych wartości Tailwinda (text-[Npx], bg-[#hex], w-[calc()] kolorów i typografii)
impact: HIGH
tags: [tailwind, tokens, typography, design, code]
source: CLAUDE.md #1 i „Tailwind tylko layout" / site-audit.md §1.8, §3.4 p.1 (140× text-[Npx]) / synthesis §2.7.1 (`@theme inline` zeruje palety; zero text-[Npx]; zero hexów w TSX) / company-ui app.css:42-43 (skala --fs-*)
added: 2026-09-12
---

## Zasada

Tailwind v4 służy w tym repo WYŁĄCZNIE do layoutu: `grid`, `flex`, `gap-*`, `items-*`, `justify-*`, `max-w-*`, `px/py` ze skali, `hidden`/`sm:flex`, `overflow-*`. Zakazane są arbitralne wartości w nawiasach dla typografii i kolorów: `text-[12.5px]`, `text-[#b4b4b9]`, `bg-[#171717]`, `border-[#333]`, `from-[#b9c4d1]`, `rounded-[10px]`, `shadow-[…]`, `tracking-[…]`, a także domyślne palety Tailwinda (`text-gray-400`, `bg-zinc-900`, `text-white`). Rozmiar pisma = klasa skali kitu (`.fs-xs … .fs-3xl`) albo utility z `@theme inline` (`text-sm` mapowane na `--fs-sm`). Kolory = klasy kitu/tokeny. `tokens.css` zeruje palety Tailwinda w `@theme inline`, więc `text-gray-400` przestaje istnieć.

## Mechanizm awarii (dlaczego)

140 wystąpień `text-[Npx]` w `site/src` (11.5–15 px, `site-audit.md` §3.2 p.6) omija skalę typograficzną kitu (`--fs-2xs … --fs-3xl`, komentarz w kicie: „every font-size migrates to these tokens"); rozmiary poniżej 12.5 px łamią czytelność (`design-typography-scale`: tekst UI ≥ .75rem). `Navbar.tsx:64-67` buduje CTA z gradientu `from-[#b9c4d1] via-[#a8b4c2] to-[#96a3b3]`, czyli własny wariant przycisku obok `.btn.btn-primary` (zasada #1: zero własnych wariantów). Arbitralne wartości nie reagują na zmianę tokenów i nie są widoczne dla `audit-contrast.mjs`. Tailwind generuje osobną klasę dla każdej wartości, więc CSS rośnie i staje się nie do przeglądu.

## Niepoprawnie

```tsx
<span className="text-[15px] font-extrabold leading-snug">…</span>
<p className="text-[12.5px] text-[#b4b4b9]">…</p>
<button className="rounded-full bg-gradient-to-b from-[#b9c4d1] via-[#a8b4c2] to-[#96a3b3] text-[#171717]">Umów</button>
<div className="border border-[#333] bg-[#17171799] backdrop-blur-sm">…</div>
```

## Poprawnie

```tsx
<span className="fs-md font-bold leading-snug t-heading">…</span>
<p className="fs-sm t-muted">…</p>
<button className="btn btn-primary">Umów 30 minut</button>
<header className="nav">…</header>   {/* .nav w kicie: --surface-overlay + hairline --border, bez blur */}
```

## Test

```bash
# arbitralne wartości typografii/kolorów/promieni/cieni
grep -rnoE "\b(text|bg|border|from|via|to|rounded|shadow|tracking|leading|ring)-\[[^]]+\]" site/src --include=*.tsx | grep -vE "\b(w|h|min-h|max-w|max-h|grid-cols|gap|top|left|right|bottom|inset|translate|basis|aspect)-\["   # oczekiwane: 0
# domyślne palety Tailwinda
grep -rnoE "\b(text|bg|border)-(white|black|gray|zinc|neutral|slate|stone)(-[0-9]{2,3})?\b" site/src --include=*.tsx   # oczekiwane: 0
# DOCELOWO (skrypt planowany, jeszcze nie istnieje — dziś: NIE SPRAWDZANO): node .claude/skills/klarow-guardian/scripts/check-design.mjs --tailwind-arbitrary
```

Severity: HIGH dla nowych plików i trybu `marketing`; dashboardy przez `--baseline` do migracji (faza 2).

## Wyjątki

Layout: `w-[calc(100%-2rem)]`, `max-h-[420px]` (wysokość panelu menu), `grid-cols-[1fr_auto]`, `min-h-[100dvh]` są dozwolone (to layout, nie kolor ani pismo). Rozmiary ikon lucide przez prop `size`, nie klasą.
