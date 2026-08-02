/* Klarow „/post" — bot Telegrama na Cloudflare Worker (webhook).
   Model PULL: użytkownik pisze /post → Worker generuje kilka gotowych postów
   na dziś (Anthropic API) i odsyła. Zawsze online (Worker), niezależnie od PC.
   Pull rozwiązuje też stary problem z chat_id / „bot nie pisze pierwszy" —
   bot tylko ODPOWIADA na wiadomość, którą Ty inicjujesz.

   Sekrety (dashboard: Settings → Variables → Add, jako „Encrypt"; albo
   `wrangler secret put ...`):
     TELEGRAM_BOT_TOKEN   token od @BotFather
     ANTHROPIC_API_KEY    ŚWIEŻY klucz z console.anthropic.com
                          (NIE ten, który wyciekł w .env aplikacji KSeF!)
     WEBHOOK_SECRET       losowy ciąg; ustawiany też przy setWebhook (secret_token)
     ALLOWED_CHAT_ID      (opcjonalnie) ogranicz bota do jednego czatu — Twojego

   Deploy i webhook: patrz README.md w tym katalogu. */

const MODEL = "claude-opus-5"; // taniej/szybciej: "claude-sonnet-5" lub "claude-haiku-4-5"
const EFFORT = "medium"; // "low" = szybciej/taniej; "high"/"max" = lepsza jakość copy
const MAX_TOKENS = 6000; // zapas na myślenie modelu + 3 posty w JSON (żeby nie uciąć)
const POST_COUNT = 3;

const SYSTEM_PROMPT = `Jesteś ghostwriterem treści na LinkedIn dla marki KLAROW (klarow.com).

O KLAROW:
- Automatyzacja i porządek w danych dla MŚP 20–250 osób, które „wyrosły na Excelu" (produkcja, budownictwo, dystrybucja; środowisko Windows + Excel).
- Obietnica: wdrożenie w DNI, nie w miesiące; dane zostają u klienta (on-premise).
- Dwa twarde wyróżniki: (1) „prawdziwie zero chmury" — narzędzie działa lokalnie, nie ma nawet którędy wysłać danych, żadnego API do modeli językowych w samym narzędziu; (2) determinizm — „kalkulator, nie wróżka": te same dane zawsze dają ten sam wynik, każdą liczbę można sprawdzić ręcznie.
- Co budujemy (custom pod proces): raporty i kontroling, integracje i e-dokumenty (m.in. KSeF), importy i scalanie danych z ERP, obieg dokumentów, panele/dashboardy, porządek w danych.
- Oferta wejściowa: „Pilot na kopii" — jeden proces, efekt w dni, płatność 50/50, budowa na kopii plików. Hak: „przyślij nam swój najgorszy Excel".
- Founderzy: Paweł i Karol. Ton founder-led, z pierwszej ręki.

TYPOWE BÓLE ODBIORCY (kontroler / „człowiek-Excel", właściciel, dyrektor operacyjny):
- makro po kimś, kto odszedł i nikt nie wie, jak działa;
- ręczne przeklejanie tysięcy wierszy między ERP a arkuszami;
- ciche pomyłki, które wychodzą u zarządu albo w wycenie;
- raport zarządczy składany godzinami z dziesiątek plików;
- cała wiedza o liczbach firmy na jednej osobie.

GORĄCE TEMATY: obowiązkowy KSeF (e-faktury) i kontroling na danych z KSeF; „AI-agenci vs. deterministyczne narzędzia"; „custom bez chmury"; „dni, nie miesiące".

ZASADY (twarde):
- Piszesz po polsku.
- ZERO zmyślonych liczb, nazw klientów, twardych metryk. Przykład klienta zawsze anonimowo: „firma produkcyjno-budowlana". Nie podawaj konkretnych oszczędności w %/zł.
- Bez korpo-waty i ściany buzzwordów, bez emoji-spamu (0–2 emoji, zwykle 0). Bez „rewolucji", „synergii", „gamechangerów".
- Konkret > ogólnik. Krótkie zdania. Głos człowieka, nie działu marketingu.

FORMAT KAŻDEGO POSTA:
- Mocny hook w pierwszej linii (zatrzymuje scroll: pytanie, kontrowersja, konkretny obraz bólu).
- 3–6 krótkich linii/akapitów rozwinięcia.
- Miękkie CTA na końcu (pytanie do odbiorcy albo „napisz, jeśli…" / „przyślij swój najgorszy Excel").
- Długość ~80–160 słów. Maksymalnie 2–3 trafne hashtagi na końcu (opcjonalnie).

Wygeneruj wskazaną liczbę RÓŻNYCH postów — każdy inny kąt (np.: historia bólu; kontrariański take o AI/chmurze; edukacja o KSeF; behind-the-scenes foundera „jak budujemy"; mit vs. rzeczywistość). Pole "angle" = 2–4 słowa opisujące kąt (po polsku). Pole "text" = gotowy post do wklejenia (z zachowanymi łamaniami linii).`;

