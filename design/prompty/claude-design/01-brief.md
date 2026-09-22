# PROMPT #1: pierwsza wiadomość do Claude Design

> **Wersja 2 (22.09).** Kabel z impulsem przez całą stronę wypadł z projektu. Zamiast niego jest duże,
> wyciszone tło i sześć klikalnych ikon działów. Styl: poważny, zero kreskówki.

Wklejasz cały blok poniżej, a w tej samej wiadomości dołączasz załączniki (lista w `00-README.md`).
Zanim wkleisz, podmień `[DO POTWIERDZENIA: …]` tam, gdzie znasz już treść.

````text
BRIEF: klarow.com — strona-wizytówka firmy automatyzacji. Runda 1.

0. ROLA I ZAKRES
Prowadzisz projekt wizualny jednej strony (plus jednej podstrony) dla klarow.com. Klarow to jedna osoba: Karol Balucki, który projektuje, pisze i wdraża automatyzacje. Firma jest dopiero zakładana, działa w Polsce i nie ma jeszcze publicznych realizacji — strona firmowa pokazuje MOŻLIWOŚCI, a dowody (zrobione narzędzia) mają osobną podstronę /cv.
- Rysujesz: układ, odstępy, typografię, wygląd komponentów i ich stany (spoczynek, hover, focus).
- Nie piszesz mechaniki: obliczenia kalkulatora i drobne skrypty dopisze Claude Code na podstawie hand-offu.
- Copy poniżej jest ostateczne. Nie zmieniaj słów, nie dopisuj zdań. Jeśli coś się nie mieści, zmień układ i zapisz to w notatce końcowej.
- Jeśli czegoś brakuje albo coś jest sprzeczne — zapytaj przed rysowaniem. Nie zgaduj treści.

1. IDEA
Za treścią stoi jedno duże, ciemne tło: sieć kabli i połączeń neuronowych (załączona grafika), wygaszana do czerni w dół strony. Na wierzchu jest spokojny, uporządkowany tekst.
Przekaz: to, co skomplikowane, bierzemy na siebie, a Wam zostaje prosty przepływ danych.
Ton: poważny i techniczny. Zero kreskówkowości, zero zabawowych kształtów, zero „cyber” efektów. Wrażenie ma być takie jak przy dobrze zrobionym raporcie inżynierskim: cicho, precyzyjnie, drogo.

2. ODBIORCA I URZĄDZENIA
- Główne wejście: kod QR z neutralnej, czarno-białej wizytówki → telefon 360–430 px, często w kolejce na targach, słaby zasięg, pełne słońce. Projektuj mobile-first na 390×844, sprawdzaj 360×640.
- Desktop 1440 jest drugi: ktoś przesłał link osobie, która decyduje.
- Test 3 sekund: odwiedzający wie, że to firma od automatyzacji, że to osoba z niedawnej rozmowy, i jak zadzwonić.
- Test 30 sekund: zna zakres usług (6 działów) i widzi kwotę policzoną na własnych liczbach.
- Długość strony głównej: ok. 7 ekranów 390×844. Kalkulator zaczyna się ok. 2,3 ekranu od góry.
- Zwracamy się do firmy: „Wy”, „Wasze”. Żadnych form zależnych od płci.
- Bez hamburgera, karuzel i osobnych sekcji „problem” czy FAQ.

