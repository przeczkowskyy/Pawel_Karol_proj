---
id: copy-voice-and-tone
title: Głos i ton: oznajmujące zdania, zero pytań retorycznych, zero „łatwo/prosto/szybko" bez liczby, zero AI-tells (summary transitions, spec-sheet voice, cold-open, personifikacja), strona czynna, druga osoba
impact: MEDIUM
tags: [copy, voice, tone, ai-tells, banned-words, writing-guidelines]
source: writing-command.md „Voice & tone", „Banned words", „Concision", „AI-generated tells" / vercel.md §7.2–7.5 / synthesis §2.1 (zdania oznajmujące, zero pytań retorycznych, zero łatwo/prosto/szybko bez liczby), MESSAGING.bannedWords, brand-banned-words / strategy.md B11 (ton founder-led, problem-first)
added: 2026-09-12
---

## Zasada

Copy strony PL i EN (data/*.ts, toolsSeo, FAQ, llms.txt, one-pager):
1. Strona czynna, czas teraźniejszy, druga osoba („dostajesz raport", nie „raport zostanie wygenerowany"); „my" tylko dla działań Klarow („wyceniamy po diagnozie").
2. Zero pytań retorycznych w nagłówkach i leadach („Masz dość Excela?"); pytania tylko w FAQ jako pytania użytkownika.
3. Zakazane słowa bez liczby obok: „łatwo", „prosto", „szybko", „bezproblemowo", „bezszwowo", „intuicyjnie"; filler: „bardzo", „po prostu", „naprawdę", „w dzisiejszym świecie", „kompleksowe rozwiązanie", „transformacja cyfrowa", „podnieś na wyższy poziom", „uwolnij potencjał", „nowej generacji", „game-changer"; EN: „elevate", „seamless", „unleash", „next-gen", „revolutionize", „delve", „tapestry", „in the world of", „easy", „simple", „quick", „very", „just", „really". Lista = `MESSAGING.bannedWords`.
4. Weasel words („znacząco", „wiele firm", „zwykle", „często") zastępujemy liczbą ze źródłem albo usuwamy.
5. AI-tells: brak otwarć-streszczeń („Mając to na uwadze…", „Now that we've…"), brak zdań-datasheet („zapewnia", „umożliwia", „jest konfigurowalny", „provides", „is configurable"), brak cold-open akapitów bez antecedensu, brak personifikacji artefaktów („narzędzie dba o Twoje dane", „token trzyma"), brak stop-start fragmentów, brak szablonowego framingu („Pytanie, które zadaje sobie większość firm…").
6. Zdania ≤ 20 słów (cel), akapit 2–4 zdania; drugie czytanie = przepisać.
7. Ton: founder-led, problem-first, rzeczowy; bez wykrzykników, bez „!" w CTA, bez emoji.

## Mechanizm awarii (dlaczego)

Strona jest budowana z Claude Code, więc AI-tells są domyślnym ryzykiem (vercel.md §7.5: „krytyczne"); em-dash to jeden z nich (`i18n-pl-typography`), a „zapewnia/umożliwia" i pytania retoryczne to kolejne. „Łatwo/prosto/szybko" bez liczby to marketing, który CFO odrzuca; liczba ze źródłem („raport w kilkanaście sekund zamiast ~6 godz.") przechodzi (`copy-numbers-with-source`). Strona bierna („raport zostanie wygenerowany przez narzędzie") ukrywa, kto co robi, a przekaz marki mówi „rozmawiasz z osobą, która narzędzie zbudowała". Personifikacja („narzędzie pilnuje") kłóci się z determinizmem („kalkulator, nie wróżka").

## Niepoprawnie

```ts
pl: "Masz dość ręcznego sklejania arkuszy? Nasze kompleksowe rozwiązanie zapewnia bezproblemową automatyzację i umożliwia szybkie raportowanie. W dzisiejszym świecie dane to podstawa!"
en: "Now that we've seen the problem, our seamless, next-gen platform delves into your data and elevates reporting."
```

## Poprawnie

```ts
pl: "Wklejasz tabelę z Excela. Dostajesz 3 KPI, wykres i tabelę z komentarzami w kilkanaście sekund. Te same dane dają ten sam wynik."
en: "Paste the table from Excel. You get 3 KPIs, a chart and a commented table in seconds. Same data, same result."
```

## Test

```bash
# słowa zakazane PL/EN z MESSAGING.bannedWords + filler + weasel (skrypt czyta listę z messaging.ts)
# DOCELOWO (skrypt planowany, jeszcze nie istnieje — dziś: NIE SPRAWDZANO): node .claude/skills/klarow-guardian/scripts/check-copy.mjs --banned-words
# pytania retoryczne w nagłówkach/leadach: „?" w h1/h2/lead poza FAQ
grep -rnE "(h1|h2|lead|title)[^:]*: \{ pl: \"[^\"]*\?\"" site/src/data/home.ts site/src/data/oferta.ts site/src/data/messaging.ts 2>/dev/null   # 0
# spec-sheet voice PL/EN
grep -rnwiE "zapewnia|umożliwia|pozwala na|provides|enables|allows|is configurable" site/src/data/*.ts   # przegląd; cel 0 w home.ts/messaging.ts
grep -rnE "[!]\"" site/src/data/home.ts site/src/data/messaging.ts site/src/data/oferta.ts 2>/dev/null   # 0
# ocena LLM (copy-auditor): AI-tells, strona bierna („przez"), cold-open; wynik PLAUSIBLE → decyzja człowieka
```

Severity: MEDIUM (raport); słowa z `bannedWords` w hero/meta = HIGH.

## Wyjątki

FAQ: pytania są pytaniami użytkownika (dozwolone). Tryb `tool`: etykiety UI („Załaduj przykład") są trybem rozkazującym (poprawnie). Cytaty klientów (gdy powstaną) w oryginale.
