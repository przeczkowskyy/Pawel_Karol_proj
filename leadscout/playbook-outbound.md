# Playbook outboundu Klarow (KPI: 20 kontaktów/tydzień)

> Research 2026-07-23. Sekwencja zgodna z PKE: LinkedIn -> mail dopiero po zgodzie -> telefon po odpowiedzi.

## Rytm tygodniowy

### KROK 0 (jednorazowo, ok. 2–3 h na obu founderów): konfiguracja monitoringu
(1) Załóż darmowe konta kandydackie na pracuj.pl i rocketjobs.pl na kontakt@klarow.com; na pracuj.pl ustaw 3 Zapisane wyszukiwania (JobAlert, mail codzienny): 'kontroler finansowy', 'analityk finansowy Excel', 'specjalista ds. raportowania' z filtrem branż produkcja/budownictwo/handel B2B (zarządzanie: pracuj.pl/konto/zapisane/wyszukiwania). (2) Na LinkedIn ustaw do 10 darmowych Job Alerts (mail daily) na te same frazy + lokalizacje docelowych województw. (3) Załóż Google Alerts (0 zł): 'nowa hala produkcyjna', 'rozbudowa zakładu', 'decyzja o wsparciu', 'podpisała kontrakt' + województwa. (4) Uruchom trial rejestr.io (14 dni za darmo) albo od razu abonament imsig.pl (600 zł/rok netto) i dodaj do subskrypcji wszystkie firmy z leadscout/leads.json z oceną >=6. (5) Sprawdź, że Gmail MCP w Claude Code widzi skrzynkę kontakt@ (alerty będą tam wpadać) i że node leadscout/notify.mjs wysyła na Telegram. (6) Załóż arkusz/plik rejestru zgód i sprzeciwów (wymóg PKE): kto, kiedy, jaki kanał, treść zgody/odmowy — może być pole w leads.json.

### PONIEDZIAŁEK rano — runda agenta AI (czas founderów: 0 min, agent pracuje sam)
Jeden z founderów odpala /lead-scout (albo cyklicznie przez /loop). Agent: czyta z Gmaila (MCP) alerty JobAlert/LinkedIn/Google Alerts z całego tygodnia, dodatkowo przeszukuje WebSearch/WebFetch publiczne wyniki pracuj.pl i rocketjobs (portale nie mają publicznego RSS — skrzynka mailowa + scraping wyników wyszukiwania to jedyna automatyzacja), weryfikuje firmy (domena, rozmiar 20–250, branża), scoruje 0–10 (ogłoszenie o kontrolera z Excelem = +3, pełny sygnał), pisze 1-zdaniowy hook pod sygnał, dopisuje do leadscout/leads.json i wysyła digest na Telegram @Klarow_BOT. Cel rundy: 5–10 nowych zweryfikowanych firm, w tym minimum połowa z aktywnym sygnałem zakupu.

### PONIEDZIAŁEK po południu — wybór 20 targetów tygodnia (30 min, obaj founderowie razem)
Przegląd digestu na Telegramie + zaległych leadów w bazie. Wybieracie 20 firm tygodnia: priorytet 1 = aktywne ogłoszenie o pracę na kontrolera/analityka (kontakt w ciągu max 7 dni od publikacji — sygnał stygnie), priorytet 2 = nowy CFO/zarząd z KRS, priorytet 3 = nowa hala/inwestycja, na końcu firmy bez sygnału z wysokim dopasowaniem ICP. Podział 10/10 — najpierw sprawdźcie wspólne kontakty na LinkedIn (wspólny znajomy podnosi akcept zaproszenia). Dla każdego targetu: zidentyfikuj na LinkedIn konkretną osobę (właściciel do ~100 osób, CFO/główna księgowa powyżej). Statusy w leads.json: nowy -> kontakt.

