---
name: company-ui
description: "Company UI — obowiązkowy standard i zestaw komponentów dla WSZYSTKICH narzędzi firmy (React + Vite + TypeScript + Tailwind + jeden design-system CSS z tokenami, ikony lucide-react). Używaj przy budowie nowej aplikacji, przebudowie istniejącej lub dodawaniu dowolnego elementu UI: tokeny, przyciski, chipy statusów, ikony, tło canvas, animacje, tabele/macierze, wykresy (NcChart/Recharts), formularze, listy rozwijane, tooltips, modale, kalendarz, toasty, responsywność."
---

# Company UI — standard i zestaw komponentów (v2.1, 2026-07-21)

> **v2.1 (2026-07-21) — REBRAND:** kit odcięty od marki poprzedniej firmy. Zmiany:
> (1) **brak logo graficznego** — znak marki to tekstowy wordmark-placeholder
> **„YOUR COMPANY NAME"** (klasa `.brand-word`, komponent `BrandMark`); podmiana nazwy po jej
> wyborze = jedno miejsce. (2) **Nowa paleta: polerowana stal** — akcent `#A8B4C2`
> (chromatyczny chłodny szary) zamiast złota; klasy `*-gold` przemianowane na `*-accent`.
> (3) **Wykresy bardziej statyczne** — bez teatralnego „rysowania"; krótki fade,
> kropki tylko tam, gdzie niosą informację. Logika komponentów bez zmian.

> **v2.0 (2026-07-15) — ZMIANA STACKU (decyzja zespołu):** porzucamy FastAPI SSR + Jinja2 +
> vanilla JS. Standardem dla WSZYSTKICH narzędzi firmy jest teraz **React + Vite + TypeScript**
> (+ Tailwind jako warstwa utility do layoutu, + kanoniczny design-system CSS z tokenami jako
> źródło prawdy dla komponentów, + ikony **lucide-react**). Standardy WIZUALNE (tokeny, kolory,
> anatomia przycisków/chipów, reguły wykresów, overflow, responsywność) są **niezmienione** —
> zmienia się tylko warstwa implementacji: makra Jinja → komponenty/hooki React. Pliki
> `assets/*.html` zostają jako **legacy-referencja** (wcześniejszy stack), NIE jako kanon.
>
> Zachowane z v1.2: **donut/pierścień** (§16, `.nc-donut*`), **zwijany panel zakładek** (§9,
> `.nav-toggle`), **combobox** (§12.1, `NcSelect`), **wygładzanie przejść / budowanie wykresu**
> (§8, `.nc-swap`/`.nc-tab-swap`/`.nc-reveal`).

Aplikacja referencyjna (historyczna, z poprzedniego wdrożenia): **Budget Tracking** (React/Vite/TS).
Wszystkie komponenty i klasy poniżej są z niej wyjęte i działają produkcyjnie. Nowe narzędzie
firmy buduje się WYŁĄCZNIE z tego zestawu — bez wymyślania własnych wariantów.

## 0. Model użycia i propagacji zmian

**Kanon = jeden arkusz CSS (tokeny + wszystkie klasy komponentów) + komponenty React
referencyjne w Budget Tracking.**

| Zasób kanoniczny | Rola |
|---|---|
| `assets/app.css` | **JEDYNY arkusz styli**: tokeny (`:root` + `[data-theme=light]`) + wszystkie klasy komponentów (`.card .btn .st .nc-*` …) + biblioteka ekstra + `@font-face`. Kopiowany 1:1 do aplikacji (patrz niżej). |
| `assets/fonts/` | Nunito Sans variable woff2 (latin + latin-ext) — self-hosted |
| Budget Tracking `src/components/shell/{AppShell,BrandMark,BgBeams}.tsx` | shell (grid 250+1fr), wordmark tekstowy (kanon: `assets/react/BrandMark.tsx`), tło beams — komponenty React |
| Budget Tracking `src/components/analytic/kit/{NcChart,NcDonut,NcSelect,StatCard,KitBar}.tsx` | prymitywy: wykres liniowy, donut, combobox, kafel KPI, progress bar |
| Budget Tracking `src/lib/{useDragPan,theme,navConfig}.ts` | hooki/utility: drag-to-pan, motyw + `toggleTheme`, config nawigacji |
| **lucide-react** | ikony (zastąpiło makro `ico()` / `icons.html`) |
| `assets/*.html`, `assets/components/*.html` | **legacy-referencja** (stary stack Jinja) — NIE kanon; zostawione dla porównania |

**Start nowej appki (React + Vite + TS):**
1. `npm create vite@latest` (react-ts), dodaj Tailwind + `lucide-react` + `recharts`.
2. Skopiuj `assets/app.css` → `src/styles/company-ui.css`, fonty → `public/fonts/` (popraw
   ścieżki `@font-face` na `/fonts/…`), zaimportuj `company-ui.css` w `main.tsx`.
3. Przenieś komponenty referencyjne (`AppShell/BrandMark/BgBeams/NcChart/NcDonut/NcSelect/
   StatCard/KitBar` + hooki) z Budget Tracking; dostosuj tylko `navConfig` (pozycje menu + role).
**Niczego nie forkuj stylistycznie** — buduj ekrany z gotowych klas i komponentów.

**Warstwa CSS (ważne):** klasy komponentów (`.card/.btn/.st/.nc-*`) z `company-ui.css` to
**źródło prawdy dla komponentów**; Tailwind wolno używać do **layoutu/utility** (flex, grid,
gap, spacing, breakpointy) i drobnych korekt. Nie odtwarzać przycisku/chipu/karty w samym
Tailwindzie — użyj klasy kitu.

**Kod specyficzny appki** w CSS trafia WYŁĄCZNIE pod marker na końcu pliku:
```css
/* ═══ APP-SPECIFIC (poniżej tej linii — nie ruszać przy aktualizacji kitu) ═══ */
```
**Aktualizacja globalna** (np. zmiana tła w całej firmie): edytuj `assets/app.css` w repo kitu →
w każdej appce nadpisz część `company-ui.css` PONAD markerem świeżą kopią (+ podmiana
zmienionych komponentów React). Sekcja app-specific przeżywa. **Bez restartu serwera** —
Vite HMR podłącza CSS na żywo; `vite build` regeneruje bundle z nowym hashem.

## 1. Twarde zasady (złamanie = regresja, sprawdzone bólem)

