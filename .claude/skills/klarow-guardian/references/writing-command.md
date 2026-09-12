# Writing Guidelines (Vercel) — kopia lokalna dla strażnika + warstwa PL

> **Źródło:** `https://raw.githubusercontent.com/vercel-labs/writing-guidelines/main/command.md`
> (skill `writing-guidelines` z `vercel-labs/agent-skills` trzyma tylko `SKILL.md` i pobiera te reguły zdalnie).
> **Data pobrania:** 2026-09-11 (257 linii, 14 228 B). **Licencja:** MIT, © Vercel (`vercel-labs/agent-skills`).
> **Kopia lokalna — nie pobieramy tego pliku przez WebFetch przy audycie.** Audyt offline, deterministyczny,
> bez zależności od sieci i bez ryzyka, że reguły zmienią się w trakcie rundy.
>
> Precedencja: `klarow-guardian` (`rules/copy-*`, `rules/i18n-*`) > CLAUDE.md > **ten dokument**.
> Część reguł Vercela dotyczy dokumentacji produktu SaaS (`meta.contentType`, deep-linki do dashboardu,
> nazwy modeli, AI Gateway) i **nas nie dotyczy**; część jest sprzeczna z naszą marką (Title Case w nagłówkach
> nawigacji, `&` zamiast „i") — wtedy obowiązuje sekcja „Warstwa PL" na końcu tego pliku.
> Mapowanie WG → reguły strażnika: `references/audit-checklist.md` §5.
> Aktualizacja = świadoma decyzja: pobrać nową wersję, porównać diff, odświeżyć datę i mapowanie.
> Treść poniżej jest kopią 1:1 (angielski, bez zmian), łącznie z frontmatterem slash-commandu.
> Warstwa PL zaczyna się po znaczniku „## Warstwa PL (nadpisuje powyższe w tekstach polskich)".

---

---
description: Review docs/prose for Vercel Writing Guidelines compliance
argument-hint: <file-or-pattern>
---

# Writing Guidelines

Review these files for compliance: $ARGUMENTS

Read files, check against rules below. Output concise but comprehensive: sacrifice grammar for brevity. High signal-to-noise.

## Rules

### Planning & content type

- Every page has a plan (overview, goal, audience, content plan, open questions) referenced or linked
- Content type declared in `meta.contentType`: `Tutorial`, `How-to`, `Reference`, `Conceptual`, `Troubleshooting`, or `Landing`
- Title is user-shaped (the user's question), not feature-shaped (the engineer's name)
- Page does one job: tutorial OR how-to OR reference, not three at once
- Goal is verb-driven (Bloom's taxonomy): "configure", "explain", "debug" (testable)
- Multi-audience pages: short shared opener, then technical subsections

### Voice & tone

- Active voice. Mental test: append "by monkeys". If the sentence parses, rewrite
- Direct address: `you`, never `the user` or `one can`
- Imperative for steps: "Click **Add Project**", not "You will need to click **Add Project**"
- Sentences under 20 words target
- Contractions encouraged (`you'll`, `it's`) for warmth
- Present tense unless describing future behavior
- Limit `we`: only for deliberate Vercel actions ("we recommend", "we deprecated"), never as a stand-in for "you"
- No rhetorical questions (sounds like marketing)
- Second-read test: read each sentence once at speech pace; if you re-read to parse it, name the subject, the action, and the consequence (kill metaphor verbs and pronouns reaching back several sentences)

### Banned words

- `easy`, `simple`, `quick`: puts pressure on the reader and reads as marketing; replace with concrete description ("one command", "default settings", "most projects don't need this")
- `very`, `just`, `really`: filler; cut or rewrite

### Concision

- Earn every detail: cut a number, name, or implementation detail if a more general phrasing wouldn't change the reader's understanding or action
- Weasel words: replace vague qualifiers (`significantly`, `many`, `often`, `typically`, `generally`) with a specific number or claim
- Vague quantifiers: no `near-zero`, `sub-second`, `most requests`; give the figure and cite it (`99.37% of requests see zero cold starts`)
- Filler/metaphor verbs: name the action instead of reaching for cadence (`moves through`, `lands`, `carries`, `hits` → the literal step)

### AI-generated tells (flag these)

- Summary-style transitions: never open a paragraph by recapping the last one (`With this setup complete…`, `Now that we've explored…`); pivot straight to the next point (`In practice…`, `The catch is…`)
- Stop-start sentences: don't split one dependent idea into choppy fragments (`Previously this was manual. Now it's automatic. This saves time.` → one sentence); short sentences for emphasis are fine
- Spec-sheet voice: rewrite sentences that read like a system reading a datasheet (`provides`, `is configurable`, `is explicitly labeled`)
- Cold-open paragraphs: a body paragraph whose first sentence works as a standalone heading has no antecedent; carry the prior subject forward (`Because…`, `Once…`)
- Personified artifacts: machines don't perform human-physical actions (`hand the browser a URL` → `the browser fetches the URL`; `the token holds…` → `the token is stored…`)
- Reused framing: the angle must come from this page, not a template (`The question most teams face is whether…`)

### Tone, by content type

- **Tutorial**: warm, encouraging, predictable structure, no traps
- **How-to**: terse, direct (reader is mid-task)
- **Reference**: neutral, exhaustive, quotable
- **Conceptual**: explain like the reader will teach it back; examples and analogies welcome
- **Troubleshooting**: empathetic but not apologetic; acknowledge then fix

### Headings

- Sentence case for page headings (`H1` `H2` `H3`): "Configure environment variables", not "Configure Environment Variables"
- Title case for nav labels: "Configuring Environment Variables"
- `meta.title` becomes the `H1`; `meta.navLabel` becomes the sidebar entry
- Subheadings descriptive, not cute: "Caveats when self-hosting on Cloudflare", not "Caveats"
- Reader should be able to guess section content from the heading alone

### Structure

- Every page opens with a one-paragraph TL;DR of what the page covers
- Every major section opens with a summary sentence
- Acronyms spelled out on first use: "Content Security Policy (CSP) blocks inline scripts"
- Define every term the first time you use it (link to its conceptual page)
- Reference docs organized by surface; education docs organized by reader task
- Keep paragraphs to 2 to 4 sentences; split anything longer or covering two ideas

### Lists

- Three or more list-shaped items in a paragraph: convert to a list
- Bulleted for unordered; numbered for ordered (lifecycles, sequential steps)
- Always introduce a list with a colon
- No periods at the end of list items unless they are full sentences
- Bold/description format: `- **Term**: description here` (colon after bold term)

### Code

- Code blocks need a language tag for syntax highlighting
- TypeScript is the default for new code unless the surface is genuinely language-agnostic
- Multi-step flows wrapped in `<Steps/>` so structure is visible
- Highlight load-bearing lines: `` ```typescript {8-12,23-37} ``
- ≤80 columns per line in snippets
- ≤25 lines per snippet; split longer blocks with prose
- Omit defaults; don't repeat variable definitions, use shared var
- Minimal comments in code blocks; prefer prose explanation
- Explain what every code block does in prose (don't drop and run)
- Don't reference full example files at the end of guides ("See `train.py`"); the guide is the deliverable

### Placeholders

- Text placeholders: `snake_case`, descriptive: `your_access_token_here` (so reader can double-click to select before pasting)
- Number placeholders: count up `1234567890123` (recognizable as fake, predictable)
- Never `<TOKEN>`, `xxx`, `your-token`, or generic ALL_CAPS

### Data sizes & units

- Space + uppercase unit: `64 KB`, `5 KB`, `200 ms`
- Exception: seconds is bare: `30s`
- Consistent across the corpus so readers can develop scanning habits

### Money & pricing pages

- Uncompromising detail: err on "too much"
- Use tables for pricing
- Never assume reader knows the pricing model or whether their workload counts as one invocation or several
- Clarity and transparency above all else

### Emphasis

- **Bold** means UI element or critical fact, never emphasis-for-emphasis-sake
- Reaching for bold for tone: the sentence is weak; rewrite it
- `Inline code` for paths, file extensions, identifiers, short snippets: `/api`, `.tsx`, `body`, `query`, `req`
- Rule: if it would look weird without a monospace font, monospace it

### Punctuation & typography

- Never em dashes (`—`) or dashes (`-`) as punctuation; use colons, commas, periods, or rephrase
- Curly quotes `"` `"` and `'` `'`, not straight `"` or `'`
- Ellipsis `…`, not three dots `...`
- Loading states end with `…`: `Loading…`, `Saving…`
- Non-breaking spaces in `10&nbsp;MB`, `⌘&nbsp;K`, brand names
- `&` over "and" only where space-constrained (nav labels, buttons)

### Source formatting

- Don't hard-wrap paragraphs: each paragraph is one line in source, let the editor wrap
- One blank line before headings; one blank line before and after code blocks
- No `---` horizontal rules between sections
- No extra blank lines between elements that aren't paragraph breaks

### Links

- Define every term the first time it appears, link to its conceptual page
- Anchor text names the destination; never bare URLs or `here`/`link`
- Dashboard deep links use the standard format: `https://vercel.com/d?to=%2F%5Bteam%5D%2F~%2Fai-gateway%2Fapi-keys&title=AI+Gateway+API+Keys`
- Link to canonical product docs where relevant: `https://vercel.com/docs/vercel-sandbox`, `https://vercel.com/docs/ai-gateway`
- AI Gateway model catalog: `https://vercel.com/ai-gateway/models`

### Models in examples

- Always use the latest model strings: `anthropic/claude-opus-4-7`, not `anthropic/claude-sonnet-4` or older
- For image generation default: `google/gemini-3.1-flash-image-preview`

### AI workflow

- You are accountable for the content you produce, however it is created
- You are the final arbiter; the model proposes, you dispose
- Hold technical accuracy to a high standard: docs are also consumed by LLMs, wrong docs train wrong models
- Use only enterprise models that do not train on your data (especially for unreleased products)
- Disclose AI use in the PR (model + prompts if useful)
- Plan first by hand; the plan is the spec the model works against
- Use plan-mode in your editor (Cursor, Claude) before letting the model write
- Tell the model to follow `AGENTS.md` and the linting checklist
- Run a test prompt against the preview: "given this plan's goal, can the model complete the task using only this page?"
- Final human review always

### Quality checklist (required boxes are non-negotiable)

- **Findability**: sidebar bucket set via `meta.category`; UI links to docs from any dashboard surface that exposes the feature
- **Accuracy**: code samples actually run; screenshots map 1:1 to current UI and use the ACME demo account
- **Relevance**: code samples included where applicable (TypeScript first; `<Steps/>` for multi-step flows)
- **Clarity**: overview addresses who/what/where/why; high-level use cases laid out; quickstart for new products; prerequisites listed on tutorials; sample repo in `vercel/examples` for multi-step tutorials; steps detailed not vague; visual aids in confusing sections; simplest path recommended when multiple exist
- **Completeness**: limits documented; all-limits tables updated; content plan followed and goals addressed
- **Readability**: nav names scannable and use action verbs; content types accurately used; subheadings descriptive; topics start with summaries; code blocks formatted correctly; active voice where warranted

### Review

- PR description links to the content plan, lists what to review, and links the preview URL
- Ping the team via the PR link (not the plan or preview directly)
- Author is accountable, not the reviewer; reviewers are liberal with approvals
- Suggestion comments for small text fixes; preview comments for anything bigger
- Disagreement is fine; reject with a one-line reason and move on

### Anti-patterns (flag these)

- Em dashes (`—`) or dashes (`-`) used as punctuation
- `easy`, `simple`, `quick` describing reader actions
- Passive voice (apply "by monkeys" test)
- Title Case in page headings (only sentence case in `H1` through `H6`)
- Generic placeholders: `<TOKEN>`, `xxx`, `your-token`, `ABC123`
- Code blocks without a language tag
- JS examples where TypeScript is the convention
- Code blocks over 25 lines without prose between
- Hard-wrapped prose paragraphs (multiple lines for one paragraph in source)
- `---` horizontal rules between sections
- Subheadings that are single generic words: `Overview`, `Caveats`, `Notes`
- Bold used for emphasis instead of UI element or critical fact
- Page or section without an opening summary
- Straight quotes (`"`, `'`) instead of curly (`"`, `'`)
- Three dots (`...`) instead of ellipsis (`…`)
- Acronyms used before being spelled out
- Bare unit numbers (`64KB`, `5kb`, `200MS`) instead of `64 KB`, `5 KB`, `200 ms`
- "We" standing in for "you"
- Rhetorical questions
- Filler words: `very`, `just`, `really`, `simply`
- References to "the full example file at the end of the guide" rather than inlining the code
- Outdated model strings in examples (`anthropic/claude-sonnet-4`, `gpt-4o`, DALL-E)
- Hardcoded date/number formats instead of `Intl.DateTimeFormat` / `Intl.NumberFormat` in code samples
- "Loading..." instead of "Loading…"
- Summary-style transitions recapping the previous paragraph (`With this setup complete…`)
- Stop-start fragments splitting one dependent idea into choppy sentences
- Spec-sheet voice reading like a datasheet (`provides`, `is configurable`, `is explicitly labeled`)
- Cold-open body paragraphs whose first sentence has no antecedent
- Personified artifacts performing human-physical actions (`hand the browser a URL`)
- Reused/template framing not specific to the page (`The question most teams face is whether…`)
- Weasel words instead of a specific claim (`significantly`, `many`, `often`, `typically`, `generally`)
- Vague quantifiers without a cited figure (`near-zero`, `sub-second`, `most requests`)
- Filler/metaphor verbs instead of the literal step (`moves through`, `lands`, `carries`, `hits`)
- Sentences that need a second read to parse
- Paragraphs over 4 sentences or covering two ideas
- Bare URLs or `here`/`link` as anchor text

## Output Format

Group by file. Use `file:line` format (VS Code clickable). Terse findings.

```text
## content/docs/sandbox.mdx

content/docs/sandbox.mdx:1 - missing meta.contentType
content/docs/sandbox.mdx:12 - title "Vercel Sandbox" is feature-shaped, not user-question
content/docs/sandbox.mdx:24 - passive voice ("the sandbox is created...")
content/docs/sandbox.mdx:31 - banned word "easy"
content/docs/sandbox.mdx:47 - "..." → "…"
content/docs/sandbox.mdx:58 - code block missing language tag
content/docs/sandbox.mdx:71 - placeholder <TOKEN> → your_access_token_here
content/docs/sandbox.mdx:89 - "64KB" → "64 KB"
content/docs/sandbox.mdx:102 - H2 "Caveats" too generic; add specificity
content/docs/sandbox.mdx:118 - em dash in prose, replace with colon/comma

## content/docs/ai-gateway.mdx

content/docs/ai-gateway.mdx:5 - title case in H1; sentence case only
content/docs/ai-gateway.mdx:18 - acronym AI Gateway used before being spelled out
content/docs/ai-gateway.mdx:34 - bold for emphasis, not UI element
content/docs/ai-gateway.mdx:52 - `anthropic/claude-sonnet-4` outdated; use `anthropic/claude-opus-4-7`
content/docs/ai-gateway.mdx:71 - hard-wrapped paragraph (lines 71-74)

## content/docs/cron.mdx

✓ pass
```

State issue + location. Skip explanation unless fix is non-obvious. No preamble.

---

## Warstwa PL (nadpisuje powyższe w tekstach polskich)

Obowiązuje dla każdego tekstu PL: UI strony, `pagesSeo.ts`, `toolsSeo.ts`, `faq.ts`, `messaging.ts`, `llms.txt`,
PDF, one-pager, szablony outboundu, posty bota, dokumenty w `docs/`. Reguły maszynowe: `i18n-pl-typography`,
`i18n-sentence-case-headings`, `copy-voice-and-tone`, `copy-minimal-text`, `copy-banned-claims`,
`legal-sources-for-market-numbers`. Skrypt: `node .claude/skills/klarow-guardian/scripts/audit-static.mjs`
(id `i18n-pl-typography`, `i18n-pl-typography`, `copy-banned-claims`).

### PL.1 Myślniki: półpauza tylko w zakresach liczbowych

- **Pauza „—" (em dash, U+2014): zakaz bezwzględny** w UI, meta, JSON-LD, `llms.txt`, PDF i w outboundzie.
  Zamiast niej: dwukropek, przecinek, kropka albo przebudowa zdania (decyzja D-09 b).
- **Półpauza „–" (en dash, U+2013): wyłącznie w zakresach liczbowych**, bez spacji: `5–10 dni`, `20–250 osób`,
  `140–160 tys. zł`, `2026–2027`. Nigdy jako interpunkcja w prozie, nigdy jako myślnik wtrąceniowy.
- Dywiz „-" tylko w wyrazach złożonych i nazwach: `on-premise`, `e-mail`, `PL-EN`, `Sedlak & Sedlak`.
- W EN: te same zakazy; zakres zapisujemy `5-10 days` albo `from 5 to 10 days`.
- Test: `grep -rn "—" site/src` = 0; półpauza dozwolona tylko we wzorcu `[0-9]–[0-9]`.

### PL.2 Cudzysłowy i znaki

- PL: **„ …  " ** (U+201E otwierający dolny, U+201D zamykający górny). Zagnieżdżone: » «.
- EN: “ ” (U+201C, U+201D), apostrof prawy (U+2019).
- Zero prostych cudzysłowów ASCII w treści (w kodzie i atrybutach JSX oczywiście zostają).
- Wielokropek `…` (U+2026), nigdy trzy kropki; stany ładowania kończą się wielokropkiem: „Generuję PDF…".
- Twarde spacje (`&nbsp;`): po spójnikach jednoliterowych (`i`, `a`, `o`, `w`, `z`, `u`), przed jednostką
  (`10 MB`, `30 min`, `8 350 zł`, `20,48 %`), w skrótach (`m.in.`, `np.`), w wordmarku i skrótach produktowych.
- Liczby: separator tysięcy = spacja nierozdzielająca (`8 350`, `121 000`), przecinek dziesiętny (`1,5`),
  waluta po liczbie (`12 345,67 zł`), procent ze spacją nierozdzielającą (`88 %`).
- Daty w treści: `12 września 2026`; w danych i dokumentach technicznych ISO `2026-09-12`; formatowanie
  liczb i dat w kodzie tylko przez `Intl.*` z jednym helperem (`fmtMoney(lang)`), nigdy ręcznymi szablonami.
- `translate="no"` na `KLAROW`, `KSeF`, `G703`, nazwach plików i identyfikatorach.

### PL.3 Sentence case w nagłówkach (nadpisuje „Title Case for nav labels" z Vercela)

- Nagłówki `h1`–`h6`, etykiety nawigacji, przyciski, chipy, nagłówki kolumn i etykiety statusów:
  **pisownia zdaniowa** — wielka litera tylko na początku i w nazwach własnych.
  „Realizacje i dema", nie „Realizacje i Dema"; „Umów 30 minut", nie „Umów 30 Minut".
- CAPS wyłącznie dla wordmarku `KLAROW` i skrótów (`RODO`, `KSeF`, `ERP`, `PDF`, `CSV`).
- Ta sama zasada w EN: „Book 30 minutes", nie „Book 30 Minutes" (świadome odstępstwo od Vercela —
  `references/decisions-log.md`, sekcja „Świadome odstępstwa").
- Nagłówek sekcji ≤ 6 słów (`copy-minimal-text`); nagłówek ma pozwalać zgadnąć treść sekcji
  („Kiedy to się zwraca", nie „Korzyści").
- `&` zamiast „i" jest zakazane w copy PL (czyta się jak angielski); w EN dozwolone tylko w nawigacji
  przy ciasnym miejscu.

### PL.4 Zakaz pytań retorycznych

- Nagłówki i leady są zdaniami oznajmującymi. Zakazane: „Masz dość sklejania arkuszy?",
  „Czy Twoje raporty są aktualne?", „Co by było, gdyby…?".
- Wyjątek jedyny: **FAQ**, gdzie pytanie jest realnym pytaniem użytkownika i ma pełną odpowiedź pod spodem
  (`faq.ts`, `toolsSeo.ts`; wymagane przez `FAQPage` JSON-LD, `copy-faq-single-source`).
- Pytanie w CTA zamieniamy na tryb rozkazujący: „Przyślij najgorszy Excel", nie „Chcesz zobaczyć, jak to działa?".

### PL.5 Banned words PL

Zakazane wprost (zamień na konkret albo wytnij):

| Zakazane | Dlaczego | Zamiast |
|---|---|---|
| łatwo, prosto, proste, bezproblemowo | presja na czytelnika, ton reklamy (odpowiednik `easy`, `simple`) | „jedno polecenie", „bez zmian w ERP", „dwa pola do wypełnienia" |
| szybko, błyskawicznie, natychmiast | obietnica bez liczby | „pierwszy działający efekt w dni", „pilot 5–10 dni" (`copy-honest-time-claims`) |
| po prostu, właśnie, naprawdę, bardzo, dosłownie, wręcz | wypełniacze (`just`, `really`, `very`) | wyciąć |
| nowoczesny, innowacyjny, rewolucyjny, przełomowy, next-gen | nic nie znaczy, brzmi jak slajd sprzedażowy | opis mechanizmu: „liczy lokalnie, bez wysyłania danych" |
| inteligentny, smart, oparty na AI, AI-powered | zakaz marki (`brand-no-ai-word-in-sales`, BLOCKER; doprecyzowania w `copy-banned-claims` §7) | „deterministyczny", „kalkulator, nie wróżka" |
| kompleksowy, holistyczny, end-to-end, all-in-one | ukrywa zakres | wymienić, co wchodzi w zakres |
| dedykowany (w znaczeniu „dla") | kalka językowa | „pod Twój proces", „napisany dla Was" |
| rozwiązanie (jako wypełniacz), narzędzie klasy…, platforma | pustosłowie | nazwać rzecz: „raport zarządczy", „import z rekoncyliacją" |
| lider, najlepszy, numer 1, profesjonalny, solidny, ekspercki | twierdzenie bez dowodu i ryzyko prawne (art. 16 u.z.n.k.) | pokazać dowód: działające demo, liczba ze źródłem |
| znacząco, istotnie, efektywnie, optymalnie, zazwyczaj, często, wiele, spory | weasel words | liczba ze źródłem albo nic (`legal-sources-for-market-numbers`) |
| oszczędzimy wam etat, nie zatrudniajcie, zwolnicie kogoś | framing odejmowania etatu (peer-legal §1.3) | „żeby te 121 tys. kupowało analizę, a nie sklejanie arkuszy" |
| wdrożone u klientów (bez pokrycia), stała cena (jako tag), gwarantujemy | `copy-banned-claims`, `brand-honest-labels` | „Demo", „Własny produkt", „wycena po bezpłatnej diagnozie" |

Tells generatora do wychwycenia w PL (odpowiedniki „AI-generated tells" z sekcji angielskiej):
„W dzisiejszych czasach…", „Warto podkreślić, że…", „Podsumowując…", „Co więcej…", „Nie da się ukryć, że…",
„Kluczowe znaczenie ma…", „W dobie cyfryzacji…", akapit otwierany streszczeniem poprzedniego
(„Skoro wiemy już, że…"), zdania-fragmenty rozbijające jedną myśl na trzy, głos katalogu
(„zapewnia", „umożliwia", „jest konfigurowalny"), personifikacja („system sam pilnuje", „dane wędrują").

### PL.6 Ton i osoba

- Druga osoba liczby pojedynczej: „Twój proces", „dostajesz", „umów". Bez „Państwa" w UI; forma grzecznościowa
  tylko w piśmie papierowym i w klauzuli `/rodo`, konsekwentnie w całym dokumencie.
- „My" tylko dla działań Klarow („budujemy", „nie wysyłamy danych"), nigdy jako zamiennik „Ty".
- Strona czynna; test „przez małpy": jeśli „…jest generowany przez małpy" brzmi poprawnie, przepisz.
- Zdania ≤ 20 słów, akapity 2–4 zdania, lead hero ≤ 20 słów, karta = ikona + 2–6 słów + jedna linia.
- Bez wykrzykników i emoji w UI i w dokumentach (`design-icons-lucide-one-family`: ikony to lucide, nie emoji).
- Każde zdanie przechodzi „second-read test": jeśli trzeba je przeczytać drugi raz, nazwij podmiot, czynność i skutek.

### PL.7 Czego z Vercela u nas nie stosujemy

- `meta.contentType`, `meta.navLabel`, `<Steps/>`, deep-linki do dashboardu Vercela, katalog modeli,
  nazwy modeli w przykładach, „sample repo w vercel/examples" — to konwencje dokumentacji Vercela.
  Nasze odpowiedniki: `pagesSeo.ts` / `toolsSeo.ts` (title, description), `faq.ts`, `llms.txt`.
- „Title Case for nav labels" i „`&` over and" — nadpisane przez PL.3.
- „Contractions encouraged" — nie dotyczy polszczyzny.
- „Disclose AI use in the PR" — u nas obowiązuje stopka `Co-Authored-By` w commicie (CLAUDE.md zasada 4)
  i zakaz słowa „AI" w komunikacji sprzedażowej; to dwie różne warstwy (proces vs sprzedaż).
- Reguła Vercela „numerals for counts" obowiązuje, ale liczba rynkowa bez źródła i roku jest zakazana
  (`legal-sources-for-market-numbers`), więc odpowiednikiem „8 deployments" jest u nas „12 dem" z dowodem w `tools.ts`.
