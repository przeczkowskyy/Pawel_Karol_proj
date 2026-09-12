---
id: copy-faq-single-source
title: FAQ z jednego źródła (faq.ts + toolsSeo.ts): akordeon, FAQPage JSON-LD i prerender czytają te same obiekty; 8 pytań landingu, 4 per narzędzie
impact: HIGH
tags: [copy, faq, geo, json-ld, data, single-source]
source: CLAUDE.md sesja cz. 7 (faq.ts JEDNO źródło; odpowiedzi zawsze w DOM; FAQPage JSON-LD) / strategy.md B9 / synthesis §2.3 /faq (+2: „Czy to tylko Excel?", „Czy AI liczy moje dane?"), seo-faq-in-dom / faq.ts:1-3
added: 2026-09-12
---

## Zasada

`src/data/faq.ts` (`FAQ_I18N: { pl: FaqEntry[]; en: FaqEntry[] }`, `id` stabilne: `cena`, `dane`, `erp`, `makra`, …, `tylko-excel`, `ai-liczy`) jest jedynym źródłem FAQ landingu; `src/data/toolsSeo.ts` jedynym źródłem 4 Q&A per narzędzie. Konsumują je: komponent `FaqList` (akordeon z `aria-controls`, odpowiedzi zawsze w DOM), `faqPageJsonLd()` (JSON-LD FAQPage), `FaqShell`/`ToolShell` w prerenderze, `llms.txt` (link do `/faq`). Ta sama tablica trafia do wszystkich trzech; zakaz kopiowania pytań do komponentu, zakaz FAQ w JSON-LD bez dosłownej obecności w DOM i odwrotnie. Odpowiedź: 2–4 zdania, samowystarczalna do zacytowania przez LLM (nazywa mechanizm, nie „patrz wyżej"), liczby tylko z `allowedNumbers`, zero „—". Pytanie zapisane jako cytat obiekcji klienta jest dozwolone na landingu (wpis `cena`); cudzysłowy PL zostają w treści, a literał TS domykamy apostrofami na zewnątrz — `q: '„Za drogo."'`. Na podstronach pytania w formie wyszukiwania. Nowe pytanie = wpis w `faq.ts` (PL + EN) i nic więcej.

## Mechanizm awarii (dlaczego)

Przed cz. 7 pytania żyły w komponencie, JSON-LD osobno, a warunkowy render odpowiedzi zostawiał FAQPage bez pokrycia (Google: „treść w danych strukturalnych musi być widoczna na stronie"); po naprawie jedno źródło gwarantuje, że akordeon, JSON-LD i shell zawsze mówią to samo. FAQ to główny materiał GEO (LLM-y cytują `FAQPage` i `llms.txt`); rozjazd między DOM a JSON-LD to ryzyko ręcznej akcji. Dwa nowe pytania (D-02, D-04) domykają reframe: „Czy to tylko Excel?" i „Czy AI liczy moje dane?" muszą być w tym samym pliku, inaczej nie trafią do JSON-LD ani do shellu.

## Niepoprawnie

```tsx
// Faq.tsx
const ITEMS = [{ q: "Za drogo.", a: "…" }, …];                       // kopia poza faq.ts
<Seo jsonLd={faqPageJsonLd([{ q: "Czy to bezpieczne?", a: "…" }])} />   // pytanie, którego nie ma w DOM
{open ? <p>{a}</p> : null}                                            // odpowiedź poza DOM
```

## Poprawnie

```ts
// data/faq.ts
export const FAQ_I18N = { pl: [
  { id: "cena", q: '„Za drogo."',        // apostrofy na zewnątrz: cudzysłów PL zamykający jest znakiem " i rozbiłby literał w podwójnych a: "Sprint kosztuje mniej niż dwa miesięczne koszty etatu kontrolera, a eliminuje jego 3–4 dni pracy co miesiąc. Dla porównania: moduł raportowy ERP to zwykle 6+ miesięcy i kwoty od 100 tys. zł. Nie sprzedajemy godzin: sprzedajemy zamknięty rezultat za stałą cenę ustaloną po diagnozie." },
  { id: "tylko-excel", q: "Czy to tylko Excel?", a: "Nie. Excel jest częstym wejściem, nie warunkiem. Budujemy integracje (KSeF, ERP, API), panele webowe i obiegi dokumentów na Twoim serwerze; narzędzia piszące do plików Excel wymagają Windows + Excel." },
  { id: "ai-liczy", q: "Czy AI liczy moje dane?", a: "Nie. Twoje liczby liczy zwykły, deterministyczny kod: te same dane dają ten sam wynik, a ścieżkę wyliczenia widzisz w narzędziu. Żaden model językowy nie dostaje Twoich danych." }   // jedyne dozwolone „AI" w copy sprzedażowym (brand-no-ai-word-in-sales §Wyjątki p. 1): pytanie + zaprzeczenie,
], en: [ /* te same id */ ] };
```
```tsx
const items = pick(lang, FAQ_I18N);
<Seo path="/faq" jsonLd={[faqPageJsonLd(items)]} /> <FaqList items={items} />   // ten sam obiekt
```

## Test

```bash
grep -c "id: \"" site/src/data/faq.ts                                               # 16 (8 PL + 8 EN)
grep -nE "tylko-excel|ai-liczy" site/src/data/faq.ts | wc -l                        # 4
grep -rnE "const (ITEMS|FAQ|QUESTIONS) = \[" site/src/components --include=*.tsx     # 0
# pokrycie: każde name/text z FAQPage JSON-LD występuje dosłownie w tekście DOM tego samego pliku (dist/faq.html + 13 podstron)
# PLANOWANE (F3, verify-site.mjs nie zna tego trybu): node .claude/skills/klarow-guardian/scripts/verify-site.mjs --faq-coverage
grep -c "—" site/src/data/faq.ts                                                     # 0
```

Severity: HIGH.

## Wyjątki

Podstrony narzędzi renderują Q&A jako listę bez akordeonu (zawsze rozwinięte); to spełnia regułę. `llms.txt` nie kopiuje treści FAQ (tylko link), żeby nie dublować.