1. **Stack:** **React + Vite + TypeScript** + **Tailwind** (warstwa utility/layout) + jeden
   design-system CSS (`company-ui.css` — tokeny + klasy komponentów, źródło prawdy dla
   komponentów) + ikony **lucide-react**. Wykresy: **NcChart** (SVG w React, linie) + **Recharts**
   (słupki). **NO CDN** — fonty self-hosted (`public/fonts/`, `@font-face`), narzędzia chodzą w LAN.
   *(v2.0: poprzedni stack FastAPI SSR + Jinja2 + vanilla JS jest wycofany — patrz nagłówek.)*
2. **Zakaz animowania SVG w tle:** per-path `stroke-dash`/`pathLength` = repaint całego viewportu
   co klatkę (lag+migotanie); animowane grupy SVG = pełnoekranowe tekstury kompozytora
   rasteryzowane przy każdej nawigacji. Tło animowane robimy WYŁĄCZNIE jako canvas 2D niskiej
   rozdzielczości + 1 warstwa GPU blur (komponent `BgBeams`, §7).
3. **Zakaz `filter`/`drop-shadow`/`will-change` na animowanych grupach SVG** — rasteryzacja do
   rozmytych tekstur. Zakaz `mask`/`backdrop-filter` na hoverach (migotanie GPU).
4. **Sticky = opaque:** komórki sticky (nagłówki, stopki, zamrożone kolumny) mają NIEPRZEZROCZYSTE
   tła — rgba przepuszcza scrollowaną treść.
5. **Pieniądze:** `Decimal`/grosze(centy) na backendzie, `tabular-nums` w UI, format
   PLN `12 345,67` (spacja, przecinek) / USD `$1,234,567.89`. Kwoty i daty NIGDY nie łamią się
   w środku (§13).
6. **Status = kolor + ikona + tekst** — nigdy sam kolor.
7. **Bezpieczeństwo** — UI nie zwalnia: deny-by-default authz na API, sesje HttpOnly, walidacja
   po stronie serwera. JSX escapuje domyślnie — `dangerouslySetInnerHTML` tylko dla zaufanej,
   sanitowanej treści (np. `data-tip-html` z własnego kodu).
