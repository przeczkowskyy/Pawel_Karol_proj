import {
  ShieldCheck,
  BarChart3,
  Database,
  CalendarCheck,
  Factory,
  Gauge,
  FileSignature,
  Wallet,
} from "lucide-react";
import type { TimelineItem } from "@/components/ui/radial-orbital-timeline";
import type { Lang } from "@/i18n";

/* Katalog modułów Klarow (M1–M8 z planu strategicznego), dwujęzyczny.
   date = czas wdrożenia · category = dział · energy = gotowość wzorca ·
   relatedIds = powiązania · image = zrzut narzędzia (placeholder do czasu
   dostarczenia realnych zrzutów). Docelowo YAML w site/content/modules/. */

export interface ModuleItem extends TimelineItem {
  slug: string;
  image: string;
  saves: string;
  benefits: string[];
}

interface ModuleText {
  title: string;
  date: string;
  category: string;
  content: string;
  saves: string;
  benefits: string[];
}

interface ModuleBase {
  id: number;
  slug: string;
  icon: ModuleItem["icon"];
  relatedIds: number[];
  status: TimelineItem["status"];
  energy: number;
  image: string;
  i18n: { pl: ModuleText; en: ModuleText };
}

const PLACEHOLDER = "/screens/placeholder.svg";