export default {
  async fetch(request, env, ctx) {
    if (request.method === "GET") {
      return new Response("Klarow /post bot — OK. Ustaw webhook Telegrama (patrz README).", {
        status: 200,
      });
    }
    if (request.method !== "POST") {
      return new Response("method not allowed", { status: 405 });
    }
    // Weryfikacja, że żądanie pochodzi z Telegrama (secret ustawiony przy setWebhook)
    if (env.WEBHOOK_SECRET && request.headers.get("X-Telegram-Bot-Api-Secret-Token") !== env.WEBHOOK_SECRET) {
      return new Response("forbidden", { status: 403 });
    }

    let update;
    try {
      update = await request.json();
    } catch {
      return new Response("ok");
    }
    const msg = update.message || update.edited_message;
    const chatId = msg && msg.chat && msg.chat.id;
    const text = (msg && typeof msg.text === "string" ? msg.text : "").trim();
    if (!chatId) return new Response("ok");

    // Opcjonalny allowlist — tylko Twój czat
    if (env.ALLOWED_CHAT_ID && String(chatId) !== String(env.ALLOWED_CHAT_ID)) {
      ctx.waitUntil(tg(env, "sendMessage", { chat_id: chatId, text: `Ten bot jest prywatny. (Twój chat_id: ${chatId})` }));
      return new Response("ok");
    }

    const cmd = text.split(/\s+/)[0].replace(/@.*$/, "").toLowerCase();
    const topic = text.slice(text.indexOf(cmd) + cmd.length).trim();

    if (cmd === "/post") {
      // Odpowiedz Telegramowi natychmiast (200); generuj w tle (waitUntil),
      // żeby webhook nie wisiał i Telegram nie ponawiał zapytania.
      ctx.waitUntil(handlePost(env, chatId, topic));
    } else if (cmd === "/start" || cmd === "/help") {
      ctx.waitUntil(
        tg(env, "sendMessage", {
          chat_id: chatId,
          text: "Cześć! Wpisz /post, a przyślę kilka gotowych postów na LinkedIn na dziś.\n/post <temat> — posty na konkretny temat (np. /post KSeF).",
        })
      );
    } else if (cmd.startsWith("/")) {
      ctx.waitUntil(tg(env, "sendMessage", { chat_id: chatId, text: "Nie znam tej komendy. Wpisz /post." }));
    }
    return new Response("ok");
  },
};

async function handlePost(env, chatId, topic) {
  try {
    await tg(env, "sendChatAction", { chat_id: chatId, action: "typing" });
    await tg(env, "sendMessage", { chat_id: chatId, text: "⏳ Generuję posty na dziś…" });

    const posts = await generatePosts(env, topic);
    if (!posts.length) {
      await tg(env, "sendMessage", { chat_id: chatId, text: "Nie udało się wygenerować postów. Spróbuj ponownie za chwilę." });
      return;
    }
    await tg(env, "sendMessage", {
      chat_id: chatId,
      text: `📝 ${posts.length} propozycje na dziś${topic ? " (temat: " + topic + ")" : ""} — każda w osobnej wiadomości do skopiowania:`,
    });
    for (let i = 0; i < posts.length; i++) {
      const p = posts[i];
      const body = `— ${i + 1}/${posts.length} · ${p.angle || "post"} —\n\n${p.text}`;
      await tg(env, "sendMessage", { chat_id: chatId, text: body.slice(0, 4096) });
    }
  } catch (e) {
    await tg(env, "sendMessage", { chat_id: chatId, text: "Błąd generowania: " + (e && e.message ? e.message : String(e)) });
  }
}

async function generatePosts(env, topic) {
  const today = new Date().toLocaleDateString("pl-PL", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const userMsg =
    `Dzisiejsza data: ${today}. Wygeneruj ${POST_COUNT} różne, gotowe do publikacji posty na LinkedIn na dziś dla marki Klarow.` +
    (topic ? ` Temat przewodni wszystkich postów: ${topic}.` : "") +
    ` Każdy inny kąt i inny hook.`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: SYSTEM_PROMPT,
      output_config: {
        effort: EFFORT,
        format: {
          type: "json_schema",
          schema: {
            type: "object",
            properties: {
              posts: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    angle: { type: "string" },
                    text: { type: "string" },
                  },
                  required: ["angle", "text"],
                  additionalProperties: false,
                },
              },
            },
            required: ["posts"],
            additionalProperties: false,
          },
        },
      },
      messages: [{ role: "user", content: userMsg }],
    }),
  });

  const data = await res.json();
  if (data.error) throw new Error(data.error.message || "Anthropic error");
  if (data.stop_reason === "refusal") throw new Error("model odmówił wygenerowania");
  const textBlock = (data.content || []).find((b) => b.type === "text");
  if (!textBlock || !textBlock.text) return [];
  let parsed;
  try {
    parsed = JSON.parse(textBlock.text);
  } catch {
    return [];
  }
  return Array.isArray(parsed.posts) ? parsed.posts.filter((p) => p && p.text) : [];
}

async function tg(env, method, body) {
  const r = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/${method}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  return r.json();
}
