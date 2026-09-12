---
id: copy-numbers-with-source
title: Każda liczba na stronie ma wpis w allowedNumbers (messaging.ts) i references/allowed-numbers.md ze źródłem; pokazuj działanie arytmetyczne
impact: BLOCKER
tags: [copy, numbers, sources, proof, brand, legal]
source: CLAUDE.md #3 (zero liczb Nuconic przed umową IP) / strategy.md §4.4 (lista dozwolonych liczb), D7 / synthesis P4 (allowedNumbers z polem source), brand-allowed-numbers, §2.3 S5 (pasek liczb), D-07 / peer-legal.md §1.3 (liczby bezpieczne ze źródłem; „8 350 × 12 × 1,2048 ≈ 121 000")
added: 2026-09-12
---

## Zasada

Każda liczba w treści widocznej (`dist/**/*.html`, `llms.txt`, PDF one-pagera, szablony outboundu) poza: danymi dem w dashboardach, datami, rokiem w stopce, NAP, numerami pozycji list i zakresami ICP z `messaging.subtext` (20–250) musi mieć wpis w `MESSAGING.allowedNumbers` (`{ value, pl, en, source, scope }`) i w `references/allowed-numbers.md` (tabela: liczba · brzmienie · źródło z rokiem · gdzie wolno · data dodania · kto zatwierdził). Liczby z wdrożeń poprzedniej firmy (D-07): zamrożony zestaw anonimowy („kilkanaście narzędzi", „≈10 000 wierszy kosztów z ERP/mies.", „~30 równoległych projektów", „raport w kilkanaście sekund zamiast godzin", „klienci w USA") TYLKO w istniejących opisach podstron i FAQ, nigdy na home; „15 narzędzi" dopiero po D-07. Liczby rynkowe (mediana wynagrodzenia kontrolera 8 350 zł, 20,48 % składek, 88 % arkuszy z błędami) cytowane ze źródłem z rokiem i, gdy wynikają z działania, z jawnym działaniem obok („8 350 × 12 × 1,2048 ≈ 121 000 zł"). Zero kwot za usługi Klarow (`copy-banned-claims`). Nowa liczba = decyzja founderów, nie agenta.

## Mechanizm awarii (dlaczego)

Liczba bez źródła to najszybszy sposób utraty wiarygodności u CFO („skąd to?"), a liczba przypisywalna do poprzedniej firmy przed umową IP to ryzyko prawne (plan §5.2, zasada #3). Marka stoi na „kalkulator, nie wróżka": pokazanie działania obok wyniku pozwala czytelnikowi sprawdzić, a sprawdzenie to uwierzenie (peer-legal §1.3). Pasek „W liczbach" w językach programisty („89 testów", „Telegram") został odrzucony przez sędziego marki (R2). Bez mechanicznej listy każdy agent piszący copy dorzuca „o 40 % szybciej" z głowy.

## Niepoprawnie

```ts
metrics: [{ value: "40%", pl: "mniej czasu na raporty" }, { value: "89", pl: "testów automatycznych" }, { value: "15", pl: "narzędzi u klientów" }]   // bez źródła; „u klientów" przed D-07; język programisty
faqAnswer: "Firmy tracą 30 % czasu w Excelu (raport Deloitte)."   // źródło niezweryfikowane
```

## Poprawnie

```ts
// messaging.ts
allowedNumbers: [
  { value: "12", pl: "dem liczy na żywo na tej stronie", en: "live demos on this site", source: "tools.ts: 12 × kind demo", scope: ["home", "hub"] },
  { value: "kilkanaście", pl: "narzędzi w jednej firmie produkcyjno-budowlanej", en: "tools in one manufacturing & construction company", source: "strategy.md §4.4 (zamrożony zestaw anonimowy); „15" po D-07", scope: ["home"] },
  { value: "3 dni", pl: "od pierwszej linii kodu do działającego produktu", en: "from first line of code to a working product", source: "git własnego produktu KSeF 2026-06-14→16", scope: ["home", "kontroling-ksef"] },
  { value: "co do grosza", pl: "kontrola sum w każdym imporcie", en: "totals reconciled to the cent in every import", source: "lib/report.ts, lib/tranches.ts (dowód w demie)", scope: ["home", "hub"] },
  { value: "121 tys. zł", pl: "roczny koszt etatu kontrolera: 8 350 × 12 × 1,2048", en: "…", source: "Sedlak & Sedlak OBW 2026 (mediana 8 350 zł) + ZUS 2026 (20,48 %)", scope: ["oferta", "one-pager"] },
]
```
```tsx
<p>Roczny koszt etatu kontrolera: <b>≈ 121 tys. zł</b> <span className="t-muted">(8 350 zł × 12 × 1,2048; Sedlak & Sedlak 2026, ZUS 2026)</span></p>
```

## Test

```bash
# skrypt wyciąga liczby z tekstu dist (poza dashboardami [data-surface="tool"], datami, NAP, rokiem) i porównuje z allowedNumbers[].value w dozwolonym scope
# DOCELOWO (skrypt planowany, jeszcze nie istnieje — dziś: NIE SPRAWDZANO): node .claude/skills/klarow-guardian/scripts/check-brand.mjs --numbers
# zamrożone liczby poza dozwolonym miejscem (home)
grep -nE "10 000|~30|30 równoległych|klienci w USA|15 narzędzi" site/dist/index.html   # 0
# każda pozycja allowedNumbers ma source i scope
node -e "const m=require('fs').readFileSync('site/src/data/messaging.ts','utf8'); const n=(m.match(/value:/g)||[]).length, s=(m.match(/source:/g)||[]).length; process.exit(n===s?0:1)" && echo "OK sources"
```

Severity: BLOCKER.

## Wyjątki

Dane fikcyjne w dashboardach i PDF-ach dem (oznaczone „DEMO: dane fikcyjne"), daty, `© 2026`, NAP, `20–250 osób`, `30 minut`, `≤ 10 dni`, `50/50`, „dzień 0 / dni 1–4 / dzień 5" (mechanika oferty, źródło: plan §1.4; wpisane do listy raz).
