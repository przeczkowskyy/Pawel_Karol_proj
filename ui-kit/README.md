# Company UI Kit

**Jedno źródło prawdy dla UI wszystkich narzędzi firmy.** Marka = **placeholder
„YOUR COMPANY NAME"** (tekstowy wordmark, bez logo graficznego) — po wyborze nazwy firmy
podmieniamy napis w jednym miejscu (`BrandMark`).
Stack (**v2.1**): **React + Vite + TypeScript + Tailwind** (utility/layout) + jeden design-system
CSS (`app.css` — tokeny + klasy komponentów) + ikony **lucide-react**. **NO CDN** (fonty self-hosted).
*(v1.x: FastAPI SSR + Jinja2 + vanilla JS — wycofane; pliki `.html` w `assets/` to legacy-referencja.)*

> **Pochodzenie:** kit wywodzi się z wewnętrznego design-systemu zbudowanego dla poprzedniego
> wdrożenia (opis: `CLAUDE.md` w korzeniu repo, sekcja C2). **v2.1 = pełny rebrand**: usunięte
> logo i nazwy, nowa paleta „polerowana stal", stonowane wykresy. Logika komponentów bez zmian.

---

## Zawartość

```
skills/
  company-ui/            ← GŁÓWNY standard (obowiązkowy)
    SKILL.md             ← pełna wiedza (React): tokeny, teoria przycisków, chipy statusów,
                           ikony lucide-react, tło canvas (BgBeams), animacje, tabele + drag-pan,
                           wykresy (NcChart/Recharts), formularze, combobox, overflow,
                           responsywność, biblioteka bloków ekstra
    assets/              ← KANONICZNE
      app.css            ← jedyny arkusz styli (tokeny + wszystkie komponenty) → kopiuj do
                           aplikacji jako src/styles/company-ui.css (popraw ścieżki fontów)
      fonts/             ← Nunito Sans variable woff2 (latin + latin-ext)
      react/             ← BrandMark (wordmark), NcLauncher + nc-launcher.css (nawigacja v2.0)
      *.html, components/*.html  ← LEGACY-referencja (stary stack Jinja) — NIE kanon
  ui-ux-pro-max/         ← skill pomocniczy (ogólna wiedza UI/UX: palety, guidelines, style)
```

---

## Księga znaku (v2.1 — do czasu wyboru nazwy)

- **Wordmark:** „YOUR COMPANY NAME" — Nunito Sans 800, uppercase, letter-spacing .14em,
  metaliczny gradient stali na tekście (klasa `.brand-word`). Zero logo graficznego.
- **Paleta:** czerń/biel + **jeden akcent: polerowana stal `#A8B4C2`** (odcienie chromatyczne,
  chłodny szary; krawędzie `#8895A6`/`#69788C`). Zieleń = sukces/historia, ceglany = problem —
  warstwa semantyczna bez zmian.
