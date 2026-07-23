# CLAUDE.md — projekt Klarow

> Repo firmy **Klarow** (klarow.com) — automatyzacja, upraszczanie i czyszczenie danych
> dla MŚP 20–250 osób „wyrosłych na Excelu". Hook: **wdrożenie w dni, nie w miesiące;
> dane zostają u klienta (on-premise)**. Founderzy: Paweł + Karol, budowa z Claude Code.

## Czym jest to repo

| Katalog | Zawartość |
|---|---|
| `docs/plan/` | **Dokumenty decyzyjne** — czytaj przed większą pracą: `plan-strategiczny.md` (model biznesowy, ICP, katalog modułów M1–M8, architektura strony), `nastepne-kroki.md` (roadmapa operacyjna), `domena-serwer-krok-po-kroku.md` (domena/hosting/mail — częściowo WDROŻONE) |
| `docs/nuconic-ekosystem-referencja.md` | **Historyczny** opis ~15 narzędzi zbudowanych dla Nuconic — portfolio i biblioteka wzorców (TEST→PROD, backup, log audytowy, Excel COM). **NIE produkt, NIE kod do kopiowania**; szczegóły techniczne wzorców bierz stąd |
| `ui-kit/` | **Company UI kit (marka KLAROW)** — obowiązkowy design-system wszystkich narzędzi i stron: `ui-kit/skills/company-ui/` (SKILL.md + app.css + fonty + komponenty React) |
| `site/` | **Landing klarow.com** — Vite + React 19 + TS + Tailwind (tylko layout), dwujęzyczny PL/EN |
| `demo/` | Statyczna prezentacja modułu M2 (Raport zarządczy) — pokaz kitu, dane fikcyjne |
| `.claude/skills/` | Skille projektu: `auto-animate` (animacje list/akordeonów), `aceternity-ui`, `motion-design` (animacje/przejścia), `lead-scout` (agent researchu leadów) |
| `leadscout/` | **Agent pozyskiwania leadów** — baza `leads.json`, digesty na Telegram (@Klarow_BOT przez `notify.mjs`; token w `.env` POZA gitem), przewodnik źródeł `zrodla.md`, playbook outboundu, ranking kanałów marketingowych, kolejka rund `nastepne-rundy.md`. Uruchamianie: `/lead-scout` |

## Twarde zasady (obowiązują każdą sesję)

1. **UI wyłącznie wg skilla `company-ui`** (`ui-kit/skills/company-ui/SKILL.md`) — zero
   własnych wariantów przycisków/chipów/kolorów. Akcent: polerowana stal `#A8B4C2`
   (klasy `*-accent`); **zero złota `#FFA914`** (stara marka Nuconic) i zero logo graficznego —
   znak marki to tekstowy wordmark `KLAROW` (klasa `.brand-word`, komponent `BrandMark`).
2. **Wykresy statyczne** — bez teatralnego „rysowania"; krótki fade, kropki tylko informacyjne.
   Wszystkie animacje szanują `prefers-reduced-motion`; tła animowane tylko na GPU
   (canvas/WebGL), z pauzą przy `document.hidden` i sprzątaniem rAF.
3. **Marka Nuconic nie może pojawić się publicznie** (strona, case, zrzuty) **przed umową IP**
   — patrz `plan-strategiczny.md` §5.2. Case opisujemy jako „firma produkcyjno-budowlana".
4. **Każdą skończoną zmianę commituj i pushuj na `main`** (`origin` = github.com/przeczkowskyy/Pawel_Karol_proj — wspólne repo Pawła i Karola).
   Komunikaty po polsku, stopka `Co-Authored-By: Claude ...`. Tożsamość gita ustawiona per-repo.
