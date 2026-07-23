# Prompt wprowadzający — sesja: SEO + GEO + naprawa widoku mobilnego

> **Jak używać.** Wklej całość poniżej linii `— — —` do **nowego okna Claude Code**
> otwartego w katalogu repo Klarow. Sesja implementacyjna.

— — —

# 1. Kontekst i Twoja rola

Pracujesz nad stroną **klarow.com** (repo `site/`, Vite + React 19 + TS, deck 7 slajdów,
12 działających narzędzi-dashboardów na podstronach `/narzedzia/:slug`). Jestem Karol,
współzałożyciel. Zachowuj się jak inżynier-współzałożyciel: kwestionuj słabe pomysły.

**Najpierw przeczytaj:** `CLAUDE.md` (twarde zasady + „Stan operacyjny" — sesje cz. 1–6
z 2026-07-22 opisują wszystko, co już zrobione) oraz `ui-kit/skills/company-ui/SKILL.md`.

# 2. Trzy cele tej sesji

## A. Mobile — strona na moim iPhonie to wciąż „samo tło" (PRIORYTET)

**Stan śledztwa (nie powtarzaj tej pracy):**
- Cloudflare CZYSTY: curl produkcji potwierdza najnowszy build (`.bg-layer`, longhandy
  `.deck`, oklch=0), HTML ma `no-cache`, assety `immutable` (`public/_headers`).
- Build transpilowany pod stare Safari: `build.target ["es2019","safari13"]` +
  `cssTarget ["safari13"]` w `vite.config.ts`.
- Szkielet strony (`.bg-layer`/`.content-layer`/`.deck`) na czystym CSS — niezależny
  od Tailwinda v4 (który wymaga ~Safari 16.4: @layer/@property zostają w bundlu).
- **Repro na PRAWDZIWYM silniku WebKit** (Playwright, viewport iPhone 13, produkcja):
  strona renderuje się W CAŁOŚCI, zero błędów konsoli, wszystkie sondy CSS true.
  Wniosek: kod/serwer/nowoczesny WebKit są zdrowe.
- Na stronie jest **tryb diagnostyczny `klarow.com/?debug=1`** (inline ES5 w
  `site/index.html`): wypisuje na ekranie UA, błędy JS/assetów, stan `.deck`/`.slide`
  /navbara i sondy inset/@layer/@property. Jest też jednorazowa samonaprawa
  stale-cache (reload przy błędzie ładowania script/link).
- **Główni podejrzani:** (1) zamrożona stara karta Chrome iOS (mam ~43 otwarte karty —
  iOS wznawia zamrożony widok), (2) stary iOS bez @layer/@property, (3) bloker treści.
- **Brakujące dane ode mnie:** wersja iOS telefonu + zrzut z `?debug=1` (najlepiej
  z Safari, świeża karta). Zacznij od poproszenia mnie o te dwie rzeczy.

**Przepis na lokalne repro silnikiem WebKit** (scratchpad sesji jest per-okno — odtwórz):
katalog BEZ znaku `&` w ścieżce → `npm init -y && npm i playwright &&
npx playwright install webkit` → skrypt z `webkit.launch()` + `devices["iPhone 13"]`
na `https://klarow.com/` (konsola + screenshot + computed styles). Działało w cz. 6.

**Możliwe kierunki naprawy po diagnozie:** jeśli stary iOS → rozważ zastąpienie
klas Tailwinda w krytycznych komponentach czystym CSS kitu (company-ui jest plain)
albo downgrade/wyłączenie warstw Tailwinda; jeśli zamrożona karta → temat zamknięty.

## B. SEO — dokończyć to, co SPA robi słabo

**Jest już:** `src/components/Seo.tsx` (title/description/canonical/OG/JSON-LD per
strona; `ORG_JSONLD` + `toolJsonLd`), `public/robots.txt`, `public/sitemap.xml`
(13 URL-i — aktualizuj przy nowych narzędziach!), meta + og:image w `index.html`,
favicon. **Ograniczenie:** meta ustawiane w JS (SPA).

**Do zrobienia:**
1. **Prerender/SSG podstron** — najważniejsze: statyczny HTML dla `/` i 12 stron
   `/narzedzia/*` przy buildzie (np. własny skrypt prerender z Playwrightem po
   `vite build`, albo vite-ssg/react-router prerender). Meta i treść mają być
   w HTML-u bez JS. Uwaga na deck (slajdy ukryte CSS-em) — prerender ma sens
   głównie dla podstron narzędzi.
2. Tytuły/opisy long-tail per narzędzie (frazy: „audyt jakości danych excel",
   „import z ERP do excela", „raport zarządczy automatycznie" itp.).
3. `sitemap.xml` — generować z `tools.ts` przy buildzie zamiast ręcznie.

## C. GEO (Generative Engine Optimization) — widoczność w odpowiedziach AI

Propozycje (oceń i wdroż sensowne):
1. **FAQPage JSON-LD** z istniejącego FAQ (`src/components/Faq.tsx`) — pytania
   o obiekcje to idealny materiał cytowalny dla LLM-ów.
2. **`public/llms.txt`** — zwięzły opis firmy/oferty/narzędzi dla crawlerów AI
   (co robimy, dla kogo, wyróżniki: prawdziwie zero chmury + determinizm, kontakt).
3. Treść „odpowiadająca na pytania": nagłówki-pytania + zwięzłe odpowiedzi na
   podstronach narzędzi (sekcja „Częste pytania o to narzędzie"?).
4. Spójne dane: Organization JSON-LD już jest; dopilnuj tel/mail/URL wszędzie
   identyczne. NIE wymyślaj liczb — tylko te już publiczne na stronie.

# 3. Twarde zasady (skrót — pełnia w CLAUDE.md)

- UI wyłącznie wg kitu `company-ui` (stal `#A8B4C2`, zero złota); teksty PL+EN
  (`{ pl, en }` + `pick()`); zero marki/liczb Nuconic (zasada #3).
- Weryfikacja przed pushem (npx NIE działa — `&` w ścieżce):
  `node node_modules/typescript/bin/tsc --noEmit` + `node node_modules/vite/bin/vite.js build`.
- Push: per-repo `credential.helper=wincred`; gdy wisi — puść w tle; 401/403 = PAT wygasł.
- Po każdej skończonej zmianie: commit + push na `main`; na koniec sesji zaktualizuj
  „Stan operacyjny" w CLAUDE.md.

Zacznij od przeczytania CLAUDE.md, potem krótko potwierdź plan i działaj —
zaczynając od poproszenia mnie o wersję iOS i zrzut `?debug=1`.
