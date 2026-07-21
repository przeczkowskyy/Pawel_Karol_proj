# Nuconic UI Kit

**Jedno źródło prawdy dla UI wszystkich wewnętrznych narzędzi Nuconic.**
Stack (**v2.0**): **React + Vite + TypeScript + Tailwind** (utility/layout) + jeden design-system
CSS (`app.css` — tokeny + klasy komponentów) + ikony **lucide-react**. **NO CDN** (fonty self-hosted).
*(v1.x: FastAPI SSR + Jinja2 + vanilla JS — wycofane; pliki `.html` w `assets/` to legacy-referencja.)*

Aplikacja referencyjna: **Budget Tracking** (`nuconic-budget-tracking/`, React/Vite/TS) — wszystkie
komponenty i klasy w tym kicie są z niej wyjęte i działają produkcyjnie.

---

## Zawartość

```
skills/
  nuconic-ui/            ← GŁÓWNY standard (obowiązkowy)
    SKILL.md             ← pełna wiedza (React): tokeny, teoria przycisków, chipy statusów,
                           ikony lucide-react, tło canvas (BgBeams), animacje, tabele + drag-pan,
                           wykresy (NcChart/Recharts), formularze, combobox, overflow,
                           responsywność, biblioteka bloków ekstra
    assets/              ← KANONICZNE
      app.css            ← jedyny arkusz styli (tokeny + wszystkie komponenty) → kopiuj do
                           aplikacji jako src/styles/nuconic-ui.css (popraw ścieżki fontów)
      fonts/             ← Nunito Sans variable woff2 (latin + latin-ext)
      *.html, components/*.html  ← LEGACY-referencja (stary stack Jinja) — NIE kanon
  ui-ux-pro-max/         ← skill pomocniczy (ogólna wiedza UI/UX: palety, guidelines, style)

Komponenty React referencyjne żyją w aplikacji Budget Tracking:
  src/components/shell/{AppShell,BrandMark,BgBeams}.tsx
  src/components/analytic/kit/{NcChart,NcDonut,NcSelect,StatCard,KitBar}.tsx
  src/lib/{useDragPan,theme,navConfig}.ts
```

---

## Optymalne użycie — z Claude Code (zalecane)

Skill jest napisany pod agenta AI. Najkrótsza droga do identycznego UI:

1. **Zainstaluj skill w repo aplikacji:**
   ```
   <projekt>/.claude/skills/nuconic-ui/        ← skopiuj cały folder
   <projekt>/.claude/skills/ui-ux-pro-max/     ← opcjonalnie (pomocniczy)
   ```
   Claude Code wykryje go automatycznie przy starcie sesji.
2. **Formułuj zadania przez standard**, np.:
   - *„Zbuduj ekran listy zamówień zgodnie ze skillem nuconic-ui: data-table ze sticky
     nagłówkiem, chipy statusów, empty state, page-head z jednym CTA."*
   - *„Dodaj wykres trendu kosztów — styl wykresów z nuconic-ui (złota linia z kropkami,
     kropkowana siatka, animacja reveal)."*
   - *„Przebuduj ten formularz na standard nuconic-ui."*
   Agent MUSI używać komponentów i klas z kitu — jeżeli proponuje własny wariant przycisku/koloru,
   to jest błąd; odeślij go do SKILL.md.
3. **Nowa aplikacja od zera:** każ agentowi wykonać sekcję „Instalacja ręczna" poniżej,
   a potem budować ekrany. Checklist odbioru każdego ekranu jest w `SKILL.md` §17.
4. **Dopisuj do CLAUDE.md aplikacji** jedną linijkę:
   *„UI wyłącznie wg skilla nuconic-ui — zero własnych wariantów komponentów."*

## Optymalne użycie — ręcznie (developer bez agenta)

`SKILL.md` czyta się jak księga znaku + dokumentacja komponentów. Kolejność:
§0 (model plików) → §1 (twarde zasady) → §2 (tokeny) → dalej wg potrzeby.
Każdy komponent ma kod copy-paste (JSX); markup bloków ekstra (kalendarz, toasty, wizard,
dropdown-menu, taby, timeline, skeleton…) jest w §16.

---

## Instalacja w projekcie (nowa aplikacja React + Vite + TS)

1. Skille → `<projekt>/.claude/skills/` (jak wyżej).
2. `npm create vite@latest` (react-ts) + Tailwind + `lucide-react` + `recharts`.
3. Zasoby kanoniczne → do aplikacji:
   ```
   assets/app.css        → src/styles/nuconic-ui.css   (popraw ścieżki @font-face na /fonts/…)
   assets/fonts/*.woff2  → public/fonts/
   ```
   `import "./styles/nuconic-ui.css"` w `main.tsx`; przenieś komponenty referencyjne z Budget
   Tracking (AppShell/BrandMark/BgBeams/NcChart/NcDonut/NcSelect/StatCard/KitBar + hooki),
   dostosuj `navConfig` (pozycje nav + role).
4. Buduj ekrany wyłącznie z komponentów/klas kitu — zero własnych wariantów przycisków,
   chipów, kolorów, animacji. Tailwind tylko do layoutu.

