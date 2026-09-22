# PROMPT #1: pierwsza wiadomość do Claude Design

Wklejasz wszystko z bloku poniżej, a w tej samej wiadomości dołączasz załączniki (lista w `00-README.md`).

**Zanim wkleisz:** podmień `[DO POTWIERDZENIA: …]` na treść, jeśli już ją znasz. Jeśli nie, zostaw ten znacznik.
Strażnik w buildzie nie wypuści go na produkcję.

````text
BRIEF: klarow.com — strona-wizytówka firmy automatyzacji. Runda 1.

0. ROLA I ZAKRES
Prowadzisz projekt wizualny jednej strony: klarow.com. Klarow to dwie osoby (Karol i Paweł), które automatyzują pracę firm. Firma jest dopiero zakładana, działa w Polsce i nie ma jeszcze realizacji do pokazania — strona pokazuje MOŻLIWOŚCI, nie portfolio.
- Rysujesz: układ, odstępy, typografię, wygląd komponentów i ich STANÓW (przygaszony / zasilony) — statycznie, obok siebie.
- Nie piszesz mechaniki: ruch kabla sterowany przewijaniem, odtwarzanie wideo i obliczenia kalkulatora napisze później Claude Code na podstawie hand-offu.
- Copy poniżej jest ostateczne. Nie zmieniaj słów, nie dopisuj zdań. Jeśli coś się nie mieści, zmień układ i zapisz to w notatce końcowej.
- Jeśli czegoś brakuje albo coś jest sprzeczne — zapytaj przed rysowaniem. Nie zgaduj treści.
- Fragmenty oznaczone [DO POTWIERDZENIA: …] wstaw dosłownie, bez specjalnej stylizacji.

1. IDEA
Hero to gęsta, działająca maszynownia: kable, moduły i sieć neuronowa w zapętlonym wideo (płaska, lekko kreskówkowa ilustracja 2.5D). Z maszynowni wychodzi dolną krawędzią jeden kabel i biegnie przez całą stronę. Przewijanie przesuwa po nim impuls, który kolejno „zasila” sekcje (zapala ich porty) i kończy we wtyczce przy przycisku „Zadzwoń”.
Przekaz: to, co skomplikowane, bierzemy na siebie, a Wam zostaje prosty przepływ danych.
Jedna metafora wszędzie: moduł = usługa, przewód = integracja, impuls = Wasze dane, dioda = proces działa, gniazdo = kontakt z nami.
Zasada „lekko”: zabawa jest w ilustracjach, powaga w tekście. Ilustracja nigdy nie leży pod tekstem oferty ani pod kalkulatorem. Tekst na wideo jest tylko w hero.

