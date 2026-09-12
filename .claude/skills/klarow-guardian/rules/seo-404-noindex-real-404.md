---
id: seo-404-noindex-real-404
title: Trasa * → NotFound z noindex, prerender dist/404.html, zero soft-404 (błędny adres nie zwraca 200 z pustą stroną)
impact: HIGH
tags: [seo, 404, noindex, cloudflare-pages, redirects]
source: site-audit.md §1.3 (brak trasy 404), §3.6 p.2 (soft-404 przez /* /index.html 200), §6 p.6 / synthesis §2.2 (404 → dist/404.html, noindex), §2.3 404 (H1 „Nie ma takiej strony."), L2 (czy Pages serwuje 404.html przy /* fallback)
added: 2026-09-12
---

## Zasada

1. Router ma trasę `<Route path="*" element={<NotFound />} />`; `ToolPage` z nieznanym slugiem renderuje ten sam `NotFound` (nie własny komunikat). `NotFound` = H1 „Nie ma takiej strony." (EN: „There is no such page."), 1 linia, linki do `/narzedzia` i `/`; `<Seo>` ustawia `<meta name="robots" content="noindex">` i title z `pagesSeo.notFound`.
2. Prerender produkuje `dist/404.html` (shell `NotFoundShell`, `noindex`, bez canonical/og, poza sitemapą).
3. Cloudflare Pages musi zwracać STATUS 404 dla nieznanych ścieżek. Weryfikacja na preview (luka L2): `curl -I https://<preview>/nie-ma-takiej` → `404`. Jeśli `/* /index.html 200` w `_redirects` uniemożliwia to, fallback zawęża się do znanych prefiksów (`/narzedzia/*`, `/oferta`, `/faq`, `/rodo`, `/`) tak, by nieznane ścieżki trafiały w `404.html` Pages.
4. Wewnętrzne linki nigdy nie prowadzą do 404 (`verify-site.mjs` sprawdza każdy `href` z `dist` względem listy tras i plików w `public/`).

## Mechanizm awarii (dlaczego)

Dziś `_redirects` ma tylko `/* /index.html 200`, a `Routes` (`App.tsx:826-840`) nie ma fallbacku: `klarow.com/cokolwiek` zwraca 200 z pustą stroną (soft-404). Google indeksuje takie adresy jako „miękkie 404", obniża ocenę jakości domeny i zużywa crawl budget na śmieci (literówki z LinkedIn, stare linki po zmianie slugów). Stan 200 na błędnym adresie uniemożliwia też Search Console raportowanie prawdziwych błędów linkowania.

## Niepoprawnie

```tsx
<Routes>
  <Route path="/" element={<HomePage />} /> … <Route path="/narzedzia/:slug" element={<ToolPage />} />
</Routes>   {/* brak path="*" */}
```
```
# public/_redirects
/* /index.html 200
```

## Poprawnie

```tsx
<Route path="*" element={<NotFound />} />
// pages/NotFound.tsx
<Seo title={pick(lang, PAGES_SEO.notFound.title)} description={pick(lang, PAGES_SEO.notFound.description)} path="/404" noindex />
<PageMain><h1>{pick(lang, NOT_FOUND.h1)}</h1><p className="t-muted">{pick(lang, NOT_FOUND.line)}</p>
  <Link className="btn btn-primary" to="/narzedzia">{pick(lang, NAV.tools)}</Link> <Link className="btn btn-ghost" to="/">{pick(lang, NAV.home)}</Link></PageMain>
```
```
# public/_redirects (po weryfikacji L2 na preview; kolejność ma znaczenie)
/polityka-prywatnosci   /rodo                     301
/realizacje             /narzedzia                301
/realizacje/*           /narzedzia/:splat         301
/start                  /oferta?utm_source=qr     302
/narzedzia/*            /index.html               200
/oferta                 /index.html               200
/faq                    /index.html               200
/rodo                   /index.html               200
```

## Test

```bash
grep -nE "path=\"\*\"" site/src/App.tsx                                   # 1
test -f site/dist/404.html && grep -c "noindex" site/dist/404.html          # 1
grep -c "klarow.com/404" site/dist/sitemap.xml                              # 0
# produkcja / preview (po deployu): status 404 dla nieznanej ścieżki, 200 dla trasy SPA
curl -s -o /dev/null -w "%{http_code}\n" https://klarow.com/nie-ma-takiej-strony   # 404
curl -s -o /dev/null -w "%{http_code}\n" https://klarow.com/narzedzia/raport-zarzadczy   # 200
node .claude/skills/klarow-guardian/scripts/verify-site.mjs                                    # m.in. brak dist/404.html i 404.html bez noindex
# PLANOWANE (F3, verify-site.mjs nie zna tego trybu): node .claude/skills/klarow-guardian/scripts/verify-site.mjs --internal-links   # 0 linków do nieistniejących tras
```

Severity: HIGH. Auto-fix dozwolony: dopisanie `noindex` do `404.html`.

## Wyjątki

Do czasu weryfikacji L2 na preview akceptujemy `/* /index.html 200` z prerenderowanym `404.html` (soft-404 dla SPA pozostaje długiem z datą w `DECISIONS.md`).
