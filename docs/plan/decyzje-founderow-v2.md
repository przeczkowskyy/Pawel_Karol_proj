# Decyzje founderów przed F1: klarow.com v2

> Data: 2026-09-12 · Dla: Paweł + Karol · Plan, którego dotyczą: `docs/plan/strona-v2-plan.md`
> **Termin odpowiedzi: 2026-09-16 (środa), 18:00.** Bez odpowiedzi obowiązuje „Domyślny wybór" i F0 rusza 2026-09-17. Odpowiedź może być jednym mailem lub wiadomością w formacie `D3: b` (litera opcji), z uwagami tam, gdzie chcecie inaczej. Claude Code przepisuje wynik do `docs/DECISIONS.md` (append-only) przed pierwszą edycją kodu, w tym samym commicie podmieniając stare ID `D-xx` w skillu strażnika wg **tabeli przejścia numeracji** (przed częścią F).
> Numeracja: ten dokument używa `D1…D24`; `synthesis.md` i reguły w `.claude/skills/klarow-guardian/**` używają starszej `D-01…D-23` z INNYM mapowaniem. Przy czytaniu reguły strażnika sprawdzaj ID w tabeli przejścia, nie „na oko".
> Konwencje: bez pauzy „—"; „–" tylko w zakresach liczbowych. Marka poprzedniej firmy = „firma produkcyjno-budowlana".

Każda decyzja ma: pytanie · opcje · **REKOMENDACJA** · **DOMYŚLNY WYBÓR** (gdy brak odpowiedzi do terminu) · konsekwencja · kto decyduje.

---

## Część A · Przekaz i prawdziwość

### D1 · Jedno zdanie marki (H1 = LinkedIn = prompt bota)

