import { useMemo, useState } from "react";
import { Check, XCircle, Plus, Minus, ArrowRightLeft, Play, ShieldCheck } from "lucide-react";
import { useLang } from "@/i18n";

/* Dashboard „Import z rekoncyliacją" — LIVE, dane fikcyjne, deterministyczny.
   Odbrandowane odtworzenie rdzenia „Controlling Import": porównanie dwóch
   wersji danych (poprzednia vs nowa), diff per pozycja (DODANE / USUNIĘTE /
   ZMIENIONE) i rekoncyliacja sum CO DO GROSZA:
     Σ poprzednia + dodane − usunięte + zmiany == Σ nowa  →  PASS / FAIL.
   Wszystko w groszach (int) — zero dryfu. Tryb TEST: nic nie jest zapisywane. */

interface Row {
  project: string;
  category: string;
  amount: number; // zł
}

const PREV: Row[] = [
  { project: "Hala Poznań", category: "Robocizna", amount: 182400 },
  { project: "Hala Poznań", category: "Materiał", amount: 96100.5 },
  { project: "Moduły Gdańsk", category: "Robocizna", amount: 143250 },
  { project: "Moduły Gdańsk", category: "Materiał", amount: 88700.25 },
  { project: "Biurowiec Łódź", category: "Robocizna", amount: 121000 },
  { project: "Biurowiec Łódź", category: "Transport", amount: 8400 },
  { project: "Centrum Toruń", category: "Robocizna", amount: 76300 },
];

const CURR: Row[] = [
  { project: "Hala Poznań", category: "Robocizna", amount: 191800 }, // zmiana +9400
  { project: "Hala Poznań", category: "Materiał", amount: 96100.5 }, // bez zmian
  { project: "Moduły Gdańsk", category: "Robocizna", amount: 143250 }, // bez zmian
  { project: "Moduły Gdańsk", category: "Materiał", amount: 91250.75 }, // zmiana +2550.50
  { project: "Biurowiec Łódź", category: "Robocizna", amount: 121000 }, // bez zmian
  // Transport Łódź USUNIĘTY (−8400)
  { project: "Centrum Toruń", category: "Robocizna", amount: 76300 }, // bez zmian
  { project: "Centrum Toruń", category: "Diety", amount: 5200 }, // DODANE
];

type DiffKind = "added" | "removed" | "changed" | "same";

interface DiffRow {
  key: string;
  project: string;
  category: string;
  prevGr: number | null;
  currGr: number | null;
  deltaGr: number;
  kind: DiffKind;
}

const gr = (v: number) => Math.round(v * 100);

function computeDiff(prev: Row[], curr: Row[]): DiffRow[] {
  const key = (r: Row) => `${r.project}|${r.category}`;
  const prevMap = new Map(prev.map((r) => [key(r), r]));
  const currMap = new Map(curr.map((r) => [key(r), r]));
  const keys: string[] = [];
  for (const r of prev) if (!keys.includes(key(r))) keys.push(key(r));
  for (const r of curr) if (!keys.includes(key(r))) keys.push(key(r));

  return keys.map((k) => {
    const p = prevMap.get(k) ?? null;
    const c = currMap.get(k) ?? null;
    const prevGr = p ? gr(p.amount) : null;
    const currGr = c ? gr(c.amount) : null;
    const deltaGr = (currGr ?? 0) - (prevGr ?? 0);
    const kind: DiffKind = p === null ? "added" : c === null ? "removed" : deltaGr !== 0 ? "changed" : "same";
    const src = (c ?? p)!;
    return { key: k, project: src.project, category: src.category, prevGr, currGr, deltaGr, kind };
  });
}

