import { useMemo, useState } from "react";
import { Check, X as XIcon, Clock, ArrowRight, Users } from "lucide-react";
import PdfButton from "./PdfButton";
import { useLang } from "@/i18n";

/* Dashboard „Obieg akceptacji przelewów" — LIVE, dane DEMO, deterministyczny.
   Odbrandowane odtworzenie rdzenia obiegu: wnioski o wydatek → macierz planu
   14-dniowego (derywowana z wniosków) → decyzja per pozycja (całość / część
   z przeniesieniem / odmowa) → statusy. Zasada „na cztery oczy" pokazana
   jako reguła (wnioskodawca ≠ akceptujący). Kwoty w groszach. Wydruk planu. */

const DAYS = 14;
const START = { d: 22, m: 7 }; // 22.07 (fikcyjny start planu)

interface Req {
  id: string;
  vendor: string;
  investment: string;
  amountGr: number;
  day: number; // indeks dnia 0..13
  requester: string;
}

const REQS: Req[] = [
  { id: "W-101", vendor: "Stal-Bud sp. z o.o.", investment: "Hala Poznań", amountGr: 18450000, day: 1, requester: "PM Adam" },
  { id: "W-102", vendor: "ElektroMont", investment: "Biurowiec Łódź", amountGr: 7620000, day: 2, requester: "PM Ewa" },
  { id: "W-103", vendor: "TransLog", investment: "Moduły Gdańsk", amountGr: 3140000, day: 2, requester: "PM Adam" },
  { id: "W-104", vendor: "Okna-System", investment: "Hala Poznań", amountGr: 12800000, day: 5, requester: "PM Ola" },
  { id: "W-105", vendor: "Hydro-Instal", investment: "Centrum Toruń", amountGr: 5410000, day: 7, requester: "PM Ewa" },
  { id: "W-106", vendor: "Beton-Mix", investment: "Magazyn Wrocław", amountGr: 9930000, day: 9, requester: "PM Adam" },
];

type Decision = { kind: "pending" } | { kind: "full" } | { kind: "partial"; partGr: number } | { kind: "rejected" };

