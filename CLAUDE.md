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
| `.claude/skills/klarow-guardian/` | **STRAŻNIK ZASAD (nadrzędny nad wszystkimi skillami wizualnymi)** — 144 reguły z ID/severity/testem mechanicznym (`rules/`), `AGENTS.md` generowany, rejestry (dozwolone liczby, integracje, przekierowania, tokeny), zwendorowane wytyczne (WIG, writing, locki taste), checklisty, 8 skryptów bramek (`node`, nigdy `npx`), baseline długu. Wejście: `SKILL.md` (115 linii) |
| `.claude/agents/`, `.claude/workflows/`, `.claude/skills/ui-audit/` | **Audyt automatyczny** — 7 audytorów read-only + orkiestrator, workflow `/ui-audit` (bramki → audytorzy → weryfikacja adwersaryjna → naprawy mechaniczne → re-audyt → `INDEX.md`) |
| `.claude/skills/` (reszta) | `motion` (Motion AI Kit), `design-taste-frontend` + `minimalist-ui`/`high-end-visual-design`/`redesign-existing-projects`/`brandkit`/`imagegen-frontend-web`/`full-output-enforcement` (pakiet taste-skill), `react-best-practices`/`composition-patterns`/`react-view-transitions`/`web-design-guidelines`/`writing-guidelines` (Vercel), `bklit-ui`, `auto-animate`, `aceternity-ui`, `motion-design`, `lead-scout` |
| `.claude/skills/higgsfield-*` + `HIGGSFIELD-README.md` | **Skille i CLI Higgsfielda** (zainstalowane 2026-09-14). **Czytaj README PIERWSZE**: używamy `higgsfield-generate`; `higgsfield-websites` jest ZAKAZANY dla klarow.com (przepisałby stronę na infrastrukturę Higgsfielda), `higgsfield-soul-id` zakazany (trenuje na twarzy). CLI: `higgsfield` (`npm i -g @higgsfield/cli`) |
| `leadscout/` | **Agent pozyskiwania leadów** — baza `leads.json`, digesty na Telegram (@Klarow_BOT przez `notify.mjs`; token w `.env` POZA gitem), przewodnik źródeł `zrodla.md`, playbook outboundu, ranking kanałów marketingowych, kolejka rund `nastepne-rundy.md`. Uruchamianie: `/lead-scout` |

## Twarde zasady (obowiązują każdą sesję)

1. **Każda zmiana w `site/`, `ui-kit/`, `demo/`, copy i assetach idzie przez skill
   `klarow-guardian`** (`.claude/skills/klarow-guardian/SKILL.md`) — ładuj PRZED pierwszą edycją
   i przed commitem; on ma precedencję nad wszystkimi skillami wizualnymi (taste, high-end,
   minimalist, bklit, motion AI Kit = inspiracja, nie prawo). `company-ui` (`ui-kit/`) jest
   ŹRÓDŁEM HISTORYCZNYM: dobre nawyki przepisane do reguł strażnika, kit schodzi po migracji na
   `tokens.css`. Akcent: polerowana stal `#A8B4C2` jako JEDYNY akcent; primary CTA = płaska biel
   na czerni; **zero złota `#FFA914`** (stara marka Nuconic) i zero logo graficznego — znak marki
   to tekstowy wordmark `KLAROW` (klasa `.brand-word`, komponent `BrandMark`).
   Audyt: `/ui-audit` albo skrypty `node .claude/skills/klarow-guardian/scripts/*.mjs`.
2. **Ruch zależy od kontekstu (decyzja Karola 2026-09-13, odwraca dawne „wykresy statyczne"):**
   w **narzędziu** (dashboard, tabela, macierz, dokument) wykres pokazuje wynik, więc zostaje
   statyczny — krótki fade przy wejściu, zero „rysowania", kropki tylko informacyjne, bo tam
   animacja opóźnia odczyt liczby i podważa zaufanie do danych. Na **stronie marketingowej**
   (`/`, sekcje narracyjne) wykres MOŻE budować się wraz z postępem scrolla, bo nie jest źródłem
   decyzji, tylko opowieścią o tym, co narzędzie robi. Warunki: ruch sterowany postępem scrolla
   (tempo należy do użytkownika), tylko właściwości akcelerowane, gałąź `prefers-reduced-motion`
   pokazująca stan KOŃCOWY, zero przechwytywania zdarzeń scrolla. **Scroll-hijack pozostaje
   zakazany** (przechwytywanie `wheel`/`touchmove`, blokada `overflow` na `body`, przewijanie
   sterowane skryptem, slajdy przełączane gestem); sticky-scena, w której użytkownik scrolluje
   normalnie, jest dozwolona w granicach reguły `motion-no-pinning-no-scroll-hijack`.
   Wszystkie animacje szanują `prefers-reduced-motion`; tła animowane tylko na GPU
   (canvas/WebGL), z pauzą przy `document.hidden` i sprzątaniem rAF.
3. **Marka Nuconic nie może pojawić się publicznie** (strona, case, zrzuty) **przed umową IP**
   — patrz `plan-strategiczny.md` §5.2. Case opisujemy jako „firma produkcyjno-budowlana".
4. **Każdą skończoną zmianę commituj i pushuj na `main`** (`origin` = github.com/przeczkowskyy/Pawel_Karol_proj — wspólne repo Pawła i Karola).
   Komunikaty po polsku, stopka `Co-Authored-By: Claude ...`. Tożsamość gita ustawiona per-repo.
5. Teksty strony dwujęzycznie **PL + EN** (wzorzec: obiekt `{ pl, en }` + `pick()` z `src/i18n.tsx`).
6. Środowisko: Windows 11, PowerShell; Node 24, npm 11, Python 3. **Nauczki środowiskowe:**
   - **`npx` nie działa w tym repo, ale DZIAŁA ze scratchpada** — znak `&` w ścieżce katalogu
     łamie shimy cmd; katalog scratchpada sesji (`%LOCALAPPDATA%\Temp\claude\...`) go nie ma.
     Instalatory (`npx skills add …`, `npx motion-ai`, `npm i playwright-core`) uruchamiaj tam,
     a wynik kopiuj do repo. Workflow `resumeFromRunId` też przyjmuje `scriptPath` tylko
     z katalogu roboczego albo scratchpada. Wywołuj
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

- **Landing = zwykłe podstrony ze standardowym scrollem (v0.8, od 2026-07-26):** dawny
  „motion-graphic deck" (slajdy przełączane gestem scrolla/swipe/klawiaturą) **USUNIĘTY** —
  decyzja Karola: rozbicie na trasy o odrębnej intencji jest lepsze pod SEO. `SlideDeck.tsx`,
  `FooterBar`, `HASH_ALIAS`, event `klarow:home`, cała mechanika `.deck/.slide/.deck-footer/
  .deck-dots` (z globals.css) — skasowane. **Trasy (react-router, każda z własnym SEO):**
  `/` (home: hero + ból + wyróżniki + „zobacz konkrety"), `/narzedzia` (**hub**: 5 działów →
  12 kart), `/oferta` (pilot + dlaczego-dni + zaufanie + dla-kogo + współpraca), `/faq`,
  `/narzedzia/:slug` (12 podstron narzędzi — bez zmian). `ScrollToTop` scrolluje na górę przy
  zmianie trasy. Navbar linkuje do TRAS (nie `#hash`): Narzędzia/Oferta/FAQ; KLAROW → `/`.
  Kontakt = zwykła stopka `Footer` (na każdej podstronie) z linkami nawigacyjnymi.
- `src/App.tsx` — definicje sekcji + komponenty podstron (HomePage/ToolsPage/OfferPage/FaqPage)
  + routing + modal rezerwacji. SEO stron (title/description PL+EN) w `src/data/pagesSeo.ts`
  (jedno źródło — konsumuje je i klientowy `Seo`, i prerender; muszą być identyczne).
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
    `ORG_JSONLD` na /, /narzedzia, /oferta; `FAQPage` na /faq; `toolJsonLd`+FAQPage per
    narzędzie), title/description stron w `src/data/pagesSeo.ts` (jedno źródło dla klienta
    i prerenderu), `public/robots.txt`, meta w `index.html`; **prerender**
    `src/prerender/entry.tsx` + `scripts/prerender.mjs` (**17 statycznych HTML**: `/`,
    `/narzedzia`, `/oferta`, `/faq` + 13 × `dist/narzedzia/<slug>.html` — osobny shell z H1 i
    pełną treścią per strona, treść ROZDZIELONA między trasy bez duplikacji; `sitemap.xml` i
    `llms.txt` GENEROWANE z `tools.ts`+trasy przy buildzie — ręcznego `public/sitemap.xml`
    NIE MA, nie odtwarzać); treści long-tail + FAQ per narzędzie w `src/data/toolsSeo.ts`
    (merge w `getTools()`). **Nowa strona główna dopisana do `entry.tsx` `prerenderAll()`
    wpada do prerenderu i sitemapy automatycznie** (dla nowej trasy: dodać wpis do routes
    + link w Navbarze/stopce).
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
  bez remontu sceny WebGL) — tło „wjeżdża w głąb" z każdym slajdem. **Renderowane TYLKO na
  desktopie** — `App.tsx` `useAnimatedBg()` gasi canvas na `(pointer: coarse)` (telefony/tablety),
  bo iOS Safari komponował fixed canvas WebGL nad fixed treścią = „samo tło" (patrz Stan
  operacyjny 2026-07-24). Na mobile zostaje statyczny gradient `.bg-layer`.
