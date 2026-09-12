---
id: demo-determinism
title: Silniki i dashboardy dem są deterministyczne: zero Date.now/new Date()/Math.random/performance.now/fetch/localStorage w lib/* i dashboards/*; „Dziś" = stała TODAY
impact: BLOCKER
tags: [demo, determinism, engines, dashboards, privacy]
source: CLAUDE.md #6 („DEMO i silniki liczące: zero Date.now/Math.random/sieci w logice") · ui-kit-habits I1/Z1 · synthesis §5.4.11 determ-no-random · bklit-ui §4.7/§10.4 (hashFract) · TaskTimeline.tsx:10-12 · lib/report.ts:3-8
added: 2026-09-12
---

## Zasada

W plikach `site/src/lib/**` (silniki: `report.ts`, `qualityGate.ts`, `tranches.ts`, `g703.ts`, `pdf.ts`), `site/src/components/dashboards/**`, `site/src/components/DemoReport.tsx`, `site/src/components/Mini*.tsx` i `site/src/data/demo-sample.ts`:

1. **Zero źródeł niedeterminizmu**: `Date.now()`, `new Date()` BEZ argumentów, `performance.now()`, `Math.random()`, `crypto.randomUUID()`/`crypto.getRandomValues()`, `Intl.DateTimeFormat().resolvedOptions().timeZone`, `navigator.language` w logice (język przychodzi z `useLang()` jako prop).
   Dozwolone: `new Date(Date.UTC(y, m, d))` i `new Date(iso)` na JAWNYM wejściu (parsowanie dat z danych, jak `qualityGate.ts:104-116`), bo wynik zależy tylko od argumentu.
2. **„Dziś" to stała**: `TODAY = "2026-07-22"` (`TaskTimeline.tsx:12`), `YEAR = 2026`/`WEEK = 30` (`QualityGate.tsx:20-21`), `WEEK_START = 27` (`ProductionDashboard.tsx:11`); nowe dashboardy definiują własną stałą z komentarzem `// determinizm: stała referencyjna, nie Date.now()`.
3. **Zero sieci i zero storage**: `fetch`, `XMLHttpRequest`, `WebSocket`, `EventSource`, `navigator.sendBeacon`, `import()` z URL, `localStorage`/`sessionStorage`/`IndexedDB`/`document.cookie` w tych katalogach = 0. Dane wyłącznie z `src/data/*.ts` i z wejścia użytkownika (wklejony CSV, plik lokalny przez `FileReader`).
4. **ID seedowane**: identyfikatory wierszy/transz z licznika (`nextId = max + 1`) albo z hasza treści; nigdy `Math.random().toString(36)`, nigdy `Date.now()` jako id.
5. **Losowość prezentacyjna** (skeleton, „szum"): `hashFract(n) = frac(sin(n) * 43758.5453)` z jawnym seedem (bklit `loading-sweep.tsx`), nigdy `Math.random`.
6. **Kursy walut, stawki, progi** (`FX` w `PaymentCalculator.tsx`, `VAT`, `DEPOSIT_PCT`) to stałe fikcyjne z komentarzem „fikcyjne, deterministyczne"; nigdy z API.
7. Zdarzenia analityczne (`cta_*`, `demo_load_example`, `pdf_download`) emitowane w komponentach stron/przycisków, NIGDY wewnątrz silników ani w `useMemo` liczącym wynik (`demo-events-outside-engines`).

Jedyny dopuszczalny wyjątek: pomiar czasu wyświetlany w UI (`DemoReport.tsx`: `performance.now()` do napisu „policzone w X ms"). MUSI spełniać oba warunki:

- jest oznaczony komentarzem `// demo-determinism: wyjątek (pomiar czasu do wyświetlenia, poza wynikiem)` w linii pomiaru,
- jest liczony POZA obiektem wyniku: `return { parsed, agg }`, a milisekundy trafiają do refa/stanu prezentacyjnego, nigdy do wartości, którą serializujemy (`JSON.stringify(result)`), do PDF ani do golden-testu.

**Stan repo 2026-09-12 (dług F0, nie regresja):** `site/src/components/DemoReport.tsx:257-264` NIE MA komentarza i zwraca `{ parsed, agg, ms }` — `ms` siedzi w obiekcie wyniku, więc `JSON.stringify(result)` nie jest dziś deterministyczny. Do końca fazy 0 to pozycja długu (ticket F0 „wyciągnąć `ms` z wyniku"), potem BLOCKER.

## Mechanizm awarii (dlaczego)

- Determinizm jest obietnicą produktową: „te same dane dają ten sam wynik; kalkulator, nie wróżka" (`MESSAGING.determinism`). Dashboard, który przy odświeżeniu pokazuje inny wynik (bo „dziś" się przesunęło, bo losowy id zmienił kolejność), zaprzecza jedynemu wyróżnikowi obok on-prem. CLAUDE.md #6 = twarda reguła → BLOCKER.
- Golden-testy (`demo-golden-tests`) i deterministyczne zrzuty (`shoot-tools.mjs`, cache immutable) działają tylko, gdy silnik jest czystą funkcją wejścia.
- `new Date()` bez argumentu w Gantcie przesuwa „Dziś" każdego dnia: dryf +Nd/−Nd zmienia się bez zmiany danych, a zrzut w ramie S3 przestaje pasować do dema.
- Sieć/storage w demie = dane użytkownika (wklejony CSV z realnymi kosztami) mogłyby wyjść poza przeglądarkę; „zero chmury dostawcy" (`MESSAGING.zeroVendorCloud`) musi być prawdą także w demie.
- bklit-ui (uznana biblioteka) ma `Date.now()` jako domyślny koniec domeny czasowej (`bar-chart.tsx:359`) i `Math.random()` w shimmerze: nie kopiować takich wzorców ani przykładów z docs (`new Date(Date.now() - 29*24*60*60*1000)`).

## Niepoprawnie

```ts
const today = new Date();                                   // dryf „dziś"
const id = Math.random().toString(36).slice(2);             // niedeterministyczne id
const rate = await fetch("https://api.nbp.pl/api/exchangerates/rates/a/eur/").then((r) => r.json());   // sieć w demie
localStorage.setItem("klarow:demo:rows", JSON.stringify(rows));   // storage w demie
const seed = Date.now() % 1000;                             // seed z zegara
```

## Poprawnie

```ts
// components/dashboards/TaskTimeline.tsx:12
const TODAY = "2026-07-22"; // stała referencyjna (determinizm)

// lib/qualityGate.ts:104 (parsowanie na jawnym wejściu: OK)
if (m) return new Date(Date.UTC(+m[3], +m[2] - 1, +m[1]));

// id z licznika
const nextId = (items: { id: number }[]) => items.reduce((mx, it) => Math.max(mx, it.id), 0) + 1;

// losowość prezentacyjna z seedem
const hashFract = (n: number) => { const x = Math.sin(n) * 43758.5453; return x - Math.floor(x); };
const skeletonHeights = Array.from({ length: 12 }, (_, i) => 20 + 60 * hashFract(i + 7));

// kursy fikcyjne (PaymentCalculator.tsx)
const FX: Record<string, number> = { PLN: 1, EUR: 4.31, USD: 3.97 }; // fikcyjne, deterministyczne (zamiast EBC)

// DemoReport.tsx — pomiar czasu POZA obiektem wyniku (docelowy kształt wyjątku)
const msRef = useRef<number | null>(null);
const result = useMemo(() => {
  if (csvText === null) return null;
  const t0 = performance.now();                 // demo-determinism: wyjątek (pomiar czasu do wyświetlenia, poza wynikiem)
  const parsed = parseCsv(csvText);
  const agg = aggregate(parsed.rows);
  msRef.current = Math.round(performance.now() - t0);   // zapis idempotentny; NIE wchodzi do zwracanego obiektu
  return { parsed, agg };                                // JSON.stringify(result) deterministyczne
}, [csvText]);
```

## Test

```bash
# zakres: silniki + dashboardy + DemoReport + mini-komponenty + dane dem
D="site/src/lib site/src/components/dashboards site/src/components/DemoReport.tsx site/src/data/demo-sample.ts"
[ -f site/src/components/MiniReport.tsx ] && D="$D site/src/components/MiniReport.tsx site/src/components/MiniAudit.tsx"
# 1) zegar/losowość (oczekiwane: tylko udokumentowany wyjątek DemoReport performance.now z komentarzem)
grep -rnE 'Date\.now\(|new Date\(\)|Math\.random\(|crypto\.(randomUUID|getRandomValues)|resolvedOptions\(\)\.timeZone|navigator\.language' $D
grep -rnE 'performance\.now\(' $D | grep -v 'DemoReport.tsx'    # = 0
grep -B2 -nE 'performance\.now\(' site/src/components/DemoReport.tsx | grep -q 'demo-determinism: wyjątek' || echo "wyjątek bez komentarza"
# 2) sieć i storage (oczekiwane: 0)
grep -rnE '\bfetch\(|XMLHttpRequest|WebSocket|EventSource|sendBeacon|localStorage|sessionStorage|indexedDB|document\.cookie|import\("http' $D
# 3) stałe „dziś" w każdym dashboardzie z osią czasu
grep -nE 'const (TODAY|YEAR|WEEK|WEEK_START)\b' site/src/components/dashboards/TaskTimeline.tsx site/src/components/dashboards/QualityGate.tsx site/src/components/dashboards/ProductionDashboard.tsx | wc -l   # ≥ 4
# 4) golden: dwa przebiegi = identyczny JSON (patrz demo-golden-tests)
cd site && npm run test   # exit 0 (= node --experimental-strip-types --test tests/)
# 4b) ms poza obiektem wyniku (oczekiwane: 0)
grep -nE 'return \{[^}]*\bms\b' site/src/components/DemoReport.tsx
# 5) zrzuty: dwa przebiegi shoot-tools.mjs → identyczne sha256 (perf-images-policy)
```

Docelowo `node scripts/check-determinism.mjs` (kroki 1–3) w `npm run check`.

## Wyjątki

- `DemoReport.tsx` (`performance.now()` do napisu „ms"), z komentarzem i poza obiektem wyniku.
- **Dług fazy 0 (F0), nie regresja**: dopóki F0 nie zamknięte, brak komentarza `// demo-determinism: wyjątek …` w `DemoReport.tsx` i `ms` w zwracanym obiekcie są pozycją długu (ticket F0), a nie naruszeniem bieżącej zmiany; audyt bazowy ma je raportować jako dług. Po F0 = BLOCKER.
- `BookingModal`/`BookingDialog` (`new Date()` do kalendarza rezerwacji) leży poza zakresem: to formularz kontaktu, nie demo; nadal bez `Math.random` i z zakresem dat liczonym od dzisiejszej daty użytkownika (to jest poprawne zachowanie kalendarza).
- Zdarzenia analityczne i `localStorage` dla `lang` (`i18n.tsx`) są poza katalogami objętymi regułą.
