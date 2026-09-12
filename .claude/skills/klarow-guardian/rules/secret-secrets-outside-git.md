---
id: secret-secrets-outside-git
title: Sekrety żyją wyłącznie poza gitem — Cloudflare secrets, Menedżer poświadczeń Windows, lokalny .env w .gitignore
impact: BLOCKER
tags: [secrets, git, gitignore, cloudflare, wrangler, vite, credential-manager]
source: .gitignore:6-8 / post-bot/wrangler.toml:1-3 + README.md:79 („sekrety żyją w Cloudflare, nie w repo") / CLAUDE.md #6 (credential.helper=wincred) / synthesis §5.4.10 (secret-scan, secret-cf) / site-audit §4 („Sekrety")
added: 2026-09-12
---

## Zasada

Wartości sekretów mają dokładnie cztery dozwolone miejsca:
1. **Cloudflare Workers/Pages secrets** — `wrangler secret put NAZWA` albo dashboard „Variables and Secrets → Encrypt"
   (`TELEGRAM_BOT_TOKEN`, `ANTHROPIC_API_KEY`, `WEBHOOK_SECRET`, `ALLOWED_CHAT_ID`); nigdy sekcja `[vars]` w `wrangler.toml`;
2. **Menedżer poświadczeń Windows** — PAT GitHuba (wpis `git:https://github.com`, `credential.helper=wincred` per-repo);
3. **lokalny `leadscout/.env` i `leadscout/.chat_id`** — w `.gitignore`, edytowane ręcznie przez foundera;
4. **ustawienia usług poza repo** — hasło SMTP Resend w Gmail „Wyślij jako", konta Cloudflare/Cal.com/Higgsfield.
W repo trzymamy tylko NAZWY (`.env.example`, README, rejestr integracji). Zakazane: wartości w `site/`
(bundle Vite jest publiczny; `import.meta.env.VITE_*` jest wstrzykiwane jako literał), w `wrangler.toml`,
w `CLAUDE.md`/`docs/`, w komunikatach commitów, w artefaktach i skryptach. `.gitignore` zawiera co najmniej:
`leadscout/.env`, `leadscout/.chat_id`, `.dev.vars`, `*.pem`, `credentials*`, `*.local`. Bramka:
`node ".claude/skills/klarow-guardian/scripts/check-secrets.mjs" --staged` w pre-commit,
`--all --dist` przed pushem.

## Mechanizm awarii (dlaczego)

Git nie zapomina: wartość raz scommitowana zostaje w historii nawet po `git rm`, a przepisanie historii
(`git filter-repo` + force push) i tak wymaga rotacji, bo GitHub cache'uje widoki commitów i boty
skanujące pobierają nowe pushe w minutach. Repo jest współdzielone przez dwóch founderów i OneDrive
synchronizuje katalog na kolejne urządzenia; każda kopia to kolejny wyciek. Vite kopiuje `VITE_*` do
`dist/assets/*.js` i do 19 prerenderowanych HTML; Cloudflare Pages publikuje je pod `*.pages.dev` i domeną.
`wrangler.toml` jest wersjonowany, więc `[vars]` to commit wartości. Cloudflare secrets są szyfrowane
i niewidoczne po zapisie; Menedżer poświadczeń rozwiązał już wiszący `git push` (CLAUDE.md #6), więc
infrastruktura jest gotowa: reguła tylko zabrania drogi na skróty.

## Niepoprawnie

```toml
# post-bot/wrangler.toml
[vars]
TELEGRAM_BOT_TOKEN = "123456789:AA…"      # wersjonowane = opublikowane
```
```ts
// site/src/lib/notify.ts — Vite wstrzyknie wartość do publicznego bundla
const TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
```
```text
# CLAUDE.md — „żeby nie zginęło"
Token bota: 123456789:AA…
```

## Poprawnie

```bash
# sekrety Workera — tylko przez wrangler / dashboard (README post-bot, opcja A/B)
wrangler secret put TELEGRAM_BOT_TOKEN
wrangler secret put ANTHROPIC_API_KEY
wrangler secret put WEBHOOK_SECRET
```
```text
# leadscout/.env.example (w repo) — tylko nazwa
TELEGRAM_BOT_TOKEN=
# leadscout/.env (poza repo, .gitignore) — wartość wpisuje founder ręcznie
```
```gitignore
# .gitignore — minimum
node_modules/
dist/
dist-ssr/
*.local
leadscout/.env
leadscout/.chat_id
.dev.vars
*.pem
credentials*
```

## Test

```bash
S=".claude/skills/klarow-guardian/scripts/check-secrets.mjs"
node "$S" --all --dist --quiet                  # Σ BLOCKER 0, exit 0
node "$S" --staged --quiet                      # pre-commit: exit 0
git ls-files | grep -E '(^|/)\.env$|\.env\.[^e]|\.chat_id$|\.dev\.vars$|\.pem$|credentials' && echo "BLOCKER: plik sekretów w repo" || echo OK
git check-ignore -q leadscout/.env leadscout/.chat_id && echo "ignore OK"
grep -nE "^\[vars\]" post-bot/wrangler.toml && echo "BLOCKER: [vars] w wrangler.toml" || echo OK
grep -rnE "import\.meta\.env\.VITE_[A-Z_]*(TOKEN|KEY|SECRET|PASS)" site/src && echo "BLOCKER" || echo OK
# pre-commit bez husky/npx: .git/hooks/pre-commit
printf '#!/bin/sh\nnode ".claude/skills/klarow-guardian/scripts/check-secrets.mjs" --staged --quiet || exit 1\n' > .git/hooks/pre-commit && chmod +x .git/hooks/pre-commit
```

## Wyjątki

Identyfikatory publiczne nie są sekretami i mogą być w kodzie: token beacona Cloudflare Web Analytics,
`chat_id` bota NIE jest publiczny (pozwala celować wiadomości w founderów) — trzymać w `.chat_id`/CF secret.
Placeholdery w szablonach (`.env.example`, README z `<TOKEN>`) są dozwolone; skaner je rozpoznaje.
