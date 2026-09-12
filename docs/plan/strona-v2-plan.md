# klarow.com v2 „CV firmy": plan przebudowy

> Data: 2026-09-12 · Dla: Paweł + Karol (decyzje) oraz okna implementacyjne Claude Code · Stan repo: `b9677ea`
> Źródła: `scratchpad/synthesis.md` (finalna specyfikacja po sądzie 3 koncepcji), 3 sądy (`judges/*`), koncepcja zwycięska `concepts/editorial.md`, 11 raportów researchu, paczka prawna `research/peer-legal.md`.
> Decyzje founderów, które ten plan zakłada jako domyślne, są wypisane osobno w `docs/plan/decyzje-founderow-v2.md` (D1–D24). Tam, gdzie plan mówi „domyślnie", obowiązuje wybór domyślny z tamtego pliku, dopóki founderzy nie zdecydują inaczej.
>
> Konwencje tego dokumentu: bez pauzy „—" (zasada strażnika); półpauza „–" tylko w zakresach liczbowych; terminy techniczne po angielsku; ścieżki względem korzenia repo `C:/Users/bibac/OneDrive/Desktop/Karol & Paweł app` (ścieżka ma spację i `&`, więc `npx` nie działa, binarki wołamy przez `node node_modules/...`).
> Marka poprzedniej firmy nie pada w treści przeznaczonej na stronę; w tym dokumencie występuje wyłącznie w nazwach bramek audytu (`grep -ri nuconic dist` = 0, §8.5, §10 p.5, DoD F0, R15, KPI) i w ścieżkach plików repo (`docs/nuconic-ekosystem-referencja.md`); tak samo w `decyzje-founderow-v2.md` (hook `PreToolUse` w D21, fakt F1). W copy publicznym zawsze „firma produkcyjno-budowlana", więc audyt „słowo = 0" należy uruchamiać na `dist/` i `site/src`, nie na `docs/plan/`. Żaden `.env` nie był czytany.

---

## 0. Streszczenie (10 zdań)

1. Przebudowujemy klarow.com z „katalogu 12 dem z Excelem w H1" na „CV firmy": stronę, która w 10 sekund mówi CFO firmy produkcyjnej CO budujemy, DLA KOGO i CO ON osiągnie, a dowód (13 klikalnych realizacji i dem) pokazuje zamiast opisywać.
2. Wygrała koncepcja **editorial „KLAROW Monografia"** (23,5 pkt u trzech sędziów vs 21,5 proof i 16 showreel): hairlines zamiast boxów, typografia jako grafika, jedno wideo na witrynę, zero decka i karuzeli, najmniejsze ryzyko techniczne i najtańsze assety.
3. Do editorialu przeszczepiamy **26 elementów** z przegranych koncepcji i researchu (9 z proof `P1–P9`, 10 z showreel `S1–S10`, 7 z researchu `R1–R7`; komplet z przypisaniem do sekcji planu w **§16**). Uwaga: `synthesis.md` §0 p.2 podaje zbiorczo „21 przeszczepów", ale jego własne tabele §1.3–1.5 wyliczają 26 pozycji, więc wiążąca jest lista z §16, nie liczba ze streszczenia. Najważniejsze: subtext hero z enumeracją typów pracy, podstrona narzędzia dashboard-first, diagram `KsefFlow`, `messaging.ts` z listą dozwolonych liczb ze źródłem, nagłówek „Kalkulator, nie wróżka", trzecia żywa komórka bento bez Excela, plan B tła (GLSL Hills), `WipeCompare` na 3 podstronach (faza 2), biały płaski CTA, aliasy `_redirects`, bramka shell-vs-DOM, 5 kroków z „Zakres zamrożony" i obowiązkowa sekcja **„Co osiągniesz"**, której nie miała żadna z trzech koncepcji.
4. Trasy i 13 slugów `/narzedzia/:slug` zostają bez zmian (inwestycja SEO od lipca); dochodzą `/rodo` (twardy bloker prawny: art. 14 RODO, precedens Bisnode 943 470 zł) i `404`; prerender rośnie z 17 do **19 statycznych HTML**.
5. Motion = `motion@13.2.0` w wariancie oszczędnym (`LazyMotion domAnimation` + `m.*` + `MotionConfig reducedMotion="user"`, ≤ 36 KB gz), 5 komponentów, 4 czasy, 1 krzywa, zero scroll-linked, zero pinowania; React 19.3 z `<ViewTransition>` dopiero w fazie 2.
6. Wideo: dokładnie jedno (hero-loop 8–10 s z Higgsfield, Kling 3.0, ≤ 1,5 MB, poster ≤ 60 KB, tylko desktop), decyzja A/B wobec GLSL Hills zapada PO trialu, nie przed; Higgsfield kupujemy jako trial 100 kr za 0 $, potem PLUS 49 $ na jeden miesiąc, ULTRA niepotrzebne.
7. Design system v3: ciemna stal zostaje (8,9:1), `tokens.css` w trzech warstwach z `@theme inline` zerującym palety Tailwinda, CTA biały płaski `#FAFAFA` na `#121212`, Nunito Sans solo w v1, Shape Lock {0, 8, 10, 12, 999}, lucide `strokeWidth 1.5` (ikony 16 px: 1.75).
8. Refaktor bazowy (code-splitting 12 dashboardów, rozbicie `App.tsx` 845 linii, shelle prerendera z tych samych danych co React, ESLint + golden-testy silników, bramki strażnika) jest wspólnym fundamentem i kosztuje 3 dni niezależnie od koncepcji; em-dash sweep to osobny dzień i obejmuje **495 z 621 „—" w `site/src`**: pozostałe **126 siedzi w plikach nietykanych w v1** (`components/dashboards/**` 102, `components/DemoReport.tsx` 22, `lib/pdf.ts` 2) i idzie do sweepu dopiero po merge okna c1 (faza 2, §11 i §12.3).
9. Realna estymata: **14–15 dni roboczych przy F1 równolegle z F2, 16–17 przy F1 sekwencyjnie** (6 faz F0–F5, arytmetyka rozpisana w §11) i ~3,5–4 tygodnie kalendarzowe; `synthesis.md` §0 p.9 mówił o 15–17 dniach w 5 fazach, różnica to dopisane F5 = bufor 1–2 dni. Ścieżka krytyczna: decyzje founderów, portrety i bio, przegląd assetów po trialu oraz umowa IP z poprzednią firmą.
10. Kupujemy: stronę, która działa bez JS (SEO/GEO), ładuje się na iPhonie w < 2,5 s, ma jeden zestaw zdań marki w 7 miejscach naraz, jest zgodna z RODO/PKE i ma mierzalny lejek (GSC + Cloudflare Web Analytics + zdarzenia CTA); do tego strażnika reguł, który pilnuje, żeby kolejne sesje nie cofnęły żadnej z tych decyzji.

---

## 1. Cel i przekaz

### 1.1 One-liner (jedno zdanie na wszystkich powierzchniach; D1)

| | PL | EN |
|---|---|---|
| **H1 / LinkedIn / prompt bota** | Narzędzia pod Twój proces. Działają w dni, dane zostają u Ciebie. | Tools built around your process. Working in days, your data stays with you. |
| **Subtext hero (17 słów)** | Kontroling, integracje (KSeF, ERP), importy, obieg dokumentów, panele. Dla firm 20–250 osób z produkcji, budownictwa i dystrybucji. | Controlling, integrations (KSeF, ERP), imports, document workflows, dashboards. For 20–250-person manufacturing, construction and distribution companies. |

Jedyne źródło: `site/src/data/messaging.ts`. Konsumują je: `Hero`, `pagesSeo.ts`, `ORG_JSONLD` w `Seo.tsx`, `llms.txt` w `prerender/entry.tsx`, fallback meta w `index.html`, prompt bota `post-bot/worker.js` (kopiowany ręcznie w tym samym commicie), nagłówki LinkedIn founderów. Bramka strażnika: diff między tymi powierzchniami = 0.

### 1.2 Trzy filary

| Filar | PL | EN | Ikona lucide |
|---|---|---|---|
| Proces | Pod Twój proces. Bez zamkniętego katalogu. | Around your process. No fixed catalogue. | `Blocks` |
| Dni | Pierwszy działający efekt w dni. | First working result in days. | `CalendarClock` |
| Dane | Dane u Ciebie. Liczby bez wróżenia. | Data on your premises. Numbers without guesswork. | `ServerOff` |

Filary nie stoją w hero (limit 4 elementów). Żyją w S7, w `llms.txt` i w JSON-LD `Organization.description`.

### 1.3 ICP: wąsko w „kto" i „jak", szeroko w „co"

- **Wąsko, dla kogo:** produkcja, budownictwo, dystrybucja; 20–250 osób; decydent = właściciel lub CFO, champion = kontroling lub główna księgowa; PL teraz, USA od ~6. miesiąca (`plan-strategiczny.md` §2).
- **Wąsko, jak:** on-premise, deterministycznie, w dni (Pilot na kopii), kod i runbook u klienta, TEST → PROD z backupem i logiem.
- **Szeroko, co:** dowolne narzędzie na danych i procesie w każdym dziale: raporty i kontroling, integracje i e-dokumenty, importy i scalanie, porządek w danych, obieg dokumentów, panele.
- **Excel = symptom, nie tożsamość (D2):** „wyrosły na Excelu" schodzi z H1, meta, JSON-LD i `llms.txt`; Excel zostaje w kartach bólu, w FAQ „Mamy już ERP" i jako hak taktyczny „Przyślij nam swój najgorszy Excel" na `/oferta` i w outboundzie. Kwalifikator Windows + Excel zawęża się do przypisu na `/oferta`: „Narzędzia, które piszą do Twoich plików Excel, wymagają Windows + Excel na stanowisku; integracje i panele stawiamy na Twoim komputerze lub serwerze."
- **Zero „AI" w copy sprzedażowym** (B11, peer-legal, `brand-no-ai-word-in-sales`): słowo nie pada nawet w zaprzeczeniu. Zdanie o determinizmie mówi, CO liczy: **„Twoje liczby liczy zwykły, deterministyczny kod. Te same dane dają ten sam wynik."** / „Your numbers are computed by plain, deterministic code. Same data, same result." Jedyny wyjątek: odpowiedź FAQ „Czy AI liczy moje dane?" (zaprzeczenie). Zero nazw dostawców AI w copy publicznym.

### 1.4 Ton

Founder-led, problem-first, zdania oznajmujące, sentence case PL i EN, zero pytań retorycznych, zero „łatwo / prosto / szybko" bez liczby, zero słów z `messaging.bannedWords` (PL: „podnieś na wyższy poziom", „bezproblemowo", „bezszwowo", „uwolnij potencjał", „nowej generacji", „rewolucjonizuj", „game-changer", „kompleksowe rozwiązanie", „transformacja cyfrowa", „w dzisiejszym świecie", „AI liczy"; EN: „elevate", „seamless", „unleash", „next-gen", „revolutionize", „game-changer", „delve", „tapestry", „in the world of").

---

## 2. Architektura informacji

### 2.1 Trasy

| Trasa | Status | Etykieta nav PL / EN | Prerender | Sitemap | JSON-LD |
|---|---|---|---|---|---|
| `/` | zostaje, nowa treść (9 sekcji, §3) | `KLAROW` (wordmark → home) | `dist/index.html` | 1.0 | `Organization` (wzbogacony) |
| `/narzedzia` | zostaje (URL kanoniczny), nowa etykieta i treść | **Realizacje i dema** / Work & demos | `dist/narzedzia.html` | 0.9 | `Organization` + **`ItemList`** (13 pozycji) |
| `/narzedzia/:slug` ×13 | zostają 1:1 (slugi: `raport-zarzadczy`, `dashboard-produkcji`, `audyt-jakosci-danych`, `import-z-rekoncyliacja`, `os-czasu-zadan`, `kalkulator-transz`, `obieg-przelewow`, `billing-us-g703`, `kontroling-kosztow`, `importy-erp`, `protokoly-robocizny`, `rejestr-umow`, `kontroling-ksef`) | z karty | 13 × `dist/narzedzia/<slug>.html` | 0.8 | `SoftwareApplication` (demo) / **`Service`** (product, case) + `FAQPage` (4 Q&A) |
| `/oferta` | zostaje | Oferta / Offer | `dist/oferta.html` | 0.9 | `Organization` |
| `/faq` | zostaje (+2 pytania) | FAQ | `dist/faq.html` | 0.7 | `FAQPage` (8) |
| **`/rodo`** | **nowa, kanoniczna** | link w stopce: „RODO i prywatność" / „Privacy & GDPR" | `dist/rodo.html` | brak do przeglądu radcy (`noindex`), potem 0.3 | brak |
| `*` → `NotFound` | **nowa** | brak | `dist/404.html` | brak (`noindex`) | brak |
| `/polityka-prywatnosci` | alias | brak | brak | brak | `301 → /rodo` |
| `/realizacje`, `/realizacje/*` | alias | brak | brak | brak | `301 → /narzedzia[/:splat]` |
| `/start` | alias (QR, wizytówki) | brak | brak | brak | `302 → /oferta?utm_source=qr` |
| `/blog/:slug`, `/partnerzy` | faza 2+ | | wpis w `prerenderAll()` gdy powstaną | | |
| `/pl/`, `/en/` | odroczone (decyzja Karola 2026-07-26) | przełącznik PL/EN w nav | | | hreflang dopiero wtedy |

**Prerender: 19 HTML** (4 strony + 13 narzędzi + `rodo` + `404`); w sitemapie do czasu przeglądu radcy jest 17 tras (19 − `404` − `/rodo`). `scripts/prerender.mjs` bez zmian mechaniki (twardy assert pustego `#root`, podmiany-funkcje z powodu `$` w treści, `id="seo-jsonld"` raz na plik). `entry.tsx` dostaje shelle renderujące z tych samych modułów `data/*` co React (koniec ręcznej prozy, §8.3).

### 2.2 `public/_redirects` (kolejność ma znaczenie; Pages najpierw serwuje plik statyczny)

```
/polityka-prywatnosci  /rodo                      301
/realizacje            /narzedzia                 301
/realizacje/*          /narzedzia/:splat          301
/start                 /oferta?utm_source=qr      302
/*                     /index.html                200
```

Do sprawdzenia na preview deploy w F0 (luka L2): czy przy `/* /index.html 200` Pages serwuje `404.html` ze statusem 404 dla nieznanych ścieżek; jeśli nie, zawęzić fallback do znanych prefiksów (`/narzedzia/*`, `/oferta`, `/faq`, `/rodo`, `/`) i przetestować `curl -I` na `/nie-ma-takiej-strony` oraz `/realizacje/raport-zarzadczy`.

### 2.3 `public/_headers`

Dopisać `/media/*` i `/thumbs/*` jako `Cache-Control: public, max-age=31536000, immutable` (pliki w `public/` nie dostają hasha Vite, więc nazwy z wersją: `hero-v1.*`). HTML zostaje `no-cache`. CSP tylko przy embedzie Cal.com (faza 2).

### 2.4 Hub `/narzedzia`: 13 kart zawsze w DOM

- Filtry to chipy `.st` „Wszystkie · Kontroling · Finanse · Produkcja · Dane · Administracja" plus typ „Własny produkt · Dema". Stan w URL: `?dzial=kontroling&typ=demo`; `rel="canonical"` = `/narzedzia`.
- Filtr dodaje atrybut `hidden`, nie odmontowuje kart: crawler, prerender i DOM po JS widzą **13 linków** (naprawa `ToolsGrid.tsx:67`, gdzie dział siedzi w `useState`, więc po starcie Reacta hub ma 0 linków).
- Grupy: **„Własny produkt"** (dziś jedna pozycja: KSeF) oraz „Dema na danych przykładowych" (12, posortowane działami). **Nazwa pierwszej grupy jest liczona z danych, nie wpisana na stałe** (`kind !== "demo"`): 1 pozycja → „Własny produkt" / „Own product"; ≥ 2 pozycje → „Własne produkty i wdrożenia" / „Own products & deployments". Powód: R5 i reguła strażnika `brand-honest-labels` zakazują liczby mnogiej i słowa „wdrożenia" do 2. pozycji z pokryciem (D5: „Wdrożone" dopiero po pierwszym kliencie albo udokumentowanym żywym przebiegu). Etykieta rośnie sama, gdy po umowie IP dojdą karty case.
- Pas kolumn działów `.tools-strip` (`globals.css:84-111`) i drill-down znikają.

### 2.5 JSON-LD

- `Organization`: `name`, `url`, `logo` (`/klarow-logo-512.png`), `description` = `messaging.oneLiner`, `telephone` `+48 786 296 426`, `email`, `areaServed ["PL","US"]`, `contactPoint`, `sameAs` (LinkedIn founderów po D6).
- `ItemList` na `/narzedzia` z 13 `ListItem` (`position`, `url`, `name`).
- `SoftwareApplication` bez `offers` tylko dla `kind: "demo"`; `Service` (`serviceType`, `provider: Organization`, `areaServed`) dla `product` i `case` (dziś `SoftwareApplication` z ceną 0 dla KSeF jest mylące, `site-audit.md` §3.4 p.11).
- `FAQPage` na `/faq` (8 pytań) i per narzędzie (4 Q&A z `toolsSeo.ts`), zawsze z pokryciem w DOM.

### 2.6 Sitemap i `llms.txt`

