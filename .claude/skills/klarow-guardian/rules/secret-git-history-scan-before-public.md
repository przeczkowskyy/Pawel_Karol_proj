---
id: secret-git-history-scan-before-public
title: Przed upublicznieniem repo, forkiem lub udostępnieniem kodu osobie trzeciej — skan całej historii gita pod kątem sekretów i danych
impact: BLOCKER
tags: [secrets, git, history, public-repo, github, filter-repo]
source: portfolio §6.3 („git log -p | grep -E '(KEY|TOKEN|SECRET)=' w każdym repo z remote"), §8 p.13 (czy repo jest publiczne) / synthesis §6 (luka: publiczność repo) / CLAUDE.md #3 (Nuconic w docs/) / leadscout/README.md (leads.json w repo)
added: 2026-09-12
---

## Zasada

Zanim repo (lub jego fork, archiwum, zrzut kodu, dostęp dla podwykonawcy/radcy/klienta) opuści krąg
founderów, obowiązuje skan CAŁEJ historii, nie tylko HEAD:
1. `node ".claude/skills/klarow-guardian/scripts/check-secrets.mjs" --history` → Σ BLOCKER 0
   (wzorce kluczy w dodanych liniach wszystkich commitów na wszystkich gałęziach + zabronione pliki);
2. ręczny grep: `git log -p --all | grep -nE '(KEY|TOKEN|SECRET|PASSWORD|PASSWD)\s*[:=]\s*\S{8,}'` → 0 trafień poza szablonami;
3. przegląd DANYCH, których skaner wzorcami nie złapie: `leadscout/leads.json` (dane firm i osób),
   `leadscout/digesty/`, `docs/nuconic-ekosystem-referencja.md` i każdy plik z nazwą/liczbami poprzedniej
   firmy (CLAUDE.md #3: zakaz publikacji do umowy IP) — dopóki są w historii, repo MUSI pozostać prywatne;
4. jeśli cokolwiek znaleziono: najpierw rotacja (`secret-rotate-on-exposure`), potem czyszczenie historii
   `git filter-repo` (nie `filter-branch`), force push, re-clone u drugiego foundera, zgłoszenie do GitHub
   Support o usunięcie cache'owanych widoków; publikacja dopiero po ponownym skanie.
Stan 2026-09-12: repo `przeczkowskyy/Pawel_Karol_proj` zawiera `leads.json` i referencję poprzedniej firmy,
więc do decyzji founderów traktujemy je jako PRYWATNE; upublicznienie wymaga wcześniejszego wydzielenia
tych plików do osobnego prywatnego repo albo ich usunięcia z historii.

**Dane osobowe w gicie: powód mocniejszy niż higiena sekretów.** Historia gita jest niekasowalna bez
przepisania wszystkich commitów, więc każdy plik śledzony przez gita czyni NIEUSUWALNYMI dane, które
art. 17 RODO (prawo do usunięcia) i art. 21 (sprzeciw) każą usunąć na żądanie osoby. Dlatego dane
osobowe nie wchodzą do repo w ogóle, a nie „wchodzą i sprzątamy je później". Obowiązujący podział klas
danych (ustalony z oknem researchu c1, 2026-09-12): `leadscout/leads.json` wyłącznie dane PODMIOTÓW
(nazwa, `www`, NIP/REGON/KRS, PKD, forma prawna, adres siedziby spółki, sygnały, oceny, właścicielstwo
jako ścieżka spółek); nazwiska, role, LinkedIn i adresy osób fizycznych wyłącznie w
`leadscout/decydenci.local.json` POZA gitem (`.gitignore`); rejestr sprzeciwów `suppression.json`
w gicie, ale klucze WYŁĄCZNIE jako SHA-256 (sprzeciw musi przetrwać jako dowód dla UKE, hasz spełnia
zasadę minimalizacji); `kontakt_historia` bez treści wiadomości i bez nazwisk, tylko
`{data, kanal, szablon, wynik}`. Skrzynka funkcyjna (`rodo@`, `biuro@`, `kontakt@`) formalnie nie jest
daną osobową, ale w repo i tak jest zbędna.

## Mechanizm awarii (dlaczego)

Historia gita jest kompletna: `git rm` i nowy commit nie usuwają starych blobów, a każdy klon pobiera
wszystko. Publiczne repo GitHuba jest skanowane przez boty w minutach od pushu (tokeny) i indeksowane przez
wyszukiwarki (nazwy firm, osób, liczby klienta). Dane osób z leadów w publicznym repo to naruszenie RODO
z obowiązkiem zgłoszenia do UODO w 72 h; nazwa i liczby poprzedniej firmy w publicznym repo to złamanie
CLAUDE.md #3 przed umową IP, z ryzykiem roszczeń. GitHub zachowuje osierocone commity dostępne po SHA
także po force pushu, dopóki support ich nie usunie; dlatego rotacja zawsze poprzedza czyszczenie
i nigdy go nie zastępuje. Sam HEAD może być czysty przy brudnej historii — stąd `--history`, a nie `--all`.

## Niepoprawnie

```bash
# „HEAD jest czysty, więc można upublicznić"
git rm --cached leadscout/.env && git commit -m "bez .env" && gh repo edit --visibility public
# przepisanie historii bez rotacji
git filter-branch --index-filter 'git rm --cached --ignore-unmatch leadscout/.env' HEAD && git push --force
```

## Poprawnie

```bash
# 1. skan historii i drzewa
node ".claude/skills/klarow-guardian/scripts/check-secrets.mjs" --history --quiet     # Σ BLOCKER 0
node ".claude/skills/klarow-guardian/scripts/check-secrets.mjs" --all --dist --quiet  # Σ BLOCKER 0
git log -p --all --no-color | grep -nE '(KEY|TOKEN|SECRET|PASSWORD)\s*[:=]\s*[A-Za-z0-9_:/+.-]{12,}' | grep -viE 'example|placeholder|<|…' || echo "0 trafień"
# 2. dane, których nie łapią wzorce
git log --all --name-only --format= | sort -u | grep -E 'leads\.json|digesty/|nuconic' && echo "PRYWATNE: dane w historii"
# 3. gdy trzeba czyścić (po rotacji!): git filter-repo (instalacja: pip install git-filter-repo)
git filter-repo --invert-paths --path leadscout/leads.json --path leadscout/digesty --path docs/nuconic-ekosystem-referencja.md
git push --force --all && git push --force --tags
# 4. drugi founder: świeży klon; GitHub Support: prośba o usunięcie osieroconych commitów; ponowny skan
```

## Test

```bash
S=".claude/skills/klarow-guardian/scripts/check-secrets.mjs"
node "$S" --history --quiet; echo "exit=$?"                                    # oczekiwane: Σ BLOCKER 0, exit 0
git log --all --diff-filter=A --name-only --format= | grep -E '(^|/)\.env$|\.chat_id$|\.pem$|credentials' && echo "BLOCKER: plik sekretów kiedykolwiek dodany" || echo OK
git log --all --name-only --format= | sort -u | grep -ciE 'leads\.json|nuconic'   # >0 → repo musi zostać prywatne
gh repo view --json visibility -q .visibility 2>/dev/null || echo "sprawdź widoczność repo w ustawieniach GitHub"
```

## Wyjątki

Repozytoria dostarczane klientowi (kod narzędzia „zostaje u Ciebie") powstają jako NOWE repo z czystą
historią (kopia plików, `git init`), nigdy jako fork repo firmowego; wtedy skan dotyczy tylko nowego drzewa.
`leadscout/.env.example` z pustą wartością jest dozwolony w historii.
