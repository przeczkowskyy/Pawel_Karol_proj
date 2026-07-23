# Kolejka następnych rund researchu

> Lead-Scout bierze 2–3 tematy z góry listy na rundę; zrobione wykreśla,
> nowe pomysły dopisuje na dole. Kolejność = priorytet. Stan po rundzie 1 (2026-07-23).

- [x] ~~Domknij rundę 1~~ — zrobione 2026-07-23: werdykty weryfikatorów złączone z leadami, odrzucono 12 (w tym duplikaty Łęgprzem/Marani i firmy poza ICP: Euroklimat, DORACO, Kopel, Whitley, CNTNR), 32 zweryfikowane w leads.json, digest napisany.
- [ ] Runda sygnałowa "ogłoszenia o pracę": przeszukaj Pracuj.pl, RocketJobs i LinkedIn Jobs pod frazami "kontroler finansowy Excel", "analityk finansowy VBA", "specjalista ds. raportowania" w produkcji/budownictwie/dystrybucji i zbierz 5–10 firm 20–250 osób z AKTYWNYM ogłoszeniem (URL sygnału obowiązkowy).
- [ ] Runda decydentów: dla 10 najlepiej ocenionych potwierdzonych leadów PL ustal przez KRS/rejestr.io, LinkedIn i Apollo.io nazwiska decydentów (właściciel/CFO) i championów (główna księgowa/kierownik kontrolingu) z linkami do profili i dopisz je do leads.json.
- [ ] Runda partnerska (wariant C ICP): zbuduj listę 15 regionalnych wdrożeniowców ERP (autoryzowani partnerzy Comarch, enova365, InsERT z województw mazowieckiego/wielkopolskiego/śląskiego) oraz 10 biur rachunkowych i firm audytorskich obsługujących produkcję 50–150 osób, jako cele partnerstw prowizyjnych.
- [ ] Runda "szybki wzrost": skrzyżuj laureatów Gazel Biznesu i Diamentów Forbesa 2024–2026 z branż produkcja/budownictwo/dystrybucja z widełkami 50–150 osób (Aleo/REGON) i zbierz 5–10 leadów z udokumentowanym sygnałem wzrostu.
- [ ] Runda "nowa hala/inwestycja": przeszukaj decyzje o wsparciu PSI/SSE, prasę regionalną i komunikaty o rozbudowach z ostatnich 6 miesięcy i zbierz 5–8 firm produkcyjnych 50–250 osób inwestujących w nowe moce produkcyjne.
- [ ] Runda "wdrożenie ERP w toku": znajdź 5–8 firm z aktywnymi ogłoszeniami typu "konsultant wdrożeniowy Comarch XL/enova365", "kierownik projektu wdrożenia ERP" jako sygnałem trwającego lub utkniętego wdrożenia.
- [ ] Runda operacjonalizacji monitoringu: skonfiguruj i udokumentuj w leadscout/zrodla.md działające alerty (JobAlert Pracuj.pl, LinkedIn Jobs, Google Alerts, F5Bot dla r/Construction i r/Accounting, monitoring rejestr.io dla firm z bazy) wraz z listą dokładnych fraz.
- [ ] Runda dywersyfikacji pl-dystrybucja: znajdź 5–8 dystrybutorów B2B 50–250 osób spoza hurtu elektrotechnicznego — spożywczy, budowlany, opakowania, części techniczne/motoryzacyjne — z weryfikacją zatrudnienia i ERP.
- [ ] Runda pogłębienia US (bez outboundu do ~6. miesiąca): dla 12 leadów us-construction potwierdź zatrudnienie 50–250 i faktyczne użycie fakturowania AIA G702/G703 (Indeed "pay application"/"AIA billing", strony karier, MBI), nadaj scoring i oznacz w bazie jako segment odroczony.
- [ ] Runda uzupełnienia playbooka outbound: dopisz brakujące szablony — wersje EN pod niszę AIA G703, wiadomość do partnera (biuro rachunkowe/wdrożeniowiec ERP), list papierowy do modelu dwuetapowego PKE, mail 3/breakup oraz mapowanie każdego z 5 triggerów na konkretny szablon.

