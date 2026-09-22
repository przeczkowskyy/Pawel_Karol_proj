# Klarow.com v2: koncepcja strony (zatwierdzona 2026-09-22)

## Kontekst

Starą stronę Klarow (repo w `Desktop\Karol & Paweł app`) uznaliśmy za spaloną. Nowa powstaje od zera w
`Dokumenty\Klarow v2`, na tym samym repo i tym samym hostingu (klarow.com).

**Czym jest strona.** CV, wizytówka i reklama w jednym, plus portfolio *możliwości* dwuosobowej firmy
automatyzacji: magazyn, księgowość, API, chatboty AI, generatory dokumentów, integracje.

**Kto na nią wchodzi.** Ktoś skanuje QR z neutralnej, czarno-białej wizytówki i czyta na telefonie przez 30–90 s.

**Efekt wow.**
- Zapętlone motion grafiki z Higgsfield. Hero pokazuje gęste, lekko cartoonish okablowanie, sieć neuronową i przepływ danych.
- Przez całą wysokość strony biegnie kabel. Przy przewijaniu płynie nim impuls.

**Proces.** Prompty z tej rozmowy → Higgsfield (obraz → wideo → pętla) → Claude Design (layout) → hand-off tutaj
(architektura, copy, szlif, deploy).

**Decyzje założyciela (21.09):**
- **tylko PL**,
- **wizytówka jest neutralna, więc paletę i znak ustala strona**,
- **portfolio pokazuje tylko możliwości: zero case'ów i zero zmyślonych liczb**,
- **push na `main` idzie od razu na produkcję**, więc każdy commit musi się dać pokazać osobie z QR.

Ze starego projektu wzięte zostały **wyłącznie** infrastruktura i dostępy. Treści ani UI nie czytano.

Plan powstał w 2 rundach wielu agentów:
1. 3 koncepcje, 2 sędziów i synteza. Wygrała koncepcja „odwiedzający z QR na telefonie” (48,5/60 u obu sędziów).
2. Adwersarialna weryfikacja w 4 kierunkach: technika, prompty Higgsfield, zakres i uczciwość, brief do Claude Design.

Surowe raporty panelu (ok. 5 tys. linii) leżą lokalnie w `design/_lokalne/panel-2026-09-21/` — poza gitem, bo repo jest publiczne.

---

## 1. Serwer i dostępy (wyciągnięte ze starego projektu)

| Co | Wartość |
|---|---|
| Repo | `https://github.com/przeczkowskyy/Pawel_Karol_proj.git`, wspólne. Konto nazywało się wcześniej `bibaczebe`, stary URL przekierowuje |
| Gałęzie i tagi | `main` (produkcja), `archiwum/redesign-v3`, tag `stan-2026-09-20` |
| Hosting | **Cloudflare Pages z integracją Git.** Nie ma GitHub Actions ani wranglera; Cloudflare buduje sam po pushu |
| Ustawienia CF Pages | Production branch `main`, Root directory **`site`**, Build command **`npm run build`**, Output **`dist`** |
| Domeny | `klarow.com` i `www.klarow.com`, domena i DNS w tym samym koncie Cloudflare |
| Poczta | Cloudflare Email Routing (`kontakt@klarow.com` → Gmail) plus wysyłka przez Resend SMTP. SPF, DKIM i DMARC działają. **Nie ruszamy** |
| Tożsamość gita | `Karol Balucki <bibaczebe@gmail.com>`, ustawiona per-repo. Adres prywatny, nigdy służbowy |
| Push | per-repo `credential.helper=wincred`: PAT z Menedżera poświadczeń Windows (wpis `git:https://github.com`). Błąd 401/403 oznacza, że PAT wygasł i trzeba odnowić wpis |
| W repo obok, **nie ruszamy** | `post-bot/` (Cloudflare Worker `klarow-post-bot`, deploy osobno), `leadscout/`, `demo/`, `docs/` |

**Kontrakt z Cloudflare:** nowa strona żyje w `site/`, a `npm run build` produkuje `site/dist`. Dzięki temu **panelu CF nie ruszamy**.
Jedyne jednorazowe kliknięcie to włączenie Web Analytics w projekcie Pages.

## 2. Setup repo w `Klarow v2` (commit C0: produkcja bez zmian)

1. W pustym `Klarow v2`: `git clone https://github.com/przeczkowskyy/Pawel_Karol_proj.git .`
   - Klon ma własny `.git`, więc git nie trafi do repozytorium profilu `C:\Users\bibac`. Sprawdzamy to przez `git remote -v`.
2. Konfiguracja:
   - per-repo: `user.email bibaczebe@gmail.com` i `credential.helper wincred`;
   - w `C:\Users\bibac\.git\info\exclude` dopisujemy linię `OneDrive/Dokumenty/Klarow v2/`;
   - w OneDrive dla folderu ustawiamy „Zawsze zachowuj na tym urządzeniu”.
   - **Wyjście awaryjne:** przy pierwszym błędzie EPERM/EBUSY z `node_modules` przenosimy klon do `C:\dev\klarow`.
3. Punkt powrotu: `git tag archiwum/strona-v1 && git push origin archiwum/strona-v1`.
4. **Porządki na czubku `main`, odwracalne tagiem.** Usuwamy wszystko, co by automatycznie wczytało do sesji
   Claude Code reguły starej strony:
   - root `CLAUDE.md` (78 KB),
   - `.claude/agents/*` (8 audytorów),
   - `.claude/workflows/`,
   - `.claude/skills/*` poza `higgsfield-*`, `HIGGSFIELD-README.md` i `lead-scout`,
   - `ui-kit/`,
   - `prompt-wprowadzajacy-*.md`.

   Stary `site/` **zostaje do C1**, więc produkcja w C0 się nie zmienia.
5. Nowy `CLAUDE.md` (≤ 80 linii): cel strony, kontrakt CF, zasady z §3 i §8, jak uruchomić, oraz zdanie
   „`docs/plan/*` to archiwum strategii v1, a nie źródło decyzji o stronie”.
6. `design/koncepcja.md` to skonsolidowana koncepcja: synteza plus wszystkie poprawki z tego planu.
   `design/_lokalne/panel-2026-09-21/` to surowe raporty agentów (poza gitem, repo jest publiczne).
   `design/prompty/` to **hurtownia promptów** wersjonowana w gicie: `higgsfield/*.md` i `claude-design/*.md`.
