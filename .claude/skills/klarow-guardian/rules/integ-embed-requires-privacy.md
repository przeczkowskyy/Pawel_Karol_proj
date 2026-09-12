---
id: integ-embed-requires-privacy
title: Embed lub skrypt zewnętrzny (Cal.com, analityka) wymaga sekcji w /rodo, CSP w _headers i decyzji founderów
impact: HIGH
tags: [integrations, embed, calcom, analytics, rodo, csp, cookies, consent]
source: synthesis §4 D-15 (Cal.com link → embed), D-16 (CF Web Analytics, Zaraz) / synthesis §2.2 („CSP tylko przy embedzie Cal.com") / peer-legal §1.1 (/rodo), §1.4 (PKE: formularze bez domyślnych zgód) / site-audit §7 p.5-6 / docs/plan/domena-serwer-krok-po-kroku.md:102-108,135
added: 2026-09-12
---

## Zasada

Zanim na `klarow.com` pojawi się `<iframe>`, zewnętrzny `<script>` lub widget (Cal.com embed, Cloudflare
Web Analytics, Zaraz, mapa, wideo z obcej domeny), muszą istnieć jednocześnie:
1. decyzja founderów w `docs/DECISIONS.md` (dziś: D-15 rezerwacja, D-16 pomiar),
2. sekcja w `/rodo` (trasa kanoniczna; `/polityka-prywatnosci` = 301) opisująca usługę jako odbiorcę danych:
   cel, zakres (IP, UA, cookies, dane z formularza), transfer poza EOG, podstawa prawna,
3. `Content-Security-Policy` w `site/public/_headers` z dokładnymi hostami (`frame-src`, `script-src`, `connect-src`),
4. wpis w rejestrze ze statusem `aktywna` i wypełnioną kolumną „dane, które wychodzą",
5. jeśli embed zapisuje cookies nieniezbędne: ładowanie dopiero po akcji użytkownika (click-to-load) albo zgoda;
   formularze bez domyślnie zaznaczonych zgód marketingowych (PKE art. 398, peer-legal §1.4).
Faza 1 (decyzja D-15 a): Cal.com jako zwykły LINK zewnętrzny, 0 skryptów, więc `/rodo` opisuje Cal.com
jako usługę, na którą użytkownik przechodzi, a CSP nie jest jeszcze wymagane.

Bramka mechaniczna (`find-integrations.mjs`) egzekwuje to w dwóch miejscach:
- **status `planowana` w rejestrze** = decyzja (1) jeszcze nie zapadła. Każde użycie takiego wpisu
  w kodzie (url, `<script src>`, `<link>`, `<iframe>`, `url()` w CSS, pakiet, ENV, `fetch`) → **HIGH**
  z tym ID reguły. Kolejność jest więc wymuszona: decyzja → `/rodo` → CSP → status `aktywna` → kod.
  Wyjątek: pliki przykładowe (`*.example.json`) niczego nie ładują → INFO.
- **wpis z „wpis w /rodo? = TAK"**, którego host nie występuje w `site/dist/rodo.html` (warunek 2)
  ani w `Content-Security-Policy` w `site/public/_headers` (warunek 3) → **HIGH**. Gdy `dist` nie jest
  zbudowany, dowodu nie da się sprawdzić → MEDIUM z jawnym „zbuduj stronę" (nigdy ciche PASS).

## Mechanizm awarii (dlaczego)

Iframe z `app.cal.com` ładuje się przy otwarciu modala: Cal.com dostaje IP, UA, referrer i zapisuje własne
cookies w kontekście third-party jeszcze zanim użytkownik cokolwiek zarezerwuje; bez informacji na `/rodo`
to naruszenie art. 13 RODO, a cookies nieniezbędne bez zgody to art. 173 Prawa telekomunikacyjnego / PKE.
Cloudflare Web Analytics jest cookieless i nie potrzebuje banera, ale nadal jest odbiorcą danych
technicznych (wpis w `/rodo`). Bez CSP embed może ładować dowolne dalsze zasoby (fonty, trackery Cal.com)
niewidoczne w naszym rejestrze; CSP z listą hostów to jedyna mechaniczna gwarancja, że „zero skryptów
zewnętrznych poza zarejestrowanymi" jest prawdą, a nie deklaracją. Strona bez `/rodo` blokuje też cały
outbound (art. 14: klauzula przy pierwszym kontakcie; precedens Bisnode), więc kolejność „najpierw `/rodo`,
potem analityka i embedy" wynika z prawa, nie z estetyki.

## Niepoprawnie

```tsx
// site/src/components/BookingDialog.tsx — embed od razu w modalu, bez /rodo, bez CSP, bez decyzji
export function BookingDialog() {
  return (
    <dialog open>
      <iframe src="https://app.cal.com/klarow/diagnoza?embed=true" width="100%" height="700" />
    </dialog>
  );
}
```

## Poprawnie

Faza 1 (D-15 a) — link zewnętrzny, zero skryptów; `/rodo` wspomina Cal.com jako usługę zewnętrzną:
```tsx
<a className="btn btn-primary" href="https://cal.com/klarow/diagnoza" target="_blank" rel="noopener noreferrer">
  {pick(t.bookCta, lang)} {/* PL: „Umów 30 minut" / EN: „Book 30 minutes" */}
</a>
```

Faza 2 (D-15 b) — click-to-load, po `/rodo` i CSP:
```tsx
const [loadCal, setLoadCal] = useState(false);
{!loadCal ? (
  <button className="btn btn-primary" onClick={() => setLoadCal(true)}>{pick(t.loadCalendar, lang)}</button>
) : (
  <iframe title="Cal.com" src="https://app.cal.com/klarow/diagnoza?embed=true" loading="lazy" />
)}
```
```text
# site/public/_headers (faza 2)
/*
  Content-Security-Policy: default-src 'self'; script-src 'self' https://app.cal.com https://static.cloudflareinsights.com; frame-src https://app.cal.com; connect-src 'self' https://app.cal.com https://cloudflareinsights.com; img-src 'self' data: https://app.cal.com; style-src 'self' 'unsafe-inline'; font-src 'self'; object-src 'none'; base-uri 'self'
```
`/rodo` (sekcja „Odbiorcy danych"): Cal.com, Inc. (USA) — rezerwacja terminu: imię, e-mail, wybrany termin,
IP/UA i cookies przy załadowaniu kalendarza; podstawa art. 6 ust. 1 lit. b RODO; transfer: SCC.

## Test

```bash
# 1. czy w kodzie/dist jest iframe albo zewnętrzny skrypt?
grep -rnE "<iframe|<script[^>]+src=[\"'](https?:)?//" site/src site/index.html site/dist 2>/dev/null | grep -v "klarow.com"
# 2. jeśli TAK: CSP obecne i wymienia host embedu
grep -n "Content-Security-Policy" site/public/_headers && grep -nE "frame-src[^;]*app\.cal\.com" site/public/_headers
# 3. jeśli TAK: /rodo (prerender) wymienia usługę jako odbiorcę
grep -ciE "cal\.com" site/dist/rodo.html
grep -ciE "cloudflare" site/dist/rodo.html
# 4. decyzja zapisana
grep -nE "D-15|D-16" docs/DECISIONS.md
# 5. rejestr: status aktywna dla calcom / cf-web-analytics dopiero po 1-4.
#    Skaner sam to sprawdza: `planowana` + kod = HIGH; „/rodo = TAK" bez hosta w dist/rodo.html i w CSP = HIGH
node ".claude/skills/klarow-guardian/scripts/find-integrations.mjs" --dist --strict --quiet
# oczekiwane komunikaty, gdy ktoś wyprzedzi procedurę (dosłownie, zweryfikowane 2026-09-12 na kopii repo):
#   site/index.html:3 - HIGH [integ-embed-requires-privacy] … wpis istnieje (cf-web-analytics),
#     ale status `planowana`: brak decyzji founderów / sekcji w /rodo / CSP …
#   site/index.html:3 - HIGH [integ-embed-requires-privacy] … (cf-web-analytics, „wpis w /rodo? = TAK")
#     — host nie występuje w site/dist/rodo.html …; host nie występuje w Content-Security-Policy …
# 6. formularze bez domyślnych zgód (PKE)
grep -rnE "type=\"checkbox\"[^>]*(checked|defaultChecked)" site/src
```

## Wyjątki

Linki wychodzące (`<a href="https://cal.com/…">`, LinkedIn founderów) nie ładują niczego na naszej stronie:
wpis w rejestrze i wzmianka w `/rodo` (Cal.com jako usługa docelowa), bez CSP i bez zgód. Osadzenie
własnych zasobów (`site/public/media/*.webm`, poster) nie jest embedem zewnętrznym.
