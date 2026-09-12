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
| **Editorial („Monografia") jako kierunek v2** — jedna koncepcja z trzech; proof i showreel odrzucone | 2026-09-12 | Claude Code (trzech sędziów: marka + ICP, konwersja + SEO, wykonalność + perf), do ratyfikacji przez founderów w F0 | 23,5 pkt vs 21,5 (proof) i 16,0 (showreel); najmniejszy dystans do ujawnionych preferencji Karola (hairline zamiast boxów, zero decka i karuzeli, wykresy statyczne), najuczciwsze etykiety dowodu, najniższe ryzyko techniczne (4 komponenty motion, zero `useScroll`), najtańsze assety | `design-hero-discipline` (4 elementy, lead ≤ 20 słów), `design-no-three-equal-cards` (≥ ceil(sekcje/2) rodzin layoutu i zero sąsiadów z tą samą; `/` = 9 sekcji → próg 5, projekt daje 9 rodzin), `design-eyebrow-cap` (home = 0), `copy-minimal-text`, `motion-no-pinning-no-scroll-hijack`, `motion-charts-static`, `brand-honest-labels` |
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
