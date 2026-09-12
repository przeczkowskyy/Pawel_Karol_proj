#!/usr/bin/env node
/**
 * build-index.mjs: kompiluje reguły strażnika.
 *
 *   node .claude/skills/klarow-guardian/scripts/build-index.mjs [--check] [--quiet]
 *
 * 1. Czyta rules/*.md (pliki z prefiksem `_` pomija), parsuje frontmatter YAML (płaski) i sekcje.
 * 2. Waliduje format: nazwa pliku `<prefiks>-<slug>.md`, `id` == nazwa pliku, prefiks z rules/_sections.md,
 *    `title`, `impact` ∈ {BLOCKER, HIGH, MEDIUM, LOW}, `tags` (lista), `source`, `added` (YYYY-MM-DD),
 *    sekcje `## Zasada`, `## Mechanizm awarii`, `## Niepoprawnie`, `## Poprawnie`, `## Test` (każda dokładnie raz).
 * 3. Generuje AGENTS.md (pełny kompilat: spis sekcji + PEŁNA tabela reguł + każda reguła)
 *    posortowany prefiks (kolejność z _sections.md) → impact (BLOCKER > HIGH > MEDIUM > LOW) → id.
 * 4. Podmienia tabelę między `<!-- RULES:START -->` i `<!-- RULES:END -->` w SKILL.md.
 *    UWAGA: w SKILL.md jest tylko tabela SEKCJI (1 wiersz = 1 sekcja: prefiks · tytuł · liczba reguł ·
 *    dominujący impact · lista ID w jednej linii · plik), żeby SKILL.md został ≤ 150 linii przy dowolnej
 *    liczbie reguł. Pełna tabela reguł (ID · impact · tytuł · plik) żyje WYŁĄCZNIE w AGENTS.md.
 *
 * 5. Ostrzega, gdy `scripts/*.mjs` używa ID reguły bez pliku w `rules/` (findings muszą wskazywać
 *    na istniejącą regułę) — wykrywa ID w cudzysłowach ORAZ w zdaniach/komentarzach/template-stringach
 *    (te drugie od 2 segmentów po prefiksie, żeby nie łapać atrybutów HTML w rodzaju `seo-jsonld`).
 *    Ostrzega też, gdy sekcja z `_sections.md` nie ma ani jednej reguły (znikałaby z AGENTS.md po cichu).
 *    Ostrzeżenie, nie błąd: reguły dopisują równolegle inne agenty.
 *
 * Exit 1 przy błędzie formatu. `--check` = waliduj i sprawdź, czy AGENTS.md i tabela w SKILL.md są aktualne
 * (nic nie zapisuje; exit 1, gdy nieaktualne). Zero zależności, zero npx. Działa na dowolnym podzbiorze
 * prefiksów (inne agenty dopisują swoje pliki równolegle).
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const SKILL_DIR = dirname(dirname(fileURLToPath(import.meta.url)));
const RULES_DIR = join(SKILL_DIR, "rules");
const SKILL_MD = join(SKILL_DIR, "SKILL.md");
const AGENTS_MD = join(SKILL_DIR, "AGENTS.md");
const SECTIONS_MD = join(RULES_DIR, "_sections.md");
const SCRIPTS_DIR = join(SKILL_DIR, "scripts");

const IMPACTS = ["BLOCKER", "HIGH", "MEDIUM", "LOW"];
const REQUIRED_SECTIONS = [
  ["## Zasada", /^##\s+Zasada\b/],
  ["## Mechanizm awarii (dlaczego)", /^##\s+Mechanizm awarii\b/],
  ["## Niepoprawnie", /^##\s+Niepoprawnie\b/],
  ["## Poprawnie", /^##\s+Poprawnie\b/],
  ["## Test", /^##\s+Test\b/],
];
const OPTIONAL_SECTIONS = [["## Wyjątki", /^##\s+Wyjątki\b/]];
const START = "<!-- RULES:START -->";
const END = "<!-- RULES:END -->";
const FILE_RE = /^[a-z0-9]+(?:-[a-z0-9]+)+\.md$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const args = new Set(process.argv.slice(2));
const CHECK = args.has("--check");
const QUIET = args.has("--quiet");
const log = (...m) => { if (!QUIET) console.log(...m); };
const rel = (p) => relative(process.cwd(), p).split("\\").join("/");

function readText(path) {
  return readFileSync(path, "utf8").replace(/\r\n?/g, "\n");
}

/* ---------- _sections.md ---------- */
function parseSections(text) {
  const sections = [];
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line.startsWith("|")) continue;
    const cells = line.split("|").slice(1, -1).map((c) => c.trim());
    if (cells.length < 5) continue;
    const prefix = cells[0].replace(/`/g, "").trim();
    if (!/^[a-z0-9]+$/.test(prefix)) continue; // nagłówek / separator
    sections.push({ prefix, title: cells[1], impact: cells[2], mode: cells[3], owner: cells[4] });
  }
  return sections;
}

/* ---------- frontmatter ---------- */
function parseFrontmatter(text, file, errors) {
  const lines = text.split("\n");
  if (lines[0] !== "---") {
    errors.push(`${file}: brak frontmatteru (pierwsza linia musi być '---')`);
    return { meta: {}, body: text };
  }
  const end = lines.indexOf("---", 1);
  if (end === -1) {
    errors.push(`${file}: frontmatter bez zamykającego '---'`);
    return { meta: {}, body: text };
  }
  const meta = {};
  let listKey = null;
  for (const raw of lines.slice(1, end)) {
    if (!raw.trim()) continue;
    const item = raw.match(/^\s+-\s+(.*)$/);
    if (item && listKey) { meta[listKey].push(stripQuotes(item[1])); continue; }
    const kv = raw.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (!kv) { errors.push(`${file}: niezrozumiała linia frontmatteru: '${raw}'`); continue; }
    const [, key, valueRaw] = kv;
    const value = valueRaw.trim();
    if (value === "") { meta[key] = []; listKey = key; continue; }
    listKey = null;
    if (value.startsWith("[") && value.endsWith("]")) {
      meta[key] = value.slice(1, -1).split(",").map((s) => stripQuotes(s.trim())).filter(Boolean);
    } else {
      meta[key] = stripQuotes(value);
    }
  }
  return { meta, body: lines.slice(end + 1).join("\n").replace(/^\n+/, "").replace(/\n+$/, "") + "\n" };
}
function stripQuotes(s) {
  return (s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'")) ? s.slice(1, -1) : s;
}

/* ---------- walidacja ---------- */
/** Linie treści poza blokami ``` (przykłady kodu bywają markdownem z własnymi `##`). */
function linesOutsideFences(body) {
  const out = [];
  let inFence = false;
  let fence = "";
  for (const l of body.split("\n")) {
    const m = l.match(/^\s*(`{3,}|~{3,})/);
    if (m) {
      if (!inFence) { inFence = true; fence = m[1][0]; }
      else if (m[1][0] === fence) { inFence = false; fence = ""; }
      continue;
    }
    if (!inFence) out.push(l);
  }
  return out;
}

function validateRule(file, meta, body, sectionPrefixes, errors, warnings) {
  const name = basename(file);
  const id = name.replace(/\.md$/, "");
  if (!FILE_RE.test(name)) errors.push(`${name}: nazwa pliku musi mieć postać <prefiks>-<slug>.md (małe litery, cyfry, myślniki)`);
  const prefix = id.split("-")[0];
  if (!sectionPrefixes.has(prefix)) errors.push(`${name}: prefiks '${prefix}' nie jest zdefiniowany w rules/_sections.md`);
  if (meta.id !== id) errors.push(`${name}: id '${meta.id ?? "(brak)"}' musi być równe nazwie pliku '${id}'`);
  if (!meta.title || typeof meta.title !== "string") errors.push(`${name}: brak 'title'`);
  if (!IMPACTS.includes(meta.impact)) errors.push(`${name}: impact '${meta.impact ?? "(brak)"}' spoza {${IMPACTS.join(", ")}}`);
  if (!Array.isArray(meta.tags) || meta.tags.length === 0) errors.push(`${name}: 'tags' musi być niepustą listą [a, b]`);
  if (!meta.source || typeof meta.source !== "string") errors.push(`${name}: brak 'source'`);
  if (!meta.added || !DATE_RE.test(String(meta.added))) errors.push(`${name}: 'added' musi mieć format YYYY-MM-DD`);
  const bodyLines = linesOutsideFences(body);
  for (const [label, re] of REQUIRED_SECTIONS) {
    const n = bodyLines.filter((l) => re.test(l)).length;
    if (n === 0) errors.push(`${name}: brak sekcji '${label}'`);
    else if (n > 1) errors.push(`${name}: sekcja '${label}' występuje ${n} razy`);
  }
  for (const [label, re] of OPTIONAL_SECTIONS) {
    const n = bodyLines.filter((l) => re.test(l)).length;
    if (n > 1) errors.push(`${name}: sekcja '${label}' występuje ${n} razy`);
  }
  // Dodatkowe sekcje `##` poza standardem są dozwolone: tylko ostrzeżenie, nie błąd.
  // (Dzienniki przeglądów assetów mieszkają w references/asset-review-log.md, nie w regule.)
  const known = [...REQUIRED_SECTIONS, ...OPTIONAL_SECTIONS].map(([, re]) => re);
  for (const l of bodyLines) {
    if (/^##\s+/.test(l) && !known.some((re) => re.test(l))) warnings.push(`${name}: dodatkowa sekcja '${l.trim()}' (standard: Zasada, Mechanizm awarii, Niepoprawnie, Poprawnie, Test, Wyjątki)`);
  }
}

/* ---------- ładowanie ---------- */
function loadRules(sections, errors, warnings) {
  const sectionPrefixes = new Set(sections.map((s) => s.prefix));
  const files = readdirSync(RULES_DIR)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .sort();
  const rules = [];
  for (const f of files) {
    const path = join(RULES_DIR, f);
    const { meta, body } = parseFrontmatter(readText(path), f, errors);
    validateRule(f, meta, body, sectionPrefixes, errors, warnings);
    rules.push({ file: f, id: f.replace(/\.md$/, ""), prefix: f.split("-")[0], meta, body });
  }
  const order = new Map(sections.map((s, i) => [s.prefix, i]));
  rules.sort((a, b) => {
    const pa = order.has(a.prefix) ? order.get(a.prefix) : 999;
    const pb = order.has(b.prefix) ? order.get(b.prefix) : 999;
    if (pa !== pb) return pa - pb;
    const ia = IMPACTS.indexOf(a.meta.impact), ib = IMPACTS.indexOf(b.meta.impact);
    if (ia !== ib) return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    return a.id.localeCompare(b.id, "en");
  });
  return rules;
}

/* ---------- spójność ID w skryptach ---------- */
/** Prefiksy bierzemy z `rules/_sections.md` (jedno źródło), żeby lista nie rozjeżdżała się z tabelą sekcji. */
function idRegexes(sections) {
  const prefixes = sections.map((s) => s.prefix).filter(Boolean);
  if (prefixes.length === 0) return [];
  const alt = "(?:" + prefixes.join("|") + ")";
  return [
    // 1. ID w cudzysłowie: dowolna liczba segmentów ("a11y-lang", "brand-no-gold")
    new RegExp('"(' + alt + '-[a-z0-9-]+)"', "g"),
    // 2. ID w zdaniu / komentarzu / template-stringu (bez cudzysłowów): wymagamy ≥ 2 segmentów po prefiksie,
    //    bo krótsze ciągi to zwykle atrybuty i klasy HTML (`seo-jsonld`, `brand-word`), a nie ID reguły.
    //    Wykluczamy trafienia zakończone kropką (ścieżki: `rules/design-tokens-only.md`).
    new RegExp("(?<![\\w-])(" + alt + "-[a-z0-9]+(?:-[a-z0-9]+)+)(?![\\w.-])", "g"),
  ];
}

/**
 * Skrypty audytu raportują findings jako `[ID-reguły]`, więc każde ID w `scripts/*.mjs`
 * musi mieć plik `rules/<id>.md`. Ostrzeżenie (nie błąd): reguły dopisują równolegle inne agenty.
 */
function checkScriptRuleIds(rules, sections, warnings) {
  const known = new Set(rules.map((r) => r.id));
  const regexes = idRegexes(sections);
  let files;
  try { files = readdirSync(SCRIPTS_DIR).filter((f) => f.endsWith(".mjs")).sort(); } catch { return; }
  for (const f of files) {
    const text = readText(join(SCRIPTS_DIR, f));
    const missing = new Set();
    for (const re of regexes) {
      let m;
      re.lastIndex = 0;
      while ((m = re.exec(text))) if (!known.has(m[1])) missing.add(m[1]);
    }
    for (const id of [...missing].sort()) {
      warnings.push(`scripts/${f}: ID '${id}' nie ma pliku rules/${id}.md (findings wskazywałyby na nieistniejącą regułę)`);
    }
  }
}

/** Sekcja zadeklarowana w `_sections.md`, do której nie ma ani jednej reguły, znika z AGENTS.md po cichu. */
function checkEmptySections(rules, sections, warnings) {
  const used = new Set(rules.map((r) => r.prefix));
  for (const s of sections) {
    if (!used.has(s.prefix)) {
      warnings.push(`rules/_sections.md: sekcja '${s.prefix}' nie ma żadnej reguły (rules/${s.prefix}-*.md) — dopisz regułę albo usuń wiersz z tabeli sekcji i wzmianki w SKILL.md`);
    }
  }
}

/* ---------- generowanie ---------- */
function demote(body) {
  // reguła jest na poziomie ###, więc jej sekcje ## schodzą na ####
  return body.replace(/^##\s+/gm, "#### ");
}

/** Mapa prefiks → reguły (kolejność sekcji z _sections.md, potem prefiksy spoza pliku). */
function groupBySection(rules, sections) {
  const bySection = new Map();
  for (const r of rules) {
    if (!bySection.has(r.prefix)) bySection.set(r.prefix, []);
    bySection.get(r.prefix).push(r);
  }
  const orderedPrefixes = [
    ...sections.map((s) => s.prefix).filter((p) => bySection.has(p)),
    ...[...bySection.keys()].filter((p) => !sections.some((s) => s.prefix === p)),
  ];
  return { bySection, orderedPrefixes };
}

/** Dominujący impact sekcji: najczęstszy, a przy remisie wyższy (BLOCKER > HIGH > MEDIUM > LOW). */
function dominantImpact(list) {
  let best = null;
  for (const impact of IMPACTS) {
    const n = list.filter((r) => r.meta.impact === impact).length;
    if (n > 0 && (best === null || n > best.n)) best = { impact, n };
  }
  return best ? `${best.impact} ${best.n}/${list.length}` : "—";
}

/** Krótki tytuł sekcji do tabeli w SKILL.md: bez nawiasu z wyliczeniem. */
function shortTitle(title) {
  return String(title).replace(/\s*\(.*$/, "").trim() || String(title).trim();
}

function buildAgents(rules, sections) {
  const { bySection, orderedPrefixes } = groupBySection(rules, sections);
  const counts = Object.fromEntries(IMPACTS.map((i) => [i, rules.filter((r) => r.meta.impact === i).length]));
  const out = [];
  out.push("# KLAROW Guardian: kompilat reguł");
  out.push("");
  out.push("> Plik GENEROWANY przez `node .claude/skills/klarow-guardian/scripts/build-index.mjs` z `rules/*.md`. Nie edytuj ręcznie: popraw regułę w `rules/` i uruchom skrypt.");
  out.push(`> Reguł: ${rules.length} (BLOCKER ${counts.BLOCKER} · HIGH ${counts.HIGH} · MEDIUM ${counts.MEDIUM} · LOW ${counts.LOW}). Kolejność: sekcja (rules/_sections.md) → impact → id.`);
  out.push("> Format wpisu: reguła · mechanizm awarii · Niepoprawnie / Poprawnie · Test (grep / skrypt / DevTools / Playwright) · Wyjątki.");
  out.push("> `SKILL.md` ma tylko tabelę sekcji; pełna tabela reguł jest niżej, w tym pliku.");
  out.push("");
  out.push("## Spis sekcji");
  out.push("");
  orderedPrefixes.forEach((prefix, si) => {
    const sec = sections.find((s) => s.prefix === prefix);
    const list = bySection.get(prefix);
    out.push(`- ${si + 1}. ${sec ? sec.title : prefix} (\`${prefix}\`, reguł: ${list.length}${sec ? `, domyślnie ${sec.impact}, tryb ${sec.mode}, właściciel ${sec.owner}` : ""})`);
  });
  out.push("");
  out.push("## Tabela reguł (pełna)");
  out.push("");
  out.push(buildRulesTable(rules, sections));
  out.push("");
  orderedPrefixes.forEach((prefix, si) => {
    const sec = sections.find((s) => s.prefix === prefix);
    const list = bySection.get(prefix);
    out.push(`## ${si + 1}. ${sec ? sec.title : prefix} (\`${prefix}\`)`);
    out.push("");
    if (sec) out.push(`Domyślny impact: **${sec.impact}** · tryb: ${sec.mode} · właściciel audytu: ${sec.owner}`);
    out.push("");
    list.forEach((r, ri) => {
      out.push(`### ${si + 1}.${ri + 1} ${r.id}`);
      out.push("");
      out.push(`**${r.meta.title}**`);
      out.push("");
      out.push(`Impact: **${r.meta.impact}** · Tagi: ${(r.meta.tags || []).join(", ")} · Źródło: ${r.meta.source} · Dodano: ${r.meta.added} · Plik: \`rules/${r.file}\``);
      out.push("");
      out.push(demote(r.body).trimEnd());
      out.push("");
    });
  });
  return out.join("\n") + "\n";
}

/** Pełna tabela reguł (AGENTS.md): § · ID · impact · tytuł · plik. */
function buildRulesTable(rules, sections) {
  const { bySection, orderedPrefixes } = groupBySection(rules, sections);
  const rows = ["| § | ID | impact | tytuł | plik |", "|---|---|---|---|---|"];
  orderedPrefixes.forEach((prefix, si) => {
    bySection.get(prefix).forEach((r, ri) => {
      const title = String(r.meta.title).replace(/\|/g, "\\|");
      rows.push(`| ${si + 1}.${ri + 1} | \`${r.id}\` | ${r.meta.impact} | ${title} | [rules/${r.file}](rules/${r.file}) |`);
    });
  });
  if (rules.length === 0) rows.push("| | (brak reguł) | | | |");
  return rows.join("\n");
}

/** Tabela sekcji (SKILL.md): 1 wiersz = 1 sekcja, komplet ID w jednej linii. */
function buildSectionTable(rules, sections) {
  const { bySection, orderedPrefixes } = groupBySection(rules, sections);
  const rows = ["| Prefiks | Sekcja | Reguł | Dominujący impact | ID reguł | Plik |", "|---|---|---|---|---|---|"];
  orderedPrefixes.forEach((prefix, si) => {
    const sec = sections.find((s) => s.prefix === prefix);
    const list = bySection.get(prefix);
    const ids = list.map((r) => `\`${r.id}\``).join(" · ");
    rows.push(`| \`${prefix}\` | §${si + 1} ${shortTitle(sec ? sec.title : prefix)} | ${list.length} | ${dominantImpact(list)} | ${ids} | \`rules/${prefix}-*.md\` |`);
  });
  if (rules.length === 0) rows.push("| (brak reguł) | | | | | |");
  return rows.join("\n");
}

function spliceSkill(skillText, table) {
  const s = skillText.indexOf(START);
  const e = skillText.indexOf(END);
  if (s === -1 || e === -1 || e < s) throw new Error(`SKILL.md: brak markerów ${START} / ${END} w poprawnej kolejności`);
  return skillText.slice(0, s + START.length) + "\n" + table + "\n" + skillText.slice(e);
}

/* ---------- main ---------- */
function main() {
  const errors = [];
  const warnings = [];
  if (!existsSync(SECTIONS_MD)) { console.error(`Brak ${rel(SECTIONS_MD)}`); return 1; }
  if (!existsSync(SKILL_MD)) { console.error(`Brak ${rel(SKILL_MD)}`); return 1; }
  const sections = parseSections(readText(SECTIONS_MD));
  if (sections.length === 0) errors.push("rules/_sections.md: nie znaleziono tabeli sekcji (| `prefiks` | Sekcja | impact | tryb | właściciel |)");
  const rules = loadRules(sections, errors, warnings);
  checkScriptRuleIds(rules, sections, warnings);
  checkEmptySections(rules, sections, warnings);

  if (warnings.length && !QUIET) {
    console.warn(`build-index: ${warnings.length} ostrzeżeń (nie blokują):`);
    for (const w of warnings) console.warn("  - " + w);
  }
  if (errors.length) {
    console.error(`build-index: ${errors.length} błąd(ów) formatu:`);
    for (const e of errors) console.error("  - " + e);
    return 1;
  }

  const agents = buildAgents(rules, sections);
  const skillOld = readText(SKILL_MD);
  let skillNew;
  try { skillNew = spliceSkill(skillOld, buildSectionTable(rules, sections)); } catch (e) { console.error(e.message); return 1; }

  const summary = `${rules.length} reguł, ${new Set(rules.map((r) => r.prefix)).size} sekcji: ` +
    IMPACTS.map((i) => `${i} ${rules.filter((r) => r.meta.impact === i).length}`).join(" · ");

  if (CHECK) {
    const agentsOld = existsSync(AGENTS_MD) ? readText(AGENTS_MD) : "";
    const stale = [];
    if (agentsOld !== agents) stale.push(rel(AGENTS_MD));
    if (skillOld !== skillNew) stale.push(rel(SKILL_MD) + " (tabela sekcji)");
    if (stale.length) { console.error(`build-index --check: nieaktualne: ${stale.join(", ")}. Uruchom bez --check.`); return 1; }
    log(`build-index --check: OK (${summary})`);
    return 0;
  }

  writeFileSync(AGENTS_MD, agents, "utf8");
  writeFileSync(SKILL_MD, skillNew, "utf8");
  log(`build-index: zapisano ${rel(AGENTS_MD)} (pełna tabela reguł) i tabelę sekcji w ${rel(SKILL_MD)} (${summary})`);
  return 0;
}

process.exitCode = main();
