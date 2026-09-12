---
id: legal-no-scraped-personal-data-in-repo
title: Dane osobowe z researchu nie trafiają do repo strony, do narzędzi ani do modeli; w leadscout tylko minimum firmowe ze wskazaniem źródła
impact: BLOCKER
tags: [legal, rodo, privacy, leadscout, secrets, ai-tools, minimization, git]
source: peer-legal.md §1.1 (art. 14: konkretne źródło per rekord) / CLAUDE.md „leadscout/" i ostrzeżenie o folderze marketing/ z realnymi danymi leadów w cudzej aplikacji / rules/secret-no-secrets-in-prompts-or-logs.md, rules/integ-data-egress-review.md, rules/media-higgsfield-inputs-policy.md, rules/secret-git-history-scan-before-public.md
added: 2026-09-12
---

## Zasada

Dane osób zebrane w researchu (Lead-Scout, ogłoszenia o pracę, LinkedIn, KRS, CEIDG, wizytówki, korespondencja) **nigdy** nie trafiają do:
1. `site/**`, `demo/**`, `ui-kit/**`, `dist/**` — ani jako treść, ani jako dane przykładowe, ani w komentarzu w kodzie, ani w metadanych obrazu czy PDF;
2. dokumentów publicznych (`llms.txt`, posty bota, one-pager, zrzuty ekranu w portfolio, case study);
3. promptów i wejść narzędzi zewnętrznych: generatorów obrazu i wideo (Higgsfield), serwerów MCP, API modeli językowych, tłumaczy online, usług OCR — także „tylko żeby przeformatować tabelę";
4. logów, raportów audytu, wiadomości między agentami i artefaktów w scratchpadzie, które wracają do repo.

W `leadscout/` obowiązuje minimalizacja (art. 5 ust. 1 lit. c RODO): rekord to **dane firmy**, nie osoby — `nazwa`, `www`, `lokalizacja`, `segment`, `rozmiar`, `ocena`, `sygnal`, `zrodlo_url`, `hook`, `uwagi_weryfikacji`, `status`, `data_dodania`. **Zero imion i nazwisk, zero prywatnych adresów e-mail i telefonów, zero kopii treści ogłoszenia lub profilu w całości.** Pola `zrodlo_url` i `data_dodania` są obowiązkowe i nieusuwalne: to dowód „konkretnego źródła" wymagany przez art. 14 RODO i przez `legal-rodo-page-required` (bez nich nie da się napisać, skąd mamy dane).

**Zegar z art. 14 ust. 3 lit. a (korekta 2026-09-12).** Obowiązek informacyjny trzeba wykonać **w ciągu miesiąca od POZYSKANIA danych**, a nie od wysłania wiadomości. Dopisanie imienia, nazwiska, stanowiska albo imiennego e-maila do `leadscout/leads.json` uruchamia ten zegar niezależnie od tego, czy kiedykolwiek napiszemy, i tworzy dług, którego nie da się spłacić wstecz. Dlatego **do czasu `OUTREACH_READY` baza zawiera wyłącznie dane firmowe i publiczny sygnał zakupowy** (`legal-outreach-readiness`).

Baza leadów jest zbiorem danych osobowych także wtedy, gdy zawiera wyłącznie dane firmowe jednoosobowych działalności; dlatego: plik trzymany lokalnie, przeglądany tylko przez founderów, usuwany po sprzeciwie w 24 h, a **przed upublicznieniem repozytorium, forkiem lub udostępnieniem kodu osobie trzeciej wyprowadzany z gita razem z historią** (`secret-git-history-scan-before-public`). Stan na 2026-09-12: `leadscout/leads.json` jest **śledzony przez gita** (32 rekordy; jeden zawiera adres e-mail, kilka wspomina osobę w polach `hook` i `uwagi_weryfikacji`) — do wyczyszczenia przy najbliższej rundzie i bezwarunkowo przed publikacją repo.

To wymaganie produktowe, nie opinia prawna; kwalifikacja i treść klauzul do przeglądu radcy (D-21).

## Mechanizm awarii (dlaczego)

Dane osobowe wklejone do modelu opuszczają nasz obieg i najczęściej trafiają poza EOG bez podstawy prawnej i bez umowy powierzenia — to udostępnienie danych, nie „pomoc w pracy"; w przypadku Higgsfielda dochodzi licencja treningowa na przesłane materiały. Repozytorium jest wspólne i ma być kiedyś pokazane osobom trzecim (portfolio, wspólnik, klient): plik z listą firm, sygnałów zakupowych i nazwisk osób kontaktowych to jednocześnie wyciek danych osobowych i przekazanie konkurencji gotowego pipeline'u sprzedaży. Historia gita pamięta wszystko — usunięcie pliku jednym commitem nie usuwa go z repozytorium. Odwrotny kierunek jest równie groźny: rekord bez `zrodlo_url` uniemożliwia wykonanie obowiązku z art. 14 („z ogłoszenia opublikowanego na portalu X w dniu Y"), więc każdy kontakt na jego podstawie jest niezgodny z prawem, a precedens Bisnode pokazuje cenę. Dema mają dane fikcyjne właśnie po to, żeby nikt nie musiał sięgać po prawdziwe (`demo-labels`).

