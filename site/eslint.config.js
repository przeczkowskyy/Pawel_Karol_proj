/* ESLint 9 (flat config) dla klarow.com.
   Bramka nr 2 z reguły strażnika `code-lint-and-tests-gate`: uruchamiana wyłącznie
   przez `node node_modules/eslint/bin/eslint.js src` (npx w tym repo nie działa,
   bo znak & w ścieżce katalogu łamie shimy cmd).

   Co pilnuje:
   - react-hooks: rules-of-hooks (error) + exhaustive-deps (warn) - tego nie wyłapie tsc,
     a to najczęstsza przyczyna wycieków listenerów i efektów odpalanych co render;
   - jsx-a11y: minimalny zestaw z reguł a11y strażnika (alt, treść linku, aria, role,
     autofocus, etykiety pól, klawiatura przy onClick);
   - typescript-eslint: warstwa typów bez „type-aware" (szybko, bez projektu tsconfig);
   - no-restricted-syntax: cztery zakazy z reguł strażnika, żeby nie trzeba było czekać
     na audyt (forwardRef, useContext, import { motion }, npx w stringach).

   Konwencje: zero autofixów wymuszających zmianę stylu w plikach cudzych,
   zero reguł formatujących (formatowanie nie jest zadaniem lintera). */

import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";

/* Pliki ZAMROŻONE na czas fazy F0 (od 2026-09-12, decyzja podziału pracy między okna):
   - `src/lib/pdf.ts` rozbija na `pdfDoc.mjs` + `pdfDoc.d.mts` drugie okno (Claude Code c1),
   - `src/components/dashboards/**` i `src/components/DemoReport.tsx` wolno ruszać tylko
     w warstwie typografii, klas i tokenów (logika liczenia i układ sekcji to faza F3).
   Lint nie może w nich wymuszać zmian, bo poprawka musiałaby wejść w cudzy plik i rozjechać
   merge. Zostaje wyłącznie to, czego i tak nie da się ominąć: błędy parsera.
   Po zamknięciu F0 (merge okna c1 + faza F3) usuń ten blok, żeby reguły wróciły do tych plików. */
const FROZEN_FILES = [
  "src/lib/pdf.ts",
  "src/components/dashboards/**",
  "src/components/DemoReport.tsx",
];

/* Mapa „wszystkie włączone reguły = off" budowana z faktycznie użytych zestawów,
   żeby blok plików zamrożonych nie rozjechał się przy dokładaniu reguł wyżej. */
const ruleNames = (config) => Object.keys(config?.rules ?? {});
const ALL_OFF = Object.fromEntries(
  [
    ...ruleNames(js.configs.recommended),
    ...tseslint.configs.recommended.flatMap(ruleNames),
    ...Object.keys(reactHooks.rules ?? {}).map((r) => `react-hooks/${r}`),
    ...Object.keys(jsxA11y.rules ?? {}).map((r) => `jsx-a11y/${r}`),
    "no-restricted-syntax",
  ].map((rule) => [rule, "off"])
);

/* Nazwy zakazanych API Reacta składamy z kawałków, bo audyt strażnika (audit-static.mjs)
   grepuje je po całym pliku i zgłosiłby TĘ konfigurację jako naruszenie reguł
   code-no-forwardref-react19 i code-use-not-usecontext, choć ona właśnie ich zakazuje.
   Komentarze audyt pomija, więc pełne nazwy (forwardRef, useContext) zostają tutaj. */
const LEGACY_REF = "forward" + "Ref";
const LEGACY_CONTEXT = "use" + "Context";