7. Starego folderu `Desktop\Karol & Paweł app` nie używamy już do commitów. Paweł dostaje info o tagu archiwum.

---

## 3. Koncepcja strony

**Idea.** Hero pokazuje gęstą, działającą maszynownię. Wychodzi z niej jeden kabel, który biegnie przez całą stronę.
Przewijanie przesuwa po nim impuls, który kolejno zasila sekcje i kończy we wtyczce przy „Zadzwoń”.
Przekaz: skomplikowane bierzemy na siebie, a Wam zostaje prosty przepływ danych.

**Metafora w całej marce:**

| Element | Znaczy |
|---|---|
| moduł | usługa |
| przewód | integracja |
| impuls | Wasze dane |
| dioda | proces działa |
| gniazdo | kontakt |

**Hasło marki:** „Skomplikowane bierzemy na siebie. Wam zostaje klarownie.” Pojawia się tylko w stopce, w sekcji 04 i w obrazie OG. Nigdy w H1.

**Zasady dla osoby z QR:**
- **3 s.** Eyebrow i H1 to zwykły tekst HTML, niezależny od wideo.
- **30 s.** Oferta w 6 wierszach i kalkulator.
- **Kontakt.** Dolny pasek kontaktu jest pod kciukiem od pierwszej sekundy.
- **Długość.** Ok. 7 ekranów 390×844. Bez hamburgera, bez karuzel, bez osobnego FAQ.
- **Forma zwrotu.** „Wy” i „Wasze”, **zero form zależnych od płci** („dwaj”, „szefowi”, „handlowiec” i podobne są zakazane).
- **Liczby.** Każda liczba pochodzi od odwiedzającego albo ma etykietę „przykład”. Bez logo klientów, opinii i liczników.

### Mapa strony i copy (po poprawkach weryfikacji)

| id | Treść |
|---|---|
| **pasek (mobile)** | Stały dół, 64 px + safe-area, pełne tło, bez `backdrop-filter`. Przyciski: **Zadzwoń** (bursztyn, `tel:+48786296426`), **Napisz** (mailto, temat „Rozmowa z wizytówki”), **Zapisz kontakt** (`/klarow.vcf`). Chowa się przy `#kontakt`. Na desktopie zamiast paska stały numer telefonu w nagłówku |
| **`#start` hero** | Eyebrow (zawsze): `AUTOMATYZACJE · INTEGRACJE · AI`. **H1 (domyślny, wersja B):** „Automatyzujemy to, co ktoś u Was dziś przepisuje ręcznie.” (wariant A do testu: „Łączymy Wasze systemy, żeby dane płynęły same.”). Copy: „Łączymy magazyn, księgowość, Excel i dokumenty, żeby dane płynęły same. Od jednego raportu po kilka połączonych systemów.” CTA: „Policzcie, ile kosztuje ręczna robota ↓”. Przycisk pauzy wideo (WCAG 2.2.2). Na desktopie tekst po lewej, a pętla 9:16 w panelu po prawej (ten sam plik co na mobile) |
| **`#co-robimy` 01** | H2 „Co automatyzujemy”. 6 wierszy w `<details>`: ikona, nazwa, koralowe „zamiast…” i papierowe „teraz…”. Wiersze w tabeli pod mapą. Pod listą: „Mały problem czy duży system — zaczynamy od kawałka, który boli najbardziej.” Blok **PRZYKŁAD** (etykieta „ilustracja, nie wdrożenie u klienta”) opisany pod mapą |
| **`#oszczednosci` 02** | H2 „Ile kosztuje Was ręczna robota? Policzcie.” Kalkulator opisany w §7 |
| **`#jak-pracujemy` 03** | H2 „Od rozmowy do działającego procesu”. 4 stacje na kablu i 4 obawy, opisane pod mapą |
| **`#kim-jestesmy` 04** | H2 „Z kim rozmawiacie”. Copy: „Klarow to dwie osoby, które same piszą kod i same go wdrażają. Bez działu sprzedaży pomiędzy.” v1: imiona i role (bez placeholderów i monogramów). v1.1: prawdziwe zdjęcia z jednej sesji, bez efektów i bez AI |
| **`#kontakt` 05** | H2 „Połączmy się.” Duże przyciski: Zadzwoń 786 296 426, Napisz, Zapisz w kontaktach. Link „Przyślijcie nam swój najgorszy Excel” (mailto z dopiskiem opisanym pod mapą). „Prześlij dalej” (Web Share, a bez niego kopiowanie linku). Kabel kończy się wtyczką: wpina się, zapala się `POŁĄCZONO`, a „Zadzwoń” dostaje poświatę. Bez obietnicy czasu odpowiedzi |
| **stopka** | Klarow · {administrator: imię i nazwisko} · kontakt@klarow.com · 786 296 426 · Polityka prywatności · „Ta strona nie używa ciasteczek.” |
| **podstrony** | `/start` (prawdziwa strona dla QR, §8), `/polityka-prywatnosci`, typograficzna `/404` |

**01: sześć wierszy oferty**

| Wiersz | Zamiast | Teraz |
|---|---|---|
| Magazyn | liczenia stanów na kartce | stany, WZ i PZ aktualizują się same, a braki wysyłają alert |
| Księgowość | ręcznego przypisywania faktur do zleceń i akceptacji mailem | faktury kosztowe same trafiają do właściwego zlecenia i czekają na akceptację |
| Integracje i API | pięciu programów, które się nie znają | wymieniają dane same |
| Czat AI | odpowiadania 40 razy na to samo | asystent odpowiada na podstawie Waszych dokumentów i cenników, a w razie wątpliwości przekazuje sprawę człowiekowi |
| Generatory dokumentów | składania oferty przez godzinę | dokument z danych jednym kliknięciem |
| Raporty | sklejania raportu w piątek wieczorem | raport odświeża się sam w poniedziałek o 7:00 |

„KSeF” dopisujemy do wiersza Księgowość dopiero po potwierdzeniu.

**01: blok PRZYKŁAD „Zamówienie materiału na budowę, zero przepisywania”.** Cztery statyczne kroki mono z diodami:
1. mail albo formularz z budowy → AI odczytuje pozycje,
2. magazyn → sprawdza i rezerwuje,
3. zamówienie do dostawcy albo WZ,
4. kierownictwo budowy → potwierdzenie · dział zakupów → powiadomienie.

