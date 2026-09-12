---
id: integ-dependency-audit
title: Nowa zależność npm = uzasadnienie, rozmiar gzip, licencja, sprawdzenie sieci i wpis w rejestrze
impact: HIGH
tags: [integrations, dependencies, npm, supply-chain, bundle, license]
source: site-audit §1.1, §3.5 (5 nieużywanych zależności) / synthesis §2.4.9 (budżety chunków), §5.4.9 / motion-dev §3.2 (pomiar gzip motion) / vercel.md §9 (bundle) / CLAUDE.md #6 (npx nie działa; npm tak)
added: 2026-09-12
---

## Zasada

Każdy nowy pakiet w `site/package.json` (dependencies i devDependencies) przechodzi przed commitem
pięciopunktową bramkę, a wynik ląduje w opisie commita lub w `plan.md` zadania:
1. **Uzasadnienie**: co robi, czego nie da się zrobić w ≤ 40 liniach własnego kodu lub CSS (np. `Ticker`,
   `AnimateNumber` piszemy sami — motion-dev §7), co zastępuje;
2. **Rozmiar**: gzip po stronie klienta (pomiar, nie deklaracja z README) i mieszczenie się w budżetach
   chunków z `synthesis.md` §2.4.9; nowy chunk lazy, jeśli > 15 KB gz;
3. **Licencja**: MIT / ISC / Apache-2.0 / BSD bez decyzji; GPL / AGPL / SSPL / BUSL / „custom" = decyzja
   founderów (narzędzia trafiają do klientów);
4. **Sieć i telemetria**: pakiet nie wykonuje requestów w runtime (analityka, „phone home", pobieranie
   assetów z CDN) ani `postinstall` z pobieraniem binarek; jeśli wykonuje, to jest integracją z wpisem
   w rejestrze (tabela identyfikatorów, `NETWORK_PACKAGES` w skanerze);
5. **Utrzymanie**: ostatnia publikacja < 18 miesięcy, `npm audit --omit=dev` bez HIGH/CRITICAL, wersja
   przypięta zakresem `^` (nie `*`, nie `latest`).
Wpis w rejestrze: build-time w `npm-build-deps` (lub własny wiersz, gdy pakiet ma sieć) — **każdy** pakiet
z `dependencies` i `devDependencies`, łącznie z `@types/*`, bo test 1 niżej sprawdza komplet. Pakiety
nieużywane usuwamy (dziś: `@react-three/fiber`, `@radix-ui/react-slot`, `class-variance-authority`, `clsx`,
`tailwind-merge` — `code-no-dead-code`); usunięcie z `package.json` i usunięcie z rejestru to JEDEN commit.
Sam rejestr npm (`registry.npmjs.org`) jest integracją build-time z własnym wierszem `npm-registry`:
to stamtąd przychodzi wykonywany u nas kod.

## Mechanizm awarii (dlaczego)

