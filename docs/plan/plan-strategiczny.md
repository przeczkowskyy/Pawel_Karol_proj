# Plan strategiczny — firma automatyzacji danych (Paweł + Karol)

> **Status:** zatwierdzony 2026-07-21 (sesja planistyczna Plan Mode).
> Dokument planistyczny — reagujemy na niego zmianami w tym pliku; decyzje odnotowujemy w sekcjach.

## Kontekst

Dwuosobowy zespół (Paweł + Karol) + Claude Code zakłada firmę: **usługi automatyzacji,
upraszczania i czyszczenia danych dla MŚP** — zamiana ręcznego Excela, makr VBA i obiegu
mailowego na powtarzalne, audytowalne narzędzia. Hook nadrzędny: **wdrożenie w DNI, nie
w miesiące**. Dowód kompetencji: ekosystem ~15 narzędzi zbudowanych wewnętrznie dla Nuconic
(opisany w `docs/nuconic-ekosystem-referencja.md` — materiał referencyjny,
NIE produkt). Sesja obejmuje wyłącznie strategię i strukturę; **świadomie odłożone: UI
(powstanie z rebrandowanego `nuconic-ui-kit`) oraz serwer/hosting**.

**Decyzje podjęte w sesji (wiążące):**
- Rynek: **Polska + USA etapowo** (strona pod i18n od dnia 1, publikacja `/en/` później).
- Moduły na stronie: **sekcje marketingowe + jedno lekkie demo KPI** (100% client-side, zero backendu).
- Model: **hybryda** — produktowy rdzeń (biblioteka), customowa fasada.
- Dane: **on-premise domyślnie** (dwuklik, Excel jako warstwa danych); hostowane panele KPI tylko jako opcjonalny płatny dodatek.
- Zespół: 2 osoby + Claude Code; **sprzedaż od zera** (bez ciepłych leadów).

---

## 1. Model biznesowy

### 1.1 Co sprzedajemy — granica usługa/produkt

Klient kupuje **rezultat** ("proces X przestaje być ręczny"), dostarczany z trzech warstw:

| Warstwa | Zawartość | Powtarzalność |
|---|---|---|
| **Rdzeń (biblioteka — nasz IP)** | TEST→PROD, backup przed zapisem, diff zmian, log audytowy, sanity-check sum, zapis Excel COM, launcher dwuklik, shell UI | 100% — identyczny u każdego klienta; źródło "dni nie miesiące" |
| **Konfiguracja (per klient)** | Mapowania arkuszy/kolumn, słowniki, reguły walidacji, ścieżki, progi | Wzorzec powtarzalny, wartości w plikach config — nie w kodzie |
| **Fasada (custom)** | Branding raportów, nazwy, wyjątki procesu | 0% — jawnie wyceniana osobno |

**Reguła graniczna:** wszystko, co dotyka Excela "od spodu", pochodzi z biblioteki. Funkcja
wymagająca zmiany rdzenia → albo trafia do biblioteki (inwestujemy), albo wycena ×1,5.

**IP u klienta:** licencja wieczysta na użytek wewnętrzny + **pełne źródła i dokumentacja
zostają u klienta** ("jeśli znikniemy, narzędzie działa dalej") — rozbraja lock-in i bus factor,
my zachowujemy prawo reużycia rdzenia. Wymaga jednej wzorcowej umowy.

### 1.2 Miks przychodowy

- **Rdzeń: sprinty fixed-price.** Płatny audyt/discovery tylko jako kwalifikator większych firm
  (150+ osób), w 100% zaliczany na sprint. **Retainer sprzedawany przy odbiorze każdego sprintu**
  (moment najwyższego zaufania). Abonament za hostowane panele KPI od ~4 miesiąca (tylko
  zagregowane CSV — bez danych transakcyjnych; zgodność z obietnicą on-prem).
- **Model % oszczędności — odrzucony na start** (niemierzalny baseline, odroczony cash flow,
  wydłuża negocjacje). Logika oszczędności używana tylko jako framing ceny; ewentualnie bonus za KPI w roku 2.
