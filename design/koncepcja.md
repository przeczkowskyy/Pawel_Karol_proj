# Klarow.com v2: koncepcja strony (zatwierdzona 2026-09-22)

## Kontekst

Starą stronę Klarow (repo w `Desktop\Karol & Paweł app`) uznaliśmy za spaloną. Nowa powstaje od zera w
`Dokumenty\Klarow v2`, na tym samym repo i tym samym hostingu (klarow.com).

**Czym jest strona.** Wizytówka i reklama firmy automatyzacji Karola Baluckiego: magazyn, księgowość, API,
chatboty AI, generatory dokumentów, integracje. Dowody (zrobione narzędzia) mają osobną podstronę `/cv`.

**Kto na nią wchodzi.** Ktoś skanuje QR z neutralnej, czarno-białej wizytówki i czyta na telefonie przez 30–90 s.

**Efekt wow (po korekcie 22.09).**
- Jedno duże, wyciszone tło z okablowania i sieci neuronowej, wygaszane do czerni. Grafika z Higgsfield, styl poważny, zero kreskówki.
- Kabel z impulsem przez całą stronę **wypadł z projektu**: efekt niepewny, koszt budowy wysoki.

**Proces.** Prompty z tej rozmowy → Higgsfield (obraz → wideo → pętla) → Claude Design (layout) → hand-off tutaj
(architektura, copy, szlif, deploy).

**Decyzje założyciela (21.09):**
- **tylko PL**,
- **wizytówka jest neutralna, więc paletę i znak ustala strona**,
- **portfolio pokazuje tylko możliwości: zero case'ów i zero zmyślonych liczb**,
- **push na `main` idzie od razu na produkcję**, więc każdy commit musi się dać pokazać osobie z QR.

**Dwie strony pod jedną domeną (decyzja 22.09):**
- **`klarow.com` — strona firmowa.** Pokazuje, co potrafimy zbudować. Nie jest CV ani broszurą.
- **`klarow.com/cv` — strona-CV Karola.** Ten sam styl, ale tu stoją **prawdziwe, zrobione narzędzia**: to jest dowód.

**Zatwierdzone 22.09 po podglądzie na żywo (`/podglad-tla`):** tło w wariancie **B** (przewija się razem z treścią,
powtarzane przez odbicie w pionie), krój **Bricolage Grotesque**, storytelling i przekrój przykładów narzędzi.

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

**Idea.** Za treścią stoi jedno duże, ciemne tło: sieć kabli i połączeń neuronowych, wygaszana do czerni w dół strony.
Na wierzchu jest spokojny, uporządkowany tekst i sześć ikon działów, które prowadzą do przykładów narzędzi.
Przekaz: skomplikowane bierzemy na siebie, a Wam zostaje prosty przepływ danych.

**Metafora w całej marce:**

| Element | Znaczy |
|---|---|
| moduł | usługa |
| przewód | integracja |
| sieć w tle | Wasze systemy, dziś splątane |
| bursztynowy punkt | miejsce, w którym coś działa samo |

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
| **`#co-robimy` 01** | H2 „Co automatyzujemy”. 6 wierszy z **klikalnymi ikonami** (ikona → `/przyklady#<dział>`), każdy w `<details>`: ikona, nazwa, koralowe „zamiast…” i papierowe „teraz…”. Wiersze w tabeli pod mapą. Pod listą: „Mały problem czy duży system — zaczynamy od kawałka, który boli najbardziej.” Blok **PRZYKŁAD** (etykieta „ilustracja, nie wdrożenie u klienta”) opisany pod mapą |
| **`#oszczednosci` 02** | H2 „Ile kosztuje Was ręczna robota? Policzcie.” Kalkulator opisany w §7 |
| **`#jak-pracujemy` 03** | H2 „Od rozmowy do działającego procesu”. 4 kroki współpracy i 4 obawy, opisane pod mapą |
| **`#kim-jestesmy` 04** | H2 „Z kim rozmawiacie”. Copy: „Klarow to jedna osoba: Karol Balucki. Piszę kod, wdrażam go u Was i odbieram telefon. Bez działu sprzedaży pomiędzy.” v1: imię, nazwisko i rola (automatyzacje, integracje, raporty). v1.1: prawdziwe zdjęcie, bez efektów i bez AI |
| **`#kontakt` 05** | H2 „Połączmy się.” Duże przyciski: Zadzwoń 786 296 426, Napisz, Zapisz w kontaktach. Link „Przyślijcie nam swój najgorszy Excel” (mailto z dopiskiem opisanym pod mapą). „Prześlij dalej” (Web Share, a bez niego kopiowanie linku). Bez obietnicy czasu odpowiedzi |
| **stopka** | Klarow · {administrator: imię i nazwisko} · kontakt@klarow.com · 786 296 426 · Polityka prywatności · „Ta strona nie używa ciasteczek.” |
| **podstrony** | `/przyklady` (przekrój możliwości), `/cv` (dowody: zrobione narzędzia Karola, §6b), `/start` (prawdziwa strona dla QR, §8), `/polityka-prywatnosci`, typograficzna `/404` |

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

