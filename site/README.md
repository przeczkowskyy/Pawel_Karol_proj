# site — klarow.com

Astro 7, statycznie. Cloudflare Pages buduje ten katalog po każdym pushu na `main`:
root `site`, komenda `npm run build`, wynik `dist`.

```bash
npm install
npm run dev                 # http://localhost:4321
npm run build               # astro build + strażnik
npm run preview -- --host   # podgląd zbudowanego dist z telefonu w tej samej sieci
npm run check               # astro check
npm test                    # cztery presety kalkulatora
```

## Strony

| Ścieżka | Plik | Uwagi |
|---|---|---|
| `/` | `src/pages/index.astro` | strona główna |
| `/przyklady` | `src/pages/przyklady.astro` | sześć obszarów, kotwice zgodne z ikonami na stronie głównej |
| `/start` | `src/pages/start.astro` | adres z kodu QR; **prawdziwa strona**, nie przekierowanie, bo Web Analytics nie zapisuje query stringów; canonical na `/` |
| `/polityka-prywatnosci` | `src/pages/polityka-prywatnosci.astro` | |
| `/404` | `src/pages/404.astro` | bez `404.html` Pages przechodzi w tryb SPA i zwraca `/` z kodem 200 |

## Zasady, które łatwo złamać

- **Canonical nigdy z `Astro.url`** — przy `build.format: 'file'` ma końcówkę `.html`. Bierzemy go z propa `sciezka`.
- **Tło**: jeden kafel (kadr + jego lustrzane odbicie) powtarzany pionowo. Pliki w `public/media/` mają wersję
  w nazwie i są cache'owane jako `immutable` — **nigdy ich nie nadpisujemy**, każda zmiana to `.v2`.
- **Kalkulator liczy w buildzie i w przeglądarce tym samym kodem** (`src/lib/kalkulator.ts`), więc wynik jest
  poprawny także bez JavaScriptu.
- **Zaokrąglamy w dół.** Test `src/lib/kalkulator.test.mjs` pilnuje czterech presetów — to te same liczby, które widzi odwiedzający.
- **Strażnik** (`scripts/straznik.mjs`) zatrzymuje build, gdy w `dist` pojawi się placeholder, forma zależna od płci,
  brak telefonu, brak `/start` z canonical albo brak przekierowania starego adresu.

## Budżety (cel, sprawdzany ręcznie)

| Zasób | Cel | Stan 23.09 |
|---|---|---|
| HTML strony głównej (gzip) | ≤ 10 KB | 6,7 KB |
| CSS (gzip) | ≤ 16 KB | 6,4 KB |
| JS (inline, gzip) | ≤ 8 KB | ~1,3 KB |
| Fonty (latin + latin-ext) | ≤ 100 KB | 87 KB |
| Tło na telefon | ≤ 180 KB | 124 KB |
| **Pierwszy render razem** | **≤ 250 KB** | **224 KB** |

Regeneracja tła: `design/prompty/higgsfield/03-pipeline-ffmpeg.md`, sekcja H. Oryginały: `_mastery/` (poza gitem).