### WTOREK — LinkedIn, pierwszy dotyk (30–40 min na foundera)
Każdy founder wysyła 10 zaproszeń z notatką: szablon 'linkedin-invite', a przy firmach z ogłoszeniem o pracę — od razu wariant nawiązujący do rekrutacji. Zaproszenie NIE sprzedaje — buduje kontekst. Do tych, którzy zaakceptowali zaproszenie z poprzedniego tygodnia: wiadomość 'wiadomosc-po-triggerze-ogloszenie' (jeśli był trigger) albo krótka wersja problem-first z pytaniem 'czy mogę przesłać 2 akapity na maila?'. Zgoda wyrażona na LinkedIn (screenshot do rejestru zgód) legalizuje wysyłkę maila z treścią handlową — to serce sekwencji zgodnej z art. 398 PKE. LinkedIn jest kanałem pierwszego kontaktu o najniższym ryzyku prawnym: PKE celuje w mail/SMS/telefon, a wiadomość 1:1 po przyjęciu zaproszenia to komunikacja w ramach relacji, na którą odbiorca się zapisał.

### ŚRODA — maile (agent przygotowuje, founder wysyła; 20 min na foundera)
Agent AI dostaje listę osób, które dały zgodę na LinkedIn (albo których nie ma na LinkedIn — dla nich ścieżka awaryjna niżej) i przez Gmail MCP tworzy DRAFTY w skrzynce kontakt@: personalizacja = 1 zdanie o ich sygnale + szablon. Founder czyta każdy draft (2 min/szt.), poprawia i wysyła ręcznie z kontakt@klarow.com (Wyślij-jako + Resend SMTP już skonfigurowane, SPF/DKIM/DMARC dają dostarczalność). Osoby PO zgodzie z LinkedIn dostają pełny mail z hakiem 'najgorszy Excel'. Ścieżka awaryjna (osoba nieuchwytna na LinkedIn): szablon 'mail-1-zgoda' — czyste zapytanie o zgodę; Prezes UKE dopuszcza taką praktykę pod warunkiem braku treści marketingowych i utrwalenia zgody, ale to szara strefa (część kancelarii uważa, że nawet zapytanie wymaga zgody) — dlatego limit: max 5 takich maili/tydzień, zawsze z opcją 'NIE = nie napiszę ponownie', odmowy do rejestru sprzeciwów.

### CZWARTEK — follow-upy i telefony (20–30 min na foundera)
(1) Follow-up 'mail-2-followup' do wszystkich bez odpowiedzi po 3–4 dniach roboczych; maksymalnie 1 follow-up na wątek zgody (więcej = nękanie w rozumieniu PKE), 2 follow-upy gdy zgoda już jest. (2) Telefony WYŁĄCZNIE do osób, które odpowiedziały albo zgodziły się na kontakt (art. 398 PKE obejmuje też telefon — również na centralę firmy; publiczny numer na stronie NIE jest zgodą; dzwonienie 'po zgodę' to już naruszenie; kary UKE do 3% przychodu lub 1 mln zł). Skrypt: 'telefon-otwarcie', cel = termin 30-minutowego demo 'najgorszy Excel'. Termin od razu do kalendarza (docelowo Cal.com w BookingModal — do wdrożenia wg nastepne-kroki.md) i mail potwierdzający z prośbą o przesłanie pliku.

### PIĄTEK — retro i higiena bazy (15 min, obaj razem)
Liczby tygodnia do leadscout (agent może zliczyć): wysłane zaproszenia / akcepty / zgody na mail / wysłane maile / odpowiedzi / umówione demo. Aktualizacja statusów w leads.json (kontakt -> rozmowa / odrzucony), dopisanie nowych obserwacji do subskrypcji KRS (imsig/rejestr.io), 1 wniosek tygodnia = 1 poprawka szablonu (testujcie jedną zmianę naraz, np. temat maila). Commit + push na main. Kwadrans wystarczy przy 20 kontaktach.

### ZASADY PRAWNE całego rytmu (obowiązują każdy tydzień)
Sekwencja zgodna z PKE (obowiązuje od 10.11.2024, art. 398 — jedna zgoda marketingowa na kanał, chroni też osoby prawne, więc 'na firmowy adres wolno' już NIE działa): (1) LinkedIn invite bez sprzedaży -> (2) po akceptacji wiadomość problem-first z pytaniem o zgodę na mail -> (3) mail z ofertą TYLKO po zgodzie -> (4) telefon TYLKO po odpowiedzi/zgodzie. Zawsze: rejestr zgód i sprzeciwów (dowód na wypadek kontroli), natychmiastowe honorowanie 'NIE', stopka z danymi firmy i informacją skąd mamy kontakt, żadnego kupowania baz mailowych. Sankcje za złamanie: UKE do 3% rocznego przychodu albo 1 mln zł (wyższa z kwot), przy konsumentach dodatkowo UOKiK do 10% obrotu — dla dwuosobowej firmy ryzyko niewspółmierne do zysku z 'obejścia'.