- **Cele:** miesiące 1–6: ~75% sprinty / 15% diagnozy / 10% retainery → 5–7 sprintów, ~110–160 tys. PLN.
  Miesiące 7–12: rosnący udział MRR → **15–20 tys. PLN MRR na koniec roku** (MRR ważniejszy niż
  jednorazowy przychód — wygładza konflikt sprzedaż/delivery).

### 1.3 Oferta wejściowa (wedge): „Pilot na kopii"

Sprint 5-dniowy ze zdejmowaniem ryzyka klienta:
- **Dzień 0** (wliczony): scoping, wybór 1 procesu, checklist gotowości, **zamrożenie zakresu na piśmie**.
- **Dni 1–4:** budowa **wyłącznie na kopii plików klienta** (sandbox — wzorzec z Nuconic jako argument sprzedażowy).
- **Dzień 5:** pokaz na żywo — diff "co by się zmieniło" na prawdziwych danych; TEST→PROD dopiero po akceptacji.
- **Płatność 50/50** — druga rata po działającym odbiorze zgodnym z zamrożonym zakresem.
- Hak przed wedge: **„Przyślij nam swój najgorszy Excel"** — 30-min demo na próbce pliku klienta (koszt: godziny; wysoka konwersja).

Merytoryczna zawartość pierwszego sprintu = **moduł M1 (audyt jakości danych)** — patrz 3.5.

### 1.4 Drabinka konta (netto, rynek PL)

| Szczebel | Oferta | Cena | Kiedy |
|---|---|---|---|
| 0 | "Najgorszy Excel" — demo na próbce | 0 PLN | pierwsza rozmowa |
| 1 | Diagnoza (1 dzień; opcjonalna, firmy 150+) | 3 500 PLN, zaliczana na sprint | tydzień 1–2 |
| 2 | **Sprint #1 — wedge (M1)** | 18 000–26 000 PLN | miesiąc 1 |
| 3 | Pakiet sprintów #2–#3 (raport, importy) | 48 000–66 000 PLN (−10% za pakiet) | miesiące 2–5 |
| 4 | Retainer "Opieka" (4–8 h/mies., next-business-day) | 1 900–4 900 PLN/mies. | przy odbiorze sprintu #1 |
| 5 | Panel KPI hostowany (dodatek) | 990–1 990 PLN/mies. | miesiąc 3+ |
| 6 | "Partner automatyzacji" (roadmapa kwartalna) | 6 000–9 000 PLN/mies. | rok 2 |

Docelowa wartość konta po 12 mies.: **60–120 tys. PLN + 3–7 tys. PLN MRR.** Zakres wycięty ze
sprintu #1 ("parking lot") = gotowy backlog sprintu #2.

### 1.5 Cennik — logika

USA: sprint $9 500–15 000; retainer $1 400–2 900; panel $690–1 290. Kotwice uzasadnienia:
(1) kontroler kosztuje firmę 10–15 tys. PLN/mies. — sprint zwraca się w ~2 miesiące;
(2) moduł raportowy ERP = 60–300 tys. PLN i pół roku. Zasady twarde: **"dni, nie miesiące"
uzasadnia cenę wyższą, nie niższą**; nigdy nie pokazujemy stawki dziennej; minimum 12 tys. PLN/sprint;
rabat wyłącznie wymienny (klienci 1–3: 12–15 tys. PLN **za imienną referencję + case z liczbami**);
po 3 ofertach przyjętych bez negocjacji cena +15%.

### 1.6 Ryzyka modelu i mitygacje

| Ryzyko | Mitygacja |
|---|---|
| Zależność od 2 osób | Runbook per wdrożenie; kod+dokumentacja u klienta; SLA tylko next-business-day; OC zawodowe; oboje znają każde wdrożenie |
| Scope creep / projekty bez końca | "1 proces" = 1 wejście, 1 wyjście, 1 właściciel; zakres zamrożony w Dniu 0; zmiany → płatny parking lot |
| Wycena za nisko | Twarde minimum; rabat tylko wymienny; przegląd cen co 3 sprinty |
| Sprzedaż vs delivery | Max 1 sprint naraz; rotacja ról co sprint; **nienaruszalny KPI: 20 kontaktów wychodzących/tydzień** |
| Custom zjada powtarzalność | Rdzeń nietykalny bez decyzji; "dzień ekstrakcji" po każdym wdrożeniu (wliczony w cenę); metryka: ≥60% kodu wdrożenia z biblioteki |