8. **`prefers-reduced-motion`** respektowane globalnie (jest w kicie).
9. **Zakaz akcentowych pasków `border-left`** na kartach/panelach/ramkach (maniera „lewego paska").
   Status/kontekst sygnalizujemy: tint tła + pełna 1px ramka w kolorze semantycznym + chip.
   Jedyny dozwolony `border-left` to strukturalna linia 1px (np. separator sticky kolumny).

## 2. Design tokens (księga znaku — wartości twarde)

Pełna definicja w `assets/app.css` → `:root` (dark, domyślny) + `html[data-theme="light"]`.
Dark jest motywem pierwszym; light pochodnym. Kluczowe wartości:

| Token | Dark | Light | Rola |
|---|---|---|---|
| `--primary` | `#A8B4C2` | = | **JEDYNY akcent** (polerowana stal). CTA, aktywny nav, focus, kluczowe liczby, linia danych wykresu |
| `--primary-600 / -700` | `#8895A6` / `#69788C` | = | krawędź przycisku, stany pressed |
| `--body-bg` | `#121212` | `#F4F5F7` | tło strony (dark = podłoga shadera dymu) |
| `--background` | `#171717` | `#FFFFFF` | topbar |
| `--card` | `#262626` | `#FFFFFF` | karty, tabele, modale |
| `--muted` | `#1F1F1F` | `#F9FAFB` | tła inputów, nagłówki tabel |
| `--secondary` | `#2E2E2E` | `#F3F4F6` | wypełnienia neutralne, chip szary |
| `--border` | `#3A3A3A` | `#E6E8EC` | 1px linie wszędzie |
| `--input` | `#404040` | `#DFE2E7` | obrys kontrolek |
| `--foreground` | `#E5E5E5` | `#262626` | tekst |
| `--heading` | `#FAFAFA` | `#111827` | nagłówki, kwoty |
| `--muted-foreground` | `#B4B4B9` | `#6B7280` | tekst wtórny |
| `--accent-foreground` | `#D9E0E8` | `#42526E` | tekst na stalowych tintach |
| `--funded(-bg/-border)` | `#34D399` +tinty | `#059669` +tinty | **zieleń = sukces/paid/historia** |
| `--rejected(-bg/-border)` | `#F87171` +tinty | `#B91C1C` +tinty | **ceglany = odrzucone/problem** |
| `--destructive` | `#EF4444` | = | akcje niszczące, alarmy |
| `--warning` | `#FBBF24` | `#B45309` | ostrzeżenia miękkie |
| `--scrim` | `rgba(18,18,18,.72)` | `rgba(255,255,255,.8)` | panele na tle (§7) |
| `--radius / --radius-sm` | `12px / 8px` | = | karty / kontrolki; chipy i pigułki `999px` |
| `--shadow-sm/md/lg` | patrz css | patrz css | minimalne cienie — Swiss preferuje bordery |
| `--sidebar-w / --header-h` | `250px / 60px` | = | geometria shellu |
| `--motion` | `200ms cubic-bezier(.22,1,.36,1)` | = | hover/stany |
| `--ease-out / --ease-soft` | `(.22,1,.36,1)` / `(.3,.7,.3,1)` | = | wejścia / wykresy |
| `--fs-2xs…--fs-3xl` | `10/11/12.5/13.5/14.5/16/20/23/28px` | = | skala typograficzna |
| `--chart-neutral` | `#8B93A3` | `#64748B` | linie referencyjne wykresów |

**Dyscyplina akcentu (teoria):** stal nigdy nie jest tekstem akapitowym na bieli (kontrast).
Stal = wypełnienie CTA (ciemny tekst na stali, kontrast ≥ 7:1), pierścień focus, aktywny wskaźnik,
duże pogrubione liczby, linia danych. Tinty stali (`rgba(168,180,194,.08–.16)` tło,
`.35–.45` border) budują stany "w toku". Zieleń i ceglany to WARSTWA SEMANTYCZNA statusów,
nie akcenty dekoracyjne. Niebieski (`#93C5FD` na `rgba(59,130,246,.12)`) i fiolet — wyłącznie
w chipach statusów (zaakceptowane-w-obiegu / skorygowane).

## 3. Typografia i pieniądze

- **Font: Nunito Sans variable (200–1000), self-hosted** — `assets/fonts/`, `@font-face`
  z `unicode-range` latin + latin-ext (polskie znaki) jest w `app.css`.
  Stos: `"Nunito Sans","Segoe UI",system-ui,-apple-system,sans-serif`.
- Body `var(--fs-md)`/1.55. Nagłówki 700–800, letter-spacing `-.02em`. Etykiety-kapitaliki:
  `10–11.5px, uppercase, letter-spacing .06–.09em, weight 700` (klasa `.lbl-sm`).
- **Każda kolumna liczb**: `.tnum` (`font-variant-numeric:tabular-nums`).
- Kwoty duże (KPI): `font-weight:800`, rozmiar clampowany (§13.4).

## 4. Przyciski — pełna anatomia i teoria

Rozmiary: **default** `padding:9px 18px; font:700 13.5px; radius:10px` ·
**`.btn-sm`** `6px 12px / 12.5px / radius 8` · **`.btn-ico`** kwadrat 34×34 (sm: 28×28), sama ikona.
Ikona w przycisku: 15px, `gap:8px`. Focus: `outline:2.5px solid var(--ring); offset:2px` — zawsze widoczny.

**`.btn-primary` — teoria kolorystyki (dlaczego tak wygląda):**
```css
.btn-primary{background:linear-gradient(180deg,#b9c4d1 0%,#a8b4c2 55%,#96a3b3 100%);
  color:var(--primary-fg);border-color:var(--primary-600);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.35),0 1px 2px rgba(0,0,0,.35)}
.btn-primary:hover{background:linear-gradient(180deg,#c7d0dc 0%,#bfc9d6 55%,#aab6c4 100%);
  border-color:var(--primary);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.4),0 3px 10px -3px rgba(0,0,0,.4)}
```
- tło = pionowy gradient stali (`#B9C4D1→#A8B4C2→#96A3B3` — subtelny metal), tekst ciemny;
- **border w ciemniejszej stali** (`--primary-600`) = symulacja krawędzi bryły;
- **`inset 0 1px 0 white/28%`** = highlight górnej krawędzi — światło pada z góry;
- **drop `0 1px 2px`** = minimalna elewacja nad kartą;
- hover: gradient jaśnieje o ~1 stopień (`#C7D0DC→#BFC9D6→#AAB6C4`), border przejmuje bazową
  stal, cień neutralny minimalnie rośnie — przycisk "unosi się" bez transformu i bez kolorowej
  poświaty (zero layout shift, zero efekciarstwa).
- Jeden `.btn-primary` na ekran (jedno główne CTA).

**`.btn-secondary`**: tło `--card`, border `--input`; hover: border+tekst w akcent, tło tint 8%.
**`.btn-ghost`**: przezroczysty, tekst muted; hover tło `--secondary`. **Na tle strony (poza kartą)
ghost dostaje tło karty** (patrz scrim rule) — reguła jest w css (`.page-actions .btn-ghost`).
**`.btn-danger`**: outline w kolorach `--rejected*`; wypełnia się tintem na hover. Akcje niszczące
nigdy nie są primary. **`:disabled`**: `opacity:.5; cursor:not-allowed` (bez inline styli).

## 5. Chipy statusów — jeden system

Pigułka: `radius:999px; padding:3.5px 10px; font:700 11px; border:1px solid; tint + kolorowy tekst`
+ **ikona lucide-react 12px** (klasa `st-ico`). JSX:
```tsx
<span className="st st-accent"><Clock className="st-ico" /> Awaiting validation</span>
```

| Klasa | Semantyka | Ikony typowe |
|---|---|---|
| `st-gray` | draft / pending / neutralne | file, clock, ban |
| `st-accent` | w toku / wymaga działania | clock, calendar, pencil, inbox |
| `st-green` | sukces / paid / historia | check |
| `st-brick` | odrzucone / problem / niepewne | x, help, alert |
| `st-blue` | zaakceptowane / w obiegu | send, receipt, user |
| `st-violet` | skorygowane / wyjątkowe | undo |

Modyfikatory: `st-open` (dashed border — "otwarte"), `st-strike` (przekreślony — "nie dotyczy").
Mapy statusów danej domeny buduj jako **jedną funkcję/komponent** mapujący status → `(klasa,
ikona, etykieta)` (wzór: `taskStatusChip(status)` zwraca `<span className="st st-…">`), a nie
inline w każdym miejscu — jeden słownik na domenę.

## 6. Ikony

**`lucide-react`** — jedyne źródło ikon (`import { Check, X, Clock } from "lucide-react"`).
Domyślnie inline SVG 24×24, `stroke:currentColor; stroke-width:2; round caps` — sterujemy
rozmiarem KLASĄ (nie propem `size`, żeby CSS był źródłem prawdy): `navitem-ico` 17px
(nav/przyciski) · `st-ico` 12px (chipy) · `ico-12` 12px inline w tekście · `e-ico` 32px (empty
state). Np. `<LogOut className="navitem-ico" />`. **Zakaz emoji i glyphów tekstowych**
(✓✕‹→ⓘ) — zawsze komponent lucide.

**Te same ikony = te same znaczenia** (obowiązkowa mapa, nazwy = komponenty lucide-react):
`Check`=zatwierdzone/sukces · `X`=odrzuć/zamknij · `Clock`=oczekuje · `Send`=przekazane dalej ·
`Download`=eksport · `Pencil`=edycja/otwarte · `Trash2`=usuń trwale · `Ban`=anulowane/nie dotyczy ·
`Undo2`=cofnięte · `Info`/`HelpCircle`=objaśnienie · `TriangleAlert`=ostrzeżenie · `Inbox`=skrzynka ·
`Lock`=brak dostępu · `ChevronLeft/Right`=nawigacja wstecz/dalej · `Plus`=nowy obiekt.

Potrzebna nowa ikona → weź istniejący komponent z lucide-react (nie rysuj własnego SVG),
trzymaj prostą geometrię i te same znaczenia.

## 7. Tła i znak marki

**Tło aplikacji = beams** — komponent **`BgBeams`** (`src/components/shell/BgBeams.tsx`):
pochylone, płynące ku górze belki światła w złocie (canvas 2D o obniżonej rozdzielczości `SCALE`
+ JEDNO pasmo GPU blur przez CSS `filter:blur()` na elemencie canvas — zakaz `ctx.filter` per
klatka). Cała pętla `requestAnimationFrame` żyje w `useEffect` (cleanup przy unmount).
Subtelność obowiązkowa: opacity belek ~0.05–0.10, tekst musi pozostać w pełni czytelny.
`HUE_BASE=214` (chłodna stal, niska saturacja) — stała na górze pliku. Mechanizmy — nie psuć:
- pauza przy `document.hidden`; `prefers-reduced-motion` → jedna statyczna klatka,
- fade-in tylko przy pierwszym wejściu w sesji (`sessionStorage`),
- **dark only** — light ukrywa canvas (klasa `.bg-beams`; light = czysty gradient body).

**Scrim rule:** treść leżąca BEZPOŚREDNIO na tle (page-head, section-title, legend, ghost-buttony
akcji strony) dostaje panel `background:var(--scrim); border:1px solid var(--border); radius`.
Karty/tabele są nieprzezroczyste — scrima nie potrzebują.

**Znak marki:** róg topbara = komponent **`BrandMark`** (`src/components/shell/BrandMark.tsx`) —
**TEKSTOWY wordmark-placeholder „YOUR COMPANY NAME"** (klasa `.brand-word`: Nunito Sans 800,
uppercase, letter-spacing .14em, metaliczny gradient stali na tekście przez `background-clip:text`),
obok podpis produktu `.p` (9.5px uppercase, kolor akcentu). ŻADNEGO logo graficznego — po wyborze
nazwy firmy podmieniamy sam napis (jedno miejsce w `BrandMark`).

