/**
 * Formularz kontaktowy — jedyny kod, który wykonuje się na serwerze. Reszta klarow.com jest statyczna.
 *
 * Trasa: POST /api/kontakt. Katalog `functions` leży w `site/`, bo Root directory w Cloudflare Pages
 * to `site` — Cloudflare szuka go tam, gdzie uruchamia komendę builda. W logu wdrożenia musi pojawić się
 * linia „Found Functions directory at /functions. Uploading.”; „No functions dir” oznacza 404 na produkcji.
 *
 * Uwaga, na której łatwo się przejechać: `_redirects` i `_headers` NIE dotyczą odpowiedzi funkcji.
 * Dlatego nagłówki ustawiamy tutaj, a `public/_routes.json` ogranicza funkcje wyłącznie do /api/*,
 * żeby cała dotychczasowa statyka i przekierowania działały tak jak wcześniej.
 *
 * Zero ciasteczek, zero zapisu. Wiadomość idzie mailem i znika z pamięci.
 */

const MIN_CZAS_MS = 3000; // wypełnione szybciej niż w 3 s = automat (sprawdzamy tylko, gdy JS przysłał znacznik)
const MAX_CZAS_MS = 1000 * 60 * 60 * 2; // formularz otwarty dłużej niż dwie godziny
const OKNO_LIMITU_S = 90; // jedno zgłoszenie na półtorej minuty z jednego adresu IP

const NAGLOWKI = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
};

const czysty = (v, max) => String(v ?? "").replace(/\s+/g, " ").trim().slice(0, max);
const wygladaNaMail = (v) => /^[^\s@,;]+@[^\s@,;.]+\.[a-z]{2,}$/i.test(v);
const maCyfry = (v) => (v.match(/\d/g) || []).length >= 9;

export async function onRequestPost(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const chceJson = (request.headers.get("accept") || "").includes("application/json");

  const odpowiedz = (ok, kod, status) => {
    if (chceJson) return new Response(JSON.stringify({ ok, kod }), { status, headers: NAGLOWKI });
    return new Response(null, {
      status: 303,
      headers: {
        Location: new URL(ok ? "/dziekujemy" : "/nie-wyslano", url).toString(),
        "Cache-Control": "no-store",
      },
    });
  };

  // 1. Żądanie ma pochodzić z naszej strony. Przy zwykłej nawigacji Origin bywa pusty — wtedy nie blokujemy.
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      if (new URL(origin).host !== url.host) return odpowiedz(false, "obce-zrodlo", 403);
    } catch {
      return odpowiedz(false, "obce-zrodlo", 403);
    }
  }

  let pola;
  try {
    pola = await request.formData();
  } catch {
    return odpowiedz(false, "zle-dane", 400);
  }

  // 2. Pułapka. Człowiek tego pola nie widzi, automat wypełnia wszystko jak leci.
  //    Udajemy sukces, żeby nadawca nie dowiedział się, która reguła go zatrzymała.
  if (czysty(pola.get("adres-www"), 200)) return odpowiedz(true, "ok", 200);

  // 3. Czas wypełnienia. Znacznik wstawia JavaScript, więc bez niego tej reguły po prostu nie ma.
  const otwarto = Number(pola.get("otwarto"));
  if (Number.isFinite(otwarto) && otwarto > 0) {
    const ile = Date.now() - otwarto;
    if (ile < MIN_CZAS_MS) return odpowiedz(false, "za-szybko", 400);
    if (ile > MAX_CZAS_MS) return odpowiedz(false, "przeterminowane", 400);
  }

  // 4. Turnstile wchodzi dopiero wtedy, gdy w Pages pojawi się sekret. Dopóki go nie ma,
  //    formularz działa bez JavaScriptu i strona nie dotyka niczyjego urządzenia.
  if (env.TURNSTILE_SECRET_KEY) {
    const token = czysty(pola.get("cf-turnstile-response"), 4096);
    if (!token) return odpowiedz(false, "brak-tokenu", 400);
    const sprawdzenie = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: env.TURNSTILE_SECRET_KEY,
        response: token,
        remoteip: request.headers.get("cf-connecting-ip") || undefined,
      }),
    });
    const wynik = await sprawdzenie.json().catch(() => ({ success: false }));
    if (!wynik.success) return odpowiedz(false, "weryfikacja", 403);
  }

  // 5. Treść. Pole „kontakt” przyjmuje mail albo telefon — nie zmuszamy nikogo do podawania obu.
  const kto = czysty(pola.get("kto"), 120);
  const kontakt = czysty(pola.get("kontakt"), 120);
  const tresc = String(pola.get("tresc") ?? "").trim().slice(0, 2000);

  if (kto.length < 2) return odpowiedz(false, "kto", 400);
  if (!wygladaNaMail(kontakt) && !maCyfry(kontakt)) return odpowiedz(false, "kontakt", 400);
  if (tresc.length < 10) return odpowiedz(false, "tresc", 400);

  // 6. Miękki hamulec na adres IP. Cache jest osobny w każdym centrum danych, więc to nie jest zapora —
  //    zatrzymuje kogoś, kto klika pięć razy, nie rozproszony automat.
  const ip = request.headers.get("cf-connecting-ip") || "brak";
  if (!(await wolno(ip))) return odpowiedz(false, "za-czesto", 429);

  const wiadomosc = [
    "Nowa wiadomość z formularza na klarow.com",
    "",
    `Kto pisze:  ${kto}`,
    `Kontakt:    ${kontakt}`,
    `IP:         ${ip}`,
    "",
    "Treść:",
    tresc,
  ].join("\n");

  const wyslane = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.KONTAKT_OD || "Formularz Klarow <formularz@klarow.com>",
      to: [env.KONTAKT_DO || "kontakt@klarow.com"],
      // Odpowiedź wraca prosto do nadawcy, ale tylko wtedy, gdy podał adres, a nie numer telefonu.
      ...(wygladaNaMail(kontakt) ? { reply_to: kontakt } : {}),
      subject: `Formularz klarow.com — ${kto}`,
      text: wiadomosc,
    }),
  });

  if (!wyslane.ok) {
    console.error("Resend", wyslane.status, await wyslane.text().catch(() => ""));
    return odpowiedz(false, "wysylka", 502);
  }

  return odpowiedz(true, "ok", 200);
}

/** Wejście GET pod ten adres to pomyłka albo skan. Odsyłamy do formularza. */
export function onRequestGet({ request }) {
  return new Response(null, {
    status: 303,
    headers: { Location: new URL("/#kontakt", request.url).toString(), "Cache-Control": "no-store" },
  });
}

/** Limit najtańszym możliwym sposobem: wpis w cache brzegowym. Bez KV, bez ciasteczek, bez bazy. */
async function wolno(ip) {
  try {
    const klucz = new Request(`https://limit.klarow.com/kontakt/${encodeURIComponent(ip)}`);
    const cache = caches.default;
    if (await cache.match(klucz)) return false;
    await cache.put(klucz, new Response("1", { headers: { "Cache-Control": `max-age=${OKNO_LIMITU_S}` } }));
    return true;
  } catch {
    return true; // brak cache (np. lokalnie) nie może blokować wysyłki
  }
}
