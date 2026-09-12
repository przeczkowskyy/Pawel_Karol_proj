---
id: a11y-faq-aria-controls
title: Akordeon FAQ: button z aria-expanded + aria-controls, panel z id i region; odpowiedź zawsze w DOM
impact: MEDIUM
tags: [a11y, faq, accordion, aria, seo]
source: WIG Accessibility (semantic HTML before ARIA) / site-audit.md §3.2 p.5 (Faq.tsx: aria-expanded jest, brak aria-controls/id) / CLAUDE.md sesja cz. 7 poprawka (3) (odpowiedzi ZAWSZE w DOM) / synthesis a11y-faq, §2.3 /faq (aria-controls + id)
added: 2026-09-12
---

## Zasada

Każda pozycja FAQ (landing `/faq` i 4 Q&A per narzędzie) to: `<h3><button type="button" aria-expanded={open} aria-controls={panelId} id={btnId}>pytanie</button></h3>` + `<div id={panelId} role="region" aria-labelledby={btnId} className="faq-answer" data-open>…odpowiedź…</div>`. Odpowiedź jest ZAWSZE w DOM (zwijanie przez `grid-template-rows: 0fr/1fr` jak dziś w `globals.css:61-77`), nigdy przez warunkowy render; pod reduced-motion bez animacji. Identyfikatory pochodzą z `faq.ts` (`id: "cena"` → `faq-cena`, `faq-cena-panel`), żeby link `#faq-cena` otwierał pozycję. Ikona `ChevronDown` ma `aria-hidden`. Na podstronach narzędzi Q&A renderują się jako lista bez akordeonu (zawsze rozwinięte), co spełnia regułę.

## Mechanizm awarii (dlaczego)

`Faq.tsx:29` ma `aria-expanded`, ale bez `aria-controls`/`id` czytnik ekranu nie wie, który region rozwija przycisk; VoiceOver nie oferuje skoku do panelu. Warunkowy render odpowiedzi (wersja sprzed cz. 7) zostawiał FAQPage JSON-LD bez pokrycia w treści (Google wymaga, by pytania i odpowiedzi z JSON-LD były widoczne w DOM), a LLM-y bez JS nie widziały odpowiedzi. Deep-link `#faq-dane` bez `id` na pozycji nie działa z LinkedIn.

## Niepoprawnie

```tsx
<button type="button" aria-expanded={open} onClick={onToggle}>{q}</button>
<div className="faq-answer" data-open={open}>{open ? <p>{a}</p> : null}</div>   {/* warunkowy render */}
```

## Poprawnie

```tsx
function FaqItem({ id, q, a, open, onToggle }: FaqItemProps) {
  const btnId = `faq-${id}`, panelId = `faq-${id}-panel`;
  return (
    <div className="faq-item" id={btnId.replace("faq-", "faq-item-")}>
      <h3 className="faq-q"><button type="button" id={btnId} aria-expanded={open} aria-controls={panelId} onClick={onToggle}>
        {q}<ChevronDown size={16} aria-hidden="true" className={open ? "rot" : ""} />
      </button></h3>
      <div id={panelId} role="region" aria-labelledby={btnId} className="faq-answer" data-open={open ? "true" : "false"}>
        <div><p className="t-muted">{a}</p></div>
      </div>
    </div>
  );
}
```

## Test

```bash
grep -nE "aria-controls=" site/src/components/Faq.tsx site/src/components/FaqList.tsx 2>/dev/null   # ≥ 1
grep -nE "role=\"region\"" site/src/components/Faq.tsx site/src/components/FaqList.tsx 2>/dev/null   # ≥ 1
grep -nE "\{open \? <p|open && <" site/src/components/Faq.tsx site/src/components/FaqList.tsx 2>/dev/null   # 0
# dist/faq.html: liczba odpowiedzi w DOM = liczba pytań w JSON-LD FAQPage
# PLANOWANE (F3, verify-site.mjs nie zna tego trybu): node .claude/skills/klarow-guardian/scripts/verify-site.mjs --faq-coverage
```

Severity: MEDIUM (a11y); brak odpowiedzi w DOM = HIGH z `seo-jsonld-per-kind` (FAQPage bez pokrycia).

## Wyjątki

Sekcja „Częste pytania o to narzędzie" na podstronie (lista bez zwijania) nie potrzebuje `aria-expanded`/`aria-controls`.
