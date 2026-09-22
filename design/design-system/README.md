# Klarow — design system

Podstawy marki w jednym miejscu: kolory, typografia, tło, znak i ikony działów.
Stąd bierze je **Claude Design** (jako design system projektu) i stąd trafiają do kodu (`site/src/styles/tokens.css`).

## Co tu jest

| Plik | Karta w Claude Design | Co zawiera |
|---|---|---|
| `tokens.css` | — | źródło prawdy: kolory, kroje, odstępy, promienie, czasy, warstwa wygaszająca |
| `foundations/kolory.html` | Podstawy | próbki z rolami, pary kontrastu, proporcje użycia |
| `foundations/typografia.html` | Podstawy | skala, pangram „Zażółć gęślą jaźń”, zasady polskiej typografii |
| `foundations/tlo.html` | Podstawy | trzy warstwy tła, zasady przyciemnienia i wygaszania |
| `brand/znak.html` | Marka | wordmark, wersja jednobarwna, favicon |
| `komponenty/ikony-dzialow.html` | Komponenty | sześć ikon na wspólnej siatce, w trzech rozmiarach |

## Zasady, które niesie ten system
1. **Motyw wyłącznie ciemny.** Poświata i akcenty działają tylko na ciemnym tle.
2. **Bursztyn to jedyny kolor akcji.** Jeśli coś jest bursztynowe, da się w to kliknąć albo jest wynikiem.
3. **Kontrast mierzymy na grafice tła**, nie na czystym kolorze. Próg: 7:1 dla tekstu ciągłego.
4. **Strona nie animuje się sama.** Przejścia tylko na interakcję, wyłącznie `transform` i `opacity`.
5. **Jedna obudowa dla wszystkich ikon.** Symetria i jednakowa grubość linii są wymogiem.

## Jak to podłączyć do Claude Design
1. W **interaktywnej** sesji Claude Code (zwykły terminal, nie ta): `/design-login` — jednorazowa autoryzacja.
2. Potem w tej sesji mogę wysłać ten katalog jako projekt design systemu (`DesignSync`).
3. W Claude Design, przy polu promptu, zamiast **Design system: None** wybierasz **Klarow**.

Dopóki tego nie ma, brief w `design/prompty/claude-design/01-brief.md` zawiera te same tokeny w treści —
działa bez design systemu, tylko wymaga wklejania za każdym razem.

## Zasada aktualizacji
Zmiana koloru albo kroju zaczyna się **tutaj**, w `tokens.css`, a potem idzie do kodu i do Claude Design.
Nigdy odwrotnie. Inaczej po trzech rundach projektowych nikt nie wie, która wartość jest prawdziwa.
