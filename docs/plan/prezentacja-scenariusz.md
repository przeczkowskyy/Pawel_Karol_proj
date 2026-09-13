# klarow.com jako prezentacja: scenariusz

> Decyzja Karola, 2026-09-13: „Chciałbym żeby to była prezentacja. Jedna wielka animacja
> wraz ze scrollowaniem, broszura. Bez zakładek, bez niczego. Tylko w miarę scrollowania
> gra się animacja motion graphic która opowiada historię co możemy zrobić, ile oszczędzamy
> czasu i pieniędzy itd." Plus: „Do tych filmów/animacji motion z smooth przejściami
> potrzebujemy Higgsfield."
>
> To jest ZERWANIE z dotychczasową architekturą, nie jej poprawka. Poprzednia strona była
> serwisem z zakładkami (`/narzedzia`, `/oferta`, `/faq` i trzynaście podstron). Nowa jest
> jednym ciągiem: użytkownik przewija i ogląda, nic nie wybiera.

## Czego ten dokument NIE zmienia

Zasady, które zostają w mocy, bo nie dotyczą formy, tylko prawdy i dostępności:
marka i zakaz nazwy poprzedniej firmy, liczby wyłącznie ze źródłem, `prefers-reduced-motion`,
determinizm dem, zero danych klientów w narzędziach generatywnych, RODO przed outboundem.

## Ile to kosztuje, zanim zaczniemy

**Umiera inwestycja SEO w podstrony.** Trzynaście adresów `/narzedzia/<slug>` ma od lipca
treść long-tail (tytuł, opis, cztery pytania i odpowiedzi w dwóch językach) i jest
zaindeksowanych. Prezentacja ich nie potrzebuje.

**Rekomendacja: nie kasować ich, tylko zdjąć z nawigacji.** Adresy żyją dalej, wpadają
do mapy strony i łapią ruch z wyszukiwarki na zapytania typu „raport zarządczy z ERP",
a prezentacja o nich nie wie. Koszt: zero. Dla odwiedzającego prezentacja jest całą stroną.
Jeśli Karol chce inaczej, to jedna linia w routerze i usunięcie katalogu.

## Kształt

Jeden ciąg pionowy. Osiem scen, każda na pełną wysokość okna. Przewijanie przesuwa
narrację; nic nie przechwytuje gestu, nie ma slajdów przełączanych klawiszem, nie ma
nawigacji poza wordmarkiem i jednym przyciskiem.

Pod każdą sceną leży materiał wideo albo animacja w kodzie. Przejście między scenami
to nie cięcie, tylko przenikanie sterowane pozycją przewijania.

## Osiem scen

| # | Beat | Co widać | Co mówi tekst | Skąd materiał |
|---|---|---|---|---|
| 1 | Hak | Powolny ruch stali; z ciemności wyłania się siatka komórek | „Twoja firma działa na plikach." | Higgsfield: pętla stalowa |
| 2 | Skala chaosu | Komórki mnożą się, rozjeżdżają, część miga na czerwono | „Osiemdziesiąt osiem procent arkuszy ma błąd w formule." | Kod: siatka deterministyczna |
| 3 | Koszt czasu | Zegar; kolumna godzin rośnie i znika w tle | „Zamknięcie miesiąca zjada tygodnie." | Kod: licznik na scrollu |
| 4 | Koszt pieniędzy | Kwota składa się z cyfr, obok rozbicie działania | „Kontroler kosztuje około 121 tysięcy rocznie. Sklejanie arkuszy to nie jest ta praca." | Kod: licznik + arytmetyka |
| 5 | Zwrot | Chaos składa się w tabelę; pierwszy pulpit wjeżdża w kadr | „Budujemy narzędzie pod Twój proces." | Higgsfield: przejście + nagranie pulpitu |
| 6 | Dowód | Ściana trzynastu ekranów przesuwa się w głąb | „Trzynaście narzędzi. Każde liczy naprawdę." | Zrzuty i nagrania Playwright |
| 7 | Efekt | Cztery zdania wchodzą pojedynczo na spokojnym tle | „Godziny wracają. Zamknięcie w dni. Błąd przed zarządem." | Kod |
| 8 | Kontakt | Kadr wygasza się do czerni, zostaje jedno zdanie i przycisk | „Pokaż nam proces, który boli." | Higgsfield: wygaszenie |

