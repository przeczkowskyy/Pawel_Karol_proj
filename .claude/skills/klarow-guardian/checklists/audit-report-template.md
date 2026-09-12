# Szablony raportów audytu (strażnik Klarow)

Dwa szablony: (1) raport pojedynczego audytora `.claude/work/audit/<data>/<agent>.md`,
(2) `INDEX.md` rundy `.claude/work/audit/<data>/INDEX.md` + jednoliniowy wpis do globalnego
`.claude/work/audit/INDEX.md` (append-only). Nagłówki sekcji są dosłowne — sprawdza je skrypt/orkiestrator.
To jest szablon z polami, nie „przykładowy raport do naśladowania”: treść bierzesz z własnych sprawdzeń.

Słownik dla founderów (w tekście raportu): „do naprawy”, „obserwacja”, „sprawdzone, bez zmian”,
„nie sprawdzano”. Zakazane słowa wewnętrzne: „sub-agent”, „LLM”, „gate”, „workflow”, „passRate”.
Nazwa poprzedniej firmy nie pojawia się w raporcie nawet jako cytat — także w komunikatach
bramek skryptowych (pisz „nazwa poprzedniej firmy”); dlatego `audit-static.mjs` dla reguły
`brand-no-nuconic` podaje tylko plik i linię, bez snippetu. Stare złoto opisujesz słowami
(„stare złoto”) wszędzie tam, gdzie piszesz do founderów; sam kod `#FFA914` wolno podać
WYŁĄCZNIE jako wartość techniczną w linii findingu albo w `→ fix:` (inaczej nie da się
wskazać, co zamienić na `var(--accent)`).

Format findings (CONTRACT):
```
## <ścieżka od korzenia repo> (<liczba>, <najwyższa SEV>)
<ścieżka>:<linia> - <BLOCKER|HIGH|MEDIUM|LOW> [<id-reguły>] <komunikat ≤ 90 zn.>
  → fix: <tylko gdy naprawa nieoczywista>
Σ BLOCKER n · HIGH n · MEDIUM n · LOW n
```
Równolegle JSONL (1 finding = 1 linia):
`{"file":"…","line":0,"severity":"HIGH","rule":"…","msg":"…","fix":null,"confidence":"CONFIRMED|PLAUSIBLE"}`
`CONFIRMED` = dowód w kodzie/skrypcie/zrzucie (plik:linia, wynik komendy). `PLAUSIBLE` = ocena bez dowodu.

---

## 1. Raport audytora — `.claude/work/audit/<data>/<agent>.md`

```markdown
# <agent> — <YYYY-MM-DD> — zakres: <n plików | diff | route:/x> — runda <1|2|3>

## Werdykt: PASS|FAIL
<1 zdanie: dlaczego. FAIL = ≥ 1 BLOCKER lub HIGH CONFIRMED spoza baseline. Dług z baseline oznaczaj „(dług, w baseline)”.>

## Naruszenia
<grupowanie per plik wg CONTRACT; pliki w kolejności zakresu; zero preambuły>
## <ścieżka> (<n>, <SEV>)
<ścieżka>:<linia> - <SEV> [<id>] <komunikat>
  → fix: <opcjonalnie>
Σ BLOCKER n · HIGH n · MEDIUM n · LOW n

## Co sprawdzono i przeszło
- <reguła lub test z rules/<id>.md §Test> — <plik/zakres> — sprawdzone, bez zmian
- <skrypt + wynik dosłownie, np. „audit-static: Σ BLOCKER 0 · HIGH 0 · MEDIUM 2 · LOW 0 · baseline: pominięto 41”>
- <zrzuty: ścieżki PNG, viewport, tryb (normal/reduced) — co potwierdzają>

## Niepewne (PLAUSIBLE)
- <ścieżka>:<linia> - <SEV> [<id>] <co budzi wątpliwość> — <czego brakuje do potwierdzenia / kto decyduje>

## Nie sprawdzano w tej rundzie
- <co> — <dlaczego (brak dist, brak Playwright, plik zamrożony, poza prefiksami agenta)>

## Runda <N> (re-audyt)          ← tylko przy re-audycie; sekcja APPEND-ONLY, poprzednich nie nadpisuj
- <ścieżka>:<linia> [<id>] FAIL → fix (<co zmieniono>) → PASS|FAIL
Σ po rundzie: BLOCKER n · HIGH n · MEDIUM n · LOW n
```

Zwrot do orkiestratora (poza raportem) to WYŁĄCZNIE:
```
Werdykt: PASS|FAIL
Σ BLOCKER n · HIGH n · MEDIUM n · LOW n
Raport: .claude/work/audit/<data>/<agent>.md
```
albo — gdy wywołanie wymaga StructuredOutput — obiekt
`{verdict, findings:[{file,line,severity,rule,msg,fix,confidence,mechanical}], report_path, checked, unchecked}`.

