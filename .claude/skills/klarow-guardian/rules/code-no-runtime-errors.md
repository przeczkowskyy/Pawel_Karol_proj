---
id: code-no-runtime-errors
title: Zero błędów runtime na produkcji: pusty #root nigdy, konsola czysta na każdej trasie, granice błędów wokół tła, mediów i dashboardów
impact: HIGH
tags: [code, runtime, error-boundary, resilience, mobile]
source: CLAUDE.md 2026-07-23 (BgBoundary: awaria WebGL zdejmowała CAŁE drzewo Reacta, zostawała czerń) i 2026-07-24 (canvas tylko na desktopie), 2026-07-22 (stary index.html z cache → assety 404 → samonaprawiający reload) / synthesis §2.7.2 (bramka zrzutów: `pageerror`, pusty `#root`) / scripts/screenshots.mjs
added: 2026-09-12
---

## Zasada

1. Na każdej trasie, w obu viewportach (390 i 1440) i w obu trybach ruchu
   (`prefers-reduced-motion` normal i reduce), po `load` + 1,5 s: **zero** zdarzeń `pageerror`
   i zero `console.error`; `#root` ma dzieci. Pusty `#root` po starcie JS = treść znika
   (biała/czarna strona) i jest traktowany jako BLOCKER, nie jako usterka kosmetyczna.
2. **Każda warstwa ozdobna i każdy ciężki moduł ma własną granicę błędu**: tło (`BgBoundary`
   wokół WebGL/canvasu), media (`MediaBoundary` wokół `<video>`), dashboardy i `pdfmake`
   (granica wokół `React.lazy`). Awaria warstwy zdejmuje TĘ warstwę (fallback: statyczny
   gradient, poster, komunikat z przyciskiem ponów), nigdy drzewo strony.
3. `React.lazy` + `import()` zawsze w parze z `Suspense` i granicą błędu: nieudane pobranie
   chunku po wdrożeniu (stary HTML z cache, nowe hashe) kończy się jednorazowym
   `location.reload()` pod strażą `sessionStorage`, nie pętlą przeładowań.
4. Kod shellu prerenderu nie dotyka `window`/`document` w trakcie renderu
   (`motion-no-motion-in-prerender`); `useEffect` z dostępem do API przeglądarki ma `try/catch`
   tam, gdzie API bywa zablokowane (`localStorage` w trybie prywatnym, WebGL w Lockdown Mode).
5. Błędów nie wycisza się `console.error = () => {}` ani pustym `catch {}` bez fallbacku:
   albo obsługa z widocznym skutkiem, albo komentarz `// świadomie ignorowane: <powód>`.
6. Znalezisko z audytu: pusty `#root` albo wyjątek blokujący treść = BLOCKER (push wstrzymany);
   pojedynczy `console.error` bez utraty treści = HIGH z terminem naprawy.

## Mechanizm awarii (dlaczego)

- Tak wyglądał najdroższy bug w historii tego projektu: wyjątek w tle WebGL nie miał granicy,
  React zdejmował całe drzewo, `#root` był pusty, a telefon pokazywał „samo tło" (CLAUDE.md
  2026-07-23/24). Lokalnie i w Playwright było zielono, bo tam WebGL działa: bez bramki na
  zrzutach z prawdziwego silnika nikt tego nie zobaczy przed klientem.
- Cloudflare Pages buduje z innymi hashami niż build lokalny; urządzenie ze starym HTML w cache
  prosi o nieistniejące chunki (404), `import()` rzuca, a SPA-fallback oddaje HTML zamiast JS.
  Bez jednorazowego reloadu i granicy użytkownik zostaje z pustą stroną na zawsze.
- Konsola pełna błędów maskuje nowe: „to stary błąd, ignorujemy" to początek każdej awarii
  produkcyjnej. Zero tolerancji jest tańsze niż triage.
- Strona jest dowodem produktowym („kalkulator, nie wróżka"): pusty ekran u CFO kosztuje więcej
  niż brak animacji tła. Dlatego fallback zawsze pokazuje treść, a nie ładny komunikat o błędzie.

## Niepoprawnie

```tsx
<GLSLHills />                                  {/* brak granicy: wyjątek zdejmuje całą stronę */}
const Dash = lazy(() => import("./dashboards/" + key));   // dynamiczna ścieżka + brak granicy i Suspense
try { JSON.parse(raw); } catch {}               // cisza bez fallbacku
console.error = () => {};                       // wyciszenie zamiast naprawy
useEffect(() => { document.querySelector("#hero").scrollIntoView(); }, []);  // null w shellu → TypeError
```

## Poprawnie

```tsx
<BgBoundary fallback={<div className="bg-layer" aria-hidden />}>
  <GLSLHills />
</BgBoundary>

<ErrorBoundary fallback={<PanelError onRetry={retry} />}>
  <Suspense fallback={<DashboardSkeleton minHeight={420} />}>
    <Dashboard />          {/* React.lazy(() => import("./dashboards/QualityGate")) — literalna ścieżka */}
  </Suspense>
</ErrorBoundary>
```

```html
<!-- index.html: jednorazowa samonaprawa po zmianie hashy (sessionStorage-guard) -->
<script>
  addEventListener("error", function (e) {
    var t = e.target;
    if (!t || (t.tagName !== "SCRIPT" && t.tagName !== "LINK")) return;
    try { if (sessionStorage.getItem("klarow:reloaded")) return; sessionStorage.setItem("klarow:reloaded", "1"); } catch (_) { return; }
    location.reload();
  }, true);
</script>
```

## Test

```bash
# zrzuty w prawdziwym WebKicie: pageerror / console.error / pusty #root na każdej trasie
node ".claude/skills/klarow-guardian/scripts/screenshots.mjs" --out ".claude/work/audit/shots" | grep -E "code-no-runtime-errors|Σ"
# granice błędów istnieją tam, gdzie są warstwy ozdobne i lazy
grep -rn "GLSLHills\|<video\|lazy(" site/src --include=*.tsx | grep -v "Boundary" | grep -v "Suspense"
# zero wyciszania błędów
grep -rnE "console\.(error|warn)\s*=|catch\s*\(\s*\)\s*\{\s*\}" site/src --include=*.ts --include=*.tsx
```

DevTools na produkcji (mobile + desktop): zakładka Console pusta po twardym odświeżeniu;
`document.getElementById("root").children.length > 0`.

## Wyjątki

Ostrzeżenia (`console.warn`) z React DevTools i z trybu deweloperskiego Vite nie liczą się
(bramka czyta wyłącznie build produkcyjny z `site/dist`). Celowo zgłoszony błąd w teście
granicy (`throw` w komponencie testowym pod flagą `?boom=1`) jest dozwolony poza produkcją.
