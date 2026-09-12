---
id: a11y-lang
title: Atrybut lang na <html> w każdym statycznym HTML i po przełączeniu języka; fragmenty w drugim języku z własnym lang
impact: HIGH
tags: [a11y, lang, i18n, prerender, screen-reader]
source: WCAG 2.2 §3.1.1 (Language of Page, poziom A) i §3.1.2 (Language of Parts, AA) / WIG „Accessibility" (vercel.md) / synthesis §2.7.2 (bramka verify-site: każdy HTML z lang) / CLAUDE.md (PL kanoniczne, EN przez przełącznik) / mechanizm ustawiania: `i18n-lang-before-paint`
added: 2026-09-12
---

## Zasada

1. **Każdy** statyczny HTML z prerenderu (19 plików: `/`, `/narzedzia`, `/oferta`, `/faq`, `/rodo`,
   `404.html`, 13 × `narzedzia/<slug>.html`) ma `<html lang="pl">` zapisane w szablonie shellu,
   nie dokładane przez JS. Boty, czytniki i tryb czytania dostają język, zanim wstanie React.
2. Po przełączeniu języka `document.documentElement.lang` zmienia się na `en` / `pl` razem
   z treścią (mechanizm i moment ustawienia: `i18n-lang-before-paint`); atrybut nigdy nie
   znika i nigdy nie zostaje `pl` przy treści EN.
3. Wartość to dwuliterowy kod `pl` albo `en` (małe litery), spójnie w `<html lang>`,
   `og:locale` i `llms.txt`; bez mieszania `pl` i `pl-PL` w jednym serwisie.
4. **Fragment w drugim języku ma własny `lang`**: sekcja `lang="en"` w shellu prerenderu,
   angielskie cytaty, etykiety i bloki EN w `llms.txt` osadzone w DOM. Fragment bez `lang`
   czytany jest polską fonetyką.
5. Nazwy własne i kody (`KLAROW`, `KSeF`, `G703`, `ERP`) dostają `translate="no"`, a nie
   podmieniony `lang` (typografia i `translate`: `i18n-pl-typography` §7).
6. `<html lang>` nie jest miejscem na eksperymenty z `hreflang`: trasy `/pl/` `/en/` są
   odroczone (`seo-hreflang-deferred`), więc kanoniczny shell zostaje PL.

## Mechanizm awarii (dlaczego)

- Brak `lang` to naruszenie WCAG 3.1.1 na poziomie A: VoiceOver i NVDA czytają polski tekst
  angielską fonetyką („kontroling" jako angielskie słowo), co dla osoby korzystającej z czytnika
  robi stronę niezrozumiałą. To jedno z niewielu naruszeń, które audytor zewnętrzny wychwytuje
  automatycznie w pierwszej minucie.
- Chrome bez `lang` zgaduje język i podsuwa tłumaczenie strony, które podmienia nazwy własne
  („KSeF" → „National e-Invoice System") i psuje copy, nad którym pracowaliśmy.
- Google używa treści, nie `lang`, do ustalenia języka, ale rozjazd (`lang="en"` przy treści PL)
  jest sygnałem niskiej jakości i psuje dobór wyników w SERP.
- Atrybut ustawiany dopiero przez Reacta nie istnieje dla botów bez JS i dla trybu czytania:
  cały sens prerenderu (19 HTML z pełną treścią) przepada w tym jednym atrybucie.
- Fragment EN bez `lang="en"` w sekcji dla botów brzmi w czytniku jak zniekształcony polski,
  a przy przełączniku EN cała strona zostaje z `lang="pl"` (Language of Parts, AA).

## Niepoprawnie

```html
<html>                                   <!-- brak lang: WCAG 3.1.1 A -->
<html lang="PL">                         <!-- wielkie litery, niespójne z og:locale -->
<section>For English speakers: Klarow builds tools…</section>   <!-- fragment EN bez lang -->
```

```tsx
useEffect(() => { document.documentElement.lang = lang; }, [lang]);   // atrybut dopiero po hydracji; shell bez lang
```

## Poprawnie

```html
<!-- scripts/prerender.mjs: szablon shellu -->
<html lang="pl">
  …
  <section lang="en" class="sr-only">Klarow builds tools for your process. First working result in days.</section>
```

```tsx
// LangProvider: atrybut idzie w parze ze stanem języka (skrypt inline ustawia go przed pierwszym renderem)
useEffect(() => {
  document.documentElement.lang = lang;          // "pl" | "en"
  document.documentElement.dataset.lang = lang;
}, [lang]);
```

## Test

```bash
# każdy statyczny HTML ma lang (oczekiwane: brak wyjścia)
grep -L "<html[^>]*lang=" site/dist/*.html site/dist/narzedzia/*.html
# wartości spoza {pl, en}
grep -rhoE "<html[^>]*lang=\"[^\"]+\"" site/dist --include=*.html | sort -u | grep -vE "lang=\"(pl|en)\""
# fragmenty EN w shellu mają lang="en"
grep -rn "For English" site/src/prerender | grep -v 'lang="en"'
# bramka: verify-site raportuje [a11y-lang] per plik
node ".claude/skills/klarow-guardian/scripts/verify-site.mjs" | grep "a11y-lang"
```

Po przełączeniu języka w przeglądarce: `document.documentElement.lang` == `en`
(DevTools console), a `screenshots.mjs` robi zrzuty obu wersji.

## Wyjątki

Brak. Także `404.html` i strony pomocnicze mają `lang`.
