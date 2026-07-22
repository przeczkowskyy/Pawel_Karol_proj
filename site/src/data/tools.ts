import {
  BarChart3,
  Factory,
  ShieldCheck,
  Database,
  GanttChartSquare,
  Calculator,
  Wallet,
  Landmark,
  FileSignature,
  FolderKanban,
  ArrowLeftRight,
  ClipboardCheck,
} from "lucide-react";
import type { ComponentType } from "react";
import type { Lang } from "@/i18n";

/* Katalog NARZĘDZI Klarow — dashboardy odtworzone OD ZERA na wzór wewnętrznych
   narzędzi kontrolingu/produkcji/finansów firmy produkcyjno-budowlanej.
   Twarda zasada #3 CLAUDE.md: zero marki i liczb źródłowych — nazwy generyczne,
   dane fikcyjne, opis neutralny („firma produkcyjno-budowlana").
   status:
     live    → interaktywny dashboard wpięty na podstronie (pełna funkcjonalność),
     preview → opis + zapowiedź (dashboard w budowie),
     soon    → na roadmapie narzędzi.
   Docelowo YAML w site/content/tools/. */

export type ToolStatus = "live" | "preview" | "soon";
export type ToolCategory =
  | "kpi-zarzad"
  | "produkcja"
  | "jakosc-danych"
  | "import-danych"
  | "platnosci"
  | "obieg-dokumentow"
  | "kontroling";

export interface ToolText {
  name: string;
  tagline: string; // 1 zdanie: co robi
  replaces: string; // co zastępuje / oszczędność (bez liczb źródłowych)
  io: string; // wejście → wyjście
  bullets: string[]; // 3–4 konkrety
}

export interface ToolBase {
  id: number;
  slug: string;
  icon: ComponentType<{ size?: number | string; className?: string }>;
  category: ToolCategory;
  status: ToolStatus;
  /* klucz osadzonego dashboardu (tylko dla status:"live") */
  dashboard?: "report" | "production" | "quality" | "timeline" | "payments" | "reconciliation" | "g703";
  i18n: { pl: ToolText; en: ToolText };
}

export interface ToolItem extends ToolText {
  id: number;
  slug: string;
  icon: ToolBase["icon"];
  category: ToolCategory;
  status: ToolStatus;
  dashboard?: ToolBase["dashboard"];
}

export const CATEGORY_LABEL: Record<ToolCategory, { pl: string; en: string }> = {
  "kpi-zarzad": { pl: "KPI / Zarząd", en: "KPI / Management" },
  produkcja: { pl: "Produkcja", en: "Production" },
  "jakosc-danych": { pl: "Jakość danych", en: "Data quality" },
  "import-danych": { pl: "Importy danych", en: "Data imports" },
  platnosci: { pl: "Płatności", en: "Payments" },
  "obieg-dokumentow": { pl: "Obieg dokumentów", en: "Document workflow" },
  kontroling: { pl: "Kontroling kosztów", en: "Cost controlling" },
};