---

## 2. ICP — oczami klienta

### 2.1 Persona

**Firma:** produkcja dyskretna / budowlano-montażowa, **50–150 osób** (sweet spot: poniżej 50
brak etatowego kontrolera i budżetu; powyżej 150 dział IT i procedury zakupowe zabijają "dni").
Przychód 20–150 mln PLN. ERP jest (Comarch/enova/Subiekt), ale **raportowanie i tak żyje w Excelu**.
**Decydent:** właściciel (do ~100 osób) lub CFO. **Champion:** kierownik kontrolingu / główna
księgowa. **Użytkownik:** kontroler-analityk, "człowiek-Excel", wąskie gardło firmy.

### 2.2 Głosem klienta

> "Cała sprawozdawczość trzyma się na Marcie. Jak Marta jest na urlopie, nie wiem, ile zarabiam
> na projektach. Wiem, że to chore, ale działa — więc boję się cokolwiek ruszać."

**Boi się:** rozjazdu liczb starego i nowego; zepsucia makra, którego autor odszedł; vendor
lock-in; wdrożeniowego chaosu na pół roku; danych "w jakiejś chmurze".
**Chce:** przestać zależeć od jednej osoby; ufać liczbom; zamykać miesiąc w 3 dni; **nie zmieniać
sposobu pracy** ("niech działa obok moich plików").
**Mierzy sukces:** odzyskane godziny kontrolera; czas zamknięcia miesiąca; błędy złapane przed
zarządem; "urlop Marty bez telefonów".

**Nieufność → rozbrojenie konkretem:**

| Nieufność | Rozbrojenie |
|---|---|
| "Dwie osoby? A jak znikniecie?" | Kod + dokumentacja + runbook u Was od odbioru; utrzyma to każdy programista. Odwrócenie: dziś Wasz bus factor = 1 (Marta) — my go usuwamy |
| "Młoda firma, brak historii" | Case z liczbami (niżej) + płatność 50/50 po działającym odbiorze |
| "AI = halucynacje na finansach" | AI **buduje** narzędzie (stąd tempo); narzędzie **liczy deterministycznie** — sanity-check co do grosza, log każdej zmiany |
| "Custom = projekt bez końca" | Stała cena, zakres zamrożony na piśmie, 5 dni; bez stawki godzinowej nie mamy interesu w przeciąganiu |
| "Zepsujecie mi pliki" | Praca na kopii; diff przed pierwszym zapisem; automatyczny backup; tryb TEST — pokazujemy na demo, nie opowiadamy |

### 2.3 Wyzwalacze zakupu ("kupują TERAZ")

1. Odejście / L4 "excelowego guru" (sygnał: ogłoszenie o pracę "kontroler ze znajomością VBA" — **tani monitoring triggera w czasie rzeczywistym**),
2. audyt / due diligence, 3. skok skali (nowy kontrakt, druga hala), 4. kosztowny błąd w wycenie
(najsilniejszy emocjonalnie), 5. nowy CFO, 6. klient korporacyjny wymusza raportowanie,
7. utknięte wdrożenie ERP.

### 2.4 Kanały od zera — ranking i start

| # | Kanał | Start | Werdykt |
|---|---|---|---|
| 1 | LinkedIn outreach z profili founderów (CFO/gł. księgowa/kontroling/właściciel; produkcja+budownictwo 50–250 osób) | tydzień 1 | rdzeń |
| 2 | Case study Nuconic z liczbami (PDF + posty) | tydzień 1 | mnożnik kanału 1 i 4 |
| 3 | Cold mail (uwaga: art. 10 UŚUDE — pierwszy mail z pytaniem o zgodę) | tydzień 2–3 | dopełnienie, 1–3% odpowiedzi |
| 4 | Partnerstwa: biura rachunkowe ("ułatwiamy WAM pracę"), regionalni wdrożeniowcy ERP (fee 10% za projekty "za małe"), audytorzy | rozmowy od mies. 1 | owoce od mies. 3–6 |
| 5 | ICV Polska, Klub Dyrektorów Finansowych, targi; USA później: Modular Building Institute | mies. 3+ | średnio |