Generowane z `tools.ts` i listy tras (ręcznego `public/sitemap.xml` nie ma i nie odtwarzamy). Trasa wchodzi do sitemapy tylko, jeśli nie ma `noindex`: dziś wypadają `404` i `/rodo` (do przeglądu radcy, §4.6), czyli 17 `<loc>`. `llms.txt` linkuje do `/rodo` mimo `noindex` (to link dla ludzi i botów LLM, nie zgłoszenie do indeksu). Nowość: `<lastmod>` z `git log -1 --format=%cI -- <plik danych trasy>` liczony w `scripts/prerender.mjs`; gdy git niedostępny w CI, `lastmod` pomijamy (nigdy `Date.now`). `llms.txt` pisany z `messaging.ts`: one-liner, 3 filary, etykiety dowodu, 13 linków, kontakt, sekcja EN, link do `/rodo`.

---

## 3. Strona główna, sekcja po sekcji (faktyczne copy)

Konwencje: kontener `--container: 72rem`, gutter `clamp(16px, 4vw, 40px)`, siatka 12 kolumn `gap 24px` (16 px < 1024), sekcja `padding-block: clamp(64px, 9vw, 120px)`, separator = hairline `1px var(--border)`. 9 sekcji = 9 rodzin layoutu, **eyebrow count = 0**, nagłówek ≤ 6 słów, lead ≤ 20 słów. Dane wszystkich sekcji w `src/data/home.ts` jako `{ pl, en }`; ten sam moduł karmi `HomeShell` w prerenderze.

**Reguła długości leadów (jedno miejsce, zamiast liczb przy sekcjach):** każdy lead PL i EN ma ≤ 20 słów; mierzy to bramka copy w `audit-static.mjs` na `data/home.ts` (`split(/\s+/).length`), nie ten dokument. Konkretne liczby słów nie są tu powtarzane, bo rozjeżdżały się z tekstem przy każdej redakcji zdania (audyt 2026-09-12: 6 z 10 etykiet było o 1 słowo obok).

**Reguła kompletności PL + EN:** każdy string widoczny na stronie ma parę `{ pl, en }`. Dotyczy to także pól, które wyglądają na „same liczby lub znaczniki": `value` w `allowedNumbers` (§8.3), `hook` karty realizacji, `delivery`, linia opisowa w stopce. Model: `value: { pl, en }`, nie `value: string`. Bramka danych w `audit-static.mjs`: brak `en` przy istniejącym `pl` = BLOCKER.

### S1 · Hero (bottom-left over media) · job: hook

