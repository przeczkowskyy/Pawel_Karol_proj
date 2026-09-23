/**
 * Strażnik: ostatnia bramka przed produkcją.
 *
 * Push na main idzie od razu na klarow.com, więc build MUSI paść, jeśli w dist jest coś,
 * czego nie chcemy pokazać. Nieudany build na Cloudflare zostawia poprzednią wersję strony.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
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

// 4. /start istnieje i wskazuje canonical na stronę główną (wejścia z QR).
const start = tresc[join(DIST, "start.html")];
if (!start) bledy.push("brak dist/start.html — adres z kodu QR przestałby działać");
else if (!start.includes('rel="canonical" href="https://klarow.com/"'))
  bledy.push("dist/start.html: canonical nie wskazuje na stronę główną");

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

if (bledy.length) {
  console.error("\nSTRAŻNIK ZATRZYMAŁ BUILD:\n" + bledy.map((b) => `  · ${b}`).join("\n") + "\n");
  process.exit(1);
}
console.log(`Strażnik: ${html.length} stron sprawdzonych, wszystko na miejscu.`);