Komunikat wzorcowy (problem-first, bez słowa "AI"): *"Zgaduję, że zamknięcie miesiąca w [firma]
to kilka dni sklejania Exceli. Dla firmy produkcyjno-budowlanej z projektami w USA zautomatyzowaliśmy
import ~10 tys. wierszy kosztów miesięcznie: z 2 dni do kilkunastu minut, z backupem i logiem,
bez wynoszenia danych z firmy. Pokażę w 15 minut — na kopii Waszego pliku?"*

**Tydzień 1:** case study z 3–4 liczbami + zgoda Nuconic → profile LinkedIn pod nową firmę →
lista 100 firm z decydentami → 20 wiadomości (po 10/foundera) + 1. post → 2 rozmowy zwiadowcze z biurami rachunkowymi.

### 2.5 Obiekcje → kontry (do rozmów i na stronę)

- **"Za drogo"** → sprint < 2 miesięczne koszty kontrolera; zwrot przed końcem kwartału; ERP-moduł = 100 tys.+ i pół roku.
- **"Dane wrażliwe"** → wszystko lokalnie, u Was; nie mamy dostępu po wdrożeniu; panel hostowany opcjonalny i tylko agregaty.
- **"Custom = wolno i drogo"** → custom to cienka warstwa; silnik gotowy i sprawdzony w produkcji; stała cena na piśmie.
- **"Zepsujecie makro"** → nie ruszamy makra; budujemy obok na kopii; stare zostaje jak długo chcecie.
- **"Mamy ERP"** → automatyzujemy to, co dzieje się PO eksporcie z ERP; wchodzimy tam, gdzie ERP się kończy, a zaczyna Excel.
- **"Kim jesteście?"** → zespół, który rozwiązał to od środka w firmie PL/USA [liczby]; kod zostaje u Was; 2. rata po odbiorze.

### 2.6 Warianty ICP — rekomendacja

**A. Produkcja PL 50–150 osób — rdzeń od tygodnia 1** (case pasuje 1:1, decyzja właścicielska, krótki cykl).
**C. Biura rachunkowe — równolegle jako kanał** (rozmowy od mies. 1, bez oczekiwań przychodu do mies. 4).
**B. Budownictwo modułowe USA — od ~6 miesiąca**, otwierane niszą **"AIA G702/G703 billing
automation"** (rozwiązane w Nuconic — unikatowy atut) przez MBI/World of Modular; nie wcześniej,
bo zdalne delivery on-prem przy 2 osobach zje polski pipeline.

---

## 3. Katalog modułów (mapa Nuconic → produkt)

### 3.1 Korekty mapy z briefu (wobec pełnej referencji Nuconic — `docs/nuconic-ekosystem-referencja.md`)

1. CVS generator (B2) to plumbing "pod maską" raportowania — nie osobny moduł sprzedażowy.
2. Brief pomijał **B8+B9+B1** — a to spójny, sprzedawalny moduł "zamknięcie cyklu jednym przyciskiem" (realny log: 29 projektów opublikowanych w kilkanaście sekund).
3. Przerób (B6) to moduł **produkcji**, nie księgowości — inaczej dział "produkcja" byłby pusty.
4. "Czyszczenie danych" + Sprawdzarka (B7) = **jeden moduł "jakość danych"**: sprint (wedge) + cykliczny strażnik (abonament).
5. Łańcuch Budget Tracking = **pakiet** składany etapami, nie pojedynczy moduł (całość naraz łamie hook).
6. Excel Sync bridge (C1) i ui-kit (C2) = warstwa wspólna, nie moduły.
7. "Panele KPI" rozdzielone: **offline'owy jednoplikowy raport HTML (wzorzec B10) = "panel w dni"**; hostowany dashboard (A2) = wyłącznie dodatek fala 3 (tygodnie pracy + utrzymanie).

### 3.2 Katalog: 8 modułów + 1 pakiet

