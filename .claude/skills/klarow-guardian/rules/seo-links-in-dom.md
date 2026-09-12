---
id: seo-links-in-dom
title: Linki w DOM: hub ≥ 13 <a> do /narzedzia/<slug> zawsze (shell i po JS); home linkuje do 4 realizacji + hub; shell = DOM
impact: BLOCKER
tags: [seo, internal-links, hub, prerender, dom, crawl]
source: site-audit.md §3.6 p.1 (ToolsGrid chowa 13 linków), §5 p.11 (rozdział treści bez duplikacji) / synthesis §2.3 Hub (13 kart zawsze w DOM, filtr = hidden), D-13 (home → 4 featured + hub), S5 (bramka shell-vs-DOM), seo-hub-links, seo-no-duplication
added: 2026-09-12
---

## Zasada

1. `dist/narzedzia.html` (shell) I DOM `/narzedzia` po starcie Reacta zawierają ≥ 13 elementów `<a href="/narzedzia/<slug>">` (po jednym na narzędzie; po fazie 2: 15). Filtry działu/typu ukrywają karty atrybutem `hidden`, nigdy nie odmontowują (`code-state-in-url`).
2. Home linkuje do dokładnie 4 pozycji `featured` (S3) + do huba `/narzedzia` + do `/oferta`, `/faq`, `/rodo` (stopka). Pełna lista 13 tylko na hubie (rozdział treści bez duplikacji: home nie powiela kart huba).
3. Każda podstrona narzędzia linkuje do 2 innych narzędzi (ten sam dział + inny dział) i do huba (breadcrumb „Realizacje i dema / {dział}").
4. Zbiór H1/H2/akapitów i linków wewnętrznych w shellu = zbiór w DOM po JS (bramka shell-vs-DOM, Playwright WebKit ze scratchpadu, faza 3).
5. Linki to `<a>`/`<Link>` z `href` (`a11y-controls-native`); żadnych linków wyłącznie w `onClick`.

## Mechanizm awarii (dlaczego)

`ToolsGrid.tsx:71-119`: poziom 1 to 5 przycisków działów; linki do podstron pojawiają się po kliknięciu i tylko dla jednego działu. Prerender ma 13 linków, wyrenderowany DOM (Googlebot wykonuje JS i indeksuje DOM po renderze) ma 0. Google traktuje to jako rozjazd treści i traci 13 sygnałów linkowania wewnętrznego z najważniejszej strony hubowej; PageRank wewnętrzny do podstron long-tail (`toolsSeo.ts`, ~7 tygodni indeksacji) przestaje płynąć. Decyzja z 2026-07-26 „home bez linków do narzędzi" była poprawna dla duplikacji, ale D-13 ją koryguje: 4 linki z hookami nie duplikują treści podstron, a dają hubowi i podstronom sygnał z home.

## Niepoprawnie

```tsx
if (openDept === null) return <div className="tools-strip">{DEPTS.map((d) => <button onClick={() => setOpenDept(d.key)}>…</button>)}</div>;   // 0 linków
```

## Poprawnie

```tsx
<ul className="tool-grid">
  {tools.map((t) => (
    <li key={t.slug} hidden={!matches(t, dzial, typ)}>
      <Link to={`/narzedzia/${t.slug}`} className="card-link">
        <img src={t.media.thumb} width={640} height={400} loading="lazy" alt="" />
        <span className="t-heading">{t.name}</span><span className="t-muted">{t.hook}</span>
        <span className="chips"><span className="st">{proofLabel(t.kind)}</span><span className="st">{DEPT_LABEL[t.dept]}</span><span className="st">{t.delivery}</span></span>
      </Link>
    </li>
  ))}
</ul>
```

## Test

```bash
grep -oE "href=\"/narzedzia/[a-z0-9-]+\"" site/dist/narzedzia.html | sort -u | wc -l     # ≥ 13
grep -oE "href=\"/narzedzia/[a-z0-9-]+\"" site/dist/index.html | sort -u | wc -l         # 4
grep -c "href=\"/narzedzia\"" site/dist/index.html                                          # ≥ 1
grep -c "href=\"/rodo\"" site/dist/index.html                                               # ≥ 1 (stopka)
# DOM po JS (Playwright WebKit): document.querySelectorAll('a[href^="/narzedzia/"]').length >= 13 na /narzedzia
node .claude/skills/klarow-guardian/scripts/verify-site.mjs --min-tool-links 13                 # shell hubu: ≥ 13 różnych linków /narzedzia/<slug>
# PLANOWANE (F3, verify-site.mjs nie zna tego trybu): node .claude/skills/klarow-guardian/scripts/verify-site.mjs --dom /narzedzia --expect-links 13
# PLANOWANE (F3, verify-site.mjs nie zna tego trybu): node .claude/skills/klarow-guardian/scripts/verify-site.mjs --shell-vs-dom / /narzedzia   # 0 rozjazdów
```

Severity: BLOCKER.

## Wyjątki

Karty case dodane w fazie 2 (S7) zwiększają próg do 15; skrypt czyta liczbę z `getTools().length`, nie z literału.
