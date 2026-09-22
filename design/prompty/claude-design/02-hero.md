# PROMPT #2: hierarchia hero na małym telefonie

> **Wersja 2 (22.09).** Poprzednia wersja mówiła o kablu, punkcie wyjścia i przycisku pauzy wideo — tego już nie ma.

````text
Runda 2: hero na małym telefonie. Nie zmieniaj copy ani tokenów.
Dociśnij hierarchię hero na 360×640 — to najgorszy przypadek: po odjęciu dolnego paska 64 px hero ma ok. 576 px.
Warunki:
1. Nagłówek (wordmark) + eyebrow + H1 + copy mieszczą się w górnych 55% wysokości hero. To jest strefa, w której grafika tła jest najciemniejsza — poniżej zaczyna się gęstsza część rysunku.
2. H1 najwyżej 3 linie przy clamp(34px, 9.6vw, 40px) i interlinii 1.02. Jeśli wychodzą 4 linie, obniż dolną granicę clamp do 32 px — nie niżej. Miejsce odbieraj z odstępów i z wysokości nagłówka, nigdy z czytelności.
3. Kolejność czytania: H1 najmocniejszy, eyebrow drugi, copy trzeci. Cały tekst hero w --papier (nigdy --papier-2).
4. CTA „Policzcie, ile kosztuje ręczna robota ↓” przy dolnej krawędzi hero, wysokość co najmniej 48 px, co najmniej 16 px nad dolnym paskiem kontaktu.
5. Dolny pasek kontaktu widoczny, z trzema przyciskami, każdy min. 48 px.
Pokaż obok siebie: (a) 360×640, (b) 360×640 z H1 w wariancie „Łączymy Wasze systemy, żeby dane płynęły same.”, (c) 390×844, (d) 430×932, (e) desktop 1440 (tekst w lewej kolumnie, tam gdzie grafika jest najciemniejsza), (f) 360×640 bez wczytanej grafiki tła — strona ma wyglądać poprawnie na samym --tlo.
Na końcu wypisz dla (a)–(e): wysokość bloku tekstu w px, jego dolną krawędź jako % wysokości hero, oraz ZMIERZONY kontrast H1 i copy wobec najjaśniejszego piksela grafiki pod nimi. Próg: 7:1.
````