### OCZEKIWANE WYNIKI — kalibracja KPI (benchmarki 2025/26)
Benchmarki cold outreachu B2B: średni reply rate maili 1–5% (Instantly: 3,4% średnia platformy; Belkins: 5–9% przy dobrym targetowaniu; czysty cold do zupełnie obcych potrafi spaść <1%); dobre >5%, świetne >10%; spotkania z cold maila 0,5–2,5% kontaktów. Kluczowe: hooki oparte na AKTUALNYM sygnale ('widzę, że rekrutujecie kontrolera...') osiągają ~10% odpowiedzi i ~2,3% spotkań — 3–4x lepiej niż generyczne problem-first. LinkedIn: akcepty zaproszeń z notatką typowo 20–40% (szacunek branżowy). Realistyczny lejek Klarow przy 20 kontaktach/tydz. (~85/mies., wysoka personalizacja + sygnały): 25–35 akceptów, 8–15 rozmów/odpowiedzi, 1–3 umówione demo miesięcznie na starcie, 3–5 po 2–3 miesiącach docierania szablonów. Wniosek: nie panikować przy 1 spotkaniu w pierwszym miesiącu — to norma; dźwignią jest udział leadów z aktywnym sygnałem (trzymajcie >50% tygodniowej listy), nie zwiększanie wolumenu.

## Triggery (sygnały zakupu -> monitoring)

- **Aktywne ogłoszenie o pracę: kontroler finansowy / analityk finansowy / specjalista ds. raportowania z wymogiem Excel/VBA (najsilniejszy sygnał — ktoś odszedł albo toną w robocie)**
  - Jak: pracuj.pl: darmowe 'Zapisane wyszukiwania' (JobAlert) — mail codziennie na kontakt@, konfiguracja na pracuj.pl/konto/zapisane/wyszukiwania, frazy + filtr branż produkcja/budownictwo/handel; LinkedIn Jobs: darmowe alerty (limit 10 aktywnych, mail daily/weekly) — działają jak radar kupującego, mimo że zaprojektowane dla kandydatów; rocketjobs.pl: mail/push po ustawieniu preferencji w profilu (brak RSS). Żaden z portali nie ma oficjalnego RSS — automatyzacja: alerty wpadają na kontakt@, agent AI (/lead-scout) czyta je w poniedziałek przez Gmail MCP i dodatkowo przeszukuje publiczne strony wyników WebFetchem. Z ogłoszenia agent wyciąga bonus: stack firmy (jaki ERP, jakie raporty) do personalizacji.
  - Narzędzie: pracuj.pl JobAlert + LinkedIn Job Alerts + rocketjobs.pl + /lead-scout (Claude Code, Gmail MCP); koszt: 0 zł

- **Nowy CFO / zmiana w zarządzie / przekształcenie (wpis w KRS)**
  - Jak: imsig.pl, abonament podstawowy: subskrypcje podmiotów bez limitu + powiadomienia e-mail o wpisach KRS (zmiana zarządu = najczęstszy publiczny ślad nowego CFO); uwaga — od 29.11.2025 wpisy KRS nie przechodzą już przez MSiG, ale imsig.pl pokazuje je dalej wprost z KRS, dla użytkownika nic się nie zmienia. Alternatywa: rejestr.io — alerty o obserwowanych firmach + pełne profile, sprawozdania finansowe (z nich odczytasz wzrost przychodu/zatrudnienia, bo KRS sam zatrudnienia nie pokazuje) i API; 14 dni triala na start. Praktyka: każda firma z leads.json z oceną >=6 od razu trafia na listę obserwowanych; alert o zmianie zarządu = lead wraca na górę poniedziałkowej listy. Wzrost zatrudnienia monitoruj pośrednio: liczba aktywnych ogłoszeń o pracę firmy (agent sprawdza w rundzie).
  - Narzędzie: imsig.pl (podstawowy) albo rejestr.io; lista obserwowanych z leadscout/leads.json; koszt: imsig.pl 600 zł/rok netto (72 zł/mies.); rejestr.io 99–149 zł/mies. (14 dni za darmo); start = 0 zł na trialu

