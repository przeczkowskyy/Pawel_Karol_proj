# PROMPT #4: przygotowanie hand-offu do Claude Code

````text
Runda 4: przygotuj hand-off do Claude Code. Nie zmieniaj wyglądu — porządkuj pliki.
Struktura paczki:
  README.md   — (1) mapa: sekcja (id) → komponent → data-port → stany → animowana właściwość (od → do, czas); (2) odchylenia od briefu; (3) teksty, które się nie zmieściły; (4) wszystkie miejsca [DO POTWIERDZENIA]; (5) lista mediów: slot, plik, proporcje, ścieżka
  tokens.css  — wyłącznie tokeny z briefu + skala --odstep-*, --promien-*, --czas-*
  strona.css  — style komponentów, mobile-first, desktop przez @media (min-width: …); każdy kolor i font przez var(--…)
  index.html  — cała strona główna, semantyczna
  przyklady.html — podstrona /przyklady z sześcioma blokami i kotwicami
  stany.html  — karty stanów i ikon z rundy 3, na tych samych tokens.css i strona.css
  ikony/      — SVG: znak, favicon, 6 ikon działów, strzałka linku
  media/      — tylko grafika tła z załączników, referowana ścieżką względną
Zasady:
- Bez JavaScriptu, bez stylów inline (style="…"), bez mediów w base64, bez @import, bez CDN poza jedną linią Google Fonts z komentarzem <!-- TYLKO PODGLĄD -->.
- HTML poprawny i domknięty (każdy niezamknięty tag przerwie build).
- Sekcje z id: start, co-robimy, oszczednosci, jak-pracujemy, kim-jestesmy, kontakt. Podstrona /przyklady z kotwicami: magazyn, ksiegowosc, integracje, czat-ai, generatory, raporty.
- Tło = <img> z data-slot="TLO-M" (i TLO-D w <picture>), aria-hidden, w warstwie pod treścią.
- Klasy po polsku (BEM): .naglowek, .znak, .tlo, .tlo__wygaszenie, .hero, .sekcja, .etykieta, .dzialy, .kafel, .kafel__ikona, .kalkulator, .karta-wyniku, .krok, .obawa, .osoba, .kontakt, .pasek-kontaktu, .stopka, .przyklad, .przyklad__etykieta.
- Stany wyłącznie przez :hover, :focus-visible, [open] i @media (prefers-reduced-motion: reduce). Żadnych klas stanu sterowanych skryptem.
- Kalkulator jako <form> z prawdziwymi polami (number, range, przyciski) i wynikiem wyrenderowanym dla presetu domyślnego; zero logiki.
- Linki: tel:+48786296426, mailto:kontakt@klarow.com?subject=…, /klarow.vcf, /polityka-prywatnosci, /przyklady#<slug>, #oszczednosci.
Na koniec lista kontrolna (tak/nie) w README: tylko kolory z tokens.css; brak backdrop-filter, filter, blur; brak scroll-snap i sticky; brak paralaksy i ruchu bez interakcji; animowane tylko transform/opacity; brak <script>; brak style="…"; brak base64; brak tekstu w obrazach; wszystkie media z aspect-ratio; cele dotyku ≥ 48 px; 360 px bez poziomego przewijania.
````
