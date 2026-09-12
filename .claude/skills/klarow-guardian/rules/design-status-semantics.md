---
id: design-status-semantics
title: Status = kolor + ikona + tekst z jednego słownika; nigdy sam kolor
impact: HIGH
tags: [design, status, a11y, chips, tokens, tool]
source: company-ui §5 (chipy statusów), §2 (warstwa semantyczna) / ui-kit-habits.md D1, D2, D4 / WIG Accessibility / taste §9.F (zero dekoracyjnych kropek)
added: 2026-09-12
---

## Zasada

Stan (OK / UWAGA / BŁĄD / w obiegu / oczekuje / w toku) komunikowany jest **zawsze trójką**: kolor
semantyczny z tokenów (`--ok/--warn/--bad/--info/--neutral`, każdy z `--x-bg` tint 12–13 % i
`--x-border` 40 %), ikona lucide (Check / TriangleAlert / X / Clock / Send / Loader) i etykieta
tekstowa `{ pl, en }`. Mapa `status → { kind, icon, label }` jest **jedną funkcją per domena**
(`statusMeta.ts`), nigdy inline w 40 miejscach. Zakazane: kolor jako jedyny nośnik (kropka bez
tekstu, czerwona liczba bez ikony), akcent stalowy jako „sukces" lub „błąd", akcentowy
`border-left` („lewy pasek") jako status, dekoracyjne kropki przed pozycjami nawigacji/listy.
Kolory semantyczne występują tylko w trybie `tool` (patrz `brand-single-accent-steel`).

## Mechanizm awarii (dlaczego)

Daltonizm (8 % mężczyzn) i druk mono kasują informację niesioną samym kolorem; WCAG 1.4.1.
Kit ma sześć semantyk i jeden słownik, bo w narzędziach on-prem status „ZAAKCEPTOWANE" musi
wyglądać identycznie w rejestrze umów, obiegu przelewów i protokołach; inline-warianty rozjeżdżają
się po dwóch tygodniach. Lewy pasek (`border-left: 3px solid`) to pozostałość Bootstrap-alertów,
sprzeczna z „linie tylko jako separatory strukturalne" (kit #9). taste §9.F: kolorowa kropka przed
każdym wierszem to Tell, dozwolona tylko dla realnego stanu i oszczędnie.

## Niepoprawnie

```tsx
<td style={{ color: total < 0 ? "#f87171" : "#34d399" }}>{fmt(total)}</td>
<span className="dot dot-green" />                          {/* sam kolor */}
<div className="card" style={{ borderLeft: "3px solid var(--funded)" }}>…</div>
<span className="st st-accent">BŁĄD</span>                  {/* akcent jako status */}
```

## Poprawnie

```ts
// statusMeta.ts (jedno źródło per domena)
export const PAYMENT_STATUS = {
  ok:      { kind: "ok",   icon: Check,         label: { pl: "Zaakceptowane", en: "Approved" } },
  warn:    { kind: "warn", icon: TriangleAlert, label: { pl: "Do wyjaśnienia", en: "Needs review" } },
  bad:     { kind: "bad",  icon: X,             label: { pl: "Odrzucone", en: "Rejected" } },
  pending: { kind: "info", icon: Clock,         label: { pl: "W obiegu", en: "In circulation" } },
} as const;
```

```tsx
<Status meta={PAYMENT_STATUS[row.status]} />
// renderuje: <span className="st st-{kind}"><Icon size={16} strokeWidth={1.75} aria-hidden />{pick(label, lang)}</span>
```

## Test

```bash
# kolor warunkowy w inline style: 0 trafień
grep -rnE "style=\{\{[^}]*color:\s*[a-zA-Z_.]+\s*[<>=!?]" site/src --include=*.tsx
# lewy pasek jako status: 0 trafień (border-left tylko w separatorach strukturalnych)
grep -rnE "border-left:\s*[2-9]px|borderLeft:" site/src --include=*.tsx --include=*.css
# chipy statusów bez ikony (przegląd trafień)
grep -rnE "st st-(green|brick|blue|violet)\"[^>]*>[^<]" site/src --include=*.tsx
# słownik statusów: 1 plik per domena
ls site/src/components/dashboards/*statusMeta* site/src/lib/*status* 2>/dev/null
```

## Wyjątki

Legenda wykresu (kolor + etykieta, bez ikony) i markery danych w SVG (`role="img"` + `aria-label`
z wartościami) spełniają wymóg tekstu przez opis dostępny. Etykiety dowodu na marketingu
(`demo/product/case`) nie są statusami i używają wyłącznie stali/neutralu.
