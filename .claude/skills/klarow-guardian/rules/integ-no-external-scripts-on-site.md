---
id: integ-no-external-scripts-on-site
title: Strona klarow.com nie ładuje niczego spoza własnej domeny bez decyzji, rejestru i /rodo
impact: BLOCKER
tags: [integrations, cdn, analytics, embed, csp, privacy, perf]
source: site-audit §4 p.6-8 / company-ui SKILL.md „NO CDN" / synthesis §5.4.9 (integ-no-cdn, integ-csp) / synthesis §4 D-15, D-16 / strategy §7.3
added: 2026-09-12
---

## Zasada

W `site/` (źródła, `index.html`, `public/`, zbudowany `dist/`) nie ma zewnętrznych `<script src>`, `<link href>`,
`<iframe>`, `@import url()`, `url(https://…)`, fontów z CDN ani obrazów z hostów obcych. Stan 2026-09-12:
0 zewnętrznych zasobów (fonty self-hosted w `public/fonts`, biblioteki w bundlu Vite, obrazy w `public/`) —
**dowód: wyjście obu przebiegów skanera w `references/integrations-registry.md` §5**, nie deklaracja.
Dozwolone wyjątki wymagają trzech rzeczy naraz: decyzji founderów w `docs/DECISIONS.md` (dziś: Cloudflare
Web Analytics = D-16, Cal.com embed = D-15 faza 2), wpisu w rejestrze ze statusem `aktywna` oraz sekcji w `/rodo`.
Przy pierwszym embedzie lub skrypcie zewnętrznym do `site/public/_headers` wchodzi CSP z dokładną listą hostów.
Hosty ze statusem `zakazana` w rejestrze (Google Fonts, cdnjs, unpkg, jsDelivr, esm.sh, Tailwind Play,
jQuery CDN, picsum, unsplash) to BLOCKER nawet w komentarzu HTML.

## Mechanizm awarii (dlaczego)

Każdy zasób z obcego hosta wysyła adres IP i user-agent użytkownika do trzeciej strony przy samym wejściu na
stronę, zanim ktokolwiek kliknie: to przetwarzanie danych wymagające informacji na `/rodo`, a przy cookies
(embedy) także zgody. Skrypt z CDN to zaufanie do cudzego serwera w kontekście naszej domeny (supply chain:
podmiana pliku = wykonanie kodu u każdego odwiedzającego). Render-blocking `<link>` z obcej domeny dokłada
DNS+TLS+RTT do LCP, którego budżet (< 2,5 s mobile 4G, `synthesis.md` §2.4.9) strona już ledwo mieści przez
three.js. Kit `company-ui` zakazuje CDN dla fontów z tego samego powodu: fallback stack + self-hosted woff2
działa offline i deterministycznie. Wyróżnik marki „dane zostają u Ciebie" obowiązuje też na landingu:
CFO sprawdzający Network w DevTools nie może zobaczyć `googleapis`, `gtag` ani `hotjar`.

## Niepoprawnie

```html
<!-- site/index.html -->
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600&display=swap" />
<script src="https://cdn.jsdelivr.net/npm/three@0.178.0/build/three.min.js"></script>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXX"></script>
```

```tsx
// site/src/components/Hero.tsx — obraz z obcego hosta (placeholder, który „zostanie do jutra")
<img src="https://picsum.photos/1600/900" alt="" />
```

## Poprawnie

```css
/* site/src/styles/company-ui.css:7-16 — fonty z własnej domeny, cache immutable w _headers */
@font-face { font-family: "Nunito Sans"; src: url(/fonts/NunitoSans-var-latin.woff2) format("woff2"); font-display: swap; }
```

```ts
// biblioteki przez npm i bundle Vite (lazy chunk), nie przez CDN
const GLSLHills = lazy(() => import("@/components/ui/glsl-hills").then((m) => ({ default: m.GLSLHills })));
```

```text
# site/public/_headers — dopiero gdy D-16 i /rodo są zamknięte (pierwszy skrypt zewnętrzny = CSP)
/*
  Content-Security-Policy: default-src 'self'; script-src 'self' https://static.cloudflareinsights.com; connect-src 'self' https://cloudflareinsights.com; img-src 'self' data:; style-src 'self' 'unsafe-inline'; font-src 'self'; frame-src 'none'; object-src 'none'; base-uri 'self'
```
(`style-src 'unsafe-inline'` jest konieczne, dopóki komponenty używają `style={{…}}`; po przejściu na tokeny — usunąć.)

## Test

```bash
# źródła: zero zewnętrznych script/link/iframe/@import
grep -rnE "<(script|link|iframe)[^>]+(src|href)=[\"'](https?:)?//" site/src site/index.html site/public | grep -v "klarow.com"
grep -rnE "@import\s+url\(\s*[\"']?https?://|url\(\s*[\"']?https?://" site/src/styles

# dist po buildzie: hosty zakazane = 0 trafień
grep -rlE "fonts\.googleapis\.com|fonts\.gstatic\.com|cdnjs\.cloudflare\.com|unpkg\.com|cdn\.jsdelivr\.net|esm\.sh|cdn\.tailwindcss\.com|code\.jquery\.com|picsum\.photos|unsplash\.com|googletagmanager|gtag/js|hotjar|plausible\.io" site/dist

# skaner: status `zakazana` → BLOCKER (exit 1); status `planowana` użyty w kodzie → HIGH
# [integ-embed-requires-privacy] (beacon/embed wdrożony przed D-15/D-16, /rodo i CSP też jest łapany)
node ".claude/skills/klarow-guardian/scripts/find-integrations.mjs" --dist --strict --quiet

# gdy istnieje jakikolwiek skrypt/iframe zewnętrzny: CSP musi być w _headers
grep -c "Content-Security-Policy" site/public/_headers
```

DevTools → Network przy wejściu na `/` i `/narzedzia/raport-zarzadczy`: wszystkie requesty do `klarow.com`
(plus zarejestrowane wyjątki po decyzji).

## Wyjątki

Cloudflare Web Analytics (D-16) i Cal.com (D-15) po spełnieniu trzech warunków. Zaraz ładuje się z własnej
domeny (`/cdn-cgi/zaraz/`), ale to nadal integracja z wpisem i `/rodo`. Hosty jako stałe w bundlu
(`react.dev`, namespace'y pdfmake — `bundled-lib-strings`) nie są requestami i nie łamią reguły; potwierdzać
w Network po każdym buildzie.
