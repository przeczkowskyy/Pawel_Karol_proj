import { Printer } from "lucide-react";
import { useLang } from "@/i18n";

/* Wydruk dokumentu z narzędzia: element z ref/id oznaczony klasą .print-area
   jest jedynym widocznym przy window.print() (print-CSS w globals.css).
   Każde narzędzie ma najwyżej JEDEN .print-area na stronie. */

export default function PrintButton({ label }: { label?: string }) {
  const { lang } = useLang();
  return (
    <button className="btn btn-secondary btn-sm" type="button" onClick={() => window.print()}>
      <Printer size={14} /> {label ?? (lang === "pl" ? "Drukuj dokument" : "Print document")}
    </button>
  );
}
