# /przyklady — sześć przykładowych narzędzi (SZKIC DO AKCEPTACJI)

> **Status: szkic.** Powstał 2026-09-22 z trzech niezależnych wersji (konkret, zrozumiałość, sprzedaż)
> zsyntetyzowanych i przepuszczonych przez kontrolę uczciwości. **Nie publikujemy go bez akceptacji obu osób.**
> Strażnik w buildzie blokuje `[do potwierdzenia]`, ale nie sprawdzi, czy obiecujemy coś, czego nie umiemy zrobić.
>
> Przy czytaniu pytajcie o jedno: **czy to potrafimy zbudować i czy chcemy to sprzedawać.** Co nie przejdzie, wycinamy.

# Przykładowe narzędzia

Poniżej sześć przykładowych narzędzi — po jednym na każdy dział, którym się zajmujemy. Każde jest opisane tak, żeby było widać cztery rzeczy: skąd bierze dane, co robi po kolei, co zostaje na biurku i gdzie ma granicę. Wasze narzędzie będzie wyglądać inaczej, bo powstaje na Waszych danych i Waszym sposobie pracy — to punkt wyjścia do rozmowy, nie produkt z półki.

**Etykieta przy każdym narzędziu:** Przykład możliwości — opis mechanizmu, który potrafimy zbudować, a nie opis wdrożenia u klienta.

---

## Magazyn

### Kontrola braków materiałowych

**Do czego jest.** Pokazuje z wyprzedzeniem, którym zleceniom zabraknie materiału, zanim praca stanie.

**Zamiast.** Dziś stan zestawia się ręcznie z ERP i z arkusza otwartych zamówień, a brak najczęściej wychodzi dopiero przy pobraniu materiału z magazynu.

**Jak działa.**
- Zlecenia z ERP → rozbicie na pozycje z listy materiałowej i na planowaną datę pobrania.
- Stan magazynowy, rezerwacje i otwarte zamówienia → porównanie z tą datą, pozycja po pozycji.
- Pozycja bez pokrycia → trafia na listę braków z datą, kiedy zabraknie, i z numerem zlecenia, które stanie.
- Lista gotowa przed rozpoczęciem zmiany → wiadomość do działu zakupów i ten sam widok na telefonie.

**Co dostajecie.** Jedną stronę z listą zagrożonych zleceń, ułożoną według daty startu. Plik XLSX z pozycjami i ilościami, gotowy do wysłania do dostawców. Powiadomienie o stałej porze, także wtedy, gdy braków nie ma.

**Czego nie robi.** Nie składa zamówień, nie wybiera dostawcy i nie poprawia stanów — jeśli stan w ERP jest nieaktualny, narzędzie pokaże ten sam nieaktualny stan.

**Skala.** Można zacząć od jednej hali i jednej grupy materiałowej, z jednym zestawieniem dziennie.

---

## Księgowość

### Obieg dokumentów kosztowych

**Do czego jest.** Prowadzi dokument kosztowy od wpłynięcia do akceptacji i przypisania do zlecenia albo budowy.

**Zamiast.** Dziś takie dokumenty krążą w wiadomościach i na zdjęciach w telefonach, a przypisanie kosztu do konkretnej budowy odtwarza się na zamknięciu miesiąca.

**Jak działa.**
- Dokument spoza KSeF (faktura zagraniczna, rachunek, nota, umowa najmu sprzętu) na wspólną skrzynkę albo zdjęcie z budowy → odczyt kontrahenta, numeru, kwoty i daty.
- Faktury krajowe z KSeF → pobierane bezpośrednio do tego samego rejestru, bez przepisywania.
- Pozycja w rejestrze → propozycja opisu i przypisania (zlecenie, budowa, kategoria kosztu) według Waszych reguł; osoba odpowiedzialna potwierdza albo poprawia, także z telefonu.
- Dokument zaakceptowany → przekazanie do księgowości w ustalonym formacie i status widoczny dla kierownictwa budowy.

