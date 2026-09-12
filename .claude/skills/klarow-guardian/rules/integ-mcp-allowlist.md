---
id: integ-mcp-allowlist
title: Serwery MCP tylko z allowlisty — hostowany MCP to integracja z wpisem i decyzją
impact: HIGH
tags: [integrations, mcp, claude-code, supply-chain, data-egress]
source: motion-dev §6.1-6.2, §11 p.5 (Motion MCP hostowane, .mcp.json) / higgsfield §1 (MCP creative engine, Cloud API niepotrzebne) / manus §2.5, §4.1 („mask, don't remove", allowlisty zamiast dynamicznych narzędzi) / synthesis §5.4.9
added: 2026-09-12
---

## Zasada

Plik `.mcp.json` w korzeniu repo (wersjonowany, wspólny dla obu founderów) może zawierać wyłącznie serwery
z allowlisty rejestru (`references/integrations-registry.md`, typ `MCP`):

| id | serwer | forma | warunek |
|---|---|---|---|
| `motion-mcp` | `https://mcp.motion.dev` (free: dokumentacja, przykłady) | hostowany, bez tokenu | opcjonalny; wpis `status: aktywna` po decyzji founderów (motion-dev §11 p.5) |
| `motion-mcp` | `https://mcp.motion.dev/plus` (Motion+: MotionScore, edytor) | hostowany, login z ustawień MCP agenta | dopiero po zakupie Motion+ i rozstrzygnięciu licencji dla 2 founderów |
| `higgsfield-mcp` | creative engine (Higgsfield) | connector claude.ai (OAuth), NIE w `.mcp.json` | plan wg D-08; zasady danych z `integ-data-egress-review` |

Każdy inny serwer (własny, z npm, z „mcpmarket", z linku od znajomego) = nowa integracja: wpis w obu tabelach
rejestru + decyzja founderów PRZED dodaniem. Zakazane w `.mcp.json`: literalne klucze/tokeny w `env`
(tylko odwołania do zmiennych środowiskowych), serwery uruchamiane przez `npx` (nie działa w repo przez `&`
w ścieżce; instalacja globalna to decyzja), serwery bez nazwy dostawcy i adresu w dokumentacji.
Higgsfield Cloud API (`api.higgsfield.ai`, klucze `KEY_ID:KEY_SECRET`) ma status `zakazana`: MCP wystarcza,
API jest rozliczane osobno i wymaga sekretów w repo lub środowisku.

## Mechanizm awarii (dlaczego)

Serwer MCP widzi wszystko, co agent mu wyśle: fragmenty kodu, ścieżki, nazwy klientów w danych, treść
promptów; hostowany serwer to więc wyjście danych poza maszynę foundera, identyczne w skutkach z API
zewnętrznym, tylko mniej widoczne (nie ma `fetch` w kodzie, jest wpis w JSON). Opisy narzędzi MCP trafiają
do kontekstu modelu i mogą zawierać instrukcje (prompt injection przez opis narzędzia), a serwer z npm
wykonuje kod na komputerze z dostępem do repo, `.env` i Menedżera poświadczeń. Manus dowodzi, że stabilna,
mała lista narzędzi (allowlista + maskowanie) działa lepiej niż dodawanie serwerów „na zadanie": mniej
definicji w kontekście, lepszy cache, mniej halucynacji schematów. Wersjonowany `.mcp.json` obowiązuje
oba konta founderów, więc jedno kliknięcie „dodaj MCP" zmienia politykę danych całej firmy.

## Niepoprawnie

```json
{
  "mcpServers": {
    "ai-tools-from-marketplace": {
      "command": "npx",
      "args": ["-y", "@someone/mcp-everything"],
      "env": { "OPENAI_API_KEY": "sk-…", "TELEGRAM_BOT_TOKEN": "…" }
    },
    "Higgsfield Cloud": { "url": "https://api.higgsfield.ai/mcp", "headers": { "Authorization": "Key …:…" } }
  }
}
```

## Poprawnie

```json
{
  "mcpServers": {
    "Motion": { "url": "https://mcp.motion.dev" }
  }
}
```
Warunek: w rejestrze `motion-mcp` ma status `aktywna` (dziś `planowana`), a decyzja jest w `docs/DECISIONS.md`.
Motion+ dopisujemy osobno po zakupie: `"Motion+": { "url": "https://mcp.motion.dev/plus" }` — login przez
ustawienia MCP agenta, zero tokenów w pliku. Higgsfield pozostaje connectorem claude.ai (poza `.mcp.json`).

## Test

```bash
# 1. .mcp.json (jeśli istnieje) zawiera tylko hosty z allowlisty i zero literalnych sekretów
node -e '
const fs=require("fs"); if(!fs.existsSync(".mcp.json")){console.log("brak .mcp.json — OK");process.exit(0)}
const allow=["mcp.motion.dev"]; const cfg=JSON.parse(fs.readFileSync(".mcp.json","utf8")); let bad=0;
for(const [name,s] of Object.entries(cfg.mcpServers||{})){
  const host=(s.url||"").replace(/^https?:\/\//,"").split("/")[0];
  if(s.command){console.log("BLOCK stdio/npx:",name);bad++}
  if(host&&!allow.includes(host)){console.log("HIGH host poza allowlistą:",name,host);bad++}
  for(const v of Object.values(s.env||{})) if(/^[A-Za-z0-9_-]{16,}$/.test(v)||/^sk-/.test(v)){console.log("BLOCK literalny sekret w env:",name);bad++}
}
process.exit(bad?1:0)'

# 2. skaner traktuje .mcp.json i skille mcp*.json jak kod (hosty vs rejestr)
node ".claude/skills/klarow-guardian/scripts/find-integrations.mjs" .mcp.json ".claude/skills/*/mcp*.json" --strict --quiet

# 3. sekrety w .mcp.json
node ".claude/skills/klarow-guardian/scripts/check-secrets.mjs" .mcp.json
```

## Wyjątki

Konfiguracja MCP w profilu użytkownika (`~/.claude.json`) jest prywatna i poza repo, ale hostowane serwery
tam dodane też przetwarzają dane z sesji w tym repo: stosować tę samą allowlistę. Serwery MCP wbudowane
w claude.ai (Gmail, Drive, creative engine) nie są w `.mcp.json`; dla nich obowiązuje `integ-data-egress-review`
(co wolno wysłać), nie ta reguła.