- **Charakter:** prestiżowo, spokojnie, statycznie — bez kolorowych poświat, wykresy renderują
  się od razu (krótki fade zamiast teatralnego „rysowania"), kropki na wykresach tylko tam,
  gdzie niosą informację.
- **Font:** Nunito Sans variable, self-hosted (bez zmian).

## Optymalne użycie — z Claude Code (zalecane)

1. **Zainstaluj skill w repo aplikacji:**
   ```
   <projekt>/.claude/skills/company-ui/        ← skopiuj cały folder
   <projekt>/.claude/skills/ui-ux-pro-max/     ← opcjonalnie (pomocniczy)
   ```
2. **Formułuj zadania przez standard**, np. *„Zbuduj ekran listy zamówień zgodnie ze skillem
   company-ui: data-table ze sticky nagłówkiem, chipy statusów, empty state, page-head z jednym
   CTA."* Agent MUSI używać komponentów i klas z kitu — własny wariant przycisku/koloru = błąd.
3. **Dopisuj do CLAUDE.md aplikacji** jedną linijkę:
   *„UI wyłącznie wg skilla company-ui — zero własnych wariantów komponentów."*

## Instalacja w projekcie (nowa aplikacja React + Vite + TS)

1. Skille → `<projekt>/.claude/skills/` (jak wyżej).
2. `npm create vite@latest` (react-ts) + Tailwind + `lucide-react` + `recharts`.
3. Zasoby kanoniczne → do aplikacji:
   ```
   assets/app.css        → src/styles/company-ui.css   (popraw ścieżki @font-face na /fonts/…)
   assets/fonts/*.woff2  → public/fonts/
   assets/react/*        → src/components/shell/ (BrandMark, NcLauncher; css do company-ui.css)
   ```
4. Buduj ekrany wyłącznie z komponentów/klas kitu — zero własnych wariantów przycisków,
   chipów, kolorów, animacji. Tailwind tylko do layoutu.

## Model propagacji zmian (WAŻNE)

- `company-ui.css` w każdej aplikacji kończy się markerem:
  `/* ═══ APP-SPECIFIC (poniżej tej linii — nie ruszać przy aktualizacji kitu) ═══ */`
  Kod specyficzny danej appki żyje WYŁĄCZNIE pod nim.
- **Zmiana globalna** (tło, kolor akcentu, podmiana nazwy firmy…): PR do TEGO repo →
  w każdej aplikacji nadpisujesz część `company-ui.css` NAD markerem świeżą kopią (+ podmiana
  zmienionych komponentów). Sekcja app-specific przeżywa nietknięta.
  *(Docelowo: pakiet `@company/ui` na npm zamiast kopiowania — TODO.)*

## Gotchas (oszczędzą Ci godzin)

- **Zakaz animowania SVG w tle** (dash/pathLength/animowane grupy) — lag i migotanie;
  tło = `BgBeams` (canvas 2D niskiej rozdzielczości + JEDEN GPU blur przez CSS).
- **Wykresy: NIGDY animacja JS Recharts** (`isAnimationActive={false}`); wejście = krótki fade
  (`.chart-reveal` / `.nc-chart-build`) — szczegóły SKILL.md §8/§11.
- **Zakaz akcentowych pasków `border-left`** na kartach/panelach (SKILL.md §1.9).
- **Sticky komórki = nieprzezroczyste tła**, inaczej treść prześwituje przy scrollu.
- **Modal w React**: overlay `.modal-overlay-c` bez `.open` jest `display:none` — dodaj `open`.
- **Ellipsis nie działa na inline-flex** — pełna lista reguł overflow: SKILL.md §13.

## Twarde zasady (skrót — pełna lista w SKILL.md §1)

- Stal `#A8B4C2` to JEDYNY akcent; zieleń = sukces/historia, ceglany = problem/odrzucone.
- Status zawsze = kolor + ikona + tekst (`.st` + ikona lucide), nigdy sam kolor.
- Kwoty `tabular-nums`, format PLN `12 345,67` / USD `$1,234,567.89`; nigdy łamane w środku.
- Fonty self-hosted (narzędzia chodzą on-prem, bez CDN). Kolory tylko tokenami (zero hexów w JSX/SVG).

## Wersje

- **v2.1 (2026-07-21) — REBRAND:** usunięte logo „n" i wszystkie nazwy poprzedniej marki;
  wordmark-placeholder „YOUR COMPANY NAME" (`.brand-word`, metaliczny gradient na tekście);
  paleta złota → **polerowana stal `#A8B4C2`** (dark+light, wszystkie tinty); klasy `*-gold` →
  `*-accent`; wykresy statyczne (fade zamiast draw-in 1.6s, kropki oszczędnie, cieńsza linia,
  przyciszony gradient area); FAB launchera = ikona `LayoutGrid` zamiast logo; tła `bg_beams`
  (HUE 214, niska saturacja) i `bg_smoke` w stali; skill `nuconic-ui` → `company-ui`.
- **v2.0 (2026-07-15) — ZMIANA STACKU:** React + Vite + TypeScript + Tailwind + design-system CSS
  + lucide-react zastępują FastAPI SSR + Jinja2 + vanilla JS. Standardy wizualne bez zmian.
- **v1.2 / v1.1 / v1 (2026-07)** — historia sprzed rebrandingu (donut, zwijany panel zakładek,
  combobox, beams, shell) — szczegóły w historii gita.
