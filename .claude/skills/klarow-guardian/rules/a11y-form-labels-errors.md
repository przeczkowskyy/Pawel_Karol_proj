---
id: a11y-form-labels-errors
title: Formularze: label/htmlFor, type + inputmode + autocomplete, błędy inline z fokusem, zero blokady paste; komunikaty asynchroniczne w aria-live
impact: HIGH
tags: [a11y, forms, inputs, validation, pke, aria-live, status]
source: WIG Forms (11 reguł) + Anti-patterns (onPaste preventDefault, inputs without labels) / vercel.md §9.7 / kit company-ui J1–J7 / peer-legal.md §1.4 (formularze bez domyślnych zgód; inbound „najgorszy Excel")
added: 2026-09-12
---

## Zasada

Każda kontrolka formularza (także szukajka w dashboardzie, `textarea` na CSV, przyszły formularz „najgorszy Excel" i newsletter) ma: (1) `<label htmlFor>` albo `aria-label`/`aria-labelledby`; (2) poprawny `type` (`email`, `tel`, `url`, `number`) i `inputMode` (`numeric`, `decimal`, `email`); (3) sensowny `name` i `autoComplete` (`email`, `tel`, `organization`, `name`; `off` na polach nie-autoryzacyjnych, które nie powinny budzić menedżera haseł); (4) `spellCheck={false}` na e-mail, kodach, identyfikatorach; (5) błędy walidacji inline obok pola (`aria-describedby` → element z `aria-live="polite"`), fokus na pierwszym błędnym polu po submit; (6) przycisk submit aktywny do momentu wysłania (spinner w trakcie), nigdy `disabled` „dopóki formularz nie jest poprawny"; (7) placeholder z przykładem i „…" na końcu; (8) zero `onPaste` + `preventDefault`; (9) checkbox i etykieta = jeden cel kliknięcia; (10) checkboxy zgód NIE są domyślnie zaznaczone (`legal-pke-consent-forms`); (11) `beforeunload`/guard routera przy niezapisanych zmianach w kreatorach dem; (12) **każdy komunikat pojawiający się bez nawigacji** — toast, stan ładowania dema, wynik PASS/FAIL rekoncyliacji, liczba wyników po zmianie filtra hubu, „Pobieram PDF…" — żyje w regionie obecnym w DOM od pierwszego renderu, z `role="status"` i `aria-live="polite"` (`aria-live="assertive"` wyłącznie dla błędu blokującego akcję). Region wstawiany do DOM dopiero razem z komunikatem nie zostanie odczytany.

## Mechanizm awarii (dlaczego)

Pole bez etykiety jest dla czytnika ekranu „edit text" bez nazwy (WCAG 1.3.1, 4.1.2); `type="text"` na e-mailu na iOS daje klawiaturę bez `@` i włącza autokorektę (`spellCheck`); błąd wyświetlony tylko na górze formularza nie jest ogłaszany i nie prowadzi do pola; `disabled` submit ukrywa, DLACZEGO nie można wysłać. Blokada wklejania psuje menedżery haseł i wklejanie e-maila z Outlooka. Domyślnie zaznaczona zgoda marketingowa jest nieważna w świetle art. 398 PKE (zgoda ma być czynna) i art. 7 RODO.

## Niepoprawnie

```tsx
<input placeholder="E-mail" />
<input type="text" onPaste={(e) => e.preventDefault()} />
<button type="submit" disabled={!valid}>Wyślij</button>
<input type="checkbox" defaultChecked name="newsletter" /> Chcę otrzymywać informacje handlowe
{error ? <p className="err">{error}</p> : null}   {/* na górze, bez powiązania z polem */}
```

## Poprawnie

```tsx
<label htmlFor="email" className="lbl-sm">{t.email}</label>
<input id="email" name="email" type="email" inputMode="email" autoComplete="email" spellCheck={false}
       placeholder="anna.kowalska@firma.pl…" aria-invalid={!!errors.email} aria-describedby="email-err" ref={firstErrorRef} />
<p id="email-err" className="err" aria-live="polite">{errors.email ?? ""}</p>
<label className="check"><input type="checkbox" name="newsletter" /> {t.newsletterConsent}</label>   {/* niezaznaczony */}
<button type="submit" className="btn btn-primary" aria-busy={pending}>{pending ? t.sending : t.send}</button>
```
Po submit z błędami: `firstErrorRef.current?.focus()`.

## Test

```bash
# input/textarea/select bez id+label lub aria-label (heurystyka)
grep -rnE "<(input|textarea|select)\b" site/src --include=*.tsx | grep -vE "aria-label|id=\"" | grep -v "type=\"hidden\""   # przegląd: 0
grep -rnE "onPaste=" site/src --include=*.tsx                                                                             # 0
grep -rnE "type=\"checkbox\"[^>]*(defaultChecked|checked=\{true\})" site/src --include=*.tsx                                # 0
grep -rnE "type=\"email\"" site/src --include=*.tsx | grep -v "spellCheck={false}"                                         # 0
grep -rnE "disabled=\{!(valid|isValid|ok)\}" site/src --include=*.tsx                                                     # 0
# każdy komponent zmieniający treść bez nawigacji ma region aria-live (toasty, stany dem, PASS/FAIL)
grep -rn "aria-live" site/src --include=*.tsx                                                                             # ≥ 1 na komponent z komunikatem
grep -rn "role=\"status\"" site/src --include=*.tsx                                                                       # ≥ 1
# ESLint jsx-a11y/label-has-associated-control, control-has-associated-label
```

Severity: HIGH (label, paste, type); MEDIUM reszta (raport).

## Wyjątki

`textarea` na CSV w `DemoReport` ma etykietę wizualną nad polem; `aria-label` wystarcza, jeśli etykieta nie jest `<label>`. Pola dem nie mają `autoComplete` danych osobowych (nie ma tam takich pól).
