---
id: copy-cta-labels
title: Etykiety CTA: 1 etykieta na intencję, ≤ 3 słowa, „Umów 30 minut" / „Zobacz realizacje" / „Przyślij najgorszy Excel"; 1 primary na ekran
impact: HIGH
tags: [copy, cta, labels, conversion, messaging]
source: synthesis §2.1 MESSAGING.cta (JEDYNA etykieta intencji), §1.7 p.7 (CTA biały płaski; „Umów 30 minut" w nav, hero, zamknięciu), brand-cta-one-label / taste „No Duplicate CTA Intent" / WIG „Content & Copy" (specific button labels) / strategy.md B4 (CTA = rezerwacja rozmowy 30 min)
added: 2026-09-12
---

## Zasada

Trzy intencje, trzy etykiety, zero wariantów: rozmowa = `MESSAGING.cta.primary` „Umów 30 minut" / „Book 30 minutes" (nav, hero, zamknięcie S9, podstrony, `/oferta`, dialog); dowód = `MESSAGING.cta.secondary` „Zobacz realizacje" / „See our work" (hero ghost, S9 opcjonalnie); plik = `MESSAGING.cta.file` „Przyślij najgorszy Excel" / „Send us your worst spreadsheet" (tylko `/oferta` i podstrony narzędzi jako CTA drugorzędne, `mailto:` z tematem). Każda etykieta ≤ 3 słowa PL (EN ≤ 4), czasownik + obiekt, bez „!" i bez „teraz/dziś/za darmo". **Jedyny zatwierdzony wyjątek od limitu EN: `cta.file.en` „Send us your worst spreadsheet" (5 słów)** — skrócenie gubi adresata („send us"), a etykieta stoi wyłącznie w treści `/oferta` i podstron, nigdy w navbarze (limit jednej linii dotyczy `cta.primary`). Wyjątek jest zamknięty: nowych nie dodajemy, a bramka `--cta-labels` ma go na whiteliście. Na ekranie (viewport) jest dokładnie 1 przycisk `.btn-primary`; pozostałe CTA to `.btn-ghost`/link. Etykiety „Umów bezpłatną diagnozę", „Skontaktuj się", „Dowiedz się więcej", „Kliknij tutaj", „Wyślij", „Zobacz więcej" są zakazane. Stopka: `tel:`/`mailto:` jako linki tekstowe (NAP), nie przyciski. CTA emitują zdarzenie z `track()` (`seo-gsc-and-analytics`).

## Mechanizm awarii (dlaczego)

Dziś strona ma „Umów bezpłatną diagnozę" (`BookingModal.tsx:23`), „Umów diagnozę", telefon jako CTA w hero i navbarze oraz różne warianty na podstronach; ta sama intencja z różnymi słowami rozmywa ścieżkę konwersji i kłóci się z „bezpłatną diagnozą 1-dniową za 3 500 zł" z drabinki (T14: na stronie „bezpłatna rozmowa 30 min" = szczebel 0). Dwa primary na ekranie (CTA + telefon-gradient) obniżają salience białego CTA (S3). „Dowiedz się więcej" nie mówi, co się stanie (WIG: specific labels). Etykieta > 3 słów łamie się na 390 px w navbarze (limit 1 linii, 56 px).

## Niepoprawnie

```ts
nav: "Umów bezpłatną diagnozę"; hero: "Umów diagnozę"; closing: "Skontaktuj się z nami!"; card: "Dowiedz się więcej"; hub: "Zobacz więcej"
```
```tsx
<button className="btn btn-primary">Umów 30 minut</button> <a className="btn btn-primary" href={PHONE_HREF}>786 296 426</a>   {/* 2 primary */}
```

## Poprawnie

```ts
cta: { primary: { pl: "Umów 30 minut", en: "Book 30 minutes" }, secondary: { pl: "Zobacz realizacje", en: "See our work" }, file: { pl: "Przyślij najgorszy Excel", en: "Send us your worst spreadsheet" } }
```
```tsx
<button type="button" className="btn btn-primary" onClick={() => { track("cta_book_open"); onBook(); }}>{pick(lang, MESSAGING.cta.primary)}</button>
<Link className="btn btn-ghost" to="/narzedzia">{pick(lang, MESSAGING.cta.secondary)}</Link>
<a className="btn btn-ghost" href={`${MAIL_HREF}?subject=${encodeURIComponent(t.worstExcelSubject)}`} onClick={() => track("cta_worst_excel")}>{pick(lang, MESSAGING.cta.file)}</a>
```

## Test

```bash
# etykiety CTA w dist = tylko 3 dozwolone (skrypt zbiera tekst .btn-primary/.btn-ghost i porównuje z messaging.cta)
# DOCELOWO (skrypt planowany, jeszcze nie istnieje — dziś: NIE SPRAWDZANO): node .claude/skills/klarow-guardian/scripts/check-copy.mjs --cta-labels   # whitelista długości: cta.file.en = 5 słów (zatwierdzony wyjątek)
grep -rnE "Umów (bezpłatną )?diagnozę|Skontaktuj się|Dowiedz się więcej|Kliknij tutaj|Zobacz więcej|Learn more|Contact us|Get started" site/src/data site/dist 2>/dev/null   # 0
# 1 primary na ekran: liczba .btn-primary w każdej sekcji ≤ 1; w hero dokładnie 1
# DOCELOWO (skrypt planowany, jeszcze nie istnieje — dziś: NIE SPRAWDZANO): node .claude/skills/klarow-guardian/scripts/check-design.mjs --one-primary
grep -oE "class=\"[^\"]*btn-primary" site/dist/index.html | wc -l          # ≤ 3 (nav, hero, S9)
```

Severity: HIGH. Auto-fix dozwolony: podmiana wariantów etykiety na `MESSAGING.cta.*`.

## Wyjątki

Dashboardy (tryb `tool`): przyciski akcji dem („Załaduj przykład", „Pobierz PDF", „Odtwórz") mają własne etykiety ≤ 3 słów; nie są CTA konwersji. Cal.com jako link zewnętrzny: etykieta nadal `cta.primary`.
