---
id: secret-never-read-env
title: Agent nigdy nie czyta, nie cytuje i nie edytuje plików z sekretami (.env, credentials, klucze, .chat_id) — hook odmawia z powodem
impact: BLOCKER
tags: [secrets, env, hooks, claude-code, credentials]
source: CLAUDE.md 2026-07-27 (żywy klucz Anthropic w .env appki KSeF) / manus §4.1 („mask, don't remove": PreToolUse deny z powodem), §5.3 p.4 / synthesis §5.4.10 (secret-never-read), §5.8.3 (block-secrets) / portfolio §0 („czego celowo nie otworzyłem")
added: 2026-09-12
---

## Zasada

Żaden agent (sesja główna, subagent, skill, workflow) nie otwiera, nie wypisuje, nie grepuje po treści
i nie edytuje plików: `.env` i `.env.*` (poza `.env.example`/`.sample`/`.template`), `.dev.vars`,
`.chat_id`, `credentials*`, `*.pem`, `*.p12`, `*.pfx`, `*.key`, `*.keystore`, `id_rsa*`, `Klucze*.txt`,
`RAILWAY-VARS*`, `PROMO_CODES*`, `secrets.json`, `service-account*.json`. Dotyczy to też komend
(`cat`, `type`, `Get-Content`, `grep -r TOKEN .`, `printenv`, `git add .env`). Gdy agent potrzebuje NAZWY
zmiennej, czyta `.env.example`, README lub rejestr integracji; wartość ustawia founder ręcznie.

Mechanicznie egzekwuje to **jeden** hook `PreToolUse`: `scripts/hook-pre-tool.mjs`, zarejestrowany przez
skopiowanie gotowego `hooks.settings.example.json` do `.claude/settings.json` (patrz „Poprawnie"). Odmawia
z uzasadnieniem — model dostaje powód i uczy się w tej samej sesji, narzędzie nie znika. Drugi skrypt,
`check-secrets.mjs --claude-hook`, to **wariant zapasowy i zarazem test logiki** (ta sama lista plików,
odpowiedź w formacie `permissionDecision`), a nie druga równoległa rejestracja: w `.claude/settings.json`
ma być zarejestrowany dokładnie JEDEN z nich. Dopóki `.claude/settings.json` nie istnieje na maszynie
foundera, reguła jest wyłącznie instrukcją — dokumentacja Claude Code mówi wprost, że CLAUDE.md
„is not a hard enforcement layer". Instalacja hooka to pierwszy krok konfiguracji repo, nie opcja.
`leadscout/leads.json` NIE jest plikiem sekretów (skill `/lead-scout` musi go czytać i dopisywać), ale jego
treść podlega `secret-no-secrets-in-prompts-or-logs` (nie cytować danych osób w raportach, nie wysyłać na zewnątrz).

## Mechanizm awarii (dlaczego)

Wszystko, co narzędzie `Read`/`Bash` zwróci, staje się częścią kontekstu modelu: transkryptu sesji,
wyników subagentów przekazywanych orkiestratorowi, artefaktów publikowanych pod URL, logów audytu
w `audit/`, a po stronie API Anthropic danych żądania. Sekret w kontekście przestaje być sekretem, choć
plik nadal leży „bezpiecznie" poza gitem. Jeden taki przypadek już się zdarzył (klucz Anthropic w `.env`
appki KSeF, do rotacji). Instrukcja w CLAUDE.md nie jest warstwą egzekwującą (docs Claude Code: „not a hard
enforcement layer"), dlatego potrzebny jest hook: deny z powodem zamiast liczenia na pamięć modelu.
Wzorzec Manus „mask, don't remove": stała lista narzędzi + odmowa z wyjaśnieniem daje lepsze zachowanie
niż usuwanie narzędzia `Read` z sesji.

## Niepoprawnie

```text
Read  leadscout/.env
Bash  cat leadscout/.env | grep TOKEN
Bash  grep -rn "TELEGRAM_BOT_TOKEN=" .          # wypisze wartość, jeśli jest w .env
Bash  rg TELEGRAM_BOT_TOKEN .                   # to samo: rg/ripgrep/findstr/awk/sed po korzeniu repo
PS    Select-String -Path . -Pattern ANTHROPIC_API_KEY -Recurse
Grep  pattern="sk-ant-" path="C:/Users/bibac/OneDrive/KSeF app/.env"
Edit  leadscout/.env  (wpisanie tokenu, który agent „dostał w wiadomości")
```
Rekurencyjne szukanie po korzeniu repo jest zakazane, bo wypisuje DOPASOWANE LINIE: wartość z `.env`
ląduje w transkrypcie, a to ekspozycja wymagająca rotacji (`secret-rotate-on-exposure`).

## Poprawnie

```text
Read  leadscout/.env.example                       # tylko nazwa zmiennej
Bash  node leadscout/notify.mjs --test             # skrypt sam czyta .env, agent widzi tylko wynik wysyłki
Bash  git check-ignore -q leadscout/.env && echo "ignorowany"
Bash  wrangler secret list                         # nazwy sekretów Workera, bez wartości
Bash  grep -rn "TELEGRAM_BOT_TOKEN" site demo ui-kit   # szukanie NAZWY w katalogach bez sekretów — wolno
```
Gdy trzeba ustawić sekret: agent pisze instrukcję dla foundera („wklej token do `leadscout/.env`
jako `TELEGRAM_BOT_TOKEN=`" / „`wrangler secret put ANTHROPIC_API_KEY`") i NIE prosi o wartość na czacie.

Instalacja hooka (jednorazowo, na każdej maszynie foundera). Źródłem prawdy jest
`.claude/skills/klarow-guardian/hooks.settings.example.json` — plik wersjonowany, zero sekretów,
ścieżki przez `$CLAUDE_PROJECT_DIR` (działa mimo spacji i `&` w ścieżce repo). `.claude/settings.json`
to jego kopia; jeśli w repo go nie ma, hook NIE działa i nikt nie jest blokowany:
```bash
# instalacja (Bash) — nie nadpisuj, jeśli plik już istnieje: scal ręcznie
cp ".claude/skills/klarow-guardian/hooks.settings.example.json" ".claude/settings.json"
# PowerShell
Copy-Item ".claude/skills/klarow-guardian/hooks.settings.example.json" ".claude/settings.json"
```
Rejestruje `PreToolUse` → `scripts/hook-pre-tool.mjs` (ten sam zakaz plików sekretów co
`check-secrets.mjs`, dodatkowo bramka marki: `nuconic`, `#FFA914`) z matcherem
`Read|Edit|Write|MultiEdit|Bash|PowerShell|Grep|Glob` oraz `PostToolUse` → `hook-post-edit.mjs`.
Matcher ma wymieniać KAŻDE narzędzie, które potrafi dotknąć pliku sekretów — w tym środowisku
`PowerShell` jest powłoką podstawową, a `Grep`/`Glob` czytają ścieżki; jeśli w sesji dostępny jest
`NotebookEdit` (hook sprawdza `notebook_path`), dopisz go do matchera w pliku przykładowym,
a nie tylko w tej regule — obie listy mają być identyczne.

## Test

```bash
S=".claude/skills/klarow-guardian/scripts/check-secrets.mjs"
# deny dla .env, także wieloczłonowego (standard Vite: .env.production.local)
echo '{"tool_name":"Read","tool_input":{"file_path":"leadscout/.env"}}' | node "$S" --claude-hook | grep -q '"deny"' && echo OK-deny
echo '{"tool_name":"Read","tool_input":{"file_path":"site/.env.production.local"}}' | node "$S" --claude-hook | grep -q '"deny"' && echo OK-deny
# deny dla komendy czytającej .env
echo '{"tool_name":"Bash","tool_input":{"command":"cat leadscout/.env"}}' | node "$S" --claude-hook | grep -q '"deny"' && echo OK-deny
# deny dla szukania wartości sekretu po całym repo (grep/rg/Select-String/findstr)
echo '{"tool_name":"Bash","tool_input":{"command":"grep -rn TELEGRAM_BOT_TOKEN ."}}' | node "$S" --claude-hook | grep -q '"deny"' && echo OK-deny
echo '{"tool_name":"PowerShell","tool_input":{"command":"Select-String -Path . -Pattern ANTHROPIC_API_KEY -Recurse"}}' | node "$S" --claude-hook | grep -q '"deny"' && echo OK-deny
# allow dla szablonów (.example/.sample/.template, także .env.production.example), zwykłego pliku
# i ZAWĘŻONEGO szukania nazwy (to dokumentowany test integ-telegram-anthropic-only-in-bots)
echo '{"tool_name":"Read","tool_input":{"file_path":"leadscout/.env.example"}}' | node "$S" --claude-hook | grep -q '"allow"' && echo OK-allow
echo '{"tool_name":"Read","tool_input":{"file_path":"leadscout/.env.sample"}}' | node "$S" --claude-hook | grep -q '"allow"' && echo OK-allow
echo '{"tool_name":"Read","tool_input":{"file_path":"site/src/App.tsx"}}' | node "$S" --claude-hook | grep -q '"allow"' && echo OK-allow
echo '{"tool_name":"Bash","tool_input":{"command":"grep -rn TELEGRAM_BOT_TOKEN site demo ui-kit"}}' | node "$S" --claude-hook | grep -q '"allow"' && echo OK-allow
# deny dla klucza prywatnego i credentials
echo '{"tool_name":"Read","tool_input":{"file_path":"C:/x/credentials.json"}}' | node "$S" --claude-hook | grep -q '"deny"' && echo OK-deny

# hook KANONICZNY: przykład w repo rejestruje hook-pre-tool.mjs i wymienia PowerShell w matcherze
grep -n "hook-pre-tool.mjs" ".claude/skills/klarow-guardian/hooks.settings.example.json"
grep -n '"matcher"' ".claude/skills/klarow-guardian/hooks.settings.example.json" | grep -q "PowerShell" && echo OK-matcher
# czy zainstalowany u foundera (brak pliku = brak egzekucji, tylko instrukcja)
test -f .claude/settings.json && grep -n "hook-pre-tool.mjs\|check-secrets.mjs" .claude/settings.json || echo "UWAGA: .claude/settings.json nie istnieje — hook NIE jest zainstalowany"
# ta sama lista narzędzi w regule i w pliku przykładowym (zero rozjazdu)
diff <(grep -oE '"matcher": "[^"]+"' ".claude/skills/klarow-guardian/hooks.settings.example.json" | head -1 | grep -oE 'Read[^"]+') \
     <(grep -oE '`Read\|[^`]+`' ".claude/skills/klarow-guardian/rules/secret-never-read-env.md" | head -1 | tr -d '`') && echo OK-sync
```

## Wyjątki

Pliki `.env.example` / `.env.sample` / `.env.template` (także wieloczłonowe: `.env.production.example`,
szablony z samymi nazwami zmiennych) wolno czytać i edytować — oba hooki muszą odpowiadać tu `allow`.
Szukanie NAZWY zmiennej w katalogach, w których sekretów nie ma (`grep -rn TELEGRAM_BOT_TOKEN site demo ui-kit`),
jest dozwolone i jest testem `integ-telegram-anthropic-only-in-bots`; zakaz dotyczy przeszukiwania
korzenia repo (`.`, `/`, `~`) i wzorców łapiących WARTOŚĆ (`NAZWA=`).
Skrypty projektu (`leadscout/notify.mjs`) czytają `.env` programowo; agent uruchamia skrypt, nie plik.
Founder może wkleić wartość sekretu do pliku ręcznie poza sesją; jeśli wklei ją na czat, obowiązuje
`secret-rotate-on-exposure` (wartość w transkrypcie = ekspozycja).
