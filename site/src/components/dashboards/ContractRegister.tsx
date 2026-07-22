import { useMemo, useState } from "react";
import { Check, Clock, Download, FileSignature, Plus, Search, Trash2 } from "lucide-react";
import PrintButton from "./PrintButton";
import { useLang, type Lang } from "@/i18n";

/* Dashboard „Rejestr umów" — LIVE, dane DEMO (CRUD lokalny w pamięci).
   Odbrandowane odtworzenie rdzenia: elektroniczny rejestr umów z cyklem
   życia, wyszukiwarką, eksportem CSV i WYDRUKIEM rejestru. U klienta
   rejestr wymienia się dwukierunkowo z Excelem (arkusz = źródło prawdy)
   i trzyma skany PDF z linkami względnymi, które się nie psują. */

interface Contract {
  id: number;
  number: string;
  vendor: string;
  subject: { pl: string; en: string } | string;
  dateFrom: string;
  valueGr: number | null;
  status: "active" | "ended";
}

const INITIAL: Contract[] = [
  { id: 1, number: "U-2026/031", vendor: "Monter-Bud sp. z o.o.", subject: { pl: "Montaż konstrukcji — Hala Poznań", en: "Structure assembly — Poznań hall" }, dateFrom: "2026-03-14", valueGr: 84200000, status: "active" },
  { id: 2, number: "U-2026/030", vendor: "Elektro-Serwis J. Nowak", subject: { pl: "Instalacje elektryczne — Biurowiec Łódź", en: "Electrical installations — Łódź office" }, dateFrom: "2026-03-02", valueGr: 31600000, status: "active" },
  { id: 3, number: "U-2026/024", vendor: "TransLog", subject: { pl: "Ramowa: transport modułów", en: "Framework: module transport" }, dateFrom: "2026-02-10", valueGr: null, status: "active" },
  { id: 4, number: "U-2025/118", vendor: "Beton-Mix", subject: { pl: "Dostawy betonu — Magazyn Wrocław", en: "Concrete supply — Wrocław warehouse" }, dateFrom: "2025-11-21", valueGr: 12750000, status: "ended" },
  { id: 5, number: "U-2025/102", vendor: "Okna-System", subject: { pl: "Stolarka okienna — Moduły Gdańsk", en: "Windows — Gdańsk modules" }, dateFrom: "2025-10-05", valueGr: 25400000, status: "ended" },
];

