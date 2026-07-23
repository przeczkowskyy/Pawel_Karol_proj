# Lead-Scout — agent pozyskiwania leadów Klarow

Agent researchowy uruchamiany w Claude Code: szuka firm pasujących do ICP Klarow
(produkcja / budownictwo / dystrybucja, 20–250 osób, PL + USA), weryfikuje je,
ocenia 0–10, zapisuje do bazy i wysyła skrót na Telegram founderów (@Klarow_BOT).

## Konfiguracja jednorazowa

1. **Telegram:** otwórz [t.me/Klarow_BOT](https://t.me/Klarow_BOT), kliknij **Start**
   i wyślij dowolną wiadomość (np. „start"). Bez tego bot nie zna Twojego chat_id
   i nie może NIC wysłać (boty Telegrama nie mogą pisać pierwsze).
2. **Token:** plik `leadscout/.env` z linią `TELEGRAM_BOT_TOKEN=…` (wzór:
   `.env.example`). Plik jest w `.gitignore` — token nigdy nie trafia do repo.
   Gdyby token wyciekł: BotFather → `/revoke` → nowy token → podmień w `.env`.
3. **Test:** `node leadscout/notify.mjs --test` — pierwsza próba wykrywa i zapisuje
   chat_id (`leadscout/.chat_id`), na telefon przychodzi wiadomość testowa.

Uwaga środowiskowa: w tym repo `npx` nie działa (znak `&` w ścieżce) — wszystko
wywołujemy przez `node` wprost.

## Uruchamianie

- **Jedna runda:** w Claude Code wpisz `/lead-scout` — agent wykona playbook ze
  skilla `.claude/skills/lead-scout/SKILL.md` (research → weryfikacja → scoring →
  zapis → digest na Telegram → commit).
- **Cyklicznie:** `/loop 1d /lead-scout` w otwartej sesji Claude Code (runda raz
  dziennie), albo ręcznie 2–3 razy w tygodniu — częściej nie ma sensu, bo sygnały
  (ogłoszenia o pracę, zmiany w KRS) nie zmieniają się z godziny na godzinę.
- Digest można wysłać ręcznie: `node leadscout/notify.mjs --file leadscout/digesty/digest-….md`

## Pliki

| Plik | Rola |
|---|---|
| `leads.json` | Baza wszystkich znalezionych firm (dedupe, statusy `nowy→wyslany→kontakt→rozmowa/odrzucony`) |
| `digesty/digest-RRRR-MM-DD.md` | Skróty rund — to, co poszło na Telegram |
| `nastepne-rundy.md` | Kolejka tematów na kolejne rundy researchu |
| `zrodla.md` | Przewodnik po źródłach leadów PL/US (z researchu 2026-07-23) |
| `playbook-outbound.md` | Rytm 20 kontaktów/tydz., triggery, szablony wiadomości |
| `notify.mjs` | Wysyłka na Telegram (`--test`, `--file`, tekst) |
| `.env` / `.chat_id` | Sekrety lokalne — poza gitem |
