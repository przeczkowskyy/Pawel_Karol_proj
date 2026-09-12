---
id: seo-jsonld-per-kind
title: JSON-LD per rodzaj: Organization (+logo, sameAs, areaServed), ItemList na hubie, SoftwareApplication tylko demo, Service dla product/case, FAQPage z pokryciem w DOM
impact: HIGH
tags: [seo, json-ld, schema, geo, faq]
source: site-audit.md §3.4 p.11 (SoftwareApplication price 0 także dla case), §3.6 p.5 (Organization bez logo/sameAs/address), §5 p.4 / synthesis §2.8 p.4, §2.3 podstrona (Service dla product/case), seo-jsonld / Seo.tsx:70-110
added: 2026-09-12
---

## Zasada

Jeden `<script type="application/ld+json" id="seo-jsonld">` per trasa (tablica bloków), generowany z tych samych danych co treść:
- `/`, `/narzedzia`, `/oferta`, `/rodo`: `Organization` z `name`, `url`, `logo` (`/klarow-logo-512.png`), `email`, `telephone` (`PHONE_E164` z `contact.ts`), `areaServed: ["PL","US"]`, `contactPoint`, `sameAs` (LinkedIn founderów po D-05), `description` = `messaging.oneLiner + subtext`.
- `/narzedzia`: dodatkowo `ItemList` z 13 `ListItem` (`position`, `url`, `name`) w kolejności DOM.
- `/narzedzia/<slug>`: `kind: "demo"` → `SoftwareApplication` (`applicationCategory: BusinessApplication`, `operatingSystem: "Web"`, BEZ `offers`; „Demo na danych przykładowych" w `description`); `kind: "product" | "case"` → `Service` (`serviceType`, `provider: Organization`, `areaServed`); zawsze `FAQPage` z 4 Q&A z `toolsSeo.ts`.
- `/faq`: `FAQPage` z `faq.ts` (8 pozycji po dodaniu 2 nowych).
- `404`: brak JSON-LD.
Każde pytanie/odpowiedź w `FAQPage` ma dosłowne pokrycie w DOM strony. Walidacja: Google Rich Results Test na 4 reprezentatywnych trasach (home, hub, demo, KSeF) przed publikacją.

## Mechanizm awarii (dlaczego)

`toolJsonLd()` (`Seo.tsx:83-95`) daje `SoftwareApplication` z `offers.price: "0"` i `operatingSystem: "Windows"` także dla `kontroling-ksef` (`kind: "case"`), czyli deklaruje Google „darmową aplikację Windows", której nie ma; to semantyczny fałsz i ryzyko ręcznej akcji za wprowadzające dane strukturalne. `Organization` bez `logo`/`sameAs` nie kwalifikuje się do panelu wiedzy. `ItemList` na hubie to jedyny sposób, by Google zrozumiał 13 pozycji jako kolekcję (żaden z konkurencyjnych konceptów poza editorial go nie miał). `FAQPage` bez pokrycia w DOM = naruszenie wytycznych Google (poprawka (3) z cz. 7).

## Niepoprawnie

```ts
// Seo.tsx:83-95: to samo dla demo i case
offers: { "@type": "Offer", priceCurrency: "PLN", price: "0", description: "Demo online" }, operatingSystem: "Windows",
```

## Poprawnie

```ts
export function toolJsonLd(t: ToolItem, lang: Lang) {
  const base = { "@context": "https://schema.org", url: `${ORIGIN}/narzedzia/${t.slug}`, name: t.name, description: t.seo?.description ?? t.tagline, provider: ORG_REF };
  if (t.kind === "demo") return { ...base, "@type": "SoftwareApplication", applicationCategory: "BusinessApplication", operatingSystem: "Web" };
  return { ...base, "@type": "Service", serviceType: pick(lang, SERVICE_TYPE[t.category]), areaServed: AREA_SERVED };
}
export const itemListJsonLd = (tools: ToolItem[]) => ({ "@context": "https://schema.org", "@type": "ItemList",
  itemListElement: tools.map((t, i) => ({ "@type": "ListItem", position: i + 1, url: `${ORIGIN}/narzedzia/${t.slug}`, name: t.name })) });
export const ORG_JSONLD = { "@context": "https://schema.org", "@type": "Organization", name: "Klarow", url: ORIGIN, logo: `${ORIGIN}/klarow-logo-512.png`,
  email: EMAIL, telephone: PHONE_E164, areaServed: AREA_SERVED, sameAs: LINKEDIN_URLS, description: `${MESSAGING.oneLiner.pl} ${MESSAGING.subtext.pl}` };
```

## Test

```bash
grep -c "\"@type\":\"ItemList\"" site/dist/narzedzia.html                                     # 1
grep -c "\"price\":\"0\"" site/dist/narzedzia/*.html | grep -v ":0"                            # brak (0 plików z price 0)
grep -l "\"@type\":\"Service\"" site/dist/narzedzia/kontroling-ksef.html                        # 1
grep -l "\"@type\":\"SoftwareApplication\"" site/dist/narzedzia/raport-zarzadczy.html           # 1
grep -oE "\"logo\":\"[^\"]+\"" site/dist/index.html                                              # 1
# pokrycie FAQPage w DOM + walidacja JSON: skrypt parsuje każdy #seo-jsonld, sprawdza JSON.parse i pokrycie tekstu
node .claude/skills/klarow-guardian/scripts/verify-site.mjs                                    # m.in. id="seo-jsonld" dokładnie 1 i JSON-LD, który się parsuje
# PLANOWANE (F3, verify-site.mjs nie zna tego trybu): node .claude/skills/klarow-guardian/scripts/verify-site.mjs --jsonld
```

Severity: HIGH.

## Wyjątki

`ORG_JSONLD` nie ma `address` do czasu decyzji founderów o publicznym adresie JDG (D-05/D-21); `sameAs` pusta tablica jest pomijana, nie renderowana jako `[]`.
