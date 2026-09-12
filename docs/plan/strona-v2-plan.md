# klarow.com v2 „CV firmy": plan przebudowy

> Data: 2026-09-12 · Dla: Paweł + Karol (decyzje) oraz okna implementacyjne Claude Code · Stan repo: `b9677ea`
> Źródła: `scratchpad/synthesis.md` (finalna specyfikacja po sądzie 3 koncepcji), 3 sądy (`judges/*`), koncepcja zwycięska `concepts/editorial.md`, 11 raportów researchu, paczka prawna `research/peer-legal.md`.
> Decyzje founderów, które ten plan zakłada jako domyślne, są wypisane osobno w `docs/plan/decyzje-founderow-v2.md` (D1–D24). Tam, gdzie plan mówi „domyślnie", obowiązuje wybór domyślny z tamtego pliku, dopóki founderzy nie zdecydują inaczej.
>
> Konwencje tego dokumentu: bez pauzy „—" (zasada strażnika); półpauza „–" tylko w zakresach liczbowych; terminy techniczne po angielsku; ścieżki względem korzenia repo `C:/Users/bibac/OneDrive/Desktop/Karol & Paweł app` (ścieżka ma spację i `&`, więc `npx` nie działa, binarki wołamy przez `node node_modules/...`).
> Marka poprzedniej firmy nie pada w treści przeznaczonej na stronę; w tym dokumencie występuje wyłącznie w nazwach bramek audytu (`grep -ri nuconic dist` = 0, §8.5, §10 p.5, DoD F0, R15, KPI) i w ścieżkach plików repo (`docs/nuconic-ekosystem-referencja.md`); tak samo w `decyzje-founderow-v2.md` (hook `PreToolUse` w D21, fakt F1). W copy publicznym zawsze „firma produkcyjno-budowlana", więc audyt „słowo = 0" należy uruchamiać na `dist/` i `site/src`, nie na `docs/plan/`. Żaden `.env` nie był czytany.

---

## 0. Streszczenie (10 zdań)

> **Korekta 2026-09-12 po dyrektywie founderów** (brak zarejestrowanej działalności i NIP; strona jest wizytówką i CV dwóch osób, z naciskiem na pokazanie narzędzi): pełne uzasadnienie w `docs/plan/reframe-2026-09-12.md`. Punkty, które przestały być prawdziwe, są poprawione poniżej; wideo generatywne, pasek „W liczbach" i etykieta „Realizacje" wypadły z v1.

1. Przebudowujemy klarow.com z „katalogu 12 dem z Excelem w H1" na **CV dwóch osób i ich warsztatu**: stronę, która w 10 sekund mówi CFO firmy produkcyjnej CO budujemy, DLA KOGO i CO ON osiągnie, a dowód (13 klikalnych narzędzi: 12 dem i 1 własny produkt) pokazuje zamiast opisywać. **Pierwszy dowód stoi bezpośrednio pod hero jako żywe demo liczące plik odwiedzającego.**
2. Wygrała koncepcja **editorial „KLAROW Monografia"** (23,5 pkt u trzech sędziów vs 21,5 proof i 16 showreel): hairlines zamiast boxów, typografia jako grafika, zero decka i karuzeli, najmniejsze ryzyko techniczne i najtańsze assety. **Wizual hero i cały dowód robimy ze zrzutów prawdziwych narzędzi** (Playwright, 0 kr, deterministyczne), a nie z assetu generatywnego.
3. Do editorialu przeszczepiamy **26 elementów** z przegranych koncepcji i researchu (9 z proof `P1–P9`, 10 z showreel `S1–S10`, 7 z researchu `R1–R7`; komplet z przypisaniem do sekcji planu w **§16**). Uwaga: `synthesis.md` §0 p.2 podaje zbiorczo „21 przeszczepów", ale jego własne tabele §1.3–1.5 wyliczają 26 pozycji, więc wiążąca jest lista z §16, nie liczba ze streszczenia. Najważniejsze: subtext hero z enumeracją typów pracy, podstrona narzędzia dashboard-first, diagram `KsefFlow`, `messaging.ts` z listą dozwolonych liczb ze źródłem, nagłówek „Kalkulator, nie wróżka", trzecia żywa komórka bento bez Excela, plan B tła (GLSL Hills), `WipeCompare` na 3 podstronach (faza 2), biały płaski CTA, aliasy `_redirects`, bramka shell-vs-DOM, 5 kroków z „Zakres zamrożony" i obowiązkowa sekcja **„Co osiągniesz"**, której nie miała żadna z trzech koncepcji.
4. Trasy i 13 slugów `/narzedzia/:slug` zostają bez zmian (inwestycja SEO od lipca); dochodzą `/rodo` (art. 14 RODO, precedens Bisnode 943 470 zł) i `404`; prerender rośnie z 17 do **19 statycznych HTML**. `/rodo` ma **dwa progi, nie jeden** (§10 p. 1): publikacja strony wymaga tożsamości administratora (`SITE_PUBLISHABLE`), pierwszy kontakt handlowy wymaga dodatkowo `OUTREACH_READY`; rejestracja działalności nie jest warunkiem żadnego z nich, jest warunkiem pierwszej faktury.
5. Motion = `motion@13.2.0` w wariancie oszczędnym (`LazyMotion domAnimation` + `m.*` + `MotionConfig reducedMotion="user"`, ≤ 36 KB gz), **3 komponenty** (`Reveal`/`RevealGroup`, `PageFade`, `ChartReveal`), 4 czasy, 1 krzywa, zero scroll-linked, zero pinowania; React 19.3 z `<ViewTransition>` dopiero w fazie 2.
6. **Wideo: zero w v1** (D28, D13). Hero niesie kadr prawdziwego pulpitu produkcji (WebP ≤ 110 KB desktop, ≤ 55 KB mobile, `fetchpriority="high"`), GLSL Hills schodzi z `/` w F0 i zostaje w repo jako wzorzec GPU-higieny, a Higgsfielda nie kupujemy: nie ma podmiotu, który przyjmie fakturę, a asset abstrakcyjny przegrywa u tej persony z kadrem produktu. Wideo generatywne wraca do rozmowy w fazie 2, warunkowo (§7.1).
7. Design system v3: ciemna stal zostaje (8,9:1), `tokens.css` w trzech warstwach z `@theme inline` zerującym palety Tailwinda, CTA biały płaski `#FAFAFA` na `#121212`, Nunito Sans solo w v1, Shape Lock {0, 8, 10, 12, 999}, lucide `strokeWidth 1.5` (ikony 16 px: 1.75).
8. Refaktor bazowy (code-splitting 12 dashboardów, rozbicie `App.tsx` 845 linii, shelle prerendera z tych samych danych co React, ESLint + golden-testy silników, bramki strażnika) jest wspólnym fundamentem i kosztuje 3 dni niezależnie od koncepcji; em-dash sweep to osobny dzień i obejmuje **495 z 621 „—" w `site/src`**: pozostałe **126 siedzi w plikach nietykanych w v1** (`components/dashboards/**` 102, `components/DemoReport.tsx` 22, `lib/pdf.ts` 2) i idzie do sweepu dopiero po merge okna c1 (faza 2, §11 i §12.3).
9. Realna estymata po reframe: **15–16 dni roboczych** (F0 4 + F1 1 + F2 4 + F3 3 + F4 2 + F5 1–2; arytmetyka w §11) i ~3,5–4 tygodnie kalendarzowe. F1 skurczyło się do 1 dnia (bez Higgsfielda i ffmpega), ale **weszło na ścieżkę krytyczną**: zrzuty narzędzi wymagają `DashboardMount`, zdjętego `zoom` roota i przyciętego `company-ui.css`, czyli DoD fazy F0, a bez nich hero i ściana w F2 stoją na placeholderach. Ścieżka krytyczna: decyzje founderów, **tożsamość administratora do `/rodo`**, portrety i bio, zrzuty narzędzi (F1) oraz umowa IP z poprzednią firmą.
10. Kupujemy: stronę, która działa bez JS (SEO/GEO), ładuje się na iPhonie w < 2,5 s, ma jeden zestaw zdań marki w 7 miejscach naraz, jest zgodna z RODO/PKE i ma mierzalny lejek (GSC + Cloudflare Web Analytics + zdarzenia CTA); do tego strażnika reguł, który pilnuje, żeby kolejne sesje nie cofnęły żadnej z tych decyzji.

---

## 1. Cel i przekaz

### 1.1 One-liner (jedno zdanie na wszystkich powierzchniach; D1)

| | PL | EN |
|---|---|---|
| **H1 / LinkedIn / prompt bota** | Narzędzia pod Twój proces. Działają w dni, dane zostają u Ciebie. | Tools built around your process. Working in days, your data stays with you. |
| **Subtext hero (17 słów)** | Kontroling, integracje (KSeF, ERP), importy, obieg dokumentów, panele. Dla firm 20–250 osób z produkcji, budownictwa i dystrybucji. | Controlling, integrations (KSeF, ERP), imports, document workflows, dashboards. For 20–250-person manufacturing, construction and distribution companies. |

Jedyne źródło: `site/src/data/messaging.ts`. Konsumują je: `Hero`, `pagesSeo.ts`, `ORG_JSONLD` w `Seo.tsx`, `llms.txt` w `prerender/entry.tsx`, fallback meta w `index.html`, prompt bota `post-bot/worker.js` (kopiowany ręcznie w tym samym commicie), nagłówki LinkedIn founderów. Bramka strażnika: diff między tymi powierzchniami = 0.

Po reframe `messaging.ts` dostaje dwa dodatkowe pola i jedną podmianę (D31): **`builtLabel`** = „Co zbudowaliśmy" / „What we've built" (H2 sekcji dowodu na `/`), **`toolsLabel`** = „Narzędzia" / „Tools" (nawigacja, stopka, okruszek) oraz `cta.secondary` = **„Zobacz narzędzia" / „See the tools"** (było „Zobacz realizacje" / „See our work"). H1 hubu jest osobnym stringiem („Narzędzia, które zbudowaliśmy" / „Tools we have built"), żeby nie duplikować nagłówka między `/` a `/narzedzia`.

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

**Głos dwóch osób, nie podmiotu (reframe 2026-09-12).** Do czasu rejestracji działalności w copy publicznym nie pada „nasza firma", „nasza spółka", „nasz zespół", „nasi eksperci", „nasze biuro", „od X lat na rynku", „lata doświadczenia", ani EN „our company", „our team", „years of experience". Mówimy „budujemy", „dwie osoby", „KLAROW". Nazwa marki w stopce i w JSON-LD zostaje; nie dopisujemy do niej formy prawnej, NIP-u ani adresu siedziby (§2.5, §10 p. 7). Zakazane też „wystawiamy fakturę VAT" i „faktura z odroczonym terminem" do rejestracji; model rozliczenia („stała cena za ustalony zakres", „płatność 50/50") wolno opisywać, bo opisuje treść przyszłej umowy, i towarzyszy mu zdanie „Cenę i zakres zapisujemy w umowie przed startem."

Founder-led, problem-first, zdania oznajmujące, sentence case PL i EN, zero pytań retorycznych, zero „łatwo / prosto / szybko" bez liczby, zero słów z `messaging.bannedWords` (PL: „podnieś na wyższy poziom", „bezproblemowo", „bezszwowo", „uwolnij potencjał", „nowej generacji", „rewolucjonizuj", „game-changer", „kompleksowe rozwiązanie", „transformacja cyfrowa", „w dzisiejszym świecie", „AI liczy"; EN: „elevate", „seamless", „unleash", „next-gen", „revolutionize", „game-changer", „delve", „tapestry", „in the world of").

---

## 2. Architektura informacji

### 2.1 Trasy

