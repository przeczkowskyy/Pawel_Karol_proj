import { useMemo, useRef, useState } from "react";
import {
  Check,
  TriangleAlert,
  XCircle,
  ShieldCheck,
  ShieldX,
  Play,
  ClipboardPaste,
  FileUp,
  FileSpreadsheet,
} from "lucide-react";
import { auditRows, fmtDate, isoWeekMonday, type InvStatus, type Severity } from "@/lib/qualityGate";
import { useLang, pick } from "@/i18n";

/* Dashboard „Audyt jakości danych" — LIVE, read-only, dane fikcyjne.
   Bramka jakości: OK / UWAGA / BŁĄD per inwestycja + lista znalezisk.
   Odbrandowane odtworzenie (zasada #3). */

const YEAR = 2026;
const WEEK = 30;

/* fikcyjny plik z zasianymi błędami (żeby macierz pokazała OK/UWAGA/BŁĄD) */
const SAMPLE = `Inwestycja;Etap;Estymacja PM;W tym tygodniu;Saldo (E);Data
Hala Poznań;Prefabrykacja;180000;42000;0;22.07.2026
Hala Poznań;Montaż;240000;88000;0;23.07.2026
Moduły Gdańsk;Prefabrykacja;150000;-3500;0;21.07.2026
Moduły Gdańsk;Montaż;90000;12000;0;24.07.2026
Biurowiec Łódź;Prefabrykacja;-42000;60000;0;22.07.2026
Biurowiec Łódź;Montaż;120000;35000;1250;23.07.2026
Magazyn Wrocław;Fundamenty;60000;18000;0;20.07.2026
Magazyn Wrocław;Konstrukcja;80000;9000;0;15.07.2026
Centrum Toruń;Prefabrykacja;110000;27000;0;22.07.2026
Centrum Toruń;Montaż;95000;31000;0;24.07.2026
`;

const T = {
  pl: {
    loadExample: "Załaduj przykład",
    paste: "Wklej dane",
    upload: "Wgraj plik CSV",
    close: "Zamknij",
    compute: "Sprawdź",
    formatHint:
      "Format: Inwestycja; Etap; Estymacja PM; W tym tygodniu; Saldo (E); Data — separator „;”, przecinek lub tabulator. Tydzień raportu: 30 / 2026.",
    pastePh: "Inwestycja;Etap;Estymacja PM;W tym tygodniu;Saldo (E);Data\nHala A;Montaż;120000;35000;0;22.07.2026",
    emptyTitle: "Bramka jakości zbuduje się tutaj",
    emptyBody: "Załaduj przykład albo wklej własną tabelę — narzędzie tylko czyta, niczego nie nadpisuje.",
    srcExample: "dane przykładowe (fikcyjne)",
    srcPaste: "dane wklejone",
    verdictClean: "PORTFEL CZYSTY — można publikować",
    verdictDirty: "WYKRYTO BŁĘDY — nie publikuj przed poprawą",
    week: "Tydzień raportu",
    kInv: "Inwestycje",
    kErr: "Błędy",
    kWarn: "Ostrzeżenia",
    matrix: "Macierz pewności",
    findings: "Znaleziska",
    thInv: "Inwestycja",
    thStatus: "Status",
    thStage: "Etap",
    thCode: "Kod",
    thDesc: "Opis",
    thLevel: "Poziom",
    stOk: "OK",
    stWarn: "UWAGA",
    stErr: "BŁĄD",
    noFind: "Brak znalezisk — wszystkie reguły przeszły.",
    ruleTitle: "Reguły audytu (jawne — deterministyczne)",
    rules: [
      "Estymacja PM < 0 → BŁĄD (PM nie może estymować na minusie)",
      "„W tym tygodniu” < 0 → UWAGA (do weryfikacji)",
      "Saldo kontrolne (E) ≠ 0 → BŁĄD (rozjazd salda)",
      "Data wpisu poza tygodniem raportu → BŁĄD (zły stempel)",
    ],
    footFake: "Dane fikcyjne. Read-only — narzędzie nic nie zapisuje w Twoich plikach.",
    footLocal: "100% w przeglądarce, bez wysyłki danych. Te same dane zawsze dają ten sam werdykt.",
    errTitle: "Wejście — pominięte wiersze:",
    errLine: "wiersz",
  },
  en: {
    loadExample: "Load example",
    paste: "Paste data",
    upload: "Upload CSV",
    close: "Close",
    compute: "Check",
    formatHint:
      "Format: Investment; Stage; PM estimate; This week; Balance (E); Date — separator “;”, comma or tab. Report week: 30 / 2026.",
    pastePh: "Investment;Stage;PM estimate;This week;Balance (E);Date\nHall A;Assembly;120000;35000;0;2026-07-22",
    emptyTitle: "The quality gate builds itself here",
    emptyBody: "Load the example or paste your own table — the tool only reads, it never overwrites.",
    srcExample: "example data (fictional)",
    srcPaste: "pasted data",
    verdictClean: "PORTFOLIO CLEAN — ready to publish",
    verdictDirty: "ERRORS FOUND — do not publish before fixing",
    week: "Report week",
    kInv: "Investments",
    kErr: "Errors",
    kWarn: "Warnings",
    matrix: "Confidence matrix",
    findings: "Findings",
    thInv: "Investment",
    thStatus: "Status",
    thStage: "Stage",
    thCode: "Code",
    thDesc: "Description",
    thLevel: "Level",
    stOk: "OK",
    stWarn: "WATCH",
    stErr: "ERROR",
    noFind: "No findings — all rules passed.",
    ruleTitle: "Audit rules (explicit — deterministic)",
    rules: [
      "PM estimate < 0 → ERROR (PM can't estimate negative)",
      "“This week” < 0 → WATCH (to verify)",
      "Control balance (E) ≠ 0 → ERROR (balance mismatch)",
      "Entry date outside the report week → ERROR (bad stamp)",
    ],
    footFake: "Fictional data. Read-only — the tool writes nothing to your files.",
    footLocal: "100% in the browser, no data upload. The same data always gives the same verdict.",
    errTitle: "Input — skipped rows:",
    errLine: "line",
  },
};

