# Rejestr integracji zewnętrznych — Klarow (strona, boty, narzędzia dev, portfolio)

> Jedno źródło prawdy o KAŻDYM połączeniu repo z aplikacją/usługą spoza `klarow.com`.
> Zasada nadrzędna: **„zero chmury dostawcy"** (decyzja founderów 2026-07-22, przeformułowanie
> `strategy.md` T4/D4): narzędzia budowane dla klientów nie łączą się z API modeli językowych ani
> z serwerami Klarow; dane klienta trafiają wyłącznie do systemów, które klient sam wskaże (np. KSeF).
> Strona: **zero skryptów zewnętrznych bez (1) wpisu w tym rejestrze, (2) sekcji w `/rodo`, (3) decyzji founderów**.
> Nowe połączenie = wpis w OBU tabelach **PRZED** kodem (`rules/integ-registry-required.md`).
> Skaner: `node ".claude/skills/klarow-guardian/scripts/find-integrations.mjs" [--strict] [--dist]`.
> Wartości sekretów NIGDY tu nie trafiają — tylko NAZWY zmiennych i miejsce przechowywania.
>
> Wszystkie trzy warunki są egzekwowane mechanicznie, nie tylko warunek (1):
> (1) brak wpisu → HIGH `integ-registry-required`; (3) wpis ze statusem `planowana` (= decyzja founderów
> jeszcze nie zapadła) użyty w kodzie → HIGH `integ-embed-requires-privacy`; (2) wpis z „wpis w /rodo? = TAK",
> którego hosta nie ma w `site/dist/rodo.html` i w `Content-Security-Policy` w `site/public/_headers`
> → HIGH `integ-embed-requires-privacy` (MEDIUM, gdy brak zbudowanego `dist` — dowodu nie da się sprawdzić).

Legenda kolumn:
- **typ**: `build-time` (biblioteka w bundlu, zero requestów w runtime) · `runtime-self-hosted` (działa w przeglądarce użytkownika, dane nie opuszczają `klarow.com`) · `runtime-external` (request do obcego hosta w runtime) · `dev-tool` (narzędzie developerskie poza stroną) · `MCP` (serwer MCP w Claude Code) · `API-serwer` (API dostawcy wołane z serwera/skryptu) · `portfolio` (integracja w produkcie POZA tym repo — na stronie tylko treść)
- **status**: `aktywna` · `planowana` · `zakazana` · `portfolio (poza repo)` · `dev`
- **decyzja founderów?**: czy wdrożenie/zmiana wymaga wpisu w `docs/DECISIONS.md` (D-xx = numer decyzji z `synthesis.md` §4)
- **wpis w /rodo?**: czy usługa musi być opisana na `/rodo` (odbiorca danych, cel, cookies, transfer poza EOG)

## 1. Tabela główna