## Znane luki rundy 1 (kontekst od krytyka)

> Krytyk oceniał stan PRZED domknięciem bazy — luki o pustym leads.json, braku
> dedupe i niepotwierdzonych firmach są już rozwiązane (2026-07-23). Reszta aktualna.

- Żaden lead nie ma przypisanego AKTYWNEGO sygnału zakupu z URL-em (ogłoszenie o kontrolera z Excel/VBA, nowy CFO, nowa hala, audyt) — źródła sygnałowe są wymienione jako lista, ale nie zostały użyte do selekcji firm, mimo że scoring daje +3 za sygnał i to sygnały definiują "kupują TERAZ".
- Zero danych o decydentach i championach: brak nazwisk właścicieli/CFO/głównych księgowych i jakichkolwiek kontaktów (Apollo.io wymienione, niewykorzystane) — istnieją szablony outboundowe, ale nie ma do kogo ich wysłać.
- Brak weryfikacji zatrudnienia i przychodu per firma względem widełek 20–250 osób / 20–150 mln PLN — na listach są podmioty prawdopodobnie poza ICP lub z modyfikatorem −3 (np. Korporacja Budowlana DORACO, DACPOL, Lange Łukaszuk, Elhurt — ryzyko >250 osób, grupa kapitałowa, własny dział IT).
- ZPC Milanówek to produkcja spożywcza (procesowa), nie dyskretna — poza rdzeniem ICP; brak uzasadnienia, dlaczego trafiła do pl-produkcja.
- Odwrócona alokacja względem priorytetów planu (§2.6): rdzeniowy segment pl-produkcja (wariant A, start tydzień 1) ma najmniej leadów (9), a us-construction (wariant B, outbound dopiero od ~6. miesiąca) aż 12 — leady US zestarzeją się przed startem kontaktu.
- Pominięty wariant C ICP (kanał równoległy od miesiąca 1): brak choćby jednej konkretnej nazwy biura rachunkowego, firmy audytorskiej czy regionalnego wdrożeniowca ERP (partnerzy Comarch/enova365/InsERT) — kanał partnerski wymieniony, zero podmiotów do rozmów.
- Monitoring sygnałów niezoperacjonalizowany: nic nie wskazuje, że JobAlerty Pracuj.pl, alerty LinkedIn Jobs, Google Alerts/Visualping/F5Bot czy monitoring rejestr.io/imsig faktycznie zostały skonfigurowane — to nadal lista pomysłów, nie działający system wczesnego ostrzegania.
- Niepokryte typy sygnałów z planu: "utknięte/trwające wdrożenie ERP" (np. ogłoszenia o konsultantów wdrożeniowych), "audyt / due diligence" (imsig, transakcje M&A/PE) oraz "nowa hala/inwestycja" (decyzje SSE/PSI, pozwolenia na budowę, prasa regionalna) — żadne z tych źródeł nie wygenerowało leada.
- pl-dystrybucja mało zdywersyfikowana: ~połowa firm to hurt elektrotechniczny (Dynamik, DACPOL, Elhurt, Kopel, Lange Łukaszuk) — brak dystrybucji spożywczej (poza JOT-Ł), budowlanej, opakowań i części technicznych.
- Braki w outbound: tylko 5 szablonów PL — brak wersji EN dla us-construction (nisza AIA G702/G703), szablonu do partnerów (biuro rachunkowe / wdrożeniowiec ERP), listu papierowego (deklarowany model dwuetapowy PKE + poczta papierowa) oraz dalszych kroków sekwencji (mail 3 / breakup / wiadomość po akceptacji zaproszenia LinkedIn); z 5 triggerów tylko jeden ma dedykowany szablon.
- Brak lokalizacji leadów (miasto/województwo/stan) — pole wymagane w formacie leads.json, a istotne dla partnerstw regionalnych, targów i planowania spotkań.
- Kanały marketingowe bez osi czasu, właściciela (Paweł/Karol) i mierników — plan-strategiczny §2.4 daje ranking i rytm (20 wiadomości/tydz., tydzień 1: lista 100 firm), streszczenie tego nie odzwierciedla.