3. TOKENY — to jest tokens.css. Nie wymyślaj nowych kolorów ani fontów.
```css
:root {
  --tlo:            #0D1014; /* tło strony — to samo co tło grafiki, więc jej krawędzie znikają */
  --powierzchnia:   #161B21; /* karty, dolny pasek kontaktu */
  --powierzchnia-2: #1F262E; /* pola kalkulatora, obramowania, obudowa ikon */
  --linia:          #3A4450; /* linie, obramowania, siatka */
  --obrys:          #05070A; /* najciemniejszy kontur */
  --papier:         #F2EDE3; /* tekst główny (ok. 16:1) */
  --papier-2:       #A8A294; /* tekst drugorzędny (ok. 7,5:1) — nie na tle grafiki */
  --sygnal:         #FFB938; /* JEDYNY kolor akcji: CTA, akcenty ikon, wynik; tekst na nim w --tlo */
  --dane:           #39D0C0; /* stan „działa” */
  --recznie:        #FF6A4D; /* TYLKO: „zamiast…” w wierszach oferty */
  --neuron:         #6E63B8; /* TYLKO w grafice tła — nigdy w interfejsie */
  --font-display: "Bricolage Grotesque", system-ui, sans-serif;
  --font-mono:    "JetBrains Mono", ui-monospace, monospace;
}
```
- Proporcje: ok. 85% grafit i papier, 10% bursztyn i morski, najwyżej 5% koral.
- Motyw: świadomie tylko ciemny. Nie projektuj wersji jasnej.
- Czytelność: tekst ciągły min. 17 px, grubość min. 400, kontrast min. 7:1 MIERZONY NA TLE GRAFIKI, nie na czystym kolorze.
- Wolno dopisać skalę odstępów, promieni i czasów (--odstep-*, --promien-*, --czas-*). Kolorów, gradientów dekoracyjnych i fontów spoza listy nie dodajesz.

4. TYPOGRAFIA
- Bricolage Grotesque (variable): H1 mobile clamp(34px, 9.6vw, 40px), interlinia 1.02, tracking −0.02em, najwyżej 3 linie; H1 desktop 64–72 px. H2 30 px. Tekst 17 px, interlinia 1.5. Eyebrow: 600, wersaliki. Wordmark: 800.
- JetBrains Mono 500: etykiety sekcji (12 px, wersaliki, tracking 0.08em), wszystkie cyfry kalkulatora (tabular-nums), kroki przykładu.
- Polszczyzna: próbnik „Zażółć gęślą jaźń” we wszystkich grubościach. Twarda spacja po jednoliterowych słowach (w, i, z, o, a, u). Liczby grupowane spacją także czterocyfrowe („8 300”), twarda spacja przed „zł”.
- Fonty na płótnie — wolno tylko ta jedna linia w <head>:
  <!-- TYLKO PODGLĄD: w produkcji fonty self-hosted -->
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=JetBrains+Mono:wght@500&display=swap">

5. ZNAK
- Wordmark „klarow” małymi literami, Bricolage 800. Litera „o” to port: pierścień z bursztynową kropką.
- Wersja czarno-biała: pierścień z pełną kropką. Favicon: sam port.
- Narysuj znak jako proste SVG (pierścień + koło). Nagłówek nie jest przyklejony.

6. TŁO — NAJWAŻNIEJSZY ELEMENT WIZUALNY
- Jedna grafika (załącznik TLO-M 9:16 na mobile, TLO-D 16:9 na desktop) leży POD całą treścią: position: fixed, object-fit: cover, aria-hidden.
- Nad nią jedna warstwa wygaszająca: linear-gradient(to bottom, transparent 0%, rgba(13,16,20,.6) 35%, var(--tlo) 75%). Dół strony jest praktycznie czarny.
- Pod każdym większym blokiem tekstu dodatkowe płaskie przyciemnienie (np. karta --powierzchnia z kryciem 0.72), żeby kontrast trzymał 7:1. Sam gradient nie wystarczy.
- Sekcje nie mają własnych teł w innych kolorach. Strona ma wyglądać jak jeden ciemny obraz z tekstem na wierzchu.
- Tło jest NIERUCHOME: żadnej paralaksy, żadnego ruchu przy przewijaniu, żadnego wideo.
- Narysuj też wariant awaryjny: gdyby grafika się nie wczytała, strona ma wyglądać poprawnie na samym --tlo.

7. ELEMENTY STAŁE
Dolny pasek kontaktu (tylko mobile):
- 64 px + env(safe-area-inset-bottom), position: fixed, pełne tło --powierzchnia (bez przezroczystości i rozmycia).
- Trzy przyciski, każdy min. 48 px: „Zadzwoń” (bursztynowy, wypełniony) → tel:+48786296426; „Napisz” → mailto:kontakt@klarow.com?subject=Rozmowa%20z%20wizyt%C3%B3wki; „Zapisz kontakt” → /klarow.vcf.
- Pasek chowa się, gdy sekcja #kontakt jest widoczna — narysuj oba stany.
Desktop (zamiast paska): numer telefonu na stałe w nagłówku po prawej: „786 296 426 · Zadzwoń”.
Etykieta sekcji: „01 · CO AUTOMATYZUJEMY” (mono, wersaliki), z cienką linią --linia ciągnącą się w prawo.