- **Pytanie:** jakie zdanie ma stać w H1, w nagłówkach LinkedIn obu founderów i w promptcie bota `/post`?
- **Opcje:** (a) pełne V1 „Narzędzia pod Twój proces. Działają w dni, dane zostają u Ciebie." / „Tools built around your process. Working in days, your data stays with you."; (b) H1 = pierwsze dwa człony („Narzędzia pod Twój proces. Działają w dni."), reszta w subtekście; (c) własne brzmienie.
- **REKOMENDACJA:** (a). Jedno zdanie na wszystkich powierzchniach, bez dryfu między H1 a LinkedIn; niesie trzy filary bez słowa „Excel".
- **DOMYŚLNY WYBÓR:** (a).
- **Konsekwencja:** zdanie trafia do `messaging.ts` i 7 powierzchni naraz; zmiana później = jeden commit + ręczna aktualizacja nagłówków LinkedIn.
- **Kto:** Paweł (głos sprzedaży) po konsultacji z Karolem.

### D2 · Excel: symptom czy tożsamość

- **Pytanie:** co robimy z „firmami, które wyrosły na Excelu" i hakiem „najgorszy Excel"?
- **Opcje:** (a) usunąć Excel wszędzie; (b) Excel jako symptom i jedno z wejść: schodzi z H1, meta, JSON-LD, `llms.txt`; zostaje w kartach bólu, FAQ „Mamy już ERP", na `/oferta` i w outboundzie jako hak „Przyślij nam swój najgorszy Excel"; (c) status quo.
- **REKOMENDACJA:** (b).
- **DOMYŚLNY WYBÓR:** (b).
- **Konsekwencja:** spójność z playbookiem outboundu i wizytówkami QR; strona przestaje sugerować „tylko Excel".
- **Kto:** obaj.

### D3 · Zakres obietnicy „w dni"

- **Pytanie:** czy „w dni" obiecujemy globalnie, czy jako „pierwszy działający efekt w dni" z uczciwą etykietą czasu na każdej karcie?
- **Opcje:** (a) globalnie; (b) „pierwszy działający efekt w dni" + pole `delivery` per karta („pilot 5–10 dni" / „etapami").
- **REKOMENDACJA:** (b) (plan strategiczny §5.3 i §5.5 wymagają tego wprost; integracja KSeF nie mieści się w „dniach").
- **DOMYŚLNY WYBÓR:** (b).
- **Konsekwencja:** każdy wpis w `tools.ts` dostaje `delivery` PL + EN (lint w `verify-site.mjs`).
- **Kto:** Paweł.

### D4 · „Zero chmury" i asystent AI w opisie KSeF

- **Pytanie:** jak sformułować wyróżnik i co z bulletem „opcjonalny asystent AI" w opisie KSeF (`tools.ts:644`, `:658`)?
- **Opcje:** (a) zostawić dzisiejsze „prawdziwie zero chmury: zero API do modeli językowych, zero serwera" i bullet AI; (b) „zero chmury dostawcy: dane nie trafiają do nas ani do żadnej chmury poza systemami, które sam wskażesz (np. KSeF)" + bullet AI usunięty; (c) jak (b), ale bullet AI zostaje jako „opcjonalny, domyślnie wyłączony, tylko agregaty".
- **REKOMENDACJA:** (b). Dzisiejsze brzmienie jest fałszem dla KSeF (API MF, serwer), a bullet AI kłóci się z „kalkulator, nie wróżka" u persony, która boi się AI.
- **DOMYŚLNY WYBÓR:** (b).
- **Konsekwencja:** zmiana w `Differentiators` (nowa sekcja S7), `llms.txt`, `tools.ts`. Zdanie `MESSAGING.determinism` nie używa słowa „AI" nawet w zaprzeczeniu (`brand-no-ai-word-in-sales`): kanonicznie **„Twoje liczby liczy zwykły, deterministyczny kod. Te same dane dają ten sam wynik."** / „Your numbers are computed by plain, deterministic code. Same data, same result." Jedyny wyjątek: odpowiedź FAQ „Czy AI liczy moje dane?", która zaprzecza.
- **Kto:** Karol (właściciel produktu KSeF).

### D5 · Etykieta KSeF

- **Pytanie:** jak nazwać status realizacji KSeF, skoro connector jest zweryfikowany na atrapie transportu i nie ma śladu wdrożenia u klienta?
- **Opcje:** (a) „Własny produkt" natychmiast; (b) najpierw żywy przebieg na `api-demo.ksef.mf.gov.pl` (zrzut + wpis w `SOURCES.md`), potem „Wdrożone"; (c) zostawić „WDROŻONE".
- **REKOMENDACJA:** (a); „Wdrożone" dopiero po pierwszym kliencie lub udokumentowanym żywym przebiegu.
- **DOMYŚLNY WYBÓR:** (a).
- **Konsekwencja:** `kind: "product"`, chip `st st-accent`, JSON-LD `Service`, etykieta czasu „Health-Check 48 h → pilot etapami".
- **Kto:** Karol.

### D6 · Sekcja founderów i publiczna obecność Karola

- **Pytanie:** kto i jak pojawia się w sekcji „Rozmawiasz z osobą, która narzędzie zbudowała"?
- **Opcje:** (a) obaj z nazwiskiem, zdjęciem, rolą, jednym zdaniem i linkiem LinkedIn; (b) Paweł pełnie, Karol imię + rola + rama z inicjałem „K" (bez zdjęcia i nazwiska); (c) „zespół" bez osób = sekcja usunięta (home ma 8 sekcji).
- **REKOMENDACJA:** (a), jeśli relacja Karola z obecnym pracodawcą i umowa IP na to pozwalają; w przeciwnym razie (b) do czasu umowy.
- **DOMYŚLNY WYBÓR:** (b).
- **Konsekwencja:** kanał LinkedIn (rdzeń outboundu) ląduje na stronie z twarzą co najmniej jednego foundera; przy (a) potrzebne 2 zdjęcia (neutralne tło, jedno światło) + 2 zdania bio do końca F1. Nigdy stock, nigdy placeholder.
- **Kto:** Karol (o sobie), Paweł (o sobie); zdjęcia i bio do 2026-09-19.

### D7 · Liczby i case z poprzedniej firmy przed umową IP

- **Pytanie:** co robimy z liczbami już obecnymi na stronie („~30 równoległych projektów", „≈10 000 wierszy kosztów z ERP/mies.", „klienci w USA", „kilkanaście narzędzi") i czy „15 narzędzi w jednej firmie produkcyjno-budowlanej" oraz nazwy integracji (GUS/KRS/Autenti/EBC) są bezpieczne przed umową?
- **Opcje:** (a) usunąć wszystkie liczby poprzedniej firmy; (b) zamrozić obecny zestaw anonimowy wyłącznie w istniejących opisach podstron i FAQ, na home tylko liczby własne, „kilkanaście" zamiast „15" do potwierdzenia; (c) dodawać nowe liczby i karty case już teraz.
- **REKOMENDACJA:** (b) + umowa IP / zgoda na case jako priorytet nr 1 poza stroną (plan strategiczny §5.2: „PRZED startem sprzedaży"). Karty case („Obieg dokumentów podwykonawczych", „Zamknięcie cyklu jednym przyciskiem") i „15" dopiero po podpisie.
- **DOMYŚLNY WYBÓR:** (b) z „kilkanaście".
- **Konsekwencja:** `allowedNumbers` w `messaging.ts` z polami `source` i `status`, jako lustro rejestru `.claude/skills/klarow-guardian/references/allowed-numbers.md`. Bramka audytu działa na **trzech statusach**, nie na zasadzie „wszystko poza listą = błąd": **OK** (wolno wszędzie), **ZAMROŻONE** (wolno tylko w plikach, w których liczba już jest: `faq.ts`, `toolsSeo.ts`, `tools.ts`, opisy podstron w `entry.tsx`; przeniesienie na `/` albo do nowego pliku = BLOCKER), **DO POTWIERDZENIA** (nie publikujemy do wpisu w `docs/DECISIONS.md`). Powód: wybór (b) świadomie zostawia liczby w FAQ i w opisach narzędzi, a odpowiedzi FAQ są zawsze w DOM, więc trafiają do `dist`; bramka „każda inna liczba = błąd" zapaliłaby `npm run check` na czerwono w dniu włączenia. Zakaz kwot dotyczy **cennika Klarow** (pilot, retainer, panel, sprint USA) w PLN i USD; opis narzędzia `billing-us-g703` może mówić o walucie i mechanice arkuszy AIA G702/G703, bo to cena klienta, nie nasza. Wariant twardy (gdybyście woleli): przepisać 6 odpowiedzi FAQ tak, żeby nie zawierały liczb, i dopiero wtedy włączyć bramkę bez whitelisty.
- **Kto:** Paweł (rozmowa z poprzednią firmą + 1 h u radcy: wzór umowy sprintu + licencja na wzorce).

### D23 · Sformułowania sekcji „Co osiągniesz"

- **Pytanie:** czy 4 efekty z planu idą dosłownie: „Godziny kontrolera wracają do kontrolingu", „Zamknięcie miesiąca w dni, nie w tygodnie", „Błędy złapane przed zarządem, nie po", „Urlop bez telefonów z pytaniem o plik"?
- **Opcje:** (a) dosłownie (plan §3 S4); (b) własne sformułowania Pawła w tym samym formacie (1 zdanie + 1 linia, zero liczb).
- **REKOMENDACJA:** (a) jako punkt wyjścia; Paweł dopisuje własne warianty do końca F1, jeśli ma lepsze z rozmów.
- **DOMYŚLNY WYBÓR:** (a).
- **Konsekwencja:** to jedyny blok na home mówiący o kliencie, nie o Klarow; brakował we wszystkich trzech koncepcjach.
- **Kto:** Paweł.

---

## Część B · Wygląd

### D8 · Font

- **Pytanie:** Nunito Sans solo czy para z krojem display?
- **Opcje:** (a) Nunito Sans solo (93 KB, już self-hosted, cyfry tabelaryczne); (b) **Geist w subsetcie latin ≤ 55 KB** jako display obok Nunito (93 + 55 = 148 KB), test na 2 zrzutach hero; (b′) **podmiana** kroju: Geist zamiast Nunito, nie obok; (c) IBM Plex Sans.
- **REKOMENDACJA:** (a) w v1; (b) albo (b′) tylko w fazie 2, jeśli wygra wizualnie i `dist/fonts` ≤ 150 KB. **Uwaga arytmetyczna:** para „Nunito 93 KB + pełny Geist ~70 KB" = ~163 KB i progu 150 KB nigdy nie przejdzie, więc pełnego Geista obok Nunito nie ma w opcjach; do wyboru jest subset albo podmiana. Budżet transferu mobile ≤ 350 KB domyka się tylko z jednym krojem tekstowym.
- **DOMYŚLNY WYBÓR:** (a).
- **Konsekwencja:** `--font-display` = alias `--font-sans`; PDF zostaje na Roboto niezależnie od tej decyzji (ustalenie z oknem c1); ewentualny krój UI w PDF dopiero po (b)/(b′) i dostarczeniu **trzech statycznych TTF: Regular 400, Bold 700, Italic 400** (pdfmake rejestruje sloty `normal/bold/italics/bolditalics`: waga 600 nie zastąpi `bold`, brak zarejestrowanego stylu = wyjątek przy generowaniu PDF; kursywa jest używana w bloku quote). Ta sama trójka w planie §11 faza 2 p. 6 i §12.2.
- **Kto:** Karol.

### D9 · Kolor CTA

- **Pytanie:** jak ma wyglądać jedyny przycisk primary na ekranie?
- **Opcje:** (a) płaski biały: `--cta #FAFAFA`, `--on-cta #121212`, hover `#FFFFFF` + obrys stal; (b) stalowy `#A8B4C2` płaski (jak dziś, ale bez gradientu „metal"); (c) drugi, wysokochromatyczny kolor-sygnał tylko dla CTA.
- **REKOMENDACJA:** (a). Stal nisko-chromatyczna wygląda jak przycisk secondary (kontrast 17:1 dla bieli na czerni); (c) łamie Color Lock i wymaga nowych assetów.
- **DOMYŚLNY WYBÓR:** (a).
- **Konsekwencja:** `.btn-primary` w kicie przepisany; stal zostaje kolorem tożsamości (wordmark, chipy, hairlines, ✓).
- **Kto:** Karol.

### D10 · Dark-only

- **Pytanie:** landing ciemny (jak dziś) czy jasny editorial?
- **Opcje:** (a) dark-only z kompletem tokenów `[data-theme="light"]` w `tokens.css` od dnia 1 (bez przełącznika); (b) jasny landing + przełączenie 12 dashboardów na light (+2–3 dni, ryzyko regresji); (c) przełącznik dark/light na stronie.
- **REKOMENDACJA:** (a). Page Theme Lock wobec 12 ciemnych dashboardów; stal ma 8,9:1 na czerni i 2,1:1 na bieli.
- **DOMYŚLNY WYBÓR:** (a).
- **Konsekwencja:** OG, favicon, 19 prerenderów i wideo pozostają ciemne; light tylko w PDF-preview i brandkicie.
- **Kto:** Karol.

### D11 · Em-dash i półpauza w polszczyźnie

- **Pytanie:** jaka reguła interpunkcji obowiązuje w UI, danych (`toolsSeo.ts` 621 wystąpień „—"), meta i PDF?
- **Opcje:** (a) pełny zakaz „—" i „–" (100 % skill taste); (b) zakaz „—", „–" wyłącznie w zakresach liczbowych („20–250", „5–10 dni"); (c) jak (b), ale „–" dozwolona także jako półpauza w prozie PL, max 1 na akapit.
- **REKOMENDACJA:** (b). Usuwa „LLM tell" i jest mechanicznie audytowalne; zdania przebudowujemy (kropka, dwukropek, przecinek, nawias), nie zamieniamy znaku na dywiz ze spacjami (błąd typografii PL).
- **DOMYŚLNY WYBÓR:** (b).
- **Konsekwencja:** osobny dzień sweepu w F0 z bramką długości title/description; audyt: `fail` na „—", `warn` na „–" poza zakresami. **Zakres sweepu w v1 to 495 z 621 wystąpień „—" w `site/src`**; pozostałe **126** siedzi w plikach, których v1 nie dotyka (umowa z oknem c1): `components/dashboards/**` (102), `components/DemoReport.tsx` (22), `lib/pdf.ts` (2, w tym stopka „dokument DEMO — dane fikcyjne"). Te trzy ścieżki są jawną listą wyłączeń bramki „—" i idą do sweepu dopiero po merge okna c1 (faza 2). Uwaga: każda z opcji (a), (b), (c) zakazuje „—", więc dzień sweepu jest w F0 niezależnie od wyboru; różnią się tylko losem półpauzy „–".
- **Kto:** obaj (Paweł jako właściciel copy).

### D17 · Sekcja „Poza biurem" (gamedev, 3D, motion)

- **Pytanie:** czy na stronie pojawia się rząd kafli spoza ICP (mod Valheim w C#, gra Phaser/Godot, rendery Blender, showreel motion)?
- **Opcje:** (a) osobna, niewielka sekcja „Poza biurem" po zbudowaniu showreela i potwierdzeniu licencji (D20); (b) poza stroną; (c) jedno zdanie w bio Karola.
- **REKOMENDACJA:** (b) do czasu, gdy będzie showreel i decyzja o ofercie motion; ewentualnie (c).
- **DOMYŚLNY WYBÓR:** (b).
- **Konsekwencja:** home ma 9 sekcji w jednym rejestrze (CFO budowlanki); strażnik: kafle na home tylko dla typów pracy kupowalnych przez ICP.
- **Kto:** Karol.

### D18 · Football Intelligence i LootAlert na stronie

- **Pytanie:** czy własne produkty spoza ICP (SaaS analityki sportowej ze Stripe LIVE; aplikacja mobilna Expo + API na Railway, nieopublikowana) pojawiają się na stronie B2B?
- **Opcje:** (a) osobna sekcja „Własne produkty" z neutralnym opisem inżynierskim (bez słów „zakłady/betting", bez nazw scrapowanych serwisów, bez liczb użytkowników); (b) tylko jako jedno zdanie w obszarze „SaaS / mobile" bez nazw; (c) poza stroną.
- **REKOMENDACJA:** (c) w v1. Branża gambling-adjacent (YMYL) i scraping marketplace'ów to sygnały mieszane dla CFO firmy produkcyjnej; strażnik i tak zakazuje kafli spoza ICP na home. Wrócić do tematu po pierwszych pilotach.
- **DOMYŚLNY WYBÓR:** (c).
- **Konsekwencja:** zero wzmianek o Stripe LIVE, płatnych użytkownikach, TestFlight; bez decyzji nie publikujemy żadnych liczb tych produktów.
- **Kto:** Karol.

---

## Część C · Media i zakupy

### D12 · Tło hero: wideo z Higgsfield czy GLSL Hills

- **Pytanie:** co porusza się w hero na desktopie?
- **Opcje:** (a) hero-loop 8–10 s z Higgsfield (Kling 3.0, start = end frame), three.js schodzi z `dependencies` (−118 KB gz na wizytę desktop); (b) GLSL Hills wracają jako tło `/` montowane po idle, tylko `pointer: fine`, z gatingiem `saveData`; wideo po v1; (c) sam poster (statyczny still), zero ruchu w tle.
- **REKOMENDACJA:** (a), ale decyzja zapada **PO trialu** (F1), testem Karola „czy da się poznać, że to AI?" na OLED. Jeśli nie przejdzie: (b). Nigdy oba na jednej trasie.
- **DOMYŚLNY WYBÓR:** (b) (gdy trial nie odbędzie się do końca F1).
- **Konsekwencja:** mobile zawsze poster; GLSL Hills zostają w repo jako wzorzec GPU-higieny; przy (a) `three` i `@react-three/fiber` usunięte.
- **Kto:** Karol (oko marki) z głosem Pawła.

### D13 · Plan Higgsfield i płatnik

- **Pytanie:** jaki plan kupujemy, kto płaci i czy akceptujemy licencję treningową Higgsfield dla abstrakcji?
- **Opcje:** (a) trial 3-dniowy MCP (100 kr, 0 $, karta wymagana, auto-odnowienie do anulowania) → PLUS miesięczny 49 $ (1 000 kr) na finały, anulowany po sprincie; (b) od razu PLUS bez triala; (c) ULTRA 129 $ (3 000 kr); (d) roczny PLUS (468 $/rok) pod stałą produkcję treści; (e) nic z Higgsfield, tylko proceduralnie (Blender / three.js).
- **REKOMENDACJA:** (a). Komplet assetów to ≈ 330–450 kr; ULTRA niepotrzebne przy jednym wideo; plan roczny tylko przy decyzji o stałej produkcji treści do LinkedIn. Konto i faktura na JDG Pawła. Zgoda na licencję treningową wyłącznie dla abstrakcyjnych stilli i pętli (zero zrzutów narzędzi, danych klientów, materiałów firmy źródłowej, twarzy); generacje usuwane z konta po sprincie.
- **DOMYŚLNY WYBÓR:** trial tylko (bez PLUS), czyli dowód stylu bez finałów; przy braku PLUS obowiązuje D12(b).
- **Konsekwencja:** przypomnienie w kalendarzu na dzień 3 triala + `cancel_trial_auto_renewal`; `get_cost: true` przed każdą serią.
- **Kto:** Paweł (płatnik) + Karol (wykonanie w MCP).

### D20 · Licencje Adobe

- **Pytanie:** czy Photoshop 2026 / After Effects 2026 na komputerze Karola są licencjonowane (na pulpicie leżą foldery „+ Crack" starszych wersji)?
- **Opcje:** (a) potwierdzona subskrypcja Creative Cloud → duotone portretów w Photoshop, plugin Higgsfield w AE; (b) brak licencji → duotone przez CSS (`filter` + overlay `--accent`) i stack darmowy (Blender, Remotion, DaVinci); zero oferowania usług motion publicznie.
- **REKOMENDACJA:** potwierdzić (a) lub przyjąć (b); przed jakimkolwiek publicznym ofertowaniem motion licencja jest warunkiem.
- **DOMYŚLNY WYBÓR:** (b).
- **Konsekwencja:** portrety i OG powstają narzędziami bez ryzyka prawnego; sekcja „Poza biurem" (D17) zależy od tej decyzji.
- **Kto:** Karol.

---

## Część D · Konwersja, pomiar, prawo

### D14 · Rezerwacja rozmowy (Cal.com)

- **Pytanie:** jak działa CTA „Umów 30 minut"?
- **Opcje:** (a) konto Cal.com podpięte do kalendarzy founderów, event „Diagnoza automatyzacji: 30 min", link zewnętrzny z `BookingDialog` (0 skryptów, 0 CSP); (b) embed Cal.com na stronie (skrypt zewnętrzny, CSP w `_headers`, wpis w `/rodo`); (c) zostać przy mailto/tel z kalendarzem-protezą (po naprawie bugu daty).
- **REKOMENDACJA:** (a) w v1, (b) w fazie 2.
- **DOMYŚLNY WYBÓR:** (c) do czasu założenia konta (bug daty naprawiony w F0 niezależnie).
- **Konsekwencja:** konwersja twarda mierzalna tylko przy (a)/(b); Cal.com jako procesor w `/rodo`.
- **Kto:** Paweł (konto i link do 2026-09-19).

### D15 · Analityka

- **Pytanie:** czym mierzymy stronę po publikacji?
- **Opcje:** (a) Google Search Console + Cloudflare Web Analytics (cookieless, bez banera) + zdarzenia CTA przez Cloudflare Zaraz albo Pages Function → Workers Analytics Engine; (b) GA4 (cookies, baner, polityka); (c) nic.
- **REKOMENDACJA:** (a). Zero cookies = zero banera i spójność z „zero chmury dostawcy" w narracji.
- **DOMYŚLNY WYBÓR:** (a) bez zdarzeń niestandardowych do czasu potwierdzenia mechanizmu (Zaraz vs Pages Function) i publikacji `/rodo`.
- **Konsekwencja:** Paweł zakłada property GSC (TXT w Cloudflare DNS) i sprawdza w panelu CF, czy Web Analytics ma zdarzenia niestandardowe; UTM w profilach LinkedIn, mailach, QR i promptcie bota od dnia publikacji.
- **Kto:** Paweł.

### D16 · `/rodo`: treść, administrator, radca

- **Pytanie:** kto pisze klauzulę art. 14 RODO + politykę prywatności i kto ją zatwierdza; jakie dane administratora wpisujemy?
- **Opcje:** (a) szkielet od Claude Code (plan §4.6, pełna treść PL + EN) → przegląd founderów → publikacja → przegląd radcy w ciągu 2 tygodni; (b) radca pisze od zera przed publikacją (koszt i czas); (c) founderzy sami, bez radcy.
- **REKOMENDACJA:** (a). Strona jest twardym blokerem outboundu (art. 14, precedens Bisnode 943 470 zł); szkielet z konkretnymi źródłami danych (pracuj.pl, LinkedIn Jobs, KRS, CEIDG, REGON, LinkedIn, strona firmy), z prawem sprzeciwu wyróżnionym odrębnie i mechanizmem `mailto:` jest gotowy do przeglądu; radca poprawia, nie pisze.
- **DOMYŚLNY WYBÓR:** (a); do czasu przeglądu radcy outbound rusza wyłącznie po przeczytaniu `/rodo` przez obu founderów (ryzyko świadome).
- **D16-b · indeksacja `/rodo` (pytanie rozstrzygnięte osobno, bo plan i `synthesis.md` mówiły co innego):** do czasu przeglądu radcy strona ma `<meta name="robots" content="noindex, follow">` i **nie wchodzi do `sitemap.xml`**; jest publiczna, linkowana ze stopki i z szablonów outboundu, co w zupełności wystarcza do art. 14 (przepis wymaga podania informacji, nie zaindeksowania jej w Google). Po przeglądzie radcy jednym commitem: `noindex` zdjęty, trasa w sitemapie z priorytetem 0.3, KPI indeksacji 17/17 → 18/18. Powód: nieprzejrzana przez prawnika klauzula administratora nie powinna być pozycjonowana jako oficjalny dokument firmy. **To jest zmiana wobec wcześniejszej wersji planu** („Indeksowalna, priorytet 0.3"), zgodna z domyślnym wyborem z `synthesis.md` D-21 („szkielet CC, `noindex` do przeglądu"). Jeśli wolicie indeksować od razu, wystarczy napisać `D16-b: indeksuj`.
- **Konsekwencja:** **bez pełnej nazwy JDG, adresu i NIP-u administratora strona nie idzie na produkcję** (DoD F0). Newsletter i formularze tylko z double opt-in i odrębną, niezaznaczoną zgodą (PKE art. 398). Szkielet zawiera obowiązkową sekcję o **zautomatyzowanych decyzjach i profilowaniu** (art. 14 ust. 2 lit. g: prowadzimy research leadów z punktacją firm, więc milczenie o tym byłoby przy kontroli UODO kolejnym zarzutem obok art. 14) oraz jawne wskazanie **przekazywania danych do USA** (Cloudflare, Google, Resend, Cal.com) z podstawą SCC/DPF i sposobem uzyskania kopii zabezpieczeń.
- **Kto:** Paweł (dane JDG do 2026-09-16, radca do 2026-09-30).

---

## Część E · Technika i proces

### D19 · React 19.3 i `<ViewTransition>`: kiedy

- **Pytanie:** kiedy podnosimy React 19.2.7 → 19.3.0 (stable od 2026-09-09; eksportuje `ViewTransition`, `addTransitionType`, `Activity`, zweryfikowane w `node_modules`)?
- **Opcje:** (a) faza 2, po ≥ 2 tygodniach od publikacji v1 i spike'u 0,5 dnia na gałęzi (interakcja z `BrowserRouter`/`Suspense`/`ScrollToTop`); (b) od razu w v1 jako przejścia tras.
- **REKOMENDACJA:** (a). W v1 przejścia tras robi `PageFade` (0 KB ponad Motion, bez exit, zero konfliktu ze `ScrollToTop`).
- **DOMYŚLNY WYBÓR:** (a).
- **Konsekwencja:** reguła strażnika `motion-view-transition-rules` (nigdy `flushSync(navigate)`; VT pod `BrowserRouter` wymaga `useTransitions={false}` lub callbacku czekającego na commit; nigdy VT i Motion na tym samym elemencie).
- **Kto:** Karol.

### D21 · Hooki blokujące w Claude Code

- **Pytanie:** czy zgadzacie się na twardą warstwę egzekwowania w `.claude/settings.json` (nie tylko instrukcje w CLAUDE.md)?
- **Opcje:** (a) tak: `PreToolUse` blokuje odczyt `.env*`, `.dev.vars`, `*.pem`, `credentials*`, `Klucze*`, `leads.json` oraz zapis „nuconic"/`#FFA914`/`import { motion }`/„—" w `data/*.ts` do `site/**`; `PostToolUse` uruchamia `tsc --noEmit` po edycji `.ts/.tsx`; `Stop` odmawia zakończenia przy nieodhaczonym `plan.md`; `SessionStart` wstrzykuje ostatnie wpisy stanu operacyjnego; (b) tylko instrukcje w CLAUDE.md (jak dziś); (c) tylko hook sekretów.
- **REKOMENDACJA:** (a). Dowód: kit łamał własne zasady w 188 miejscach, strona w ~40; reguła bez narzędzia egzekwującego umiera. Do tego restrukturyzacja CLAUDE.md (≤ 200 linii + `docs/plan/stan-operacyjny.md` append-only + `.claude/rules/` ścieżkowe), usunięcie `vercel-optimize` (156 plików, wymaga Vercel CLI), dodanie 4 skilli Vercel do repo (MIT) i oznaczenie `react-view-transitions` jako „REFERENCE ONLY".
- **DOMYŚLNY WYBÓR:** (a).
- **Konsekwencja:** hooki w PowerShell (exec form z `args`, bo ścieżka repo ma `&` i spację); wersjonowane w repo, zero sekretów w `settings.json`.
- **Kto:** obaj (środowisko Pawła musi być identyczne).

### D22 · ESLint i testy jako bramka przed pushem

- **Pytanie:** czy rozszerzamy zasadę #4 CLAUDE.md („tsc + build przed pushem") o `npm run check`?
- **Opcje:** (a) tak: `npm run check` = `tsc --noEmit` → `vite build` + prerender → `node ".claude/skills/klarow-guardian/scripts/verify-site.mjs" --expected 19` → `node ".claude/skills/klarow-guardian/scripts/audit-static.mjs" --fail-on=BLOCKER,HIGH --baseline=".claude/skills/klarow-guardian/baseline/audit-static-2026-09-12.jsonl"` → ESLint (`react-hooks`, `jsx-a11y`) → `node --test` golden-testy 4 silników (2 przebiegi = identyczny JSON); husky `pre-push` bez `npx`; (b) tylko `tsc + build` jak dziś; (c) `check` bez ESLint.
- **REKOMENDACJA:** (a). Determinizm jest obietnicą produktową, więc test „dwa przebiegi = identyczny JSON" należy do definicji gotowości.
- **DOMYŚLNY WYBÓR:** (a).
- **Konsekwencja:** ~30 s dłuższy push; istniejący dług w `.claude/skills/klarow-guardian/baseline/audit-static-2026-09-12.jsonl` nie blokuje, nowe BLOCKER/HIGH blokują. Używamy **istniejących** skryptów strażnika pod ich nazwami: nie powstaje ani druga kopia `verify-site.mjs` w `site/scripts/`, ani `audit-ui.mjs`, ani katalog `audit/` (raport zbiorczy `audit/INDEX.md` generuje workflow `ui-audit` z tych samych skryptów).
- **Kto:** Karol.

### D24 · `cssTarget safari13` w `vite.config.ts`

- **Pytanie:** utrzymać cel Safari 13 (hex + jawne tokeny alfa, bez `toSorted`, `color-mix`, `oklch`, `bg-accent/12`) czy podnieść do iOS 16.4+ / `es2020`?
- **Opcje:** (a) utrzymać w v1; (b) podnieść teraz.
- **REKOMENDACJA:** (a) w v1 (iPhone Karola ma iOS 26, a bug mobile był w stacking-context, nie w składni; podniesienie celu = osobna rozmowa po publikacji).
- **DOMYŚLNY WYBÓR:** (a).
- **Konsekwencja:** `tokens.css` w hex/rgb z tokenami alfa; poprawiony nieprawdziwy komentarz o Lightning CSS w `vite.config.ts:16-23`.
- **Kto:** Karol.

---

## Tabela przejścia numeracji: `synthesis.md` / skill strażnika `D-xx` → ten dokument `Dxx`

> **Dlaczego to tu jest:** ten plik przenumerował decyzje z `D-01…D-23` (numeracja z `synthesis.md` §4) na `D1…D24` i **zmienił mapowanie**, a w gotowym skillu `.claude/skills/klarow-guardian/**` jest ~263 odwołań do starych ID (m.in. `rules/code-build-target-policy.md`, `rules/integ-embed-requires-privacy.md`, `rules/code-no-dead-code.md`). Bez tej tabeli każde odwołanie w regule strażnika wskazuje inną decyzję niż ten dokument. **Zadanie F0 (ten sam commit co `docs/DECISIONS.md`):** `grep -rn "D-[0-9]" .claude/skills/klarow-guardian` → podmiana ID wg tej tabeli → `node .claude/skills/klarow-guardian/scripts/build-index.mjs`.

| `synthesis.md` / skill | Temat | Ten dokument |
|---|---|---|
| D-01 | jedno zdanie marki (H1 = LinkedIn = bot) | **D1** |
| D-02 | Excel: symptom czy tożsamość | **D2** |
| D-03 | zakres obietnicy „w dni" + `delivery` per karta | **D3** |
| D-04 | „zero chmury" i bullet asystenta AI w KSeF | **D4** |
| D-05 | sekcja founderów i publiczna obecność Karola | **D6** |
| D-06 | typografia (Nunito solo vs para z display) | **D8** |
| D-07 | liczby poprzedniej firmy przed umową IP | **D7** (numer bez zmian) |
| D-08 | tło hero: Higgsfield vs GLSL Hills | **D12** |
| D-09 | em-dash i półpauza | **D11** |
| D-10 | etykieta KSeF | **D5** |
| D-11 | sformułowania sekcji „Co osiągniesz" | **D23** |
| D-12 | struktura portfolio i nazwa zakładki | wchłonięte do planu §2.4 i §3 S3 (bez osobnej decyzji) |
| D-13 | home linkuje do 4 realizacji + huba | wchłonięte do planu §3 S3 (bez osobnej decyzji) |
| D-14 | kalkulator „ile dni zajmie pilot" | odrzucone (`synthesis.md` §1.6); poza stroną |
| D-15 | rezerwacja rozmowy (Cal.com) | **D14** |
| D-16 | analityka i pomiar | **D15** |
| D-17 | plan Higgsfield i płatnik | **D13** |
| D-18 | React 19.3 i `<ViewTransition>` | **D19** |
| D-19 | `cssTarget safari13` | **D24** |
| D-20 | EN: przełącznik vs trasy `/en/` | odroczone (plan §2.1, §9.3; bez osobnej decyzji) |
| D-21 | polityka prywatności: kto pisze, `noindex` do przeglądu | **D16** (+ **D16-b** o indeksacji) |
| D-22 | produkty i tematy spoza ICP na stronie | **D17** (gamedev/3D/motion) i **D18** (produkty własne spoza ICP) |
| D-23 | hooki blokujące + `npm run check` + restrukturyzacja CLAUDE.md | **D21** (hooki) i **D22** (`npm run check`) |
| brak | kolor CTA | **D9** (nowa, nie ma odpowiednika w `synthesis.md`) |
| brak | dark-only vs jasny landing | **D10** (nowa, nie ma odpowiednika w `synthesis.md`) |

---

## Część F · Fakty do dostarczenia (nie decyzje, ale blokują)

| # | Fakt | Kto | Do kiedy | Co odblokowuje |
|---|---|---|---|---|
| F1 | Czy repo `github.com/przeczkowskyy/Pawel_Karol_proj` jest prywatne? Jeśli publiczne: `docs/nuconic-ekosystem-referencja.md` i CLAUDE.md łamią zasadę #3 → repo prywatne albo `docs/` do osobnego prywatnego repo | Paweł | przed F0 (2026-09-16) | całą przebudowę bez ryzyka prawnego |
| F2 | Pełne dane administratora (nazwa JDG, adres, NIP) do `/rodo` | Paweł | 2026-09-16 | publikację F0 i outbound |
| F3 | Status rozmów o umowie IP / zgodzie na case z poprzednią firmą | Paweł | informacja do 2026-09-16; podpis: cel 2026-10-15 | D7: „15 narzędzi", karty case, zrzuty |
| F4 | Portfolio Pawła: **nazwisko** (w całym planie Paweł występuje bez nazwiska, a S8 wymaga „imię i nazwisko 700" dla obu founderów), lista projektów i ról, 1 zdanie bio, zdjęcie | Paweł | 2026-09-19 (koniec F1) | sekcję S8 z dwoma founderami; bez nazwiska karta Pawła może pójść tylko w wariancie D6(b), czyli tym samym, który dziś przewidujemy dla Karola |
| F5 | Potwierdzenie rotacji klucza Anthropic z appki KSeF (poza repo) i przeniesienia plików z kluczami z OneDrive/Desktop do Menedżera poświadczeń | Karol | przed F0 | reguła `secret-rotate-on-exposure` w strażniku |
| F6 | Potwierdzenie zakresu liczby **„3 dni od pierwszej linii kodu do działającego produktu"**: co dokładnie znaczy „działający produkt" (tryb mock? połączenie z `api-demo.ksef.mf.gov.pl`?). W rejestrze `references/allowed-numbers.md` §1 liczba ma status **DO POTWIERDZENIA**, a mimo to wchodzi na pasek „W liczbach" na `/` | Karol | przed F2 | 4. pozycję paska S5; bez potwierdzenia pasek ma 3 pozycje, nie 4 |

---

## Podsumowanie domyślnych wyborów (jeśli do 2026-09-16 nie będzie odpowiedzi)

| ID | Domyślnie | ID | Domyślnie |
|---|---|---|---|
| D1 | pełne V1 w H1, LinkedIn i bocie | D13 | trial Higgsfield bez PLUS → tło = GLSL Hills |
| D2 | Excel jako symptom; hak zostaje w ofercie i outboundzie | D14 | mailto/tel do czasu konta Cal.com |
| D3 | „pierwszy działający efekt w dni" + `delivery` per karta | D15 | GSC + CF Web Analytics, zdarzenia po `/rodo` |
| D4 | „zero chmury dostawcy", bullet AI usunięty | D16 | szkielet `/rodo` od CC, przegląd founderów, radca w 2 tygodnie |
| D5 | KSeF = „Własny produkt" | D17 | „Poza biurem" poza stroną |
| D6 | Paweł pełnie, Karol imię + rola + inicjał „K" | D18 | Football Intelligence i LootAlert poza stroną |
| D7 | liczby zamrożone w opisach, home tylko liczby własne, „kilkanaście" | D19 | React 19.3 w fazie 2 |
| D8 | Nunito Sans solo | D20 | duotone przez CSS, bez oferowania motion |
| D9 | CTA biały płaski | D21 | hooki blokujące + restrukturyzacja CLAUDE.md |
| D10 | dark-only, light-ready w tokenach | D22 | `npm run check` jako bramka przed pushem |
| D11 | zakaz „—", „–" tylko w zakresach liczbowych | D23 | 4 efekty „Co osiągniesz" dosłownie |
| D12 | GLSL Hills po idle (wideo po trialu i akceptacji) | D24 | `safari13` zostaje w v1 |
| D16-b | `/rodo` z `noindex` i poza sitemapą do przeglądu radcy | | |

Po spotkaniu: wynik do `docs/DECISIONS.md` (wpis z datą, ID, wyborem i jednym zdaniem uzasadnienia), podmiana starych ID `D-xx` w `.claude/skills/klarow-guardian/**` wg tabeli przejścia numeracji (+ `node .claude/skills/klarow-guardian/scripts/build-index.mjs`), start F0 wg `strona-v2-plan.md` §11.
