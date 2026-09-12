---
id: motion-tier-flag
title: Jeden kill-switch ruchu i mediów: MOTION_TIER full/still/calm w tokens.ts, z którego wynika MEDIA_ENABLED; nigdy druga ścieżka renderu
impact: MEDIUM
tags: [motion, media, kill-switch, flags]
source: synthesis §1.4 (kill-switch → MEDIA_ENABLED) i §1.6 (MOTION_TIER jako druga ścieżka: odrzucone) · showreel §5.9 „Tryb awaryjny" · feasibility-perf §4.3 p.6
added: 2026-09-12
---

## Zasada

W `site/src/motion/tokens.ts` istnieje dokładnie jedna stała trybu i jedna pochodna:

```ts
export const MOTION_TIER: "full" | "still" | "calm" = "full";   // "still" = media off; "calm" = tryb awaryjny całego ruchu
export const MEDIA_ENABLED = MOTION_TIER === "full";             // wideo hero, klipy hover ściany, GLSL Hills (plan B)
```

Semantyka trzech wartości:

1. **`full`**: wszystko działa.
2. **`still` (kill-switch mediów, od 2026-09-12)**: `MEDIA_ENABLED = false` → `HeroMedia` renderuje wyłącznie poster `<img>` (kadr produktu), klipy hover w `ToolWall` i tło three.js nie montują się. **`MotionProvider` zostaje na `reducedMotion="user"`**: reveale, `PageFade`, dialog i `ChaosToOrder` działają bez zmian.
3. **`calm` (tryb awaryjny)**: `still` plus `MotionProvider` przekazuje `reducedMotion="always"` → wszystkie `m.*` tracą transformy, zostaje `opacity` (identycznie jak przy systemowym reduced-motion); `ChartReveal` i `ChaosToOrder` czytają `useReducedMotion()` → `initial={false}`.

Po co trzecia wartość: wycofanie wideo ma być wykonane **w minutę, pod presją** (`docs/plan/warstwa-wrazenia.md` §8, poziom W0). Dopóki jedyną drogą do wyłączenia mediów było `calm`, gaszenie jednego `<video>` spłaszczało całą stronę, więc founder się wahał i awaria trwała dłużej. `still` nie dokłada ani jednego `if` w komponentach.

Konsekwencja: żadna wartość NIE dodaje wariantu renderu. Stała jest czytana w DOKŁADNIE czterech miejscach: `provider.tsx` (reducedMotion), `HeroMedia.tsx` (`wantsVideo()` przez `MEDIA_ENABLED`), `ToolWall.tsx` (klipy hover przez `MEDIA_ENABLED`) i `App.tsx`/`useAnimatedBg` (plan B GLSL). Każde inne odwołanie do `MOTION_TIER`/`MEDIA_ENABLED` w `site/src` = fail. Zakazane: warianty renderu `tier === "calm" ? <A/> : <B/>`, osobne komponenty `*Calm`, drugi zestaw presetów, flagi per sekcja.

Zmiana wartości = commit z komunikatem `Motion: tryb still (powód: …)` albo `Motion: tryb calm (powód: …)` i wpis w „Stanie operacyjnym" CLAUDE.md.

## Mechanizm awarii (dlaczego)

- Showreel proponował `MOTION_TIER="calm"` jako alternatywną ścieżkę renderu (bez pinowania/parallaxu/hover-wideo); sędzia wykonalności odrzucił: „każdy komponent ma dwie ścieżki" = trzykrotny koszt utrzymania i testów (każdy audyt ×2, każdy zrzut ×2). Synteza zastąpiła to jednym booleanem `MEDIA_ENABLED`.
- Tryb awaryjny jest potrzebny (incydent iOS „samo tło" 2026-07-24 pokazał, że trzeba umieć wyłączyć media jedną linią bez przebudowy), ale musi być konfiguracją providera, nie logiką w komponentach.
- Flaga rozsiana po komponentach dryfuje: jedna sekcja ją sprawdza, druga nie; po pół roku nikt nie wie, co `calm` naprawdę wyłącza.

## Niepoprawnie

```tsx
// Bento.tsx
import { MOTION_TIER } from "@/motion/tokens";
return MOTION_TIER === "calm" ? <BentoStatic cells={cells} /> : <BentoAnimated cells={cells} />;   // druga ścieżka renderu

// presets.ts
export const fadeUp = MOTION_TIER === "calm" ? fadeCalm : fadeFull;   // drugi zestaw presetów

// .env / import.meta.env.VITE_MOTION_TIER   // konfiguracja poza tokens.ts; niedeterministyczny build
```

## Poprawnie

```tsx
// src/motion/tokens.ts
export const MOTION_TIER: "full" | "still" | "calm" = "full";
export const MEDIA_ENABLED = MOTION_TIER === "full";

// src/motion/provider.tsx
import { MOTION_TIER, DUR, EASE_OUT } from "./tokens";
<MotionConfig reducedMotion={MOTION_TIER === "calm" ? "always" : "user"} transition={{ duration: DUR.base, ease: EASE_OUT }}>
// „still" świadomie NIE przełącza reducedMotion: gasi wyłącznie media

// src/components/HeroMedia.tsx i src/components/ToolWall.tsx (klipy hover)
import { MEDIA_ENABLED } from "@/motion/tokens";
function wantsVideo() { if (typeof window === "undefined" || !MEDIA_ENABLED) return false; /* …reduced/coarse/saveData… */ }

// src/App.tsx (plan B tła; tylko jeśli GLSL Hills wraca po D-08)
const animatedBg = useAnimatedBg() && MEDIA_ENABLED;
```

## Test

```bash
# definicja dokładnie raz, w tokens.ts
grep -rnE 'export const MOTION_TIER' site/src | wc -l          # = 1 (site/src/motion/tokens.ts)
grep -rnE 'export const MEDIA_ENABLED' site/src | wc -l        # = 1 (site/src/motion/tokens.ts)
# odwołania tylko w trzech dozwolonych plikach
grep -rlE 'MOTION_TIER|MEDIA_ENABLED' site/src | grep -vE 'motion/tokens\.ts|motion/provider\.tsx|components/HeroMedia\.tsx|components/ToolWall\.tsx|App\.tsx'   # = 0
grep -nE 'MOTION_TIER: "full" \| "still" \| "calm"' site/src/motion/tokens.ts   # = 1 (trzy wartości)
# brak drugiej ścieżki renderu i env
grep -rnE 'Calm\b|calm\s*\?|=== "calm" \?' site/src --include=*.tsx | grep -v provider.tsx   # = 0
grep -rnE 'VITE_MOTION|VITE_MEDIA' site/ .env* 2>/dev/null                                    # = 0
# smoke W0: ustawić "still", build, WebKit desktop: brak <video> i brak klipów hover, ale reveale i PageFade DZIAŁAJĄ; wrócić do "full".
# smoke tryb awaryjny: ustawić "calm": brak <video> ORAZ reveale spłaszczone do opacity; wrócić do "full".
```

## Wyjątki

- Brak. Testy jednostkowe mogą mockować `MEDIA_ENABLED` przez `vi.mock`/`t.mock` bez zmiany pliku.
