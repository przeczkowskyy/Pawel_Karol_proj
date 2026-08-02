# Klarow — bot `/post` (Cloudflare Worker)

Po wpisaniu **`/post`** na Telegramie bot generuje kilka **gotowych do publikacji
postów na LinkedIn na dziś** (Anthropic API, głos marki Klarow) i odsyła je —
każdy w osobnej wiadomości do skopiowania. `/post <temat>` = posty na konkretny
temat (np. `/post KSeF`).

Model **pull** (Ty piszesz → bot odpowiada): zawsze online, nie zależy od Twojego
komputera ani od żadnego crona, i nie ma problemu z `chat_id` („bot nie pisze
pierwszy" znika, bo to Ty inicjujesz).

## Czego potrzebujesz (3 sekrety)

1. **`TELEGRAM_BOT_TOKEN`** — od [@BotFather](https://t.me/BotFather): `/newbot`
   (albo `/token`, jeśli używasz istniejącego `@Klarow_BOT`).
2. **`ANTHROPIC_API_KEY`** — **ŚWIEŻY** klucz z
   [console.anthropic.com](https://console.anthropic.com) → API keys → Create.
   ⚠️ **Nie używaj klucza, który wyciekł w `.env` aplikacji KSeF** — ten zrotuj.
3. **`WEBHOOK_SECRET`** — dowolny losowy ciąg (np. `openssl rand -hex 16`).
   Chroni Worker przed obcymi żądaniami; ten sam ciąg ustawiasz przy `setWebhook`.

Opcjonalnie **`ALLOWED_CHAT_ID`** — ogranicza bota do jednego czatu (Twojego).
Swój `chat_id` poznasz, pisząc `/start` do bota **przed** ustawieniem tej zmiennej
(bot odpowie prywatnie i poda id), albo przez [@userinfobot](https://t.me/userinfobot).

## Wdrożenie — opcja A: dashboard (najprościej, bez narzędzi)

1. [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** →
   **Create** → **Create Worker** → nazwij `klarow-post-bot` → **Deploy**.
2. **Edit code** → wklej całą zawartość [`worker.js`](worker.js) → **Deploy**.
3. **Settings → Variables and Secrets → Add** (typ **Secret / Encrypt**), po kolei:
   `TELEGRAM_BOT_TOKEN`, `ANTHROPIC_API_KEY`, `WEBHOOK_SECRET`, (opcj.) `ALLOWED_CHAT_ID`.
   Zapisz i **Deploy** ponownie.
4. Skopiuj adres Workera z góry strony (np. `https://klarow-post-bot.<konto>.workers.dev`).

## Wdrożenie — opcja B: CLI (`wrangler`)

```bash
# z katalogu post-bot/ (w tym repo npx bywa łamany przez znak & w ścieżce —
# jeśli tak, wywołaj wrangler przez node wprost, jak site/ robi z vite)
wrangler deploy
wrangler secret put TELEGRAM_BOT_TOKEN
wrangler secret put ANTHROPIC_API_KEY
wrangler secret put WEBHOOK_SECRET
# opcjonalnie:
wrangler secret put ALLOWED_CHAT_ID
```

## Podłączenie webhooka Telegrama (raz)

Podstaw `<TOKEN>`, `<WORKER_URL>`, `<WEBHOOK_SECRET>` i uruchom:

```bash
curl "https://api.telegram.org/bot<TOKEN>/setWebhook" \
  -d "url=<WORKER_URL>" \
  -d "secret_token=<WEBHOOK_SECRET>"
```

Sprawdzenie: `curl "https://api.telegram.org/bot<TOKEN>/getWebhookInfo"` — pole
`url` powinno wskazywać Twój Worker, a `pending_update_count` być niskie.

## Test

Napisz do bota **`/post`**. Po chwili przyjdzie „⏳ Generuję…", a potem 3 posty.

## Konfiguracja (na górze `worker.js`)

- `MODEL` — domyślnie `claude-opus-5` (najlepsza jakość copy). Taniej/szybciej:
  `claude-sonnet-5` albo `claude-haiku-4-5`.
- `EFFORT` — `medium` (balans). `low` = szybciej/taniej; `high`/`max` = lepsza jakość.
- `POST_COUNT` — ile propozycji na raz (domyślnie 3).

## Uwagi

- Worker odpowiada Telegramowi natychmiast (200) i generuje w tle (`ctx.waitUntil`),
  więc długie generowanie nie powoduje dublowania zapytań.
- Koszt: kilka centów za wywołanie `/post` na Opus 5 (mniej na Sonnet/Haiku).
  Klucz Anthropic wymaga środków/planu z dostępem do API.
- Sekrety żyją w Cloudflare (zaszyfrowane), **nie w tym repo**.