2. ODBIORCA I URZĄDZENIA
- Główne wejście: kod QR z neutralnej, czarno-białej wizytówki → telefon 360–430 px, często w kolejce na targach, słaby zasięg, pełne słońce. Projektuj mobile-first na 390×844, sprawdzaj 360×640.
- Desktop 1440 jest drugi: ktoś przesłał link osobie, która decyduje.
- Test 3 sekund: odwiedzający wie, że to firma od automatyzacji, że to osoby z niedawnej rozmowy, i jak zadzwonić.
- Test 30 sekund: zna zakres usług (6 wierszy) i widzi kwotę policzoną na własnych liczbach.
- Długość: ok. 7 ekranów 390×844. Kalkulator (#oszczednosci) zaczyna się ok. 2,3 ekranu od góry.
- Zwracamy się do firmy: „Wy”, „Wasze”. Żadnych form zależnych od płci.
- Bez hamburgera, karuzel i osobnych sekcji „problem”, „przepływ” czy FAQ.

3. TOKENY — to jest tokens.css. Nie wymyślaj nowych kolorów ani fontów.
```css
:root {
  --tlo:            #0D1014; /* tło strony i grafik — krawędzie wideo znikają w tle */
  --powierzchnia:   #161B21; /* karty, dolny pasek kontaktu */
  --powierzchnia-2: #1F262E; /* pola kalkulatora, obramowania, obudowa modułu */
  --kabel:          #3A4450; /* kabel bez prądu */
  --obrys:          #05070A; /* kreskówkowy obrys */
  --papier:         #F2EDE3; /* tekst główny (ok. 16:1), panele modułów */
  --papier-2:       #A8A294; /* tekst drugorzędny (ok. 7,5:1) — nie w hero */
  --sygnal:         #FFB938; /* JEDYNY kolor akcji: impuls, CTA, diody, wynik; tekst na nim w --tlo */
  --sygnal-zar:     #FFF4D6; /* jądro głowicy impulsu */
  --dane:           #39D0C0; /* stan „działa” / „połączone” */
  --recznie:        #FF6A4D; /* TYLKO: „zamiast…” w wierszach oferty */
  --neuron:         #9B8CFF; /* TYLKO w ilustracjach — nigdy w interfejsie */
  --font-display: "Bricolage Grotesque", system-ui, sans-serif;
  --font-mono:    "JetBrains Mono", ui-monospace, monospace;
}
```
- Proporcje: ok. 80% grafit i papier, 15% bursztyn i morski, najwyżej 5% koral.
- Motyw: świadomie tylko ciemny. Nie projektuj wersji jasnej.
- Czytelność: tekst ciągły min. 17 px, grubość min. 400, kontrast min. 7:1. Wyjątek: etykiety mono 12 px w wersalikach.
- Wolno dopisać skalę odstępów, promieni i czasów (--odstep-*, --promien-*, --czas-*). Kolorów, gradientów dekoracyjnych i fontów spoza listy nie dodajesz.

4. TYPOGRAFIA
- Bricolage Grotesque (variable, osie wght i opsz): H1 mobile clamp(34px, 9.6vw, 40px), interlinia 1.02, tracking −0.02em, najwyżej 3 linie; H1 desktop 64–72 px. H2 30 px, interlinia 1.08. Tekst 17 px, interlinia 1.5. Eyebrow: 600, wersaliki. Wordmark: 800.
- JetBrains Mono 500: etykiety sekcji (12 px, wersaliki, tracking 0.08em), wszystkie cyfry kalkulatora (tabular-nums), kroki przykładu, „POŁĄCZONO”.
- Polszczyzna: próbnik „Zażółć gęślą jaźń” we wszystkich grubościach. Twarda spacja (&nbsp;) po jednoliterowych słowach (w, i, z, o, a, u). Liczby grupowane spacją także czterocyfrowe („8 300”), twarda spacja przed „zł”.
- Fonty na płótnie — wolno tylko ta jedna linia w <head>:
  <!-- TYLKO PODGLĄD: w produkcji fonty self-hosted -->
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=JetBrains+Mono:wght@500&display=swap">
  W CSS fonty wyłącznie przez var(--font-display) i var(--font-mono).

5. ZNAK
- Wordmark „klarow” małymi literami, Bricolage 800. Litera „o” to PORT: pierścień z bursztynową kropką — ten sam element co porty na kablu.
- Wersja czarno-biała: pierścień z pełną kropką (do dodruku wizytówek). Favicon: sam port.
- Znak narysuj jako proste SVG (pierścień + koło). Nagłówek z wordmarkiem nie jest przyklejony.

6. KABEL — SYSTEM
Mobile:
- Prosta pionowa szyna, oś na x = 18 px od lewej krawędzi, od łącznika pod hero do wtyczki w #kontakt.
- Treść wszystkich sekcji poniżej hero zaczyna się 40 px od lewej (pas na kabel), prawy margines 16 px.
- Przekrój kabla bez prądu: obrys 7 px (--obrys), rdzeń 4 px (--kabel), refleks 1 px --papier o kryciu 30%. Kontener kabla 24 px.
- Warstwa zasilona: rdzeń --sygnal + poświata 12 px o kryciu 25% (gradient, nie filter).
- Głowica impulsu: jądro 6 px --sygnal-zar, halo 20 px (radial-gradient). Siedzi na linii czytania: 62% wysokości okna na mobile, 50% na desktopie. W spoczynku „oddycha” co 2 s.
- Łącznik hero → szyna: krótka ścieżka w stylu planu metra (pion, odcinek 45°, pion, promień zakrętu 12 px) od punktu wyjścia kabla z wideo (ok. 20% szerokości kadru) do szyny.
- Porty: statyczne ząbki 6 px z gniazdem (pierścień jak „o” w znaku). Przygaszony: kropka --kabel. Zasilony: kropka --sygnal + płaska poświata.
Desktop:
- Ta sama prosta szyna przy lewej krawędzi kolumny treści (maks. 1120 px), grubość 10 px.
- Hero desktop: tekst po lewej, wideo w panelu 9:16 po prawej (ten sam plik co na mobile). Łącznik od wyjścia pnia (dół panelu) do szyny, w stylu metra (poziomo + 45°).
Zakazy: żadnych S-krzywych, meandrów ani rozgałęzień.

Porty (atrybut data-port, dokładnie te nazwy): 01-etykieta, 02-etykieta, 02-wynik, 03-etykieta, 04-etykieta, 05-etykieta, 05-wtyczka.
Medium w hero dostaje data-exit="0.20,1" — punkt wyjścia kabla, zmierzony później.

Trzy stany całej strony do narysowania:
- STAN A — przed impulsem: nic nie jest zasilone, głowica czeka w punkcie wyjścia z hero.
- STAN B — w trakcie: przewinięte do #oszczednosci. #co-robimy i #oszczednosci zasilone, #jak-pracujemy, #kim-jestesmy i #kontakt jeszcze nie. Głowica na linii 62%.
- STAN C — wszystko zasilone. Tak samo wygląda strona przy prefers-reduced-motion i bez JS: kabel statycznie zasilony, bez głowicy, wszystkie porty zapalone, wtyczka wpięta, poster zamiast wideo.

7. ELEMENTY STAŁE
Dolny pasek kontaktu (tylko mobile):
- 64 px + env(safe-area-inset-bottom), position: fixed, pełne tło --powierzchnia (bez przezroczystości i rozmycia).
- Trzy przyciski, każdy min. 48 px:
  „Zadzwoń” (bursztynowy, wypełniony) → tel:+48786296426
  „Napisz” → mailto:kontakt@klarow.com?subject=Rozmowa%20z%20wizyt%C3%B3wki
  „Zapisz kontakt” → /klarow.vcf
- Pasek chowa się, gdy sekcja #kontakt jest widoczna — narysuj oba stany.
Desktop (zamiast paska): numer telefonu na stałe w nagłówku po prawej, jako link „786 296 426 · Zadzwoń” → tel:+48786296426.
Etykieta sekcji z diodą: np. „01 · CO AUTOMATYZUJEMY ○”. Po zasileniu ○ zmienia się w bursztynowe ●.
Przycisk pauzy wideo w hero (WCAG 2.2.2): ikona pauza/odtwarzanie narysowana ręcznie + tekst dla czytników („Zatrzymaj animację” / „Wznów animację”), cel dotyku 44×44, nie zasłania punktu wyjścia kabla.

8. SEKCJE I COPY (w tej kolejności)

8.0 #start — HERO
- Wysokość mobile: calc(100svh − 64px − env(safe-area-inset-bottom)). Dolna krawędź wideo z punktem wyjścia kabla nigdy nie chowa się pod paskiem.
- Tło: wideo (załącznik A1m); object-fit: cover; object-position: 50% 100%; aria-hidden. Na płótnie użyj PNG z załącznika jako posteru.
- Górne 60% kadru ilustracji jest celowo przyciemnione („maszyna w cieniu”) — to strefa tekstu. Cały tekst hero (z nagłówkiem) mieści się w górnych 60% wysokości hero.
- Scrim pod tekstem (mobile): linear-gradient(to bottom, rgba(13,16,20,.92) 0%, rgba(13,16,20,.75) 40%, transparent 60%).
- Tekst w hero wyłącznie w --papier (nie --papier-2). Od góry:
  1. Nagłówek: wordmark „klarow” po lewej (na desktopie po prawej numer telefonu).
  2. Eyebrow (zawsze widoczny): AUTOMATYZACJE · INTEGRACJE · AI
  3. H1: „Automatyzujemy to, co ktoś u Was dziś przepisuje ręcznie.”
  4. Copy: „Łączymy magazyn, księgowość, Excel i dokumenty, żeby dane płynęły same. Od jednego raportu po kilka połączonych systemów.”
- CTA przy dolnej krawędzi hero, wyrównane do prawej: „Policzcie, ile kosztuje ręczna robota ↓” → #oszczednosci. Nie zasłania punktu wyjścia kabla ani halo głowicy. Na pierwszym ekranie jest też bursztynowe „Zadzwoń” w pasku — rozstrzygnij hierarchię (np. CTA jako bursztynowy obrys) i uzasadnij w notatce.
- Desktop: tekst w lewej kolumnie, wideo 9:16 w panelu po prawej; pień wychodzi dołem panelu.
- W hero NIE ma: zdjęć, zdań o zespole, hasła marki.

8.1 #co-robimy — 01 · CO AUTOMATYZUJEMY
Etykieta „01 · CO AUTOMATYZUJEMY ○”, H2: „Co automatyzujemy”
Lista 6 wierszy jako <details>/<summary> (działa bez JS). Wiersz: ikona 40×40 (narysuj proste SVG w obudowie modułu: zaokrąglona skrzynka --powierzchnia-2, panel --papier, dioda w prawym górnym rogu, port po lewej, na panelu piktogram), nazwa, pod nią „zamiast …” (--recznie) i „teraz …” (--papier). Po rozwinięciu dwa zdania.
  1 | Magazyn (piktogram: półka z trzema pudełkami)
    zamiast liczenia stanów na kartce
    teraz stany, WZ i PZ aktualizują się same, a braki wysyłają alert
    Rozwinięcie: „Przykład: po wydaniu towaru stan zmniejsza się sam, a dokument WZ powstaje bez przepisywania. Gdy czegoś zaczyna brakować, dział zakupów dostaje powiadomienie.”
  2 | Księgowość (piktogram: kartka z paskami wsuwana w szczelinę)
    zamiast ręcznego przypisywania faktur do zleceń i akceptacji mailem
    teraz faktury kosztowe same trafiają do właściwego zlecenia i czekają na akceptację
    Rozwinięcie: „Przykład: faktura kosztowa trafia do zlecenia na podstawie numeru zamówienia, a osoba odpowiedzialna akceptuje ją jednym kliknięciem. Człowiek sprawdza tylko to, co się nie zgadza.”
  3 | Integracje i API (piktogram: dwie wtyczki połączone adapterem)
    zamiast pięciu programów, które się nie znają
    teraz sklep, ERP, CRM i Excel wymieniają dane same
    Rozwinięcie: „Przykład: zamówienie ze sklepu samo pojawia się w ERP, a klient w CRM. Excel dostaje aktualne dane zamiast kopii sprzed tygodnia.”
  4 | Czat AI (piktogram: dymek z trzema kropkami)
    zamiast odpowiadania 40 razy na to samo pytanie
    teraz asystent odpowiada na podstawie Waszych dokumentów i cenników, a w razie wątpliwości przekazuje sprawę człowiekowi
    Rozwinięcie: „Przykład: ktoś z zespołu albo klient pyta o warunki dostawy, a asystent odpowiada na podstawie Waszego cennika. Pytania, na które nie ma pewnej odpowiedzi, trafiają do człowieka.”
  5 | Generatory dokumentów (piktogram: taca z kartką)
    zamiast składania oferty przez godzinę
    teraz oferta, umowa czy protokół z danych jednym kliknięciem
    Rozwinięcie: „Przykład: dane klienta i pozycje z arkusza same wypełniają szablon oferty albo umowy. Zostaje przeczytać i wysłać.”
  6 | Raporty (piktogram: trzy słupki różnej wysokości)
    zamiast sklejania raportu w piątek wieczorem
    teraz raport, który sam się odświeża w poniedziałek o 7:00
    Rozwinięcie: „Przykład: raport zbiera dane z kilku źródeł i odświeża się sam przed początkiem tygodnia. W piątek wieczorem nikt już niczego nie skleja.”
Pod listą: „Mały problem czy duży system — zaczynamy od kawałka, który boli najbardziej.”
Blok z przykładem (najwyżej 1 ekran, bez wideo):
  Tytuł: „Zamówienie materiału na budowę, zero przepisywania”
  Etykieta „PRZYKŁAD” i zdanie: „Tak może działać automat w firmie budowlanej. To ilustracja, nie wdrożenie u klienta.”
  Cztery statyczne kroki pismem mono, każdy z diodą:
    mail albo formularz z budowy → AI odczytuje pozycje i ilości
    magazyn → sprawdza stany i rezerwuje
    zamówienie do dostawcy albo WZ
    kierownictwo budowy → potwierdzenie · dział zakupów → powiadomienie
  Odgałęzienie w bok od kroku 2: „coś się nie zgadza → do decyzji człowieka, z kompletem danych”

8.2 #oszczednosci — 02 · ILE KOSZTUJE RĘCZNA ROBOTA
Etykieta „02 · ILE KOSZTUJE RĘCZNA ROBOTA ○”, H2: „Ile kosztuje Was ręczna robota? Policzcie.”
Copy: „Wybierzcie przykład albo wpiszcie swoje liczby. To Wasz rachunek, nie nasza obietnica — ile da się zautomatyzować naprawdę, sprawdzamy w pilocie.”
1. Presety — 4 chipy w siatce 2×2, podpis „przykładowe liczby — zmieńcie na swoje”. Domyślnie aktywny pierwszy.
   | Preset                              | osoby | h/tydz. | zł/h | udział | wynik                                  | zakres przy 30–70%    |
   | Raport tygodniowy w Excelu          | 3     | 3       | 70   | 60%    | ≈ 237 h · 29 dni · ≈ 16 600 zł/rok     | ≈ 8 300 – 19 400 zł   |
   | Dokumenty spoza KSeF i dekretacja   | 1     | 8       | 60   | 60%    | ≈ 211 h · 26 dni · ≈ 12 600 zł/rok     | ≈ 6 300 – 14 700 zł   |
   | Stany magazynowe, WZ/PZ             | 2     | 6       | 55   | 50%    | ≈ 264 h · 33 dni · ≈ 14 500 zł/rok     | ≈ 8 700 – 20 300 zł   |
   | Oferty i umowy                      | 2     | 5       | 80   | 60%    | ≈ 264 h · 33 dni · ≈ 21 100 zł/rok     | ≈ 10 500 – 24 600 zł  |
   Najdłuższe wartości do sprawdzenia na 360 px: „≈ 21 100 zł rocznie” i „≈ 10 500 – 24 600 zł”.
2. Cztery pola:
   „Ile osób to robi” — 1–20, krokomierz (− / +), min. 48 px
   „Godzin tygodniowo na osobę” — 1–40, suwak z polem liczbowym
   „Koszt godziny pracy” — 35–200 zł, przycisk „i”: „ok. 9 000 zł brutto + ok. 20% kosztów pracodawcy ÷ 168 h ≈ 65 zł”
   „Jaką część da się zautomatyzować” — 20–90%, podpis „Zwykle nie wszystko”
3. Karta wyniku (cyfry mono, tabularne; kabel wchodzi do karty portem 02-wynik):
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
5. Przyciski:
   „Wyślij nam ten rachunek” → mailto:kontakt@klarow.com?subject=Nasz%20rachunek%20z%20klarow.com (główny)
   „Prześlij rachunek dalej” (udostępnianie)
   „Omówmy to — zadzwoń” → tel:+48786296426

8.3 #jak-pracujemy — 03 · JAK PRACUJEMY
Etykieta „03 · JAK PRACUJEMY ○”, H2: „Od rozmowy do działającego procesu”
Stacje na kablu (oś czasu jak przystanki metra, numer stacji w kółku):
  1. „Rozmowa, 30 minut, bez zobowiązań.” — „Pokażcie proces albo swój najgorszy Excel.”
  2. „Pilot na kopii danych.” — „Na kopii albo w środowisku testowym — gdzie się da, bez dotykania produkcji.”
  3. „Wdrożenie etapami.” — „Najpierw to, co boli najbardziej. Termin każdego etapu ustalamy przed startem.”
  4. „Zostaje u Was.” — „Po odbiorze dostajecie kod, dostępy i dokumentację. Prawa do kodu przenosimy w umowie.”
Dwie karty:
  „Mały start: jeden raport, który co rano sam zbiera zamówienia do Excela.”
  „Duży system: połączenia magazyn–sprzedaż–księgowość, budowane etapami.”
Obawy — 4 × <details> (część sekcji, nie osobne FAQ):
  „Czy musimy wymieniać systemy?” — Nie. Zwykle łączymy to, czego już używacie.
  „Co z bezpieczeństwem danych?” — Zaczynamy na kopii albo w środowisku testowym. Bierzemy dostęp tylko do tego, co potrzebne.
  „Ile to kosztuje?” — Zależy od zakresu. Wycenę dostajecie po rozmowie, zanim cokolwiek zaczniemy.
  „Czy to tylko dla dużych firm?” — Nie. Możemy zacząć od jednego raportu.

8.4 #kim-jestesmy — 04 · KIM JESTEŚMY
Etykieta „04 · KIM JESTEŚMY ○”, H2: „Z kim rozmawiacie”
Copy: „Klarow to dwie osoby, które same piszą kod i same go wdrażają. Bez działu sprzedaży pomiędzy.”
Dwie karty osób obok siebie (bez zdjęć w tej wersji): imię i rola w 3–4 słowach.
  Karol — [DO POTWIERDZENIA: rola, 3–4 słowa]
  Paweł — [DO POTWIERDZENIA: rola, 3–4 słowa]
Karta wariantu (nie w widoku głównym): te same karty z kadrem zdjęcia 4:5 — pusty kadr --powierzchnia-2 z opisem mono „ZDJĘCIE 4:5”. Bez sylwetek, monogramów i twarzy z generatora.
Na końcu hasło marki: „Skomplikowane bierzemy na siebie. Wam zostaje klarownie.”

8.5 #kontakt — 05 · KONTAKT
Etykieta „05 · KONTAKT ○”, H2: „Połączmy się.” Wtyczka kabla stoi przy górze sekcji, obok H2.
Copy: „Zadzwońcie albo napiszcie. Najszybszy start: przyślijcie kopię pliku, który Was męczy.”
Trzy duże przyciski jeden pod drugim (min. 48 px, pełna szerokość kolumny):
  „Zadzwoń 786 296 426” → tel:+48786296426 (główny, bursztynowy)
  „Napisz: kontakt@klarow.com” → mailto:kontakt@klarow.com
  „Zapisz w kontaktach” → /klarow.vcf
Link: „Przyślijcie nam swój najgorszy Excel” → mailto:kontakt@klarow.com?subject=Nasz%20najgorszy%20Excel
  pod nim drobny tekst: „Usuńcie nazwiska i dane osobowe — wystarczy układ kolumn i kilka zmyślonych wierszy.”
Przycisk: „Prześlij dalej”.
Koniec kabla: wtyczka i gniazdo. Przed: wtyczka wysunięta. Po: wtyczka wpięta, zapala się napis „POŁĄCZONO” (HTML, mono, bursztyn), przycisk „Zadzwoń” dostaje poświatę (osobna warstwa, zmienia się tylko opacity).
Nie podawaj czasu odpowiedzi.

8.6 STOPKA
„Klarow · [DO POTWIERDZENIA: imię i nazwisko administratora] · kontakt@klarow.com · 786 296 426 · Polityka prywatności · Ta strona nie używa ciasteczek.”
(„Polityka prywatności” → /polityka-prywatnosci)
Hasło marki: „Skomplikowane bierzemy na siebie. Wam zostaje klarownie.”
Bez NIP, bez „spółka”.

8.7 /404 (mała karta, niski priorytet)
Tylko typografia: „Ten kabel prowadzi donikąd” i link na stronę główną.

9. SLOTY MEDIÓW I ZAŁĄCZNIKI
| Slot | Załącznik | Proporcje | Miejsce |
| A1m | A1m-hero-m.png (+ A1m-hero-m.webp, jeśli jest) | 9:16 | tło hero na mobile; panel po prawej na desktopie |
| A0 | A0-karta-stylu.png (jeśli jest) | 16:9 | nigdzie — tylko referencja stylu dla portów, wtyczki, gniazda i ikon |
- Pliki WebP to placeholdery do projektu — nigdy nie trafią na produkcję. Jeśli animacja nie odtwarza się na płótnie, użyj PNG.
- Media w HTML: ścieżki względne media/<nazwa>, nigdy base64. Każde medium i każdy slot ma stałe aspect-ratio.
- Części kabla i ikony, które rysujesz (SVG/CSS): płaski kreskówkowy styl 2.5D — gruby, zaokrąglony obrys --obrys o stałej grubości, jasna linia refleksu przy górnej krawędzi, płaskie wypełnienia, przesadzone proporcje, zakręty 45° i 90°, światło tylko od impulsu i diod.

10. TWARDE ZASADY
1. Czysty, semantyczny HTML + CSS (header, main, section z id, details/summary, form, footer). Mobile-first; desktop przez @media (min-width: …).
2. Bez JavaScriptu. Stany przez klasy: .zasilona na <section>, html.js (dopiero ta klasa nadaje stany początkowe animacji — bez niej strona wygląda jak STAN C), html.kabel-pelny (cały kabel zasilony, gdy strona przewinięta do końca).
3. Animacje i przejścia wyłącznie przez transform i opacity. Poświaty = gradienty + opacity. Stan zasilony i przygaszony mają identyczny layout.
4. Bez backdrop-filter, filter, blur, animowanego box-shadow.
5. Bez bibliotek, frameworków, Tailwinda, paczek ikon; bez fontów z CDN poza jedną linią podglądu z punktu 4.
6. Bez scroll-snap, position: sticky, overflow: hidden/auto na przodkach kabla (poziomy scroll gasić przez overflow-x: clip), smooth-scroll, paralaksy. Dolny pasek to position: fixed z pełnym tłem.
7. Bez tekstu w obrazach — każdy napis (także „POŁĄCZONO”, „PRZYKŁAD”) to HTML.
8. Cele dotyku min. 48 px, przycisk pauzy 44×44. Widoczny stan focus (obrys 2 px --sygnal z odstępem).
9. Na 360 px bez poziomego przewijania.
10. Takt 2 s: diody i głowica „oddychają” co 2 s; nic nie miga częściej niż 3 razy na sekundę.

11. CZEGO NIE ROBIĆ
- Stock-ikon, emoji, piktogramów z paczek (Material, Heroicons, Font Awesome itp.).
- Neonowych gradientów, niebieskiego neonu, hologramów, glassmorphismu, estetyki „cyber”.
- Zmyślonych liczb: każda liczba pochodzi z kalkulatora albo ma etykietę „przykład”. Bez liczników wdrożeń, „oszczędziliśmy X zł”, procentów skuteczności.
- Logo klientów, opinii, gwiazdek, „zaufali nam”, zrzutów „naszego systemu”, znaczników czasu w logach, efektu maszyny do pisania.
- Zdjęć stockowych, twarzy z generatora, sylwetek, monogramów.
- Słowa „inżynier” i innych tytułów; obietnicy czasu odpowiedzi; słowa „wkrótce”; lorem ipsum; cen i widełek; NIP-u.
- Form zależnych od płci („dwaj”, „szef”, „handlowiec”).
- Hasła marki w H1. Hamburgera, karuzel, przyklejonego górnego paska, „Zadzwoń” u góry ekranu na telefonie.
- Ilustracji pod tekstem oferty i kalkulatora; S-krzywych kabla; jasnego motywu.

12. CO ODDAJESZ W TEJ RUNDZIE
Ekrany (każdy osobno):
A. Mobile 390×844, cała strona, STAN A.
B. Mobile 390×844, cała strona, STAN B — z linią czytania na 62% wysokości okna jako adnotacją na osobnej warstwie.
C. Mobile 390×844, cała strona, STAN C (z dolnym paskiem schowanym przy #kontakt).
D. Desktop 1440, cała strona, STAN A.
E. Desktop 1440, cała strona, STAN C.
Karty komponentów (stany obok siebie):
K1 Znak: wordmark, wersja czarno-biała, favicon 32 i 16 px.
K2 Typografia: próbnik „Zażółć gęślą jaźń”, skala H1/H2/tekst/etykieta/cyfry.
K3 Paleta: próbki z hex i rolą, pary kontrastu.
K4 Kabel: przekrój przygaszony i zasilony (mobile 24 px, desktop 10 px), głowica, port przygaszony/zasilony, łącznik hero → szyna (mobile i desktop).
K5 Etykieta sekcji ○ / ●.
K6 Ikony 6 usług w obudowie modułu (40 px i 80 px).
K7 Wiersz oferty: zwinięty / rozwinięty.
K8 Blok przykładu z odgałęzieniem.
K9 Kalkulator: presety (domyślny aktywny, inny aktywny), pola (krokomierz, suwak z polem, pole zł z „i”, udział z podpisem), karta wyniku.
K10 Stacje 03; karty „Mały start” i „Duży system”; obawy zwinięte / rozwinięte.
K11 Osoby 04: bez zdjęć / wariant z kadrem 4:5.
K12 Kontakt: wtyczka wysunięta / wpięta, „POŁĄCZONO”, poświata „Zadzwoń”.
K13 Dolny pasek: widoczny / schowany; nagłówek desktop z numerem telefonu.
K14 Hero na 360×640: H1 wersja główna / H1 wariant „Łączymy Wasze systemy, żeby dane płynęły same.” (do testu 3 s); wariant awaryjny z solidną tabliczką --powierzchnia pod tekstem (na wypadek oblanego testu w słońcu).
K15 Przycisk pauzy wideo: oba stany, focus.
K16 Stopka.
K17 /404 (mobile).
Notatka końcowa: odchylenia od briefu, teksty, które się nie zmieściły, rozstrzygnięcie hierarchii CTA w hero, pytania.
````
