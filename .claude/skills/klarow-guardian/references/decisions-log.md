# Dziennik decyzji strażnika

> **Po co ten plik.** Reguła bez decyzji to opinia agenta. Każda reguła w `rules/` ma prowadzić do decyzji
> zapisanej tutaj: kto, kiedy, dlaczego i **co z niej wynika mechanicznie**. Gdy przyszła sesja chce zmienić
> regułę, najpierw czyta wiersz w tej tabeli — jeśli decyzja stoi, reguły się nie zmienia bez nowej decyzji.
>
> **Źródła i podział ról:**
> - `docs/plan/decyzje-founderow-v2.md` — pytania do founderów (D1–D23) z opcjami, rekomendacją i wyborem
>   domyślnym; termin odpowiedzi 2026-09-16, 18:00. To dokument **wejściowy**, nie rejestr.
> - `synthesis.md` §4 — te same decyzje w numeracji `D-01`…`D-23` (mapowanie 1:1: `D-01` = `D1`).
> - `docs/DECISIONS.md` — **rejestr append-only** odpowiedzi founderów; zakładany przed pierwszą edycją kodu.
> - **ten plik** — decyzje, które już zapadły (także te podjęte między oknami pracy), z konsekwencją w regułach.
>
> **Jak dopisać wpis:** nowy wiersz w tabeli §1 (data ISO, kto, jednozdaniowe uzasadnienie, lista ID reguł),
> a jeśli decyzja zmienia treść reguły — edycja pliku w `rules/` + `node .claude/skills/klarow-guardian/scripts/build-index.mjs`
> w tym samym commicie. Wierszy się nie kasuje: zmiana decyzji = nowy wiersz z adnotacją „zastępuje: …".

---

## 1. Decyzje już podjęte