8. SEKCJE I COPY (w tej kolejności)

8.0 #start — HERO
- Wysokość mobile: calc(100svh − 64px − env(safe-area-inset-bottom)).
- Tło: grafika TLO-M. Górne 55% grafiki jest celowo najciemniejsze — tam stoi tekst.
- Cały tekst hero w --papier (nie --papier-2). Od góry:
  1. Nagłówek: wordmark „klarow” po lewej (na desktopie po prawej numer telefonu).
  2. Eyebrow: AUTOMATYZACJE · INTEGRACJE · AI
  3. H1: „Automatyzujemy to, co ktoś u Was dziś przepisuje ręcznie.”
  4. Copy: „Łączymy magazyn, księgowość, Excel i dokumenty, żeby dane płynęły same. Od jednego raportu po kilka połączonych systemów.”
- CTA przy dolnej krawędzi hero: „Policzcie, ile kosztuje ręczna robota ↓” → #oszczednosci.
- Desktop: tekst w lewej kolumnie (lewe 45% kadru grafiki jest najciemniejsze), prawa strona to samo tło.
- W hero NIE ma: zdjęć, zdań o zespole, hasła marki, wideo.

8.1 #co-robimy — 01 · CO AUTOMATYZUJEMY
Etykieta „01 · CO AUTOMATYZUJEMY”, H2: „Co automatyzujemy”
To jest kluczowa sekcja nawigacyjna. Sześć działów, każdy z IKONĄ, która jest linkiem do /przyklady#<slug>.
- Ikony rysujesz Ty, jako SVG. Wszystkie w jednej wspólnej obudowie: prostokąt o zaokrąglonych rogach (--powierzchnia-2), cienki obrys --linia, jeden mały bursztynowy punkt w prawym górnym rogu, w środku prosty piktogram liniowy.
- Wszystkie sześć: ta sama siatka, ta sama grubość linii, ten sam rozmiar optyczny. Symetria jest wymogiem, nie sugestią.
- Układ: 2 kolumny × 3 rzędy na telefonie, 3 × 2 albo 6 w rzędzie na desktopie. Równe odstępy, równa wysokość kafli.
- Kafel zawiera: ikonę, nazwę działu, „zamiast …” (--recznie) i „teraz …” (--papier), oraz dyskretny znacznik, że to link (np. strzałka → w rogu).
- Stany kafla: spoczynek / hover / focus (obrys 2 px --sygnal) / odwiedzony. Hover zmienia tylko jasność obramowania i punktu — nie przesuwa treści.
  1 | Magazyn (piktogram: półka z trzema pudełkami) → /przyklady#magazyn
    zamiast liczenia stanów na kartce · teraz stany, WZ i PZ aktualizują się same, a braki wysyłają alert
  2 | Księgowość (kartka wsuwana w szczelinę) → /przyklady#ksiegowosc
    zamiast ręcznego przypisywania faktur do zleceń · teraz faktury kosztowe trafiają do właściwego zlecenia i czekają na akceptację
  3 | Integracje i API (dwa złącza połączone linią) → /przyklady#integracje
    zamiast pięciu programów, które się nie znają · teraz sklep, ERP, CRM i Excel wymieniają dane same
  4 | Czat AI (dymek z trzema kropkami) → /przyklady#ai
    zamiast odpowiadania 40 razy na to samo pytanie · teraz asystent odpowiada na podstawie Waszych dokumentów, a w razie wątpliwości przekazuje sprawę człowiekowi
  5 | Generatory dokumentów (kartka z liniami i pieczęcią) → /przyklady#dokumenty
    zamiast składania oferty przez godzinę · teraz oferta, umowa czy protokół z danych jednym kliknięciem
  6 | Raporty (trzy słupki) → /przyklady#raporty
    zamiast sklejania raportu w piątek wieczorem · teraz raport, który sam się odświeża w poniedziałek o 7:00
Pod siatką jedno zdanie: „Mały problem czy duży system — zaczynamy od kawałka, który boli najbardziej.”
Oraz link tekstowy: „Zobaczcie przykłady narzędzi →” → /przyklady

