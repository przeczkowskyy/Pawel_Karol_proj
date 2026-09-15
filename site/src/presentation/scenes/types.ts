import type { SceneApi } from "../context";

/* Kontrakt między silnikiem prezentacji (`presentation/Scene.tsx`) a treścią sceny.
 *
 * `Scene` przyjmuje dziecko jako FUNKCJĘ dostającą `SceneApi`, więc wpięcie sceny
 * w tor wygląda tak:
 *
 *   <Scene id="cost" media={<ScenePanel id="cost" />}>
 *     {(s) => <SceneCost progress={s.progress} />}
 *   </Scene>
 *
 * Treść bierze z tego API wyłącznie `progress`: `inView` i `reduce` są sprawą
 * silnika, a komponent treści ma być czysty i możliwy do wyrenderowania także
 * poza sceną (podgląd, test, shell). Typ jest WYPROWADZONY z `SceneApi`, nie
 * przepisany, więc zmiana kontraktu silnika zatrzyma się na kompilacji.
 *
 * Warunek na `progress = 1`: przy `prefers-reduced-motion` silnik podaje stałą 1,
 * więc KAŻDA scena musi mieć w jedynce kompletną, sensowną klatkę. Scena, która
 * na końcu wygasza własną treść do zera, jest błędem. */
export type SceneContentProps = Pick<SceneApi, "progress"> & {
  /** otwarcie modala rezerwacji; silnik podaje go wyłącznie ostatniej scenie */
  onBook?: () => void;
};