| Trasa | Status | Etykieta nav PL / EN | Prerender | Sitemap | JSON-LD |
|---|---|---|---|---|---|
| `/` | zostaje, nowa treść (9 sekcji, §3) | `KLAROW` (wordmark → home) | `dist/index.html` | 1.0 | `Organization` (wzbogacony) |
| `/narzedzia` | zostaje (URL kanoniczny), nowa etykieta i treść | **Narzędzia** / Tools (D31) | `dist/narzedzia.html` | 0.9 | `Organization` + **`ItemList`** (13 pozycji) |
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
- Grupy: **„Własny produkt"** (dziś jedna pozycja: KSeF) oraz „Dema na danych przykładowych (12)" / „Demos on sample data (12)" (liczba liczona z danych, nie wpisana). **Nazwa pierwszej grupy jest liczona z danych, nie wpisana na stałe** (`kind !== "demo"`): 1 pozycja → „Własny produkt" / „Own product"; ≥ 2 pozycje → „Własne produkty i wdrożenia" / „Own products and deployments". Powód: R5 i reguła strażnika `brand-honest-labels` zakazują liczby mnogiej i słowa „wdrożenia" do 2. pozycji z pokryciem (D5: „Wdrożone" dopiero po pierwszym kliencie albo udokumentowanym żywym przebiegu). Etykieta rośnie sama, gdy po umowie IP dojdą karty case.
- **Kolejność kart = jawne pole `order: number` w `tools.ts`**, nie sortowanie po `id` (czyli nie kolejność powstawania). Kolejność v2: `kontroling-ksef` · `kontroling-kosztow`, `raport-zarzadczy` · `import-z-rekoncyliacja`, `audyt-jakosci-danych`, `importy-erp` · `os-czasu-zadan`, `dashboard-produkcji` · `billing-us-g703`, `obieg-przelewow`, `kalkulator-transz` · `protokoly-robocizny`, `rejestr-umow`. Ta sama kolejność steruje ścianą na `/` (§3 S3).
- Pas kolumn działów `.tools-strip` (`globals.css:84-111`) i drill-down znikają.

### 2.5 JSON-LD

- `Organization`: `name`, `url`, `logo` (`/klarow-logo-512.png`), `description` = `messaging.oneLiner`, `telephone` `+48 786 296 426`, `email`, `areaServed ["PL","US"]`, `contactPoint`, `sameAs` (LinkedIn founderów po D6), `founder` (po D6 i F4). **Typ `Organization` zostaje także przed rejestracją działalności** (schema.org nie wymaga osobowości prawnej), ale **bez pól `legalName`, `vatID`, `taxID`, `duns`, `address`, `foundingDate`, `numberOfEmployees`**: byłyby oświadczeniem nieprawdy w danych strukturalnych. `ProfessionalService` i `LocalBusiness` są zakazane do czasu posiadania adresu działalności (podanie adresu domowego, żeby zadowolić schemat, jest gorsze niż brak schematu); `Person` wolno użyć wyłącznie w polu `founder`, nigdy jako typ główny.
- `ItemList` na `/narzedzia` z 13 `ListItem` (`position`, `url`, `name`).
- `SoftwareApplication` bez `offers` tylko dla `kind: "demo"`; `Service` (`serviceType`, `provider: Organization`, `areaServed`) dla `product` i `case` (dziś `SoftwareApplication` z ceną 0 dla KSeF jest mylące, `site-audit.md` §3.4 p.11).
- `FAQPage` na `/faq` (8 pytań) i per narzędzie (4 Q&A z `toolsSeo.ts`), zawsze z pokryciem w DOM.

### 2.6 Sitemap i `llms.txt`

Generowane z `tools.ts` i listy tras (ręcznego `public/sitemap.xml` nie ma i nie odtwarzamy). Trasa wchodzi do sitemapy tylko, jeśli nie ma `noindex`: dziś wypadają `404` i `/rodo` (do przeglądu radcy, §4.6), czyli 17 `<loc>`. `llms.txt` linkuje do `/rodo` mimo `noindex` (to link dla ludzi i botów LLM, nie zgłoszenie do indeksu). Nowość: `<lastmod>` z `git log -1 --format=%cI -- <plik danych trasy>` liczony w `scripts/prerender.mjs`; gdy git niedostępny w CI, `lastmod` pomijamy (nigdy `Date.now`). `llms.txt` pisany z `messaging.ts`: one-liner, 3 filary, etykiety dowodu, 13 linków, kontakt, sekcja EN, link do `/rodo`.

---

## 3. Strona główna, sekcja po sekcji (faktyczne copy)

> **Korekta 2026-09-12 (reframe, `docs/plan/reframe-2026-09-12.md`).** Kolejność sekcji zmieniona,
> pasek „W liczbach" usunięty, dowód wchodzi na pozycję 2 jako żywe demo, a wizual hero to kadr
> prawdziwego narzędzia, nie pętla generatywna. Decyzje: D28–D33.
>
> **Korekta korekty 2026-09-12, wieczór (`docs/plan/warstwa-wrazenia.md`, decyzje D36–D38).** Wideo
> wraca do v1: kadr produktu w hero **zostaje i nadal jest LCP**, bo jest klatką zero **nagrania tego
> samego narzędzia**, które startuje po `window.load` (8 s, jedno odtworzenie, tylko desktop). Cztery
> kafle pierwszego rzędu ściany dostają mikro-nagrania na hover (D35 zmienione). Higgsfield wchodzi
> **wyłącznie jako statyczna faktura** (grunt hero, tło OG) i materiał poza stroną.

Konwencje: kontener `--container: 72rem`, gutter `clamp(16px, 4vw, 40px)`, siatka 12 kolumn `gap 24px` (16 px < 1024), sekcja `padding-block: clamp(64px, 9vw, 120px)`, separator = hairline `1px var(--border)`. 9 sekcji = 9 rodzin layoutu, **eyebrow count = 0**, nagłówek ≤ 6 słów, lead ≤ 20 słów. Dane wszystkich sekcji w `src/data/home.ts` jako `{ pl, en }`; ten sam moduł karmi `HomeShell` w prerenderze.

**Kolejność i job każdej sekcji (v2 po reframe; D32):**

| Poz. | Sekcja | Job | Rodzina layoutu |
|---|---|---|---|
| S1 | Hero z kadrem produktu | hook | split hero, kadr wychodzi poza siatkę |
| S2 | „Sprawdź to na swoim pliku" (żywe demo) | proof (interakcja) | pojedynczy panel pełnej szerokości |
| S3 | „Co zbudowaliśmy" (1 featured + 12 kafli) | proof (masa) | featured + ściana kafli |
| S4 | „Co budujemy" (6 typów pracy) | educate | gapless bento 3×2 |
| S5 | „Co osiągniesz" | outcome | 2×2 z hairline |
| S6 | „Rozmawiasz z osobą, która to zbudowała" | trust | podpis 4/12 + 2 portrety |
| S7 | „Kalkulator, nie wróżka" | differentiator | side-image 60/40 |
| S8 | „Jak pracujemy" (5 kroków) | educate | rząd kroków |
| S9 | Zamknięcie + stopka | convert | mini closing |

Żadne dwie sąsiednie sekcje nie mają tej samej rodziny layoutu; próg `design-no-three-equal-cards` (≥ 5 rodzin na trasę) spełniony z zapasem. **Usunięta wobec wersji z rana:** sekcja „W liczbach" (pasek metryk), D30.

**Reguła długości leadów (jedno miejsce, zamiast liczb przy sekcjach):** każdy lead PL i EN ma ≤ 20 słów; mierzy to bramka copy w `audit-static.mjs` na `data/home.ts` (`split(/\s+/).length`), nie ten dokument. Konkretne liczby słów nie są tu powtarzane, bo rozjeżdżały się z tekstem przy każdej redakcji zdania (audyt 2026-09-12: 6 z 10 etykiet było o 1 słowo obok).

**Reguła kompletności PL + EN:** każdy string widoczny na stronie ma parę `{ pl, en }`. Dotyczy to także pól, które wyglądają na „same liczby lub znaczniki": `value` w `allowedNumbers` (§8.3), `hook` karty narzędzia, `delivery`, linia opisowa w stopce, `alt` obrazu. Model: `value: { pl, en }`, nie `value: string`. Bramka danych w `audit-static.mjs`: brak `en` przy istniejącym `pl` = BLOCKER.

### S1 · Hero (split: tekst 1–6, kadr produktu 7–12) · job: hook

- **Dokładnie 4 elementy:** `<h1>` one-liner (D1), `<p>` subtext (treść w §1.1), wiersz CTA (primary biały **„Umów 30 minut" / „Book 30 minutes"** → `BookingDialog`; ghost **„Zobacz narzędzia" / „See the tools"** → `/narzedzia`), media. Usunięte względem dziś: chipy ikonowe, telefon pod CTA, duplikat wordmarku.
- **Media = prawdziwe narzędzie: kadr, który po sekundzie zaczyna liczyć (D28 + D37).** `public/media/hero-production-v1.webp` 1600×1000 ≤ 110 KB (`srcset` 800×500 ≤ 55 KB) to **klatka zero nagrania** `ProductionDashboard`, wyciągnięta z gotowego pliku wideo (`ffmpeg -frames:v 1` bez `-ss`), nie osobny screenshot: dwa przebiegi renderowania dają inny antyaliasing, więc crossfade byłby widocznym przeskokiem. Rama hairline 1 px `--border`, `border-radius: 0`, **przycięcie layoutem** (`overflow: hidden` na kolumnach 7–12), nie obrazem. Zero `three.js`, zero overlayu gradientowego nad tekstem: tekst stoi na `--background`, więc kontrast jest gwarantowany bez liczenia najjaśniejszej klatki. Powód wyboru `ProductionDashboard`: najsilniejsze rozpoznanie branżowe z dwóch metrów i zero drobnego tekstu tabel po przeskalowaniu. `DemoReport` świadomie nie idzie do hero, bo pracuje w S2.
- **Warstwy hero (kolejność w DOM = kolejność malowania, zero `z-index`):**

| Warstwa | Co to jest | Plik | Uwagi |
|---|---|---|---|
| L0 | `.bg-layer`: gradient na tokenach, `fixed`, `z-index: -1` | globals.css | nietykana (`media-video-placement`) |
| L1 | **grunt stalowy**: satynowa płyta, maska radialna, `opacity .35` | `hero-ground-v1.webp` ≤ 70 KB (Higgsfield H1) | `<img aria-hidden loading="lazy" decoding="async">`, nigdy `fixed`, nigdy preload |
| L2 | rama kadru `.hero-media` (`position: absolute`, longhandy, `overflow: hidden`) | CSS | jedyne dozwolone miejsce mediów |
| L3 | **poster = kadr produktu = LCP** | `hero-production-v1.webp` | `<img>`, `fetchpriority="high"`, `width/height` |
| L4 | **nagranie N1**: ten sam dashboard, 8 s, **jedno odtworzenie, bez `loop`** | `hero-production-v1.webm` / `.mp4` | `opacity: 0` do `canplay`, potem crossfade 600 ms; poster zostaje pod spodem |
| L5 | kontrola pauzy `hero-media-toggle` (WCAG 2.2.2), prawy dolny róg ramy, POZA `aria-hidden` | `<button class="btn btn-secondary btn-sm">` | etykieta „Zatrzymaj podgląd / Pause preview"; nie liczy się do czterech elementów hero |
| L6 | tekst hero: H1, lead, CTA (kolumny 1–6) | K | bez animacji wejścia |

- **Kolejność ładowania i bezpiecznik:** shell prerendera (H1, lead, 2 linki, `<img>` poster, zero `<video>`) → preload postera → CSS i fonty → po pierwszej farbie grunt L1 (lazy) → `window.load` **i** `requestIdleCallback` → `wantsVideo()` (`MEDIA_ENABLED` → reduced-motion → `pointer: fine` → `saveData` → 2g/3g) → montaż `<video preload="metadata">` → `canplay` → crossfade 600 ms → `IntersectionObserver` < 25 % pauzuje → koniec nagrania zatrzymuje obraz na ostatniej klatce (bez pętli i bez przycisku „Odtwórz ponownie"). **Bezpiecznik: brak `canplay` w 4 s od montażu = `setEnabled(false)` i zostaje poster** (inaczej crossfade wchodzi, gdy użytkownik czyta już S2, i czyta się jako usterka).
- **Scena nagrania N1 (8 s):** 0,0–1,2 s bez ruchu (bufor na niewidoczny crossfade) · 1,2–3,0 suwak tygodnia o jedną pozycję, kafle przeliczają wartości · 3,0–4,2 jeden kafel zmienia status na ryzyko · 4,2–6,0 klik w ten kafel, rozwija się rozbicie etapowe · 6,0–8,0 spoczynek.
- **LCP:** `<link rel="preload" as="image" href="/media/hero-production-v1.webp" fetchpriority="high">` w `index.html`, jawne `width`/`height`, bez `loading="lazy"`. **Wideo nigdy nie jest preloadowane, a bramka jest elementowa, nie tylko czasowa: element LCP na `/` musi być `img.hero-shot`** (`perf-lcp-poster-preload`). Grunt L1 nie konkuruje o LCP (`loading="lazy"`, bez `fetchpriority`). `alt`: „Pulpit produkcji: kafle hal i suwak tygodnia, dane przykładowe" / „Production dashboard: hall tiles and a week slider, sample data".
- **Layout:** `min-height: min(86dvh, 820px)` (mobile `min(72dvh, 640px)`), tekst w kolumnach 1–6 wyrównany do dołu, padding `clamp(40px, 6vw, 72px)`. Mobile: kadr pod tekstem, ta sama rama, `max-height 320px`, `object-fit: cover; object-position: top`. Szkielet iOS bez zmian (`.content-layer` bez z-index, `.bg-layer z-index:-1` zostaje jako gradient tła).
- **Typografia:** H1 `--text-display: clamp(2rem, 3.6vw + .5rem, 3.5rem)`, waga 700, `letter-spacing -.02em`, `line-height 1.05`, `overflow-wrap: anywhere`; `max-width` startowo `34ch`, **z planem B 38–42ch**. Cel: ≤ 2 linie na ≥ 1024 px. **Test zrzutem w PL i EN** na 1024/1280/1440 (EN jest dłuższe: 74 znaki vs 64 w PL, a sam człon „Working in days, your data stays with you." ma 42 znaki). Kolejność środków, gdy EN łamie się na 3 linie: (1) `max-width` 38ch, (2) 42ch, (3) skrót EN „Tools built around your process. Working in days, your data stays yours." (zmiana w `messaging.ts`, czyli także na LinkedIn i w promptcie bota: decyzja D1). Bramka: skrypt zrzutów mierzy `document.querySelector("h1").getClientRects().length ≤ 2` dla obu języków na trzech szerokościach. Lead `clamp(1.0625rem, 1.6vw, 1.25rem)`, kolor `--foreground`.
- **Motion:** H1, lead, CTA i kadr **bez animacji wejścia** (`initial={false}`, shell prerenderu już je pokazuje; `motion-no-initial-hidden-above-fold` bez zmian). Jedyny ruch w hero to **crossfade poster → nagranie** (600 ms, `EASE_OUT`) i zatrzymanie na ostatniej klatce. Motywacja (`motion-motivated`, kategoria „stan"): kadr pokazuje, że liczby nie są obrazkiem, tylko wynikiem.
- **Prerender:** H1, lead, 2 linki, `<img>` kadru z `width/height`; **zero `<video>` i zero przycisku pauzy w shellu** (`grep -c "<video" dist/**/*.html` = 0). Wideo montuje wyłącznie React po `load`.

### S2 · „Sprawdź to na swoim pliku" / „Try it on your own file" (panel pełnej szerokości) · job: proof przez interakcję (NOWA, D29)

- **Nagłówek:** Sprawdź to na swoim pliku. / Try it on your own file. **Lead:** Demo raportu zarządczego liczy w tej karcie. Wgraj własny plik CSV: nie wychodzi z przeglądarki. / The management report demo computes in this tab. Upload your own CSV: it never leaves your browser.
- **Zawartość:** jeden panel na pełnej szerokości kontenera, w środku `DemoReport` (3 KPI, wykres per etap, tabela, ścieżka wyliczenia). **`DemoReport.tsx` i `components/dashboards/**` pozostają nietykane w v1** (§12.1): osadza je nowy komponent `DemoFrame`, który opakowuje, a nie edytuje.
- **`DemoFrame` (trzy stany, jedno pudełko, zero CLS):** (1) shell prerendera renderuje statyczny zrzut `DemoReport` (WebP 1280×800 ≤ 120 KB, `loading="lazy"`, `width/height`); (2) po starcie Reacta `IntersectionObserver` (`once`, `rootMargin 0 0 20%`) + `requestIdleCallback` montują `React.lazy` w tym samym pudełku, ze skeletonem `.skel` o **szerokości kontenera docelowego** i `min-height` z mapy `DASH_MINH`; (3) boundary błędu renderuje **ten sam zrzut** plus linię „Demo nie wczytało się. To jest zrzut z tego samego narzędzia." / „The demo did not load. This is a screenshot of the same tool." Awaria JS albo bot bez JS dostają dowód, nie pustkę.
- **Podpis pod panelem:** Te same dane dają ten sam wynik. Ścieżka wyliczenia jest widoczna pod tabelą. / Same data, same result. The calculation path is visible under the table.
- **Budżet:** chunk lazy **poza** `modulepreload` i poza budżetem krytycznym 140 KB gz; osobny budżet `homeLazyGz ≤ 45 KB gz` (§6.7). Sekcja stoi poniżej zgięcia (hero ma `min-height: min(86dvh, 820px)`), więc `motion-no-initial-hidden-above-fold` i `perf-js-budget-home` są spełnione.
- **Motion:** stanem ładowania `DemoFrame` jest **`ChaosToOrder`** (96 prostokątów, na < 640 px 48, dojeżdża z rozsypanego układu do równej siatki: 900 ms, kaskada kolumnami 16 ms, wyłącznie `opacity` i `transform`, offsety z wpisanej na stałe tablicy `src/data/scatter.ts`, zero losowości w runtime). Po zgłoszeniu `data-ready` siatka schodzi `opacity` w 240 ms i wchodzi raport. Wykres renderuje się w stanie końcowym; jeden `ChartReveal` ≤ 420 ms po montażu, replay wyłącznie przez jawne „Odtwórz". Zero „rysowania". `ChaosToOrder` jest `aria-hidden`, a obok niego stoi `role="status"` z tekstem „Liczę / Computing". Motywacja: metafora „chaos w porządek" **ma funkcję** (stan ładowania), więc nie jest dekoracją, i nie zajmuje jedynego slotu autoodtwarzania (dlatego kodem, nie wideo: D38).
- **Zdarzenia:** `demo_load_example`, `demo_own_file`, `demo_replay`. **Nigdy** nazwa ani treść pliku użytkownika w payloadzie.
- **Twardy warunek copy (reguła `demo-client-side-only-claim`, do dopisania w strażniku):** zdania „nie wychodzi z przeglądarki" wolno użyć wyłącznie przy zielonym teście Playwright: **zero requestów sieciowych po wgraniu pliku** i zero pól z nazwą lub treścią pliku w zdarzeniach analityki. Bramka `check-client-only.mjs` w `npm run check`. Bez zielonej bramki zdanie nie wchodzi na stronę.

### S3 · „Co zbudowaliśmy" / „What we've built" (1 featured + 12 kafli) · job: proof przez masę (D31, D33)

- **Nagłówek:** Co zbudowaliśmy / What we've built. **Lead:** Trzynaście narzędzi: dwanaście liczy na żywo w tej przeglądarce, jedno jest własnym produktem na KSeF. / Thirteen tools: twelve compute live in this browser, one is our own product on KSeF. **Link-caption:** Wszystkie narzędzia (13) / All tools (13) → `/narzedzia`.
- **Featured (1 pozycja):** `kontroling-ksef`, chip „Własny produkt" / „Own product" (`st st-accent`), wizual WebP 1280×800 ≤ 120 KB. Do czasu zrzutów trybu mock featured stoi na deterministycznym renderze `KsefFlow` (`shoot-tools.mjs --svg-fallback`), więc strona główna nie zależy od czasu founderów.
- **Ściana (12 kafli):** WebP 480×300 ≤ 30 KB (`srcset` 320×200 ≤ 16 KB), `loading="lazy"`, `decoding="async"`, jawne `width/height`. Siatka gapless z hairline (kontener `border-top` + `border-left`, kafel `border-right` + `border-bottom`): 4 kolumny ≥ 1024, 3 kolumny 640–1023, 2 kolumny < 640. Cały kafel to `<a>`; pod kadrem **sama nazwa narzędzia** plus chip dowodu. **Bez hooków, taglinów, opisów i chipów działów**: te żyją wyłącznie na hubie (rozdział treści, R20).
- **Kolejność kafli** = pole `order` z `tools.ts` (§2.4), nie `id`. Pierwsze cztery po featured: `kontroling-kosztow`, `raport-zarzadczy`, `import-z-rekoncyliacja`, `os-czasu-zadan`.
- **Różnorodność obrazu jest wymaganiem, nie ozdobą** (R-T1): trzynaście dashboardów dzieli ten sam kit, więc kadr (`clip`) dobiera się per pozycja pod **typ obrazu** (wykres z KPI, macierz statusów, Gantt, kafle, dokument A4, diagram, badge PASS z linią dowodu sumy). Tabela scen per slug: §7.8. Obowiązkowy przegląd kontaktu zbiorczego (`shoot-tools.mjs --contact-sheet`) przed zamknięciem F3; bliźniacze kadry poprawiamy zmianą sceny, nigdy filtrem graficznym.
- **Motion:** kafle `RevealGroup` fadeUp stagger 40 ms (max 12 dzieci w kaskadzie); hover = hairline kafla → `--accent` 160 ms (bez transformu obrazu, bez cienia).
- **Klipy hover w v1 (D35 zmienione):** dokładnie **cztery pierwsze kafle po featured** (`kontroling-kosztow`, `raport-zarzadczy`, `import-z-rekoncyliacja`, `os-czasu-zadan`, czyli cały pierwszy rząd na ≥ 1024 px) grają mikro-nagranie z `record-demos.mjs`. Warunki: `preload="none"`, start dopiero po **progu intencji 120 ms** na `mouseenter` albo na `focus-visible`, `loop`, **maksimum jeden klip naraz** (singleton modułowy), `mouseleave`/`blur` → `pause()` + `currentTime = 0`, wyłącznie `pointer: fine`, `pointer-events: none` na elemencie (kafel pozostaje jednym `<a>`: `seo-links-in-dom`), poster = ten sam WebP 480×300 co kafel, więc najechanie nie powoduje przeskoku obrazu. Hero jest w tym czasie poza viewportem i zapauzowane przez `IntersectionObserver`, więc nigdy nie pracują dwa dekodery. Dlaczego nie dwanaście: 12 × 320 KB i dwanaście dekoderów, a „wszystko się rusza" znosi efekt odkrycia.
- **Prerender:** 13 linków `/narzedzia/<slug>` + 1 link `/narzedzia` w `dist/index.html` (bramka `seo-links-in-dom`); `ItemList` JSON-LD **tylko** na hubie.

### S4 · „Co budujemy" / „What we build" (gapless bento 3×2) · job: educate

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

- **Wizuale w bento:** ≥ 2 komórki niosą **realny wizual**, którym po reframe jest **statyczny kadr zrzutu narzędzia** (komórka 1: wycinek wykresu `DemoReport`; komórka 4: wycinek macierzy `QualityGate`), a nie żywy mini-komponent. **`MiniReport`, `MiniKsef` i `MiniAudit` wypadają z v1**: jedyny żywy komponent na `/` stoi w S2 i tak zostaje (budżet JS i INP). `KsefFlow` zostaje, ale jako diagram na podstronie KSeF (§4.3), nie jako mini-komponent w bento.
- **Stopka sekcji (1 linia):** Nie widzisz swojego procesu? Napisz: kontakt@klarow.com / Don't see your process? Write to kontakt@klarow.com (zdarzenie `cta_mail`).
- **Motion:** `RevealGroup` (fadeUp 12 px, 420 ms, stagger 50 ms); hover komórki = `background: var(--surface-raised)` 160 ms (CSS, bez transformu).
- **Dlaczego po dowodzie, a nie przed:** po zobaczeniu trzynastu rzeczy sześć typów pracy czyta się jako podsumowanie i zaproszenie („nie widzisz swojego procesu?"), a nie jako obietnica katalogu złożona przez podmiot, którego jeszcze nie ma.

### S5 · „Co osiągniesz" / „What you gain" (2×2 z ikonami i hairline) · job: outcome (obowiązkowa)

- **Nagłówek:** Co osiągniesz / What you gain. **Lead:** Nie sprzedajemy godzin ani systemu. Sprzedajemy efekt, który widać w kalendarzu i w liczbach. / We don't sell hours or a system. We sell a result you can see in the calendar and in the numbers.
- **4 efekty** (ikona 20 px `--accent`, 1 zdanie 700, 1 linia muted; zero liczb, bo każda liczba wymagałaby źródła; sformułowania do zatwierdzenia w D23):

| Ikona | PL | EN |
|---|---|---|
| `Clock` | **Godziny kontrolera wracają do kontrolingu.** Raport, import i sprawdzenie robi narzędzie, nie człowiek po godzinach. | **Your controller's hours go back to controlling.** The tool runs the report, the import and the check, not a person after hours. |
| `CalendarCheck` | **Zamknięcie miesiąca w dni, nie w tygodnie.** Dane z ERP, magazynu i plików spotykają się bez przeklejania. | **Month-end close in days, not weeks.** ERP, warehouse and file data meet without copy-paste. |
| `ShieldAlert` | **Błędy złapane przed zarządem, nie po.** Macierz OK / UWAGA / BŁĄD zanim raport wyjdzie z działu. | **Errors caught before the board sees them, not after.** An OK / WARN / ERROR matrix before the report leaves the department. |
| `Umbrella` | **Urlop bez telefonów z pytaniem o plik.** Narzędzie liczy tak samo, gdy nie ma Cię przy biurku. | **A holiday without calls about the spreadsheet.** The tool computes the same way when you're away from your desk. |

- Framing zakazany (peer-legal): żadnego „oszczędzimy etat", „nie zatrudniajcie", odejmowania ludzi. Efekty mówią o czasie i błędach, nie o etatach.
- Kotwica reguły `copy-persona-outcomes-section`: sekcja stoi **bezpośrednio po bloku dowodu i przed sekcją o ludziach**; w numeracji v2 jest to S5.

### S6 · „Rozmawiasz z osobą, która to zbudowała" (podpis 4/12 + 2 portrety) · job: trust

- **Awans z pozycji 8 na 6 (D32).** Bez zarejestrowanego podmiotu CV tworzą **ludzie i ich artefakty**; zostawienie tej sekcji pod trzema blokami sprzedażowymi oznaczałoby, że najmocniejsze, co mamy, leży najgłębiej.
- **Nagłówek:** Rozmawiasz z osobą, która to zbudowała. / You talk to the person who built it. **Lead:** Dwie osoby, zero pośredników. Kod, dokumentacja i runbook zostają u Ciebie. / Two people, no middlemen. Code, documentation and runbook stay with you.
- **2 karty** (portret 4:5 w ramie 1 px, duotone stalowe; imię i nazwisko 700; rola; 1 zdanie ≤ 20 słów; link „LinkedIn"):
  - **Karol Bałucki:** Buduje narzędzia i integracje. Dwanaście dem na tej stronie i produkt na KSeF. / Builds the tools and integrations. The twelve demos on this site and the KSeF product.
  - **Paweł [DECYZJA FOUNDERÓW: nazwisko, fakt F4]:** Prowadzi diagnozę procesu i odbiór wdrożenia. Ustala zakres, zanim powstanie pierwsza linia kodu. / Runs the process diagnosis and the sign-off. Agrees the scope before the first line of code. (Poprzednie brzmienie „prowadzi wdrożenia i rozmowy z klientami" jest wycofane: liczba mnoga „klienci" przy zerze płatnych klientów łamie `brand-honest-labels`.)
- **Przypisanie autorstwa jest tu dowodem**, a nie ozdobą: zdanie Karola wiąże ścianę z S3 z konkretnym nazwiskiem. To jedyna dopuszczalna proteza „doświadczenia" (zero logotypów klientów, zero „lat na rynku", zero słowa „zespół").
- **Wariant D6(b):** Karol bez zdjęcia = rama z inicjałem „K" na stali (jak favicon) + imię + rola. **Wariant D6(c)** = sekcja usunięta (home ma wtedy 8 sekcji). Nigdy stock, nigdy placeholder. **Uwaga po D25:** jeśli administratorem danych jest Paweł, jego nazwisko i tak stoi w `/rodo`, więc fakt F4 blokuje publikację całej strony, nie tylko tę sekcję.
- **Motion:** portrety fade 600 ms; reszta fadeUp. Bez ruchu twarzy.

### S7 · „Kalkulator, nie wróżka" / „A calculator, not a fortune teller" (side-image 60/40) · job: differentiator

- **Nagłówek:** Kalkulator, nie wróżka. **Lead:** Dane zostają u Ciebie. Zero chmury dostawcy: nie trafiają do nas ani do żadnej chmury poza systemami, które sam wskażesz. / Your data stays with you. Zero vendor cloud: it never reaches us or any cloud beyond the systems you name.
- **Layout:** lewe 7/12 = 5 par ✕ / ✓ jako dwie kolumny listy (hairline tylko nad blokiem); prawe 5/12 = **kadr „ścieżki wyliczenia" z `DemoReport`** (WebP 1200×1500, 4:5, rama 1 px, `alt`: „Ścieżka wyliczenia: każda liczba z jawnym działaniem" / „Calculation path: every number with its arithmetic shown"). Still macro „brushed steel" wypada: był assetem generatywnym, płatnym i abstrakcyjnym, a sekcja o determinizmie ma być ilustrowana dowodem determinizmu. Mobile: obraz nad tekstem, `max-height 360px`.
- **Wariant zapasowy (tylko jeśli przegląd kadru go odrzuci):** schemat on-premise „co zostaje u Ciebie" jako SVG na tokenach (≤ 12 KB, ta sama rodzina co `KsefFlow`), 0,5 dnia. Nie robimy obu naraz.
- **5 par:**

| ✕ Tradycyjnie / Typically | ✓ Klarow |
|---|---|
| Dane lecą do API modelu językowego i na serwer dostawcy / Data goes to a language-model API and a vendor's server | Dane zostają u Ciebie: na Twoim komputerze lub serwerze / Data stays with you: on your computer or your server |
| Wynik z modelu, za każdym razem może wyjść inaczej / A model's guess that can differ every run | Te same dane, ten sam wynik, co do grosza, z jawną ścieżką wyliczenia / Same data, same result, to the cent, with a visible calculation path |
| Wdrożenie liczone w miesiącach, faktury za godziny / Months of rollout, invoices by the hour | Pierwszy działający efekt w dni, stała cena za ustalony zakres / First working result in days, a fixed price for an agreed scope |
| Nowy system i szkolenia zespołu / A new system and team training | Wchodzimy obok tego, co działa: ERP, pliki, KSeF / We plug in next to what works: ERP, files, KSeF |
| Bez dostawcy wszystko staje / Without the vendor everything stops | Kod, dokumentacja i runbook zostają u Ciebie / Code, documentation and runbook stay with you |

- Ikony `X` i `Check` 16 px, `strokeWidth 1.75`; ✓ = `--accent`, ✕ = `--foreground-muted` (bez czerwieni). Zdanie-kotwica pod blokiem (`MESSAGING.determinism`): **Twoje liczby liczy zwykły, deterministyczny kod. Te same dane dają ten sam wynik.** / Your numbers are computed by plain, deterministic code. Same data, same result.
- „Co do grosza" zostaje tutaj (kolumna ✓) i w podpisie ściany S3; nigdzie indziej na `/`.
- **Motion:** wiersze fadeUp stagger 40 ms; kadr fade 600 ms; bez parallaxu. **Prerender:** cały blok w shellu (treść SEO o on-premise i determinizmie).

### S8 · „Jak pracujemy" / „How we work" (5 kroków w wierszu) · job: educate

- **Przesunięta z pozycji 6 na 8 (D32):** warstwa sprzedażowa zostaje, ale przestaje być bohaterem strony. Kroki tuż przed zamknięciem odpowiadają na pytanie „co się stanie, jak napiszę".
- **Nagłówek:** Jak pracujemy / How we work. **Lead:** Pilot na kopii Twoich danych. Dwie decyzje należą do Ciebie: zakres na starcie i odbiór na końcu. / A pilot on a copy of your data. Two decisions are yours: the scope at the start and the sign-off at the end.
- **5 kroków** (ikona 20 px, nazwa verb-noun, 1 linia; hairline łącznik nad nagłówkami; zero „Krok 1/2/3"):

| Ikona | PL | EN |
|---|---|---|
| `MessageSquare` | **Rozmowa 30 minut.** Na próbce Twojego pliku, bez zobowiązań. | **A 30-minute call.** On a sample of your file, no commitment. |
| `Lock` | **Zakres zamrożony.** Dzień 0, wliczony w cenę. | **Scope frozen.** Day 0, included in the price. |
| `Copy` | **Budowa na kopii.** Dni 1–4, TEST bez zapisu na oryginale. | **Build on a copy.** Days 1–4, TEST mode, nothing written to the original. |
| `Play` | **Pokaz na Twoich danych.** Dzień 5, raport z prawdziwych liczb. | **Demo on your data.** Day 5, a report from real numbers. |
| `ShieldCheck` | **Odbiór i PROD.** Do 10 dni, backup i log, kod zostaje u Ciebie. | **Sign-off and PROD.** Within 10 days, backup and log, the code stays with you. |

- **Mikro-copy pod krokami (wyjaśnienie, nie tag):** Wycena po bezpłatnej diagnozie. Stała cena za ustalony zakres, bez stawki godzinowej. **Cenę i zakres zapisujemy w umowie przed startem.** / Priced after a free diagnosis. A fixed price for an agreed scope, no hourly rate. **We put the price and scope in a contract before we start.** Link-caption: **Szczegóły oferty** / Offer details → `/oferta`. Zero kwot, zero słowa „faktura" do rejestracji działalności (§10 p. 7).
- **Motion:** hairline `scaleX 0 → 1` (420 ms, `transform-origin: left`, `div` z `transform`, nie animowany SVG); kroki fadeUp stagger 60 ms.

### S9 · Zamknięcie + stopka (mini minimalist) · job: convert

- **H2:** Pokaż nam proces, który boli. / Show us the process that hurts. **Lead:** W 30 minut powiemy, co da się z nim zrobić. / In 30 minutes we'll tell you what can be done with it.
- CTA primary **Umów 30 minut** (ta sama etykieta co w hero i nav: jedna intencja, jedna etykieta). Pod nim jedna linia meta: `786 296 426 · kontakt@klarow.com` jako `tel:` i `mailto:` (zdarzenia `cta_tel`, `cta_mail`).
- **Stopka (na każdej trasie):** wordmark `KLAROW`; 1 linia jako para `{ pl, en }`: „Narzędzia pod proces dla firm produkcyjnych, budowlanych i dystrybucyjnych · Polska / USA" / „Tools built around the process for manufacturing, construction and distribution companies · Poland / USA"; linki: **Narzędzia** · Oferta · FAQ · **RODO i prywatność** (`/rodo`); NAP z `contact.ts` (telefon i e-mail, **bez adresu**); LinkedIn founderów (po D6); `© 2026 Klarow`. Bez „strona robocza v0.8". **Nie dopisujemy** „sp. z o.o.", „firma", NIP ani adresu siedziby, dopóki ich nie ma: „Klarow" to nazwa marki i projektu, nie deklaracja podmiotu.

---

## 4. Podstrony

### 4.1 Hub `/narzedzia`

H1 **Narzędzia, które zbudowaliśmy** / Tools we have built (D31: słowo kluczowe zgodne z URL zostaje w H1, a czas przeszły dokonany mówi „to istnieje", nie sugerując zleceń komercyjnych; „Realizacje" wypada, bo w polszczyźnie biznesowej znaczy „zlecenie wykonane dla klienta", a klientów jest zero). Lead: Trzynaście narzędzi: dwanaście liczy na żywo w przeglądarce, jedno jest własnym produktem na KSeF. Wszystkie na danych przykładowych. / Thirteen tools: twelve compute live in your browser, one is our own product on KSeF. All run on sample data. (Liczba mnoga „wdrożenia" wraca dopiero z drugą pozycją `kind !== "demo"`: R5, `brand-honest-labels`, D5.) Filtry, grupy i kolejność `order` jak w §2.4. Karta compact: miniatura 16:10 (WebP 640×400 ≤ 40 KB, lazy), ikona + nazwa, **hook i opisy są wyłącznie tutaj** (na `/` stoją same nazwy: rozdział treści bez duplikacji, R20), chipy (dowód, dział, `delivery`); cała karta = `<a>`; `focus-visible` = hairline `--accent` 2 px. Motion: `RevealGroup` stagger 40 ms (max 12 dzieci), zmiana filtra bez layout-animacji (`domMax` = +13,7 KB gz, nie w v1). Prerender: `ToolsShell` z H1, leadem, 2 grupami, 13 kartami, `ItemList`.

### 4.2 Podstrona narzędzia `/narzedzia/:slug` (dashboard-first)

```
← Narzędzia / {dział}
[Demo na danych przykładowych] [Kontroling] [pilot 5–10 dni]      ← chipy
H1 {nazwa}  ·  hook jako lead
┌ pasek akcji: Załaduj przykład · Odtwórz · Pobierz PDF (gdzie jest) ┐
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

**Doprecyzowanie dashboard-first (reframe 2026-09-12).** Podstrona narzędzia jest najgłębszym dowodem na witrynie, więc jej układ ma twarde kryteria mechaniczne:

1. **Górna krawędź panelu dashboardu ≤ 320 px od góry dokumentu** na desktopie i na mobile (blok nagłówkowy ≤ 280 px). Mierzalne zrzutem: `document.querySelector("[data-dashboard]").getBoundingClientRect().top <= 320`. Desktop 1440×900: okruszek 0–40, chipy 40–84, H1 + hook 84–200, pasek akcji 200–252, dashboard od 252. Mobile 390×844: navbar 0–56 (jedyny sticky), okruszek 56–92, chipy do 2 linii bez poziomego scrolla 92–150, H1 (≤ 3 linie) + hook 150–270, pasek akcji (przyciski 44 px, do 2 rzędów) 270–318, dashboard od 318, nad zgięciem widać rząd KPI i początek wykresu. Tabele wewnątrz dashboardu dostają własny kontener `overflow-x: auto`; `body` nigdy nie scrolluje w poziomie.
2. **Pasek akcji: trzy pozycje, zawsze w tej kolejności, zawsze `.btn-secondary`** (jeden primary na ekran to „Umów 30 minut" niżej): „Załaduj przykład" (tylko gdy demo startuje puste) · „Odtwórz" · „Pobierz PDF" (tylko tam, gdzie `PdfButton` już istnieje; `pdfmake` dociągany po kliknięciu). Pasek nie jest sticky. Po prawej, jako tekst muted: „Dane przykładowe, liczone w Twojej przeglądarce." / „Sample data, computed in your browser."
3. **„Załaduj przykład"** wstawia deterministyczny zestaw z `demo-sample.ts` do stanu komponentu: **bez requestu sieciowego i bez remountu**, wynik w tej samej klatce, wykres bez „rysowania". Przycisk zostaje aktywny (powtórne kliknięcie daje ten sam wynik, co jest częścią przekazu o determinizmie), obok pojawia się chip `.st` „dane przykładowe". Zdarzenie `demo_load_example` z samym `slug`, nigdy z danymi użytkownika.
4. **Stan pusty** dotyczy wyłącznie dem sterowanych wejściem (`raport-zarzadczy`, `import-z-rekoncyliacja`, `audyt-jakosci-danych`, `importy-erp`, `protokoly-robocizny`). Pudełko ma **tę samą wysokość co po załadowaniu** (mapa `DASH_MINH`), w środku jedno zdanie („Demo startuje puste, żeby było widać, że liczy, a nie odtwarza."), przycisk „Załaduj przykład" i link „albo wklej własny plik". Zero ilustracji, zero pustej ramki.
5. **Skeleton i pułapka `clientWidth`:** `.skel` żyje **wewnątrz `<Suspense>`, w tym samym `div`, który potem trzyma dashboard**, ma `width: 100%` i `min-height` z `DASH_MINH: Record<DashboardKey, number>` (np. `timeline: 720`, `report: 640`, `production: 600`). Nigdy w węższym wrapperze i nigdy z własnym paddingiem: `TaskTimeline` centruje oś na podstawie `clientWidth`, więc montaż w ukrytym albo zwężonym kontenerze wysyła oś do zera.
6. **Flaga `data-ready="true"` ustawiana wewnątrz `Suspense`**, po dociągnięciu chunku, nie na wrapperze od stanu `mounted`. Inaczej `shoot-tools.mjs` złapie raz dashboard, raz skeleton i zrzuty przestaną być deterministyczne.
7. **Boundary błędu renderuje ten sam zrzut WebP**, który i tak mamy dla ściany na `/`, plus linię „Demo nie wczytało się. To jest zrzut z tego samego narzędzia." Awaria JS, bloker skryptów albo bot bez JS nadal widzą dowód. To samo pudełko (`DemoFrame`) obsługuje S2 na `/` i wszystkie podstrony: jedno miejsce, trzy stany, zero CLS.

### 4.3 KSeF (`/narzedzia/kontroling-ksef`, `kind: "product"`)

- Relabel „WDROŻONE" → **„Własny produkt"** (D5). Bullet „opcjonalny asystent AI" usunięty z `tools.ts` (PL `:644`, EN `:658`) (D4).
- **`KsefFlow`**: diagram SVG 4 węzłów na tokenach (`role="img"`, `aria-label` z pełną treścią): **KSeF API 2.0 → connector (u Ciebie) → baza SQLite (u Ciebie) → pulpity: Budżet vs Wykonanie, Cashflow 13 tyg.** oraz przekreślona strzałka zwrotna z podpisem „nie wysyła faktur: tylko czyta i liczy". Łączniki `clip-path`, nie `stroke-dasharray`; animacja tylko `opacity` węzłów raz.
- Galeria 2–3 zrzutów trybu mock (dane fikcyjne, bez nazwy produktu w UI zrzutu; luka L12: sprawdzić nagłówek Kokpitu w mocku, w razie potrzeby ukryć CSS-em przed zrzutem). Panel „Jak działa" (3 kroki: pobranie metadanych z API KSeF 2.0 → parser FA(3) → pulpity) i „Czego nie robi". Etykieta czasu: „Health-Check 48 h → pilot etapami". JSON-LD `Service`.

### 4.4 `/oferta`

H1 **Pilot na kopii** / A pilot on a copy. Lead: Jeden proces, kopia Twoich danych, pierwszy działający efekt w dniu 5. Wycena po bezpłatnej diagnozie. Sekcje: **Harmonogram** (ten sam komponent `Steps` co S8 na `/`, pełne opisy dni 0 / 1–4 / 5 / ≤ 10, 50 : 50) · **Współpraca** (`CollaborationFlow` SVG 1:1) · **Wycena** (4 zdania: Wyceniamy po bezpłatnej diagnozie. Stała cena za zamrożony zakres, bez stawki godzinowej. Druga rata po działającym odbiorze. **Cenę i zakres zapisujemy w umowie przed startem.** / … We put the price and scope in a contract before we start.) Zero kwot i zero słowa „faktura" do rejestracji działalności (§10 p. 7); pierwsza płatna realizacja dopiero po progu `CONTRACT_READY` (§4.6) · **Dla kogo** (chipy: Produkcja · Budownictwo · Dystrybucja · 20–250 osób · Polska / USA; przypis z kwalifikatorem Windows + Excel; „Nie dla Ciebie, jeśli": migracja do chmury, wymiana ERP, body-leasing) · **Kalkulator transz** (`TrancheCalc` lazy na `lib/tranches.ts`: „Wpisz kwotę i wagi: Σ co do grosza · PASS"; zdarzenie `calc_tranche_run`) · **Hak**: **Przyślij nam swój najgorszy Excel.** W 30 minut pokażemy, co da się z nim zrobić. + CTA „Umów 30 minut" + `mailto:`.

### 4.5 `/faq`

H1 **Częste pytania**. 6 istniejących z `faq.ts` + 2 nowe (jedno źródło; akordeon z odpowiedziami zawsze w DOM, `aria-controls` + `id`):

- **Czy to tylko Excel?** / Is this only about Excel? → Nie. Excel jest częstym wejściem, nie warunkiem. Budujemy integracje (KSeF, ERP, API), panele webowe i obiegi dokumentów na Twoim serwerze; narzędzia piszące do plików Excel wymagają Windows + Excel. / No. Excel is a common input, not a requirement. We build integrations (KSeF, ERP, APIs), web panels and document workflows on your server; tools that write to Excel files need Windows + Excel.
- **Czy AI liczy moje dane?** / Does AI compute my data? → Nie. Twoje liczby liczy zwykły, deterministyczny kod: te same dane dają ten sam wynik, a ścieżkę wyliczenia widzisz w narzędziu. Żaden model językowy nie dostaje Twoich danych. / No. Your numbers are computed by plain, deterministic code: same data, same result, and you can see the calculation path in the tool. No language model ever receives your data. (jedyne miejsce w copy sprzedażowym, gdzie pada słowo „AI", i tylko po to, żeby zaprzeczyć: `brand-no-ai-word-in-sales`)

### 4.6 `/rodo` (nowa; szkielet treści, oznaczony „do przeglądu radcy")

Dokument `max-width 42rem`, H1 **Skąd mamy Twoje dane i jak je usunąć** / Where your data comes from and how to delete it. Treść = klauzula informacyjna z art. 14 RODO + polityka prywatności strony w jednym dokumencie. Lead: Ta strona mówi wprost, skąd mamy Twoje dane, po co, jak długo i jak jednym mailem powiedzieć „nie". / This page says plainly where your data comes from, why, for how long and how to say "no" in one email.

Sekcje (kolejność i treść wynikają z art. 14 ust. 1–2; szkielet pisze Claude Code w F0, radca przegląda w D16):

1. **Administrator danych.** Administratorem może być **osoba fizyczna** (art. 4 pkt 7 RODO nie wymaga rejestracji działalności, NIP-u ani REGON-u), więc brak firmy nie blokuje publikacji: blokuje ją brak **tożsamości i danych kontaktowych** administratora (art. 14 ust. 1 lit. a). Dwa warianty copy, jeden wybierany polem `CONTROLLER.kind` w `data/rodo.ts`:
   - **(a) osoba fizyczna, stan na dziś (D25, D26):** „Administratorem Twoich danych jest Paweł [NAZWISKO], osoba fizyczna prowadząca działalność przygotowawczą pod marką KLAROW, z adresem do korespondencji: [ADRES]. Nie prowadzimy jeszcze zarejestrowanej działalności gospodarczej; gdy to się zmieni, dopiszemy tu nazwę i numer NIP, a informację o zmianie znajdziesz w sekcji „Zmiany". We wszystkich sprawach dotyczących danych napisz na kontakt@klarow.com albo zadzwoń: 786 296 426." / „The controller of your data is Paweł [SURNAME], a private individual operating under the KLAROW brand, correspondence address: [ADDRESS]. We do not yet run a registered business; when that changes we will add the company name and tax number here and note the change in the „Changes" section. For anything concerning your data write to kontakt@klarow.com or call +48 786 296 426." Wariant bez adresu (świadome minimum, D26-d): drugie zdanie brzmi „Adres do korespondencji podajemy na żądanie wysłane na kontakt@klarow.com." / „We provide a correspondence address on request sent to kontakt@klarow.com."
   - **(b) po rejestracji:** „Administratorem Twoich danych jest [PEŁNA NAZWA], [ADRES], NIP [NIP]. We wszystkich sprawach dotyczących danych napisz na kontakt@klarow.com albo zadzwoń: 786 296 426." / „The controller of your data is [LEGAL NAME], [ADDRESS], tax ID [NIP]. …"
   - **Jeden administrator, nie dwóch.** Gdyby obaj founderzy wspólnie ustalali cele i sposoby przetwarzania bazy leadów, powstałoby **współadministrowanie z art. 26 RODO** (uzgodnienia + obowiązek opublikowania ich zasadniczej treści na `/rodo`). Wskazujemy jedną osobę; drugi founder działa na jej polecenie (upoważnienie z art. 29, jedna kartka poza repo). Skrzynkę `kontakt@`, bazę leadów i konta (Cloudflare, GSC, Cal.com) prowadzi ta sama osoba.
   - **Do potwierdzenia u radcy:** czy adres do korespondencji jest obowiązkowym elementem klauzuli, czy wystarczy zdanie o adresie na żądanie.
2. **Skąd mamy Twoje dane (konkretne źródła).** Dane osób kontaktowych w firmach pozyskujemy z: ogłoszeń o pracę opublikowanych na portalach pracuj.pl i LinkedIn Jobs (data publikacji ogłoszenia zapisana w naszej bazie); Krajowego Rejestru Sądowego (KRS); Centralnej Ewidencji i Informacji o Działalności Gospodarczej (CEIDG); rejestru REGON (GUS); publicznego profilu LinkedIn; strony internetowej firmy. Nigdy: kupione bazy, scraping poczty. (Formuła „ze źródeł publicznie dostępnych" jest zakazana: to ją zakwestionowano u Bisnode.)
3. **Jakie dane.** Imię i nazwisko, stanowisko, służbowy e-mail i telefon, nazwa i adres firmy, treść korespondencji z nami.
4. **Po co i na jakiej podstawie.** Art. 6 ust. 1 lit. f RODO (uzasadniony interes). Na czym polega nasz interes: chcemy zaproponować firmom z produkcji, budownictwa i dystrybucji narzędzia do pracy na danych; kontaktujemy się z osobami odpowiedzialnymi za kontroling, finanse lub zarząd, jednorazowo, z możliwością odmowy w każdym momencie. Informację handlową (art. 398 PKE) wysyłamy wyłącznie po Twojej uprzedniej zgodzie; pierwsza wiadomość jest prośbą o zgodę, nie ofertą.
5. **Jak długo.** Do sprzeciwu, a bez odpowiedzi **nie dłużej niż 12 miesięcy od ostatniego kontaktu**; korespondencja, w której zawarto umowę, przez okres wymagany przepisami podatkowymi. (Ujednolicenie z 2026-09-12: plan mówił „12 miesięcy od pierwszego", reguła `legal-rodo-page-required` pkt 6 „24 miesiące od ostatniego". Obowiązuje jedno brzmienie: **12 miesięcy od ostatniego kontaktu**, w planie i w regule.)
6. **Komu przekazujemy i przekazywanie poza EOG** (art. 14 ust. 1 lit. e i f: trzeba podać FAKT przekazania, podstawę i sposób uzyskania kopii zabezpieczeń, a nie tylko zapewnienie, że transferu nie ma). Odbiorcy: Cloudflare (hosting i analityka bez cookies), dostawca poczty (Gmail / Resend), Cal.com (rezerwacja rozmowy, jeśli z niej korzystasz). Treść na stronie: **„Nie sprzedajemy danych. Część naszych dostawców (Cloudflare, Google, Resend, Cal.com) przetwarza dane na serwerach w USA. Podstawą takiego przekazania są standardowe klauzule umowne (SCC) albo Data Privacy Framework, w zależności od dostawcy; kopię zabezpieczeń wyślemy na prośbę wysłaną na kontakt@klarow.com."** / „We do not sell data. Some of our providers (Cloudflare, Google, Resend, Cal.com) process data on servers in the USA. Such transfers are based on standard contractual clauses (SCC) or the Data Privacy Framework, depending on the provider; we will send a copy of the safeguards on request to kontakt@klarow.com." **Zadanie w F0:** dla każdego z czterech dostawców wpisać do `references/integrations-registry.md`, czy działa na SCC czy na DPF (sprawdzić na liście DPF i w DPA dostawcy), żeby zdanie nie zostało na „albo".
7. **Twoje prawa.** Dostęp, sprostowanie, usunięcie, ograniczenie, przenoszenie, skarga do Prezesa UODO (ul. Stawki 2, 00-193 Warszawa).
8. **PRAWO SPRZECIWU** (odrębny, wyróżniony blok w ramie hairline, poza listą praw, zgodnie z art. 21 ust. 4): Masz prawo w dowolnym momencie sprzeciwić się przetwarzaniu Twoich danych do kontaktu handlowego. Wystarczy jeden mail na kontakt@klarow.com o treści „sprzeciw". **Przetwarzanie w celu kontaktu handlowego kończymy natychmiast**, dane usuwamy w ciągu 7 dni i potwierdzamy mailem. Przycisk `.btn.btn-secondary` „Wyślij sprzeciw" = `mailto:kontakt@klarow.com?subject=Sprzeciw%20RODO`. Bez formularza, bez backendu.
8a. **Zautomatyzowane decyzje i profilowanie** (art. 14 ust. 2 lit. g; obowiązkowe, bo prowadzimy research leadów z punktacją): **„Nie podejmujemy wobec Ciebie decyzji wyłącznie w sposób zautomatyzowany i nie profilujemy Cię jako osoby. Firmy oceniamy wstępnie prostą punktacją dopasowania do naszego profilu klienta (branża, wielkość zatrudnienia, publiczny sygnał zakupowy, np. ogłoszenie o pracę). Punktacja dotyczy firmy, nie Ciebie, i niczego nie przesądza: o tym, czy i do kogo napiszemy, decyduje człowiek."** / „We do not make decisions about you based solely on automated processing, and we do not profile you as an individual. We score companies on a simple fit scale (industry, headcount, a public buying signal such as a job posting). The score describes the company, not you, and decides nothing on its own: a human decides whether and whom we contact." **Warunek prawdziwości (do sprawdzenia w F0):** punktacja w `leadscout/` liczy wyłącznie cechy firmy (sektor, zatrudnienie, sygnał zakupowy, decyzyjność właścicielska, stack) i żadna jej składowa nie ocenia osoby kontaktowej. Jeśli to się zmieni, punktacja osób musi być opisana także w sekcji 3 („jakie dane") i 4 („po co i na jakiej podstawie"), a to zdanie przestaje być prawdziwe.
9. **Strona klarow.com.** Brak cookies analitycznych i marketingowych; `localStorage` tylko dla wyboru języka i jednorazowej samonaprawy cache; Cloudflare Web Analytics (cookieless); zdarzenia kliknięć CTA bez identyfikatorów osób. Formularze zapisu (jeśli powstaną) wymagają odrębnej, niezaznaczonej domyślnie zgody i potwierdzenia mailem (double opt-in).
10. **Zmiany.** Data ostatniej aktualizacji (z gita, jak `lastmod`).

Wersja EN pełna (`{ pl, en }`), bo strona ma przełącznik. Ten sam plik danych `data/rodo.ts` karmi `RodoPage` i `RodoShell`.

**Dwie bramki zamiast jednej i jedno miejsce podmiany (reframe 2026-09-12).** Dzisiejsza flaga `RODO_READY` w `site/src/data/rodo.ts` miesza dwie różne rzeczy. Zastępują ją stała `CONTROLLER` (jedyne miejsce, w którym żyje tożsamość administratora; sekcja „Administrator" jest z niej liczona, a nie zdublowana prozą w `pl` i `en`) oraz dwie flagi:

```ts
export const CONTROLLER = {
  kind: "person" as "person" | "entity",
  name: "[DECYZJA FOUNDERÓW: imię i nazwisko administratora]",
  address: "",   // pusty = renderujemy zdanie „adres na żądanie"
  taxId: "",     // tylko wariant entity; pusty = pole pomijane w treści i w JSON-LD
} as const;

export const SITE_PUBLISHABLE = false;  // BRAMKA 1: publikacja strony
export const OUTREACH_READY   = false;  // BRAMKA 2: pierwszy kontakt handlowy
```

- **`SITE_PUBLISHABLE` (BLOCKER publikacji, w `npm run check`):** `dist/rodo.html` istnieje, jest prerenderowane i linkowane w stopce na każdej trasie, alias `/polityka-prywatnosci → /rodo 301` działa; sekcja „Administrator" wskazuje realną osobę albo podmiot (**zero markerów `[DECYZJA FOUNDERÓW: …]` w `dist/rodo.html`**); sekcje o serwisie kompletne (hosting i logi, pomiar bez cookies, `localStorage` tylko na język i samonaprawę cache, kanały kontaktu, prawa, prawo sprzeciwu w odrębnym bloku, organ nadzorczy); strona nic nie zbiera (zero formularzy wysyłających dane, zero cookies, zero analityki wymagającej zgody). **Nie wymaga:** NIP-u, REGON-u, KRS, adresu siedziby, przeglądu radcy.
- **`OUTREACH_READY` (BLOCKER przed pierwszym kontaktem handlowym, sprawdzany osobnym wywołaniem `verify-site.mjs --outreach`):** bramka 1 spełniona; adres do korespondencji wpisany **albo** świadomie wybrane zdanie zastępcze (decyzja w `docs/DECISIONS.md`); klauzula art. 14 kompletna, z podstawą transferu poza EOG **rozstrzygniętą per dostawca** (zero „SCC albo DPF" w `dist`); treści zgód PKE w jednym źródle (`site/src/data/consent.ts` z `CONSENT_VERSION`), szablony outboundu linkują do `klarow.com/rodo`, a pierwsza wiadomość nie zawiera oferty; rejestr zgód, rejestr sprzeciwów z terminem 7 dni i rejestr czynności (art. 30) istnieją poza repo i mają właściciela procesu; wpis `OUTREACH_READY = true` w `docs/DECISIONS.md` z datą. **Nie wymaga:** rejestracji działalności.
- **Zegar, którego plan wcześniej nie widział:** art. 14 ust. 3 lit. a daje **miesiąc od pozyskania danych** (nie od wysyłki) na wykonanie obowiązku informacyjnego. Dopisanie imienia, nazwiska, stanowiska albo imiennego e-maila do `leadscout/leads.json` uruchamia ten zegar niezależnie od tego, czy kiedykolwiek napiszemy. Do czasu `OUTREACH_READY` baza zawiera wyłącznie dane firmowe i publiczny sygnał zakupowy (reguła `legal-outreach-readiness`, `legal-no-scraped-personal-data-in-repo`).
- **Próg trzeci, poza fazami strony: `CONTRACT_READY`.** Rejestracja działalności, NIP, rachunek, wzór umowy sprintu i porozumienie wspólników są warunkiem **pierwszej faktury**, nie publikacji i nie outboundu. Działalność nierejestrowana nie obsłuży pilota za kilkanaście tysięcy (limit przychodu z art. 5 Prawa przedsiębiorców). Do potwierdzenia z księgową.

**Indeksacja: `noindex` do przeglądu radcy** (domyślny wybór z `synthesis.md` D-21, doprecyzowany w D16 jako D16-b). Do czasu przeglądu `dist/rodo.html` ma `<meta name="robots" content="noindex, follow">` i **nie wchodzi do `sitemap.xml`**; trasa jest publiczna, linkowana ze stopki i z szablonów outboundu (to wystarcza do art. 14, indeksacja nie jest wymagana). Po przeglądzie radcy (D16, cel 2026-09-30) jednym commitem: zdjęcie `noindex`, wpis do sitemapy z priorytetem **0.3**, podniesienie oczekiwań bramek (`verify-site.mjs`: sitemap = trasy − `404`; KPI indeksacji 17/17 → 18/18). Powód, dla którego nie indeksujemy od razu: klauzula art. 14 jest oświadczeniem administratora i do przeglądu prawnika nie powinna być pozycjonowana jako oficjalny dokument.

### 4.7 `404`

H1 **Nie ma takiej strony.** / There is no such page. Linia: Sprawdź adres albo przejdź do narzędzi. / Check the address or go to the tools. Linki: `/narzedzia`, `/`. `<meta name="robots" content="noindex">`; prerender do `dist/404.html`; trasa `*` w routerze.

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

`Navbar` (1 linia 64 px, wordmark płaski, 3 linki, PL/EN, CTA `.btn.btn-primary`; mobile hamburger z `inert` na zamkniętym menu; bez `backdrop-blur`; tło `--surface-overlay`), `Footer`, `SkipLink` + `PageMain` (`<main id="main">`), **`DemoFrame`** (zrzut w shellu → lazy mount po idle → boundary z tym samym zrzutem; obsługuje S2 na `/` i podstrony), **`ToolWall`** (featured + 12 kafli, siatka gapless z hairline), `Bento` + `BentoCell`, `CaseFrame` (featured) / `CaseCard` (compact), `Outcomes`, `Steps`, `Contrast`, `FounderCard` (wariant inicjału), `ClosingCta`, `Chip`, `KsefFlow`, `DashboardMount` + `DashboardSkeleton`, `TrancheCalc`, `FaqList`, `BookingDialog` (natywny `<dialog>` z `showModal`, focus-trap, `Esc`, zwrot fokusu; Cal.com jako link zewnętrzny w v1), `Seo` (fix deps `jsonLd`), `CollaborationFlow` (1:1), `RodoPage`, `NotFound`.

**Wypadają z v1 po reframe:** `HeroMedia` i `MediaBoundary` (nie ma `<video>`), `MetricsStrip` + `Counter` (pasek „W liczbach" usunięty, D30), `MiniReport` / `MiniKsef` / `MiniAudit` (jedyny żywy komponent na `/` stoi w S2; komórki bento dostają statyczny kadr zrzutu). **Usunięte jak dotąd:** `ToolsGrid` (drill-down), `Differentiators`, `ui/button|badge|card|canvas-reveal-effect|radial-orbital-timeline`, `lib/utils.ts`, `content/`, `data/` (YAML), `public/screens/placeholder.svg`, `Logo.zip`, `zoomRef`, sondy decka w `index.html`.

---

## 6. System motion: „poziom wyżej, bez teatru"

### 6.1 Biblioteka i provider

`motion@13.2.0` (pin; minimum 13.1.1 przez fix `AnimatePresence` + React 19 StrictMode). Stack: `LazyMotion features={domAnimation} strict` (sync, żeby hero nie stał w `initial` na wolnym łączu) + `m.*` z `motion/react-m` + `MotionConfig reducedMotion="user"`. Zakaz `import { motion }` (strict rzuci), zakaz `layout/layoutId/drag/Reorder` (wymagają `domMax`). Budżet chunków Motion **≤ 36 KB gz** (pomiar bazowy 33,8 KB w Vite/Rollup; skok > 40 KB = ktoś wciągnął `domMax` lub pełny `motion` → fail bramki). 36, nie 35: taki próg jest już zaimplementowany w `.claude/skills/klarow-guardian/scripts/verify-site.mjs:248` i zapisany w `synthesis.md`; jedna wartość w skrypcie i w planie. Montaż: `main.tsx` → `<StrictMode><BrowserRouter><LangProvider><MotionProvider><App/>`; **nigdy** w `src/prerender/entry.tsx`.

### 6.2 Tokeny ruchu (`src/motion/tokens.ts` + te same wartości w `tokens.css`)

```ts
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;   // = --ease-out kitu
export const EASE_SOFT = [0.3, 0.7, 0.3, 1] as const;  // = --ease-soft; clip-reveal danych
export const EASE_STD = [0.4, 0, 0.2, 1] as const;     // trasy, crossfade
export const DUR = { quick: 0.16, base: 0.24, reveal: 0.42, media: 0.6 } as const; // 0.6 = maksimum (w v1 bez wyjątków: Counter nie ma konsumenta)
export const STAGGER = 0.05;   // 50 ms; max 12 dzieci w kaskadzie
export const SHIFT = 12;       // px; jedyna odległość wejścia (duże powierzchnie: 0, tylko opacity)
export const VIEWPORT_ONCE = { once: true, amount: 0.25, margin: "0px 0px -10% 0px" } as const;
export const MOTION_TIER: "full" | "still" | "calm" = "full"; // kill-switch; NIE druga ścieżka renderu
export const MEDIA_ENABLED = MOTION_TIER === "full";   // wideo hero, klipy hover
```

**Trzy wartości, jedna ścieżka renderu (`motion-tier-flag`):** `full` = wszystko; **`still` = media off, ruch DOM bez zmian** (kill-switch wideo w minutę, bez spłaszczania całej strony); `calm` = `still` plus `MotionConfig reducedMotion="always"` (tryb awaryjny po incydencie). Stała jest czytana w **czterech** miejscach: `motion/provider.tsx`, `components/HeroMedia.tsx`, `components/ToolWall.tsx` (klipy hover) i `App.tsx`; każde inne odwołanie = fail bramki.

**Język ruchu marki (jedna krzywa, cztery czasy, jedna zasada kompozycji):**

| Element języka | Wartość | Uwaga |
|---|---|---|
| Krzywa | `cubic-bezier(.22,1,.36,1)` (`EASE_OUT`) | jedna dla całej marki; dwa nazwane wyjątki: `EASE_SOFT` wyłącznie w `ChartReveal` (maska musi ruszyć wolniej niż `opacity`), `EASE_STD` wyłącznie w `PageFade` (przejście neutralne, nie „wjeżdżające") |
| Czas: reakcja | **160 ms** (`DUR.quick`) | hover, focus, zmiana koloru, overlay dialogu |
| Czas: stan | **240 ms** (`DUR.base`) | panel dialogu, menu, zejście skeletonu |
| Czas: wejście | **420 ms** (`DUR.reveal`) | sekcje, listy, hairline `scaleX`, clip-reveal |
| Czas: media | **600 ms** (`DUR.media`) | crossfade poster → nagranie, fade portretu i kadru |
| Odległość wejścia | **12 px** w osi Y, jedyna | powierzchnie > 480 px w dowolnym wymiarze: 0 px, sam `opacity` |
| Stagger | **50 ms**, maks. 12 dzieci | kierunek czytania: lewo w prawo, góra w dół |
| Kolejność kompozycji | **najpierw pole** (`scaleX` 0 → 1 od strony czytania), **potem treść** (`opacity` + 12 px), odstęp **80 ms** | to jedyna dozwolona sekwencja; trzynaste i dalsze dziecko wchodzi razem z dwunastym |
| Powtarzalność | raz na wizytę (`VIEWPORT_ONCE`, `once: true`) | wyjątek: jawny przycisk „Odtwórz" |
| Nad zgięciem | **nic nie wchodzi** | hero, nawigacja i stopka bez animacji wejścia |

Piątej wartości czasu nie ma: wszystko powyżej 600 ms jest w tym projekcie błędem, nie decyzją. Zakazane bez wyjątku: `linear` i `ease-in-out` na interakcjach, `transition: all`, sprężyny z przestrzeleniem.

### 6.3 Komponenty (3 + `DashboardMount`/`DemoFrame` + warstwa mediów; nic więcej w v1)

| Komponent | Rola | Reguły |
|---|---|---|
| `Reveal` / `RevealGroup` | wejście sekcji lub grupy ze staggerem (`whileInView`, `VIEWPORT_ONCE`) | tylko poniżej folda; dzieci `m.li variants={fadeUp}`; max 12 w kaskadzie |
| `PageFade` | wejście nowej trasy (fade + `y` 6 px, 240 ms, `EASE_STD`), bez exit | pierwszy montaż = podmiana shellu → `initial={false}` przez `const [firstPath] = useState(() => pathname)` i porównanie (bez mutacji `ref` w renderze, bo StrictMode); Navbar i Footer poza `PageFade`; `<main id="main">` w środku; `ScrollToTop` bez zmian. **Faza 2:** React 19.3 `<ViewTransition>` (19.3.0 stable z 2026-09-09 eksportuje `ViewTransition`, `addTransitionType`, `Activity`; zweryfikowane w scratchpadzie `react-check`), po ≥ 2 tygodniach stabilizacji i spike'u interakcji z `BrowserRouter`/`Suspense`/`ScrollToTop`; nigdy VT i Motion na tym samym elemencie |
| `ChartReveal` | clip-reveal L→R raz ≤ 450 ms (`clipPath: inset(0 100% 0 0) → inset(0)`, `EASE_SOFT`), replay przez `key` | tylko poniżej folda i tylko na treści nieobecnej w shellu; reduced → `initial={false}`; nigdy w hero |
| `DemoFrame` | pudełko żywego dema na `/` (S2) i na podstronach: zrzut w shellu → lazy mount po idle → boundary z tym samym zrzutem | opakowuje `DemoReport` i dashboardy, nigdy ich nie edytuje (§12.1); skeleton o szerokości kontenera docelowego i `min-height` z `DASH_MINH`; `data-ready` wewnątrz `Suspense` |
| `DashboardMount` | osadzanie dashboardów | natywny `IntersectionObserver` (`once`, `rootMargin 0 0 20%`) + `requestIdleCallback` (fallback `setTimeout 1`) + kolejka szeregowa 150 ms + `React.lazy` z mapą literalnych ścieżek + `Suspense` `.skel` + `minHeight` + boundary; 0 KB Motion w chunku narzędzia |
| `HeroMedia` + `MediaBoundary` | **wracają do v1 (D36, D37)**: poster `<img>` (LCP) plus nagranie N1 montowane po `load` i `requestIdleCallback`, crossfade po `canplay`, bezpiecznik 4 s, pauza przez `IntersectionObserver` i `visibilitychange`, przycisk `hero-media-toggle` (WCAG 2.2.2, stan w `sessionStorage`) | `media-video-gating`, `media-video-embed-spec`, `media-video-placement`; awaria mediów degraduje do postera, nigdy do pustego drzewa (historia `BgBoundary` 2026-07-23) |
| `ChaosToOrder` | stan ładowania `DemoFrame` (S2): 96 komórek z rozsypania do siatki, kaskada kolumnami 16 ms | wyłącznie `opacity`/`transform` (`motion-gpu-props-only`), offsety z `data/scatter.ts` (zero `Math.random` w runtime), `aria-hidden` + sąsiedni `role="status"`, reduced → `initial={false}` |
| klipy hover w `ToolWall` | cztery mikro-nagrania pierwszego rzędu ściany (S3) | `preload="none"`, próg intencji 120 ms, singleton, `pointer: fine`, `pointer-events: none`; `MEDIA_ENABLED` je gasi |

`AnimatePresence` tylko w `BookingDialog` (overlay `opacity` 160 ms, panel `y` 8 → 0 240 ms, exit 160 ms) i menu mobilnym (`y` −8 → 0 200 ms). `@formkit/auto-animate` usunięty (jedna biblioteka). Faza 2: `WipeCompare` „Przed i po. Na żywo." na 3 flagowych podstronach po pomiarze repaintu `clip-path` nad `DemoReport` (Performance / Paint flashing; L8), przełącznik segmentowy `aria-pressed` pod reduced-motion. Hover mikro-dema z `record-demos.mjs` **weszły do v1** (D35 zmienione).

### 6.4 Media w v1: jedno autoodtwarzane nagranie na `/` i cztery klipy hover

**Stan po decyzji z 2026-09-12 wieczorem (D36, D37, D35):** w v1 na stronie jest **dokładnie jedno autoodtwarzane `<video>`** (hero na `/`, nagranie prawdziwego narzędzia, jedno odtworzenie bez `loop`, wyłącznie desktop) oraz **cztery klipy hover** na ścianie S3, które startują **wyłącznie z intencji użytkownika** (hover z progiem 120 ms albo fokus klawiatury) i nie liczą się jako autoplay. Na pozostałych 18 trasach: zero `<video>`. Na `pointer: coarse`, przy `prefers-reduced-motion`, `saveData` i łączu 2g/3g **element nie powstaje** (nie „powstaje i jest zapauzowany"): zostaje kadr produktu.

`HeroMedia` i `MediaBoundary` **wracają do v1**; `wantsVideo()`, crossfade poster → nagranie i przycisk pauzy („Zatrzymaj podgląd / Pause preview") są zakresem F2. Reguły `media-*` strażnika (`media-one-autoplay-per-route`, `media-video-budgets`, `media-video-gating`, `media-video-embed-spec`, `media-poster-first-frame`, `media-higgsfield-inputs-policy`, `media-video-placement`, `media-headers-versioning`, `media-asset-review-gate`, nowa `media-recorded-demo-determinism`) **obowiązują wprost od F1**, bez statusu warunkowego. Każde `<video>` poza `HeroMedia.tsx` i `ToolWall.tsx` = BLOCKER; każde `<video>` w shellu prerendera = BLOCKER.

Wymagania, które obowiązują tak samo dla obrazów: `width`/`height` na każdym `<img>` (CLS), `fetchpriority="high"` i preload wyłącznie na kadrze hero, `loading="lazy"` na wszystkim poniżej, `alt` w parze `{ pl, en }`, wersjonowanie nazwą pliku (`-v1`) pod `immutable` w `_headers`, przegląd ręczny kadru (tekst, ludzie, logo, nazwa produktu w kadrze = odrzucone).

### 6.5 Tabela degradacji

| Element | Desktop `pointer: fine` | `pointer: coarse` (telefon, tablet) | `prefers-reduced-motion` | `saveData` / 2g-3g | Bez JS (bot, LLM) |
|---|---|---|---|---|---|
| Kadr produktu w hero (poster, LCP) | ten sam obraz (WebP, `srcset`) | ten sam obraz, wariant 800×500 | ten sam obraz | ten sam obraz | `<img>` w shellu |
| **Nagranie hero (`<video>`)** | montaż po `load` + `rIC`, crossfade po `canplay`, pauza poza viewportem i przy `document.hidden`, koniec na ostatniej klatce | **nie powstaje** (0 B transferu) | **nie powstaje** | **nie powstaje** | **nie powstaje** (zero `<video>` w shellu) |
| **Grunt stalowy hero (still H1)** | `loading="lazy"`, fade 400 ms po `decode()` | wariant 800 px ≤ 30 KB | ten sam obraz (to nie ruch) | pomijany | pomijany (nie ma go w shellu) |
| **Klipy hover ściany (4)** | start po 120 ms intencji albo `focus-visible`, maks. 1 naraz | **nie powstają** (na dotyku hover nie istnieje, tap otwiera podstronę) | **nie powstają** | **nie powstają** | **nie powstają** |
| Kontrola pauzy `hero-media-toggle` | widoczna, gdy wideo jest zamontowane | nie ma (nie ma wideo) | nie ma | nie ma | nie ma |
| Żywe demo na `/` (S2) | lazy mount po IO + idle | lazy mount po IO + idle | mount bez `ChartReveal` | lazy mount (chunk ≤ 45 KB gz) | zrzut z shellu + link do podstrony |
| Reveale sekcji | fadeUp | fadeUp | fade (opacity only, `MotionConfig`) | fadeUp | shell bez `opacity:0` |
| Kadry zrzutów w bento S4 | statyczne | statyczne | statyczne | statyczne | `<img>` w shellu |
| Ściana S3 (featured + 12 kafli) | hover = hairline → `--accent`; pierwszy rząd dodatkowo klip | brak hover; linki | brak | brak klipów | 13 linków + `<img>` w shellu |
| Dashboardy | lazy + IO + `.chart-reveal` | lazy + IO | bez reveal | lazy | opis + FAQ w shellu |
| Trasy | `PageFade` | tak | brak (opacity dozwolone) | tak | pełny HTML per trasa |
| Dialog / menu | `AnimatePresence` | tak | bez transformu | tak | brak |

Test: Chrome DevTools „Emulate prefers-reduced-motion" + Windows „Efekty animacji" OFF + iOS „Ogranicz ruch" + Playwright WebKit 390×844; kryterium: zero elementów utkniętych w `initial` **i zero requestów do `/media/*.webm|mp4` w każdej kolumnie poza pierwszą** (bramka runtime liczy requesty, nie tylko elementy w DOM).

### 6.6 Zakazy (wpis do strażnika)

Sticky-stack, pinowanie i scroll-hijack niezależnie od techniki (decyzje Karola 2026-07-22 i 07-26), parallax, marquee, kursor własny, glitch/scramble tekstu, blur w wejściach, `layout` bez `domMax`, animowane SVG w tle (`stroke-dashoffset`, `pathLength`), „rysowanie" wykresów, `window.addEventListener("scroll")`, `transition: all` (dziś `Navbar.tsx:67,122`), `linear`/`ease-in-out` na interakcjach, drugie autoplay-wideo na trasie, `will-change` masowo, GSAP, three.js w tym samym drzewie co Motion, Motion w prerenderze, `initial` ukrywające treść nad foldem, nowy `position: fixed` w `.content-layer`, `overflow:hidden` na `html/body`.

### 6.7 Budżety (bramki mechaniczne w `verify-site.mjs` i Lighthouse w F4)

| Metryka | Budżet |
|---|---|
| LCP mobile (`/`, 4G, Moto G4) | < 2,5 s |
| LCP desktop | < 1,8 s |
| CLS | < 0,1 (cel 0,05) |
| INP | < 200 ms |
| JS krytyczny na `/` | ≤ 140 KB gz (react-dom ~58 + router ~15 + motion ~34 + app ~25); liczony wyłącznie ze skryptów statycznych `dist/index.html` |
| **Lazy JS na `/`** (`DemoFrame`: `DemoReport` + `lib/report.ts`) | **≤ 45 KB gz** (`homeLazyGz`, mierzone osobno); nigdy w `modulepreload`, nigdy w ścieżce LCP |
| Chunki Motion | ≤ 36 KB gz (wartość z `verify-site.mjs:248`) |
| Chunk podstrony narzędzia | ≤ +60 KB gz (ToolPage + 1 dashboard) |
| CSS | ≤ 20 KB gz |
| Fonty | ≤ 100 KB (Nunito solo) / ≤ 150 KB przy Geist (tylko subset latin ≤ 55 KB obok Nunito albo podmiana kroju; para z pełnym Geist = ~163 KB, nie przechodzi) |
| Kadr produktu w hero (**element LCP na `/`**, bramka elementowa) | ≤ 110 KB (1600×1000), mobile ≤ 55 KB (800×500); LQIP ≤ 2 KB; **jest klatką 0 nagrania** |
| Nagranie hero `hero-production-v<N>` | WebM (VP9) ≤ 1,2 MB · MP4 (H.264) ≤ 1,4 MB · AV1 opcjonalny ≤ 0,9 MB; 8 s, 24 fps CFR, `-an`, bez `loop`; **nigdy preload** |
| Grunt stalowy hero (still Higgsfield) | ≤ 70 KB (WebP 1600 px), mobile ≤ 30 KB; `loading="lazy"`, nigdy `fetchpriority` |
| Klip hover ściany `tools/<slug>-v<N>.webm` | ≤ 320 KB, 960×600, 6–7 s, `preload="none"`; dokładnie 4 klipy; suma na trasie ≤ 1,3 MB |
| Zrzuty dem | ≤ 120 KB (1280×800), miniatury hubu ≤ 40 KB (640×400) |
| Kafel ściany narzędzi | ≤ 30 KB (480×300), wariant mobile ≤ 16 KB (320×200) |
| Transfer pierwszego wejścia mobile (`/`) | ≤ 350 KB (60 + 135 + 20 + 93 + 10 ≈ 320), **w tym 0 B mediów wideo** (bramka `pointer: coarse`) |
| Transfer desktop `/` **do zdarzenia `load`** | ≤ 700 KB (bramka przeciw przemyceniu wideo przed LCP) |
| Transfer desktop `/` **pełna wizyta** (ściana zrzutów + nagranie hero, bez klipów hover) | ≤ 2,5 MB |
| Autoplay `<video>` per trasa | **≤ 1 na `/`**, 0 na 18 pozostałych trasach; wyłącznie `pointer: fine`, montaż po `window.load` |
| Prerender | 19 HTML; `index.html` **i** `narzedzia.html` ≥ 13 linków `/narzedzia/<slug>`; 1 H1 i `<main>` per plik |

---

## 7. Assety: nagrania i zrzuty prawdziwych narzędzi (0 kr) plus statyczna faktura z Higgsfielda

> **Korekta 2026-09-12, wieczór (decyzja Karola, wiążąca; `docs/plan/warstwa-wrazenia.md`, D36–D38).** Poranne „zero wideo w v1" jest **odwrócone w części o wideo**. Reszta korekty obowiązuje bez zmian (brak podmiotu i zakup na kartę prywatną, trzy progi prawne, narzędzia jako bohater strony, brak paska „W liczbach", ludzie na pozycji 6, ściana 1 + 12, zero pinowania, karuzeli i teatru licznikowego).
>
> **Dwie nogi assetów, rozłączne:** (1) **ruch na stronie robią prawdziwe narzędzia** nagrane Playwrightem (`record-demos.mjs`, 0 kredytów, deterministyczne, responsywne); (2) **Higgsfield daje wyłącznie statyczną fakturę** (grunt hero, tło OG) i materiał wideo **poza stroną** (LinkedIn). Uzasadnienie podziału: nagranie narzędzia jest jednocześnie ruchem i dowodem, a pętla abstrakcyjna jest tylko ruchem i zajęłaby jedyny slot autoodtwarzania na `/`; faktury z kolei nie da się nagrać Playwrightem.

### 7.1 Decyzja: wideo wraca do v1 jako nagranie narzędzia (D37; zmienia D28 i D12 w części o wideo)

- **Hero** = kadr `ProductionDashboard`, który jest **klatką zero ośmiosekundowego nagrania tego samego dashboardu** (§3 S1). Kadr zostaje LCP, nagranie startuje po `window.load` i gra raz.
- **Ściana S3**: cztery klipy hover z `record-demos.mjs` (D35 zmienione), uruchamiane wyłącznie przez użytkownika.
- **Higgsfield w v1**: `nano_banana_pro` (stille), zero wideo w `site/public/`. Lista H1–H4 w §7.3.
- **GLSL Hills schodzą z bundla `/` w F0** i **nie wracają**: jedno ruchome tło na trasę jest zajęte. Plik i `BgBoundary` zostają w repo jako wzorzec GPU-higieny; `three` i `@react-three/fiber` wypadają z `dependencies` (−118 KB gz na wizytę desktop).
- **Telefon bez zmian wobec porannej korekty:** `pointer: coarse` nie dostaje ani jednego bajtu wideo (decyzja z 2026-07-24), transfer pierwszego wejścia ≤ 350 KB, LCP mobile < 2,5 s.
- **Czego nie robimy nigdy w zamian:** pinowania, karuzeli, scroll-hijacku, **drugiego autoplaya na trasie**, scroll-scrubbingu wideo, animowanej typografii i wordmarku, teatru licznikowego (decyzje Karola z 2026-07-22 i 2026-07-26 obowiązują). Jeśli po publikacji padnie „za sucho", lekarstwem jest jakość kadrów i typografii, nie kolejny ruch.
- **Wariant B (bez kosztu, gotowy do podmiany):** hero z porannej korekty, czyli statyczny kadr produktu, grunt zastąpiony gradientem na tokenach, zero `<video>`. Wchodzi, gdy nagranie nie przejdzie bramki czytelności (§7.3a) albo gdy realny iPhone pokaże jakąkolwiek regresję.

### 7.2 Zakupy i konta bez zarejestrowanej działalności (D13 zmienione: kupujemy, ale świadomie i wąsko)

**Zakres potrzebny stronie mieści się w bezpłatnym trialu (100 kredytów, 0 USD), więc publikacja nie zależy od żadnej płatności.** Jedyny wydatek to opcjonalny miesiąc PLUS (49 USD + VAT) na materiał wideo **poza stroną**. **Agent nie uruchamia trialu ani zakupu**: procedura jednej świadomej akcji foundera, z anulowaniem, jest w `docs/plan/warstwa-wrazenia.md` §7. Przy każdym zakupie narzędziowym (Cal.com, subskrypcja, Higgsfield) obowiązuje jedna procedura:

1. **Konto i płatność: karta prywatna administratora danych** (ta sama osoba co w `CONTROLLER`, D25). Inaczej po rejestracji trzeba przenosić licencje i umowy powierzenia między osobami, a `/rodo` przestaje być prawdziwe.
2. **Faktura na osobę fizyczną.** Koszt poniesiony przed rejestracją co do zasady nie stanie się kosztem uzyskania przychodu po rejestracji. Nie wpisujemy wstecz NIP-u przyszłej firmy i nie prosimy dostawcy o korektę danych nabywcy po fakcie. Po rejestracji zmieniamy dane rozliczeniowe na istniejącym koncie, nie zakładamy drugiego. Do potwierdzenia z księgową.
3. **Efekt uboczny na plus:** kupując jako osoba prywatna, nie mamy obowiązku rejestracji VAT-UE ani rozliczenia importu usług, który powstałby przy zakupie na firmę od dostawcy spoza Polski.
4. **Prawa komercyjne przed użyciem, nie przed generowaniem.** Użycie wygenerowanego assetu na klarow.com jest użyciem komercyjnym niezależnie od tego, że nie ma firmy: sprawdzamy w regulaminie planu, z którego powstał **finał**, i zapisujemy plan, datę i właściciela konta w `site/media/SOURCES.md`.
5. **Higiena subskrypcji:** przypomnienie w kalendarzu na dzień 3 triala (`cancel_trial_auto_renewal` → `confirm_trial_cancel`) i drugie na dzień 27 pierwszego miesiąca planu płatnego. Karta prywatna plus auto-odnowienie plus brak firmowej kontroli kosztów to klasyczny sposób na „49 $ przez pół roku".

### 7.3 Lista assetów Higgsfield w v1: H1–H4 (zastępuje listę G1–G7)

Zakres jest celowo wąski: **wyłącznie to, czego nie zrobi ani nagranie, ani kod**. Prompty (blok stałych, T-IMG), komendy ffmpeg, higiena kredytów i wzór wpisu do `SOURCES.md`: `.claude/skills/klarow-guardian/references/higgsfield-pipeline.md`.

| # | Asset | Model i parametry | Podejścia × koszt | Kredyty | Gdzie trafia |
|---|---|---|---|---|---|
| **H1** | **Grunt stalowy pod hero**: satyna z delikatnym gradientem światła, bez obiektów, maska radialna, `opacity .35` | `nano_banana_pro`, `resolution: 2k`, prompt T-IMG-4 + blok stałych | 12 × 2 | **24** | `site/public/media/hero-ground-v1.webp` ≤ 70 KB |
| **H2** | **Master still** (style lock): źródło spójności dla H1, H3 i H4 | `nano_banana_pro`, `resolution: 4k`, prompt T-IMG-1 | 6 × 2–3 | **15** | tylko `site/media/src/`, nigdy do `public/` |
| **H3** | **Tło obrazków OG** 1,91:1, więcej pustej przestrzeni w dolnej połowie | `nano_banana_pro`, `image_references` = H2 | 5 × 2 | **10** | warstwa tła w `scripts/og.mjs`; wordmark i tytuł dorysowuje kod, **nigdy model** |
| | rezerwa 15 % zakresu strony | | | **7** | |
| | **Zakres STRONY razem** | | | **≈ 56** | **mieści się w trialu 100 kr, 0 USD** |
| **H4** | **Pętla na LinkedIn** 1:1 i 4:5, 8 s, ruch ledwo wyczuwalny (**poza stroną**) | `kling3_0`, `start_image = end_image = H2`, `mode: std` → `pro`, `sound: off` | 6 × 14 + 2 × 30 (+ 22 rezerwy) | **166** | materiały sprzedażowe i bot `/post`; **zero plików w `site/public/`** |
| | **Razem** | | | **≈ 222** | |

**Dwie niezależne decyzje finansowe:** zakres strony (H1–H3) = **0 USD** w trialu; zakres social (H4) = **49 USD + VAT** za jeden miesiąc PLUS. Odrzucenie materiału w przeglądzie kosztuje 0 USD i 0,5 dnia. **ULTRA 129 USD niepotrzebne** (rekomendacja ULTRA z researchu dotyczyła pełnej listy 13 assetów ≈ 1 300–2 200 kr, której tu nie ma).

**Co NIE powstaje generatywnie, mimo że research to wymienia:** pętla tła hero (zajęłaby jedyny slot autoodtwarzania: D37), przejście „chaos w porządek" (kodem, D38), tła pętlowe podstron, pętla mobile 9:16 (mobile nie dostaje wideo), light-sweep pod wordmarkiem, mikro-animacje ikon (lucide zostaje statyczne), ludzie, hale, biura, fałszywe UI i arkusze, zrzuty i **nagrania** dem, OG per trasa, portrety founderów.

**Higiena wejść (BLOCKER, `media-higgsfield-inputs-policy`):** do modelu **nigdy** nie trafiają nagrania ekranu narzędzi (`record-demos.mjs`), zrzuty dashboardów (także z danymi fikcyjnymi: model uczy się layoutu), dane leadów i klientów, portrety founderów ani nic z okresu firmy źródłowej. Po sprincie generacje kasujemy z konta (kończy licencję treningową), każda seria dostaje wpis w `site/media/SOURCES.md`.

### 7.3a Bramka: kiedy nagranie hero wchodzi, a kiedy wraca wariant B

Mierzone, nie odczuwane; zamykane w F1, przed zamknięciem F2:

| # | Test | Próg | Jeśli nie zda |
|---|---|---|---|
| 1 | **Czytelność po kompresji**: stop-klatka 1600 px, cyfry KPI i etykiety osi po VP9 na budżecie 1,2 MB, oglądane na OLED i na 1440p | zero artefaktów wokół cyfr, hairline 1 px nie faluje | ciaśniejszy kadr (jedno podejście), potem wariant B |
| 2 | **Czy ruch czyta się jako praca narzędzia**: dwie osoby oglądają 8 s bez kontekstu i mówią, co widzą | odpowiedź zawiera „liczy", „przelicza", „zmienia się" | wariant B |
| 3 | **Grunt H1 przechodzi `media-asset-review-gate`** (brak ludzi, tekstu, ciepłych barw, „nie widać, że AI") | wszystkie pozycje TAK | wypada sam grunt; reszta hero zostaje (warstwy są niezależne) |
| 4 | **Lighthouse**: mobile perf ≥ 90, LCP desktop < 1,8 s, **element LCP = kadr produktu** | progi z §6.7 | wariant B |
| 5 | **Realny iPhone Karola**: brak regresji „samo tło", `?debug=1` czysty | zero regresji | wariant B natychmiast, bez dyskusji |

**Kolejność jest wiążąca:** reguły i bramki najpierw (na pustym stanie), potem kontrakt warstw hero testowany na dwusekundowej **czarnej zaślepce**, dopiero potem pierwszy kredyt i pierwsze nagranie. Bramka powstała po asecie zawsze przepuszcza pierwszy asset.

### 7.4 Assety v1: komplet (M1–M11; wszystko poza M10 i M11 za 0 kr)

| # | Asset | Jak |
|---|---|---|
| M1 | **Zrzuty narzędzi**: 12 dem + 1 render `KsefFlow` + 3 zrzuty trybu mock KSeF = **16 obrazów źródłowych**, każdy w 2 rozmiarach = **32 pliki** (1280×800 ≤ 120 KB i 640×400 ≤ 40 KB) | `site/scripts/shoot-tools.mjs` (§7.5) |
| M1a | **Kafle ściany na `/`**: 12 × 480×300 ≤ 30 KB (+ 320×200 ≤ 16 KB) | ten sam skrypt, trzeci rozmiar |
| M1b | **Kadr hero**: `ProductionDashboard` 1600×1000 ≤ 110 KB (+ 800×500 ≤ 55 KB) | ten sam skrypt, scena `hero` |
| M1c | **Kadr „ścieżki wyliczenia"** do S7: `DemoReport`, 1200×1500 (4:5) ≤ 120 KB | ten sam skrypt, scena `sciezka` |
| M2 | Portrety founderów × 2 (WebP 960×1200 ≤ 90 KB + 480×600) | founderzy; neutralne tło, jedno światło; duotone w Photoshop 2026 (Gradient Map `#121212 → #A8B4C2`, 3 % ziarna) lub, przy braku potwierdzonej licencji (D20), CSS `filter: grayscale(1) contrast(1.05)` + overlay `--accent` 12 % `mix-blend-mode: soft-light` (0 zależności) |
| M3 | Ikony | `lucide-react`, mapa w `data/home.ts` |
| M4 | `CollaborationFlow` | istniejący SVG, 1:1 |
| M5 | `KsefFlow` + (faza 2) ilustracje schematyczne case | nowe SVG na tokenach, ≤ 12 KB |
| M6 | Favicon, apple-touch-icon | istniejące („K" w stali) |
| M7 | OG per trasa | `scripts/og.mjs` (SVG → PNG w buildzie, deterministyczny: tokeny + wordmark + tytuł), PNG ≤ 200 KB; F3. Warstwą tła może być H3 (M11), ale brak H3 nie blokuje: fallbackiem jest płaskie tło na tokenach |
| M8 | Fonty | Nunito Sans woff2 self-hosted z `unicode-range`, `font-display: swap`, `<link rel="preload" as="font">` dla latin; zero CDN |
| M9 | **Nagrania narzędzi (v1, D35 zmienione): 5 pozycji** | `site/scripts/record-demos.mjs` (§7.5a). **N1 `dashboard-produkcji` → hero** (8 s, 1600×1000, bez `loop`, WebM ≤ 1,2 MB / MP4 ≤ 1,4 MB, poster = klatka 0 = kadr hero) oraz cztery klipy hover pierwszego rzędu ściany (960×600, 6–7 s, WebM ≤ 320 KB, `loop`, poster = kafel 480×300): **N2** `kontroling-kosztow` (ETC w górę → EAC → marża spada → bramka tygodnia), **N3** `raport-zarzadczy` (przykład → KPI → wykres → tabela), **N4** `import-z-rekoncyliacja` (FAIL → poprawka → PASS z różnicą 0,00; najmocniejsze z piątki), **N5** `os-czasu-zadan` (Stary → Nowy, ogony obsuwy, `+2d`/`−1d`). Rezerwa (nie wchodzi do v1): `audyt-jakosci-danych` jako zamiennik, gdyby któreś z N2–N5 odpadło |
| M10 | **Grunt stalowy hero (H1, Higgsfield)** | `nano_banana_pro` 2k, prompt T-IMG-4; WebP 1600 px ≤ 70 KB (+ 800 px ≤ 30 KB); `loading="lazy"`, nigdy preload; wypada bez wpływu na resztę hero |
| M11 | **Tło obrazków OG (H3, Higgsfield)** | `nano_banana_pro` 2k, `image_references` = master still; warstwa tła w `og.mjs`, wordmark i tytuł dorysowuje kod |

Parametry wspólne (z `perf-images-policy`): WebP bez metadanych; nazwy `site/public/media/tools/<slug>-v1-1280.webp`, `site/public/thumbs/<slug>-v1-640.webp`, `site/public/media/ksef/<scena>-v1-1280.webp` (sufiks `-v1` w nazwie, nie w query, bo `/media/*` jest `immutable`); drabinka jakości 80 → 78 → 74 → 70, **poniżej limitu nie schodzimy: przekroczenie = błąd skryptu, nigdy cichy rozmyty plik**; `alt=""` dla kafli i miniatur (nazwa stoi obok w DOM), `alt` opisowy dla kadru hero, kadru ścieżki wyliczenia i galerii KSeF; motyw ciemny, kontekst `reducedMotion: "reduce"`; język PL w v1 (EN dostaje te same obrazy: świadomy kompromis, R-T4, `--lang en` gotowy do fazy 2 razem z trasami `/pl/ /en/`).

### 7.5 `site/scripts/shoot-tools.mjs` (specyfikacja)

**Uruchamianie** (zawsze `node` wprost, `npx` w tym repo nie działa):

```bash
cd site && npm run build
node scripts/shoot-tools.mjs                      # komplet
node scripts/shoot-tools.mjs --only raport-zarzadczy
node scripts/shoot-tools.mjs --verify             # bez zapisu: porównuje sumy z manifestem
node scripts/shoot-tools.mjs --svg-fallback       # render KsefFlow do WebP (rama featured nigdy pusta)
node scripts/shoot-tools.mjs --import-ksef "<katalog z 3 obrazami od Karola>"
node scripts/shoot-tools.mjs --contact-sheet      # arkusz 4×4 do przeglądu, zapisywany do scratchpada
```

- **Playwright nie jest zależnością repo.** `playwright-core` mieszka w scratchpadzie (katalog repo ma `&` w ścieżce i łamie shimy); skrypt importuje go po absolutnym URL-u pliku (`PW_CORE` w środowisku), a brak ścieżki daje czytelny błąd z instrukcją, nigdy `npx`.
- **Silnik: WebKit**, `executablePath` rozwiązywany globem `%LOCALAPPDATA%/ms-playwright/webkit-*` (ten sam mechanizm co `scripts/screenshots.mjs` w skillu strażnika). `--engine=chromium` tylko do szybkiego podglądu; pliki wchodzące do repo powstają wyłącznie na WebKicie (jeden silnik = powtarzalny rendering fontów).
- **Źródło stron: `site/dist`**, serwowane przez wbudowany `node:http` na `127.0.0.1:8766`, **bez SPA-fallbacku** (chcemy prerenderowane `dist/narzedzia/<slug>.html`, nie shell). Nigdy dev-server: HMR i niezminifikowany CSS dają inny piksel.
- **Kontekst (determinizm układu):** `viewport 1440×900`, `deviceScaleFactor: 2`, `colorScheme: "dark"`, `reducedMotion: "reduce"`, `locale: "pl-PL"`, `timezoneId: "Europe/Warsaw"`, `hasTouch: false`. Po każdej nawigacji `addStyleTag`: `*{caret-color:transparent!important} ::-webkit-scrollbar{display:none} *:focus-visible{outline:none!important}` (kursor w polu i pierścień fokusu to dwa najczęstsze źródła różnic piksela między przebiegami).
- **Kontekst (determinizm danych), `addInitScript` przed kodem aplikacji:** `Date.now` i bezargumentowy konstruktor `Date` zamrożone na `2026-07-22T09:00:00.000Z` (ta sama data, którą `TaskTimeline` trzyma jako „Dziś"); `Math.random` na `mulberry32(0xC10A12)`; `window.__nondet = []` zbiera każde wywołanie `Date.now`, `Math.random`, `fetch`, `XMLHttpRequest` i po zrzucie jest wypisywane jako ostrzeżenie (darmowa bramka `demo-determinism`: `Date.now` wstawiony kiedyś do silnika zobaczymy przy pierwszym zrzucie); `localStorage.clear()` plus ustawienie języka przed pierwszą farbą (`CostControl` i `ContractRegister` zapisują lokalnie, więc drugi przebieg zastałby stan po pierwszym).
- **Procedura per pozycja:** `goto` → `waitForSelector("[data-dashboard][data-ready='true']")` → `waitForSelector("[data-dashboard] .skel", { state: "detached" })` → `document.fonts.ready` → kroki sceny → opcjonalny `waitFor` (np. tekst „PASS") → dwa `requestAnimationFrame` → **bramka marki** (`SRC_BRAND_RE` czytany z `audit-static.mjs --print-src-brand-re`; brak wzorca = twardy błąd, nie ciche pominięcie) → `screenshot({ clip })` → `sharp` do trzech rozmiarów z drabinką jakości → wpis do manifestu.
- **Scenariusze wyłącznie na rolach i widocznym tekście** (`getByRole`, `getByText`). Powód: §12.1 zamraża `components/dashboards/**` i `DemoReport.tsx` w v1, więc **nie wolno dokładać w nich atrybutów `data-shot`**. Dozwolone są tylko `data-dashboard` i `data-ready`, bo siedzą na `DashboardMount` (nowy komponent z F0). Konsekwencja: zmiana etykiety przycisku w dashboardzie unieważnia scenę, więc scenariusz cytuje etykietę i numer linii źródła w komentarzu, a brak trafienia kończy się twardym błędem z nazwą sluga, nigdy pustym zrzutem.
- **Manifest `site/media/SHOTS.json`** (commitowany, stabilny JSON: klucze posortowane, wcięcie 2), po jednym wpisie na plik: `file`, `slug`, `scene`, `w`, `h`, `bytes`, `quality`, `sha256`, `engine`, `shotAt: "F1"`. **W manifeście nie ma dat generowania** (data zmieniałaby plik przy każdym przebiegu i psuła sens porównania: ta sama pułapka co `seo-lastmod-from-git-not-now`). `--verify` liczy sumy na nowo i porównuje: różnica = wyjście 1 z listą plików. Bramka lokalna `check:shots`, nie na CI (CI nie ma przeglądarki).
- **Konwersja: `sharp` jako `devDependency`** (ten sam bajt przy tych samych opcjach, bez zależności od wersji ffmpeg w PATH i bez przekazywania ścieżki z `&` do podprocesu). Wpis do rejestru zależności wymagany (`integ-dependency-audit`); `sharp` nie trafia do bundla klienta.
- **`--import-ksef <katalog>`** normalizuje 3 obrazy z trybu mock dostarczone przez Karola i **wymusza wpis w `site/media/SOURCES.md`** z podpisem „potwierdzam, że w kadrze nie ma nazwy produktu ani domeny" (luka L12, §4.3). Skrypt nie czyta tekstu z obrazu, więc to jedyna uczciwa bramka.
- **`--svg-fallback`** renderuje `KsefFlow` przez `page.setContent` w tym samym kontekście i zapisuje jako `kontroling-ksef-v1-1280.webp` plus miniatury. Dzięki temu **featured na `/` i karta KSeF w hubie nigdy nie są puste**, nawet jeśli zrzuty mocka nie przyjdą: strona główna nie zależy od czasu founderów.

### 7.5a `site/scripts/record-demos.mjs` (specyfikacja; 0 kredytów)

Uruchamianie jak `shoot-tools.mjs` (`node` wprost, `playwright-core` ze scratchpada przez `PW_CORE`, WebKit z `%LOCALAPPDATA%/ms-playwright/webkit-*`, serwer `dist` na `127.0.0.1:8767` bez SPA-fallbacku, żeby oba skrypty mogły działać równolegle):

```bash
node scripts/record-demos.mjs                  # komplet 5 scen
node scripts/record-demos.mjs --only os-czasu-zadan
node scripts/record-demos.mjs --verify         # bez zapisu: hashe klatek, rozmiar, długość, PSNR klatki 0
node scripts/record-demos.mjs --contact-sheet  # arkusz stop-klatek do przeglądu (scratchpad)
```

- **Kontekst deterministyczny identyczny ze zrzutami** (zamrożony `Date` na `2026-07-22T09:00:00.000Z`, `Math.random` = `mulberry32(0xC10A12)`, `localStorage.clear()`, `colorScheme: "dark"`, `locale: "pl-PL"`, `timezoneId: "Europe/Warsaw"`, `hasTouch: false`, `addStyleTag` gaszący karetkę, scrollbar i pierścień fokusu), z **jedną różnicą: `reducedMotion: "no-preference"`**, bo inaczej dashboardy nie zagrają własnych reveali, a to one są treścią nagrania.
- **`recordVideo` nagrywa w rozmiarze viewportu i ignoruje `deviceScaleFactor`**, więc klipy powstają w skali 1×; klip hover wyświetlamy w kafelku 480×300 i nigdy większym.
- **Playwright nie rysuje kursora**, a sztucznego nie dorysowujemy (byłby fałszywym elementem UI): każda scena musi być czytelna przez **zmianę stanu**, nie przez „klik".
- **Determinizm rozwiązany inaczej niż przy zrzutach** (`media-recorded-demo-determinism`): kontener z Playwrighta nie jest bajtowo powtarzalny (timing enkodera), więc potok jest dwuetapowy: **nagraj → wyodrębnij klatki PNG `fps=24` → policz `sha256` klatek → re-enkoduj z klatek na stałych 24 fps CFR**. Manifest `site/media/CLIPS.json` (bez dat) trzyma digest listy klatek, bajty, długość i PSNR klatki 0 wobec zrzutu tego samego narzędzia (≥ 45 dB po przeskalowaniu obu do 960×600). Pętlę klipów hover domyka `xfade` ogona w głowę (400 ms) po 1,2 s przytrzymania stanu końcowego; nagranie hero **nie jest zapętlane**.
- **Scenariusze wyłącznie na rolach i widocznym tekście** (`getByRole`, `getByText`), bo `components/dashboards/**` i `DemoReport.tsx` są zamrożone w v1 (§12.1): **nie wolno dokładać `data-shot`**. Scenariusz cytuje etykietę i numer linii źródła w komentarzu; brak trafienia = twardy błąd z nazwą sluga, **nigdy puste nagranie** (R-T3).
- **Bramka lokalna `check:clips`** w `npm run check` (jak `check:shots`, nie na CI: CI nie ma przeglądarki). Rozjazd manifestu z UI = czerwony build, nie „do poprawy kiedyś".
- **ffmpeg wymagany** (`winget install Gyan.FFmpeg`): build ffmpeg dostarczany z Playwrightem (`ffmpeg-1011`) ma **wyłącznie `libvpx_vp8`**, bez VP9, x264, WebP i AV1, więc nie nadaje się do produkcji plików. **Build strony nigdy nie woła ffmpeg**: do gita wchodzą gotowe pliki, więc brak ffmpeg u kogokolwiek nie psuje `npm run build` ani CI.

### 7.6 Sceny pokazowe (13 pozycji)

„Scena" = dokładny stan ekranu do uchwycenia; kadr (`clip`) dobrany tak, żeby siatka trzynastu kafli miała trzynaście **różnych typów obrazu** (R-T1). Stany startowe odczytane z kodu dashboardów: `raport-zarzadczy`, `audyt-jakosci-danych`, `import-z-rekoncyliacja`, `importy-erp` i `protokoly-robocizny` startują puste (wymagają kliknięcia), pozostałe mają dane wstępne.

| # | Slug | Kroki | Kadr i co ma być widać |
|---|---|---|---|
| 1 | `raport-zarzadczy` | klik „Załaduj przykładowe dane" → czekaj na wykres | pas 3 KPI + cały wykres per etap + 3 wiersze tabeli (bez sekcji „ścieżka wyliczenia": za dużo tekstu w kadrze 16:10) |
| 2 | `dashboard-produkcji` | suwak na pozycji startowej → klik kafla o statusie ryzyka | siatka kafli w całości + rozwinięte rozbicie etapowe pod klikniętym kaflem |
| 3 | `audyt-jakosci-danych` | klik „Załaduj przykład" | macierz OK / UWAGA / BŁĄD dla portfela + nagłówek listy naruszeń z pierwszym błędem |
| 4 | `import-z-rekoncyliacja` | klik „Uruchom import (TEST)" → czekaj na wynik | badge PASS + **linia dowodu sumy** (suma przed, suma po, różnica 0,00) + 4 wiersze diffu. To jest jedyny obraz na witrynie mówiący „sprawdź nas" |
| 5 | `os-czasu-zadan` | bez akcji; `scrollIntoView` na pierwsze zadanie z ujemnym dryfem | 7–8 zadań jako dwa pasy, znacznik „Dziś", co najmniej dwie etykiety `−Nd` |
| 6 | `kalkulator-transz` | „Dodaj transzę" → druga kwota | rozpiska alokacji z kolumną reszty + linia salda |
| 7 | `obieg-przelewow` | „Całość" w wierszu 1, „Część" w wierszu 2 | macierz planu 14-dniowego z wypełnionymi kolumnami + chipy decyzji |
| 8 | `billing-us-g703` | podnieś `M` pierwszej pozycji powyżej progu depozytu | tabela SOV z niezerową kolumną „do zafakturowania" + suma aplikacji płatniczej |
| 9 | `kontroling-kosztow` | wyższe ETC w jednym etapie → czekaj na przeliczenie marży | paski budżet/wydatek/przekroczenie + KPI marży po zmianie + bramka „Zatwierdź tydzień" |
| 10 | `importy-erp` | klik „Uruchom import (tryb TEST)" | badge TEST + tabela klasyfikacji słownikiem + wynik sanity-check |
| 11 | `protokoly-robocizny` | klik „Utwórz DRAFT" | podgląd protokołu jako dokument A4 + pasek statusów cyklu życia |
| 12 | `rejestr-umow` | bez akcji (lista wstępna) | tabela rejestru z paskiem akcji (szukajka, CSV, wydruk) i 6 wierszami |
| 13 | `kontroling-ksef` | `--svg-fallback` | diagram `KsefFlow`: 4 węzły + przekreślona strzałka zwrotna z podpisem „nie wysyła faktur: tylko czyta i liczy" |
| 13a–c | `kontroling-ksef` (mock) | `--import-ksef` | „Budżet vs Wykonanie", „Prognoza cashflow 13 tyg.", „Aging należności" (wskazuje Karol) |

Sceny 1, 2, 4 i 5 plus kadr hero (`ProductionDashboard`) i kadr ścieżki wyliczenia (`DemoReport`) są **warunkiem zamknięcia S1, S2, S3 i S7 w F2**; pozostałe mogą powstać do F3 razem z układem kart hubu. **Obowiązkowy przegląd `--contact-sheet` przed zamknięciem F3**: cała siatka na jednym ekranie pokazuje w dwie sekundy, czy nie mamy trzynastu identycznych ciemnych prostokątów. Bliźniacze kadry poprawiamy zmianą sceny, nigdy filtrem graficznym.

### 7.7 Etykieta czasu `delivery` per pozycja

| „pilot 5–10 dni" / „pilot in 5–10 days" | „etapami" / „in stages" |
|---|---|
| `audyt-jakosci-danych`, `raport-zarzadczy`, `import-z-rekoncyliacja`, `dashboard-produkcji`, `os-czasu-zadan`, `kalkulator-transz`, `kontroling-kosztow` | `importy-erp`, `obieg-przelewow`, `billing-us-g703`, `protokoly-robocizny`, `rejestr-umow`, `kontroling-ksef` |
| jedno źródło danych, jeden ekran wynikowy, brak zapisu do systemów klienta, brak ról i akceptacji | wiele źródeł albo zapis do plików i systemów, role i akceptacje, obieg dokumentów, integracja z zewnętrznym API; obietnica „pilot w 5–10 dni" byłaby tu naciągnięciem (`copy-honest-time-claims`) |

### 7.8 Czego świadomie nie dokładamy do dowodu

- **Lookup kontrahenta po NIP na żywo (GUS BIR / KRS):** nie. Wywołanie zewnętrznego API z przeglądarki łamie `integ-no-external-scripts-on-site` i `integ-data-egress-review`, a przede wszystkim wywraca zdanie „zero chmury dostawcy" na stronie, która to zdanie sprzedaje. Zamiast tego jedno zdanie w mapie integracji (D34).
- **Mikro-demo bota Telegram albo agenta researchowego:** nie na stronie. Słowo „Telegram" to język programisty, nie CFO, a agent do pozyskiwania leadów jest ostatnią rzeczą, którą odbiorca chce zobaczyć w CV dostawcy. Zostaje argumentem w rozmowie.
- **Showreel motion / 3D:** nie w v1 (D17, D20; materiał źródłowy bez potwierdzonej licencji, temat poza ICP). Dowodem kompetencji motion jest sama strona.
- **Karty case z poprzedniej firmy:** nie przed umową IP (D7, faza 2 p. 4).
- **Zdanie „wzorowane na narzędziu działającym w firmie produkcyjno-budowlanej" na podstronach:** nie. To de facto etykieta `case` bez etykiety: obiecuje wdrożenie, którego nie wolno deklarować (`brand-honest-labels`). Dzisiejsze pole `replaces` („co zastępuje") mówi to samo, niczego nie obiecując.
- **Faza 2, propozycje do decyzji:** mini-demo „Podgląd faktury FA(3)" na karcie KSeF (parser XML client-side na pliku przykładowym, zero sieci, 1–1,5 dnia; jedyny sposób, żeby featured miał element interaktywny bez dotykania API państwa) oraz mapa integracji jako deklaracja umiejętności (D34).

---

## 8. Refaktor bazowy i kod

### 8.1 Struktura docelowa `site/src/`

```
main.tsx                   StrictMode > BrowserRouter > LangProvider > MotionProvider > App
App.tsx (~150 l.)          routing + lazy pages + layout (Navbar/Footer poza PageFade) + BookingDialog (lazy)
i18n.tsx                   reuse (+ `use` zamiast `useContext`)
data/    messaging.ts · contact.ts · home.ts · oferta.ts · founders.ts · rodo.ts · tools.ts (+pola portfolio) · toolsSeo.ts · faq.ts (+2) · pagesSeo.ts (+rodo) · demo-sample.ts
motion/  tokens.ts · provider.tsx · presets.ts · Reveal.tsx · PageFade.tsx · ChartReveal.tsx
components/  layout/(Navbar Footer PageMain SkipLink) · DemoFrame · ToolWall · Bento · CaseFrame · CaseCard ·
             Outcomes · Steps · Contrast · FounderCard · ClosingCta · Chip · KsefFlow · DashboardMount · TrancheCalc · FaqList ·
             BookingDialog · Seo · CollaborationFlow · dashboards/(11 dashboardów + PdfButton, NIETYKANE w v1) + DemoReport.tsx (nietykany) = 12 dashboardów razem
pages/   Home · Tools · Tool · Offer · Faq · Rodo · NotFound   (każda = sekcje z data/*, lazy poza Home)
prerender/entry.tsx        shelle renderują z TYCH SAMYCH modułów data/* (bez Motion); scripts/prerender.mjs bez zmian mechaniki
lib/     report.ts · qualityGate.ts · pdf.ts (okno c1) + tranches.ts · g703.ts (nowe, czyste, z golden-testami)
styles/  tokens.css · company-ui.css (przycięty + blok aliasów) · globals.css (.bg-layer/.content-layer BEZ ZMIAN; bez zoom)
scripts/ prerender.mjs · shoot-tools.mjs · og.mjs · record-demos.mjs (faza 2)
         (bramki NIE tutaj: verify-site.mjs i audit-static.mjs żyją w .claude/skills/klarow-guardian/scripts/)
public/  _headers · _redirects · robots.txt · fonts/ · media/ (hero-production-v1.*, tools/, ksef/) · thumbs/ · google<token>.html (GSC)
media/   SHOTS.json (manifest zrzutów) · SOURCES.md (pochodzenie i podpisy przeglądu)   ← w site/, nie w site/src/
```

### 8.2 Code-splitting

`React.lazy` dla `ToolPage`, `OfferPage`, `FaqPage`, `RodoPage`, `NotFound`, `BookingDialog`, `TrancheCalc` i każdego z 12 dashboardów (11 plików w `components/dashboards/` + `DemoReport.tsx`). Mapa **`LOADERS: Record<DashboardKey, () => Promise<{ default: React.ComponentType }>>`**, gdzie `DashboardKey` jest eksportowany z `tools.ts` jako union kluczy pola `dashboard` (dziś: `report`, `production`, `quality`, `timeline`, `payments`, `reconciliation`, `g703`, `paymentflow`, `costcontrol`, `erpimports`, `protocols`, `contracts`). Typ `Record<DashboardKey, …>` jest tu obowiązkowy: kompilator zgłasza i brakujący, i nadmiarowy klucz, więc rozjazd „11 plików vs 12 dashboardów vs 13 kart" nie przejdzie przez `tsc` (`ToolPage.tsx:25` używa już tego wzorca dla mapy statycznej). Efekt: `index.js` traci ~60–90 KB gz dashboardów (dziś 156,8 KB gz z 12 dashboardami w środku, `ToolPage.tsx:7-18` importuje je statycznie) i 118 KB gz three.js (pakiet wypada z `dependencies`, D28). Preload chunku podstrony na `onMouseEnter`/`onFocus` karty (LOW).

### 8.3 Jedno źródło zdań i danych

- `data/messaging.ts`: `oneLiner`, `subtext`, `pillars`, `determinism`, `zeroVendorCloud`, `cta` (jedna etykieta per intencja: „Umów 30 minut" rozmowa, **„Zobacz narzędzia" dowód**, „Przyślij najgorszy Excel" plik), `builtLabel`, `toolsLabel`, `closing`, `proofLabels`, **`allowedNumbers: [{ value: { pl, en }, label: { pl, en }, status: "ok" | "frozen" | "toConfirm", source }]`**, `bannedWords`. `value` jest parą PL/EN, bo część pozycji rejestru to słowa („kilkanaście" / „a dozen-plus", „co do grosza" / „to the cent"), a nie cyfry. Po usunięciu paska „W liczbach" (D30) `allowedNumbers` nie ma już konsumenta na `/` poza podpisem ściany („13", „12") i kolumną ✓ w S7 („co do grosza"); rejestr zostaje, bo steruje bramką na całym `dist`. `status` jest lustrem rejestru `references/allowed-numbers.md` i steruje bramką (niżej).
- `data/contact.ts`: `ORIGIN`, `EMAIL`, `PHONE_DISPLAY 786 296 426`, `PHONE_E164 +48 786 296 426`, `PHONE_HREF tel:+48786296426` (dziś 4 kopie: `BookingModal.tsx:10-12`, `App.tsx:643`, `Seo.tsx:8`, `entry.tsx:18-21`).
- Shelle prerendera (`HomeShell`, `ToolsShell`, `ToolShell` × 3 warianty `kind`, `OfferShell`, `FaqShell`, `RodoShell`, `NotFoundShell`) renderowane z `data/*` i `messaging.ts`; koniec ręcznej prozy `entry.tsx:103-417`. Zrzut w `DemoFrame` i lista 13 pozycji na ścianie S3 renderowane w shellu z tych samych danych (`tools.ts`, manifest `site/media/SHOTS.json`), bez Motion.
- Model `tools.ts`: `kind: "demo" | "case" | "product"`, `dashboard?: DashboardKey` (eksportowany union kluczy), `delivery {pl,en}`, `hook {pl,en}`, `client? {pl,en}`, `outcome {pl,en}`, `stack: string[]`, `year`, `order: number` (jawna kolejność kart i kafli, §2.4), `media { thumb, wide, tile, alt: {pl,en}, clip?, schematic? }`, `scene?: string` (nazwa sceny w `shoot-tools.mjs`), `featured?: boolean`. Lint danych w bramce: każdy wpis ma `delivery`, `hook` i `outcome` PL + EN (brak `en` przy istniejącym `pl` = BLOCKER).

### 8.4 Sprzątanie i zależności

Usunąć: `components/ui/{button,badge,card,canvas-reveal-effect,radial-orbital-timeline}.tsx` (897 linii martwych), `lib/utils.ts`, `content/`, `data/` (YAML), `public/screens/placeholder.svg`, `Logo.zip`, `zoomRef`, sondy decka w `index.html:88-104,160-171`, kotwice `#wyrozniki #wspolpraca #kontakt`, nieaktualne komentarze (`vite.config.ts:16-23` o Lightning CSS, `Seo.tsx:6` o sitemap), copy „Rezerwacja online pojawi się…" (`BookingModal.tsx:30,48`). Zależności do usunięcia: `@react-three/fiber`, `three` (D28: WebGL schodzi z `/` w v1), `@radix-ui/react-slot`, `class-variance-authority`, `clsx`, `tailwind-merge`, `@formkit/auto-animate`. Dodać: `motion@13.2.0`, `eslint` + `eslint-plugin-react-hooks` + `eslint-plugin-jsx-a11y` (dev), **`sharp` (dev, konwersja zrzutów; zero wpływu na bundle, wpis do rejestru zależności)**. `site/README.md` przepisany.

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
- **`verify-site.mjs`** (po buildzie, na `site/dist`): 19 plików HTML; 1 H1, `<main>` i `id="seo-jsonld"` raz na plik; `narzedzia.html` i DOM po JS ≥ 13 linków `/narzedzia/<slug>`; **`index.html` też ≥ 13 linków `/narzedzia/<slug>` plus link do huba** (ściana z §3 S3); `sitemap.xml` = trasy − `404` − `/rodo` (do przeglądu radcy, potem − `404`); `llms.txt` istnieje; `grep -ri nuconic dist` = 0; `#FFA914` = 0; NAP w 3 dozwolonych wariantach; rozmiary chunków vs budżety §6.7; każdy `<video>` z `muted playsinline poster`; `picsum|unsplash|fonts.googleapis|cdnjs|unpkg` = 0; shell-vs-DOM (Playwright WebKit porównuje zbiór H1/H2/p z `dist/index.html` i `dist/narzedzia.html` z DOM po starcie Reacta; dozwolone różnice: liczniki, chipy filtrów) w F3.
- **Bramka „—" = 0 z jawną listą wyłączeń.** Grep po `site/src` wyłącza pliki, których §12.1 zabrania dotykać w v1: `site/src/components/dashboards/**`, `site/src/components/DemoReport.tsx`, `site/src/lib/pdf*` (dziś `pdf.ts`, po refaktorze c1 także `pdf*.mjs`). Stan na 2026-09-12: 621 wystąpień „—" w `site/src`, z czego **495 do sweepu w v1** i **126 w plikach wyłączonych** (dashboardy 102, `DemoReport.tsx` 22, `pdf.ts` 2, w tym stopka „dokument DEMO — dane fikcyjne" w `pdf.ts:103`). Ta sama lista wyłączeń obowiązuje w `audit-static.mjs` (reguła `i18n-pl-typography`) i w hooku `PostToolUse`. W `dist` bramka „—" = 0 **nie** obowiązuje dopóki dashboardy nie są posprzątane: dashboardy renderują się w `dist` tylko po starcie Reacta, ale stopka PDF i teksty dem trafiają do chunków, więc audyt `dist` liczy „—" wyłącznie w statycznym HTML shelli, nie w `assets/*.js`. Sweep 126 wystąpień = faza 2, po merge okna c1 (§11, §12.3).
- **Bramka liczb (trzy statusy, lustro `references/allowed-numbers.md`).** Nie „każda liczba w `dist` jest w `allowedNumbers`", bo D7(b) i §4.5 świadomie ZOSTAWIAJĄ liczby w istniejących opisach, a odpowiedzi FAQ są zawsze w DOM (§9.1), więc trafiają do `dist`:
  - **OK**: wolno wszędzie (12, 13, 30 minut, 20–250 osób, ≤ 10 dni, 5–10 dni, NAP, 2026, „co do grosza", liczby rynkowe ze źródłem w tym samym zdaniu).
  - **ZAMROŻONE**: wolno **tylko w plikach, w których już są**, whitelist: `site/src/data/faq.ts` („mniej niż dwa miesięczne koszty etatu kontrolera", „6+ miesięcy i kwoty od 100 tys. zł", „3–4 dni", „~40%", „kilkanaście narzędzi", „~10 tys. wierszy"), `site/src/data/toolsSeo.ts` i `site/src/data/tools.ts` (m.in. „~30 projektów", „kilkanaście sekund"), opisy podstron w `src/prerender/entry.tsx`. Pojawienie się takiej liczby na `/` albo w nowym pliku = BLOCKER; zniknięcie z pliku źródłowego jest dozwolone (sprzątamy, nie dodajemy).
  - **DO POTWIERDZENIA**: nie wolno publikować do wpisu w `docs/DECISIONS.md` (dziś m.in. „3 dni", „89 testów", „12 dni", „15 integracji").
  - **Kwoty przy usługach:** zakaz dotyczy cennika Klarow (pilot, retainer, panel, sprint USA) w PLN i USD. **Wyjątek jawny:** opis narzędzia `billing-us-g703` mówi o walucie i mechanice arkuszy AIA G702/G703 („w USD", „wykonanie × wartość − dotychczas") bez podawania stawek Klarow (`tools.ts:446,460`, `toolsSeo.ts:374,398`); to opis produktu klienta, nie nasza cena.
  - **Dowód, że to nie jest teoretyczne:** `verify-site.mjs` na dzisiejszym `site/dist` zgłasza już `site/dist/faq.html:1 - MEDIUM [brand-allowed-numbers-only] liczba „40%" w treści bez wpisu w allowed-numbers.md`. Przy severity HIGH i `--fail-on=BLOCKER,HIGH` ten sam wpis blokowałby push.
  - **Alternatywa (gdyby founderzy woleli twardą bramkę):** przepisać 6 odpowiedzi FAQ w F3 tak, żeby nie zawierały liczb, i dopiero wtedy włączyć regułę „każda liczba w `allowedNumbers`". Do tego czasu bramka bez whitelisty zapaliłaby `npm run check` na czerwono w dniu włączenia.
- **Bramki prawne: dwa progi, jedno wywołanie więcej.** `verify-site.mjs` dostaje opcję `--outreach`; domyślnie sprawdza wyłącznie bramkę publikacji, więc `npm run check` w F0 świeci na zielono, mimo że outbound jest zamknięty. Sekcja „bramki prawne" w skrypcie: **BLOCKER** na marker `[DECYZJA FOUNDER` w `dist/rodo.html` i na `SITE_PUBLISHABLE = false` w `site/src/data/rodo.ts`; `OUTREACH_READY = false` → **LOW** domyślnie i **BLOCKER** przy `--outreach`; pod `--outreach` dodatkowo: nierozstrzygnięte „SCC albo DPF" w treści `/rodo` (HIGH), brak adresu ani zdania zastępczego w sekcji „Administrator" (HIGH), brak `site/src/data/consent.ts` (HIGH), brak datowanego wpisu `OUTREACH_READY` w `docs/DECISIONS.md` (HIGH). Wywołania:

```powershell
node ".claude/skills/klarow-guardian/scripts/verify-site.mjs" --expected 19 --fail-on BLOCKER,HIGH   # codzienna bramka
node ".claude/skills/klarow-guardian/scripts/verify-site.mjs" --outreach --fail-on BLOCKER,HIGH      # raz, przed pierwszym kontaktem handlowym
```

- **Bramka zrzutów (`check:shots`, lokalnie):** `node site/scripts/shoot-tools.mjs --verify` porównuje `sha256` z manifestem `site/media/SHOTS.json`; różnica = wyjście 1 z listą plików. Dwa przebiegi skryptu muszą dać identyczne sumy (determinizm zrzutów), a rozjazd zrzutu z UI po zmianie dashboardu = czerwony build, nie „do poprawy kiedyś" (R18, R-T2). Krok nie wchodzi na CI, bo CI nie ma przeglądarki.
- **Bramka „zero requestów" dla dema na `/` (`check-client-only.mjs`, nowa):** test Playwright wgrywa plik do `DemoFrame` i asertuje zero requestów sieciowych po wgraniu oraz zero pól z nazwą albo treścią pliku w zdarzeniach analityki. Bez zielonej bramki zdanie „nie wychodzi z przeglądarki" nie wchodzi na stronę (reguła `demo-client-side-only-claim`, R17).
- **Bramka budżetu lazy na `/`:** `homeLazyGz ≤ 46 080 B` mierzone osobno od budżetu krytycznego 140 KB gz; chunk `DemoFrame` nigdy w `modulepreload`.
- **`npm run check`** = `tsc --noEmit` → `vite build` (klient + SSR + prerender) → `node ".claude/skills/klarow-guardian/scripts/verify-site.mjs" --expected 19` → `node ".claude/skills/klarow-guardian/scripts/audit-static.mjs" --fail-on=BLOCKER,HIGH --baseline=".claude/skills/klarow-guardian/baseline/audit-static-2026-09-12.jsonl"` → ESLint → `node --test` → `check-client-only.mjs` (gdy na `/` stoi żywe demo). Bramka przed pushem (D22); skrypty wołane przez `node` z pełną ścieżką w cudzysłowie, bo `npx` w tym repo nie działa. Cloudflare Pages CI: `npm run build` bez zmian + `verify-site.mjs` jako krok soft (warn) do czasu zielonego baseline.

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

1. **Google Search Console**: property domenowa `klarow.com` (TXT w Cloudflare DNS) + plik weryfikacji w `public/`; zgłoszenie `https://klarow.com/sitemap.xml`. **Właściciel konta = administrator danych z `CONTROLLER`** (D25), jako osoba fizyczna: ten sam człowiek prowadzi Cloudflare, GSC i Cal.com, inaczej po rejestracji trzeba przenosić umowy powierzenia między osobami, a `/rodo` przestaje być prawdziwe. Właściciela każdego konta zapisujemy w nowej kolumnie „właściciel konta" w `references/integrations-registry.md`.
2. **Cloudflare Web Analytics** (cookieless, bez banera): snippet w `index.html` (obowiązuje w 19 HTML) ładowany po `load`.
3. **Zdarzenia CTA**: `cta_book_open`, `cta_mail`, `cta_tel`, `cta_worst_excel`, `demo_load_example`, **`demo_own_file`**, `demo_replay`, **`wall_open_tool`**, `pdf_download`, `lang_toggle`, `founders_view`, `calc_tranche_run`, `rodo_objection_click`. **Zakaz twardy:** żadne zdarzenie nie niesie nazwy ani treści pliku wgranego przez użytkownika (`demo-client-side-only-claim`). Mechanizm: Cloudflare Zaraz (`zaraz.track`) albo Pages Function `functions/api/e.ts` → Workers Analytics Engine (bez cookies, bez PII); wybór po sprawdzeniu w panelu CF, czy Web Analytics ma zdarzenia niestandardowe (luka L3). Zdarzenia emitowane poza silnikami dem (determinizm).
4. **UTM**: profile LinkedIn (`utm_source=linkedin&utm_medium=profile`), wiadomości (`utm_medium=message`), maile (`utm_medium=email&utm_campaign=outbound`), QR/wizytówki (`/start` → `utm_source=qr`), posty bota (`utm_source=linkedin&utm_medium=post`; prompt `post-bot/worker.js` ma linkować do konkretnej podstrony z UTM).
5. **Cal.com** jako konwersja twarda (D14): w v1 link zewnętrzny z `BookingDialog` (0 skryptów, 0 CSP), embed w fazie 2 z CSP i wpisem w `/rodo`. Konto zakłada **administrator jako osoba fizyczna**; umowę powierzenia (DPA) można zawrzeć bez NIP-u.

### 9.3 i18n

PL kanoniczne, EN przez `pick()`; wszystkie nowe stringi `{ pl, en }`; `data-lang` przed pierwszym renderem; trasy `/pl/` `/en/` **nadal odroczone** (decyzja Karola), dane gotowe na split build-time; hreflang dopiero wtedy. Znane ograniczenie: EN meta z `toolsSeo.ts` niewidoczne dla Google do czasu `/en/`; boty bez JS dostają EN przez sekcje `lang="en"` i `llms.txt`.

### 9.4 Excel-lock, mapa podmian

H1 + shell (`App.tsx:98-99`, `entry.tsx:108`), meta home (`pagesSeo.ts:22-23`), `Organization` (`Seo.tsx:77-78`), `llms.txt` (`entry.tsx:449-452, 491-494`), oferta „Dla kogo" (`App.tsx:431-438`), wyróżnik (`Differentiators.tsx:15,19,46`), ból (`App.tsx:282`), `index.html:7-18`, prompt bota (`post-bot/worker.js:25`), nagłówki LinkedIn: wszystko na `messaging.ts`.

---

## 10. Prawo i copy (z `peer-legal.md`)

1. **`/rodo`: dwa progi, nie jeden.** (a) **Publikacja portfolio** (strona bez formularzy, bez cookies i bez wysyłki) wymaga wyłącznie **tożsamości administratora** i kompletnych sekcji o serwisie: bramka `SITE_PUBLISHABLE`. Rejestracja działalności, NIP i adres siedziby **nie są do tego potrzebne**. (b) **Pierwszy kontakt handlowy** wymaga dodatkowo kompletnej klauzuli art. 14 i zgody z art. 398 PKE: bramka `OUTREACH_READY`. Bez niej nie wysyłamy ani jednego kontaktu (precedens Bisnode 943 470 zł, potwierdzony przez NSA; plan kontroli UODO 2026 obejmuje bazy marketingowe). Szablony outboundu odsyłają do `klarow.com/rodo`. Treść i mechanika bramek: §4.6; przegląd radcy: D16. **Uwaga na błędny wniosek:** „strona żyje, więc można wysyłać" jest fałszem; publikacja nie odblokowuje outboundu.
2. **PKE (art. 398, od 10.11.2024)**: informacja handlowa tylko po uprzedniej zgodzie, także do osób prawnych i na `biuro@`; soft opt-in w Polsce nie istnieje; uzasadniony interes RODO nie zastępuje zgody PKE (WSA II SA/Wa 62/25). Na stronie: żaden formularz nie sugeruje, że zapis = zgoda marketingowa; newsletter (jeśli powstanie) = double opt-in z odrębną, niezaznaczoną domyślnie zgodą; „Przyślij najgorszy Excel" jest inboundem (art. 398 ust. 2) i nie wymaga zgody.
3. **Liczby**: na home wyłącznie liczby własne z `allowedNumbers` (§3 S5). W materiałach sprzedażowych i na `/oferta` lub w FAQ dozwolone tylko liczby ze źródłem podanym obok: mediana kontrolera 8 350 zł brutto/mies. (Sedlak & Sedlak, OBW 2026); składki pracodawcy 20,48 % → ~121 tys. zł/rok (ZUS 2026; działanie `8 350 × 12 × 1,2048 ≈ 121 000` pokazane czytelnikowi); Time to Hire 33 dni / Time to Fill 56 dni (rynek PL, II poł. 2025); 88 % arkuszy zawiera błędy w formułach (Panko, University of Hawai'i, „What We Know About Spreadsheet Errors"); 19–20 % czasu na wyszukiwanie informacji (McKinsey Global Institute, 2012). **Zakaz:** „raport Deloitte/IDC o czasie traconym w Excelu" (brak oryginału). **Zakaz framingu odejmowania etatu** („oszczędzimy wam etat", „nie zatrudniajcie"); poprawna forma: „nie proponujemy, żeby ten etat zniknął; proponujemy, żeby te 121 tys. kupowało analizę, a nie sklejanie arkuszy".
4. **Zero słowa „AI" w komunikacji sprzedażowej**; na stronie AI pojawia się wyłącznie w zdaniu-kotwicy determinizmu i w FAQ „Czy AI liczy moje dane?" (jako zaprzeczenie).
5. **Marka poprzedniej firmy**: zero nazwy, liczb przypisywalnych, zrzutów, logo; „firma produkcyjno-budowlana"; `grep -ri nuconic dist` = 0 jako BLOCKER; karty case i „15 narzędzi" dopiero po umowie IP (D7). Dodatkowo: potwierdzić, czy repo GitHub jest prywatne (luka L1), bo `docs/nuconic-ekosystem-referencja.md` i CLAUDE.md łamią zasadę #3, jeśli jest publiczne.
6. **Sekrety**: klucz Anthropic z appki KSeF do rotacji (poza repo); pliki z kluczami na OneDrive do Menedżera poświadczeń; hook `PreToolUse` blokujący odczyt `.env*` (D21).
7. **Brak zarejestrowanej działalności (stan na 2026-09-12).** Administratorem danych może być osoba fizyczna (art. 4 pkt 7 RODO); NIP nie jest wymagany przez RODO nigdy, także po rejestracji. Wskazujemy **jednego** administratora, żeby nie wpaść we współadministrowanie z art. 26 (uzgodnienia i obowiązek publikacji ich zasadniczej treści). Rejestracja jest warunkiem **pierwszej faktury** (`CONTRACT_READY`), nie pierwszego maila i nie publikacji. W copy publicznym do czasu rejestracji: zero słów „firma", „spółka", „zespół", „nasi eksperci", „od X lat", zero „wystawiamy fakturę VAT", zero pól `legalName`/`vatID`/`taxID`/`address`/`foundingDate` w JSON-LD (§2.5). Model rozliczenia opisujemy, bo dotyczy treści przyszłej umowy, i towarzyszy mu zdanie **„Cenę i zakres zapisujemy w umowie przed startem."** / „We put the price and scope in a contract before we start."
8. **Do potwierdzenia u radcy (trzy punkty, nie jeden):** czy adres do korespondencji jest obowiązkowym elementem klauzuli art. 14; czy bezpłatna diagnoza powtarzana kilkanaście razy w miesiącu nie staje się działalnością zarobkową wymagającą rejestracji; czy faktyczny podział decyzji między founderami nie tworzy współadministrowania mimo wskazania jednego administratora.

---

## 11. Plan wdrożenia w fazach F0–F5

Role: **CC** = Claude Code (implementacja, skrypty, shelle, testy, audyt); **K** = Karol (oko marki: board, assety, zrzuty, tryb mock KSeF, test iPhone, Photoshop); **P** = Paweł (decyzje biznesowe, copy sekcji „Co osiągniesz" i bio, **tożsamość administratora i adres do korespondencji**, Cal.com, GSC/DNS, umowa IP, radca dla `/rodo`). Każda faza kończy się commitem i pushem na `main` (zasada #4); każda sesja aktualizacją stanu operacyjnego (zasada #7).

| Faza | Dni | Kto | Zakres | Definition of Done | Punkt weryfikacji |
|---|---|---|---|---|---|
| **F0 · Decyzje + fundament** | **4** (3 fundament + **1 osobny dzień em-dash sweep**; sweep jest w F0 przy każdej opcji D11, bo wszystkie trzy zakazują „—") | CC; P: decyzje D1–D24 → `docs/DECISIONS.md`; K: rotacja klucza | Spotkanie decyzyjne; **przenumerowanie ID decyzji w skillu strażnika** (`grep -rn "D-[0-9]" .claude/skills/klarow-guardian` → podmiana wg tabeli przejścia z `decyzje-founderow-v2.md`, ten sam commit co `docs/DECISIONS.md`); `messaging.ts`, `contact.ts`, `founders.ts`, `rodo.ts` (szkielet §4.6 wraz z sekcją 8a o profilowaniu i sekcją 6 o transferze do USA; stała `CONTROLLER` + `SITE_PUBLISHABLE` + `OUTREACH_READY` zamiast `RODO_READY`; patch sekcji „bramki prawne" w `verify-site.mjs` z opcją `--outreach`); **inwentarz klas CSS przed cięciem (§5.5)** i przycięcie `company-ui.css` + zrzuty 12 dashboardów przed/po; `tokens.css` 3 warstwy + `@theme inline` + blok aliasów; usunięcie martwego kodu i 6 zależności; zdjęcie `zoom` roota + retest 12 dashboardów 1920/2560; `npm install motion@13.2.0`; `motion/*` (tokens, provider, presets); `DashboardMount` (natywny IO) + `React.lazy` `ToolPage` i stron (`LOADERS: Record<DashboardKey, …>`); `lib/tranches.ts`, `lib/g703.ts` + golden; ESLint; **uzgodnienie bramek strażnika z planem** (`seo-jsonld` vs `seo-jsonld-per-kind`, budżet Motion 36 KB, lista wyłączeń „—", trzy statusy liczb) bez tworzenia nowych skryptów; `npm run check`; `_redirects` aliasy (w tym `/polityka-prywatnosci → /rodo`), `_headers` `/media/*`; fix daty `BookingModal.tsx:78`; Navbar/Footer/PageMain/SkipLink na tokenach; `BookingDialog` (`<dialog>`, Cal.com link); trasy `/rodo` (`noindex` do przeglądu radcy) i `404` + shelle; em-dash sweep partiami z bramką długości `toolsSeo.ts` | `npm run check` zielony; **19 HTML**; `dist/index.html` bez three i dashboardów w `index.js` (≤ 140 KB gz); **0 „—" w `site/src` poza jawną listą wyłączeń** `components/dashboards/**`, `components/DemoReport.tsx`, `lib/pdf*` (495 z 621 wystąpień posprzątane; pozostałe 126 po merge okna c1, faza 2); `grep -ri nuconic dist` = 0; `DECISIONS.md` scommitowany i ID w skillu zgodne; `/rodo` z pełną treścią PL + EN; `CONTROLLER` w `data/rodo.ts` wypełniony wariantem (a) osoba fizyczna albo (b) podmiot, **zero markerów `[DECYZJA FOUNDERÓW: …]` w `dist/rodo.html`**; `SITE_PUBLISHABLE = true`; `OUTREACH_READY = false` (outbound zamknięty świadomie, nie przez przeoczenie); `verify-site.mjs` bez findings `legal-rodo-page-required`; 12 dashboardów wizualnie bez zmian po cięciu CSS | tsc + build + verify; audyt bazowy = `baseline/audit-static-2026-09-12.jsonl` (istniejący, nie tworzymy nowego); zrzuty WebKit 390×844 i 1440×900 (normal + reduced-motion) bez regresji; preview deploy: `curl -I` nieznanej ścieżki (404) i `/realizacje/raport-zarzadczy` (301, alias zostaje mimo zdjęcia słowa z UI) |
| **F1 · Zrzuty, nagrania narzędzi i portrety** (po DoD F0, **na ścieżce krytycznej**) | **2** (+ czas founderów) | CC: `shoot-tools.mjs`, `record-demos.mjs`, konwersja `sharp`, potok ffmpeg; K: przegląd kontaktu zbiorczego i bramki §7.3a, zrzuty mock KSeF, trial Higgsfielda (jedna świadoma akcja); P: portret i bio | **Dzień 1:** `shoot-tools.mjs` (szkielet + serwer `dist` + kontekst deterministyczny + manifest) → sceny 4 pozycji flagowych i kadru hero → `--svg-fallback` dla `KsefFlow` → kontakt zbiorczy i przegląd Karola. **Dzień 2:** `record-demos.mjs` (potok nagraj → klatki → hash → re-enkod), **N1 (hero)** plus N2–N5, `CLIPS.json`, bramka czytelności §7.3a, opcjonalnie trial Higgsfielda i stille H1–H3. Portrety + duotone; `site/media/SOURCES.md`, `SHOTS.json`. Pozostałe 9 scen zrzutów i miniatury hubu mogą dojeżdżać w F3 | Kadr hero ≤ 110 KB (mobile ≤ 55 KB) i **jest klatką 0 nagrania N1**; nagranie hero w budżecie (WebM ≤ 1,2 MB / MP4 ≤ 1,4 MB), klipy ≤ 320 KB; `--verify` zielone dla zrzutów (identyczne `sha256`) i dla klipów (digest klatek, długość, PSNR klatki 0 ≥ 45 dB); bramka §7.3a zamknięta; `SOURCES.md` kompletny (dla H1–H3 wpis `PASS 12/12`, dla mocków KSeF podpis „w kadrze nie ma nazwy produktu ani domeny") | Przegląd adwersarialny kontaktu zbiorczego i arkusza stop-klatek (K): tekst obcej marki, ludzie, logo, nazwa produktu w kadrze = odrzucone; dwa bliźniacze kadry albo dwa bliźniacze klipy = zmiana sceny, nigdy filtr graficzny. **Blokujące dla F2 jest wyłącznie N1**; N2–N5 mogą dojechać do F3, bo ściana działa na samych zrzutach |
| **F2 · System + home** | **4** | CC; K: przegląd home (1 h); P: copy S4 (D23) + bio | `data/home.ts` (9 sekcji PL/EN), `pages/Home.tsx`, komponenty §5.6 (`DemoFrame`, `ToolWall`, Bento z kadrami zrzutów, CaseFrame, Outcomes, Steps × 5, Contrast, FounderCard, ClosingCta, KsefFlow), `Reveal/RevealGroup/PageFade/ChartReveal`, `HomeShell` z danych, `index.html`: preload kadru hero + inline `data-lang` + snippet CF Web Analytics | Home na 1440/1024/768/390 + reduced-motion + `pointer: coarse` + bez JS (shell); Lighthouse mobile perf ≥ 90, a11y ≥ 95; JS `/` ≤ 140 KB gz; Motion ≤ 36 KB gz; 0 eyebrow; hero = 4 elementy; `homeLazyGz` ≤ 45 KB gz; `check-client-only.mjs` zielone (zero requestów po wgraniu pliku); H1 ≤ 2 linie w PL **i** EN na 1024/1280/1440 (`getClientRects().length`); każda animacja z motywacją w 1 zdaniu | Zrzuty Playwright WebKit 390×844 + 1440×900 × {normal, reduced-motion, coarse} × {PL, EN}; **realny iPhone Karola** (`?debug=1` czysty; sprawdzamy kontrakt warstw, brak `<video>` na telefonie, kadr i INP żywego dema; luka L16 znów aktualna, bo `<video>` wróciło na desktop) |
| **F3 · Podstrony + SEO** | **3** | CC; P: FAQ +2, prompt bota; K: zrzuty mock | Hub (filtry w URL, 13 kart w DOM, `ItemList`, `.tools-strip` usunięty), `pages/Tool.tsx` dashboard-first (pasek akcji, `#sciezka`, 3 warianty `kind`, crosslinki, FAQ, CTA × 2), KSeF (relabel, `KsefFlow`, zrzuty mock, „Czego nie robi", bullet AI usunięty, `Service`), `/oferta` (Steps, Wycena, Dla kogo + przypis, `TrancheCalc` lazy, hak), `/faq` (+2), `/rodo` finalne copy po przeglądzie radcy, `404`; `pagesSeo.ts` (+`rodo`); `index.html` fallback; `twitter:*`; `lastmod` z gita; `llms.txt` z `messaging.ts`; `og.mjs`; Excel-lock mapa §9.4; prompt bota zsynchronizowany | 19 HTML; obowiązkowy przegląd `--contact-sheet` zamknięty; `verify-site.mjs` pełny (w tym `allowedNumbers`, NAP, linki, H1); `narzedzia.html` ≥ 13 linków; JSON-LD walidacja (Rich Results Test); bramka shell-vs-DOM dla `/` i `/narzedzia` = 0 rozjazdów | `curl dist/*.html` bez `opacity:0` na treści; WebKit `javaScriptEnabled: false` pokazuje H1, 4 realizacje, ✕/✓, FAQ, `/rodo` |
| **F4 · QA, pomiar, publikacja** | **2** | CC; P: GSC/DNS, Zaraz, UTM w profilach; K: iPhone, LinkedIn | `audit-static.mjs` w pełnym zakresie (hex poza tokenami, radius poza zbiorem per `data-surface`, eyebrow, `transition: all`, `text-[px]`, „—", atrybuty `<video>`, `import { motion }`, integracje zewnętrzne); Pre-Flight box po boxie; Lighthouse × 6 tras; DevTools Paint flashing przy scrollu; GSC property + `sitemap.xml`; CF Web Analytics; zdarzenia CTA; UTM; restrukturyzacja CLAUDE.md (≤ 200 linii + `docs/plan/stan-operacyjny.md` + `.claude/rules/`); commit + push `main`; KPI baseline | Pre-Flight 100 % zielony; `npm run check` zielony; produkcja na CF Pages serwuje 19 HTML (weryfikacja po treści, nie po hashach); `/rodo` i `/polityka-prywatnosci` (301) działają na produkcji; **`SITE_PUBLISHABLE = true` potwierdzone na produkcji** (`curl` treści sekcji „Administrator", zero markerów); **`OUTREACH_READY` rozstrzygnięte świadomie i zapisane w `docs/DECISIONS.md`**: `true` tylko po zielonej checkliście `verify-site.mjs --outreach`, w przeciwnym razie `false` z jednym zdaniem, czego brakuje. Publikacja strony **nie czeka** na `OUTREACH_READY`; KPI baseline zapisany | `curl` markerów produkcji; realny iPhone na produkcji; `?debug=1`; **jedno uruchomienie `node … verify-site.mjs --outreach`**, wynik wklejony do `docs/plan/stan-operacyjny.md` nawet gdy czerwony (to lista zadań przed outboundem, nie porażka fazy) |
| **F5 · Bufor + start fazy 2** | **1–2** | wszyscy | Poprawki z przeglądu founderów, dogrywki zrzutów, regresje; **domknięcie checklisty outboundu (§4.6) albo świadomy wpis, że outbound startuje po rejestracji**; kolejka fazy 2 spisana w `stan-operacyjny.md` | Zero otwartych BLOCKER/HIGH w `audit/INDEX.md` | |
| **Razem** | **16–17 dni** (F1 na ścieżce krytycznej, powiększone o dzień na nagrania) | | ≈ 4 tygodnie kalendarzowe | | |

Arytmetyka sumy: łańcuch krytyczny = F0 4 + F1 **2** + F2 4 + F3 3 + F4 2 + F5 1–2 = **16–17**. Wobec porannej korekty F1 odzyskało dzień (nagrania, potok klatkowy, bramka czytelności, opcjonalny trial) i **zostaje na ścieżce krytycznej**: warunek zrzutu `[data-dashboard][data-ready='true']` pojawia się razem z `DashboardMount` (F0), a zdjęcie `zoom` roota i przycięcie `company-ui.css` (też F0) zmieniają kadr. „F1 równolegle z F2" było prawdą dla Higgsfielda, nie dla zrzutów narzędzi; nierozdzielenie tego groziło tym, że hero i ściana w F2 stoją na placeholderach (R-T10).

**Pierwszy publikowalny przyrost:** koniec F0 (dzień 4): ta sama treść wizualnie, ale nowy fundament, `/rodo` z pełną treścią, `404`, aliasy, lżejszy bundle; **publikacja jest możliwa** (bramka `SITE_PUBLISHABLE`), ale **outbound nie**: ten czeka na `OUTREACH_READY` (§4.6). Drugi: koniec F2 (dzień ~9): nowy home. Trzeci: koniec F3 (dzień ~12): komplet. Publikacja: F4 (dzień ~14); F5 zamyka się na dniu 15–16.

**Ścieżka krytyczna:** decyzje founderów (F0, ~1 dzień ich czasu; domyślne wybory z `decyzje-founderow-v2.md` obowiązują przy braku odpowiedzi) → **tożsamość administratora do `/rodo`** (imię i nazwisko + kanał kontaktu; bez nich strona nie idzie na produkcję, ale **nie jest potrzebna rejestracja działalności ani NIP**) → **zrzuty narzędzi, nagranie N1 i kadr hero (F1, po DoD F0)** → portrety + bio (D6, F4) → umowa IP (D7; nie blokuje publikacji, blokuje „15" i karty case). Bez portretów: wariant D6(b). Bez zrzutów mock KSeF: `--svg-fallback` z renderem `KsefFlow`.

**Kolejność sekcji home w F2** (wg §3): hero z kadrem produktu → żywe demo → ściana 13 → co budujemy → co osiągniesz → ludzie → kalkulator, nie wróżka → jak pracujemy → zamknięcie; każdy blok = 1 commit + Pre-Flight. **Ściana S3 wymaga wcześniejszego wykonania punktów z F1**: szkielet `shoot-tools.mjs` (0,5 dnia) → sceny 4 pozycji flagowych i kadru hero (0,5 dnia) → `--svg-fallback` dla `KsefFlow` (0,25 dnia) → kontakt zbiorczy i przegląd Karola (0,5 h). Zrzuty mock KSeF od Karola **nie blokują F2**, bo featured domyka render `KsefFlow`.

**Faza 2 (po publikacji, kolejność wg wartości):** (1) React 19.3.0 + `<ViewTransition>` po ≥ 2 tygodniach stabilizacji, osobny commit, spike 0,5 dnia (luka L4), reguła „`startViewTransition` pod `BrowserRouter` wymaga `useTransitions={false}` albo callbacku czekającego na commit; nigdy `flushSync(navigate)`"; (2) `WipeCompare` na 3 podstronach po pomiarze repaintu (1,5 dnia); (3) *(zrealizowane w v1: hover-klipy ściany S3 weszły do F1/F2 razem z nagraniem hero, D35 zmienione)*; (4) 2 anonimowe karty case z pełnym long-tailem `toolsSeo.ts` po umowie IP (1,5 dnia; 21 HTML); (5) dashboardy importują z `lib/tranches.ts`/`lib/g703.ts` (po zakończeniu pracy okna c1 na `pdf.ts`); (6) test Geist (D8) + ewentualne osadzenie kroju UI w PDF (**statyczne TTF: Regular 400, Bold 700, Italic 400**, zgodnie z §12.2 i D8; pdfmake rejestruje krój w slotach `normal/bold/italics/bolditalics`, więc plik 600 nie zastąpi `bold`, a brak zarejestrowanego stylu kończy się wyjątkiem przy generowaniu PDF); (7) formularz PKE (Pages Function + Turnstile + Resend, double opt-in, 2 dni); (8) `/blog/:slug`, `/partnerzy`; (9) migracja **235** inline `style=` w plikach nietykanych (`dashboards/**` + `DemoReport.tsx`) na tokeny (**1,5–2 dni**; wcześniejsza wycena 2–3 dni zakładała błędnie 455, czyli całe `site/src`); (10) 14. demo „Zamknięcie tygodnia jednym przyciskiem"; (11) trasy `/pl/ /en/` + hreflang; (12) Cal.com embed z CSP; (13) `domMax` dla siatki hubu, jeśli VT nie zadowala; (14) **em-dash sweep 126 wystąpień w `dashboards/**`, `DemoReport.tsx` i `lib/pdf*`** po merge okna c1, razem ze zdjęciem tych ścieżek z listy wyłączeń bramki „—" (0,5 dnia); (15) mini-demo „Podgląd faktury FA(3)" na karcie KSeF (parser XML client-side, zero sieci, 1–1,5 dnia); (16) *(zrealizowane w v1: wideo wróciło decyzją Karola z 2026-09-12; w fazie 2 zostaje jedynie ewentualna pętla generatywna na social poza stroną, H4)*; (17) mapa integracji jako deklaracja umiejętności (D34); (18) `/rodo` po przeglądzie radcy: zdjęcie `noindex`, wpis do sitemapy (0.3), podniesienie oczekiwań bramek i KPI indeksacji.

---

## 12. Koordynacja z oknem c1 (bot, `pdf.ts`)

1. **`site/src/lib/pdf.ts` → `pdfDoc.mjs` + `pdfDoc.d.mts` robi okno c1 PIERWSZE** (generator listów i one-pagerów musi renderować ten sam dokument w Node). Okno UI (ten plan) w v1 (F0–F4) **nie dotyka** wnętrza `pdf.ts`, `PdfButton.tsx` ani żadnego pliku `components/dashboards/*.tsx` i `DemoReport.tsx`; jedyne zmiany wokół dashboardów to `React.lazy` w mapie `LOADERS` (`DashboardMount`/`ToolPage.tsx`) i opakowanie w `DashboardMount`. Dlatego silniki `lib/tranches.ts` i `lib/g703.ts` powstają jako nowe moduły, a przełączenie dashboardów na nie czeka do fazy 2.
2. **Font w PDF: decyzja B, PDF zostaje na Roboto** (zero wzrostu lazy-chunku pdfmake); API `PdfDoc.font` domyślnie `"Roboto"`. Ewentualne osadzenie kroju UI dopiero po decyzji founderów o foncie v2 (wtedy okno UI dostarcza **trzy statyczne TTF: Regular 400, Bold 700, Italic 400** (ta sama trójka w D8 i w §11 faza 2 p. 6); pdfmake nie czyta WOFF2 ani fontów variable, rejestruje krój w slotach `normal/bold/italics/bolditalics`, więc waga 600 nie zastąpi slotu `bold`, a brak zarejestrowanego stylu = wyjątek przy generowaniu; kursywa jest używana w bloku quote, więc nie da się jej pominąć).
3. **Gwarancja zerowej regresji od c1:** `blocks?: Block[]` opcjonalne, `footer` domyślnie dzisiejszy tekst co do znaku, więc 12 podstron i `PdfButton` działają bez zmian; po merge c1 okno UI klika „Pobierz PDF" na `/narzedzia/obieg-przelewow` i porównuje layout, stopkę i polskie znaki. Uwaga c1: stopka PDF zawiera „—" (`"klarow.com · dokument DEMO — dane fikcyjne"`, dziś `site/src/lib/pdf.ts:103`); zamiana na „klarow.com · dokument DEMO: dane fikcyjne" wchodzi do em-dash sweepu **po** stronie c1 (żeby nie zderzyć się w pliku). **Pełna lista wyłączeń bramki „—" = 0 w v1** (ta sama w DoD F0, w `audit-static.mjs` i w hooku `PostToolUse`): `site/src/lib/pdf.ts` i `site/src/lib/pdf*.mjs` (2 wystąpienia), `site/src/components/dashboards/**` (102), `site/src/components/DemoReport.tsx` (22) = razem **126 z 621**. Wyłączenie obejmuje DZISIEJSZY `pdf.ts`, nie tylko plik, który dopiero powstanie u c1; bez tego DoD F0 byłby niewykonalny bez złamania §12.1.
4. **Ograniczenia copy z c1** (liczby ze źródłem, zakaz Deloitte/IDC, zakaz framingu odejmowania etatu, zero „AI" w sprzedaży, formularze bez domyślnych zgód, newsletter double opt-in) wchodzą do strażnika jako reguły `copy-*` i `legal-*`; prompt bota `/post` dostaje te same zakazy i link do `/rodo` w każdym poście z CTA.
5. **`/rodo`**: trasa kanoniczna, prerender `dist/rodo.html`, link w stopce; `/polityka-prywatnosci` = 301 w `_redirects`. Szablony outboundu c1 linkują do `klarow.com/rodo` i działają normalnie mimo `noindex` (D16-b): strona jest publiczna, tylko niezaindeksowana do przeglądu radcy.
6. Punkt synchronizacji: koniec F0 (okno UI publikuje `messaging.ts`; c1 kopiuje one-liner do promptu bota i szablonów), koniec F3 (URL-e z UTM dla bota).

---

## 13. Ryzyka R1–R22, R-T* i R-M* (media) z mitigacjami

| # | Ryzyko | Prawdop. / skutek | Mitigacja |
|---|---|---|---|
| R1 | **Hero-wideo psuje LCP albo wraca „samo tło" na iPhonie. Ryzyko OTWARTE ponownie od 2026-09-12 (D37)**; rozpisane szczegółowo jako R-M1 i R-M2 | niskie przy kontrakcie warstw / krytyczny | media wyłącznie w `.hero-media` (`absolute` + `overflow: hidden`), nigdy `fixed`, nigdy `z-index`/`transform` na `.content-layer`; zero wideo na `pointer: coarse`; montaż po `load` + `rIC`; bramka elementowa LCP; realny iPhone jako bramka wydania |
| R2 | Motion ukrywa treść bez JS lub mignięcie po podmianie shellu | wysokie bez reguły / średni | `initial={false}` na hero i pierwszym montażu `PageFade`; Motion nigdy w `entry.tsx`; `ChartReveal` tylko poniżej folda na treści spoza shellu; test „strona bez JS" w F3 |
| R3 | Bundle rośnie (ktoś wciągnie `domMax`, pełny `motion`, three) | średnie / średni | `LazyMotion strict`; bramka rozmiaru chunków w `verify-site.mjs`; three poza `dependencies` po D12(a) |
| R4 | Hub bez linków w DOM (jak dziś) | pewne bez zmiany / wysoki | 13 kart zawsze w DOM, filtr = `hidden`; assert ≥ 13 linków w HTML i po JS |
| R5 | Etykieta „Wdrożone" bez pokrycia; liczby firmy źródłowej; „u klientów" w liczbie mnogiej | pewne dziś / wysoki (prawdziwość, IP) | KSeF = „Własny produkt"; `allowedNumbers` ze źródłem + bramka; D7; reguła strażnika: „Wdrożone" tylko z dowodem, liczba mnoga zakazana do 2. klienta |
| R6 | **Publikacja:** `/rodo` bez tożsamości administratora (marker `[DECYZJA FOUNDERÓW: …]` w `dist`) blokuje wejście na produkcję | średnie / wysoki | `CONTROLLER` (wariant osoba fizyczna) wypełniony w F0 jako warunek DoD; bramka `SITE_PUBLISHABLE` w `verify-site.mjs`; szkielet CC + przegląd founderów, radca równolegle (D16). **Rejestracja działalności nie jest tu warunkiem** |
| R7 | Founderzy nie dostarczą zdjęć/bio | średnie / wysoki dla LinkedIn | wariant D6(b) z inicjałem; nigdy stock; sekcja usuwana, nie placeholderowana |
| R8 | **Higgsfield: trial auto-odnawia się na 49 USD, banding na OLED, licencja treningowa. Ryzyko OTWARTE ponownie (D36)**; rozpisane jako R-M3, R-M4, R-M6 | wysokie bez procedury / średni | dwa przypomnienia w kalendarzu **przed** klikiem trialu (dzień 3 i dzień 27), `cancel_trial_auto_renewal` → `confirm_trial_cancel`, zrzut potwierdzenia; zakres strony mieści się w trialu, więc odrzucenie kosztuje 0 USD; `noise=alls=3` + `deflicker`; zakup wg §7.2; **agent nie uruchamia zobowiązań finansowych** |
| R9 | Em-dash sweep psuje limity title/description w `toolsSeo.ts` (L15) | średnie / średni | przebudowa zdań partiami z bramką długości w `check-copy.mjs`; osobny dzień w F0 |
| R10 | Cal.com embed = skrypt zewnętrzny (CSP, narracja „zero chmury dostawcy") | średnie / średni | v1 link zewnętrzny; embed dopiero po wpisie w `/rodo` i rejestrze integracji (faza 2) |
| R11 | React 19.3 i `<ViewTransition>` zbyt świeże; interakcja z `BrowserRouter`/lazy/`ScrollToTop` nietestowana (L4) | średnie / niski | v1 na 19.2.7 z `PageFade`; upgrade w fazie 2 po spike'u; reguła `motion-view-transition-rules` |
| R12 | Dryf przekazu (bot, LinkedIn, wizytówki, `index.html`) | wysokie / średni | `messaging.ts` + ręczna synchronizacja promptu bota w tym samym commicie; bramka diff |
| R13 | Konflikt z oknem c1 w `pdf.ts`/dashboardach; DoD „0 „—" w `site/src`" wymusza edycję plików nietykanych | średnie / wysoki (umowa z c1) | §12: dashboardy i `pdf.ts` nietykane w v1; przełączenie silników w fazie 2; **jawna lista wyłączeń grepa „—"**: `components/dashboards/**`, `components/DemoReport.tsx`, `lib/pdf*` (126 z 621 wystąpień) w DoD F0, `audit-static.mjs` i hooku; sweep tych plików dopiero po merge c1 |
| R14 | Zdjęcie `zoom` roota zmienia wygląd dashboardów na 4K; Playwright WebKit nie odtwarza kompozycji GPU iOS | niskie / niski | retest 1920/2560 w F0 (L11); realny iPhone jako bramka wydania |
| R15 | Repo publiczne → `docs/nuconic-ekosystem-referencja.md` i CLAUDE.md łamią zasadę #3 (L1) | nieznane / wysoki | P sprawdza widoczność repo przed F0; jeśli publiczne: repo prywatne albo `docs/` do osobnego prywatnego repo |
| R16 | **Żywe demo na `/` psuje INP i LCP na telefonie.** Największe pojedyncze ryzyko reframe'u | średnie / wysoki | montaż wyłącznie po `IntersectionObserver` + `requestIdleCallback`, poza `modulepreload`; bramka `homeLazyGz ≤ 45 KB gz`; pomiar INP na profilu Moto G4 w F4; awaryjny wyłącznik: `DemoFrame` zostaje przy zrzucie i linku do podstrony (jedna flaga, **bez drugiej ścieżki renderu**) |
| R17 | **Zdanie „plik nie wychodzi z przeglądarki" przestaje być prawdziwe** po jakiejś przyszłej zmianie (telemetria, embed) | niskie / krytyczny (wiarygodność całego przekazu on-premise) | nowa reguła `demo-client-side-only-claim` (BLOCKER) z testem sieciowym `check-client-only.mjs` w `npm run check`; zakaz przekazywania nazwy i treści pliku do `track()` |
| R18 | **Trzynaście zrzutów rozjeżdża się z UI** po zmianach dashboardów i strona zaczyna kłamać wizualnie | średnie / średni | `shoot-tools.mjs --verify` jako `check:shots`; bramka `sha256` (dwa przebiegi identyczne) i porównanie z plikami w `public/`; rozjazd = czerwony build, nie „do poprawy kiedyś" |
| R19 | ~~Po wycięciu wideo ktoś uzna stronę za zbyt statyczną~~ **zamknięte decyzją D37**; ryzyko odwrotne („za dużo się rusza") jest w R-M8 | niskie / niski | trzy momenty „wow" są policzone i zamknięte (§3, `warstwa-wrazenia.md` §4); powrót do pinowania, karuzeli i drugiego autoplaya pozostaje zamknięty decyzjami Karola z 2026-07-22 i 2026-07-26 |
| R20 | **13 linków i 13 obrazów na home plus 13 kart na hubie** = duplikacja treści pod SEO | niskie / średni | na home wyłącznie nazwy (bez hooków, tagline'ów i chipów działów), pełne opisy tylko na hubie; `ItemList` tylko na hubie; bramka shell-vs-DOM porównuje zbiory nagłówków i akapitów |
| R21 | **Brak podmiotu:** pierwszy płatny pilot wymaga umowy i faktury, których nie ma jak wystawić | wysokie / wysoki (biznesowe, nie stronowe) | strona mówi wyłącznie o bezpłatnej rozmowie 30 minut i o modelu pracy, bez kwot i bez słowa „faktura"; próg `CONTRACT_READY` (§4.6): rejestracja musi poprzedzić podpis. Ryzyko rezydualne, jeśli klient zażąda umowy przed rejestracją |
| R22 | `DemoReport.tsx` i `components/dashboards/**` są **nietykalne w v1** (umowa z oknem c1), a reframe osadza `DemoReport` w nowym miejscu | niskie / średni | `DemoFrame` **opakowuje, nie edytuje**, dokładnie jak `DashboardMount`; scenariusze zrzutów używają wyłącznie ról i widocznego tekstu, bez dokładania `data-shot` w zamrożonych plikach |
| R-T1 | **Trzynaście prawie identycznych ciemnych prostokątów** (wszystkie dashboardy dzielą ten sam kit), czyli dokładnie odwrotność „ogromnego wrażenia" | wysokie bez działania / wysoki | kadr `clip` dobierany per pozycja pod TYP obrazu (§7.6); obowiązkowy przegląd `--contact-sheet` przed zamknięciem F3; bliźniacze kadry poprawiamy zmianą sceny, nigdy filtrem graficznym |
| R-T3 | **Zmiana etykiety przycisku w dashboardzie unieważnia scenę** (selektory po roli i tekście, bo `dashboards/**` są zamrożone) | średnie / niski | scenariusz cytuje etykietę i numer linii źródła w komentarzu; brak trafienia = twardy błąd z nazwą sluga, nigdy pusty zrzut |
| R-T5 | **Zrzuty trybu mock KSeF zawierają nazwę produktu albo domenę** (luka L12); skrypt nie czyta tekstu z obrazu | średnie / wysoki (decyzja o odbrandowaniu z 2026-07-27) | jedyna uczciwa bramka to podpis Karola w `site/media/SOURCES.md` plus przegląd; do czasu potwierdzenia featured i karta KSeF stoją na renderze `KsefFlow` (`--svg-fallback`), więc strona główna nie zależy od czasu founderów |
| R-T6 | `sharp` jako nowa `devDependency` (binarka natywna ~30 MB) | pewne / niski | zero wpływu na bundle klienta; wpis do rejestru zależności (`integ-dependency-audit`); wariant zapasowy ffmpeg, ale wtedy bajt wynikowy zależy od wersji w PATH, czyli determinizm zrzutów staje się warunkowy |
| R-T8 | „Narzędzia" zamiast „Realizacji" osłabia sygnał doświadczenia u odbiorcy szukającego referencji; po usunięciu paska „W liczbach" znika też jedna z jego podpórek | średnie / średni | sygnał niosą ściana trzynastu klikalnych artefaktów, awans sekcji o ludziach na pozycję 6 i przypisanie autorstwa przy nazwisku. Etykieta „Realizacje" przy zerze klientów i tak pęka przy pierwszym pytaniu „u kogo to wdrożyliście?" |
| R-T10 | **Rozjazd plan kontra reguły strażnika.** Reframe dotyka 11 istniejących reguł i dokłada 2 nowe; jeśli plan się zmieni, a reguły nie (albo odwrotnie), bramki F0/F4 będą czerwone na treści zgodnej z decyzją founderów | wysokie bez działania / średni | lista reguł do zmiany z ID i brzmieniem jest w `docs/plan/reframe-2026-09-12.md` §4; zmiany reguł `design-*`, `copy-*`, `motion-*`, `perf-*`, `media-*` i `seo-*` idą **jednym commitem razem z F0**, każda zakończona `node … scripts/build-index.mjs` |
| **R-M1** | **Regresja stackingu na iOS**: nowy `z-index`, `transform`, `will-change` albo `position: fixed` na ścieżce `.content-layer` → `.hero` przywraca „samo tło" | niskie przy kontrakcie / **krytyczny** (strona przestaje istnieć dla głównego kanału) | kontrakt warstw jako BLOCKER w `audit-static` (nie do stłumienia baselinem); wideo wyłącznie w `.hero-media` `absolute`; runtime `elementFromPoint` w środku ekranu = treść; **obowiązkowy test na realnym iPhonie** (Playwright na Windows tej klasy nie odtwarza). Sygnał wczesny: pojawienie się `z-index` w diffie `globals.css` |
| **R-M2** | **Wideo przejmuje LCP**: pierwsza klatka maluje się na całej szerokości hero i Chrome liczy ją jako kandydata LCP; desktop skacze z ~1,4 s na ~3,5 s | średnie / wysoki | trzy warstwy: montaż po `window.load` **i** `requestIdleCallback`; zero preloadu wideo i zero `<video>` w shellu; **bramka elementowa** (element LCP musi być kadrem produktu). Tryb awaryjny: montaż dopiero po pierwszej interakcji użytkownika (LCP jest wtedy zamrożone) |
| **R-M3** | **Autoodnowienie trialu na 49 USD** z karty prywatnej, faktura na osobę fizyczną, koszt nieodliczalny | wysokie (mechanizm działa domyślnie) / średni | dwa wpisy w kalendarzu ustawione **przed** klikiem trialu (dzień 3 minus 12 h i dzień 27), `cancel_trial_auto_renewal` → `confirm_trial_cancel`, zrzut potwierdzenia; **agent przygotowuje krok, nigdy go nie uruchamia** |
| **R-M4** | **Licencja treningowa Higgsfield** (ToU 26.07.2026: trening na inputach i outputach do czasu usunięcia, brak gwarancji IP) | pewne (to zapis umowy) / średni, przy złych wejściach wysoki | `media-higgsfield-inputs-policy` bez wyjątków: do modelu wyłącznie własne abstrakcyjne stille i tekst z szablonów; **zero zrzutów i nagrań narzędzi**, twarzy, danych klientów i materiałów firmy źródłowej; finały tylko na planie płatnym; usunięcie generacji po sprincie i wpis w `SOURCES.md` |
| **R-M5** | **Niespójność stylu**: grunt z modelu ma inną temperaturę światła niż kadr produktu obok, hero czyta się jak kolaż z dwóch projektów | wysokie bez działania / wysoki | jeden kierunek chłodnego światła, jedna paleta stali na `#121212`, `opacity .35` i maska radialna zbliżają warstwy; przegląd **zawsze obok siebie** (grunt z kadrem i bez, w jednym pliku kontaktowym); poprawiamy zmianą promptu i sceny, **nigdy filtrem graficznym** na gotowym pliku |
| **R-M6** | **Banding i migotanie na OLED**: 8-bit VP9/H.264 na stalowych gradientach robi pasy widoczne tylko na telefonie w ciemności | wysokie (domyślne zachowanie kodeka) / średni | `noise=alls=3:allf=t+u` w normalizacji, niższy `crf` w ciemnych scenach, lokalny `deflicker`, pomiar `signalstats` (różnica `YAVG` ≤ 2 %), test na OLED przy 100 % jasności; dwa nieudane podejścia = odrzucenie assetu, nie „poprawa w postprodukcji" |
| **R-M7** | **Brak ffmpeg na PATH albo inna wersja**: potok nie odpala się u drugiej osoby, a bajt wynikowy zależy od wersji | średnie / średni | `winget install Gyan.FFmpeg` i `ffmpeg -version` przed sprintem; wersja i pełne komendy zapisane w `SOURCES.md`; **build strony nigdy nie woła ffmpeg**, do gita wchodzą gotowe pliki, więc brak ffmpeg nie psuje CI. Uwaga: build dostarczany z Playwrightem (`ffmpeg-1011`) ma tylko `libvpx_vp8` i nie nadaje się do produkcji |
| **R-M8** | **„Za dużo się rusza" albo efekt stocku**: ruch technicznie poprawny, ale nic nie mówi; strona wykonawcy narzędzi wygląda jak landing z szablonu | średnie / wysoki dla marki | trzy momenty „wow" policzone i zamknięte; test zasłonięcia („zakryj kadr produktu i zapytaj, czyja to strona"); wymóg jednego czytelnego znaczenia ruchu; `MOTION_TIER = "still"` wycisza media jedną stałą, bez drugiej ścieżki renderu; przegląd po F2 na złożonej stronie, nie na pojedynczych sekcjach |
| **R-M9** | **Nagranie nie jest bajtowo powtarzalne** i bramka determinizmu czerwieni się losowo; albo zmiana etykiety w zamrożonym dashboardzie unieważnia scenariusz | wysokie bez potoku klatkowego / średni | potok nagraj → klatki PNG → hash klatek → re-enkod 24 fps CFR; manifest `CLIPS.json` porównuje klatki, nie kontener; scenariusz cytuje etykietę i numer linii źródła, brak trafienia = twardy błąd, nigdy puste nagranie |
| **R-M10** | **Klip hover przechwytuje kliknięcie** i kafel przestaje być linkiem (regresja `seo-links-in-dom`) | niskie / wysoki | `pointer-events: none` na `<video>`, cały kafel pozostaje jednym `<a>`; test klawiaturą i `curl` liczby linków w `dist/index.html` |
| R-T11 | **Zegar art. 14 ust. 3 lit. a już biegnie:** runda 1 Lead-Scout zebrała 32 leady, a termin miesięczny liczy się od pozyskania danych, nie od wysyłki | średnie / wysoki | sprawdzić, czy `leadscout/leads.json` zawiera dane osób fizycznych; jeśli tak: albo domknąć checklistę outboundu i wysłać w ciągu miesiąca, albo **usunąć warstwę osobową** i odtworzyć ją dopiero przy wysyłce (reguła `legal-outreach-readiness`) |

---

## 14. KPI 90 dni po publikacji

| Obszar | KPI | Cel | Narzędzie |
|---|---|---|---|
| Indeksacja | zaindeksowane trasy | 17/17 (19 HTML minus `404` i `/rodo` z `noindex`); 18/18 po przeglądzie radcy i zdjęciu `noindex` | GSC → Pages |
| Widoczność | zapytania non-brand z wyświetleniami; wyświetlenia `/narzedzia/*` | ≥ 20 zapytań; wzrost tygodniowy | GSC |
| CTR organiczny | CTR podstron narzędzi | ≥ 2 % | GSC |
| Ruch wg kanału | sesje z `utm_source` linkedin / qr / email / partner / post | raport w piątkowym retro | CF Web Analytics / Zaraz |
| Zaangażowanie dowodem | % wizyt **na `/` i na podstronie narzędzia** z interakcją (załaduj przykład / własny plik / odtwórz / PDF) | ≥ 30 % | zdarzenia (`demo_load_example`, `demo_own_file`, `demo_replay`, `pdf_download`) |
| Konwersja miękka | kliknięcia CTA (dialog, `mailto:`, `tel:`, „najgorszy Excel") / sesje | 2–4 % | zdarzenia |
| Konwersja twarda | rezerwacje Cal.com / miesiąc | ≥ 2 (start), 3–5 po 2–3 mies. | Cal.com + zdarzenie |
| Ciepły ruch | % sesji z LinkedIn/QR, które dotarły do S8 lub `/oferta` | ≥ 50 % | `founders_view`, odsłony `/oferta` |
| Jakość techniczna | LCP mobile < 2,5 s, CLS < 0,1, INP < 200 ms; 0 błędów `?debug=1` | zielone | CF Web Analytics (CWV), Lighthouse |
| Zgodność | `SITE_PUBLISHABLE = true` przed publikacją; `OUTREACH_READY = true` przed pierwszym kontaktem handlowym; 0 wysyłek bez zgody PKE; 0 sprzeciwów nieobsłużonych w 7 dni | 100 % | `verify-site.mjs` i `--outreach`, log sprzeciwów |
| Higiena treści | bramki strażnika (marka poprzedniej firmy = 0, NAP, liczby wg trzech statusów, złoto = 0, „—" = 0 poza listą wyłączeń §8.5) | 100 % zielone | `npm run check` |

Rytm: liczby strony dopisane do piątkowego retro obok liczb outboundu; jeden wniosek tygodnia = jedna zmiana.

---

## 15. Odsyłacz do decyzji

Wszystkie decyzje, które ten plan zakłada jako domyślne, są w **`docs/plan/decyzje-founderow-v2.md`** (**D1–D35** po reframe z 2026-09-12 + 6 faktów do dostarczenia; uzasadnienie nowych i zmienionych: `docs/plan/reframe-2026-09-12.md`). Bez odpowiedzi do **2026-09-16, 18:00** obowiązują tam wpisane wybory domyślne; po spotkaniu decyzyjnym Claude Code przepisuje wynik do `docs/DECISIONS.md` (append-only) i zaczyna F0 dnia 2026-09-17. Numeracja `D1–D24` tego planu i numeracja `D-01–D-23` z `synthesis.md` oraz ze skilla strażnika **nie są tożsame**: tabela przejścia jest w `decyzje-founderow-v2.md` §„Tabela przejścia numeracji", a podmiana ID w `.claude/skills/klarow-guardian/**` jest zadaniem F0.

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
| P6 | ~~Trzecia żywa komórka bento bez Excela (`MiniKsef`)~~ **wycofane**: mini-komponenty wypadają z v1, jedyny żywy komponent na `/` stoi w S2; komórki bento niosą statyczne kadry zrzutów | §3 S4 | 1 |
| P7 | ~~Plan B tła: GLSL Hills po `requestIdleCallback`~~ **wycofane (D28)**: w hero stoi kadr produktu, WebGL schodzi z `/` | §7.1, D28 | 1 |
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
| R2 | ~~Pasek „W liczbach"~~ **wycofany (D30)**: dwie uczciwe liczby („13", „12") żyją w podpisie ściany S3, „co do grosza" w kolumnie ✓ sekcji S7 | §3 S3, §3 S7, §10 p. 3 | 1 |
| R3 | ~~Nazwa S3 „Realizacje i dema"~~ **zmieniona (D31)**: nav „Narzędzia", H2 na `/` „Co zbudowaliśmy", H1 hubu „Narzędzia, które zbudowaliśmy" | §3 S3, §4.1, §2.1 (etykieta nav) | 1 |
| R4 | Nunito Sans solo w v1; Geist tylko w budżecie fontów | §5.3, §6.7, D8 | 1 |
| R5 | Estymata: F0 3–4 dni, em-dash sweep jako osobna pozycja | §11 (tabela faz i arytmetyka sumy) | 0 |
| R6 | `PageFade` bez mutacji `ref` w renderze; `DashboardMount` na natywnym `IntersectionObserver` | §6.3 | 0 |
| R7 | Zdjęcie `zoom` roota 1.08/1.18 + retest dashboardów 1920/2560 | §5.4, DoD F0, R14 | 0 |

Odrzucone przeszczepy (`synthesis.md` §1.6) są wypisane w §0 p. 3 i nie wracają bez decyzji founderów: scena pinowana 300dvh, kalkulator „ile dni zajmie pilot", kalkulator G703 na home, kafle spoza ICP, „Claude Code" w copy founderów, parallax hero, eyebrow mono-caps, mono w UI, React 19.3 w fazie 1, `MOTION_TIER` jako druga ścieżka renderu.
