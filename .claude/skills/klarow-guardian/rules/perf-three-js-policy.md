---
id: perf-three-js-policy
title: three.js (GLSL Hills) tylko jako plan B: desktop pointer fine, montaż po idle po load, saveData gate, poza pierwszym JS, nigdy z wideo; usunąć z dependencies, gdy hero-loop przejdzie
impact: HIGH
tags: [perf, three, webgl, background, bundle]
source: synthesis §2.6.3/§1.3 P7 · site-audit §1.7/§1.9/§3.1 p.2 · feasibility-perf §5.2 p.5 · glsl-hills.tsx (wzorzec GPU-higieny) · higgsfield §9 werdykt
added: 2026-09-12
---

## Zasada

Decyzja dwustopniowa (D-08):

**Faza 0**: `GLSLHills` schodzi z bundla `/` (usunąć `lazy(() => import("@/components/ui/glsl-hills"))` i `useAnimatedBg()` z `App.tsx`; plik `glsl-hills.tsx` + `BgBoundary.tsx` zostają w repo jako wzorzec GPU-higieny cytowany przez strażnika).

**Po trialu Higgsfield**:
- hero-loop zaakceptowany → `three` i `@react-three/fiber` usunięte z `site/package.json` (−118 KB gz na wizytę desktop), `glsl-hills.tsx` przeniesiony do `refs/` albo skasowany w tym samym commicie (zero martwego kodu), `@types/three` usunięte;
- hero-loop odrzucony → GLSL Hills wraca jako tło `/` (i tylko `/`) na warunkach:
  1. montaż wyłącznie na `(pointer: fine)` (`perf-no-webgl-on-coarse`), przy `!prefers-reduced-motion` (reduced → jedna klatka jak dziś `glsl-hills.tsx:224-255`), przy `!navigator.connection.saveData`, przy `MEDIA_ENABLED`,
  2. chunk lazy dociągany po `window.load` + `requestIdleCallback` (nigdy w `modulepreload`, nigdy przed LCP),
  3. w `.bg-layer` (`media-video-placement`), pod `BgBoundary`, bez `zoomRef` (relikt decka), `PlaneGeometry` 160×160 zamiast 256×256 (test jakości na 1440p), throttle 30 fps, pauza `document.hidden`, pełny cleanup (rAF cancel, `dispose()` geometrii/materiału/renderera, `removeEventListener`),
  4. `HeroMedia` renderuje wtedy wyłącznie poster (`media-one-autoplay-per-route`: nigdy wideo + WebGL),
  5. transfer desktop `/` ≤ 2,5 MB z uwzględnieniem chunku three.

Zakazane w każdej fazie: three w drzewie Motion (`motion/three`, `threeEffect`), drugi canvas WebGL, `@react-three/fiber` (niepotrzebny wrapper; obecny `glsl-hills.tsx` używa czystego three), canvas na trasach innych niż `/`.

## Mechanizm awarii (dlaczego)

- Dziś three.js = 471 KB / 118 KB gz na KAŻDEJ wizycie desktop (site-audit §1.9), plus siatka 256×256 = ~66 k wierzchołków animowanych w vertex shaderze przy 30 fps; na laptopach z GPU zintegrowanym równolegle z dashboardami to jank (feasibility-perf §5.2 p.5).
- „Szybkość jako część przekazu" (wdrożenie w dni): 118 KB dekoracji przeczy temu na pierwszej wizycie.
- Bug iOS 2026-07-24: canvas `fixed` WebGL komponowany nad treścią; `pointer: coarse` = nic ruchomego.
- Pakiet w `dependencies` bez importu = martwy kod, który wraca przy pierwszym „a może dodamy tło" bez decyzji.

## Niepoprawnie

```tsx
// App.tsx (stan obecny, do zmiany w fazie 0)
const GLSLHills = lazy(() => import("@/components/ui/glsl-hills").then((m) => ({ default: m.GLSLHills })));
const animatedBg = useAnimatedBg();
{animatedBg ? <BgBoundary><Suspense fallback={null}><GLSLHills width="100%" height="100%" speed={0.2} zoomRef={zoomRef} /></Suspense></BgBoundary> : null}
<Hero><HeroMedia /></Hero>   // wideo + WebGL naraz
```

## Poprawnie

```tsx
// App.tsx (plan B po D-08; plan A = ten blok nie istnieje, three poza package.json)
function useIdleDesktopBg(): boolean {
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!MEDIA_ENABLED) return;
    if (!matchMedia("(pointer: fine)").matches) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const c = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (c?.saveData) return;
    let cancel: (() => void) | null = null;
    const arm = () => { cancel = idle(() => setOn(true), 2000); };
    if (document.readyState === "complete") arm(); else window.addEventListener("load", arm, { once: true });
    return () => { window.removeEventListener("load", arm); cancel?.(); };
  }, []);
  return on;
}
const GLSLHills = lazy(() => import("@/components/ui/glsl-hills").then((m) => ({ default: m.GLSLHills })));
const bg = useIdleDesktopBg();
<div className="bg-layer" aria-hidden="true">
  {bg ? <BgBoundary><Suspense fallback={null}><GLSLHills width="100%" height="100%" speed={0.2} planeSize={160} /></Suspense></BgBoundary> : null}
</div>
<Hero><HeroMedia videoAllowed={false} /></Hero>
```

## Test

```bash
# plan A (po akceptacji hero-loop): three nieobecne
node -e 'const p=require("./site/package.json");for(const k of ["three","@react-three/fiber"])if(p.dependencies[k])console.log("three nadal w dependencies:",k)'
grep -rnE 'glsl-hills|GLSLHills|from "three"' site/src   # = 0
# plan B: warunki montażu
grep -nE '\(pointer: fine\)' site/src/App.tsx; grep -nE 'saveData' site/src/App.tsx; grep -nE 'readyState === "complete"|addEventListener\("load"' site/src/App.tsx; grep -nE 'requestIdleCallback' site/src/App.tsx
grep -nE 'zoomRef' site/src/App.tsx site/src/components/ui/glsl-hills.tsx    # = 0 (relikt usunięty)
grep -nE 'planeSize=\{160\}|PlaneGeometry\(160' site/src                      # ≥ 1
# nigdy w chunkach krytycznych
for f in $(grep -oE '/assets/[^"]+\.js' site/dist/index.html | sort -u); do grep -lE 'WebGLRenderer|THREE' "site/dist$f"; done   # = 0
grep -nE 'modulepreload[^>]*glsl' site/dist/index.html   # = 0
# GPU-higiena w glsl-hills.tsx (jeśli zostaje)
for k in cancelAnimationFrame 'document.hidden' visibilitychange 'prefers-reduced-motion' 'dispose\(\)' 'removeEventListener'; do grep -qE "$k" site/src/components/ui/glsl-hills.tsx || echo "BRAK $k"; done
# runtime: WebKit 390×844 → canvas = null; desktop → canvas pojawia się dopiero po load (Performance: chunk three po LCP)
```

## Wyjątki

- `BgBoundary.tsx` może zostać jako komponent bazowy dla `MediaBoundary` także w planie A.
- Sonda WebGL na osobnym canvasie z `loseContext` (`glsl-hills.tsx:164-167`) jest częścią wzorca i zostaje przy planie B.
