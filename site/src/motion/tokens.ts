/* Jedyne źródło stałych ruchu dla warstwy TS (plan §6.2, reguła motion-tokens-only).
   Lustrzane wartości w `src/styles/tokens.css`: --duration-fast 160ms, --duration-base 240ms,
   --duration-slow 420ms, --duration-media 600ms, --ease-out, --ease-soft, --ease-std,
   --stagger 50ms, --reveal-shift 12px. Zmiana wartości tutaj wymaga tej samej zmiany tam. */

/** wejścia i hover; odpowiednik --ease-out z kitu */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
/** clip-reveal danych (wykresy); odpowiednik --ease-soft */
export const EASE_SOFT = [0.3, 0.7, 0.3, 1] as const;
/** przejścia tras i crossfade; odpowiednik --ease-std */
export const EASE_STD = [0.4, 0, 0.2, 1] as const;

/** sekundy; 0.6 to maksimum w tym systemie (jedyny udokumentowany wyjątek: licznik 1,2 s) */
export const DUR = { quick: 0.16, base: 0.24, reveal: 0.42, media: 0.6 } as const;

/** 50 ms między dziećmi kaskady; kaskada obejmuje maksymalnie 12 dzieci */
export const STAGGER = 0.05;

/** px; jedyne przesunięcie wejścia. Duże powierzchnie wchodzą bez przesunięcia (sama nieprzezroczystość) */
export const SHIFT = 12;

/** wspólny viewport dla whileInView: raz, próg 0.25, wyzwalacz cofnięty o 10% wysokości ekranu */
export const VIEWPORT_ONCE = { once: true, amount: 0.25, margin: "0px 0px -10% 0px" } as const;

/* Kill-switch trybu ruchu (reguła motion-tier-flag). Czytany DOKŁADNIE w trzech miejscach:
   provider.tsx (reducedMotion), HeroMedia.tsx (wantsVideo) i App.tsx (opcjonalne tło).
   „calm" nie tworzy drugiej ścieżki renderu: wyłącza media opcjonalne i wymusza reducedMotion. */
export const MOTION_TIER: "full" | "calm" = "full";
export const MEDIA_ENABLED = MOTION_TIER === "full";