Odgałęzienie: „coś się nie zgadza → do decyzji człowieka”.

**03: stacje na kablu**
1. „Rozmowa, 30 minut, bez zobowiązań — pokażcie proces albo najgorszy Excel.”
2. „Pilot na kopii danych albo w środowisku testowym — gdzie się da, bez dotykania produkcji.”
3. „Wdrożenie etapami. Najpierw to, co boli najbardziej; termin każdego etapu ustalamy przed startem.”
4. „Po odbiorze dostajecie kod, dostępy i dokumentację. Prawa do kodu przenosimy w umowie.”

**03: karty i obawy**
- Karty: „Mały start: jeden raport, który co rano sam zbiera zamówienia do Excela” i „Duży system: połączenia magazyn–sprzedaż–księgowość, budowane etapami”.
- Obawy (`<details>`):
  - Czy musimy wymieniać systemy? Nie.
  - Bezpieczeństwo danych: kopia albo środowisko testowe, minimalny dostęp.
  - Ile kosztuje? Wycena po rozmowie, zanim cokolwiek zaczniemy.
  - Czy tylko dla dużych firm? Nie.

**05: dopisek do linku „najgorszy Excel”:** „Usuńcie nazwiska i dane osobowe — wystarczy układ kolumn i kilka zmyślonych wierszy.”

---

## 4. Świat wizualny

**Paleta.** Tło strony i tło każdej grafiki mają ten sam kolor, więc krawędzie wideo znikają. Motyw jest **świadomie tylko ciemny**,
z testem w pełnym słońcu przed C1.

| Token | Hex | Rola |
|---|---|---|
| `--tlo` | `#0D1014` | tło strony i grafik |
| `--powierzchnia` | `#161B21` | karty, pasek |
| `--powierzchnia-2` | `#1F262E` | pola, obramowania, obudowa modułu |
| `--kabel` | `#3A4450` | kabel bez prądu |
| `--obrys` | `#05070A` | kreskówkowy obrys |
| `--papier` | `#F2EDE3` | tekst (≈ 16:1) |
| `--papier-2` | `#A8A294` | tekst drugorzędny (≈ 7,5:1); nie w hero |
| `--sygnal` | `#FFB938` | **jedyny kolor akcji**: impuls, CTA, diody, wynik |
| `--sygnal-zar` | `#FFF4D6` | jądro głowicy |
| `--dane` | `#39D0C0` | pakiety, stan „działa” |
| `--recznie` | `#FF6A4D` | tylko „zamiast…” i iskra |
| `--neuron` | `#9B8CFF` | tylko w ilustracjach (AI) |

**Typografia**
- **Bricolage Grotesque**, wersja variable: H1 mobile `clamp(34px, 9.6vw, 40px)`, desktop 64–72 px; H2 30 px; tekst 17 px, interlinia 1.5.
- **JetBrains Mono 500**: etykiety, cyfry kalkulatora, kroki.
- Fonty self-hosted przez `@fontsource` (latin i latin-ext), `font-display: swap`.
- Test zdaniem „Zażółć gęślą jaźń”.
- Liczby formatuje `Intl.NumberFormat('pl-PL', {useGrouping: 'always'})`, a przed „zł” stoi twarda spacja.

**Znak**
- Wordmark `klarow` małymi literami, Bricolage 800. Litera „o” to **port**: pierścień z bursztynową kropką.
- Wersja czarno-biała nadaje się do dodruku wizytówek. Favicon to sam port.
- Rysujemy go ręcznie w SVG, nie w generatorze.

**Styl ilustracji: płaski kreskówkowy 2.5D**
- Gruby, zaokrąglony obrys i płaskie wypełnienia. Każdy kabel i każda obudowa ma jasną linię refleksu, bo sam obrys na tle ma kontrast 1,06:1.
- Przesadzone proporcje: grube kable, duże wtyczki. Czytelność planu metra: zakręty 45° i 90°.
- Wspólna **obudowa modułu**: grafitowa skrzynka, papierowy panel, 4 śrubki, port z lewej, dioda w prawym górnym rogu.
- Zakazy: ludzie, roboty, mózgi, tekst, glina/3D, niebieski neon.
- Zabawa jest w ilustracjach, powaga w tekście.

---

## 5. Hero i Higgsfield: hurtownia promptów, runda 1

**Wnioski weryfikacji, które zmieniły podejście:**
1. Pętla z tą samą klatką na starcie i końcu tłumi ruch mniej więcej 10 razy. Seedance potrafi też odtworzyć akcję wstecz. Dlatego testujemy 2 strategie wideo.
2. Seedance nie ma pola negative prompt i czyta każdy token pozytywnie. Prompt ruchu jest więc krótki (50–80 słów), zawiera tylko ruch i kamerę, bez STYLE i bez listy zakazów.
3. Słowa „headline”, „invoice”, „spreadsheet”, „component sheet” i „data packets” przywołują pseudotekst. Zastępujemy je piktogramami opisanymi pozytywnie.
4. Wizja „SUPER skomplikowane” zostaje. Zamiast pustego pasa na tekst stosujemy **gradient gęstości**: cały kadr to maszyna, górne 60% leży „w cieniu” (żaden piksel jaśniejszy niż `#2A313A`), a dolne 40% ma pełny kontrast.
5. Kling 3.0 **przyjmuje** klatkę końcową (poprawka syntezy).

**Kolejność:**
1. **Runda kierunków:** Nano Banana Pro, 9:16, **2K**, 4 warianty na kierunek, bez referencji. 3 kierunki: GŁÓWNY, ALT-1, ALT-2.
2. Wybór kierunku i ta sama generacja w **4K**.
3. Przycięcie symetryczne, **nigdy od dołu**, i resampling Lanczos do `hero-m-start-1080x1920.png`. Ten plik to jednocześnie klatka startowa wideo, poster i baza pomiaru `data-exit`.
4. Retusz pseudoznaków: ręcznie (Photopea, wypełnienie kolorem), a przy większych poprawkach edycja w Nano Banana. Seedream tylko w ostateczności.
5. Wideo (sekcja „Ruch”).
6. Karta stylu A0 wyprowadzona ze zwycięzcy. Dopiero z nią powstają A1d, A2 i A3 (v1.1).

