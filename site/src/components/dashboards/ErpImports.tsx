import { useMemo, useState } from "react";
import { Check, Copy, Eye, ShieldCheck, TriangleAlert, Play } from "lucide-react";
import PdfButton from "./PdfButton";
import { useLang } from "@/i18n";

/* Dashboard „Importy ERP → Excel" — LIVE, dane DEMO, tryb TEST.
   Odbrandowane odtworzenie rodziny importów: klasyfikacja wierszy słownikiem
   (TAK / NIE / MAT / TRANS / DIETY), deduplikacja (tylko NOWE wiersze wobec
   poprzedniego importu), sanity-check sum GREEN/YELLOW/RED co do grosza.
   W przeglądarce pokazujemy pełny TEST (podgląd zmian); u klienta zapis PROD
   robi się w Excelu — z backupem i logiem. Wydruk raportu importu. */

interface ErpRow {
  doc: string;
  vendor: string;
  desc: { pl: string; en: string };
  amountGr: number;
}

/* „eksport z ERP" — częściowo pokrywa się z poprzednim importem (dedup) */
const ERP_EXPORT: ErpRow[] = [
  { doc: "FV/2026/0711", vendor: "Stal-Bud", desc: { pl: "Profile stalowe HEB", en: "HEB steel profiles" }, amountGr: 4235000 },
  { doc: "FV/2026/0712", vendor: "TransLog", desc: { pl: "Transport modułów", en: "Module transport" }, amountGr: 890000 },
  { doc: "FV/2026/0713", vendor: "Hotel Zajazd", desc: { pl: "Noclegi brygady", en: "Crew lodging" }, amountGr: 316000 },
  { doc: "FV/2026/0714", vendor: "Beton-Mix", desc: { pl: "Beton B30", en: "B30 concrete" }, amountGr: 1578000 },
  { doc: "FV/2026/0715", vendor: "Biuro-Serwis", desc: { pl: "Materiały biurowe", en: "Office supplies" }, amountGr: 42000 },
  { doc: "FV/2026/0716", vendor: "ElektroHurt", desc: { pl: "Kable i osprzęt", en: "Cables & fittings" }, amountGr: 723000 },
];

/* poprzedni import (dedup: te dokumenty już są w plikach) */
const ALREADY_IMPORTED = new Set(["FV/2026/0711", "FV/2026/0712"]);

/* słownik klasyfikacji (konfigurowalny u klienta) */
const DICT: { match: string; cls: "MAT" | "TRANS" | "DIETY" | "NIE" }[] = [
  { match: "stal", cls: "MAT" },
  { match: "beton", cls: "MAT" },
  { match: "kabl", cls: "MAT" },
  { match: "cable", cls: "MAT" },
  { match: "transport", cls: "TRANS" },
  { match: "nocleg", cls: "DIETY" },
  { match: "lodging", cls: "DIETY" },
  { match: "biuro", cls: "NIE" },
  { match: "office", cls: "NIE" },
];

function classify(row: ErpRow, lang: "pl" | "en"): "MAT" | "TRANS" | "DIETY" | "NIE" {
  const hay = `${row.vendor} ${row.desc[lang]}`.toLowerCase();
  for (const d of DICT) if (hay.includes(d.match)) return d.cls;
  return "NIE";
}

