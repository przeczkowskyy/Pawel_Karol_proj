# Pre-flight przed pushem (scalony: taste §14 + high-end §8 + imagegen §17 + Klarow-specific)

> Kopiuj do `.claude/work/<zadanie>/preflight.md` i odhaczaj. Każdy box nieodhaczony bez wpisu w `Otwarte`
> planu = zmiana nie jest gotowa. Kolejność sekcji celowo różni się od `definition-of-done.md`, żeby nie
> odklepywać wzorca. Komendy uruchamiaj z korzenia repo w Git Bash; skrypty wyłącznie przez `node`.

## 0. Bramki mechaniczne (wszystkie muszą być zielone; wyniki wklej do planu)

- [ ] `cd site && node node_modules/typescript/bin/tsc --noEmit` → 0 błędów
- [ ] `cd site && npm run build` → build klienta + SSR + `scripts/prerender.mjs` bez błędów
- [ ] `ls site/dist/*.html site/dist/narzedzia/*.html | wc -l` → **19 plików na dysku**; każdy ma dokładnie 1 `<h1>` i `<main id="main">`
- [ ] z tego **17 tras indeksowanych** (`/`, `/narzedzia`, `/oferta`, `/faq` + 13 podstron narzędzi) — tyle samo, ile `<url>` w `sitemap.xml` i tyle sprawdza `verify-site.mjs` (liczy HTML BEZ `404.html` i BEZ tras z `noindex`)
- [ ] **+ `site/dist/rodo.html`** istnieje, ma `noindex` do przeglądu radcy (D-21) i dlatego jest POZA sitemapą; po zdjęciu `noindex` tras indeksowanych jest 18, a `<url>` w sitemapie tyle samo (`legal-rodo-page-required`)
- [ ] **+ `site/dist/404.html`** istnieje, ma `noindex`, jest POZA sitemapą i poza liczbą tras indeksowanych (`seo-404-noindex-real-404`)
- [ ] `site/dist/sitemap.xml` i `site/dist/llms.txt` istnieją i są GENEROWANE (brak ręcznego `public/sitemap.xml`); `llms.txt` linkuje `/rodo`, sitemap go NIE zawiera dopóki ma `noindex`
- [ ] `grep -rli nuconic site/dist` → 0; `grep -rniE "nuconic|\bnc-[a-z]" site/src site/public demo` → 0
- [ ] `grep -rniE "#ffa914|\bgold\b" site/src site/public site/dist` → 0
- [ ] `grep -rn "—" site/src/data site/src/App.tsx site/src/pages site/src/components site/src/prerender site/public/llms.txt` → 0 (D-09); `–` tylko w zakresach liczbowych
- [ ] `node .claude/skills/klarow-guardian/scripts/audit-static.mjs --changed --fail-on BLOCKER,HIGH --baseline .claude/skills/klarow-guardian/baseline/audit-static-2026-09-12.jsonl --json <scratchpad>/audit/<data>.jsonl` → exit 0 (0 BLOCKER, 0 nowych HIGH). **Baseline tłumi wyłącznie HIGH/MEDIUM/LOW — BLOCKER przechodzi przez niego zawsze** (wpisy BLOCKER w pliku baseline są ignorowane, skrypt mówi o tym na stderr). Stan na 2026-09-12: **6 otwartych BLOCKER-ów** (`DemoReport.tsx:259,262` `performance.now`; „AI" w `tools.ts:644,658` i `toolsSeo.ts:628,652`) — dopóki żyją, ta bramka jest czerwona i push nie jest gotowy
- [ ] `node .claude/skills/klarow-guardian/scripts/find-integrations.mjs` → każdy host ma wpis w rejestrze integracji; brak CDN (`picsum|unsplash|fonts.googleapis|cdnjs|unpkg|esm.sh`) w `dist`
- [ ] `node .claude/skills/klarow-guardian/scripts/verify-site.mjs` → budżety: JS krytyczny `/` ≤ 175 KB gz, chunki Motion ≤ 36 KB gz, CSS ≤ 20 KB gz, fonty ≤ 100 KB, poster ≤ 60 KB, wideo ≤ 1,5 MB/format
- [ ] `node .claude/skills/klarow-guardian/scripts/build-index.mjs --check` → AGENTS.md (pełna tabela reguł) i tabela sekcji w SKILL.md aktualne, zero ostrzeżeń o ID bez pliku reguły (gdy zmieniano `rules/` albo `scripts/`)
- [ ] `node .claude/skills/klarow-guardian/scripts/check-secrets.mjs` → `✓ pass` (§13: zero wzorców kluczy i zero plików sekretów pod kontrolą gita)
- [ ] `git diff --cached | grep -iE "nuconic|sk-ant-|AKIA|ghp_|TELEGRAM_BOT_TOKEN|ANTHROPIC_API_KEY"` → 0; `git ls-files | grep -E "\.env|\.dev\.vars|credentials"` → 0

## 1. Marka i przekaz

- [ ] H1 na `/` = `MESSAGING.oneLiner`; `pagesSeo.home`, `ORG_JSONLD`, `llms.txt`, `index.html` fallback, prompt bota mówią to samo zdanie (diff = 0)
- [ ] Każda liczba widoczna w `dist` jest w `references/allowed-numbers.md` (status OK) i w `MESSAGING.allowedNumbers` z `source`; liczby rynkowe ze źródłem w zdaniu; zero kwot za usługi; zero Deloitte/IDC; zero framingu „oszczędzimy etat"
- [ ] Zero słowa „AI" i nazw dostawców modeli w powierzchniach sprzedażowych (jedyny wyjątek: odpowiedź FAQ zaprzeczająca)
- [ ] Etykiety dowodu z `MESSAGING.proofLabels` zgodne z `kind`; KSeF = „Własny produkt"; zero „u klientów" w liczbie mnogiej; zero „WDROŻONE" bez wpisu w `DECISIONS.md`
- [ ] Wordmark tekstowy `KLAROW` tylko w nav i stopce, płaski; zero logo graficznego w layoucie; zero gradientu w tekście
- [ ] „Excel" wyłącznie jako symptom/wejście/hak (`/oferta`, karty bólu, outbound), nigdy w H1/meta/JSON-LD jako definicja klienta
- [ ] „zero chmury" zawsze jako „zero chmury dostawcy" i nie kłóci się z KSeF
- [ ] NAP z `contact.ts`: `786 296 426` / `+48 786 296 426` / `tel:+48786296426` / `kontakt@klarow.com`; zero innych wariantów w `dist`
- [ ] Zero wersji w stopce / hero („v0.8", „BETA"), zero „strona robocza"

## 2. Design locks (tryb marketing; w trybie tool tylko pozycje oznaczone ★)

- [ ] ★ Tokeny: `grep -rnE "#[0-9a-fA-F]{3,8}\b|rgba?\(|oklch\(" site/src --include=*.tsx --include=*.css | grep -vE "tokens\.css|company-ui\.css|token-exempt"` → 0; zero `text-[Npx]`, `rounded-[…]`, inline `style` z kolorem
- [ ] ★ `@theme inline` zeruje palety Tailwinda; zero `bg-zinc-*`/`text-slate-*`/`shadow-md`/`dark:`/`bg-x/12` w `site/src`
- [ ] ★ Shape Lock: marketing {0, 8, 999}, tool {8, 10, 12, 999}; zero `rounded`, `rounded-md/lg/xl`, ad-hoc px
- [ ] Page Theme Lock: `color-scheme: dark`, `theme-color #121212`, żadna sekcja nie odwraca motywu; komplet tokenów `[data-theme="light"]` ma parę dla każdego aliasu
- [ ] ★ Jeden akcent: stal; `st-blue/green/brick/violet` i `--ok/--warn/--bad/--info` tylko w dashboardach; zero `#000`/`#fff` poza `--cta-hover`
- [ ] Jeden primary CTA na ekran (biały płaski `--cta`), jedna etykieta per intencja z `MESSAGING.cta`; etykieta nie zawija się na desktopie; brak dwóch CTA tej samej intencji na stronie
- [ ] Hero: ≤ 4 elementy (H1 ≤ 2 linie, lead ≤ 20 słów, 1 primary + 1 ghost, realne media); zero chipów, telefonu, trust-stripu, eyebrow, `<br>`; `pt ≤ 6rem`; CTA widoczne bez scrolla na 390 px
- [ ] Eyebrow ≤ ceil(sekcje/3) per trasa; home = 0; zero numeracji sekcji, scroll cues, dekoracyjnych kropek, locale/time strips, micro-meta pod nagłówkiem, „Step 1/2/3"
- [ ] Rodziny layoutu: ≥ ceil(sekcje/2) na trasę (`/` = 9 sekcji S1–S9 → ≥ 5; projekt daje 9), brak dwóch sąsiednich z tą samą; zero 3 równych kart w rzędzie; zero split-header; bento N = N komórek z ≥ 2 wizualami
- [ ] ★ Zero glass/blur/glow: `grep -rnE "backdrop-filter|backdrop-blur|-webkit-mask|filter:\s*blur|box-shadow:\s*0 0 [0-9]" site/src` → 0; cienie tylko dialog/menu
- [ ] ★ Ikony: tylko `lucide-react`, `strokeWidth` 1.5 domyślnie (1.75 tylko przy `size={16}`), rozmiary {16, 20, 24, 32}, `aria-hidden` obok tekstu, `aria-label` solo; **0 emoji** i glifów `▲▼✓✕→` w kodzie, treści, `alt`
- [ ] ★ Status = kolor + ikona + tekst z `statusMeta`; zero lewego paska; zero koloru jako jedynego nośnika
- [ ] ★ Overflow: `min-w-0` w gridach, kwoty `tnum nowrap`, ellipsis na bloku, KPI `clamp`, `overflow-wrap: anywhere` na h1/h2; na 390 px `scrollWidth <= innerWidth` na każdej z 19 tras
- [ ] ★ Sticky = nieprzezroczysty token + z-index ze skali; `.content-layer` bez z-index, `.bg-layer z-index:-1`; żaden nowy `fixed` w treści
- [ ] ★ Kontrast: tekst ≥ 4,5:1, UI ≥ 3:1, placeholder ≥ 4,5:1; tekst na wideo na najjaśniejszej klatce ≥ 4,5:1; Lighthouse a11y ≥ 95
- [ ] ★ Typografia: rem z tokenów, ≤ 7 stopni, min 12 px w UI (10 px tylko osie), Nunito Sans solo self-hosted z preload, zero serif/mono/CDN
- [ ] ★ Wejścia CSS z `animation-fill-mode: backwards`; po animacji `transform: none`; `will-change` tylko w tle
- [ ] Realne obrazy: zrzuty dem z Playwright / poster z pipeline; zero stocku, picsum, fake UI z divów, placeholderów; obrazy z `width/height`, `loading="lazy"` poniżej folda; sekcja bez assetu = usunięta
- [ ] Nawigacja w 1 linii ≤ 80 px na 1024 px; menu mobilne `inert` gdy zamknięte; wordmark → `/`
- [ ] Copy self-audit: każdy widoczny string przeczytany (PL i EN); zero „…" udawanego trzema kropkami, zero pytań retorycznych w nagłówkach, zero Title Case PL, zero „!" w komunikatach, zero słów z `MESSAGING.bannedWords`, zero Lorem; cytaty ≤ 3 linie

## 3. Motion i media

- [ ] Każda animacja ma motywację w 1 zdaniu (tabela w planie lub komentarz; na marketingu wolno też „demonstracja produktu"); zero scroll-hijacku / parallaxu / marquee / karuzel / kursora / glitchu / bluru w wejściach
- [ ] Sceny sticky: ≤ 2 na trasę, każda ≤ 300vh, postęp czytany pasywnie (`useScroll` tylko w `motion/scroll/**`), reduced-motion → kontener `height: auto` + treść w stanie KOŃCOWYM
- [ ] `MotionConfig reducedMotion="user"` na korzeniu; `useReducedMotion` w `HeroMedia`, `Counter`, `ChartReveal`, mini-diagramach; CSS `@media (prefers-reduced-motion: reduce)`; DevTools „Emulate prefers-reduced-motion": zero elementów utkniętych w `initial`, wideo → poster
- [ ] `pointer: coarse` (DevTools touch / iPhone): zero canvasu WebGL, zero `<video>` autoplay, hover-akcje dostępne bez hovera, cele dotyku ≥ 44 px
- [ ] Treść obecna w shellu prerenderu ma `initial={false}`; `grep -c "opacity:0" site/dist/index.html` na treści → 0; `<video>` nie występuje w `dist/*.html`
- [ ] Wykres w NARZĘDZIU statyczny: instant render, fade ≤ 400 ms panelu, zero „rysowania", kropki tylko informacyjne; `ChartReveal` tylko poniżej folda na treści spoza shellu
- [ ] Wykres NARRACYJNY (marketing) buduje się postępem scrolla: `scaleY`/`clipPath` zamiast `height`/`pathLength`, zero listenerów scrolla, reduced-motion → wykres kompletny, chunk sceny lazy
- [ ] ≤ 1 autoplay `<video>` per trasa: `muted playsInline loop poster preload="metadata" aria-hidden`, pauza przy `document.hidden` i poza viewportem, `MediaBoundary`; poster = LCP z `fetchpriority="high"` i `<link rel="preload">`
- [ ] Tło animowane tylko na desktopie (`pointer: fine`), jedno na trasę, pauza hidden, cleanup rAF; nigdy wideo + GLSL naraz
- [ ] `import { motion }` → 0; tylko `m` z `motion/react-m` pod `LazyMotion domAnimation strict`; `layout/layoutId/drag` → 0; `motion/*` nie w `prerender/entry.tsx`; `transition: all` → 0; `linear`/`ease-in-out` na interakcjach → 0
- [ ] Każdy `animate()`, `setTimeout`, rAF, `IntersectionObserver`, listener ma cleanup w `useEffect`

## 4. Dostępność, SEO, i18n, prawo

- [ ] Landmarki: `<main id="main">` + skip-link + `<nav>`; H1 dokładnie 1 per trasa; hierarchia nagłówków bez przeskoków
- [ ] Dialog: natywny `<dialog>` przez `showModal()`, `Esc`, zwrot fokusu, `aria-labelledby`; fokus widoczny wszędzie (`outline 2.5px solid var(--ring); offset 2px`); zero `outline-none` bez zamiennika
- [ ] `<button>` dla akcji, `<a>`/`<Link>` dla nawigacji; zero `<div onClick>`; ikony solo z `aria-label`; obrazy z `alt` (lub `alt=""`)
- [ ] Formularze: `<label>`/`htmlFor`, `type`/`inputmode`/`autocomplete`, błędy inline + fokus, `spellCheck={false}` na e-mail; **żadna zgoda nie jest zaznaczona domyślnie**; newsletter (jeśli jest) = double opt-in z odrębną zgodą; formularz „najgorszy Excel" = inbound bez checkboxa marketingowego
- [ ] `/rodo` istnieje (prerender `dist/rodo.html`, link w stopce, sitemap), zawiera: administratora, **konkretne źródła danych** (nie „źródła publicznie dostępne"), kategorie, art. 6 ust. 1 lit. f z wyjaśnieniem interesu, okres, **prawo sprzeciwu wyróżnione odrębnie** (art. 21 ust. 4), `mailto:` do sprzeciwu, adres Prezesa UODO; `/polityka-prywatnosci` = 301 → `/rodo` w `_redirects`
- [ ] PL + EN: każdy string UI = `{ pl, en }` + `pick()`; brak gołych stringów PL w JSX; `title` ≤ 60/62 zn., `description` 130–165 zn. w obu językach; `document.documentElement.lang` = wybrany język; `translate="no"` na KLAROW/KSeF/G703
- [ ] Treść widoczna bez JS: `dist/*.html` zawiera H1, lead, linki i FAQ w DOM; shell-vs-DOM: zbiór H1/H2/p po starcie Reacta identyczny z shellem; `id="seo-jsonld"` dokładnie raz; JSON-LD (`Organization`, `ItemList` na hubie, `FAQPage` z pokryciem w treści) waliduje się w Rich Results
- [ ] `narzedzia.html` ≥ 13 linków `/narzedzia/<slug>`; `/` linkuje tylko do 4 realizacji + huba; 13 slugów bez zmian (zmiana = 301 + prerender + sitemap + llms + canonical); canonical bez `www`
- [ ] `_headers`: HTML `no-cache`; `/assets/* /fonts/* /media/* /thumbs/*` immutable; `_redirects`: aliasy `301 /realizacje → /narzedzia`, `301 /realizacje/* → /narzedzia/:splat`, `302 /start → /oferta?utm_source=qr`, `301 /polityka-prywatnosci → /rodo`, fallback `/* /index.html 200` na końcu
- [ ] Zdarzenia analityczne (jeśli są) emitowane poza silnikami dem; zero cookies bez banera; CF Web Analytics = cookieless

## 5. Determinizm i sekrety (tryb tool + każdy commit)

- [ ] `grep -rnE "Date\.now|Math\.random|performance\.now|fetch\(|localStorage" site/src/lib site/src/components/dashboards` → 0 (poza `determ-exempt` z komentarzem); „Dziś" = stała
- [ ] Golden-testy: `node --test` dla każdego silnika (`report`, `qualityGate`, `tranches`, `g703`, `pdfDoc`): dwa przebiegi = identyczny JSON
- [ ] Kwoty w groszach/centach integer; `fmtMoney(cents, cur, lang)` jeden helper; PLN `12 345,67`, USD `$1,234,567.89`
- [ ] Każde demo ma etykietę „Demo na danych przykładowych" i zdanie „te same dane dają ten sam wynik"; PDF bez daty generowania, 1 strona A4, polskie znaki OK (kliknięte ręcznie na jednej podstronie)
- [ ] Żaden `.env*`, `.dev.vars`, `*.pem`, `credentials*`, `leads.json` nie był czytany, cytowany ani commitowany; sekrety Workers tylko w Cloudflare; zero sekretów/danych osób/materiałów poprzedniej firmy w promptach do narzędzi zewnętrznych (Higgsfield, MCP)

## 6. Weryfikacja wizualna i zamknięcie

- [ ] Zrzuty Playwright (WebKit ze scratchpadu, `executablePath`, bez `npx`): 390×844, 768×1024, 1024×768, 1440×900, 1920×1080 × {normal, reduced-motion, pointer: coarse} dla zmienionych tras; ścieżki zrzutów w planie, nie w repo
- [ ] Lighthouse mobile na `/`: perf ≥ 90, a11y ≥ 95, LCP < 2,5 s, CLS < 0,1; desktop LCP < 1,8 s
- [ ] Realny iPhone Karola (iOS 26) po deployu dla zmian w hero/tle/warstwach: pełna treść, brak „samego tła"; `?debug=1` bez błędów
- [ ] Deploy CF zweryfikowany po TREŚCI (marker w `index.html`/CSS), nie po hashach
- [ ] `.claude/work/<zadanie>/plan.md`: wszystkie kroki odhaczone lub w `Otwarte`; `Porażki` zachowane (FAIL → fix → PASS); wynik i ścieżki raportów wpisane
- [ ] Commit po polsku ze stopką `Co-Authored-By`, push `main` (wincred; nigdy `--no-verify`), wpis do „Stan operacyjny" (co zrobione, decyzje, co dalej) i nauczki do CLAUDE.md, gdy trwałe