**03: cztery kroki współpracy**
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
| `--linia` | `#3A4450` | linie w tle, obramowania |
| `--obrys` | `#05070A` | kreskówkowy obrys |
| `--papier` | `#F2EDE3` | tekst (≈ 16:1) |
| `--papier-2` | `#A8A294` | tekst drugorzędny (≈ 7,5:1); nie w hero |
| `--sygnal` | `#FFB938` | **jedyny kolor akcji**: CTA, akcenty ikon, wynik |
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

**Styl ilustracji: poważny rysunek techniczny**
- Równe, cienkie linie o jednakowej grubości, płaskie matowe wypełnienia, zero grubych obrysów i cieni.
- Geometria jak w schemacie inżynierskim i na mapie metra: proste odcinki, zakręty 45° i 90°, dużo pustej przestrzeni.
- Wspólna **obudowa modułu** dla ikon: prostokąt o zaokrąglonych rogach, spokojna jasna płaszczyzna, jeden bursztynowy punkt.
- Akcenty świetlne zajmują poniżej 8% kadru i nigdy nie świecą łuną.
- Zakazy: kreskówkowość (grube obrysy, śrubki, opaski, pękate kształty), ludzie, roboty, mózgi, tekst, render 3D, neon.

---

## 5. Tło strony (efekt wow po zmianie kierunku 22.09)

**Co wypadło i dlaczego.** Kabel z impulsem biegnący przez całą stronę został odrzucony przez założyciela:
efekt był niepewny, styk grafiki z kodem kruchy, a koszt budowy wysoki. Zamiast niego strona dostaje
**jedno duże, wyciszone tło** z okablowania i sieci neuronowej.

**Jak to działa**
- Jeden obraz na orientację: `TLO-M` (9:16) na telefon, `TLO-D` (16:9) na desktop. Leży w warstwie pod treścią,
  `position: fixed`, `object-fit: cover`.
- U góry strony widać go najmocniej, niżej jest **wygaszany do czerni**. Wygaszanie robi CSS
  (`linear-gradient` do `--tlo`), nie generator, więc regulujemy je bez nowej generacji.
- Pod każdym blokiem tekstu leży dodatkowe płaskie przyciemnienie, żeby kontrast trzymał się powyżej 7:1.
- **Tło przewija się razem z treścią** (wariant B, zatwierdzony po podglądzie), a nie jest przypięte. Powtarzamy je
  przez **odbicie w pionie**: szew jest niewidoczny, bo ścieżki przechodzą przez linię odbicia. Zero dodatkowych generacji.
  Dzięki temu puste pole kadru przepływa raz i nie zostaje w jednym miejscu ekranu.
- **Podstrony dostają inny fragment kadru** (`background-position`), żeby nie wyglądały jak kopia strony głównej.
- W v1 nic się nie animuje. Ruch świateł jest opcją po starcie (`design/prompty/higgsfield/02-ruch-opcjonalny.md`),
  a tańszą wersją tej opcji są kropki na ścieżkach SVG animowane w kodzie.
- `prefers-reduced-motion` i brak JS niczego nie psują: tło to obraz.

**Styl: poważny, zero kreskówki.** Język rysunku technicznego i mapy metra — równe cienkie linie, trasy pod 45°
i 90°, płaskie matowe wypełnienia, dużo pustej przestrzeni, akcenty świetlne poniżej 8% kadru. Zakazane są grube
obrysy, śrubki, opaski, pękate kształty i wszystko, co wygląda zabawkowo.

**Prompty:** `design/prompty/higgsfield/01-tlo-i-hero.md`, rozdział „Runda 2”, razem z blokiem STYLE 2
i listą twardych odrzutów. Eksport na stronę: `03-pipeline-ffmpeg.md`, sekcja H.

**Runda 1 (12 obrazów, 22.09) odrzucona:** za bardzo kreskówkowa i ze zbyt jasną górą kadru. Zapis w archiwum
tego samego pliku.

---

## 6. Nawigacja po ofercie: ikony i podstrona `/przyklady`

Miejsce, które wcześniej zajmował impuls, przejmuje **sześć ikon działów** w sekcji `#co-robimy`.

