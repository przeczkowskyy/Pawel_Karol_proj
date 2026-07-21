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
   Docelowo dane przejdą do site/content/modules/*.yml (content-driven). */
export const MODULES: TimelineItem[] = [
  {
    id: 1,
    title: "Audyt jakości danych",
    date: "5 dni",
    content:
      "Walidator, który jednym przebiegiem sprawdza wszystkie Twoje pliki według reguł dopasowanych do Twoich danych: raport błędów + macierz pewności OK/UWAGA/BŁĄD. Tylko czyta — zero ryzyka dla plików. Nasza oferta wejściowa.",
    category: "Przekrojowy · wedge",
    icon: ShieldCheck,
    relatedIds: [2, 3, 4],
    status: "completed",
    energy: 90,
  },
  {
    id: 2,
    title: "Raport zarządczy",
    date: "5–10 dni",
    content:
      "Raport dla zarządu składany jednym kliknięciem z dziesiątek plików: jednoplikowy interaktywny HTML + XLSX, w kilkanaście sekund zamiast godzin. Liczby weryfikowane o zgodność z Twoim dotychczasowym raportem.",
    category: "KPI / Zarząd",
    icon: BarChart3,
    relatedIds: [1, 6],
    status: "completed",
    energy: 85,
  },
  {
    id: 3,
    title: "Importy ERP → Excel",
    date: "5–15 dni / import",
    content:
      "Koniec przeklejania tysięcy wierszy: import z ERP/magazynu do Twoich plików z klasyfikacją słownikiem, deduplikacją, trybem TEST z pełnym podglądem zmian, backupem przed zapisem i logiem audytowym.",
    category: "Księgowość / Finanse",
    icon: Database,
    relatedIds: [1, 4],
    status: "in-progress",
    energy: 70,
  },
  {
    id: 4,
    title: "Zamknięcie cyklu",
    date: "3–7 dni",
    content:
      "Cotygodniowa konsolidacja wielu plików do raportu zbiorczego i hurtowa publikacja oficjalnych wersji jednym przyciskiem — z walidacją, archiwum i zawsze jednoznaczną „wersją prawdy”.",
    category: "Finanse / Kontroling",
    icon: CalendarCheck,
    relatedIds: [1, 3],
    status: "in-progress",
    energy: 65,
  },
  {
    id: 5,
    title: "Wykonanie produkcji",
    date: "5–10 dni",
    content:
      "Procent wykonania produkcji trafia do plików finansowych automatycznie, z bezpiecznikami układu i kontrolkami spójności. Produkcja i finanse widzą wreszcie te same liczby.",
    category: "Produkcja",
    icon: Factory,
    relatedIds: [3],
    status: "in-progress",
    energy: 60,
  },
  {
    id: 6,
    title: "Panel KPI online",
    date: "dodatek",
    content:
      "Hostowany panel w przeglądarce dla wielu odbiorców i ról — rozszerzenie raportu zarządczego dla firm, które go przerosły. Zasilany wyłącznie zagregowanymi danymi, które sami zatwierdzicie.",
    category: "KPI / Zarząd",
    icon: Gauge,
    relatedIds: [2],
    status: "pending",
    energy: 40,
  },
  {
    id: 7,
    title: "Obieg dokumentów",
    date: "roadmapa",
    content:
      "Kreatory dokumentów, akceptacje wielostopniowe, auto-uzupełnianie danych kontrahenta po NIP, DOCX→PDF i e-podpisy — obieg, który dziś żyje w mailach i załącznikach.",
    category: "Administracja",
    icon: FileSignature,
    relatedIds: [8],
    status: "pending",
    energy: 30,
  },
  {
    id: 8,
    title: "Płatności i cash-flow",
    date: "roadmapa",
    content:
      "Wnioski o wydatek, plan płatności, akceptacje „na cztery oczy”, tracking i harmonogramy fakturowania (w tym AIA G703 dla rynku USA) — z audytem każdej decyzji.",
    category: "Finanse",
    icon: Wallet,
    relatedIds: [7, 4],
    status: "pending",
    energy: 30,
  },
];
