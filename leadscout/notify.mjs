#!/usr/bin/env node
// Wysyłka powiadomień Lead-Scout na Telegram (bot @Klarow_BOT).
//
// Użycie (PowerShell, z katalogu głównego repo):
//   node leadscout/notify.mjs --test                     wiadomość testowa
//   node leadscout/notify.mjs --file sciezka/do/pliku.md wyślij zawartość pliku
//   node leadscout/notify.mjs "dowolny tekst"            wyślij tekst
//
// Token bota czytany z leadscout/.env (TELEGRAM_BOT_TOKEN=...).
// chat_id wykrywany AUTOMATYCZNIE z getUpdates — warunek: ktoś musiał
// wcześniej napisać cokolwiek do bota (t.me/Klarow_BOT → Start).
// Wykryty chat_id zapamiętywany w leadscout/.chat_id (gitignorowane).

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const DIR = dirname(fileURLToPath(import.meta.url));

function readEnv() {
  const p = join(DIR, ".env");
  if (!existsSync(p)) {
    console.error("Brak pliku leadscout/.env — skopiuj .env.example i wpisz token bota.");
    process.exit(1);
  }
  const out = {};
  for (const line of readFileSync(p, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/);
    if (m) out[m[1]] = m[2];
  }
  return out;
}

const TOKEN = readEnv().TELEGRAM_BOT_TOKEN;
if (!TOKEN) {
  console.error("W leadscout/.env brakuje TELEGRAM_BOT_TOKEN.");
  process.exit(1);
}
const API = `https://api.telegram.org/bot${TOKEN}`;

async function api(method, body) {
  const res = await fetch(`${API}/${method}`, {
    method: body ? "POST" : "GET",
    headers: body ? { "content-type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  return res.json();
}

async function chatId() {
  const cache = join(DIR, ".chat_id");
  if (existsSync(cache)) return readFileSync(cache, "utf8").trim();
  const r = await api("getUpdates");
  const msgs = (r.result || [])
    .map((u) => u.message || u.edited_message || u.channel_post)
    .filter(Boolean);
  const last = msgs[msgs.length - 1];
  if (!last) {
    console.error(
      "Nie znam jeszcze chat_id. Otwórz t.me/Klarow_BOT, kliknij Start i wyślij\n" +
        "dowolną wiadomość (np. 'start'), potem uruchom ten skrypt ponownie."
    );
    process.exit(1);
  }
  writeFileSync(cache, String(last.chat.id));
  console.log(`Wykryty chat_id: ${last.chat.id} (zapisany w leadscout/.chat_id)`);
  return String(last.chat.id);
}

async function send(text) {
  const id = await chatId();
  // Telegram: limit 4096 znaków na wiadomość — tniemy po liniach.
  const parts = [];
  let cur = "";
  for (const line of text.split("\n")) {
    if (cur.length + line.length + 1 > 3900) {
      parts.push(cur);
      cur = "";
    }
    cur += (cur ? "\n" : "") + line;
  }
  if (cur.trim()) parts.push(cur);
  for (const part of parts) {
    const r = await api("sendMessage", {
      chat_id: id,
      text: part,
      disable_web_page_preview: true,
    });
    if (!r.ok) {
      console.error("Błąd Telegrama:", r.description);
      process.exit(1);
    }
  }
  console.log(`Wysłano na Telegram (${parts.length} wiadomości).`);
}

const args = process.argv.slice(2);
if (args[0] === "--test") {
  await send("Klarow Lead-Scout działa. Powiadomienia będą przychodzić tutaj.");
} else if (args[0] === "--file") {
  if (!args[1] || !existsSync(args[1])) {
    console.error("Podaj istniejący plik: node leadscout/notify.mjs --file sciezka.md");
    process.exit(1);
  }
  await send(readFileSync(args[1], "utf8"));
} else if (args.length) {
  await send(args.join(" "));
} else {
  console.error('Użycie: node leadscout/notify.mjs --test | --file plik.md | "tekst"');
  process.exit(1);
}
