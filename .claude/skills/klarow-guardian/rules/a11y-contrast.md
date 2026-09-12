---
id: a11y-contrast
title: Kontrast: tekst ≥ 4,5:1, UI i placeholdery ≥ 3:1, tekst na wideo ≥ 4,5:1 na najjaśniejszej klatce
impact: HIGH
tags: [a11y, contrast, color, tokens, video]
source: WCAG 2.2 1.4.3 / 1.4.11 / site-audit.md §3.2 p.7 (#b4b4b9 na #171717 ≈ 6–7:1 OK) / synthesis design-contrast (kit błędy 3.29/2.24), §2.3 S1 (overlay hero), §2.5.1 (8,9:1) / scratchpad contrast.mjs
added: 2026-09-12
---

## Zasada

Każda para „kolor tekstu × tło" z `tokens.css` ma kontrast ≥ 4,5:1 (tekst < 24 px / < 19 px bold) albo ≥ 3:1 (tekst ≥ 24 px lub ≥ 19 px bold, ikony, obrysy kontrolek, `--border-strong`, placeholdery, wskaźnik fokusu). Tabela par w `references/design-tokens.md` jest kompletna i wiążąca (tam liczby, tu próg): `--foreground`, `--foreground-muted`, `--foreground-faint`, `--accent`, `--on-cta` na każdym z `--background`, `--surface`, `--surface-raised`, `--surface-overlay`, `--cta`. Tekst na wideo/obrazie (hero S1) liczymy na NAJJAŚNIEJSZEJ klatce z overlayem `linear-gradient(180deg, rgba(18,18,18,.15), rgba(18,18,18,.85))`; poster i wideo są testowane osobno. Statusy w dashboardach nigdy nie polegają tylko na kolorze (ikona + tekst). Zmiana dowolnego tokenu koloru = przeliczenie całej tabeli w `references/design-tokens.md` (§3 ciemny, §4 jasny; procedura w §5) w tym samym commicie; skrypt `audit-contrast.mjs` jest PLANOWANY (F3) i dziś nie istnieje.

## Mechanizm awarii (dlaczego)

Kit `company-ui` miał pary o kontraście 3,29:1 i 2,24:1 (placeholder, obrysy) wykryte skryptem `contrast.mjs` w researchu; ciemna stal jest nisko-chromatyczna, więc „subtelny" `--foreground-faint` łatwo spada poniżej 3:1. Tekst hero nad jasną klatką wideo (Kling: białe pasma) traci czytelność w pełnym słońcu na telefonie, a Lighthouse mierzy tylko poster, nie klatki wideo. Kontrast poniżej progu to twarde niezaliczenie WCAG AA i Lighthouse a11y < 95 (DoD kitu).

## Niepoprawnie

```css
:root { --foreground-faint: #5a5a5f; }        /* na #121212 ≈ 2,6:1 dla placeholderów */
.hero h1 { color: var(--foreground); }         /* bez overlaya nad wideo */
```
```tsx
<span style={{ color: "var(--ok)" }}>●</span>   {/* status tylko kolorem */}
```

## Poprawnie

```css
:root { --background: #121212; --foreground: #fafafa; --foreground-muted: #b4b4b9; --foreground-faint: #8d8d93; /* 3,3:1 → 4,6:1 */ --border-strong: #4a4a50; }
.hero-media::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(18,18,18,.15), rgba(18,18,18,.85)); }
```
```tsx
<span className="st st-ok"><Check size={14} aria-hidden="true" /> OK</span>
```

## Test

```bash
# dziś: tabela wszystkich par z wyliczonym kontrastem w references/design-tokens.md (§3 ciemny, §4 jasny)
grep -cE "^\| \`--" .claude/skills/klarow-guardian/references/design-tokens.md        # ≥ 1 wiersz na parę
# pojedyncza para (WCAG 2.x relative luminance), bez zależności:
node -e "const L=(h)=>{const v=h.replace('#','').match(/../g).map(x=>parseInt(x,16)/255).map(c=>c<=0.03928?c/12.92:Math.pow((c+0.055)/1.055,2.4));return 0.2126*v[0]+0.7152*v[1]+0.0722*v[2]};const C=(a,b)=>{const [h,l]=[L(a),L(b)].sort((x,y)=>y-x);return ((h+0.05)/(l+0.05)).toFixed(2)};console.log(C('#8D8D93','#1F1F1F'))"
# wszystkie pary tokenów (skrypt liczy WCAG 2.x relative luminance; fail < 4.5 tekst / < 3 UI)
# DOCELOWO (skrypt planowany, jeszcze nie istnieje — dziś: NIE SPRAWDZANO): node .claude/skills/klarow-guardian/scripts/audit-contrast.mjs site/src/styles/tokens.css
# hero: najjaśniejsza klatka postera/wideo (ffmpeg w scratchpadzie) + overlay → luminancja tła pod H1
# DOCELOWO (skrypt planowany, jeszcze nie istnieje — dziś: NIE SPRAWDZANO): node .claude/skills/klarow-guardian/scripts/audit-contrast.mjs --hero site/public/media/hero-v1.poster.webp
# Lighthouse a11y ≥ 95 na 5 trasach (F4)
```

Severity: HIGH.

## Wyjątki

Tekst dekoracyjny/wyłączony (`:disabled`, `aria-disabled`) nie podlega 4,5:1 (WCAG wyłącza „inactive"), ale ≥ 3:1 zalecane. Logotypy nie występują (wordmark tekstowy podlega regule).
