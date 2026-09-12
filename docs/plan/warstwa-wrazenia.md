# Warstwa wrażenia klarow.com v1 (po decyzji „Higgsfield wchodzi do v1")

> Data: 2026-09-12 (wieczór) · Decyzja Karola, wiążąca: „zależy mi na efekcie wow i animacyjnym".
> Ten plik scala trzy propozycje (reżyseria, produkcja, bramki) w JEDNĄ wersję i mówi, co Karol zobaczy,
> co kliknie i ile to kosztuje. Szczegóły techniczne: `strona-v2-plan.md` §3/§6/§7/§11/§13,
> reguły `media-*`, `motion-*`, `perf-*`, pipeline: `.claude/skills/klarow-guardian/references/higgsfield-pipeline.md`.
> Konwencja: bez pauzy „—", półpauza tylko w zakresach liczbowych.

## 1. Rozstrzygnięcie w sześciu zdaniach

1. **Wideo wraca do v1** i jest na pierwszym ekranie: hero po sekundzie ożywa.
2. Tym, co gra w hero, jest **nagranie prawdziwego narzędzia** (pulpit produkcji przelicza tydzień), a nie abstrakcyjna pętla: kosztuje 0 kredytów, jest deterministyczne, responsywne i **jest dowodem, nie dekoracją**.
3. **Kadr produktu z porannej korekty zostaje i nadal jest LCP**, bo jest **klatką zero tego samego nagrania**: nie ma dwóch wizji hero, jest jedna, która po chwili rusza.
4. **Higgsfield robi to, czego nagranie nie zrobi**: fakturę (satynowy grunt stalowy pod kadrem), tło obrazków OG i materiał wideo na LinkedIn. To jedyne miejsce, w którym wygrywa, i jedyny powód, dla którego warto go odpalić.
5. **Telefon nie dostaje ani jednego bajtu wideo** (decyzja z 2026-07-24 zostaje): mobile to kadr produktu na stalowym gradiencie, transfer ≤ 350 KB, LCP < 2,5 s.
6. Zakres potrzebny stronie mieści się w **bezpłatnym trialu (0 USD)**; jedyne 49 USD dotyczy materiału na social, czyli osobnej decyzji, która **nie blokuje publikacji**.

**Teza z briefu zweryfikowana.** Nagranie narzędzia jest mocniejsze jako ruch na stronie: jest jednocześnie ruchem i dowodem, kosztuje 0 kredytów, jest deterministyczne i responsywne, a pętla abstrakcyjna jest tylko ruchem. Founder ma jednak rację w rzeczy, której nagraniem nie kupimy: płaskie powierzchnie na tokenach czytają się jako „strona zrobiona przez programistę", a faktury nie da się nagrać Playwrightem. Dlatego Higgsfield wchodzi, ale jako warstwa, nie zamiast dowodu. Gdyby pętla zajęła jedyny slot autoodtwarzania na `/`, hero straciłoby dowód i zostałoby ładne tło, jakich są setki. Wariant odwrotny (pętla na pierwszym planie, kadr niżej) jest zapisany jako **D37 wariant B** razem z konsekwencjami, gdyby Karol chciał inaczej.

## 2. Podział ról (wiążący)

| Warstwa | Kto to robi | Co niesie | Koszt |
|---|---|---|---|
| Ruch na stronie | nagrania narzędzi (`record-demos.mjs`, Playwright) + Motion | sprawczość: liczby liczą, PASS się zapala, Gantt jedzie | 0 kr |
| Faktura i grunt | Higgsfield, **wyłącznie stille**, nigdy wideo na stronie | „to jest zrobione na poziomie" | kredyty |
| Metafora „chaos w porządek" | kod (`ChaosToOrder` jako stan ładowania dema) | ruch z funkcją, nie klip obok | 0 kr |
| Wrażenie poza stroną (LinkedIn, OG) | Higgsfield, **wideo dozwolone** | feed nie ma LCP, a11y ani budżetu transferu | kredyty |

## 3. Scenorys: co się rusza na całej witrynie

