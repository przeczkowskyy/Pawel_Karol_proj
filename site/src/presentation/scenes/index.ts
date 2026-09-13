import type { ComponentType } from "react";
import type { SceneId } from "@/data/presentation";
import { SceneHook } from "./SceneHook";
import { SceneScale } from "./SceneScale";
import { SceneTime } from "./SceneTime";
import { SceneCost } from "./SceneCost";
import { SceneTurn } from "./SceneTurn";
import { SceneProof } from "./SceneProof";
import { SceneOutcome } from "./SceneOutcome";
import { SceneContact } from "./SceneContact";
import type { SceneContentProps } from "./types";

/* Warstwa TREŚCI prezentacji: osiem komponentów, po jednym na beat scenariusza
   (`docs/plan/prezentacja-scenariusz.md`). Każdy dostaje lokalny postęp sceny
   i rysuje wyłącznie nagłówek, ewentualną liczbę i ewentualny podpis.

   ŻADNA SCENA NIE MA WŁASNEGO TŁA. Tło, przenikanie między scenami, wideo
   i kadrowanie to sprawa silnika (`presentation/Scene.tsx`). Scena, która
   dokłada sobie tło, rozjedzie się z przejściem, którego nie widzi.

   Rekord `SCENE_CONTENT` jest kompletny wobec `SceneId`: dopisanie beatu do
   `data/presentation.ts` bez komponentu tutaj nie skompiluje się. */
export const SCENE_CONTENT: Record<SceneId, ComponentType<SceneContentProps>> = {
  hook: SceneHook,
  scale: SceneScale,
  time: SceneTime,
  cost: SceneCost,
  turn: SceneTurn,
  proof: SceneProof,
  outcome: SceneOutcome,
  contact: SceneContact,
};

export {
  SceneHook,
  SceneScale,
  SceneTime,
  SceneCost,
  SceneTurn,
  SceneProof,
  SceneOutcome,
  SceneContact,
};
export type { SceneContentProps } from "./types";
