---
id: code-no-forwardref-react19
title: React 19: ref jako zwykły prop, zero forwardRef
impact: MEDIUM
tags: [react19, refs, composition, code]
source: CP:react19-no-forwardref / vercel.md §4, §13 / synthesis §2.7.1 (React 19.2.7 w fazie 1, 19.3.0 = faza 2)
added: 2026-09-12
---

## Zasada

W `site/src/**` nie używamy `React.forwardRef` ani `forwardRef`. Od React 19 `ref` jest zwykłym propem: komponent przyjmuje `ref` w destrukturyzacji propsów i przekazuje go dalej. Dotyczy React 19.2.7 (faza 1) i 19.3.0 (faza 2); obie wersje mają ten sam mechanizm. Nowy plik z `forwardRef` = błąd audytu; istniejące wystąpienia (7 w martwych `components/ui/*`) znikają razem z martwym kodem (patrz `code-no-dead-code`).

## Mechanizm awarii (dlaczego)

`forwardRef` w React 19 jest warstwą kompatybilności: dodaje opakowanie komponentu (dodatkowa ramka w drzewie i w React DevTools), psuje czytelność typów (`ForwardRefExoticComponent` zamiast zwykłej funkcji) i utrwala wzorzec z shadcn, którego kit `company-ui` nie potrzebuje. React ostrzega, że `forwardRef` zostanie wycofany w kolejnej wersji głównej; kod pisany dziś wg starego API to gwarantowany refaktor. Dodatkowo `forwardRef` + `memo` + domyślne obiekty w propsach to trzy warstwy, w których łatwo zepsuć memoizację (RBP 5.5).

## Niepoprawnie

```tsx
// site/src/components/ui/card.tsx:5 (martwy plik, wzorzec z shadcn)
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("card", className)} {...props} />
);
Card.displayName = "Card";
```

## Poprawnie

```tsx
// ref jako prop; typ jawny, komponent to zwykła funkcja
type CardProps = React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> };

export function Card({ ref, className, ...props }: CardProps) {
  return <div ref={ref} className={["card", className].filter(Boolean).join(" ")} {...props} />;
}
```

## Test

```bash
# 0 trafień poza martwymi plikami (po ich usunięciu: 0 w całym src)
grep -rnE "forwardRef" site/src --include=*.tsx --include=*.ts
# ESLint (po włączeniu, patrz code-lint-and-tests-gate): reguła własna
# no-restricted-syntax dla CallExpression[callee.property.name="forwardRef"]
```

Severity: MEDIUM. Auto-fix dozwolony (krok „fixer" po zatwierdzeniu planu): zamiana mechaniczna `forwardRef((props, ref) => …)` → `function X({ ref, ...props })`.

## Wyjątki

Biblioteki zewnętrzne w `node_modules` (nie audytujemy). Komponenty klasowe nie występują w projekcie; gdyby powstały, `ref` na klasie działa jak dotąd.
