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

/* Katalog modułów Klarow (M1–M8 z planu strategicznego).
   date = czas wdrożenia · category = dział · energy = gotowość wzorca
   (% pracy pokrytej biblioteką) · relatedIds = powiązania/zależności.
   image = zrzut ekranu narzędzia (na razie placeholder — realne zrzuty
   i szczegółowe opisy dojdą wg decyzji founderów).
   Docelowo dane przejdą do site/content/modules/*.yml (content-driven). */

export interface ModuleItem extends TimelineItem {
  slug: string;
  saves: string;
  benefits: string[];
}

const PLACEHOLDER = "/screens/placeholder.svg";

export const MODULES: ModuleItem[] = [
  {
    id: 1,
    slug: "audyt-jakosci-danych",
    title: "Audyt jakości danych",
    date: "5 dni",
    content:
      "Walidator, który jednym przebiegiem sprawdza wszystkie Twoje pliki według reguł dopasowanych do Twoich danych: raport błędów + macierz pewności OK/UWAGA/BŁĄD. Tylko czyta — zero ryzyka dla plików. Nasza oferta wejściowa.",
    category: "Przekrojowy · wedge",
    icon: ShieldCheck,
    relatedIds: [2, 3, 4],
    status: "completed",
    energy: 90,
    image: PLACEHOLDER,
    saves: "błędy wychwycone PRZED raportem, nie po fakcie",
    benefits: [
      "Wszystkie pliki sprawdzone jednym przebiegiem zamiast otwierania każdego „na oko”",
      "Macierz pewności OK/UWAGA/BŁĄD dla całego portfela",
      "Tryb „strażnik”: automatyczna kontrola przed każdym raportem lub zamknięciem",
      "Zero ryzyka — narzędzie tylko czyta; jedyny zapis to własny raport",
    ],
  },
  {
    id: 2,
    slug: "raport-zarzadczy",
    title: "Raport zarządczy",
    date: "5–10 dni",
    content:
      "Raport dla zarządu składany jednym kliknięciem z dziesiątek plików: jednoplikowy interaktywny HTML + XLSX, w kilkanaście sekund zamiast godzin. Liczby weryfikowane o zgodność z Twoim dotychczasowym raportem.",
    category: "KPI / Zarząd",
    icon: BarChart3,
    relatedIds: [1, 6],
    status: "completed",
    energy: 85,
    image: PLACEHOLDER,
    saves: "z godzin składania do kilkunastu sekund generowania",
    benefits: [
      "Jeden plik HTML: sortowanie, szczegóły projektów, eksport CSV/PDF — bez instalacji",
      "Aktualizacja o nowy tydzień danych w kilkanaście sekund",
      "Weryfikacja zgodności liczb z dotychczasowym raportem („stare vs nowe”)",
      "Twoje pliki tylko czytamy — raport powstaje obok, nic nie nadpisujemy",
    ],
  },
  {
    id: 3,
    slug: "importy-erp",
    title: "Importy ERP → Excel",
    date: "5–15 dni / import",
    content:
      "Koniec przeklejania tysięcy wierszy: import z ERP/magazynu do Twoich plików z klasyfikacją słownikiem, deduplikacją, trybem TEST z pełnym podglądem zmian, backupem przed zapisem i logiem audytowym.",
    category: "Księgowość / Finanse",
    icon: Database,
    relatedIds: [1, 4],
    status: "in-progress",
    energy: 70,
    image: PLACEHOLDER,
    saves: "praca „z godzin do minut” przy każdym cyklu importu",
    benefits: [
      "Klasyfikacja wierszy konfigurowalnym słownikiem, deduplikacja, tylko NOWE wiersze",
      "Tryb TEST: pełny podgląd zmian zanim cokolwiek trafi do plików",
      "Backup przed zapisem + log audytowy każdej operacji",
      "Sanity-check sum co do grosza",
    ],
  },
  {
    id: 4,
    slug: "zamkniecie-cyklu",
    title: "Zamknięcie cyklu",
    date: "3–7 dni",
    content:
      "Cotygodniowa konsolidacja wielu plików do raportu zbiorczego i hurtowa publikacja oficjalnych wersji jednym przyciskiem — z walidacją, archiwum i zawsze jednoznaczną „wersją prawdy”.",
    category: "Finanse / Kontroling",
    icon: CalendarCheck,
    relatedIds: [1, 3],
    status: "in-progress",
    energy: 65,
    image: PLACEHOLDER,
    saves: "zamknięcie ~30 projektów w kilkanaście sekund zamiast ręcznie folder po folderze",
    benefits: [
      "Konsolidacja „kopiuj-wklej wartości” z wielu plików jednym przebiegiem",
      "Publikacja oficjalnych wersji hurtowo, z archiwum i historią",
      "Domyślnie DRY-RUN; zapis tylko przy czystej walidacji",
      "Zawsze wiadomo, która wersja jest oficjalna",
    ],
  },
  {
    id: 5,
    slug: "wykonanie-produkcji",
    title: "Wykonanie produkcji",
    date: "5–10 dni",
    content:
      "Procent wykonania produkcji trafia do plików finansowych automatycznie, z bezpiecznikami układu i kontrolkami spójności. Produkcja i finanse widzą wreszcie te same liczby.",
    category: "Produkcja",
    icon: Factory,
    relatedIds: [3],
    status: "in-progress",
    energy: 60,
    image: PLACEHOLDER,
    saves: "jedna wersja prawdy produkcja ↔ finanse",
    benefits: [
      "Koniec ręcznego wklejania wykonania do plików finansowych",
      "Bezpieczniki układu: nieznany format = pominięcie, nie cicha pomyłka",
      "Kontrolki spójności po każdym wpisie",
    ],
  },
  {
    id: 6,
    slug: "panel-kpi-online",
    title: "Panel KPI online",
    date: "dodatek",
    content:
      "Hostowany panel w przeglądarce dla wielu odbiorców i ról — rozszerzenie raportu zarządczego dla firm, które go przerosły. Zasilany wyłącznie zagregowanymi danymi, które sami zatwierdzicie.",
    category: "KPI / Zarząd",
    icon: Gauge,
    relatedIds: [2],
    status: "pending",
    energy: 40,
    image: PLACEHOLDER,
    saves: "live panel zamiast rozsyłanego pliku",
    benefits: [
      "Wielu odbiorców i role (zarząd / PM / kontroling)",
      "Tylko zagregowane wskaźniki — dane transakcyjne zostają u Ciebie",
      "Naturalne rozszerzenie modułu Raport zarządczy",
    ],
  },
  {
    id: 7,
    slug: "obieg-dokumentow",
    title: "Obieg dokumentów",
    date: "roadmapa",
    content:
      "Kreatory dokumentów, akceptacje wielostopniowe, auto-uzupełnianie danych kontrahenta po NIP, DOCX→PDF i e-podpisy — obieg, który dziś żyje w mailach i załącznikach.",
    category: "Administracja",
    icon: FileSignature,
    relatedIds: [8],
    status: "pending",
    energy: 30,
    image: PLACEHOLDER,
    saves: "cały obieg w jednej aplikacji zamiast skrzynki mailowej",
    benefits: [
      "Kreatory dokumentów z walidacją i cyklem życia (szkic → akceptacja → faktura)",
      "Auto-lookup kontrahenta po NIP",
      "Generowanie DOCX→PDF, mailing, e-podpisy",
    ],
  },
  {
    id: 8,
    slug: "platnosci-cashflow",
    title: "Płatności i cash-flow",
    date: "roadmapa",
    content:
      "Wnioski o wydatek, plan płatności, akceptacje „na cztery oczy”, tracking i harmonogramy fakturowania (w tym AIA G703 dla rynku USA) — z audytem każdej decyzji.",
    category: "Finanse",
    icon: Wallet,
    relatedIds: [7, 4],
    status: "pending",
    energy: 30,
    image: PLACEHOLDER,
    saves: "ślad audytowy każdej decyzji zamiast maili i „ustaleń”",
    benefits: [
      "Wnioski o wydatek i plan płatności z maszyną stanów",
      "Akceptacje „na cztery oczy” (wnioskodawca ≠ akceptujący)",
      "Harmonogramy fakturowania, w tym AIA G703 (rynek USA)",
    ],
  },
];

export const findModule = (slug: string): ModuleItem | undefined =>
  MODULES.find((m) => m.slug === slug);
