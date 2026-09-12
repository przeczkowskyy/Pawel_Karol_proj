---
id: motion-bundle-budget-motion
title: Chunki Motion ≤ 35 KB gz w ścieżce krytycznej; ≥ 40 KB = sygnatura domMax / pełnego motion
impact: HIGH
tags: [motion, bundle, performance, budget]
source: motion-dev §3.2 (pomiary 13.2.0: 33,8 KB m+domAnimation, 42,7 KB domMax, 47,5 KB pełny) · docs/plan/strona-v2-plan.md:18/352/414 (≤ 35 KB gz, „skok > 40 KB = fail bramki") · showreel §5.9 · UWAGA: nadpisuje synthesis §2.4.9/§5/§11 (tam 36 KB) — obowiązuje 35 KB, bo tak mówi plan i tak jest ostrzej
added: 2026-09-12
---

## Zasada

Po `npm run build` suma gzip wszystkich chunków w `site/dist/assets`, których kod pochodzi z `motion`/`framer-motion` (identyfikacja: chunk zawiera ciąg `LazyMotion` lub `MotionConfigContext` lub `framer-motion`), ładowanych statycznie z `dist/index.html`, wynosi ≤ **35 KB gz** (`35 840` B). Baseline z pomiaru 2026-09-11 (Vite 7.3.6, `target ["es2019","safari13"]`): **33,8 KB gz** dla `m.*` + `LazyMotion(domAnimation)` sync + `MotionConfig` + `AnimatePresence` + hooki `useInView/useMotionValue/useTransform/animate`.

Progi (liczby muszą być spójne z arytmetyką pomiarów, inaczej próg jest martwy):
- `> 35 KB` (35 840 B) i `< 40 KB`: HIGH — regresja; szukać nowego importu (`useScroll`/`useSpring` +12,9 KB, `Reorder`, `motion/three`),
- `≥ 40 KB` (40 960 B): sygnatura wciągnięcia `domMax` (42,7 KB) albo `import { motion }` / pełnego bundla (47,5 KB gz = 48 640 B): fail natychmiastowy, traktowany jak `motion-one-library-lazymotion`, bez dyskusji o „małej regresji". Ten sam próg wyłapie `useScroll` + `useSpring` doklejone do bazy (33,8 + 12,9 ≈ 46,7 KB) — to też fail, tylko z innym powodem w komunikacie.

Dlaczego 40, a nie 48: pełny `motion` waży 47,5 KB gz = **48 640 B**, a `48 * 1024` to **49 152 B** — przy progu 48 KB dokładnie ten przypadek, który ma dawać fail natychmiastowy, wpadał w gałąź „regresja > 35 KB". `domMax` (42,7 KB) mijał próg jeszcze wyraźniej. 40 KB jest jednocześnie liczbą z planu (`strona-v2-plan.md:352`: „skok > 40 KB = ktoś wciągnął domMax lub pełny motion → fail bramki") i nie daje fałszywek: baza `m` + `domAnimation` to 33,8 KB, czyli 6 KB zapasu.

Motion nie może być rozbite na chunk lazy „żeby zmieścić się w budżecie": `LazyMotion` jest SYNC (patrz `motion-one-library-lazymotion`). Budżet domyka się przez dyscyplinę importów, nie przez lazy.

Baseline jest zapisany w `site/scripts/verify-site.baseline.json` (`{"motionGz": 33800, ...}`) i aktualizowany tylko świadomym commitem `Perf: nowy baseline chunków (powód)`.

Plik NIE istnieje przed pierwszym zielonym buildem v2: tworzy go świadomie `node .claude/skills/klarow-guardian/scripts/verify-site.mjs --write-baseline` (zapisuje `homeGz`, `cssGz`, `motionGz` z aktualnego `dist`). Do tego czasu obowiązują budżety domyślne z `verify-site.mjs`, a skrypt mówi o braku baseline’u na stderr.

## Mechanizm awarii (dlaczego)

- Różnica `m`+`domAnimation` vs pełny `motion` to 13,7 KB gz (29 %): ~23 % chunku react-dom. Na stronie z budżetem JS `/` ≤ 140 KB gz (react-dom ~58 + router ~15 + motion ~34 + app ~25) nie ma miejsca na 47,5.
- Regresja bundla jest cicha: `tsc` i `vite build` przechodzą, strona działa, a każdy użytkownik płaci 14 KB więcej na każdej trasie. Tylko bramka liczbowa ją łapie.
- Docs Motion obiecują „4,6 kB"; w praktyce wspólny rdzeń (`MotionConfigContext` 11,6 KB + silnik) ładuje się zawsze. Nie obiecywać founderom „5 KB"; budżet 35 jest realny, ≥ 40 = błąd w imporcie, nie „drobna regresja".

## Niepoprawnie

```tsx
import { useScroll, useSpring, useTransform } from "motion/react";   // +12,9 KB gz, a scroll-linked jest zakazane
import { Reorder } from "motion/react";                               // domMax
import { threeEffect } from "motion/three";                           // three w drzewie Motion
```

```json
// verify-site.baseline.json podbity bez powodu
{ "motionGz": 44000 }
```

## Poprawnie

```ts
// scripts/verify-site.mjs (fragment; bez npx)
import { readFileSync, readdirSync } from "node:fs";
import { gzipSync } from "node:zlib";
const dist = "dist/assets";
const html = readFileSync("dist/index.html", "utf8");
const critical = [...html.matchAll(/assets\/([^"']+\.js)/g)].map((m) => m[1]);   // chunki ładowane statycznie z index.html
let motionGz = 0;
for (const f of readdirSync(dist)) {
  if (!f.endsWith(".js") || !critical.includes(f)) continue;
  const src = readFileSync(`${dist}/${f}`, "utf8");
  if (/LazyMotion|MotionConfigContext|framer-motion/.test(src)) motionGz += gzipSync(src).length;
}
const LIMIT = 35 * 1024, SIGNATURE_FULL = 40 * 1024;   // 35 840 B / 40 960 B; pełny motion = 48 640 B, domMax ≈ 43 724 B
if (motionGz >= SIGNATURE_FULL) fail(`motion-bundle-budget-motion: ${motionGz} B gz ≥ 40 KB: domMax / import {motion} / useScroll+useSpring (patrz motion-one-library-lazymotion)`);
else if (motionGz > LIMIT) fail(`motion-bundle-budget-motion: ${motionGz} B gz > 35 KB (baseline ${baseline.motionGz})`);
```

## Test

```bash
cd site && npm run build >/dev/null && node scripts/verify-site.mjs      # docelowo
# do czasu skryptu: ręczny pomiar
cd site && for f in dist/assets/*.js; do grep -lqE 'LazyMotion|MotionConfigContext|framer-motion' "$f" && printf '%s %s\n' "$(gzip -c "$f" | wc -c)" "$f"; done
# suma wierszy ≤ 35840 (> 35840 = HIGH; ≥ 40960 = fail natychmiastowy); każdy chunk musi być referencowany w dist/index.html (nie lazy)
grep -oE 'assets/[^"]+\.js' dist/index.html
```

## Wyjątki

- Świadome przejście na `domMax` (decyzja w `docs/plan/`) podnosi budżet do 50 KB (i `SIGNATURE_FULL` do 55 KB) oraz baseline w tym samym commicie; reguła `motion-one-library-lazymotion` musi zostać zaktualizowana równocześnie.
