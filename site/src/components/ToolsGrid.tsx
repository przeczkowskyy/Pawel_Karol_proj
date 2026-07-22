import { Wrench } from "lucide-react";
import { useLang } from "@/i18n";

/* Sekcja „Narzędzia" — docelowo katalog interaktywnych dashboardów odtworzonych
   od zera na wzór wewnętrznych narzędzi kontrolingu (na danych fikcyjnych,
   bez marki źródłowej — twarda zasada #3 CLAUDE.md). Placeholder do czasu
   wpięcia pierwszych dashboardów (trwa w tej sesji). */

export default function ToolsGrid() {
  const { lang } = useLang();
  return (
    <div className="empty">
      <Wrench className="e-ico" />
      <div className="e-title">
        {lang === "pl" ? "Interaktywne dashboardy — wpinamy je właśnie teraz" : "Interactive dashboards — landing right now"}
      </div>
      <p>
        {lang === "pl"
          ? "Odtwarzamy nasze narzędzia kontrolingu i produkcji jako działające dashboardy w przeglądarce — na danych przykładowych, z pełną funkcjonalnością."
          : "We're rebuilding our controlling and production tools as working in-browser dashboards — on sample data, fully functional."}
      </p>
    </div>
  );
}