**Co dostajecie.** Rejestr z filtrem po budowie, zleceniu i statusie akceptacji. Plik importowy w formacie Waszego programu księgowego. Przypomnienie o dokumentach, które czekają na akceptację dłużej niż ustalony czas.

**Czego nie robi.** Nie prowadzi ksiąg i nie rozstrzyga kwalifikacji podatkowej — każda propozycja opisu czeka na potwierdzenie, a decyzja księgowa zostaje po stronie księgowości.

**Skala.** Można zacząć od jednej kategorii dokumentów, na przykład transportu i najmu sprzętu, na jednej budowie.

---

## Integracje i API

### Łącznik między systemami

**Do czego jest.** Przenosi dane między ERP a pozostałymi systemami, których używacie, tak aby ten sam dokument nie był wpisywany dwa razy.

**Zamiast.** Dziś zamówienie wpisuje się osobno w CRM i osobno w ERP albo przenosi przez eksport do arkusza, a pomyłka w przepisaniu wychodzi tydzień później.

**Jak działa.**
- Zamówienie zatwierdzone w CRM → przez API zakłada dokument w ERP, razem z pozycjami i terminem.
- Zmiana ilości lub terminu po stronie ERP → wraca na kartę kontrahenta w CRM, bez ręcznego przepisywania.
- Rekord, którego nie da się dopasować (brak indeksu, zablokowany kontrahent) → trafia na listę wyjątków z opisem przyczyny, zamiast wejść po cichu z błędem.
- Połączenie przerwane → powiadomienie i ponowienie, bez gubienia dokumentów.

**Co dostajecie.** Stałe połączenie pracujące w tle, bez udziału osób z biura. Ekran wyjątków z jasno opisaną przyczyną zatrzymania. Dziennik wymiany: co, kiedy i z jakim skutkiem zostało przekazane.

**Czego nie robi.** Nie zastępuje ERP ani CRM i nie poprawia danych u źródła — gdy indeksu nie ma, zgłasza to, zamiast zgadywać.

**Skala.** Można zacząć od jednego kierunku i jednego typu dokumentu, żeby zobaczyć jakość danych, zanim podłączy się resztę.

---

## Czat AI

### Czat po dokumentacji firmowej

**Do czego jest.** Odpowiada na pytania o procedury, instrukcje i zapisy umów na podstawie Waszych dokumentów, ze wskazaniem źródła.

**Zamiast.** Dziś pytanie o zapis w umowie albo o aktualną wersję instrukcji kończy się szukaniem po katalogach i telefonem do osoby, która akurat to pamięta.

**Jak działa.**
- Wskazujecie zbiory dokumentów i uprawnienia, kto co może zobaczyć → czat dostaje do nich dostęp.
- Pytanie zadane zwykłym zdaniem → odpowiedź złożona wyłącznie z tych dokumentów, z odnośnikiem do pliku i miejsca w nim.
- Brak jednoznacznej podstawy w dokumentach → czat mówi to wprost i przekazuje sprawę osobie odpowiedzialnej za ten obszar.
- Nowa wersja dokumentu → od tej chwili odpowiedzi opierają się na niej.

**Co dostajecie.** Okno czatu na telefonie, w przeglądarce lub w komunikatorze, z którego już korzystacie. Przy każdej odpowiedzi odnośnik do źródła, do sprawdzenia w jeden ruch. Listę pytań, na które dokumentacja nie odpowiada — czyli gotową listę braków w dokumentacji.

**Czego nie robi.** Nie odpowiada na pytania spoza wskazanych dokumentów, nie uzupełnia tego, o czym dokument milczy, i nie podejmuje decyzji za zespół.

**Skala.** Można zacząć od jednego zbioru, na przykład instrukcji stanowiskowych jednej hali, i jednego zespołu.

---

## Generatory dokumentów

### Generator dokumentów powtarzalnych

**Do czego jest.** Wypełnia dokumenty, które za każdym razem wyglądają tak samo i różnią się tylko danymi: protokoły odbioru, zlecenia transportu, karty przekazania, oferty.

