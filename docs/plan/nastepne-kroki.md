# Klarow — ścieżka następnych kroków (operacyjnie)

> Stan na 2026-07-21. Kolejność = priorytet. „MY" = founderzy (decyzje, zakupy, treść),
> „CLAUDE" = do zrobienia w sesji Claude Code. Plan strategiczny: `plan-strategiczny.md`.

## Faza A — fundament formalny (blokuje resztę)

1. **[MY] Kupno domeny `klarow.com`** (+ rozważyć `klarow.pl` obronnie).
   Rejestrator z dobrym DNS (np. Cloudflare Registrar / OVH / nazwa.pl). Przy okazji szybki
   test znaku towarowego (UPRP/EUIPO — wyszukiwarka „Klarow"). **To odblokowuje maila,
   hosting i prawdziwą rezerwację spotkań.**
2. **[MY] Umowa/zgoda Nuconic** — licencja na wzorce + zgoda na case study (imienna lub
   anonimowa). Wg planu strategicznego (§5.2) to **warunek startu sprzedaży** — nic
   publicznego z liczbami Nuconic bez podpisu.
3. **[MY] Forma działalności** — decyzja: sp. z o.o. od razu vs JDG jednego z founderów na
   pierwsze sprinty. Potrzebna do: konta firmowego, faktur, umowy sprintu, OC zawodowego.

## Faza B — infrastruktura komunikacji (po domenie; ~1 dzień)

4. **[MY] Poczta na domenie** — Google Workspace lub Microsoft 365:
   `kontakt@klarow.com` (alias wspólny) + skrzynki imienne. Koniecznie SPF + DKIM + DMARC
   (inaczej cold mail ląduje w spamie). Adres `kontakt@` jest już wpięty w stronę.
5. **[MY+CLAUDE] Rezerwacja spotkań** — konto Cal.com (darmowe) podpięte do kalendarza
   founderów → [CLAUDE] podmiana modala „Umów diagnozę" na embed Cal.com (obecny kalendarz
   mailto to świadoma proteza).
6. **[CLAUDE] Deploy strony** — `npm run build` → hosting statyczny (Cloudflare Pages /
   Netlify; darmowe, HTTPS, SPA-fallback dla `/moduly/*`) → DNS `klarow.com`.
   Po deployu: telefon i mail przetestować z telefonu.

## Faza C — treść i dowód (równolegle z B)

7. **[MY] Rebrand istniejących narzędzi na Klarow UI** — w nowym oknie Claude Code, per
   narzędzie: skopiować `ui-kit/skills/company-ui/` do `<projekt>/.claude/skills/company-ui/`
   i poprosić: *„Przebuduj UI zgodnie ze skillem company-ui — zero własnych wariantów"*.
   Z przemalowanych narzędzi zrobić **realne zrzuty ekranu**.
8. **[MY→CLAUDE] Zrzuty + opisy modułów** — podmiana `site/public/screens/placeholder.svg`
   na realne zrzuty (1 plik na moduł), uzupełnienie podstron: szczegółowy opis, liczby
   oszczędności, mini-case. Wersje PL i EN (struktura już czeka).
9. **[MY] Case study PL/EN** z 3–4 twardymi liczbami (po zgodzie z pkt 2) — sekcja „Dowód"
   + PDF do outreachu.
10. **[CLAUDE] Żywe przykłady narzędzi** — interaktywne demo (jak `demo/` M2) osadzone na
    podstronach modułów; dane fikcyjne, jawnie oznaczone.
11. **[CLAUDE] SEO + porządki** — meta/OG per strona, sitemap, favicon (wordmark),
    polityka prywatności (przed analityką/formularzami), migracja treści do YAML
    (`site/content/` — model content-driven z planu) i docelowo trasy `/pl/` `/en/`
    build-time zamiast przełącznika.

## Faza D — start sprzedaży (wg planu §2.4; po pkt 1–2)

12. **[MY]** Profile LinkedIn obu founderów pod Klarow (nagłówek = hook + dla kogo).
13. **[MY]** Lista 100 firm-celów (produkcja/budownictwo 50–250 osób) + rytm
    **20 wiadomości wychodzących/tydzień** (KPI nienegocjowalne).
14. **[MY]** 2 rozmowy zwiadowcze z biurami rachunkowymi (kanał partnerski).
15. **[MY]** Poduszka: wzór umowy sprintu (zamrożenie zakresu, 50/50, licencja wieczysta,
    kod u klienta) — do kancelarii razem z umową Nuconic.

## Ryzyka do pilnowania

- Domena niekupiona = martwy mail `kontakt@klarow.com` na stronie — **pkt 1 jest pilny**.
- Publiczne liczby Nuconic przed umową IP = ryzyko prawne (pkt 2 przed 9/13).
- Strona bez deployu nie zbiera leadów — B6 zaraz po B4/B5.
