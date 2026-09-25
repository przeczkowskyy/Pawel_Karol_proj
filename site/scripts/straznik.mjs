/**
 * Strażnik: ostatnia bramka przed produkcją.
 *
 * Push na main idzie od razu na klarow.com, więc build MUSI paść, jeśli w dist jest coś,
 * czego nie chcemy pokazać. Nieudany build na Cloudflare zostawia poprzednią wersję strony.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { join } from "node:path";

const DIST = "dist";
const bledy = [];

const pliki = (kat) =>
  readdirSync(kat).flatMap((n) => {
    const p = join(kat, n);
    return statSync(p).isDirectory() ? pliki(p) : [p];
  });

const html = pliki(DIST).filter((p) => p.endsWith(".html"));
const tresc = Object.fromEntries(html.map((p) => [p, readFileSync(p, "utf8")]));

// 1. Nic niedokończonego na produkcji.
const zakazane = [/TODO/i, /lorem ipsum/i, /\[do potw/i, /\[nazwisko/i, /\[rola/i, /\bwkrótce\b/i];
for (const [plik, s] of Object.entries(tresc)) {
  for (const wzor of zakazane) {
    if (wzor.test(s)) bledy.push(`${plik}: znaleziono ${wzor}`);
  }
}

// 2. Formy zależne od płci — strona zwraca się do firmy, nie do mężczyzny.
for (const [plik, s] of Object.entries(tresc)) {
  const m = s.match(/\b(dwaj|we dwóch|obaj|szefowi|handlowiec)\b/i);
  if (m) bledy.push(`${plik}: forma zależna od płci „${m[0]}”`);
}

// 3. Telefon musi być na każdej stronie — to jedyny powód istnienia tej wizytówki.
for (const [plik, s] of Object.entries(tresc)) {
  if (!s.includes("tel:+48786296426")) bledy.push(`${plik}: brak numeru telefonu`);
}

// 4. /start istnieje, jest noindex i NIE MA canonicala.
// Google odradza łączenie noindex z rel=canonical — sygnały są sprzeczne.
const start = tresc[join(DIST, "start.html")];
if (!start) bledy.push("brak dist/start.html — adres z kodu QR przestałby działać");
else {
  if (!start.includes('name="robots" content="noindex')) bledy.push("dist/start.html: brak noindex");
  if (start.includes('rel="canonical"'))
    bledy.push("dist/start.html: ma canonical — razem z noindex to sprzeczne sygnały");
}

// 5. Stare adresy dalej przekierowują.
const red = readFileSync(join(DIST, "_redirects"), "utf8");
for (const sciezka of ["/oferta", "/faq", "/realizacje", "/narzedzia", "/narzedzia/*", "/rodo"]) {
  if (!red.split("\n").some((l) => l.trim().startsWith(`${sciezka} `)))
    bledy.push(`_redirects: brak reguły dla ${sciezka}`);
}

// 6. Canonical nigdy z końcówką .html (build.format 'file' kusi, żeby brać go z Astro.url).
for (const [plik, s] of Object.entries(tresc)) {
  if (/rel="canonical" href="[^"]*\.html"/.test(s)) bledy.push(`${plik}: canonical z końcówką .html`);
}

// 6b. Każdy adres w sitemapie ma przekierowanie z ukośnika — Cloudflare go nie normalizuje.
for (const linia of readFileSync(join(DIST, "sitemap.xml"), "utf8").matchAll(/<loc>https:\/\/klarow\.com(\/[^<]*)<\/loc>/g)) {
  const sciezka = linia[1];
  if (sciezka === "/") continue;
  if (!red.split("\n").some((l) => l.trim().startsWith(`${sciezka}/ `)))
    bledy.push(`_redirects: brak reguły dla ${sciezka}/ (wariant z ukośnikiem)`);
}

// 6c. _routes.json ogranicza funkcje do /api/*. Bez tego pliku Cloudflare generuje własny,
// a funkcje mogą przejąć ruch, dla którego _redirects i _headers już nie obowiązują.
const sfunkcje = (() => {
  try {
    return readdirSync("functions", { recursive: true }).some((n) => String(n).endsWith(".js"));
  } catch {
    return false; // brak katalogu functions to normalny stan, nie błąd
  }
})();
if (sfunkcje) {
  let trasy;
  try {
    trasy = JSON.parse(readFileSync(join(DIST, "_routes.json"), "utf8"));
  } catch {
    bledy.push("dist/_routes.json: brak pliku, a w functions/ są funkcje — ruch statyczny pójdzie przez Workera");
  }
  if (trasy && !(trasy.include ?? []).every((w) => w.startsWith("/api/"))) {
    bledy.push(`dist/_routes.json: include wychodzi poza /api/* (${JSON.stringify(trasy.include)})`);
  }
}

// 7. Nazwa marki w tytule — sygnał encji dla wyszukiwarek i asystentów.
for (const [plik, s] of Object.entries(tresc)) {
  const t = s.match(/<title>([^<]*)<\/title>/)?.[1] ?? "";
  if (!t.includes("Klarow")) bledy.push(`${plik}: tytuł bez nazwy „Klarow" (${t || "brak title"})`);
}

// 8. Waga zimnego wejścia. Push na main to produkcja, więc budżet pilnuje build, nie dobra wola.
const gz = (buf) => gzipSync(buf, { level: 9 }).length;
const waga = (p) => statSync(p).size;
const css = readdirSync(join(DIST, "_astro"))
  .filter((n) => n.endsWith(".css"))
  .reduce((suma, n) => suma + gz(readFileSync(join(DIST, "_astro", n))), 0);
const fonty = readdirSync(join(DIST, "_astro"))
  .filter((n) => n.endsWith(".woff2") && /latin(-ext)?-/.test(n))
  .reduce((suma, n) => suma + waga(join(DIST, "_astro", n)), 0);
const tlo = {
  mobile: waga(join(DIST, "media", "tlo-m-kafel.v2.webp")),
  desktop: waga(join(DIST, "media", "tlo-d-kafel.v2.webp")),
};
const BUDZET = 250 * 1024;
for (const [plik, s] of Object.entries(tresc)) {
  for (const [gdzie, obraz] of Object.entries(tlo)) {
    const suma = gz(Buffer.from(s)) + css + fonty + obraz;
    if (suma > BUDZET)
      bledy.push(
        `${plik} (${gdzie}): zimne wejście ${Math.round(suma / 1024)} KB > ${BUDZET / 1024} KB`,
      );
  }
}

if (bledy.length) {
  console.error("\nSTRAŻNIK ZATRZYMAŁ BUILD:\n" + bledy.map((b) => `  · ${b}`).join("\n") + "\n");
  process.exit(1);
}
console.log(`Strażnik: ${html.length} stron sprawdzonych, wszystko na miejscu.`);
