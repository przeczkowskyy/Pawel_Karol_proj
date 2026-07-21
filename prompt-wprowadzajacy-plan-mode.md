# Prompt wprowadzający — nowa firma automatyzacji danych (sesja planistyczna / Plan Mode)

> **Jak używać tego pliku.** Wklej całość poniżej do Claude Code uruchomionego w **Plan Mode**.
> Dokument jest napisany jako *brief dla współzałożyciela* — zawiera nie tylko instrukcje, ale też
> **moje wstępne hipotezy** (sekcja 4), które Claude Code ma **zakwestionować i rozbudować**, a nie
> tylko przyklepać. Dzięki temu sesja startuje z konkretnej bazy, a nie z pustej kartki.
>
> Wszystko poniżej linii `— — —` to treść dla Claude Code.

— — —

# 1. Kontekst i Twoja rola

Zakładamy nową firmę. Model: **usługi automatyzacji, upraszczania i czyszczenia danych dla innych firm** (przede wszystkim MŚP). Zamieniamy ręczną pracę w Excelu, makra VBA i obieg dokumentów w mailu na **powtarzalne, kontrolowane, audytowalne narzędzia**.

W repozytorium jest plik `CLAUDE.md`. **To jest opis HISTORYCZNY** ekosystemu narzędzi, które zbudowałem wcześniej dla firmy Nuconic (wewnętrzny kontroling). Traktuj go jako:

- **dowód kompetencji / portfolio** — pokazuje, że te procesy są już rozwiązane w praktyce,
- **bibliotekę sprawdzonych wzorców** — łańcuchy danych, konwencje, model bezpieczeństwa pracy na plikach.

**Czym `CLAUDE.md` NIE jest:**
- to **nie jest produkt**, który sprzedajemy,
- to **nie jest kod „copy-paste"** — to opis, nie repozytorium do skopiowania,
- opisuje wdrożenie *wewnętrzne* dla jednej firmy; nowa firma ma tę kompetencję **sproduktyzować** dla klientów zewnętrznych.

**Twoja rola:** zachowuj się jak **współzałożyciel + doradca strategiczno-techniczny**. Kwestionuj moje założenia, wskazuj ryzyka, proponuj warianty z kompromisami (trade-offami). **Nie przytakuj mi** — jeśli coś jest słabym pomysłem, powiedz to wprost i uzasadnij.

---

# 2. Zasada pracy w TEJ sesji (ważne)

- **Nie budujemy jeszcze strony ani żadnego kodu.** Jesteśmy w Plan Mode.
- Zaczynamy od **dyskusji i uporządkowania planu**. Twój rezultat = dokument planistyczny, na który będę reagował.
- **Najpierw zadaj mi pytania doprecyzowujące** (sekcja 5), a dopiero po moich odpowiedziach rozpisuj pełny plan.
- Przy każdej istotnej decyzji podaj **2–3 opcje** z jasnymi plusami/minusami i **swoją rekomendacją**.
- Świadomie **odkładamy na później: warstwę wizualną / UI oraz postawienie serwera**. W tej sesji projektujemy strukturę, logikę i strategię — nie wygląd i nie infrastrukturę serwerową.
- Nie zaczynaj implementacji, dopóki wyraźnie nie zatwierdzę planu.

---

# 3. Cel biznesowy i nasz „hook"

**Główny hook / obietnica:** *wdrożenie w DNI, nie w miesiące.*

To nie jest slogan — to ma wynikać z realnych przewag:
- gotowa **biblioteka wzorców** (te procesy są już rozwiązane w Nuconic),
- **lekki stack** — lokalne narzędzia uruchamiane dwuklikiem, minimum infrastruktury serwerowej,
- **Excel jako warstwa danych** — klient nie musi migrować danych ani zmieniać sposobu pracy; wchodzimy „obok" jego plików,
- **Claude Code jako silnik budowy** — realny mnożnik tempa.

**Zasada nadrzędna dla całego planu:** każda decyzja (model biznesowy, dobór modułów, architektura strony, dobór technologii) ma **wspierać ten hook**. Narzędzia mają być **proste we wdrożeniu i powtarzalne u kolejnego klienta**, bez ciężkiej budowy serwera.

---

# 4. Materiał zalążkowy — moje hipotezy do zakwestionowania i rozbudowania

Poniżej moje wstępne przemyślenia. **Potraktuj je jako punkt wyjścia, nie jako prawdę.** Twoim zadaniem jest je zweryfikować, podważyć słabe miejsca, uzupełnić luki i rozbudować w pełny plan.

