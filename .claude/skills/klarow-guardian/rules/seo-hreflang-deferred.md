---
id: seo-hreflang-deferred
title: hreflang i trasy /pl/ /en/ odroczone (decyzja Karola); nie dodawać hreflang do jednego URL; EN tylko przez przełącznik i sekcję lang="en"
impact: MEDIUM
tags: [seo, i18n, hreflang, routes, decision]
source: CLAUDE.md „2026-07-26" (trasy językowe ŚWIADOMIE ODROCZONE) + „ZNANE OGRANICZENIE" cz. 7 / strategy.md B3, D-16 / synthesis D-20, §2.8 p.6, p.10 / pagesSeo.ts:6-8
added: 2026-09-12
---

## Zasada

Do decyzji D-20 (trasy `/pl/`, `/en/` build-time, plan §4.2): (1) PL jest kanoniczne; jeden URL serwuje PL w HTML i EN po przełączniku (`localStorage["klarow-lang"]`); (2) ZAKAZ dodawania `<link rel="alternate" hreflang="en">` wskazującego ten sam URL albo URL z parametrem `?lang=en`; (3) zakaz `?lang=` w linkach i canonicalu; (4) EN dla botów bez JS istnieje przez sekcję `<section lang="en">` w każdym shellu prerendera i sekcję „English" w `llms.txt`; (5) `<html lang="pl">` w statycznym HTML, `document.documentElement.lang` zmieniany przez `LangProvider` po przełączeniu (`i18n-lang-before-paint`). Wszystkie stringi już dziś są `{ pl, en }`, więc split build-time będzie mechaniczny: wtedy dochodzą `hreflang` x-default/pl/en, osobne canonicale, `og:locale`, sitemapa z `xhtml:link`, `pagesSeo`/`toolsSeo` EN stają się widoczne dla Google. Agent nie robi tego „przy okazji" (decyzja founderów).

## Mechanizm awarii (dlaczego)

`hreflang` wskazujący ten sam adres dla dwóch języków jest błędem walidacji Google (Search Console: „brak tagów zwrotnych"/„nieprawidłowy kod języka") i może osłabić kanoniczność PL. Parametr `?lang=en` bez osobnego prerenderu produkuje duplikaty z identyczną treścią PL w HTML (crawler nie czyta `localStorage`). Przedwczesne trasy `/en/` bez 18 EN-shelli i EN-sitemapy to 18 „thin pages" naraz. Decyzja Karola z 2026-07-26 zamyka temat do osobnego kroku; próba dodania hreflang w rebuildzie mnoży zakres fazy 3 o ~2 dni bez zgody founderów.

## Niepoprawnie

```html
<link rel="alternate" hreflang="en" href="https://klarow.com/?lang=en" />
<link rel="alternate" hreflang="pl" href="https://klarow.com/" />
```
```tsx
<Link to="/oferta?lang=en">Offer</Link>
```

## Poprawnie

```tsx
// shell prerendera (entry.tsx): PL kanoniczne + sekcja EN dla botów bez JS
<main id="main" lang="pl">…</main>
<section lang="en" aria-label="English summary"><h2>{HOME.hero.h1.en}</h2><p>{HOME.hero.lead.en}</p>…</section>
```
```md
<!-- docs/DECISIONS.md D-20: trasy /pl/ /en/ + hreflang: ODROCZONE (Karol, 2026-07-26). Warunek: 19 EN-shelli, EN-sitemap, canonical per język. -->
```

## Test

```bash
grep -rnE "hreflang" site/src site/index.html site/scripts site/dist 2>/dev/null   # 0 (do D-20)
grep -rnE "\?lang=" site/src site/dist 2>/dev/null                                  # 0
for f in $(find site/dist -name "*.html" ! -name "404.html"); do grep -q 'lang="en"' "$f" || echo "FAIL brak sekcji EN: $f"; done
grep -c '<html lang="pl">' site/dist/index.html                                    # 1
```

Severity: MEDIUM (raport); `hreflang` na wspólnym URL = HIGH (aktywna szkoda SEO).

## Wyjątki

Po decyzji D-20 reguła zostaje odwrócona: `hreflang` staje się obowiązkowy dla każdej pary tras; ten plik dostaje wtedy nową wersję, a nie wyjątek.
