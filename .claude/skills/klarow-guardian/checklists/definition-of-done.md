# Definition of Done per typ zmiany

> Wybierz sekcję dla typu zmiany, skopiuj do `.claude/work/<zadanie>/plan.md` jako kroki `[ ]`. Wspólny
> fundament dla każdego typu: **A. Zawsze**. Potem `checklists/preflight.md` przed pushem. Tryb (`marketing`
> / `tool`) ustal na starcie: sekcje UI = marketing; dashboard i silnik = tool; copy, asset, integracja = both.

## A. Zawsze (każdy typ)

1. `.claude/work/<zadanie>/plan.md` istnieje przed pierwszą edycją (Cel · Zakres zamrożony · Kroki · Otwarte · Porażki · Wynik); przepisany na kamieniach milowych, nie po każdym kroku.
2. Tryb i lista reguł do zastosowania wpisane w planie (ID z tabeli sekcji w `SKILL.md`; pełne treści w `AGENTS.md`).
3. `tsc --noEmit` + `npm run build` zielone; `audit-static.mjs` 0 BLOCKER i 0 nowych HIGH; `build-index.mjs --check` OK, gdy dotknięto `rules/`.
4. Zero nazwy poprzedniej firmy, zero złota, zero sekretów w diffie (`git diff --cached`).
5. PL + EN w każdym nowym stringu (`{ pl, en }` + `pick()`).
6. Commit po polsku + `Co-Authored-By`, push `main`, wpis w „Stan operacyjny", plan zamknięty.

## B. Sekcja UI (home, hub, oferta, faq, rodo, otoczka podstron; tryb marketing)

1. Sekcja ma jedną rodzinę layoutu różną od sąsiadów (lista rodzin trasy w planie: image-canvas / gapless bento / ramy z offsetem / 2×2 hairline / pas metryk / rząd kroków / side-image 60/40 / caption + portrety / mini closing).
2. Copy z modułu danych (`data/home.ts`, `messaging.ts`), nie inline w JSX; nagłówek ≤ 6 słów i ≤ 2 linie, lead ≤ 20 słów, karta = ikona + 2–6 słów + 1 linia ≤ 12 słów; 0 eyebrow na home.
3. Wyłącznie tokeny (`design-tokens-only`), radius {0, 8, 999}, hairline zamiast kart, brak cieni, brak glass/blur/glow, jeden akcent (stal), ≤ 1 primary CTA.
4. Ikony lucide z mapy rozmiarów {16, 20, 24, 32}, `strokeWidth` 1.5 (16 px: 1.75), `aria-hidden`; 0 emoji.
5. Każdy obraz: realny asset (zrzut dema / poster) z `width/height`, `alt`, `loading="lazy"` poniżej folda, ≤ 120 KB WebP; sekcja bez assetu nie powstaje.
6. Motion: `Reveal`/`RevealGroup` tylko poniżej folda, `initial={false}` na treści z shellu, motywacja w 1 zdaniu w tabeli planu; reduced-motion sprawdzone w DevTools.
7. Shell prerenderu (`entry.tsx`) renderuje sekcję z tych samych danych (diff shell vs DOM = 0); liczba HTML bez zmian (19 plików = 17 tras w sitemapie + `/rodo` z `noindex` + `404.html` poza nią) albo nowa trasa dodana do `prerenderAll()` + nav/stopka + sitemap automatycznie.
8. Liczby w sekcji: wszystkie w `references/allowed-numbers.md` (status OK); zero kwot.
9. Zrzuty 390 / 768 / 1440 × {normal, reduced-motion, coarse}; `scrollWidth <= innerWidth` na 390; kontrast AA par tekst/tło; Lighthouse a11y ≥ 95 na trasie.
10. Sekcja „Co osiągniesz" i pasek liczb: zero liczb bez źródła, zero „AI", zero „u klientów".

## C. Dashboard / silnik (`components/dashboards/**`, `lib/**`, `DemoReport.tsx`; tryb tool)

