---
id: brand-no-ai-word-in-sales
title: Zero słowa „AI" i nazw dostawców modeli w komunikacji sprzedażowej
impact: BLOCKER
tags: [brand, copy, ai, sales, icp]
source: peer-legal.md §1.3 (zasady marki) / strategy.md B11 / plan-strategiczny §2.2 (persona boi się chmury i halucynacji) / synthesis §1.6 (odrzucone „Claude Code" w copy) / decyzja D-04
added: 2026-09-12
---

## Zasada

W powierzchniach sprzedażowych **nie występuje** słowo „AI", „sztuczna inteligencja",
„artificial intelligence", „LLM", „GPT", „model językowy" ani nazwa dostawcy (Anthropic, Claude,
Claude Code, OpenAI, ChatGPT, Gemini, Copilot). Powierzchnie sprzedażowe: H1 i lead, karty i hooki
narzędzi, CTA, `/oferta`, pasek liczb, sekcja „Co osiągniesz", meta / JSON-LD / `llms.txt`,
PDF one-pager, szablony outboundu (`leadscout/playbook-outbound.md`), posty bota `/post`,
nagłówki LinkedIn. AI nigdy nie jest obietnicą ani elementem liczenia i nie pojawia się nawet
w zaprzeczeniu: zdanie o determinizmie mówi, CO liczy, a nie czego nie ma. Kanoniczne brzmienie
`MESSAGING.determinism` (jedno źródło, `src/data/messaging.ts`):

> **„Twoje liczby liczy zwykły, deterministyczny kod. Te same dane dają ten sam wynik."**
> EN: „Your numbers are computed by plain, deterministic code. Same data, same result."

To zdanie obowiązuje wszędzie, gdzie dziś pada wyróżnik „kalkulator, nie wróżka": sekcja S7,
stopka panelu dema (`demo-labels`), `llms.txt`, PDF, outbound. Wcześniejszy wariant
„AI pomaga nam budować narzędzie, nigdy nie liczy Twoich liczb" jest WYCOFANY (łamał tę regułę).
Bullet „opcjonalny asystent AI" w opisie KSeF (`tools.ts`) do usunięcia (D-04).

## Mechanizm awarii (dlaczego)

Persona (CFO / kontroler firmy produkcyjnej) boi się dwóch rzeczy: danych w chmurze i liczb
z halucynacji. Słowo „AI" uruchamia obie obawy naraz i kasuje różnicę wobec konkurenta
grającego AI-hype. Nazwa dostawcy w copy sugeruje, że dane klienta trafiają do tego dostawcy,
co przeczy „zero chmury dostawcy". Outbound po PKE musi być spójny ze stroną: jeśli mail nie mówi
o AI, strona też nie może.

## Niepoprawnie

```ts
// tools.ts (KSeF)
bullets: { pl: ["…", "Opcjonalny asystent AI podsumowuje faktury"] }
// messaging.ts — wycofane brzmienie: „AI" w copy sprzedażowym, choćby w zaprzeczeniu
determinism: { pl: "Te same dane dają ten sam wynik. AI pomaga nam budować narzędzie, nigdy nie liczy Twoich liczb." }
// founders.ts
{ pl: "Budujemy z Claude Code, ale liczy zwykły kod." }
```

## Poprawnie

```ts
// messaging.ts — jedno źródło zdania o determinizmie
determinism: {
  pl: "Twoje liczby liczy zwykły, deterministyczny kod. Te same dane dają ten sam wynik.",
  en: "Your numbers are computed by plain, deterministic code. Same data, same result.",
}
founders: { pl: "Rozmawiasz z osobą, która narzędzie zbudowała. Kod, dokumentacja i runbook zostają u Ciebie." }
```

## Test

```bash
# powierzchnie sprzedażowe: 0 trafień (jedyny wyjątek: odpowiedź FAQ „Czy AI liczy moje dane?", patrz Wyjątki)
grep -n "determinism" site/src/data/messaging.ts | grep -iw "AI"     # 0: zdanie o determinizmie bez słowa „AI"
grep -rniwE "AI|A\.I\.|sztuczn(a|ej|ą) inteligencj[a-z]*|artificial intelligence|LLM|GPT|model(u|e|em)? językow[a-z]*|Claude( Code)?|Anthropic|OpenAI|ChatGPT|Gemini|Copilot" site/src/data site/src/App.tsx site/src/pages site/src/components site/src/prerender leadscout/playbook-outbound.md
grep -rniwE "AI|sztuczn(a|ej) inteligencj[a-z]*" site/dist/llms.txt site/dist/index.html site/dist/oferta.html
```

Prompt bota (`post-bot/worker.js`) i szablony LinkedIn: przegląd ręczny przy każdej zmianie
`messaging.ts` (reguła synchronizacji jednego zdania).

## Wyjątki

1. **Jedyny wyjątek w copy sprzedażowym: jedna odpowiedź w `faq.ts`** na pytanie zadane wprost
   przez klienta, pytanie „Czy AI liczy moje dane?", i tylko po to, żeby ZAPRZECZYĆ:
   „Nie. Twoje liczby liczy zwykły, deterministyczny kod: te same dane dają ten sam wynik,
   a ścieżkę wyliczenia widzisz w narzędziu. Żaden model językowy nie dostaje Twoich danych."
   Słowo „AI" wolno powtórzyć wyłącznie w treści pytania; odpowiedź nie tłumaczy, do czego
   zespół używa AI (to nie jest argument sprzedażowy). Ani `MESSAGING.determinism`, ani żadna
   inna odpowiedź FAQ, ani para ✕/✓ w S7 nie używają tego słowa.
2. Strona `/rodo` może wymieniać dostawców, jeśli faktycznie przetwarzają dane (dziś: nie).
3. Dokumenty wewnętrzne (`CLAUDE.md`, `docs/`, `.claude/`) bez ograniczeń.