function invChip(status: InvStatus, t: (typeof T)["pl"]) {
  if (status === "ok")
    return (
      <span className="st st-green">
        <Check className="st-ico" /> {t.stOk}
      </span>
    );
  if (status === "warn")
    return (
      <span className="st st-accent">
        <TriangleAlert className="st-ico" /> {t.stWarn}
      </span>
    );
  return (
    <span className="st st-brick">
      <XCircle className="st-ico" /> {t.stErr}
    </span>
  );
}

function sevChip(sev: Severity, t: (typeof T)["pl"]) {
  return sev === "error" ? (
    <span className="st st-brick">
      <XCircle className="st-ico" /> {t.stErr}
    </span>
  ) : (
    <span className="st st-accent">
      <TriangleAlert className="st-ico" /> {t.stWarn}
    </span>
  );
}

export default function QualityGate() {
  const { lang } = useLang();
  const t = pick(lang, T);
  const [csv, setCsv] = useState<string | null>(null);
  const [src, setSrc] = useState("");
  const [pasteOpen, setPasteOpen] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const result = useMemo(() => (csv === null ? null : auditRows(csv, YEAR, WEEK)), [csv]);

  const loadExample = () => {
    setCsv(SAMPLE);
    setSrc(t.srcExample);
    setPasteOpen(false);
  };
  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const rd = new FileReader();
    rd.onload = () => {
      setCsv(String(rd.result ?? ""));
      setSrc(f.name);
      setPasteOpen(false);
    };
    rd.readAsText(f);
    e.target.value = "";
  };
  const computePaste = () => {
    if (pasteText.trim() === "") return;
    setCsv(pasteText);
    setSrc(t.srcPaste);
  };

  const monday = isoWeekMonday(YEAR, WEEK);
  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);

  return (
    <div>
      {/* wejście */}
      <div className="card" style={{ padding: 18 }}>
        <div className="flex flex-wrap items-center gap-2.5">
          <button className="btn btn-secondary btn-sm" type="button" onClick={loadExample}>
            <Play size={14} /> {t.loadExample}
          </button>
          <button className="btn btn-secondary btn-sm" type="button" aria-expanded={pasteOpen} onClick={() => setPasteOpen((v) => !v)}>
            <ClipboardPaste size={14} /> {t.paste}
          </button>
          <button className="btn btn-secondary btn-sm" type="button" onClick={() => fileRef.current?.click()}>
            <FileUp size={14} /> {t.upload}
          </button>
          <input ref={fileRef} type="file" accept=".csv,.txt,text/csv,text/plain" hidden onChange={onFile} />
          <span className="chip">
            {t.week}: T{WEEK} / {YEAR} · {fmtDate(monday)}–{fmtDate(sunday)}
          </span>
          {src !== "" && <span className="chip">{src}</span>}
        </div>
        <p className="mt-3 text-[11.5px]" style={{ color: "var(--muted-foreground)" }}>{t.formatHint}</p>
        {pasteOpen && (
          <div className="mt-3">
            <textarea
              className="textarea"
              rows={7}
              spellCheck={false}
              placeholder={t.pastePh}
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              style={{ fontVariantNumeric: "tabular-nums" }}
            />
            <div className="mt-2.5 flex gap-2">
              <button className="btn btn-secondary btn-sm" type="button" onClick={computePaste}>{t.compute}</button>
              <button className="btn btn-ghost btn-sm" type="button" onClick={() => setPasteOpen(false)}>{t.close}</button>
            </div>
          </div>
        )}
      </div>

      {result === null && (
        <div className="empty mt-4">
          <FileSpreadsheet className="e-ico" />
          <div className="e-title">{t.emptyTitle}</div>
          <p>{t.emptyBody}</p>
          <button className="btn btn-primary" type="button" onClick={loadExample}>
            <Play size={15} /> {t.loadExample}
          </button>
        </div>
      )}

      {result && result.parseIssues.length > 0 && (
        <div className="err mt-4" role="alert">
          <strong>{t.errTitle}</strong>
          <ul className="mt-1.5 flex flex-col gap-0.5 text-[12.5px]">
            {result.parseIssues.slice(0, 6).map((e, i) => (
              <li key={i}>{t.errLine} {e.line}: {pick(lang, e.msg)}</li>
            ))}
          </ul>
        </div>
      )}

      {result && result.rows.length > 0 && (
        <div className="nc-tab-swap" key={`${result.totals.rows}-${result.totals.errors}-${result.totals.warns}`}>
          {/* werdykt */}
          <div
            className="card mt-4 flex items-center gap-3"
            style={{
              padding: 18,
              borderColor: result.totals.clean ? "var(--funded-border)" : "var(--rejected-border)",
              background: result.totals.clean ? "var(--funded-bg)" : "var(--rejected-bg)",
            }}
          >
            {result.totals.clean ? (
              <ShieldCheck size={22} style={{ color: "var(--funded)", flex: "0 0 auto" }} />
            ) : (
              <ShieldX size={22} style={{ color: "var(--rejected)", flex: "0 0 auto" }} />
            )}
            <strong style={{ color: result.totals.clean ? "var(--funded)" : "var(--rejected)", fontSize: 15 }}>
              {result.totals.clean ? t.verdictClean : t.verdictDirty}
            </strong>
          </div>

          {/* KPI */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="card stat">
              <div className="lbl">{t.kInv}</div>
              <div className="val tnum">{result.totals.investments}</div>
            </div>
            <div className="card stat">
              <div className="lbl">{t.kErr}</div>
              <div className="val tnum" style={result.totals.errors > 0 ? { color: "var(--rejected)" } : undefined}>
                {result.totals.errors}
              </div>
            </div>
            <div className="card stat">
              <div className="lbl">{t.kWarn}</div>
              <div className="val tnum" style={result.totals.warns > 0 ? { color: "var(--warning)" } : undefined}>
                {result.totals.warns}
              </div>
            </div>
          </div>

          {/* macierz pewności */}
          <div className="card mt-4">
            <h3 style={{ fontSize: 14, marginBottom: 12 }}>{t.matrix}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {result.matrix.map((inv) => (
                <div
                  key={inv.investment}
                  className="flex items-center justify-between gap-2 rounded-[10px] px-3 py-2.5"
                  style={{
                    border: "1px solid",
                    borderColor:
                      inv.status === "ok" ? "var(--funded-border)" : inv.status === "warn" ? "rgba(168,180,194,.35)" : "var(--rejected-border)",
                    background:
                      inv.status === "ok" ? "var(--funded-bg)" : inv.status === "warn" ? "rgba(168,180,194,.10)" : "var(--rejected-bg)",
                  }}
                >
                  <span className="text-[13px] font-bold truncate" style={{ color: "var(--heading)" }}>{inv.investment}</span>
                  {invChip(inv.status, t)}
                </div>
              ))}
            </div>
          </div>

          {/* znaleziska */}
          <div className="card mt-4">
            <h3 style={{ fontSize: 14, marginBottom: 12 }}>{t.findings}</h3>
            {result.findings.length === 0 ? (
              <p className="text-[13px]" style={{ color: "var(--funded)" }}>
                <Check size={14} style={{ verticalAlign: "-2px", marginRight: 5 }} />
                {t.noFind}
              </p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>{t.thInv}</th>
                      <th>{t.thStage}</th>
                      <th>{t.thCode}</th>
                      <th>{t.thDesc}</th>
                      <th>{t.thLevel}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.findings.map((f, i) => (
                      <tr key={i}>
                        <td><strong>{f.investment}</strong></td>
                        <td>{f.cell}</td>
                        <td className="tnum" style={{ color: "var(--muted-foreground)" }}>{f.code}</td>
                        <td className="text-[12.5px]">{pick(lang, f.msg)}</td>
                        <td>{sevChip(f.severity, t)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* reguły */}
          <div className="card mt-4" style={{ padding: 18 }}>
            <div className="lbl-sm" style={{ marginBottom: 8 }}>{t.ruleTitle}</div>
            <ul className="flex flex-col gap-1.5 text-[12.5px]" style={{ color: "var(--foreground)" }}>
              {t.rules.map((r) => (
                <li key={r} className="flex items-start gap-2">
                  <span style={{ color: "var(--primary)" }}>·</span> {r}
                </li>
              ))}
            </ul>
          </div>

          <div className="legend">
            <span>{t.footFake}</span>
            <span>{t.footLocal}</span>
          </div>
        </div>
      )}
    </div>
  );
}