## 8. Ruch — standard animacji

- **Wejście strony:** `riseIn` (opacity 0→1 + translateY 10px→0), `.5s var(--ease-out)`,
  kaskada `.main > *` co 60ms (nth-child). Każda nawigacja. Nigdy pop-in.
  **`animation-fill-mode: backwards` (NIGDY `both`/`forwards`)** — filled transform robi w Chromium
  z elementu containing block dla `position:fixed` i modale wewnątrz `.main` lądują poza viewportem.
- **Zmiana motywu:** `toggleTheme()` dodaje `html.theme-fade` na 380ms → transition 300ms na
  background-color/color/border-color/fill/stroke/box-shadow. Zero twardego przeskoku.
- **Wykresy (rebrand — statycznie):** wykres renderuje się od razu w całości; jedyny ruch to
  krótki fade `.chart-reveal` `.4s` (delay `.15s`, po kaskadzie) + `.chart-late` `.35s` po `.5s`.
  Żadnego sekwencyjnego „budowania" linia-po-linii.
- **Hover:** wyłącznie kolory/bordery/cienie przez `var(--motion)`; transformy tylko tam, gdzie
  nie przesuwają layoutu (req-card translateY(-2px) jest OK, bo karta w gridzie).
- **Zmiana zakładki / podglądu danych (v1.2):** NIE twardy przeskok/błysk. Zawartość zakładki
  owinięta w kontener z `key` = aktywna zakładka i klasą **`.nc-tab-swap`** (`opacity+translateY 8px`,
  `.34s var(--ease-out) backwards`) — cały panel „budzi się" jednym płynnym fade-in. Pojedynczy
  wykres, który przełącza dane bez zmiany zakładki (np. Labour↔Material, %↔zł), owija się w
  **`.nc-swap`** (`key` = aktywna zmienna; `opacity+translateY 6px .28s`).
- **Wykresy — TWARDE ZASADY (sprawdzone bólem):**
  1. **Instant render, ZERO animacji JS biblioteki** — Recharts `isAnimationActive={false}`.
     Animacja JS animuje słupki + uruchamia custom `LabelList`/formattery **co klatkę na
     main-thread** → przy gęstych danych lag i szarpanie.
  2. **NIE remontować wykresu Recharts przy zmianie DANYCH** (inwestycja, zakres tygodni,
     Labour↔Material). Zmiana danych = aktualizacja w miejscu (nowe `data`/props), **bez `key`
     zależnego od danych**. Remount → `ResponsiveContainer` mierzy się od nowa (`ResizeObserver`,
     pusta klatka 0-height) → **miganie / błysk pustego wykresu**. To był błąd; poprawka: klucze
     BEZ sygnatury danych.
  3. **Wejście/„budowanie" = poziom ZAKŁADKI, nie pojedynczego wykresu Recharts.** Cała treść
     zakładki dostaje `.nc-tab-swap` (§ wyżej) — jeden spokojny fade-in przy wejściu; wykresy
     w środku po prostu renderują się od razu. Dla **NcChart** (własny SVG, render synchroniczny)
     „rysowanie" robi wewnętrzny reveal SVG (`.chart-reveal`, §11) — bezpieczny, bo nie ma
     async re-measure.
  4. `.nc-reveal` (overlay-slide GPU) jest OK dla elementów renderowanych **synchronicznie** i
     dla **jednorazowego** wejścia; **NIE** dla Recharts kluczonego danymi (patrz pkt 2).
- Wszystko wygasza `@media (prefers-reduced-motion: reduce)`.

## 9. Shell i nawigacja

