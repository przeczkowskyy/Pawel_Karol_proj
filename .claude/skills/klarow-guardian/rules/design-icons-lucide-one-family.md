---
id: design-icons-lucide-one-family
title: Ikony wyłącznie lucide-react, strokeWidth 1.5 domyślnie (1.75 tylko dla ikon 16 px), rozmiary z mapy, zero emoji i glifów
impact: MEDIUM
tags: [design, icons, lucide, a11y, emoji]
source: company-ui §6 (jedna biblioteka, stała mapa znaczeń, zakaz emoji/glyphów) / taste §3.C („One family per project", „Standardize strokeWidth globally"), §3.D / taste.md §11.2 (lucide zostaje: project already depends) / ui-kit-habits.md D3 / synthesis §2.5.5 i §2.3 S5 (strokeWidth 1.5; 16 px: 1.75)
added: 2026-09-12
---

## Zasada

Jedna rodzina ikon: **`lucide-react`** (projekt już od niej zależy; taste §3.C dopuszcza). Grubość
kreski ustawiana raz, przez wrapper `Icon` (albo domyślne `LucideProps`), wg jednej tabeli
(synthesis §2.5.5): **`strokeWidth` 1.5 dla rozmiarów 20, 24 i 32 px (domyślny)** oraz
**1.75 WYŁĄCZNIE dla ikon 16 px** (mała ikona z 1.5 gubi kreskę w chipie `.st` i w parze ✕/✓).
Wartość wynika z rozmiaru, nie z widzimisię autora: wrapper liczy ją sam (`size === 16 ? 1.75 : 1.5`),
więc w JSX nie podaje się `strokeWidth` ręcznie. Rozmiary tylko z mapy **{16, 20, 24, 32}** przez prop `size`, `aria-hidden` gdy obok tekstu, `aria-label`
(albo `<span className="sr-only">`) gdy ikona jest sama. Stała mapa znaczeń (Check = sukces,
X = zamknij, Clock = oczekuje, Download = pobierz, TriangleAlert = ostrzeżenie, Lock = on-prem,
BarChart3/Banknote/HardHat/FileSpreadsheet/Stamp = działy). Zakazane: druga biblioteka
(Phosphor, Heroicons, FontAwesome), emoji w kodzie, treści, nagłówkach i `alt`, glify tekstowe
(`▲ ▼ ✓ ✕ → ⓘ ›`) jako ikony, ręczne `<path>` ikon, `strokeWidth` ad hoc (1.2/1.4/2.5) i `strokeWidth`
1.75 na ikonie większej niż 16 px.

## Mechanizm awarii (dlaczego)

Dwie rodziny ikon w jednym drzewie = dwa rysunki linii obok siebie (taste §3.C). Emoji renderują się
inaczej na Windows/iOS/Android, łamią monochrom stali i nie mają semantyki dla czytników.
Glify tekstowe (`▲ 4,2%` w `.delta` kitu) mają inny baseline i wagę niż tekst. `strokeWidth`
rozjeżdża się dziś w `CollaborationFlow.tsx` (1.2/1.4/1.6) i chipach kitu (`stroke-width: 2.5`).
Jedna wartość globalna też nie działa: 1.5 na ikonie 16 px znika przy 100 % jasności na OLED, a 1.75
na ikonie 24/32 px pogrubia rysunek i wybija ikonę ponad tekst obok (dlatego synthesis §2.5.5
rozdziela 1.5 / 1.75 wg rozmiaru).
Rozmiar propem jest praktyką strony (84 użycia) i zostaje; mapa 4 rozmiarów zamiast 12/14/15/18
ad hoc daje rytm.

## Niepoprawnie

```tsx
import { CheckCircle } from "@heroicons/react/24/outline";
<span>✓ Zapisano</span>
<Check size={15} strokeWidth={2.5} />       {/* rozmiar spoza mapy, grubość ad hoc */}
<Info size={24} strokeWidth={1.75} />       {/* 1.75 poza 16 px */}
<Check size={16} strokeWidth={1.5} />       {/* 16 px musi mieć 1.75 */}
<button><Download /></button>            {/* ikona solo bez etykiety */}
<h2>🚀 Co budujemy</h2>
<svg><path d="M4 4l8 8 …" /></svg>        {/* ręczna ikona */}
```

