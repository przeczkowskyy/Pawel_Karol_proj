# PROMPT #3: tło, ikony i stany interakcji

````text
Runda 3: dociśnij dwie rzeczy, od których zależy cała strona — czytelność na tle i sześć ikon. Nie zmieniaj copy.

A. TŁO I CZYTELNOŚĆ
1. Pokaż warstwy w czterech krokach obok siebie: (a) sama grafika, (b) grafika z gradientem wygaszającym, (c) grafika z gradientem i kartą tekstu, (d) to samo bez wczytanej grafiki (samo --tlo).
2. Dla każdej sekcji strony głównej podaj ZMIERZONY kontrast tekstu wobec najjaśniejszego piksela tła pod nim: nagłówek hero, copy hero, H2, tekst ciągły, etykieta mono, tekst drugorzędny. Wymóg: min. 7:1 dla tekstu ciągłego, min. 4,5:1 dla etykiet mono.
3. Jeśli gdziekolwiek wynik jest niższy, popraw to w tej kolejności: mocniejsze przyciemnienie pod blokiem → karta --powierzchnia → dopiero na końcu zmiana koloru tekstu. Nie rozjaśniaj tekstu powyżej --papier.
4. Pokaż też najgorszy przypadek: telefon 360×640 w pełnym słońcu (zasymuluj obniżonym kontrastem ekranu).

B. SZEŚĆ IKON DZIAŁÓW
1. Narysuj je na wspólnej siatce 24×24 z liniami pomocniczymi WIDOCZNYMI na karcie: marginesy, oś symetrii, grubość linii, promień rogów.
2. Ta sama obudowa dla wszystkich, ten sam bursztynowy punkt w tym samym miejscu, ta sama grubość linii. Piktogramy: półka z trzema pudełkami; kartka wsuwana w szczelinę; dwa złącza połączone linią; dymek z trzema kropkami; kartka z liniami i pieczęcią; trzy słupki.
3. Pokaż wszystkie sześć w trzech rozmiarach: 24, 40 i 80 px. W 24 px żaden piktogram nie może się zlewać.
4. Pokaż je też w rzędzie, jeden pod drugim w skali 1:1, żeby było widać, czy mają tę samą wagę optyczną. Jeśli któryś jest cięższy, wyrównaj.

C. STANY INTERAKCJI (tylko transform i opacity)
Kafel działu: spoczynek | hover | focus (obrys 2 px --sygnal) | aktywny (wciśnięty).
Przyciski kontaktu, chipy presetów, pola kalkulatora, <details>: te same cztery stany.
Zasada: stan nie zmienia wysokości ani położenia treści. Hover zmienia tylko jasność obramowania i punktu.

Na koniec tabela: element | stan | właściwość | od → do | czas. I jedno zdanie o tym, co było najtrudniejsze do utrzymania w kontraście.
````
