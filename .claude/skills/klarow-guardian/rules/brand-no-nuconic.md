---
id: brand-no-nuconic
title: Zero nazwy poprzedniej firmy w czymkolwiek publicznym
impact: BLOCKER
tags: [brand, legal, ip, dist, assets]
source: CLAUDE.md #3 / plan-strategiczny §5.2 / decyzja founderów 2026-07-22 („dowód bez marki poprzedniej firmy")
added: 2026-09-12
---

## Zasada

Nazwa poprzedniej firmy (wzorzec `nuconic`, bez względu na wielkość liter), jej domeny, logo,
nazwiska pracowników, realne zrzuty ekranów i liczby dające się jej przypisać **nie pojawiają się
w niczym publicznym**: `site/**`, `demo/**`, `ui-kit/skills/company-ui/assets/**`, `public/**`,
`dist/**`, nazwy i metadane plików graficznych (EXIF/XMP), komunikaty commitów dotykające tych
katalogów, prompty do generatorów obrazów/wideo, posty bota `/post`, szablony outboundu.
Case opisujemy wyłącznie jako **„firma produkcyjno-budowlana"** (opcjonalnie „działająca w Polsce
i USA"). Prefiksy `nc-` / `Nc*` w publicznym kodzie (inicjały marki) liczą się jak nazwa.

## Mechanizm awarii (dlaczego)

Umowa IP z poprzednią firmą nie jest podpisana (plan §5.2: „PRZED startem sprzedaży"). Publikacja
nazwy, zrzutu albo liczby to naruszenie warunku, na którym stoi cały dowód Klarow, plus ryzyko
prawne (tajemnica przedsiębiorstwa) i wizerunkowe u pierwszego klienta, który wpisze nazwę
w Google. Wyszukiwarka indeksuje także `alt`, `title`, meta, JSON-LD, `llms.txt` i tekst w PDF;
obrazy z generatorów i Photoshopa niosą metadane z promptu albo nazwy projektu.

## Niepoprawnie

```tsx
// site/src/App.tsx (pasek liczb)
<p>Wdrożone w Nuconic: ~30 inwestycji, 163 testy importu roboczogodzin.</p>
<img src="/screens/nuconic-budget-tracking.png" alt="Budget Tracking w Nuconic" />
<div className="nc-tab-swap">…</div>
```

```text
git commit -m "Zrzuty z Nuconic na podstronę raportu"
```

## Poprawnie

```tsx
// etykieta dowodu z messaging.ts, opis anonimowy, zrzut własnego dema
<p>{pick(MESSAGING.proofLabels.case, lang)}</p>
{/* „Wdrożone w firmie produkcyjno-budowlanej" */}
<img src="/media/tools/raport-zarzadczy.webp" alt="Raport zarządczy: 3 KPI i wykres koszt vs postęp" width={1280} height={800} />
<div className="tab-swap">…</div>
```

```text
git commit -m "Zrzuty dem na podstronę raportu zarządczego"
```

## Test

```bash
# źródła publiczne (0 trafień = PASS)
grep -rniE "nuconic|\bnc-[a-z]|\bNc[A-Z][a-zA-Z]+" site/src site/public site/index.html site/scripts demo ui-kit/skills/company-ui/assets
# build (po `cd site && npm run build`)
grep -rli "nuconic" site/dist
# commit przed wysłaniem
git diff --cached | grep -i "nuconic"
# assety binarne (metadane): 0 trafień
grep -a -il "nuconic" site/public/media/* site/public/*.png site/public/*.ico 2>/dev/null
```

Skrypt: `node .claude/skills/klarow-guardian/scripts/audit-static.mjs` zgłasza `[brand-no-nuconic]`
jako BLOCKER dla każdego trafienia w `site/`, `demo/`, `public/`, `dist/`.

## Wyjątki

Pliki wewnętrzne (`CLAUDE.md`, `docs/**`, `ui-kit/README.md`, `.claude/**`, `leadscout/**` poza
szablonami wysyłanymi na zewnątrz) mogą zawierać nazwę jako kontekst decyzji **dopóki repo
`przeczkowskyy/Pawel_Karol_proj` jest prywatne** (status do potwierdzenia przez Pawła; jeśli repo
jest publiczne, `docs/` przechodzi do osobnego prywatnego repo). Po podpisaniu umowy IP zakres
publikowalny ustala `docs/DECISIONS.md` (wpis z datą i zakresem zgody), a nie ta reguła.
