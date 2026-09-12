---
id: copy-persona-outcomes-section
title: Sekcja „Co osiągniesz" obowiązkowa na home: 4 efekty w języku persony (kontroler, CFO, właściciel), zero liczb, ikony lucide, 1 zdanie + 1 linia
impact: HIGH
tags: [copy, outcomes, persona, home, icp, sections]
source: synthesis R1 (brak wskazany przez 3 sędziów), §2.3 S4 (4 efekty PL/EN), §1.7 p.2, D-11 / strategy.md §8 blok 4 („godziny kontrolera z powrotem · zamknięcie miesiąca w dni · błędy przed zarządem · urlop bez telefonów") / plan-strategiczny §2.2 („mierzy sukces")
added: 2026-09-12
---

## Zasada

Home ma między S3 („Realizacje i dema") a S5 („W liczbach") sekcję `Outcomes` z H2 „Co osiągniesz" / „What you gain", leadem ≤ 20 słów i dokładnie 4 pozycjami z `data/home.ts` (`outcomes.items`): ikona lucide 20 px, 1 zdanie efektu (≤ 8 słów, 700) i 1 linia mechanizmu (≤ 14 słów, muted). Efekty są w języku persony ICP (kontroler, główna księgowa, CFO, właściciel firmy produkcyjnej/budowlanej/dystrybucyjnej): kalendarz, zamknięcie miesiąca, błędy przed zarządem, urlop bez telefonów. ZERO liczb w tej sekcji (każda liczba wymagałaby źródła), zero słów „AI", zero nazw narzędzi. Treść startowa (D-11, do zatwierdzenia przez P):
1. `Clock` Godziny kontrolera wracają do kontrolingu. / Raport, import i sprawdzenie robi narzędzie, nie człowiek po godzinach.
2. `CalendarCheck` Zamknięcie miesiąca w dni, nie w tygodnie. / Dane z ERP, magazynu i plików spotykają się bez przeklejania.
3. `ShieldAlert` Błędy złapane przed zarządem, nie po. / Macierz OK / UWAGA / BŁĄD zanim raport wyjdzie z działu.
4. `Umbrella` Urlop bez telefonów z pytaniem o plik. / Narzędzie liczy tak samo, gdy nie ma Cię przy biurku.
Sekcja jest w shellu prerendera (`HomeShell` z `HOME.outcomes`) i w DOM; usunięcie sekcji wymaga decyzji founderów.

## Mechanizm awarii (dlaczego)

Wszystkie trzy koncepcje (editorial, proof, showreel) nie miały bloku mówiącego o KLIENCIE, nie o Klarow; sędziowie obniżyli za to każdą ocenę. Brief mówi „pokazujemy CO POTRAFIMY i CO FIRMA KLIENTA OSIĄGNIE"; bez S4 home opisuje wyłącznie Klarow (co budujemy, jak pracujemy, kim jesteśmy). Persona „człowiek-Excel" (kontroler) jest najlepszym ambasadorem, jeśli słyszy „uwalniamy Cię od odtwórczej roboty", nie „zastępujemy Cię" (`marketing-kanaly.md:87`); liczby w tej sekcji zamieniłyby obietnicę jakościową w twierdzenie wymagające źródła (`copy-numbers-with-source`).

## Niepoprawnie

```ts
// home.ts bez sekcji outcomes; albo:
outcomes: { items: [{ title: "O 40 % szybsze raportowanie" }, { title: "Automatyzacja z AI" }, { title: "Raport zarządczy w kilkanaście sekund" }] }   // liczba, AI, nazwa narzędzia
```

## Poprawnie

```ts
// data/home.ts
outcomes: {
  h2: { pl: "Co osiągniesz", en: "What you gain" },
  lead: { pl: "Nie sprzedajemy godzin ani systemu. Sprzedajemy efekt, który widać w kalendarzu i w liczbach.", en: "We don't sell hours or a system. We sell a result you can see in the calendar and in the numbers." },
  items: [
    { icon: "Clock", title: { pl: "Godziny kontrolera wracają do kontrolingu.", en: "Your controller's hours go back to controlling." }, line: { pl: "Raport, import i sprawdzenie robi narzędzie, nie człowiek po godzinach.", en: "The tool does the report, the import and the check, not a person after hours." } },
    { icon: "CalendarCheck", title: { pl: "Zamknięcie miesiąca w dni, nie w tygodnie.", en: "Month-end close in days, not weeks." }, line: { pl: "Dane z ERP, magazynu i plików spotykają się bez przeklejania.", en: "Data from ERP, warehouse and files meet without copy-paste." } },
    { icon: "ShieldAlert", title: { pl: "Błędy złapane przed zarządem, nie po.", en: "Errors caught before the board sees them, not after." }, line: { pl: "Macierz OK / UWAGA / BŁĄD zanim raport wyjdzie z działu.", en: "The OK / WARN / ERROR matrix before the report leaves the department." } },
    { icon: "Umbrella", title: { pl: "Urlop bez telefonów z pytaniem o plik.", en: "A holiday without calls about the spreadsheet." }, line: { pl: "Narzędzie liczy tak samo, gdy nie ma Cię przy biurku.", en: "The tool computes the same way when you're not at your desk." } },
  ],
}
```

## Test

```bash
grep -c "Co osiągniesz" site/dist/index.html                                  # ≥ 1 (H2 w shellu)
node -e "const h=require('fs').readFileSync('site/src/data/home.ts','utf8'); const m=h.match(/outcomes:[\s\S]*?items: \[([\s\S]*?)\n  \]/); const n=(m?m[1]:'').match(/icon:/g)||[]; process.exit(n.length===4?0:1)" && echo "OK 4 items"
# zero cyfr i „AI" w sekcji outcomes (skrypt wycina blok outcomes z home.ts)
# DOCELOWO (skrypt planowany, jeszcze nie istnieje — dziś: NIE SPRAWDZANO): node .claude/skills/klarow-guardian/scripts/check-copy.mjs --outcomes
# kolejność sekcji: S3 → S4 → S5 (skrypt czyta kolejność H2 w dist/index.html)
# PLANOWANE (F3, verify-site.mjs nie zna tego trybu): node .claude/skills/klarow-guardian/scripts/verify-site.mjs --home-sections
```

Severity: HIGH (brak sekcji lub liczby/AI w niej).

## Wyjątki

Sformułowania mogą zostać zastąpione własnymi founderów (D-11) pod warunkiem zachowania struktury 4 × (zdanie + linia), zero liczb.
