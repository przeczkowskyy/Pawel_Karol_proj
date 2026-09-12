#!/usr/bin/env node
/**
 * hook-post-edit.mjs — hook Claude Code PostToolUse (Edit|Write|MultiEdit).
 *
 * Czyta JSON ze stdin ({tool_name, tool_input:{file_path}}). Jeśli edytowany plik leży pod
 * site/src (albo to site/index.html / site/public/_headers / _redirects), uruchamia
 * audit-static.mjs na TYM pliku Z NAJNOWSZYM baseline'em z ../baseline/ i zwraca ≤ 30 linii
 * findings jako additionalContext dla modelu. Baseline jest konieczny: bez niego hook po
 * KAŻDYM zapisie wstrzykiwał cały dług pliku (np. 79 HIGH w App.tsx) zamiast długu
 * WPROWADZONEGO tą edycją — model uczy się wtedy ignorować wyjście hooka. Gdy katalogu
 * baseline nie ma albo jest pusty, uruchamiamy bez --baseline (fallback).
 * Zawsze exit 0 (hook informacyjny, nie blokujący). Bez findings — cisza.
 *
 * Rejestracja: patrz ../hooks.settings.example.json (komenda przez node ze ścieżką
 * `$CLAUDE_PROJECT_DIR/...` w cudzysłowach — ścieżka repo ma „&” i spację, a stała ścieżka
 * z jednego komputera nie zadziałałaby u drugiego foundera).
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..", "..", "..");
const MAX_LINES = 30;

let input = "";
try {
  input = fs.readFileSync(0, "utf8");
} catch {
  process.exit(0);
}
let payload;
try {
  payload = JSON.parse(input || "{}");
} catch {
  process.exit(0);
}
const fp = payload?.tool_input?.file_path || payload?.tool_input?.path || "";
if (!fp) process.exit(0);

const abs = path.isAbsolute(fp) ? fp : path.resolve(REPO_ROOT, fp);
const relPosix = path.relative(REPO_ROOT, abs).split(path.sep).join("/");
const inScope =
  relPosix.startsWith("site/src/") ||
  relPosix === "site/index.html" ||
  relPosix === "site/public/_headers" ||
  relPosix === "site/public/_redirects";
if (!inScope || !fs.existsSync(abs)) process.exit(0);

/** Najnowszy plik długu z ../baseline/ (sortowanie po nazwie — nazwy mają datę ISO). */
function newestBaseline() {
  const dir = path.resolve(__dirname, "..", "baseline");
  try {
    const files = fs
      .readdirSync(dir)
      .filter((f) => /^audit-static-.*\.jsonl$/.test(f))
      .sort();
    return files.length ? path.join(dir, files[files.length - 1]) : null;
  } catch {
    return null;
  }
}

const baseline = newestBaseline();
const res = spawnSync(process.execPath, [path.join(__dirname, "audit-static.mjs"), abs, "--no-pass", ...(baseline ? ["--baseline", baseline] : [])], {
  cwd: REPO_ROOT,
  encoding: "utf8",
  timeout: 20000,
});
const lines = (res.stdout || "").split(/\r?\n/).filter((l) => l.trim());
const total = lines.find((l) => l.startsWith("Σ")) || "";
if (!lines.length || /Σ BLOCKER 0 · HIGH 0 · MEDIUM 0 · LOW 0/.test(total)) process.exit(0);

const body = lines.filter((l) => !l.startsWith("Σ")).slice(0, MAX_LINES - 2);
const truncated = lines.length - 1 > body.length ? `… (${lines.length - 1 - body.length} więcej — uruchom audit-static.mjs na pliku)` : null;
const text = ["[klarow-guardian] audit-static po edycji " + relPosix + (baseline ? " (tylko NOWE wobec baseline " + path.basename(baseline) + ")" : " (bez baseline — pełny dług pliku)") + ":", ...body, ...(truncated ? [truncated] : []), total].join("\n");

process.stdout.write(
  JSON.stringify({
    hookSpecificOutput: { hookEventName: "PostToolUse", additionalContext: text },
  })
);
process.exit(0);
