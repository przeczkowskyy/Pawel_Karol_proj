---
id: seo-gsc-and-analytics
title: Search Console + Cloudflare Web Analytics (cookieless) + zdarzenia CTA poza silnikami dem; zero GA4 bez banera
impact: MEDIUM
tags: [seo, analytics, gsc, cloudflare, events, privacy, determinism]
source: strategy.md §7 (zero pomiaru dziś; KPI 90 dni; instrumentacja 1–7), D11 / synthesis D-16, §2.8 p.8 (zdarzenia cta_book_open, cta_mail, cta_tel, cta_worst_excel, demo_load_example, pdf_download, lang_toggle, founders_view, calc_tranche_run), L3 / CLAUDE.md „Do zrobienia" (GSC)
added: 2026-09-12
---

## Zasada

1. Google Search Console: property domenowa `klarow.com` (rekord TXT w Cloudflare DNS) lub plik weryfikacji `public/google<token>.html`; `sitemap.xml` zgłoszony. Wpis w `references/integrations-registry.md`.
2. Pomiar odsłon i Core Web Vitals: Cloudflare Web Analytics (cookieless, bez banera) jako jeden `<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token":"…"}'>` w `index.html` (obowiązuje we wszystkich 19 HTML, bo szablon jest wspólny), ładowany `defer`, po treści; token nie jest sekretem, ale wpis w rejestrze integracji i w `/rodo` jest obowiązkowy.
3. Zdarzenia CTA: Cloudflare Zaraz (`zaraz.track("cta_book_open")`) albo własny endpoint `functions/api/e.ts` (Pages Function → Workers Analytics Engine); bez cookies, bez PII, bez identyfikatora użytkownika. Nazwy zdarzeń ze stałej listy w `src/lib/track.ts` (`cta_book_open`, `cta_mail`, `cta_tel`, `cta_worst_excel`, `demo_load_example`, `pdf_download`, `lang_toggle`, `founders_view`, `calc_tranche_run`); wywołania TYLKO w handlerach UI (przyciski, linki), NIGDY w `lib/**`, `dashboards/**`, `DemoReport.tsx` ani w silnikach (determinizm, T8).
4. GA4/Hotjar/Meta Pixel: zakaz bez decyzji founderów; wymagałyby banera zgody i wpisu w `/rodo` (`legal-analytics-cookieless-or-consent`).
5. UTM w kanałach (LinkedIn profil/wiadomość, mail, QR `/start`, posty bota) zamiast fingerprintingu.
6. `track()` jest no-op, gdy `navigator.doNotTrack === "1"` lub brak zgody tam, gdzie zgoda jest wymagana.

## Mechanizm awarii (dlaczego)

Dziś strona nie ma żadnego pomiaru (`strategy.md` §7.1: 0 trafień beaconu, brak GSC, brak UTM): nie wiadomo, czy 17 tras jest zaindeksowanych, ile wejść daje LinkedIn, ile osób klika `mailto:`. Bez GSC nie da się ocenić efektów SEO (CLAUDE.md „po ~tygodniu ocena efektów"). Zdarzenie wysłane z wnętrza silnika (`aggregate()` w `lib/report.ts`) wprowadza sieć do kodu, który ma być deterministyczny i offline („zero chmury dostawcy" dotyczy dem tak samo jak narzędzi u klienta). GA4 bez banera to naruszenie art. 173 PT / PKE i RODO; Cloudflare Web Analytics nie stawia cookies i nie profiluje, więc banera nie wymaga (nadal: wpis w `/rodo`).

## Niepoprawnie

```ts
// lib/report.ts
export function aggregate(rows) { fetch("/api/e?ev=report_run"); /* … */ }      // sieć w silniku
```
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXX"></script>   <!-- GA4 bez banera i wpisu w /rodo -->
```

## Poprawnie

```ts
// src/lib/track.ts (UI-only; import zakazany w lib/** i dashboards/**)
export const EVENTS = ["cta_book_open", "cta_mail", "cta_tel", "cta_worst_excel", "demo_load_example", "pdf_download", "lang_toggle", "founders_view", "calc_tranche_run"] as const;
export type EventName = (typeof EVENTS)[number];
export function track(name: EventName, props?: Record<string, string | number>) {
  if (typeof window === "undefined" || navigator.doNotTrack === "1") return;
  window.zaraz?.track?.(name, props);   // albo navigator.sendBeacon("/api/e", JSON.stringify({ name, props }))
}
```
```tsx
<button type="button" className="btn btn-primary" onClick={() => { track("cta_book_open"); onBook(); }}>{pick(lang, MESSAGING.cta.primary)}</button>
```

## Test

```bash
grep -rnE "track\(|zaraz|sendBeacon|fetch\(" site/src/lib site/src/components/dashboards site/src/components/DemoReport.tsx | grep -v "site/src/lib/track.ts"   # 0
grep -rnE "googletagmanager|gtag\(|hotjar|facebook\.net|clarity\.ms" site/src site/index.html site/dist 2>/dev/null   # 0
grep -c "static.cloudflareinsights.com" site/index.html                                          # 1 (po D-16)
ls site/public/google*.html 2>/dev/null | wc -l                                                  # 1 (albo TXT w DNS: wpis w rejestrze)
grep -nE "Cloudflare Web Analytics|Search Console" .claude/skills/klarow-guardian/references/integrations-registry.md   # ≥ 2
```

Severity: MEDIUM (brak pomiaru = raport); zdarzenie w silniku lub GA4 bez banera = BLOCKER (`demo-*` / `legal-*`).

## Wyjątki

Do czasu `/rodo` (blokuje zdarzenia przez Zaraz/Function, nie CF Web Analytics) `track()` może być no-opem z komentarzem `/* D-16: aktywacja po /rodo */`.
