---
id: a11y-touch-targets-44
title: Cele dotykowe ≥ 44×44 px, touch-action: manipulation, tap-highlight ustawiony, overscroll-behavior w dialogach
impact: MEDIUM
tags: [a11y, touch, mobile, targets, gestures]
source: WIG Touch & Interaction (6 reguł) / WCAG 2.5.8 (24 px min) i Apple HIG (44 pt) / vercel.md §9.5 touch-* / synthesis a11y-touch, §2.4.8 (fallback pointer: coarse)
added: 2026-09-12
---

## Zasada

Każdy element interaktywny na `(pointer: coarse)` ma obszar kliknięcia ≥ 44×44 px (CSS: `min-height: 44px` na `.btn`, `.chip`, linkach nawigacji; ikony 16–24 px w kontrolce 44 px przez padding; w gęstych tabelach dem ≥ 32 px z odstępem ≥ 8 px). Globalnie `button, a, [role="button"] { touch-action: manipulation; }` (zdejmuje 300 ms opóźnienia double-tap) i `-webkit-tap-highlight-color: transparent` z własnym stanem `:active` (kit). Dialog, panele scrollowalne i tabele w scrollboxie mają `overscroll-behavior: contain`. Gesty (swipe, drag, pinch) nie są jedyną drogą do akcji: zawsze jest przycisk i klawiatura (WCAG 2.5.1); suwak tygodnia w `ProductionDashboard` ma przyciski „−/+" i strzałki. `autoFocus` tylko na desktopie, jednym polu, nigdy na mobile.

## Mechanizm awarii (dlaczego)

Chipy filtrów `.st` mają wysokość ~22 px; na telefonie (główny kanał LinkedIn/QR, `strategy.md` §3.3) palec trafia w sąsiedni chip, a przełącznik PL/EN w navbarze (`px-2 py-1 text-[11px]`) ma ~24×20 px. Brak `touch-action: manipulation` daje 300 ms zwłoki kliknięcia na starszych WebKitach i sprawia, że szybkie kliknięcie CTA jest interpretowane jako zoom. Brak `overscroll-behavior: contain` w dialogu przewija stronę pod dialogiem (scroll chaining) i zamyka go na iOS przy „pull-to-refresh". `autoFocus` na mobile wysuwa klawiaturę i przewija stronę do pola, zanim użytkownik cokolwiek przeczyta.

## Niepoprawnie

```tsx
<button className="px-2 py-1 text-[11px] rounded-full">EN</button>                 {/* ~24×20 px */}
<input type="range" onChange={setWeek} />                                        {/* tylko gest, brak przycisków */}
<textarea autoFocus />                                                            {/* mobile: klawiatura na starcie */}
```

## Poprawnie

```css
:root { --tap: 44px; }
.btn, .chip, .nav a, .lang-switch { min-height: var(--tap); min-width: var(--tap); }
button, a, [role="button"], input, select, textarea { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
.dialog-body, .scrollbox, .data-table-wrap { overscroll-behavior: contain; }
@media (pointer: coarse) { .data-table td button { min-height: 32px; } }
```
```tsx
<div className="week-picker">
  <button type="button" className="btn btn-ghost" aria-label={t.prevWeek} onClick={() => setWeek((w) => w - 1)}><ChevronLeft size={16} aria-hidden="true" /></button>
  <input type="range" min={1} max={52} value={week} onChange={(e) => setWeek(Number(e.target.value))} aria-label={t.week} />
  <button type="button" className="btn btn-ghost" aria-label={t.nextWeek} onClick={() => setWeek((w) => w + 1)}><ChevronRight size={16} aria-hidden="true" /></button>
</div>
```

## Test

```bash
grep -nE "touch-action: ?manipulation" site/src/styles/*.css                          # ≥ 1
grep -nE "tap-highlight-color" site/src/styles/*.css                                  # ≥ 1
grep -rnE "overscroll-behavior: ?contain" site/src/styles/*.css                       # ≥ 1
grep -rnE "autoFocus" site/src --include=*.tsx                                        # 0 (albo z komentarzem „desktop only" + matchMedia)
# Playwright 390×844 (pointer: coarse): getBoundingClientRect każdego a/button/input; fail gdy w < 44 || h < 44 (poza tabelami dem: 32)
# DOCELOWO (skrypt planowany, jeszcze nie istnieje — dziś: NIE SPRAWDZANO): node .claude/skills/klarow-guardian/scripts/check-a11y.mjs --targets 390
```

Severity: MEDIUM (raport); przełącznik języka i CTA w nav < 44 px = HIGH (ścieżka konwersji).

## Wyjątki

Linki w akapicie prozy (inline) nie muszą mieć 44 px (WCAG wyłącza „inline"). Komórki tabel dem w trybie `tool`: 32 px z odstępem 8 px.