8.2 #oszczednosci — 02 · ILE KOSZTUJE RĘCZNA ROBOTA
Etykieta „02 · ILE KOSZTUJE RĘCZNA ROBOTA”, H2: „Ile kosztuje Was ręczna robota? Policzcie.”
Copy: „Wybierzcie przykład albo wpiszcie swoje liczby. To Wasz rachunek, nie nasza obietnica — ile da się zautomatyzować naprawdę, sprawdzamy w pilocie.”
1. Presety — 4 chipy w siatce 2×2, podpis „przykładowe liczby — zmieńcie na swoje”. Domyślnie aktywny pierwszy.
   | Preset | osoby | h/tydz. | zł/h | udział | wynik | zakres 30–70% |
   | Raport tygodniowy w Excelu | 3 | 3 | 70 | 60% | ≈ 237 h · 29 dni · ≈ 16 600 zł/rok | ≈ 8 300 – 19 400 zł |
   | Dokumenty spoza KSeF i dekretacja | 1 | 8 | 60 | 60% | ≈ 211 h · 26 dni · ≈ 12 600 zł/rok | ≈ 6 300 – 14 700 zł |
   | Stany magazynowe, WZ/PZ | 2 | 6 | 55 | 50% | ≈ 264 h · 33 dni · ≈ 14 500 zł/rok | ≈ 8 700 – 20 300 zł |
   | Oferty i umowy | 2 | 5 | 80 | 60% | ≈ 264 h · 33 dni · ≈ 21 100 zł/rok | ≈ 10 500 – 24 600 zł |
   Najdłuższe wartości do sprawdzenia na 360 px: „≈ 21 100 zł rocznie” i „≈ 10 500 – 24 600 zł”.
2. Cztery pola:
   „Ile osób to robi” — 1–20, krokomierz (− / +), min. 48 px
   „Godzin tygodniowo na osobę” — 1–40, suwak z polem liczbowym
   „Koszt godziny pracy” — 35–200 zł, przycisk „i”: „ok. 9 000 zł brutto + ok. 20% kosztów pracodawcy ÷ 168 h ≈ 65 zł”
   „Jaką część da się zautomatyzować” — 20–90%, podpis „Zwykle nie wszystko”
3. Karta wyniku (cyfry mono, tabularne, karta na pełnym --powierzchnia dla kontrastu):
   „≈ 16 600 zł rocznie” (duża liczba, --sygnal)
   podpis: „tyle kosztuje czas, który da się odzyskać (przed kosztem wdrożenia)”
   „≈ 237 godzin · 29 dni roboczych”
   „Przy udziale 30–70%: ≈ 8 300 – 19 400 zł”
4. Wzór (mono) i dopiski:
   „koszt ręcznej roboty do odzyskania ≈ osoby × godziny tygodniowo × 44 tygodnie × udział × koszt godziny”
   z liczbami: „3 os. × 3 h × 44 tyg. × 60% × 70 zł”
   „i” przy 44 tygodniach: „52 tygodnie minus urlop, święta i choroby.”
   „To Wasz rachunek na Waszych liczbach, nie nasz wynik. Koszt wdrożenia podajemy z góry, po rozmowie.”
   „Nic nie wysyłamy — liczy się w Waszej przeglądarce.”
   „Poza rachunkiem: mniej pomyłek i szybsza obsługa — tego nie przeliczamy na złotówki.”
5. Przyciski: „Wyślij nam ten rachunek” (główny) → mailto:kontakt@klarow.com?subject=Nasz%20rachunek%20z%20klarow.com; „Prześlij rachunek dalej”; „Omówmy to — zadzwoń” → tel:+48786296426.

8.3 #jak-pracujemy — 03 · JAK PRACUJEMY
Etykieta „03 · JAK PRACUJEMY”, H2: „Od rozmowy do działającego procesu”
Cztery kroki jako numerowana lista (numer w kółku, cienka linia łącząca je pionowo — to jedyne miejsce, gdzie linia łączy elementy):
  1. „Rozmowa, 30 minut, bez zobowiązań.” — „Pokażcie proces albo swój najgorszy Excel.”
  2. „Pilot na kopii danych.” — „Na kopii albo w środowisku testowym — gdzie się da, bez dotykania produkcji.”
  3. „Wdrożenie etapami.” — „Najpierw to, co boli najbardziej. Termin każdego etapu ustalamy przed startem.”
  4. „Zostaje u Was.” — „Po odbiorze dostajecie kod, dostępy i dokumentację. Prawa do kodu przenosimy w umowie.”
