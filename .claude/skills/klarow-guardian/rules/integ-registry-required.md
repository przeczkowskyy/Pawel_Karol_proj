---
id: integ-registry-required
title: Nowe połączenie zewnętrzne = wpis w rejestrze integracji PRZED kodem
impact: BLOCKER
tags: [integrations, registry, rodo, data-egress, scanner]
source: site-audit §4 / synthesis §5.4.9 (integ-registry) / manus §4.1 (find-integrations.mjs) / peer-legal §1.1 (art. 13-14 RODO: odbiorcy danych)
added: 2026-09-12
---

## Zasada

Każde połączenie repo z aplikacją lub usługą spoza `klarow.com` ma wpis w `references/integrations-registry.md`
w OBU tabelach (główna + „Identyfikatory do skanera") ZANIM powstanie kod. Dotyczy: hostów (`https://…`),
`<script src>`, `<link href>`, `<iframe>`, `url()` w CSS, `fetch`/`WebSocket`/`sendBeacon`, pakietów npm
z dostępem do sieci, zmiennych `process.env.X`/`import.meta.env.X`/`env.X`, linków `mailto:`/`tel:`,
serwerów MCP w `.mcp.json`. Wpis odpowiada na pytania: typ, plik:linia, jakie dane wychodzą i dokąd,
nazwa sekretu i gdzie żyje (nigdy wartość), status, czy potrzebna decyzja founderów, czy potrzebny wpis w `/rodo`.
`node ".claude/skills/klarow-guardian/scripts/find-integrations.mjs" --strict` musi być zielony przed pushem.

## Mechanizm awarii (dlaczego)

Niezarejestrowane połączenie to nieznany wyciek danych: art. 13-14 RODO wymagają wskazania odbiorców danych
w klauzuli na `/rodo`, a nie da się wskazać odbiorcy, o którym nikt nie wie. Hook marki „dane zostają u klienta,
zero chmury dostawcy" staje się fałszywy przy pierwszym niezauważonym beaconie analityki. CSP w `_headers`
(gdy embed) musi wymieniać dokładne hosty, więc host bez wpisu = zablokowany zasób w produkcji albo dziurawa
polityka. Rejestr jest też jedynym miejscem, z którego strażnik i agenci audytu wiedzą, co jest dozwolone,
a co zakazane (statusy `zakazana` → BLOCKER w skanerze). Bez wpisu „przed kodem" rejestr degeneruje się
do spisu z opóźnieniem, a decyzje founderów (D-15, D-16) są omijane faktem dokonanym.

## Niepoprawnie

```html
<!-- site/index.html — dopisane „na szybko", bez wpisu w rejestrze, bez /rodo, bez decyzji -->
<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token": "…"}'></script>
```

```ts
// site/src/components/ContactForm.tsx — nowy host i nowa zmienna ENV, rejestr nietknięty
const r = await fetch(`https://api.example-forms.com/v1/submit?key=${import.meta.env.VITE_FORMS_KEY}`, { method: "POST", body });
```

## Poprawnie

Kolejność: (1) wiersz w tabeli głównej rejestru (`cf-web-analytics`, typ runtime-external, dane: URL/referrer/UA/CWV,
bez cookies, sekret: brak, status: planowana, decyzja: D-16, `/rodo`: TAK), (2) wiersz w tabeli identyfikatorów
(`static.cloudflareinsights.com`), (3) sekcja w `/rodo`, (4) decyzja w `docs/DECISIONS.md`, (5) **zmiana statusu
w rejestrze na `aktywna`** i CSP w `_headers`, (6) dopiero kod:

```html
<!-- site/index.html — po D-16, po publikacji /rodo i po zmianie statusu na aktywna -->
<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token": "…"}'></script>
```

Skaner po komplecie kroków: `INFO script-src static.cloudflareinsights.com → cf-web-analytics`,
`informacyjnie: … NIEZAREJESTROWANE 0`. Kod dopisany PRZED krokami 3-5 daje
`HIGH [integ-embed-requires-privacy]` — status `planowana` albo brak hosta w `site/dist/rodo.html`
i w CSP — czyli bramka pilnuje wszystkich trzech warunków, nie tylko obecności wpisu.

## Test

```bash
# 1. skan kodu źródłowego. Domyślny zasięg (DEFAULT_PATHS): site/{src,public,index.html,vite.config.ts,
#    scripts,functions,package.json}, ui-kit, post-bot, leadscout, demo, .mcp.json,
#    .claude/{settings.json,agents,workflows} i mcp*.json skilli
node ".claude/skills/klarow-guardian/scripts/find-integrations.mjs" --strict --quiet
# oczekiwane: „Σ BLOCKER 0 · HIGH 0 · …" i w linii niżej „informacyjnie: INFO n · NIEZAREJESTROWANE 0", exit 0
# (MEDIUM/LOW nie przerywają bramki; stan na 2026-09-12 opisuje §5 rejestru)

# 2. po buildzie: także dist (zbundlowane hosty)
node ".claude/skills/klarow-guardian/scripts/find-integrations.mjs" --dist --strict --quiet

# 3. JSONL problemów do audytu (format CONTRACT) + pełny inwentarz
node ".claude/skills/klarow-guardian/scripts/find-integrations.mjs" --json audit/integrations.jsonl --inventory audit/integrations-inventory.json --quiet

# 4. ręcznie: każdy id z tabeli identyfikatorów istnieje w tabeli głównej
grep -oE '^\| `[a-z0-9-]+` \|' ".claude/skills/klarow-guardian/references/integrations-registry.md" | sort | uniq -c | awk '$1 != 2 {print "id bez pary:", $3}'

# 5. bramka naprawdę łapie „wpis jest, ale procedury nie było": snippet z sekcji „Niepoprawnie"
#    w kopii repo → HIGH [integ-embed-requires-privacy] i exit 1 (status `planowana` w rejestrze)
```

Severity: BLOCKER dla HIGH/BLOCKER ze skanera (host/skrypt/pakiet/ENV bez wpisu, zakazany, w statusie
`planowana` albo bez pokrycia w `/rodo`+CSP); MEDIUM/LOW (mailto/tel bez schematu w rejestrze, wzmianka
o usłudze, `fetch(zmienna)` bez hosta w linii) = raport. Auto-fix zabroniony: nowy host to decyzja
founderów, nie poprawka agenta.

## Wyjątki

Własna domena (`self-klarow`), URL-e przestrzeni nazw (`schema.org`, `sitemaps.org`, `w3.org` — `xml-namespaces`)
i stałe w zbundlowanych bibliotekach (`bundled-lib-strings`) są zarejestrowane raz i nie wymagają decyzji.
Pliki `.md` (README, `leadscout/zrodla.md`) nie są skanowane domyślnie — linki w dokumentacji to nie połączenia
kodu (`--include-md` włącza skan świadomie).
