import { useMemo, useState } from "react";
import { Calculator, Plus, Trash2, ArrowRightLeft, CheckCircle2 } from "lucide-react";
import { useLang } from "@/i18n";

/* Dashboard „Kalkulator transz i walut" — LIVE, deterministyczny, dane fikcyjne.
   Odbrandowane odtworzenie (zasada #3). Kluczowa zasada 1:1 z blueprintu:
   transza rozdzielana PROPORCJONALNIE do rozpiski, reszta zaokrągleń zawsze
   na OSTATNIEJ pozycji → Σ == kwota transzy CO DO GROSZA (liczymy w groszach). */

const VAT = 0.23;

/* fikcyjna rozpiska dokumentu (netto, zł) */
const BREAKDOWN = [
  { investment: "Hala Poznań", net: 148500 },
  { investment: "Moduły Gdańsk", net: 96200 },
  { investment: "Biurowiec Łódź", net: 61300 },
];
const TOTAL_NET = BREAKDOWN.reduce((s, b) => s + b.net, 0);

/* alokacja proporcjonalna w GROSZACH — reszta na ostatniej pozycji (Σ == target) */
function allocateGrosze(weights: number[], targetGr: number): number[] {
  const s = weights.reduce((a, b) => a + b, 0);
  const out: number[] = [];
  let running = 0;
  for (let i = 0; i < weights.length; i++) {
    if (s <= 0) {
      out.push(0);
    } else if (i < weights.length - 1) {
      const amt = Math.round((weights[i] / s) * targetGr);
      out.push(amt);
      running += amt;
    } else {
      out.push(targetGr - running); // reszta zaokrągleń tu → zero dryfu
    }
  }
  return out;
}

interface Tranche {
  id: number;
  amount: number; // netto zł
  vat: boolean;
}