---

## 2. `INDEX.md` rundy — `.claude/work/audit/<data>/INDEX.md`

```markdown
# Audyt klarow.com — <YYYY-MM-DD>

Zakres: <diff w site/ | site/src | route:/x | lista> (<n plików>) · tryb: <audyt + naprawy mechaniczne | tylko raport> ·
rundy naprawcze: <n> · bramki: tsc <OK|BŁĄD> · build <OK|BŁĄD|pominięty> · verify-site <OK|z naruszeniami> · dist <jest|brak>

## Werdykty
| Audytor | Werdykt | B/H/M/L | Raport |
|---|---|---|---|
| ui-auditor | PASS|FAIL | 0/0/0/0 | .claude/work/audit/<data>/ui-auditor.md |
| motion-auditor | … | … | … |
| code-auditor | … | … | … |
| integration-scanner | … | … | … |
| seo-auditor | … | … | … |
| copy-auditor | … | … | … |
| brand-leak-auditor | … | … | … |

## Przed → po
| Severity | Przed (po deduplikacji i weryfikacji) | Po (ostatnia runda) | Naprawione | Obalone przez weryfikację | Niezweryfikowane |
|---|---|---|---|---|---|
| BLOCKER | n | n | n | n | n |
| HIGH | n | n | n | n | n |
| MEDIUM | n | n | n | – | – |
| LOW | n | n | n | – | – |

## Naprawione (<n>)
- <ścieżka>:<linia> [<id-reguły>](../../../skills/klarow-guardian/rules/<id>.md) — <co zmieniono>

## Pominięte przez naprawiającego (z powodem) (<n>)
- <ścieżka>:<linia> [<id>] — <powód: brak tokenu o tej wartości / zmiana treści / plik zamrożony>

## Do decyzji founderów (<n>)
| Pozycja | Dlaczego nie automatycznie | Rekomendacja | Reguła |
|---|---|---|---|
| <ścieżka>:<linia> — <1 zdanie> | copy / liczba / etykieta dowodu / layout / IA / integracja / sekret / plik zamrożony | <konkretna propozycja> | [<id>](../../../skills/klarow-guardian/rules/<id>.md) |

## Obserwacje (PLAUSIBLE, do potwierdzenia) (<n>)
- <ścieżka>:<linia> [<id>] — <co i czego brakuje do potwierdzenia>

## Nie sprawdzano w tej rundzie
- <co> — <dlaczego>

## Następny krok
<1–3 zdania: co zrobić najpierw (zwykle: BLOCKER-y prawne i markowe, potem HIGH niemechaniczne), kiedy powtórzyć audyt>
```

Wpis do globalnego `.claude/work/audit/INDEX.md` (1 linia per audytor per runda, append-only, bez nagłówków):
```
<YYYY-MM-DD> · <agent> · PASS|FAIL · <B>/<H>/<M>/<L> · .claude/work/audit/<data>/<agent>.md
```

---

## 3. Kontrola jakości raportu (orkiestrator sprawdza przed scaleniem)

- [ ] 4 obowiązkowe nagłówki dosłownie: `## Werdykt`, `## Naruszenia`, `## Co sprawdzono i przeszło`, `## Niepewne (PLAUSIBLE)`
- [ ] każdy finding ma `ścieżka:linia`, severity z {BLOCKER,HIGH,MEDIUM,LOW}, `[id-reguły]` (istniejący plik w `rules/` albo prefiks sekcji z `rules/_sections.md`, albo `RBP:`/`CP:`)
- [ ] `Σ` zgadza się z liczbą linii findings
- [ ] `CONFIRMED` tylko z dowodem; oceny bez linii są w `## Niepewne`
- [ ] zero nazwy poprzedniej firmy, zero `#FFA914`, zero wartości sekretów, zero danych osób z `leads.json`
- [ ] „nie sprawdzano” wypisane jawnie (brak listy = raport niekompletny)
- [ ] żaden PASS nie stoi na awarii narzędzia: komenda z `## Test`, której **plik/ścieżka jeszcze nie istnieje** (reguły opisują stan po fazie 1: `tokens.css`, `messaging.ts`, `home.ts`, `contact.ts`, `Hero.tsx`, `Icon.tsx`, `pdfDoc.mjs`, `site/tests/`, `site/public/media/`, `RodoPage.tsx`, `docs/DECISIONS.md`), albo która skończyła się **exit 2** (np. `grep -P` bez `LC_ALL=C.UTF-8`), trafia do `## Nie sprawdzano w tej rundzie` — nigdy do `## Co sprawdzono i przeszło`
- [ ] pozycje z `## Co sprawdzono i przeszło` mają dowód: wynik komendy (exit 1 = 0 trafień) albo ścieżkę zrzutu
- [ ] re-audyt dopisany jako `## Runda N`, poprzednie sekcje nienaruszone