| Decyzja | Data | Kto | Uzasadnienie | Konsekwencja w regułach |
|---|---|---|---|---|
| **Strona v3: efekt „wow" bierze się z URUCHAMIANIA prawdziwych narzędzi, nie z materiału generatywnego.** Cała warstwa generatywna w wizualu skasowana; budżet generatywny przesunięty na brudne artefakty wejściowe (materiał, który narzędzia przeżuwają). **Zastępuje** korektę wieczorną z 2026-09-12 (D36–D38, „Higgsfield wchodzi do v1") i wraca do rekomendacji z porannej wersji planu v2 | 2026-09-17 | Karol | Dwa podejścia odrzucone pod rząd: kreskówkowe sceny (13.09) i pionowy pas z pętlami (15.09) — „te gify zupełnie nam nie wyszły. Źle wyglądają, zupełnie źle mi się to czyta". Diagnoza: oba budowały wrażenie z wygenerowanej ilustracji, czyli z rzeczy bez związku z produktem. D37 przewidział to jeszcze przed próbą („ryzyko »widać, że to AI« oraz efektu stocku"), a rynek potwierdza kierunek liczbowo: odwiedzający, który dotknie interaktywnego dema, konwertuje 24,35 % vs 3,05 %, a taki hero ma 18 % stron B2B. Klarow ma dwanaście narzędzi liczących na żywo w przeglądarce i trzymał je schowane na podstronach | `design-page-theme-lock` (powrót na ciemny), `perf-lcp-poster-preload` (element LCP = kadr instrumentu), `media-video-budgets` (wiersze `presentation/panel-*` do skasowania), `design-one-cta-per-screen` (zakres `MESSAGING.cta.file` o `/`), `motion-bundle-budget-motion` (bez zmian w treści; naprawa martwej detekcji w `verify-site.mjs`) |
| **Motyw wraca na ciemną stal** — trzeci datowany zapis w `design-page-theme-lock`; **zastępuje** decyzję z 2026-09-13 („Wychodzimy ze stylu ciemnego") | 2026-09-17 | Karol | Jasny papier był wybrany pod kreskówkę, a kreskówka odpadła razem z całym materiałem generatywnym. Na ciemnym pulpity, liczby i wykresy czytają się jak sprzęt pomiarowy, a nie jak dokument — co jest dokładnie tym, czym strona ma być po decyzji wyżej. Dwanaście osadzonych dashboardów jest ciemnych z urodzenia, więc znika koszt ich retestu. Koszt powrotu minimalny: ciemny jest wartością domyślną `:root` w `tokens.css`, jasny był nadpisaniem `[data-theme="light"]`. Przy okazji usunięta wewnętrzna sprzeczność reguły (nagłówek mówił „jasna", a sekcje „Poprawnie" i „Test" nigdy nie zostały zaktualizowane i opisywały ciemną) oraz sprzeczność z §3.3 tego dziennika | `design-page-theme-lock` (przepisana), `design-light-ready-tokens` (bez zmian — komplet par obowiązuje dalej, bo to on uczynił powrót tanim), nadpisanie `.btn-primary` w `globals.css` uogólnione z `html[data-theme="light"]` na `html` (kit ma gradient stalowy wpisany na stałe, co łamie `brand-single-accent-steel` i `design-no-glass-no-blur` w OBU motywach) |
| **Editorial („Monografia") jako kierunek v2** — jedna koncepcja z trzech; proof i showreel odrzucone | 2026-09-12 | Claude Code (trzech sędziów: marka + ICP, konwersja + SEO, wykonalność + perf), do ratyfikacji przez founderów w F0 | 23,5 pkt vs 21,5 (proof) i 16,0 (showreel); najmniejszy dystans do ujawnionych preferencji Karola (hairline zamiast boxów, zero decka i karuzeli, wykresy statyczne), najuczciwsze etykiety dowodu, najniższe ryzyko techniczne (4 komponenty motion, zero `useScroll`), najtańsze assety | `design-hero-discipline` (4 elementy, lead ≤ 20 słów), `design-no-three-equal-cards` (≥ ceil(sekcje/2) rodzin layoutu i zero sąsiadów z tą samą; `/` = 9 sekcji → próg 5, projekt daje 9 rodzin), `design-eyebrow-cap` (home = 0), `copy-minimal-text`, `motion-no-pinning-no-scroll-hijack`, `motion-charts-static`, `brand-honest-labels` |
| **Ruch narracyjny wraca na stronę marketingową** — wykres wolno budować postępem scrolla, scena sticky dozwolona warunkowo; w narzędziu wykres dalej statyczny, scroll-hijack dalej zakazany. **Zastępuje** estetyczną część zasady #2 CLAUDE.md („wykresy statyczne, bez teatralnego rysowania" jako reguła całej witryny) i zakaz sticky-scen z wiersza „Editorial" wyżej | 2026-09-13 | Karol (odwrócenie własnej decyzji; wcześniej dwukrotnie prosił o „level wyżej w motion graphics") | „Strona dalej wygląda minimalistycznie, nawet gorzej niż wcześniej. Za dużo tekstu. Bardzo liczyłem na motion grafiki, typu że podczas scrollowania buduje się jakiś wykres". Reguły spisano z decyzji z 2026-07-22 i 2026-07-26 (usunięta karuzela, usunięty deck) i rozciągnięto zakaz estetyczny z kontekstu narzędzia na cały landing; skutkiem jest strona, której founder nie chce pokazywać klientom. Rozróżniamy kontekst: w narzędziu animacja opóźnia odczyt liczby i podważa zaufanie do danych, na landingu ruch jest jedynym sposobem, w jaki odwiedzający widzi produkt w działaniu przed rozmową. Kontrola użytkownika nie jest przedmiotem tej decyzji: hijack zostaje zakazany | `motion-charts-static` (§A narzędzie statyczne / §B marketing scroll-driven; test rozróżnia `site/src/motion/scroll/**` i sekcje home od `components/dashboards/**` i `DemoReport.tsx`), `motion-no-pinning-no-scroll-hijack` (hijack BLOCKER bez zmian; sticky ≤ 2 sceny/trasę, ≤ 300vh, reduced-motion → `height: auto` + stan końcowy), `motion-motivated` (nowa kategoria „demonstracja produktu", tylko marketing), `perf-js-budget-home` (140 → 175 KB gz, zapas 35 KB znakowany, twardszy warunek: wszystko poniżej folda lazy), `perf-chunk-size-gate` i `verify-site.mjs --budget` (domyślnie 175), CLAUDE.md zasada #2 (przepisana). Bez zmian: `motion-gpu-props-only`, `motion-reduced-motion-three-layers`, `motion-cleanup-required`, `demo-determinism` |
| **Trasa prawna to `/rodo`** (jeden dokument: art. 14 RODO + polityka prywatności); `/polityka-prywatnosci` = alias 301 | 2026-09-12 | okno UI + okno c1 (uzgodnienie międzyokienne, `peer-legal.md`) | Bez klauzuli pod stałym, krótkim adresem nie wolno wysłać żadnego kontaktu handlowego (art. 14 RODO; precedens Bisnode 943 470 zł potwierdzony przez NSA). Szablony outboundu fizycznie nie mieszczą pełnej klauzuli, więc muszą linkować; jeden adres zamiast dwóch = brak dryfu treści | `legal-rodo-page-required` (BLOCKER), `legal-pke-consent-forms`, `legal-privacy-before-embeds`, `legal-analytics-cookieless-or-consent`, `seo-prerender-must-keep` (19 HTML: +`rodo.html`, +`404.html`), `seo-redirects-registry` (alias 301), `seo-sitemap-llms-generated` |
| **PDF zostaje na Roboto** (wariant B); `PdfDoc.font` domyślnie `"Roboto"` | 2026-09-12 | okno c1 (`peer-legal.md` §1.2 + uzgodnienie), przyjęte przez okno UI | Zero wzrostu lazy-chunku pdfmake i zero ryzyka w generatorze Node; zmiana kroju wymaga trzech statycznych TTF (Regular 400 + Bold 700 + Italic 400 — kursywa jest używana w bloku `quote`), a pdfmake nie czyta WOFF2 ani fontów variable. Krój UI w PDF to faza 2, razem z decyzją o typografii | `design-pdf-document-pattern` (font jako parametr, domyślnie Roboto), `demo-pdf-deterministic`, `perf-fonts-budget` (PDF nie wchodzi do budżetu fontów strony), wpis 8 w `references/pain-tested.md` (brak `Roboto-Bold.ttf`) |
| **Kolejność prac z oknem c1:** refaktor `site/src/lib/pdf.ts` → `pdfDoc.mjs` + `pdfDoc.d.mts` robi **okno c1 pierwsze**; okno UI w fazie 1 nie dotyka wnętrza `pdf.ts`, `PdfButton.tsx` ani `dashboards/*.tsx` (jedyny wyjątek: `React.lazy` w `ToolPage.tsx`) | 2026-09-12 | okno UI ↔ okno c1 | Generator listów i one-pagerów musi renderować ten sam dokument w Node; równoległa praca w tych samych plikach = konflikt i regresja 12 podstron narzędzi. `blocks?: Block[]` jest opcjonalne, a domyślna stopka to dzisiejszy tekst co do znaku, więc refaktor jest bezregresyjny | `code-lazy-routes-and-dashboards`, `perf-code-split-dashboards` (lazy w `ToolPage`, bez zmian w dashboardach), `design-pdf-document-pattern`, `code-no-dead-code` (zapas na gałęzi, nie w `src`) |

---

## 2. Decyzje oczekujące (domyślny wybór działa przy braku odpowiedzi)

Pełne brzmienie i opcje: `docs/plan/decyzje-founderow-v2.md`. Tu tylko te, od których zależy treść reguł.

| ID | Czego dotyczy | Domyślnie | Reguły, które czekają |
|---|---|---|---|
| D-06 | krój pisma (jeden czy dwa: Nunito Sans solo vs Nunito Sans + Geist jako display) | **Nunito Sans solo w fazie 1**; Geist dopiero po porównaniu dwóch mockupów i wyłącznie razem z tym samym krojem w PDF (drugi krój = +50 KB fontów i drugi zestaw metryk) | `perf-fonts-budget` (≤ 100 KB, self-hosted, `preload` latin, `font-display: swap`), `design-typography-scale` (jeden krój, zero serif i mono), `design-pdf-document-pattern` (font jako parametr, domyślnie Roboto do czasu decyzji) |
| D-07 | liczby i case z poprzedniej firmy przed umową IP | zestaw zamrożony, „kilkanaście" zamiast „15" | `brand-no-nuconic`, `brand-allowed-numbers-only`, `copy-numbers-with-source`, `references/allowed-numbers.md` §3 |
| D-09 | pauza i półpauza | „—" zakaz, „–" tylko w zakresach liczbowych | `i18n-pl-typography`, `references/writing-command.md` §PL.1 |
| D-15 | Cal.com: link czy embed | faza 1 link, faza 2 embed | `legal-privacy-before-embeds`, `integ-embed-requires-privacy`, `integ-registry-required` |
| D-16 | pomiar (CF Web Analytics, zdarzenia) | cookieless, bez zdarzeń do czasu `/rodo` | `legal-analytics-cookieless-or-consent`, `seo-gsc-and-analytics`, `demo-events-outside-engines` |
| D-18 | React 19.3 + `<ViewTransition>` | faza 2, po ≥ 2 tygodniach | `motion-view-transition-rules` |
| D-19 | `build.target` / `cssTarget safari13` | utrzymać w fazie 1 | `perf-build-target`, `code-build-target-policy`, `code-tosorted-safari13` |
| D-21 | kto pisze politykę prywatności | szkielet Claude Code + przegląd radcy, `noindex` do przeglądu | `legal-rodo-page-required` (sekcja „Wyjątki") |
| D-05 | sekcja founderów (nazwiska, zdjęcia) | Paweł pełne dane, Karol imię + rola | `brand-honest-labels`, `legal-no-scraped-personal-data-in-repo` (dane własne vs cudze) |

---

## 3. Świadome odstępstwa od skilli niższego rzędu

Precedencja: `klarow-guardian` > `CLAUDE.md` > `motion` > `design-taste-frontend` > pozostałe skille wizualne.
Poniższe kolizje są **rozstrzygnięte raz** — agent nie ma ich relitygować przy każdej sesji ani „poprawiać"
kodu w stronę skilla niższego rzędu.

### 3.1 Hairline 1 px wbrew `high-end-visual-design`

- **Co mówi skill:** 1 px border to sygnatura taniego, generycznego UI; zamiast niego double-bezel,
  cień wielowarstwowy albo wypełnienie różnicujące płaszczyzny.
- **Co robimy:** na powierzchni marketingowej strukturę niosą **hairline'y `1px var(--border)`**, nie boxy;
  cienie i bezle są zakazane razem z glassem i blurem.
- **Dlaczego:** decyzja Karola z 2026-07-22 (sesja cz. 6): „linie, nie boxy". Marka („polerowana stal",
  rysunek techniczny, „kalkulator, nie wróżka") żyje z cienkiej kreski; cień sugeruje warstwy i głębię,
  których w tym języku wizualnym nie ma. Na powierzchni `tool` (dashboardy, dialog) hierarchię buduje
  `--surface`/`--surface-raised`, nadal bez cieni.
- **Gdzie zapisane:** `references/taste-locks.md` (adnotacja przy §4.9), `rules/design-no-glass-no-blur.md`,
  `rules/design-shape-lock.md`, `rules/design-tokens-only.md`.
- **Granica odstępstwa:** zakaz `border-t` + `border-b` na każdym wierszu długiej tabeli zostaje w mocy
  (to inna sprawa niż hairline jako element kompozycji) — `design-no-three-equal-cards`, `design-overflow-rules`.

### 3.2 `lucide-react` mimo uwag `design-taste-frontend` i `high-end-visual-design`

- **Co mówi skill:** `lucide-react` jest „discouraged" — dopuszczalne tylko wtedy, gdy użytkownik wprost
  o to prosi albo projekt już od tej biblioteki zależy (taste §3.C); `high-end-visual-design` traktuje
  domyślny zestaw lucide jako sygnał „ikonek z generatora".
- **Co robimy:** lucide zostaje jako **jedyna** rodzina ikon, z dyscypliną: `strokeWidth` liczone z rozmiaru
  (1.5 dla 20/24/32 px, 1.75 wyłącznie dla 16 px), rozmiary tylko z mapy {16, 20, 24, 32}, stała mapa znaczeń
  (Check = sukces, X = zamknij, Clock = oczekuje, Download = pobierz, TriangleAlert = ostrzeżenie,
  Lock = on-prem, BarChart3/Banknote/HardHat/FileSpreadsheet/Stamp = działy).
- **Dlaczego:** projekt już zależy od lucide (warunek wyjątku w samym skillu), a 12 dashboardów i hub
  potrzebują jednego, przewidywalnego zestawu; druga biblioteka albo ręczne `<path>` to koszt utrzymania
  bez korzyści dla marki. Ryzyko „generyczności" neutralizujemy dyscypliną grubości i mapą znaczeń,
  nie zmianą biblioteki. Emoji i glify tekstowe (`▲ ✓ ✕ → ⓘ`) pozostają zakazane.
- **Gdzie zapisane:** `rules/design-icons-lucide-one-family.md`, `references/taste-locks.md` §C p. 2,
  `rules/code-no-barrel-imports.md` (import z `lucide-react` akceptowany, Rollup tree-shake).

### 3.3 Motyw wyłącznie ciemny wbrew `taste` §8 (Dark Mode Protocol)

- **Co mówi skill:** „Dual-mode by default. Never assume light-only unless the brief is print-emulating
  editorial"; szanuj `prefers-color-scheme`, dodaj przełącznik, testuj oba tryby.
- **Co robimy:** landing jest **ciemny na całej stronie** (`--background #121212`), `color-scheme: dark`,
  `<meta name="theme-color" content="#121212">`, `data-theme` nie jest ustawiane na stronie i **nie ma
  przełącznika motywu**. Komplet tokenów `[data-theme="light"]` istnieje od dnia 1, ale służy narzędziom,
  podglądowi PDF i przyszłym wdrożeniom u klienta, nie stronie.
- **Dlaczego:** skill sam dopuszcza wyjątek („unless the brand insists"). Marka stoi na jednej płaszczyźnie
  ze stalowym akcentem; dwa tryby oznaczają dwa komplety kontrastów do audytu (`design-contrast-aa`),
  dwa warianty każdego dashboardu i dwa zestawy zrzutów — koszt bez korzyści dla firmy, która nie sprzedaje
  personalizacji wyglądu. Jasne są wyłącznie dokumenty PDF i to osobny artefakt, nie sekcja strony.
- **Gdzie zapisane:** `rules/design-page-theme-lock.md`, `rules/design-light-ready-tokens.md`,
  `references/taste-locks.md` §F (adnotacja „OBOWIĄZUJE Z MODYFIKACJĄ").
- **Granica odstępstwa:** wymogi kontrastu (AA dla tekstu, 3:1 dla elementów UI) i parytetu hierarchii
  obowiązują bez zmian; zakaz czystej czerni `#000000` i czystej bieli `#ffffff` też.

### 3.4 Pozostałe wyłączone kolizje (lista zbiorcza)

Wyłączone świadomie i bez osobnego uzasadnienia w tym pliku, bo wynikają wprost z reguł `design-*`,
`motion-*` i `i18n-*`: serif w hero, pill CTA, double-bezel, eyebrow-pill nad każdym `H2`, blur entrances,
glass nav, Instrument Serif, reveal 1100 ms, Title Case w nagłówkach nawigacji (`writing-guidelines`),
`&` zamiast „i" w copy PL, `autocomplete="off"` na polach nieautoryzacyjnych (`web-design-guidelines`),
React 19.3 `<ViewTransition>` w fazie 1 (`react-view-transitions`). Mapowanie i uzasadnienia:
`references/audit-checklist.md` §4.
