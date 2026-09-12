---
id: motion-motivated
title: Każda animacja ma motywację w jednym zdaniu; brak zdania = brak animacji
impact: MEDIUM
tags: [motion, design, review]
source: taste §7.1 („MOTION MUST BE MOTIVATED") · synthesis §2.4.7 (tabela z motywacją) · motion-design (zasady Disney: staging, appeal) · decyzje Karola 2026-07-22/26
added: 2026-09-12
---

## Zasada

Każdy ruch na stronie (Motion, CSS transition/keyframes, wideo, crossfade) ma zapisaną motywację w JEDNYM zdaniu, w jednym z dwóch miejsc:

1. tabela „Lista animacji" w `docs/plan/motion-registry.md` (kopia tabeli synthesis §2.4.7: sekcja · element · animacja · API · motywacja), albo
2. komentarz nad elementem w kodzie: `// motion: <motywacja>` (np. `// motion: hierarchia czytania L→R`).

Dozwolone kategorie motywacji (taste §7.1): **hierarchia** (kieruje wzrok), **storytelling** (sekwencja odpowiada narracji, np. kierunek danych w `KsefFlow`), **feedback** (potwierdza akcję: hover, tap, otwarcie), **stan** (pokazuje, że coś się zmieniło: swap zakładki, nowy wynik). Niedozwolone: „wygląda premium", „strona musi się ruszać", „bo mamy Motion".

Rejestr home w v2 (zamknięty): S1 crossfade poster→wideo; S2 komórki fadeUp + 3 mini-komponenty fade/sekwencja; S3 ramy fadeUp + hover `scale(1.02)`; S4 fadeUp; S5 liczniki; S6 hairline `scaleX` + kroki; S7 wiersze + still; S8 portrety fade; S9 fadeUp; nav menu mobilne; dialog; `PageFade`; dashboard skeleton + `.chart-reveal`. Nowa animacja = nowy wiersz w rejestrze w tym samym PR.

## Mechanizm awarii (dlaczego)

- Karol dwukrotnie kazał usuwać efekty (karuzela 2026-07-22, deck 2026-07-26): oba były „ładne", żadne nie miało funkcji. Zdanie motywacji przed napisaniem kodu odsiewa je wcześniej i taniej.
- Persona (CFO/właściciel firmy produkcyjnej, „kalkulator, nie wróżka") czyta nadmiar ruchu jako agencję marketingową, nie wykonawcę narzędzi.
- Rejestr pozwala audytorowi mechanicznie porównać: „ruchów w kodzie" vs „wierszy w rejestrze"; różnica = animacja bez decyzji.

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