Dwie karty: „Mały start: jeden raport, który co rano sam zbiera zamówienia do Excela.” / „Duży system: połączenia magazyn–sprzedaż–księgowość, budowane etapami.”
Obawy — 4 × <details>:
  „Czy musimy wymieniać systemy?” — Nie. Zwykle łączymy to, czego już używacie.
  „Co z bezpieczeństwem danych?” — Zaczynamy na kopii albo w środowisku testowym. Bierzemy dostęp tylko do tego, co potrzebne.
  „Ile to kosztuje?” — Zależy od zakresu. Wycenę dostajecie po rozmowie, zanim cokolwiek zaczniemy.
  „Czy to tylko dla dużych firm?” — Nie. Możemy zacząć od jednego raportu.

8.4 #kim-jestesmy — 04 · KIM JESTEŚMY
Etykieta „04 · KIM JESTEŚMY”, H2: „Z kim rozmawiacie”
Copy: „Klarow to jedna osoba: Karol Balucki. Piszę kod, wdrażam go u Was i odbieram telefon. Bez działu sprzedaży pomiędzy.”
Jedna karta osoby (bez zdjęcia), wyśrodkowana na telefonie, po lewej na desktopie:
  Karol Balucki — automatyzacje, integracje, raporty
Karta wariantu (nie w widoku głównym): ta sama karta z kadrem zdjęcia 4:5 — pusty kadr --powierzchnia-2 z opisem mono „ZDJĘCIE 4:5”. Bez sylwetek, monogramów i twarzy z generatora.
Pod kartami link tekstowy: „Zobaczcie, co już powstało →” → /cv (osobna podstrona, powstanie później — w tej rundzie narysuj sam link).
Na końcu hasło marki: „Skomplikowane bierzemy na siebie. Wam zostaje klarownie.”

8.5 #kontakt — 05 · KONTAKT
Etykieta „05 · KONTAKT”, H2: „Połączmy się.”
Copy: „Zadzwońcie albo napiszcie. Najszybszy start: przyślijcie kopię pliku, który Was męczy.”
Trzy duże przyciski jeden pod drugim (min. 48 px, pełna szerokość kolumny):
  „Zadzwoń 786 296 426” → tel:+48786296426 (główny, bursztynowy)
  „Napisz: kontakt@klarow.com” → mailto:kontakt@klarow.com
  „Zapisz w kontaktach” → /klarow.vcf
Link: „Przyślijcie nam swój najgorszy Excel” → mailto:kontakt@klarow.com?subject=Nasz%20najgorszy%20Excel
  pod nim drobny tekst: „Usuńcie nazwiska i dane osobowe — wystarczy układ kolumn i kilka zmyślonych wierszy.”
Przycisk: „Prześlij dalej”.
Nie podawaj czasu odpowiedzi.

8.6 STOPKA
„Klarow · Karol Balucki · kontakt@klarow.com · 786 296 426 · Polityka prywatności · Ta strona nie używa ciasteczek.”
Hasło marki: „Skomplikowane bierzemy na siebie. Wam zostaje klarownie.”
Bez NIP, bez „spółka”.

