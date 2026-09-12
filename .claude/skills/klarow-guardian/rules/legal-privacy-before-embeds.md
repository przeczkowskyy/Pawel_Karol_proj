---
id: legal-privacy-before-embeds
title: Embed (Cal.com, mapa, wideo, widget) wolno włączyć dopiero po sekcji w /rodo, wpisie w rejestrze integracji i CSP w _headers
impact: HIGH
tags: [legal, embed, calcom, rodo, csp, cookies, consent, iframe, privacy]
source: peer-legal.md §1.1 (kolejność: /rodo blokuje wszystko, co wysyła dane), §1.4 (formularze bez domyślnych zgód) / synthesis D-15 (faza 1 link, faza 2 embed), §2.2 („CSP tylko przy embedzie Cal.com"), faza 2 p.12 / rules/integ-embed-requires-privacy.md (bramka techniczna), references/integrations-registry.md (calcom) / docs/plan/domena-serwer-krok-po-kroku.md:102-108
added: 2026-09-12
---

## Zasada

Kolejność jest twarda i nie wolno jej odwracać. Zanim na `klarow.com` pojawi się `<iframe>`, zewnętrzny `<script>` albo widget (Cal.com, mapa, odtwarzacz wideo z obcej domeny, czat, formularz dostawcy), muszą istnieć **wszystkie pięć** elementów:
1. decyzja founderów zapisana w `docs/DECISIONS.md` (dziś: D-15 rezerwacja, D-16 pomiar),
2. **sekcja w `/rodo`** nazywająca usługę z pełnej nazwy podmiotu i kraju, z celem, zakresem danych (adres IP, user agent, referrer, cookies, dane wpisane w widgecie), rolą (odbiorca czy podmiot przetwarzający), podstawą prawną i transferem poza EOG wraz z jego mechanizmem,
3. wpis w `references/integrations-registry.md` ze statusem `aktywna` i wypełnioną kolumną „dane, które wychodzą",
4. `Content-Security-Policy` w `site/public/_headers` z wymienionymi hostami (`frame-src`, `script-src`, `connect-src`, `img-src`),
5. jeśli embed zapisuje cookies nieniezbędne albo profiluje: **click-to-load** (iframe montowany dopiero po kliknięciu użytkownika w zastępczy przycisk) albo zgoda zgodna z `legal-analytics-cookieless-or-consent`.

**Właściciel konta u dostawcy = administrator z `CONTROLLER`** (korekta 2026-09-12), także gdy jest osobą fizyczną bez NIP-u; wpis w kolumnie „właściciel konta" w `references/integrations-registry.md` jest częścią punktu 3.

Do czasu spełnienia wszystkich pięciu obowiązuje faza 1 (D-15 a): Cal.com jako **zwykły link zewnętrzny** `target="_blank" rel="noopener noreferrer"`, zero skryptów, zero ramek; `/rodo` i tak opisuje Cal.com jako usługę, na którą użytkownik przechodzi. Ta reguła pilnuje warstwy prawnej (treść `/rodo`, podstawa, transfer, zgoda); `integ-embed-requires-privacy` pilnuje warstwy technicznej (rejestr, CSP, brak skryptów spoza allowlisty). Obie muszą przejść; w raporcie audytu zgłaszaj tę, której brakuje, a przy obu brakach — wersję prawną.

To wymaganie produktowe, nie opinia prawna; kwalifikacja i treść klauzul do przeglądu radcy (D-21).

## Mechanizm awarii (dlaczego)

Ramka `app.cal.com` wykonuje żądanie w momencie montażu komponentu: Cal.com dostaje adres IP, user agent i referrer oraz zapisuje własne cookies w kontekście third-party, **zanim** użytkownik cokolwiek zarezerwuje i zanim zobaczy jakąkolwiek informację. Bez opisu w `/rodo` to naruszenie obowiązku informacyjnego (art. 13 i 14 RODO), a cookies nieniezbędne bez zgody to naruszenie reżimu telekomunikacyjnego (art. 173 Prawa telekomunikacyjnego, po 10.11.2024 odpowiednik w PKE) — dwa niezależne piętra, jak przy PKE. Sam embed pociąga też zasoby dalsze (fonty, trackery dostawcy), niewidoczne w naszym rejestrze; CSP z jawną listą hostów jest jedyną mechaniczną gwarancją, że deklaracja „zero skryptów zewnętrznych poza zarejestrowanymi" pozostaje prawdziwa po każdej aktualizacji widgetu. Odwrócenie kolejności („najpierw wdrożymy, politykę dopiszemy w piątek") kończy się stanem, w którym strona zbiera dane bez podstawy, a jedyną naprawą jest wyłączenie funkcji, którą już obiecano klientom.

