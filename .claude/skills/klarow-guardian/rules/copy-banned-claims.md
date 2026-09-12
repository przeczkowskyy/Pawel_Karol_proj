---
id: copy-banned-claims
title: Zakazane twierdzenia: „Deloitte/IDC", „oszczędzimy etat", „wdrożone u klientów" bez pokrycia, „stała cena" jako tag, kwoty per narzędzie, nazwa poprzedniej firmy
impact: BLOCKER
tags: [copy, claims, legal, pricing, proof, brand]
source: peer-legal.md §1.3 (NIE cytować Deloitte/IDC; framing „oszczędzimy etat" zakazany) / CLAUDE.md #3, 2026-07-27 (zero kwot per narzędzie; „wycena po diagnozie", NIE „stała cena" jako tag) / strategy.md B1, B2, T13, §4.4 ZAKAZANE / synthesis brand-proof-labels (liczba mnoga „u klientów" do 2. klienta), brand-pricing, §1.7 p.14
added: 2026-09-12
---

## Zasada

Na stronie, w `llms.txt`, PDF-ach, szablonach outboundu i promptcie bota NIE wolno:
1. Cytować „raportu Deloitte/IDC o czasie traconym w Excelu" ani żadnej liczby bez zweryfikowanego oryginału (`copy-numbers-with-source`).
2. Framować oferty jako odejmowanie etatu: „oszczędzimy wam etat", „nie zatrudniajcie", „zastąpimy kontrolera", „redukcja zatrudnienia". Poprawna forma: „te 121 tys. zł kupuje analizę, a nie sklejanie arkuszy".
3. Pisać „wdrożone u klientów" / „nasi klienci" (liczba mnoga) przed drugim płacącym klientem; „Wdrożone" tylko z dowodem (etykieta `case` z `client` opisanym jako typ firmy); KSeF = „Własny produkt" (D-10).
4. Używać „stała cena" jako tagu/chipa/hero/meta; dozwolone wyłącznie jako wyjaśnienie wewnątrz `/oferta` („wycena po bezpłatnej diagnozie: stała cena za ustalony zakres, bez stawki godzinowej").
5. Podawać kwoty w PLN/USD/EUR za usługi lub narzędzia Klarow (ladder cen z planu §1.4 jest wewnętrzny); kotwice porównawcze z FAQ („mniej niż dwa miesięczne koszty etatu kontrolera", „moduł ERP 6+ miesięcy i od 100 tys. zł") są dozwolone jako porównanie, nie cennik.
6. Wymieniać nazwy poprzedniej firmy, jej klientów, nazwisk pracowników, realnych zrzutów (zasada #3); case = „firma produkcyjno-budowlana".
7. Obiecywać „AI" jako element liczenia ani wymieniać nazw dostawców i narzędzi AI. Regułą nadrzędną jest
   **`brand-no-ai-word-in-sales` (BLOCKER)** — tam jedyny wyjątek (odpowiedź FAQ „Czy AI liczy moje dane?")
   i kanoniczne brzmienie `MESSAGING.determinism`. Doprecyzowania, które obowiązują razem z nią:
   `MESSAGING.bannedWords.pl` zawiera co najmniej „AI liczy", „sztuczna inteligencja analizuje",
   „inteligentna analiza", „AI-powered", „asystent AI"; lista zakazanych nazw obejmuje także narzędzia
   z pipeline'u produkcji materiałów (Higgsfield, Manus), bo w copy brzmią jak dostawca liczenia;
   para ✕/✓ w S7 opisuje konkurencję bez tego słowa: „Wynik z modelu, za każdym razem może wyjść
   inaczej" → „Te same dane, ten sam wynik, co do grosza".
8. Obiecywać „wdrożenie w dni" globalnie dla integracji (`copy-honest-time-claims`).

## Mechanizm awarii (dlaczego)

CFO, który poprosi o źródło „raportu Deloitte", dostaje ciszę i przestaje wierzyć w pozostałe liczby (peer-legal §1.3). Firma ogłaszająca wakat kontrolera właśnie wybrała człowieka; komunikat „oszczędzimy etat" mówi jej, że się pomyliła, i zamyka rozmowę. „Wdrożone u klientów" przy jednym własnym produkcie i zero płacących klientów to twierdzenie nieprawdziwe (sędzia marki odrzucił showreel m.in. za to). „Stała cena" w hero sugeruje cennik, którego nie ma, i kłóci się z „wyceną po diagnozie" (T13). Kwota per narzędzie zamyka rozmowę przed diagnozą i jest sprzeczna z modelem value-based (CLAUDE.md 07-27). Nazwa poprzedniej firmy przed umową IP = ryzyko prawne (plan §5.2).

## Niepoprawnie

```ts
pl: "Według raportu Deloitte firmy tracą 30 % czasu w Excelu. Oszczędzimy Ci jeden etat: raport zarządczy od 4 900 zł, stała cena."
chip: "Stała cena"; badge: "Wdrożone u klientów"; caseTitle: "Wdrożenie w Nuconic"
```

## Poprawnie

```ts
pl: "Nie proponujemy, żeby ten etat zniknął. Proponujemy, żeby te 121 tys. zł rocznie (8 350 × 12 × 1,2048; Sedlak & Sedlak 2026) kupowało analizę, a nie sklejanie arkuszy."
chip: "Wycena po diagnozie"; badge: MESSAGING.proofLabels.product /* „Własny produkt" */; caseClient: { pl: "firma produkcyjno-budowlana, PL/USA" }
ofertaPricing: { pl: "Wyceniamy po bezpłatnej diagnozie. Stała cena za zamrożony zakres, bez stawki godzinowej. Druga rata po działającym odbiorze." }
```

## Test

```bash
grep -rniE "deloitte|\bidc\b" site/src site/dist site/public leadscout/*.md post-bot/worker.js 2>/dev/null   # 0
grep -rniE "oszczędzi(my|sz|cie)? (wam |ci |państwu )?etat|nie zatrudniaj|zastąpi(my)? (kontrolera|księgow)|redukcj[aę] (zatrudnienia|etat)" site/src site/dist leadscout post-bot 2>/dev/null   # 0
grep -rnE "u klientów|naszych klientów|our clients" site/dist 2>/dev/null   # 0 (do 2. klienta)
grep -rnE "\"(Stała cena|Fixed price)\"" site/src/data/*.ts                  # 0 (jako etykieta)
grep -rnoE "[0-9][0-9 .,]*(zł|PLN|USD|\$|€|EUR)" site/dist/*.html site/dist/narzedzia/*.html | grep -vE "narzedzia/(kalkulator-transz|billing-us-g703|obieg-przelewow|kontroling-kosztow|protokoly-robocizny|rejestr-umow|raport-zarzadczy)"   # tylko kotwice FAQ i liczby z listy
grep -rniE "nuconic" site/src site/dist site/public demo 2>/dev/null          # 0
# „AI", LLM i nazwy dostawców poza jedyną dozwoloną odpowiedzią FAQ (reguła nadrzędna: brand-no-ai-word-in-sales)
grep -rnwiE "AI|LLM|GPT|ChatGPT|Claude|Anthropic|OpenAI|Copilot|Higgsfield|Manus|sztuczn(a|ej) inteligencj" site/src/data site/dist 2>/dev/null | grep -viE "Czy AI liczy|Does AI compute|żaden model językowy|no language model"   # 0
grep -rn "determinism" site/src/data/messaging.ts | grep -iw "AI"             # 0 (zdanie o determinizmie bez „AI")
grep -nE "asystent AI|AI assistant" site/src/data/tools.ts                    # 0 (po D-04)
# DOCELOWO (skrypt planowany, jeszcze nie istnieje — dziś: NIE SPRAWDZANO): node .claude/skills/klarow-guardian/scripts/check-brand.mjs --claims
```

Severity: BLOCKER.

## Wyjątki

Kwoty w danych dem (fikcyjne) i w kalkulatorze transz; kotwice porównawcze w FAQ (zatwierdzone w `allowed-numbers.md`). Wewnętrzne dokumenty w `docs/plan/` mogą zawierać ladder cen i nazwę poprzedniej firmy (nie są publikowane), pod warunkiem że repo jest prywatne (luka L1).
