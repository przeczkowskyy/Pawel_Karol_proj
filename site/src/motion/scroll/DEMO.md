# Biblioteka scroll-motion

Ruch sterowany POSTĘPEM PRZEWIJANIA, nie zegarem. Widz przesuwa palec, wykres
rośnie; zatrzyma, wykres staje; cofnie, wykres się cofa. To jest różnica między
„coś mignęło" a „ja to zrobiłem".

Wszystkie cztery komponenty trzymają te same twarde warunki:

| warunek | jak spełniony |
|---|---|
| `prefers-reduced-motion` | gałąź `useReducedMotion()` renderuje STAN KOŃCOWY bez ruchu, nigdy początkowy i nigdy pustkę |
| tylko własności GPU | wyłącznie `transform` i `opacity`; zero `width`, `height`, `top`, `left` w animacji |
| zero listenerów scrolla | postęp bierze `useScroll` z `motion/react` |
| sprzątanie | `useMotionValueEvent` odpina się sam; `useScroll` sam zdejmuje obserwatory |
| warstwy GPU | podpowiedź kompozytora włącza i zdejmuje `useScrollWillChange` (plik wewnętrzny, poza `index.ts`) |
| determinizm | zero `Math.random` i `Date.now`; rozrzut liczy hash `frac(sin(i · 12.9898) · 43758.5453)` |

**Nie importuj tych komponentów w `src/prerender/entry.tsx`.** Shell statyczny
ma nieść treść bez biblioteki ruchu (reguła `motion-no-motion-in-prerender`).
Na trasę wchodzą zwykłym importem albo przez `React.lazy`.

Provider ruchu (`LazyMotion ... strict`) stoi już w `main.tsx`, więc nic nie
trzeba dokładać. `MotionConfig reducedMotion="user"` z providera NIE wystarcza
tym komponentom: dotyczy animacji (`animate`, warianty), a nie wartości ruchu
wpiętych w `style`. Dlatego każdy z nich ma własną, jawną gałąź.

---

## ScrollChart

Słupki rosną falą wraz z przewijaniem; etykiety wartości zapalają się, gdy
słupek dochodzi do około 80 % swojej wysokości. Dane liczy silnik raportu
(`lib/report.ts`) na zestawie DEMO, więc w komponencie nie ma ani jednej
wpisanej z ręki liczby.

```tsx
import { ScrollChart } from "@/motion/scroll";

<section className="…">
  <h2>Gdzie ucieka budżet</h2>
  <ScrollChart className="mt-8" />
</section>
```

Wysokość idzie przez `scaleY` z `transform-origin: bottom`, nigdy przez
`height`. Skala osi zaokrągla się w górę do pełnych 10 p.p. (minimum 100), więc
etap po przekroczeniu budżetu widać jako przekroczenie, a nie jako sufit.

---

## ChaosToOrder

Sto dwadzieścia rozsypanych prostokątów zjeżdża w sześciokolumnową tabelę,
prostuje się i wyrównuje jasność; ostatnie 20 % postępu zapala nagłówki kolumn.
Metafora produktu wzięta dosłownie.

```tsx
import { ChaosToOrder } from "@/motion/scroll";

<ChaosToOrder />

// mniej kafli tam, gdzie sekcja jest niska albo ruch ma być spokojniejszy
<ChaosToOrder count={72} />
```

Podpowiedź kompozytora (`will-change`) żyje WYŁĄCZNIE w czasie ruchu: rodzic
przestawia jedną dziedziczoną własność custom (hook `useScrollWillChange`),
a kafle czytają ją przez `var()`. Jedno zapisanie stylu zamiast stu dwudziestu
i zero warstw GPU trzymanych po zakończeniu. Szerokość kafla jest statyczna
(hash po indeksie), żeby uporządkowany stan czytał się jak tabela, a nie jak
kod kreskowy.

---

## ScrollCounter

Liczba związana z postępem przewijania. To NIE jest `src/motion/Counter.tsx`:
tamten leci własnym tempem przez 1,2 s po wejściu w ekran i zostaje dla liczb
nad pierwszym zgięciem. Tutaj wartością steruje widz.

```tsx
import { ScrollCounter } from "@/motion/scroll";
import { pick, useLang } from "@/i18n";

const { lang } = useLang();

<p>
  <ScrollCounter
    to={tools.length}
    format={(n) => String(n)}
    label={pick(lang, { pl: `${tools.length} narzędzi`, en: `${tools.length} tools` })}
  />{" "}
  {pick(lang, { pl: "narzędzi działa na żywo", en: "tools running live" })}
</p>
```

Wartość idzie przez `useMotionValueEvent` prosto do `textContent`, więc w trakcie
ruchu nie ma ANI JEDNEGO renderu Reacta. `tabular-nums` i minimalna szerokość
w `ch` trzymają szerokość pola, żeby licząca się liczba nie przesuwała sąsiedniego
tekstu. JSX renderuje od razu wartość końcową, więc bez JS w DOM zostaje liczba,
a nie zero.

---

## StickyScene

Scena z zapasem drogi: kontener ma jawną wysokość, a w środku `position: sticky`
trzyma jeden ekran. Dziecko jest funkcją dostającą `progress` (`MotionValue`
0–1).

```tsx
import { StickyScene } from "@/motion/scroll";
import * as m from "motion/react-m";
import { useTransform, type MotionValue } from "motion/react";

function Scene({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0, 0.25, 0.75, 1], [0, 1, 1, 0]);
  const y = useTransform(progress, [0, 1], [40, -40]);
  return <m.div style={{ opacity, y }}>…</m.div>;
}

<StickyScene height="300vh">{(p) => <Scene progress={p} />}</StickyScene>
```

To NIE jest scroll-hijack: zero `preventDefault`, zero przechwytywania `wheel`
i `touchmove`, zero blokady `overflow` na `body`, zero przeskoków do następnej
sekcji. Pasek przewijania zachowuje się jak wszędzie indziej, scena jest tylko
dłuższa.

Dwie rzeczy do zapamiętania:

1. **`position: sticky` umiera po cichu**, gdy którykolwiek PRZODEK ma `overflow`
   inny niż `visible` (typowo `overflow-x: hidden` dopisane gdzieś w layoucie dla
   bezpieczeństwa na telefonie). Nie ma błędu w konsoli, element po prostu jedzie
   z treścią. Jeśli scena nie klei się do ekranu, szukaj `overflow` u przodków.
2. **Przy ograniczonym ruchu dziecko dostaje `progress = 1`.** Scenę trzeba więc
   napisać tak, żeby jedynka była kompletną, sensowną klatką. Powyższy przykład
   z `[0, 0.25, 0.75, 1] → [0, 1, 1, 0]` jest ZŁY dla reduced-motion: na końcu
   gasi treść do zera. Dla scen, które wygaszają ostatni element, zostaw
   w klatce końcowej to, co ma zobaczyć ktoś, kto ruchu nie chce.

---

## Weryfikacja

```bash
cd site
node node_modules/typescript/bin/tsc --noEmit
node node_modules/eslint/bin/eslint.js src/motion
```
