# Klarow

Repozytorium Karola i Pawła.

| Katalog | Co to jest |
|---|---|
| `site/` | strona klarow.com (Cloudflare Pages buduje ją po każdym pushu na `main`) |
| `design/` | koncepcja strony v2, raporty z panelu projektowego, hurtownia promptów (Higgsfield, Claude Design), hand-offy |
| `post-bot/` | Cloudflare Worker `klarow-post-bot` (deploy osobno, przez wrangler) |
| `leadscout/` | lista leadów i skrypty (sekrety w `.env`, poza gitem) |
| `demo/` | demo narzędzia „Raport zarządczy” |
| `docs/` | archiwum strategii v1 |

Stara strona (przed restartem v2, 2026-09-22) jest zachowana pod tagiem `archiwum/strona-v1`:
`git checkout archiwum/strona-v1 -- <ścieżka>` przywraca dowolny plik.