## Niepoprawnie

```ts
// site/src/data/tools.ts — „realistyczny" przykład zbudowany na prawdziwym leadzie
const SAMPLE = { klient: "Zakład Metalowy Kowalski sp. z o.o.", osoba: "Anna Nowak, kierownik controllingu", mail: "a.nowak@…" };
```
```json
// leadscout/leads.json — dane osoby i skopiowane ogłoszenie zamiast odsyłacza
{ "nazwa": "…", "osoba_kontaktowa": "Jan K., dyrektor finansowy", "mail": "j.k@…", "tel": "+48 …",
  "ogloszenie_tresc": "<pełna treść ogłoszenia o pracę>", "zrodlo_url": null }
```
```text
prompt do generatora obrazu: „zrób grafikę do posta o leadzie Zakłady X — kierownik controllingu Anna Nowak szuka kontrolera…"
```

## Poprawnie

```json
// leadscout/leads.json — minimum firmowe + dowód źródła wymagany przez art. 14
{ "nazwa": "Producent konstrukcji stalowych (woj. śląskie)",
  "www": "https://…", "lokalizacja": "śląskie", "segment": "produkcja", "rozmiar": "80-120",
  "ocena": 8, "sygnal": "ogłoszenie o pracę: specjalista ds. controllingu",
  "zrodlo_url": "https://www.pracuj.pl/praca/…", "data_dodania": "2026-07-23",
  "hook": "raportowanie kosztów projektów w arkuszach", "status": "nowy" }
```
```ts
// dane w demach są jawnie fikcyjne i deterministyczne
const ROWS = [{ project: "Hala A", stage: "Montaż", cost: 128_400_00 }, /* … */];  // grosze, zero danych realnych
```
```text
prompt do generatora obrazu: „abstrakcyjna faktura stalowej powierzchni, makro, zimne światło, bez tekstu, bez ludzi"
```

## Test

```bash
# 1. dane osobowe w kodzie strony i w buildzie: adresy e-mail spoza NAP, telefony, PESEL, profile LinkedIn
grep -rnE "[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}" site/src site/dist --include="*.ts" --include="*.tsx" --include="*.html" | grep -v "kontakt@klarow.com"   # 0
grep -rnE "\+48[  ]?[0-9]{3}[  ]?[0-9]{3}[  ]?[0-9]{3}" site/src site/dist | grep -v "786 296 426"    # 0
grep -rniE "linkedin.com/in/|[0-9]{11}" site/src site/dist                                            # 0 (profile osób, PESEL)
# 2. leadscout: minimalizacja i obowiązkowe źródło per rekord
node - <<'JS'
const leads = require("./leadscout/leads.json").leady;
const mail = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/, tel = /\+?\d[\d  -]{7,}/, person = /linkedin\.com\/in\/|imię|imie|nazwisko/i;
let bad = 0;
for (const [i, l] of leads.entries()) {
  const s = JSON.stringify(l);
  if (mail.test(s))   { console.log(`leadscout/leads.json:${i} - BLOCKER [legal-no-scraped-personal-data-in-repo] adres e-mail w rekordzie`); bad++; }
  if (tel.test(s))    { console.log(`leadscout/leads.json:${i} - BLOCKER [legal-no-scraped-personal-data-in-repo] numer telefonu w rekordzie`); bad++; }
  if (person.test(s)) { console.log(`leadscout/leads.json:${i} - BLOCKER [legal-no-scraped-personal-data-in-repo] dane osoby w rekordzie`); bad++; }
  if (!l.zrodlo_url || !l.data_dodania) { console.log(`leadscout/leads.json:${i} - BLOCKER [legal-no-scraped-personal-data-in-repo] brak zrodlo_url/data_dodania (art. 14)`); bad++; }
}
console.log(`rekordów: ${leads.length}, naruszeń: ${bad}`);
JS
# 3. przed upublicznieniem repo: baza leadów poza gitem
git ls-files leadscout | grep -E "leads.json|digesty/"        # przed publikacją: pusto (plik w .gitignore + czyszczenie historii)
# 4. prompty i wejścia narzędzi zewnętrznych bez danych osób
grep -rniE "lead|nazwisko|kontakt do" .claude/work/*/prompts* media/SOURCES.md 2>/dev/null   # 0
node ".claude/skills/klarow-guardian/scripts/check-secrets.mjs" --quiet
```

## Wyjątki

Dane kontaktowe **własne** (NAP Klarow, `kontakt@klarow.com`, `786 296 426`) i publiczne dane founderów, które sami zdecydowali się opublikować (D-05), nie są objęte zakazem — pochodzą z `src/data/contact.ts` (`code-contact-single-source`). Cytat z publicznego ogłoszenia w wiadomości wysyłanej do tej samej firmy jest dopuszczalny (to element obowiązku z art. 14: wskazanie źródła), ale nie wolno go zapisywać w repozytorium. Dane klientów przekazane w ramach pilota żyją wyłącznie na maszynie klienta i nigdy nie wchodzą do tego repo (`integ-data-egress-review`).