const fmt = (gr: number | null, lang: Lang) => {
  if (gr === null) return "—";
  return lang === "pl"
    ? `${(gr / 100).toLocaleString("pl-PL", { minimumFractionDigits: 2 })} zł`
    : `PLN ${(gr / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
};

const subjectText = (c: Contract, lang: Lang) => (typeof c.subject === "string" ? c.subject : c.subject[lang]);

const T = {
  pl: {
    intro: "Elektroniczny rejestr umów zamiast pliku Excel z psującymi się linkami do skanów: wyszukiwarka, cykl życia, eksport CSV i wydruk. Dodaj wpis albo usuń istniejący — wszystko dzieje się lokalnie, w Twojej przeglądarce.",
    search: "Szukaj (numer, dostawca, przedmiot)…",
    add: "Dodaj umowę",
    number: "Numer",
    vendor: "Dostawca",
    subject: "Przedmiot",
    from: "Data zawarcia",
    value: "Wartość netto",
    status: "Status",
    stActive: "obowiązuje",
    stEnded: "zakończona",
    exportCsv: "Eksport CSV",
    printBtn: "Drukuj rejestr",
    printTitle: "REJESTR UMÓW (DEMO)",
    kAll: "Umowy w rejestrze",
    kActive: "Obowiązujące",
    kValue: "Σ wartość obowiązujących",
    remove: "Usuń",
    phNumber: "U-2026/0XX",
    phVendor: "Nazwa dostawcy",
    phSubject: "Przedmiot umowy",
    note: "U klienta: dwukierunkowa wymiana z Excelem (arkusz = źródło prawdy), drzewo skanów PDF z linkami względnymi, naprawa duplikatów.",
    foot: "Dane fikcyjne · zmiany trzymane lokalnie · eksport i wydruk odzwierciedlają dokładnie bieżący widok.",
  },
  en: {
    intro: "An electronic contract register instead of an Excel file with breaking scan links: search, lifecycle, CSV export and print. Add or remove an entry — everything happens locally, in your browser.",
    search: "Search (number, vendor, subject)…",
    add: "Add contract",
    number: "Number",
    vendor: "Vendor",
    subject: "Subject",
    from: "Signed on",
    value: "Net value",
    status: "Status",
    stActive: "active",
    stEnded: "ended",
    exportCsv: "Export CSV",
    printBtn: "Print the register",
    printTitle: "CONTRACT REGISTER (DEMO)",
    kAll: "Contracts in register",
    kActive: "Active",
    kValue: "Σ active value",
    remove: "Remove",
    phNumber: "U-2026/0XX",
    phVendor: "Vendor name",
    phSubject: "Contract subject",
    note: "At the client: two-way Excel exchange (the sheet is the source of truth), a PDF scan tree with relative links, duplicate repair.",
    foot: "Fictional data · changes kept locally · export and print mirror exactly the current view.",
  },
};

export default function ContractRegister() {
  const { lang } = useLang();
  const t = T[lang];
  const [items, setItems] = useState<Contract[]>(INITIAL);
  const [query, setQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [fNumber, setFNumber] = useState("");
  const [fVendor, setFVendor] = useState("");
  const [fSubject, setFSubject] = useState("");
  const [fValue, setFValue] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((c) =>
      [c.number, c.vendor, subjectText(c, lang)].some((x) => x.toLowerCase().includes(q))
    );
  }, [items, query, lang]);

  const activeItems = items.filter((c) => c.status === "active");
  const activeValueGr = activeItems.reduce((s, c) => s + (c.valueGr ?? 0), 0);

  const addItem = () => {
    if (!fNumber.trim() || !fVendor.trim()) return;
    const v = Number(fValue.replace(/\s/g, "").replace(",", "."));
    setItems((prev) => [
      {
        id: (prev[0]?.id ?? 0) + 100 + prev.length,
        number: fNumber.trim(),
        vendor: fVendor.trim(),
        subject: fSubject.trim() || "—",
        dateFrom: "2026-07-22",
        valueGr: Number.isFinite(v) && v > 0 ? Math.round(v * 100) : null,
        status: "active",
      },
      ...prev,
    ]);
    setFNumber("");
    setFVendor("");
    setFSubject("");
    setFValue("");
    setFormOpen(false);
  };

  const exportCsv = () => {
    const H = [t.number, t.vendor, t.subject, t.from, t.value, t.status].join(";");
    const lines = filtered.map((c) =>
      [c.number, c.vendor, subjectText(c, lang).replace(/;/g, ","), c.dateFrom, c.valueGr !== null ? (c.valueGr / 100).toFixed(2) : "", c.status === "active" ? t.stActive : t.stEnded].join(";")
    );
    const blob = new Blob(["﻿" + [H, ...lines].join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rejestr-umow-demo.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <p className="text-[13px] leading-relaxed max-w-3xl" style={{ color: "var(--foreground)" }}>{t.intro}</p>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="card stat">
          <div className="lbl">{t.kAll}</div>
          <div className="val tnum">{items.length}</div>
        </div>
        <div className="card stat">
          <div className="lbl">{t.kActive}</div>
          <div className="val tnum" style={{ color: "var(--funded)" }}>{activeItems.length}</div>
        </div>
        <div className="card stat">
          <div className="lbl">{t.kValue}</div>
          <div className="val tnum" style={{ fontSize: "clamp(15px,1vw+10px,21px)" }}>{fmt(activeValueGr, lang)}</div>
        </div>
      </div>

      {/* pasek akcji */}
      <div className="card mt-4" style={{ padding: 16 }}>
        <div className="flex flex-wrap items-center gap-2.5">
          <div style={{ position: "relative", flex: "1 1 240px" }}>
            <Search size={14} style={{ position: "absolute", left: 11, top: 11, color: "var(--muted-foreground)" }} />
            <input
              className="input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.search}
              style={{ paddingLeft: 32, marginBottom: 0 }}
            />
          </div>
          <button className="btn btn-secondary btn-sm" type="button" aria-expanded={formOpen} onClick={() => setFormOpen((v) => !v)}>
            <Plus size={14} /> {t.add}
          </button>
          <button className="btn btn-secondary btn-sm" type="button" onClick={exportCsv}>
            <Download size={14} /> {t.exportCsv}
          </button>
        </div>
        {formOpen && (
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
            <input className="input" value={fNumber} onChange={(e) => setFNumber(e.target.value)} placeholder={t.phNumber} style={{ marginBottom: 0 }} />
            <input className="input" value={fVendor} onChange={(e) => setFVendor(e.target.value)} placeholder={t.phVendor} style={{ marginBottom: 0 }} />
            <input className="input" value={fSubject} onChange={(e) => setFSubject(e.target.value)} placeholder={t.phSubject} style={{ marginBottom: 0 }} />
            <input className="input" value={fValue} onChange={(e) => setFValue(e.target.value)} placeholder="120000" inputMode="decimal" style={{ marginBottom: 0, fontVariantNumeric: "tabular-nums" }} />
            <button className="btn btn-primary" type="button" onClick={addItem}>
              <Check size={15} /> OK
            </button>
          </div>
        )}
      </div>

      {/* rejestr (drukowalny) */}
      <div className="card mt-4 print-area">
        <div className="print-only" style={{ marginBottom: 12 }}>
          <strong>KLAROW · {t.printTitle}</strong>
        </div>
        <div className="flex items-center justify-between flex-wrap gap-2" style={{ marginBottom: 10 }}>
          <span className="st st-gray"><FileSignature className="st-ico" /> {filtered.length} / {items.length}</span>
          <PrintButton label={t.printBtn} />
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>{t.number}</th>
                <th>{t.vendor}</th>
                <th>{t.subject}</th>
                <th className="num">{t.from}</th>
                <th className="num">{t.value}</th>
                <th>{t.status}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id}>
                  <td className="tnum"><strong>{c.number}</strong></td>
                  <td>{c.vendor}</td>
                  <td className="text-[12.5px]">{subjectText(c, lang)}</td>
                  <td className="num tnum nowrap">{c.dateFrom}</td>
                  <td className="num nowrap">{fmt(c.valueGr, lang)}</td>
                  <td>
                    {c.status === "active" ? (
                      <span className="st st-green"><Check className="st-ico" /> {t.stActive}</span>
                    ) : (
                      <span className="st st-gray"><Clock className="st-ico" /> {t.stEnded}</span>
                    )}
                  </td>
                  <td>
                    <button className="btn btn-ghost btn-sm btn-ico" type="button" onClick={() => setItems((prev) => prev.filter((x) => x.id !== c.id))} aria-label={t.remove}>
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-3 text-[12px]" style={{ color: "var(--muted-foreground)" }}>{t.note}</p>
      <p className="mt-1 text-[11.5px]" style={{ color: "var(--muted-foreground)" }}>{t.foot}</p>
    </div>
  );
}
