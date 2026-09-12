# Decyzje founderów przed F1: klarow.com v2

> Data: 2026-09-12 · Dla: Paweł + Karol · Plan, którego dotyczą: `docs/plan/strona-v2-plan.md`
> **Termin odpowiedzi: 2026-09-16 (środa), 18:00.** Bez odpowiedzi obowiązuje „Domyślny wybór" i F0 rusza 2026-09-17. Odpowiedź może być jednym mailem lub wiadomością w formacie `D3: b` (litera opcji), z uwagami tam, gdzie chcecie inaczej. Claude Code przepisuje wynik do `docs/DECISIONS.md` (append-only) przed pierwszą edycją kodu, w tym samym commicie podmieniając stare ID `D-xx` w skillu strażnika wg **tabeli przejścia numeracji** (przed częścią F).
> **Korekta 2026-09-12 (reframe).** Po dyrektywie founderów (brak zarejestrowanej działalności i NIP; strona jest wizytówką i CV dwóch osób z naciskiem na pokazanie narzędzi) doszła **część G z decyzjami D25–D35**, a sześć wcześniejszych decyzji zmieniło treść: **D6, D12, D13, D14, D15, D16**. Uzasadnienie i rozstrzygnięcie sprzecznych propozycji: `docs/plan/reframe-2026-09-12.md`.
> **Korekta korekty 2026-09-12 (wieczór): wideo wraca do v1 decyzją Karola** („zależy mi na efekcie wow i animacyjnym"). Doszła **część H z decyzjami D36–D38**, a cztery decyzje zmieniły treść: **D12, D13, D28, D35**. Scenorys, budżety, koszt i procedura zakupu: `docs/plan/warstwa-wrazenia.md`.
> Numeracja: ten dokument używa `D1…D35`; `synthesis.md` i reguły w `.claude/skills/klarow-guardian/**` używają starszej `D-01…D-23` z INNYM mapowaniem. Przy czytaniu reguły strażnika sprawdzaj ID w tabeli przejścia, nie „na oko".
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
- **ZMIANA 2026-09-12 (rozszerzenie):** sekcja awansuje z pozycji 8 na **6** (D32) i rośnie. Bez zarejestrowanego podmiotu CV tworzą ludzie i ich artefakty, więc bio zawiera **przypisanie autorstwa**: Karol „Buduje narzędzia i integracje. Dwanaście dem na tej stronie i produkt na KSeF."; Paweł „Powadzi diagnozę procesu i odbiór wdrożenia. Ustala zakres, zanim powstanie pierwsza linia kodu." (dotychczasowe „prowadzi wdrożenia i rozmowy z klientami" jest wycofane: liczba mnoga „klienci" przy zerze płatnych klientów łamie `brand-honest-labels`). Nagłówek sekcji: „Rozmawiasz z osobą, która to zbudowała." (zamiast „… która narzędzie zbudowała", bo pokazujemy trzynaście pozycji). Wariant D6(b) nadal dopuszczalny.
- **Konsekwencja:** kanał LinkedIn (rdzeń outboundu) ląduje na stronie z twarzą co najmniej jednego foundera; przy (a) potrzebne 2 zdjęcia (neutralne tło, jedno światło) + 2 zdania bio do końca F1. Nigdy stock, nigdy placeholder. **Uwaga po D25:** jeśli administratorem danych jest Paweł, jego nazwisko stoi w `/rodo`, więc fakt F4 blokuje publikację całej strony, nie tylko tę sekcję.
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
- **ZMIANA 2026-09-12 (rano): ani (a), ani (b).** W hero stoi **kadr prawdziwego pulpitu produkcji** (D28): WebP ≤ 110 KB desktop, ≤ 55 KB mobile, zrobiony Playwrightem za 0 kr, deterministyczny.
- **ZMIANA 2026-09-12 (wieczór, D37): kadr zostaje, ale rusza.** W hero na desktopie gra **nagranie tego samego pulpitu** (8 s, jedno odtworzenie, bez pętli), a kadr jest jego klatką zero i nadal jest LCP. **Wariant (a) pozostaje odrzucony**: abstrakcyjna pętla zajęłaby jedyny slot autoodtwarzania na `/` i zabrałaby hero dowód. GLSL Hills schodzą z `/` w F0 i **nie wracają** (jedno ruchome tło na trasę jest zajęte); `three` i `@react-three/fiber` wypadają z `dependencies`.
- **DOMYŚLNY WYBÓR:** kadr produktu, który po sekundzie ożywa (patrz D28 i D37).
- **Konsekwencja:** na `/` jest ≤ 1 autoodtwarzane `<video>` (tylko `pointer: fine`, po `window.load`), na 18 pozostałych trasach 0; zero wideo i zero WebGL na telefonie; reguły `media-*` obowiązują **wprost od F1**.
- **Kto:** Karol (oko marki) z głosem Pawła.

### D13 · Plan Higgsfield i płatnik

