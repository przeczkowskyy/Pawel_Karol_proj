# Nc Launcher — nawigacja v2.0 (React) · odpis referencyjny

**Standard nawigacji kitu**: zamiast lewej listy zakładek — pływające kółko z neutralną
ikoną menu (lucide `LayoutGrid`, bez logo) w **prawym dolnym rogu**. Klik rozwija **główne
kategorie**; klik kategorii podświetla ją (rosnący akcentowy border = „jesteś w tej kategorii")
i odsłania pod nią jej **narzędzia**. Wyjęte 1:1 z aplikacji referencyjnej — działa produkcyjnie.

## Pliki (kanoniczne, copy-paste)

| Plik | Rola |
|---|---|
| `NcLauncher.tsx` | komponent launchera (FAB + panel kategorii + narzędzia, stan open/aktywna kategoria, Escape/klik-poza zamyka) |
| `BrandMark.tsx` | tekstowy wordmark-placeholder „KLAROW" (`.brand-word`) — róg topbara; podmiana nazwy = jedno miejsce |
| `nc-launcher.css` | style launchera — **część kitu** (wkleić do `company-ui.css` NAD markerem „APP-SPECIFIC") |

## Zachowanie (standard)

- **FAB** `.nc-launcher-fab` — kółko 60px w prawym dolnym rogu, w środku ikona `LayoutGrid`
  (`.nc-fab-ico`). Hover/otwarcie = akcentowy pierścień. Klik → toggle panelu.
- **Panel** `.nc-launcher-panel` — zsuwa się nad FAB (fade + translateY + scale), `transform-origin:bottom right`.
- **Kategoria** `.nc-cat` → aktywna `.nc-cat.active`: **border rośnie** (1.5px→2px, akcentowy) + poświata.
  Akordeon: jedna kategoria otwarta naraz (chevron obraca się 180°).
- **Narzędzia** `.nc-cat-tools` — collapse (`max-height` 0 → limit); **MAX 5 widocznych naraz,
  reszta na scrollu** (`overflow-y:auto`, cienki akcentowy scrollbar jako hint). Pozycje `.nc-tool`
  mają `flex:0 0 auto`, żeby się nie ściskały tylko realnie przewijały.
- **Dostępność:** `aria-expanded` na FAB i nagłówkach kategorii, `role="menu"`, zamykanie Escape
  i kliknięciem poza launcherem; `prefers-reduced-motion` wygasza animacje.

## Wpięcie w aplikację

1. **Usuń „Main Page" (Dashboard) z lewej listy** — w konfiguracji nawigacji (np. `navConfig.ts`)
   wyrzuć pozycję landingową z tablicy zakładek. Widok może zostać w routingu; przestaje być zakładką.
2. **Zamontuj launcher w shellu** — `<NcLauncher />` na końcu `AppShell` (pływa nad całym UI, `position:fixed`).
3. **Wklej `nc-launcher.css`** do `company-ui.css` **nad** markerem `APP-SPECIFIC` (to standard kitu, nie kod appki).
4. **Ikony:** `lucide-react` (`Factory`, `Wallet`, `ShieldCheck`, `ChevronDown`, `Dot`, `LayoutGrid`).
   Tokeny: `--primary` `--card` `--border` `--muted` `--muted-foreground` `--accent-foreground` `--motion`.

## Konfiguracja treści

Kategorie i narzędzia to tablica `NC_CATEGORIES` w `NcLauncher.tsx`. Placeholdery generuje
helper `ph(n)` → „Place Holder 1..n". Podmień na realne kategorie/narzędzia i podłącz routing
(`onClick` na `.nc-tool`). Liczba widocznych narzędzi = `max-height` aktywnej listy w CSS
(`.nc-cat.active .nc-cat-tools`, ~5 wierszy × ~34px + padding).

> **Uwaga (stack):** launcher jest pierwszym komponentem **kitu v2.0 (React)**. `nc-launcher.css`
> jest przenośny (czyste tokeny + klasy) — w wariancie vanilla wystarczy odtworzyć logikę open/
> aktywna-kategoria w JS. Reszta SKILL.md opisuje jeszcze bazę v1 (Jinja/SSR) — pełny przełącznik
> na v2.0 to osobny krok.