## 4.1. Model biznesowy

**Hipoteza:** model hybrydowy — usługa wdrożeniowa (custom build w dni) + opcjonalny abonament utrzymaniowy.

Rozpracuj z tego pełny model. Chcę odpowiedzi m.in. na:
- **Co dokładnie sprzedajemy** — gdzie kończy się usługa, a zaczyna powtarzalny produkt/moduł. (Custom „szyte" wdrożenia vs. konfigurowalny produkt — rekomendacja z uzasadnieniem.)
- **Modele przychodowe** — porównaj i zarekomenduj miks:
  - projekt jednorazowy (fixed-price per narzędzie/moduł),
  - płatny **discovery / audyt automatyzacji** (diagnoza → mapa procesów → wycena),
  - **retainer / utrzymanie** (miesięczny),
  - **hosting / subskrypcja** paneli i dashboardów,
  - model oparty na wartości (% oszczędności) — czy realny na start?
- **Oferta wejściowa (wedge)** — najtańszy, najszybszy sposób, żeby klient nam zaufał i „wszedł". Moja hipoteza: **„Sprint automatyzacji / czyszczenia — 1 proces, stała cena, ~5 dni roboczych"** albo płatna diagnoza. Zaproponuj lepsze warianty, jeśli je widzisz.
- **Ścieżka rozwoju konta** — od pierwszego małego wdrożenia (wedge) do stałej współpracy / retainera. Jak wygląda „drabinka" up-sellu.
- **Cennik na start** — widełki i logika (za co klient płaci, jak uzasadniamy „dni, nie miesiące" ceną).
- **Ryzyka modelu** — uzależnienie od jednej osoby (mnie), skalowalność usługi, ryzyko „projektów bez końca".

## 4.2. Profil idealnego klienta (ICP) — z perspektywy KLIENTA

To dla mnie **kluczowa** część. Chcę zrozumieć **drugą perspektywę — klienta** — a nie tylko opis demograficzny.

**Draft persony (do weryfikacji i rozbudowy):**
- **Firma:** MŚP ~20–250 osób, „wyrosła na Excelu"; branże: produkcja, budownictwo/moduły, dystrybucja, handel, logistyka — firmy z dużą ilością powtarzalnych danych operacyjnych i finansowych.
- **Decydent (kto kupuje):** właściciel / dyrektor finansowy / kierownik kontrolingu / dyrektor operacyjny.
- **Użytkownik (kto cierpi):** przeciążony kontroler/analityk — **wąskie gardło** firmy; osoba, która „trzyma" Excele i makra.
- **Bóle:** makra napisane przez kogoś, kto już odszedł; ręczne przeklejanie między arkuszami; brak audytu i wersjonowania; ciche pomyłki (zły wiersz/kolumna); tygodnie na złożenie raportu; dane rozproszone po plikach, brak „źródła prawdy".

**Rozbuduj to o pełną perspektywę klienta** — chcę, żebyś to napisał **jego oczami**:
- Co **czuje** (np. „tonę w Excelu, ale to działa, więc boję się cokolwiek ruszać").
- Czego się **boi** (utrata danych, zepsucie działającego makra, uzależnienie od dostawcy, koszt, długi wdrożeniowy chaos).
- Czego **chce** (przestać robić to ręcznie, ufać liczbom, przestać zależeć od jednej osoby).
- Jak **mierzy sukces** (zaoszczędzone godziny, wyeliminowane błędy, szybsze zamknięcia miesiąca, spokój).
- **Dlaczego mógłby nam NIE zaufać** — i jak to rozbrajamy.

**Dodatkowo:**
- **Wyzwalacze zakupu (kupują TERAZ):** odejście „excelowego guru", audyt/kontrola, skok skali, kosztowny błąd, nowy CFO, nowy klient wymuszający raportowanie.
- **Kanały dotarcia** — oceń, które są najtańsze i najszybsze na start:
  - ciepła sieć (referrals z otoczenia Nuconic),
  - **LinkedIn outreach** do kontrolerów/CFO/dyrektorów operacyjnych w branżach docelowych,
  - **case study z Nuconic** (zanonimizowane) jako dowód,
  - **partnerstwa**: biura rachunkowe, integratorzy/wdrożeniowcy ERP, doradcy — oni widzą ten ból u swoich klientów i mogą polecać,
  - społeczności/grupy branżowe.
- **Obiekcje i kontry** — dla każdej typowej obiekcji („za drogo", „nasze dane są wrażliwe", „custom = wolno i drogo", „boję się, że zepsujecie działające makro", „już mamy ERP") daj konkretną odpowiedź, którą można wykorzystać w rozmowie i na stronie.
- Jeśli sensowne — zaproponuj **2–3 warianty ICP** (np. „produkcja", „budownictwo/USA", „biura rachunkowe jako partner-kanał") i wskaż, na którym zacząć.

## 4.3. Katalog modułów / oferta

Strona (landing) ma być zbudowana z **modułów per dział firmy**: **finanse, administracja, produkcja, księgowość** oraz **panele analityczne KPI**.

**Zmapuj sprawdzone łańcuchy z `CLAUDE.md` na sproduktyzowane moduły dla klientów zewnętrznych.** Moja wstępna mapa (zweryfikuj, popraw, uzupełnij):

| Źródło w Nuconic (`CLAUDE.md`) | Sproduktyzowany moduł | Dział na stronie |
|---|---|---|
| Łańcuch Budget Tracking (B) | Kontroling kosztów projektów — budżet vs wykonanie, per-etap, tydzień-do-tygodnia, prognoza marży | Finanse / KPI |
| Protocol Manager (A1) | Obieg dokumentów i podwykonawców — kreator dokumentów, akceptacje wielostopniowe, auto-lookup kontrahenta (GUS/KRS), DOCX→PDF, e-podpisy | Administracja |
| Importy: RBH / LOMAG / Other Cost / Przerób (B3–B6) | Automatyzacja importów i księgowości — import z ERP/magazynu/rejestrów do Excela, klasyfikacja przez słownik, dedup, backup, log | Księgowość |
| CVS generator + Weekly Raport (B2, B10) | Automatyczne raportowanie — kanoniczne dane + gotowe raporty HTML/XLSX | KPI / Zarząd |
| Plan Płatności (A3) | Obieg płatności i cash-flow — wnioski o wydatek, plan, akceptacje „na cztery oczy", tracking, harmonogram fakturowania | Finanse |
| Globalna Formuła Sprawdzająca (B7) | Kontrola jakości danych — walidacja plików, bramki jakości, macierz pewności | Przekrojowy |
| (przekrojowo) | Panele analityczne KPI — dashboardy dla zarządu | KPI |
| (nowa kategoria z nazwy firmy) | Czyszczenie / porządkowanie danych — jednorazowe sprinty na bałagan w plikach → uporządkowany, walidowany zbiór | Przekrojowy (wedge) |

**Dla każdego modułu opisz:**
- jaki **problem** rozwiązuje i **dla kogo** (który dział, która persona),
- jak wygląda **wdrożenie „w dni"** (co jest gotowym wzorcem, co trzeba dopasować u klienta),
- jaka jest **wartość dla klienta** (najlepiej mierzalna: godziny, błędy, czas zamknięcia miesiąca),
- jaki jest **poziom złożoności / ryzyka** wdrożenia.

**Priorytetyzacja — moja hipoteza:** zacząć od modułów **niskiego ryzyka i szybkiej, widocznej wartości** (np. „Czyszczenie danych" + „Panele KPI" — nie ruszają rdzenia procesów klienta), potem importy, a workflow/obieg (najbardziej złożony) na końcu. **Zweryfikuj tę kolejność** i zaproponuj, od czego realnie startujemy (MVP oferty).

## 4.4. Infrastruktura strony (wysoki poziom — bez UI i bez serwera)

**Zaprojektuj strukturę i logikę landing page'a**, świadomie pomijając wygląd i hosting.

Chcę:
- **Architekturę informacji** — jakie sekcje, w jakiej kolejności, jak prowadzą odwiedzającego od bólu do kontaktu (hero z hookiem → problem/ból lustrzany wobec ICP → moduły per dział → „jak to działa / dni nie miesiące" → dowód/case study Nuconic → zaufanie/bezpieczeństwo → CTA).
- **Modułowość** — jak technicznie i treściowo działają „moduły per dział": moja hipoteza to podejście **content-driven** (moduły opisane w danych/konfiguracji, renderowane jako karty/sekcje), żeby łatwo je **dodawać, ukrywać i przestawiać** oraz pokazywać różne zestawy różnym grupom klientów. Zweryfikuj i doprecyzuj.
- **Filozofię stacku** — spójną z hookiem: **lekko i trywialnie wdrażalnie**. Sama strona powinna być możliwie **statyczna/prosta w deployu**. Zaproponuj kierunek (np. statyczny landing vs. lekki front), **ale nie wchodź w wybór konkretnego frameworka UI ani w konfigurację serwera** — to odkładamy.
- Jasne wskazanie, **co świadomie zostaje na później**: warstwa wizualna/UI oraz postawienie serwera/hosting.

---

# 5. Pytania, które MASZ mi zadać przed rozpisaniem planu

Zanim rozpiszesz pełny plan, zapytaj mnie o rzeczy, które istotnie zmieniają kierunek. Startowy zestaw (dodaj własne, jeśli widzisz luki):

1. **Rynek docelowy:** tylko Polska, czy również USA (Nuconic już tam działa — mamy naturalny most i case study)? To zmienia język strony, ofertę i kwestie RODO/transferu danych.
2. **Czym są „moduły" na stronie:** czysto marketingowe sekcje opisujące usługi, czy **interaktywne demo / żywe panele** (zwłaszcza „panele KPI")? To istotnie wpływa na infrastrukturę.
3. **Stopień produktyzacji:** sprzedajemy głównie „szyte" wdrożenia u klienta, czy dążymy do **powtarzalnego produktu z konfiguracją**? To rdzeń modelu i wyceny.
4. **Zasoby na start:** to ja solo + Claude Code, czy jest zespół? Ile czasu tygodniowo? (Wpływa na model dostarczania i skalę oferty.)
5. **Punkt startu sprzedaży:** mamy już ciepłe leady / kontakty (otoczenie Nuconic), czy zaczynamy od zera zimnym outreachem?
6. **Wrażliwość danych klientów:** czy zakładamy pracę **on-premise / u klienta** (dane nie wychodzą z firmy), czy dopuszczamy hosting po naszej stronie? (Kluczowe dla obiekcji i architektury.)

---

# 6. Oczekiwany rezultat sesji (deliverables)

Po naszej dyskusji chcę dostać uporządkowany dokument planistyczny zawierający:

1. **Model biznesowy** — co sprzedajemy, miks przychodowy, oferta wejściowa (wedge), drabinka konta, wstępny cennik, ryzyka.
2. **ICP z perspektywy klienta** — pełna persona napisana „oczami klienta" + wyzwalacze, kanały dotarcia (z oceną priorytetu), obiekcje i kontry.
3. **Katalog modułów** — mapa Nuconic → produkt, opis każdego modułu (problem / dla kogo / wdrożenie w dni / wartość / złożoność) + **rekomendowana kolejność startu (MVP oferty)**.
4. **Infrastruktura strony (high-level)** — architektura informacji, model modułowości, filozofia lekkiego stacku, jasna lista tego, co odkładamy (UI, serwer).
5. **Kolejne kroki** — konkretna, krótka lista następnych działań po zatwierdzeniu planu.

---

# 7. Zasady i ograniczenia (trzymaj się ich)

- Narzędzia, które będziemy budować, mają być **proste we wdrożeniu**, bez zaawansowanej infrastruktury serwerowej.
- **Hook = wdrożenie w dni, nie w miesiące** — każda decyzja ma to wspierać.
- Gdzie sensowne, korzystaj ze sprawdzonych wzorców z `CLAUDE.md` (Python/Flask lokalnie, FastAPI serwerowo, **Excel jako warstwa danych**, model **TEST → PROD**, backup przed zapisem, log audytowy), ale **adaptuj je pod klienta zewnętrznego**, nie pod Nuconic.
- **Powtarzalność ponad jednorazowość** — budujemy tak, żeby dało się to odtworzyć u kolejnego klienta.
- **W tej sesji NIE projektujemy** wyglądu/UI ani infrastruktury serwerowej.
- **Nie kopiuj** treści `CLAUDE.md` jako produktu — to materiał referencyjny.

---

# 8. Format odpowiedzi

1. Najpierw **krótko potwierdź** (1–2 zdania), że rozumiesz kontekst i czym jest / nie jest `CLAUDE.md`.
2. Potem **zadaj mi pytania doprecyzowujące** z sekcji 5 (plus własne).
3. **Zatrzymaj się i poczekaj** na moje odpowiedzi.
4. Dopiero po moich odpowiedziach rozpisz **pełny plan** wg sekcji 6.
5. **Nie zaczynaj implementacji**, dopóki wyraźnie nie zatwierdzę planu.
