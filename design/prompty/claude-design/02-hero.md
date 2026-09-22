# PROMPT #2: hierarchia hero na 360×640

````text
Runda 2: hero na małym telefonie. Nie zmieniaj copy ani tokenów.
Dociśnij hierarchię hero na 360×640 — to najgorszy przypadek: po odjęciu paska 64 px hero ma ok. 576 px, a object-fit: cover zabiera ok. 10% z góry kadru.
Warunki:
1. Nagłówek + eyebrow + H1 + copy mieszczą się w górnych 60% wysokości hero (ok. 345 px). H1 najwyżej 3 linie przy clamp(34px, 9.6vw, 40px) i interlinii 1.02. Jeśli H1 zajmuje 4 linie, obniż dolną granicę clamp do 32 px — nie niżej. Odbieraj miejsce z odstępów i wysokości nagłówka, nie z czytelności.
2. Kolejność czytania: H1 pierwszy, eyebrow drugi, copy trzeci. Cały tekst hero w --papier.
3. CTA „Policzcie, ile kosztuje ręczna robota ↓” przy dolnej krawędzi, po prawej; nie nachodzi na punkt wyjścia kabla (20% szerokości) ani na halo głowicy (20 px); min. 16 px od dolnego paska.
4. Dolny pasek widoczny i nie zasłania wyjścia kabla. Przycisk pauzy wideo nie koliduje z CTA ani z wyjściem kabla.
Pokaż obok siebie: (a) 360×640, (b) 360×640 z H1 w wariancie „Łączymy Wasze systemy, żeby dane płynęły same.”, (c) 390×844, (d) 430×932, (e) wariant awaryjny 360×640 z solidną tabliczką --powierzchnia pod eyebrow, H1 i copy, (f) desktop 1440 z panelem wideo 9:16 po prawej.
Na końcu wypisz dla (a)–(d): wysokość bloku tekstu w px, jego dolną krawędź jako % wysokości hero, pozycję CTA i odległość CTA od punktu wyjścia kabla.
````