| id | usługa | typ | gdzie w kodzie (plik:linia) | dane, które wychodzą | sekret (nazwa · gdzie przechowywany) | status | decyzja founderów? | wpis w /rodo? |
|---|---|---|---|---|---|---|---|---|
| `self-klarow` | Własna domena `klarow.com`: canonical, OG, sitemap, robots, JSON-LD, llms.txt | runtime-self-hosted | `site/src/components/Seo.tsx:8`, `site/src/prerender/entry.tsx:18`, `site/index.html:18-20`, `site/public/robots.txt:4`, `site/scripts/prerender.mjs:40` | nic (adresy własne) | brak | aktywna | NIE | NIE |
| `cf-pages` | Cloudflare Pages: hosting + CI (`npm run build`), `_headers` (cache), `_redirects` (SPA fallback, aliasy 301) | runtime-external (hosting własnych plików; brzeg CF) | `site/public/_headers:7-14`, `site/public/_redirects:1`, `site/package.json:8` | logi brzegowe Cloudflare: IP, UA, URL, kraj (Cloudflare Inc. jako procesor; DPA w ramach konta) | brak w repo (deploy przez integrację GitHub w dashboardzie CF; konto CF poza repo) | aktywna | NIE | TAK (hosting = odbiorca danych technicznych; „logi serwera") |
| `cf-web-analytics` | Cloudflare Web Analytics (cookieless, bez banera) | runtime-external (skrypt zewnętrzny `static.cloudflareinsights.com/beacon.min.js`) | brak kodu; plan: snippet w `site/index.html` (wspólny szablon wszystkich prerenderowanych HTML — `site/scripts/prerender.mjs:21`) | URL, referrer, UA, Core Web Vitals; bez cookies, bez PII | token beacona = identyfikator publiczny (nie sekret); konfiguracja w dashboardzie CF | planowana (D-16 a) | TAK — D-16 (przyjęta w `synthesis.md` §4); wdrożenie dopiero PO `/rodo` | TAK (odbiorca: Cloudflare; „pomiar bez cookies") |
| `cf-zaraz` | Cloudflare Zaraz (zdarzenia CTA) ALBO Pages Function `functions/api/e.ts` → Workers Analytics Engine | runtime-external (Zaraz ładuje się z własnej domeny `/cdn-cgi/zaraz/`; dane idą do CF) | brak kodu; plan: `zaraz.track("cta_book_open")` itd. w komponentach CTA (`synthesis.md` §2.8 p.8) | nazwa zdarzenia + trasa; zero PII; zero zdarzeń w silnikach dem (determinizm) | brak (konfiguracja w dashboardzie CF) | planowana (D-16; luka L3: czy CF WA ma zdarzenia niestandardowe) | TAK (Zaraz vs Pages Function) | TAK (zdarzenia analityczne; bez cookies) |
| `mailto-kontakt` | E-mail `kontakt@klarow.com` — link `mailto:` z tematem i treścią z modala rezerwacji | runtime-self-hosted (link otwiera klienta poczty użytkownika) | `site/src/App.tsx:685`, `site/src/components/BookingModal.tsx:12,126-129`, `site/src/prerender/entry.tsx:19,85` | nic ze strony; użytkownik sam wysyła e-mail (dane kontaktowe + wybrany termin) | brak | aktywna | NIE | TAK (kontakt e-mail: cel, podstawa art. 6 ust. 1 lit. b/f RODO, okres przechowywania) |
| `tel-kontakt` | Telefon `+48 786 296 426` — link `tel:` | runtime-self-hosted (link) | `site/src/components/BookingModal.tsx:10-11,224`, `site/src/prerender/entry.tsx:20-21,87`, JSON-LD `site/src/components/Seo.tsx:76` | nic ze strony | brak | aktywna | NIE | TAK (kontakt telefoniczny) |
| `calcom` | Cal.com — rezerwacja „Diagnoza automatyzacji: 30 min" | faza 1: runtime-external jako LINK (0 skryptów); faza 2: runtime-external jako EMBED (`app.cal.com/embed/embed.js` + iframe) | brak kodu; komentarz `site/src/components/BookingModal.tsx:6-8`; plan `docs/plan/domena-serwer-krok-po-kroku.md:102-108` | link: nic ze strony (użytkownik podaje imię, e-mail, termin już na cal.com); embed: iframe na `klarow.com` → IP/UA do Cal.com + cookies Cal.com | brak w repo (konto Cal.com founderów; do linku/embedu klucz API niepotrzebny) | planowana (D-15: (a) link w fazie 1, (b) embed w fazie 2) | TAK — D-15; embed dodatkowo: CSP w `_headers` + sekcja w `/rodo` PRZED wdrożeniem (`rules/integ-embed-requires-privacy.md`) | TAK (Cal.com jako odbiorca/procesor danych rezerwacji; przy embedzie także informacja o cookies) |
| `fonts-selfhosted` | Nunito Sans (variable) — fonty self-hosted | runtime-self-hosted | `site/src/styles/company-ui.css:7-16` → `site/public/fonts/NunitoSans-var-latin{,-ext}.woff2`; cache `site/public/_headers:13-14` | nic (pliki z własnej domeny) | brak | aktywna | NIE | NIE |
| `google-fonts-cdn` | Google Fonts / dowolny CDN fontów | runtime-external | brak (zakaz kitu: `ui-kit/skills/company-ui/SKILL.md` „NO CDN") | IP/UA każdego użytkownika do Google | brak | zakazana | NIE (zakaz stały) | — |
| `cdn-scripts-images` | CDN-y skryptów/obrazów: cdnjs, unpkg, jsDelivr, esm.sh, Tailwind Play, jQuery CDN, picsum, unsplash | runtime-external | brak (0 trafień w `site/dist` — `site-audit.md` §4 p.7) | IP/UA użytkownika do operatora CDN; ryzyko supply-chain | brak | zakazana | NIE (zakaz stały; wyjątek = decyzja founderów + wpis + `/rodo` + CSP) | — |
| `analytics-third-party` | Analityka i trackery spoza rejestru: Google Analytics / Tag Manager (`gtag`), Plausible, Umami, Hotjar, PostHog, Sentry | runtime-external | brak (0 trafień w `site/src` i `site/dist`) | URL, referrer, IP/UA, zdarzenia, zwykle cookies i fingerprint → operator narzędzia | brak | zakazana (jedyny dopuszczony pomiar: `cf-web-analytics` po D-16) | NIE (zakaz stały; zmiana = decyzja founderów + `/rodo` + CSP) | — |
| `three` | three.js — tło GLSL Hills (lazy chunk, tylko desktop, `pointer: fine`) | build-time (biblioteka w bundlu; zero requestów) | `site/src/components/ui/glsl-hills.tsx:2`, `site/src/App.tsx:48-50`; `@react-three/fiber` tylko w martwym `site/src/components/ui/canvas-reveal-effect.tsx:2` | nic | brak | aktywna (`@react-three/fiber` do usunięcia razem z martwym kodem) | NIE (los GLSL Hills: `synthesis.md` §2.6.3) | NIE |
| `pdfmake` | pdfmake + `vfs_fonts` (Roboto) — PDF generowany w przeglądarce | build-time (lazy chunk ~830 KB gz; generowanie i pobranie lokalnie) | `site/src/lib/pdf.ts:26-27`, `site/src/types/pdfmake.d.ts`, `site/src/components/dashboards/PdfButton.tsx` | nic (PDF powstaje w przeglądarce użytkownika) | brak | aktywna (refaktor na `pdfDoc.mjs` = okno c1; font Roboto = decyzja B) | NIE | NIE |
| `react-router` | react-router-dom 7 (BrowserRouter — wymaga `_redirects`) | build-time | `site/src/main.tsx:3,11`, `site/src/App.tsx:2` | nic | brak | aktywna | NIE | NIE |
| `npm-build-deps` | Pozostałe zależności bundlowane i devDependencies: `react`, `react-dom`, `lucide-react`, `@formkit/auto-animate`, `tailwindcss`, `@tailwindcss/vite`, `vite`, `@vitejs/plugin-react`, `typescript`, `@types/react`, `@types/react-dom` (martwe: `@radix-ui/react-slot`, `class-variance-authority`, `clsx`, `tailwind-merge`) | build-time | `site/package.json:12-35` | nic w runtime | brak | aktywna (martwe do usunięcia — `code-no-dead-code`) | NIE (nowa zależność = `rules/integ-dependency-audit.md`) | NIE |
| `npm-registry` | Rejestr npm (`registry.npmjs.org`) — instalacja zależności lokalnie i w CI Cloudflare Pages | build-time (poza runtime strony; `npm install` pobiera tarballe i wykonuje `postinstall`) | `site/package.json`, `site/package-lock.json` (pole `resolved`), CI Pages (`npm run build`) | nazwy i wersje pobieranych pakietów + IP maszyny/CI → npm, Inc. (GitHub/Microsoft); w drugą stronę: KOD paczek wykonywany u nas i u klienta (supply chain — `rules/integ-dependency-audit.md`) | brak (rejestr publiczny, zero tokenów; w repo nie ma `.npmrc` z `authToken`) | aktywna | NIE (nowa zależność = bramka `integ-dependency-audit`) | NIE |
| `motion-lib` | motion 13.2.0 — biblioteka ruchu (`m` + `LazyMotion`), planowana w fazie 1 | build-time | brak kodu (`synthesis.md` §2.4.2) | nic (biblioteka bez sieci) | brak | planowana | NIE (budżet KB: `motion-bundle-budget-motion`) | NIE |
| `xml-namespaces` | URL-e kontekstu/schematu, NIE requesty: schema.org (JSON-LD), sitemaps.org (sitemap), w3.org (SVG xmlns) | build-time (stałe tekstowe) | `site/src/components/Seo.tsx:71,85,101`, `site/src/prerender/entry.tsx:434`, `site/public/screens/placeholder.svg:1` | nic | brak | aktywna | NIE | NIE |
| `bundled-lib-strings` | Hosty jako stałe w zbundlowanych bibliotekach (NIE requesty): react.dev / reactrouter.com (linki do opisów błędów), pdfmake: ns.adobe.com, purl.org, aiim.org, tools.ietf.org (namespace'y XMP/PDF-A), github.com | build-time (stałe w `site/dist/assets/*.js`) | skan `--dist` 2026-09-12: `site/dist/assets/index-*.js:2,9,12,39`, `pdfmake-*.js:9,105,116,123,128,231`, `glsl-hills-*.js:1` | nic (DevTools → Network: 0 requestów do tych hostów; potwierdzać po każdym nowym buildzie) | brak | aktywna | NIE | NIE |
| `browser-storage` | `localStorage["klarow-lang"]` (język) i `sessionStorage["kl-cache-heal"]` (samonaprawa cache) | runtime-self-hosted (przeglądarka użytkownika) | `site/src/i18n.tsx:18,28`, `site/index.html:37-38` | nic (nie opuszcza przeglądarki); ZERO cookies | brak | aktywna | NIE | TAK (wzmianka: brak cookies; localStorage = preferencja języka + flaga techniczna) |
| `telegram-bot-api` | Telegram Bot API — bot `@Klarow_BOT` (digesty Lead-Scout; bot `/post`) | runtime-external / API-serwer (POZA `site/`) | `leadscout/notify.mjs:39-47,53,84` (getUpdates, sendMessage), `post-bot/worker.js:199-204` (sendMessage, sendChatAction); README-y | Lead-Scout: treść digestu (nazwy firm, sygnały zakupu, ewentualnie imiona/role osób kontaktowych z `leadscout/leads.json`) → Telegram Messenger Inc. (poza EOG); post-bot: `/post <temat>` + wygenerowane posty; `chat_id` founderów | `TELEGRAM_BOT_TOKEN` · `leadscout/.env` (gitignore, edytowany ręcznie) + sekret Cloudflare Workers (`wrangler secret put`); `leadscout/.chat_id` (gitignore) | aktywna | TAK: potwierdzić zasadę „digest bez danych osób (tylko firmy i sygnały)" ALBO dopisać Telegram do `/rodo` jako odbiorcę | TAK — jeśli digesty zawierają dane osób z leadów: „Telegram" jako odbiorca w klauzuli art. 14; rekomendacja: digest bez nazwisk → wpis zbędny |
| `anthropic-api` | Anthropic Messages API (`claude-opus-5`) — generowanie postów LinkedIn w bocie `/post` | API-serwer (POZA `site/`; serverless) | `post-bot/worker.js:17-19,144-182` | system prompt marki + `/post <temat>` + data; ZERO danych klientów/leadów (zasada w prompcie `post-bot/worker.js:43`); odpowiedź = 3 posty | `ANTHROPIC_API_KEY` · TYLKO sekret Cloudflare Workers (dashboard „Encrypt" / `wrangler secret put`); ŚWIEŻY klucz, nie ten z `.env` appki KSeF (`post-bot/README.md:16-18`) | aktywna (bot); **zakazana w `site/`, `demo/`, `ui-kit/` i w narzędziach dla klientów** (`rules/integ-no-llm-api-in-client-tools.md`) | NIE dla bota; TAK dla jakiegokolwiek użycia poza botem | NIE (narzędzie wewnętrzne bez danych osób; `/post <temat>` nie może zawierać danych osób) |
| `cf-workers` | Cloudflare Workers — hosting bota `/post` (webhook Telegrama, `ctx.waitUntil`) | runtime-external / API-serwer (POZA `site/`) | `post-bot/wrangler.toml:4-6`, `post-bot/worker.js:55-106`, `post-bot/README.md:26-47` | payload webhooka Telegrama (chat_id, tekst komendy) → Worker; logi CF | `WEBHOOK_SECRET`, `ALLOWED_CHAT_ID`, `TELEGRAM_BOT_TOKEN`, `ANTHROPIC_API_KEY` · sekrety CF (nigdy w `wrangler.toml` — `post-bot/wrangler.toml:1-3`) | aktywna (webhook do potwierdzenia w dashboardzie — `portfolio.md` K2) | NIE | NIE |
| `cf-email-routing` | Cloudflare Email Routing — odbiór `kontakt@klarow.com` → prywatny Gmail founderów | runtime-external (poza kodem) | tylko dokumentacja: `CLAUDE.md` (2026-07-21), `docs/plan/domena-serwer-krok-po-kroku.md:62-68` | cała korespondencja przychodząca (dane nadawców) → Cloudflare → Google (Gmail) | brak w repo (panel CF / konto Google) | aktywna | NIE | TAK (odbiorcy korespondencji: Cloudflare, Google; transfer do USA — SCC) |
| `resend-smtp` | Resend SMTP (`smtp.resend.com:465`) — wysyłka jako `kontakt@` przez Gmail „Wyślij jako"; SPF/DKIM/DMARC | runtime-external (poza kodem) | `docs/plan/domena-serwer-krok-po-kroku.md:69-85`; 0 trafień `resend` w kodzie | treść wysyłanych e-maili (odpowiedzi do leadów/klientów) → Resend Inc. (USA) + Google | klucz API Resend = hasło SMTP w ustawieniach Gmail „Wyślij jako" (poza repo); `RESEND_API_KEY` nie występuje w kodzie | aktywna | NIE | TAK (odbiorcy: Resend, Google) |
| `github-remote` | GitHub — `origin https://github.com/przeczkowskyy/Pawel_Karol_proj.git` | dev-tool (repo) | `git remote -v`; `CLAUDE.md` #4; `credential.helper=wincred` (per-repo) | całe źródło repo, w tym `docs/nuconic-ekosystem-referencja.md` i `leadscout/leads.json` (dane leadów) → GitHub | PAT · Menedżer poświadczeń Windows (wpis `git:https://github.com`); NIE w repo | aktywna | TAK: potwierdzić, że repo jest PRYWATNE (luka `synthesis.md` §6; `leads.json` i referencja poprzedniej firmy nie mogą być publiczne — `rules/secret-git-history-scan-before-public.md`) | NIE (o ile repo prywatne) |
| `onedrive-sync` | Microsoft OneDrive — całe repo leży w `C:\Users\…\OneDrive\Desktop\…` i jest synchronizowane do chmury Microsoftu | dev-tool (synchronizacja systemowa, poza kodem) | cała ścieżka repo; cytowana jako `REPO` w `.claude/workflows/ui-audit.js:49` | KAŻDY plik repo, także nieśledzone przez git: `leadscout/leads.json` (dane firm i osób), `leadscout/.env`, `docs/nuconic-ekosystem-referencja.md` → Microsoft; replikacja na każde zalogowane urządzenie + kosz z retencją (`rules/secret-rotate-on-exposure.md`) | brak w repo (konto Microsoft foundera); UWAGA: pliki `.env` też są synchronizowane | aktywna | TAK: czy `leads.json` i materiały poprzedniej firmy mogą leżeć na OneDrive (alternatywa: repo poza katalogiem OneDrive) | TAK — dopóki `leads.json` tam leży: Microsoft jako odbiorca/procesor w klauzuli art. 14 |
| `claude-code-anthropic` | Anthropic API przez samo Claude Code — każda sesja agenta w tym repo | dev-tool / API-serwer (narzędzie pracy founderów; NIE runtime strony) | brak kodu; `CLAUDE.md`, `.claude/**` (skille, agenci, workflow `ui-audit.js`) | treść czytanych plików, ścieżki, prompty i wyjście komend → Anthropic (USA); dlatego `rules/secret-never-read-env.md` zakazuje otwierania `.env`: plik przeczytany = plik wysłany | konto/subskrypcja Claude Code (poza repo; agent nie trzyma klucza w repo) | dev | TAK: zakaz wklejania danych klientów i leadów do sesji (`secret-no-secrets-in-prompts-or-logs`) | NIE (zero danych użytkowników strony; dane osób z leadów nie trafiają do promptów) |
| `claudeai-connectors` | Connectory claude.ai podpięte do sesji: Gmail, Google Drive (obok `higgsfield-mcp`) | MCP (dev-tool; NIE runtime strony) | brak w repo; lista serwerów widoczna w sesji Claude Code; `rules/integ-mcp-allowlist.md` | to, o co agent zapyta: treść maili i plików z Dysku → Anthropic + Google; ryzyko odwrotne: prompt injection z treści maila/dokumentu | OAuth po stronie claude.ai; ZERO kluczy w repo | dev | TAK: czy connectory Gmail/Drive mają być włączone przy pracy nad repo (`integ-data-egress-review`) | NIE |
| `google-search-console` | Google Search Console — pomiar SEO | dev-tool (weryfikacja: rekord TXT w DNS Cloudflare — rekomendowana — albo plik `site/public/google*.html`) | brak kodu; plan `synthesis.md` §2.8 p.8, `CLAUDE.md` „Do zrobienia" | nic od użytkowników strony (GSC pokazuje dane crawlera Google) | konto Google founderów (poza repo) | planowana (D-16) | TAK: kto zakłada property (open question `synthesis.md` §7 p.9) | NIE |
| `higgsfield-mcp` | Higgsfield — MCP „creative engine" (connector claude.ai) do produkcji assetów: stille, pętle wideo, przejścia | MCP (dev-tool; NIE runtime strony) | brak w repo; podpięty w sesji Claude Code jako `claude.ai creative engine`; pipeline `research/higgsfield.md` §4; assety lądują w `site/public/media/` + `SOURCES.md` | prompty + obrazy referencyjne (WYŁĄCZNIE abstrakcje i własne stille) → Higgsfield (USA). ToU 2026-07-26: licencja na trening na inputach/outputach do czasu usunięcia; brak gwarancji IP/oryginalności | logowanie kontem (OAuth przez claude.ai); ZERO kluczy w repo | aktywna (trial 3 dni → plan wg D-08) | TAK: plan/koszt (D-08), akceptacja ToU (`higgsfield.md` §10 p.8), reguła „zero materiałów klientów / poprzedniej firmy / twarzy w Higgsfield" (`rules/integ-data-egress-review.md`) | NIE (nie dotyka użytkowników strony; wygenerowane assety = własne pliki self-hosted) |
| `higgsfield-cloud-api` | Higgsfield Cloud API (`api.higgsfield.ai`, nagłówek `Authorization: Key KEY_ID:KEY_SECRET`, SDK `@higgsfield/client`) | API-serwer (dev-tool) | brak | j.w. | `HIGGSFIELD_KEY_ID` / `HIGGSFIELD_KEY_SECRET` — nie istnieją w repo | zakazana (niepotrzebna: MCP wystarcza; osobne rozliczanie kredytów) | TAK, gdyby ktoś chciał ją włączyć | NIE |
| `motion-mcp` | Motion MCP (hostowany: `https://mcp.motion.dev`; Motion+ `https://mcp.motion.dev/plus` po zalogowaniu) — dokumentacja, przykłady, MotionScore | MCP (dev-tool; opcjonalne) | `.claude/skills/motion/mcp.example.json:4,7` (przykład); `.mcp.json` w repo NIE istnieje | zapytania o dokumentację; Motion+: fragmenty kodu do MotionScore → motion.dev (Framer B.V.); ZERO danych klientów | brak (free: bez tokenu; Motion+: login z ustawień MCP agenta) | planowana / opcjonalna (`motion-dev.md` §6.2, §11 p.5) | TAK: czy `.mcp.json` w repo (hostowane MCP = integracja; `rules/integ-mcp-allowlist.md`) | NIE |
| `manus` | Manus (manus.im) — agent w chmurze; ewentualny research konkurencji na danych publicznych | dev-tool (zewnętrzny SaaS) | brak | wszystko wpisane w prompt/załączniki → Manus (Singapur/USA; szeroka licencja na treści; opt-out z treningu tylko w Team; incydent kasowania danych 08/2026 — `manus.md` §0 p.9, §5.3) | konto (poza repo) | zakazana dla: danych klientów, leadów (`leads.json`), sekretów, materiałów poprzedniej firmy, loginów firmowych; opcjonalna (1 mies. Pro) wyłącznie na danych publicznych po decyzji | TAK (`manus.md` §7 p.4) | NIE |
| `playwright-webkit` | Playwright WebKit (`playwright-core` w scratchpadzie, `executablePath` → `~/AppData/Local/ms-playwright/webkit-2311`) — weryfikacja mobile/prerender | dev-tool (lokalny; jedyny pakiet w repo z `postinstall` pobierającym binarkę) | poza repo (scratchpad; `CLAUDE.md` 2026-07-24) | przy instalacji: pobranie binarki WebKita z CDN dostawcy (Microsoft/Playwright) — egress dev-time i wykonywalny kod z sieci (`integ-dependency-audit` §Wyjątki); w użyciu: nic (ładuje lokalny `site/dist` albo produkcję `klarow.com`) | brak | dev | NIE | NIE |
| `ksef-api-mf` | KSeF 2.0 — API Ministerstwa Finansów (`api-demo.ksef.mf.gov.pl`, `ksef.mf.gov.pl`) | portfolio (produkt Kokpit KSeF w `C:\Users\bibac\OneDrive\KSeF app` — POZA tym repo); w repo tylko TREŚĆ | `site/src/data/tools.ts:636-660`, `site/src/data/toolsSeo.ts:615-663` (opis case) | w produkcie: faktury klienta ↔ MF (on-premise u klienta, read-only); ze strony klarow.com: nic | token KSeF klienta — w instalacji klienta, nigdy u Klarow; `.env` tamtej appki zawierał żywy klucz Anthropic → ROTACJA (`rules/secret-rotate-on-exposure.md`) | portfolio (poza repo) | TAK: relabel badge „WDROŻONE" (`portfolio.md` §8 p.4) + usunąć/doprecyzować „asystent AI" w opisie (`strategy.md` D4) | NIE |
| `gus-bir` | GUS BIR 1.1 (SOAP, `wyszukiwarkaregon.stat.gov.pl`) — lookup kontrahenta po NIP | portfolio (A1 u poprzedniej firmy; poza repo) | `docs/nuconic-ekosystem-referencja.md` (dokument WEWNĘTRZNY) | w produkcie: NIP → dane rejestrowe | klucz GUS klienta (poza repo) | portfolio (poza repo) | TAK: czy nazwy integracji z A1 wolno wymieniać publicznie przed umową IP (`portfolio.md` §8 p.3) | NIE |
| `krs-api` | KRS API (`api-krs.ms.gov.pl`) + rejestr.io | portfolio (A1; poza repo) | j.w. | j.w. | klucz rejestr.io klienta (poza repo) | portfolio (poza repo) | j.w. | NIE |
| `ecb-fx` | Europejski Bank Centralny — kursy walut (`data-api.ecb.europa.eu`) | portfolio (A1; poza repo) | j.w. | kursy (brak danych osobowych) | brak | portfolio (poza repo) | j.w. | NIE |
| `autenti-outlook` | Autenti (podpisy elektroniczne) przez mail-listener Outlook COM | portfolio (A1; poza repo) | j.w. | w produkcie: powiadomienia o podpisach (skrzynka klienta) | konto klienta | portfolio (poza repo) | j.w. | NIE |
| `stripe` | Stripe (płatności) — produkty własne: Football Intelligence (LIVE), LootAlert | portfolio (poza repo) | `research/portfolio.md` P2/P3; brak w tym repo | w produktach: dane płatnicze użytkowników → Stripe | klucze w tamtych repo / Railway (poza tym repo; przegląd `git log -p` przed publikacją) | portfolio (poza repo); zakazana w `site/` | TAK: czy i jak pokazywać FI/LootAlert (`portfolio.md` §8 p.5-6) | NIE |
| `railway-expo-push` | Railway (hosting), Expo Push, Redis/PostgreSQL — produkty własne (P2, P3) | portfolio (poza repo) | j.w. | j.w. | poza repo (`RAILWAY-VARS-TO-PASTE.env`, `credentials/` na OneDrive → `rules/secret-rotate-on-exposure.md`) | portfolio (poza repo) | j.w. | NIE |
| `sports-market-apis` | apifootball, football-data.org, The Odds API, TheSportsDB, Alpha Vantage, NewsAPI — produkty własne/hobby | portfolio (poza repo) | j.w. | brak danych osobowych | klucze poza repo (`Desktop/Trading_Bot/Klucze API.txt` na OneDrive → usunąć/przenieść) | portfolio (poza repo) | TAK (czy pokazywać; `portfolio.md` §6.4) | NIE |

## 2. Identyfikatory do skanera (parsowane przez `scripts/find-integrations.mjs`)

Zasady tabeli: `id` = jak w tabeli głównej; `zakres` = katalogi najwyższego poziomu, w których połączenie
STRUKTURALNE (url/script/link/iframe/css/pakiet/ENV) jest dozwolone (`site`, `post-bot`, `leadscout`, `demo`,
`.claude`, `dev` = `.claude` + `site/scripts`, `docs`, `poza-repo`, `*`); wzmianki w treści (service-mention)
nie podlegają zakresowi.

`status` steruje bramką skanera:
- `zakazana…` → każde wystąpienie STRUKTURALNE (url/script/link/iframe/css/pakiet/ENV) lub `net-call` = **BLOCKER**;
- `planowana…` → wpis istnieje, ale decyzja founderów, sekcja w `/rodo` i CSP jeszcze NIE: użycie w kodzie = **HIGH**
  `integ-embed-requires-privacy` („wdrożenie przed zmianą statusu = obejście procedury"). Pliki przykładowe
  (`*.example.json`, np. `.claude/skills/motion/mcp.example.json`) niczego nie aktywują → INFO;
- `aktywna` / `dev` / `portfolio (poza repo)` → INFO, o ile zgadza się zakres; dodatkowo wpis z „wpis w /rodo? = TAK"
  musi mieć hosta w `site/dist/rodo.html` i w `Content-Security-Policy` w `site/public/_headers` (inaczej HIGH).

Kolumna **identyfikatory skanera** zawiera WYŁĄCZNIE rzeczy, które `find-integrations.mjs` potrafi dopasować:
host (`api.telegram.org`), wildcard (`*.workers.dev`), schemat (`mailto:`), NAZWA_ENV (`TELEGRAM_BOT_TOKEN`),
pakiet z listy `NETWORK_PACKAGES` (`playwright-core`) i słowo z listy `SERVICE_KEYWORDS` (`cloudflare`).
Kolumna **słowa pomocnicze** to dokumentacja i materiał dla bramki zależności (`integ-dependency-audit` test 1
sprawdza, czy każdy pakiet z `site/package.json` występuje w tym pliku w backtickach) — skaner ich NIE dopasowuje.
Dopisanie słowa do kolumny pierwszej wymaga dopisania go też do `SERVICE_KEYWORDS`/`NETWORK_PACKAGES` w skanerze.

| id | zakres | status | identyfikatory skanera (hosty · wildcardy · schematy · ENV · pakiety sieciowe · słowa kluczowe) | słowa pomocnicze (dokumentacja / audyt zależności) |
|---|---|---|---|---|
| `self-klarow` | `site`, `dev` | aktywna | `klarow.com` `www.klarow.com` | `kontakt@klarow.com` (adres w treści; dopasowywany schematem `mailto:` przez `mailto-kontakt`) |
| `cf-pages` | `site` | aktywna | `*.pages.dev` `pages.dev` `cloudflare` `dash.cloudflare.com` | — |
| `cf-web-analytics` | `site` | planowana | `static.cloudflareinsights.com` `cloudflareinsights.com` | — |
| `cf-zaraz` | `site` | planowana | `zaraz` | `/cdn-cgi/zaraz/` (ścieżka na własnej domenie) |
| `mailto-kontakt` | `site` | aktywna | `mailto:` | — |
| `tel-kontakt` | `site` | aktywna | `tel:` | — |
| `calcom` | `site` | planowana | `cal.com` `app.cal.com` `calcom` `@calcom/embed-react` `@calcom/embed-core` `@calcom/embed-snippet` | — |
| `fonts-selfhosted` | `site` | aktywna | `nunito` | `nunitosans` (nazwa pliku woff2) |
| `google-fonts-cdn` | `site` | zakazana | `fonts.googleapis.com` `fonts.gstatic.com` | — |
| `cdn-scripts-images` | `site` | zakazana | `cdnjs.cloudflare.com` `unpkg.com` `cdn.jsdelivr.net` `esm.sh` `cdn.tailwindcss.com` `code.jquery.com` `picsum.photos` `images.unsplash.com` `source.unsplash.com` | — |
| `analytics-third-party` | `site` | zakazana | `www.googletagmanager.com` `googletagmanager.com` `www.google-analytics.com` `google-analytics.com` `gtag` `plausible.io` `umami` `hotjar` `static.hotjar.com` `posthog` `app.posthog.com` `sentry` `*.ingest.sentry.io` `@sentry/browser` `@sentry/react` `@sentry/node` `posthog-js` `posthog-node` `@vercel/analytics` `react-ga4` | — |
| `three` | `site` | aktywna | — (pakiet bez sieci: skaner go nie dopasowuje) | `three` `@react-three/fiber` `@types/three` |
| `pdfmake` | `site` | aktywna | — | `pdfmake` |
| `react-router` | `site` | aktywna | — | `react-router-dom` `react-router` |
| `npm-build-deps` | `site` | aktywna | — | `react` `react-dom` `lucide-react` `@formkit/auto-animate` `tailwindcss` `@tailwindcss/vite` `vite` `@vitejs/plugin-react` `typescript` `@types/react` `@types/react-dom` · martwe, do usunięcia razem z kodem (`code-no-dead-code`): `@radix-ui/react-slot` `class-variance-authority` `clsx` `tailwind-merge` |
| `npm-registry` | `site`, `dev` | aktywna | `registry.npmjs.org` `www.npmjs.com` `npmjs.com` `npmjs` | — |
| `motion-lib` | `site` | planowana | — | `motion` `motion-plus` |
| `xml-namespaces` | `site` | aktywna | `schema.org` `www.sitemaps.org` `sitemaps.org` `www.w3.org` `w3.org` | — |
| `bundled-lib-strings` | `site` | aktywna | `react.dev` `reactrouter.com` `ns.adobe.com` `purl.org` `www.aiim.org` `tools.ietf.org` | — |
| `browser-storage` | `site` | aktywna | `localstorage` `sessionstorage` | — |
| `telegram-bot-api` | `leadscout`, `post-bot` | aktywna | `api.telegram.org` `t.me` `telegram` `TELEGRAM_BOT_TOKEN` `ALLOWED_CHAT_ID` | `node-telegram-bot-api` `telegraf` `grammy` (SDK — nieużywane, wołamy REST) |
| `anthropic-api` | `post-bot` | aktywna | `api.anthropic.com` `console.anthropic.com` `anthropic` `ANTHROPIC_API_KEY` `@anthropic-ai/sdk` | — |
| `cf-workers` | `post-bot` | aktywna | `*.workers.dev` `workers.dev` `wrangler` `WEBHOOK_SECRET` | — |
| `cf-email-routing` | `docs` | aktywna | `gmail.com` `mail.google.com` | — |
| `resend-smtp` | `docs` | aktywna | `smtp.resend.com` `resend.com` `resend` `smtp` `RESEND_API_KEY` | — |
| `github-remote` | `dev` | aktywna | `github.com` `api.github.com` | — |
| `onedrive-sync` | `poza-repo` | aktywna | `onedrive` `onedrive.live.com` `1drv.ms` | — |
| `claude-code-anthropic` | `dev` | dev | `claude.ai` `claude.com` | `claude-code` (host API: `api.anthropic.com` — wpis `anthropic-api`) |
| `claudeai-connectors` | `dev` | dev | `drive.google.com` `docs.google.com` `www.googleapis.com` | Gmail i Google Drive jako connectory claude.ai (poza repo; `integ-mcp-allowlist`) |
| `google-search-console` | `site`, `dev` | planowana | `search.google.com` `google.com` `google` | — |
| `higgsfield-mcp` | `dev` | aktywna | `higgsfield` `higgsfield.ai` `docs.higgsfield.ai` | — |
| `higgsfield-cloud-api` | `dev` | zakazana | `api.higgsfield.ai` `cloud.higgsfield.ai` `@higgsfield/client` `higgsfield-client` `HIGGSFIELD_KEY_ID` `HIGGSFIELD_KEY_SECRET` | — |
| `motion-mcp` | `.claude` | planowana | `mcp.motion.dev` `motion.dev` | — |
| `manus` | `dev` | zakazana | `manus.im` `open.manus.ai` `api.manus.ai` `manus` `@manus/sdk` | — |
| `playwright-webkit` | `dev` | dev | `playwright` `playwright-core` | — |
| `ksef-api-mf` | `poza-repo` | portfolio (poza repo) | `ksef.mf.gov.pl` `api-demo.ksef.mf.gov.pl` `api.ksef.mf.gov.pl` `ksef` | — |
| `gus-bir` | `poza-repo` | portfolio (poza repo) | `wyszukiwarkaregon.stat.gov.pl` `stat.gov.pl` `gus` | BIR 1.1, SOAP |
| `krs-api` | `poza-repo` | portfolio (poza repo) | `api-krs.ms.gov.pl` `rejestr.io` `krs` | — |
| `ecb-fx` | `poza-repo` | portfolio (poza repo) | `data-api.ecb.europa.eu` `www.ecb.europa.eu` `ecb` | — |
| `autenti-outlook` | `poza-repo` | portfolio (poza repo) | `autenti.com` `autenti` | Outlook COM (mail-listener) |
| `stripe` | `poza-repo` | portfolio (poza repo) | `api.stripe.com` `js.stripe.com` `stripe` `@stripe/stripe-js` `STRIPE_SECRET_KEY` | — |
| `railway-expo-push` | `poza-repo` | portfolio (poza repo) | `railway.app` `exp.host` `expo-server-sdk` `railway` `expo` | Redis, PostgreSQL (poza repo) |
| `sports-market-apis` | `poza-repo` | portfolio (poza repo) | `apifootball.com` `api.football-data.org` `api.the-odds-api.com` `www.thesportsdb.com` `www.alphavantage.co` `newsapi.org` | — |

## 3. Polityka (obowiązuje każdą sesję)

1. **Zero chmury dostawcy.** Narzędzia dla klientów i dema na stronie nie wołają API modeli językowych ani
   serwerów Klarow. Jedyne dozwolone połączenia w narzędziu klienta to systemy, które klient sam wskaże
   (KSeF, jego ERP, jego dysk sieciowy). Anthropic API tylko w botach wewnętrznych (`post-bot/`).
   → `rules/integ-no-llm-api-in-client-tools.md`, `rules/integ-telegram-anthropic-only-in-bots.md`.
2. **Strona: zero skryptów zewnętrznych bez rejestru + `/rodo` + decyzji.** Dziś (2026-09-12) `klarow.com`
   nie ładuje NICZEGO spoza własnej domeny (0 CDN, 0 analityki, fonty self-hosted) — **dowód: §5 niżej**
   (pełne wyjście obu przebiegów skanera, nie deklaracja). Planowane wyjątki
   z decyzją: CF Web Analytics (D-16), Cal.com link → embed (D-15), Zaraz/Pages Function (D-16).
   → `rules/integ-no-external-scripts-on-site.md`, `rules/integ-embed-requires-privacy.md`.
3. **Nowe połączenie = wpis PRZED kodem** w obu tabelach; `find-integrations.mjs --strict` zielony w pre-push.
   → `rules/integ-registry-required.md`.
4. **MCP tylko z allowlisty** (Motion opcjonalnie, creative engine przez connector claude.ai); hostowany MCP
   to integracja. → `rules/integ-mcp-allowlist.md`.
5. **Dane klientów, leadów, materiały poprzedniej firmy, sekrety i twarze NIGDY nie trafiają do Higgsfield,
   Manus, LLM ani MCP.** → `rules/integ-data-egress-review.md`, `rules/secret-no-secrets-in-prompts-or-logs.md`.
6. **Nowa zależność npm = uzasadnienie + rozmiar + licencja + sprawdzenie sieci.** → `rules/integ-dependency-audit.md`.
7. **Sekrety poza gitem; ekspozycja = rotacja; agenci nie czytają `.env`.** → `rules/secret-*.md`.

## 4. Otwarte pozycje wymagające decyzji founderów (stan 2026-09-12)

| # | Pozycja | Reguła / źródło | Domyślne, gdy brak decyzji |
|---|---|---|---|
| 1 | Rotacja klucza Anthropic z `.env` appki KSeF (poza repo) + potwierdzenie daty w `docs/DECISIONS.md` | `secret-rotate-on-exposure`; `post-bot/README.md:16-18`; `CLAUDE.md` 2026-07-27 | klucz uznany za skompromitowany; bot `/post` działa na NOWYM kluczu |
| 2 | Pliki z kluczami na OneDrive: `Desktop/Trading_Bot/Klucze API.txt`, `Zabawa Code/RAILWAY-VARS-TO-PASTE.env`, `PROMO_CODES.txt`, `Reseling_App/loot-alert-mobile/credentials/` | `secret-rotate-on-exposure`; `portfolio.md` §6.3 | przenieść do Menedżera poświadczeń / menedżera haseł, zrotować, usunąć z OneDrive |
| 3 | Czy repo GitHub jest prywatne (w repo: `leads.json`, referencja poprzedniej firmy) | `secret-git-history-scan-before-public`; `synthesis.md` §6 | traktować jako prywatne; publikacja zabroniona do decyzji |
| 4 | Cal.com: link (faza 1) → embed (faza 2, CSP + `/rodo`) | D-15; `integ-embed-requires-privacy` | link zewnętrzny, 0 skryptów |
| 5 | Pomiar: CF Web Analytics + GSC + zdarzenia (Zaraz vs Pages Function); kto zakłada konta | D-16; luka L3 | CF WA bez zdarzeń do czasu `/rodo` |
| 6 | Digesty Lead-Scout na Telegram: bez danych osób, czy Telegram jako odbiorca w `/rodo` | `integ-data-egress-review` | digest bez nazwisk/adresów e-mail osób |
| 7 | Higgsfield: plan (D-08), akceptacja ToU (licencja na trening), usuwanie generacji po sprincie | `integ-data-egress-review`; `higgsfield.md` §8, §10 | tylko abstrakcje; usunąć generacje po sprincie |
| 8 | Motion MCP w `.mcp.json` (hostowany) — tak/nie; Motion+ (licencja dla 2 founderów) | `integ-mcp-allowlist`; `motion-dev.md` §11 p.4-5 | bez `.mcp.json`; skill `/motion` lokalnie |
| 9 | Manus: 1 miesiąc Pro do researchu na danych publicznych — tak/nie | `manus.md` §7 p.4 | nie |
| 10 | Nazwy integracji z A1 (GUS/KRS/rejestr.io/EBC/Autenti) i produktów własnych (Stripe/Railway/Expo) na stronie | `portfolio.md` §8 p.3, 5, 6 | tylko ogólnie: „kilkanaście integracji: od API Ministerstwa Finansów po płatności i komunikatory" |
| 11 | Relabel „WDROŻONE" przy KSeF + „asystent AI" w opisie | `strategy.md` D4; `portfolio.md` §8 p.4 | „Własny produkt, gotowy do pilota"; asystent AI usunięty z bulletów |
| 12 | Repo (z `leadscout/leads.json` i `.env`) leży w katalogu OneDrive i jest synchronizowane do Microsoftu — zostawiamy czy przenosimy repo poza OneDrive | `onedrive-sync`; `secret-rotate-on-exposure`; `integ-data-egress-review` | traktować OneDrive jako odbiorcę: `leads.json` bez danych osób albo repo poza OneDrive przed pierwszym klientem |
| 13 | Connectory claude.ai (Gmail, Google Drive) włączone przy pracy nad repo — tak/nie i w jakim zakresie | `claudeai-connectors`; `integ-mcp-allowlist`; `integ-data-egress-review` | wyłączone przy pracy nad repo; włączane świadomie do konkretnego zadania |

## 5. Ostatni skan 2026-09-12 (wyjście, nie deklaracja)

Dowód dla tezy z §3 p.2 („`klarow.com` nie ładuje NICZEGO spoza własnej domeny") i dla
`rules/integ-no-external-scripts-on-site.md`. Liczby to migawka z tego przebiegu — niezmiennikiem
bramki jest `Σ BLOCKER 0 · HIGH 0`, a nie konkretna liczba INFO.

**A. Kod źródłowy** — `node ".claude/skills/klarow-guardian/scripts/find-integrations.mjs"`
(domyślny zasięg: `site/{src,public,index.html,vite.config.ts,scripts,functions,package.json}`, `ui-kit`,
`post-bot`, `leadscout`, `demo`, `.mcp.json`, `.claude/{settings.json,agents,workflows}`, `mcp*.json` skilli):

```text
rejestr: .claude/skills/klarow-guardian/references/integrations-registry.md — 43 wpisów
plików przeskanowanych: 71

Zarejestrowane integracje wykryte w kodzie:
  anthropic-api                    4 trafień w 1 pl.
  browser-storage                 12 trafień w 11 pl.
  calcom                           1 trafień w 1 pl.
  cf-pages                         4 trafień w 4 pl.
  cf-workers                       4 trafień w 2 pl.
  fonts-selfhosted                 6 trafień w 6 pl.
  google-search-console            5 trafień w 5 pl.
  ksef-api-mf                      7 trafień w 7 pl.
  mailto-kontakt                   3 trafień w 3 pl.
  motion-mcp                       3 trafień w 1 pl.
  self-klarow                      8 trafień w 5 pl.
  tel-kontakt                      2 trafień w 2 pl.
  telegram-bot-api                 9 trafień w 2 pl.
  xml-namespaces                   5 trafień w 3 pl.

Problemy (format audytu):

## ui-kit/skills/company-ui/assets/base.html
ui-kit/skills/company-ui/assets/base.html:122 - MEDIUM [integ-registry-required] wywołanie sieciowe fetch( bez rozpoznanego hosta w tej linii — sprawdź ręcznie, dokąd idą dane

Σ BLOCKER 0 · HIGH 0 · MEDIUM 1 · LOW 0
informacyjnie: INFO 66 · NIEZAREJESTROWANE 1
```

**B. Po buildzie, z `dist`** — ta sama komenda z `--dist --strict` (exit 0):

```text
plików przeskanowanych: 100 (z site/dist)
Σ BLOCKER 0 · HIGH 0 · MEDIUM 1 · LOW 0
informacyjnie: INFO 205 · NIEZAREJESTROWANE 1
```
W `dist` dominują `self-klarow` (156 trafień w 26 plikach: canonical/OG/JSON-LD), `xml-namespaces`
(63), `mailto-kontakt` (20), `tel-kontakt` (19), `bundled-lib-strings` (13 w 2 plikach: `react.dev`,
`reactrouter.com`, namespace'y pdfmake) — czyli **zero hostów spoza rejestru i zero hostów runtime
spoza `klarow.com`**.

**C. Jedyny MEDIUM — zweryfikowany ręcznie (2026-09-12).**
`ui-kit/skills/company-ui/assets/base.html:122`: `fetch(url,{credentials:'same-origin'})` w szablonie
modala kitu. `url` przychodzi z atrybutu w szablonie (ścieżka względna na tym samym serwerze), więc
skaner nie widzi hosta w linii i słusznie prosi o przegląd; przegląd wykonany — brak hosta zewnętrznego
w CAŁYM `ui-kit/` (`grep -rnoE "https?://[a-z0-9.-]+" ui-kit --include=*.html --include=*.css
--include=*.tsx --include=*.ts --include=*.json` → 0 trafień). Pozycja zostaje jako MEDIUM, bo
`fetch(<zmienna>)` nie jest dowodem sam z siebie; przy przepisaniu szablonu użyć literału (`fetch("/…")`),
wtedy skaner klasyfikuje to jako `self-klarow`.

**D. Sekrety** — `node ".claude/skills/klarow-guardian/scripts/check-secrets.mjs"` (tryb `git ls-files`):
`Σ BLOCKER 0 · HIGH 0 · MEDIUM 0 · LOW 0`, exit 0. Tryb raportów/digestów
(`… check-secrets.mjs audit leadscout/digesty docs .claude`): 358 plików, 357 przeskanowanych,
`✓ pass`, exit 0.

**E. Czego skan NIE obejmuje** (i dlatego wymaga oka founderów): kanałów spoza kodu —
`onedrive-sync`, `claude-code-anthropic`, `claudeai-connectors`, `npm-registry`, `github-remote`,
`cf-email-routing`, `resend-smtp`. Mają wiersze w §1, ale ich egress dzieje się poza repozytorium,
więc żaden grep tego nie udowodni ani nie obali.
