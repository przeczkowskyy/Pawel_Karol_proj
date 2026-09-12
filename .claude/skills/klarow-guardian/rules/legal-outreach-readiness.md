---
id: legal-outreach-readiness
title: Outbound rusza dopiero po domkniętej checkliście OUTREACH_READY; publikacja strony to osobny, niższy próg
impact: BLOCKER
tags: [legal, outbound, rodo, pke, leadscout, gate, consent]
source: peer-legal.md §1.1 (art. 14 RODO, Bisnode 943 470 zł), §1.4 (art. 398 PKE) / art. 14 ust. 3 lit. a RODO (miesiąc od pozyskania danych) / docs/plan/reframe-2026-09-12.md §2 (dwie bramki zamiast jednej) / docs/plan/strona-v2-plan.md §4.6, §10 p. 1 i 7 / decyzje-founderow-v2.md D16, D25, D26
added: 2026-09-12
---

## Zasada

Są **dwa niezależne progi**, nie jeden. Mylenie ich kosztuje albo tygodnie zwłoki (blokowanie publikacji do czasu rejestracji firmy), albo karę (wysyłka bez kompletu obowiązków).

**Próg 1, publikacja strony: `SITE_PUBLISHABLE`** (pilnuje go `legal-rodo-page-required`). Wymaga tożsamości administratora i kompletnych sekcji o serwisie. Nie wymaga rejestracji działalności, NIP-u, REGON-u, adresu siedziby ani przeglądu radcy.

**Próg 2, pierwszy kontakt handlowy: `OUTREACH_READY`.** Wolno wysłać pierwszą wiadomość (list, zaproszenie LinkedIn z pytaniem o zgodę, permission-mail, telefon) dopiero wtedy, gdy spełnione są **łącznie**:

