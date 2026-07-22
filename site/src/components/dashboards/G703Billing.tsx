import { useMemo, useState } from "react";
import { Landmark, TriangleAlert, Info } from "lucide-react";
import { useLang } from "@/i18n";

/* Dashboard „Fakturowanie US (AIA G703)" — LIVE, dane fikcyjne, deterministyczny.
   Odbrandowane odtworzenie silnika propozycji 1:1 z blueprintu:
     earned  = round(D × M)                      [centy, int]
     billed  = Σ dotychczas zafakturowane        [depozyt liczy się jako billed]
     proposal = earned − billed   gdy M > próg depozytu (40%), inaczej 0
     change ordery: ten sam wzór, bez progu depozytu
     ujemna propozycja = CLAWBACK — celowo NIE przycinana (korekta).
   Suwaki % postępu per linia → propozycja przelicza się na żywo. */

const DEPOSIT_PCT = 0.4;

interface Line {
  id: string;
  desc: { pl: string; en: string };
  kind: "base" | "change_order";
  schedC: number; // scheduled value w centach (D)
  billedC: number; // dotychczas zafakturowane (z depozytem)
  m0: number; // startowe wykonanie %
}

const LINES: Line[] = [
  { id: "01", desc: { pl: "Prefabrykacja modułów", en: "Module prefabrication" }, kind: "base", schedC: 84000000, billedC: 42000000, m0: 62 },
  { id: "02", desc: { pl: "Transport i logistyka", en: "Transport & logistics" }, kind: "base", schedC: 12500000, billedC: 5000000, m0: 48 },
  { id: "03", desc: { pl: "Montaż na placu", en: "On-site assembly" }, kind: "base", schedC: 46000000, billedC: 9200000, m0: 35 },
  { id: "04", desc: { pl: "Instalacje MEP", en: "MEP installations" }, kind: "base", schedC: 21000000, billedC: 0, m0: 22 },
  { id: "05", desc: { pl: "Wykończenia", en: "Finishes" }, kind: "base", schedC: 15000000, billedC: 0, m0: 8 },
  { id: "CH01", desc: { pl: "Zmiana: doposażenie klatki", en: "Change: stairwell upgrade" }, kind: "change_order", schedC: 6400000, billedC: 6400000, m0: 90 },
];

const roundHalfUp = (v: number) => Math.floor(v + 0.5);

function proposalFor(line: Line, mPct: number): { earnedC: number; proposalC: number; below: boolean } {
  const m = mPct / 100;
  const earnedC = roundHalfUp(line.schedC * m);
  const thresholdOk = line.kind === "change_order" || m > DEPOSIT_PCT;
  const proposalC = thresholdOk ? earnedC - line.billedC : 0;
  return { earnedC, proposalC, below: !thresholdOk };
}

