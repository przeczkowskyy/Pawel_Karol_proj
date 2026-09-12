---
id: brand-honest-labels
title: Etykiety dowodu (Demo / Własny produkt / Wdrożone) tylko z pokryciem
impact: BLOCKER
tags: [brand, proof, labels, tools, portfolio]
source: synthesis §2.1 proofLabels, §1.7 p.14 / portfolio.md §5 D3, D12 / brand-icp.md §8 / decyzja D-10 (KSeF = Własny produkt)
added: 2026-09-12
---

## Zasada

Każda karta i podstrona w `/narzedzia` ma **dokładnie jedną** etykietę dowodu z
`MESSAGING.proofLabels` odpowiadającą polu `kind` w `tools.ts` (`"demo" | "product" | "case"`)
oraz etykietę czasu `delivery` („pilot 5–10 dni" / „etapami"):

| `kind` | Etykieta PL / EN | Warunek użycia |
|---|---|---|
| `demo` | „Demo na danych przykładowych" / „Demo on sample data" | dashboard działa na żywo, dane fikcyjne, deterministyczne |
| `product` | „Własny produkt" / „Own product" | kod i testy są własnością founderów; brak klienta nie przeszkadza |
| `case` | „Wdrożone w firmie produkcyjno-budowlanej" / „Deployed at a manufacturing & construction company" | wpis w `docs/DECISIONS.md` z datą zgody (umowa IP) **albo** udokumentowany żywy przebieg u klienta Klarow |

Zakazane: „WDROŻONE" bez pokrycia, „Wdrożone u klienta" dla własnego produktu, liczba mnoga
„u klientów" / „klienci" / „our clients" do czasu drugiego płacącego klienta Klarow, „Gotowe" bez
dopowiedzenia (dozwolone: „Gotowe do wdrożenia" przy `product`). KSeF = `product` do pierwszego
klienta lub żywego przebiegu na `api-demo.ksef.mf.gov.pl` (D-10). Etykiety nie są hard-kodowane
w komponentach; jedno źródło = `messaging.ts`.

## Mechanizm awarii (dlaczego)

Pierwsza rozmowa z CFO zaczyna się od „u kogo to wdrożyliście?". Etykieta „WDROŻONE" przy produkcie
bez klienta (dziś KSeF: `ToolsGrid.tsx:38`, `ToolPage.tsx:46`) wysadza wiarygodność wszystkich
pozostałych 12 kart. Liczba mnoga „klienci" przy zerze płatnych klientów to to samo w innej formie.
Odwrotnie: uczciwe „Własny produkt" + „Demo na danych przykładowych" jest spójne z „kalkulator,
nie wróżka" i z zakazem publikowania dowodów poprzedniej firmy przed umową IP.

## Niepoprawnie

```tsx
// ToolPage.tsx
const LABELS = { deployed: "WDROŻONE — realizacja u klienta" };
<span className="st st-blue">{LABELS.deployed}</span>   // KSeF, kind: "case", zero klientów
<p>Narzędzia wdrożone u klientów w Polsce i USA.</p>
```

## Poprawnie

```ts
// tools.ts
{ slug: "kontroling-ksef", kind: "product", delivery: { pl: "etapami", en: "in stages" }, … }
```

```tsx
// ToolCard.tsx
const label = MESSAGING.proofLabels[tool.kind];
<span className={tool.kind === "demo" ? "st" : "st st-accent"}>{pick(label, lang)}</span>
<span className="st">{pick(tool.delivery, lang)}</span>
```

## Test

```bash
# hard-kodowane etykiety poza messaging.ts: 0 trafień
grep -rniE "WDROŻONE|Wdrożone u klient|realizacja u klienta|deployed at (a )?client" site/src --include=*.tsx --include=*.ts | grep -v "data/messaging.ts"
# liczba mnoga klientów: 0 trafień (do 2. klienta)
grep -rniE "u klientów|nasi klienci|naszych klientów|our clients|customers include" site/src site/public/llms.txt 2>/dev/null
# każdy kind: "case" ma wpis w DECISIONS.md
grep -n 'kind: "case"' site/src/data/tools.ts; grep -niE "zgoda|umowa IP" docs/DECISIONS.md
```

## Wyjątki

Zamrożona fraza „klienci w USA" w istniejących opisach podstron (D-07 b) dotyczy poprzedniej firmy,
nie Klarow; zostaje tylko tam, gdzie już jest, do umowy IP. Nowych użyć nie dodajemy.
