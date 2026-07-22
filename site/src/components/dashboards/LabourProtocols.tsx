import { useMemo, useState } from "react";
import { Check, Clock, FileText, Send } from "lucide-react";
import PdfButton from "./PdfButton";
import { useLang, type Lang } from "@/i18n";

/* Dashboard „Protokoły robocizny" — LIVE, dane DEMO.
   Odbrandowane odtworzenie rdzenia: rejestr godzin → miesięczny protokół
   kosztu pracy per podwykonawca (kreator: wybór podwykonawcy → podgląd
   pozycji → generuj DRAFT → akceptacja → FINAL), z cyklem życia statusów
   i WYDRUKIEM dokumentu protokołu. Kwoty w groszach, deterministycznie. */

interface RegistryRow {
  investment: string;
  scope: { pl: string; en: string };
  hours: number;
  rateGr: number; // stawka za h w groszach
}

const SUBS: { name: string; nip: string; rows: RegistryRow[] }[] = [
  {
    name: "Monter-Bud sp. z o.o.",
    nip: "521-000-11-22",
    rows: [
      { investment: "Hala Poznań", scope: { pl: "Montaż konstrukcji", en: "Structure assembly" }, hours: 356, rateGr: 8500 },
      { investment: "Hala Poznań", scope: { pl: "Prace wykończeniowe", en: "Finishing works" }, hours: 118, rateGr: 7800 },
      { investment: "Moduły Gdańsk", scope: { pl: "Montaż modułów", en: "Module assembly" }, hours: 204, rateGr: 8500 },
    ],
  },
  {
    name: "Elektro-Serwis J. Nowak",
    nip: "739-222-33-44",
    rows: [
      { investment: "Biurowiec Łódź", scope: { pl: "Instalacje elektryczne", en: "Electrical installations" }, hours: 262, rateGr: 9200 },
      { investment: "Centrum Toruń", scope: { pl: "Pomiary i odbiory", en: "Measurements & sign-off" }, hours: 46, rateGr: 10500 },
    ],
  },
];

type Status = "draft" | "sent" | "final";

