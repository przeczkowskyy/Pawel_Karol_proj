# Sprawdzone bólem

> Rejestr **append-only**: awarie, które kosztowały nas godziny, wraz z **prawdziwą** przyczyną (nie pierwszą
> hipotezą) i testem, który wykryje nawrót. Wpisów się nie edytuje ani nie kasuje: błędna diagnoza zostaje
> w pliku jako ostrzeżenie, a sprostowanie dopisujemy jako nowy akapit „Sprostowanie" albo nowy wpis z datą.
> To ta sama zasada, co „zostaw błędy w kontekście": `FAIL → fix → PASS` nigdy nie jest nadpisywane.
>
> Format wpisu: **data · objaw · prawdziwa przyczyna · naprawa · test**.
> Nowy wpis dopisujemy na końcu (chronologicznie), a jeśli awaria ma regułę — linkujemy `rules/<id>.md`.
> Krótkie wersje tych nauczek żyją w `CLAUDE.md` („nauczki środowiskowe"); pełne mechanizmy tutaj.

---

## 1. 2026-07-22 → 2026-07-26 · iPhone pokazywał „samo tło"

- **Objaw:** na telefonie Karola `klarow.com` renderowała wyłącznie tło; treść nie pojawiała się wcale.
  Z otwartą inspekcją (DevTools) strona działała. Na desktopie i w Playwright/WebKit na Windows: zawsze OK.
- **Ścieżka błędnych hipotez (zostaje w rejestrze jako przestroga):** (a) stary `index.html` z cache
  wołający purge'owane assety, (b) składnia nowego WebKita (oklch, `color-mix`, `@layer`, `@property`)
  niewspierana przez stare Safari, (c) brak WebGL (Lockdown Mode, wyczerpany limit kontekstów) wywalający
  React bez error boundary, (d) **kompozytor GPU iOS Safari malujący pełnoekranowy `position: fixed` canvas
  WebGL NAD rodzeństwem `fixed`**. Hipoteza (d) brzmiała najmocniej i doprowadziła do wyłączenia canvasu
  na `pointer: coarse` — ale **była błędna**.
- **Prawdziwa przyczyna (2026-07-26, po zrzucie z `?debug=1`):** `.content-layer` miał `z-index: 10`, więc
  był **kontekstem stackingu**; pod `overflow: hidden` iOS nie malował uwięzionych w nim elementów
  `position: fixed`. Dowód kierunkowy: panel `?debug=1` (też `fixed`, ale **poza** wrapperem) malował się
  poprawnie. Problem był w drzewie stackingu, nie w WebGL i nie w cache.
- **Naprawa:** `.content-layer` bez `z-index`, `.bg-layer` z `z-index: -1`; żaden wrapper treści nie tworzy
  kontekstu stackingu; `position: fixed` wyłącznie dla navbara i tła. Wyłączenie canvasu na `pointer: coarse`
  zostało (oszczędza baterię i GPU), ale **nie było lekiem** — i tak trzeba było naprawić stacking.
- **Test:** `rules/media-video-placement.md` i `rules/perf-no-webgl-on-coarse.md`; mechanicznie:
  `grep -nE "z-index" site/src/styles/globals.css` — `.content-layer` bez `z-index`, `.bg-layer` = `-1`;
  `grep -rn "position: fixed\|fixed inset-0" site/src` — tylko navbar i `.bg-layer`;
  weryfikacja wizualna na realnym iPhonie po każdej zmianie warstw (WebKit na Windows tego nie odtworzy).

---

## 2. 2026-07-22 · `npx` nie działa w tym repo (znak `&` w ścieżce)

- **Objaw:** `npx tsc --noEmit`, `npx vite build`, a także `npm run build` wołający binarkę z
  `node_modules/.bin`, kończyły się błędem w rodzaju `'Pawe' is not recognized as an internal or external command`.
- **Prawdziwa przyczyna:** katalog projektu nazywa się `Karol & Paweł app`. Shimy `cmd` z `node_modules/.bin`
  nie cytują ścieżki, więc `&` rozdziela polecenie, a powłoka próbuje uruchomić `Pawe` jako osobną komendę.
  To nie jest problem npm, Node ani uprawnień: to cytowanie w shimie `.cmd`.
- **Naprawa:** binarki wołamy przez `node` wprost:
  `node node_modules/typescript/bin/tsc --noEmit`, `node node_modules/vite/bin/vite.js build`.
  `site/package.json` ma tak zapisane skrypty (działa lokalnie i na CI Cloudflare Pages). Skrypty strażnika
  uruchamiamy zawsze jako `node ".claude/skills/klarow-guardian/scripts/<plik>.mjs"` (ścieżka w cudzysłowie).
- **Test:** szukamy WYWOŁAŃ `npx`, nie wzmianek (dokumenty strażnika z definicji piszą „zawsze `node`,
  nigdy `npx`", a sekcje `## Niepoprawnie` cytują złe komendy — grep po samym słowie daje dziś 48 trafień
  i nigdy nie przejdzie):
  ```bash
  # 1. npm-skrypty: zero npx i zero binarek z node_modules/.bin  (exit 1 = PASS)
  grep -nE '"[^"]*(npx |node_modules/\.bin)' site/package.json || echo OK
  # 2. pliki wykonywalne: npx jako komenda (po początku linii albo ; & | ( ) — 0 trafień
  grep -rnE "(^|[;&|(])[[:space:]]*npx [a-z@]" site/package.json site/scripts/*.mjs \
      .claude/skills/klarow-guardian/scripts/*.mjs .claude/workflows/*.js || echo OK
  ```
  W `checklists/preflight.md` i w regułach polecenia są w wersji `node` (weryfikacja wzrokowa, nie grep).

---

## 3. 2026-07-22 · `git push` wisiał bez końca

- **Objaw:** `git push` nie kończył się i nie wypisywał nic; bez timeoutu, bez pytania o hasło.
- **Prawdziwa przyczyna:** Git Credential Manager otwierał **niewidoczne okno OAuth** (sesja nieinteraktywna),
  na które nikt nie mógł odpowiedzieć; push czekał na zakończenie procesu pomocniczego.
- **Naprawa:** per-repo `credential.helper=wincred` — poświadczenia czytane z Menedżera poświadczeń Windows
  (wpis `git:https://github.com`, token PAT). Gdy push zwróci 401/403: PAT wygasł — odnowić wpis
  w Menedżerze poświadczeń albo tymczasowo `git config --unset credential.helper` (wróci GCM z oknem logowania).
- **Test:** `git config --get credential.helper` = `wincred`; push w sesji agenta zawsze z limitem czasu
  (nie zostawiać wiszącego procesu); `secret-secrets-outside-git` — PAT nigdy w repo, nigdy w logu.

---

## 4. 2026-07-23 · Prerender psuł HTML przez sekwencje `$` w treści

- **Objaw:** build zielony, `dist/**/*.html` uszkodzone: fragmenty treści znikały albo dublowały się.
  Odtwarzalne na tekście zawierającym `$'000` (kwoty w narzędziu rozliczeń USD).
- **Prawdziwa przyczyna:** `String.prototype.replace` z **replacementem jako stringiem** interpretuje sekwencje
  `$&`, `$'`, `` $` ``, `$1`. Treść pochodząca z `data/*.ts` trafiała do `replace(…, head)` i była
  przepisywana według tych wzorców. Silnik nie zgłasza błędu: po prostu wstawia co innego.
- **Naprawa:** w `site/scripts/prerender.mjs` **każdy** replacement jest funkcją: `html.replace(/<\/head>/, () => head)`.
  Dodatkowo twardy assert na pusty `<div id="root"></div>` w szablonie i jedno `id="seo-jsonld"` na plik.
- **Test:** `rules/seo-prerender-must-keep.md`; mechanicznie:
  `grep -nE "\.replace\([^)]*,\s*[^(=]*\)" site/scripts/prerender.mjs | grep -vE "=> "` = 0;
  po buildzie `grep -c "id=\"seo-jsonld\"" <każdy html>` = 1 oraz `grep -c "<main" <każdy html>` = 1.

---

## 5. 2026-07-22 (wprowadzone) → 2026-09-12 (rozpoznane jako dług) · `zoom` na `:root` psuje pomiary geometrii

- **Objaw:** rozjazd między tym, co widać na laptopie founderów (≥ 1500 px, gdzie działa `zoom: 1.08`/`1.18`),
  a pomiarami z CI i z Lighthouse; Gantt (`TaskTimeline.tsx:151`, `clientWidth`) i przyszłe komponenty
  z `IntersectionObserver` liczą offsety inaczej na różnych silnikach.
- **Prawdziwa przyczyna:** `zoom` zmienia geometrię widzianą przez `getBoundingClientRect`, `clientWidth`,
  `IntersectionObserver` i zdarzenia wskaźnika, a każda przeglądarka robi to inaczej (Chrome ujednolicił
  „standardized zoom" dopiero w 128; Safari i Firefox liczą po swojemu). Podwójne skalowanie (zoom + `clamp()`)
  daje na 4K elementy większe, niż zakłada projekt. To nie jest „drobny szlif": to niestabilna podstawa pomiarów.
- **Naprawa:** `zoom` znika z `globals.css`; skalowanie na dużych ekranach realizują tokeny
  (`--container`, `--gutter`, `--text-*` w `clamp()`), a jeśli trzeba, `@media (min-width: 1900px)`.
  Usunięcie wymaga retestu 12 dashboardów na 1920 i 2560 px (zaplanowane na fazę 0).
- **Test:** `rules/perf-no-zoom-root.md`; mechanicznie `grep -rn "zoom" site/src/styles site/src` = 0
  (poza `@media print`); pomiary w komponentach tylko w `useEffect`/rAF, nigdy w renderze.

---

## 6. 2026-07-24 · Mit: „`cssTarget: safari13` transpiluje nowoczesny CSS"

- **Objaw:** sesja cz. 6 uznała, że ustawienie `build.target ["es2019","safari13"]` i `cssTarget ["safari13"]`
  w `vite.config.ts` załatwia zgodność ze starszym Safari, i na tej podstawie zamknęła wątek „mobile".
- **Prawdziwa przyczyna:** Vite domyślnie minifikuje CSS **esbuildem**, nie Lightning CSS. `cssTarget`
  wpływa na to, co esbuild potrafi obniżyć (np. `oklch()` → `rgb()` przy prostych wartościach), ale
  `@property` (57 wystąpień z Tailwinda v4), `@layer`, `color-mix()` i `backdrop-filter` **zostają
  w zbudowanym CSS**. Na iOS 26 (telefon Karola) to nieszkodliwe, bo te funkcje działają — ale to
  **nie jest** transpilacja pod stare Safari i nie wolno na niej opierać obietnicy zgodności.
- **Naprawa:** komentarze w `vite.config.ts` mówią prawdę o zakresie działania `cssTarget`; zgodność
  utrzymujemy dyscypliną autorską (hex i tokeny alfa zamiast `color-mix`, longhandy zamiast `inset`,
  brak `toSorted`/`at`/`structuredClone`), nie zaufaniem do narzędzia. Podniesienie targetu to decyzja D-19.
- **Test:** `rules/code-build-target-policy.md`, `rules/perf-build-target.md`, `rules/code-tosorted-safari13.md`;
  mechanicznie po buildzie: `grep -c "@property" site/dist/assets/*.css` (świadomość liczby, nie zero),
  `grep -c "color-mix\|oklch(" site/dist/assets/*.css` = 0.

---

## 7. 2026-07-22 · Stary `index.html` z cache telefonu wołał nieistniejące assety

- **Objaw:** na telefonie strona nie startowała (biała albo samo tło), na desktopie i w DevTools działała.
  Kluczowy dowód od Karola: **z otwartą inspekcją działa** — DevTools domyślnie wyłącza cache.
- **Prawdziwa przyczyna:** przeglądarka trzymała stary `index.html` odwołujący się do plików
  `assets/*.js` z poprzednim hashem. Te pliki zostały usunięte przy deployu, a SPA-fallback
  (`public/_redirects`) oddawał na nie **HTML zamiast 404**, więc `<script>` dostawał stronę HTML
  i padał bez żadnego czytelnego błędu.
- **Naprawa:** dwie warstwy — (1) `site/public/_headers`: HTML `no-cache`, `/assets/*` i `/fonts/*`
  `immutable` (hash w nazwie); (2) inline skrypt samonaprawy w `index.html`: przy błędzie ładowania
  `script`/`link` jednorazowy `location.reload()` z wartownikiem w `sessionStorage` (leczy urządzenia
  zatrute przed wdrożeniem nagłówków). Zasada ogólna: **deploy weryfikujemy po treści, nie po hashu** —
  Cloudflare Pages buduje własne hashe, więc szukamy markera w `index.html` i w CSS.
- **Test:** `rules/media-headers-versioning.md`, `rules/seo-404-noindex-real-404.md`; mechanicznie:
  `grep -n "no-cache" site/public/_headers` i `grep -n "immutable" site/public/_headers`;
  po deployu `curl -s https://klarow.com/ | grep -o "<marker zmiany>"`.

---

## 8. 2026-09-11 · pdfmake w Node: `Roboto-Bold.ttf` nie istnieje w paczce

- **Objaw:** próba wygenerowania PDF poza przeglądarką (generator listów i one-pagerów) kończyła się
  wyjątkiem przy rejestracji fontów; w przeglądarce ten sam dokument działał.
- **Prawdziwa przyczyna:** paczka pdfmake 0.3.x **nie zawiera** pliku `Roboto-Bold.ttf` — dostarcza
  `Roboto-Regular.ttf`, `Roboto-Medium.ttf`, `Roboto-Italic.ttf`, `Roboto-MediumItalic.ttf`. Rejestracja
  nieistniejącego pliku rzuca wyjątek. Dodatkowo w Node `defaultStyle` **musi** mieć jawne `font: "Roboto"`:
  nie ma domyślnej rodziny (w przeglądarce VFS ustawia ją za nas).
- **Naprawa:** mapowanie `bold` → `Roboto-Medium.ttf`, `bolditalics` → `Roboto-MediumItalic.ttf`;
  `PdfDoc.font` domyślnie `"Roboto"`. Zweryfikowane na żywo: 15 957 bajtów, `zażółć gęślą jaźń ĄĆĘŁŃÓŚŹŻ`
  renderuje się poprawnie, listy punktowane działają. Zmiana kroju w PDF wymaga **trzech statycznych TTF**
  (Regular 400 + Bold 700 + Italic 400; kursywa jest używana w bloku `quote`); pdfmake nie czyta WOFF2
  ani fontów variable, a brak zarejestrowanego stylu = wyjątek przy generowaniu.
- **Test:** `rules/design-pdf-document-pattern.md`, `rules/demo-pdf-deterministic.md`; mechanicznie:
  `node -e "require('fs').accessSync('site/node_modules/pdfmake/build/vfs_fonts.js')"` oraz golden-test
  generatora (dwa przebiegi = identyczne bajty); przy zmianie kroju: sprawdzić obecność trzech plików TTF
  przed podmianą rejestracji.
