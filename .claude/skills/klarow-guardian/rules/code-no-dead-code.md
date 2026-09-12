---
id: code-no-dead-code
title: Zero martwego kodu w repo: zapas = osobna gałąź, nie plik w src
impact: MEDIUM
tags: [dead-code, dependencies, hygiene, git, code]
source: site-audit.md §3.5 (897 linii martwych ui/*, 5 zależności, content/, data/, placeholder.svg, Logo.zip, zoomRef, sondy decka) / synthesis F0 (usunięcie martwego kodu i 6 zależności), §2.6.3 (GLSL Hills jako plan B) / CLAUDE.md „Zapas (nieużywane, poza bundlem)"
added: 2026-09-12
---

## Zasada

W `site/src` nie ma plików, których nikt nie importuje, ani eksportów, których nikt nie używa; w `site/package.json` nie ma zależności, których nie importuje żaden plik w `src/`. Kod „na zapas" (karuzela orbitalna, `canvas-reveal-effect`, shadcn `ui/button|badge|card`) trzymamy w gałęzi `zapas/<nazwa>` w gicie (albo tagu), nie w `main`. Nieaktualne komentarze i copy (`Seo.tsx:6` „Sitemap: public/sitemap.xml", `BookingModal.tsx:30,48` „Rezerwacja online pojawi się wraz z uruchomieniem domeny", `Differentiators.tsx:26,97` „zobacz w demie powyżej", sondy `.deck/.slide` w `index.html:88-104,160-171`, prop `zoomRef`) traktujemy jak martwy kod: do usunięcia w tym samym PR, w którym się je zauważy. Plan B tła (GLSL Hills) jest jedynym „zapasem" dopuszczonym w `main` do decyzji D-08, z komentarzem `/* plan B: D-08 */` i bez importu w `App.tsx`, jeśli wideo przejdzie.

## Mechanizm awarii (dlaczego)

Stan 2026-09-11: 897 linii w `components/ui/{button,badge,card,canvas-reveal-effect,radial-orbital-timeline}.tsx` importowanych wyłącznie nawzajem; 5 zależności (`@react-three/fiber`, `@radix-ui/react-slot`, `class-variance-authority`, `clsx`, `tailwind-merge`) + `lib/utils.ts` używane tylko przez te pliki; katalogi `content/` i `data/` (YAML) z 0 referencji, `site/README.md` opisujący nieistniejący model. Martwy kod myli agentów (7× `forwardRef`, 4× `transition-all` w plikach, które „są w repo, więc chyba obowiązują"), zawyża `npm install` i skan bezpieczeństwa, a nieaktualne komentarze prowadzą do błędnych decyzji (`vite.config.ts:16-23` o Lightning CSS). Reguła CLAUDE.md o „zapasie poza bundlem" była kompromisem z lipca; po decyzjach o karuzeli (usunięta 07-22) i decku (usunięty 07-26) zapas nie ma już celu.

## Niepoprawnie

```
site/src/components/ui/radial-orbital-timeline.tsx   415 l., 0 importerów, 4× transition-all
site/package.json: "@react-three/fiber", "clsx", "tailwind-merge"   (0 importów w src)
site/content/modules/*.yml                            0 referencji
/* Sitemap: public/sitemap.xml (aktualizuj przy dodaniu narzędzia!) */   ← sitemap jest generowany
```

## Poprawnie

```bash
git switch -c zapas/radial-orbital-timeline && git mv site/src/components/ui/radial-orbital-timeline.tsx … && git commit -m "Zapas: karuzela orbitalna poza main"
git switch main && git rm -r site/src/components/ui/{button,badge,card,canvas-reveal-effect,radial-orbital-timeline}.tsx site/src/lib/utils.ts site/content site/data site/public/screens/placeholder.svg Logo.zip
npm uninstall @react-three/fiber @radix-ui/react-slot class-variance-authority clsx tailwind-merge   # w site/
```

## Test

```bash
# pliki bez importerów (heurystyka: nazwa pliku nie występuje w żadnym import poza samym sobą)
# DOCELOWO (skrypt planowany, jeszcze nie istnieje — dziś: NIE SPRAWDZANO): node .claude/skills/klarow-guardian/scripts/check-code.mjs --dead-files
# zależności bez importu w src
for d in $(node -e "console.log(Object.keys(require('./site/package.json').dependencies).join(' '))"); do grep -rqE "from \"$d(/|\")" site/src || echo "UNUSED dep: $d"; done
# nieaktualne komentarze/copy z listy audytu
grep -rnE "public/sitemap\.xml|uruchomieniem domeny|w demie powyżej|Lightning CSS|zoomRef|\.slide\.active" site/src site/index.html site/vite.config.ts   # oczekiwane: 0
test ! -d site/content && test ! -d site/data && echo "OK: brak YAML"
```

Severity: MEDIUM (raport); nowy plik bez importera w PR = do usunięcia przed merge.

## Wyjątki

`components/ui/glsl-hills.tsx` + `BgBoundary.tsx` do decyzji D-08 (plan B). `types/pdfmake.d.ts` (deklaracje, nie import). Skrypty w `scripts/` i `.claude/**` (nie są importowane, są uruchamiane).
