# CLAUDE.md — Ekosystem narzędzi automatyzujących Nuconic

> **Cel dokumentu.** To jest kontekst dla architekta (i dla Claude) przy projektowaniu
> kolejnych narzędzi i całej platformy. Opisuje **charakter każdego istniejącego narzędzia**,
> **do czego służy** oraz **jak upraszcza codzienną pracę** — nie jest dokumentacją
> implementacyjną. Traktuj go jako mapę tego, co już zbudowano, żeby nowe rzeczy pasowały
> do istniejących wzorców, łańcuchów danych i konwencji.
>
> **Uwaga o bezpieczeństwie:** w oryginalnych repozytoriach/instrukcjach istnieją zaszyte
> hasła, klucze SSH i poświadczenia. **Celowo NIE ma ich w tym pliku** i nie należy ich tu
> dopisywać — ten dokument bywa wrzucany do zewnętrznego kontekstu (Claude web).

---

## 1. Kim jest firma i po co te narzędzia

Nuconic sp. z o.o. to firma produkcyjno-budowlana (moduły / wykończenia wnętrz, projekty
inwestycyjne — m.in. dla klientów w USA). **Dział Kontrolingu jest głównym odbiorcą i
motorem** tych narzędzi. Wszystkie powstały, żeby zamienić **ręczną pracę w Excelu, makra
VBA i obieg dokumentów w mailu** na powtarzalne, kontrolowane, audytowalne oprogramowanie.

Docelowo firma ma tworzyć narzędzia automatyzujące/upraszczające pracę **także innym firmom** —
poniższy zestaw to dojrzały poligon i biblioteka wzorców, na których ten produkt można oprzeć.

**Charakter całego ekosystemu (DNA):**
- Narzędzia rozwiązują realne, żmudne procesy kontrolingu i administracji projektami.
- Dwa światy współistnieją: **duże aplikacje serwerowe** (webowe, w sieci LAN) oraz
  **lekkie narzędzia lokalne** uruchamiane dwuklikiem na dysku sieciowym.
- Excel pozostaje „bazą danych" firmy — większość narzędzi **czyta i zapisuje pliki `.xlsm`/`.xls`**
  (zapis przez Excel COM, żeby nie uszkodzić makr/wykresów/walidacji).
- Wszystko budowane z **Claude Code**, w spójnym stylu wizualnym (`nuconic-ui-kit`).

---

## 2. Mapa ekosystemu (skrót)

Trzy niezależne łańcuchy + wspólny fundament:

```
A. ŁAŃCUCH DOKUMENTOWY (podwykonawcy, robocizna, umowy)
   Rejestry godzin (NAS) ─▶ Excel Sync bridge ─▶ PROTOCOL MANAGER
        └─ protokoły robocizny · zlecenia · akordy · umowy · rozliczenia
        └─ integracje: GUS · KRS · rejestr.io · EBC (kursy) · Autenti (podpisy)

B. ŁAŃCUCH BUDGET TRACKING (kontroling kosztów projektów)
   Źródła surowe ─▶ IMPORTY ─▶ pliki budżetowe BT (.xlsm na X:) ─▶ walidacja ─▶ publikacja ─▶ raportowanie
   ├─ RBH import          (roboczogodziny hala + wyjazdy)
   ├─ LOMAG Import        (materiał / magazyn)
   ├─ Other Cost Import   (koszty pozostałe z ERP „plik Magdy")
   ├─ Przerób Import      (przerób / wykonanie produkcyjne)
   ├─ Globalna Formuła Sprawdzająca   (kontrola jakości plików BT, read-only)
   ├─ Publikuj wersję     (promocja wersji „wtrakcie" → oficjalna + archiwum)
   ├─ CVS generator       (pliki BT/raporty → 5 kanonicznych CSV „źródło prawdy")
   ├─ Wklej do ALLa       (Cost Tracking Summary → zbiorczy plik „AS")
   ├─ Weekly Raport Gen.  (raport tygodniowy HTML+XLSX dla Zarządu)
   └─ BT HUB              (jeden dashboard spinający wszystkie powyższe)
                                   │
                                   ▼
                         BUDGET TRACKING (dashboard React) — controlling.nuconic.com

C. ŁAŃCUCH PŁATNOŚCI (obieg przelewów + fakturowanie klientów US)
   PLAN PŁATNOŚCI / BILLING SCHEDULE TOOL
   ├─ Blok 1–3: Request ─▶ plan 14-dniowy ─▶ akceptacja Dana ─▶ tracking wydatków (PLN)
   └─ Blok 4:  harmonogram fakturowania klientów US wg arkuszy AIA G703 (USD)

FUNDAMENT (pod wszystkim):  nuconic-ui-kit — design-system / księga znaku
```

---

## 3. Wzorzec architektoniczny narzędzi lokalnych (bardzo ważny kontekst)

Prawie wszystkie narzędzia kontrolingu z folderu **„Nowe Narzędzia"** dzielą **jeden,
świadomie powtarzany wzorzec** — to jest „szablon firmowy" na konwersję makra VBA na
samodzielną aplikację. Projektując nowe narzędzie z tej rodziny, trzymaj się go:

- **Uruchomienie:** dwuklik `start.bat`. Launcher jest **wielo-użytkownikowy** — kod może
  leżeć na dysku sieciowym `X:`, ale każdy użytkownik dostaje **własny lokalny venv** w
  `%LOCALAPPDATA%\<Narzędzie>\.venv` (wspólny venv na sieciówce nie działa przez absolutne
  ścieżki w `pyvenv.cfg`). Zależności instalują się przy pierwszym starcie.
- **Interfejs:** lokalny serwer (Flask) + **dashboard w przeglądarce** na `localhost:<port>`
  (nasłuch tylko na `127.0.0.1`, nie w LAN). Każde narzędzie ma swój port, więc mogą działać
  równolegle (RBH 8765, Other Cost 8766, Przerób 8767, LOMAG 8770, CVS 8765/8766, BT Hub 8790…).
