---
id: legal-pke-consent-forms
title: Art. 398 PKE — uprzednia zgoda na informację handlową także wobec osób prawnych; zero domyślnie zaznaczonych zgód, newsletter tylko double opt-in
impact: BLOCKER
tags: [legal, pke, consent, forms, outbound, newsletter, uke, inbound]
source: peer-legal.md §1.4 (art. 398 PKE od 10.11.2024; WSA II SA/Wa 62/25 z 8.08.2025; sankcja UKE 3 % przychodu albo 1 mln zł — wyższa; Tani Opał sp. z o.o. 500 tys. zł) / peer-legal.md „Uzgodnienie między oknami" (ograniczenia copy do reguł strażnika) / synthesis D-21, faza 2 p.7 (formularz PKE: Pages Function + Turnstile + Resend) / CLAUDE.md „hak: przyślij nam swój najgorszy Excel"
added: 2026-09-12
---

## Zasada

1. **Uprzednia zgoda przed informacją handlową.** Art. 398 Prawa komunikacji elektronicznej (obowiązuje od 10.11.2024) zakazuje wysyłania informacji handlowej środkami komunikacji elektronicznej bez zgody odbiorcy — **także wobec osób prawnych**, w tym na adresy `biuro@`, `kontakt@`, `rekrutacja@`, i także przy marketingu bezpośrednim przez telefon. **Soft opt-in w Polsce nie istnieje** (art. 13 ust. 2 dyrektywy e-Privacy nigdy nie został transponowany), więc „klient już z nami rozmawiał" nie jest podstawą.
2. **Dwa niezależne piętra.** Uzasadniony interes z art. 6 ust. 1 lit. f RODO **nie zastępuje** zgody z PKE (WSA, II SA/Wa 62/25, wyrok z 8.08.2025). Zgodność z RODO (`legal-rodo-page-required`) jest warunkiem koniecznym, nie wystarczającym.
3. **Konsekwencja dla UI:** żaden formularz, przycisk ani modal na `klarow.com` nie może sugerować, że wysłanie wiadomości albo zapis „przy okazji" oznacza zgodę marketingową. Checkboxy zgód: **zero `checked` / `defaultChecked`**, zgoda oddzielona od treści przycisku, osobna zgoda na każdy kanał (mail, telefon), pełna treść zgody widoczna bez rozwijania, wersja zgody zapisana z datą.
4. **Inbound jest bezpieczny.** Formularz i hak „Przyślij nam swój najgorszy Excel", `mailto:`, `tel:` i rezerwacja terminu to kontakt zainicjowany przez użytkownika: art. 398 ust. 2 (udostępnienie adresu **w celu** otrzymania informacji). Warunek: formularz nie dokłada domyślnie zgody na newsletter ani na „informacje o nowościach".
5. **Newsletter = double opt-in.** Odrębna, niezaznaczona zgoda + mail potwierdzający z linkiem aktywacyjnym; dowód (data, wersja treści zgody, adres) przechowywany; każda wiadomość niesie link rezygnacji działający w jednym kliknięciu. Wycofanie zgody musi być tak łatwe jak jej udzielenie.
6. **Outbound w dwóch krokach** (playbook): zaproszenie LinkedIn bez oferty, z pytaniem o zgodę na przesłanie materiałów i linkiem do `/rodo` → dopiero po zgodzie mail z ofertą → telefon. Każdy szablon trzyma się jednego źródła i jest zatwierdzany przez founderów; treść pytania o zgodę cytuje administratora i kanał.
7. **Brak zarejestrowanej działalności niczego nie zmienia.** Art. 398 PKE dotyczy wysyłającego, nie jego statusu rejestrowego: wiadomość handlowa wysłana przez osobę fizyczną promującą własne usługi jest informacją handlową tak samo jak wysłana przez spółkę. Treść zgody nazywa administratora zgodnie ze stałą `CONTROLLER` w `src/data/rodo.ts` (dziś: imię i nazwisko), a zmiana administratora po rejestracji wymaga podbicia `CONSENT_VERSION` i poinformowania osób już w bazie w kolejnej wiadomości.
8. **Zakaz dark patterns:** brak „zgadzam się" wpisanego w etykietę przycisku wysyłki, brak zgody zbiorczej („akceptuję regulamin i zgody marketingowe"), brak cookie-walla warunkującego dostęp do treści od zgody marketingowej.

## Mechanizm awarii (dlaczego)

