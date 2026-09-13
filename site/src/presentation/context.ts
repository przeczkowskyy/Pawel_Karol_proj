import { createContext, use } from "react";
import type { MotionValue } from "motion/react";

/* ── Konteksty silnika prezentacji ──────────────────────────────────────────
   Dwa maleńkie konteksty w jednym pliku, żeby `Scene` i `SceneVideo` nie
   importowały się nawzajem (cykl importów w bundlu = pusty moduł w czasie
   wykonania i awaria bez czytelnego błędu).

   React 19: kontekst czytamy przez `use(Ctx)`, nie starym hookiem. Lint
   (`code-use-not-usecontext`) trzyma tę granicę mechanicznie.

   Oba `use*` zwracają `null`, gdy komponent stoi poza swoim rodzicem. To NIE
   jest wyjątek: komponent ma wtedy zrenderować stan statyczny (kadr zamiast
   nagrania, treść bez ruchu), zgodnie z zasadą „awaria ozdoby nie gasi treści". */

/** Rama prezentacji: postęp CAŁEGO dokumentu i meldunek aktywnej sceny. */
export type StageApi = {
  /** 0 na górze dokumentu, 1 na dole; wartość z `useScroll()` bez celu */
  progress: MotionValue<number>;
  /**
   * Scena melduje swoje istnienie i swój węzeł; rama układa numerację po
   * kolejności w dokumencie. Zwraca funkcję wyrejestrowania (do cleanupu).
   */
  register: (id: string, node: HTMLElement) => () => void;
  /** scena melduje, że zakrywa środek ekranu (numer „3 / 8" w rogu) */
  setActive: (id: string) => void;
};

export const StageContext = createContext<StageApi | null>(null);

/** Rama prezentacji albo `null`, gdy scena stoi poza `Stage`. */
export function useStage(): StageApi | null {
  return use(StageContext);
}

/** Jedna scena: lokalny postęp i informacja, czy scena w ogóle pracuje. */
export type SceneApi = {
  id: string;
  /**
   * Lokalny postęp sceny 0–1, BRAMKOWANY widocznością: gdy scena jest daleko
   * od ekranu, wartość stoi na 0 (scena jeszcze przed nami) albo 1 (już za
   * nami) i nikt jej nie aktualizuje. Przy `prefers-reduced-motion` stoi na 1,
   * czyli na stanie końcowym sceny.
   */
  progress: MotionValue<number>;
  /** czy scena jest w zasięgu pracy (ekran plus jeden ekran zapasu w każdą stronę) */
  inView: boolean;
  /** czy użytkownik poprosił o ograniczony ruch */
  reduce: boolean;
};

export const SceneContext = createContext<SceneApi | null>(null);

/** Bieżąca scena albo `null`, gdy komponent stoi poza `Scene`. */
export function useScene(): SceneApi | null {
  return use(SceneContext);
}