8.7 PODSTRONA /przyklady
Ten sam nagłówek, to samo tło (mocniej wygaszone — to strona do czytania), ten sam dolny pasek. Kadr tła przesunięty (background-position), żeby nie wyglądała jak kopia strony głównej.
H1: „Przykłady tego, co budujemy”
Wstęp: „Nie mamy zamkniętej listy produktów. Poniżej przekrój sześciu obszarów, w których pracujemy najczęściej — żeby było widać skalę: od jednego arkusza, który sam się wypełnia, po połączenie kilku systemów.”
Etykieta pod wstępem (raz, mono, --papier-2, obramowanie): „Przykłady możliwości. Każde narzędzie powstaje pod konkretny proces, więc Wasze będzie wyglądać inaczej.”
Sześć grup, każda z kotwicą, ikoną tego działu (ta sama co na stronie głównej) i nagłówkiem H2. W każdej grupie trzy pozycje: pogrubiona nazwa, myślnik, jedno zdanie. Bez cen, bez dłuższych opisów, bez zrzutów ekranu.
  #raporty | Raporty i kontroling
    Raport zarządczy — jedno zestawienie składane automatycznie z kilku źródeł, gotowe na stałą godzinę.
    Kontroling kosztów projektu — koszty schodzące do poziomu zlecenia albo budowy, porównane z budżetem.
    Dashboard produkcji — bieżący obraz tego, co jest w toku, co stoi i co jest zagrożone terminem.
  #dokumenty | Dokumenty i rejestry
    Generatory dokumentów — oferta, umowa, protokół czy zlecenie transportu powstają z danych, w Waszym wzorze i z ciągłą numeracją.
    Rejestr umów — jedno miejsce z terminami, aneksami i przypomnieniami, zamiast katalogu z plikami.
    Protokoły robocizny — godziny z budowy albo z hali trafiają do rozliczenia bez przepisywania.
  #magazyn | Magazyn i produkcja
    Stany, WZ i PZ — dokumenty magazynowe powstają same, a stan aktualizuje się bez ręcznych korekt.
    Kontrola braków materiałowych — sygnał o brakującym materiale zanim praca stanie, a nie w dniu montażu.
    Oś czasu zadań — harmonogram, który przelicza się sam, gdy zmieni się termin albo zakres.
  #ksiegowosc | Księgowość i płatności
    Integracje z księgowością i płatnościami — dokumenty i transakcje (również z Revolut) trafiają tam, gdzie powinny, z automatycznie nadanym kontem księgowym i centrum kosztowym.
    Obieg akceptacji przelewów — kto zatwierdził, kiedy i na jakiej podstawie: widoczne w jednym miejscu.
    Kontroling na danych z KSeF — koszty czytane wprost z faktur, bez ręcznego zestawiania.
  #integracje | Integracje między systemami
    ERP, CRM i sklep — ten sam dokument nie jest wpisywany dwa razy, a zmiana po jednej stronie wraca na drugą.
    Importy ERP do Excela z rekoncyliacją — dane wychodzą z ERP już uzgodnione, a różnice są pokazane, nie ukryte.
    Audyt jakości danych — lista miejsc, w których dane się rozjeżdżają, zanim zbudujemy na nich cokolwiek dalej.
  #ai | AI i asystenci
    Czat po dokumentacji — odpowiada na podstawie Waszych dokumentów i pokazuje, z którego miejsca wziął odpowiedź.
    Odczyt dokumentów — dane z faktur, zamówień i zdjęć z budowy trafiają do systemu bez przepisywania.
    Wstępna klasyfikacja zgłoszeń — maile i zgłoszenia trafiają do właściwej osoby albo do właściwego zlecenia.
Na końcu strony: zdanie „To nie jest pełna lista, tylko przekrój. Jeśli proces da się opisać krok po kroku, prawie zawsze da się go zautomatyzować — opowiedzcie nam o swoim.”, dwa CTA („Opowiedzcie o swoim procesie — zadzwońcie” do tel:, „Przyślijcie plik, który Was męczy” do mailto:) oraz link „← Wróć na stronę główną”.

8.8 /404 — tylko typografia: „Ten adres prowadzi donikąd” i link na stronę główną.

9. ZAŁĄCZNIKI I MEDIA
| Slot | Załącznik | Proporcje | Miejsce |
| TLO-M | tlo-m.png | 9:16 | tło całej strony na telefonie |
| TLO-D | tlo-d.png (jeśli już jest) | 16:9 | tło na desktopie |
- Grafika NIE jest dekoracją sekcji: jest jednym tłem dla całej strony.
- Media w HTML: ścieżki względne media/<nazwa>, nigdy base64. Każde medium ma stałe aspect-ratio.
- Poza tłem nie ma żadnych zdjęć ani grafik rastrowych. Wszystko inne (znak, ikony, strzałki) rysujesz jako SVG.

