---
id: brand-single-accent-steel
title: Jeden akcent (stal #A8B4C2); semantyka statusów tylko w narzędziach
impact: BLOCKER
tags: [brand, color, accent, chips, charts, tokens]
source: CLAUDE.md #1 / taste §4.2 Color Consistency Lock / company-ui §2 (dyscyplina akcentu) / synthesis §2.1, §2.5.1
added: 2026-09-12
---

## Zasada

Na stronie marketingowej (`data-surface="marketing"`) istnieje **jeden akcent**: stal `#A8B4C2`
dostępna wyłącznie jako token `--accent` (+ `--accent-strong`, `--accent-deep`, tinty
`--accent-a8…a45`). Chipy: tylko `.st` (neutralny) i `.st-accent`. Serie wykresów: monochrom stali
(`--chart-1..3`). Kolory semantyczne `--ok / --warn / --bad / --info` (zieleń, bursztyn, cegła,
niebieski) i klasy `.st-green / .st-brick / .st-blue / .st-violet` **wolno używać tylko wewnątrz
dashboardów** (`components/dashboards/**`, `DemoReport.tsx`, `data-surface="tool"`) i tylko jako
status, walidację albo marker danych; nigdy jako dekorację ani „drugi kolor sekcji".
Biały płaski CTA (`--cta #FAFAFA` / `--on-cta`) jest neutralem, nie drugim akcentem. Czysta biel
`#FFFFFF` wyłącznie jako `--cta-hover`; czysta czerń `#000000` nigdzie.

## Mechanizm awarii (dlaczego)

taste §4.2: „Once an accent color is chosen for a page, it is used on the WHOLE page. A warm-grey site
does not suddenly get a blue CTA in section 7." Badge `st-blue` „WDROŻONE" na hubie i podstronie KSeF
to dziś formalnie drugi akcent na trasie marketingowej (raport taste §3.1). Kit rozdziela warstwę
semantyczną (statusy) od akcentu, bo daltonizm i druk mono wymagają, żeby zieleń zawsze znaczyła
„sukces", a nigdy „ładny kafel". Stal ma 8,9:1 na `#121212`, ale 2,11:1 na bieli: dlatego w motywie
light akcentem tekstu jest `--steel-700` (`#42526E`) i to też rozstrzyga token, nie komponent.

## Niepoprawnie

```tsx
// ToolsGrid.tsx / ToolPage.tsx (trasa marketingowa)
<span className="st st-blue">WDROŻONE</span>
<section className="bg-blue-500/10">…</section>
<h2 style={{ color: "#93c5fd" }}>Kontroling na danych z KSeF</h2>
```

## Poprawnie

```tsx
// marketing: neutral + stal
<span className="st st-accent">{pick(MESSAGING.proofLabels.product, lang)}</span>
<span className="st">{pick(dept.label, lang)}</span>

// dashboard (tryb tool): semantyka statusu = kolor + ikona + tekst
<Status kind="bad" icon={TriangleAlert}>{pick(t.status.error, lang)}</Status>
```

## Test

```bash
# klasy semantyczne poza dashboardami: 0 trafień
grep -rnE "st-(blue|green|brick|violet)" site/src --include=*.tsx | grep -vE "components/dashboards/|DemoReport\.tsx"
# tokeny semantyczne poza dashboardami/kitem: 0 trafień
grep -rnE "var\(--(ok|warn|bad|info|funded|rejected|destructive)[a-z-]*\)" site/src --include=*.tsx --include=*.css | grep -vE "components/dashboards/|DemoReport\.tsx|styles/"
# czysta biel/czerń poza tokenem --cta-hover: 0 trafień
grep -rnE "#(000000|000|ffffff|fff)\b" site/src | grep -v "cta-hover"
```

## Wyjątki

Etykiety dowodu (`demo` / `product` / `case`) różnią się obrysem i wypełnieniem chipa stalowego,
nie kolorem. Kolor semantyczny na stronie marketingowej dopuszczalny tylko w osadzonym dashboardzie
(mini-macierz OK/UWAGA/BŁĄD w komórce bento S2 jest fragmentem silnika `qualityGate.ts`, więc
liczy się jako tryb `tool`).