const BASE: ModuleBase[] = [
  {
    id: 1,
    slug: "audyt-jakosci-danych",
    icon: ShieldCheck,
    relatedIds: [2, 3, 4],
    status: "completed",
    energy: 90,
    image: PLACEHOLDER,
    i18n: {
      pl: {
        title: "Audyt jakości danych",
        date: "5 dni",
        category: "Przekrojowy · wedge",
        content:
          "Walidator, który jednym przebiegiem sprawdza wszystkie Twoje pliki według reguł dopasowanych do Twoich danych: raport błędów + macierz pewności OK/UWAGA/BŁĄD. Tylko czyta — zero ryzyka dla plików. Nasza oferta wejściowa.",
        saves: "błędy wychwycone PRZED raportem, nie po fakcie",
        benefits: [
          "Wszystkie pliki sprawdzone jednym przebiegiem zamiast otwierania każdego „na oko”",
          "Macierz pewności OK/UWAGA/BŁĄD dla całego portfela",
          "Tryb „strażnik”: automatyczna kontrola przed każdym raportem lub zamknięciem",
          "Zero ryzyka — narzędzie tylko czyta; jedyny zapis to własny raport",
        ],
      },
      en: {
        title: "Data quality audit",
        date: "5 days",
        category: "Cross-cutting · wedge",
        content:
          "A validator that checks all your files in a single pass against rules tailored to your data: an error report plus an OK/WATCH/ERROR confidence matrix. Read-only — zero risk to your files. Our entry offer.",
        saves: "errors caught BEFORE the report, not after the fact",
        benefits: [
          "Every file checked in one pass instead of opening each one “by eye”",
          "OK/WATCH/ERROR confidence matrix for the whole portfolio",
          "“Guardian” mode: automatic checks before every report or close",
          "Zero risk — the tool only reads; the only output is its own report",
        ],
      },
    },
  },
  {
    id: 2,
    slug: "raport-zarzadczy",
    icon: BarChart3,
    relatedIds: [1, 6],
    status: "completed",
    energy: 85,
    image: PLACEHOLDER,
    i18n: {
      pl: {
        title: "Raport zarządczy",
        date: "5–10 dni",
        category: "KPI / Zarząd",
        content:
          "Raport dla zarządu składany jednym kliknięciem z dziesiątek plików: jednoplikowy interaktywny HTML + XLSX, w kilkanaście sekund zamiast godzin. Liczby weryfikowane o zgodność z Twoim dotychczasowym raportem.",
        saves: "z godzin składania do kilkunastu sekund generowania",
        benefits: [
          "Jeden plik HTML: sortowanie, szczegóły projektów, eksport CSV/PDF — bez instalacji",
          "Aktualizacja o nowy tydzień danych w kilkanaście sekund",
          "Weryfikacja zgodności liczb z dotychczasowym raportem („stare vs nowe”)",
          "Twoje pliki tylko czytamy — raport powstaje obok, nic nie nadpisujemy",
        ],
      },
      en: {
        title: "Board report",
        date: "5–10 days",
        category: "KPI / Management",
        content:
          "The management report assembled with one click from dozens of files: a single-file interactive HTML + XLSX, in seconds instead of hours. Numbers verified against your current report.",
        saves: "from hours of assembling to seconds of generating",
        benefits: [
          "One HTML file: sorting, project details, CSV/PDF export — no installation",
          "Adding a new week of data takes seconds",
          "Numbers verified against your existing report (“old vs new”)",
          "We only read your files — the report is built alongside, nothing is overwritten",
        ],
      },
    },
  },
  {
    id: 3,
    slug: "importy-erp",
    icon: Database,
    relatedIds: [1, 4],
    status: "in-progress",
    energy: 70,
    image: PLACEHOLDER,
    i18n: {
      pl: {
        title: "Importy ERP → Excel",
        date: "5–15 dni / import",
        category: "Księgowość / Finanse",
        content:
          "Koniec przeklejania tysięcy wierszy: import z ERP/magazynu do Twoich plików z klasyfikacją słownikiem, deduplikacją, trybem TEST z pełnym podglądem zmian, backupem przed zapisem i logiem audytowym.",
        saves: "praca „z godzin do minut” przy każdym cyklu importu",
        benefits: [
          "Klasyfikacja wierszy konfigurowalnym słownikiem, deduplikacja, tylko NOWE wiersze",
          "Tryb TEST: pełny podgląd zmian zanim cokolwiek trafi do plików",
          "Backup przed zapisem + log audytowy każdej operacji",
          "Sanity-check sum co do grosza",
        ],
      },
      en: {
        title: "ERP → Excel imports",
        date: "5–15 days / import",
        category: "Accounting / Finance",
        content:
          "No more pasting thousands of rows: imports from your ERP/warehouse system into your files with dictionary-based classification, deduplication, a TEST mode with a full change preview, backup before every write and an audit log.",
        saves: "work goes “from hours to minutes” every import cycle",
        benefits: [
          "Rows classified by a configurable dictionary, deduplicated, only NEW rows added",
          "TEST mode: full change preview before anything touches your files",
          "Backup before every write + audit log of every operation",
          "Sanity checks of totals to the cent",
        ],
      },
    },
  },
  {
    id: 4,
    slug: "zamkniecie-cyklu",
    icon: CalendarCheck,
    relatedIds: [1, 3],
    status: "in-progress",
    energy: 65,
    image: PLACEHOLDER,
    i18n: {
      pl: {
        title: "Zamknięcie cyklu",
        date: "3–7 dni",
        category: "Finanse / Kontroling",
        content:
          "Cotygodniowa konsolidacja wielu plików do raportu zbiorczego i hurtowa publikacja oficjalnych wersji jednym przyciskiem — z walidacją, archiwum i zawsze jednoznaczną „wersją prawdy”.",
        saves: "zamknięcie ~30 projektów w kilkanaście sekund zamiast ręcznie folder po folderze",
        benefits: [
          "Konsolidacja „kopiuj-wklej wartości” z wielu plików jednym przebiegiem",
          "Publikacja oficjalnych wersji hurtowo, z archiwum i historią",
          "Domyślnie DRY-RUN; zapis tylko przy czystej walidacji",
          "Zawsze wiadomo, która wersja jest oficjalna",
        ],
      },
      en: {
        title: "Cycle close",
        date: "3–7 days",
        category: "Finance / Controlling",
        content:
          "Weekly consolidation of many files into a summary report and bulk publishing of official versions with one click — with validation, an archive and an always unambiguous “version of truth”.",
        saves: "closing ~30 projects in seconds instead of manually, folder by folder",
        benefits: [
          "“Copy-paste values” consolidation from many files in a single pass",
          "Official versions published in bulk, with archive and history",
          "DRY-RUN by default; writes only when validation is clean",
          "You always know which version is official",
        ],
      },
    },
  },
  {
    id: 5,
    slug: "wykonanie-produkcji",
    icon: Factory,
    relatedIds: [3],
    status: "in-progress",
    energy: 60,
    image: PLACEHOLDER,
    i18n: {
      pl: {
        title: "Wykonanie produkcji",
        date: "5–10 dni",
        category: "Produkcja",
        content:
          "Procent wykonania produkcji trafia do plików finansowych automatycznie, z bezpiecznikami układu i kontrolkami spójności. Produkcja i finanse widzą wreszcie te same liczby.",
        saves: "jedna wersja prawdy produkcja ↔ finanse",
        benefits: [
          "Koniec ręcznego wklejania wykonania do plików finansowych",
          "Bezpieczniki układu: nieznany format = pominięcie, nie cicha pomyłka",
          "Kontrolki spójności po każdym wpisie",
        ],
      },
      en: {
        title: "Production output",
        date: "5–10 days",
        category: "Production",
        content:
          "Production completion percentages flow into your finance files automatically, with layout guards and consistency checks. Production and finance finally see the same numbers.",
        saves: "one version of truth between production and finance",
        benefits: [
          "No more manual pasting of output into finance files",
          "Layout guards: unknown format = skipped, never a silent mistake",
          "Consistency checks after every write",
        ],
      },
    },
  },
  {
    id: 6,
    slug: "panel-kpi-online",
    icon: Gauge,
    relatedIds: [2],
    status: "pending",
    energy: 40,
    image: PLACEHOLDER,
    i18n: {
      pl: {
        title: "Panel KPI online",
        date: "dodatek",
        category: "KPI / Zarząd",
        content:
          "Hostowany panel w przeglądarce dla wielu odbiorców i ról — rozszerzenie raportu zarządczego dla firm, które go przerosły. Zasilany wyłącznie zagregowanymi danymi, które sami zatwierdzicie.",
        saves: "live panel zamiast rozsyłanego pliku",
        benefits: [
          "Wielu odbiorców i role (zarząd / PM / kontroling)",
          "Tylko zagregowane wskaźniki — dane transakcyjne zostają u Ciebie",
          "Naturalne rozszerzenie modułu Raport zarządczy",
        ],
      },
      en: {
        title: "Online KPI panel",
        date: "add-on",
        category: "KPI / Management",
        content:
          "A hosted, in-browser panel for multiple audiences and roles — an extension of the Board report for companies that have outgrown it. Fed exclusively with aggregated data that you approve yourselves.",
        saves: "a live panel instead of an emailed file",
        benefits: [
          "Multiple audiences and roles (management / PM / controlling)",
          "Aggregated indicators only — transactional data stays with you",
          "A natural extension of the Board report module",
        ],
      },
    },
  },
  {
    id: 7,
    slug: "obieg-dokumentow",
    icon: FileSignature,
    relatedIds: [8],
    status: "pending",
    energy: 30,
    image: PLACEHOLDER,
    i18n: {
      pl: {
        title: "Obieg dokumentów",
        date: "roadmapa",
        category: "Administracja",
        content:
          "Kreatory dokumentów, akceptacje wielostopniowe, auto-uzupełnianie danych kontrahenta po NIP, DOCX→PDF i e-podpisy — obieg, który dziś żyje w mailach i załącznikach.",
        saves: "cały obieg w jednej aplikacji zamiast skrzynki mailowej",
        benefits: [
          "Kreatory dokumentów z walidacją i cyklem życia (szkic → akceptacja → faktura)",
          "Auto-lookup kontrahenta po NIP",
          "Generowanie DOCX→PDF, mailing, e-podpisy",
        ],
      },
      en: {
        title: "Document workflow",
        date: "roadmap",
        category: "Administration",
        content:
          "Document wizards, multi-step approvals, auto-filled counterparty data, DOCX→PDF and e-signatures — the workflow that today lives in emails and attachments.",
        saves: "the whole workflow in one app instead of an inbox",
        benefits: [
          "Document wizards with validation and lifecycle (draft → approval → invoice)",
          "Automatic counterparty lookup",
          "DOCX→PDF generation, mailing, e-signatures",
        ],
      },
    },
  },
  {
    id: 8,
    slug: "platnosci-cashflow",
    icon: Wallet,
    relatedIds: [7, 4],
    status: "pending",
    energy: 30,
    image: PLACEHOLDER,
    i18n: {
      pl: {
        title: "Płatności i cash-flow",
        date: "roadmapa",
        category: "Finanse",
        content:
          "Wnioski o wydatek, plan płatności, akceptacje „na cztery oczy”, tracking i harmonogramy fakturowania (w tym AIA G703 dla rynku USA) — z audytem każdej decyzji.",
        saves: "ślad audytowy każdej decyzji zamiast maili i „ustaleń”",
        benefits: [
          "Wnioski o wydatek i plan płatności z maszyną stanów",
          "Akceptacje „na cztery oczy” (wnioskodawca ≠ akceptujący)",
          "Harmonogramy fakturowania, w tym AIA G703 (rynek USA)",
        ],
      },
      en: {
        title: "Payments & cash-flow",
        date: "roadmap",
        category: "Finance",
        content:
          "Spending requests, a payment plan, four-eyes approvals, tracking and billing schedules (including AIA G703 for the US market) — with an audit trail for every decision.",
        saves: "an audit trail for every decision instead of emails and “arrangements”",
        benefits: [
          "Spending requests and a payment plan with a state machine",
          "Four-eyes approvals (requester ≠ approver)",
          "Billing schedules, including AIA G703 (US market)",
        ],
      },
    },
  },
];

export function getModules(lang: Lang): ModuleItem[] {
  return BASE.map((b) => ({
    id: b.id,
    slug: b.slug,
    icon: b.icon,
    relatedIds: b.relatedIds,
    status: b.status,
    energy: b.energy,
    image: b.image,
    ...b.i18n[lang],
  }));
}

export const findModule = (slug: string, lang: Lang): ModuleItem | undefined =>
  getModules(lang).find((m) => m.slug === slug);