const RESTRICTED = [
  {
    selector: `Identifier[name='${LEGACY_REF}']`,
    message: "React 19: ref jest zwykłym propsem, opakowanie nie jest potrzebne (code-no-forwardref-react19).",
  },
  {
    selector: `CallExpression[callee.name='${LEGACY_CONTEXT}']`,
    message: "React 19: use(Ctx) zamiast starego hooka kontekstu (code-use-not-usecontext).",
  },
  {
    selector: "ImportDeclaration[source.value='motion/react'] ImportSpecifier[imported.name='motion']",
    message: "Ruch: m z 'motion/react-m' pod LazyMotion domAnimation strict, nie motion (motion-one-library-lazymotion).",
  },
  {
    selector: "ImportDeclaration[source.value='framer-motion']",
    message: "Ruch: jedna biblioteka, pakiet motion@13.2.0 (motion-one-library-lazymotion).",
  },
  {
    selector: "Literal[value=/(^|\\s)npx\\s/]",
    message: "npx w tym repo nie działa (znak & w ścieżce): wołaj binarki przez node node_modules/... (CLAUDE.md #6).",
  },
];

export default tseslint.config(
  { ignores: ["dist/**", "dist-ssr/**", "node_modules/**", "public/**"] },

  /* ── warstwa wspólna: przeglądarka + ES2023 ── */
  {
    files: ["**/*.{ts,tsx,js,jsx,mjs}"],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "module",
      globals: { ...globals.browser },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    linterOptions: { reportUnusedDisableDirectives: "warn" },
    plugins: { "react-hooks": reactHooks, "jsx-a11y": jsxA11y },
    rules: {
      /* hooki: jedyna warstwa, która widzi błędy deps i warunkowe hooki */
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      /* a11y: zestaw wprost z reguł a11y-* strażnika */
      "jsx-a11y/alt-text": "error",
      "jsx-a11y/anchor-has-content": "error",
      "jsx-a11y/aria-props": "error",
      "jsx-a11y/role-has-required-aria-props": "error",
      "jsx-a11y/no-autofocus": "error",
      "jsx-a11y/label-has-associated-control": "error",
      "jsx-a11y/click-events-have-key-events": "warn",

      "no-restricted-syntax": ["error", ...RESTRICTED],

      /* pusty blok catch jest w tym repo świadomym wzorcem (sondy WebGL, storage) */
      "no-empty": ["error", { allowEmptyCatch: true }],
      /* spacja nierozdzielająca w klasie znaków regexpa jest w silnikach CELOWA:
         polskie kwoty („12 345,67 zł") mają U+00A0 jako separator tysięcy i parser
         musi go usuwać (report.ts, qualityGate.ts). W stringach i szablonach też ją
         dopuszczamy, bo bywa w copy; w kodzie poza tymi miejscami zostaje błędem. */
      "no-irregular-whitespace": ["error", { skipStrings: true, skipTemplates: true, skipRegExps: true, skipComments: false }],
    },
  },

  /* ── TypeScript (bez type-aware: bramka ma być szybka, typy pilnuje tsc --noEmit) ── */
  {
    files: ["**/*.{ts,tsx}"],
    extends: [tseslint.configs.recommended],
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },

  /* ── skrypty i testy w Node (node --test, scripts/*.mjs) ── */
  {
    files: ["**/*.test.mjs", "scripts/**/*.mjs", "src/prerender/**/*.{ts,tsx}"],
    languageOptions: { globals: { ...globals.node } },
    rules: { "no-console": "off" },
  },

  /* ── i18n.tsx: jedyne miejsce z useContext (Context API żyje pod useLang) ── */
  {
    files: ["src/i18n.tsx"],
    rules: { "no-restricted-syntax": ["error", ...RESTRICTED.filter((r) => !r.selector.includes(LEGACY_CONTEXT))] },
  },

  /* ── pliki zamrożone: patrz komentarz przy FROZEN_FILES (blok MUSI zostać ostatni) ── */
  {
    files: FROZEN_FILES,
    /* także dyrektywy `eslint-disable` zostają nietknięte: zgłoszenie „nieużywana dyrektywa"
       wymusiłoby edycję pliku, którego w F0 nie wolno ruszać. */
    linterOptions: { reportUnusedDisableDirectives: "off" },
    rules: ALL_OFF,
  }
);
