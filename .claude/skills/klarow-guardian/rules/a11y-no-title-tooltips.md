---
id: a11y-no-title-tooltips
title: Zero atrybutu title jako tooltipa; nazwa dostępna przez aria-label, tooltip kitu widoczny na fokusie i dotyku
impact: LOW
tags: [a11y, tooltip, title, touch, kit]
source: kit company-ui J1–J7 (tooltip nie title=) / WIG Accessibility (icon-only buttons need aria-label) / synthesis kit-a11y-micro
added: 2026-09-12
---

## Zasada

Atrybut `title` nie jest używany do przekazywania informacji: nie działa na dotyku, nie jest ogłaszany spójnie przez czytniki, pojawia się z opóźnieniem ~1 s i znika przy ruchu myszy. Nazwa dostępna elementu ikonowego = `aria-label`; wyjaśnienie widoczne dla wszystkich = tekst obok ikony albo tooltip kitu (`.tip`) wyzwalany na `:hover` I `:focus-visible` I dotyk (kliknięcie), z `role="tooltip"` i `aria-describedby`. Skróty w tabelach dem (np. „ETC", „EAC") mają rozwinięcie w `<abbr>` z widoczną legendą pod tabelą, nie w `title`. Wyjątek: `title` na `<iframe>` (wymagany przez WCAG) i na `<svg><title>` jako fallback nazwy.

## Mechanizm awarii (dlaczego)

Główny ruch ciepły to telefon (LinkedIn/QR): `title` na dotyku nie istnieje, więc informacja ginie u połowy odbiorców. Dla klawiatury `title` nie pojawia się po fokusie w Chromium; czytniki traktują `title` jako opis niskiego priorytetu i często go pomijają, gdy jest `aria-label`. Kit `company-ui` ma własny tooltip (J-lista), więc `title` byłby drugim, niespójnym wariantem (zasada #1: jedna implementacja).

## Niepoprawnie

```tsx
<button title="Pobierz PDF"><Download size={16} /></button>
<th title="Estimate to Complete">ETC</th>
```

## Poprawnie

```tsx
<button type="button" className="btn btn-ghost" aria-label={t.downloadPdf} aria-describedby="tip-pdf"><Download size={16} aria-hidden="true" /></button>
<span id="tip-pdf" role="tooltip" className="tip">{t.downloadPdfHint}</span>
<th><abbr>ETC</abbr></th> … <p className="legend"><b>ETC</b>: {t.etcLong} · <b>EAC</b>: {t.eacLong}</p>
```

## Test

```bash
grep -rnE "\btitle=\"" site/src --include=*.tsx | grep -vE "<iframe|<svg|<title>"   # 0
grep -rnE "\btitle=\{" site/src --include=*.tsx | grep -vE "<iframe"                 # 0
```

Severity: LOW (raport). Auto-fix dozwolony: `title=` → `aria-label=` na kontrolkach ikonowych.

## Wyjątki

`<iframe title>` (Cal.com embed w fazie 2), `<svg><title>` jako fallback, `<abbr title>` jest tolerowane, jeśli rozwinięcie jest też widoczne w legendzie.