10. TWARDE ZASADY
1. Czysty, semantyczny HTML + CSS (header, main, section z id, details/summary, form, footer, nav). Mobile-first; desktop przez @media (min-width: …).
2. Bez JavaScriptu.
3. Animacje i przejścia wyłącznie przez transform i opacity, i tylko na interakcję (hover, focus, rozwinięcie). Strona nie animuje się sama.
4. Bez backdrop-filter, filter, blur, animowanego box-shadow, paralaksy, scroll-snap, sticky (poza dolnym paskiem: position: fixed z pełnym tłem).
5. Bez bibliotek, frameworków, Tailwinda, paczek ikon; bez fontów z CDN poza jedną linią podglądu z punktu 4.
6. Bez tekstu w obrazach — każdy napis to HTML.
7. Cele dotyku min. 48 px. Widoczny stan focus (obrys 2 px --sygnal z odstępem) na każdym linku, kaflu i polu.
8. Na 360 px bez poziomego przewijania.
9. Kontrast sprawdzasz na tle grafiki, w najjaśniejszym możliwym miejscu.

11. CZEGO NIE ROBIĆ
- Kreskówkowości: grubych obrysów, pękatych kształtów, śrubek, opasek, „zabawkowych” złączy, emoji.
- Stock-ikon i paczek (Material, Heroicons, Font Awesome).
- Neonowych gradientów, glassmorphismu, estetyki „cyber”, świecących łun.
- Zmyślonych liczb: każda liczba pochodzi z kalkulatora albo ma etykietę „przykład”. Bez liczników wdrożeń, „oszczędziliśmy X zł”, procentów skuteczności.
- Logo klientów, opinii, gwiazdek, „zaufali nam”, zrzutów „naszego systemu”.
- Zdjęć stockowych, twarzy z generatora, sylwetek, monogramów.
- Słowa „inżynier” i innych tytułów; obietnicy czasu odpowiedzi; słowa „wkrótce”; lorem ipsum; cen; NIP-u.
- Form zależnych od płci („dwaj”, „szef”, „handlowiec”).
- Hasła marki w H1. Hamburgera, karuzel, przyklejonego górnego paska, „Zadzwoń” u góry ekranu na telefonie.
- Ruchu, który dzieje się sam: tło stoi, nic nie pulsuje, nic nie przesuwa się przy przewijaniu.

12. CO ODDAJESZ W TEJ RUNDZIE
Ekrany (każdy osobno):
A. Mobile 390×844 — cała strona główna.
B. Mobile 360×640 — sam hero i sekcja 01 (najciaśniejszy przypadek).
C. Mobile 390×844 — podstrona /przyklady.
D. Desktop 1440 — cała strona główna.
E. Desktop 1440 — podstrona /przyklady.
F. Wariant awaryjny: strona główna bez wczytanej grafiki tła (samo --tlo).
Karty komponentów (stany obok siebie):
K1 Znak: wordmark, wersja czarno-biała, favicon 32 i 16 px.
K2 Typografia: próbnik „Zażółć gęślą jaźń”, skala H1/H2/tekst/etykieta/cyfry.
K3 Paleta: próbki z hex i rolą, pary kontrastu, w tym kontrast tekstu NA GRAFICE.
K4 Warstwy tła: sama grafika → grafika z gradientem → grafika z gradientem i kartą tekstu.
K5 Sześć ikon działów: 40 px i 80 px, wszystkie obok siebie na jednej siatce (to jest karta symetrii — pokaż linie pomocnicze).
K6 Kafel działu: spoczynek / hover / focus.
K7 Etykieta sekcji.
K8 Kalkulator: presety, pola (krokomierz, suwak, pole zł z „i”, udział), karta wyniku.
K9 Kroki 03 i karty „Mały start” / „Duży system”; obawy zwinięte i rozwinięte.
K10 Osoba 04: karta bez zdjęcia / wariant z kadrem 4:5.
K11 Kontakt: trzy przyciski, stany focus.
K12 Dolny pasek: widoczny / schowany; nagłówek desktop z numerem telefonu.
K13 Grupa na /przyklady: ikona, H2 i trzy pozycje, plus etykieta „przykłady możliwości”.
K14 Stopka.
Notatka końcowa: odchylenia od briefu, teksty, które się nie zmieściły, wyniki pomiaru kontrastu na tle, pytania.
````
