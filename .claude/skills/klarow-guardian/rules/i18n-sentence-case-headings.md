---
id: i18n-sentence-case-headings
title: Zdaniowa pisownia nagłówków, przycisków i etykiet w PL i EN; Title Case i CAPS tylko dla wordmarku i skrótów
impact: MEDIUM
tags: [i18n, headings, sentence-case, copy, en]
source: writing-command.md „Headings" (sentence case H1–H6) vs WIG „Content & Copy" (Title Case; konwencja EN) / vercel.md §14 p.5 (decyzja: obie wersje zdaniowe) / synthesis §2.1 (sentence case PL i EN), brand-banned-words (Title Case w PL) / taste §9.F (ban eyebrow mono-caps)
added: 2026-09-12
---

## Zasada

Wszystkie nagłówki (H1–H3), leady, etykiety przycisków, chipy, pozycje nawigacji i meta title są w pisowni zdaniowej w PL i w EN: pierwsza litera wielka, reszta według reguł języka („Co osiągniesz", „What you gain", „Umów 30 minut", „Book 30 minutes", „Realizacje i dema", „Work & demos"). Wielkie litery w środku wyłącznie dla nazw własnych i skrótów (`KSeF`, `ERP`, `G703`, `PDF`, `KPI`, nazwy firm). Zakaz: Title Case w EN („Book A Free Call"), CAPS jako styl (`text-transform: uppercase` na nagłówkach, eyebrow `UPPERCASE TRACKING`), wykrzykników w nagłówkach i CTA. Wyjątek wizualny: wordmark `KLAROW` (klasa `.brand-word`) i chipy statusów w dashboardach (`OK`, `UWAGA`, `BŁĄD`), które są skrótami-kodami.

## Mechanizm awarii (dlaczego)

WIG (interfejsy EN, konwencja Chicago) mówi Title Case, Vercel writing (docs) mówi sentence case; dla dwujęzycznej strony PL kanoniczne + EN przez `pick()` dwie konwencje w jednym layoucie dają nagłówki o różnej „wadze" po przełączeniu języka. Title Case w PL nie istnieje (błąd ortograficzny: „Co Osiągniesz"). CAPS-eyebrow to zakazany wzorzec z taste §9.F i jeden z sygnałów „strony z szablonu"; `uppercase` psuje też czytelność polskich znaków diakrytycznych w małych rozmiarach i zwiększa szerokość nawigacji ponad limit 80 px wysokości / 1 linii.

## Niepoprawnie

```ts
en: { h2: "What You Will Achieve", cta: "Book A Free Call", nav: "Work & Demos" }
pl: { h2: "Co Osiągniesz!", eyebrow: "REALIZACJE" }
```
```css
.section h2 { text-transform: uppercase; letter-spacing: .12em; }
```

## Poprawnie

```ts
en: { h2: "What you gain", cta: "Book 30 minutes", nav: "Work & demos" }
pl: { h2: "Co osiągniesz", cta: "Umów 30 minut", nav: "Realizacje i dema" }
```
```tsx
<span className="brand-word" translate="no">KLAROW</span>   {/* jedyny CAPS na stronie marketingowej */}
```

## Test

```bash
# Title Case w EN: ≥ 3 słowa z wielkiej litery pod rząd (poza skrótami)
# DOCELOWO (skrypt planowany, jeszcze nie istnieje — dziś: NIE SPRAWDZANO): node .claude/skills/klarow-guardian/scripts/check-copy.mjs --title-case
grep -rnE "en: \{[^}]*\"([A-Z][a-z]+ ){2,}[A-Z][a-z]+" site/src/data                     # przegląd: 0 poza nazwami własnymi
grep -rnE "text-transform: ?uppercase|\buppercase\b" site/src --include=*.tsx --include=*.css | grep -vE "brand-word|\.st\b|company-ui.css"   # 0
grep -rnE "[!]\"" site/src/data/home.ts site/src/data/messaging.ts site/src/data/oferta.ts 2>/dev/null   # 0 (wykrzykniki w copy)
```

Severity: MEDIUM (raport). Auto-fix dozwolony dla EN Title Case → sentence case w etykietach ≤ 5 słów.

## Wyjątki

Skróty i nazwy własne; chipy statusów w trybie `tool`; wordmark. Cytaty (gdy powstaną) w oryginalnej pisowni.
