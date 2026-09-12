# Sekcje reguł strażnika (prefiks → sekcja → domyślny impact → właściciel)

Plik definicyjny dla `scripts/build-index.mjs`: kolejność wierszy w tabeli = kolejność sekcji
w `AGENTS.md` (spis sekcji + pełna tabela reguł) i w tabeli sekcji `SKILL.md` (1 wiersz = 1 sekcja).
Reguła = jeden plik `rules/<prefiks>-<slug>.md`
z frontmatterem (`id`, `title`, `impact`, `tags`, `source`, `added`) i sekcjami
`## Zasada · ## Mechanizm awarii (dlaczego) · ## Niepoprawnie · ## Poprawnie · ## Test · ## Wyjątki` (ostatnia opcjonalna).
Pliki zaczynające się od `_` są wyłączone z kompilacji.

Skala impact: **BLOCKER** = twarde zasady CLAUDE.md / prawo (nazwa poprzedniej firmy, złoto, sekrety,
determinizm, reduced-motion, `/rodo`, PKE) → blokuje commit i push. **HIGH** = a11y / perf / SEO /
copy z liczbą bez źródła → blokuje nowe pliki, stary dług = ticket. **MEDIUM** = spójność design /
motion → raport. **LOW** = szlif → raport.

Tryb: `marketing` = `site/src` poza `components/dashboards/**`, `DemoReport.tsx`, `lib/**` (domyślny
`data-surface="marketing"`); `tool` = dashboardy, `DemoReport.tsx`, `lib/**`, `demo/**`, `data-surface="tool"`;
`both` = oba.

Testy w regułach są napisane dla Git Bash (`grep -E`, GNU grep 3.x) uruchamianego z korzenia repo;
`rg` (ripgrep 14) przyjmuje te same wzorce, ale w tym środowisku `rg` NIE jest zainstalowany — domyślnie
`grep`. Skrypty wyłącznie przez `node` (nigdy `npx`).

Trzy zasady czytania wyników testów (inaczej awaria narzędzia udaje PASS):
1. **`grep -P` wymaga `LC_ALL=C.UTF-8`** — bez tego GNU grep 3.0 w Git Bash kończy się komunikatem
   `grep: -P supports only unibyte and UTF-8 locales`, **exit 2 i zero wypisanych linii**. Każdy test
   z `-P` (emoji, glify, zakresy `\x{…}`) zaczyna się od `LC_ALL=C.UTF-8`.
2. **„0 trafień" liczy się dopiero razem z kodem wyjścia**: `grep` zwraca 0 = są trafienia, 1 = brak
   trafień (PASS), 2 = błąd narzędzia (zła ścieżka, zły wzorzec, locale). Test, którego wynikiem ma być
   „0 trafień", pisz jako `… || echo OK` i sprawdzaj `$?`; nigdy nie podłączaj `| head`, bo kod wyjścia
   przejmuje wtedy ostatni proces w potoku.
3. **Ścieżka, której nie ma, to NIE SPRAWDZANO, a nie PASS.** Część reguł opisuje stan po fazie 1
   (`site/src/styles/tokens.css`, `site/src/data/messaging.ts`, `site/tests/`, `site/public/media/` i inne).
   Dopóki plik z komendy nie istnieje, `grep` kończy się exit 2 z pustym wyjściem — w raporcie taka
   pozycja ląduje w sekcji „Nie sprawdzano w tej rundzie".

| Prefiks | Sekcja | Domyślny impact | Tryb | Właściciel (agent audytu) |
|---|---|---|---|---|
| `brand` | Marka i przekaz (nazwa poprzedniej firmy, złoto, wordmark, jeden akcent, etykiety dowodu, liczby, „AI") | BLOCKER | both | `brand-leak-auditor` (copy: `copy-auditor`, dist: `seo-auditor`) |
| `design` | Design locks i kit (tokeny, `@theme`, kształt, motyw, CTA, hero, eyebrow, karty, glass, ikony, statusy, overflow, sticky, kontrast, typografia, fill-mode, PDF, light) | MEDIUM | marketing (kit: both) | `ui-auditor` |
| `motion` | Ruch, wideo, tła, reduced-motion, budżet Motion | BLOCKER | both | `motion-auditor` |
| `media` | Assety: obrazy, poster, wideo, zrzuty, budżety plików, metadane | HIGH | marketing | `ui-auditor` |
| `perf` | Budżety wydajności (LCP/CLS/INP, chunki, fonty, transfer, lazy, build target) | HIGH | both | `code-auditor` |
| `code` | React / Vite / TS / git / plan (bez `npx`, `npm run check`, kompozycja, React 19) | MEDIUM | both | `code-auditor` |
| `a11y` | Dostępność (landmarki, dialog, fokus, semantyka, formularze, touch, lang) | HIGH | both | `ui-auditor` |
| `seo` | SEO / prerender / GEO (19 plików HTML = 17 tras w sitemapie + `/rodo` z `noindex` + `404.html`, sitemap i llms generowane, meta, JSON-LD, nagłówki) | HIGH | marketing | `seo-auditor` |
| `i18n` | PL + EN (`{ pl, en }` + `pick()`, kompletność par, limity długości, `lang`) | HIGH | both | `copy-auditor` |
| `copy` | Copy, typografia PL/EN, słowa zakazane, liczby ze źródłem, ton | HIGH | marketing | `copy-auditor` |
| `legal` | RODO (`/rodo`, art. 14, prawo sprzeciwu), PKE (zgody, formularze bez domyślnych zgód, double opt-in) | BLOCKER | marketing | `copy-auditor` + `integration-scanner` |
| `integ` | Integracje zewnętrzne: rejestr, zero CDN, zero API modeli w runtime, CSP, zgody | BLOCKER | both | `integration-scanner` |
| `secret` | Sekrety: `.env`, klucze, tokeny, prompty do narzędzi zewnętrznych | BLOCKER | both | `brand-leak-auditor` + `integration-scanner` |
| `demo` | Determinizm dem i silników (zero `Date.now`/`Math.random`/sieci, golden-testy, grosze, etykieta DEMO) | BLOCKER | tool | `code-auditor` |

Sekcja bez ani jednej reguły nie istnieje: `build-index.mjs` ostrzega o takim wierszu, bo w `AGENTS.md`
znika po cichu. Proces pracy (plan w pliku, kamienie milowe, `npm run check`, commit PL + push `main`,
stan operacyjny) nie ma własnego prefiksu — mieszka w `SKILL.md` §Procedura pracy,
`checklists/definition-of-done.md` §A i `checklists/preflight.md`, a pilnuje go `guardian-orchestrator`.
