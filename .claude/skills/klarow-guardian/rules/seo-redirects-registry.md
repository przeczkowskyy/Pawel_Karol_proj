---
id: seo-redirects-registry
title: Rejestr przekierowań: każdy alias 301/302 spisany w _redirects i w references; zmiana sluga tylko z 301
impact: BLOCKER
tags: [seo, redirects, slugs, cloudflare-pages, aliases]
source: strategy.md B10 (13 URL-i stałe; zmiana tylko z 301) / synthesis §2.2 (_redirects: /realizacje 301, /start 302), S4, seo-slugs-stable / rozstrzygnięcie nadrzędne (1): /polityka-prywatnosci → /rodo 301 / site-audit.md §5 p.7, p.12
added: 2026-09-12
---

## Zasada

`site/public/_redirects` jest jedynym miejscem przekierowań (Cloudflare Pages) i ma lustrzaną tabelę w `references/redirects-registry.md` (alias · cel · kod · powód · data · kto zdecydował). Stan obowiązkowy:
```
/polityka-prywatnosci   /rodo                     301   # kanoniczna trasa prawna = /rodo (rozstrzygnięcie 2026-09-12)
/realizacje             /narzedzia                301   # vanity LinkedIn
/realizacje/*           /narzedzia/:splat         301
/start                  /oferta?utm_source=qr     302   # wizytówki / QR (302: cel może się zmienić)
/*                      /index.html               200   # SPA fallback (lub zawężony, patrz seo-404-noindex-real-404)
```
13 slugów `/narzedzia/<slug>` z `tools.ts` jest stałych. Zmiana lub usunięcie sluga wymaga w JEDNYM commicie: wpisu `301 stary → nowy` w `_redirects` i rejestrze, zmiany w `tools.ts`/`toolsSeo.ts`, aktualizacji crosslinków, `prerenderAll()` (automatycznie przez `getTools()`), canonical nowej trasy. Alias nie jest prerenderowany, nie trafia do sitemapy ani do linków wewnętrznych (linkujemy zawsze do celu, nie do aliasu). Kolejność wierszy: konkretne przed `/*`.

## Mechanizm awarii (dlaczego)

13 podstron narzędzi jest zaindeksowanych od lipca 2026 z long-tail meta i FAQ (`toolsSeo.ts`); zmiana sluga bez 301 = utrata pozycji i 404 dla linków z LinkedIn, maili outboundowych, postów bota i wizytówek QR. `/rodo` jest adresem wpisanym na sztywno w szablony outboundu (list papierowy, zaproszenie LinkedIn ≤ 300 zn., permission-mail, peer-legal §1.1), więc alias `/polityka-prywatnosci` (nazwa z wcześniejszej syntezy) musi prowadzić do niego, a nie odwrotnie. Przekierowanie wpisane tylko w Cloudflare dashboard (poza repo) ginie przy migracji i nie jest audytowalne; rejestr w repo jest.

## Niepoprawnie

```ts
// tools.ts: slug zmieniony z "raport-zarzadczy" na "raport-dla-zarzadu" bez wpisu w _redirects
```
```
# _redirects: brak aliasu /rodo; link w stopce do /polityka-prywatnosci
```

## Poprawnie

```
# public/_redirects (komentarze dozwolone; kolejność: konkretne → fallback)
/polityka-prywatnosci   /rodo                     301
/realizacje             /narzedzia                301
/realizacje/*           /narzedzia/:splat         301
/start                  /oferta?utm_source=qr     302
/*                      /index.html               200
```
```markdown
<!-- references/redirects-registry.md -->
| Alias | Cel | Kod | Powód | Data | Decyzja |
|---|---|---|---|---|---|
| /polityka-prywatnosci | /rodo | 301 | nazwa robocza z syntezy; kanoniczna = /rodo | 2026-09-12 | okno UI + c1 |
| /realizacje, /realizacje/* | /narzedzia[/:splat] | 301 | vanity LinkedIn | 2026-09-12 | synthesis S4 |
| /start | /oferta?utm_source=qr | 302 | QR na wizytówkach | 2026-09-12 | synthesis S4 |
```

## Test

```bash
grep -nE "^/polityka-prywatnosci\s+/rodo\s+301" site/public/_redirects        # 1
grep -nE "^/realizacje\s+/narzedzia\s+301|^/start\s+/oferta\?utm_source=qr\s+302" site/public/_redirects   # 2
tail -1 site/public/_redirects | grep -E "^/\*|^/narzedzia/\*|^/rodo"          # fallback ostatni
# każdy wiersz _redirects (poza fallbackiem) ma wpis w rejestrze
node .claude/skills/klarow-guardian/scripts/verify-site.mjs                                    # m.in. SPA fallback i alias /polityka-prywatnosci → /rodo w _redirects
# PLANOWANE (F3, verify-site.mjs nie zna tego trybu): node .claude/skills/klarow-guardian/scripts/verify-site.mjs --redirects
# slugi bez zmian względem baseline (lista 13 slugów w references/redirects-registry.md)
# PLANOWANE (F3, verify-site.mjs nie zna tego trybu): node .claude/skills/klarow-guardian/scripts/verify-site.mjs --slugs-stable
grep -rn "polityka-prywatnosci" site/src site/dist | grep -v "_redirects"      # 0 (linkujemy do /rodo)
```

Severity: BLOCKER (zmiana sluga bez 301 lub brak aliasu `/rodo`).

## Wyjątki

Aliasy testowe na preview deploy (nie na produkcji) nie wymagają wpisu w rejestrze.