- **Szybki wzrost: nowa hala, rozbudowa zakładu, decyzja o wsparciu w Polskiej Strefie Inwestycji, laureat Gazele Biznesu / Diamenty Forbesa, duży kontrakt**
  - Jak: Google Alerts (0 zł, mail dzienny): 'nowa hala produkcyjna', 'rozbudowa zakładu', 'otwarcie zakładu', 'decyzja o wsparciu', 'podpisała kontrakt' + nazwy docelowych województw. Raz w miesiącu agent AI przegląda aktualności 14 spółek zarządzających SSE (każda strefa publikuje news przy nowej decyzji o wsparciu z nazwą firmy, wartością inwestycji i liczbą miejsc pracy — gotowy hook) oraz newsy PAIH; centralna Ewidencja Wsparcia Nowej Inwestycji istnieje, ale praktyczny dostęp to właśnie komunikaty stref. Raz w roku: roczniki Gazele Biznesu i Diamenty Forbesa (produkcja + budownictwo) jako hurtowe źródło firm rosnących — do kolejki leadscout/nastepne-rundy.md.
  - Narzędzie: Google Alerts + strony 14 SSE i PAIH + /lead-scout; koszt: 0 zł

- **Trwające lub utknięte wdrożenie ERP (Comarch Optima/XL, enova365, Subiekt, Symfonia, Navireo)**
  - Jak: Dwie ścieżki: (a) ogłoszenia firmy o pracę na 'specjalista ds. wdrożenia ERP', 'kluczowy użytkownik systemu', 'administrator [nazwa ERP]' — te same JobAlerty co trigger 1, dodatkowe zapisane wyszukiwania; (b) strony partnerów wdrożeniowych Comarch/enova/Symfonia publikują referencje i komunikaty o rozpoczętych wdrożeniach z nazwami klientów — agent skanuje je WebSearchem w rundach lead-scout. Hook do takich firm: 'ERP nie zastąpi raportów, które i tak skleja się w Excelu — my domykamy tę lukę w dniach, nie miesiącach'.
  - Narzędzie: pracuj.pl/LinkedIn JobAlerty + WebSearch w /lead-scout; koszt: 0 zł

- **Audyt / due diligence / wymogi raportowe dużego klienta korporacyjnego**
  - Jak: Z zewnątrz praktycznie niewykrywalne — to sygnał do WYCIĄGNIĘCIA w rozmowie, nie do monitorowania: stałe pytanie kwalifikacyjne w telefonie i na demo ('czy któryś duży odbiorca wymaga od Was raportowania w swoim formacie?', 'czy przechodziliście ostatnio audyt?'). Pośredni proxy: komunikaty o wygranych dużych kontraktach (Google Alerts z triggera 3) — duży kontrakt z korporacją niemal zawsze ciągnie za sobą jej wymogi raportowe.
  - Narzędzie: pytania w skrypcie rozmowy + Google Alerts; koszt: 0 zł

## Szablony (PL)

### linkedin-invite
```
Dzień dobry! Prowadzę Klarow — pomagamy firmom produkcyjnym i budowlanym, w których raportowanie trzyma się na jednej osobie i wielkich Excelach. Buduję sieć osób odpowiedzialnych za finanse w firmach takich jak [Firma]. Będzie mi miło się połączyć — bez sprzedaży na dzień dobry.

[280 znaków — mieści się w limicie 300; personalizuj nazwę firmy]
```

### mail-1-zgoda
```
Temat: Jedno pytanie o raportowanie w [Firma]

Dzień dobry Panie/Pani [Imię],

piszę, bo w firmach produkcyjnych wielkości [Firma] miesięczne raportowanie zwykle trzyma się na jednej osobie i kilku dużych Excelach. Gdy ta osoba choruje, jest na urlopie albo odchodzi — zamknięcie miesiąca staje.

Pomagamy to uporządkować: pracujemy wyłącznie na kopii plików, dane nie wychodzą z firmy, a wdrożenie zamyka się w dniach, nie miesiącach.

Czy zgodzi się Pan/Pani, żebym jednym mailem przesłał szczegóły, jak to wygląda? Zaczynamy nietypowo: prosimy o Państwa najgorszy Excel i w 30 minut na żywo pokazujemy, co można z nim zrobić.

Wystarczy odpowiedź „TAK". Jeśli temat nie jest aktualny — proszę o krótkie „NIE" i nie napiszę ponownie.

Pozdrawiam,
[Imię Nazwisko]
Klarow — klarow.com | 786 296 426

[UWAGA PRAWNA: preferowana ścieżka to wysyłka PO zgodzie uzyskanej na LinkedIn — wtedy mail jest w pełni legalny. Jako pierwszy kontakt mailowy to szara strefa (zapytanie o zgodę wg praktyki Prezesa UKE dopuszczalne, jeśli nie zawiera treści marketingowej i zgoda jest utrwalona) — w tej wersji ogranicz do 5/tydz., każdą odpowiedź TAK/NIE zapisuj w rejestrze zgód]
```

