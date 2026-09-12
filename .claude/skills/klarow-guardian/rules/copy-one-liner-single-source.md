---
id: copy-one-liner-single-source
title: Jedno zdanie marki z messaging.ts na każdej powierzchni: H1, pagesSeo.home, ORG_JSONLD, llms.txt, index.html, prompt bota, nagłówki LinkedIn
impact: HIGH
tags: [copy, messaging, one-liner, sync, seo, bot]
source: strategy.md T12, D1, D14, §9 p.1 / synthesis §2.1 (`src/data/messaging.ts` JEDYNE źródło zdań), D-01 (pełne V1), brand-one-sentence, brand-messaging-sync / post-bot/worker.js:22-53 (prompt)
added: 2026-09-12
---

## Zasada

`src/data/messaging.ts` jest jedynym źródłem zdań marki: `oneLiner` („Narzędzia pod Twój proces. Działają w dni, dane zostają u Ciebie." / EN), `subtext`, `pillars` (3), `determinism`, `zeroVendorCloud`, `cta`, `closing`, `proofLabels`, `allowedNumbers`, `bannedWords`. Konsumują je bez przepisywania: `Hero` (H1 = `oneLiner`, lead = `subtext`), `pagesSeo.home.description` (ręczny literał, który zawiera DOSŁOWNIE `oneLiner`; nigdy sklejka z `.slice()` — limity 130–165 zn. pilnuje `seo-pageseo-single-source`), `ORG_JSONLD.description`, `llmsTxt()`, `index.html` (fallback meta generowany w buildzie lub kopiowany 1:1), `post-bot/worker.js` `SYSTEM_PROMPT` (kopiowany ręcznie w tym samym PR, z komentarzem `// messaging.ts@<sha>`), nagłówki LinkedIn founderów (checklista `checklists/definition-of-done.md` §D p. 1). Zmiana `oneLiner` = jeden PR dotykający wszystkich powierzchni; audyt = diff tekstu między nimi równy 0 (poza dozwolonym łamaniem linii i wielkością pierwszej litery).

## Mechanizm awarii (dlaczego)

Dziś każda powierzchnia mówi co innego: H1 `App.tsx:98-99` („…które wyrosły na Excelu"), `index.html:7-18` („12 działających demo"), `Seo.tsx:77-78` (JSON-LD z „wyrosły na Excelu"), `llms.txt` (`entry.tsx:449-452` „Windows + Excel"), prompt bota `post-bot/worker.js:25` („MŚP 20–250 osób, które wyrosły na Excelu"), nagłówek LinkedIn z `plan-dzialania-pawel.md:13`. Osoba, która dostała wiadomość na LinkedIn, wchodzi na stronę i czyta inne zdanie niż w wiadomości (`strategy.md` §3.2: „te same słowa, co w wiadomości"); LLM cytujący `llms.txt` powtarza stary przekaz z Excelem. Bez jednego źródła audyt nie ma czego porównać.

## Niepoprawnie

```tsx
const HERO = { pl: { h1: "Automatyzacja i porządek w danych dla firm, które wyrosły na Excelu." } };   // App.tsx, lokalna kopia
```
```js
// post-bot/worker.js:25
const SYSTEM_PROMPT = `Klarow: automatyzacja dla MŚP 20–250 osób, które „wyrosły na Excelu" (Windows + Excel)…`;
```

## Poprawnie

```ts
// data/home.ts
hero: { h1: MESSAGING.oneLiner, lead: MESSAGING.subtext }
// data/pagesSeo.ts — ręczny literał (jedno brzmienie z seo-pageseo-single-source), zawiera dosłownie MESSAGING.oneLiner.
// Zero .slice(): ucina w środku wyrazu i nie gwarantuje dolnego progu 130 zn.
home: { description: { pl: "Narzędzia pod Twój proces. Działają w dni, dane zostają u Ciebie. Kontroling, integracje (KSeF), importy z ERP, obieg dokumentów, panele. 12 dem na żywo." /* 153 zn. */, en: "…" } }
// components/Seo.tsx
description: `${MESSAGING.oneLiner.pl} ${MESSAGING.subtext.pl}`
// post-bot/worker.js (kopia ręczna, ten sam PR)
// messaging.ts@b9677ea (2026-09-12): NIE edytować tu; zmień site/src/data/messaging.ts i skopiuj
const ONE_LINER = "Narzędzia pod Twój proces. Działają w dni, dane zostają u Ciebie.";
```

## Test

```bash
# zdanie z messaging.ts występuje dosłownie w: dist/index.html (H1 + description), dist/llms.txt, post-bot/worker.js
ONE=$(node -e "import('./site/src/data/messaging.ts').catch(()=>0)" 2>/dev/null; grep -oE "oneLiner: \{ pl: \"[^\"]+\"" site/src/data/messaging.ts | sed -E 's/.*pl: "//; s/"$//')
for f in site/dist/index.html site/dist/llms.txt post-bot/worker.js; do grep -qF "$ONE" "$f" && echo "OK $f" || echo "FAIL $f"; done
grep -c "$ONE" site/dist/index.html                                          # ≥ 2 (H1 + JSON-LD/description)
# description home zawiera zdanie dosłownie i nie jest przycinana w kodzie
grep -qF "$ONE" site/src/data/pagesSeo.ts && echo "OK pagesSeo" || echo "FAIL pagesSeo"
grep -nE "\.slice\(0, ?1[0-9][0-9]\)" site/src/data/pagesSeo.ts                # 0
# stare frazy przekazu: 0
grep -rnE "wyros(ł|l)(y|a) na Excelu|12 działających demo" site/src site/index.html site/dist post-bot/worker.js 2>/dev/null   # 0
# DOCELOWO (skrypt planowany, jeszcze nie istnieje — dziś: NIE SPRAWDZANO): node .claude/skills/klarow-guardian/scripts/check-brand.mjs --one-sentence
```

Severity: HIGH.

## Wyjątki

`llms.txt` i `pagesSeo` mogą dodać do zdania krótkie dopełnienie („12 dem na żywo."), ale zdanie bazowe pozostaje dosłowne. Wariant EN podlega tej samej regule na powierzchniach EN.