const fmt = (gr: number, lang: Lang) =>
  lang === "pl"
    ? `${(gr / 100).toLocaleString("pl-PL", { minimumFractionDigits: 2 })} zł`
    : `PLN ${(gr / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

const T = {
  pl: {
    intro: "Z rejestru godzin narzędzie składa miesięczny protokół kosztu pracy per podwykonawca i prowadzi go przez akceptację: DRAFT → wysłany → FINAL (do faktury). Wybierz podwykonawcę i przejdź cykl — na końcu wydrukuj gotowy dokument.",
    pick: "Podwykonawca",
    period: "Okres: lipiec 2026",
    genDraft: "Generuj protokół (DRAFT)",
    send: "Wyślij do akceptacji",
    accept: "Akceptuj (KB) → FINAL",
    stDraft: "DRAFT",
    stSent: "wysłany do akceptacji",
    stFinal: "FINAL — do faktury",
    doc: "PROTOKÓŁ ROZLICZENIA ROBOCIZNY",
    docPeriod: "za okres: 01.07.2026 – 31.07.2026",
    docSub: "Podwykonawca",
    docNip: "NIP",
    thInv: "Inwestycja",
    thScope: "Zakres prac",
    thHours: "Godziny",
    thRate: "Stawka",
    thAmount: "Wartość netto",
    total: "RAZEM NETTO",
    sig1: "Sporządził (Kontroling)",
    sig2: "Zatwierdził (Kierownik Budowy)",
    printBtn: "Pobierz protokół (PDF)",
    lifecycle: "Cykl życia dokumentu",
    foot: "Dane fikcyjne · dokument liczony z rejestru godzin deterministycznie · u klienta protokół idzie mailem z PDF-em i czeka na akceptację.",
  },
  en: {
    intro: "From an hour register the tool assembles a monthly labour-cost protocol per subcontractor and walks it through approval: DRAFT → sent → FINAL (to invoice). Pick a subcontractor, run the cycle — then print the finished document.",
    pick: "Subcontractor",
    period: "Period: July 2026",
    genDraft: "Generate protocol (DRAFT)",
    send: "Send for approval",
    accept: "Approve (site manager) → FINAL",
    stDraft: "DRAFT",
    stSent: "sent for approval",
    stFinal: "FINAL — to invoice",
    doc: "LABOUR SETTLEMENT PROTOCOL",
    docPeriod: "for the period: 2026-07-01 – 2026-07-31",
    docSub: "Subcontractor",
    docNip: "Tax ID",
    thInv: "Investment",
    thScope: "Scope of works",
    thHours: "Hours",
    thRate: "Rate",
    thAmount: "Net amount",
    total: "TOTAL NET",
    sig1: "Prepared by (Controlling)",
    sig2: "Approved by (Site Manager)",
    printBtn: "Download protocol (PDF)",
    lifecycle: "Document lifecycle",
    foot: "Fictional data · the document is computed from the hour register deterministically · at the client the protocol goes out by e-mail with a PDF and awaits approval.",
  },
};

export default function LabourProtocols() {
  const { lang } = useLang();
  const t = T[lang];
  const [subIdx, setSubIdx] = useState(0);
  const [status, setStatus] = useState<Status | null>(null);

  const sub = SUBS[subIdx];
  const rows = sub.rows;
  const totalGr = useMemo(() => rows.reduce((s, r) => s + r.hours * r.rateGr, 0), [rows]);

  const statusChip = () => {
    if (status === "final") return <span className="st st-green"><Check className="st-ico" /> {t.stFinal}</span>;
    if (status === "sent") return <span className="st st-blue"><Send className="st-ico" /> {t.stSent}</span>;
    if (status === "draft") return <span className="st st-accent"><Clock className="st-ico" /> {t.stDraft}</span>;
    return null;
  };

  return (
    <div>
      <p className="text-[13px] leading-relaxed max-w-3xl" style={{ color: "var(--foreground)" }}>{t.intro}</p>

      {/* kreator */}
      <div className="card mt-4" style={{ padding: 18 }}>
        <div className="flex flex-wrap items-end gap-3">
          <div style={{ flex: "1 1 240px" }}>
            <div className="lbl-sm" style={{ marginBottom: 6 }}>{t.pick}</div>
            <select
              className="select"
              value={subIdx}
              onChange={(e) => {
                setSubIdx(Number(e.target.value));
                setStatus(null);
              }}
              style={{ marginBottom: 0 }}
            >
              {SUBS.map((s, i) => (
                <option key={s.nip} value={i}>{s.name}</option>
              ))}
            </select>
          </div>
          <span className="chip" style={{ marginBottom: 8 }}>{t.period}</span>
          {status === null && (
            <button className="btn btn-primary" type="button" onClick={() => setStatus("draft")}>
              <FileText size={15} /> {t.genDraft}
            </button>
          )}
          {status === "draft" && (
            <button className="btn btn-primary" type="button" onClick={() => setStatus("sent")}>
              <Send size={15} /> {t.send}
            </button>
          )}
          {status === "sent" && (
            <button className="btn btn-primary" type="button" onClick={() => setStatus("final")}>
              <Check size={15} /> {t.accept}
            </button>
          )}
          {statusChip()}
        </div>
        {/* cykl życia */}
        {status !== null && (
          <div className="steps" style={{ marginTop: 16 }}>
            <span className={`step ${status !== null ? "done" : ""}`}>
              <span className="step-dot"><Check className="st-ico" /></span>
              <span className="step-lbl">DRAFT</span>
            </span>
            <span className={`step-line ${status === "sent" || status === "final" ? "done" : ""}`} />
            <span className={`step ${status === "sent" || status === "final" ? "done" : status === "draft" ? "active" : ""}`}>
              <span className="step-dot">{status === "sent" || status === "final" ? <Check className="st-ico" /> : "2"}</span>
              <span className="step-lbl">{lang === "pl" ? "Akceptacja" : "Approval"}</span>
            </span>
            <span className={`step-line ${status === "final" ? "done" : ""}`} />
            <span className={`step ${status === "final" ? "done" : status === "sent" ? "active" : ""}`}>
              <span className="step-dot">{status === "final" ? <Check className="st-ico" /> : "3"}</span>
              <span className="step-lbl">FINAL</span>
            </span>
          </div>
        )}
      </div>

      {/* dokument protokołu (PDF do pobrania) */}
      {status !== null && (
        <div className="card mt-4 nc-tab-swap" key={sub.nip}>
          <div className="flex items-center justify-between flex-wrap gap-2" style={{ marginBottom: 14 }}>
            <div>
              <div className="brand-word" style={{ fontSize: 12 }}>KLAROW</div>
              <h3 style={{ fontSize: 15, marginTop: 6, color: "var(--heading)" }}>{t.doc}</h3>
              <div className="text-[12px] tnum" style={{ color: "var(--muted-foreground)" }}>{t.docPeriod}</div>
            </div>
            <PdfButton
              label={t.printBtn}
              build={() => ({
                filename: "klarow-protokol-robocizny-demo.pdf",
                title: t.doc,
                subtitle: t.docPeriod,
                metaLines: [`${t.docSub}: ${sub.name}`, `${t.docNip}: ${sub.nip}`],
                table: {
                  head: [t.thInv, t.thScope, t.thHours, t.thRate, t.thAmount],
                  widths: ["auto", "*", "auto", "auto", "auto"],
                  alignRight: [2, 3, 4],
                  body: rows.map((r) => [
                    r.investment,
                    r.scope[lang],
                    r.hours,
                    fmt(r.rateGr, lang),
                    fmt(r.hours * r.rateGr, lang),
                  ]),
                  foot: [t.total, "", rows.reduce((s, r) => s + r.hours, 0), "", fmt(totalGr, lang)],
                },
                signatures: [t.sig1, t.sig2],
              })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[13px]" style={{ marginBottom: 12 }}>
            <div><span className="lbl-sm">{t.docSub}: </span><strong style={{ color: "var(--heading)" }}>{sub.name}</strong></div>
            <div><span className="lbl-sm">{t.docNip}: </span><span className="tnum">{sub.nip}</span></div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t.thInv}</th>
                  <th>{t.thScope}</th>
                  <th className="num">{t.thHours}</th>
                  <th className="num">{t.thRate}</th>
                  <th className="num">{t.thAmount}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i}>
                    <td><strong>{r.investment}</strong></td>
                    <td>{r.scope[lang]}</td>
                    <td className="num tnum">{r.hours}</td>
                    <td className="num nowrap">{fmt(r.rateGr, lang)}</td>
                    <td className="num nowrap">{fmt(r.hours * r.rateGr, lang)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={2}><strong>{t.total}</strong></td>
                  <td className="num tnum"><strong>{rows.reduce((s, r) => s + r.hours, 0)}</strong></td>
                  <td></td>
                  <td className="num nowrap"><strong>{fmt(totalGr, lang)}</strong></td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* podpisy (widoczne też na wydruku) */}
          <div className="grid grid-cols-2 gap-8" style={{ marginTop: 34 }}>
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 8 }}>
              <span className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>{t.sig1}</span>
            </div>
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 8 }}>
              <span className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>{t.sig2}</span>
            </div>
          </div>
        </div>
      )}

      <p className="mt-3 text-[11.5px]" style={{ color: "var(--muted-foreground)" }}>{t.foot}</p>
    </div>
  );
}
