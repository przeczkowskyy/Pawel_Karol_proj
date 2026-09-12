---
id: copy-minimal-text
title: Minimum tekstu: hero lead ≤ 20 słów, nagłówek sekcji ≤ 6 słów, sekcja = 1 zdanie + dowód, karta = ikona + 2–6 słów + 1 linia
impact: HIGH
tags: [copy, density, hero, sections, cards, minimal]
source: dyrektywa Karola 2026-07-27 („mniej tekstu, więcej ikon") + commit 848cd93 / strategy.md §8 (blok = nagłówek ≤ 6 słów + 1 linia + ikony), T6 / synthesis §2.3 (limity: nagłówek ≤ 6 słów i ≤ 2 linie, lead ≤ 20 słów, karta ≤ 12 słów w linii), design-hero-discipline / taste §4.7
added: 2026-09-12
---

## Zasada

Limity dla trybu `marketing` (home, hub, `/oferta`, `/faq`-nagłówki, otoczka podstron):
- Hero: dokładnie 4 elementy tekstowe: H1 (≤ 2 linie na 1024 px, `max-width: 24ch`), lead ≤ 20 słów, 1 CTA primary, 1 CTA ghost. Zero chipów, telefonu, trust-stripu, wersji, eyebrow w hero.
- Nagłówek sekcji (H2) ≤ 6 słów i ≤ 2 linie; lead sekcji ≤ 20 słów (1 zdanie); po nim DOWÓD (żywy mini-komponent, zrzut, liczba ze źródłem, diagram), nie drugi akapit.
- Karta/kafel: ikona lucide + nazwa 2–6 słów + 1 linia ≤ 12 słów. Hook narzędzia (`HOOKS`) 2–6 słów; tagline zostaje na podstronie.
- Eyebrow count na home = 0; sekcje home = 9 (S1–S9), nie więcej.
- Podstrony narzędzi i `/oferta` mogą mieć pełne zdania, ale treść drugorzędna jest wizualnie podrzędna (akordeon w DOM, sekcja „Jak to liczymy" pod demem), nie nad zgięciem.
- Shell prerendera nie może zawierać zdań, których nie ma w UI (T6: shell i UI twierdzą to samo).

## Mechanizm awarii (dlaczego)

Karol dwukrotnie ciął prozę (reframe 2026-07-27, commit 848cd93 „Mniej tekstu, więcej pokazywania"); długi lead z proof (`proof.md`: hero 8+ elementów) został odrzucony przez sędziego marki. CFO na telefonie z LinkedIn ma 10 sekund (`strategy.md` §3.2): nagłówek > 6 słów nie mieści się w 2 liniach na 390 px, lead > 20 słów spycha CTA pod zgięcie. Sekcja z dwoma akapitami zamiast dowodu to „opowiadanie zamiast pokazywania" (plan §1.5: „pokazujemy na demo, nie opowiadamy"). Karty z 3 liniami tekstu wyrównują się do najdłuższej i rozbijają siatkę gapless.

## Niepoprawnie

```ts
hero: { h1: "Automatyzacja, upraszczanie i porządek w danych dla firm 20–250 osób, które wyrosły na Excelu", lead: "Budujemy narzędzia dokładnie pod Twój proces: raporty, importy z ERP, integracje z KSeF, obieg dokumentów i panele dla zarządu, wdrażamy je w dni, a dane zostają u Ciebie na Twoim serwerze, bez chmury i bez abonamentu." }   // 40 słów
card: { title: "Raporty, kontroling i analizy dla zarządu", line: "Raport zarządczy, marża projektu, bramka tygodnia, prognoza cashflow i porównanie planu z wykonaniem w jednym miejscu." }   // 19 słów
```

## Poprawnie

```ts
hero: { h1: MESSAGING.oneLiner, lead: MESSAGING.subtext /* 17 słów */, primary: MESSAGING.cta.primary, secondary: MESSAGING.cta.secondary },
section: { h2: { pl: "Co osiągniesz" }, lead: { pl: "Nie sprzedajemy godzin ani systemu. Sprzedajemy efekt, który widać w kalendarzu i w liczbach." } /* 13 słów */ },
card: { icon: "BarChart3", title: { pl: "Raporty i kontroling" }, line: { pl: "Raport zarządczy, marża projektu, bramka tygodnia." } },
```

## Test

```bash
# liczniki słów z data/home.ts, oferta.ts, tools.ts (HOOKS): H1 ≤ 14 słów, lead ≤ 20, H2 ≤ 6, card.title ≤ 6, card.line ≤ 12, hook ≤ 6
# DOCELOWO (skrypt planowany, jeszcze nie istnieje — dziś: NIE SPRAWDZANO): node .claude/skills/klarow-guardian/scripts/check-copy.mjs --length-limits
# hero: 4 elementy tekstowe w dist/index.html (skrypt liczy h1, p, a w .hero)
# DOCELOWO (skrypt planowany, jeszcze nie istnieje — dziś: NIE SPRAWDZANO): node .claude/skills/klarow-guardian/scripts/check-design.mjs --hero-elements
# eyebrow count na home = 0
grep -c "class=\"[^\"]*eyebrow" site/dist/index.html                       # 0
```

Severity: HIGH (hero, H2, lead); karty MEDIUM w raporcie.

## Wyjątki

Tryb `tool` (dashboardy, opisy „Jak to liczymy", `/rodo`, FAQ-odpowiedzi 2–4 zdania): limity nie obowiązują, ale akapit ≤ 4 zdania (writing „Structure").