| Sekcja `/` | Co się rusza | Źródło | Ograniczenie ruchu (`reduce`, `MOTION_TIER`, telefon) |
|---|---|---|---|
| S1 hero | kadr produktu przechodzi w nagranie i przelicza tydzień (8 s, **jedno odtworzenie**, bez pętli); pod nim statyczny grunt stalowy | nagranie N1 + still H1 | zostaje kadr produktu (ten sam obraz); grunt bez zmian (to obraz, nie ruch) |
| S2 żywe demo | skeleton „chaos w porządek" (96 prostokątów dojeżdża do siatki), po nim raport; jeden clip-reveal wykresu | kod | skeleton od razu w układzie docelowym, wykres gotowy |
| S3 ściana 1 + 12 | kafle wchodzą kaskadą; **pierwszy rząd (4 kafle) gra mikro-nagranie pod kursorem i przy fokusie** | kod + N2–N5 | fade bez przesunięcia; klipy nie wchodzą do DOM |
| S4 bento | wejście komórek, hover tła | kod | fade |
| S5 efekty | hairline `scaleX`, potem cztery pozycje | kod | linia pełna od razu |
| S6 ludzie | portrety: czysty fade, zero ruchu twarzy | kod | fade natychmiastowy |
| S7 kalkulator | wiersze ✕/✓ kaskadą, kadr statyczny. **Świadomie bez nagrania**: ta sekcja ma być czytana | kod | fade |
| S8 kroki | hairline łącznika rysuje kierunek, kroki siadają na nim | kod | linia pełna od razu |
| S9 zamknięcie | wejście H2, leadu i CTA | kod | fade |
| `/narzedzia`, `/narzedzia/:slug`, `/oferta`, `/faq`, `/rodo`, `404` | wejścia sekcji i `PageFade`; na podstronie narzędzia ruchem jest **żywy dashboard** | kod | fade |

Zero wideo poza `/`. Zero pinowania, scroll-hijacku, karuzeli, teatru licznikowego, parallaxu i animowanej typografii: zakazy z `strona-v2-plan.md` §6.6 obowiązują bez zmian.

## 4. Trzy momenty „wow" (maksimum na całą witrynę)

| # | Moment | Gdzie | Dlaczego akurat ten |
|---|---|---|---|
| **W1** | **Hero się budzi.** Kadr, który przed chwilą był zdjęciem, przesuwa tydzień, przelicza kafle hal i zapala jeden na status ryzyka | S1, ~1,2 s po LCP | jedyna sekunda z pełną uwagą; mówi naraz „co", „dla kogo" i „to działa", bez ani jednego słowa; 0 kredytów i zero wpływu na LCP |
| **W2** | **Ściana ożywa pod kursorem.** Cztery kafle grają własne mikro-nagranie, w tym FAIL → poprawka → PASS z linią dowodu sumy | S3, na hover i fokus klawiatury | zamienia „masę trzynastu" w „masę, która liczy"; wrażenie jest silniejsze, bo odbiorca je odkrywa, a nie dostaje |
| **W3** | **Twój plik staje się raportem.** Rozsypana siatka dojeżdża do porządku, po niej wchodzi raport z pliku użytkownika | S2, po wgraniu pliku albo przykładu | największe wrażenie jest wywołane własną ręką; metafora dostaje funkcję (stan ładowania), więc przestaje być dekoracją |

Czwartego nie ma, bo znosi trzeci: persona (dyrektor firmy produkcyjnej) czyta gęsty ruch jako agencję marketingową.

## 5. Budżety (twarde, egzekwowane bramkami)

