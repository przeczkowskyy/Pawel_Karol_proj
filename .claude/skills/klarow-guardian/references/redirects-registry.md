# Rejestr przekierowań i stałych slugów (lustro `site/public/_redirects`)

> **Po co ten plik.** `rules/seo-redirects-registry.md` (BLOCKER) wymaga, żeby każdy wiersz
> `site/public/_redirects` miał tu odpowiednik z powodem, datą i decyzją, a lista slugów była stała.
> Bez tego rejestru reguła nie ma z czym porównywać. Kolejność wierszy w `_redirects` ma znaczenie:
> konkretne aliasy PRZED fallbackiem `/*`.
>
> **Zmiana = jeden commit:** wpis tutaj + wiersz w `_redirects` + (dla sluga) `tools.ts`, `toolsSeo.ts`,
> crosslinki, canonical, sitemap (generowana) i `llms.txt` (generowany).
> Alias nie jest prerenderowany, nie trafia do sitemapy i nie linkujemy do niego ze strony — linkujemy
> zawsze do celu.

## 1. Przekierowania

| Alias | Cel | Kod | Powód | Data | Decyzja |
|---|---|---|---|---|---|
| `/polityka-prywatnosci` | `/rodo` | 301 | nazwa robocza z syntezy; kanoniczna trasa prawna to `/rodo` (art. 14 RODO + polityka w jednym dokumencie) | 2026-09-12 | rozstrzygnięcie nadrzędne (okno UI + okno c1), `decisions-log.md` §1 |
| `/realizacje` | `/narzedzia` | 301 | vanity-link używany na LinkedIn i w outboundzie | 2026-09-12 | synthesis S4 |
| `/realizacje/*` | `/narzedzia/:splat` | 301 | ten sam alias dla podstron | 2026-09-12 | synthesis S4 |
| `/start` | `/oferta?utm_source=qr` | 302 | QR na wizytówkach — cel może się zmienić, więc 302, nie 301 | 2026-09-12 | synthesis S4 |
| `/*` | `/index.html` | 200 | SPA-fallback Cloudflare Pages; ZAWSZE ostatni wiersz | 2026-07-26 | CLAUDE.md, sesja rozbicia na trasy |

Wiersz `404`: `dist/404.html` obsługuje realne 404 z `noindex` (`seo-404-noindex-real-404`); nie jest
aliasem, nie ma go w sitemapie i nie liczy się do tras indeksowanych (17 dopóki `/rodo` ma `noindex`, 18 po jego zdjęciu).

## 2. Slugi stałe (13) — zmiana wyłącznie z 301

Źródło prawdy: `site/src/data/tools.ts` (pole `slug`). Kolejność jak w pliku.

| # | Slug | Trasa |
|---|---|---|
| 1 | `raport-zarzadczy` | `/narzedzia/raport-zarzadczy` |
| 2 | `dashboard-produkcji` | `/narzedzia/dashboard-produkcji` |
| 3 | `audyt-jakosci-danych` | `/narzedzia/audyt-jakosci-danych` |
| 4 | `import-z-rekoncyliacja` | `/narzedzia/import-z-rekoncyliacja` |
| 5 | `os-czasu-zadan` | `/narzedzia/os-czasu-zadan` |
| 6 | `kalkulator-transz` | `/narzedzia/kalkulator-transz` |
| 7 | `obieg-przelewow` | `/narzedzia/obieg-przelewow` |
| 8 | `billing-us-g703` | `/narzedzia/billing-us-g703` |
| 9 | `kontroling-kosztow` | `/narzedzia/kontroling-kosztow` |
| 10 | `importy-erp` | `/narzedzia/importy-erp` |
| 11 | `protokoly-robocizny` | `/narzedzia/protokoly-robocizny` |
| 12 | `rejestr-umow` | `/narzedzia/rejestr-umow` |
| 13 | `kontroling-ksef` | `/narzedzia/kontroling-ksef` |

## 3. Trasy indeksowane (18 = 5 + 13)

`/` · `/narzedzia` · `/oferta` · `/faq` · `/rodo` + 13 podstron narzędzi. Tyle samo `<url>` ma
`sitemap.xml` i tyle sprawdza `verify-site.mjs` (liczy HTML bez `404.html`; na dysku plików jest 19).

## 4. Test (Git Bash, z korzenia repo)

```bash
grep -nE "^/polityka-prywatnosci\s+/rodo\s+301" site/public/_redirects        # 1
grep -nE "^/realizacje\s+/narzedzia\s+301" site/public/_redirects             # 1
grep -nE "^/start\s+/oferta\?utm_source=qr\s+302" site/public/_redirects      # 1
tail -1 site/public/_redirects | grep -E "^/\*"                               # fallback ostatni
grep -rn "polityka-prywatnosci" site/src site/dist | grep -v "_redirects" || echo OK   # 0 (linkujemy do /rodo)
# slugi zgodne z tabelą §2
grep -oE '^\s*slug: "[a-z0-9-]+"' site/src/data/tools.ts | sed 's/.*"\(.*\)"/\1/'
```
