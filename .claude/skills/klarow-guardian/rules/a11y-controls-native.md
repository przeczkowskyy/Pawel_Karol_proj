---
id: a11y-controls-native
title: <button> dla akcji, <a>/<Link> dla nawigacji; zero <div onClick>, zero navigate() w onClick
impact: HIGH
tags: [a11y, semantics, button, link, keyboard, router]
source: WIG Accessibility (`<button>` for actions, `<a>`/`<Link>` for navigation; interactive elements need keyboard handlers) + Navigation & State (Links use <a>; Cmd/Ctrl-click) + Anti-patterns / vercel.md §9.5 a11y-semantic, §9.6 nav-real-links / synthesis a11y-semantic, §2.3 S3 (cała rama = <a>)
added: 2026-09-12
---

## Zasada

Akcja zmieniająca stan (otwórz dialog, filtruj, sortuj, pobierz PDF, przełącz język) = `<button type="button">`. Przejście na inny adres = `<a href>` albo `<Link to>` z react-router (obsługa Cmd/Ctrl-klik, środkowy przycisk, kopiowanie adresu). Zakazane: `<div>`/`<span>`/`<li>` z `onClick` jako kontrolka (bez `role`, `tabIndex`, `onKeyDown`), `navigate("/x")` w `onClick` przycisku zamiast `<Link>`, `<a>` bez `href` jako przycisk, `<button>` opakowany w `<Link>` (zagnieżdżone interaktywne). Cała karta narzędzia w hubie i w S3 to jeden `<a>` z `display: block`; wewnątrz karty nie ma drugiego interaktywnego elementu. Ikona wewnątrz kontrolki ma `aria-hidden="true"`; kontrolka ikonowa ma `aria-label`. Overlay dialogu obsługujący klik w tło to `<dialog>` (patrz `a11y-dialog-semantics`), nie `<div onClick>`.

## Mechanizm awarii (dlaczego)

`<div onClick>` nie jest fokusowalny, nie reaguje na Enter/Spację i nie ma roli, więc dla klawiatury i czytnika ekranu nie istnieje (WCAG 2.1.1). `navigate()` w `onClick` psuje Cmd-klik (otwarcie w nowej karcie), prawy przycisk „kopiuj adres" i crawlery: Googlebot nie wykonuje handlerów, więc nie widzi linku, a to jest sedno problemu z `ToolsGrid` (`site-audit.md` §3.6). `<button>` w `<a>` jest nieprawidłowym HTML-em: przeglądarki rozbijają drzewo, a czytniki ogłaszają dwa elementy. `BookingModal.tsx:132` overlay `<div onClick={onClose}>` jest akceptowalny wyłącznie z `role="presentation"` i alternatywą klawiszową; docelowo znika z `<dialog>`.

## Niepoprawnie

```tsx
<div className="card" onClick={() => navigate(`/narzedzia/${t.slug}`)}>…</div>
<button onClick={() => navigate("/oferta")}>Szczegóły oferty</button>
<Link to={`/narzedzia/${t.slug}`}><button className="btn">Otwórz</button></Link>
<a onClick={onBook}>Umów 30 minut</a>
```

## Poprawnie

```tsx
<Link to={`/narzedzia/${t.slug}`} className="card-link">
  <img … alt="" /><span className="t-heading">{t.name}</span><span className="t-muted">{t.hook}</span>
</Link>
<Link to="/oferta" className="btn btn-ghost">Szczegóły oferty</Link>
<button type="button" className="btn btn-primary" onClick={onBook}>{pick(lang, MESSAGING.cta.primary)}</button>
<button type="button" className="btn btn-ghost" aria-label={t.close}><X size={16} aria-hidden="true" /></button>
```

## Test

```bash
grep -rnE "<(div|span|li|p)[^>]*onClick=" site/src --include=*.tsx | grep -vE "role=\"(button|presentation)\"|<dialog"   # 0 (baseline: dashboardy)
grep -rnE "onClick=\{[^}]*navigate\(" site/src --include=*.tsx                                                            # 0
grep -rnE "<a [^>]*onClick=" site/src --include=*.tsx | grep -v "href="                                                   # 0
grep -rnE "<Link[^>]*>\s*<button" site/src --include=*.tsx                                                                # 0
# DOCELOWO (skrypt planowany, jeszcze nie istnieje — dziś: NIE SPRAWDZANO): node .claude/skills/klarow-guardian/scripts/check-a11y.mjs --controls
# ESLint jsx-a11y: click-events-have-key-events, no-static-element-interactions, anchor-is-valid
```

Severity: HIGH.

## Wyjątki

Wiersz tabeli w dashboardzie z `onClick` do zaznaczenia dopuszczalny tylko z `role="button" tabIndex={0} onKeyDown` (Enter/Spacja) i widocznym fokusem; preferowany jest przycisk w komórce.
