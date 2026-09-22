# PROMPT #4: przygotowanie hand-offu do Claude Code

````text
Runda 4: przygotuj hand-off do Claude Code. Nie zmieniaj wyglądu — porządkuj pliki.
Struktura paczki:
  README.md   — (1) mapa: sekcja (id) → komponent → data-port → stany → animowana właściwość (od → do, czas); (2) odchylenia od briefu; (3) teksty, które się nie zmieściły; (4) wszystkie miejsca [DO POTWIERDZENIA]; (5) lista mediów: slot, plik, proporcje, ścieżka
  tokens.css  — wyłącznie tokeny z briefu + skala --odstep-*, --promien-*, --czas-*
  strona.css  — style komponentów, mobile-first, desktop przez @media (min-width: …); każdy kolor i font przez var(--…)
  index.html  — cała strona w stanie „bez JS” (STAN C); semantyczna
  stany.html  — wszystkie karty stanów z rundy 3, na tych samych tokens.css i strona.css
  ikony/      — SVG: znak, favicon, port, wtyczka, gniazdo, 6 ikon usług, pauza/odtwarzanie
  media/      — tylko placeholdery z załączników (PNG/WebP), referowane ścieżką względną
Zasady:
- Bez JavaScriptu, bez stylów inline (style="…"), bez mediów w base64, bez @import, bez CDN poza jedną linią Google Fonts z komentarzem <!-- TYLKO PODGLĄD -->.
- HTML poprawny i domknięty (każdy niezamknięty tag przerwie build).
- Sekcje z id: start, co-robimy, oszczednosci, jak-pracujemy, kim-jestesmy, kontakt. Porty z data-port wg listy z briefu. Slot wideo = <img> z posterem + data-slot="A1m" i data-exit.
- Klasy po polsku (BEM): .naglowek, .znak, .hero, .hero__pauza, .sekcja, .etykieta, .kabel, .kabel__zasilony, .lacznik, .port, .oferta, .wiersz, .przyklad, .kalkulator, .karta-wyniku, .stacja, .obawa, .osoba, .kontakt, .wtyczka, .pasek-kontaktu, .stopka.
- Stany wyłącznie: .zasilona na <section>, html.js, html.kabel-pelny, @media (prefers-reduced-motion: reduce). Efekty portów tylko jako reguły CSS pod .zasilona.
- Kalkulator jako <form> z prawdziwymi polami (number, range, przyciski) i wynikiem wyrenderowanym dla presetu domyślnego; zero logiki.
- Linki: tel:+48786296426, mailto:kontakt@klarow.com?subject=…, /klarow.vcf, /polityka-prywatnosci, #oszczednosci.
Na koniec lista kontrolna (tak/nie) w README: tylko kolory z tokens.css; brak backdrop-filter, filter, blur; brak scroll-snap i sticky; animowane tylko transform/opacity; brak <script>; brak style="…"; brak base64; brak tekstu w obrazach; wszystkie media z aspect-ratio; cele dotyku ≥ 48 px; 360 px bez poziomego przewijania.
````