const fmt = (grv: number | null, lang: "pl" | "en") => {
  if (grv === null) return "—";
  const v = grv / 100;
  return lang === "pl"
    ? `${v.toLocaleString("pl-PL", { minimumFractionDigits: 2 })} zł`
    : `PLN ${v.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
};

const T = {
  pl: {
    run: "Uruchom import (TEST)",
    intro: "Porównujemy dwie wersje danych kosztowych: poprzednią (zatwierdzoną) i nowy plik z ERP. Zanim cokolwiek zostanie zatwierdzone — pełny diff i rekoncyliacja sum.",
    pass: "REKONCYLIACJA: PASS — sumy zgadzają się co do grosza",
    fail: "REKONCYLIACJA: FAIL — rozjazd sum",
    formula: "Σ poprzednia + dodane − usunięte + zmiany = Σ nowa",
    kPrev: "Σ poprzednia wersja",
    kCurr: "Σ nowa wersja",
    kDelta: "Zmiana netto",
    added: "dodane",
    removed: "usunięte",
    changed: "zmienione",
    same: "bez zmian",
    thProject: "Projekt",
    thCat: "Kategoria",
    thPrev: "Poprzednio",
    thCurr: "Teraz",
    thDelta: "Δ",
    thKind: "Zmiana",
    proof: "Dowód co do grosza",
    testNote: "Tryb TEST — podgląd zmian. W realnym wdrożeniu zapis następuje dopiero po Twojej akceptacji, z backupem i logiem.",
    foot: "Dane fikcyjne · liczone w groszach (zero dryfu) · te same dane zawsze dają ten sam wynik.",
  },
  en: {
    run: "Run import (TEST)",
    intro: "We compare two versions of cost data: the previous (approved) one and a new ERP file. Before anything is committed — a full diff and totals reconciliation.",
    pass: "RECONCILIATION: PASS — totals reconcile to the cent",
    fail: "RECONCILIATION: FAIL — totals mismatch",
    formula: "Σ previous + added − removed + changes = Σ new",
    kPrev: "Σ previous version",
    kCurr: "Σ new version",
    kDelta: "Net change",
    added: "added",
    removed: "removed",
    changed: "changed",
    same: "unchanged",
    thProject: "Project",
    thCat: "Category",
    thPrev: "Previous",
    thCurr: "Now",
    thDelta: "Δ",
    thKind: "Change",
    proof: "Proof to the cent",
    testNote: "TEST mode — a change preview. In a real deployment the write happens only after your approval, with backup and log.",
    foot: "Fictional data · computed in cents (zero drift) · the same data always gives the same result.",
  },
};

function kindChip(kind: DiffKind, t: (typeof T)["pl"]) {
  if (kind === "added")
    return (
      <span className="st st-green">
        <Plus className="st-ico" /> {t.added}
      </span>
    );
  if (kind === "removed")
    return (
      <span className="st st-brick">
        <Minus className="st-ico" /> {t.removed}
      </span>
    );
  if (kind === "changed")
    return (
      <span className="st st-accent">
        <ArrowRightLeft className="st-ico" /> {t.changed}
      </span>
    );
  return (
    <span className="st st-gray">
      <Check className="st-ico" /> {t.same}
    </span>
  );
}

export default function ImportReconciliation() {
  const { lang } = useLang();
  const t = T[lang];
  const [ran, setRan] = useState(false);

  const diff = useMemo(() => computeDiff(PREV, CURR), []);
  const sumPrev = PREV.reduce((s, r) => s + gr(r.amount), 0);
  const sumCurr = CURR.reduce((s, r) => s + gr(r.amount), 0);
  const addedGr = diff.filter((d) => d.kind === "added").reduce((s, d) => s + (d.currGr ?? 0), 0);
  const removedGr = diff.filter((d) => d.kind === "removed").reduce((s, d) => s + (d.prevGr ?? 0), 0);
  const changedGr = diff.filter((d) => d.kind === "changed").reduce((s, d) => s + d.deltaGr, 0);
  const reconciled = sumPrev + addedGr - removedGr + changedGr === sumCurr;
  const counts = {
    added: diff.filter((d) => d.kind === "added").length,
    removed: diff.filter((d) => d.kind === "removed").length,
    changed: diff.filter((d) => d.kind === "changed").length,
    same: diff.filter((d) => d.kind === "same").length,
  };

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
      {/* werdykt */}
      <div
        className="card flex items-center gap-3"
        style={{
          padding: 18,
          borderColor: reconciled ? "var(--funded-border)" : "var(--rejected-border)",
          background: reconciled ? "var(--funded-bg)" : "var(--rejected-bg)",
        }}
      >
        {reconciled ? (
          <ShieldCheck size={22} style={{ color: "var(--funded)", flex: "0 0 auto" }} />
        ) : (
          <XCircle size={22} style={{ color: "var(--rejected)", flex: "0 0 auto" }} />
        )}
        <div>
          <strong style={{ color: reconciled ? "var(--funded)" : "var(--rejected)", fontSize: 15 }}>
            {reconciled ? t.pass : t.fail}
          </strong>
          <div className="text-[12px] tnum" style={{ color: "var(--muted-foreground)", marginTop: 2 }}>{t.formula}</div>
        </div>
      </div>

      {/* KPI */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card stat">
          <div className="lbl">{t.kPrev}</div>
          <div className="val tnum" style={{ fontSize: "clamp(15px,1vw+10px,21px)" }}>{fmt(sumPrev, lang)}</div>
        </div>
        <div className="card stat">
          <div className="lbl">{t.kCurr}</div>
          <div className="val tnum" style={{ fontSize: "clamp(15px,1vw+10px,21px)" }}>{fmt(sumCurr, lang)}</div>
        </div>
        <div className="card stat">
          <div className="lbl">{t.kDelta}</div>
          <div
            className="val tnum"
            style={{ fontSize: "clamp(15px,1vw+10px,21px)", color: sumCurr - sumPrev > 0 ? "var(--rejected)" : "var(--funded)" }}
          >
            {sumCurr - sumPrev > 0 ? "+" : ""}
            {fmt(sumCurr - sumPrev, lang)}
          </div>
        </div>
      </div>

      {/* liczniki zmian */}
      <div className="mt-4 flex flex-wrap gap-2.5">
        <span className="st st-green tnum"><Plus className="st-ico" /> {counts.added} {t.added}</span>
        <span className="st st-brick tnum"><Minus className="st-ico" /> {counts.removed} {t.removed}</span>
        <span className="st st-accent tnum"><ArrowRightLeft className="st-ico" /> {counts.changed} {t.changed}</span>
        <span className="st st-gray tnum"><Check className="st-ico" /> {counts.same} {t.same}</span>
      </div>

      {/* diff */}
      <div className="card mt-4">
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>{t.thProject}</th>
                <th>{t.thCat}</th>
                <th className="num">{t.thPrev}</th>
                <th className="num">{t.thCurr}</th>
                <th className="num">{t.thDelta}</th>
                <th>{t.thKind}</th>
              </tr>
            </thead>
            <tbody>
              {diff.map((d) => (
                <tr key={d.key}>
                  <td><strong>{d.project}</strong></td>
                  <td>{d.category}</td>
                  <td className="num nowrap" style={{ color: "var(--muted-foreground)" }}>{fmt(d.prevGr, lang)}</td>
                  <td className="num nowrap">{fmt(d.currGr, lang)}</td>
                  <td
                    className="num nowrap"
                    style={{
                      color: d.deltaGr === 0 ? "var(--muted-foreground)" : d.deltaGr > 0 ? "var(--rejected)" : "var(--funded)",
                    }}
                  >
                    {d.deltaGr > 0 ? "+" : ""}
                    {fmt(d.deltaGr, lang)}
                  </td>
                  <td>{kindChip(d.kind, t)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2}><strong>Σ</strong></td>
                <td className="num nowrap"><strong>{fmt(sumPrev, lang)}</strong></td>
                <td className="num nowrap"><strong>{fmt(sumCurr, lang)}</strong></td>
                <td className="num nowrap"><strong>{sumCurr - sumPrev > 0 ? "+" : ""}{fmt(sumCurr - sumPrev, lang)}</strong></td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* dowód co do grosza */}
      <div className="card mt-4" style={{ padding: 18 }}>
        <div className="lbl-sm" style={{ marginBottom: 8 }}>{t.proof}</div>
        <p className="text-[12.5px] tnum" style={{ color: "var(--foreground)" }}>
          {fmt(sumPrev, lang)} + {fmt(addedGr, lang)} − {fmt(removedGr, lang)} + ({changedGr > 0 ? "+" : ""}
          {fmt(changedGr, lang)}) = {fmt(sumPrev + addedGr - removedGr + changedGr, lang)} = {fmt(sumCurr, lang)}
        </p>
        <p className="mt-3 text-[12px]" style={{ color: "var(--muted-foreground)" }}>{t.testNote}</p>
      </div>

      <p className="mt-3 text-[11.5px]" style={{ color: "var(--muted-foreground)" }}>{t.foot}</p>
    </div>
  );
}