Sankcja UKE za naruszenie art. 398 PKE wynosi **3 % przychodu albo 1 mln zł — wyższa z kwot**; przy zerowym przychodzie sufitem jest milion, a precedens na małej spółce (Tani Opał sp. z o.o.) to 500 tys. zł. Ryzyko jest asymetryczne: jeden mail wysłany na `biuro@` bez zgody kosztuje więcej niż cały pilot. Domyślnie zaznaczony checkbox nie jest zgodą (wymaga „wyraźnego działania potwierdzającego", art. 4 pkt 11 i motyw 32 RODO), więc baza zbudowana na takim formularzu jest bezużyteczna prawnie — i nie da się udowodnić, kto i kiedy jej udzielił. Zgoda zbiorcza upada w całości: podważenie jednego elementu unieważnia pozostałe. Kolejność „najpierw zgoda, potem oferta" jest też wymogiem biznesowym: firma, która dostaje niezamówioną ofertę od dostawcy sprzedającego „porządek w danych", dostaje dowód przeciwko tezie.

## Niepoprawnie

```tsx
// formularz kontaktowy: zgoda domyślnie zaznaczona, zbiorcza, wpisana w przycisk
<label>
  <input type="checkbox" name="zgoda" defaultChecked />           {/* brak wyraźnego działania = brak zgody */}
  Akceptuję regulamin i zgadzam się na kontakt marketingowy oraz newsletter   {/* zgoda zbiorcza */}
</label>
<button type="submit">Wysyłając formularz akceptuję zgody</button> {/* zgoda ukryta w akcji */}
```
```ts
// outbound: oferta handlowa na adres firmowy bez uprzedniej zgody
sendMail({ to: "biuro@firma.pl", subject: "Oferta: automatyzacja raportowania", body: OFERTA });
// art. 398 PKE obejmuje także osoby prawne; art. 6 ust. 1 lit. f RODO tego nie naprawia (WSA II SA/Wa 62/25)
```

## Poprawnie

```tsx
// site/src/components/ContactForm.tsx — inbound (art. 398 ust. 2); zgoda osobna, pusta, per kanał
<label className="consent">
  <input type="checkbox" name="consentMail" />                    {/* bez checked / defaultChecked */}
  <span>{pick(CONSENT.mail, lang)}</span>
</label>
<label className="consent">
  <input type="checkbox" name="consentPhone" />
  <span>{pick(CONSENT.phone, lang)}</span>
</label>
<p className="hint">{pick(CONSENT.note, lang)}</p>
<button type="submit">{pick(CTA.send, lang)}</button>
```
```ts
// site/src/data/consent.ts — jedno źródło treści zgód, z wersją (dowód przy audycie UKE)
export const CONSENT_VERSION = "2026-09-12";
export const CONSENT = {
  mail:  { pl: "Zgadzam się na otrzymanie odpowiedzi i materiałów handlowych na podany adres e-mail od KLAROW (administrator: …).", en: "…" },
  phone: { pl: "Zgadzam się na kontakt telefoniczny w sprawie mojego zgłoszenia.", en: "…" },
  note:  { pl: "Zgody są dobrowolne i możesz je wycofać w każdej chwili, pisząc na kontakt@klarow.com. Szczegóły: /rodo.", en: "…" },
};
```
```ts
// outbound krok 1 (LinkedIn, bez oferty): pytanie o zgodę + adres klauzuli
const invite = {
  pl: "Dzień dobry, budujemy narzędzia pod proces w firmach produkcyjnych. Czy mogę przesłać krótki materiał na e-mail? Skąd mamy dane i jak wnieść sprzeciw: klarow.com/rodo",
};
```

## Test

```bash
# 1. zero domyślnie zaznaczonych zgód w całym froncie
grep -rnE "type=\"checkbox\"[^>]*(defaultChecked|checked(\s|=\{true\}|>))" site/src            # 0
# 2. zero zgód zbiorczych: jedna etykieta z dwoma celami
grep -rniE "akceptuję.*(i|oraz).*(marketing|newsletter)|zgadzam się.*(i|oraz).*(newsletter|marketing)" site/src site/dist   # 0
# 3. zgoda nie może być warunkiem wysyłki ani treścią przycisku
grep -rniE "<button[^>]*>[^<]*(zgadzam|akceptuj)" site/src                                     # 0
# 4. treści zgód tylko z jednego źródła, z wersją
test -f site/src/data/consent.ts && grep -n "CONSENT_VERSION" site/src/data/consent.ts
# 5. formularz wysyłający dane musi mieć pole zgody (albo być czystym mailto inbound)
grep -rnE "<form" site/src | while read -r hit; do echo "sprawdź ręcznie: $hit"; done
# 6. szablony outboundu: krok 1 bez oferty, z linkiem do /rodo
grep -rniE "oferta|cennik|kup" leadscout/playbook-outbound.md | head                            # nie w szablonie zaproszenia
grep -rci "klarow.com/rodo" leadscout/playbook-outbound.md                                      # >= 1
# 7. bot i digesty nie wysyłają informacji handlowej do osób trzecich (tylko do founderów)
grep -rnE "sendMessage|chat_id" leadscout/notify.mjs | head
```

## Wyjątki

Odpowiedź na zapytanie zainicjowane przez odbiorcę (formularz, `mailto:`, rezerwacja, telefon od klienta) nie wymaga odrębnej zgody — art. 398 ust. 2 PKE; zgoda jest potrzebna dopiero na kolejne, niezamówione wiadomości handlowe i na newsletter.

**Spór między organami („paradoks zgody"), nie ustalony stan prawny** (za oknem researchu c1, do rozstrzygnięcia przez radcę): UKE dopuszcza neutralne zapytanie o zgodę na kontakt handlowy jako czynność poprzedzającą marketing, natomiast UOKiK w decyzji DOZIK 3/2019 uznał takie zapytanie za informację handlową samą w sobie. Dopóki radca tego nie rozstrzygnie, pierwsza wiadomość ma być maksymalnie neutralna (prośba o zgodę bez opisu oferty, bez cennika, bez CTA sprzedażowego) i traktowana w audycie jako materiał objęty tą regułą. Komunikacja wewnętrzna (digesty Lead-Scout na Telegram do founderów) nie jest informacją handlową. Kwalifikacja telefonu jako kanału objętego art. 398 (telekomunikacyjne urządzenia końcowe w marketingu bezpośrednim) jest w tej regule przyjęta ostrożnościowo — do potwierdzenia przez radcę przy zatwierdzaniu szablonów; do czasu potwierdzenia obowiązuje wersja ostrożniejsza (pytamy o zgodę także na telefon).