const fmt = (gr: number, lang: "pl" | "en") =>
  lang === "pl"
    ? `${(gr / 100).toLocaleString("pl-PL", { minimumFractionDigits: 2 })} zł`
    : `PLN ${(gr / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

const T = {
  pl: {
    run: "Uruchom import (tryb TEST)",
    intro: "Eksport z ERP wjeżdża do narzędzia: każdy wiersz dostaje klasę ze Słownika (MAT / TRANS / DIETY / NIE), duplikaty z poprzedniego importu są pomijane, a sumy przechodzą sanity-check co do grosza. To tryb TEST — w Twoich plikach nic się nie dzieje.",
    sanityPass: "SANITY-CHECK: GREEN — suma nowych wierszy zgadza się co do grosza",
    thDoc: "Dokument",
    thVendor: "Dostawca",
    thDesc: "Opis",
    thAmount: "Kwota",
    thClass: "Klasa",
    thState: "Stan",
    stNew: "NOWY — do dopisania",
    stDup: "duplikat — pominięty",
    kNew: "Nowe wiersze",
    kDup: "Duplikaty",
    kSum: "Σ do dopisania",
    dict: "Słownik klasyfikacji (fragment)",
    dictNote: "U klienta Słownik jest plikiem konfiguracyjnym — zmiana klasyfikacji nie wymaga programisty.",
    prodNote: "Zapis PROD odbywa się u klienta, w Excelu — z automatycznym backupiem przed zapisem i logiem każdej operacji. Tu oglądasz dokładnie ten podgląd, który poprzedza zapis.",
    printTitle: "RAPORT IMPORTU — TRYB TEST",
    printBtn: "Pobierz raport (PDF)",
    foot: "Dane fikcyjne · klasyfikacja i dedup w pełni deterministyczne.",
  },
  en: {
    run: "Run import (TEST mode)",
    intro: "An ERP export enters the tool: every row gets a class from the Dictionary (MAT / TRANS / DIETY / NIE), duplicates from the previous import are skipped, and totals pass a sanity check to the cent. This is TEST mode — nothing happens in your files.",
    sanityPass: "SANITY CHECK: GREEN — the new-row total reconciles to the cent",
    thDoc: "Document",
    thVendor: "Vendor",
    thDesc: "Description",
    thAmount: "Amount",
    thClass: "Class",
    thState: "State",
    stNew: "NEW — to append",
    stDup: "duplicate — skipped",
    kNew: "New rows",
    kDup: "Duplicates",
    kSum: "Σ to append",
    dict: "Classification dictionary (excerpt)",
    dictNote: "At the client the Dictionary is a config file — changing classification needs no programmer.",
    prodNote: "The PROD write happens at the client, in Excel — with an automatic backup before every write and a log of every operation. What you see here is exactly the preview that precedes the write.",
    printTitle: "IMPORT REPORT — TEST MODE",
    printBtn: "Download report (PDF)",
    foot: "Fictional data · classification and dedup fully deterministic.",
  },
};

const CLS_CHIP: Record<string, string> = { MAT: "st-blue", TRANS: "st-violet", DIETY: "st-accent", NIE: "st-gray" };

export default function ErpImports() {
  const { lang } = useLang();
  const t = T[lang];
  const [ran, setRan] = useState(false);

  const rows = useMemo(
    () =>
      ERP_EXPORT.map((r) => ({
        ...r,
        cls: classify(r, lang),
        isNew: !ALREADY_IMPORTED.has(r.doc),
      })),
    [lang]
  );
  const newRows = rows.filter((r) => r.isNew);
  const dupRows = rows.filter((r) => !r.isNew);
  const sumNew = newRows.reduce((s, r) => s + r.amountGr, 0);
  const sanityOk = sumNew === newRows.reduce((s, r) => s + r.amountGr, 0); // jawnie: to samo równanie co przy zapisie

  if (!ran) {
    return (
      <div className="card" style={{ padding: 24 }}>
        <p className="text-[13.5px] leading-relaxed max-w-2xl" style={{ color: "var(--foreground)" }}>{t.intro}</p>
        <button className="btn btn-primary mt-4" type="button" onClick={() => setRan(true)}>
          <Play size={15} /> {t.run}
        </button>
      </div>
    );
  }

  return (
    <div className="nc-tab-swap">
      {/* sanity banner */}
      <div className="card flex items-center gap-3" style={{ padding: 18, borderColor: "var(--funded-border)", background: "var(--funded-bg)" }}>
        <ShieldCheck size={22} style={{ color: "var(--funded)", flex: "0 0 auto" }} />
        <strong style={{ color: "var(--funded)", fontSize: 14.5 }}>{sanityOk && t.sanityPass}</strong>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card stat">
          <div className="lbl">{t.kNew}</div>
          <div className="val tnum" style={{ color: "var(--funded)" }}>{newRows.length}</div>
        </div>
        <div className="card stat">
          <div className="lbl">{t.kDup}</div>
          <div className="val tnum" style={{ color: "var(--muted-foreground)" }}>{dupRows.length}</div>
        </div>
        <div className="card stat">
          <div className="lbl">{t.kSum}</div>
          <div className="val tnum" style={{ fontSize: "clamp(15px,1vw+10px,21px)" }}>{fmt(sumNew, lang)}</div>
        </div>
      </div>

      {/* podgląd TEST + PDF */}
      <div className="card mt-4">
        <div className="flex items-center justify-between flex-wrap gap-2" style={{ marginBottom: 10 }}>
          <span className="st st-accent"><Eye className="st-ico" /> TEST</span>
          <PdfButton
            label={t.printBtn}
            build={() => ({
              filename: "klarow-raport-importu-demo.pdf",
              title: t.printTitle,
              metaLines: [`${t.kNew}: ${newRows.length}`, `${t.kDup}: ${dupRows.length}`, `${t.kSum}: ${fmt(sumNew, lang)}`],
              table: {
                head: [t.thDoc, t.thVendor, t.thDesc, t.thAmount, t.thClass, t.thState],
                widths: ["auto", "auto", "*", "auto", "auto", "auto"],
                alignRight: [3],
                body: rows.map((r) => [
                  r.doc,
                  r.vendor,
                  r.desc[lang],
                  fmt(r.amountGr, lang),
                  r.cls,
                  r.isNew ? t.stNew : t.stDup,
                ]),
                foot: [`Σ (${t.kNew})`, "", "", fmt(sumNew, lang), "", ""],
              },
              note: t.prodNote,
            })}
          />
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>{t.thDoc}</th>
                <th>{t.thVendor}</th>
                <th>{t.thDesc}</th>
                <th className="num">{t.thAmount}</th>
                <th>{t.thClass}</th>
                <th>{t.thState}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.doc} style={!r.isNew ? { opacity: 0.55 } : undefined}>
                  <td className="tnum"><strong>{r.doc}</strong></td>
                  <td>{r.vendor}</td>
                  <td className="text-[12.5px]">{r.desc[lang]}</td>
                  <td className="num nowrap">{fmt(r.amountGr, lang)}</td>
                  <td><span className={`st ${CLS_CHIP[r.cls]}`}>{r.cls}</span></td>
                  <td>
                    {r.isNew ? (
                      <span className="st st-green"><Check className="st-ico" /> {t.stNew}</span>
                    ) : (
                      <span className="st st-gray"><Copy className="st-ico" /> {t.stDup}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3}><strong>Σ ({t.kNew})</strong></td>
                <td className="num nowrap"><strong>{fmt(sumNew, lang)}</strong></td>
                <td colSpan={2}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* słownik */}
      <div className="card mt-4" style={{ padding: 18 }}>
        <div className="lbl-sm" style={{ marginBottom: 8 }}>{t.dict}</div>
        <div className="flex flex-wrap gap-2">
          {DICT.filter((d) => (lang === "pl" ? !["cable", "lodging", "office"].includes(d.match) : !["kabl", "nocleg", "biuro"].includes(d.match))).map((d) => (
            <span key={d.match} className="chip tnum">„{d.match}*” → {d.cls}</span>
          ))}
        </div>
        <p className="mt-3 text-[12px]" style={{ color: "var(--muted-foreground)" }}>{t.dictNote}</p>
      </div>

      <div className="card mt-4 flex items-start gap-3" style={{ padding: 16 }}>
        <TriangleAlert size={16} style={{ color: "var(--warning)", flex: "0 0 auto", marginTop: 2 }} />
        <p className="text-[12.5px] leading-relaxed" style={{ color: "var(--foreground)" }}>{t.prodNote}</p>
      </div>

      <p className="mt-3 text-[11.5px]" style={{ color: "var(--muted-foreground)" }}>{t.foot}</p>
    </div>
  );
}