const usd = (c: number) =>
  `$${(c / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const T = {
  pl: {
    intro: "Arkusz wartości (schedule of values) fikcyjnego projektu modułowego w USD. Przesuń % wykonania — silnik liczy „ile fakturować teraz” dokładnie tym samym wzorem, którym rozliczaliśmy realne aplikacje płatnicze.",
    formulaTitle: "Wzór (jawny, w centach)",
    formula: "propozycja = wykonanie × wartość − dotychczas zafakturowane · fakturowalne dopiero powyżej progu depozytu 40% · change ordery bez progu · ujemna propozycja = clawback (celowo nie przycinana)",
    thLine: "Linia",
    thDesc: "Zakres",
    thSched: "Wartość (D)",
    thM: "Wykonanie (M)",
    thEarned: "Wypracowane",
    thBilled: "Zafakturowane",
    thProposal: "Do faktury teraz",
    total: "RAZEM",
    below: "poniżej progu 40%",
    clawback: "CLAWBACK",
    changeOrder: "change order",
    kProposal: "Propozycja aplikacji",
    kEarned: "Wypracowane łącznie",
    kBilled: "Zafakturowane łącznie",
    foot: "Dane fikcyjne · centy (int), zero dryfu · te same dane zawsze dają tę samą propozycję. Otwiera rynek USA (budownictwo modułowe).",
  },
  en: {
    intro: "The schedule of values of a fictional modular project in USD. Drag the completion % — the engine computes “how much to bill now” with exactly the same formula we used to settle real pay applications.",
    formulaTitle: "Formula (explicit, in cents)",
    formula: "proposal = completion × value − billed to date · billable only above the 40% deposit threshold · change orders skip the threshold · a negative proposal = clawback (deliberately not clamped)",
    thLine: "Line",
    thDesc: "Scope",
    thSched: "Value (D)",
    thM: "Completion (M)",
    thEarned: "Earned",
    thBilled: "Billed",
    thProposal: "To bill now",
    total: "TOTAL",
    below: "below the 40% threshold",
    clawback: "CLAWBACK",
    changeOrder: "change order",
    kProposal: "Application proposal",
    kEarned: "Earned to date",
    kBilled: "Billed to date",
    foot: "Fictional data · cents (int), zero drift · the same data always yields the same proposal. Opens the US market (modular construction).",
  },
};

export default function G703Billing() {
  const { lang } = useLang();
  const t = T[lang];
  const [m, setM] = useState<Record<string, number>>(() => Object.fromEntries(LINES.map((l) => [l.id, l.m0])));

  const rows = useMemo(
    () => LINES.map((l) => ({ line: l, mPct: m[l.id], ...proposalFor(l, m[l.id]) })),
    [m]
  );
  const totEarned = rows.reduce((s, r) => s + r.earnedC, 0);
  const totBilled = LINES.reduce((s, l) => s + l.billedC, 0);
  const totProposal = rows.reduce((s, r) => s + r.proposalC, 0);

  return (
    <div>
      <p className="text-[13px] leading-relaxed max-w-3xl" style={{ color: "var(--foreground)" }}>{t.intro}</p>

      {/* KPI */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card stat">
          <div className="lbl">{t.kProposal}</div>
          <div className="val tnum" style={{ fontSize: "clamp(15px,1vw+10px,22px)", color: totProposal < 0 ? "var(--rejected)" : undefined }}>
            {usd(totProposal)}
          </div>
        </div>
        <div className="card stat">
          <div className="lbl">{t.kEarned}</div>
          <div className="val tnum" style={{ fontSize: "clamp(15px,1vw+10px,22px)" }}>{usd(totEarned)}</div>
        </div>
        <div className="card stat">
          <div className="lbl">{t.kBilled}</div>
          <div className="val tnum" style={{ fontSize: "clamp(15px,1vw+10px,22px)" }}>{usd(totBilled)}</div>
        </div>
      </div>

      {/* arkusz linii */}
      <div className="card mt-4">
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>{t.thLine}</th>
                <th>{t.thDesc}</th>
                <th className="num">{t.thSched}</th>
                <th style={{ minWidth: 170 }}>{t.thM}</th>
                <th className="num">{t.thEarned}</th>
                <th className="num">{t.thBilled}</th>
                <th className="num">{t.thProposal}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.line.id}>
                  <td className="tnum">
                    <strong>{r.line.id}</strong>
                    {r.line.kind === "change_order" && (
                      <span className="st st-blue" style={{ marginLeft: 8 }}>{t.changeOrder}</span>
                    )}
                  </td>
                  <td className="text-[13px]">{r.line.desc[lang]}</td>
                  <td className="num nowrap">{usd(r.line.schedC)}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={r.mPct}
                        onChange={(e) => setM((prev) => ({ ...prev, [r.line.id]: Number(e.target.value) }))}
                        aria-label={`${t.thM} ${r.line.id}`}
                        style={{ flex: 1, accentColor: "var(--primary)" }}
                      />
                      <span className="tnum text-[12px]" style={{ width: 38, textAlign: "right", fontWeight: 700 }}>
                        {r.mPct}%
                      </span>
                    </div>
                  </td>
                  <td className="num nowrap">{usd(r.earnedC)}</td>
                  <td className="num nowrap" style={{ color: "var(--muted-foreground)" }}>{usd(r.line.billedC)}</td>
                  <td className="num nowrap" style={{ fontWeight: 700, color: r.proposalC < 0 ? "var(--rejected)" : r.proposalC > 0 ? "var(--funded)" : "var(--muted-foreground)" }}>
                    {usd(r.proposalC)}
                    {r.below && (
                      <span className="st st-gray st-open" style={{ marginLeft: 8 }}>
                        <Info className="st-ico" /> {t.below}
                      </span>
                    )}
                    {r.proposalC < 0 && (
                      <span className="st st-brick" style={{ marginLeft: 8 }}>
                        <TriangleAlert className="st-ico" /> {t.clawback}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2}><strong>{t.total}</strong></td>
                <td className="num nowrap"><strong>{usd(LINES.reduce((s, l) => s + l.schedC, 0))}</strong></td>
                <td></td>
                <td className="num nowrap"><strong>{usd(totEarned)}</strong></td>
                <td className="num nowrap"><strong>{usd(totBilled)}</strong></td>
                <td className="num nowrap"><strong style={{ color: totProposal < 0 ? "var(--rejected)" : "var(--funded)" }}>{usd(totProposal)}</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* wzór */}
      <div className="card mt-4" style={{ padding: 18 }}>
        <div className="lbl-sm flex items-center gap-2" style={{ marginBottom: 8 }}>
          <Landmark size={13} style={{ color: "var(--primary)" }} /> {t.formulaTitle}
        </div>
        <p className="text-[12.5px] leading-relaxed" style={{ color: "var(--foreground)" }}>{t.formula}</p>
      </div>

      <p className="mt-3 text-[11.5px]" style={{ color: "var(--muted-foreground)" }}>{t.foot}</p>
    </div>
  );
}
