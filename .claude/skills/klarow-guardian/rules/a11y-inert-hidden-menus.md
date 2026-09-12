---
id: a11y-inert-hidden-menus
title: Zamknięte menu i panele ukryte przez inert/hidden, nie przez opacity-0 + pointer-events-none
impact: HIGH
tags: [a11y, menu, inert, keyboard, mobile]
source: WIG Accessibility (keyboard) / site-audit.md §3.2 p.3 (menu mobilne w kolejności tabulacji) / synthesis §2.2 nawigacja (panel z inert gdy zamknięty), a11y-menu-inert
added: 2026-09-12
---

## Zasada

Element wizualnie ukryty, ale obecny w DOM (menu mobilne, panel filtrów, rozwijana lista działań), dostaje `hidden` (albo `tabIndex={-1}` na każdej kontrolce w środku), a dodatkowo `inert` i `aria-hidden="true"`, gdy jest zamknięty. Sam `inert` NIE wystarcza: nie istnieje na baseline `safari13` (`code-build-target-policy`), a `aria-hidden` nie wyjmuje niczego z kolejności tabulacji. Ukrywanie wyłącznie przez `max-h-0 opacity-0 pointer-events-none` jest zakazane: linki nadal są w kolejności tabulacji i w drzewie dostępności. Przycisk otwierający ma `aria-expanded` i `aria-controls="<id panelu>"`. Animację zwijania (`grid-template-rows` jak w `.faq-answer`) łączymy z `hidden` + `inert` ustawianymi po zakończeniu przejścia (`onTransitionEnd`), a przy `prefers-reduced-motion` natychmiast; przez te ~200 ms zwijania linki mają `tabIndex={-1}`, więc kolejność tabulacji jest poprawna także w trakcie animacji.

## Mechanizm awarii (dlaczego)

`Navbar.tsx:121-123`: zamknięte menu to `max-h-0 opacity-0 pt-0 pointer-events-none`; klawiatura (Tab) przechodzi przez 3 niewidoczne linki, telefon, przełącznik języka i CTA, a czytnik ekranu czyta je jako dostępne. Na iOS VoiceOver „pointer-events: none" nie ukrywa niczego. Użytkownik klawiatury na telefonie z klawiaturą (albo desktop z zawężonym oknem) traci fokus w niewidocznym obszarze. Sam `inert` tego nie naprawia na naszym baseline: działa od Safari 15.5, a `build.target` trzyma `["es2019","safari13"]` (`code-build-target-policy`), więc na wspieranej przeglądarce degraduje się do braku efektu, a `aria-hidden` nie usuwa linków z kolejności tabulacji — dlatego zamknięty panel musi mieć `hidden` (ustawiane w `onTransitionEnd`, a przy reduced-motion natychmiast) albo `tabIndex={-1}` na każdej kontrolce w środku.

## Niepoprawnie

```tsx
// Navbar.tsx:121-123
<div className={`sm:hidden … overflow-hidden ${isOpen ? "max-h-[420px] opacity-100 pt-4" : "max-h-0 opacity-0 pt-0 pointer-events-none"}`}>
  <nav>{LINKS.map((l) => <Link to={l.to}>…</Link>)}</nav>
</div>
```

## Poprawnie

```tsx
const [isOpen, setIsOpen] = useState(false);
const [closing, setClosing] = useState(false);          // panel zostaje w DOM tylko na czas zwijania
const reduced = useReducedMotion();
const close = () => { setIsOpen(false); setClosing(!reduced); };   // reduced-motion: chowamy natychmiast

<button type="button" aria-expanded={isOpen} aria-controls="mobile-menu" aria-label={isOpen ? t.closeMenu : t.openMenu} onClick={() => (isOpen ? close() : setIsOpen(true))}>
  {isOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
</button>
<div id="mobile-menu" className="nav-panel" data-open={isOpen ? "true" : "false"}
     hidden={!isOpen && !closing}                        {/* TWARDY fallback: hidden działa na safari13, inert nie */}
     inert={!isOpen || undefined} aria-hidden={!isOpen}
     onTransitionEnd={() => setClosing(false)}>
  <nav aria-label={t.mobileNav}>
    {LINKS.map((l) => (
      <Link key={l.to} to={l.to} tabIndex={isOpen ? undefined : -1} onClick={close}>{l.label}</Link>   {/* także w trakcie zwijania poza tabulacją */}
    ))}
  </nav>
</div>
```
```css
.nav-panel { display: grid; grid-template-rows: 0fr; transition: grid-template-rows var(--duration-base) var(--ease-out); }
.nav-panel[data-open="true"] { grid-template-rows: 1fr; }
.nav-panel > * { overflow: hidden; }
@media (prefers-reduced-motion: reduce) { .nav-panel { transition: none; } }
```

## Test

```bash
grep -rnE "pointer-events-none" site/src --include=*.tsx | grep -E "opacity-0|max-h-0"        # 0
grep -rnE "aria-controls=\"mobile-menu\"" site/src/components/layout/Navbar.tsx                  # 1
grep -rnE "inert=" site/src/components/layout/Navbar.tsx                                        # ≥ 1
# twardy fallback dla safari13 (sam inert nie wystarcza): hidden na panelu albo tabIndex={-1} na linkach
grep -nE "hidden=\{!isOpen|tabIndex=\{isOpen \? undefined : -1\}|tabIndex=\{-1\}" site/src/components/layout/Navbar.tsx   # ≥ 1
# Playwright 390×844: przy zamkniętym menu, Tab z wordmarku trafia na hamburger, potem na treść (nie na ukryte linki)
# DOCELOWO (skrypt planowany, jeszcze nie istnieje — dziś: NIE SPRAWDZANO): node .claude/skills/klarow-guardian/scripts/check-a11y.mjs --tab-order 390
```

Severity: HIGH.

## Wyjątki

Elementy odmontowywane (`{open ? <Panel/> : null}`) nie potrzebują `inert`. Karty hubu ukryte filtrem używają `hidden` (patrz `code-state-in-url`), co spełnia tę regułę.
