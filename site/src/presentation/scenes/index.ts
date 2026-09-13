import type { ComponentType } from "react";
import type { SceneId } from "@/data/presentation";
import { SceneHook } from "./SceneHook";
import { SceneHandover } from "./SceneHandover";
import { SceneTime } from "./SceneTime";
import { SceneCost } from "./SceneCost";
import { SceneTurn } from "./SceneTurn";
import { SceneCraft } from "./SceneCraft";
import { SceneOutcome } from "./SceneOutcome";
import { SceneContact } from "./SceneContact";
import type { SceneContentProps } from "./types";

/* Warstwa TREŚCI prezentacji: osiem komponentów, po jednym na beat scenariusza
   (`docs/plan/prezentacja-scenariusz.md` §3). Każdy dostaje lokalny postęp sceny
   i rysuje nagłówek, akapit, punkty oraz ewentualną liczbę.

   ZMIANA W WERSJI 2 (2026-09-13): `SceneScale` (88 % arkuszy z błędem) i
   `SceneProof` (ściana trzynastu zrzutów) USUNIĘTE, w ich miejsce `SceneHandover`
   i `SceneCraft`. Powód w komentarzach tamtych dwóch plików i w `data/presentation.ts`.

   ŻADNA SCENA NIE MA WŁASNEGO TŁA. Tło, przenikanie między scenami, wideo
   i kadrowanie to sprawa silnika (`presentation/Scene.tsx`). Scena, która
   dokłada sobie tło, rozjedzie się z przejściem, którego nie widzi.

   Rekord `SCENE_CONTENT` jest kompletny wobec `SceneId`: dopisanie beatu do
   `data/presentation.ts` bez komponentu tutaj nie skompiluje się. */
export const SCENE_CONTENT: Record<SceneId, ComponentType<SceneContentProps>> = {
  hook: SceneHook,
  handover: SceneHandover,
  time: SceneTime,
  cost: SceneCost,
  turn: SceneTurn,
  craft: SceneCraft,
  outcome: SceneOutcome,
  contact: SceneContact,
};

export {
  SceneHook,
  SceneHandover,
  SceneTime,
  SceneCost,
  SceneTurn,
  SceneCraft,
  SceneOutcome,
  SceneContact,
};
export type { SceneContentProps } from "./types";
