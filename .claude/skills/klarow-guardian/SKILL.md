---
name: klarow-guardian
description: Strażnik zasad Klarow (marka, design locks, motion, copy, SEO, integracje, sekrety, determinizm dem, RODO/PKE) dla strony klarow.com, kitu UI, dem i materiałów marketingowych. Use proactively for ANY change in site/**, ui-kit/**, demo/**, docs copy, marketing assets; UI design, motion, copy, SEO, integrations, audit. Ładuj PRZED pierwszą edycją i przed commitem; tryb marketing (site/ poza dashboardami) albo tool (dashboardy i narzędzia). Zawiera reguły z ID, severity i testem mechanicznym (rules/), rejestr dozwolonych liczb, dosłowne locki z design-taste-frontend, checklisty pre-flight i Definition of Done oraz skrypty audytu (node, nigdy npx).
argument-hint: "[zakres: site|ui-kit|demo|all] [tryb: marketing|tool]"
allowed-tools: Bash(node .claude/skills/klarow-guardian/scripts/*), Bash(node node_modules/typescript/bin/tsc *), Bash(node node_modules/vite/bin/vite.js *), Bash(git status *), Bash(git diff *)
---

# klarow-guardian

Jeden skill, który pilnuje, żeby każda zmiana w `site/`, `ui-kit/`, `demo/`, copy i assetach była zgodna
z marką, prawem i decyzjami founderów, i żeby dało się to sprawdzić mechanicznie. Pełnia reguł: `AGENTS.md`
(generowany) i `rules/<prefiks>-<slug>.md`; zasady sekcji: `rules/_sections.md`.

## Tożsamość marki

1. KLAROW buduje narzędzia pod proces klienta dla firm 20–250 osób z produkcji, budownictwa i dystrybucji; pierwszy działający efekt w dni; dane zostają u klienta (on-premise, zero chmury dostawcy).
2. Jedno zdanie marki żyje w `site/src/data/messaging.ts` (H1 = meta = JSON-LD = `llms.txt` = bot = LinkedIn); nie wymyślaj drugiego.
3. Akcent: polerowana stal `#A8B4C2` jako JEDYNY akcent (`--accent`); primary CTA = płaska biel `--cta` na czerni `#121212`; zero złota `#FFA914`, zero neonu, glow, glass.
4. Znak: tekstowy wordmark `KLAROW` (`.brand-word` / `BrandMark`), płaski; zero logo graficznego, zero gradientu w tekście.
5. Ton: founder-led, problem-first, zdania oznajmujące, sentence case; PL kanoniczne + EN przez `{ pl, en }` + `pick()`; zero „AI" w sprzedaży; „kalkulator, nie wróżka".
6. Dowód: 12 dem liczy na żywo na danych fikcyjnych; KSeF = „Własny produkt"; poprzednia firma = „firma produkcyjno-budowlana", nigdy z nazwy; każda liczba publiczna ma źródło w `references/allowed-numbers.md`.
7. Motion: rzeczy się pojawiają, nie wjeżdżają (160 / 240 / 420 / 600 ms, `--ease-out`); wykresy statyczne; reduced-motion i poster zawsze; zero pinowania, scroll-hijack, parallax, marquee.
8. Determinizm: te same dane dają ten sam wynik; zero `Date.now` / `Math.random` / sieci w silnikach i demach; PDF pobierany, nie okno druku.

## Precedencja skilli (od najwyższej)

1. **klarow-guardian** (`rules/*.md`; ten plik).
2. **CLAUDE.md, twarde zasady #1–#7** (strażnik wciela je jako BLOCKER; przy sprzeczności zgłoś founderom, nie wybieraj sam).
3. **motion** (AI Kit `/motion`): API i wydajność Motion; strażnik nadpisuje: `m` z `motion/react-m` zamiast `motion`, `LazyMotion domAnimation strict`, `layout`/`drag` tylko po decyzji o `domMax`, `motion@13.2.0`.
4. **design-taste-frontend**: locki, ban-lista, hero, pre-flight (dosłownie w `references/taste-locks.md`); TYLKO tryb `marketing`.
5. **web-design-guidelines** / **writing-guidelines**: a11y, formularze, prose; kopie lokalne reguł w `references/wig-command.md` i `references/writing-command.md` (zero WebFetch przy audycie), warstwa PL (półpauza, cudzysłowy „ ", zdaniowa, banned words PL) w `writing-command.md` §PL i w regułach `copy-*` / `i18n-*`; pokrycie i nadpisania: `references/audit-checklist.md`.
6. Reszta (`minimalist-ui`, `high-end-visual-design`, `redesign-existing-projects`, `react-best-practices`, `composition-patterns`, `aceternity-ui`, `bklit-ui`, `auto-animate`, `imagegen-frontend-web`, `brandkit`, `react-view-transitions`): wyłącznie inspiracja i wartości liczbowe. Ich kolizje są WYŁĄCZONE: serif w hero, pill CTA, double-bezel, eyebrow-pill nad każdym H2, blur entrances, glass nav, ban lucide, ban 1 px bordera, Instrument Serif, reveal 1100 ms, React 19.3 `<ViewTransition>` w fazie 1.

| Tryb | Ścieżki | Co obowiązuje |
|---|---|---|
| `marketing` | `site/src` poza `components/dashboards/**`, `DemoReport.tsx`, `lib/**`; `data-surface="marketing"` (domyślny) | wszystkie prefiksy, w tym `design-*` z locków taste (hero, eyebrow, rodziny layoutu) |
| `tool` | `components/dashboards/**`, `DemoReport.tsx`, `lib/**`, `demo/**`, `data-surface="tool"` | `brand`, `design` z kitu (tokeny, shape {8, 10, 12, 999}, statusy, overflow, sticky, kontrast, typografia, fill-mode), `motion`, `code`, `a11y`, `demo`, `secret`; BEZ hero / eyebrow / layout-families / taste |

## Procedura pracy

1. **Plan w pliku.** Przed pierwszą edycją utwórz `.claude/work/<zadanie>/plan.md` (sekcje: Cel · Zakres zamrożony · Kroki `[ ]` · Otwarte · Porażki · Wynik). Przepisuj go na kamieniach milowych (build zielony, sekcja gotowa, audyt zaliczony), nie po każdym kroku. Porażki zostają w pliku (`FAIL → fix → PASS`).
2. **Tryb i lektura.** Ustal tryb i przeczytaj pliki z tabeli „sytuacja → co przeczytać". Wpisz do planu ID reguł, które dotykasz.
3. **Praca.** Kod, copy albo asset. Świadomy wyjątek od reguły = komentarz w linii `/* guardian-exempt: <id> <powód> */` i wpis w `Otwarte`.
4. **Skrypty** (zawsze `node`, nigdy `npx`; z korzenia repo):
   - `node .claude/skills/klarow-guardian/scripts/audit-static.mjs [ścieżki] [--changed] [--json <plik.jsonl>] [--baseline <plik>] [--fail-on BLOCKER,HIGH]` (reguły grep-owe → findings; tryb `tool` wykrywany po ścieżce)
   - `node .claude/skills/klarow-guardian/scripts/find-integrations.mjs` (nowe hosty, `<script src>`, `<iframe>`, `fetch(` → tabela vs rejestr integracji)
   - `node .claude/skills/klarow-guardian/scripts/verify-site.mjs [--write-baseline]` (po `cd site && npm run build`: **19 plików HTML na dysku** = 5 tras + 13 podstron narzędzi + `404.html`; **indeksowanych 17** = tyle, ile `<url>` w sitemapie, bo `/rodo` ma `noindex` do przeglądu radcy (po jego zdjęciu 18), a `404.html` sprawdzany jest osobno; sitemap, `llms.txt`, budżety chunków, 1 H1 per plik; `--write-baseline` zapisuje `site/scripts/verify-site.baseline.json` po pierwszym zielonym buildzie v2)
   - `node .claude/skills/klarow-guardian/scripts/check-secrets.mjs` (§13: `.env*`, klucze, tokeny w diffie i w plikach śledzonych przez git — przed każdym commitem)
   - `node .claude/skills/klarow-guardian/scripts/screenshots.mjs` (zrzuty WebKit ze scratchpadu: 390/768/1024/1440/1920 × {normal, reduced-motion, coarse}; nigdy przez `npx`)
   - `node .claude/skills/klarow-guardian/scripts/build-index.mjs [--check]` (po każdej zmianie w `rules/`: `AGENTS.md` + tabela niżej; ostrzega o ID reguł bez pliku i o sekcji bez reguł)
   - Hooki (opcjonalne, jednorazowo): skopiuj `hooks.settings.example.json` do `.claude/settings.json` — `scripts/hook-pre-tool.mjs` blokuje czytanie sekretów i zapis marki poprzedniej firmy, `scripts/hook-post-edit.mjs` audytuje zmieniony plik po edycji.
   - **Testy z sekcji `## Test` opisują stan po fazie 1.** Gdy plik z komendy jeszcze nie istnieje (`tokens.css`, `messaging.ts`, `home.ts`, `contact.ts`, `Hero.tsx`, `Icon.tsx`, `pdfDoc.mjs`, `site/tests/`, `site/public/media/`, `RodoPage.tsx`, `docs/DECISIONS.md`), `grep` kończy się exit 2 z pustym wyjściem: to **NIE SPRAWDZANO**, nie PASS. Zasady czytania wyników (LC_ALL dla `-P`, kody wyjścia): `rules/_sections.md`.
5. **Checklisty.** `checklists/definition-of-done.md` (per typ zmiany: sekcja UI / dashboard / copy / asset / integracja) → `checklists/preflight.md` (przed pushem; kopia w `.claude/work/<zadanie>/`).
6. **Bramka.** `cd site && node node_modules/typescript/bin/tsc --noEmit && npm run build` zielone; `grep -rli nuconic site/dist` = 0; audyt bez BLOCKER i bez nowych HIGH. **Baseline (`baseline/*.jsonl`, opcja `--baseline`) zamraża wyłącznie dług HIGH / MEDIUM / LOW — BLOCKER nie jest tłumiony nigdy**, także gdy wpis siedzi w pliku baseline (`audit-static.mjs` ignoruje takie wpisy i mówi o tym na stderr). Dzień zero nie jest wyjątkiem: 6 znanych BLOCKER-ów (`DemoReport.tsx` `performance.now` ×2, „AI" w `tools.ts` i `toolsSeo.ts` ×4) blokuje push do czasu naprawy w fazie 1.
7. **Zamknięcie.** Commit po polsku ze stopką `Co-Authored-By`, push `main` (wincred; nigdy `--no-verify`), wpis do „Stan operacyjny" w CLAUDE.md (co zrobione, decyzje, co dalej), plan z sekcją Wynik.

| Sytuacja | Co przeczytać najpierw |
|---|---|
| nowa sekcja / zmiana layoutu strony | `references/taste-locks.md` §A–§C, `rules/design-*`, `checklists/definition-of-done.md` §B |
| nowy lub zmieniony dashboard / silnik | `rules/demo-*`, `rules/design-{tokens-only,shape-lock,status-semantics,overflow-rules,sticky-opaque,contrast-aa,pdf-document-pattern}`, DoD §C |
| copy, liczby, etykiety dowodu, FAQ | `references/allowed-numbers.md`, `references/writing-command.md` §PL, `rules/brand-*`, `rules/copy-*`, DoD §D |
| `/rodo`, formularz, zgody, newsletter, outbound | `rules/legal-*` (6), `references/integrations-registry.md`, DoD §D i §F |
| audyt kodu, przegląd przed pushem | `references/audit-checklist.md` (10 kategorii, mapowanie severity), `references/wig-command.md`, `checklists/preflight.md` |
| spór z innym skillem, „czemu tak, a nie inaczej" | `references/decisions-log.md` (decyzje + świadome odstępstwa), `references/taste-locks.md` |
| awaria, która wygląda znajomo | `references/pain-tested.md` (objaw → prawdziwa przyczyna → test) |
| „ten finding był już wcześniej" | `baseline/audit-static-2026-09-12.jsonl` (zamrożony dług HIGH/MEDIUM/LOW z 2026-09-12; BLOCKER nigdy nie jest z niego tłumiony) |
| animacja, wideo, tło | `rules/motion-*`, `references/motion-cheatsheet.md` (gotowe warianty, czasy, easingi), `references/taste-locks.md` §D–§E, DoD §B p.6 |
| nowy asset (obraz, poster, wideo, font) | `rules/media-*`, `checklists/new-asset.md` (bramka 12 pozycji), `references/higgsfield-pipeline.md` (modele, prompty, ffmpeg, budżety), `references/asset-review-log.md` (dziennik przeglądów), DoD §E |
| jedno zdanie marki, zmiana copy w wielu miejscach | `checklists/messaging-sync.md`, `rules/copy-one-liner-single-source`, DoD §D p.1 |
| kontrast pary tokenów, nowy kolor | `references/design-tokens.md` (tabela par z policzonym kontrastem), `rules/a11y-contrast`, `rules/design-tokens-only` |
| przekierowanie, alias, zmiana sluga | `references/redirects-registry.md`, `rules/seo-redirects-registry`, `rules/seo-toolsseo-required-for-new-slug` |
| nowy host, skrypt, embed, analityka | `rules/integ-*`, `rules/secret-*`, DoD §F |
| przed pushem | `checklists/preflight.md` |

## Jak uruchomić audyt

- `/ui-audit [zakres: diff|site|route:/narzedzia|component:Navbar] [--fix] [--baseline]` → workflow **ui-audit**: plan w `.claude/work/<zadanie>/plan.md` → bramki deterministyczne (`audit-static.mjs`, `find-integrations.mjs`, `verify-site.mjs`) → równolegle agenci read-only z `.claude/agents/` (`ui-auditor`, `motion-auditor`, `code-auditor`, `integration-scanner`, `seo-auditor`, `copy-auditor`, `brand-leak-auditor`; scala `guardian-orchestrator`) → raporty `.claude/work/audit/<data>/<agent>.md` + 1 linia per agent w `.claude/work/audit/<data>/INDEX.md` (szablon: `checklists/audit-report-template.md`) → krok „fixer" tylko dla pozycji auto-fixowalnych i tylko po zatwierdzeniu planu → re-audyt dotkniętych reguł.
- Agenci **nigdy nie naprawiają sami**. Każdy nowy host, liczba, etykieta dowodu, slug, zależność, sekret i każda ocena `PLAUSIBLE` = decyzja founderów w tabeli `Otwarte`.
- Format findings (tekst, per plik, bez preambuły): `ścieżka:linia - SEV [ID-reguły] komunikat`, opcjonalnie `→ fix: …`; na końcu `Σ BLOCKER n · HIGH n · MEDIUM n · LOW n`. Równolegle JSONL `{file,line,severity,rule,msg,fix,confidence:CONFIRMED|PLAUSIBLE}` w scratchpadzie (`audit/baseline.jsonl` w repo tylko świadomie).
- Severity: **BLOCKER** = twarde zasady CLAUDE.md / prawo (poprzednia firma, złoto, sekrety, determinizm, reduced-motion, `/rodo`, PKE); **HIGH** = a11y / perf / SEO / copy z liczbą bez źródła; **MEDIUM** = spójność design / motion; **LOW** = szlif. BLOCKER i nowe HIGH blokują push; stary dług = ticket w `Otwarte`.
- W tekście dla founderów: „do naprawy", „obserwacja", „sprawdzone, bez zmian", „nie sprawdzano w tej rundzie"; bez słów wewnętrznych (sub-agent, gate, LLM).

## Quick Reference sekcji

Tabela generowana przez `scripts/build-index.mjs` z `rules/*.md` (kolejność: sekcja → impact → id). Nie edytuj ręcznie.
**Jeden wiersz = jedna sekcja**, z kompletem ID w jednej linii; pełna tabela reguł (ID · impact · tytuł · plik)
i pełne treści są w `AGENTS.md` (te same numery sekcji `§N`). Reguła: `rules/<prefiks>-<slug>.md`, ID = nazwa pliku
bez `.md`; findings zawsze cytują ID, więc każde ID w skryptach ma swój plik (pilnuje tego `build-index.mjs`).

<!-- RULES:START -->
| Prefiks | Sekcja | Reguł | Dominujący impact | ID reguł | Plik |
|---|---|---|---|---|---|
| `brand` | §1 Marka i przekaz | 7 | BLOCKER 7/7 | `brand-allowed-numbers-only` · `brand-honest-labels` · `brand-no-ai-word-in-sales` · `brand-no-gold` · `brand-no-nuconic` · `brand-single-accent-steel` · `brand-wordmark-only` | `rules/brand-*.md` |
| `design` | §2 Design locks i kit | 18 | HIGH 9/18 | `design-animation-fill-backwards` · `design-contrast-aa` · `design-hero-discipline` · `design-no-glass-no-blur` · `design-one-cta-per-screen` · `design-overflow-rules` · `design-status-semantics` · `design-sticky-opaque` · `design-tokens-only` · `design-eyebrow-cap` · `design-icons-lucide-one-family` · `design-light-ready-tokens` · `design-no-three-equal-cards` · `design-page-theme-lock` · `design-pdf-document-pattern` · `design-shape-lock` · `design-theme-inline-zeroed` · `design-typography-scale` | `rules/design-*.md` |
| `motion` | §3 Ruch, wideo, tła, reduced-motion, budżet Motion | 17 | HIGH 7/17 | `motion-charts-static` · `motion-no-initial-hidden-above-fold` · `motion-no-pinning-no-scroll-hijack` · `motion-reduced-motion-three-layers` · `motion-bundle-budget-motion` · `motion-cleanup-required` · `motion-gpu-props-only` · `motion-no-motion-in-prerender` · `motion-no-transition-all-no-linear` · `motion-one-library-lazymotion` · `motion-view-transition-rules` · `motion-counters-pattern` · `motion-hover-fallback` · `motion-motivated` · `motion-tier-flag` · `motion-tokens-only` · `motion-stagger-caps` | `rules/motion-*.md` |
| `media` | §4 Assety: obrazy, poster, wideo, zrzuty, budżety plików, metadane | 9 | BLOCKER 4/9 | `media-higgsfield-inputs-policy` · `media-one-autoplay-per-route` · `media-video-gating` · `media-video-placement` · `media-asset-review-gate` · `media-headers-versioning` · `media-video-budgets` · `media-video-embed-spec` · `media-poster-first-frame` | `rules/media-*.md` |
| `perf` | §5 Budżety wydajności | 10 | HIGH 8/10 | `perf-no-webgl-on-coarse` · `perf-build-target` · `perf-chunk-size-gate` · `perf-code-split-dashboards` · `perf-fonts-budget` · `perf-images-policy` · `perf-js-budget-home` · `perf-lcp-poster-preload` · `perf-three-js-policy` · `perf-no-zoom-root` | `rules/perf-*.md` |
| `code` | §6 React / Vite / TS / git / plan | 17 | HIGH 9/17 | `code-lint-and-tests-gate` · `code-build-target-policy` · `code-contact-single-source` · `code-effects-hygiene` · `code-lazy-routes-and-dashboards` · `code-no-arbitrary-tailwind-values` · `code-no-inline-style-colors` · `code-no-runtime-errors` · `code-single-source-copy` · `code-tosorted-safari13` · `code-file-size-cap` · `code-memo-policy` · `code-no-dead-code` · `code-no-forwardref-react19` · `code-state-in-url` · `code-use-not-usecontext` · `code-no-barrel-imports` | `rules/code-*.md` |
| `a11y` | §7 Dostępność | 15 | HIGH 11/15 | `a11y-reduced-motion-media-query` · `a11y-contrast` · `a11y-controls-native` · `a11y-dialog-semantics` · `a11y-focus-visible-everywhere` · `a11y-form-labels-errors` · `a11y-headings-order-one-h1` · `a11y-images-alt-svg-role` · `a11y-inert-hidden-menus` · `a11y-lang` · `a11y-main-and-skip-link` · `a11y-safe-area-dvh` · `a11y-faq-aria-controls` · `a11y-touch-targets-44` · `a11y-no-title-tooltips` | `rules/a11y-*.md` |
| `seo` | §8 SEO / prerender / GEO | 12 | HIGH 5/12 | `seo-links-in-dom` · `seo-prerender-must-keep` · `seo-redirects-registry` · `seo-sitemap-llms-generated` · `seo-404-noindex-real-404` · `seo-canonical-og-twitter` · `seo-jsonld-per-kind` · `seo-pageseo-single-source` · `seo-toolsseo-required-for-new-slug` · `seo-gsc-and-analytics` · `seo-hreflang-deferred` · `seo-lastmod-from-git-not-now` | `rules/seo-*.md` |
| `i18n` | §9 PL + EN | 4 | HIGH 3/4 | `i18n-lang-before-paint` · `i18n-pl-en-pair-required` · `i18n-pl-typography` · `i18n-sentence-case-headings` | `rules/i18n-*.md` |
| `copy` | §10 Copy, typografia PL/EN, słowa zakazane, liczby ze źródłem, ton | 10 | HIGH 7/10 | `copy-banned-claims` · `copy-numbers-with-source` · `copy-cta-labels` · `copy-excel-as-symptom-not-identity` · `copy-faq-single-source` · `copy-honest-time-claims` · `copy-minimal-text` · `copy-one-liner-single-source` · `copy-persona-outcomes-section` · `copy-voice-and-tone` | `rules/copy-*.md` |
| `legal` | §11 RODO | 6 | BLOCKER 3/6 | `legal-no-scraped-personal-data-in-repo` · `legal-pke-consent-forms` · `legal-rodo-page-required` · `legal-analytics-cookieless-or-consent` · `legal-privacy-before-embeds` · `legal-sources-for-market-numbers` | `rules/legal-*.md` |
| `integ` | §12 Integracje zewnętrzne: rejestr, zero CDN, zero API modeli w runtime, CSP, zgody | 8 | BLOCKER 4/8 | `integ-no-external-scripts-on-site` · `integ-no-llm-api-in-client-tools` · `integ-registry-required` · `integ-telegram-anthropic-only-in-bots` · `integ-data-egress-review` · `integ-dependency-audit` · `integ-embed-requires-privacy` · `integ-mcp-allowlist` | `rules/integ-*.md` |
| `secret` | §13 Sekrety: `.env`, klucze, tokeny, prompty do narzędzi zewnętrznych | 5 | BLOCKER 5/5 | `secret-git-history-scan-before-public` · `secret-never-read-env` · `secret-no-secrets-in-prompts-or-logs` · `secret-rotate-on-exposure` · `secret-secrets-outside-git` | `rules/secret-*.md` |
| `demo` | §14 Determinizm dem i silników | 6 | HIGH 4/6 | `demo-determinism` · `demo-golden-tests` · `demo-events-outside-engines` · `demo-labels` · `demo-money-integers` · `demo-pdf-deterministic` | `rules/demo-*.md` |
<!-- RULES:END -->

## Mantra

1. Zero nazwy poprzedniej firmy, zero złota, wordmark tekstowy, stal jedynym akcentem.
2. Jedno zdanie z `messaging.ts`; każda liczba z `references/allowed-numbers.md`; zero „AI" w sprzedaży; PL + EN.
3. Tokeny są prawem; jeden biały CTA na ekran; hero ≤ 4 elementy; linie zamiast boxów.
4. Ruch motywowany, reduced-motion i poster zawsze, wykresy statyczne, determinizm dem, `/rodo` przed pierwszym kontaktem.
5. tsc + build + 19 plików HTML (17 w sitemapie, `/rodo` noindex, `404.html` osobno) + audyt bez BLOCKER → plan zamknięty → commit PL → push `main` → stan zapisany.