const fmtZl = (gr: number, lang: "pl" | "en") => {
  const v = gr / 100;
  return lang === "pl"
    ? `${v.toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} zł`
    : `PLN ${v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

/* fikcyjne kursy (zamiast EBC) — deterministyczne */
const FX: Record<string, number> = { PLN: 1, EUR: 4.31, USD: 3.97 };

const T = {
  pl: {
    docLbl: "Dokument (fikcyjny) — rozpiska netto",
    total: "Total netto",
    add: "Dodaj transzę",
    amount: "Kwota transzy (netto, zł)",
    vat: "Dolicz VAT 23%",
    paid: "Zapłacono",
    remaining: "Zostało",
    percent: "% dokumentu",
    thInv: "Inwestycja",
    thBase: "Bazowo (netto)",
    thTranche: "Ta transza",
    thGross: "Brutto (z VAT)",
    trancheList: "Transze",
    trNo: "Transza",
    sumCheck: "Σ transzy zgadza się co do grosza",
    remove: "Usuń",
    fxTitle: "Kalkulator walutowy",
    fxAmount: "Kwota",
    fxResult: "Wynik",
    foot: "Dane i kursy fikcyjne. Alokacja proporcjonalna, reszta na ostatniej pozycji — Σ zawsze co do grosza. Liczone w groszach, zero dryfu.",
    empty: "Dodaj pierwszą transzę, aby zobaczyć rozdział na inwestycje.",
  },
  en: {
    docLbl: "Document (fictional) — net breakdown",
    total: "Net total",
    add: "Add tranche",
    amount: "Tranche amount (net, PLN)",
    vat: "Add 23% VAT",
    paid: "Paid",
    remaining: "Remaining",
    percent: "% of document",
    thInv: "Investment",
    thBase: "Base (net)",
    thTranche: "This tranche",
    thGross: "Gross (with VAT)",
    trancheList: "Tranches",
    trNo: "Tranche",
    sumCheck: "Tranche Σ reconciles to the cent",
    remove: "Remove",
    fxTitle: "Currency calculator",
    fxAmount: "Amount",
    fxResult: "Result",
    foot: "Fictional data and rates. Proportional allocation, remainder on the last line — Σ always to the cent. Computed in cents, zero drift.",
    empty: "Add the first tranche to see the split across investments.",
  },
};

export default function PaymentCalculator() {
  const { lang } = useLang();
  const t = T[lang];
  const [tranches, setTranches] = useState<Tranche[]>([{ id: 1, amount: 120000, vat: true }]);
  const [draft, setDraft] = useState("");
  const [draftVat, setDraftVat] = useState(true);
  const [fxAmount, setFxAmount] = useState("1000");
  const [fxFrom, setFxFrom] = useState("EUR");
  const [fxTo, setFxTo] = useState("PLN");

  const weights = BREAKDOWN.map((b) => Math.round(b.net * 100));

  const paidGr = tranches.reduce((s, tr) => s + Math.round(tr.amount * 100), 0);
  const totalGr = Math.round(TOTAL_NET * 100);
  const remainingGr = Math.max(0, totalGr - paidGr);
  const pct = totalGr > 0 ? Math.min(100, (paidGr / totalGr) * 100) : 0;

  /* rozdział sumy zapłaconej na inwestycje (podgląd „bazowo per inwestycja") */
  const alloc = useMemo(() => allocateGrosze(weights, paidGr), [paidGr]); // eslint-disable-line react-hooks/exhaustive-deps

  const addTranche = () => {
    const v = Number(draft.replace(/\s/g, "").replace(",", "."));
    if (!Number.isFinite(v) || v <= 0) return;
    setTranches((prev) => [...prev, { id: (prev[prev.length - 1]?.id ?? 0) + 1, amount: v, vat: draftVat }]);
    setDraft("");
  };
  const removeTranche = (id: number) => setTranches((prev) => prev.filter((tr) => tr.id !== id));

  const fxRate = FX[fxFrom] / FX[fxTo];
  const fxIn = Number(fxAmount.replace(/\s/g, "").replace(",", ".")) || 0;
  const fxOut = fxIn * fxRate;

  return (
    <div>
      {/* dokument + KPI */}
      <div className="card" style={{ padding: 18 }}>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="lbl-sm">{t.docLbl}</span>
          <span className="st st-accent tnum">{t.total}: {fmtZl(totalGr, lang)}</span>
        </div>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {BREAKDOWN.map((b) => (
            <div key={b.investment} className="flex items-center justify-between rounded-[10px] px-3 py-2" style={{ border: "1px solid var(--border)", background: "var(--muted)" }}>
              <span className="text-[12.5px] font-bold truncate" style={{ color: "var(--heading)" }}>{b.investment}</span>
              <span className="tnum text-[12px]" style={{ color: "var(--muted-foreground)" }}>{fmtZl(Math.round(b.net * 100), lang)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card stat">
          <div className="lbl">{t.paid}</div>
          <div className="val tnum" style={{ fontSize: "clamp(16px,1vw+11px,22px)" }}>{fmtZl(paidGr, lang)}</div>
        </div>
        <div className="card stat">
          <div className="lbl">{t.remaining}</div>
          <div className="val tnum" style={{ fontSize: "clamp(16px,1vw+11px,22px)" }}>{fmtZl(remainingGr, lang)}</div>
        </div>
        <div className="card stat">
          <div className="lbl">{t.percent}</div>
          <div className="val tnum">{pct.toLocaleString(lang === "pl" ? "pl-PL" : "en-US", { maximumFractionDigits: 1 })}%</div>
        </div>
      </div>

      {/* dodawanie transzy */}
      <div className="card mt-4" style={{ padding: 18 }}>
        <div className="flex flex-wrap items-end gap-3">
          <div style={{ flex: "1 1 200px" }}>
            <div className="lbl-sm" style={{ marginBottom: 6 }}>{t.amount}</div>
            <input
              className="input"
              inputMode="decimal"
              value={draft}
              placeholder="60000"
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTranche()}
              style={{ fontVariantNumeric: "tabular-nums" }}
            />
          </div>
          <label className="flex items-center gap-2 text-[13px] font-semibold" style={{ color: "var(--foreground)", paddingBottom: 10 }}>
            <input type="checkbox" checked={draftVat} onChange={(e) => setDraftVat(e.target.checked)} style={{ accentColor: "var(--primary)" }} />
            {t.vat}
          </label>
          <button className="btn btn-secondary" type="button" onClick={addTranche} style={{ marginBottom: 0 }}>
            <Plus size={15} /> {t.add}
          </button>
        </div>
      </div>

      {/* rozdział na inwestycje */}
      {paidGr > 0 ? (
        <div className="card mt-4">
          <div className="flex items-center gap-2" style={{ marginBottom: 12 }}>
            <Calculator size={15} style={{ color: "var(--primary)" }} />
            <strong style={{ color: "var(--heading)", fontSize: 14 }}>{t.thTranche} → {t.thInv}</strong>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t.thInv}</th>
                  <th className="num">{t.thBase}</th>
                  <th className="num">{t.thTranche}</th>
                  <th className="num">{t.thGross}</th>
                </tr>
              </thead>
              <tbody>
                {BREAKDOWN.map((b, i) => (
                  <tr key={b.investment}>
                    <td><strong>{b.investment}</strong></td>
                    <td className="num nowrap">{fmtZl(Math.round(b.net * 100), lang)}</td>
                    <td className="num nowrap">{fmtZl(alloc[i], lang)}</td>
                    <td className="num nowrap">{fmtZl(Math.round(alloc[i] * (1 + VAT)), lang)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td><strong>Σ</strong></td>
                  <td className="num nowrap"><strong>{fmtZl(totalGr, lang)}</strong></td>
                  <td className="num nowrap"><strong>{fmtZl(alloc.reduce((s, a) => s + a, 0), lang)}</strong></td>
                  <td className="num nowrap"><strong>{fmtZl(Math.round(alloc.reduce((s, a) => s + a, 0) * (1 + VAT)), lang)}</strong></td>
                </tr>
              </tfoot>
            </table>
          </div>
          <p className="mt-3 text-[12px] flex items-center gap-1.5" style={{ color: "var(--funded)" }}>
            <CheckCircle2 size={14} /> {t.sumCheck}: Σ = {fmtZl(alloc.reduce((s, a) => s + a, 0), lang)} = {fmtZl(paidGr, lang)}
          </p>
        </div>
      ) : (
        <p className="mt-4 text-[12.5px]" style={{ color: "var(--muted-foreground)" }}>{t.empty}</p>
      )}

      {/* lista transz */}
      {tranches.length > 0 && (
        <div className="card mt-4">
          <div className="lbl-sm" style={{ marginBottom: 10 }}>{t.trancheList}</div>
          <div className="flex flex-col gap-2">
            {tranches.map((tr, i) => (
              <div key={tr.id} className="flex items-center justify-between gap-2 rounded-[10px] px-3 py-2" style={{ border: "1px solid var(--border)" }}>
                <span className="text-[13px]" style={{ color: "var(--foreground)" }}>
                  {t.trNo} {i + 1}: <span className="tnum" style={{ fontWeight: 700 }}>{fmtZl(Math.round(tr.amount * 100), lang)}</span>
                  {tr.vat && <span className="st st-gray" style={{ marginLeft: 8 }}>+VAT</span>}
                </span>
                <button className="btn btn-ghost btn-sm btn-ico" type="button" onClick={() => removeTranche(tr.id)} aria-label={t.remove}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* kalkulator walutowy */}
      <div className="card mt-4" style={{ padding: 18 }}>
        <div className="flex items-center gap-2" style={{ marginBottom: 12 }}>
          <ArrowRightLeft size={15} style={{ color: "var(--primary)" }} />
          <strong style={{ color: "var(--heading)", fontSize: 14 }}>{t.fxTitle}</strong>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <div style={{ flex: "1 1 140px" }}>
            <div className="lbl-sm" style={{ marginBottom: 6 }}>{t.fxAmount}</div>
            <input className="input" inputMode="decimal" value={fxAmount} onChange={(e) => setFxAmount(e.target.value)} style={{ fontVariantNumeric: "tabular-nums" }} />
          </div>
          <select className="select" value={fxFrom} onChange={(e) => setFxFrom(e.target.value)} style={{ width: "auto", marginBottom: 0 }}>
            {Object.keys(FX).map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <ArrowRightLeft size={16} style={{ color: "var(--muted-foreground)", marginBottom: 10 }} />
          <select className="select" value={fxTo} onChange={(e) => setFxTo(e.target.value)} style={{ width: "auto", marginBottom: 0 }}>
            {Object.keys(FX).map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <div style={{ flex: "1 1 160px" }}>
            <div className="lbl-sm" style={{ marginBottom: 6 }}>{t.fxResult}</div>
            <div className="tnum" style={{ fontSize: 20, fontWeight: 800, color: "var(--heading)" }}>
              {fxOut.toLocaleString(lang === "pl" ? "pl-PL" : "en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {fxTo}
            </div>
          </div>
        </div>
        <p className="mt-2 text-[11px] tnum" style={{ color: "var(--muted-foreground)" }}>
          1 {fxFrom} = {fxRate.toLocaleString(lang === "pl" ? "pl-PL" : "en-US", { maximumFractionDigits: 4 })} {fxTo}
        </p>
      </div>

      <p className="mt-3 text-[11.5px]" style={{ color: "var(--muted-foreground)" }}>{t.foot}</p>
    </div>
  );
}
