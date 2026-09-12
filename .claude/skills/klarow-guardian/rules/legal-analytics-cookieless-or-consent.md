---
id: legal-analytics-cookieless-or-consent
title: Pomiar tylko cookieless i bez identyfikatorów albo z uprzednią zgodą; zero GA4, pikseli i fingerprintingu, zawsze wpis w /rodo
impact: HIGH
tags: [legal, analytics, cookies, consent, privacy, cloudflare, rodo]
source: peer-legal.md §1.1 (kolejność: najpierw /rodo, potem pomiar) / synthesis D-16 (CF Web Analytics + GSC + zdarzenia przez Zaraz albo Pages Function), §2.8 p.8 (lista zdarzeń) / rules/seo-gsc-and-analytics.md (warstwa techniczna), rules/integ-embed-requires-privacy.md / references/integrations-registry.md (cf-web-analytics, cf-zaraz)
added: 2026-09-12
---

## Zasada

Pomiar na `klarow.com` istnieje w dokładnie jednym z dwóch wariantów i nigdy pomiędzy:
1. **Cookieless bez identyfikatora** (wariant przyjęty, D-16): Cloudflare Web Analytics, ewentualnie zdarzenia CTA przez Zaraz albo własny endpoint Pages Function. Warunki: zero cookies, zero `localStorage`/`sessionStorage`/IndexedDB w celu pomiaru, zero identyfikatora użytkownika (także pseudonimowego i wyliczanego z IP+UA), zero fingerprintingu (canvas, fonty, `navigator.plugins`), zero przekazywania treści formularzy. Baner zgody nie jest wtedy potrzebny, ale **sekcja w `/rodo` jest obowiązkowa** (odbiorca danych, cel, zakres, brak cookies, transfer).
2. **Z uprzednią zgodą**: cokolwiek, co zapisuje lub odczytuje informacje na urządzeniu użytkownika w celu innym niż niezbędny (GA4, Hotjar, Clarity, Meta Pixel, LinkedIn Insight Tag, remarketing). Wymaga: decyzji founderów, wpisu w `references/integrations-registry.md` i w `/rodo`, banera z odrzuceniem równie łatwym jak akceptacja, brakiem domyślnych zaznaczeń, brakiem cookie-walla i **blokadą ładowania skryptu do czasu zgody**. Do czasu takiej decyzji te narzędzia są zakazane (`integ-no-external-scripts-on-site`).

Dodatkowo: `klarow-lang` w `localStorage` to preferencja ustawiana świadomym działaniem użytkownika (przełącznik PL/EN) — pamięć niezbędna, bez zgody, ale nie wolno jej użyć jako identyfikatora ani wysłać do pomiaru. Zdarzenia CTA mają stałą listę nazw (`src/lib/track.ts`), nie niosą PII ani treści wpisanych przez użytkownika, są emitowane wyłącznie w handlerach UI i nigdy w silnikach dem (`demo-events-outside-engines`, `demo-determinism`). `track()` jest no-op przy `navigator.doNotTrack === "1"` i w trybie bez zgody tam, gdzie zgoda jest wymagana. Kolejność wdrożenia jest twarda: `/rodo` → wpis w rejestrze → beacon.

To wymaganie produktowe, nie opinia prawna; kwalifikacja i treść klauzul do przeglądu radcy (D-21).

## Mechanizm awarii (dlaczego)

Zapis lub odczyt informacji na urządzeniu końcowym w celu innym niż niezbędny wymaga uprzedniej zgody (art. 173 Prawa telekomunikacyjnego, po 10.11.2024 odpowiednik w Prawie komunikacji elektronicznej) — to reżim niezależny od RODO, ten sam podział pięter co przy `legal-pke-consent-forms`. GA4 stawia cookies `_ga` przy pierwszym żądaniu, jeszcze zanim baner się wyrenderuje, więc „baner po załadowaniu skryptu" nie naprawia niczego; dodatkowo przesyła dane do USA, co wymaga opisu transferu w `/rodo`. Cloudflare Web Analytics nie stawia cookies i nie profiluje, dlatego mieści się w wariancie 1 — ale Cloudflare pozostaje odbiorcą danych technicznych, więc pominięcie go w `/rodo` to naruszenie obowiązku informacyjnego, nie kwestia stylu. Fingerprinting bez cookies bywa przedstawiany jako „prywatny"; prawnie jest gorszy od cookie, bo użytkownik nie może go wyczyścić. Wreszcie: marka stoi na „prawdziwie zero chmury"; strona, która sama wysyła zachowanie odwiedzających do zewnętrznego profilera, obala własną tezę szybciej niż jakikolwiek konkurent.

