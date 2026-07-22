# Specyfikacja DEMO M2 — „Raport zarządczy" (żywe demo na landingu)

> **Status: WDROŻONE 2026-07-22** (sekcja `#demo` na klarow.com). Jedna strona — zgodnie
> z planem działania Karola. Narzędzie **odtworzone od zera na wzór** wzorca B10+B2
> (bez kopiowania kodu); 100% client-side, dane fikcyjne.

## Cel

Główny dowód „zobacz, jak to działa" na landingu: odwiedzający w jedno kliknięcie widzi,
jak z surowej tabeli (CSV/Excel) powstaje raport zarządczy — deterministycznie, w jego
przeglądarce, bez wysyłania czegokolwiek do sieci. Demo sprzedaje jednocześnie moduł M2
i oba wyróżniki (prawdziwie zero chmury + kalkulator, nie wróżka).

## Wejście (3 drogi)

| Droga | Zachowanie |
|---|---|
| **Załaduj przykład** | 1 klik → wbudowany fikcyjny zestaw (PL/EN, identyczne liczby) |
| **Wklej dane** | textarea; działa wklejka prosto z Excela (separator tab), także `;` i `,` |
| **Wgraj plik CSV** | `FileReader` lokalnie; plik nigdzie nie jest wysyłany |

**Format:** `Projekt; Etap; Budżet; Koszt; Zaawansowanie %; Komentarz` — nagłówki tolerancyjne
(PL/EN, diakrytyki i `[jednostki]` ignorowane), separator wykrywany automatycznie (`;` / tab / `,`).
Błędne wiersze są pomijane i raportowane z numerem linii (panel `.err`) — to celowo mini-pokaz
walidacji z modułu M1.

## Wyjście

1. **3 KPI** (`.card stat`): Budżet portfela · Koszt dotychczas (% budżetu + zaawansowanie) ·
   Projekty w ryzyku (n / wszystkich, z najgorszym projektem w stopce).
2. **Wykres per-etap** (statyczny SVG w gramatyce kitu, tokeny `var(--…)`): dwa słupki na etap —
   zaawansowanie prac (stal) vs wykorzystanie budżetu (zieleń w normie / cegła gdy koszt
   wyprzedza postęp o > 3 p.p.). Jedyny ruch: fade `.chart-reveal`.
3. **Tabela projektów** (`.data-table`): budżet, koszt, zaawansowanie, odchylenie (kolor wg progu),
   status chip (OK / Obserwuj / Ryzyko), komentarz PM z etapu o największym odchyleniu; stopka RAZEM.
4. **Ścieżka wyliczenia** (przełączany panel): wzory z podstawionymi liczbami + progi statusów —
   materializacja hasła „kalkulator, nie wróżka".
5. **Pobierz wynik (CSV)** — plik generowany w przeglądarce (Blob + BOM dla Excela PL).
6. Stopka: dane fikcyjne · zero sieci (odsyłamy do DevTools → Sieć) · czas przeliczenia w ms.

## Logika (deterministyczna — `site/src/lib/report.ts`, czyste funkcje)

- Zaawansowanie projektu/etapu/portfela = średnia **ważona budżetem** pozycji.
- Wykorzystanie budżetu = Σ koszt / Σ budżet.
- **Odchylenie [p.p.] = wykorzystanie% − zaawansowanie%** (dodatnie = koszt wyprzedza postęp).
- Progi (jawne stałe): OK ≤ **2 p.p.** · Obserwuj 2–**8 p.p.** · Ryzyko > 8 p.p.;
  wykres: przekroczenie etapu przy > **3 p.p.**
- Zakazy: żadnych `Date.now`/losowości/sieci — te same dane zawsze dają ten sam wynik.

## Dane fikcyjne (`site/src/data/demo-sample.ts`)

7 projektów × 5 etapów fikcyjnej firmy produkcyjno-budowlanej (35 pozycji; PL i EN mają
identyczne liczby). Ułożone tak, by raport miał fabułę: budżet 38,1 mln zł, koszt 57,6%
vs zaawansowanie 54,3% (+3,3 p.p.), **2/7 projektów w ryzyku** (Biurowiec Łódź +9,1 p.p.,
Hala produkcyjna Katowice +9,3 p.p.), przeciek kosztów na etapie **Montaż** (54% vs 49%),
komentarze PM na etapach krytycznych (stal +12%, poprawki spawów, opóźnienia dostaw).

## Pliki

`site/src/lib/report.ts` (silnik) · `site/src/data/demo-sample.ts` (dane) ·
`site/src/components/DemoReport.tsx` (UI) · sekcja `#demo` w `site/src/App.tsx`.
Test silnika: determinizm, separator tab, walidacja błędnych wierszy — przechodzi node'em
(bez frameworka testowego; skrypt jednorazowy, nie w repo).