## Model propagacji zmian (WAŻNE)

- `nuconic-ui.css` w każdej aplikacji kończy się markerem:
  `/* ═══ APP-SPECIFIC (poniżej tej linii — nie ruszać przy aktualizacji kitu) ═══ */`
  Kod specyficzny danej appki (mostek tokenów, klasy app) żyje WYŁĄCZNIE pod nim.
- **Zmiana globalna** (tło, ikona, kolor przycisku…): PR do TEGO repo (`assets/app.css` +
  komponenty React) → w każdej aplikacji nadpisujesz część `nuconic-ui.css` NAD markerem świeżą
  kopią (+ podmiana zmienionych komponentów). Sekcja app-specific przeżywa nietknięta.
- Efekt: jedna zmiana w kicie = identyczna zmiana we wszystkich narzędziach Nuconic.
  *(Docelowo: pakiet `@nuconic/ui` na npm zamiast kopiowania — TODO.)*

## Gotchas (oszczędzą Ci godzin)

- **Bez restartu serwera** — Vite HMR podłącza CSS/komponenty na żywo; `npx vite build` regeneruje
  bundle z nowym hashem. (W Budget Tracking pełny `npm run build` blokuje pre-existing `tsc -b` —
  używaj `npx vite build`, jest tożsamy z bundlem produkcyjnym.)
- **Zakaz animowania SVG w tle** (dash/pathLength/animowane grupy) — lag i migotanie;
  tło = `BgBeams` (canvas 2D niskiej rozdzielczości + JEDEN GPU blur przez CSS, throttle 30 fps;
  zakaz `ctx.filter` per klatka). Szczegóły: SKILL.md §1 i §7.
- **Wykresy: NIGDY animacja JS Recharts** (`isAnimationActive={false}`) — buduj przez `.nc-reveal`
  (overlay-slide GPU). Szczegóły SKILL.md §8/§11.
- **Zakaz akcentowych pasków `border-left`** na kartach/panelach — tint + pełna 1px ramka
  w kolorze semantycznym + chip (SKILL.md §1.9).
- **Sticky komórki = nieprzezroczyste tła**, inaczej treść prześwituje przy scrollu.
- **Modal w React**: overlay `.modal-overlay-c` bez `.open` jest `display:none` — dodaj `open`.
- **Ellipsis nie działa na inline-flex** — pełna lista reguł overflow: SKILL.md §13.

## Twarde zasady (skrót — pełna lista w SKILL.md §1)

- Złoto `#FFA914` to JEDYNY akcent; zieleń = sukces/historia, ceglany = problem/odrzucone.
- Status zawsze = kolor + ikona + tekst (`.st` + ikona lucide), nigdy sam kolor.
- Kwoty `tabular-nums`, format PLN `12 345,67` / USD `$1,234,567.89`; nigdy łamane w środku.
- Fonty self-hosted (narzędzia chodzą w LAN, bez CDN). Kolory tylko tokenami (zero hexów w JSX/SVG).

## Wersje

- **v2.0 (2026-07-15) — ZMIANA STACKU:** React + Vite + TypeScript + Tailwind + design-system CSS
  + lucide-react zastępują FastAPI SSR + Jinja2 + vanilla JS. Standardy wizualne bez zmian; makra
  Jinja → komponenty/hooki React (AppShell, BrandMark, BgBeams, NcChart, NcDonut, NcSelect,
  StatCard, KitBar, useDragPan). Aplikacja referencyjna: Budget Tracking. Pliki `.html` = legacy.
- **v1.2 (2026-07-15)** — dwa nowe standardy: **donut/pierścień** (`.nc-donut*` — jeden
  złoty łuk na neutralnym torze, round linecap, animowany draw-in; zamiennik dla udziałów
  procentowych, ZAKAZ pie wielobarwnych; SKILL §16) oraz **zwijany panel zakładek**
  (`.nav-toggle` + `.app.nav-collapsed` — strzałka na krawędzi sidebara płynnie zasuwa nav
  i powiększa pole główne, stan w localStorage; SKILL §9, markup+JS w base.html).
- **v1.1 (2026-07-13)** — znak marki = samo logo „n" jako inline SVG w brand_mark.html
  (trace logo.gif, IoU 0.9987: gradient, inner shadow, ziarno, poświata; bez wordmarku);
  tło bg_beams.html zamiast WebGL smoke (subtelne złote belki, HUE_BASE=40, 30 fps);
  obowiązkowy slot „Menu aplikacji" na dole sidebara (placeholder pod menu wyboru aplikacji);
  twarda zasada §1.9: zakaz border-left akcentów (toast/tip-note przestylowane);
  shell zamrożony (`.app` height:100vh — scrolluje .main/.sidebar, nie body);
  riseIn .35s fill-mode backwards (fix: filled transform więził position:fixed w Chromium).
- **v1 (2026-07-08)** — pierwszy standard wyjęty z Plan Płatności.
  TODO v2: formatka e-maili (wrap_html), manifest PWA, confirm-modal,
  adaptacja Protocol Managera do tego stylu.