- **Odczyt Excela:** `openpyxl` (bez uruchamiania Excela — szybko).
- **Zapis Excela:** **Excel COM (`pywin32`)** — edycja plików `.xlsm` **w miejscu**, jak stare
  makra VBA. Powód: pliki BT to skoroszyty 5–15 MB z makrami, pivotami i walidacją; `openpyxl`
  re-serializowałby je minutami i **gubił pivoty/wykresy/walidację**. Bez Excela na maszynie
  tryb **PROD jest świadomie wstrzymany** (żeby nie uszkodzić plików).
- **Model bezpieczeństwa pracy:** **TEST MODE** (identyczna ścieżka kodu, ale nic nie zapisuje —
  pełny diff/plan przed zmianą) → **PROD** (modal potwierdzenia + `confirmed=true`; **backup**
  pliku do `_backup\<timestamp>\` przed pierwszą modyfikacją; przy błędzie plik nietknięty).
- **Walidacja i log:** sanity-check sum co do grosza, log audytowy (`.xlsx`/NDJSON) w
  `%LOCALAPPDATA%`, streaming logu na żywo do UI (NDJSON).
- **Sandbox:** można podmienić root BT na kopię testową (z bezpiecznikiem — pusta ścieżka = twardy błąd).

Odstępstwa od wzorca to **duże aplikacje serwerowe** (Protocol Manager, Budget Tracking,
Plan Płatności) — te są webowe, wieloużytkownikowe, wdrażane na serwerach Debian za nginx.

---

# CZĘŚĆ A — Aplikacje serwerowe (webowe, LAN)

## A1. Nuconic Protocol Manager  *(flagowa, największa aplikacja)*

- **Typ / charakter:** monolit **FastAPI** (SSR Jinja2 + Vanilla JS) z dokładaną nową warstwą
  UI jako **React/TS SPA (Vite)**; wdrożony jako usługa `systemd` za nginx w LAN.
- **Do czego służy:** centralny **obieg dokumentów podwykonawczych** w firmie. Kilka modułów:
  1. **Protokoły robocizny** — 5-krokowy kreator DRAFT → FINAL (walidacja 1:1), akceptacja per
     inwestycja przez Kierowników Budów (świadoma trybu HALA/WYJAZD, MONTAŻOWNIA/SPAWALNIA),
     stemplowana akceptacja, cykl życia DRAFT→FINAL→ACCEPTED→INVOICED (+ korekty, faktura korygująca)
     jako łańcuch badge'y na dashboardzie.
  2. **Zlecenia / zamówienia podwykonawcze** — auto-zaciąganie danych kontrahenta po NIP z **GUS BIR**
     (SOAP), adresu z **KRS API**, reprezentantów z **rejestr.io**; generowanie DOCX→PDF i routing maila.
  3. **Protokoły odbioru (AKORD)** — dokument-dziecko zlecenia (port makra `modAkord`), do 10 odbiorów.
  4. **Majstry** — skrócony protokół rozliczenia godzin (UoP/B2B).
  5. **Rejestr umów** — CRUD z uploadem PDF, eksport/import XLSX i ZIP (Excel = źródło prawdy, REPLACE).
  6. **Rozliczenia / płatności** — kalkulator transz per inwestycja (protokoły/zlecenia/akordy),
     VAT 23%, kalkulator walutowy na kursach **EBC**.
  7. **Słowniki i listy** (inwestycje/etapy/PM, Lista_Mail, Kierownicy Budów, Majstry).
  8. **Mailing** — log wysyłek + wykrywanie podmiotów bez adresu.
  9. **Mail-listener Autenti** — osobny skrypt na PC (Outlook COM), wykrywa powiadomienia o podpisach
     i domyka status zleceń w backendzie.
- **Co zastępuje / jak upraszcza pracę:** wcześniejszy **w pełni ręczny proces na Excelu + makrach
  VBA** (przeklejanie z rejestrów godzin do formatek Word/Excel, ręczne wyszukiwanie NIP w GUS/KRS,
  ręczne rozsyłanie maili, pilnowanie akceptacji w skrzynce, ręczne liczenie transz i kursów,
  osobny plik-rejestr umów, ręczne przenoszenie maili Autenti). Teraz **cały łańcuch** (rejestr →
  dokument → wielostopniowa akceptacja z mailingiem → faktura → rozliczenie) toczy się w jednej
  aplikacji z automatycznym PDF, lookupem kontrahentów i audytowalnym statusem.
- **Wejście → wyjście:** rejestry godzin z NAS (RBH-ZBIORCZY dla hali, MONTAZ-* dla wyjazdów),
  Lista_Mail, Kierownicy Budów, dane z GUS/KRS/rejestr.io, kursy EBC, powiadomienia Autenti →
  PDF-y (protokoły/zlecenia/akordy/umowy), maile transakcyjne, wpisy/statusy w bazie SQLite,
  eksporty XLSX/ZIP, dane KPI.
- **Użytkownicy:** Kontroling (admin), wystawcy protokołów HALA/WYJAZD, Kierownicy Budów, Dyrektor,
  Księgowość, PM-owie, obsługa rejestru umów i rozliczeń.
- **Interfejs:** przeglądarka w LAN (`http://192.168.250.200` / `http://protokoly`); lokalnie
  `start_local.bat` → `127.0.0.1:8001` (osobna baza + przekierowanie wszystkich maili na jedną skrzynkę).
- **Stack:** Python 3.11 · FastAPI/Uvicorn · SQLAlchemy 2.0 + SQLite · Jinja2/Vanilla JS · React+Vite+TS ·
  python-docx + docx2pdf/LibreOffice · openpyxl/win32com · zeep (GUS), httpx (KRS), cloudscraper (rejestr.io) ·
  smbprotocol · systemd + nginx · Outlook COM.
- **Status:** **produkcja**, ciągle rozwijany (v2 wdrożony 2026-05; kolejne moduły dokładane 2026-05..07).
- **Uwagi:** dostęp tylko w LAN po HTTP (akceptowalne wewnętrznie); dokumenty brand-aware
  (nuconic / wotel — różne loga i szablony); duża część logiki to **porty makr VBA**
  (`modAkord`, `Generowanie_Worda.bas`, `Module4`). Zależy od **Excel Sync bridge** (A/infra) po dane wejściowe.

## A2. Nuconic Budget Tracking  *(controlling.nuconic.com)*

- **Typ / charakter:** webowy **dashboard SPA (React 18 + Vite + TS**, Tailwind, Zustand, Recharts)
  z backendem **Node/Express**, za nginx na wewnętrznej VM (Debian/Proxmox).
- **Do czego służy:** **śledzenie realizacji budżetów projektów** w ujęciu tygodniowym.
  Per-etap pokazuje **budżet (złoty outline) / wydatek w budżecie (zielony) / przekroczenie (czerwony)**,
  porównanie tydzień-do-tygodnia, prognozę marży. Widoki wg ról:
  - **Cost Tracking** (PM) — estymaty „do dokończenia", obowiązkowe komentarze, „approve week".
  - **Analytic Panel** (Zarząd) — KPI marża plan vs real, wykresy per-etap, tabele finansowe,
    **Task Nuconic timeline** (Gantt z trybem porównania snapshotów Old vs New), Dan Cost Report.
  - **Controlling Import** — wgranie surowych plików, **diff + reconciliation (PASS/FAIL)**, commit
    „zatwierdzonej wersji" widocznej dla PM-ów.
  - **Production Dashboard** (Produkcja) — kafle per hala/inwestycja, wykonanie %.
  - **KPI Panel** — agregaty firmowe, telemetria użycia.
- **Co zastępuje / jak upraszcza pracę:** wieloletni **Excel + PowerQuery** (ręczne odświeżanie
  zapytań, przeklejanie między arkuszami wielkiego `.xlsm`, rozsyłanie plików, komentarze wprost
  w komórkach — bez wersjonowania i audytu). Teraz: kontroling wgrywa surowe pliki raz i dostaje
  **automatyczny diff + reconciliation** przed commitem; PM pracuje w gotowym dashboardzie; Zarząd
  ma **live panel** zamiast wysyłanego pliku.
- **Wejście → wyjście:** kanoniczne **CSV** z **CVS generatora** (Main_Page, Finanse, Produkcja,
  Wykonanie, Komentarze + snapshoty TASK/ i Scalony_przerob/) oraz surowe skoroszyty (RBH-zbiorczy +
  MONTAZ, LOMAG, Koszty Pozostałe + Słownik) przez Controlling Import → interaktywne widoki i KPI,
  committed versions, eksporty PNG/PDF, `audit.log` (JSONL). Stan PM (komentarze/estymaty/approvals)
  trzymany w **IndexedDB** przeglądarki.
- **Użytkownicy (role egzekwowane na backendzie):** `pm`, `admin` (Zarząd), `kontroling`, `produkcja`;
  dedykowany raport dla Dana (CFO US).
- **Interfejs:** `https://controlling.nuconic.com` (nginx + HTTPS/HSTS, cookie sesyjne `nc_sid`).
  Odświeżenie danych na produkcję: **dwuklik `start.bat`** (mirror `data/` → `public/data/`, przebudowa
  indeksów, upload przez plink/pscp z backupem). Dev: backend `127.0.0.1:3001` + Vite `:5173`.
- **Stack:** React 18.3/Vite 5.4/TS · Tailwind · Zustand · Recharts + własny SVG · papaparse/xlsx/exceljs/jspdf ·
  IndexedDB · Node/Express + bcryptjs/helmet/express-rate-limit · nginx/Debian/systemd/TLS.
- **Status:** **produkcja** po **audycie bezpieczeństwa 2026-05-19**. Reguła: „najpierw localhost,
  deploy na global po wyraźnej decyzji usera".
- **Uwagi bezpieczeństwa:** przed audytem hasła były plaintextem w bundlu JS, auth 100% po stronie
  klienta, CSV finansowe bez kontroli. Po remediacji: bcrypt cost 12, sesje server-side, gating danych
  przez `/api/data/<file>` z allow-listą, rate-limit, audit-log, 4 role na backendzie, HSTS/CSP.
  Świadomie poza zakresem: MFA/SSO/vault. Folder `app/` (Shiny R) i skrypty `inspect_*/audit_*` to
  tylko referencja/diagnostyka — **nie idą na produkcję**.

## A3. Nuconic Billing Schedule Tool — „Plan Płatności"  *(najnowsze narzędzie firmy)*

- **Typ / charakter:** aplikacja webowa **FastAPI + PostgreSQL**, front **React 18 + Vite + TS SPA**
  (gałąź `react-migration`) w hybrydzie z zachowanym fallbackiem Jinja2 SSR. On-premise, wieloużytkownikowa
  (nginx + uvicorn/systemd, dostęp LAN + VPN dla Dana z US).
- **Do czego służy:** dwa spięte procesy finansowe:
  - **Blok 1–3 (przelewy PLN):** `REQUESTOR` składa **Request** o wydatek → **Mateusz** (Financial
    Controller PL) waliduje i wpuszcza do **macierzy planu 14-dniowego** → pakuje pozycje we
    **wniosek funding** (WN-YYYY-NNNNN) do **Dana** (CFO US), który **per pozycja** akceptuje w całości
    lub częściowo (reszta roluje +1 dzień) i odblokowuje środki → **tracking** (Actual = Σ zaakcept.
    alokacji, Spent = Σ przelewów, Remaining derywowane). Transfery budżetowe inicjuje `TREASURER` (Kasia).
  - **Blok 4 (billing klientów US):** odwzorowanie arkuszy **AIA G703** dla ~9 inwestycji; silnik
    (`services/billing.py`) liczy „ile można teraz zafakturować" = `M × wartość kontraktowa − już
    zafakturowane` (gdy `M` > próg depozytu). PM zgłasza **% postępu** wyłącznie oficjalnym formularzem
    z **obowiązkowym PDF**; Mateusz statusuje całą kolumnę płatności (PENDING/INVOICED/PAID/NO_INVOICE);
    Dan read-only.
- **Co zastępuje / jak upraszcza pracę:** ręczny, **mailowo-excelowy obieg** akceptacji przelewów
  (wnioski w mailach, planowanie „na piechotę", brak śladu audytowego) oraz rozproszone arkusze
  AIA G703 na `X:\...\Billing\`. Teraz: maszyny stanów, **gap-free numeracja**, automatyczny
  carry-forward, powiadomienia mailowe na każdym kroku, propozycje kwot do fakturowania i spójna
  historia decyzji.
- **Reguły w rdzeniu:** **four-eyes / SoD** (wnioskodawca ≠ walidator, Mateusz ≠ Dan), **authz
  deny-by-default** (404 na nieuprawnione), **audyt append-only hash-chain** w tej samej transakcji co
  ruch finansowy, kwoty zawsze `Decimal`/grosze-centy (nigdy `float`), PLN (`12 345,67 PLN`) i USD.
- **Wejście → wyjście:** formularze web (requesty, wnioski, decyzje, transfery, raporty PM z PDF) +
  jednorazowy import Exceli AIA G703 → macierz planu (derywowana), stany w PostgreSQL, maile (outbox),
  eksporty XLSX/PDF, hash-chained audit_log.
- **Użytkownicy:** `REQUESTOR`, `CFO_PL`/Mateusz, `DIRECTOR_US`/Dan, `TREASURER`/Kasia, `PM`, `ADMIN`.
  (Klucze ról historyczne w DB; zmieniają się tylko etykiety.)
- **Interfejs:** dev = 2 serwery (backend `:8002` + Vite `:5180`), prod/clean = jeden serwer
  (`SERVE_SPA=true`) serwuje `frontend/dist`. `DEMO_MODE=true` uruchamia bez bazy (podgląd UI).
  Migracja billingu: `python import_billing.py`.
- **Stack:** Python 3.11 · FastAPI/Uvicorn · SQLAlchemy 2.0 + Alembic · PostgreSQL 16 (dev SQLite) ·
  Jinja2+htmx+Alpine (fallback) · React 18/Vite/TS · Tailwind + lucide + własne wykresy SVG (`NcChart`) ·
  passlib[argon2]. **Reużywa z Protocol Managera:** `email_service.py`, `validators.py`, `system_time.py`.
- **Status:** **w budowie / aktywny rozwój** — backend produkcyjnie gotowy (pakiet `deploy/` + RUNBOOK),
  trwa migracja frontu na React (kit v2.0) przy działającym fallbacku Jinja.
- **Uwagi:** RODO — dane on-prem PL, opisy widoczne dla Dana (US) = udokumentowany transfer PL→US;
  kolejność tras w Starlette istotna (`/billing/reports*` przed `{project_id}`); import Bloku 4 generuje
  raport rozbieżności (NEGATIVE_PAYMENT, PAID_UNCERTAIN, DUPLICATE_PAYMENT_NO, SUM_MISMATCH).

---

# CZĘŚĆ B — Warstwa danych kontrolingu (folder „Nowe Narzędzia")

> Wszystkie poniższe narzędzia trzymają się **wzorca z sekcji 3** (dwuklik `start.bat` → dashboard
> w przeglądarce → TEST/PROD → Excel COM → backup → log). Operują na **plikach budżetowych BT**
> (`X:\01_Kontroling\Budget tracking\<numer inwestycji>*\...`).

## B1. BT Hub  *(orkiestrator / parasol)*

- **Typ:** lokalna aplikacja webowa (Flask) na `localhost:8790`, dwuklik `start.bat`.
- **Do czego służy:** **jeden dashboard spinający wszystkie narzędzia kontrolingu BT** — karty do
  4 importów (RBH, Other Cost, Przerób, LOMAG), panel CVS generatora, Globalną Formułę Sprawdzającą
  z **macierzą pewności** (zielone/czerwone per inwestycja) oraz odpalanie Weekly / Wklej do ALLa /
  Publikuj jako subprocesów.
- **Co zastępuje / jak upraszcza pracę:** wcześniej każde narzędzie trzeba było uruchamiać osobno,
  wpisywać wspólne ustawienia (`budget_root`, sandbox) ręcznie 4×, a przypadkowe uruchomienie dwóch
  importów naraz groziło **dwoma Excelami piszącymi po tych samych plikach** (ryzyko uszkodzenia).
  Hub daje: jeden start, jeden adres, **wspólne ustawienia propagowane naraz** do wszystkich importów,
  **globalną kolejkę Excel COM** (`ComLockMiddleware` — jedna operacja zapisu naraz, druga czeka) oraz
  przycisk „Sprawdź WSZYSTKIE" budujący macierz pewności dla całego portfela.
- **Zasada projektowa:** *kopie, nie ruszamy oryginałów* — pakiety w `src/` to kopie 1:1 narzędzi
  (stan z hotfixami 2026-07-07); stare foldery działają dalej jako zapas. Weekly/Wklej/Publikuj
  odpalane in-place z oryginalnych folderów.
- **Wyjście:** zaktualizowane pliki BT, CSV z generatora, macierz statusów w
  `%LOCALAPPDATA%\BTHub\status.json` (m.in. kod `BAD_DATE_J`).
- **Stack:** Python/Flask + WSGI middleware · NDJSON streaming · Excel COM (pywin32) · pytest · venv per user.
- **Status:** lokalne/produkcyjne (u każdego użytkownika, kod na `X:`).

## B2. CVS generator  *(początek łańcucha danych BT)*

- **Typ:** lokalna aplikacja (silnik Python + panel na `http.server`) na `127.0.0.1:8765`; też CLI.
- **Do czego służy:** produkuje **5 kanonicznych plików CSV — „źródło prawdy"** (`Main_Page.csv`,
  `Finanse.csv`, `Produkcja.csv`, `Komentarze.csv`, `Wykonanie.csv`) zasilających dashboard **Budget
  Tracking**. Odtwarza **1:1 logikę makra** „Generator CVS — kopia.xlsm", ale czyta arkusze przez
  `openpyxl` **bez uruchamiania Excela**. Wyjście **bit-w-bit zgodne z makrem** (format liczb VBA
  zweryfikowany na 18 201 tokenach). Działa **inkrementalnie** (dograj tylko nowsze tygodnie) lub pełna przebudowa.
- **Co zastępuje / jak upraszcza pracę:** wolne generowanie CSV makrem VBA / eksport z PowerQuery
  (wymagał Excela, otwierał każdy skoroszyt osobno, przeliczał całość). Teraz: dwuklik + jeden klik,
  aktualizacja tygodnia w kilka–kilkanaście sekund.
- **Wejście → wyjście:** tygodniowe raporty projektowe (`01_Weekly Project Reports`, arkusz „ALL",
  markery vF/vAS) + arkusze „Baza Komentarzy" z plików budżetowych → 5 CSV (UTF-8 BOM) do datowanego
  podfolderu `Generated Data\<RRRR-MM-DD>\`.
- **Stack:** Python 3.10+ · openpyxl · http.server/ThreadingHTTPServer · ThreadPoolExecutor · pytest.
- **Status:** produkcja/lokalne; wyjście zweryfikowane wobec makra.
- **Uwaga nazewnicza:** narzędzie nazywa się „CVS generator", ale produkuje **CSV** (nazwa dziedziczona po makrze).

## B3. RBH import  *(roboczogodziny)*

- **Typ:** lokalny dashboard (Flask) `localhost:8765`, dwuklik `start.bat`.
- **Do czego służy:** przenosi **koszty pracy** (roboczogodziny akordowe z hali + robocizna na
  wyjazdach/delegacjach) z rejestrów kierowników budów do arkusza **„robocizna"** plików BT — do
  kolumny właściwego miesiąca i wiersza właściwego etapu. Dwa etapy z VBA: **scalenie** rejestrów do
  jednej bazy in-memory (agregacja per inwestycja/etap + akordy) i **wpis** z mapowaniem etapów/miesięcy.
- **Co zastępuje:** makro „Narzędzie do RBH.xlsm" i ręczne sumowanie + przeklejanie do każdego pliku BT.
  Teraz: wskaż 3 foldery → „Scal" → TEST → walidator (❌ przy niedopasowanych etapach) → „Wpis PROD".
  Skraca pracę z godzin do minut, eliminuje ciche pomyłki (zły etap/kolumna) i zniszczenie skoroszytu.
- **Wejście → wyjście:** `MONTAZ-*.xlsx` (wyjazdy, typ PR) + `REJESTR RBH-ZBIORCZY_*.xlsx` (hala + arkusz
  „Akordy", typ RBH) + root budżetów BT → sumy robocizny per etap + data wpisu (backup przed zapisem).
- **Stack:** Python/Flask · pandas · openpyxl · pywin32 (Excel COM) · 163 testy.
- **Świadomie pominięte wobec VBA:** moduły Cache i PM_Alerts (mailer), generowanie pivotów, akordy
  z plików wyjazdowych PR (akordy tylko z rejestru zbiorczego hali).

## B4. LOMAG Import  *(materiał / magazyn)*

- **Typ:** lokalny dashboard (Flask) `localhost:8770`, dwuklik `start.bat`.
- **Do czego służy:** cotygodniowa **„wysyłka do zakupowców"** — bierze zagregowane koszty materiału
  z systemu magazynowego **LOMAG** (po pre-processingu w Excelu) i rozprowadza je do arkusza
  **„zakupowcy"** plików BT, pod komórki-anchor z mapy `LOMAG_Anchory` (wartości ujemne + formuła `=*-1`,
  stempel dzisiejszej daty, podmiana arkusza `LOMAG_Nowy`, PDF-y do archiwum). Port 1:1 procedury VBA
  `LOMAG_Wyslij_Do_Zakupowcow_Auto`.
- **Co zastępuje:** jeden przycisk „Wyślij do zakupowców" w makrze, który **po cichu** otwierał pliki BT
  i wklejał dane — bez podglądu, walidacji, kruchy (błędy 438). Teraz: warstwa kontrolna liczy **różnicę
  pivota tydzień-do-tygodnia** (ile POWINNO przybyć), **symuluje** faktyczny wpis (ile REALNIE się wpisze)
  i robi **sanity-check co do grosza** (GREEN/YELLOW/RED) zanim cokolwiek zapisze. „Zobacz, potwierdź, zapisz ze śladem".
- **Wejście → wyjście:** 2 pliki LOMAG `.xlsm` (bieżący + poprzedni tydzień; arkusze „Tabela Przestawna",
  „LOMAG_Nowy", „LOMAG_Anchory", cache) → wpisy materiału per etap w plikach BT + stempel daty + PDF-y + backup.
- **Stack:** Python/Flask · openpyxl (keep_vba) · pywin32 · reportlab (PDF) · pytest.
- **Status:** funkcjonalnie zaawansowane (core praktycznie kompletny; markery „w toku" w README nieaktualne).
  Benchmark regresyjny 18.05 vs 11.05 (łączna delta +1 040 238,82 PLN) do walidacji zgodności z VBA.

## B5. Other Cost Import  *(„Koszty Pozostałe")*

- **Typ:** lokalny dashboard (Flask) `localhost:8766`, dwuklik `start.bat`.
- **Do czego służy:** importuje **koszty pozostałe** z miesięcznego eksportu ERP (**„plik Magdy"** `.xls`,
  ~9–10 tys. wierszy) do plików BT. Każdy wiersz **klasyfikowany przez Słownik** (flaga DO BUDGET TRACKING:
  TAK/TRANS/MAT/DIETY/NIE) i kierowany do jednego z 4 kubełków → arkusze BT: **Koszty Pozostałe / Transport
  Modułów / zakupowcy / robocizna**. Numer inwestycji wyciągany z numeru konta; dopisywane **tylko NOWE
  wiersze** (dedup po `Nr dziennika + Konto + Kategoria + Kwota`).
- **Co zastępuje:** makro „Narzędzie kosztów pozostałych.xlsm" + ręczne filtrowanie, kategoryzowanie i
  przeklejanie tysięcy wierszy do kilkudziesięciu plików. Poprawki wobec VBA: **backup**, **TEST/walidator**
  (VBA: każdy przebieg = PROD), silniejszy dedup, raportowanie kont łączonych, konfigurowalność (`buckets.json`).
- **Wejście → wyjście:** „plik Magdy" + `Słownik.xlsx` + root BT → nowe (podświetlone) wiersze w 4 arkuszach +
  odświeżone sumy + backup + log audytowy `_BT_KP_LOG.xlsx`.
- **Stack:** Python/Flask · openpyxl · xlrd (stare `.xls`) · pywin32 · pytest.
- **Status:** v1 wdrożone; v2 planowane (mailer PDF do PM-ów, eksport PDF zmian).

## B6. Przerób Import  *(przerób / wykonanie produkcyjne)*

- **Typ:** lokalny dashboard (Flask) `localhost:8767`, dwuklik `start.bat`. Wzorowany na RBH/Other Cost.
- **Do czego służy:** wkleja dane z pliku **`Scalony_Przerob_*.xlsx`** (arkusz „Scalony Przerób") do plików
  BT. Dla każdej inwestycji: znajduje plik **wyłącznie** w `Folder plików_wtrakcie` (brak = inwestycja
  POMINIĘTA, bez fallbacku), filtruje źródło (`Wykonanie % == 100%`), wkleja kolumny B,C,D,F,G,H,I do arkusza
  wzorcowego, **dopełnia formuły pomocnicze** (FillDown), przelicza i sprawdza kontrolkę **`L1 == 0`**,
  odświeża pivoty w arkuszu `PRZERÓB_%` i stempluje datę.
- **Co zastępuje:** ręczne wklejanie przerobu do każdego pliku BT. TEST MODE pokazuje pełny diff; PROD robi
  backup i atomowy zapis. Bezpieczniki: arkusz o innym układzie kolumn → POMINIĘTY („INNY UKŁAD"), zmiana
  układu pliku źródłowego → twardy stop, kolumny tekstowe wklejane z formatem `@` (numer modułu '101' zostaje tekstem).
- **Wejście → wyjście:** `Scalony_Przerob_*.xlsx` + pliki BT (wtrakcie) → przerób wpisany do arkusza wzorcowego,
  `L1==0`, data w `PRZERÓB_%`, log `_BT_PRZEROB_LOG.xlsx`.
- **Stack:** Python/Flask · openpyxl · pywin32 (Excel COM) · pytest (unit + e2e przez COM).

## B7. Globalna Formuła Sprawdzająca („sprawdzarka")  *(kontrola jakości, read-only)*

- **Typ:** narzędzie **CLI/terminalowe** (menu + flagi), dwuklik `Uruchom.bat`.
- **Do czego służy:** **tylko do odczytu** przechodzi po wszystkich plikach BT i wychwytuje błędy zanim
  trafią dalej. W „Cost Tracking Summary" czyta tydzień/marżę/koszty i łapie **ujemne estymacje PM**;
  w „raport błędów" odtwarza formuły kontrolne: kolumna **E** (uzgodnienia = 0) i **J/N** (daty poza
  tygodniem raportu → kod **`BAD_DATE_J`**). Wynik = zbiorczy raport XLSX/CSV + **macierz pewności**
  OK/UWAGA/BŁĄD per inwestycja.
- **Co zastępuje:** ręczne otwieranie każdego pliku i sprawdzanie „na oko" czerwonych komórek. Robi to
  jednym przebiegiem dla wszystkich inwestycji, deterministycznie; zwraca **kod wyjścia 1** przy jakimkolwiek
  BŁĘDZIE (nadaje się do automatyzacji). **Niczego nie zapisuje w plikach BT** — jedyny zapis to raport.
- **Miejsce w ekosystemie:** bliźniak Other Cost Import o **odwróconej roli** (tamten zapisuje, ten tylko
  czyta i waliduje); wspólna logika wyszukiwania inwestycji. Bramka jakości **przed** publikacją/raportowaniem.
- **Stack:** Python 3.10+ · openpyxl (read_only, data_only — czyta cache formuł) · xlrd · colorama.
- **Status:** produkcja/lokalne. Używana też z BT Hub jako „Sprawdź WSZYSTKIE".

## B8. Wklej do ALLa  *(konsolidacja do zbiorczego pliku „AS")*

- **Typ:** narzędzie **terminalowe z menu** (dwuklik `start.bat` → menu przyciskowe), też CLI.
- **Do czego służy:** cotygodniowe kopiowanie zakładki **„Cost Tracking Summary"** z każdego pliku
  budżetowego i wklejanie **wartości** do arkusza danej inwestycji w zbiorczym pliku raportu **„AS"**
  (`..._vAS.xlsx`). Auto-wykrywa najnowszy folder daty (`YYMMDD`), plik „AS", arkusze zaczynające się od
  **5-cyfrowego numeru** inwestycji i najnowszy plik budżetowy „o poziom wyżej".
- **Co zastępuje:** ręczne „wejdź w plik → Ctrl+A → kopiuj → wklej wartości do arkusza w AS" powtarzane
  dla każdej inwestycji. Mechanika rozpoznawania inwestycji przejęta z RBH import.
- **Model bezpieczeństwa (rozbudowany):** domyślnie **DRY-RUN**; **backup** AS przed zapisem (weryfikowany);
  **bramka zapisu** — `--apply` zapisuje **tylko gdy walidacja czysta** (zero WARN/ERR). Graduacja permisywności:
  `[2]` tylko czyste → `[3]` z WARN → `[4]` z WARN, pomijając ERR. Walidacja komórka-po-komórce (świadoma
  dat↔liczb seryjnych, `#VALUE!`, tolerancji float), kontrola regresji week, wykrywanie starych danych,
  pre-check blokady `~$`, gwarantowane zamknięcie procesu Excela.
- **Stack:** Python · openpyxl + pywin32 (Excel COM, early binding) · menu `.bat`.
- **Status:** produkcja (używane cotygodniowo).

## B9. Publikuj wersję  *(gatekeeper wersji danych)*

- **Typ:** skrypt **PowerShell** (`publikuj_wersje.ps1`) + launcher `.bat`; wywoływany też z BT Hub.
- **Do czego służy:** hurtowo **„publikuje" (zatwierdza) robocze wersje plików BT** naraz dla wszystkich
  inwestycji. Dla każdego folderu (nazwa zaczyna się od 5 cyfr): (1) przenosi dotychczasowe pliki z korzenia
  do **ARCHIWUM**, (2) bierze najnowszy plik z podfolderu **„...wtrakcie"**, przenosi do korzenia i zmienia
  nazwę (usuwa człon „wtrakcie", dokleja końcówkę **a**/**k**). Jednoznacznie wskazuje **oficjalną wersję**
  budżetu w cyklu, zachowując historię w ARCHIWUM.
- **Co zastępuje:** ręczne „zamykanie" wersji folder po folderze (~30 inwestycji): przeciąganie do ARCHIWUM,
  wyjmowanie z „wtrakcie", przenoszenie, przemianowywanie. Teraz: dwuklik → wybór a/k → „TAK" → kilkanaście
  sekund (log z 02.07.2026: zarchiwizowano 29, opublikowano 29, pominięto 5).
- **Zabezpieczenia:** `-DryRun`, obowiązkowe „TAK" (chyba że `-AutoYes` dla wywołań z Hub), ochrona przed
  nadpisaniem (dokleja „ (2)", „ (3)"), try/catch per inwestycja, pełny log `log_publikacja_*.txt` (UTF-8 BOM).
  Fizyczne przeniesienia (`Move-Item`), nie kopie.
- **Stack:** czysty PowerShell, bez zależności; działa na `X:`.
- **Status:** produkcja (logi maj–lipiec 2026).

## B10. Weekly Raport Generator  *(raport tygodniowy dla Zarządu)*

- **Typ:** lokalna aplikacja (Python), dwuklik `Generuj Weekly Raport.bat`; wyjście = **offline'owy
  interaktywny raport HTML (SPA) + XLSX**.
- **Do czego służy:** składa cotygodniowy raport zbiorczy o statusie **wszystkich projektów** dla Zarządu.
  Czyta na żywo plik-master (arkusz `Email_Summary`), pliki budżetowe każdej inwestycji i historię marży,
  liczy **health/band (ok/watch/risk)** i metryki portfelowe. Renderuje sortowalną tabelę inwestycji z
  komentarzami PM, pasek KPI oraz widok szczegółowy (wykres historii marży SVG + karty **31 etapów** z
  odchyleniem od budżetu, kosztami PLN/USD po kursie FX, % ukończenia).
- **Co zastępuje:** ręczne składanie raportu „All projects / weekly report" w Excelu (zbieranie metryk z
  dziesiątek plików, przeklejanie, formatowanie, branding, PDF-y). Teraz: jeden dwuklik → gotowy, brandowany
  raport w kilka–kilkanaście sekund.
- **Wejście → wyjście:** master `Generator raportów weekly .xlsm` + pliki budżetowe BT + `Main_Page.csv`
  (z **CVS generatora**) → `Nuconic_Weekly_RRRR-MM-DD.html` (jednoplikowy, offline, fonty+logo w base64,
  motyw jasny/ciemny, eksport CSV/PDF) + `.xlsx` (arkusz „Summary").
- **Stack:** Python · openpyxl · ThreadPoolExecutor · HTML/CSS/JS + SVG · base64-embedded assets.
- **Status:** produkcja (raporty regularnie od 2026-06). Branding wg księgi znaku (Nunito Sans, złoty
  `#FFA914`, hasło „Redefining how the world is built").

---

# CZĘŚĆ C — Infrastruktura i fundament współdzielony

## C1. Excel Sync bridge  *(most Windows → serwer)*

- **Typ:** skrypt automatyzujący (Python) działający w tle na Windowsie użytkownika (Task Scheduler / `pythonw`).
  Pliki: `nuconic_sync.py` (aktywny), `nas_sync.py` (nowsza wersja serwerowa).
- **Do czego służy:** rozwiązuje twardy problem infrastrukturalny — serwer **Protocol Managera** (Debian LXC)
  **nie może zamontować dysku `X:`/NAS**. Skrypt co ~5 min różnicowo (mtime) i atomowo (`.tmp` + rename)
  wypycha przez **SFTP** zmienione Excele (rejestry godzin, Kierownicy Budów, Lista_Mail) na serwer do
  `data_synced/` i ściąga z powrotem gotowe protokoły (PDF/DOCX) do lokalnych folderów `Protokoły_*`.
- **Co zastępuje / jak upraszcza pracę:** ręczne wgrywanie Exceli na serwer po każdej edycji i pobieranie
  gotowych protokołów — teraz cały transfer dzieje się automatycznie w tle.
- **Miejsce w ekosystemie:** warstwa „plumbing" na **początku** łańcucha dokumentowego — dostarcza
  Protocol Managerowi aktualne dane wejściowe i odbiera produkt.
- **Stack:** Python · paramiko (SFTP) / smbprotocol (SMB w `nas_sync.py`) · Task Scheduler · klucz ed25519.
- **Status:** produkcja (na Windowsie usera). Docelowo cały mechanizm ma zniknąć na rzecz **bezpośredniego
  montowania SMB na serwerze** (`INSTRUKCJA_IT_MOUNT_SMB.md`) — zablokowane po stronie IT (DNS wewnętrzny + CIFS w LXC).
- **Uwaga:** wymaga włączonego PC usera z zamontowanym `X:`. W plikach źródłowych są zaszyte poświadczenia —
  materiał wrażliwy (do przeniesienia do zmiennych środowiskowych).

## C2. nuconic-ui-kit  *(design-system / księga znaku — fundament pod wszystkim)*

- **Typ:** **współdzielony design-system**, dystrybuowany jako **skill Claude Code** (`SKILL.md` + kanoniczne
  assety copy-paste). Nie jest uruchamialną aplikacją — to biblioteka wiedzy i gotowych plików UI.
- **Do czego służy:** **jedno źródło prawdy dla warstwy wizualnej wszystkich narzędzi** (Plan Płatności,
  Protocol Manager, Budget Tracking). Kodyfikuje księgę znaku: paleta **czerń/biel + jeden akcent złota
  `#FFA914`** (zieleń = sukces/historia, ceglany = problem/odrzucone), font **Nunito Sans**, skala
  typograficzna, geometria shellu, komplet komponentów (przyciski, chipy statusów, ~65 ikon Lucide, tabele,
  wykresy SSR SVG, formularze, modale, tło `bg_beams`) wraz z **twardymi zasadami** wyuczonymi na błędach
  (status = kolor + ikona + tekst; kwoty w `tabular-nums`; zakaz animowania SVG w tle; sticky = nieprzezroczyste tła).
- **Co zastępuje / jak upraszcza pracę:** wcześniej każde narzędzie miało własny, ręcznie sklecony UI —
  inne odcienie, przyciski, formaty kwot; powielany CSS i powtarzalne błędy. Teraz punktem wyjścia jest
  gotowy zestaw, a **globalna zmiana marki robiona jest raz** w tym repo i nadpisywana we wszystkich
  narzędziach (marker `APP-SPECIFIC` oddziela kod appki od części globalnej). Standard napisany **pod agenta AI**,
  więc Claude Code buduje UI zgodnie z nim automatycznie.
- **Reużycie:** cały folder skilla **kopiuje się** do `<projekt>\.claude\skills\nuconic-ui\`; identyczna
  kopia żyje np. w `Billing schedule tool\.claude\skills\nuconic-ui`. Aplikacją referencyjną (źródłem
  standardu) jest **Plan Płatności**.
- **Stack:** FastAPI/Jinja2 (SSR) · czysty **CSS na zmiennych** (jeden `app.css`) · Vanilla JS · wykresy jako
  **SSR SVG** (bez bibliotek) · Nunito Sans woff2 self-hosted. Świadomie **NO React / NO Tailwind / NO CDN**
  (praca w LAN). Zawiera też skill pomocniczy `ui-ux-pro-max` (ogólna wiedza UI/UX).
- **Status:** produkcja/referencja (v1.1, 2026-07-13 — znak zredukowany do logo „n", tło `bg_beams`, zamrożony shell).

---

## 4. Wspólne konwencje i wnioski dla architektury

**Powtarzalne wybory technologiczne (warto zachować spójność):**
- Backend aplikacji: **Python + FastAPI** (serwerowe) lub **Flask** (lokalne narzędzia). Jeden wyjątek:
  Budget Tracking ma backend **Node/Express** (historyczny).
- Front: **React 18 + Vite + TypeScript** to kierunek docelowy dla aplikacji webowych; starsze widoki w
  Jinja2/Vanilla JS współistnieją jako fallback.
- **Excel = warstwa danych.** Odczyt `openpyxl`, zapis **przez Excel COM (pywin32)**, żeby nie niszczyć
  makr/pivotów/walidacji. Daty zapisywane jako **serial Excela** (omija TZ-bug pywin32).
- Pieniądze: **`Decimal`/grosze-centy, nigdy `float`**; format PL `12 345,67 PLN`, US `$1,234,567.89`.
- Bezpieczeństwo pracy na plikach: **TEST → PROD**, backup przed zapisem, walidacja/sanity-check, log audytowy.
- Bezpieczeństwo aplikacji: sesje server-side, hasła hashowane (bcrypt/Argon2id), authz deny-by-default,
  audyt append-only, rate-limit, praca w LAN/VPN. (Budget Tracking przeszedł formalny audyt 2026-05-19.)
- Reużycie kodu między aplikacjami: `email_service.py`, `validators.py`, `system_time.py` (Protocol Manager →
  Plan Płatności) oraz **`nuconic-ui-kit`** wszędzie.

**Kluczowe łańcuchy zależności (co czym karmić):**
- Importy (RBH/LOMAG/Other Cost/Przerób) **piszą** do plików BT → **Sprawdzarka** je waliduje →
  **Publikuj wersję** promuje → **CVS generator** robi z nich CSV → **Budget Tracking** i **Weekly Raport**
  je konsumują; **Wklej do ALLa** konsoliduje do „AS"; **BT Hub** spina to wszystko w jednym UI z kolejką Excel COM.
- **Protocol Manager** stoi osobno na łańcuchu dokumentowym (robocizna/umowy/rozliczenia), zasilany przez
  **Excel Sync bridge** i integracje państwowe (GUS/KRS/rejestr.io) + Autenti.
- **Plan Płatności** to najnowszy, najbardziej „produktowy" kierunek (PostgreSQL, maszyny stanów, RBAC,
  four-eyes, React) — dobry wzorzec bazowy pod komercjalizację narzędzi dla innych firm.

**Środowisko:** Windows + OneDrive + dysk sieciowy `X:` po stronie użytkowników; serwery aplikacji to
Debian 12 (Proxmox/LXC) za nginx, usługi `systemd`, dostęp LAN/VPN. Node bywa „przenośny" poza `PATH`.

---

*Dokument opisuje stan na lipiec 2026. Aktualizuj przy dodaniu nowego narzędzia — zachowaj układ:
Typ · Do czego służy · Co zastępuje/jak upraszcza pracę · Wejście→Wyjście · Interfejs · Użytkownicy ·
Miejsce w ekosystemie · Stack · Status.*
