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
| `.claude/skills/` | Skille projektu: `auto-animate` (animacje list/akordeonów), `aceternity-ui` |

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
     `node node_modules/vite/bin/vite.js build`.
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
  `klarow:home`). Kolejność: start → ból → **narzędzia** → wyróżniki → współpraca → jak →
  dowód → dla-kogo → oferta → faq (lista `SLIDES` w `App.tsx`). **Kontakt = stała stopka
  `FooterBar`** (fixed dół, opaque) — telefon+e-mail zawsze widoczne (nie slajd).
- `src/App.tsx` — definicje sekcji + deck + routing (`/`, `/narzedzia/:slug`) + modal rezerwacji.
- **Sekcja „Narzędzia" (rdzeń dowodu — zamiast fikcyjnych modułów):**
  - `src/data/tools.ts` — **katalog ~12 narzędzi** (PL/EN): `category`, `status`
    (`live`|`preview`|`soon`), tagline/replaces/io/bullets. **Odbrandowane** odtworzenie
    narzędzi z bazy blueprintów (patrz niżej) — nazwy generyczne, dane fikcyjne.
  - `src/components/ToolsGrid.tsx` — katalog na landingu (filtr kategorii, auto-animate),
    karty → `/narzedzia/:slug`; `live` wyróżnione i na początku.
  - `src/pages/ToolPage.tsx` — opis narzędzia + **OSADZONY interaktywny dashboard** (live).
  - **5 dashboardów LIVE** (100% client-side, deterministyczne, dane fikcyjne):
    `DemoReport.tsx`+`lib/report.ts` („Raport zarządczy", spec `docs/plan/demo-m2-spec.md`) ·
    `dashboards/ProductionDashboard.tsx` (kafle hal + suwak tygodnia) ·
    `dashboards/QualityGate.tsx`+`lib/qualityGate.ts` („Audyt jakości" — reguły 1:1
    z blueprintu: PM<0, tydzień<0, saldo E≠0, data poza tygodniem ISO; macierz
    OK/UWAGA/BŁĄD) · `dashboards/TaskTimeline.tsx` (Gantt compare-mode 2 snapshotów,
    dryf +Nd/−Nd, stała gęstość px/dobę; „Dziś"=stała 2026-07-22 dla determinizmu) ·
    `dashboards/PaymentCalculator.tsx` (transze: alokacja proporcjonalna w groszach,
    reszta na ostatniej pozycji → Σ co do grosza; FX na kursach fikcyjnych).
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

- **2026-07-22 (sesja strony, cz. 4) — „przenieś 1:1 narzędzia z gita": 5 dashboardów LIVE:**
  - Do istniejących 2 (Raport zarządczy, Dashboard produkcji) doszły 3 kolejne, odtworzone
    **1:1 co do logiki** ze wzbogaconych blueprintów (repo dostało fragmenty realnego kodu):
    **Audyt jakości danych** (reguły PM_MINUS/NEG_WEEK/E_NONZERO/BAD_DATE, tydzień ISO,
    macierz pewności — silnik przetestowany node'em), **Oś czasu/Gantt** (compare-mode Old/New,
    czerwony ogon obsuwy, dryf +Nd/−Nd), **Kalkulator transz** (alokacja proporcjonalna
    w groszach, reszta na ostatniej pozycji — dokładnie algorytm `_allocate` z blueprintu).
  - Wszystko odbrandowane (zasada #3), dane fikcyjne, deterministyczne, client-side.
  - **Następne w kolejce:** Import z rekoncyliacją (PASS/FAIL co do grosza) i Billing US G703
    (silnik propozycji) — wykonalne client-side; importy piszące przez Excel COM tylko jako
    podgląd/TEST.
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
- **Do zrobienia** (szczegóły: `docs/plan/nastepne-kroki.md`): deploy `site/` na Cloudflare
  Pages (root `site`, build `npm run build`, output `dist`) + custom domain; konto Cal.com →
  embed w `BookingModal`; umowa IP z Nuconic; realne zrzuty narzędzi po ich rebrandzie na
  `company-ui` (kopiuj `ui-kit/skills/company-ui/` do `.claude/skills/` projektu narzędzia);
  opisy modułów i liczby oszczędności od founderów; case study PL/EN.

## Kontekst biznesowy w pigułce (pełnia: `docs/plan/plan-strategiczny.md`)

- Oferta wejściowa: **„Pilot na kopii"** — 1 proces, stała cena, ≤10 dni, płatność 50/50;
  hak przed sprzedażą: „przyślij nam swój najgorszy Excel" (30-min demo na próbce).
- Moduły fala 1 (sprzedawane dziś): M1 Audyt jakości danych (wedge, read-only),
  M2 Raport zarządczy. Fala 2: importy, zamknięcie cyklu, produkcja. Fala 3/roadmapa:
  panel KPI online, obieg dokumentów, płatności (AIA G703 → rynek USA).
- ICP: produkcja/budownictwo/dystrybucja 50–150 osób, Windows + Excel, „człowiek-Excel"
  jako wąskie gardło. Rynki: PL teraz, USA od ~6. miesiąca.