| Pozycja | Limit | Uwaga |
|---|---|---|
| Kadr produktu hero 1600×1000 (LCP) | ≤ 110 KB | preload `fetchpriority="high"`; **klatka 0 nagrania**, nie osobny zrzut |
| Kadr produktu 800×500 (mobile) | ≤ 55 KB | jedyny wizual hero na telefonie |
| Grunt stalowy hero (Higgsfield, still) | ≤ 70 KB WebP 1600 px | `loading="lazy"`, nigdy preload, nigdy `fetchpriority` |
| Nagranie hero `hero-production-v<N>.webm` | ≤ 1,2 MB | VP9; kadr niesie tekst UI, więc budżet wyższy niż dla tekstury |
| Nagranie hero `hero-production-v<N>.mp4` | ≤ 1,4 MB | H.264, fallback Safari |
| Klip hover ściany `tools/<slug>-v<N>.webm` | ≤ 320 KB | 960×600, 6–7 s, `preload="none"`, dokładnie 4 klipy |
| Transfer desktop `/` do zdarzenia `load` | ≤ 700 KB | bramka przeciw przemyceniu wideo przed LCP |
| Transfer desktop `/` pełna wizyta (bez klipów hover) | ≤ 2,5 MB | klipy hover poza tym budżetem, ich suma na trasie ≤ 1,3 MB |
| Transfer mobile `/` | ≤ 350 KB, w tym **0 B wideo** | bez zmian wobec planu |
| Autoplay `<video>` per trasa | ≤ 1 na `/`, 0 na 18 pozostałych | wyłącznie `pointer: fine`, montaż po `window.load` |
| LCP | mobile < 2,5 s, desktop < 1,8 s, **element = kadr produktu** | bramka elementowa, nie tylko czasowa |

## 6. Koszt: kredyty i pieniądze

| Asset | Model | Kredyty | Gdzie trafia |
|---|---|---|---|
| H1 grunt stalowy pod hero | `nano_banana_pro` 2k | 24 | `public/media/hero-ground-v1.webp` |
| H2 master still (style lock) | `nano_banana_pro` 4k | 15 | tylko `site/media/src/`, nie do `public/` |
| H3 tło obrazków OG | `nano_banana_pro` 2k | 10 | warstwa tła w `scripts/og.mjs` |
| rezerwa 15 % zakresu strony | | 7 | |
| **Zakres STRONY razem** | | **≈ 56** | **mieści się w bezpłatnym trialu (100 kr), 0 USD** |
| H4 pętla na LinkedIn (poza stroną) | `kling3_0` | 144 + 22 rezerwy | zero plików w `site/public/` |
| **Razem** | | **≈ 222** | |

**Pieniądze.** Zakres strony: **0 USD** (trial 3-dniowy PLUS, 100 kredytów, karta wymagana, **auto-odnowienie na 49 USD**, anulowane w dniu 3). Materiał na social: **49 USD + VAT** (ok. 60 USD brutto, ok. 240 PLN) za jeden miesiąc PLUS. Faktura na osobę fizyczną (administrator danych, D25 i D27), koszt nieodliczalny, nie korygowany wstecz. **ULTRA 129 USD jest niepotrzebne** przy tym zakresie (rekomendacja ULTRA z researchu dotyczyła pełnej listy 13 assetów, 1 300–2 200 kr). Nagrania narzędzi, kadry, kafle, miniatury i OG: 0 kredytów.

## 7. Procedura dla Karola: jedna świadoma akcja

> **Agent tego nie uruchamia.** Trial wymaga karty i sam przechodzi w 49 USD miesięcznie, więc uruchamia go founder, nigdy Claude Code. Agent przygotowuje krok, pokazuje koszt (`get_cost: true`) i czeka.