1. `SITE_PUBLISHABLE = true` i `/rodo` działa na produkcji;
2. **adres do korespondencji** wpisany w `CONTROLLER` **albo** świadomie wybrane zdanie zastępcze („Adres do korespondencji podajemy na żądanie…"), z decyzją zapisaną w `docs/DECISIONS.md` (D26);
3. klauzula art. 14 kompletna: konkretne źródła per rodzaj (bez „ze źródeł publicznie dostępnych"), kategorie danych, podstawa z wyjaśnieniem interesu, **konkretny okres** (12 miesięcy od ostatniego kontaktu), odbiorcy oraz transfer poza EOG z podstawą **rozstrzygniętą per dostawca** (zero „SCC albo DPF" w `dist`), sekcja o profilowaniu (art. 14 ust. 2 lit. g), organ nadzorczy;
4. treści zgód PKE w jednym źródle: `site/src/data/consent.ts` z `CONSENT_VERSION`, odrębna zgoda na e-mail i na telefon, zero domyślnych zaznaczeń (`legal-pke-consent-forms`);
5. szablony outboundu w `leadscout/playbook-outbound.md` linkują do `klarow.com/rodo`, a **pierwsza wiadomość nie zawiera oferty** (krok 1 = prośba o zgodę);
6. **źródło i data per lead** w bazie: pierwsza wiadomość cytuje konkretne ogłoszenie i datę (to jest dokładnie to, czego zabrakło w precedensie Bisnode);
7. rejestr zgód (data, kanał, wersja treści), rejestr sprzeciwów z terminem 7 dni i właścicielem procesu oraz rejestr czynności przetwarzania (art. 30) istnieją **poza gitem** (`legal-no-scraped-personal-data-in-repo`, `secret-secrets-outside-git`);
8. datowany wpis `OUTREACH_READY = true` w `docs/DECISIONS.md`, podpisany przez obu founderów (przegląd radcy może być równoległy; start bez niego jest świadomym ryzykiem, D16).

**Zegar art. 14 ust. 3 lit. a.** Obowiązek informacyjny trzeba wykonać w ciągu **miesiąca od pozyskania danych**, nie od wysyłki. Dlatego `leadscout/leads.json` **nie zawiera danych osób fizycznych** (imię, nazwisko, stanowisko, imienny e-mail, telefon) do czasu `OUTREACH_READY`: do tego momentu baza trzyma wyłącznie dane firmowe i publiczny sygnał zakupowy. Dopisanie osoby wcześniej tworzy dług, którego nie da się spłacić wstecz.

**Czego ten próg NIE wymaga:** rejestracji działalności gospodarczej. Rejestracja (`CONTRACT_READY`: NIP, rachunek, wzór umowy, porozumienie wspólników) jest warunkiem **pierwszej faktury**, nie pierwszego maila.

**Zakaz interpretacji „strona żyje, więc można wysyłać".** Publikacja portfolio nie odblokowuje outboundu; `OUTREACH_READY = false` przy działającej stronie jest stanem normalnym i świadomym, a nie przeoczeniem.

## Mechanizm awarii (dlaczego)

Bisnode pobierał dane z rejestrów publicznych i zapłacił **943 470 zł** wyłącznie za niewykonanie obowiązku z art. 14; decyzję potwierdził NSA. Sankcja UKE za naruszenie art. 398 PKE to **3 % przychodu albo 1 mln zł, wyższa z kwot**, a przy zerowym przychodzie sufitem jest milion. Plan kontroli sektorowych UODO na 2026 obejmuje bazy marketingowe. Ryzyko jest skrajnie asymetryczne: jeden mail wysłany za wcześnie kosztuje więcej niż cały pilot, a jeden tydzień zwłoki w publikacji portfolio nie kosztuje nic. Jednocześnie odwrotny błąd (blokowanie publikacji do czasu rejestracji firmy) opóźnia jedyny kanał, którym w ogóle można dziś pokazać dowód, i nie kupuje żadnej zgodności: strona bez formularzy, bez cookies i bez wysyłki nie robi niczego, co wymagałoby danych rejestrowych przedsiębiorcy.

## Niepoprawnie

```ts
// site/src/data/rodo.ts — jedna flaga na dwie różne rzeczy
export const RODO_READY = true;   // co to znaczy? że wolno publikować, czy że wolno wysyłać?
```
```json
// leadscout/leads.json — osoba dopisana "na zapas", przed domknięciem checklisty
{ "nazwa": "Firma X", "kontakt_osoba": "Jan Kowalski", "email_osoby": "j.kowalski@firma.pl" }
// art. 14 ust. 3 lit. a: zegar miesięczny ruszył w dniu zapisu, nie w dniu wysyłki
```

## Poprawnie

```ts
// site/src/data/rodo.ts — dwie flagi, dwa progi, jedno miejsce podmiany tożsamości
export const CONTROLLER = { kind: "person", name: "…", address: "", taxId: "" } as const;
export const SITE_PUBLISHABLE = true;   // strona może iść na produkcję
export const OUTREACH_READY   = false;  // ani jednej wiadomości handlowej
```
```json
// leadscout/leads.json — do czasu OUTREACH_READY wyłącznie warstwa firmowa
{ "nazwa": "Firma X", "www": "firma.pl", "segment": "produkcja", "sygnal": "ogłoszenie o pracę: kontroler",
  "zrodlo_url": "https://…", "data_dodania": "2026-09-12" }
```

## Test

```bash
# 1. bramka outboundu (uruchamiana świadomie, nie w codziennym npm run check)
node ".claude/skills/klarow-guardian/scripts/verify-site.mjs" --outreach --fail-on BLOCKER,HIGH
# 2. flagi istnieją i są rozłączne
grep -nE "^export const (SITE_PUBLISHABLE|OUTREACH_READY)" site/src/data/rodo.ts     # 2 wpisy
# 3. zero danych osób w bazie leadów do czasu OUTREACH_READY
grep -nE '"(imie|nazwisko|osoba|kontakt_osoba|email_osoby|telefon_osoby)"' leadscout/leads.json   # 0
# 4. podstawa transferu rozstrzygnięta per dostawca (nie "SCC albo DPF")
grep -ciE "SCC albo DPF|standardowych klauzul umownych albo" site/dist/rodo.html     # 0
# 5. jedno źródło treści zgód z wersją
test -f site/src/data/consent.ts && grep -n "CONSENT_VERSION" site/src/data/consent.ts
# 6. decyzja o starcie outboundu zapisana i datowana
grep -nE "OUTREACH_READY" docs/DECISIONS.md                                          # >= 1
# 7. szablony niosą adres klauzuli, krok 1 bez oferty
grep -rci "klarow.com/rodo" leadscout/playbook-outbound.md                           # >= 1
```

## Wyjątki

Odpowiedź na zapytanie zainicjowane przez odbiorcę (`mailto:`, telefon od klienta, hak „Przyślij nam swój najgorszy Excel", rezerwacja rozmowy) to inbound z art. 398 ust. 2 PKE i **nie** podlega tej regule. Publikacja treści na własnym profilu LinkedIn (posty o własnej pracy, linki do strony) też nie: to publikacja, nie informacja handlowa kierowana do wskazanego odbiorcy. Granica jest ostra w jednym miejscu: zaproszenie albo wiadomość z ofertą wysłana do konkretnej osoby **jest** informacją handlową i wchodzi pod tę regułę. Ta reguła jest wymaganiem produktowym, nie opinią prawną; trzy punkty wymagają potwierdzenia radcy (obowiązkowość adresu w klauzuli, kwalifikacja powtarzalnej bezpłatnej diagnozy, faktyczne współadministrowanie mimo wskazania jednego administratora).