Zależność to kod wykonywany u każdego odwiedzającego i, w narzędziach, u klienta on-premise; łańcuch
dostaw npm był w latach 2024-2026 wielokrotnie wektorem ataku (podmienione wersje popularnych paczek,
`postinstall` kradnące tokeny z CI). Pakiety analityczne i „SDK" potrafią wysyłać dane bez jawnego `fetch`
w naszym kodzie, co obala „zero chmury dostawcy" niewidocznie dla grepa po `site/src` (skaner łapie tylko
listę znanych pakietów sieciowych, więc bramka ręczna jest konieczna). Bundle 511 KB / 157 KB gz
(`site-audit.md` §1.9) już przekracza budżet; każde 20 KB to realny LCP na 4G. Licencje copyleft w narzędziu
dostarczanym klientowi z kodem źródłowym („kod i dokumentacja zostają u Ciebie") tworzą zobowiązania,
których umowa pilotażowa nie przewiduje. Pięć martwych zależności w `package.json` to dowód, że bez bramki
lista tylko rośnie.

## Niepoprawnie

```bash
# „na szybko", bez pomiaru, bez sprawdzenia licencji i sieci; pakiet ciągnie telemetrię i 90 KB gz
cd site && npm i some-charts-pro-sdk
```
```json
// site/package.json — pakiet z runtime'owym pobieraniem assetów z CDN i „*" jako wersja
"dependencies": { "fancy-icons-online": "*" }
```

## Poprawnie

```bash
cd site
npm view motion version license time.modified dist.unpackedSize --json      # licencja MIT, świeża publikacja
npm view motion scripts.postinstall --json                                  # brak postinstall
npm i motion@13.2.0
node -e "import('node:zlib').then(z=>{const fs=require('fs');const b=fs.readFileSync('node_modules/motion/dist/es/react-m.mjs');console.log('gz',z.gzipSync(b).length)})"
npm audit --omit=dev
grep -rn "fetch(\|XMLHttpRequest\|navigator.sendBeacon" node_modules/motion/dist --include=*.mjs -l | head   # 0 plików
```
Commit: `Motion 13.2.0 (MIT, 4,6 KB gz m + LazyMotion; zastępuje ręczne keyframes w 5 komponentach; zero sieci)`.
Rejestr: `motion-lib` → status `aktywna`.

## Test

```bash
# 1. każdy pakiet z package.json ma wpis w tabeli identyfikatorów rejestru (npm-build-deps lub własny)
node -e '
const fs=require("fs");const p=JSON.parse(fs.readFileSync("site/package.json","utf8"));
const reg=fs.readFileSync(".claude/skills/klarow-guardian/references/integrations-registry.md","utf8");
const all=[...Object.keys(p.dependencies||{}),...Object.keys(p.devDependencies||{})];
const missing=all.filter(n=>!reg.includes("`"+n+"`")); console.log(missing.length?"BRAK W REJESTRZE: "+missing.join(", "):"OK: wszystkie zależności w rejestrze"); process.exit(missing.length?1:0)'
# 2. audyt podatności i licencje (npm działa; npx nie)
cd site && npm audit --omit=dev && npm ls --depth=0
# 3. pakiety sieciowe w bundlu strony
node ".claude/skills/klarow-guardian/scripts/find-integrations.mjs" site/src --strict --quiet
# 4. nieużywane zależności (import nigdzie w src)
node -e '
const fs=require("fs"),path=require("path");const p=JSON.parse(fs.readFileSync("site/package.json","utf8"));
const src=[];(function w(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const f=path.join(d,e.name);e.isDirectory()?w(f):/\.(ts|tsx|css)$/.test(e.name)&&src.push(fs.readFileSync(f,"utf8"))}})("site/src");
const txt=src.join("\n");for(const n of Object.keys(p.dependencies)){if(!txt.includes("\""+n)&&!txt.includes("\x27"+n)&&!txt.includes(n+"/"))console.log("nieużywane:",n)}'
```

## Wyjątki

devDependencies bez wpływu na bundle i bez sieci (typescript, @types/*, vite, @vitejs/plugin-react,
@tailwindcss/vite) wymagają tylko punktów 3 i 5 — ale wpis w rejestrze (`npm-build-deps`) obowiązuje
je tak samo, bo test 1 czyta CAŁY `package.json`.

**Jawny wyjątek od punktu 4 (zero `postinstall` z pobieraniem binarek): `playwright-core`.** Instalacja
ściąga binarkę WebKita z CDN dostawcy do `~/AppData/Local/ms-playwright/webkit-2311` — to egress
dev-time i pobranie WYKONYWALNEGO kodu z sieci. Wyjątek jest dopuszczony, bo: pakiet nie wchodzi
do `site/package.json` (żyje w scratchpadzie), nie trafia do bundla ani do instalacji u klienta,
a uruchamiamy go tylko na własnym `site/dist` i na `klarow.com`. Warunek: wpis `playwright-webkit`
w rejestrze ma to nazywać wprost w kolumnie „dane, które wychodzą" (przy instalacji: pobranie binarki;
w użyciu: nic). Każdy inny pakiet z `postinstall` pobierającym binarkę = własny wiersz w rejestrze
i decyzja founderów.
