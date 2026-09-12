# Synchronizacja zdania marki (checklista jednego PR)

> Uruchamiasz ją ZAWSZE, gdy zmienia się `oneLiner`, `subtext`, `cta`, `proofLabels`, `pillars`
> albo `closing` w `site/src/data/messaging.ts`. Reguły: `copy-one-liner-single-source` (HIGH),
> `code-single-source-copy`, `brand-honest-labels`, `seo-pageseo-single-source`.
> Zasada: **jedno zdanie, jeden commit, diff tekstu między powierzchniami = 0.**
> Kopiuj tę listę do `.claude/work/<zadanie>/plan.md` i odhaczaj.

## 0. Zanim zmienisz zdanie

- [ ] Powód zmiany zapisany w planie (i w `references/decisions-log.md`, jeśli to decyzja, nie szlif)
- [ ] Nowe zdanie mieści się w limitach: H1 ≤ 2 linie na 1024 px, `description` 130–165 zn. razem z resztą zdania, `title` ≤ 60 zn.
- [ ] Zero słowa „AI", zero nazwy poprzedniej firmy, zero liczby spoza `references/allowed-numbers.md`, zero „—" (D-09)
- [ ] Wersja EN jest tłumaczeniem intencji, nie kalką słowo w słowo; obie wersje przeczytane na głos

## 1. Powierzchnie w repo (wszystkie w TYM SAMYM commicie)

- [ ] `site/src/data/messaging.ts` — źródło (`{ pl, en }`)
- [ ] `site/src/components/Hero.tsx` — H1 = `MESSAGING.oneLiner`, lead = `MESSAGING.subtext` (bez lokalnej kopii tekstu)
- [ ] `site/src/data/pagesSeo.ts` — `home.description` zawiera zdanie DOSŁOWNIE (ręczny literał, nigdy `.slice()`)
- [ ] `site/src/components/Seo.tsx` — `ORG_JSONLD.description` to samo zdanie
- [ ] `site/src/prerender/entry.tsx` — shell home i `llmsTxt()` (sekcja PL i EN)
- [ ] `site/index.html` — fallback meta (opis i `og:description`) 1:1 ze zdaniem
- [ ] `post-bot/worker.js` — `SYSTEM_PROMPT` z komentarzem `// messaging.ts@<sha>` (kopia ręczna, w tym samym PR)
- [ ] `leadscout/playbook-outbound.md` — szablony mówią to samo zdanie (PKE: link do `klarow.com/rodo` zostaje)

## 2. Powierzchnie poza repo (właściciel: founderzy)

- [ ] Nagłówek LinkedIn Pawła i Karola
- [ ] Podpis w mailu / wizytówka / QR (`/start` → `/oferta?utm_source=qr`)
- [ ] Wpis „Stan operacyjny" w `CLAUDE.md`: co zmienione, dlaczego, od kiedy

## 3. Weryfikacja mechaniczna (po `cd site && npm run build`)

```bash
ONE=$(grep -oE 'oneLiner: \{ pl: "[^"]+"' site/src/data/messaging.ts | sed -E 's/.*pl: "//; s/"$//')
for f in site/dist/index.html site/dist/llms.txt post-bot/worker.js site/src/data/pagesSeo.ts; do
  grep -qF "$ONE" "$f" && echo "OK   $f" || echo "FAIL $f"
done
grep -c "$ONE" site/dist/index.html          # ≥ 2 (H1 + description/JSON-LD)
grep -nE "\.slice\(0, ?1[0-9][0-9]\)" site/src/data/pagesSeo.ts || echo OK    # 0
# stare brzmienia przekazu znikają razem ze zmianą
grep -rnE "wyros(ł|l)(y|a) na Excelu|12 działających demo" site/src site/index.html site/dist post-bot/worker.js || echo OK
node .claude/skills/klarow-guardian/scripts/audit-static.mjs --changed --fail-on BLOCKER,HIGH --baseline .claude/skills/klarow-guardian/baseline/audit-static-2026-09-12.jsonl
node .claude/skills/klarow-guardian/scripts/verify-site.mjs
```

- [ ] Każdy wiersz pętli = `OK`
- [ ] `audit-static` bez BLOCKER i bez nowych HIGH; `verify-site` bez BLOCKER
- [ ] Zrzut home 390 px i 1440 px: H1 mieści się w 2 liniach, CTA widoczne bez scrolla

## 4. Zamknięcie

- [ ] `checklists/preflight.md` przechodzi (bramki 0–6)
- [ ] Commit po polsku, jeden PR, wszystkie powierzchnie z §1 w jednym diffie
- [ ] Jeśli zdanie zmieniło pozycjonowanie (nie tylko słowa) — wiersz w `references/decisions-log.md` §1
