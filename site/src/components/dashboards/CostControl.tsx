import { useMemo, useState } from "react";
import { Check, TriangleAlert, Lock } from "lucide-react";
import PdfButton from "./PdfButton";
import { useLang } from "@/i18n";

/* Dashboard „Kontroling kosztów projektu" (widok PM) — LIVE, dane DEMO.
   Odbrandowane odtworzenie rdzenia Cost Tracking: paski budżet/wydatek/
   przekroczenie per etap, edytowalne estymaty do końca (ETC), prognoza
   marży NA ŻYWO (EAC = koszt dotychczas + ETC), bramka „zatwierdź tydzień"
   z walidacją (ujemne ETC blokują zatwierdzenie — jak PM_MINUS w audycie).
   Kwoty w tys. zł (int) — deterministycznie. Wydruk podsumowania tygodnia. */

const CONTRACT = 9600; // wartość kontraktu, tys. zł

interface StageRow {
  name: { pl: string; en: string };
  budget: number; // tys. zł
  spent: number; // koszt dotychczas
  etc0: number; // startowa estymata do końca
}

const STAGES: StageRow[] = [
  { name: { pl: "Projektowanie", en: "Design" }, budget: 480, spent: 505, etc0: 0 },
  { name: { pl: "Prefabrykacja", en: "Prefabrication" }, budget: 2600, spent: 1890, etc0: 640 },
  { name: { pl: "Montaż", en: "Assembly" }, budget: 2300, spent: 1260, etc0: 1180 },
  { name: { pl: "Instalacje", en: "Installations" }, budget: 940, spent: 310, etc0: 610 },
  { name: { pl: "Wykończenia", en: "Finishes" }, budget: 520, spent: 40, etc0: 470 },
];

const fmtK = (v: number, lang: "pl" | "en") =>
  lang === "pl" ? `${v.toLocaleString("pl-PL")} tys. zł` : `PLN ${v.toLocaleString("en-US")}k`;

const T = {
  pl: {
    intro: "Widok kontrolera/PM dla jednego projektu (tydzień 30). Popraw estymaty „do końca” (ETC) — prognoza marży przelicza się na żywo. Tydzień zatwierdzisz dopiero, gdy dane przejdą walidację.",
    kMargin: "Prognoza marży (EAC)",
    kEac: "Koszt końcowy (EAC)",
    kContract: "Wartość kontraktu",
    thStage: "Etap",
    thBudget: "Budżet",
    thSpent: "Wydatek",
    thEtc: "Estymata do końca (ETC)",
    thEac: "EAC",
    thVar: "Odchyl. od budżetu",
    approve: "Zatwierdź tydzień 30",
    approved: "Tydzień 30 zatwierdzony",
    blocked: "Ujemne ETC blokują zatwierdzenie (walidacja jak w Audycie: PM nie może estymować na minusie).",
    over: "przekroczenie",
    printTitle: "PODSUMOWANIE TYGODNIA 30 — KONTROLING PROJEKTU",
    printBtn: "Pobierz podsumowanie (PDF)",
    foot: "Dane fikcyjne · zmiany trzymane lokalnie (bez chmury) · te same dane zawsze dają tę samą prognozę.",
  },
  en: {
    intro: "The controller/PM view of one project (week 30). Adjust the estimates-to-complete (ETC) — the margin forecast recomputes live. You can approve the week only when data passes validation.",
    kMargin: "Margin forecast (EAC)",
    kEac: "Final cost (EAC)",
    kContract: "Contract value",
    thStage: "Stage",
    thBudget: "Budget",
    thSpent: "Spent",
    thEtc: "Estimate to complete (ETC)",
    thEac: "EAC",
    thVar: "Var. vs budget",
    approve: "Approve week 30",
    approved: "Week 30 approved",
    blocked: "Negative ETC blocks approval (the same validation as the Audit: a PM can't estimate negative).",
    over: "overrun",
    printTitle: "WEEK 30 SUMMARY — PROJECT CONTROLLING",
    printBtn: "Download summary (PDF)",
    foot: "Fictional data · changes kept locally (no cloud) · the same data always yields the same forecast.",
  },
};