| # | Moduł (nazwa sprzedażowa) | Dział | Wzorzec | Wdrożenie | Ryzyko | Fala |
|---|---|---|---|---|---|---|
| M1 | **Audyt i strażnik jakości danych** *(wedge)* | przekrojowy | B7 + walidacje B4/B8 | 5 dni | **niskie** (read-only!) | 1 |
| M2 | **Raport zarządczy jednym kliknięciem** | KPI/zarząd | B10 + B2 | 5–10 dni | niskie/średnie (read-only) | 1 |
| M3 | Automatyczne importy ERP/magazyn → Twoje pliki | księgowość/finanse | B3+B4+B5 + szkielet | 5–15 dni/import | średnie (pisze! Excel COM) | 2 |
| M4 | Zamknięcie cyklu jednym przyciskiem | finanse/kontroling | B8+B9+B1 | 3–7 dni | średnie | 2 |
| M5 | Rejestr wykonania produkcji | produkcja | B6 + Production Dashboard | 5–10 dni | średnie (branżowy) | 2 |
| M6 | Panel KPI online *(dodatek)* | KPI | A2 | tygodnie | wysokie | 3 |
| M7 | Obieg dokumentów i umów | administracja | A1 | miesiące | wysokie (GUS/KRS = PL-only) | 3 (roadmap) |
| M8 | Obieg płatności i cash-flow (w tym AIA G703) | finanse | A3 | miesiące | wysokie | 3 (roadmap) |
| P1 | Pakiet: kontroling kosztów projektów | finanse | cały łańcuch B | program 4–8 tyg. **etapami** | — | składany z M1–M5 |

Kluczowe uczciwości: w M3 przenosi się **szkielet + model bezpieczeństwa (~60–70% pracy)**, nie
logika mapowań — komunikować "pierwszy działający import w ≤10 dni", nie "wszystko w dni".
M1/M2 są read-only na danych klienta — zero ryzyka uszkodzenia = idealne pierwsze wdrożenie.

### 3.3 Warstwa wspólna (właściwy "produktowy rdzeń" hybrydy)

Szkielet narzędzia lokalnego z sekcji 3 referencji Nuconic: launcher dwuklik + venv per user, Flask na
127.0.0.1, TEST→PROD, backup, log audytowy, sandbox. Każdy moduł M1–M5 = szkielet + logika
klienta. **To on jest źródłem "dni nie miesiące" i tak go opisujemy na stronie.** Hub (wzorzec B1)
dokładany od drugiego modułu u klienta — argument retencyjny.

### 3.4 Priorytetyzacja — werdykt wobec hipotezy briefu

Hipoteza "czyszczenie + KPI najpierw, importy potem, workflow na końcu" **kierunkowo trafna, z korektami**:
"czyszczenie" przeramowane na **audyt jakości danych** (jedyna pozycja briefu bez gotowego narzędzia;
walidator B7 istnieje, jest read-only i brzmi drożej niż "czyszczenie"); "panele KPI" na starcie =
**raport offline HTML**, nie hostowany dashboard. Fale: **1: M1+M2 (sprzedajemy od dnia 1)** →
**2: M3, M4, M5 (po 1–2 wdrożeniach)** → **3: M6 dodatek, M7/M8 roadmap.**

### 3.5 MVP oferty: pierwszy obcy klient w ≤10 dni

**"Sprint diagnoza + raport" = M1 + M2** (sam M1 = wedge 5-dniowy z 1.3; M1+M2 = pełne MVP):
dni 1–2 discovery na **kopiach** + zamrożenie zakresu → dni 3–5 walidator + **raport błędów
(namacalny efekt w dniu 5)** → dni 6–9 generator raportu zarządczego + weryfikacja zgodności
liczb z dotychczasowym raportem klienta → dzień 10 instalacja (dwuklik), szkolenie 1 h, przekazanie.
Kwalifikacja leada: **Windows + Excel**, powtarzalna struktura plików, jeden proces, zamrożony zakres.
Świadomie poza MVP: jakikolwiek **zapis** do plików klienta (fala 2, po zbudowaniu zaufania).

---

## 4. Landing page (high-level; bez UI i bez serwera)

### 4.1 Architektura informacji (kolejność sekcji)