## Niepoprawnie

```tsx
// site/src/components/BookingModal.tsx — embed od razu przy otwarciu modala
export function BookingModal() {
  return (
    <dialog open>
      <iframe src="https://app.cal.com/klarow/diagnoza?embed=true" width="100%" height="700" />
    </dialog>
  );
}
// brak sekcji w /rodo, brak CSP, brak wpisu w rejestrze, cookies third-party przy samym otwarciu
```
```html
<!-- mapa dojazdu „na szybko": Google ustawia cookies i poznaje IP każdego odwiedzającego -->
<iframe src="https://www.google.com/maps/embed?pb=…"></iframe>
```

## Poprawnie

```tsx
// Faza 1 (D-15 a): link zewnętrzny, zero skryptów; /rodo wymienia Cal.com jako usługę docelową
<a className="btn btn-primary" href="https://cal.com/klarow/diagnoza" target="_blank" rel="noopener noreferrer">
  {pick(CTA.book, lang)}
</a>
```
```tsx
// Faza 2 (D-15 b): click-to-load po spełnieniu pięciu warunków
const [loadCal, setLoadCal] = useState(false);
{!loadCal ? (
  <>
    <p>{pick(PRIVACY.calNotice, lang)}</p>   {/* kto dostanie dane i po co, z linkiem do /rodo */}
    <button className="btn btn-primary" onClick={() => setLoadCal(true)}>{pick(CTA.loadCalendar, lang)}</button>
  </>
) : (
  <iframe title="Cal.com" src="https://app.cal.com/klarow/diagnoza?embed=true" loading="lazy" />
)}
```
```text
# site/public/_headers (faza 2)
/*
  Content-Security-Policy: default-src 'self'; script-src 'self' https://app.cal.com https://static.cloudflareinsights.com; frame-src https://app.cal.com; connect-src 'self' https://app.cal.com https://cloudflareinsights.com; img-src 'self' data: https://app.cal.com; style-src 'self' 'unsafe-inline'; font-src 'self'; object-src 'none'; base-uri 'self'
```
`/rodo`, sekcja „Odbiorcy danych": Cal.com, Inc. (USA) — rezerwacja terminu: imię, adres e-mail, wybrany termin, a przy załadowaniu kalendarza także adres IP, user agent i cookies Cal.com; podstawa art. 6 ust. 1 lit. b RODO; transfer do USA na standardowych klauzulach umownych.

## Test

```bash
# 1. czy w kodzie albo w buildzie jest ramka lub skrypt spoza własnej domeny?
grep -rnE "<iframe|<script[^>]+src=\"(https?:)?//" site/src site/index.html site/dist 2>/dev/null | grep -v "klarow.com"
# 2. jeśli TAK — host musi być opisany w /rodo (przykład: cal.com)
grep -ci "cal.com" site/dist/rodo.html                                           # >= 1
# 3. CSP obecne i wymienia host ramki
grep -n "Content-Security-Policy" site/public/_headers && grep -nE "frame-src[^;]*app.cal.com" site/public/_headers
# 4. decyzja zapisana
grep -nE "D-15|D-16" docs/DECISIONS.md
# 5. rejestr integracji: status aktywna dopiero po 1-4
node ".claude/skills/klarow-guardian/scripts/find-integrations.mjs" --dist --strict --quiet
# 6. click-to-load: iframe nie może montować się bez akcji użytkownika
grep -rnE "<iframe" site/src | grep -v "loadCal|useState"                        # ręczna weryfikacja każdego trafienia
# 7. linki wychodzące bezpieczne
grep -rnE "target=\"_blank\"" site/src | grep -v "rel=\"noopener" | head         # 0
```

## Wyjątki

Linki wychodzące (`<a href="https://cal.com/…">`, profile LinkedIn founderów) nie ładują niczego na naszej stronie: wystarczy wpis w rejestrze i wzmianka w `/rodo` (usługa docelowa), bez CSP i bez zgody. Osadzenie własnych zasobów (`site/public/media/*.webm`, poster, fonty z `public/fonts`) nie jest embedem zewnętrznym. `mailto:` i `tel:` otwierają aplikację użytkownika i nie wysyłają niczego ze strony, ale jako kanały kontaktu mają sekcję w `/rodo`.