## Niepoprawnie

```html
<!-- site/index.html: GA4 bez zgody, bez wpisu w /rodo, bez decyzji; cookies ustawiane natychmiast -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag("js",new Date());gtag("config","G-XXXXXXX")</script>
```
```ts
// pseudonimowy identyfikator = dane osobowe i zapis na urządzeniu bez zgody
const vid = localStorage.getItem("vid") ?? crypto.randomUUID();
localStorage.setItem("vid", vid);
fetch(`/api/e?ev=view&vid=${vid}&q=${encodeURIComponent(input.value)}`);   // do tego treść wpisana przez użytkownika
```

## Poprawnie

```html
<!-- site/index.html (szablon wszystkich 19 HTML): cookieless, defer, po treści; wpis w /rodo i w rejestrze integracji -->
<script defer src="https://static.cloudflareinsights.com/beacon.min.js"
        data-cf-beacon='{"token":"<token publiczny>"}'></script>
```
```ts
// site/src/lib/track.ts — stała lista nazw, zero PII, no-op przy DNT
const EVENTS = ["cta_book_open","cta_mail","cta_tel","cta_worst_excel","demo_load_example","pdf_download","lang_toggle","founders_view","calc_tranche_run"] as const;
export function track(ev: (typeof EVENTS)[number]) {
  if (typeof navigator !== "undefined" && navigator.doNotTrack === "1") return;
  window.zaraz?.track(ev);                       // bez cookies, bez identyfikatora, bez parametrów użytkownika
}
```
```tsx
// wywołanie tylko w handlerze UI, nigdy w lib/** ani w dashboards/**
<button onClick={() => { track("cta_book_open"); openBooking(); }}>{pick(CTA.book, lang)}</button>
```
`/rodo`, sekcja „Odbiorcy danych": Cloudflare, Inc. — hosting i pomiar odsłon bez cookies (adres IP, user agent, adres strony, wskaźniki Core Web Vitals); podstawa art. 6 ust. 1 lit. f RODO; transfer do USA na standardowych klauzulach umownych.

## Test

```bash
# 1. zakazane narzędzia pomiaru w kodzie i w buildzie
grep -rniE "googletagmanager|gtag\(|google-analytics|hotjar|clarity\.ms|connect\.facebook|fbq\(|snap\.licdn|matomo|plausible" site/src site/index.html site/dist   # 0
# 2. zero cookies i zero identyfikatorów pomiarowych
grep -rn "document.cookie" site/src                                                    # 0
grep -rnE "localStorage\.(set|get)Item\(" site/src | grep -viE "klarow-lang|klarow:"    # 0
grep -rniE "crypto.randomUUID|fingerprint|canvas.toDataURL" site/src                    # 0
# 3. jeśli beacon istnieje: defer + wpis w /rodo + wpis w rejestrze
grep -n "cloudflareinsights" site/index.html && grep -n "defer" site/index.html
grep -ci "cloudflare" site/dist/rodo.html                                               # >= 1
grep -n "cf-web-analytics" .claude/skills/klarow-guardian/references/integrations-registry.md
# 4. zdarzenia wyłącznie w UI, nigdy w silnikach
grep -rn "track(" site/src/lib site/src/components/dashboards site/src/components/DemoReport.tsx   # 0
# 5. skaner integracji (nowe hosty w dist)
node ".claude/skills/klarow-guardian/scripts/find-integrations.mjs" --dist --strict --quiet
```

## Wyjątki

Google Search Console (weryfikacja właściciela rekordem TXT albo plikiem w `public/`) nie ładuje żadnego skryptu u odwiedzającego i nie wymaga zgody ani banera; wpis w rejestrze integracji jest i tak wymagany. Logi brzegowe Cloudflare powstają po stronie hostingu niezależnie od strony (wariant 1 ich nie zwiększa), ale muszą być opisane w `/rodo` jako dane techniczne hostingu. Pomiar w narzędziach wdrażanych u klienta on-premise podlega decyzji klienta, nie tej regule — z zastrzeżeniem `integ-no-llm-api-in-client-tools`.
