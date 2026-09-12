---
id: secret-no-secrets-in-prompts-or-logs
title: Zero sekretów i danych osób w promptach, wiadomościach między agentami, logach, raportach audytu i artefaktach
impact: BLOCKER
tags: [secrets, prompts, logs, audit, mcp, higgsfield, manus, leads, telegram]
source: manus §5.3 p.4-5 (sekrety i materiały w promptach; replaye sesji) / higgsfield §8 (licencja na trening na inputach) / synthesis §5.4.10 (secret-prompts), §5.5 (raporty audytu w audit/) / post-bot/worker.js:43 (zasada: zero nazw klientów w postach) / peer-legal §1.1
added: 2026-09-12
---

## Zasada

Wartości sekretów, `chat_id`, dane osób z leadów (`leadscout/leads.json`, digesty), dane klientów
i treść korespondencji nie trafiają do: promptów dla modeli (Claude w sesji, MCP: creative engine, Motion+;
Manus), wiadomości `SendMessage` między agentami, wyników subagentów, artefaktów (`Artifact`), raportów
audytu (`audit/*.md`, `audit/*.jsonl`, `failures.log`), wyjścia skryptów strażnika, komunikatów commitów,
wiadomości Telegram generowanych przez boty ani logów Workera (`console.log`). Skrypty maskują dopasowania
(`check-secrets.mjs`: 4 znaki + długość), raporty cytują ścieżkę i numer linii, nie treść. Bot `/post`
nie dostaje nazw klientów ani osób w `<temat>`; Lead-Scout w digestach podaje firmy i sygnały, nie nazwiska
i e-maile imienne. Gdy skrypt musi potwierdzić obecność sekretu, loguje wartość logiczną
(`Boolean(env.TELEGRAM_BOT_TOKEN)`), nigdy wartość.

## Mechanizm awarii (dlaczego)

Prompt to dane wysłane na zewnątrz: do API Anthropic (retencja wg polityki), do Higgsfield (ToU: licencja
na trening na inputach do czasu usunięcia), do Manus (pełne replaye sesji, szeroka licencja, jurysdykcja
Singapur/USA). Artefakty mają URL i mogą zostać udostępnione dalej; raporty audytu w `audit/` są
wersjonowane w repo i czytane przez orkiestratora (a więc trafiają do kolejnych kontekstów modelu).
Logi Cloudflare Workers są widoczne w dashboardzie i mogą być eksportowane; `console.log(update)` zapisze
`chat_id` i treść wiadomości foundera. Dane osób z leadów w narzędziu bez umowy powierzenia to naruszenie
art. 28 RODO, a bez informacji na `/rodo` — art. 14 (precedens Bisnode). Sekret w transkrypcie = ekspozycja
= rotacja (`secret-rotate-on-exposure`), więc jedna nieuważna wklejka kosztuje procedurę u dostawcy.

## Niepoprawnie

```js
// post-bot/worker.js — debug, który zostaje na produkcji
console.log("update:", JSON.stringify(update), "token:", env.TELEGRAM_BOT_TOKEN);
```
```text
# audit/2026-09-12-integration-scanner.md — cytat z pliku sekretów
leadscout/.env:3: TELEGRAM_BOT_TOKEN=123456789:AA…   ← BLOCKER
# prompt do Manus / creative engine
„Oto nasza baza leadów (leads.json) — znajdź osoby decyzyjne: Jan Kowalski, CFO, jan@…"
# SendMessage do subagenta
„Użyj klucza sk-ant-… do testu bota"
```

## Poprawnie

```js
// post-bot/worker.js — diagnostyka bez wartości
console.log("post-bot: token set =", Boolean(env.TELEGRAM_BOT_TOKEN), "chat allowlisted =", Boolean(env.ALLOWED_CHAT_ID));
```
```text
# raport audytu — ścieżka + reguła + maska ze skryptu
leadscout/.env — pominięty (secret-never-read-env); .gitignore OK
site/dist/assets/index-*.js:39 - INFO [integ-registry-required] zarejestrowane jako self-klarow
# prompt do creative engine — tylko brief wizualny (higgsfield.md §7), zero danych firm i osób
"abstract steel surface, palette #A8B4C2 on #121212, no text, no people"
# digest Lead-Scout — firma · sygnał · źródło (bez osób)
„Firma X (produkcja, 80 os.) — ogłoszenie na kontrolera z Excelem, pracuj.pl, 2026-09-10"
```

## Test

```bash
S=".claude/skills/klarow-guardian/scripts/check-secrets.mjs"
# raporty, digesty, dokumentacja: zero wzorców sekretów
node "$S" audit leadscout/digesty docs .claude 2>/dev/null
# logi Workera nie wypisują env ani nagłówków
grep -nE "console\.(log|error|warn)\([^)]*(env\.|headers|update\b)" post-bot/worker.js && echo "HIGH: log z env/nagłówkami" || echo OK
# digesty bez adresów e-mail osób i telefonów
grep -rnE "[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,}" leadscout/digesty 2>/dev/null | grep -vE "kontakt@klarow\.com|biuro@|info@|office@|kontakt@" && echo "sprawdź: adresy imienne w digeście" || echo OK
# komunikaty commitów bez sekretów (ostatnie 50)
git log -n 50 --format=%B | node "$S" /dev/stdin 2>/dev/null || git log -n 50 --format=%B | grep -nE "sk-ant-|ghp_|[0-9]{8,10}:[A-Za-z0-9_-]{35}" && echo "BLOCKER" || echo OK
```

## Wyjątki

Nazwy zmiennych (`TELEGRAM_BOT_TOKEN`) i ścieżki plików wolno cytować wszędzie. Dane fikcyjne dem
i publiczne dane firm (nazwa, branża, www) nie podlegają regule. Wartości logiczne/statystyki
(„token ustawiony: tak", „32 leady") są dozwolone.
