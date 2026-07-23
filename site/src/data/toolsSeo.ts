import type { Lang } from "@/i18n";

/* SEO long-tail + FAQ per narzędzie (PL/EN) — treści przygotowane wsadowo
   (12 draftów + adwersarialna weryfikacja zasad marki z CLAUDE.md #3: liczby
   tylko publiczne, limity długości meta), przejrzane ręcznie przed commitem.
   Konsumuje getTools() w tools.ts (merge po slugu) → runtime Seo/ToolPage
   ORAZ prerender statycznych podstron. Edytuj śmiało — to zwykły plik danych. */

export interface ToolSeoText {
  seo: { title: string; description: string };
  faq: { q: string; a: string }[];
}

export const TOOLS_SEO: Record<string, Record<Lang, ToolSeoText>> = {
  "raport-zarzadczy": {
    "pl": {
      "seo": {
        "title": "Raport zarządczy z Excela automatycznie — demo | Klarow",
        "description": "Raport dla zarządu z Excela w kilkanaście sekund: 3 KPI, wykres koszt vs postęp i tabela z komentarzami. Dane nie opuszczają przeglądarki. Wypróbuj demo na żywo."
      },
      "faq": [
        {
          "q": "Jak zrobić raport zarządczy automatycznie z plików Excel?",
          "a": "Wklejasz tabelę wprost z Excela, wgrywasz plik CSV albo ładujesz przykładowe dane — narzędzie czyta kolumny: projekt, etap, budżet, koszt, zaawansowanie, komentarz. W kilkanaście sekund dostajesz 3 KPI, wykres kosztu vs zaawansowania per etap i tabelę projektów z komentarzami, z eksportem do CSV. Wynik jest deterministyczny: te same dane wejściowe zawsze dają ten sam raport."
        },
        {
          "q": "Czy dane finansowe z raportu trafiają do chmury?",
          "a": "Nie. Demo liczy w 100% w Twojej przeglądarce — bez serwera i bez wysyłania danych do sieci, co możesz sprawdzić w narzędziach deweloperskich przeglądarki. Wdrożenie u klienta działa tak samo: lokalnie, on-premise, więc dane nie opuszczają firmy."
        },
        {
          "q": "Jak wygląda wdrożenie u nas i ile trwa pilot?",
          "a": "Zaczynamy pilotem na kopii Waszych plików — oryginałów nie dotykamy. Pilot obejmuje jeden proces i trwa maksymalnie 10 dni roboczych, pierwszy działający efekt widzicie w dniu 5, a płatność dzielimy 50/50. Budujemy dla firm 20–250 osób, które raportują z Excela."
        },
        {
          "q": "Po czym raport poznaje, że projekt traci marżę?",
          "a": "Wykres zestawia koszt z zaawansowaniem per etap — tam, gdzie koszt wyprzedza postęp, marża wycieka i raport to oznacza. Każdą liczbę sprawdzisz ręcznie dzięki jawnej „ścieżce wyliczenia” — to kalkulator, nie wróżka. Wzorzec pochodzi z firmy produkcyjno-budowlanej prowadzącej ~30 równoległych projektów, a raport i tak składa się w kilkanaście sekund."
        }
      ]
    },
    "en": {
      "seo": {
        "title": "Automated board report from Excel — live demo | Klarow",
        "description": "Automated board report from Excel in seconds: 3 KPIs, a cost-vs-progress chart and a project table with comments. Data never leaves your browser. Try the live demo."
      },
      "faq": [
        {
          "q": "How do I build a board report automatically from Excel files?",
          "a": "Paste a table straight from Excel, upload a CSV or load the sample data — the tool reads the columns: project, stage, budget, cost, progress, comment. In seconds you get 3 KPIs, a cost-vs-progress chart per stage and a project table with comments, plus CSV export. The result is deterministic: the same input always produces the same report."
        },
        {
          "q": "Does any of the report data go to the cloud?",
          "a": "No. The demo computes 100% in your browser — no server, no data upload, which you can verify in your browser's developer tools. A client deployment works the same way: locally, on-premise, so your data never leaves the company."
        },
        {
          "q": "What does deployment look like and how long is the pilot?",
          "a": "We start with a pilot on a copy of your files — the originals are never touched. A pilot covers one process in at most 10 working days, you see the first working result on day 5, and payment is split 50/50. We build for companies of 20–250 people that report out of Excel."
        },
        {
          "q": "How does the report show where a project is losing margin?",
          "a": "The chart puts cost next to progress for every stage — where cost runs ahead of progress, margin is leaking and the report flags it. Every number comes with an explicit calculation path you can verify by hand — a calculator, not a fortune teller. The pattern comes from a manufacturing-and-construction company running ~30 parallel projects, and the report still assembles in seconds."
        }
      ]
    }
  },
  "dashboard-produkcji": {
    "pl": {
      "seo": {
        "title": "Dashboard produkcji Excel — działające demo | Klarow",
        "description": "Monitoring wykonania produkcji bez sklejania plików: kafle hal z % wykonania, robocizną i statusem, suwak tygodnia. Demo liczy w przeglądarce — wypróbuj na żywo."
      },
      "faq": [
        {
          "q": "Jak działa dashboard produkcji i co robi z moimi plikami?",
          "a": "Narzędzie czyta dane wykonania per hala, etap i tydzień z plików produkcyjnych, które już prowadzisz, i buduje z nich siatkę kafli: kafel = hala z procentem wykonania, robocizną i statusem OK/obserwuj/ryzyko. Klik w kafel rozwija rozbicie na etapy z paskami postępu, a wspólny suwak tygodnia przewija cały portfel naraz. Działa deterministycznie — jak kalkulator, nie wróżka: te same dane wejściowe zawsze dają ten sam wynik."
        },
        {
          "q": "Czy dane produkcyjne wychodzą do chmury?",
          "a": "Nie — narzędzia Klarow działają lokalnie, w Twojej sieci (on-premise), więc dane produkcyjne nie opuszczają firmy. Demo na tej stronie liczy w 100% w przeglądarce: zero serwera, zero wysyłki plików. Dashboard jest przy tym tylko do odczytu — niczego nie nadpisuje w plikach źródłowych."
        },
        {
          "q": "Jak szybko wdrożymy to u siebie i jak wygląda pilot?",
          "a": "Pilot Klarow prowadzimy na kopii Twoich plików, więc niczym nie ryzykujesz — bieżąca praca toczy się bez zmian. Trwa maksymalnie 10 dni roboczych w stałej cenie, pierwszy efekt zobaczysz w dniu 5, a płatność dzielimy 50/50. Budujemy dla firm 20–250 osób „wyrosłych na Excelu” — wdrożenie liczymy w dniach, nie miesiącach."
        },
        {
          "q": "Czy narzędzie nadaje się do monitoringu wykonania produkcji w wielu halach naraz?",
          "a": "Tak — to jego główne zadanie: siatka kafli pokazuje cały portfel w jednym kadrze, a status OK/obserwuj/ryzyko na każdym kaflu od razu wskazuje hale wymagające uwagi. Wspólny suwak tygodnia przestawia wszystkie kafle jednocześnie, więc można wrócić do dowolnego tygodnia i prześledzić, jak zmieniało się wykonanie. Wzorzec narzędzia pochodzi z firmy produkcyjno-budowlanej prowadzącej ~30 równoległych projektów."
        }
      ]
    },
    "en": {
      "seo": {
        "title": "Production dashboard from Excel — live demo | Klarow",
        "description": "Production monitoring without piecing files together: hall tiles with completion %, labour and status, one shared week slider. Try the live in-browser demo."
      },
      "faq": [
        {
          "q": "How does the production dashboard work and what does it do with my files?",
          "a": "The tool reads completion data per hall, stage and week from the production files you already keep and turns them into a tile grid: one tile per hall, with completion %, labour and an OK/watch/risk status. Clicking a tile expands the stage breakdown with progress bars, and a shared week slider moves the whole portfolio at once. It is deterministic — a calculator, not a crystal ball: the same input always gives the same result."
        },
        {
          "q": "Does any production data go to the cloud?",
          "a": "No — Klarow tools run locally, on your own network (on-premise), so production data never leaves the company. The demo on this page computes 100% in the browser: no server, no file upload. The dashboard is also read-only — it never overwrites your source files."
        },
        {
          "q": "How fast can we roll it out, and what does the pilot look like?",
          "a": "We run the Klarow pilot on a copy of your files, so nothing in your day-to-day work is at risk. It takes at most 10 working days at a fixed price, you see the first result on day 5, and payment is split 50/50. We build for companies of 20–250 people that grew up on Excel — deployment is measured in days, not months."
        },
        {
          "q": "Is it suited to monitoring production completion across many halls at once?",
          "a": "Yes — that is its core job: the tile grid shows the whole portfolio in a single frame, and the OK/watch/risk status on each tile immediately flags the halls that need attention. The shared week slider moves every tile at once, so you can go back to any week and trace how completion changed. The pattern behind the tool comes from a manufacturing-and-construction company running ~30 parallel projects."
        }
      ]
    }
  },
  "audyt-jakosci-danych": {
    "pl": {
      "seo": {
        "title": "Audyt jakości danych Excel — działające demo | Klarow",
        "description": "Wykrywanie błędów w plikach Excel jednym przebiegiem: reguły pod Twoje dane i macierz OK/UWAGA/BŁĄD. Tylko odczyt, zero chmury. Wypróbuj demo na żywo."
      },
      "faq": [
        {
          "q": "Jak działa audyt jakości danych i co robi z naszymi plikami Excel?",
          "a": "Audyt Klarow czyta pliki budżetowe i operacyjne, po czym jednym przebiegiem sprawdza je według reguł — np. ujemne estymaty, wartości poza zakresem, daty poza tygodniem raportowym. Wynikiem jest raport błędów oraz macierz pewności OK/UWAGA/BŁĄD per projekt. Narzędzie działa wyłącznie w trybie odczytu, więc niczego w plikach nie zmienia."
        },
        {
          "q": "Czy podczas audytu jakiekolwiek dane wychodzą do chmury?",
          "a": "Nie — nic nie jest nigdzie wysyłane. Narzędzia Klarow działają lokalnie, on-premise, więc dane nie opuszczają firmy, a demo na tej stronie liczy w całości w przeglądarce, bez serwera. Do tego audyt tylko czyta pliki — zero ryzyka nadpisania czegokolwiek."
        },
        {
          "q": "Jak szybko można wdrożyć audyt u nas i jak wygląda pilot?",
          "a": "Wdrożenie audytu jakości danych zaczynamy od pilota na kopii Waszych plików — nie dotykamy danych produkcyjnych, a reguły dopasowujemy do tego, jak naprawdę wyglądają Wasze arkusze. Pilot trwa do 10 dni roboczych, pierwszy efekt pokazujemy w dniu 5, rozliczenie 50/50. Pracujemy z firmami 20–250 osób, które wyrosły na Excelu."
        },
        {
          "q": "Jakie błędy w plikach Excel wykrywa audyt jakości danych?",
          "a": "Audyt jakości danych wykrywa m.in. ujemne estymaty, wartości poza dopuszczalnym zakresem i daty poza tygodniem raportowym; reguły dopasowujemy do Waszych danych — to nie jest ogólny linter. Każde znalezisko trafia do macierzy OK/UWAGA/BŁĄD obejmującej cały portfel naraz, w praktyce ~30 równoległych projektów. Silnik jest deterministyczny: te same pliki zawsze dają ten sam wynik — kalkulator, nie wróżka."
        }
      ]
    },
    "en": {
      "seo": {
        "title": "Data Quality Audit for Excel — Live Demo | Klarow",
        "description": "Catch errors in Excel files in one pass: rules tailored to your data and an OK/WATCH/ERROR confidence matrix. Read-only, zero cloud. Try the live demo."
      },
      "faq": [
        {
          "q": "How does the data quality audit work and what does it do with our Excel files?",
          "a": "The Klarow audit reads your budget and operational files and checks them in one pass against rules — e.g. negative estimates, out-of-range values, dates outside the reporting week. The output is an error report plus an OK/WATCH/ERROR confidence matrix per project. The tool is strictly read-only, so it never changes anything in your files."
        },
        {
          "q": "Does any of our data go to the cloud during the audit?",
          "a": "No — nothing is sent anywhere. Klarow tools run locally, on-premise, so your data never leaves the company, and the demo on this page computes entirely in your browser, with no server involved. On top of that, the audit only reads files — zero risk of overwriting anything."
        },
        {
          "q": "How quickly can this be deployed at our company, and what does the pilot look like?",
          "a": "We deploy the data quality audit through a pilot on a copy of your files, so production data is never touched, and we tailor the rules to how your spreadsheets actually look. The pilot takes up to 10 working days, with the first results on day 5 and a 50/50 payment split. We work with companies of 20–250 people that grew up on Excel."
        },
        {
          "q": "What kinds of errors in Excel files does the data quality audit detect?",
          "a": "The data quality audit detects issues such as negative estimates, out-of-range values and dates outside the reporting week; we tailor the rule set to your data rather than shipping a generic linter. Every finding lands in an OK/WATCH/ERROR matrix covering the whole portfolio at once, in practice around 30 parallel projects. The engine is deterministic: the same files always produce the same result — a calculator, not a fortune-teller."
        }
      ]
    }
  },
  "import-z-rekoncyliacja": {
    "pl": {
      "seo": {
        "title": "Import danych z rekoncyliacją — sumy co do grosza | Klarow",
        "description": "Import danych z rekoncyliacją: diff wobec poprzedniej wersji i uzgodnienie sum co do grosza — PASS/FAIL, zanim zatwierdzisz. Wypróbuj demo na żywo w przeglądarce."
      },
      "faq": [
        {
          "q": "Jak działa import danych z rekoncyliacją i co robi z moimi plikami?",
          "a": "Narzędzie wczytuje surowe eksporty (godziny, materiał, koszty) w przeglądarce, pokazuje podgląd i liczy diff wobec poprzedniej wersji — widzisz każdą zmianę. Potem uzgadnia sumy co do grosza i zwraca jednoznaczny wynik PASS/FAIL; dopiero wtedy zatwierdzasz nową wersję."
        },
        {
          "q": "Czy moje dane wychodzą do chmury podczas importu?",
          "a": "Nie. Demo narzędzia „Import z rekoncyliacją” liczy w 100% w przeglądarce — bez serwera i bez wysyłania plików. Wersję wdrożeniową instalujemy lokalnie (on-premise), więc dane nie opuszczają Twojej firmy."
        },
        {
          "q": "Jak szybko możemy to wdrożyć u siebie i jak wygląda pilot?",
          "a": "W Klarow zaczynamy od pilota na kopii Twoich plików: jeden proces, stała cena, płatność 50/50. Pilot zamyka się w maksymalnie 10 dniach roboczych, a pierwszy efekt zwykle widzisz w dniu 5. Pracujemy na kopii, więc produkcyjne pliki niczym nie ryzykują."
        },
        {
          "q": "Skąd pewność, że przy imporcie nic nie zginęło?",
          "a": "Z dowodu, nie z wiary na słowo: rekoncyliacja porównuje sumy przed i po imporcie co do grosza i kończy się jednoznacznym PASS/FAIL z jawnym dowodem. Wynik jest deterministyczny jak kalkulator — te same pliki wejściowe zawsze dają ten sam rezultat — a tryb TEST pozwala wszystko obejrzeć, zanim cokolwiek trafi do plików."
        }
      ]
    },
    "en": {
      "seo": {
        "title": "Import reconciliation — totals match to the cent | Klarow",
        "description": "Import reconciliation for raw data exports: a diff against the previous version and totals checked to the cent — PASS/FAIL before you commit. Try the live demo."
      },
      "faq": [
        {
          "q": "How does import reconciliation work and what does it do with my files?",
          "a": "The tool parses raw exports (hours, material, costs) in the browser, shows a preview and computes a diff against the previous version — you see every change. It then reconciles the totals to the cent and returns a clear PASS/FAIL; only then do you approve the new version."
        },
        {
          "q": "Does any of my data go to the cloud during the import?",
          "a": "No. The Import with reconciliation demo runs 100% in your browser — no server, no file upload. The production version is installed on-premise, so your data never leaves your company."
        },
        {
          "q": "How fast can we deploy this and what does the pilot look like?",
          "a": "At Klarow we start with a pilot on a copy of your files: one process, a fixed price, paid 50/50. The pilot completes in at most 10 working days, and you typically see the first working result on day 5. Because we work on a copy, your production files are never at risk."
        },
        {
          "q": "How do I know nothing was lost during the import?",
          "a": "From proof, not faith: the reconciliation compares totals before and after the import to the cent and ends with an unambiguous PASS/FAIL backed by explicit evidence. The result is deterministic like a calculator — the same input files always produce the same output — and the TEST preview mode lets you inspect everything before anything touches your files."
        }
      ]
    }
  },
  "os-czasu-zadan": {
    "pl": {
      "seo": {
        "title": "Harmonogram Gantta z Excela — porównanie wersji | Klarow",
        "description": "Porównanie wersji harmonogramu na osi Gantta: dwa pasy na zadanie i obsuwy w dniach. Demo liczy w całości w przeglądarce, bez chmury. Wypróbuj na żywo."
      },
      "faq": [
        {
          "q": "Jak działa oś czasu zadań i co robi z naszymi plikami harmonogramu?",
          "a": "Narzędzie czyta tygodniowe snapshoty harmonogramu — niczego w plikach nie nadpisuje — i rysuje każde zadanie jako dwa pasy: poprzedni oraz bieżący plan. Przy zadaniu stoi etykieta dryfu +Nd/−Nd, więc obsuwy widać od razu, bez porównywania dwóch wersji „na oko”. Znacznik „dziś” i suwak daty pokazują, gdzie jesteście względem planu, a wynik można wyeksportować."
        },
        {
          "q": "Czy dane naszego harmonogramu wychodzą do chmury?",
          "a": "Nie. Narzędzia Klarow działają lokalnie, on-premise — harmonogram zostaje w firmie. Demo na tej stronie liczy w całości w przeglądarce: bez serwera, bez wysyłki plików i bez wywołań zewnętrznych API."
        },
        {
          "q": "Jak wygląda wdrożenie u nas i ile trwa pilot?",
          "a": "Pracujemy na kopii Waszych plików, więc bieżąca praca niczym nie ryzykuje. Pilot obejmuje jeden proces, trwa maksymalnie 10 dni roboczych, pierwszy efekt pokazujemy w dniu 5, a płatność dzielimy 50/50. Wdrożenie liczymy w dniach, nie miesiącach."
        },
        {
          "q": "Czym to się różni od harmonogramu Gantta w Excelu?",
          "a": "Wykres Gantta w Excelu pokazuje jeden, aktualny plan — po nadpisaniu pliku historia znika. Nasza oś czasu trzyma dwa snapshoty naraz: pas poprzedni i bieżący dla każdego zadania plus dryf w dniach, więc widać dokładnie, co przesunęło się od zeszłego tygodnia. Wynik jest deterministyczny: te same snapshoty zawsze dają ten sam obraz."
        }
      ]
    },
    "en": {
      "seo": {
        "title": "Schedule Slip Tracking on a Gantt — Live Demo | Klarow",
        "description": "Schedule slip tracking on a Gantt: two bars per task — previous vs current snapshot — with drift in days. The demo runs entirely in your browser. Try it live."
      },
      "faq": [
        {
          "q": "How does the task timeline work and what does it do with our schedule files?",
          "a": "The tool reads weekly snapshots of your schedule — it never overwrites the files — and draws each task as two bars: the previous plan and the current one. A drift label of +N/−N days sits next to each task, so slips are visible at a glance instead of comparing two versions by eye. A “today” marker and a date slider show where you stand, and the result can be exported."
        },
        {
          "q": "Does our schedule data go to the cloud?",
          "a": "No. Klarow tools run locally, on-premise — the schedule stays inside your company. The demo on this page computes entirely in your browser: no server, no file upload, no calls to external APIs."
        },
        {
          "q": "What does deployment look like and how long does the pilot take?",
          "a": "We work on a copy of your files, so day-to-day operations are never at risk. A pilot covers one process, takes at most 10 working days, shows the first working result on day 5, and payment is split 50/50. We measure deployment in days, not months."
        },
        {
          "q": "How is this different from a Gantt chart in Excel?",
          "a": "An Excel Gantt shows one current plan — once the file is overwritten, the history is gone. Our timeline keeps two snapshots side by side: a previous and a current bar for every task plus drift in days, so you see exactly what slipped since last week. And it is deterministic: the same snapshots always render exactly the same picture."
        }
      ]
    }
  },
  "kalkulator-transz": {
    "pl": {
      "seo": {
        "title": "Kalkulator transz — alokacja wpłat na projekty z VAT | Klarow",
        "description": "Rozliczanie transz projektów bez dryfu groszy: alokacja proporcjonalna z VAT, saldo zapłacono/zostało co do grosza. Demo liczy w przeglądarce. Wypróbuj na żywo."
      },
      "faq": [
        {
          "q": "Jak działa rozliczanie transz projektów w kalkulatorze Klarow?",
          "a": "Na wejście podajesz wpłaty i rozdzielnik projektów, a narzędzie rozbija każdą transzę proporcjonalnie na projekty — z VAT. Na wyjściu dostajesz rozpiskę transz, saldo zapłacono/zostało co do grosza i przelicznik walut po zadanym kursie. Demo na tej podstronie działa na żywo, na danych fikcyjnych."
        },
        {
          "q": "Czy dane o wpłatach wychodzą poza firmę, np. do chmury?",
          "a": "Nie. Demo liczy w 100% w przeglądarce — bez serwera i bez wysyłania czegokolwiek do sieci. Narzędzia wdrażamy lokalnie (on-premise), na komputerach klienta, więc dane finansowe nie opuszczają firmy."
        },
        {
          "q": "Jak wygląda wdrożenie kalkulatora transz i ile trwa?",
          "a": "W dni, nie miesiące: pilot trwa do 10 dni roboczych, pierwszy efekt widać w dniu 5, a płatność dzielimy 50/50. Całość prowadzimy na kopii Twoich plików, a oryginały zostają nietknięte."
        },
        {
          "q": "Co z groszami przy alokacji wpłat na projekty z VAT?",
          "a": "Alokacja jest liczona w groszach: każdy projekt dostaje część proporcjonalną, a reszta z zaokrągleń trafia na ostatnią pozycję, więc suma rozbicia równa się wpłacie co do grosza. VAT liczymy deterministycznie — te same dane wejściowe zawsze dają ten sam wynik. Kalkulator, nie wróżka."
        }
      ]
    },
    "en": {
      "seo": {
        "title": "Payment Tranche Allocation Calculator — Live Demo | Klarow",
        "description": "Payment tranche allocation with no cent drift: a proportional split with VAT, paid vs remaining to the cent — entirely in your browser. Try the live demo."
      },
      "faq": [
        {
          "q": "How does payment tranche allocation work in the Klarow calculator?",
          "a": "You enter the payments received and the split across projects, and the tool breaks each tranche down proportionally, VAT included. You get a tranche breakdown, a paid/remaining balance accurate to the cent, and currency conversion at a given rate. The demo on this page runs live on fictional data."
        },
        {
          "q": "Does any payment data leave our company, e.g. to the cloud?",
          "a": "No. The demo computes entirely in your browser — no server, nothing sent over the network. We deploy the tools on-premise, on your own machines, so financial data never leaves your company."
        },
        {
          "q": "What does implementing the tranche calculator look like, and how long does it take?",
          "a": "Days, not months: the pilot takes up to 10 working days, you see the first result on day 5, and payment is split 50/50. We work on a copy of your files throughout, so your originals are never at risk."
        },
        {
          "q": "What happens to the cents when a VAT-inclusive payment is split across projects?",
          "a": "The allocation is computed in cents: each project gets its proportional share and the rounding remainder goes to the last line, so the breakdown always equals the payment to the cent. VAT is computed deterministically — the same input always produces the same result. A calculator, not a crystal ball."
        }
      ]
    }
  },
  "obieg-przelewow": {
    "pl": {
      "seo": {
        "title": "Obieg akceptacji przelewów — działające demo | Klarow",
        "description": "Planowanie płatności w firmie zamiast wniosków w mailach: plan 14-dniowy z decyzją per pozycja, akceptacja na cztery oczy, ślad audytowy. Wypróbuj demo na żywo."
      },
      "faq": [
        {
          "q": "Jak działa obieg akceptacji przelewów w Klarow?",
          "a": "Narzędzie zbiera wnioski o wydatek, waliduje je i buduje z nich 14-dniowy plan płatności. Każda pozycja dostaje decyzję — całość, część lub przeniesienie — a zatwierdzone pozycje są śledzone aż do realnego przelewu. Te same wnioski zawsze dają ten sam plan: to kalkulator, nie wróżka."
        },
        {
          "q": "Czy dane o przelewach wychodzą poza firmę, np. do chmury?",
          "a": "Nie. Narzędzia Klarow działają lokalnie, on-premise — wnioski, decyzje i plan płatności zostają na Waszych maszynach. Demo na tej stronie liczy w 100% w przeglądarce: nie ma serwera, więc nie ma dokąd wysłać danych."
        },
        {
          "q": "Jak szybko wdrożycie obieg akceptacji przelewów u nas i jak wygląda pilot?",
          "a": "Zaczynamy pilotem na kopii Waszych plików, więc nic nie dotyka produkcji. Pilot trwa maksymalnie 10 dni roboczych w stałej cenie, płatność 50/50, a pierwszy działający efekt pokazujemy w dniu 5. Budujemy dla firm 20–250 osób, które wyrosły z Excela."
        },
        {
          "q": "Czy można zaakceptować tylko część wniosku o przelew?",
          "a": "Tak — decyzja zapada per pozycja: całość, część albo przeniesienie na kolejny plan. Niezapłacona reszta nie ginie w mailach, tylko wraca w następnym planie 14-dniowym. Do tego zasada „na cztery oczy”: wnioskodawca nie akceptuje własnego wniosku, a każda decyzja zostaje w śladzie audytowym."
        }
      ]
    },
    "en": {
      "seo": {
        "title": "Payment approval workflow — live working demo | Klarow",
        "description": "Payment approval workflow instead of email threads: a 14-day plan, four-eyes sign-off and an audit trail. The demo runs fully in your browser — try it live."
      },
      "faq": [
        {
          "q": "How does the Klarow payment approval workflow work?",
          "a": "The tool collects spending requests, validates them and builds a 14-day payment plan from them. Each line item gets a decision — full, partial or carry-forward — and approved items are tracked through to the actual transfer. The same requests always produce the same plan: it is a calculator, not a crystal ball."
        },
        {
          "q": "Does any of our payment data leave the company, for example to the cloud?",
          "a": "No. Klarow tools run locally, on-premise — requests, decisions and the payment plan stay on your machines. The demo on this page computes 100% in the browser: there is no server, so there is nowhere for the data to go."
        },
        {
          "q": "How fast can you roll this out for us, and what does the pilot look like?",
          "a": "We start with a pilot on a copy of your files, so nothing touches production. The pilot takes at most 10 working days at a fixed price, paid 50/50, with the first working result on day 5. We build for companies of 20–250 people that have outgrown Excel."
        },
        {
          "q": "Can we approve only part of a payment request?",
          "a": "Yes — decisions are made per line item: pay in full, pay a part, or carry it forward to the next plan. The unpaid remainder does not get lost in email; it comes back in the next 14-day plan. Four-eyes approval applies throughout — the requester never approves their own request, and every decision lands in the audit trail."
        }
      ]
    }
  },
  "billing-us-g703": {
    "pl": {
      "seo": {
        "title": "Fakturowanie budowlane USA (AIA G702/G703) — demo | Klarow",
        "description": "Fakturowanie budowlane USA (AIA G702/G703): silnik liczy, ile fakturować teraz, pilnuje retencji i progu depozytu. Demo liczy w przeglądarce — wypróbuj na żywo."
      },
      "faq": [
        {
          "q": "Jak to narzędzie liczy, ile mam zafakturować, i co robi z moimi arkuszami G703?",
          "a": "Narzędzie odwzorowuje arkusze AIA G702/G703 w USD. Wczytujesz pozycje harmonogramu wartości, a silnik dla każdej pozycji liczy propozycję faktury — wykonanie × wartość minus to, co już zafakturowane — i nadaje status per pozycja. Wynik jest deterministyczny: te same dane wejściowe zawsze dają tę samą propozycję, jak w kalkulatorze."
        },
        {
          "q": "Czy dane rozliczeń z klientami wychodzą gdzieś do chmury?",
          "a": "Nie. Demo fakturowania G703 na stronie Klarow liczy w całości w Twojej przeglądarce — nic nie jest wysyłane na żaden serwer. Wdrożenia u klientów działają lokalnie (on-premise), więc harmonogram wartości, kwoty i retencje nie opuszczają firmy."
        },
        {
          "q": "Jak szybko Klarow wdroży to u nas i jak wygląda pilot?",
          "a": "Wdrażamy w dni, nie miesiące. Pilot prowadzimy na kopii Waszych plików — bieżące fakturowanie działa bez zakłóceń — i zamykamy go w maksymalnie 10 dni roboczych, z pierwszym działającym efektem w dniu 5. Rozliczenie: stała cena, płatność 50/50."
        },
        {
          "q": "Czym jest pay application G703 i co narzędzie liczy automatycznie?",
          "a": "Pay application to standardowy w budownictwie USA wniosek o płatność za wykonany zakres, oparty na arkuszach AIA G702/G703 i harmonogramie wartości. Narzędzie liczy propozycję „ile fakturować teraz” per pozycja, automatycznie uwzględnia retencję i próg depozytu, a statusy pokazują, co jest gotowe do wystawienia. Dla firm produkcyjno-budowlanych — np. w budownictwie modułowym — to wejście w rozliczenia z klientami z USA bez ręcznego liczenia w Excelu."
        }
      ]
    },
    "en": {
      "seo": {
        "title": "AIA G702/G703 Pay Application Tool — Live Demo | Klarow",
        "description": "US construction billing with AIA G702/G703 pay applications: how much to bill now, retention and deposit threshold — computed in your browser. Try the live demo."
      },
      "faq": [
        {
          "q": "How does the tool work out how much to bill, and what does it do with my G703 spreadsheets?",
          "a": "The tool models the AIA G702/G703 sheets in USD. You load your schedule-of-values lines and the engine computes an invoice proposal per line — progress × value minus what has been billed to date — plus a status for every line. It is deterministic: the same input always produces the same proposal, like a calculator."
        },
        {
          "q": "Does any of my billing data go to the cloud?",
          "a": "No. The G703 billing demo on the Klarow site computes entirely in your browser — nothing is sent to any server. Client deployments run on-premise, on your own machines, so schedule-of-values lines, amounts and retention never leave your company."
        },
        {
          "q": "How quickly can Klarow deploy this for us, and what does the pilot look like?",
          "a": "We deploy in days, not months. The pilot runs on a copy of your files — day-to-day billing continues undisturbed — and closes within 10 working days, with the first working result on day 5. Commercially it is a fixed price with a 50/50 payment split."
        },
        {
          "q": "What is a G703 pay application, and what does the tool compute automatically?",
          "a": "A pay application is the standard US construction request for payment for completed work, based on the AIA G702/G703 forms and a schedule of values. The tool computes the \"how much to bill now\" proposal per line, applies retention and the deposit threshold automatically, and line statuses show what is ready to invoice. For manufacturing and construction companies — modular builders included — it replaces hand-computed \"to bill\" columns in scattered Excel sheets."
        }
      ]
    }
  },
  "kontroling-kosztow": {
    "pl": {
      "seo": {
        "title": "Kontroling kosztów projektu — prognoza marży ETC/EAC | Klarow",
        "description": "Kontroling kosztów projektu: paski budżet/wydatek per etap, edytowalne ETC i prognoza marży (EAC) na żywo. Dane zostają w firmie. Wypróbuj demo w przeglądarce."
      },
      "faq": [
        {
          "q": "Jak działa kontroling kosztów projektu w Klarow?",
          "a": "Narzędzie Klarow „Kontroling kosztów projektu” bierze dane projektu — budżet, koszty poniesione dotychczas i estymaty — i zamienia je w widok kierownika projektu: paski budżet / wydatek / przekroczenie per etap. Estymaty „do końca” (ETC) są edytowalne, a prognoza kosztu końcowego (EAC) i marży przelicza się na żywo. Działa deterministycznie — jak kalkulator, nie wróżka: te same dane wejściowe zawsze dają ten sam wynik."
        },
        {
          "q": "Czy nasze dane kosztowe trafiają do chmury?",
          "a": "Nie. Narzędzia Klarow działają lokalnie (on-premise), na infrastrukturze firmy — dane kosztowe nie opuszczają organizacji, a wszystkie zmiany są zapisywane lokalnie, bez serwera w chmurze. Demo na tej stronie liczy w 100% w przeglądarce, więc możesz je sprawdzić bez wysyłania czegokolwiek."
        },
        {
          "q": "Jak szybko można wdrożyć to narzędzie u nas w firmie?",
          "a": "Wdrożenie zaczynamy od pilota na kopii Waszych plików: jeden proces, stała cena, płatność 50/50 i maksymalnie 10 dni roboczych, z pierwszym działającym efektem zwykle w dniu 5. Praca na kopii oznacza zero ryzyka dla produkcyjnych arkuszy. Budujemy dla firm 20–250 osób, które wyrosły na Excelu."
        },
        {
          "q": "Co oznaczają ETC i EAC w prognozie marży projektu?",
          "a": "ETC (estimate to complete) to edytowalna estymata kosztu „do końca” per etap, a EAC (estimate at completion) to prognoza kosztu końcowego: koszt poniesiony dotychczas plus ETC. Porównanie EAC z budżetem daje liczoną na żywo prognozę marży projektu. Bramka „zatwierdź tydzień” przepuszcza dane dopiero po walidacji — np. ujemne ETC blokuje zatwierdzenie."
        }
      ]
    },
    "en": {
      "seo": {
        "title": "Project cost controlling — ETC/EAC margin forecast | Klarow",
        "description": "Project cost controlling for firms that outgrew Excel: budget/spend bars per stage, editable ETC, live EAC margin forecast. Data stays in-house. Try the live demo."
      },
      "faq": [
        {
          "q": "How does project cost controlling work in Klarow?",
          "a": "Klarow's Project cost controlling tool takes project data — budget, cost to date and estimates — and turns it into a project manager's view: budget / spend / overrun bars per stage. The estimates-to-complete (ETC) are editable, and the estimate-at-completion (EAC) and margin forecast recompute live. It is deterministic — a calculator, not a crystal ball: the same input always gives the same result."
        },
        {
          "q": "Does our cost data go to the cloud?",
          "a": "No. Klarow tools run on-premise, on your own infrastructure — cost data never leaves your company, and all changes are saved locally, with no cloud server involved. The demo on this page computes 100% in the browser, so you can try it without sending anything anywhere."
        },
        {
          "q": "How quickly can the tool be deployed at our company?",
          "a": "We start with a pilot on a copy of your files: one process, a fixed price, a 50/50 payment split and at most 10 business days, with the first working result typically on day 5. Working on a copy means zero risk to your production spreadsheets. We build for companies of 20–250 people that grew up on Excel."
        },
        {
          "q": "What do ETC and EAC mean in a project margin forecast?",
          "a": "ETC (estimate to complete) is the editable estimate of remaining cost per stage; EAC (estimate at completion) is the final-cost forecast: cost incurred to date plus ETC. Comparing EAC against the budget yields a live project margin forecast. The “approve week” gate only passes data that survives validation — a negative ETC, for example, blocks approval."
        }
      ]
    }
  },
  "importy-erp": {
    "pl": {
      "seo": {
        "title": "Automatyczny import z ERP do Excela — demo na żywo | Klarow",
        "description": "Automatyczny import danych z ERP do Excela: klasyfikacja słownikiem, tylko nowe wiersze, tryb TEST i backup. Dane nie opuszczają firmy. Wypróbuj demo na żywo."
      },
      "faq": [
        {
          "q": "Jak działa import z ERP do Excela i co robi z moimi plikami?",
          "a": "Wczytujemy eksporty z ERP lub magazynu (roboczogodziny, materiał, koszty pozostałe, przerób), słownik klasyfikuje pozycje, a do Twoich plików Excel trafiają wyłącznie nowe wiersze — duplikaty są odfiltrowywane. Przed każdym zapisem powstaje backup, operacja trafia do logu audytowego, a sumy przechodzą sanity-check co do grosza. Wzorzec sprawdzony w firmie produkcyjno-budowlanej przetwarzającej ~10 000 wierszy kosztów z ERP miesięcznie."
        },
        {
          "q": "Czy dane z ERP wychodzą do chmury?",
          "a": "Nie — narzędzia Klarow działają lokalnie (on-premise), na komputerach w Twojej firmie, więc dane z ERP nie opuszczają firmy. Nie ma serwera w chmurze ani zewnętrznych API, a demo na tej stronie liczy w 100% w przeglądarce. Samo wdrożenie również prowadzimy na kopii plików, nie na danych produkcyjnych."
        },
        {
          "q": "Jak wygląda wdrożenie automatycznego importu danych z ERP u nas w firmie?",
          "a": "Zaczynamy od pilota na kopii plików: jeden proces, stała cena, płatność 50/50 i do 10 dni roboczych — pierwszy efekt zwykle w dniu 5. Konfigurujemy słownik pod Twoje kategorie kosztów i strukturę plików, a Ty sprawdzasz każdy przebieg w trybie TEST, zanim cokolwiek zostanie zapisane. Budujemy dla firm 20–250 osób, które wyrosły na Excelu."
        },
        {
          "q": "Skąd pewność, że import niczego nie nadpisze ani nie zdubluje?",
          "a": "Import dopisuje do Twoich plików Excel wyłącznie nowe wiersze (deduplikacja), a tryb TEST pokazuje pełny podgląd zmian, zanim cokolwiek trafi do pliku. Przed zapisem powstaje backup, każda operacja ląduje w logu audytowym, a sumy są sprawdzane co do grosza. Silnik jest przy tym deterministyczny — te same dane wejściowe zawsze dają ten sam wynik: kalkulator, nie wróżka."
        }
      ]
    },
    "en": {
      "seo": {
        "title": "Automated ERP to Excel import — live demo | Klarow",
        "description": "Automated ERP to Excel import: dictionary classification, only new rows, TEST preview, backup before writing. Data never leaves your company. Try the live demo."
      },
      "faq": [
        {
          "q": "How does the ERP to Excel import work and what does it do with my files?",
          "a": "We load exports from your ERP or warehouse system (labour hours, materials, other costs, output), a dictionary classifies the entries, and only new rows reach your Excel files — duplicates are filtered out. Before every write the tool makes a backup, records the operation in an audit log, and sanity-checks the totals to the cent. The pattern proved itself at a production-and-construction company processing ~10,000 ERP cost rows a month."
        },
        {
          "q": "Does any of my ERP data go to the cloud?",
          "a": "No — Klarow tools run locally (on-premise), on machines inside your company, so ERP data never leaves the building. There is no cloud server and no external API, and the demo on this page computes 100% in your browser. Implementation also runs on a copy of your files, not on production data."
        },
        {
          "q": "What does implementation look like and how fast is the pilot?",
          "a": "We start with a pilot on a copy of your files: one process, a fixed price, 50/50 payment and up to 10 working days — with the first result typically on day 5. We configure the dictionary for your cost categories and file structure, and you verify every run in TEST mode before anything is written. We build for companies of 20–250 people that grew up on Excel."
        },
        {
          "q": "How do I know the import won't overwrite or duplicate anything?",
          "a": "The import appends only new rows to your Excel files (deduplication), and TEST mode shows a full preview of the changes before anything touches your file. Every write is preceded by a backup and recorded in an audit log, and totals are checked to the cent. The engine is also deterministic — the same input always produces the same result: a calculator, not a fortune teller."
        }
      ]
    }
  },
  "protokoly-robocizny": {
    "pl": {
      "seo": {
        "title": "Protokoły robocizny podwykonawców — działające demo | Klarow",
        "description": "Rozliczanie godzin podwykonawców bez ręcznego sumowania: miesięczne protokoły robocizny PDF, jawne statusy akceptacji aż do faktury. Zobacz działające demo."
      },
      "faq": [
        {
          "q": "Jak działa narzędzie Protokoły robocizny i co robi z moimi rejestrami godzin?",
          "a": "Narzędzie czyta rejestry godzin i generuje z nich miesięczne protokoły kosztu pracy per podwykonawca — gotowe dokumenty PDF. Kreator prowadzi każdy protokół przez cykl DRAFT → akceptacja → faktura, z jawnym statusem na każdym kroku. Wynik jest deterministyczny: te same rejestry dają zawsze identyczny protokół."
        },
        {
          "q": "Czy godziny i stawki podwykonawców wychodzą poza firmę, np. do chmury?",
          "a": "Nie. Narzędzia Klarow działają lokalnie, na komputerach w Waszej firmie — rejestry godzin, stawki i protokoły nie opuszczają firmowej infrastruktury. Demo na tej stronie liczy w 100% w przeglądarce: zero serwera i zero wysyłki danych."
        },
        {
          "q": "Jak szybko wdrożymy rozliczanie godzin podwykonawców u nas w firmie?",
          "a": "Zaczynamy od pilota na kopii Waszych plików, więc dane produkcyjne pozostają nietknięte. Pilot to maksymalnie 10 dni roboczych, pierwszy działający efekt pokazujemy w dniu 5, rozliczenie 50/50. Pracujemy z firmami 20–250 osób, które dziś prowadzą te rozliczenia w Excelu."
        },
        {
          "q": "Skąd wiem, który protokół robocizny utknął w akceptacji?",
          "a": "Każdy dokument ma jawny status w cyklu życia — od DRAFT, przez kolejne stopnie akceptacji, aż po fakturę — więc zaległe protokoły widać na liście od razu, bez szukania w skrzynce. Narzędzie prowadzi log wysyłek i wykrywa brakujące adresy, zanim dokument gdziekolwiek pójdzie. Kalendarz kosztu pracy per projekt domyka obraz całości."
        }
      ]
    },
    "en": {
      "seo": {
        "title": "Labour cost protocols for subcontractors — live demo | Klarow",
        "description": "Monthly labour cost protocols per subcontractor straight from hour registers — approval statuses up to invoicing, no manual summing. Try the live demo."
      },
      "faq": [
        {
          "q": "How does the Labour protocols tool work and what does it do with my hour registers?",
          "a": "The tool reads your hour registers and turns them into monthly labour-cost protocols per subcontractor, as finished PDF documents. A wizard walks each protocol through the DRAFT → approval → invoice cycle with an explicit status at every step. The result is deterministic: the same registers always produce the same protocol."
        },
        {
          "q": "Do subcontractor hours and rates leave the company, e.g. to the cloud?",
          "a": "No. Klarow tools run on-premise, on your company's own machines — hour registers, rates and protocols never leave your infrastructure. The demo on this page computes 100% in the browser: no server, no data upload."
        },
        {
          "q": "How fast can we roll out subcontractor hour settlement in our company?",
          "a": "We start with a pilot on a copy of your files, so production data stays untouched. The pilot takes at most 10 business days, we show the first working result on day 5, and payment is split 50/50. We work with companies of 20–250 people who currently run these settlements in Excel."
        },
        {
          "q": "How do I know which labour protocol is stuck in approval?",
          "a": "Every document carries an explicit lifecycle status — from DRAFT through the approval steps to invoice — so overdue protocols show up on the list at once, no inbox digging. The tool keeps a send log and flags missing addresses before a document goes out. A labour-cost calendar per project completes the picture."
        }
      ]
    }
  },
  "rejestr-umow": {
    "pl": {
      "seo": {
        "title": "Elektroniczny rejestr umów ze skanami — demo | Klarow",
        "description": "Elektroniczny rejestr umów ze skanami: koniec psujących się linków w Excelu. Import/eksport arkusza, historia zmian, dane zostają w firmie. Wypróbuj demo na żywo."
      },
      "faq": [
        {
          "q": "Jak działa elektroniczny rejestr umów i co robi z moimi plikami?",
          "a": "Umowy dodajesz formularzem albo wczytujesz istniejący plik Excel i ZIP ze skanami — narzędzie buduje z nich rejestr z drzewem skanów PDF i cyklem życia każdej umowy. W drugą stronę eksportuje arkusz z linkami względnymi, więc Excel pozostaje źródłem prawdy i rejestr działa dalej po przeniesieniu katalogu."
        },
        {
          "q": "Czy dane umów albo skany trafiają do chmury?",
          "a": "Nie. Narzędzia Klarow działają lokalnie, na sprzęcie firmy — umowy i skany nie opuszczają Twojej infrastruktury. Demo na tej stronie liczy w 100% w Twojej przeglądarce: bez serwera i bez wysyłania danych."
        },
        {
          "q": "Jak wygląda wdrożenie rejestru umów u nas w firmie?",
          "a": "Zaczynamy pilotem na kopii Twoich plików: stała cena, maksymalnie 10 dni roboczych, płatność 50/50, pierwszy efekt w dniu 5. Pracujemy na kopii, więc dotychczasowy rejestr działa bez zakłóceń przez całe wdrożenie."
        },
        {
          "q": "Prowadzimy rejestr umów w Excelu, a linki do skanów ciągle się psują — czy musimy rezygnować z Excela?",
          "a": "Nie — wymiana jest dwukierunkowa, a arkusz pozostaje źródłem prawdy. Narzędzie wykrywa i naprawia duplikaty oraz zepsute linki, a przy eksporcie zapisuje linki względne zamiast bezwzględnych ścieżek, które psują się przy każdym przeniesieniu folderu. Każda umowa ma przy tym pełną historię zmian."
        }
      ]
    },
    "en": {
      "seo": {
        "title": "Contract register with scans — live demo | Klarow",
        "description": "A contract register with scans and two-way Excel exchange — no more breaking links. Change history per contract, data stays in-house. Try the live demo."
      },
      "faq": [
        {
          "q": "How does the contract register work and what does it do with my files?",
          "a": "You add contracts through a form or load an existing Excel file plus a ZIP of scans — the tool builds a register with a PDF scan tree and a lifecycle for each contract. It exports back to a spreadsheet with relative links, so Excel stays the source of truth and the register survives moving the folder."
        },
        {
          "q": "Does any contract data or scan end up in the cloud?",
          "a": "No. Klarow tools run locally, on your own hardware — contracts and scans never leave your infrastructure. The demo on this page runs 100% in your browser: no server, no data upload."
        },
        {
          "q": "What does deployment look like at our company?",
          "a": "We start with a pilot on a copy of your files: a fixed price, up to 10 working days, paid 50/50, with the first result on day 5. Because we work on a copy, your current register keeps running untouched throughout."
        },
        {
          "q": "We keep our contract register in Excel and the scan links keep breaking — do we have to give up Excel?",
          "a": "No — the exchange is two-way and the sheet remains the source of truth. The tool flags and fixes duplicates and broken links, and on export it writes relative links instead of the absolute paths that break whenever a folder moves. Each contract also carries its full change history."
        }
      ]
    }
  }
};