const BASE: ToolBase[] = [
  {
    id: 1,
    slug: "raport-zarzadczy",
    icon: BarChart3,
    category: "kpi-zarzad",
    status: "live",
    dashboard: "report",
    i18n: {
      pl: {
        name: "Raport zarządczy",
        tagline:
          "Panel dla zarządu składany z dziesiątek plików jednym przebiegiem: 3 KPI, wykres kosztu vs zaawansowania per etap i tabela projektów z komentarzami — deterministycznie, bez wysyłania danych do sieci.",
        replaces:
          "Ręczne składanie raportu w Excelu: PowerQuery, przeklejanie, formatowanie, eksport PDF i rozsyłkę — co tydzień od nowa.",
        io: "Tabela CSV/Excel (projekt, etap, budżet, koszt, zaawansowanie, komentarz) → 3 KPI + wykres per-etap + tabela + eksport CSV.",
        bullets: [
          "Wklej tabelę wprost z Excela, wgraj plik lub załaduj przykład",
          "Wykrywa etapy, na których wycieka marża (koszt wyprzedza postęp)",
          "Jawna „ścieżka wyliczenia” — każdą liczbę sprawdzisz ręcznie",
          "100% w Twojej przeglądarce: zero serwera, zero wysyłki danych",
        ],
      },
      en: {
        name: "Board report",
        tagline:
          "A management panel assembled from dozens of files in one pass: 3 KPIs, a cost-vs-progress chart per stage and a project table with comments — deterministically, with no data leaving for the network.",
        replaces:
          "Hand-assembling the report in Excel: PowerQuery, copy-pasting, formatting, PDF export and mailing — every week from scratch.",
        io: "A CSV/Excel table (project, stage, budget, cost, progress, comment) → 3 KPIs + per-stage chart + table + CSV export.",
        bullets: [
          "Paste a table straight from Excel, upload a file or load the example",
          "Spots the stages where margin leaks (cost ahead of progress)",
          "An explicit “calculation path” — verify every number by hand",
          "100% in your browser: no server, no data upload",
        ],
      },
    },
  },
  {
    id: 2,
    slug: "dashboard-produkcji",
    icon: Factory,
    category: "produkcja",
    status: "live",
    dashboard: "production",
    i18n: {
      pl: {
        name: "Dashboard produkcji",
        tagline:
          "Siatka kafli per hala/projekt z wykonaniem procentowym, robocizną i statusem — jeden wspólny suwak tygodnia, klik w kafel pokazuje rozbicie na etapy.",
        replaces:
          "Przeglądanie plików produkcyjnych hala po hali i sklejanie obrazka „gdzie jesteśmy” ręcznie.",
        io: "Dane wykonania per hala/etap/tydzień → interaktywna siatka kafli + rozbicie etapowe (read-only).",
        bullets: [
          "Wspólny suwak tygodnia — cały portfel w jednym kadrze",
          "Kafel = hala: wykonanie %, robocizna, status OK/obserwuj/ryzyko",
          "Klik w kafel → rozbicie na etapy z paskami postępu",
          "Tylko odczyt — narzędzie niczego nie nadpisuje",
        ],
      },
      en: {
        name: "Production dashboard",
        tagline:
          "A grid of tiles per hall/project with completion %, labour and status — one shared week slider; click a tile for the stage breakdown.",
        replaces:
          "Browsing production files hall by hall and assembling the “where are we” picture by hand.",
        io: "Completion data per hall/stage/week → an interactive tile grid + stage breakdown (read-only).",
        bullets: [
          "One shared week slider — the whole portfolio in a single frame",
          "Tile = hall: completion %, labour, OK/watch/risk status",
          "Click a tile → stage breakdown with progress bars",
          "Read-only — the tool never overwrites anything",
        ],
      },
    },
  },
  {
    id: 3,
    slug: "audyt-jakosci-danych",
    icon: ShieldCheck,
    category: "jakosc-danych",
    status: "live",
    dashboard: "quality",
    i18n: {
      pl: {
        name: "Audyt jakości danych",
        tagline:
          "Read-only bramka jakości: jednym przebiegiem sprawdza pliki wg reguł (ujemne estymaty, wartości poza zakresem, daty poza tygodniem) i buduje macierz pewności OK/UWAGA/BŁĄD.",
        replaces:
          "Ręczne oglądanie „na oko” czerwonych komórek w każdym pliku przed raportem lub zamknięciem.",
        io: "Pliki budżetowe/operacyjne → raport błędów + macierz pewności per projekt.",
        bullets: [
          "Tylko czyta — zero ryzyka dla plików",
          "Reguły dopasowane do Twoich danych, nie ogólny linter",
          "Macierz OK/UWAGA/BŁĄD dla całego portfela naraz",
          "Tryb „strażnik”: kontrola przed każdym raportem",
        ],
      },
      en: {
        name: "Data quality audit",
        tagline:
          "A read-only quality gate: checks files in one pass against rules (negative estimates, out-of-range values, dates outside the week) and builds an OK/WATCH/ERROR confidence matrix.",
        replaces:
          "Eyeballing red cells in every file before a report or a close.",
        io: "Budget/operational files → an error report + a confidence matrix per project.",
        bullets: [
          "Read-only — zero risk to your files",
          "Rules tailored to your data, not a generic linter",
          "OK/WATCH/ERROR matrix for the whole portfolio at once",
          "“Guardian” mode: a check before every report",
        ],
      },
    },
  },
  {
    id: 4,
    slug: "import-z-rekoncyliacja",
    icon: Database,
    category: "import-danych",
    status: "live",
    dashboard: "reconciliation",
    i18n: {
      pl: {
        name: "Import z rekoncyliacją",
        tagline:
          "Wczytuje surowe pliki w przeglądarce, liczy różnicę wobec poprzedniej wersji i sprawdza zgodność sum co do grosza (PASS/FAIL) zanim cokolwiek zatwierdzisz.",
        replaces:
          "Odświeżanie zapytań i „wiarę na słowo”, że przy imporcie nic nie zginęło.",
        io: "Surowe eksporty (godziny, materiał, koszty) → podgląd + diff + rekoncyliacja → zatwierdzona wersja.",
        bullets: [
          "Diff wobec poprzedniej wersji — widzisz każdą zmianę",
          "Rekoncyliacja sum co do grosza: PASS/FAIL",
          "Tryb podglądu (TEST) zanim cokolwiek trafi do plików",
          "Cała ingestia w przeglądarce — zero serwera",
        ],
      },
      en: {
        name: "Import with reconciliation",
        tagline:
          "Parses raw files in the browser, computes the diff against the previous version and checks totals to the cent (PASS/FAIL) before you commit anything.",
        replaces:
          "Refreshing queries and taking it “on faith” that nothing was lost on import.",
        io: "Raw exports (hours, material, costs) → preview + diff + reconciliation → an approved version.",
        bullets: [
          "Diff against the previous version — see every change",
          "Totals reconciled to the cent: PASS/FAIL",
          "A preview (TEST) mode before anything touches your files",
          "All ingestion in the browser — no server",
        ],
      },
    },
  },
  {
    id: 5,
    slug: "os-czasu-zadan",
    icon: GanttChartSquare,
    category: "produkcja",
    status: "live",
    dashboard: "timeline",
    i18n: {
      pl: {
        name: "Oś czasu zadań (Gantt)",
        tagline:
          "Każde zadanie jako dwa pasy — poprzedni i bieżący snapshot — z etykietami obsuwy (+/− dni) na przewijanej osi: od razu widać, co się przesunęło od zeszłego tygodnia.",
        replaces:
          "Ręczne porównywanie dwóch wersji harmonogramu „na oko”.",
        io: "Tygodniowe snapshoty harmonogramu → interaktywna oś czasu + eksport.",
        bullets: [
          "Dwa pasy: plan poprzedni vs bieżący",
          "Etykiety dryfu +Nd / −Nd na każdym zadaniu",
          "Znacznik „dziś” i suwak daty",
          "Czysty render — bez zewnętrznych bibliotek",
        ],
      },
      en: {
        name: "Task timeline (Gantt)",
        tagline:
          "Every task as two bars — previous and current snapshot — with drift labels (+/− days) on a scrollable axis: instantly see what slipped since last week.",
        replaces:
          "Comparing two schedule versions by eye.",
        io: "Weekly schedule snapshots → an interactive timeline + export.",
        bullets: [
          "Two bars: previous plan vs current",
          "Drift labels +Nd / −Nd on each task",
          "A “today” marker and a date slider",
          "Clean rendering — no external libraries",
        ],
      },
    },
  },
  {
    id: 6,
    slug: "kalkulator-transz",
    icon: Calculator,
    category: "platnosci",
    status: "live",
    dashboard: "payments",
    i18n: {
      pl: {
        name: "Kalkulator transz i walut",
        tagline:
          "Rozbija wpłacone transze proporcjonalnie na projekty (z VAT), pilnuje ile zapłacono i ile zostało co do grosza; w komplecie przelicznik walut.",
        replaces:
          "Ręczne liczenie „ile z tej wpłaty poszło na projekt X” i dryf groszowy rosnący przy VAT.",
        io: "Wpłaty + rozdzielnik projektów → rozpiska transz + saldo + przelicznik walut.",
        bullets: [
          "Alokacja proporcjonalna z „resztą” na ostatniej pozycji",
          "VAT liczony deterministycznie, bez dryfu groszy",
          "Saldo: zapłacono / zostało — zawsze się spina",
          "Przelicznik walut po zadanym kursie",
        ],
      },
      en: {
        name: "Tranche & FX calculator",
        tagline:
          "Splits paid tranches proportionally across projects (with VAT), tracks paid vs remaining to the cent; includes a currency converter.",
        replaces:
          "Hand-computing “how much of this payment went to project X” and the cent drift that grows with VAT.",
        io: "Payments + a project split → a tranche breakdown + balance + FX converter.",
        bullets: [
          "Proportional allocation with the remainder on the last line",
          "VAT computed deterministically, no cent drift",
          "Balance: paid / remaining — always reconciles",
          "Currency conversion at a given rate",
        ],
      },
    },
  },
  {
    id: 7,
    slug: "obieg-przelewow",
    icon: Wallet,
    category: "platnosci",
    status: "soon",
    i18n: {
      pl: {
        name: "Obieg akceptacji przelewów",
        tagline:
          "Wniosek → walidacja → plan 14-dniowy → decyzja per pozycja (całość/część z przeniesieniem) → tracking realnych przelewów, z akceptacją „na cztery oczy” i audytem.",
        replaces:
          "Wnioski o przelew w mailach i planowanie płatności „na piechotę” w Excelu.",
        io: "Wnioski o wydatek → macierz planu 14-dniowego + decyzje + ślad audytowy.",
        bullets: [
          "Plan 14-dniowy derywowany z wniosków",
          "Decyzja per pozycja: całość / część / przeniesienie",
          "Akceptacja „na cztery oczy” (wnioskodawca ≠ akceptujący)",
          "Ślad audytowy każdej decyzji",
        ],
      },
      en: {
        name: "Payment approval flow",
        tagline:
          "Request → validation → 14-day plan → per-item decision (full/partial with carry-forward) → real transfer tracking, with four-eyes approval and an audit trail.",
        replaces:
          "Payment requests in email and planning payments by hand in Excel.",
        io: "Spending requests → a 14-day plan matrix + decisions + an audit trail.",
        bullets: [
          "A 14-day plan derived from the requests",
          "Per-item decision: full / partial / carry-forward",
          "Four-eyes approval (requester ≠ approver)",
          "An audit trail for every decision",
        ],
      },
    },
  },
  {
    id: 8,
    slug: "billing-us-g703",
    icon: Landmark,
    category: "platnosci",
    status: "live",
    dashboard: "g703",
    i18n: {
      pl: {
        name: "Fakturowanie US (AIA G703)",
        tagline:
          "Odwzorowanie arkuszy AIA G702/G703 (USD): silnik liczy „ile fakturować teraz” (wykonanie × wartość − dotychczas), pilnuje progu depozytu i retencji, statusy per pozycja.",
        replaces:
          "Rozproszone arkusze G703 i ręczne liczenie „do wystawienia” w Excelu.",
        io: "Pozycje harmonogramu wartości → propozycja faktury + statusy per pozycja.",
        bullets: [
          "Silnik propozycji: wykonanie × wartość − dotychczas",
          "Retencja i próg depozytu liczone automatycznie",
          "Statusy per pozycja i aplikacja płatnicza",
          "Otwiera wejście na rynek USA (budownictwo modułowe)",
        ],
      },
      en: {
        name: "US billing (AIA G703)",
        tagline:
          "A model of AIA G702/G703 sheets (USD): the engine computes “how much to bill now” (progress × value − billed), watches the deposit threshold and retention, statuses per line.",
        replaces:
          "Scattered G703 sheets and hand-computing “to bill” in Excel.",
        io: "Schedule-of-values lines → an invoice proposal + statuses per line.",
        bullets: [
          "Proposal engine: progress × value − billed to date",
          "Retention and deposit threshold computed automatically",
          "Statuses per line and pay application",
          "Opens the US market (modular construction)",
        ],
      },
    },
  },
  {
    id: 9,
    slug: "kontroling-kosztow",
    icon: FolderKanban,
    category: "kontroling",
    status: "soon",
    i18n: {
      pl: {
        name: "Kontroling kosztów projektu",
        tagline:
          "Widok PM: paski budżet/wydatek/przekroczenie per etap, edytowalne estymaty do końca, prognoza marży na żywo i bramka „zatwierdź tydzień”.",
        replaces:
          "Pracę wprost w komórkach arkusza bez walidacji i wersjonowania.",
        io: "Dane projektu (budżet/koszt/estymaty) → interaktywny widok kontrolingowy + zapisy lokalne.",
        bullets: [
          "Paski budżet / wydatek / przekroczenie per etap",
          "Edytowalne estymaty „do końca” (ETC) z prognozą marży",
          "Bramka „zatwierdź tydzień” z walidacją",
          "Zmiany trzymane lokalnie (bez chmury)",
        ],
      },
      en: {
        name: "Project cost controlling",
        tagline:
          "PM view: budget/spend/overrun bars per stage, editable estimates-to-complete, a live margin forecast and an “approve week” gate.",
        replaces:
          "Working straight in spreadsheet cells with no validation or versioning.",
        io: "Project data (budget/cost/estimates) → an interactive controlling view + local saves.",
        bullets: [
          "Budget / spend / overrun bars per stage",
          "Editable estimates-to-complete with a margin forecast",
          "An “approve week” gate with validation",
          "Changes kept locally (no cloud)",
        ],
      },
    },
  },
  {
    id: 10,
    slug: "importy-erp",
    icon: ArrowLeftRight,
    category: "import-danych",
    status: "soon",
    i18n: {
      pl: {
        name: "Importy ERP → Excel",
        tagline:
          "Rodzina importów (roboczogodziny, materiał/magazyn, koszty pozostałe, przerób): klasyfikacja słownikiem, deduplikacja, tryb TEST z podglądem zmian, backup i log.",
        replaces:
          "Ręczne przeklejanie tysięcy wierszy z ERP/magazynu do plików co tydzień.",
        io: "Eksporty z ERP/magazynu → klasyfikacja + tylko nowe wiersze → Twoje pliki (z backupem).",
        bullets: [
          "Klasyfikacja konfigurowalnym słownikiem, tylko NOWE wiersze",
          "Tryb TEST: pełny podgląd zmian przed zapisem",
          "Backup przed zapisem + log audytowy",
          "Sanity-check sum co do grosza",
        ],
      },
      en: {
        name: "ERP → Excel imports",
        tagline:
          "A family of imports (labour hours, material/warehouse, other costs, output): dictionary classification, deduplication, a TEST preview, backup and log.",
        replaces:
          "Hand-pasting thousands of rows from the ERP/warehouse into files every week.",
        io: "ERP/warehouse exports → classification + only new rows → your files (with backup).",
        bullets: [
          "Classification by a configurable dictionary, only NEW rows",
          "TEST mode: full change preview before writing",
          "Backup before writing + an audit log",
          "Totals sanity-checked to the cent",
        ],
      },
    },
  },
  {
    id: 11,
    slug: "protokoly-robocizny",
    icon: ClipboardCheck,
    category: "obieg-dokumentow",
    status: "soon",
    i18n: {
      pl: {
        name: "Protokoły robocizny",
        tagline:
          "Z rejestrów godzin generuje miesięczne protokoły kosztu pracy per podwykonawca i prowadzi je przez wielostopniową akceptację aż do faktury.",
        replaces:
          "Ręczne sumowanie godzin, przeklejanie do dokumentu i pilnowanie akceptacji w skrzynce.",
        io: "Rejestry godzin → protokoły (PDF) + statusy akceptacji + kalendarz kosztów.",
        bullets: [
          "Kreator DRAFT → akceptacja → faktura",
          "Cykl życia dokumentu z jawnymi statusami",
          "Kalendarz kosztu pracy per projekt",
          "Log wysyłek i wykrywanie braków adresów",
        ],
      },
      en: {
        name: "Labour protocols",
        tagline:
          "Turns hour registers into monthly labour-cost protocols per subcontractor and runs them through multi-step approval up to invoicing.",
        replaces:
          "Summing hours by hand, pasting into a document and chasing approvals in the inbox.",
        io: "Hour registers → protocols (PDF) + approval statuses + a cost calendar.",
        bullets: [
          "DRAFT → approval → invoice wizard",
          "Document lifecycle with explicit statuses",
          "Labour-cost calendar per project",
          "Send log and missing-address detection",
        ],
      },
    },
  },
  {
    id: 12,
    slug: "rejestr-umow",
    icon: FileSignature,
    category: "obieg-dokumentow",
    status: "soon",
    i18n: {
      pl: {
        name: "Rejestr umów",
        tagline:
          "Elektroniczny rejestr umów ze skanami i dwukierunkową wymianą z Excelem — koniec pliku z psującymi się linkami i duplikatami.",
        replaces:
          "Ręcznie prowadzony plik Excel z bezwzględnymi linkami do skanów, które ciągle się psują.",
        io: "Formularz / plik Excel / ZIP → rejestr + drzewo skanów; eksport z linkami względnymi.",
        bullets: [
          "CRUD umów ze skanem PDF i cyklem życia",
          "Import/eksport Excel (arkusz = źródło prawdy)",
          "Naprawa duplikatów i psujących się linków",
          "Historia zmian per umowa",
        ],
      },
      en: {
        name: "Contract register",
        tagline:
          "An electronic contract register with scans and two-way Excel exchange — no more file with breaking links and duplicates.",
        replaces:
          "A hand-kept Excel file with absolute links to scans that keep breaking.",
        io: "Form / Excel file / ZIP → register + a scan tree; export with relative links.",
        bullets: [
          "Contract CRUD with a PDF scan and lifecycle",
          "Excel import/export (the sheet is the source of truth)",
          "Fixes duplicates and breaking links",
          "Change history per contract",
        ],
      },
    },
  },
];

export function getTools(lang: Lang): ToolItem[] {
  return BASE.map((b) => ({
    id: b.id,
    slug: b.slug,
    icon: b.icon,
    category: b.category,
    status: b.status,
    dashboard: b.dashboard,
    ...b.i18n[lang],
  }));
}

export const findTool = (slug: string, lang: Lang): ToolItem | undefined =>
  getTools(lang).find((t) => t.slug === slug);
