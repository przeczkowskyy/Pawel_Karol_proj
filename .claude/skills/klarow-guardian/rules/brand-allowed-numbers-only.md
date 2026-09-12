---
id: brand-allowed-numbers-only
title: Każda liczba publiczna ma źródło w references/allowed-numbers.md
impact: BLOCKER
tags: [brand, copy, numbers, sources, pricing]
source: CLAUDE.md #3 / strategy.md §4.3–4.4 / portfolio.md §4, §6.2 / peer-legal.md §1.3 / synthesis P4 (allowedNumbers z polem source) / decyzja D-07
added: 2026-09-12
---

## Zasada

Każda liczba widoczna publicznie (HTML w `dist/`, `llms.txt`, meta, JSON-LD, OG, PDF do pobrania,
posty bota, szablony outboundu, one-pager) **jest wpisana** w `references/allowed-numbers.md`
i w `MESSAGING.allowedNumbers` (`{ value, pl, en, source }`). Liczby rynkowe niosą źródło w tym
samym zdaniu lub przypisie („Sedlak & Sedlak 2026", „Panko, University of Hawai'i"). Zero kwot za
usługi Klarow (PLN / USD / $ / „od … zł") gdziekolwiek publicznie; wycena = „po bezpłatnej
diagnozie". Zamrożony zestaw anonimowy z poprzedniej firmy zostaje tylko tam, gdzie już jest
(opisy podstron, FAQ), nie trafia na `/` i nie rośnie do umowy IP. Nowa liczba = decyzja
founderów + wpis do rejestru z datą i źródłem, nigdy „z pamięci".

## Mechanizm awarii (dlaczego)

CFO poprosi o źródło. Jedna liczba bez pokrycia (np. „raport Deloitte/IDC o czasie traconym
w Excelu", której oryginału research nie znalazł) kosztuje wiarygodność wszystkich pozostałych.
Liczby przypisywalne poprzedniej firmie łamią zasadę #3 niezależnie od tego, czy padła nazwa.
Kwota publiczna zastępuje „wycenę po diagnozie" i kotwiczy negocjację (plan §1.4: cena ma być
wyższa dzięki „dniom, nie miesiącom"). taste §9.D: „NO fake-perfect numbers", KPI slop = trzy
identyczne kolumny statystyk bez źródła.

## Niepoprawnie

```tsx
<Stat value="99%" label="zadowolonych klientów" />
<p>Według raportu Deloitte pracownicy tracą 30% czasu w Excelu.</p>
<p>Pilot od 12 000 zł.</p>
<Stat value="163" label="testów importu roboczogodzin" />   // liczba poprzedniej firmy
```

## Poprawnie

```ts
// messaging.ts
allowedNumbers: [
  { value: "12", pl: "dem liczy na żywo na tej stronie", en: "demos run live on this site", source: "tools.ts: 12 × kind demo" },
  { value: "88%", pl: "arkuszy zawiera błędy w formułach", en: "of spreadsheets contain formula errors", source: "Panko, University of Hawai'i, What We Know About Spreadsheet Errors" },
]
```

```tsx
<p>88% arkuszy kalkulacyjnych zawiera błędy w formułach (Panko, University of Hawai'i).</p>
<p>Wycena po bezpłatnej diagnozie. Stała cena za zamrożony zakres.</p>
```

## Test

```bash
# kwoty za usługi: 0 trafień poza kotwicami FAQ z rejestru
grep -rnE "[0-9][0-9 .,]*\s?(zł|PLN|USD|tys\. zł)|\\$\s?[0-9]" site/src/data site/src/App.tsx site/src/pages site/src/prerender
# zakazane źródła i framing: 0 trafień
grep -rniE "deloitte|\bidc\b|oszczędz[a-z]* etat|nie zatrudniaj" site/src leadscout/*.md post-bot/*.js
# inwentarz liczb w buildzie do porównania z rejestrem (ręcznie / audit-static.mjs --numbers)
grep -rhoE "[0-9][0-9 .,]*[0-9](\s?%|\s?tys\.|\s?dni|\s?godz)?" site/dist/*.html site/dist/narzedzia/*.html | sort -u
```

## Wyjątki

Liczby w danych DEMO wewnątrz dashboardów (fikcyjne, deterministyczne, oznaczone „Demo na danych
przykładowych"), daty i rok w stopce, NAP (`786 296 426`), zakres ICP „20–250 osób", numery artykułów
na `/rodo`, liczby w kodzie i metadanych technicznych (`width`, `height`, wersje pakietów).
