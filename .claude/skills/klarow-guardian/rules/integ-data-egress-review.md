---
id: integ-data-egress-review
title: Przegląd wyjścia danych: co wychodzi, dokąd, na jakiej podstawie — dane klientów nigdy do Higgsfield, Manus, LLM ani MCP
impact: HIGH
tags: [integrations, data-egress, privacy, higgsfield, manus, llm, mcp, leads, ip]
source: higgsfield §0 p.8, §8 (ToU 2026-07-26: licencja na trening, brak gwarancji IP) / manus §5.3 (jurysdykcja, licencja, replaye sesji) / strategy §2.5 („zero chmury dostawcy") / peer-legal §1.1, §1.4 (RODO art. 14, PKE) / CLAUDE.md #3 (umowa IP) / portfolio §6.2-6.3
added: 2026-09-12
---

## Zasada

Dla każdego połączenia z rejestru kolumna „dane, które wychodzą" jest wypełniona konkretnie (co, dokąd,
jurysdykcja, podstawa) i aktualna. Niezależnie od narzędzia obowiązuje lista „nigdy na zewnątrz":
dane klientów (pliki, zrzuty dashboardów, liczby, nazwy), dane osób z `leadscout/leads.json` i digestów,
materiały i liczby poprzedniej firmy (do umowy IP), sekrety, twarze i wizerunki, treść korespondencji.
Do narzędzi generatywnych (Higgsfield przez MCP, Manus, dowolny model przez API/MCP) wysyłamy wyłącznie
abstrakcje, własne stille i syntetyczne dane demo. Po sprincie assetów generacje w Higgsfield usuwamy
(kończy licencję na trening). Bot `/post <temat>` nie dostaje nazw klientów ani osób; digest Lead-Scout
na Telegram zawiera firmy i sygnały, nie nazwiska ani adresy e-mail osób. Każdy nowy host w kodzie
(`find-integrations.mjs`) i każda nowa wzmianka o usłudze bez wpisu to sygnał do przeglądu, nie do auto-fixu.

## Mechanizm awarii (dlaczego)

Higgsfield ToU (26.07.2026): dostawca ma licencję na trening modeli na inputach i outputach do czasu ich
usunięcia, nie gwarantuje oryginalności outputu i przerzuca AUP dostawców modeli (Google/OpenAI/ByteDance);
zrzut narzędzia klienta jako `image_references` to trwałe wydanie cudzego materiału. Manus zapisuje pełne
replaye sesji, ma szeroką, przenoszalną licencję na treści, dane w USA/Singapurze, właściciela z Chin
i incydent kasowania danych (08/2026); jedna wklejka `leads.json` to naruszenie art. 28 RODO (procesor bez
umowy) i art. 14 (odbiorca nieujawniony na `/rodo`). Modele przez API logują wejścia; MCP hostowane widzi
kod i ścieżki. Umowa IP z poprzednią firmą nie jest podpisana (CLAUDE.md #3), więc każdy jej materiał
poza repo to naruszenie do udowodnienia przez trzecią stronę. Precedens Bisnode (943 470 zł, NSA) dotyczył
danych z rejestrów publicznych bez obowiązku informacyjnego: dane leadów w obcym narzędziu bez wpisu
w klauzuli to dokładnie ten scenariusz.

## Niepoprawnie

```text
# prompt do creative engine (Higgsfield) — zrzut ekranu dashboardu klienta jako referencja stylu
media_upload: C:\Users\…\Kontroling budżetów\zrzut-produkcja-2026-06.png
generate_image: "hero w stylu tego dashboardu, te same liczby i nazwy hal"

# Manus — „przeanalizuj naszych leadów"
załącznik: leadscout/leads.json (32 firmy, osoby kontaktowe, telefony)

# Telegram — /post z danymi osoby
/post Anna Kowalska z firmy X pytała o KSeF, napisz post o tym
```

## Poprawnie

```text
# Higgsfield przez MCP — tylko abstrakcja, własne stille, paleta z kitu (higgsfield.md §7)
generate_image (nano_banana_pro): "abstract brushed-steel surface, soft directional light, palette #A8B4C2 on #121212,
no text, no people, no UI, 21:9" · image_references: site/public/media/board/steel-01.png (własny still)
po sprincie: reveal/usuń generacje z konta; wpis w site/public/media/SOURCES.md (model, prompt, data, id generacji)

# Lead-Scout digest (leadscout/digesty/…): firma · branża · sygnał · źródło — bez imion i adresów e-mail osób
# /post: temat ogólny — "/post KSeF: kontroling na e-fakturach"
```

Rejestr, kolumna „dane, które wychodzą" dla `telegram-bot-api`: „treść digestu (nazwy firm, sygnały)
→ Telegram Messenger Inc. (poza EOG)"; jeśli kiedykolwiek pojawią się dane osób, `/rodo` dostaje odbiorcę
„Telegram" w sekcji art. 14.

## Test

```bash
# 1. rejestr: żaden wpis nie ma pustej kolumny „dane, które wychodzą"
awk -F'|' '/^\| `[a-z0-9-]+` \|/ && NF>=10 { d=$6; gsub(/^[ \t]+|[ \t]+$/,"",d); if (d=="" || d=="—") print "pusta kolumna danych:", $2 }' ".claude/skills/klarow-guardian/references/integrations-registry.md"

# 2. digesty i prompty bez adresów e-mail osób, telefonów i NIP-ów
grep -rnE "[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,}|\+?48[ -]?[0-9]{3}[ -]?[0-9]{3}[ -]?[0-9]{3}|\bNIP\b[: ]*[0-9]{10}" leadscout/digesty site/public/media/SOURCES.md 2>/dev/null | grep -v "kontakt@klarow.com"

# 3. materiały poprzedniej firmy poza repo: SOURCES.md i prompty bez nazwy (case-insensitive)
grep -rniE "nuconic" site/public/media leadscout/digesty 2>/dev/null

# 4. nowe hosty/wzmianki = przegląd (LOW/HIGH w skanerze), nie auto-fix
node ".claude/skills/klarow-guardian/scripts/find-integrations.mjs" --quiet

# 5. sekrety w promptach/logach
node ".claude/skills/klarow-guardian/scripts/check-secrets.mjs" leadscout/digesty audit 2>/dev/null
```

Ręcznie przed KAŻDYM `media_upload`/załącznikiem do narzędzia zewnętrznego: (a) czy to własny materiał,
(b) czy nie ma na nim ludzi, UI klienta, liczb, nazw, (c) czy wpis w rejestrze przewiduje ten rodzaj danych.

## Wyjątki

Dane fikcyjne dem (`site/src/data/demo-sample.ts`, `tools.ts`) są syntetyczne i publiczne: wolno je
wysyłać do narzędzi generatywnych. Publiczne dane firm (nazwa, branża, strona www) z rejestrów wolno
przetwarzać w Lead-Scout i w digestach; dane osób fizycznych (imię, nazwisko, e-mail imienny, telefon)
podlegają tej regule i klauzuli art. 14 na `/rodo`.
