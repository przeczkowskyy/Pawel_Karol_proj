---
id: media-headers-versioning
title: Pliki w public/media i public/thumbs mają wersję w nazwie i nagłówek immutable; zmiana treści = nowa wersja, nigdy nadpisanie
impact: HIGH
tags: [media, cache, cloudflare, headers, versioning]
source: CLAUDE.md 2026-07-22 (bug cache „samo tło": stary index.html + purge assetów) · site/public/_headers · higgsfield §4.4 „nazwy z wersją"/§11 · synthesis §2.2 (_headers) · seo-headers
added: 2026-09-12
---

## Zasada

Pliki w `site/public/` nie dostają hasha Vite (kopiowane 1:1 do `dist/`), więc:

1. **Nazwa z wersją**: `public/media/<name>-v<N>[.warstwa].<ext>` dla mediów i `<name>-v<N>-<szerokość>.<ext>` dla zrzutów (np. `hero-v1.webm`, `hero-v1.poster.webp`, `tools/raport-zarzadczy-v2-1280.webp`, `thumbs/raport-zarzadczy-v2-640.webp`). Jeden wzorzec obejmujący oba kształty:

   ```
   ^[a-z0-9-]+-v[0-9]+(-[0-9]{2,4})?(\.[a-z0-9]+)*\.(webm|mp4|webp|avif|png|svg)$
   ```

   Sufiks `-<szerokość>` (`-640`, `-1280`) jest OPCJONALNY i występuje tylko w zrzutach; wcześniejsza wersja wzorca (bez tej grupy) odrzucała własne przykłady z p.„Poprawnie" i wynik `toolMedia()`, czyli komplet zrzutów dem. Sprawdzenie: `hero-v1.webm` ✓, `hero-v1.poster.webp` ✓, `raport-zarzadczy-v2-1280.webp` ✓, `raport-zarzadczy-v1-640.webp` ✓, `hero.webm` ✗.
2. **Zmiana treści = nowa wersja** (`-v2`), stary plik zostaje do czasu następnego wdrożenia (linki w cache CDN); nigdy nadpisanie `-v1` innym obrazem.
3. **`public/_headers`** ma reguły:
   ```
   /media/*
     Cache-Control: public, max-age=31536000, immutable
   /thumbs/*
     Cache-Control: public, max-age=31536000, immutable
   ```
   obok istniejących `/*` `no-cache` (HTML), `/assets/*` i `/fonts/*` immutable.
4. Wszystkie odwołania w kodzie idą przez stałe w jednym module (`src/data/media.ts`: `HERO_POSTER`, `HERO_SOURCES`, `toolMedia(slug)`), nie przez literały rozsiane po komponentach; `tools.ts` `media.thumb/wide` wskazują na wersjonowane nazwy.
5. Preload postera w `index.html` i w shellach prerenderu używa tej samej stałej (skrypt `prerender.mjs` czyta ją z `data/media.ts`, nie z literału).

## Mechanizm awarii (dlaczego)

- 2026-07-22: przeglądarki telefonów trzymały stary `index.html` wołający wypurgowane assety; SPA-fallback oddawał HTML zamiast JS → „samo tło". Fix: HTML `no-cache`, assety `immutable`. Media bez hasha i bez `immutable` wracają do tego samego problemu w drugą stronę: przeglądarka trzyma stary `hero.mp4` po podmianie treści (albo pobiera 1,5 MB przy każdej wizycie, gdy nagłówek jest domyślny).
- Nadpisanie `hero-v1.webm` nową treścią przy `immutable` = użytkownicy z cache widzą starą pętlę przez rok, a poster (nowy, bo mniejszy TTL w CDN) nie pasuje do pierwszej klatki: widoczny przeskok przy crossfade.
- Literały ścieżek w 5 miejscach (komponent, shell, `index.html` preload, `og.mjs`, `tools.ts`) rozjeżdżają się przy podbiciu wersji: preload wskazuje `-v1`, komponent `-v2` = podwójne pobranie i zmarnowany preload.

## Niepoprawnie

```
public/media/hero.webm                 # bez wersji
public/media/hero-poster.webp          # bez wersji, nadpisywany przy każdej regeneracji
public/_headers                         # brak reguły /media/*
```

```tsx
<img src="/media/hero-poster.webp" />                     // literał w komponencie
<link rel="preload" as="image" href="/media/hero.webp">   // inna nazwa w index.html
```

## Poprawnie

```
public/media/hero-v1.webm
public/media/hero-v1.mp4
public/media/hero-v1.poster.webp
public/media/hero-v1.lqip.webp
public/media/tools/raport-zarzadczy-v1-1280.webp
public/thumbs/raport-zarzadczy-v1-640.webp
```

```ts
// src/data/media.ts (jedyne źródło ścieżek mediów)
export const HERO_VERSION = 1;
export const HERO_POSTER = `/media/hero-v${HERO_VERSION}.poster.webp`;
export const HERO_SOURCES = [
  { src: `/media/hero-v${HERO_VERSION}.webm`, type: 'video/webm; codecs="vp9"' },
  { src: `/media/hero-v${HERO_VERSION}.mp4`,  type: 'video/mp4; codecs="avc1.640028"' },
] as const;
export const toolMedia = (slug: string, v = 1) => ({ wide: `/media/tools/${slug}-v${v}-1280.webp`, thumb: `/thumbs/${slug}-v${v}-640.webp` });
```

```
# public/_headers (fragment)
/media/*
  Cache-Control: public, max-age=31536000, immutable
/thumbs/*
  Cache-Control: public, max-age=31536000, immutable
```

## Test

```bash
# nazwy zgodne ze wzorcem z p.1 (oczekiwane: 0 wierszy „ZŁA NAZWA")
find site/public/media site/public/thumbs -type f 2>/dev/null | while read -r f; do
  b=$(basename "$f")
  echo "$b" | grep -qE '^[a-z0-9-]+-v[0-9]+(-[0-9]{2,4})?(\.[a-z0-9]+)*\.(webm|mp4|webp|avif|png|svg)$' || echo "ZŁA NAZWA: $f"
done
# kontrola wzorca na przykładach z reguły (oczekiwane: 4× true, 1× false)
node -e 'const re=/^[a-z0-9-]+-v[0-9]+(-[0-9]{2,4})?(\.[a-z0-9]+)*\.(webm|mp4|webp|avif|png|svg)$/;
for (const n of ["hero-v1.webm","hero-v1.poster.webp","raport-zarzadczy-v2-1280.webp","raport-zarzadczy-v1-640.webp","hero.webm"]) console.log(n, re.test(n));'
# nagłówki
grep -A1 -E '^/media/\*' site/public/_headers | grep -q immutable || echo "BRAK /media/* immutable"
grep -A1 -E '^/thumbs/\*' site/public/_headers | grep -q immutable || echo "BRAK /thumbs/* immutable"
# literały ścieżek poza data/media.ts (oczekiwane: 0)
grep -rnE '"/media/|"/thumbs/|/media/hero' site/src --include=*.tsx --include=*.ts | grep -v 'data/media.ts'
grep -nE '/media/' site/index.html | grep -vE 'hero-v[0-9]+\.poster\.webp'   # preload musi wskazywać wersjonowany poster
# po deployu (curl produkcji): nagłówek immutable na /media/hero-v1.poster.webp
curl -sI https://klarow.com/media/hero-v1.poster.webp | grep -i cache-control   # public, max-age=31536000, immutable
```

Docelowo `scripts/verify-site.mjs` krok `media-headers-versioning`.

## Wyjątki

- `favicon.ico`, `apple-touch-icon.png`, `klarow-logo-512.png`, `robots.txt`, `google<token>.html` w korzeniu `public/` nie podlegają wersjonowaniu (stałe nazwy wymagane przez przeglądarki/GSC).
- `public/screens/` (istniejące zrzuty z sesji lipcowych) do migracji do `media/tools/*-v1-1280.webp` w fazie 1; do tego czasu nieużywane.
