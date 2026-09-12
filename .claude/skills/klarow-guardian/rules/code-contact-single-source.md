---
id: code-contact-single-source
title: NAP wyłącznie z src/data/contact.ts
impact: HIGH
tags: [contact, nap, seo, data, code]
source: site-audit.md §3.4 p.3 (stałe kontaktowe w 4 miejscach) / strategy.md B5 (NAP identyczne) / synthesis §2.2 stopka (contact.ts), brand-nap BLOCKER / CLAUDE.md sesja cz. 7 (spójność NAP)
added: 2026-09-12
---

## Zasada

Jeden moduł `site/src/data/contact.ts` eksportuje: `ORIGIN = "https://klarow.com"`, `EMAIL = "kontakt@klarow.com"`, `PHONE_DISPLAY = "786 296 426"`, `PHONE_E164 = "+48 786 296 426"` (JSON-LD), `PHONE_HREF = "tel:+48786296426"`, `MAIL_HREF = "mailto:kontakt@klarow.com"`, `AREA = ["PL", "US"]`, `LINKEDIN = { pawel, karol }` (po decyzji D-05), `UODO_ADDRESS` (dla `/rodo`). Konsumują go: `Footer`, `Navbar`, `BookingDialog`, `Seo.tsx` (`ORG_JSONLD`), `prerender/entry.tsx` (shelle, `llms.txt`), `RodoPage`, `pages/Offer`. Literał telefonu, e-maila lub domeny poza `contact.ts` i poza `index.html` (fallback meta, generowany z tych samych wartości w buildzie) jest błędem.

## Mechanizm awarii (dlaczego)

Dziś te same wartości siedzą w 4 miejscach: `BookingModal.tsx:10-12`, `App.tsx:643`, `Seo.tsx:8,75-76`, `prerender/entry.tsx:18-21`. Są spójne, ale każda zmiana (nowy numer, drugi adres, `sameAs` LinkedIn) to cztery edycje, a rozjazd NAP (Name-Address-Phone) między JSON-LD, stopką a `llms.txt` obniża zaufanie Google do danych organizacji i myli LLM-y cytujące `llms.txt`. `/rodo` musi podać administratora i adres UODO w tej samej formie co reszta strony.

## Niepoprawnie

```tsx
// BookingModal.tsx:10-12
export const PHONE_DISPLAY = "786 296 426";
export const PHONE_HREF = "tel:+48786296426";
const MAIL = "kontakt@klarow.com";
// App.tsx:643
const EMAIL = "kontakt@klarow.com";
// Seo.tsx:75-76
email: "kontakt@klarow.com", telephone: "+48 786 296 426",
```

## Poprawnie

```ts
// site/src/data/contact.ts
export const ORIGIN = "https://klarow.com";
export const EMAIL = "kontakt@klarow.com";
export const MAIL_HREF = `mailto:${EMAIL}`;
export const PHONE_DISPLAY = "786 296 426";
export const PHONE_E164 = "+48 786 296 426";
export const PHONE_HREF = "tel:+48786296426";
export const AREA_SERVED = ["PL", "US"] as const;
export const UODO = { name: "Prezes Urzędu Ochrony Danych Osobowych", street: "ul. Stawki 2", city: "00-193 Warszawa" } as const;
```

```tsx
import { EMAIL, MAIL_HREF, PHONE_DISPLAY, PHONE_HREF } from "@/data/contact";
<a href={PHONE_HREF}>{PHONE_DISPLAY}</a> · <a href={MAIL_HREF}>{EMAIL}</a>
```

## Test

```bash
# literały kontaktu poza contact.ts
grep -rnE "786 ?296 ?426|kontakt@klarow\.com|https://klarow\.com" site/src --include=*.ts --include=*.tsx | grep -v "site/src/data/contact.ts"   # oczekiwane: 0
# w dist: dokładnie 3 dopuszczone warianty telefonu i 1 e-mail, żadnych innych
grep -rhoE "\+?48 ?786 ?296 ?426|786 ?296 ?426|kontakt@klarow\.com" site/dist | sort | uniq -c
# DOCELOWO (skrypt planowany, jeszcze nie istnieje — dziś: NIE SPRAWDZANO): node .claude/skills/klarow-guardian/scripts/check-brand.mjs --nap
```

Severity: HIGH (kod). Wariant NAP w `dist` inny niż `786 296 426` / `+48 786 296 426` / `tel:+48786296426` / `kontakt@klarow.com` = BLOCKER (`code-contact-single-source`, bramka `verify-site.mjs`).

## Wyjątki

`site/index.html` (szablon Vite) trzyma `og:url`/canonical jako literały, bo nie importuje TS; `prerender.mjs` i tak je podmienia per trasa. `post-bot/` i `leadscout/` są poza `site/` i mają własne źródło (szablony), które audyt porównuje z `contact.ts` ręcznie.