- **Pytanie:** jaki plan kupujemy, kto płaci i czy akceptujemy licencję treningową Higgsfield dla abstrakcji?
- **Opcje:** (a) trial 3-dniowy MCP (100 kr, 0 $, karta wymagana, auto-odnowienie do anulowania) → PLUS miesięczny 49 $ (1 000 kr) na finały, anulowany po sprincie; (b) od razu PLUS bez triala; (c) ULTRA 129 $ (3 000 kr); (d) roczny PLUS (468 $/rok) pod stałą produkcję treści; (e) nic z Higgsfield, tylko proceduralnie (Blender / three.js).
- **ZMIANA 2026-09-12 (rano): (e) w v1, czyli nie kupujemy nic.**
- **ZMIANA 2026-09-12 (wieczór, D36): (a), ale wąsko i dwuetapowo.** Zakres potrzebny **stronie** (grunt hero, master still, tło OG ≈ 56 kredytów) mieści się w **bezpłatnym trialu 3-dniowym** (100 kr, **0 USD**, karta wymagana, auto-odnowienie), więc publikacja nie zależy od żadnej płatności. **PLUS 49 USD + VAT** jest potrzebny wyłącznie na **pętlę na LinkedIn, która nie trafia na stronę** (H4, ≈ 166 kr): to osobna decyzja, nieblokująca. ULTRA (c) i plan roczny (d) odpadają przy tym zakresie.
- **Gdy jakikolwiek zakup narzędziowy będzie potrzebny** (Cal.com, subskrypcja, w fazie 2 Higgsfield), obowiązuje procedura z planu §7.2: konto i **karta prywatna administratora danych** (D25), faktura na osobę fizyczną, koszt sprzed rejestracji traktowany jako **nieodliczalny**, zero korekt danych nabywcy wstecz, po rejestracji zmiana danych rozliczeniowych na istniejącym koncie (nie drugie konto), prawa komercyjne potwierdzone na planie, z którego powstał finał, wpis do `site/media/SOURCES.md`. Zaleta uboczna zakupu prywatnego: brak obowiązku rejestracji VAT-UE i rozliczenia importu usług. **Ostrzeżenie:** karta prywatna plus auto-odnowienie plus brak firmowej kontroli kosztów to klasyczny sposób na „49 $ przez pół roku"; przypomnienia w kalendarzu na dzień 3 triala i dzień 27 pierwszego miesiąca planu płatnego.
- **DOMYŚLNY WYBÓR:** trial (0 USD) na zakres strony; decyzja o PLUS 49 USD podejmowana osobno, po obejrzeniu materiału.
- **Konsekwencja:** **dwa** przypomnienia w kalendarzu ustawione **przed** klikiem trialu (dzień 3: `cancel_trial_auto_renewal` → `confirm_trial_cancel`; dzień 27 pierwszego płatnego miesiąca), `get_cost: true` przed każdą serią, usunięcie generacji z konta po sprincie. **Agent nie uruchamia trialu ani zakupu**: przygotowuje gotowy do wykonania krok i czeka (procedura: `warstwa-wrazenia.md` §7).
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
- **Konsekwencja:** konwersja twarda mierzalna tylko przy (a)/(b); Cal.com jako procesor w `/rodo`. **ZMIANA 2026-09-12:** konto zakłada **administrator danych jako osoba fizyczna** (D25), na ten sam adres `kontakt@klarow.com`; umowę powierzenia (DPA) można zawrzeć bez NIP-u; właściciel konta wpisany do nowej kolumny „właściciel konta" w `references/integrations-registry.md`.
- **Kto:** Paweł (konto i link do 2026-09-19).

### D15 · Analityka

- **Pytanie:** czym mierzymy stronę po publikacji?
- **Opcje:** (a) Google Search Console + Cloudflare Web Analytics (cookieless, bez banera) + zdarzenia CTA przez Cloudflare Zaraz albo Pages Function → Workers Analytics Engine; (b) GA4 (cookies, baner, polityka); (c) nic.
- **REKOMENDACJA:** (a). Zero cookies = zero banera i spójność z „zero chmury dostawcy" w narracji.
- **DOMYŚLNY WYBÓR:** (a) bez zdarzeń niestandardowych do czasu potwierdzenia mechanizmu (Zaraz vs Pages Function) i publikacji `/rodo`.
- **Konsekwencja:** Paweł zakłada property GSC (TXT w Cloudflare DNS) i sprawdza w panelu CF, czy Web Analytics ma zdarzenia niestandardowe; UTM w profilach LinkedIn, mailach, QR i promptcie bota od dnia publikacji. **ZMIANA 2026-09-12:** właścicielem kont GSC i Cloudflare jest **administrator danych jako osoba fizyczna** (D25), wpisany do kolumny „właściciel konta" w rejestrze integracji. Do listy zdarzeń dochodzą `demo_own_file` i `wall_open_tool`; **żadne zdarzenie nie niesie nazwy ani treści pliku wgranego przez użytkownika**.
- **Kto:** Paweł.

### D16 · `/rodo`: treść, administrator, radca

