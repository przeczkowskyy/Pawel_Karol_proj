---
id: i18n-pl-en-pair-required
title: Każdy string UI = obiekt { pl, en } + pick(); zero gołych stringów PL/EN w JSX i w danych
impact: HIGH
tags: [i18n, pl, en, data, pick, lint]
source: CLAUDE.md #5 (wzorzec { pl, en } + pick() z src/i18n.tsx) / site-audit.md §1.5 / vercel.md §9.10 KL:i18n-pair / synthesis brand-i18n-pair, §2.7.3 (delivery/outcome PL+EN; lint danych)
added: 2026-09-12
---

## Zasada

Każdy tekst widoczny lub czytany przez technologie asystujące (nagłówki, akapity, etykiety przycisków, `aria-label`, `alt`, placeholdery, komunikaty błędów, `title`/`description` meta, FAQ, hooki narzędzi, etykiety chipów, treść PDF) jest zdefiniowany jako `{ pl: string; en: string }` w `src/data/*.ts` albo w stałej `T` przy komponencie i renderowany przez `pick(lang, …)` (`src/i18n.tsx`). Typy danych wymuszają parę (`{ pl: string; en: string }`, nigdy `string`); pola opcjonalne są opcjonalne jako cała para, nie per język. W JSX nie ma literałów tekstowych z polskimi znakami ani angielskich zdań; w atrybutach `aria-label`/`alt`/`placeholder` też nie. Nazwy własne stałe w obu językach (`KLAROW`, `KSeF`, `G703`, `ERP`) są jednym stringiem z `translate="no"`. Kompletność par w `tools.ts`, `toolsSeo.ts`, `faq.ts`, `pagesSeo.ts`, `home.ts`, `oferta.ts`, `rodo.ts`, `messaging.ts` pilnują typy (`{ pl: string; en: string }`) oraz grepy z sekcji Test; bramka skryptowa `verify-site.mjs --data-lint` jest PLANOWANA (F3) i dziś nie istnieje — nie powołuj się na jej zielony wynik.

## Mechanizm awarii (dlaczego)

Goły string PL w JSX pokazuje się użytkownikowi EN (i odwrotnie), a agent, który widzi jeden taki przypadek, tworzy kolejne; przy 19 trasach i 13 narzędziach tłumaczenie „na końcu" jest nierealne. Brak pary w danych nie psuje `tsc`, jeśli typ pozwala na `string`, więc bramka musi siedzieć w typach i w lincie danych. Trasy `/en/` (D-20) będą mechanicznym splitem tylko wtedy, gdy 100 % stringów ma parę już dziś. `aria-label` po polsku dla użytkownika EN czytnika ekranu to błąd dostępności, nie tylko kosmetyka.

## Niepoprawnie

```tsx
<button aria-label="Zamknij"><X size={16} /></button>
<p className="t-muted">Dane fikcyjne, demo działa w przeglądarce.</p>
{lang === "pl" ? "Pobierz PDF" : "Download PDF"}                       // inline ternary zamiast pick
export const DELIVERY = "pilot 5–10 dni";                              // typ string
```

## Poprawnie

```tsx
const T = { pl: { close: "Zamknij", note: "Dane fikcyjne, demo działa w przeglądarce.", pdf: "Pobierz PDF" }, en: { close: "Close", note: "Sample data, the demo runs in your browser.", pdf: "Download PDF" } } as const;
const t = pick(lang, T);
<button type="button" aria-label={t.close}><X size={16} aria-hidden="true" /></button>
<p className="t-muted">{t.note}</p>
```
```ts
export interface ToolBase { delivery: { pl: string; en: string }; outcome: { pl: string; en: string }; /* … */ }
```

## Test

```bash
# gołe stringi PL w JSX (heurystyka: polskie znaki między > < lub w atrybutach tekstowych)
grep -rnE ">[^<{]*[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ][^<{]*<" site/src --include=*.tsx | grep -v "site/src/data/"        # 0
grep -rnE "(aria-label|alt|placeholder|title)=\"[^\"]*[a-zA-Ząćęłńóśźż]{3,}" site/src --include=*.tsx      # 0 (wartości przez {t.x})
grep -rnE "lang === \"pl\" \? \"" site/src --include=*.tsx                                                   # 0
# kompletność par w danych (skrypt: każdy obiekt z kluczem pl ma en i odwrotnie; puste stringi = fail)
# DOCELOWO (skrypt planowany, jeszcze nie istnieje — dziś: NIE SPRAWDZANO): node .claude/skills/klarow-guardian/scripts/check-copy.mjs --pairs
# PLANOWANE (F3, verify-site.mjs nie zna tego trybu): node .claude/skills/klarow-guardian/scripts/verify-site.mjs --data-lint
```

Severity: HIGH.

## Wyjątki

Identyfikatory i wartości techniczne (`slug`, klucze, formaty dat w kodzie), nazwy własne z `translate="no"`, dane liczbowe dem. `demo/` (statyczna prezentacja HTML) jest poza `site/` i ma własny reżim (PL only, dozwolone).
