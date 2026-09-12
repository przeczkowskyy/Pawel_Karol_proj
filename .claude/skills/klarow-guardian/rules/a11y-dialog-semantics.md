---
id: a11y-dialog-semantics
title: Dialog: natywny <dialog> (lub role="dialog" aria-modal aria-labelledby), focus-trap, zwrot fokusu, Esc, klik w tło
impact: HIGH
tags: [a11y, dialog, modal, focus, keyboard]
source: WIG Accessibility + Touch (overscroll-behavior: contain w modalach) / site-audit.md §3.2 p.2 (BookingModal bez role/aria-modal/focus-trap) / vercel.md §9.5 (overlay onClick tylko z role="presentation" + Esc) / kit company-ui J2 / synthesis a11y-dialog, F0 (BookingDialog jako <dialog>, Cal.com link)
added: 2026-09-12
---

## Zasada

`BookingDialog` (następca `BookingModal`) i każdy przyszły modal używają natywnego `<dialog>` otwieranego przez `showModal()`; przeglądarka dostarcza wtedy `role`, `aria-modal`, focus-trap, `Esc` i `inert` reszty strony. Wymagane dodatkowo: `aria-labelledby` wskazujące nagłówek dialogu, początkowy fokus na pierwszym sensownym elemencie (nagłówek z `tabIndex={-1}` albo pierwsze pole), zwrot fokusu do elementu otwierającego po zamknięciu (przeglądarka robi to dla `showModal()`; przy portalu React sprawdzić), zamknięcie klikiem w backdrop przez porównanie `e.target === dialog`, `overscroll-behavior: contain` na treści dialogu, portal poza elementami z `transform`/`filter` (inaczej `position: fixed` liczy się względem transformowanego rodzica). Jeśli `<dialog>` nie może być użyty (uzasadnienie w komentarzu), wariant ARIA: `role="dialog" aria-modal="true" aria-labelledby` + ręczny focus-trap + `Esc` + zwrot fokusu.

## Mechanizm awarii (dlaczego)

`BookingModal.tsx:132-235`: overlay `<div className="modal-overlay-c open" onClick={onClose}>` bez `role`, dialog bez `aria-modal`/`aria-labelledby`, brak początkowego fokusu i focus-trapu (Tab wychodzi pod overlay na linki strony), brak zwrotu fokusu (po zamknięciu fokus ląduje na `<body>`). Czytnik ekranu nie wie, że otworzył się dialog, a użytkownik klawiatury po zamknięciu traci pozycję. Escape działa (L105-110), ale przez własny listener, który trzeba sprzątać (`code-effects-hygiene`). Dodatkowo bug daty `BookingModal.tsx:78` (`toISOString()` przesuwa dzień o −1 w strefie PL) wpisuje zły dzień do tematu maila; nowy dialog dostaje ten fix przy okazji (`YYYY-MM-DD` z `getFullYear/getMonth/getDate`).

## Niepoprawnie

```tsx
return (
  <div className="modal-overlay-c open" onClick={onClose}>
    <div className="modal-c" onClick={(e) => e.stopPropagation()}>
      <button className="modal-close" onClick={onClose} aria-label={t.close}><X size={15} /></button>
      <h2>{t.title}</h2>
```

## Poprawnie

```tsx
const ref = useRef<HTMLDialogElement>(null);
useEffect(() => { const d = ref.current; if (!d) return; open ? d.showModal() : d.close(); }, [open]);
return (
  <dialog ref={ref} className="dialog" aria-labelledby="booking-title" onClose={onClose}
          onClick={(e) => { if (e.target === ref.current) onClose(); }}>
    <div className="dialog-body" style={{ overscrollBehavior: "contain" }}>
      <h2 id="booking-title" tabIndex={-1}>{t.title}</h2>
      <button type="button" className="btn btn-ghost" onClick={onClose} aria-label={t.close}><X size={16} aria-hidden="true" /></button>
      <a className="btn btn-primary" href={CAL_URL} target="_blank" rel="noopener">{pick(lang, MESSAGING.cta.primary)}</a>
    </div>
  </dialog>
);
```
```css
.dialog::backdrop { background: rgba(18, 18, 18, .72); }   /* scrim kitu */
```

## Test

```bash
grep -rnE "<dialog" site/src --include=*.tsx | wc -l                                   # ≥ 1
grep -rnE "modal-overlay-c|role=\"dialog\"" site/src --include=*.tsx                    # 0 wariantów bez aria-modal
grep -rnE "aria-labelledby=" site/src/components/BookingDialog.tsx                       # ≥ 1
grep -rnE "toISOString\(\)\.slice\(0, ?10\)" site/src                                     # 0 (bug daty)
# Playwright: otwórz dialog, Tab ×20 nigdy nie opuszcza dialogu; Esc zamyka; fokus wraca na przycisk CTA
# DOCELOWO (skrypt planowany, jeszcze nie istnieje — dziś: NIE SPRAWDZANO): node .claude/skills/klarow-guardian/scripts/check-a11y.mjs --dialog
```

Severity: HIGH.

## Wyjątki

Nie-modalne panele (menu mobilne) nie są dialogami: patrz `a11y-inert-hidden-menus`. Podglądy PDF nie otwierają modala (pobieranie pliku).