- **Pytanie:** kto pisze klauzulę art. 14 RODO + politykę prywatności i kto ją zatwierdza; jakie dane administratora wpisujemy?
- **Opcje:** (a) szkielet od Claude Code (plan §4.6, pełna treść PL + EN) → przegląd founderów → publikacja → przegląd radcy w ciągu 2 tygodni; (b) radca pisze od zera przed publikacją (koszt i czas); (c) founderzy sami, bez radcy.
- **REKOMENDACJA:** (a). Strona jest twardym blokerem outboundu (art. 14, precedens Bisnode 943 470 zł); szkielet z konkretnymi źródłami danych (pracuj.pl, LinkedIn Jobs, KRS, CEIDG, REGON, LinkedIn, strona firmy), z prawem sprzeciwu wyróżnionym odrębnie i mechanizmem `mailto:` jest gotowy do przeglądu; radca poprawia, nie pisze.
- **DOMYŚLNY WYBÓR:** (a); do czasu przeglądu radcy outbound rusza wyłącznie po przeczytaniu `/rodo` przez obu founderów (ryzyko świadome).
- **D16-b · indeksacja `/rodo` (pytanie rozstrzygnięte osobno, bo plan i `synthesis.md` mówiły co innego):** do czasu przeglądu radcy strona ma `<meta name="robots" content="noindex, follow">` i **nie wchodzi do `sitemap.xml`**; jest publiczna, linkowana ze stopki i z szablonów outboundu, co w zupełności wystarcza do art. 14 (przepis wymaga podania informacji, nie zaindeksowania jej w Google). Po przeglądzie radcy jednym commitem: `noindex` zdjęty, trasa w sitemapie z priorytetem 0.3, KPI indeksacji 17/17 → 18/18. Powód: nieprzejrzana przez prawnika klauzula administratora nie powinna być pozycjonowana jako oficjalny dokument firmy. **To jest zmiana wobec wcześniejszej wersji planu** („Indeksowalna, priorytet 0.3"), zgodna z domyślnym wyborem z `synthesis.md` D-21 („szkielet CC, `noindex` do przeglądu"). Jeśli wolicie indeksować od razu, wystarczy napisać `D16-b: indeksuj`.
- **ZMIANA 2026-09-12: dwie bramki zamiast jednej.** **Publikacja** wymaga wyłącznie tożsamości administratora (`SITE_PUBLISHABLE`: imię i nazwisko albo nazwa podmiotu + kanał kontaktu, zero markerów `[DECYZJA FOUNDERÓW: …]` w `dist/rodo.html`, kompletne sekcje o serwisie, strona nic nie zbiera). **Outbound** wymaga dodatkowo `OUTREACH_READY` (adres albo zdanie zastępcze, komplet art. 14 z podstawą transferu rozstrzygniętą per dostawca, zgody PKE w `data/consent.ts`, rejestry zgód i sprzeciwów poza repo, datowany wpis w `docs/DECISIONS.md`). **Rejestracja działalności i NIP nie są warunkiem żadnej z tych bramek**; są warunkiem pierwszej faktury (`CONTRACT_READY`). Okres przechowywania ujednolicony na **12 miesięcy od ostatniego kontaktu** (plan §4.6 pkt 5 i reguła `legal-rodo-page-required` pkt 6 miały różne wartości). Wybór administratora: D25; adres: D26.
- **Konsekwencja:** stara formuła „bez pełnej nazwy JDG, adresu i NIP-u strona nie idzie na produkcję" jest **wycofana**. Newsletter i formularze tylko z double opt-in i odrębną, niezaznaczoną zgodą (PKE art. 398). Szkielet zawiera obowiązkową sekcję o **zautomatyzowanych decyzjach i profilowaniu** (art. 14 ust. 2 lit. g: prowadzimy research leadów z punktacją firm, więc milczenie o tym byłoby przy kontroli UODO kolejnym zarzutem obok art. 14) oraz jawne wskazanie **przekazywania danych do USA** (Cloudflare, Google, Resend, Cal.com) z podstawą SCC/DPF i sposobem uzyskania kopii zabezpieczeń.
- **Kto:** Paweł (tożsamość administratora do 2026-09-16, radca do 2026-09-30).

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

## Część G · Korekta 2026-09-12: brak działalności i nacisk na narzędzia (D25–D35)

