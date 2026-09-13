---
id: motion-motivated
title: Każda animacja ma motywację w jednym zdaniu; brak zdania = brak animacji
impact: MEDIUM
tags: [motion, design, review]
source: taste §7.1 („MOTION MUST BE MOTIVATED") · synthesis §2.4.7 (tabela z motywacją) · motion-design (zasady Disney: staging, appeal) · decyzje Karola 2026-07-22/26 · decyzja Karola 2026-09-13 (kategoria „demonstracja produktu" na warstwie marketingowej)
added: 2026-09-12
---

## Zasada

Każdy ruch na stronie (Motion, CSS transition/keyframes, wideo, crossfade) ma zapisaną motywację w JEDNYM zdaniu, w jednym z dwóch miejsc:

1. tabela „Lista animacji" w `docs/plan/motion-registry.md` (kopia tabeli synthesis §2.4.7: sekcja · element · animacja · API · motywacja), albo
2. komentarz nad elementem w kodzie: `// motion: <motywacja>` (np. `// motion: hierarchia czytania L→R`).

Dozwolone kategorie motywacji (taste §7.1): **hierarchia** (kieruje wzrok), **storytelling** (sekwencja odpowiada narracji, np. kierunek danych w `KsefFlow`), **feedback** (potwierdza akcję: hover, tap, otwarcie), **stan** (pokazuje, że coś się zmieniło: swap zakładki, nowy wynik). Niedozwolone: „wygląda premium", „strona musi się ruszać", „bo mamy Motion".

Piąta kategoria, **wyłącznie na warstwie marketingowej** (decyzja Karola 2026-09-13): **demonstracja
produktu** — „pokazać, co narzędzie robi". Ruch, który buduje wykres, odsłania kroki procesu albo pokazuje
rozsypane dane układające się w wynik, ma motywację funkcjonalną, bo to jedyny sposób, w jaki odwiedzający
widzi produkt w ruchu przed rozmową: dema liczą na żywo dopiero na podstronach, a landing musi pokazać ten
sam mechanizm w jednym spojrzeniu. Warunki wykonania (postęp scrolla, właściwości akcelerowane, gałąź
reduced-motion ze stanem końcowym, zero przechwytywania scrolla) stawia `motion-charts-static` §B
i `motion-no-pinning-no-scroll-hijack` §B. W trybie `tool` ta kategoria NIE obowiązuje: w narzędziu
„pokazać, co robi" znaczy pokazać wynik, a nie drogę do niego.

Rejestr home w v2 (zamknięty; kolejność sekcji po reframe z 2026-09-12 i po decyzjach D35/D37/D38):

| Sekcja | Ruch | Motywacja (kategoria) |
|---|---|---|
| S1 hero | crossfade poster → **nagranie narzędzia** (600 ms), stop na ostatniej klatce | stan: kadr pokazuje, że liczby nie są obrazkiem, tylko wynikiem |
| S2 żywe demo | `ChaosToOrder` (stan ładowania) → `ChartReveal` raz | storytelling + stan: rozsypane dane układają się w wynik, dokładnie to, co firma sprzedaje |
| S3 ściana 13 | `RevealGroup` fadeUp + hover hairline + **klip hover na 4 kaflach pierwszego rzędu** | feedback + stan: odkrycie, że każdy prostokąt jest działającym narzędziem |
| S4 bento | fadeUp, hover tła | hierarchia |
| S5 efekty | hairline `scaleX`, potem pozycje | hierarchia |
| S6 ludzie | portrety fade (bez ruchu twarzy) | hierarchia |
| S7 kalkulator | wiersze ✕/✓ kaskadą, kadr fade | hierarchia |
| S8 kroki | hairline łącznika `scaleX` → kroki | storytelling: linia rysuje kierunek procesu |
| S9 zamknięcie | fadeUp | hierarchia |
| globalne | nav menu mobilne, dialog, `PageFade`, skeleton dashboardu + `.chart-reveal` | feedback / stan |

Wiersz „S5 liczniki" **usunięty**: pasek „W liczbach" nie istnieje (D30), a `Counter` nie ma konsumenta. Nowa animacja = nowy wiersz w rejestrze w tym samym PR.

## Mechanizm awarii (dlaczego)

- Karol dwukrotnie kazał usuwać efekty (karuzela 2026-07-22, deck 2026-07-26): oba były „ładne", żadne nie miało funkcji. Zdanie motywacji przed napisaniem kodu odsiewa je wcześniej i taniej.
- Persona (CFO/właściciel firmy produkcyjnej, „kalkulator, nie wróżka") czyta nadmiar ruchu jako agencję marketingową, nie wykonawcę narzędzi.
- Rejestr pozwala audytorowi mechanicznie porównać: „ruchów w kodzie" vs „wierszy w rejestrze"; różnica = animacja bez decyzji.
- Druga strona tej samej monety (2026-09-13): brak ruchu też jest awarią, gdy sprzedajemy narzędzia, które
  liczą. Karol o gotowej stronie: „za dużo tekstu, bardzo liczyłem na motion grafiki". Zdanie motywacji nie
  służy do wycinania ruchu, tylko do odróżnienia ruchu, który coś pokazuje, od ruchu, który tylko ozdabia.

## Niepoprawnie

```tsx
// „dla ożywienia sekcji"
<m.div animate={{ rotate: [0, 2, -2, 0] }} transition={{ repeat: Infinity, duration: 6 }} className="hero-badge" />
<m.h2 initial={{ opacity: 0, filter: "blur(8px)" }} whileInView={{ opacity: 1, filter: "blur(0)" }} />   // blur bez powodu
```

## Poprawnie

```tsx
// motion: sekwencja węzłów = kierunek danych (KSeF → connector → baza u Ciebie → pulpity); raz, opacity, 3 × 120 ms
<m.g variants={nodeSeq} initial="hidden" whileInView="show" viewport={VIEWPORT_ONCE}>…</m.g>

// motion: feedback „klikalne" (hover obrazu w ramie S3); CSS transform w overflow:hidden
<a className="case-frame" href={`/narzedzia/${tool.slug}`}><img … /></a>
```

## Test

```bash
# liczba elementów z ruchem w kodzie vs liczba wierszy rejestru (różnica → ocena LLM)
grep -rnE '<m\.|whileInView=|animate=\{|@keyframes|<video|transition:' site/src --include=*.tsx --include=*.css | grep -vE 'company-ui\.css|motion/(presets|tokens|provider)' | wc -l
grep -cE '^\|' docs/plan/motion-registry.md
# pętle nieskończone poza skeletonem (oczekiwane: 0)
grep -rnE 'repeat:\s*Infinity|infinite' site/src | grep -vE 'skel|company-ui\.css'
# każdy nowy m.* poza katalogiem motion/ ma komentarz „motion:" w 3 liniach powyżej albo wiersz w rejestrze (ocena LLM w motion-auditor)
```

## Wyjątki

- Elementy kitu z hoverem CSS (`.btn`, `.chip`, `.st`, `.cell`) mają motywację zbiorczą „feedback" i nie wymagają komentarza per element.
