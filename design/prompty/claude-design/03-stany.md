# PROMPT #3: stany zasilenia (v1)

````text
Runda 3: stany zasilenia. Nie zmieniaj układu ani copy — tylko stany.
Zbierz wszystkie stany w jednej tablicy „Stany zasilenia” (mobile, skala 1:1), każdy komponent w wierszu: przygaszony | zasilony:
1. Kabel: przekrój bez prądu / z prądem; głowica w spoczynku i w „oddechu” (takt 2 s).
2. Etykieta sekcji: ○ → ● (--sygnal), dwie warstwy przełączane opacity.
3. Port przy karcie wyniku (02-wynik): zgaszony → zapalony.
4. Kontakt: wtyczka wysunięta → wpięta (translate); „POŁĄCZONO” opacity 0 → 1; poświata „Zadzwoń” 0 → 1.
5. Dolny pasek: widoczny → schowany (translateY w dół) przy #kontakt.
6. Przycisk pauzy wideo: „Zatrzymaj animację” ↔ „Wznów animację”.
Potem jedna klatka mobile 390×844 w połowie strony: linia czytania na 62%, głowica dokładnie na niej, wszystko powyżej zasilone, poniżej przygaszone.
Potem cała strona przy prefers-reduced-motion / bez JS: kabel statycznie zasilony, bez głowicy, porty zapalone, wtyczka wpięta, poster zamiast wideo.
Zasada: każdy stan różni się wyłącznie transform lub opacity i nie zmienia wysokości ani położenia treści.
Pod tablicą tabela: element | selektor stanu | właściwość | od → do | czas. Czasy: wtyczka 300 ms; „POŁĄCZONO” 300 ms; etykiety 250 ms; wejście wideo nad posterem 300 ms; głowica i diody w takcie 2 s.
````
