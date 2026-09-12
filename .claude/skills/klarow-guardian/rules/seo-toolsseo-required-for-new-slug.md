---
id: seo-toolsseo-required-for-new-slug
title: Nowy slug wchodzi do tools.ts dopiero z pełnym wpisem w toolsSeo.ts: title, description, 4 Q&A, PL i EN
impact: HIGH
tags: [seo, tools, toolsSeo, long-tail, faq, i18n, data]
source: CLAUDE.md sesja cz. 7 (toolsSeo.ts: title ≤ 62, description 130–165, 4 pary Q&A, bramka skryptowa) / synthesis S7 (karty case tylko z pełnymi wpisami toolsSeo), §2.7.3 (delivery/outcome PL+EN; lint danych w verify-site.mjs) / judges conversion-seo (showreel: 3 slugi bez long-tail = thin pages)
added: 2026-09-12
---

## Zasada

Wpis w `BASE` w `src/data/tools.ts` (nowe demo, produkt własny, karta case) jest kompletny tylko razem z: (1) `TOOLS_SEO[slug].pl` i `.en` w `toolsSeo.ts`: `seo.title` ≤ 62 zn., `seo.description` 130–165 zn., dokładnie 4 pary `faq` (pytanie w formie, jaką wpisuje użytkownik; odpowiedź samowystarczalna do zacytowania przez LLM, 2–4 zdania, liczby tylko z `allowedNumbers`); (2) polami `delivery`, `outcome`, `stack`, `year`, `media.thumb`/`media.wide` (istniejące pliki w `public/thumbs`, `public/media/tools`), `kind` (`demo` | `product` | `case`), `hook` w `HOOKS`; (3) dla `case`: `client` jako typ firmy bez nazwy („firma produkcyjno-budowlana"), bez zrzutów i liczb; (4) dashboardem w mapie lazy dla `demo`. Brak którejkolwiek części = trasa nie wchodzi do `prerenderAll()` (a przy brakującym `toolsSeo[slug]` leci fallback, więc błąd jest cichy — dlatego grepy z sekcji Test są dziś jedyną bramką). Bramka skryptowa `verify-site.mjs --data-lint` jest PLANOWANA (F3).

## Mechanizm awarii (dlaczego)

`getTools()` merguje `toolsSeo.ts` po slugu z fallbackami (`t.seo?.title ?? \`${t.name} — działające demo online | Klarow\``): brak wpisu nie psuje buildu, więc podstrona bez long-tailu, bez FAQ i z tagline'em jako description cicho trafia do 19 (21) HTML, sitemapy i `llms.txt`. To „thin page" (sędzia konwersji/SEO odrzucił showreel m.in. za 3 takie slugi): zła description w SERP, brak FAQPage, brak wejść z zapytań long-tail; przy 13 stronach jedna cienka obniża ocenę całej sekcji. Fallback title zawiera em-dash i „demo online" także dla `case`.

## Niepoprawnie

```ts
// tools.ts: nowy wpis
{ id: 14, slug: "zamkniecie-tygodnia", icon: CalendarCheck, category: "kontroling", dept: "kontroling", dashboard: "weekclose", i18n: { pl: {…}, en: {…} } }
// toolsSeo.ts: brak klucza "zamkniecie-tygodnia" → fallbacki, 0 FAQ, title z „—"
```

## Poprawnie

```ts
// tools.ts
{ id: 14, slug: "zamkniecie-tygodnia", icon: CalendarCheck, category: "kontroling", dept: "kontroling", kind: "demo", dashboard: "weekclose",
  delivery: { pl: "pilot 5–10 dni", en: "pilot in 5–10 days" }, outcome: { pl: "Tydzień zamknięty jednym przyciskiem, z backupem i logiem.", en: "…" },
  stack: ["React", "TypeScript"], year: 2026, media: { thumb: "/thumbs/zamkniecie-tygodnia-640.webp", wide: "/media/tools/zamkniecie-tygodnia-1280.webp" },
  i18n: { pl: {…}, en: {…} } },
// toolsSeo.ts
"zamkniecie-tygodnia": { pl: { seo: { title: "Zamknięcie tygodnia jednym przyciskiem: demo | Klarow", description: "…140 zn.…" }, faq: [ {q,a}, {q,a}, {q,a}, {q,a} ] }, en: { … } },
// HOOKS["zamkniecie-tygodnia"] = { pl: "Tydzień zamknięty jednym przyciskiem", en: "Close the week with one click" }
```

## Test

```bash
# każdy slug z tools.ts ma wpis w toolsSeo.ts (PL i EN), 4 FAQ, limity długości, HOOK, media istnieją
# PLANOWANE (F3, verify-site.mjs nie zna tego trybu): node .claude/skills/klarow-guardian/scripts/verify-site.mjs --data-lint
# szybki grep: slugi bez wpisu
for s in $(grep -oE "slug: \"[a-z0-9-]+\"" site/src/data/tools.ts | cut -d'"' -f2); do grep -q "\"$s\": \{" site/src/data/toolsSeo.ts || echo "MISSING toolsSeo: $s"; grep -q "\"$s\": \{" site/src/data/tools.ts || echo "MISSING HOOK: $s"; done
# fallback title z em-dash nie może już istnieć w kodzie
grep -nE "działające demo online \| Klarow" site/src                        # 0 (po usunięciu fallbacku z „—")
```

Severity: HIGH (nowy slug bez kompletu = do naprawy przed merge; trasa nie wchodzi do sitemapy).

## Wyjątki

Brak. Slug „szkic" na gałęzi roboczej może istnieć bez wpisu, ale `npm run check` na `main` go zablokuje.