Komponent **`AppShell`** (`src/components/shell/AppShell.tsx`): grid `250px + 1fr` × `60px + 1fr`;
obszary `brand/top/side/main`. Sidebar: pozycje `.navitem` (ikona 17px + label 13.5px/600),
aktywna = stalowy tint + inset ring; **sliding indicator** podąża za hoverem (handler w komponencie,
refy do pozycji nav). Separator `.nav-sep` + nagłówek roli `.nav-role`. Topbar: lewy slot (tytuł
strony `<strong>`), prawy `.tb-right`: pill KPI (np. saldo), theme toggle, user, logout.
**Nav filtrowany rolami** — jedna definicja w `src/lib/navConfig.ts` (`viewsForRole(role)`), użyta
przez sidebar i routing; zakładki mogą mieć sub-zakładki (rozwijane pod aktywną pozycją).
**Kropka powiadomień na zakładce (standard):** `.navitem.nav-attn` — czerwona pulsująca kropka
(`::after`, `--destructive`, reuse `attnPulse`) **inline, tuż za etykietą zakładki** (flex item —
nigdy w rogu ani na końcu paska). Semantyka: „uwaga — ta zakładka wymaga działania". Klasę nadaje
logika aplikacji (warunkowy className w JSX); do kropki dołącz `data-tip` z treścią powiadomienia.
**Dół sidebara (obowiązkowy slot):** nad stopką „Zalogowano jako" zawsze `.nav-sep` +
`.navitem.nav-apps` z ikoną `<LayoutGrid className="navitem-ico" />` i etykietą „Menu aplikacji" —
powrót do menu wyboru aplikacji firmy (dopóki menu nie istnieje: `href="#"` + `data-tip` „wkrótce").
**Zwijanie panelu zakładek (v1.2):** przycisk `.nav-toggle` (strzałka `ChevronLeft`) na
**środku prawej krawędzi** sidebara. Klik → klasa `.nav-collapsed` na `.app` płynnie
(`grid-template-columns .2s cubic-bezier(.4,0,.2,1)` — krótka, bez overshootu, żeby
reflow treści nie „szarpał") zasuwa kolumnę nav (brand+side) do zera i powiększa `.main`
(więcej pola manewru); ikona obraca się o 180°. `.brand/.sidebar` mają `contain:paint`
(izolacja repaintu zwijanej kolumny). Ponowny klik rozsuwa. Stan **persistuje aplikacja**
(localStorage `nc-nav-collapsed`), sam CSS jest w kicie. Strzałka „jedzie" po krawędzi
(`left: var(--sidebar-w)` → `0`) i zawsze pozostaje klikalna. ≤900px wyłączona (shell i tak
składa się do poziomego paska). **Uwaga wydajnościowa:** przy ciężkich wykresach z
`ResponsiveContainer` (Recharts) animacja szerokości wyzwala re-measure co klatkę — trzymaj
krótki czas trwania (≤.22s); dla płynnego przejścia DANYCH używaj `.nc-swap` (fade), nie
animacji layoutu.
**≤900px:** brand znika, sidebar staje się poziomym paskiem pod topbarem (scroll-x).

## 9a. Nc Launcher — nawigacja v2.0 (kółko → kategorie → narzędzia)

**Nowy standard nawigacji** (kit v2.0, React): zamiast wyłącznie lewej listy zakładek —
pływające **kółko z neutralną ikoną menu (lucide `LayoutGrid` — bez logo)** w prawym dolnym
rogu. Klik rozwija **główne kategorie**;
klik kategorii podświetla ją (**rosnący akcentowy border** = „jesteś w tej kategorii") i odsłania
pod nią jej **narzędzia**. Kanoniczny odpis w `assets/react/`: `NcLauncher.tsx`, `nc-launcher.css`,
(+ `README.md`) — wyjęte 1:1 z aplikacji referencyjnej.

- **„Main Page" (landing/Dashboard) znika z lewej listy** — pozycję landingową usuwamy z
  `navConfig.ts`; nawigację przejmuje launcher. Widok może zostać w routingu (przestaje być zakładką).
- **FAB** `.nc-launcher-fab` (60px, ikona `LayoutGrid` w klasie `.nc-fab-ico`) → toggluje panel `.nc-launcher-panel`
  (zsuwa się nad FAB: fade + translateY + scale, `transform-origin:bottom right`).
- **Kategoria** `.nc-cat` → aktywna `.nc-cat.active`: **border 1.5px→2px, akcentowy** + poświata;
  akordeon (jedna otwarta naraz), chevron obraca się 180°.
- **Narzędzia** `.nc-cat-tools`: collapse (`max-height`); **MAX 5 widocznych naraz → reszta na
  SCROLLU** (`overflow-y:auto`, cienki akcentowy scrollbar = hint). `.nc-tool` ma `flex:0 0 auto`
  (nie ściskać — realnie przewijać). Liczba widocznych = `max-height` aktywnej listy (~5×34px + padding).
- **A11y/ruch:** `aria-expanded` (FAB + nagłówki), `role="menu"`, Escape i klik-poza zamyka,
  `prefers-reduced-motion` wygasza. Ikony `lucide-react`; tokeny `--primary/--card/--border/--muted/--motion`.
- **Montaż:** `<NcLauncher />` na końcu `AppShell` (fixed, nad całym UI); `nc-launcher.css` wklej do
  `company-ui.css` **NAD** markerem `APP-SPECIFIC` (to standard kitu). Treść = tablica `NC_CATEGORIES`
  (placeholdery `Place Holder 1..n` do podmiany + routing na `.nc-tool`).

> Launcher to **pierwszy komponent v2.0 (React)**. `nc-launcher.css` jest przenośny (czyste tokeny +
> klasy) — w wariancie vanilla odtwórz logikę open/aktywna-kategoria w JS. Docelowo launcher zastępuje
> starą lewą nawigację; na razie może z nią koegzystować.

## 10. Tabele

**`.data-table`** — listy: nagłówki `--muted` uppercase 11px, wiersze 1px linie, `td.num`/`th.num`
(prawo + tnum + 650), `tfoot` z sumami na `--muted`, `tr.rowlink` (cały wiersz klikalny, hover tint).
**Duże tabele w `.table-wrapper` (v1.1):** scrollbox obu osi (`max-height:calc(100vh - 230px)`,
mobile 70vh) z **drag-to-pan przez hook `useDragPan`** (`src/lib/useDragPan.ts`): `const panRef =
useDragPan<HTMLDivElement>()`, podepnij `ref={panRef}` do `.table-wrapper`/`.matrix-wrap` (pointer
events + suppress-click po przeciągnięciu — strony NIE piszą własnego pan JS); `thead th` sticky
(tło opaque §1.4) — nagłówek i filtry w th zawsze widoczne przy przewijaniu. Mobile bez wrappera:
`display:block; overflow-x:auto`.

**`table.matrix`** — macierze data-dense (plan 14-dniowy, arkusz AIA):
- sticky: nagłówek (top), **lewa kolumna opisowa** `cat-h/cat-c` (left, z cieniem), opcjonalnie
  **prawa kolumna akcji/wyniku** (right — wzór `bill-proposal`), stopka sum (bottom).
  Z-indexy: nagłówek 3-4, stopka 3 (narożniki 4), kolumny 2. **Wszystkie sticky tła opaque!**
- `.matrix-wrap` — kontener scrollowalny z **drag-to-pan** (`useDragPan`: pointer events, suppress
  click po przeciągnięciu) i stylowanym scrollbarem; `cursor:grab/grabbing`.
- komórki klikalne: `.cellbtn` absolute inset-0 (cały target), hover akcentowy inset ring;
- stany komórek: `.cell.funded` (zieleń=historia), `.cell.carried` (ceglany=przesunięte),
  `.slip-tag` (czerwona pigułka "+Nd late"), kolumna `today` (stalowe tło, tag TODAY),
  wiersze grupowe `.row-group` (uppercase, tło `--group-bg`), weekend (`--weekend`).
- legenda pod tabelą w panelu `.legend` (scrim) — swatche + checkboxy filtrów.

## 11. Wykresy — NcChart (SVG w React) + Recharts

**Dwa narzędzia, jasny podział:**
- **Linie/trendy → `NcChart`** (`src/components/analytic/kit/NcChart.tsx`) — własny lekki SVG w
  React, pełna kontrola nad stylem kitu i hoverem. Props: `points [{label,value,extra?}]`,
  `refValue?/refLabel?`, `annexMarkers?` (zielone), `alerts?` (czerwone), `fmtTick?/fmtValue?`,
  `height`, `ariaLabel`. Hover: pionowa prowadnica + podświetlona kropka + dymek HTML.
- **Słupki/dwie osie → Recharts** (`BarChart/ComposedChart`), z regułą z §8:
  **`isAnimationActive={false}`** + aktualizacja danych **w miejscu** (bez `key` zależnego od
  danych — remount = re-measure = miganie).
  **NIE używać `ResponsiveContainer`** — mierzy szerokość przez `ResizeObserver` **async, PO
  pierwszym paincie** → wykres najpierw pusty, potem „doskakuje" (pop-in) i nie da się go
  zsynchronizować z żadnym revealem. Zamiast tego **`NcResponsive`**
  (`src/components/analytic/kit/NcResponsive.tsx`): mierzy kontener w **`useLayoutEffect` PRZED
  paintem** i wstrzykuje wykresowi stałe `width/height` → render synchroniczny w pierwszej klatce,
  jak SVG NcChart. Drop-in: `<ResponsiveContainer width="100%" height="100%">{chart}</…>` →
  `<NcResponsive>{chart}</NcResponsive>` (rodzic musi mieć wysokość).
  **Perf (obowiązkowe przy wielu wykresach):** ciężkie wykresy owijaj w **`React.memo`** i karm
  **stabilnymi (useMemo) danymi** — inaczej każdy re-render rodzica (tick suwaka) re-renderuje
  WSZYSTKIE wykresy mimo niezmienionych danych → lag.
  **„Budowanie" wejścia:** `NcResponsive` ma wbudowany `.nc-chart-build` (clip-wipe L→R, jak
  `chartReveal` na Main Page) — gra RAZ przy montażu (wejście w zakładkę); zmiana danych nie
  remontuje = brak powtórki i migania. NIE stosować już overlay `.nc-reveal` na wykresach Recharts
  (mistiming z async renderem — zastąpione synchronicznym `NcResponsive` + `.nc-chart-build`).

Styl finalny (obowiązuje oba):
- **linia danych: akcentowa** `className="ln-accent"` **2px** (rebrand: cieńsza, spokojniejsza);
  **kropki `circle.pt` OSZCZĘDNIE** — tylko ostatni punkt i punkty niosące informację (markery,
  hover-prowadnica), NIE na każdym punkcie danych (fill primary, stroke `--card` 1.4),
- siatka **kropkowana** pozioma `.grid` i pionowa `.vgrid` (`stroke-dasharray:2 4`, `--grid-line`),
- **referencja: szara przerywana** `.ln-ref` (`--chart-neutral`, `6 5`),
- bardzo subtelny gradient area (`.stop-accent` 0.08→0; rebrand: przyciszony), markery: alarm `.dot-alert` (czerwony),
  zdarzenie/aneks `.dot-annex` (zielony),
- osie: `.axis`, etykiety `.tick` 9.5px; chip adnotacji `.chipbg/.chiptext`,
- KPI nad wykresem: `.chart-kpi` (zawija się całymi blokami), podpis `.chart-sub`.
- **Kolory WYŁĄCZNIE tokenami/klasami CSS** (`stop-accent`, `ln-*`, `var(--funded/rejected/primary/
  chart-neutral)`) — **zero literałów hex/rgb w JSX/atrybutach SVG** → wykres przełącza się z
  motywem. Gdy Recharts wymaga stringa koloru, podaj `"var(--funded)"` itd. (SVG wspiera `var()`).
- **ZAKAZ pie/donutów wielobarwnych** — udziały procentowe robimy `NcDonut` (§16) albo `KitBar`.

## 12. Formularze

`.field` (label 12.5/700 + kontrolka + `.help`); wymagane `<span className="req">*</span>`.
Kontrolki `.input/.select/.textarea`: tło `--muted`, border `--input`, radius 10, focus =
akcentowy border + ring `0 0 0 3.5px rgba(168,180,194,.16)`. Wszystkie **kontrolowane** (`value` +
`onChange`). Checkboxy: `accent-color:var(--primary)` (globalnie). Błąd: `.err` (ceglany panel),
sukces: `.flash` (zielony panel, animowany).
**Grupowanie tysięcy na żywo**: pola kwotowe (`inputMode="decimal"`) formatują spacje tysięcy w
`onChange` z zachowaniem pozycji karetki; przy zapisie/wysyłce strippuj spacje przed parsowaniem.
Formularze inline w tabelach: `.inbox-actions` + `input.reason`. Przyciski submit: primary; anuluj:
ghost; układ `.row` / `.actions-bar` (z separatorem górnym).

### 12.1 Listy rozwijane — JEDEN standard (combobox, v1.2)

**Zasada:** wszystkie listy wyboru w aplikacji wyglądają i zachowują się IDENTYCZNIE.
Nie mieszać stylów (np. gdzieś natywny `<select>`, gdzie indziej searchable input) — to był
błąd sprzed v1.2. Kanoniczna lista to **searchable combobox**:

- **Trigger** = kontrolka `.input` (h-9, 12px) w układzie „label + wartość ... `chevron-l/r`",
  pełni rolę pola: pokazuje zaznaczoną etykietę, po prawej `chevron` (obraca się przy otwarciu).
- **Dropdown** = `.menu-list` kitu (§16), pozycjonowany pod triggerem na jego szerokość
  (`left:0;right:0`). Na górze pole wyszukiwania (`.input`-mini z ikoną `search`) — **typeahead
  filtruje po fragmencie** etykiety / wartości / opisu. Pozycje to `<button>` (wiersz: etykieta
  13px + opcjonalny `.sub` 10.5px `--muted-foreground`); aktywna = tło `--hover` (nawigacja
  `↑/↓`), zaznaczona = tekst akcentowy (`text-nc-accent`).
- **Klawiatura:** `↓`/`Enter`/`Space` otwiera; `↑/↓` przewija; `Enter` wybiera; `Esc` zamyka;
  klik poza zamyka. Zaznaczenie startowo scrolluje do widoku.
- **Kiedy `<select>` natywny:** dopuszczalny wyłącznie dla list ≤~5 pozycji stałych bez potrzeby
  szukania; nawet wtedy preferuj wspólny combobox dla spójności.
- **Komponent:** `NcSelect` (`src/components/analytic/kit/NcSelect.tsx`) — props
  `value/onChange/options[{value,label,sub?}]/label?/searchable?/widthClass?/placeholder?`.
  Używany dla WSZYSTKICH list (inwestycja, scope, status, sort…) — jedno źródło stylu i zachowania.
  Krótkie listy stałe (≤~5) mogą zostawić `searchable={false}` (bez pola szukania).

## 13. Overflow i skalowanie tekstu (obowiązkowe reguły)

1. **Grid blowout:** dzieci gridów mają `min-width:auto` → każdy kontener siatki dostaje
   `> * { min-width:0 }` (jest dla `.bento/.req-grid/.proj-grid/.page-head`).
2. **Ellipsis NIE działa na inline-flex** — element z `text-overflow:ellipsis` musi być
   `inline-block/block` + `overflow:hidden` + `nowrap` (wzór `.rc-cat`).
3. **Kwoty i daty nigdy nie łamią się w środku** — `white-space:nowrap` (`.nowrap`, `.rc-due`);
   przy braku miejsca cały element przenosi się do nowej linii (rodzic `flex-wrap`).
4. **Duże liczby KPI skalują font zamiast się zawijać:** `font-size:clamp(20px,1.1vw+13px,28px)`
   + `nowrap` (`.stat .val`); w wykresach `clamp(17px,1vw+13px,22px)`.
5. Długie tytuły stron: `overflow-wrap:anywhere` na `h1`.
6. Wartości w siatkach kart: `nowrap` (`.proj-kpis .v`).

## 14. Responsywność — drabinka breakpointów

| Próg | Co się dzieje |
|---|---|
| **≤1500px** | kafle KPI `col-3` → 2×2 (`span 6`) — laptop z sidebar'em 250px |
| **≤1250px** | `col-4/6/8` → pełna szerokość (wykresy jeden pod drugim); `.main` padding 20/22 |
| **≤900px** | shell się składa: brand znika, sidebar = poziomy pasek scroll-x (`.navwrap` flex:none — bez ściskania; indicator off; „Menu aplikacji" dosunięte `margin-left:auto`; nav-user/nav-role ukryte), page-head w kolumnę, karty span 12, `.data-table` scroll-x (w `.table-wrapper`: display:table + scrollbox 70vh), `.sub-actions` do własnej linii |
| **≤560px** | kompakcja telefonu: węższe kolumny macierzy (104/150px), mniejsze pille i przyciski, kompaktowe komórki tabel (td 12.5px/8px padding), ukryte podpisy, `.main` padding 10/8 |

Bloki KPI zawijają się JAKO CAŁOŚĆ (`flex-wrap` na kontenerze + `nowrap` w środku) — nigdy
zgniatanie w pionie. Macierz na mobile pozostaje scrollowalna poziomo (drag-to-pan) — to jest
akceptowany wzorzec dla data-dense. Docelowo PWA (manifest — TODO v2).

## 15. Tooltip i modal

**Tooltip `#nc-tip`** (singleton — hook `useNcTooltip` montowany raz w `AppShell`): `data-tip="tekst"`
na dowolnym elemencie → dymek podąża za kursorem z clampem do viewportu; `data-tip-html` dla
bogatej treści (tabelki, sekcje `.tip-section`, wiersze `.tip-note` ze stalowym tintem i 1px ramką).
Zakaz natywnego `title=` dla treści merytorycznych. `span[data-tip]` dostaje `cursor:help`.
**Uwaga:** `disabled` element nie emituje `mouseover` — `data-tip` daj na `<span>` opakowujący
disabled button.

**Modal**: **warunkowy render w React** (`{open && <Modal … />}`) — overlay `.modal-overlay-c`
**z modyfikatorem `.open`** (`display:flex`; bazowa klasa jest `display:none` dla legacy SSR — w
React ZAWSZE dodaj `open`, inaczej modal jest niewidoczny). Karta `.modal-c` lub `.card` (dla
szerokich, np. z wykresami), zamykacz `.modal-close` z `<X className="navitem-ico" />`; `Escape`
zamyka (listener w `useEffect`), klik w overlay zamyka (`stopPropagation` na karcie); animacja
`cardIn`. Portal do `document.body` gdy overlay jest w kontenerze z `transform`/`.nc-tab-swap`
(inaczej `position:fixed` zostaje uwięziony).

## 16. Biblioteka bloków ekstra (klasy w `company-ui.css`, sekcja EXTRA COMPONENTS)

Gotowe klasy — buduj z nich w JSX (layout Tailwindem, wygląd klasami kitu). Prymitywy
`StatCard`, `NcDonut`, `NcSelect`, `KitBar`, `NcChart` są komponentami (patrz §0). Reszta to
klasy CSS:

```tsx
{/* attention dot — "wymaga uwagi" na dowolnym elemencie */}
<button className="btn btn-secondary attn">Inbox</button>

{/* progress bar (KitBar) — udział/postęp */}
<KitBar pct={62} />                 {/* akcent stalowy (domyślne) */}
<KitBar pct={100} variant="ok" />   {/* zieleń = sukces; 'bad' = ceglany; 'grad' = gradient */}

{/* toast — hook/context ncToast(msg, kind?) montowany raz w AppShell (kontener .toast-wrap) */}
ncToast("Zapisano", "ok");   {/* kind: undefined | 'ok' | 'bad' */}

{/* skeleton loading */}
<div className="skel" style={{ width: "60%", height: 16 }} />
<div className="skel" style={{ width: "100%", height: 120, marginTop: 8 }} />

{/* timeline (li.done=zielony, li.bad=ceglany) */}
<ul className="tl">
  <li className="done"><span className="tl-time">2026-07-08 09:12</span><strong>Zatwierdzono</strong> — Mateusz</li>
  <li className="bad"><span className="tl-time">2026-07-07 15:40</span>Odrzucono pozycję</li>
  <li><span className="tl-time">2026-07-07 11:05</span>Wysłano do decyzji</li>
</ul>

{/* kroki wizarda */}
<div className="steps">
  <span className="step done"><span className="step-dot"><Check className="st-ico" /></span><span className="step-lbl">Dane</span></span>
  <span className="step-line done" />
  <span className="step active"><span className="step-dot">2</span><span className="step-lbl">Pozycje</span></span>
  <span className="step-line" />
  <span className="step"><span className="step-dot">3</span><span className="step-lbl">Wysyłka</span></span>
</div>

{/* dropdown menu (grupa akcji, bez JS — natywne <details>) */}
<details className="menu">
  <summary className="btn btn-secondary"><Download className="navitem-ico" />Export</summary>
  <div className="menu-list">
    <a href="/export/x.xlsx"><Table className="navitem-ico" />Excel</a>
    <a href="/export/x.pdf"><FileText className="navitem-ico" />PDF</a>
    <button type="button" onClick={() => window.print()}><ExternalLink className="navitem-ico" />Drukuj</button>
  </div>
</details>
{/* UWAGA: dla wyboru wartości NIE używaj tego — użyj NcSelect (§12.1). */}

{/* taby (podkreślenie) — dla sub-widoków bez sidebara */}
<div className="tabs">
  <button className={`tab${tab === "overview" ? " active" : ""}`} onClick={() => setTab("overview")}>Przegląd</button>
  <button className={`tab${tab === "history" ? " active" : ""}`} onClick={() => setTab("history")}>Historia</button>
</div>

{/* delta trendu */}
<span className="delta up">▲ 4,2%</span> <span className="delta down">▼ 1,8%</span>

{/* pager */}
<nav className="pager">
  <a href="?p=1"><ChevronLeft className="ico-12" /></a>
  <span className="cur">2</span>
  <a href="?p=3">3</a>
  <a href="?p=3"><ChevronRight className="ico-12" /></a>
</nav>

{/* kalendarz (miesiąc) — dni z .map() */}
<div className="card cal">
  <div className="cal-head">
    <button className="btn btn-ghost btn-sm btn-ico"><ChevronLeft className="navitem-ico" /></button>
    <strong>Lipiec 2026</strong>
    <button className="btn btn-ghost btn-sm btn-ico"><ChevronRight className="navitem-ico" /></button>
  </div>
  <div className="cal-grid">
    {["Pn","Wt","Śr","Cz","Pt","So","Nd"].map((d) => <span key={d} className="cal-dow">{d}</span>)}
    {days.map((d) => (
      <button key={d.iso} className={`cal-day${d.isOut ? " is-out" : ""}${d.isToday ? " is-today" : ""}${d.hasDot ? " has-dot" : ""}${d.isSel ? " is-sel" : ""}`}>
        {d.day}
      </button>
    ))}
  </div>
</div>

{/* empty state */}
<div className="empty">
  <Inbox className="e-ico" />
  <div className="e-title">Skrzynka pusta</div>
  <p>Nowe zgłoszenia pojawią się tutaj.</p>
  <a className="btn btn-primary" href="/new">Utwórz pierwsze</a>
</div>

{/* segmented control (przełącznik widoku, np. Dzień/Tydzień) */}
<div className="seg">
  <a className={period === "d" ? "active" : ""} onClick={() => setPeriod("d")}>Dzień</a>
  <a className={period === "w" ? "active" : ""} onClick={() => setPeriod("w")}>Tydzień</a>
</div>

{/* donut / pierścień — NcDonut (§0). Udział % pojedynczej metryki: JEDEN łuk
    (round linecap) na neutralnym torze; wariant 'accent'(domyśl.)/'ok'(zieleń)/
    'bad'(ceglany). Środek = duża liczba (.tnum). ZAKAZ pie/donutów wielobarwnych. */}
<NcDonut label="Tasks" value={47} variant="ok" size={132} />
```

## 17. Checklist przed oddaniem ekranu

- [ ] Komponenty z klas/komponentów kitu (`.card/.btn/.st/.nc-*`, `StatCard/NcDonut/NcSelect/…`);
      Tailwind tylko do layoutu — nie odtwarzać przycisku/chipu/karty w utility.
- [ ] Zero literałów hex/rgb koloru w JSX (SVG/Recharts — tokeny `var(--…)` / klasy `.ln-*` `.st-*`).
- [ ] Statusy przez `.st st-*` + ikona lucide; ikony przez `lucide-react` (klasa rozmiaru); żadnych emoji/glyphów.
- [ ] Kwoty `.tnum`, format pl-PL/en-US wg waluty; `nowrap` na kwotach i datach.
- [ ] Guard `min-width:0` na nowych gridach; ellipsis wg §13.2.
- [ ] Sticky elementy z opaque tłem; scrim na treści leżącej na tle.
- [ ] `data-tip` zamiast `title` (na `<span>` gdy element disabled); potwierdzenia destrukcyjne z `.btn-danger`.
- [ ] Wykresy Recharts: `isAnimationActive={false}`, aktualizacja danych w miejscu (BEZ `key`
      od danych — remount miga); wejście przez `.nc-tab-swap` (§8). NIGDY animacja JS Recharts.
- [ ] Listy wyboru = `NcSelect` (§12.1); modal = warunkowy render + `.modal-overlay-c open`.
- [ ] Sprawdzone na 1920 / 1400 / 1250 / 900 / 430 px, w obu motywach, `prefers-reduced-motion`.
- [ ] `npx vite build` przechodzi bez błędów; nowy hash w `dist/assets/`.

**TODO:** manifest PWA (jest w Budget Tracking — do wyniesienia jako wzorzec), potwierdzenia
modalne zamiast `window.confirm()`, wyniesienie komponentów kitu do osobnego pakietu npm
(`@company/ui`) dla współdzielenia między aplikacjami.
