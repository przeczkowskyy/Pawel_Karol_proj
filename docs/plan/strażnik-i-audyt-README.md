# Strażnik i audyt — przeczytaj to pierwsze

> Paweł, to jest mapa. Cztery rzeczy powstały naraz: **plan przebudowy strony**, **lista decyzji
> do podjęcia**, **strażnik zasad** (skill, który pilnuje, żeby nikt ich nie złamał) i **audyt**
> (workflow, który to sprawdza). Nic z tego nie zmienia jeszcze `site/` — to warstwa decyzji
> i kontroli. Kod strony rusza dopiero po Waszym spotkaniu decyzyjnym.

## Co powstało

| Co | Gdzie | Po co |
|---|---|---|
| Plan przebudowy strony (v2) | `docs/plan/strona-v2-plan.md` | Pełna specyfikacja: trasy, sekcje, copy, motion, budżety, 6 faz (F0–F5), 15–16 dni roboczych |
| **Korekta planu (2026-09-12)** | `docs/plan/reframe-2026-09-12.md` | **Plan został skorygowany po dyrektywie founderów** (brak zarejestrowanej działalności i NIP; strona jest wizytówką i CV dwóch osób z naciskiem na pokazanie narzędzi): co przestało być prawdziwe i dlaczego, w 5 minut. **To czytasz jako pierwsze** |
| Decyzje founderów | `docs/plan/decyzje-founderow-v2.md` | 35 pytań z opcjami i rekomendacją (D1–D35, w tym nowa część G po korekcie) + fakty do potwierdzenia (F1–F6). **To czytasz jako drugie** |
| Strażnik zasad | `.claude/skills/klarow-guardian/` | 145 reguł z ID, severity i testem mechanicznym; rejestr liczb, integracji, przekierowań; checklisty |
| Audytorzy | `.claude/agents/` (8 plików) | 7 audytorów read-only (design/a11y, motion, kod, integracje, SEO, copy, wycieki marki) + orkiestrator |
| Workflow audytu | `.claude/workflows/ui-audit.js`, `.claude/skills/ui-audit/SKILL.md` | Uruchamia bramki, audytorów, weryfikację adwersaryjną i raport `INDEX.md` |
| Skrypty bramek | `.claude/skills/klarow-guardian/scripts/` (8 plików `.mjs`) | Deterministyczne sprawdzenia bez modelu — te same wyniki za każdym razem |

Struktura strażnika: `SKILL.md` (115 linii — to czyta agent na starcie) · `AGENTS.md` (generowany,
pełna treść 145 reguł) · `rules/` (jedna reguła = jeden plik) · `references/` (13 plików: dozwolone
liczby, tokeny, integracje, przekierowania, locki designu, ściąga motion, pipeline assetów, dziennik
decyzji, znane awarie) · `checklists/` (5: pre-flight, Definition of Done, szablon raportu, nowy
asset, synchronizacja przekazu) · `baseline/` (zamrożony dług z 2026-09-12).

## Jak uruchomić audyt

**Wygodnie (jedna komenda w Claude Code):**

```
/ui-audit                      # domyślnie: git diff w site/ (pusty diff = całe site/src)
/ui-audit site --baseline      # cały site/, stary dług wyciszony
/ui-audit route:/narzedzia
```

**Ręcznie (zawsze `node`, nigdy `npx` — `&` w nazwie katalogu łamie shimy):** z korzenia repo

```bash
node ".claude/skills/klarow-guardian/scripts/audit-static.mjs"                    # reguły grep-owe na site/src
node ".claude/skills/klarow-guardian/scripts/audit-static.mjs" --baseline ".claude/skills/klarow-guardian/baseline/audit-static-2026-09-12.jsonl"
node ".claude/skills/klarow-guardian/scripts/verify-site.mjs"                     # po `cd site && npm run build`
node ".claude/skills/klarow-guardian/scripts/find-integrations.mjs"               # nowe hosty i wywołania sieciowe
node ".claude/skills/klarow-guardian/scripts/check-secrets.mjs"                   # przed każdym commitem
node ".claude/skills/klarow-guardian/scripts/screenshots.mjs" --out ".claude/work/audit/shots"
node ".claude/skills/klarow-guardian/scripts/build-index.mjs"                     # po każdej zmianie w rules/
```

Wynik czyta się tak: `ścieżka:linia - SEV [ID-reguły] komunikat`, na końcu
`Σ BLOCKER n · HIGH n · MEDIUM n · LOW n`. **BLOCKER i nowe HIGH blokują push.** Stary dług jest
wyciszony przez `--baseline` — ale BLOCKER nie jest wyciszany nigdy, nawet gdy siedzi w baseline.

Stan na dziś (2026-09-12, przed fazą F0): **6 BLOCKER-ów** czeka na naprawę w F0 — dwa razy
`performance.now` w `DemoReport.tsx` (łamie determinizm dem) i cztery razy słowo „AI" w copy
sprzedażowym (`tools.ts`, `toolsSeo.ts`).