> Powstała po dyrektywie founderów z 2026-09-12. Trzy równoległe propozycje (prawo, kompozycja „wow", inwentarz narzędzi) używały tych samych numerów D25–D28 dla różnych rzeczy; ta część nadaje im jedną, rozłączną numerację. Rozstrzygnięcia sprzeczności są opisane w `docs/plan/reframe-2026-09-12.md`.

### D25 · Kto jest administratorem danych

- **Pytanie:** kto figuruje w `/rodo` jako administrator, skoro nie ma zarejestrowanej działalności?
- **Opcje:** (a) Paweł jako jedyny administrator, Karol upoważniony na piśmie (art. 29 RODO); (b) Karol jako jedyny administrator; (c) obaj jako współadministratorzy (art. 26: uzgodnienia plus obowiązek opublikowania ich zasadniczej treści w `/rodo`).
- **REKOMENDACJA:** (a). Administratorem może być osoba fizyczna (art. 4 pkt 7 RODO nie wymaga rejestracji, NIP-u ani REGON-u). Wskazanie jednego administratora unika współadministrowania; Paweł prowadzi outbound, a Karol ma zbieg z etatem.
- **DOMYŚLNY WYBÓR:** (a).
- **Konsekwencja:** imię i nazwisko administratora są publiczne w `/rodo`; skrzynkę `kontakt@`, bazę leadów oraz konta Cloudflare, GSC i Cal.com prowadzi ta sama osoba; przy administratorze Karolu wariant D6(b) „bez nazwiska" przestaje działać, bo nazwisko i tak stoi w klauzuli.
- **Kto:** obaj; do 2026-09-16 (fakt F2).

### D26 · Adres do korespondencji administratora

- **Pytanie:** jaki adres podajemy w klauzuli, żeby nie publikować adresu zamieszkania?
- **Opcje:** (a) skrytka pocztowa Poczty Polskiej (umowa z osobą fizyczną, kilkadziesiąt złotych rocznie); (b) adres do doręczeń u znajomego przedsiębiorcy za pisemną zgodą; (c) adres zamieszkania; (d) brak adresu w treści plus zdanie „Adres do korespondencji podajemy na żądanie wysłane na kontakt@klarow.com".
- **REKOMENDACJA:** (d) na czas publikacji portfolio, (a) przed pierwszym kontaktem handlowym. Wariant (c) jest legalny i najprostszy, ale publikuje adres domowy w dokumencie, który zostaje w archiwach.
- **DOMYŚLNY WYBÓR:** (d) do publikacji, (a) przed outboundem.
- **Konsekwencja:** `address` w `CONTROLLER` pusty renderuje zdanie zastępcze; uzupełnienie adresu to jedno pole i jeden commit. **Do potwierdzenia u radcy:** czy zdanie zastępcze wystarcza w klauzuli art. 14.
- **Kto:** Paweł.

### D27 · Zakupy i konta bez firmy

- **Pytanie:** na kogo kupujemy narzędzia (Cal.com, w fazie 2 Higgsfield) i co z kosztem sprzed rejestracji?
- **Opcje:** (a) karta prywatna administratora, faktura na osobę fizyczną, koszt traktowany jako nieodliczalny, zero korekt wstecz; (b) czekamy z każdym zakupem do rejestracji; (c) zakup na kogoś trzeciego.
- **REKOMENDACJA:** (a). Przy kwotach rzędu 49 $ różnica podatkowa nie uzasadnia naginania; zakup prywatny zdejmuje też obowiązek rejestracji VAT-UE i rozliczenia importu usług. (c) odpada: po rejestracji trzeba by przenosić licencje i umowy powierzenia.
- **DOMYŚLNY WYBÓR:** (a).
- **Konsekwencja:** właściciel każdego konta = administrator z `CONTROLLER`, wpisany do kolumny „właściciel konta" w `references/integrations-registry.md`; po rejestracji zmieniamy dane rozliczeniowe na istniejącym koncie. Warunek użycia assetu na stronie: potwierdzone prawa komercyjne na planie, z którego powstał finał. Do potwierdzenia z księgową.
- **Kto:** Paweł (płatnik) + Karol (wykonanie).

### D28 · Wizual hero: kadr produktu zamiast pętli generatywnej

- **Pytanie:** co stoi w hero, skoro wideo z Higgsfield wypada?
- **Opcje:** (a) kadr prawdziwego dashboardu (`ProductionDashboard`, Playwright, 0 kr, deterministyczny, WebP ≤ 110 KB / ≤ 55 KB); (b) GLSL Hills po idle; (c) sam gradient bez obrazu.
- **REKOMENDACJA:** (a). Sędzia marki odrzucił abstrakcyjną stal mechanizmem „tekst plus gradient to nie jest hero"; kadr produktu jest jedynym wizualem, który w tej samej sekundzie mówi „co robimy", „dla kogo" i „na jakim poziomie wykonania", a przy okazji zdejmuje zależność od faktury i od trialu.
- **DOMYŚLNY WYBÓR:** (a).
- **ZMIANA 2026-09-12 (wieczór, D37):** wybór (a) **zostaje** (kadr `ProductionDashboard`, ten sam plik, ten sam budżet, ten sam LCP), ale kadr jest **klatką zero nagrania** tego dashboardu i po `window.load` przechodzi w ruch na desktopie.
- **Konsekwencja (zaktualizowana):** `HeroMedia` i `MediaBoundary` **powstają** w F2; `three` i `@react-three/fiber` nadal wypadają z zależności; kadr nadal jest elementem LCP (bramka elementowa, nie tylko czasowa); reguła `design-hero-discipline` dostaje wariant B rozmieszczenia media (kadr w kolumnach 7–12, przycięcie layoutem, tekst na `--background` bez overlayu) z dopiskiem, że **media hero mogą nieść nagranie prawdziwego narzędzia**, a przycisk pauzy nie liczy się do czterech elementów hero, ale musi być recesywny i w obrębie ramy kadru.
- **Kto:** Karol (oko marki).

### D29 · Żywe demo na stronie głównej

- **Pytanie:** czy `/` dostaje działający `DemoReport` bezpośrednio pod hero, z możliwością wgrania własnego pliku?
- **Opcje:** (a) tak, sekcja S2 „Sprawdź to na swoim pliku", montaż lazy poniżej zgięcia; (b) nie, dowód zostaje na podstronach.
- **REKOMENDACJA:** (a). To jedyne miejsce, w którym obietnica „dane zostają u Ciebie" przestaje być zdaniem i staje się demonstracją, a KPI „≥ 30 % wizyt z interakcją" przestaje być mierzalne wyłącznie na podstronach.
- **DOMYŚLNY WYBÓR:** (a).
- **Konsekwencja:** nowy komponent `DemoFrame` (opakowuje `DemoReport`, nie edytuje go: §12.1); budżet `homeLazyGz ≤ 45 KB gz` poza `modulepreload`; **obowiązkowa bramka „zero requestów sieciowych po wgraniu pliku"** (`check-client-only.mjs`, nowa reguła `demo-client-side-only-claim`): bez zielonego testu zdanie „nie wychodzi z przeglądarki" nie wchodzi na stronę. Awaryjny wyłącznik: `DemoFrame` zostaje przy zrzucie i linku do podstrony.
- **Kto:** obaj (ryzyko INP na telefonie mierzymy w F4).

### D30 · Pasek „W liczbach" jako sekcja home

- **Pytanie:** zostawiamy pasek czterech wielkich liczb?
- **Opcje:** (a) usunąć; (b) zostawić w wersji trzypozycyjnej; (c) zostawić w pełnej czwórce.
- **REKOMENDACJA:** (a). Z czterech pozycji dwie są słowami („kilkanaście", „co do grosza"), jedna jest zablokowana umową IP, a jedna ma w rejestrze status DO POTWIERDZENIA, więc pasek startowo miałby trzy pozycje, w tym dwie słowne. Licznik jadący od zera przy zerowym portfolio klienckim to ten sam rodzaj teatru, który Karol kasował dwa razy.
- **DOMYŚLNY WYBÓR:** (a).
- **Konsekwencja:** „13" i „12" wchodzą do podpisu ściany narzędzi (użytkownik widzi ich pokrycie w tej samej sekundzie, bo może policzyć kafle), „co do grosza" zostaje w kolumnie ✓ sekcji „Kalkulator, nie wróżka"; komponenty `MetricsStrip` i `Counter` tracą konsumenta i wypadają z v1.
- **Kto:** obaj.

### D31 · Etykiety: „Narzędzia" zamiast „Realizacji"

- **Pytanie:** jak nazywamy zakładkę, sekcję dowodu i CTA wtórne?
- **Opcje:** (a) nav „Narzędzia" / „Tools", H2 na `/` „Co zbudowaliśmy" / „What we've built", H1 hubu „Narzędzia, które zbudowaliśmy" / „Tools we have built", `cta.secondary` „Zobacz narzędzia" / „See the tools"; (b) wszędzie „Narzędzia i dema" / „Tools and demos"; (c) bez zmian: „Realizacje i dema".
- **REKOMENDACJA:** (a). „Realizacja" w polszczyźnie biznesowej znaczy „zlecenie wykonane dla klienta", a klientów jest zero: to nadinterpretacja na granicy `brand-honest-labels`. Wariant (a) łączy dwie propozycje: mocniejszy głos („Co zbudowaliśmy") stoi na `/`, a słowo kluczowe zgodne z URL `/narzedzia` zostaje w H1 hubu, więc nie tracimy pozycjonowania i nie duplikujemy nagłówka między trasami.
- **DOMYŚLNY WYBÓR:** (a).
- **Konsekwencja:** podmiana w `messaging.ts` (`toolsLabel`, `builtLabel`, `cta.secondary`) propaguje się na hero, nawigację, stopkę, okruszek podstrony, `llms.txt` i prompt bota; aliasy `/realizacje` i `/realizacje/*` w `_redirects` **zostają** (adresy z wizytówek i starych linków muszą działać).
- **Kto:** Paweł (głos sprzedaży) z Karolem.

### D32 · Nowa kolejność sekcji strony głównej

- **Pytanie:** w jakiej kolejności stoi dziewięć sekcji `/`?
- **Opcje:** (a) hero · żywe demo · ściana 13 · co budujemy · co osiągniesz · ludzie · kalkulator nie wróżka · jak pracujemy · zamknięcie; (b) kolejność z wersji porannej (hero · co budujemy · dowód · co osiągniesz · liczby · jak pracujemy · kalkulator · ludzie · zamknięcie).
- **REKOMENDACJA:** (a). Dowód wchodzi na pozycję 2, warstwa sprzedażowa schodzi bliżej końca (dyrektywa: strona jest wizytówką, nie lejkiem), a sekcja o ludziach awansuje z 8 na 6, bo bez podmiotu CV tworzą ludzie i ich artefakty.
- **DOMYŚLNY WYBÓR:** (a).
- **Konsekwencja:** 9 sekcji i 9 rodzin layoutu bez zmian, eyebrow nadal 0; kotwica reguły `copy-persona-outcomes-section` przenosi się na „bezpośrednio po bloku dowodu i przed sekcją o ludziach"; kolejność pracy w F2 idzie tą samą listą.
- **Kto:** Karol (kompozycja) z Pawłem.

### D33 · Jak pokazujemy trzynaście narzędzi na `/`

- **Pytanie:** cztery duże ramy czy cała ściana?
- **Opcje:** (a) jeden featured (KSeF) plus 12 kafli, wszystkie jako prawdziwe zrzuty w jednym kadrowaniu 16:10, siatka gapless z hairline; (b) cztery ramy jak w wersji porannej; (c) trzynaście równych miniatur bez hierarchii.
- **REKOMENDACJA:** (a). Cztery ramy pokazują próbkę, trzynaście kafli pokazuje warsztat, a featured daje hierarchię, której brakuje wariantowi (c). Cała ściana waży 480 KB i jest w całości `lazy`, czyli i tak mniej niż usunięte wideo.
- **DOMYŚLNY WYBÓR:** (a).
- **Konsekwencja i warunek:** trzynaście dashboardów dzieli ten sam kit, więc bez pracy nad kadrem wyjdzie „jeden ciemny prostokąt powielony trzynaście razy". Dlatego kadr `clip` dobiera się **per pozycja pod typ obrazu** (wykres, macierz, Gantt, kafle, dokument, diagram, badge PASS z linią dowodu sumy), a przegląd kontaktu zbiorczego (`shoot-tools.mjs --contact-sheet`) jest obowiązkowym punktem przed zamknięciem F3. Bliźniacze kadry poprawiamy zmianą sceny, nigdy filtrem graficznym. Kolejność kafli = pole `order` w `tools.ts`. **Pytanie zamknięte przy okazji:** wcześniejszy spór o „czwartą ramę" (audyt jakości kontra import z rekoncyliacją) znika, bo obie pozycje są na ścianie; z rekoncyliacji bierzemy natomiast kadr z badge PASS, bo to jedyny obraz na witrynie mówiący „sprawdź nas".
- **Kto:** Karol (przegląd kadrów po F1).

### D34 · Mapa integracji na stronie

- **Pytanie:** czy dokładamy schemat „z czym się spinamy" (KSeF, ERP, magazyn, pliki Excel, poczta, podpis elektroniczny, rejestry publiczne)?
- **Opcje:** (a) tak, wyłącznie jako deklaracja **umiejętności** („budujemy integracje z…"), nigdy jako „wdrożyliśmy u klienta", brzmienie zatwierdzone przez founderów przed F3; (b) nie do umowy IP.
- **REKOMENDACJA:** (a). SVG na tokenach, ta sama rodzina co `KsefFlow`, 0,5–1 dnia, zero kredytów. Granica jest ostra: lista integracji opisuje pracę wykonaną wcześniej, więc bez umowy IP wolno mówić wyłącznie o umiejętności.
- **DOMYŚLNY WYBÓR:** (a).
- **Kto:** obaj (brzmienie), Karol (wykonanie).

### D35 · Mikro-nagrania dem

- **Pytanie:** czy w v1 są hover-klipy pokazujące dema w ruchu?
- **Opcje:** (a) zero w v1, trzy w fazie 2 (`kontroling-kosztow`: ETC → marża; `raport-zarzadczy`: wklejka → raport; `import-z-rekoncyliacja`: FAIL → poprawka → PASS); (b) jeden klip już w F2; **(c) cztery klipy w v1 (cały pierwszy rząd ściany), dopisane 2026-09-12 wieczorem razem z D37**.
- **REKOMENDACJA (rano):** (a), bo klip nie działa na telefonie i kosztuje transfer.
- **ZMIANA 2026-09-12 (wieczór): (c) cztery klipy w v1.** Skoro `record-demos.mjs` i tak powstaje w F1 dla nagrania hero (D37), krańcowy koszt czterech klipów to kilka godzin, a nie dzień, i to one realizują „efekt animacyjny" tam, gdzie ma on wartość dowodową. Klipy dostaje **pierwszy rząd ściany** (`kontroling-kosztow`, `raport-zarzadczy`, `import-z-rekoncyliacja`, `os-czasu-zadan`), czyli dokładnie cztery kafle widoczne w jednym rzędzie na ≥ 1024 px. Nie dwanaście: 12 × 320 KB i dwanaście dekoderów, a „wszystko się rusza" znosi efekt odkrycia.
- **DOMYŚLNY WYBÓR:** (c), cztery klipy pierwszego rzędu.
- **Konsekwencja:** klipy startują wyłącznie po **progu intencji 120 ms** na hover albo na `focus-visible`, `preload="none"`, maksimum jeden naraz, `pointer-events: none` (kafel zostaje jednym `<a>`), poster = kafel 480×300, budżet ≤ 320 KB, zero na `pointer: coarse`, `saveData` i przy `prefers-reduced-motion`. Blokujące dla F2 jest tylko nagranie hero; klipy mogą dojechać do F3.
- **Kto:** Karol.


## Część H · Korekta wieczorna 2026-09-12: wideo wraca do v1 (D36–D38)

> Decyzja Karola, wiążąca: **Higgsfield wchodzi do wersji 1**, powód w jego słowach: „zależy mi na efekcie wow i animacyjnym". Poniższe trzy decyzje mówią, **w jakim kształcie** to wchodzi, żeby wrażenie było duże, strona nadal ładowała się poniżej 2,5 s na telefonie i żeby nie złamać zasad, które founderzy sami ustanowili. Scenorys, budżety i procedura zakupu: `docs/plan/warstwa-wrazenia.md`.

### D36 · Higgsfield w v1: w jakim zakresie i za ile

- **Pytanie:** co dokładnie kupujemy i co z tego trafia na stronę?
- **Opcje:** (a) **statyczna faktura na stronie** (grunt hero, master still, tło OG) plus opcjonalna pętla na LinkedIn poza stroną; (b) pętla wideo w tle hero na stronie plus stille; (c) pełna lista z researchu (przejścia, tła sekcyjne, mikro-animacje ikon, 1 300–2 200 kr, ULTRA 129 USD).
- **REKOMENDACJA:** (a). To jedyny zakres, który kupuje rzecz, której nie zrobi ani nagranie Playwrightem, ani kod (fakturę materiału), nie zajmuje jedynego slotu autoodtwarzania na `/` i **mieści się w bezpłatnym trialu**, więc publikacja strony nie zależy od żadnej płatności. (c) odpada przy tym zakresie: ULTRA jest niepotrzebne.
- **DOMYŚLNY WYBÓR:** (a).
- **Konsekwencja:** ≈ 222 kredytów łącznie (H1 grunt 24, H2 master still 15, H3 tło OG 10, rezerwa 7 = **zakres strony ≈ 56 kr, 0 USD w trialu**; H4 pętla na LinkedIn ≈ 166 kr = **49 USD + VAT za jeden miesiąc PLUS**, osobna decyzja). Faktura na osobę fizyczną (D25, D27), koszt nieodliczalny. Do modelu **nigdy** nie trafiają nagrania ani zrzuty narzędzi, dane klientów, twarze i materiały firmy źródłowej; po sprincie generacje kasujemy z konta. **Agent nie uruchamia trialu ani zakupu.** Grunt hero jest warstwą niezależną: gdy odpadnie w przeglądzie, wraca gradient na tokenach i strona nie traci treści.
- **Kto:** Karol (oko marki i wykonanie w MCP) z Pawłem (płatnik).

### D37 · Co gra w hero: nagranie narzędzia czy pętla generatywna

- **Pytanie:** co zajmuje **jedyny** slot autoodtwarzanego wideo na `/`?
- **Opcje:** (a) **nagranie prawdziwego narzędzia** (`ProductionDashboard`, 8 s, jedno odtworzenie, poster = klatka 0 = kadr produktu = LCP, 0 kredytów, deterministyczne); (b) **pętla Higgsfielda pod scrimem**, kadr produktu na wierzchu (pętla jako tekstura, 330–420 kr, LCP nadal na kadrze); (c) pętla Higgsfielda jako jedyny wizual hero, bez kadru produktu.
- **REKOMENDACJA:** (a). Nagranie jest **jednocześnie ruchem i dowodem**: w tej samej sekundzie mówi „co", „dla kogo" i „to naprawdę liczy", kosztuje 0 kredytów, jest deterministyczne i responsywne, a poster jest jego klatką zero, więc kadr z porannej korekty zostaje bez kompromisu. Pętla abstrakcyjna jest tylko ruchem i przy tej personie („kalkulator, nie wróżka") niesie ryzyko „widać, że to AI" oraz efektu stocku. Wariant (c) wraca dokładnie do tego, co odrzucono rano.
- **DOMYŚLNY WYBÓR:** (a).
- **Konsekwencja (a):** `record-demos.mjs` wchodzi do F1; budżet nagrania hero WebM ≤ 1,2 MB / MP4 ≤ 1,4 MB (kadr niesie tekst UI, więc więcej niż tekstura); transfer desktop `/` rośnie z 1,2 MB do ≤ 2,5 MB (mobile bez zmian, ≤ 350 KB i 0 B wideo); bramka LCP staje się **elementowa** (element LCP = kadr produktu).
- **Konsekwencja (b), gdyby Karol wybrał inaczej:** wchodzi zakup PLUS (bo pętla to finał, a finały tylko na planie płatnym), budżet pętli 720 KB (WebM) / 980 KB (MP4) pod scrimem `.88`, dochodzi pomiar kontrastu na najjaśniejszej klatce (`YMAX` ≤ 105 w polu tekstu), ryzyko „AI-slop" i bandingu na OLED, a nagranie hero schodzi do roli klipu hover. Kontrakt warstw hero i zakaz wideo na telefonie obowiązują **tak samo w obu wariantach**.
- **Kto:** Karol (oko marki). Kryterium rozstrzygające jest zapisane i mierzone: bramka `strona-v2-plan.md` §7.3a (czytelność po kompresji, test „co widzisz", Lighthouse, realny iPhone).

### D38 · „Chaos w porządek": wideo generatywne czy kod

- **Pytanie:** metaforę „rozsypane dane układają się w wynik" robimy klipem czy kodem?
- **Opcje:** (a) **kodem** (`ChaosToOrder`, Motion na siatce 96 prostokątów, jako **stan ładowania żywego dema** w S2); (b) klipem z `seedance_2_5` (start = chaos, end = siatka, ≈ 280 kr).
- **REKOMENDACJA:** (a). Klip byłby **drugim** ruchomym elementem na trasie (łamie `media-one-autoplay-per-route`), kosztuje więcej niż cały pozostały budżet Higgsfielda, ma sztywne proporcje, nie jest deterministyczny i **nie da się go zsynchronizować z faktycznym czasem montażu chunku**. Kod robi ten sam obraz za 0 kredytów i daje ruchowi funkcję, więc przechodzi bramkę `motion-motivated`.
- **DOMYŚLNY WYBÓR:** (a).
- **Konsekwencja:** nowy komponent `ChaosToOrder` (wyłącznie `opacity` i `transform`, offsety z `src/data/scatter.ts` wpisane na stałe, kaskada kolumnami 16 ms, `aria-hidden` plus sąsiedni `role="status"`, reduced-motion → siatka od razu w układzie docelowym). Wariant zapasowy, gdyby moment okazał się niewidoczny (dema montują się szybciej niż 900 ms): ten sam komponent jako pas 140 px nad bento w S4, uruchamiany raz. Nie robimy obu naraz.
- **Kto:** Karol (kompozycja).

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
| F2 | **Tożsamość administratora** do `/rodo`: imię i nazwisko + adres do korespondencji **albo** świadomie wybrane zdanie zastępcze (D26). NIP dopiero po rejestracji i nie jest wymagany przez RODO | Paweł | 2026-09-16 | publikację (bramka `SITE_PUBLISHABLE`); komplet art. 14 osobno odblokowuje outbound |
| F3 | Status rozmów o umowie IP / zgodzie na case z poprzednią firmą | Paweł | informacja do 2026-09-16; podpis: cel 2026-10-15 | D7: „15 narzędzi", karty case, zrzuty |
| F4 | **Podniesiona waga 2026-09-12:** jeśli administratorem danych jest Paweł (D25a), jego nazwisko blokuje **publikację całej strony**, nie tylko sekcję o ludziach; termin przesuwa się z końca F1 na **przed F4**. Portfolio Pawła: **nazwisko** (w całym planie Paweł występuje bez nazwiska, a S8 wymaga „imię i nazwisko 700" dla obu founderów), lista projektów i ról, 1 zdanie bio, zdjęcie | Paweł | 2026-09-19 (koniec F1) | sekcję S8 z dwoma founderami; bez nazwiska karta Pawła może pójść tylko w wariancie D6(b), czyli tym samym, który dziś przewidujemy dla Karola |
| F5 | Potwierdzenie rotacji klucza Anthropic z appki KSeF (poza repo) i przeniesienia plików z kluczami z OneDrive/Desktop do Menedżera poświadczeń | Karol | przed F0 | reguła `secret-rotate-on-exposure` w strażniku |
| F6 | Potwierdzenie zakresu liczby **„3 dni od pierwszej linii kodu do działającego produktu"**: co dokładnie znaczy „działający produkt" (tryb mock? połączenie z `api-demo.ksef.mf.gov.pl`?). W rejestrze `references/allowed-numbers.md` §1 liczba ma status **DO POTWIERDZENIA**, a mimo to wchodzi na pasek „W liczbach" na `/` | Karol | przed F2 | 4. pozycję paska S5; bez potwierdzenia pasek ma 3 pozycje, nie 4 |

---

## Podsumowanie domyślnych wyborów (jeśli do 2026-09-16 nie będzie odpowiedzi)

| ID | Domyślnie | ID | Domyślnie |
|---|---|---|---|
| D1 | pełne V1 w H1, LinkedIn i bocie | D13 | **nie kupujemy Higgsfielda w v1** (brak podmiotu do faktury; asset przegrywa z kadrem produktu) |
| D2 | Excel jako symptom; hak zostaje w ofercie i outboundzie | D14 | mailto/tel do czasu konta Cal.com |
| D3 | „pierwszy działający efekt w dni" + `delivery` per karta | D15 | GSC + CF Web Analytics, zdarzenia po `/rodo` |
| D4 | „zero chmury dostawcy", bullet AI usunięty | D16 | szkielet `/rodo` od CC, przegląd founderów, radca w 2 tygodnie; **dwie bramki: `SITE_PUBLISHABLE` i `OUTREACH_READY`** |
| D5 | KSeF = „Własny produkt" | D17 | „Poza biurem" poza stroną |
| D6 | Paweł pełnie, Karol imię + rola + inicjał „K" | D18 | Football Intelligence i LootAlert poza stroną |
| D7 | liczby zamrożone w opisach, home tylko liczby własne, „kilkanaście" | D19 | React 19.3 w fazie 2 |
| D8 | Nunito Sans solo | D20 | duotone przez CSS, bez oferowania motion |
| D9 | CTA biały płaski | D21 | hooki blokujące + restrukturyzacja CLAUDE.md |
| D10 | dark-only, light-ready w tokenach | D22 | `npm run check` jako bramka przed pushem |
| D11 | zakaz „—", „–" tylko w zakresach liczbowych | D23 | 4 efekty „Co osiągniesz" dosłownie |
| D12 | **kadr prawdziwego pulpitu w hero** (ani wideo, ani GLSL Hills) | D24 | `safari13` zostaje w v1 |
| D16-b | `/rodo` z `noindex` i poza sitemapą do przeglądu radcy | | |
| D25 | Paweł jedynym administratorem danych, Karol upoważniony (art. 29) | D31 | nav „Narzędzia", H2 „Co zbudowaliśmy", H1 hubu „Narzędzia, które zbudowaliśmy" |
| D26 | zdanie „adres na żądanie" do publikacji, skrytka pocztowa przed outboundem | D32 | hero · demo · ściana · co budujemy · co osiągniesz · ludzie · kalkulator · kroki · zamknięcie |
| D27 | karta prywatna administratora, faktura na osobę fizyczną, koszt nieodliczalny | D33 | ściana: 1 featured (KSeF) + 12 kafli, kadr dobierany per typ obrazu |
| D28 | kadr `ProductionDashboard` w hero (zero WebGL); **po D37 kadr jest klatką zero nagrania tego dashboardu** | D34 | mapa integracji jako deklaracja umiejętności |
| D29 | żywe demo raportu na `/` (S2) z bramką „zero requestów" | D35 | mikro-nagrania: zero w v1, trzy w fazie 2 |
| D30 | pasek „W liczbach" usunięty; „13" i „12" w podpisie ściany | | |
| D36 | Higgsfield w v1 **tylko jako statyczna faktura** (grunt hero, master still, tło OG ≈ 56 kr w trialu, 0 USD) plus opcjonalna pętla na LinkedIn poza stroną (49 USD) | D37 | w hero gra **nagranie prawdziwego narzędzia** (8 s, jedno odtworzenie); kadr produktu = klatka 0 = LCP |
| D38 | „chaos w porządek" **kodem** jako stan ładowania dema, nie klipem | D35 | **cztery klipy hover** pierwszego rzędu ściany w v1 (zmiana z „zero w v1") |

**Próg poza listą decyzji: `CONTRACT_READY`.** Rejestracja działalności, NIP, rachunek, wzór umowy sprintu i porozumienie wspólników są warunkiem **pierwszej faktury**, nie publikacji strony i nie outboundu. Działalność nierejestrowana nie obsłuży pilota za kilkanaście tysięcy (limit przychodu z art. 5 Prawa przedsiębiorców). To pozycja procesowa, nie decyzja o stronie: nikt nie musi na nią odpowiadać do 2026-09-16, ale musi być domknięta przed podpisem pierwszej umowy.

Po spotkaniu: wynik do `docs/DECISIONS.md` (wpis z datą, ID, wyborem i jednym zdaniem uzasadnienia), podmiana starych ID `D-xx` w `.claude/skills/klarow-guardian/**` wg tabeli przejścia numeracji (+ `node .claude/skills/klarow-guardian/scripts/build-index.mjs`), start F0 wg `strona-v2-plan.md` §11.
