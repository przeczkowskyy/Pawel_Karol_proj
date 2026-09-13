# Silnik prezentacji

Strona jako jeden ciąg scen przewijanych myszą. Bez zakładek, bez menu, bez
skoków do sekcji. Scenariusz ośmiu scen jest wiążący i leży w
`docs/plan/prezentacja-scenariusz.md`; ten katalog jest wyłącznie maszyną, która
go odtwarza. Copy scen mieszka w `src/data/presentation.ts`, komponenty treści
w `presentation/scenes/`, a tutaj stoi to, co je niesie.

## Co jest czym

| plik | rola |
|---|---|
| `Stage.tsx` | rama: postęp całego dokumentu, kontekst dla scen, linia postępu na krawędzi okna i numer sceny („3 / 8") w rogu |
| `Scene.tsx` | jedna scena: sekcja z torem przewijania, przyklejony ekran w środku, lokalny postęp 0–1 dla dzieci, przenikanie wejścia i wyjścia |
| `SceneVideo.tsx` | tło wideo przewijane pozycją scrolla (nie odtwarzane); poza bramkami degraduje się do kadru |
| `SceneFallbackMedia.tsx` | statyczne tło zastępcze: stal, winieta, opcjonalna siatka komórek i opcjonalny kadr |
| `sceneMedia.ts` | mapa scen na materiał; jedyne miejsce ze ścieżkami plików |
| `context.ts` | dwa konteksty (`StageApi`, `SceneApi`) i hooki `useStage` / `useScene` |
| `presentation.css` | cały wygląd warstwy; kolory wyłącznie tokenami z `styles/tokens.css` |
| `index.ts` | eksporty |

## Jak wpiąć scenę

```tsx
import { Scene, SceneFallbackMedia, Stage } from "@/presentation";
import { SCENE_CONTENT } from "@/presentation/scenes";
import { sceneMedia } from "@/presentation/sceneMedia";

<Stage>
  <Scene id="hook" media={<SceneFallbackMedia grid />}>
    {(s) => <SceneHook progress={s.progress} />}
  </Scene>
</Stage>
```

Dziecko może być zwykłym węzłem albo FUNKCJĄ dostającą `SceneApi`
(`{ id, progress, inView, reduce }`). Alternatywnie treść czyta scenę hookiem:

```tsx
const scene = useScene();   // null, gdy komponent stoi poza <Scene>
```

## Jak dodać scenę

1. Dopisz beat do `SceneId` i `SCENES` w `src/data/presentation.ts` (copy PL+EN,
   liczba ze źródłem z `references/allowed-numbers.md`).
2. Dopisz wpis do `SCENE_MEDIA` w `sceneMedia.ts`. Rekord jest typowany
   `Record<SceneId, …>`, więc bez tego kroku projekt się nie skompiluje.
3. Dopisz komponent treści do `presentation/scenes/` i do `SCENE_CONTENT`.
4. Wstaw `<Scene id="…">` w tym miejscu ciągu, w którym ma lecieć.

Nowa scena nie wymaga zmian w `Stage`: numeracja i długość paska liczą się
z tego, co faktycznie stoi w drzewie.

## Jak podmienić materiał zastępczy na wideo z Higgsfielda

Dzisiaj wszystkie osiem scen gra na `fallback`, bo subskrypcja nie jest kupiona.
Prezentacja jest tak zbudowana, że to jest stan normalny, a nie awaryjny.

Gdy pliki powstaną:

1. Wrzuć je do `site/public/media/presentation/` pod nazwami z `sceneMedia.ts`.
   Nazwa niesie wersję (`-v1`), bo pliki z `public/` nie dostają hasha Vite,
   a `_headers` podaje je jako `immutable`. Zmiana treści to nowa nazwa `-v2`,
   nigdy nadpisanie.
2. Odkomentuj wpis `V1` / `V2` / `V3` w `sceneMedia.ts` i wstaw go do sceny:

```ts
hook: { id: "hook", video: V1, still: V1.poster, fallback: "shot" },
```

3. W miejscu wpięcia sceny zamień tło:

```tsx
const media = sceneMedia("hook");

<Scene
  id="hook"
  media={
    media.video ? (
      <SceneVideo sources={videoSources(media.video)} poster={media.video.poster} eager />
    ) : (
      <SceneFallbackMedia grid />
    )
  }
>
```

`SceneVideo` bierze postęp z kontekstu sceny, więc nie trzeba mu nic podawać.
Prop `range` zawęża nagranie do fragmentu postępu, gdy klip ma grać tylko przez
część sceny.

**Poster musi być KLATKĄ ZERO nagrania.** Inaczej przejście kadr → nagranie
mrugnie. Weryfikacja jak przy hero: `site/media/CLIPS.json` trzyma PSNR kadru
wobec klatki 0.

## Pułapki

**`position: sticky` umiera po cichu.** Wystarczy, że KTÓRYKOLWIEK przodek ma
`overflow` inny niż `visible` (typowo `overflow-x: hidden` dopisane gdzieś
w layoucie „dla bezpieczeństwa na telefonie"). Nie ma błędu w konsoli, scena po
prostu jedzie z treścią. Dlatego `.pr-stage` i `.pr-scene` nie mają `overflow`,
a kadrowanie siedzi na samym elemencie przyklejonym. Jeśli scena przestanie się
kleić, szukaj `overflow` u przodków, nie w tym katalogu.

**Rama nie może dostać `transform`, `filter` ani `will-change`.** Każda z tych
własności robi z elementu blok zawierający dla `position: fixed`, przez co linia
postępu przestaje trzymać się krawędzi okna i zaczyna jeździć z treścią.

**Scrubbing wymaga gęstych klatek kluczowych.** Przy rzadkich klatkach kluczowych
każdy skok `currentTime` cofa dekoder do poprzedniej klatki I i przewijanie
skacze zamiast płynąć. Materiał eksportujemy z klatką kluczową co około 0,4 s
(przy 30 fps `-g 12`). Tego nie da się naprawić w kodzie; szczegóły kodowania
w `references/higgsfield-pipeline.md`.

**`currentTime` wyłącznie w `requestAnimationFrame` i z progiem jednej klatki.**
Zapis przy każdej zmianie postępu zatyka dekoder: obraz zastyga, a wątek główny
stoi w `seek`. `SceneVideo` planuje najwyżej jedną ramkę na klatkę ekranu
i pisze tylko, gdy różnica przekracza `1/30 s`.

**Stan końcowy, nie początkowy.** Przy `prefers-reduced-motion` scena dostaje
`progress = 1`. Scena napisana tak, że w jedynce wygasza własną treść do zera,
pokaże pusty ekran dokładnie tej osobie, która poprosiła o mniej ruchu. Jedynka
ma być kompletną klatką.

**Zero przechwytywania gestu.** Żadnego listenera `wheel`, `touchmove` ani
`scroll`, żadnego `scrollTo`, żadnej blokady `overflow` na `body`, żadnej
biblioteki smooth-scroll. Postęp czyta `useScroll` z `motion/react`, pasywnie.
To jest granica między sceną sticky (dozwoloną) a scroll-hijackiem (zakazanym
bez wyjątku, reguła `motion-no-pinning-no-scroll-hijack`).

**Nic z tego katalogu nie wchodzi do `src/prerender/entry.tsx`.** Shell statyczny
niesie treść bez biblioteki ruchu (reguła `motion-no-motion-in-prerender`).
Prerender bierze copy wprost z `src/data/presentation.ts`.

## Wydajność

Osiem scen po 200vh to strona długa na szesnaście ekranów. Scena poza zasięgiem
nie liczy nic: `IntersectionObserver` z marginesem jednego ekranu w każdą stronę
przełącza `inView`, a subskrypcja postępu istnieje wyłącznie w tej gałęzi. Poza
zasięgiem lokalny postęp jest zatrzaśnięty na 0 albo 1, więc stoi też cały
łańcuch `useTransform`. Treść zostaje w DOM, więc „Znajdź na stronie", czytnik
ekranu i zaznaczanie działają niezależnie od pozycji przewijania.

Jak to sprawdzić po wpięciu w trasę (tryb DEV):

```js
// konsola przeglądarki, przewiń stronę w dół i z powrotem
window.__klarowSceneSubs   // ma stać na 2, najwyżej 3 przy ośmiu scenach
```

Po powrocie na górę licznik ma wrócić do tej samej liczby. Rosnąca wartość
oznacza wyciek subskrypcji. W buildzie produkcyjnym licznika nie ma
(`import.meta.env.DEV`).

## Weryfikacja

```bash
cd site
node node_modules/typescript/bin/tsc --noEmit
node node_modules/eslint/bin/eslint.js src/presentation
```

Binarki wołamy przez `node` wprost: znak `&` w ścieżce katalogu łamie shimy cmd
(CLAUDE.md #6).