1. Silnik w `lib/<name>.ts` (czysta funkcja, grosze/centy integer, `fmtMoney` jeden helper); komponent tylko renderuje.
2. Determinizm: zero `Date.now` / `Math.random` / `fetch` / `localStorage` / `performance.now` w logice (wyjątek tylko z `determ-exempt` + powód); „Dziś" = stała; ID seedowane.
3. Golden-test `node --test site/tests/<name>.test.mjs`: dwa przebiegi na danych przykładowych = identyczny JSON; test dołączony w tym samym commicie.
4. Dane przykładowe w `data/*.ts`, etykieta „Demo na danych przykładowych" + zdanie „te same dane dają ten sam wynik" widoczne w UI.
5. Kit: tokeny, radius {8, 10, 12, 999}, statusy = kolor + ikona + tekst z `statusMeta`, `tnum nowrap` na kwotach, `min-w-0` w gridach, tabela w `.table-wrapper` (sticky opaque), KPI `clamp`.
6. Wykresy statyczne: instant render, fade ≤ 400 ms panelu, `isAnimationActive={false}` (jeśli biblioteka), bez `key` od danych, kropki informacyjne, linia 1,5–2 px `--accent`, SVG `role="img"` + `aria-label` z danymi, kolory tylko tokenami.
7. Osadzenie przez `DashboardMount` (natywny `IntersectionObserver` + `React.lazy` z literalną ścieżką + skeleton z `minHeight`); chunk podstrony ≤ +60 KB gz; `motion/*` niewymagane do montażu.
8. Dokument wyjściowy (jeśli jest): `PdfButton` przez istniejące API `downloadPdf` (w fazie 1 bez zmian w `pdf.ts`/`PdfButton.tsx`); PDF bez daty, 1 strona A4, polskie znaki sprawdzone ręcznie.
9. A11y: fokus widoczny, `<button>`/`<a>` semantycznie, `aria-live="polite"` dla komunikatów asynchronicznych, cele dotyku ≥ 44 px, tabela data-dense scrolluje w swoim wrapperze (nie strona).
10. Podstrona narzędzia: dashboard-first pod H1, pasek akcji („Odtwórz · Załaduj przykład · Pobierz PDF"), sekcja „Jak to liczymy" `id="sciezka"`, 4 Q&A z `toolsSeo.ts` w DOM, etykieta dowodu z `proofLabels`.

## D. Copy (messaging, data/*.ts, toolsSeo, faq, rodo, llms, posty; tryb both)

1. Jedno zdanie marki: zmiana `messaging.ts` = w tym samym PR `pagesSeo`, `ORG_JSONLD`, `llms.txt`, `index.html` fallback, prompt bota `post-bot/worker.js`, checklista LinkedIn (diff = 0).
2. Każda liczba w `references/allowed-numbers.md` (status OK), liczby rynkowe ze źródłem w zdaniu; zero kwot; zero Deloitte/IDC; zero „oszczędzimy etat".
3. Zero „AI"/nazw dostawców w sprzedaży; zero „u klientów"; etykiety dowodu z `proofLabels`; „Excel" tylko jako symptom/hak; „zero chmury dostawcy".
4. Typografia: 0 „—"; „–" tylko w zakresach liczbowych; „…" nie „..."; cudzysłowy „ " (PL) / “ ” (EN); twarde spacje po jednoliterowych spójnikach i w `10 MB`; sentence case; zero „!" w komunikatach; zero pytań retorycznych w nagłówkach; zero słów z `bannedWords`.
5. Limity: `title` ≤ 60 (strony) / ≤ 62 (narzędzia), `description` 130–165 zn., PL i EN; hero lead ≤ 20 słów; nagłówek sekcji ≤ 6 słów; cytat ≤ 3 linie.
6. FAQ: odpowiedź samowystarczalna (cytowalna przez LLM), zawsze w DOM, pokrycie w `FAQPage` JSON-LD; nowa para Q&A w obu językach.
7. `/rodo`: katalog art. 14 ust. 1–2 kompletny, źródła danych konkretne, prawo sprzeciwu w osobnym, wyróżnionym bloku, `mailto:` sprzeciwu, adres UODO; szkielet od CC → przegląd radcy (D-21) odnotowany w planie.
8. Outbound/posty: zgodne ze stroną (to samo zdanie, te same liczby), zgodne z PKE (zgoda przed informacją handlową; link do `klarow.com/rodo` w każdym szablonie).
9. Przeczytane na głos w obu językach (copy self-audit); szablon PL nie jest kalką EN.

## E. Asset (obraz, poster, wideo, zrzut, OG, font; tryb marketing)

1. Pochodzenie i licencja wpisane w `site/public/media/SOURCES.md` (generator + prompt bez danych firm i twarzy / Playwright / własne zdjęcie z zgodą); zero stocku, zero picsum/unsplash.
2. Nazwa z wersją (`hero-v1.poster.webp`, `tools/raport-zarzadczy-v1.webp`), bo `public/` nie dostaje hasha; `_headers` immutable dla `/media/*`.
3. Budżety: poster ≤ 60 KB (1920×820, pierwsza = ostatnia klatka pętli), wideo ≤ 1,5 MB per format (webm vp9 + mp4 avc1, 8–10 s, ≤ 30 fps), zrzut dema ≤ 120 KB (1280×800 WebP q80), miniatura ≤ 40 KB, OG 1200×630 ≤ 200 KB, font ≤ 100 KB łącznie.
4. Metadane usunięte (brak promptu, nazwy projektu, nazwy poprzedniej firmy w EXIF/XMP: `grep -a -i nuconic plik` → 0); zero tekstu, logo i liczb w kadrze wideo/posteru; zero twarzy z generatora.
5. Osadzenie: `<img width height alt loading fetchpriority>`; `<video muted playsInline loop poster preload="metadata" aria-hidden>` tylko przez `HeroMedia` w `MediaBoundary`, tylko `pointer: fine`, reduced-motion/saveData/LPM → poster; brak `<video>` w shellu.
6. Kontrast tekstu na najjaśniejszej klatce ≥ 4,5:1 (overlay); test na iPhonie po deployu dla hero.
7. Jedno ruchome tło na trasę (wideo albo GLSL Hills, nigdy oba); `MEDIA_ENABLED` jako jedyny kill-switch.
8. Font: self-hosted `woff2`, `unicode-range` latin + latin-ext, `font-display: swap`, preload latin, ten sam krój w PDF dopiero po decyzji D-06.

## F. Integracja zewnętrzna (host, skrypt, embed, API, analityka; tryb both)

1. Wpis w rejestrze integracji (`references/integrations-registry.md`, właściciel: `integration-scanner`): nazwa · typ (build-time / runtime self-hosted / runtime zewnętrzne / poza `site/`) · gdzie w kodzie · jakie dane wychodzą z przeglądarki użytkownika · zgoda/polityka · data decyzji founderów (`docs/DECISIONS.md`).
2. `node .claude/skills/klarow-guardian/scripts/find-integrations.mjs` → nowy host wykryty i zgodny z rejestrem; zero CDN (fonty, skrypty, obrazy self-hosted); zero wywołań API modeli językowych w runtime strony i dem („zero chmury dostawcy").
3. Runtime zewnętrzne (analityka, embed Cal.com, formularz) = wpis na `/rodo` (odbiorcy danych) przed włączeniem; cookies = baner; CF Web Analytics cookieless = bez banera; zdarzenia poza silnikami dem.
4. Embed = CSP w `_headers` z dokładną listą hostów (`script-src`, `frame-src`, `connect-src`); test w WebKit, że CSP niczego innego nie blokuje.
5. Sekrety: tylko w Cloudflare (`wrangler secret`) albo Menedżerze poświadczeń; nigdy w repo, `wrangler.toml`, promptach, zrzutach; `git ls-files` bez `.env`.
6. Ładowanie po `load`/idle (`requestIdleCallback` z fallbackiem), `defer`, brak wpływu na LCP; budżety `verify-site.mjs` bez regresji.
7. Awaria integracji = strona działa (boundary / fallback `mailto:`/`tel:`); test z zablokowanym hostem (DevTools „Block request URL").
8. Narzędzia zewnętrzne użyte do budowy (Higgsfield, Manus, MCP) nie dostają danych klientów, materiałów poprzedniej firmy, sekretów ani twarzy; generacje usunięte po sprincie.
