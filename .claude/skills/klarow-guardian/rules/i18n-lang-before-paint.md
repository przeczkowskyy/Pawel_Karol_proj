---
id: i18n-lang-before-paint
title: Język z localStorage ustawiany inline-skryptem w <head> przed pierwszym renderem (data-lang + html lang), bez mignięcia PL→EN
impact: HIGH
tags: [i18n, hydration, flicker, prerender, localstorage]
source: RBP:rendering-hydration-no-flicker / vercel.md §9.1, §9.10, §13 (i18n.tsx:16 lang z localStorage decyduje o pierwszym renderze) / synthesis §2.8 p.6 (inline <script> data-lang PRZED pierwszym renderem), a11y-lang / i18n.tsx:16-33
added: 2026-09-12
---

## Zasada

`site/index.html` ma w `<head>`, przed `<link rel="stylesheet">` i przed `<script type="module">`, krótki inline skrypt (ES5, try/catch), który czyta `localStorage["klarow-lang"]` i ustawia `document.documentElement.lang` oraz `document.documentElement.dataset.lang` na `en` lub `pl`. `LangProvider` inicjalizuje stan z `document.documentElement.dataset.lang` (nie z `localStorage` bezpośrednio), a CSS może reagować na `[data-lang="en"]` (np. ukrycie sekcji `lang="en"` shellu, gdy React jeszcze nie wstał, a użytkownik ma EN). Zapis do `localStorage` przy zmianie języka zostaje w efekcie `LangProvider`, klucz z wersją `klarow:lang:v1` (`client-localstorage-schema`), z `try/catch`. Prerenderowany HTML pozostaje PL (kanoniczne); mignięcie PL→EN jest dopuszczalne wyłącznie w treści shellu do czasu montażu Reacta, nigdy w `<html lang>`.

## Mechanizm awarii (dlaczego)

`i18n.tsx:16-24` czyta `localStorage` w inicjalizatorze `useState`, a `document.documentElement.lang` ustawia w `useEffect` (L26-33). Dla użytkownika EN: statyczny shell (PL) → React montuje EN → `lang` zmienia się po efekcie. Skutek: przez ~100–300 ms czytnik ekranu i Google Translate widzą `lang="pl"` z treścią EN, a autokorekta/hyphenation działa według złego języka; przy wolnym JS użytkownik czyta PL, potem wszystko „przeskakuje" (RBP 6.5 HIGH). Ustawienie atrybutu przed paintem kosztuje 0 KB i eliminuje mismatch atrybutu korzenia; treść shellu i tak zostaje podmieniona przez `createRoot().render`.

## Niepoprawnie

```tsx
// i18n.tsx
const [lang, setLang] = useState<Lang>(() => { try { const s = localStorage.getItem("klarow-lang"); if (s === "en" || s === "pl") return s; } catch {} return "pl"; });
useEffect(() => { document.documentElement.lang = lang; }, [lang]);   // po pierwszym renderze
```

## Poprawnie

```html
<!-- site/index.html, w <head> przed arkuszem i modułem; ES5, bez zależności -->
<script>
  (function () {
    var l = "pl";
    try { var s = localStorage.getItem("klarow:lang:v1"); if (s === "en" || s === "pl") l = s; } catch (e) {}
    document.documentElement.lang = l;
    document.documentElement.setAttribute("data-lang", l);
  })();
</script>
```
```tsx
// i18n.tsx
const KEY = "klarow:lang:v1";
const initialLang = (): Lang => (typeof document !== "undefined" && document.documentElement.dataset.lang === "en" ? "en" : "pl");
const [lang, setLang] = useState<Lang>(initialLang);
useEffect(() => { try { localStorage.setItem(KEY, lang); } catch { /* incognito */ } document.documentElement.lang = lang; document.documentElement.dataset.lang = lang; }, [lang]);
```
```css
[data-lang="en"] .shell-pl { display: none; }   /* opcjonalnie: shell bez mignięcia PL dla użytkownika EN */
```

## Test

```bash
grep -nE "data-lang" site/index.html                                    # ≥ 1 (inline w head)
grep -nB2 "data-lang" site/index.html | grep -c "<script>"               # inline <script>, nie module
grep -nE "localStorage\.getItem\(\"klarow-lang\"\)" site/src/i18n.tsx    # 0 (stary klucz bez wersji)
grep -nE "klarow:lang:v1" site/src/i18n.tsx site/index.html              # ≥ 2 (ten sam klucz)
# Playwright: ustaw localStorage en, przeładuj; document.documentElement.lang === "en" PRZED pierwszym paintem (evaluateOnNewDocument + DOMContentLoaded)
# DOCELOWO (skrypt planowany, jeszcze nie istnieje — dziś: NIE SPRAWDZANO): node .claude/skills/klarow-guardian/scripts/check-a11y.mjs --lang-before-paint
```

Severity: HIGH.

## Wyjątki

Prerender (`entry.tsx`) nie zna języka użytkownika: shell zawsze PL + sekcja `lang="en"`; to jest zgodne z regułą do decyzji D-20.
