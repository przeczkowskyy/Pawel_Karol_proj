---
id: integ-telegram-anthropic-only-in-bots
title: Telegram Bot API i Anthropic API wyłącznie w botach wewnętrznych (post-bot/, leadscout/), nigdy w site/
impact: BLOCKER
tags: [integrations, telegram, anthropic, scope, secrets, static-site]
source: site-audit §4 p.18-20 / post-bot/worker.js:144,199 / leadscout/notify.mjs:39 / synthesis §5.4.9 / CLAUDE.md (Lead-Scout, bot /post)
added: 2026-09-12
---

## Zasada

Połączenia z `api.telegram.org` i `api.anthropic.com` (oraz zmienne `TELEGRAM_BOT_TOKEN`, `ANTHROPIC_API_KEY`,
`WEBHOOK_SECRET`, `ALLOWED_CHAT_ID`) mają w rejestrze zakres ograniczony do katalogów `post-bot/` (Telegram +
Anthropic, Cloudflare Worker) i `leadscout/` (tylko Telegram, `notify.mjs`). W `site/`, `demo/`, `ui-kit/`
i w narzędziach dla klientów nie występują: ani host, ani nazwa zmiennej, ani pakiet SDK. Strona jest statyczna
(Cloudflare Pages, zero backendu, `site-audit.md` §1): każda zmienna `import.meta.env.VITE_*` trafia
do publicznego bundla, więc na stronie po prostu NIE MA gdzie bezpiecznie trzymać tokenu. Jeśli kiedyś strona
ma coś wysyłać (formularz „przyślij najgorszy Excel"), robi to Pages Function (`site/functions/api/*.ts`)
z sekretami w Cloudflare, po wpisie w rejestrze, decyzji founderów i sekcji w `/rodo`.

## Mechanizm awarii (dlaczego)

Token bota w bundlu strony = każdy odwiedzający może pisać jako `@Klarow_BOT` do founderów (phishing
z zaufanego kanału) i czytać `getUpdates` (treść digestów z leadami). Klucz Anthropic w bundlu = cudze
rachunki na koncie Klarow w ciągu minut (boty skanujące JS na produkcji). Vite wstrzykuje `VITE_*` na etapie
buildu jako literały; `_headers` ani `_redirects` tego nie ukryją, a prerender (`dist/*.html`) utrwala
wartość w 19 plikach. Osobno: Anthropic na stronie łamie „zero chmury dostawcy" (`integ-no-llm-api-in-client-tools`),
a Telegram jako odbiorca danych z formularza wymaga wpisu w `/rodo` (transfer poza EOG). Skaner egzekwuje
to mechanicznie: wpisy `telegram-bot-api`/`anthropic-api` w rejestrze mają zakres `post-bot`/`leadscout`;
wystąpienie w `site/` = HIGH „poza dozwolonym zakresem", a przy `--strict` exit 1. Żeby to była bramka,
a nie deklaracja, `DEFAULT_PATHS` skanera obejmuje **`site/functions` i `ui-kit`** (oba sprawdzone
2026-09-12 na kopii repo: `site/functions/api/leak.ts` z `fetch("https://api.telegram.org/…")` →
HIGH `[integ-telegram-anthropic-only-in-bots]`, `ui-kit/leak.ts` z `api.anthropic.com` → HIGH, exit 1
w domyślnym przebiegu, bez podawania ścieżki).

## Niepoprawnie

```tsx
// site/src/components/WorstExcelForm.tsx — formularz wysyła plik na Telegram founderów prosto z przeglądarki
const TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;   // ląduje w dist/assets/index-*.js jako literał
await fetch(`https://api.telegram.org/bot${TOKEN}/sendDocument`, { method: "POST", body: form });
```

```ts
// site/src/lib/report.ts — „streszczenie raportu" przez Anthropic w silniku demo
const r = await fetch("https://api.anthropic.com/v1/messages", { headers: { "x-api-key": import.meta.env.VITE_ANTHROPIC } });
```

## Poprawnie

```js
// post-bot/worker.js:198-204 — Telegram tylko w Workerze, token z sekretu Cloudflare (env), nigdy w bundlu
async function tg(env, method, body) {
  const r = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/${method}`, {
    method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body),
  });
  return r.json();
}
```

```ts
// gdy strona MA przyjmować plik: Pages Function z sekretem w CF (po wpisie w rejestrze + D-xx + /rodo)
// site/functions/api/worst-excel.ts
export const onRequestPost: PagesFunction<{ TELEGRAM_BOT_TOKEN: string; ALLOWED_CHAT_ID: string }> = async ({ request, env }) => {
  const form = await request.formData();                     // walidacja rozmiaru/typu tutaj
  await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendDocument`, { method: "POST", body: form });
  return new Response(null, { status: 204 });
};
```
Front woła `fetch("/api/worst-excel")` (własna domena), nie Telegram.

## Test

```bash
# zero hostów i nazw sekretów botów poza post-bot/ i leadscout/
grep -rnE "api\.telegram\.org|api\.anthropic\.com|TELEGRAM_BOT_TOKEN|ANTHROPIC_API_KEY|WEBHOOK_SECRET|ALLOWED_CHAT_ID" site demo ui-kit --include=*.ts --include=*.tsx --include=*.js --include=*.mjs --include=*.html --include=*.css
# zero VITE_* o nazwach sekretów (Vite wstrzykuje je do bundla)
grep -rnE "import\.meta\.env\.VITE_[A-Z_]*(TOKEN|KEY|SECRET)" site/src
# skaner: zakresy z rejestru (post-bot / leadscout) — wystąpienie w site/ = HIGH [integ-telegram-anthropic-only-in-bots]
node ".claude/skills/klarow-guardian/scripts/find-integrations.mjs" --strict --quiet
# dist po buildzie: żaden token/host botów
grep -rlE "api\.telegram\.org|api\.anthropic\.com" site/dist && echo "BLOCKER" || echo "OK"
```

## Wyjątki

Wzmianki w TREŚCI strony (np. opis kompetencji „bot na Telegramie", case bota `/post` w portfolio) to nie
połączenia; skaner klasyfikuje je jako `service-mention` bez sprawdzania zakresu. Pages Function jako
pośrednik jest dozwolona po spełnieniu warunków z zasady (rejestr, decyzja, `/rodo`, sekrety w CF).
