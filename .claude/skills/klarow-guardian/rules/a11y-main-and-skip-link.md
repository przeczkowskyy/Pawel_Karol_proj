---
id: a11y-main-and-skip-link
title: Landmarki: <main id="main"> na każdej trasie, skip-link jako pierwszy element, <nav> i <footer>
impact: HIGH
tags: [a11y, landmarks, skip-link, keyboard, prerender]
source: WIG Accessibility („include skip link for main content"; semantic HTML before ARIA) / site-audit.md §3.2 p.1 (PageMain = div, shell ma <main>, React go usuwa) / synthesis a11y-landmarks, §2.7.2 (components/layout/SkipLink)
added: 2026-09-12
---

## Zasada

Każda trasa renderuje dokładnie jeden `<main id="main" tabIndex={-1}>` (w `PageMain`, także dla `/narzedzia/:slug`, która dziś składa `<ToolPage/><Footer/>` bez `PageMain`), jeden `<header>` z `<nav aria-label="Główna">`, jeden `<footer>`. Pierwszym elementem w `#root` jest skip-link `<a href="#main" className="skip-link">Przejdź do treści</a>` (widoczny po fokusie, `{ pl, en }`). Shell prerendera i DOM po starcie Reacta mają tę samą strukturę landmarków; `main` w shellu (`entry.tsx:59`) nie może znikać po hydracji. Sticky navbar nie zasłania celu skip-linku: `html { scroll-padding-top: var(--nav-h) }`.

## Mechanizm awarii (dlaczego)

`PageMain` w `App.tsx:696-698` to `<div style={{ paddingTop: 96 }}>`; po starcie Reacta strona nie ma `<main>` (shell prerendera go ma, ale `createRoot().render` podmienia `#root`). Czytnik ekranu nie może skoczyć do treści klawiszem landmarku, a użytkownik klawiatury musi tabulować przez cały navbar (wordmark, 3 linki, telefon, PL/EN, CTA) na każdej podstronie. Brak skip-linku to jedno z kryteriów WCAG 2.4.1 (Bypass Blocks); Lighthouse a11y ≥ 95 (kit DoD) nie przejdzie bez `main`. `id="main"` musi mieć `tabIndex={-1}`, inaczej Safari nie przenosi fokusu po kliknięciu kotwicy.

## Niepoprawnie

```tsx
// App.tsx:696-698
function PageMain({ children }) { return <div style={{ paddingTop: 96 }}>{children}</div>; }
// App.tsx:831-839: podstrona bez PageMain
<Route path="/narzedzia/:slug" element={<><ToolPage /><Footer /></>} />
```

## Poprawnie

```tsx
// components/layout/SkipLink.tsx
export function SkipLink() { const { lang } = useLang(); return <a href="#main" className="skip-link">{pick(lang, { pl: "Przejdź do treści", en: "Skip to content" })}</a>; }
// components/layout/PageMain.tsx
export function PageMain({ children }: { children: React.ReactNode }) { return <main id="main" tabIndex={-1} className="page-main">{children}</main>; }
// App.tsx: SkipLink pierwszy w .content-layer; każda trasa w PageMain; Footer poza main
<div className="content-layer"><SkipLink /><Navbar /><Routes>…</Routes><Footer /></div>
```
```css
.skip-link { position: absolute; left: 16px; top: -100px; z-index: 100; } .skip-link:focus-visible { top: 16px; }
html { scroll-padding-top: var(--nav-h, 64px); }
```

## Test

```bash
# dist: dokładnie 1 <main i 1 skip-link per plik HTML
for f in $(find site/dist -name "*.html"); do m=$(grep -c "<main" "$f"); s=$(grep -c "skip-link" "$f"); [ "$m" = 1 ] && [ "$s" = 1 ] || echo "FAIL $f main=$m skip=$s"; done
grep -rnE "<main id=\"main\"" site/src --include=*.tsx | wc -l    # ≥ 1 (PageMain)
# DOM po JS (Playwright WebKit): document.querySelectorAll("main").length === 1 na każdej trasie
# DOCELOWO (skrypt planowany, jeszcze nie istnieje — dziś: NIE SPRAWDZANO): node .claude/skills/klarow-guardian/scripts/check-a11y.mjs --landmarks
```

Severity: HIGH.

## Wyjątki

`dist/404.html` też ma `main` i skip-link (to zwykła trasa). Dialog rezerwacji renderuje się poza `main` (portal), co jest poprawne.
