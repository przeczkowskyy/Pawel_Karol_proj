import { useState } from "react";
import { Download } from "lucide-react";
import { downloadPdf, type PdfDoc } from "@/lib/pdf";
import { useLang } from "@/i18n";

/* Pobranie dokumentu narzędzia jako PDF (bez okna druku).
   pdfmake ładuje się lazy przy pierwszym kliknięciu. */

export default function PdfButton({ build, label }: { build: () => PdfDoc; label?: string }) {
  const { lang } = useLang();
  const [busy, setBusy] = useState(false);
  return (
    <button
      className="btn btn-secondary btn-sm"
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        try {
          await downloadPdf(build());
        } finally {
          setBusy(false);
        }
      }}
    >
      <Download size={14} /> {label ?? (lang === "pl" ? "Pobierz PDF" : "Download PDF")}
    </button>
  );
}