**Zamiast.** Dziś nowy dokument powstaje z kopii poprzedniego, więc zdarza się, że zostaje w nim stara cena, cudza nazwa albo nieaktualny warunek.

**Jak działa.**
- Krótki formularz na telefonie albo dane ze zlecenia w ERP → uzupełnienie Waszego zatwierdzonego wzoru.
- Komplet danych → PDF z Waszą stopką, kolejnym numerem i datą, bez ręcznej numeracji.
- Puste pole obowiązkowe → formularz nie pozwala zakończyć, dopóki nie zostanie uzupełnione.
- Dokument gotowy → zapis we wspólnym katalogu, przy właściwym zleceniu, i przekazanie do podpisu albo wysyłki.

**Co dostajecie.** Plik PDF w Waszym wzorze, gotowy do podpisu albo wysłania. Jedno miejsce z wystawionymi dokumentami i ciągłą numeracją. Formularz na telefonie, żeby wypełnić dokument na miejscu, a nie po powrocie do biura.

**Czego nie robi.** Nie ocenia treści od strony prawnej ani handlowej — pilnuje kompletności i formy, a wzór i cennik zatwierdzacie Wy.

**Skala.** Można zacząć od jednego wzoru, tego wystawianego najczęściej.

---

## Raporty

### Poranny raport kontrolingu

**Do czego jest.** Codziennie o stałej porze składa jedno zestawienie z ERP i z arkuszy, których w ERP nie ma.

**Zamiast.** Dziś zestawienie powstaje ręcznie: eksport, sklejenie arkuszy, poprawki formuł — i rozmowa o wynikach zaczyna się od sprawdzania, czy liczby się zgadzają.

**Jak działa.**
- Dane z ERP (sprzedaż, koszty, rejestr godzin, ruchy magazynowe) → pobranie w nocy, za poprzedni dzień i narastająco za miesiąc.
- Dane spoza ERP (plan, obmiary, korekty) → dołączane zawsze z tych samych, ustalonych plików.
- Złożone zestawienie → sprawdzenie kompletności; brakujące źródło jest opisane, a nie wypełnione zerem.
- O 7:00 → ten sam raport dla wszystkich: strona na telefonie i plik w skrzynce.

**Co dostajecie.** Jeden plik o stałej godzinie, w XLSX i PDF. Ekran z filtrem po zleceniu, budowie i dziale, czytelny bez powiększania. Wyraźną informację, które dane się nie wczytały — zanim ktoś zacznie na nich liczyć.

**Czego nie robi.** Nie zmienia definicji Waszych wskaźników ani nie poprawia danych w ERP — liczy według reguł, które ustalacie i które zapisujemy na piśmie.

**Skala.** Można zacząć od jednego raportu — tego, który dziś najczęściej składa się ręcznie.

---

## KONTROLA