## Liczby, które wolno wypowiedzieć

Każda ma źródło i wchodzi do `references/allowed-numbers.md`. Bez źródła nie ma liczby.

| Liczba | Źródło | Scena |
|---|---|---|
| 88 % arkuszy zawiera błąd w formule | Panko, University of Hawai'i, „What We Know About Spreadsheet Errors" | 2 |
| mediana wynagrodzenia kontrolera 8 350 zł brutto miesięcznie | Ogólnopolskie Badanie Wynagrodzeń Sedlak & Sedlak 2026 | 4 |
| składki pracodawcy 20,48 % | ZUS 2026 | 4 |
| około 121 000 zł rocznie | działanie: 8 350 × 12 × 1,2048, pokazane na ekranie | 4 |
| 13 narzędzi | `tools.ts`, policzalne | 6 |

Zakazane mimo pokusy: „oszczędzamy X godzin tygodniowo" bez pomiaru u klienta, jakikolwiek
procent oszczędności, „raport Deloitte o czasie w Excelu" (liczba krąży bez źródła),
framing „zwolnisz etat" (firma, która zatrudnia kontrolera, właśnie wybrała człowieka).

## Materiał z Higgsfield

Cztery pozycje, reszta powstaje w kodzie i z nagrań Playwrighta za zero kredytów.

| id | Scena | Co to jest | Model | Kredyty |
|---|---|---|---|---|
| V1 | 1 | Pętla stalowa, powolny ruch materii, bez ludzi i tekstu | kling3_0, start = end | ~56 |
| V2 | 5 | Przejście „chaos w porządek": rozsypane elementy zbiegają się | seedance_2_5, start + end | ~90 |
| V3 | 8 | Wygaszenie do czerni ze stalowym refleksem | kling3_0 | ~40 |
| S1 | tło scen 2-4 | Statyczna faktura stali pod tekstem | nano_banana_pro | ~10 |

Razem około 200 kredytów przy selekcji, czyli mieści się w planie PLUS (1200 kredytów).
Procedura, prompty i pipeline: `.claude/skills/klarow-guardian/references/higgsfield-pipeline.md`.

**Agent nie uruchamia zakupu ani generacji.** Kupuje Karol, w przeglądarce, i dopiero wtedy
generujemy. Do tego czasu sceny 1, 5 i 8 działają na materiale zastępczym: kadr pulpitu,
animacja w kodzie i zwykłe wygaszenie.

## Techniczne rozstrzygnięcia

**Scena to sekcja o wysokości okna ze `sticky` w środku.** Użytkownik przewija normalnie,
nic nie przechwytuje gestu. Scroll-hijack pozostaje zakazany.

**Wideo sterowane przewijaniem, nie odtwarzane.** Pozycja przewijania ustawia `currentTime`,
więc ruch idzie dokładnie tak szybko, jak przewija użytkownik, i cofa się razem z nim.
Warunek: plik musi mieć gęste klatki kluczowe, inaczej przewijanie skacze.

**Telefon dostaje wersję bez wideo.** Zamiast niego kadr i te same animacje w kodzie.
Decyzja z lipca o zerowym wideo na telefonie zostaje.

**Ograniczony ruch:** każda scena pokazuje stan końcowy, statycznie, w pełnej treści.

**Nawigacja:** wordmark wracający na górę i jeden przycisk. Nic więcej.

**Prerender:** jeden plik HTML z całą treścią scen jako tekstem, żeby strona bez
JavaScriptu nadal mówiła, co firma robi. Trzynaście podstron narzędzi zostaje poza
nawigacją, o ile Karol nie zdecyduje inaczej.
