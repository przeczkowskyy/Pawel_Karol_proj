---
id: seo-pageseo-single-source
title: pagesSeo.ts / toolsSeo.ts = jedyne źródło title i description; title ≤ 60 (narzędzia ≤ 62), description 130–165, PL + EN
impact: HIGH
tags: [seo, meta, title, description, i18n, prerender]
source: pagesSeo.ts:1-8 (komentarz z limitami) / CLAUDE.md sesja cz. 7 poprawka (4) (title 71→60, description 210→160) / site-audit.md §5 p.6 / synthesis §2.8 p.3 (nowe meta bez „wyrosłych na Excelu"; index.html fallback = pagesSeo.home), seo-meta-single-source
added: 2026-09-12
---

## Zasada

Title i description każdej trasy żyją w jednym miejscu: `src/data/pagesSeo.ts` (`home`, `tools`, `oferta`, `faq`, `rodo`, `notFound`) i `src/data/toolsSeo.ts` (13 slugów), oba jako `{ pl, en }`. Konsumują je klientowy `<Seo>` i `prerenderAll()`; wartości w `dist/*.html` i po starcie Reacta są identyczne co do znaku. Limity twarde: title ≤ 60 znaków (narzędzia ≤ 62), description 130–165 znaków, w OBU językach; zero „—" (em-dash) w meta (`i18n-pl-typography`); nazwa marki w title jako „Klarow" (nie wordmark caps). `site/index.html` (szablon i fallback dla nieznanych tras) ma title/description/og równe `pagesSeo.home.pl`; rozjazd = błąd. Zmiana title/description = edycja jednego pliku + rebuild; nigdy literał w komponencie.

## Mechanizm awarii (dlaczego)

Google ucina title po ~55–60 znakach i description po ~155–165: hak „Wdrożenie w dni" wypadał z 71-znakowego title (poprawka cz. 7). Dwa źródła (klient vs prerender) dawały już inne brzmienie leadu hero; przy meta to samo ryzyko plus rozjazd między snippetem Google (z HTML) a tytułem karty po nawigacji SPA. `index.html` dziś mówi „12 działających demo" i „wyrosłych na Excelu" (`index.html:7-18`), czyli inny przekaz niż `pagesSeo.home` po reframe. Brak `rodo` w `Record<"home"|"tools"|"oferta"|"faq", PageSeo>` = błąd typów przy dodaniu trasy, co jest dobrą bramką, o ile nikt nie rozluźni typu do `Record<string, …>`.

## Niepoprawnie

```tsx
<Seo title="Klarow — automatyzacja danych i kontroling. Wdrożenie w dni, nie w miesiące." description={…} />   // literał, 71 zn., em-dash
```
```ts
export const PAGES_SEO: Record<string, PageSeo> = { … };   // typ rozluźniony: brak bramki na nową trasę
```

## Poprawnie

```ts
// src/data/pagesSeo.ts
export type PageKey = "home" | "tools" | "oferta" | "faq" | "rodo" | "notFound";
export const PAGES_SEO: Record<PageKey, PageSeo> = {
  home: {
    title: { pl: "Klarow: narzędzia pod Twój proces. Działają w dni.", en: "Klarow: tools built around your process. Working in days." },
    // description zawiera DOSŁOWNIE MESSAGING.oneLiner (copy-one-liner-single-source) i NIE rozszerza obietnicy czasu (copy-honest-time-claims: nigdy „wdrażamy w dni")
    description: { pl: "Narzędzia pod Twój proces. Działają w dni, dane zostają u Ciebie. Kontroling, integracje (KSeF), importy z ERP, obieg dokumentów, panele. 12 dem na żywo." /* 153 zn. */, en: "Tools built around your process. Working in days, your data stays with you. Controlling, KSeF, ERP imports, document flow, dashboards. 12 live demos." /* 149 zn. */ },
  },
  rodo: { title: { pl: "RODO i prywatność: skąd mamy Twoje dane i jak je usunąć", en: "GDPR and privacy: where your data comes from and how to remove it" }, description: { pl: "…130–165 zn.…", en: "…" } },
  // …
};
```
```tsx
<Seo title={pick(lang, PAGES_SEO.home.title)} description={pick(lang, PAGES_SEO.home.description)} path="/" jsonLd={ORG} />
```

## Test

```bash
# limity długości PL/EN (skrypt liczy znaki po NFC, bez tagów)
# DOCELOWO (skrypt planowany, jeszcze nie istnieje — dziś: NIE SPRAWDZANO): node .claude/skills/klarow-guardian/scripts/check-copy.mjs --meta-limits
# literały title/description w komponentach
grep -rnE "<Seo[^>]*title=\"" site/src --include=*.tsx                          # 0
# index.html fallback = pagesSeo.home.pl (skrypt porównuje po buildzie)
node .claude/skills/klarow-guardian/scripts/verify-site.mjs                                    # m.in. title ≤ 60 zn. i description 130–165 zn. per plik
# PLANOWANE (F3, verify-site.mjs nie zna tego trybu): node .claude/skills/klarow-guardian/scripts/verify-site.mjs --meta-fallback
# em-dash w meta
grep -nE "—" site/src/data/pagesSeo.ts site/src/data/toolsSeo.ts                # 0 (po sweepie)
# zakazana obietnica globalna w meta (copy-honest-time-claims: wolno „Działają w dni" / „pierwszy działający efekt w dni")
grep -nE "wdrażamy w dni|wdrożenie w dni" site/src/data/pagesSeo.ts site/src/data/toolsSeo.ts   # 0
# description nie jest przycinana w kodzie (copy-one-liner-single-source)
grep -nE "\.slice\(0, ?1[0-9][0-9]\)" site/src/data/pagesSeo.ts               # 0
grep -nE "Record<PageKey" site/src/data/pagesSeo.ts                             # 1
```

Severity: HIGH.

## Wyjątki

`404` ma title/description w `pagesSeo.notFound`, ale nie ma `og:*` ani canonical (noindex). EN meta jest niewidoczne dla Google do czasu tras `/en/` (`seo-hreflang-deferred`), ale limity obowiązują już teraz (boty bez JS czytają sekcję EN).
