---
id: demo-events-outside-engines
title: Zdarzenia analityczne emitowane w komponentach akcji, nigdy w silnikach lib/* ani w useMemo liczącym wynik; bez danych użytkownika, bez cookies
impact: HIGH
tags: [demo, analytics, privacy, determinism, rodo]
source: synthesis §2.8 p.8 (lista zdarzeń, „poza silnikami dem")/§5.4.11 determ-events-outside · ui-kit-habits Z1 (brak trackerów w narzędziach) · peer-legal (/rodo, zero domyślnych zgód) · integ-* (rejestr integracji)
added: 2026-09-12
---

## Zasada

1. Jedyny punkt wyjścia zdarzeń: `src/lib/track.ts` z funkcją `track(name: EventName, props?: Record<string, string | number | boolean>)`; `EventName` = unia zamknięta: `cta_book_open`, `cta_mail`, `cta_tel`, `cta_worst_excel`, `demo_load_example`, `pdf_download`, `lang_toggle`, `founders_view`, `calc_tranche_run`. Nowe zdarzenie = rozszerzenie unii + wpis w `references/integrations-registry.md` + wpis w `/rodo` (jeśli zmienia zakres przetwarzania).
2. `track()` jest wywoływany WYŁĄCZNIE w handlerach zdarzeń UI (`onClick`, `onSubmit`, `onChange` przycisków/linków/przełączników) w komponentach stron i przycisków (`ClosingCta`, `Navbar`, `PdfButton`, `DashboardActions`, `TrancheCalc` przycisk „Policz”). ZAKAZ w: `src/lib/**` (silniki i `pdf.ts`), `useMemo`/`useEffect` liczących wyniki, wnętrzach dashboardów poza paskiem akcji, `DashboardMount`, `HeroMedia`, prerenderze.
3. **Payload**: tylko nazwy (klucz dema, nazwa dokumentu, `lang`), nigdy treść wklejonego CSV, wartości kwot, nazwy plików użytkownika, e-mail/telefon z formularza, `userAgent`, IP (backend też nie loguje). Zero cookies, zero `localStorage` dla analityki, zero fingerprintingu.
4. **Transport**: Cloudflare Web Analytics (cookieless, snippet w `index.html` po `load`) + zdarzenia przez `navigator.sendBeacon("/api/e", …)` do Pages Function → Workers Analytics Engine (albo Zaraz), z fallbackiem `fetch(..., { keepalive: true })`; `track()` jest no-op w `dev`, w prerenderze i gdy `navigator.doNotTrack === "1"` lub `globalPrivacyControl === true`.
5. **Warunek publikacji**: trasa `/rodo` (klauzula art. 14 + polityka prywatności + prawo sprzeciwu wyróżnione) istnieje i wymienia analitykę cookieless oraz Cal.com jako procesor PRZED włączeniem `track()` na produkcji; formularze bez domyślnie zaznaczonych zgód (PKE).
6. Silniki dem pozostają czystymi funkcjami: `aggregate()`, `auditRows()`, `allocateGrosze()`, `proposalFor()` nie wiedzą o istnieniu analityki; w golden-testach `track` nie jest mockowany, bo nie ma go w grafie importów `lib/`.

## Mechanizm awarii (dlaczego)

- Zdarzenie w `useMemo` liczącym wynik odpala się przy każdym przeliczeniu (także w StrictMode 2×) i wiąże warstwę liczącą z siecią: silnik przestaje być czystą funkcją, golden-testy w Node wywracają się na `navigator`, a „zero sieci w logice" (CLAUDE.md #6) jest złamane.
- Payload z treścią CSV = dane osobowe/tajemnica przedsiębiorstwa klienta w logach dostawcy analityki: zaprzeczenie „dane zostają u Ciebie" i naruszenie RODO (brak podstawy, brak informacji w `/rodo`).
- CF Web Analytics jest cookieless, ale zdarzenia CTA to już przetwarzanie (adres IP w żądaniu): musi być opisane w `/rodo` zanim wejdzie na produkcję (peer-legal).
- Persona (CFO) czyta „narzędzie, które wysyła coś do internetu przy każdym przeliczeniu" jako dyskwalifikację; narzędzia wdrożeniowe chodzą w LAN bez trackerów (ui-kit-habits Z1).

## Niepoprawnie

```ts
// lib/report.ts
export function aggregate(rows) { track("report_computed", { rows: rows.length, firstProject: rows[0]?.project }); … }   // sieć w silniku, dane użytkownika
// DemoReport.tsx
const result = useMemo(() => { const agg = aggregate(parsed.rows); track("demo_result", { csv: csvText }); return agg; }, [csvText]);   // payload z CSV, w useMemo
document.cookie = "klarow_uid=" + Math.random();   // cookie + losowość
```

## Poprawnie

```ts
// src/lib/track.ts
export type EventName = "cta_book_open" | "cta_mail" | "cta_tel" | "cta_worst_excel" | "demo_load_example" | "pdf_download" | "lang_toggle" | "founders_view" | "calc_tranche_run";
type Props = Record<string, string | number | boolean>;
export function track(name: EventName, props: Props = {}): void {
  if (typeof window === "undefined" || import.meta.env.DEV) return;
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
  if (nav.doNotTrack === "1" || nav.globalPrivacyControl === true) return;
  const body = JSON.stringify({ n: name, p: props, r: location.pathname });
  if (!navigator.sendBeacon?.("/api/e", body)) fetch("/api/e", { method: "POST", body, keepalive: true }).catch(() => {});
}
```

```tsx
// DemoReport.tsx: zdarzenie w handlerze akcji, payload = tylko klucz
const loadExample = () => { setCsvText(DEMO_SAMPLE[lang]); setSrcLabel(t.srcExample); track("demo_load_example", { demo: "report", lang }); };
const result = useMemo(() => (csvText === null ? null : aggregate(parseCsv(csvText).rows)), [csvText]);   // czysto
```

## Test

```bash
# track tylko w handlerach komponentów; nigdy w lib, useMemo, useEffect liczących (oczekiwane: 0)
grep -rnE 'track\(' site/src/lib site/src/prerender site/src/components/DashboardMount.tsx site/src/components/HeroMedia.tsx 2>/dev/null
grep -rnE -B3 'track\(' site/src --include=*.tsx | grep -E 'useMemo|useEffect' | grep -v 'onClick'   # = 0
# payload bez danych użytkownika (oczekiwane: 0)
grep -rnE 'track\([^)]*\b(csv|csvText|rows|email|phone|tel|file|fileName|amount|value|userAgent)\b' site/src
# jedna unia nazw; każde użycie w unii
grep -oE 'track\("[a-z_]+"' -r site/src --include=*.tsx | sed -E 's/.*track\("//; s/"//' | sort -u > /tmp/used; grep -oE '"[a-z_]+"' site/src/lib/track.ts | tr -d '"' | sort -u > /tmp/decl; comm -23 /tmp/used /tmp/decl   # = pusto
# cookies/fingerprint (oczekiwane: 0)
grep -rnE 'document\.cookie|fingerprint|canvas\.toDataURL\(\)' site/src
# /rodo istnieje i wymienia analitykę + Cal.com przed włączeniem track na produkcji
[ -f site/dist/rodo.html ] && grep -ciE 'analityk|Cloudflare Web Analytics' site/dist/rodo.html   # ≥ 1
grep -ciE 'prawo sprzeciwu|right to object' site/dist/rodo.html   # ≥ 1
# golden-testy silników działają w Node bez navigator (nie importują track)
grep -rnE 'from "@/lib/track"' site/src/lib   # = 0
```

## Wyjątki

- `lang_toggle` może być emitowany z `Navbar` przy zmianie języka (handler przełącznika), a `founders_view` z `IntersectionObserver` w sekcji S8 (jedyne zdarzenie z observera; `once`, bez payloadu poza `lang`).