### mail-2-followup
```
Temat: Re: Jedno pytanie o raportowanie w [Firma]

Dzień dobry Panie/Pani [Imię],

wracam krótko do maila sprzed kilku dni — jedna liczba zamiast argumentów: w firmie produkcyjno-budowlanej, z którą pracowaliśmy, przygotowanie miesięcznego raportu zarządczego skróciło się z około dwóch dni ręcznego klejenia arkuszy do jednego kliknięcia. [liczbę potwierdź z realnym casem przed użyciem]

Jeśli w [Firma] raport miesięczny też powstaje ręcznie — odpowiedź „TAK" wystarczy, żebym przesłał szczegóły, w tym jak działa nasze 30 minut na Państwa najgorszym Excelu.

Jeśli nie — proszę o „NIE", zamykam temat i nie wracam.

Pozdrawiam,
[Imię], Klarow

[Wysyłka: 3–4 dni robocze po mailu 1; przy braku zgody z LinkedIn to OSTATNI mail w wątku]
```

### telefon-otwarcie
```
[Dzwonimy WYŁĄCZNIE do osób, które odpowiedziały na mail/LinkedIn albo zgodziły się na telefon — art. 398 PKE; skrypt na pierwsze 20 sekund]

„Dzień dobry, [imię] z Klarow. Odpisał(a) mi Pan/Pani w sprawie raportowania w Excelu — dzwonię, tak jak zapowiadałem. Złapię Pana/Panią na dwie minuty?"

[pauza; jeśli TAK:]

„W jednym zdaniu: sprawiamy, że raport, który dziś ktoś w [Firma] skleja ręcznie w Excelu, powstaje jednym kliknięciem — na Państwa plikach, na kopii, nic nie wychodzi z firmy.

Zamiast prezentacji proponuję konkret: przysyłacie nam swój najgorszy Excel, a my w 30 minut online pokazujemy, co z nim zrobimy. Bez zobowiązań — najwyżej dowiecie się, co siedzi w Waszych plikach. Znajdzie Pan/Pani pół godziny w przyszłym tygodniu — pasuje wtorek czy czwartek?"

[jeśli NIE MA CZASU: „Rozumiem — kiedy mogę oddzwonić?" — konkretna data, zapis w leads.json]
```

### wiadomosc-po-triggerze-ogloszenie
```
[wiadomość LinkedIn po akceptacji zaproszenia; wersja mailowa dozwolona tylko po uzyskanej zgodzie]

Dzień dobry Panie/Pani [Imię], dziękuję za przyjęcie zaproszenia.

Trafiłem na Państwa ogłoszenie o pracę na stanowisko [stanowisko z ogłoszenia]. Wymaganie „bardzo dobra znajomość Excela" zwykle oznacza jedno: raportowanie urosło ponad możliwości jednej osoby.

Zanim nowa osoba się w pełni wdroży (realnie 2–3 miesiące), można zdjąć z zespołu najbardziej ręczną część tej pracy: automatyzujemy takie raporty w 5–10 dni, pracując na kopii plików — dane nie wychodzą z firmy. Nowy kontroler wchodzi wtedy w porządek, a nie w chaos.

Chętnie pokażę to na Państwa przykładzie: przysyłacie swój najgorszy Excel, a my w 30 minut pokazujemy, co z nim zrobimy.

Czy mogę przesłać dwa akapity szczegółów na maila?

[odpowiedź „tak" = udokumentowana zgoda na mail — screenshot do rejestru zgód; w mailu nawiąż: „zgodnie z naszą rozmową na LinkedIn…"]
```
