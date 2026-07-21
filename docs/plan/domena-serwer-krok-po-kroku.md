# Klarow — domena, serwer i mail KROK PO KROKU (wariant tani)

> Stan na 2026-07-21. Cel: strona żyje pod `https://klarow.com`, mail `kontakt@klarow.com`
> działa, kalendarz umawia spotkania. **Koszt startowy: ~50–60 zł/rok** (sama domena);
> hosting i formularz spotkań w wariancie darmowym. Czas: ~2–3 h łącznie, w tym czekanie na DNS.
>
> Strona jest w 100% statyczna po buildzie (`site/` → `dist/`), więc **nie potrzebujemy
> żadnego VPS-a** — hosting statyczny za 0 zł jest szybszy, bezpieczniejszy i bez utrzymania.
> VPS wróci dopiero przy hostowanym Panelu KPI (moduł M6, fala 3).

---

## KROK 1 — Kupno domeny (founderzy, ~15 min, ~50 zł/rok)

**Rekomendacja: Cloudflare Registrar** — sprzedaje domeny po cenie hurtowej (bez marży,
~10,5 USD/rok za `.com`), prywatność WHOIS gratis, a DNS i hosting będą w tym samym panelu.

1. Wejdź na **dash.cloudflare.com** → załóż darmowe konto (mail founderów, 2FA włączyć od razu).
2. Menu **Domain Registration → Register Domains** → wpisz `klarow.com` → do koszyka → zapłać kartą.
3. (Opcjonalnie, obronnie) `klarow.pl` — Cloudflare nie obsługuje `.pl`; kup w **OVH** albo
   **nazwa.pl** (pierwszy rok często ~20 zł; **uwaga na cenę odnowienia** — sprawdź, zwykle
   60–90 zł/rok). W panelu OVH/nazwa.pl ustaw przekierowanie 301 na `klarow.com` albo
   podepnij te same DNS-y później.

> Plan B, gdyby Cloudflare nie przyjął płatności: **Porkbun** (~11 USD/rok, WHOIS privacy
> gratis) — potem w Porkbun ustawiasz nameservery Cloudflare (krok 2.3).
> **Czego unikać:** promocji „domena za 1 zł" z odnowieniem za 150+ zł i dokupowanych
> „pakietów ochrony" — nic z tego nie jest potrzebne.

## KROK 2 — DNS w Cloudflare (founderzy, ~5 min, 0 zł)

1. Jeśli domena kupiona w Cloudflare — DNS już tam jest, nic nie robisz.
2. W panelu Cloudflare wybierz domenę → zakładka **DNS**. Na razie pusto — rekordy dodadzą
   się w krokach 3 i 4.
3. (Tylko przy zakupie poza Cloudflare) w panelu rejestratora podmień nameservery na te
   wskazane przez Cloudflare przy dodawaniu strony (**Add site → Free plan**).

## KROK 3 — Hosting strony: Cloudflare Pages (founderzy + Claude, ~20 min, 0 zł)

Darmowy plan: nielimitowany transfer, automatyczny HTTPS, deploy z GitHuba po każdym pushu.

1. Panel Cloudflare → **Workers & Pages → Create → Pages → Connect to Git**.
2. Autoryzuj GitHub → wybierz repo **`bibaczebe/Pawel_Karol_proj`**.
3. Ustawienia builda (ważne — strona siedzi w podkatalogu):
   - **Production branch:** `main`
   - **Root directory:** `site`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. **Save and Deploy** → po ~2 min strona działa pod `*.pages.dev`. Sprawdź ją.
5. **Custom domains → Set up a custom domain** → `klarow.com` (i drugi wpis: `www.klarow.com`).
   Cloudflare sam doda rekordy DNS i certyfikat. Po kilku minutach `https://klarow.com` żyje.
6. Odtąd **każdy push na `main` = automatyczny deploy** (plik `site/public/_redirects`
   zapewnia działanie podstron `/moduly/*` — już jest w repo).

> Alternatywa 1:1: **Netlify** (te same ustawienia; darmowy plan ma limit 100 GB transferu —
> dla nas i tak aż nadto). Wybieramy Cloudflare, bo domena i DNS są w tym samym panelu.

## KROK 4 — Mail na domenie (founderzy, ~30 min)

Dwa warianty — zaczynamy od A (0 zł), przechodzimy na B przed startem cold-mailingu:

**Wariant A — odbiór za darmo (Cloudflare Email Routing, 0 zł):**
1. Panel Cloudflare → domena → **Email → Email Routing → Enable**.
2. Utwórz adresy: `kontakt@klarow.com`, `pawel@…`, `karol@…` → przekierowanie na prywatne
   skrzynki founderów. Cloudflare sam doda rekordy MX/SPF.
3. Odbieranie działa od razu. **Ograniczenie:** wysyłka nadal z prywatnego Gmaila —
   wystarcza do odpowiadania na leady ze strony, **nie nadaje się do cold-mailingu**.

