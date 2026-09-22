# Klarow — repo strony klarow.com (v2, od 2026-09-22)

Strona-wizytówka dwuosobowej firmy automatyzacji (Karol i Paweł). Wejście: QR z czarno-białej wizytówki →
telefon → 30–90 s uwagi. Pokazuje **możliwości**, nie realizacje. Pełna koncepcja: `design/koncepcja.md`.

## Kontrakt z hostingiem (nie zmieniać bez powodu)
- Cloudflare Pages, integracja Git: **push na `main` = produkcja od razu**. Brak GitHub Actions.
- Root directory `site`, build `npm run build`, output `dist`. Nieudany build zostawia poprzednią wersję na produkcji.
- Domeny `klarow.com` + `www`. Poczta (Email Routing + Resend) żyje w Cloudflare DNS — nie ruszać.
- `post-bot/` (Cloudflare Worker, deploy osobno), `leadscout/`, `demo/` — niezależne od strony, nie ruszać.
- `docs/plan/*` to archiwum strategii v1, **nie** źródło decyzji o stronie. Stara strona: tag `archiwum/strona-v1`.

## Zasady strony
1. Tylko PL. Zwrot do firmy („Wy”, „Wasze”). **Zero form zależnych od płci** (nie: „dwaj”, „szefowi”, „handlowiec”).
2. **Zero zmyśleń**: każda liczba pochodzi od odwiedzającego (kalkulator) albo ma etykietę „przykład”.
   Bez logo klientów, opinii, liczników, „oszczędziliśmy X zł”, tytułów typu „inżynier”.
3. Obietnice tylko potwierdzone przez obie osoby; niepotwierdzone jako `[do potwierdzenia]` — strażnik blokuje build.
4. Żadnych marek, danych ani projektów stron trzecich jako „naszego dorobku”.
5. **Repo jest publiczne**: żadnych sekretów, danych osobowych, cen ofertowych ani notatek wewnętrznych w commitach.
6. Ruch: strona **nie animuje się sama**. Tło jest nieruchome (żadnej paralaksy, żadnego wideo w v1), a przejścia
   są tylko na interakcję, wyłącznie przez `transform`/`opacity`. Bez scroll-jackingu, smooth-scroll, `scroll-snap`,
   `sticky` (poza dolnym paskiem), `filter`/`blur`/`backdrop-filter` na dużych warstwach. `prefers-reduced-motion` respektujemy.
7. Media w `site/public/media/` mają wersję w nazwie (`hero-m.v1.h264.mp4`) i są `immutable` — nigdy nie nadpisujemy.
8. Tokeny kolorów i fontów tylko z `site/src/styles/tokens.css` (nazwy 1:1 z briefu Claude Design).
9. Treść PL w jednym miejscu: `site/src/content/strona.ts`.

## Proces
- Prompty (Higgsfield, Claude Design) są wersjonowane w `design/prompty/`. Hand-offy z Claude Design: `design/handoff-NN/`
  — bierzemy układ i wygląd, nie bierzemy JS, fontów z CDN, stylów inline ani base64.
- Oryginały z Higgsfield: `_mastery/` (poza gitem). Eksport tła: `design/prompty/higgsfield/03-pipeline-ffmpeg.md`, sekcja H.
- Treści czekające na akceptację: `design/tresc/`. Nic stamtąd nie trafia na produkcję bez zgody obu osób.
- Etap jest zamknięty dopiero razem z akcją „do ludzi” (plan: `design/koncepcja.md` §10).

## Środowisko
- Windows 11, Node 24, npm 11, ffmpeg 9 (gyan full). Repo leży w OneDrive (folder przypięty „zawsze na urządzeniu”);
  przy błędach EPERM/EBUSY z `node_modules` przenieść klon do `C:\dev\klarow`.
- Git: `bibaczebe@gmail.com`, `credential.helper=wincred` (PAT w Menedżerze poświadczeń; 401/403 = odnowić PAT).
- Commity po polsku.

## Jak uruchomić (po C1)
```bash
cd site && npm install
npm run dev                 # podgląd lokalny
npm run build               # astro build + scripts/straznik.mjs
npm run preview -- --host   # test z telefonu w tej samej sieci
```