- **Zapas (nieużywane, poza bundlem):** `radial-orbital-timeline`, `canvas-reveal-effect`.
- `src/styles/company-ui.css` — **kopia kitu** (aktualizacja = nadpisanie NAD markerem
  APP-SPECIFIC świeżą kopią z `ui-kit/.../app.css` + zamiana ścieżek fontów na `/fonts/`).
- `public/_redirects` — SPA-fallback dla podstron na Cloudflare Pages/Netlify.
- Docelowo (plan §4.2): treść do YAML w `site/content/` + trasy `/pl/` `/en/` build-time.

## Stan operacyjny (aktualizuj przy zmianach!)

- **2026-09-17 (redesign v3) — STRONA GŁÓWNA URUCHAMIA NARZĘDZIA; KONIEC MATERIAŁU GENERATYWNEGO:**
  - **Decyzja Karola, wiążąca:** efekt „wow" bierze się z tego, że strona URUCHAMIA prawdziwe
    narzędzia, nie z wygenerowanej ilustracji. Dwa podejścia odrzucone pod rząd: kreskówkowe
    sceny (13.09) i pionowy pas z pętlami (15.09) — „te gify zupełnie nam nie wyszły. Źle
    wyglądają, zupełnie źle mi się to czyta". **Diagnoza:** oba budowały wrażenie z rzeczy bez
    związku z produktem, więc nawet wykonane bezbłędnie byłyby dekoracją obok treści.
  - **TO BYŁO PRZEWIDZIANE I ZIGNOROWANE.** `docs/plan/strona-v2-plan.md` (180 KB, 17 agentów,
    trzech sędziów, 11–12.09) w decyzji **D37** odrzucił pętlę generatywną słowami: „pętla
    abstrakcyjna jest tylko ruchem i przy tej personie (kalkulator, nie wróżka) niesie ryzyko
    »widać, że to AI« oraz efektu stocku". Odwrócenie tej rekomendacji wieczorem 12.09
    kosztowało cztery dni i 84 kredyty. **Nauczka: gdy adwersaryjnie zrecenzowany plan mówi
    „nie rób X", a founder prosi o X, to jest moment na rozmowę, nie na wykonanie.**
  - **Rynek potwierdza kierunek liczbowo** (research 09.2026): odwiedzający, który dotknie
    interaktywnego dema, konwertuje **24,35 %** wobec **3,05 %**; taki hero ma **18 %** stron
    B2B. Konkurent MALINSKI.AI sprzedaje „32 narzędzia w produkcji", ale je **opisuje** —
    Klarow ma dwanaście liczących na żywo i trzymał je schowane na podstronach.
  - **Motyw wrócił na ciemną stal.** Tanie, bo ciemny jest wartością domyślną `:root`
    w `tokens.css`, a jasny był nadpisaniem `[data-theme="light"]`. Reguła
    `design-page-theme-lock` przepisana po raz trzeci (z datą i cytatem, jak zawsze) i przy
    okazji **scalona wewnętrznie**: od 13.09 jej nagłówek mówił „jasna", a sekcje „Poprawnie"
    i „Test" nigdy nie zostały zaktualizowane i opisywały ciemną.
  - **Nadpisanie `.btn-primary` uogólnione** z `html[data-theme="light"]` na `html`: kit ma
    gradient stalowy wpisany na stałe, co łamie `brand-single-accent-steel`
    i `design-no-glass-no-blur` w OBU motywach, nie tylko w jasnym.
  - **Nowa `/`:** `pages/HomeV3.tsx` + `components/home/{HeroV3,SectionBlock,ToolTabs}`,
    copy w `data/homeSections.ts`. Hero = żywy pulpit produkcji z działającym suwakiem;
    sekcja pliku = `DemoReport` przyjmujący wklejkę i CSV; zakładki = 12 dashboardów,
    **jeden montowany naraz** (dwanaście drzew Reacta zjadłoby INP na telefonie).
  - **SEO URÓSŁ, nie spadł:** statyczny HTML `/` ma **1272 słowa** (było 1062) i **13 linków**
    do podstron narzędzi (było 0 poza blokiem „Zobacz konkrety"). `HomeShell` czyta ten sam
    moduł co klient, więc cicha awaria z 13.09 nie może wrócić.
  - **Budżety:** strona główna to **4,5 KB gz JS + 0,8 KB gz CSS**, oba lazy. CSS krytyczny
    **18,05 → 16,3 KB gz** (zapas do limitu 4,2 KB). **CSS, nie JS, jest tu najciaśniejszy** —
    JS ma 49 KB zapasu przy 126,0 z 175 KB.
  - **PUŁAPKA ZMIERZONA, NIE PRZECZYTANA:** bramka `motion-bundle-budget-motion` sprawdza chunk
    z „motion" **w nazwie pliku** (`verify-site.mjs:297`), a Vite takiego chunku nie emituje —
    Motion siedzi w `index-*.js`. **Bramka nigdy nie wystrzeliła i dziś nie chroni niczego.**
    Do naprawy: detekcja po treści chunku + `manualChunks`. Nie sugerować się nią jako
    zabezpieczeniem budżetu.
  - **Usunięte:** `src/presentation/**` (25 plików), `pages/Presentation.tsx`,
    `data/presentation.ts`, `public/media/presentation/**` (24 pliki), `pages/Home.tsx`,
    `HeroMedia.tsx`, `Differentiators.tsx`, `ui/glsl-hills.tsx`, `BgBoundary.tsx`,
    589 linii martwego CSS, zależności `three`, `@types/three`, `@formkit/auto-animate`.
  - **Dalej (plan: `.claude/work/redesign-v3/plan.md` i `~/.claude/plans/gentle-tickling-squid.md`):**
    F3 pipeline lokalny brudnych arkuszy (maskowanie struktury, plan czyszczenia, zwrot
    uporządkowanego pliku), F4 UI instrumentu, F5 podstrony narzędzi dashboard-first.
    **Planer zdalny (Pages Function + Anthropic) NIE wchodzi**, dopóki wersja w 100 % lokalna
    nie będzie działać; wtedy wymaga przepisania `integ-no-llm-api-in-client-tools` (BLOCKER,
    zakazuje wywołania **każdego** serwera Klarow, nie tylko API modelu) w kolejności:
    rejestr → `/rodo` → decyzja → status i CSP → kod.
  - **Otwarte decyzje:** `.xlsx` w fazie 1 (+2 dni) czy tylko CSV i wklejka; dane administratora
    do `/rodo` (bloker publikacji od 12.09); los 13 podstron w nawigacji (D-39).

- **2026-09-15 (pionowy pas) — PRZELOTY DRONEM ODRZUCONE; STRONA GŁÓWNA TO JEDEN CIĄGŁY OBRAZ:**
  - **Co odrzucił Karol i dlaczego to było strukturalne, nie jakościowe:** wygenerowaliśmy komplet
    siedmiu przelotów łączących kadry sąsiednich scen (image→video ze start- i end-frame).
    Werdykt: „Animacje nie są płynne. Wyglądają generatywnie. Podczas przejść, przejścia po
    budynku są nierealne." Przyczyna: przelot KAŻE modelowi wymyślić przestrzeń między dwoma
    kadrami, a wymyślona architektura nie ma prawa się zgadzać. W jednym klipie (Wan 3.0) model
    dorobił drzwi, których nie było ani w klatce startowej, ani końcowej.
  - **NOWY UKŁAD (decyzja Karola):** „Zrobimy jeden wielki obraz połączony z tych 8 faz (...)
    Każde pojedyncze z tych zdjęć będzie POWTARZAJĄCYM SIĘ ŁAGODNIE GIFEM. Nie ma przejść po
    korytarzach żadnych. (...) Scroll nie triggeruje jakichś dodatkowych animacji." Osiem kadrów
    tego samego wnętrza leży jeden pod drugim jako jeden pionowy pas; **szwem jest pozioma
    drewniana belka u góry każdego kadru**, a dół każdego kadru to celowo pusty pas podłogi.
    Styk czyta się jako podłoga górnego pomieszczenia i belka, która ją niesie.
  - **MECHANIKA JEST W UKŁADZIE, NIE W SKRYPCIE.** Każda scena to wiersz siatki (tekst | kadr),
    sceny leżą bez przerw, więc prawe komórki kafelkują się w ciągły pas i jadą z dokumentem.
    Zero nasłuchu scrolla, zero `transform` sterowanego scrollem, **zero `position: sticky` na
    całej stronie**. Zweryfikowane w przeglądarce: sceny na 0, 900, 1800, 2840… px — styk co do
    piksela. Skasowane: `StageMedia.tsx` (przyklejona kolumna), `SceneVideo.tsx` (film przewijany
    scrollem), `SceneFallbackMedia.tsx` (martwy), stare kadry `scene-*-v4.webp`.
  - **`object-position: center top` JEST WARUNKIEM CIĄGŁOŚCI, nie estetyką.** Komórka rzadko ma
    dokładnie proporcję 1:1 mastera, więc `cover` musi coś uciąć; `center top` ucina wyłącznie
    dół, czyli zaprojektowany pusty pas podłogi. Przy `center center` przycięcie zjadałoby
    połowę belki i pas rozjeżdżałby się przy innej proporcji okna.
  - **NAJDROŻSZA NAUCZKA O PĘTLACH (trzy próby po 6 kr):** model **powiększa to, co każe mu się
    poruszyć**, i **pokazuje to, czego ruch nazwiesz**. Próba 1: „kolorowe wstążki przy uchwytach
    skrzyń kołyszą się" → wstążki urosły w wiszące w powietrzu szarfy. Próba 2: „palce
    poprawiają chwyt na skrzyni" → model **przeciął na wielkie zbliżenie dłoni**. Próba 3
    (przyjęta): rusza się **wyłącznie powietrze, światło i para**, ludzie zamarzają zdaniem
    twierdzącym („every person stays exactly as they are"). Zero wymyślonych obiektów, zero cięć.
  - **PĘTLA DOMYKA SIĘ MONTAŻEM, NIE OBIETNICĄ MODELU.** Materiał generatywny nie wraca do klatki
    startowej (zmierzone odchylenie do 178/255 lokalnie). Rozwiązanie za 0 kredytów: **przytnij
    do fragmentu sprzed ucieczki** (profil odchylenia od klatki zerowej pokazuje, gdzie model
    przestaje animować i zaczyna wymyślać — u nas para z czajnika rosnąca w chmurę i smuga
    światła przejeżdżająca przez pokój), potem **zmontuj tam i z powrotem** (`reverse` z odciętą
    zdublowaną klatką na zawrocie). Pętla domyka się wtedy matematycznie. Gotowe pliki: różnica
    pierwszej i ostatniej klatki < 2,5/255, czyli sam dithering.
  - **JEDEN DEKODER, NIE OSIEM** (`presentation/loopConductor.ts`): panele meldują widoczność,
    dyrygent puszcza ten, którego widać najwięcej, i pauzuje resztę; karta w tle pauzuje
    wszystkie. Zweryfikowane w Chromium: 8 `<video>` w DOM, **1 grające**. Plus przycisk pauzy
    `.pr-pause` (WCAG 2.2.2), stan wspólny z `HeroMedia` przez `sessionStorage`.
  - **Reguły strażnika PRZEPISANE, nie obejście** (jak przy jasnym motywie): `media-one-autoplay-per-route`
    (limit z „jednego ELEMENTU w DOM" na „jeden GRAJĄCY dekoder"; wyjątek na pętle generatywne
    **wyłącznie na trasie `/`**), `media-video-placement` (dopisany `.pr-panel` jako trzecie
    dozwolone miejsce — nie tworzy ani kontekstu stackingu, ani bloku zawierającego dla `fixed`),
    `media-video-budgets` (wiersze paneli + podbudżet 1,75 MB na trasę `/`). **146 reguł.**
  - **Zmierzony transfer:** desktop pełna wizyta **2,15 MB** (webm) / 1,97 MB (mp4) wobec limitu
    2,5 MB; mobile **262 KB** wobec 350 KB i **0 B wideo** — bo `.pr-panel` ma `display: none`
    poniżej 64rem, a `<img loading="lazy">` w kontenerze `display: none` nie jest pobierany.
    **Zamiana tego `display: none` na `visibility`/`opacity` cicho wysadziłaby budżet mobilny.**
  - **Koszty Higgsfielda (zmierzone, nie z cennika):** `gpt_image_2_5` 2k high = **3 kr**,
    `seedance1_5` 4 s 1080p = **6 kr** (choć `generate cost` podaje 12 — wierzyć saldu, nie
    kalkulatorowi). Cała strona: 8 kadrów (24) + 8 pętli + 2 próbne (60) = **84 kr**.
    **Zostało 10,5 kr** — na kolejne generacje potrzebne doładowanie.
  - **`components/HeroMedia.tsx` jest MARTWY** — żadna trasa go nie renderuje od przebudowy na
    prezentację. Zostawiony świadomie (referuje do niego `data/media.ts` i okno c1), ale to
    znaczy, że **slot „jedno autoodtwarzanie hero" jest pusty** i pętle prezentacji go nie zajęły.
  - **Nauczka narzędziowa:** heredoc `<<'EOF'` w tym środowisku potrafi zjeść cytaty i ukośniki
    w dłuższych plikach TSX — do plików źródłowych używać Write/Edit, heredoc zostawić skryptom
    powłoki. Do klatek z mp4 jest teraz **systemowy ffmpeg** (`Gyan.FFmpeg`, z libx264/libvpx/
    libwebp) — nie trzeba już zrzucać klatek przeglądarką jak w sesji 2026-09-13.

- **2026-09-14 (pakiet promptów) — OSIEM PROMPTÓW GOTOWYCH PO TRZECH RUNDACH KRYTYKI:**
  - `docs/plan/prezentacja-scenariusz.md` §4 (wersja 4) — komplet pod **jasną kreskówkę**,
    nie pod papierowy kolaż (banner korygujący na górze dokumentu; §1 jest historyczna).
  - **35 agentów, trzy rundy adwersaryjne**: autorzy stylu → autorzy scen → trzech
    niezależnych krytyków (soczewki: technika, narracja, spójność) → naprawy → ponowna
    krytyka → naprawy → ponowna krytyka. **Blokujących: 10 → 3 → 1 → 0.**
  - **TRZY NAUCZKI O PROMPTOWANIU WIDEO, kosztowały trzy rundy — nie zgubić:**
    **(a) Model wideo NIE wykonuje negacji jako wykluczenia.** Lista rzeczowników po
    „never" działa jak podpowiedź tematu. Zakaz `never a silhouette` stał 8× w kluczu
    stylu i SAM zamawiał ciemną sylwetkę w dolnej połowie kadru, czyli dokładnie tam,
    gdzie leży tekst strony. **Opisuj twierdząco**, nigdy przez zakaz.
    **(b) Akcent musi mieć zablokowaną FORMĘ, nie tylko znaczenie.** „Granat znaczy drogę
    pracy" bez zakazu formy dało litą szynę, tacę i zegar — trzy znaczenia i ciemne bryły.
    **(c) Blokada skali kłóci się z ruchem kamery** — wiązać skalę z kadrem OTWARCIA.
  - **Spójność ośmiu klipów = bloki kanoniczne wklejone DOSŁOWNIE, tym samym ciągiem
    znaków.** Model nie wie nic o pozostałych ujęciach; parafraza = dryf stylu.
  - **Narracja filmu:** bohaterem jest GRANATOWA LINIA = droga, którą idzie praca.
    Wąski zsyp (hook) → linia porwana nad lukami (handover) → wyprzedzona przez czas
    (time) → ręce zajęte zbieraniem (cost) → **ludzie budują trasę własnymi rękami**
    (turn, oś filmu) → linia nieprzerwana pod sześcioma działami (craft) → ta sama hala
    bez luk (outcome) → linia wyrasta ze skrzynki klienta (contact).
  - **Zakaz, który krytyk narracji uratował:** scena `turn` miała skrzynię jadącą
    „untouched by any hand" obok ludzi z opuszczonymi rękami. Formalnie zgodne z regułą,
    ale obraz mówił „zwolniliśmy wam ludzi". Przepisane: to ludzie stawiają tę trasę.

- **2026-09-14 (plany Higgsfielda) — STARTER $19 WYSTARCZA; CLI I SKILLE ZAINSTALOWANE:**
  - **Karol: „PLUS po podatkach wychodzi około 300 zł/mies."** Sprawdzone: w MCP nie ma
    w ogóle planu Starter (tylko PLUS $49 i ULTRA $129, pakiety doładowań puste), ale
    **na stronie higgsfield.ai jest STARTER $19/mies. z 270 kredytami** — i on nam wystarczy.
  - **Rachunek na nasz przypadek** (z tabeli porównawczej wyciągniętej z DOM, kolumnowo):
    8 klipów × 10 s na `Kling Omni 3 Image Reference 1080p` (~7 kr/5 s) = **~112 kredytów**,
    plus ~20 prób obrazu-klucza (Seedream / GPT Image, 1 kr/obraz) = **~20–40 kr**.
    Razem **~130–150 kr** przy limicie **270 kr/mies.** Czyli pełne podejście i prawie cała
    runda powtórek. **„Commercial use" jest w Starterze WŁĄCZONE** (w Free go nie ma) — wolno
    tego użyć na klarow.com.
  - **Co Starter zawiera z modeli wideo** (zweryfikowane kolumnowo, nie z płaskiego tekstu):
    Kling Omni 3 Image Reference 720p i **1080p**, Kling Omni 3 FLF, Kling 3.0 **tylko 720p**,
    Seedance 1.5 do 1080p, Wan 3.0, Grok Video, Kling 2.6. **Czego NIE ma:** Seedance 2.0 i 2.5
    w ogóle, Kling 3.0 w 1080p/4K, promocje „unlimited". Równoległość 2 zadania zamiast 6.
  - **Model z referencją obrazu JEST w Starterze w 1080p** i to jest jedyna rzecz, która
    naprawdę musiała tam być: technika „jeden klucz stylu → każdy klip się do niego odwołuje"
    (patrz `docs/plan/prezentacja-scenariusz.md` §4.1) bez niej nie działa.
  - **Ceny są BEZ VAT** („Prices exclude VAT and local taxes, calculated at checkout") — stąd
    rozjazd między $49 a ~300 zł, który zauważył Karol.
  - **PUŁAPKA MCP vs WEB:** „Unlimited models and Free Generations are accessible only via
    higgsfield.ai and are **not** accessible on MCP/CLI, Canvas or Supercomputer." Czyli kto
    kupuje PLUS dla 7-dniowego unlimited Kling 3.0, dostaje go WYŁĄCZNIE na stronie, nie w CLI.
  - **`higgsfield generate cost <model>` potwierdza rachunek PRZED wydaniem kredytów** —
    używać zawsze przed pierwszą generacją.
  - Zainstalowane: CLI `@higgsfield/cli` 1.1.24 (pakiet zweryfikowany w rejestrze npm przed
    instalacją globalną) + 8 skilli. Logowanie OAuth robi founder w przeglądarce.
    **Nigdy nie uruchamiać `higgsfield auth token`** (drukuje sekret).

- **2026-09-13 (sesja „strona = prezentacja") — STRONA GŁÓWNA TO BROSZURA; NARRACJA PRZEPISANA:**
  - **Trasa `/` renderuje `<Presentation>`**: osiem scen przewijanych w jednym ciągu, bez zakładek
    (`src/presentation/` = silnik: `Stage`, `Scene` ze sticky i sprężyną, `SceneVideo` przewijane
    scrollem, `SceneFallbackMedia`; `src/presentation/scenes/` = treść). Menu w `Navbar` jest PUSTE
    celowo — trzynaście podstron narzędzi żyje dalej, jest w sitemapie i łapie ruch, ale nie
    zabiera uwagi. Tło WebGL zgaszone na `/` (przebijało się przez wszystkie sceny naraz).
  - **Narracja v2 (po odrzuceniu v1 przez Karola):** problem zostaje, ale bohaterem jest
    **przekazywanie pracy między ludźmi**, nie plik. Słowo „Excel" nie pada na stronie ani razu.
    Wypadły: scena z 88 % arkuszy z błędem (liczba prawdziwa, zła historia) i ściana trzynastu
    zrzutów z narzędzi („Nie musimy przedstawiać już narzędzi które zrobiłem"). Weszły: `handover`
    (praca stoi między ludźmi) i `craft` (rodzaje pracy przekrojowo przez działy, BEZ zrzutów).
    Została jedna liczba: 121 000 zł/rok za etat kontrolera z działaniem `8 350 × 12 × 1,2048`.
  - **Gęstość treści zamiast minimalizmu (zmiana zasady!):** scena ma teraz nagłówek + akapit
    (60–120 słów) + trzy rzeczy sprawdzalne. Strona główna: **1025 słów w statycznym HTML** (było 65
    w całej prezentacji). Powód: referencja Karola `automatyzacje.ai` ma ~1900 słów na jednej
    stronie i to JEST cały mechanizm jej pozycji w Google — nie technika, tylko gęstość.
  - **NAPRAWIONY CICHY BŁĄD:** `prerender/entry.tsx` `HomeShell` wypisywał jeszcze stare hero
    z kadrem produktu, choć `/` renderuje prezentację od dnia przebudowy. Crawler bez JS dostawał
    INNĄ stronę niż człowiek. Shell odtwarza teraz osiem scen z `data/presentation.ts`.
    **Nauczka ogólna: po każdej zmianie tego, co renderuje trasa, sprawdź jej shell w prerenderze.**
  - **Kierunek wizualny ROZSTRZYGNIĘTY researchem:** obie referencje Karola (`automatyzacje.ai`
    oraz film o motion graphics → styl „Editorial Motion Graphics" w katalogu Higgsfielda) to
    **ta sama estetyka**: kremowy papier, szare wycinanki halftone, JEDEN akcent, hairline zamiast
    boxów. Szczegóły i osiem gotowych promptów: `docs/plan/prezentacja-scenariusz.md`.
  - **MOTYW JASNY WDROŻONY (D-36 i D-37 ROZSTRZYGNIĘTE przez Karola 2026-09-13):**
    „Wychodzimy ze stylu ciemnego. Wchodzimy w cartoon jasny, przyjemny dla oka. KLAROWny."
    `<html data-theme="light">`, powierzchnie ocieplone na papier (`--background #F7F5F1`,
    `--surface-raised #F2EFE9`). **Akcentem zostaje STAL, tylko jej ciemny koniec `--steel-700`**
    (7,24–7,88 na papierze; stal 300 na bieli miała 2,11) — czyli kolor JEST, a reguła
    `brand-single-accent-steel` NIE jest łamana. Główne CTA: płaska czerń na papierze
    (kit miał `.btn-primary` jako stalowy gradient pod czerń, biały tekst 1,9:1 — nadpisane
    tokenami w globals.css). **Animowane wzgórza WebGL ZDJĘTE** (ciemny pejzaż 3D nie do
    doświetlenia; z bundla wypadł three.js, 116 KB gz). Reguła `design-page-theme-lock`
    PRZEPISANA (nie obejście): zapisywała wcześniejszą decyzję tego samego człowieka.
    Koszt okazał się niski, bo `tokens.css` miał już komplet `[data-theme="light"]`
    z policzonymi kontrastami — podstrony z dashboardami przeszły bez zmian w komponentach.
  - **NAUCZKA, KTÓRA KOSZTOWAŁA ZRZUT:** warstwy nad materiałem (zasłona sceny, tło zastępcze)
    składane wprost z prymitywu (`rgba(var(--gray-975-rgb), .72)`) nie znają motywu i po zmianie
    kierunku zostają czarne na jasnej stronie. Służą do tego `--veil-rgb`, `--veil-1..3`,
    `--media-tint-rgb`. **Krycie zasłony też zależy od motywu:** ciemna musi być gęsta, jasna
    rzadka, bo gęsta biel na jasnym tle daje biel i zjada kolor papieru. Konsekwencja przy
    zamawianiu materiału: **kontrast tekstu gwarantuje teraz JASNY klip, nie zasłona.**
  - **OTWARTE DECYZJE FOUNDERA:** **D-37b** wybór stylu kreskówki (rekomendacja: „2D Illustrator";
    UWAGA: podglądy presetów w katalogu NIE zgadzają się z nazwami, więc wybierać po klatkach,
    nie po nazwie), **D-38** Higgsfield PLUS na jeden miesiąc, **D-39** los trzynastu podstron
    narzędzi, oraz wciąż dane administratora do `/rodo` (twardy bloker publikacji i outboundu).
  - **Nauczki narzędziowe:** strony SPA (jak `automatyzacje.ai`) czytać Playwrightem ze scratchpada,
    bo `WebFetch` zwraca pustą skorupę. Ffmpeg z Playwrighta **nie ma dekodera H.264** — klatki
    z mp4 zrzucać przeglądarką (`<video>` + `currentTime` + screenshot). Bramka `audit-static.mjs`
    liczy cały dług, dopóki nie poda się `--baseline .claude/skills/klarow-guardian/baseline/*.jsonl`.
    Build SSR MUSI mieć `--outDir dist-ssr --emptyOutDir` (bez tego czyści `dist/`) — używać
    `npm run build`, nie składać komendy ręcznie.

- **2026-09-11/12 (sesja „strona = CV firmy" + strażnik) — PLAN v2, STRAŻNIK I AUDYT GOTOWE; KOD `site/` NIETKNIĘTY:**
  - **Zakres sesji:** deep research (17 agentów: audyt strony, kit, bklit-ui, motion.dev, Manus,
    taste-skill, skille Vercel, Higgsfield, portfolio founderów, strategia → 3 koncepcje strony →
    3 sędziów → synteza) + budowa dokumentów decyzyjnych i warstwy kontroli (15 agentów: autorzy →
    krytycy adwersarialni → poprawki → integracja). Nic w `site/src` nie zostało zmienione.
  - **Wygrała koncepcja „editorial" (23,5 pkt vs proof 21,5, showreel 16)** — strona jak monografia
    studia: hairlines zamiast boxów, 9 sekcji, 0 eyebrow, hero 4 elementy, JEDNO wideo na witrynę,
    zero pinowania/parallaxu/decka. Do niej 21 przeszczepów z przegranych koncepcji (m.in. podstrona
    narzędzia dashboard-first, subtext hero z enumeracją typów pracy, `KsefFlow`, biały płaski CTA,
    5 kroków z „Zakres zamrożony", `WipeCompare` w fazie 2) + OBOWIĄZKOWA sekcja **„Co osiągniesz"**
    (czego nie miała żadna koncepcja: brief mówi „co firma klienta osiągnie").
  - **Dokumenty dla founderów:** `docs/plan/strażnik-i-audyt-README.md` (mapa, czytać pierwsze),
    `docs/plan/strona-v2-plan.md` (112 KB: trasy, copy PL+EN sekcja po sekcji, design system v3,
    system motion, assety, refaktor, SEO, prawo, fazy F0–F5, ryzyka, KPI),
    `docs/plan/decyzje-founderow-v2.md` (24 decyzje z rekomendacją i wyborem domyślnym + fakty
    blokujące). **Estymata 15–18 dni roboczych**, ścieżka krytyczna = decyzje, dane administratora
    do `/rodo`, portrety i bio, przegląd assetów po trialu, umowa IP.
  - **Strażnik `klarow-guardian`** (`.claude/skills/klarow-guardian/`): **144 reguły** (38 BLOCKER,
    74 HIGH, 29 MEDIUM, 3 LOW) w 14 sekcjach, każda z ID, mechanizmem awarii, przykładami
    Niepoprawnie/Poprawnie i **testem mechanicznym**; `SKILL.md` 115 linii (progressive disclosure),
    `AGENTS.md` generowany przez `build-index.mjs`; rejestry: dozwolonych liczb (każda liczba
    publiczna ma źródło), integracji zewnętrznych, przekierowań, tokenów; zwendorowane WIG i writing
    guidelines Vercela + dosłowne locki z taste-skill; `pain-tested.md` (nauczki sprawdzone bólem).
  - **Audyt automatyczny:** 7 audytorów read-only + orkiestrator w `.claude/agents/`, workflow
    `.claude/workflows/ui-audit.js` i skill **`/ui-audit`** (bramki skryptowe → audytorzy równolegle →
    weryfikacja adwersaryjna HIGH/BLOCKER → naprawy WYŁĄCZNIE mechaniczne → re-audyt → `INDEX.md`).
    8 skryptów bramek (`node`, nigdy `npx`): `audit-static`, `verify-site`, `find-integrations`,
    `check-secrets`, `screenshots`, `build-index`, `hook-pre-tool` (+`--selftest` 21/21),
    `hook-post-edit`. **Hooki NIE są zarejestrowane** — `settings.json` celowo nietknięty (decyzja D-24).
  - **Baseline długu 2026-09-12:** 767 findings wyciszonych jako znany dług, ale **6 BLOCKER nigdy
    nie jest wyciszanych**: 2× `performance.now` w `DemoReport.tsx:259,262` (do oznaczenia
    `// determ-exempt` albo usunięcia) i 4× słowo „AI" w copy sprzedażowym (`tools.ts:644,658`,
    `toolsSeo.ts:628,652` — bullet „opcjonalny asystent AI" przy KSeF, schodzi w F3, decyzja D-04).
  - **Nowe skille zainstalowane:** pakiet **taste-skill** (`design-taste-frontend` i 6 innych —
    instalacja `npx skills add Leonxlnx/taste-skill` uruchomiona ZE SCRATCHPADA, bo `&` w ścieżce),
    **skille Vercel** (`react-best-practices`, `composition-patterns`, `react-view-transitions`,
    `web-design-guidelines`, `writing-guidelines`; `vercel-optimize` USUNIĘTY jako nieprzydatny —
    wymaga Vercel CLI, a hostujemy na Cloudflare), **bklit-ui** (wzorzec formatu skilla),
    **Motion AI Kit** (`/motion` + agent `motion-reviewer` + `mcp.example.json`).
  - **Fakty zweryfikowane w tej sesji (nie z pamięci):** `motion` = 13.2.0 (npm, import `motion/react`);
    **React 19.3.0 stable eksportuje `ViewTransition`, `addTransitionType`, `Activity`** (sprawdzone
    w `node_modules` — canary NIE jest potrzebne, ale upgrade zostaje na fazę 2); `react-router-dom`
    7.18.3; MCP „claude.ai creative engine" **jest bramką do Higgsfield** (konto free, 0 kredytów;
    plan: trial 100 kr za $0 → PLUS $49 na jeden miesiąc, ULTRA niepotrzebne).
  - **Koordynacja z drugim oknem Claude Code (`karol-pawe-app-c1`, research prawno-rynkowy):**
    (1) **Trasa `/rodo` jest twardym blokerem prawnym** (art. 14 RODO, precedens Bisnode 943 470 zł
    potwierdzony przez NSA, plan kontroli UODO 2026) — bez niej nie wolno wysłać ani jednego
    kontaktu handlowego; wchodzi do F0 jako 18. plik HTML (`noindex`, poza sitemapą do przeglądu
    radcy), `/polityka-prywatnosci` = 301 na `/rodo`; treść musi podawać KONKRETNE źródła danych
    i wyróżniać prawo sprzeciwu ODRĘBNIE (art. 21 ust. 4). (2) **Refaktor `site/src/lib/pdf.ts` →
    `pdfDoc.mjs` robi okno c1 PIERWSZE** — my nie dotykamy `pdf.ts`, `PdfButton.tsx` ani
    `dashboards/*.tsx` w fazie 1 (tylko `React.lazy` z zewnątrz). (3) **PDF zostaje na Roboto**
    (decyzja B; parametr `PdfDoc.font`); ewentualny krój UI w PDF = TRZY statyczne TTF
    (Regular 400 + Bold 700 + Italic 400, kursywa używana w bloku `quote`); pdfmake nie czyta
    WOFF2 ani fontów variable. (4) **Ograniczenia copy:** zakaz „raportu Deloitte/IDC" (liczba bez
    źródła), zakaz framingu odejmowania etatu, zero „AI" w sprzedaży, formularze bez domyślnych
    zgód, newsletter tylko double opt-in; liczby dozwolone (Sedlak 2026, Panko 88 %, McKinsey 2012)
    zapisane w `references/allowed-numbers.md`.
  - **DO ZROBIENIA NAJPIERW (blokuje F0):** spotkanie decyzyjne nad 24 decyzjami (domyślne wybory
    obowiązują przy braku odpowiedzi); dane administratora JDG do `/rodo`; **sprawdzić, czy repo
    GitHub jest publiczne** (jeśli tak, `docs/nuconic-ekosystem-referencja.md` i ten plik łamią
    zasadę #3 niezależnie od strony); **`leadscout/leads.json` (śledzony przez gita) zawiera jedną
    skrzynkę funkcyjną `rodo@…` z publicznego ogłoszenia i JEDNO nazwisko w `uwagi_weryfikacji`**
    (zweryfikowane przez okno c1; pola `hook` są bezosobowe) — dwie linie do wycięcia, a przed
    ewentualnym upublicznieniem repo także czyszczenie historii (`git filter-repo`), bo commit
    z 2026-07-23 już je zawiera i usunięcie z HEAD nic nie da. **Zasada podziału danych (od c1):**
    `leads.json` tylko dane podmiotów (nazwa, NIP/REGON/KRS, PKD, adres siedziby, sygnały, oceny);
    nazwiska, role i LinkedIn wyłącznie w `decydenci.local.json` POZA gitem; `suppression.json`
    z kluczami jako SHA-256, nigdy plaintext; `kontakt_historia` bez treści i nazwisk. Powód:
    historia gita jest niekasowalna, więc czyni nieusuwalnymi dane, które art. 17 i 21 RODO każą
    usunąć na żądanie. Dalej: rotacja klucza Anthropic z appki KSeF; portfolio i zdjęcie Pawła.

- **2026-07-27 (sesja reframe „szeroki wachlarz" + KSeF + redesign) — POZYCJONOWANIE ZMIENIONE:**
  - **Reframe z „12 gotowych narzędzi (menu)" na „budujemy custom pod proces — oto DOWODY"**
    (decyzja Karola: sztywna lista sugerowała zamknięty katalog, co myliło). Hero sygnalizuje
    wachlarz (chipy ikonowe), nowa sekcja home **„Co możemy zbudować"** (6 kafli ikonowych +
    „nie mamy zamkniętego katalogu"), pasek **„Co już zrobiliśmy"** (4 statystyki). Zakładka
    Narzędzia = **„Przykłady realizacji"** (nie menu): karta = ikona + nazwa + krótki HOOK + badge.
  - **Redesign „mniej tekstu, więcej ikon" (dyrektywa Karola):** Hero odchudzony (długi lead +
    proof + qualifier + quicknav → krótki lead + chipy ikonowe). Karty narzędzi pokazują HOOK
    (2–6 słów; mapa `HOOKS` w `tools.ts`) zamiast długiego tagline'a (tagline zostaje na
    podstronie). Wszystko w kicie `company-ui` (chipy `.st`, ikony lucide, akcent stalowy).
  - **KSeF dodany jako REALIZACJA** (`kind: "case"`, slug `kontroling-ksef`, dept `kontroling`):
    read-only integracja kontrolingowa z oficjalnym API KSeF (MF) — parser FA(3), budżet vs
    wykonanie, prognoza cashflow 13 tyg., raporty XLSX, on-premise (Flask+SQLite+React). Model
    `tools.ts` rozszerzony: **`kind: "demo"|"case"` + opcjonalny `dashboard`**; `case` = brak
    żywego dashboardu (badge WDROŻONE `st-blue`, panel „jak działa" zamiast dema; ToolPage i
    prerender ToolShell rozróżniają kind). Źródło: `C:\Users\bibac\OneDrive\KSeF app` (własny
    produkt Karola „Kokpit KSeF") — na stronie ODBRANDOWANE (bez nazwy produktu/domeny).
    **⚠️ W `.env` tamtej appki był ŻYWY klucz Anthropic API — Karol ma go ZROTOWAĆ; nie
    publikujemy go ani realnych danych leadów z folderu `marketing/`.**
  - **Wycena (rekomendacja + copy na stronie):** ZERO kwot per-narzędzie. Model value-based:
    stała cena za zamrożony zakres PO bezpłatnej diagnozie, bez stawki godzinowej („dni nie
    miesiące" uzasadnia cenę WYŻSZĄ). Ladder z planu §1.4: pilot 18–26k (podłoga 12k), retainer
    1,9–4,9k/mies, panel 0,99–1,99k/mies; USA sprint $9,5–15k. Na `/oferta` i w `llms.txt`:
    „wycena po diagnozie", NIE „stała cena" jako publiczny tag.
  - **Prerender: 17 statycznych HTML** (było 16; +KSeF). SEO stron (`pagesSeo.ts`) i shelle
    prerendera przepisane pod szeroką narrację (bez „12 demo"). tsc + build + sitemap + llms
    przechodzą; KSeF w sitemap (0.8) i w liście działu Kontroling.

- **2026-07-26 (sesja rozbicia na strony) — DECK USUNIĘTY, landing rozbity na trasy pod SEO:**
  - **Mobile „samo tło" POTWIERDZONE jako naprawione** (Karol na swoim iPhonie). Prawdziwa
    przyczyna (z sesji cz. 8, po zrzucie `?debug=1`): `content-layer` był kontekstem stackingu
    (`z-index:10`) i pod `overflow:hidden` iOS nie malował uwięzionych w nim elementów `fixed`
    — NIE „canvas WebGL nad treścią" (ta teoria była błędna, choć canvas i tak zdjęliśmy z
    mobile). Fix: `content-layer` bez `z-index`, `bg-layer` `z-index:-1`. Dowód kierunkowy:
    panel `?debug=1` (fixed, ale bez wrappera) malował się poprawnie.
  - **Deck (SlideDeck) SKASOWANY** (decyzja Karola — pod SEO lepiej rozbić na strony):
    usunięte `SlideDeck.tsx`, `FooterBar`, `Landing`, `HASH_ALIAS`, `slideIndexFromHash`,
    `ZOOM_STEP`, event `klarow:home`; z globals.css cała mechanika `.deck/.slide/.slide-scroll/
    .deck-footer/.deck-dots` + blokada `html/body overflow:hidden`. Strona = zwykły scroll.
  - **Nowe trasy (react-router), każda z własnym prerenderem i SEO:** `/` (home), `/narzedzia`
    (hub), `/oferta`, `/faq` + istniejące `/narzedzia/:slug`. `ScrollToTop` na zmianę trasy.
    Navbar/hero/stopka linkują do tras (nie `#hash`).
  - **SEO — treść ROZDZIELONA bez duplikacji** (zweryfikowane w `dist`): `/` linkuje tylko do
    hubów (0 linków do narzędzi), `/narzedzia` = 12 kart, `/oferta` = pilot+współpraca,
    `/faq` = FAQPage. Prerender: **16 statycznych HTML** (było 13), osobny shell z H1 per
    strona (`HomeShell/ToolsShell/OfferShell/FaqShell` w `entry.tsx`). Sitemap ma nowe trasy
    (/narzedzia 0.9, /oferta 0.9, /faq 0.7). `llms.txt` linkuje do /narzedzia, /oferta, /faq.
    Title/description stron w NOWYM `src/data/pagesSeo.ts` (jedno źródło: klient + prerender).
  - **Trasy językowe `/pl/ /en/` ŚWIADOMIE ODROczone** (decyzja Karola) — teraz PL kanoniczne
    + przełącznik EN; pełne EN-SEO + hreflang w osobnym kroku (plan §4.2). tsc + build (16
    tras + sitemap + llms) przechodzą.

- **2026-07-24 (sesja mobile) — „samo tło na telefonie" NAPRAWIONE U ŹRÓDŁA (prawdziwa przyczyna, wreszcie zreprodukowana):**
  - **Diagnoza przez REPRODUKCJĘ, nie teorię.** Uruchomiony prawdziwy silnik WebKit
    (Playwright `webkit-2311` z cache `~/AppData/Local/ms-playwright`, `executablePath`
    wprost — pakiet `playwright-core` w scratchpadzie, bo scratchpad nie ma `&` w ścieżce)
    na buildzie `dist`, viewport iPhone 390×844. **Cała treść renderuje się poprawnie**:
    `elementFromPoint` w środku ekranu zwraca Hero (nie canvas), `content-layer` z-index:10
    stoi nad `bg-layer` z-index:0. DOM/CSS są OK. To dowodzi: bug NIE jest w kodzie strony.
  - **Prawdziwa przyczyna:** kompozytor GPU **iOS Safari** komponuje pełnoekranowy
    `position:fixed` **canvas WebGL** (tło GLSLHills) NAD rodzeństwem `position:fixed`
    (`.deck`, `header`, `.deck-footer`, `.deck-dots`) — cała treść (a jest fixed) znika mimo
    poprawnego z-index. Software WebKit (Playwright na Windows) tego NIE odtwarza (brak realnej
    kompozycji GPU) — dlatego wszystkie wcześniejsze „weryfikacje Playwrightem" przechodziły,
    a telefon dalej był czarny. To NIE był problem WebGL-failure/BgBoundary, ani starego
    WebKita/@property/oklch (iOS Karola = 26, nowoczesny — te funkcje działają), ani cache.
    Cała warstwa hipotez z sesji cz. 6–7 chybiała, bo nikt nie zreprodukował na realnej kompozycji.
  - **Naprawa (gwarantowana, u źródła):** `App.tsx` `useAnimatedBg()` — canvas WebGL
    renderowany **tylko na desktopie** (`matchMedia("(pointer: coarse)")` = false). Na
    urządzeniach dotykowych (telefony/tablety, w tym iPad) zostaje statyczny **stalowy gradient
    `.bg-layer`** (zaprojektowany fallback). Brak canvasu → nic nie może przykryć treści → bug
    znika w 100%. Desktop bez zmian (animowane wzgórza zostają). Bonus: oszczędność baterii/GPU.
  - **Zweryfikowane w WebKit po buildzie:** mobile (pointer:coarse) → `bgCanvasExists:false`,
    pełna treść widoczna na gradiencie; desktop → canvas jest, treść na wierzchu, zero regresji.
    tsc + build (13 tras + sitemap + llms.txt) przechodzą.
  - **ŚWIADOMY TRADE-OFF:** mobile traci ANIMOWANE tło (zostaje statyczny gradient). Jeśli
    Karol chce wzgórza z powrotem na telefonie — dopiero po potwierdzeniu na jego realnym
    iPhonie, że promocja warstw (`translateZ(0)`/`will-change` na fixed) faktycznie naprawia
    kompozycję; bez tego zostać przy gradiencie (niezawodność > ozdoba). Alternatywa premium:
    statyczny pre-render wzgórz jako obraz tła na mobile.
  - Zostaje diagnostyka `?debug=1` i `BgBoundary` (nieszkodliwe, chronią inne scenariusze).
    Uwaga poboczna: `cssTarget:["safari13"]` w vite.config NIE robi tego, co zakładała sesja
    cz. 6 — Vite domyślnie minifikuje CSS esbuildem (nie Lightning CSS), więc `@property`
    (57×), `@layer`, `color-mix`, `backdrop-filter` ZOSTAJĄ w zbudowanym CSS. Na iOS 26 to
    nieszkodliwe (wspiera), ale to NIE jest transpilacja pod stare Safari — nie polegać na tym.

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