**Wariant A+ — wysyłka Z ADRESU FIRMOWEGO za darmo (Gmail „Wyślij jako" + Resend):**
*(wdrożony 2026-07: routing odbiera, a wychodzące maile widnieją jako kontakt@klarow.com)*
1. **resend.com** → konto → **Domains → Add Domain** `klarow.com` → pokazane rekordy
   (DKIM `resend._domainkey`, SPF/MX dla subdomeny `send.klarow.com`) wklej w Cloudflare
   DNS. Nie kolidują z MX Email Routingu (odbiór zostaje w Cloudflare). Poczekaj na
   status **Verified**, utwórz **API key** (Sending access).
2. Gmail → **Ustawienia → Konta i importowanie → Wyślij pocztę jako → Dodaj inny adres**:
   nazwa `Klarow`, adres `kontakt@klarow.com`, „Traktuj jako alias" ✓. SMTP:
   `smtp.resend.com`, port **465 (SSL)**, login `resend`, hasło = **klucz API**.
   Kod weryfikacyjny przyjdzie na kontakt@ (routing → ta sama skrzynka).
3. Ustaw `kontakt@klarow.com` jako **domyślny** + zaznacz „Odpowiedz z adresu, na który
   wysłano wiadomość".
4. DMARC w Cloudflare DNS: TXT `_dmarc` → `v=DMARC1; p=none; rua=mailto:kontakt@klarow.com`
   (po tygodniu bez problemów → `p=quarantine`).
5. Test na mail-tester.com (cel ~10/10; u odbiorcy bez dopisku „przez gmail.com").
6. Drugi founder: reguła routingu `karol@klarow.com` → jego Gmail + powtórka kroku 2.
   Limity darmowego Resend: 3000/mies., 100/dzień — aż nadto do korespondencji;
   masowy outreach = wariant B.

**Wariant B — pełna skrzynka (przed outreachem; ~27–30 zł/użytkownik/mies.):**
1. **Google Workspace Business Starter** (workspace.google.com) → domena `klarow.com` →
   2 konta (Paweł, Karol) + alias grupowy `kontakt@` (grupy są darmowe).
2. Podczas konfiguracji Google poda rekordy: **MX**, **SPF** (`v=spf1 include:_spf.google.com ~all`),
   **DKIM** (klucz z panelu Admin → Apps → Gmail → Authenticate email) — wklej je w
   Cloudflare DNS (usuń wcześniejsze MX z wariantu A).
3. Dodaj **DMARC**: rekord TXT `_dmarc` → `v=DMARC1; p=quarantine; rua=mailto:kontakt@klarow.com`.
4. Test: wyślij mail na `check-auth@verifier.port25.com` albo użyj mail-tester.com —
   SPF/DKIM/DMARC muszą świecić na zielono, inaczej cold maile pójdą do spamu.

> Tańsza alternatywa B: **Zoho Mail Lite** (~1 €/user/mies.) — OK na budżet, ale gorsza
> dostarczalność i brak ekosystemu Kalendarza pod Cal.com. Na 2 osoby różnica ~50 zł/mies. —
> rekomendacja: Google Workspace, gdy zaczyna się sprzedaż.

## KROK 5 — Prawdziwa rezerwacja spotkań: Cal.com (founderzy + Claude, ~20 min, 0 zł)

1. Załóż konto na **cal.com** (darmowy plan wystarcza) na mail z kroku 4.
2. Podepnij kalendarz Google → utwórz typ spotkania **„Diagnoza automatyzacji — 30 min"**
   (bufor 15 min, godziny 9–16, pn–pt — zgodnie ze stroną).
3. Skopiuj link (np. `cal.com/klarow/diagnoza`) i przekaż w sesji Claude Code:
   **[CLAUDE]** podmieni obecny modal-protezę (mailto) na embed Cal.com w tym samym oknie.

## KROK 6 — Po wdrożeniu (checklist weryfikacyjny)

- [ ] `https://klarow.com` i `https://www.klarow.com` otwierają stronę (kłódka/HTTPS).
- [ ] Podstrona `https://klarow.com/moduly/audyt-jakosci-danych` działa po odświeżeniu (F5).
- [ ] Mail wysłany na `kontakt@klarow.com` dochodzi; odpowiedź wychodzi z domeny (wariant B).
- [ ] mail-tester.com pokazuje ≥9/10 (SPF+DKIM+DMARC).
- [ ] Rezerwacja przez stronę tworzy wydarzenie w kalendarzu obu founderów.
- [ ] Telefon 786 296 426 klikalny z komórki.

## Koszty — podsumowanie

| Pozycja | Koszt |
|---|---|
| Domena `klarow.com` (Cloudflare) | ~45–55 zł / rok |
| (opcjonalnie) `klarow.pl` | ~20 zł pierwszy rok (odnowienie 60–90 zł) |
| Hosting (Cloudflare Pages) | 0 zł |
| Mail — wariant A (routing) | 0 zł |
| Mail — wariant B (Workspace ×2) | ~55–60 zł / mies. |
| Cal.com | 0 zł |
| **Start minimalny** | **~50 zł/rok + 0 zł/mies.** |

## Co dalej (poza zakresem tego kroku)

- **VPS pod narzędzia hostowane** (Panel KPI, fala 3): Hetzner CX22 (~20 zł/mies.) albo
  polski Mikrus — decyzja dopiero przy pierwszym kliencie na M6.
- Analityka (np. darmowy Cloudflare Web Analytics — bez cookies, bez banera) + polityka
  prywatności — po deployu.
