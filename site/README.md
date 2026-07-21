# site/ — landing page (content-driven)

Samowystarczalny katalog strony. Zasada: **cała treść w plikach danych, zero backendu,
build → czysty katalog statyczny** (deploy = upload gdziekolwiek). Szczegóły i uzasadnienia:
[docs/plan/plan-strategiczny.md](../docs/plan/plan-strategiczny.md), sekcja 4.

## Struktura

```
site/
├─ content/
│  ├─ modules/        # 1 plik YAML = 1 moduł oferty (schemat niżej)
│  ├─ sections/       # hero.yml, pain.yml, how.yml, trust.yml, offer.yml (klucze pl/en)
│  └─ case-studies/   # MD per case per język
├─ data/
│  └─ demo-kpi.json   # dane przykładowe demo KPI (iteracja 2, za flagą)
├─ src/               # szkielet strony — framework TBD (świadomie odłożone)
└─ public/            # assety statyczne
```

## Schemat modułu (content/modules/*.yml)

Pola strukturalne raz, treść per język w `i18n.pl` / `i18n.en`:
`id · status (available|pilot|roadmap|hidden) · order · dzial · problem_tags · industries ·
markets · delivery_days {min,max} · complexity · requires · addons · proof · i18n {name,
tagline, problem, outcome, for_who, value_bullets}`.

## Zasady renderowania

- Karta renderuje się, gdy `status ∈ {available, pilot}` ∧ `locale ∈ markets` ∧ `i18n[locale]` kompletne.
- `roadmap` → podsekcja "w przygotowaniu"; `hidden` → nic (feature-flag).
- Oś główna katalogu: **problem**; dział i branża jako filtry client-side.
- Warianty per odbiorca **build-time, nie runtime**: `/pl/`, `/en/`, ew. `/pl/produkcja/`
  = te same YAML-e + pre-ustawiony filtr.

## Świadomie odłożone

Warstwa wizualna (czeka na rebrand `nuconic-ui-kit` i nazwę firmy) · wybór frameworka ·
hosting/domena · backend formularza · publikacja `/en/` · demo KPI (v2, za flagą `hidden`).