export default function CostControl() {
  const { lang } = useLang();
  const t = T[lang];
  const [etc, setEtc] = useState<number[]>(() => STAGES.map((s) => s.etc0));
  const [approved, setApproved] = useState(false);

  const rows = useMemo(
    () =>
      STAGES.map((s, i) => {
        const eac = s.spent + etc[i];
        return { ...s, etc: etc[i], eac, variance: eac - s.budget };
      }),
    [etc]
  );

  const totalBudget = STAGES.reduce((s, x) => s + x.budget, 0);
  const totalSpent = STAGES.reduce((s, x) => s + x.spent, 0);
  const totalEac = rows.reduce((s, r) => s + r.eac, 0);
  const margin = ((CONTRACT - totalEac) / CONTRACT) * 100;
  const hasNegative = etc.some((v) => v < 0);

  const setOne = (i: number, raw: string) => {
    const v = Number(raw.replace(/\s/g, "").replace(",", "."));
    setEtc((prev) => prev.map((x, j) => (j === i ? (Number.isFinite(v) ? Math.round(v) : 0) : x)));
    setApproved(false);
  };

  return (
    <div>
      <p className="text-[13px] leading-relaxed max-w-3xl" style={{ color: "var(--foreground)" }}>{t.intro}</p>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card stat">
          <div className="lbl">{t.kMargin}</div>
          <div className="val tnum" style={{ color: margin < 15 ? "var(--rejected)" : "var(--funded)" }}>
            {margin.toLocaleString(lang === "pl" ? "pl-PL" : "en-US", { maximumFractionDigits: 1 })}%
          </div>
        </div>
        <div className="card stat">
          <div className="lbl">{t.kEac}</div>
          <div className="val tnum" style={{ fontSize: "clamp(15px,1vw+10px,22px)" }}>{fmtK(totalEac, lang)}</div>
        </div>
        <div className="card stat">
          <div className="lbl">{t.kContract}</div>
          <div className="val tnum" style={{ fontSize: "clamp(15px,1vw+10px,22px)" }}>{fmtK(CONTRACT, lang)}</div>
        </div>
      </div>

      {/* tabela etapów + paski */}
      <div className="card mt-4">
        <div className="flex items-center justify-end" style={{ marginBottom: 10 }}>
          <PdfButton
            label={t.printBtn}
            build={() => ({
              filename: "klarow-kontroling-tydzien-demo.pdf",
              title: t.printTitle,
              metaLines: [
                `${t.kContract}: ${fmtK(CONTRACT, lang)}`,
                `${t.kEac}: ${fmtK(totalEac, lang)}`,
                `${t.kMargin}: ${margin.toLocaleString(lang === "pl" ? "pl-PL" : "en-US", { maximumFractionDigits: 1 })}%`,
              ],
              table: {
                head: [t.thStage, t.thBudget, t.thSpent, t.thEtc, t.thEac, t.thVar],
                widths: ["*", "auto", "auto", "auto", "auto", "auto"],
                alignRight: [1, 2, 3, 4, 5],
                body: rows.map((r) => [
                  r.name[lang],
                  fmtK(r.budget, lang),
                  fmtK(r.spent, lang),
                  fmtK(r.etc, lang),
                  fmtK(r.eac, lang),
                  `${r.variance > 0 ? "+" : ""}${fmtK(r.variance, lang)}`,
                ]),
                foot: [
                  "Σ",
                  fmtK(totalBudget, lang),
                  fmtK(totalSpent, lang),
                  fmtK(etc.reduce((s, v) => s + v, 0), lang),
                  fmtK(totalEac, lang),
                  `${totalEac - totalBudget > 0 ? "+" : ""}${fmtK(totalEac - totalBudget, lang)}`,
                ],
              },
            })}
          />
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>{t.thStage}</th>
                <th className="num">{t.thBudget}</th>
                <th className="num">{t.thSpent}</th>
                <th style={{ minWidth: 220 }}></th>
                <th className="num">{t.thEtc}</th>
                <th className="num">{t.thEac}</th>
                <th className="num">{t.thVar}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => {
                const spentPct = Math.min(100, (r.spent / r.budget) * 100);
                const overPct = Math.max(0, ((r.eac - r.budget) / r.budget) * 100);
                return (
                  <tr key={r.name.pl}>
                    <td><strong>{r.name[lang]}</strong></td>
                    <td className="num nowrap">{fmtK(r.budget, lang)}</td>
                    <td className="num nowrap">{fmtK(r.spent, lang)}</td>
                    <td>
                      <div className="bar" style={{ position: "relative" }}>
                        <i style={{ width: `${spentPct}%`, background: r.eac > r.budget ? "var(--rejected)" : undefined }} />
                      </div>
                      {overPct > 0 && (
                        <span className="text-[10px] tnum" style={{ color: "var(--rejected)" }}>
                          +{overPct.toFixed(0)}% {t.over}
                        </span>
                      )}
                    </td>
                    <td className="num" style={{ width: 130 }}>
                      <input
                        className="input"
                        inputMode="numeric"
                        value={String(r.etc)}
                        onChange={(e) => setOne(i, e.target.value)}
                        aria-label={`ETC ${r.name[lang]}`}
                        style={{
                          padding: "6px 9px",
                          fontSize: 12.5,
                          textAlign: "right",
                          fontVariantNumeric: "tabular-nums",
                          borderColor: r.etc < 0 ? "var(--rejected)" : undefined,
                        }}
                      />
                    </td>
                    <td className="num nowrap">{fmtK(r.eac, lang)}</td>
                    <td className="num nowrap" style={{ color: r.variance > 0 ? "var(--rejected)" : "var(--funded)" }}>
                      {r.variance > 0 ? "+" : ""}
                      {fmtK(r.variance, lang)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td><strong>Σ</strong></td>
                <td className="num nowrap"><strong>{fmtK(totalBudget, lang)}</strong></td>
                <td className="num nowrap"><strong>{fmtK(totalSpent, lang)}</strong></td>
                <td></td>
                <td className="num nowrap"><strong>{fmtK(etc.reduce((s, v) => s + v, 0), lang)}</strong></td>
                <td className="num nowrap"><strong>{fmtK(totalEac, lang)}</strong></td>
                <td className="num nowrap" style={{ color: totalEac - totalBudget > 0 ? "var(--rejected)" : "var(--funded)" }}>
                  <strong>{totalEac - totalBudget > 0 ? "+" : ""}{fmtK(totalEac - totalBudget, lang)}</strong>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* bramka zatwierdzenia */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {approved ? (
          <span className="st st-green"><Check className="st-ico" /> {t.approved}</span>
        ) : (
          <button className="btn btn-primary" type="button" disabled={hasNegative} onClick={() => setApproved(true)}>
            <Lock size={15} /> {t.approve}
          </button>
        )}
        {hasNegative && (
          <span className="text-[12px] flex items-center gap-1.5" style={{ color: "var(--rejected)" }}>
            <TriangleAlert size={14} /> {t.blocked}
          </span>
        )}
      </div>

      <p className="mt-3 text-[11.5px]" style={{ color: "var(--muted-foreground)" }}>{t.foot}</p>
    </div>
  );
}