## Jak dodać nową regułę

1. Nowy plik `.claude/skills/klarow-guardian/rules/<prefiks>-<slug>.md`. Prefiks z istniejących 14:
   `brand design motion media perf code a11y seo i18n copy legal integ secret demo`.
   **ID reguły = nazwa pliku bez `.md`** — to ID cytują wszystkie findings.
2. Frontmatter: `id`, `title`, `impact` (`BLOCKER|HIGH|MEDIUM|LOW`), `tags`, `source`, `added`.
3. Sekcje po polsku: `## Zasada`, `## Mechanizm awarii`, `## Niepoprawnie`, `## Poprawnie`,
   `## Test` (komenda, którą da się uruchomić), opcjonalnie `## Wyjątki`.
4. `node ".claude/skills/klarow-guardian/scripts/build-index.mjs"` — przepisuje `AGENTS.md`
   i tabelę sekcji w `SKILL.md`. Skrypt ostrzega, gdy ID jest cytowane, a pliku nie ma.
5. Jeśli reguła ma być sprawdzana mechanicznie: dopisz wzorzec do `scripts/audit-static.mjs`
   (mapa `RULES` na górze pliku) albo do `verify-site.mjs`, jeśli działa na `dist`.

## Hooki — świadoma decyzja, dziś WYŁĄCZONE

`.claude/settings.json` **nie istnieje i nie został utworzony**. Hooki to automaty, które działają
bez pytania, więc włączenie ich jest Waszą decyzją (D21 w `decyzje-founderow-v2.md`).

Gotowa konfiguracja leży w `.claude/skills/klarow-guardian/hooks.settings.example.json`. Co robi:

- **PreToolUse** (`scripts/hook-pre-tool.mjs`) — twardo blokuje odczyt `.env`, `.dev.vars`, `*.pem`,
  `credentials*.json`, `chat_id` (także przez `cat`/`Get-Content` w powłoce) oraz zapis nazwy
  poprzedniej firmy i starego złota `#FFA914` do `site/`, `demo/`, `ui-kit/`. 21 testów granicznych:
  `node ".claude/skills/klarow-guardian/scripts/hook-pre-tool.mjs" --selftest` → 21/21 PASS.
- **PostToolUse** (`scripts/hook-post-edit.mjs`) — po każdej edycji pliku w `site/src` uruchamia
  audyt TEGO pliku wobec baseline i pokazuje tylko to, co ta edycja wprowadziła. Nigdy nie blokuje.

Włączenie: skopiuj ten plik jako `.claude/settings.json` (albo wklej jego zawartość do istniejącego).
Wyłączenie: skasuj sekcję `hooks`. Nic poza tym się nie zmienia.

## Co jest jeszcze do decyzji

1. **35 decyzji D1–D35** z `decyzje-founderow-v2.md` (D25–D35 doszły z korektą 2026-09-12) — bez nich faza F0 nie rusza. Najcięższe:
   przekaz i jedno zdanie marki, font, kto jest administratorem danych (D25), żywe demo na stronie
   głównej (D29), kolejność sekcji (D32), hooki (D21), moment podniesienia React 19.2.7 → 19.3.0.
2. **6 faktów do potwierdzenia (F1–F6)**: czy repo GitHub jest prywatne (leżą w nim materiały
   poprzedniej firmy i `leads.json`), **tożsamość administratora i nazwisko Pawła** (blokują publikację),
   rotacja klucza Anthropic z appki KSeF, status umowy IP, zakres liczby „3 dni".
3. **`/rodo`: dwa progi** (korekta 2026-09-12). Publikacja strony wymaga wyłącznie tożsamości administratora (`SITE_PUBLISHABLE`); dopiero pierwszy kontakt handlowy wymaga kompletu art. 14 i zgód PKE (`OUTREACH_READY`). Rejestracja działalności nie jest warunkiem żadnego z nich, jest warunkiem pierwszej faktury. **`/rodo` przed pierwszym kontaktem handlowym** — twardy bloker prawny (art. 14 RODO). Trasa
   kanoniczna to `/rodo`, `/polityka-prywatnosci` = przekierowanie 301. Treść pisze Claude Code,
   **zatwierdza radca prawny**; do przeglądu strona ma `noindex`, ale jest publicznie dostępna,
   bo linkują do niej wszystkie szablony outboundu.
4. **Nierozstrzygnięte pozycje audytu**: jedno wywołanie `fetch(` w `ui-kit/.../assets/base.html`
   bez rozpoznanego hosta (sprawdzić, dokąd idą dane) i liczba „40%" na `/faq` bez wpisu
   w rejestrze dozwolonych liczb.
5. **Zrzuty ekranu nie były robione** — `screenshots.mjs` wymaga jednorazowej instalacji
   `playwright-core` w katalogu bez `&` w ścieżce (instrukcja wypisuje się sama po uruchomieniu).
