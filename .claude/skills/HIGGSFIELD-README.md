# Skille Higgsfield w tym repo — co używać, czego NIE

Zainstalowane 2026-09-14 przez `npx skills add higgsfield-ai/skills`
(uruchomione ZE SCRATCHPADA, bo `&` w ścieżce repo łamie shimy — zasada #6
w `CLAUDE.md` — a wynik skopiowany tutaj).

Do tego CLI: `npm i -g @higgsfield/cli` (wersja 1.1.24, repo
`github.com/higgsfield-ai/cli`, opiekunowie z domeny higgsfield.ai —
**sprawdzone w rejestrze npm przed instalacją**, nie na słowo).

## Które skille dotyczą tego projektu

| Skill | Nasze zastosowanie |
|---|---|
| **`higgsfield-generate`** | **TEN NAS INTERESUJE.** Generowanie klipów tła pod sceny prezentacji i obrazu-klucza stylu. |
| `higgsfield-brandkit` | Ewentualnie przy materiałach marki. Uwaga: marka Klarow ma własne reguły (`klarow-guardian`), które są NADRZĘDNE — akcent stalowy, wordmark tekstowy, zero logo graficznego. |

## Których NIE używać

| Skill | Dlaczego nie |
|---|---|
| **`higgsfield-websites`** | **ZAKAZ dla klarow.com.** Buduje strony jako aplikacje React na Cloudflare Worker w infrastrukturze Higgsfielda. Nasza strona to Vite + React + prerender, hostowana na naszym Cloudflare Pages, z własnym systemem tokenów, strażnikiem reguł i 19 plikami statycznego HTML. Przepisanie jej tym skillem skasowałoby całą warstwę SEO i kontroli. Skill zostaje w repo tylko dlatego, że przyszedł w pakiecie. |
| `higgsfield-video-explainer` | Robi film NARRATOROWY: lektor, bloki 10 s, wypalone napisy. My robimy CISZĘ pod tekstem strony — bez lektora i bez tekstu w kadrze (ten sam materiał ma obsłużyć PL i EN). Warsztat stojący za tym skillem jest cenny jako wiedza o rzemiośle (patrz `docs/plan/prezentacja-scenariusz.md` §4), ale jego wyjście nie jest tym, czego potrzebujemy. |
| `higgsfield-soul-id` | Trenuje model na CZYJEJŚ TWARZY. **Nie wolno**: zero twarzy założycieli i zero danych osobowych w narzędziach generatywnych (licencja Higgsfielda pozwala trenować na wejściach). |
| `higgsfield-youtube-thumbnail`, `-product-photoshoot`, `-marketplace-cards` | Nie mamy produktu fizycznego ani kanału YouTube. |

## Bezpieczeństwo

- **Nigdy nie uruchamiaj `higgsfield auth token`** i nie czytaj pliku poświadczeń.
  Token dostępowy to sekret — obowiązuje ta sama zasada co przy `.env`
  (`secret-never-read-env`).
- **Zero danych klienta, zero materiałów Nuconic, zero twarzy** w jakimkolwiek
  wejściu do generatora. Licencja pozwala dostawcy trenować na tym, co wyślemy.
- Zakup planu i logowanie robi founder. Agent nie inicjuje płatności.

## Przydatne komendy

```bash
higgsfield account credits          # ile kredytów zostało
higgsfield model list --video       # które modele wideo są w naszym planie
higgsfield generate cost <model> …  # KOSZT PRZED WYDANIEM — używać zawsze
higgsfield generate create <model> --prompt "…" --image <upload_id>
```

`generate cost` jest ważny: pozwala potwierdzić rachunek z
`docs/plan/prezentacja-scenariusz.md` §4.7 **zanim** wydamy kredyty.