1. **Zanim klikniesz (5 minut):** ustal, czyja karta (administrator danych, D25) i **wpisz do kalendarza dwa przypomnienia**: „anuluj auto-odnowienie" na **dzień 3 trialu, 9:00** oraz „anuluj PLUS" na **dzień 27** pierwszego płatnego miesiąca. Poproś agenta o `show_plans_and_credits`: jeśli trial nie daje już 100 kredytów, przelicz budżet z zapasem 25 % i dopiero wtedy decyduj.
2. **Start:** w sesji z MCP „creative engine" napisz wprost: „uruchom 3-dniowy trial Plus". Widżet pokaże warunki, Ty podajesz kartę. To jedyny moment, w którym podajesz kartę.
3. **Dzień 1 (ok. 49 kredytów):** „zrób master still H2" → wybierasz kierunek → „zrób grunt hero H1" → „zrób tło OG H3". Agent pobiera pliki i pokazuje je **obok kadru produktu**, nigdy osobno.
4. **Przegląd (bramka `media-asset-review-gate`: 12 pozycji plus 4 pytania zabójcze):** oglądasz na OLED, jasność 100 %, w ciemnym pokoju. Pytania: czy w 5 s widać, że to AI; czy w kadrze jest jakikolwiek tekst, człowiek, logo albo ciepła barwa; czy da się to zdjąć bez straty treści (musi się dać); czy po zasłonięciu kadru produktu wiadomo, czyja to strona.
5. **Rozstrzygnięcie w dniu ≤ 3:**
   - **nie bierzemy H4:** w czacie „cancel auto-renewal" → agent woła `cancel_trial_auto_renewal` → potwierdzasz → `confirm_trial_cancel`; **zachowaj zrzut potwierdzenia**; koszt 0 USD. Jeśli grunt odpadł w przeglądzie, hero stoi na gradiencie na tokenach i strona nie traci nic poza fakturą,
   - **bierzemy H4 (LinkedIn):** świadome przejście w PLUS 49 USD, produkcja pętli, anulowanie w dniu 27.
6. **Po sprincie:** usuń wszystkie generacje z konta (kończy licencję treningową z regulaminu), uzupełnij `site/media/SOURCES.md`, sprawdź, że w `public/media/` leży wyłącznie grunt hero i tło OG.

**Czego nie kupujemy:** ULTRA, planu rocznego, API `cloud.higgsfield.ai`, top-upów bez aktywnej subskrypcji.

## 8. Plan wycofania (ma być tani, żeby nikt nie bronił klipu z powodu kosztu)

| Poziom | Co robimy | Kto | Czas |
|---|---|---|---|
| **W0. Flaga** | `MOTION_TIER = "still"` w `src/motion/tokens.ts`: media gasną, reszta ruchu zostaje bez zmian. Commit „Motion: tryb still (powód: …)" plus wpis w stanie operacyjnym | dowolna sesja, bez pytania | 1 min pracy plus build i deploy |
| **W1. Zdjęcie gałęzi** | usunięcie montażu `<video>` z `HeroMedia` i klipów z `ToolWall`; zostaje kadr produktu | dowolna sesja | 15 min |
| **W2. Zdjęcie plików** | pliki wideo z `public/media/`, wpis „WYCOFANY <data>, powód: …" w `SOURCES.md`. **Nigdy** nadpisanie `-v1` inną treścią (`/media/*` jest `immutable`) | dowolna sesja | 30 min |
| **W3. Podmiana** | nowa wersja `-v2` po pełnym przeglądzie | po decyzji foundera | 1 dzień roboczy assetów |

**Wycofujemy bez dyskusji, gdy:** przyjdzie zgłoszenie „nie widać treści" z realnego telefonu, którego nie tłumaczy stara karta w cache; LCP desktop ≥ 1,8 s albo mobile ≥ 2,5 s w pomiarze polowym; INP ≥ 200 ms na `/`; transfer `/` desktop > 2,5 MB po zmianie, która miała go nie ruszyć; albo padnie decyzja marki Karola („wygląda jak stock").

## 9. Co musi się zdarzyć, zanim wejdzie pierwszy plik

1. **Reguły strażnika i bramki najpierw**, na pustym stanie: bramka powstała po asecie zawsze przepuszcza pierwszy asset.
2. **Kontrakt warstw hero** (`.content-layer` bez `z-index`, `.bg-layer` `z-index: -1`, media wyłącznie w `.hero-media` `absolute` z `overflow: hidden`) przetestowany na **dwusekundowej czarnej zaślepce**, zanim padnie pierwszy kredyt.
3. **Nagranie N1 (hero) blokuje F2**; N2–N5 mogą dojechać do F3, bo ściana działa na samych zrzutach.
4. **Realny iPhone Karola przed publikacją**: Playwright na Windows nie odtwarza kompozycji GPU iOS, a to jedyna klasa błędu, która wyłączyła kiedyś całą stronę.
