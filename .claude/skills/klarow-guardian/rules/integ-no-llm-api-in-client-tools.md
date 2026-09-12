---
id: integ-no-llm-api-in-client-tools
title: Zero chmury dostawcy — narzędzia dla klientów i dema nie wołają API modeli językowych ani serwerów Klarow
impact: BLOCKER
tags: [integrations, llm, determinism, on-premise, brand-promise, demo]
source: decyzja founderów 2026-07-22 (drugi wyróżnik) / strategy §2.5 T4 + §6 D4 („zero chmury dostawcy") / CLAUDE.md #6 (determinizm demo) / synthesis §5.4.9 (integ-no-llm-runtime) / post-bot/worker.js:27 (obietnica w głosie marki)
added: 2026-09-12
---

## Zasada

Narzędzie dostarczane klientowi (aplikacja on-premise, skrypt, dashboard) oraz każde demo na `klarow.com`
liczy wyłącznie lokalnie i deterministycznie: nie wywołuje `api.anthropic.com`, `api.openai.com`,
`generativelanguage.googleapis.com`, `openrouter.ai`, `api.mistral.ai` ani żadnego serwera Klarow.
Dane klienta trafiają tylko do systemów, które klient sam wskaże (KSeF, jego ERP, jego dysk).
W `site/src/lib/**`, `site/src/components/dashboards/**`, `site/src/components/DemoReport.tsx` i `demo/**`
nie ma `fetch`, `XMLHttpRequest`, `WebSocket`, `EventSource`, `sendBeacon` ani importów pakietów sieciowych.
Anthropic API wolno używać tylko w narzędziach wewnętrznych Klarow (`post-bot/`), gdzie nie ma danych klientów.
Jeśli produkt ma opcjonalnego asystenta AI (Kokpit KSeF), jest to osobny moduł: domyślnie wyłączony,
opt-in klienta, tylko agregaty bez NIP i kwot faktur, z fallbackiem bez AI; na stronie nie opisujemy go
jako części narzędzia (strategy D4).

## Mechanizm awarii (dlaczego)

To drugi wyróżnik marki obok on-premise: „kalkulator, nie wróżka". Jeden `fetch` do modelu językowego
w silniku obala trzy obietnice naraz: (1) dane wychodzą do chmury dostawcy, którego klient nie wybrał
(art. 28 RODO: nowy procesor bez umowy), (2) wynik przestaje być deterministyczny (dwa przebiegi na tych
samych danych dają różny JSON, więc testy golden z CLAUDE.md #6 padają), (3) narzędzie przestaje działać
offline i po wygaśnięciu klucza. Dla ICP (CFO firmy produkcyjnej, „boi się chmury i halucynacji") to sygnał
dyskwalifikujący, a strategy T4 pokazała, że już opis KSeF z „asystentem AI" kłócił się z hasłem „zero API
do LLM" na tej samej stronie; sprzeczność wychwytywalna w 30 sekund. Dodatkowo klucz API w narzędziu
u klienta to klucz Klarow rozliczany za cudze użycie albo klucz klienta, którym Klarow administruje;
obie opcje są nie do obrony.

## Niepoprawnie

```ts
// site/src/components/dashboards/CostControl.tsx — „wyjaśnij odchylenie" przez model językowy
async function explainVariance(rows: Row[]) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": import.meta.env.VITE_ANTHROPIC_KEY, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model: "claude-sonnet-5", messages: [{ role: "user", content: JSON.stringify(rows) }] }),
  });
  return (await res.json()).content[0].text; // niedeterministyczne, dane klienta w chmurze, klucz w bundlu
}
```

## Poprawnie

```ts
// site/src/lib/costControl.ts — reguła jawna, wynik odtwarzalny, zero sieci
export function explainVariance(row: Row): string {
  const delta = row.eac - row.budget;
  if (delta > 0 && row.etc > row.budget * 0.5) return "EAC powyżej budżetu: ETC przekracza połowę budżetu etapu";
  if (delta > 0) return "EAC powyżej budżetu: koszty poniesione wyższe niż plan";
  return "W budżecie";
}
```

```python
# produkt on-premise: asystent AI jako moduł opt-in, agregaty bez identyfikatorów, fallback bez AI
if settings.AI_ASSISTANT_ENABLED and settings.ANTHROPIC_API_KEY:
    summary = ai_summarize(aggregates_without_nip)   # nigdy wiersze faktur
else:
    summary = rule_based_summary(aggregates)         # zawsze dostępne
```

## Test

```bash
# strona i dema: zero hostów LLM i zero sieci w silnikach
grep -rnE "api\.anthropic\.com|api\.openai\.com|generativelanguage\.googleapis\.com|openrouter\.ai|api\.mistral\.ai|api\.cohere" site/src demo ui-kit
grep -rnE "\b(fetch|XMLHttpRequest|WebSocket|EventSource|sendBeacon)\s*\(" site/src/lib site/src/components/dashboards site/src/components/DemoReport.tsx
grep -rnE "from [\"'](@anthropic-ai/sdk|openai|axios|node-fetch)[\"']" site/src
# skaner: net-call w lib/dashboards = HIGH [integ-no-llm-api-in-client-tools]; host LLM w site/ = poza zakresem (post-bot) = HIGH
node ".claude/skills/klarow-guardian/scripts/find-integrations.mjs" --strict --quiet
# determinizm: dwa przebiegi silnika = identyczny JSON (golden test)
node -e "import('./site/src/lib/report.ts')" 2>/dev/null || echo "użyj check-determinism.mjs / node --test po włączeniu testów"
```

W repozytoriach produktów dla klientów (poza tym repo): `grep -rn "anthropic\|openai" backend/` musi trafiać
wyłącznie w moduł asystenta oznaczony jako opt-in, a `requirements.txt` bez `anthropic` w wariancie bez asystenta.

## Wyjątki

`post-bot/worker.js` (bot LinkedIn dla founderów): wolno, bo nie przetwarza danych klientów ani leadów
(zasada w prompcie: zero nazw klientów) i działa poza `site/`. Agent Lead-Scout używa modelu w Claude Code
do researchu na danych publicznych, nie w narzędziu klienta. Oba wpisy mają w rejestrze zakres ograniczony
do `post-bot`/`leadscout` (`integ-telegram-anthropic-only-in-bots`).
