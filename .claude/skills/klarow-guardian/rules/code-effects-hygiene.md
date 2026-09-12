---
id: code-effects-hygiene
title: Higiena efektów: prymitywne deps, cleanup, useEffectEvent, zero derived-state w efektach
impact: HIGH
tags: [hooks, effects, cleanup, strictmode, code]
source: RBP:rerender-dependencies, rerender-derived-state-no-effect, rerender-move-effect-to-event, advanced-use-latest, advanced-effect-event-deps, advanced-init-once, client-passive-event-listeners / vercel.md §9.1, §9.3 / site-audit.md §3.1 p.4 (Seo re-run) / synthesis R6 (PageFade bez mutacji ref w renderze)
added: 2026-09-12
---

## Zasada

1. Każdy `useEffect` z subskrypcją (`addEventListener`, `setTimeout`, `setInterval`, `requestAnimationFrame`, `IntersectionObserver`, `ResizeObserver`, `matchMedia`, `animate()`) zwraca cleanup, który to odwołuje.
2. Deps są prymitywne (`user.id`, `isOpen`, `pathname`), nie obiekty ani tablice tworzone w renderze; `Seo.tsx:64` z `jsonLd` (nowa tablica co render w `App.tsx:710`) to dokładnie ten błąd.
3. Wartość wyliczalna z props/state liczona jest w renderze, nie przez `useState` + `useEffect` („derived state w efekcie").
4. Reakcja na akcję użytkownika mieszka w handlerze, nie w `useState(flag)` + `useEffect(if (flag))`.
5. Handler potrzebny w stabilnej subskrypcji owijamy `useEffectEvent` (React 19.2+) i NIE wkładamy go do deps.
6. Inicjalizacja „raz na aplikację" (analytics, sondy) ma guard na poziomie modułu, nie `useEffect(() => init(), [])`; StrictMode w dev montuje dwa razy.
7. Listenery `scroll` / `wheel` / `touch*` z `{ passive: true }`, chyba że wołają `preventDefault()`.
8. Zero mutacji `ref.current` w ciele renderu (StrictMode renderuje podwójnie: `first.current` w `PageFade` psuje logikę „pierwszy montaż"); użyj `useState(() => pathname)` i porównania.

## Mechanizm awarii (dlaczego)

Brak cleanupu = wyciek listenerów po nawigacji SPA (każde wejście na `/narzedzia/:slug` dokłada `keydown`), podwójne rAF po StrictMode, `IntersectionObserver` obserwujący odmontowane węzły. Obiekt w deps = efekt odpala się co render: `Seo` usuwa i wstawia `<script ld+json>` przy każdym renderze strony (`site-audit.md` §3.1 p.4). Derived state w efekcie = dodatkowy render z nieaktualnym stanem między commitami (miga stara wartość). Efekt reagujący na flagę zamiast handlera gubi zdarzenie przy szybkim podwójnym kliknięciu. Mutacja ref w renderze pod StrictMode ustawia `first.current = false` już w pierwszym (odrzuconym) renderze, więc animacja wejścia nigdy nie gra albo gra podwójnie.

## Niepoprawnie

```tsx
// Seo.tsx:64: jsonLd to nowa tablica przy każdym renderze rodzica (App.tsx:710)
useEffect(() => { /* wstaw JSON-LD */ }, [title, description, path, jsonLd]);

// derived state w efekcie
const [total, setTotal] = useState(0);
useEffect(() => { setTotal(rows.reduce((s, r) => s + r.cost, 0)); }, [rows]);

// subskrypcja bez cleanupu + handler w deps
useEffect(() => { window.addEventListener("keydown", onKey); }, [onKey]);

// mutacja ref w renderze
const first = useRef(true); if (first.current) { first.current = false; /* … */ }
```

## Poprawnie

```tsx
// deps prymitywne: serializacja raz, porównanie po stringu
const jsonLdKey = jsonLd ? JSON.stringify(jsonLd) : "";
useEffect(() => { /* wstaw JSON-LD z jsonLdKey */ }, [title, description, path, jsonLdKey]);

// pochodna w renderze
const total = rows.reduce((s, r) => s + r.cost, 0);

// stabilna subskrypcja + cleanup + useEffectEvent
const onKey = useEffectEvent((e: KeyboardEvent) => { if (e.key === "Escape") onClose(); });
useEffect(() => {
  if (!open) return;
  const h = (e: KeyboardEvent) => onKey(e);
  document.addEventListener("keydown", h);
  return () => document.removeEventListener("keydown", h);
}, [open]);

// „pierwszy montaż" bez mutacji ref w renderze
const [initialPath] = useState(() => pathname);
const isFirst = initialPath === pathname;
```

## Test

```bash
# subskrypcje bez cleanupu (heurystyka: addEventListener/setTimeout/rAF w useEffect bez `return`)
# DOCELOWO (skrypt planowany, jeszcze nie istnieje — dziś: NIE SPRAWDZANO): node .claude/skills/klarow-guardian/scripts/check-code.mjs --effects
# ESLint react-hooks/exhaustive-deps + react-hooks/rules-of-hooks (code-lint-and-tests-gate)
grep -rnE "addEventListener\(\"(scroll|wheel|touch(start|move))\"" site/src | grep -v "passive"   # oczekiwane: 0
grep -rnE "\.current = " site/src --include=*.tsx | grep -vE "useEffect|useLayoutEffect|=>|function"  # kandydaci mutacji w renderze
grep -rnE "useEffect\(\(\) => \{ *(init|zaraz|analytics)" site/src                                   # init w efekcie: 0
```

Severity: HIGH (brak cleanupu, obiekt w deps, mutacja ref w renderze). Derived state / passive: MEDIUM w raporcie.

## Wyjątki

`useLayoutEffect` do synchronicznego pomiaru wykresów (kit M2) jest dozwolony; cleanup nadal obowiązuje. `useEffect(() => { window.scrollTo(0, 0) }, [pathname])` w `ScrollToTop` nie subskrybuje niczego, więc cleanup nie jest wymagany.
