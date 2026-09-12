---
id: secret-rotate-on-exposure
title: Każda ekspozycja sekretu = rotacja u dostawcy w 24 h, unieważnienie starego, wpis z datą (bez wartości)
impact: BLOCKER
tags: [secrets, rotation, incident, anthropic, telegram, github, onedrive]
source: CLAUDE.md 2026-07-27 (żywy klucz Anthropic w .env appki KSeF — do rotacji) / post-bot/README.md:16-18 / portfolio §6.3 (Klucze API.txt, RAILWAY-VARS-TO-PASTE.env, credentials/ na OneDrive) / leadscout/README.md:14 (BotFather /revoke) / synthesis §5.4.10 (secret-rotate, secret-local-files)
added: 2026-09-12
---

## Zasada

Sekret uznajemy za ujawniony, gdy jego wartość znalazła się w: commicie (nawet cofniętym), transkrypcie
sesji agenta, zrzucie ekranu, wiadomości na czacie/Telegramie/mailu, pliku w folderze synchronizowanym
(OneDrive) poza katalogiem projektu z `.gitignore`, logu Workera, artefakcie, prompcie do narzędzia
zewnętrznego. Procedura, bez wyjątków i w tej kolejności: (1) wygenerować nowy sekret u dostawcy,
(2) podmienić w dozwolonym miejscu (Cloudflare secret / `.env` / Menedżer poświadczeń), (3) unieważnić
stary (Anthropic: usuń klucz w console; Telegram: BotFather `/revoke`; GitHub: usuń PAT w Settings →
Developer settings; Resend: usuń klucz API; Stripe: roll key), (4) usunąć nośnik ekspozycji (plik z OneDrive,
historia gita — `secret-git-history-scan-before-public`), (5) wpis w `docs/DECISIONS.md` / stanie
operacyjnym: co, kiedy, kto zrotował, gdzie była ekspozycja; NIGDY wartość ani jej fragment.
Rejestr integracji §4 utrzymuje listę otwartych rotacji do zamknięcia.

Otwarte na 2026-09-12 (do potwierdzenia przez founderów):
- klucz Anthropic z `.env` appki KSeF (`C:\Users\bibac\OneDrive\KSeF app`) — bot `/post` musi działać na NOWYM kluczu;
- `Desktop/Trading_Bot/Klucze API.txt` — klucze giełdowe/API w folderze OneDrive: przenieść do menedżera haseł, zrotować, usunąć plik;
- `Zabawa Code/RAILWAY-VARS-TO-PASTE.env`, `PROMO_CODES.txt`, `_server_local.log`, `*.db` — j.w. (Railway, Stripe LIVE, Resend, Telegram);
- `Reseling_App/loot-alert-mobile/credentials/`, `credentials.json` — j.w.

## Mechanizm awarii (dlaczego)

Klucze API skanowane są automatycznie: token wypchnięty do publicznego repo bywa użyty w kilka minut,
a rachunek za cudze wywołania idzie na kartę Klarow (klucz Anthropic ma limit wydatków tylko, jeśli
został ustawiony). Token bota Telegram pozwala pisać do founderów jako `@Klarow_BOT` (phishing w kanale,
któremu ufają) i czytać digesty z leadami. PAT GitHuba daje zapis do repo z całą stroną (podmiana buildu
na Cloudflare Pages przez commit). OneDrive replikuje pliki na każde zalogowane urządzenie i do kosza
z retencją, więc „usunąłem plik" nie kończy ekspozycji; podobnie „klucz jest stary, nikt go nie widział"
to założenie, którego nie da się zweryfikować. Koszt rotacji to 5 minut; koszt braku rotacji jest
nieograniczony i spada na JDG Pawła.

## Niepoprawnie

```text
# „naprawa" bez rotacji
git rm --cached leadscout/.env && git commit -m "usuwam .env"      # wartość zostaje w historii
del "Desktop\Trading_Bot\Klucze API.txt"                             # kopia w koszu OneDrive i na drugim urządzeniu
# wpis w dokumentacji z wartością „dla porządku"
docs/DECISIONS.md: „Stary klucz sk-ant-… zastąpiony nowym sk-ant-…"
```

## Poprawnie

```text
1. console.anthropic.com → API keys → Create key (nazwa: klarow-post-bot-2026-09) → wrangler secret put ANTHROPIC_API_KEY
2. console.anthropic.com → stary klucz → Delete; ustawić monthly spend limit
3. C:\Users\bibac\OneDrive\KSeF app\.env → usunąć linię z kluczem (edycja ręczna przez foundera, nie przez agenta)
4. docs/DECISIONS.md:
   | 2026-09-1x | Rotacja klucza Anthropic (ekspozycja: .env appki KSeF, odnotowana 2026-07-27) | Karol | nowy klucz tylko w CF secrets |
5. rejestr integracji §4 poz. 1 → „zamknięte 2026-09-1x"
```
Telegram: BotFather → `/revoke` → nowy token → `leadscout/.env` (ręcznie) + `wrangler secret put TELEGRAM_BOT_TOKEN`
→ ponownie `setWebhook` z `WEBHOOK_SECRET` (README post-bot).

## Test

```bash
S=".claude/skills/klarow-guardian/scripts/check-secrets.mjs"
node "$S" --history --quiet            # Σ BLOCKER 0 — brak wartości w całej historii gita
node "$S" --all --dist --quiet         # Σ BLOCKER 0 — brak wartości w drzewie i buildzie
# otwarte rotacje w rejestrze: każda pozycja §4 ma status „zamknięte <data>" albo jest na liście do decyzji
grep -nE "Rotacja|rotacj" docs/DECISIONS.md 2>/dev/null || echo "brak wpisu o rotacji w DECISIONS.md — pozycja otwarta"
# pliki z kluczami poza projektem (raport, nie auto-fix; nazwy plików, nie treść)
ls "C:/Users/bibac/OneDrive/Desktop/Trading_Bot/Klucze API.txt" "C:/Users/bibac/OneDrive/Desktop/Zabawa Code/RAILWAY-VARS-TO-PASTE.env" 2>/dev/null && echo "OTWARTE: pliki z kluczami na OneDrive"
# webhook Telegrama po rotacji (nazwy, bez wartości): pending_update_count niskie, url = Worker
echo 'curl "https://api.telegram.org/bot<TOKEN>/getWebhookInfo"  # wykonuje founder z wartością z .env'
```

## Wyjątki

Identyfikatory publiczne (token beacona CF Web Analytics, publiczny `chat_id` kanału, jeśli kiedyś powstanie
kanał publiczny) nie wymagają rotacji. Sekrety klientów w ich instalacjach (token KSeF, klucz GUS) rotuje
klient wg własnej procedury; Klarow nigdy ich nie przechowuje, więc nie ma czego rotować po naszej stronie.
