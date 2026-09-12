---
id: legal-sources-for-market-numbers
title: Każda liczba rynkowa publikowana ze źródłem i rokiem w tym samym zdaniu lub przypisie; zakaz liczb bez osiągalnego źródła
impact: HIGH
tags: [legal, copy, numbers, sources, advertising, uokik, outbound, one-pager]
source: peer-legal.md §1.3 (tabela liczb bezpiecznych; zakaz „raportu Deloitte/IDC"; McKinsey zawsze z rokiem 2012; Panko 88 %) / references/allowed-numbers.md §2 / rules/copy-numbers-with-source.md (rejestr) i rules/copy-banned-claims.md
added: 2026-09-12
---

## Zasada

Liczba rynkowa (wynagrodzenie, procent, liczba dni, udział rynku, koszt, „firmy tracą N % czasu") opublikowana gdziekolwiek — `dist/**`, `llms.txt`, PDF one-pagera, szablon outboundu, post bota, slajd, wizytówka — niesie **w tym samym zdaniu, w komórce tabeli albo w widocznym przypisie**: nazwę źródła i **rok** publikacji. Gdy liczba jest wynikiem działania, obok stoi działanie („8 350 × 12 × 1,2048 ≈ 121 000 zł"), żeby czytelnik mógł sprawdzić.

Wolno używać wyłącznie liczb z tabeli w `references/allowed-numbers.md` §2, każda w brzmieniu i ze źródłem z tej tabeli:
- mediana wynagrodzenia kontrolera 8 350 zł brutto/mies. (P25 7 000, P75 9 800) — Ogólnopolskie Badanie Wynagrodzeń Sedlak & Sedlak 2026,
- 20,48 % składek pracodawcy i wynikające ~121 tys. zł/rok, fully-loaded 140–160 tys. — ZUS 2026,
- ~141 tys. zł/rok dla analityka danych mid — Sedlak & Sedlak 2026 + ZUS 2026,
- Time to Hire 33 dni / Time to Fill 56 dni — dane rynkowe PL, II poł. 2025 (przy użyciu wskazać publikację),
- fee agencji rekrutacyjnej 15–20 % rocznego brutto — rynek rekrutacyjny PL 2026 (jw.),
- **88 % arkuszy kalkulacyjnych zawiera błędy w formułach** (45 % logiczne, 23 % mechaniczne, 31 % pominięcia) — Panko, University of Hawai'i, „What We Know About Spreadsheet Errors" (recenzowane; najmocniejsza dostępna liczba),
- 19–20 % czasu pracowników wiedzy na wyszukiwanie informacji — McKinsey Global Institute, **rok 2012 obowiązkowo w cytacie**.

**Zakazane bezwzględnie:** „raport Deloitte/IDC o czasie traconym w Excelu" i każda jego parafraza (research nie dotarł do oryginału, liczba krąży bez referencji); każda liczba rynkowa bez osiągalnego źródła; zaokrąglanie w górę względem źródła; przypisywanie liczby innemu autorowi lub nowszemu rokowi niż w oryginale; liczby z wdrożeń poprzedniej firmy (`brand-no-nuconic`, D-07). Nowa liczba wchodzi do obiegu wyłącznie decyzją founderów: wiersz w `references/allowed-numbers.md` + wpis w `MESSAGING.allowedNumbers` w tym samym commicie (`copy-numbers-with-source`).

Ta reguła dokłada do rejestru z `copy-numbers-with-source` wymóg **widoczności** źródła dla czytelnika i **odpowiedzialności prawnej** za twierdzenie; rejestr pilnuje, że liczba w ogóle wolno użyć, ta reguła — jak ma wyglądać na stronie.

To wymaganie produktowe, nie opinia prawna; kwalifikacja i treść klauzul do przeglądu radcy (D-21).

## Mechanizm awarii (dlaczego)

Liczba w materiale handlowym to twierdzenie o faktach: reklama wprowadzająca w błąd co do istotnych cech usługi i spodziewanych korzyści jest czynem nieuczciwej konkurencji (art. 16 ustawy o zwalczaniu nieuczciwej konkurencji) i nieuczciwą praktyką rynkową, a ciężar udowodnienia prawdziwości spoczywa na tym, kto ją podał. „Deloitte mówi, że…" bez osiągalnego raportu jest nie do obronienia. Biznesowo działa to jeszcze szybciej: CFO, który poprosi o źródło i go nie dostanie, przestaje wierzyć **wszystkim** pozostałym liczbom w dokumencie, łącznie z tymi poprawnymi — a marka stoi na haśle „kalkulator, nie wróżka". Liczba bez roku starzeje się cicho: McKinsey 19–20 % pochodzi z 2012 roku i podana bez daty sugeruje stan dzisiejszy, co jest wprowadzeniem w błąd nawet przy poprawnym cytacie.

## Niepoprawnie

```ts
// site/src/data/faq.ts — liczba bez źródła i bez roku, plus zakazany „raport"
{ q: { pl: "Ile czasu tracimy w Excelu?" },
  a: { pl: "Firmy tracą nawet 30 % czasu pracy w arkuszach (raport Deloitte)." } }
```
```tsx
// one-pager: liczba z zaokrągleniem w górę, bez działania i bez roku
<p>Kontroler kosztuje firmę ponad 150 tys. zł rocznie.</p>
<p>Aż 90 % arkuszy zawiera błędy.</p>          {/* źródło mówi 88 %, wersja bez autora i tytułu */}
```

## Poprawnie

```ts
// site/src/data/faq.ts — źródło i rok w tym samym zdaniu
{ q: { pl: "Skąd wiecie, że arkusze mają błędy?", en: "…" },
  a: { pl: "Z recenzowanego przeglądu badań: 88 % arkuszy kalkulacyjnych zawiera błędy w formułach (Panko, University of Hawai'i, „What We Know About Spreadsheet Errors”). Dlatego audyt jakości danych jest pierwszym krokiem, a nie dodatkiem.", en: "…" } }
```
```tsx
// /oferta — liczba z działaniem, czytelnik może sprawdzić; zero framingu odejmowania etatu
<p>
  Mediana wynagrodzenia kontrolera to 8 350 zł brutto miesięcznie (Ogólnopolskie Badanie Wynagrodzeń
  Sedlak &amp; Sedlak 2026), a ze składkami pracodawcy 20,48 % (ZUS 2026) daje to
  <span className="tabular-nums"> 8 350 × 12 × 1,2048 ≈ 121 000 zł</span> rocznie.
  Nie proponujemy, żeby ten etat zniknął: proponujemy, żeby te 121 tys. kupowało analizę, a nie sklejanie arkuszy.
</p>
```
```ts
// references/allowed-numbers.md + messaging.ts w jednym commicie
{ value: "88 %", pl: "arkuszy kalkulacyjnych zawiera błędy w formułach", source: "Panko, University of Hawai'i, „What We Know About Spreadsheet Errors”", scope: ["oferta", "narzedzia/audyt-jakosci", "one-pager"] }
```

## Test

```bash
# 1. zakazane źródła i twierdzenia bez pokrycia
grep -rniE "deloitte|idc|gartner|forrester" site/src site/dist leadscout docs --include="*.ts" --include="*.tsx" --include="*.html" --include="*.md"   # 0
# 2. McKinsey zawsze z rokiem 2012 w tym samym miejscu
grep -rn "McKinsey" site/src site/dist | grep -v "2012"                                # 0
# 3. Panko zawsze z autorem i tytułem przy 88 %
grep -rn "88 %" site/src site/dist | grep -viE "panko"                                 # 0
# 4. liczby z procentem w treści strony vs rejestr dozwolonych
node - <<'JS'
const fs=require("fs"),path=require("path");
const ok=fs.readFileSync(".claude/skills/klarow-guardian/references/allowed-numbers.md","utf8");
const files=[]; (function walk(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);
  e.isDirectory()?walk(p):p.endsWith(".html")&&files.push(p);}})("site/dist");
for(const f of files){const html=fs.readFileSync(f,"utf8").replace(/<script[\s\S]*?<\/script>/g,"");
  for(const m of html.matchAll(/(\d[\d  ]{0,9}(?:,\d+)?)\s?%/g)) if(!ok.includes(m[1].trim()))
    console.log(`${f} - HIGH [legal-sources-for-market-numbers] liczba ${m[0]} spoza references/allowed-numbers.md`);}
JS
# 5. bramka skryptowa (ten sam słownik, id copy-numbers-sourced)
node ".claude/skills/klarow-guardian/scripts/verify-site.mjs" --quiet
```

## Wyjątki

Dane w dashboardach i dokumentach DEMO są jawnie fikcyjne i oznaczone (`demo-labels`) — nie są twierdzeniem o rynku i nie wymagają źródła. Liczby własne Klarow (12 dem, 13 pozycji portfolio, 3 dni, 12 dni) mają dowód w repozytoriach i podlegają `copy-numbers-with-source`, nie tej regule. Liczby prawne (943 470 zł Bisnode, 500 tys. zł Tani Opał, 3 % przychodu albo 1 mln zł) wolno przywoływać wyłącznie w `/rodo` i w dokumentach wewnętrznych — nigdy jako argument sprzedażowy.