Konto Higgsfield podpięte przez MCP ma **0 kredytów**, więc wklejacie ręcznie. Mastery trafiają do `Klarow v2\_mastery\`
(folder w `.git/info/exclude`).

### Blok STYLE (doklejany na końcu KAŻDEGO promptu obrazu)
```
STYLE: Flat 2.5D cartoon illustration, front-on orthographic view, no perspective, no vanishing points.
Chunky rounded shapes with bold near-black outlines (#05070A) of one constant width, flat fills, one soft drop shadow per object.
Every cable and every housing has one thin pale highlight line (#F2EDE3, low opacity) along its upper edge, so each silhouette separates from the dark background.
Slightly exaggerated proportions: thick patch cables of constant thickness, oversized plugs and jacks, rounded junction boxes with small LEDs, screws and cable ties.
No hairline details: even the thinnest fiber is drawn with a clearly visible bold stroke.
Shared module housing: a rounded dark graphite box (#1F262E) with a warm paper front panel (#F2EDE3), four corner screws, one round port on its left side and one small LED top-right; only the simple pictogram on the front panel differs. Paper anywhere shows thick grey bars instead of writing.
Background: solid flat deep graphite #0D1014, no vignette, no gradient, no texture.
Palette only: graphite cables #3A4450, paper #F2EDE3, amber glow #FFB938, sea-green light packets #39D0C0, coral accents #FF6A4D, lavender neural fibers #9B8CFF.
Light comes only from glowing packets and LEDs, as a soft flat halo.
Modular-synth patch bay meets metro-map clarity: dense but orderly routing with 45- and 90-degree bends.
NEVER include any text, letters, numbers, digits, labels, captions, logos, watermarks, color swatches or hex codes anywhere in the image.
No people, faces, hands, robots or brains. No photorealism, no glossy 3D or clay render, no depth of field, no bokeh, no film grain, no blue neon, no holograms.
```

### A1m GŁÓWNY: „maszynownia” (Nano Banana Pro, 9:16)
```
Vertical 9:16 illustration. One enormous, intricate machine of wiring fills the entire frame from edge to edge, drawn in three depth layers, and it grows brighter, bolder and denser toward the bottom.
Upper 60% of the frame: the machine continues but sinks into deep shadow: only dim lavender fibers and graphite cables drawn barely lighter than the background, an even, low-contrast tangle with no glowing lights, no paper panels and no large shapes.
Lower 40%: full-contrast machinery. Back layer: a lavender neural web of branching fibers and round nodes. Middle layer: at least forty thick graphite cables weaving between ten rounded junction boxes, bundled with cable ties. Front layer: six module housings whose paper panels show simple pictograms: a shelf with three plain boxes; a blank sheet with grey bars sliding into a slot; a speech bubble with three dots; a stack of sheets with grey bars; an empty grid of cells; a gear.
At about 75% height, near the center, the cables fray into a glowing lavender neural knot shaped like dendrites. Small sea-green packets of light sit inside the cables that lead into it.
From the knot, ONE thick main cable of constant width carries a single amber glow downward, turning with 45-degree bends; its last 15% runs perfectly straight and vertical and leaves the bottom edge at 20% of the frame width from the left. The bottom edge stays clear of other objects for a short distance on both sides of this cable.
```

### A1m ALT-1: „szafa krosowa w izometrii”
Pierwsze zdanie STYLE zamieniamy na: *„STYLE: Flat 2.5D cartoon illustration in true isometric projection: parallel edges, no vanishing points, no perspective.”*
```
Vertical 9:16 illustration in true isometric projection. A huge open patch-bay cabinet fills the entire frame from edge to edge: stacked rows of identical rounded module housings slotted into racks like drawers, hundreds of thick patch cables looping between their front ports in tidy bundles held by cable ties, and a small LED on every module.
Upper 60% of the frame: the upper racks sink into deep shadow, drawn barely lighter than the background, an even, low-contrast pattern with no glowing lights and no paper panels.
Lower 40%: full contrast. In one open bay near the center, at about 75% height, a glowing lavender neural knot of branching dendrite fibers is wired into every row; small sea-green packets of light sit inside the cables that lead into it. Six larger module housings stand in the front row, their paper panels showing simple pictograms: a shelf with three plain boxes; a blank sheet with grey bars sliding into a slot; a speech bubble with three dots; a stack of sheets with grey bars; an empty grid of cells; a gear.
All routes gather into ONE thick main cable of constant width that carries a single amber glow; it drops out of the cabinet, its last 15% runs perfectly vertical, and it leaves the bottom edge at 20% of the frame width from the left. The bottom edge stays clear of other objects near it.
```
Ryzyko ALT-1: odbiór „firma od okablowania/IT”.

### A1m ALT-2: „neurony i organiczne kable”
W STYLE zdanie o modular-synth zamieniamy na: *„Organic branching network meets patch-bay hardware: dense and flowing, yet every route stays readable.”*
```
Vertical 9:16 illustration. A living network fills the entire frame from edge to edge: big cartoon neuron cells with round lavender bodies and long branching dendrites; toward their tips the dendrites turn into thick graphite patch cables that end in oversized plugs seated in the ports of module housings.
Upper 60% of the frame: fine branches sink into deep shadow, drawn barely lighter than the background, an even, low-contrast tangle with no glowing lights and no modules.
Lower 40%: full contrast. Three large neuron bodies interlock around one glowing lavender knot at about 75% height; small sea-green packets of light sit along the dendrites that lead into it. Around the knot, six module housings are plugged into dendrite tips; their paper panels show simple pictograms: a shelf with three plain boxes; a blank sheet with grey bars sliding into a slot; a speech bubble with three dots; a stack of sheets with grey bars; an empty grid of cells; a gear.
Dendrites curve organically; only the cables close to the modules use 45- and 90-degree bends.
From the knot, ONE thick main cable of constant width carries a single amber glow downward; its last 15% runs perfectly straight and vertical and leaves the bottom edge at 20% of the frame width from the left. The bottom edge stays clear of other objects near it.
```
Ryzyko ALT-2: odbiór „biotech”.

**Twarde odrzuty stilla.** Oglądamy w powiększeniu 200%. Odrzucamy, jeśli jest:
1. litera, cyfra, glif, kod hex albo próbka koloru;
2. w górnych 60% piksel jaśniejszy niż `#2A313A` albo cokolwiek bursztynowego, morskiego lub papierowego;
3. pień, który nie jest pojedynczy, zmienia grubość, nie ma pionu na ostatnich 15%, wychodzi poza 17–23% szerokości albo ma obcy obiekt w promieniu ±8% szerokości przy dolnej krawędzi;
4. linia cieńsza niż ok. 2 px po zmniejszeniu do 720×1280;
5. mózg, robot, twarz albo dłoń;
6. zbieżna perspektywa;
7. tło odbiegające od `#0D1014` o więcej niż ±2;
8. liczba modułów inna niż 6 albo różne obudowy;
9. połysk, glina albo neonowy bloom;
10. bursztyn poza pniem.

### Ruch hero (Seedance 2.0, image-to-video, 9:16 ustawione ręcznie, audio OFF)

**Strategie.** Drafty w 720p (Fast), po 3 generacje na strategię:
- **V-A:** start = end = `hero-m-start-1080x1920.png`, 8 s.
- **V-B:** tylko klatka startowa, 10 s.

Wybieramy strategię z równym strumieniem w jedną stronę. Jej finał renderujemy w 1080p (tryb standard).
Plan B z tym samym promptem: Kling 3.0, MiniMax H3 (1440×2560), FLUX 3 Video.
```
Static tripod shot, locked-off camera, one continuous shot. The illustration holds perfectly still exactly as in the first frame: every line, shape and color stays fixed for the whole clip. Only light travels: small sea-green packets glide steadily along the bright lower cables into the glowing knot, and a calm stream of amber light flows down the main cable and out through the bottom edge. Tiny LEDs blink softly every two seconds. The dark upper area stays dark and still. 24 fps.
```
- Tylko w V-A dopisujemy na końcu: `The last frame is identical to the first frame.`
- ALT-1: frazę „along the bright lower cables” zamieniamy na „along the bright cables in the front racks”.
- ALT-2: tę samą frazę zamieniamy na „along the dendrites”.

**Odrzuty wideo.** Odrzucamy generację, jeśli ma:
1. ruch kamery, zoom albo dryf skali;
2. kształty zmieniające się tam, gdzie przechodzi światło;
3. pakiety, które zawracają albo płyną w górę pnia;
4. duże obszary zapalające się naraz albo miganie częstsze niż 3 razy na sekundę;
5. światło w ciemnej strefie;
6. pulsowanie albo dryf koloru tła;
7. nowe obiekty albo tekst;
8. pień, który zmienia geometrię;
9. „zamrożenie”: mniej niż 3 pakiety w ciągu 2 s;
10. szarpanie.

**Plan C, bez wideo.** Stosujemy go, gdy nic nie przejdzie odrzutów albo budżetu:
- poster AVIF,
- 10–14 ścieżek SVG obrysowanych po głównych kablach,
- kropki-pakiety na `offset-path` w takcie 2 s.

Plan C działa też w iOS Low Power Mode.

### Pipeline ffmpeg (ffmpeg 9 jest lokalnie; komendy w `design/prompty/higgsfield/pipeline.md`)
0. **Blokada statyki (obowiązkowa).** `maskedmerge`: piksele różniące się od mastera mniej niż próg (12–24) bierzemy z mastera, a światło z wideo.
   - Daje to trzy rzeczy: statyka jest bit w bit równa posterowi, szew pętli dotyczy tylko światła, a plik jest mniejszy.
   - Jeśli maska pokazuje całe kontury, znaczy to, że kamera dryfuje. Taką generację odrzucamy.
1. **V-A:** odcinamy ostatnią klatkę.
   **V-B:** zostawiamy okno 9 s i robimy `xfade` 1 s. `offset = D − 2` (D z `ffprobe`), co daje pętlę 8 s.
   Oba zabiegi to alternatywy, nigdy nie stosujemy ich jeden po drugim.
   Pośredniki zapisujemy bezstratnie (`ffv1`/`.mkv`).
2. **H.264:**
   ```
   libx264 -preset veryslow -tune animation -crf ~27 -profile:v high -g 180 -pix_fmt yuv420p
   ```
   Dodatkowo:
   - jawne tagi bt709 i `in/out_color_matrix=bt709` w `scale`,
   - `hqdn3d=0:0:3:3`,
   - `-movflags +faststart -an`,
   - 720×1280.
3. **Poster:** pierwsza klatka **zakodowanego** pliku, potem AVIF.
4. **Tło:** kolor tła mierzymy próbnikiem na zakodowanym pliku (Safari iOS i Chrome Android) i wpisujemy go jako `--tlo`, zamiast korygować wideo.
5. **Placeholder do Claude Design:**
   ```
   fps=10,scale=540:-1 -c:v libwebp_anim -q:v 50 -loop 0
   ```
   Do tego PNG pierwszej klatki. **Nigdy nie trafia na produkcję.**

---

## 6. Kabel przez całą stronę (efekt podpisowy, v1)

**Geometria**
- **Mobile:** prosta szyna z osią na x = 18 px. Treść zaczyna się 40 px od lewej.
- **Desktop:** szyna 10 px przy lewej krawędzi kolumny (maks. 1120 px).
- Bez S-krzywych i meandrów.
- Pas kabla przycinamy przez `overflow: visible clip`, żeby nie obciąć poświaty.

**Warstwy (bez SVG na całą wysokość)**
- Kabel bez prądu to gradient: obrys, rdzeń i refleks.
- `.kabel__zasilony` przesuwa się `translateY(-100%→0)`.
- Głowica to `::after` warstwy zasilonej: rdzeń 6 px i halo 20 px, „oddycha” co 2 s.

**Mechanizm (CSS scroll-driven; potwierdzony przez MDN i caniuse)**
```css
:root{--linia:62%;--linia-reszta:38%}
@media (min-width:900px){:root{--linia:50%;--linia-reszta:50%}}
.kabel{view-timeline:--kabel block;view-timeline-inset:var(--linia) var(--linia-reszta)}
@supports (animation-timeline: view()){
 .kabel__zasilony{animation:zasil linear both;animation-duration:1ms;
   animation-timeline:--kabel;animation-range:cover 0% cover 100%}
}
@keyframes zasil{from{transform:translateY(-100%)}to{transform:translateY(0)}}
```

**Wsparcie przeglądarek**

| Przeglądarka | Co widać |
|---|---|
| Chrome, Edge, Android | ruch impulsu |
| Safari 26+ | ruch impulsu, na osobnym wątku od 26.4 |
| Firefox stabilny, iOS ≤ 18 | w v1 **statyczny, w pełni zasilony kabel**; fallback JS (ok. 15 linii, gotowy w lokalnym raporcie technicznym) dopiero w v1.1, jeśli WA pokaże potrzebę |

**Stan sekcji**
- Jeden `IntersectionObserver` z linią czytania (działa wszędzie).
- Sekcja przecinająca linię oraz wszystkie wcześniejsze dostają klasę `.zasilona`. Klasy nigdy nie zdejmujemy.
- CSS pod `.zasilona` robi dwie rzeczy: etykieta ○ → ●, a w `#kontakt` wtyczka, napis `POŁĄCZONO` i poświata „Zadzwoń”.

**Poprawka: kabel na dnie strony.** Głowica nie dojdzie do końca szyny, jeśli pod wtyczką jest mniej niż (1 − linia) × wysokość okna.
- Dodajemy strażnika `#koniec` na końcu stopki. Gdy jest widoczny, dostajemy `html.kabel-pelny`, co zasila całość.
- Wtyczka stoi przy górze `#kontakt`, obok H2.

**Łącznik hero → szyna**
- Krótka ścieżka SVG w stylu metra z własnym `view-timeline` o tej samej linii. Głowica jedzie przez `offset-path`.
- Timebox 2 h. Plan awaryjny: szyna zaczyna się pod hero gniazdem.

**Zakazy**
- scroll-jacking, smooth-scroll, `scroll-snap`, `sticky`,
- listenery `wheel` i `touchmove`,
- `overflow: hidden|auto` na przodkach `.kabel` (to zamraża oś czasu); poziomy scroll gasimy przez `overflow-x: clip`,
- `filter`, `blur`, `backdrop-filter` na dużych warstwach.

**Ograniczony ruch.** `prefers-reduced-motion` daje kabel statycznie zasilony i poster zamiast wideo. Bez JS strona wygląda tak samo.

**v1.1 (po pierwszej rozmowie):** przerwa w kablu z iskrą w 01, pakiety danych, diody i przekreślenia w wierszach, stacje 03, „o” w stopce.

---

## 7. Kalkulator „Ile kosztuje Was ręczna robota?”

**Wzór** (widoczny pod wynikiem, mono, z liczbami odwiedzającego):
```
koszt ręcznej roboty do odzyskania ≈ osoby × h tygodniowo × 44 tyg. × udział × zł/h
```
44 tygodnie to 52 minus urlop, święta i choroby.

**Pola**

| Pole | Zakres | Uwagi |
|---|---|---|
| Osoby | 1–20 | |
| Godziny na osobę tygodniowo | 1–40 | |
| Koszt godziny | 35–200 zł | „i”: 9 000 zł brutto × 1,2 ÷ 168 ≈ 65 zł |
| Udział do automatyzacji | 20–90% | podpis „Zwykle nie wszystko” |

**Wynik**
- Duża liczba: „≈ 16 600 zł rocznie”, podpis „tyle kosztuje czas, który da się odzyskać (przed kosztem wdrożenia)”.
- Pod nią godziny i dni robocze oraz zakres dla udziału 30–70%.
- Zaokrąglamy **w dół**: godziny i dni do całości, kwoty do 100 zł.

**Presety.** Chipy z podpisem „przykładowe liczby — zmieńcie na swoje”. Liczby sprawdzone ręcznie i przez agenta:

| Preset | os. | h | zł/h | udział | wynik | zakres 30–70% |
|---|---|---|---|---|---|---|
| Raport tygodniowy w Excelu (domyślny) | 3 | 3 | 70 | 60% | ≈ 237 h · 29 dni · ≈ 16 600 zł | ≈ 8 300 – 19 400 zł |
| Dokumenty spoza KSeF i dekretacja | 1 | 8 | 60 | 60% | ≈ 211 h · 26 dni · ≈ 12 600 zł | ≈ 6 300 – 14 700 zł |
| Stany magazynowe, WZ/PZ | 2 | 6 | 55 | 50% | ≈ 264 h · 33 dni · ≈ 14 500 zł | ≈ 8 700 – 20 300 zł |
| Oferty i umowy | 2 | 5 | 80 | 60% | ≈ 264 h · 33 dni · ≈ 21 100 zł | ≈ 10 500 – 24 600 zł |

**Dopiski pod wynikiem**
- „To Wasz rachunek na Waszych liczbach, nie nasz wynik. Koszt wdrożenia podajemy z góry, po rozmowie.”
- „Nic nie wysyłamy — liczy się w Waszej przeglądarce.”

**Przyciski**
- **„Wyślij nam ten rachunek”**: mailto z polami i linią „Co dziś robimy ręcznie: …”. To gotowy pierwszy brief.
- **„Prześlij rachunek dalej”**: Web Share z tekstem i adresem `https://klarow.com/`, bez parametrów.
- „Omówmy to — zadzwoń”.

**Wycięte:** pole kosztu wdrożenia i linia zwrotu (prognoza bez podstaw), link z parametrami, odliczanie (to v1.1).

**Technika**
- Jedna funkcja `policz()` w `src/lib/kalkulator.ts`.
- Build renderuje nią domyślny preset do HTML, więc wynik widać bez JS.
- `node --test` sprawdza 4 presety z tabeli.

---

## 8. Stack i pliki

**Astro 7.x (statyczny)**
- Node 24 (`site/.node-version`); obraz Cloudflare ma domyślnie 22.16, Astro 7 wymaga co najmniej 22.12.
- Bez Reacta, Tailwinda i GSAP. JS w przeglądarce do ok. 8 KB.
```js
// site/astro.config.mjs
export default defineConfig({ output:'static', build:{format:'file'}, trailingSlash:'never', compressHTML:true });
```
- `compressHTML: true` jest potrzebne, bo nowy domyślny `'jsx'` zjada spacje inline.
- `canonical` i `og:url` bierzemy z listy ścieżek w `strona.ts`, nigdy z `Astro.url`, bo w buildzie ma końcówkę `.html`.
- `astro check` wymaga `@astrojs/check` i `typescript ~6.0` (TS 7 łamie check).

**Struktura**
```
site/  package.json  .node-version  astro.config.mjs
  public/  _redirects  _headers  klarow.vcf  favicon.svg  og.jpg  media/hero-m.v1.h264.mp4 (+ poster)
  src/content/strona.ts     ← cała treść PL w jednym pliku
  src/styles/tokens.css     ← nazwy 1:1 z briefu Claude Design
  src/lib/kalkulator.ts (+ .test)
  src/components/  Hero, Kabel, Sekcja, Kalkulator, PasekKontaktu, Wtyczka, Petla …
  src/scripts/     petla.ts (~20 linii) · porty.ts (IO) · kalkulator.ts · udostepnij.ts
  src/pages/       index.astro  start.astro  polityka-prywatnosci.astro  404.astro
  scripts/straznik.mjs
design/  koncepcja.md  prompty/{higgsfield,claude-design}/  handoff-NN/  _lokalne/ (poza gitem)
```

**`/start` to prawdziwa strona, nie przekierowanie**
- Cloudflare Web Analytics **nie zapisuje query stringów ani UTM**.
- Dlatego `start.astro` renderuje ten sam komponent co index, z `canonical` na `/`.
- WA pokaże ścieżkę `/start`, czyli wejścia z QR. Wizytówki z QR na `klarow.com` też działają.

**`_redirects`.** Cloudflare nie normalizuje ukośnika, więc wpisujemy oba warianty:
```
/oferta      /                       301
/oferta/     /                       301
/faq         /                       301
/faq/        /                       301
/realizacje  /                       301
/realizacje/ /                       301
/narzedzia   /                       301
/narzedzia/* /                       301
/rodo        /polityka-prywatnosci   301
/rodo/       /polityka-prywatnosci   301
```

**`_headers`**
- `/_astro/*` i `/media/*`: `Cache-Control: public, max-age=31536000, immutable`. Pliki w `/media` mają wersję w nazwie (`.vN`) i nigdy ich nie nadpisujemy.
- `/klarow.vcf`: `Content-Type: text/vcard; charset=utf-8`.
- `/*`: `nosniff`, `Referrer-Policy`, `Permissions-Policy`. W tej regule **bez** `Cache-Control`.

**`<Petla>` w v1**
- `<video muted playsinline loop preload="none" poster>`, bez `autoplay` i bez `src` w HTML.
- JS ustawia `src` po zdarzeniu `load`, chyba że: jest `reduced-motion`, `saveData` albo `load` przyszedł później niż 4 s.
- Pauza przy `visibilitychange`.
- Odrzucone `play()` (Low Power Mode) daje poster i ponowienie po pierwszym tapnięciu.
- Tylko H.264. AV1 i `mediaCapabilities` to v1.1.

**Strażnik w buildzie** (`"build": "astro build && node scripts/straznik.mjs"`, ok. 20 linii). Build na Cloudflare pada, a produkcja zostaje na poprzedniej wersji, gdy:
- w `dist` jest `TODO`, `lorem`, `[do potw…`, `[nazwisko`, `[rola` albo `dwaj|we dwóch|obaj`,
- brakuje `tel:+48786296426`,
- brakuje `dist/start.html` z canonical `/`.

Bez hooka pre-push: `|| true` nie działa w cmd.exe, a hook to nadmiar dla v1.

**Budżety.** To cel sprawdzany ręcznie przed C2, spisany w README, nie kod:

| Zasób | Cel |
|---|---|
| Pierwszy render | ≤ 250 KB |
| Poster hero | ≤ 100 KB |
| Pętla hero H.264 | cel 1,3 MB, sufit 1,6 MB |
| Cała strona na mobile | ≤ 3 MB |
| Metryki | LCP ≤ 2,5 s (Slow 4G), CLS 0, Lighthouse mobile ≥ 90 |

**Pozostałe**
- `klarow.vcf`: vCard 3.0.
- OG: statyczny JPG z kadru hero i wordmarku.
- WA to beacon Cloudflare: bez cookies i bez `localStorage`, więc zdanie w stopce jest prawdziwe.
- **Polityka prywatności na jeden ekran:**
  - administrator z imienia i nazwiska,
  - cele i podstawy (art. 6 ust. 1 lit. b i f RODO),
  - odbiorcy: Cloudflare (hosting, statystyki) i dostawca poczty,
  - transfer do USA na podstawie DPF,
  - przechowywanie do 12 miesięcy,
  - prawa i skarga do PUODO,
  - „pliki z danymi osobowymi usuwamy i prosimy o wersję bez nich”.

---

## 9. Claude Design

**Przepływ:**
1. Zatwierdzony still A1m (PNG i WebP) oraz ewentualnie A0.
2. W Claude Design **PROMPT #1** (brief). Przy onboardingu wybieramy „bez design systemu” i **nie** podpinamy starego repo ani zrzutów.
3. PROMPT #2: hero na 360×640.
4. PROMPT #3: stany zasilenia.
5. PROMPT #4: paczka hand-off, czyli `README`, `tokens.css`, `strona.css`, `index.html` w stanie bez JS, `stany.html`, bez `<script>`, bez stylów inline i bez base64.
6. **Export → Send to Claude Code** albo ZIP do `design/handoff-01/`.
7. Tutaj: kontrola naruszeń kontraktu, potem wchłonięcie w C1.

Z hand-offu bierzemy układ, odstępy i wygląd komponentów. Nie bierzemy JS, fontów z CDN ani stylów inline.
Każda odchyłka od tokenów wraca do `tokens.css`.

Szkic promptów #1–#4 i promptu awaryjnego „R” (powrót do kontraktu) jest gotowy (ok. 330 linii).
W C0 zapisuję go do `design/prompty/claude-design/01…04.md` **z poprawkami tego planu**:
- H1 w wersji B jako domyślny, eyebrow zawsze widoczny, bez chipa QR;
- strefa tekstu w górnych 60% kadru i scrim do 60%;
- copy z §3 i §7;
- presety z §7;
- formy neutralne;
- wycięte: pigułka na desktopie (zostaje numer w nagłówku), drugi przełącznik ruchu, baner udostępnionego linku, pole kosztu wdrożenia, efekt z czerni i bieli w kolor, grafika A7;
- stopka z administratorem.

Zasada ogólna: Claude Design rysuje stany (przygaszony i zasilony), a mechanikę trzyma kod. Pula użycia Claude Design jest wspólna, więc rundy #2–#4 są celowo wąskie.

---

## 10. Kolejność pracy

Etap jest zamknięty dopiero razem ze swoją akcją „do ludzi”. Postęp liczymy w rozmowach, nie w commitach.

| Krok | Kto | Co | Zamknięty, gdy |
|---|---|---|---|
| **C0** (po akceptacji planu) | Claude Code | §2: klon, konfiguracja, tag, porządki, nowy `CLAUDE.md`, `design/koncepcja.md`, hurtownia promptów. Produkcja bez zmian | push |
| **E1** | Wy | Higgsfield runda 1: 3 kierunki × 4 warianty 2K, wybór, 4K, `hero-m-start-1080x1920.png`, drafty ruchu V-A i V-B | still zatwierdzony |
| **E1b** | Wy | Test 3 s na makiecie telefonu (sam tekst hero, raz bez obrazu i raz ze stillem, H1 w wersji A i B) na 5 osobach spoza branży. Pytanie: „Z jaką sprawą można by zadzwonić do tej firmy?”. Zaliczony, gdy ≥ 4/5 osób nazywa konkretne zadanie i nikt nie mówi „sieci/IT/okablowanie”. Do tego 5 wiadomości do firm z listy leadów (bez linku, prośba o 20 min) | test zrobiony, wiadomości wysłane |
| **E2** | Wy + Claude Code | Claude Design, rundy #1–#4 (timebox ok. 4 h), `design/handoff-01/` | hand-off w repo |
| **C1** „Nowa wizytówka” | Claude Code | `git rm` starego `site/`; Astro; layout z hand-offu; całe copy; kalkulator z testem; statyczny zasilony kabel; porty z IO; hero z posterem; pasek, vCard, `/start`, polityka, 404, `_redirects`, `_headers`, OG, strażnik. **Stara strona znika**, stare adresy nie dają 404 | link wysłany 5 osobom z ICP (nie rodzinie) |
| **C2** „Kabel i hero w ruchu” | Claude Code | impuls ze scrollem, łącznik, wtyczka `POŁĄCZONO`, pętla hero H.264 (albo still, jeśli pętla nie przejdzie odrzutów w terminie), pauza wideo. Test na tanim Androidzie przez LTE i na iPhonie | 5 osób zeskanowało QR na żywo, 10 kolejnych wiadomości z linkiem, ≥ 1 umówiona rozmowa |
| **v1.1** | razem | kolejność wg tego, o co pytali rozmówcy. Kandydaci: motion grafiki sekcji A2 i A3, A1d, ikony A4, zdjęcia, detale kabla z §6, AV1, fallback JS kabla, odliczanie | każda pozycja po rozmowie |

**Orientacyjne terminy:** C0 dziś (pn 21.09), E1–E2 do czw 24.09, C1 do pt 25.09, C2 do wt 29.09.

**Motion grafiki sekcji w v1.1**
- **A2** (przepływ zamówienia) i **A3** (plątanina Excela → węzeł → równy strumień → raport).
- Domyślnie still 16:9 i światło w CSS: idealna pętla, kilkadziesiąt KB, działa w Low Power Mode.
- Wideo z Higgsfield (V-B + blokada statyki) to opcja.
- Prompty obrazu i ruchu A0, A1d, A2, A3 oraz A4 (Recraft vector) są w `design/prompty/higgsfield/04-v1.1-pozostale-assety.md`.

**Przed każdym pushem na `main`:**
- `npm run build` (ze strażnikiem) i `npm run preview -- --host`, potem test z telefonu.
- Przy zmianach w `_redirects` lub `_headers` wypychamy najpierw krótką gałąź i sprawdzamy podgląd `*.pages.dev` przez LTE.
- Rollback: Cloudflare → Deployments.

## 11. Do rozstrzygnięcia przez Was przed C1

Strażnik nie wypuści na produkcję niczego z `[do potwierdzenia]`.

1. **Administrator danych i stopka.** Czyje imię i nazwisko: osoby, do której należą `kontakt@` i numer 786 296 426. Czy podajemy adres do korespondencji? Wymaga go art. 5 ustawy o świadczeniu usług drogą elektroniczną; bez niego zostaje ryzyko.
   - **Rekomendacja:** imię, nazwisko i e-mail teraz, pełne dane po wpisie do CEIDG.
   - Słów „spółka” i „sp. z o.o.” oraz NIP nie używamy do rejestracji.
2. **Nazwiska obu osób na stronie.** Do czasu decyzji same imiona i role. Nie pokazujemy cudzych projektów jako własnego dorobku.
3. **Które obietnice podpisujecie dziś:** KSeF w wierszu 2, rozmowa 30 min, pilot, przeniesienie praw w umowie.
   - Przed pierwszą rozmową o pilocie potrzebny jest wzór umowy (przeniesienie praw i umowa powierzenia).
   - Rejestracja działalności najpóźniej w dniu pierwszego zlecenia.
4. **Kierunek hero** (GŁÓWNY, ALT-1 albo ALT-2) po rundzie 1 w Higgsfield.
5. **Role w sekcji 04:** 3–4 słowa na osobę.

## 12. Weryfikacja

- **Lokalnie:** `npm run check` (astro check), `node --test` (4 presety), `npm run build` (ze strażnikiem), `npm run preview -- --host` na telefonie w tej samej sieci.
- **Po deployu (curl -I):**

  | Adres | Oczekiwany wynik |
  |---|---|
  | `https://klarow.com/` | 200 |
  | `/start` | 200 z canonical `/` |
  | `/oferta/`, `/narzedzia/raport-zarzadczy`, `/faq` | 301 → `/` |
  | `/rodo` | 301 → `/polityka-prywatnosci` (200) |
  | `/klarow.vcf` | `Content-Type: text/vcard` |
  | plik z `/_astro/` | `immutable` |
  | nieistniejący adres | 404 |

- **Urządzenia:**
  - Android za ok. 800 zł przez LTE: kabel bez szarpania, LCP ≤ 2,5 s;
  - iPhone z iOS 26.4+: impuls na linii 62%, wtyczka dochodzi też na desktopie;
  - iOS 18 albo Firefox: statyczny zasilony kabel;
  - Low Power Mode: poster, a po tapnięciu wideo;
  - `prefers-reduced-motion`;
  - 360×640 bez poziomego scrolla;
  - test w pełnym słońcu.
- **Treść:**
  - „Zadzwoń” otwiera wybieranie numeru, a vCard importuje się na iPhonie i Androidzie;
  - kalkulator daje liczby z tabeli §7;
  - Lighthouse mobile ≥ 90;
  - WA zlicza ścieżkę `/start`.
- **Pętla:** szew niewidoczny przez 3 obiegi, klatka 0 równa posterowi (dzięki blokadzie statyki), plik w budżecie.