const fmt = (gr: number, lang: "pl" | "en") =>
  lang === "pl"
    ? `${(gr / 100).toLocaleString("pl-PL", { minimumFractionDigits: 2 })} zł`
    : `PLN ${(gr / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

const dayLabel = (i: number) => {
  const d = START.d + i;
  const m = START.m + (d > 31 ? 1 : 0);
  return `${String(((d - 1) % 31) + 1).padStart(2, "0")}.${String(m).padStart(2, "0")}`;
};

const T = {
  pl: {
    intro: "Wnioski o wydatek spływają od PM-ów; plan 14-dniowy wylicza się z nich automatycznie. Decydujesz per pozycja: całość, połowa (reszta przechodzi na +7 dni) albo odmowa. Zasada „na cztery oczy”: wnioskodawca ≠ akceptujący.",
    kSum: "Suma wniosków",
    kApproved: "Zaakceptowane",
    kPending: "Oczekujące",
    matrix: "Plan płatności — 14 dni",
    requests: "Wnioski do decyzji",
    full: "Całość",
    partial: "Połowa (+7 dni)",
    reject: "Odmów",
    stPending: "Oczekuje",
    stFull: "Zaakceptowany",
    stPartial: "Częściowo (+7 dni)",
    stRejected: "Odrzucony",
    thReq: "Wniosek",
    thVendor: "Dostawca",
    thInv: "Inwestycja",
    thAmount: "Kwota",
    thDay: "Termin",
    thDecision: "Decyzja",
    fourEyes: "Cztery oczy: akceptuje inna osoba niż wnioskodawca — tu demonstracyjnie Ty (KONTROLER), wnioski złożyli PM-owie.",
    printTitle: "PLAN PŁATNOŚCI — 14 DNI",
    printBtn: "Pobierz plan (PDF)",
    pdfDay: "Data",
    pdfSum: "Kwota planowana",
    pdfCarried: "w tym przeniesione",
    foot: "Dane fikcyjne · kwoty w groszach · decyzje przeliczają plan natychmiast i deterministycznie.",
    carried: "przeniesione",
  },
  en: {
    intro: "Spending requests come from PMs; the 14-day plan derives from them automatically. You decide per item: full, half (the rest carries +7 days) or reject. Four-eyes: requester ≠ approver.",
    kSum: "Requests total",
    kApproved: "Approved",
    kPending: "Pending",
    matrix: "Payment plan — 14 days",
    requests: "Requests to decide",
    full: "Full",
    partial: "Half (+7 days)",
    reject: "Reject",
    stPending: "Pending",
    stFull: "Approved",
    stPartial: "Partial (+7 days)",
    stRejected: "Rejected",
    thReq: "Request",
    thVendor: "Vendor",
    thInv: "Investment",
    thAmount: "Amount",
    thDay: "Due",
    thDecision: "Decision",
    fourEyes: "Four-eyes: a different person approves than requested — here you (CONTROLLER), the requests came from PMs.",
    printTitle: "PAYMENT PLAN — 14 DAYS",
    printBtn: "Download plan (PDF)",
    pdfDay: "Date",
    pdfSum: "Planned amount",
    pdfCarried: "of which carried",
    foot: "Fictional data · amounts in cents · decisions recompute the plan instantly and deterministically.",
    carried: "carried",
  },
};

export default function PaymentFlow() {
  const { lang } = useLang();
  const t = T[lang];
  const [decisions, setDecisions] = useState<Record<string, Decision>>(
    () => Object.fromEntries(REQS.map((r) => [r.id, { kind: "pending" } as Decision]))
  );

  const decide = (id: string, d: Decision) => setDecisions((prev) => ({ ...prev, [id]: d }));

  /* plan: kwoty per dzień — full → dzień wniosku; partial → połowa w dniu, połowa +7; rejected → 0 */
  const plan = useMemo(() => {
    const days = Array.from({ length: DAYS }, () => ({ sumGr: 0, carriedGr: 0 }));
    for (const r of REQS) {
      const d = decisions[r.id];
      if (d.kind === "full" || d.kind === "pending") {
        days[r.day].sumGr += d.kind === "full" ? r.amountGr : 0;
      }
      if (d.kind === "partial") {
        const half = Math.round(r.amountGr / 2);
        days[r.day].sumGr += half;
        const carryDay = Math.min(DAYS - 1, r.day + 7);
        days[carryDay].sumGr += r.amountGr - half;
        days[carryDay].carriedGr += r.amountGr - half;
      }
    }
    return days;
  }, [decisions]);

  const sumAll = REQS.reduce((s, r) => s + r.amountGr, 0);
  const approvedGr = REQS.reduce((s, r) => {
    const d = decisions[r.id];
    return s + (d.kind === "full" ? r.amountGr : d.kind === "partial" ? r.amountGr : 0);
  }, 0);
  const pendingCount = REQS.filter((r) => decisions[r.id].kind === "pending").length;
  const maxDay = Math.max(1, ...plan.map((p) => p.sumGr));

  const chip = (d: Decision) => {
    if (d.kind === "full") return <span className="st st-green"><Check className="st-ico" /> {t.stFull}</span>;
    if (d.kind === "partial") return <span className="st st-blue"><ArrowRight className="st-ico" /> {t.stPartial}</span>;
    if (d.kind === "rejected") return <span className="st st-brick"><XIcon className="st-ico" /> {t.stRejected}</span>;
    return <span className="st st-accent"><Clock className="st-ico" /> {t.stPending}</span>;
  };

  return (
    <div>
      <p className="text-[13px] leading-relaxed max-w-3xl" style={{ color: "var(--foreground)" }}>{t.intro}</p>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card stat">
          <div className="lbl">{t.kSum}</div>
          <div className="val tnum" style={{ fontSize: "clamp(15px,1vw+10px,21px)" }}>{fmt(sumAll, lang)}</div>
        </div>
        <div className="card stat">
          <div className="lbl">{t.kApproved}</div>
          <div className="val tnum" style={{ fontSize: "clamp(15px,1vw+10px,21px)", color: "var(--funded)" }}>{fmt(approvedGr, lang)}</div>
        </div>
        <div className="card stat">
          <div className="lbl">{t.kPending}</div>
          <div className="val tnum" style={pendingCount > 0 ? { color: "var(--warning)" } : undefined}>{pendingCount}</div>
        </div>
      </div>

      {/* wnioski do decyzji */}
      <div className="card mt-4">
        <h3 style={{ fontSize: 14, marginBottom: 12 }}>{t.requests}</h3>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>{t.thReq}</th>
                <th>{t.thVendor}</th>
                <th>{t.thInv}</th>
                <th className="num">{t.thAmount}</th>
                <th className="num">{t.thDay}</th>
                <th>{t.thDecision}</th>
              </tr>
            </thead>
            <tbody>
              {REQS.map((r) => {
                const d = decisions[r.id];
                return (
                  <tr key={r.id}>
                    <td className="tnum"><strong>{r.id}</strong><div className="text-[10.5px]" style={{ color: "var(--muted-foreground)" }}>{r.requester}</div></td>
                    <td>{r.vendor}</td>
                    <td className="text-[12.5px]">{r.investment}</td>
                    <td className="num nowrap">{fmt(r.amountGr, lang)}</td>
                    <td className="num tnum">{dayLabel(r.day)}</td>
                    <td>
                      {d.kind === "pending" ? (
                        <div className="flex flex-wrap gap-1.5">
                          <button className="btn btn-secondary btn-sm" type="button" onClick={() => decide(r.id, { kind: "full" })}>
                            <Check size={13} /> {t.full}
                          </button>
                          <button className="btn btn-secondary btn-sm" type="button" onClick={() => decide(r.id, { kind: "partial", partGr: Math.round(r.amountGr / 2) })}>
                            {t.partial}
                          </button>
                          <button className="btn btn-danger btn-sm" type="button" onClick={() => decide(r.id, { kind: "rejected" })}>
                            {t.reject}
                          </button>
                        </div>
                      ) : (
                        chip(d)
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[11.5px] flex items-center gap-1.5" style={{ color: "var(--muted-foreground)" }}>
          <Users size={13} style={{ color: "var(--primary)" }} /> {t.fourEyes}
        </p>
      </div>

      {/* macierz planu 14-dniowego + PDF */}
      <div className="card mt-4">
        <div className="flex items-center justify-between flex-wrap gap-2" style={{ marginBottom: 12 }}>
          <h3 style={{ fontSize: 14 }}>{t.matrix}</h3>
          <PdfButton
            label={t.printBtn}
            build={() => ({
              filename: "klarow-plan-platnosci-demo.pdf",
              title: t.printTitle,
              metaLines: [`${t.kSum}: ${fmt(sumAll, lang)}`, `${t.kApproved}: ${fmt(approvedGr, lang)}`],
              table: {
                head: [t.pdfDay, t.pdfSum, t.pdfCarried],
                widths: ["*", "auto", "auto"],
                alignRight: [1, 2],
                body: plan.map((p, i) => [
                  dayLabel(i),
                  p.sumGr > 0 ? fmt(p.sumGr, lang) : "—",
                  p.carriedGr > 0 ? fmt(p.carriedGr, lang) : "—",
                ]),
                foot: [
                  "Σ",
                  fmt(plan.reduce((s, p) => s + p.sumGr, 0), lang),
                  fmt(plan.reduce((s, p) => s + p.carriedGr, 0), lang),
                ],
              },
              note: t.fourEyes,
            })}
          />
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table" style={{ minWidth: 720 }}>
            <thead>
              <tr>
                {plan.map((_, i) => (
                  <th key={i} className="num tnum" style={{ fontSize: 10 }}>{dayLabel(i)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {plan.map((p, i) => (
                  <td key={i} className="num" style={{ padding: "8px 6px", verticalAlign: "bottom" }}>
                    <div
                      aria-hidden="true"
                      style={{
                        height: 46 * (p.sumGr / maxDay),
                        minHeight: p.sumGr > 0 ? 4 : 0,
                        borderRadius: 3,
                        background: p.carriedGr > 0 ? "var(--warning)" : "var(--primary)",
                        opacity: 0.85,
                        marginBottom: 4,
                      }}
                    />
                    <span className="tnum" style={{ fontSize: 10, color: p.sumGr > 0 ? "var(--foreground)" : "var(--muted-foreground)" }}>
                      {p.sumGr > 0 ? (p.sumGr / 100000).toFixed(0) + (lang === "pl" ? " tys." : "k") : "—"}
                    </span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        <div className="legend">
          <span><i style={{ background: "var(--primary)" }} /> {t.kApproved}</span>
          <span><i style={{ background: "var(--warning)" }} /> {t.carried} (+7)</span>
        </div>
      </div>

      <p className="mt-3 text-[11.5px]" style={{ color: "var(--muted-foreground)" }}>{t.foot}</p>
    </div>
  );
}