5. Teksty strony dwujęzycznie **PL + EN** (wzorzec: obiekt `{ pl, en }` + `pick()` z `src/i18n.tsx`).
6. Środowisko: Windows 11, PowerShell; Node 24, npm 11, Python 3. **Nauczki środowiskowe:**
   - **`npx` nie działa w tym repo** — znak `&` w ścieżce katalogu łamie shimy cmd. Wywołuj
     binarki wprost: `node node_modules/typescript/bin/tsc --noEmit`,
     `node node_modules/vite/bin/vite.js build`. Dotyczy też **npm-skryptów** wołających
     binarki z `node_modules/.bin` („'Pawe' is not recognized...") — dlatego package.json
     strony woła `node node_modules/vite/bin/vite.js ...` wprost (działa lokalnie i na CI).
   - **`git push` może wisieć bez końca** — Git Credential Manager otwiera niewidoczne okno
     OAuth. Naprawione per-repo: `credential.helper=wincred` (czyta PAT z Menedżera poświadczeń
     Windows, wpis `git:https://github.com`). Gdy push rzuci 401/403 → PAT wygasł: odnowić
     wpis w Menedżerze poświadczeń albo tymczasowo `git config --unset credential.helper`
     (wróci GCM z oknem logowania).
   - **DEMO i silniki liczące**: zero `Date.now`/`Math.random`/sieci w logice — determinizm
     jest obietnicą produktową (i tak testujemy: dwa przebiegi muszą dać identyczny JSON).
7. **Wzbogacaj wiedzę projektu (każde okno/sesja):** na koniec pracy zaktualizuj sekcję
   „Stan operacyjny" (nowe decyzje, co zrobione, co dalej) i dopisz trwałe nauczki/zasady
   tutaj. Wiedza ma się kumulować między oknami — następne okno startuje z tego pliku, nie z zera.

## Jak uruchomić

```bash
# landing (dev, HMR):            http://localhost:5173
cd site && npm install && npm run dev

# build produkcyjny (CI robi to samo na Cloudflare Pages):
cd site && npm run build          # wynik: site/dist

# demo narzędzia M2:             http://localhost:8765
python -m http.server 8765 --directory demo
```

Weryfikacja przed pushem zmian w `site/`: `npx tsc --noEmit` + `npx vite build` przechodzą.

## Architektura strony (`site/`)

- **Landing = motion-graphic DECK (v0.6):** strona jest **statyczna — dokument się nie
  scrolluje**. Gest scrolla / swipe / klawiatura przełącza 11 sekcji-slajdów
  (`src/components/SlideDeck.tsx`) z przejściem zoom+fade (archetyp Premium ze skilla
  `motion-design`: wyjście 420 ms accelerate, wejście 600 ms decelerate z opóźnieniem
  120 ms; CSS w `src/styles/globals.css`). Slajd wyższy niż viewport scrolluje się
  **wewnętrznie** (`.slide-scroll`) — deck przełącza dopiero od krawędzi treści. Hash ↔
  slajd zsynchronizowane (navbar i podstrony działają; `HASH_ALIAS` mapuje stare hashe);
  hero ma rząd przycisków szybkiej nawigacji; **KLAROW w navbarze → slajd 0** (CustomEvent
  `klarow:home`). Kolejność (**7 slajdów**): start → ból → **narzędzia** → wyróżniki →
  współpraca → **oferta (skondensowana)** → faq (lista `SLIDES` w `App.tsx`).
  **Kondensacje 2026-07-22:** „Dowód" → akapit-nagłówek w Narzędziach; „Dlaczego dni" +
  „Dla kogo" + „Zaufanie" → JEDEN slajd Oferta (`OfferSection`). Stare hashe aliasowane
  w `HASH_ALIAS`. **Kontakt = stała stopka `FooterBar`** (fixed dół, opaque).
- `src/App.tsx` — definicje sekcji + deck + routing (`/`, `/narzedzia/:slug`) + modal rezerwacji.
- **Sekcja „Narzędzia" (rdzeń dowodu — zamiast fikcyjnych modułów):**
  - **BEZ statusów — KAŻDE z 12 narzędzi DZIAŁA NA ŻYWO na danych DEMO** (decyzja Karola).
  - `src/data/tools.ts` — katalog 12 narzędzi (PL/EN): **`dept` (5 działów: kontroling,
    finanse, produkcja, dane, administracja)**, `category`, `dashboard` (klucz komponentu),
    tagline/replaces/io/bullets. **Odbrandowane** odtworzenie z bazy blueprintów.
  - `src/components/ToolsGrid.tsx` — **drill-down**: poziom 1 = **pas kolumn działów**
    (JEDEN panel na scrimie, działy jako kolumny rozdzielone strukturalnymi liniami 1px —
    celowo nie boxy; ikony domenowe BarChart3/Banknote/HardHat/FileSpreadsheet/Stamp;
    separatory `.tools-strip` w globals.css), poziom 2 = siatka kart narzędzi działu.
    **Karuzela orbitalna testowana i USUNIĘTA decyzją Karola** (2026-07-22 wieczór) —
    `radial-orbital-timeline` znowu tylko zapas.
  - `src/pages/ToolPage.tsx` — podstrona narzędzia: OSADZONY dashboard (mapa `DASHBOARDS`)
    + opis + crosslinki + Seo per podstrona.
  - **Dokumenty PDF (pobieranie, nie okno druku):** `lib/pdf.ts` (pdfmake lazy-chunk,
    wbudowane polskie znaki; dokument A4 jednostronicowy: nagłówek KLAROW, meta, tabela,
    stopka DEMO, opcjonalne podpisy) + `dashboards/PdfButton.tsx`. Pobierają: protokół
    robocizny, plan płatności, raport importu, podsumowanie tygodnia PM, rejestr umów.
  - **Skalowanie:** root `zoom` 1.08 od 1500px / 1.18 od 1900px (globals.css).
  - **SEO:** `src/components/Seo.tsx` (title/description/canonical/OG/JSON-LD per strona;
    `ORG_JSONLD` + `faqPageJsonLd` na landingu, `toolJsonLd`+FAQPage per narzędzie),
    `public/robots.txt`, meta w `index.html`; **prerender** `src/prerender/entry.tsx` +
    `scripts/prerender.mjs` (13 statycznych HTML; `sitemap.xml` i `llms.txt` GENEROWANE
    z `tools.ts` przy buildzie — ręcznego `public/sitemap.xml` NIE MA, nie odtwarzać);
    treści long-tail + FAQ per narzędzie w `src/data/toolsSeo.ts` (merge w `getTools()`).
  - **12 dashboardów (komplet)** — 100% client-side, deterministyczne, dane fikcyjne:
    `DemoReport.tsx`+`lib/report.ts` („Raport zarządczy", spec `docs/plan/demo-m2-spec.md`) ·
    `dashboards/ProductionDashboard.tsx` (kafle hal + suwak tygodnia) ·
    `dashboards/QualityGate.tsx`+`lib/qualityGate.ts` („Audyt jakości" — reguły 1:1
    z blueprintu: PM<0, tydzień<0, saldo E≠0, data poza tygodniem ISO; macierz
    OK/UWAGA/BŁĄD) · `dashboards/TaskTimeline.tsx` (Gantt compare-mode 2 snapshotów,
    dryf +Nd/−Nd, stała gęstość px/dobę; „Dziś"=stała 2026-07-22 dla determinizmu) ·
    `dashboards/PaymentCalculator.tsx` (transze: alokacja proporcjonalna w groszach,
    reszta na ostatniej pozycji → Σ co do grosza; FX na kursach fikcyjnych) ·
    `dashboards/ImportReconciliation.tsx` (diff 2 wersji + REKONCYLIACJA PASS/FAIL
    z jawnym dowodem co do grosza, tryb TEST) · `dashboards/G703Billing.tsx`
    (silnik G703: earned=D×M, proposal=earned−billed gdy M>40%, clawback
    nieprzycinany, USD/centy — wątek rynku USA) · `dashboards/PaymentFlow.tsx`
    (obieg przelewów: decyzje per pozycja → plan 14-dniowy, cztery oczy, wydruk) ·
    `dashboards/CostControl.tsx` (widok PM: ETC→EAC→marża na żywo, bramka tygodnia) ·
    `dashboards/ErpImports.tsx` (TEST: słownik, dedup, sanity, wydruk raportu) ·
    `dashboards/LabourProtocols.tsx` (kreator DRAFT→FINAL, drukowalny protokół) ·
    `dashboards/ContractRegister.tsx` (CRUD, szukajka, CSV, wydruk rejestru).
- `src/components/` — `Differentiators` (zero chmury + determinizm + blok ✕/✓ + galeria
  before/after linkująca do live-dashboardów), `Navbar` (PL/EN, KLAROW→home), `BookingModal`
  (kalendarz → mailto/tel; **do podmiany na embed Cal.com**), `CollaborationFlow` (SVG), `Faq`.
- `src/components/ui/glsl-hills.tsx` — tło całej strony (three.js, spowolnione `speed=0.2`);
  prop `zoomRef` = docelowy zoom kamery mutowany przez deck (płynne dojście w pętli renderu,
  bez remontu sceny WebGL) — tło „wjeżdża w głąb" z każdym slajdem.
- **Zapas (nieużywane, poza bundlem):** `radial-orbital-timeline`, `canvas-reveal-effect`.
- `src/styles/company-ui.css` — **kopia kitu** (aktualizacja = nadpisanie NAD markerem
  APP-SPECIFIC świeżą kopią z `ui-kit/.../app.css` + zamiana ścieżek fontów na `/fonts/`).
- `public/_redirects` — SPA-fallback dla podstron na Cloudflare Pages/Netlify.
- Docelowo (plan §4.2): treść do YAML w `site/content/` + trasy `/pl/` `/en/` build-time.

## Stan operacyjny (aktualizuj przy zmianach!)

- **2026-07-23 (sesja lead-scout) — agent pozyskiwania leadów + pierwsza runda researchu:**
  - Zbudowany **agent Lead-Scout**: skill `/lead-scout` (ICP, scoring 0–10, procedura rundy)
    + katalog `leadscout/` (README z instrukcją). Wysyłka na Telegram: `node leadscout/notify.mjs`
    (`npx` nie działa — node wprost); token bota w `leadscout/.env` **poza gitem**; chat_id
    wykrywany automatycznie z getUpdates. **BLOKER jednorazowy:** founder musi napisać
    cokolwiek do t.me/Klarow_BOT (boty nie piszą pierwsze) → potem
    `node leadscout/notify.mjs --file leadscout/digesty/digest-2026-07-23.md`.
  - **Runda 1 (workflow 13 agentów, weryfikacja adwersaryjna):** 32 zweryfikowane leady
    w `leads.json` (22 PL: produkcja/budownictwo/dystrybucja + 10 US: modular/subcontractors
    pod G703; US = segment odroczony do ~6. mies.), 12 kandydatów odrzuconych (poza ICP,
    grupy kapitałowe, martwe domeny, duplikaty). Wszystkie leady PL z sygnałem zakupu.
  - **Artefakty researchu:** `zrodla.md` (JobAlerty pracuj.pl/LinkedIn jako system wczesnego
    ostrzegania, Aleo/REGON/e-KRS, Diamenty/Gazele, katalogi targów, MBI directory dla US),
    `playbook-outbound.md` (rytm 20 kontaktów/tydz. + szablony **zgodne z PKE**: LinkedIn →
    mail po zgodzie → telefon), `marketing-kanaly.md` (ranking: 1. partnerstwa z wdrożeniowcami
    ERP, 2. ICV Polska, 3. cold outreach dwuetapowy, 4. biura rachunkowe, 5. content/SEO),
    `nastepne-rundy.md` (kolejka 10 rund + luki od krytyka).
  - **GitHub przemianowany:** konto `bibaczebe` → `przeczkowskyy` (stary remote przekierowuje;
    push działa bez zmian).
- **2026-07-23 (sesja cz. 7) — SEO + GEO + mobile ROZWIĄZANE:**
  - **Mobile „samo tło" — przyczyna znaleziona i usunięta u źródła.** Repro Playwright/WebKit
    na produkcji: brak WebGL (iOS Lockdown Mode / wyczerpany limit kontekstów przy dziesiątkach
    otwartych kart) LUB bloker treści tnący lazy-chunk three.js → wyjątek bez error boundary →
    React zdejmował CAŁE drzewo (#root pusty — zostawała czerń/tło). Fix trójwarstwowy:
    `BgBoundary` wokół `GLSLHills` (awaria tła = brak tła, treść żyje), sonda WebGL + try/catch
    konstruktora renderera w glsl-hills, stalowy gradient awaryjny na `.bg-layer`; w `?debug=1`
    doszła sonda WebGL/WebGL2. **Po deployu oba scenariusze awarii renderują pełną treść NA
    PRODUKCJI** (Playwright, viewport iPhone). iOS Karola = 26, świeża karta nie pomagała —
    obraz pasuje; zrzut `?debug=1` nadal mile widziany jako domknięcie (który wariant trafił).
  - **SEO — prerender/SSG bez przeglądarki (działa i lokalnie, i na CI Pages):** `npm run build`
    = build klienta → `vite build --ssr src/prerender/entry.tsx` → `scripts/prerender.mjs`.
    Wynik: 13 statycznych HTML (`/` + 12 × `dist/narzedzia/<slug>.html`; Pages serwuje je
    bezrozszerzeniowo, `_redirects` łapie resztę) z meta/canonical/OG/JSON-LD i PEŁNĄ treścią
    tekstową bez JS; React po starcie podmienia shell (zweryfikowane WebKitem z JS i bez JS —
    strona degraduje się łaskawie, gdy JS nie wstanie). Skrypt wymaga PUSTEGO
    `<div id="root"></div>` w index.html (twardy assert).
  - **sitemap.xml i llms.txt GENEROWANE z tools.ts** przy buildzie — `public/sitemap.xml`
    USUNIĘTY (nie odtwarzać ręcznie!); nowe narzędzie dopisane do tools.ts wpada do sitemapy
    i llms.txt automatycznie.
  - **GEO:** dane FAQ landingu przeniesione do `src/data/faq.ts` (JEDNO źródło: akordeon Faq +
    FAQPage JSON-LD + prerender); FAQPage JSON-LD na landingu i na podstronach narzędzi;
    `llms.txt` (opis firmy, wyróżniki, 12 narzędzi z linkami, kontakt, sekcja EN); na każdej
    podstronie narzędzia sekcja „Częste pytania o to narzędzie" (treść stale w DOM).
  - **Treści long-tail:** NOWY generowany plik `src/data/toolsSeo.ts` — title/description
    (≤62 zn. / 130–165 zn.) + 4 pary Q&A per narzędzie, PL/EN; merge po slugu w `getTools()`
    (brak wpisu = fallbacki, strona działa). Powstał wsadowo: 12 draftów + adwersarialna
    weryfikacja (zasada #3, liczby tylko publiczne, spójność z tools.ts, samowystarczalność
    odpowiedzi pod cytowanie przez LLM-y) + bramka skryptowa (audyt wszystkich liczb, limity
    długości, komplet PL/EN) + przegląd ręczny. To zwykły plik danych — można edytować.
  - Spójność NAP potwierdzona: `786 296 426` (display) / `+48 786 296 426` (JSON-LD) /
    `kontakt@klarow.com` — jednolicie w całym serwisie.
  - **Przegląd adwersarialny diffu sesji → 7 potwierdzonych poprawek (wdrożone):**
    (1) wstrzykiwany prerenderem JSON-LD dostał `id="seo-jsonld"` — bez tego po starcie
    Reacta strona miała PODWÓJNY JSON-LD, a po nawigacji SPA nieaktualny; (2) podmiany
    w prerender.mjs jako funkcje — replacement-string interpretował sekwencje `$` z treści
    (repro: „$'000" w FAQ rozwalało HTML przy zielonym buildzie); (3) odpowiedzi FAQ
    landingu ZAWSZE w DOM (`.faq-answer`, animacja grid-template-rows zamiast auto-animate)
    — FAQPage JSON-LD musi mieć pokrycie w treści strony; (4) title strony głównej 71→60 zn.
    i description 210→160 zn. (Google ucina ~55–60 — hak „Wdrożenie w dni" wypadał);
    (5) „złota linia"→„stalowa" w TaskTimeline (resztka języka starej marki, linia i tak
    renderuje się w stali); (6) FAQ osi czasu nie obiecuje już eksportu (demo go nie ma;
    io w tools.ts opisuje wersję wdrożeniową — OK); (7) EN FAQ dodane do shella podstron.
  - **ZNANE OGRANICZENIE (świadome):** warstwa EN SEO (title/description/FAQ z toolsSeo.ts)
    jest niewidoczna dla Google — PL i EN dzielą URL, crawler bez localStorage renderuje PL;
    EN meta ożyje dopiero przy trasach `/en/` (plan §4.2, dopisane do „Do zrobienia").
    Boty bez JS (LLM-y) dostają EN przez sekcję `lang="en"` w shellu i `llms.txt`.
- **2026-07-22 (sesja strony, cz. 6) — PDF, iteracje UI Narzędzi, skalowanie, mobile:**
  - **Dokumenty → pobieranie PDF** (pdfmake, lazy ~830 KB gz ładowane przy kliknięciu;
    polskie znaki wbudowane; dokument projektowany na 1 stronę A4). Print-CSS usunięty.
  - **Iteracja UI Narzędzi:** karuzela orbitalna na poziomie 2 wdrożona → **cofnięta tego
    samego dnia decyzją Karola** („usuń te koła") — finalnie: poziom 1 = pas KOLUMN
    działów (nie boxy), poziom 2 = siatka kart. Czytelniejsze ikony działów.
  - Lekki zoom całej strony na dużych ekranach; KPI w dashboardach responsywne na mobile.
  - **Bug „klarow.com na telefonie = samo tło":** zdiagnozowane jako stary `index.html`
    z cache przeglądarki wołający purge'owane assety (SPA-fallback oddaje im HTML).
    Kluczowy dowód od Karola: **z otwartą inspekcją strona działa** (DevTools domyślnie
    wyłącza cache!). Fix dwuwarstwowy: (1) `public/_headers` — HTML `no-cache`,
    `/assets/*` + `/fonts/*` `immutable`; (2) inline skrypt samonaprawy w `index.html` —
    przy błędzie ładowania script/link JEDNORAZOWY `location.reload()`
    (sessionStorage-guard) → świeży HTML z poprawnymi hashami. Leczy też urządzenia
    zatrute przed wdrożeniem nagłówków.
  - **Sekcja „Dowód" usunięta jako slajd** — liczby wplecione w nagłówek Narzędzi.
  - **Kondensacja slajdów (decyzja Karola):** „Dlaczego dni" + „Dla kogo" + „Zaufanie/
    Oferta" → JEDEN slajd `OfferSection` (deck: 9→7 slajdów). Za dużo podstron rozprasza.
  - **Mobile „tylko tło" — pełna diagnoza na żywej produkcji (curl):** HTML świeży, ale
    (a) minifier CSS sklejał fallbackowe longhandy z powrotem w `inset`, (b) arkusz pełen
    składni nowego WebKita (oklch/color-mix/@layer/@property z Tailwinda v4 — wymaga
    ~Safari 16.4). Fix: **`build.target ["es2019","safari13"]` + `cssTarget ["safari13"]`
    w vite.config** (longhandy zostają, oklch→rgb — zweryfikowane w dist) + **szkielet
    strony na czystym CSS** (`.bg-layer`/`.content-layer` w globals zamiast tailwindowych
    fixed/inset-0/z-*) — treść stoi nawet gdy @layer/@property wypadną. Tryb
    diagnostyczny `klarow.com/?debug=1` (błędy + stan .deck/.slide + sondy
    inset/@layer/@property na ekranie). **Jeśli telefon dalej czarny → zrzut ?debug=1.**
  - **Śledztwo Cloudflare (na prośbę Karola, curl produkcji): CF CZYSTY** — serwuje
    najnowszy build (jest `.bg-layer`, longhandy `.deck`, oklch=0), nagłówki no-cache
    działają. Problem siedzi po stronie telefonu. Podejrzany nr 1: **zawieszona stara
    karta w Chrome iOS** (dziesiątki otwartych kart — telefon wznawia zamrożony stary
    widok zamiast świeżego ładowania). Instrukcja: zamknąć wszystkie karty klarow.com,
    otworzyć NOWĄ; spróbować też w Safari; ostatecznie zrzut z `?debug=1`.
  - **Favicon:** logo „K" (stal) od Karola — favicon.ico + apple-touch-icon +
    og:image (Logo.zip → site/public/).
- **2026-07-22 (sesja strony, cz. 5) — komplet 12/12 narzędzi + działy + wydruk + SEO:**
  - **Decyzje Karola:** zero statusów („każde narzędzie musi działać na żywo, zawsze DEMO
    dane"); zakładka Narzędzia = najpierw **boxy działów** (drill-down); **wydruk
    dokumentów** z narzędzi; strona **pod SEO** z podzakładkami budującymi trust.
  - Dobudowane ostatnie 5 dashboardów: Obieg przelewów (plan 14-dniowy), Kontroling
    kosztów (ETC→EAC), Importy ERP (TEST: słownik+dedup+sanity), Protokoły robocizny
    (kreator + drukowalny dokument), Rejestr umów (CRUD+CSV+wydruk).
  - Wydruk: `.print-area`/`.print-only` + `PrintButton` — 5 dokumentów drukowalnych.
  - SEO: per-podstrona title/meta/canonical/OG/JSON-LD, robots.txt, sitemap.xml
    (13 URL-i — pamiętaj o aktualizacji przy nowych narzędziach), meta w index.html.
  - Uwaga architektoniczna: SPA — meta ustawiane w JS; jeśli SEO ma być mocniejsze,
    następny krok to prerender/SSG podstron narzędzi (np. vite-ssg) przy deployu.
- **2026-07-22 (sesja strony, cz. 4) — „przenieś 1:1 narzędzia z gita": 7 dashboardów LIVE:**
  - Do istniejących 2 (Raport zarządczy, Dashboard produkcji) doszło 5 kolejnych, odtworzonych
    **1:1 co do logiki** ze wzbogaconych blueprintów (repo dostało fragmenty realnego kodu):
    **Audyt jakości danych** (reguły PM_MINUS/NEG_WEEK/E_NONZERO/BAD_DATE, tydzień ISO,
    macierz pewności — silnik przetestowany node'em), **Oś czasu/Gantt** (compare-mode Old/New,
    czerwony ogon obsuwy, dryf +Nd/−Nd), **Kalkulator transz** (algorytm `_allocate`:
    alokacja proporcjonalna w groszach, reszta na ostatniej pozycji), **Import
    z rekoncyliacją** (diff + PASS/FAIL z jawnym dowodem co do grosza), **Billing US G703**
    (silnik `compute_proposals`: earned=D×M, próg depozytu 40%, clawback nieprzycinany).
  - Wszystko odbrandowane (zasada #3), dane fikcyjne, deterministyczne, client-side.
  - **Zostały (preview/soon):** Obieg przelewów (plan 14-dniowy — natura backendowa,
    pokazać macierz), Kontroling kosztów projektu (widok PM — duży, warto), Importy ERP
    (piszą przez Excel COM → tylko podgląd/TEST), Protokoły robocizny i Rejestr umów
    (obieg dokumentów — formularze + cykl życia jako symulacja).
- **2026-07-22 (sesja strony, cz. 3) — landing v0.7 + sekcja Narzędzia (decyzje Karola):**
  - **Poprawki UX decka:** kontakt = **stała stopka** (`FooterBar`, nie slajd); **KLAROW →
    slajd 0**; lepsze skalowanie slajdów (padding `clamp()` wg wysokości ekranu) i mobile
    (osobne wartości ≤640px, e-mail chowany, telefon zostaje).
  - **Fikcyjne moduły M1–M8 USUNIĘTE** (`modules.ts`, `ModulesGrid`, `ModulePage`). Slajd
    „Moduły" → **„Narzędzia"**.
  - **Nowa sekcja Narzędzia = rdzeń dowodu.** Katalog 12 narzędzi (`tools.ts`) +
    `ToolsGrid` + `ToolPage` (`/narzedzia/:slug`). **2 dashboardy DZIAŁAJĄCE NA ŻYWO**
    (100% client-side, dane fikcyjne): „Raport zarządczy" (reuse silnika CSV→raport) i
    nowy „Dashboard produkcji". Reszta: `preview`/`soon` (opis gotowy, dashboard w budowie).
  - **Źródło narzędzi:** prywatne repo blueprintów `github.com/bibaczebe/Kompleksowa-analiza-narz-dzi`
    — to **dokumentacja „jak odtworzyć od zera" ~30 narzędzi Nuconic**, NIE kod do kopiowania.
    Budujemy **odbrandowane** (zasada #3: zero marki/liczb Nuconic; nazwy generyczne, dane
    fikcyjne, opis „firma produkcyjno-budowlana"). TOP5 wykonalne client-side: Panel
    analityczny (=Raport), Oś czasu/Gantt, Dashboard produkcji, Audyt jakości (=M1),
    Import z rekoncyliacją. Cztery importy BT piszą do Excela przez COM → w przeglądarce
    tylko podgląd/TEST, nie zapis PROD.
  - **Do zrobienia dalej:** kolejne dashboardy live (Audyt jakości = wedge M1; Oś czasu/Gantt;
    Import z rekoncyliacją) — mapowanie w `tools.ts` (`status`, `dashboard`).
- **2026-07-22 (sesja strony, cz. 2) — landing v0.6: motion-graphic deck (decyzja Karola):**
  - Strona przerobiona na **statyczny deck** (zero scrolla dokumentu): scroll/swipe/klawiatura
    przełącza sekcje-slajdy z przejściem zoom+fade; tło GLSL Hills spowolnione i robi zoom
    w głąb per slajd; hero dostał przyciski szybkiej nawigacji; kropki sekcji po prawej.
  - **Żywe DEMO M2 zdjęte ze strony** — dowodem będą realne narzędzia, które Karol dostarczy
    (komponenty i silnik zostają w repo jako zapas do reużycia).
  - Zainstalowany skill **`motion-design`** (LottieFiles, wendorowany w `.claude/skills/`) —
    używać przy KAŻDEJ pracy nad animacjami/przejściami na stronie i w narzędziach.
  - **Plugin z mcpmarket NIE zainstalowany** — link instalacyjny wygasł (skrypt zwraca
    „invalid or expired"); Karol ma wygenerować świeży link albo podać nazwę serwera MCP.
  - Do zweryfikowania wizualnie na dev: przejścia na telefonie (swipe), zachowanie długich
    slajdów (FAQ/Moduły) na małych ekranach.
- **2026-07-22 (sesja strony) — landing v0.5 wdrożony na `main`:**
  - **Sekcja „Moduły" przerobiona na oś problemową** (karta = problem w głosie klienta →
    co dostajesz → co zyskujesz → dni → status; dział tylko jako filtr) — `ModulesGrid`.
    Karuzela orbitalna wycofana z użycia (plik zostaje jako zapas).
  - **Żywe DEMO M2 „Raport zarządczy" na landingu** (`#demo`, link w navbarze, hero-CTA):
    100% client-side, dane fikcyjne, wejście wklej/wgraj/przykład, wyjście 3 KPI + wykres
    per-etap + tabela z komentarzami PM + jawna „ścieżka wyliczenia" + eksport CSV.
    Odtworzone od zera (zero kodu z Nuconic). Spec: `docs/plan/demo-m2-spec.md`.
  - **Sekcja wyróżników** (`#wyrozniki`): prawdziwie zero chmury + determinizm, blok
    ✕ Tradycyjnie / ✓ Klarow, galeria 3 narzędzi z liczbą before/after (opis anonimowy).
  - Plan Karola odhaczony poza mini-case'ami („rozbiórka najgorszego Excela" — **do zrobienia**).
- **2026-07-22 — decyzje founderów:**
  - **Forma prawna:** start jako **JDG Pawła** (waliduj taniej, tani exit), konwersja do
    **2-osobowej sp. z o.o. 50/50** przy pierwszym płatnym kliencie. Powód JDG→Paweł: potencjalny
    zbieg z etatem (magazyn) = tylko składka zdrowotna; Karol (zlecenie + student w Nuconic) zostaje
    poza publicznym CEIDG. Do zrobienia: **porozumienie wspólników 50/50** + 1h u radcy (wzór umowy sprintu).
  - **Dowód bez Nuconic (WIĄŻĄCE):** nie publikujemy marki ani liczb Nuconic. Dowód budujemy z
    **własnych DEMO na danych fikcyjnych** + 2 mini-case „rozbiórka najgorszego Excela". Żywe DEMO =
    narzędzia **odtworzone od zera na wzór** wzorców (nie kopiowany kod).
  - **Drugi wyróżnik (obok on-prem):** „**prawdziwie zero chmury**" (zero API do LLM, zero serwera,
    działa w Excelu) + **determinizm** („kalkulator, nie wróżka"). Powód: on-prem już nie jest unikatem.
  - **Konkurent-bliźniak: MALINSKI.AI** — mocny (32 narzędzia, głęboki SEO), ale AI-hype, dane i tak
    lecą do API LLM + hosting, brak tożsamości założyciela, inna nisza (marketing/e-commerce).
    Gramy: wąsko-głęboko w produkcji/budownictwie, determinizm, prawdziwe zero-chmury, founder-led.
  - **Nowe pliki:** `docs/plan/plan-dzialania-karol.md`, `docs/plan/plan-dzialania-pawel.md`
    (checklisty na dziś); `prompt-wprowadzajacy-strona.md` (brief dla okna implementacyjnego strony).
- **2026-07-21:** domena `klarow.com` kupiona (Cloudflare). Mail: Cloudflare Email Routing
  (`kontakt@klarow.com` → prywatny Gmail) + wysyłka jako `kontakt@` przez Gmail „Wyślij jako"
  + Resend SMTP; SPF ✓, DKIM (Resend) ✓, DMARC `p=none` dodany (po ~tygodniu → `p=quarantine`).
  Telefon na stronie: **786 296 426**.
- **Brief `prompt-wprowadzajacy-seo-mobile.md` ZREALIZOWANY 2026-07-23** (sesja cz. 7 wyżej:
  mobile naprawione u źródła, prerender+sitemap+llms.txt+FAQPage wdrożone na produkcji).
  Resztki: zrzut `?debug=1` od Karola (domknięcie diagnozy — który wariant awarii WebGL),
  po ~tygodniu ocena efektów (Google Search Console — dodać property, jeśli brak);
  hreflang dopiero przy przejściu na trasy `/pl/` `/en/` (plan §4.2).
- **Do zrobienia** (szczegóły: `docs/plan/nastepne-kroki.md`): konto Cal.com →
  embed w `BookingModal`; umowa IP z Nuconic; mini-case'y „rozbiórka najgorszego
  Excela"; plugin MCP od Karola (link z mcpmarket wygasł); opisy i liczby od
  founderów; case study PL/EN; trasy `/pl/` `/en/` build-time (plan §4.2 —
  dopiero wtedy EN meta z toolsSeo.ts staje się widoczne dla Google + hreflang);
  Google Search Console (property dla klarow.com — mierzenie efektów SEO).

## Kontekst biznesowy w pigułce (pełnia: `docs/plan/plan-strategiczny.md`)

- Oferta wejściowa: **„Pilot na kopii"** — 1 proces, stała cena, ≤10 dni, płatność 50/50;
  hak przed sprzedażą: „przyślij nam swój najgorszy Excel" (30-min demo na próbce).
- Moduły fala 1 (sprzedawane dziś): M1 Audyt jakości danych (wedge, read-only),
  M2 Raport zarządczy. Fala 2: importy, zamknięcie cyklu, produkcja. Fala 3/roadmapa:
  panel KPI online, obieg dokumentów, płatności (AIA G703 → rynek USA).
- ICP: produkcja/budownictwo/dystrybucja 50–150 osób, Windows + Excel, „człowiek-Excel"
  jako wąskie gardło. Rynki: PL teraz, USA od ~6. miesiąca.
