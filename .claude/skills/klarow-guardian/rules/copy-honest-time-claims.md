---
id: copy-honest-time-claims
title: Obietnica czasu: „pierwszy działający efekt w dni" + etykieta delivery per realizacja; integracje etapami; nigdy „wdrożenie w dni" globalnie
impact: HIGH
tags: [copy, time, delivery, claims, tools, honesty]
source: strategy.md T5, D3 (delivery_days per karta; plan §5.3/§5.5) / synthesis D-03, §2.1 filar „days" („Pierwszy działający efekt w dni."), §2.7.3 (`delivery: { pl, en }`), §2.3 podstrona (etykieta „Health-Check 48 h → pilot etapami" dla KSeF), brand-proof-labels / plan-strategiczny §5.3, §5.5 (hook prawdziwy tylko dla części katalogu)
added: 2026-09-12
---

## Zasada

1. Obietnica globalna brzmi wyłącznie „Pierwszy działający efekt w dni" (filar 2) i „Działają w dni" w `oneLiner`; zakotwiczona w mechanice Pilotu: dzień 0 zakres zamrożony, dni 1–4 budowa na kopii, dzień 5 pokaz na Twoich danych, odbiór ≤ 10 dni roboczych.
2. Każda karta i podstrona narzędzia ma pole `delivery: { pl, en }` z `tools.ts` renderowane jako chip: dema/proste narzędzia „pilot 5–10 dni"; integracje (KSeF, ERP, API) „etapami" / „Health-Check 48 h → pilot etapami"; obieg dokumentów „pilot + wdrożenie etapami". Chip jest widoczny w hubie, na podstronie i w S3.
3. Zakazane: „wdrożenie w dni" jako obietnica dla całej integracji, „w 5 dni" bez kontekstu pilotu, „natychmiast", „od ręki", „w 24 h" bez źródła w mechanice oferty, „dni nie miesiące" bez dopełnienia o pierwszym efekcie.
4. Liczby czasu poza mechaniką oferty (30 minut, dzień 0/1–4/5, ≤ 10 dni, 48 h Health-Check, 3 dni KSeF) wymagają wpisu w `allowedNumbers`.

## Mechanizm awarii (dlaczego)

Plan §5.3 i §5.5 mówią wprost: hak „w dni" jest prawdziwy dla części katalogu; integracja KSeF to Health-Check, potem etapy. Klient, który przeczytał „wdrożenie w dni" i dostał harmonogram etapami, uzna, że został wprowadzony w błąd przy pierwszej rozmowie (T5: „utrata wiarygodności przy pierwszej integracji"). Etykieta `delivery` per karta pozwala utrzymać mocny hak na home bez fałszu na podstronie; bez pola w danych każdy agent pisze czas z głowy.

## Niepoprawnie

```ts
hero: { pl: "Wdrożenie w dni, nie w miesiące." }                     // globalnie, bez „pierwszy efekt"
tool: { slug: "kontroling-ksef", tagline: { pl: "Integracja z KSeF wdrożona w 5 dni." } }   // integracja „w dni"
card: "Od ręki", "Natychmiastowe wdrożenie"
```

## Poprawnie

```ts
pillars[1]: { pl: "Pierwszy działający efekt w dni.", en: "First working result in days." }
tools: [
  { slug: "raport-zarzadczy", delivery: { pl: "pilot 5–10 dni", en: "pilot in 5–10 days" } },
  { slug: "kontroling-ksef", kind: "product", delivery: { pl: "Health-Check 48 h, potem etapami", en: "48 h health check, then in stages" } },
  { slug: "rejestr-umow", delivery: { pl: "pilot 5–10 dni, wdrożenie etapami", en: "pilot in 5–10 days, rollout in stages" } },
]
steps: [{ pl: "Rozmowa 30 minut" }, { pl: "Zakres zamrożony: dzień 0" }, { pl: "Budowa na kopii: dni 1–4" }, { pl: "Pokaz na Twoich danych: dzień 5" }, { pl: "Odbiór i PROD: do 10 dni" }]
```

## Test

```bash
# każdy wpis tools.ts ma delivery PL+EN (data-lint)
# PLANOWANE (F3, verify-site.mjs nie zna tego trybu): node .claude/skills/klarow-guardian/scripts/verify-site.mjs --data-lint
# zakazane frazy czasu
grep -rniE "wdrożenie w dni|deployed in days|od ręki|natychmiast|w 24 ?h|instantly|overnight" site/src/data site/dist 2>/dev/null | grep -viE "pierwszy działający efekt|first working result"   # 0
# chip delivery w hubie i na podstronach (dist): ≥ 13 wystąpień „pilot" lub „etapami"
grep -oE "pilot 5–10 dni|etapami|Health-Check 48 h" site/dist/narzedzia.html | wc -l                # ≥ 13
grep -c "delivery" site/src/data/tools.ts                                                          # ≥ 13
```

Severity: HIGH.

## Wyjątki

`oneLiner` („Działają w dni") jest zatwierdzonym wyjątkiem D-01, bo H1 stoi obok subtextu i chipów `delivery` w S3; nie wolno go rozszerzać („wdrażamy w dni").