- Wycięte „w ciągu kilku minut" (Integracje, W1) — obietnica wydajności, której dziś nie mamy jak potwierdzić.
- Wycięty próg „dłużej niż trzy dni" (Księgowość, W1) — wymyślona liczba; zastąpiona „ustalonym czasem", który klient sam definiuje.
- Wycięte „Nie zna niczego spoza wskazanych dokumentów" (W1) i „Nie zna odpowiedzi spoza Waszych dokumentów" (W3) — łamią zasadę, że czat nigdy nie „zna"; zastąpione „nie odpowiada na pytania spoza wskazanych dokumentów".
- Wycięte „z dopłatą za pilny transport" (Magazyn, W3) — sugeruje znany nam koszt u klienta.
- Wycięte „zajmuje początek tygodnia" i „trafia na biurko, gdy część liczb jest już nieaktualna" (Raporty, W2) — opis efektu w cudzej firmie, którego nie mierzyliśmy.
- Wycięte skróty RW, PZ, MPK, „limit kupiecki" (W1) — żargon działowy; zastąpiony opisem czynności.
- Wycięte „wiedza siedzi w głowach kilku osób, więc każde pytanie kończy się przerwaną pracą" (Czat, W3) — ton sprzedażowy plus dorozumiany efekt; zostawiona sama sytuacja, bez wniosku.
- Wycięta ramka „Uwaga dla osób spoza IT: API to…" (W2) — jedyny taki wtręt w sześciu opisach, psuł wspólny rytm; propozycja słowniczka przeniesiona do potwierdzenia.
- Ujednolicone nazwy: „Ostrzeganie / Zestawienie braków" → **Kontrola braków materiałowych**; „Łącznik ERP i CRM / Wymiana danych" → **Łącznik między systemami**; „Generator protokołów odbioru / ofert i protokołów" → **Generator dokumentów powtarzalnych** (nie zawęża działu do budowy).
- Wycięte „Nie odbiera robót za Was" (Generator, W1) — trafne, ale pasowało tylko do protokołu odbioru, nie do całego działu.
- Wycięte „Archiwum poprzednich wydań" i „zapis wersji raportu" (W3) — dobre, ale rozpychało jedną kartę ponad rytm pozostałych; do ewentualnego dopisania później.
- Ujednolicony rozmiar: każde narzędzie ma dokładnie 4 kroki w „Jak działa" i 3 pozycje w „Co dostajecie".
- Sprawdzone formy osobowe: w całym tekście „osoba odpowiedzialna", „dział zakupów", „kierownictwo budowy", „zespół", „księgowość" — żadnej formy zależnej od płci.
- Sprawdzone liczby: zostały wyłącznie „o 7:00", „raz dziennie", „przed rozpoczęciem zmiany" — wszystkie opisują takt mechanizmu, żadna nie opisuje efektu.

## DO POTWIERDZENIA

- Czy wszystkie sześć mechanizmów potraficie dziś dowieźć w rozsądnym terminie — zwłaszcza odczyt dokumentów kosztowych i czat po dokumentacji. Opis obiecuje działające narzędzie, nie prototyp.
- KSeF: czy pobieranie faktur krajowych bezpośrednio z KSeF jest realne na 2026 w takiej formie, jak to opisano. Jeśli nie, to zdanie musi zniknąć.
- Formaty eksportu do programów księgowych — czy wymieniamy je z nazwy (Optima, Symfonia, enova, WAPRO), czy zostajemy przy „Waszym programie księgowym".
- Lista ERP/CRM, do których macie realny dostęp przez API — czy podajemy nazwy na stronie, czy mówimy o tym dopiero w rozmowie.
- Gdzie stoją dane i dokumenty: u Was, u klienta, czy u zewnętrznego dostawcy. To pierwsze pytanie, które padnie przy czacie i przy dokumentach kosztowych — strona może potrzebować jednego zdania o tym.
- Czy „o 7:00" zostaje jako przykład, czy zmieniamy na „o ustalonej godzinie" (bezpieczniejsze, ale mniej konkretne).
- Czy dopisujemy jedno zdanie słowniczka przy słowie API, czy zakładamy, że odbiorca je zna.
- Czy nazwy narzędzi zostają rzeczowe, czy dostają nazwy własne (wtedy trzeba sprawdzić, czy nie są zajęte).
- Kotwice sekcji na podstronie (#magazyn, #ksiegowosc, #integracje, #czat-ai, #generatory, #raporty) muszą zgadzać się z odnośnikami pod ikonami na stronie głównej.
- Czy przy każdym narzędziu stoi wezwanie do kontaktu z numerem telefonu, czy jedno wspólne na dole podstrony.
- Czy etykieta „Przykład możliwości" ma być widoczna przy każdym bloku, czy raz na górze wystarczy. Rekomendacja: przy każdym, małym drukiem — to jedyne zabezpieczenie przed odczytaniem tego jako portfolio.
- Zastrzeżenie prawne: czy dopisujemy zdanie, że opisy nie stanowią oferty w rozumieniu Kodeksu cywilnego.
- Kolejność sześciu działów na stronie głównej i tutaj musi być ta sama — obecnie: Magazyn, Księgowość, Integracje i API, Czat AI, Generatory dokumentów, Raporty.