## Poprawnie

```tsx
// components/ui/Icon.tsx: jedyne miejsce, w którym pada strokeWidth
import type { LucideIcon } from "lucide-react";
type IconSize = 16 | 20 | 24 | 32;
export function Icon({ as: Glyph, size = 20, ...rest }: { as: LucideIcon; size?: IconSize } & React.SVGProps<SVGSVGElement>) {
  return <Glyph size={size} strokeWidth={size === 16 ? 1.75 : 1.5} {...rest} />;
}
```

```tsx
import { Check, Download } from "lucide-react";
<span className="st st-accent"><Icon as={Check} size={16} aria-hidden /> Zapisano</span>          {/* 16 px → 1.75 */}
<button className="btn btn-secondary" aria-label="Pobierz PDF"><Icon as={Download} size={20} aria-hidden /></button>   {/* 20 px → 1.5 */}
<h2>Co budujemy</h2>
```

## Test

```bash
# inne biblioteki ikon: 0 trafień (exit 1 = PASS; „OK" potwierdza, że komenda się wykonała)
grep -rnE "from \"(@heroicons|@phosphor-icons|react-icons|@tabler|@fortawesome)" site/src || echo OK
# emoji i glify w TSX/danych: 0 trafień. LC_ALL OBOWIĄZKOWE — bez niego GNU grep 3.0 w Git Bash
# kończy się „grep: -P supports only unibyte and UTF-8 locales”, exit 2 i PUSTYM wyjściem,
# co wygląda jak PASS (awaria narzędzia ≠ brak naruszeń; patrz rules/_sections.md).
LC_ALL=C.UTF-8 grep -rnP "[\x{1F300}-\x{1FAFF}\x{2600}-\x{27BF}]|[▲▼✓✕✔✖→›ⓘ]" site/src --include=*.tsx --include=*.ts; ec=$?
case $ec in 1) echo "OK (0 trafień)";; 0) echo "FAIL (trafienia wyżej)";; *) echo "BŁĄD NARZĘDZIA (exit $ec) — NIE SPRAWDZONO, nie PASS";; esac
# stan zastany (2026-09-12): 21 plików z glifami, w tym Differentiators.tsx:8 i :190 (✕ / ✓);
# większość to „→” w komentarzach — do wymiany razem z migracją na wrapper Icon (dług fazy 1)
# strokeWidth w JSX poza wrapperem Icon.tsx: 0 trafień (grubość wynika z rozmiaru)
grep -rnE "strokeWidth" site/src --include=*.tsx | grep -v "components/ui/Icon.tsx"
# gdyby strokeWidth zostawał lokalnie: 1.75 tylko z size={16}, reszta 1.5
grep -rnoE "size=\{16\}[^>]*strokeWidth=\{?1\.5\}?|size=\{(20|24|32)\}[^>]*strokeWidth=\{?1\.75\}?" site/src --include=*.tsx
grep -rnoE "size=\{[0-9]+\}" site/src --include=*.tsx | grep -vE "\{(16|20|24|32)\}"
# ikona solo bez aria-label (przegląd trafień)
grep -rnE "<button[^>]*>\s*<[A-Z][A-Za-z]+ (size|strokeWidth)" site/src --include=*.tsx | grep -v "aria-label"
```

## Wyjątki

Ręczne `<path>` dozwolone w diagramach z danymi: `CollaborationFlow`, `KsefFlow`, ilustracje
case (SVG z `role="img"` + `aria-label`), wykresy dashboardów. `strokeWidth` w tych diagramach
z tokenów geometrii (stała modułu), nie per-ścieżka. Ikony 12 px w chipach `.st-ico` kitu
(tryb `tool`) zostają do migracji na mapę.