- **Rysunek, nie generator.** Sześć ikon w jednej, wspólnej obudowie modułu, ta sama siatka, ta sama grubość
  linii, symetryczny układ (2×3 na telefonie, 6 w rzędzie na desktopie). Generator nie daje takiej powtarzalności.
- **Klikalne.** Każda ikona prowadzi do `/przyklady#<dział>`, czyli do opisu przykładowego narzędzia z tego obszaru.
- **Uczciwość.** Każdy blok na `/przyklady` ma widoczną etykietę: to **przykład możliwości**, nie wdrożenie u klienta.
  Treść sześciu opisów powstaje osobno i wymaga akceptacji przed publikacją.
- Sekcja `#co-robimy` na stronie głównej zostaje krótka: ikona, nazwa działu, „zamiast…” i „teraz…”. Szczegóły są na podstronie.

---

## 6b. Strona-CV: `klarow.com/cv`

Decyzje z 22.09: **podstrona w tym samym projekcie** (jeden deploy, wspólne tokeny i tło), **CV Karola**,
**bez nazw klientów i pracodawców** (opisowo: „firma produkcyjno-budowlana, 50–150 osób”).

**Podział ról między stronami**

| | `klarow.com` (firmowa) | `klarow.com/cv` |
|---|---|---|
| Co pokazuje | możliwości: co potrafimy zbudować | dowody: narzędzia, które powstały |
| Ton | „robimy to i to, opowiedzcie o swoim procesie” | „oto co zrobiłem, tak to działa” |
| Materiał | przekrój obszarów, jedno zdanie na pozycję | konkretne narzędzia, zrzuty ekranu, kontekst |
| Kto | firma (marka Klarow) | Karol jako osoba |
| Link | „Zobaczcie, co już powstało →” do `/cv` | „← Wróć do strony firmowej” |

**Zasady dla `/cv`**
- **Zrzuty ekranu wyłącznie na danych zmyślonych albo zanonimizowanych.** Żadnych nazw kontrahentów, kwot
  z prawdziwych dokumentów, nazwisk, numerów zleceń.
- **Prawa do narzędzia.** Narzędzie zrobione w ramach zatrudnienia należy do pracodawcy (art. 12 prawa autorskiego),
  więc na `/cv` trafia tylko to, co powstało poza nim, albo to, na co jest pisemna zgoda. Bezpieczna kolejność:
  najpierw własne zlecenia i własne projekty, dopiero potem cokolwiek innego.
- **Format pozycji:** nazwa narzędzia · do czego służyło · co w nim zrobiłem · czym zbudowane · jeden zrzut.
  Bez opowiadania historii wdrożenia i bez liczb opisujących efekt u klienta.
- Ta strona **nie jest ofertą** i nie ma na niej cen ani kalkulatora.

**Kolejność prac:** `/cv` powstaje po stronie firmowej, jako commit C3, na tych samych komponentach.
Potrzebny materiał od Karola: lista narzędzi (nazwa + jedno zdanie) oraz zrzuty na bezpiecznych danych.

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
  src/components/  Tlo, Hero, Sekcja, IkonaDzialu, Kalkulator, PasekKontaktu …
  src/scripts/     kalkulator.ts · udostepnij.ts        (łącznie ok. 4 KB)
  src/pages/       index.astro  przyklady.astro  cv.astro  start.astro  polityka-prywatnosci.astro  404.astro
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

Prompty #1–#4 i prompt awaryjny „R” są w `design/prompty/claude-design/`, w wersji po zmianie kierunku z 22.09:
- tło jako główny element wizualny, z warstwą wygaszającą i wymogiem pomiaru kontrastu **na grafice**;
- sekcja 01 jako siatka sześciu **klikalnych ikon** prowadzących do `/przyklady#<slug>`;
- podstrona `/przyklady` z sześcioma blokami (treść: `design/tresc/przyklady-narzedzi.md`, czeka na akceptację);
- zero kabla, portów, wtyczki, wideo i ruchu bez interakcji;
- `/cv` **nie wchodzi do rundy 1** — powstanie na tych samych komponentach w handoff-02, po starcie strony firmowej;
- H1 w wersji B, eyebrow zawsze widoczny, bez chipa QR, formy neutralne, presety kalkulatora z §7.

Zasada ogólna: Claude Design rysuje układ i stany interakcji, a mechanikę (kalkulator) trzyma kod. Pula użycia Claude Design jest wspólna, więc rundy #2–#4 są celowo wąskie.

---

## 10. Kolejność pracy

Etap jest zamknięty dopiero razem ze swoją akcją „do ludzi”. Postęp liczymy w rozmowach, nie w commitach.