1. **Hero:** hook + kwalifikacja ("dla firm 20–250 osób, które wyrosły na Excelu; dane zostają u Ciebie") + jedna liczba ("raport zarządczy w kilkanaście sekund zamiast godzin") + CTA "umów bezpłatną diagnozę".
2. **Ból lustrzany wobec ICP:** 5 kart (makro po kimś, kto odszedł · przeklejanie · ciche pomyłki · raport godzinami · wszystko na jednej osobie) + domknięcie: "Działa, więc boisz się ruszać. Słusznie. **Nie każemy Ci migrować z Excela — wchodzimy obok Twoich plików.**"
3. **Moduły:** oś główna **problemowa**, dział jako filtr/tag (korekta briefu: decydent MŚP myśli problemem, nie działem; model danych i tak wspiera obie osie). Karta = problem → co dostajesz → wartość liczbą → dni wdrożenia → status.
4. **Jak to działa / dlaczego dni:** 4 kroki (diagnoza na kopiach → budowa na wzorcach → TEST bez zapisu → PROD z backupem i logiem) + 4 powody tempa (biblioteka ~15 narzędzi · Excel zostaje · zero serwera · AI-wspomagane wytwarzanie). Sekcja jednocześnie rozbraja "zepsujecie mi pliki".
5. **Dowód — case Nuconic** (zanonimizowany do czasu zgody): raport w kilkanaście sekund · import ~10 tys. wierszy/mies. · zamknięcie ~30 projektów w kilkanaście sekund · RBH "z godzin do minut" · kontrola co do grosza przy deltach ~1 mln PLN/tydz.
6. **Demo KPI** (iteracja 2, za flagą — patrz 4.3).
7. **Zaufanie/bezpieczeństwo:** on-premise, TEST-mode, backup, log audytowy, RODO/dane u Ciebie. Przewaga nad SaaS.
8. **Oferta wejściowa:** "jeden proces, stała cena, ≤10 dni, pierwszy efekt w dniu 5".
9. **CTA:** mailto + link do kalendarza (formularz z backendem — odłożony). V2: FAQ z obiekcjami z 2.5.

### 4.2 Modułowość content-driven

**Jeden YAML per moduł** (czytelny dla nie-programisty, komentarze; treść w kluczach `i18n.pl`/`i18n.en`):
pola `id, status (available|pilot|roadmap|hidden), order, dzial, problem_tags, industries, markets,
delivery_days {min,max}, complexity, requires, addons, proof, i18n {name, tagline, problem, outcome,
for_who, value_bullets}`. Zasady: renderuj gdy `status ∈ {available,pilot}` ∧ `locale ∈ markets` ∧
`i18n[locale]` kompletne; `roadmap` → podsekcja "w przygotowaniu"; filtry client-side; **warianty
per odbiorca build-time, nie runtime** (`/pl/`, `/en/`, ew. `/pl/produkcja/` = ten sam YAML +
pre-ustawiony filtr). Sekcje nie-modułowe analogicznie w `sections/*.yml` — cała strona edytowalna bez kodu.

### 4.3 Demo KPI (jedno, lekkie, 100% client-side)

Panel fikcyjnej firmy produkcyjnej (6–8 projektów, 12 tygodni): 3 KPI, wykres per-etap w gramatyce
Nuconic (budżet złoty / w budżecie zielony / przekroczenie czerwony), przełącznik tygodnia, tabela
z komentarzami PM. Dane: statyczny `demo-kpi.json` (~20–50 KB) w bundlu, schemat zbliżony do
kanonicznych CSV z wzorca B2. Zero zapytań runtime; budżet < ~150 KB; stylizowane na **raport**
(miniatura B10), nie na "produkt SaaS". Podpis: "Działa w całości w Twojej przeglądarce, bez
serwera — tak samo działają narzędzia, które instalujemy u klientów." **Strona v1 publikowana
bez dema** (statyczny zrzut + liczby); demo jako iteracja 2 za flagą `hidden`.

### 4.4 Stack i struktura repo

Kierunek: **generator statyczny**, treść w plikach w repo, build → czysty katalog statyczny,
deploy = upload gdziekolwiek. Wymagania (wybór frameworka odłożony, będzie 1-dniowy): rendering
build-time z YAML, i18n `/pl/` `/en/`, domyślnie zero JS + wyspa na demo, zero backendu. Bez CMS.

