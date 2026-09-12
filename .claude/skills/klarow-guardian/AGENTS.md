# KLAROW Guardian: kompilat reguł

> Plik GENEROWANY przez `node .claude/skills/klarow-guardian/scripts/build-index.mjs` z `rules/*.md`. Nie edytuj ręcznie: popraw regułę w `rules/` i uruchom skrypt.
> Reguł: 146 (BLOCKER 39 · HIGH 75 · MEDIUM 29 · LOW 3). Kolejność: sekcja (rules/_sections.md) → impact → id.
> Format wpisu: reguła · mechanizm awarii · Niepoprawnie / Poprawnie · Test (grep / skrypt / DevTools / Playwright) · Wyjątki.
> `SKILL.md` ma tylko tabelę sekcji; pełna tabela reguł jest niżej, w tym pliku.

## Spis sekcji

- 1. Marka i przekaz (nazwa poprzedniej firmy, złoto, wordmark, jeden akcent, etykiety dowodu, liczby, „AI") (`brand`, reguł: 7, domyślnie BLOCKER, tryb both, właściciel `brand-leak-auditor` (copy: `copy-auditor`, dist: `seo-auditor`))
- 2. Design locks i kit (tokeny, `@theme`, kształt, motyw, CTA, hero, eyebrow, karty, glass, ikony, statusy, overflow, sticky, kontrast, typografia, fill-mode, PDF, light) (`design`, reguł: 18, domyślnie MEDIUM, tryb marketing (kit: both), właściciel `ui-auditor`)
- 3. Ruch, wideo, tła, reduced-motion, budżet Motion (`motion`, reguł: 17, domyślnie BLOCKER, tryb both, właściciel `motion-auditor`)
- 4. Assety: obrazy, poster, wideo, zrzuty, budżety plików, metadane (`media`, reguł: 10, domyślnie HIGH, tryb marketing, właściciel `ui-auditor`)
- 5. Budżety wydajności (LCP/CLS/INP, chunki, fonty, transfer, lazy, build target) (`perf`, reguł: 10, domyślnie HIGH, tryb both, właściciel `code-auditor`)
- 6. React / Vite / TS / git / plan (bez `npx`, `npm run check`, kompozycja, React 19) (`code`, reguł: 17, domyślnie MEDIUM, tryb both, właściciel `code-auditor`)
- 7. Dostępność (landmarki, dialog, fokus, semantyka, formularze, touch, lang) (`a11y`, reguł: 15, domyślnie HIGH, tryb both, właściciel `ui-auditor`)
- 8. SEO / prerender / GEO (19 plików HTML = 17 tras w sitemapie + `/rodo` z `noindex` + `404.html`, sitemap i llms generowane, meta, JSON-LD, nagłówki) (`seo`, reguł: 12, domyślnie HIGH, tryb marketing, właściciel `seo-auditor`)
- 9. PL + EN (`{ pl, en }` + `pick()`, kompletność par, limity długości, `lang`) (`i18n`, reguł: 4, domyślnie HIGH, tryb both, właściciel `copy-auditor`)
- 10. Copy, typografia PL/EN, słowa zakazane, liczby ze źródłem, ton (`copy`, reguł: 10, domyślnie HIGH, tryb marketing, właściciel `copy-auditor`)
- 11. RODO (`/rodo`, art. 14, prawo sprzeciwu), PKE (zgody, formularze bez domyślnych zgód, double opt-in) (`legal`, reguł: 7, domyślnie BLOCKER, tryb marketing, właściciel `copy-auditor` + `integration-scanner`)
- 12. Integracje zewnętrzne: rejestr, zero CDN, zero API modeli w runtime, CSP, zgody (`integ`, reguł: 8, domyślnie BLOCKER, tryb both, właściciel `integration-scanner`)
- 13. Sekrety: `.env`, klucze, tokeny, prompty do narzędzi zewnętrznych (`secret`, reguł: 5, domyślnie BLOCKER, tryb both, właściciel `brand-leak-auditor` + `integration-scanner`)
- 14. Determinizm dem i silników (zero `Date.now`/`Math.random`/sieci, golden-testy, grosze, etykieta DEMO) (`demo`, reguł: 6, domyślnie BLOCKER, tryb tool, właściciel `code-auditor`)

## Tabela reguł (pełna)

| § | ID | impact | tytuł | plik |
|---|---|---|---|---|
| 1.1 | `brand-allowed-numbers-only` | BLOCKER | Każda liczba publiczna ma źródło w references/allowed-numbers.md | [rules/brand-allowed-numbers-only.md](rules/brand-allowed-numbers-only.md) |
| 1.2 | `brand-honest-labels` | BLOCKER | Etykiety dowodu (Demo / Własny produkt / Wdrożone) tylko z pokryciem | [rules/brand-honest-labels.md](rules/brand-honest-labels.md) |
| 1.3 | `brand-no-ai-word-in-sales` | BLOCKER | Zero słowa „AI" i nazw dostawców modeli w komunikacji sprzedażowej | [rules/brand-no-ai-word-in-sales.md](rules/brand-no-ai-word-in-sales.md) |
| 1.4 | `brand-no-gold` | BLOCKER | Zero złota #FFA914 i jego śladów w publicznym kodzie | [rules/brand-no-gold.md](rules/brand-no-gold.md) |
| 1.5 | `brand-no-nuconic` | BLOCKER | Zero nazwy poprzedniej firmy w czymkolwiek publicznym | [rules/brand-no-nuconic.md](rules/brand-no-nuconic.md) |
| 1.6 | `brand-single-accent-steel` | BLOCKER | Jeden akcent (stal #A8B4C2); semantyka statusów tylko w narzędziach | [rules/brand-single-accent-steel.md](rules/brand-single-accent-steel.md) |
| 1.7 | `brand-wordmark-only` | BLOCKER | Znak marki to tekstowy wordmark KLAROW, płaski, bez logo graficznego | [rules/brand-wordmark-only.md](rules/brand-wordmark-only.md) |
| 2.1 | `design-animation-fill-backwards` | HIGH | Wejścia CSS z animation-fill-mode backwards; po animacji element nie zostaje z transform | [rules/design-animation-fill-backwards.md](rules/design-animation-fill-backwards.md) |
| 2.2 | `design-contrast-aa` | HIGH | Kontrast AA: tekst ≥ 4,5:1, elementy UI i obrysy ≥ 3:1, placeholder ≥ 4,5:1, tekst na wideo na najjaśniejszej klatce | [rules/design-contrast-aa.md](rules/design-contrast-aa.md) |
| 2.3 | `design-hero-discipline` | HIGH | Hero: maksymalnie 4 elementy tekstowe, H1 ≤ 2 linie, lead ≤ 20 słów, realny wizual | [rules/design-hero-discipline.md](rules/design-hero-discipline.md) |
| 2.4 | `design-no-glass-no-blur` | HIGH | Zero glassmorphism, backdrop-filter, mask na hover, blur w wejściach, glow i gradientu w tekście | [rules/design-no-glass-no-blur.md](rules/design-no-glass-no-blur.md) |
| 2.5 | `design-one-cta-per-screen` | HIGH | Jeden primary CTA na ekran (biały, płaski); jedna etykieta per intencja | [rules/design-one-cta-per-screen.md](rules/design-one-cta-per-screen.md) |
| 2.6 | `design-overflow-rules` | HIGH | Overflow: min-width 0 w gridach, kwoty nowrap, ellipsis na bloku, KPI clamp, zero scrolla poziomego | [rules/design-overflow-rules.md](rules/design-overflow-rules.md) |
| 2.7 | `design-status-semantics` | HIGH | Status = kolor + ikona + tekst z jednego słownika; nigdy sam kolor | [rules/design-status-semantics.md](rules/design-status-semantics.md) |
| 2.8 | `design-sticky-opaque` | HIGH | Sticky = nieprzezroczyste tło z tokenu i udokumentowana skala z-index | [rules/design-sticky-opaque.md](rules/design-sticky-opaque.md) |
| 2.9 | `design-tokens-only` | HIGH | Tokeny są prawem: zero hex/rgba/oklch i wartości ad hoc poza tokens.css | [rules/design-tokens-only.md](rules/design-tokens-only.md) |
| 2.10 | `design-eyebrow-cap` | MEDIUM | Eyebrow (kapitalik nad nagłówkiem) maksymalnie ceil(sekcje/3) na trasę; home = 0 | [rules/design-eyebrow-cap.md](rules/design-eyebrow-cap.md) |
| 2.11 | `design-icons-lucide-one-family` | MEDIUM | Ikony wyłącznie lucide-react, strokeWidth 1.5 domyślnie (1.75 tylko dla ikon 16 px), rozmiary z mapy, zero emoji i glifów | [rules/design-icons-lucide-one-family.md](rules/design-icons-lucide-one-family.md) |
| 2.12 | `design-light-ready-tokens` | MEDIUM | Komplet tokenów [data-theme="light"] od dnia 1, bez przełącznika na stronie | [rules/design-light-ready-tokens.md](rules/design-light-ready-tokens.md) |
| 2.13 | `design-no-three-equal-cards` | MEDIUM | Zero trzech równych kart w rzędzie; rodziny layoutu się nie powtarzają | [rules/design-no-three-equal-cards.md](rules/design-no-three-equal-cards.md) |
| 2.14 | `design-page-theme-lock` | MEDIUM | Page Theme Lock: landing jest ciemny na całej stronie, motyw przez tokeny, zero dark: i inwersji sekcji | [rules/design-page-theme-lock.md](rules/design-page-theme-lock.md) |
| 2.15 | `design-pdf-document-pattern` | MEDIUM | Dokument PDF: pdfmake lazy, deterministyczny, 1 strona A4, nagłówek KLAROW, stopka DEMO, Roboto z parametrem font | [rules/design-pdf-document-pattern.md](rules/design-pdf-document-pattern.md) |
| 2.16 | `design-shape-lock` | MEDIUM | Shape Lock: promienie tylko ze zbioru {0, 8, 10, 12, 999} rozdzielonego per data-surface | [rules/design-shape-lock.md](rules/design-shape-lock.md) |
| 2.17 | `design-theme-inline-zeroed` | MEDIUM | @theme inline zeruje palety Tailwinda; utility tylko z naszych tokenów | [rules/design-theme-inline-zeroed.md](rules/design-theme-inline-zeroed.md) |
| 2.18 | `design-typography-scale` | MEDIUM | Skala pisma w rem, maksymalnie 7 stopni, minimum 12 px w UI, jeden krój, zero serif i mono | [rules/design-typography-scale.md](rules/design-typography-scale.md) |
| 3.1 | `motion-charts-static` | BLOCKER | Wykresy statyczne: reveal raz ≤ 420 ms (DUR.reveal / --duration-slow) na poziomie panelu, potem statyka; zero „rysowania" | [rules/motion-charts-static.md](rules/motion-charts-static.md) |
| 3.2 | `motion-no-initial-hidden-above-fold` | BLOCKER | Treść obecna w shellu prerenderu nie może startować ukryta: initial={false} nad foldem | [rules/motion-no-initial-hidden-above-fold.md](rules/motion-no-initial-hidden-above-fold.md) |
| 3.3 | `motion-no-pinning-no-scroll-hijack` | BLOCKER | Zakaz produktowy pinowania, sticky-scen, horizontal-pan, parallaxu, marquee, scroll-hijack i własnego kursora | [rules/motion-no-pinning-no-scroll-hijack.md](rules/motion-no-pinning-no-scroll-hijack.md) |
| 3.4 | `motion-reduced-motion-three-layers` | BLOCKER | Reduced motion w trzech warstwach: MotionConfig user + useReducedMotion + CSS globalne | [rules/motion-reduced-motion-three-layers.md](rules/motion-reduced-motion-three-layers.md) |
| 3.5 | `motion-bundle-budget-motion` | HIGH | Chunki Motion ≤ 35 KB gz w ścieżce krytycznej; ≥ 40 KB = sygnatura domMax / pełnego motion | [rules/motion-bundle-budget-motion.md](rules/motion-bundle-budget-motion.md) |
| 3.6 | `motion-cleanup-required` | HIGH | Każda animacja imperatywna, subskrypcja, timer, rAF i observer ma cleanup w useEffect | [rules/motion-cleanup-required.md](rules/motion-cleanup-required.md) |
| 3.7 | `motion-gpu-props-only` | HIGH | Animujemy tylko opacity, transform, clipPath i filter; nigdy właściwości layoutu i paint | [rules/motion-gpu-props-only.md](rules/motion-gpu-props-only.md) |
| 3.8 | `motion-no-motion-in-prerender` | HIGH | Zero motion/* i zero window/document w src/prerender/entry.tsx i w komponentach renderowanych przez shell | [rules/motion-no-motion-in-prerender.md](rules/motion-no-motion-in-prerender.md) |
| 3.9 | `motion-no-transition-all-no-linear` | HIGH | Zakaz transition: all / transition-all i krzywych linear / ease-in-out na interakcjach; CSS nie animuje tego, co animuje Motion | [rules/motion-no-transition-all-no-linear.md](rules/motion-no-transition-all-no-linear.md) |
| 3.10 | `motion-one-library-lazymotion` | HIGH | Jedna biblioteka ruchu w DOM: m.* + LazyMotion domAnimation strict | [rules/motion-one-library-lazymotion.md](rules/motion-one-library-lazymotion.md) |
| 3.11 | `motion-view-transition-rules` | HIGH | View Transitions: React 19.3 <ViewTransition> tylko wokół <Routes> i tylko w fazie 2; nigdy VT + Motion na jednym elemencie; nigdy flushSync(navigate) pod BrowserRouter | [rules/motion-view-transition-rules.md](rules/motion-view-transition-rules.md) |
| 3.12 | `motion-counters-pattern` | MEDIUM | Liczniki: useMotionValue(to) + animate jako dziecko m.span, useInView once, brak animacji gdy element widoczny od pierwszej klatki, jump przy reduced, liczba w shellu na stałe | [rules/motion-counters-pattern.md](rules/motion-counters-pattern.md) |
| 3.13 | `motion-hover-fallback` | MEDIUM | Hover bez layout shift i z fallbackiem dla pointer: coarse i fokusu; hover animuje kolor/border/opacity, transform tylko na obrazie w overflow:hidden | [rules/motion-hover-fallback.md](rules/motion-hover-fallback.md) |
| 3.14 | `motion-motivated` | MEDIUM | Każda animacja ma motywację w jednym zdaniu; brak zdania = brak animacji | [rules/motion-motivated.md](rules/motion-motivated.md) |
| 3.15 | `motion-tier-flag` | MEDIUM | Jeden kill-switch ruchu i mediów: MOTION_TIER full/still/calm w tokens.ts, z którego wynika MEDIA_ENABLED; nigdy druga ścieżka renderu | [rules/motion-tier-flag.md](rules/motion-tier-flag.md) |
| 3.16 | `motion-tokens-only` | MEDIUM | Czasy, krzywe, stagger i przesunięcia wyłącznie z src/motion/tokens.ts i zmiennych CSS | [rules/motion-tokens-only.md](rules/motion-tokens-only.md) |
| 3.17 | `motion-stagger-caps` | LOW | Kaskada ≤ 12 dzieci, odstęp 40–60 ms, przesunięcie wejścia ≤ 12 px; duże powierzchnie tylko opacity | [rules/motion-stagger-caps.md](rules/motion-stagger-caps.md) |
| 4.1 | `media-higgsfield-inputs-policy` | BLOCKER | Higgsfield: do modelu trafiają wyłącznie abstrakcje i własne stille; zero zrzutów I NAGRAŃ narzędzi, danych, twarzy i materiałów firmy źródłowej; log SOURCES.md; zakres v1 mieści się w trialu; usuwać generacje po sprincie | [rules/media-higgsfield-inputs-policy.md](rules/media-higgsfield-inputs-policy.md) |
| 4.2 | `media-one-autoplay-per-route` | BLOCKER | Najwyżej jedno automatycznie odtwarzane wideo i jedno ruchome tło na trasę; nigdy oba naraz | [rules/media-one-autoplay-per-route.md](rules/media-one-autoplay-per-route.md) |
| 4.3 | `media-video-gating` | BLOCKER | Wideo tylko po bramkach: pointer fine, brak reduced-motion, brak saveData/2g-3g, po window.load, IO play/pause, visibilitychange, pauza użytkownika w sessionStorage, iOS Low Power Mode → poster | [rules/media-video-gating.md](rules/media-video-gating.md) |
| 4.4 | `media-video-placement` | BLOCKER | Wideo i tło wyłącznie w kontenerze hero (absolute + overflow:hidden) albo w .bg-layer; nigdy nowy position:fixed ani kontekst stackingu w .content-layer | [rules/media-video-placement.md](rules/media-video-placement.md) |
| 4.5 | `media-asset-review-gate` | HIGH | Bramka przeglądu assetu: „nie widać, że AI", brak ludzi/tekstu/ciepłej barwy, zdejmowalne bez straty treści, banding na OLED, budżet | [rules/media-asset-review-gate.md](rules/media-asset-review-gate.md) |
| 4.6 | `media-headers-versioning` | HIGH | Pliki w public/media i public/thumbs mają wersję w nazwie i nagłówek immutable; zmiana treści = nowa wersja, nigdy nadpisanie | [rules/media-headers-versioning.md](rules/media-headers-versioning.md) |
| 4.7 | `media-recorded-demo-determinism` | HIGH | Nagrania narzędzi wchodzą do repo wyłącznie jako re-enkod z wyodrębnionych klatek 24 fps CFR; manifest CLIPS.json trzyma hashe klatek, nie kontenera; rozjazd z UI = czerwony build | [rules/media-recorded-demo-determinism.md](rules/media-recorded-demo-determinism.md) |
| 4.8 | `media-video-budgets` | HIGH | Budżety wideo: nagranie hero ≤ 1,2 MB WebM / ≤ 1,4 MB H.264, klip hover ≤ 320 KB, poster = kadr produktu ≤ 110 KB, 6–10 s, 24 fps CFR, bez audio | [rules/media-video-budgets.md](rules/media-video-budgets.md) |
| 4.9 | `media-video-embed-spec` | HIGH | Specyfikacja elementu <video>: muted playsInline loop preload=metadata poster, źródła AV1→VP9→H.264, aria-hidden, disablePictureInPicture, MediaBoundary, przycisk pauzy tła (WCAG 2.2.2) | [rules/media-video-embed-spec.md](rules/media-video-embed-spec.md) |
| 4.10 | `media-poster-first-frame` | MEDIUM | Poster to klatka 0 pliku wideo (przy pętli także identyczna z ostatnią), wyciągana z gotowego wideo, ten sam plik w <img>, <video poster> i preload | [rules/media-poster-first-frame.md](rules/media-poster-first-frame.md) |
| 5.1 | `perf-no-webgl-on-coarse` | BLOCKER | Na pointer: coarse (telefony, tablety) zero canvasu WebGL, zero wideo autoplay, zero elementów fixed poza navem; tło = statyczny gradient .bg-layer | [rules/perf-no-webgl-on-coarse.md](rules/perf-no-webgl-on-coarse.md) |
| 5.2 | `perf-build-target` | HIGH | Kod zgodny z build.target es2019/safari13: bez toSorted/at/structuredClone/Array.findLast/Object.hasOwn/oklch/color-mix bez fallbacku; komentarz w vite.config prawdziwy | [rules/perf-build-target.md](rules/perf-build-target.md) |
| 5.3 | `perf-chunk-size-gate` | HIGH | verify-site.mjs porównuje rozmiary chunków z baseline: wzrost > 5 % lub nowy chunk krytyczny = fail; baseline zmienia tylko świadomy commit | [rules/perf-chunk-size-gate.md](rules/perf-chunk-size-gate.md) |
| 5.4 | `perf-code-split-dashboards` | HIGH | Dashboardy przez React.lazy per klucz + DashboardMount (IntersectionObserver, requestIdleCallback, kolejka) + skeleton z minHeight | [rules/perf-code-split-dashboards.md](rules/perf-code-split-dashboards.md) |
| 5.5 | `perf-fonts-budget` | HIGH | Fonty self-hosted w public/fonts, zero CDN, ≤ 100 KB w fazie 1 (Nunito Sans solo) / ≤ 150 KB po ewentualnym drugim kroju, preload latin, font-display swap + size-adjust | [rules/perf-fonts-budget.md](rules/perf-fonts-budget.md) |
| 5.6 | `perf-images-policy` | HIGH | Obrazy: WebP (AVIF opcjonalnie), srcset dla ram i portretów, jawne width/height (CLS 0), loading lazy poniżej folda, limity rozmiarów, zero PNG/JPG w treści | [rules/perf-images-policy.md](rules/perf-images-policy.md) |
| 5.7 | `perf-js-budget-home` | HIGH | JS krytyczny na / ≤ 140 KB gz (react-dom ~58 + router ~15 + motion ~34 + app ~25); podstrona narzędzia ≤ +60 KB gz lazy | [rules/perf-js-budget-home.md](rules/perf-js-budget-home.md) |
| 5.8 | `perf-lcp-poster-preload` | HIGH | LCP = kadr produktu w hero (bramka ELEMENTOWA, nie tylko czasowa): preload z fetchpriority high, H1 w shellu, wideo nigdy preloadowane i montowane dopiero po load i rIC; bramki CWV: LCP mobile < 2,5 s / desktop < 1,8 s, CLS < 0,05 na / i < 0,1 na podstronach, INP < 200 ms | [rules/perf-lcp-poster-preload.md](rules/perf-lcp-poster-preload.md) |
| 5.9 | `perf-three-js-policy` | HIGH | three.js (GLSL Hills) tylko jako plan B: desktop pointer fine, montaż po idle po load, saveData gate, poza pierwszym JS, nigdy z wideo; usunąć z dependencies, gdy hero-loop przejdzie | [rules/perf-three-js-policy.md](rules/perf-three-js-policy.md) |
| 5.10 | `perf-no-zoom-root` | MEDIUM | Zakaz zoom na :root; skalowanie dużych ekranów przez clamp() w tokenach typografii i kontenerze | [rules/perf-no-zoom-root.md](rules/perf-no-zoom-root.md) |
| 6.1 | `code-lint-and-tests-gate` | BLOCKER | Bramka przed pushem: tsc, ESLint (react-hooks, jsx-a11y), node --test golden, build, verify, audit | [rules/code-lint-and-tests-gate.md](rules/code-lint-and-tests-gate.md) |
| 6.2 | `code-build-target-policy` | HIGH | Polityka build.target/cssTarget: es2019 + safari13 w fazie 1; CSS bez color-mix/oklch; komentarze zgodne z prawdą | [rules/code-build-target-policy.md](rules/code-build-target-policy.md) |
| 6.3 | `code-contact-single-source` | HIGH | NAP wyłącznie z src/data/contact.ts | [rules/code-contact-single-source.md](rules/code-contact-single-source.md) |
| 6.4 | `code-effects-hygiene` | HIGH | Higiena efektów: prymitywne deps, cleanup, useEffectEvent, zero derived-state w efektach | [rules/code-effects-hygiene.md](rules/code-effects-hygiene.md) |
| 6.5 | `code-lazy-routes-and-dashboards` | HIGH | Trasy, dashboardy, dialog i pdfmake przez React.lazy / import() | [rules/code-lazy-routes-and-dashboards.md](rules/code-lazy-routes-and-dashboards.md) |
| 6.6 | `code-no-arbitrary-tailwind-values` | HIGH | Zero arbitralnych wartości Tailwinda (text-[Npx], bg-[#hex], w-[calc()] kolorów i typografii) | [rules/code-no-arbitrary-tailwind-values.md](rules/code-no-arbitrary-tailwind-values.md) |
| 6.7 | `code-no-inline-style-colors` | HIGH | Zero kolorów, rozmiarów pisma i promieni w style={{ }}; klasy kitu i tokeny | [rules/code-no-inline-style-colors.md](rules/code-no-inline-style-colors.md) |
| 6.8 | `code-no-runtime-errors` | HIGH | Zero błędów runtime na produkcji: pusty #root nigdy, konsola czysta na każdej trasie, granice błędów wokół tła, mediów i dashboardów | [rules/code-no-runtime-errors.md](rules/code-no-runtime-errors.md) |
| 6.9 | `code-single-source-copy` | HIGH | Jedno źródło copy: data/*.ts konsumowane przez React i shelle prerendera | [rules/code-single-source-copy.md](rules/code-single-source-copy.md) |
| 6.10 | `code-tosorted-safari13` | HIGH | [...a].sort() zamiast toSorted(); zero metod nowszych niż safari13 bez polyfilla | [rules/code-tosorted-safari13.md](rules/code-tosorted-safari13.md) |
| 6.11 | `code-file-size-cap` | MEDIUM | Plik komponentu ≤ 300 linii; App.tsx rozbity na pages/ + data/ + layout/ | [rules/code-file-size-cap.md](rules/code-file-size-cap.md) |
| 6.12 | `code-memo-policy` | MEDIUM | Polityka memoizacji: decyzja o React Compiler; do tego czasu useMemo tylko z pomiarem | [rules/code-memo-policy.md](rules/code-memo-policy.md) |
| 6.13 | `code-no-dead-code` | MEDIUM | Zero martwego kodu w repo: zapas = osobna gałąź, nie plik w src | [rules/code-no-dead-code.md](rules/code-no-dead-code.md) |
| 6.14 | `code-no-forwardref-react19` | MEDIUM | React 19: ref jako zwykły prop, zero forwardRef | [rules/code-no-forwardref-react19.md](rules/code-no-forwardref-react19.md) |
| 6.15 | `code-state-in-url` | MEDIUM | Stan nawigacyjny (filtry hubu, zakładki, rozwinięte panele) w URL, nie w useState | [rules/code-state-in-url.md](rules/code-state-in-url.md) |
| 6.16 | `code-use-not-usecontext` | MEDIUM | use(Context) zamiast useContext(Context) | [rules/code-use-not-usecontext.md](rules/code-use-not-usecontext.md) |
| 6.17 | `code-no-barrel-imports` | LOW | Zero importów z barrel-files (lodash, react-icons, date-fns); lucide-react akceptowany | [rules/code-no-barrel-imports.md](rules/code-no-barrel-imports.md) |
| 7.1 | `a11y-reduced-motion-media-query` | BLOCKER | Każda animacja CSS pod @media (prefers-reduced-motion: reduce); każdy komponent Motion, wideo i canvas z gałęzią reduced | [rules/a11y-reduced-motion-media-query.md](rules/a11y-reduced-motion-media-query.md) |
| 7.2 | `a11y-contrast` | HIGH | Kontrast: tekst ≥ 4,5:1, UI i placeholdery ≥ 3:1, tekst na wideo ≥ 4,5:1 na najjaśniejszej klatce | [rules/a11y-contrast.md](rules/a11y-contrast.md) |
| 7.3 | `a11y-controls-native` | HIGH | <button> dla akcji, <a>/<Link> dla nawigacji; zero <div onClick>, zero navigate() w onClick | [rules/a11y-controls-native.md](rules/a11y-controls-native.md) |
| 7.4 | `a11y-dialog-semantics` | HIGH | Dialog: natywny <dialog> (lub role="dialog" aria-modal aria-labelledby), focus-trap, zwrot fokusu, Esc, klik w tło | [rules/a11y-dialog-semantics.md](rules/a11y-dialog-semantics.md) |
| 7.5 | `a11y-focus-visible-everywhere` | HIGH | Widoczny fokus na każdym elemencie interaktywnym; :focus-visible, nigdy outline-none bez zamiennika | [rules/a11y-focus-visible-everywhere.md](rules/a11y-focus-visible-everywhere.md) |
| 7.6 | `a11y-form-labels-errors` | HIGH | Formularze: label/htmlFor, type + inputmode + autocomplete, błędy inline z fokusem, zero blokady paste; komunikaty asynchroniczne w aria-live | [rules/a11y-form-labels-errors.md](rules/a11y-form-labels-errors.md) |
| 7.7 | `a11y-headings-order-one-h1` | HIGH | Dokładnie jeden H1 na trasę, hierarchia h1→h2→h3 bez przeskoków, scroll-margin-top na kotwicach | [rules/a11y-headings-order-one-h1.md](rules/a11y-headings-order-one-h1.md) |
| 7.8 | `a11y-images-alt-svg-role` | HIGH | Obrazy: alt (lub alt="") + width/height + loading; SVG z danymi: role="img" + aria-label; ikony aria-hidden | [rules/a11y-images-alt-svg-role.md](rules/a11y-images-alt-svg-role.md) |
| 7.9 | `a11y-inert-hidden-menus` | HIGH | Zamknięte menu i panele ukryte przez inert/hidden, nie przez opacity-0 + pointer-events-none | [rules/a11y-inert-hidden-menus.md](rules/a11y-inert-hidden-menus.md) |
| 7.10 | `a11y-lang` | HIGH | Atrybut lang na <html> w każdym statycznym HTML i po przełączeniu języka; fragmenty w drugim języku z własnym lang | [rules/a11y-lang.md](rules/a11y-lang.md) |
| 7.11 | `a11y-main-and-skip-link` | HIGH | Landmarki: <main id="main"> na każdej trasie, skip-link jako pierwszy element, <nav> i <footer> | [rules/a11y-main-and-skip-link.md](rules/a11y-main-and-skip-link.md) |
| 7.12 | `a11y-safe-area-dvh` | HIGH | Bez przewijania poziomego na 390 px, min-height 100dvh z fallbackiem vh, env(safe-area-inset-*) na full-bleed, gutter ≥ 16 px | [rules/a11y-safe-area-dvh.md](rules/a11y-safe-area-dvh.md) |
| 7.13 | `a11y-faq-aria-controls` | MEDIUM | Akordeon FAQ: button z aria-expanded + aria-controls, panel z id i region; odpowiedź zawsze w DOM | [rules/a11y-faq-aria-controls.md](rules/a11y-faq-aria-controls.md) |
| 7.14 | `a11y-touch-targets-44` | MEDIUM | Cele dotykowe ≥ 44×44 px, touch-action: manipulation, tap-highlight ustawiony, overscroll-behavior w dialogach | [rules/a11y-touch-targets-44.md](rules/a11y-touch-targets-44.md) |
| 7.15 | `a11y-no-title-tooltips` | LOW | Zero atrybutu title jako tooltipa; nazwa dostępna przez aria-label, tooltip kitu widoczny na fokusie i dotyku | [rules/a11y-no-title-tooltips.md](rules/a11y-no-title-tooltips.md) |
| 8.1 | `seo-links-in-dom` | BLOCKER | Linki w DOM: hub ≥ 13 <a> do /narzedzia/<slug> zawsze (shell i po JS); home linkuje do 4 realizacji + hub; shell = DOM | [rules/seo-links-in-dom.md](rules/seo-links-in-dom.md) |
| 8.2 | `seo-prerender-must-keep` | BLOCKER | Prerender must-keep: 19 HTML z prerenderAll(), pusty #root w szablonie, id="seo-jsonld", podmiany jako funkcje | [rules/seo-prerender-must-keep.md](rules/seo-prerender-must-keep.md) |
| 8.3 | `seo-redirects-registry` | BLOCKER | Rejestr przekierowań: każdy alias 301/302 spisany w _redirects i w references; zmiana sluga tylko z 301 | [rules/seo-redirects-registry.md](rules/seo-redirects-registry.md) |
| 8.4 | `seo-sitemap-llms-generated` | BLOCKER | sitemap.xml i llms.txt wyłącznie generowane w buildzie; ręczny public/sitemap.xml nigdy | [rules/seo-sitemap-llms-generated.md](rules/seo-sitemap-llms-generated.md) |
| 8.5 | `seo-404-noindex-real-404` | HIGH | Trasa * → NotFound z noindex, prerender dist/404.html, zero soft-404 (błędny adres nie zwraca 200 z pustą stroną) | [rules/seo-404-noindex-real-404.md](rules/seo-404-noindex-real-404.md) |
| 8.6 | `seo-canonical-og-twitter` | HIGH | Canonical bez www i bez parametrów, og:* i twitter:* w prerenderze, og:image per trasa | [rules/seo-canonical-og-twitter.md](rules/seo-canonical-og-twitter.md) |
| 8.7 | `seo-jsonld-per-kind` | HIGH | JSON-LD per rodzaj: Organization (+logo, sameAs, areaServed), ItemList na hubie, SoftwareApplication tylko demo, Service dla product/case, FAQPage z pokryciem w DOM | [rules/seo-jsonld-per-kind.md](rules/seo-jsonld-per-kind.md) |
| 8.8 | `seo-pageseo-single-source` | HIGH | pagesSeo.ts / toolsSeo.ts = jedyne źródło title i description; title ≤ 60 (narzędzia ≤ 62), description 130–165, PL + EN | [rules/seo-pageseo-single-source.md](rules/seo-pageseo-single-source.md) |
| 8.9 | `seo-toolsseo-required-for-new-slug` | HIGH | Nowy slug wchodzi do tools.ts dopiero z pełnym wpisem w toolsSeo.ts: title, description, 4 Q&A, PL i EN | [rules/seo-toolsseo-required-for-new-slug.md](rules/seo-toolsseo-required-for-new-slug.md) |
| 8.10 | `seo-gsc-and-analytics` | MEDIUM | Search Console + Cloudflare Web Analytics (cookieless) + zdarzenia CTA poza silnikami dem; zero GA4 bez banera | [rules/seo-gsc-and-analytics.md](rules/seo-gsc-and-analytics.md) |
| 8.11 | `seo-hreflang-deferred` | MEDIUM | hreflang i trasy /pl/ /en/ odroczone (decyzja Karola); nie dodawać hreflang do jednego URL; EN tylko przez przełącznik i sekcję lang="en" | [rules/seo-hreflang-deferred.md](rules/seo-hreflang-deferred.md) |
| 8.12 | `seo-lastmod-from-git-not-now` | MEDIUM | <lastmod> w sitemap z daty commitu pliku danych (git log), nigdy z Date.now() w buildzie | [rules/seo-lastmod-from-git-not-now.md](rules/seo-lastmod-from-git-not-now.md) |
| 9.1 | `i18n-lang-before-paint` | HIGH | Język z localStorage ustawiany inline-skryptem w <head> przed pierwszym renderem (data-lang + html lang), bez mignięcia PL→EN | [rules/i18n-lang-before-paint.md](rules/i18n-lang-before-paint.md) |
| 9.2 | `i18n-pl-en-pair-required` | HIGH | Każdy string UI = obiekt { pl, en } + pick(); zero gołych stringów PL/EN w JSX i w danych | [rules/i18n-pl-en-pair-required.md](rules/i18n-pl-en-pair-required.md) |
| 9.3 | `i18n-pl-typography` | HIGH | Typografia PL/EN: cudzysłowy „ " (PL) i “ ” (EN), zero em-dash „—" w UI/meta/PDF, półpauza tylko w prozie PL ≤ 1 na akapit, EN bez myślników jako interpunkcji, „…" nie „...", twarde spacje | [rules/i18n-pl-typography.md](rules/i18n-pl-typography.md) |
| 9.4 | `i18n-sentence-case-headings` | MEDIUM | Zdaniowa pisownia nagłówków, przycisków i etykiet w PL i EN; Title Case i CAPS tylko dla wordmarku i skrótów | [rules/i18n-sentence-case-headings.md](rules/i18n-sentence-case-headings.md) |
| 10.1 | `copy-banned-claims` | BLOCKER | Zakazane twierdzenia: „Deloitte/IDC", „oszczędzimy etat", „wdrożone u klientów" bez pokrycia, „stała cena" jako tag, kwoty per narzędzie, nazwa poprzedniej firmy | [rules/copy-banned-claims.md](rules/copy-banned-claims.md) |
| 10.2 | `copy-numbers-with-source` | BLOCKER | Każda liczba na stronie ma wpis w allowedNumbers (messaging.ts) i references/allowed-numbers.md ze źródłem; pokazuj działanie arytmetyczne | [rules/copy-numbers-with-source.md](rules/copy-numbers-with-source.md) |
| 10.3 | `copy-cta-labels` | HIGH | Etykiety CTA: 1 etykieta na intencję, ≤ 3 słowa, „Umów 30 minut" / „Zobacz realizacje" / „Przyślij najgorszy Excel"; 1 primary na ekran | [rules/copy-cta-labels.md](rules/copy-cta-labels.md) |
| 10.4 | `copy-excel-as-symptom-not-identity` | HIGH | Excel = symptom, wejście i hak; nigdy definicja klienta w H1, meta, JSON-LD, llms.txt, promptcie bota | [rules/copy-excel-as-symptom-not-identity.md](rules/copy-excel-as-symptom-not-identity.md) |
| 10.5 | `copy-faq-single-source` | HIGH | FAQ z jednego źródła (faq.ts + toolsSeo.ts): akordeon, FAQPage JSON-LD i prerender czytają te same obiekty; 8 pytań landingu, 4 per narzędzie | [rules/copy-faq-single-source.md](rules/copy-faq-single-source.md) |
| 10.6 | `copy-honest-time-claims` | HIGH | Obietnica czasu: „pierwszy działający efekt w dni" + etykieta delivery per realizacja; integracje etapami; nigdy „wdrożenie w dni" globalnie | [rules/copy-honest-time-claims.md](rules/copy-honest-time-claims.md) |
| 10.7 | `copy-minimal-text` | HIGH | Minimum tekstu: hero lead ≤ 20 słów, nagłówek sekcji ≤ 6 słów, sekcja = 1 zdanie + dowód, karta = ikona + 2–6 słów + 1 linia | [rules/copy-minimal-text.md](rules/copy-minimal-text.md) |
| 10.8 | `copy-one-liner-single-source` | HIGH | Jedno zdanie marki z messaging.ts na każdej powierzchni: H1, pagesSeo.home, ORG_JSONLD, llms.txt, index.html, prompt bota, nagłówki LinkedIn | [rules/copy-one-liner-single-source.md](rules/copy-one-liner-single-source.md) |
| 10.9 | `copy-persona-outcomes-section` | HIGH | Sekcja „Co osiągniesz" obowiązkowa na home: 4 efekty w języku persony (kontroler, CFO, właściciel), zero liczb, ikony lucide, 1 zdanie + 1 linia | [rules/copy-persona-outcomes-section.md](rules/copy-persona-outcomes-section.md) |
| 10.10 | `copy-voice-and-tone` | MEDIUM | Głos i ton: oznajmujące zdania, zero pytań retorycznych, zero „łatwo/prosto/szybko" bez liczby, zero AI-tells (summary transitions, spec-sheet voice, cold-open, personifikacja), strona czynna, druga osoba | [rules/copy-voice-and-tone.md](rules/copy-voice-and-tone.md) |
| 11.1 | `legal-no-scraped-personal-data-in-repo` | BLOCKER | Dane osobowe z researchu nie trafiają do repo strony, do narzędzi ani do modeli; w leadscout tylko minimum firmowe ze wskazaniem źródła | [rules/legal-no-scraped-personal-data-in-repo.md](rules/legal-no-scraped-personal-data-in-repo.md) |
| 11.2 | `legal-outreach-readiness` | BLOCKER | Outbound rusza dopiero po domkniętej checkliście OUTREACH_READY; publikacja strony to osobny, niższy próg | [rules/legal-outreach-readiness.md](rules/legal-outreach-readiness.md) |
| 11.3 | `legal-pke-consent-forms` | BLOCKER | Art. 398 PKE — uprzednia zgoda na informację handlową także wobec osób prawnych; zero domyślnie zaznaczonych zgód, newsletter tylko double opt-in | [rules/legal-pke-consent-forms.md](rules/legal-pke-consent-forms.md) |
| 11.4 | `legal-rodo-page-required` | BLOCKER | Trasa /rodo istnieje PRZED pierwszym kontaktem handlowym; katalog art. 14 RODO z KONKRETNYMI źródłami danych i prawem sprzeciwu wyróżnionym odrębnie | [rules/legal-rodo-page-required.md](rules/legal-rodo-page-required.md) |
| 11.5 | `legal-analytics-cookieless-or-consent` | HIGH | Pomiar tylko cookieless i bez identyfikatorów albo z uprzednią zgodą; zero GA4, pikseli i fingerprintingu, zawsze wpis w /rodo | [rules/legal-analytics-cookieless-or-consent.md](rules/legal-analytics-cookieless-or-consent.md) |
| 11.6 | `legal-privacy-before-embeds` | HIGH | Embed (Cal.com, mapa, wideo, widget) wolno włączyć dopiero po sekcji w /rodo, wpisie w rejestrze integracji i CSP w _headers | [rules/legal-privacy-before-embeds.md](rules/legal-privacy-before-embeds.md) |
| 11.7 | `legal-sources-for-market-numbers` | HIGH | Każda liczba rynkowa publikowana ze źródłem i rokiem w tym samym zdaniu lub przypisie; zakaz liczb bez osiągalnego źródła | [rules/legal-sources-for-market-numbers.md](rules/legal-sources-for-market-numbers.md) |
| 12.1 | `integ-no-external-scripts-on-site` | BLOCKER | Strona klarow.com nie ładuje niczego spoza własnej domeny bez decyzji, rejestru i /rodo | [rules/integ-no-external-scripts-on-site.md](rules/integ-no-external-scripts-on-site.md) |
| 12.2 | `integ-no-llm-api-in-client-tools` | BLOCKER | Zero chmury dostawcy — narzędzia dla klientów i dema nie wołają API modeli językowych ani serwerów Klarow | [rules/integ-no-llm-api-in-client-tools.md](rules/integ-no-llm-api-in-client-tools.md) |
| 12.3 | `integ-registry-required` | BLOCKER | Nowe połączenie zewnętrzne = wpis w rejestrze integracji PRZED kodem | [rules/integ-registry-required.md](rules/integ-registry-required.md) |
| 12.4 | `integ-telegram-anthropic-only-in-bots` | BLOCKER | Telegram Bot API i Anthropic API wyłącznie w botach wewnętrznych (post-bot/, leadscout/), nigdy w site/ | [rules/integ-telegram-anthropic-only-in-bots.md](rules/integ-telegram-anthropic-only-in-bots.md) |
| 12.5 | `integ-data-egress-review` | HIGH | Przegląd wyjścia danych: co wychodzi, dokąd, na jakiej podstawie — dane klientów nigdy do Higgsfield, Manus, LLM ani MCP | [rules/integ-data-egress-review.md](rules/integ-data-egress-review.md) |
| 12.6 | `integ-dependency-audit` | HIGH | Nowa zależność npm = uzasadnienie, rozmiar gzip, licencja, sprawdzenie sieci i wpis w rejestrze | [rules/integ-dependency-audit.md](rules/integ-dependency-audit.md) |
| 12.7 | `integ-embed-requires-privacy` | HIGH | Embed lub skrypt zewnętrzny (Cal.com, analityka) wymaga sekcji w /rodo, CSP w _headers i decyzji founderów | [rules/integ-embed-requires-privacy.md](rules/integ-embed-requires-privacy.md) |
| 12.8 | `integ-mcp-allowlist` | HIGH | Serwery MCP tylko z allowlisty — hostowany MCP to integracja z wpisem i decyzją | [rules/integ-mcp-allowlist.md](rules/integ-mcp-allowlist.md) |
| 13.1 | `secret-git-history-scan-before-public` | BLOCKER | Przed upublicznieniem repo, forkiem lub udostępnieniem kodu osobie trzeciej — skan całej historii gita pod kątem sekretów i danych | [rules/secret-git-history-scan-before-public.md](rules/secret-git-history-scan-before-public.md) |
| 13.2 | `secret-never-read-env` | BLOCKER | Agent nigdy nie czyta, nie cytuje i nie edytuje plików z sekretami (.env, credentials, klucze, .chat_id) — hook odmawia z powodem | [rules/secret-never-read-env.md](rules/secret-never-read-env.md) |
| 13.3 | `secret-no-secrets-in-prompts-or-logs` | BLOCKER | Zero sekretów i danych osób w promptach, wiadomościach między agentami, logach, raportach audytu i artefaktach | [rules/secret-no-secrets-in-prompts-or-logs.md](rules/secret-no-secrets-in-prompts-or-logs.md) |
| 13.4 | `secret-rotate-on-exposure` | BLOCKER | Każda ekspozycja sekretu = rotacja u dostawcy w 24 h, unieważnienie starego, wpis z datą (bez wartości) | [rules/secret-rotate-on-exposure.md](rules/secret-rotate-on-exposure.md) |
| 13.5 | `secret-secrets-outside-git` | BLOCKER | Sekrety żyją wyłącznie poza gitem — Cloudflare secrets, Menedżer poświadczeń Windows, lokalny .env w .gitignore | [rules/secret-secrets-outside-git.md](rules/secret-secrets-outside-git.md) |
| 14.1 | `demo-determinism` | BLOCKER | Silniki i dashboardy dem są deterministyczne: zero Date.now/new Date()/Math.random/performance.now/fetch/localStorage w lib/* i dashboards/*; „Dziś" = stała TODAY | [rules/demo-determinism.md](rules/demo-determinism.md) |
| 14.2 | `demo-golden-tests` | BLOCKER | Każdy silnik ma golden-test node --test: dwa przebiegi = identyczny JSON i zgodność z zamrożonym plikiem golden; zero wartościowych importów przez alias @/ w src/lib/**; nowy silnik bez testu = fail | [rules/demo-golden-tests.md](rules/demo-golden-tests.md) |
| 14.3 | `demo-events-outside-engines` | HIGH | Zdarzenia analityczne emitowane w komponentach akcji, nigdy w silnikach lib/* ani w useMemo liczącym wynik; bez danych użytkownika, bez cookies | [rules/demo-events-outside-engines.md](rules/demo-events-outside-engines.md) |
| 14.4 | `demo-labels` | HIGH | Każde demo jest oznaczone „Demo na danych przykładowych" (badge kitu .st) i zdaniem o determinizmie; dane, nazwy i kwoty są jawnie fikcyjne | [rules/demo-labels.md](rules/demo-labels.md) |
| 14.5 | `demo-money-integers` | HIGH | Kwoty liczone w groszach/centach jako liczby całkowite, formatowane jednym helperem fmtMoney (PLN 12 345,67 zł / USD $1,234,567.89), tabular-nums + nowrap | [rules/demo-money-integers.md](rules/demo-money-integers.md) |
| 14.6 | `demo-pdf-deterministic` | HIGH | PDF z dem jest deterministyczny (te same dane → identyczna definicja i bajty), 1 strona A4, stopka DEMO, polskie znaki, pobieranie zamiast okna druku, lazy pdfmake | [rules/demo-pdf-deterministic.md](rules/demo-pdf-deterministic.md) |

## 1. Marka i przekaz (nazwa poprzedniej firmy, złoto, wordmark, jeden akcent, etykiety dowodu, liczby, „AI") (`brand`)

Domyślny impact: **BLOCKER** · tryb: both · właściciel audytu: `brand-leak-auditor` (copy: `copy-auditor`, dist: `seo-auditor`)

### 1.1 brand-allowed-numbers-only

**Każda liczba publiczna ma źródło w references/allowed-numbers.md**

Impact: **BLOCKER** · Tagi: brand, copy, numbers, sources, pricing · Źródło: CLAUDE.md #3 / strategy.md §4.3–4.4 / portfolio.md §4, §6.2 / peer-legal.md §1.3 / synthesis P4 (allowedNumbers z polem source) / decyzja D-07 · Dodano: 2026-09-12 · Plik: `rules/brand-allowed-numbers-only.md`

#### Zasada

Każda liczba widoczna publicznie (HTML w `dist/`, `llms.txt`, meta, JSON-LD, OG, PDF do pobrania,
posty bota, szablony outboundu, one-pager) **jest wpisana** w `references/allowed-numbers.md`
i w `MESSAGING.allowedNumbers` (`{ value, pl, en, source }`). Liczby rynkowe niosą źródło w tym
samym zdaniu lub przypisie („Sedlak & Sedlak 2026", „Panko, University of Hawai'i"). Zero kwot za
usługi Klarow (PLN / USD / $ / „od … zł") gdziekolwiek publicznie; wycena = „po bezpłatnej
diagnozie". Zamrożony zestaw anonimowy z poprzedniej firmy zostaje tylko tam, gdzie już jest
(opisy podstron, FAQ), nie trafia na `/` i nie rośnie do umowy IP. Nowa liczba = decyzja
founderów + wpis do rejestru z datą i źródłem, nigdy „z pamięci".

#### Mechanizm awarii (dlaczego)

CFO poprosi o źródło. Jedna liczba bez pokrycia (np. „raport Deloitte/IDC o czasie traconym
w Excelu", której oryginału research nie znalazł) kosztuje wiarygodność wszystkich pozostałych.
Liczby przypisywalne poprzedniej firmie łamią zasadę #3 niezależnie od tego, czy padła nazwa.
Kwota publiczna zastępuje „wycenę po diagnozie" i kotwiczy negocjację (plan §1.4: cena ma być
wyższa dzięki „dniom, nie miesiącom"). taste §9.D: „NO fake-perfect numbers", KPI slop = trzy
identyczne kolumny statystyk bez źródła.

#### Niepoprawnie

```tsx
<Stat value="99%" label="zadowolonych klientów" />
<p>Według raportu Deloitte pracownicy tracą 30% czasu w Excelu.</p>
<p>Pilot od 12 000 zł.</p>
<Stat value="163" label="testów importu roboczogodzin" />   // liczba poprzedniej firmy
```

#### Poprawnie

```ts
// messaging.ts
allowedNumbers: [
  { value: "12", pl: "dem liczy na żywo na tej stronie", en: "demos run live on this site", source: "tools.ts: 12 × kind demo" },
  { value: "88%", pl: "arkuszy zawiera błędy w formułach", en: "of spreadsheets contain formula errors", source: "Panko, University of Hawai'i, What We Know About Spreadsheet Errors" },
]
```

```tsx
<p>88% arkuszy kalkulacyjnych zawiera błędy w formułach (Panko, University of Hawai'i).</p>
<p>Wycena po bezpłatnej diagnozie. Stała cena za zamrożony zakres.</p>
```

#### Test

```bash
# kwoty za usługi: 0 trafień poza kotwicami FAQ z rejestru
grep -rnE "[0-9][0-9 .,]*\s?(zł|PLN|USD|tys\. zł)|\\$\s?[0-9]" site/src/data site/src/App.tsx site/src/pages site/src/prerender
# zakazane źródła i framing: 0 trafień
grep -rniE "deloitte|\bidc\b|oszczędz[a-z]* etat|nie zatrudniaj" site/src leadscout/*.md post-bot/*.js
# inwentarz liczb w buildzie do porównania z rejestrem (ręcznie / audit-static.mjs --numbers)
grep -rhoE "[0-9][0-9 .,]*[0-9](\s?%|\s?tys\.|\s?dni|\s?godz)?" site/dist/*.html site/dist/narzedzia/*.html | sort -u
```

#### Wyjątki

Liczby w danych DEMO wewnątrz dashboardów (fikcyjne, deterministyczne, oznaczone „Demo na danych
przykładowych"), daty i rok w stopce, NAP (`786 296 426`), zakres ICP „20–250 osób", numery artykułów
na `/rodo`, liczby w kodzie i metadanych technicznych (`width`, `height`, wersje pakietów).

### 1.2 brand-honest-labels

**Etykiety dowodu (Demo / Własny produkt / Wdrożone) tylko z pokryciem**

Impact: **BLOCKER** · Tagi: brand, proof, labels, tools, portfolio · Źródło: synthesis §2.1 proofLabels, §1.7 p.14 / portfolio.md §5 D3, D12 / brand-icp.md §8 / decyzja D-10 (KSeF = Własny produkt) · Dodano: 2026-09-12 · Plik: `rules/brand-honest-labels.md`

#### Zasada

Każda karta i podstrona w `/narzedzia` ma **dokładnie jedną** etykietę dowodu z
`MESSAGING.proofLabels` odpowiadającą polu `kind` w `tools.ts` (`"demo" | "product" | "case"`)
oraz etykietę czasu `delivery` („pilot 5–10 dni" / „etapami"):

| `kind` | Etykieta PL / EN | Warunek użycia |
|---|---|---|
| `demo` | „Demo na danych przykładowych" / „Demo on sample data" | dashboard działa na żywo, dane fikcyjne, deterministyczne |
| `product` | „Własny produkt" / „Own product" | kod i testy są własnością founderów; brak klienta nie przeszkadza |
| `case` | „Wdrożone w firmie produkcyjno-budowlanej" / „Deployed at a manufacturing & construction company" | wpis w `docs/DECISIONS.md` z datą zgody (umowa IP) **albo** udokumentowany żywy przebieg u klienta Klarow |

Zakazane: „WDROŻONE" bez pokrycia, „Wdrożone u klienta" dla własnego produktu, liczba mnoga
„u klientów" / „klienci" / „our clients" do czasu drugiego płacącego klienta Klarow, „Gotowe" bez
dopowiedzenia (dozwolone: „Gotowe do wdrożenia" przy `product`). KSeF = `product` do pierwszego
klienta lub żywego przebiegu na `api-demo.ksef.mf.gov.pl` (D-10). Etykiety nie są hard-kodowane
w komponentach; jedno źródło = `messaging.ts`.

**Etykiety podmiotu, nie tylko dowodu (rozszerzenie 2026-09-12: brak zarejestrowanej działalności).** Do czasu rejestracji zakazane są w copy publicznym: „nasza firma", „nasza spółka", „nasz zespół", „nasi eksperci", „nasze biuro", „od X lat na rynku", „lata doświadczenia" (EN: „our company", „our team", „years of experience"), a w danych strukturalnych pola `legalName`, `vatID`, `taxID`, `duns`, `address`, `foundingDate`, `numberOfEmployees`. Zakazane też „wystawiamy fakturę VAT" i „faktura z odroczonym terminem". Dozwolone: „KLAROW", „dwie osoby", „budujemy", `founder` w JSON-LD po D6, oraz opis modelu rozliczenia („stała cena za ustalony zakres", „płatność 50/50"), bo opisuje treść przyszłej umowy, a nie stan dzisiejszy; towarzyszy mu zdanie **„Cenę i zakres zapisujemy w umowie przed startem."** / „We put the price and scope in a contract before we start." Nazwa marki w stopce i w JSON-LD zostaje; nie dopisujemy do niej formy prawnej.

**Lista fraz zakazanych przy pozycjach w `/narzedzia`** (uzupełnienie testu, nie zmiana zasady): „WDROŻONE", „Wdrożone u klienta", „Realizacja u klienta", „u klientów", „nasi klienci", „zaufali nam", „referencje", „case study", „sprawdzone w boju", „produkcyjnie od lat", „Gotowe" bez dopowiedzenia (dozwolone „Gotowe do wdrożenia" przy `product`), „gwarantujemy oszczędność", „zwrot w X miesięcy", „oszczędzisz etat", „nie musisz zatrudniać"; EN: „DEPLOYED", „deployed at a client", „our clients", „trusted by", „customers include", „battle-tested", „in production for years", „guaranteed savings", „ROI in X months", „cut headcount". Zakazana też nazwa własna i domena produktu KSeF (decyzja o odbrandowaniu z 2026-07-27).

#### Mechanizm awarii (dlaczego)

Pierwsza rozmowa z CFO zaczyna się od „u kogo to wdrożyliście?". Etykieta „WDROŻONE" przy produkcie
bez klienta (dziś KSeF: `ToolsGrid.tsx:38`, `ToolPage.tsx:46`) wysadza wiarygodność wszystkich
pozostałych 12 kart. Liczba mnoga „klienci" przy zerze płatnych klientów to to samo w innej formie.
Odwrotnie: uczciwe „Własny produkt" + „Demo na danych przykładowych" jest spójne z „kalkulator,
nie wróżka" i z zakazem publikowania dowodów poprzedniej firmy przed umową IP.

#### Niepoprawnie

```tsx
// ToolPage.tsx
const LABELS = { deployed: "WDROŻONE — realizacja u klienta" };
<span className="st st-blue">{LABELS.deployed}</span>   // KSeF, kind: "case", zero klientów
<p>Narzędzia wdrożone u klientów w Polsce i USA.</p>
```

#### Poprawnie

```ts
// tools.ts
{ slug: "kontroling-ksef", kind: "product", delivery: { pl: "etapami", en: "in stages" }, … }
```

```tsx
// ToolCard.tsx
const label = MESSAGING.proofLabels[tool.kind];
<span className={tool.kind === "demo" ? "st" : "st st-accent"}>{pick(label, lang)}</span>
<span className="st">{pick(tool.delivery, lang)}</span>
```

#### Test

```bash
# hard-kodowane etykiety poza messaging.ts: 0 trafień
grep -rniE "WDROŻONE|Wdrożone u klient|realizacja u klienta|deployed at (a )?client" site/src --include=*.tsx --include=*.ts | grep -v "data/messaging.ts"
# liczba mnoga klientów: 0 trafień (do 2. klienta)
grep -rniE "u klientów|nasi klienci|naszych klientów|our clients|customers include" site/src site/public/llms.txt 2>/dev/null
# etykiety podmiotu przed rejestracją działalności: 0 trafień
grep -rniE "nasza firma|nasza spółka|nasz zespół|nasi eksperci|od [0-9]+ lat|lata doświadczenia|our company|our team|years of experience" site/src site/dist
grep -rniE "\"(legalName|vatID|taxID|duns|foundingDate|numberOfEmployees)\"" site/src/components/Seo.tsx site/dist
grep -rniE "wystawiamy fakturę|faktura VAT" site/src site/dist
# frazy bez pokrycia przy pozycjach w /narzedzia: 0 trafień
grep -rniE "case study|sprawdzone w boju|battle-tested|trusted by|zaufali nam|produkcyjnie od lat|gwarantujemy oszczędność|zwrot w [0-9]+ miesi|oszczędzisz etat|nie musisz zatrudniać|cut headcount" site/src site/dist
# każdy kind: "case" ma wpis w DECISIONS.md
grep -n 'kind: "case"' site/src/data/tools.ts; grep -niE "zgoda|umowa IP" docs/DECISIONS.md
```

#### Wyjątki

Zamrożona fraza „klienci w USA" w istniejących opisach podstron (D-07 b) dotyczy poprzedniej firmy,
nie Klarow; zostaje tylko tam, gdzie już jest, do umowy IP. Nowych użyć nie dodajemy.

### 1.3 brand-no-ai-word-in-sales

**Zero słowa „AI" i nazw dostawców modeli w komunikacji sprzedażowej**

Impact: **BLOCKER** · Tagi: brand, copy, ai, sales, icp · Źródło: peer-legal.md §1.3 (zasady marki) / strategy.md B11 / plan-strategiczny §2.2 (persona boi się chmury i halucynacji) / synthesis §1.6 (odrzucone „Claude Code" w copy) / decyzja D-04 · Dodano: 2026-09-12 · Plik: `rules/brand-no-ai-word-in-sales.md`

#### Zasada

W powierzchniach sprzedażowych **nie występuje** słowo „AI", „sztuczna inteligencja",
„artificial intelligence", „LLM", „GPT", „model językowy" ani nazwa dostawcy (Anthropic, Claude,
Claude Code, OpenAI, ChatGPT, Gemini, Copilot). Powierzchnie sprzedażowe: H1 i lead, karty i hooki
narzędzi, CTA, `/oferta`, pasek liczb, sekcja „Co osiągniesz", meta / JSON-LD / `llms.txt`,
PDF one-pager, szablony outboundu (`leadscout/playbook-outbound.md`), posty bota `/post`,
nagłówki LinkedIn. AI nigdy nie jest obietnicą ani elementem liczenia i nie pojawia się nawet
w zaprzeczeniu: zdanie o determinizmie mówi, CO liczy, a nie czego nie ma. Kanoniczne brzmienie
`MESSAGING.determinism` (jedno źródło, `src/data/messaging.ts`):

> **„Twoje liczby liczy zwykły, deterministyczny kod. Te same dane dają ten sam wynik."**
> EN: „Your numbers are computed by plain, deterministic code. Same data, same result."

To zdanie obowiązuje wszędzie, gdzie dziś pada wyróżnik „kalkulator, nie wróżka": sekcja S7,
stopka panelu dema (`demo-labels`), `llms.txt`, PDF, outbound. Wcześniejszy wariant
„AI pomaga nam budować narzędzie, nigdy nie liczy Twoich liczb" jest WYCOFANY (łamał tę regułę).
Bullet „opcjonalny asystent AI" w opisie KSeF (`tools.ts`) do usunięcia (D-04).

#### Mechanizm awarii (dlaczego)

Persona (CFO / kontroler firmy produkcyjnej) boi się dwóch rzeczy: danych w chmurze i liczb
z halucynacji. Słowo „AI" uruchamia obie obawy naraz i kasuje różnicę wobec konkurenta
grającego AI-hype. Nazwa dostawcy w copy sugeruje, że dane klienta trafiają do tego dostawcy,
co przeczy „zero chmury dostawcy". Outbound po PKE musi być spójny ze stroną: jeśli mail nie mówi
o AI, strona też nie może.

#### Niepoprawnie

```ts
// tools.ts (KSeF)
bullets: { pl: ["…", "Opcjonalny asystent AI podsumowuje faktury"] }
// messaging.ts — wycofane brzmienie: „AI" w copy sprzedażowym, choćby w zaprzeczeniu
determinism: { pl: "Te same dane dają ten sam wynik. AI pomaga nam budować narzędzie, nigdy nie liczy Twoich liczb." }
// founders.ts
{ pl: "Budujemy z Claude Code, ale liczy zwykły kod." }
```

#### Poprawnie

```ts
// messaging.ts — jedno źródło zdania o determinizmie
determinism: {
  pl: "Twoje liczby liczy zwykły, deterministyczny kod. Te same dane dają ten sam wynik.",
  en: "Your numbers are computed by plain, deterministic code. Same data, same result.",
}
founders: { pl: "Rozmawiasz z osobą, która narzędzie zbudowała. Kod, dokumentacja i runbook zostają u Ciebie." }
```

#### Test

```bash
# powierzchnie sprzedażowe: 0 trafień (jedyny wyjątek: odpowiedź FAQ „Czy AI liczy moje dane?", patrz Wyjątki)
grep -n "determinism" site/src/data/messaging.ts | grep -iw "AI"     # 0: zdanie o determinizmie bez słowa „AI"
grep -rniwE "AI|A\.I\.|sztuczn(a|ej|ą) inteligencj[a-z]*|artificial intelligence|LLM|GPT|model(u|e|em)? językow[a-z]*|Claude( Code)?|Anthropic|OpenAI|ChatGPT|Gemini|Copilot" site/src/data site/src/App.tsx site/src/pages site/src/components site/src/prerender leadscout/playbook-outbound.md
grep -rniwE "AI|sztuczn(a|ej) inteligencj[a-z]*" site/dist/llms.txt site/dist/index.html site/dist/oferta.html
```

Prompt bota (`post-bot/worker.js`) i szablony LinkedIn: przegląd ręczny przy każdej zmianie
`messaging.ts` (reguła synchronizacji jednego zdania).

#### Wyjątki

1. **Jedyny wyjątek w copy sprzedażowym: jedna odpowiedź w `faq.ts`** na pytanie zadane wprost
   przez klienta, pytanie „Czy AI liczy moje dane?", i tylko po to, żeby ZAPRZECZYĆ:
   „Nie. Twoje liczby liczy zwykły, deterministyczny kod: te same dane dają ten sam wynik,
   a ścieżkę wyliczenia widzisz w narzędziu. Żaden model językowy nie dostaje Twoich danych."
   Słowo „AI" wolno powtórzyć wyłącznie w treści pytania; odpowiedź nie tłumaczy, do czego
   zespół używa AI (to nie jest argument sprzedażowy). Ani `MESSAGING.determinism`, ani żadna
   inna odpowiedź FAQ, ani para ✕/✓ w S7 nie używają tego słowa.
2. Strona `/rodo` może wymieniać dostawców, jeśli faktycznie przetwarzają dane (dziś: nie).
3. Dokumenty wewnętrzne (`CLAUDE.md`, `docs/`, `.claude/`) bez ograniczeń.

### 1.4 brand-no-gold

**Zero złota #FFA914 i jego śladów w publicznym kodzie**

Impact: **BLOCKER** · Tagi: brand, color, css, svg, legacy · Źródło: CLAUDE.md #1 / rebrand 2026-07-21 (stal zamiast złota) / ui-kit-habits.md §3 R3 · Dodano: 2026-09-12 · Plik: `rules/brand-no-gold.md`

#### Zasada

Złoto `#FFA914` (oraz jego zapisy: `#ffa914`, `rgb(255, 169, 20)`, `rgba(255,169,20,…)`,
`hsl(41 100% 55%)`) i słowa `gold` / „złoty" jako nazwa koloru, klasy, tokenu, parametru
(`gold=true`), komentarza albo nazwy pliku **nie istnieją** w `site/**`, `demo/**`,
`ui-kit/skills/company-ui/assets/**`, `public/**`, `dist/**`, SVG, PDF ani w assetach graficznych.
Jedyny akcent marki to stal `#A8B4C2` przez token `--accent` (patrz `brand-single-accent-steel`).

#### Mechanizm awarii (dlaczego)

Złoto było akcentem poprzedniej marki. Każdy ślad (nawet komentarz `/* gold ring */` w CSS)
to (a) sygnał pochodzenia kodu, sprzeczny z `brand-no-nuconic`, (b) pułapka dla agentów, którzy
kopiują „istniejący wzorzec" i przywracają stary kolor w nowym komponencie, (c) drugi akcent
na stronie, czyli złamany Color Consistency Lock (taste §4.2). Kit miał 3 takie komentarze
(`app.css:800, 819, 850`) i makro `stat_card(gold=…)`; to dokładnie ta droga dryfu.

#### Niepoprawnie

```css
/* app.css */
.stat-ico.gold { color: #FFA914; }           /* gold active */
.btn-primary  { background: linear-gradient(180deg, #ffd27a, #ffa914); }
```

```tsx
<Sparkline stroke="#FFA914" />
<StatCard gold />
```

#### Poprawnie

```css
.stat-ico.accent { color: var(--accent); background: var(--accent-a12); }
.btn-primary { background: var(--cta); color: var(--on-cta); }
```

```tsx
<Sparkline stroke="var(--accent)" />
<StatCard tone="accent" />
```

#### Test

```bash
# 0 trafień = PASS (kod źródłowy, kit, build)
grep -rniE "#ffa914|255,\s*169,\s*20|\bgold\b|złot(y|a|e|ego|ej)\b" site/src site/public site/index.html demo ui-kit/skills/company-ui/assets
grep -rliE "#ffa914|\bgold\b" site/dist
```

Skrypt `audit-static.mjs` zgłasza `[brand-no-gold]` jako BLOCKER. Nowa paleta może wejść wyłącznie
jako prymityw w `site/src/styles/tokens.css` z komentarzem decyzji (`docs/DECISIONS.md`).

#### Wyjątki

Brak. Komentarze historyczne też usuwamy (historia jest w gicie i w `docs/DECISIONS.md`).

### 1.5 brand-no-nuconic

**Zero nazwy poprzedniej firmy w czymkolwiek publicznym**

Impact: **BLOCKER** · Tagi: brand, legal, ip, dist, assets · Źródło: CLAUDE.md #3 / plan-strategiczny §5.2 / decyzja founderów 2026-07-22 („dowód bez marki poprzedniej firmy") · Dodano: 2026-09-12 · Plik: `rules/brand-no-nuconic.md`

#### Zasada

Nazwa poprzedniej firmy (wzorzec `nuconic`, bez względu na wielkość liter), jej domeny, logo,
nazwiska pracowników, realne zrzuty ekranów i liczby dające się jej przypisać **nie pojawiają się
w niczym publicznym**: `site/**`, `demo/**`, `ui-kit/skills/company-ui/assets/**`, `public/**`,
`dist/**`, nazwy i metadane plików graficznych (EXIF/XMP), komunikaty commitów dotykające tych
katalogów, prompty do generatorów obrazów/wideo, posty bota `/post`, szablony outboundu.
Case opisujemy wyłącznie jako **„firma produkcyjno-budowlana"** (opcjonalnie „działająca w Polsce
i USA"). Prefiksy `nc-` / `Nc*` w publicznym kodzie (inicjały marki) liczą się jak nazwa.

#### Mechanizm awarii (dlaczego)

Umowa IP z poprzednią firmą nie jest podpisana (plan §5.2: „PRZED startem sprzedaży"). Publikacja
nazwy, zrzutu albo liczby to naruszenie warunku, na którym stoi cały dowód Klarow, plus ryzyko
prawne (tajemnica przedsiębiorstwa) i wizerunkowe u pierwszego klienta, który wpisze nazwę
w Google. Wyszukiwarka indeksuje także `alt`, `title`, meta, JSON-LD, `llms.txt` i tekst w PDF;
obrazy z generatorów i Photoshopa niosą metadane z promptu albo nazwy projektu.

#### Niepoprawnie

```tsx
// site/src/App.tsx (pasek liczb)
<p>Wdrożone w Nuconic: ~30 inwestycji, 163 testy importu roboczogodzin.</p>
<img src="/screens/nuconic-budget-tracking.png" alt="Budget Tracking w Nuconic" />
<div className="nc-tab-swap">…</div>
```

```text
git commit -m "Zrzuty z Nuconic na podstronę raportu"
```

#### Poprawnie

```tsx
// etykieta dowodu z messaging.ts, opis anonimowy, zrzut własnego dema
<p>{pick(MESSAGING.proofLabels.case, lang)}</p>
{/* „Wdrożone w firmie produkcyjno-budowlanej" */}
<img src="/media/tools/raport-zarzadczy.webp" alt="Raport zarządczy: 3 KPI i wykres koszt vs postęp" width={1280} height={800} />
<div className="tab-swap">…</div>
```

```text
git commit -m "Zrzuty dem na podstronę raportu zarządczego"
```

#### Test

```bash
# źródła publiczne (0 trafień = PASS)
grep -rniE "nuconic|\bnc-[a-z]|\bNc[A-Z][a-zA-Z]+" site/src site/public site/index.html site/scripts demo ui-kit/skills/company-ui/assets
# build (po `cd site && npm run build`)
grep -rli "nuconic" site/dist
# commit przed wysłaniem
git diff --cached | grep -i "nuconic"
# assety binarne (metadane): 0 trafień
grep -a -il "nuconic" site/public/media/* site/public/*.png site/public/*.ico 2>/dev/null
```

Skrypt: `node .claude/skills/klarow-guardian/scripts/audit-static.mjs` zgłasza `[brand-no-nuconic]`
jako BLOCKER dla każdego trafienia w `site/`, `demo/`, `public/`, `dist/`.

#### Wyjątki

Pliki wewnętrzne (`CLAUDE.md`, `docs/**`, `ui-kit/README.md`, `.claude/**`, `leadscout/**` poza
szablonami wysyłanymi na zewnątrz) mogą zawierać nazwę jako kontekst decyzji **dopóki repo
`przeczkowskyy/Pawel_Karol_proj` jest prywatne** (status do potwierdzenia przez Pawła; jeśli repo
jest publiczne, `docs/` przechodzi do osobnego prywatnego repo). Po podpisaniu umowy IP zakres
publikowalny ustala `docs/DECISIONS.md` (wpis z datą i zakresem zgody), a nie ta reguła.

### 1.6 brand-single-accent-steel

**Jeden akcent (stal #A8B4C2); semantyka statusów tylko w narzędziach**

Impact: **BLOCKER** · Tagi: brand, color, accent, chips, charts, tokens · Źródło: CLAUDE.md #1 / taste §4.2 Color Consistency Lock / company-ui §2 (dyscyplina akcentu) / synthesis §2.1, §2.5.1 · Dodano: 2026-09-12 · Plik: `rules/brand-single-accent-steel.md`

#### Zasada

Na stronie marketingowej (`data-surface="marketing"`) istnieje **jeden akcent**: stal `#A8B4C2`
dostępna wyłącznie jako token `--accent` (+ `--accent-strong`, `--accent-deep`, tinty
`--accent-a8…a45`). Chipy: tylko `.st` (neutralny) i `.st-accent`. Serie wykresów: monochrom stali
(`--chart-1..3`). Kolory semantyczne `--ok / --warn / --bad / --info` (zieleń, bursztyn, cegła,
niebieski) i klasy `.st-green / .st-brick / .st-blue / .st-violet` **wolno używać tylko wewnątrz
dashboardów** (`components/dashboards/**`, `DemoReport.tsx`, `data-surface="tool"`) i tylko jako
status, walidację albo marker danych; nigdy jako dekorację ani „drugi kolor sekcji".
Biały płaski CTA (`--cta #FAFAFA` / `--on-cta`) jest neutralem, nie drugim akcentem. Czysta biel
`#FFFFFF` wyłącznie jako `--cta-hover`; czysta czerń `#000000` nigdzie.

#### Mechanizm awarii (dlaczego)

taste §4.2: „Once an accent color is chosen for a page, it is used on the WHOLE page. A warm-grey site
does not suddenly get a blue CTA in section 7." Badge `st-blue` „WDROŻONE" na hubie i podstronie KSeF
to dziś formalnie drugi akcent na trasie marketingowej (raport taste §3.1). Kit rozdziela warstwę
semantyczną (statusy) od akcentu, bo daltonizm i druk mono wymagają, żeby zieleń zawsze znaczyła
„sukces", a nigdy „ładny kafel". Stal ma 8,9:1 na `#121212`, ale 2,11:1 na bieli: dlatego w motywie
light akcentem tekstu jest `--steel-700` (`#42526E`) i to też rozstrzyga token, nie komponent.

#### Niepoprawnie

```tsx
// ToolsGrid.tsx / ToolPage.tsx (trasa marketingowa)
<span className="st st-blue">WDROŻONE</span>
<section className="bg-blue-500/10">…</section>
<h2 style={{ color: "#93c5fd" }}>Kontroling na danych z KSeF</h2>
```

#### Poprawnie

```tsx
// marketing: neutral + stal
<span className="st st-accent">{pick(MESSAGING.proofLabels.product, lang)}</span>
<span className="st">{pick(dept.label, lang)}</span>

// dashboard (tryb tool): semantyka statusu = kolor + ikona + tekst
<Status kind="bad" icon={TriangleAlert}>{pick(t.status.error, lang)}</Status>
```

#### Test

```bash
# klasy semantyczne poza dashboardami: 0 trafień
grep -rnE "st-(blue|green|brick|violet)" site/src --include=*.tsx | grep -vE "components/dashboards/|DemoReport\.tsx"
# tokeny semantyczne poza dashboardami/kitem: 0 trafień
grep -rnE "var\(--(ok|warn|bad|info|funded|rejected|destructive)[a-z-]*\)" site/src --include=*.tsx --include=*.css | grep -vE "components/dashboards/|DemoReport\.tsx|styles/"
# czysta biel/czerń poza tokenem --cta-hover: 0 trafień
grep -rnE "#(000000|000|ffffff|fff)\b" site/src | grep -v "cta-hover"
```

#### Wyjątki

Etykiety dowodu (`demo` / `product` / `case`) różnią się obrysem i wypełnieniem chipa stalowego,
nie kolorem. Kolor semantyczny na stronie marketingowej dopuszczalny tylko w osadzonym dashboardzie
(mini-macierz OK/UWAGA/BŁĄD w komórce bento S2 jest fragmentem silnika `qualityGate.ts`, więc
liczy się jako tryb `tool`).

### 1.7 brand-wordmark-only

**Znak marki to tekstowy wordmark KLAROW, płaski, bez logo graficznego**

Impact: **BLOCKER** · Tagi: brand, wordmark, logo, navbar, hero · Źródło: CLAUDE.md #1 / synthesis §2.2 (nawigacja) / taste §11.F (wordmark never changes silently) · Dodano: 2026-09-12 · Plik: `rules/brand-wordmark-only.md`

#### Zasada

Znak marki na stronie i w narzędziach to **tekst `KLAROW`** renderowany klasą `.brand-word`
(komponent `BrandMark` z kitu), w jednym płaskim kolorze z tokenów (`--accent` albo
`--foreground-strong`), z `translate="no"`. Zakazane: logo graficzne w layoucie strony (SVG/PNG „K",
sygnet, ikona obok tekstu), gradient w tekście (`background-clip: text`), efekty (glow, cień,
obrys), duplikat wordmarku w hero (jest w nawigacji), zmiana litery/kroju/trackingu per sekcja.
Grafika „K" istnieje wyłącznie jako favicon, `apple-touch-icon` i `og:image` w `public/`.

#### Mechanizm awarii (dlaczego)

Decyzja marki: brak logo graficznego, znak = słowo. Każde logo w treści strony to (a) nowy
asset do utrzymania w 19 prerenderach, PDF, OG i postach, (b) wejście w estetykę „startup
z sygnetem", którą ICP czyta jako SaaS, (c) w PDF i prerenderze wymaga osadzenia binarium
(`pdfmake` vfs), czyli wzrostu lazy-chunku. Gradient w tekście (`background-clip: text`) był
metaliczną estetyką kitu 2019–2022, kosztuje warstwę kompozytora na iOS i rozjeżdża się
z płaskim białym CTA. Duplikat wordmarku w hero to jeden z 6 elementów, przez które hero
łamie limit 4 (taste §4.7).

#### Niepoprawnie

```tsx
// hero: duplikat wordmarku + logo graficzne + gradient w tekście
<img src="/logo-k.svg" alt="Klarow" className="h-8" />
<span className="brand-word" style={{ backgroundImage: "linear-gradient(#c8d2dd,#8895a6)", WebkitBackgroundClip: "text" }}>KLAROW</span>
<h1>…</h1>
```

#### Poprawnie

```tsx
// Navbar.tsx (jedyne miejsce w viewport hero) + stopka
<Link to="/" aria-label="KLAROW, strona główna">
  <BrandMark />   {/* <span className="brand-word" translate="no">KLAROW</span> */}
</Link>
```

```css
.brand-word { font-weight: 800; letter-spacing: .14em; text-transform: uppercase; color: var(--accent); }
```

#### Test

```bash
# gradient w tekście: 0 trafień
grep -rnE "background-clip:\s*text|WebkitBackgroundClip|-webkit-background-clip" site/src ui-kit/skills/company-ui/assets
# logo graficzne w komponentach strony: 0 trafień (favicon/og tylko w index.html i Seo.tsx)
grep -rniE "<img[^>]+(logo|brand|sygnet)" site/src/components site/src/pages site/src/App.tsx site/src/prerender
# wordmark poza Navbar/Footer/BrandMark: 0 trafień
grep -rn "brand-word" site/src --include=*.tsx | grep -vE "Navbar|Footer|BrandMark"
```

#### Wyjątki

`index.html` (`<link rel="icon">`, `apple-touch-icon`) i `Seo.tsx`/`entry.tsx` (`og:image`,
`Organization.logo` w JSON-LD) odwołują się do plików graficznych „K" w `public/`. To metadane,
nie element layoutu.

## 2. Design locks i kit (tokeny, `@theme`, kształt, motyw, CTA, hero, eyebrow, karty, glass, ikony, statusy, overflow, sticky, kontrast, typografia, fill-mode, PDF, light) (`design`)

Domyślny impact: **MEDIUM** · tryb: marketing (kit: both) · właściciel audytu: `ui-auditor`

### 2.1 design-animation-fill-backwards

**Wejścia CSS z animation-fill-mode backwards; po animacji element nie zostaje z transform**

Impact: **HIGH** · Tagi: design, motion, css, fixed, containing-block, dialog · Źródło: company-ui §8 i app.css:150-161 (komentarz o `backwards`) / ui-kit-habits.md F1 (M1) / CSS Transforms Module (transform tworzy containing block dla fixed) / CLAUDE.md 2026-07-26 (fixed uwięziony) · Dodano: 2026-09-12 · Plik: `rules/design-animation-fill-backwards.md`

#### Zasada

Każda animacja wejścia w CSS (`riseIn`, kaskady `animation-delay`) używa
`animation-fill-mode: backwards` (skrót `animation: riseIn .35s var(--ease-out) backwards`),
**nigdy** `both` ani `forwards`. Po zakończeniu animacji element nie może zostać z żadnym
`transform`, `filter`, `will-change: transform`, `perspective` ani `contain: paint` na przodku
elementów `position: fixed` / natywnego `<dialog>` otwartego przez `showModal()` z rodzica
poza top layer. To samo dotyczy Motion: `m.*` z `initial={{ y: 12 }}` → `animate={{ y: 0 }}` kończy
z `transform: none` (Motion zdejmuje `transform` przy wartości identycznościowej); nie ustawiać
`style={{ transform }}` ręcznie po `onAnimationComplete`, nie zostawiać `will-change` na stałe.

#### Mechanizm awarii (dlaczego)

Wypełniony `transform` (fill-mode `forwards`/`both`) robi z elementu **containing block dla
`position: fixed`** (CSS Transforms §3): modal, tooltip albo navbar wewnątrz animowanej sekcji
pozycjonuje się względem tej sekcji i ląduje poza viewportem lub przewija się z treścią. Kit
trafił na to w Chromium (`app.css:152-154`: „modale wewnątrz .main lądowały poza viewportem")
i dlatego kaskada `.main > *` ma `backwards`. Ten sam mechanizm (kontekst stackingu +
`overflow: hidden`) stał za tygodniem „samego tła" na iOS. `will-change: transform` na stałe
ma identyczny skutek i dodatkowo trzyma warstwę kompozytora w pamięci.

#### Niepoprawnie

```css
.section { animation: riseIn .5s ease both; }            /* transform zostaje po animacji */
.card { will-change: transform; }                         /* na stałe */
.reveal-done { transform: translateY(0); }               /* „identyczność" nadal tworzy containing block */
```

```tsx
<m.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ transform: "translateZ(0)" }}>
  <dialog>…</dialog>   {/* dialog bez showModal() = w drzewie, dziedziczy containing block */}
</m.section>
```

#### Poprawnie

```css
@keyframes riseIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
.main > * { animation: riseIn .35s var(--ease-out) backwards; }
.main > *:nth-child(2) { animation-delay: .05s; }
@media (prefers-reduced-motion: reduce) { .main > * { animation: none; } }
```

```tsx
<m.section variants={fadeUp} initial="hidden" whileInView="show" viewport={VIEWPORT_ONCE}>…</m.section>
{/* BookingDialog: natywny <dialog> otwierany showModal() -> top layer, niezależny od transformów rodziców */}
```

#### Test

```bash
# fill-mode forwards/both w wejściach: 0 trafień
grep -rnE "animation(-fill-mode)?:[^;]*\b(forwards|both)\b" site/src ui-kit/skills/company-ui/assets --include=*.css
# will-change na stałe / transform w style po animacji: 0 trafień
grep -rnE "will-change|transform:\s*translateZ\(0\)|style=\{\{[^}]*transform" site/src --include=*.tsx --include=*.css | grep -vE "glsl-hills|hero-media"
# dialog przez showModal (top layer)
grep -rn "showModal()" site/src/components/BookingDialog.tsx
```

DevTools po zakończeniu wejścia sekcji: Computed → `transform: none` na sekcji; otwarty dialog ma
`position` liczone względem viewportu (Elements → Layout).

#### Wyjątki

Tło (`glsl-hills.tsx`, `.hero-media video`) może mieć stały `transform` / `will-change`, bo nie zawiera
elementów `fixed` ani dialogów. Hover `:active { transform: scale(.98) }` na przycisku jest przejściowy
i nie obejmuje potomków `fixed`.

### 2.2 design-contrast-aa

**Kontrast AA: tekst ≥ 4,5:1, elementy UI i obrysy ≥ 3:1, placeholder ≥ 4,5:1, tekst na wideo na najjaśniejszej klatce**

Impact: **HIGH** · Tagi: design, a11y, contrast, tokens, wcag · Źródło: WCAG 2.2 1.4.3 / 1.4.11 / taste §8.B (AA body, AAA hero) / ui-kit-habits.md §4.1 (placeholder 3,29:1, ikona empty 2,24:1, --input 1,5:1) / company-ui scrim rule / synthesis §2.5.2 (--foreground-faint ≥ 4,5:1) · Dodano: 2026-09-12 · Plik: `rules/design-contrast-aa.md`

#### Zasada

Każda para kolor tekstu / tło z tokenów spełnia **≥ 4,5:1** (tekst, w tym placeholder, etykiety
osi ≥ 12 px, tekst chipów na tincie), a **≥ 3:1** dla elementów UI: obrysy kontrolek
(`--border-strong` na `--surface`), ikony informacyjne, fokus-ring, linie wykresu niosące dane.
Nagłówki hero celują w AAA (≥ 7:1). Tekst nad wideo/obrazem: overlay-gradient lub scrim
`--scrim` i pomiar kontrastu na **najjaśniejszej klatce** posteru/pętli. Placeholder = `--foreground-faint`
(nie `--border`). Kontrast liczymy z wartości tokenów (formuła WCAG relative luminance), a wynik
dla wszystkich par jest tabelą w `references/`; nowa para = nowy wiersz z wynikiem.

#### Mechanizm awarii (dlaczego)

Kit nie przechodzi AA w kilku miejscach: placeholder `#6F6F73` na `#1F1F1F` = 3,29:1, ikona empty
state 2,24:1, obrys `--input` ≈ 1,5:1 wobec karty (WCAG 1.4.11 wymaga 3:1), `st-brick` na tincie
4,84:1 (najniżej, ledwo AA). Stal `#A8B4C2` ma 8,9:1 na `#121212`, ale 2,11:1 na bieli; to dlatego
motyw light ma inny akcent tekstu. Tekst na wideo mierzony na średniej klatce przechodzi, na
jasnej klatce pętli znika; stąd pomiar na najjaśniejszej. Lighthouse a11y ≥ 95 (DoD) nie zaliczy
strony z jednym placeholderem poniżej AA.

#### Niepoprawnie

```css
::placeholder { color: var(--border); }                       /* ~1,3:1 */
.input { border: 1px solid #404040; }                          /* 1,5:1 wobec --surface */
.hero-lead { color: var(--foreground-muted); }                 /* na jasnej klatce wideo < 3:1 */
.axis text { fill: #5B5B60; font-size: 9.5px; }
```

#### Poprawnie

```css
::placeholder { color: var(--foreground-faint); }              /* --gray-500 #8B8B90 ≥ 4,5:1 na --surface */
.input { border: 1px solid var(--border-strong); }             /* --gray-700 ≥ 3:1 */
.hero-media::after { background: linear-gradient(180deg, rgb(18 18 18 / .15), rgb(18 18 18 / .85)); }
.hero-lead { color: var(--foreground); }                       /* na overlayu ≥ 4,5:1 na najjaśniejszej klatce */
.axis text { fill: var(--chart-label); font-size: var(--text-xs); }
```

#### Test

```bash
# formuła WCAG dla par z tokens.css (przykład: stal na tle, placeholder na surface)
node -e '
const L=h=>{const c=h.replace("#","").match(/../g).map(x=>parseInt(x,16)/255).map(v=>v<=.03928?v/12.92:((v+.055)/1.055)**2.4);return .2126*c[0]+.7152*c[1]+.0722*c[2]};
const cr=(a,b)=>{const x=L(a),y=L(b);return ((Math.max(x,y)+.05)/(Math.min(x,y)+.05)).toFixed(2)};
for(const [n,f,b] of [["accent/bg","#A8B4C2","#121212"],["on-cta/cta","#121212","#FAFAFA"],["faint/surface","#8B8B90","#262626"],["border-strong/surface","#404040","#262626"],["muted/bg","#B4B4B9","#121212"]]) console.log(n,cr(f,b));'
# placeholder z tokenu faint
grep -rnE "::placeholder\s*\{[^}]*var\(--foreground-faint\)" site/src/styles/*.css
```

DevTools → Rendering → „Emulate vision deficiencies" i Lighthouse a11y ≥ 95 na `/`, `/narzedzia`,
jednej podstronie narzędzia i `/rodo`. Dla wideo: zrzut najjaśniejszej klatki (ffmpeg `thumbnail`)
i pomiar pary tekst/klatka narzędziem kontrastu.

#### Wyjątki

Linie siatki wykresu, hairline `--border` (1,33:1) i separatory strukturalne są dekoracją, nie
elementem UI niosącym informację (WCAG 1.4.11 ich nie obejmuje). Tekst `disabled` (`opacity: .5`)
jest zwolniony z AA (1.4.3 wyjątek), ale musi mieć `cursor: not-allowed` i `aria-disabled`.

### 2.3 design-hero-discipline

**Hero: maksymalnie 4 elementy tekstowe, H1 ≤ 2 linie, lead ≤ 20 słów, realny wizual**

Impact: **HIGH** · Tagi: design, hero, layout, copy, lcp · Źródło: taste §4.7 HERO STACK DISCIPLINE, §4.8 („Hero needs a real visual") / taste.md §5.3 (audyt hero: 6 elementów) / synthesis §2.3 S1 / imagegen §4 Absolute Hero Rules · Dodano: 2026-09-12 · Plik: `rules/design-hero-discipline.md`

#### Zasada

Hero (`/` i nagłówek każdej trasy marketingowej) zawiera **dokładnie te elementy i nic więcej**:
1. `<h1>` = `MESSAGING.oneLiner` (≤ 2 linie na 1024 px, ≤ 3 linie na 390 px, bez `<br>`,
   `max-width: 24ch`, `overflow-wrap: anywhere`), 2. lead `<p>` ≤ 20 słów i ≤ 4 linie
   (`MESSAGING.subtext`), 3. para CTA: 1 primary + 1 ghost, 4. media: realny wizual (poster
   `<img>` z `width/height` i `fetchpriority="high"`, opcjonalnie `<video>` po posterze) jako tło
   bloku hero (`.hero-media { position:absolute; inset:0 }`), nie w `.bg-layer`, nie `fixed`.
Zakazane w hero: eyebrow, duplikat wordmarku, chipy ikonowe / lista funkcji, telefon lub
tagline pod CTA, pasek zaufania / logotypy, wersja („v0.8", „BETA"), scroll cue, dekoracyjny pasek
tekstu, statystyki, widget dema, clip-reveal na treści obecnej w shellu. `padding-top` ≤ 6 rem na
desktopie; H1 `--text-display` `clamp(2.25rem, 5.2vw, 4.25rem)`; blok `min-height: min(86dvh, 820px)`.

#### Mechanizm awarii (dlaczego)

taste §4.7: „The hero is a single moment, not a feature list." Dzisiejsze hero ma 6 elementów
tekstowych (wordmark, H1 z `<br>`, lead, chipy, CTA, telefon) na tle GLSL bez zdjęcia, czyli
„Text + gradient blob is not a hero - it's a placeholder" (§4.8). Każdy element ponad limit spycha
CTA pod zgięcie na 390 px; `<br>` w H1 to Tell §9.F; brak posteru = LCP na tekście z późnym fontem.
Hero to jedyne miejsce, gdzie CFO decyduje w 10 s, czy czyta dalej (`strategy.md` §3.2).

#### Niepoprawnie

```tsx
<section className="flex-col items-center text-center">
  <span className="brand-word">KLAROW</span>
  <span className="lbl-sm">Automatyzacja dla MŚP</span>
  <h1>Narzędzia pod Twój proces.<br className="hidden md:block" />Działają w dni.</h1>
  <p>{lead}</p>
  <ul>{chips.map(c => <li><Icon/>{c}</li>)}</ul>
  <button className="btn btn-primary">Umów</button><button className="btn btn-primary">Demo</button>
  <a href="tel:+48786296426">786 296 426</a>
</section>
```

#### Poprawnie

```tsx
<section className="hero">
  <HeroMedia poster="/media/hero-v1.poster.webp" />                 {/* absolute, overflow hidden, overlay */}
  <div className="hero-copy">
    <h1>{pick(MESSAGING.oneLiner, lang)}</h1>
    <p className="hero-lead">{pick(MESSAGING.subtext, lang)}</p>    {/* 17 słów */}
    <div className="row">
      <button className="btn btn-primary" onClick={openBooking}>{pick(MESSAGING.cta.primary, lang)}</button>
      <Link className="btn btn-secondary" to="/narzedzia">{pick(MESSAGING.cta.secondary, lang)}</Link>
    </div>
  </div>
</section>
```

#### Test

```bash
# elementy zakazane w hero (Hero.tsx / sekcja hero w App.tsx): 0 trafień
grep -nE "lbl-sm|brand-word|<br|tel:|chips|st st|BETA|v0\.[0-9]|Scroll" site/src/components/Hero.tsx
# liczba słów leadu ≤ 20 (PL i EN)
node -e "const m=require('fs').readFileSync('site/src/data/messaging.ts','utf8');for(const l of ['pl','en']){const s=m.match(new RegExp('subtext[\\\\s\\\\S]*?'+l+':\\\\s*\"([^\"]+)\"'))[1];console.log(l,s.split(/\\s+/).length)}"
# poster w shellu prerenderu, brak <video>
grep -c "hero-v1.poster" site/dist/index.html; grep -c "<video" site/dist/index.html
```

Playwright 1440×900 i 390×844: H1 ≤ 2 / ≤ 3 linie (`getClientRects().length`), CTA widoczne bez
scrolla, `document.querySelectorAll('.hero p, .hero h1, .hero a, .hero button').length ≤ 4`.

#### Wyjątki

Podstrony narzędzi (`/narzedzia/:slug`) mają nagłówek dashboard-first: H1 + 1 zdanie + pasek
akcji dema; nie mają wideo (dashboard jest wizualem). `/rodo`, `/faq`, `404` = H1 + 1 zdanie, bez media.

### 2.4 design-no-glass-no-blur

**Zero glassmorphism, backdrop-filter, mask na hover, blur w wejściach, glow i gradientu w tekście**

Impact: **HIGH** · Tagi: design, gpu, hover, glass, blur, perf · Źródło: company-ui app.css:1-4 („No mask/backdrop-filter tricks: hover flicker on some GPUs") / taste §5 (glass „Inappropriate for boring B2B"), §9.A (NO neon/outer glows) / taste.md §11.2 / synthesis §2.5.4 · Dodano: 2026-09-12 · Plik: `rules/design-no-glass-no-blur.md`

#### Zasada

W `site/**` i kicie: zero `backdrop-filter`, zero `mask`/`-webkit-mask` w stanach `:hover`/`:focus`,
zero `filter: blur()` w wejściach i przejściach (Motion `filter` też), zero glow/neon
(`box-shadow: 0 0 Npx <kolor>`, `text-shadow` kolorowy), zero gradientu w tekście, zero
„double-bezel" (karta w karcie z wewnętrznym obrysem), zero cieni na stronie marketingowej
(`--shadow-*` kitu tylko w dialogu i menu). Nawigacja sticky ma tło **nieprzezroczyste**
(`--surface-overlay`), nie `backdrop-blur`. Czytelność nad tłem/wideo zapewnia scrim
(`--scrim rgb(18 18 18 / .72)`) albo overlay-gradient w kontenerze hero, nie rozmycie.

#### Mechanizm awarii (dlaczego)

Kit zdjął `mask`/`backdrop-filter` po realnym migotaniu hoverów na niektórych GPU (`app.css:1-4`).
`backdrop-filter` na sticky navie wymusza ponowne rozmycie każdej klatki scrolla nad wideo/canvasem
(mobile FPS). Blur w wejściach (`blur-md` → 0) to rasteryzacja warstwy per klatka i „mydło" w tekście
na Retinie. Glow i szkło to rejestr „dark tech / SaaS startup", którego ICP nie kupuje; taste §5:
glass „Inappropriate for dashboards, public-sector, or boring B2B". `high-end-visual-design`
(glass nav, `backdrop-blur-3xl`, blur entrances, double-bezel) jest w precedencji niżej i te sekcje
są wyłączone.

#### Niepoprawnie

```css
.nav { position: sticky; background: rgba(18,18,18,.6); backdrop-filter: blur(12px); }
.card:hover { -webkit-mask-image: linear-gradient(#000, transparent); box-shadow: 0 0 32px rgba(168,180,194,.45); }
.reveal-enter { filter: blur(8px); opacity: 0; }
```

```tsx
<m.div initial={{ opacity: 0, filter: "blur(8px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} />
```

#### Poprawnie

```css
.nav { position: sticky; top: 0; background: var(--surface-overlay); border-bottom: 1px solid var(--border); }
.card:hover { border-color: var(--accent); background: var(--surface-raised); transition: border-color var(--duration-fast) var(--ease-out), background var(--duration-fast) var(--ease-out); }
.hero-media::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, rgb(18 18 18 / .15), rgb(18 18 18 / .85)); }
```

```tsx
<m.div variants={fadeUp} />   {/* opacity + y 12 px, bez filter */}
```

#### Test

```bash
# 0 trafień = PASS
grep -rnE "backdrop-filter|backdrop-blur|-webkit-mask|mask-image|filter:\s*blur|blur\([0-9]|text-shadow:\s*0 0|box-shadow:\s*0 0 [0-9]" site/src ui-kit/skills/company-ui/assets --include=*.css --include=*.tsx
grep -rnE "filter:\s*\"blur|blur-(sm|md|lg|xl)\b" site/src --include=*.tsx
# cienie na trasach marketingowych: 0 trafień
grep -rnE "shadow-(sm|md|lg|xl|2xl)\b|var\(--shadow" site/src/pages site/src/App.tsx site/src/components --include=*.tsx | grep -vE "Dialog|Menu|dashboards/"
```

#### Wyjątki

Tło GLSL Hills (`glsl-hills.tsx`) i ewentualny canvas 2D low-res z JEDNYM `filter: blur()` na elemencie
canvas (kit P1) są dozwolone jako tło na desktopie; to nie jest hover ani wejście. `<dialog>` i menu
mobilne mogą mieć `--shadow-md` z tokenów.

### 2.5 design-one-cta-per-screen

**Jeden primary CTA na ekran (biały, płaski); jedna etykieta per intencja**

Impact: **HIGH** · Tagi: design, cta, conversion, buttons, copy · Źródło: company-ui §4 (1 primary na ekran) / taste §14 „No Duplicate CTA Intent", „CTA Button Wrap" / synthesis S3 (płaski biały CTA), §2.1 cta / ui-kit-habits.md §4.5 (słaba salience stali) · Dodano: 2026-09-12 · Plik: `rules/design-one-cta-per-screen.md`

#### Zasada

Na każdym ekranie (viewport / sekcja) jest **co najwyżej jeden** `.btn-primary`. Primary = płaska
biel na czerni: `background: var(--cta)` (`#FAFAFA`), `color: var(--on-cta)`, obrys 1 px,
hover = `--cta-hover` + obrys `--accent`, zero gradientu, zero glow, `:active { transform: scale(.98) }`.
Drugi przycisk w tej samej grupie to `.btn-secondary` (ghost). Etykiety są **jedno źródło per
intencja** (`MESSAGING.cta`): „Umów 30 minut" (rozmowa), „Zobacz realizacje" (dowód), „Przyślij
najgorszy Excel" (plik; tylko `/oferta` i podstrony narzędzi). Dwie etykiety o tej samej intencji
na jednej stronie („Umów rozmowę" + „Porozmawiajmy") = fail. Etykieta CTA nie zawija się na desktopie
(≤ 3 słowa PL / EN). Akcje destrukcyjne nigdy jako primary.

#### Mechanizm awarii (dlaczego)

Stal jest nisko-chromatyczna; stalowy CTA obok stalowych chipów i linków ginie (salience), więc
primary musi być jedynym jasnym prostokątem na ekranie, a nie jednym z trzech. Dwa primary na
ekranie dzielą uwagę; dwie etykiety tej samej intencji sugerują dwa różne kroki i obniżają
konwersję (taste §14). KPI strony to umówione rozmowy, nie kliknięcia w losowe przyciski
(`strategy.md` §7.2).

#### Niepoprawnie

```tsx
// hero: dwa primary + trzeci w sekcji poniżej z inną etykietą tej samej intencji
<button className="btn btn-primary">Umów rozmowę</button>
<button className="btn btn-primary">Zobacz demo</button>
…
<a className="btn btn-primary" href="mailto:…">Porozmawiajmy</a>
```

```css
.btn-primary { background: linear-gradient(180deg, #b9c4d1, #a8b4c2, #96a3b3); box-shadow: 0 0 24px rgba(168,180,194,.45); }
```

#### Poprawnie

```tsx
<button className="btn btn-primary" onClick={openBooking}>{pick(MESSAGING.cta.primary, lang)}</button>
<Link className="btn btn-secondary" to="/narzedzia">{pick(MESSAGING.cta.secondary, lang)}</Link>
```

```css
.btn-primary { background: var(--cta); color: var(--on-cta); border: 1px solid var(--cta); }
.btn-primary:hover { background: var(--cta-hover); border-color: var(--accent); }
.btn-primary:active { transform: scale(.98); }
```

#### Test

```bash
# liczba btn-primary per komponent sekcji (oczekiwane ≤ 1 na plik sekcji; Navbar = wyjątek)
grep -rc "btn-primary" site/src/components site/src/pages site/src/App.tsx | grep -vE ":0$|Navbar"
# etykiety CTA poza messaging.ts: 0 trafień
grep -rnE "Umów|Zobacz realizacje|Przyślij najgorszy|Book 30|See our work" site/src --include=*.tsx | grep -v "MESSAGING.cta"
# gradient/glow na przycisku: 0 trafień
grep -rnE "\.btn-primary[^{]*\{[^}]*(linear-gradient|box-shadow:\s*0 0)" site/src/styles/*.css
```

Playwright/DevTools 1440 px: przewiń stronę; na żadnej pozycji scrolla nie widać dwóch białych
przycisków poza parą (navbar + hero).

#### Wyjątki

Sticky navbar niesie ten sam primary („Umów 30 minut") co hero; w viewport hero widać wtedy dwa
identyczne przyciski tej samej etykiety i intencji. To jedyny dopuszczony duplikat (ta sama etykieta,
ten sam handler). W dashboardach (`tool`) primary = akcja główna panelu (np. „Przelicz"),
też jedna na panel.

### 2.6 design-overflow-rules

**Overflow: min-width 0 w gridach, kwoty nowrap, ellipsis na bloku, KPI clamp, zero scrolla poziomego**

Impact: **HIGH** · Tagi: design, overflow, layout, mobile, tables, numbers · Źródło: company-ui §13 (6 reguł overflow), §10 (tabele) / ui-kit-habits.md E1–E7, O1–O7 / WIG Safe Areas & Layout / CLAUDE.md „Responsive" (gutter ≥ 16 px, brak scrolla poziomego) · Dodano: 2026-09-12 · Plik: `rules/design-overflow-rules.md`

#### Zasada

1. Każde dziecko `grid`/`flex` z tekstem ma `min-width: 0` (`min-w-0`; kit: `.card > *`), inaczej
   długa kwota rozsadza kolumnę (grid blowout).
2. Kwoty, daty, numery telefonów i identyfikatory: `white-space: nowrap` (`.nowrap`) +
   `font-variant-numeric: tabular-nums` (`.tnum`); przy braku miejsca cały element idzie do nowej
   linii (`flex-wrap` na rodzicu), nigdy łamanie w środku liczby.
3. Ellipsis działa tylko na elemencie blokowym: `display: block | inline-block` +
   `overflow: hidden` + `white-space: nowrap` + `text-overflow: ellipsis`; na `inline-flex` nie działa.
4. Duże KPI skalują pismo (`font-size: clamp(1.25rem, 1.1vw + .8rem, 1.75rem)`) zamiast się zawijać.
5. `h1, h2 { overflow-wrap: anywhere }`; nagłówki z `text-wrap: balance`.
6. Tabele szersze niż kontener siedzą w wrapperze `overflow-x: auto` z `overscroll-behavior: contain`
   i `max-height`; na mobile `display: block`. Obrazy, wideo i aspect-boxy: `max-width: 100%`.
7. Strona **nigdy** nie przewija się poziomo: gutter ≥ 16 px na każdej szerokości
   (`--gutter clamp(16px, 4vw, 40px)`), żaden `min-width` szerszy niż ekran, `100vw` tylko z `overflow-x: clip`
   na rodzicu; layout mobilny zadeklarowany per sekcja (< 768 px = 1 kolumna).

#### Mechanizm awarii (dlaczego)

To najbardziej „bolesne" reguły kitu, każda z realnym incydentem: kwota `1 234 567,89 zł` łamana
w środku w komórce tabeli, karta KPI rozsadzająca grid na 1250 px, ellipsis, który „nie działa",
bo tytuł był `inline-flex`, macierz rozciągająca stronę poziomo na telefonie (kit §10, §13).
Obietnica produktu to „co do grosza"; kwota złamana w połowie to zaprzeczenie obietnicy
w warstwie UI. Scroll poziomy na 390 px oznacza ucięte CTA i jest pierwszym, co zobaczy Karol
na iPhonie.

#### Niepoprawnie

```tsx
<div className="grid grid-cols-3">
  <div><span className="text-2xl">1 234 567,89 zł</span></div>            {/* brak min-w-0, brak nowrap */}
</div>
<span className="inline-flex truncate">{longTitle}</span>                 {/* ellipsis nie zadziała */}
<table className="data-table">…</table>                                   {/* bez wrappera */}
<section style={{ width: "100vw" }}>…</section>                            {/* scroll poziomy przez scrollbar */}
```

#### Poprawnie

```tsx
<div className="grid grid-cols-3 [&>*]:min-w-0">
  <div className="stat"><span className="val tnum nowrap">1 234 567,89 zł</span></div>   {/* .val = clamp */}
</div>
<span className="block truncate">{longTitle}</span>
<div className="table-wrapper"><table className="data-table">…</table></div>
<section className="section">…</section>                                  {/* szerokość z kontenera + --gutter */}
```

```css
.table-wrapper { overflow: auto; max-height: 70vh; overscroll-behavior: contain; }
h1, h2 { overflow-wrap: anywhere; text-wrap: balance; }
```

#### Test

```bash
# kwoty bez nowrap (przegląd trafień): elementy z .tnum bez .nowrap
grep -rnE "className=\"[^\"]*\btnum\b[^\"]*\"" site/src --include=*.tsx | grep -v "nowrap"
# truncate na elemencie nieblokowym
grep -rnE "inline-flex[^\"]*truncate|truncate[^\"]*inline-flex" site/src --include=*.tsx
# tabela bez wrappera (przegląd)
grep -rnB2 "<table" site/src --include=*.tsx | grep -vE "table-wrapper|overflow"
# 100vw / min-width szersze niż ekran: 0 trafień
grep -rnE "100vw|min-width:\s*[4-9][0-9]{2,}px|min-w-\[[4-9][0-9]{2,}" site/src --include=*.tsx --include=*.css
```

Playwright 390×844 na każdej z 19 tras: `document.documentElement.scrollWidth <= window.innerWidth`.

#### Wyjątki

Tabele data-dense w dashboardach mogą przewijać się poziomo **wewnątrz własnego wrappera**
(akceptowany wzorzec kitu §14); strona jako całość nie. Kod i diagramy SVG w `overflow-x: auto`
własnego kontenera.

### 2.7 design-status-semantics

**Status = kolor + ikona + tekst z jednego słownika; nigdy sam kolor**

Impact: **HIGH** · Tagi: design, status, a11y, chips, tokens, tool · Źródło: company-ui §5 (chipy statusów), §2 (warstwa semantyczna) / ui-kit-habits.md D1, D2, D4 / WIG Accessibility / taste §9.F (zero dekoracyjnych kropek) · Dodano: 2026-09-12 · Plik: `rules/design-status-semantics.md`

#### Zasada

Stan (OK / UWAGA / BŁĄD / w obiegu / oczekuje / w toku) komunikowany jest **zawsze trójką**: kolor
semantyczny z tokenów (`--ok/--warn/--bad/--info/--neutral`, każdy z `--x-bg` tint 12–13 % i
`--x-border` 40 %), ikona lucide (Check / TriangleAlert / X / Clock / Send / Loader) i etykieta
tekstowa `{ pl, en }`. Mapa `status → { kind, icon, label }` jest **jedną funkcją per domena**
(`statusMeta.ts`), nigdy inline w 40 miejscach. Zakazane: kolor jako jedyny nośnik (kropka bez
tekstu, czerwona liczba bez ikony), akcent stalowy jako „sukces" lub „błąd", akcentowy
`border-left` („lewy pasek") jako status, dekoracyjne kropki przed pozycjami nawigacji/listy.
Kolory semantyczne występują tylko w trybie `tool` (patrz `brand-single-accent-steel`).

#### Mechanizm awarii (dlaczego)

Daltonizm (8 % mężczyzn) i druk mono kasują informację niesioną samym kolorem; WCAG 1.4.1.
Kit ma sześć semantyk i jeden słownik, bo w narzędziach on-prem status „ZAAKCEPTOWANE" musi
wyglądać identycznie w rejestrze umów, obiegu przelewów i protokołach; inline-warianty rozjeżdżają
się po dwóch tygodniach. Lewy pasek (`border-left: 3px solid`) to pozostałość Bootstrap-alertów,
sprzeczna z „linie tylko jako separatory strukturalne" (kit #9). taste §9.F: kolorowa kropka przed
każdym wierszem to Tell, dozwolona tylko dla realnego stanu i oszczędnie.

#### Niepoprawnie

```tsx
<td style={{ color: total < 0 ? "#f87171" : "#34d399" }}>{fmt(total)}</td>
<span className="dot dot-green" />                          {/* sam kolor */}
<div className="card" style={{ borderLeft: "3px solid var(--funded)" }}>…</div>
<span className="st st-accent">BŁĄD</span>                  {/* akcent jako status */}
```

#### Poprawnie

```ts
// statusMeta.ts (jedno źródło per domena)
export const PAYMENT_STATUS = {
  ok:      { kind: "ok",   icon: Check,         label: { pl: "Zaakceptowane", en: "Approved" } },
  warn:    { kind: "warn", icon: TriangleAlert, label: { pl: "Do wyjaśnienia", en: "Needs review" } },
  bad:     { kind: "bad",  icon: X,             label: { pl: "Odrzucone", en: "Rejected" } },
  pending: { kind: "info", icon: Clock,         label: { pl: "W obiegu", en: "In circulation" } },
} as const;
```

```tsx
<Status meta={PAYMENT_STATUS[row.status]} />
// renderuje: <span className="st st-{kind}"><Icon size={16} strokeWidth={1.75} aria-hidden />{pick(label, lang)}</span>
```

#### Test

```bash
# kolor warunkowy w inline style: 0 trafień
grep -rnE "style=\{\{[^}]*color:\s*[a-zA-Z_.]+\s*[<>=!?]" site/src --include=*.tsx
# lewy pasek jako status: 0 trafień (border-left tylko w separatorach strukturalnych)
grep -rnE "border-left:\s*[2-9]px|borderLeft:" site/src --include=*.tsx --include=*.css
# chipy statusów bez ikony (przegląd trafień)
grep -rnE "st st-(green|brick|blue|violet)\"[^>]*>[^<]" site/src --include=*.tsx
# słownik statusów: 1 plik per domena
ls site/src/components/dashboards/*statusMeta* site/src/lib/*status* 2>/dev/null
```

#### Wyjątki

Legenda wykresu (kolor + etykieta, bez ikony) i markery danych w SVG (`role="img"` + `aria-label`
z wartościami) spełniają wymóg tekstu przez opis dostępny. Etykiety dowodu na marketingu
(`demo/product/case`) nie są statusami i używają wyłącznie stali/neutralu.

### 2.8 design-sticky-opaque

**Sticky = nieprzezroczyste tło z tokenu i udokumentowana skala z-index**

Impact: **HIGH** · Tagi: design, sticky, tables, navbar, z-index, ios · Źródło: company-ui §10 STICKY RULE (app.css:317-320) / ui-kit-habits.md E6 / taste §6.F Z-Index Restraint / CLAUDE.md 2026-07-26 (content-layer bez z-index, bg-layer -1) · Dodano: 2026-09-12 · Plik: `rules/design-sticky-opaque.md`

#### Zasada

Każdy element `position: sticky` (nagłówek tabeli, stopka sum, zamrożona kolumna, navbar) ma tło
**nieprzezroczyste** z tokenu powierzchni (`--surface`, `--surface-overlay`, `--surface-muted`),
nigdy `rgba()`/`transparent`/`backdrop-filter`. Między `th` a wrapperem scrolla nie ma przodka
z `overflow`/`clip`/`transform` (unieważnia sticky). Skala z-index jest stała i udokumentowana
w `tokens.css`: `--z-nav: 10`, `--z-sticky-head: 3–4`, `--z-sticky-foot: 3`, `--z-sticky-col: 2`,
`--z-dialog: 50`; żadnych `z-50`/`z-[9999]` ad hoc. Szkielet strony: `.content-layer` **bez**
`z-index`, `.bg-layer { z-index: -1 }`, wrapper `App` bez nieprzezroczystego tła; żaden nowy
`position: fixed` wewnątrz `.content-layer`.

#### Mechanizm awarii (dlaczego)

Półprzezroczyste sticky przepuszcza przewijaną treść pod nagłówkiem (kit: „rgba przepuszcza
scrollowaną treść"), a na iOS dodatkowo miga przy kompozycji. Kontekst stackingu na `.content-layer`
(`z-index: 10`) uwięził elementy `fixed` pod `overflow: hidden` i przez tydzień dawał „samo tło na
telefonie" (CLAUDE.md 2026-07-24/26); to była prawdziwa przyczyna, nie WebGL. Arbitralne
`z-50` w komponentach po miesiącu tworzą wyścig, w którym dialog ląduje pod navem.

#### Niepoprawnie

```css
table.matrix thead th { position: sticky; top: 0; background: rgba(15,15,15,.6); z-index: 9999; }
.content-layer { position: relative; z-index: 10; overflow: hidden; }
.nav { position: fixed; backdrop-filter: blur(8px); }
```

```tsx
<div className="overflow-hidden">       {/* przodek z clip między th a wrapperem */}
  <table><thead><tr><th className="sticky top-0">…</th></tr></thead></table>
</div>
```

#### Poprawnie

```css
.table-wrapper { overflow: auto; max-height: 70vh; }
.table-wrapper thead th { position: sticky; top: 0; z-index: var(--z-sticky-head); background: var(--surface-muted); }
.table-wrapper tfoot td { position: sticky; bottom: 0; z-index: var(--z-sticky-foot); background: var(--surface); }
.table-wrapper td.frozen { position: sticky; left: 0; z-index: var(--z-sticky-col); background: var(--surface); }
.nav { position: sticky; top: 0; z-index: var(--z-nav); background: var(--surface-overlay); border-bottom: 1px solid var(--border); }
.bg-layer { position: fixed; inset: 0; z-index: -1; }
.content-layer { position: relative; }   /* celowo bez z-index */
```

#### Test

```bash
# sticky z rgba/transparent (przegląd każdego trafienia)
grep -rnE -A3 "position:\s*sticky" site/src ui-kit/skills/company-ui/assets --include=*.css | grep -E "rgba|transparent|backdrop"
# z-index ad hoc: 0 trafień
grep -rnE "z-index:\s*[0-9]+|\bz-\[?[0-9]+\]?" site/src --include=*.tsx --include=*.css | grep -vE "var\(--z-|styles/tokens.css|z-index:\s*-1"
# szkielet warstw
grep -nE "\.content-layer\s*\{[^}]*z-index" site/src/styles/globals.css   # 0 trafień
grep -nE "\.bg-layer\s*\{[^}]*z-index:\s*-1" site/src/styles/globals.css  # 1 trafienie
# nowy fixed w treści: 0 trafień poza .bg-layer i <dialog>
grep -rnE "position:\s*fixed|\bfixed\b" site/src --include=*.tsx --include=*.css | grep -vE "bg-layer|dialog|BgBoundary"
```

#### Wyjątki

Natywny `<dialog>` (top layer, bez z-index) i `.bg-layer`. Sticky z gradientem jest dopuszczalne tylko
jako gradient dwóch nieprzezroczystych tokenów (bez alfy).

### 2.9 design-tokens-only

**Tokeny są prawem: zero hex/rgba/oklch i wartości ad hoc poza tokens.css**

Impact: **HIGH** · Tagi: design, tokens, css, tailwind, colors · Źródło: company-ui SKILL.md §2, §11 („kolory WYŁĄCZNIE tokenami") / ui-kit-habits.md §2 A1 (T1) / synthesis §2.5.2 / taste §8.A (CSS variables jako strategia) · Dodano: 2026-09-12 · Plik: `rules/design-tokens-only.md`

#### Zasada

Każdy kolor, rozmiar pisma, promień, cień, easing i czas trwania istnieje **wyłącznie** jako token
w `site/src/styles/tokens.css` (warstwa 1 prymitywy `--steel-*`/`--gray-*`, warstwa 2 aliasy
semantyczne `--background/--surface/--accent/--cta/--ok…` w `:root` i `[data-theme="light"]`,
warstwa 3 `@theme inline`). W TSX i CSS komponentów wolno użyć tylko `var(--token)` albo utility
Tailwinda wygenerowanej z tokenu (`bg-surface`, `text-foreground-muted`, `rounded-sm`).
Zakazane poza `tokens.css`: literały `#hex`, `rgb()/rgba()/hsl()/oklch()`, `style={{ color: … }}`,
`text-[13px]`, `rounded-[10px]`, `duration-[350ms]`, `shadow-[…]`, `px`-owe rozmiary pisma w CSS.
Wartości wyliczane w runtime przekazujemy przez własną zmienną (`style={{ "--pct": pct }}`),
nie przez kolor. Świadomy wyjątek wymaga komentarza `/* token-exempt: <powód> */` w tej samej linii.

#### Mechanizm awarii (dlaczego)

Kit sam złamał tę zasadę w 188 miejscach (`app.css`), strona w 62 hexach TSX, 140 `text-[Npx]`
i 371 inline `style` (`ui-kit-habits.md` §1.3). Skutki: zmiana akcentu wymaga edycji dziesiątek
plików, motyw light jest niemożliwy (kolor przypięty do komponentu), wykresy nie przełączają się
z motywem, a audyt nie da się zrobić mechanicznie. Reguła bez narzędzia egzekwującego umiera,
dlatego test jest grepem, nie prośbą.

#### Niepoprawnie

```tsx
// Navbar.tsx
<a style={{ color: "#a8b4c2", borderColor: "rgba(168,180,194,.35)" }} className="text-[13px] rounded-[10px]">
```

```css
.hero-lead { color: #b4b4b9; font-size: 14.5px; transition: color 180ms cubic-bezier(.2,.8,.2,1); }
```

#### Poprawnie

```tsx
<a className="nav-link text-sm rounded-sm" style={{ "--pct": `${pct}%` } as React.CSSProperties}>
```

```css
.hero-lead { color: var(--foreground-muted); font-size: var(--text-lg); transition: color var(--duration-fast) var(--ease-out); }
```

#### Test

```bash
# literały koloru poza tokens.css (i blokiem aliasów kitu do końca fazy 0): 0 trafień
grep -rnE "#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(|oklch\(" site/src --include=*.tsx --include=*.ts --include=*.css | grep -vE "styles/tokens\.css|styles/company-ui\.css|token-exempt"
# wartości arbitralne Tailwinda: 0 trafień
grep -rnoE "\b(text|rounded|duration|shadow|leading|tracking)-\[[^]]+\]" site/src --include=*.tsx
# inline style z kolorem/rozmiarem pisma: 0 trafień
grep -rnE "style=\{\{[^}]*(color|background|fontSize|borderColor|boxShadow)\s*:" site/src --include=*.tsx | grep -v "token-exempt"
```

Skrypt `audit-static.mjs` (reguła `design-tokens-only`) raportuje każde trafienie jako HIGH.

#### Wyjątki

`site/src/styles/tokens.css` (jedyne miejsce literałów), blok zgodności aliasów w `company-ui.css`
(do wycięcia w fazie 0), `index.html` `<meta name="theme-color" content="#121212">` (duplikat
tokenu `--background` udokumentowany komentarzem), SVG `fill="none"` / `stroke="currentColor"`,
generator PDF (`lib/pdf.ts`: pdfmake nie czyta CSS; stal `#A8B4C2` i szarości jako stałe modułu
z komentarzem `token-exempt`).

### 2.10 design-eyebrow-cap

**Eyebrow (kapitalik nad nagłówkiem) maksymalnie ceil(sekcje/3) na trasę; home = 0**

Impact: **MEDIUM** · Tagi: design, typography, eyebrow, layout, slop · Źródło: taste §4.7 EYEBROW RESTRAINT, §14 „EYEBROW COUNT (mechanical)", §9.F (section-number eyebrows) / synthesis §2.3 („Eyebrow count = 0") / ui-kit-habits.md §1.3 (`.lbl-sm` ×30) · Dodano: 2026-09-12 · Plik: `rules/design-eyebrow-cap.md`

#### Zasada

Etykieta-kapitalik nad nagłówkiem sekcji (`.eyebrow`, `.lbl-sm` poza dashboardami, każde
`text-transform: uppercase` + `letter-spacing` nad `h2/h3`) występuje **co najwyżej
ceil(liczba sekcji / 3)** razy na trasie; hero liczy się jako 1. Trasa `/` w v2 ma 9 sekcji i **0**
eyebrow (decyzja editorial). Eyebrow nigdy nie numeruje („01 · Narzędzia", „00 / INDEX"), nie jest
wersją („BETA"), nie jest mikro-zdaniem pod nagłówkiem ani zakresem lat. W dashboardach
(`tool`) `.lbl-sm` jest etykietą KPI/kolumny (uppercase 600, `--text-xs`), nie eyebrow, i nie
podlega limitowi.

#### Mechanizm awarii (dlaczego)

taste §4.7: eyebrow nad każdą sekcją to jeden z najczęstszych Telli LLM-owego layoutu; zmienia
stronę w formularz „ETYKIETA / Nagłówek / Akapit" powtórzony 8 razy. Strona ma dziś 30 użyć
`.lbl-sm`, w większości jako eyebrow. `high-end-visual-design` każe eyebrow-pill nad każdym H2;
ten skill jest w precedencji niżej i jego reguła jest wyłączona. Brief Karola: „mniej tekstu, więcej
pokazywania"; eyebrow to tekst, który nic nie mówi.

#### Niepoprawnie

```tsx
<section>
  <span className="lbl-sm">02 · Co budujemy</span>
  <h2>Co budujemy</h2>
  <p className="lbl-sm">Każda z tych rzeczy to funkcja, którą dowozimy dziś, nie obietnica roadmapy.</p>
</section>
```

#### Poprawnie

```tsx
<section className="section">
  <h2>Co budujemy</h2>
  <p className="lead">Nie mamy zamkniętego katalogu. Sześć typów pracy, które powtarzają się w każdym dziale.</p>
</section>
```

#### Test

```bash
# per plik strony/sekcji: liczba kapitalików (oczekiwane: home 0; inne trasy ≤ ceil(sekcje/3))
grep -rcE "lbl-sm|className=\"eyebrow|uppercase tracking" site/src/pages site/src/components site/src/App.tsx | grep -vE ":0$|components/dashboards/"
# numeracja/wersje w eyebrow: 0 trafień
grep -rnE "(lbl-sm|eyebrow)[^>]*>\s*(0[0-9]|[0-9]{2}\s*[·/]|BETA|v[0-9])" site/src --include=*.tsx
```

Playwright: `document.querySelectorAll('main .eyebrow, main .lbl-sm').length` na `/` = 0.

#### Wyjątki

Etykiety KPI, nagłówki kolumn tabel i legendy w dashboardach (`data-surface="tool"`), etykiety
formularzy (`<label>`), meta pod ramą realizacji (chipy `.st`, nie kapitaliki).

### 2.11 design-icons-lucide-one-family

**Ikony wyłącznie lucide-react, strokeWidth 1.5 domyślnie (1.75 tylko dla ikon 16 px), rozmiary z mapy, zero emoji i glifów**

Impact: **MEDIUM** · Tagi: design, icons, lucide, a11y, emoji · Źródło: company-ui §6 (jedna biblioteka, stała mapa znaczeń, zakaz emoji/glyphów) / taste §3.C („One family per project", „Standardize strokeWidth globally"), §3.D / taste.md §11.2 (lucide zostaje: project already depends) / ui-kit-habits.md D3 / synthesis §2.5.5 i §2.3 S5 (strokeWidth 1.5; 16 px: 1.75) · Dodano: 2026-09-12 · Plik: `rules/design-icons-lucide-one-family.md`

#### Zasada

Jedna rodzina ikon: **`lucide-react`** (projekt już od niej zależy; taste §3.C dopuszcza). Grubość
kreski ustawiana raz, przez wrapper `Icon` (albo domyślne `LucideProps`), wg jednej tabeli
(synthesis §2.5.5): **`strokeWidth` 1.5 dla rozmiarów 20, 24 i 32 px (domyślny)** oraz
**1.75 WYŁĄCZNIE dla ikon 16 px** (mała ikona z 1.5 gubi kreskę w chipie `.st` i w parze ✕/✓).
Wartość wynika z rozmiaru, nie z widzimisię autora: wrapper liczy ją sam (`size === 16 ? 1.75 : 1.5`),
więc w JSX nie podaje się `strokeWidth` ręcznie. Rozmiary tylko z mapy **{16, 20, 24, 32}** przez prop `size`, `aria-hidden` gdy obok tekstu, `aria-label`
(albo `<span className="sr-only">`) gdy ikona jest sama. Stała mapa znaczeń (Check = sukces,
X = zamknij, Clock = oczekuje, Download = pobierz, TriangleAlert = ostrzeżenie, Lock = on-prem,
BarChart3/Banknote/HardHat/FileSpreadsheet/Stamp = działy). Zakazane: druga biblioteka
(Phosphor, Heroicons, FontAwesome), emoji w kodzie, treści, nagłówkach i `alt`, glify tekstowe
(`▲ ▼ ✓ ✕ → ⓘ ›`) jako ikony, ręczne `<path>` ikon, `strokeWidth` ad hoc (1.2/1.4/2.5) i `strokeWidth`
1.75 na ikonie większej niż 16 px.

#### Mechanizm awarii (dlaczego)

Dwie rodziny ikon w jednym drzewie = dwa rysunki linii obok siebie (taste §3.C). Emoji renderują się
inaczej na Windows/iOS/Android, łamią monochrom stali i nie mają semantyki dla czytników.
Glify tekstowe (`▲ 4,2%` w `.delta` kitu) mają inny baseline i wagę niż tekst. `strokeWidth`
rozjeżdża się dziś w `CollaborationFlow.tsx` (1.2/1.4/1.6) i chipach kitu (`stroke-width: 2.5`).
Jedna wartość globalna też nie działa: 1.5 na ikonie 16 px znika przy 100 % jasności na OLED, a 1.75
na ikonie 24/32 px pogrubia rysunek i wybija ikonę ponad tekst obok (dlatego synthesis §2.5.5
rozdziela 1.5 / 1.75 wg rozmiaru).
Rozmiar propem jest praktyką strony (84 użycia) i zostaje; mapa 4 rozmiarów zamiast 12/14/15/18
ad hoc daje rytm.

#### Niepoprawnie

```tsx
import { CheckCircle } from "@heroicons/react/24/outline";
<span>✓ Zapisano</span>
<Check size={15} strokeWidth={2.5} />       {/* rozmiar spoza mapy, grubość ad hoc */}
<Info size={24} strokeWidth={1.75} />       {/* 1.75 poza 16 px */}
<Check size={16} strokeWidth={1.5} />       {/* 16 px musi mieć 1.75 */}
<button><Download /></button>            {/* ikona solo bez etykiety */}
<h2>🚀 Co budujemy</h2>
<svg><path d="M4 4l8 8 …" /></svg>        {/* ręczna ikona */}
```

#### Poprawnie

```tsx
// components/ui/Icon.tsx: jedyne miejsce, w którym pada strokeWidth
import type { LucideIcon } from "lucide-react";
type IconSize = 16 | 20 | 24 | 32;
export function Icon({ as: Glyph, size = 20, ...rest }: { as: LucideIcon; size?: IconSize } & React.SVGProps<SVGSVGElement>) {
  return <Glyph size={size} strokeWidth={size === 16 ? 1.75 : 1.5} {...rest} />;
}
```

```tsx
import { Check, Download } from "lucide-react";
<span className="st st-accent"><Icon as={Check} size={16} aria-hidden /> Zapisano</span>          {/* 16 px → 1.75 */}
<button className="btn btn-secondary" aria-label="Pobierz PDF"><Icon as={Download} size={20} aria-hidden /></button>   {/* 20 px → 1.5 */}
<h2>Co budujemy</h2>
```

#### Test

```bash
# inne biblioteki ikon: 0 trafień (exit 1 = PASS; „OK" potwierdza, że komenda się wykonała)
grep -rnE "from \"(@heroicons|@phosphor-icons|react-icons|@tabler|@fortawesome)" site/src || echo OK
# emoji i glify w TSX/danych: 0 trafień. LC_ALL OBOWIĄZKOWE — bez niego GNU grep 3.0 w Git Bash
# kończy się „grep: -P supports only unibyte and UTF-8 locales”, exit 2 i PUSTYM wyjściem,
# co wygląda jak PASS (awaria narzędzia ≠ brak naruszeń; patrz rules/_sections.md).
LC_ALL=C.UTF-8 grep -rnP "[\x{1F300}-\x{1FAFF}\x{2600}-\x{27BF}]|[▲▼✓✕✔✖→›ⓘ]" site/src --include=*.tsx --include=*.ts; ec=$?
case $ec in 1) echo "OK (0 trafień)";; 0) echo "FAIL (trafienia wyżej)";; *) echo "BŁĄD NARZĘDZIA (exit $ec) — NIE SPRAWDZONO, nie PASS";; esac
# stan zastany (2026-09-12): 21 plików z glifami, w tym Differentiators.tsx:8 i :190 (✕ / ✓);
# większość to „→” w komentarzach — do wymiany razem z migracją na wrapper Icon (dług fazy 1)
# strokeWidth w JSX poza wrapperem Icon.tsx: 0 trafień (grubość wynika z rozmiaru)
grep -rnE "strokeWidth" site/src --include=*.tsx | grep -v "components/ui/Icon.tsx"
# gdyby strokeWidth zostawał lokalnie: 1.75 tylko z size={16}, reszta 1.5
grep -rnoE "size=\{16\}[^>]*strokeWidth=\{?1\.5\}?|size=\{(20|24|32)\}[^>]*strokeWidth=\{?1\.75\}?" site/src --include=*.tsx
grep -rnoE "size=\{[0-9]+\}" site/src --include=*.tsx | grep -vE "\{(16|20|24|32)\}"
# ikona solo bez aria-label (przegląd trafień)
grep -rnE "<button[^>]*>\s*<[A-Z][A-Za-z]+ (size|strokeWidth)" site/src --include=*.tsx | grep -v "aria-label"
```

#### Wyjątki

Ręczne `<path>` dozwolone w diagramach z danymi: `CollaborationFlow`, `KsefFlow`, ilustracje
case (SVG z `role="img"` + `aria-label`), wykresy dashboardów. `strokeWidth` w tych diagramach
z tokenów geometrii (stała modułu), nie per-ścieżka. Ikony 12 px w chipach `.st-ico` kitu
(tryb `tool`) zostają do migracji na mapę.

### 2.12 design-light-ready-tokens

**Komplet tokenów [data-theme="light"] od dnia 1, bez przełącznika na stronie**

Impact: **MEDIUM** · Tagi: design, tokens, light, theme, kit · Źródło: synthesis §2.5.1 p.4 („dark-first, light-ready") / ui-kit-habits.md §4.2 (light: akcent #42526E), R11 / taste §8.D (test in both modes) / company-ui §2 · Dodano: 2026-09-12 · Plik: `rules/design-light-ready-tokens.md`

#### Zasada

`tokens.css` definiuje **komplet aliasów semantycznych dla `[data-theme="light"]`** (ten sam zestaw
nazw co `:root` dark: `--background/--surface*/--foreground*/--border*/--accent*/--cta*/--ok…/--chart-*/
--scrim`), w tym `color-scheme: light` i inny akcent tekstu (`--accent: var(--steel-700)` = `#42526E`,
`--on-accent: #FFFFFF`, `--cta: #111827`), bo stal `#A8B4C2` nie przechodzi AA na bieli. Motyw light
**nie ma przełącznika na stronie marketingowej** (Page Theme Lock); służy narzędziom on-prem
z toggle kitu, podglądowi PDF, brandkitowi i zrzutom na jasne tło (LinkedIn). Każdy komponent
używa wyłącznie aliasów (nigdy prymitywów `--steel-*`/`--gray-*`), więc przełącza się bez
zmian w kodzie. Nowy alias w `:root` bez pary w `[data-theme="light"]` = fail.

#### Mechanizm awarii (dlaczego)

Kit miał 45 linii nadpisań light z hexami w 30 selektorach komponentów (`app.css:556-600`), bez
konsumenta na stronie; martwy kod, który przy zmianie jednego tokenu rozjeżdżał się po cichu.
Jeśli light wraca (narzędzie u klienta, jasny PDF-preview, brandkit), musi wrócić przez tokeny,
nie przez selektory. Komponent z prymitywem `--gray-900` w tle „przypadkiem" zostaje ciemny
w motywie light i daje czarny prostokąt na białej stronie narzędzia.

#### Niepoprawnie

```css
:root { --surface: #262626; }
/* brak pary light */
html[data-theme="light"] .st-accent { color: #42526e; background: #eff3f7; }   /* nadpisanie selektora, nie tokenu */
.card { background: var(--gray-900); }                                            /* prymityw w komponencie */
```

#### Poprawnie

```css
:root { color-scheme: dark; --background: var(--gray-975); --surface: var(--gray-900); --accent: var(--steel-300); --on-accent: var(--gray-950); --cta: var(--gray-0); --on-cta: var(--gray-975); }
[data-theme="light"] { color-scheme: light; --background: #F4F5F7; --surface: #FFFFFF; --surface-muted: #F9FAFB; --surface-raised: #F3F4F6; --surface-overlay: #FFFFFF;
  --foreground: #262626; --foreground-strong: #111827; --foreground-muted: #6B7280; --foreground-faint: #6B7280;
  --border: #E6E8EC; --border-strong: #C8D2DD; --accent: var(--steel-700); --accent-strong: var(--steel-800); --on-accent: #FFFFFF; --accent-text: var(--steel-700);
  --cta: #111827; --on-cta: #FFFFFF; --cta-hover: #1F2937; --scrim: rgb(255 255 255 / .8);
  --ok: #059669; --bad: #B91C1C; --warn: #B45309; --info: #1D4ED8; --chart-ref: #64748B; }
.card { background: var(--surface); }
```

#### Test

```bash
# każdy alias z :root ma parę w [data-theme="light"] (0 linii w wyniku = PASS)
node -e '
const css=require("fs").readFileSync("site/src/styles/tokens.css","utf8");
const grab=sel=>{const m=css.match(new RegExp(sel.replace(/[[\]"=]/g,"\\$&")+"\\s*\\{([\\s\\S]*?)\\n\\}"));return new Set([...(m?m[1]:"").matchAll(/--([a-z0-9-]+)\s*:/g)].map(x=>x[1]).filter(n=>!/^(steel|gray|green|red|amber|blue)-/.test(n)&&!/-rgb$/.test(n)))};
const d=grab(":root"),l=grab("[data-theme=\"light\"]");
for(const n of d) if(!l.has(n)&&!/^(text|font|duration|ease|radius|container|gutter|section|z)-/.test(n)) console.log("brak w light:",n);'
# prymitywy w komponentach: 0 trafień
grep -rnE "var\(--(steel|gray|green|red|amber|blue)-[0-9]+\)" site/src --include=*.tsx --include=*.css | grep -v "styles/tokens.css"
```

Test wizualny (narzędzia/kit): `document.documentElement.dataset.theme = "light"` w konsoli na
dashboardzie → brak czarnych prostokątów, kontrast AA (`design-contrast-aa`).

#### Wyjątki

Tokeny geometrii, typografii i ruchu (`--text-*`, `--radius-*`, `--duration-*`, `--ease-*`, `--z-*`)
są wspólne dla obu motywów i nie wymagają pary. Strona marketingowa nigdy nie ustawia `data-theme`.

### 2.13 design-no-three-equal-cards

**Zero trzech równych kart w rzędzie; rodziny layoutu się nie powtarzają**

Impact: **MEDIUM** · Tagi: design, layout, cards, bento, slop · Źródło: taste §0.D, §9.C („NO 3-column equal feature cards"), §14 Section-Layout-Repetition, Bento Background Diversity / imagegen §8 Layout slop / synthesis §2.3 (9 rodzin layoutu) · Dodano: 2026-09-12 · Plik: `rules/design-no-three-equal-cards.md`

#### Zasada

Na trasach marketingowych: **żaden rząd trzech identycznych kart** (ta sama ikona + tytuł + zdanie
× 3 w `grid-cols-3`). Sekcje różnią się rodziną layoutu: **≥ ceil(liczba sekcji / 2) rodzin na trasę**
(taste §9 mówi „≥ 4 rodziny na 8 sekcji"; trasa `/` w v2 ma **9 sekcji S1–S9**, czyli próg = 5, a projekt
daje 9 rodzin); żadne dwie sąsiednie sekcje nie dzielą layoutu; maksymalnie 2 kolejne sekcje z tym samym splitem
obraz/tekst. Siatki: gapless bento z hairline (N elementów = N komórek, bez pustych, ≥ 2 komórki
z realnym wizualem), 2×2 z hairline, ramy 2×2 z offsetem, pas metryk, rząd kroków, side-image 60/40.
Grupowanie przez linie (`border-top`, `border-left`, `divide-y`) i przestrzeń, karta z tłem tylko
tam, gdzie elewacja niesie hierarchię (dashboard, dialog). Zero „split-header" (duży nagłówek po
lewej + mały akapit po prawej).

#### Mechanizm awarii (dlaczego)

taste §0.D nazywa trzy równe karty jednym z pięciu domyślnych Telli LLM; imagegen §8: „identical card
rows repeated section after section". Kolumna trzech kart czyta się jako szablon, nie jako firma
z charakterem, i zabiera miejsce wizualom („mniej tekstu, więcej pokazywania"). Decyzja Karola
z cz. 6: hairlines zamiast boxów (pas działów jako kolumny rozdzielone liniami 1 px). Dziś strona
ma sekcję 6 kafli ikonowych i 4 statystyki w jednym rytmie; v2 rozbija to na 9 rodzin.

#### Niepoprawnie

```tsx
<div className="grid grid-cols-3 gap-6">
  {features.map(f => (
    <div className="card p-6" key={f.title}><f.Icon /><h3>{f.title}</h3><p>{f.text}</p></div>
  ))}
</div>
```

#### Poprawnie

```tsx
{/* gapless bento 3×2: kontener border-top+left, komórka border-right+bottom; 3 z 6 komórek z żywym wizualem */}
<div className="bento" role="list">
  {cells.map((c, i) => (
    <article className="bento-cell" role="listitem" key={c.key}>
      <c.Icon size={24} strokeWidth={1.5} aria-hidden />
      <h3>{pick(c.name, lang)}</h3>
      <p>{pick(c.line, lang)}</p>
      {c.live ? <c.live /> : null}
    </article>
  ))}
</div>
```

```css
.bento { border-top: 1px solid var(--border); border-left: 1px solid var(--border); display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); }
.bento-cell { border-right: 1px solid var(--border); border-bottom: 1px solid var(--border); padding: 28px 24px; }
```

#### Test

```bash
# grid 3-kolumnowy z kartą: przegląd każdego trafienia
grep -rnE "grid-cols-3|repeat\(3," site/src --include=*.tsx --include=*.css | grep -vE "components/dashboards/|bento"
# cienie/karty na marketingu: 0 trafień (karty tylko w tool)
grep -rnE "className=\"[^\"]*\bcard\b" site/src/pages site/src/App.tsx site/src/components --include=*.tsx | grep -vE "components/dashboards/|DemoReport"
```

Przegląd LLM (ui-auditor): lista sekcji trasy → rodzina layoutu każdej; fail, gdy rodzin jest mniej niż
ceil(liczba sekcji / 2) (trasa `/`: 9 sekcji → próg 5) albo gdy dwie sąsiednie sekcje mają tę samą rodzinę.

#### Wyjątki

Siatka 13 kart na hubie `/narzedzia` (katalog, nie „feature row"): karty są linkami z realnym zrzutem,
różnią się treścią i mają filtr; dopuszczalna jako jedyna powtarzalna siatka strony. Trzy KPI
w dashboardach (`tool`) to dane, nie marketing.

### 2.14 design-page-theme-lock

**Page Theme Lock: landing jest ciemny na całej stronie, motyw przez tokeny, zero dark: i inwersji sekcji**

Impact: **MEDIUM** · Tagi: design, theme, dark, tokens, color-scheme · Źródło: taste §4.11 Page Theme Lock, §8 Dark Mode Protocol, §6.C / globals.css:5 („Landing jest dark-only") / synthesis §2.5.1 / taste.md §8 (Klarow: brand insists) · Dodano: 2026-09-12 · Plik: `rules/design-page-theme-lock.md`

#### Zasada

Strona ma **jeden motyw: ciemny** (`--background #121212`, stal jako akcent), zamknięty na poziomie
dokumentu: `:root { color-scheme: dark }`, `<meta name="theme-color" content="#121212">`,
`data-theme` nie ustawiane na stronie. Żadna sekcja nie odwraca motywu (brak „jasnej kartki"
między ciemnymi sekcjami, brak jasnego footera, brak jasnego embedu bez ramy). Strategia tokenów
= **CSS variables** (`:root` dark, `[data-theme="light"]` tylko jako komplet tokenów gotowy dla
narzędzi i PDF-preview); wariant Tailwinda `dark:` jest zakazany (mieszanie strategii). Tinty
w obrębie rodziny (`--surface` obok `--surface-raised`) są dozwolone. Dokumenty PDF są jasne, ale to
osobny artefakt, nie sekcja strony.

#### Mechanizm awarii (dlaczego)

taste §4.11: „The user must not feel they walked into a different website mid-scroll." 12 osadzonych
dashboardów jest ciemnych; jasny landing wymagałby przełączenia wszystkich na `[data-theme=light]`
i retestu wykresów (+2–3 dni, ryzyko regresji; synthesis §2.5.1). Stal `#A8B4C2` ma 8,9:1 na czerni
i 2,11:1 na bieli, więc jasna sekcja zmusza do drugiego akcentu (`--steel-700`) w środku strony,
czyli złamania Color Lock. `dark:` utility obok tokenów CSS = dwa mechanizmy motywu, których
nikt nie testuje razem. `color-scheme: dark` bez deklaracji daje jasne natywne `<select>`, scrollbary
i autofill formularzy (WIG „Dark Mode & Theming").

#### Niepoprawnie

```tsx
<section className="bg-white text-zinc-900 dark:bg-zinc-950">   {/* jasna sekcja w ciemnej stronie */}
<footer className="bg-[#F4F5F7]">…</footer>
```

```css
/* brak color-scheme, brak theme-color, motyw przełączany klasą .dark na body */
```

#### Poprawnie

```css
/* tokens.css */
:root { color-scheme: dark; --background: var(--gray-975); --surface: var(--gray-900); /* … */ }
[data-theme="light"] { color-scheme: light; --background: #F4F5F7; --surface: #FFFFFF; --accent: var(--steel-700); /* komplet, patrz design-light-ready-tokens */ }
```

```html
<meta name="theme-color" content="#121212" />
```

```tsx
<section className="bg-surface">…</section>          {/* tint w rodzinie, nie inwersja */}
<footer className="border-t border-border">…</footer>
```

#### Test

```bash
grep -n "color-scheme:\s*dark" site/src/styles/tokens.css
grep -n 'name="theme-color" content="#121212"' site/index.html
# dark: i jasne tła w komponentach: 0 trafień
grep -rnE "\bdark:|bg-white\b|bg-\[#[fF]|data-theme=\"light\"" site/src --include=*.tsx
# w buildzie każda trasa ma ten sam kolor tła dokumentu
grep -c 'theme-color' site/dist/index.html site/dist/narzedzia.html site/dist/oferta.html site/dist/faq.html site/dist/rodo.html
```

DevTools: Rendering → „Emulate CSS prefers-color-scheme: light" nie może zmienić strony (brak
media query na `prefers-color-scheme` w `site/src`).

#### Wyjątki

Osadzony dashboard w podglądzie PDF (jasny dokument w ramie) i strona `/rodo` drukowana
(`@media print` białe tło) nie łamią locku: to artefakty, nie sekcje. Narzędzia on-prem (poza
`site/`) mogą mieć przełącznik motywu z kitu.

### 2.15 design-pdf-document-pattern

**Dokument PDF: pdfmake lazy, deterministyczny, 1 strona A4, nagłówek KLAROW, stopka DEMO, Roboto z parametrem font**

Impact: **MEDIUM** · Tagi: design, pdf, documents, determinism, pdfmake · Źródło: CLAUDE.md „Dokumenty PDF" / ui-kit-habits.md H1 (D1) / peer-legal.md §1.2 (refaktor pdfDoc.mjs, decyzja B: Roboto) / uzgodnienie okien 2026-09-12 · Dodano: 2026-09-12 · Plik: `rules/design-pdf-document-pattern.md`

#### Zasada

Wyjście „do klienta" z narzędzia = **PDF pobierany** w przeglądarce (nigdy okno druku):
`lib/pdf.ts` → lazy `import("pdfmake/build/pdfmake")` przy pierwszym kliknięciu → `buildDocDefinition(doc)`
z `lib/pdfDoc.mjs` (czysty ESM, działa też w Node) → `.download(filename)`. Dokument: jedna strona A4,
nagłówek z tekstowym wordmarkiem `KLAROW` (bez logo), linie meta, tabela (`tabular` liczby wyrównane
do prawej, kwoty w formacie PL `12 345,67`), opcjonalne bloki `h · p · ul · kv · quote · table · spacer`,
opcjonalne podpisy, stopka domyślna `"klarow.com · dokument DEMO — dane fikcyjne"` (co do znaku, z API
`footer?: { left?, showPageNumbers? }`). **Deterministyczny**: te same dane → identyczny plik (zero daty
generowania, zero `Date.now`, zero losowych ID w treści DEMO). Font: **Roboto** z wbudowanego vfs
(decyzja B) przez parametr `PdfDoc.font` z domyślną `"Roboto"`; `defaultStyle.font` zawsze jawne.
Akcent w bloku `quote` = stal `#A8B4C2` (stała modułu z `token-exempt`), zero złota. Przycisk:
`.btn-secondary` + ikona `Download` + stan `busy` (`aria-busy`, tekst „Generuję…" w `aria-live="polite"`).
W fazie 1 okno UI **nie dotyka** wnętrza `pdf.ts`, `PdfButton.tsx` ani `dashboards/*.tsx`
(refaktor robi okno c1); UI woła istniejące API.

#### Mechanizm awarii (dlaczego)

Okno druku daje inny wynik w każdej przeglądarce i psuje polskie znaki; pdfmake z osadzonym fontem
daje identyczny plik wszędzie. Data generowania w PDF DEMO łamie obietnicę „dwa przebiegi = ten sam
wynik" (CLAUDE.md #6) i uniemożliwia golden-test binarny. Dwie równoległe zmiany w `pdf.ts` (UI i c1)
zderzają się w tym samym pliku; stąd zamrożenie. Osadzenie Nunito w vfs to +~90 KB w lazy-chunku
i wymaga statycznych TTF 400/700/italic (pdfmake nie czyta WOFF2 ani fontów variable); brak
zarejestrowanego stylu `bold`/`italics` = wyjątek w generowaniu.

#### Niepoprawnie

```ts
window.print();                                           // okno druku
const dd = { content: [{ text: `Wygenerowano ${new Date().toLocaleString()}` }], defaultStyle: {} };
pdfMake.fonts = { Nunito: { normal: "NunitoSans.woff2", bold: "NunitoSans.woff2" } };   // WOFF2/variable nie działa
```

#### Poprawnie

```ts
// lib/pdf.ts (kurczy się do lazy importu + builder)
export async function downloadPdf(doc: PdfDoc): Promise<void> {
  const [{ default: pdfMake }, { default: pdfFonts }] = await Promise.all([import("pdfmake/build/pdfmake"), import("pdfmake/build/vfs_fonts")]);
  pdfMake.vfs = pdfFonts.pdfMake?.vfs ?? pdfFonts.vfs ?? pdfMake.vfs;
  pdfMake.createPdf(buildDocDefinition({ font: "Roboto", ...doc })).download(doc.filename);
}
// lib/pdfDoc.mjs: buildDocDefinition(doc) → { pageSize: "A4", defaultStyle: { font: doc.font ?? "Roboto", fontSize: 8.5 },
//   header: wordmark KLAROW + meta, content: bloki, footer: doc.footer?.left ?? "klarow.com · dokument DEMO — dane fikcyjne" }
```

```tsx
<PdfButton doc={buildProtocolDoc(state)} />   {/* btn-secondary + Download + aria-busy */}
```

#### Test

```bash
# brak okna druku i daty w generatorze: 0 trafień
grep -rnE "window\.print|new Date\(|Date\.now|Math\.random|toLocale(Date|Time)?String" site/src/lib/pdf.ts site/src/lib/pdfDoc.mjs
# builder czysty (zero importów) i font jawny
grep -c "^import" site/src/lib/pdfDoc.mjs; grep -nE "font:\s*(doc\.font|\"Roboto\")" site/src/lib/pdfDoc.mjs
# golden: dwa przebiegi buildera dają identyczny JSON definicji
node --test site/tests/pdfDoc.test.mjs
```

Ręcznie po każdej zmianie w `pdf.ts`: kliknąć PDF na `/narzedzia/obieg-przelewow`, porównać layout,
stopkę i znaki `zażółć gęślą jaźń ĄĆĘŁŃÓŚŹŻ` z wersją sprzed zmiany.

#### Wyjątki

`@media print` może istnieć wyłącznie jako fallback dla `/rodo` (ukryj nav/tło/wideo, biały papier),
nie dla dokumentów narzędzi. Osadzenie kroju UI w PDF (opcja A) dopiero po decyzji founderów
o foncie v2; wtedy okno UI dostarcza trzy statyczne TTF (Regular 400, Bold 700, Italic 400).
Domyślna stopka zawiera dziś pauzę „—" (tekst zachowany co do znaku przez refaktor c1); em-dash
sweep D-09 zmienia ją na `"klarow.com · dokument DEMO: dane fikcyjne"` w PR okna c1 (właściciel
`pdfDoc.mjs`), razem z aktualizacją tej reguły i golden-testu stopki.

### 2.16 design-shape-lock

**Shape Lock: promienie tylko ze zbioru {0, 8, 10, 12, 999} rozdzielonego per data-surface**

Impact: **MEDIUM** · Tagi: design, radius, shape, tailwind, kit · Źródło: taste §4.4 SHAPE CONSISTENCY LOCK / company-ui §2 (radius 12/8/10/999) / taste.md §3.2 (audyt 16 wariantów) / synthesis §2.5.4 · Dodano: 2026-09-12 · Plik: `rules/design-shape-lock.md`

#### Zasada

Jeden udokumentowany system promieni, egzekwowany mechanicznie:

| Powierzchnia | Dozwolone promienie | Co dostaje który |
|---|---|---|
| `data-surface="marketing"` (domyślna: home, hub, oferta, faq, otoczka podstron) | **{0, 8, 999}** | ramy, komórki bento, karty, obrazy: `0`; przyciski, inputy: `8` (`--radius-sm`); chipy `.st`: `999` (`--radius-pill`) |
| `data-surface="tool"` (dashboardy, dialog, `demo/`) | **{8, 10, 12, 999}** | kontrolki `8`, przyciski `10` (`--radius-md`), karty/panele/tabele `12` (`--radius-lg`), chipy `999` |

Zakazane: `rounded` (4 px), `rounded-md/lg/xl/2xl/3xl`, `rounded-[Npx]`, `border-radius: 4/5/6/7/14/16/18px`
w CSS, `rounded-full` na kontenerach i CTA (pigułka tylko dla chipów). Wartość zawsze przez token
(`rounded-sm`, `var(--radius-lg)`), nigdy liczba.

#### Mechanizm awarii (dlaczego)

taste §4.4: „Round buttons in a square layout, or square cards on a pill-button page, is broken design."
Audyt strony znalazł 7 wariantów Tailwinda (`rounded-full` 13, `rounded-[10px]` 7, `rounded-md` 4,
`rounded-xl` 3…) i 9 wartości px w CSS; kit dodał modal 16 px i login 18 px. Mieszany system jest
dopuszczalny tylko z regułą „kto dostaje który promień" i tylko, gdy reguła jest sprawdzalna, stąd
`data-surface` jako granica i grep jako test. Editorial „linie, nie boxy" na marketingu wymaga `0`,
kit w narzędziach 12/10/8; oba naraz bez granicy = 16 wariantów.

#### Niepoprawnie

```tsx
<article className="card rounded-xl">…</article>                 // marketing: 12 px na karcie
<button className="btn btn-primary rounded-full">Umów 30 minut</button>
<img className="rounded-[10px]" … />
```

```css
.frame { border-radius: 6px; }
.modal { border-radius: 16px; }
```

#### Poprawnie

```tsx
<main data-surface="marketing">
  <article className="frame">…</article>                          {/* border-radius: 0 */}
  <button className="btn btn-primary">Umów 30 minut</button>       {/* --radius-sm (8) */}
  <span className="st st-accent">Własny produkt</span>            {/* --radius-pill */}
</main>
<section data-surface="tool">
  <div className="card">…</div>                                   {/* --radius-lg (12) */}
  <input className="input" />                                     {/* --radius-sm (8) */}
</section>
```

```css
[data-surface="marketing"] .card, [data-surface="marketing"] .frame { border-radius: var(--radius-0); }
[data-surface="tool"] .card { border-radius: var(--radius-lg); }
```

#### Test

```bash
# utility spoza zbioru: 0 trafień
grep -rnoE "\brounded(-(md|lg|xl|2xl|3xl|t|b|l|r|tl|tr|bl|br)|-\[[^]]+\])?\b" site/src --include=*.tsx | grep -vE "rounded-(sm|pill|none)\b"
# px w CSS poza tokens.css: 0 trafień
grep -rnE "border-radius:\s*[0-9.]+px" site/src --include=*.css | grep -v "styles/tokens.css"
# każda trasa marketingowa ma data-surface (domyślna) a dashboard data-surface="tool"
grep -rn 'data-surface="tool"' site/src/components/dashboards site/src/components/DemoReport.tsx | wc -l
```

#### Wyjątki

Przejście fazy 0: `rounded` (4 px, ×30) do sprzątnięcia partiami; do tego czasu istniejące trafienia
są długiem w `audit/baseline.jsonl`, nowe = fail. Favicon i OG (bitmapy) nie podlegają regule.

### 2.17 design-theme-inline-zeroed

**@theme inline zeruje palety Tailwinda; utility tylko z naszych tokenów**

Impact: **MEDIUM** · Tagi: design, tailwind, theme, tokens, css · Źródło: synthesis §2.5.2 (warstwa 3) / ui-kit-habits.md §5.2 / feasibility-perf.md §1 (wyzerowanie bezpieczne) / decyzja D-19 (safari13: brak color-mix) · Dodano: 2026-09-12 · Plik: `rules/design-theme-inline-zeroed.md`

#### Zasada

`tokens.css` zawiera blok `@theme inline`, który **najpierw zeruje** domyślne przestrzenie nazw
Tailwinda v4 (`--color-*: initial; --shadow-*: initial; --font-*: initial; --radius-*: initial;
--ease-*: initial; --animate-*: initial;`), a potem mapuje wyłącznie nasze aliasy
(`--color-background: var(--background)`, `--color-accent: var(--accent)`, `--color-cta: var(--cta)`,
`--text-*`, `--radius-sm/md/lg/pill`, `--ease-out/soft/std`). Skutek: istnieją tylko utility z tokenów
(`bg-surface`, `text-foreground-muted`, `border-border`, `rounded-sm`), a `bg-blue-500`,
`text-slate-400`, `shadow-md` nie generują nic. Zakazane w `site/src`: utility domyślnej palety,
modyfikatory alfa `bg-accent/12` (kompilują się do `color-mix()`, poza `cssTarget safari13`;
używamy tokenów `--accent-a12`), wariant `dark:` (motyw przez CSS variables, nie klasę).

#### Mechanizm awarii (dlaczego)

Dziś strona ładuje dwa systemy naraz (`globals.css` z Tailwindem i `company-ui.css`) bez `@theme`,
więc Tailwind nie zna tokenów kitu, a shadcn-owe `components/ui/*` z `bg-primary` są martwe
(`ui-kit-habits.md` §1.3). Trzy źródła prawdy = dryf gwarantowany. Domyślna paleta Tailwinda to
też najkrótsza droga do „Inter + slate-900 + AI-blue" (taste §0.D). Wyzerowanie jest bezpieczne:
domyślne utility kolorów żyją tylko w `Navbar.tsx` (przepisywany) i martwym
`radial-orbital-timeline.tsx`.

#### Niepoprawnie

```css
/* globals.css: Tailwind z pełną paletą, kit obok, zero mapowania */
@import "tailwindcss";
```

```tsx
<section className="bg-zinc-900 text-slate-300 shadow-lg dark:bg-black">
<span className="bg-accent/12 text-blue-300">
```

#### Poprawnie

```css
/* tokens.css (warstwa 3) */
@theme inline {
  --color-*: initial; --shadow-*: initial; --font-*: initial; --radius-*: initial; --ease-*: initial; --animate-*: initial;
  --color-background: var(--background); --color-surface: var(--surface); --color-foreground: var(--foreground);
  --color-foreground-muted: var(--foreground-muted); --color-border: var(--border);
  --color-accent: var(--accent); --color-accent-a12: var(--accent-a12); --color-cta: var(--cta); --color-on-cta: var(--on-cta);
  --font-sans: var(--font-sans); --font-display: var(--font-display);
  --text-xs: var(--text-xs); --text-sm: var(--text-sm); --text-base: var(--text-base); --text-lg: var(--text-lg); --text-xl: var(--text-xl);
  --radius-sm: var(--radius-sm); --radius-md: var(--radius-md); --radius-lg: var(--radius-lg); --radius-pill: var(--radius-pill);
  --ease-out: var(--ease-out); --ease-soft: var(--ease-soft); --ease-std: var(--ease-std);
}
@custom-variant tool (&:where([data-surface="tool"], [data-surface="tool"] *));
```

```tsx
<section className="bg-surface text-foreground-muted">
<span className="bg-accent-a12 text-accent-text">
```

#### Test

```bash
# blok zerujący istnieje
grep -nE "^\s*--color-\*:\s*initial" site/src/styles/tokens.css
# domyślna paleta Tailwinda w TSX: 0 trafień
grep -rnE "\b(bg|text|border|ring|from|to|via|fill|stroke|decoration|outline)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|white|black)(-[0-9]{2,3})?(/[0-9]+)?\b" site/src --include=*.tsx
# modyfikatory alfa i dark: 0 trafień
grep -rnE "\b(bg|text|border|ring)-[a-z-]+/[0-9]+\b|\bdark:" site/src --include=*.tsx --include=*.css
# build CSS bez color-mix/oklch (safari13)
grep -lE "color-mix\(|oklch\(" site/dist/assets/*.css
```

#### Wyjątki

Utility spacingu/layoutu Tailwinda (`grid`, `gap-6`, `p-6`, `max-w-*`, `hidden md:block`) są
dozwolone bez ograniczeń: Tailwind = layout, tokeny = wygląd (kit §0).

### 2.18 design-typography-scale

**Skala pisma w rem, maksymalnie 7 stopni, minimum 12 px w UI, jeden krój, zero serif i mono**

Impact: **MEDIUM** · Tagi: design, typography, tokens, fonts, rem · Źródło: ui-kit-habits.md C2 (N2), C3 (N3), R8, R16 / synthesis §2.5.3 (tabela typografii), R4 (Nunito solo) / taste §4.1, §9.B / decyzja D-06 · Dodano: 2026-09-12 · Plik: `rules/design-typography-scale.md`

#### Zasada

Rozmiary pisma wyłącznie z tokenów w **rem** (`--text-xs .75 / sm .875 / base 1 / lg 1.125 /
xl 1.25 / 2xl clamp / 3xl clamp / display clamp(2.25rem, 5.2vw, 4.25rem)`): maksymalnie 7 stopni
+ display. **Minimum w UI = `.75rem` (12 px)**; 10 px tylko dla osi wykresów w dashboardach.
Zakazane: `px` z ułamkami (12.5 / 13.5 / 14.5), `text-[Npx]`, rozmiary „na oko" w klasach kitu,
więcej niż jedna waga display (nagłówki 600–700, nigdy 800+ poza wordmarkiem), `letter-spacing`
inne niż `-.02em` w nagłówkach i `.14em` w wordmarku. Krój: **Nunito Sans solo** (self-hosted
`woff2`, `unicode-range` latin + latin-ext, `font-display: swap`, preload pliku latin);
`--font-display` = alias `--font-sans` do decyzji D-06. Zero serif (w tym Instrument Serif /
Fraunces), zero mono w UI, zero Google Fonts CDN, zero Inter / Roboto / Arial jako kroju UI.
Nagłówki: `text-wrap: balance`, `overflow-wrap: anywhere`. Tekst akapitu `max-width: 60ch`.

#### Mechanizm awarii (dlaczego)

Kit ma 9 stopni px z ułamkami plus ~12 wartości ad hoc (9.5 / 10.5 / 11.5 / 16.5 / 22 / 23 px):
brak skali, brak skalowania ustawień użytkownika (px ignoruje preferencje), 9,5–10 px nie przechodzi
czytelności mobile. Strona ma 140 `text-[Npx]`. Serif to „the single most-tested AI tell" (taste §4.1),
a mono w UI to rejestr dev-tool, nie CFO. Drugi krój (Geist) rozsadza budżet fontów (Nunito 93 KB
+ Geist ~70 KB > 150 KB; feasibility-perf §3.2) i wymaga osadzenia w PDF w tej samej fazie.

#### Niepoprawnie

```css
.lbl { font-size: 10.5px; letter-spacing: .07em; font-weight: 800; }
.small { font-size: 13px; }
h1 { font-family: "Instrument Serif", serif; font-size: 72px; }
@import url("https://fonts.googleapis.com/css2?family=Inter");
```

```tsx
<p className="text-[13px] font-mono">…</p>
```

#### Poprawnie

```css
@font-face { font-family: "Nunito Sans"; src: url("/fonts/nunito-sans-latin.woff2") format("woff2"); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; font-display: swap; font-weight: 200 1000; }
:root { --font-sans: "Nunito Sans", "Segoe UI", system-ui, -apple-system, sans-serif; --font-display: var(--font-sans); --text-xs: .75rem; --text-sm: .875rem; --text-base: 1rem; --text-lg: 1.125rem; --text-xl: 1.25rem; }
h1 { font: 700 var(--text-display)/1.05 var(--font-display); letter-spacing: -.02em; text-wrap: balance; overflow-wrap: anywhere; }
.lbl { font-size: var(--text-xs); font-weight: 600; letter-spacing: .06em; text-transform: uppercase; }
```

```html
<link rel="preload" as="font" type="font/woff2" href="/fonts/nunito-sans-latin.woff2" crossorigin />
```

#### Test

```bash
# px w font-size poza tokens.css i osiami wykresów: 0 trafień
grep -rnE "font-size:\s*[0-9.]+px" site/src --include=*.css | grep -vE "styles/tokens.css|axis|chart"
grep -rnoE "text-\[[0-9.]+px\]" site/src --include=*.tsx
# serif / mono / CDN: 0 trafień
grep -rniE "serif\b|font-mono|font-family:\s*\"?(Inter|Roboto|Arial|Geist Mono|JetBrains)|fonts\.googleapis|fonts\.gstatic" site/src site/index.html | grep -v "sans-serif"
# fonty self-hosted i preload
ls site/public/fonts/*.woff2; grep -n 'rel="preload" as="font"' site/index.html
# budżet fontów ≤ 100 KB (Nunito solo)
du -k site/public/fonts/*.woff2
```

#### Wyjątki

Osie i etykiety wykresów w dashboardach: `--text-2xs` (10 px) dozwolone. Wordmark: waga 800 i tracking
`.14em`. PDF (pdfmake) używa Roboto z wbudowanego vfs (decyzja B, patrz `design-pdf-document-pattern`);
to nie jest krój UI.

## 3. Ruch, wideo, tła, reduced-motion, budżet Motion (`motion`)

Domyślny impact: **BLOCKER** · tryb: both · właściciel audytu: `motion-auditor`

### 3.1 motion-charts-static

**Wykresy statyczne: reveal raz ≤ 420 ms (DUR.reveal / --duration-slow) na poziomie panelu, potem statyka; zero „rysowania"**

Impact: **BLOCKER** · Tagi: motion, charts, dashboards, determinism · Źródło: CLAUDE.md #2 · ui-kit-habits F2 (M2) · synthesis §2.4.3 ChartReveal/§2.4.7 · showreel M8 · proof M1–M2 (via feasibility-perf §7) · bklit-ui §4.2/§10.9 · Dodano: 2026-09-12 · Plik: `rules/motion-charts-static.md`

#### Zasada

Wykres (SVG w dashboardach, mini-wykres S2, `DemoReport`) renderuje się od razu w stanie końcowym.

Jedna liczba na całe zjawisko: **reveal wykresu ≤ `DUR.reveal` = 420 ms = `--duration-slow`** (`motion-tokens-only`). Bez wariantów „400", „450", „0,45 s". Jedyny dozwolony ruch:

1. **wejście panelu**: fade `opacity` ≤ 420 ms (`.chart-reveal`/`fade` na kontenerze, `animation: chartFade var(--duration-slow) …`), LUB
2. **`ChartReveal`**: clip-reveal L→R `clipPath: inset(0 100% 0 0) → inset(0 0 0 0)`, `EASE_SOFT`, `duration: DUR.reveal` (420 ms), DOKŁADNIE RAZ po montażu; replay wyłącznie przez jawne `key` z przycisku „Odtwórz", nigdy z danych,
3. **licznik KPI** ≤ 200 ms przy zmianie wejścia (opcjonalnie), reszta wyniku w tej samej klatce.

Zakazane: animacja słupków/linii per element (`stroke-dashoffset`, `pathLength`, `animate={{ height }}` na `<rect>`, `isAnimationActive` w Recharts), stagger słupków, „dojeżdżanie" osi, `key` zależne od danych (remount przy każdej zmianie wejścia), spring na wartościach danych, kropki dekoracyjne na każdym punkcie (kropki tylko informacyjne: ostatni punkt, markery, hover), pętle (`repeat: Infinity`) na czymkolwiek w dashboardzie, `ChartReveal` w hero lub na treści obecnej w shellu (`motion-no-initial-hidden-above-fold`).

Zmiana wejścia (suwak, tolerancja, filtr) = nowy wynik w tej samej klatce (bez remountu) + opcjonalny cross-fade panelu 250–300 ms (`.nc-swap`/`.nc-tab-swap` kitu), nie „rysowanie" od zera.

#### Mechanizm awarii (dlaczego)

- CLAUDE.md #2: „Wykresy statyczne: bez teatralnego „rysowania"; krótki fade, kropki tylko informacyjne". Twarda reguła projektu = BLOCKER.
- Obietnica produktowa „kalkulator, nie wróżka": wynik ma być natychmiastowy i powtarzalny; wykres, który „rośnie" 1,1 s (domyślne bklit), sugeruje obliczenie w toku i teatr.
- Remount przez `key` od danych → `ResizeObserver` → pusta klatka → błysk (kit SKILL.md:246-248); `ResponsiveContainer` mierzy po paincie.
- bklit-ui: clip-reveal i stagger słupków grają zawsze, także przy reduced motion (bklit-ui §4.6); nasz `ChartReveal` ma gałąź `useReducedMotion` → `initial={false}`.
- Per-path `stroke-dash` = repaint całego viewportu co klatkę (kit `app.css:78-82`, „Background Paths retired").

#### Niepoprawnie

```tsx
{bars.map((b, i) => (
  <m.rect key={b.id} initial={{ height: 0, y: H }} animate={{ height: b.h, y: H - b.h }}
          transition={{ delay: i * 0.05, duration: 1.1, ease: [0.85, 0, 0.15, 1] }} />
))}
<m.path d={line} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5 }} />
<svg key={JSON.stringify(data)}>…</svg>                       // remount przy każdej zmianie danych
<LineChart isAnimationActive />                                // Recharts animacja per punkt
```

#### Poprawnie

```tsx
// src/motion/ChartReveal.tsx
import * as m from "motion/react-m";
import { useReducedMotion } from "motion/react";
import { DUR, EASE_SOFT } from "./tokens";
export function ChartReveal({ replayKey = 0, children }: { replayKey?: number; children: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <m.div key={replayKey} initial={reduce ? false : { clipPath: "inset(0 100% 0 0)" }}
           animate={{ clipPath: "inset(0 0 0 0)" }} transition={{ duration: DUR.reveal, ease: EASE_SOFT }}
           style={{ willChange: reduce ? undefined : "clip-path" }}>
      {children}
    </m.div>
  );
}

// dashboard: statyczny SVG, wynik w tej samej klatce, replay tylko z przycisku
const [replay, setReplay] = useState(0);
const rows = useMemo(() => aggregate(parsed.rows), [parsed]);
<button className="btn btn-secondary btn-sm" type="button" onClick={() => setReplay((n) => n + 1)}>{t.replay}</button>
<ChartReveal replayKey={replay}><Bars rows={rows} /></ChartReveal>
```

```css
/* alternatywa CSS (kit): fade panelu, bez rysowania */
.chart-reveal { animation: chartFade var(--duration-slow) var(--ease-out) backwards; }
@keyframes chartFade { from { opacity: 0 } }
@media (prefers-reduced-motion: reduce) { .chart-reveal { animation: none } }
```

#### Test

```bash
# w dashboardach, DemoReport i mini-komponentach (oczekiwane: 0)
D="site/src/components/dashboards site/src/components/DemoReport.tsx site/src/components/MiniReport.tsx site/src/components/MiniAudit.tsx"
grep -rnE 'pathLength|stroke-dashoffset|strokeDashoffset|isAnimationActive|repeat:\s*Infinity|animationBegin|animationDuration' $D
grep -rnE '<m\.(rect|path|circle|line|g)\b' $D                          # per-element Motion w wykresach
grep -rnE 'key=\{(JSON\.stringify|data|rows|result)' $D                  # remount od danych
grep -rnE 'duration:\s*(0\.[5-9]|[1-9])' $D                              # > 420 ms w dashboardach (literały i tak łamią motion-tokens-only)
grep -rnE '(400|450)ms|duration:\s*0\.4[05]' $D site/src/styles/globals.css   # = 0 (jedyny próg to var(--duration-slow) / DUR.reveal)
# ChartReveal tylko poniżej folda: nie w Hero/Bento/MetricsStrip
grep -rnE 'ChartReveal' site/src/components/Hero.tsx site/src/components/Bento.tsx site/src/components/MetricsStrip.tsx 2>/dev/null   # = 0
# przegląd ręczny (agent motion-auditor): otworzyć 12 dashboardów, zmienić wejście (suwak/tolerancja) → wynik bez błysku i bez „rysowania";
# DevTools Performance: po pierwszych 500 ms od montażu zero animacji w panelu (Animations tab pusty).
```

Docelowo `node scripts/check-motion.mjs` sekcja `charts` + ocena LLM.

#### Wyjątki

- Klasa kitu `.nc-chart-build` (CSS clip-reveal **450 ms**, `backwards`, z blokiem reduced) jest równoważna `ChartReveal` i dozwolona w dashboardach — to TOLEROWANY DŁUG kitu do przepisania na `var(--duration-slow)` (420 ms) przy najbliższej aktualizacji `company-ui.css`; nie łączyć obu na jednym wykresie. Poza tą jedną klasą 450 ms nie występuje.
- Mini-diagram `KsefFlow` (S2): węzły `opacity` sekwencyjnie 3 × 120 ms raz; to nie wykres danych, a schemat kierunku (motywacja: „sekwencja = kierunek danych").
- Gantt (`TaskTimeline`) w trybie compare: „dryf" jest liczbą i barwą, nie animacją; zmiana snapshotu = cross-fade panelu.

### 3.2 motion-no-initial-hidden-above-fold

**Treść obecna w shellu prerenderu nie może startować ukryta: initial={false} nad foldem**

Impact: **BLOCKER** · Tagi: motion, prerender, seo, lcp, hero · Źródło: motion-dev §8.1/§8.2 · synthesis §2.4.3/§2.4.7 · showreel M6 · feasibility-perf §5.2 p.3 · taste §7.4 (uwaga o prerenderze) · Dodano: 2026-09-12 · Plik: `rules/motion-no-initial-hidden-above-fold.md`

#### Zasada

Architektura: `scripts/prerender.mjs` wstrzykuje statyczny shell do `<div id="root">`, a `main.tsx` robi `createRoot().render()` (podmiana, nie hydratacja). Wszystko, co shell już pokazał, po starcie Reacta MUSI pojawić się natychmiast w stanie końcowym:

- H1, lead, CTA hero, poster `<img>`: `initial={false}` albo brak `m.*` w ogóle,
- liczby paska „W liczbach" i mini-komponenty S2 renderowane w SSR: bez `ChartReveal`, bez licznika od 0 przy pierwszym montażu (licznik startuje tylko po `useInView`, a element jest poniżej folda),
- `PageFade`: `initial={false}` przy pierwszym montażu (`const [firstPath] = useState(() => pathname)`; animacja tylko gdy `pathname !== firstPath`),
- `whileInView` wyłącznie na elementach poniżej folda (`amount ≤ 0.25`, `margin: "0px 0px -10% 0px"`), nigdy na sekcji S1,
- `ChartReveal` (clip-reveal) wyłącznie poniżej folda i wyłącznie na treści, której NIE MA w shellu (dashboardy montowane lazy).

Po buildzie żaden plik `dist/**/*.html` nie zawiera `opacity:0`, `opacity: 0`, `clip-path: inset(0 100%` ani `visibility:hidden` na elementach z treścią tekstową.

#### Mechanizm awarii (dlaczego)

- Sekwencja użytkownika: tekst (shell) → pusto (pierwsza klatka Reacta z `initial={{ opacity: 0 }}`) → fade-in. Na szybkim łączu 100–300 ms migotania, na wolnym sekundy „znikającego hero". To dokładnie ten błąd, który sędzia wykonalności wpisał proof jako wadę (feasibility-perf §5.2 p.3).
- LCP: Chrome liczy największy element w viewporcie; jeśli H1 zniknie i wróci, kandydat LCP przesuwa się na późniejszą klatkę.
- Gdyby kiedyś shell był hydrowany (`hydrateRoot`), `initial={{ opacity: 0 }}` wylądowałoby w HTML jako `style="opacity:0"`: boty bez JS (LLM-y, część crawlerów) zobaczą tekst niewidoczny. Reguła chroni także tę przyszłość.
- Googlebot z JS renderuje pierwszy stan Reacta: elementy `whileInView` poniżej folda mają `opacity:0` do czasu przewinięcia; indeksacja treści działa, ale zrzuty w GSC wyglądają pusto. Stąd `amount ≤ 0.25` i mały ujemny margines (reveal odpala się wcześnie).

#### Niepoprawnie

```tsx
// Hero.tsx
<m.section variants={group} initial="hidden" animate="show">
  <m.h1 variants={fadeUp}>{pick(lang, MESSAGING.oneLiner)}</m.h1>      // shell już to pokazał → mignięcie
</m.section>

// PageFade.tsx
const first = useRef(true);
const initial = first.current ? false : { opacity: 0 };   // mutacja ref w renderze; StrictMode renderuje 2× i psuje flagę
first.current = false;

// MetricsStrip.tsx (S5) z ChartReveal na treści SSR
<ChartReveal><MiniBars data={aggregate(DEMO_SAMPLE)} /></ChartReveal>   // słupki znikają i wjeżdżają po podmianie shellu
```

#### Poprawnie

```tsx
// Hero.tsx: zero animacji wejścia na treści; jedyny ruch to crossfade poster → wideo w HeroMedia
export function Hero() {
  return (
    <section className="hero">
      <HeroMedia />
      <h1>{pick(lang, MESSAGING.oneLiner)}</h1>
      <p>{pick(lang, MESSAGING.subtext)}</p>
      <div className="hero-cta">…</div>
    </section>
  );
}

// PageFade.tsx (bez mutacji ref w renderze)
export function PageFade({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const [firstPath] = useState(() => pathname);
  const initial = pathname === firstPath ? false : { opacity: 0, y: 6 };
  return (
    <m.div key={pathname} initial={initial} animate={{ opacity: 1, y: 0 }} transition={{ duration: DUR.base, ease: EASE_STD }}>
      {children}
    </m.div>
  );
}

// sekcje poniżej folda
<m.ul variants={group} initial="hidden" whileInView="show" viewport={VIEWPORT_ONCE}>…</m.ul>
```

#### Test

```bash
# po `npm run build` (z katalogu site/): shell nie ukrywa treści
grep -rlE 'opacity:\s*0[;"]|clip-path:\s*inset\(0 100%|visibility:\s*hidden' site/dist --include=*.html      # = 0 plików
# hero bez m.* i bez whileInView
grep -nE '<m\.|whileInView|initial=' site/src/components/Hero.tsx site/src/components/HeroMedia.tsx | grep -v 'initial={false}'   # = 0
# PageFade: brak mutacji ref w renderze
grep -nE '\.current\s*=\s*false' site/src/motion/PageFade.tsx    # = 0
grep -nE 'useState\(\(\) => pathname\)' site/src/motion/PageFade.tsx   # = 1
# viewport: amount ≤ 0.25 wszędzie
grep -rnE 'amount:\s*(0\.[3-9]|1|"all")' site/src --include=*.tsx | grep -v 'Counter.tsx'   # = 0 (Counter ma 0.6 celowo)
# Playwright WebKit bez JS (javaScriptEnabled:false) na dist/index.html: H1 i lead widoczne (computed opacity 1);
# z JS: zrzut w 50 ms i 400 ms po DOMContentLoaded → H1 obecny na obu (brak klatki „pusto").
```

Docelowo `scripts/verify-site.mjs` krok `shell-visible` + bramka shell-vs-DOM (faza 3).

#### Wyjątki

- Elementy, których NIE MA w shellu (menu mobilne, `BookingDialog`, dashboard po `DashboardMount`), mogą mieć `initial` ukryte: nie ma czego migać.
- `Counter` ma `useInView(amount: 0.6)`: to próg STARTU liczenia, nie reveal; liczba w shellu jest wpisana na stałe i po podmianie React renderuje `0` dopiero gdy element wejdzie w 60 % widoczności. Element paska S5 jest poniżej folda na wszystkich breakpointach (sprawdzić przy zmianie układu home).

### 3.3 motion-no-pinning-no-scroll-hijack

**Zakaz produktowy pinowania, sticky-scen, horizontal-pan, parallaxu, marquee, scroll-hijack i własnego kursora**

Impact: **BLOCKER** · Tagi: motion, product-decision, seo, a11y, scroll · Źródło: decyzja Karola 2026-07-26 (deck usunięty) i 2026-07-22 (karuzela usunięta) · CLAUDE.md „Architektura strony" · synthesis §1.6/§1.7 p.14/§2.4.7 · showreel M3/M5 (przepisane na zakaz) · taste §7.5/§7.7 · motion-dev §0 p.11 · Dodano: 2026-09-12 · Plik: `rules/motion-no-pinning-no-scroll-hijack.md`

#### Zasada

Na landingu klarow.com (wszystkie trasy `/`, `/narzedzia`, `/narzedzia/:slug`, `/oferta`, `/faq`, `/rodo`) NIEZALEŻNIE OD TECHNIKI (Motion, CSS `animation-timeline`, GSAP, `position: sticky` z torem, three.js, wideo sterowane scrollem) zakazane są:

- sceny pinowane (`sticky` + kontener o wysokości N × 100vh, „scrollytelling", `PinnedScene`),
- horizontal-pan / poziome przewijanie sterowane pionowym scrollem,
- scroll-hijack: przechwytywanie `wheel`/`touchmove`/klawiszy, smooth-scroll z inercją (Lenis i podobne), `overflow: hidden` na `html`/`body` poza otwartym dialogiem,
- parallax (`useScroll` + `useTransform` na tle/obrazie, `background-attachment: fixed`),
- marquee/ticker (logotypy, hasła) i „kinetyczna typografia",
- własny kursor (`Cursor` z Motion+, `cursor: none`), magnetyczne przyciski,
- karuzele/orbity/decki slajdów (historia: karuzela orbitalna i deck usunięte na polecenie Karola),
- `window.addEventListener("scroll", ...)`, `window.scrollY`/`scrollTop` w stanie React, pętle rAF piszące do `useState`.

Dozwolone: zwykły scroll dokumentu, `whileInView`/`IntersectionObserver` do jednorazowych wejść, `position: sticky` WYŁĄCZNIE dla navbara i nagłówków tabel w dashboardach (bez toru), natywny `scroll-snap` w poziomej liście na `pointer: coarse` (tylko w trybie `tool`, nigdy na home).

Ta reguła nie ma trybu „po decyzji": zmiana wymaga wpisu w `docs/plan/plan-strategiczny.md` podpisanego przez Karola i Pawła oraz aktualizacji tego pliku.

#### Mechanizm awarii (dlaczego)

- Decyzja Karola 2026-07-26: deck (slajdy przełączane scrollem) usunięty, bo „rozbicie na trasy o odrębnej intencji jest lepsze pod SEO"; 2026-07-22: karuzela orbitalna usunięta („usuń te koła"). Sędzia marki (brand-icp) zdyskwalifikował showreel właśnie za scenę pinowaną. Każdy powrót do tych wzorców to powrót do już odrzuconej decyzji.
- Scena pinowana 300dvh opóźnia pierwszy dowód o ~3 viewporty na desktopie i nie działa na mobile (główny kanał wejść z LinkedIn).
- Scroll-hijack łamie a11y (czytniki, klawiatura, `prefers-reduced-motion`), psuje „Znajdź na stronie", historię przewijania i `ScrollToTop` przy zmianie trasy.
- Parallax = motion values poza `MotionConfig` (reduced motion ich nie wyłącza) + 12,9 KB hooków + ryzyko pomiarów pod `zoom` roota. Persona (CFO firmy produkcyjnej) czyta parallax jako „agencja", nie „kalkulator".
- `addEventListener("scroll")` w React = re-render co klatkę; taste §7.5 wpisuje to na listę zakazanych.

#### Niepoprawnie

```tsx
// PinnedScene.tsx
const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
const y = useTransform(scrollYProgress, [0, 1], [24, -24]);
<div ref={ref} style={{ height: "300vh" }}><div style={{ position: "sticky", top: 0, height: "100vh" }}>…</div></div>
```

```tsx
useEffect(() => {
  const onScroll = () => setProgress(window.scrollY / document.body.scrollHeight);
  window.addEventListener("scroll", onScroll);
  return () => window.removeEventListener("scroll", onScroll);
}, []);
```

```css
html, body { overflow: hidden; }            /* relikt decka */
.hero { background-attachment: fixed; }     /* parallax CSS */
.marquee-track { animation: marquee 40s linear infinite; }
```

#### Poprawnie

```tsx
// wejście jednorazowe: whileInView + VIEWPORT_ONCE, bez toru scrolla
<m.section variants={fadeUp} initial="hidden" whileInView="show" viewport={VIEWPORT_ONCE}>…</m.section>

// logotypy/hasła: statyczna siatka zamiast marquee
<ul className="logo-grid">{items.map((it) => <li key={it.id}>{it.node}</li>)}</ul>

// dialog: blokada scrolla tylko przez natywny <dialog> (showModal) + CSS :modal, bez overflow:hidden na body
```

#### Test

```bash
# wszystkie oczekiwane: 0
grep -rnE 'useScroll\(|useTransform\(|useVelocity\(|useSpring\(' site/src --include=*.tsx --include=*.ts
grep -rnE 'addEventListener\(\s*["'"'"'](scroll|wheel|touchmove)["'"'"']' site/src
grep -rnE 'window\.scrollY|document\.documentElement\.scrollTop|scrollTop\b' site/src --include=*.tsx | grep -vE 'ScrollToTop|scrollTo\('
grep -rnE 'position:\s*sticky|sticky' site/src --include=*.tsx --include=*.css | grep -vE 'Navbar|thead|th\b|table|kit-overflow'
grep -rnE 'height:\s*"?[2-9]00(vh|dvh)|animation-timeline|scroll-timeline|background-attachment:\s*fixed' site/src
grep -rnE 'marquee|ticker|Cursor\b|cursor:\s*none|lenis|locomotive|smooth-scroll' site/src -i
grep -rnE '(html|body)[^{]*\{[^}]*overflow:\s*hidden' site/src --include=*.css
grep -rnE 'carousel|orbital|SlideDeck|\.deck\b|\.slide\b' site/src -i | grep -v 'ui/radial-orbital-timeline.tsx'   # zapas poza bundlem
# zapas poza bundlem: radial-orbital-timeline nie może być importowany
grep -rnE 'radial-orbital-timeline|canvas-reveal-effect' site/src --include=*.tsx | grep import   # = 0
```

Docelowo `node scripts/check-motion.mjs` sekcja `scroll`.

#### Wyjątki

- `Navbar` `position: sticky`/`fixed` (jedna linia, 64/56 px) i nagłówki tabel dashboardów (`thead` sticky w scrollboxie) są dozwolone.
- `ScrollToTop` (scroll na górę przy zmianie trasy) to nawigacja, nie animacja; zostaje.
- `WipeCompare` (faza 2, podstrony dem) używa `clip-path` sterowanego suwakiem `<input type="range">`, nie scrollem; dozwolone.

### 3.4 motion-reduced-motion-three-layers

**Reduced motion w trzech warstwach: MotionConfig user + useReducedMotion + CSS globalne**

Impact: **BLOCKER** · Tagi: motion, a11y, reduced-motion, video, canvas · Źródło: CLAUDE.md #2 · motion-dev §5.1/§8.11 · synthesis §2.4.8 · showreel M4 · bklit-ui §4.6 · taste §7.6 (6.B) · Dodano: 2026-09-12 · Plik: `rules/motion-reduced-motion-three-layers.md`

#### Zasada

`prefers-reduced-motion: reduce` jest honorowane w trzech warstwach i każda z nich jest obowiązkowa, bo każda łapie inną klasę ruchu:

1. **`<MotionConfig reducedMotion="user">`** na korzeniu (`src/motion/provider.tsx`): wyłącza animacje `transform` i `layout` w każdym `m.*`, zostawia `opacity`/kolory. Nigdy `"never"` w produkcji; `"always"` tylko do debugowania lokalnie.
2. **`useReducedMotion()`** w każdym miejscu, którego `MotionConfig` NIE widzi: `<video autoPlay>` (`HeroMedia` → poster `<img>`), canvas/WebGL (`GLSLHills` → jedna klatka), motion values (`useMotionValue`/`animate()` w `Counter` → `jump(to)`), `ChartReveal` (→ `initial={false}`), `useAnimationFrame`, hover-klipy (faza 2 → poster), mini-diagram `KsefFlow` (→ węzły od razu widoczne).
3. **CSS globalne**: blok kitu `company-ui.css:89-91` (`*{transition-duration:.01ms !important;animation-duration:.01ms !important}`) + lokalne bloki dla każdego nowego `@keyframes` + pas bezpieczeństwa `@media (prefers-reduced-motion: reduce) { .hero-media video { display: none } }`.

Kryterium zaliczenia: przy włączonym ograniczeniu ruchu strona jest w pełni użyteczna, ZERO elementów utkniętych w stanie `initial` (`opacity: 0`, `clipPath: inset(0 100% 0 0)`), zero autoplay wideo, zero pętli canvas, liczby od razu w wartości końcowej, przełączniki zamiast suwaków.

#### Mechanizm awarii (dlaczego)

- `reducedMotion="user"` nie dotyka motion values, `useScroll`, `useAnimationFrame`, elementów `<video>`, canvasu ani CSS keyframes (motion-dev §8.11). Bez warstwy 2 licznik dalej liczy, wideo dalej gra, a użytkownik z chorobą lokomocyjną zgłasza stronę.
- CSS `@media (prefers-reduced-motion)` nie łapie animacji JS. bklit-ui (uznana biblioteka wykresów) ma dokładnie ten błąd: clip-reveal i stagger słupków grają zawsze, bo brak `MotionConfig` (bklit-ui §4.6). Nie kopiować.
- `initial={{ opacity: 0 }}` bez gałęzi reduced daje w warstwie 1 fade (opacity zostaje animowane), co jest OK; ale `initial={{ scale: 0 }}` bez `opacity` daje natychmiastowy „pop", a `initial={{ clipPath: ... }}` na SVG może zostać w stanie początkowym, jeśli komponent podmienia wartość przez `key`.
- Zasada #2 CLAUDE.md: „Wszystkie animacje szanują `prefers-reduced-motion`". To reguła twarda, więc BLOCKER.

#### Niepoprawnie

```tsx
// brak MotionConfig w main.tsx albo:
<MotionConfig reducedMotion="never">                       // ignoruje ustawienie systemowe
// wideo bez gałęzi reduced:
<video autoPlay muted playsInline loop poster={POSTER} />
// licznik bez jump:
useEffect(() => { const c = animate(count, to, { duration: 1.2 }); return () => c.stop(); }, [to]);
// nowy keyframe bez bloku reduced:
@keyframes sweep { to { transform: translateX(100%) } }
.wordmark::after { animation: sweep 12s linear infinite; }
```

#### Poprawnie

```tsx
// warstwa 1: src/motion/provider.tsx
<MotionConfig reducedMotion="user" transition={{ duration: DUR.base, ease: EASE_OUT }}>

// warstwa 2: HeroMedia.tsx
function wantsVideo(): boolean {
  if (typeof window === "undefined" || !MEDIA_ENABLED) return false;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (!matchMedia("(pointer: fine)").matches) return false;
  const c = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  if (c?.saveData || /^(slow-2g|2g|3g)$/.test(c?.effectiveType ?? "")) return false;
  return true;
}

// warstwa 2: Counter.tsx
const reduce = useReducedMotion();
useEffect(() => {
  if (!inView) return;
  if (reduce) { count.jump(to); return; }
  const controls = animate(count, to, { duration: 1.2, ease: EASE_OUT });
  return () => controls.stop();
}, [inView, reduce, to, count]);

// warstwa 2: ChartReveal.tsx
const reduce = useReducedMotion();
<m.div key={replayKey} initial={reduce ? false : { clipPath: "inset(0 100% 0 0)" }} animate={{ clipPath: "inset(0 0 0 0)" }} />
```

```css
/* warstwa 3: globals.css */
@media (prefers-reduced-motion: reduce) {
  .hero-media video { display: none; }
  .wordmark::after { animation: none; }
}
```

#### Test

```bash
# 1) MotionConfig user obecny dokładnie raz, nigdy never/always
grep -rnE 'reducedMotion="user"' site/src | wc -l                 # = 1
grep -rnE 'reducedMotion="(never|always)"' site/src               # = 0
# 2) każdy plik z <video, animate(, useAnimationFrame, useMotionValue, <canvas, requestAnimationFrame ma useReducedMotion lub matchMedia reduced
for f in $(grep -rlE '<video|animate\(|useAnimationFrame|useMotionValue|<canvas|requestAnimationFrame' site/src --include=*.tsx); do
  grep -qE 'useReducedMotion|prefers-reduced-motion' "$f" || echo "BRAK gałęzi reduced: $f"
done
# 3) każdy @keyframes ma odpowiadający blok reduced w tym samym pliku
for f in $(grep -rlE '@keyframes' site/src --include=*.css); do
  grep -qE 'prefers-reduced-motion' "$f" || echo "BRAK reduced dla keyframes: $f"
done
# 4) DevTools: Rendering → „Emulate CSS media feature prefers-reduced-motion: reduce" → scroll całej strony:
#    zero ruchu poza opacity, zero elementów z computed opacity 0 po 2 s od wejścia w viewport.
# 5) Playwright WebKit 390×844 z reducedMotion:"reduce": zrzut po 3 s scrolla = brak elementów opacity:0; brak <video> w DOM.
# 6) Systemowo: Windows „Efekty animacji" OFF + iPhone Karola „Ogranicz ruch" przed publikacją.
```

Docelowo `node scripts/check-motion.mjs` sekcja `reduced` (kroki 1–3) + `scripts/verify-site.mjs` krok 5 w fazie 3.

#### Wyjątki

- Fade `opacity` w wejściach zostaje także przy reduced (nie wywołuje choroby lokomocyjnej; `MotionConfig` celowo go zostawia).
- `PageFade` przy reduced: `MotionConfig` zeruje `y`, zostaje fade 240 ms; dopuszczalne.

### 3.5 motion-bundle-budget-motion

**Chunki Motion ≤ 35 KB gz w ścieżce krytycznej; ≥ 40 KB = sygnatura domMax / pełnego motion**

Impact: **HIGH** · Tagi: motion, bundle, performance, budget · Źródło: motion-dev §3.2 (pomiary 13.2.0: 33,8 KB m+domAnimation, 42,7 KB domMax, 47,5 KB pełny) · docs/plan/strona-v2-plan.md:18/352/414 (≤ 35 KB gz, „skok > 40 KB = fail bramki") · showreel §5.9 · UWAGA: nadpisuje synthesis §2.4.9/§5/§11 (tam 36 KB) — obowiązuje 35 KB, bo tak mówi plan i tak jest ostrzej · Dodano: 2026-09-12 · Plik: `rules/motion-bundle-budget-motion.md`

#### Zasada

Po `npm run build` suma gzip wszystkich chunków w `site/dist/assets`, których kod pochodzi z `motion`/`framer-motion` (identyfikacja: chunk zawiera ciąg `LazyMotion` lub `MotionConfigContext` lub `framer-motion`), ładowanych statycznie z `dist/index.html`, wynosi ≤ **35 KB gz** (`35 840` B). Baseline z pomiaru 2026-09-11 (Vite 7.3.6, `target ["es2019","safari13"]`): **33,8 KB gz** dla `m.*` + `LazyMotion(domAnimation)` sync + `MotionConfig` + `AnimatePresence` + hooki `useInView/useMotionValue/useTransform/animate`.

Progi (liczby muszą być spójne z arytmetyką pomiarów, inaczej próg jest martwy):
- `> 35 KB` (35 840 B) i `< 40 KB`: HIGH — regresja; szukać nowego importu (`useScroll`/`useSpring` +12,9 KB, `Reorder`, `motion/three`),
- `≥ 40 KB` (40 960 B): sygnatura wciągnięcia `domMax` (42,7 KB) albo `import { motion }` / pełnego bundla (47,5 KB gz = 48 640 B): fail natychmiastowy, traktowany jak `motion-one-library-lazymotion`, bez dyskusji o „małej regresji". Ten sam próg wyłapie `useScroll` + `useSpring` doklejone do bazy (33,8 + 12,9 ≈ 46,7 KB) — to też fail, tylko z innym powodem w komunikacie.

Dlaczego 40, a nie 48: pełny `motion` waży 47,5 KB gz = **48 640 B**, a `48 * 1024` to **49 152 B** — przy progu 48 KB dokładnie ten przypadek, który ma dawać fail natychmiastowy, wpadał w gałąź „regresja > 35 KB". `domMax` (42,7 KB) mijał próg jeszcze wyraźniej. 40 KB jest jednocześnie liczbą z planu (`strona-v2-plan.md:352`: „skok > 40 KB = ktoś wciągnął domMax lub pełny motion → fail bramki") i nie daje fałszywek: baza `m` + `domAnimation` to 33,8 KB, czyli 6 KB zapasu.

Motion nie może być rozbite na chunk lazy „żeby zmieścić się w budżecie": `LazyMotion` jest SYNC (patrz `motion-one-library-lazymotion`). Budżet domyka się przez dyscyplinę importów, nie przez lazy.

Baseline jest zapisany w `site/scripts/verify-site.baseline.json` (`{"motionGz": 33800, ...}`) i aktualizowany tylko świadomym commitem `Perf: nowy baseline chunków (powód)`.

Plik NIE istnieje przed pierwszym zielonym buildem v2: tworzy go świadomie `node .claude/skills/klarow-guardian/scripts/verify-site.mjs --write-baseline` (zapisuje `homeGz`, `cssGz`, `motionGz` z aktualnego `dist`). Do tego czasu obowiązują budżety domyślne z `verify-site.mjs`, a skrypt mówi o braku baseline’u na stderr.

#### Mechanizm awarii (dlaczego)

- Różnica `m`+`domAnimation` vs pełny `motion` to 13,7 KB gz (29 %): ~23 % chunku react-dom. Na stronie z budżetem JS `/` ≤ 140 KB gz (react-dom ~58 + router ~15 + motion ~34 + app ~25) nie ma miejsca na 47,5.
- Regresja bundla jest cicha: `tsc` i `vite build` przechodzą, strona działa, a każdy użytkownik płaci 14 KB więcej na każdej trasie. Tylko bramka liczbowa ją łapie.
- Docs Motion obiecują „4,6 kB"; w praktyce wspólny rdzeń (`MotionConfigContext` 11,6 KB + silnik) ładuje się zawsze. Nie obiecywać founderom „5 KB"; budżet 35 jest realny, ≥ 40 = błąd w imporcie, nie „drobna regresja".

#### Niepoprawnie

```tsx
import { useScroll, useSpring, useTransform } from "motion/react";   // +12,9 KB gz, a scroll-linked jest zakazane
import { Reorder } from "motion/react";                               // domMax
import { threeEffect } from "motion/three";                           // three w drzewie Motion
```

```json
// verify-site.baseline.json podbity bez powodu
{ "motionGz": 44000 }
```

#### Poprawnie

```ts
// scripts/verify-site.mjs (fragment; bez npx)
import { readFileSync, readdirSync } from "node:fs";
import { gzipSync } from "node:zlib";
const dist = "dist/assets";
const html = readFileSync("dist/index.html", "utf8");
const critical = [...html.matchAll(/assets\/([^"']+\.js)/g)].map((m) => m[1]);   // chunki ładowane statycznie z index.html
let motionGz = 0;
for (const f of readdirSync(dist)) {
  if (!f.endsWith(".js") || !critical.includes(f)) continue;
  const src = readFileSync(`${dist}/${f}`, "utf8");
  if (/LazyMotion|MotionConfigContext|framer-motion/.test(src)) motionGz += gzipSync(src).length;
}
const LIMIT = 35 * 1024, SIGNATURE_FULL = 40 * 1024;   // 35 840 B / 40 960 B; pełny motion = 48 640 B, domMax ≈ 43 724 B
if (motionGz >= SIGNATURE_FULL) fail(`motion-bundle-budget-motion: ${motionGz} B gz ≥ 40 KB: domMax / import {motion} / useScroll+useSpring (patrz motion-one-library-lazymotion)`);
else if (motionGz > LIMIT) fail(`motion-bundle-budget-motion: ${motionGz} B gz > 35 KB (baseline ${baseline.motionGz})`);
```

#### Test

```bash
cd site && npm run build >/dev/null && node scripts/verify-site.mjs      # docelowo
# do czasu skryptu: ręczny pomiar
cd site && for f in dist/assets/*.js; do grep -lqE 'LazyMotion|MotionConfigContext|framer-motion' "$f" && printf '%s %s\n' "$(gzip -c "$f" | wc -c)" "$f"; done
# suma wierszy ≤ 35840 (> 35840 = HIGH; ≥ 40960 = fail natychmiastowy); każdy chunk musi być referencowany w dist/index.html (nie lazy)
grep -oE 'assets/[^"]+\.js' dist/index.html
```

#### Wyjątki

- Świadome przejście na `domMax` (decyzja w `docs/plan/`) podnosi budżet do 50 KB (i `SIGNATURE_FULL` do 55 KB) oraz baseline w tym samym commicie; reguła `motion-one-library-lazymotion` musi zostać zaktualizowana równocześnie.

### 3.6 motion-cleanup-required

**Każda animacja imperatywna, subskrypcja, timer, rAF i observer ma cleanup w useEffect**

Impact: **HIGH** · Tagi: motion, react, strictmode, leaks, cleanup · Źródło: bklit-ui §4.3/§10.5/§10.8 · motion-dev §4.7/§8.3 · showreel M9 · ui-kit-habits F1 (fill-mode) · glsl-hills.tsx:256-267 (wzorzec repo) · Motion AI Kit best-practices/index.md (motionValue.on) · Dodano: 2026-09-12 · Plik: `rules/motion-cleanup-required.md`

#### Zasada

W każdym `useEffect`/`useLayoutEffect`, który uruchamia coś asynchronicznego, funkcja sprzątająca jest OBOWIĄZKOWA i symetryczna:

| Uruchomienie | Cleanup |
|---|---|
| `const controls = animate(...)` | `return () => controls.stop()` |
| `motionValue.on("change", cb)` | `return unsubscribe` (wartość zwracana z `.on`) |
| `requestAnimationFrame(loop)` | `cancelAnimationFrame(raf)` |
| `setTimeout`/`setInterval` | `clearTimeout`/`clearInterval` (wszystkie id, np. w tablicy) |
| `new IntersectionObserver(...)` / `ResizeObserver` | `observer.disconnect()` |
| `addEventListener(...)` (`visibilitychange`, `resize`, `canplay`) | `removeEventListener` z tą samą referencją |
| `video.play()` | `video.pause()` + zdjęcie `src` przy odmontowaniu (zwolnienie dekodera) |
| `requestIdleCallback(cb)` | `cancelIdleCallback(id)` (fallback `clearTimeout`) |
| three.js: geometria/materiał/renderer | `.dispose()` + `cancelAnimationFrame` |

Sekwencje wieloetapowe (kilka `animate` + timeouty) dostają jeden sygnał `cancelled` sprawdzany w każdym kroku (wzorzec bklit `animated-brand.tsx`). Nigdy `motionValue.onChange(cb)` (usunięte API), zawsze `motionValue.on("change", cb)`.

CSS: animacje wejścia `animation-fill-mode: backwards` (nigdy `both`/`forwards`), a po zakończeniu animacji Motion element nie może zostać z `transform` (Motion sprząta sam; nie ustawiać `style.transform` ręcznie w `onAnimationComplete`).

#### Mechanizm awarii (dlaczego)

- `main.tsx` renderuje w `<StrictMode>`: w dev każdy efekt odpala się 2× (mount → unmount → mount). Bez `controls.stop()` dwie animacje walczą o jedną motion value; bez `cancelAnimationFrame` dwie pętle rAF mielą tło; bez `disconnect()` observer trzyma odmontowany węzeł.
- Nawigacja SPA (react-router) odmontowuje strony bez przeładowania: wyciek per odwiedzona trasa; wideo bez `pause()` gra w tle i zżera dekoder/baterię.
- `animation-fill-mode: forwards/both` zostawia `transform` na elemencie po animacji → element staje się containing block dla `position: fixed` → modal/`BookingDialog` w środku `.main` ląduje poza viewportem (Chromium; kit `app.css:150-161`).
- Zasada #2 CLAUDE.md: „tła animowane tylko na GPU, z pauzą przy `document.hidden` i sprzątaniem rAF". Wzorzec wzorcowy w repo: `glsl-hills.tsx:256-267` (cancel rAF, `removeEventListener`, `dispose`).

#### Niepoprawnie

```tsx
useEffect(() => {
  animate(count, to, { duration: 1.2 });                       // brak stop
  count.onChange((v) => setText(v.toFixed(0)));                // API usunięte; brak unsubscribe; setState per klatka
  const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
  io.observe(ref.current!);                                    // brak disconnect
  document.addEventListener("visibilitychange", () => videoRef.current?.pause());   // anonimowa funkcja: nie da się zdjąć
  setTimeout(() => setReady(true), 400);                       // brak clearTimeout
}, []);
```

```css
.reveal { animation: fadeUp .42s var(--ease-out) both; }   /* zostawia transform → psuje fixed */
```

#### Poprawnie

```tsx
useEffect(() => {
  if (!inView) return;
  if (reduce) { count.jump(to); return; }
  const controls = animate(count, to, { duration: 1.2, ease: EASE_OUT });
  const unsub = count.on("change", (v) => { if (v >= to) onDone?.(); });
  return () => { unsub(); controls.stop(); };
}, [inView, reduce, to, count, onDone]);

useEffect(() => {
  const el = videoRef.current; if (!el) return;
  const io = new IntersectionObserver(([e]) => { e.isIntersecting ? el.play().catch(() => setFailed(true)) : el.pause(); }, { threshold: 0.25 });
  const onVis = () => { if (document.hidden) el.pause(); };
  io.observe(el);
  document.addEventListener("visibilitychange", onVis);
  return () => { io.disconnect(); document.removeEventListener("visibilitychange", onVis); el.pause(); el.removeAttribute("src"); el.load(); };
}, []);

useEffect(() => {
  const id = window.setTimeout(() => setReady(true), 400);
  return () => window.clearTimeout(id);
}, []);
```

```css
.reveal { animation: fadeUp var(--duration-slow) var(--ease-out) backwards; }
```

#### Test

```bash
# 1) pliki z animate(/rAF/IO/timeout/listener: każdy useEffect w nich musi mieć `return () =>` lub `return unsub`
for f in $(grep -rlE 'animate\(|requestAnimationFrame|IntersectionObserver|ResizeObserver|setTimeout|setInterval|addEventListener|requestIdleCallback|\.play\(\)' site/src --include=*.tsx --include=*.ts); do
  effects=$(grep -cE 'use(Layout)?Effect\(' "$f"); returns=$(grep -cE 'return \(\) =>|return unsub|return cancel|return () =>' "$f")
  [ "$effects" -gt "$returns" ] && echo "useEffect bez cleanup ($effects vs $returns): $f"
done
# 2) usunięte API i anonimowe listenery (oczekiwane: 0)
grep -rnE '\.onChange\(' site/src --include=*.tsx --include=*.ts
grep -rnE 'addEventListener\([^,]+,\s*\(\)\s*=>' site/src --include=*.tsx
# 3) fill-mode (oczekiwane: 0)
grep -rnE 'animation(-fill-mode)?:[^;]*\b(both|forwards)\b' site/src --include=*.css
# 4) StrictMode dev: otworzyć / → /narzedzia/raport-zarzadczy → / 5×; DevTools Performance monitor: liczba listenerów DOM i węzłów stabilna (nie rośnie).
```

Docelowo `node scripts/check-motion.mjs` sekcja `cleanup` (AST: `useEffect` bez `return` w plikach z listą wywołań).

#### Wyjątki

- `useEffect` bez cleanupu jest OK, gdy nie uruchamia niczego trwałego (np. `document.title = ...`, jednorazowy `setState`).
- `count.jump(to)` nie wymaga cleanupu.

### 3.7 motion-gpu-props-only

**Animujemy tylko opacity, transform, clipPath i filter; nigdy właściwości layoutu i paint**

Impact: **HIGH** · Tagi: motion, performance, compositor · Źródło: motion-dev §3.3/§3.4 · showreel M2 · taste §7.6 (6.A) · ui-kit-habits P1/P2 · Motion AI Kit best-practices/index.md · Dodano: 2026-09-12 · Plik: `rules/motion-gpu-props-only.md`

#### Zasada

Każda animacja (Motion, CSS transition, CSS keyframes) zmienia wyłącznie:

- `opacity`,
- `transform` (w Motion: `x`, `y`, `scale`, `rotate` albo cały string `transform`),
- `clipPath` (reveal wykresów, wipe),
- `filter` wyjątkowo i nigdy `blur()` na urządzeniach dotykowych ani w wejściach sekcji.

Zakazane w `animate`/`initial`/`whileHover`/`whileInView`/`exit`/`variants` i w CSS `transition`/`@keyframes`: `width`, `height`, `top`, `left`, `right`, `bottom`, `margin*`, `padding*`, `border*`, `boxShadow`/`box-shadow`, `fontSize`, `letterSpacing`, `backgroundPosition`, `inset`, `gap`. Kolor (`backgroundColor`, `color`, `borderColor`) jest dozwolony TYLKO w hoverach kitu przez CSS (`--duration-fast`), nie przez Motion.

Zamienniki: `boxShadow` → `filter: drop-shadow()` (albo statyczny cień + `opacity` warstwy), `borderRadius` → `clipPath: inset(0 round 8px)`, „rozwijanie wysokości" → `grid-template-rows: 0fr → 1fr` (jak `.faq-answer`) albo `AnimatePresence` z `opacity`, przesunięcie w tekście inline → brak animacji.

Duże powierzchnie (hero, całe sekcje, ramy S3): tylko `opacity`; przesunięcie `y` ≤ `SHIFT` (12 px) na elementach ≤ 1/3 viewportu.

#### Mechanizm awarii (dlaczego)

- Zmiana `width/height/top/left` wymusza layout całego poddrzewa; Motion docs: „Re-renders can exceed 100ms" per klatka. Na laptopie z GPU zintegrowanym i 12 dashboardów w tle spadek do 20–30 fps.
- `boxShadow` i `borderRadius` to paint, nie compositor: każda klatka maluje warstwę od nowa. Kit `company-ui` wprost: hover „bez transformu i bez kolorowej poświaty: zero layout shift" (SKILL.md:161-167).
- `filter: blur()` w wejściach (`translate-y-16 blur-md opacity-0` z `high-end-visual-design`) = pełnoekranowa tekstura filtra na GPU telefonu; kit zakazuje `filter` na animowanych grupach (`app.css:1-4`, `78-82`: „SVG compositor layers caused navigation lag").
- Motion zrzuca na WAAPI/kompozytor tylko `opacity`, `transform` (string), `clipPath`, `filter`, od 12.43 `backgroundColor` i SVG; reszta liczy się w JS per klatka i wraca przez layout.

#### Niepoprawnie

```tsx
<m.div animate={{ height: open ? "auto" : 0, boxShadow: "0 8px 24px rgba(0,0,0,.4)" }} />
<m.article whileHover={{ boxShadow: "0 2px 8px rgba(0,0,0,.4)", borderRadius: 12 }} />
<m.section initial={{ opacity: 0, y: 64, filter: "blur(12px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }} />
```

```css
.card { transition: width .3s var(--ease-out), padding .3s var(--ease-out); }
.card:hover { box-shadow: 0 12px 40px rgba(0,0,0,.5); transition: box-shadow .2s; }
```

#### Poprawnie

```tsx
// wejście: opacity + y ≤ 12 px
<m.li variants={fadeUp} />
// hover obrazu w ramie (transform w overflow:hidden)
<a className="case-frame"><img /></a>   /* CSS: .case-frame img{transition:transform var(--duration-base) var(--ease-out)} .case-frame:hover img{transform:scale(1.02)} */
// rozwinięcie: AnimatePresence + opacity, nie height
<AnimatePresence initial={false}>
  {open ? <m.div key="panel" initial={{ opacity: 0, y: SHIFT }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} /> : null}
</AnimatePresence>
// reveal wykresu: clipPath
<m.div initial={{ clipPath: "inset(0 100% 0 0)" }} animate={{ clipPath: "inset(0 0 0 0)" }} transition={{ duration: 0.42, ease: EASE_SOFT }} />
```

```css
.cell { transition: background-color var(--duration-fast) var(--ease-out), border-color var(--duration-fast) var(--ease-out); }
.faq-answer { display: grid; grid-template-rows: 0fr; transition: grid-template-rows var(--duration-base) var(--ease-out); }
```

#### Test

```bash
# Motion: zakazane klucze w obiektach animacji (oczekiwane: 0)
grep -rnE '(animate|initial|whileHover|whileInView|whileTap|exit|hidden|show)\s*[=:]\s*\{[^}]*\b(width|height|top|left|right|bottom|margin[A-Z]?|padding[A-Z]?|border[A-Z]?[a-zA-Z]*|boxShadow|fontSize|letterSpacing|inset|gap)\b' site/src --include=*.tsx --include=*.ts
# CSS: transition/keyframes na właściwościach layout/paint (oczekiwane: 0 poza company-ui.css do czasu przycięcia)
grep -rnE 'transition:[^;]*\b(width|height|top|left|right|bottom|margin|padding|border(?!-color)|box-shadow|font-size|inset|gap)\b' site/src --include=*.css | grep -v company-ui.css
grep -rnE 'blur\(' site/src --include=*.tsx | grep -E 'animate|initial|whileInView|whileHover'
# DevTools (ręcznie, przed publikacją): Performance → nagranie scrolla przez całą stronę:
#   zero wpisów „Layout"/„Recalculate Style" w trakcie animacji; Rendering → Paint flashing: brak zielonych błysków przy hover/reveal.
```

Docelowo `node scripts/check-motion.mjs` sekcja `props`.

#### Wyjątki

- `.faq-answer` animuje `grid-template-rows` (jedyny sposób na rozwijanie do `auto` bez JS); dozwolone, bo działa na jednym elemencie o małej powierzchni i ma `prefers-reduced-motion` → `transition: none`.
- `backgroundColor`/`borderColor` przez CSS w hoverach kitu (`--duration-fast`).
- `filter: drop-shadow()` na małym elemencie (ikona, chip) w hover, nigdy w pętli.

### 3.8 motion-no-motion-in-prerender

**Zero motion/* i zero window/document w src/prerender/entry.tsx i w komponentach renderowanych przez shell**

Impact: **HIGH** · Tagi: motion, prerender, ssr, build · Źródło: motion-dev §3.4 p.9/§8.1/§8.2 · synthesis §2.4.2/§2.8 p.2 · showreel M6 · feasibility-perf §5.2 p.4 · Dodano: 2026-09-12 · Plik: `rules/motion-no-motion-in-prerender.md`

#### Zasada

`src/prerender/entry.tsx` jest budowany osobno (`vite build --ssr`) i uruchamiany w Node przez `scripts/prerender.mjs` (`renderToStaticMarkup`). W tym grafie importów:

- nie ma `motion`, `motion/react`, `motion/react-m`, `src/motion/*` (provider, presets, Reveal, Counter, PageFade, ChartReveal),
- nie ma `window`, `document`, `navigator`, `matchMedia`, `requestAnimationFrame`, `IntersectionObserver` w ścieżce renderu,
- nie ma `<video>`, `<canvas>`, `three`, `@react-three/fiber`, `pdfmake`.

Shelle (`HomeShell`, `ToolsShell`, `ToolShell`, `OfferShell`, `FaqShell`, `PrivacyShell`/`RodoShell`, `NotFoundShell`) renderują z TYCH SAMYCH modułów `src/data/*` i czystych funkcji `src/lib/*` (`aggregate`, `auditRows`), z których korzysta React. Komponenty, które mają być współdzielone między shellem a aplikacją (`MiniReport`, `MiniAudit`, `KsefFlow`), są SSR-safe: czysta funkcja `props → JSX`, a Motion jest wyłącznie w wrapperze (`<Reveal>`, `<ChartReveal>`) dodawanym dopiero w drzewie Reacta.

#### Mechanizm awarii (dlaczego)

- `motion` 13.1.1 dodało „Guard animation `window` access in non-browser runtimes": wcześniejsze wersje wywracały `renderToStaticMarkup` w Node. Nawet z guardem import powiększa `dist-ssr` i wprowadza do shellu inline `style` z wartościami `initial` (`opacity:0` w HTML dla botów, motion-dev §8.2).
- `entry.tsx` ma w nagłówku kontrakt: „Zero window/document, zero dat, zero losowości: czysty render". Złamanie go psuje build na CI Cloudflare Pages (brak przeglądarki), a build jest jedyną bramką przed publikacją.
- Druga implementacja prezentacji w shellu (ręczna proza w `entry.tsx:103-417` dziś) to dryf: treść shellu rozjeżdża się z DOM po React. Reguła wymusza „shell z danych", a Motion trzymany w wrapperach pozwala współdzielić komponent bez wciągania biblioteki do SSR.

#### Niepoprawnie

```tsx
// src/prerender/entry.tsx
import { Hero } from "@/components/Hero";          // Hero importuje HeroMedia (matchMedia, <video>) i m.* przez Reveal
import { MetricsStrip } from "@/components/MetricsStrip";  // zawiera <Counter> (useInView, animate)
```

```tsx
// src/components/MiniReport.tsx (współdzielony, ale niepoprawnie)
import * as m from "motion/react-m";
export function MiniReport({ rows }: Props) {
  const width = window.innerWidth;                  // crash w Node / niedeterminizm
  return <m.svg initial={{ opacity: 0 }} animate={{ opacity: 1 }}>…</m.svg>;
}
```

#### Poprawnie

```tsx
// src/components/MiniReport.tsx: czysty, SSR-safe
import { aggregate } from "@/lib/report";
import { DEMO_SAMPLE } from "@/data/demo-sample";
export function MiniReport({ lang }: { lang: Lang }) {
  const agg = aggregate(parseCsv(DEMO_SAMPLE[lang]).rows);   // deterministyczne, bez window
  return <svg viewBox="0 0 320 120" width={320} height={120} role="img" aria-label={…}>…</svg>;
}

// src/components/Bento.tsx (tylko w drzewie Reacta): wrapper z Motion wokół czystego komponentu
<Reveal><MiniReport lang={lang} /></Reveal>

// src/prerender/entry.tsx: shell używa czystego komponentu bezpośrednio
import { MiniReport } from "@/components/MiniReport";
function HomeShell({ lang }: { lang: Lang }) {
  return <main id="main"><section>…<MiniReport lang={lang} />…</section></main>;
}
```

#### Test

```bash
# statycznie: entry.tsx i jego import graph
grep -nE 'from "motion|from "@/motion|from "three|@react-three|pdfmake' site/src/prerender/entry.tsx    # = 0
# graf importów (po build --ssr): bundle SSR nie zawiera motion
cd site && node node_modules/vite/bin/vite.js build --ssr src/prerender/entry.tsx --outDir dist-ssr --emptyOutDir >/dev/null && \
  grep -lE 'framer-motion|motion/react|LazyMotion|MotionConfig' dist-ssr/*.js ; cd ..           # = 0 plików
# komponenty współdzielone: brak window/document/matchMedia poza useEffect
for f in site/src/components/MiniReport.tsx site/src/components/MiniAudit.tsx site/src/components/KsefFlow.tsx; do
  [ -f "$f" ] && grep -nE '\b(window|document|navigator|matchMedia|requestAnimationFrame|IntersectionObserver)\b' "$f" | grep -v useEffect && echo "SSR-unsafe: $f"
done
# shell nie ma <video>/<canvas>
grep -rlE '<video|<canvas' site/dist --include=*.html     # = 0
# prerender przechodzi w Node bez przeglądarki
cd site && node scripts/prerender.mjs && cd ..            # exit 0; 19 plików HTML
```

Docelowo `scripts/verify-site.mjs` krok `ssr-clean` (grep na `dist-ssr`).

#### Wyjątki

- `useLang`/`pick` z `src/i18n.tsx` są dozwolone w shellu (lang podawany jawnie jako prop, bez `localStorage` w renderze SSR).
- `Seo.tsx` eksportuje `ORG_JSONLD`/`toolJsonLd`/`faqPageJsonLd` (czyste dane) i te importy są dozwolone; sam komponent `<Seo>` (efekty DOM) nie jest renderowany w shellu.

### 3.9 motion-no-transition-all-no-linear

**Zakaz transition: all / transition-all i krzywych linear / ease-in-out na interakcjach; CSS nie animuje tego, co animuje Motion**

Impact: **HIGH** · Tagi: motion, css, tailwind, performance, easing · Źródło: synthesis §2.4.1 (Navbar.tsx:67,122) · showreel M11 · motion-dev §3.4 p.4/§8.7 · ui-kit-habits F5 · taste §7.7 · Dodano: 2026-09-12 · Plik: `rules/motion-no-transition-all-no-linear.md`

#### Zasada

1. `transition: all` (CSS) i `transition-all` (Tailwind) są zakazane. Każda `transition` wymienia konkretne właściwości: `transition: background-color var(--duration-fast) var(--ease-out), border-color var(--duration-fast) var(--ease-out)`.
2. Na interakcjach (hover, focus, active, przełączniki, otwieranie menu) krzywe `linear`, `ease`, `ease-in`, `ease-in-out`, `ease-out` (słowa kluczowe) oraz Tailwind `ease-linear`/`ease-in-out`/`ease-in`/`ease-out` są zakazane; jedyne krzywe to `var(--ease-out)`, `var(--ease-soft)`, `var(--ease-std)` (i ich odpowiedniki `EASE_*` w TS). `linear` jest dozwolone WYŁĄCZNIE w `@keyframes` o stałej prędkości, których na stronie nie ma (marquee zakazane), więc praktycznie: 0.
3. Element animowany przez Motion (`m.*` z `whileHover`/`animate` na `transform`/`opacity`) NIE MA jednocześnie CSS `transition` na tej samej właściwości. Klasy kitu `.btn`/`.chip`/`.st` mają własne `transition` na kolorach; jeśli Motion dokłada `scale`, CSS nie może mieć `transition: transform`.
4. `.btn:active { transform: scale(.98) }` bez transition (natychmiastowe) jest jedynym transformem na przyciskach kitu.

#### Mechanizm awarii (dlaczego)

- `transition: all` animuje także `width`, `height`, `padding`, `box-shadow` przy każdej zmianie klasy (layout/paint co klatkę), a przy zmianie motywu/`lang` odpala kaskadę animacji wszystkich właściwości naraz. `Navbar.tsx:67` i `:122` mają dziś `transition-all` (dług do usunięcia w fazie 0).
- Dwa silniki na tej samej właściwości (CSS transition + WAAPI/JS Motion) = podwójny easing: element „dojeżdża" dwa razy, hover „pływa" (motion-dev §3.4 p.4).
- `ease-in-out` na hover oznacza powolny start: interakcja czuje się opóźniona; archetyp Corporate-precise = szybki start, długi ogon (`--ease-out`).
- `linear` na ruchu UI czyta się mechanicznie („PowerPoint"); `motion-design` i taste §7.7 zakazują domyślnych krzywych.

#### Niepoprawnie

```tsx
// Navbar.tsx:67 (stan obecny, do usunięcia)
<a className="… transition-all duration-200 …">
// Navbar.tsx:122
<div className={`… transition-all ease-in-out duration-300 overflow-hidden …`}>
// podwójny easing
<m.button className="btn btn-primary" whileHover={{ scale: 1.02 }} />   /* a w CSS: .btn{transition:transform .2s} */
```

```css
.cell { transition: all .3s ease-in-out; }
.link:hover { transition: color 200ms linear; }
```

#### Poprawnie

```css
.cell { transition: background-color var(--duration-fast) var(--ease-out), border-color var(--duration-fast) var(--ease-out); }
.btn { transition: background-color var(--duration-fast) var(--ease-out), color var(--duration-fast) var(--ease-out), border-color var(--duration-fast) var(--ease-out); }
.btn:active { transform: scale(.98); }
```

```tsx
// hover z kitu (CSS), Motion tylko tam, gdzie CSS nie sięga (wejścia, exit)
<button className="btn btn-primary" type="button">{pick(lang, MESSAGING.cta.primary)}</button>
// menu mobilne: AnimatePresence + m.nav bez klas transition-*
<AnimatePresence initial={false}>
  {open ? <m.nav key="menu" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2, ease: EASE_OUT }} /> : null}
</AnimatePresence>
```

#### Test

```bash
# oczekiwane: 0 (poza company-ui.css do czasu przycięcia kitu)
grep -rnE 'transition-all|transition:\s*all' site/src | grep -v company-ui.css
grep -rnE '\b(ease-linear|ease-in-out|ease-in|ease-out)\b' site/src --include=*.tsx        # klasy Tailwind
grep -rnE 'transition:[^;]*\b(linear|ease|ease-in|ease-out|ease-in-out)\b' site/src --include=*.css --include=*.tsx | grep -vE 'var\(--ease|cubic-bezier|company-ui.css'
grep -rnE 'ease:\s*"(linear|easeIn|easeOut|easeInOut|anticipate|backIn|backOut|circIn|circOut)"' site/src   # Motion string easings
# podwójny easing: element m.* z whileHover/animate na transform + klasa z transition-transform/transition-all
grep -rnE '<m\.[a-z]+[^>]*(whileHover|whileTap|animate)=\{[^}]*(scale|x:|y:|rotate)[^>]*className="[^"]*transition' site/src
# kit: .btn/.chip/.st nie mają transition na transform
grep -nE '\.(btn|chip|st)[^{]*\{[^}]*transition:[^;]*transform' site/src/styles/company-ui.css site/src/styles/tokens.css 2>/dev/null   # = 0
```

Docelowo `node scripts/check-motion.mjs` sekcja `css-easing`.

#### Wyjątki

- Klasy kitu `.nc-swap`/`.nc-tab-swap`/`.nc-chart-build` używają `var(--ease-out)`/`var(--ease-soft)`: zgodne.
- `@keyframes` typu `skel` (shimmer skeletonu) może mieć `linear`, bo to stała prędkość przesuwu gradientu i nie jest interakcją; musi mieć blok reduced.

### 3.10 motion-one-library-lazymotion

**Jedna biblioteka ruchu w DOM: m.* + LazyMotion domAnimation strict**

Impact: **HIGH** · Tagi: motion, bundle, react, imports · Źródło: motion-dev §3.1/§3.2/§3.4 · synthesis §2.4.2 · showreel M1/M10 · Motion AI Kit best-practices/react.md · Dodano: 2026-09-12 · Plik: `rules/motion-one-library-lazymotion.md`

#### Zasada

Na stronie `site/` jest DOKŁADNIE jedna biblioteka animacji DOM: `motion@13.2.0` (pin, minimum 13.1.1). Sposób użycia jest jeden:

1. komponenty animowane to `m.*` z `import * as m from "motion/react-m"` (nigdy `motion.*`),
2. funkcje pomocnicze (`LazyMotion`, `domAnimation`, `MotionConfig`, `AnimatePresence`, `useInView`, `useReducedMotion`, `useMotionValue`, `useTransform`, `animate`, `stagger`) z `motion/react`,
3. cały `<App/>` siedzi pod `<LazyMotion features={domAnimation} strict>` z `src/motion/provider.tsx` (features SYNCHRONICZNE, nie `() => import(...)`),
4. `domMax` (a więc `layout`, `layoutId`, `drag`, `Reorder`, `LayoutGroup`) jest ZAKAZANE do czasu odrębnej decyzji founderów zapisanej w `docs/plan/`; przełączenie to zmiana jednej linii w `provider.tsx`, nie w komponentach.

Zakazane w `site/src`: `import { motion }`, `import { motion as`, `framer-motion` (pakiet i import), `motion/react-client`, `gsap`, `@react-spring`, `animejs`, `lottie-web`, `@formkit/auto-animate` (usuwany w fazie 0; jedna biblioteka = jeden silnik).

#### Mechanizm awarii (dlaczego)

- `motion.div` ładuje pełny zestaw funkcji (47,5 KB gz w Vite/Rollup na 13.2.0); `m.*` + `domAnimation` sync = 33,8 KB gz. Jedno `import { motion }` w dowolnym pliku wciąga pełną wersję do wspólnego chunku i zysk znika po cichu. `LazyMotion strict` zamienia tę cichą regresję w błąd runtime, więc ktoś ją zobaczy.
- `domMax` waży tyle co pełny `motion` (42,7 vs 42,6 KB gz w esbuild). `layout`/`drag` na `domAnimation` nie rzucają błędu: propsy są ignorowane, karta „skacze" zamiast płynąć, a autor szuka błędu w CSS.
- Async `features={() => import(...)}` trzyma elementy w stanie `initial` do czasu dociągnięcia chunku (Motion ≥ 12.28.2): na wolnym łączu hero stoi w `opacity: 0`.
- Dwie biblioteki na jednym elemencie (np. `auto-animate` na liście, w której dzieci są `m.li`) walczą o `transform` w tej samej klatce: podwójny easing, jank.
- Skill `/motion` (Motion AI Kit) doradza `import { motion } from "motion/react"`: jest to poprawne dla ogólnego projektu, ale NIE dla tego repo. Strażnik ma pierwszeństwo nad `/motion`.

#### Niepoprawnie

```tsx
// site/src/components/Bento.tsx
import { motion } from "motion/react";               // pełny bundle, strict rzuci błąd
export function Bento() {
  return <motion.ul layout>{/* layout bez domMax: cicho ignorowane */}</motion.ul>;
}
```

```tsx
// site/src/motion/provider.tsx
<LazyMotion features={() => import("./features").then((r) => r.default)}>  // async: hero w initial na wolnym łączu
```

```tsx
import { useAutoAnimate } from "@formkit/auto-animate/react";   // druga biblioteka na stronie
```

#### Poprawnie

```tsx
// site/src/motion/provider.tsx
import { LazyMotion, domAnimation, MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { DUR, EASE_OUT } from "./tokens";

export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user" transition={{ duration: DUR.base, ease: EASE_OUT }}>
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
```

```tsx
// site/src/components/Bento.tsx
import * as m from "motion/react-m";
import { fadeUp, group } from "@/motion/presets";
import { VIEWPORT_ONCE } from "@/motion/tokens";

export function Bento({ cells }: { cells: Cell[] }) {
  return (
    <m.ul variants={group} initial="hidden" whileInView="show" viewport={VIEWPORT_ONCE}>
      {cells.map((c) => (
        <m.li key={c.key} variants={fadeUp}>{c.title}</m.li>
      ))}
    </m.ul>
  );
}
```

Montaż: `main.tsx` → `<StrictMode><BrowserRouter><LangProvider><MotionProvider><App/></MotionProvider></LangProvider></BrowserRouter></StrictMode>`.

#### Test

```bash
# z katalogu repo; oczekiwany wynik każdej komendy: 0 trafień
grep -rnE 'from "motion/react"' site/src | grep -E '\bmotion\b[^/]' | grep -vE 'motion/react-m'      # import { motion }
grep -rnE 'import \{[^}]*\bmotion\b[^}]*\} from "motion/react"' site/src
grep -rnE 'framer-motion|motion/react-client|from "gsap"|@react-spring|animejs|lottie-web|@formkit/auto-animate' site/src site/package.json
grep -rnE '\b(layout|layoutId|drag|dragConstraints)=' site/src                                   # domMax API bez decyzji
grep -rnE '<(Reorder|LayoutGroup)[ .>]' site/src
grep -rnE 'features=\{\s*\(\)\s*=>' site/src/motion                                               # async features
# musi istnieć dokładnie jeden LazyMotion i ma strict:
grep -rnE '<LazyMotion' site/src | wc -l          # = 1
grep -rnE '<LazyMotion[^>]*strict' site/src | wc -l   # = 1
# wersja przypięta:
node -e 'const p=require("./site/package.json");if(p.dependencies.motion!=="13.2.0")process.exit(1)'
```

Docelowo: `node scripts/check-motion.mjs` (sekcja `imports`) wykonuje te same sprawdzenia i zwraca findings `motion-one-library-lazymotion`.

#### Wyjątki

- `src/prerender/entry.tsx` nie importuje niczego z `motion/*` (patrz `motion-no-motion-in-prerender`), więc reguła dotyczy `site/src` bez `prerender/`.
- Przełączenie na `domMax` jest dozwolone wyłącznie razem z wpisem decyzji w `docs/plan/nastepne-kroki.md` (data, powód, pomiar chunku przed/po) i aktualizacją `motion-bundle-budget-motion`.

### 3.11 motion-view-transition-rules

**View Transitions: React 19.3 <ViewTransition> tylko wokół <Routes> i tylko w fazie 2; nigdy VT + Motion na jednym elemencie; nigdy flushSync(navigate) pod BrowserRouter**

Impact: **HIGH** · Tagi: motion, view-transitions, react-router, react-19-3, routing · Źródło: feasibility-perf §5.2 p.1/§9 p.2 · motion-dev §4.6/§8.4 · synthesis §2.4.6 · showreel §5.5 · rozstrzygnięcie nadrzędne (3): React 19.3.0 stable eksportuje ViewTransition/addTransitionType/Activity; upgrade = faza 2 · Dodano: 2026-09-12 · Plik: `rules/motion-view-transition-rules.md`

#### Zasada

Faza 1 (React 19.2.x, `react-router-dom` 7.18.x `BrowserRouter` deklaratywny): przejścia tras robi `PageFade` (fade + `y` 6 px, 240 ms, `EASE_STD`, bez `exit`, `initial={false}` na pierwszym montażu). Żadnego `document.startViewTransition`, żadnego `<ViewTransition>`.

**Wersja Reacta jest PRZYPIĘTA co do patcha** (faza 0): `"react": "19.2.7"`, `"react-dom": "19.2.7"` w `site/package.json` — dokładnie, bez caretu, tak samo jak `motion@13.2.0` (`motion-one-library-lazymotion`). Dziś stoi tam `"^19.1.0"` (zainstalowane 19.2.7), więc zwykłe `npm install` może wciągnąć 19.3.x i UDOSTĘPNIĆ `ViewTransition` przed decyzją D-18 — a ta reguła ma temu zapobiegać. Bramka sprawdza wersję ZAINSTALOWANĄ (`node_modules/react/package.json`), nie zakres z `dependencies`: zakres z caretem nie mówi, co realnie leży w drzewie.

Faza 2 (po upgrade do `react@19.3.0`/`react-dom@19.3.0` w osobnym commicie, po ≥ 2 tygodniach od publikacji v1; decyzja D-18):

1. `<ViewTransition>` z `react` (stabilny od 19.3.0; skill `react-view-transitions` każe instalować `react@canary`: NIEAKTUALNE, ignorować tę sekcję) opakowuje `<Routes>` w `App.tsx`; `Navbar` i `Footer` są POZA nim (`view-transition-name: chrome` + `::view-transition-group(chrome) { animation: none }`).
2. Działa bez zmiany routera, bo `BrowserRouter` owija `setState` nawigacji w `React.startTransition` (`react-router/dist/development/chunk-KS7C4IRE.mjs:10406-10412`), a React animuje `<ViewTransition>` tylko dla aktualizacji oznaczonych jako Transition.
3. Gdy VT wchodzi, `PageFade` wychodzi: nigdy View Transition i Motion (`m.*`, `AnimatePresence`) na TYM SAMYM elemencie/poziomie drzewa. Motion zostaje dla stanów w obrębie strony (dialog, menu, reveale).
4. `document.startViewTransition(cb)` wywoływane ręcznie pod `BrowserRouter` wymaga ALBO `<BrowserRouter useTransitions={false}>` ALBO callbacku asynchronicznego, który rozwiązuje się po commicie nowej trasy (np. promise z `useLayoutEffect` nowej strony). `document.startViewTransition(() => flushSync(() => navigate(to)))` NIE DZIAŁA (patrz mechanizm) i jest zakazane.
5. `react-router` `<Link viewTransition>` nie istnieje w trybie deklaratywnym (docs: „Declarative Mode ❌"); nie migrować na `createBrowserRouter` tylko dla VT.
6. CSS: `::view-transition-old(root), ::view-transition-new(root) { animation-duration: var(--duration-base); animation-timing-function: var(--ease-std) }` + `@media (prefers-reduced-motion: reduce) { ::view-transition-group(*), ::view-transition-old(*), ::view-transition-new(*) { animation: none !important } }`.
7. `Suspense` lazy tras zostaje WEWNĄTRZ komponentu strony (fallback = skeleton), nie między `<ViewTransition>` a `<Routes>`.
8. `ScrollToTop` zostaje bez zmian (VT nie koliduje).

#### Mechanizm awarii (dlaczego)

- `flushSync` wypłukuje tylko lane synchroniczny; update nawigacji jest w lane transition, więc callback VT kończy się ze STARYM DOM-em: przeglądarka robi crossfade „stare → stare", a nowa trasa wskakuje po nim bez animacji, z fallbackiem Suspense lazy trasy poza VT (CONFIRMED przez sędziego wykonalności na kodzie routera 7.18.1). To samo dotyczy `setSearchParams` (idzie przez `navigate`).
- `useTransitions={false}` naprawia VT, ale ma koszt: lazy trasy pokazują fallback zamiast trzymać stary widok. Decyzja musi być świadoma, stąd „tylko po decyzji".
- VT jest nieprzerywalne, overlay `fixed` blokuje scroll na czas animacji; interakcja z `BrowserRouter`/`Suspense`/`ScrollToTop` nie była testowana w tym repo; 19.3.0 wyszło 2026-09-09. Stąd faza 2 po stabilizacji.
- Bramka czytająca ZAKRES (`p.dependencies.react` = `"^19.1.0"`) robi dwie szkody naraz: zapala fałszywy alarm na zgodnym stanie (zainstalowane 19.2.7) i NIE łapie tego, przed czym ma chronić — caret przepuszcza 19.3.x przy pierwszym `npm install`, a wtedy `ViewTransition` staje się dostępny bez decyzji D-18. Dlatego: pin w `package.json` + pomiar w `node_modules`.
- VT + Motion na jednym elemencie: snapshot VT łapie element w połowie animacji Motion, crossfade „zamrożonej" klatki, a po VT Motion dokańcza ruch: podwójne przejście.
- Wsparcie: Chromium 125+ (React potrzebuje obiektowej formy `startViewTransition`), Firefox 144+, Safari 18.2+; bez wsparcia nawigacja działa bez animacji (degradacja OK).

#### Niepoprawnie

```tsx
// useVtNavigate.ts (szkic z koncepcji proof: NIE DZIAŁA pod BrowserRouter)
const navigate = useNavigate();
return (to: string) => {
  if (!document.startViewTransition) return navigate(to);
  document.startViewTransition(() => flushSync(() => navigate(to)));   // stary DOM w snapshocie
};
```

```tsx
// VT i Motion na tym samym poziomie
<ViewTransition default="page">
  <AnimatePresence mode="wait"><Routes location={location} key={location.pathname}>…</Routes></AnimatePresence>
</ViewTransition>
```

#### Poprawnie

```tsx
// FAZA 1: App.tsx
<Navbar />
<PageFade>
  <main id="main"><Routes>…</Routes></main>
</PageFade>
<Footer />

// FAZA 2 (po D-18): App.tsx, react 19.3.0
import { ViewTransition } from "react";
<Navbar />                                  {/* CSS: header, footer { view-transition-name: chrome } */}
<ViewTransition default="page">
  <main id="main"><Routes>…</Routes></main> {/* PageFade usunięty */}
</ViewTransition>
<Footer />

// FAZA 2, kierunek nawigacji (opcjonalnie): lista → detal
import { addTransitionType, startTransition } from "react";
onClick={(e) => { e.preventDefault(); startTransition(() => { addTransitionType("nav-forward"); navigate(to); }); }}
<ViewTransition enter={{ "nav-forward": "page-from-right", "nav-back": "page-from-left", default: "page" }}>
```

```css
::view-transition-old(root), ::view-transition-new(root) { animation-duration: var(--duration-base); animation-timing-function: var(--ease-std); }
::view-transition-group(chrome) { animation: none; }
@media (prefers-reduced-motion: reduce) { ::view-transition-group(*), ::view-transition-old(*), ::view-transition-new(*) { animation: none !important; } }
```

#### Test

```bash
# faza 1 (oczekiwane: 0)
grep -rnE 'startViewTransition|ViewTransition|addTransitionType|viewTransition' site/src
# wersja ZAINSTALOWANA (nie zakres): 19.2.x do czasu decyzji D-18
node -e 'const v=require("./site/node_modules/react/package.json").version; if(!/^19\.2\./.test(v))console.log("react poza fazą 1:",v)'
node -e 'const v=require("./site/node_modules/react-dom/package.json").version; if(!/^19\.2\./.test(v))console.log("react-dom poza fazą 1:",v)'
# pin bez caretu w package.json (faza 0)
node -e 'const d=require("./site/package.json").dependencies; for (const k of ["react","react-dom"]) if(!/^19\.\d+\.\d+$/.test(d[k]))console.log(k+" nieprzypięty:",d[k])'
# faza 2 (po D-18):
grep -rnE 'flushSync\([^)]*navigate' site/src                         # = 0 (zawsze)
grep -rnE '<ViewTransition' site/src | wc -l                           # = 1 (wokół Routes) + ewentualne name= na shared elements
grep -rnE 'PageFade' site/src | grep -v 'motion/PageFade.tsx'          # = 0 po wejściu VT
grep -rnE 'react@canary|"react":\s*"canary"' site/package.json .claude/skills/react-view-transitions -r   # informacyjnie: sekcja canary skilla nieaktualna
# ręcznie: Chrome 125+ nawigacja / → /narzedzia → /narzedzia/raport-zarzadczy → wstecz: crossfade, brak podwójnego przejścia, brak fallbacku Suspense w VT;
# Safari 17 (bez VT): nawigacja działa bez animacji.
```

#### Wyjątki

- Upgrade do `react@19.3.0`/`react-dom@19.3.0` jest osobnym commitem z decyzją D-18 w `docs/plan/nastepne-kroki.md` (data, powód, wynik spike'u `BrowserRouter`/`Suspense`/`ScrollToTop`); w tym samym commicie zmieniają się: pin w `package.json`, obie bramki wersji powyżej i zdanie „Faza 1" w tej regule.
- Shared element (`<ViewTransition name={`tool-${slug}`}>` na posterze karty i nagłówku podstrony) dozwolony w fazie 2 pod warunkiem, że ten element NIE jest `m.*`.
- Motion `animateView()` (wrapper VT z `motion/react`) nie jest używany: React-owy komponent `AnimateView` to Motion+ Early Access.

### 3.12 motion-counters-pattern

**Liczniki: useMotionValue(to) + animate jako dziecko m.span, useInView once, brak animacji gdy element widoczny od pierwszej klatki, jump przy reduced, liczba w shellu na stałe**

Impact: **MEDIUM** · Tagi: motion, counter, numbers, prerender, a11y · Źródło: motion-dev §4.7 · synthesis §2.4.3 Counter · showreel §5.6 · feasibility-perf §5.3 (CLS cyfr) · ui-kit-habits C1 (tabular-nums) · Dodano: 2026-09-12 · Plik: `rules/motion-counters-pattern.md`

#### Zasada

Jeden komponent `src/motion/Counter.tsx` dla wszystkich liczników (pasek S5 „W liczbach", KPI w dashboardach, jeśli kiedyś). Kontrakt:

- `useMotionValue(to)` (WARTOŚĆ KOŃCOWA jako stan początkowy — tyle samo, ile drukuje shell prerenderu) + `animate(count, to, …)` dopiero po `count.jump(0)` w chwili wejścia w viewport; `useInView(ref, { once: true, amount: 0.6 })`; `controls.stop()` w cleanupie,
- **rozróżnienie „widoczny od razu" vs „wjechał później"**: w pierwszym przebiegu efektu zapamiętujemy w refie `el.getBoundingClientRect().top < window.innerHeight`. Jeśli element był w viewporcie już w pierwszej klatce (wysoki ekran 2560 px, krótszy układ home po zmianie sekcji, wejście z kotwicy `#liczby`), licznik NIE animuje: zostaje wartość końcowa. Animujemy wyłącznie wtedy, gdy element wjechał w viewport PÓŹNIEJ,
- tekst renderowany przez `useTransform(() => format(count.get()))` przekazany jako DZIECKO `m.span` (zero re-renderów Reacta per klatka; nigdy `useState` + `onUpdate`),
- `useReducedMotion()` → `count.jump(to)` (wartość końcowa natychmiast),
- format przez jeden helper (`toLocaleString("pl-PL"/"en-US")` albo `fmtMoney` dla kwot), `font-variant-numeric: tabular-nums`, `min-width` w `ch` równy liczbie cyfr wartości końcowej (brak przesunięcia layoutu podczas liczenia),
- wartość końcowa `to` pochodzi z `MESSAGING.allowedNumbers` lub z silnika (`aggregate`), nigdy z literału w JSX,
- w shellu prerenderu liczba jest wpisana na stałe (crawler nie widzi animacji); dwa mechanizmy powyżej (`useMotionValue(to)` + test „widoczny od razu") gwarantują, że pierwszy render Reacta drukuje TĘ SAMĄ liczbę co shell — bez nich sekwencja to `12` (shell) → `0` (React) → liczenie, czyli mignięcie zakazane przez `motion-no-initial-hidden-above-fold` (BLOCKER),
- `duration: 1.2` jest udokumentowanym wyjątkiem od maksimum 0.6 (`motion-tokens-only`); żaden inny czas dla liczników,
- suffix/prefix (`%`, `zł`, `+`) poza `m.span` (nie animowany), `aria-label` z pełną wartością końcową na kontenerze (czytnik nie czyta pośrednich liczb).

Zakazane: Motion+ `AnimateNumber`, `@number-flow/react` (druga biblioteka), liczniki startujące przy montażu (bez `useInView`), liczniki w hero.

#### Mechanizm awarii (dlaczego)

- `useState` aktualizowany w `onUpdate` re-renderuje komponent 60× na sekundę przez 1,2 s; przy 4 licznikach i 12 dashboardach w drzewie to zauważalny jank na laptopach. Motion value jako dziecko `m.*` pisze do DOM bez Reacta.
- Bez `jump` przy reduced licznik liczy mimo ustawienia systemowego (`MotionConfig` nie widzi motion values).
- Bez `tabular-nums` i `min-width` szerokość zmienia się z liczbą cyfr (0 → 12) i przesuwa sąsiadów: CLS w pasku (feasibility-perf §5.3).
- StrictMode: dwa `animate` bez `stop` = licznik skacze.
- `useInView(amount: 0.6)` zwraca `true` TAKŻE w pierwszej klatce, jeśli element już jest w viewporcie — a wtedy `useMotionValue(0)` + start animacji dają mignięcie `12 → 0 → 12` na treści, która w shellu ma wartość końcową. Sama uwaga „element paska S5 jest poniżej folda" (`motion-no-initial-hidden-above-fold`) nie wystarcza: to założenie o UKŁADZIE, którego żaden test nie pilnuje, a zmiana kolejności sekcji je łamie.
- Czytnik ekranu bez `aria-label` czyta losowe wartości pośrednie.

#### Niepoprawnie

```tsx
const [n, setN] = useState(0);
useEffect(() => { animate(0, to, { duration: 2, onUpdate: (v) => setN(Math.round(v)) }); }, [to]);   // setState per klatka, brak stop, brak inView, brak reduced
return <span>{n}</span>;
```

```tsx
const count = useMotionValue(0);                       // shell drukuje 12, React renderuje 0 → mignięcie
useEffect(() => { if (inView) animate(count, to, { duration: 1.2 }); }, [inView]);   // inView === true już w pierwszej klatce na wysokim ekranie
```

#### Poprawnie

```tsx
// src/motion/Counter.tsx
import { useEffect, useRef } from "react";
import * as m from "motion/react-m";
import { animate, useInView, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { EASE_OUT } from "./tokens";

type Props = { to: number; format: (n: number) => string; label: string; className?: string };

export function Counter({ to, format, label, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const count = useMotionValue(to);            // start = wartość końcowa: pierwszy render Reacta == shell prerenderu
  const immediate = useRef<boolean | null>(null);   // czy element był widoczny już w pierwszej klatce
  const text = useTransform(() => format(Math.round(count.get())));
  const width = `${format(to).length}ch`;

  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (immediate.current === null) immediate.current = el.getBoundingClientRect().top < window.innerHeight;
    if (immediate.current || reduce) { count.jump(to); return; }   // widoczny od razu / reduced → bez animacji
    if (!inView) return;                                           // wjedzie później
    count.jump(0);
    const controls = animate(count, to, { duration: 1.2, ease: EASE_OUT }); // motion-tokens-only: wyjątek udokumentowany
    return () => controls.stop();
  }, [inView, reduce, to, count]);

  return (
    <span className={className} aria-label={label} style={{ fontVariantNumeric: "tabular-nums", display: "inline-block", minWidth: width }}>
      <m.span ref={ref} aria-hidden="true">{text}</m.span>
    </span>
  );
}

// użycie (S5): wartość z allowedNumbers, suffix poza licznikiem
const n = MESSAGING.allowedNumbers.find((x) => x.value === "12");
<Counter to={12} format={(v) => v.toLocaleString(lang === "pl" ? "pl-PL" : "en-US")} label={`12 ${pick(lang, n)}`} /> <span>{pick(lang, n)}</span>
```

#### Test

```bash
# jeden komponent licznika; zero konkurencji
grep -rlE 'useMotionValue\(|animate\(count' site/src | grep -v 'motion/Counter.tsx'          # = 0
grep -rnE 'AnimateNumber|number-flow' site/src site/package.json                            # = 0
# kontrakt Counter.tsx
grep -nE 'useInView\(ref, \{ once: true, amount: 0\.6' site/src/motion/Counter.tsx           # = 1
grep -nE 'count\.jump\(to\)' site/src/motion/Counter.tsx                                     # = 1
grep -nE 'useMotionValue\(to\)' site/src/motion/Counter.tsx                                  # = 1 (nie useMotionValue(0))
grep -nE 'getBoundingClientRect\(\)\.top < window\.innerHeight' site/src/motion/Counter.tsx  # = 1 (test „widoczny od razu")
grep -nE 'controls\.stop\(\)' site/src/motion/Counter.tsx                                    # = 1
grep -nE 'tabular-nums' site/src/motion/Counter.tsx                                          # ≥ 1
grep -nE 'onUpdate|useState' site/src/motion/Counter.tsx                                     # = 0
# liczba w shellu na stałe: dist/index.html zawiera wartości końcowe paska S5
grep -cE '>12<|>3 dni<' site/dist/index.html                                                 # ≥ 1 po buildzie
# licznik nie w hero
grep -nE 'Counter' site/src/components/Hero.tsx 2>/dev/null                                  # = 0
# brak mignięcia na wysokim ekranie (Playwright/WebKit ze scratchpadu):
#   viewport 2560×1440, page.goto("/"), odczyt 50 ms po DOMContentLoaded:
#   document.querySelector("[data-metrics] .tnum")?.textContent  → wartość końcowa (≠ "0")
#   ten sam odczyt po 2 s → ta sama wartość
```

#### Wyjątki

- KPI w dashboardach (np. `CostControl` marża) mogą używać `Counter` z `duration` ≤ 0.2 przy zmianie wejścia (motion-charts-static p.3) tylko po jawnej decyzji; dziś są statyczne i to jest domyślne.

### 3.13 motion-hover-fallback

**Hover bez layout shift i z fallbackiem dla pointer: coarse i fokusu; hover animuje kolor/border/opacity, transform tylko na obrazie w overflow:hidden**

Impact: **MEDIUM** · Tagi: motion, hover, a11y, touch, kit · Źródło: ui-kit-habits P2/B2 · bklit-ui §10.7 (showActions) · synthesis §2.3 S3/§2.4.8 tabela degradacji · motion-dev §4.9 · WIG (hover ≠ jedyny nośnik) · Dodano: 2026-09-12 · Plik: `rules/motion-hover-fallback.md`

#### Zasada

1. Hover animuje wyłącznie `color`, `background-color`, `border-color`, `opacity` (CSS, `--duration-fast`, `--ease-out`). `transform` w hover dozwolony tylko na `<img>`/`<video>` wewnątrz kontenera `overflow: hidden` (rama S3: `scale(1.02)`, 240 ms) i na kartach w gridzie (`translateY(-2px)`), nigdy na elementach inline w tekście, nigdy `box-shadow`, `filter`, `backdrop-filter`, `mask`.
2. Żadna informacja ani akcja nie jest dostępna WYŁĄCZNIE przez hover: przyciski akcji karty (np. „Otwórz", „Pobierz PDF"), klipy hover ściany S3 (v1, cztery kafle pierwszego rzędu; na dotyku NIE powstają, a tap otwiera podstronę z żywym dashboardem), tooltipy mają odpowiednik dla `(pointer: coarse)` i `:focus-visible`. Wzorzec: `showActions = reducedMotion || coarsePointer || hoverFine || focused`.
3. `whileHover`/`whileTap` z Motion tylko na natywnie fokusowalnych elementach (`button`, `a`); Motion dodaje `tabindex` do `whileTap`, ale semantykę daje HTML. `whileTap={{ scale: 0.98 }}` jest zbędne, bo kit ma `.btn:active { transform: scale(.98) }`.
4. Hover-klipy (faza 2): start na `mouseenter`/`focus`, pauza na `mouseleave`/`blur`, max 1 aktywny klip, tylko `pointer: fine`, reduced-motion → poster; na `pointer: coarse` element pokazuje poster i link „Odtwórz podgląd" (nie autoplay).

#### Mechanizm awarii (dlaczego)

- Kit: „przycisk unosi się bez transformu i bez kolorowej poświaty: zero layout shift" (SKILL.md:161-167); `backdrop-filter`/`mask` w hover powodowały migotanie na części GPU (`app.css:1-4`).
- ~60 % ruchu na `/` z LinkedIn na telefonie: hover nie istnieje. Akcja tylko na hover = akcja niewidoczna dla głównego kanału (bklit rozwiązuje to `showActions` z `matchMedia("(hover: hover) and (pointer: fine)")`).
- Klawiatura/czytnik: `:focus-visible` musi pokazywać to samo, co hover, inaczej WCAG 2.1.1/1.4.13.
- `transform` na elemencie inline zmienia linię tekstu (layout shift); `box-shadow` w hover to paint co klatkę.

#### Niepoprawnie

```tsx
<m.a whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(0,0,0,.5)" }} />          // paint + transform na linku
<div className="card group"><button className="hidden group-hover:block">Otwórz</button></div>   // akcja tylko na hover
<span className="hover:scale-105 transition-transform">KSeF</span>                  // inline w tekście
```

#### Poprawnie

```tsx
// rama S3: obraz skaluje się w overflow:hidden, akcja = cały <a>, fokus widoczny
<a className="case-frame" href={`/narzedzia/${tool.slug}`}>
  <img src={tool.media.wide} alt="" width={1280} height={800} loading="lazy" decoding="async" />
  <span className="case-meta">…</span>
</a>
/* CSS */
.case-frame { overflow: hidden; border: 1px solid var(--border); transition: border-color var(--duration-fast) var(--ease-out); }
.case-frame img { transition: transform var(--duration-base) var(--ease-out); }
.case-frame:hover img, .case-frame:focus-visible img { transform: scale(1.02); }
.case-frame:hover, .case-frame:focus-visible { border-color: var(--accent); }
@media (prefers-reduced-motion: reduce) { .case-frame img { transition: none; } .case-frame:hover img { transform: none; } }

// akcje widoczne zawsze na coarse/fokusie (wzorzec bklit)
const coarse = useMediaQuery("(hover: none), (pointer: coarse)");
const showActions = reduce || coarse || hovered || focused;
<div className="card-actions" style={{ opacity: showActions ? 1 : 0 }} aria-hidden={!showActions}>…</div>
```

#### Test

```bash
# hover z zakazanymi właściwościami (oczekiwane: 0)
grep -rnE 'whileHover=\{[^}]*(boxShadow|filter|width|height|y:\s*-?[5-9]|y:\s*-?[1-9][0-9])' site/src
grep -rnE ':hover[^{]*\{[^}]*(box-shadow|filter|backdrop-filter|mask)' site/src --include=*.css | grep -v company-ui.css
grep -rnE 'group-hover:(block|flex|opacity-100)|hover:scale' site/src --include=*.tsx     # akcja/transform tylko na hover (ocena LLM: czy jest fallback)
# każdy :hover ma :focus-visible obok (oczekiwane: liczby równe w plikach CSS strony)
for f in site/src/styles/globals.css site/src/styles/tokens.css; do [ -f "$f" ] && printf '%s hover=%s focus=%s\n' "$f" "$(grep -c ':hover' "$f")" "$(grep -c ':focus-visible' "$f")"; done
# ręcznie: Playwright WebKit 390×844 (pointer: coarse) → karty S3/hub: wszystkie akcje widoczne bez hover; Tab po stronie: ten sam stan co hover.
```

#### Wyjątki

- `.tools-col:hover { background: rgba(168,180,194,.07) }` (pas działów) to kolor: zgodne.
- `whileTap` na przyciskach kitu jest zbędne, nie zakazane; jeśli użyte, tylko `scale` i tylko z `.btn` bez CSS `transition: transform`.

### 3.14 motion-motivated

**Każda animacja ma motywację w jednym zdaniu; brak zdania = brak animacji**

Impact: **MEDIUM** · Tagi: motion, design, review · Źródło: taste §7.1 („MOTION MUST BE MOTIVATED") · synthesis §2.4.7 (tabela z motywacją) · motion-design (zasady Disney: staging, appeal) · decyzje Karola 2026-07-22/26 · Dodano: 2026-09-12 · Plik: `rules/motion-motivated.md`

#### Zasada

Każdy ruch na stronie (Motion, CSS transition/keyframes, wideo, crossfade) ma zapisaną motywację w JEDNYM zdaniu, w jednym z dwóch miejsc:

1. tabela „Lista animacji" w `docs/plan/motion-registry.md` (kopia tabeli synthesis §2.4.7: sekcja · element · animacja · API · motywacja), albo
2. komentarz nad elementem w kodzie: `// motion: <motywacja>` (np. `// motion: hierarchia czytania L→R`).

Dozwolone kategorie motywacji (taste §7.1): **hierarchia** (kieruje wzrok), **storytelling** (sekwencja odpowiada narracji, np. kierunek danych w `KsefFlow`), **feedback** (potwierdza akcję: hover, tap, otwarcie), **stan** (pokazuje, że coś się zmieniło: swap zakładki, nowy wynik). Niedozwolone: „wygląda premium", „strona musi się ruszać", „bo mamy Motion".

Rejestr home w v2 (zamknięty; kolejność sekcji po reframe z 2026-09-12 i po decyzjach D35/D37/D38):

| Sekcja | Ruch | Motywacja (kategoria) |
|---|---|---|
| S1 hero | crossfade poster → **nagranie narzędzia** (600 ms), stop na ostatniej klatce | stan: kadr pokazuje, że liczby nie są obrazkiem, tylko wynikiem |
| S2 żywe demo | `ChaosToOrder` (stan ładowania) → `ChartReveal` raz | storytelling + stan: rozsypane dane układają się w wynik, dokładnie to, co firma sprzedaje |
| S3 ściana 13 | `RevealGroup` fadeUp + hover hairline + **klip hover na 4 kaflach pierwszego rzędu** | feedback + stan: odkrycie, że każdy prostokąt jest działającym narzędziem |
| S4 bento | fadeUp, hover tła | hierarchia |
| S5 efekty | hairline `scaleX`, potem pozycje | hierarchia |
| S6 ludzie | portrety fade (bez ruchu twarzy) | hierarchia |
| S7 kalkulator | wiersze ✕/✓ kaskadą, kadr fade | hierarchia |
| S8 kroki | hairline łącznika `scaleX` → kroki | storytelling: linia rysuje kierunek procesu |
| S9 zamknięcie | fadeUp | hierarchia |
| globalne | nav menu mobilne, dialog, `PageFade`, skeleton dashboardu + `.chart-reveal` | feedback / stan |

Wiersz „S5 liczniki" **usunięty**: pasek „W liczbach" nie istnieje (D30), a `Counter` nie ma konsumenta. Nowa animacja = nowy wiersz w rejestrze w tym samym PR.

#### Mechanizm awarii (dlaczego)

- Karol dwukrotnie kazał usuwać efekty (karuzela 2026-07-22, deck 2026-07-26): oba były „ładne", żadne nie miało funkcji. Zdanie motywacji przed napisaniem kodu odsiewa je wcześniej i taniej.
- Persona (CFO/właściciel firmy produkcyjnej, „kalkulator, nie wróżka") czyta nadmiar ruchu jako agencję marketingową, nie wykonawcę narzędzi.
- Rejestr pozwala audytorowi mechanicznie porównać: „ruchów w kodzie" vs „wierszy w rejestrze"; różnica = animacja bez decyzji.

#### Niepoprawnie

```tsx
// „dla ożywienia sekcji"
<m.div animate={{ rotate: [0, 2, -2, 0] }} transition={{ repeat: Infinity, duration: 6 }} className="hero-badge" />
<m.h2 initial={{ opacity: 0, filter: "blur(8px)" }} whileInView={{ opacity: 1, filter: "blur(0)" }} />   // blur bez powodu
```

#### Poprawnie

```tsx
// motion: sekwencja węzłów = kierunek danych (KSeF → connector → baza u Ciebie → pulpity); raz, opacity, 3 × 120 ms
<m.g variants={nodeSeq} initial="hidden" whileInView="show" viewport={VIEWPORT_ONCE}>…</m.g>

// motion: feedback „klikalne" (hover obrazu w ramie S3); CSS transform w overflow:hidden
<a className="case-frame" href={`/narzedzia/${tool.slug}`}><img … /></a>
```

#### Test

```bash
# liczba elementów z ruchem w kodzie vs liczba wierszy rejestru (różnica → ocena LLM)
grep -rnE '<m\.|whileInView=|animate=\{|@keyframes|<video|transition:' site/src --include=*.tsx --include=*.css | grep -vE 'company-ui\.css|motion/(presets|tokens|provider)' | wc -l
grep -cE '^\|' docs/plan/motion-registry.md
# pętle nieskończone poza skeletonem (oczekiwane: 0)
grep -rnE 'repeat:\s*Infinity|infinite' site/src | grep -vE 'skel|company-ui\.css'
# każdy nowy m.* poza katalogiem motion/ ma komentarz „motion:" w 3 liniach powyżej albo wiersz w rejestrze (ocena LLM w motion-auditor)
```

#### Wyjątki

- Elementy kitu z hoverem CSS (`.btn`, `.chip`, `.st`, `.cell`) mają motywację zbiorczą „feedback" i nie wymagają komentarza per element.

### 3.15 motion-tier-flag

**Jeden kill-switch ruchu i mediów: MOTION_TIER full/still/calm w tokens.ts, z którego wynika MEDIA_ENABLED; nigdy druga ścieżka renderu**

Impact: **MEDIUM** · Tagi: motion, media, kill-switch, flags · Źródło: synthesis §1.4 (kill-switch → MEDIA_ENABLED) i §1.6 (MOTION_TIER jako druga ścieżka: odrzucone) · showreel §5.9 „Tryb awaryjny" · feasibility-perf §4.3 p.6 · Dodano: 2026-09-12 · Plik: `rules/motion-tier-flag.md`

#### Zasada

W `site/src/motion/tokens.ts` istnieje dokładnie jedna stała trybu i jedna pochodna:

```ts
export const MOTION_TIER: "full" | "still" | "calm" = "full";   // "still" = media off; "calm" = tryb awaryjny całego ruchu
export const MEDIA_ENABLED = MOTION_TIER === "full";             // wideo hero, klipy hover ściany, GLSL Hills (plan B)
```

Semantyka trzech wartości:

1. **`full`**: wszystko działa.
2. **`still` (kill-switch mediów, od 2026-09-12)**: `MEDIA_ENABLED = false` → `HeroMedia` renderuje wyłącznie poster `<img>` (kadr produktu), klipy hover w `ToolWall` i tło three.js nie montują się. **`MotionProvider` zostaje na `reducedMotion="user"`**: reveale, `PageFade`, dialog i `ChaosToOrder` działają bez zmian.
3. **`calm` (tryb awaryjny)**: `still` plus `MotionProvider` przekazuje `reducedMotion="always"` → wszystkie `m.*` tracą transformy, zostaje `opacity` (identycznie jak przy systemowym reduced-motion); `ChartReveal` i `ChaosToOrder` czytają `useReducedMotion()` → `initial={false}`.

Po co trzecia wartość: wycofanie wideo ma być wykonane **w minutę, pod presją** (`docs/plan/warstwa-wrazenia.md` §8, poziom W0). Dopóki jedyną drogą do wyłączenia mediów było `calm`, gaszenie jednego `<video>` spłaszczało całą stronę, więc founder się wahał i awaria trwała dłużej. `still` nie dokłada ani jednego `if` w komponentach.

Konsekwencja: żadna wartość NIE dodaje wariantu renderu. Stała jest czytana w DOKŁADNIE czterech miejscach: `provider.tsx` (reducedMotion), `HeroMedia.tsx` (`wantsVideo()` przez `MEDIA_ENABLED`), `ToolWall.tsx` (klipy hover przez `MEDIA_ENABLED`) i `App.tsx`/`useAnimatedBg` (plan B GLSL). Każde inne odwołanie do `MOTION_TIER`/`MEDIA_ENABLED` w `site/src` = fail. Zakazane: warianty renderu `tier === "calm" ? <A/> : <B/>`, osobne komponenty `*Calm`, drugi zestaw presetów, flagi per sekcja.

Zmiana wartości = commit z komunikatem `Motion: tryb still (powód: …)` albo `Motion: tryb calm (powód: …)` i wpis w „Stanie operacyjnym" CLAUDE.md.

#### Mechanizm awarii (dlaczego)

- Showreel proponował `MOTION_TIER="calm"` jako alternatywną ścieżkę renderu (bez pinowania/parallaxu/hover-wideo); sędzia wykonalności odrzucił: „każdy komponent ma dwie ścieżki" = trzykrotny koszt utrzymania i testów (każdy audyt ×2, każdy zrzut ×2). Synteza zastąpiła to jednym booleanem `MEDIA_ENABLED`.
- Tryb awaryjny jest potrzebny (incydent iOS „samo tło" 2026-07-24 pokazał, że trzeba umieć wyłączyć media jedną linią bez przebudowy), ale musi być konfiguracją providera, nie logiką w komponentach.
- Flaga rozsiana po komponentach dryfuje: jedna sekcja ją sprawdza, druga nie; po pół roku nikt nie wie, co `calm` naprawdę wyłącza.

#### Niepoprawnie

```tsx
// Bento.tsx
import { MOTION_TIER } from "@/motion/tokens";
return MOTION_TIER === "calm" ? <BentoStatic cells={cells} /> : <BentoAnimated cells={cells} />;   // druga ścieżka renderu

// presets.ts
export const fadeUp = MOTION_TIER === "calm" ? fadeCalm : fadeFull;   // drugi zestaw presetów

// .env / import.meta.env.VITE_MOTION_TIER   // konfiguracja poza tokens.ts; niedeterministyczny build
```

#### Poprawnie

```tsx
// src/motion/tokens.ts
export const MOTION_TIER: "full" | "still" | "calm" = "full";
export const MEDIA_ENABLED = MOTION_TIER === "full";

// src/motion/provider.tsx
import { MOTION_TIER, DUR, EASE_OUT } from "./tokens";
<MotionConfig reducedMotion={MOTION_TIER === "calm" ? "always" : "user"} transition={{ duration: DUR.base, ease: EASE_OUT }}>
// „still" świadomie NIE przełącza reducedMotion: gasi wyłącznie media

// src/components/HeroMedia.tsx i src/components/ToolWall.tsx (klipy hover)
import { MEDIA_ENABLED } from "@/motion/tokens";
function wantsVideo() { if (typeof window === "undefined" || !MEDIA_ENABLED) return false; /* …reduced/coarse/saveData… */ }

// src/App.tsx (plan B tła; tylko jeśli GLSL Hills wraca po D-08)
const animatedBg = useAnimatedBg() && MEDIA_ENABLED;
```

#### Test

```bash
# definicja dokładnie raz, w tokens.ts
grep -rnE 'export const MOTION_TIER' site/src | wc -l          # = 1 (site/src/motion/tokens.ts)
grep -rnE 'export const MEDIA_ENABLED' site/src | wc -l        # = 1 (site/src/motion/tokens.ts)
# odwołania tylko w trzech dozwolonych plikach
grep -rlE 'MOTION_TIER|MEDIA_ENABLED' site/src | grep -vE 'motion/tokens\.ts|motion/provider\.tsx|components/HeroMedia\.tsx|components/ToolWall\.tsx|App\.tsx'   # = 0
grep -nE 'MOTION_TIER: "full" \| "still" \| "calm"' site/src/motion/tokens.ts   # = 1 (trzy wartości)
# brak drugiej ścieżki renderu i env
grep -rnE 'Calm\b|calm\s*\?|=== "calm" \?' site/src --include=*.tsx | grep -v provider.tsx   # = 0
grep -rnE 'VITE_MOTION|VITE_MEDIA' site/ .env* 2>/dev/null                                    # = 0
# smoke W0: ustawić "still", build, WebKit desktop: brak <video> i brak klipów hover, ale reveale i PageFade DZIAŁAJĄ; wrócić do "full".
# smoke tryb awaryjny: ustawić "calm": brak <video> ORAZ reveale spłaszczone do opacity; wrócić do "full".
```

#### Wyjątki

- Brak. Testy jednostkowe mogą mockować `MEDIA_ENABLED` przez `vi.mock`/`t.mock` bez zmiany pliku.

### 3.16 motion-tokens-only

**Czasy, krzywe, stagger i przesunięcia wyłącznie z src/motion/tokens.ts i zmiennych CSS**

Impact: **MEDIUM** · Tagi: motion, tokens, css, consistency · Źródło: synthesis §2.4.1 · showreel M11 · ui-kit-habits F5 (M5) · company-ui app.css:49-50 · motion-design „Brand Motion Identity" · Dodano: 2026-09-12 · Plik: `rules/motion-tokens-only.md`

#### Zasada

Jedno źródło stałych ruchu: `site/src/motion/tokens.ts` (dla Motion/TS) i lustrzane zmienne w `site/src/styles/tokens.css` (dla CSS kitu). Wartości są zamrożone:

```ts
// site/src/motion/tokens.ts
export const EASE_OUT  = [0.22, 1, 0.36, 1] as const;   // = --ease-out (kit); wejścia, hover
export const EASE_SOFT = [0.3, 0.7, 0.3, 1] as const;   // = --ease-soft; clip-reveal danych
export const EASE_STD  = [0.4, 0, 0.2, 1] as const;     // = --ease-std; przejścia tras, crossfade
export const DUR = { quick: 0.16, base: 0.24, reveal: 0.42, media: 0.6 } as const; // sekundy; 0.6 = maksimum
export const STAGGER = 0.05;   // 50 ms między dziećmi; kaskada ≤ 12 dzieci
export const SHIFT = 12;       // px; jedyne przesunięcie wejścia; duże powierzchnie: 0
export const VIEWPORT_ONCE = { once: true, amount: 0.25, margin: "0px 0px -10% 0px" } as const;
```

```css
/* site/src/styles/tokens.css (fragment ruchu) */
--duration-fast: 160ms; --duration-base: 240ms; --duration-slow: 420ms; --duration-media: 600ms;
--ease-out: cubic-bezier(.22, 1, .36, 1); --ease-soft: cubic-bezier(.3, .7, .3, 1); --ease-std: cubic-bezier(.4, 0, .2, 1);
```

W komponentach: `transition={{ duration: DUR.reveal, ease: EASE_OUT }}`, `y: SHIFT`, `delayChildren: stagger(STAGGER, ...)`; w CSS: `transition: background-color var(--duration-fast) var(--ease-out)`. Zakazane: literały `duration: 0.35`, `ease: [0.16, 1, 0.3, 1]`, `y: 24`, `transition: opacity 300ms ease`, `cubic-bezier(...)` poza `tokens.css` i `company-ui.css`.

Archetyp marki: Corporate-precise (`motion-design`: 200–400 ms, 0 % overshoot). Sprężyny (`type: "spring"`) są dozwolone tylko w `presets.ts` i tylko z `bounce: 0`; nie ma ich w fazie 1.

#### Mechanizm awarii (dlaczego)

- Trzy różne czasy „wejścia" na jednej stronie (300/420/600) czytają się jako trzy różne strony. Karol dwukrotnie cofał efektowność (karuzela 2026-07-22, deck 2026-07-26); rozjazd czasów to pierwszy objaw „strony sklejanej z szablonów".
- Literał w komponencie nie zmienia się przy zmianie decyzji o archetypie; tokeny zmieniają cały serwis jedną edycją.
- Kit `company-ui` ma własne `--motion: 200ms cubic-bezier(.22,1,.36,1)` i `--ease-out`/`--ease-soft`; jeśli Motion użyje innej krzywej dla tego samego elementu (np. `.btn` z CSS transition + `whileHover`), powstaje podwójny easing (patrz `motion-no-transition-all-no-linear`).
- Krzywa `[0.16, 1, 0.3, 1]` z taste-skill jest praktycznie równoważna `--ease-out`; dopuszczamy TYLKO `EASE_OUT`, żeby audyt był grepowalny.

#### Niepoprawnie

```tsx
<m.li initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }} />
```

```css
.case-frame img { transition: transform 300ms ease-in-out; }
.cell:hover { transition: background .2s cubic-bezier(.4,0,.2,1); }
```

#### Poprawnie

```tsx
import * as m from "motion/react-m";
import { fadeUp } from "@/motion/presets";
import { VIEWPORT_ONCE } from "@/motion/tokens";

<m.li variants={fadeUp} initial="hidden" whileInView="show" viewport={VIEWPORT_ONCE} />
```

```ts
// site/src/motion/presets.ts
import { stagger, type Variants } from "motion/react";
import { DUR, EASE_OUT, SHIFT, STAGGER } from "./tokens";
export const fadeUp: Variants = { hidden: { opacity: 0, y: SHIFT }, show: { opacity: 1, y: 0, transition: { duration: DUR.reveal, ease: EASE_OUT } } };
export const fade: Variants   = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: DUR.media, ease: EASE_OUT } } };
export const group: Variants  = { hidden: {}, show: { transition: { delayChildren: stagger(STAGGER, { startDelay: 0.08 }) } } };
```

```css
.case-frame img { transition: transform var(--duration-base) var(--ease-out); }
.cell:hover { transition: background-color var(--duration-fast) var(--ease-out); }
```

#### Test

```bash
# literały czasu/krzywej w TSX poza katalogiem motion/ (oczekiwane: 0)
grep -rnE 'duration:\s*[0-9.]+' site/src --include=*.tsx | grep -v 'site/src/motion/'
grep -rnE 'ease:\s*\[' site/src --include=*.tsx | grep -v 'site/src/motion/'
grep -rnE '\b(y|x):\s*-?[0-9]{2,}' site/src --include=*.tsx | grep -E 'initial|animate|hidden|show' | grep -v 'site/src/motion/'
# cubic-bezier i ms poza plikami tokenów (oczekiwane: 0)
grep -rnE 'cubic-bezier\(' site/src --include=*.css --include=*.tsx | grep -vE 'tokens\.css|company-ui\.css'
grep -rnE 'transition:[^;]*[0-9]+m?s' site/src --include=*.css --include=*.tsx | grep -vE 'tokens\.css|company-ui\.css|var\(--duration'
# maksimum: żadna wartość DUR > 0.6 poza udokumentowanym wyjątkiem Counter (1.2)
grep -nE 'duration:\s*(0\.[7-9]|[1-9])' site/src/motion/tokens.ts site/src/motion/presets.ts
# Tailwind: klasy duration-*/ease-* na elementach m.* (oczekiwane: 0)
grep -rnE '<m\.[a-z]+[^>]*className="[^"]*(duration-|ease-)' site/src
```

Docelowo `node scripts/check-motion.mjs` sekcja `tokens`. Ocena LLM (agent `motion-auditor`) sprawdza dodatkowo, czy nowa animacja ma wpis w tabeli motywacji (`motion-motivated`).

#### Wyjątki

- `Counter`: `duration: 1.2` w `src/motion/Counter.tsx` z komentarzem `// motion-tokens-only: wyjątek udokumentowany (synthesis §2.4.3)`.
- Klasy kitu `.nc-swap`, `.nc-tab-swap`, `.nc-chart-build` mają czasy w `company-ui.css` (0.28/0.34/0.45 s); przy przepisywaniu kitu na `tokens.css` przechodzą na `var(--duration-*)`, do tego czasu są tolerowane (nie dopisywać nowych).
- `.faq-answer` w `globals.css` (`0.3s cubic-bezier(0.05,0.7,0.1,1)`): dług do zamiany na `var(--duration-base) var(--ease-out)` w fazie 0.

### 3.17 motion-stagger-caps

**Kaskada ≤ 12 dzieci, odstęp 40–60 ms, przesunięcie wejścia ≤ 12 px; duże powierzchnie tylko opacity**

Impact: **LOW** · Tagi: motion, stagger, reveal, a11y · Źródło: synthesis §2.4.1 (STAGGER 0.05, SHIFT 12)/§2.4.7 · motion-dev §5.1 p.7 · showreel M-stagger · ui-kit-habits F1 · motion-design (Disney: staging) · Dodano: 2026-09-12 · Plik: `rules/motion-stagger-caps.md`

#### Zasada

- `delayChildren: stagger(STAGGER, ...)` z `STAGGER = 0.05` (50 ms); dopuszczalny zakres 40–60 ms (S3 ramy: 60 ms, S7 wiersze ✕/✓: 40 ms). Poza tym zakresem: fail.
- Kaskada obejmuje maksymalnie 12 dzieci. Listy dłuższe (hub 13 kart, tabele, FAQ 8 pytań w akordeonie) wchodzą bez staggera (jeden `fade` panelu) albo w paczkach po ≤ 12 z `viewport` per paczka.
- Przesunięcie wejścia `y` = `SHIFT` (12 px). Nigdy > 24 px (choroba lokomocyjna, motion-dev §5.1 p.7). Duże powierzchnie (hero, całe sekcje, ramy S3 z obrazem, portrety) = `fade` bez `y`.
- `startDelay` ≤ 100 ms; łączny czas kaskady (startDelay + n × stagger + DUR.reveal) ≤ 1,2 s.
- `stagger(..., { from: "center" | "last" })` tylko z motywacją (kierunek czytania L→R jest domyślny).

#### Mechanizm awarii (dlaczego)

- 13 kart × 60 ms + 420 ms = ostatnia karta pojawia się po 1,2 s: użytkownik już przewinął, a ostatnie karty „wjeżdżają" poza viewportem, potem stoją na `opacity: 0` do czasu kolejnego `whileInView` (jeśli `once`). Efekt „pustej siatki" w zrzutach GSC.
- Przesunięcia 24–64 px na dużych elementach wywołują dyskomfort u części użytkowników nawet bez włączonego reduced-motion; docs Motion (accessibility) każą zamieniać transformy dużych elementów na opacity.
- Karol dwa razy cofał efektowność: długa kaskada to „teatr", nie hierarchia.

#### Niepoprawnie

```tsx
export const group: Variants = { hidden: {}, show: { transition: { delayChildren: stagger(0.12, { startDelay: 0.3 }) } } };
<m.ul variants={group}>{tools.map((t) => <m.li key={t.slug} variants={fadeUp} />)}</m.ul>   // 13 kart, 120 ms
<m.section variants={{ hidden: { opacity: 0, y: 64 }, show: { opacity: 1, y: 0 } }} />          // 64 px na całej sekcji
```

#### Poprawnie

```tsx
// src/motion/presets.ts
export const group: Variants = { hidden: {}, show: { transition: { delayChildren: stagger(STAGGER, { startDelay: 0.08 }) } } };
export const groupSlow: Variants = { hidden: {}, show: { transition: { delayChildren: stagger(0.06, { startDelay: 0.08 }) } } };  // S3 ramy
export const groupFast: Variants = { hidden: {}, show: { transition: { delayChildren: stagger(0.04) } } };                      // S7 wiersze

// hub: 13 kart bez staggera (fade panelu), karty bez m.*
<Reveal variant="fade"><ul className="tools-grid">{tools.map((t) => <li key={t.slug}><ToolCard tool={t} /></li>)}</ul></Reveal>

// duże powierzchnie: fade
<Reveal variant="fade"><FounderCard … /></Reveal>
```

#### Test

```bash
# stagger poza 0.04–0.06 (oczekiwane: 0)
grep -rnE 'stagger\(\s*(0\.0[0-3]|0\.0[7-9]|0\.[1-9])' site/src
grep -rnE 'staggerChildren' site/src                      # stare API, = 0
# przesunięcia > 12 px w wariantach (oczekiwane: 0)
grep -rnE '\by:\s*-?(1[3-9]|[2-9][0-9])\b' site/src/motion site/src/components --include=*.ts --include=*.tsx
# listy > 12 dzieci z variants=group: ocena LLM (motion-auditor) na plikach z .map( wewnątrz m.ul/m.ol variants=
grep -rnE '<m\.(ul|ol|div)[^>]*variants=\{group' site/src -A 3 | grep -E '\.map\('
```

#### Wyjątki

- `KsefFlow` (mini-diagram S2): 3 węzły × 120 ms `opacity` to sekwencja znaczeniowa (kierunek danych), nie stagger wejścia; dozwolone jako udokumentowany wyjątek.

## 4. Assety: obrazy, poster, wideo, zrzuty, budżety plików, metadane (`media`)

Domyślny impact: **HIGH** · tryb: marketing · właściciel audytu: `ui-auditor`

### 4.1 media-higgsfield-inputs-policy

**Higgsfield: do modelu trafiają wyłącznie abstrakcje i własne stille; zero zrzutów I NAGRAŃ narzędzi, danych, twarzy i materiałów firmy źródłowej; log SOURCES.md; zakres v1 mieści się w trialu; usuwać generacje po sprincie**

Impact: **BLOCKER** · Tagi: media, higgsfield, licensing, privacy, brand · Źródło: higgsfield §0 p.8/§8 (ToU 26.07.2026: licencja treningowa, brak gwarancji IP, znak wodny Free) · synthesis §2.6.1 · CLAUDE.md zasada #3 (marka firmy źródłowej nie publicznie) · peer-legal · Dodano: 2026-09-12 · Plik: `rules/media-higgsfield-inputs-policy.md`

#### Zasada

Higgsfield (przez MCP „creative engine" w Claude Code) jest narzędziem do 2–3 assetów, których nie zrobi ani kod, ani nagranie ekranu. **Zakres v1 po decyzji D36 (2026-09-12 wieczór): wyłącznie STATYCZNE stille na stronę** (H1 grunt hero 24 kr, H2 master still 15 kr, H3 tło OG 10 kr, rezerwa 7 kr = **≈ 56 kr, czyli 0 USD w trialu**) plus opcjonalna **pętla na LinkedIn, która nie trafia na stronę** (H4 ≈ 166 kr, jeden miesiąc PLUS 49 USD + VAT). **W `site/public/` nie ma ani jednego pliku wideo z Higgsfielda**: jedyne wideo na stronie to nagrania prawdziwych narzędzi (D37). Obowiązuje:

1. **Wejścia (prompt, `image_references`, `start_image`, `end_image`, `video_references`)**: wyłącznie (a) tekst z szablonów T-IMG/T-VID (`references/higgsfield-pipeline.md`), (b) stille wygenerowane w tym samym pipeline, (c) własne abstrakcyjne rendery (Blender/three.js) — w tym izolowany render canvasu GLSL z osobnej strony testowej `?bg-only=1` (zero UI, zero tekstu, zero danych dem), nagrany lokalnie do `site/media/src/`. ZAKAZ wgrywania: zrzutów ekranu narzędzi (własnych i cudzych), **nagrań ekranu narzędzi z `scripts/record-demos.mjs` (nagranie hero i klipy hover: to layout naszego produktu, model nie ma go widzieć, nawet na danych fikcyjnych)**, plików Excel/CSV/PDF, danych klientów lub leadów, dokumentów, zdjęć founderów i jakichkolwiek twarzy, zdjęć hal/biur/placów budowy, logotypów, materiałów z okresu pracy dla firmy źródłowej (obowiązuje umowa IP), nagrań ekranu strony z danymi dem.
2. **Wyjścia**: żadnego tekstu, cyfr, logo, ludzi, rąk, UI w kadrze (negatywy w każdym prompcie; przegląd w `media-asset-review-gate`). Output nie jest używany do trenowania własnych modeli (zakaz ToU).
3. **Plan i dwie rozłączne decyzje finansowe**: **zakres strony (H1–H3, ≈ 56 kr) mieści się w trialu 3-dniowym** (100 kr, **0 USD**, karta wymagana, **auto-odnowienie na PLUS 49 USD**; `cancel_trial_auto_renewal` + `confirm_trial_cancel` w dniu ≤ 3, dwa przypomnienia w kalendarzu ustawione PRZED klikiem). Stille to obrazy, nie wideo, więc na trialu nie ma znaku wodnego blokującego użytek na stronie; **przed użyciem finału potwierdzamy prawa komercyjne planu, z którego powstał** (`strona-v2-plan.md` §7.2 p.4) i zapisujemy plan w `SOURCES.md`. **Zakres social (H4, pętla na LinkedIn poza stroną) wymaga planu płatnego: PLUS 49 USD/mies. (1 000 kr)** i jest osobną decyzją, która nie blokuje publikacji. ULTRA ($129) **nie jest potrzebne**: rekomendacja z `research/higgsfield.md` §3.2 dotyczy PEŁNEJ listy assetów (przejścia, tła sekcyjne, mikro-animacje ikon ≈ 1 300–2 200 kr), której w v1 nie ma. Free = znak wodny i brak prawa użytku komercyjnego. **Konto i karta: administrator danych, faktura na osobę fizyczną, koszt nieodliczalny (D25, D27; nieaktualne „JDG Pawła" z D-17).** Bez API `cloud.higgsfield.ai`, bez planu rocznego. **Agent nie uruchamia trialu ani zakupu**: przygotowuje krok, pokazuje `get_cost` i czeka na świadomą akcję foundera.
4. **Log**: każda generacja użyta (i każda odrzucona seria) ma wpis w `site/media/SOURCES.md`: data, model (`id` MCP), parametry, prompt (pełny), `image_references` (nazwa naszego pliku), ID generacji, koszt w kredytach, decyzja (użyty/odrzucony + powód), ścieżka pliku wynikowego z wersją. Bez sekretów, bez URL-i CDN po 7 dniach (wygasają).
5. **Sprzątanie**: po zakończeniu sprintu assetów wszystkie generacje są usuwane z konta Higgsfield (kończy licencję treningową ToU), pliki źródłowe zostają lokalnie w `site/media/src/` (poza `public/`, w gicie tylko finały ≤ 1,5 MB; źródła > 5 MB w `.gitignore`).
6. **Higiena kredytów**: `get_cost: true` przed serią, `sound: off`/`generate_audio: false` zawsze, 480p/720p do selekcji, 1080p tylko finał, `generate_video_batch` + `jobs_wait` dla równoległych podejść, `mode: std` → `pro` tylko dla 2 finałów.
7. **Zero automatyzacji generacji w repo**: żadnych skryptów, kluczy API ani tokenów Higgsfield w `site/`, `scripts/`, `.env`; generacja tylko interaktywnie przez MCP w sesji z founderem.

#### Mechanizm awarii (dlaczego)

- ToU 26.07.2026: Higgsfield ma licencję na trening modeli na inputach i outputach (wygasa po usunięciu treści/konta), nie gwarantuje oryginalności/IP outputu, przerzuca AUP dostawców (Google/OpenAI/ByteDance). Zrzut narzędzia lub dane klienta w prompcie = przekazanie ich stronie trzeciej do treningu = naruszenie zasady #3 CLAUDE.md, umowy IP i (przy danych osobowych) RODO.
- Twarze founderów w generatorze = potencjalne deepfake'i i naruszenie prywatności; portrety powstają w Photoshopie lokalnie (synthesis M2).
- Free plan: znak wodny na finałach i brak prawa komercyjnego; trial auto-odnawia się na $49 (ryzyko operacyjne wpisane przez 3 sędziów).
- Bez `SOURCES.md` nie da się dogrywać wariantów w tym samym stylu (brak `seed` w MCP; spójność = `image_references` + identyczne prompty) ani udowodnić pochodzenia assetu przy pytaniu klienta „skąd to?".
- Skrypt z tokenem w repo = sekret w gicie (hook `PreToolUse` blokuje wzorce kluczy, ale nie każdy token wygląda jak klucz).

#### Niepoprawnie

```
# prompt do nano_banana_pro
image_references: ["C:/Users/.../Desktop/zrzut-dashboard-produkcji.png", "C:/Users/.../hala-klienta.jpg"]
"Make a cinematic version of this dashboard with our KLAROW logo and the numbers from the spreadsheet"
```

```
# site/media/SOURCES.md: brak pliku; finały pobrane z planu Free (znak wodny w rogu)
```

#### Poprawnie

Wejścia, prompt, koszt, wybór i postprodukcja idą do dziennika `site/media/SOURCES.md` wg wzoru
w [`references/asset-review-log.md`](../references/asset-review-log.md) §2 (pełny wpis `hero-v1`
z polami: model, `start_image`/`end_image`, prompt, podejścia i koszt, wybrana generacja,
postprodukcja, data usunięcia generacji z konta dostawcy).

```
# site/media/SOURCES.md (wpis; pełny wzór: references/asset-review-log.md §2)
#### hero-v1 (2026-09-2x)
- start_image = end_image: media/src/master-still-v1.png   ← wyłącznie własny still z site/media/src/
- prompt: [T-VID-1 pełny tekst]                            ← bez nazw firm, produktów, osób
- generacje na koncie usunięte: 2026-10-xx (po sprincie)
```

```
# .gitignore (fragment)
site/media/src/*.mp4
site/media/src/*.mov
```

#### Test

```bash
# log istnieje i ma wpis dla każdego pliku w public/media
[ -f site/media/SOURCES.md ] || echo "BRAK SOURCES.md"
for f in $(ls site/public/media/*.{webm,mp4} 2>/dev/null); do b=$(basename "$f" | sed -E 's/\.(webm|mp4)$//'); grep -q "$b" site/media/SOURCES.md || echo "BRAK wpisu dla $b"; done
# zero NAGRAŃ narzędzi wśród wejść: w SOURCES.md żaden wpis start_image/end_image/image_references
# nie może wskazywać na media/tools/*, public/media/* ani na plik z record-demos (oczekiwane: 0)
grep -nE '(start_image|end_image|image_references).*(tools/|public/media|record-demos|hero-production)' site/media/SOURCES.md
# zero sekretów/skryptów Higgsfield w repo (oczekiwane: 0)
grep -rniE 'higgsfield' site/src site/scripts site/package.json .env* 2>/dev/null
grep -rnE 'HIGGSFIELD|hf_[a-z0-9]{20,}|Authorization: Key' . --include=*.{ts,tsx,mjs,js,json,md} -l 2>/dev/null | grep -v klarow-guardian
# przegląd ręczny (founder + agent media-auditor) przed każdą generacją: lista image_references zawiera wyłącznie pliki z site/media/src/ wygenerowane w pipeline lub rendery Blender/three.js; prompt bez nazw firm, produktów, osób.
# po sprincie: `show_generations` w MCP = 0 pozycji; wpis „generacje usunięte: <data>" w SOURCES.md.
```

#### Wyjątki

- Brak. Reguła obowiązuje także dla innych generatorów (Midjourney, Runway, Sora, Veo przez inne MCP) i dla „darmowych" narzędzi online: ta sama polityka wejść.

### 4.2 media-one-autoplay-per-route

**Najwyżej jedno automatycznie odtwarzane wideo i jedno ruchome tło na trasę; nigdy oba naraz**

Impact: **BLOCKER** · Tagi: media, video, autoplay, background, performance · Źródło: synthesis §0 p.7/§2.4.4/§2.6.3 („nigdy dwa ruchome tła na trasie") · showreel M7 · higgsfield §6.1 A · WIG (vercel.md §6.4) · CLAUDE.md #2 · decyzje D35/D36/D37 (2026-09-12 wieczór) · docs/plan/warstwa-wrazenia.md · Dodano: 2026-09-12 · Plik: `rules/media-one-autoplay-per-route.md`

#### Zasada

Na każdej trasie (`/`, `/narzedzia`, `/narzedzia/:slug`, `/oferta`, `/faq`, `/rodo`, `404`) w DOM po starcie Reacta jest:

- **≤ 1 element `<video>` z automatycznym odtwarzaniem, i to wyłącznie na trasie `/`** (`HeroMedia`), wyłącznie przy `pointer: fine` i wyłącznie po `window.load`; na **18 pozostałych trasach twarde 0** (samo „≤ 1 na trasę" formalnie dopuszczałoby klip na `/oferta`),
- **treścią tego jedynego autoodtwarzania jest NAGRANIE PRAWDZIWEGO NARZĘDZIA** (`record-demos.mjs`), nie pętla generatywna (D37): pętla zajęłaby slot dowodu i zostawiła hero bez treści. Nagranie hero gra **raz**, bez `loop`, i zatrzymuje się na ostatniej klatce,
- ≤ 1 ruchome tło łącznie (wideo LUB canvas WebGL `GLSLHills` LUB nic); wideo hero i GLSL Hills nigdy razem. W v1 `three` jest poza `dependencies`, więc realnie: tylko wideo,
- **klipy hover ściany S3 (v1: dokładnie cztery, pierwszy rząd po featured) nie liczą się jako autoplay**, bo startują wyłącznie z intencji użytkownika (`mouseenter` z progiem 120 ms albo `focus-visible`), ale **maksimum jeden gra jednocześnie** (singleton modułowy), a hero jest w tym czasie **zapauzowane** przez `IntersectionObserver`: nigdy dwa dekodery naraz,
- pętle sekcyjne, tła podstron („tło-pętla /oferta", „/narzedzia") NIE POWSTAJĄ (synthesis §2.6.1 „Co NIE powstaje generatywnie").

Wideo nie jest treścią: `aria-hidden="true"`, `tabIndex={-1}`, zero NATYWNYCH kontrolek (`controls`), zero dźwięku, a strona bez niego niczego nie traci (test: zdejmij `<video>` → treść i CTA identyczne).

Jedyny element sterujący, jaki przy wideo MUSI istnieć, to przycisk pauzy (`hero-media-toggle`, etykieta „Zatrzymaj podgląd / Pause preview": wideo hero nie jest tłem, tylko podglądem narzędzia) renderowany POZA kontenerem `aria-hidden` — wymóg WCAG 2.2.2 (Pause, Stop, Hide) dla pętli > 5 s i zapis planu (`docs/plan/strona-v2-plan.md:384`); pełna specyfikacja w `media-video-embed-spec` (p. „kontrola pauzy"). Przycisk nie jest kontrolką odtwarzacza (zero `controls`, zero paska postępu, zero dźwięku) i nie liczy się jako „druga kontrolka".

#### Mechanizm awarii (dlaczego)

- Dwa dekodery wideo lub wideo + WebGL na laptopie zintegrowanym = spadek fps całej strony i grzanie; na iOS drugi kontekst GPU zwiększa ryzyko powrotu buga „samo tło" (2026-07-24: kompozycja `fixed` canvasu nad treścią).
- WCAG 2.2.2 / WIG: pętla > 5 s obok treści wymaga mechanizmu pauzy — BEZ wyjątku dla dekoracji. `aria-hidden` chowa wideo przed czytnikiem ekranu, ale nie przed osobą z zaburzeniami uwagi/przedsionkowymi, która NIE ma włączonego `prefers-reduced-motion` (norma zna tylko wyjątek „essential", a tło nim nie jest). Pętla hero ma 6–10 s (`media-video-budgets`), więc kryterium stosuje się wprost.
- Dwa autoplay czynią stronę „reklamą", nie wizytówką wykonawcy narzędzi.
- Budżet transferu `/` desktop ≤ 2,5 MB z nagraniem hero (`media-video-budgets`); drugie autoodtwarzane wideo wysadza budżet i podwaja ryzyko kompozycji na iOS.
- Higgsfield: każdy dodatkowy klip to 70–280 kr i osobna spójność stylu; synteza zamroziła komplet v1 na 1 klip.

#### Niepoprawnie

```tsx
// App.tsx: wideo hero + GLSL Hills razem
{animatedBg ? <BgBoundary><GLSLHills … /></BgBoundary> : null}
<Hero><HeroMedia /></Hero>

// OfferPage.tsx: drugi klip jako tło sekcji
<section className="offer-hero"><video autoPlay muted loop playsInline src="/media/offer-v1.mp4" /></section>
```

#### Poprawnie

```tsx
// App.tsx (plan A: hero-loop; GLSL Hills zdjęty z bundla)
<Hero><MediaBoundary><HeroMedia /></MediaBoundary></Hero>

// App.tsx (plan B po D-08: GLSL Hills wraca, HeroMedia renderuje TYLKO poster)
const bg = useAnimatedBg() && MEDIA_ENABLED;   // pointer: fine, po idle po load, saveData gate
{bg ? <BgBoundary><Suspense fallback={null}><GLSLHills … /></Suspense></BgBoundary> : null}
<Hero><HeroMedia videoAllowed={false} /></Hero>
```

#### Test

```bash
# kod: <video> wyłącznie w HeroMedia (faza 1) i ewentualnie CaseFrame (hover-klipy, faza 2)
grep -rlE '<video' site/src | grep -vE 'components/HeroMedia\.tsx|components/ToolWall\.tsx'     # = 0 (v1: hero + klipy hover ściany)
grep -rnE 'autoPlay' site/src | grep -v 'HeroMedia.tsx'                                          # = 0 (HeroMedia i tak używa play() po gate, nie autoPlay)
# dwa ruchome tła: GLSLHills i HeroMedia z wideo nie mogą być jednocześnie aktywne
grep -nE 'GLSLHills' site/src/App.tsx && grep -nE 'videoAllowed=\{false\}|MEDIA_ENABLED' site/src/App.tsx   # jeśli GLSL jest, HeroMedia bez wideo
# runtime (Playwright WebKit desktop 1440×900, każda z 19 tras):
#   document.querySelectorAll("video:not([paused])").length ≤ 1 i document.querySelectorAll("canvas").length + (videos>0?1:0) ≤ 1
# shell: zero <video> w dist/**/*.html
grep -rlE '<video' site/dist --include=*.html    # = 0
# przycisk pauzy tła istnieje dokładnie tam, gdzie jest autoplay (WCAG 2.2.2)
grep -rlE 'hero-media-toggle' site/src/components/HeroMedia.tsx   # = 1 plik
```

Docelowo `scripts/verify-site.mjs` krok `media-one-autoplay-per-route` (WebKit ze scratchpadu, jak w sesji 2026-07-24).

#### Wyjątki

- Klipy hover S3 (v1, D35): ≤ 4 elementy `<video preload="none">` w DOM, żaden nie odtwarza się bez `mouseenter` (próg intencji 120 ms) ani `focus-visible`; test liczy tylko `!paused`. Wymagane dodatkowo: `pointer-events: none` na elemencie (kafel zostaje jednym `<a>`: `seo-links-in-dom`) i `pointer: fine` (na dotyku hover nie istnieje, a tap ma otwierać podstronę).

### 4.3 media-video-gating

**Wideo tylko po bramkach: pointer fine, brak reduced-motion, brak saveData/2g-3g, po window.load, IO play/pause, visibilitychange, pauza użytkownika w sessionStorage, iOS Low Power Mode → poster**

Impact: **BLOCKER** · Tagi: media, video, reduced-motion, ios, battery, lcp · Źródło: CLAUDE.md #2 i 2026-07-24 (brak WebGL na coarse) · higgsfield §4.5 p.1–6/§8 · synthesis §2.4.4 wantsVideo()/§2.4.8 · showreel §5.4 · motion-dev §4.11/§5.1 p.6 · lesniakrafal (LPM) · WebKit 6784 · Dodano: 2026-09-12 · Plik: `rules/media-video-gating.md`

#### Zasada

`HeroMedia` montuje `<video>` wyłącznie, gdy WSZYSTKIE warunki są spełnione, sprawdzane w tej kolejności:

```ts
function wantsVideo(): boolean {
  if (typeof window === "undefined" || !MEDIA_ENABLED) return false;              // SSR / kill-switch
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return false;      // a11y (BLOCKER)
  if (!matchMedia("(pointer: fine)").matches) return false;                       // telefony/tablety = poster (spójnie z WebGL od 2026-07-24)
  const c = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  if (c?.saveData === true) return false;                                         // Data Saver
  if (/^(slow-2g|2g|3g)$/.test(c?.effectiveType ?? "")) return false;            // wolne łącze
  return true;
}
```

Cykl życia po przejściu bramek:

1. **Ładowanie po `window.load` ORAZ po `requestIdleCallback`** (fallback `setTimeout 200`): `useEffect` → jeśli `document.readyState === "complete"` → `rIC(() => setEnabled(wantsVideo()))`, inaczej listener `load` (z cleanupem), a w nim to samo `rIC`. Do tego czasu w DOM jest tylko poster `<img>` (LCP). Samo „po `load`" nie wystarcza: okno, w którym przeglądarka jeszcze aktualizuje kandydata LCP, sięga poza `load`, a pierwsza klatka wideo malowana na całej szerokości hero potrafi ten tytuł przejąć (R-M2).
   **Bezpiecznik 4 s:** jeśli od montażu nie przyjdzie `canplay` w 4 s, `setEnabled(false)` i zostaje poster. Bez tego crossfade wchodzi przy zapchanym łączu po kilkunastu sekundach, gdy użytkownik czyta już następną sekcję, i czyta się jako usterka.
2. **Odtwarzanie sterowane widocznością**: `IntersectionObserver` (`threshold: 0.25`) → `play()` gdy ≥ 25 % w viewporcie, `pause()` poza; `document.addEventListener("visibilitychange")` → `pause()` gdy `document.hidden`, `play()` po powrocie tylko jeśli nadal w viewporcie.
3. **iOS Low Power Mode i blokady autoplay**: podstawowymi detektorami awarii są `play().catch(() => setEnabled(false))` (NotAllowedError → poster, zero przycisku „Odtwórz") i `onError` → `setEnabled(false)`.
   `onSuspend` jest detektorem POMOCNICZYM i wolno go użyć wyłącznie z dwoma zabezpieczeniami: (a) tylko PO pierwszej próbie odtworzenia (`tried.current === true`), (b) z opóźnieniem ≥ 1000 ms i ponownym sprawdzeniem stanu (`paused && !ended && inView && !document.hidden && !paused-użytkownika`). Powód w „Mechanizmie awarii": `suspend` to normalne zdarzenie (koniec pobierania `preload="metadata"`, pełny bufor), a `play()` jest asynchroniczne — bez tych warunków zdrowe wideo gaśnie losowo. Timer czyścimy w cleanupie (`motion-cleanup-required`).
4. **Crossfade**: `onCanPlay` → `setReady(true)` → `opacity` 0 → 1 (600 ms). Poster zostaje pod spodem (nie usuwać `<img>`). Nagranie hero gra **raz, bez `loop`**, i zatrzymuje się na ostatniej klatce: `onEnded` nie wywołuje `play()` i **nie pokazuje przycisku „Odtwórz ponownie"**.
5. **Zmiana warunków w locie**: listener `matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change")` → `setEnabled(false)` gdy `matches`; cleanup w `useEffect`.
6. **Cleanup** (`motion-cleanup-required`): `io.disconnect()`, `removeEventListener` ×3, `clearTimeout` timera `onSuspend`, `pause()`; `removeAttribute("src")` na `<source>` nie jest potrzebne, wystarczy odmontowanie elementu.
7. **Pauza użytkownika (WCAG 2.2.2, wymagana)**: stan `paused` sterowany przyciskiem `hero-media-toggle` (`media-video-embed-spec`, p. „kontrola pauzy"). Odczyt `sessionStorage.getItem("klarow:media:paused") === "1"` w inicjalizatorze stanu (w `try/catch`, PRZED pierwszym `play()`), zapis przy każdym kliknięciu. `paused === true` blokuje `play()` we WSZYSTKICH ścieżkach (IO, `visibilitychange`, `onCanPlay`) i wywołuje `el.pause()`; `paused === false` wznawia tylko wtedy, gdy element jest w viewporcie i karta widoczna. Pauza NIE odmontowuje `<video>` (użytkownik może wrócić) — w odróżnieniu od bramek z `wantsVideo()`, które element usuwają.

Zakazane: `autoPlay` w JSX, `play()` bez `.catch`, poleganie na `pause()` przy reduced-motion (element i tak pobiera dane; przy reduced `<video>` NIE JEST w DOM), `onSuspend` bez zabezpieczeń z p.3, atrybut `controls`, wideo na `pointer: coarse` (także osobny klip 9:16: odrzucony w syntezie §1.6).

Doprecyzowanie zakazu przycisku: zakazany jest przycisk **URUCHAMIAJĄCY** wideo po odrzuceniu bramek (np. „Odtwórz tło" pokazywane przy `prefers-reduced-motion`, `pointer: coarse`, `saveData` albo po `NotAllowedError` na iOS LPM) — tam poprawną odpowiedzią jest poster bez żadnej kontrolki. Przycisk **PAUZY** (p.7) jest WYMAGANY i pojawia się wyłącznie wtedy, gdy wideo faktycznie gra lub jest zapauzowane przez użytkownika.

#### Mechanizm awarii (dlaczego)

- Reduced-motion: zasada #2 CLAUDE.md i WCAG 2.3.3; `MotionConfig` nie widzi `<video>`, więc bramka musi być własna (motion-dev §8.11). BLOCKER.
- `pointer: coarse`: od 2026-07-24 mobile nie dostaje WebGL (iOS komponował `fixed` canvas nad treścią). Wideo w kontenerze hero jest bezpieczniejsze niż `fixed` canvas, ale transfer 1,5 MB na 4G + dekoder w tle + Low Power Mode = trzy powody na poster. Decyzja founderów (higgsfield §10 p.4): poster.
- `saveData`/2g-3g: użytkownik jawnie prosi o mniej danych; 1,5 MB dekoracji to naruszenie tej prośby.
- Ładowanie przed `load` konkuruje z fontem, CSS i posterem o pasmo; poster jest kandydatem LCP i musi wygrać.
- iOS LPM: `play()` odrzuca promise `NotAllowedError`, a Safari wstawia duży przycisk play nad dekoracją; bez `.catch` w konsoli wyjątek, a bez `setEnabled(false)` przycisk zostaje (źródła: lesniakrafal.com, forum Webflow).
- Bez IO/visibilitychange wideo dekoduje poza ekranem i w tle (Chrome nie pauzuje niewidocznych), bateria i CPU (kit: „pauza przy `document.hidden`").
- `suspend` NIE jest sygnałem awarii: przeglądarka emituje je za każdym razem, gdy celowo przestaje pobierać dane (skompletowane `preload="metadata"`, zapełniony bufor). Dodatkowo `el.play()` jest asynchroniczne — w oknie między wywołaniem a rozwiązaniem promise `el.paused === true` przy `readyState` 2–4. Heurystyka `readyState >= 2 && paused && !ended` bez warunku „była próba odtworzenia" i bez opóźnienia gasi zdrowe wideo na desktopie, w dodatku bez śladu w konsoli (`onError` nie leci).
- Brak mechanizmu pauzy przy pętli 6–10 s obok treści = naruszenie WCAG 2.2.2 (jedyny wyjątek normy to „essential", a dekoracyjne tło nim nie jest). `aria-hidden` chowa wideo przed czytnikiem, nie przed osobą z zaburzeniami uwagi lub przedsionkowymi, która nie ustawiła `prefers-reduced-motion`.

#### Niepoprawnie

```tsx
<video autoPlay muted loop playsInline poster={POSTER} />                                   // zero bramek
useEffect(() => { videoRef.current?.play(); }, []);                                          // bez catch, przed load, bez IO
const reduce = useReducedMotion(); useEffect(() => { if (reduce) videoRef.current?.pause(); }, [reduce]);   // element dalej w DOM i pobiera
const onSuspend = () => { const el = ref.current; if (el && el.readyState >= 2 && el.paused && !el.ended) setEnabled(false); };  // gasi zdrowe wideo (suspend = normalne zdarzenie)
{!enabled ? <button onClick={() => setEnabled(true)}>Odtwórz tło</button> : null}            // przycisk URUCHAMIAJĄCY po odrzuceniu bramek
```

#### Poprawnie

```tsx
// src/components/HeroMedia.tsx (logika; render w media-video-embed-spec)
const PAUSE_KEY = "klarow:media:paused";
const readPaused = () => { try { return sessionStorage.getItem(PAUSE_KEY) === "1"; } catch { return false; } };

const [enabled, setEnabled] = useState(false);
const [ready, setReady] = useState(false);
const [paused, setPaused] = useState(readPaused);          // 7) wybór użytkownika z poprzedniej podstrony
const ref = useRef<HTMLVideoElement>(null);
const inView = useRef(false);                               // widoczność dostępna też poza efektem (onSuspend)
const tried = useRef(false);                                // czy była próba play() (warunek p.3a)
const pausedRef = useRef(paused);
const suspendTimer = useRef<number | null>(null);
pausedRef.current = paused;

useEffect(() => {                                   // 1) po load
  const arm = () => setEnabled(wantsVideo());
  if (document.readyState === "complete") { arm(); return; }
  window.addEventListener("load", arm, { once: true });
  return () => window.removeEventListener("load", arm);
}, []);

useEffect(() => {                                   // 5) zmiana reduced-motion w locie
  const mq = matchMedia("(prefers-reduced-motion: reduce)");
  const onChange = () => { if (mq.matches) setEnabled(false); };
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}, []);

useEffect(() => {                                   // 2) + 3) + 6) + 7)
  const el = ref.current; if (!enabled || !el) return;
  const tryPlay = () => { if (pausedRef.current) return; tried.current = true; el.play().catch(() => setEnabled(false)); };
  const io = new IntersectionObserver(([e]) => { inView.current = e.isIntersecting; inView.current && !document.hidden ? tryPlay() : el.pause(); }, { threshold: 0.25 });
  const onVis = () => { document.hidden ? el.pause() : inView.current && tryPlay(); };
  io.observe(el);
  document.addEventListener("visibilitychange", onVis);
  return () => {
    io.disconnect();
    document.removeEventListener("visibilitychange", onVis);
    if (suspendTimer.current !== null) { window.clearTimeout(suspendTimer.current); suspendTimer.current = null; }
    el.pause();
  };
}, [enabled]);

useEffect(() => {                                   // 7) reakcja na przycisk pauzy
  const el = ref.current; if (!enabled || !el) return;
  if (paused) el.pause();
  else if (inView.current && !document.hidden) { tried.current = true; el.play().catch(() => setEnabled(false)); }
}, [paused, enabled]);

const togglePaused = () => setPaused((v) => { const next = !v; try { sessionStorage.setItem(PAUSE_KEY, next ? "1" : "0"); } catch { /* private mode */ } return next; });

const onCanPlay = () => setReady(true);
const onSuspend = () => {                           // 3) detektor pomocniczy: tylko po próbie play() i z opóźnieniem
  if (!tried.current || suspendTimer.current !== null) return;
  suspendTimer.current = window.setTimeout(() => {
    suspendTimer.current = null;
    const el = ref.current;
    if (el && el.paused && !el.ended && inView.current && !document.hidden && !pausedRef.current) setEnabled(false);
  }, 1000);
};
```

#### Test

```bash
# kontrakt wantsVideo i cykl życia (oczekiwane: każda linia = 1 trafienie w HeroMedia.tsx)
F=site/src/components/HeroMedia.tsx
grep -cE 'prefers-reduced-motion: reduce' $F; grep -cE '\(pointer: fine\)' $F; grep -cE 'saveData' $F; grep -cE 'slow-2g\|2g\|3g|effectiveType' $F
grep -cE 'readyState === "complete"' $F; grep -cE 'IntersectionObserver' $F; grep -cE 'visibilitychange' $F
grep -cE 'requestIdleCallback' $F    # ≥ 1 (montaż poza oknem aktualizacji LCP)
grep -cE '4000|FOUR_SEC|CANPLAY_TIMEOUT' $F   # ≥ 1 (bezpiecznik 4 s: brak canplay → poster)
grep -cE '\.play\(\)\.catch|\.play\(\)\.then\([^)]*\)\.catch' $F; grep -cE 'onSuspend' $F; grep -cE 'MEDIA_ENABLED' $F
grep -nE 'autoPlay' $F   # = 0
# p.3: onSuspend z zabezpieczeniami (oczekiwane: po ≥ 1 trafieniu)
grep -cE 'tried\.current' $F; grep -cE 'setTimeout\(' $F; grep -cE 'clearTimeout\(' $F
# p.7: pauza użytkownika (WCAG 2.2.2) i jej trwałość w sesji
grep -cE 'klarow:media:paused' $F; grep -cE 'hero-media-toggle' $F; grep -cE 'aria-pressed' $F   # = 1 każdy
grep -cE 'try \{[^}]*sessionStorage' $F   # ≥ 1 (odczyt/zapis w try/catch)
# runtime (Playwright WebKit ze scratchpadu):
#   a) viewport 390×844 (pointer: coarse): document.querySelector("video") === null; poster <img> widoczny
#   b) desktop 1440×900 + reducedMotion:"reduce": video === null
#   c) desktop + emulacja connection.saveData=true (CDP Network.emulateNetworkConditions / override navigator.connection): video === null
#   d) desktop, warunki normalne: po load ≤ 2 s video.paused === false; przewinięcie poza hero → paused === true; document.hidden (page.evaluate visibility) → paused
#   e) desktop, play() mock → reject(NotAllowedError): video znika, poster zostaje, brak przycisku „Odtwórz"
#   f) desktop: klik „Zatrzymaj podgląd" → video.paused === true, aria-pressed="true", sessionStorage klarow:media:paused === "1";
#      nawigacja na /oferta i powrót na / → wideo NIE startuje; klik „Odtwórz podgląd" → paused === false
#   h) desktop: montaż wideo dopiero PO window.load i requestIdleCallback; brak canplay w 4 s → poster i zero <video> w DOM
#   i) desktop: element LCP (PerformanceObserver) = img.hero-shot, nie <video> (perf-lcp-poster-preload)
#   g) desktop: sztuczne `dispatchEvent(new Event("suspend"))` na grającym wideo → po 1,5 s video nadal gra (brak fałszywego wygaszenia)
# realny iPhone Karola w Low Power Mode: hero = poster, brak białego przycisku play.
```

Docelowo `scripts/verify-site.mjs` krok `video-gating` (a, b, d) w fazie 3.

#### Wyjątki

- **Klipy hover ściany S3 (v1, dokładnie 4).** Te same bramki `wantsVideo()` plus: `preload="none"`, start dopiero po `mouseenter` z **progiem intencji 120 ms** (kursor przejeżdżający przez kafel nic nie uruchamia) albo po `focus-visible`; `mouseleave`/`blur` → `pause()` + `currentTime = 0`; **singleton modułowy** (nowy start zatrzymuje poprzedni klip); `pointer-events: none` na elemencie, żeby kafel pozostał jednym `<a>`; twarde `pointer: fine` (na dotyku hover nie istnieje, a tap ma otwierać podstronę). Klipy nie mają własnego przycisku pauzy (ruch nie jest automatyczny w rozumieniu WCAG 2.2.2), ale honorują wspólny stan `klarow:media:paused`.
- W trybach `MOTION_TIER = "still"` i `"calm"` `wantsVideo()` zwraca `false` z pierwszej linii (patrz `motion-tier-flag`).

### 4.4 media-video-placement

**Wideo i tło wyłącznie w kontenerze hero (absolute + overflow:hidden) albo w .bg-layer; nigdy nowy position:fixed ani kontekst stackingu w .content-layer**

Impact: **BLOCKER** · Tagi: media, video, ios, stacking, layout · Źródło: CLAUDE.md „Stan operacyjny" 2026-07-24/26 (bug iOS „samo tło") · site-audit §1.7 · higgsfield §4.5 p.9/§11 · synthesis §2.3 S1/§2.8 p.10 · feasibility-perf §9 p.7 · globals.css:13-54 · Dodano: 2026-09-12 · Plik: `rules/media-video-placement.md`

#### Zasada

Szkielet strony jest zamrożony (`site/src/styles/globals.css:13-54`):

- `.bg-layer { position: fixed; inset: 0; z-index: -1; pointer-events: none; isolation: isolate }` z gradientem awaryjnym `#121212`,
- `.content-layer { position: relative }` BEZ `z-index`, BEZ `isolation`, BEZ `transform`, BEZ `filter`, BEZ `will-change`, BEZ `contain: paint` (żadnej właściwości tworzącej kontekst stackingu ani containing block).

Media ruchome mają DOKŁADNIE dwa dozwolone miejsca:

1. **Kontener hero**: `.hero { position: relative; overflow: hidden }` + `.hero-media { position: absolute; inset: 0; overflow: hidden }` z `<img>` posterem (kadr produktu), opcjonalnym `<img>` gruntu i `<video>` (`object-fit: cover`); ewentualny overlay jako `::after` w tym samym kontenerze. Kolejność malowania wynika z **kolejności w DOM**, nie z `z-index`: grunt → poster → wideo → `::after` → `.hero-content` (`position: relative`, bez `z-index`); przycisk pauzy stoi PO `.hero-media`, więc maluje się wyżej bez `z-index`.
2. **Kafel ściany S3** dla klipów hover: `.tool-tile { position: relative; overflow: hidden }` + `<video>` `position: absolute` z longhandami, `pointer-events: none`. Nigdy `fixed`, nigdy poza kafel.
3. **`.bg-layer`** (tylko plan B: `GLSLHills` canvas na desktopie; w v1 nieaktywny, bo `three` jest poza `dependencies`).

Zakazane w `.content-layer` i jego potomkach: nowe `position: fixed` (poza `Navbar` i `<dialog>` natywnym), `z-index` na wrapperach sekcji, `transform`/`filter`/`backdrop-filter`/`perspective`/`will-change` na przodkach elementów `fixed`/`sticky`, `mix-blend-mode` na elemencie zawierającym treść, nieprzezroczyste tło na wrapperze roota (`#121212` na `.content-layer` zasłoniło tło w commicie 640a6f9: „Fix: tło znów widoczne").

Tailwind: zero `fixed`, `inset-0`, `z-*` na elementach layoutu (szkielet na czystym CSS: stare WebKity potrafią wyciąć `@layer` Tailwinda v4).

#### Mechanizm awarii (dlaczego)

- 2026-07-26 (zreprodukowane zrzutem `?debug=1`): `.content-layer` z `z-index: 10` był kontekstem stackingu; iOS pod `overflow: hidden` nie malował uwięzionych w nim elementów `fixed` → strona „samo tło". Fix: `.content-layer` bez z-index, `.bg-layer` z `z-index: -1`. Każdy nowy kontekst stackingu na tej ścieżce może przywrócić bug, którego nie da się odtworzyć w Playwright/WebKit na Windows (software WebKit nie komponuje jak GPU iOS).
- 2026-07-24: pełnoekranowy `fixed` canvas WebGL był komponowany przez GPU iOS nad rodzeństwem `fixed`; stąd zasada „zero canvasu/wideo `fixed` w treści; na coarse nic ruchomego".
- `transform`/`filter`/`perspective` na przodku tworzą containing block dla `position: fixed` (Navbar/dialog lądują w środku sekcji zamiast w viewporcie); kit opisuje to samo przy `animation-fill-mode` (`app.css:150-161`).
- `mix-blend-mode: screen` na `<video>` w kontenerze hero jest OK (blend z posterem pod spodem), ale na elemencie z tekstem zmienia kontrast poniżej AA.

#### Niepoprawnie

```tsx
<div className="content-layer" style={{ zIndex: 10, background: "#121212" }}>       // kontekst stackingu + zasłania tło
  <video className="fixed inset-0 -z-10 object-cover" … />                          // fixed w treści
  <section className="relative z-20 backdrop-blur-sm">…</section>                    // z-index + backdrop-filter na sekcji
```

```css
.content-layer { transform: translateZ(0); will-change: transform; }   /* „promocja warstwy" psuje fixed */
```

#### Poprawnie

```css
/* globals.css: bez zmian */
.bg-layer { position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: -1; pointer-events: none; isolation: isolate; background: … #121212; }
.content-layer { position: relative; display: flex; flex-direction: column; min-height: 100dvh; }

/* hero: media absolute w kontenerze z overflow hidden */
.hero { position: relative; overflow: hidden; min-height: min(86dvh, 820px); }
.hero-media { position: absolute; top: 0; right: 0; bottom: 0; left: 0; overflow: hidden; }
.hero-media img, .hero-media video { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; }
.hero-media::after { content: ""; position: absolute; top: 0; right: 0; bottom: 0; left: 0; background: linear-gradient(180deg, rgba(18,18,18,.15), rgba(18,18,18,.85)); }
.hero-content { position: relative; }   /* tekst nad mediami przez kolejność w DOM, bez z-index */
```

#### Test

```bash
# szkielet zamrożony
grep -nE '^\.content-layer\s*\{' -A 12 site/src/styles/globals.css | grep -E 'z-index|isolation|transform|filter|will-change|contain|background' && echo "content-layer: ZAKAZANA właściwość"
grep -nE '^\.bg-layer' -A 25 site/src/styles/globals.css | grep -qE 'z-index:\s*-1' || echo "bg-layer: brak z-index:-1"
# nowe fixed/z-index w komponentach (oczekiwane: tylko Navbar, dialog)
grep -rnE 'position:\s*fixed|className="[^"]*\bfixed\b' site/src --include=*.tsx --include=*.css | grep -vE 'Navbar|BookingDialog|BookingModal|bg-layer|globals\.css'
grep -rnE 'z-index|\bz-\[?[0-9]' site/src --include=*.tsx --include=*.css | grep -vE 'Navbar|BookingDialog|BookingModal|bg-layer|company-ui\.css|thead|sticky'
# wideo tylko w .hero-media (hero) i .tool-tile (klipy hover)
grep -rnE '<video' -B 3 site/src/components/HeroMedia.tsx | grep -q 'hero-media' || echo "video poza .hero-media"
grep -rnE '<video' -B 3 site/src/components/ToolWall.tsx | grep -q 'tool-tile' || echo "klip poza .tool-tile"
grep -rlE '<video' site/src | grep -vE 'HeroMedia\.tsx|ToolWall\.tsx'   # = 0
# transform/filter na przodkach fixed (ocena: DevTools → Navbar → Computed → sprawdzić przodków)
# realny iPhone Karola po każdej zmianie w hero/globals: pełna treść widoczna; ?debug=1 zrzut w razie wątpliwości.
```

Docelowo krok `stacking` w `scripts/verify-site.mjs` + WebKit 390×844 `elementFromPoint` w środku ekranu = element treści (jak w sesji 2026-07-24).

#### Wyjątki

- `Navbar` (`position: sticky`/`fixed`, `z-index` własny, tło nieprzezroczyste `--surface-overlay`) i natywny `<dialog>` (top layer, bez z-index) są jedynymi elementami poza flow.
- `isolation: isolate` na `.bg-layer` jest częścią fixu, nie naruszeniem.

### 4.5 media-asset-review-gate

**Bramka przeglądu assetu: „nie widać, że AI", brak ludzi/tekstu/ciepłej barwy, zdejmowalne bez straty treści, banding na OLED, budżet**

Impact: **HIGH** · Tagi: media, review, brand, quality · Źródło: higgsfield §6.2/§8 („AI-slop", przegląd adwersarialny) · synthesis §2.6.1 (decyzja Karola „nie da się poznać, że to AI") · taste §4.5/§4.7 (Production-Test Tells) · ui-kit-habits P3 (scrim/kontrast) · Dodano: 2026-09-12 · Plik: `rules/media-asset-review-gate.md`

#### Zasada

Żaden plik nie trafia do `site/public/media/` ani `site/public/thumbs/` bez zaliczonej bramki. Bramka = tabela w `site/media/SOURCES.md` pod wpisem assetu, wypełniona przez agenta `media-auditor` (read-only) i potwierdzona przez Karola („oko marki"). Wszystkie pozycje muszą być TAK:

| # | Pytanie | Jak sprawdzić |
|---|---|---|
| 1 | Czy osoba spoza zespołu NIE zgadnie w 5 s, że to generatywne AI? | 2 osoby (Karol, Paweł) oglądają 10 s pętli na OLED; test „gdzie jest AI-tell": zniekształcone krawędzie, pływające tekstury, „mydlany" blur, nieciągłości na spawie pętli |
| 2 | Zero ludzi, rąk, twarzy, sylwetek? | oględziny każdej z klatek co 1 s (`ffmpeg -vf fps=1` → PNG) |
| 3 | Zero tekstu, liter, cyfr, logo, znaków wodnych, UI, arkuszy, wykresów-imitacji? | j.w.; OCR kontrolny (`tesseract` na 10 klatkach; oczekiwane: pusty wynik) |
| 4 | Paleta: tylko stal `#A8B4C2`/`#8895A6`/`#69788C` na `#121212–#171717`; zero ciepłych barw (złoto, pomarańcz, neon, magenta)? | histogram (`ffmpeg -vf "signalstats"` lub Photoshop): średnia H w zakresie 200–230°, S ≤ 25 %; punktowa próbka najjaśniejszego piksela nie może mieć R > B |
| 5 | Zdejmowalne bez straty treści? | usuń `<video>`/obraz z DOM: H1, lead, CTA i każda informacja pozostają; asset nie niesie żadnej treści |
| 6 | Kontrast tekstu na NAJJAŚNIEJSZEJ klatce ≥ 4,5:1 (lead) i ≥ 3:1 (H1 ≥ 24 px)? | klatka o max luminancji (`signalstats` YMAX) + overlay gradient → pomiar kontrastu (docelowy `scripts/audit-contrast.mjs --hero`, dziś Polypane albo DevTools) |
| 7 | Brak bandingu i migotania na OLED? | iPhone Karola, jasność 100 %, ciemne pomieszczenie; na `signalstats` brak skoków YAVG między sąsiednimi klatkami > 2 % |
| 8 | Spaw pętli niewidoczny? | ostatnia klatka == pierwsza (`ffmpeg` różnica klatek → `psnr` ≥ 45 dB); podgląd 3 pełnych obrotów |
| 9 | Poster = pierwsza klatka pętli (nie „najładniejsza" ze środka)? | `psnr` poster vs klatka 0 ≥ 45 dB |
| 10 | Budżety (`media-video-budgets`) spełnione? | rozmiary, fps, `-an`, czas 6–10 s |
| 11 | Spójność z kitem (1px hairlines, satyna, single cool key light, locked-off camera, extremely slow)? | porównanie z master still (`image_references`) obok siebie |
| 12 | Wejścia zgodne z `media-higgsfield-inputs-policy`? | lista `image_references` we wpisie SOURCES.md |

Wynik: `PASS` (12/12) albo `FAIL` z numerami pozycji i decyzją (dogrywka / postprodukcja / odrzucenie). Asset `FAIL` nie wchodzi do `public/`. Przegląd powtarza się przy każdej nowej wersji (`-v2`).

**Druga ścieżka bramki: NAGRANIA NARZĘDZI** (`record-demos.mjs`, v1: nagranie hero i cztery klipy hover). Materiał nie jest generatywny, więc pozycje 1, 8 i 11 nie mają zastosowania, ale dochodzą własne, twarde:

| # | Pytanie | Jak sprawdzić |
|---|---|---|
| N1 | Czy cyfry KPI, etykiety osi i hairline 1 px są czytelne **po enkodowaniu**? | stop-klatka z gotowego `.webm` w 100 % skali, oglądana na OLED i na 1440p: zero artefaktów wokół cyfr, hairline nie faluje. FAIL = ciaśniejszy kadr albo wyższy budżet, **nigdy niższy `crf` kosztem limitu** |
| N2 | Czy w kadrze nie ma realnych danych, nazwy produktu, domeny ani marki firmy źródłowej? | `SRC_BRAND_RE` na DOM przed nagraniem (jak przy zrzutach) plus oględziny stop-klatek z `--contact-sheet`; dane wyłącznie demo |
| N3 | Czy ruch czyta się jako **praca narzędzia**, a nie jako reklama? | dwie osoby oglądają bez kontekstu i mówią, co widzą; oczekiwana odpowiedź zawiera „liczy", „przelicza", „zmienia się" |
| N4 | Czy dwa klipy nie są bliźniacze? | arkusz stop-klatek obok siebie; bliźniacze = zmiana sceny, nigdy filtr graficzny (ta sama zasada co przy 13 zrzutach, R-T1) |
| N5 | Czy klatka 0 zgadza się z posterem (kadr produktu albo kafel)? | PSNR ≥ 45 dB po przeskalowaniu obu do wspólnego rozmiaru (`media-poster-first-frame`) |
| N6 | Czy manifest i determinizm się zgadzają? | `record-demos.mjs --verify` zielone (`media-recorded-demo-determinism`) |
| N7 | Budżety spełnione? | `media-video-budgets`: hero ≤ 1,2 / 1,4 MB, klip ≤ 320 KB, 24 fps CFR, `-an` |

Werdykt zapisujemy tak samo (`WYNIK: PASS 7/7` dla nagrania, `PASS 12/12` dla materiału generatywnego), bo bramka `verify-site.mjs` czyta linię `WYNIK:` z `SOURCES.md`.

#### Mechanizm awarii (dlaczego)

- Persona (CFO firmy produkcyjnej, „kalkulator, nie wróżka") czyta rozpoznawalne AI-wideo jako brak powagi; jedna „hollywoodzka" pętla podważa cały argument „dane zostają u Ciebie" (higgsfield §6.2, §8 „AI-slop: strona traci powagę").
- Tekst/cyfry w generatywnym wideo są zniekształcone; strona ma PRAWDZIWE żywe dashboardy: imitacja obok oryginału to sprzeczność.
- Złoto/pomarańcz = stara marka; presety „NEON CITY" itp. łamią Color Lock (`brand-*`).
- Banding na stalowych gradientach w 8-bit to główna wada generatywnych pętli; widoczny tylko na OLED w ciemności, więc test na laptopie go nie wykryje.
- Ludzie/hale sugerują konkretnego klienta (zasada #3) i są natychmiast rozpoznawalne jako AI.
- Poster ze środka pętli = widoczny przeskok przy crossfade `poster → video` (klatka 0 ≠ poster).

#### Niepoprawnie

```
SOURCES.md: „hero-v1: wygląda OK, wrzucam"           # brak tabeli, brak drugiej osoby, brak OLED
poster wybrany z klatki 4,2 s („ładniejsze światło")  # przeskok przy crossfade
prompt bez negatywów → w kadrze cień sylwetki i miękki napis na powierzchni
```

#### Poprawnie

Wpis dziennika w `site/media/SOURCES.md`: tabela 12 pozycji z dowodem per pozycja i linia werdyktu,
zgodnie ze wzorem w [`references/asset-review-log.md`](../references/asset-review-log.md) §1
(dziennik trzymamy poza regułą: reguła mówi, CO sprawdzić, dziennik notuje, co wyszło).

```
#### hero-v1 · przegląd (2026-09-2x) · audytor: media-auditor · potwierdził: Karol
| # | wynik | dowód |  → 12 wierszy, każdy z dowodem (pomiar, nie opinia)
WYNIK: PASS 12/12 → public/media/hero-v1.*
```

#### Test

```bash
# klatki do oględzin i OCR (scratchpad)
ffmpeg -y -i hero-v1.mp4 -vf fps=1 frame_%02d.png && for f in frame_*.png; do tesseract "$f" - 2>/dev/null | grep -E '[A-Za-z0-9]{2,}' && echo "TEKST w $f"; done
# spaw pętli i poster
ffmpeg -i hero-v1.mp4 -vf "select=eq(n\,0)" -frames:v 1 first.png; ffmpeg -sseof -0.05 -i hero-v1.mp4 -frames:v 1 last.png
ffmpeg -i first.png -i last.png -lavfi psnr -f null - 2>&1 | grep -oE 'average:[0-9.]+'      # ≥ 45
ffmpeg -i first.png -i hero-v1.poster.webp -lavfi psnr -f null - 2>&1 | grep -oE 'average:[0-9.]+'   # ≥ 45
# migotanie/banding: statystyki jasności per klatka
ffmpeg -i hero-v1.mp4 -vf signalstats -f null - 2>&1 | grep -oE 'YAVG:[0-9.]+' | head -240   # różnice sąsiednie ≤ 2 %
# wpis PASS w SOURCES.md dla każdego pliku w public/media
for f in site/public/media/*.webm; do b=$(basename "$f" .webm); grep -A 16 "## $b" site/media/SOURCES.md | grep -q 'WYNIK: PASS 12/12' || echo "BRAK PASS dla $b"; done
```

Docelowo `scripts/verify-site.mjs` krok `media-asset-review-gate` (obecność `PASS 12/12` per plik) + `checklists/new-asset.md`.

#### Wyjątki

- Zrzuty dem z `shoot-tools.mjs` (nie AI) przechodzą skróconą bramkę: pozycje 4 (paleta kitu z automatu), 5, 10 oraz „brak nazwy firmy źródłowej/produktu w UI" (grep w DOM przed zrzutem).
- Nagrania narzędzi z `record-demos.mjs` przechodzą **ścieżkę N1–N7** powyżej zamiast pozycji 1, 8 i 11 (nie są materiałem generatywnym, nie mają spawu pętli w przypadku hero i nie porównują się do master stilla).
- Portrety founderów: pozycje 4 (duotone stal), 7, 10 i zgoda obu founderów na publikację (D-05).

### 4.6 media-headers-versioning

**Pliki w public/media i public/thumbs mają wersję w nazwie i nagłówek immutable; zmiana treści = nowa wersja, nigdy nadpisanie**

Impact: **HIGH** · Tagi: media, cache, cloudflare, headers, versioning · Źródło: CLAUDE.md 2026-07-22 (bug cache „samo tło": stary index.html + purge assetów) · site/public/_headers · higgsfield §4.4 „nazwy z wersją"/§11 · synthesis §2.2 (_headers) · seo-headers · Dodano: 2026-09-12 · Plik: `rules/media-headers-versioning.md`

#### Zasada

Pliki w `site/public/` nie dostają hasha Vite (kopiowane 1:1 do `dist/`), więc:

1. **Nazwa z wersją**: `public/media/<name>-v<N>[.warstwa].<ext>` dla mediów i `<name>-v<N>-<szerokość>.<ext>` dla zrzutów. Rodziny plików w v1: **`hero-production-v<N>.{webm,mp4,av1.mp4}`** (nagranie hero), **`hero-production-v<N>.webp`** (kadr produktu = poster = LCP; wariant `-800`), **`hero-ground-v<N>.webp`** (grunt stalowy, wariant `-800`), **`tools/<slug>-v<N>.webm`** (klip hover), `tools/<slug>-v<N>-1280.webp`, `thumbs/<slug>-v<N>-640.webp`. Jeden wzorzec obejmujący oba kształty:

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
4. Wszystkie odwołania w kodzie idą przez stałe w jednym module (`src/data/media.ts`: `HERO_POSTER`, `HERO_SOURCES`, `HERO_GROUND`, `toolMedia(slug)`, `clipFor(slug)`), nie przez literały rozsiane po komponentach; `tools.ts` `media.thumb/wide` wskazują na wersjonowane nazwy. Manifesty: `site/media/SHOTS.json` (zrzuty) i `site/media/CLIPS.json` (nagrania, `media-recorded-demo-determinism`), oba bez dat.
5. Preload postera w `index.html` i w shellach prerenderu używa tej samej stałej (skrypt `prerender.mjs` czyta ją z `data/media.ts`, nie z literału).

#### Mechanizm awarii (dlaczego)

- 2026-07-22: przeglądarki telefonów trzymały stary `index.html` wołający wypurgowane assety; SPA-fallback oddawał HTML zamiast JS → „samo tło". Fix: HTML `no-cache`, assety `immutable`. Media bez hasha i bez `immutable` wracają do tego samego problemu w drugą stronę: przeglądarka trzyma stary `hero.mp4` po podmianie treści (albo pobiera 1,5 MB przy każdej wizycie, gdy nagłówek jest domyślny).
- Nadpisanie `hero-v1.webm` nową treścią przy `immutable` = użytkownicy z cache widzą starą pętlę przez rok, a poster (nowy, bo mniejszy TTL w CDN) nie pasuje do pierwszej klatki: widoczny przeskok przy crossfade.
- Literały ścieżek w 5 miejscach (komponent, shell, `index.html` preload, `og.mjs`, `tools.ts`) rozjeżdżają się przy podbiciu wersji: preload wskazuje `-v1`, komponent `-v2` = podwójne pobranie i zmarnowany preload.

#### Niepoprawnie

```
public/media/hero.webm                 # bez wersji
public/media/hero-poster.webp          # bez wersji, nadpisywany przy każdej regeneracji
public/_headers                         # brak reguły /media/*
```

```tsx
<img src="/media/hero-poster.webp" />                     // literał w komponencie
<link rel="preload" as="image" href="/media/hero.webp">   // inna nazwa w index.html
```

#### Poprawnie

```
public/media/hero-production-v1.webm
public/media/hero-production-v1.mp4
public/media/hero-production-v1.webp          # kadr produktu = poster = LCP (klatka 0 nagrania)
public/media/hero-production-v1-800.webp
public/media/hero-ground-v1.webp              # grunt stalowy (Higgsfield, still)
public/media/tools/kontroling-kosztow-v1.webm # klip hover
public/media/tools/raport-zarzadczy-v1-1280.webp
public/thumbs/raport-zarzadczy-v1-640.webp
```

```ts
// src/data/media.ts (jedyne źródło ścieżek mediów)
export const HERO_VERSION = 1;
export const HERO_POSTER = `/media/hero-production-v${HERO_VERSION}.webp`;   // kadr produktu = klatka 0 = LCP
export const HERO_GROUND = `/media/hero-ground-v${HERO_VERSION}.webp`;       // still Higgsfield, lazy
export const HERO_SOURCES = [
  { src: `/media/hero-production-v${HERO_VERSION}.webm`, type: 'video/webm; codecs="vp9"' },
  { src: `/media/hero-production-v${HERO_VERSION}.mp4`,  type: 'video/mp4; codecs="avc1.640028"' },
] as const;
export const toolMedia = (slug: string, v = 1) => ({ wide: `/media/tools/${slug}-v${v}-1280.webp`, thumb: `/thumbs/${slug}-v${v}-640.webp` });
export const clipFor = (slug: string, v = 1) => `/media/tools/${slug}-v${v}.webm`;   // klipy hover: tylko 4 slugi
```

```
# public/_headers (fragment)
/media/*
  Cache-Control: public, max-age=31536000, immutable
/thumbs/*
  Cache-Control: public, max-age=31536000, immutable
```

#### Test

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
grep -nE '/media/' site/index.html | grep -vE 'hero-production-v[0-9]+\.webp'   # preload musi wskazywać wersjonowany kadr produktu
# po deployu (curl produkcji): nagłówek immutable na /media/hero-v1.poster.webp
curl -sI https://klarow.com/media/hero-production-v1.webp | grep -i cache-control   # public, max-age=31536000, immutable
```

Docelowo `scripts/verify-site.mjs` krok `media-headers-versioning`.

#### Wyjątki

- `favicon.ico`, `apple-touch-icon.png`, `klarow-logo-512.png`, `robots.txt`, `google<token>.html` w korzeniu `public/` nie podlegają wersjonowaniu (stałe nazwy wymagane przez przeglądarki/GSC).
- `public/screens/` (istniejące zrzuty z sesji lipcowych) do migracji do `media/tools/*-v1-1280.webp` w fazie 1; do tego czasu nieużywane.

### 4.7 media-recorded-demo-determinism

**Nagrania narzędzi wchodzą do repo wyłącznie jako re-enkod z wyodrębnionych klatek 24 fps CFR; manifest CLIPS.json trzyma hashe klatek, nie kontenera; rozjazd z UI = czerwony build**

Impact: **HIGH** · Tagi: media, video, determinism, playwright, ffmpeg · Źródło: docs/plan/strona-v2-plan.md §7.5a i §7.4 M9 (2026-09-12 wieczór, D35/D37) · docs/plan/warstwa-wrazenia.md §9 · perf-images-policy p.5 (determinizm zrzutów) · CLAUDE.md zasada #6 (determinizm jako obietnica produktowa) · Dodano: 2026-09-12 · Plik: `rules/media-recorded-demo-determinism.md`

#### Zasada

Nagrania z `site/scripts/record-demos.mjs` (v1: `hero-production-v<N>.*` plus cztery klipy hover `tools/<slug>-v<N>.webm`) powstają **dwuetapowo** i nigdy nie trafiają do `public/` prosto z Playwrighta:

1. **Nagraj** w kontekście deterministycznym identycznym ze `shoot-tools.mjs` (zamrożony `Date` na `2026-07-22T09:00:00.000Z`, `Math.random` = `mulberry32(0xC10A12)`, `localStorage.clear()`, `colorScheme: "dark"`, `locale: "pl-PL"`, `timezoneId: "Europe/Warsaw"`, `hasTouch: false`, `addStyleTag` gaszący karetkę, scrollbar i pierścień fokusu), z jedną różnicą: **`reducedMotion: "no-preference"`**, bo treścią nagrania są własne reveale dashboardu.
2. **Wyodrębnij klatki** (`ffmpeg -vf fps=24` → PNG), policz `sha256` każdej klatki, zapisz **digest listy klatek** do manifestu.
3. **Re-enkoduj z klatek** na stałych 24 fps CFR (VP9 plus H.264 dla hero). Do repo wchodzi wyłącznie ten plik.

**Manifest `site/media/CLIPS.json`** (commitowany, stabilny JSON: klucze posortowane, wcięcie 2, **bez dat**, tak jak `SHOTS.json`): po jednym wpisie na nagranie z polami `file`, `slug`, `scene`, `w`, `h`, `fps`, `durationMs`, `bytes`, `crf`, `framesSha256` (digest listy hashy klatek), `posterPsnrDb`, `engine`.

**Bramka `check:clips`** w `npm run check` (lokalnie, nie na CI: CI nie ma przeglądarki):
- `--verify` powtarza nagranie i potok klatkowy i porównuje `framesSha256`: **różnica = wyjście 1 z nazwą sluga**,
- zawsze, także bez przeglądarki: `bytes` w budżecie (`media-video-budgets`), `durationMs` w tolerancji ±200 ms, `fps` = 24, 0 strumieni audio, **PSNR klatki 0 wobec zrzutu tego samego narzędzia ≥ 45 dB** (po przeskalowaniu obu do wspólnego rozmiaru: nagranie powstaje w skali 1×, zrzut w 2×).

**Scenariusze wyłącznie na rolach i widocznym tekście** (`getByRole`, `getByText`): `components/dashboards/**` i `DemoReport.tsx` są w v1 zamrożone (`strona-v2-plan.md` §12.1), więc **nie wolno dokładać w nich `data-shot`**. Dozwolone są tylko `data-dashboard` i `data-ready` z `DashboardMount`. Scenariusz cytuje etykietę i numer linii źródła w komentarzu; **brak trafienia = twardy błąd z nazwą sluga, nigdy puste nagranie**.

**ffmpeg**: wymagana pełna instalacja (`winget install Gyan.FFmpeg`). Build `ffmpeg-1011` dostarczany z Playwrightem ma wyłącznie `libvpx_vp8` (bez VP9, x264, WebP i AV1) i nie nadaje się do produkcji plików. **Build strony nigdy nie woła ffmpeg**: do gita wchodzą gotowe pliki, więc brak ffmpeg u kogokolwiek nie psuje `npm run build` ani CI. Wersja ffmpeg i pełne komendy idą do wpisu w `site/media/SOURCES.md`.

#### Mechanizm awarii (dlaczego)

- **Kontener z `recordVideo` nie jest bajtowo powtarzalny**: timing klatek VP8 zależy od obciążenia maszyny, więc bramka licząca `sha256` pliku byłaby czerwona losowo i po tygodniu ktoś by ją wyłączył. Klatki PNG są powtarzalne, bo pochodzą z deterministycznego renderu; dopiero one są przedmiotem porównania.
- Bez re-enkodu z klatek plik ma zmienną klatkę (VFR), co psuje zapętlenie klipów hover (skok na spawie) i utrudnia trafienie w budżet.
- **Nagranie rozjeżdża się z UI dokładnie tak samo jak zrzut** (R18): po zmianie dashboardu strona zaczyna pokazywać ruch, którego już nie ma w produkcie. Różnica jest taka, że w nagraniu widać to później niż w zrzucie, bo nikt nie ogląda ośmiu sekund przy każdym buildzie.
- Determinizm dem jest w tym projekcie **obietnicą produktową** („kalkulator, nie wróżka", CLAUDE.md zasada #6): materiał marketingowy, który przy dwóch przebiegach pokazuje inne liczby, podważa dokładnie to zdanie, które sprzedajemy.
- `reducedMotion: "reduce"` w kontekście nagrania daje klip bez ruchu interfejsu, czyli nagranie, w którym „nic się nie dzieje" mimo poprawnych danych.

#### Niepoprawnie

```js
// plik prosto z Playwrighta do public/ (VP8, VFR, rozmiar zależny od maszyny)
const raw = await page.video().path();
fs.copyFileSync(raw, "public/media/tools/kontroling-kosztow-v1.webm");
```

```js
// bramka na hashu kontenera: czerwona losowo
if (sha256(fs.readFileSync(out)) !== manifest.sha256) throw new Error("rozjazd");
```

```js
// selektor po klasie CSS zamiast po roli i tekście: milczący FAIL po zmianie kitu
await page.locator(".etc-input").fill("180000");
```

#### Poprawnie

```js
// 1) nagraj  2) klatki + hash  3) re-enkod z klatek (24 fps CFR)
await scene.steps(page);
await context.close();                                  // dopiero teraz plik jest kompletny
const raw = await page.video().path();

run(`ffmpeg -y -i "${raw}" -vf fps=24 "${FRAMES}/f_%04d.png"`);
const framesSha256 = sha256(fs.readdirSync(FRAMES).sort().map((f) => sha256(fs.readFileSync(path.join(FRAMES, f)))).join("\n"));

run(`ffmpeg -y -framerate 24 -i "${FRAMES}/f_%04d.png" -r 24 -an -c:v libvpx-vp9 -b:v 0 -crf ${crf} ` +
    `-row-mt 1 -deadline good -cpu-used 2 -g 192 -pix_fmt yuv420p "${out}"`);

// scena: wyłącznie role i widoczny tekst (CostControl.tsx: „Zatwierdź tydzień")
await p.getByRole("spinbutton").first().fill("180000");
await p.getByRole("button", { name: /Zatwierdź tydzień/i }).hover();
```

```json
// site/media/CLIPS.json (fragment; bez dat, klucze posortowane)
{ "tools/kontroling-kosztow-v1.webm": { "slug": "kontroling-kosztow", "scene": "etc-eac-marza",
  "w": 960, "h": 600, "fps": 24, "durationMs": 6500, "bytes": 298112, "crf": 36,
  "framesSha256": "…", "posterPsnrDb": 47.1, "engine": "webkit-2311" } }
```

#### Test

```bash
# manifest istnieje, nie ma w nim dat i pokrywa każdy plik wideo z public/media
[ -f site/media/CLIPS.json ] || echo "BRAK CLIPS.json"
grep -nE '"(date|generatedAt|createdAt)"' site/media/CLIPS.json   # = 0 (data zmieniałaby plik przy każdym przebiegu)
for f in site/public/media/tools/*.webm site/public/media/hero-production-v*.webm; do
  [ -f "$f" ] || continue; b=$(basename "$f"); grep -q "$b" site/media/CLIPS.json || echo "BRAK wpisu dla $b"; done
# parametry pliku: 24 fps CFR, zero audio
ffprobe -v error -show_entries stream=codec_type,r_frame_rate,nb_frames -of default=nw=1 site/public/media/hero-production-v1.webm
ffprobe -v error -select_streams a -show_entries stream=codec_type -of csv=p=0 site/public/media/hero-production-v1.webm | wc -l   # = 0
# pełna bramka (lokalnie, wymaga WebKita i ffmpeg): dwa przebiegi = identyczny framesSha256
cd site && node scripts/record-demos.mjs --verify && echo OK
# klatka 0 zgadza się ze zrzutem tego samego narzędzia (≥ 45 dB)
ffmpeg -y -i site/public/media/tools/kontroling-kosztow-v1.webm -frames:v 1 c0.png
ffmpeg -i c0.png -i site/public/media/tools/kontroling-kosztow-v1-1280.webp -lavfi "scale=960:600,psnr" -f null - 2>&1 | grep -oE 'average:[0-9.]+'
# scenariusze bez data-shot w plikach zamrożonych (oczekiwane: 0)
grep -rnE 'data-shot' site/src/components/dashboards site/src/components/DemoReport.tsx
```

Docelowo `npm run check` krok `check:clips` (lokalny, obok `check:shots`).

#### Wyjątki

- Brak. Jeśli nagranie nie da się odtworzyć dwa razy z tym samym `framesSha256`, wchodzi wariant bez nagrania (statyczny kadr produktu, `strona-v2-plan.md` §7.1 wariant B), a nie „nagranie bez bramki".

### 4.8 media-video-budgets

**Budżety wideo: nagranie hero ≤ 1,2 MB WebM / ≤ 1,4 MB H.264, klip hover ≤ 320 KB, poster = kadr produktu ≤ 110 KB, 6–10 s, 24 fps CFR, bez audio**

Impact: **HIGH** · Tagi: media, video, budget, performance, lcp · Źródło: higgsfield §4.4 (pipeline ffmpeg, bramka rozmiaru) · synthesis §2.4.9/§2.6.1 · showreel §5.9 · feasibility-perf §9 p.5 · docs/plan/strona-v2-plan.md §6.7 i §7 (2026-09-12 wieczór, D37) · docs/plan/warstwa-wrazenia.md §5 · Dodano: 2026-09-12 · Plik: `rules/media-video-budgets.md`

#### Zasada

Każdy plik w `site/public/media/` spełnia:

| Plik | Limit | Parametry |
|---|---|---|
| `hero-production-v<N>.webm` (VP9): **nagranie narzędzia, niesie tekst UI** | ≤ 1 258 291 B (1,2 MB) | 1600×1000, 8 s, 24 fps CFR, `-an`, `yuv420p`, GOP 192, **bez `loop`** |
| `hero-production-v<N>.mp4` (H.264) | ≤ 1 468 006 B (1,4 MB) | `profile high`, `level 4.1`, `+faststart`, `-an`, `yuv420p` |
| `hero-production-v<N>.av1.mp4` (opcjonalny) | ≤ 943 718 B (0,9 MB) | `libsvtav1`, `+faststart`, `-an` |
| **poster hero** `hero-production-v<N>.webp` (kadr produktu, **element LCP**) | ≤ 112 640 B (110 KB); wariant 800×500 ≤ 56 320 B | 1600×1000, q ≈ 80, **KLATKA 0 pliku wideo**; osobnego „postera pętli" NIE MA |
| `hero-ground-v<N>.webp` (grunt, still Higgsfield) | ≤ 71 680 B (70 KB); wariant 800 px ≤ 30 720 B | `loading="lazy"`, nigdy preload (`perf-images-policy`) |
| `hero-production-v<N>.lqip.webp` (opcjonalny) | ≤ 2 048 B | 48 px szerokości |
| klipy hover `tools/<slug>-v<N>.webm` (**v1, dokładnie 4**) | ≤ 327 680 B (320 KB) | 960×600, 6–7 s, 24 fps, `-an`, `loop`, `preload="none"`; suma na trasie ≤ 1 331 200 B |
| zrzuty dem `tools/<slug>-v<N>-1280.webp` | ≤ 122 880 B (120 KB) | 1280×800, q 80 (patrz `perf-images-policy`) |
| miniatury `thumbs/<slug>-v<N>-640.webp` | ≤ 40 960 B (40 KB) | 640×400 |

Długość: nagranie hero 8 s (dopuszczalne 6–10 s), klip hover 6–7 s. Zawsze stałe 24 fps (`-r 24`), zawsze bez ścieżki audio, zawsze dithering `noise=alls=3:allf=t+u` na ciemnych gradientach (anty-banding na OLED). **Transfer `/` desktop: ≤ 716 800 B (700 KB) do zdarzenia `load`** (bramka przeciw przemyceniu wideo przed LCP) **i ≤ 2 621 440 B (2,5 MB) na pełną wizytę bez klipów hover**; mobile ≤ 358 400 B (350 KB), w tym **0 B** mediów wideo.

**Gdyby wrócił wariant D37(b)** (pętla generatywna jako tekstura pod scrimem `.88` zamiast nagrania): obowiązuje inny zestaw, bo pod scrimem nie widać szczegółu: WebM ≤ 737 280 B, MP4 ≤ 1 003 520 B, AV1 ≤ 573 440 B, kadr 1440×616, plus osobny poster pętli ≤ 46 080 B, który **nigdy nie jest preloadowany**. Zestawów nie wolno mieszać: obowiązuje ten zgodny z wybranym wariantem D37.

Bramka: `scripts/verify-site.mjs` krok `media-video-budgets` liczy rozmiary w `dist/media` i `dist/thumbs` i porównuje z tabelą; przekroczenie = fail buildu.

#### Mechanizm awarii (dlaczego)

- 1,2 MB na 4G (≈ 5–8 Mb/s realnie) to 1,5–2 s pobierania po `window.load`; większy plik opóźnia crossfade poza „pierwsze wrażenie" i zjada budżet transferu 2,5 MB.
- Poster jest LCP: 110 KB WebP ładuje się w < 250 ms na 4G; JPG 300 KB przesuwa LCP mobile poza 2,5 s (Lighthouse mobile ≥ 90 nie przejdzie).
- Budżet nagrania hero jest zaostrzony także **od dołu**: poniżej ok. 1 MB VP9 rozkłada cyfry KPI i hairline 1 px (artefakty wokół tekstu), a to jest treść kadru. Gdy plik nie mieści się w 1,2 MB przy `crf 34`, **skracamy scenę albo zawężamy kadr, nigdy nie rozmywamy obrazu**.
- Audio w pliku blokuje autoplay na iOS nawet przy `muted` w niektórych wersjach i dodaje ~100–200 KB.
- 30/60 fps podnoszą rozmiar o 25–100 % bez zysku na „extremely slow motion"; zmienna klatka (VFR z generatorów) psuje pętlę (skok na spawie).
- Banding: 8-bit VP9/H.264 na stalowych gradientach robi pasy widoczne na OLED (iPhone Karola); `noise=3` + niższy CRF w ciemnych scenach to jedyne tanie remedium (higgsfield §8).

#### Niepoprawnie

```
public/media/hero.mp4            4 812 331 B   30 fps VFR, AAC audio, 1080p, 14 s
public/media/hero-poster.jpg       318 902 B
```

#### Poprawnie

```powershell
# pipeline (scratchpad, bez `&` w ścieżce; ffmpeg z `winget install Gyan.FFmpeg`)
# nagranie narzędzia: klatki PNG z record-demos.mjs -> re-enkod 24 fps CFR (media-recorded-demo-determinism)
ffmpeg -y -framerate 24 -i frames\f_%04d.png -r 24 -an -vf "scale=1600:-2:flags=lanczos,crop=1600:1000" `
  -c:v libvpx-vp9 -b:v 0 -crf 34 -row-mt 1 -deadline good -cpu-used 2 -g 192 -pix_fmt yuv420p hero-production-v1.webm
ffmpeg -y -framerate 24 -i frames\f_%04d.png -r 24 -an -vf "scale=1600:-2:flags=lanczos,crop=1600:1000" `
  -c:v libx264 -profile:v high -level 4.1 -preset slow -tune film -crf 24 -g 192 -pix_fmt yuv420p -movflags +faststart hero-production-v1.mp4
ffmpeg -y -i hero-production-v1.webm -frames:v 1 -c:v libwebp -quality 80 hero-production-v1.webp      # poster = klatka 0 = LCP
ffmpeg -y -i hero-production-v1.webm -frames:v 1 -vf "scale=800:-2" -c:v libwebp -quality 80 hero-production-v1-800.webp
Get-ChildItem hero-production-v1.* | Select-Object Name, Length   # bramka ręczna przed kopiowaniem do site/public/media
```

#### Test

```bash
# rozmiary (Git Bash; oczekiwane: brak wierszy „PRZEKROCZENIE")
cd site/public/media 2>/dev/null || exit 0
for f in hero-production-v*.webm; do [ -f "$f" ] && [ $(stat -c%s "$f") -gt 1258291 ] && echo "PRZEKROCZENIE $f"; done
for f in hero-production-v*.mp4;  do [ -f "$f" ] && [ $(stat -c%s "$f") -gt 1468006 ] && echo "PRZEKROCZENIE $f"; done
for f in hero-production-v*.webp; do [ -f "$f" ] && [ $(stat -c%s "$f") -gt 112640 ] && echo "PRZEKROCZENIE $f"; done
for f in hero-ground-v*.webp;     do [ -f "$f" ] && [ $(stat -c%s "$f") -gt 71680 ]  && echo "PRZEKROCZENIE $f"; done
for f in tools/*-v*.webm;         do [ -f "$f" ] && [ $(stat -c%s "$f") -gt 327680 ] && echo "PRZEKROCZENIE $f"; done
for f in *.lqip.webp;             do [ -f "$f" ] && [ $(stat -c%s "$f") -gt 2048 ]   && echo "PRZEKROCZENIE $f"; done
# suma klipów hover na trasie ≤ 1,3 MB (oczekiwane: SUMA OK)
S=$(stat -c%s tools/*-v*.webm 2>/dev/null | awk '{n+=$1} END {print n+0}'); [ "$S" -le 1331200 ] && echo "SUMA OK ($S)" || echo "SUMA PRZEKROCZONA ($S)"
# parametry (ffprobe ze scratchpadu)
ffprobe -v error -show_entries stream=codec_type,width,height,r_frame_rate,pix_fmt:format=duration -of default=nw=1 hero-production-v1.mp4
#   oczekiwane: 1 strumień video (0 audio), 1600×1000, 24/1, yuv420p, duration 6–10
# transfer strony (Lighthouse desktop na dist przez `node node_modules/vite/bin/vite.js preview`):
#   Total byte weight ≤ 2,5 MB z nagraniem hero; do zdarzenia `load` ≤ 700 KB (bramka runtime sumuje content-length przed `load`);
#   mobile ≤ 350 KB i ZERO requestów do /media/*.webm|mp4
```

Docelowo `scripts/verify-site.mjs` krok `media-video-budgets` (rozmiary) + Lighthouse w fazie 4.

#### Wyjątki

- AV1 jest opcjonalny; brak pliku `.av1.mp4` nie jest błędem. Jeśli jest, obowiązuje limit z tabeli.
- Klipy hover nie wliczają się do budżetu „pełnej wizyty" (startują wyłącznie z intencji użytkownika), ale mają własny limit sumy 1,3 MB na trasę.
- Portrety founderów (`public/media/founders/*.webp` ≤ 90 KB przy 960×1200) i OG (`≤ 200 KB`) mają osobne limity w `perf-images-policy`.

### 4.9 media-video-embed-spec

**Specyfikacja elementu <video>: muted playsInline loop preload=metadata poster, źródła AV1→VP9→H.264, aria-hidden, disablePictureInPicture, MediaBoundary, przycisk pauzy tła (WCAG 2.2.2)**

Impact: **HIGH** · Tagi: media, video, a11y, ios, lcp · Źródło: higgsfield §4.5 (szkic HeroVideo, wymagania 1–9) · synthesis §2.4.4 HeroMedia · showreel §5.4 · WebKit „New video policies for iOS" · WIG · WCAG 2.2.2 (Pause, Stop, Hide) · docs/plan/strona-v2-plan.md §3 S1 (przycisk pauzy + sessionStorage; etykieta „Zatrzymaj podgląd / Pause preview" po D37) · Dodano: 2026-09-12 · Plik: `rules/media-video-embed-spec.md`

#### Zasada

Każdy `<video>` na stronie (v1: `HeroMedia` na `/` i klipy hover w `ToolWall`) ma DOKŁADNIE ten zestaw atrybutów:

```tsx
<video
  muted playsInline
  // loop: TAK dla klipów hover (pętla 6–7 s); NIE dla nagrania hero (jedno odtworzenie, stop na ostatniej klatce)
  preload="metadata"                       // klipy hover: "none"
  poster={POSTER}                          // ten sam plik co <img> LCP; KLATKA 0 pliku wideo
  disablePictureInPicture disableRemotePlayback
  aria-hidden="true" tabIndex={-1}
  width={1600} height={1000}               // wymiary jawne = CLS 0 (klipy hover: 960×600)
  onCanPlay / onSuspend / onError          // obsługa w media-video-gating
>
  <source src="/media/hero-production-v1.av1.mp4" type='video/mp4; codecs="av01.0.05M.08"' />   {/* opcjonalny, najmniejszy */}
  <source src="/media/hero-production-v1.webm"    type='video/webm; codecs="vp9"' />
  <source src="/media/hero-production-v1.mp4"     type='video/mp4; codecs="avc1.640028"' />     {/* fallback Safari/iOS */}
</video>
```

Dodatkowo:
- brak atrybutu `autoPlay` w JSX: odtwarzanie startuje z `video.play().catch(...)` po bramkach (`media-video-gating`); brak `controls`, brak `src` na elemencie (tylko `<source>` z `type` z kodekiem, żeby przeglądarka wybrała bez pobierania),
- brak ścieżki audio w pliku (`-an` w ffmpeg); `muted` w JSX jest wymagany mimo to (iOS blokuje autoplay bez `muted` + `playsinline`),
- element siedzi w `MediaBoundary` (error boundary: awaria = poster, treść żyje) i w kontenerze `.hero-media` (`media-video-placement`),
- CSS: `.hero-media img, .hero-media video { position:absolute; inset:0; width:100%; height:100%; object-fit:cover }`; wideo ma `opacity: 0` do `canplay`, potem crossfade `opacity` 600 ms (`--duration-media`, `--ease-out`); `@media (prefers-reduced-motion: reduce) { .hero-media video { display: none } }`,
- zawsze obok: `<img src={POSTER} alt="" width height fetchPriority="high" decoding="async">` renderowany PRZED wideo (także w shellu prerenderu; `<video>` nigdy w shellu),
- nazwy plików z wersją (`hero-v1.*`, `media-headers-versioning`),
- **kontrola pauzy (WYMAGANA, WCAG 2.2.2 Pause, Stop, Hide)**: obok kontenera — POZA `aria-hidden` — renderowany jest przycisk
  `<button type="button" className="btn btn-secondary btn-sm hero-media-toggle" aria-pressed={paused}>Zatrzymaj podgląd / Pause preview</button>`
  (etykieta mówi prawdę: w v1 hero nie jest tłem, tylko **podglądem prawdziwego narzędzia**; „Zatrzymaj tło" byłoby nieprawdziwe i łamałoby `brand-honest-labels`)
  (PL/EN przez `pick()`), widoczny stale (nie tylko na hover), z widocznym `:focus-visible`, polem klikalnym ≥ 44×44 px
  (`a11y-touch-targets-44`) i scrimem pod spodem dla kontrastu AA na najjaśniejszej klatce. Przycisk istnieje TYLKO wtedy,
  gdy `<video>` jest zamontowane (poster sam z siebie się nie rusza, więc nie ma czego pauzować). Wybór użytkownika jest
  zapamiętany w `sessionStorage` pod kluczem `klarow:media:paused` (`"1"`/`"0"`; `docs/plan/strona-v2-plan.md:384`) i czytany
  PRZED pierwszym `play()`; zapis i odczyt w `try/catch` (Safari w trybie prywatnym rzuca). To jedyny dozwolony element
  sterujący: atrybut `controls`, pasek postępu i dźwięk pozostają zakazane (`media-video-gating` „Zakazane").

#### Mechanizm awarii (dlaczego)

- iOS: autoplay wymaga `muted` + `playsinline` + braku ścieżki audio; wideo, które zyska audio, zostaje spauzowane (WebKit blog 6784). Bez `playsInline` iPhone otwiera pełnoekranowy odtwarzacz.
- Bez `poster` i `<img>` LCP przesuwa się na pierwszą zdekodowaną klatkę wideo (po `window.load`): LCP > 2,5 s na 4G. `preload="auto"` pobiera 1,5 MB przed LCP.
- `src` bez `type` z kodekiem: Safari pobiera nagłówki każdego pliku, zanim odrzuci; kolejność AV1 → VP9 → H.264 daje najmniejszy transfer tam, gdzie dekoder jest sprzętowy, i pewny fallback wszędzie.
- `disablePictureInPicture`/`disableRemotePlayback`: bez nich Safari pokazuje ikony PiP/AirPlay na dekoracji; `aria-hidden` + `tabIndex=-1`: czytnik i Tab nie zatrzymują się na dekoracji (WIG).
- Bez przycisku pauzy pętla 6–10 s obok treści łamie WCAG 2.2.2 (Pause, Stop, Hide): jedyny wyjątek normy to ruch „essential", a dekoracyjne tło nim nie jest. `aria-hidden` + `tabIndex={-1}` chronią czytnik i Tab, ale nie osobę z zaburzeniami uwagi/przedsionkowymi, która nie ustawiła `prefers-reduced-motion`. Plan (`strona-v2-plan.md:384`) wymaga tego przycisku wprost, więc bez niego audytor przepuściłby build niezgodny z planem, a zgodny przycisk zgłosiłby jako naruszenie „zero kontrolek".
- Bez `MediaBoundary` wyjątek w obsłudze mediów (np. `play()` na odmontowanym elemencie) zdejmuje całe drzewo Reacta (historia `BgBoundary`, 2026-07-23: „#root pusty").

#### Niepoprawnie

```tsx
<video autoPlay loop src="/media/hero.mp4" className="absolute inset-0" />                  // brak muted/playsInline/poster/type/wersji; autoPlay bez bramek
<video muted loop playsInline preload="auto" controls poster="/media/hero.jpg">…</video>    // preload auto, controls, poster JPG > 60 KB
```

#### Poprawnie

```tsx
// src/components/HeroMedia.tsx (render; logika w media-video-gating)
import { HERO_POSTER, HERO_SOURCES } from "@/data/media";   // media-headers-versioning (zero literalow sciezek)
const TOGGLE = {
  pause: { pl: "Zatrzymaj podgląd", en: "Pause preview" },
  play:  { pl: "Odtwórz podgląd",   en: "Play preview" },
} as const;

return (
  <>
    <div className="hero-media" aria-hidden="true">
      <img className="hero-shot" src={HERO_POSTER} alt="Pulpit produkcji: kafle hal i suwak tygodnia, dane przykładowe"
           width={1600} height={1000} fetchPriority="high" decoding="async" />
      {enabled ? (
        <video ref={ref} muted playsInline preload="metadata" poster={HERO_POSTER}
               disablePictureInPicture disableRemotePlayback tabIndex={-1} width={1600} height={1000}
               onCanPlay={onCanPlay} onSuspend={onSuspend} onError={() => setEnabled(false)}
               style={{ opacity: ready ? 1 : 0, transition: "opacity var(--duration-media) var(--ease-out)" }}>
          {HERO_SOURCES.map((s) => <source key={s.src} src={s.src} type={s.type} />)}
        </video>
      ) : null}
    </div>

    {/* WCAG 2.2.2: POZA aria-hidden; stan w sessionStorage (media-video-gating p.7) */}
    {enabled ? (
      <button type="button" className="btn btn-secondary btn-sm hero-media-toggle"
              aria-pressed={paused} onClick={togglePaused}>
        {pick(lang, paused ? TOGGLE.play : TOGGLE.pause)}
      </button>
    ) : null}
  </>
);
```

```css
/* globals.css: przycisk w kontenerze .hero (position: relative), zawsze widoczny, AA na scrimie */
.hero-media-toggle { position: absolute; right: 16px; bottom: 16px; min-height: 44px; }   /* bez z-index: stoi po .hero-media w DOM, więc maluje się wyżej (media-video-placement) */
.hero-media-toggle::before { content: ""; position: absolute; top: -6px; right: -6px; bottom: -6px; left: -6px; }  /* pole klikalne ≥ 44×44 */
@media (prefers-reduced-motion: reduce) { .hero-media-toggle { display: none; } }   /* wideo i tak nie powstaje */
```

```tsx
// App.tsx
<MediaBoundary fallback={<img className="hero-shot" src={HERO_POSTER} alt="…" width={1600} height={1000} />}><HeroMedia /></MediaBoundary>
```

#### Test

Atrybuty sprawdzamy NA ELEMENCIE, nie na linii: JSX jest wieloliniowy, a `onError={() => …}` zawiera `>`,
więc `grep '<video[^>]*controls'` i tak by nie zadziałał, a samo `grep controls` trafia w `const controls = animate(...)`
(nazwa narzucona przez `motion-cleanup-required`). Parser poniżej zamyka element na pierwszym `>` poza `{…}`.

```bash
# statycznie: komplet atrybutow na kazdym <video> (oczekiwane: "video-attrs OK")
node -e '
const fs = require("node:fs"), path = require("node:path");
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
const els = (src, tag) => { const out = [], re = new RegExp("<" + tag + "\\b", "g"); let m;
  while ((m = re.exec(src))) { let i = re.lastIndex, d = 0;
    for (; i < src.length; i++) { const c = src[i]; if (c === "{") d++; else if (c === "}") d--; else if (c === ">" && d === 0) break; }
    out.push(src.slice(m.index, i + 1)); }
  return out; };
const REQ = ["\\bmuted\\b", "\\bplaysInline\\b", "preload=\"(metadata|none)\"", "poster=", "disablePictureInPicture", "disableRemotePlayback", "tabIndex=\\{-1\\}", "width=", "height="];
// `loop` sprawdzamy warunkowo: WYMAGANY w ToolWall.tsx (klipy hover), ZAKAZANY w HeroMedia.tsx (jedno odtworzenie)
const BAD = ["\\bautoPlay\\b", "\\bcontrols\\b(?=[\\s/>=])", "preload=\"auto\"", "\\bsrc="];
let bad = 0;
for (const f of walk("site/src").filter((x) => x.endsWith(".tsx"))) {
  const src = fs.readFileSync(f, "utf8");
  for (const el of els(src, "video")) {
    for (const a of REQ) if (!new RegExp(a).test(el)) { console.log(f + ": BRAK " + a); bad++; }
    for (const a of BAD) if (new RegExp(a).test(el)) { console.log(f + ": ZAKAZANY " + a); bad++; }
    const hero = /HeroMedia\.tsx$/.test(f.replace(/\\/g, "/"));
    if (hero && /\bloop\b/.test(el)) { console.log(f + ": ZAKAZANY loop (hero gra raz)"); bad++; }
    if (!hero && !/\bloop\b/.test(el)) { console.log(f + ": BRAK loop (klip hover jest pętlą)"); bad++; }
  }
}
console.log(bad === 0 ? "video-attrs OK" : "video-attrs: " + bad + " naruszen");'
# zrodla, boundary i kontrola pauzy
F=site/src/components/HeroMedia.tsx
grep -cE 'pointer-events:\s*none' site/src/components/ToolWall.tsx site/src/styles/globals.css   # ≥ 1 (klip nie przechwytuje kliknięcia)
grep -cE '<source[^>]*type=.video/webm; codecs="vp9"' $F       # ≥ 1
grep -cE '<source[^>]*type=.video/mp4; codecs="avc1' $F         # ≥ 1
grep -cE 'MediaBoundary' site/src/App.tsx                       # ≥ 1
grep -cE 'hero-media-toggle' $F                                 # = 1 (WCAG 2.2.2)
grep -cE 'aria-pressed' $F                                      # = 1
grep -cE 'klarow:media:paused' $F                               # = 1 (sessionStorage, plan:384)
grep -nE 'hero-media-toggle[^>]*aria-hidden|aria-hidden[^>]*hero-media-toggle' $F   # = 0 (przycisk POZA aria-hidden)
# plik: brak ścieżki audio (wymaga ffprobe ze scratchpadu)
ffprobe -v error -select_streams a -show_entries stream=codec_type -of csv=p=0 site/public/media/hero-production-v1.mp4 | wc -l   # = 0
# CSS pas bezpieczeństwa
grep -nE 'prefers-reduced-motion[^}]*\.hero-media video[^}]*display:\s*none' -z site/src/styles/globals.css | wc -c   # > 0
```

Docelowo `node scripts/check-motion.mjs` sekcja `video-attrs`.

#### Wyjątki

- Klipy hover (v1, `ToolWall`): `preload="none"`, bez `poster` w atrybucie (poster to `<img>` kafla), `loop` **wymagany**, `muted playsInline` tak; wymiary 960×600; `pointer-events: none`. Nie wymagają własnego przycisku pauzy (ruch startuje wyłącznie po `mouseenter`/`focus`, więc nie jest automatyczny w rozumieniu WCAG 2.2.2), ale honorują globalny stan `klarow:media:paused`.
- Nagranie hero (`HeroMedia`): `loop` **zakazany** (jedno odtworzenie, stop na ostatniej klatce). Przycisk pauzy jest mimo to wymagany: ruch trwa 8 s, czyli powyżej progu 5 s z WCAG 2.2.2.

### 4.10 media-poster-first-frame

**Poster to klatka 0 pliku wideo (przy pętli także identyczna z ostatnią), wyciągana z gotowego wideo, ten sam plik w <img>, <video poster> i preload**

Impact: **MEDIUM** · Tagi: media, video, poster, lcp, loop · Źródło: higgsfield §7 wskazówka (2) · synthesis §2.4.4 (POSTER = pierwsza klatka) · showreel §5.4 · media-asset-review-gate p.8–9 · Dodano: 2026-09-12 · Plik: `rules/media-poster-first-frame.md`

#### Zasada

Dwa przypadki, jedna zasada („poster = klatka 0 gotowego pliku wideo"):

1. **Jedno odtworzenie (v1, hero: nagranie narzędzia).** Poster = klatka 0, plik kończy się na ostatniej klatce i tam zostaje. Klatka N−1 **nie musi** być równa klatce 0; wymóg PSNR dotyczy wyłącznie pary poster/klatka 0.
2. **Pętla (klipy hover ściany, ewentualna pętla generatywna w wariancie D37(b)).** Dodatkowo klatka 0 ≈ klatka N−1 (PSNR ≥ 45 dB), inaczej spaw widać co obrót.

- Poster hero (`hero-production-v<N>.webp`) jest **wyciągany z gotowego pliku wideo** (`ffmpeg -frames:v 1` bez `-ss`), **nigdy nie jest robiony osobnym screenshotem** i nigdy nie pochodzi z master stilla generatora. Powód jest mechaniczny: dwa różne przebiegi renderowania (screenshot Playwright 2× i nagranie 1× po VP9) dają inny antyaliasing i inny kolor, więc crossfade pokazuje przeskok. Ten sam plik jest **kadrem produktu i elementem LCP** (`perf-lcp-poster-preload`).
- Ten sam plik postera jest użyty w trzech miejscach: `<img>` LCP w `HeroMedia` i w shellu prerenderu, atrybut `poster` na `<video>`, `<link rel="preload" as="image">` w `index.html`. Jedna stała `HERO_POSTER` (`media-headers-versioning`). **Osobnego „postera pętli" w v1 nie ma**; gdyby wrócił wariant D37(b), poster pętli jest odrębnym plikiem, który **nigdy nie jest preloadowany** i nie stoi w shellu (inaczej staje się kandydatem LCP).
- Poster klipu hover = zrzut tego samego narzędzia w rozmiarze kafla (`tools/<slug>-v<N>-1280.webp` skalowany do 480×300); klip musi zaczynać się dokładnie od tego stanu (PSNR ≥ 45 dB po przeskalowaniu obu do 960×600: nagranie powstaje w skali 1×, zrzut w 2×).
- Crossfade `poster → video` (600 ms) startuje po `canplay`; pierwsza klatka wideo == poster, więc przejście jest niewidoczne; `<img>` zostaje pod wideo (fallback przy pauzie, awarii i po zakończeniu nagrania).

#### Mechanizm awarii (dlaczego)

- Poster inny niż klatka 0 = widoczny „przeskok" w chwili startu wideo (zmiana światła/kadru), który użytkownik czyta jako błąd ładowania; przy pauzie poza viewportem i powrocie wideo wznawia od bieżącej klatki, ale przy awarii (`setEnabled(false)`) wraca poster: kolejny przeskok.
- Poster z generatora obrazów (PNG 4k) różni się od klatki 0 po `noise`/`crop`/`crf`: inna ziarnistość i kolor po enkodowaniu.
- Trzy różne pliki postera (preload jeden, `<img>` drugi) = zmarnowany preload i podwójny transfer na ścieżce LCP.

#### Niepoprawnie

```powershell
ffmpeg -y -ss 00:00:04.200 -i hero_master.mp4 -frames:v 1 hero-v1.poster.webp     # klatka ze środka
```

```js
// shoot-tools.mjs robi osobny screenshot hero, a record-demos.mjs osobne nagranie:
// dwa przebiegi renderowania = inny antyaliasing = widoczny przeskok przy crossfade
await page.locator("[data-dashboard]").screenshot({ path: "public/media/hero-production-v1.webp" });
```

```tsx
<img src="/media/master-still-v1.webp" />            // inny plik niż poster wideo
<video poster="/media/hero-v1.poster.webp">            // a preload w index.html wskazuje hero-v1.png
```

#### Poprawnie

```powershell
ffmpeg -y -i hero-production-v1.webm -frames:v 1 -c:v libwebp -quality 80 hero-production-v1.webp   # klatka 0 gotowego pliku = kadr produktu = LCP
```

```tsx
import { HERO_POSTER, HERO_SOURCES } from "@/data/media";
<img className="hero-shot" src={HERO_POSTER} alt="Pulpit produkcji: kafle hal i suwak tygodnia, dane przykładowe"
     width={1600} height={1000} fetchPriority="high" decoding="async" />
<video … poster={HERO_POSTER}>{HERO_SOURCES.map(…)}</video>   {/* bez `loop`: nagranie hero gra raz */}
```

```html
<!-- index.html (prerender.mjs wstawia w każdy z 19 HTML tę samą stałą) -->
<link rel="preload" as="image" href="/media/hero-production-v1.webp" fetchpriority="high">
```

#### Test

```bash
# klatka 0 vs poster (scratchpad)
ffmpeg -y -i site/public/media/hero-production-v1.webm -vf "select=eq(n\,0)" -frames:v 1 f0.png
ffmpeg -i f0.png -i site/public/media/hero-production-v1.webp -lavfi psnr -f null - 2>&1 | grep -oE 'average:[0-9.]+'   # ≥ 45
# klatka 0 vs ostatnia: TYLKO dla plików zapętlonych (klipy hover, ewentualna pętla D37(b)).
# Dla nagrania hero (jedno odtworzenie, bez `loop`) ten test NIE obowiązuje.
ffmpeg -y -sseof -0.05 -i site/public/media/tools/kontroling-kosztow-v1.webm -frames:v 1 fl.png
ffmpeg -i f0.png -i fl.png -lavfi psnr -f null - 2>&1 | grep -oE 'average:[0-9.]+'   # ≥ 45
# jeden plik postera w trzech miejscach
P=$(grep -oE '/media/hero-production-v[0-9]+\.webp' site/index.html | head -1)
grep -c "$P" site/src/data/media.ts site/dist/index.html     # ≥ 1 każdy; poster w dist/index.html występuje w <link rel=preload> i w <img>
# UWAGA: w buildzie Vite/React atrybuty JSX kompilują się do WŁAŚCIWOŚCI OBIEKTU (`poster:"…"`, `"aria-label":u.close`),
# nie do składni `attr="wartość"` — `grep 'poster="…"' dist/assets/*.js` zawsze da 0 (fałszywy FAIL albo fałszywe „przechodzi").
grep -ohE 'poster:"[^"]+"' site/dist/assets/*.js | sort -u | wc -l   # = 1 (po buildzie jedna wartość)
grep -c "$P" site/dist/assets/*.js | awk -F: '$2 > 0 {n++} END {print n " chunk(ów) z posterem"}'   # ≥ 1
# pewniejsze (Playwright/WebKit ze scratchpadu, po `vite preview`):
#   document.querySelector("video").poster === new URL(document.querySelector(".hero-media img").src).pathname
#   && document.querySelector('link[rel=preload][as=image]').href.endsWith(poster)
```

#### Wyjątki

- Klipy hover (v1): poster = zrzut dashboardu (`tools/<slug>-v1-1280.webp`), a klip startuje z tej samej klatki (nagranie `record-demos.mjs` zaczyna od stanu po „Załaduj przykład", identycznego ze zrzutem). PSNR liczony po przeskalowaniu obu do 960×600.

## 5. Budżety wydajności (LCP/CLS/INP, chunki, fonty, transfer, lazy, build target) (`perf`)

Domyślny impact: **HIGH** · tryb: both · właściciel audytu: `code-auditor`

### 5.1 perf-no-webgl-on-coarse

**Na pointer: coarse (telefony, tablety) zero canvasu WebGL, zero wideo autoplay, zero elementów fixed poza navem; tło = statyczny gradient .bg-layer**

Impact: **BLOCKER** · Tagi: perf, mobile, ios, webgl, video · Źródło: CLAUDE.md „Stan operacyjny" 2026-07-24 (naprawa u źródła: canvas tylko desktop) i 2026-07-26 · site-audit §1.7 · synthesis §2.4.8 tabela degradacji/§2.4.9 fallback mobile · higgsfield §4.5 p.5 · feasibility-perf §9 p.7 · Dodano: 2026-09-12 · Plik: `rules/perf-no-webgl-on-coarse.md`

#### Zasada

Na urządzeniach z `matchMedia("(pointer: coarse)").matches === true` (iPhone, iPad, Android; także laptopy z dotykiem, gdy główne urządzenie wskazujące jest dotykowe):

1. Nie montuje się żaden `<canvas>` (WebGL ani 2D) poza ewentualnymi statycznymi SVG (`KsefFlow`, mini-wykresy) i wykresami dashboardów (SVG, nie canvas).
2. Nie montuje się **żaden `<video>`**: ani autoodtwarzane nagranie hero, ani klipy hover ściany (na dotyku hover nie istnieje, a tap ma otwierać podstronę). Hero = kadr produktu `<img>` (`media-video-gating`). Bramka jest **liczbą bajtów, nie tylko liczbą elementów**: transfer do `/media/*.webm|mp4` na `pointer: coarse` = **0 B** (0 requestów).
3. Tło = `.bg-layer` ze statycznym gradientem stalowym (`globals.css:13-38`), bez żadnych dzieci.
4. Elementy `position: fixed`: tylko `Navbar` (i natywny `<dialog>`); nic nowego.
5. Reveale (`whileInView`, fadeUp 12 px), liczniki, `PageFade`, menu mobilne w `AnimatePresence` zostają (tanie, na kompozytorze).
6. Decyzja jest podejmowana raz, przez `matchMedia` w `useEffect` (SSR/prerender = `false`), nie przez User-Agent i nie przez szerokość okna (iPad w landscape ma 1024+ px, ale jest `coarse`).

Powrót animowanego tła na mobile (np. wzgórza z promocją warstw `translateZ(0)`) jest dopuszczalny WYŁĄCZNIE po potwierdzeniu na realnym iPhonie Karola (iOS 26) i po wpisie decyzji w CLAUDE.md „Stan operacyjny"; do tego czasu niezawodność > ozdoba.

#### Mechanizm awarii (dlaczego)

- 2026-07-24: na iOS Safari kompozytor GPU komponował pełnoekranowy `fixed` canvas WebGL NAD rodzeństwem `fixed` (nav, deck, stopka): cała treść znikała mimo poprawnego z-index; software WebKit (Playwright na Windows) tego nie odtwarza, więc każda „weryfikacja Playwrightem" przechodziła, a telefon Karola pokazywał czarny ekran. Naprawa u źródła: brak canvasu na coarse.
- 2026-07-26 (przyczyna właściwa potwierdzona zrzutem `?debug=1`): `content-layer` z `z-index` uwięził `fixed` pod `overflow:hidden`. Oba incydenty mają wspólny mianownik: dodatkowe warstwy kompozycji na iOS = ryzyko nieodtwarzalne lokalnie. BLOCKER, bo to jedyna klasa błędu, która wyłączyła całą stronę u głównego kanału (LinkedIn → telefon).
- Dekoder wideo/GPU na telefonie = bateria, Low Power Mode blokuje autoplay i pokazuje przycisk play nad dekoracją; 1,5 MB na 4G to koszt bez zysku dla persony, która i tak nie klika w tło.
- Detekcja po szerokości pomija tablety i laptopy dotykowe; po UA jest krucha (iPadOS udaje macOS).

#### Niepoprawnie

```tsx
const isMobile = window.innerWidth < 768;                       // iPad landscape = "desktop" → canvas na iOS
const ua = /iPhone|Android/.test(navigator.userAgent);          // iPadOS = "Macintosh"
{!isMobile ? <GLSLHills /> : null}
<video autoPlay muted playsInline loop className="fixed inset-0" />   // fixed w treści, autoplay na coarse
```

#### Poprawnie

```tsx
// src/hooks/useCoarsePointer.ts
export function useCoarsePointer(): boolean {
  const [coarse, setCoarse] = useState(false);       // SSR/prerender: false; decyzja w efekcie
  useEffect(() => {
    const mq = matchMedia("(pointer: coarse)");
    const update = () => setCoarse(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return coarse;
}
// użycie: HeroMedia (wantsVideo sprawdza "(pointer: fine)"), plan B tła (useIdleDesktopBg sprawdza "(pointer: fine)")
```

```css
/* globals.css: tło mobile = to, co jest */
.bg-layer { position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: -1; pointer-events: none; background: radial-gradient(120% 85% at 50% 100%, rgba(168,180,194,.14) 0%, rgba(168,180,194,.05) 45%, rgba(18,18,18,0) 75%), #121212; isolation: isolate; }
```

#### Test

```bash
# detekcja wyłącznie przez matchMedia pointer (oczekiwane: 0 dla UA/szerokości w kontekście mediów)
grep -rnE 'userAgent|innerWidth\s*<|matchMedia\("\(max-width' site/src --include=*.tsx --include=*.ts | grep -iE 'video|canvas|bg|hills|media'   # = 0
grep -rnE '\(pointer: (fine|coarse)\)' site/src | wc -l      # ≥ 1 (HeroMedia; App.tsx w planie B)
# runtime: Playwright WebKit iPhone 390×844 (hasTouch: true, isMobile: true) na dist przez vite preview, każda z 19 tras:
#   document.querySelector("canvas") === null; [...document.querySelectorAll("video")].filter(v => !v.paused).length === 0;
#   [...document.querySelectorAll("*")].filter(e => getComputedStyle(e).position === "fixed").map(e => e.className) ⊆ {navbar, bg-layer}
#   document.elementFromPoint(195, 422) należy do treści (nie do .bg-layer, nie do canvas)
# realny iPhone Karola po każdej zmianie w hero/tle/globals.css: pełna treść; zrzut ?debug=1 w razie wątpliwości.
```

Docelowo `scripts/verify-site.mjs` krok `coarse` (WebKit ze scratchpadu; pakiet `playwright-core` + `executablePath` do `~/AppData/Local/ms-playwright/webkit-*`, bo scratchpad nie ma `&` w ścieżce).

#### Wyjątki

- Wykresy dashboardów są SVG; jeśli kiedyś dashboard potrzebowałby `<canvas>` 2D (np. heatmapa 10 k komórek), to tylko w trybie `tool`, bez `fixed`, z `IntersectionObserver` pauzą i osobną decyzją; na stronie marketingowej nadal 0.

### 5.2 perf-build-target

**Kod zgodny z build.target es2019/safari13: bez toSorted/at/structuredClone/Array.findLast/Object.hasOwn/oklch/color-mix bez fallbacku; komentarz w vite.config prawdziwy**

Impact: **HIGH** · Tagi: perf, compat, safari, build, vite · Źródło: synthesis §2.7.1 (D-19: target zostaje) · CLAUDE.md 2026-07-22 cz. 6 i 2026-07-24 (uwaga: cssTarget NIE transpiluje @property/oklch) · site-audit §3.5 (nieaktualny komentarz vite.config.ts:16-23) · vite.config.ts · Dodano: 2026-09-12 · Plik: `rules/perf-build-target.md`

#### Zasada

`site/vite.config.ts` ma `build.target: ["es2019", "safari13"]` i `cssTarget: ["safari13"]` i tak zostaje w fazie 1 (D-19). Konsekwencje dla kodu:

1. **JS**: esbuild transpiluje SKŁADNIĘ (optional chaining, `??`, klasy prywatne), ale NIE dodaje polyfilli API. Zakazane bez własnego fallbacku: `Array.prototype.toSorted/toReversed/with/at/findLast/findLastIndex`, `Object.hasOwn`, `structuredClone`, `Array.prototype.flat` jest OK (ES2019), `String.prototype.replaceAll` (ES2021: zakaz), `Promise.any`/`AggregateError` (ES2021), `WeakRef`, `Intl.Segmenter`, `Array.fromAsync`, `URL.canParse`, `requestIdleCallback` bez fallbacku (`setTimeout`), `ResizeObserver` bez guardu (Safari dopiero **13.1**, marzec 2020: na iOS 13.0–13.3 `ReferenceError`); `IntersectionObserver` jest OK (Safari 12.1), WAAPI wymaga Safari 13.1+, `matchMedia().addEventListener("change")` wymaga fallbacku `addListener` dla Safari < 14 (albo akceptujemy brak reakcji na zmianę w locie na Safari 13: dopuszczalne, decyzja w kodzie z komentarzem).
2. **CSS**: minifikacja idzie przez esbuild (NIE Lightning CSS mimo komentarza `vite.config.ts:16-23`; ten komentarz jest nieprawdziwy i ma zostać poprawiony), więc `@property`, `@layer`, `color-mix()`, `oklch()`, `backdrop-filter`, `inset`, `:has()`, `dvh` ZOSTAJĄ w zbudowanym CSS. Reguła: każda z tych konstrukcji w `globals.css`/`tokens.css` ma fallback deklarowany PRZED nią (np. `min-height: 100vh; min-height: 100dvh;`, `top/right/bottom/left` zamiast samego `inset`, `rgba()` obok `color-mix()`), a szkielet strony (`.bg-layer`, `.content-layer`, kontener, siatka) nie używa żadnej z nich. Tailwind v4 (`@theme inline`) tylko do layoutu; `bg-x/12` (color-mix w Tailwind v4) zakazane w klasach: kolory z tokenów `rgba`.
3. **Podłoga nominalna vs realna**: `build.target` mówi `safari13`, ale dwie rzeczy z listy (WAAPI = silnik Motion, `ResizeObserver`) wchodzą dopiero w Safari **13.1**. Dopóki nie podnosimy targetu, każda z nich wymaga własnego guardu/fallbacku:
   - `ResizeObserver`: `typeof ResizeObserver === "function"` → obserwator; inaczej `window.addEventListener("resize", …)` + `clientWidth` (dotyczy m.in. Gantta `TaskTimeline`, jeśli wróci pomiar szerokości; dziś `site/src` nie używa RO — jest tylko wzmianka w komentarzu `company-ui.css:927`),
   - WAAPI/Motion: animacje degradują się same (Motion ma fallback JS), ale nie polegać na `element.animate` bez sprawdzenia.
   Alternatywa (decyzja): podnieść i OPISAĆ podłogę jako `safari13.1` — wtedy oba punkty znikają, a `target` w `vite.config.ts` i ten akapit zmieniają się w jednym commicie.
4. **`build.target` nie może być podnoszony „bo coś nie działa"**; podniesienie = decyzja w `docs/plan/` z analizą udziału Safari < 16.4 w CF Web Analytics (po ≥ 4 tygodniach danych).
5. Komentarze o toolchainie w `vite.config.ts` opisują stan faktyczny (esbuild minifier; Lightning CSS tylko przy `css.transformer: "lightningcss"`, którego NIE włączamy w fazie 1).

#### Mechanizm awarii (dlaczego)

- Lipiec 2026: „samo tło na telefonie" miał kilka warstw; jedna z hipotez (stary WebKit + `inset`/`oklch`) doprowadziła do `safari13`, a szkielet strony przepisano na czysty CSS z longhandami. Nawet jeśli iOS Karola (26) wspiera wszystko, persona ma telefony służbowe 3–5-letnie (iOS 15–16): `toSorted` (Safari 16) czy `structuredClone` (15.4) rzucają `TypeError` i React zdejmuje całe drzewo.
- Sesja 2026-07-24 potwierdziła: `cssTarget: ["safari13"]` NIE transpiluje `@property` (57×), `@layer`, `color-mix`; założenie z sesji cz. 6, że „Lightning CSS to załatwia", było błędne. Komentarz w configu wprowadza w błąd następne okno.
- Bez polyfilli `requestIdleCallback` (Safari nie ma do dziś) `DashboardMount` bez fallbacku nigdy nie montuje dashboardu na iPhonie.
- `ResizeObserver` bez guardu na iOS 13.0–13.3 rzuca `ReferenceError` w trakcie renderu komponentu → React zdejmuje całe drzewo → dokładnie scenariusz „samo tło", przed którym broni reszta reguł. To ten sam mechanizm co awaria tła z 2026-07-23 (brak error boundary = pusty `#root`).

#### Niepoprawnie

```ts
const sorted = rows.toSorted((a, b) => a.deviation - b.deviation);      // Safari < 16
const last = rows.at(-1);                                                // Safari < 15.4
const copy = structuredClone(state);                                     // Safari < 15.4
const id = requestIdleCallback(mount);                                   // Safari: ReferenceError
const ro = new ResizeObserver(onResize); ro.observe(el);                 // Safari < 13.1: ReferenceError → białe drzewo
```

```css
.hero-media { inset: 0; background: color-mix(in oklch, var(--accent) 12%, transparent); }   /* bez fallbacku */
```

#### Poprawnie

```ts
const sorted = [...rows].sort((a, b) => a.deviation - b.deviation);
const last = rows[rows.length - 1];
const copy = JSON.parse(JSON.stringify(state)) as State;   // albo jawna kopia pól
const idle = (cb: () => void, timeout = 1500) => typeof requestIdleCallback === "function" ? requestIdleCallback(cb, { timeout }) : window.setTimeout(cb, 16);

// ResizeObserver (Safari 13.1+): guard + fallback na window.resize
function observeWidth(el: HTMLElement, cb: (w: number) => void): () => void {
  if (typeof ResizeObserver === "function") { const ro = new ResizeObserver(() => cb(el.clientWidth)); ro.observe(el); return () => ro.disconnect(); }
  const onResize = () => cb(el.clientWidth);
  window.addEventListener("resize", onResize);
  onResize();
  return () => window.removeEventListener("resize", onResize);
}
```

```css
.hero-media { position: absolute; top: 0; right: 0; bottom: 0; left: 0; background: rgba(168, 180, 194, .12); }
.content-layer { min-height: 100vh; min-height: 100dvh; }
```

```ts
// vite.config.ts (komentarz zgodny ze stanem faktycznym)
/* target es2019/safari13: esbuild transpiluje składnię JS, NIE dodaje polyfilli API (własne fallbacki w kodzie);
   CSS minifikuje esbuild (Lightning CSS NIE jest włączony), więc @property/@layer/color-mix/oklch zostają w dist:
   każda taka konstrukcja wymaga fallbacku w źródle; szkielet strony na czystym CSS z longhandami. */
```

#### Test

```bash
# API spoza es2019/safari13 (oczekiwane: 0)
grep -rnE '\.(toSorted|toReversed|findLast|findLastIndex|at)\(|Object\.hasOwn\(|structuredClone\(|replaceAll\(|Promise\.any\(|WeakRef|Intl\.Segmenter|Array\.fromAsync|URL\.canParse' site/src --include=*.ts --include=*.tsx
grep -rnE 'requestIdleCallback\(' site/src | grep -vE 'typeof requestIdleCallback' # = 0 (każde użycie za guardem)
grep -rlE 'new ResizeObserver\(' site/src | while read -r f; do grep -q 'typeof ResizeObserver' "$f" || echo "ResizeObserver bez guardu: $f"; done   # = 0
# CSS bez fallbacku w plikach strony (oczekiwane: 0 poza company-ui.css do przycięcia)
grep -nE '^\s*inset:' site/src/styles/globals.css site/src/styles/tokens.css 2>/dev/null
grep -nE 'color-mix\(|oklch\(' site/src/styles/globals.css site/src/styles/tokens.css 2>/dev/null
grep -rnE 'className="[^"]*\b(bg|text|border)-[a-z]+(-[0-9]+)?/[0-9]+' site/src --include=*.tsx   # Tailwind alpha = color-mix
# dvh z fallbackiem vh bezpośrednio przed
grep -nB1 '100dvh' site/src/styles/globals.css | grep -c '100vh'   # ≥ 1
# config
grep -nE 'target: \["es2019", "safari13"\]' site/vite.config.ts | wc -l   # = 1
grep -nE 'Lightning CSS transpiluje' site/vite.config.ts                   # = 0 (komentarz poprawiony)
# build: dist/assets/*.js bez `?.` / `??` (esbuild je transpiluje) i bez zakazanych API
grep -lE '\.toSorted\(|structuredClone\(' site/dist/assets/*.js   # = 0
```

Docelowo ESLint `no-restricted-syntax`/`no-restricted-properties` z listą powyżej w `eslint.config.js` (faza 0) + `scripts/verify-site.mjs` krok `compat` (grep na `dist/assets`).

#### Wyjątki

- `matchMedia(...).addEventListener("change")` bez `addListener`-fallbacku: dopuszczalne (na Safari 13 zmiana w locie nie działa, stan początkowy tak), z komentarzem `// perf-build-target: brak reakcji na zmianę w locie na Safari < 14 (akceptowane)`.
- `pdfmake` i `three` (chunki lazy) mają własne wymagania; nie audytujemy ich kodu, tylko to, że są lazy i pod boundary.

### 5.3 perf-chunk-size-gate

**verify-site.mjs porównuje rozmiary chunków z baseline: wzrost > 5 % lub nowy chunk krytyczny = fail; baseline zmienia tylko świadomy commit**

Impact: **HIGH** · Tagi: perf, bundle, gate, ci, regression · Źródło: synthesis §2.4.9 („bramki mechaniczne w verify-site.mjs")/§2.7.1 (`npm run check`) · motion-dev §5.3 (regresja bundla) · feasibility-perf §9 p.5/p.7 · vercel-optimize (bramki deterministyczne) · Dodano: 2026-09-12 · Plik: `rules/perf-chunk-size-gate.md`

#### Zasada

`site/scripts/verify-site.mjs` (uruchamiany przez `npm run check` = `tsc --noEmit` → `vite build` → prerender → verify → audit; bez `npx`) ma krok `chunks`:

1. Czyta `dist/index.html`, `dist/narzedzia.html`, `dist/oferta.html`, `dist/faq.html`, `dist/rodo.html`, `dist/404.html` i 13 × `dist/narzedzia/<slug>.html`; dla każdego zbiera chunki statyczne (`<script type="module" src>`, `<link rel="modulepreload">`) i CSS.
2. Liczy gzip każdego pliku w `dist/assets` (`zlib.gzipSync`) i grupuje: `homeGz` (krytyczne z `index.html`), `cssGz`, `motionGz` (chunki z sygnaturą Motion), `toolGz[slug]` (chunki dociągane per podstrona = `modulepreload` z `narzedzia/<slug>.html` minus wspólne), `lazy[nazwa]` (pdfmake, three, dashboardy, BookingDialog).
3. Porównuje z `site/scripts/verify-site.baseline.json` (plik powstaje przez `verify-site.mjs --write-baseline` po pierwszym zielonym buildzie v2; przed nim obowiązują budżety domyślne, a `verify-site.mjs` mówi o braku baseline'u na stderr):
   ```json
   { "homeGz": 138000, "cssGz": 19000, "motionGz": 33800, "toolGzMax": 58000, "lazy": { "pdfmake": 830000, "three": 118000 }, "updated": "2026-09-xx", "reason": "faza 0: lazy dashboardy" }
   ```
   Reguły: każda grupa ≤ twardy limit (`homeGz` 140 KB, `cssGz` 20 KB, `motionGz` 35 KB, `toolGzMax` 60 KB) ORAZ ≤ baseline × 1,05; nowy chunk w zbiorze krytycznym, którego nie było w baseline = fail; chunk lazy, który przeszedł do krytycznych = fail.
4. Wynik w formacie findings: `dist/index.html:0 - HIGH [perf-chunk-size-gate] homeGz 146 812 B > baseline 138 000 × 1,05 (chunk nowy: assets/ToolPage-xxxx.js)` + JSONL.
5. Baseline aktualizuje TYLKO commit z komunikatem zaczynającym się od `Perf: nowy baseline` z polem `reason`; agent audytu odrzuca PR, w którym `baseline.json` zmienia się w innym commicie.
6. Vite: `build.rollupOptions.output.manualChunks` tylko dla `react-dom`/`react-router` (stabilne cache) i `motion` (osobny chunk = mierzalny); zero `chunkSizeWarningLimit` podbijanego „żeby nie ostrzegało".

#### Mechanizm awarii (dlaczego)

- Regresje bundla są ciche: `tsc` i `vite build` zielone, strona działa, a 14 KB (`domMax`) albo 118 KB (three w krytycznych) płaci każdy użytkownik. Bez liczbowej bramki nikt tego nie zobaczy do czasu spadku Lighthouse po tygodniach.
- Porównanie z baseline (nie tylko z limitem) łapie pełzanie: 5 × „+3 KB" mieści się w limicie, a po kwartale strona ma +15 KB bez decyzji.
- CF Pages buduje z innymi hashami niż lokalnie (pamięć projektu: „weryfikuj po treści, nie hashach"); dlatego bramka działa na treści chunków (sygnatury) i sumach gz, nie na nazwach plików.
- Bramka w `npm run check` przed pushem (CLAUDE.md #4 + rozszerzenie code-check-gate) = jedyne miejsce, gdzie regresja zatrzymuje się przed produkcją.

#### Niepoprawnie

```js
// vite.config.ts
build: { chunkSizeWarningLimit: 2000 }          // wyciszenie ostrzeżeń zamiast bramki
// package.json
"check": "tsc --noEmit && vite build"           // brak verify; npx-owe binarki
// baseline podbity w commicie „drobne poprawki UI"
```

#### Poprawnie

```js
// site/scripts/verify-site.mjs (fragment kroku chunks)
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { gzipSync } from "node:zlib";
const baseline = JSON.parse(readFileSync("scripts/verify-site.baseline.json", "utf8"));
const LIMITS = { homeGz: 140 * 1024, cssGz: 20 * 1024, motionGz: 35 * 1024, toolGzMax: 60 * 1024 };
const gz = (f) => gzipSync(readFileSync(`dist/${f}`)).length;
const statics = (html) => [...html.matchAll(/(?:src|href)="\/(assets\/[^"]+\.(?:js|css))"/g)].map((m) => m[1]);
const home = statics(readFileSync("dist/index.html", "utf8"));
const homeGz = home.filter((f) => f.endsWith(".js")).reduce((s, f) => s + gz(f), 0);
const cssGz = home.filter((f) => f.endsWith(".css")).reduce((s, f) => s + gz(f), 0);
const motionGz = home.filter((f) => f.endsWith(".js") && /LazyMotion|MotionConfigContext|framer-motion/.test(readFileSync(`dist/${f}`, "utf8"))).reduce((s, f) => s + gz(f), 0);
const findings = [];
const check = (key, val) => {
  if (val > LIMITS[key]) findings.push({ file: "dist/index.html", line: 0, severity: "HIGH", rule: "perf-chunk-size-gate", msg: `${key} ${val} B > limit ${LIMITS[key]}`, confidence: "CONFIRMED" });
  else if (val > baseline[key] * 1.05) findings.push({ file: "dist/index.html", line: 0, severity: "HIGH", rule: "perf-chunk-size-gate", msg: `${key} ${val} B > baseline ${baseline[key]} × 1,05`, confidence: "CONFIRMED" });
};
check("homeGz", homeGz); check("cssGz", cssGz); check("motionGz", motionGz);
for (const f of home) if (/pdfmake|WebGLRenderer|ProductionDashboard|G703Billing/.test(readFileSync(`dist/${f}`, "utf8"))) findings.push({ file: `dist/${f}`, line: 0, severity: "HIGH", rule: "perf-chunk-size-gate", msg: "lazy chunk w zbiorze krytycznym", confidence: "CONFIRMED" });
```

```json
// package.json (scripts)
"check": "node node_modules/typescript/bin/tsc --noEmit && npm run build && node ../.claude/skills/klarow-guardian/scripts/verify-site.mjs && node ../.claude/skills/klarow-guardian/scripts/audit-static.mjs --fail-on BLOCKER,HIGH --baseline ../.claude/skills/klarow-guardian/baseline/audit-static-2026-09-12.jsonl"
```

#### Test

```bash
cd site && npm run check                                   # exit 0; sekcja chunks w raporcie: „Σ BLOCKER 0 · HIGH 0 …"
# symulacja regresji: dodaj `import { motion } from "motion/react"` w dowolnym komponencie → npm run check musi zakończyć się fail z [motion-bundle-budget-motion] i [perf-chunk-size-gate]
# baseline tylko świadomie
git log --format=%s -- site/scripts/verify-site.baseline.json | grep -vE '^Perf: nowy baseline' && echo "baseline zmieniony poza commitem Perf:"
# vite.config bez wyciszania
grep -nE 'chunkSizeWarningLimit' site/vite.config.ts     # = 0
```

#### Wyjątki

- Pierwszy commit tworzący `baseline.json` (faza 0) używa komunikatu `Perf: nowy baseline (start v2)`.
- `dist-ssr` (prerender) nie podlega bramce rozmiaru, tylko `motion-no-motion-in-prerender`.

### 5.4 perf-code-split-dashboards

**Dashboardy przez React.lazy per klucz + DashboardMount (IntersectionObserver, requestIdleCallback, kolejka) + skeleton z minHeight**

Impact: **HIGH** · Tagi: perf, code-split, dashboards, cls, lazy · Źródło: synthesis §2.4.5/§1.5 R6 · site-audit §1.9/§3.1 p.1 · bklit-ui §10.5/§10.6 (usePauseWhenOffscreen, home-mount-queue) · showreel §5.10 · vercel RBP bundle-analyzable-paths · Dodano: 2026-09-12 · Plik: `rules/perf-code-split-dashboards.md`

#### Zasada

Jeden komponent `src/components/DashboardMount.tsx` osadza każdy z **12 dashboardów** — 11 komponentów w `src/components/dashboards/**` (`PdfButton.tsx` dashboardem nie jest) + `DemoReport.tsx`; tyle samo kluczy ma unia `DashboardKey` (`src/data/tools.ts:99-111`). **13 to liczba NARZĘDZI w `tools.ts`** (12 dem + KSeF `kind: "case"` bez dashboardu), nie liczba dashboardów. Kontrakt:

1. **`React.lazy`** z mapą `LOADERS: Record<DashboardKey, () => import("…literalna ścieżka…")>` (żadnych dynamicznych stringów w `import()`; Rollup musi widzieć każdy chunk).
2. **Montaż warunkowy widocznością**: natywny `IntersectionObserver` (`rootMargin: "0px 0px 20% 0px"`, `once`), bez zależności od Motion (`useInView` z Motion NIE jest używany tu: chunk narzędzia nie może zależeć od rdzenia Motion).
3. **Po bezczynności**: `requestIdleCallback(cb, { timeout: 1500 })` z fallbackiem `setTimeout(cb, 16)`; na stronach z > 1 dashboardem (mini-komponenty S2 + ewentualne embedy) kolejka szeregowa z odstępem 150 ms między ciężkimi montażami (wzorzec bklit `home-mount-queue`), z `cancel` w cleanupie.
4. **Skeleton**: `Suspense fallback={<div className="skel" style={{ minHeight }} aria-busy="true" />}`; `minHeight` per klucz z tabeli `DASHBOARD_MIN_HEIGHT` (zmierzone wysokości na 1280 px, np. `report: 720`, `timeline: 640`) → CLS ≈ 0 przy podmianie skeleton → dashboard.
5. **Boundary**: error boundary z komunikatem kitu „Demo nie wczytało się. Odśwież stronę." (PL/EN z `{ pl, en }`), bez stack trace.
6. **`data-ready`**: flagę ustawia komponent zamontowany **WEWNĄTRZ `Suspense`** (czyli po dociągnięciu chunku i podmianie skeletonu), NIGDY wrapper na podstawie stanu `mounted`. Wzorzec: `<Suspense fallback={skeleton}><Dash /><ReadyFlag host={ref} /></Suspense>`, gdzie `ReadyFlag` w `useEffect` ustawia `host.current.dataset.ready = "true"` i usuwa atrybut w cleanupie. `mounted === true` znaczy tylko „zaczynamy pobierać chunk"; `data-ready="true"` znaczy „dashboard jest w DOM". Te dwa momenty dzieli czas pobrania chunku, a `shoot-tools.mjs` czeka dokładnie na `[data-ready='true']` (`perf-images-policy` p.5).
7. `ToolPage` sam jest `lazy` w `App.tsx`; `Suspense` dla trasy siedzi WEWNĄTRZ `PageFade` (nie między routerem a stroną).

Zakazane: statyczne importy dashboardów w `ToolPage`/`App`, `import(\`@/components/dashboards/${key}\`)`, montaż wszystkich 12 na hubie, `Suspense` bez `minHeight`.

#### Mechanizm awarii (dlaczego)

- Dziś `index.js` niesie 12 dashboardów + `lib/report` + `lib/qualityGate` (~60–90 KB gz) na każdej trasie (site-audit §1.9). Lazy per klucz zdejmuje to z `/`, `/oferta`, `/faq`.
- Bez IO dashboard montuje się i liczy (`aggregate`, `auditRows`) zanim użytkownik go zobaczy; bez `requestIdleCallback` konkuruje z LCP/INP na wejściu.
- Bez `minHeight` skeleton (np. 120 px) → dashboard (720 px) = CLS 0,3+ i skok scrolla na podstronie, w którą wchodzi persona z Google.
- `import()` z szablonem stringa: Rollup tworzy chunk z całego katalogu albo nic; „bundle-analyzable paths" (vercel RBP).
- `useInView` z Motion w `DashboardMount` wiązałby chunk narzędzia z rdzeniem Motion (33,8 KB) w kolejności ładowania; natywny IO = 0 KB (feasibility-perf §3.2 R6).
- `data-ready` na wrapperze (`data-ready={mounted ? "true" : undefined}`) zapala się w chwili, gdy IO + `requestIdleCallback` przestawiają `mounted` — czyli ZANIM `React.lazy` dociągnie chunk i zanim `Suspense` podmieni skeleton. `shoot-tools.mjs` czeka na ten selektor i robi zrzut: wyścig sieć-vs-zrzut daje raz dashboard, raz `.skel`, więc dwa przebiegi dają różne `sha256` (`perf-images-policy` p.5 i test „identyczne sumy"), cache `immutable` na `-v1-1280.webp` zostaje zatruty, a dowód „te same dane, ten sam wynik" sypie się na własnym pipelinie.

#### Niepoprawnie

```tsx
import ProductionDashboard from "@/components/dashboards/ProductionDashboard";   // ×12 statycznie (ToolPage.tsx:7-18 dziś)
const Dash = lazy(() => import(`@/components/dashboards/${key}`));                // nieanalizowalna ścieżka
<Suspense fallback={<div className="skel" />}>…</Suspense>                       // brak minHeight → CLS
<div data-dashboard={key} data-ready={mounted ? "true" : undefined}>…</div>      // flaga PRZED dociągnięciem chunku → niedeterministyczne zrzuty
```

#### Poprawnie

```tsx
// src/components/DashboardMount.tsx
import { Component, Suspense, lazy, useEffect, useRef, useState, type ComponentType, type ReactNode, type RefObject } from "react";
import type { DashboardKey } from "@/data/tools";
import { useLang, pick } from "@/i18n";

/* 12 wpisów = 12 dashboardów; klucze DOKŁADNIE jak w unii DashboardKey (tools.ts:99-111):
   report, production, quality, timeline, payments, reconciliation, g703,
   paymentflow, costcontrol, erpimports, protocols, contracts */
const LOADERS: Record<DashboardKey, () => Promise<{ default: ComponentType }>> = {
  report: () => import("@/components/DemoReport"),
  production: () => import("@/components/dashboards/ProductionDashboard"),
  /* … pozostałe 10 z literalnymi ścieżkami (pełna mapa w references/motion-cheatsheet.md §8) … */
};
const DASHBOARD_MIN_HEIGHT: Record<DashboardKey, number> = { report: 720, production: 640, /* … */ };
const LAZY = Object.fromEntries(Object.entries(LOADERS).map(([k, l]) => [k, lazy(l)])) as Record<DashboardKey, ComponentType>;

const idle = (cb: () => void, timeout = 1500): (() => void) => {
  if (typeof requestIdleCallback === "function") { const id = requestIdleCallback(cb, { timeout }); return () => cancelIdleCallback(id); }
  const id = window.setTimeout(cb, 16); return () => window.clearTimeout(id);
};

const MSG = { pl: "Demo nie wczytało się. Odśwież stronę.", en: "The demo did not load. Refresh the page." };
class Boundary extends Component<{ children: ReactNode; message: string }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <p className="empty">{this.props.message}</p> : this.props.children; }
}

export function DashboardMount({ dashboard }: { dashboard: DashboardKey }) {
  const { lang } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el || mounted) return;
    let cancelIdle: (() => void) | null = null;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      cancelIdle = idle(() => setMounted(true));
    }, { rootMargin: "0px 0px 20% 0px" });
    io.observe(el);
    return () => { io.disconnect(); cancelIdle?.(); };
  }, [mounted]);
  const Dash = LAZY[dashboard];
  const minHeight = DASHBOARD_MIN_HEIGHT[dashboard];
  const skeleton = <div className="skel" style={{ minHeight }} aria-busy="true" />;
  return (
    <div ref={ref} data-dashboard={dashboard} style={{ minHeight }}>
      {mounted ? (
        <Boundary message={pick(lang, MSG)}>
          <Suspense fallback={skeleton}><Dash /><ReadyFlag host={ref} /></Suspense>
        </Boundary>
      ) : skeleton}
    </div>
  );
}

/** data-ready dopiero PO dociągnięciu chunku: efekt wykona się w tym samym commicie co montaż <Dash /> */
function ReadyFlag({ host }: { host: RefObject<HTMLDivElement | null> }) {
  useEffect(() => {
    const el = host.current; if (!el) return;
    el.dataset.ready = "true";
    return () => { delete el.dataset.ready; };
  }, [host]);
  return null;
}
```

#### Test

```bash
# brak statycznych importów dashboardów poza DashboardMount
grep -rnE 'from "@/components/dashboards/|from "@/components/DemoReport"' site/src --include=*.tsx | grep -vE 'DashboardMount\.tsx|import\(' # = 0
# LOADERS z literalnymi ścieżkami, 12 wpisów (11 dashboards/* + DemoReport; 13 = narzędzia w tools.ts, nie dashboardy)
grep -cE 'import\("@/components/(dashboards/[A-Za-z0-9]+|DemoReport)"\)' site/src/components/DashboardMount.tsx   # = 12
# klucze LOADERS/MIN_HEIGHT == unia DashboardKey (bez „flow/cost/erp/labour")
node -e '
const fs = require("node:fs");
const src = fs.readFileSync("site/src/data/tools.ts", "utf8");
const keys = [...src.split("export type DashboardKey =")[1].split(";")[0].matchAll(/"([a-z0-9]+)"/g)].map((m) => m[1]);
const mnt = fs.readFileSync("site/src/components/DashboardMount.tsx", "utf8");
const miss = keys.filter((k) => !new RegExp("\\b" + k + ":\\s*\\(\\)").test(mnt));
const extra = [...mnt.matchAll(/^\s*([a-z0-9]+):\s*\(\)\s*=>\s*import\(/gm)].map((m) => m[1]).filter((k) => !keys.includes(k));
console.log(miss.length === 0 && extra.length === 0 ? "klucze OK (" + keys.length + ")" : "BRAK: " + miss.join(",") + " NADMIAROWE: " + extra.join(","));'

grep -nE 'import\(`' site/src                                                     # = 0
# kontrakt
for k in IntersectionObserver requestIdleCallback minHeight 'data-ready' 'ReadyFlag' Suspense 'rootMargin: "0px 0px 20% 0px"'; do grep -q "$k" site/src/components/DashboardMount.tsx || echo "BRAK $k"; done
# data-ready NIE może zależeć od stanu mounted (wyścig ze zrzutami) — oczekiwane: 0
grep -nE 'data-ready=\{' site/src/components/DashboardMount.tsx
grep -nE 'useInView|from "motion' site/src/components/DashboardMount.tsx           # = 0
# build: 12 osobnych chunków dashboardów w dist/assets (DemoReport jest już w regexie)
ls site/dist/assets | grep -cE '^(DemoReport|ProductionDashboard|QualityGate|TaskTimeline|PaymentCalculator|ImportReconciliation|G703Billing|PaymentFlow|CostControl|ErpImports|LabourProtocols|ContractRegister)-' # = 12
# determinizm flagi: Playwright — w chwili [data-ready="true"] w kontenerze nie ma .skel
#   await page.waitForSelector("[data-dashboard][data-ready='true']");
#   await page.waitForSelector("[data-dashboard] .skel", { state: "detached" });   # pas bezpieczeństwa
# Lighthouse podstrony: CLS < 0,05; Playwright: layoutShift entries po montażu dashboardu = 0 (PerformanceObserver "layout-shift")
```

#### Wyjątki

- `MiniReport`/`MiniAudit`/`KsefFlow` (S2) nie są dashboardami: importowane statycznie z home, bo są w shellu i muszą być natychmiastowe (SSR-safe, bez Motion w środku).
- `DemoReport` na home (jeśli kiedyś) idzie przez `DashboardMount`, nigdy statycznie.

### 5.5 perf-fonts-budget

**Fonty self-hosted w public/fonts, zero CDN, ≤ 100 KB w fazie 1 (Nunito Sans solo) / ≤ 150 KB po ewentualnym drugim kroju, preload latin, font-display swap + size-adjust**

Impact: **HIGH** · Tagi: perf, fonts, privacy, cls, lcp · Źródło: synthesis §1.5 R4/§2.4.9/§2.5 (Nunito solo) · feasibility-perf §3.2/§9 p.5 · ui-kit-habits C3 (N3) · site-audit §1.8 (brak preload) · rozstrzygnięcie (2): PDF zostaje na Roboto · Dodano: 2026-09-12 · Plik: `rules/perf-fonts-budget.md`

#### Zasada

1. Wszystkie kroje w `site/public/fonts/*.woff2` (dziś: `NunitoSans-var-latin.woff2` 49,6 KB + `NunitoSans-var-latin-ext.woff2` 43,7 KB = 93,3 KB). Zero `fonts.googleapis.com`, `fonts.gstatic.com`, `rsms.me`, `cdn.jsdelivr.net`, `@fontsource` ładowanych z sieci.
2. Budżet `dist/fonts`: **≤ 102 400 B (100 KB)** w fazie 1 (Nunito Sans solo, `--font-display` = alias `--font-sans`). Drugi krój (Geist) TYLKO po (a) teście 2 mockupów zaakceptowanym przez founderów i (b) osadzeniu w PDF w tej samej fazie (statyczne TTF 400/600; decyzja o foncie v2); wtedy budżet **≤ 153 600 B (150 KB)** i transfer mobile `/` ≤ 350 KB musi się nadal domykać.
3. `@font-face` z `unicode-range` (latin, latin-ext osobno), `font-display: swap`, fallback systemowy z `size-adjust`/`ascent-override` dopasowanym do Nunito (CLS przy swapie ≈ 0): `@font-face { font-family: "Nunito Sans Fallback"; src: local("Segoe UI"), local("Arial"); size-adjust: 104%; ascent-override: 100%; descent-override: 35%; line-gap-override: 0% }`.
4. `<link rel="preload" as="font" type="font/woff2" crossorigin>` TYLKO dla pliku latin (nie latin-ext, nie dla wagi nieużywanej nad foldem).
5. Wagi: variable font (jeden plik na subset); żadnych dodatkowych statycznych plików wag; UI używa 400/600/700 (nagłówki 600–700, nie 800).
6. PDF (`lib/pdf.ts`): Roboto wbudowane w pdfmake (decyzja B, okno c1); API `pdfDoc({ font })` przyjmuje parametr, ale osadzenie kroju UI w vfs dopiero po decyzji founderów o foncie v2. Nie kopiować woff2 do vfs (pdfmake potrzebuje TTF).

#### Mechanizm awarii (dlaczego)

- CDN fontów = zewnętrzne żądanie na ścieżce krytycznej (DNS + TLS ~300 ms), dane o użytkowniku u dostawcy (persona „dane zostają u Ciebie"; narzędzia chodzą w LAN bez internetu), ryzyko blokera treści → brak fontu.
- Budżet transferu mobile `/` bez wideo ≤ 350 KB: 60 (poster) + 135 (JS) + 20 (CSS) + 93 (font) + 10 (HTML) ≈ 320 przy Nunito solo; Geist (+70 KB) wysadza go (feasibility-perf §3.2).
- Bez preloadu latin przeglądarka odkrywa font po CSS → FOUT na pierwszym wejściu (site-audit §3.1 p.7); bez `size-adjust` swap fallback → Nunito przesuwa H1 o 1–2 linie (CLS 0,1+).
- Dwa kroje = dwa pliki na ścieżce krytycznej i niespójność z PDF (dziś PDF na Roboto, UI na Nunito: świadomy dług).

#### Niepoprawnie

```html
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;600&display=swap" rel="stylesheet">
```

```css
@font-face { font-family: "Nunito Sans"; src: url("/fonts/NunitoSans-var-latin.woff2"); }   /* brak unicode-range, brak display */
```

#### Poprawnie

```css
/* tokens.css / company-ui.css */
@font-face { font-family: "Nunito Sans"; font-style: normal; font-weight: 200 1000; font-display: swap;
  src: url("/fonts/NunitoSans-var-latin.woff2") format("woff2"); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; }
@font-face { font-family: "Nunito Sans"; font-style: normal; font-weight: 200 1000; font-display: swap;
  src: url("/fonts/NunitoSans-var-latin-ext.woff2") format("woff2"); unicode-range: U+0100-02AF, U+0304, U+0308, U+0329, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF; }
@font-face { font-family: "Nunito Sans Fallback"; src: local("Segoe UI"), local("Arial"); size-adjust: 104%; ascent-override: 100%; descent-override: 35%; line-gap-override: 0%; }
:root { --font-sans: "Nunito Sans", "Nunito Sans Fallback", system-ui, sans-serif; --font-display: var(--font-sans); }
```

```html
<link rel="preload" as="font" type="font/woff2" href="/fonts/NunitoSans-var-latin.woff2" crossorigin>
```

#### Test

```bash
# budżet (Git Bash)
du -cb site/public/fonts/*.woff2 | tail -1        # ≤ 102400 (faza 1) / ≤ 153600 (po decyzji Geist)
ls site/public/fonts | wc -l                       # = 2 w fazie 1
# zero CDN
grep -rnE 'fonts\.googleapis|fonts\.gstatic|rsms\.me|@fontsource|cdn\.jsdelivr|unpkg' site/src site/index.html site/package.json   # = 0
# preload latin dokładnie raz, latin-ext nigdy
grep -c 'rel="preload" as="font"' site/index.html                  # = 1
grep -nE 'preload[^>]*latin-ext' site/index.html                    # = 0
# font-face kompletne
grep -cE 'font-display:\s*swap' site/src/styles/*.css               # ≥ 2
grep -cE 'unicode-range' site/src/styles/*.css                       # ≥ 2
grep -cE 'size-adjust' site/src/styles/*.css                         # ≥ 1
# runtime: Lighthouse CLS < 0,05 na /; DevTools Network: 1 żądanie fontu przed LCP (latin), latin-ext dopiero przy polskich znakach
```

#### Wyjątki

- `pdfmake` `vfs_fonts` (Roboto ~470 KB gz) ładuje się lazy po kliknięciu „Pobierz PDF" i nie liczy się do budżetu `dist/fonts`.
- `google<token>.html` (GSC) w `public/` nie jest fontem.

### 5.6 perf-images-policy

**Obrazy: WebP (AVIF opcjonalnie), srcset dla ram i portretów, jawne width/height (CLS 0), loading lazy poniżej folda, limity rozmiarów, zero PNG/JPG w treści**

Impact: **HIGH** · Tagi: perf, images, cls, lcp, webp · Źródło: synthesis §2.3 S3/§2.6.2 M1–M2/§2.4.9 · taste §7.6 (6.D) · motion-dev §8.8 (obrazy bez wymiarów) · WIG (vercel.md) · Dodano: 2026-09-12 · Plik: `rules/perf-images-policy.md`

#### Zasada

| Obraz | Format | Wymiary | Limit | Atrybuty |
|---|---|---|---|---|
| **Kadr produktu w hero** (= poster nagrania = element LCP) | WebP | 1600×1000 (+ 800×500 w `srcset`) | ≤ 110 KB / ≤ 55 KB | `fetchPriority="high"`, bez lazy, klasa `hero-shot` (`perf-lcp-poster-preload`) |
| **Grunt stalowy hero** (tekstura, still Higgsfield) | WebP | 1600 px (+ 800 px) | ≤ 70 KB / ≤ 30 KB | `loading="lazy"`, `decoding="async"`, `aria-hidden`, **nigdy preload, nigdy `fetchpriority`**; wypada bez wpływu na treść |
| **Kafel ściany narzędzi** | WebP | 480×300 (+ 320×200) | ≤ 30 KB / ≤ 16 KB | `loading="lazy"`, `decoding="async"`, `alt=""` (nazwa stoi obok w DOM) |
| Zrzut demo w ramie S3 / hub | WebP | 1280×800 (+ 640×400 w `srcset`) | ≤ 120 KB / ≤ 40 KB | `loading="lazy"` poza pierwszą ramą, `decoding="async"`, `sizes="(min-width: 1024px) 50vw, 100vw"` |
| Miniatura karty | WebP | 640×400 | ≤ 40 KB | `loading="lazy"` |
| Portret foundera | WebP | 960×1200 (+ 480×600) | ≤ 90 KB | `loading="lazy"`, `srcset`, duotone w Photoshop lokalnie |
| Kadr „ścieżki wyliczenia" w S7 | WebP | 1200×1500 (4:5) | ≤ 120 KB | `loading="lazy"` (still generatywny macro **wypadł**: sekcja o determinizmie ma być ilustrowana dowodem determinizmu) |
| OG per trasa | PNG (wymóg crawlerów social) | 1200×630 | ≤ 200 KB | generowany `og.mjs` (faza 3), deterministyczny |
| Ikony | SVG inline (lucide) | 20/24 px | n/d | `aria-hidden` gdy dekoracyjne |
| Schematy (`KsefFlow`, `CollaborationFlow`) | SVG inline | `viewBox` | ≤ 12 KB | tokeny kolorów, statyczne |

Reguły:
1. Każdy `<img>` ma `width` i `height` (albo `aspect-ratio` w CSS na kontenerze) → CLS 0; nigdy obraz bez wymiarów w `whileInView` (przesunięcia layoutu po wejściu).
2. `alt`: pusty (`alt=""`) dla dekoracji i zrzutów opisanych tekstem obok; opisowy dla portretów („Karol, współzałożyciel") i schematów bez tekstu w DOM.
3. Poniżej folda `loading="lazy"` + `decoding="async"`; nad foldem nigdy `lazy`.
4. Brak PNG/JPG w `src/` i `public/media` poza OG i `apple-touch-icon`/`favicon`; konwersja przez `sharp` w `scripts/shoot-tools.mjs`/`og.mjs` (bez npx: `node scripts/...`).
5. Zrzuty dem: deterministyczne (te same dane = identyczny plik), po „Załaduj przykład", bez nazwy firmy źródłowej/produktu w UI (grep w DOM przed zrzutem), ciemny motyw. Warunek zrzutu to `[data-dashboard][data-ready='true']` USTAWIONE PO dociągnięciu chunku (`perf-code-split-dashboards` p.6: flaga wewnątrz `Suspense`, nigdy na wrapperze od stanu `mounted`), plus pas bezpieczeństwa: w kontenerze nie ma już `.skel`, a `document.fonts.ready` jest rozwiązane. Bez tego zrzut łapie raz dashboard, raz skeleton i dwa przebiegi dają różne `sha256`.
6. Obrazy hero/ramy w kontenerze `overflow: hidden` z `object-fit: cover`; `<picture>` z AVIF tylko, gdy oszczędność ≥ 25 % i plik przechodzi przegląd na OLED (banding AVIF na gradientach).

#### Mechanizm awarii (dlaczego)

- Obraz bez wymiarów = layout shift przy dociągnięciu (CLS), a przy `whileInView` błędne offsety IO (motion-dev §8.8); na podstronie narzędzia persona z Google widzi skaczący układ.
- JPG 300 KB zrzutu × 4 ramy na home = 1,2 MB transferu na 4G; budżet mobile `/` ≤ 350 KB bez wideo.
- `loading="lazy"` nad foldem opóźnia LCP; brak lazy poniżej folda ładuje 13 obrazów huba naraz (13 = KARTY narzędzi w `tools.ts`: 12 dem + KSeF; dashboardów jest 12).
- Grunt hero jest **dekoracją**: gdyby dostał `fetchpriority` albo preload, konkurowałby z kadrem produktu o LCP i odbierał budżet ścieżce krytycznej, a to jedyna warstwa hero, którą wolno zdjąć bez straty treści.
- Niedeterministyczne zrzuty (data w UI, losowe ID) zmieniają się przy każdym buildzie → cache immutable nie działa, git puchnie. Ten sam skutek ma zrzut zrobiony za wcześnie: `data-ready` ustawione przed dociągnięciem chunku = wyścig sieci ze zrzutem.

#### Niepoprawnie

```tsx
<img src="/screens/raport.png" className="w-full" />                                  // PNG 640 KB, brak wymiarów/alt/lazy
<m.img initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} src={thumb} />           // bez width/height → CLS + złe offsety IO
```

#### Poprawnie

```tsx
<a className="case-frame" href={`/narzedzia/${tool.slug}`}>
  <img
    src={tool.media.wide}
    srcSet={`${tool.media.thumb} 640w, ${tool.media.wide} 1280w`}
    sizes="(min-width: 1024px) 50vw, 100vw"
    width={1280} height={800}
    alt=""
    loading={index === 0 ? undefined : "lazy"}
    decoding="async"
  />
</a>
```

```js
// scripts/shoot-tools.mjs (fragment): WebP q80, dwa rozmiary, deterministyczne
// wzorzec marki źródłowej trzymamy w JEDNYM miejscu (brand-no-nuconic); tutaj tylko go czytamy
const SRC_BRAND_RE = new RegExp(process.env.SRC_BRAND_RE ?? "", "i");
if (!SRC_BRAND_RE.source || SRC_BRAND_RE.source === "(?:)") throw new Error("brak SRC_BRAND_RE (patrz brand-no-nuconic)");

await page.goto(`${base}/narzedzia/${slug}`);
await page.waitForSelector("[data-dashboard][data-ready='true']");          // flaga PO Suspense
await page.waitForSelector("[data-dashboard] .skel", { state: "detached" }); // pas bezpieczeństwa
await page.evaluate(() => document.fonts.ready);
const html = await page.content(); if (SRC_BRAND_RE.test(html)) throw new Error(`marka źródłowa w DOM: ${slug}`);
const png = await page.locator("[data-dashboard]").screenshot();
await sharp(png).resize(1280, 800, { fit: "cover" }).webp({ quality: 80 }).toFile(`public/media/tools/${slug}-v1-1280.webp`);
await sharp(png).resize(640, 400, { fit: "cover" }).webp({ quality: 78 }).toFile(`public/thumbs/${slug}-v1-640.webp`);
```

#### Test

```bash
# formaty (oczekiwane: 0 poza OG/ikonami)
find site/public/media site/public/thumbs site/src -type f \( -name '*.png' -o -name '*.jpg' -o -name '*.jpeg' \) 2>/dev/null | grep -vE 'og/|apple-touch-icon|favicon|klarow-logo'
# limity rozmiarów
find site/public/media/tools -name '*-1280.webp' -size +120k 2>/dev/null; find site/public/thumbs -name '*.webp' -size +40k 2>/dev/null; find site/public/media/founders -name '*.webp' -size +90k 2>/dev/null
# width/height/alt na KAŻDYM <img> — dopasowanie na ELEMENCIE, nie na linii
# (JSX jest wieloliniowy: w bloku „Poprawnie" `<img` stoi w osobnej linii, a `width`/`height` dwie niżej,
#  więc `grep '<img' | grep -v width=` flagowałby własny wzorzec tej reguły)
node -e '
const fs = require("node:fs"), path = require("node:path");
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
const els = (src, tag) => { const out = [], re = new RegExp("<" + tag + "\\b", "g"); let m;
  while ((m = re.exec(src))) { let i = re.lastIndex, d = 0;
    for (; i < src.length; i++) { const c = src[i]; if (c === "{") d++; else if (c === "}") d--; else if (c === ">" && d === 0) break; }
    out.push(src.slice(m.index, i + 1)); }
  return out; };
let bad = 0;
for (const f of walk("site/src").filter((x) => x.endsWith(".tsx"))) {
  const src = fs.readFileSync(f, "utf8");
  for (const el of els(src, "img")) for (const a of ["width", "height", "alt"]) if (!new RegExp("\\b" + a + "=").test(el)) { console.log(f + ": BRAK " + a + " → " + el.slice(0, 70).replace(/\s+/g, " ")); bad++; }
}
console.log(bad === 0 ? "img-attrs OK" : "img-attrs: " + bad + " naruszen");'
# (docelowo: ESLint jsx-a11y/alt-text + własna reguła na width/height — bramka node zostaje dla CI)
# lazy nad foldem (Hero) = 0; lazy poniżej folda (hub, ramy 2–4) ≥ 1
grep -rnE 'loading="lazy"' site/src/components/Hero.tsx site/src/components/HeroMedia.tsx 2>/dev/null   # = 0
grep -rcE 'loading=' site/src/components/CaseFrame.tsx site/src/pages/Tools.tsx 2>/dev/null               # ≥ 1
# determinizm zrzutów: dwa przebiegi shoot-tools.mjs → identyczne sumy (SRC_BRAND_RE z brand-no-nuconic)
cd site && SRC_BRAND_RE="$SRC_BRAND_RE" node scripts/shoot-tools.mjs && sha256sum public/media/tools/*.webp > /tmp/a && node scripts/shoot-tools.mjs && sha256sum public/media/tools/*.webp | diff - /tmp/a && echo OK
# Lighthouse: CLS < 0,05; „Properly size images", „Serve images in next-gen formats" bez ostrzeżeń
```

#### Wyjątki

- `favicon.ico`, `apple-touch-icon.png`, `klarow-logo-512.png` (JSON-LD `logo`) zostają w PNG/ICO.
- OG per trasa PNG ≤ 200 KB (LinkedIn/X nie renderują WebP w podglądach niezawodnie).

### 5.7 perf-js-budget-home

**JS krytyczny na / ≤ 140 KB gz (react-dom ~58 + router ~15 + motion ~34 + app ~25); podstrona narzędzia ≤ +60 KB gz lazy**

Impact: **HIGH** · Tagi: perf, bundle, budget, home · Źródło: synthesis §2.4.9 · feasibility-perf §5.2 p.2/§9 p.5 · site-audit §1.9 (dziś 157 KB gz index.js z 12 dashboardami) · showreel §5.9 · Dodano: 2026-09-12 · Plik: `rules/perf-js-budget-home.md`

#### Zasada

Po `npm run build` suma gzip chunków JS ładowanych STATYCZNIE z `dist/index.html` (`<script type="module" src>` + `<link rel="modulepreload">`) wynosi ≤ **143 360 B (140 KB)**. Składowe orientacyjne: `react-dom` ~58, `react-router` ~15, `motion` ~34 (`motion-bundle-budget-motion`), kod aplikacji + dane ~25, `lucide` (tylko używane ikony, tree-shaken) ~5.

Podstrona narzędzia (`/narzedzia/<slug>`): chunki dociągane po nawigacji (`ToolPage` + jeden dashboard + `lib/*`) ≤ **61 440 B (60 KB)** gz ponad wspólne. `pdfmake` (~830 KB gz z fontem) tylko po kliknięciu „Pobierz PDF", nigdy w modulepreload.

Warstwa mediów (`HeroMedia`, `MediaBoundary`, klipy hover w `ToolWall`) to ≈ 1,5 KB gz logiki i **zero nowych zależności**: budżet 140 KB gz nie rośnie z powodu powrotu wideo (rosną wyłącznie budżety TRANSFERU, patrz `media-video-budgets`).

Zakazane w chunku krytycznym: `three`, `@react-three/fiber`, `pdfmake`, 12 dashboardów, `ToolPage`, `BookingDialog` (lazy przy otwarciu), `toolsSeo.ts` w całości (dane per slug ładowane z podstroną albo hub importuje tylko `getTools()` bez FAQ), `radial-orbital-timeline`, `canvas-reveal-effect`.

Baseline w `site/scripts/verify-site.baseline.json` (`homeGz`, `toolGz`), aktualizowany tylko commitem `Perf: nowy baseline (powód)`. Plik tworzy `verify-site.mjs --write-baseline` po pierwszym zielonym buildzie v2; do tego czasu budżet to stałe 140 KB gz z `--budget`.

#### Mechanizm awarii (dlaczego)

- Dziś `index-*.js` = 511 KB / 157 KB gz na KAŻDEJ trasie, bo `ToolPage.tsx:7-18` importuje 12 dashboardów statycznie, a `App.tsx:36` importuje `ToolPage` statycznie (site-audit §3.1 p.1). Strona `/oferta` płaci za Gantt, G703 i kalkulator transz, których nie pokazuje.
- Budżet 140 KB przy 4G to ~0,5 s pobierania + parsowanie na Moto G4 ~0,8 s; 157 KB + 118 KB three = INP i TBT poza zielenią Lighthouse.
- Sędzia wykonalności: budżet 130 KB (proof) był nierealny dla home z 6 mini-embedami; editorial ma mniej kodu w home i 140 się domyka TYLKO z lazy dashboardami i bez three w ścieżce krytycznej.
- Regresja bundla jest cicha (`tsc`/`build` zielone); tylko bramka liczbowa ją łapie.

#### Niepoprawnie

```tsx
// App.tsx
import ToolPage from "@/pages/ToolPage";                       // statycznie, ciągnie 12 dashboardów
import { BookingModal } from "@/components/BookingModal";       // 2 KB auto-animate + kalendarz na każdej trasie
// pages/ToolPage.tsx
import ProductionDashboard from "@/components/dashboards/ProductionDashboard";  // ×12
```

#### Poprawnie

```tsx
// App.tsx
const ToolPage = lazy(() => import("@/pages/ToolPage"));
const ToolsPage = lazy(() => import("@/pages/Tools"));
const OfferPage = lazy(() => import("@/pages/Offer"));
const BookingDialog = lazy(() => import("@/components/BookingDialog"));
// Home = import statyczny (LCP), reszta lazy z Suspense WEWNĄTRZ PageFade (skeleton kitu)

// components/DashboardMount.tsx: mapa literalnych ścieżek (bundle-analyzable)
// klucze = unia DashboardKey z src/data/tools.ts:99-111 (NIE „flow/cost/erp/labour" — takich kluczy nie ma)
const LOADERS: Record<DashboardKey, () => Promise<{ default: ComponentType }>> = {
  report: () => import("@/components/DemoReport"),
  production: () => import("@/components/dashboards/ProductionDashboard"),
  quality: () => import("@/components/dashboards/QualityGate"),
  timeline: () => import("@/components/dashboards/TaskTimeline"),
  payments: () => import("@/components/dashboards/PaymentCalculator"),
  reconciliation: () => import("@/components/dashboards/ImportReconciliation"),
  g703: () => import("@/components/dashboards/G703Billing"),
  paymentflow: () => import("@/components/dashboards/PaymentFlow"),
  costcontrol: () => import("@/components/dashboards/CostControl"),
  erpimports: () => import("@/components/dashboards/ErpImports"),
  protocols: () => import("@/components/dashboards/LabourProtocols"),
  contracts: () => import("@/components/dashboards/ContractRegister"),
};
```

```js
// scripts/verify-site.mjs (fragment)
const critical = [...html.matchAll(/(?:src|href)="\/assets\/([^"]+\.js)"/g)].map((m) => m[1]);
const homeGz = critical.reduce((s, f) => s + gzipSync(readFileSync(`dist/assets/${f}`)).length, 0);
if (homeGz > 140 * 1024) fail(`perf-js-budget-home: ${homeGz} B gz > 140 KB`);
```

#### Test

```bash
cd site && npm run build >/dev/null
# suma chunków statycznych z index.html
for f in $(grep -oE '/assets/[^"]+\.js' dist/index.html | sort -u); do gzip -c "dist$f" | wc -c; done | awk '{s+=$1} END {print s " B gz (limit 143360)"}'
# zakazane biblioteki w chunkach krytycznych
for f in $(grep -oE '/assets/[^"]+\.js' dist/index.html | sort -u); do grep -lE 'pdfmake|THREE\.|WebGLRenderer|ProductionDashboard|G703|allocateGrosze' "dist$f"; done   # = 0
# lazy w kodzie
grep -nE 'lazy\(\(\) => import\("@/pages/ToolPage"\)' src/App.tsx | wc -l     # = 1
grep -nE '^import .* from "@/components/dashboards/' src/pages/ToolPage.tsx | wc -l   # = 0
# klucze LOADERS == unia DashboardKey (bramka „12 chunków" ich nie sprawdza): patrz test w perf-code-split-dashboards
# podstrona narzędzia: chunki dociągane (Playwright: performance.getEntriesByType("resource") po nawigacji do /narzedzia/raport-zarzadczy, suma transferSize .js ≤ 61440)
```

Docelowo `scripts/verify-site.mjs` krok `js-budget` (home + per slug z `dist/narzedzia/<slug>.html` modulepreload).

#### Wyjątki

- Plan B (GLSL Hills): `three` wchodzi jako chunk lazy po idle po `load`, NIE liczy się do 140 KB, ale liczy się do transferu desktop ≤ 2,5 MB.

### 5.8 perf-lcp-poster-preload

**LCP = kadr produktu w hero (bramka ELEMENTOWA, nie tylko czasowa): preload z fetchpriority high, H1 w shellu, wideo nigdy preloadowane i montowane dopiero po load i rIC; bramki CWV: LCP mobile < 2,5 s / desktop < 1,8 s, CLS < 0,05 na / i < 0,1 na podstronach, INP < 200 ms**

Impact: **HIGH** · Tagi: perf, lcp, hero, preload, prerender · Źródło: synthesis §2.3 S1/§2.4.9/§5 (perf-cls, perf-inp) · docs/plan/strona-v2-plan.md:410-412 i :647 (LCP < 2,5 s, CLS < 0,1, INP < 200 ms) · higgsfield §4.5 p.6 · taste §7.6 (6.D) · vercel.md WIG · feasibility-perf §9 p.5 · Dodano: 2026-09-12 · Plik: `rules/perf-lcp-poster-preload.md`

#### Zasada

1. **Element LCP na `/` musi być kadrem produktu**: `<img class="hero-shot">` z `hero-production-v<N>.webp` (1600×1000 WebP ≤ 110 KB; mobile 800×500 ≤ 55 KB). Ten sam plik jest jednocześnie `poster` nagrania i klatką 0 pliku wideo (`media-poster-first-frame`). Na pozostałych trasach LCP to H1/tekst z shellu (bez obrazów nad foldem poza miniaturami ≤ 40 KB).
2. `index.html` (a przez `prerender.mjs` każdy z 19 HTML) zawiera w `<head>`: `<link rel="preload" as="image" href="<HERO_POSTER>" fetchpriority="high">` PRZED skryptami; na trasach bez hero preload jest USUWANY przez prerender (nie marnować pasma). **Preloadów obrazu jest dokładnie jeden na `/`.**
3. `<img>` kadru ma `fetchPriority="high"`, `decoding="async"`, `width`/`height`, bez `loading="lazy"`; wszystkie inne obrazy nad foldem: bez `loading="lazy"`; poniżej folda: `loading="lazy"`. **Grunt stalowy hero (`hero-ground-v<N>.webp`) jest `loading="lazy"` i NIGDY nie jest preloadowany ani `fetchpriority="high"`** (`perf-images-policy`).
4. **Wideo nie jest NIGDY preloadowane** (`preload="metadata"`, zero `<link rel="preload" as="video">`) i montuje się dopiero po `window.load` **oraz** `requestIdleCallback` (`media-video-gating` p.1); w shellu prerendera nie ma ani `<video>`, ani odwołania do pliku wideo.
4a. **Bramka jest ELEMENTOWA, nie tylko progowa:** pomiar `PerformanceObserver({ type: "largest-contentful-paint" })` musi wskazać `img.hero-shot`. Sam próg czasowy nie wystarcza: przy wolniejszym łączu pierwsza klatka wideo potrafi przejąć tytuł LCP i nadal zmieścić się w progu, a regresja wychodzi dopiero w polu (CrUX). Gdyby bramka elementowa była czerwona mimo `load` + `rIC`, tryb awaryjny to montaż wideo dopiero po pierwszej interakcji użytkownika (`scroll`/`pointerdown`/`keydown`), bo wtedy LCP jest już zamrożone.
5. Font latin (`NunitoSans-var-latin.woff2`) ma `<link rel="preload" as="font" type="font/woff2" crossorigin>`; `font-display: swap` + `size-adjust` w fallbacku (CLS).
6. Krytyczny CSS = jeden plik ≤ 20 KB gz (`perf-chunk-size-gate`); zero `@import` z CDN; zero skryptów zewnętrznych przed LCP (CF Web Analytics po `load`/idle).
7. **Bramki Core Web Vitals (wszystkie trzy, nie tylko LCP)** — mierzone na `dist` przez `vite preview` w fazie 4 (Lighthouse ze scratchpadu, bez `npx`) i po każdym wdrożeniu (PageSpeed Insights, pole CrUX z CF Web Analytics):

   | Metryka | Próg | Gdzie |
   |---|---|---|
   | LCP | mobile < 2 500 ms, desktop < 1 800 ms | `/` (poster) i 2 podstrony narzędzia (H1) |
   | CLS | < 0,05 na `/`; < 0,1 na podstronach (dashboard + skeleton) | wszystkie mierzone trasy |
   | INP | < 200 ms | `/` (menu, CTA, przełącznik PL/EN) i podstrona narzędzia (suwak/tolerancja w dashboardzie) |

   Progi CLS i INP są takie same jak w planie (`docs/plan/strona-v2-plan.md:410-412`, `:647`); tu są jedynym miejscem, w którym mają POSTAĆ BRAMKI — reszta reguł powołuje się na nie jako uzasadnienie (fonty, obrazy, skeleton, lazy). Przekroczenie = HIGH, wpis do raportu F4 z liczbą przed/po.

#### Mechanizm awarii (dlaczego)

- Bez preloadu przeglądarka odkrywa poster dopiero po sparsowaniu HTML i CSS (a w SPA po starcie Reacta, gdy shell go nie ma): +0,5–1,5 s do LCP na 4G.
- `fetchpriority="high"` na posterze przesuwa go przed fontem i chunkami JS w kolejce sieci; bez tego Chrome ładuje obraz jako „Low" do czasu layoutu.
- `loading="lazy"` na obrazie nad foldem (częsty błąd „lazy wszędzie") opóźnia LCP o pełny cykl layoutu.
- Wideo startujące przed `load` konkuruje z kadrem i fontem o pasmo; Chrome liczy pierwszą klatkę autoplay-wideo jako kandydata LCP, co przy 1,2 MB daje LCP > 3 s (R-M2).
- Preload na trasach bez hero = 110 KB zmarnowane na każdej podstronie narzędzia (13 tras).
- Preload postera/tekstury, która NIE jest elementem LCP, jest podwójnie szkodliwy: zjada pasmo na ścieżce krytycznej i sam bywa promowany na kandydata LCP.
- CLS i INP bez progu w regułach = metryki, których żaden audytor nie ma czym egzekwować: `verify-site.mjs` i audyt F4 sprawdzają to, co ma liczbę. Dwa najczęstsze źródła u nas to podmiana skeleton → dashboard bez `minHeight` (CLS) i montaż ciężkich komponentów w trakcie interakcji (INP), więc progi muszą stać obok LCP, a nie w prozie.

#### Niepoprawnie

```html
<head>…<script type="module" src="/src/main.tsx"></script></head>            <!-- brak preloadu; poster odkryty po starcie Reacta -->
<img src="/media/hero-production-v1.webp" loading="lazy" />                   <!-- lazy nad foldem -->
<link rel="preload" as="image" href="/media/hero-ground-v1.webp">             <!-- preload tekstury: kradnie pasmo i bywa promowana na LCP -->
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=…">    <!-- CDN na ścieżce krytycznej -->
```

#### Poprawnie

```html
<!-- site/index.html <head> (kolejność ma znaczenie) -->
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="preload" as="image" href="/media/hero-production-v1.webp" fetchpriority="high">
<link rel="preload" as="font" type="font/woff2" href="/fonts/NunitoSans-var-latin.woff2" crossorigin>
<!-- CSS wstrzykiwany przez Vite; skrypty module na końcu -->
```

```js
// scripts/prerender.mjs (fragment): preload postera tylko na trasach z hero
const withHero = new Set(["/"]);
html = html.replace(/<link rel="preload" as="image"[^>]*hero-v\d+\.poster\.webp[^>]*>\n?/, (tag) => (withHero.has(route) ? tag : ""));
```

```tsx
<img className="hero-shot" src={HERO_POSTER}
     alt="Pulpit produkcji: kafle hal i suwak tygodnia, dane przykładowe"
     width={1600} height={1000} fetchPriority="high" decoding="async" />
```

#### Test

```bash
# po npm run build
grep -c 'rel="preload" as="image"' site/dist/index.html                         # = 1
grep -c 'fetchpriority="high"' site/dist/index.html                              # ≥ 1
grep -lE 'rel="preload" as="image"' site/dist/narzedzia/*.html site/dist/oferta.html site/dist/faq.html site/dist/rodo.html 2>/dev/null   # = 0 plików (bez hero)
grep -c 'rel="preload" as="font"' site/dist/index.html                           # = 1
grep -rnE 'loading="lazy"' site/src/components/Hero.tsx site/src/components/HeroMedia.tsx 2>/dev/null   # = 0 dla kadru (grunt hero MA lazy: osobny element)
grep -rnE 'rel="preload"[^>]*as="video"' site/index.html site/dist 2>/dev/null     # = 0 (wideo nigdy nie jest preloadowane)
grep -rlE '<video|hero-production-v[0-9]+\.(webm|mp4)' site/dist --include=*.html  # = 0 plików (shell bez wideo)
grep -rnE 'fonts\.googleapis|cdn\.|unpkg|jsdelivr' site/index.html site/src      # = 0
# Lighthouse (faza 4; z scratchpadu, bez npx): node <ścieżka>/lighthouse http://localhost:4173/ --preset=perf --form-factor=mobile --throttling-method=simulate
#   LCP < 2500 ms mobile, < 1800 ms desktop; „LCP element" = img.hero-shot (na /) lub h1 (pozostałe) — bramka ELEMENTOWA:
#   new PerformanceObserver(l => l.getEntries().at(-1).element.className) musi zawierać „hero-shot"; wartość inna = FAIL, nawet gdy czas mieści się w progu
#   CLS < 0,05 na / i < 0,1 na /narzedzia/<slug> (audits["cumulative-layout-shift"].numericValue)
#   INP: Lighthouse podaje TBT jako proxy — twardy pomiar w Playwright:
#     PerformanceObserver({ type: "event", durationThreshold: 16, buffered: true }) → max(interactionId > 0) < 200 ms
#     scenariusz: klik CTA, otwarcie/zamknięcie dialogu, przełącznik PL/EN, suwak tygodnia w dashboardzie
```

Docelowo `scripts/verify-site.mjs` krok `preload` + Lighthouse w F4.

#### Wyjątki

- Plan B (statyczny kadr bez wideo, `strona-v2-plan.md` §7.1 wariant B): preload kadru zostaje bez zmian (kadr jest wtedy jedynym wizualem hero na wszystkich urządzeniach).
- Wariant D37(b) (pętla generatywna jako tekstura pod scrimem): element LCP nadal musi być kadrem produktu; poster pętli jest wtedy osobnym plikiem i **nie jest preloadowany ani renderowany w shellu**.

### 5.9 perf-three-js-policy

**three.js (GLSL Hills) tylko jako plan B: desktop pointer fine, montaż po idle po load, saveData gate, poza pierwszym JS, nigdy z wideo; usunąć z dependencies, gdy hero-loop przejdzie**

Impact: **HIGH** · Tagi: perf, three, webgl, background, bundle · Źródło: synthesis §2.6.3/§1.3 P7 · site-audit §1.7/§1.9/§3.1 p.2 · feasibility-perf §5.2 p.5 · glsl-hills.tsx (wzorzec GPU-higieny) · higgsfield §9 werdykt · Dodano: 2026-09-12 · Plik: `rules/perf-three-js-policy.md`

#### Zasada

> **Stan po 2026-09-12 (D37):** jedyne ruchome tło na trasie `/` zajmuje **nagranie narzędzia w hero**, więc GLSL Hills **nie wracają** do v1 ani w planie B (`media-one-autoplay-per-route`: nigdy dwa ruchome tła). `three` i `@react-three/fiber` są poza `dependencies`; poniższa polityka obowiązuje na wypadek powrotu WebGL w fazie 2, po nowej decyzji founderów.

Decyzja dwustopniowa (D-08):

**Faza 0**: `GLSLHills` schodzi z bundla `/` (usunąć `lazy(() => import("@/components/ui/glsl-hills"))` i `useAnimatedBg()` z `App.tsx`; plik `glsl-hills.tsx` + `BgBoundary.tsx` zostają w repo jako wzorzec GPU-higieny cytowany przez strażnika).

**Po trialu Higgsfield**:
- hero-loop zaakceptowany → `three` i `@react-three/fiber` usunięte z `site/package.json` (−118 KB gz na wizytę desktop), `glsl-hills.tsx` przeniesiony do `refs/` albo skasowany w tym samym commicie (zero martwego kodu), `@types/three` usunięte;
- hero-loop odrzucony → GLSL Hills wraca jako tło `/` (i tylko `/`) na warunkach:
  1. montaż wyłącznie na `(pointer: fine)` (`perf-no-webgl-on-coarse`), przy `!prefers-reduced-motion` (reduced → jedna klatka jak dziś `glsl-hills.tsx:224-255`), przy `!navigator.connection.saveData`, przy `MEDIA_ENABLED`,
  2. chunk lazy dociągany po `window.load` + `requestIdleCallback` (nigdy w `modulepreload`, nigdy przed LCP),
  3. w `.bg-layer` (`media-video-placement`), pod `BgBoundary`, bez `zoomRef` (relikt decka), `PlaneGeometry` 160×160 zamiast 256×256 (test jakości na 1440p), throttle 30 fps, pauza `document.hidden`, pełny cleanup (rAF cancel, `dispose()` geometrii/materiału/renderera, `removeEventListener`),
  4. `HeroMedia` renderuje wtedy wyłącznie poster (`media-one-autoplay-per-route`: nigdy wideo + WebGL),
  5. transfer desktop `/` ≤ 2,5 MB z uwzględnieniem chunku three.

Zakazane w każdej fazie: three w drzewie Motion (`motion/three`, `threeEffect`), drugi canvas WebGL, `@react-three/fiber` (niepotrzebny wrapper; obecny `glsl-hills.tsx` używa czystego three), canvas na trasach innych niż `/`.

#### Mechanizm awarii (dlaczego)

- Dziś three.js = 471 KB / 118 KB gz na KAŻDEJ wizycie desktop (site-audit §1.9), plus siatka 256×256 = ~66 k wierzchołków animowanych w vertex shaderze przy 30 fps; na laptopach z GPU zintegrowanym równolegle z dashboardami to jank (feasibility-perf §5.2 p.5).
- „Szybkość jako część przekazu" (wdrożenie w dni): 118 KB dekoracji przeczy temu na pierwszej wizycie.
- Bug iOS 2026-07-24: canvas `fixed` WebGL komponowany nad treścią; `pointer: coarse` = nic ruchomego.
- Pakiet w `dependencies` bez importu = martwy kod, który wraca przy pierwszym „a może dodamy tło" bez decyzji.

#### Niepoprawnie

```tsx
// App.tsx (stan obecny, do zmiany w fazie 0)
const GLSLHills = lazy(() => import("@/components/ui/glsl-hills").then((m) => ({ default: m.GLSLHills })));
const animatedBg = useAnimatedBg();
{animatedBg ? <BgBoundary><Suspense fallback={null}><GLSLHills width="100%" height="100%" speed={0.2} zoomRef={zoomRef} /></Suspense></BgBoundary> : null}
<Hero><HeroMedia /></Hero>   // wideo + WebGL naraz
```

#### Poprawnie

```tsx
// App.tsx (plan B po D-08; plan A = ten blok nie istnieje, three poza package.json)
function useIdleDesktopBg(): boolean {
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!MEDIA_ENABLED) return;
    if (!matchMedia("(pointer: fine)").matches) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const c = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (c?.saveData) return;
    let cancel: (() => void) | null = null;
    const arm = () => { cancel = idle(() => setOn(true), 2000); };
    if (document.readyState === "complete") arm(); else window.addEventListener("load", arm, { once: true });
    return () => { window.removeEventListener("load", arm); cancel?.(); };
  }, []);
  return on;
}
const GLSLHills = lazy(() => import("@/components/ui/glsl-hills").then((m) => ({ default: m.GLSLHills })));
const bg = useIdleDesktopBg();
<div className="bg-layer" aria-hidden="true">
  {bg ? <BgBoundary><Suspense fallback={null}><GLSLHills width="100%" height="100%" speed={0.2} planeSize={160} /></Suspense></BgBoundary> : null}
</div>
<Hero><HeroMedia videoAllowed={false} /></Hero>
```

#### Test

```bash
# plan A (po akceptacji hero-loop): three nieobecne
node -e 'const p=require("./site/package.json");for(const k of ["three","@react-three/fiber"])if(p.dependencies[k])console.log("three nadal w dependencies:",k)'
grep -rnE 'glsl-hills|GLSLHills|from "three"' site/src   # = 0
# plan B: warunki montażu
grep -nE '\(pointer: fine\)' site/src/App.tsx; grep -nE 'saveData' site/src/App.tsx; grep -nE 'readyState === "complete"|addEventListener\("load"' site/src/App.tsx; grep -nE 'requestIdleCallback' site/src/App.tsx
grep -nE 'zoomRef' site/src/App.tsx site/src/components/ui/glsl-hills.tsx    # = 0 (relikt usunięty)
grep -nE 'planeSize=\{160\}|PlaneGeometry\(160' site/src                      # ≥ 1
# nigdy w chunkach krytycznych
for f in $(grep -oE '/assets/[^"]+\.js' site/dist/index.html | sort -u); do grep -lE 'WebGLRenderer|THREE' "site/dist$f"; done   # = 0
grep -nE 'modulepreload[^>]*glsl' site/dist/index.html   # = 0
# GPU-higiena w glsl-hills.tsx (jeśli zostaje)
for k in cancelAnimationFrame 'document.hidden' visibilitychange 'prefers-reduced-motion' 'dispose\(\)' 'removeEventListener'; do grep -qE "$k" site/src/components/ui/glsl-hills.tsx || echo "BRAK $k"; done
# runtime: WebKit 390×844 → canvas = null; desktop → canvas pojawia się dopiero po load (Performance: chunk three po LCP)
```

#### Wyjątki

- `BgBoundary.tsx` może zostać jako komponent bazowy dla `MediaBoundary` także w planie A.
- Sonda WebGL na osobnym canvasie z `loseContext` (`glsl-hills.tsx:164-167`) jest częścią wzorca i zostaje przy planie B.

### 5.10 perf-no-zoom-root

**Zakaz zoom na :root; skalowanie dużych ekranów przez clamp() w tokenach typografii i kontenerze**

Impact: **MEDIUM** · Tagi: perf, layout, zoom, measurement, tokens · Źródło: synthesis §1.5 R7/§2.7.2 („globals.css bez zoom") · motion-dev §8.7/§8.12 · site-audit §3.1 p.6 (globals.css:116-125, TaskTimeline.tsx:151 clientWidth) · feasibility-perf §6 p.5 · Dodano: 2026-09-12 · Plik: `rules/perf-no-zoom-root.md`

#### Zasada

`site/src/styles/globals.css` nie zawiera `zoom` na `:root`/`html`/`body` (dziś: `1.08` od 1500 px, `1.18` od 1900 px; do usunięcia w fazie 0 z retestem 12 dashboardów na 1920 i 2560 px). Skalowanie na dużych ekranach realizują tokeny:

```css
:root { --container: 72rem; --gutter: clamp(16px, 4vw, 40px); }
:root { --text-base: clamp(1rem, 0.95rem + 0.2vw, 1.125rem); --text-display: clamp(2.25rem, 5.2vw, 4.25rem); }
@media (min-width: 1900px) { :root { --container: 80rem; --text-base: 1.125rem; } }
```

Zakazane też: `zoom` na dowolnym elemencie w `site/src` (poza `print`), `transform: scale()` na wrapperach layoutu jako „powiększenie", `font-size` w px na `html` zmieniane per breakpoint powyżej 1 stopnia.

#### Mechanizm awarii (dlaczego)

- `zoom` zmienia geometrię: `getBoundingClientRect`, `clientWidth` (`TaskTimeline.tsx:151` mierzy kontener Gantta), `IntersectionObserver` i pointer events zachowują się różnie między silnikami (Chrome ujednolicił „standardized zoom" dopiero w 128; Safari i Firefox liczą inaczej). `useInView`, `Counter`, `DashboardMount` (IO) i `WipeCompare` (pomiar szerokości) mierzą; pod `zoom` offsety na ≥ 1500 px mogą być przesunięte (reveal odpala za wcześnie/za późno).
- Lighthouse/CLS liczą w pikselach CSS po zoomie; pomiary z laptopa Karola (≥ 1500 px) nie odpowiadają pomiarom z CI (1350 px).
- `zoom` nie działa w Firefox < 126 jako standard i jest ignorowany przez część czytników powiększających.
- Dashboardy mają własne pomiary (`clientWidth`, `ResizeObserver` w Gantt); podwójne skalowanie (zoom + clamp) daje za duże elementy na 4K.

#### Niepoprawnie

```css
/* globals.css:116-125 (stan obecny) */
@media (min-width: 1500px) { :root { zoom: 1.08; } }
@media (min-width: 1900px) { :root { zoom: 1.18; } }
```

#### Poprawnie

```css
/* tokens.css */
:root {
  --container: 72rem;
  --gutter: clamp(16px, 4vw, 40px);
  --text-xs: .75rem; --text-sm: .875rem; --text-base: clamp(1rem, .95rem + .2vw, 1.125rem);
  --text-lg: 1.125rem; --text-xl: 1.5rem; --text-display: clamp(2.25rem, 5.2vw, 4.25rem);
  --section-py: clamp(64px, 9vw, 120px);
}
@media (min-width: 1900px) { :root { --container: 80rem; } }
.container { max-width: var(--container); margin-inline: auto; padding-inline: var(--gutter); }
```

#### Test

```bash
grep -rnE '\bzoom\s*:' site/src --include=*.css --include=*.tsx | grep -v '@media print'    # = 0
grep -rnE 'transform:\s*scale\([0-9.]+\)' site/src/styles/globals.css site/src/styles/tokens.css 2>/dev/null   # = 0 na wrapperach layoutu
grep -cE 'clamp\(' site/src/styles/tokens.css 2>/dev/null   # ≥ 3
# retest po zdjęciu zoomu: Playwright Chromium 1920×1080 i 2560×1440 → zrzuty 12 dashboardów; porównanie ręczne z zrzutami sprzed zmiany (czytelność KPI, szerokość Gantta = clientWidth kontenera)
# pomiary IO: na 2560 px reveal sekcji S2 odpala, gdy 25 % elementu jest w viewporcie (Playwright: boundingBox vs viewport w chwili zmiany opacity)
```

#### Wyjątki

- `@media print` w `lib/pdf.ts` nie dotyczy (PDF generuje pdfmake, nie CSS print).
- Tymczasowo, do końca fazy 0, `zoom` może zostać w `globals.css` z komentarzem `/* perf-no-zoom-root: do usunięcia w fazie 0 (R7) */`; po fazie 0 = fail.

## 6. React / Vite / TS / git / plan (bez `npx`, `npm run check`, kompozycja, React 19) (`code`)

Domyślny impact: **MEDIUM** · tryb: both · właściciel audytu: `code-auditor`

### 6.1 code-lint-and-tests-gate

**Bramka przed pushem: tsc, ESLint (react-hooks, jsx-a11y), node --test golden, build, verify, audit**

Impact: **BLOCKER** · Tagi: ci, eslint, tests, gate, npm-run-check, code · Źródło: CLAUDE.md #4, #6 (tsc + vite build przed pushem; npx nie działa) / site-audit.md §1.1 (brak lint/test) / synthesis §2.7.1 „Jakość", §5.8.4 (npm run check), D-23 / peer-legal.md §1.5 · Dodano: 2026-09-12 · Plik: `rules/code-lint-and-tests-gate.md`

#### Zasada

Push na `main` tylko po zielonym `npm run check` w `site/`, który uruchamia po kolei (zero `npx`; binarki wprost przez `node node_modules/...`):
1. `node node_modules/typescript/bin/tsc --noEmit`
2. `node node_modules/eslint/bin/eslint.js src --max-warnings 0` z pluginami `eslint-plugin-react-hooks` (`rules-of-hooks`, `exhaustive-deps`) i `eslint-plugin-jsx-a11y` (`recommended`) oraz regułami własnymi `no-restricted-syntax` (forwardRef, useContext, `import { motion }`, `npx`)
3. `node --test tests/` — golden-testy silników `lib/report.ts`, `lib/qualityGate.ts`, `lib/tranches.ts`, `lib/g703.ts`: dwa przebiegi na tym samym wejściu = identyczny JSON (`assert.deepStrictEqual`), plus snapshot JSON w `tests/golden/*.json`
4. `node node_modules/vite/bin/vite.js build` + `npm run prerender`
5. `node ../.claude/skills/klarow-guardian/scripts/verify-site.mjs`
6. `node ../.claude/skills/klarow-guardian/scripts/audit-static.mjs --fail-on BLOCKER,HIGH --baseline ../.claude/skills/klarow-guardian/baseline/audit-static-2026-09-12.jsonl`
   (nazwa skryptu i ścieżka baseline'u dosłownie takie; `scripts/audit-ui.mjs` nie istnieje. Flagi WYŁĄCZNIE ze spacją: parser `audit-static.mjs:41-52` nie zna formy `--fail-on=…` i cicho bierze ją za ścieżkę do skanowania, więc bramka kończy się exit 0 bez sprawdzenia czegokolwiek.)

Czerwony krok 1 lub 4 = BLOCKER (twarda zasada CLAUDE.md #6). Czerwony 2, 3, 5, 6 = BLOCKER po decyzji D-23 (do tego czasu HIGH; agent i tak nie pushuje z czerwonym wynikiem). Nowy silnik w `lib/` bez golden-testu = fail kroku 3.

#### Mechanizm awarii (dlaczego)

Repo nie ma dziś ESLint ani testów (`package.json` ma tylko `dev/build/prerender/preview`; komentarz `// eslint-disable-line` w `TaskTimeline.tsx:153` jest martwy). `tsc` nie wykryje brakującego cleanupu w `useEffect`, złych deps, `<div onClick>` bez roli ani `img` bez `alt`; to wyłapują `react-hooks` i `jsx-a11y`. Determinizm dem jest obietnicą produktową (CLAUDE.md #6): bez testu „dwa przebiegi = ten sam JSON" regresja `Math.random`/`Date.now` w silniku przechodzi niezauważona do produkcji. `npx` w skryptach łamie build lokalnie przez `&` w ścieżce repo („'Pawe' is not recognized").

#### Niepoprawnie

```json
{ "scripts": { "lint": "npx eslint src", "test": "npx vitest" } }
```
```bash
git push origin main   # po samym `tsc`, bez buildu; albo z czerwonym lintem „bo to tylko warningi"
```

#### Poprawnie

```json
{
  "scripts": {
    "typecheck": "node node_modules/typescript/bin/tsc --noEmit",
    "lint": "node node_modules/eslint/bin/eslint.js src --max-warnings 0",
    "test": "node --test tests/",
    "build": "node node_modules/vite/bin/vite.js build && npm run prerender",
    "check": "npm run typecheck && npm run lint && npm run test && npm run build && node ../.claude/skills/klarow-guardian/scripts/verify-site.mjs && node ../.claude/skills/klarow-guardian/scripts/audit-static.mjs --fail-on BLOCKER,HIGH --baseline ../.claude/skills/klarow-guardian/baseline/audit-static-2026-09-12.jsonl"
  }
}
```
```js
// site/tests/report.golden.test.mjs
import { test } from "node:test"; import assert from "node:assert/strict";
import { aggregate, parseCsv } from "../dist-ssr/lib/report.js";   // albo tsx-loader; ważne: ten sam moduł co runtime
import sample from "./fixtures/demo-sample.json" with { type: "json" };
test("report: dwa przebiegi = identyczny JSON", () => {
  const a = JSON.stringify(aggregate(parseCsv(sample.csv)));
  const b = JSON.stringify(aggregate(parseCsv(sample.csv)));
  assert.equal(a, b);
});
```

#### Test

```bash
grep -nE "\"check\":" site/package.json                                  # 1
grep -rnE "\bnpx\b" site/package.json site/README.md .claude/skills/klarow-guardian/scripts 2>/dev/null   # 0
ls site/tests/*.test.mjs | wc -l                                          # ≥ 4 (report, qualityGate, tranches, g703)
grep -nE "react-hooks|jsx-a11y" site/eslint.config.js                     # ≥ 2
# krok 6 wskazuje istniejący skrypt i istniejący baseline (audit-ui.mjs NIE istnieje)
grep -n "audit-ui.mjs" site/package.json                                  # 0
test -f .claude/skills/klarow-guardian/scripts/audit-static.mjs && test -f .claude/skills/klarow-guardian/baseline/audit-static-2026-09-12.jsonl && echo "OK bramka 6"
cd site && npm run check                                                  # exit 0 przed każdym pushem
```

#### Wyjątki

Commity WIP na gałęzi roboczej (nie `main`) mogą pomijać kroki 5–6; `main` nigdy. Cloudflare Pages CI wykonuje tylko `npm run build` (bez lintu/testów), więc bramka jest lokalna i musi być wykonana przed pushem, nie „naprawiona po deployu".

### 6.2 code-build-target-policy

**Polityka build.target/cssTarget: es2019 + safari13 w fazie 1; CSS bez color-mix/oklch; komentarze zgodne z prawdą**

Impact: **HIGH** · Tagi: vite, build-target, css, safari, compat, code · Źródło: vite.config.ts:24-25 / CLAUDE.md sesja 2026-07-24 (esbuild minifikuje CSS, @property/@layer/color-mix ZOSTAJĄ) / site-audit.md §1.1 (komentarz o Lightning CSS mylący) / synthesis D-19, §2.7.1 / vercel.md §14 p.10 · Dodano: 2026-09-12 · Plik: `rules/code-build-target-policy.md`

#### Zasada

1. `vite.config.ts`: `build.target: ["es2019", "safari13"]` i `cssTarget: ["safari13"]` zostają w fazie 1 (D-19). Podniesienie = wpis w `docs/DECISIONS.md` z datą, po publikacji i po potwierdzeniu na realnym iPhonie.
2. Z tego wynika dla CSS pisanego ręcznie (`tokens.css`, `globals.css`, kit): kolory jako hex/`rgba()`/zmienne; zero `color-mix()`, `oklch()`, `@property`, `inset` bez longhandów, `:has()` jako jedyny selektor funkcji krytycznej, `dvh` tylko z fallbackiem `vh`. Utility Tailwinda z przezroczystością `bg-x/12` generują `color-mix()` w v4, więc na kolorach tokenowych używamy tokenów alfa (`--accent-a12`) zamiast `/12`.
3. Vite minifikuje CSS esbuildem (NIE Lightning CSS): `cssTarget` nie transpiluje `oklch`/`color-mix`/`@property`. Komentarz `vite.config.ts:16-23`, który twierdzi inaczej, jest nieprawdziwy i ma zostać poprawiony (nieaktualny komentarz = błąd audytu).
4. JS: patrz `code-tosorted-safari13`.

#### Mechanizm awarii (dlaczego)

Sesja 2026-07-24 udowodniła, że `@property` (57×), `@layer`, `color-mix`, `backdrop-filter` zostają w zbudowanym CSS mimo `cssTarget: safari13`; na iOS 26 to nieszkodliwe, ale to nie jest transpilacja pod stare Safari i nie wolno na niej polegać. Agent czytający fałszywy komentarz w `vite.config.ts` uzna, że może pisać `oklch()` „bo Lightning to przerobi", i wprowadzi regresję, której nie wykryje ani `tsc`, ani `vite build`. Utrzymanie starego targetu ma sens, dopóki nie ma danych z Cloudflare Web Analytics o wersjach WebKit odwiedzających (D-16); do tego czasu decyzja jest ostrożna, nie „modernizacyjna".

#### Niepoprawnie

```ts
// vite.config.ts:16-23 (komentarz niezgodny z prawdą)
/* cssTarget: Lightning CSS transpiluje nowoczesny CSS (oklch, color-mix, skróty typu `inset`) … */
```
```css
.chip-accent { background: color-mix(in oklch, var(--accent) 12%, transparent); }
.hero { inset: 0; }                       /* bez longhandów */
```
```tsx
<div className="bg-accent/12 min-h-dvh" />   {/* color-mix + dvh bez fallbacku */}
```

#### Poprawnie

```ts
/* build.target/cssTarget = kompatybilność składni JS z es2019/safari13 (esbuild).
   CSS minifikuje esbuild: NIE transpiluje oklch/color-mix/@property; pisz hex/rgba + tokeny.
   Decyzja o podniesieniu targetu: docs/DECISIONS.md D-19. */
target: ["es2019", "safari13"], cssTarget: ["safari13"],
```
```css
:root { --accent: #a8b4c2; --accent-a12: rgba(168, 180, 194, .12); }
.chip-accent { background: var(--accent-a12); }
.hero { top: 0; right: 0; bottom: 0; left: 0; }
.content-layer { min-height: 100vh; min-height: 100dvh; }   /* fallback + dvh */
```

#### Test

```bash
grep -nE "target: \[\"es2019\", \"safari13\"\]|cssTarget: \[\"safari13\"\]" site/vite.config.ts   # 2 trafienia
grep -nE "Lightning" site/vite.config.ts                                                            # 0 po poprawce komentarza
grep -rnE "color-mix\(|oklch\(|@property" site/src/styles/tokens.css site/src/styles/globals.css     # 0 (kit: baseline, do przycięcia)
grep -rnoE "\b(bg|text|border)-[a-z]+/[0-9]{1,3}\b" site/src --include=*.tsx                        # 0 (utility alfa generuje color-mix)
grep -rnE "^\s*inset:" site/src/styles/*.css                                                        # 0
# w dist po buildzie: liczba wystąpień w CSS (raport, nie fail; kit w baseline)
grep -oE "color-mix\(|oklch\(" site/dist/assets/*.css | wc -l
```

Severity: HIGH. Zmiana `target`/`cssTarget` bez wpisu w `DECISIONS.md` = do cofnięcia.

#### Wyjątki

Zbudowany CSS kitu (`company-ui.css`) zawiera `@property`/`@layer` z Tailwinda v4 i jest w `--baseline`; przycięcie kitu (−40 %) w fazie 0 zmniejsza tę liczbę, ale zerowanie nie jest wymagane, bo iOS 26 to obsługuje.

### 6.3 code-contact-single-source

**NAP wyłącznie z src/data/contact.ts**

Impact: **HIGH** · Tagi: contact, nap, seo, data, code · Źródło: site-audit.md §3.4 p.3 (stałe kontaktowe w 4 miejscach) / strategy.md B5 (NAP identyczne) / synthesis §2.2 stopka (contact.ts), brand-nap BLOCKER / CLAUDE.md sesja cz. 7 (spójność NAP) · Dodano: 2026-09-12 · Plik: `rules/code-contact-single-source.md`

#### Zasada

Jeden moduł `site/src/data/contact.ts` eksportuje: `ORIGIN = "https://klarow.com"`, `EMAIL = "kontakt@klarow.com"`, `PHONE_DISPLAY = "786 296 426"`, `PHONE_E164 = "+48 786 296 426"` (JSON-LD), `PHONE_HREF = "tel:+48786296426"`, `MAIL_HREF = "mailto:kontakt@klarow.com"`, `AREA = ["PL", "US"]`, `LINKEDIN = { pawel, karol }` (po decyzji D-05), `UODO_ADDRESS` (dla `/rodo`). Konsumują go: `Footer`, `Navbar`, `BookingDialog`, `Seo.tsx` (`ORG_JSONLD`), `prerender/entry.tsx` (shelle, `llms.txt`), `RodoPage`, `pages/Offer`. Literał telefonu, e-maila lub domeny poza `contact.ts` i poza `index.html` (fallback meta, generowany z tych samych wartości w buildzie) jest błędem.

#### Mechanizm awarii (dlaczego)

Dziś te same wartości siedzą w 4 miejscach: `BookingModal.tsx:10-12`, `App.tsx:643`, `Seo.tsx:8,75-76`, `prerender/entry.tsx:18-21`. Są spójne, ale każda zmiana (nowy numer, drugi adres, `sameAs` LinkedIn) to cztery edycje, a rozjazd NAP (Name-Address-Phone) między JSON-LD, stopką a `llms.txt` obniża zaufanie Google do danych organizacji i myli LLM-y cytujące `llms.txt`. `/rodo` musi podać administratora i adres UODO w tej samej formie co reszta strony.

#### Niepoprawnie

```tsx
// BookingModal.tsx:10-12
export const PHONE_DISPLAY = "786 296 426";
export const PHONE_HREF = "tel:+48786296426";
const MAIL = "kontakt@klarow.com";
// App.tsx:643
const EMAIL = "kontakt@klarow.com";
// Seo.tsx:75-76
email: "kontakt@klarow.com", telephone: "+48 786 296 426",
```

#### Poprawnie

```ts
// site/src/data/contact.ts
export const ORIGIN = "https://klarow.com";
export const EMAIL = "kontakt@klarow.com";
export const MAIL_HREF = `mailto:${EMAIL}`;
export const PHONE_DISPLAY = "786 296 426";
export const PHONE_E164 = "+48 786 296 426";
export const PHONE_HREF = "tel:+48786296426";
export const AREA_SERVED = ["PL", "US"] as const;
export const UODO = { name: "Prezes Urzędu Ochrony Danych Osobowych", street: "ul. Stawki 2", city: "00-193 Warszawa" } as const;
```

```tsx
import { EMAIL, MAIL_HREF, PHONE_DISPLAY, PHONE_HREF } from "@/data/contact";
<a href={PHONE_HREF}>{PHONE_DISPLAY}</a> · <a href={MAIL_HREF}>{EMAIL}</a>
```

#### Test

```bash
# literały kontaktu poza contact.ts
grep -rnE "786 ?296 ?426|kontakt@klarow\.com|https://klarow\.com" site/src --include=*.ts --include=*.tsx | grep -v "site/src/data/contact.ts"   # oczekiwane: 0
# w dist: dokładnie 3 dopuszczone warianty telefonu i 1 e-mail, żadnych innych
grep -rhoE "\+?48 ?786 ?296 ?426|786 ?296 ?426|kontakt@klarow\.com" site/dist | sort | uniq -c
# DOCELOWO (skrypt planowany, jeszcze nie istnieje — dziś: NIE SPRAWDZANO): node .claude/skills/klarow-guardian/scripts/check-brand.mjs --nap
```

Severity: HIGH (kod). Wariant NAP w `dist` inny niż `786 296 426` / `+48 786 296 426` / `tel:+48786296426` / `kontakt@klarow.com` = BLOCKER (`code-contact-single-source`, bramka `verify-site.mjs`).

#### Wyjątki

`site/index.html` (szablon Vite) trzyma `og:url`/canonical jako literały, bo nie importuje TS; `prerender.mjs` i tak je podmienia per trasa. `post-bot/` i `leadscout/` są poza `site/` i mają własne źródło (szablony), które audyt porównuje z `contact.ts` ręcznie.

### 6.4 code-effects-hygiene

**Higiena efektów: prymitywne deps, cleanup, useEffectEvent, zero derived-state w efektach**

Impact: **HIGH** · Tagi: hooks, effects, cleanup, strictmode, code · Źródło: RBP:rerender-dependencies, rerender-derived-state-no-effect, rerender-move-effect-to-event, advanced-use-latest, advanced-effect-event-deps, advanced-init-once, client-passive-event-listeners / vercel.md §9.1, §9.3 / site-audit.md §3.1 p.4 (Seo re-run) / synthesis R6 (PageFade bez mutacji ref w renderze) · Dodano: 2026-09-12 · Plik: `rules/code-effects-hygiene.md`

#### Zasada

1. Każdy `useEffect` z subskrypcją (`addEventListener`, `setTimeout`, `setInterval`, `requestAnimationFrame`, `IntersectionObserver`, `ResizeObserver`, `matchMedia`, `animate()`) zwraca cleanup, który to odwołuje.
2. Deps są prymitywne (`user.id`, `isOpen`, `pathname`), nie obiekty ani tablice tworzone w renderze; `Seo.tsx:64` z `jsonLd` (nowa tablica co render w `App.tsx:710`) to dokładnie ten błąd.
3. Wartość wyliczalna z props/state liczona jest w renderze, nie przez `useState` + `useEffect` („derived state w efekcie").
4. Reakcja na akcję użytkownika mieszka w handlerze, nie w `useState(flag)` + `useEffect(if (flag))`.
5. Handler potrzebny w stabilnej subskrypcji owijamy `useEffectEvent` (React 19.2+) i NIE wkładamy go do deps.
6. Inicjalizacja „raz na aplikację" (analytics, sondy) ma guard na poziomie modułu, nie `useEffect(() => init(), [])`; StrictMode w dev montuje dwa razy.
7. Listenery `scroll` / `wheel` / `touch*` z `{ passive: true }`, chyba że wołają `preventDefault()`.
8. Zero mutacji `ref.current` w ciele renderu (StrictMode renderuje podwójnie: `first.current` w `PageFade` psuje logikę „pierwszy montaż"); użyj `useState(() => pathname)` i porównania.

#### Mechanizm awarii (dlaczego)

Brak cleanupu = wyciek listenerów po nawigacji SPA (każde wejście na `/narzedzia/:slug` dokłada `keydown`), podwójne rAF po StrictMode, `IntersectionObserver` obserwujący odmontowane węzły. Obiekt w deps = efekt odpala się co render: `Seo` usuwa i wstawia `<script ld+json>` przy każdym renderze strony (`site-audit.md` §3.1 p.4). Derived state w efekcie = dodatkowy render z nieaktualnym stanem między commitami (miga stara wartość). Efekt reagujący na flagę zamiast handlera gubi zdarzenie przy szybkim podwójnym kliknięciu. Mutacja ref w renderze pod StrictMode ustawia `first.current = false` już w pierwszym (odrzuconym) renderze, więc animacja wejścia nigdy nie gra albo gra podwójnie.

#### Niepoprawnie

```tsx
// Seo.tsx:64: jsonLd to nowa tablica przy każdym renderze rodzica (App.tsx:710)
useEffect(() => { /* wstaw JSON-LD */ }, [title, description, path, jsonLd]);

// derived state w efekcie
const [total, setTotal] = useState(0);
useEffect(() => { setTotal(rows.reduce((s, r) => s + r.cost, 0)); }, [rows]);

// subskrypcja bez cleanupu + handler w deps
useEffect(() => { window.addEventListener("keydown", onKey); }, [onKey]);

// mutacja ref w renderze
const first = useRef(true); if (first.current) { first.current = false; /* … */ }
```

#### Poprawnie

```tsx
// deps prymitywne: serializacja raz, porównanie po stringu
const jsonLdKey = jsonLd ? JSON.stringify(jsonLd) : "";
useEffect(() => { /* wstaw JSON-LD z jsonLdKey */ }, [title, description, path, jsonLdKey]);

// pochodna w renderze
const total = rows.reduce((s, r) => s + r.cost, 0);

// stabilna subskrypcja + cleanup + useEffectEvent
const onKey = useEffectEvent((e: KeyboardEvent) => { if (e.key === "Escape") onClose(); });
useEffect(() => {
  if (!open) return;
  const h = (e: KeyboardEvent) => onKey(e);
  document.addEventListener("keydown", h);
  return () => document.removeEventListener("keydown", h);
}, [open]);

// „pierwszy montaż" bez mutacji ref w renderze
const [initialPath] = useState(() => pathname);
const isFirst = initialPath === pathname;
```

#### Test

```bash
# subskrypcje bez cleanupu (heurystyka: addEventListener/setTimeout/rAF w useEffect bez `return`)
# DOCELOWO (skrypt planowany, jeszcze nie istnieje — dziś: NIE SPRAWDZANO): node .claude/skills/klarow-guardian/scripts/check-code.mjs --effects
# ESLint react-hooks/exhaustive-deps + react-hooks/rules-of-hooks (code-lint-and-tests-gate)
grep -rnE "addEventListener\(\"(scroll|wheel|touch(start|move))\"" site/src | grep -v "passive"   # oczekiwane: 0
grep -rnE "\.current = " site/src --include=*.tsx | grep -vE "useEffect|useLayoutEffect|=>|function"  # kandydaci mutacji w renderze
grep -rnE "useEffect\(\(\) => \{ *(init|zaraz|analytics)" site/src                                   # init w efekcie: 0
```

Severity: HIGH (brak cleanupu, obiekt w deps, mutacja ref w renderze). Derived state / passive: MEDIUM w raporcie.

#### Wyjątki

`useLayoutEffect` do synchronicznego pomiaru wykresów (kit M2) jest dozwolony; cleanup nadal obowiązuje. `useEffect(() => { window.scrollTo(0, 0) }, [pathname])` w `ScrollToTop` nie subskrybuje niczego, więc cleanup nie jest wymagany.

### 6.5 code-lazy-routes-and-dashboards

**Trasy, dashboardy, dialog i pdfmake przez React.lazy / import()**

Impact: **HIGH** · Tagi: bundle, perf, lazy, routes, dashboards, code · Źródło: RBP:bundle-dynamic-imports + bundle-analyzable-paths + bundle-conditional / site-audit.md §1.9, §3.1 p.1 / synthesis §2.4.9 (JS na / ≤ 140 KB gz) / peer-legal.md uzgodnienie 2026-09-12 · Dodano: 2026-09-12 · Plik: `rules/code-lazy-routes-and-dashboards.md`

#### Zasada

Ciężkie i nie-krytyczne moduły ładujemy leniwie z literalną ścieżką: `pages/Tool.tsx` (i każda strona poza `Home`), każdy z 12 dashboardów osobno (mapa `DASHBOARDS` z jawnymi funkcjami `() => import("…")` + `React.lazy` + `Suspense` ze skeletonem kitu), `BookingDialog`, `pdfmake` (`lib/pdf.ts` już lazy), `three` (tylko `pointer: fine`, po idle). Statyczny `import` modułu > 50 KB gz w pliku trasy lub w `App.tsx` = błąd. `import()` zawsze z literalną ścieżką; template literal w `import()` jest zakazany. Faza 1: w `ToolPage.tsx` zmieniamy WYŁĄCZNIE sposób importu dashboardów; wnętrza `lib/pdf.ts`, `dashboards/PdfButton.tsx` i `dashboards/*.tsx` należą do okna c1 (refaktor `pdfDoc.mjs`) i nie są dotykane.

#### Mechanizm awarii (dlaczego)

Dziś `pages/ToolPage.tsx:7-18` importuje 12 dashboardów statycznie, a `App.tsx:36` importuje `ToolPage` statycznie. Skutek zmierzony w `dist` (2026-07-28): główny chunk 511 KB / 157 KB gz zawiera wszystkie dashboardy, `lib/report.ts` i `lib/qualityGate.ts`, więc strona główna, `/oferta` i `/faq` płacą za kod, którego nie renderują. Budżet z synthesis §2.4.9: JS krytyczny na `/` ≤ 140 KB gz, chunk podstrony narzędzia ≤ +60 KB gz. `import()` ze zmienną ścieżką każe Rollupowi spakować cały katalog w jeden chunk albo wygenerować dziesiątki mikro-chunków, a esbuild przestaje widzieć zależności (RBP 2.5).

#### Niepoprawnie

```tsx
// site/src/pages/ToolPage.tsx:7-18
import DemoReport from "@/components/DemoReport";
import ProductionDashboard from "@/components/dashboards/ProductionDashboard";
// ... 10 kolejnych
const DASHBOARDS: Record<DashboardKey, React.ComponentType> = { report: DemoReport, production: ProductionDashboard /* … */ };

// App.tsx:36
import ToolPage from "@/pages/ToolPage";

// zmienna ścieżka: Rollup nie wie, co spakować
const Dash = lazy(() => import("@/components/dashboards/" + name));
```

#### Poprawnie

```tsx
// site/src/pages/Tool.tsx: mapa jawnych funkcji import() (statycznie analizowalna)
import { lazy, Suspense } from "react";
const DASHBOARDS: Record<DashboardKey, React.LazyExoticComponent<React.ComponentType>> = {
  report: lazy(() => import("@/components/DemoReport")),
  production: lazy(() => import("@/components/dashboards/ProductionDashboard")),
  quality: lazy(() => import("@/components/dashboards/QualityGate")),
  // … każdy klucz = osobny chunk
};

// App.tsx: strony leniwe poza Home; Suspense ze skeletonem kitu (.skel), minHeight dla CLS
const ToolPage = lazy(() => import("@/pages/Tool"));
<Route
  path="/narzedzia/:slug"
  element={<Suspense fallback={<div className="skel" style={{ minHeight: 480 }} />}><ToolPage /></Suspense>}
/>
```

Preload na intencję (LOW, RBP 2.6): `onMouseEnter`/`onFocus` na karcie narzędzia → `void import("@/pages/Tool")`.

#### Test

```bash
# 1. statyczne importy dashboardów poza mapą lazy
grep -rnE "^import .* from \"@/components/dashboards/" site/src --include=*.tsx | grep -v "lazy("   # oczekiwane: 0
grep -rnE "^import ToolPage|^import .*pages/Tool" site/src/App.tsx                                    # oczekiwane: 0
# 2. import() ze zmienną ścieżką (template literal albo konkatenacja)
grep -rnE "import\(\s*(\`|\"[^\"]*\"\s*\+)" site/src                                                   # oczekiwane: 0
# 3. budżet: po `npm run build` rozmiar chunków wołanych z dist/index.html
node .claude/skills/klarow-guardian/scripts/verify-site.mjs --budget 140                        # chunk wejściowy ≤ 140 KB gz, CSS ≤ 20 KB, chunk Motion ≤ 36 KB
# PLANOWANE (F3, verify-site.mjs nie zna tego trybu): node .claude/skills/klarow-guardian/scripts/verify-site.mjs --budgets
```

Severity: HIGH. Nowy plik łamiący regułę blokuje merge; dług w `ToolPage.tsx` = pozycja fazy 0.

#### Wyjątki

`Home` i jego sekcje: statyczne (to jest LCP). `motion` (`LazyMotion domAnimation`) ładuje się jako część chunku strony, a features przez `import()`; to zgodne z regułą.

### 6.6 code-no-arbitrary-tailwind-values

**Zero arbitralnych wartości Tailwinda (text-[Npx], bg-[#hex], w-[calc()] kolorów i typografii)**

Impact: **HIGH** · Tagi: tailwind, tokens, typography, design, code · Źródło: CLAUDE.md #1 i „Tailwind tylko layout" / site-audit.md §1.8, §3.4 p.1 (140× text-[Npx]) / synthesis §2.7.1 (`@theme inline` zeruje palety; zero text-[Npx]; zero hexów w TSX) / company-ui app.css:42-43 (skala --fs-*) · Dodano: 2026-09-12 · Plik: `rules/code-no-arbitrary-tailwind-values.md`

#### Zasada

Tailwind v4 służy w tym repo WYŁĄCZNIE do layoutu: `grid`, `flex`, `gap-*`, `items-*`, `justify-*`, `max-w-*`, `px/py` ze skali, `hidden`/`sm:flex`, `overflow-*`. Zakazane są arbitralne wartości w nawiasach dla typografii i kolorów: `text-[12.5px]`, `text-[#b4b4b9]`, `bg-[#171717]`, `border-[#333]`, `from-[#b9c4d1]`, `rounded-[10px]`, `shadow-[…]`, `tracking-[…]`, a także domyślne palety Tailwinda (`text-gray-400`, `bg-zinc-900`, `text-white`). Rozmiar pisma = klasa skali kitu (`.fs-xs … .fs-3xl`) albo utility z `@theme inline` (`text-sm` mapowane na `--fs-sm`). Kolory = klasy kitu/tokeny. `tokens.css` zeruje palety Tailwinda w `@theme inline`, więc `text-gray-400` przestaje istnieć.

#### Mechanizm awarii (dlaczego)

140 wystąpień `text-[Npx]` w `site/src` (11.5–15 px, `site-audit.md` §3.2 p.6) omija skalę typograficzną kitu (`--fs-2xs … --fs-3xl`, komentarz w kicie: „every font-size migrates to these tokens"); rozmiary poniżej 12.5 px łamią czytelność (`design-typography-scale`: tekst UI ≥ .75rem). `Navbar.tsx:64-67` buduje CTA z gradientu `from-[#b9c4d1] via-[#a8b4c2] to-[#96a3b3]`, czyli własny wariant przycisku obok `.btn.btn-primary` (zasada #1: zero własnych wariantów). Arbitralne wartości nie reagują na zmianę tokenów i nie są widoczne dla `audit-contrast.mjs`. Tailwind generuje osobną klasę dla każdej wartości, więc CSS rośnie i staje się nie do przeglądu.

#### Niepoprawnie

```tsx
<span className="text-[15px] font-extrabold leading-snug">…</span>
<p className="text-[12.5px] text-[#b4b4b9]">…</p>
<button className="rounded-full bg-gradient-to-b from-[#b9c4d1] via-[#a8b4c2] to-[#96a3b3] text-[#171717]">Umów</button>
<div className="border border-[#333] bg-[#17171799] backdrop-blur-sm">…</div>
```

#### Poprawnie

```tsx
<span className="fs-md font-bold leading-snug t-heading">…</span>
<p className="fs-sm t-muted">…</p>
<button className="btn btn-primary">Umów 30 minut</button>
<header className="nav">…</header>   {/* .nav w kicie: --surface-overlay + hairline --border, bez blur */}
```

#### Test

```bash
# arbitralne wartości typografii/kolorów/promieni/cieni
grep -rnoE "\b(text|bg|border|from|via|to|rounded|shadow|tracking|leading|ring)-\[[^]]+\]" site/src --include=*.tsx | grep -vE "\b(w|h|min-h|max-w|max-h|grid-cols|gap|top|left|right|bottom|inset|translate|basis|aspect)-\["   # oczekiwane: 0
# domyślne palety Tailwinda
grep -rnoE "\b(text|bg|border)-(white|black|gray|zinc|neutral|slate|stone)(-[0-9]{2,3})?\b" site/src --include=*.tsx   # oczekiwane: 0
# DOCELOWO (skrypt planowany, jeszcze nie istnieje — dziś: NIE SPRAWDZANO): node .claude/skills/klarow-guardian/scripts/check-design.mjs --tailwind-arbitrary
```

Severity: HIGH dla nowych plików i trybu `marketing`; dashboardy przez `--baseline` do migracji (faza 2).

#### Wyjątki

Layout: `w-[calc(100%-2rem)]`, `max-h-[420px]` (wysokość panelu menu), `grid-cols-[1fr_auto]`, `min-h-[100dvh]` są dozwolone (to layout, nie kolor ani pismo). Rozmiary ikon lucide przez prop `size`, nie klasą.

### 6.7 code-no-inline-style-colors

**Zero kolorów, rozmiarów pisma i promieni w style={{ }}; klasy kitu i tokeny**

Impact: **HIGH** · Tagi: tokens, css, inline-style, kit, design, code · Źródło: CLAUDE.md #1 (UI wyłącznie wg company-ui) / company-ui app.css:57 („NEVER re-create these as inline styles") / site-audit.md §3.4 p.1 (455 inline style=, 24× color:var(--heading), 53× var(--muted-foreground)) / synthesis design-tokens-only, §2.5.2 tokens.css · Dodano: 2026-09-12 · Plik: `rules/code-no-inline-style-colors.md`

#### Zasada

W TSX nie ustawiamy przez `style={{ }}` żadnej wartości wizualnej, którą kit albo `tokens.css` wyrażają klasą lub tokenem: `color`, `background`, `borderColor`, `fontSize`, `borderRadius`, `boxShadow`, `fontWeight`. Zamiast tego klasy kitu (`.t-muted`, `.t-heading`, `.icon-box`, `.card`, `.btn`, `.st`) albo utility Tailwinda mapowane na tokeny w `@theme`. Dozwolone w `style`: wartości runtime, których CSS nie zna z góry (`--_progress`, `minHeight` skeletonu z pomiaru, `viewTransitionName`, `gridTemplateColumns` liczone z danych) i wyłącznie przez zmienne CSS `--_x` lub właściwości layoutu. Wyjątek świadomy oznaczamy komentarzem `/* token-exempt: <powód> */` w tej samej linii.

#### Mechanizm awarii (dlaczego)

Stan 2026-09-11: 455 inline `style=` w `site/src` (371 form `style={{`), w tym 24× `style={{ color: "var(--heading)" }}` i 53× `var(--muted-foreground)`; ten sam kwadrat ikony `rgba(168,180,194,.14)` powielony 6× (`App.tsx:220`, `ToolsGrid.tsx:151`, `Differentiators.tsx:171`, `ToolPage.tsx:129,162`, `CollaborationFlow.tsx:97`). Zmiana odcienia akcentu wymaga edycji kilkudziesięciu plików; audyt kontrastu nie widzi kolorów w JSX; `Navbar.tsx` z 12 hexami złamał zasadę #1 (akcent poza kitem). Inline style ma najwyższą specyficzność, więc nadpisuje stany `:hover`/`:focus-visible` kitu, przez co znika fokus na przyciskach.

#### Niepoprawnie

```tsx
<span className="text-[15px] font-extrabold" style={{ color: "var(--heading)" }}>{name}</span>
<div style={{ background: "rgba(168,180,194,.14)", borderRadius: 10, padding: 8 }}><Icon size={18} /></div>
<p style={{ color: "#b4b4b9", fontSize: 12.5 }}>{t.note}</p>
```

#### Poprawnie

```tsx
<span className="t-heading fs-md font-bold">{name}</span>
<div className="icon-box"><Icon size={18} aria-hidden="true" /></div>
<p className="t-muted fs-sm">{t.note}</p>
{/* runtime, przez zmienną: */}
<div className="meter" style={{ ["--_progress" as string]: `${pct}%` }} />
{/* token-exempt: minHeight skeletonu = wysokość zmierzonego dashboardu (CLS) */}
<div className="skel" style={{ minHeight: 480 }} />
```

Klasy `.t-muted`, `.t-heading`, `.icon-box`, `.fs-*` dodajemy do kitu NAD markerem APP-SPECIFIC (`ui-kit/skills/company-ui/assets/app.css`) i kopiujemy do `site/src/styles/company-ui.css` (jedno źródło).

#### Test

```bash
# kolory/rozmiary/promienie w inline style (bez linii z token-exempt)
grep -rnE "style=\{\{[^}]*(color|background|border(Color)?|fontSize|borderRadius|boxShadow|fontWeight)\s*:" site/src --include=*.tsx | grep -v "token-exempt"   # oczekiwane: 0
# hex/rgba poza tokens.css i company-ui.css
grep -rnE "#[0-9a-fA-F]{3,8}\b|rgba?\(" site/src --include=*.tsx | grep -v "token-exempt"   # oczekiwane: 0
# DOCELOWO (skrypt planowany, jeszcze nie istnieje — dziś: NIE SPRAWDZANO): node .claude/skills/klarow-guardian/scripts/check-design.mjs --inline-style
```

Severity: HIGH dla nowych plików i plików trybu `marketing`; migracja 455 wystąpień w dashboardach = dług fazy 2 (synthesis backlog p.9), raportowany z `--baseline`.

#### Wyjątki

`dashboards/*.tsx` do czasu migracji (baseline). SVG generowane z danych (`CollaborationFlow`, `KsefFlow`, wykresy): `fill`/`stroke` jako `var(--accent)` w atrybutach SVG są dozwolone (to nie `style`).

### 6.8 code-no-runtime-errors

**Zero błędów runtime na produkcji: pusty #root nigdy, konsola czysta na każdej trasie, granice błędów wokół tła, mediów i dashboardów**

Impact: **HIGH** · Tagi: code, runtime, error-boundary, resilience, mobile · Źródło: CLAUDE.md 2026-07-23 (BgBoundary: awaria WebGL zdejmowała CAŁE drzewo Reacta, zostawała czerń) i 2026-07-24 (canvas tylko na desktopie), 2026-07-22 (stary index.html z cache → assety 404 → samonaprawiający reload) / synthesis §2.7.2 (bramka zrzutów: `pageerror`, pusty `#root`) / scripts/screenshots.mjs · Dodano: 2026-09-12 · Plik: `rules/code-no-runtime-errors.md`

#### Zasada

1. Na każdej trasie, w obu viewportach (390 i 1440) i w obu trybach ruchu
   (`prefers-reduced-motion` normal i reduce), po `load` + 1,5 s: **zero** zdarzeń `pageerror`
   i zero `console.error`; `#root` ma dzieci. Pusty `#root` po starcie JS = treść znika
   (biała/czarna strona) i jest traktowany jako BLOCKER, nie jako usterka kosmetyczna.
2. **Każda warstwa ozdobna i każdy ciężki moduł ma własną granicę błędu**: tło (`BgBoundary`
   wokół WebGL/canvasu), media (`MediaBoundary` wokół `<video>`), dashboardy i `pdfmake`
   (granica wokół `React.lazy`). Awaria warstwy zdejmuje TĘ warstwę (fallback: statyczny
   gradient, poster, komunikat z przyciskiem ponów), nigdy drzewo strony.
3. `React.lazy` + `import()` zawsze w parze z `Suspense` i granicą błędu: nieudane pobranie
   chunku po wdrożeniu (stary HTML z cache, nowe hashe) kończy się jednorazowym
   `location.reload()` pod strażą `sessionStorage`, nie pętlą przeładowań.
4. Kod shellu prerenderu nie dotyka `window`/`document` w trakcie renderu
   (`motion-no-motion-in-prerender`); `useEffect` z dostępem do API przeglądarki ma `try/catch`
   tam, gdzie API bywa zablokowane (`localStorage` w trybie prywatnym, WebGL w Lockdown Mode).
5. Błędów nie wycisza się `console.error = () => {}` ani pustym `catch {}` bez fallbacku:
   albo obsługa z widocznym skutkiem, albo komentarz `// świadomie ignorowane: <powód>`.
6. Znalezisko z audytu: pusty `#root` albo wyjątek blokujący treść = BLOCKER (push wstrzymany);
   pojedynczy `console.error` bez utraty treści = HIGH z terminem naprawy.

#### Mechanizm awarii (dlaczego)

- Tak wyglądał najdroższy bug w historii tego projektu: wyjątek w tle WebGL nie miał granicy,
  React zdejmował całe drzewo, `#root` był pusty, a telefon pokazywał „samo tło" (CLAUDE.md
  2026-07-23/24). Lokalnie i w Playwright było zielono, bo tam WebGL działa: bez bramki na
  zrzutach z prawdziwego silnika nikt tego nie zobaczy przed klientem.
- Cloudflare Pages buduje z innymi hashami niż build lokalny; urządzenie ze starym HTML w cache
  prosi o nieistniejące chunki (404), `import()` rzuca, a SPA-fallback oddaje HTML zamiast JS.
  Bez jednorazowego reloadu i granicy użytkownik zostaje z pustą stroną na zawsze.
- Konsola pełna błędów maskuje nowe: „to stary błąd, ignorujemy" to początek każdej awarii
  produkcyjnej. Zero tolerancji jest tańsze niż triage.
- Strona jest dowodem produktowym („kalkulator, nie wróżka"): pusty ekran u CFO kosztuje więcej
  niż brak animacji tła. Dlatego fallback zawsze pokazuje treść, a nie ładny komunikat o błędzie.

#### Niepoprawnie

```tsx
<GLSLHills />                                  {/* brak granicy: wyjątek zdejmuje całą stronę */}
const Dash = lazy(() => import("./dashboards/" + key));   // dynamiczna ścieżka + brak granicy i Suspense
try { JSON.parse(raw); } catch {}               // cisza bez fallbacku
console.error = () => {};                       // wyciszenie zamiast naprawy
useEffect(() => { document.querySelector("#hero").scrollIntoView(); }, []);  // null w shellu → TypeError
```

#### Poprawnie

```tsx
<BgBoundary fallback={<div className="bg-layer" aria-hidden />}>
  <GLSLHills />
</BgBoundary>

<ErrorBoundary fallback={<PanelError onRetry={retry} />}>
  <Suspense fallback={<DashboardSkeleton minHeight={420} />}>
    <Dashboard />          {/* React.lazy(() => import("./dashboards/QualityGate")) — literalna ścieżka */}
  </Suspense>
</ErrorBoundary>
```

```html
<!-- index.html: jednorazowa samonaprawa po zmianie hashy (sessionStorage-guard) -->
<script>
  addEventListener("error", function (e) {
    var t = e.target;
    if (!t || (t.tagName !== "SCRIPT" && t.tagName !== "LINK")) return;
    try { if (sessionStorage.getItem("klarow:reloaded")) return; sessionStorage.setItem("klarow:reloaded", "1"); } catch (_) { return; }
    location.reload();
  }, true);
</script>
```

#### Test

```bash
# zrzuty w prawdziwym WebKicie: pageerror / console.error / pusty #root na każdej trasie
node ".claude/skills/klarow-guardian/scripts/screenshots.mjs" --out ".claude/work/audit/shots" | grep -E "code-no-runtime-errors|Σ"
# granice błędów istnieją tam, gdzie są warstwy ozdobne i lazy
grep -rn "GLSLHills\|<video\|lazy(" site/src --include=*.tsx | grep -v "Boundary" | grep -v "Suspense"
# zero wyciszania błędów
grep -rnE "console\.(error|warn)\s*=|catch\s*\(\s*\)\s*\{\s*\}" site/src --include=*.ts --include=*.tsx
```

DevTools na produkcji (mobile + desktop): zakładka Console pusta po twardym odświeżeniu;
`document.getElementById("root").children.length > 0`.

#### Wyjątki

Ostrzeżenia (`console.warn`) z React DevTools i z trybu deweloperskiego Vite nie liczą się
(bramka czyta wyłącznie build produkcyjny z `site/dist`). Celowo zgłoszony błąd w teście
granicy (`throw` w komponencie testowym pod flagą `?boom=1`) jest dozwolony poza produkcją.

### 6.9 code-single-source-copy

**Jedno źródło copy: data/*.ts konsumowane przez React i shelle prerendera**

Impact: **HIGH** · Tagi: data, prerender, seo, copy, i18n, code · Źródło: site-audit.md §3.4 p.4 (dwa źródła copy: App.tsx vs entry.tsx) / synthesis §2.8 p.2 (shelle z danych), S5 (bramka shell-vs-DOM), §2.7.2 (data/home.ts, oferta.ts, founders.ts, messaging.ts) / strategy.md T6, T12 · Dodano: 2026-09-12 · Plik: `rules/code-single-source-copy.md`

#### Zasada

Każdy tekst widoczny na stronie mieszka w module `site/src/data/*.ts` jako obiekt `{ pl, en }` (`messaging.ts`, `home.ts`, `oferta.ts`, `founders.ts`, `tools.ts`, `toolsSeo.ts`, `faq.ts`, `pagesSeo.ts`, `contact.ts`). Komponenty React i shelle prerendera w `src/prerender/entry.tsx` importują te same moduły; w `entry.tsx` nie ma ręcznie pisanej prozy ani duplikatów stałych (`ORIGIN`, `EMAIL`, `PHONE_*` z `contact.ts`). Stałe copy w komponentach (`const HERO = { pl, en }` w `App.tsx`) są zakazane poza mikro-etykietami samego komponentu (`aria-label` ikony, „Zamknij"). Zmiana zdania = zmiana w jednym pliku; shell i DOM po starcie Reacta zawierają identyczny zbiór H1/H2/akapitów.

#### Mechanizm awarii (dlaczego)

Dziś sekcje React (`App.tsx`: `HERO`, `CAPS`, `PROOF`, `PAIN`, `OFFER`, `HOME_NEXT`, `FOOT`) i shelle prerendera (`entry.tsx:103-417`, ręczna proza PL + skrót EN) to dwa osobne źródła. Przykład: bullety oferty `App.tsx:405-410` vs `entry.tsx:257-263`, lead hero `App.tsx:100-102` vs `entry.tsx:110-115` (inne brzmienie). Google indeksuje DOM po JS, ale snippet i cache pochodzą z HTML; użytkownik i crawler czytają dwie wersje jednego zdania, a każda zmiana copy wymaga dwóch edycji i zwykle jedna jest pomijana. Dwie wersje = dwa miejsca, w których może pojawić się liczba spoza `allowedNumbers` albo nazwa poprzedniej firmy.

#### Niepoprawnie

```tsx
// App.tsx (sekcja React)
const HERO = { pl: { h1: "Narzędzia pod Twój proces…", lead: "Kontroling, integracje…" }, en: { … } };

// prerender/entry.tsx (shell pisany ręcznie, inne słowa)
function HomeShell() { return <main><h1>Automatyzacja danych dla firm 20–250 osób…</h1><p>…</p></main>; }
```

#### Poprawnie

```ts
// site/src/data/home.ts
import { MESSAGING } from "./messaging";
export const HOME = {
  hero: { h1: MESSAGING.oneLiner, lead: MESSAGING.subtext, primary: MESSAGING.cta.primary, secondary: MESSAGING.cta.secondary },
  outcomes: { title: { pl: "Co osiągniesz", en: "What you gain" }, items: [ /* { icon, title: {pl,en}, line: {pl,en} } */ ] },
} as const;
```

```tsx
// components/Hero.tsx (React) i prerender/entry.tsx (HomeShell) importują ten sam HOME:
const t = pick(lang, HOME.hero.h1);            // React
<h1>{HOME.hero.h1.pl}</h1>                     // shell (PL kanoniczne) + sekcja lang="en" z HOME.hero.h1.en
```

#### Test

```bash
# stałe copy w komponentach (obiekt { pl: { … }, en: { … } } poza data/)
grep -rnE "^const [A-Z_]+ = \{\s*$|^const [A-Z_]+ = \{ pl:" site/src --include=*.tsx | grep -v "site/src/data/"   # oczekiwane: 0 (poza mikro-etykietami `T` w dashboardach: baseline)
# ręczna proza w shellach: akapity z literałami zamiast pick/data
grep -nE "<(h1|h2|p)>[A-ZŻŹĆĄŚĘŁÓŃ][^<{]{20,}</" site/src/prerender/entry.tsx   # oczekiwane: 0
# duplikaty stałych kontaktowych
grep -rnE "^const (ORIGIN|EMAIL|PHONE_DISPLAY|PHONE_HREF) =" site/src | grep -v "data/contact.ts"   # oczekiwane: 0
# bramka shell-vs-DOM (faza 3): zbiory H1/H2/p identyczne
# PLANOWANE (F3, verify-site.mjs nie zna tego trybu): node .claude/skills/klarow-guardian/scripts/verify-site.mjs --shell-vs-dom / /narzedzia
```

Severity: HIGH. Nowa sekcja bez wpisu w `data/*.ts` = do naprawy przed merge.

#### Wyjątki

Etykiety wewnętrzne dashboardów (`const T = { pl, en }` w `dashboards/*.tsx`) zostają przy komponencie (tryb `tool`, nie są w shellu). `aria-label` i teksty przycisków ikonowych mogą żyć przy komponencie, ale nadal jako `{ pl, en }`.

### 6.10 code-tosorted-safari13

**[...a].sort() zamiast toSorted(); zero metod nowszych niż safari13 bez polyfilla**

Impact: **HIGH** · Tagi: build-target, safari, compat, js, code · Źródło: RBP:js-tosorted-immutable (+ uwaga vercel.md §3.7 o safari13) / vite.config.ts build.target ["es2019","safari13"] / synthesis D-19 (cssTarget safari13 zostaje w fazie 1) / CLAUDE.md sesja 2026-07-24 (esbuild nie polyfilluje) · Dodano: 2026-09-12 · Plik: `rules/code-tosorted-safari13.md`

#### Zasada

Immutability przy sortowaniu props/state realizujemy przez `[...arr].sort(cmp)` (kopia + sort), nie `arr.toSorted(cmp)`. Ta sama zasada dla pozostałych metod spoza `es2019`: `Array.prototype.at`, `toReversed`, `toSpliced`, `with`, `findLast`, `Object.hasOwn`, `structuredClone`, `Array.prototype.flat` jest OK (ES2019), `String.prototype.replaceAll` NIE (ES2021), `Promise.any`, `AggregateError`, `WeakRef`. Dopóki `vite.config.ts` ma `build.target: ["es2019", "safari13"]`, każde użycie takiej metody wymaga albo zamiennika, albo jawnego polyfilla w `main.tsx` z komentarzem. Zmiana targetu = decyzja D-19 po publikacji, nie decyzja agenta.

#### Mechanizm awarii (dlaczego)

esbuild transpiluje SKŁADNIĘ (optional chaining, `??`, klasy) do targetu, ale NIE polyfilluje METOD: `toSorted` (Safari 16+), `at` (Safari 15.4+), `structuredClone` (Safari 15.4+), `replaceAll` (Safari 13.1+) przechodzą do bundla bez zmian i rzucają `TypeError: x.toSorted is not a function` na starszym WebKicie. Objaw dla użytkownika to pusty `#root` (React zdejmuje drzewo po wyjątku w renderze), czyli dokładnie „strona tylko z tłem", którą Karol widział na iPhonie w lipcu 2026. Reguła Vercela `js-tosorted-immutable` zakłada nowoczesny target; u nas jej literalne zastosowanie psuje produkcję.

#### Niepoprawnie

```ts
const view = rows.toSorted((a, b) => a.cost - b.cost);   // TypeError na Safari < 16
const last = rows.at(-1);                                 // TypeError na Safari < 15.4
const copy = structuredClone(state);                      // ReferenceError na Safari < 15.4
const clean = s.replaceAll(",", ".");                     // ES2021
```

#### Poprawnie

```ts
const view = [...rows].sort((a, b) => a.cost - b.cost);  // kopia + sort; rows nietknięte
const last = rows[rows.length - 1];
const copy = JSON.parse(JSON.stringify(state)) as State;  // dane dem są czystym JSON-em
const clean = s.replace(/,/g, ".");                        // RegExp hoistowany poza pętlę (RBP 7.10)
```

Sortowanie w miejscu jest dozwolone tylko na tablicy lokalnej utworzonej w tej samej funkcji (silniki `lib/**`), nigdy na props/state.

#### Test

```bash
grep -rnE "\.(toSorted|toReversed|toSpliced|findLast|findLastIndex|replaceAll)\(|\.at\(-?[0-9]|structuredClone\(|Object\.hasOwn\(|Promise\.any\(|new WeakRef\(" site/src --include=*.ts --include=*.tsx --include=*.mjs   # oczekiwane: 0
# sort w miejscu na props/state (heurystyka: sort( bez spreadu w tej samej linii)
grep -rnE "\b(props|state|rows|items|tools|data)\.[a-zA-Z_.]*sort\(" site/src --include=*.tsx | grep -v "\[\.\.\."   # przegląd ręczny
grep -nE "target: \[\"es2019\", \"safari13\"\]" site/vite.config.ts   # oczekiwane: 1
```

Severity: HIGH (metoda bez polyfilla = wyjątek na realnym urządzeniu). Auto-fix dozwolony dla `toSorted` → `[...a].sort` i `at(-1)`.

#### Wyjątki

`scripts/*.mjs` i `.claude/skills/klarow-guardian/scripts/*.mjs` działają w Node 24 (nie w przeglądarce): `toSorted`, `at`, `structuredClone` są tam dozwolone. Po podniesieniu targetu (D-19) reguła zwęża się do listy metod nowszych niż nowy target.

### 6.11 code-file-size-cap

**Plik komponentu ≤ 300 linii; App.tsx rozbity na pages/ + data/ + layout/**

Impact: **MEDIUM** · Tagi: architecture, file-size, refactor, code · Źródło: site-audit.md §3.4 p.5 (App.tsx 845 linii god-file) / synthesis §2.7.2 (App.tsx ~150 l.; pages/Home Tools Tool Offer Faq Privacy NotFound) / vercel.md §9.4 KL:file-size / zadanie strażnika (limit 300) · Dodano: 2026-09-12 · Plik: `rules/code-file-size-cap.md`

#### Zasada

Plik `.tsx` w `site/src/components/**` i `site/src/pages/**` ma ≤ 300 linii (liczone po sformatowaniu, bez pustych na końcu). `App.tsx` = wyłącznie routing, layout (`Navbar`/`Footer`/`PageMain`/`SkipLink`), `ScrollToTop`, lazy strony i `BookingDialog` (~150 linii). Sekcje home to osobne komponenty (`Hero`, `Bento`, `CaseFrames`, `Outcomes`, `MetricsStrip`, `Steps`, `Contrast`, `Founders`, `ClosingCta`), a ich copy siedzi w `data/home.ts` (`code-single-source-copy`). Plik danych (`data/*.ts`) i silnik (`lib/*.ts`) nie mają limitu linii, ale mają limit odpowiedzialności: jeden moduł = jedno źródło (tools, toolsSeo, faq, messaging).

#### Mechanizm awarii (dlaczego)

`App.tsx` ma 845 linii: 11 obiektów i18n, 12 komponentów sekcji, 4 strony, routing, stopkę, `PageMain` i modal w jednym pliku. Skutki: (1) `React.lazy` stron jest niemożliwy, bo wszystko jest w jednym module (`code-lazy-routes-and-dashboards`); (2) każdy agent edytujący hero ładuje do kontekstu 845 linii i ryzykuje kolizję z równoległą edycją stopki; (3) `git diff` sekcji jest nieczytelny; (4) `rerender-no-inline-components` (RBP 5.4, HIGH) łatwo złamać, definiując helper renderujący wewnątrz komponentu-giganta. Dashboardy (`QualityGate.tsx` 378, `TaskTimeline.tsx` 324, `ProductionDashboard.tsx` 312, `DemoReport.tsx` 524) przekraczają limit, ale są w `--baseline` do czasu refaktoru okna c1 (nie dotykać w fazie 1).

#### Niepoprawnie

```
site/src/App.tsx          845 linii: HERO/CAPS/PROOF/PAIN/OFFER/FOOT + Hero + Capabilities + ProofBand + Pain + … + HomePage/ToolsPage/OfferPage/FaqPage + Footer + PageMain + ScrollToTop + App
```

#### Poprawnie

```
site/src/App.tsx            ~150   routing + lazy pages + layout + BookingDialog
site/src/pages/Home.tsx     ~120   składa sekcje z data/home.ts
site/src/components/Hero.tsx, Bento.tsx, Outcomes.tsx, MetricsStrip.tsx, Steps.tsx, Contrast.tsx, Founders.tsx, ClosingCta.tsx   każdy ≤ 150
site/src/components/layout/Navbar.tsx, Footer.tsx, PageMain.tsx, SkipLink.tsx
site/src/data/home.ts, oferta.ts, founders.ts, messaging.ts, contact.ts
```

#### Test

```bash
# pliki komponentów/stron > 300 linii (bez dashboardów w baseline)
find site/src/components site/src/pages -name "*.tsx" -not -path "*/dashboards/*" -not -name "DemoReport.tsx" | xargs wc -l | awk '$1 > 300 && $2 != "total" {print "FAIL", $0}'
wc -l site/src/App.tsx   # cel: ≤ 200 po fazie 0
# komponenty definiowane wewnątrz komponentów (RBP 5.4): funkcja z JSX wewnątrz innej funkcji z JSX
# DOCELOWO (skrypt planowany, jeszcze nie istnieje — dziś: NIE SPRAWDZANO): node .claude/skills/klarow-guardian/scripts/check-code.mjs --inline-components
```

Severity: MEDIUM (raport); `App.tsx` > 300 po fazie 0 = pozycja do naprawy w planie, nie ticket odległy.

#### Wyjątki

`dashboards/*.tsx` i `DemoReport.tsx` (baseline, własność okna c1 w fazie 1). `prerender/entry.tsx` może przekraczać 300 linii, dopóki shelle nie zostaną przepisane na dane; po fazie 3 obowiązuje ten sam limit (shelle w osobnych plikach `prerender/shells/*.tsx`).

### 6.12 code-memo-policy

**Polityka memoizacji: decyzja o React Compiler; do tego czasu useMemo tylko z pomiarem**

Impact: **MEDIUM** · Tagi: rerender, memo, react-compiler, perf, code · Źródło: RBP:rerender-memo, rerender-simple-expression-in-memo, rerender-memo-with-default-value, rerender-split-combined-hooks / vercel.md §3.5, §14 p.8 / synthesis D-18 (React 19.3 = faza 2) · Dodano: 2026-09-12 · Plik: `rules/code-memo-policy.md`

#### Zasada

1. Decyzja founderów (pozycja w `docs/DECISIONS.md`; rekomendacja: włączyć `babel-plugin-react-compiler` w Vite razem z upgrade do React 19.3 w fazie 2). Do tej decyzji obowiązuje punkt 2.
2. `useMemo` / `useCallback` / `memo` dodajemy WYŁĄCZNIE z komentarzem `/* memo: <pomiar> */` wskazującym, co zmierzono (React Profiler, `console.time`, liczba wierszy). Bez pomiaru: liczymy w renderze. Nigdy `useMemo` dla prostego wyrażenia z prymitywnym wynikiem (`a || b`, `x > 0`, konkatenacja). Komponent w `memo()` nie może mieć domyślnych propsów-obiektów ani funkcji (`{ onX = () => {} }`); domyślne wartości nie-prymitywne wynosimy do stałych modułu. Jeden `useMemo` = jedna niezależna zależność; `filter` i `sort` z różnymi deps rozdzielamy.
3. Po włączeniu React Compiler: ręczne `memo` / `useMemo` / `useCallback` usuwamy z komponentów (kompilator je generuje); zostają tylko w silnikach `lib/**` jako zwykłe cache'e funkcji (tam kompilator nie działa).

#### Mechanizm awarii (dlaczego)

`useMemo` bez pomiaru to koszt (alokacja tablicy deps + porównanie) bez zysku; z 16 wystąpień w `site/src` część liczy silniki `lib/report.ts` (uzasadnione), część owija proste wyrażenia. `memo()` z domyślnym obiektem tworzy nową referencję co render i memoizacja nigdy nie trafia (RBP 5.5). Połączony `useMemo` z `filter + sort` i 3 deps przelicza sortowanie przy każdej zmianie filtra (RBP 5.9). React Compiler rozwiązuje to automatycznie, ale to zmiana pipeline'u Babel w Vite i zależność w RC; dlatego decyzja, nie domyślne włączenie.

#### Niepoprawnie

```tsx
const isEmpty = useMemo(() => rows.length === 0, [rows]);                  // prymityw, zbędne
const Row = memo(function Row({ onSelect = () => {} }: RowProps) { /* … */ }); // nowa funkcja co render
const view = useMemo(() => rows.filter(matches(q)).sort(byDate), [rows, q, sortKey]); // 2 zadania, 3 deps
```

#### Poprawnie

```tsx
const isEmpty = rows.length === 0;
const NOOP = () => {};
const Row = memo(function Row({ onSelect = NOOP }: RowProps) { /* … */ });
/* memo: ContractRegister, 1 200 wierszy, filtr 38 ms → 4 ms (Profiler 2026-09) */
const filtered = useMemo(() => rows.filter(matches(q)), [rows, q]);
const view = useMemo(() => [...filtered].sort(byKey(sortKey)), [filtered, sortKey]);
```

#### Test

```bash
# useMemo/useCallback bez komentarza pomiaru w tej samej lub poprzedniej linii
grep -rnB1 -E "use(Memo|Callback)\(" site/src --include=*.tsx | grep -vE "memo:" | grep -E "use(Memo|Callback)\("
# proste wyrażenia w useMemo
grep -rnE "useMemo\(\(\) => [a-zA-Z_.]+ (\|\||&&|===|>|<) " site/src
# memo() z domyślnym obiektem/funkcją
grep -rnE "memo\(function [A-Za-z]+\(\{[^}]*= (\(\)|\{|\[)" site/src
```

Severity: MEDIUM (raport). Po decyzji o React Compiler audyt zmienia się w „zero ręcznego memo w komponentach".

#### Wyjątki

Silniki `lib/**`: cache w `Map` na poziomie modułu jest OK (RBP 7.4). Dashboardy w trybie `tool` z tabelami > 500 wierszy: `memo` na wierszu tabeli dozwolone z pomiarem.

### 6.13 code-no-dead-code

**Zero martwego kodu w repo: zapas = osobna gałąź, nie plik w src**

Impact: **MEDIUM** · Tagi: dead-code, dependencies, hygiene, git, code · Źródło: site-audit.md §3.5 (897 linii martwych ui/*, 5 zależności, content/, data/, placeholder.svg, Logo.zip, zoomRef, sondy decka) / synthesis F0 (usunięcie martwego kodu i 6 zależności), §2.6.3 (GLSL Hills jako plan B) / CLAUDE.md „Zapas (nieużywane, poza bundlem)" · Dodano: 2026-09-12 · Plik: `rules/code-no-dead-code.md`

#### Zasada

W `site/src` nie ma plików, których nikt nie importuje, ani eksportów, których nikt nie używa; w `site/package.json` nie ma zależności, których nie importuje żaden plik w `src/`. Kod „na zapas" (karuzela orbitalna, `canvas-reveal-effect`, shadcn `ui/button|badge|card`) trzymamy w gałęzi `zapas/<nazwa>` w gicie (albo tagu), nie w `main`. Nieaktualne komentarze i copy (`Seo.tsx:6` „Sitemap: public/sitemap.xml", `BookingModal.tsx:30,48` „Rezerwacja online pojawi się wraz z uruchomieniem domeny", `Differentiators.tsx:26,97` „zobacz w demie powyżej", sondy `.deck/.slide` w `index.html:88-104,160-171`, prop `zoomRef`) traktujemy jak martwy kod: do usunięcia w tym samym PR, w którym się je zauważy. Plan B tła (GLSL Hills) jest jedynym „zapasem" dopuszczonym w `main` do decyzji D-08, z komentarzem `/* plan B: D-08 */` i bez importu w `App.tsx`, jeśli wideo przejdzie.

#### Mechanizm awarii (dlaczego)

Stan 2026-09-11: 897 linii w `components/ui/{button,badge,card,canvas-reveal-effect,radial-orbital-timeline}.tsx` importowanych wyłącznie nawzajem; 5 zależności (`@react-three/fiber`, `@radix-ui/react-slot`, `class-variance-authority`, `clsx`, `tailwind-merge`) + `lib/utils.ts` używane tylko przez te pliki; katalogi `content/` i `data/` (YAML) z 0 referencji, `site/README.md` opisujący nieistniejący model. Martwy kod myli agentów (7× `forwardRef`, 4× `transition-all` w plikach, które „są w repo, więc chyba obowiązują"), zawyża `npm install` i skan bezpieczeństwa, a nieaktualne komentarze prowadzą do błędnych decyzji (`vite.config.ts:16-23` o Lightning CSS). Reguła CLAUDE.md o „zapasie poza bundlem" była kompromisem z lipca; po decyzjach o karuzeli (usunięta 07-22) i decku (usunięty 07-26) zapas nie ma już celu.

#### Niepoprawnie

```
site/src/components/ui/radial-orbital-timeline.tsx   415 l., 0 importerów, 4× transition-all
site/package.json: "@react-three/fiber", "clsx", "tailwind-merge"   (0 importów w src)
site/content/modules/*.yml                            0 referencji
/* Sitemap: public/sitemap.xml (aktualizuj przy dodaniu narzędzia!) */   ← sitemap jest generowany
```

#### Poprawnie

```bash
git switch -c zapas/radial-orbital-timeline && git mv site/src/components/ui/radial-orbital-timeline.tsx … && git commit -m "Zapas: karuzela orbitalna poza main"
git switch main && git rm -r site/src/components/ui/{button,badge,card,canvas-reveal-effect,radial-orbital-timeline}.tsx site/src/lib/utils.ts site/content site/data site/public/screens/placeholder.svg Logo.zip
npm uninstall @react-three/fiber @radix-ui/react-slot class-variance-authority clsx tailwind-merge   # w site/
```

#### Test

```bash
# pliki bez importerów (heurystyka: nazwa pliku nie występuje w żadnym import poza samym sobą)
# DOCELOWO (skrypt planowany, jeszcze nie istnieje — dziś: NIE SPRAWDZANO): node .claude/skills/klarow-guardian/scripts/check-code.mjs --dead-files
# zależności bez importu w src
for d in $(node -e "console.log(Object.keys(require('./site/package.json').dependencies).join(' '))"); do grep -rqE "from \"$d(/|\")" site/src || echo "UNUSED dep: $d"; done
# nieaktualne komentarze/copy z listy audytu
grep -rnE "public/sitemap\.xml|uruchomieniem domeny|w demie powyżej|Lightning CSS|zoomRef|\.slide\.active" site/src site/index.html site/vite.config.ts   # oczekiwane: 0
test ! -d site/content && test ! -d site/data && echo "OK: brak YAML"
```

Severity: MEDIUM (raport); nowy plik bez importera w PR = do usunięcia przed merge.

#### Wyjątki

`components/ui/glsl-hills.tsx` + `BgBoundary.tsx` do decyzji D-08 (plan B). `types/pdfmake.d.ts` (deklaracje, nie import). Skrypty w `scripts/` i `.claude/**` (nie są importowane, są uruchamiane).

### 6.14 code-no-forwardref-react19

**React 19: ref jako zwykły prop, zero forwardRef**

Impact: **MEDIUM** · Tagi: react19, refs, composition, code · Źródło: CP:react19-no-forwardref / vercel.md §4, §13 / synthesis §2.7.1 (React 19.2.7 w fazie 1, 19.3.0 = faza 2) · Dodano: 2026-09-12 · Plik: `rules/code-no-forwardref-react19.md`

#### Zasada

W `site/src/**` nie używamy `React.forwardRef` ani `forwardRef`. Od React 19 `ref` jest zwykłym propem: komponent przyjmuje `ref` w destrukturyzacji propsów i przekazuje go dalej. Dotyczy React 19.2.7 (faza 1) i 19.3.0 (faza 2); obie wersje mają ten sam mechanizm. Nowy plik z `forwardRef` = błąd audytu; istniejące wystąpienia (7 w martwych `components/ui/*`) znikają razem z martwym kodem (patrz `code-no-dead-code`).

#### Mechanizm awarii (dlaczego)

`forwardRef` w React 19 jest warstwą kompatybilności: dodaje opakowanie komponentu (dodatkowa ramka w drzewie i w React DevTools), psuje czytelność typów (`ForwardRefExoticComponent` zamiast zwykłej funkcji) i utrwala wzorzec z shadcn, którego kit `company-ui` nie potrzebuje. React ostrzega, że `forwardRef` zostanie wycofany w kolejnej wersji głównej; kod pisany dziś wg starego API to gwarantowany refaktor. Dodatkowo `forwardRef` + `memo` + domyślne obiekty w propsach to trzy warstwy, w których łatwo zepsuć memoizację (RBP 5.5).

#### Niepoprawnie

```tsx
// site/src/components/ui/card.tsx:5 (martwy plik, wzorzec z shadcn)
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("card", className)} {...props} />
);
Card.displayName = "Card";
```

#### Poprawnie

```tsx
// ref jako prop; typ jawny, komponent to zwykła funkcja
type CardProps = React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> };

export function Card({ ref, className, ...props }: CardProps) {
  return <div ref={ref} className={["card", className].filter(Boolean).join(" ")} {...props} />;
}
```

#### Test

```bash
# 0 trafień poza martwymi plikami (po ich usunięciu: 0 w całym src)
grep -rnE "forwardRef" site/src --include=*.tsx --include=*.ts
# ESLint (po włączeniu, patrz code-lint-and-tests-gate): reguła własna
# no-restricted-syntax dla CallExpression[callee.property.name="forwardRef"]
```

Severity: MEDIUM. Auto-fix dozwolony (krok „fixer" po zatwierdzeniu planu): zamiana mechaniczna `forwardRef((props, ref) => …)` → `function X({ ref, ...props })`.

#### Wyjątki

Biblioteki zewnętrzne w `node_modules` (nie audytujemy). Komponenty klasowe nie występują w projekcie; gdyby powstały, `ref` na klasie działa jak dotąd.

### 6.15 code-state-in-url

**Stan nawigacyjny (filtry hubu, zakładki, rozwinięte panele) w URL, nie w useState**

Impact: **MEDIUM** · Tagi: router, url, state, hub, seo, code · Źródło: WIG „Navigation & State" (URL reflects state; deep-link) / RBP:rerender-defer-reads / site-audit.md §3.6 p.1 (ToolsGrid chowa 13 linków) / synthesis §2.3 Hub (`?dzial=&typ=`, canonical bez parametrów, D-08 działy = filtry) · Dodano: 2026-09-12 · Plik: `rules/code-state-in-url.md`

#### Zasada

Stan, który użytkownik chciałby udostępnić, cofnąć przyciskiem „wstecz" albo odświeżyć, żyje w URL: filtr działu i typu na hubie `/narzedzia` (`?dzial=kontroling&typ=demo`), aktywna zakładka dashboardu w trybie `tool` (`?tab=`), rozwinięty panel FAQ (`#faq-cena`). Czytamy go przez `useSearchParams` z `react-router-dom` (tylko gdy render zależy od parametru; w handlerach `new URLSearchParams(location.search)`), zapisujemy przez `setSearchParams(next, { replace: true })`. Filtr NIGDY nie odmontowuje kart: 13 kart hubu jest zawsze w DOM, filtr dodaje atrybut `hidden`. `rel="canonical"` huba wskazuje `/narzedzia` bez parametrów. Stan UI nieudostępnialny (otwarty dialog, hover, krok kreatora w demie) zostaje w `useState`.

#### Mechanizm awarii (dlaczego)

`ToolsGrid.tsx:67` trzyma wybrany dział w `useState`: po starcie Reacta DOM `/narzedzia` nie ma żadnego linku do 13 podstron (linki pojawiają się po kliknięciu), więc Googlebot z JS widzi inną stronę niż prerender i traci sygnał linkowania wewnętrznego (`site-audit.md` §3.6). Link z LinkedIn „zobacz nasze narzędzia dla finansów" nie da się wysłać, „wstecz" wraca na home zamiast do poziomu działów, odświeżenie kasuje wybór. Odmontowanie kart przy filtrze psuje też prerender (`ToolsShell` ma 13 linków, DOM po JS mniej) i bramkę shell-vs-DOM.

#### Niepoprawnie

```tsx
// ToolsGrid.tsx:67
const [openDept, setOpenDept] = useState<Dept | null>(null);
if (openDept === null) { /* przyciski działów, ZERO linków do narzędzi */ }
const inDept = tools.filter((x) => x.dept === openDept);   // reszta kart nie istnieje w DOM
```

#### Poprawnie

```tsx
import { useSearchParams, Link } from "react-router-dom";
const [params, setParams] = useSearchParams();
const dzial = params.get("dzial");          // null = wszystkie
const typ = params.get("typ");              // "demo" | "case" | null
const setFilter = (next: Record<string, string | null>) =>
  setParams((p) => { const q = new URLSearchParams(p); for (const [k, v] of Object.entries(next)) v ? q.set(k, v) : q.delete(k); return q; }, { replace: true });

{tools.map((t) => (
  <li key={t.slug} hidden={(dzial !== null && t.dept !== dzial) || (typ !== null && t.kind !== typ)}>
    <Link to={`/narzedzia/${t.slug}`}>…</Link>   {/* zawsze w DOM */}
  </li>
))}
```

Chipy filtrów to `<button type="button" aria-pressed={dzial === d.key}>`; `<Seo path="/narzedzia" />` (canonical bez query).

#### Test

```bash
# hub: brak useState dla działu/typu, jest useSearchParams
grep -nE "useState<Dept|useState<.*dept" site/src/components/ToolsGrid.tsx site/src/pages/Tools.tsx 2>/dev/null   # 0
grep -nE "useSearchParams" site/src/components/ToolsGrid.tsx site/src/pages/Tools.tsx 2>/dev/null                # ≥ 1
# 13 linków w DOM po JS (Playwright WebKit ze scratchpadu; tryb --dom PLANOWANY, F3)
node .claude/skills/klarow-guardian/scripts/verify-site.mjs --min-tool-links 13                 # shell hubu: ≥ 13 linków /narzedzia/<slug>
# PLANOWANE (F3, verify-site.mjs nie zna tego trybu): node .claude/skills/klarow-guardian/scripts/verify-site.mjs --dom /narzedzia --expect-links 13
```

Severity: MEDIUM (raport); brak 13 linków w DOM = BLOCKER z reguły `seo-links-in-dom`.

#### Wyjątki

Stan dem w trybie `tool` (wklejony CSV, wybrany tydzień na suwaku) nie trafia do URL: determinizm i prywatność danych użytkownika (adres z danymi w historii przeglądarki to wyciek).

### 6.16 code-use-not-usecontext

**use(Context) zamiast useContext(Context)**

Impact: **MEDIUM** · Tagi: react19, context, hooks, code · Źródło: CP:react19-no-forwardref (część use) / vercel.md §4, §13 / react.dev reference use · Dodano: 2026-09-12 · Plik: `rules/code-use-not-usecontext.md`

#### Zasada

Kontekst czytamy przez `use(LangContext)` (import `use` z `react`), nie przez `useContext`. Obowiązuje dla każdego nowego kontekstu (`LangContext`, przyszły `BookingContext`, `MotionProvider`). Jedyne dziś wystąpienie: `site/src/i18n.tsx:40` (`export const useLang = () => useContext(LangContext)`), do zamiany w fazie 0.

#### Mechanizm awarii (dlaczego)

`use()` jest API docelowym React 19: czyta kontekst i promisy tym samym wywołaniem, wolno je wołać warunkowo i po wczesnym `return` (czego `useContext` zabrania regułami hooków). Trzymanie dwóch API do tej samej rzeczy w jednym repo daje dwa style w kodzie i dwie ścieżki lintowania; agent, który widzi `useContext` w `i18n.tsx`, kopiuje go do kolejnych providerów. Zamiana jest mechaniczna i bez ryzyka semantycznego, więc dług nie ma uzasadnienia.

#### Niepoprawnie

```tsx
// site/src/i18n.tsx:1,40
import { createContext, useContext, useEffect, useState } from "react";
export const useLang = () => useContext(LangContext);
```

#### Poprawnie

```tsx
import { createContext, use, useEffect, useState } from "react";
export const useLang = () => use(LangContext);

// warunkowe czytanie jest legalne (useContext by tego nie pozwolił):
function Price({ show }: { show: boolean }) {
  if (!show) return null;
  const { lang } = use(LangContext);
  return <span>{pick(lang, LABEL)}</span>;
}
```

#### Test

```bash
grep -rnE "\buseContext\b" site/src --include=*.tsx --include=*.ts   # oczekiwane: 0
grep -rnE "import \{[^}]*\buse\b[^}]*\} from \"react\"" site/src/i18n.tsx   # oczekiwane: 1
```

Severity: MEDIUM. Auto-fix dozwolony (fixer): `useContext(` → `use(` + import.

#### Wyjątki

Brak. `demo/` jest statycznym HTML bez Reacta, więc reguła dotyczy wyłącznie `site/`.

### 6.17 code-no-barrel-imports

**Zero importów z barrel-files (lodash, react-icons, date-fns); lucide-react akceptowany**

Impact: **LOW** · Tagi: bundle, imports, tree-shaking, code · Źródło: RBP:bundle-barrel-imports / vercel.md §3.2 (kalibracja: Rollup tree-shake, brak serwera) / vercel.md §10.3 „Vercel impact ≠ nasza severity" · Dodano: 2026-09-12 · Plik: `rules/code-no-barrel-imports.md`

#### Zasada

Nie importujemy z pakietów-agregatów, których wejście re-eksportuje setki modułów bez pełnego ESM tree-shakingu: `lodash` (użyj własnej funkcji w `lib/` albo `lodash-es/<fn>`), `react-icons`, `date-fns` (root), `@mui/*`, `rxjs` (root). `lucide-react` jest dopuszczony świadomie: Vite/Rollup tree-shake'uje go w buildzie produkcyjnym, koszt to tylko dev-boot; deep-importy lucide nie mają typów `.d.ts`, więc nie wymuszamy ich. Własne barrel-files w `site/src` (`components/index.ts`, `data/index.ts`) są zakazane: importujemy z pliku komponentu lub danych.

#### Mechanizm awarii (dlaczego)

U Vercela reguła ma impact CRITICAL, bo w Next/serverless barrel z 1 583 modułów kosztuje 200–800 ms cold startu. U nas nie ma serwera: Rollup usuwa nieużywane eksporty ESM, więc realny koszt to dłuższy `vite dev` i HMR oraz ryzyko, że pakiet CJS (jak `lodash`) wejdzie w całości (~70 KB gz). Własny barrel `components/index.ts` psuje z kolei code-splitting z `code-lazy-routes-and-dashboards`: `import { Card } from "@/components"` ciągnie cały indeks (w tym dashboardy) do chunku strony głównej.

#### Niepoprawnie

```ts
import { debounce } from "lodash";            // CJS, cały pakiet
import { FaCheck } from "react-icons/fa";     // barrel ~1 500 ikon
import { format } from "date-fns";            // root barrel
import { Card, Chip } from "@/components";    // własny barrel: zabija lazy chunki
```

#### Poprawnie

```ts
import { Check } from "lucide-react";         // akceptowane (ESM, tree-shake)
import { Card } from "@/components/Card";
import { Chip } from "@/components/Chip";
// daty i liczby: Intl.* zamiast date-fns (WIG „Locale & i18n"); debounce: 8 linii własnego kodu w lib/
```

#### Test

```bash
grep -rnE "from \"(lodash|react-icons|date-fns|rxjs|@mui/[a-z-]+)\"" site/src   # oczekiwane: 0
grep -rnE "from \"@/(components|data|lib)\"" site/src                                 # oczekiwane: 0
test ! -f site/src/components/index.ts && echo "OK: brak barrela"
grep -nE "\"(lodash|react-icons|date-fns)\"" site/package.json                        # oczekiwane: 0
```

Severity: LOW (raport). Podniesienie do HIGH, gdy chunk strony głównej przekroczy budżet 140 KB gz i winowajcą jest barrel.

#### Wyjątki

`lucide-react` (patrz wyżej). `react-router-dom` i `motion/react` to barrele biblioteczne z poprawnym tree-shakingiem; nie flagować.

## 7. Dostępność (landmarki, dialog, fokus, semantyka, formularze, touch, lang) (`a11y`)

Domyślny impact: **HIGH** · tryb: both · właściciel audytu: `ui-auditor`

### 7.1 a11y-reduced-motion-media-query

**Każda animacja CSS pod @media (prefers-reduced-motion: reduce); każdy komponent Motion, wideo i canvas z gałęzią reduced**

Impact: **BLOCKER** · Tagi: a11y, reduced-motion, animation, video, canvas, css · Źródło: CLAUDE.md #2 (wszystkie animacje szanują prefers-reduced-motion) / WIG Animation (honor prefers-reduced-motion; muted loops stop) / synthesis §2.4.8 (3 warstwy + tabela degradacji), motion-reduced-3-layers / kit company-ui app.css:89-91 / vercel.md §9.9 · Dodano: 2026-09-12 · Plik: `rules/a11y-reduced-motion-media-query.md`

#### Zasada

Trzy warstwy, wszystkie obowiązkowe:
1. CSS: każdy `@keyframes`, `transition` na `transform`/`opacity` dłuższy niż 100 ms i każde `animation:` w `tokens.css`/`globals.css`/kicie ma odpowiednik w bloku `@media (prefers-reduced-motion: reduce)`, który go wyłącza lub redukuje do `opacity` (globalny reset kitu `company-ui.css:89-91` zostaje; nowe klasy nie mogą go obchodzić przez `!important`). `.hero-media video { display: none }` pod reduced.
2. Motion: `MotionConfig reducedMotion="user"` na korzeniu (zdejmuje transformy, zostawia opacity); `useReducedMotion()` w komponentach, których MotionConfig nie widzi: `HeroMedia` (poster zamiast wideo), `Counter` (`jump` do wartości), `ChartReveal` (`initial={false}`), mini-diagramy, hover-klipy.
3. Canvas/WebGL/wideo: reduced → jedna klatka (`glsl-hills.tsx:224-255` wzorzec) albo poster; nigdy autoplay.
Kryterium: pod reduced-motion żaden element nie zostaje „utknięty w `initial`" (niewidoczny), a wszystkie liczby, wykresy i zrzuty są widoczne od razu.

#### Mechanizm awarii (dlaczego)

Reguła #2 CLAUDE.md jest twarda: ruch bez poszanowania ustawienia systemowego wyklucza użytkowników z zaburzeniami przedsionkowymi (WCAG 2.3.3) i jest pierwszym testem, jaki Karol robi na iPhonie („Ogranicz ruch"). `MotionConfig` nie zatrzymuje `<video autoplay>`, canvasu ani motion values (`motion-dev.md` §8.11), więc sama warstwa 2 nie wystarcza. Klasyczny błąd: `whileInView` z `initial={{ opacity: 0 }}` + reduced-motion, który wyłącza animację, ale nie ustawia stanu końcowego; sekcja zostaje przezroczysta. Wideo pod reduced-motion nadal grające to niezaliczenie WIG „muted decorative loops must stop".

#### Niepoprawnie

```css
.reveal { animation: fadeUp 420ms var(--ease-out) both; }   /* bez bloku reduced */
```
```tsx
<m.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} />          {/* reduced: zostaje opacity 0 */}
<video autoPlay muted loop playsInline src="/media/hero-v1.webm" />                  {/* gra zawsze */}
```

#### Poprawnie

```css
.reveal { animation: fadeUp var(--duration-slow) var(--ease-out) backwards; }
@media (prefers-reduced-motion: reduce) { .reveal { animation: none; } .hero-media video { display: none; } }
```
```tsx
<MotionConfig reducedMotion="user"><LazyMotion features={domAnimation} strict>…</LazyMotion></MotionConfig>
const reduced = useReducedMotion();
<m.div initial={reduced ? false : { opacity: 0, y: SHIFT }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT_ONCE} />
{reduced || coarse || saveData ? <img src={poster} width={1600} height={900} alt="" /> : <video … poster={poster} />}
```

#### Test

```bash
# każdy @keyframes / animation: ma nazwę w bloku reduced (skrypt paruje nazwy)
# DOCELOWO (skrypt planowany, jeszcze nie istnieje — dziś: NIE SPRAWDZANO): node .claude/skills/klarow-guardian/scripts/check-motion.mjs --reduced
grep -rnE "reducedMotion=\"user\"" site/src --include=*.tsx                       # 1 (korzeń)
grep -rnE "<video" site/src --include=*.tsx | grep -v "useReducedMotion|reduced"   # 0 (wideo tylko w HeroMedia z gałęzią)
# Playwright WebKit 390×844 + 1440×900 z emulateMedia({ reducedMotion: "reduce" }): zero elementów z computed opacity 0 w viewport po 1 s; brak <video> grającego
# PLANOWANE (F3, verify-site.mjs nie zna tego trybu): node .claude/skills/klarow-guardian/scripts/verify-site.mjs --reduced-motion
```

Severity: BLOCKER (twarda zasada CLAUDE.md #2).

#### Wyjątki

Przejścia `opacity` ≤ 200 ms (crossfade zakładek, hover koloru) są dozwolone pod reduced-motion (WCAG: „essential"/nieistotne dla równowagi). Reveal wykresów kitu `.chart-reveal` pod reduced = brak reveal (instant), co jest zgodne z regułą.

### 7.2 a11y-contrast

**Kontrast: tekst ≥ 4,5:1, UI i placeholdery ≥ 3:1, tekst na wideo ≥ 4,5:1 na najjaśniejszej klatce**

Impact: **HIGH** · Tagi: a11y, contrast, color, tokens, video · Źródło: WCAG 2.2 1.4.3 / 1.4.11 / site-audit.md §3.2 p.7 (#b4b4b9 na #171717 ≈ 6–7:1 OK) / synthesis design-contrast (kit błędy 3.29/2.24), §2.3 S1 (overlay hero), §2.5.1 (8,9:1) / scratchpad contrast.mjs · Dodano: 2026-09-12 · Plik: `rules/a11y-contrast.md`

#### Zasada

Każda para „kolor tekstu × tło" z `tokens.css` ma kontrast ≥ 4,5:1 (tekst < 24 px / < 19 px bold) albo ≥ 3:1 (tekst ≥ 24 px lub ≥ 19 px bold, ikony, obrysy kontrolek, `--border-strong`, placeholdery, wskaźnik fokusu). Tabela par w `references/design-tokens.md` jest kompletna i wiążąca (tam liczby, tu próg): `--foreground`, `--foreground-muted`, `--foreground-faint`, `--accent`, `--on-cta` na każdym z `--background`, `--surface`, `--surface-raised`, `--surface-overlay`, `--cta`. Tekst na wideo/obrazie (hero S1) liczymy na NAJJAŚNIEJSZEJ klatce z overlayem `linear-gradient(180deg, rgba(18,18,18,.15), rgba(18,18,18,.85))`; poster i wideo są testowane osobno. Statusy w dashboardach nigdy nie polegają tylko na kolorze (ikona + tekst). Zmiana dowolnego tokenu koloru = przeliczenie całej tabeli w `references/design-tokens.md` (§3 ciemny, §4 jasny; procedura w §5) w tym samym commicie; skrypt `audit-contrast.mjs` jest PLANOWANY (F3) i dziś nie istnieje.

#### Mechanizm awarii (dlaczego)

Kit `company-ui` miał pary o kontraście 3,29:1 i 2,24:1 (placeholder, obrysy) wykryte skryptem `contrast.mjs` w researchu; ciemna stal jest nisko-chromatyczna, więc „subtelny" `--foreground-faint` łatwo spada poniżej 3:1. Tekst hero nad jasną klatką wideo (Kling: białe pasma) traci czytelność w pełnym słońcu na telefonie, a Lighthouse mierzy tylko poster, nie klatki wideo. Kontrast poniżej progu to twarde niezaliczenie WCAG AA i Lighthouse a11y < 95 (DoD kitu).

#### Niepoprawnie

```css
:root { --foreground-faint: #5a5a5f; }        /* na #121212 ≈ 2,6:1 dla placeholderów */
.hero h1 { color: var(--foreground); }         /* bez overlaya nad wideo */
```
```tsx
<span style={{ color: "var(--ok)" }}>●</span>   {/* status tylko kolorem */}
```

#### Poprawnie

```css
:root { --background: #121212; --foreground: #fafafa; --foreground-muted: #b4b4b9; --foreground-faint: #8d8d93; /* 3,3:1 → 4,6:1 */ --border-strong: #4a4a50; }
.hero-media::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(18,18,18,.15), rgba(18,18,18,.85)); }
```
```tsx
<span className="st st-ok"><Check size={14} aria-hidden="true" /> OK</span>
```

#### Test

```bash
# dziś: tabela wszystkich par z wyliczonym kontrastem w references/design-tokens.md (§3 ciemny, §4 jasny)
grep -cE "^\| \`--" .claude/skills/klarow-guardian/references/design-tokens.md        # ≥ 1 wiersz na parę
# pojedyncza para (WCAG 2.x relative luminance), bez zależności:
node -e "const L=(h)=>{const v=h.replace('#','').match(/../g).map(x=>parseInt(x,16)/255).map(c=>c<=0.03928?c/12.92:Math.pow((c+0.055)/1.055,2.4));return 0.2126*v[0]+0.7152*v[1]+0.0722*v[2]};const C=(a,b)=>{const [h,l]=[L(a),L(b)].sort((x,y)=>y-x);return ((h+0.05)/(l+0.05)).toFixed(2)};console.log(C('#8D8D93','#1F1F1F'))"
# wszystkie pary tokenów (skrypt liczy WCAG 2.x relative luminance; fail < 4.5 tekst / < 3 UI)
# DOCELOWO (skrypt planowany, jeszcze nie istnieje — dziś: NIE SPRAWDZANO): node .claude/skills/klarow-guardian/scripts/audit-contrast.mjs site/src/styles/tokens.css
# hero: najjaśniejsza klatka postera/wideo (ffmpeg w scratchpadzie) + overlay → luminancja tła pod H1
# DOCELOWO (skrypt planowany, jeszcze nie istnieje — dziś: NIE SPRAWDZANO): node .claude/skills/klarow-guardian/scripts/audit-contrast.mjs --hero site/public/media/hero-v1.poster.webp
# Lighthouse a11y ≥ 95 na 5 trasach (F4)
```

Severity: HIGH.

#### Wyjątki

Tekst dekoracyjny/wyłączony (`:disabled`, `aria-disabled`) nie podlega 4,5:1 (WCAG wyłącza „inactive"), ale ≥ 3:1 zalecane. Logotypy nie występują (wordmark tekstowy podlega regule).

### 7.3 a11y-controls-native

**<button> dla akcji, <a>/<Link> dla nawigacji; zero <div onClick>, zero navigate() w onClick**

Impact: **HIGH** · Tagi: a11y, semantics, button, link, keyboard, router · Źródło: WIG Accessibility (`<button>` for actions, `<a>`/`<Link>` for navigation; interactive elements need keyboard handlers) + Navigation & State (Links use <a>; Cmd/Ctrl-click) + Anti-patterns / vercel.md §9.5 a11y-semantic, §9.6 nav-real-links / synthesis a11y-semantic, §2.3 S3 (cała rama = <a>) · Dodano: 2026-09-12 · Plik: `rules/a11y-controls-native.md`

#### Zasada

Akcja zmieniająca stan (otwórz dialog, filtruj, sortuj, pobierz PDF, przełącz język) = `<button type="button">`. Przejście na inny adres = `<a href>` albo `<Link to>` z react-router (obsługa Cmd/Ctrl-klik, środkowy przycisk, kopiowanie adresu). Zakazane: `<div>`/`<span>`/`<li>` z `onClick` jako kontrolka (bez `role`, `tabIndex`, `onKeyDown`), `navigate("/x")` w `onClick` przycisku zamiast `<Link>`, `<a>` bez `href` jako przycisk, `<button>` opakowany w `<Link>` (zagnieżdżone interaktywne). Cała karta narzędzia w hubie i w S3 to jeden `<a>` z `display: block`; wewnątrz karty nie ma drugiego interaktywnego elementu. Ikona wewnątrz kontrolki ma `aria-hidden="true"`; kontrolka ikonowa ma `aria-label`. Overlay dialogu obsługujący klik w tło to `<dialog>` (patrz `a11y-dialog-semantics`), nie `<div onClick>`.

#### Mechanizm awarii (dlaczego)

`<div onClick>` nie jest fokusowalny, nie reaguje na Enter/Spację i nie ma roli, więc dla klawiatury i czytnika ekranu nie istnieje (WCAG 2.1.1). `navigate()` w `onClick` psuje Cmd-klik (otwarcie w nowej karcie), prawy przycisk „kopiuj adres" i crawlery: Googlebot nie wykonuje handlerów, więc nie widzi linku, a to jest sedno problemu z `ToolsGrid` (`site-audit.md` §3.6). `<button>` w `<a>` jest nieprawidłowym HTML-em: przeglądarki rozbijają drzewo, a czytniki ogłaszają dwa elementy. `BookingModal.tsx:132` overlay `<div onClick={onClose}>` jest akceptowalny wyłącznie z `role="presentation"` i alternatywą klawiszową; docelowo znika z `<dialog>`.

#### Niepoprawnie

```tsx
<div className="card" onClick={() => navigate(`/narzedzia/${t.slug}`)}>…</div>
<button onClick={() => navigate("/oferta")}>Szczegóły oferty</button>
<Link to={`/narzedzia/${t.slug}`}><button className="btn">Otwórz</button></Link>
<a onClick={onBook}>Umów 30 minut</a>
```

#### Poprawnie

```tsx
<Link to={`/narzedzia/${t.slug}`} className="card-link">
  <img … alt="" /><span className="t-heading">{t.name}</span><span className="t-muted">{t.hook}</span>
</Link>
<Link to="/oferta" className="btn btn-ghost">Szczegóły oferty</Link>
<button type="button" className="btn btn-primary" onClick={onBook}>{pick(lang, MESSAGING.cta.primary)}</button>
<button type="button" className="btn btn-ghost" aria-label={t.close}><X size={16} aria-hidden="true" /></button>
```

#### Test

```bash
grep -rnE "<(div|span|li|p)[^>]*onClick=" site/src --include=*.tsx | grep -vE "role=\"(button|presentation)\"|<dialog"   # 0 (baseline: dashboardy)
grep -rnE "onClick=\{[^}]*navigate\(" site/src --include=*.tsx                                                            # 0
grep -rnE "<a [^>]*onClick=" site/src --include=*.tsx | grep -v "href="                                                   # 0
grep -rnE "<Link[^>]*>\s*<button" site/src --include=*.tsx                                                                # 0
# DOCELOWO (skrypt planowany, jeszcze nie istnieje — dziś: NIE SPRAWDZANO): node .claude/skills/klarow-guardian/scripts/check-a11y.mjs --controls
# ESLint jsx-a11y: click-events-have-key-events, no-static-element-interactions, anchor-is-valid
```

Severity: HIGH.

#### Wyjątki

Wiersz tabeli w dashboardzie z `onClick` do zaznaczenia dopuszczalny tylko z `role="button" tabIndex={0} onKeyDown` (Enter/Spacja) i widocznym fokusem; preferowany jest przycisk w komórce.

### 7.4 a11y-dialog-semantics

**Dialog: natywny <dialog> (lub role="dialog" aria-modal aria-labelledby), focus-trap, zwrot fokusu, Esc, klik w tło**

Impact: **HIGH** · Tagi: a11y, dialog, modal, focus, keyboard · Źródło: WIG Accessibility + Touch (overscroll-behavior: contain w modalach) / site-audit.md §3.2 p.2 (BookingModal bez role/aria-modal/focus-trap) / vercel.md §9.5 (overlay onClick tylko z role="presentation" + Esc) / kit company-ui J2 / synthesis a11y-dialog, F0 (BookingDialog jako <dialog>, Cal.com link) · Dodano: 2026-09-12 · Plik: `rules/a11y-dialog-semantics.md`

#### Zasada

`BookingDialog` (następca `BookingModal`) i każdy przyszły modal używają natywnego `<dialog>` otwieranego przez `showModal()`; przeglądarka dostarcza wtedy `role`, `aria-modal`, focus-trap, `Esc` i `inert` reszty strony. Wymagane dodatkowo: `aria-labelledby` wskazujące nagłówek dialogu, początkowy fokus na pierwszym sensownym elemencie (nagłówek z `tabIndex={-1}` albo pierwsze pole), zwrot fokusu do elementu otwierającego po zamknięciu (przeglądarka robi to dla `showModal()`; przy portalu React sprawdzić), zamknięcie klikiem w backdrop przez porównanie `e.target === dialog`, `overscroll-behavior: contain` na treści dialogu, portal poza elementami z `transform`/`filter` (inaczej `position: fixed` liczy się względem transformowanego rodzica). Jeśli `<dialog>` nie może być użyty (uzasadnienie w komentarzu), wariant ARIA: `role="dialog" aria-modal="true" aria-labelledby` + ręczny focus-trap + `Esc` + zwrot fokusu.

#### Mechanizm awarii (dlaczego)

`BookingModal.tsx:132-235`: overlay `<div className="modal-overlay-c open" onClick={onClose}>` bez `role`, dialog bez `aria-modal`/`aria-labelledby`, brak początkowego fokusu i focus-trapu (Tab wychodzi pod overlay na linki strony), brak zwrotu fokusu (po zamknięciu fokus ląduje na `<body>`). Czytnik ekranu nie wie, że otworzył się dialog, a użytkownik klawiatury po zamknięciu traci pozycję. Escape działa (L105-110), ale przez własny listener, który trzeba sprzątać (`code-effects-hygiene`). Dodatkowo bug daty `BookingModal.tsx:78` (`toISOString()` przesuwa dzień o −1 w strefie PL) wpisuje zły dzień do tematu maila; nowy dialog dostaje ten fix przy okazji (`YYYY-MM-DD` z `getFullYear/getMonth/getDate`).

#### Niepoprawnie

```tsx
return (
  <div className="modal-overlay-c open" onClick={onClose}>
    <div className="modal-c" onClick={(e) => e.stopPropagation()}>
      <button className="modal-close" onClick={onClose} aria-label={t.close}><X size={15} /></button>
      <h2>{t.title}</h2>
```

#### Poprawnie

```tsx
const ref = useRef<HTMLDialogElement>(null);
useEffect(() => { const d = ref.current; if (!d) return; open ? d.showModal() : d.close(); }, [open]);
return (
  <dialog ref={ref} className="dialog" aria-labelledby="booking-title" onClose={onClose}
          onClick={(e) => { if (e.target === ref.current) onClose(); }}>
    <div className="dialog-body" style={{ overscrollBehavior: "contain" }}>
      <h2 id="booking-title" tabIndex={-1}>{t.title}</h2>
      <button type="button" className="btn btn-ghost" onClick={onClose} aria-label={t.close}><X size={16} aria-hidden="true" /></button>
      <a className="btn btn-primary" href={CAL_URL} target="_blank" rel="noopener">{pick(lang, MESSAGING.cta.primary)}</a>
    </div>
  </dialog>
);
```
```css
.dialog::backdrop { background: rgba(18, 18, 18, .72); }   /* scrim kitu */
```

#### Test

```bash
grep -rnE "<dialog" site/src --include=*.tsx | wc -l                                   # ≥ 1
grep -rnE "modal-overlay-c|role=\"dialog\"" site/src --include=*.tsx                    # 0 wariantów bez aria-modal
grep -rnE "aria-labelledby=" site/src/components/BookingDialog.tsx                       # ≥ 1
grep -rnE "toISOString\(\)\.slice\(0, ?10\)" site/src                                     # 0 (bug daty)
# Playwright: otwórz dialog, Tab ×20 nigdy nie opuszcza dialogu; Esc zamyka; fokus wraca na przycisk CTA
# DOCELOWO (skrypt planowany, jeszcze nie istnieje — dziś: NIE SPRAWDZANO): node .claude/skills/klarow-guardian/scripts/check-a11y.mjs --dialog
```

Severity: HIGH.

#### Wyjątki

Nie-modalne panele (menu mobilne) nie są dialogami: patrz `a11y-inert-hidden-menus`. Podglądy PDF nie otwierają modala (pobieranie pliku).

### 7.5 a11y-focus-visible-everywhere

**Widoczny fokus na każdym elemencie interaktywnym; :focus-visible, nigdy outline-none bez zamiennika**

Impact: **HIGH** · Tagi: a11y, focus, keyboard, css, kit · Źródło: WIG Focus States (5 reguł) + Anti-patterns (outline-none) / site-audit.md §3.2 p.4 (Navbar bez focus-visible), vercel.md §13 (badge.tsx focus: zamiast focus-visible:) / kit company-ui app.css:214 (.btn:focus-visible) / synthesis a11y-focus-visible (outline 2.5px solid var(--ring); offset 2px) · Dodano: 2026-09-12 · Plik: `rules/a11y-focus-visible-everywhere.md`

#### Zasada

Każdy element interaktywny (`a`, `button`, `input`, `select`, `textarea`, `[tabindex]`, cała karta-link) ma widoczny stan fokusu klawiatury: globalnie w kicie `:focus-visible { outline: 2.5px solid var(--ring); outline-offset: 2px; }` z tokenem `--ring` o kontraście ≥ 3:1 wobec tła. Zakazane: `outline: none` / `outline-none` / `focus:outline-none` bez zamiennika w tej samej regule; `:focus` zamiast `:focus-visible` (ring po kliknięciu myszą); `focus:ring-*` Tailwinda z kolorami palety. Kompozyty (przełącznik PL/EN, pole z ikoną) używają `:focus-within`. Sticky navbar nie zasłania sfokusowanego elementu (`scroll-padding-top`, `scroll-margin-top` na kotwicach). Elementy z `.btn`, `.chip`, `.st` kitu dziedziczą fokus; własne klasy (np. karta hubu) muszą go dodać jawnie.

#### Mechanizm awarii (dlaczego)

`Navbar.tsx:47-70`: CTA i przełącznik języka zbudowane na Tailwindzie bez klas kitu, więc nie dziedziczą `.btn:focus-visible` (`company-ui.css:214`); po Tab nie widać, gdzie jest fokus. `components/ui/badge.tsx:7` używa `focus:outline-none focus:ring-2` (`focus:` zamiast `focus-visible:`), co daje ring po kliknięciu myszą, a dla klawiatury ring w kolorze palety Tailwinda (zerowanej w `@theme`). Użytkownik klawiatury traci orientację; Lighthouse a11y i axe flagują brak wskaźnika fokusu; WCAG 2.4.7 (Focus Visible) i 2.4.11 (Focus Not Obscured) to poziom AA.

#### Niepoprawnie

```tsx
<button className="px-2 py-1 rounded-full border border-[#3a3a3a] text-[#b4b4b9] hover:text-white">EN</button>   {/* brak fokusu */}
<span className="focus:outline-none focus:ring-2 focus:ring-ring">…</span>                                     {/* focus: nie focus-visible: */}
```
```css
a:focus { outline: none; }
```

#### Poprawnie

```css
/* tokens.css / kit */
:root { --ring: #dfe5ec; }
:where(a, button, input, select, textarea, [tabindex]):focus-visible { outline: 2.5px solid var(--ring); outline-offset: 2px; }
.card-link:focus-visible { outline: 2px solid var(--accent); outline-offset: -2px; }   /* hairline w ramie */
.lang-switch:focus-within { outline: 2.5px solid var(--ring); }
html { scroll-padding-top: var(--nav-h); } [id] { scroll-margin-top: var(--nav-h); }
```
```tsx
<button type="button" className="btn btn-ghost lang-switch" aria-label={…}>EN</button>
```

#### Test

```bash
grep -rnE "outline-none|outline: ?none|outline:0" site/src --include=*.tsx --include=*.css | grep -vE "focus-visible|:focus-visible"   # 0
grep -rnoE "\bfocus:(ring|outline|border)[a-z0-9-]*" site/src --include=*.tsx                                                            # 0 (focus-visible: dozwolone)
grep -nE ":focus-visible \{ outline: 2\.5px solid var\(--ring\)" site/src/styles/*.css                                                     # ≥ 1
# Playwright: Tab przez każdą trasę; dla każdego document.activeElement computed outline-style !== "none"
# DOCELOWO (skrypt planowany, jeszcze nie istnieje — dziś: NIE SPRAWDZANO): node .claude/skills/klarow-guardian/scripts/check-a11y.mjs --focus-visible
```

Severity: HIGH. Auto-fix dozwolony: `focus:` → `focus-visible:`.

#### Wyjątki

`outline: none` jest dozwolone TYLKO w tej samej regule, która definiuje zamiennik (`box-shadow: 0 0 0 2.5px var(--ring)`), np. na elementach z `overflow: hidden` i `border-radius: 999px`, gdzie `outline` nie podąża za kształtem w starszym Safari.

### 7.6 a11y-form-labels-errors

**Formularze: label/htmlFor, type + inputmode + autocomplete, błędy inline z fokusem, zero blokady paste; komunikaty asynchroniczne w aria-live**

Impact: **HIGH** · Tagi: a11y, forms, inputs, validation, pke, aria-live, status · Źródło: WIG Forms (11 reguł) + Anti-patterns (onPaste preventDefault, inputs without labels) / vercel.md §9.7 / kit company-ui J1–J7 / peer-legal.md §1.4 (formularze bez domyślnych zgód; inbound „najgorszy Excel") · Dodano: 2026-09-12 · Plik: `rules/a11y-form-labels-errors.md`

#### Zasada

Każda kontrolka formularza (także szukajka w dashboardzie, `textarea` na CSV, przyszły formularz „najgorszy Excel" i newsletter) ma: (1) `<label htmlFor>` albo `aria-label`/`aria-labelledby`; (2) poprawny `type` (`email`, `tel`, `url`, `number`) i `inputMode` (`numeric`, `decimal`, `email`); (3) sensowny `name` i `autoComplete` (`email`, `tel`, `organization`, `name`; `off` na polach nie-autoryzacyjnych, które nie powinny budzić menedżera haseł); (4) `spellCheck={false}` na e-mail, kodach, identyfikatorach; (5) błędy walidacji inline obok pola (`aria-describedby` → element z `aria-live="polite"`), fokus na pierwszym błędnym polu po submit; (6) przycisk submit aktywny do momentu wysłania (spinner w trakcie), nigdy `disabled` „dopóki formularz nie jest poprawny"; (7) placeholder z przykładem i „…" na końcu; (8) zero `onPaste` + `preventDefault`; (9) checkbox i etykieta = jeden cel kliknięcia; (10) checkboxy zgód NIE są domyślnie zaznaczone (`legal-pke-consent-forms`); (11) `beforeunload`/guard routera przy niezapisanych zmianach w kreatorach dem; (12) **każdy komunikat pojawiający się bez nawigacji** — toast, stan ładowania dema, wynik PASS/FAIL rekoncyliacji, liczba wyników po zmianie filtra hubu, „Pobieram PDF…" — żyje w regionie obecnym w DOM od pierwszego renderu, z `role="status"` i `aria-live="polite"` (`aria-live="assertive"` wyłącznie dla błędu blokującego akcję). Region wstawiany do DOM dopiero razem z komunikatem nie zostanie odczytany.

#### Mechanizm awarii (dlaczego)

Pole bez etykiety jest dla czytnika ekranu „edit text" bez nazwy (WCAG 1.3.1, 4.1.2); `type="text"` na e-mailu na iOS daje klawiaturę bez `@` i włącza autokorektę (`spellCheck`); błąd wyświetlony tylko na górze formularza nie jest ogłaszany i nie prowadzi do pola; `disabled` submit ukrywa, DLACZEGO nie można wysłać. Blokada wklejania psuje menedżery haseł i wklejanie e-maila z Outlooka. Domyślnie zaznaczona zgoda marketingowa jest nieważna w świetle art. 398 PKE (zgoda ma być czynna) i art. 7 RODO.

#### Niepoprawnie

```tsx
<input placeholder="E-mail" />
<input type="text" onPaste={(e) => e.preventDefault()} />
<button type="submit" disabled={!valid}>Wyślij</button>
<input type="checkbox" defaultChecked name="newsletter" /> Chcę otrzymywać informacje handlowe
{error ? <p className="err">{error}</p> : null}   {/* na górze, bez powiązania z polem */}
```

#### Poprawnie

```tsx
<label htmlFor="email" className="lbl-sm">{t.email}</label>
<input id="email" name="email" type="email" inputMode="email" autoComplete="email" spellCheck={false}
       placeholder="anna.kowalska@firma.pl…" aria-invalid={!!errors.email} aria-describedby="email-err" ref={firstErrorRef} />
<p id="email-err" className="err" aria-live="polite">{errors.email ?? ""}</p>
<label className="check"><input type="checkbox" name="newsletter" /> {t.newsletterConsent}</label>   {/* niezaznaczony */}
<button type="submit" className="btn btn-primary" aria-busy={pending}>{pending ? t.sending : t.send}</button>
```
Po submit z błędami: `firstErrorRef.current?.focus()`.

#### Test

```bash
# input/textarea/select bez id+label lub aria-label (heurystyka)
grep -rnE "<(input|textarea|select)\b" site/src --include=*.tsx | grep -vE "aria-label|id=\"" | grep -v "type=\"hidden\""   # przegląd: 0
grep -rnE "onPaste=" site/src --include=*.tsx                                                                             # 0
grep -rnE "type=\"checkbox\"[^>]*(defaultChecked|checked=\{true\})" site/src --include=*.tsx                                # 0
grep -rnE "type=\"email\"" site/src --include=*.tsx | grep -v "spellCheck={false}"                                         # 0
grep -rnE "disabled=\{!(valid|isValid|ok)\}" site/src --include=*.tsx                                                     # 0
# każdy komponent zmieniający treść bez nawigacji ma region aria-live (toasty, stany dem, PASS/FAIL)
grep -rn "aria-live" site/src --include=*.tsx                                                                             # ≥ 1 na komponent z komunikatem
grep -rn "role=\"status\"" site/src --include=*.tsx                                                                       # ≥ 1
# ESLint jsx-a11y/label-has-associated-control, control-has-associated-label
```

Severity: HIGH (label, paste, type); MEDIUM reszta (raport).

#### Wyjątki

`textarea` na CSV w `DemoReport` ma etykietę wizualną nad polem; `aria-label` wystarcza, jeśli etykieta nie jest `<label>`. Pola dem nie mają `autoComplete` danych osobowych (nie ma tam takich pól).

### 7.7 a11y-headings-order-one-h1

**Dokładnie jeden H1 na trasę, hierarchia h1→h2→h3 bez przeskoków, scroll-margin-top na kotwicach**

Impact: **HIGH** · Tagi: a11y, headings, seo, structure, prerender · Źródło: WIG Accessibility (headings hierarchical; scroll-margin-top on heading anchors) / site-audit.md §3.2 p.7 (h1 per strona OK) / synthesis §2.8 p.1 (verify-site: 1 H1 i <main> per plik), §2.3 (nagłówek ≤ 6 słów) · Dodano: 2026-09-12 · Plik: `rules/a11y-headings-order-one-h1.md`

#### Zasada

Każda trasa (także `/rodo` i `404`) ma dokładnie jeden `<h1>` w `<main>`; sekcje home i podstron mają `<h2>` (nagłówek ≤ 6 słów), karty i pod-bloki `<h3>`; nie ma przeskoku o więcej niż jeden poziom w dół (h2 → h4) ani nagłówków używanych „dla rozmiaru pisma" (rozmiar to klasa `.fs-*`, nie tag). Nagłówki z `id` (kotwice `#sciezka`, `#faq-cena`) mają `scroll-margin-top: var(--nav-h)`. Shell prerendera i DOM po JS mają identyczny zbiór H1/H2 (bramka shell-vs-DOM). Wordmark `KLAROW` w navbarze i stopce nie jest nagłówkiem (to `<a>`/`<span className="brand-word">`).

#### Mechanizm awarii (dlaczego)

Czytniki ekranu nawigują po nagłówkach (klawisz H); dwa H1 albo przeskok h2 → h4 gubią użytkownika i psują „outline" strony, który Google używa do fragmentów i sitelinks. Dziś jest poprawnie (`App.tsx:137`, `ToolPage.tsx:134`), ale przebudowa dodaje 9 sekcji home z `Section` i łatwo o drugi H1 w hero-media lub o `<h4>` w kartach bento. Sticky navbar bez `scroll-margin-top` zasłania nagłówek po kliknięciu w kotwicę (WCAG 2.4.11).

#### Niepoprawnie

```tsx
<h1 className="brand-word">KLAROW</h1>            {/* wordmark jako H1 */}
<section><h2>Co budujemy</h2><div className="cell"><h4>Raporty i kontroling</h4></div></section>   {/* przeskok */}
<h3 className="text-[26px]">Pokaż nam proces, który boli.</h3>   {/* tag dla rozmiaru */}
```

#### Poprawnie

```tsx
<a href="/" className="brand-word" translate="no">KLAROW</a>
<main id="main"><h1>{pick(lang, HOME.hero.h1)}</h1>
  <section aria-labelledby="s2"><h2 id="s2">Co budujemy</h2><div className="cell"><h3>Raporty i kontroling</h3></div></section>
  <section aria-labelledby="s9"><h2 id="s9" className="fs-2xl">Pokaż nam proces, który boli.</h2></section>
</main>
```
```css
[id] { scroll-margin-top: var(--nav-h); }
```

#### Test

```bash
# dist: 1 H1 per plik; brak przeskoków poziomów (skrypt buduje outline)
for f in $(find site/dist -name "*.html"); do n=$(grep -o "<h1" "$f" | wc -l); [ "$n" = 1 ] || echo "FAIL $f h1=$n"; done
node .claude/skills/klarow-guardian/scripts/verify-site.mjs                                    # findings [seo-prerender-must-keep]: „N × <h1> (ma być dokładnie 1)" per plik
# PLANOWANE (F3, verify-site.mjs nie zna tego trybu): node .claude/skills/klarow-guardian/scripts/verify-site.mjs --headings
grep -rnE "<h[1-6][^>]*className=\"[^\"]*(brand-word|text-\[)" site/src --include=*.tsx   # 0
grep -nE "scroll-margin-top" site/src/styles/*.css                                          # ≥ 1
```

Severity: HIGH.

#### Wyjątki

Dashboardy w trybie `tool` osadzone na podstronie używają `<h2>`/`<h3>` (są pod H1 podstrony); osadzony dashboard nie może mieć własnego `<h1>`.

### 7.8 a11y-images-alt-svg-role

**Obrazy: alt (lub alt="") + width/height + loading; SVG z danymi: role="img" + aria-label; ikony aria-hidden**

Impact: **HIGH** · Tagi: a11y, images, svg, alt, cls, icons · Źródło: WIG Accessibility (images need alt; decorative icons aria-hidden) + Images (width/height, loading=lazy, fetchpriority) / site-audit.md §3.2 p.7 (SVG role="img" w DemoReport, CollaborationFlow) / synthesis a11y-img, a11y-svg, design-icons, §2.3 S1 (poster jako LCP z preload) · Dodano: 2026-09-12 · Plik: `rules/a11y-images-alt-svg-role.md`

#### Zasada

1. Każdy `<img>` ma `alt`: opisowy, gdy niesie treść (zrzut dashboardu: „Raport zarządczy: 3 KPI i wykres koszt vs postęp na danych przykładowych"), `alt=""` gdy dekoracyjny (poster hero, still „brushed steel", duotone portret ma `alt="Imię Nazwisko"`). Zawsze jawne `width` i `height` (CLS), `loading="lazy"` poniżej folda, `decoding="async"`; poster hero `fetchPriority="high"` + `<link rel="preload" as="image">` w `index.html`.
2. SVG z danymi lub znaczeniem (`CollaborationFlow`, `KsefFlow`, wykresy `DemoReport`, ilustracje case) ma `role="img"` + `aria-label` streszczający dane (liczby, kierunek strzałek: „KSeF API → connector → baza u Ciebie → pulpity; brak strzałki zwrotnej"); węzły tekstowe wewnątrz SVG nie zastępują `aria-label`.
3. Ikony lucide obok tekstu: `aria-hidden="true"`; ikona jako jedyna treść kontrolki: kontrolka ma `aria-label` (nie ikona). Ikona sama nigdy nie niesie statusu (kolor + ikona + tekst).
4. Zero `<img>` z `src` zewnętrznym (`integ-no-external-scripts-on-site`), zero placeholderów `picsum`/`unsplash` w `dist`.

#### Mechanizm awarii (dlaczego)

`<img>` bez wymiarów przesuwa layout po załadowaniu (CLS > 0,1 = czerwony Core Web Vital, budżet synthesis §2.4.9 < 0,1); bez `alt` czytnik czyta nazwę pliku `hero-v1.poster.webp`. Wykres jako `<svg>` bez `role="img"` jest dla czytnika listą setek `<path>`; z `aria-label` staje się jednym zdaniem z danymi. Ikona bez `aria-hidden` obok tekstu podwaja komunikat („ikona check OK"); przycisk ikonowy bez `aria-label` to „button" bez nazwy (WIG Anti-patterns). `radial-orbital-timeline.tsx:288,397` ma `<img` bez wymiarów (martwy plik, ale wzorzec do niepowielania).

#### Niepoprawnie

```tsx
<img src="/thumbs/raport-zarzadczy-640.webp" />
<svg viewBox="0 0 800 300">{bars}</svg>
<button onClick={onClose}><X size={15} /></button>
<Check size={14} /> OK
```

#### Poprawnie

```tsx
<img src="/thumbs/raport-zarzadczy-640.webp" width={640} height={400} loading="lazy" decoding="async"
     alt={pick(lang, { pl: "Raport zarządczy: 3 KPI i wykres koszt vs postęp, dane przykładowe", en: "Management report: 3 KPIs and cost vs progress chart, sample data" })} />
<svg viewBox="0 0 800 300" role="img" aria-label={t.chartSummary(kpis)}>{bars}</svg>
<button type="button" onClick={onClose} aria-label={t.close}><X size={16} aria-hidden="true" /></button>
<span className="st st-ok"><Check size={14} aria-hidden="true" /> OK</span>
{/* index.html: <link rel="preload" as="image" href="/media/hero-v1.poster.webp" fetchpriority="high"> */}
```

#### Test

```bash
grep -rnE "<img\b" site/src --include=*.tsx | grep -vE "alt=" ;  grep -rnE "<img\b" site/src --include=*.tsx | grep -vE "width=\{?[0-9]" | grep -vE "height="   # 0 i 0
grep -rnE "<svg\b" site/src --include=*.tsx | grep -vE "role=\"img\"|aria-hidden=\"true\""   # 0
grep -rnE "<(Check|X|Menu|Phone|Mail|ArrowRight|ChevronDown)[^>]*/>" site/src --include=*.tsx | grep -v "aria-hidden"   # przegląd; oczekiwane 0 poza samodzielnymi ikonami w kontrolce z aria-label
grep -rlE "picsum|unsplash" site/dist                                        # 0
# ESLint jsx-a11y/alt-text; Lighthouse: „Image elements have explicit width and height"
```

Severity: HIGH.

#### Wyjątki

`<img alt="">` dekoracyjny bez `role="presentation"` wystarcza. SVG czysto dekoracyjne (hairline łącznik kroków) mają `aria-hidden="true"` zamiast `role="img"`.

### 7.9 a11y-inert-hidden-menus

**Zamknięte menu i panele ukryte przez inert/hidden, nie przez opacity-0 + pointer-events-none**

Impact: **HIGH** · Tagi: a11y, menu, inert, keyboard, mobile · Źródło: WIG Accessibility (keyboard) / site-audit.md §3.2 p.3 (menu mobilne w kolejności tabulacji) / synthesis §2.2 nawigacja (panel z inert gdy zamknięty), a11y-menu-inert · Dodano: 2026-09-12 · Plik: `rules/a11y-inert-hidden-menus.md`

#### Zasada

Element wizualnie ukryty, ale obecny w DOM (menu mobilne, panel filtrów, rozwijana lista działań), dostaje `hidden` (albo `tabIndex={-1}` na każdej kontrolce w środku), a dodatkowo `inert` i `aria-hidden="true"`, gdy jest zamknięty. Sam `inert` NIE wystarcza: nie istnieje na baseline `safari13` (`code-build-target-policy`), a `aria-hidden` nie wyjmuje niczego z kolejności tabulacji. Ukrywanie wyłącznie przez `max-h-0 opacity-0 pointer-events-none` jest zakazane: linki nadal są w kolejności tabulacji i w drzewie dostępności. Przycisk otwierający ma `aria-expanded` i `aria-controls="<id panelu>"`. Animację zwijania (`grid-template-rows` jak w `.faq-answer`) łączymy z `hidden` + `inert` ustawianymi po zakończeniu przejścia (`onTransitionEnd`), a przy `prefers-reduced-motion` natychmiast; przez te ~200 ms zwijania linki mają `tabIndex={-1}`, więc kolejność tabulacji jest poprawna także w trakcie animacji.

#### Mechanizm awarii (dlaczego)

`Navbar.tsx:121-123`: zamknięte menu to `max-h-0 opacity-0 pt-0 pointer-events-none`; klawiatura (Tab) przechodzi przez 3 niewidoczne linki, telefon, przełącznik języka i CTA, a czytnik ekranu czyta je jako dostępne. Na iOS VoiceOver „pointer-events: none" nie ukrywa niczego. Użytkownik klawiatury na telefonie z klawiaturą (albo desktop z zawężonym oknem) traci fokus w niewidocznym obszarze. Sam `inert` tego nie naprawia na naszym baseline: działa od Safari 15.5, a `build.target` trzyma `["es2019","safari13"]` (`code-build-target-policy`), więc na wspieranej przeglądarce degraduje się do braku efektu, a `aria-hidden` nie usuwa linków z kolejności tabulacji — dlatego zamknięty panel musi mieć `hidden` (ustawiane w `onTransitionEnd`, a przy reduced-motion natychmiast) albo `tabIndex={-1}` na każdej kontrolce w środku.

#### Niepoprawnie

```tsx
// Navbar.tsx:121-123
<div className={`sm:hidden … overflow-hidden ${isOpen ? "max-h-[420px] opacity-100 pt-4" : "max-h-0 opacity-0 pt-0 pointer-events-none"}`}>
  <nav>{LINKS.map((l) => <Link to={l.to}>…</Link>)}</nav>
</div>
```

#### Poprawnie

```tsx
const [isOpen, setIsOpen] = useState(false);
const [closing, setClosing] = useState(false);          // panel zostaje w DOM tylko na czas zwijania
const reduced = useReducedMotion();
const close = () => { setIsOpen(false); setClosing(!reduced); };   // reduced-motion: chowamy natychmiast

<button type="button" aria-expanded={isOpen} aria-controls="mobile-menu" aria-label={isOpen ? t.closeMenu : t.openMenu} onClick={() => (isOpen ? close() : setIsOpen(true))}>
  {isOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
</button>
<div id="mobile-menu" className="nav-panel" data-open={isOpen ? "true" : "false"}
     hidden={!isOpen && !closing}                        {/* TWARDY fallback: hidden działa na safari13, inert nie */}
     inert={!isOpen || undefined} aria-hidden={!isOpen}
     onTransitionEnd={() => setClosing(false)}>
  <nav aria-label={t.mobileNav}>
    {LINKS.map((l) => (
      <Link key={l.to} to={l.to} tabIndex={isOpen ? undefined : -1} onClick={close}>{l.label}</Link>   {/* także w trakcie zwijania poza tabulacją */}
    ))}
  </nav>
</div>
```
```css
.nav-panel { display: grid; grid-template-rows: 0fr; transition: grid-template-rows var(--duration-base) var(--ease-out); }
.nav-panel[data-open="true"] { grid-template-rows: 1fr; }
.nav-panel > * { overflow: hidden; }
@media (prefers-reduced-motion: reduce) { .nav-panel { transition: none; } }
```

#### Test

```bash
grep -rnE "pointer-events-none" site/src --include=*.tsx | grep -E "opacity-0|max-h-0"        # 0
grep -rnE "aria-controls=\"mobile-menu\"" site/src/components/layout/Navbar.tsx                  # 1
grep -rnE "inert=" site/src/components/layout/Navbar.tsx                                        # ≥ 1
# twardy fallback dla safari13 (sam inert nie wystarcza): hidden na panelu albo tabIndex={-1} na linkach
grep -nE "hidden=\{!isOpen|tabIndex=\{isOpen \? undefined : -1\}|tabIndex=\{-1\}" site/src/components/layout/Navbar.tsx   # ≥ 1
# Playwright 390×844: przy zamkniętym menu, Tab z wordmarku trafia na hamburger, potem na treść (nie na ukryte linki)
# DOCELOWO (skrypt planowany, jeszcze nie istnieje — dziś: NIE SPRAWDZANO): node .claude/skills/klarow-guardian/scripts/check-a11y.mjs --tab-order 390
```

Severity: HIGH.

#### Wyjątki

Elementy odmontowywane (`{open ? <Panel/> : null}`) nie potrzebują `inert`. Karty hubu ukryte filtrem używają `hidden` (patrz `code-state-in-url`), co spełnia tę regułę.

### 7.10 a11y-lang

**Atrybut lang na <html> w każdym statycznym HTML i po przełączeniu języka; fragmenty w drugim języku z własnym lang**

Impact: **HIGH** · Tagi: a11y, lang, i18n, prerender, screen-reader · Źródło: WCAG 2.2 §3.1.1 (Language of Page, poziom A) i §3.1.2 (Language of Parts, AA) / WIG „Accessibility" (vercel.md) / synthesis §2.7.2 (bramka verify-site: każdy HTML z lang) / CLAUDE.md (PL kanoniczne, EN przez przełącznik) / mechanizm ustawiania: `i18n-lang-before-paint` · Dodano: 2026-09-12 · Plik: `rules/a11y-lang.md`

#### Zasada

1. **Każdy** statyczny HTML z prerenderu (19 plików: `/`, `/narzedzia`, `/oferta`, `/faq`, `/rodo`,
   `404.html`, 13 × `narzedzia/<slug>.html`) ma `<html lang="pl">` zapisane w szablonie shellu,
   nie dokładane przez JS. Boty, czytniki i tryb czytania dostają język, zanim wstanie React.
2. Po przełączeniu języka `document.documentElement.lang` zmienia się na `en` / `pl` razem
   z treścią (mechanizm i moment ustawienia: `i18n-lang-before-paint`); atrybut nigdy nie
   znika i nigdy nie zostaje `pl` przy treści EN.
3. Wartość to dwuliterowy kod `pl` albo `en` (małe litery), spójnie w `<html lang>`,
   `og:locale` i `llms.txt`; bez mieszania `pl` i `pl-PL` w jednym serwisie.
4. **Fragment w drugim języku ma własny `lang`**: sekcja `lang="en"` w shellu prerenderu,
   angielskie cytaty, etykiety i bloki EN w `llms.txt` osadzone w DOM. Fragment bez `lang`
   czytany jest polską fonetyką.
5. Nazwy własne i kody (`KLAROW`, `KSeF`, `G703`, `ERP`) dostają `translate="no"`, a nie
   podmieniony `lang` (typografia i `translate`: `i18n-pl-typography` §7).
6. `<html lang>` nie jest miejscem na eksperymenty z `hreflang`: trasy `/pl/` `/en/` są
   odroczone (`seo-hreflang-deferred`), więc kanoniczny shell zostaje PL.

#### Mechanizm awarii (dlaczego)

- Brak `lang` to naruszenie WCAG 3.1.1 na poziomie A: VoiceOver i NVDA czytają polski tekst
  angielską fonetyką („kontroling" jako angielskie słowo), co dla osoby korzystającej z czytnika
  robi stronę niezrozumiałą. To jedno z niewielu naruszeń, które audytor zewnętrzny wychwytuje
  automatycznie w pierwszej minucie.
- Chrome bez `lang` zgaduje język i podsuwa tłumaczenie strony, które podmienia nazwy własne
  („KSeF" → „National e-Invoice System") i psuje copy, nad którym pracowaliśmy.
- Google używa treści, nie `lang`, do ustalenia języka, ale rozjazd (`lang="en"` przy treści PL)
  jest sygnałem niskiej jakości i psuje dobór wyników w SERP.
- Atrybut ustawiany dopiero przez Reacta nie istnieje dla botów bez JS i dla trybu czytania:
  cały sens prerenderu (19 HTML z pełną treścią) przepada w tym jednym atrybucie.
- Fragment EN bez `lang="en"` w sekcji dla botów brzmi w czytniku jak zniekształcony polski,
  a przy przełączniku EN cała strona zostaje z `lang="pl"` (Language of Parts, AA).

#### Niepoprawnie

```html
<html>                                   <!-- brak lang: WCAG 3.1.1 A -->
<html lang="PL">                         <!-- wielkie litery, niespójne z og:locale -->
<section>For English speakers: Klarow builds tools…</section>   <!-- fragment EN bez lang -->
```

```tsx
useEffect(() => { document.documentElement.lang = lang; }, [lang]);   // atrybut dopiero po hydracji; shell bez lang
```

#### Poprawnie

```html
<!-- scripts/prerender.mjs: szablon shellu -->
<html lang="pl">
  …
  <section lang="en" class="sr-only">Klarow builds tools for your process. First working result in days.</section>
```

```tsx
// LangProvider: atrybut idzie w parze ze stanem języka (skrypt inline ustawia go przed pierwszym renderem)
useEffect(() => {
  document.documentElement.lang = lang;          // "pl" | "en"
  document.documentElement.dataset.lang = lang;
}, [lang]);
```

#### Test

```bash
# każdy statyczny HTML ma lang (oczekiwane: brak wyjścia)
grep -L "<html[^>]*lang=" site/dist/*.html site/dist/narzedzia/*.html
# wartości spoza {pl, en}
grep -rhoE "<html[^>]*lang=\"[^\"]+\"" site/dist --include=*.html | sort -u | grep -vE "lang=\"(pl|en)\""
# fragmenty EN w shellu mają lang="en"
grep -rn "For English" site/src/prerender | grep -v 'lang="en"'
# bramka: verify-site raportuje [a11y-lang] per plik
node ".claude/skills/klarow-guardian/scripts/verify-site.mjs" | grep "a11y-lang"
```

Po przełączeniu języka w przeglądarce: `document.documentElement.lang` == `en`
(DevTools console), a `screenshots.mjs` robi zrzuty obu wersji.

#### Wyjątki

Brak. Także `404.html` i strony pomocnicze mają `lang`.

### 7.11 a11y-main-and-skip-link

**Landmarki: <main id="main"> na każdej trasie, skip-link jako pierwszy element, <nav> i <footer>**

Impact: **HIGH** · Tagi: a11y, landmarks, skip-link, keyboard, prerender · Źródło: WIG Accessibility („include skip link for main content"; semantic HTML before ARIA) / site-audit.md §3.2 p.1 (PageMain = div, shell ma <main>, React go usuwa) / synthesis a11y-landmarks, §2.7.2 (components/layout/SkipLink) · Dodano: 2026-09-12 · Plik: `rules/a11y-main-and-skip-link.md`

#### Zasada

Każda trasa renderuje dokładnie jeden `<main id="main" tabIndex={-1}>` (w `PageMain`, także dla `/narzedzia/:slug`, która dziś składa `<ToolPage/><Footer/>` bez `PageMain`), jeden `<header>` z `<nav aria-label="Główna">`, jeden `<footer>`. Pierwszym elementem w `#root` jest skip-link `<a href="#main" className="skip-link">Przejdź do treści</a>` (widoczny po fokusie, `{ pl, en }`). Shell prerendera i DOM po starcie Reacta mają tę samą strukturę landmarków; `main` w shellu (`entry.tsx:59`) nie może znikać po hydracji. Sticky navbar nie zasłania celu skip-linku: `html { scroll-padding-top: var(--nav-h) }`.

#### Mechanizm awarii (dlaczego)

`PageMain` w `App.tsx:696-698` to `<div style={{ paddingTop: 96 }}>`; po starcie Reacta strona nie ma `<main>` (shell prerendera go ma, ale `createRoot().render` podmienia `#root`). Czytnik ekranu nie może skoczyć do treści klawiszem landmarku, a użytkownik klawiatury musi tabulować przez cały navbar (wordmark, 3 linki, telefon, PL/EN, CTA) na każdej podstronie. Brak skip-linku to jedno z kryteriów WCAG 2.4.1 (Bypass Blocks); Lighthouse a11y ≥ 95 (kit DoD) nie przejdzie bez `main`. `id="main"` musi mieć `tabIndex={-1}`, inaczej Safari nie przenosi fokusu po kliknięciu kotwicy.

#### Niepoprawnie

```tsx
// App.tsx:696-698
function PageMain({ children }) { return <div style={{ paddingTop: 96 }}>{children}</div>; }
// App.tsx:831-839: podstrona bez PageMain
<Route path="/narzedzia/:slug" element={<><ToolPage /><Footer /></>} />
```

#### Poprawnie

```tsx
// components/layout/SkipLink.tsx
export function SkipLink() { const { lang } = useLang(); return <a href="#main" className="skip-link">{pick(lang, { pl: "Przejdź do treści", en: "Skip to content" })}</a>; }
// components/layout/PageMain.tsx
export function PageMain({ children }: { children: React.ReactNode }) { return <main id="main" tabIndex={-1} className="page-main">{children}</main>; }
// App.tsx: SkipLink pierwszy w .content-layer; każda trasa w PageMain; Footer poza main
<div className="content-layer"><SkipLink /><Navbar /><Routes>…</Routes><Footer /></div>
```
```css
.skip-link { position: absolute; left: 16px; top: -100px; z-index: 100; } .skip-link:focus-visible { top: 16px; }
html { scroll-padding-top: var(--nav-h, 64px); }
```

#### Test

```bash
# dist: dokładnie 1 <main i 1 skip-link per plik HTML
for f in $(find site/dist -name "*.html"); do m=$(grep -c "<main" "$f"); s=$(grep -c "skip-link" "$f"); [ "$m" = 1 ] && [ "$s" = 1 ] || echo "FAIL $f main=$m skip=$s"; done
grep -rnE "<main id=\"main\"" site/src --include=*.tsx | wc -l    # ≥ 1 (PageMain)
# DOM po JS (Playwright WebKit): document.querySelectorAll("main").length === 1 na każdej trasie
# DOCELOWO (skrypt planowany, jeszcze nie istnieje — dziś: NIE SPRAWDZANO): node .claude/skills/klarow-guardian/scripts/check-a11y.mjs --landmarks
```

Severity: HIGH.

#### Wyjątki

`dist/404.html` też ma `main` i skip-link (to zwykła trasa). Dialog rezerwacji renderuje się poza `main` (portal), co jest poprawne.

### 7.12 a11y-safe-area-dvh

**Bez przewijania poziomego na 390 px, min-height 100dvh z fallbackiem vh, env(safe-area-inset-*) na full-bleed, gutter ≥ 16 px**

Impact: **HIGH** · Tagi: a11y, layout, mobile, safe-area, dvh, overflow · Źródło: WIG Safe Areas & Layout (3 reguły) + Anti-patterns (user-scalable=no) / kit company-ui O1–O7 (overflow) / site-audit.md §3.3 / synthesis a11y-no-scroll-x, a11y-safe-area, §2.3 (gutter clamp(16px, 4vw, 40px)), T13 (strona działa na 390 px) · Dodano: 2026-09-12 · Plik: `rules/a11y-safe-area-dvh.md`

#### Zasada

1. Strona nigdy nie przewija się poziomo na 390 px (iPhone) ani 360 px (Android): każde dziecko gridu/flex ma `min-width: 0`, długie ciągi (`kontakt@klarow.com`, slugi, kwoty) mają `overflow-wrap: anywhere` lub `nowrap` w scrollboxie; tylko tabele dem, diagramy SVG i bloki kodu mogą być szersze, każdy w kontenerze `overflow-x: auto` z `overscroll-behavior: contain`. Gutter boczny ≥ 16 px na każdej szerokości (`padding-inline: clamp(16px, 4vw, 40px)` na jednym wrapperze).
2. Wysokość pełnoekranowa = `min-height: 100vh; min-height: 100dvh;` (fallback + dvh), nigdy `h-screen`/`height: 100vh` na treści (pasek adresu iOS zasłania dół).
3. Full-bleed (hero-media, navbar fixed, stopka, dialog) uwzględnia `env(safe-area-inset-top/bottom/left/right)` w paddingu; `viewport-fit=cover` w meta tylko razem z tymi paddingami.
4. `<meta name="viewport" content="width=device-width, initial-scale=1">` bez `user-scalable=no` i bez `maximum-scale=1`.
5. `.content-layer` bez `z-index`, `.bg-layer` `z-index: -1` (fix iOS 2026-07-26) zostaje; nowe elementy `position: fixed` nie trafiają do `.content-layer`.

#### Mechanizm awarii (dlaczego)

Przewijanie poziome na telefonie to najczęstsza regresja przy wideo hero (`min-width` klipu) i pasku liczb (4 kolumny `tabular-nums` bez zawijania); użytkownik dostaje „ruchomą" stronę i przypadkowe gesty wstecz. `height: 100vh` na iOS liczy pasek adresu jako widoczny, więc CTA hero ląduje pod krawędzią; `dvh` jest w Safari 15.4+, a `safari13` w targecie wymaga fallbacku (esbuild nie usuwa nieznanych jednostek, ale stary WebKit ignoruje linię z `dvh`, zostaje `vh`). Brak `safe-area-inset-bottom` na sticky stopce/dialogu chowa przycisk pod home-indicatorem iPhone'a. `user-scalable=no` blokuje zoom (WCAG 1.4.4) i jest w liście anty-wzorców WIG.

#### Niepoprawnie

```css
.hero { height: 100vh; }
.metrics { display: grid; grid-template-columns: repeat(4, 1fr); }   /* bez min-width: 0, liczby 4.5rem nie zawijają */
```
```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
```

#### Poprawnie

```css
.hero { min-height: min(72vh, 640px); min-height: min(72dvh, 640px); }
.container { padding-inline: clamp(16px, 4vw, 40px); }
.metrics { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); } @media (min-width: 1024px) { .metrics { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
.metrics > * { min-width: 0; } .metrics b { font-size: clamp(2.5rem, 6vw, 4.5rem); font-variant-numeric: tabular-nums; }
.nav { padding-top: env(safe-area-inset-top); } .dialog { padding-bottom: calc(16px + env(safe-area-inset-bottom)); }
.data-table-wrap { overflow-x: auto; overscroll-behavior-x: contain; }
h1 { overflow-wrap: anywhere; }
```

#### Test

```bash
grep -nE "user-scalable=no|maximum-scale=1" site/index.html                          # 0
grep -rnE "h-screen|height: ?100vh" site/src --include=*.tsx --include=*.css | grep -v "company-ui.css"   # 0
grep -rnE "100dvh" site/src/styles/*.css | wc -l; grep -rnB1 "100dvh" site/src/styles/*.css | grep -c "100vh"   # każda dvh ma vh obok
grep -nE "safe-area-inset" site/src/styles/*.css                                     # ≥ 2
# Playwright WebKit 390×844 i 360×800 na każdej trasie: document.documentElement.scrollWidth <= innerWidth
# PLANOWANE (F3, verify-site.mjs nie zna tego trybu): node .claude/skills/klarow-guardian/scripts/verify-site.mjs --no-scroll-x 390 360
```

Severity: HIGH (przewijanie poziome, `user-scalable=no`); safe-area i dvh-fallback: MEDIUM w raporcie.

#### Wyjątki

Tabele dem w scrollboxie (kit R1: „tabele data-dense na mobile scrollowalne poziomo = akceptowany wzorzec"); schemat `CollaborationFlow` (`minWidth: 1000` w `overflow-x: auto`).

### 7.13 a11y-faq-aria-controls

**Akordeon FAQ: button z aria-expanded + aria-controls, panel z id i region; odpowiedź zawsze w DOM**

Impact: **MEDIUM** · Tagi: a11y, faq, accordion, aria, seo · Źródło: WIG Accessibility (semantic HTML before ARIA) / site-audit.md §3.2 p.5 (Faq.tsx: aria-expanded jest, brak aria-controls/id) / CLAUDE.md sesja cz. 7 poprawka (3) (odpowiedzi ZAWSZE w DOM) / synthesis a11y-faq, §2.3 /faq (aria-controls + id) · Dodano: 2026-09-12 · Plik: `rules/a11y-faq-aria-controls.md`

#### Zasada

Każda pozycja FAQ (landing `/faq` i 4 Q&A per narzędzie) to: `<h3><button type="button" aria-expanded={open} aria-controls={panelId} id={btnId}>pytanie</button></h3>` + `<div id={panelId} role="region" aria-labelledby={btnId} className="faq-answer" data-open>…odpowiedź…</div>`. Odpowiedź jest ZAWSZE w DOM (zwijanie przez `grid-template-rows: 0fr/1fr` jak dziś w `globals.css:61-77`), nigdy przez warunkowy render; pod reduced-motion bez animacji. Identyfikatory pochodzą z `faq.ts` (`id: "cena"` → `faq-cena`, `faq-cena-panel`), żeby link `#faq-cena` otwierał pozycję. Ikona `ChevronDown` ma `aria-hidden`. Na podstronach narzędzi Q&A renderują się jako lista bez akordeonu (zawsze rozwinięte), co spełnia regułę.

#### Mechanizm awarii (dlaczego)

`Faq.tsx:29` ma `aria-expanded`, ale bez `aria-controls`/`id` czytnik ekranu nie wie, który region rozwija przycisk; VoiceOver nie oferuje skoku do panelu. Warunkowy render odpowiedzi (wersja sprzed cz. 7) zostawiał FAQPage JSON-LD bez pokrycia w treści (Google wymaga, by pytania i odpowiedzi z JSON-LD były widoczne w DOM), a LLM-y bez JS nie widziały odpowiedzi. Deep-link `#faq-dane` bez `id` na pozycji nie działa z LinkedIn.

#### Niepoprawnie

```tsx
<button type="button" aria-expanded={open} onClick={onToggle}>{q}</button>
<div className="faq-answer" data-open={open}>{open ? <p>{a}</p> : null}</div>   {/* warunkowy render */}
```

#### Poprawnie

```tsx
function FaqItem({ id, q, a, open, onToggle }: FaqItemProps) {
  const btnId = `faq-${id}`, panelId = `faq-${id}-panel`;
  return (
    <div className="faq-item" id={btnId.replace("faq-", "faq-item-")}>
      <h3 className="faq-q"><button type="button" id={btnId} aria-expanded={open} aria-controls={panelId} onClick={onToggle}>
        {q}<ChevronDown size={16} aria-hidden="true" className={open ? "rot" : ""} />
      </button></h3>
      <div id={panelId} role="region" aria-labelledby={btnId} className="faq-answer" data-open={open ? "true" : "false"}>
        <div><p className="t-muted">{a}</p></div>
      </div>
    </div>
  );
}
```

#### Test

```bash
grep -nE "aria-controls=" site/src/components/Faq.tsx site/src/components/FaqList.tsx 2>/dev/null   # ≥ 1
grep -nE "role=\"region\"" site/src/components/Faq.tsx site/src/components/FaqList.tsx 2>/dev/null   # ≥ 1
grep -nE "\{open \? <p|open && <" site/src/components/Faq.tsx site/src/components/FaqList.tsx 2>/dev/null   # 0
# dist/faq.html: liczba odpowiedzi w DOM = liczba pytań w JSON-LD FAQPage
# PLANOWANE (F3, verify-site.mjs nie zna tego trybu): node .claude/skills/klarow-guardian/scripts/verify-site.mjs --faq-coverage
```

Severity: MEDIUM (a11y); brak odpowiedzi w DOM = HIGH z `seo-jsonld-per-kind` (FAQPage bez pokrycia).

#### Wyjątki

Sekcja „Częste pytania o to narzędzie" na podstronie (lista bez zwijania) nie potrzebuje `aria-expanded`/`aria-controls`.

### 7.14 a11y-touch-targets-44

**Cele dotykowe ≥ 44×44 px, touch-action: manipulation, tap-highlight ustawiony, overscroll-behavior w dialogach**

Impact: **MEDIUM** · Tagi: a11y, touch, mobile, targets, gestures · Źródło: WIG Touch & Interaction (6 reguł) / WCAG 2.5.8 (24 px min) i Apple HIG (44 pt) / vercel.md §9.5 touch-* / synthesis a11y-touch, §2.4.8 (fallback pointer: coarse) · Dodano: 2026-09-12 · Plik: `rules/a11y-touch-targets-44.md`

#### Zasada

Każdy element interaktywny na `(pointer: coarse)` ma obszar kliknięcia ≥ 44×44 px (CSS: `min-height: 44px` na `.btn`, `.chip`, linkach nawigacji; ikony 16–24 px w kontrolce 44 px przez padding; w gęstych tabelach dem ≥ 32 px z odstępem ≥ 8 px). Globalnie `button, a, [role="button"] { touch-action: manipulation; }` (zdejmuje 300 ms opóźnienia double-tap) i `-webkit-tap-highlight-color: transparent` z własnym stanem `:active` (kit). Dialog, panele scrollowalne i tabele w scrollboxie mają `overscroll-behavior: contain`. Gesty (swipe, drag, pinch) nie są jedyną drogą do akcji: zawsze jest przycisk i klawiatura (WCAG 2.5.1); suwak tygodnia w `ProductionDashboard` ma przyciski „−/+" i strzałki. `autoFocus` tylko na desktopie, jednym polu, nigdy na mobile.

#### Mechanizm awarii (dlaczego)

Chipy filtrów `.st` mają wysokość ~22 px; na telefonie (główny kanał LinkedIn/QR, `strategy.md` §3.3) palec trafia w sąsiedni chip, a przełącznik PL/EN w navbarze (`px-2 py-1 text-[11px]`) ma ~24×20 px. Brak `touch-action: manipulation` daje 300 ms zwłoki kliknięcia na starszych WebKitach i sprawia, że szybkie kliknięcie CTA jest interpretowane jako zoom. Brak `overscroll-behavior: contain` w dialogu przewija stronę pod dialogiem (scroll chaining) i zamyka go na iOS przy „pull-to-refresh". `autoFocus` na mobile wysuwa klawiaturę i przewija stronę do pola, zanim użytkownik cokolwiek przeczyta.

#### Niepoprawnie

```tsx
<button className="px-2 py-1 text-[11px] rounded-full">EN</button>                 {/* ~24×20 px */}
<input type="range" onChange={setWeek} />                                        {/* tylko gest, brak przycisków */}
<textarea autoFocus />                                                            {/* mobile: klawiatura na starcie */}
```

#### Poprawnie

```css
:root { --tap: 44px; }
.btn, .chip, .nav a, .lang-switch { min-height: var(--tap); min-width: var(--tap); }
button, a, [role="button"], input, select, textarea { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
.dialog-body, .scrollbox, .data-table-wrap { overscroll-behavior: contain; }
@media (pointer: coarse) { .data-table td button { min-height: 32px; } }
```
```tsx
<div className="week-picker">
  <button type="button" className="btn btn-ghost" aria-label={t.prevWeek} onClick={() => setWeek((w) => w - 1)}><ChevronLeft size={16} aria-hidden="true" /></button>
  <input type="range" min={1} max={52} value={week} onChange={(e) => setWeek(Number(e.target.value))} aria-label={t.week} />
  <button type="button" className="btn btn-ghost" aria-label={t.nextWeek} onClick={() => setWeek((w) => w + 1)}><ChevronRight size={16} aria-hidden="true" /></button>
</div>
```

#### Test

```bash
grep -nE "touch-action: ?manipulation" site/src/styles/*.css                          # ≥ 1
grep -nE "tap-highlight-color" site/src/styles/*.css                                  # ≥ 1
grep -rnE "overscroll-behavior: ?contain" site/src/styles/*.css                       # ≥ 1
grep -rnE "autoFocus" site/src --include=*.tsx                                        # 0 (albo z komentarzem „desktop only" + matchMedia)
# Playwright 390×844 (pointer: coarse): getBoundingClientRect każdego a/button/input; fail gdy w < 44 || h < 44 (poza tabelami dem: 32)
# DOCELOWO (skrypt planowany, jeszcze nie istnieje — dziś: NIE SPRAWDZANO): node .claude/skills/klarow-guardian/scripts/check-a11y.mjs --targets 390
```

Severity: MEDIUM (raport); przełącznik języka i CTA w nav < 44 px = HIGH (ścieżka konwersji).

#### Wyjątki

Linki w akapicie prozy (inline) nie muszą mieć 44 px (WCAG wyłącza „inline"). Komórki tabel dem w trybie `tool`: 32 px z odstępem 8 px.

### 7.15 a11y-no-title-tooltips

**Zero atrybutu title jako tooltipa; nazwa dostępna przez aria-label, tooltip kitu widoczny na fokusie i dotyku**

Impact: **LOW** · Tagi: a11y, tooltip, title, touch, kit · Źródło: kit company-ui J1–J7 (tooltip nie title=) / WIG Accessibility (icon-only buttons need aria-label) / synthesis kit-a11y-micro · Dodano: 2026-09-12 · Plik: `rules/a11y-no-title-tooltips.md`

#### Zasada

Atrybut `title` nie jest używany do przekazywania informacji: nie działa na dotyku, nie jest ogłaszany spójnie przez czytniki, pojawia się z opóźnieniem ~1 s i znika przy ruchu myszy. Nazwa dostępna elementu ikonowego = `aria-label`; wyjaśnienie widoczne dla wszystkich = tekst obok ikony albo tooltip kitu (`.tip`) wyzwalany na `:hover` I `:focus-visible` I dotyk (kliknięcie), z `role="tooltip"` i `aria-describedby`. Skróty w tabelach dem (np. „ETC", „EAC") mają rozwinięcie w `<abbr>` z widoczną legendą pod tabelą, nie w `title`. Wyjątek: `title` na `<iframe>` (wymagany przez WCAG) i na `<svg><title>` jako fallback nazwy.

#### Mechanizm awarii (dlaczego)

Główny ruch ciepły to telefon (LinkedIn/QR): `title` na dotyku nie istnieje, więc informacja ginie u połowy odbiorców. Dla klawiatury `title` nie pojawia się po fokusie w Chromium; czytniki traktują `title` jako opis niskiego priorytetu i często go pomijają, gdy jest `aria-label`. Kit `company-ui` ma własny tooltip (J-lista), więc `title` byłby drugim, niespójnym wariantem (zasada #1: jedna implementacja).

#### Niepoprawnie

```tsx
<button title="Pobierz PDF"><Download size={16} /></button>
<th title="Estimate to Complete">ETC</th>
```

#### Poprawnie

```tsx
<button type="button" className="btn btn-ghost" aria-label={t.downloadPdf} aria-describedby="tip-pdf"><Download size={16} aria-hidden="true" /></button>
<span id="tip-pdf" role="tooltip" className="tip">{t.downloadPdfHint}</span>
<th><abbr>ETC</abbr></th> … <p className="legend"><b>ETC</b>: {t.etcLong} · <b>EAC</b>: {t.eacLong}</p>
```

#### Test

```bash
grep -rnE "\btitle=\"" site/src --include=*.tsx | grep -vE "<iframe|<svg|<title>"   # 0
grep -rnE "\btitle=\{" site/src --include=*.tsx | grep -vE "<iframe"                 # 0
```

Severity: LOW (raport). Auto-fix dozwolony: `title=` → `aria-label=` na kontrolkach ikonowych.

#### Wyjątki

`<iframe title>` (Cal.com embed w fazie 2), `<svg><title>` jako fallback, `<abbr title>` jest tolerowane, jeśli rozwinięcie jest też widoczne w legendzie.

## 8. SEO / prerender / GEO (19 plików HTML = 17 tras w sitemapie + `/rodo` z `noindex` + `404.html`, sitemap i llms generowane, meta, JSON-LD, nagłówki) (`seo`)

Domyślny impact: **HIGH** · tryb: marketing · właściciel audytu: `seo-auditor`

### 8.1 seo-links-in-dom

**Linki w DOM: hub ≥ 13 <a> do /narzedzia/<slug> zawsze (shell i po JS); home linkuje do 4 realizacji + hub; shell = DOM**

Impact: **BLOCKER** · Tagi: seo, internal-links, hub, prerender, dom, crawl · Źródło: site-audit.md §3.6 p.1 (ToolsGrid chowa 13 linków), §5 p.11 (rozdział treści bez duplikacji) / synthesis §2.3 Hub (13 kart zawsze w DOM, filtr = hidden), D-13 (home → 4 featured + hub), S5 (bramka shell-vs-DOM), seo-hub-links, seo-no-duplication · Dodano: 2026-09-12 · Plik: `rules/seo-links-in-dom.md`

#### Zasada

1. `dist/narzedzia.html` (shell) I DOM `/narzedzia` po starcie Reacta zawierają ≥ 13 elementów `<a href="/narzedzia/<slug>">` (po jednym na narzędzie; po fazie 2: 15). Filtry działu/typu ukrywają karty atrybutem `hidden`, nigdy nie odmontowują (`code-state-in-url`).
2. Home linkuje do dokładnie 4 pozycji `featured` (S3) + do huba `/narzedzia` + do `/oferta`, `/faq`, `/rodo` (stopka). Pełna lista 13 tylko na hubie (rozdział treści bez duplikacji: home nie powiela kart huba).
3. Każda podstrona narzędzia linkuje do 2 innych narzędzi (ten sam dział + inny dział) i do huba (breadcrumb „Realizacje i dema / {dział}").
4. Zbiór H1/H2/akapitów i linków wewnętrznych w shellu = zbiór w DOM po JS (bramka shell-vs-DOM, Playwright WebKit ze scratchpadu, faza 3).
5. Linki to `<a>`/`<Link>` z `href` (`a11y-controls-native`); żadnych linków wyłącznie w `onClick`.

#### Mechanizm awarii (dlaczego)

`ToolsGrid.tsx:71-119`: poziom 1 to 5 przycisków działów; linki do podstron pojawiają się po kliknięciu i tylko dla jednego działu. Prerender ma 13 linków, wyrenderowany DOM (Googlebot wykonuje JS i indeksuje DOM po renderze) ma 0. Google traktuje to jako rozjazd treści i traci 13 sygnałów linkowania wewnętrznego z najważniejszej strony hubowej; PageRank wewnętrzny do podstron long-tail (`toolsSeo.ts`, ~7 tygodni indeksacji) przestaje płynąć. Decyzja z 2026-07-26 „home bez linków do narzędzi" była poprawna dla duplikacji, ale D-13 ją koryguje: 4 linki z hookami nie duplikują treści podstron, a dają hubowi i podstronom sygnał z home.

#### Niepoprawnie

```tsx
if (openDept === null) return <div className="tools-strip">{DEPTS.map((d) => <button onClick={() => setOpenDept(d.key)}>…</button>)}</div>;   // 0 linków
```

#### Poprawnie

```tsx
<ul className="tool-grid">
  {tools.map((t) => (
    <li key={t.slug} hidden={!matches(t, dzial, typ)}>
      <Link to={`/narzedzia/${t.slug}`} className="card-link">
        <img src={t.media.thumb} width={640} height={400} loading="lazy" alt="" />
        <span className="t-heading">{t.name}</span><span className="t-muted">{t.hook}</span>
        <span className="chips"><span className="st">{proofLabel(t.kind)}</span><span className="st">{DEPT_LABEL[t.dept]}</span><span className="st">{t.delivery}</span></span>
      </Link>
    </li>
  ))}
</ul>
```

#### Test

```bash
grep -oE "href=\"/narzedzia/[a-z0-9-]+\"" site/dist/narzedzia.html | sort -u | wc -l     # ≥ 13
grep -oE "href=\"/narzedzia/[a-z0-9-]+\"" site/dist/index.html | sort -u | wc -l         # 4
grep -c "href=\"/narzedzia\"" site/dist/index.html                                          # ≥ 1
grep -c "href=\"/rodo\"" site/dist/index.html                                               # ≥ 1 (stopka)
# DOM po JS (Playwright WebKit): document.querySelectorAll('a[href^="/narzedzia/"]').length >= 13 na /narzedzia
node .claude/skills/klarow-guardian/scripts/verify-site.mjs --min-tool-links 13                 # shell hubu: ≥ 13 różnych linków /narzedzia/<slug>
# PLANOWANE (F3, verify-site.mjs nie zna tego trybu): node .claude/skills/klarow-guardian/scripts/verify-site.mjs --dom /narzedzia --expect-links 13
# PLANOWANE (F3, verify-site.mjs nie zna tego trybu): node .claude/skills/klarow-guardian/scripts/verify-site.mjs --shell-vs-dom / /narzedzia   # 0 rozjazdów
```

Severity: BLOCKER.

#### Wyjątki

Karty case dodane w fazie 2 (S7) zwiększają próg do 15; skrypt czyta liczbę z `getTools().length`, nie z literału.

### 8.2 seo-prerender-must-keep

**Prerender must-keep: 19 HTML z prerenderAll(), pusty #root w szablonie, id="seo-jsonld", podmiany jako funkcje**

Impact: **BLOCKER** · Tagi: seo, prerender, ssg, build, cloudflare · Źródło: CLAUDE.md „Architektura strony" + sesja cz. 7 (prerender, 7 poprawek) / site-audit.md §1.6, §5 p.1, p.9 / synthesis §2.2 (19 HTML: 4 + 13 + /rodo + 404), §2.8 p.1 / rozstrzygnięcie nadrzędne (1): trasa /rodo, dist/rodo.html · Dodano: 2026-09-12 · Plik: `rules/seo-prerender-must-keep.md`

#### Zasada

`npm run build` = `vite build` → `vite build --ssr src/prerender/entry.tsx --outDir dist-ssr` → `node scripts/prerender.mjs`. Niezmienniki, których żadna zmiana nie może naruszyć:
1. Liczba plików `dist/**/*.html` = liczba tras w `prerenderAll()` = **19**: `index.html`, `narzedzia.html`, `oferta.html`, `faq.html`, `rodo.html`, `404.html` + 13 × `narzedzia/<slug>.html` (faza 2 z kartami case: 21). Nowa trasa = wpis w `prerenderAll()` + `pagesSeo.ts` + link w Navbarze lub stopce; wpada do sitemapy i `llms.txt` automatycznie.
2. Szablon `dist/index.html` ma dokładnie PUSTY `<div id="root"></div>`; `prerender.mjs` rzuca, gdy go nie ma (twardy assert, nie usuwać).
3. JSON-LD wstrzykiwany z `id="seo-jsonld"` (klientowy `Seo.tsx` zdejmuje i wstawia własny); w każdym pliku dokładnie jeden `<script type="application/ld+json" id="seo-jsonld">`.
4. Wszystkie `String.prototype.replace` w `prerender.mjs` mają replacement jako FUNKCJĘ (treść zawiera `$'`, `$&`, `$1`: kwoty „$'000" w narzędziu USD rozwalały HTML).
5. Każdy plik: 1 `<main>`, 1 `<h1>`, pełna treść tekstowa bez JS (shell z `data/*`), sekcja `lang="en"`, brak `<video>` w shellu (poster `<img>`), brak `opacity:0` na treści.
6. `entry.tsx`: zero `window`/`document`/dat/losowości/`motion/*`; komponenty użyte w shellach są SSR-safe.

#### Mechanizm awarii (dlaczego)

Prerender jest jedynym powodem, dla którego Google/Bing/LLM-y widzą treść bez JS i dla którego strona degraduje się łaskawie, gdy JS nie wstanie (historia „samego tła" na iPhonie). Bez pustego `#root` shell dubluje się z treścią Reacta; bez `id="seo-jsonld"` po starcie Reacta strona ma PODWÓJNY JSON-LD, a po nawigacji SPA nieaktualny (poprawka (1) z cz. 7). Replacement-string interpretuje `$` (poprawka (2)): build zielony, HTML zepsuty. Brak wpisu w `prerenderAll()` dla `/rodo` = brak `dist/rodo.html` = soft-404 dla adresu, do którego odsyłają wszystkie szablony outboundu (peer-legal §1.1). Motion w `entry.tsx` wywala build SSR (`window is not defined`).

#### Niepoprawnie

```js
html = html.replace(/<\/head>/, head);                      // string: „$'000" w treści korumpuje HTML
html = html.replace('<div id="root"></div>', r.bodyHtml);   // j.w.
```
```tsx
// entry.tsx
import { m } from "motion/react-m";           // SSR build pada
const today = new Date().toISOString();       // niedeterministyczny HTML
```

#### Poprawnie

```js
html = html.replace(/<\/head>/, () => head);
if (!html.includes('<div id="root"></div>')) throw new Error(`Szablon bez pustego #root: ${r.file}`);
html = html.replace('<div id="root"></div>', () => `<div id="root">${r.bodyHtml}</div>`);
```
```tsx
// entry.tsx prerenderAll(): + { file: "rodo.html", path: "/rodo", title: PAGES_SEO.rodo.title.pl, description: PAGES_SEO.rodo.description.pl, jsonLd: [ORG_JSONLD], bodyHtml: renderToStaticMarkup(<RodoShell />) }
//                          + { file: "404.html", path: "/404", noindex: true, … bodyHtml: renderToStaticMarkup(<NotFoundShell />) }
```

#### Test

```bash
cd site && npm run build
find dist -name "*.html" | wc -l                                              # 19
for f in $(find dist -name "*.html"); do [ "$(grep -c 'id="seo-jsonld"' "$f")" = 1 ] || echo "FAIL jsonld $f"; [ "$(grep -c '<main' "$f")" = 1 ] || echo "FAIL main $f"; done
grep -c '<div id="root"></div>' index.html                                    # 1 (szablon źródłowy)
grep -nE "\.replace\([^)]*,\s*[^(=]*\)" scripts/prerender.mjs | grep -vE "=> " # 0 (każdy replace z funkcją)
grep -nE "window|document|Date\(|Math\.random|motion/" src/prerender/entry.tsx # 0
test -f dist/rodo.html && test -f dist/404.html && echo "OK rodo+404"
node ../.claude/skills/klarow-guardian/scripts/verify-site.mjs --expected 19   # liczba HTML w dist vs 19
# PLANOWANE (F3, verify-site.mjs nie zna tego trybu): node ../.claude/skills/klarow-guardian/scripts/verify-site.mjs --prerender
```

Severity: BLOCKER.

#### Wyjątki

`dist/404.html` jest prerenderowany, ale NIE trafia do `sitemap.xml` i ma `<meta name="robots" content="noindex">` (`seo-404-noindex-real-404`).

### 8.3 seo-redirects-registry

**Rejestr przekierowań: każdy alias 301/302 spisany w _redirects i w references; zmiana sluga tylko z 301**

Impact: **BLOCKER** · Tagi: seo, redirects, slugs, cloudflare-pages, aliases · Źródło: strategy.md B10 (13 URL-i stałe; zmiana tylko z 301) / synthesis §2.2 (_redirects: /realizacje 301, /start 302), S4, seo-slugs-stable / rozstrzygnięcie nadrzędne (1): /polityka-prywatnosci → /rodo 301 / site-audit.md §5 p.7, p.12 · Dodano: 2026-09-12 · Plik: `rules/seo-redirects-registry.md`

#### Zasada

`site/public/_redirects` jest jedynym miejscem przekierowań (Cloudflare Pages) i ma lustrzaną tabelę w `references/redirects-registry.md` (alias · cel · kod · powód · data · kto zdecydował). Stan obowiązkowy:
```
/polityka-prywatnosci   /rodo                     301   # kanoniczna trasa prawna = /rodo (rozstrzygnięcie 2026-09-12)
/realizacje             /narzedzia                301   # vanity LinkedIn
/realizacje/*           /narzedzia/:splat         301
/start                  /oferta?utm_source=qr     302   # wizytówki / QR (302: cel może się zmienić)
/*                      /index.html               200   # SPA fallback (lub zawężony, patrz seo-404-noindex-real-404)
```
13 slugów `/narzedzia/<slug>` z `tools.ts` jest stałych. Zmiana lub usunięcie sluga wymaga w JEDNYM commicie: wpisu `301 stary → nowy` w `_redirects` i rejestrze, zmiany w `tools.ts`/`toolsSeo.ts`, aktualizacji crosslinków, `prerenderAll()` (automatycznie przez `getTools()`), canonical nowej trasy. Alias nie jest prerenderowany, nie trafia do sitemapy ani do linków wewnętrznych (linkujemy zawsze do celu, nie do aliasu). Kolejność wierszy: konkretne przed `/*`.

#### Mechanizm awarii (dlaczego)

13 podstron narzędzi jest zaindeksowanych od lipca 2026 z long-tail meta i FAQ (`toolsSeo.ts`); zmiana sluga bez 301 = utrata pozycji i 404 dla linków z LinkedIn, maili outboundowych, postów bota i wizytówek QR. `/rodo` jest adresem wpisanym na sztywno w szablony outboundu (list papierowy, zaproszenie LinkedIn ≤ 300 zn., permission-mail, peer-legal §1.1), więc alias `/polityka-prywatnosci` (nazwa z wcześniejszej syntezy) musi prowadzić do niego, a nie odwrotnie. Przekierowanie wpisane tylko w Cloudflare dashboard (poza repo) ginie przy migracji i nie jest audytowalne; rejestr w repo jest.

#### Niepoprawnie

```ts
// tools.ts: slug zmieniony z "raport-zarzadczy" na "raport-dla-zarzadu" bez wpisu w _redirects
```
```
# _redirects: brak aliasu /rodo; link w stopce do /polityka-prywatnosci
```

#### Poprawnie

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

#### Test

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

#### Wyjątki

Aliasy testowe na preview deploy (nie na produkcji) nie wymagają wpisu w rejestrze.

### 8.4 seo-sitemap-llms-generated

**sitemap.xml i llms.txt wyłącznie generowane w buildzie; ręczny public/sitemap.xml nigdy**

Impact: **BLOCKER** · Tagi: seo, sitemap, llms, geo, build · Źródło: CLAUDE.md sesja cz. 7 („sitemap.xml i llms.txt GENEROWANE z tools.ts; public/sitemap.xml USUNIĘTY, nie odtwarzać!") / site-audit.md §5 p.2 / synthesis §2.8 p.1 (llms.txt z messaging.ts), §2.2 (priorytety: / 1.0, /narzedzia 0.9, /oferta 0.9, /faq 0.7, /rodo 0.3, narzędzia 0.8) · Dodano: 2026-09-12 · Plik: `rules/seo-sitemap-llms-generated.md`

#### Zasada

`dist/sitemap.xml` i `dist/llms.txt` powstają WYŁĄCZNIE w `scripts/prerender.mjs` z funkcji `sitemapXml()` i `llmsTxt()` w `src/prerender/entry.tsx`, które czytają `getTools()`, listę tras z `prerenderAll()` i `messaging.ts`. Plik `site/public/sitemap.xml` ani `site/public/llms.txt` nie istnieje i nie wolno go utworzyć (Vite skopiowałby go do `dist` i nadpisał generowany). Sitemapa zawiera dokładnie trasy z `prerenderAll()` **minus trasy z `noindex`**: dziś odpadają `404` i `/rodo` (strona ma `noindex` do zatwierdzenia treści przez radcę, D-21 — `legal-rodo-page-required` §Wyjątki), czyli **17 `<loc>` z 19 HTML**. Po zdjęciu `noindex` z `/rodo` (D-21) trasa wchodzi do sitemapy z priorytetem 0.3 i liczba `<loc>` rośnie do 18; to jedyny dopuszczalny moment zmiany progu w tej regule, w `seo-lastmod-from-git-not-now` i w bramce `verify-site.mjs`. `<lastmod>` z gita (`seo-lastmod-from-git-not-now`). `llms.txt` zawiera: opis firmy z `messaging.oneLiner`/`subtext`, filary, 13 narzędzi z linkami i hookami, sekcje `/narzedzia`, `/oferta`, `/faq`, `/rodo` (w `llms.txt` `/rodo` JEST, mimo `noindex` w sitemapie: to adres z szablonów outboundu, a `llms.txt` nie jest sygnałem indeksacji), kontakt z `contact.ts`, sekcję EN. `robots.txt` w `public/` wskazuje `Sitemap: https://klarow.com/sitemap.xml` (to jedyny statyczny plik SEO w `public/`).

#### Mechanizm awarii (dlaczego)

Ręczna sitemapa rozjeżdża się z trasami po pierwszym nowym narzędziu (dziś 13, jutro 15) i wysyła Google adresy 404 albo pomija nowe; Vite kopiuje `public/` do `dist/` PO buildzie klienta, ale PRZED prerenderem, więc generowany plik nadpisuje ręczny bez ostrzeżenia, a przy odwrotnej kolejności (`emptyOutDir`) ręczny nadpisuje generowany. `llms.txt` pisany ręcznie dryfuje od `messaging.ts` (T12: dryf przekazu między powierzchniami) i dziś zawiera „wyrosły na Excelu"/„Windows + Excel" (`entry.tsx:449-452, 491-494`), które schodzą z przekazu (D-02).

#### Niepoprawnie

```
site/public/sitemap.xml      ← ręcznie utrzymywany plik (usunięty 2026-07-23; nie odtwarzać)
site/public/llms.txt         ← j.w.
```
```tsx
// entry.tsx llmsTxt(): ręczna proza zamiast messaging.ts
return `# Klarow\n\n> Custom narzędzia pod proces dla firm 20–250 osób, które „wyrosły na Excelu" …`;
```

#### Poprawnie

```tsx
// entry.tsx
function sitemapXml(routes: RouteOut[], lastmod: Record<string, string>): string {
  const urls = routes.filter((r) => !r.noindex).map((r) =>
    `  <url><loc>${ORIGIN}${r.path === "/" ? "/" : r.path}</loc><lastmod>${lastmod[r.path]}</lastmod><priority>${r.priority}</priority></url>`);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<!-- GENEROWANE w buildzie (scripts/prerender.mjs) z prerenderAll(); nie edytuj ręcznie -->\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
}
function llmsTxt(pl: ToolItem[], en: ToolItem[]): string {
  return `# Klarow\n\n> ${MESSAGING.oneLiner.pl} ${MESSAGING.subtext.pl}\n\n${MESSAGING.pillars.map((p) => `- ${p.pl}`).join("\n")}\n…`;
}
```

#### Test

```bash
test ! -f site/public/sitemap.xml && test ! -f site/public/llms.txt && echo "OK: brak ręcznych plików"
grep -c "<loc>" site/dist/sitemap.xml                                        # 17 (19 HTML − 404 − /rodo noindex; po D-21: 18)
grep -c "klarow.com/rodo" site/dist/sitemap.xml                              # 0 do D-21 (noindex); po zdjęciu noindex: 1
grep -c "klarow.com/404" site/dist/sitemap.xml                               # 0
grep -ci "noindex" site/dist/rodo.html                                       # 1 (dopóki 0 w sitemapie, musi być 1 tutaj)
grep -nE "GENEROWANE" site/dist/sitemap.xml                                  # 1
grep -nE "Sitemap: https://klarow.com/sitemap.xml" site/public/robots.txt    # 1
grep -nE "wyros(ł|l)y na Excelu|Windows \+ Excel" site/dist/llms.txt         # 0 (po D-02)
node .claude/skills/klarow-guardian/scripts/verify-site.mjs                                    # m.in. sitemap ↔ dist, llms.txt z linkami do /narzedzia, /oferta, /faq, /rodo
# PLANOWANE (F3, verify-site.mjs nie zna tego trybu): node .claude/skills/klarow-guardian/scripts/verify-site.mjs --sitemap-llms
```

Severity: BLOCKER.

#### Wyjątki

`robots.txt`, `_headers`, `_redirects`, plik weryfikacji GSC (`google<token>.html`) są statyczne w `public/` z natury.

### 8.5 seo-404-noindex-real-404

**Trasa * → NotFound z noindex, prerender dist/404.html, zero soft-404 (błędny adres nie zwraca 200 z pustą stroną)**

Impact: **HIGH** · Tagi: seo, 404, noindex, cloudflare-pages, redirects · Źródło: site-audit.md §1.3 (brak trasy 404), §3.6 p.2 (soft-404 przez /* /index.html 200), §6 p.6 / synthesis §2.2 (404 → dist/404.html, noindex), §2.3 404 (H1 „Nie ma takiej strony."), L2 (czy Pages serwuje 404.html przy /* fallback) · Dodano: 2026-09-12 · Plik: `rules/seo-404-noindex-real-404.md`

#### Zasada

1. Router ma trasę `<Route path="*" element={<NotFound />} />`; `ToolPage` z nieznanym slugiem renderuje ten sam `NotFound` (nie własny komunikat). `NotFound` = H1 „Nie ma takiej strony." (EN: „There is no such page."), 1 linia, linki do `/narzedzia` i `/`; `<Seo>` ustawia `<meta name="robots" content="noindex">` i title z `pagesSeo.notFound`.
2. Prerender produkuje `dist/404.html` (shell `NotFoundShell`, `noindex`, bez canonical/og, poza sitemapą).
3. Cloudflare Pages musi zwracać STATUS 404 dla nieznanych ścieżek. Weryfikacja na preview (luka L2): `curl -I https://<preview>/nie-ma-takiej` → `404`. Jeśli `/* /index.html 200` w `_redirects` uniemożliwia to, fallback zawęża się do znanych prefiksów (`/narzedzia/*`, `/oferta`, `/faq`, `/rodo`, `/`) tak, by nieznane ścieżki trafiały w `404.html` Pages.
4. Wewnętrzne linki nigdy nie prowadzą do 404 (`verify-site.mjs` sprawdza każdy `href` z `dist` względem listy tras i plików w `public/`).

#### Mechanizm awarii (dlaczego)

Dziś `_redirects` ma tylko `/* /index.html 200`, a `Routes` (`App.tsx:826-840`) nie ma fallbacku: `klarow.com/cokolwiek` zwraca 200 z pustą stroną (soft-404). Google indeksuje takie adresy jako „miękkie 404", obniża ocenę jakości domeny i zużywa crawl budget na śmieci (literówki z LinkedIn, stare linki po zmianie slugów). Stan 200 na błędnym adresie uniemożliwia też Search Console raportowanie prawdziwych błędów linkowania.

#### Niepoprawnie

```tsx
<Routes>
  <Route path="/" element={<HomePage />} /> … <Route path="/narzedzia/:slug" element={<ToolPage />} />
</Routes>   {/* brak path="*" */}
```
```
# public/_redirects
/* /index.html 200
```

#### Poprawnie

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

#### Test

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

#### Wyjątki

Do czasu weryfikacji L2 na preview akceptujemy `/* /index.html 200` z prerenderowanym `404.html` (soft-404 dla SPA pozostaje długiem z datą w `DECISIONS.md`).

### 8.6 seo-canonical-og-twitter

**Canonical bez www i bez parametrów, og:* i twitter:* w prerenderze, og:image per trasa**

Impact: **HIGH** · Tagi: seo, canonical, open-graph, twitter, prerender, og-image · Źródło: site-audit.md §3.4 p.13 (twitter:* tylko klientowo), §5 p.3 (canonical bez www) / synthesis §2.8 p.3 (twitter:* w prerender.mjs), S9 (og.mjs: OG per trasa, faza 3), §2.3 Hub (canonical /narzedzia bez ?dzial=) / prerender.mjs:32-51 · Dodano: 2026-09-12 · Plik: `rules/seo-canonical-og-twitter.md`

#### Zasada

Każdy prerenderowany HTML (poza `404`) ma w `<head>`: `<link rel="canonical" href="https://klarow.com<path>">` (bez `www`, bez trailing slash poza `/`, bez query; hub z filtrem `?dzial=` kanonizuje do `/narzedzia`), `og:title`, `og:description`, `og:url` (= canonical), `og:type: website`, `og:site_name: Klarow`, `og:image` (1200×630, absolutny URL), `og:locale: pl_PL` (+ `og:locale:alternate: en_US`), `twitter:card: summary_large_image`, `twitter:title`, `twitter:description`, `twitter:image`. `prerender.mjs` zdejmuje z szablonu i wstawia komplet per trasa (dziś zdejmuje 6 tagów, `twitter:*` ustawia tylko klient). Klientowy `<Seo>` ustawia te same wartości po nawigacji SPA (scrapery bez JS czytają HTML, użytkownik dzielący link po nawigacji też dostaje poprawny `og:url`). `og:image` per trasa generowany deterministycznie (`scripts/og.mjs`, SVG → PNG, faza 3); do tego czasu jeden obraz `/klarow-logo-512.png` jest akceptowany z zastrzeżeniem, że 512×512 nie spełnia 1200×630 dla `summary_large_image` (raport LOW).

#### Mechanizm awarii (dlaczego)

`twitter:*` ustawiane wyłącznie w `Seo.tsx:51-53` nie istnieje w statycznym HTML, więc LinkedIn/Slack/Teams (scrapery bez JS) pokazują kartę bez tytułu lub z domyślnym tytułem szablonu; LinkedIn to główny kanał ciepłego ruchu (`strategy.md` §3.2). Canonical z parametrami filtrów tworzy w Google 10+ duplikatów huba. `og:url` różny od canonical rozdziela sygnały udostępnień między dwa adresy. Zdjęcie 512×512 na `summary_large_image` jest kadrowane do paska.

#### Niepoprawnie

```js
// prerender.mjs: brak twitter:* w head; og:image z szablonu (512×512) dla wszystkich tras
```
```tsx
<Seo path={`/narzedzia?dzial=${dzial}`} />   // canonical z parametrem
```

#### Poprawnie

```js
// prerender.mjs (fragment head; replacement jako funkcja)
const head = [
  `<title>${esc(r.title)}</title>`, `<meta name="description" content="${esc(r.description)}" />`,
  `<link rel="canonical" href="${url}" />`,
  `<meta property="og:title" content="${esc(r.title)}" />`, `<meta property="og:description" content="${esc(r.description)}" />`,
  `<meta property="og:url" content="${url}" />`, `<meta property="og:type" content="website" />`, `<meta property="og:site_name" content="Klarow" />`,
  `<meta property="og:locale" content="pl_PL" />`, `<meta property="og:locale:alternate" content="en_US" />`,
  `<meta property="og:image" content="${ORIGIN}${r.ogImage ?? "/og/default.png"}" />`,
  `<meta name="twitter:card" content="summary_large_image" />`, `<meta name="twitter:title" content="${esc(r.title)}" />`,
  `<meta name="twitter:description" content="${esc(r.description)}" />`, `<meta name="twitter:image" content="${ORIGIN}${r.ogImage ?? "/og/default.png"}" />`,
  r.noindex ? `<meta name="robots" content="noindex" />` : "",
  `<script type="application/ld+json" id="seo-jsonld">${jsonLdSafe(r.jsonLd)}</script>`,
].join("\n    ");
```
```tsx
<Seo path="/narzedzia" … />   // canonical stały; filtr w URL, ale nie w canonical
```

#### Test

```bash
for f in $(find site/dist -name "*.html" ! -name "404.html"); do
  for k in 'rel="canonical"' 'property="og:url"' 'property="og:image"' 'name="twitter:card"' 'name="twitter:title"'; do
    [ "$(grep -c "$k" "$f")" = 1 ] || echo "FAIL $k $f"; done; done
grep -ohE "rel=\"canonical\" href=\"[^\"]+\"" site/dist/**/*.html site/dist/*.html | grep -E "www\.|\?|/$" | grep -v "klarow.com/\"$"   # 0
grep -c "og:image" site/dist/index.html                                                         # 1
node .claude/skills/klarow-guardian/scripts/verify-site.mjs                                    # m.in. brak <link rel="canonical"> per plik HTML
# PLANOWANE (F3, verify-site.mjs nie zna tego trybu): node .claude/skills/klarow-guardian/scripts/verify-site.mjs --meta-tags
```

Severity: HIGH. Auto-fix dozwolony (fixer `seo-auditor`): dopisanie `twitter:*`/`og:locale` w `prerender.mjs`.

#### Wyjątki

`404.html`: canonical i og pominięte, `noindex` obowiązkowy. Do czasu `og.mjs` jeden wspólny `og:image` z raportem LOW o rozmiarze.

### 8.7 seo-jsonld-per-kind

**JSON-LD per rodzaj: Organization (+logo, sameAs, areaServed), ItemList na hubie, SoftwareApplication tylko demo, Service dla product/case, FAQPage z pokryciem w DOM**

Impact: **HIGH** · Tagi: seo, json-ld, schema, geo, faq · Źródło: site-audit.md §3.4 p.11 (SoftwareApplication price 0 także dla case), §3.6 p.5 (Organization bez logo/sameAs/address), §5 p.4 / synthesis §2.8 p.4, §2.3 podstrona (Service dla product/case), seo-jsonld / Seo.tsx:70-110 · Dodano: 2026-09-12 · Plik: `rules/seo-jsonld-per-kind.md`

#### Zasada

Jeden `<script type="application/ld+json" id="seo-jsonld">` per trasa (tablica bloków), generowany z tych samych danych co treść:
- `/`, `/narzedzia`, `/oferta`, `/rodo`: `Organization` z `name`, `url`, `logo` (`/klarow-logo-512.png`), `email`, `telephone` (`PHONE_E164` z `contact.ts`), `areaServed: ["PL","US"]`, `contactPoint`, `sameAs` (LinkedIn founderów po D-05), `description` = `messaging.oneLiner + subtext`.
- `/narzedzia`: dodatkowo `ItemList` z 13 `ListItem` (`position`, `url`, `name`) w kolejności DOM.
- `/narzedzia/<slug>`: `kind: "demo"` → `SoftwareApplication` (`applicationCategory: BusinessApplication`, `operatingSystem: "Web"`, BEZ `offers`; „Demo na danych przykładowych" w `description`); `kind: "product" | "case"` → `Service` (`serviceType`, `provider: Organization`, `areaServed`); zawsze `FAQPage` z 4 Q&A z `toolsSeo.ts`.
- `/faq`: `FAQPage` z `faq.ts` (8 pozycji po dodaniu 2 nowych).
- `404`: brak JSON-LD.
Każde pytanie/odpowiedź w `FAQPage` ma dosłowne pokrycie w DOM strony. Walidacja: Google Rich Results Test na 4 reprezentatywnych trasach (home, hub, demo, KSeF) przed publikacją.

#### Mechanizm awarii (dlaczego)

`toolJsonLd()` (`Seo.tsx:83-95`) daje `SoftwareApplication` z `offers.price: "0"` i `operatingSystem: "Windows"` także dla `kontroling-ksef` (`kind: "case"`), czyli deklaruje Google „darmową aplikację Windows", której nie ma; to semantyczny fałsz i ryzyko ręcznej akcji za wprowadzające dane strukturalne. `Organization` bez `logo`/`sameAs` nie kwalifikuje się do panelu wiedzy. `ItemList` na hubie to jedyny sposób, by Google zrozumiał 13 pozycji jako kolekcję (żaden z konkurencyjnych konceptów poza editorial go nie miał). `FAQPage` bez pokrycia w DOM = naruszenie wytycznych Google (poprawka (3) z cz. 7).

#### Niepoprawnie

```ts
// Seo.tsx:83-95: to samo dla demo i case
offers: { "@type": "Offer", priceCurrency: "PLN", price: "0", description: "Demo online" }, operatingSystem: "Windows",
```

#### Poprawnie

```ts
export function toolJsonLd(t: ToolItem, lang: Lang) {
  const base = { "@context": "https://schema.org", url: `${ORIGIN}/narzedzia/${t.slug}`, name: t.name, description: t.seo?.description ?? t.tagline, provider: ORG_REF };
  if (t.kind === "demo") return { ...base, "@type": "SoftwareApplication", applicationCategory: "BusinessApplication", operatingSystem: "Web" };
  return { ...base, "@type": "Service", serviceType: pick(lang, SERVICE_TYPE[t.category]), areaServed: AREA_SERVED };
}
export const itemListJsonLd = (tools: ToolItem[]) => ({ "@context": "https://schema.org", "@type": "ItemList",
  itemListElement: tools.map((t, i) => ({ "@type": "ListItem", position: i + 1, url: `${ORIGIN}/narzedzia/${t.slug}`, name: t.name })) });
export const ORG_JSONLD = { "@context": "https://schema.org", "@type": "Organization", name: "Klarow", url: ORIGIN, logo: `${ORIGIN}/klarow-logo-512.png`,
  email: EMAIL, telephone: PHONE_E164, areaServed: AREA_SERVED, sameAs: LINKEDIN_URLS, description: `${MESSAGING.oneLiner.pl} ${MESSAGING.subtext.pl}` };
```

#### Test

```bash
grep -c "\"@type\":\"ItemList\"" site/dist/narzedzia.html                                     # 1
grep -c "\"price\":\"0\"" site/dist/narzedzia/*.html | grep -v ":0"                            # brak (0 plików z price 0)
grep -l "\"@type\":\"Service\"" site/dist/narzedzia/kontroling-ksef.html                        # 1
grep -l "\"@type\":\"SoftwareApplication\"" site/dist/narzedzia/raport-zarzadczy.html           # 1
grep -oE "\"logo\":\"[^\"]+\"" site/dist/index.html                                              # 1
# pokrycie FAQPage w DOM + walidacja JSON: skrypt parsuje każdy #seo-jsonld, sprawdza JSON.parse i pokrycie tekstu
node .claude/skills/klarow-guardian/scripts/verify-site.mjs                                    # m.in. id="seo-jsonld" dokładnie 1 i JSON-LD, który się parsuje
# PLANOWANE (F3, verify-site.mjs nie zna tego trybu): node .claude/skills/klarow-guardian/scripts/verify-site.mjs --jsonld
```

Severity: HIGH.

#### Wyjątki

`ORG_JSONLD` nie ma `address` do czasu decyzji founderów o publicznym adresie JDG (D-05/D-21); `sameAs` pusta tablica jest pomijana, nie renderowana jako `[]`.

### 8.8 seo-pageseo-single-source

**pagesSeo.ts / toolsSeo.ts = jedyne źródło title i description; title ≤ 60 (narzędzia ≤ 62), description 130–165, PL + EN**

Impact: **HIGH** · Tagi: seo, meta, title, description, i18n, prerender · Źródło: pagesSeo.ts:1-8 (komentarz z limitami) / CLAUDE.md sesja cz. 7 poprawka (4) (title 71→60, description 210→160) / site-audit.md §5 p.6 / synthesis §2.8 p.3 (nowe meta bez „wyrosłych na Excelu"; index.html fallback = pagesSeo.home), seo-meta-single-source · Dodano: 2026-09-12 · Plik: `rules/seo-pageseo-single-source.md`

#### Zasada

Title i description każdej trasy żyją w jednym miejscu: `src/data/pagesSeo.ts` (`home`, `tools`, `oferta`, `faq`, `rodo`, `notFound`) i `src/data/toolsSeo.ts` (13 slugów), oba jako `{ pl, en }`. Konsumują je klientowy `<Seo>` i `prerenderAll()`; wartości w `dist/*.html` i po starcie Reacta są identyczne co do znaku. Limity twarde: title ≤ 60 znaków (narzędzia ≤ 62), description 130–165 znaków, w OBU językach; zero „—" (em-dash) w meta (`i18n-pl-typography`); nazwa marki w title jako „Klarow" (nie wordmark caps). `site/index.html` (szablon i fallback dla nieznanych tras) ma title/description/og równe `pagesSeo.home.pl`; rozjazd = błąd. Zmiana title/description = edycja jednego pliku + rebuild; nigdy literał w komponencie.

#### Mechanizm awarii (dlaczego)

Google ucina title po ~55–60 znakach i description po ~155–165: hak „Wdrożenie w dni" wypadał z 71-znakowego title (poprawka cz. 7). Dwa źródła (klient vs prerender) dawały już inne brzmienie leadu hero; przy meta to samo ryzyko plus rozjazd między snippetem Google (z HTML) a tytułem karty po nawigacji SPA. `index.html` dziś mówi „12 działających demo" i „wyrosłych na Excelu" (`index.html:7-18`), czyli inny przekaz niż `pagesSeo.home` po reframe. Brak `rodo` w `Record<"home"|"tools"|"oferta"|"faq", PageSeo>` = błąd typów przy dodaniu trasy, co jest dobrą bramką, o ile nikt nie rozluźni typu do `Record<string, …>`.

#### Niepoprawnie

```tsx
<Seo title="Klarow — automatyzacja danych i kontroling. Wdrożenie w dni, nie w miesiące." description={…} />   // literał, 71 zn., em-dash
```
```ts
export const PAGES_SEO: Record<string, PageSeo> = { … };   // typ rozluźniony: brak bramki na nową trasę
```

#### Poprawnie

```ts
// src/data/pagesSeo.ts
export type PageKey = "home" | "tools" | "oferta" | "faq" | "rodo" | "notFound";
export const PAGES_SEO: Record<PageKey, PageSeo> = {
  home: {
    title: { pl: "Klarow: narzędzia pod Twój proces. Działają w dni.", en: "Klarow: tools built around your process. Working in days." },
    // description zawiera DOSŁOWNIE MESSAGING.oneLiner (copy-one-liner-single-source) i NIE rozszerza obietnicy czasu (copy-honest-time-claims: nigdy „wdrażamy w dni")
    description: { pl: "Narzędzia pod Twój proces. Działają w dni, dane zostają u Ciebie. Kontroling, integracje (KSeF), importy z ERP, obieg dokumentów, panele. 12 dem na żywo." /* 153 zn. */, en: "Tools built around your process. Working in days, your data stays with you. Controlling, KSeF, ERP imports, document flow, dashboards. 12 live demos." /* 149 zn. */ },
  },
  rodo: { title: { pl: "RODO i prywatność: skąd mamy Twoje dane i jak je usunąć", en: "GDPR and privacy: where your data comes from and how to remove it" }, description: { pl: "…130–165 zn.…", en: "…" } },
  // …
};
```
```tsx
<Seo title={pick(lang, PAGES_SEO.home.title)} description={pick(lang, PAGES_SEO.home.description)} path="/" jsonLd={ORG} />
```

#### Test

```bash
# limity długości PL/EN (skrypt liczy znaki po NFC, bez tagów)
# DOCELOWO (skrypt planowany, jeszcze nie istnieje — dziś: NIE SPRAWDZANO): node .claude/skills/klarow-guardian/scripts/check-copy.mjs --meta-limits
# literały title/description w komponentach
grep -rnE "<Seo[^>]*title=\"" site/src --include=*.tsx                          # 0
# index.html fallback = pagesSeo.home.pl (skrypt porównuje po buildzie)
node .claude/skills/klarow-guardian/scripts/verify-site.mjs                                    # m.in. title ≤ 60 zn. i description 130–165 zn. per plik
# PLANOWANE (F3, verify-site.mjs nie zna tego trybu): node .claude/skills/klarow-guardian/scripts/verify-site.mjs --meta-fallback
# em-dash w meta
grep -nE "—" site/src/data/pagesSeo.ts site/src/data/toolsSeo.ts                # 0 (po sweepie)
# zakazana obietnica globalna w meta (copy-honest-time-claims: wolno „Działają w dni" / „pierwszy działający efekt w dni")
grep -nE "wdrażamy w dni|wdrożenie w dni" site/src/data/pagesSeo.ts site/src/data/toolsSeo.ts   # 0
# description nie jest przycinana w kodzie (copy-one-liner-single-source)
grep -nE "\.slice\(0, ?1[0-9][0-9]\)" site/src/data/pagesSeo.ts               # 0
grep -nE "Record<PageKey" site/src/data/pagesSeo.ts                             # 1
```

Severity: HIGH.

#### Wyjątki

`404` ma title/description w `pagesSeo.notFound`, ale nie ma `og:*` ani canonical (noindex). EN meta jest niewidoczne dla Google do czasu tras `/en/` (`seo-hreflang-deferred`), ale limity obowiązują już teraz (boty bez JS czytają sekcję EN).

### 8.9 seo-toolsseo-required-for-new-slug

**Nowy slug wchodzi do tools.ts dopiero z pełnym wpisem w toolsSeo.ts: title, description, 4 Q&A, PL i EN**

Impact: **HIGH** · Tagi: seo, tools, toolsSeo, long-tail, faq, i18n, data · Źródło: CLAUDE.md sesja cz. 7 (toolsSeo.ts: title ≤ 62, description 130–165, 4 pary Q&A, bramka skryptowa) / synthesis S7 (karty case tylko z pełnymi wpisami toolsSeo), §2.7.3 (delivery/outcome PL+EN; lint danych w verify-site.mjs) / judges conversion-seo (showreel: 3 slugi bez long-tail = thin pages) · Dodano: 2026-09-12 · Plik: `rules/seo-toolsseo-required-for-new-slug.md`

#### Zasada

Wpis w `BASE` w `src/data/tools.ts` (nowe demo, produkt własny, karta case) jest kompletny tylko razem z: (1) `TOOLS_SEO[slug].pl` i `.en` w `toolsSeo.ts`: `seo.title` ≤ 62 zn., `seo.description` 130–165 zn., dokładnie 4 pary `faq` (pytanie w formie, jaką wpisuje użytkownik; odpowiedź samowystarczalna do zacytowania przez LLM, 2–4 zdania, liczby tylko z `allowedNumbers`); (2) polami `delivery`, `outcome`, `stack`, `year`, `media.thumb`/`media.wide` (istniejące pliki w `public/thumbs`, `public/media/tools`), `kind` (`demo` | `product` | `case`), `hook` w `HOOKS`; (3) dla `case`: `client` jako typ firmy bez nazwy („firma produkcyjno-budowlana"), bez zrzutów i liczb; (4) dashboardem w mapie lazy dla `demo`. Brak którejkolwiek części = trasa nie wchodzi do `prerenderAll()` (a przy brakującym `toolsSeo[slug]` leci fallback, więc błąd jest cichy — dlatego grepy z sekcji Test są dziś jedyną bramką). Bramka skryptowa `verify-site.mjs --data-lint` jest PLANOWANA (F3).

#### Mechanizm awarii (dlaczego)

`getTools()` merguje `toolsSeo.ts` po slugu z fallbackami (`t.seo?.title ?? \`${t.name} — działające demo online | Klarow\``): brak wpisu nie psuje buildu, więc podstrona bez long-tailu, bez FAQ i z tagline'em jako description cicho trafia do 19 (21) HTML, sitemapy i `llms.txt`. To „thin page" (sędzia konwersji/SEO odrzucił showreel m.in. za 3 takie slugi): zła description w SERP, brak FAQPage, brak wejść z zapytań long-tail; przy 13 stronach jedna cienka obniża ocenę całej sekcji. Fallback title zawiera em-dash i „demo online" także dla `case`.

#### Niepoprawnie

```ts
// tools.ts: nowy wpis
{ id: 14, slug: "zamkniecie-tygodnia", icon: CalendarCheck, category: "kontroling", dept: "kontroling", dashboard: "weekclose", i18n: { pl: {…}, en: {…} } }
// toolsSeo.ts: brak klucza "zamkniecie-tygodnia" → fallbacki, 0 FAQ, title z „—"
```

#### Poprawnie

```ts
// tools.ts
{ id: 14, slug: "zamkniecie-tygodnia", icon: CalendarCheck, category: "kontroling", dept: "kontroling", kind: "demo", dashboard: "weekclose",
  delivery: { pl: "pilot 5–10 dni", en: "pilot in 5–10 days" }, outcome: { pl: "Tydzień zamknięty jednym przyciskiem, z backupem i logiem.", en: "…" },
  stack: ["React", "TypeScript"], year: 2026, media: { thumb: "/thumbs/zamkniecie-tygodnia-640.webp", wide: "/media/tools/zamkniecie-tygodnia-1280.webp" },
  i18n: { pl: {…}, en: {…} } },
// toolsSeo.ts
"zamkniecie-tygodnia": { pl: { seo: { title: "Zamknięcie tygodnia jednym przyciskiem: demo | Klarow", description: "…140 zn.…" }, faq: [ {q,a}, {q,a}, {q,a}, {q,a} ] }, en: { … } },
// HOOKS["zamkniecie-tygodnia"] = { pl: "Tydzień zamknięty jednym przyciskiem", en: "Close the week with one click" }
```

#### Test

```bash
# każdy slug z tools.ts ma wpis w toolsSeo.ts (PL i EN), 4 FAQ, limity długości, HOOK, media istnieją
# PLANOWANE (F3, verify-site.mjs nie zna tego trybu): node .claude/skills/klarow-guardian/scripts/verify-site.mjs --data-lint
# szybki grep: slugi bez wpisu
for s in $(grep -oE "slug: \"[a-z0-9-]+\"" site/src/data/tools.ts | cut -d'"' -f2); do grep -q "\"$s\": \{" site/src/data/toolsSeo.ts || echo "MISSING toolsSeo: $s"; grep -q "\"$s\": \{" site/src/data/tools.ts || echo "MISSING HOOK: $s"; done
# fallback title z em-dash nie może już istnieć w kodzie
grep -nE "działające demo online \| Klarow" site/src                        # 0 (po usunięciu fallbacku z „—")
```

Severity: HIGH (nowy slug bez kompletu = do naprawy przed merge; trasa nie wchodzi do sitemapy).

#### Wyjątki

Brak. Slug „szkic" na gałęzi roboczej może istnieć bez wpisu, ale `npm run check` na `main` go zablokuje.

### 8.10 seo-gsc-and-analytics

**Search Console + Cloudflare Web Analytics (cookieless) + zdarzenia CTA poza silnikami dem; zero GA4 bez banera**

Impact: **MEDIUM** · Tagi: seo, analytics, gsc, cloudflare, events, privacy, determinism · Źródło: strategy.md §7 (zero pomiaru dziś; KPI 90 dni; instrumentacja 1–7), D11 / synthesis D-16, §2.8 p.8 (zdarzenia cta_book_open, cta_mail, cta_tel, cta_worst_excel, demo_load_example, pdf_download, lang_toggle, founders_view, calc_tranche_run), L3 / CLAUDE.md „Do zrobienia" (GSC) · Dodano: 2026-09-12 · Plik: `rules/seo-gsc-and-analytics.md`

#### Zasada

1. Google Search Console: property domenowa `klarow.com` (rekord TXT w Cloudflare DNS) lub plik weryfikacji `public/google<token>.html`; `sitemap.xml` zgłoszony. Wpis w `references/integrations-registry.md`.
2. Pomiar odsłon i Core Web Vitals: Cloudflare Web Analytics (cookieless, bez banera) jako jeden `<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token":"…"}'>` w `index.html` (obowiązuje we wszystkich 19 HTML, bo szablon jest wspólny), ładowany `defer`, po treści; token nie jest sekretem, ale wpis w rejestrze integracji i w `/rodo` jest obowiązkowy.
3. Zdarzenia CTA: Cloudflare Zaraz (`zaraz.track("cta_book_open")`) albo własny endpoint `functions/api/e.ts` (Pages Function → Workers Analytics Engine); bez cookies, bez PII, bez identyfikatora użytkownika. Nazwy zdarzeń ze stałej listy w `src/lib/track.ts` (`cta_book_open`, `cta_mail`, `cta_tel`, `cta_worst_excel`, `demo_load_example`, `pdf_download`, `lang_toggle`, `founders_view`, `calc_tranche_run`); wywołania TYLKO w handlerach UI (przyciski, linki), NIGDY w `lib/**`, `dashboards/**`, `DemoReport.tsx` ani w silnikach (determinizm, T8).
4. GA4/Hotjar/Meta Pixel: zakaz bez decyzji founderów; wymagałyby banera zgody i wpisu w `/rodo` (`legal-analytics-cookieless-or-consent`).
5. UTM w kanałach (LinkedIn profil/wiadomość, mail, QR `/start`, posty bota) zamiast fingerprintingu.
6. `track()` jest no-op, gdy `navigator.doNotTrack === "1"` lub brak zgody tam, gdzie zgoda jest wymagana.

#### Mechanizm awarii (dlaczego)

Dziś strona nie ma żadnego pomiaru (`strategy.md` §7.1: 0 trafień beaconu, brak GSC, brak UTM): nie wiadomo, czy 17 tras jest zaindeksowanych, ile wejść daje LinkedIn, ile osób klika `mailto:`. Bez GSC nie da się ocenić efektów SEO (CLAUDE.md „po ~tygodniu ocena efektów"). Zdarzenie wysłane z wnętrza silnika (`aggregate()` w `lib/report.ts`) wprowadza sieć do kodu, który ma być deterministyczny i offline („zero chmury dostawcy" dotyczy dem tak samo jak narzędzi u klienta). GA4 bez banera to naruszenie art. 173 PT / PKE i RODO; Cloudflare Web Analytics nie stawia cookies i nie profiluje, więc banera nie wymaga (nadal: wpis w `/rodo`).

#### Niepoprawnie

```ts
// lib/report.ts
export function aggregate(rows) { fetch("/api/e?ev=report_run"); /* … */ }      // sieć w silniku
```
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXX"></script>   <!-- GA4 bez banera i wpisu w /rodo -->
```

#### Poprawnie

```ts
// src/lib/track.ts (UI-only; import zakazany w lib/** i dashboards/**)
export const EVENTS = ["cta_book_open", "cta_mail", "cta_tel", "cta_worst_excel", "demo_load_example", "pdf_download", "lang_toggle", "founders_view", "calc_tranche_run"] as const;
export type EventName = (typeof EVENTS)[number];
export function track(name: EventName, props?: Record<string, string | number>) {
  if (typeof window === "undefined" || navigator.doNotTrack === "1") return;
  window.zaraz?.track?.(name, props);   // albo navigator.sendBeacon("/api/e", JSON.stringify({ name, props }))
}
```
```tsx
<button type="button" className="btn btn-primary" onClick={() => { track("cta_book_open"); onBook(); }}>{pick(lang, MESSAGING.cta.primary)}</button>
```

#### Test

```bash
grep -rnE "track\(|zaraz|sendBeacon|fetch\(" site/src/lib site/src/components/dashboards site/src/components/DemoReport.tsx | grep -v "site/src/lib/track.ts"   # 0
grep -rnE "googletagmanager|gtag\(|hotjar|facebook\.net|clarity\.ms" site/src site/index.html site/dist 2>/dev/null   # 0
grep -c "static.cloudflareinsights.com" site/index.html                                          # 1 (po D-16)
ls site/public/google*.html 2>/dev/null | wc -l                                                  # 1 (albo TXT w DNS: wpis w rejestrze)
grep -nE "Cloudflare Web Analytics|Search Console" .claude/skills/klarow-guardian/references/integrations-registry.md   # ≥ 2
```

Severity: MEDIUM (brak pomiaru = raport); zdarzenie w silniku lub GA4 bez banera = BLOCKER (`demo-*` / `legal-*`).

#### Wyjątki

Do czasu `/rodo` (blokuje zdarzenia przez Zaraz/Function, nie CF Web Analytics) `track()` może być no-opem z komentarzem `/* D-16: aktywacja po /rodo */`.

### 8.11 seo-hreflang-deferred

**hreflang i trasy /pl/ /en/ odroczone (decyzja Karola); nie dodawać hreflang do jednego URL; EN tylko przez przełącznik i sekcję lang="en"**

Impact: **MEDIUM** · Tagi: seo, i18n, hreflang, routes, decision · Źródło: CLAUDE.md „2026-07-26" (trasy językowe ŚWIADOMIE ODROCZONE) + „ZNANE OGRANICZENIE" cz. 7 / strategy.md B3, D-16 / synthesis D-20, §2.8 p.6, p.10 / pagesSeo.ts:6-8 · Dodano: 2026-09-12 · Plik: `rules/seo-hreflang-deferred.md`

#### Zasada

Do decyzji D-20 (trasy `/pl/`, `/en/` build-time, plan §4.2): (1) PL jest kanoniczne; jeden URL serwuje PL w HTML i EN po przełączniku (`localStorage["klarow-lang"]`); (2) ZAKAZ dodawania `<link rel="alternate" hreflang="en">` wskazującego ten sam URL albo URL z parametrem `?lang=en`; (3) zakaz `?lang=` w linkach i canonicalu; (4) EN dla botów bez JS istnieje przez sekcję `<section lang="en">` w każdym shellu prerendera i sekcję „English" w `llms.txt`; (5) `<html lang="pl">` w statycznym HTML, `document.documentElement.lang` zmieniany przez `LangProvider` po przełączeniu (`i18n-lang-before-paint`). Wszystkie stringi już dziś są `{ pl, en }`, więc split build-time będzie mechaniczny: wtedy dochodzą `hreflang` x-default/pl/en, osobne canonicale, `og:locale`, sitemapa z `xhtml:link`, `pagesSeo`/`toolsSeo` EN stają się widoczne dla Google. Agent nie robi tego „przy okazji" (decyzja founderów).

#### Mechanizm awarii (dlaczego)

`hreflang` wskazujący ten sam adres dla dwóch języków jest błędem walidacji Google (Search Console: „brak tagów zwrotnych"/„nieprawidłowy kod języka") i może osłabić kanoniczność PL. Parametr `?lang=en` bez osobnego prerenderu produkuje duplikaty z identyczną treścią PL w HTML (crawler nie czyta `localStorage`). Przedwczesne trasy `/en/` bez 18 EN-shelli i EN-sitemapy to 18 „thin pages" naraz. Decyzja Karola z 2026-07-26 zamyka temat do osobnego kroku; próba dodania hreflang w rebuildzie mnoży zakres fazy 3 o ~2 dni bez zgody founderów.

#### Niepoprawnie

```html
<link rel="alternate" hreflang="en" href="https://klarow.com/?lang=en" />
<link rel="alternate" hreflang="pl" href="https://klarow.com/" />
```
```tsx
<Link to="/oferta?lang=en">Offer</Link>
```

#### Poprawnie

```tsx
// shell prerendera (entry.tsx): PL kanoniczne + sekcja EN dla botów bez JS
<main id="main" lang="pl">…</main>
<section lang="en" aria-label="English summary"><h2>{HOME.hero.h1.en}</h2><p>{HOME.hero.lead.en}</p>…</section>
```
```md
<!-- docs/DECISIONS.md D-20: trasy /pl/ /en/ + hreflang: ODROCZONE (Karol, 2026-07-26). Warunek: 19 EN-shelli, EN-sitemap, canonical per język. -->
```

#### Test

```bash
grep -rnE "hreflang" site/src site/index.html site/scripts site/dist 2>/dev/null   # 0 (do D-20)
grep -rnE "\?lang=" site/src site/dist 2>/dev/null                                  # 0
for f in $(find site/dist -name "*.html" ! -name "404.html"); do grep -q 'lang="en"' "$f" || echo "FAIL brak sekcji EN: $f"; done
grep -c '<html lang="pl">' site/dist/index.html                                    # 1
```

Severity: MEDIUM (raport); `hreflang` na wspólnym URL = HIGH (aktywna szkoda SEO).

#### Wyjątki

Po decyzji D-20 reguła zostaje odwrócona: `hreflang` staje się obowiązkowy dla każdej pary tras; ten plik dostaje wtedy nową wersję, a nie wyjątek.

### 8.12 seo-lastmod-from-git-not-now

**<lastmod> w sitemap z daty commitu pliku danych (git log), nigdy z Date.now() w buildzie**

Impact: **MEDIUM** · Tagi: seo, sitemap, lastmod, determinism, build · Źródło: site-audit.md §3.6 p.4 (brak lastmod), §6 p.12 (lastmod deterministycznie z gita, nie Date.now) / synthesis §2.8 p.1 (`git log -1 --format=%cI -- <plik danych>`) / CLAUDE.md #6 (determinizm jako obietnica; build powtarzalny) · Dodano: 2026-09-12 · Plik: `rules/seo-lastmod-from-git-not-now.md`

#### Zasada

Każdy `<url>` w `sitemap.xml` ma `<lastmod>` w ISO 8601 pochodzący z ostatniego commitu pliku, który definiuje treść trasy: `/` → `data/home.ts` + `messaging.ts`; `/narzedzia` → `data/tools.ts`; `/narzedzia/<slug>` → max(`tools.ts`, `toolsSeo.ts`); `/oferta` → `data/oferta.ts`; `/faq` → `data/faq.ts`; `/rodo` → `data/rodo.ts`. Źródło: `git log -1 --format=%cI -- <plik>` wykonane w `scripts/prerender.mjs` (Node `child_process.execFileSync("git", …)`, bez shella, bo ścieżka repo ma `&`). Gdy git jest niedostępny (Cloudflare Pages ma klon płytki, ale z historią `--depth`; przy braku historii): fallback = data z `package.json` pola `lastmod` aktualizowana ręcznie w PR z treścią, NIGDY `new Date()`. Dwa buildy tego samego commitu dają identyczny `sitemap.xml` (bramka).

#### Mechanizm awarii (dlaczego)

`Date.now()`/`new Date()` w buildzie stempluje każdą trasę datą deployu: Google widzi „wszystko zmienione dziś" przy każdym pushu, uczy się ignorować `lastmod` (oficjalnie: „lastmod musi być konsekwentnie wiarygodny, inaczej jest pomijany") i strona traci jedyny tani sygnał do ponownego crawlu podstron, które faktycznie się zmieniły. Niedeterministyczny build łamie też zasadę „dwa przebiegi = identyczny wynik" (CLAUDE.md #6), przez co diff `dist` między buildami jest bezużyteczny do weryfikacji deployu po treści (memory `klarow-cf-deploy-verify-by-content`).

#### Niepoprawnie

```js
const lastmod = new Date().toISOString().slice(0, 10);
urls.push(`<url><loc>${loc}</loc><lastmod>${lastmod}</lastmod></url>`);
```

#### Poprawnie

```js
// scripts/prerender.mjs
import { execFileSync } from "node:child_process";
const gitDate = (file) => {
  try { return execFileSync("git", ["log", "-1", "--format=%cI", "--", file], { cwd: site, encoding: "utf8" }).trim().slice(0, 10) || null; }
  catch { return null; }
};
const FALLBACK = JSON.parse(readFileSync(path.join(site, "package.json"), "utf8")).lastmod;   // "2026-09-12", edytowane w PR z treścią
const lastmodFor = (files) => files.map(gitDate).filter(Boolean).sort().at(-1) ?? FALLBACK;    // Node 24: at() OK w skrypcie
const lastmod = Object.fromEntries(routes.map((r) => [r.path, lastmodFor(r.sources)]));       // r.sources z prerenderAll()
```

#### Test

```bash
grep -nE "new Date\(|Date\.now\(" site/scripts/prerender.mjs site/src/prerender/entry.tsx     # 0
grep -c "<lastmod>" site/dist/sitemap.xml                                                     # 17 (= liczba <loc>; po D-21, gdy /rodo traci noindex: 18)
# determinizm buildu: dwa buildy, identyczna sitemapa
cd site && npm run build >/dev/null && cp dist/sitemap.xml /tmp/s1.xml && npm run build >/dev/null && diff /tmp/s1.xml dist/sitemap.xml && echo "OK deterministic"
# lastmod ≤ data ostatniego commitu repo
```

Severity: MEDIUM (raport); `Date.now` w buildzie = HIGH w `--fail-on`.

#### Wyjątki

Pole `ran_at` w JSONL raportów audytu (metadane, nie artefakt strony) może mieć bieżący czas.

## 9. PL + EN (`{ pl, en }` + `pick()`, kompletność par, limity długości, `lang`) (`i18n`)

Domyślny impact: **HIGH** · tryb: both · właściciel audytu: `copy-auditor`

### 9.1 i18n-lang-before-paint

**Język z localStorage ustawiany inline-skryptem w <head> przed pierwszym renderem (data-lang + html lang), bez mignięcia PL→EN**

Impact: **HIGH** · Tagi: i18n, hydration, flicker, prerender, localstorage · Źródło: RBP:rendering-hydration-no-flicker / vercel.md §9.1, §9.10, §13 (i18n.tsx:16 lang z localStorage decyduje o pierwszym renderze) / synthesis §2.8 p.6 (inline <script> data-lang PRZED pierwszym renderem), a11y-lang / i18n.tsx:16-33 · Dodano: 2026-09-12 · Plik: `rules/i18n-lang-before-paint.md`

#### Zasada

`site/index.html` ma w `<head>`, przed `<link rel="stylesheet">` i przed `<script type="module">`, krótki inline skrypt (ES5, try/catch), który czyta `localStorage["klarow-lang"]` i ustawia `document.documentElement.lang` oraz `document.documentElement.dataset.lang` na `en` lub `pl`. `LangProvider` inicjalizuje stan z `document.documentElement.dataset.lang` (nie z `localStorage` bezpośrednio), a CSS może reagować na `[data-lang="en"]` (np. ukrycie sekcji `lang="en"` shellu, gdy React jeszcze nie wstał, a użytkownik ma EN). Zapis do `localStorage` przy zmianie języka zostaje w efekcie `LangProvider`, klucz z wersją `klarow:lang:v1` (`client-localstorage-schema`), z `try/catch`. Prerenderowany HTML pozostaje PL (kanoniczne); mignięcie PL→EN jest dopuszczalne wyłącznie w treści shellu do czasu montażu Reacta, nigdy w `<html lang>`.

#### Mechanizm awarii (dlaczego)

`i18n.tsx:16-24` czyta `localStorage` w inicjalizatorze `useState`, a `document.documentElement.lang` ustawia w `useEffect` (L26-33). Dla użytkownika EN: statyczny shell (PL) → React montuje EN → `lang` zmienia się po efekcie. Skutek: przez ~100–300 ms czytnik ekranu i Google Translate widzą `lang="pl"` z treścią EN, a autokorekta/hyphenation działa według złego języka; przy wolnym JS użytkownik czyta PL, potem wszystko „przeskakuje" (RBP 6.5 HIGH). Ustawienie atrybutu przed paintem kosztuje 0 KB i eliminuje mismatch atrybutu korzenia; treść shellu i tak zostaje podmieniona przez `createRoot().render`.

#### Niepoprawnie

```tsx
// i18n.tsx
const [lang, setLang] = useState<Lang>(() => { try { const s = localStorage.getItem("klarow-lang"); if (s === "en" || s === "pl") return s; } catch {} return "pl"; });
useEffect(() => { document.documentElement.lang = lang; }, [lang]);   // po pierwszym renderze
```

#### Poprawnie

```html
<!-- site/index.html, w <head> przed arkuszem i modułem; ES5, bez zależności -->
<script>
  (function () {
    var l = "pl";
    try { var s = localStorage.getItem("klarow:lang:v1"); if (s === "en" || s === "pl") l = s; } catch (e) {}
    document.documentElement.lang = l;
    document.documentElement.setAttribute("data-lang", l);
  })();
</script>
```
```tsx
// i18n.tsx
const KEY = "klarow:lang:v1";
const initialLang = (): Lang => (typeof document !== "undefined" && document.documentElement.dataset.lang === "en" ? "en" : "pl");
const [lang, setLang] = useState<Lang>(initialLang);
useEffect(() => { try { localStorage.setItem(KEY, lang); } catch { /* incognito */ } document.documentElement.lang = lang; document.documentElement.dataset.lang = lang; }, [lang]);
```
```css
[data-lang="en"] .shell-pl { display: none; }   /* opcjonalnie: shell bez mignięcia PL dla użytkownika EN */
```

#### Test

```bash
grep -nE "data-lang" site/index.html                                    # ≥ 1 (inline w head)
grep -nB2 "data-lang" site/index.html | grep -c "<script>"               # inline <script>, nie module
grep -nE "localStorage\.getItem\(\"klarow-lang\"\)" site/src/i18n.tsx    # 0 (stary klucz bez wersji)
grep -nE "klarow:lang:v1" site/src/i18n.tsx site/index.html              # ≥ 2 (ten sam klucz)
# Playwright: ustaw localStorage en, przeładuj; document.documentElement.lang === "en" PRZED pierwszym paintem (evaluateOnNewDocument + DOMContentLoaded)
# DOCELOWO (skrypt planowany, jeszcze nie istnieje — dziś: NIE SPRAWDZANO): node .claude/skills/klarow-guardian/scripts/check-a11y.mjs --lang-before-paint
```

Severity: HIGH.

#### Wyjątki

Prerender (`entry.tsx`) nie zna języka użytkownika: shell zawsze PL + sekcja `lang="en"`; to jest zgodne z regułą do decyzji D-20.

### 9.2 i18n-pl-en-pair-required

**Każdy string UI = obiekt { pl, en } + pick(); zero gołych stringów PL/EN w JSX i w danych**

Impact: **HIGH** · Tagi: i18n, pl, en, data, pick, lint · Źródło: CLAUDE.md #5 (wzorzec { pl, en } + pick() z src/i18n.tsx) / site-audit.md §1.5 / vercel.md §9.10 KL:i18n-pair / synthesis brand-i18n-pair, §2.7.3 (delivery/outcome PL+EN; lint danych) · Dodano: 2026-09-12 · Plik: `rules/i18n-pl-en-pair-required.md`

#### Zasada

Każdy tekst widoczny lub czytany przez technologie asystujące (nagłówki, akapity, etykiety przycisków, `aria-label`, `alt`, placeholdery, komunikaty błędów, `title`/`description` meta, FAQ, hooki narzędzi, etykiety chipów, treść PDF) jest zdefiniowany jako `{ pl: string; en: string }` w `src/data/*.ts` albo w stałej `T` przy komponencie i renderowany przez `pick(lang, …)` (`src/i18n.tsx`). Typy danych wymuszają parę (`{ pl: string; en: string }`, nigdy `string`); pola opcjonalne są opcjonalne jako cała para, nie per język. W JSX nie ma literałów tekstowych z polskimi znakami ani angielskich zdań; w atrybutach `aria-label`/`alt`/`placeholder` też nie. Nazwy własne stałe w obu językach (`KLAROW`, `KSeF`, `G703`, `ERP`) są jednym stringiem z `translate="no"`. Kompletność par w `tools.ts`, `toolsSeo.ts`, `faq.ts`, `pagesSeo.ts`, `home.ts`, `oferta.ts`, `rodo.ts`, `messaging.ts` pilnują typy (`{ pl: string; en: string }`) oraz grepy z sekcji Test; bramka skryptowa `verify-site.mjs --data-lint` jest PLANOWANA (F3) i dziś nie istnieje — nie powołuj się na jej zielony wynik.

#### Mechanizm awarii (dlaczego)

Goły string PL w JSX pokazuje się użytkownikowi EN (i odwrotnie), a agent, który widzi jeden taki przypadek, tworzy kolejne; przy 19 trasach i 13 narzędziach tłumaczenie „na końcu" jest nierealne. Brak pary w danych nie psuje `tsc`, jeśli typ pozwala na `string`, więc bramka musi siedzieć w typach i w lincie danych. Trasy `/en/` (D-20) będą mechanicznym splitem tylko wtedy, gdy 100 % stringów ma parę już dziś. `aria-label` po polsku dla użytkownika EN czytnika ekranu to błąd dostępności, nie tylko kosmetyka.

#### Niepoprawnie

```tsx
<button aria-label="Zamknij"><X size={16} /></button>
<p className="t-muted">Dane fikcyjne, demo działa w przeglądarce.</p>
{lang === "pl" ? "Pobierz PDF" : "Download PDF"}                       // inline ternary zamiast pick
export const DELIVERY = "pilot 5–10 dni";                              // typ string
```

#### Poprawnie

```tsx
const T = { pl: { close: "Zamknij", note: "Dane fikcyjne, demo działa w przeglądarce.", pdf: "Pobierz PDF" }, en: { close: "Close", note: "Sample data, the demo runs in your browser.", pdf: "Download PDF" } } as const;
const t = pick(lang, T);
<button type="button" aria-label={t.close}><X size={16} aria-hidden="true" /></button>
<p className="t-muted">{t.note}</p>
```
```ts
export interface ToolBase { delivery: { pl: string; en: string }; outcome: { pl: string; en: string }; /* … */ }
```

#### Test

```bash
# gołe stringi PL w JSX (heurystyka: polskie znaki między > < lub w atrybutach tekstowych)
grep -rnE ">[^<{]*[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ][^<{]*<" site/src --include=*.tsx | grep -v "site/src/data/"        # 0
grep -rnE "(aria-label|alt|placeholder|title)=\"[^\"]*[a-zA-Ząćęłńóśźż]{3,}" site/src --include=*.tsx      # 0 (wartości przez {t.x})
grep -rnE "lang === \"pl\" \? \"" site/src --include=*.tsx                                                   # 0
# kompletność par w danych (skrypt: każdy obiekt z kluczem pl ma en i odwrotnie; puste stringi = fail)
# DOCELOWO (skrypt planowany, jeszcze nie istnieje — dziś: NIE SPRAWDZANO): node .claude/skills/klarow-guardian/scripts/check-copy.mjs --pairs
# PLANOWANE (F3, verify-site.mjs nie zna tego trybu): node .claude/skills/klarow-guardian/scripts/verify-site.mjs --data-lint
```

Severity: HIGH.

#### Wyjątki

Identyfikatory i wartości techniczne (`slug`, klucze, formaty dat w kodzie), nazwy własne z `translate="no"`, dane liczbowe dem. `demo/` (statyczna prezentacja HTML) jest poza `site/` i ma własny reżim (PL only, dozwolone).

### 9.3 i18n-pl-typography

**Typografia PL/EN: cudzysłowy „ " (PL) i “ ” (EN), zero em-dash „—" w UI/meta/PDF, półpauza tylko w prozie PL ≤ 1 na akapit, EN bez myślników jako interpunkcji, „…" nie „...", twarde spacje**

Impact: **HIGH** · Tagi: i18n, typography, em-dash, quotes, nbsp, pdf, copy · Źródło: taste.md §4.8 (EM-DASH BAN; 513 „—" + 44 „–" w site/src), §11.3 / synthesis D-09, §2.8 p.7 (em-dash sweep 621 „—"), brand-em-dash, brand-typography-pl / writing-command.md „Punctuation & typography" / WIG Typography / zadanie strażnika (półpauza w prozie ≤ 1/akapit) / peer-legal.md (PDF na Roboto, decyzja B) · Dodano: 2026-09-12 · Plik: `rules/i18n-pl-typography.md`

#### Zasada

1. Em-dash `—` (U+2014): ZAKAZ CAŁKOWITY w UI, danych (`tools.ts`, `toolsSeo.ts`, `faq.ts`, `pagesSeo.ts`, `home.ts`, `messaging.ts`, `rodo.ts`), meta, JSON-LD, `llms.txt`, `alt`, treści PDF (`pdfDoc` na Roboto; parametr `font` w API `PdfDoc.font`, domyślnie `"Roboto"`; krój UI w PDF dopiero po decyzji founderów o foncie v2, z trzema statycznymi TTF 400/700/italic). Zdanie przebudowujemy: kropka, dwukropek, przecinek, nawias.
2. En-dash `–` (U+2013) w PL: dozwolony (a) w zakresach liczbowych bez spacji („20–250 osób", „5–10 dni", „2018–2026"); (b) jako półpauza ze spacjami WYŁĄCZNIE w prozie (akapit ≥ 60 znaków), maksymalnie 1 na akapit; nigdy w nagłówkach, leadach hero, chipach, przyciskach, etykietach, meta title/description, `alt`, FAQ-pytaniach, stringach < 60 znaków. Dywiz ze spacjami „ - " jako pauza jest w PL błędem typograficznym (zakaz).
3. EN: zero `—` i zero ` – ` jako interpunkcji (Vercel writing); en-dash tylko w zakresach liczbowych („20–250-person").
4. Cudzysłowy: PL „ " (U+201E, U+201D), EN “ ” (U+201C, U+201D); zero prostych `"` w treści widocznej (w kodzie JSX używamy encji lub literału Unicode). Apostrof EN ’ (U+2019).
5. Wielokropek `…` (U+2026), nigdy `...`; stany ładowania kończą się `…` („Generuję PDF…").
6. Twarde spacje (` `): po jednoliterowych spójnikach i przyimkach w PL (a, i, o, u, w, z), między liczbą a jednostką („10 MB", „30 minut", „786 296 426"), w nazwach marek („KLAROW"), przed „zł"/„%”.
7. Nazwy własne/kody z `translate="no"`: `KLAROW`, `KSeF`, `G703`, `G702`, `ERP`, kody statusów.

#### Mechanizm awarii (dlaczego)

Em-dash jest najsilniejszym „AI tell" w tekście generowanym (taste §9.G: „#1 visual Tell in production tests"); w `site/src` było 513–621 wystąpień, czyli strona wygląda jak wygenerowana. Półpauza w nagłówku łamie się na końcu linii i daje osierocone znaki; w meta zjada limit 60/165 znaków. Proste `"` w treści renderują się różnie w SERP i w PDF (Roboto ma poprawne glify „ ", ale `"` wygląda jak cal). Brak twardej spacji zostawia „i" na końcu wiersza (błąd składu PL). `...` zamiast `…` to trzy znaki o innej szerokości i łamaniu. `translate="no"` zapobiega przetłumaczeniu `KSeF` na „KSeF (National e-Invoice System)" przez Chrome.

#### Niepoprawnie

```ts
title: { pl: "Klarow — automatyzacja danych i kontroling. Wdrożenie w dni." }       // em-dash w meta
hook: { pl: "Raport zarządu – w sekundy" }                                            // półpauza w krótkim stringu
a: 'Sprint kosztuje mniej niż dwa "etaty" - zwraca się przed końcem kwartału...'      // proste cudzysłowy, dywiz jako pauza, ...
```

#### Poprawnie

```ts
title: { pl: "Klarow: narzędzia pod Twój proces. Działają w dni." }
hook: { pl: "Raport zarządu w sekundy" }
a: "Sprint kosztuje mniej niż dwa miesięczne koszty etatu kontrolera – zwraca się przed końcem kwartału. Wynik jest deterministyczny: te same dane dają ten sam raport…"   // 1 półpauza w akapicie prozy, „…"
label: { pl: "Generuję PDF…", en: "Generating PDF…" }
<span translate="no">KSeF</span>; „20–250 osób"; "10 MB"; "w dni"
```

#### Test

```bash
# em-dash: 0 w źródłach danych, komponentach, dist, PDF-definicjach
grep -rnc "—" site/src site/dist 2>/dev/null | grep -v ":0$"                                   # pusto
# en-dash poza zakresami liczbowymi w krótkich stringach (< 60 zn.) i w nagłówkach/meta
# DOCELOWO (skrypt planowany, jeszcze nie istnieje — dziś: NIE SPRAWDZANO): node .claude/skills/klarow-guardian/scripts/check-copy.mjs --dashes       # fail: „—" wszędzie, „–" w stringach < 60 zn. lub > 1/akapit lub w EN poza zakresem
grep -rnE "[a-ząćęłńóśźż] - [a-ząćęłńóśźż]" site/src/data                                        # 0 (dywiz ze spacjami jako pauza)
grep -rnE "\.\.\." site/src/data site/src/components --include=*.ts --include=*.tsx | grep -vE "\.\.\.[a-zA-Z_{\[]"   # 0 (spread wykluczony)
grep -rnE ":\s*\"[^\"]*[^\\]\"[^\"]*\"" site/src/data/*.ts | grep -E "[a-ząćę]\"[a-ząćę]"        # proste cudzysłowy w treści: 0
grep -rnE "translate=\"no\"" site/src --include=*.tsx | wc -l                                    # ≥ 3 (KLAROW, KSeF, G703)
```

Severity: HIGH (em-dash, półpauza poza prozą, proste cudzysłowy w meta). Auto-fix dozwolony (fixer `copy-auditor`): `...` → `…`, `"x"` → „x", twarde spacje, `–` w zakresach; NIE dla przebudowy zdań z `—` (to zmiana treści, krok osobny: em-dash sweep 1 dzień).

#### Wyjątki

Kod, ścieżki, identyfikatory, wartości liczbowe ujemne (`-5 %`), minus w tabelach dem.

**Dokumenty wewnętrzne, które nigdy nie opuszczają Klarow** (np. `brief-<firma>.pdf` z generatora leadów, stopka „dokument wewnętrzny, nie przekazywać poza firmę"; notatki, plany w `.claude/work/`, raporty audytu): reguła ich nie obejmuje, bo nie są powierzchnią marki. Cytat z ogłoszenia czy z maila zostaje tam DOSŁOWNY, razem z oryginalną interpunkcją. Granicę wyznacza odbiorca, nie format: to samo `pdfDoc` generuje `klarow-<firma>.pdf` do koperty i ten dokument regule podlega w całości.

**Cytaty na powierzchniach publicznych** (case study, strona, one-pager handlowy, post): pauzę zamieniamy na dwukropek albo kropkę, brzmienie słów zostaje bez zmian, a cytat oznaczamy jako skrócony. Wierność interpunkcji nie jest tu argumentem, bo to nasz dokument handlowy, nie protokół.

### 9.4 i18n-sentence-case-headings

**Zdaniowa pisownia nagłówków, przycisków i etykiet w PL i EN; Title Case i CAPS tylko dla wordmarku i skrótów**

Impact: **MEDIUM** · Tagi: i18n, headings, sentence-case, copy, en · Źródło: writing-command.md „Headings" (sentence case H1–H6) vs WIG „Content & Copy" (Title Case; konwencja EN) / vercel.md §14 p.5 (decyzja: obie wersje zdaniowe) / synthesis §2.1 (sentence case PL i EN), brand-banned-words (Title Case w PL) / taste §9.F (ban eyebrow mono-caps) · Dodano: 2026-09-12 · Plik: `rules/i18n-sentence-case-headings.md`

#### Zasada

Wszystkie nagłówki (H1–H3), leady, etykiety przycisków, chipy, pozycje nawigacji i meta title są w pisowni zdaniowej w PL i w EN: pierwsza litera wielka, reszta według reguł języka („Co osiągniesz", „What you gain", „Umów 30 minut", „Book 30 minutes", „Realizacje i dema", „Work & demos"). Wielkie litery w środku wyłącznie dla nazw własnych i skrótów (`KSeF`, `ERP`, `G703`, `PDF`, `KPI`, nazwy firm). Zakaz: Title Case w EN („Book A Free Call"), CAPS jako styl (`text-transform: uppercase` na nagłówkach, eyebrow `UPPERCASE TRACKING`), wykrzykników w nagłówkach i CTA. Wyjątek wizualny: wordmark `KLAROW` (klasa `.brand-word`) i chipy statusów w dashboardach (`OK`, `UWAGA`, `BŁĄD`), które są skrótami-kodami.

#### Mechanizm awarii (dlaczego)

WIG (interfejsy EN, konwencja Chicago) mówi Title Case, Vercel writing (docs) mówi sentence case; dla dwujęzycznej strony PL kanoniczne + EN przez `pick()` dwie konwencje w jednym layoucie dają nagłówki o różnej „wadze" po przełączeniu języka. Title Case w PL nie istnieje (błąd ortograficzny: „Co Osiągniesz"). CAPS-eyebrow to zakazany wzorzec z taste §9.F i jeden z sygnałów „strony z szablonu"; `uppercase` psuje też czytelność polskich znaków diakrytycznych w małych rozmiarach i zwiększa szerokość nawigacji ponad limit 80 px wysokości / 1 linii.

#### Niepoprawnie

```ts
en: { h2: "What You Will Achieve", cta: "Book A Free Call", nav: "Work & Demos" }
pl: { h2: "Co Osiągniesz!", eyebrow: "REALIZACJE" }
```
```css
.section h2 { text-transform: uppercase; letter-spacing: .12em; }
```

#### Poprawnie

```ts
en: { h2: "What you gain", cta: "Book 30 minutes", nav: "Work & demos" }
pl: { h2: "Co osiągniesz", cta: "Umów 30 minut", nav: "Realizacje i dema" }
```
```tsx
<span className="brand-word" translate="no">KLAROW</span>   {/* jedyny CAPS na stronie marketingowej */}
```

#### Test

```bash
# Title Case w EN: ≥ 3 słowa z wielkiej litery pod rząd (poza skrótami)
# DOCELOWO (skrypt planowany, jeszcze nie istnieje — dziś: NIE SPRAWDZANO): node .claude/skills/klarow-guardian/scripts/check-copy.mjs --title-case
grep -rnE "en: \{[^}]*\"([A-Z][a-z]+ ){2,}[A-Z][a-z]+" site/src/data                     # przegląd: 0 poza nazwami własnymi
grep -rnE "text-transform: ?uppercase|\buppercase\b" site/src --include=*.tsx --include=*.css | grep -vE "brand-word|\.st\b|company-ui.css"   # 0
grep -rnE "[!]\"" site/src/data/home.ts site/src/data/messaging.ts site/src/data/oferta.ts 2>/dev/null   # 0 (wykrzykniki w copy)
```

Severity: MEDIUM (raport). Auto-fix dozwolony dla EN Title Case → sentence case w etykietach ≤ 5 słów.

#### Wyjątki

Skróty i nazwy własne; chipy statusów w trybie `tool`; wordmark. Cytaty (gdy powstaną) w oryginalnej pisowni.

## 10. Copy, typografia PL/EN, słowa zakazane, liczby ze źródłem, ton (`copy`)

Domyślny impact: **HIGH** · tryb: marketing · właściciel audytu: `copy-auditor`

### 10.1 copy-banned-claims

**Zakazane twierdzenia: „Deloitte/IDC", „oszczędzimy etat", „wdrożone u klientów" bez pokrycia, „stała cena" jako tag, kwoty per narzędzie, nazwa poprzedniej firmy**

Impact: **BLOCKER** · Tagi: copy, claims, legal, pricing, proof, brand · Źródło: peer-legal.md §1.3 (NIE cytować Deloitte/IDC; framing „oszczędzimy etat" zakazany) / CLAUDE.md #3, 2026-07-27 (zero kwot per narzędzie; „wycena po diagnozie", NIE „stała cena" jako tag) / strategy.md B1, B2, T13, §4.4 ZAKAZANE / synthesis brand-proof-labels (liczba mnoga „u klientów" do 2. klienta), brand-pricing, §1.7 p.14 · Dodano: 2026-09-12 · Plik: `rules/copy-banned-claims.md`

#### Zasada

Na stronie, w `llms.txt`, PDF-ach, szablonach outboundu i promptcie bota NIE wolno:
1. Cytować „raportu Deloitte/IDC o czasie traconym w Excelu" ani żadnej liczby bez zweryfikowanego oryginału (`copy-numbers-with-source`).
2. Framować oferty jako odejmowanie etatu: „oszczędzimy wam etat", „nie zatrudniajcie", „zastąpimy kontrolera", „redukcja zatrudnienia". Poprawna forma: „te 121 tys. zł kupuje analizę, a nie sklejanie arkuszy".
3. Pisać „wdrożone u klientów" / „nasi klienci" (liczba mnoga) przed drugim płacącym klientem; „Wdrożone" tylko z dowodem (etykieta `case` z `client` opisanym jako typ firmy); KSeF = „Własny produkt" (D-10).
4. Używać „stała cena" jako tagu/chipa/hero/meta; dozwolone wyłącznie jako wyjaśnienie wewnątrz `/oferta` („wycena po bezpłatnej diagnozie: stała cena za ustalony zakres, bez stawki godzinowej").
5. Podawać kwoty w PLN/USD/EUR za usługi lub narzędzia Klarow (ladder cen z planu §1.4 jest wewnętrzny); kotwice porównawcze z FAQ („mniej niż dwa miesięczne koszty etatu kontrolera", „moduł ERP 6+ miesięcy i od 100 tys. zł") są dozwolone jako porównanie, nie cennik.
6. Wymieniać nazwy poprzedniej firmy, jej klientów, nazwisk pracowników, realnych zrzutów (zasada #3); case = „firma produkcyjno-budowlana".
7. Obiecywać „AI" jako element liczenia ani wymieniać nazw dostawców i narzędzi AI. Regułą nadrzędną jest
   **`brand-no-ai-word-in-sales` (BLOCKER)** — tam jedyny wyjątek (odpowiedź FAQ „Czy AI liczy moje dane?")
   i kanoniczne brzmienie `MESSAGING.determinism`. Doprecyzowania, które obowiązują razem z nią:
   `MESSAGING.bannedWords.pl` zawiera co najmniej „AI liczy", „sztuczna inteligencja analizuje",
   „inteligentna analiza", „AI-powered", „asystent AI"; lista zakazanych nazw obejmuje także narzędzia
   z pipeline'u produkcji materiałów (Higgsfield, Manus), bo w copy brzmią jak dostawca liczenia;
   para ✕/✓ w S7 opisuje konkurencję bez tego słowa: „Wynik z modelu, za każdym razem może wyjść
   inaczej" → „Te same dane, ten sam wynik, co do grosza".
8. Obiecywać „wdrożenie w dni" globalnie dla integracji (`copy-honest-time-claims`).

#### Mechanizm awarii (dlaczego)

CFO, który poprosi o źródło „raportu Deloitte", dostaje ciszę i przestaje wierzyć w pozostałe liczby (peer-legal §1.3). Firma ogłaszająca wakat kontrolera właśnie wybrała człowieka; komunikat „oszczędzimy etat" mówi jej, że się pomyliła, i zamyka rozmowę. „Wdrożone u klientów" przy jednym własnym produkcie i zero płacących klientów to twierdzenie nieprawdziwe (sędzia marki odrzucił showreel m.in. za to). „Stała cena" w hero sugeruje cennik, którego nie ma, i kłóci się z „wyceną po diagnozie" (T13). Kwota per narzędzie zamyka rozmowę przed diagnozą i jest sprzeczna z modelem value-based (CLAUDE.md 07-27). Nazwa poprzedniej firmy przed umową IP = ryzyko prawne (plan §5.2).

#### Niepoprawnie

```ts
pl: "Według raportu Deloitte firmy tracą 30 % czasu w Excelu. Oszczędzimy Ci jeden etat: raport zarządczy od 4 900 zł, stała cena."
chip: "Stała cena"; badge: "Wdrożone u klientów"; caseTitle: "Wdrożenie w Nuconic"
```

#### Poprawnie

```ts
pl: "Nie proponujemy, żeby ten etat zniknął. Proponujemy, żeby te 121 tys. zł rocznie (8 350 × 12 × 1,2048; Sedlak & Sedlak 2026) kupowało analizę, a nie sklejanie arkuszy."
chip: "Wycena po diagnozie"; badge: MESSAGING.proofLabels.product /* „Własny produkt" */; caseClient: { pl: "firma produkcyjno-budowlana, PL/USA" }
ofertaPricing: { pl: "Wyceniamy po bezpłatnej diagnozie. Stała cena za zamrożony zakres, bez stawki godzinowej. Druga rata po działającym odbiorze." }
```

#### Test

```bash
grep -rniE "deloitte|\bidc\b" site/src site/dist site/public leadscout/*.md post-bot/worker.js 2>/dev/null   # 0
grep -rniE "oszczędzi(my|sz|cie)? (wam |ci |państwu )?etat|nie zatrudniaj|zastąpi(my)? (kontrolera|księgow)|redukcj[aę] (zatrudnienia|etat)" site/src site/dist leadscout post-bot 2>/dev/null   # 0
grep -rnE "u klientów|naszych klientów|our clients" site/dist 2>/dev/null   # 0 (do 2. klienta)
grep -rnE "\"(Stała cena|Fixed price)\"" site/src/data/*.ts                  # 0 (jako etykieta)
grep -rnoE "[0-9][0-9 .,]*(zł|PLN|USD|\$|€|EUR)" site/dist/*.html site/dist/narzedzia/*.html | grep -vE "narzedzia/(kalkulator-transz|billing-us-g703|obieg-przelewow|kontroling-kosztow|protokoly-robocizny|rejestr-umow|raport-zarzadczy)"   # tylko kotwice FAQ i liczby z listy
grep -rniE "nuconic" site/src site/dist site/public demo 2>/dev/null          # 0
# „AI", LLM i nazwy dostawców poza jedyną dozwoloną odpowiedzią FAQ (reguła nadrzędna: brand-no-ai-word-in-sales)
grep -rnwiE "AI|LLM|GPT|ChatGPT|Claude|Anthropic|OpenAI|Copilot|Higgsfield|Manus|sztuczn(a|ej) inteligencj" site/src/data site/dist 2>/dev/null | grep -viE "Czy AI liczy|Does AI compute|żaden model językowy|no language model"   # 0
grep -rn "determinism" site/src/data/messaging.ts | grep -iw "AI"             # 0 (zdanie o determinizmie bez „AI")
grep -nE "asystent AI|AI assistant" site/src/data/tools.ts                    # 0 (po D-04)
# DOCELOWO (skrypt planowany, jeszcze nie istnieje — dziś: NIE SPRAWDZANO): node .claude/skills/klarow-guardian/scripts/check-brand.mjs --claims
```

Severity: BLOCKER.

#### Wyjątki

Kwoty w danych dem (fikcyjne) i w kalkulatorze transz; kotwice porównawcze w FAQ (zatwierdzone w `allowed-numbers.md`). Wewnętrzne dokumenty w `docs/plan/` mogą zawierać ladder cen i nazwę poprzedniej firmy (nie są publikowane), pod warunkiem że repo jest prywatne (luka L1).

### 10.2 copy-numbers-with-source

**Każda liczba na stronie ma wpis w allowedNumbers (messaging.ts) i references/allowed-numbers.md ze źródłem; pokazuj działanie arytmetyczne**

Impact: **BLOCKER** · Tagi: copy, numbers, sources, proof, brand, legal · Źródło: CLAUDE.md #3 (zero liczb Nuconic przed umową IP) / strategy.md §4.4 (lista dozwolonych liczb), D7 / synthesis P4 (allowedNumbers z polem source), brand-allowed-numbers, §2.3 S5 (pasek liczb), D-07 / peer-legal.md §1.3 (liczby bezpieczne ze źródłem; „8 350 × 12 × 1,2048 ≈ 121 000") · Dodano: 2026-09-12 · Plik: `rules/copy-numbers-with-source.md`

#### Zasada

Każda liczba w treści widocznej (`dist/**/*.html`, `llms.txt`, PDF one-pagera, szablony outboundu) poza: danymi dem w dashboardach, datami, rokiem w stopce, NAP, numerami pozycji list i zakresami ICP z `messaging.subtext` (20–250) musi mieć wpis w `MESSAGING.allowedNumbers` (`{ value, pl, en, source, scope }`) i w `references/allowed-numbers.md` (tabela: liczba · brzmienie · źródło z rokiem · gdzie wolno · data dodania · kto zatwierdził). Liczby z wdrożeń poprzedniej firmy (D-07): zamrożony zestaw anonimowy („kilkanaście narzędzi", „≈10 000 wierszy kosztów z ERP/mies.", „~30 równoległych projektów", „raport w kilkanaście sekund zamiast godzin", „klienci w USA") TYLKO w istniejących opisach podstron i FAQ, nigdy na home; „15 narzędzi" dopiero po D-07. Liczby rynkowe (mediana wynagrodzenia kontrolera 8 350 zł, 20,48 % składek, 88 % arkuszy z błędami) cytowane ze źródłem z rokiem i, gdy wynikają z działania, z jawnym działaniem obok („8 350 × 12 × 1,2048 ≈ 121 000 zł"). Zero kwot za usługi Klarow (`copy-banned-claims`). Nowa liczba = decyzja founderów, nie agenta.

#### Mechanizm awarii (dlaczego)

Liczba bez źródła to najszybszy sposób utraty wiarygodności u CFO („skąd to?"), a liczba przypisywalna do poprzedniej firmy przed umową IP to ryzyko prawne (plan §5.2, zasada #3). Marka stoi na „kalkulator, nie wróżka": pokazanie działania obok wyniku pozwala czytelnikowi sprawdzić, a sprawdzenie to uwierzenie (peer-legal §1.3). Pasek „W liczbach" w językach programisty („89 testów", „Telegram") został odrzucony przez sędziego marki (R2). Bez mechanicznej listy każdy agent piszący copy dorzuca „o 40 % szybciej" z głowy.

#### Niepoprawnie

```ts
metrics: [{ value: "40%", pl: "mniej czasu na raporty" }, { value: "89", pl: "testów automatycznych" }, { value: "15", pl: "narzędzi u klientów" }]   // bez źródła; „u klientów" przed D-07; język programisty
faqAnswer: "Firmy tracą 30 % czasu w Excelu (raport Deloitte)."   // źródło niezweryfikowane
```

#### Poprawnie

```ts
// messaging.ts
allowedNumbers: [
  { value: "12", pl: "dem liczy na żywo na tej stronie", en: "live demos on this site", source: "tools.ts: 12 × kind demo", scope: ["home", "hub"] },
  { value: "kilkanaście", pl: "narzędzi w jednej firmie produkcyjno-budowlanej", en: "tools in one manufacturing & construction company", source: "strategy.md §4.4 (zamrożony zestaw anonimowy); „15" po D-07", scope: ["home"] },
  { value: "3 dni", pl: "od pierwszej linii kodu do działającego produktu", en: "from first line of code to a working product", source: "git własnego produktu KSeF 2026-06-14→16", scope: ["home", "kontroling-ksef"] },
  { value: "co do grosza", pl: "kontrola sum w każdym imporcie", en: "totals reconciled to the cent in every import", source: "lib/report.ts, lib/tranches.ts (dowód w demie)", scope: ["home", "hub"] },
  { value: "121 tys. zł", pl: "roczny koszt etatu kontrolera: 8 350 × 12 × 1,2048", en: "…", source: "Sedlak & Sedlak OBW 2026 (mediana 8 350 zł) + ZUS 2026 (20,48 %)", scope: ["oferta", "one-pager"] },
]
```
```tsx
<p>Roczny koszt etatu kontrolera: <b>≈ 121 tys. zł</b> <span className="t-muted">(8 350 zł × 12 × 1,2048; Sedlak & Sedlak 2026, ZUS 2026)</span></p>
```

#### Test

```bash
# skrypt wyciąga liczby z tekstu dist (poza dashboardami [data-surface="tool"], datami, NAP, rokiem) i porównuje z allowedNumbers[].value w dozwolonym scope
# DOCELOWO (skrypt planowany, jeszcze nie istnieje — dziś: NIE SPRAWDZANO): node .claude/skills/klarow-guardian/scripts/check-brand.mjs --numbers
# zamrożone liczby poza dozwolonym miejscem (home)
grep -nE "10 000|~30|30 równoległych|klienci w USA|15 narzędzi" site/dist/index.html   # 0
# każda pozycja allowedNumbers ma source i scope
node -e "const m=require('fs').readFileSync('site/src/data/messaging.ts','utf8'); const n=(m.match(/value:/g)||[]).length, s=(m.match(/source:/g)||[]).length; process.exit(n===s?0:1)" && echo "OK sources"
```

Severity: BLOCKER.

#### Wyjątki

Dane fikcyjne w dashboardach i PDF-ach dem (oznaczone „DEMO: dane fikcyjne"), daty, `© 2026`, NAP, `20–250 osób`, `30 minut`, `≤ 10 dni`, `50/50`, „dzień 0 / dni 1–4 / dzień 5" (mechanika oferty, źródło: plan §1.4; wpisane do listy raz).

### 10.3 copy-cta-labels

**Etykiety CTA: 1 etykieta na intencję, ≤ 3 słowa, „Umów 30 minut" / „Zobacz realizacje" / „Przyślij najgorszy Excel"; 1 primary na ekran**

Impact: **HIGH** · Tagi: copy, cta, labels, conversion, messaging · Źródło: synthesis §2.1 MESSAGING.cta (JEDYNA etykieta intencji), §1.7 p.7 (CTA biały płaski; „Umów 30 minut" w nav, hero, zamknięciu), brand-cta-one-label / taste „No Duplicate CTA Intent" / WIG „Content & Copy" (specific button labels) / strategy.md B4 (CTA = rezerwacja rozmowy 30 min) · Dodano: 2026-09-12 · Plik: `rules/copy-cta-labels.md`

#### Zasada

Trzy intencje, trzy etykiety, zero wariantów: rozmowa = `MESSAGING.cta.primary` „Umów 30 minut" / „Book 30 minutes" (nav, hero, zamknięcie S9, podstrony, `/oferta`, dialog); dowód = `MESSAGING.cta.secondary` „Zobacz realizacje" / „See our work" (hero ghost, S9 opcjonalnie); plik = `MESSAGING.cta.file` „Przyślij najgorszy Excel" / „Send us your worst spreadsheet" (tylko `/oferta` i podstrony narzędzi jako CTA drugorzędne, `mailto:` z tematem). Każda etykieta ≤ 3 słowa PL (EN ≤ 4), czasownik + obiekt, bez „!" i bez „teraz/dziś/za darmo". **Jedyny zatwierdzony wyjątek od limitu EN: `cta.file.en` „Send us your worst spreadsheet" (5 słów)** — skrócenie gubi adresata („send us"), a etykieta stoi wyłącznie w treści `/oferta` i podstron, nigdy w navbarze (limit jednej linii dotyczy `cta.primary`). Wyjątek jest zamknięty: nowych nie dodajemy, a bramka `--cta-labels` ma go na whiteliście. Na ekranie (viewport) jest dokładnie 1 przycisk `.btn-primary`; pozostałe CTA to `.btn-ghost`/link. Etykiety „Umów bezpłatną diagnozę", „Skontaktuj się", „Dowiedz się więcej", „Kliknij tutaj", „Wyślij", „Zobacz więcej" są zakazane. Stopka: `tel:`/`mailto:` jako linki tekstowe (NAP), nie przyciski. CTA emitują zdarzenie z `track()` (`seo-gsc-and-analytics`).

#### Mechanizm awarii (dlaczego)

Dziś strona ma „Umów bezpłatną diagnozę" (`BookingModal.tsx:23`), „Umów diagnozę", telefon jako CTA w hero i navbarze oraz różne warianty na podstronach; ta sama intencja z różnymi słowami rozmywa ścieżkę konwersji i kłóci się z „bezpłatną diagnozą 1-dniową za 3 500 zł" z drabinki (T14: na stronie „bezpłatna rozmowa 30 min" = szczebel 0). Dwa primary na ekranie (CTA + telefon-gradient) obniżają salience białego CTA (S3). „Dowiedz się więcej" nie mówi, co się stanie (WIG: specific labels). Etykieta > 3 słów łamie się na 390 px w navbarze (limit 1 linii, 56 px).

#### Niepoprawnie

```ts
nav: "Umów bezpłatną diagnozę"; hero: "Umów diagnozę"; closing: "Skontaktuj się z nami!"; card: "Dowiedz się więcej"; hub: "Zobacz więcej"
```
```tsx
<button className="btn btn-primary">Umów 30 minut</button> <a className="btn btn-primary" href={PHONE_HREF}>786 296 426</a>   {/* 2 primary */}
```

#### Poprawnie

```ts
cta: { primary: { pl: "Umów 30 minut", en: "Book 30 minutes" }, secondary: { pl: "Zobacz realizacje", en: "See our work" }, file: { pl: "Przyślij najgorszy Excel", en: "Send us your worst spreadsheet" } }
```
```tsx
<button type="button" className="btn btn-primary" onClick={() => { track("cta_book_open"); onBook(); }}>{pick(lang, MESSAGING.cta.primary)}</button>
<Link className="btn btn-ghost" to="/narzedzia">{pick(lang, MESSAGING.cta.secondary)}</Link>
<a className="btn btn-ghost" href={`${MAIL_HREF}?subject=${encodeURIComponent(t.worstExcelSubject)}`} onClick={() => track("cta_worst_excel")}>{pick(lang, MESSAGING.cta.file)}</a>
```

#### Test

```bash
# etykiety CTA w dist = tylko 3 dozwolone (skrypt zbiera tekst .btn-primary/.btn-ghost i porównuje z messaging.cta)
# DOCELOWO (skrypt planowany, jeszcze nie istnieje — dziś: NIE SPRAWDZANO): node .claude/skills/klarow-guardian/scripts/check-copy.mjs --cta-labels   # whitelista długości: cta.file.en = 5 słów (zatwierdzony wyjątek)
grep -rnE "Umów (bezpłatną )?diagnozę|Skontaktuj się|Dowiedz się więcej|Kliknij tutaj|Zobacz więcej|Learn more|Contact us|Get started" site/src/data site/dist 2>/dev/null   # 0
# 1 primary na ekran: liczba .btn-primary w każdej sekcji ≤ 1; w hero dokładnie 1
# DOCELOWO (skrypt planowany, jeszcze nie istnieje — dziś: NIE SPRAWDZANO): node .claude/skills/klarow-guardian/scripts/check-design.mjs --one-primary
grep -oE "class=\"[^\"]*btn-primary" site/dist/index.html | wc -l          # ≤ 3 (nav, hero, S9)
```

Severity: HIGH. Auto-fix dozwolony: podmiana wariantów etykiety na `MESSAGING.cta.*`.

#### Wyjątki

Dashboardy (tryb `tool`): przyciski akcji dem („Załaduj przykład", „Pobierz PDF", „Odtwórz") mają własne etykiety ≤ 3 słów; nie są CTA konwersji. Cal.com jako link zewnętrzny: etykieta nadal `cta.primary`.

### 10.4 copy-excel-as-symptom-not-identity

**Excel = symptom, wejście i hak; nigdy definicja klienta w H1, meta, JSON-LD, llms.txt, promptcie bota**

Impact: **HIGH** · Tagi: copy, excel, positioning, messaging, seo · Źródło: strategy.md T1, D2, §2.5 („Firmy, które wyrosły na Excelu" schodzi z H1/meta/JSON-LD/llms), §2.6 (mapa Excel-locka: 11 miejsc), §9 p.2 / synthesis D-02, §2.8 p.5, brand-excel-symptom / CLAUDE.md 2026-07-27 (reframe: szeroki wachlarz) · Dodano: 2026-09-12 · Plik: `rules/copy-excel-as-symptom-not-identity.md`

#### Zasada

Słowo „Excel" (i „arkusz", „Windows + Excel", „wyrosły na Excelu") NIE występuje w: H1, `pagesSeo.*`, `ORG_JSONLD.description`, `llms.txt` (nagłówek i opis firmy), `index.html` meta, prompcie bota, nagłówkach LinkedIn, chipach hero, sekcji „Co budujemy". Występuje WYŁĄCZNIE jako: (1) symptom w kartach bólu i FAQ „ERP" („gdzie ERP się kończy, a zaczyna Excel"); (2) wejście w opisach narzędzi (`tools.ts`: „wklejasz tabelę z Excela", „ERP → Excel bez przeklejania"); (3) hak sprzedażowy „Przyślij nam swój najgorszy Excel" na `/oferta`, na podstronach narzędzi (CTA drugorzędne) i w outboundzie; (4) przypis kwalifikatora na `/oferta`: „Narzędzia, które piszą do Twoich plików Excel, wymagają Windows + Excel na stanowisku; integracje i panele stawiamy na Twoim komputerze lub serwerze." Nowe FAQ „Czy to tylko Excel?" odpowiada „Nie". Wyróżnik „zero chmury" nie mówi „w Twoim Excelu", lecz „u Ciebie: na Twoim komputerze lub serwerze".

#### Mechanizm awarii (dlaczego)

Reframe 2026-07-27 przeniósł pozycjonowanie z „12 narzędzi dla firm wyrosłych na Excelu" na „budujemy pod proces: kontroling, integracje (KSeF, ERP), importy, obieg, panele". KSeF (Flask + SQLite + React na serwerze) nie ma nic wspólnego z Excelem; H1 z Excelem mówi CFO „to firma od makr", a integracje i panele wypadają z jego wyobrażenia (T1). Jednocześnie hak „najgorszy Excel" jest najskuteczniejszym otwarciem rozmowy (playbook: 4 szablony) i musi zostać, ale jako mechanizm, nie tożsamość. Mapa Excel-locka (`strategy.md` §2.6) wskazuje 11 miejsc do zmiany; audyt pilnuje, żeby nie wróciły.

#### Niepoprawnie

```ts
h1: { pl: "Automatyzacja i porządek w danych dla firm, które wyrosły na Excelu." }
description: { pl: "Porządek w danych dla firm 20–250 osób wyrosłych na Excelu. 12 działających demo…" }
zeroCloud: { pl: "Działa w Twoim Excelu, także bez internetu. Dane zostają w Twoim Excelu." }
llms: "> Custom narzędzia pod proces dla firm 20–250 osób, które „wyrosły na Excelu" (Windows + Excel)…"
```

#### Poprawnie

```ts
h1: MESSAGING.oneLiner   // „Narzędzia pod Twój proces. Działają w dni, dane zostają u Ciebie."
painCard: { pl: "Zamknięcie miesiąca to 3 dni sklejania arkuszy z ERP, magazynu i plików." }          // symptom
toolIo: { pl: "Wejście: tabela wklejona z Excela albo CSV. Wyjście: 3 KPI, wykres, tabela." }         // wejście
ofertaHook: { pl: "Przyślij nam swój najgorszy Excel. W 30 minut pokażemy, co da się z nim zrobić." } // hak
ofertaFootnote: { pl: "Narzędzia, które piszą do Twoich plików Excel, wymagają Windows + Excel na stanowisku; integracje i panele stawiamy na Twoim komputerze lub serwerze." }
faq: { q: "Czy to tylko Excel?", a: "Nie. Excel jest częstym wejściem, nie warunkiem. Budujemy integracje (KSeF, ERP, API), panele webowe i obiegi dokumentów na Twoim serwerze." }
```

#### Test

```bash
# Excel w miejscach zakazanych
grep -niE "excel|arkusz" site/src/data/pagesSeo.ts site/src/data/messaging.ts                       # 0
grep -oE "<h1[^>]*>[^<]*" site/dist/*.html site/dist/narzedzia/*.html | grep -i excel               # 0
grep -nE "\"description\":\"[^\"]*[Ee]xcel" site/dist/index.html                                    # 0 (JSON-LD Organization)
sed -n '1,8p' site/dist/llms.txt | grep -i excel                                                     # 0 (nagłówek llms)
grep -niE "wyros(ł|l)(y|a|e) na Excelu|Windows \+ Excel" site/src site/dist post-bot/worker.js 2>/dev/null | grep -v "site/src/data/oferta.ts"   # 0 (przypis tylko w oferta.ts)
# hak zostaje
grep -c "najgorszy Excel" site/dist/oferta.html                                                      # ≥ 1
```

Severity: HIGH.

#### Wyjątki

Karty bólu, FAQ „ERP" i „Czy to tylko Excel?", opisy wejść narzędzi, przypis na `/oferta`, hak w outboundzie i na podstronach. `demo/` (prezentacja M2) pozostaje bez zmian (historyczny).

### 10.5 copy-faq-single-source

**FAQ z jednego źródła (faq.ts + toolsSeo.ts): akordeon, FAQPage JSON-LD i prerender czytają te same obiekty; 8 pytań landingu, 4 per narzędzie**

Impact: **HIGH** · Tagi: copy, faq, geo, json-ld, data, single-source · Źródło: CLAUDE.md sesja cz. 7 (faq.ts JEDNO źródło; odpowiedzi zawsze w DOM; FAQPage JSON-LD) / strategy.md B9 / synthesis §2.3 /faq (+2: „Czy to tylko Excel?", „Czy AI liczy moje dane?"), seo-faq-in-dom / faq.ts:1-3 · Dodano: 2026-09-12 · Plik: `rules/copy-faq-single-source.md`

#### Zasada

`src/data/faq.ts` (`FAQ_I18N: { pl: FaqEntry[]; en: FaqEntry[] }`, `id` stabilne: `cena`, `dane`, `erp`, `makra`, …, `tylko-excel`, `ai-liczy`) jest jedynym źródłem FAQ landingu; `src/data/toolsSeo.ts` jedynym źródłem 4 Q&A per narzędzie. Konsumują je: komponent `FaqList` (akordeon z `aria-controls`, odpowiedzi zawsze w DOM), `faqPageJsonLd()` (JSON-LD FAQPage), `FaqShell`/`ToolShell` w prerenderze, `llms.txt` (link do `/faq`). Ta sama tablica trafia do wszystkich trzech; zakaz kopiowania pytań do komponentu, zakaz FAQ w JSON-LD bez dosłownej obecności w DOM i odwrotnie. Odpowiedź: 2–4 zdania, samowystarczalna do zacytowania przez LLM (nazywa mechanizm, nie „patrz wyżej"), liczby tylko z `allowedNumbers`, zero „—". Pytanie zapisane jako cytat obiekcji klienta jest dozwolone na landingu (wpis `cena`); cudzysłowy PL zostają w treści, a literał TS domykamy apostrofami na zewnątrz — `q: '„Za drogo."'`. Na podstronach pytania w formie wyszukiwania. Nowe pytanie = wpis w `faq.ts` (PL + EN) i nic więcej.

#### Mechanizm awarii (dlaczego)

Przed cz. 7 pytania żyły w komponencie, JSON-LD osobno, a warunkowy render odpowiedzi zostawiał FAQPage bez pokrycia (Google: „treść w danych strukturalnych musi być widoczna na stronie"); po naprawie jedno źródło gwarantuje, że akordeon, JSON-LD i shell zawsze mówią to samo. FAQ to główny materiał GEO (LLM-y cytują `FAQPage` i `llms.txt`); rozjazd między DOM a JSON-LD to ryzyko ręcznej akcji. Dwa nowe pytania (D-02, D-04) domykają reframe: „Czy to tylko Excel?" i „Czy AI liczy moje dane?" muszą być w tym samym pliku, inaczej nie trafią do JSON-LD ani do shellu.

#### Niepoprawnie

```tsx
// Faq.tsx
const ITEMS = [{ q: "Za drogo.", a: "…" }, …];                       // kopia poza faq.ts
<Seo jsonLd={faqPageJsonLd([{ q: "Czy to bezpieczne?", a: "…" }])} />   // pytanie, którego nie ma w DOM
{open ? <p>{a}</p> : null}                                            // odpowiedź poza DOM
```

#### Poprawnie

```ts
// data/faq.ts
export const FAQ_I18N = { pl: [
  { id: "cena", q: '„Za drogo."',        // apostrofy na zewnątrz: cudzysłów PL zamykający jest znakiem " i rozbiłby literał w podwójnych a: "Sprint kosztuje mniej niż dwa miesięczne koszty etatu kontrolera, a eliminuje jego 3–4 dni pracy co miesiąc. Dla porównania: moduł raportowy ERP to zwykle 6+ miesięcy i kwoty od 100 tys. zł. Nie sprzedajemy godzin: sprzedajemy zamknięty rezultat za stałą cenę ustaloną po diagnozie." },
  { id: "tylko-excel", q: "Czy to tylko Excel?", a: "Nie. Excel jest częstym wejściem, nie warunkiem. Budujemy integracje (KSeF, ERP, API), panele webowe i obiegi dokumentów na Twoim serwerze; narzędzia piszące do plików Excel wymagają Windows + Excel." },
  { id: "ai-liczy", q: "Czy AI liczy moje dane?", a: "Nie. Twoje liczby liczy zwykły, deterministyczny kod: te same dane dają ten sam wynik, a ścieżkę wyliczenia widzisz w narzędziu. Żaden model językowy nie dostaje Twoich danych." }   // jedyne dozwolone „AI" w copy sprzedażowym (brand-no-ai-word-in-sales §Wyjątki p. 1): pytanie + zaprzeczenie,
], en: [ /* te same id */ ] };
```
```tsx
const items = pick(lang, FAQ_I18N);
<Seo path="/faq" jsonLd={[faqPageJsonLd(items)]} /> <FaqList items={items} />   // ten sam obiekt
```

#### Test

```bash
grep -c "id: \"" site/src/data/faq.ts                                               # 16 (8 PL + 8 EN)
grep -nE "tylko-excel|ai-liczy" site/src/data/faq.ts | wc -l                        # 4
grep -rnE "const (ITEMS|FAQ|QUESTIONS) = \[" site/src/components --include=*.tsx     # 0
# pokrycie: każde name/text z FAQPage JSON-LD występuje dosłownie w tekście DOM tego samego pliku (dist/faq.html + 13 podstron)
# PLANOWANE (F3, verify-site.mjs nie zna tego trybu): node .claude/skills/klarow-guardian/scripts/verify-site.mjs --faq-coverage
grep -c "—" site/src/data/faq.ts                                                     # 0
```

Severity: HIGH.

#### Wyjątki

Podstrony narzędzi renderują Q&A jako listę bez akordeonu (zawsze rozwinięte); to spełnia regułę. `llms.txt` nie kopiuje treści FAQ (tylko link), żeby nie dublować.

### 10.6 copy-honest-time-claims

**Obietnica czasu: „pierwszy działający efekt w dni" + etykieta delivery per realizacja; integracje etapami; nigdy „wdrożenie w dni" globalnie**

Impact: **HIGH** · Tagi: copy, time, delivery, claims, tools, honesty · Źródło: strategy.md T5, D3 (delivery_days per karta; plan §5.3/§5.5) / synthesis D-03, §2.1 filar „days" („Pierwszy działający efekt w dni."), §2.7.3 (`delivery: { pl, en }`), §2.3 podstrona (etykieta „Health-Check 48 h → pilot etapami" dla KSeF), brand-proof-labels / plan-strategiczny §5.3, §5.5 (hook prawdziwy tylko dla części katalogu) · Dodano: 2026-09-12 · Plik: `rules/copy-honest-time-claims.md`

#### Zasada

1. Obietnica globalna brzmi wyłącznie „Pierwszy działający efekt w dni" (filar 2) i „Działają w dni" w `oneLiner`; zakotwiczona w mechanice Pilotu: dzień 0 zakres zamrożony, dni 1–4 budowa na kopii, dzień 5 pokaz na Twoich danych, odbiór ≤ 10 dni roboczych.
2. Każda karta i podstrona narzędzia ma pole `delivery: { pl, en }` z `tools.ts` renderowane jako chip: dema/proste narzędzia „pilot 5–10 dni"; integracje (KSeF, ERP, API) „etapami" / „Health-Check 48 h → pilot etapami"; obieg dokumentów „pilot + wdrożenie etapami". Chip jest widoczny w hubie, na podstronie i w S3.
3. Zakazane: „wdrożenie w dni" jako obietnica dla całej integracji, „w 5 dni" bez kontekstu pilotu, „natychmiast", „od ręki", „w 24 h" bez źródła w mechanice oferty, „dni nie miesiące" bez dopełnienia o pierwszym efekcie.
4. Liczby czasu poza mechaniką oferty (30 minut, dzień 0/1–4/5, ≤ 10 dni, 48 h Health-Check, 3 dni KSeF) wymagają wpisu w `allowedNumbers`.

#### Mechanizm awarii (dlaczego)

Plan §5.3 i §5.5 mówią wprost: hak „w dni" jest prawdziwy dla części katalogu; integracja KSeF to Health-Check, potem etapy. Klient, który przeczytał „wdrożenie w dni" i dostał harmonogram etapami, uzna, że został wprowadzony w błąd przy pierwszej rozmowie (T5: „utrata wiarygodności przy pierwszej integracji"). Etykieta `delivery` per karta pozwala utrzymać mocny hak na home bez fałszu na podstronie; bez pola w danych każdy agent pisze czas z głowy.

#### Niepoprawnie

```ts
hero: { pl: "Wdrożenie w dni, nie w miesiące." }                     // globalnie, bez „pierwszy efekt"
tool: { slug: "kontroling-ksef", tagline: { pl: "Integracja z KSeF wdrożona w 5 dni." } }   // integracja „w dni"
card: "Od ręki", "Natychmiastowe wdrożenie"
```

#### Poprawnie

```ts
pillars[1]: { pl: "Pierwszy działający efekt w dni.", en: "First working result in days." }
tools: [
  { slug: "raport-zarzadczy", delivery: { pl: "pilot 5–10 dni", en: "pilot in 5–10 days" } },
  { slug: "kontroling-ksef", kind: "product", delivery: { pl: "Health-Check 48 h, potem etapami", en: "48 h health check, then in stages" } },
  { slug: "rejestr-umow", delivery: { pl: "pilot 5–10 dni, wdrożenie etapami", en: "pilot in 5–10 days, rollout in stages" } },
]
steps: [{ pl: "Rozmowa 30 minut" }, { pl: "Zakres zamrożony: dzień 0" }, { pl: "Budowa na kopii: dni 1–4" }, { pl: "Pokaz na Twoich danych: dzień 5" }, { pl: "Odbiór i PROD: do 10 dni" }]
```

#### Test

```bash
# każdy wpis tools.ts ma delivery PL+EN (data-lint)
# PLANOWANE (F3, verify-site.mjs nie zna tego trybu): node .claude/skills/klarow-guardian/scripts/verify-site.mjs --data-lint
# zakazane frazy czasu
grep -rniE "wdrożenie w dni|deployed in days|od ręki|natychmiast|w 24 ?h|instantly|overnight" site/src/data site/dist 2>/dev/null | grep -viE "pierwszy działający efekt|first working result"   # 0
# chip delivery w hubie i na podstronach (dist): ≥ 13 wystąpień „pilot" lub „etapami"
grep -oE "pilot 5–10 dni|etapami|Health-Check 48 h" site/dist/narzedzia.html | wc -l                # ≥ 13
grep -c "delivery" site/src/data/tools.ts                                                          # ≥ 13
```

Severity: HIGH.

#### Wyjątki

`oneLiner` („Działają w dni") jest zatwierdzonym wyjątkiem D-01, bo H1 stoi obok subtextu i chipów `delivery` w S3; nie wolno go rozszerzać („wdrażamy w dni").

### 10.7 copy-minimal-text

**Minimum tekstu: hero lead ≤ 20 słów, nagłówek sekcji ≤ 6 słów, sekcja = 1 zdanie + dowód, karta = ikona + 2–6 słów + 1 linia**

Impact: **HIGH** · Tagi: copy, density, hero, sections, cards, minimal · Źródło: dyrektywa Karola 2026-07-27 („mniej tekstu, więcej ikon") + commit 848cd93 / strategy.md §8 (blok = nagłówek ≤ 6 słów + 1 linia + ikony), T6 / synthesis §2.3 (limity: nagłówek ≤ 6 słów i ≤ 2 linie, lead ≤ 20 słów, karta ≤ 12 słów w linii), design-hero-discipline / taste §4.7 · Dodano: 2026-09-12 · Plik: `rules/copy-minimal-text.md`

#### Zasada

Limity dla trybu `marketing` (home, hub, `/oferta`, `/faq`-nagłówki, otoczka podstron):
- Hero: dokładnie 4 elementy tekstowe: H1 (≤ 2 linie na 1024 px, `max-width: 24ch`), lead ≤ 20 słów, 1 CTA primary, 1 CTA ghost. Zero chipów, telefonu, trust-stripu, wersji, eyebrow w hero.
- Nagłówek sekcji (H2) ≤ 6 słów i ≤ 2 linie; lead sekcji ≤ 20 słów (1 zdanie); po nim DOWÓD (żywy mini-komponent, zrzut, liczba ze źródłem, diagram), nie drugi akapit.
- Karta/kafel: ikona lucide + nazwa 2–6 słów + 1 linia ≤ 12 słów. Hook narzędzia (`HOOKS`) 2–6 słów; tagline zostaje na podstronie.
- Eyebrow count na home = 0; sekcje home = 9 (S1–S9), nie więcej.
- Podstrony narzędzi i `/oferta` mogą mieć pełne zdania, ale treść drugorzędna jest wizualnie podrzędna (akordeon w DOM, sekcja „Jak to liczymy" pod demem), nie nad zgięciem.
- Shell prerendera nie może zawierać zdań, których nie ma w UI (T6: shell i UI twierdzą to samo).

#### Mechanizm awarii (dlaczego)

Karol dwukrotnie ciął prozę (reframe 2026-07-27, commit 848cd93 „Mniej tekstu, więcej pokazywania"); długi lead z proof (`proof.md`: hero 8+ elementów) został odrzucony przez sędziego marki. CFO na telefonie z LinkedIn ma 10 sekund (`strategy.md` §3.2): nagłówek > 6 słów nie mieści się w 2 liniach na 390 px, lead > 20 słów spycha CTA pod zgięcie. Sekcja z dwoma akapitami zamiast dowodu to „opowiadanie zamiast pokazywania" (plan §1.5: „pokazujemy na demo, nie opowiadamy"). Karty z 3 liniami tekstu wyrównują się do najdłuższej i rozbijają siatkę gapless.

#### Niepoprawnie

```ts
hero: { h1: "Automatyzacja, upraszczanie i porządek w danych dla firm 20–250 osób, które wyrosły na Excelu", lead: "Budujemy narzędzia dokładnie pod Twój proces: raporty, importy z ERP, integracje z KSeF, obieg dokumentów i panele dla zarządu, wdrażamy je w dni, a dane zostają u Ciebie na Twoim serwerze, bez chmury i bez abonamentu." }   // 40 słów
card: { title: "Raporty, kontroling i analizy dla zarządu", line: "Raport zarządczy, marża projektu, bramka tygodnia, prognoza cashflow i porównanie planu z wykonaniem w jednym miejscu." }   // 19 słów
```

#### Poprawnie

```ts
hero: { h1: MESSAGING.oneLiner, lead: MESSAGING.subtext /* 17 słów */, primary: MESSAGING.cta.primary, secondary: MESSAGING.cta.secondary },
section: { h2: { pl: "Co osiągniesz" }, lead: { pl: "Nie sprzedajemy godzin ani systemu. Sprzedajemy efekt, który widać w kalendarzu i w liczbach." } /* 13 słów */ },
card: { icon: "BarChart3", title: { pl: "Raporty i kontroling" }, line: { pl: "Raport zarządczy, marża projektu, bramka tygodnia." } },
```

#### Test

```bash
# liczniki słów z data/home.ts, oferta.ts, tools.ts (HOOKS): H1 ≤ 14 słów, lead ≤ 20, H2 ≤ 6, card.title ≤ 6, card.line ≤ 12, hook ≤ 6
# DOCELOWO (skrypt planowany, jeszcze nie istnieje — dziś: NIE SPRAWDZANO): node .claude/skills/klarow-guardian/scripts/check-copy.mjs --length-limits
# hero: 4 elementy tekstowe w dist/index.html (skrypt liczy h1, p, a w .hero)
# DOCELOWO (skrypt planowany, jeszcze nie istnieje — dziś: NIE SPRAWDZANO): node .claude/skills/klarow-guardian/scripts/check-design.mjs --hero-elements
# eyebrow count na home = 0
grep -c "class=\"[^\"]*eyebrow" site/dist/index.html                       # 0
```

Severity: HIGH (hero, H2, lead); karty MEDIUM w raporcie.

#### Wyjątki

Tryb `tool` (dashboardy, opisy „Jak to liczymy", `/rodo`, FAQ-odpowiedzi 2–4 zdania): limity nie obowiązują, ale akapit ≤ 4 zdania (writing „Structure").

### 10.8 copy-one-liner-single-source

**Jedno zdanie marki z messaging.ts na każdej powierzchni: H1, pagesSeo.home, ORG_JSONLD, llms.txt, index.html, prompt bota, nagłówki LinkedIn**

Impact: **HIGH** · Tagi: copy, messaging, one-liner, sync, seo, bot · Źródło: strategy.md T12, D1, D14, §9 p.1 / synthesis §2.1 (`src/data/messaging.ts` JEDYNE źródło zdań), D-01 (pełne V1), brand-one-sentence, brand-messaging-sync / post-bot/worker.js:22-53 (prompt) · Dodano: 2026-09-12 · Plik: `rules/copy-one-liner-single-source.md`

#### Zasada

`src/data/messaging.ts` jest jedynym źródłem zdań marki: `oneLiner` („Narzędzia pod Twój proces. Działają w dni, dane zostają u Ciebie." / EN), `subtext`, `pillars` (3), `determinism`, `zeroVendorCloud`, `cta`, `closing`, `proofLabels`, `allowedNumbers`, `bannedWords`. Konsumują je bez przepisywania: `Hero` (H1 = `oneLiner`, lead = `subtext`), `pagesSeo.home.description` (ręczny literał, który zawiera DOSŁOWNIE `oneLiner`; nigdy sklejka z `.slice()` — limity 130–165 zn. pilnuje `seo-pageseo-single-source`), `ORG_JSONLD.description`, `llmsTxt()`, `index.html` (fallback meta generowany w buildzie lub kopiowany 1:1), `post-bot/worker.js` `SYSTEM_PROMPT` (kopiowany ręcznie w tym samym PR, z komentarzem `// messaging.ts@<sha>`), nagłówki LinkedIn founderów (checklista `checklists/definition-of-done.md` §D p. 1). Zmiana `oneLiner` = jeden PR dotykający wszystkich powierzchni; audyt = diff tekstu między nimi równy 0 (poza dozwolonym łamaniem linii i wielkością pierwszej litery).

#### Mechanizm awarii (dlaczego)

Dziś każda powierzchnia mówi co innego: H1 `App.tsx:98-99` („…które wyrosły na Excelu"), `index.html:7-18` („12 działających demo"), `Seo.tsx:77-78` (JSON-LD z „wyrosły na Excelu"), `llms.txt` (`entry.tsx:449-452` „Windows + Excel"), prompt bota `post-bot/worker.js:25` („MŚP 20–250 osób, które wyrosły na Excelu"), nagłówek LinkedIn z `plan-dzialania-pawel.md:13`. Osoba, która dostała wiadomość na LinkedIn, wchodzi na stronę i czyta inne zdanie niż w wiadomości (`strategy.md` §3.2: „te same słowa, co w wiadomości"); LLM cytujący `llms.txt` powtarza stary przekaz z Excelem. Bez jednego źródła audyt nie ma czego porównać.

#### Niepoprawnie

```tsx
const HERO = { pl: { h1: "Automatyzacja i porządek w danych dla firm, które wyrosły na Excelu." } };   // App.tsx, lokalna kopia
```
```js
// post-bot/worker.js:25
const SYSTEM_PROMPT = `Klarow: automatyzacja dla MŚP 20–250 osób, które „wyrosły na Excelu" (Windows + Excel)…`;
```

#### Poprawnie

```ts
// data/home.ts
hero: { h1: MESSAGING.oneLiner, lead: MESSAGING.subtext }
// data/pagesSeo.ts — ręczny literał (jedno brzmienie z seo-pageseo-single-source), zawiera dosłownie MESSAGING.oneLiner.
// Zero .slice(): ucina w środku wyrazu i nie gwarantuje dolnego progu 130 zn.
home: { description: { pl: "Narzędzia pod Twój proces. Działają w dni, dane zostają u Ciebie. Kontroling, integracje (KSeF), importy z ERP, obieg dokumentów, panele. 12 dem na żywo." /* 153 zn. */, en: "…" } }
// components/Seo.tsx
description: `${MESSAGING.oneLiner.pl} ${MESSAGING.subtext.pl}`
// post-bot/worker.js (kopia ręczna, ten sam PR)
// messaging.ts@b9677ea (2026-09-12): NIE edytować tu; zmień site/src/data/messaging.ts i skopiuj
const ONE_LINER = "Narzędzia pod Twój proces. Działają w dni, dane zostają u Ciebie.";
```

#### Test

```bash
# zdanie z messaging.ts występuje dosłownie w: dist/index.html (H1 + description), dist/llms.txt, post-bot/worker.js
ONE=$(node -e "import('./site/src/data/messaging.ts').catch(()=>0)" 2>/dev/null; grep -oE "oneLiner: \{ pl: \"[^\"]+\"" site/src/data/messaging.ts | sed -E 's/.*pl: "//; s/"$//')
for f in site/dist/index.html site/dist/llms.txt post-bot/worker.js; do grep -qF "$ONE" "$f" && echo "OK $f" || echo "FAIL $f"; done
grep -c "$ONE" site/dist/index.html                                          # ≥ 2 (H1 + JSON-LD/description)
# description home zawiera zdanie dosłownie i nie jest przycinana w kodzie
grep -qF "$ONE" site/src/data/pagesSeo.ts && echo "OK pagesSeo" || echo "FAIL pagesSeo"
grep -nE "\.slice\(0, ?1[0-9][0-9]\)" site/src/data/pagesSeo.ts                # 0
# stare frazy przekazu: 0
grep -rnE "wyros(ł|l)(y|a) na Excelu|12 działających demo" site/src site/index.html site/dist post-bot/worker.js 2>/dev/null   # 0
# DOCELOWO (skrypt planowany, jeszcze nie istnieje — dziś: NIE SPRAWDZANO): node .claude/skills/klarow-guardian/scripts/check-brand.mjs --one-sentence
```

Severity: HIGH.

#### Wyjątki

`llms.txt` i `pagesSeo` mogą dodać do zdania krótkie dopełnienie („12 dem na żywo."), ale zdanie bazowe pozostaje dosłowne. Wariant EN podlega tej samej regule na powierzchniach EN.

### 10.9 copy-persona-outcomes-section

**Sekcja „Co osiągniesz" obowiązkowa na home: 4 efekty w języku persony (kontroler, CFO, właściciel), zero liczb, ikony lucide, 1 zdanie + 1 linia**

Impact: **HIGH** · Tagi: copy, outcomes, persona, home, icp, sections · Źródło: synthesis R1 (brak wskazany przez 3 sędziów), §2.3 S4 (4 efekty PL/EN), §1.7 p.2, D-11 / strategy.md §8 blok 4 („godziny kontrolera z powrotem · zamknięcie miesiąca w dni · błędy przed zarządem · urlop bez telefonów") / plan-strategiczny §2.2 („mierzy sukces") · Dodano: 2026-09-12 · Plik: `rules/copy-persona-outcomes-section.md`

#### Zasada

Home ma między S3 („Realizacje i dema") a S5 („W liczbach") sekcję `Outcomes` z H2 „Co osiągniesz" / „What you gain", leadem ≤ 20 słów i dokładnie 4 pozycjami z `data/home.ts` (`outcomes.items`): ikona lucide 20 px, 1 zdanie efektu (≤ 8 słów, 700) i 1 linia mechanizmu (≤ 14 słów, muted). Efekty są w języku persony ICP (kontroler, główna księgowa, CFO, właściciel firmy produkcyjnej/budowlanej/dystrybucyjnej): kalendarz, zamknięcie miesiąca, błędy przed zarządem, urlop bez telefonów. ZERO liczb w tej sekcji (każda liczba wymagałaby źródła), zero słów „AI", zero nazw narzędzi. Treść startowa (D-11, do zatwierdzenia przez P):
1. `Clock` Godziny kontrolera wracają do kontrolingu. / Raport, import i sprawdzenie robi narzędzie, nie człowiek po godzinach.
2. `CalendarCheck` Zamknięcie miesiąca w dni, nie w tygodnie. / Dane z ERP, magazynu i plików spotykają się bez przeklejania.
3. `ShieldAlert` Błędy złapane przed zarządem, nie po. / Macierz OK / UWAGA / BŁĄD zanim raport wyjdzie z działu.
4. `Umbrella` Urlop bez telefonów z pytaniem o plik. / Narzędzie liczy tak samo, gdy nie ma Cię przy biurku.
Sekcja jest w shellu prerendera (`HomeShell` z `HOME.outcomes`) i w DOM; usunięcie sekcji wymaga decyzji founderów.

#### Mechanizm awarii (dlaczego)

Wszystkie trzy koncepcje (editorial, proof, showreel) nie miały bloku mówiącego o KLIENCIE, nie o Klarow; sędziowie obniżyli za to każdą ocenę. Brief mówi „pokazujemy CO POTRAFIMY i CO FIRMA KLIENTA OSIĄGNIE"; bez S4 home opisuje wyłącznie Klarow (co budujemy, jak pracujemy, kim jesteśmy). Persona „człowiek-Excel" (kontroler) jest najlepszym ambasadorem, jeśli słyszy „uwalniamy Cię od odtwórczej roboty", nie „zastępujemy Cię" (`marketing-kanaly.md:87`); liczby w tej sekcji zamieniłyby obietnicę jakościową w twierdzenie wymagające źródła (`copy-numbers-with-source`).

#### Niepoprawnie

```ts
// home.ts bez sekcji outcomes; albo:
outcomes: { items: [{ title: "O 40 % szybsze raportowanie" }, { title: "Automatyzacja z AI" }, { title: "Raport zarządczy w kilkanaście sekund" }] }   // liczba, AI, nazwa narzędzia
```

#### Poprawnie

```ts
// data/home.ts
outcomes: {
  h2: { pl: "Co osiągniesz", en: "What you gain" },
  lead: { pl: "Nie sprzedajemy godzin ani systemu. Sprzedajemy efekt, który widać w kalendarzu i w liczbach.", en: "We don't sell hours or a system. We sell a result you can see in the calendar and in the numbers." },
  items: [
    { icon: "Clock", title: { pl: "Godziny kontrolera wracają do kontrolingu.", en: "Your controller's hours go back to controlling." }, line: { pl: "Raport, import i sprawdzenie robi narzędzie, nie człowiek po godzinach.", en: "The tool does the report, the import and the check, not a person after hours." } },
    { icon: "CalendarCheck", title: { pl: "Zamknięcie miesiąca w dni, nie w tygodnie.", en: "Month-end close in days, not weeks." }, line: { pl: "Dane z ERP, magazynu i plików spotykają się bez przeklejania.", en: "Data from ERP, warehouse and files meet without copy-paste." } },
    { icon: "ShieldAlert", title: { pl: "Błędy złapane przed zarządem, nie po.", en: "Errors caught before the board sees them, not after." }, line: { pl: "Macierz OK / UWAGA / BŁĄD zanim raport wyjdzie z działu.", en: "The OK / WARN / ERROR matrix before the report leaves the department." } },
    { icon: "Umbrella", title: { pl: "Urlop bez telefonów z pytaniem o plik.", en: "A holiday without calls about the spreadsheet." }, line: { pl: "Narzędzie liczy tak samo, gdy nie ma Cię przy biurku.", en: "The tool computes the same way when you're not at your desk." } },
  ],
}
```

#### Test

```bash
grep -c "Co osiągniesz" site/dist/index.html                                  # ≥ 1 (H2 w shellu)
node -e "const h=require('fs').readFileSync('site/src/data/home.ts','utf8'); const m=h.match(/outcomes:[\s\S]*?items: \[([\s\S]*?)\n  \]/); const n=(m?m[1]:'').match(/icon:/g)||[]; process.exit(n.length===4?0:1)" && echo "OK 4 items"
# zero cyfr i „AI" w sekcji outcomes (skrypt wycina blok outcomes z home.ts)
# DOCELOWO (skrypt planowany, jeszcze nie istnieje — dziś: NIE SPRAWDZANO): node .claude/skills/klarow-guardian/scripts/check-copy.mjs --outcomes
# kolejność sekcji: S3 → S4 → S5 (skrypt czyta kolejność H2 w dist/index.html)
# PLANOWANE (F3, verify-site.mjs nie zna tego trybu): node .claude/skills/klarow-guardian/scripts/verify-site.mjs --home-sections
```

Severity: HIGH (brak sekcji lub liczby/AI w niej).

#### Wyjątki

Sformułowania mogą zostać zastąpione własnymi founderów (D-11) pod warunkiem zachowania struktury 4 × (zdanie + linia), zero liczb.

### 10.10 copy-voice-and-tone

**Głos i ton: oznajmujące zdania, zero pytań retorycznych, zero „łatwo/prosto/szybko" bez liczby, zero AI-tells (summary transitions, spec-sheet voice, cold-open, personifikacja), strona czynna, druga osoba**

Impact: **MEDIUM** · Tagi: copy, voice, tone, ai-tells, banned-words, writing-guidelines · Źródło: writing-command.md „Voice & tone", „Banned words", „Concision", „AI-generated tells" / vercel.md §7.2–7.5 / synthesis §2.1 (zdania oznajmujące, zero pytań retorycznych, zero łatwo/prosto/szybko bez liczby), MESSAGING.bannedWords, brand-banned-words / strategy.md B11 (ton founder-led, problem-first) · Dodano: 2026-09-12 · Plik: `rules/copy-voice-and-tone.md`

#### Zasada

Copy strony PL i EN (data/*.ts, toolsSeo, FAQ, llms.txt, one-pager):
1. Strona czynna, czas teraźniejszy, druga osoba („dostajesz raport", nie „raport zostanie wygenerowany"); „my" tylko dla działań Klarow („wyceniamy po diagnozie").
2. Zero pytań retorycznych w nagłówkach i leadach („Masz dość Excela?"); pytania tylko w FAQ jako pytania użytkownika.
3. Zakazane słowa bez liczby obok: „łatwo", „prosto", „szybko", „bezproblemowo", „bezszwowo", „intuicyjnie"; filler: „bardzo", „po prostu", „naprawdę", „w dzisiejszym świecie", „kompleksowe rozwiązanie", „transformacja cyfrowa", „podnieś na wyższy poziom", „uwolnij potencjał", „nowej generacji", „game-changer"; EN: „elevate", „seamless", „unleash", „next-gen", „revolutionize", „delve", „tapestry", „in the world of", „easy", „simple", „quick", „very", „just", „really". Lista = `MESSAGING.bannedWords`.
4. Weasel words („znacząco", „wiele firm", „zwykle", „często") zastępujemy liczbą ze źródłem albo usuwamy.
5. AI-tells: brak otwarć-streszczeń („Mając to na uwadze…", „Now that we've…"), brak zdań-datasheet („zapewnia", „umożliwia", „jest konfigurowalny", „provides", „is configurable"), brak cold-open akapitów bez antecedensu, brak personifikacji artefaktów („narzędzie dba o Twoje dane", „token trzyma"), brak stop-start fragmentów, brak szablonowego framingu („Pytanie, które zadaje sobie większość firm…").
6. Zdania ≤ 20 słów (cel), akapit 2–4 zdania; drugie czytanie = przepisać.
7. Ton: founder-led, problem-first, rzeczowy; bez wykrzykników, bez „!" w CTA, bez emoji.

#### Mechanizm awarii (dlaczego)

Strona jest budowana z Claude Code, więc AI-tells są domyślnym ryzykiem (vercel.md §7.5: „krytyczne"); em-dash to jeden z nich (`i18n-pl-typography`), a „zapewnia/umożliwia" i pytania retoryczne to kolejne. „Łatwo/prosto/szybko" bez liczby to marketing, który CFO odrzuca; liczba ze źródłem („raport w kilkanaście sekund zamiast ~6 godz.") przechodzi (`copy-numbers-with-source`). Strona bierna („raport zostanie wygenerowany przez narzędzie") ukrywa, kto co robi, a przekaz marki mówi „rozmawiasz z osobą, która narzędzie zbudowała". Personifikacja („narzędzie pilnuje") kłóci się z determinizmem („kalkulator, nie wróżka").

#### Niepoprawnie

```ts
pl: "Masz dość ręcznego sklejania arkuszy? Nasze kompleksowe rozwiązanie zapewnia bezproblemową automatyzację i umożliwia szybkie raportowanie. W dzisiejszym świecie dane to podstawa!"
en: "Now that we've seen the problem, our seamless, next-gen platform delves into your data and elevates reporting."
```

#### Poprawnie

```ts
pl: "Wklejasz tabelę z Excela. Dostajesz 3 KPI, wykres i tabelę z komentarzami w kilkanaście sekund. Te same dane dają ten sam wynik."
en: "Paste the table from Excel. You get 3 KPIs, a chart and a commented table in seconds. Same data, same result."
```

#### Test

```bash
# słowa zakazane PL/EN z MESSAGING.bannedWords + filler + weasel (skrypt czyta listę z messaging.ts)
# DOCELOWO (skrypt planowany, jeszcze nie istnieje — dziś: NIE SPRAWDZANO): node .claude/skills/klarow-guardian/scripts/check-copy.mjs --banned-words
# pytania retoryczne w nagłówkach/leadach: „?" w h1/h2/lead poza FAQ
grep -rnE "(h1|h2|lead|title)[^:]*: \{ pl: \"[^\"]*\?\"" site/src/data/home.ts site/src/data/oferta.ts site/src/data/messaging.ts 2>/dev/null   # 0
# spec-sheet voice PL/EN
grep -rnwiE "zapewnia|umożliwia|pozwala na|provides|enables|allows|is configurable" site/src/data/*.ts   # przegląd; cel 0 w home.ts/messaging.ts
grep -rnE "[!]\"" site/src/data/home.ts site/src/data/messaging.ts site/src/data/oferta.ts 2>/dev/null   # 0
# ocena LLM (copy-auditor): AI-tells, strona bierna („przez"), cold-open; wynik PLAUSIBLE → decyzja człowieka
```

Severity: MEDIUM (raport); słowa z `bannedWords` w hero/meta = HIGH.

#### Wyjątki

FAQ: pytania są pytaniami użytkownika (dozwolone). Tryb `tool`: etykiety UI („Załaduj przykład") są trybem rozkazującym (poprawnie). Cytaty klientów (gdy powstaną) w oryginale.

## 11. RODO (`/rodo`, art. 14, prawo sprzeciwu), PKE (zgody, formularze bez domyślnych zgód, double opt-in) (`legal`)

Domyślny impact: **BLOCKER** · tryb: marketing · właściciel audytu: `copy-auditor` + `integration-scanner`

### 11.1 legal-no-scraped-personal-data-in-repo

**Dane osobowe z researchu nie trafiają do repo strony, do narzędzi ani do modeli; w leadscout tylko minimum firmowe ze wskazaniem źródła**

Impact: **BLOCKER** · Tagi: legal, rodo, privacy, leadscout, secrets, ai-tools, minimization, git · Źródło: peer-legal.md §1.1 (art. 14: konkretne źródło per rekord) / CLAUDE.md „leadscout/" i ostrzeżenie o folderze marketing/ z realnymi danymi leadów w cudzej aplikacji / rules/secret-no-secrets-in-prompts-or-logs.md, rules/integ-data-egress-review.md, rules/media-higgsfield-inputs-policy.md, rules/secret-git-history-scan-before-public.md · Dodano: 2026-09-12 · Plik: `rules/legal-no-scraped-personal-data-in-repo.md`

#### Zasada

Dane osób zebrane w researchu (Lead-Scout, ogłoszenia o pracę, LinkedIn, KRS, CEIDG, wizytówki, korespondencja) **nigdy** nie trafiają do:
1. `site/**`, `demo/**`, `ui-kit/**`, `dist/**` — ani jako treść, ani jako dane przykładowe, ani w komentarzu w kodzie, ani w metadanych obrazu czy PDF;
2. dokumentów publicznych (`llms.txt`, posty bota, one-pager, zrzuty ekranu w portfolio, case study);
3. promptów i wejść narzędzi zewnętrznych: generatorów obrazu i wideo (Higgsfield), serwerów MCP, API modeli językowych, tłumaczy online, usług OCR — także „tylko żeby przeformatować tabelę";
4. logów, raportów audytu, wiadomości między agentami i artefaktów w scratchpadzie, które wracają do repo.

W `leadscout/` obowiązuje minimalizacja (art. 5 ust. 1 lit. c RODO): rekord to **dane firmy**, nie osoby — `nazwa`, `www`, `lokalizacja`, `segment`, `rozmiar`, `ocena`, `sygnal`, `zrodlo_url`, `hook`, `uwagi_weryfikacji`, `status`, `data_dodania`. **Zero imion i nazwisk, zero prywatnych adresów e-mail i telefonów, zero kopii treści ogłoszenia lub profilu w całości.** Pola `zrodlo_url` i `data_dodania` są obowiązkowe i nieusuwalne: to dowód „konkretnego źródła" wymagany przez art. 14 RODO i przez `legal-rodo-page-required` (bez nich nie da się napisać, skąd mamy dane).

**Zegar z art. 14 ust. 3 lit. a (korekta 2026-09-12).** Obowiązek informacyjny trzeba wykonać **w ciągu miesiąca od POZYSKANIA danych**, a nie od wysłania wiadomości. Dopisanie imienia, nazwiska, stanowiska albo imiennego e-maila do `leadscout/leads.json` uruchamia ten zegar niezależnie od tego, czy kiedykolwiek napiszemy, i tworzy dług, którego nie da się spłacić wstecz. Dlatego **do czasu `OUTREACH_READY` baza zawiera wyłącznie dane firmowe i publiczny sygnał zakupowy** (`legal-outreach-readiness`).

Baza leadów jest zbiorem danych osobowych także wtedy, gdy zawiera wyłącznie dane firmowe jednoosobowych działalności; dlatego: plik trzymany lokalnie, przeglądany tylko przez founderów, usuwany po sprzeciwie w 24 h, a **przed upublicznieniem repozytorium, forkiem lub udostępnieniem kodu osobie trzeciej wyprowadzany z gita razem z historią** (`secret-git-history-scan-before-public`). Stan na 2026-09-12: `leadscout/leads.json` jest **śledzony przez gita** (32 rekordy; jeden zawiera adres e-mail, kilka wspomina osobę w polach `hook` i `uwagi_weryfikacji`) — do wyczyszczenia przy najbliższej rundzie i bezwarunkowo przed publikacją repo.

To wymaganie produktowe, nie opinia prawna; kwalifikacja i treść klauzul do przeglądu radcy (D-21).

#### Mechanizm awarii (dlaczego)

Dane osobowe wklejone do modelu opuszczają nasz obieg i najczęściej trafiają poza EOG bez podstawy prawnej i bez umowy powierzenia — to udostępnienie danych, nie „pomoc w pracy"; w przypadku Higgsfielda dochodzi licencja treningowa na przesłane materiały. Repozytorium jest wspólne i ma być kiedyś pokazane osobom trzecim (portfolio, wspólnik, klient): plik z listą firm, sygnałów zakupowych i nazwisk osób kontaktowych to jednocześnie wyciek danych osobowych i przekazanie konkurencji gotowego pipeline'u sprzedaży. Historia gita pamięta wszystko — usunięcie pliku jednym commitem nie usuwa go z repozytorium. Odwrotny kierunek jest równie groźny: rekord bez `zrodlo_url` uniemożliwia wykonanie obowiązku z art. 14 („z ogłoszenia opublikowanego na portalu X w dniu Y"), więc każdy kontakt na jego podstawie jest niezgodny z prawem, a precedens Bisnode pokazuje cenę. Dema mają dane fikcyjne właśnie po to, żeby nikt nie musiał sięgać po prawdziwe (`demo-labels`).

#### Niepoprawnie

```ts
// site/src/data/tools.ts — „realistyczny" przykład zbudowany na prawdziwym leadzie
const SAMPLE = { klient: "Zakład Metalowy Kowalski sp. z o.o.", osoba: "Anna Nowak, kierownik controllingu", mail: "a.nowak@…" };
```
```json
// leadscout/leads.json — dane osoby i skopiowane ogłoszenie zamiast odsyłacza
{ "nazwa": "…", "osoba_kontaktowa": "Jan K., dyrektor finansowy", "mail": "j.k@…", "tel": "+48 …",
  "ogloszenie_tresc": "<pełna treść ogłoszenia o pracę>", "zrodlo_url": null }
```
```text
prompt do generatora obrazu: „zrób grafikę do posta o leadzie Zakłady X — kierownik controllingu Anna Nowak szuka kontrolera…"
```

#### Poprawnie

```json
// leadscout/leads.json — minimum firmowe + dowód źródła wymagany przez art. 14
{ "nazwa": "Producent konstrukcji stalowych (woj. śląskie)",
  "www": "https://…", "lokalizacja": "śląskie", "segment": "produkcja", "rozmiar": "80-120",
  "ocena": 8, "sygnal": "ogłoszenie o pracę: specjalista ds. controllingu",
  "zrodlo_url": "https://www.pracuj.pl/praca/…", "data_dodania": "2026-07-23",
  "hook": "raportowanie kosztów projektów w arkuszach", "status": "nowy" }
```
```ts
// dane w demach są jawnie fikcyjne i deterministyczne
const ROWS = [{ project: "Hala A", stage: "Montaż", cost: 128_400_00 }, /* … */];  // grosze, zero danych realnych
```
```text
prompt do generatora obrazu: „abstrakcyjna faktura stalowej powierzchni, makro, zimne światło, bez tekstu, bez ludzi"
```

#### Test

```bash
# 1. dane osobowe w kodzie strony i w buildzie: adresy e-mail spoza NAP, telefony, PESEL, profile LinkedIn
grep -rnE "[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}" site/src site/dist --include="*.ts" --include="*.tsx" --include="*.html" | grep -v "kontakt@klarow.com"   # 0
grep -rnE "\+48[  ]?[0-9]{3}[  ]?[0-9]{3}[  ]?[0-9]{3}" site/src site/dist | grep -v "786 296 426"    # 0
grep -rniE "linkedin.com/in/|[0-9]{11}" site/src site/dist                                            # 0 (profile osób, PESEL)
# 2. leadscout: minimalizacja i obowiązkowe źródło per rekord
node - <<'JS'
const leads = require("./leadscout/leads.json").leady;
const mail = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/, tel = /\+?\d[\d  -]{7,}/, person = /linkedin\.com\/in\/|imię|imie|nazwisko/i;
let bad = 0;
for (const [i, l] of leads.entries()) {
  const s = JSON.stringify(l);
  if (mail.test(s))   { console.log(`leadscout/leads.json:${i} - BLOCKER [legal-no-scraped-personal-data-in-repo] adres e-mail w rekordzie`); bad++; }
  if (tel.test(s))    { console.log(`leadscout/leads.json:${i} - BLOCKER [legal-no-scraped-personal-data-in-repo] numer telefonu w rekordzie`); bad++; }
  if (person.test(s)) { console.log(`leadscout/leads.json:${i} - BLOCKER [legal-no-scraped-personal-data-in-repo] dane osoby w rekordzie`); bad++; }
  if (!l.zrodlo_url || !l.data_dodania) { console.log(`leadscout/leads.json:${i} - BLOCKER [legal-no-scraped-personal-data-in-repo] brak zrodlo_url/data_dodania (art. 14)`); bad++; }
}
console.log(`rekordów: ${leads.length}, naruszeń: ${bad}`);
JS
# 3. przed upublicznieniem repo: baza leadów poza gitem
git ls-files leadscout | grep -E "leads.json|digesty/"        # przed publikacją: pusto (plik w .gitignore + czyszczenie historii)
# 4. prompty i wejścia narzędzi zewnętrznych bez danych osób
grep -rniE "lead|nazwisko|kontakt do" .claude/work/*/prompts* media/SOURCES.md 2>/dev/null   # 0
node ".claude/skills/klarow-guardian/scripts/check-secrets.mjs" --quiet
```

#### Wyjątki

Dane kontaktowe **własne** (NAP Klarow, `kontakt@klarow.com`, `786 296 426`) i publiczne dane founderów, które sami zdecydowali się opublikować (D-05), nie są objęte zakazem — pochodzą z `src/data/contact.ts` (`code-contact-single-source`). Cytat z publicznego ogłoszenia w wiadomości wysyłanej do tej samej firmy jest dopuszczalny (to element obowiązku z art. 14: wskazanie źródła), ale nie wolno go zapisywać w repozytorium. Dane klientów przekazane w ramach pilota żyją wyłącznie na maszynie klienta i nigdy nie wchodzą do tego repo (`integ-data-egress-review`).

### 11.2 legal-outreach-readiness

**Outbound rusza dopiero po domkniętej checkliście OUTREACH_READY; publikacja strony to osobny, niższy próg**

Impact: **BLOCKER** · Tagi: legal, outbound, rodo, pke, leadscout, gate, consent · Źródło: peer-legal.md §1.1 (art. 14 RODO, Bisnode 943 470 zł), §1.4 (art. 398 PKE) / art. 14 ust. 3 lit. a RODO (miesiąc od pozyskania danych) / docs/plan/reframe-2026-09-12.md §2 (dwie bramki zamiast jednej) / docs/plan/strona-v2-plan.md §4.6, §10 p. 1 i 7 / decyzje-founderow-v2.md D16, D25, D26 · Dodano: 2026-09-12 · Plik: `rules/legal-outreach-readiness.md`

#### Zasada

Są **dwa niezależne progi**, nie jeden. Mylenie ich kosztuje albo tygodnie zwłoki (blokowanie publikacji do czasu rejestracji firmy), albo karę (wysyłka bez kompletu obowiązków).

**Próg 1, publikacja strony: `SITE_PUBLISHABLE`** (pilnuje go `legal-rodo-page-required`). Wymaga tożsamości administratora i kompletnych sekcji o serwisie. Nie wymaga rejestracji działalności, NIP-u, REGON-u, adresu siedziby ani przeglądu radcy.

**Próg 2, pierwszy kontakt handlowy: `OUTREACH_READY`.** Wolno wysłać pierwszą wiadomość (list, zaproszenie LinkedIn z pytaniem o zgodę, permission-mail, telefon) dopiero wtedy, gdy spełnione są **łącznie**:

1. `SITE_PUBLISHABLE = true` i `/rodo` działa na produkcji;
2. **adres do korespondencji** wpisany w `CONTROLLER` **albo** świadomie wybrane zdanie zastępcze („Adres do korespondencji podajemy na żądanie…"), z decyzją zapisaną w `docs/DECISIONS.md` (D26);
3. klauzula art. 14 kompletna: konkretne źródła per rodzaj (bez „ze źródeł publicznie dostępnych"), kategorie danych, podstawa z wyjaśnieniem interesu, **konkretny okres** (12 miesięcy od ostatniego kontaktu), odbiorcy oraz transfer poza EOG z podstawą **rozstrzygniętą per dostawca** (zero „SCC albo DPF" w `dist`), sekcja o profilowaniu (art. 14 ust. 2 lit. g), organ nadzorczy;
4. treści zgód PKE w jednym źródle: `site/src/data/consent.ts` z `CONSENT_VERSION`, odrębna zgoda na e-mail i na telefon, zero domyślnych zaznaczeń (`legal-pke-consent-forms`);
5. szablony outboundu w `leadscout/playbook-outbound.md` linkują do `klarow.com/rodo`, a **pierwsza wiadomość nie zawiera oferty** (krok 1 = prośba o zgodę);
6. **źródło i data per lead** w bazie: pierwsza wiadomość cytuje konkretne ogłoszenie i datę (to jest dokładnie to, czego zabrakło w precedensie Bisnode);
7. rejestr zgód (data, kanał, wersja treści), rejestr sprzeciwów z terminem 7 dni i właścicielem procesu oraz rejestr czynności przetwarzania (art. 30) istnieją **poza gitem** (`legal-no-scraped-personal-data-in-repo`, `secret-secrets-outside-git`);
8. datowany wpis `OUTREACH_READY = true` w `docs/DECISIONS.md`, podpisany przez obu founderów (przegląd radcy może być równoległy; start bez niego jest świadomym ryzykiem, D16).

**Zegar art. 14 ust. 3 lit. a.** Obowiązek informacyjny trzeba wykonać w ciągu **miesiąca od pozyskania danych**, nie od wysyłki. Dlatego `leadscout/leads.json` **nie zawiera danych osób fizycznych** (imię, nazwisko, stanowisko, imienny e-mail, telefon) do czasu `OUTREACH_READY`: do tego momentu baza trzyma wyłącznie dane firmowe i publiczny sygnał zakupowy. Dopisanie osoby wcześniej tworzy dług, którego nie da się spłacić wstecz.

**Czego ten próg NIE wymaga:** rejestracji działalności gospodarczej. Rejestracja (`CONTRACT_READY`: NIP, rachunek, wzór umowy, porozumienie wspólników) jest warunkiem **pierwszej faktury**, nie pierwszego maila.

**Zakaz interpretacji „strona żyje, więc można wysyłać".** Publikacja portfolio nie odblokowuje outboundu; `OUTREACH_READY = false` przy działającej stronie jest stanem normalnym i świadomym, a nie przeoczeniem.

#### Mechanizm awarii (dlaczego)

Bisnode pobierał dane z rejestrów publicznych i zapłacił **943 470 zł** wyłącznie za niewykonanie obowiązku z art. 14; decyzję potwierdził NSA. Sankcja UKE za naruszenie art. 398 PKE to **3 % przychodu albo 1 mln zł, wyższa z kwot**, a przy zerowym przychodzie sufitem jest milion. Plan kontroli sektorowych UODO na 2026 obejmuje bazy marketingowe. Ryzyko jest skrajnie asymetryczne: jeden mail wysłany za wcześnie kosztuje więcej niż cały pilot, a jeden tydzień zwłoki w publikacji portfolio nie kosztuje nic. Jednocześnie odwrotny błąd (blokowanie publikacji do czasu rejestracji firmy) opóźnia jedyny kanał, którym w ogóle można dziś pokazać dowód, i nie kupuje żadnej zgodności: strona bez formularzy, bez cookies i bez wysyłki nie robi niczego, co wymagałoby danych rejestrowych przedsiębiorcy.

#### Niepoprawnie

```ts
// site/src/data/rodo.ts — jedna flaga na dwie różne rzeczy
export const RODO_READY = true;   // co to znaczy? że wolno publikować, czy że wolno wysyłać?
```
```json
// leadscout/leads.json — osoba dopisana "na zapas", przed domknięciem checklisty
{ "nazwa": "Firma X", "kontakt_osoba": "Jan Kowalski", "email_osoby": "j.kowalski@firma.pl" }
// art. 14 ust. 3 lit. a: zegar miesięczny ruszył w dniu zapisu, nie w dniu wysyłki
```

#### Poprawnie

```ts
// site/src/data/rodo.ts — dwie flagi, dwa progi, jedno miejsce podmiany tożsamości
export const CONTROLLER = { kind: "person", name: "…", address: "", taxId: "" } as const;
export const SITE_PUBLISHABLE = true;   // strona może iść na produkcję
export const OUTREACH_READY   = false;  // ani jednej wiadomości handlowej
```
```json
// leadscout/leads.json — do czasu OUTREACH_READY wyłącznie warstwa firmowa
{ "nazwa": "Firma X", "www": "firma.pl", "segment": "produkcja", "sygnal": "ogłoszenie o pracę: kontroler",
  "zrodlo_url": "https://…", "data_dodania": "2026-09-12" }
```

#### Test

```bash
# 1. bramka outboundu (uruchamiana świadomie, nie w codziennym npm run check)
node ".claude/skills/klarow-guardian/scripts/verify-site.mjs" --outreach --fail-on BLOCKER,HIGH
# 2. flagi istnieją i są rozłączne
grep -nE "^export const (SITE_PUBLISHABLE|OUTREACH_READY)" site/src/data/rodo.ts     # 2 wpisy
# 3. zero danych osób w bazie leadów do czasu OUTREACH_READY
grep -nE '"(imie|nazwisko|osoba|kontakt_osoba|email_osoby|telefon_osoby)"' leadscout/leads.json   # 0
# 4. podstawa transferu rozstrzygnięta per dostawca (nie "SCC albo DPF")
grep -ciE "SCC albo DPF|standardowych klauzul umownych albo" site/dist/rodo.html     # 0
# 5. jedno źródło treści zgód z wersją
test -f site/src/data/consent.ts && grep -n "CONSENT_VERSION" site/src/data/consent.ts
# 6. decyzja o starcie outboundu zapisana i datowana
grep -nE "OUTREACH_READY" docs/DECISIONS.md                                          # >= 1
# 7. szablony niosą adres klauzuli, krok 1 bez oferty
grep -rci "klarow.com/rodo" leadscout/playbook-outbound.md                           # >= 1
```

#### Wyjątki

Odpowiedź na zapytanie zainicjowane przez odbiorcę (`mailto:`, telefon od klienta, hak „Przyślij nam swój najgorszy Excel", rezerwacja rozmowy) to inbound z art. 398 ust. 2 PKE i **nie** podlega tej regule. Publikacja treści na własnym profilu LinkedIn (posty o własnej pracy, linki do strony) też nie: to publikacja, nie informacja handlowa kierowana do wskazanego odbiorcy. Granica jest ostra w jednym miejscu: zaproszenie albo wiadomość z ofertą wysłana do konkretnej osoby **jest** informacją handlową i wchodzi pod tę regułę. Ta reguła jest wymaganiem produktowym, nie opinią prawną; trzy punkty wymagają potwierdzenia radcy (obowiązkowość adresu w klauzuli, kwalifikacja powtarzalnej bezpłatnej diagnozy, faktyczne współadministrowanie mimo wskazania jednego administratora).

### 11.3 legal-pke-consent-forms

**Art. 398 PKE — uprzednia zgoda na informację handlową także wobec osób prawnych; zero domyślnie zaznaczonych zgód, newsletter tylko double opt-in**

Impact: **BLOCKER** · Tagi: legal, pke, consent, forms, outbound, newsletter, uke, inbound · Źródło: peer-legal.md §1.4 (art. 398 PKE od 10.11.2024; WSA II SA/Wa 62/25 z 8.08.2025; sankcja UKE 3 % przychodu albo 1 mln zł — wyższa; Tani Opał sp. z o.o. 500 tys. zł) / peer-legal.md „Uzgodnienie między oknami" (ograniczenia copy do reguł strażnika) / synthesis D-21, faza 2 p.7 (formularz PKE: Pages Function + Turnstile + Resend) / CLAUDE.md „hak: przyślij nam swój najgorszy Excel" · Dodano: 2026-09-12 · Plik: `rules/legal-pke-consent-forms.md`

#### Zasada

1. **Uprzednia zgoda przed informacją handlową.** Art. 398 Prawa komunikacji elektronicznej (obowiązuje od 10.11.2024) zakazuje wysyłania informacji handlowej środkami komunikacji elektronicznej bez zgody odbiorcy — **także wobec osób prawnych**, w tym na adresy `biuro@`, `kontakt@`, `rekrutacja@`, i także przy marketingu bezpośrednim przez telefon. **Soft opt-in w Polsce nie istnieje** (art. 13 ust. 2 dyrektywy e-Privacy nigdy nie został transponowany), więc „klient już z nami rozmawiał" nie jest podstawą.
2. **Dwa niezależne piętra.** Uzasadniony interes z art. 6 ust. 1 lit. f RODO **nie zastępuje** zgody z PKE (WSA, II SA/Wa 62/25, wyrok z 8.08.2025). Zgodność z RODO (`legal-rodo-page-required`) jest warunkiem koniecznym, nie wystarczającym.
3. **Konsekwencja dla UI:** żaden formularz, przycisk ani modal na `klarow.com` nie może sugerować, że wysłanie wiadomości albo zapis „przy okazji" oznacza zgodę marketingową. Checkboxy zgód: **zero `checked` / `defaultChecked`**, zgoda oddzielona od treści przycisku, osobna zgoda na każdy kanał (mail, telefon), pełna treść zgody widoczna bez rozwijania, wersja zgody zapisana z datą.
4. **Inbound jest bezpieczny.** Formularz i hak „Przyślij nam swój najgorszy Excel", `mailto:`, `tel:` i rezerwacja terminu to kontakt zainicjowany przez użytkownika: art. 398 ust. 2 (udostępnienie adresu **w celu** otrzymania informacji). Warunek: formularz nie dokłada domyślnie zgody na newsletter ani na „informacje o nowościach".
5. **Newsletter = double opt-in.** Odrębna, niezaznaczona zgoda + mail potwierdzający z linkiem aktywacyjnym; dowód (data, wersja treści zgody, adres) przechowywany; każda wiadomość niesie link rezygnacji działający w jednym kliknięciu. Wycofanie zgody musi być tak łatwe jak jej udzielenie.
6. **Outbound w dwóch krokach** (playbook): zaproszenie LinkedIn bez oferty, z pytaniem o zgodę na przesłanie materiałów i linkiem do `/rodo` → dopiero po zgodzie mail z ofertą → telefon. Każdy szablon trzyma się jednego źródła i jest zatwierdzany przez founderów; treść pytania o zgodę cytuje administratora i kanał.
7. **Brak zarejestrowanej działalności niczego nie zmienia.** Art. 398 PKE dotyczy wysyłającego, nie jego statusu rejestrowego: wiadomość handlowa wysłana przez osobę fizyczną promującą własne usługi jest informacją handlową tak samo jak wysłana przez spółkę. Treść zgody nazywa administratora zgodnie ze stałą `CONTROLLER` w `src/data/rodo.ts` (dziś: imię i nazwisko), a zmiana administratora po rejestracji wymaga podbicia `CONSENT_VERSION` i poinformowania osób już w bazie w kolejnej wiadomości.
8. **Zakaz dark patterns:** brak „zgadzam się" wpisanego w etykietę przycisku wysyłki, brak zgody zbiorczej („akceptuję regulamin i zgody marketingowe"), brak cookie-walla warunkującego dostęp do treści od zgody marketingowej.

#### Mechanizm awarii (dlaczego)

Sankcja UKE za naruszenie art. 398 PKE wynosi **3 % przychodu albo 1 mln zł — wyższa z kwot**; przy zerowym przychodzie sufitem jest milion, a precedens na małej spółce (Tani Opał sp. z o.o.) to 500 tys. zł. Ryzyko jest asymetryczne: jeden mail wysłany na `biuro@` bez zgody kosztuje więcej niż cały pilot. Domyślnie zaznaczony checkbox nie jest zgodą (wymaga „wyraźnego działania potwierdzającego", art. 4 pkt 11 i motyw 32 RODO), więc baza zbudowana na takim formularzu jest bezużyteczna prawnie — i nie da się udowodnić, kto i kiedy jej udzielił. Zgoda zbiorcza upada w całości: podważenie jednego elementu unieważnia pozostałe. Kolejność „najpierw zgoda, potem oferta" jest też wymogiem biznesowym: firma, która dostaje niezamówioną ofertę od dostawcy sprzedającego „porządek w danych", dostaje dowód przeciwko tezie.

#### Niepoprawnie

```tsx
// formularz kontaktowy: zgoda domyślnie zaznaczona, zbiorcza, wpisana w przycisk
<label>
  <input type="checkbox" name="zgoda" defaultChecked />           {/* brak wyraźnego działania = brak zgody */}
  Akceptuję regulamin i zgadzam się na kontakt marketingowy oraz newsletter   {/* zgoda zbiorcza */}
</label>
<button type="submit">Wysyłając formularz akceptuję zgody</button> {/* zgoda ukryta w akcji */}
```
```ts
// outbound: oferta handlowa na adres firmowy bez uprzedniej zgody
sendMail({ to: "biuro@firma.pl", subject: "Oferta: automatyzacja raportowania", body: OFERTA });
// art. 398 PKE obejmuje także osoby prawne; art. 6 ust. 1 lit. f RODO tego nie naprawia (WSA II SA/Wa 62/25)
```

#### Poprawnie

```tsx
// site/src/components/ContactForm.tsx — inbound (art. 398 ust. 2); zgoda osobna, pusta, per kanał
<label className="consent">
  <input type="checkbox" name="consentMail" />                    {/* bez checked / defaultChecked */}
  <span>{pick(CONSENT.mail, lang)}</span>
</label>
<label className="consent">
  <input type="checkbox" name="consentPhone" />
  <span>{pick(CONSENT.phone, lang)}</span>
</label>
<p className="hint">{pick(CONSENT.note, lang)}</p>
<button type="submit">{pick(CTA.send, lang)}</button>
```
```ts
// site/src/data/consent.ts — jedno źródło treści zgód, z wersją (dowód przy audycie UKE)
export const CONSENT_VERSION = "2026-09-12";
export const CONSENT = {
  mail:  { pl: "Zgadzam się na otrzymanie odpowiedzi i materiałów handlowych na podany adres e-mail od KLAROW (administrator: …).", en: "…" },
  phone: { pl: "Zgadzam się na kontakt telefoniczny w sprawie mojego zgłoszenia.", en: "…" },
  note:  { pl: "Zgody są dobrowolne i możesz je wycofać w każdej chwili, pisząc na kontakt@klarow.com. Szczegóły: /rodo.", en: "…" },
};
```
```ts
// outbound krok 1 (LinkedIn, bez oferty): pytanie o zgodę + adres klauzuli
const invite = {
  pl: "Dzień dobry, budujemy narzędzia pod proces w firmach produkcyjnych. Czy mogę przesłać krótki materiał na e-mail? Skąd mamy dane i jak wnieść sprzeciw: klarow.com/rodo",
};
```

#### Test

```bash
# 1. zero domyślnie zaznaczonych zgód w całym froncie
grep -rnE "type=\"checkbox\"[^>]*(defaultChecked|checked(\s|=\{true\}|>))" site/src            # 0
# 2. zero zgód zbiorczych: jedna etykieta z dwoma celami
grep -rniE "akceptuję.*(i|oraz).*(marketing|newsletter)|zgadzam się.*(i|oraz).*(newsletter|marketing)" site/src site/dist   # 0
# 3. zgoda nie może być warunkiem wysyłki ani treścią przycisku
grep -rniE "<button[^>]*>[^<]*(zgadzam|akceptuj)" site/src                                     # 0
# 4. treści zgód tylko z jednego źródła, z wersją
test -f site/src/data/consent.ts && grep -n "CONSENT_VERSION" site/src/data/consent.ts
# 5. formularz wysyłający dane musi mieć pole zgody (albo być czystym mailto inbound)
grep -rnE "<form" site/src | while read -r hit; do echo "sprawdź ręcznie: $hit"; done
# 6. szablony outboundu: krok 1 bez oferty, z linkiem do /rodo
grep -rniE "oferta|cennik|kup" leadscout/playbook-outbound.md | head                            # nie w szablonie zaproszenia
grep -rci "klarow.com/rodo" leadscout/playbook-outbound.md                                      # >= 1
# 7. bot i digesty nie wysyłają informacji handlowej do osób trzecich (tylko do founderów)
grep -rnE "sendMessage|chat_id" leadscout/notify.mjs | head
```

#### Wyjątki

Odpowiedź na zapytanie zainicjowane przez odbiorcę (formularz, `mailto:`, rezerwacja, telefon od klienta) nie wymaga odrębnej zgody — art. 398 ust. 2 PKE; zgoda jest potrzebna dopiero na kolejne, niezamówione wiadomości handlowe i na newsletter.

**Spór między organami („paradoks zgody"), nie ustalony stan prawny** (za oknem researchu c1, do rozstrzygnięcia przez radcę): UKE dopuszcza neutralne zapytanie o zgodę na kontakt handlowy jako czynność poprzedzającą marketing, natomiast UOKiK w decyzji DOZIK 3/2019 uznał takie zapytanie za informację handlową samą w sobie. Dopóki radca tego nie rozstrzygnie, pierwsza wiadomość ma być maksymalnie neutralna (prośba o zgodę bez opisu oferty, bez cennika, bez CTA sprzedażowego) i traktowana w audycie jako materiał objęty tą regułą. Komunikacja wewnętrzna (digesty Lead-Scout na Telegram do founderów) nie jest informacją handlową. Kwalifikacja telefonu jako kanału objętego art. 398 (telekomunikacyjne urządzenia końcowe w marketingu bezpośrednim) jest w tej regule przyjęta ostrożnościowo — do potwierdzenia przez radcę przy zatwierdzaniu szablonów; do czasu potwierdzenia obowiązuje wersja ostrożniejsza (pytamy o zgodę także na telefon).

### 11.4 legal-rodo-page-required

**Trasa /rodo istnieje PRZED pierwszym kontaktem handlowym; katalog art. 14 RODO z KONKRETNYMI źródłami danych i prawem sprzeciwu wyróżnionym odrębnie**

Impact: **BLOCKER** · Tagi: legal, rodo, gdpr, outbound, prerender, footer, privacy, uodo · Źródło: peer-legal.md §1.1 (twardy bloker; Bisnode 943 470 zł — decyzja Prezesa UODO potwierdzona przez NSA; plan kontroli sektorowych UODO na 2026 z 8.01.2026) / rozstrzygnięcie nadrzędne (1): /rodo kanoniczne, /polityka-prywatnosci = alias 301 / synthesis §2.2 (19 HTML), D-21 (szkielet CC + przegląd radcy) / CLAUDE.md „Do zrobienia" · Dodano: 2026-09-12 · Plik: `rules/legal-rodo-page-required.md`

#### Zasada

Trasa `/rodo` (kanoniczna; `/polityka-prywatnosci` = alias 301 w `_redirects`) musi istnieć i być prerenderowana jako `dist/rodo.html`, **zanim wyjdzie pierwszy kontakt handlowy** (list, zaproszenie LinkedIn, permission-mail, telefon, wizytówka z QR). To jeden dokument: klauzula informacyjna z art. 14 RODO + polityka prywatności serwisu.

Obowiązkowy katalog treści (art. 14 ust. 1–2 RODO), każdy punkt jako osobna sekcja z nagłówkiem:
1. **Administrator i kontakt** — tożsamość administratora w jednym z dwóch wariantów: **(a) osoba fizyczna** (imię i nazwisko + adres do korespondencji **albo** zdanie o adresie na żądanie), **(b) zarejestrowany podmiot** (pełna nazwa, adres, NIP). RODO nie wymaga rejestracji działalności ani numeru NIP: wymaga tożsamości i danych kontaktowych (art. 14 ust. 1 lit. a; art. 4 pkt 7 dopuszcza administratora będącego osobą fizyczną). Jedno źródło: stała `CONTROLLER` w `src/data/rodo.ts`; NAP wyłącznie z `src/data/contact.ts` (`code-contact-single-source`). Marker `[DECYZJA FOUNDERÓW: …]` w treści = BLOCKER publikacji. Wskazujemy **jednego** administratora; gdy cele i sposoby ustalają faktycznie obaj founderzy, powstaje współadministrowanie z art. 26 i `/rodo` musi zawierać zasadniczą treść uzgodnień (D25).
2. **Źródła danych — KONKRETNE, nazwane co do rodzaju i momentu**: „z ogłoszenia o pracę opublikowanego na portalu `<nazwa>` w dniu `<data>`", „z Krajowego Rejestru Sądowego", „z CEIDG", „ze strony internetowej Państwa firmy", „z profilu firmowego na LinkedIn". **Zakazane sformułowanie: „ze źródeł publicznie dostępnych"** i każdy jego wariant („z ogólnodostępnych rejestrów", „z internetu") — to właśnie zakwestionowano u Bisnode.
3. **Kategorie danych** — wyliczone: nazwa firmy, adres i dane rejestrowe, służbowy adres e-mail, służbowy numer telefonu, imię i nazwisko oraz stanowisko osoby kontaktowej, treść ogłoszenia będącego sygnałem.
4. **Cel i podstawa prawna** — art. 6 ust. 1 lit. f RODO (uzasadniony interes) **z wyjaśnieniem, na czym ten interes polega** („marketing bezpośredni własnych usług kierowany do firm o profilu odpowiadającym naszej ofercie"; motyw 47 RODO), a przy rezerwacji i korespondencji zainicjowanej przez odbiorcę dodatkowo art. 6 ust. 1 lit. b.
5. **Odbiorcy danych** — hosting i usługi wymienione z nazwy (Cloudflare, poczta, w przyszłości Cal.com, analityka), spójnie z `references/integrations-registry.md`; transfer poza EOG i jego podstawa.
6. **Okres przechowywania** — konkretny: **„do zgłoszenia sprzeciwu, nie dłużej niż 12 miesięcy od ostatniego kontaktu"** (jedno brzmienie w regule i w planie §4.6 pkt 5; wcześniejszy rozjazd 24 kontra 12 miesięcy usunięty 2026-09-12), nigdy „przez okres niezbędny do realizacji celu".
7. **Prawa** — dostęp, sprostowanie, usunięcie, ograniczenie, przenoszenie (gdy dotyczy).
8. **PRAWO SPRZECIWU — WYRÓŻNIONE ODRĘBNIE** od pozostałych informacji: własna sekcja z własnym nagłówkiem (`<section id="sprzeciw">`), wizualnie wyróżniona (obrys `--border`, wyższy stopień pisma), umieszczona **nad** listą pozostałych praw, nigdy jako punkt tej listy. Wymaga tego wprost art. 21 ust. 4 RODO („wyraźnie i odrębnie od wszelkich innych informacji").
9. **Mechanizm sprzeciwu** — działający `mailto:kontakt@klarow.com?subject=Sprzeciw` z gotowym tematem; żaden backend nie jest potrzebny. Obietnica: usunięcie z bazy kontaktów i potwierdzenie zwrotne.
10. **Organ nadzorczy** — Prezes Urzędu Ochrony Danych Osobowych, ul. Stawki 2, 00-193 Warszawa.

**Dwa progi, nie jeden (korekta 2026-09-12).** **Publikacja strony** wymaga bramki `SITE_PUBLISHABLE`: trasa istnieje i jest linkowana w stopce, tożsamość administratora wpisana (zero markerów w `dist/rodo.html`), sekcje o serwisie kompletne, strona nic nie zbiera (zero formularzy wysyłających dane, zero cookies, zero analityki wymagającej zgody). **Pierwszy kontakt handlowy** wymaga dodatkowo bramki `OUTREACH_READY` (reguła `legal-outreach-readiness`). Publikacja portfolio **nie** czeka na rejestrację działalności, NIP ani adres siedziby; rejestracja jest warunkiem pierwszej faktury, nie pierwszego maila. **Uwaga na błędny wniosek: „strona żyje, więc można wysyłać" jest fałszem.**

Wymagania techniczne: wpis w `pagesSeo.ts` (klucz `rodo`, title ≤ 60 zn., description 130–165 zn., PL + EN), `RodoPage` w routerze `App.tsx`, `RodoShell` w `prerenderAll()` (`seo-prerender-must-keep`: 19 HTML), **link „RODO i prywatność" w stopce na KAŻDEJ trasie**, alias `/polityka-prywatnosci /rodo 301` w `_redirects` (`seo-redirects-registry`), wpis w `llms.txt` (generowany automatycznie). **Do sitemapy `/rodo` NIE wchodzi**, dopóki ma `noindex` (patrz §Wyjątki i `seo-sitemap-llms-generated`: 17 `<loc>`); wchodzi dopiero po zdjęciu `noindex` (D-21), wtedy z priorytetem 0.3. Treść pisze Claude Code jako szkielet, zatwierdza radca prawny (D-21) — do przeglądu strona ma `noindex`, ale jest publicznie dostępna pod adresem, bo linkują do niej wszystkie szablony outboundu.

#### Mechanizm awarii (dlaczego)

Art. 14 RODO dotyczy danych pozyskanych **nie od osoby, której dotyczą** — dokładnie tego, co robi Lead-Scout (ogłoszenia o pracę, KRS, CEIDG, strony firm). Obowiązek informacyjny trzeba wykonać **przy pierwszej komunikacji**, nie w drugim mailu i nie drobnym drukiem. Bisnode pobierał dane z rejestrów publicznych i zapłacił **943 470 zł** — decyzja Prezesa UODO potwierdzona przez NSA — **wyłącznie** za niewykonanie tego obowiązku; zakwestionowano m.in. ogólnikowe „ze źródeł publicznie dostępnych" zamiast wskazania konkretnego rejestru. Plan kontroli sektorowych UODO na 2026 (opublikowany 8.01.2026) obejmuje sektor marketingowy, w tym weryfikację baz danych używanych w działaniach marketingowych. Pełna klauzula nie mieści się w zaproszeniu LinkedIn (limit 300 znaków) ani na wizytówce — jedynym nośnikiem jest krótki link, więc brak `dist/rodo.html` to soft-404 pod adresem, do którego odsyła każdy szablon outboundu, i cała podstawa zgodności znika. Prawo sprzeciwu schowane jako siódmy punkt listy praw narusza art. 21 ust. 4 nawet wtedy, gdy sama treść jest poprawna.

#### Niepoprawnie

```tsx
// site/src/prerender/entry.tsx — RodoShell: ogólnik + sprzeciw jako punkt listy
<h2>Skąd mamy Twoje dane</h2>
<p>Dane pozyskaliśmy ze źródeł publicznie dostępnych.</p>           {/* dokładnie to zakwestionowano u Bisnode */}
<h2>Przysługujące prawa</h2>
<ul>
  <li>prawo dostępu do danych</li>
  <li>prawo sprostowania</li>
  <li>prawo usunięcia</li>
  <li>prawo wniesienia sprzeciwu</li>                               {/* art. 21 ust. 4: musi być ODRĘBNIE */}
</ul>
<p>Dane przechowujemy przez okres niezbędny do realizacji celu.</p> {/* brak okresu */}
```
```ts
// szablon outboundu bez adresu klauzuli — obowiązek z art. 14 niewykonany
const invite = { pl: "Dzień dobry, budujemy narzędzia pod proces. Umówimy 30 minut?" };
```

#### Poprawnie

```ts
// site/src/data/pagesSeo.ts
rodo: {
  title:       { pl: "RODO i prywatność", en: "Privacy and GDPR" },
  description: { pl: "Skąd mamy Twoje dane, na jakiej podstawie je przetwarzamy, jak długo je trzymamy i jak jednym mailem wnieść sprzeciw wobec kontaktu.", en: "…" },
},
```
```tsx
// site/src/prerender/entry.tsx — RodoShell (fragmenty kluczowe)
<h2 id="zrodla">Skąd mamy Twoje dane</h2>
<ul>
  <li>z ogłoszenia o pracę opublikowanego na portalu pracuj.pl w dniu wskazanym w naszej pierwszej wiadomości</li>
  <li>z Krajowego Rejestru Sądowego (KRS) albo z Centralnej Ewidencji i Informacji o Działalności Gospodarczej (CEIDG)</li>
  <li>ze strony internetowej Twojej firmy albo z jej profilu na LinkedIn</li>
</ul>
<p>Nie kupujemy baz danych i nie korzystamy z brokerów danych.</p>

<section id="sprzeciw" className="panel panel-accent">        {/* art. 21 ust. 4: odrębnie i wyraźnie */}
  <h2>Prawo sprzeciwu</h2>
  <p>W każdej chwili możesz wnieść sprzeciw wobec przetwarzania Twoich danych do celów marketingu bezpośredniego.
     Po sprzeciwie natychmiast przestajemy je przetwarzać w tym celu i usuwamy Cię z bazy kontaktów.</p>
  <a href="mailto:kontakt@klarow.com?subject=Sprzeciw%20wobec%20przetwarzania%20danych">kontakt@klarow.com — wnieś sprzeciw</a>
</section>

<h2 id="okres">Jak długo trzymamy dane</h2>
<p>Do zgłoszenia sprzeciwu, a jeśli sprzeciw nie wpłynie — nie dłużej niż 24 miesiące od ostatniego kontaktu.</p>
<h2 id="organ">Skarga do organu</h2>
<p>Prezes Urzędu Ochrony Danych Osobowych, ul. Stawki 2, 00-193 Warszawa.</p>
```
```text
# site/public/_redirects
/polityka-prywatnosci   /rodo   301
```
```tsx
// site/src/components/Footer.tsx — link na każdej trasie
<Link to="/rodo">{pick({ pl: "RODO i prywatność", en: "Privacy and GDPR" }, lang)}</Link>
```

#### Test

```bash
cd site && npm run build && cd ..
test -f site/dist/rodo.html && echo "OK /rodo"                                       # brak pliku = BLOCKER
find site/dist -name "*.html" | wc -l                                                # 19
grep -ciE "źródeł publicznie dostępnych|ogólnodostępnych rejestrów" site/dist/rodo.html   # 0
grep -ciE "Krajowego Rejestru Sądowego|CEIDG" site/dist/rodo.html                    # >= 1
grep -ciE "ogłoszeni[ae] o prac" site/dist/rodo.html                                 # >= 1
grep -coE "id=.sprzeciw." site/dist/rodo.html                                        # 1 (odrębna sekcja)
grep -ciE "mailto:kontakt@klarow.com\?subject=Sprzeciw" site/dist/rodo.html          # >= 1
grep -ciE "Stawki 2" site/dist/rodo.html                                             # 1 (adres UODO)
grep -ciE "okres niezbędny" site/dist/rodo.html                                      # 0
grep -c "DECYZJA FOUNDER" site/dist/rodo.html                                        # 0 (tożsamość administratora wpisana)
grep -nE "^export const (SITE_PUBLISHABLE|OUTREACH_READY)" site/src/data/rodo.ts     # 2 wpisy
grep -ciE "12 miesięcy od ostatniego kontaktu" site/dist/rodo.html                   # >= 1 (okres musi być konkretny)
for f in $(find site/dist -name "*.html" ! -name "404.html"); do grep -q "href=\"/rodo\"" "$f" || echo "FAIL brak linku w stopce: $f"; done
grep -nE "^/polityka-prywatnosci[[:space:]]+/rodo[[:space:]]+301" site/public/_redirects   # 1
node ".claude/skills/klarow-guardian/scripts/verify-site.mjs"                        # findings o id legal-rodo-page-required: 0
grep -rciE "klarow.com/rodo" leadscout/playbook-outbound.md                          # >= 1 (każdy szablon niesie adres klauzuli)
```

#### Wyjątki

Do przeglądu radcy (D-21) `/rodo` ma `<meta name="robots" content="noindex">`: jest publicznie dostępna, ale nie indeksowana, i wtedy nie wchodzi do `sitemap.xml` (tak jak `404.html`), mimo że liczy się do 19 HTML. Wersja EN jest tłumaczeniem informacyjnym z adnotacją „w razie rozbieżności wiążąca jest wersja polska"; `i18n-pl-en-pair-required` obowiązuje dla nawigacji, nagłówków i meta tej trasy, ale nie wymaga tłumaczenia przysięgłego treści prawnej. `verify-site.mjs` zgłasza findings tej reguły pod pełnym id `legal-rodo-page-required` (`scripts/verify-site.mjs:224, 226`); żaden skrót ani alias id nie istnieje.

### 11.5 legal-analytics-cookieless-or-consent

**Pomiar tylko cookieless i bez identyfikatorów albo z uprzednią zgodą; zero GA4, pikseli i fingerprintingu, zawsze wpis w /rodo**

Impact: **HIGH** · Tagi: legal, analytics, cookies, consent, privacy, cloudflare, rodo · Źródło: peer-legal.md §1.1 (kolejność: najpierw /rodo, potem pomiar) / synthesis D-16 (CF Web Analytics + GSC + zdarzenia przez Zaraz albo Pages Function), §2.8 p.8 (lista zdarzeń) / rules/seo-gsc-and-analytics.md (warstwa techniczna), rules/integ-embed-requires-privacy.md / references/integrations-registry.md (cf-web-analytics, cf-zaraz) · Dodano: 2026-09-12 · Plik: `rules/legal-analytics-cookieless-or-consent.md`

#### Zasada

Pomiar na `klarow.com` istnieje w dokładnie jednym z dwóch wariantów i nigdy pomiędzy:
1. **Cookieless bez identyfikatora** (wariant przyjęty, D-16): Cloudflare Web Analytics, ewentualnie zdarzenia CTA przez Zaraz albo własny endpoint Pages Function. Warunki: zero cookies, zero `localStorage`/`sessionStorage`/IndexedDB w celu pomiaru, zero identyfikatora użytkownika (także pseudonimowego i wyliczanego z IP+UA), zero fingerprintingu (canvas, fonty, `navigator.plugins`), zero przekazywania treści formularzy. Baner zgody nie jest wtedy potrzebny, ale **sekcja w `/rodo` jest obowiązkowa** (odbiorca danych, cel, zakres, brak cookies, transfer).
2. **Z uprzednią zgodą**: cokolwiek, co zapisuje lub odczytuje informacje na urządzeniu użytkownika w celu innym niż niezbędny (GA4, Hotjar, Clarity, Meta Pixel, LinkedIn Insight Tag, remarketing). Wymaga: decyzji founderów, wpisu w `references/integrations-registry.md` i w `/rodo`, banera z odrzuceniem równie łatwym jak akceptacja, brakiem domyślnych zaznaczeń, brakiem cookie-walla i **blokadą ładowania skryptu do czasu zgody**. Do czasu takiej decyzji te narzędzia są zakazane (`integ-no-external-scripts-on-site`).

Dodatkowo: `klarow-lang` w `localStorage` to preferencja ustawiana świadomym działaniem użytkownika (przełącznik PL/EN) — pamięć niezbędna, bez zgody, ale nie wolno jej użyć jako identyfikatora ani wysłać do pomiaru. Zdarzenia CTA mają stałą listę nazw (`src/lib/track.ts`), nie niosą PII ani treści wpisanych przez użytkownika, są emitowane wyłącznie w handlerach UI i nigdy w silnikach dem (`demo-events-outside-engines`, `demo-determinism`). `track()` jest no-op przy `navigator.doNotTrack === "1"` i w trybie bez zgody tam, gdzie zgoda jest wymagana. Kolejność wdrożenia jest twarda: `/rodo` → wpis w rejestrze → beacon.

**Właściciel konta = administrator (korekta 2026-09-12).** Administratorem danych z pomiaru i z usług zewnętrznych (Cloudflare, GSC, Cal.com) jest ta sama osoba lub podmiot, który widnieje w `CONTROLLER` w `src/data/rodo.ts`; konto u dostawcy prowadzi ta sama osoba, a `references/integrations-registry.md` ma kolumnę **„właściciel konta"**. Umowę powierzenia (DPA) zawiera administrator; osoba fizyczna może ją zawrzeć bez NIP-u. Żadne zdarzenie nie niesie nazwy ani treści pliku wgranego przez użytkownika (`demo-client-side-only-claim`).

To wymaganie produktowe, nie opinia prawna; kwalifikacja i treść klauzul do przeglądu radcy (D-21).

#### Mechanizm awarii (dlaczego)

Zapis lub odczyt informacji na urządzeniu końcowym w celu innym niż niezbędny wymaga uprzedniej zgody (art. 173 Prawa telekomunikacyjnego, po 10.11.2024 odpowiednik w Prawie komunikacji elektronicznej) — to reżim niezależny od RODO, ten sam podział pięter co przy `legal-pke-consent-forms`. GA4 stawia cookies `_ga` przy pierwszym żądaniu, jeszcze zanim baner się wyrenderuje, więc „baner po załadowaniu skryptu" nie naprawia niczego; dodatkowo przesyła dane do USA, co wymaga opisu transferu w `/rodo`. Cloudflare Web Analytics nie stawia cookies i nie profiluje, dlatego mieści się w wariancie 1 — ale Cloudflare pozostaje odbiorcą danych technicznych, więc pominięcie go w `/rodo` to naruszenie obowiązku informacyjnego, nie kwestia stylu. Fingerprinting bez cookies bywa przedstawiany jako „prywatny"; prawnie jest gorszy od cookie, bo użytkownik nie może go wyczyścić. Wreszcie: marka stoi na „prawdziwie zero chmury"; strona, która sama wysyła zachowanie odwiedzających do zewnętrznego profilera, obala własną tezę szybciej niż jakikolwiek konkurent.

#### Niepoprawnie

```html
<!-- site/index.html: GA4 bez zgody, bez wpisu w /rodo, bez decyzji; cookies ustawiane natychmiast -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag("js",new Date());gtag("config","G-XXXXXXX")</script>
```
```ts
// pseudonimowy identyfikator = dane osobowe i zapis na urządzeniu bez zgody
const vid = localStorage.getItem("vid") ?? crypto.randomUUID();
localStorage.setItem("vid", vid);
fetch(`/api/e?ev=view&vid=${vid}&q=${encodeURIComponent(input.value)}`);   // do tego treść wpisana przez użytkownika
```

#### Poprawnie

```html
<!-- site/index.html (szablon wszystkich 19 HTML): cookieless, defer, po treści; wpis w /rodo i w rejestrze integracji -->
<script defer src="https://static.cloudflareinsights.com/beacon.min.js"
        data-cf-beacon='{"token":"<token publiczny>"}'></script>
```
```ts
// site/src/lib/track.ts — stała lista nazw, zero PII, no-op przy DNT
const EVENTS = ["cta_book_open","cta_mail","cta_tel","cta_worst_excel","demo_load_example","pdf_download","lang_toggle","founders_view","calc_tranche_run"] as const;
export function track(ev: (typeof EVENTS)[number]) {
  if (typeof navigator !== "undefined" && navigator.doNotTrack === "1") return;
  window.zaraz?.track(ev);                       // bez cookies, bez identyfikatora, bez parametrów użytkownika
}
```
```tsx
// wywołanie tylko w handlerze UI, nigdy w lib/** ani w dashboards/**
<button onClick={() => { track("cta_book_open"); openBooking(); }}>{pick(CTA.book, lang)}</button>
```
`/rodo`, sekcja „Odbiorcy danych": Cloudflare, Inc. — hosting i pomiar odsłon bez cookies (adres IP, user agent, adres strony, wskaźniki Core Web Vitals); podstawa art. 6 ust. 1 lit. f RODO; transfer do USA na standardowych klauzulach umownych.

#### Test

```bash
# 1. zakazane narzędzia pomiaru w kodzie i w buildzie
grep -rniE "googletagmanager|gtag\(|google-analytics|hotjar|clarity\.ms|connect\.facebook|fbq\(|snap\.licdn|matomo|plausible" site/src site/index.html site/dist   # 0
# 2. zero cookies i zero identyfikatorów pomiarowych
grep -rn "document.cookie" site/src                                                    # 0
grep -rnE "localStorage\.(set|get)Item\(" site/src | grep -viE "klarow-lang|klarow:"    # 0
grep -rniE "crypto.randomUUID|fingerprint|canvas.toDataURL" site/src                    # 0
# 3. jeśli beacon istnieje: defer + wpis w /rodo + wpis w rejestrze
grep -n "cloudflareinsights" site/index.html && grep -n "defer" site/index.html
grep -ci "cloudflare" site/dist/rodo.html                                               # >= 1
grep -n "cf-web-analytics" .claude/skills/klarow-guardian/references/integrations-registry.md
# 4. zdarzenia wyłącznie w UI, nigdy w silnikach
grep -rn "track(" site/src/lib site/src/components/dashboards site/src/components/DemoReport.tsx   # 0
# 5. skaner integracji (nowe hosty w dist)
node ".claude/skills/klarow-guardian/scripts/find-integrations.mjs" --dist --strict --quiet
```

#### Wyjątki

Google Search Console (weryfikacja właściciela rekordem TXT albo plikiem w `public/`) nie ładuje żadnego skryptu u odwiedzającego i nie wymaga zgody ani banera; wpis w rejestrze integracji jest i tak wymagany. Logi brzegowe Cloudflare powstają po stronie hostingu niezależnie od strony (wariant 1 ich nie zwiększa), ale muszą być opisane w `/rodo` jako dane techniczne hostingu. Pomiar w narzędziach wdrażanych u klienta on-premise podlega decyzji klienta, nie tej regule — z zastrzeżeniem `integ-no-llm-api-in-client-tools`.

### 11.6 legal-privacy-before-embeds

**Embed (Cal.com, mapa, wideo, widget) wolno włączyć dopiero po sekcji w /rodo, wpisie w rejestrze integracji i CSP w _headers**

Impact: **HIGH** · Tagi: legal, embed, calcom, rodo, csp, cookies, consent, iframe, privacy · Źródło: peer-legal.md §1.1 (kolejność: /rodo blokuje wszystko, co wysyła dane), §1.4 (formularze bez domyślnych zgód) / synthesis D-15 (faza 1 link, faza 2 embed), §2.2 („CSP tylko przy embedzie Cal.com"), faza 2 p.12 / rules/integ-embed-requires-privacy.md (bramka techniczna), references/integrations-registry.md (calcom) / docs/plan/domena-serwer-krok-po-kroku.md:102-108 · Dodano: 2026-09-12 · Plik: `rules/legal-privacy-before-embeds.md`

#### Zasada

Kolejność jest twarda i nie wolno jej odwracać. Zanim na `klarow.com` pojawi się `<iframe>`, zewnętrzny `<script>` albo widget (Cal.com, mapa, odtwarzacz wideo z obcej domeny, czat, formularz dostawcy), muszą istnieć **wszystkie pięć** elementów:
1. decyzja founderów zapisana w `docs/DECISIONS.md` (dziś: D-15 rezerwacja, D-16 pomiar),
2. **sekcja w `/rodo`** nazywająca usługę z pełnej nazwy podmiotu i kraju, z celem, zakresem danych (adres IP, user agent, referrer, cookies, dane wpisane w widgecie), rolą (odbiorca czy podmiot przetwarzający), podstawą prawną i transferem poza EOG wraz z jego mechanizmem,
3. wpis w `references/integrations-registry.md` ze statusem `aktywna` i wypełnioną kolumną „dane, które wychodzą",
4. `Content-Security-Policy` w `site/public/_headers` z wymienionymi hostami (`frame-src`, `script-src`, `connect-src`, `img-src`),
5. jeśli embed zapisuje cookies nieniezbędne albo profiluje: **click-to-load** (iframe montowany dopiero po kliknięciu użytkownika w zastępczy przycisk) albo zgoda zgodna z `legal-analytics-cookieless-or-consent`.

**Właściciel konta u dostawcy = administrator z `CONTROLLER`** (korekta 2026-09-12), także gdy jest osobą fizyczną bez NIP-u; wpis w kolumnie „właściciel konta" w `references/integrations-registry.md` jest częścią punktu 3.

Do czasu spełnienia wszystkich pięciu obowiązuje faza 1 (D-15 a): Cal.com jako **zwykły link zewnętrzny** `target="_blank" rel="noopener noreferrer"`, zero skryptów, zero ramek; `/rodo` i tak opisuje Cal.com jako usługę, na którą użytkownik przechodzi. Ta reguła pilnuje warstwy prawnej (treść `/rodo`, podstawa, transfer, zgoda); `integ-embed-requires-privacy` pilnuje warstwy technicznej (rejestr, CSP, brak skryptów spoza allowlisty). Obie muszą przejść; w raporcie audytu zgłaszaj tę, której brakuje, a przy obu brakach — wersję prawną.

To wymaganie produktowe, nie opinia prawna; kwalifikacja i treść klauzul do przeglądu radcy (D-21).

#### Mechanizm awarii (dlaczego)

Ramka `app.cal.com` wykonuje żądanie w momencie montażu komponentu: Cal.com dostaje adres IP, user agent i referrer oraz zapisuje własne cookies w kontekście third-party, **zanim** użytkownik cokolwiek zarezerwuje i zanim zobaczy jakąkolwiek informację. Bez opisu w `/rodo` to naruszenie obowiązku informacyjnego (art. 13 i 14 RODO), a cookies nieniezbędne bez zgody to naruszenie reżimu telekomunikacyjnego (art. 173 Prawa telekomunikacyjnego, po 10.11.2024 odpowiednik w PKE) — dwa niezależne piętra, jak przy PKE. Sam embed pociąga też zasoby dalsze (fonty, trackery dostawcy), niewidoczne w naszym rejestrze; CSP z jawną listą hostów jest jedyną mechaniczną gwarancją, że deklaracja „zero skryptów zewnętrznych poza zarejestrowanymi" pozostaje prawdziwa po każdej aktualizacji widgetu. Odwrócenie kolejności („najpierw wdrożymy, politykę dopiszemy w piątek") kończy się stanem, w którym strona zbiera dane bez podstawy, a jedyną naprawą jest wyłączenie funkcji, którą już obiecano klientom.

#### Niepoprawnie

```tsx
// site/src/components/BookingModal.tsx — embed od razu przy otwarciu modala
export function BookingModal() {
  return (
    <dialog open>
      <iframe src="https://app.cal.com/klarow/diagnoza?embed=true" width="100%" height="700" />
    </dialog>
  );
}
// brak sekcji w /rodo, brak CSP, brak wpisu w rejestrze, cookies third-party przy samym otwarciu
```
```html
<!-- mapa dojazdu „na szybko": Google ustawia cookies i poznaje IP każdego odwiedzającego -->
<iframe src="https://www.google.com/maps/embed?pb=…"></iframe>
```

#### Poprawnie

```tsx
// Faza 1 (D-15 a): link zewnętrzny, zero skryptów; /rodo wymienia Cal.com jako usługę docelową
<a className="btn btn-primary" href="https://cal.com/klarow/diagnoza" target="_blank" rel="noopener noreferrer">
  {pick(CTA.book, lang)}
</a>
```
```tsx
// Faza 2 (D-15 b): click-to-load po spełnieniu pięciu warunków
const [loadCal, setLoadCal] = useState(false);
{!loadCal ? (
  <>
    <p>{pick(PRIVACY.calNotice, lang)}</p>   {/* kto dostanie dane i po co, z linkiem do /rodo */}
    <button className="btn btn-primary" onClick={() => setLoadCal(true)}>{pick(CTA.loadCalendar, lang)}</button>
  </>
) : (
  <iframe title="Cal.com" src="https://app.cal.com/klarow/diagnoza?embed=true" loading="lazy" />
)}
```
```text
# site/public/_headers (faza 2)
/*
  Content-Security-Policy: default-src 'self'; script-src 'self' https://app.cal.com https://static.cloudflareinsights.com; frame-src https://app.cal.com; connect-src 'self' https://app.cal.com https://cloudflareinsights.com; img-src 'self' data: https://app.cal.com; style-src 'self' 'unsafe-inline'; font-src 'self'; object-src 'none'; base-uri 'self'
```
`/rodo`, sekcja „Odbiorcy danych": Cal.com, Inc. (USA) — rezerwacja terminu: imię, adres e-mail, wybrany termin, a przy załadowaniu kalendarza także adres IP, user agent i cookies Cal.com; podstawa art. 6 ust. 1 lit. b RODO; transfer do USA na standardowych klauzulach umownych.

#### Test

```bash
# 1. czy w kodzie albo w buildzie jest ramka lub skrypt spoza własnej domeny?
grep -rnE "<iframe|<script[^>]+src=\"(https?:)?//" site/src site/index.html site/dist 2>/dev/null | grep -v "klarow.com"
# 2. jeśli TAK — host musi być opisany w /rodo (przykład: cal.com)
grep -ci "cal.com" site/dist/rodo.html                                           # >= 1
# 3. CSP obecne i wymienia host ramki
grep -n "Content-Security-Policy" site/public/_headers && grep -nE "frame-src[^;]*app.cal.com" site/public/_headers
# 4. decyzja zapisana
grep -nE "D-15|D-16" docs/DECISIONS.md
# 5. rejestr integracji: status aktywna dopiero po 1-4
node ".claude/skills/klarow-guardian/scripts/find-integrations.mjs" --dist --strict --quiet
# 6. click-to-load: iframe nie może montować się bez akcji użytkownika
grep -rnE "<iframe" site/src | grep -v "loadCal|useState"                        # ręczna weryfikacja każdego trafienia
# 7. linki wychodzące bezpieczne
grep -rnE "target=\"_blank\"" site/src | grep -v "rel=\"noopener" | head         # 0
```

#### Wyjątki

Linki wychodzące (`<a href="https://cal.com/…">`, profile LinkedIn founderów) nie ładują niczego na naszej stronie: wystarczy wpis w rejestrze i wzmianka w `/rodo` (usługa docelowa), bez CSP i bez zgody. Osadzenie własnych zasobów (`site/public/media/*.webm`, poster, fonty z `public/fonts`) nie jest embedem zewnętrznym. `mailto:` i `tel:` otwierają aplikację użytkownika i nie wysyłają niczego ze strony, ale jako kanały kontaktu mają sekcję w `/rodo`.

### 11.7 legal-sources-for-market-numbers

**Każda liczba rynkowa publikowana ze źródłem i rokiem w tym samym zdaniu lub przypisie; zakaz liczb bez osiągalnego źródła**

Impact: **HIGH** · Tagi: legal, copy, numbers, sources, advertising, uokik, outbound, one-pager · Źródło: peer-legal.md §1.3 (tabela liczb bezpiecznych; zakaz „raportu Deloitte/IDC"; McKinsey zawsze z rokiem 2012; Panko 88 %) / references/allowed-numbers.md §2 / rules/copy-numbers-with-source.md (rejestr) i rules/copy-banned-claims.md · Dodano: 2026-09-12 · Plik: `rules/legal-sources-for-market-numbers.md`

#### Zasada

Liczba rynkowa (wynagrodzenie, procent, liczba dni, udział rynku, koszt, „firmy tracą N % czasu") opublikowana gdziekolwiek — `dist/**`, `llms.txt`, PDF one-pagera, szablon outboundu, post bota, slajd, wizytówka — niesie **w tym samym zdaniu, w komórce tabeli albo w widocznym przypisie**: nazwę źródła i **rok** publikacji. Gdy liczba jest wynikiem działania, obok stoi działanie („8 350 × 12 × 1,2048 ≈ 121 000 zł"), żeby czytelnik mógł sprawdzić.

Wolno używać wyłącznie liczb z tabeli w `references/allowed-numbers.md` §2, każda w brzmieniu i ze źródłem z tej tabeli:
- mediana wynagrodzenia kontrolera 8 350 zł brutto/mies. (P25 7 000, P75 9 800) — Ogólnopolskie Badanie Wynagrodzeń Sedlak & Sedlak 2026,
- 20,48 % składek pracodawcy i wynikające ~121 tys. zł/rok, fully-loaded 140–160 tys. — ZUS 2026,
- ~141 tys. zł/rok dla analityka danych mid — Sedlak & Sedlak 2026 + ZUS 2026,
- Time to Hire 33 dni / Time to Fill 56 dni — dane rynkowe PL, II poł. 2025 (przy użyciu wskazać publikację),
- fee agencji rekrutacyjnej 15–20 % rocznego brutto — rynek rekrutacyjny PL 2026 (jw.),
- **88 % arkuszy kalkulacyjnych zawiera błędy w formułach** (45 % logiczne, 23 % mechaniczne, 31 % pominięcia) — Panko, University of Hawai'i, „What We Know About Spreadsheet Errors" (recenzowane; najmocniejsza dostępna liczba),
- 19–20 % czasu pracowników wiedzy na wyszukiwanie informacji — McKinsey Global Institute, **rok 2012 obowiązkowo w cytacie**.

**Zakazane bezwzględnie:** „raport Deloitte/IDC o czasie traconym w Excelu" i każda jego parafraza (research nie dotarł do oryginału, liczba krąży bez referencji); każda liczba rynkowa bez osiągalnego źródła; zaokrąglanie w górę względem źródła; przypisywanie liczby innemu autorowi lub nowszemu rokowi niż w oryginale; liczby z wdrożeń poprzedniej firmy (`brand-no-nuconic`, D-07). Nowa liczba wchodzi do obiegu wyłącznie decyzją founderów: wiersz w `references/allowed-numbers.md` + wpis w `MESSAGING.allowedNumbers` w tym samym commicie (`copy-numbers-with-source`).

Ta reguła dokłada do rejestru z `copy-numbers-with-source` wymóg **widoczności** źródła dla czytelnika i **odpowiedzialności prawnej** za twierdzenie; rejestr pilnuje, że liczba w ogóle wolno użyć, ta reguła — jak ma wyglądać na stronie.

To wymaganie produktowe, nie opinia prawna; kwalifikacja i treść klauzul do przeglądu radcy (D-21).

#### Mechanizm awarii (dlaczego)

Liczba w materiale handlowym to twierdzenie o faktach: reklama wprowadzająca w błąd co do istotnych cech usługi i spodziewanych korzyści jest czynem nieuczciwej konkurencji (art. 16 ustawy o zwalczaniu nieuczciwej konkurencji) i nieuczciwą praktyką rynkową, a ciężar udowodnienia prawdziwości spoczywa na tym, kto ją podał. „Deloitte mówi, że…" bez osiągalnego raportu jest nie do obronienia. Biznesowo działa to jeszcze szybciej: CFO, który poprosi o źródło i go nie dostanie, przestaje wierzyć **wszystkim** pozostałym liczbom w dokumencie, łącznie z tymi poprawnymi — a marka stoi na haśle „kalkulator, nie wróżka". Liczba bez roku starzeje się cicho: McKinsey 19–20 % pochodzi z 2012 roku i podana bez daty sugeruje stan dzisiejszy, co jest wprowadzeniem w błąd nawet przy poprawnym cytacie.

#### Niepoprawnie

```ts
// site/src/data/faq.ts — liczba bez źródła i bez roku, plus zakazany „raport"
{ q: { pl: "Ile czasu tracimy w Excelu?" },
  a: { pl: "Firmy tracą nawet 30 % czasu pracy w arkuszach (raport Deloitte)." } }
```
```tsx
// one-pager: liczba z zaokrągleniem w górę, bez działania i bez roku
<p>Kontroler kosztuje firmę ponad 150 tys. zł rocznie.</p>
<p>Aż 90 % arkuszy zawiera błędy.</p>          {/* źródło mówi 88 %, wersja bez autora i tytułu */}
```

#### Poprawnie

```ts
// site/src/data/faq.ts — źródło i rok w tym samym zdaniu
{ q: { pl: "Skąd wiecie, że arkusze mają błędy?", en: "…" },
  a: { pl: "Z recenzowanego przeglądu badań: 88 % arkuszy kalkulacyjnych zawiera błędy w formułach (Panko, University of Hawai'i, „What We Know About Spreadsheet Errors”). Dlatego audyt jakości danych jest pierwszym krokiem, a nie dodatkiem.", en: "…" } }
```
```tsx
// /oferta — liczba z działaniem, czytelnik może sprawdzić; zero framingu odejmowania etatu
<p>
  Mediana wynagrodzenia kontrolera to 8 350 zł brutto miesięcznie (Ogólnopolskie Badanie Wynagrodzeń
  Sedlak &amp; Sedlak 2026), a ze składkami pracodawcy 20,48 % (ZUS 2026) daje to
  <span className="tabular-nums"> 8 350 × 12 × 1,2048 ≈ 121 000 zł</span> rocznie.
  Nie proponujemy, żeby ten etat zniknął: proponujemy, żeby te 121 tys. kupowało analizę, a nie sklejanie arkuszy.
</p>
```
```ts
// references/allowed-numbers.md + messaging.ts w jednym commicie
{ value: "88 %", pl: "arkuszy kalkulacyjnych zawiera błędy w formułach", source: "Panko, University of Hawai'i, „What We Know About Spreadsheet Errors”", scope: ["oferta", "narzedzia/audyt-jakosci", "one-pager"] }
```

#### Test

```bash
# 1. zakazane źródła i twierdzenia bez pokrycia
grep -rniE "deloitte|idc|gartner|forrester" site/src site/dist leadscout docs --include="*.ts" --include="*.tsx" --include="*.html" --include="*.md"   # 0
# 2. McKinsey zawsze z rokiem 2012 w tym samym miejscu
grep -rn "McKinsey" site/src site/dist | grep -v "2012"                                # 0
# 3. Panko zawsze z autorem i tytułem przy 88 %
grep -rn "88 %" site/src site/dist | grep -viE "panko"                                 # 0
# 4. liczby z procentem w treści strony vs rejestr dozwolonych
node - <<'JS'
const fs=require("fs"),path=require("path");
const ok=fs.readFileSync(".claude/skills/klarow-guardian/references/allowed-numbers.md","utf8");
const files=[]; (function walk(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);
  e.isDirectory()?walk(p):p.endsWith(".html")&&files.push(p);}})("site/dist");
for(const f of files){const html=fs.readFileSync(f,"utf8").replace(/<script[\s\S]*?<\/script>/g,"");
  for(const m of html.matchAll(/(\d[\d  ]{0,9}(?:,\d+)?)\s?%/g)) if(!ok.includes(m[1].trim()))
    console.log(`${f} - HIGH [legal-sources-for-market-numbers] liczba ${m[0]} spoza references/allowed-numbers.md`);}
JS
# 5. bramka skryptowa (ten sam słownik, id copy-numbers-sourced)
node ".claude/skills/klarow-guardian/scripts/verify-site.mjs" --quiet
```

#### Wyjątki

Dane w dashboardach i dokumentach DEMO są jawnie fikcyjne i oznaczone (`demo-labels`) — nie są twierdzeniem o rynku i nie wymagają źródła. Liczby własne Klarow (12 dem, 13 pozycji portfolio, 3 dni, 12 dni) mają dowód w repozytoriach i podlegają `copy-numbers-with-source`, nie tej regule. Liczby prawne (943 470 zł Bisnode, 500 tys. zł Tani Opał, 3 % przychodu albo 1 mln zł) wolno przywoływać wyłącznie w `/rodo` i w dokumentach wewnętrznych — nigdy jako argument sprzedażowy.

## 12. Integracje zewnętrzne: rejestr, zero CDN, zero API modeli w runtime, CSP, zgody (`integ`)

Domyślny impact: **BLOCKER** · tryb: both · właściciel audytu: `integration-scanner`

### 12.1 integ-no-external-scripts-on-site

**Strona klarow.com nie ładuje niczego spoza własnej domeny bez decyzji, rejestru i /rodo**

Impact: **BLOCKER** · Tagi: integrations, cdn, analytics, embed, csp, privacy, perf · Źródło: site-audit §4 p.6-8 / company-ui SKILL.md „NO CDN" / synthesis §5.4.9 (integ-no-cdn, integ-csp) / synthesis §4 D-15, D-16 / strategy §7.3 · Dodano: 2026-09-12 · Plik: `rules/integ-no-external-scripts-on-site.md`

#### Zasada

W `site/` (źródła, `index.html`, `public/`, zbudowany `dist/`) nie ma zewnętrznych `<script src>`, `<link href>`,
`<iframe>`, `@import url()`, `url(https://…)`, fontów z CDN ani obrazów z hostów obcych. Stan 2026-09-12:
0 zewnętrznych zasobów (fonty self-hosted w `public/fonts`, biblioteki w bundlu Vite, obrazy w `public/`) —
**dowód: wyjście obu przebiegów skanera w `references/integrations-registry.md` §5**, nie deklaracja.
Dozwolone wyjątki wymagają trzech rzeczy naraz: decyzji founderów w `docs/DECISIONS.md` (dziś: Cloudflare
Web Analytics = D-16, Cal.com embed = D-15 faza 2), wpisu w rejestrze ze statusem `aktywna` oraz sekcji w `/rodo`.
Przy pierwszym embedzie lub skrypcie zewnętrznym do `site/public/_headers` wchodzi CSP z dokładną listą hostów.
Hosty ze statusem `zakazana` w rejestrze (Google Fonts, cdnjs, unpkg, jsDelivr, esm.sh, Tailwind Play,
jQuery CDN, picsum, unsplash) to BLOCKER nawet w komentarzu HTML.

#### Mechanizm awarii (dlaczego)

Każdy zasób z obcego hosta wysyła adres IP i user-agent użytkownika do trzeciej strony przy samym wejściu na
stronę, zanim ktokolwiek kliknie: to przetwarzanie danych wymagające informacji na `/rodo`, a przy cookies
(embedy) także zgody. Skrypt z CDN to zaufanie do cudzego serwera w kontekście naszej domeny (supply chain:
podmiana pliku = wykonanie kodu u każdego odwiedzającego). Render-blocking `<link>` z obcej domeny dokłada
DNS+TLS+RTT do LCP, którego budżet (< 2,5 s mobile 4G, `synthesis.md` §2.4.9) strona już ledwo mieści przez
three.js. Kit `company-ui` zakazuje CDN dla fontów z tego samego powodu: fallback stack + self-hosted woff2
działa offline i deterministycznie. Wyróżnik marki „dane zostają u Ciebie" obowiązuje też na landingu:
CFO sprawdzający Network w DevTools nie może zobaczyć `googleapis`, `gtag` ani `hotjar`.

#### Niepoprawnie

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

#### Poprawnie

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

#### Test

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

#### Wyjątki

Cloudflare Web Analytics (D-16) i Cal.com (D-15) po spełnieniu trzech warunków. Zaraz ładuje się z własnej
domeny (`/cdn-cgi/zaraz/`), ale to nadal integracja z wpisem i `/rodo`. Hosty jako stałe w bundlu
(`react.dev`, namespace'y pdfmake — `bundled-lib-strings`) nie są requestami i nie łamią reguły; potwierdzać
w Network po każdym buildzie.

### 12.2 integ-no-llm-api-in-client-tools

**Zero chmury dostawcy — narzędzia dla klientów i dema nie wołają API modeli językowych ani serwerów Klarow**

Impact: **BLOCKER** · Tagi: integrations, llm, determinism, on-premise, brand-promise, demo · Źródło: decyzja founderów 2026-07-22 (drugi wyróżnik) / strategy §2.5 T4 + §6 D4 („zero chmury dostawcy") / CLAUDE.md #6 (determinizm demo) / synthesis §5.4.9 (integ-no-llm-runtime) / post-bot/worker.js:27 (obietnica w głosie marki) · Dodano: 2026-09-12 · Plik: `rules/integ-no-llm-api-in-client-tools.md`

#### Zasada

Narzędzie dostarczane klientowi (aplikacja on-premise, skrypt, dashboard) oraz każde demo na `klarow.com`
liczy wyłącznie lokalnie i deterministycznie: nie wywołuje `api.anthropic.com`, `api.openai.com`,
`generativelanguage.googleapis.com`, `openrouter.ai`, `api.mistral.ai` ani żadnego serwera Klarow.
Dane klienta trafiają tylko do systemów, które klient sam wskaże (KSeF, jego ERP, jego dysk).
W `site/src/lib/**`, `site/src/components/dashboards/**`, `site/src/components/DemoReport.tsx` i `demo/**`
nie ma `fetch`, `XMLHttpRequest`, `WebSocket`, `EventSource`, `sendBeacon` ani importów pakietów sieciowych.
Anthropic API wolno używać tylko w narzędziach wewnętrznych Klarow (`post-bot/`), gdzie nie ma danych klientów.
Jeśli produkt ma opcjonalnego asystenta AI (Kokpit KSeF), jest to osobny moduł: domyślnie wyłączony,
opt-in klienta, tylko agregaty bez NIP i kwot faktur, z fallbackiem bez AI; na stronie nie opisujemy go
jako części narzędzia (strategy D4).

#### Mechanizm awarii (dlaczego)

To drugi wyróżnik marki obok on-premise: „kalkulator, nie wróżka". Jeden `fetch` do modelu językowego
w silniku obala trzy obietnice naraz: (1) dane wychodzą do chmury dostawcy, którego klient nie wybrał
(art. 28 RODO: nowy procesor bez umowy), (2) wynik przestaje być deterministyczny (dwa przebiegi na tych
samych danych dają różny JSON, więc testy golden z CLAUDE.md #6 padają), (3) narzędzie przestaje działać
offline i po wygaśnięciu klucza. Dla ICP (CFO firmy produkcyjnej, „boi się chmury i halucynacji") to sygnał
dyskwalifikujący, a strategy T4 pokazała, że już opis KSeF z „asystentem AI" kłócił się z hasłem „zero API
do LLM" na tej samej stronie; sprzeczność wychwytywalna w 30 sekund. Dodatkowo klucz API w narzędziu
u klienta to klucz Klarow rozliczany za cudze użycie albo klucz klienta, którym Klarow administruje;
obie opcje są nie do obrony.

#### Niepoprawnie

```ts
// site/src/components/dashboards/CostControl.tsx — „wyjaśnij odchylenie" przez model językowy
async function explainVariance(rows: Row[]) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": import.meta.env.VITE_ANTHROPIC_KEY, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model: "claude-sonnet-5", messages: [{ role: "user", content: JSON.stringify(rows) }] }),
  });
  return (await res.json()).content[0].text; // niedeterministyczne, dane klienta w chmurze, klucz w bundlu
}
```

#### Poprawnie

```ts
// site/src/lib/costControl.ts — reguła jawna, wynik odtwarzalny, zero sieci
export function explainVariance(row: Row): string {
  const delta = row.eac - row.budget;
  if (delta > 0 && row.etc > row.budget * 0.5) return "EAC powyżej budżetu: ETC przekracza połowę budżetu etapu";
  if (delta > 0) return "EAC powyżej budżetu: koszty poniesione wyższe niż plan";
  return "W budżecie";
}
```

```python
# produkt on-premise: asystent AI jako moduł opt-in, agregaty bez identyfikatorów, fallback bez AI
if settings.AI_ASSISTANT_ENABLED and settings.ANTHROPIC_API_KEY:
    summary = ai_summarize(aggregates_without_nip)   # nigdy wiersze faktur
else:
    summary = rule_based_summary(aggregates)         # zawsze dostępne
```

#### Test

```bash
# strona i dema: zero hostów LLM i zero sieci w silnikach
grep -rnE "api\.anthropic\.com|api\.openai\.com|generativelanguage\.googleapis\.com|openrouter\.ai|api\.mistral\.ai|api\.cohere" site/src demo ui-kit
grep -rnE "\b(fetch|XMLHttpRequest|WebSocket|EventSource|sendBeacon)\s*\(" site/src/lib site/src/components/dashboards site/src/components/DemoReport.tsx
grep -rnE "from [\"'](@anthropic-ai/sdk|openai|axios|node-fetch)[\"']" site/src
# skaner: net-call w lib/dashboards = HIGH [integ-no-llm-api-in-client-tools]; host LLM w site/ = poza zakresem (post-bot) = HIGH
node ".claude/skills/klarow-guardian/scripts/find-integrations.mjs" --strict --quiet
# determinizm: dwa przebiegi silnika = identyczny JSON (golden test)
node -e "import('./site/src/lib/report.ts')" 2>/dev/null || echo "użyj check-determinism.mjs / node --test po włączeniu testów"
```

W repozytoriach produktów dla klientów (poza tym repo): `grep -rn "anthropic\|openai" backend/` musi trafiać
wyłącznie w moduł asystenta oznaczony jako opt-in, a `requirements.txt` bez `anthropic` w wariancie bez asystenta.

#### Wyjątki

`post-bot/worker.js` (bot LinkedIn dla founderów): wolno, bo nie przetwarza danych klientów ani leadów
(zasada w prompcie: zero nazw klientów) i działa poza `site/`. Agent Lead-Scout używa modelu w Claude Code
do researchu na danych publicznych, nie w narzędziu klienta. Oba wpisy mają w rejestrze zakres ograniczony
do `post-bot`/`leadscout` (`integ-telegram-anthropic-only-in-bots`).

### 12.3 integ-registry-required

**Nowe połączenie zewnętrzne = wpis w rejestrze integracji PRZED kodem**

Impact: **BLOCKER** · Tagi: integrations, registry, rodo, data-egress, scanner · Źródło: site-audit §4 / synthesis §5.4.9 (integ-registry) / manus §4.1 (find-integrations.mjs) / peer-legal §1.1 (art. 13-14 RODO: odbiorcy danych) · Dodano: 2026-09-12 · Plik: `rules/integ-registry-required.md`

#### Zasada

Każde połączenie repo z aplikacją lub usługą spoza `klarow.com` ma wpis w `references/integrations-registry.md`
w OBU tabelach (główna + „Identyfikatory do skanera") ZANIM powstanie kod. Dotyczy: hostów (`https://…`),
`<script src>`, `<link href>`, `<iframe>`, `url()` w CSS, `fetch`/`WebSocket`/`sendBeacon`, pakietów npm
z dostępem do sieci, zmiennych `process.env.X`/`import.meta.env.X`/`env.X`, linków `mailto:`/`tel:`,
serwerów MCP w `.mcp.json`. Wpis odpowiada na pytania: typ, plik:linia, jakie dane wychodzą i dokąd,
nazwa sekretu i gdzie żyje (nigdy wartość), status, czy potrzebna decyzja founderów, czy potrzebny wpis w `/rodo`.
`node ".claude/skills/klarow-guardian/scripts/find-integrations.mjs" --strict` musi być zielony przed pushem.

#### Mechanizm awarii (dlaczego)

Niezarejestrowane połączenie to nieznany wyciek danych: art. 13-14 RODO wymagają wskazania odbiorców danych
w klauzuli na `/rodo`, a nie da się wskazać odbiorcy, o którym nikt nie wie. Hook marki „dane zostają u klienta,
zero chmury dostawcy" staje się fałszywy przy pierwszym niezauważonym beaconie analityki. CSP w `_headers`
(gdy embed) musi wymieniać dokładne hosty, więc host bez wpisu = zablokowany zasób w produkcji albo dziurawa
polityka. Rejestr jest też jedynym miejscem, z którego strażnik i agenci audytu wiedzą, co jest dozwolone,
a co zakazane (statusy `zakazana` → BLOCKER w skanerze). Bez wpisu „przed kodem" rejestr degeneruje się
do spisu z opóźnieniem, a decyzje founderów (D-15, D-16) są omijane faktem dokonanym.

#### Niepoprawnie

```html
<!-- site/index.html — dopisane „na szybko", bez wpisu w rejestrze, bez /rodo, bez decyzji -->
<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token": "…"}'></script>
```

```ts
// site/src/components/ContactForm.tsx — nowy host i nowa zmienna ENV, rejestr nietknięty
const r = await fetch(`https://api.example-forms.com/v1/submit?key=${import.meta.env.VITE_FORMS_KEY}`, { method: "POST", body });
```

#### Poprawnie

Kolejność: (1) wiersz w tabeli głównej rejestru (`cf-web-analytics`, typ runtime-external, dane: URL/referrer/UA/CWV,
bez cookies, sekret: brak, status: planowana, decyzja: D-16, `/rodo`: TAK), (2) wiersz w tabeli identyfikatorów
(`static.cloudflareinsights.com`), (3) sekcja w `/rodo`, (4) decyzja w `docs/DECISIONS.md`, (5) **zmiana statusu
w rejestrze na `aktywna`** i CSP w `_headers`, (6) dopiero kod:

```html
<!-- site/index.html — po D-16, po publikacji /rodo i po zmianie statusu na aktywna -->
<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token": "…"}'></script>
```

Skaner po komplecie kroków: `INFO script-src static.cloudflareinsights.com → cf-web-analytics`,
`informacyjnie: … NIEZAREJESTROWANE 0`. Kod dopisany PRZED krokami 3-5 daje
`HIGH [integ-embed-requires-privacy]` — status `planowana` albo brak hosta w `site/dist/rodo.html`
i w CSP — czyli bramka pilnuje wszystkich trzech warunków, nie tylko obecności wpisu.

#### Test

```bash
# 1. skan kodu źródłowego. Domyślny zasięg (DEFAULT_PATHS): site/{src,public,index.html,vite.config.ts,
#    scripts,functions,package.json}, ui-kit, post-bot, leadscout, demo, .mcp.json,
#    .claude/{settings.json,agents,workflows} i mcp*.json skilli
node ".claude/skills/klarow-guardian/scripts/find-integrations.mjs" --strict --quiet
# oczekiwane: „Σ BLOCKER 0 · HIGH 0 · …" i w linii niżej „informacyjnie: INFO n · NIEZAREJESTROWANE 0", exit 0
# (MEDIUM/LOW nie przerywają bramki; stan na 2026-09-12 opisuje §5 rejestru)

# 2. po buildzie: także dist (zbundlowane hosty)
node ".claude/skills/klarow-guardian/scripts/find-integrations.mjs" --dist --strict --quiet

# 3. JSONL problemów do audytu (format CONTRACT) + pełny inwentarz
node ".claude/skills/klarow-guardian/scripts/find-integrations.mjs" --json audit/integrations.jsonl --inventory audit/integrations-inventory.json --quiet

# 4. ręcznie: każdy id z tabeli identyfikatorów istnieje w tabeli głównej
grep -oE '^\| `[a-z0-9-]+` \|' ".claude/skills/klarow-guardian/references/integrations-registry.md" | sort | uniq -c | awk '$1 != 2 {print "id bez pary:", $3}'

# 5. bramka naprawdę łapie „wpis jest, ale procedury nie było": snippet z sekcji „Niepoprawnie"
#    w kopii repo → HIGH [integ-embed-requires-privacy] i exit 1 (status `planowana` w rejestrze)
```

Severity: BLOCKER dla HIGH/BLOCKER ze skanera (host/skrypt/pakiet/ENV bez wpisu, zakazany, w statusie
`planowana` albo bez pokrycia w `/rodo`+CSP); MEDIUM/LOW (mailto/tel bez schematu w rejestrze, wzmianka
o usłudze, `fetch(zmienna)` bez hosta w linii) = raport. Auto-fix zabroniony: nowy host to decyzja
founderów, nie poprawka agenta.

#### Wyjątki

Własna domena (`self-klarow`), URL-e przestrzeni nazw (`schema.org`, `sitemaps.org`, `w3.org` — `xml-namespaces`)
i stałe w zbundlowanych bibliotekach (`bundled-lib-strings`) są zarejestrowane raz i nie wymagają decyzji.
Pliki `.md` (README, `leadscout/zrodla.md`) nie są skanowane domyślnie — linki w dokumentacji to nie połączenia
kodu (`--include-md` włącza skan świadomie).

### 12.4 integ-telegram-anthropic-only-in-bots

**Telegram Bot API i Anthropic API wyłącznie w botach wewnętrznych (post-bot/, leadscout/), nigdy w site/**

Impact: **BLOCKER** · Tagi: integrations, telegram, anthropic, scope, secrets, static-site · Źródło: site-audit §4 p.18-20 / post-bot/worker.js:144,199 / leadscout/notify.mjs:39 / synthesis §5.4.9 / CLAUDE.md (Lead-Scout, bot /post) · Dodano: 2026-09-12 · Plik: `rules/integ-telegram-anthropic-only-in-bots.md`

#### Zasada

Połączenia z `api.telegram.org` i `api.anthropic.com` (oraz zmienne `TELEGRAM_BOT_TOKEN`, `ANTHROPIC_API_KEY`,
`WEBHOOK_SECRET`, `ALLOWED_CHAT_ID`) mają w rejestrze zakres ograniczony do katalogów `post-bot/` (Telegram +
Anthropic, Cloudflare Worker) i `leadscout/` (tylko Telegram, `notify.mjs`). W `site/`, `demo/`, `ui-kit/`
i w narzędziach dla klientów nie występują: ani host, ani nazwa zmiennej, ani pakiet SDK. Strona jest statyczna
(Cloudflare Pages, zero backendu, `site-audit.md` §1): każda zmienna `import.meta.env.VITE_*` trafia
do publicznego bundla, więc na stronie po prostu NIE MA gdzie bezpiecznie trzymać tokenu. Jeśli kiedyś strona
ma coś wysyłać (formularz „przyślij najgorszy Excel"), robi to Pages Function (`site/functions/api/*.ts`)
z sekretami w Cloudflare, po wpisie w rejestrze, decyzji founderów i sekcji w `/rodo`.

#### Mechanizm awarii (dlaczego)

Token bota w bundlu strony = każdy odwiedzający może pisać jako `@Klarow_BOT` do founderów (phishing
z zaufanego kanału) i czytać `getUpdates` (treść digestów z leadami). Klucz Anthropic w bundlu = cudze
rachunki na koncie Klarow w ciągu minut (boty skanujące JS na produkcji). Vite wstrzykuje `VITE_*` na etapie
buildu jako literały; `_headers` ani `_redirects` tego nie ukryją, a prerender (`dist/*.html`) utrwala
wartość w 19 plikach. Osobno: Anthropic na stronie łamie „zero chmury dostawcy" (`integ-no-llm-api-in-client-tools`),
a Telegram jako odbiorca danych z formularza wymaga wpisu w `/rodo` (transfer poza EOG). Skaner egzekwuje
to mechanicznie: wpisy `telegram-bot-api`/`anthropic-api` w rejestrze mają zakres `post-bot`/`leadscout`;
wystąpienie w `site/` = HIGH „poza dozwolonym zakresem", a przy `--strict` exit 1. Żeby to była bramka,
a nie deklaracja, `DEFAULT_PATHS` skanera obejmuje **`site/functions` i `ui-kit`** (oba sprawdzone
2026-09-12 na kopii repo: `site/functions/api/leak.ts` z `fetch("https://api.telegram.org/…")` →
HIGH `[integ-telegram-anthropic-only-in-bots]`, `ui-kit/leak.ts` z `api.anthropic.com` → HIGH, exit 1
w domyślnym przebiegu, bez podawania ścieżki).

#### Niepoprawnie

```tsx
// site/src/components/WorstExcelForm.tsx — formularz wysyła plik na Telegram founderów prosto z przeglądarki
const TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;   // ląduje w dist/assets/index-*.js jako literał
await fetch(`https://api.telegram.org/bot${TOKEN}/sendDocument`, { method: "POST", body: form });
```

```ts
// site/src/lib/report.ts — „streszczenie raportu" przez Anthropic w silniku demo
const r = await fetch("https://api.anthropic.com/v1/messages", { headers: { "x-api-key": import.meta.env.VITE_ANTHROPIC } });
```

#### Poprawnie

```js
// post-bot/worker.js:198-204 — Telegram tylko w Workerze, token z sekretu Cloudflare (env), nigdy w bundlu
async function tg(env, method, body) {
  const r = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/${method}`, {
    method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body),
  });
  return r.json();
}
```

```ts
// gdy strona MA przyjmować plik: Pages Function z sekretem w CF (po wpisie w rejestrze + D-xx + /rodo)
// site/functions/api/worst-excel.ts
export const onRequestPost: PagesFunction<{ TELEGRAM_BOT_TOKEN: string; ALLOWED_CHAT_ID: string }> = async ({ request, env }) => {
  const form = await request.formData();                     // walidacja rozmiaru/typu tutaj
  await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendDocument`, { method: "POST", body: form });
  return new Response(null, { status: 204 });
};
```
Front woła `fetch("/api/worst-excel")` (własna domena), nie Telegram.

#### Test

```bash
# zero hostów i nazw sekretów botów poza post-bot/ i leadscout/
grep -rnE "api\.telegram\.org|api\.anthropic\.com|TELEGRAM_BOT_TOKEN|ANTHROPIC_API_KEY|WEBHOOK_SECRET|ALLOWED_CHAT_ID" site demo ui-kit --include=*.ts --include=*.tsx --include=*.js --include=*.mjs --include=*.html --include=*.css
# zero VITE_* o nazwach sekretów (Vite wstrzykuje je do bundla)
grep -rnE "import\.meta\.env\.VITE_[A-Z_]*(TOKEN|KEY|SECRET)" site/src
# skaner: zakresy z rejestru (post-bot / leadscout) — wystąpienie w site/ = HIGH [integ-telegram-anthropic-only-in-bots]
node ".claude/skills/klarow-guardian/scripts/find-integrations.mjs" --strict --quiet
# dist po buildzie: żaden token/host botów
grep -rlE "api\.telegram\.org|api\.anthropic\.com" site/dist && echo "BLOCKER" || echo "OK"
```

#### Wyjątki

Wzmianki w TREŚCI strony (np. opis kompetencji „bot na Telegramie", case bota `/post` w portfolio) to nie
połączenia; skaner klasyfikuje je jako `service-mention` bez sprawdzania zakresu. Pages Function jako
pośrednik jest dozwolona po spełnieniu warunków z zasady (rejestr, decyzja, `/rodo`, sekrety w CF).

### 12.5 integ-data-egress-review

**Przegląd wyjścia danych: co wychodzi, dokąd, na jakiej podstawie — dane klientów nigdy do Higgsfield, Manus, LLM ani MCP**

Impact: **HIGH** · Tagi: integrations, data-egress, privacy, higgsfield, manus, llm, mcp, leads, ip · Źródło: higgsfield §0 p.8, §8 (ToU 2026-07-26: licencja na trening, brak gwarancji IP) / manus §5.3 (jurysdykcja, licencja, replaye sesji) / strategy §2.5 („zero chmury dostawcy") / peer-legal §1.1, §1.4 (RODO art. 14, PKE) / CLAUDE.md #3 (umowa IP) / portfolio §6.2-6.3 · Dodano: 2026-09-12 · Plik: `rules/integ-data-egress-review.md`

#### Zasada

Dla każdego połączenia z rejestru kolumna „dane, które wychodzą" jest wypełniona konkretnie (co, dokąd,
jurysdykcja, podstawa) i aktualna. Niezależnie od narzędzia obowiązuje lista „nigdy na zewnątrz":
dane klientów (pliki, zrzuty dashboardów, liczby, nazwy), dane osób z `leadscout/leads.json` i digestów,
materiały i liczby poprzedniej firmy (do umowy IP), sekrety, twarze i wizerunki, treść korespondencji.
Do narzędzi generatywnych (Higgsfield przez MCP, Manus, dowolny model przez API/MCP) wysyłamy wyłącznie
abstrakcje, własne stille i syntetyczne dane demo. Po sprincie assetów generacje w Higgsfield usuwamy
(kończy licencję na trening). Bot `/post <temat>` nie dostaje nazw klientów ani osób; digest Lead-Scout
na Telegram zawiera firmy i sygnały, nie nazwiska ani adresy e-mail osób. Każdy nowy host w kodzie
(`find-integrations.mjs`) i każda nowa wzmianka o usłudze bez wpisu to sygnał do przeglądu, nie do auto-fixu.

#### Mechanizm awarii (dlaczego)

Higgsfield ToU (26.07.2026): dostawca ma licencję na trening modeli na inputach i outputach do czasu ich
usunięcia, nie gwarantuje oryginalności outputu i przerzuca AUP dostawców modeli (Google/OpenAI/ByteDance);
zrzut narzędzia klienta jako `image_references` to trwałe wydanie cudzego materiału. Manus zapisuje pełne
replaye sesji, ma szeroką, przenoszalną licencję na treści, dane w USA/Singapurze, właściciela z Chin
i incydent kasowania danych (08/2026); jedna wklejka `leads.json` to naruszenie art. 28 RODO (procesor bez
umowy) i art. 14 (odbiorca nieujawniony na `/rodo`). Modele przez API logują wejścia; MCP hostowane widzi
kod i ścieżki. Umowa IP z poprzednią firmą nie jest podpisana (CLAUDE.md #3), więc każdy jej materiał
poza repo to naruszenie do udowodnienia przez trzecią stronę. Precedens Bisnode (943 470 zł, NSA) dotyczył
danych z rejestrów publicznych bez obowiązku informacyjnego: dane leadów w obcym narzędziu bez wpisu
w klauzuli to dokładnie ten scenariusz.

#### Niepoprawnie

```text
# prompt do creative engine (Higgsfield) — zrzut ekranu dashboardu klienta jako referencja stylu
media_upload: C:\Users\…\Kontroling budżetów\zrzut-produkcja-2026-06.png
generate_image: "hero w stylu tego dashboardu, te same liczby i nazwy hal"

# Manus — „przeanalizuj naszych leadów"
załącznik: leadscout/leads.json (32 firmy, osoby kontaktowe, telefony)

# Telegram — /post z danymi osoby
/post Anna Kowalska z firmy X pytała o KSeF, napisz post o tym
```

#### Poprawnie

```text
# Higgsfield przez MCP — tylko abstrakcja, własne stille, paleta z kitu (higgsfield.md §7)
generate_image (nano_banana_pro): "abstract brushed-steel surface, soft directional light, palette #A8B4C2 on #121212,
no text, no people, no UI, 21:9" · image_references: site/public/media/board/steel-01.png (własny still)
po sprincie: reveal/usuń generacje z konta; wpis w site/public/media/SOURCES.md (model, prompt, data, id generacji)

# Lead-Scout digest (leadscout/digesty/…): firma · branża · sygnał · źródło — bez imion i adresów e-mail osób
# /post: temat ogólny — "/post KSeF: kontroling na e-fakturach"
```

Rejestr, kolumna „dane, które wychodzą" dla `telegram-bot-api`: „treść digestu (nazwy firm, sygnały)
→ Telegram Messenger Inc. (poza EOG)"; jeśli kiedykolwiek pojawią się dane osób, `/rodo` dostaje odbiorcę
„Telegram" w sekcji art. 14.

#### Test

```bash
# 1. rejestr: żaden wpis nie ma pustej kolumny „dane, które wychodzą"
awk -F'|' '/^\| `[a-z0-9-]+` \|/ && NF>=10 { d=$6; gsub(/^[ \t]+|[ \t]+$/,"",d); if (d=="" || d=="—") print "pusta kolumna danych:", $2 }' ".claude/skills/klarow-guardian/references/integrations-registry.md"

# 2. digesty i prompty bez adresów e-mail osób, telefonów i NIP-ów
grep -rnE "[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,}|\+?48[ -]?[0-9]{3}[ -]?[0-9]{3}[ -]?[0-9]{3}|\bNIP\b[: ]*[0-9]{10}" leadscout/digesty site/public/media/SOURCES.md 2>/dev/null | grep -v "kontakt@klarow.com"

# 3. materiały poprzedniej firmy poza repo: SOURCES.md i prompty bez nazwy (case-insensitive)
grep -rniE "nuconic" site/public/media leadscout/digesty 2>/dev/null

# 4. nowe hosty/wzmianki = przegląd (LOW/HIGH w skanerze), nie auto-fix
node ".claude/skills/klarow-guardian/scripts/find-integrations.mjs" --quiet

# 5. sekrety w promptach/logach
node ".claude/skills/klarow-guardian/scripts/check-secrets.mjs" leadscout/digesty audit 2>/dev/null
```

Ręcznie przed KAŻDYM `media_upload`/załącznikiem do narzędzia zewnętrznego: (a) czy to własny materiał,
(b) czy nie ma na nim ludzi, UI klienta, liczb, nazw, (c) czy wpis w rejestrze przewiduje ten rodzaj danych.

#### Wyjątki

Dane fikcyjne dem (`site/src/data/demo-sample.ts`, `tools.ts`) są syntetyczne i publiczne: wolno je
wysyłać do narzędzi generatywnych. Publiczne dane firm (nazwa, branża, strona www) z rejestrów wolno
przetwarzać w Lead-Scout i w digestach; dane osób fizycznych (imię, nazwisko, e-mail imienny, telefon)
podlegają tej regule i klauzuli art. 14 na `/rodo`.

### 12.6 integ-dependency-audit

**Nowa zależność npm = uzasadnienie, rozmiar gzip, licencja, sprawdzenie sieci i wpis w rejestrze**

Impact: **HIGH** · Tagi: integrations, dependencies, npm, supply-chain, bundle, license · Źródło: site-audit §1.1, §3.5 (5 nieużywanych zależności) / synthesis §2.4.9 (budżety chunków), §5.4.9 / motion-dev §3.2 (pomiar gzip motion) / vercel.md §9 (bundle) / CLAUDE.md #6 (npx nie działa; npm tak) · Dodano: 2026-09-12 · Plik: `rules/integ-dependency-audit.md`

#### Zasada

Każdy nowy pakiet w `site/package.json` (dependencies i devDependencies) przechodzi przed commitem
pięciopunktową bramkę, a wynik ląduje w opisie commita lub w `plan.md` zadania:
1. **Uzasadnienie**: co robi, czego nie da się zrobić w ≤ 40 liniach własnego kodu lub CSS (np. `Ticker`,
   `AnimateNumber` piszemy sami — motion-dev §7), co zastępuje;
2. **Rozmiar**: gzip po stronie klienta (pomiar, nie deklaracja z README) i mieszczenie się w budżetach
   chunków z `synthesis.md` §2.4.9; nowy chunk lazy, jeśli > 15 KB gz;
3. **Licencja**: MIT / ISC / Apache-2.0 / BSD bez decyzji; GPL / AGPL / SSPL / BUSL / „custom" = decyzja
   founderów (narzędzia trafiają do klientów);
4. **Sieć i telemetria**: pakiet nie wykonuje requestów w runtime (analityka, „phone home", pobieranie
   assetów z CDN) ani `postinstall` z pobieraniem binarek; jeśli wykonuje, to jest integracją z wpisem
   w rejestrze (tabela identyfikatorów, `NETWORK_PACKAGES` w skanerze);
5. **Utrzymanie**: ostatnia publikacja < 18 miesięcy, `npm audit --omit=dev` bez HIGH/CRITICAL, wersja
   przypięta zakresem `^` (nie `*`, nie `latest`).
Wpis w rejestrze: build-time w `npm-build-deps` (lub własny wiersz, gdy pakiet ma sieć) — **każdy** pakiet
z `dependencies` i `devDependencies`, łącznie z `@types/*`, bo test 1 niżej sprawdza komplet. Pakiety
nieużywane usuwamy (dziś: `@react-three/fiber`, `@radix-ui/react-slot`, `class-variance-authority`, `clsx`,
`tailwind-merge` — `code-no-dead-code`); usunięcie z `package.json` i usunięcie z rejestru to JEDEN commit.
Sam rejestr npm (`registry.npmjs.org`) jest integracją build-time z własnym wierszem `npm-registry`:
to stamtąd przychodzi wykonywany u nas kod.

#### Mechanizm awarii (dlaczego)

Zależność to kod wykonywany u każdego odwiedzającego i, w narzędziach, u klienta on-premise; łańcuch
dostaw npm był w latach 2024-2026 wielokrotnie wektorem ataku (podmienione wersje popularnych paczek,
`postinstall` kradnące tokeny z CI). Pakiety analityczne i „SDK" potrafią wysyłać dane bez jawnego `fetch`
w naszym kodzie, co obala „zero chmury dostawcy" niewidocznie dla grepa po `site/src` (skaner łapie tylko
listę znanych pakietów sieciowych, więc bramka ręczna jest konieczna). Bundle 511 KB / 157 KB gz
(`site-audit.md` §1.9) już przekracza budżet; każde 20 KB to realny LCP na 4G. Licencje copyleft w narzędziu
dostarczanym klientowi z kodem źródłowym („kod i dokumentacja zostają u Ciebie") tworzą zobowiązania,
których umowa pilotażowa nie przewiduje. Pięć martwych zależności w `package.json` to dowód, że bez bramki
lista tylko rośnie.

#### Niepoprawnie

```bash
# „na szybko", bez pomiaru, bez sprawdzenia licencji i sieci; pakiet ciągnie telemetrię i 90 KB gz
cd site && npm i some-charts-pro-sdk
```
```json
// site/package.json — pakiet z runtime'owym pobieraniem assetów z CDN i „*" jako wersja
"dependencies": { "fancy-icons-online": "*" }
```

#### Poprawnie

```bash
cd site
npm view motion version license time.modified dist.unpackedSize --json      # licencja MIT, świeża publikacja
npm view motion scripts.postinstall --json                                  # brak postinstall
npm i motion@13.2.0
node -e "import('node:zlib').then(z=>{const fs=require('fs');const b=fs.readFileSync('node_modules/motion/dist/es/react-m.mjs');console.log('gz',z.gzipSync(b).length)})"
npm audit --omit=dev
grep -rn "fetch(\|XMLHttpRequest\|navigator.sendBeacon" node_modules/motion/dist --include=*.mjs -l | head   # 0 plików
```
Commit: `Motion 13.2.0 (MIT, 4,6 KB gz m + LazyMotion; zastępuje ręczne keyframes w 5 komponentach; zero sieci)`.
Rejestr: `motion-lib` → status `aktywna`.

#### Test

```bash
# 1. każdy pakiet z package.json ma wpis w tabeli identyfikatorów rejestru (npm-build-deps lub własny)
node -e '
const fs=require("fs");const p=JSON.parse(fs.readFileSync("site/package.json","utf8"));
const reg=fs.readFileSync(".claude/skills/klarow-guardian/references/integrations-registry.md","utf8");
const all=[...Object.keys(p.dependencies||{}),...Object.keys(p.devDependencies||{})];
const missing=all.filter(n=>!reg.includes("`"+n+"`")); console.log(missing.length?"BRAK W REJESTRZE: "+missing.join(", "):"OK: wszystkie zależności w rejestrze"); process.exit(missing.length?1:0)'
# 2. audyt podatności i licencje (npm działa; npx nie)
cd site && npm audit --omit=dev && npm ls --depth=0
# 3. pakiety sieciowe w bundlu strony
node ".claude/skills/klarow-guardian/scripts/find-integrations.mjs" site/src --strict --quiet
# 4. nieużywane zależności (import nigdzie w src)
node -e '
const fs=require("fs"),path=require("path");const p=JSON.parse(fs.readFileSync("site/package.json","utf8"));
const src=[];(function w(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const f=path.join(d,e.name);e.isDirectory()?w(f):/\.(ts|tsx|css)$/.test(e.name)&&src.push(fs.readFileSync(f,"utf8"))}})("site/src");
const txt=src.join("\n");for(const n of Object.keys(p.dependencies)){if(!txt.includes("\""+n)&&!txt.includes("\x27"+n)&&!txt.includes(n+"/"))console.log("nieużywane:",n)}'
```

#### Wyjątki

devDependencies bez wpływu na bundle i bez sieci (typescript, @types/*, vite, @vitejs/plugin-react,
@tailwindcss/vite) wymagają tylko punktów 3 i 5 — ale wpis w rejestrze (`npm-build-deps`) obowiązuje
je tak samo, bo test 1 czyta CAŁY `package.json`.

**Jawny wyjątek od punktu 4 (zero `postinstall` z pobieraniem binarek): `playwright-core`.** Instalacja
ściąga binarkę WebKita z CDN dostawcy do `~/AppData/Local/ms-playwright/webkit-2311` — to egress
dev-time i pobranie WYKONYWALNEGO kodu z sieci. Wyjątek jest dopuszczony, bo: pakiet nie wchodzi
do `site/package.json` (żyje w scratchpadzie), nie trafia do bundla ani do instalacji u klienta,
a uruchamiamy go tylko na własnym `site/dist` i na `klarow.com`. Warunek: wpis `playwright-webkit`
w rejestrze ma to nazywać wprost w kolumnie „dane, które wychodzą" (przy instalacji: pobranie binarki;
w użyciu: nic). Każdy inny pakiet z `postinstall` pobierającym binarkę = własny wiersz w rejestrze
i decyzja founderów.

### 12.7 integ-embed-requires-privacy

**Embed lub skrypt zewnętrzny (Cal.com, analityka) wymaga sekcji w /rodo, CSP w _headers i decyzji founderów**

Impact: **HIGH** · Tagi: integrations, embed, calcom, analytics, rodo, csp, cookies, consent · Źródło: synthesis §4 D-15 (Cal.com link → embed), D-16 (CF Web Analytics, Zaraz) / synthesis §2.2 („CSP tylko przy embedzie Cal.com") / peer-legal §1.1 (/rodo), §1.4 (PKE: formularze bez domyślnych zgód) / site-audit §7 p.5-6 / docs/plan/domena-serwer-krok-po-kroku.md:102-108,135 · Dodano: 2026-09-12 · Plik: `rules/integ-embed-requires-privacy.md`

#### Zasada

Zanim na `klarow.com` pojawi się `<iframe>`, zewnętrzny `<script>` lub widget (Cal.com embed, Cloudflare
Web Analytics, Zaraz, mapa, wideo z obcej domeny), muszą istnieć jednocześnie:
1. decyzja founderów w `docs/DECISIONS.md` (dziś: D-15 rezerwacja, D-16 pomiar),
2. sekcja w `/rodo` (trasa kanoniczna; `/polityka-prywatnosci` = 301) opisująca usługę jako odbiorcę danych:
   cel, zakres (IP, UA, cookies, dane z formularza), transfer poza EOG, podstawa prawna,
3. `Content-Security-Policy` w `site/public/_headers` z dokładnymi hostami (`frame-src`, `script-src`, `connect-src`),
4. wpis w rejestrze ze statusem `aktywna` i wypełnioną kolumną „dane, które wychodzą",
5. jeśli embed zapisuje cookies nieniezbędne: ładowanie dopiero po akcji użytkownika (click-to-load) albo zgoda;
   formularze bez domyślnie zaznaczonych zgód marketingowych (PKE art. 398, peer-legal §1.4).
Faza 1 (decyzja D-15 a): Cal.com jako zwykły LINK zewnętrzny, 0 skryptów, więc `/rodo` opisuje Cal.com
jako usługę, na którą użytkownik przechodzi, a CSP nie jest jeszcze wymagane.

Bramka mechaniczna (`find-integrations.mjs`) egzekwuje to w dwóch miejscach:
- **status `planowana` w rejestrze** = decyzja (1) jeszcze nie zapadła. Każde użycie takiego wpisu
  w kodzie (url, `<script src>`, `<link>`, `<iframe>`, `url()` w CSS, pakiet, ENV, `fetch`) → **HIGH**
  z tym ID reguły. Kolejność jest więc wymuszona: decyzja → `/rodo` → CSP → status `aktywna` → kod.
  Wyjątek: pliki przykładowe (`*.example.json`) niczego nie ładują → INFO.
- **wpis z „wpis w /rodo? = TAK"**, którego host nie występuje w `site/dist/rodo.html` (warunek 2)
  ani w `Content-Security-Policy` w `site/public/_headers` (warunek 3) → **HIGH**. Gdy `dist` nie jest
  zbudowany, dowodu nie da się sprawdzić → MEDIUM z jawnym „zbuduj stronę" (nigdy ciche PASS).

#### Mechanizm awarii (dlaczego)

Iframe z `app.cal.com` ładuje się przy otwarciu modala: Cal.com dostaje IP, UA, referrer i zapisuje własne
cookies w kontekście third-party jeszcze zanim użytkownik cokolwiek zarezerwuje; bez informacji na `/rodo`
to naruszenie art. 13 RODO, a cookies nieniezbędne bez zgody to art. 173 Prawa telekomunikacyjnego / PKE.
Cloudflare Web Analytics jest cookieless i nie potrzebuje banera, ale nadal jest odbiorcą danych
technicznych (wpis w `/rodo`). Bez CSP embed może ładować dowolne dalsze zasoby (fonty, trackery Cal.com)
niewidoczne w naszym rejestrze; CSP z listą hostów to jedyna mechaniczna gwarancja, że „zero skryptów
zewnętrznych poza zarejestrowanymi" jest prawdą, a nie deklaracją. Strona bez `/rodo` blokuje też cały
outbound (art. 14: klauzula przy pierwszym kontakcie; precedens Bisnode), więc kolejność „najpierw `/rodo`,
potem analityka i embedy" wynika z prawa, nie z estetyki.

#### Niepoprawnie

```tsx
// site/src/components/BookingDialog.tsx — embed od razu w modalu, bez /rodo, bez CSP, bez decyzji
export function BookingDialog() {
  return (
    <dialog open>
      <iframe src="https://app.cal.com/klarow/diagnoza?embed=true" width="100%" height="700" />
    </dialog>
  );
}
```

#### Poprawnie

Faza 1 (D-15 a) — link zewnętrzny, zero skryptów; `/rodo` wspomina Cal.com jako usługę zewnętrzną:
```tsx
<a className="btn btn-primary" href="https://cal.com/klarow/diagnoza" target="_blank" rel="noopener noreferrer">
  {pick(t.bookCta, lang)} {/* PL: „Umów 30 minut" / EN: „Book 30 minutes" */}
</a>
```

Faza 2 (D-15 b) — click-to-load, po `/rodo` i CSP:
```tsx
const [loadCal, setLoadCal] = useState(false);
{!loadCal ? (
  <button className="btn btn-primary" onClick={() => setLoadCal(true)}>{pick(t.loadCalendar, lang)}</button>
) : (
  <iframe title="Cal.com" src="https://app.cal.com/klarow/diagnoza?embed=true" loading="lazy" />
)}
```
```text
# site/public/_headers (faza 2)
/*
  Content-Security-Policy: default-src 'self'; script-src 'self' https://app.cal.com https://static.cloudflareinsights.com; frame-src https://app.cal.com; connect-src 'self' https://app.cal.com https://cloudflareinsights.com; img-src 'self' data: https://app.cal.com; style-src 'self' 'unsafe-inline'; font-src 'self'; object-src 'none'; base-uri 'self'
```
`/rodo` (sekcja „Odbiorcy danych"): Cal.com, Inc. (USA) — rezerwacja terminu: imię, e-mail, wybrany termin,
IP/UA i cookies przy załadowaniu kalendarza; podstawa art. 6 ust. 1 lit. b RODO; transfer: SCC.

#### Test

```bash
# 1. czy w kodzie/dist jest iframe albo zewnętrzny skrypt?
grep -rnE "<iframe|<script[^>]+src=[\"'](https?:)?//" site/src site/index.html site/dist 2>/dev/null | grep -v "klarow.com"
# 2. jeśli TAK: CSP obecne i wymienia host embedu
grep -n "Content-Security-Policy" site/public/_headers && grep -nE "frame-src[^;]*app\.cal\.com" site/public/_headers
# 3. jeśli TAK: /rodo (prerender) wymienia usługę jako odbiorcę
grep -ciE "cal\.com" site/dist/rodo.html
grep -ciE "cloudflare" site/dist/rodo.html
# 4. decyzja zapisana
grep -nE "D-15|D-16" docs/DECISIONS.md
# 5. rejestr: status aktywna dla calcom / cf-web-analytics dopiero po 1-4.
#    Skaner sam to sprawdza: `planowana` + kod = HIGH; „/rodo = TAK" bez hosta w dist/rodo.html i w CSP = HIGH
node ".claude/skills/klarow-guardian/scripts/find-integrations.mjs" --dist --strict --quiet
# oczekiwane komunikaty, gdy ktoś wyprzedzi procedurę (dosłownie, zweryfikowane 2026-09-12 na kopii repo):
#   site/index.html:3 - HIGH [integ-embed-requires-privacy] … wpis istnieje (cf-web-analytics),
#     ale status `planowana`: brak decyzji founderów / sekcji w /rodo / CSP …
#   site/index.html:3 - HIGH [integ-embed-requires-privacy] … (cf-web-analytics, „wpis w /rodo? = TAK")
#     — host nie występuje w site/dist/rodo.html …; host nie występuje w Content-Security-Policy …
# 6. formularze bez domyślnych zgód (PKE)
grep -rnE "type=\"checkbox\"[^>]*(checked|defaultChecked)" site/src
```

#### Wyjątki

Linki wychodzące (`<a href="https://cal.com/…">`, LinkedIn founderów) nie ładują niczego na naszej stronie:
wpis w rejestrze i wzmianka w `/rodo` (Cal.com jako usługa docelowa), bez CSP i bez zgód. Osadzenie
własnych zasobów (`site/public/media/*.webm`, poster) nie jest embedem zewnętrznym.

### 12.8 integ-mcp-allowlist

**Serwery MCP tylko z allowlisty — hostowany MCP to integracja z wpisem i decyzją**

Impact: **HIGH** · Tagi: integrations, mcp, claude-code, supply-chain, data-egress · Źródło: motion-dev §6.1-6.2, §11 p.5 (Motion MCP hostowane, .mcp.json) / higgsfield §1 (MCP creative engine, Cloud API niepotrzebne) / manus §2.5, §4.1 („mask, don't remove", allowlisty zamiast dynamicznych narzędzi) / synthesis §5.4.9 · Dodano: 2026-09-12 · Plik: `rules/integ-mcp-allowlist.md`

#### Zasada

Plik `.mcp.json` w korzeniu repo (wersjonowany, wspólny dla obu founderów) może zawierać wyłącznie serwery
z allowlisty rejestru (`references/integrations-registry.md`, typ `MCP`):

| id | serwer | forma | warunek |
|---|---|---|---|
| `motion-mcp` | `https://mcp.motion.dev` (free: dokumentacja, przykłady) | hostowany, bez tokenu | opcjonalny; wpis `status: aktywna` po decyzji founderów (motion-dev §11 p.5) |
| `motion-mcp` | `https://mcp.motion.dev/plus` (Motion+: MotionScore, edytor) | hostowany, login z ustawień MCP agenta | dopiero po zakupie Motion+ i rozstrzygnięciu licencji dla 2 founderów |
| `higgsfield-mcp` | creative engine (Higgsfield) | connector claude.ai (OAuth), NIE w `.mcp.json` | plan wg D-08; zasady danych z `integ-data-egress-review` |

Każdy inny serwer (własny, z npm, z „mcpmarket", z linku od znajomego) = nowa integracja: wpis w obu tabelach
rejestru + decyzja founderów PRZED dodaniem. Zakazane w `.mcp.json`: literalne klucze/tokeny w `env`
(tylko odwołania do zmiennych środowiskowych), serwery uruchamiane przez `npx` (nie działa w repo przez `&`
w ścieżce; instalacja globalna to decyzja), serwery bez nazwy dostawcy i adresu w dokumentacji.
Higgsfield Cloud API (`api.higgsfield.ai`, klucze `KEY_ID:KEY_SECRET`) ma status `zakazana`: MCP wystarcza,
API jest rozliczane osobno i wymaga sekretów w repo lub środowisku.

#### Mechanizm awarii (dlaczego)

Serwer MCP widzi wszystko, co agent mu wyśle: fragmenty kodu, ścieżki, nazwy klientów w danych, treść
promptów; hostowany serwer to więc wyjście danych poza maszynę foundera, identyczne w skutkach z API
zewnętrznym, tylko mniej widoczne (nie ma `fetch` w kodzie, jest wpis w JSON). Opisy narzędzi MCP trafiają
do kontekstu modelu i mogą zawierać instrukcje (prompt injection przez opis narzędzia), a serwer z npm
wykonuje kod na komputerze z dostępem do repo, `.env` i Menedżera poświadczeń. Manus dowodzi, że stabilna,
mała lista narzędzi (allowlista + maskowanie) działa lepiej niż dodawanie serwerów „na zadanie": mniej
definicji w kontekście, lepszy cache, mniej halucynacji schematów. Wersjonowany `.mcp.json` obowiązuje
oba konta founderów, więc jedno kliknięcie „dodaj MCP" zmienia politykę danych całej firmy.

#### Niepoprawnie

```json
{
  "mcpServers": {
    "ai-tools-from-marketplace": {
      "command": "npx",
      "args": ["-y", "@someone/mcp-everything"],
      "env": { "OPENAI_API_KEY": "sk-…", "TELEGRAM_BOT_TOKEN": "…" }
    },
    "Higgsfield Cloud": { "url": "https://api.higgsfield.ai/mcp", "headers": { "Authorization": "Key …:…" } }
  }
}
```

#### Poprawnie

```json
{
  "mcpServers": {
    "Motion": { "url": "https://mcp.motion.dev" }
  }
}
```
Warunek: w rejestrze `motion-mcp` ma status `aktywna` (dziś `planowana`), a decyzja jest w `docs/DECISIONS.md`.
Motion+ dopisujemy osobno po zakupie: `"Motion+": { "url": "https://mcp.motion.dev/plus" }` — login przez
ustawienia MCP agenta, zero tokenów w pliku. Higgsfield pozostaje connectorem claude.ai (poza `.mcp.json`).

#### Test

```bash
# 1. .mcp.json (jeśli istnieje) zawiera tylko hosty z allowlisty i zero literalnych sekretów
node -e '
const fs=require("fs"); if(!fs.existsSync(".mcp.json")){console.log("brak .mcp.json — OK");process.exit(0)}
const allow=["mcp.motion.dev"]; const cfg=JSON.parse(fs.readFileSync(".mcp.json","utf8")); let bad=0;
for(const [name,s] of Object.entries(cfg.mcpServers||{})){
  const host=(s.url||"").replace(/^https?:\/\//,"").split("/")[0];
  if(s.command){console.log("BLOCK stdio/npx:",name);bad++}
  if(host&&!allow.includes(host)){console.log("HIGH host poza allowlistą:",name,host);bad++}
  for(const v of Object.values(s.env||{})) if(/^[A-Za-z0-9_-]{16,}$/.test(v)||/^sk-/.test(v)){console.log("BLOCK literalny sekret w env:",name);bad++}
}
process.exit(bad?1:0)'

# 2. skaner traktuje .mcp.json i skille mcp*.json jak kod (hosty vs rejestr)
node ".claude/skills/klarow-guardian/scripts/find-integrations.mjs" .mcp.json ".claude/skills/*/mcp*.json" --strict --quiet

# 3. sekrety w .mcp.json
node ".claude/skills/klarow-guardian/scripts/check-secrets.mjs" .mcp.json
```

#### Wyjątki

Konfiguracja MCP w profilu użytkownika (`~/.claude.json`) jest prywatna i poza repo, ale hostowane serwery
tam dodane też przetwarzają dane z sesji w tym repo: stosować tę samą allowlistę. Serwery MCP wbudowane
w claude.ai (Gmail, Drive, creative engine) nie są w `.mcp.json`; dla nich obowiązuje `integ-data-egress-review`
(co wolno wysłać), nie ta reguła.

## 13. Sekrety: `.env`, klucze, tokeny, prompty do narzędzi zewnętrznych (`secret`)

Domyślny impact: **BLOCKER** · tryb: both · właściciel audytu: `brand-leak-auditor` + `integration-scanner`

### 13.1 secret-git-history-scan-before-public

**Przed upublicznieniem repo, forkiem lub udostępnieniem kodu osobie trzeciej — skan całej historii gita pod kątem sekretów i danych**

Impact: **BLOCKER** · Tagi: secrets, git, history, public-repo, github, filter-repo · Źródło: portfolio §6.3 („git log -p | grep -E '(KEY|TOKEN|SECRET)=' w każdym repo z remote"), §8 p.13 (czy repo jest publiczne) / synthesis §6 (luka: publiczność repo) / CLAUDE.md #3 (Nuconic w docs/) / leadscout/README.md (leads.json w repo) · Dodano: 2026-09-12 · Plik: `rules/secret-git-history-scan-before-public.md`

#### Zasada

Zanim repo (lub jego fork, archiwum, zrzut kodu, dostęp dla podwykonawcy/radcy/klienta) opuści krąg
founderów, obowiązuje skan CAŁEJ historii, nie tylko HEAD:
1. `node ".claude/skills/klarow-guardian/scripts/check-secrets.mjs" --history` → Σ BLOCKER 0
   (wzorce kluczy w dodanych liniach wszystkich commitów na wszystkich gałęziach + zabronione pliki);
2. ręczny grep: `git log -p --all | grep -nE '(KEY|TOKEN|SECRET|PASSWORD|PASSWD)\s*[:=]\s*\S{8,}'` → 0 trafień poza szablonami;
3. przegląd DANYCH, których skaner wzorcami nie złapie: `leadscout/leads.json` (dane firm i osób),
   `leadscout/digesty/`, `docs/nuconic-ekosystem-referencja.md` i każdy plik z nazwą/liczbami poprzedniej
   firmy (CLAUDE.md #3: zakaz publikacji do umowy IP) — dopóki są w historii, repo MUSI pozostać prywatne;
4. jeśli cokolwiek znaleziono: najpierw rotacja (`secret-rotate-on-exposure`), potem czyszczenie historii
   `git filter-repo` (nie `filter-branch`), force push, re-clone u drugiego foundera, zgłoszenie do GitHub
   Support o usunięcie cache'owanych widoków; publikacja dopiero po ponownym skanie.
Stan 2026-09-12: repo `przeczkowskyy/Pawel_Karol_proj` zawiera `leads.json` i referencję poprzedniej firmy,
więc do decyzji founderów traktujemy je jako PRYWATNE; upublicznienie wymaga wcześniejszego wydzielenia
tych plików do osobnego prywatnego repo albo ich usunięcia z historii.

**Dane osobowe w gicie: powód mocniejszy niż higiena sekretów.** Historia gita jest niekasowalna bez
przepisania wszystkich commitów, więc każdy plik śledzony przez gita czyni NIEUSUWALNYMI dane, które
art. 17 RODO (prawo do usunięcia) i art. 21 (sprzeciw) każą usunąć na żądanie osoby. Dlatego dane
osobowe nie wchodzą do repo w ogóle, a nie „wchodzą i sprzątamy je później". Obowiązujący podział klas
danych (ustalony z oknem researchu c1, 2026-09-12): `leadscout/leads.json` wyłącznie dane PODMIOTÓW
(nazwa, `www`, NIP/REGON/KRS, PKD, forma prawna, adres siedziby spółki, sygnały, oceny, właścicielstwo
jako ścieżka spółek); nazwiska, role, LinkedIn i adresy osób fizycznych wyłącznie w
`leadscout/decydenci.local.json` POZA gitem (`.gitignore`); rejestr sprzeciwów `suppression.json`
w gicie, ale klucze WYŁĄCZNIE jako SHA-256 (sprzeciw musi przetrwać jako dowód dla UKE, hasz spełnia
zasadę minimalizacji); `kontakt_historia` bez treści wiadomości i bez nazwisk, tylko
`{data, kanal, szablon, wynik}`. Skrzynka funkcyjna (`rodo@`, `biuro@`, `kontakt@`) formalnie nie jest
daną osobową, ale w repo i tak jest zbędna.

#### Mechanizm awarii (dlaczego)

Historia gita jest kompletna: `git rm` i nowy commit nie usuwają starych blobów, a każdy klon pobiera
wszystko. Publiczne repo GitHuba jest skanowane przez boty w minutach od pushu (tokeny) i indeksowane przez
wyszukiwarki (nazwy firm, osób, liczby klienta). Dane osób z leadów w publicznym repo to naruszenie RODO
z obowiązkiem zgłoszenia do UODO w 72 h; nazwa i liczby poprzedniej firmy w publicznym repo to złamanie
CLAUDE.md #3 przed umową IP, z ryzykiem roszczeń. GitHub zachowuje osierocone commity dostępne po SHA
także po force pushu, dopóki support ich nie usunie; dlatego rotacja zawsze poprzedza czyszczenie
i nigdy go nie zastępuje. Sam HEAD może być czysty przy brudnej historii — stąd `--history`, a nie `--all`.

#### Niepoprawnie

```bash
# „HEAD jest czysty, więc można upublicznić"
git rm --cached leadscout/.env && git commit -m "bez .env" && gh repo edit --visibility public
# przepisanie historii bez rotacji
git filter-branch --index-filter 'git rm --cached --ignore-unmatch leadscout/.env' HEAD && git push --force
```

#### Poprawnie

```bash
# 1. skan historii i drzewa
node ".claude/skills/klarow-guardian/scripts/check-secrets.mjs" --history --quiet     # Σ BLOCKER 0
node ".claude/skills/klarow-guardian/scripts/check-secrets.mjs" --all --dist --quiet  # Σ BLOCKER 0
git log -p --all --no-color | grep -nE '(KEY|TOKEN|SECRET|PASSWORD)\s*[:=]\s*[A-Za-z0-9_:/+.-]{12,}' | grep -viE 'example|placeholder|<|…' || echo "0 trafień"
# 2. dane, których nie łapią wzorce
git log --all --name-only --format= | sort -u | grep -E 'leads\.json|digesty/|nuconic' && echo "PRYWATNE: dane w historii"
# 3. gdy trzeba czyścić (po rotacji!): git filter-repo (instalacja: pip install git-filter-repo)
git filter-repo --invert-paths --path leadscout/leads.json --path leadscout/digesty --path docs/nuconic-ekosystem-referencja.md
git push --force --all && git push --force --tags
# 4. drugi founder: świeży klon; GitHub Support: prośba o usunięcie osieroconych commitów; ponowny skan
```

#### Test

```bash
S=".claude/skills/klarow-guardian/scripts/check-secrets.mjs"
node "$S" --history --quiet; echo "exit=$?"                                    # oczekiwane: Σ BLOCKER 0, exit 0
git log --all --diff-filter=A --name-only --format= | grep -E '(^|/)\.env$|\.chat_id$|\.pem$|credentials' && echo "BLOCKER: plik sekretów kiedykolwiek dodany" || echo OK
git log --all --name-only --format= | sort -u | grep -ciE 'leads\.json|nuconic'   # >0 → repo musi zostać prywatne
gh repo view --json visibility -q .visibility 2>/dev/null || echo "sprawdź widoczność repo w ustawieniach GitHub"
```

#### Wyjątki

Repozytoria dostarczane klientowi (kod narzędzia „zostaje u Ciebie") powstają jako NOWE repo z czystą
historią (kopia plików, `git init`), nigdy jako fork repo firmowego; wtedy skan dotyczy tylko nowego drzewa.
`leadscout/.env.example` z pustą wartością jest dozwolony w historii.

### 13.2 secret-never-read-env

**Agent nigdy nie czyta, nie cytuje i nie edytuje plików z sekretami (.env, credentials, klucze, .chat_id) — hook odmawia z powodem**

Impact: **BLOCKER** · Tagi: secrets, env, hooks, claude-code, credentials · Źródło: CLAUDE.md 2026-07-27 (żywy klucz Anthropic w .env appki KSeF) / manus §4.1 („mask, don't remove": PreToolUse deny z powodem), §5.3 p.4 / synthesis §5.4.10 (secret-never-read), §5.8.3 (block-secrets) / portfolio §0 („czego celowo nie otworzyłem") · Dodano: 2026-09-12 · Plik: `rules/secret-never-read-env.md`

#### Zasada

Żaden agent (sesja główna, subagent, skill, workflow) nie otwiera, nie wypisuje, nie grepuje po treści
i nie edytuje plików: `.env` i `.env.*` (poza `.env.example`/`.sample`/`.template`), `.dev.vars`,
`.chat_id`, `credentials*`, `*.pem`, `*.p12`, `*.pfx`, `*.key`, `*.keystore`, `id_rsa*`, `Klucze*.txt`,
`RAILWAY-VARS*`, `PROMO_CODES*`, `secrets.json`, `service-account*.json`. Dotyczy to też komend
(`cat`, `type`, `Get-Content`, `grep -r TOKEN .`, `printenv`, `git add .env`). Gdy agent potrzebuje NAZWY
zmiennej, czyta `.env.example`, README lub rejestr integracji; wartość ustawia founder ręcznie.

Mechanicznie egzekwuje to **jeden** hook `PreToolUse`: `scripts/hook-pre-tool.mjs`, zarejestrowany przez
skopiowanie gotowego `hooks.settings.example.json` do `.claude/settings.json` (patrz „Poprawnie"). Odmawia
z uzasadnieniem — model dostaje powód i uczy się w tej samej sesji, narzędzie nie znika. Drugi skrypt,
`check-secrets.mjs --claude-hook`, to **wariant zapasowy i zarazem test logiki** (ta sama lista plików,
odpowiedź w formacie `permissionDecision`), a nie druga równoległa rejestracja: w `.claude/settings.json`
ma być zarejestrowany dokładnie JEDEN z nich. Dopóki `.claude/settings.json` nie istnieje na maszynie
foundera, reguła jest wyłącznie instrukcją — dokumentacja Claude Code mówi wprost, że CLAUDE.md
„is not a hard enforcement layer". Instalacja hooka to pierwszy krok konfiguracji repo, nie opcja.
`leadscout/leads.json` NIE jest plikiem sekretów (skill `/lead-scout` musi go czytać i dopisywać), ale jego
treść podlega `secret-no-secrets-in-prompts-or-logs` (nie cytować danych osób w raportach, nie wysyłać na zewnątrz).

#### Mechanizm awarii (dlaczego)

Wszystko, co narzędzie `Read`/`Bash` zwróci, staje się częścią kontekstu modelu: transkryptu sesji,
wyników subagentów przekazywanych orkiestratorowi, artefaktów publikowanych pod URL, logów audytu
w `audit/`, a po stronie API Anthropic danych żądania. Sekret w kontekście przestaje być sekretem, choć
plik nadal leży „bezpiecznie" poza gitem. Jeden taki przypadek już się zdarzył (klucz Anthropic w `.env`
appki KSeF, do rotacji). Instrukcja w CLAUDE.md nie jest warstwą egzekwującą (docs Claude Code: „not a hard
enforcement layer"), dlatego potrzebny jest hook: deny z powodem zamiast liczenia na pamięć modelu.
Wzorzec Manus „mask, don't remove": stała lista narzędzi + odmowa z wyjaśnieniem daje lepsze zachowanie
niż usuwanie narzędzia `Read` z sesji.

#### Niepoprawnie

```text
Read  leadscout/.env
Bash  cat leadscout/.env | grep TOKEN
Bash  grep -rn "TELEGRAM_BOT_TOKEN=" .          # wypisze wartość, jeśli jest w .env
Bash  rg TELEGRAM_BOT_TOKEN .                   # to samo: rg/ripgrep/findstr/awk/sed po korzeniu repo
PS    Select-String -Path . -Pattern ANTHROPIC_API_KEY -Recurse
Grep  pattern="sk-ant-" path="C:/Users/bibac/OneDrive/KSeF app/.env"
Edit  leadscout/.env  (wpisanie tokenu, który agent „dostał w wiadomości")
```
Rekurencyjne szukanie po korzeniu repo jest zakazane, bo wypisuje DOPASOWANE LINIE: wartość z `.env`
ląduje w transkrypcie, a to ekspozycja wymagająca rotacji (`secret-rotate-on-exposure`).

#### Poprawnie

```text
Read  leadscout/.env.example                       # tylko nazwa zmiennej
Bash  node leadscout/notify.mjs --test             # skrypt sam czyta .env, agent widzi tylko wynik wysyłki
Bash  git check-ignore -q leadscout/.env && echo "ignorowany"
Bash  wrangler secret list                         # nazwy sekretów Workera, bez wartości
Bash  grep -rn "TELEGRAM_BOT_TOKEN" site demo ui-kit   # szukanie NAZWY w katalogach bez sekretów — wolno
```
Gdy trzeba ustawić sekret: agent pisze instrukcję dla foundera („wklej token do `leadscout/.env`
jako `TELEGRAM_BOT_TOKEN=`" / „`wrangler secret put ANTHROPIC_API_KEY`") i NIE prosi o wartość na czacie.

Instalacja hooka (jednorazowo, na każdej maszynie foundera). Źródłem prawdy jest
`.claude/skills/klarow-guardian/hooks.settings.example.json` — plik wersjonowany, zero sekretów,
ścieżki przez `$CLAUDE_PROJECT_DIR` (działa mimo spacji i `&` w ścieżce repo). `.claude/settings.json`
to jego kopia; jeśli w repo go nie ma, hook NIE działa i nikt nie jest blokowany:
```bash
# instalacja (Bash) — nie nadpisuj, jeśli plik już istnieje: scal ręcznie
cp ".claude/skills/klarow-guardian/hooks.settings.example.json" ".claude/settings.json"
# PowerShell
Copy-Item ".claude/skills/klarow-guardian/hooks.settings.example.json" ".claude/settings.json"
```
Rejestruje `PreToolUse` → `scripts/hook-pre-tool.mjs` (ten sam zakaz plików sekretów co
`check-secrets.mjs`, dodatkowo bramka marki: `nuconic`, `#FFA914`) z matcherem
`Read|Edit|Write|MultiEdit|Bash|PowerShell|Grep|Glob` oraz `PostToolUse` → `hook-post-edit.mjs`.
Matcher ma wymieniać KAŻDE narzędzie, które potrafi dotknąć pliku sekretów — w tym środowisku
`PowerShell` jest powłoką podstawową, a `Grep`/`Glob` czytają ścieżki; jeśli w sesji dostępny jest
`NotebookEdit` (hook sprawdza `notebook_path`), dopisz go do matchera w pliku przykładowym,
a nie tylko w tej regule — obie listy mają być identyczne.

#### Test

```bash
S=".claude/skills/klarow-guardian/scripts/check-secrets.mjs"
# deny dla .env, także wieloczłonowego (standard Vite: .env.production.local)
echo '{"tool_name":"Read","tool_input":{"file_path":"leadscout/.env"}}' | node "$S" --claude-hook | grep -q '"deny"' && echo OK-deny
echo '{"tool_name":"Read","tool_input":{"file_path":"site/.env.production.local"}}' | node "$S" --claude-hook | grep -q '"deny"' && echo OK-deny
# deny dla komendy czytającej .env
echo '{"tool_name":"Bash","tool_input":{"command":"cat leadscout/.env"}}' | node "$S" --claude-hook | grep -q '"deny"' && echo OK-deny
# deny dla szukania wartości sekretu po całym repo (grep/rg/Select-String/findstr)
echo '{"tool_name":"Bash","tool_input":{"command":"grep -rn TELEGRAM_BOT_TOKEN ."}}' | node "$S" --claude-hook | grep -q '"deny"' && echo OK-deny
echo '{"tool_name":"PowerShell","tool_input":{"command":"Select-String -Path . -Pattern ANTHROPIC_API_KEY -Recurse"}}' | node "$S" --claude-hook | grep -q '"deny"' && echo OK-deny
# allow dla szablonów (.example/.sample/.template, także .env.production.example), zwykłego pliku
# i ZAWĘŻONEGO szukania nazwy (to dokumentowany test integ-telegram-anthropic-only-in-bots)
echo '{"tool_name":"Read","tool_input":{"file_path":"leadscout/.env.example"}}' | node "$S" --claude-hook | grep -q '"allow"' && echo OK-allow
echo '{"tool_name":"Read","tool_input":{"file_path":"leadscout/.env.sample"}}' | node "$S" --claude-hook | grep -q '"allow"' && echo OK-allow
echo '{"tool_name":"Read","tool_input":{"file_path":"site/src/App.tsx"}}' | node "$S" --claude-hook | grep -q '"allow"' && echo OK-allow
echo '{"tool_name":"Bash","tool_input":{"command":"grep -rn TELEGRAM_BOT_TOKEN site demo ui-kit"}}' | node "$S" --claude-hook | grep -q '"allow"' && echo OK-allow
# deny dla klucza prywatnego i credentials
echo '{"tool_name":"Read","tool_input":{"file_path":"C:/x/credentials.json"}}' | node "$S" --claude-hook | grep -q '"deny"' && echo OK-deny

# hook KANONICZNY: przykład w repo rejestruje hook-pre-tool.mjs i wymienia PowerShell w matcherze
grep -n "hook-pre-tool.mjs" ".claude/skills/klarow-guardian/hooks.settings.example.json"
grep -n '"matcher"' ".claude/skills/klarow-guardian/hooks.settings.example.json" | grep -q "PowerShell" && echo OK-matcher
# czy zainstalowany u foundera (brak pliku = brak egzekucji, tylko instrukcja)
test -f .claude/settings.json && grep -n "hook-pre-tool.mjs\|check-secrets.mjs" .claude/settings.json || echo "UWAGA: .claude/settings.json nie istnieje — hook NIE jest zainstalowany"
# ta sama lista narzędzi w regule i w pliku przykładowym (zero rozjazdu)
diff <(grep -oE '"matcher": "[^"]+"' ".claude/skills/klarow-guardian/hooks.settings.example.json" | head -1 | grep -oE 'Read[^"]+') \
     <(grep -oE '`Read\|[^`]+`' ".claude/skills/klarow-guardian/rules/secret-never-read-env.md" | head -1 | tr -d '`') && echo OK-sync
```

#### Wyjątki

Pliki `.env.example` / `.env.sample` / `.env.template` (także wieloczłonowe: `.env.production.example`,
szablony z samymi nazwami zmiennych) wolno czytać i edytować — oba hooki muszą odpowiadać tu `allow`.
Szukanie NAZWY zmiennej w katalogach, w których sekretów nie ma (`grep -rn TELEGRAM_BOT_TOKEN site demo ui-kit`),
jest dozwolone i jest testem `integ-telegram-anthropic-only-in-bots`; zakaz dotyczy przeszukiwania
korzenia repo (`.`, `/`, `~`) i wzorców łapiących WARTOŚĆ (`NAZWA=`).
Skrypty projektu (`leadscout/notify.mjs`) czytają `.env` programowo; agent uruchamia skrypt, nie plik.
Founder może wkleić wartość sekretu do pliku ręcznie poza sesją; jeśli wklei ją na czat, obowiązuje
`secret-rotate-on-exposure` (wartość w transkrypcie = ekspozycja).

### 13.3 secret-no-secrets-in-prompts-or-logs

**Zero sekretów i danych osób w promptach, wiadomościach między agentami, logach, raportach audytu i artefaktach**

Impact: **BLOCKER** · Tagi: secrets, prompts, logs, audit, mcp, higgsfield, manus, leads, telegram · Źródło: manus §5.3 p.4-5 (sekrety i materiały w promptach; replaye sesji) / higgsfield §8 (licencja na trening na inputach) / synthesis §5.4.10 (secret-prompts), §5.5 (raporty audytu w audit/) / post-bot/worker.js:43 (zasada: zero nazw klientów w postach) / peer-legal §1.1 · Dodano: 2026-09-12 · Plik: `rules/secret-no-secrets-in-prompts-or-logs.md`

#### Zasada

Wartości sekretów, `chat_id`, dane osób z leadów (`leadscout/leads.json`, digesty), dane klientów
i treść korespondencji nie trafiają do: promptów dla modeli (Claude w sesji, MCP: creative engine, Motion+;
Manus), wiadomości `SendMessage` między agentami, wyników subagentów, artefaktów (`Artifact`), raportów
audytu (`audit/*.md`, `audit/*.jsonl`, `failures.log`), wyjścia skryptów strażnika, komunikatów commitów,
wiadomości Telegram generowanych przez boty ani logów Workera (`console.log`). Skrypty maskują dopasowania
(`check-secrets.mjs`: 4 znaki + długość), raporty cytują ścieżkę i numer linii, nie treść. Bot `/post`
nie dostaje nazw klientów ani osób w `<temat>`; Lead-Scout w digestach podaje firmy i sygnały, nie nazwiska
i e-maile imienne. Gdy skrypt musi potwierdzić obecność sekretu, loguje wartość logiczną
(`Boolean(env.TELEGRAM_BOT_TOKEN)`), nigdy wartość.

#### Mechanizm awarii (dlaczego)

Prompt to dane wysłane na zewnątrz: do API Anthropic (retencja wg polityki), do Higgsfield (ToU: licencja
na trening na inputach do czasu usunięcia), do Manus (pełne replaye sesji, szeroka licencja, jurysdykcja
Singapur/USA). Artefakty mają URL i mogą zostać udostępnione dalej; raporty audytu w `audit/` są
wersjonowane w repo i czytane przez orkiestratora (a więc trafiają do kolejnych kontekstów modelu).
Logi Cloudflare Workers są widoczne w dashboardzie i mogą być eksportowane; `console.log(update)` zapisze
`chat_id` i treść wiadomości foundera. Dane osób z leadów w narzędziu bez umowy powierzenia to naruszenie
art. 28 RODO, a bez informacji na `/rodo` — art. 14 (precedens Bisnode). Sekret w transkrypcie = ekspozycja
= rotacja (`secret-rotate-on-exposure`), więc jedna nieuważna wklejka kosztuje procedurę u dostawcy.

#### Niepoprawnie

```js
// post-bot/worker.js — debug, który zostaje na produkcji
console.log("update:", JSON.stringify(update), "token:", env.TELEGRAM_BOT_TOKEN);
```
```text
# audit/2026-09-12-integration-scanner.md — cytat z pliku sekretów
leadscout/.env:3: TELEGRAM_BOT_TOKEN=123456789:AA…   ← BLOCKER
# prompt do Manus / creative engine
„Oto nasza baza leadów (leads.json) — znajdź osoby decyzyjne: Jan Kowalski, CFO, jan@…"
# SendMessage do subagenta
„Użyj klucza sk-ant-… do testu bota"
```

#### Poprawnie

```js
// post-bot/worker.js — diagnostyka bez wartości
console.log("post-bot: token set =", Boolean(env.TELEGRAM_BOT_TOKEN), "chat allowlisted =", Boolean(env.ALLOWED_CHAT_ID));
```
```text
# raport audytu — ścieżka + reguła + maska ze skryptu
leadscout/.env — pominięty (secret-never-read-env); .gitignore OK
site/dist/assets/index-*.js:39 - INFO [integ-registry-required] zarejestrowane jako self-klarow
# prompt do creative engine — tylko brief wizualny (higgsfield.md §7), zero danych firm i osób
"abstract steel surface, palette #A8B4C2 on #121212, no text, no people"
# digest Lead-Scout — firma · sygnał · źródło (bez osób)
„Firma X (produkcja, 80 os.) — ogłoszenie na kontrolera z Excelem, pracuj.pl, 2026-09-10"
```

#### Test

```bash
S=".claude/skills/klarow-guardian/scripts/check-secrets.mjs"
# raporty, digesty, dokumentacja: zero wzorców sekretów
node "$S" audit leadscout/digesty docs .claude 2>/dev/null
# logi Workera nie wypisują env ani nagłówków
grep -nE "console\.(log|error|warn)\([^)]*(env\.|headers|update\b)" post-bot/worker.js && echo "HIGH: log z env/nagłówkami" || echo OK
# digesty bez adresów e-mail osób i telefonów
grep -rnE "[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,}" leadscout/digesty 2>/dev/null | grep -vE "kontakt@klarow\.com|biuro@|info@|office@|kontakt@" && echo "sprawdź: adresy imienne w digeście" || echo OK
# komunikaty commitów bez sekretów (ostatnie 50)
git log -n 50 --format=%B | node "$S" /dev/stdin 2>/dev/null || git log -n 50 --format=%B | grep -nE "sk-ant-|ghp_|[0-9]{8,10}:[A-Za-z0-9_-]{35}" && echo "BLOCKER" || echo OK
```

#### Wyjątki

Nazwy zmiennych (`TELEGRAM_BOT_TOKEN`) i ścieżki plików wolno cytować wszędzie. Dane fikcyjne dem
i publiczne dane firm (nazwa, branża, www) nie podlegają regule. Wartości logiczne/statystyki
(„token ustawiony: tak", „32 leady") są dozwolone.

### 13.4 secret-rotate-on-exposure

**Każda ekspozycja sekretu = rotacja u dostawcy w 24 h, unieważnienie starego, wpis z datą (bez wartości)**

Impact: **BLOCKER** · Tagi: secrets, rotation, incident, anthropic, telegram, github, onedrive · Źródło: CLAUDE.md 2026-07-27 (żywy klucz Anthropic w .env appki KSeF — do rotacji) / post-bot/README.md:16-18 / portfolio §6.3 (Klucze API.txt, RAILWAY-VARS-TO-PASTE.env, credentials/ na OneDrive) / leadscout/README.md:14 (BotFather /revoke) / synthesis §5.4.10 (secret-rotate, secret-local-files) · Dodano: 2026-09-12 · Plik: `rules/secret-rotate-on-exposure.md`

#### Zasada

Sekret uznajemy za ujawniony, gdy jego wartość znalazła się w: commicie (nawet cofniętym), transkrypcie
sesji agenta, zrzucie ekranu, wiadomości na czacie/Telegramie/mailu, pliku w folderze synchronizowanym
(OneDrive) poza katalogiem projektu z `.gitignore`, logu Workera, artefakcie, prompcie do narzędzia
zewnętrznego. Procedura, bez wyjątków i w tej kolejności: (1) wygenerować nowy sekret u dostawcy,
(2) podmienić w dozwolonym miejscu (Cloudflare secret / `.env` / Menedżer poświadczeń), (3) unieważnić
stary (Anthropic: usuń klucz w console; Telegram: BotFather `/revoke`; GitHub: usuń PAT w Settings →
Developer settings; Resend: usuń klucz API; Stripe: roll key), (4) usunąć nośnik ekspozycji (plik z OneDrive,
historia gita — `secret-git-history-scan-before-public`), (5) wpis w `docs/DECISIONS.md` / stanie
operacyjnym: co, kiedy, kto zrotował, gdzie była ekspozycja; NIGDY wartość ani jej fragment.
Rejestr integracji §4 utrzymuje listę otwartych rotacji do zamknięcia.

Otwarte na 2026-09-12 (do potwierdzenia przez founderów):
- klucz Anthropic z `.env` appki KSeF (`C:\Users\bibac\OneDrive\KSeF app`) — bot `/post` musi działać na NOWYM kluczu;
- `Desktop/Trading_Bot/Klucze API.txt` — klucze giełdowe/API w folderze OneDrive: przenieść do menedżera haseł, zrotować, usunąć plik;
- `Zabawa Code/RAILWAY-VARS-TO-PASTE.env`, `PROMO_CODES.txt`, `_server_local.log`, `*.db` — j.w. (Railway, Stripe LIVE, Resend, Telegram);
- `Reseling_App/loot-alert-mobile/credentials/`, `credentials.json` — j.w.

#### Mechanizm awarii (dlaczego)

Klucze API skanowane są automatycznie: token wypchnięty do publicznego repo bywa użyty w kilka minut,
a rachunek za cudze wywołania idzie na kartę Klarow (klucz Anthropic ma limit wydatków tylko, jeśli
został ustawiony). Token bota Telegram pozwala pisać do founderów jako `@Klarow_BOT` (phishing w kanale,
któremu ufają) i czytać digesty z leadami. PAT GitHuba daje zapis do repo z całą stroną (podmiana buildu
na Cloudflare Pages przez commit). OneDrive replikuje pliki na każde zalogowane urządzenie i do kosza
z retencją, więc „usunąłem plik" nie kończy ekspozycji; podobnie „klucz jest stary, nikt go nie widział"
to założenie, którego nie da się zweryfikować. Koszt rotacji to 5 minut; koszt braku rotacji jest
nieograniczony i spada na JDG Pawła.

#### Niepoprawnie

```text
# „naprawa" bez rotacji
git rm --cached leadscout/.env && git commit -m "usuwam .env"      # wartość zostaje w historii
del "Desktop\Trading_Bot\Klucze API.txt"                             # kopia w koszu OneDrive i na drugim urządzeniu
# wpis w dokumentacji z wartością „dla porządku"
docs/DECISIONS.md: „Stary klucz sk-ant-… zastąpiony nowym sk-ant-…"
```

#### Poprawnie

```text
1. console.anthropic.com → API keys → Create key (nazwa: klarow-post-bot-2026-09) → wrangler secret put ANTHROPIC_API_KEY
2. console.anthropic.com → stary klucz → Delete; ustawić monthly spend limit
3. C:\Users\bibac\OneDrive\KSeF app\.env → usunąć linię z kluczem (edycja ręczna przez foundera, nie przez agenta)
4. docs/DECISIONS.md:
   | 2026-09-1x | Rotacja klucza Anthropic (ekspozycja: .env appki KSeF, odnotowana 2026-07-27) | Karol | nowy klucz tylko w CF secrets |
5. rejestr integracji §4 poz. 1 → „zamknięte 2026-09-1x"
```
Telegram: BotFather → `/revoke` → nowy token → `leadscout/.env` (ręcznie) + `wrangler secret put TELEGRAM_BOT_TOKEN`
→ ponownie `setWebhook` z `WEBHOOK_SECRET` (README post-bot).

#### Test

```bash
S=".claude/skills/klarow-guardian/scripts/check-secrets.mjs"
node "$S" --history --quiet            # Σ BLOCKER 0 — brak wartości w całej historii gita
node "$S" --all --dist --quiet         # Σ BLOCKER 0 — brak wartości w drzewie i buildzie
# otwarte rotacje w rejestrze: każda pozycja §4 ma status „zamknięte <data>" albo jest na liście do decyzji
grep -nE "Rotacja|rotacj" docs/DECISIONS.md 2>/dev/null || echo "brak wpisu o rotacji w DECISIONS.md — pozycja otwarta"
# pliki z kluczami poza projektem (raport, nie auto-fix; nazwy plików, nie treść)
ls "C:/Users/bibac/OneDrive/Desktop/Trading_Bot/Klucze API.txt" "C:/Users/bibac/OneDrive/Desktop/Zabawa Code/RAILWAY-VARS-TO-PASTE.env" 2>/dev/null && echo "OTWARTE: pliki z kluczami na OneDrive"
# webhook Telegrama po rotacji (nazwy, bez wartości): pending_update_count niskie, url = Worker
echo 'curl "https://api.telegram.org/bot<TOKEN>/getWebhookInfo"  # wykonuje founder z wartością z .env'
```

#### Wyjątki

Identyfikatory publiczne (token beacona CF Web Analytics, publiczny `chat_id` kanału, jeśli kiedyś powstanie
kanał publiczny) nie wymagają rotacji. Sekrety klientów w ich instalacjach (token KSeF, klucz GUS) rotuje
klient wg własnej procedury; Klarow nigdy ich nie przechowuje, więc nie ma czego rotować po naszej stronie.

### 13.5 secret-secrets-outside-git

**Sekrety żyją wyłącznie poza gitem — Cloudflare secrets, Menedżer poświadczeń Windows, lokalny .env w .gitignore**

Impact: **BLOCKER** · Tagi: secrets, git, gitignore, cloudflare, wrangler, vite, credential-manager · Źródło: .gitignore:6-8 / post-bot/wrangler.toml:1-3 + README.md:79 („sekrety żyją w Cloudflare, nie w repo") / CLAUDE.md #6 (credential.helper=wincred) / synthesis §5.4.10 (secret-scan, secret-cf) / site-audit §4 („Sekrety") · Dodano: 2026-09-12 · Plik: `rules/secret-secrets-outside-git.md`

#### Zasada

Wartości sekretów mają dokładnie cztery dozwolone miejsca:
1. **Cloudflare Workers/Pages secrets** — `wrangler secret put NAZWA` albo dashboard „Variables and Secrets → Encrypt"
   (`TELEGRAM_BOT_TOKEN`, `ANTHROPIC_API_KEY`, `WEBHOOK_SECRET`, `ALLOWED_CHAT_ID`); nigdy sekcja `[vars]` w `wrangler.toml`;
2. **Menedżer poświadczeń Windows** — PAT GitHuba (wpis `git:https://github.com`, `credential.helper=wincred` per-repo);
3. **lokalny `leadscout/.env` i `leadscout/.chat_id`** — w `.gitignore`, edytowane ręcznie przez foundera;
4. **ustawienia usług poza repo** — hasło SMTP Resend w Gmail „Wyślij jako", konta Cloudflare/Cal.com/Higgsfield.
W repo trzymamy tylko NAZWY (`.env.example`, README, rejestr integracji). Zakazane: wartości w `site/`
(bundle Vite jest publiczny; `import.meta.env.VITE_*` jest wstrzykiwane jako literał), w `wrangler.toml`,
w `CLAUDE.md`/`docs/`, w komunikatach commitów, w artefaktach i skryptach. `.gitignore` zawiera co najmniej:
`leadscout/.env`, `leadscout/.chat_id`, `.dev.vars`, `*.pem`, `credentials*`, `*.local`. Bramka:
`node ".claude/skills/klarow-guardian/scripts/check-secrets.mjs" --staged` w pre-commit,
`--all --dist` przed pushem.

#### Mechanizm awarii (dlaczego)

Git nie zapomina: wartość raz scommitowana zostaje w historii nawet po `git rm`, a przepisanie historii
(`git filter-repo` + force push) i tak wymaga rotacji, bo GitHub cache'uje widoki commitów i boty
skanujące pobierają nowe pushe w minutach. Repo jest współdzielone przez dwóch founderów i OneDrive
synchronizuje katalog na kolejne urządzenia; każda kopia to kolejny wyciek. Vite kopiuje `VITE_*` do
`dist/assets/*.js` i do 19 prerenderowanych HTML; Cloudflare Pages publikuje je pod `*.pages.dev` i domeną.
`wrangler.toml` jest wersjonowany, więc `[vars]` to commit wartości. Cloudflare secrets są szyfrowane
i niewidoczne po zapisie; Menedżer poświadczeń rozwiązał już wiszący `git push` (CLAUDE.md #6), więc
infrastruktura jest gotowa: reguła tylko zabrania drogi na skróty.

#### Niepoprawnie

```toml
# post-bot/wrangler.toml
[vars]
TELEGRAM_BOT_TOKEN = "123456789:AA…"      # wersjonowane = opublikowane
```
```ts
// site/src/lib/notify.ts — Vite wstrzyknie wartość do publicznego bundla
const TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
```
```text
# CLAUDE.md — „żeby nie zginęło"
Token bota: 123456789:AA…
```

#### Poprawnie

```bash
# sekrety Workera — tylko przez wrangler / dashboard (README post-bot, opcja A/B)
wrangler secret put TELEGRAM_BOT_TOKEN
wrangler secret put ANTHROPIC_API_KEY
wrangler secret put WEBHOOK_SECRET
```
```text
# leadscout/.env.example (w repo) — tylko nazwa
TELEGRAM_BOT_TOKEN=
# leadscout/.env (poza repo, .gitignore) — wartość wpisuje founder ręcznie
```
```gitignore
# .gitignore — minimum
node_modules/
dist/
dist-ssr/
*.local
leadscout/.env
leadscout/.chat_id
.dev.vars
*.pem
credentials*
```

#### Test

```bash
S=".claude/skills/klarow-guardian/scripts/check-secrets.mjs"
node "$S" --all --dist --quiet                  # Σ BLOCKER 0, exit 0
node "$S" --staged --quiet                      # pre-commit: exit 0
git ls-files | grep -E '(^|/)\.env$|\.env\.[^e]|\.chat_id$|\.dev\.vars$|\.pem$|credentials' && echo "BLOCKER: plik sekretów w repo" || echo OK
git check-ignore -q leadscout/.env leadscout/.chat_id && echo "ignore OK"
grep -nE "^\[vars\]" post-bot/wrangler.toml && echo "BLOCKER: [vars] w wrangler.toml" || echo OK
grep -rnE "import\.meta\.env\.VITE_[A-Z_]*(TOKEN|KEY|SECRET|PASS)" site/src && echo "BLOCKER" || echo OK
# pre-commit bez husky/npx: .git/hooks/pre-commit
printf '#!/bin/sh\nnode ".claude/skills/klarow-guardian/scripts/check-secrets.mjs" --staged --quiet || exit 1\n' > .git/hooks/pre-commit && chmod +x .git/hooks/pre-commit
```

#### Wyjątki

Identyfikatory publiczne nie są sekretami i mogą być w kodzie: token beacona Cloudflare Web Analytics,
`chat_id` bota NIE jest publiczny (pozwala celować wiadomości w founderów) — trzymać w `.chat_id`/CF secret.
Placeholdery w szablonach (`.env.example`, README z `<TOKEN>`) są dozwolone; skaner je rozpoznaje.

## 14. Determinizm dem i silników (zero `Date.now`/`Math.random`/sieci, golden-testy, grosze, etykieta DEMO) (`demo`)

Domyślny impact: **BLOCKER** · tryb: tool · właściciel audytu: `code-auditor`

### 14.1 demo-determinism

**Silniki i dashboardy dem są deterministyczne: zero Date.now/new Date()/Math.random/performance.now/fetch/localStorage w lib/* i dashboards/*; „Dziś" = stała TODAY**

Impact: **BLOCKER** · Tagi: demo, determinism, engines, dashboards, privacy · Źródło: CLAUDE.md #6 („DEMO i silniki liczące: zero Date.now/Math.random/sieci w logice") · ui-kit-habits I1/Z1 · synthesis §5.4.11 determ-no-random · bklit-ui §4.7/§10.4 (hashFract) · TaskTimeline.tsx:10-12 · lib/report.ts:3-8 · Dodano: 2026-09-12 · Plik: `rules/demo-determinism.md`

#### Zasada

W plikach `site/src/lib/**` (silniki: `report.ts`, `qualityGate.ts`, `tranches.ts`, `g703.ts`, `pdf.ts`), `site/src/components/dashboards/**`, `site/src/components/DemoReport.tsx`, `site/src/components/Mini*.tsx` i `site/src/data/demo-sample.ts`:

1. **Zero źródeł niedeterminizmu**: `Date.now()`, `new Date()` BEZ argumentów, `performance.now()`, `Math.random()`, `crypto.randomUUID()`/`crypto.getRandomValues()`, `Intl.DateTimeFormat().resolvedOptions().timeZone`, `navigator.language` w logice (język przychodzi z `useLang()` jako prop).
   Dozwolone: `new Date(Date.UTC(y, m, d))` i `new Date(iso)` na JAWNYM wejściu (parsowanie dat z danych, jak `qualityGate.ts:104-116`), bo wynik zależy tylko od argumentu.
2. **„Dziś" to stała**: `TODAY = "2026-07-22"` (`TaskTimeline.tsx:12`), `YEAR = 2026`/`WEEK = 30` (`QualityGate.tsx:20-21`), `WEEK_START = 27` (`ProductionDashboard.tsx:11`); nowe dashboardy definiują własną stałą z komentarzem `// determinizm: stała referencyjna, nie Date.now()`.
3. **Zero sieci i zero storage**: `fetch`, `XMLHttpRequest`, `WebSocket`, `EventSource`, `navigator.sendBeacon`, `import()` z URL, `localStorage`/`sessionStorage`/`IndexedDB`/`document.cookie` w tych katalogach = 0. Dane wyłącznie z `src/data/*.ts` i z wejścia użytkownika (wklejony CSV, plik lokalny przez `FileReader`).
4. **ID seedowane**: identyfikatory wierszy/transz z licznika (`nextId = max + 1`) albo z hasza treści; nigdy `Math.random().toString(36)`, nigdy `Date.now()` jako id.
5. **Losowość prezentacyjna** (skeleton, „szum"): `hashFract(n) = frac(sin(n) * 43758.5453)` z jawnym seedem (bklit `loading-sweep.tsx`), nigdy `Math.random`.
6. **Kursy walut, stawki, progi** (`FX` w `PaymentCalculator.tsx`, `VAT`, `DEPOSIT_PCT`) to stałe fikcyjne z komentarzem „fikcyjne, deterministyczne"; nigdy z API.
7. Zdarzenia analityczne (`cta_*`, `demo_load_example`, `pdf_download`) emitowane w komponentach stron/przycisków, NIGDY wewnątrz silników ani w `useMemo` liczącym wynik (`demo-events-outside-engines`).

Jedyny dopuszczalny wyjątek: pomiar czasu wyświetlany w UI (`DemoReport.tsx`: `performance.now()` do napisu „policzone w X ms"). MUSI spełniać oba warunki:

- jest oznaczony komentarzem `// demo-determinism: wyjątek (pomiar czasu do wyświetlenia, poza wynikiem)` w linii pomiaru,
- jest liczony POZA obiektem wyniku: `return { parsed, agg }`, a milisekundy trafiają do refa/stanu prezentacyjnego, nigdy do wartości, którą serializujemy (`JSON.stringify(result)`), do PDF ani do golden-testu.

**Stan repo 2026-09-12 (dług F0, nie regresja):** `site/src/components/DemoReport.tsx:257-264` NIE MA komentarza i zwraca `{ parsed, agg, ms }` — `ms` siedzi w obiekcie wyniku, więc `JSON.stringify(result)` nie jest dziś deterministyczny. Do końca fazy 0 to pozycja długu (ticket F0 „wyciągnąć `ms` z wyniku"), potem BLOCKER.

#### Mechanizm awarii (dlaczego)

- Determinizm jest obietnicą produktową: „te same dane dają ten sam wynik; kalkulator, nie wróżka" (`MESSAGING.determinism`). Dashboard, który przy odświeżeniu pokazuje inny wynik (bo „dziś" się przesunęło, bo losowy id zmienił kolejność), zaprzecza jedynemu wyróżnikowi obok on-prem. CLAUDE.md #6 = twarda reguła → BLOCKER.
- Golden-testy (`demo-golden-tests`) i deterministyczne zrzuty (`shoot-tools.mjs`, cache immutable) działają tylko, gdy silnik jest czystą funkcją wejścia.
- `new Date()` bez argumentu w Gantcie przesuwa „Dziś" każdego dnia: dryf +Nd/−Nd zmienia się bez zmiany danych, a zrzut w ramie S3 przestaje pasować do dema.
- Sieć/storage w demie = dane użytkownika (wklejony CSV z realnymi kosztami) mogłyby wyjść poza przeglądarkę; „zero chmury dostawcy" (`MESSAGING.zeroVendorCloud`) musi być prawdą także w demie.
- bklit-ui (uznana biblioteka) ma `Date.now()` jako domyślny koniec domeny czasowej (`bar-chart.tsx:359`) i `Math.random()` w shimmerze: nie kopiować takich wzorców ani przykładów z docs (`new Date(Date.now() - 29*24*60*60*1000)`).

#### Niepoprawnie

```ts
const today = new Date();                                   // dryf „dziś"
const id = Math.random().toString(36).slice(2);             // niedeterministyczne id
const rate = await fetch("https://api.nbp.pl/api/exchangerates/rates/a/eur/").then((r) => r.json());   // sieć w demie
localStorage.setItem("klarow:demo:rows", JSON.stringify(rows));   // storage w demie
const seed = Date.now() % 1000;                             // seed z zegara
```

#### Poprawnie

```ts
// components/dashboards/TaskTimeline.tsx:12
const TODAY = "2026-07-22"; // stała referencyjna (determinizm)

// lib/qualityGate.ts:104 (parsowanie na jawnym wejściu: OK)
if (m) return new Date(Date.UTC(+m[3], +m[2] - 1, +m[1]));

// id z licznika
const nextId = (items: { id: number }[]) => items.reduce((mx, it) => Math.max(mx, it.id), 0) + 1;

// losowość prezentacyjna z seedem
const hashFract = (n: number) => { const x = Math.sin(n) * 43758.5453; return x - Math.floor(x); };
const skeletonHeights = Array.from({ length: 12 }, (_, i) => 20 + 60 * hashFract(i + 7));

// kursy fikcyjne (PaymentCalculator.tsx)
const FX: Record<string, number> = { PLN: 1, EUR: 4.31, USD: 3.97 }; // fikcyjne, deterministyczne (zamiast EBC)

// DemoReport.tsx — pomiar czasu POZA obiektem wyniku (docelowy kształt wyjątku)
const msRef = useRef<number | null>(null);
const result = useMemo(() => {
  if (csvText === null) return null;
  const t0 = performance.now();                 // demo-determinism: wyjątek (pomiar czasu do wyświetlenia, poza wynikiem)
  const parsed = parseCsv(csvText);
  const agg = aggregate(parsed.rows);
  msRef.current = Math.round(performance.now() - t0);   // zapis idempotentny; NIE wchodzi do zwracanego obiektu
  return { parsed, agg };                                // JSON.stringify(result) deterministyczne
}, [csvText]);
```

#### Test

```bash
# zakres: silniki + dashboardy + DemoReport + mini-komponenty + dane dem
D="site/src/lib site/src/components/dashboards site/src/components/DemoReport.tsx site/src/data/demo-sample.ts"
[ -f site/src/components/MiniReport.tsx ] && D="$D site/src/components/MiniReport.tsx site/src/components/MiniAudit.tsx"
# 1) zegar/losowość (oczekiwane: tylko udokumentowany wyjątek DemoReport performance.now z komentarzem)
grep -rnE 'Date\.now\(|new Date\(\)|Math\.random\(|crypto\.(randomUUID|getRandomValues)|resolvedOptions\(\)\.timeZone|navigator\.language' $D
grep -rnE 'performance\.now\(' $D | grep -v 'DemoReport.tsx'    # = 0
grep -B2 -nE 'performance\.now\(' site/src/components/DemoReport.tsx | grep -q 'demo-determinism: wyjątek' || echo "wyjątek bez komentarza"
# 2) sieć i storage (oczekiwane: 0)
grep -rnE '\bfetch\(|XMLHttpRequest|WebSocket|EventSource|sendBeacon|localStorage|sessionStorage|indexedDB|document\.cookie|import\("http' $D
# 3) stałe „dziś" w każdym dashboardzie z osią czasu
grep -nE 'const (TODAY|YEAR|WEEK|WEEK_START)\b' site/src/components/dashboards/TaskTimeline.tsx site/src/components/dashboards/QualityGate.tsx site/src/components/dashboards/ProductionDashboard.tsx | wc -l   # ≥ 4
# 4) golden: dwa przebiegi = identyczny JSON (patrz demo-golden-tests)
cd site && npm run test   # exit 0 (= node --experimental-strip-types --test tests/)
# 4b) ms poza obiektem wyniku (oczekiwane: 0)
grep -nE 'return \{[^}]*\bms\b' site/src/components/DemoReport.tsx
# 5) zrzuty: dwa przebiegi shoot-tools.mjs → identyczne sha256 (perf-images-policy)
```

Docelowo `node scripts/check-determinism.mjs` (kroki 1–3) w `npm run check`.

#### Wyjątki

- `DemoReport.tsx` (`performance.now()` do napisu „ms"), z komentarzem i poza obiektem wyniku.
- **Dług fazy 0 (F0), nie regresja**: dopóki F0 nie zamknięte, brak komentarza `// demo-determinism: wyjątek …` w `DemoReport.tsx` i `ms` w zwracanym obiekcie są pozycją długu (ticket F0), a nie naruszeniem bieżącej zmiany; audyt bazowy ma je raportować jako dług. Po F0 = BLOCKER.
- `BookingModal`/`BookingDialog` (`new Date()` do kalendarza rezerwacji) leży poza zakresem: to formularz kontaktu, nie demo; nadal bez `Math.random` i z zakresem dat liczonym od dzisiejszej daty użytkownika (to jest poprawne zachowanie kalendarza).
- Zdarzenia analityczne i `localStorage` dla `lang` (`i18n.tsx`) są poza katalogami objętymi regułą.

### 14.2 demo-golden-tests

**Każdy silnik ma golden-test node --test: dwa przebiegi = identyczny JSON i zgodność z zamrożonym plikiem golden; zero wartościowych importów przez alias @/ w src/lib/**; nowy silnik bez testu = fail**

Impact: **BLOCKER** · Tagi: demo, tests, determinism, engines, ci · Źródło: CLAUDE.md #6 („dwa przebiegi muszą dać identyczny JSON") · synthesis §1.3 P9/§2.7.1 (`node --test` dla report/qualityGate/tranches/g703)/§5.4.11 determ-golden · feasibility-perf §7 · bklit-ui §10.3 (zasada testów) · Dodano: 2026-09-12 · Plik: `rules/demo-golden-tests.md`

#### Zasada

1. Silniki liczące to czyste moduły w `site/src/lib/`: `report.ts` (`parseCsv`, `aggregate`), `qualityGate.ts` (`auditRows`, tydzień ISO), `tranches.ts` (`allocateGrosze` wyciągnięte z `PaymentCalculator.tsx:21`), `g703.ts` (`proposalFor` wyciągnięte z `G703Billing.tsx:36-41`), `pdf.ts` (definicja dokumentu). Każdy nowy dashboard z logiką liczącą dostaje moduł w `lib/` PRZED komponentem.
2. Każdy silnik ma plik `site/tests/<silnik>.test.mjs` (Node 24: `node --experimental-strip-types --test`, bez frameworka, bez `npx`), który:
   - **dwa przebiegi**: wywołuje silnik 2× na tym samym wejściu (`DEMO_SAMPLE` i ≥ 1 przypadek brzegowy) i asertuje `assert.deepStrictEqual(run1, run2)` oraz `JSON.stringify(run1) === JSON.stringify(run2)` (kolejność kluczy i tablic),
   - **golden**: porównuje `JSON.stringify(run1, null, 2)` z zamrożonym plikiem `site/tests/golden/<silnik>.<case>.json`; różnica = fail z diffem; aktualizacja golden tylko przez własną zmienną (`GOLDEN_UPDATE=1 npm run test`) w commicie `Demo: nowy golden <silnik> (powód)`,
   - **niezmienniki domenowe**: `tranches`: Σ alokacji == kwota co do grosza dla 1 000 wag z seedowanego generatora (`hashFract`), zero ujemnych; `g703`: `earned = roundHalfUp(D × M)`, propozycja 0 poniżej progu 40 % dla `base`, brak progu dla `change_order`, clawback ujemny NIEPRZYCINANY; `qualityGate`: reguły PM<0 / tydzień<0 / saldo≠0 / data poza tygodniem ISO na przypadkach z obu formatów dat; `report`: separator `;`/`\t`/`,` daje ten sam wynik, nagłówki PL/EN równoważne,
   - **brak zależności od środowiska**: test ustawia `TZ=UTC` (`process.env.TZ = "UTC"` na początku pliku) i nie czyta zegara.
3. Testy są uruchamiane w `npm run check` przez `npm run test`, którego JEDYNA definicja to `node --experimental-strip-types --test tests/` (Node 24, bez `npx`). Nigdzie nie piszemy gołego `node --test tests/` — bez `--experimental-strip-types` Node nie wczyta `../src/lib/<silnik>.ts`. Reguły cytują komendę jako `npm run test`, żeby nie rozjechały się warianty.
4. Silnik importowany przez dashboard MUSI być tym samym, który testujemy (dashboard `import { allocateGrosze } from "@/lib/tranches"`, nie lokalna kopia).
5. **Zero WARTOŚCIOWYCH importów przez alias `@/` w `src/lib/**`** (twardy warunek uruchamialności testów). Node nie czyta ani `paths` z `site/tsconfig.json:14` (`"@/*": ["src/*"]`), ani aliasu Vite (`site/vite.config.ts:12`), a `site/src/i18n.tsx` to JSX, którego `--experimental-strip-types` nie umie wczytać w ogóle. W `src/lib/**` dozwolone są wyłącznie:
   - `import type { Lang } from "@/i18n"` — import TYPU, wycinany przez strip-types (stąd `lib/report.ts:1` i `lib/money.ts` działają dziś),
   - importy względne wewnątrz `lib/` z JAWNYM rozszerzeniem: `import { fmtMoney } from "./money.ts"` (ESM w Node wymaga rozszerzenia; Vite je akceptuje, TS wymaga `allowImportingTsExtensions: true` obok `noEmit: true`).
   Wszystko inne — język, teksty (`MESSAGING`), etykiety walut, formatery — wchodzi do silnika ARGUMENTEM (`opts.lang`, `opts.labels`), nie importem. To ta sama zasada co „silniki = czyste funkcje" (`demo-events-outside-engines` p.6): warstwa prezentacji (komponent, `PdfButton`) woła `pick()` i podaje gotowe stringi.
   Konsekwencja dla `lib/pdf.ts`: `pdfDoc(input, opts)` dostaje `opts.labels.subject` i `opts.labels.footer` (patrz `demo-pdf-deterministic`), NIE importuje `@/i18n` ani `@/data/messaging`.
   Importy w `src/lib/**` piszemy jednolinijkowo (bramka poniżej jest liniowa).

#### Mechanizm awarii (dlaczego)

- CLAUDE.md #6: „determinizm jest obietnicą produktową (i tak testujemy: dwa przebiegi muszą dać identyczny JSON)". Bez testu obietnica jest deklaracją; z testem jest bramką → BLOCKER.
- Wyciągnięcie `allocateGrosze` i `proposalFor` z komponentów (P9) daje 0 ryzyka i testowalność: dziś te funkcje żyją w TSX i nie da się ich uruchomić w Node bez Reacta.
- Golden łapie zmiany „przy okazji" (ktoś poprawia zaokrąglenie, zmienia się 40 wyników w demie, zrzuty i PDF-y się rozjeżdżają); diff golden pokazuje to w PR.
- Testy niezmienników (Σ co do grosza na 1 000 losowych-seedowanych wag) chronią obietnicę „co do grosza" z paska S5 (`allowedNumbers`).
- `TZ`: `new Date(Date.UTC(...))` jest odporne, ale `toLocaleDateString` bez `timeZone: "UTC"` daje różne wyniki na CI (UTC) i u Karola (Europe/Warsaw).
- Pierwszy `import { pick } from "@/i18n"` w `src/lib/**` wywala `ERR_MODULE_NOT_FOUND` (alias) albo błąd parsera JSX (gdyby alias rozwiązać hookiem), a BLOCKER-owa bramka `npm run check` przestaje ruszać z miejsca — i to nie na zmianie w teście, tylko na „niewinnym" imporcie w silniku. Dlatego zakaz jest w regule, a nie w resolverze: resolver i tak nie wczyta `i18n.tsx`.

#### Niepoprawnie

```ts
// PaymentCalculator.tsx: silnik w komponencie, brak testu
function allocateGrosze(weights: number[], targetGr: number): number[] { … }
```

```
site/tests/            # katalog nie istnieje; „testowaliśmy ręcznie w konsoli"
```

```ts
// site/src/lib/pdf.ts — wartościowy import przez alias: `npm run test` przestaje startować
import { pick } from "@/i18n";
import { MESSAGING } from "@/data/messaging";
const subject = pick(opts.lang, MESSAGING.proofFooter);
```

#### Poprawnie

```ts
// site/src/lib/tranches.ts — silnik bez aliasu @/ w wartościach (tylko import type, jeśli w ogóle)
export function allocateGrosze(weights: number[], targetGr: number): number[] {
  const s = weights.reduce((a, b) => a + b, 0);
  const out: number[] = []; let running = 0;
  for (let i = 0; i < weights.length; i++) {
    if (s <= 0) out.push(0);
    else if (i < weights.length - 1) { const amt = Math.round((weights[i] / s) * targetGr); out.push(amt); running += amt; }
    else out.push(targetGr - running);   // reszta zaokrągleń na ostatniej pozycji → Σ == target
  }
  return out;
}
```

```js
// site/tests/tranches.test.mjs   (uruchomienie: npm run test = node --experimental-strip-types --test tests/)
process.env.TZ = "UTC";
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { allocateGrosze } from "../src/lib/tranches.ts";

const hashFract = (n) => { const x = Math.sin(n) * 43758.5453; return x - Math.floor(x); };
const CASES = { basic: [[148500, 96200, 61300], 12_345_678], zeros: [[0, 0, 0], 100], single: [[5], 999] };

test("dwa przebiegi = identyczny JSON", () => {
  for (const [name, [w, t]] of Object.entries(CASES)) {
    const a = allocateGrosze(w, t), b = allocateGrosze(w, t);
    assert.deepStrictEqual(a, b, name);
    assert.equal(JSON.stringify(a), JSON.stringify(b), name);
  }
});

test("golden", () => {
  for (const [name, [w, t]] of Object.entries(CASES)) {
    const out = JSON.stringify(allocateGrosze(w, t), null, 2);
    const path = new URL(`./golden/tranches.${name}.json`, import.meta.url);
    if (process.env.GOLDEN_UPDATE === "1") writeFileSync(path, out + "\n");
    assert.equal(out + "\n", readFileSync(path, "utf8"), `golden ${name}`);
  }
});

test("Σ co do grosza dla 1000 seedowanych wag", () => {
  for (let i = 0; i < 1000; i++) {
    const w = Array.from({ length: 1 + (i % 7) }, (_, k) => Math.floor(hashFract(i * 13 + k) * 1_000_000));
    const t = Math.floor(hashFract(i) * 100_000_000);
    const out = allocateGrosze(w, t);
    assert.equal(out.reduce((a, b) => a + b, 0), w.some((x) => x > 0) ? t : 0);
    assert.ok(out.every((x) => Number.isInteger(x)));
  }
});
```

```json
// site/package.json (scripts)
"test": "node --experimental-strip-types --test tests/",
// (jedyna definicja komendy testowej; reguły cytują `npm run test`)
"check": "node node_modules/typescript/bin/tsc --noEmit && npm run test && npm run build && node ../.claude/skills/klarow-guardian/scripts/verify-site.mjs && node ../.claude/skills/klarow-guardian/scripts/audit-static.mjs --fail-on BLOCKER,HIGH --baseline ../.claude/skills/klarow-guardian/baseline/audit-static-2026-09-12.jsonl"
```

#### Test

```bash
# każdy silnik ma test i golden
for e in report qualityGate tranches g703; do [ -f site/tests/$e.test.mjs ] || echo "BRAK testu: $e"; ls site/tests/golden/$e.*.json >/dev/null 2>&1 || echo "BRAK golden: $e"; done
# silniki nie żyją w komponentach (oczekiwane: 0)
grep -rnE '^function (allocateGrosze|proposalFor|aggregate|auditRows|parseCsv)\b' site/src/components
grep -nE 'from "@/lib/tranches"' site/src/components/dashboards/PaymentCalculator.tsx | wc -l   # = 1
grep -nE 'from "@/lib/g703"' site/src/components/dashboards/G703Billing.tsx | wc -l            # = 1
# testy przechodzą, TZ ustawione
cd site && npm run test      # exit 0 (= node --experimental-strip-types --test tests/)
# p.5: zero wartościowych importów przez alias @/ w silnikach (oczekiwane: 0 wierszy)
grep -rnE 'from "@/' site/src/lib --include=*.ts | grep -vE ':import type '
# cross-importy w lib mają jawne rozszerzenie .ts (oczekiwane: 0 wierszy bez rozszerzenia)
grep -rnE 'from "\./[A-Za-z0-9_-]+"' site/src/lib --include=*.ts
# komenda testowa nie rozjeżdża się między plikami (oczekiwane: 0 wierszy)
# UWAGA: dziś zwraca 2 wiersze z `rules/code-lint-and-tests-gate.md` (sekcja `code`) — do ujednolicenia
# przez właściciela tamtej reguły; `site/package.json` nie ma jeszcze skryptu `test` (dług F0).
grep -rn 'node --test tests/' .claude/skills/klarow-guardian/rules site/package.json | grep -v 'experimental-strip-types' 
grep -L 'process.env.TZ = "UTC"' site/tests/*.test.mjs   # = 0 plików bez TZ
# golden aktualizowany tylko świadomie
git log --format=%s -- site/tests/golden | grep -vE '^Demo: nowy golden' && echo "golden zmieniony poza commitem Demo:"
```

#### Wyjątki

- **Dług fazy 0 (F0), nie regresja**: do końca fazy 0 katalog `site/tests/` NIE ISTNIEJE (stan repo 2026-09-12), więc audyt bazowy raportuje brak testów i brak golden jako pozycję długu (ticket F0 „golden-testy silników"), nie jako naruszenie do naprawy w bieżącym commicie. Po zamknięciu F0 ten sam wynik = BLOCKER. Ta sama zasada co `perf-no-zoom-root` („do końca fazy 0…").
- `pdf.ts`: golden na `JSON.stringify(docDefinition)` (definicja dokumentu), nie na binarnym PDF (pdfmake wstawia datę utworzenia w metadanych; ustawić `info.creationDate` na stałą, patrz `demo-pdf-deterministic`).
- Dashboardy bez logiki liczącej (`ContractRegister` CRUD, `LabourProtocols` kreator) testują reduktory stanu (`nextId`, przejścia DRAFT→FINAL) tym samym wzorcem „dwa przebiegi", bez golden.

### 14.3 demo-events-outside-engines

**Zdarzenia analityczne emitowane w komponentach akcji, nigdy w silnikach lib/* ani w useMemo liczącym wynik; bez danych użytkownika, bez cookies**

Impact: **HIGH** · Tagi: demo, analytics, privacy, determinism, rodo · Źródło: synthesis §2.8 p.8 (lista zdarzeń, „poza silnikami dem")/§5.4.11 determ-events-outside · ui-kit-habits Z1 (brak trackerów w narzędziach) · peer-legal (/rodo, zero domyślnych zgód) · integ-* (rejestr integracji) · Dodano: 2026-09-12 · Plik: `rules/demo-events-outside-engines.md`

#### Zasada

1. Jedyny punkt wyjścia zdarzeń: `src/lib/track.ts` z funkcją `track(name: EventName, props?: Record<string, string | number | boolean>)`; `EventName` = unia zamknięta: `cta_book_open`, `cta_mail`, `cta_tel`, `cta_worst_excel`, `demo_load_example`, `pdf_download`, `lang_toggle`, `founders_view`, `calc_tranche_run`. Nowe zdarzenie = rozszerzenie unii + wpis w `references/integrations-registry.md` + wpis w `/rodo` (jeśli zmienia zakres przetwarzania).
2. `track()` jest wywoływany WYŁĄCZNIE w handlerach zdarzeń UI (`onClick`, `onSubmit`, `onChange` przycisków/linków/przełączników) w komponentach stron i przycisków (`ClosingCta`, `Navbar`, `PdfButton`, `DashboardActions`, `TrancheCalc` przycisk „Policz”). ZAKAZ w: `src/lib/**` (silniki i `pdf.ts`), `useMemo`/`useEffect` liczących wyniki, wnętrzach dashboardów poza paskiem akcji, `DashboardMount`, `HeroMedia`, prerenderze.
3. **Payload**: tylko nazwy (klucz dema, nazwa dokumentu, `lang`), nigdy treść wklejonego CSV, wartości kwot, nazwy plików użytkownika, e-mail/telefon z formularza, `userAgent`, IP (backend też nie loguje). Zero cookies, zero `localStorage` dla analityki, zero fingerprintingu.
4. **Transport**: Cloudflare Web Analytics (cookieless, snippet w `index.html` po `load`) + zdarzenia przez `navigator.sendBeacon("/api/e", …)` do Pages Function → Workers Analytics Engine (albo Zaraz), z fallbackiem `fetch(..., { keepalive: true })`; `track()` jest no-op w `dev`, w prerenderze i gdy `navigator.doNotTrack === "1"` lub `globalPrivacyControl === true`.
5. **Warunek publikacji**: trasa `/rodo` (klauzula art. 14 + polityka prywatności + prawo sprzeciwu wyróżnione) istnieje i wymienia analitykę cookieless oraz Cal.com jako procesor PRZED włączeniem `track()` na produkcji; formularze bez domyślnie zaznaczonych zgód (PKE).
6. Silniki dem pozostają czystymi funkcjami: `aggregate()`, `auditRows()`, `allocateGrosze()`, `proposalFor()` nie wiedzą o istnieniu analityki; w golden-testach `track` nie jest mockowany, bo nie ma go w grafie importów `lib/`.

#### Mechanizm awarii (dlaczego)

- Zdarzenie w `useMemo` liczącym wynik odpala się przy każdym przeliczeniu (także w StrictMode 2×) i wiąże warstwę liczącą z siecią: silnik przestaje być czystą funkcją, golden-testy w Node wywracają się na `navigator`, a „zero sieci w logice" (CLAUDE.md #6) jest złamane.
- Payload z treścią CSV = dane osobowe/tajemnica przedsiębiorstwa klienta w logach dostawcy analityki: zaprzeczenie „dane zostają u Ciebie" i naruszenie RODO (brak podstawy, brak informacji w `/rodo`).
- CF Web Analytics jest cookieless, ale zdarzenia CTA to już przetwarzanie (adres IP w żądaniu): musi być opisane w `/rodo` zanim wejdzie na produkcję (peer-legal).
- Persona (CFO) czyta „narzędzie, które wysyła coś do internetu przy każdym przeliczeniu" jako dyskwalifikację; narzędzia wdrożeniowe chodzą w LAN bez trackerów (ui-kit-habits Z1).

#### Niepoprawnie

```ts
// lib/report.ts
export function aggregate(rows) { track("report_computed", { rows: rows.length, firstProject: rows[0]?.project }); … }   // sieć w silniku, dane użytkownika
// DemoReport.tsx
const result = useMemo(() => { const agg = aggregate(parsed.rows); track("demo_result", { csv: csvText }); return agg; }, [csvText]);   // payload z CSV, w useMemo
document.cookie = "klarow_uid=" + Math.random();   // cookie + losowość
```

#### Poprawnie

```ts
// src/lib/track.ts
export type EventName = "cta_book_open" | "cta_mail" | "cta_tel" | "cta_worst_excel" | "demo_load_example" | "pdf_download" | "lang_toggle" | "founders_view" | "calc_tranche_run";
type Props = Record<string, string | number | boolean>;
export function track(name: EventName, props: Props = {}): void {
  if (typeof window === "undefined" || import.meta.env.DEV) return;
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
  if (nav.doNotTrack === "1" || nav.globalPrivacyControl === true) return;
  const body = JSON.stringify({ n: name, p: props, r: location.pathname });
  if (!navigator.sendBeacon?.("/api/e", body)) fetch("/api/e", { method: "POST", body, keepalive: true }).catch(() => {});
}
```

```tsx
// DemoReport.tsx: zdarzenie w handlerze akcji, payload = tylko klucz
const loadExample = () => { setCsvText(DEMO_SAMPLE[lang]); setSrcLabel(t.srcExample); track("demo_load_example", { demo: "report", lang }); };
const result = useMemo(() => (csvText === null ? null : aggregate(parseCsv(csvText).rows)), [csvText]);   // czysto
```

#### Test

```bash
# track tylko w handlerach komponentów; nigdy w lib, useMemo, useEffect liczących (oczekiwane: 0)
grep -rnE 'track\(' site/src/lib site/src/prerender site/src/components/DashboardMount.tsx site/src/components/HeroMedia.tsx 2>/dev/null
grep -rnE -B3 'track\(' site/src --include=*.tsx | grep -E 'useMemo|useEffect' | grep -v 'onClick'   # = 0
# payload bez danych użytkownika (oczekiwane: 0)
grep -rnE 'track\([^)]*\b(csv|csvText|rows|email|phone|tel|file|fileName|amount|value|userAgent)\b' site/src
# jedna unia nazw; każde użycie w unii
grep -oE 'track\("[a-z_]+"' -r site/src --include=*.tsx | sed -E 's/.*track\("//; s/"//' | sort -u > /tmp/used; grep -oE '"[a-z_]+"' site/src/lib/track.ts | tr -d '"' | sort -u > /tmp/decl; comm -23 /tmp/used /tmp/decl   # = pusto
# cookies/fingerprint (oczekiwane: 0)
grep -rnE 'document\.cookie|fingerprint|canvas\.toDataURL\(\)' site/src
# /rodo istnieje i wymienia analitykę + Cal.com przed włączeniem track na produkcji
[ -f site/dist/rodo.html ] && grep -ciE 'analityk|Cloudflare Web Analytics' site/dist/rodo.html   # ≥ 1
grep -ciE 'prawo sprzeciwu|right to object' site/dist/rodo.html   # ≥ 1
# golden-testy silników działają w Node bez navigator (nie importują track)
grep -rnE 'from "@/lib/track"' site/src/lib   # = 0
```

#### Wyjątki

- `lang_toggle` może być emitowany z `Navbar` przy zmianie języka (handler przełącznika), a `founders_view` z `IntersectionObserver` w sekcji S8 (jedyne zdarzenie z observera; `once`, bez payloadu poza `lang`).

### 14.4 demo-labels

**Każde demo jest oznaczone „Demo na danych przykładowych" (badge kitu .st) i zdaniem o determinizmie; dane, nazwy i kwoty są jawnie fikcyjne**

Impact: **HIGH** · Tagi: demo, labels, brand, trust, copy, marketing · Źródło: synthesis §2.1 proofLabels/§5.4.11 determ-labels · CLAUDE.md zasada #3 (case = „firma produkcyjno-budowlana") i sekcja Narzędzia („KAŻDE z 12 narzędzi działa na żywo na danych DEMO") · brand-icp §2.2 p.6 (uczciwe etykiety dowodu) · taste §4.5 („Jane Doe" Effect) · Dodano: 2026-09-12 · Plik: `rules/demo-labels.md`

#### Zasada

> **Zakres powierzchni**: reguła dotyczy OBU trybów. Punkt 1 zdanie 2–3 (chipy na kartach huba i w ramach S3) i punkt 6 dotyczą powierzchni MARKETINGOWEJ (`/`, `/narzedzia`), więc audytuje je także `ui-auditor`/`copy-auditor` przez `brand-honest-labels`; reszta to tryb `tool`. Sekcja `demo` w `rules/_sections.md` ma dziś tryb `tool` — dopóki nie zmieni się na `both`, orkiestrator musi ładować tę regułę również w trybie `marketing` (pozycja w `open_points` sesji).

1. **Badge**: każdy z **12 dashboardów** (11 komponentów w `src/components/dashboards/**` — `PdfButton.tsx` dashboardem nie jest — plus `DemoReport.tsx`) ma w nagłówku panelu chip kitu `<span className="st">` z tekstem z `MESSAGING.proofLabels.demo` („Demo na danych przykładowych" / „Demo on sample data"). Karty w hubie i ramy S3 pokazują ten sam chip dla `kind: "demo"`; `product` → `st st-accent` „Własny produkt"; `case` → `st st-accent` z obrysem „Wdrożone w firmie produkcyjno-budowlanej". `st-blue`/`st-green` na stronie marketingowej nie występują (Color Lock; kolory semantyczne tylko wewnątrz dashboardów jako statusy).
2. **Zdanie determinizmu**: pod każdym dashboardem (stopka panelu) jedna linia z `MESSAGING.determinism` („Te same dane dają ten sam wynik…") ALBO krótszy wariant `MESSAGING.proofFooter` („Dane fikcyjne · te same dane zawsze dają ten sam wynik"), PL/EN przez `pick()`. Zero własnych sformułowań per dashboard (dziś np. `G703Billing.tsx:66` ma własną stopkę: do ujednolicenia).
3. **Dane fikcyjne, ale wiarygodne**: nazwy projektów/inwestycji/kontrahentów z jednej listy `src/data/demo-names.ts` (miasta + typ obiektu: „Hala Poznań", „Moduły Gdańsk"; firmy: „Stalbud Sp. z o.o.", „Prefab-Mont"), bez „Jane Doe"/„Firma A"/„Lorem", bez nazw realnych klientów, bez nazwy firmy źródłowej i jej produktów, bez realnych osób (imię i nazwisko PM-a: z listy fikcyjnej, sygnowanej w komentarzu). Kwoty realistyczne dla ICP (projekty 0,3–5 mln zł; G703 w USD), nie „123 456".
4. **Tryb TEST w importach**: dashboardy piszące (w wersji wdrożeniowej) do plików mają w badge dodatkowo `TEST` i zdanie „w Twoich plikach nic się nie dzieje" (`ErpImports.tsx:60`); to zostaje.
5. **PDF**: stopka „DEMO: dane fikcyjne" na każdym dokumencie (`lib/pdf.ts`), plus zdanie o determinizmie w metadanych `info.subject`.
6. **Zero liczb-obietnic w demie**: opisy dashboardów nie zawierają liczb spoza `MESSAGING.allowedNumbers` (np. „oszczędza 40 godzin miesięcznie") ani nazw dostawców AI; wynik dema nie jest przedstawiany jako wynik klienta.
7. **Etykieta „Wdrożone"** wymaga wpisu `client` w `tools.ts` i decyzji D7 (umowa IP); liczba mnoga „u klientów" zakazana do 2. klienta (`brand-*`).

#### Mechanizm awarii (dlaczego)

- Zasada #3 CLAUDE.md: marka firmy źródłowej nie może pojawić się publicznie przed umową IP; demo bez etykiety „dane przykładowe" z realistycznymi nazwami sugeruje realne wdrożenie u realnego klienta = ryzyko prawne i wizerunkowe.
- brand-icp: „każda etykieta „Wdrożone" wymaga dowodu"; nieuczciwe etykiety dowodu były wadą showreel. Uczciwość etykiet to element „kalkulator, nie wróżka".
- „Jane Doe"/„Firma A" (taste §4.5) czyta się jako makieta, nie narzędzie; realistyczne fikcyjne nazwy z jednej listy dają spójność między 12 dashboardami, zrzutami i PDF.
- Bez zdania o determinizmie użytkownik nie wie, że może odświeżyć i porównać; zdanie jest też słowem-kluczem dla LLM-ów (GEO) cytujących stronę.

#### Niepoprawnie

```tsx
<h3>Raport zarządczy</h3>                                   // brak badge
<td>Firma A</td><td>Projekt 1</td><td>123 456,00 zł</td>    // makieta
<p>Ten raport oszczędza 40 h miesięcznie u naszych klientów.</p>   // liczba bez źródła, liczba mnoga „klientów"
<span className="st st-blue">WDROŻONE</span>                 // st-blue na stronie marketingowej; „wdrożone" bez client/D7
```

#### Poprawnie

```tsx
import { MESSAGING } from "@/data/messaging";
import { DEMO_PROJECTS } from "@/data/demo-names";
<header className="panel-head">
  <h3>{t.title}</h3>
  <span className="st">{pick(lang, MESSAGING.proofLabels.demo)}</span>
  {mode === "test" ? <span className="st st-accent"><Eye className="st-ico" /> TEST</span> : null}
</header>
…
<footer className="panel-foot muted">{pick(lang, MESSAGING.proofFooter)}</footer>
```

```ts
// src/data/demo-names.ts (jedna lista fikcyjnych nazw dla wszystkich dem)
export const DEMO_PROJECTS = [
  { pl: "Hala Poznań", en: "Poznań warehouse" }, { pl: "Moduły Gdańsk", en: "Gdańsk modules" }, { pl: "Biurowiec Łódź", en: "Łódź office block" },
] as const;
export const DEMO_COUNTERPARTIES = ["Stalbud Sp. z o.o.", "Prefab-Mont", "Elektro-Serwis Nowak"] as const;   // fikcyjne
```

#### Test

```bash
# badge z messaging w każdym dashboardzie i DemoReport
# 12 = 11 plików w components/dashboards/** (bez PdfButton.tsx) + DemoReport.tsx
# 13 to liczba NARZĘDZI w tools.ts (12 dem + KSeF kind: "case"), nie liczba dashboardów
grep -rlE 'proofLabels\.demo' site/src/components/dashboards site/src/components/DemoReport.tsx | grep -v PdfButton | wc -l   # = 12
grep -rlE 'proofFooter|MESSAGING\.determinism' site/src/components/dashboards site/src/components/DemoReport.tsx | grep -v PdfButton | wc -l   # = 12
# zero własnych stopek/etykiet
grep -rnE '"Dane fikcyjne|DEMO dane|dane DEMO' site/src/components --include=*.tsx | grep -v messaging   # = 0 (poza messaging.ts)
# Color Lock: st-blue/st-green poza dashboardami (oczekiwane: 0)
grep -rnE 'st-(blue|green|violet)' site/src --include=*.tsx | grep -vE 'components/dashboards/|DemoReport.tsx'
# makiety i marka źródłowa (oczekiwane: 0)
grep -rniE 'jane doe|john doe|lorem|firma a\b|projekt 1\b|acme' site/src
# wzorzec marki źródłowej trzymamy w JEDNYM miejscu (brand-no-nuconic / scripts/audit-static.mjs --print-src-brand-re),
# żeby nie mnożyć plików z tym ciągiem w publicznym repo (por. secret-git-history-scan-before-public):
SRC_BRAND_RE=$(node .claude/skills/klarow-guardian/scripts/audit-static.mjs --print-src-brand-re)
grep -rniE "$SRC_BRAND_RE" site/src site/dist 2>/dev/null   # = 0 (BLOCKER brand-no-nuconic)
# nazwy z jednej listy
grep -rnE '"Hala |"Moduły |"Biurowiec ' site/src/components | grep -v demo-names   # = 0 (import z data/demo-names.ts)
# liczby w opisach dem tylko z allowedNumbers (bramka verify-site: każda liczba w dist na liście) · „u klientów” = 0
grep -rniE 'u klientów|at our clients' site/src site/dist 2>/dev/null   # = 0
# PDF: stopka DEMO
grep -nE 'DEMO' site/src/lib/pdf.ts | wc -l   # ≥ 1
```

#### Wyjątki

- Karta KSeF (`kind: "product"`) ma badge „Własny produkt" i panel „jak działa" zamiast dema; bez zdania o danych przykładowych (nie ma dema), z zdaniem `zeroVendorCloud`.
- Trasa `/oferta` sekcja kalkulatora transz (jeśli wejdzie) używa tych samych etykiet co dashboard.

### 14.5 demo-money-integers

**Kwoty liczone w groszach/centach jako liczby całkowite, formatowane jednym helperem fmtMoney (PLN 12 345,67 zł / USD $1,234,567.89), tabular-nums + nowrap**

Impact: **HIGH** · Tagi: demo, money, numbers, formatting, i18n · Źródło: ui-kit-habits C1 (N1) · synthesis §5.4.11 determ-money · PaymentCalculator.tsx:21-37 (allocateGrosze) · G703Billing.tsx:7 („centy, int") · CLAUDE.md (kalkulator transz „Σ co do grosza") · Dodano: 2026-09-12 · Plik: `rules/demo-money-integers.md`

#### Zasada

1. **Jednostka liczenia**: grosze (PLN) i centy (USD) jako `number` całkowite (`Number.isInteger`). Konwersja z wejścia użytkownika („1 234,56") do groszy następuje RAZ przy parsowaniu (`toGrosze(text): number`), a do wyświetlenia RAZ przy formatowaniu. Żadnych `0.1 + 0.2` po drodze: mnożenie procentów przez kwotę kończy się `Math.round` (albo `roundHalfUp = Math.floor(v + 0.5)` jak w G703, spójnie w całym silniku), reszta zaokrągleń na ostatniej pozycji (`allocateGrosze`).
2. **Jeden helper**: `src/lib/money.ts` eksportuje `fmtMoney(minor: number, currency: "PLN" | "USD" | "EUR", lang: Lang): string` i `toMinor(text: string): number | null`. `Lang` wchodzi jako `import type` (`demo-golden-tests` p.5: w `src/lib/**` zero WARTOŚCIOWYCH importów przez alias `@/`; `money.ts` nie importuje `pick` ani `MESSAGING` — dostaje `lang` argumentem). Format:
   - PL: `12 345,67 zł` (spacja niełamliwa U+00A0 między tysiącami, przecinek dziesiętny, symbol po kwocie), USD w PL: `1 234 567,89 USD`,
   - EN: `PLN 12,345.67`, `$1,234,567.89`, `€1,234.56`,
   - minus typograficzny `−` (U+2212), nigdy `-`; ujemne w nawiasach tylko w tabelach księgowych na jawne żądanie (nie w demie),
   - zero końcowych „,00" NIE jest ucinane w tabelach (wyrównanie kolumny); w KPI dopuszczalne `k`/`tys.` przez osobny `fmtMoneyCompact`.
   Lokalne helpery w komponentach (`fmtZl`, `usd`, `fmtPln`, `money` w `ContractRegister.tsx:33`, `ErpImports.tsx:54`, `CostControl.tsx:31`, `PaymentCalculator.tsx:44`, `G703Billing.tsx:44`) zastępuje import z `lib/money.ts` (faza 0/1).
3. **Typografia**: każda liczba w tabeli/KPI/wykresie ma `font-variant-numeric: tabular-nums` (klasa kitu `.tnum` albo utility `tabular-nums`) i `white-space: nowrap` (`.nowrap`); kwoty/daty nigdy nie łamią się w środku; duże KPI skalują się `clamp()` zamiast zawijać.
4. **Wejście**: `<input inputMode="decimal">` z parserem tolerującym spację/przecinek/kropkę; niepoprawne wejście → `null` + komunikat kitu, nie `NaN` w wyniku.
5. **Waluty i kursy**: `FX` fikcyjne, deterministyczne (`demo-determinism`); przeliczenie `Math.round(minor * rate)` w minor jednostkach; suma po przeliczeniu liczona z pozycji, nie z sumy (jawna „ścieżka wyliczenia" w UI).
6. **PDF**: te same helpery (`fmtMoney`) w `lib/pdf.ts`; kolumny kwot wyrównane do prawej; polskie znaki (Roboto z pdfmake ma `ł`, `ż`).

#### Mechanizm awarii (dlaczego)

- `0.1 + 0.2 = 0.30000000000000004`: na 30 pozycjach transzy różnica groszowa w sumie = złamana obietnica „co do grosza" z paska S5 (`allowedNumbers`: „kontrola sum w każdym imporcie co do grosza"). Kit (`SKILL.md:84-86, 402-403`): „grosze/centy jako jednostka liczenia".
- Pięć różnych helperów formatowania = pięć różnych formatów (`12 345,67 zł` vs `PLN 12 345.67` vs `12345.67 zł`) w jednym serwisie; klient widzi niespójność i wątpi w „porządek w danych".
- Bez `tabular-nums` cyfry proporcjonalne mają różne szerokości: kolumny „tańczą" przy zmianie wejścia, a `Counter` przesuwa sąsiadów (CLS).
- Zwykły minus `-` w PL łamie się na końcu linii i wygląda jak myślnik; `−` (U+2212) ma szerokość cyfry w `tabular-nums`.
- `toLocaleString` bez jawnego `lang` bierze locale przeglądarki: Karol (pl-PL) i CI (en-US) formatują inaczej → golden-testy i zrzuty niestabilne.

#### Niepoprawnie

```ts
const net = 148500.5 * 0.23;                                   // float w logice
const fmtZl = (gr) => `${(gr / 100).toLocaleString()} zł`;    // locale z przeglądarki, helper lokalny
<td>{total.toFixed(2)} zł</td>                                 // toFixed = float + kropka w PL, brak tnum
<span>-1 234,00 zł</span>                                      // zwykły minus, może się złamać
```

#### Poprawnie

```ts
// src/lib/money.ts
import type { Lang } from "@/i18n";
export type Currency = "PLN" | "USD" | "EUR";
const NBSP = " ", MINUS = "−";
export function toMinor(text: string): number | null {
  const norm = text.replace(/[\s ]/g, "").replace(",", ".");
  if (!/^-?\d+(\.\d{1,2})?$/.test(norm)) return null;
  const [int, frac = ""] = norm.replace("-", "").split(".");
  const minor = Number(int) * 100 + Number((frac + "00").slice(0, 2));
  return norm.startsWith("-") ? -minor : minor;
}
export function fmtMoney(minor: number, currency: Currency, lang: Lang): string {
  if (!Number.isInteger(minor)) throw new Error("fmtMoney: minor units must be an integer");
  const neg = minor < 0, abs = Math.abs(minor);
  const body = (abs / 100).toLocaleString(lang === "pl" ? "pl-PL" : "en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/\s/g, NBSP);
  const sign = neg ? MINUS : "";
  if (lang === "pl") return `${sign}${body}${NBSP}${currency === "PLN" ? "zł" : currency}`;
  const symbol = currency === "USD" ? "$" : currency === "EUR" ? "€" : "PLN ";
  return `${sign}${symbol}${body}`;
}
```

```tsx
<td className="tnum nowrap" style={{ textAlign: "right" }}>{fmtMoney(row.netGr, "PLN", lang)}</td>
<input className="input tnum" inputMode="decimal" value={raw} onChange={(e) => { setRaw(e.target.value); setMinor(toMinor(e.target.value)); }} aria-invalid={minor === null} />
```

#### Test

```bash
# jeden helper; lokalne kopie usunięte (oczekiwane: 0)
grep -rnE 'const (fmtZl|fmtPln|usd|money|fmtMoney|fmtUsd) = ' site/src/components site/src/lib/report.ts   # = 0 poza lib/money.ts
grep -rnE 'toLocaleString\(\)' site/src                            # = 0 (bez locale)
grep -rnE '\.toFixed\(2\)' site/src/lib site/src/components/dashboards   # = 0
# float w silnikach: mnożenie kwot bez round (ocena LLM + test niezmienników Σ w demo-golden-tests)
grep -rnE '\* (VAT|rate|m|mPct / 100)\b' site/src/lib | grep -vE 'Math\.round|roundHalfUp'   # = 0
# tnum/nowrap w tabelach z kwotami (oczekiwane: każdy <td z fmtMoney ma tnum lub tabular-nums)
grep -rnE '<td[^>]*>\{fmtMoney' site/src | grep -vE 'tnum|tabular-nums'   # = 0
# minus typograficzny: szukamy ZNAKU U+2212, nie sekwencji „\u2212" (w kodzie jest literał „−")
grep -rnE '"-\$\{|`-\$\{' site/src/lib/money.ts     # = 0 (zwykły minus w szablonie)
rg -c '\x{2212}' site/src/lib/money.ts                  # ≥ 1 (U+2212 MINUS SIGN)
rg -c '\x{00A0}' site/src/lib/money.ts                  # ≥ 1 (U+00A0 NBSP)
# (GNU grep bez -P nie zna \x{...}: alternatywa `grep -c $'\u2212' site/src/lib/money.ts` w bashu ≥ 4.2)
# test jednostkowy helpera (npm run test): toMinor("1 234,56")=123456; fmtMoney(123456,"PLN","pl")="1 234,56 zł" (NBSP); fmtMoney(-5,"USD","en")="−$0.05"
# import typu, nie wartości (demo-golden-tests p.5; oczekiwane: 0 wierszy)
grep -nE 'from "@/' site/src/lib/money.ts | grep -vE ':import type ' 
```

#### Wyjątki

- Procenty i wskaźniki (`costPct`, `deviation` w p.p., marża %) są liczbami zmiennoprzecinkowymi z jawnym `maximumFractionDigits: 1`; nie są kwotami.
- `fmtMoneyCompact` (`1,2 mln zł`, `$4.2M`) tylko w KPI i wykresach, nigdy w tabelach ani PDF.

### 14.6 demo-pdf-deterministic

**PDF z dem jest deterministyczny (te same dane → identyczna definicja i bajty), 1 strona A4, stopka DEMO, polskie znaki, pobieranie zamiast okna druku, lazy pdfmake**

Impact: **HIGH** · Tagi: demo, pdf, determinism, documents · Źródło: CLAUDE.md „Dokumenty PDF" (pdfmake lazy, A4 jednostronicowy, stopka DEMO) · synthesis §5.4.11 determ-pdf · ui-kit-habits H (dokumenty) · rozstrzygnięcie (2): Roboto zostaje, parametr font w API pdfDoc; refaktor pdf.ts robi inne okno (ta reguła nie zmienia pdf.ts w fazie 1) · demo-golden-tests p.5 (zero wartościowych importów przez alias @/ w src/lib/**) · Dodano: 2026-09-12 · Plik: `rules/demo-pdf-deterministic.md`

#### Zasada

`site/src/lib/pdf.ts` + `dashboards/PdfButton.tsx` (5 dokumentów: protokół robocizny, plan płatności, raport importu, podsumowanie tygodnia PM, rejestr umów):

1. **Determinizm definicji**: `pdfDoc(input, { lang, font, labels })` jest czystą funkcją → `TDocumentDefinitions`; zero `new Date()` (data dokumentu = stała z danych dema, np. `TODAY`), zero `Math.random`; `info: { title, subject: opts.labels.subject, creator: "Klarow", producer: "Klarow", creationDate: new Date("2026-07-22T00:00:00Z"), modDate: new Date("2026-07-22T00:00:00Z") }` (stałe daty w metadanych, inaczej bajty PDF różnią się przy każdym pobraniu).
   **Teksty wchodzą ARGUMENTEM, nie importem**: `pdf.ts` leży w `src/lib/**`, więc obowiązuje `demo-golden-tests` p.5 — zero wartościowych importów przez alias `@/` (`pick`, `MESSAGING`). Gotowe stringi (`labels.subject`, `labels.footer`) składa wołający (`PdfButton.tsx`), który ma prawo importować `@/i18n` i `@/data/messaging`. Bez tego `npm run test` (Node + `--experimental-strip-types`) nie wczyta `pdf.ts`: alias `@/` nie jest rozwiązywany, a `@/i18n` to plik JSX.
2. **Determinizm bajtów**: golden-test porównuje `JSON.stringify(pdfDoc(sample))` (zawsze) i, w fazie 3, `sha256` bufora z `pdfMake.createPdf(def).getBuffer()` uruchomionego w Node z tym samym vfs (jeśli pdfmake w Node jest stabilny; jeśli nie, tylko definicja).
3. **Format**: A4 pionowo, 1 strona (tabela ograniczona do N wierszy z linią „… i M kolejnych pozycji" zamiast łamania strony), nagłówek `KLAROW` tekstowy (wordmark, bez logo graficznego), meta (nazwa dokumentu, data z danych, wersja DEMO), tabela z kwotami wyrównanymi do prawej (`fmtMoney`), stopka „DEMO: dane fikcyjne · te same dane zawsze dają ten sam dokument", opcjonalne pola podpisów.
4. **Font**: Roboto wbudowane w pdfmake (decyzja B); parametr `font` w API istnieje (`"Roboto"` domyślnie), osadzenie kroju UI dopiero po decyzji founderów o foncie v2 (wymaga TRZECH statycznych TTF: Regular 400, Bold 700, Italic 400 — kursywa jest używana w bloku cytatu). Polskie znaki: Roboto z `vfs_fonts` je ma; test na `„ąćęłńóśźż ĄĆĘŁŃÓŚŹŻ”`.
5. **Ładowanie**: `pdfmake` + `vfs_fonts` (~830 KB gz) WYŁĄCZNIE po kliknięciu „Pobierz PDF" (`import()` w handlerze), nigdy w `modulepreload`, nigdy w chunku podstrony; przycisk pokazuje stan ładowania kitu (`aria-busy`), błąd → komunikat kitu, nie `alert()`.
6. **Pobieranie, nie druk**: `createPdf(def).download(fileName)` z nazwą deterministyczną `klarow-<dokument>-demo.pdf` (bez daty w nazwie), zero `window.print()`, zero `.print-only`/`.print-area` w CSS (usunięte w cz. 6).
7. **Zdarzenie** `pdf_download` emitowane w `PdfButton` (poza `pdf.ts`), z nazwą dokumentu, bez treści.
8. **Marka**: zero nazwy firmy źródłowej, zero złota, zero logo graficznego w PDF; akcent stal w liniach tabeli (`#A8B4C2`), tekst `#121212` na białym (dokument drukowalny: jasne tło jest tu poprawne, Page Theme Lock dotyczy UI).

#### Mechanizm awarii (dlaczego)

- pdfmake wstawia `CreationDate` z zegara: dwa pobrania tych samych danych dają różne pliki; klient porównujący PDF-y (np. w mailu) widzi „coś się zmieniło", a obietnica „te same dane, ten sam wynik" ma obejmować także dokument.
- Wielostronicowy PDF z dema łamie tabelę i podpisy w losowym miejscu; 1 strona A4 = przewidywalny wydruk, o który prosi persona (protokół, plan płatności).
- Okno druku (`window.print`) było w cz. 5 i zostało zastąpione pobieraniem w cz. 6: na iOS Safari druk strony SPA jest zawodny; PDF pobrany działa wszędzie.
- 830 KB gz w ścieżce krytycznej = 5× cała reszta strony (site-audit §3.1 p.8); lazy przy kliknięciu jest jedynym akceptowalnym miejscem.

#### Niepoprawnie

```ts
const def = { info: { title: "Protokół" }, content: [ { text: `Data: ${new Date().toLocaleDateString()}` }, … ] };   // zegar w treści i metadanych
import pdfMake from "pdfmake/build/pdfmake";           // statyczny import (830 KB w chunku podstrony)
window.print();                                        // okno druku
```

#### Poprawnie

```ts
// src/lib/pdf.ts (kontrakt; szczegóły implementacji w oknie refaktoru)
import type { Lang } from "@/i18n";            // TYLKO typ (wycinany przez --experimental-strip-types)
import { fmtMoney } from "./money.ts";         // cross-import w lib: względny, z jawnym rozszerzeniem

export interface PdfLabels { subject: string; footer: string }         // gotowe stringi PL/EN od wołającego
export interface PdfOptions { lang: Lang; font?: "Roboto"; labels: PdfLabels }
const DOC_DATE = new Date("2026-07-22T00:00:00Z");     // stała: determinizm metadanych

export function pdfDoc(input: PdfInput, opts: PdfOptions): TDocumentDefinitions {
  return {
    pageSize: "A4", pageMargins: [40, 48, 40, 56],
    info: { title: input.title, subject: opts.labels.subject, creator: "Klarow", producer: "Klarow", creationDate: DOC_DATE, modDate: DOC_DATE },
    defaultStyle: { font: opts.font ?? "Roboto", fontSize: 9.5 },
    header: { text: "KLAROW", margin: [40, 20, 40, 0], bold: true, fontSize: 12 },
    content: [ …meta z danych (input.date = TODAY)…, { table: { headerRows: 1, body: rows(input, opts.lang) }, layout: KLAROW_TABLE_LAYOUT } ],
    footer: { text: opts.labels.footer, alignment: "center", fontSize: 8, margin: [40, 16, 40, 0] },
  };
}

// dashboards/PdfButton.tsx — warstwa prezentacji składa teksty (tu `pick` i MESSAGING są na miejscu)
onClick={async () => {
  setBusy(true);
  try {
    const [{ default: pdfMake }, { default: vfs }] = await Promise.all([import("pdfmake/build/pdfmake"), import("pdfmake/build/vfs_fonts")]);
    pdfMake.vfs = vfs.pdfMake?.vfs ?? vfs;
    const labels = { subject: pick(lang, MESSAGING.proofFooter), footer: pick(lang, MESSAGING.pdfFooter) };
    pdfMake.createPdf(pdfDoc(input, { lang, labels })).download(`klarow-${docKey}-demo.pdf`);
    track("pdf_download", { doc: docKey });
  } catch { setError(pick(lang, T.pdfError)); } finally { setBusy(false); }
}}
```

#### Test

```bash
# zegar/losowość w pdf.ts (oczekiwane: 0 poza stałą DOC_DATE)
grep -nE 'new Date\(\)|Date\.now\(|Math\.random' site/src/lib/pdf.ts                # = 0
grep -nE 'creationDate|modDate' site/src/lib/pdf.ts | wc -l                          # ≥ 2 (stałe)
# lazy: pdfmake tylko w import() w PdfButton
grep -rnE '^import .*pdfmake' site/src                                               # = 0
grep -nE 'import\("pdfmake' site/src/components/dashboards/PdfButton.tsx | wc -l     # ≥ 1
grep -nE 'modulepreload[^>]*(pdfmake|vfs_fonts)' site/dist/index.html site/dist/narzedzia/*.html   # = 0
# druk
grep -rnE 'window\.print|\.print-only|\.print-area|@media print' site/src            # = 0
# teksty argumentem, nie importem (demo-golden-tests p.5; oczekiwane: 0 wierszy)
grep -nE 'from "@/' site/src/lib/pdf.ts | grep -vE ':import type '
grep -nE '\bpick\(|MESSAGING' site/src/lib/pdf.ts                                    # = 0
# golden definicji (demo-golden-tests): npm run test (tests/pdf.test.mjs) → identyczny JSON dla 2 przebiegów i zgodny z golden
# ręcznie: pobrać każdy z 5 PDF-ów 2× → `sha256sum` identyczne; 1 strona; „ąćęłńóśźż” poprawne; stopka DEMO; brak nazwy firmy źródłowej (pdftotext | grep -i)
```

#### Wyjątki

- Faza 1: `pdf.ts` refaktoruje inne okno (rozstrzygnięcie nadrzędne 4: `pdf.ts` → `pdfDoc.mjs`); do tego czasu istniejące 5 dokumentów przechodzą tylko testy „zero zegara w treści" i „lazy". Stałe daty w `info`, `labels` w `PdfOptions` i usunięcie `pick`/`MESSAGING` z `pdf.ts` wchodzą razem z tym refaktorem — kontrakt powyżej jest dla niego wiążący.
- Jeśli pdfmake w Node okaże się niestabilny (vfs, fonty), golden bajtów jest pomijany; golden definicji zostaje obowiązkowy.