| Krok | Kto | Co | Zamknięty, gdy |
|---|---|---|---|
| **C0** (po akceptacji planu) | Claude Code | §2: klon, konfiguracja, tag, porządki, nowy `CLAUDE.md`, `design/koncepcja.md`, hurtownia promptów. Produkcja bez zmian | push |
| **E1** | Wy | Higgsfield runda 1: 3 kierunki × 4 warianty 2K, wybór, 4K, `hero-m-start-1080x1920.png`, drafty ruchu V-A i V-B | still zatwierdzony |
| **E1b** | Wy | Test 3 s na makiecie telefonu (sam tekst hero, raz bez obrazu i raz ze stillem, H1 w wersji A i B) na 5 osobach spoza branży. Pytanie: „Z jaką sprawą można by zadzwonić do tej firmy?”. Zaliczony, gdy ≥ 4/5 osób nazywa konkretne zadanie i nikt nie mówi „sieci/IT/okablowanie”. Do tego 5 wiadomości do firm z listy leadów (bez linku, prośba o 20 min) | test zrobiony, wiadomości wysłane |
| **E2** | Wy + Claude Code | Claude Design, rundy #1–#4 (timebox ok. 4 h), `design/handoff-01/` | hand-off w repo |
| **C1** „Nowa wizytówka” | Claude Code | `git rm` starego `site/`; Astro; layout z hand-offu; całe copy; tło z wygaszaniem; 6 ikon działów; kalkulator z testem; pasek, vCard, `/start`, polityka, 404, `_redirects`, `_headers`, OG, strażnik. **Stara strona znika**, stare adresy nie dają 404 | link wysłany 5 osobom z ICP (nie rodzinie) |
| **C2** „Przykłady narzędzi” | Claude Code | podstrona `/przyklady` z sześcioma opisami i kotwicami, linkowanie z ikon, obraz OG, szlif kontrastu i wydajności. Test na tanim Androidzie przez LTE i na iPhonie | 5 osób zeskanowało QR na żywo, 10 kolejnych wiadomości z linkiem, ≥ 1 umówiona rozmowa |
| **C3** „Strona-CV” | Karol + Claude Code | `/cv` na komponentach ze strony firmowej: lista zrobionych narzędzi, zrzuty na bezpiecznych danych, linki w obie strony. Materiał i zgody po stronie Karola | link do `/cv` wysłany z 5 wiadomościami |
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

1. ~~Administrator danych~~ — **rozstrzygnięte 22.09: Karol Balucki**, `kontakt@klarow.com`, 786 296 426.
   - Otwarte zostaje tylko: **czy podajemy adres do korespondencji** (wymaga go art. 5 ustawy o świadczeniu usług drogą elektroniczną).
   - **Rekomendacja:** imię, nazwisko i e-mail teraz, pełne dane po wpisie do CEIDG. Słów „spółka” i „sp. z o.o.” oraz NIP nie używamy do rejestracji.
2. ~~Nazwiska na stronie~~ — **rozstrzygnięte 22.09:** strona mówi jednym głosem, Karol Balucki. Paweł nie pojawia się na stronie firmowej. Nie pokazujemy cudzych projektów jako własnego dorobku.
3. **Które obietnice podpisujecie dziś:** KSeF w wierszu 2, rozmowa 30 min, pilot, przeniesienie praw w umowie.
   - Przed pierwszą rozmową o pilocie potrzebny jest wzór umowy (przeniesienie praw i umowa powierzenia).
   - Rejestracja działalności najpóźniej w dniu pierwszego zlecenia.
4. **Kierunek hero** (GŁÓWNY, ALT-1 albo ALT-2) po rundzie 1 w Higgsfield.
5. ~~Role w sekcji 04~~ — **rozstrzygnięte:** „automatyzacje, integracje, raporty”. Zmień, jeśli wolisz inaczej.

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
  - Android za ok. 800 zł przez LTE: LCP ≤ 2,5 s, płynne przewijanie;
  - iPhone i Android: tło nie przesuwa się skokowo przy chowaniu paska adresu;
  - kontrast tekstu na tle ≥ 7:1 w każdej sekcji (pomiar na zrzucie, nie na oko);
  - `prefers-reduced-motion`;
  - 360×640 bez poziomego scrolla;
  - test w pełnym słońcu.
- **Treść:**
  - „Zadzwoń” otwiera wybieranie numeru, a vCard importuje się na iPhonie i Androidzie;
  - kalkulator daje liczby z tabeli §7;
  - Lighthouse mobile ≥ 90;
  - WA zlicza ścieżkę `/start`.
- **Pętla:** szew niewidoczny przez 3 obiegi, klatka 0 równa posterowi (dzięki blokadzie statyki), plik w budżecie.