```
/  (repo Pawel_Karol_proj)
├─ CLAUDE.md              # przewodnik po projekcie dla sesji Claude (referencja Nuconic → docs/)
├─ nuconic-ui-kit/        # baza przyszłego rebrandu (odłożone)
├─ docs/plan/             # dokumenty planistyczne (ten plan)
└─ site/                  # samowystarczalna strona
   ├─ content/modules/    # 1 YAML per moduł
   ├─ content/sections/   # hero, ból, jak-to-działa, zaufanie (pl+en)
   ├─ content/case-studies/
   ├─ data/demo-kpi.json
   ├─ src/                # framework TBD (odłożone)
   └─ public/
```

### 4.5 Świadomie odłożone

UI/warstwa wizualna (czeka na rebrand ui-kit i **nazwę/branding firmy**) · wybór frameworka ·
serwer/hosting/domena · backend formularza · publikacja `/en/` (dopiero z case'em pod US) ·
hostowany panel KPI jako produkt · analityka/CMS/kalkulatory.

---

## 5. Kwestionowanie — najsłabsze punkty (scalone, brutalnie)

1. **Nikt tu nie sprzedaje.** Dwóch inżynierów, zero leadów — to główna przyczyna śmierci takich firm. *Adres:* KPI 20 kontaktów/tydzień nienegocjowalne, rotacja ról co sprint, przegląd pipeline'u co piątek.
2. **IP i case mogą prawnie należeć do Nuconic.** Narzędzia powstały w ramach pracy dla Nuconic — bez pisemnej licencji "biblioteka" stoi na cudzym gruncie, a case bez zgody jest ryzykowny. *Adres:* **umowa z Nuconic (licencja na wzorce + zgoda na case) PRZED startem sprzedaży** — pozycja nr 1 kolejnych kroków.
3. **Hook mierzy delivery, a przychód wyznacza cykl zakupowy MŚP (4–12 tyg.).** *Adres:* obietnica doprecyzowana "od startu sprintu do działającego narzędzia"; checklist gotowości warunkiem startu; poduszka finansowa founderów ≥6 mies.
4. **"Biblioteka modułów" dziś nie istnieje** — istnieją narzędzia uszyte pod Nuconic. *Adres:* nie generalizować "na sucho"; ekstrakcja przy wdrożeniach 1–3 (dzień ekstrakcji w cenie); "moduł biblioteczny" = dopiero po 2. użyciu.
5. **Hook jest prawdziwy tylko dla części katalogu** (M1/M2 tak; importy "pierwszy automat w ≤10 dni"; M7/M8 wcale). *Adres:* uczciwe `delivery_days` na każdej karcie; wiarygodność > chwytliwość.
6. **Twardy wymóg Windows + Excel u klienta** (Excel COM). *Adres:* jawny kwalifikator na stronie i w rozmowach — oszczędza czas na złych leadach.
7. **Komodytyzacja przez Copilot/Power Platform.** *Adres:* pozycjonowanie "odpowiedzialność za proces" (audyt, backup, dokumentacja, utrzymanie), nie "skrypt do Excela"; retainer + panele budują relację odporną na komodytyzację.

---

## 6. Kolejne kroki po zatwierdzeniu planu

**A. Repo (wykonuję ja):** spiąć katalog projektu z repo (`git init` + remote + fetch/checkout `main`
— repo ma już `CLAUDE.md`, `README.md`, `nuconic-ui-kit/`); dodać brief; utworzyć strukturę
`docs/plan/` + `site/content/`; zapisać ten dokument jako `docs/plan/plan-strategiczny.md`;
pierwsze YAML-e modułów (M1, M2); commit + push na `main`.

**B. Biznes (founderzy, tydzień 1):** umowa/zgoda Nuconic (IP + case — **blokuje sprzedaż**);
case study PL z 3–4 liczbami; profile LinkedIn; lista 100 firm; 20 wiadomości; 2 rozmowy z biurami rachunkowymi.

**C. Otwarte decyzje founderów:** nazwa firmy/marki (blokuje rebrand ui-kit i domenę);
zgoda Nuconic imienna vs anonimowa; podział ról sprzedaż/delivery na pierwszy sprint.

**Weryfikacja:** po kroku A — `git log`/`git push` przechodzi, struktura widoczna na GitHubie,
YAML-e walidują się składniowo; merytorycznie — founderzy recenzują dokument, a przekaz testujemy
na pierwszych 20 wiadomościach outreach (wskaźnik odpowiedzi) i 1. rozmowie "najgorszy Excel".