- **Dokładnie 4 elementy:** `<h1>` one-liner (D1), `<p>` subtext (treść w §1.1), wiersz CTA (primary biały **„Umów 30 minut" / „Book 30 minutes"** → `BookingDialog`; ghost **„Zobacz realizacje" / „See our work"** → `/narzedzia`), media (poster lub loop). Usunięte względem dziś: chipy ikonowe, telefon pod CTA, duplikat wordmarku.
- **Layout:** `min-height: min(86dvh, 820px)` (mobile `min(72dvh, 640px)`), tekst w kolumnach 1–8, wyrównany do dołu, padding `clamp(40px, 6vw, 72px)`; `.hero-media { position:absolute; inset:0; overflow:hidden }` w bloku hero, **nie** w `.bg-layer`, **nie** `fixed` (szkielet iOS: `.content-layer` bez z-index, `.bg-layer z-index:-1` zostaje jako gradient awaryjny). Overlay `linear-gradient(180deg, rgba(18,18,18,.15), rgba(18,18,18,.85))` → tekst ≥ 4,5:1 na najjaśniejszej klatce.
- **Typografia:** H1 `--text-display: clamp(2rem, 3.6vw + .5rem, 3.5rem)`, waga 700, `letter-spacing -.02em`, `line-height 1.05`, `overflow-wrap: anywhere`; `max-width` startowo `34ch`, **z planem B 38–42ch**. Cel: ≤ 2 linie na ≥ 1024 px (dwa zdania łamią się po kropce). **Test zrzutem w PL i EN** na 1024/1280/1440 (EN jest dłuższe: 74 znaki vs 64 w PL, a sam drugi człon „Working in days, your data stays with you." ma 42 znaki, więc przy 34ch w Nunito Sans nie mieści się w jednej linii). Kolejność środków, gdy EN łamie się na 3 linie: (1) `max-width` 38ch, (2) 42ch, (3) skrót EN „Tools built around your process. Working in days, your data stays yours." (zmiana w `messaging.ts`, czyli także na LinkedIn i w promptcie bota: decyzja D1). Bramka: skrypt zrzutów mierzy `document.querySelector("h1").getClientRects().length ≤ 2` dla obu języków na trzech szerokościach. Lead `clamp(1.0625rem, 1.6vw, 1.25rem)`, kolor `--foreground`.
- **Media:** `HeroMedia` (§6.4): desktop `pointer: fine` = `<video>` loop po posterze; mobile / reduced-motion / Save-Data / 2g-3g / iOS Low Power Mode = `<img>` poster. Poster = LCP: `<link rel="preload" as="image" href="/media/hero-v1.poster.webp" fetchpriority="high">` w `index.html`. Wideo dociągane po `window.load`. Zgodnie z WIG (autoplay > 5 s obok treści): mały icon-button „Zatrzymaj tło" / „Pause background" (`aria-label`, prawy dolny róg hero, tylko gdy wideo gra), nie liczy się jako element tekstowy hero.
- **Motion:** H1 / lead / CTA **bez** animacji wejścia (`initial={false}`, shell prerenderu już je pokazuje). Jedyny ruch: crossfade poster → wideo (`opacity`, 600 ms) po `canplay`.
- **Prerender:** H1, lead, 2 linki, `<img>` poster z `width/height`; zero `<video>` w shellu.

### S2 · „Co budujemy" / „What we build" (gapless bento 3×2) · job: educate

- **Nagłówek:** Co budujemy / What we build. **Lead:** Nie mamy zamkniętego katalogu. Sześć typów pracy, które powtarzają się w każdym dziale. / No fixed catalogue. Six types of work that repeat in every department.
- **6 komórek:**

| # | Ikona | PL | EN |
|---|---|---|---|
| 1 | `BarChart3` | **Raporty i kontroling.** Raport zarządczy, marża projektu, bramka tygodnia. | **Reports & controlling.** Management report, project margin, weekly gate. |
| 2 | `Plug` | **Integracje i e-dokumenty.** KSeF, ERP, API państwa, podpisy elektroniczne. | **Integrations & e-documents.** KSeF, ERP, public APIs, e-signatures. |
| 3 | `ArrowLeftRight` | **Importy i scalanie.** Z ERP i magazynu do plików, ze śladem i backupem. | **Imports & merging.** From ERP and warehouse into your files, with audit trail and backup. |
| 4 | `ShieldCheck` | **Porządek w danych.** Audyt jakości, rekoncyliacja sum co do grosza. | **Data quality.** Quality audit, reconciliation to the last cent. |
| 5 | `FileSignature` | **Obieg dokumentów.** Protokoły, umowy, akceptacje na cztery oczy. | **Document workflow.** Protocols, contracts, four-eyes approvals. |
| 6 | `LayoutDashboard` | **Panele i dashboardy.** Widok dla zarządu, PM i kontrolingu, u Ciebie. | **Panels & dashboards.** Views for the board, PMs and controlling, on your premises. |

- **3 żywe mini-komponenty** (≥ 1 bez Excela): komórka 1 = `MiniReport` (statyczny mini-wykres słupkowy z `lib/report.ts` na `demo-sample.ts`; liczby policzone także w SSR shellu, bez clip-reveal); komórka 2 = `MiniKsef` (3 węzły diagramu `KsefFlow`: KSeF API → connector → pulpit; węzły `opacity` sekwencyjnie raz po wejściu w viewport; bez Excela); komórka 4 = `MiniAudit` (macierz 3×3 OK / UWAGA / BŁĄD z `lib/qualityGate.ts`, chipy `.st`). Wszystkie SSR-safe (bez `window` w renderze).
- **Stopka sekcji (1 linia):** Nie widzisz swojego procesu? Napisz: kontakt@klarow.com / Don't see your process? Write to kontakt@klarow.com (zdarzenie `cta_mail`).
- **Motion:** `RevealGroup` (fadeUp 12 px, 420 ms, stagger 50 ms); hover komórki = `background: var(--surface-raised)` 160 ms (CSS, bez transformu).

### S3 · „Realizacje i dema" / „Work and demos" (4 ramy, featured-vs-rest) · job: proof

- Nazwa robocza sekcji: „Wybrane realizacje". Publiczny H2 do czasu umowy IP i pierwszego wdrożenia Klarow: **Realizacje i dema** (spójnie z zakładką; na siatce, gdzie 3 z 4 pozycji to dema, „Wybrane realizacje" byłoby na wyrost). Po D7 i ≥ 1 wdrożeniu: „Wybrane realizacje".
- **Lead:** Cztery z trzynastu. Każdą można kliknąć i policzyć na danych przykładowych. / Four of thirteen. Each one opens and computes on sample data. Link-caption: **Wszystkie realizacje i dema (13)** / All work and demos (13) → `/narzedzia`.
- **4 ramy** (`aspect-ratio 16/10`, `border 1px var(--border)`, `border-radius 0`, prawdziwy zrzut WebP 1280×800 ≤ 120 KB, `loading="lazy"` poza pierwszą, `width/height`; ramy 2 i 3 z `margin-top: 40px` w prawej kolumnie ≥ 1024 = jedyny „off-grid" moment na home; cała rama = `<a>`):

| # | Nazwa PL / EN | Etykieta dowodu | Dział | Hook PL / EN | Wizual |
|---|---|---|---|---|---|
| 1 | Kontroling na danych z KSeF / Controlling on KSeF data | **Własny produkt** / Own product | kontroling | Kontroling na fakturach z KSeF / Controlling on KSeF invoices | `KsefFlow` SVG, potem zrzut pulpitu „Budżet vs Wykonanie" z trybu mock |
| 2 | Raport zarządczy / Management report | **Demo na danych przykładowych** / Demo on sample data | kontroling | Raport zarządu w sekundy / A board report in seconds | zrzut `DemoReport` (3 KPI + wykres) |
| 3 | Dashboard produkcji / Production dashboard | Demo na danych przykładowych | produkcja | Cały portfel w jednym kadrze / The whole portfolio in one frame | zrzut kafli hal |
| 4 | Audyt jakości danych / Data quality audit | Demo na danych przykładowych | dane | Błędy złapane, zanim zobaczy je zarząd / Errors caught before the board sees them | zrzut macierzy OK/UWAGA/BŁĄD |

- Etykiety = chipy kitu: `demo` → `st` neutralny; `product` i `case` → `st st-accent`. **`st-blue` nie występuje na stronie marketingowej** (Color Lock). Każda rama ma dodatkowo chip działu i `delivery` jako parę `{ pl, en }`: „pilot 5–10 dni" / „pilot in 5–10 days", „etapami" / „in stages".
- **Motion:** ramy fadeUp stagger 60 ms; hover = `scale(1.02)` na `<img>` w `overflow:hidden` 240 ms + hairline ramy → `--accent`. Faza 2: hover-klip WebM ≤ 600 KB z `record-demos.mjs` (tylko `pointer: fine`, `preload="none"`, start na hover, pauza na leave, max 1 aktywny; reduced-motion → zrzut).
- **Prerender:** 4 linki do podstron + link do huba; pełna lista 13 tylko na `/narzedzia` (rozdział treści bez duplikacji).

### S4 · „Co osiągniesz" / „What you gain" (2×2 z ikonami i hairline) · job: outcome (NOWA, obowiązkowa)

- **Nagłówek:** Co osiągniesz / What you gain. **Lead:** Nie sprzedajemy godzin ani systemu. Sprzedajemy efekt, który widać w kalendarzu i w liczbach. / We don't sell hours or a system. We sell a result you can see in the calendar and in the numbers.
- **4 efekty** (ikona 20 px `--accent`, 1 zdanie 700, 1 linia muted; zero liczb, bo każda liczba wymagałaby źródła; sformułowania do zatwierdzenia w D23):

| Ikona | PL | EN |
|---|---|---|
| `Clock` | **Godziny kontrolera wracają do kontrolingu.** Raport, import i sprawdzenie robi narzędzie, nie człowiek po godzinach. | **Your controller's hours go back to controlling.** The tool runs the report, the import and the check, not a person after hours. |
| `CalendarCheck` | **Zamknięcie miesiąca w dni, nie w tygodnie.** Dane z ERP, magazynu i plików spotykają się bez przeklejania. | **Month-end close in days, not weeks.** ERP, warehouse and file data meet without copy-paste. |
| `ShieldAlert` | **Błędy złapane przed zarządem, nie po.** Macierz OK / UWAGA / BŁĄD zanim raport wyjdzie z działu. | **Errors caught before the board sees them, not after.** An OK / WARN / ERROR matrix before the report leaves the department. |
| `Umbrella` | **Urlop bez telefonów z pytaniem o plik.** Narzędzie liczy tak samo, gdy nie ma Cię przy biurku. | **A holiday without calls about the spreadsheet.** The tool computes the same way when you're away from your desk. |

- Framing zakazany (peer-legal): żadnego „oszczędzimy etat", „nie zatrudniajcie", odejmowania ludzi. Efekty mówią o czasie i błędach, nie o etatach.

### S5 · „W liczbach" / „In numbers" (metrics strip) · job: proof

- 4 kolumny (2×2 mobile) rozdzielone hairlinami; liczba 700 `clamp(2.5rem, 6vw, 4.5rem)` `tabular-nums`; opis ≤ 7 słów; bez kart, ikon, eyebrow. Treść wyłącznie z `messaging.allowedNumbers`; **model pozycji to `{ value: { pl, en }, label: { pl, en }, source }`**, bo dwie z czterech „liczb" to słowa i po angielsku brzmią inaczej (§3, reguła kompletności PL + EN):

| `value` PL | `value` EN | Opis PL | Opis EN | Źródło |
|---|---|---|---|---|
| **12** | **12** | dem liczy na żywo na tej stronie | live demos computing on this site | `tools.ts`: 12 × `kind: "demo"` |
| **kilkanaście** (po D7: 15) | **a dozen-plus** (po D7: 15) | narzędzi w jednej firmie produkcyjno-budowlanej | tools in one manufacturing & construction company | zamrożony zestaw anonimowy (`strategy.md` §4.4); „15" dopiero po potwierdzeniu, że liczenie narzędzi jest poza zakazem |
| **3 dni** | **3 days** | od pierwszej linii kodu do działającego produktu | from the first line of code to a working product | git własnego produktu KSeF, 2026-06-14 → 16 (`portfolio.md` §4 S5). **Status w rejestrze: DO POTWIERDZENIA** (`references/allowed-numbers.md` §1: Karol potwierdza, co znaczy „działający produkt" = tryb mock). Do czasu potwierdzenia (fakt F6, przed F2) pasek ma **3 pozycje**, nie 4 |
| **co do grosza** | **to the cent** | kontrola sum w każdym imporcie | reconciliation in every import | `strategy.md` §4.4, mechanizm w demach |

- Zakazane na pasku do umowy IP: „~30 projektów", „≈10 000 wierszy", „klienci w USA" (zostają zamrożone wyłącznie w istniejących opisach podstron i FAQ). Zakazane wszędzie: „89 testów", „Telegram" (język programisty, nie CFO).
- **Motion:** `Counter` 0 → wartość 1,2 s po `useInView once`; reduced → `jump`; słowa bez licznika; w shellu liczby wpisane na stałe.

### S6 · „Jak pracujemy" / „How we work" (5 kroków w wierszu) · job: educate

- **Nagłówek:** Jak pracujemy / How we work. **Lead:** Pilot na kopii Twoich danych. Dwie decyzje należą do Ciebie: zakres na starcie i odbiór na końcu. / A pilot on a copy of your data. Two decisions are yours: the scope at the start and the sign-off at the end.
- **5 kroków** (ikona 20 px, nazwa verb-noun, 1 linia; hairline łącznik nad nagłówkami; zero „Krok 1/2/3"):

| Ikona | PL | EN |
|---|---|---|
| `MessageSquare` | **Rozmowa 30 minut.** Na próbce Twojego pliku, bez zobowiązań. | **A 30-minute call.** On a sample of your file, no commitment. |
| `Lock` | **Zakres zamrożony.** Dzień 0, wliczony w cenę. | **Scope frozen.** Day 0, included in the price. |
| `Copy` | **Budowa na kopii.** Dni 1–4, TEST bez zapisu na oryginale. | **Build on a copy.** Days 1–4, TEST mode, nothing written to the original. |
| `Play` | **Pokaz na Twoich danych.** Dzień 5, raport z prawdziwych liczb. | **Demo on your data.** Day 5, a report from real numbers. |
| `ShieldCheck` | **Odbiór i PROD.** Do 10 dni, backup i log, kod zostaje u Ciebie. | **Sign-off and PROD.** Within 10 days, backup and log, the code stays with you. |

- **Mikro-copy pod krokami (wyjaśnienie, nie tag):** Wycena po bezpłatnej diagnozie. Stała cena za ustalony zakres, bez stawki godzinowej. / Priced after a free diagnosis. A fixed price for an agreed scope, no hourly rate. Link-caption: **Szczegóły oferty** / Offer details → `/oferta`. Zero kwot.
- **Motion:** hairline `scaleX 0 → 1` (420 ms, `transform-origin: left`, `div` z `transform`, nie animowany SVG); kroki fadeUp stagger 60 ms.

### S7 · „Kalkulator, nie wróżka" / „A calculator, not a fortune teller" (side-image 60/40) · job: differentiator

- **Nagłówek:** Kalkulator, nie wróżka. **Lead:** Dane zostają u Ciebie. Zero chmury dostawcy: nie trafiają do nas ani do żadnej chmury poza systemami, które sam wskażesz. / Your data stays with you. Zero vendor cloud: it never reaches us or any cloud beyond the systems you name.
- **Layout:** lewe 7/12 = 5 par ✕ / ✓ jako dwie kolumny listy (hairline tylko nad blokiem); prawe 5/12 = jeden statyczny still macro „brushed steel" (WebP 1200×1500, 4:5, rama 1 px) = jedyny „material switch" na stronie. Mobile: obraz nad tekstem, `max-height 360px`.
- **5 par:**

| ✕ Tradycyjnie / Typically | ✓ Klarow |
|---|---|
| Dane lecą do API modelu językowego i na serwer dostawcy / Data goes to a language-model API and a vendor's server | Dane zostają u Ciebie: na Twoim komputerze lub serwerze / Data stays with you: on your computer or your server |
| Wynik z modelu, za każdym razem może wyjść inaczej / A model's guess that can differ every run | Te same dane, ten sam wynik, co do grosza, z jawną ścieżką wyliczenia / Same data, same result, to the cent, with a visible calculation path |
| Wdrożenie liczone w miesiącach, faktury za godziny / Months of rollout, invoices by the hour | Pierwszy działający efekt w dni, stała cena za ustalony zakres / First working result in days, a fixed price for an agreed scope |
| Nowy system i szkolenia zespołu / A new system and team training | Wchodzimy obok tego, co działa: ERP, pliki, KSeF / We plug in next to what works: ERP, files, KSeF |
| Bez dostawcy wszystko staje / Without the vendor everything stops | Kod, dokumentacja i runbook zostają u Ciebie / Code, documentation and runbook stay with you |

- Ikony `X` i `Check` 16 px, `strokeWidth 1.75`; ✓ = `--accent`, ✕ = `--foreground-muted` (bez czerwieni). Zdanie-kotwica pod blokiem (`MESSAGING.determinism`): **Twoje liczby liczy zwykły, deterministyczny kod. Te same dane dają ten sam wynik.** / Your numbers are computed by plain, deterministic code. Same data, same result.
- **Motion:** wiersze fadeUp stagger 40 ms; still fade 600 ms; bez parallaxu. **Prerender:** cały blok w shellu (treść SEO o on-premise i determinizmie).

### S8 · „Kim jesteśmy" (left-third caption + 2 portrety) · job: trust

- **Nagłówek:** Rozmawiasz z osobą, która narzędzie zbudowała. / You talk to the person who built the tool. **Lead:** Dwie osoby, zero pośredników. Kod, dokumentacja i runbook zostają u Ciebie. / Two people, no middlemen. Code, documentation and runbook stay with you.
- **2 karty** (portret 4:5 w ramie 1 px, duotone stalowe; imię i nazwisko 700; rola; 1 zdanie ≤ 20 słów; link „LinkedIn"): Paweł [DECYZJA FOUNDERÓW: nazwisko Pawła, fakt F4 w `decyzje-founderow-v2.md`; do czasu podania karta nie idzie na produkcję w wariancie D6(a)]: „prowadzi wdrożenia i rozmowy z klientami" / „runs implementations and client conversations"; Karol Bałucki: „buduje narzędzia i integracje" / „builds the tools and integrations". Zdania bio od founderów. Zero „lat doświadczenia", zero nazw dostawców AI.
- **Wariant D6(b):** Karol bez zdjęcia = rama z inicjałem „K" na stali (jak favicon) + imię + rola. **Wariant D6(c)** = sekcja usunięta (home ma wtedy 8 sekcji). Nigdy stock, nigdy placeholder.
- **Motion:** portrety fade 600 ms; reszta fadeUp. Bez ruchu twarzy.

### S9 · Zamknięcie + stopka (mini minimalist) · job: convert

- **H2:** Pokaż nam proces, który boli. / Show us the process that hurts. **Lead:** W 30 minut powiemy, co da się z nim zrobić. / In 30 minutes we'll tell you what can be done with it.
- CTA primary **Umów 30 minut** (ta sama etykieta co w hero i nav: jedna intencja, jedna etykieta). Pod nim jedna linia meta: `786 296 426 · kontakt@klarow.com` jako `tel:` i `mailto:` (zdarzenia `cta_tel`, `cta_mail`).
- **Stopka (na każdej trasie):** wordmark `KLAROW`; 1 linia jako para `{ pl, en }`: „Narzędzia pod proces dla firm produkcyjnych, budowlanych i dystrybucyjnych · Polska / USA" / „Tools built around the process for manufacturing, construction and distribution companies · Poland / USA"; linki: Realizacje i dema · Oferta · FAQ · **RODO i prywatność** (`/rodo`); NAP z `contact.ts`; LinkedIn founderów (po D6); `© 2026 Klarow`. Bez „strona robocza v0.8".

---

## 4. Podstrony

### 4.1 Hub `/narzedzia`

H1 **Realizacje i dema** / Work and demos. Lead: Trzynaście przykładów: własny produkt i dwanaście dem na danych przykładowych. Każde demo liczy na żywo w przeglądarce. / Thirteen examples: our own product and twelve demos on sample data. Every demo computes live in the browser. (Liczba mnoga „wdrożenia" wraca dopiero z drugą pozycją `kind !== "demo"`: R5, `brand-honest-labels`, D5.) Filtry i grupy jak w §2.4. Karta compact: miniatura 16:10 (WebP 640×400 ≤ 40 KB, lazy), ikona + nazwa, hook, chipy (dowód, dział, `delivery`); cała karta = `<a>`; `focus-visible` = hairline `--accent` 2 px. Motion: `RevealGroup` stagger 40 ms (max 12 dzieci), zmiana filtra bez layout-animacji (`domMax` = +13,7 KB gz, nie w v1). Prerender: `ToolsShell` z H1, leadem, 2 grupami, 13 kartami, `ItemList`.

### 4.2 Podstrona narzędzia `/narzedzia/:slug` (dashboard-first)

```
← Realizacje i dema / {dział}
[Demo na danych przykładowych] [Kontroling] [pilot 5–10 dni]      ← chipy
H1 {nazwa}  ·  hook jako lead
┌ pasek akcji: Odtwórz · Załaduj przykład · Pobierz PDF (gdzie jest) ┐
│  ŻYWY DASHBOARD (DashboardMount: React.lazy + skeleton .skel + IO)  │  ← nad zgięciem na desktopie
└─────────────────────────────────────────────────────────────────────┘
„Demo na danych przykładowych. Te same dane dają zawsze ten sam wynik."
[Co dostajesz] [Wejście → wyjście] [Co zastępuje]                   ← 3 kolumny hairline (z tools.ts)
Jak to liczymy (lista reguł, id="sciezka")
Częste pytania o to narzędzie (4 Q&A z toolsSeo.ts, ZAWSZE w DOM)
Inne narzędzia (2 karty compact: ten sam dział + inny dział)
CTA: „Chcesz to na swoich danych?" [Umów 30 minut] [Przyślij najgorszy Excel]
```

- `kind: "demo"` → `DashboardMount` (natywny `IntersectionObserver` + `requestIdleCallback` + `React.lazy` z mapą literalnych `import()`; `Suspense` ze skeletonem kitu; `minHeight` przeciw CLS; boundary „Demo nie wczytało się. Odśwież stronę."). „Odtwórz" = remount przez `key` (replay `.chart-reveal` kitu ≤ 450 ms, raz). Pasek „Pobierz PDF" korzysta z `PdfButton` **bez zmian** (refaktor `pdf.ts` robi okno c1, §12).
- `kind: "product"` (KSeF) → §4.3. `kind: "case"` (faza 2, po umowie IP) → ilustracja schematyczna SVG + „Co zbudowano / Jak / Co firma zyskała (jakościowo)".
- CTA „Przyślij najgorszy Excel" = `mailto:` z tematem „Najgorszy Excel" (zdarzenie `cta_worst_excel`); inbound, bez formularza, więc bez zgód PKE.
- `PageMain` ujednolicony (dziś `pt-32` vs 96 px). Faza 2: `WipeCompare` na `raport-zarzadczy`, `dashboard-produkcji`, `importy-erp`.

### 4.3 KSeF (`/narzedzia/kontroling-ksef`, `kind: "product"`)

- Relabel „WDROŻONE" → **„Własny produkt"** (D5). Bullet „opcjonalny asystent AI" usunięty z `tools.ts` (PL `:644`, EN `:658`) (D4).
- **`KsefFlow`**: diagram SVG 4 węzłów na tokenach (`role="img"`, `aria-label` z pełną treścią): **KSeF API 2.0 → connector (u Ciebie) → baza SQLite (u Ciebie) → pulpity: Budżet vs Wykonanie, Cashflow 13 tyg.** oraz przekreślona strzałka zwrotna z podpisem „nie wysyła faktur: tylko czyta i liczy". Łączniki `clip-path`, nie `stroke-dasharray`; animacja tylko `opacity` węzłów raz.
- Galeria 2–3 zrzutów trybu mock (dane fikcyjne, bez nazwy produktu w UI zrzutu; luka L12: sprawdzić nagłówek Kokpitu w mocku, w razie potrzeby ukryć CSS-em przed zrzutem). Panel „Jak działa" (3 kroki: pobranie metadanych z API KSeF 2.0 → parser FA(3) → pulpity) i „Czego nie robi". Etykieta czasu: „Health-Check 48 h → pilot etapami". JSON-LD `Service`.

### 4.4 `/oferta`

H1 **Pilot na kopii** / A pilot on a copy. Lead: Jeden proces, kopia Twoich danych, pierwszy działający efekt w dniu 5. Wycena po bezpłatnej diagnozie. Sekcje: **Harmonogram** (ten sam komponent `Steps` co S6, pełne opisy dni 0 / 1–4 / 5 / ≤ 10, 50 : 50) · **Współpraca** (`CollaborationFlow` SVG 1:1) · **Wycena** (3 zdania: Wyceniamy po bezpłatnej diagnozie. Stała cena za zamrożony zakres, bez stawki godzinowej. Druga rata po działającym odbiorze.) · **Dla kogo** (chipy: Produkcja · Budownictwo · Dystrybucja · 20–250 osób · Polska / USA; przypis z kwalifikatorem Windows + Excel; „Nie dla Ciebie, jeśli": migracja do chmury, wymiana ERP, body-leasing) · **Kalkulator transz** (`TrancheCalc` lazy na `lib/tranches.ts`: „Wpisz kwotę i wagi: Σ co do grosza · PASS"; zdarzenie `calc_tranche_run`) · **Hak**: **Przyślij nam swój najgorszy Excel.** W 30 minut pokażemy, co da się z nim zrobić. + CTA „Umów 30 minut" + `mailto:`.

### 4.5 `/faq`

H1 **Częste pytania**. 6 istniejących z `faq.ts` + 2 nowe (jedno źródło; akordeon z odpowiedziami zawsze w DOM, `aria-controls` + `id`):

- **Czy to tylko Excel?** / Is this only about Excel? → Nie. Excel jest częstym wejściem, nie warunkiem. Budujemy integracje (KSeF, ERP, API), panele webowe i obiegi dokumentów na Twoim serwerze; narzędzia piszące do plików Excel wymagają Windows + Excel. / No. Excel is a common input, not a requirement. We build integrations (KSeF, ERP, APIs), web panels and document workflows on your server; tools that write to Excel files need Windows + Excel.
- **Czy AI liczy moje dane?** / Does AI compute my data? → Nie. Twoje liczby liczy zwykły, deterministyczny kod: te same dane dają ten sam wynik, a ścieżkę wyliczenia widzisz w narzędziu. Żaden model językowy nie dostaje Twoich danych. / No. Your numbers are computed by plain, deterministic code: same data, same result, and you can see the calculation path in the tool. No language model ever receives your data. (jedyne miejsce w copy sprzedażowym, gdzie pada słowo „AI", i tylko po to, żeby zaprzeczyć: `brand-no-ai-word-in-sales`)

### 4.6 `/rodo` (nowa; szkielet treści, oznaczony „do przeglądu radcy")

Dokument `max-width 42rem`, H1 **Skąd mamy Twoje dane i jak je usunąć** / Where your data comes from and how to delete it. Treść = klauzula informacyjna z art. 14 RODO + polityka prywatności strony w jednym dokumencie. Lead: Ta strona mówi wprost, skąd mamy Twoje dane, po co, jak długo i jak jednym mailem powiedzieć „nie". / This page says plainly where your data comes from, why, for how long and how to say "no" in one email.

Sekcje (kolejność i treść wynikają z art. 14 ust. 1–2; szkielet pisze Claude Code w F0, radca przegląda w D16):

1. **Administrator danych.** [DECYZJA FOUNDERÓW: pełna nazwa JDG Pawła, adres, NIP; do czasu wpisu strona nie idzie na produkcję]. Kontakt: kontakt@klarow.com, 786 296 426.
2. **Skąd mamy Twoje dane (konkretne źródła).** Dane osób kontaktowych w firmach pozyskujemy z: ogłoszeń o pracę opublikowanych na portalach pracuj.pl i LinkedIn Jobs (data publikacji ogłoszenia zapisana w naszej bazie); Krajowego Rejestru Sądowego (KRS); Centralnej Ewidencji i Informacji o Działalności Gospodarczej (CEIDG); rejestru REGON (GUS); publicznego profilu LinkedIn; strony internetowej firmy. Nigdy: kupione bazy, scraping poczty. (Formuła „ze źródeł publicznie dostępnych" jest zakazana: to ją zakwestionowano u Bisnode.)
3. **Jakie dane.** Imię i nazwisko, stanowisko, służbowy e-mail i telefon, nazwa i adres firmy, treść korespondencji z nami.
4. **Po co i na jakiej podstawie.** Art. 6 ust. 1 lit. f RODO (uzasadniony interes). Na czym polega nasz interes: chcemy zaproponować firmom z produkcji, budownictwa i dystrybucji narzędzia do pracy na danych; kontaktujemy się z osobami odpowiedzialnymi za kontroling, finanse lub zarząd, jednorazowo, z możliwością odmowy w każdym momencie. Informację handlową (art. 398 PKE) wysyłamy wyłącznie po Twojej uprzedniej zgodzie; pierwsza wiadomość jest prośbą o zgodę, nie ofertą.
5. **Jak długo.** Do sprzeciwu, a bez odpowiedzi nie dłużej niż 12 miesięcy od pierwszego kontaktu; korespondencja, w której zawarto umowę, przez okres wymagany przepisami podatkowymi.
6. **Komu przekazujemy i przekazywanie poza EOG** (art. 14 ust. 1 lit. e i f: trzeba podać FAKT przekazania, podstawę i sposób uzyskania kopii zabezpieczeń, a nie tylko zapewnienie, że transferu nie ma). Odbiorcy: Cloudflare (hosting i analityka bez cookies), dostawca poczty (Gmail / Resend), Cal.com (rezerwacja rozmowy, jeśli z niej korzystasz). Treść na stronie: **„Nie sprzedajemy danych. Część naszych dostawców (Cloudflare, Google, Resend, Cal.com) przetwarza dane na serwerach w USA. Podstawą takiego przekazania są standardowe klauzule umowne (SCC) albo Data Privacy Framework, w zależności od dostawcy; kopię zabezpieczeń wyślemy na prośbę wysłaną na kontakt@klarow.com."** / „We do not sell data. Some of our providers (Cloudflare, Google, Resend, Cal.com) process data on servers in the USA. Such transfers are based on standard contractual clauses (SCC) or the Data Privacy Framework, depending on the provider; we will send a copy of the safeguards on request to kontakt@klarow.com." **Zadanie w F0:** dla każdego z czterech dostawców wpisać do `references/integrations-registry.md`, czy działa na SCC czy na DPF (sprawdzić na liście DPF i w DPA dostawcy), żeby zdanie nie zostało na „albo".
7. **Twoje prawa.** Dostęp, sprostowanie, usunięcie, ograniczenie, przenoszenie, skarga do Prezesa UODO (ul. Stawki 2, 00-193 Warszawa).
8. **PRAWO SPRZECIWU** (odrębny, wyróżniony blok w ramie hairline, poza listą praw, zgodnie z art. 21 ust. 4): Masz prawo w dowolnym momencie sprzeciwić się przetwarzaniu Twoich danych do kontaktu handlowego. Wystarczy jeden mail na kontakt@klarow.com o treści „sprzeciw". Usuwamy dane w ciągu 7 dni i potwierdzamy mailem. Przycisk `.btn.btn-secondary` „Wyślij sprzeciw" = `mailto:kontakt@klarow.com?subject=Sprzeciw%20RODO`. Bez formularza, bez backendu.
8a. **Zautomatyzowane decyzje i profilowanie** (art. 14 ust. 2 lit. g; obowiązkowe, bo prowadzimy research leadów z punktacją): **„Nie podejmujemy wobec Ciebie decyzji wyłącznie w sposób zautomatyzowany i nie profilujemy Cię jako osoby. Firmy oceniamy wstępnie prostą punktacją dopasowania do naszego profilu klienta (branża, wielkość zatrudnienia, publiczny sygnał zakupowy, np. ogłoszenie o pracę). Punktacja dotyczy firmy, nie Ciebie, i niczego nie przesądza: o tym, czy i do kogo napiszemy, decyduje człowiek."** / „We do not make decisions about you based solely on automated processing, and we do not profile you as an individual. We score companies on a simple fit scale (industry, headcount, a public buying signal such as a job posting). The score describes the company, not you, and decides nothing on its own: a human decides whether and whom we contact." **Warunek prawdziwości (do sprawdzenia w F0):** punktacja w `leadscout/` liczy wyłącznie cechy firmy (sektor, zatrudnienie, sygnał zakupowy, decyzyjność właścicielska, stack) i żadna jej składowa nie ocenia osoby kontaktowej. Jeśli to się zmieni, punktacja osób musi być opisana także w sekcji 3 („jakie dane") i 4 („po co i na jakiej podstawie"), a to zdanie przestaje być prawdziwe.
9. **Strona klarow.com.** Brak cookies analitycznych i marketingowych; `localStorage` tylko dla wyboru języka i jednorazowej samonaprawy cache; Cloudflare Web Analytics (cookieless); zdarzenia kliknięć CTA bez identyfikatorów osób. Formularze zapisu (jeśli powstaną) wymagają odrębnej, niezaznaczonej domyślnie zgody i potwierdzenia mailem (double opt-in).
10. **Zmiany.** Data ostatniej aktualizacji (z gita, jak `lastmod`).

Wersja EN pełna (`{ pl, en }`), bo strona ma przełącznik. Ten sam plik danych `data/rodo.ts` karmi `RodoPage` i `RodoShell`.

**Indeksacja: `noindex` do przeglądu radcy** (domyślny wybór z `synthesis.md` D-21, doprecyzowany w D16 jako D16-b). Do czasu przeglądu `dist/rodo.html` ma `<meta name="robots" content="noindex, follow">` i **nie wchodzi do `sitemap.xml`**; trasa jest publiczna, linkowana ze stopki i z szablonów outboundu (to wystarcza do art. 14, indeksacja nie jest wymagana). Po przeglądzie radcy (D16, cel 2026-09-30) jednym commitem: zdjęcie `noindex`, wpis do sitemapy z priorytetem **0.3**, podniesienie oczekiwań bramek (`verify-site.mjs`: sitemap = trasy − `404`; KPI indeksacji 17/17 → 18/18). Powód, dla którego nie indeksujemy od razu: klauzula art. 14 jest oświadczeniem administratora i do przeglądu prawnika nie powinna być pozycjonowana jako oficjalny dokument.

### 4.7 `404`

H1 **Nie ma takiej strony.** / There is no such page. Linia: Sprawdź adres albo przejdź do realizacji. / Check the address or go to our work. Linki: `/narzedzia`, `/`. `<meta name="robots" content="noindex">`; prerender do `dist/404.html`; trasa `*` w routerze.

---

## 5. Design system v3

### 5.1 Paleta: ciemna stal zostaje (D10)

Page Theme Lock: 12 dashboardów jest ciemnych; jasny landing wymagałby retestu wszystkich. Kontrast stal `#A8B4C2` na `#121212` = 8,90:1, tekst `#171717` na stali = 8,51:1 (AAA); na bieli stal ma 2,11:1, więc light theme dostaje `--accent: #42526E`. Dark-first, **light-ready**: `tokens.css` definiuje komplet `[data-theme="light"]` od dnia 1 (~40 linii, na PDF-preview, brandkit, LinkedIn), strona bez przełącznika; `color-scheme: dark` na `:root`, `meta theme-color #121212`.

### 5.2 `site/src/styles/tokens.css` (3 warstwy)

1. **Prymitywy** (nigdy w komponentach): `--steel-50…900` (300 = `#A8B4C2`), `--gray-0…975` (975 = `#121212`, 950 = `#171717`, 900 = `#262626`, 800 = `#3A3A3A`), semantyczne `--green-400 #34D399`, `--red-400 #F87171`, `--amber-400 #FBBF24`, `--blue-300 #93C5FD` oraz warianty `-rgb` dla alf.
2. **Aliasy semantyczne** (API komponentów, dark domyślnie): `--background`, `--surface`, `--surface-muted`, `--surface-raised`, `--surface-overlay`, `--scrim`; `--foreground`, `--foreground-strong`, `--foreground-muted`, `--foreground-faint` (≥ 4,5:1; kit miał 3,29:1); `--border`, `--border-strong`, `--border-subtle`; `--accent`, `--accent-strong`, `--accent-deep`, `--on-accent`, `--accent-text`, `--accent-a8/a12/a16/a35/a45` (zamiast 28 × `rgba(168,180,194,…)`), `--ring`; **`--cta: #FAFAFA`, `--on-cta: #121212`, `--cta-hover: #FFFFFF`** (D9); `--ok/--bad/--warn/--info` z trójką `-bg`/`-border` (wyłącznie statusy w dashboardach); `--chart-1…5`, `--chart-grid/axis/ref/label`; `--radius-0/sm 8/md 10/lg 12/pill 9999`; `--font-sans`, `--font-display: var(--font-sans)` (do D8), `--text-xs…display`; `--duration-fast 160ms / base 240ms / slow 420ms / media 600ms`; `--ease-out (.22,1,.36,1)`, `--ease-soft (.3,.7,.3,1)`, `--ease-std (.4,0,.2,1)`; `--container 72rem`, `--gutter`, `--section-y`.
3. **`@theme inline`**: `--color-*: initial; --shadow-*: initial; --font-*: initial;` a potem mapowanie aliasów na `--color-background`, `--color-surface`, `--color-accent`, `--color-cta`, `--text-*`, `--radius-*`, `--ease-*`, `--animate-rise/fade/swap`. Tailwind zna tylko nasze tokeny: `bg-blue-500` przestaje istnieć. Zerowanie jest bezpieczne: domyślne utility kolorów są dziś tylko w `Navbar.tsx` (przepisywany) i martwym `radial-orbital-timeline.tsx`.

Warianty: `@custom-variant tool (&:where([data-surface="tool"], [data-surface="tool"] *))`, `coarse`, `motion-ok`. Kolory w hex/rgb, alfa jako tokeny (nie `bg-accent/12`, nie `oklch`, nie `color-mix`), dopóki `cssTarget safari13` (D24). Stare aliasy kitu (`--primary`, `--muted-foreground`, `--card`, `--heading`, `--body-bg`) zostają jako **blok zgodności** (**235 inline `style=` w plikach nietykanych**: `components/dashboards/**` + `DemoReport.tsx`; w całym `site/src` jest ich 455, reszta siedzi w plikach, które i tak przepisujemy w F0–F3; migracja tych 235 = dług fazy 2+).

### 5.3 Typografia (D8)

Nunito Sans solo w v1 (93 KB, jest self-hosted): H1 700 `--text-display`, H2 700 `--text-3xl` `text-wrap: balance`, H3 700 `--text-xl`, lead 400 `--text-lg` `max-width 60ch`, body 400/600, minimum w UI `.75rem` (10 px tylko osie wykresów), liczby `tabular-nums` + `nowrap`, PLN `12 345,67`, USD `$1,234,567.89`, minus `−`. Test Geist (display) = faza 2, na 2 zrzutach hero, i tylko w wariancie mieszczącym się w `dist/fonts` ≤ 150 KB. **Arytmetyka (D8):** Nunito 93 KB + pełny Geist ~70 KB = ~163 KB, czyli para „Geist + Nunito" progu NIE przechodzi. Dopuszczalne są tylko dwa warianty: (a) Geist w subsetcie latin ≤ 55 KB obok Nunito (93 + 55 = 148 KB), albo (b) **podmiana** kroju (Geist zamiast Nunito, nie obok). Zero serif, zero mono w UI. Koniec `text-[Npx]` (140 wystąpień) i px-owej skali z ułamkami. PDF zostaje na Roboto (decyzja B z oknem c1, §12); ewentualne osadzenie kroju UI w PDF dopiero po decyzji o foncie v2.

### 5.4 Shape Lock, linie, cienie, ikony

- **Radius, zbiór dozwolony {0, 8, 10, 12, 999}:** powierzchnia marketingowa (`data-surface="marketing"`, domyślna: home, hub, oferta, faq, rodo, otoczka podstron) używa {0, 8, 999} (ramy/komórki 0, przyciski/inputy 8, chipy 999); powierzchnia narzędzi (`data-surface="tool"`: dashboardy, dialog) używa {8, 10, 12, 999} (kit). Audyt rozróżnia po `data-surface`. Do sprzątnięcia: `rounded` (4 px, ×30), `rounded-md/lg/xl`, `rounded-[10px]` ×7, 4/5/6/7/16/18 px w CSS.
- **Linie zamiast boxów:** hairline `1px var(--border)`; karty z tłem tylko tam, gdzie elewacja niesie hierarchię (dashboardy, dialog); zakaz akcentowego `border-left`; zero cieni na marketingu (`--shadow-*` tylko dialog/menu); zero glow/neon/`backdrop-filter`/`mask` na hover; zero `#000`/`#fff` poza `--cta-hover`.
- **Ikony:** wyłącznie `lucide-react`, **`strokeWidth 1.5`** domyślnie i **1.75 wyłącznie dla ikon 16 px** (wartość liczy wrapper `Icon`: `size === 16 ? 1.75 : 1.5`; synthesis §2.5.5), rozmiary z mapy {16, 20, 24, 32}, `aria-hidden` przy tekście, `aria-label` solo; zero emoji, zero glifów `▲▼✓✕→`, zero ręcznych `<path>` poza `CollaborationFlow`, `KsefFlow` i ilustracjami case.
- **Root `zoom` 1.08/1.18** (`globals.css:116-125`) zdjęty w F0; skalowanie przez `clamp()` i `--container`; retest 12 dashboardów na 1920/2560 (0,5 dnia).

### 5.5 Sprzątanie `company-ui.css` i los `ui-kit/`

**Najpierw inwentarz klas, potem cięcie** (bez tego cięcie psuje dashboardy, których §12.1 zabrania dotykać, a naprawa wymagałaby ich edycji, czyli złamania umowy z oknem c1). Procedura w F0, przed pierwszym `git rm` linii:

```bash
# 1. wyciągnij selektory klas z bloków przeznaczonych do cięcia
sed -n '665,860p' site/src/styles/company-ui.css | grep -o '\.[a-zA-Z][a-zA-Z0-9_-]*' | sort -u
# 2. dla każdej klasy sprawdź użycie w plikach NIETYKANYCH
grep -rn "className=\"[^\"]*<klasa>" site/src/components/dashboards site/src/components/DemoReport.tsx
```

Wynik inwentarza z 2026-09-12 (weryfikowalny powyższym poleceniem): z bloków 665–860 dashboardy używają **`.bar` (`CostControl.tsx:182`, `ProductionDashboard.tsx:252,288`)** oraz **`.steps` / `.step` / `.step-dot` / `.step-lbl` / `.step-line` z modyfikatorami `.done` i `.active` (`LabourProtocols.tsx:161–176`)**. Klasy z „Block 4" (`table.matrix th.bill-proposal`, `.pm-col`, `.delta-badge`, `.fx-chip`, `.pct-input`, `select.bsel`) nie są używane w `site/src` (jedyne trafienia na „matrix" to teksty i18n, nie `className`), więc ten blok i jego `@media print` schodzą bez ryzyka.

Z `site/src/styles/company-ui.css` (947 linii) wycinamy: blok light theme z hexami (556–600; light idzie przez tokeny), billing „Block 4" i `@media print` (665–727), EXTRA COMPONENTS (729–847) **bez pozycji z listy „Zostają"**, shell aplikacji (`.app/.sidebar/.topbar/.navitem`, 93–147), launcher, login, tooltip singleton `#nc-tip`, gradient „metal" w `.btn-primary` i `background-clip:text` w `.brand-word` (sama klasa `.brand-word` **zostaje**: używa jej `LabourProtocols.tsx:185` i wordmark), komentarze „gold". Zostają: `@font-face`, reset, `.tnum/.nowrap`, przyciski (płaskie), chipy `.st*` i `.st-ico`, `.data-table`, `.lbl-sm`, `.legend`, formularze, modal (a11y), wykresy `.chart-*`, `.faq-answer`, reduced-motion, `.skel`, **`.bar` (+ `.bar.ok/.bad/.grad` i `.bar > i`)**, **`.steps`, `.step`, `.step-dot`, `.step-lbl`, `.step-line`** i wszystko, co wyjdzie z inwentarza jako używane. Cel: ≈ −35–40 % CSS (≤ 20 KB gz). **DoD cięcia:** zrzuty wszystkich 12 dashboardów przed i po (skrypt `screenshots.mjs`), porównanie parami, zero różnic wizualnych; jeżeli różnica jest, wraca wycięta reguła, nie edytujemy dashboardu. Zasada #1 CLAUDE.md zostaje w mocy: kit `company-ui` jest nadal jedynym design-systemem, ale jego źródłem prawdy staje się `tokens.css` + przycięty arkusz; po F4 wynik wraca do `ui-kit/skills/company-ui/assets/` jako kit v2.2 (bez nazw narzędzi poprzedniej firmy w `SKILL.md`, bez prefiksów `nc-`), a `ui-kit/README.md` dostaje neutralny opis pochodzenia. Katalog `ui-kit/` nie jest kasowany w v1.

### 5.6 Komponenty (jedno źródło `src/components/`)

`Navbar` (1 linia 64 px, wordmark płaski, 3 linki, PL/EN, CTA `.btn.btn-primary`; mobile hamburger z `inert` na zamkniętym menu; bez `backdrop-blur`; tło `--surface-overlay`), `Footer`, `SkipLink` + `PageMain` (`<main id="main">`), `HeroMedia` + `MediaBoundary`, `Bento` + `BentoCell`, `MiniReport` / `MiniKsef` / `MiniAudit`, `CaseFrame` (featured) / `CaseCard` (compact), `Outcomes`, `MetricsStrip` + `Counter`, `Steps`, `Contrast`, `FounderCard` (wariant inicjału), `ClosingCta`, `Chip`, `KsefFlow`, `DashboardMount` + `DashboardSkeleton`, `TrancheCalc`, `FaqList`, `BookingDialog` (natywny `<dialog>` z `showModal`, focus-trap, `Esc`, zwrot fokusu; Cal.com jako link zewnętrzny w v1), `Seo` (fix deps `jsonLd`), `CollaborationFlow` (1:1), `RodoPage`, `NotFound`. **Usunięte:** `ToolsGrid` (drill-down), `Differentiators`, `ui/button|badge|card|canvas-reveal-effect|radial-orbital-timeline`, `lib/utils.ts`, `content/`, `data/` (YAML), `public/screens/placeholder.svg`, `Logo.zip`, `zoomRef`, sondy decka w `index.html`.

---

## 6. System motion: „poziom wyżej, bez teatru"

### 6.1 Biblioteka i provider

`motion@13.2.0` (pin; minimum 13.1.1 przez fix `AnimatePresence` + React 19 StrictMode). Stack: `LazyMotion features={domAnimation} strict` (sync, żeby hero nie stał w `initial` na wolnym łączu) + `m.*` z `motion/react-m` + `MotionConfig reducedMotion="user"`. Zakaz `import { motion }` (strict rzuci), zakaz `layout/layoutId/drag/Reorder` (wymagają `domMax`). Budżet chunków Motion **≤ 36 KB gz** (pomiar bazowy 33,8 KB w Vite/Rollup; skok > 40 KB = ktoś wciągnął `domMax` lub pełny `motion` → fail bramki). 36, nie 35: taki próg jest już zaimplementowany w `.claude/skills/klarow-guardian/scripts/verify-site.mjs:248` i zapisany w `synthesis.md`; jedna wartość w skrypcie i w planie. Montaż: `main.tsx` → `<StrictMode><BrowserRouter><LangProvider><MotionProvider><App/>`; **nigdy** w `src/prerender/entry.tsx`.

### 6.2 Tokeny ruchu (`src/motion/tokens.ts` + te same wartości w `tokens.css`)

```ts
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;   // = --ease-out kitu
export const EASE_SOFT = [0.3, 0.7, 0.3, 1] as const;  // = --ease-soft; clip-reveal danych
export const EASE_STD = [0.4, 0, 0.2, 1] as const;     // trasy, crossfade
export const DUR = { quick: 0.16, base: 0.24, reveal: 0.42, media: 0.6 } as const; // 0.6 = maksimum (wyjątek: Counter 1.2 s)
export const STAGGER = 0.05;   // 50 ms; max 12 dzieci w kaskadzie
export const SHIFT = 12;       // px; jedyna odległość wejścia (duże powierzchnie: 0, tylko opacity)
export const VIEWPORT_ONCE = { once: true, amount: 0.25, margin: "0px 0px -10% 0px" } as const;
export const MOTION_TIER: "calm" | "full" = "full"; // kill-switch mediów opcjonalnych (wideo, hover-klipy, ChartReveal); NIE druga ścieżka renderu
```

`MOTION_TIER = "calm"` wyłącza wyłącznie media opcjonalne (poster zamiast wideo, brak hover-klipów, brak `ChartReveal`); reveale, liczniki i dialog zostają, bo są tanie. Jedna ścieżka renderu, zero wariantów komponentów.

### 6.3 Komponenty (5 + `MediaBoundary`; nic więcej w v1)

| Komponent | Rola | Reguły |
|---|---|---|
| `Reveal` / `RevealGroup` | wejście sekcji lub grupy ze staggerem (`whileInView`, `VIEWPORT_ONCE`) | tylko poniżej folda; dzieci `m.li variants={fadeUp}`; max 12 w kaskadzie |
| `Counter` | liczby S5 (`useMotionValue` + `animate` + `useTransform` jako dziecko `m.span`; `useInView once amount .6`) | reduced → `jump(to)`; `controls.stop()` w cleanup; liczba w shellu na stałe; `tabular-nums` |
| `PageFade` | wejście nowej trasy (fade + `y` 6 px, 240 ms, `EASE_STD`), bez exit | pierwszy montaż = podmiana shellu → `initial={false}` przez `const [firstPath] = useState(() => pathname)` i porównanie (bez mutacji `ref` w renderze, bo StrictMode); Navbar i Footer poza `PageFade`; `<main id="main">` w środku; `ScrollToTop` bez zmian. **Faza 2:** React 19.3 `<ViewTransition>` (19.3.0 stable z 2026-09-09 eksportuje `ViewTransition`, `addTransitionType`, `Activity`; zweryfikowane w scratchpadzie `react-check`), po ≥ 2 tygodniach stabilizacji i spike'u interakcji z `BrowserRouter`/`Suspense`/`ScrollToTop`; nigdy VT i Motion na tym samym elemencie |
| `HeroMedia` | poster/wideo hero (§6.4) | reduced/coarse/saveData/2g-3g/LPM → `<img>`; `MediaBoundary` wokół (awaria wideo = poster, nie pusty hero) |
| `ChartReveal` | clip-reveal L→R raz ≤ 450 ms (`clipPath: inset(0 100% 0 0) → inset(0)`, `EASE_SOFT`), replay przez `key` | tylko poniżej folda i tylko na treści nieobecnej w shellu; reduced → `initial={false}`; nigdy w hero |
| `DashboardMount` | osadzanie dashboardów | natywny `IntersectionObserver` (`once`, `rootMargin 0 0 20%`) + `requestIdleCallback` (fallback `setTimeout 1`) + kolejka szeregowa 150 ms + `React.lazy` z mapą literalnych ścieżek + `Suspense` `.skel` + `minHeight` + boundary; 0 KB Motion w chunku narzędzia |

`AnimatePresence` tylko w `BookingDialog` (overlay `opacity` 160 ms, panel `y` 8 → 0 240 ms, exit 160 ms) i menu mobilnym (`y` −8 → 0 200 ms). `@formkit/auto-animate` usunięty (jedna biblioteka). Faza 2: `WipeCompare` „Przed i po. Na żywo." na 3 flagowych podstronach po pomiarze repaintu `clip-path` nad `DemoReport` (Performance / Paint flashing; L8), przełącznik segmentowy `aria-pressed` pod reduced-motion; hover mikro-dema z nagrań `record-demos.mjs`.

### 6.4 `HeroMedia` i reguły `<video>`

`wantsVideo()` = `MOTION_TIER === "full"` ∧ brak `saveData` ∧ `effectiveType` ∉ {slow-2g, 2g, 3g} ∧ `(pointer: fine)` ∧ ¬`(prefers-reduced-motion: reduce)`. Efekt 1: po `window.load` → `setEnabled(true)`. Efekt 2: `IntersectionObserver` (≥ 25 % → `play()`, poza → `pause()`) + `visibilitychange` → `pause()`; `play().catch(() => setEnabled(false))` (iOS Low Power Mode = `NotAllowedError`); `suspend` + `paused` → poster. Render: `<img src=poster alt="" width=1920 height=820 fetchPriority="high" decoding="async">` zawsze; `<video muted playsInline loop preload="metadata" poster disablePictureInPicture disableRemotePlayback tabIndex={-1} aria-hidden>` tylko gdy `enabled`, `opacity` 0 → 1 po `onCanPlay`; przycisk „Zatrzymaj tło" (WIG) przełącza `paused` i zapamiętuje wybór w `sessionStorage`. Reguły strażnika: brak `muted`/`playsInline`/`poster` = fail; > 1 autoplay per trasa = fail; plik > 1,5 MB = fail; `<video>` w shellu = fail; tekst/logo/liczby w kadrze = fail (przegląd ręczny). CSS pas bezpieczeństwa: `@media (prefers-reduced-motion: reduce) { .hero-media video { display:none } }`.

### 6.5 Tabela degradacji

| Element | Desktop `pointer: fine` | `pointer: coarse` (telefon, tablet) | `prefers-reduced-motion` | `saveData` / 2g-3g | Bez JS (bot, LLM) |
|---|---|---|---|---|---|
| Tło hero | wideo po posterze (lub GLSL Hills po idle w planie B) | poster | poster / 1 klatka | poster | poster `<img>` w shellu |
| Reveale sekcji | fadeUp | fadeUp | fade (opacity only, `MotionConfig`) | fadeUp | shell bez `opacity:0` |
| Liczniki S5 | 0 → wartość | tak | `jump` | tak | liczby w HTML |
| Mini-komponenty S2 | fade 400 ms | tak | statyczne | tak | HTML/SVG z liczbami z SSR |
| Ramy S3 | hover `scale` obrazu; faza 2 hover-klip | brak hover; linki | brak | brak klipów | linki |
| Dashboardy | lazy + IO + `.chart-reveal` | lazy + IO | bez reveal | lazy | opis + FAQ w shellu |
| Trasy | `PageFade` | tak | brak (opacity dozwolone) | tak | pełny HTML per trasa |
| Dialog / menu | `AnimatePresence` | tak | bez transformu | tak | brak |

Test: Chrome DevTools „Emulate prefers-reduced-motion" + Windows „Efekty animacji" OFF + iOS „Ogranicz ruch" + Playwright WebKit 390×844; kryterium: zero elementów utkniętych w `initial`.

### 6.6 Zakazy (wpis do strażnika)

Sticky-stack, pinowanie i scroll-hijack niezależnie od techniki (decyzje Karola 2026-07-22 i 07-26), parallax, marquee, kursor własny, glitch/scramble tekstu, blur w wejściach, `layout` bez `domMax`, animowane SVG w tle (`stroke-dashoffset`, `pathLength`), „rysowanie" wykresów, `window.addEventListener("scroll")`, `transition: all` (dziś `Navbar.tsx:67,122`), `linear`/`ease-in-out` na interakcjach, drugie autoplay-wideo na trasie, `will-change` masowo, GSAP, three.js w tym samym drzewie co Motion, Motion w prerenderze, `initial` ukrywające treść nad foldem, nowy `position: fixed` w `.content-layer`, `overflow:hidden` na `html/body`.

### 6.7 Budżety (bramki mechaniczne w `verify-site.mjs` i Lighthouse w F4)

| Metryka | Budżet |
|---|---|
| LCP mobile (`/`, 4G, Moto G4) | < 2,5 s |
| LCP desktop | < 1,8 s |
| CLS | < 0,1 (cel 0,05) |
| INP | < 200 ms |
| JS krytyczny na `/` | ≤ 140 KB gz (react-dom ~58 + router ~15 + motion ~34 + app ~25) |
| Chunki Motion | ≤ 36 KB gz (wartość z `verify-site.mjs:248`) |
| Chunk podstrony narzędzia | ≤ +60 KB gz (ToolPage + 1 dashboard) |
| CSS | ≤ 20 KB gz |
| Fonty | ≤ 100 KB (Nunito solo) / ≤ 150 KB przy Geist (tylko subset latin ≤ 55 KB obok Nunito albo podmiana kroju; para z pełnym Geist = ~163 KB, nie przechodzi) |
| Hero wideo | ≤ 1,5 MB każdy format; poster ≤ 60 KB; LQIP ≤ 2 KB |
| Zrzuty dem | ≤ 120 KB (1280×800), miniatury ≤ 40 KB |
| Transfer pierwszego wejścia mobile (`/`, bez wideo) | ≤ 350 KB (60 + 135 + 20 + 93 + 10 ≈ 320) |
| Transfer desktop `/` z wideo | ≤ 2,5 MB |
| Autoplay `<video>` per trasa | 1 |
| Prerender | 19 HTML; `narzedzia.html` ≥ 13 linków `/narzedzia/`; 1 H1 i `<main>` per plik |

---

## 7. Assety i Higgsfield

### 7.1 Decyzja: jedno wideo na witrynę + A/B wobec GLSL Hills (D12)

Dokładnie jedno wideo (hero-loop 8–10 s, desktop `pointer: fine`, mobile = poster). GLSL Hills (three.js, 118 KB gz na wizytę desktop) schodzi z bundla `/` w F0 (plik i `BgBoundary` zostają w repo jako wzorzec GPU-higieny). Po trialu Higgsfield Karol ocenia pętlę testem „czy da się poznać, że to AI?": (a) TAK dla pętli → `three` i `@react-three/fiber` usuwane z `dependencies`; (b) NIE → GLSL Hills wraca jako tło `/` montowane po `requestIdleCallback` po `load`, tylko `pointer: fine`, z gatingiem `saveData`, bez `zoomRef`, z testem `PlaneGeometry 160×160`. Nigdy oba na jednej trasie.

### 7.2 Plan zakupu (D13)

1. **Trial 3-dniowy przez MCP: 100 kr za 0 $** (karta wymagana, auto-odnowienie na PLUS 49 $) → G1 + G2 + 2–3 podejścia G3 std = dowód stylu do oceny Karol + Paweł. Przypomnienie w kalendarzu na dzień 3 + `cancel_trial_auto_renewal` → `confirm_trial_cancel`.
2. Po akceptacji: **PLUS miesięczny 49 $ (1 000 kr, 6 równoległych wideo)** na finały; anulować po sprincie (kredyty i tak przepadają co miesiąc). **ULTRA (129 $) niepotrzebne** (jedno wideo). Plan roczny tylko przy decyzji o stałej produkcji treści. Nie kupować API `cloud.higgsfield.ai`. Konto i faktura: JDG Pawła.
3. `get_cost: true` przed każdą serią (cennik zmieniał się 4 razy w 3 miesiące), `show_plans_and_credits` w dniu zakupu, `generate_video_batch` + `jobs_wait` dla równoległych podejść, `sound: off` zawsze, 480p/720p do selekcji, 1080p tylko finał.

### 7.3 Lista assetów generatywnych G1–G7 (≈ 330–450 kr z rezerwą)

| # | Asset | Model (MCP) / parametry | Podejścia × koszt | Kredyty |
|---|---|---|---|---|
| G1 | Board stylu (10 stilli: „wzgórza ze stali", macro steel, satin plane) | `nano_banana_pro`, `resolution: 2k` | 10 × 2 | 20 |
| G2 | **Master still hero** 16:9 → crop 1920×820 (poster) | `nano_banana_pro` 4k lub `seedream_v4_5`, `image_references` = wybrany z G1 | 6 × 3 | 20 |
| G3 | **Hero loop** 8–10 s bezszwowy | `kling3_0`, `start_image = end_image = G2`, `duration 10`, `mode std` → `pro` (2 finały), `sound: off`, 16:9 | 6 × 14 + 2 × 30 | 145 |
| G4 | Macro brushed-steel still 4:5 (S7) | `nano_banana_pro` 2k, `image_references` = G2 | 5 × 2 | 10 |
| G5 | Tło OG 1200×630 (wordmark i zdanie dodane w `og.mjs`, nie w modelu) | `nano_banana_pro` 2k | 5 × 2 | 10 |
| G6 | Deflicker / upscale finału (tylko gdy banding) | `video_deflicker`, `bytedance_video_upscale` | 2 × ~30 | 60 |
| G7 | Rezerwa dogrywek i 2 dodatkowe podejścia pro | | | 65–185 |
| | **Suma** | | | **≈ 330–450** |

Trial (100) + PLUS (1 000) domyka z zapasem ≥ 2×.

### 7.4 Prompt-stałe (do każdego promptu)

Paleta `#A8B4C2 / #8895A6 / #69788C` na `#121212–#171717`; materiały brushed steel / satin chrome / graphite / 1px hairlines; single cool key light; kadr `locked-off camera, seamless loop, extremely slow motion, first and last frame identical`; negatywy `no people, no hands, no faces, no text, no letters, no numbers, no logo, no watermark, no gold, no orange, no neon, no sparks, no lens flare, no camera shake, no cuts`. Master still zatwierdzony przez Karola = `image_references` we wszystkich generacjach (jedyny mechanizm spójności; `seed` nie jest wystawiony w MCP). Prompty G2/G3/G4 dosłownie w `higgsfield.md` §7 (T-IMG-1, T-VID-1, T-IMG-4).

### 7.5 Pipeline ffmpeg (lokalnie, w scratchpadzie bez `&`)

`winget install Gyan.FFmpeg` → nowa sesja terminala. Kroki: `ffprobe` (fps, rozdzielczość, klatki) → normalizacja 24 fps, `-an`, `noise=alls=3:allf=t+u` (anty-banding) → trim zdublowanej ostatniej klatki (start = end) → crop `scale=1920:-2,crop=1920:820` → WebM VP9 `crf 33 -row-mt 1 -g 240` + H.264 `crf 24 -profile high -movflags +faststart -g 240` (opcjonalnie AV1 `libsvtav1 crf 38`) → poster WebP z **pierwszej** klatki ≤ 60 KB + LQIP 48 px → bramka rozmiaru (≤ 1,5 MB/plik) → `site/public/media/hero-v1.{webm,mp4,poster.webp}` + wpis w `site/media/SOURCES.md` (model, parametry, ID generacji, koszt, data). Podgląd na OLED (iPhone Karola) przed akceptacją.

### 7.6 Osadzenie `<video>` wg WIG

`<video autoplay muted loop playsinline preload="metadata" poster>` z `<source type='video/webm; codecs="vp9"'>` i `<source type='video/mp4; codecs="avc1.640028"'>` (H.264 dla Safari), kadr zastępczy (poster), pętla > 5 s obok treści → przycisk pauzy, `prefers-reduced-motion` → brak `<video>` w DOM, `aria-hidden` (dekoracja, treść w DOM), pauza poza viewportem i przy `document.hidden`, `width/height` na posterze (CLS), `<link rel="preload">` postera, `/media/*` immutable.

### 7.7 Licencja i higiena

Terms of Use Higgsfield (26.07.2026): licencja treningowa na inputy/outputy do czasu usunięcia treści; brak gwarancji IP outputu. Konsekwencje: do Higgsfield trafiają wyłącznie abstrakcje i własne stille; **nigdy** zrzuty narzędzi, dane klientów, materiały firmy źródłowej, zdjęcia founderów; generacje usuwane z konta po sprincie; produkcja finałów wyłącznie na planie płatnym (Free = znak wodny, bez użytku komercyjnego).

### 7.8 Assety za 0 kr

| # | Asset | Jak |
|---|---|---|
| M1 | 13 zrzutów dem + 3 zrzuty KSeF (mock) × 2 rozmiary (1280×800 ≤ 120 KB, 640×400 ≤ 40 KB) | `scripts/shoot-tools.mjs`: Playwright WebKit (`playwright-core` w scratchpadzie, `executablePath` do `~/AppData/Local/ms-playwright/webkit-*`), dla każdego sluga otwórz `/narzedzia/<slug>` z lokalnego `dist`, czekaj na `[data-ready]`, kliknij „Załaduj przykład" gdzie jest, zrzut elementu; dane deterministyczne = identyczne zrzuty |
| M2 | Portrety founderów × 2 (WebP 960×1200 ≤ 90 KB + 480×600) | founderzy; neutralne tło, jedno światło; duotone w Photoshop 2026 (Gradient Map `#121212 → #A8B4C2`, 3 % ziarna) lub, przy braku potwierdzonej licencji (D20), CSS `filter: grayscale(1) contrast(1.05)` + overlay `--accent` 12 % `mix-blend-mode: soft-light` (0 zależności) |
| M3 | Ikony | `lucide-react`, mapa w `data/home.ts` |
| M4 | `CollaborationFlow` | istniejący SVG, 1:1 |
| M5 | `KsefFlow` + (faza 2) ilustracje schematyczne case | nowe SVG na tokenach, ≤ 12 KB |
| M6 | Favicon, apple-touch-icon | istniejące („K" w stali) |
| M7 | OG per trasa | `scripts/og.mjs` (SVG → PNG w buildzie, deterministyczny: tło G5 + wordmark + tytuł), PNG ≤ 200 KB; F3 |
| M8 | Fonty | Nunito Sans woff2 self-hosted z `unicode-range`, `font-display: swap`, `<link rel="preload" as="font">` dla latin; zero CDN |
| M9 | Hover-klipy S3 (faza 2) | `scripts/record-demos.mjs` (Playwright `recordVideo` 1280×800, deterministyczny skrypt klików) → ffmpeg WebM ≤ 600 KB, 6 s, 24 fps + poster |

---

## 8. Refaktor bazowy i kod

### 8.1 Struktura docelowa `site/src/`

```
main.tsx                   StrictMode > BrowserRouter > LangProvider > MotionProvider > App
App.tsx (~150 l.)          routing + lazy pages + layout (Navbar/Footer poza PageFade) + BookingDialog (lazy)
i18n.tsx                   reuse (+ `use` zamiast `useContext`)
data/    messaging.ts · contact.ts · home.ts · oferta.ts · founders.ts · rodo.ts · tools.ts (+pola portfolio) · toolsSeo.ts · faq.ts (+2) · pagesSeo.ts (+rodo) · demo-sample.ts
motion/  tokens.ts · provider.tsx · presets.ts · Reveal.tsx · Counter.tsx · PageFade.tsx · ChartReveal.tsx
components/  layout/(Navbar Footer PageMain SkipLink) · HeroMedia · MediaBoundary · Bento · MiniReport · MiniKsef · MiniAudit · CaseFrame · CaseCard ·
             Outcomes · MetricsStrip · Steps · Contrast · FounderCard · ClosingCta · Chip · KsefFlow · DashboardMount · TrancheCalc · FaqList ·
             BookingDialog · Seo · CollaborationFlow · dashboards/(11 dashboardów + PdfButton, NIETYKANE w v1) + DemoReport.tsx (nietykany) = 12 dashboardów razem
pages/   Home · Tools · Tool · Offer · Faq · Rodo · NotFound   (każda = sekcje z data/*, lazy poza Home)
prerender/entry.tsx        shelle renderują z TYCH SAMYCH modułów data/* (bez Motion); scripts/prerender.mjs bez zmian mechaniki
lib/     report.ts · qualityGate.ts · pdf.ts (okno c1) + tranches.ts · g703.ts (nowe, czyste, z golden-testami)
styles/  tokens.css · company-ui.css (przycięty + blok aliasów) · globals.css (.bg-layer/.content-layer BEZ ZMIAN; bez zoom)
scripts/ prerender.mjs · shoot-tools.mjs · og.mjs · record-demos.mjs (faza 2)
         (bramki NIE tutaj: verify-site.mjs i audit-static.mjs żyją w .claude/skills/klarow-guardian/scripts/)
public/  _headers · _redirects · robots.txt · fonts/ · media/ (hero-v1.*) · thumbs/ · google<token>.html (GSC)
```

### 8.2 Code-splitting

`React.lazy` dla `ToolPage`, `OfferPage`, `FaqPage`, `RodoPage`, `NotFound`, `BookingDialog`, `TrancheCalc` i każdego z 12 dashboardów (11 plików w `components/dashboards/` + `DemoReport.tsx`). Mapa **`LOADERS: Record<DashboardKey, () => Promise<{ default: React.ComponentType }>>`**, gdzie `DashboardKey` jest eksportowany z `tools.ts` jako union kluczy pola `dashboard` (dziś: `report`, `production`, `quality`, `timeline`, `payments`, `reconciliation`, `g703`, `paymentflow`, `costcontrol`, `erpimports`, `protocols`, `contracts`). Typ `Record<DashboardKey, …>` jest tu obowiązkowy: kompilator zgłasza i brakujący, i nadmiarowy klucz, więc rozjazd „11 plików vs 12 dashboardów vs 13 kart" nie przejdzie przez `tsc` (`ToolPage.tsx:25` używa już tego wzorca dla mapy statycznej). Efekt: `index.js` traci ~60–90 KB gz dashboardów (dziś 156,8 KB gz z 12 dashboardami w środku, `ToolPage.tsx:7-18` importuje je statycznie) i 118 KB gz three.js (lazy tylko w planie B). Preload chunku podstrony na `onMouseEnter`/`onFocus` karty (LOW).

### 8.3 Jedno źródło zdań i danych

- `data/messaging.ts`: `oneLiner`, `subtext`, `pillars`, `determinism`, `zeroVendorCloud`, `cta` (jedna etykieta per intencja: „Umów 30 minut" rozmowa, „Zobacz realizacje" dowód, „Przyślij najgorszy Excel" plik), `closing`, `proofLabels`, **`allowedNumbers: [{ value: { pl, en }, label: { pl, en }, status: "ok" | "frozen" | "toConfirm", source }]`**, `bannedWords`. `value` jest parą PL/EN, bo dwie z czterech pozycji paska S5 to słowa („kilkanaście" / „a dozen-plus", „co do grosza" / „to the cent"), a nie cyfry. `status` jest lustrem rejestru `references/allowed-numbers.md` i steruje bramką (niżej).
- `data/contact.ts`: `ORIGIN`, `EMAIL`, `PHONE_DISPLAY 786 296 426`, `PHONE_E164 +48 786 296 426`, `PHONE_HREF tel:+48786296426` (dziś 4 kopie: `BookingModal.tsx:10-12`, `App.tsx:643`, `Seo.tsx:8`, `entry.tsx:18-21`).
- Shelle prerendera (`HomeShell`, `ToolsShell`, `ToolShell` × 3 warianty `kind`, `OfferShell`, `FaqShell`, `RodoShell`, `NotFoundShell`) renderowane z `data/*` i `messaging.ts`; koniec ręcznej prozy `entry.tsx:103-417`. Mini-komponenty S2 i liczby S5 liczone w SSR przez te same czyste funkcje (`aggregate`, `auditRows`).
- Model `tools.ts`: `kind: "demo" | "case" | "product"`, `dashboard?: DashboardKey` (eksportowany union kluczy), `delivery {pl,en}`, `hook {pl,en}`, `client? {pl,en}`, `outcome {pl,en}`, `stack: string[]`, `year`, `media { thumb, wide, clip?, schematic? }`, `featured?: 1–4`. Lint danych w bramce: każdy wpis ma `delivery`, `hook` i `outcome` PL + EN (brak `en` przy istniejącym `pl` = BLOCKER).

### 8.4 Sprzątanie i zależności

Usunąć: `components/ui/{button,badge,card,canvas-reveal-effect,radial-orbital-timeline}.tsx` (897 linii martwych), `lib/utils.ts`, `content/`, `data/` (YAML), `public/screens/placeholder.svg`, `Logo.zip`, `zoomRef`, sondy decka w `index.html:88-104,160-171`, kotwice `#wyrozniki #wspolpraca #kontakt`, nieaktualne komentarze (`vite.config.ts:16-23` o Lightning CSS, `Seo.tsx:6` o sitemap), copy „Rezerwacja online pojawi się…" (`BookingModal.tsx:30,48`). Zależności: `@react-three/fiber`, `@radix-ui/react-slot`, `class-variance-authority`, `clsx`, `tailwind-merge`, `@formkit/auto-animate` (+ `three` po D12(a)). Dodać: `motion@13.2.0`, `eslint` + `eslint-plugin-react-hooks` + `eslint-plugin-jsx-a11y` (dev). `site/README.md` przepisany.

### 8.5 Jakość: ESLint, golden-testy, bramki strażnika, `npm run check`

> **Nie budujemy nowych skryptów bramkujących.** Poprzednie okno dostarczyło działające narzędzia i to ich używamy, pod ich nazwami i ścieżkami:
>
> ```bash
> node ".claude/skills/klarow-guardian/scripts/verify-site.mjs" --expected 19
> node ".claude/skills/klarow-guardian/scripts/audit-static.mjs" --fail-on=BLOCKER,HIGH \
>      --baseline=".claude/skills/klarow-guardian/baseline/audit-static-2026-09-12.jsonl"
> ```
>
> Pliku `audit-ui.mjs` ani katalogu `audit/` w repo nie ma; druga kopia `verify-site.mjs` w `site/scripts/` dałaby dwie rozjeżdżające się bramki, więc jej nie tworzymy. Baseline istniejącego długu to `baseline/audit-static-2026-09-12.jsonl`, nie `audit/baseline.jsonl`. Raport zbiorczy audytu (`audit/INDEX.md`) generuje workflow `ui-audit`, który używa tych samych skryptów.
>
> **Zadanie w F0 (uzgodnienie skryptu z planem, jeden commit):** (1) `id="seo-jsonld"` vs nazwa reguły `seo-jsonld-per-kind` w `verify-site.mjs` (regex w linii 189 sprawdza poprawne `seo-jsonld`, ale komunikat i nagłówek mówią o `seo-jsonld-per-kind`, co przy czytaniu wyniku myli; ujednolicić nazewnictwo albo w regule, albo w komunikacie); (2) budżet Motion: 36 KB w skrypcie (linia 248) i w planie (§6.1, §6.7) po tej poprawce jest zgodny, przy każdej zmianie ruszają się oba miejsca naraz.

- **ESLint** (`react-hooks`, `jsx-a11y`) uruchamiany `node node_modules/eslint/bin/eslint.js src`.
- **`node --test`** golden-testy: `lib/report.ts`, `lib/qualityGate.ts`, `lib/tranches.ts`, `lib/g703.ts`: dwa przebiegi = identyczny JSON (`deepStrictEqual`), zero `Date.now`/`Math.random`/`fetch` w `lib/**` i `dashboards/**` (grep w teście). `lib/tranches.ts` (algorytm alokacji proporcjonalnej w groszach z resztą na ostatniej pozycji, jak `PaymentCalculator.tsx:21`) i `lib/g703.ts` (earned = D × M, proposal = earned − billed po progu 40 %, clawback nieprzycinany, jak `G703Billing.tsx:36-41`) powstają jako **nowe czyste moduły**; dashboardy przełączają się na import z `lib/` dopiero w fazie 2 (w v1 `dashboards/*.tsx` są nietykane, §12).
- **`verify-site.mjs`** (po buildzie, na `site/dist`): 19 plików HTML; 1 H1, `<main>` i `id="seo-jsonld"` raz na plik; `narzedzia.html` i DOM po JS ≥ 13 linków `/narzedzia/<slug>`; `index.html` linkuje do 4 realizacji + huba; `sitemap.xml` = trasy − `404` − `/rodo` (do przeglądu radcy, potem − `404`); `llms.txt` istnieje; `grep -ri nuconic dist` = 0; `#FFA914` = 0; NAP w 3 dozwolonych wariantach; rozmiary chunków vs budżety §6.7; każdy `<video>` z `muted playsinline poster`; `picsum|unsplash|fonts.googleapis|cdnjs|unpkg` = 0; shell-vs-DOM (Playwright WebKit porównuje zbiór H1/H2/p z `dist/index.html` i `dist/narzedzia.html` z DOM po starcie Reacta; dozwolone różnice: liczniki, chipy filtrów) w F3.
- **Bramka „—" = 0 z jawną listą wyłączeń.** Grep po `site/src` wyłącza pliki, których §12.1 zabrania dotykać w v1: `site/src/components/dashboards/**`, `site/src/components/DemoReport.tsx`, `site/src/lib/pdf*` (dziś `pdf.ts`, po refaktorze c1 także `pdf*.mjs`). Stan na 2026-09-12: 621 wystąpień „—" w `site/src`, z czego **495 do sweepu w v1** i **126 w plikach wyłączonych** (dashboardy 102, `DemoReport.tsx` 22, `pdf.ts` 2, w tym stopka „dokument DEMO — dane fikcyjne" w `pdf.ts:103`). Ta sama lista wyłączeń obowiązuje w `audit-static.mjs` (reguła `i18n-pl-typography`) i w hooku `PostToolUse`. W `dist` bramka „—" = 0 **nie** obowiązuje dopóki dashboardy nie są posprzątane: dashboardy renderują się w `dist` tylko po starcie Reacta, ale stopka PDF i teksty dem trafiają do chunków, więc audyt `dist` liczy „—" wyłącznie w statycznym HTML shelli, nie w `assets/*.js`. Sweep 126 wystąpień = faza 2, po merge okna c1 (§11, §12.3).
- **Bramka liczb (trzy statusy, lustro `references/allowed-numbers.md`).** Nie „każda liczba w `dist` jest w `allowedNumbers`", bo D7(b) i §4.5 świadomie ZOSTAWIAJĄ liczby w istniejących opisach, a odpowiedzi FAQ są zawsze w DOM (§9.1), więc trafiają do `dist`:
  - **OK**: wolno wszędzie (12, 13, 30 minut, 20–250 osób, ≤ 10 dni, 5–10 dni, NAP, 2026, „co do grosza", liczby rynkowe ze źródłem w tym samym zdaniu).
  - **ZAMROŻONE**: wolno **tylko w plikach, w których już są**, whitelist: `site/src/data/faq.ts` („mniej niż dwa miesięczne koszty etatu kontrolera", „6+ miesięcy i kwoty od 100 tys. zł", „3–4 dni", „~40%", „kilkanaście narzędzi", „~10 tys. wierszy"), `site/src/data/toolsSeo.ts` i `site/src/data/tools.ts` (m.in. „~30 projektów", „kilkanaście sekund"), opisy podstron w `src/prerender/entry.tsx`. Pojawienie się takiej liczby na `/` albo w nowym pliku = BLOCKER; zniknięcie z pliku źródłowego jest dozwolone (sprzątamy, nie dodajemy).
  - **DO POTWIERDZENIA**: nie wolno publikować do wpisu w `docs/DECISIONS.md` (dziś m.in. „3 dni", „89 testów", „12 dni", „15 integracji").
  - **Kwoty przy usługach:** zakaz dotyczy cennika Klarow (pilot, retainer, panel, sprint USA) w PLN i USD. **Wyjątek jawny:** opis narzędzia `billing-us-g703` mówi o walucie i mechanice arkuszy AIA G702/G703 („w USD", „wykonanie × wartość − dotychczas") bez podawania stawek Klarow (`tools.ts:446,460`, `toolsSeo.ts:374,398`); to opis produktu klienta, nie nasza cena.
  - **Dowód, że to nie jest teoretyczne:** `verify-site.mjs` na dzisiejszym `site/dist` zgłasza już `site/dist/faq.html:1 - MEDIUM [brand-allowed-numbers-only] liczba „40%" w treści bez wpisu w allowed-numbers.md`. Przy severity HIGH i `--fail-on=BLOCKER,HIGH` ten sam wpis blokowałby push.
  - **Alternatywa (gdyby founderzy woleli twardą bramkę):** przepisać 6 odpowiedzi FAQ w F3 tak, żeby nie zawierały liczb, i dopiero wtedy włączyć regułę „każda liczba w `allowedNumbers`". Do tego czasu bramka bez whitelisty zapaliłaby `npm run check` na czerwono w dniu włączenia.
- **`npm run check`** = `tsc --noEmit` → `vite build` (klient + SSR + prerender) → `node ".claude/skills/klarow-guardian/scripts/verify-site.mjs" --expected 19` → `node ".claude/skills/klarow-guardian/scripts/audit-static.mjs" --fail-on=BLOCKER,HIGH --baseline=".claude/skills/klarow-guardian/baseline/audit-static-2026-09-12.jsonl"` → ESLint → `node --test`. Bramka przed pushem (D22); skrypty wołane przez `node` z pełną ścieżką w cudzysłowie, bo `npx` w tym repo nie działa. Cloudflare Pages CI: `npm run build` bez zmian + `verify-site.mjs` jako krok soft (warn) do czasu zielonego baseline.

### 8.6 Pakiet a11y

`<main id="main">` w kliencie (dziś `PageMain` = `div`, shell ma `<main>`, React go usuwa) + skip-link; `BookingDialog` na natywnym `<dialog>` (`showModal`, focus-trap, `Esc`, zwrot fokusu, `overscroll-behavior: contain`); menu mobilne `inert` gdy zamknięte; `focus-visible` 2,5 px `--ring` na wszystkim interaktywnym (Navbar dziś bez ringa); FAQ `aria-controls` + `id`; ikony `aria-hidden` przy tekście; obrazy z `width/height` i `alt`; tekst UI ≥ `.75rem`; `scroll-padding-top` pod sticky nav; `color-scheme: dark`, `theme-color`; `translate="no"` na `KLAROW`, `KSeF`, `G703`; Lighthouse a11y ≥ 95.

### 8.7 Drobne, ale obowiązkowe

- **Bug daty** `BookingModal.tsx:78` (`toISOString().slice(0,10)` daje dzień wcześniejszy w UTC+1/+2): składać `YYYY-MM-DD` z `getFullYear/getMonth/getDate`.
- `Seo.tsx:64`: `jsonLd` jako nowa tablica co render → efekt odpala się co render; stabilizować przez `useMemo` lub klucz string.
- `i18n.tsx`: inline `<script>` w `index.html` ustawia `data-lang`/`lang` z `localStorage` przed pierwszym renderem (flash PL → EN); `use(LangContext)` zamiast `useContext`.
- `_headers`: `/media/*`, `/thumbs/*` immutable; `index.html` fallback meta = `pagesSeo.home` (dziś „12 działających demo").
- `twitter:*` w prerenderze; `noindex` na 404.

---

## 9. SEO / GEO / i18n / pomiar

### 9.1 Must-keep (nie regresować)

19 HTML z pełną treścią bez JS; generowane `sitemap.xml` i `llms.txt`; canonical bez `www`; JSON-LD z dedupe `id="seo-jsonld"`; odpowiedzi FAQ zawsze w DOM; `pagesSeo.ts`/`toolsSeo.ts` jako jedno źródło meta (title ≤ 60/62, description 130–165, PL + EN); `_redirects` SPA fallback (lub zawężony), `_headers` `no-cache` dla HTML, samonaprawa cache w `index.html`; `robots.txt` z `Sitemap:`; sekcje `lang="en"` w shellach; 13 stabilnych slugów; NAP jednolite; `.content-layer` bez z-index, `.bg-layer z-index:-1`; PL kanoniczne + przełącznik EN.

### 9.2 Pomiar przed publikacją (D15)

1. **Google Search Console**: property domenowa `klarow.com` (TXT w Cloudflare DNS) + plik weryfikacji w `public/`; zgłoszenie `https://klarow.com/sitemap.xml`. Właściciel: Paweł.
2. **Cloudflare Web Analytics** (cookieless, bez banera): snippet w `index.html` (obowiązuje w 19 HTML) ładowany po `load`.
3. **Zdarzenia CTA**: `cta_book_open`, `cta_mail`, `cta_tel`, `cta_worst_excel`, `demo_load_example`, `demo_replay`, `pdf_download`, `lang_toggle`, `founders_view`, `calc_tranche_run`, `rodo_objection_click`. Mechanizm: Cloudflare Zaraz (`zaraz.track`) albo Pages Function `functions/api/e.ts` → Workers Analytics Engine (bez cookies, bez PII); wybór po sprawdzeniu w panelu CF, czy Web Analytics ma zdarzenia niestandardowe (luka L3). Zdarzenia emitowane poza silnikami dem (determinizm).
4. **UTM**: profile LinkedIn (`utm_source=linkedin&utm_medium=profile`), wiadomości (`utm_medium=message`), maile (`utm_medium=email&utm_campaign=outbound`), QR/wizytówki (`/start` → `utm_source=qr`), posty bota (`utm_source=linkedin&utm_medium=post`; prompt `post-bot/worker.js` ma linkować do konkretnej podstrony z UTM).
5. **Cal.com** jako konwersja twarda (D14): w v1 link zewnętrzny z `BookingDialog` (0 skryptów, 0 CSP), embed w fazie 2 z CSP i wpisem w `/rodo`.

### 9.3 i18n

PL kanoniczne, EN przez `pick()`; wszystkie nowe stringi `{ pl, en }`; `data-lang` przed pierwszym renderem; trasy `/pl/` `/en/` **nadal odroczone** (decyzja Karola), dane gotowe na split build-time; hreflang dopiero wtedy. Znane ograniczenie: EN meta z `toolsSeo.ts` niewidoczne dla Google do czasu `/en/`; boty bez JS dostają EN przez sekcje `lang="en"` i `llms.txt`.

### 9.4 Excel-lock, mapa podmian

H1 + shell (`App.tsx:98-99`, `entry.tsx:108`), meta home (`pagesSeo.ts:22-23`), `Organization` (`Seo.tsx:77-78`), `llms.txt` (`entry.tsx:449-452, 491-494`), oferta „Dla kogo" (`App.tsx:431-438`), wyróżnik (`Differentiators.tsx:15,19,46`), ból (`App.tsx:282`), `index.html:7-18`, prompt bota (`post-bot/worker.js:25`), nagłówki LinkedIn: wszystko na `messaging.ts`.

---

## 10. Prawo i copy (z `peer-legal.md`)

1. **`/rodo` to twardy bloker outboundu**: bez opublikowanej klauzuli art. 14 nie wysyłamy ani jednego kontaktu handlowego (precedens Bisnode 943 470 zł, potwierdzony przez NSA; plan kontroli UODO 2026 obejmuje bazy marketingowe). Szablony outboundu odsyłają do `klarow.com/rodo`. Treść §4.6, przegląd radcy D16.
2. **PKE (art. 398, od 10.11.2024)**: informacja handlowa tylko po uprzedniej zgodzie, także do osób prawnych i na `biuro@`; soft opt-in w Polsce nie istnieje; uzasadniony interes RODO nie zastępuje zgody PKE (WSA II SA/Wa 62/25). Na stronie: żaden formularz nie sugeruje, że zapis = zgoda marketingowa; newsletter (jeśli powstanie) = double opt-in z odrębną, niezaznaczoną domyślnie zgodą; „Przyślij najgorszy Excel" jest inboundem (art. 398 ust. 2) i nie wymaga zgody.
3. **Liczby**: na home wyłącznie liczby własne z `allowedNumbers` (§3 S5). W materiałach sprzedażowych i na `/oferta` lub w FAQ dozwolone tylko liczby ze źródłem podanym obok: mediana kontrolera 8 350 zł brutto/mies. (Sedlak & Sedlak, OBW 2026); składki pracodawcy 20,48 % → ~121 tys. zł/rok (ZUS 2026; działanie `8 350 × 12 × 1,2048 ≈ 121 000` pokazane czytelnikowi); Time to Hire 33 dni / Time to Fill 56 dni (rynek PL, II poł. 2025); 88 % arkuszy zawiera błędy w formułach (Panko, University of Hawai'i, „What We Know About Spreadsheet Errors"); 19–20 % czasu na wyszukiwanie informacji (McKinsey Global Institute, 2012). **Zakaz:** „raport Deloitte/IDC o czasie traconym w Excelu" (brak oryginału). **Zakaz framingu odejmowania etatu** („oszczędzimy wam etat", „nie zatrudniajcie"); poprawna forma: „nie proponujemy, żeby ten etat zniknął; proponujemy, żeby te 121 tys. kupowało analizę, a nie sklejanie arkuszy".
4. **Zero słowa „AI" w komunikacji sprzedażowej**; na stronie AI pojawia się wyłącznie w zdaniu-kotwicy determinizmu i w FAQ „Czy AI liczy moje dane?" (jako zaprzeczenie).
5. **Marka poprzedniej firmy**: zero nazwy, liczb przypisywalnych, zrzutów, logo; „firma produkcyjno-budowlana"; `grep -ri nuconic dist` = 0 jako BLOCKER; karty case i „15 narzędzi" dopiero po umowie IP (D7). Dodatkowo: potwierdzić, czy repo GitHub jest prywatne (luka L1), bo `docs/nuconic-ekosystem-referencja.md` i CLAUDE.md łamią zasadę #3, jeśli jest publiczne.
6. **Sekrety**: klucz Anthropic z appki KSeF do rotacji (poza repo); pliki z kluczami na OneDrive do Menedżera poświadczeń; hook `PreToolUse` blokujący odczyt `.env*` (D21).

---

## 11. Plan wdrożenia w fazach F0–F5

Role: **CC** = Claude Code (implementacja, skrypty, shelle, testy, audyt); **K** = Karol (oko marki: board, assety, zrzuty, tryb mock KSeF, test iPhone, Photoshop); **P** = Paweł (decyzje biznesowe, copy S4 i bio, Cal.com, GSC/DNS, faktura Higgsfield, umowa IP, radca dla `/rodo`). Każda faza kończy się commitem i pushem na `main` (zasada #4); każda sesja aktualizacją stanu operacyjnego (zasada #7).

| Faza | Dni | Kto | Zakres | Definition of Done | Punkt weryfikacji |
|---|---|---|---|---|---|
| **F0 · Decyzje + fundament** | **4** (3 fundament + **1 osobny dzień em-dash sweep**; sweep jest w F0 przy każdej opcji D11, bo wszystkie trzy zakazują „—") | CC; P: decyzje D1–D24 → `docs/DECISIONS.md`; K: rotacja klucza | Spotkanie decyzyjne; **przenumerowanie ID decyzji w skillu strażnika** (`grep -rn "D-[0-9]" .claude/skills/klarow-guardian` → podmiana wg tabeli przejścia z `decyzje-founderow-v2.md`, ten sam commit co `docs/DECISIONS.md`); `messaging.ts`, `contact.ts`, `founders.ts`, `rodo.ts` (szkielet §4.6 wraz z sekcją 8a o profilowaniu i sekcją 6 o transferze do USA); **inwentarz klas CSS przed cięciem (§5.5)** i przycięcie `company-ui.css` + zrzuty 12 dashboardów przed/po; `tokens.css` 3 warstwy + `@theme inline` + blok aliasów; usunięcie martwego kodu i 6 zależności; zdjęcie `zoom` roota + retest 12 dashboardów 1920/2560; `npm install motion@13.2.0`; `motion/*` (tokens, provider, presets); `DashboardMount` (natywny IO) + `React.lazy` `ToolPage` i stron (`LOADERS: Record<DashboardKey, …>`); `lib/tranches.ts`, `lib/g703.ts` + golden; ESLint; **uzgodnienie bramek strażnika z planem** (`seo-jsonld` vs `seo-jsonld-per-kind`, budżet Motion 36 KB, lista wyłączeń „—", trzy statusy liczb) bez tworzenia nowych skryptów; `npm run check`; `_redirects` aliasy (w tym `/polityka-prywatnosci → /rodo`), `_headers` `/media/*`; fix daty `BookingModal.tsx:78`; Navbar/Footer/PageMain/SkipLink na tokenach; `BookingDialog` (`<dialog>`, Cal.com link); trasy `/rodo` (`noindex` do przeglądu radcy) i `404` + shelle; em-dash sweep partiami z bramką długości `toolsSeo.ts` | `npm run check` zielony; **19 HTML**; `dist/index.html` bez three i dashboardów w `index.js` (≤ 140 KB gz); **0 „—" w `site/src` poza jawną listą wyłączeń** `components/dashboards/**`, `components/DemoReport.tsx`, `lib/pdf*` (495 z 621 wystąpień posprzątane; pozostałe 126 po merge okna c1, faza 2); `grep -ri nuconic dist` = 0; `DECISIONS.md` scommitowany i ID w skillu zgodne; `/rodo` z pełną treścią PL + EN (dane administratora wpisane); 12 dashboardów wizualnie bez zmian po cięciu CSS | tsc + build + verify; audyt bazowy = `baseline/audit-static-2026-09-12.jsonl` (istniejący, nie tworzymy nowego); zrzuty WebKit 390×844 i 1440×900 (normal + reduced-motion) bez regresji; preview deploy: `curl -I` nieznanej ścieżki (404) i `/realizacje/raport-zarzadczy` (301) |
| **F1 · Assety** (równolegle z F2) | **2** (+ czas founderów) | CC: skrypty, ffmpeg, MCP; K: przegląd, mock KSeF, Photoshop; P: konto/faktura | Trial Higgsfield: G1 + G2 + 2–3 podejścia G3 std → przegląd K + P (test „czy widać, że to AI?") → decyzja D12 → (PLUS) G3 pro, G4, G5, G6/G7; pipeline ffmpeg; `shoot-tools.mjs` (13 zrzutów × 2 rozmiary + 3 KSeF mock); portrety + duotone; `site/media/SOURCES.md`; `cancel_trial_auto_renewal` w kalendarzu | `public/media/hero-v1.*` ≤ 1,5 MB, poster ≤ 60 KB; 16 zrzutów w budżetach; `SOURCES.md` kompletny; trial anulowany lub świadomie przedłużony; generacje usunięte z konta po finale | Podgląd pętli na OLED (iPhone K); przegląd adwersarialny assetów (K): tekst/ludzie/logo w kadrze = odrzucone |
| **F2 · System + home** | **4** | CC; K: przegląd home (1 h); P: copy S4 (D23) + bio | `data/home.ts` (9 sekcji PL/EN), `pages/Home.tsx`, komponenty §5.6 (Bento + 3 mini-komponenty SSR-safe, CaseFrame, Outcomes, MetricsStrip + Counter, Steps × 5, Contrast, FounderCard, ClosingCta, KsefFlow), `HeroMedia` + `MediaBoundary`, `Reveal/RevealGroup/PageFade/ChartReveal`, `HomeShell` z danych (SSR liczb), `index.html`: preload postera + inline `data-lang` + snippet CF Web Analytics | Home na 1440/1024/768/390 + reduced-motion + `pointer: coarse` + bez JS (shell); Lighthouse mobile perf ≥ 90, a11y ≥ 95; JS `/` ≤ 140 KB gz; Motion ≤ 36 KB gz; 0 eyebrow; hero = 4 elementy; H1 ≤ 2 linie w PL **i** EN na 1024/1280/1440 (`getClientRects().length`); każda animacja z motywacją w 1 zdaniu | Zrzuty Playwright WebKit 390×844 + 1440×900 × {normal, reduced-motion, coarse} × {PL, EN}; **realny iPhone Karola** (`?debug=1` czysty; luka L16: `<video>` w hero pod `.content-layer`) |
| **F3 · Podstrony + SEO** | **3** | CC; P: FAQ +2, prompt bota; K: zrzuty mock | Hub (filtry w URL, 13 kart w DOM, `ItemList`, `.tools-strip` usunięty), `pages/Tool.tsx` dashboard-first (pasek akcji, `#sciezka`, 3 warianty `kind`, crosslinki, FAQ, CTA × 2), KSeF (relabel, `KsefFlow`, zrzuty mock, „Czego nie robi", bullet AI usunięty, `Service`), `/oferta` (Steps, Wycena, Dla kogo + przypis, `TrancheCalc` lazy, hak), `/faq` (+2), `/rodo` finalne copy po przeglądzie radcy, `404`; `pagesSeo.ts` (+`rodo`); `index.html` fallback; `twitter:*`; `lastmod` z gita; `llms.txt` z `messaging.ts`; `og.mjs`; Excel-lock mapa §9.4; prompt bota zsynchronizowany | 19 HTML; `verify-site.mjs` pełny (w tym `allowedNumbers`, NAP, linki, H1); `narzedzia.html` ≥ 13 linków; JSON-LD walidacja (Rich Results Test); bramka shell-vs-DOM dla `/` i `/narzedzia` = 0 rozjazdów | `curl dist/*.html` bez `opacity:0` na treści; WebKit `javaScriptEnabled: false` pokazuje H1, 4 realizacje, ✕/✓, FAQ, `/rodo` |
| **F4 · QA, pomiar, publikacja** | **2** | CC; P: GSC/DNS, Zaraz, UTM w profilach; K: iPhone, LinkedIn | `audit-static.mjs` w pełnym zakresie (hex poza tokenami, radius poza zbiorem per `data-surface`, eyebrow, `transition: all`, `text-[px]`, „—", atrybuty `<video>`, `import { motion }`, integracje zewnętrzne); Pre-Flight box po boxie; Lighthouse × 6 tras; DevTools Paint flashing przy scrollu; GSC property + `sitemap.xml`; CF Web Analytics; zdarzenia CTA; UTM; restrukturyzacja CLAUDE.md (≤ 200 linii + `docs/plan/stan-operacyjny.md` + `.claude/rules/`); commit + push `main`; KPI baseline | Pre-Flight 100 % zielony; `npm run check` zielony; produkcja na CF Pages serwuje 19 HTML (weryfikacja po treści, nie po hashach); `/rodo` i `/polityka-prywatnosci` (301) działają na produkcji; KPI baseline zapisany | `curl` markerów produkcji; realny iPhone na produkcji; `?debug=1` |
| **F5 · Bufor + start fazy 2** | **1–2** | wszyscy | Poprawki z przeglądu founderów, dogrywki assetów, regresje; kolejka fazy 2 spisana w `stan-operacyjny.md` | Zero otwartych BLOCKER/HIGH w `audit/INDEX.md` | |
| **Razem** | **14–15 dni przy F1 równolegle z F2 · 16–17 przy F1 sekwencyjnie** | | ≈ 3,5–4 tygodnie kalendarzowe | | |

Arytmetyka sumy (żeby nie było „osiemnastek" bez pokrycia): łańcuch krytyczny przy F1 równolegle = F0 4 + F2 4 + F3 3 + F4 2 + F5 1–2 = **14–15**; gdy F1 nie zmieści się równolegle (zależy od czasu founderów na przegląd assetów po trialu), dochodzą 2 dni → **16–17**. `synthesis.md` §0 p. 9 podawał 15–17 dni w 5 fazach; różnica to dopisane **F5 = bufor 1–2 dni** i F0 policzone jako pełne 4 dni (3 + 1 dzień sweepu), a nie „3–4".

**Pierwszy publikowalny przyrost:** koniec F0 (dzień 4): ta sama treść wizualnie, ale nowy fundament, `/rodo` z pełną treścią, `404`, aliasy, lżejszy bundle; można odblokować outbound (po przeglądzie `/rodo` przez founderów, radca równolegle). Drugi: koniec F2 (dzień ~8, licząc F1 równolegle): nowy home. Trzeci: koniec F3 (dzień ~11): komplet. Publikacja: F4 (dzień ~13, przy F1 sekwencyjnie ~15); F5 zamyka się na dniu 14–17.

**Ścieżka krytyczna:** decyzje founderów (F0, ~1 dzień ich czasu; domyślne wybory z `decyzje-founderow-v2.md` obowiązują przy braku odpowiedzi) → dane administratora do `/rodo` (bez nich strona nie idzie na produkcję) → portrety + bio (D6) → przegląd assetów po trialu (D12) → umowa IP (D7; nie blokuje publikacji, blokuje „15" i karty case). Bez portretów: wariant D6(b). Bez decyzji o pętli: plan B (GLSL Hills po idle).

**Kolejność sekcji home w F2:** hero → bento → realizacje → co osiągniesz → liczby → kroki → kalkulator/wróżka → founderzy → zamknięcie; każdy blok = 1 commit + Pre-Flight.

**Faza 2 (po publikacji, kolejność wg wartości):** (1) React 19.3.0 + `<ViewTransition>` po ≥ 2 tygodniach stabilizacji, osobny commit, spike 0,5 dnia (luka L4), reguła „`startViewTransition` pod `BrowserRouter` wymaga `useTransitions={false}` albo callbacku czekającego na commit; nigdy `flushSync(navigate)`"; (2) `WipeCompare` na 3 podstronach po pomiarze repaintu (1,5 dnia); (3) hover-klipy S3 z `record-demos.mjs` (1 dzień); (4) 2 anonimowe karty case z pełnym long-tailem `toolsSeo.ts` po umowie IP (1,5 dnia; 21 HTML); (5) dashboardy importują z `lib/tranches.ts`/`lib/g703.ts` (po zakończeniu pracy okna c1 na `pdf.ts`); (6) test Geist (D8) + ewentualne osadzenie kroju UI w PDF (**statyczne TTF: Regular 400, Bold 700, Italic 400**, zgodnie z §12.2 i D8; pdfmake rejestruje krój w slotach `normal/bold/italics/bolditalics`, więc plik 600 nie zastąpi `bold`, a brak zarejestrowanego stylu kończy się wyjątkiem przy generowaniu PDF); (7) formularz PKE (Pages Function + Turnstile + Resend, double opt-in, 2 dni); (8) `/blog/:slug`, `/partnerzy`; (9) migracja **235** inline `style=` w plikach nietykanych (`dashboards/**` + `DemoReport.tsx`) na tokeny (**1,5–2 dni**; wcześniejsza wycena 2–3 dni zakładała błędnie 455, czyli całe `site/src`); (10) 14. demo „Zamknięcie tygodnia jednym przyciskiem"; (11) trasy `/pl/ /en/` + hreflang; (12) Cal.com embed z CSP; (13) `domMax` dla siatki hubu, jeśli VT nie zadowala; (14) **em-dash sweep 126 wystąpień w `dashboards/**`, `DemoReport.tsx` i `lib/pdf*`** po merge okna c1, razem ze zdjęciem tych ścieżek z listy wyłączeń bramki „—" (0,5 dnia); (15) `/rodo` po przeglądzie radcy: zdjęcie `noindex`, wpis do sitemapy (0.3), podniesienie oczekiwań bramek i KPI indeksacji.

---

## 12. Koordynacja z oknem c1 (bot, `pdf.ts`)

1. **`site/src/lib/pdf.ts` → `pdfDoc.mjs` + `pdfDoc.d.mts` robi okno c1 PIERWSZE** (generator listów i one-pagerów musi renderować ten sam dokument w Node). Okno UI (ten plan) w v1 (F0–F4) **nie dotyka** wnętrza `pdf.ts`, `PdfButton.tsx` ani żadnego pliku `components/dashboards/*.tsx` i `DemoReport.tsx`; jedyne zmiany wokół dashboardów to `React.lazy` w mapie `LOADERS` (`DashboardMount`/`ToolPage.tsx`) i opakowanie w `DashboardMount`. Dlatego silniki `lib/tranches.ts` i `lib/g703.ts` powstają jako nowe moduły, a przełączenie dashboardów na nie czeka do fazy 2.
2. **Font w PDF: decyzja B, PDF zostaje na Roboto** (zero wzrostu lazy-chunku pdfmake); API `PdfDoc.font` domyślnie `"Roboto"`. Ewentualne osadzenie kroju UI dopiero po decyzji founderów o foncie v2 (wtedy okno UI dostarcza **trzy statyczne TTF: Regular 400, Bold 700, Italic 400** (ta sama trójka w D8 i w §11 faza 2 p. 6); pdfmake nie czyta WOFF2 ani fontów variable, rejestruje krój w slotach `normal/bold/italics/bolditalics`, więc waga 600 nie zastąpi slotu `bold`, a brak zarejestrowanego stylu = wyjątek przy generowaniu; kursywa jest używana w bloku quote, więc nie da się jej pominąć).
3. **Gwarancja zerowej regresji od c1:** `blocks?: Block[]` opcjonalne, `footer` domyślnie dzisiejszy tekst co do znaku, więc 12 podstron i `PdfButton` działają bez zmian; po merge c1 okno UI klika „Pobierz PDF" na `/narzedzia/obieg-przelewow` i porównuje layout, stopkę i polskie znaki. Uwaga c1: stopka PDF zawiera „—" (`"klarow.com · dokument DEMO — dane fikcyjne"`, dziś `site/src/lib/pdf.ts:103`); zamiana na „klarow.com · dokument DEMO: dane fikcyjne" wchodzi do em-dash sweepu **po** stronie c1 (żeby nie zderzyć się w pliku). **Pełna lista wyłączeń bramki „—" = 0 w v1** (ta sama w DoD F0, w `audit-static.mjs` i w hooku `PostToolUse`): `site/src/lib/pdf.ts` i `site/src/lib/pdf*.mjs` (2 wystąpienia), `site/src/components/dashboards/**` (102), `site/src/components/DemoReport.tsx` (22) = razem **126 z 621**. Wyłączenie obejmuje DZISIEJSZY `pdf.ts`, nie tylko plik, który dopiero powstanie u c1; bez tego DoD F0 byłby niewykonalny bez złamania §12.1.
4. **Ograniczenia copy z c1** (liczby ze źródłem, zakaz Deloitte/IDC, zakaz framingu odejmowania etatu, zero „AI" w sprzedaży, formularze bez domyślnych zgód, newsletter double opt-in) wchodzą do strażnika jako reguły `copy-*` i `legal-*`; prompt bota `/post` dostaje te same zakazy i link do `/rodo` w każdym poście z CTA.
5. **`/rodo`**: trasa kanoniczna, prerender `dist/rodo.html`, link w stopce; `/polityka-prywatnosci` = 301 w `_redirects`. Szablony outboundu c1 linkują do `klarow.com/rodo` i działają normalnie mimo `noindex` (D16-b): strona jest publiczna, tylko niezaindeksowana do przeglądu radcy.
6. Punkt synchronizacji: koniec F0 (okno UI publikuje `messaging.ts`; c1 kopiuje one-liner do promptu bota i szablonów), koniec F3 (URL-e z UTM dla bota).

---

## 13. Ryzyka R1–R15 i mitigacje

| # | Ryzyko | Prawdop. / skutek | Mitigacja |
|---|---|---|---|
| R1 | Hero-wideo psuje LCP mobile lub wraca „samo tło" na iPhonie (nowy element `<video>` w hero pod `.content-layer`) | średnie / wysoki | wideo desktop-only po `load`; poster = LCP preload; `absolute` w kontenerze hero z `overflow:hidden`, nigdy `fixed`, nigdy z-index na `.content-layer`; `MediaBoundary`; test WebKit 390×844 + realny iPhone po F2 (L16) |
| R2 | Motion ukrywa treść bez JS lub mignięcie po podmianie shellu | wysokie bez reguły / średni | `initial={false}` na hero i pierwszym montażu `PageFade`; Motion nigdy w `entry.tsx`; `ChartReveal` tylko poniżej folda na treści spoza shellu; test „strona bez JS" w F3 |
| R3 | Bundle rośnie (ktoś wciągnie `domMax`, pełny `motion`, three) | średnie / średni | `LazyMotion strict`; bramka rozmiaru chunków w `verify-site.mjs`; three poza `dependencies` po D12(a) |
| R4 | Hub bez linków w DOM (jak dziś) | pewne bez zmiany / wysoki | 13 kart zawsze w DOM, filtr = `hidden`; assert ≥ 13 linków w HTML i po JS |
| R5 | Etykieta „Wdrożone" bez pokrycia; liczby firmy źródłowej; „u klientów" w liczbie mnogiej | pewne dziś / wysoki (prawdziwość, IP) | KSeF = „Własny produkt"; `allowedNumbers` ze źródłem + bramka; D7; reguła strażnika: „Wdrożone" tylko z dowodem, liczba mnoga zakazana do 2. klienta |
| R6 | `/rodo` niekompletne (brak danych administratora) blokuje publikację i outbound | średnie / wysoki | dane JDG w F0 jako warunek DoD; szkielet CC + przegląd founderów, radca równolegle (D16) |
| R7 | Founderzy nie dostarczą zdjęć/bio | średnie / wysoki dla LinkedIn | wariant D6(b) z inicjałem; nigdy stock; sekcja usuwana, nie placeholderowana |
| R8 | Higgsfield: trial auto-odnawia się; banding/flicker; pętla nie jest bezszwowa w MCP (L7) | wysokie, proste / niski | `cancel_trial_auto_renewal` w kalendarzu; `noise` + `deflicker`; `ffprobe` pierwszej/ostatniej klatki; plan B GLSL Hills; strona działa bez wideo (poster) |
| R9 | Em-dash sweep psuje limity title/description w `toolsSeo.ts` (L15) | średnie / średni | przebudowa zdań partiami z bramką długości w `check-copy.mjs`; osobny dzień w F0 |
| R10 | Cal.com embed = skrypt zewnętrzny (CSP, narracja „zero chmury dostawcy") | średnie / średni | v1 link zewnętrzny; embed dopiero po wpisie w `/rodo` i rejestrze integracji (faza 2) |
| R11 | React 19.3 i `<ViewTransition>` zbyt świeże; interakcja z `BrowserRouter`/lazy/`ScrollToTop` nietestowana (L4) | średnie / niski | v1 na 19.2.7 z `PageFade`; upgrade w fazie 2 po spike'u; reguła `motion-view-transition-rules` |
| R12 | Dryf przekazu (bot, LinkedIn, wizytówki, `index.html`) | wysokie / średni | `messaging.ts` + ręczna synchronizacja promptu bota w tym samym commicie; bramka diff |
| R13 | Konflikt z oknem c1 w `pdf.ts`/dashboardach; DoD „0 „—" w `site/src`" wymusza edycję plików nietykanych | średnie / wysoki (umowa z c1) | §12: dashboardy i `pdf.ts` nietykane w v1; przełączenie silników w fazie 2; **jawna lista wyłączeń grepa „—"**: `components/dashboards/**`, `components/DemoReport.tsx`, `lib/pdf*` (126 z 621 wystąpień) w DoD F0, `audit-static.mjs` i hooku; sweep tych plików dopiero po merge c1 |
| R14 | Zdjęcie `zoom` roota zmienia wygląd dashboardów na 4K; Playwright WebKit nie odtwarza kompozycji GPU iOS | niskie / niski | retest 1920/2560 w F0 (L11); realny iPhone jako bramka wydania |
| R15 | Repo publiczne → `docs/nuconic-ekosystem-referencja.md` i CLAUDE.md łamią zasadę #3 (L1) | nieznane / wysoki | P sprawdza widoczność repo przed F0; jeśli publiczne: repo prywatne albo `docs/` do osobnego prywatnego repo |

---

## 14. KPI 90 dni po publikacji

| Obszar | KPI | Cel | Narzędzie |
|---|---|---|---|
| Indeksacja | zaindeksowane trasy | 17/17 (19 HTML minus `404` i `/rodo` z `noindex`); 18/18 po przeglądzie radcy i zdjęciu `noindex` | GSC → Pages |
| Widoczność | zapytania non-brand z wyświetleniami; wyświetlenia `/narzedzia/*` | ≥ 20 zapytań; wzrost tygodniowy | GSC |
| CTR organiczny | CTR podstron narzędzi | ≥ 2 % | GSC |
| Ruch wg kanału | sesje z `utm_source` linkedin / qr / email / partner / post | raport w piątkowym retro | CF Web Analytics / Zaraz |
| Zaangażowanie dowodem | % wizyt na podstronie narzędzia z interakcją (załaduj przykład / odtwórz / PDF) | ≥ 30 % | zdarzenia |
| Konwersja miękka | kliknięcia CTA (dialog, `mailto:`, `tel:`, „najgorszy Excel") / sesje | 2–4 % | zdarzenia |
| Konwersja twarda | rezerwacje Cal.com / miesiąc | ≥ 2 (start), 3–5 po 2–3 mies. | Cal.com + zdarzenie |
| Ciepły ruch | % sesji z LinkedIn/QR, które dotarły do S8 lub `/oferta` | ≥ 50 % | `founders_view`, odsłony `/oferta` |
| Jakość techniczna | LCP mobile < 2,5 s, CLS < 0,1, INP < 200 ms; 0 błędów `?debug=1` | zielone | CF Web Analytics (CWV), Lighthouse |
| Zgodność | `/rodo` opublikowane przed pierwszym kontaktem; 0 wysyłek bez zgody PKE; 0 sprzeciwów nieobsłużonych w 7 dni | 100 % | ręcznie, log sprzeciwów |
| Higiena treści | bramki strażnika (marka poprzedniej firmy = 0, NAP, liczby wg trzech statusów, złoto = 0, „—" = 0 poza listą wyłączeń §8.5) | 100 % zielone | `npm run check` |

Rytm: liczby strony dopisane do piątkowego retro obok liczb outboundu; jeden wniosek tygodnia = jedna zmiana.

---

## 15. Odsyłacz do decyzji

Wszystkie decyzje, które ten plan zakłada jako domyślne, są w **`docs/plan/decyzje-founderow-v2.md`** (D1–D24 + 6 faktów do dostarczenia). Bez odpowiedzi do **2026-09-16, 18:00** obowiązują tam wpisane wybory domyślne; po spotkaniu decyzyjnym Claude Code przepisuje wynik do `docs/DECISIONS.md` (append-only) i zaczyna F0 dnia 2026-09-17. Numeracja `D1–D24` tego planu i numeracja `D-01–D-23` z `synthesis.md` oraz ze skilla strażnika **nie są tożsame**: tabela przejścia jest w `decyzje-founderow-v2.md` §„Tabela przejścia numeracji", a podmiana ID w `.claude/skills/klarow-guardian/**` jest zadaniem F0.

---

## 16. Załącznik A: mapa przeszczepów z `synthesis.md` → sekcja planu

Checklista kompletności wobec `synthesis.md` §1.3–1.5. Pozycji jest **26** (9 + 10 + 7), mimo że streszczenie synthesis mówi o „21 przeszczepach": wiążąca jest ta tabela. Kolumna „Faza" = kiedy element powstaje (0 = fundament F0, 1 = v1 F1–F4, 2 = po publikacji, S = warstwa strażnika).

| ID | Przeszczep | Gdzie w tym planie | Faza |
|---|---|---|---|
| P1 | Subtext hero z enumeracją typów pracy (17 słów) | §1.1 (tabela one-linera), §3 S1 | 1 |
| P2 | Podstrona narzędzia dashboard-first | §4.2 (szkic ekranu + `DashboardMount`) | 1 |
| P3 | `KsefFlow`: 4 węzły + przekreślona strzałka zwrotna | §4.3, §5.6 (komponent) | 1 |
| P4 | `messaging.ts` z `allowedNumbers` i polem `source` + bramka liczb | §8.3, §8.5 (trzy statusy), §3 S5 | 0 |
| P5 | Nagłówek „Kalkulator, nie wróżka" + para nr 1 o API modelu językowego | §3 S7 | 1 |
| P6 | Trzecia żywa komórka bento bez Excela (`MiniKsef`) | §3 S2 (3 mini-komponenty) | 1 |
| P7 | Plan B tła: GLSL Hills po `requestIdleCallback` | §7.1, D12 | 1 |
| P8 | `ChartReveal` (clip-reveal ≤ 450 ms, tylko poniżej folda) | §6.3 | 1 |
| P9 | `lib/tranches.ts` + `lib/g703.ts` + golden-testy `node --test` | §8.1 (struktura), §8.5 (testy), §11 F0 | 0 |
| S1 | `WipeCompare` „Przed i po. Na żywo." na 3 podstronach | §6.3 (faza 2), §4.2, §11 faza 2 p. 2 | 2 |
| S2 | Nagłówek S8 „Rozmawiasz z osobą, która narzędzie zbudowała" + lead | §3 S8 | 1 |
| S3 | Biały płaski CTA `--cta #FAFAFA` / `--on-cta #121212` | §5.2 (tokeny), D9 | 0 |
| S4 | Aliasy `_redirects` (`/realizacje`, `/realizacje/*`, `/start`) | §2.2 | 0 |
| S5 | Bramka shell-vs-DOM (Playwright WebKit) | §8.5, DoD F3 | 1 |
| S6 | 5 kroków z „Zakres zamrożony" jako osobnym krokiem | §3 S6, §4.4 (Harmonogram) | 1 |
| S7 | 2 anonimowe karty case (tylko w hubie, tylko po D7) | §11 faza 2 p. 4, §2.4, D7 | 2 |
| S8 | Reguły motion w formacie „reguła · mechanizm · test" + tabela degradacji | §6.5, §6.6 (i `rules/motion-*` w strażniku) | S |
| S9 | `record-demos.mjs` (hover-klipy) i `og.mjs` (OG per trasa) | §7.8 M7 i M9, §11 faza 2 p. 3 | 2 |
| S10 | `MediaBoundary` + tokeny ruchu także w CSS | §5.6, §6.2, §6.3 | 1 |
| R1 | Sekcja „Co osiągniesz" (4 efekty, zero liczb) | §3 S4, D23 | 1 |
| R2 | Pasek „W liczbach" w języku ICP (bez „89 testów", bez „Telegram") | §3 S5, §10 p. 3 | 1 |
| R3 | Nazwa S3 „Realizacje i dema" do czasu umowy IP | §3 S3, §2.1 (etykieta nav) | 1 |
| R4 | Nunito Sans solo w v1; Geist tylko w budżecie fontów | §5.3, §6.7, D8 | 1 |
| R5 | Estymata: F0 3–4 dni, em-dash sweep jako osobna pozycja | §11 (tabela faz i arytmetyka sumy) | 0 |
| R6 | `PageFade` bez mutacji `ref` w renderze; `DashboardMount` na natywnym `IntersectionObserver` | §6.3 | 0 |
| R7 | Zdjęcie `zoom` roota 1.08/1.18 + retest dashboardów 1920/2560 | §5.4, DoD F0, R14 | 0 |

Odrzucone przeszczepy (`synthesis.md` §1.6) są wypisane w §0 p. 3 i nie wracają bez decyzji founderów: scena pinowana 300dvh, kalkulator „ile dni zajmie pilot", kalkulator G703 na home, kafle spoza ICP, „Claude Code" w copy founderów, parallax hero, eyebrow mono-caps, mono w UI, React 19.3 w fazie 1, `MOTION_TIER` jako druga ścieżka renderu.
