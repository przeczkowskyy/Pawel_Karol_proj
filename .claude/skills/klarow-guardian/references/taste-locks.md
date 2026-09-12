# Locki, ban-lista i pre-flight z `design-taste-frontend` (cytaty dosłowne + adnotacje Klarow)

> Źródło: pakiet **taste-skill** (repo `Leonxlnx/taste-skill`, MIT), skill `design-taste-frontend` = **v2 (experimental)**,
> commit `ccbc15639c97057cbfcf32ecebc38ef716e4bb37` (2026-08-24), zainstalowany w `.claude/skills/design-taste-frontend/SKILL.md`
> (1206 linii). Cytaty skopiowane mechanicznie 2026-09-12 (numery linii odnoszą się do tego pliku). Cytaty są po angielsku,
> bez zmian. Adnotacje **Klarow:** mówią, co u nas OBOWIĄZUJE, co jest ZMODYFIKOWANE i co jest ZAKAZANE decyzją produktową
> (niezależnie od skilla). Precedencja: `klarow-guardian` > CLAUDE.md > motion > design-taste-frontend (tylko tryb `marketing`).
> Pakiet nie ma auto-sync (v2 „experimental”); aktualizacja = świadoma decyzja + odświeżenie cytatów, commitu i daty w tym nagłówku.

Mapa: §A Locki (4.2 / 4.4 / 4.11 + „one X per project”) · §B Hero (4.3 / 4.7 / 4.8) · §C Ban-lista (0.D / 9.A–G) ·
§D Szkielety animacji (5, 5.A–D) · §E Guardrails perf/a11y (6) · §F Dark mode (8) · §G Out of scope (13) · §H Pre-flight (14).

## A. Locks (§4.2, §4.4, §4.11 + „one X per project”)

### A.1 Color Consistency Lock (§4.2)

_(SKILL.md, linie 185-207)_

> ### 4.2 Color Calibration
> * Max 1 accent color. Saturation < 80% by default.
> * **THE LILA RULE:** The "AI Purple / Blue glow" aesthetic is discouraged as a default. No automatic purple button glows, no random neon gradients. Use neutral bases (Zinc / Slate / Stone) with high-contrast singular accents (Emerald, Electric Blue, Deep Rose, Burnt Orange, etc.).
> * **Override:** if the brand or brief explicitly asks for purple / violet / lila, embrace it. But execute with intent: consistent palette, harmonised neutrals, restrained gradients. Not generic AI gradient slop.
> * **One palette per project.** Do not fluctuate between warm and cool grays within the same project.
> * **COLOR CONSISTENCY LOCK (mandatory):** Once an accent color is chosen for a page, it is used on the WHOLE page. A warm-grey site does not suddenly get a blue CTA in section 7. A rose-accented site does not get a teal status badge in the footer. Pick one accent, lock it, audit every component before shipping.
>
> * **PREMIUM-CONSUMER PALETTE BAN (mandatory, second-most-recurring AI-tell):**
>   * For premium-consumer briefs (cookware, wellness, artisan, luxury, heritage craft, DTC home goods, etc.) the LLM default is **warm beige/cream + brass/clay/oxblood/ochre + espresso/ink dark text**. Concretely banned hex families as default backgrounds and accents:
>     - Backgrounds: `#f5f1ea`, `#f7f5f1`, `#fbf8f1`, `#efeae0`, `#ece6db`, `#faf7f1`, `#e8dfcb` (all "warm paper / cream / chalk / bone")
>     - Accents: `#b08947`, `#b6553a`, `#9a2436`, `#9c6e2a`, `#bc7c3a`, `#7d5621` (all "brass / clay / oxblood / ochre")
>     - Text: `#1a1714`, `#1a1814`, `#1b1814` (all "espresso / warm near-black")
>   * This palette is BANNED as the default reach for premium-consumer briefs. Every premium-consumer site you have ever shipped uses this exact palette. The brand becomes invisible.
>   * **Default alternatives (rotate, do not reuse):**
>     - **Cold Luxury:** silver-grey + chrome + smoke (think Tesla, Apple Watch Hermes-without-the-leather)
>     - **Forest:** deep green + bone + amber accent (think Filson, Patagonia premium)
>     - **Black and Tan:** true off-black + warm tan, sharp contrast, no beige
>     - **Cobalt + Cream:** saturated blue against a single neutral, no brass
>     - **Terracotta + Slate:** warm rust against cool grey, no brass
>     - **Olive + Brick + Paper:** muted olive plus brick-red accent
>     - **Pure monochrome + single saturated pop:** off-white + off-black + one bright accent (electric blue, emerald, hot pink, etc.)
>   * **Palette-rotation rule:** if the previous premium-consumer project you generated used the beige+brass family, this one MUST use a different family. Do not ship the same warm-craft palette twice in a row.
>   * **Override:** the beige+brass+espresso palette is acceptable ONLY when the brand brief explicitly names those colors, or when the brand identity is genuinely vintage / artisan / warm-craft AND you can articulate why this specific palette fits this specific brand. Default-reaching for it because "this is a cookware brief" is banned.

**Klarow:** OBOWIĄZUJE. Akcent = stal `#A8B4C2` (`--accent`), saturacja ~11 %; to paleta „Cold Luxury: silver-grey + chrome + smoke”
z listy alternatyw powyżej. Reguły: `brand-single-accent-steel`, `brand-no-gold`, `design-tokens-only`. Kolory semantyczne
(`--ok/--warn/--bad/--info`) wyłącznie w dashboardach jako statusy; chip `st-blue` na trasie marketingowej = naruszenie.
Premium-consumer palette ban nas nie dotyczy (B2B), ale zapis o rotacji palet jest dobrym testem: nie kopiować palety
z poprzedniego projektu.

### A.2 Shape Consistency Lock (§4.4)

_(SKILL.md, linie 213-217)_

> ### 4.4 Materiality, Shadows, Cards
> * Use cards ONLY when elevation communicates real hierarchy. Otherwise group with `border-t`, `divide-y`, or negative space.
> * When a shadow is used, tint it to the background hue. No pure-black drop shadows on light backgrounds.
> * For `VISUAL_DENSITY > 7`: generic card containers are banned. Data metrics breathe in plain layout.
> * **SHAPE CONSISTENCY LOCK (mandatory):** Pick ONE corner-radius scale for the page and stick to it. Options: all-sharp (radius 0), all-soft (radius 12-16px), all-pill (full radius for interactive). Mixed systems are allowed only when there is a documented rule (e.g. "buttons are full-pill, cards are 16px, inputs are 8px") and that rule is followed everywhere. Round buttons in a square layout, or square cards on a pill-button page, is broken design.

**Klarow:** OBOWIĄZUJE Z MODYFIKACJĄ: system mieszany z udokumentowaną regułą, sprawdzalny po `data-surface`:
marketing {0, 8, 999}, narzędzia {8, 10, 12, 999}. Reguła `design-shape-lock`. Karty tylko tam, gdzie elewacja niesie
hierarchię (dashboard, dialog); na marketingu hairline `1px var(--border)` (decyzja Karola 2026-07-22 cz. 6: linie, nie boxy).
Cienie na marketingu: zero (`design-no-glass-no-blur`).

### A.3 Page Theme Lock (§4.11)

_(SKILL.md, linie 341-348)_

> ### 4.11 Page Theme Lock (Light / Dark Mode Consistency)
>
> The page has ONE theme. Sections do not invert.
>
> * If the page is dark mode, ALL sections are dark mode. No light-mode-warm-paper section sandwiched between dark sections (or vice versa). The user must not feel they walked into a different website mid-scroll.
> * The exception: if the brief explicitly calls for a "Color Block Story" or "Theme Switch on Scroll" device AND that is a deliberate composition (one full theme switch with a strong transition, not random alternation), it is allowed once per page.
> * Default behaviour: pick light, dark, or auto (`prefers-color-scheme`) at the page level and lock it. Section-level background tints within the same theme family are fine (`bg-zinc-950` next to `bg-zinc-900`); flipping to `bg-amber-50` in the middle of a `bg-zinc-950` page is broken.
> * When using a design system with built-in theming (Radix Themes, shadcn/ui with `<Theme>`), set the theme ONCE in `layout.tsx` or the page root. Do not let individual sections override.

**Klarow:** OBOWIĄZUJE. Landing = dark lock (`color-scheme: dark`, `theme-color #121212`), motyw przez CSS variables,
zero `dark:` utilities, light tylko jako komplet tokenów bez przełącznika. Reguły `design-page-theme-lock`, `design-light-ready-tokens`.

### A.4 „One X per project” (§2.A, §3.C, §4.9, §10)

_(SKILL.md, linie 104)_

> **One system per project.** Do not mix Fluent React with Carbon in the same tree. Do not import shadcn/ui components into a Material 3 app.

_(SKILL.md, linie 140-145)_

> ### 3.C Icons
> * **Allowed libraries (priority order):** `@phosphor-icons/react`, `hugeicons-react`, `@radix-ui/react-icons`, `@tabler/icons-react`.
> * **Discouraged:** `lucide-react`. Acceptable only when the user explicitly asks for it or the project already depends on it.
> * **NEVER hand-roll SVG icons.** If a glyph is missing, install a second library or compose from primitives - do not draw icon paths from scratch.
> * **One family per project.** Do not mix Phosphor with Lucide in the same component tree.
> * **Standardize `strokeWidth` globally** (e.g. `1.5` or `2.0`).

_(SKILL.md, linie 331)_

> * **One copy register per page.** Don't mix technical mono ("47 tasks · 0.6 ctx-switches/day"), editorial prose, and marketing punch in the same composition unless the brand voice explicitly calls for it.

_(SKILL.md, linie 775-779)_

> ### Animation Library Choice
> * **Motion (`motion/react`)** - default for UI / Bento / state-change motion.
> * **GSAP + ScrollTrigger** - for full-page scrolltelling and scroll hijacks. Isolate in dedicated leaf components with `useEffect` cleanup.
> * **Three.js / WebGL** - for canvas backgrounds and 3D scenes. Same isolation rule.
> * **NEVER mix GSAP / Three.js with Motion in the same component tree.** They fight over the same frames.

**Klarow:** OBOWIĄZUJE Z MODYFIKACJĄ: jeden system = kit `company-ui` + `tokens.css`; ikony = **lucide-react** (skill dopuszcza:
„the project already depends on it”), `strokeWidth 1.5` domyślnie i `1.75` wyłącznie dla ikon 16 px, rozmiary {16, 20, 24, 32} (`design-icons-lucide-one-family`, synthesis §2.5.5).
Silniki ruchu: Motion (`m` + `LazyMotion domAnimation strict`) dla DOM, three.js wyłącznie jako izolowany liść tła na desktopie,
**GSAP zakazany** (brak scroll-hijack na landingu). Jeden rejestr copy: founder-led, problem-first, sentence case; zero mono
i „47 tasks · 0.6 ctx-switches” w UI.

## B. Hero i dyscyplina layoutu (§4.3, §4.7, §4.8)

### B.1 Anti-center bias (§4.3)

_(SKILL.md, linie 209-211)_

> ### 4.3 Layout Diversification
> * **ANTI-CENTER BIAS:** Centered Hero / H1 sections are avoided when `DESIGN_VARIANCE > 4`. Force "Split Screen" (50/50), "Left-aligned content / right-aligned asset", "Asymmetric white-space", or scroll-pinned structures.
> * **Override:** centered hero is OK for editorial / manifesto / launch-announcement briefs where the message itself is the design.

**Klarow:** OBOWIĄZUJE. `DESIGN_VARIANCE 6`; hero „Mid Editorial, bottom-left over media” (nie centrowany, nie left-text /
right-image); jedyny moment off-grid na home = offset ram S3.

### B.2 Layout Discipline: hero stack, nav, split-header, bento, mobile (§4.7)

_(SKILL.md, linie 234-260)_

> ### 4.7 Layout Discipline (Hard Rules. Failing any of these is shipping broken work)
>
> * **Hero MUST fit in the initial viewport.** Headline max 2 lines on desktop, subtext max **20 words** AND max 3-4 lines, CTAs visible without scroll. If the copy is too long: reduce font scale OR cut copy. If you cannot describe the value-prop in 20 words of subtext, the value-prop is unclear, not the rule too tight. Never let the hero overflow and force scroll to find the CTA.
> * **Hero font-scale discipline.** Plan font size and image size *together*. If the hero asset is large and the headline is more than 6 words, do not start at `text-7xl/text-8xl`. Default sensible range: `text-4xl md:text-5xl lg:text-6xl` for most heroes; `text-6xl md:text-7xl` only when the headline is 3-5 words. A 4-line hero headline is always a font-size error, never a copy-length error.
> * **HERO TOP PADDING CAP (mandatory):** Hero top padding max `pt-24` (≈6rem) at desktop. More than that means the hero content floats halfway down the viewport and reads as a layout bug, not as intentional space. If your hero needs more breathing room, increase font scale or asset size, not top padding.
> * **HERO STACK DISCIPLINE (max 4 text elements).** The hero is a single moment, not a feature list. Allowed text elements, max 4 in total:
>   1. Eyebrow (small uppercase label) OR brand strip OR neither - pick zero or one
>   2. Headline (max 2 lines, see above)
>   3. Subtext (max 20 words, max 4 lines)
>   4. CTAs (1 primary + max 1 secondary)
>   - **BANNED in the hero:** tiny tagline below CTAs ("Works with GitHub, GitLab, and self-hosted Git"), trust micro-strip ("Used by engineering teams at..."), pricing teaser ("Free for solo, $10/user for teams"), feature bullet list, social-proof avatar row. All of those move to dedicated sections directly below the hero.
>   - If you have an eyebrow AND a tagline below CTAs in the same hero, drop the tagline. If you have a brand strip AND a tagline, drop the tagline. One small text element per hero, max.
> * **"Used by" / "Trusted by" logo wall belongs UNDER the hero, never inside it.** The hero is for the value prop and primary CTA. The logo wall is a separate section directly below. Do not stuff trust logos into the same flex row as the hero copy.
> * **Navigation MUST render on a single line on desktop.** If items don't fit at `lg` (1024px), condense labels, drop secondary items, or move to a hamburger. A two-line nav at desktop is broken design.
> * **Navigation height cap: 80px max desktop, default 64-72px.** No huge "agency" nav bars that eat 15% of the viewport.
> * **Bento grids MUST have rhythm, not one-sided repetition.** Do not stack 6 left-image / right-text rows. Vary the composition: alternate full-width feature rows, asymmetric tile sizes, vertical breaks.
> * **BENTO CELL COUNT RULE (mandatory):** A bento grid has EXACTLY as many cells as you have content for. 3 items → 3 cells (1+2 split, or 2+1, or asymmetric trio). 5 items → 5 cells (2+3, 3+2, hero+4, etc.). If your grid has an empty cell in the middle or at the end, you planned wrong. Re-shape the grid; do not paste a blank tile.
> * **Section-Layout-Repetition Ban.** Once you use a layout family for a section (e.g., 3-column-image-cards, full-width-quote, split-text-image), that family can appear at most ONCE on the page. "Selected commissions" must not look like "What we do." A landing page with 8 sections must use at least 4 different layout families.
> * **ZIGZAG ALTERNATION CAP (mandatory).** Alternating "left-image + right-text" then "left-text + right-image" zigzag layout = banal. Max 2 sections in a row with this image+text-split pattern. The 3rd consecutive image+text split is a Pre-Flight Fail. Break the pattern with a full-width section, a vertical-stack section, a bento grid, a marquee, or a different layout family.
> * **EYEBROW RESTRAINT (mandatory, the #1 violated rule in production tests).** An "eyebrow" is the small uppercase wide-tracking label sitting above a section headline (e.g. `FOUR COLORWAYS`, `SELECTED WORK`, `THE HARDWARE`, `Git-native task management`). Typical CSS signature: `text-[11px] uppercase tracking-[0.18em]`, `font-mono text-[10.5px] uppercase tracking-[0.22em]`. Every AI-built site puts an eyebrow above EVERY section header, producing the same templated rhythm. Hard rule:
>   - **Maximum 1 eyebrow per 3 sections.** Hero counts as 1. So a page with 9 sections may use at most 3 eyebrows total.
>   - If section A has an eyebrow, the next 2 sections cannot have one.
>   - **Pre-Flight Check is mechanical:** count instances of `uppercase tracking` (or similar small-caps mono labels above headlines) across all section components. If count > ceil(sectionCount / 3), the output fails.
>   - **What to do instead of an eyebrow:** drop it entirely. The headline alone is enough. If you need to categorize a section, the section's location on the page already categorizes it; no label needed.
> * **SPLIT-HEADER BAN (mandatory).** The pattern "left big headline + right small explainer paragraph" as a section header (left col-span-7/8, right col-span-4/5 with a small body paragraph floating in the right column) is **banned as default**. Sections should have ONE focused message. If you genuinely need both a headline and an explainer paragraph, stack them vertically (headline on top, body below, max-width 65ch). Reach for the split-header pattern only when there is a real compositional reason (e.g., the right column carries a visual or interactive element, not just filler text).
> * **Bento Background Diversity (mandatory).** Bento and feature-grid sections cannot be 6 white-on-white cards with text inside. At least 2-3 cells in any multi-cell grid need real visual variation: a real image, a brand-appropriate gradient (not AI-purple), a pattern, a tinted background. A cream-on-cream bento with only typography inside reads as boring AI default, even when the rest of the page is good.
> * **Mobile collapse must be explicit per section.** For every multi-column layout, declare the `< 768px` fallback in the same component. No "it'll work, Tailwind handles it" assumptions.

**Klarow:** OBOWIĄZUJE. Hero = 4 elementy (H1 ≤ 2 linie, lead ≤ 20 słów, 1 primary + 1 ghost, realne media), `pt ≤ 6rem`,
nav 1 linia 64 px (limit 80). Reguły `design-hero-discipline`, `design-eyebrow-cap` (home = 0 eyebrow),
`design-no-three-equal-cards` (split-header ban, bento diversity, ≥ 4 rodziny layoutu). Dzisiejsze hero łamie regułę
w 3 punktach (6 elementów, `<br>` w H1, chipy + telefon pod CTA): to pierwszy cel fazy 1.

### B.3 Image & Visual Asset Strategy (§4.8)

_(SKILL.md, linie 262-296)_

> ### 4.8 Image & Visual Asset Strategy
>
> Landing pages and portfolios are **visual products**. Text-only pages with fake-screenshot divs are slop.
>
> **Priority order for visual assets:**
> 1. **Image-generation tool first.** If ANY image-gen tool is available in the environment (`generate_image`, MCP image tool, IDE-integrated gen, OpenAI image tools, etc.) you MUST use it to create section-specific assets: hero photography, product shots, texture backgrounds, mood images. Generate at the right aspect ratio for the section. Do not skip this step because hand-rolled CSS feels faster.
> 2. **Real web images second.** When no gen tool is available, use real photography sources. Acceptable defaults:
>    * `https://picsum.photos/seed/{descriptive-seed}/{w}/{h}` for placeholder photography (seed should describe the section, e.g. `marrow-cookware-kitchen`)
>    * Actual stock or brand URLs when the brief provides them
>    * Open-license sources (Unsplash via direct URL, Pexels) if explicitly allowed
> 3. **Last resort: tell the user.** If neither is possible, do NOT fill the page with hand-rolled SVG illustrations or div-based "fake screenshots." Instead, leave clearly-labeled placeholder slots (`<!-- TODO: hero product photo, 1600x1200 -->`) and at the end of the response say: *"This page needs real images at: \[list of placements\]. Please generate or provide them."*
>
> **Even minimalist sites need real images.** A pure-text page is not minimalism. It is incomplete work. Even an editorial Linear-style site needs at least 2-3 real images (hero, one product/lifestyle shot, one supporting image). Generate B&W minimalist photography if the brief is restrained; do not skip images entirely because the dial is low.
>
> **Real company logos for social proof.** When the brief calls for a "Trusted by / Used by / Customers" logo wall, do NOT default to plain text wordmarks (`<span>Acme Co</span>` styled in a row). Use real SVG logos:
> * **Source: Simple Icons** (`https://cdn.simpleicons.org/{slug}/ffffff` for any color, or `simple-icons` npm package). Covers most known brands.
> * **Alternative: devicon** for tech-stack logos (`@svgr/cli` or CDN).
> * **Make-up the brand name? Then make-up an SVG mark too.** Generate a simple monogram (one letter in a circle, two-letter ligature, abstract glyph) rendered as an inline `<svg>` matching the page style. Plain text wordmarks for invented brand names look generic.
> * **Always** ensure logos render in both light and dark mode (white-on-dark, black-on-light, or single-color theme variable).
> * **LOGO-ONLY rule (mandatory):** logo wall = logos and nothing else. Do NOT print industry / category labels below each logo (no `Vercel` + `hosting` underneath, no `Stripe` + `payments`, no `Cloudflare` + `infra`). The logo is the credibility, the label adds nothing the user does not already know. Optional: brand name as alt-text for screen readers, optional link to the brand's site. That is it.
>
> **Hand-rolled illustrations:**
> * SVG icons from libraries: fine (see Section 3.C).
> * Hand-rolled decorative SVGs (custom illustrations, logos, marks): **strongly discouraged**, never as default. Acceptable only when:
>   - The brief explicitly calls for it ("draw me an SVG logo")
>   - It's a single, simple geometric mark (a square, a circle, a wordmark in display type)
>   - You're confident in the output quality
>
> **Div-based fake screenshots are banned.** A "hand-built product preview" rendered with `<div>` rectangles, fake task lists, fake dashboards, fake terminal windows is a Tell. If you need to show a product:
> * Use a real screenshot URL if one exists
> * Generate one via image tool
> * Use a real component preview (an actual mini-version of the UI inside the page)
> * Or skip the preview entirely and use editorial photography
>
> **Hero needs a real visual.** Text + gradient blob is not a hero - it's a placeholder.

**Klarow:** OBOWIĄZUJE Z MODYFIKACJĄ: „real visual” = poster/wideo hero z Higgsfield (po trialu; plan B: GLSL Hills)
i **prawdziwe zrzuty własnych dem** (Playwright), nigdy stock; `picsum.photos` / Unsplash **zakazane w `dist`** (kit: zero CDN,
on-prem); hand-rolled SVG tylko jako diagramy z danymi (`CollaborationFlow`, `KsefFlow`). Sekcja bez assetu = usunięta,
nie placeholderowana. Logo wall: dopiero po zgodach; bez „Quietly trusted by”.

## C. Ban-lista anti-slop (§0.D, §9.A–G)

### C.1 Anti-Default Discipline (§0.D)

_(SKILL.md, linie 38-39)_

> ### 0.D Anti-Default Discipline
> Do not default to: AI-purple gradients, centered hero over dark mesh, three equal feature cards, generic glassmorphism on everything, infinite-loop micro-animations everywhere, Inter + slate-900. These are the LLM defaults. Reach past them deliberately based on the design read.

### C.2 AI Tells (§9 w całości: A Visual & CSS · B Typography · C Layout · D Content · E External · F Production-Test Tells · G Em-dash)

_(SKILL.md, linie 595-701)_

> ## 9. AI TELLS (Forbidden Patterns)
>
> Avoid these signatures unless the brief explicitly asks for them.
>
> ### 9.A Visual & CSS
> * **NO neon / outer glows** by default. Use inner borders or subtle tinted shadows.
> * **NO pure black (`#000000`).** Off-black, zinc-950, or charcoal.
> * **NO oversaturated accents.** Desaturate to blend with neutrals.
> * **NO excessive gradient text** for large headers.
> * **NO custom mouse cursors.** Outdated, accessibility-hostile, perf-hostile.
>
> ### 9.B Typography
> * **AVOID Inter as default.** See Section 4.1. Override path exists.
> * **NO oversized H1s** that just scream. Control hierarchy with weight + color, not raw scale.
> * **Serif constraints:** Serif for editorial / luxury / publication. Not for dashboards.
>
> ### 9.C Layout & Spacing
> * **Mathematically perfect** padding and margins. No floating elements with awkward gaps.
> * **NO 3-column equal feature cards.** The generic "three identical cards horizontally" feature row is banned. Use 2-column zig-zag, asymmetric grid, scroll-pinned, or horizontal-scroll alternative.
>
> ### 9.D Content & Data ("Jane Doe" Effect)
> * **NO generic names.** "John Doe", "Sarah Chan", "Jack Su" → use creative, realistic, locale-appropriate names.
> * **NO generic avatars.** No SVG "egg" or Lucide user icons → use believable photo placeholders or specific styling.
> * **NO fake-perfect numbers.** Avoid `99.99%`, `50%`, `1234567`. Use organic, messy data (`47.2%`, `+1 (312) 847-1928`).
> * **NO startup-slop brand names.** "Acme", "Nexus", "SmartFlow", "Cloudly" → invent contextual, premium names that sound real.
> * **NO filler verbs.** "Elevate", "Seamless", "Unleash", "Next-Gen", "Revolutionize" → concrete verbs only.
>
> ### 9.E External Resources & Components
> * **NO hand-rolled SVG icons.** Use Phosphor / HugeIcons / Radix / Tabler. Lucide on explicit request only.
> * **Hand-rolled decorative SVGs strongly discouraged** as default (see Section 4.8).
> * **NO div-based fake screenshots.** Never build a fake product UI out of `<div>` rectangles to simulate a screenshot. Use real images, generated images, or skip the preview.
> * **NO broken Unsplash links.** Use `https://picsum.photos/seed/{descriptive-string}/{w}/{h}`, or generated photo placeholders, or actual assets.
> * **shadcn/ui customization:** Allowed, but NEVER in default state. Customize radii, colors, shadows, typography to the project aesthetic.
> * **Production-Ready Cleanliness:** Code visually clean, memorable, meticulously refined.
>
> ### 9.F Production-Test Tells (banned outright)
>
> These patterns came out of real LLM-generated landing-page tests. They are the signatures the model defaults to when it tries to "look designed." Treat them as hard bans unless the brief explicitly calls for one.
>
> **Hero & top-of-page**
> * **NO version labels in the hero.** `V0.6`, `v2.0`, `BETA`, `INVITE-ONLY PREVIEW`, `EARLY ACCESS`, `ALPHA` - banned as default eyebrows. Only acceptable when the brief is explicitly about a product launch / preview status.
> * **NO "Brand · No. 01"-style sub-eyebrows.** "Marrow · No. 01 · The 6-quart" type micro-meta lines. Skip them.
>
> **Section numbering & micro-labels**
> * **NO section-number eyebrows.** `00 / INDEX`, `001 · Capabilities`, `002 · Featured commission`, `06 · how it works`, `05 · The honest table` - banned. Eyebrows should name the topic in plain language, not enumerate.
> * **NO `01 / 4`-style pagination on images or bento tiles.** If the user can count, they don't need the label.
> * **NO `Scroll · 001 Capabilities`-style scroll cues.** A simple arrow or "Scroll" is enough; no section-number prefix.
> * **NO "Index of Work, 2018 - 2026"-style range labels** as eyebrows. Just say what the section is.
>
> **Separators & dots**
> * **The middle-dot (`·`) is rationed.** Maximum 1 per line in metadata strips. Do NOT use it as the default separator for everything ("foo · bar · baz · qux · quux"). If you need a separator family, prefer line breaks, hairlines, or columns.
> * **NO decorative colored status dots on every list/nav/badge.** A colored dot before "ONE Q4 SLOT OPEN" or before every nav link, or every task row - banned by default. Acceptable only when the dot conveys actual semantic state (a server status, an availability flag) and is used sparingly.
>
> **Em-dashes & typography flourishes**
> * **NO em-dash (`—`) as a design element OR anywhere else.** See Section 9.G below for the complete, non-negotiable ban. The em-dash character is forbidden in headlines, eyebrows, pills, body copy, quotes, attribution, captions, button text, and alt text. Use the regular hyphen (`-`).
> * **NO `<br>`-broken-and-italicized headlines** as a default "design move." "for thirty\<br\>*years.*" type splits. Headlines should read naturally first, get clever only when the brief demands it.
> * **NO vertical rotated text** ("INDEX OF WORK, 2018 - 2026" rotated 90°). Agency-portfolio cliché. Use it only when the brief is explicitly agency / Awwwards / experimental AND it serves a real composition purpose.
> * **NO crosshair / hairline grid lines as decoration.** Vertical and horizontal lines drawn just to make the page "feel designed" - banned. Use them only when they organize real content.
>
> **Fake product previews**
> * **NO div-based fake product UI in the hero** (fake task list, fake terminal, fake dashboard built from styled divs). It is the #1 LLM-design Tell. Use a real screenshot, a generated image, a real component preview, or none at all.
> * **NO fake version footers** ("v0.6.2-rc.1", "last sync 4s ago · main") inside fake screenshots. Adds nothing, screams AI.
>
> **Marketing-copy Tells**
> * **NO "Quietly in use at" / "Quietly trusted by"** social-proof headers. Use natural language: "Trusted by", "Used at", "Customers include", or skip the heading entirely if the logos speak.
> * **NO "From the field" / "Field notes" / "Currently on the bench" / "On our desks" / "Loose plates" style poetic labels** on quote, blog, or sidebar sections. Reads as performative-craftsman. Use plain functional labels ("Testimonials", "Latest writing", "Now working on") or skip the label.
> * **NO "We respect the French ones"-style** mock-humble industry-references in body copy. Cute and AI-y.
> * **NO weather / locale strips** ("LIS 14:23 · 18°C") in headers/footers unless the brief is explicitly about a place / time-zone-distributed studio.
> * **NO micro-meta-sentences under eyebrows.** Sentences like *"Each of these is a feature we ship today, not a roadmap promise. The list will stay short on purpose."* sitting under a section heading are clutter. Eyebrow + Headline + Body is enough.
> * **NO generic step labels.** "Stage 1 / Stage 2 / Stage 3", "Step 1 / Step 2 / Step 3", "Phase 01 / Phase 02 / Phase 03", "Pass One / Pass Two / Pass Three". Banned. The actual step content is the label. If you must show progression, use the verb-noun directly ("Install", "Configure", "Ship") not "Stage 1: Install".
>
> **Pills, labels and version stamps**
> * **NO pills/labels/tags overlaid on images.** No `<span>` overlays on photos with tags like `Brand · 02`, `PLATE · BRAND`, `Field notes - journal`. Either let the image speak alone, or add a caption directly below (outside the image).
> * **NO photo-credit captions as decoration.** Strings like `Field study no. 12 · Ines Caetano`, `Plate 03 · House archive`, `Frame XII · 35mm` under stock/picsum images are pretentious. Photo credit is allowed ONLY when there is a real photographer being credited for a real photo (with permission). Otherwise: skip the caption or use a one-line functional caption ("The 6-quart, in Sage.").
> * **NO version footers on marketing pages.** Footer strings like `v1.4.2`, `Build 0048`, `last sync 4s ago · main` are CLI / devtool fixtures, not landing-page content. Banned on marketing/landing/portfolio pages.
> * **NO "Reservation 412 of 800"-style live-stock counters** as decoration. Only if the brief is explicitly a limited-run waitlist with real data.
>
> **Decoration text strips**
> * **NO decoration text strip at hero bottom.** Patterns like `BRAND. MOTION. SPATIAL.`, `TYPE / FORM / MOTION`, `DESIGN · BUILD · SHIP`, `ESTD. 2018 · LISBON · BRAND. MOTION. SPATIAL.` as a small mono-caps strip across the bottom of the hero are an agency-portfolio cliché. Banned by default. Only acceptable when the strip carries real, navigable links (sticky bottom nav) or real status info (cookie banner, build info on a docs site).
> * **NO floating top-right sub-text in section headings.** Pattern: section has a giant left-aligned headline; in the top-right corner of the same section header there is a small explainer paragraph floating with no clear alignment to anything else. That floater is the Tell. Either put the sub-text directly under the headline, or build a clean 2-column header (left: headline, right: aligned body), but not a tiny corner paragraph.
>
> **Lists, dividers and scoring**
> * **NO `border-t` + `border-b` on every row of a long list / spec table.** Pick one (bottom-border between rows OR top-border above the group) and use it sparsely. A 10-row spec table with hairlines under each row is the laziest layout - see Section 4.9 for alternative UI components.
> * **NO scoring/progress bars with filled background tracks** as comparison visuals. If you need to show "X out of Y" comparisons, prefer a number + small icon, or a tiny inline bar WITHOUT a background track. Big filled `bg-zinc-200` tracks with a partial fill on top are dashboard-UI clutter on a landing page.
>
> **Locale, time, scroll cues**
> * **Locale / city-name / time / weather strips are banned for 99% of briefs.** "Lisbon, working with founders" in the hero, "1200-690 Lisbon, Portugal" in the footer, "Lisbon 14:23 · 18°C" in the nav. These are agency-portfolio decoration tells. Allowed ONLY when: the brief explicitly describes a globally-distributed studio with timezone-relevant work, OR a travel-focused brand, OR a real-world physical venue. A single contact-address mention in the footer is fine; an atmospheric locale strip is not.
> * **Scroll cues are banned.** `Scroll`, `↓ scroll`, `Scroll to explore`, `Scroll to walk through it`, animated mouse-wheel icons. If the user has not scrolled yet, they are looking at the hero. They know what scroll is. The bottom of the viewport does not need a label.
> * **ZERO decorative status dots by default.** A coloured dot before nav items, before list rows, before badges, before status labels is a Tell. Only acceptable when conveying real semantic state (a live indicator on actual server status, a live availability flag) and limited to one per page section.
>
> ### 9.G EM-DASH BAN (the single most-violated Tell)
>
> **Em-dash (`—`) is COMPLETELY banned.** It is the LLM's signature stylistic crutch and it is the #1 visual Tell in production tests. There is no "limited use" allowance, no "natural language frequency" allowance, no "in body copy is fine" allowance. None.
>
> * **Banned in headlines.** Use a period or a comma.
> * **Banned in eyebrows / labels / pills / button text / image captions / nav items.** Replace with line breaks, columns, or hairlines.
> * **Banned in body copy.** Restructure the sentence: two sentences with a period, OR a comma, OR parentheses, OR a colon.
> * **Banned in quote attribution.** Use a normal hyphen with spaces (` - `) or a line break + smaller-weight name.
> * **Banned in en-dash form too (`–`) when used as a separator.** Date ranges (`2018-2026`) use a hyphen. Number ranges (`€40-80k`) use a hyphen.
>
> The ONLY permitted dash characters on the page are:
> * Regular hyphen `-` (for compound words, ranges, line dividers in markup)
> * Minus sign in math (`-5°C`)
>
> If your output contains a single `—` or `–` anywhere visible to the user, the output fails the Pre-Flight Check and must be rewritten.
>
> This rule is non-negotiable. The agent has historically ignored em-dash limits when phrased as "use sparingly." The phrasing here is binary: zero em-dashes.

**Klarow:** OBOWIĄZUJE W CAŁOŚCI na trasach marketingowych, z trzema rozstrzygnięciami:

1. **Em-dash (§9.G):** decyzja D-09 (b): `—` zakaz całkowity w UI, danych, meta, PDF, alt; `–` (półpauza) wyłącznie w zakresach
   liczbowych („20–250”, „5–10 dni”); w EN zero obu znaków. Dywiz ze spacjami „ - ” w prozie PL jest błędem typograficznym,
   więc zdania przebudowujemy (kropka, dwukropek, przecinek, nawias). Sweep 621 „—” w `site/src` = osobny dzień fazy 0.
2. **Ikony (§9.E):** lucide zostaje (explicit, projekt zależy); zakaz picsum/unsplash w `dist` jest ostrzejszy niż skill.
3. **Fonty (§9.B):** Nunito Sans (self-hosted) nie jest banowany; zero serif, zero Inter/Roboto/Arial jako kroju UI.
   Polskie odpowiedniki filler-verbs: „podnieś na wyższy poziom”, „bezproblemowo”, „bezszwowo”, „uwolnij potencjał”,
   „nowej generacji”, „rewolucjonizuj”, „game-changer”, „kompleksowe rozwiązanie”, „transformacja cyfrowa”,
   „w dzisiejszym świecie” (`MESSAGING.bannedWords`).

Dodatkowo u nas zakazane (spoza §9): wersja w stopce („strona robocza v0.8”), sondy `?debug=1` w treści produkcyjnej,
„Wdrożone u klientów” bez pokrycia, kwoty za usługi, słowo „AI” w sprzedaży (reguły `brand-*`).

## D. Szkielety animacji (§5, §5.A–D) z adnotacją, co u nas ZAKAZANE

### D.1 Zasady nadrzędne (§5 wstęp)

_(SKILL.md, linie 352-363)_

> ## 5. CONTEXT-AWARE PROACTIVITY
>
> These are tools, not defaults. Use them when the design read calls for them. **None of these fire automatically.**
>
> * **Liquid Glass / Glassmorphism:** Appropriate for premium consumer, Apple-adjacent, luxury brand, or media-overlay vibes. Inappropriate for dashboards, public-sector, or "boring B2B." When used, go beyond `backdrop-blur`: add a 1px inner border (`border-white/10`) and a subtle inner shadow (`shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]`) for physical edge refraction. Provide a solid-fill fallback under `prefers-reduced-transparency`.
> * **Magnetic Micro-physics:** Use when `MOTION_INTENSITY > 5` AND the brief reads premium / playful / agency. Implement EXCLUSIVELY with Motion's `useMotionValue` / `useTransform` outside the React render cycle. Never `useState`. See Section 3.B.
> * **Perpetual Micro-Interactions** (Pulse, Typewriter, Float, Shimmer, Carousel): Use when `MOTION_INTENSITY > 5` AND the section actively benefits from motion (status indicators, live feeds, AI-feel). **Not every card needs an infinite loop.** If a section is informational, leave it still. Apply Spring Physics (`type: "spring", stiffness: 100, damping: 20`) - no linear easing.
> * **"Motion claimed, motion shown."** If `MOTION_INTENSITY > 4`, the page must actually move: entry transitions on hero, scroll-reveal on key sections, hover physics on CTAs, at minimum. A static page that claims `MOTION_INTENSITY: 7` is broken. Conversely, if you cannot ship working motion in the available scope, drop the dial to 3 and ship a clean static page. Never half-build motion that breaks (cut-off ScrollTriggers, jumpy enters, missing cleanups).
> * **MOTION MUST BE MOTIVATED (mandatory).** Before adding any animation, ask: "what does this animation communicate?" Valid answers: hierarchy (drawing attention to the right thing), storytelling (revealing content in sequence that matches a narrative), feedback (acknowledging a user action), state transition (showing something changed). Invalid answer: "it looked cool". GSAP everywhere because GSAP is available is amateur. Each ScrollTrigger, each marquee, each pinned section needs a reason. If you cannot articulate the reason in one sentence, drop the animation.
> * **MARQUEE MAX-ONE-PER-PAGE (mandatory).** Horizontal scrolling text marquees ("logos endlessly scrolling", "manifesto scrolling sideways", "kinetic word strip") are appropriate at most ONCE per page. Two or more marquees on the same page reads as lazy filler. Pick the one section where the marquee actually serves the content; the others get a different layout.
> * **GSAP Sticky-Stack Pattern (when scroll-stack is used).** A "card stack on scroll" must be a REAL sticky-stack, not a sequential reveal list. See Section 5.A below for the canonical code skeleton. Common failure: trigger fires halfway through scroll instead of pinning at viewport top. Fix: `start: "top top"` not `start: "top center"` or `"top 80%"`.
> * **GSAP Horizontal-Pan Pattern (when horizontal scroll-hijack is used).** See Section 5.B below for the canonical skeleton. Common failure: animation starts before the section is pinned, so the user sees half a slide. Same fix: `start: "top top"`, pin the wrapper, scrub the inner track.

**Klarow:** `MOTION_INTENSITY 4` (świadomie o 1 niżej niż raport researchu: Karol dwukrotnie cofał efektowność).
„Motion must be motivated” OBOWIĄZUJE (tabela animacji z motywacją w 1 zdaniu, synthesis §2.4.7).
**ZAKAZANE u nas:** Liquid Glass / glassmorphism (`design-no-glass-no-blur`), Magnetic micro-physics, Perpetual
micro-interactions (pulse / typewriter / float / shimmer / carousel), marquee (limit skilla „max 1”; u nas 0),
GSAP Sticky-Stack i Horizontal-Pan (niżej).

### D.2 §5.A Sticky-Stack: ZAKAZANE (zachowane tylko jako opis wzorca)

_(SKILL.md, linie 365-425)_

> ### 5.A Sticky-Stack - Canonical Skeleton
>
> ```tsx
> "use client";
> import { useRef, useEffect } from "react";
> import { gsap } from "gsap";
> import { ScrollTrigger } from "gsap/ScrollTrigger";
> import { useReducedMotion } from "motion/react";
>
> gsap.registerPlugin(ScrollTrigger);
>
> export function StickyStack({ cards }: { cards: React.ReactNode[] }) {
>   const ref = useRef<HTMLDivElement>(null);
>   const reduce = useReducedMotion();
>
>   useEffect(() => {
>     if (reduce || !ref.current) return;
>     const ctx = gsap.context(() => {
>       const cardEls = gsap.utils.toArray<HTMLElement>(".stack-card");
>       cardEls.forEach((card, i) => {
>         if (i === cardEls.length - 1) return;
>         ScrollTrigger.create({
>           trigger: card,
>           start: "top top",                              // pin at viewport top
>           endTrigger: cardEls[cardEls.length - 1],
>           end: "top top",
>           pin: true,
>           pinSpacing: false,
>         });
>         gsap.to(card, {
>           scale: 0.92,
>           opacity: 0.55,
>           ease: "none",
>           scrollTrigger: {
>             trigger: cardEls[i + 1],
>             start: "top bottom",
>             end: "top top",
>             scrub: true,
>           },
>         });
>       });
>     }, ref);
>     return () => ctx.revert();
>   }, [reduce]);
>
>   return (
>     <div ref={ref} className="relative">
>       {cards.map((card, i) => (
>         <div
>           key={i}
>           className="stack-card sticky top-0 min-h-[100dvh] flex items-center justify-center"
>         >
>           {card}
>         </div>
>       ))}
>     </div>
>   );
> }
> ```
>
> Critical points: `start: "top top"`, `pin: true`, every card except the last is pinned, the scale/opacity transform is driven by the NEXT card's scroll trigger (so previous card shrinks as next one arrives).

**Klarow: ZAKAZ PRODUKTOWY**, niezależnie od techniki (GSAP, Motion `useScroll`, CSS `scroll-timeline`, `position: sticky`
+ transform): decyzje Karola 2026-07-22 (karuzela orbitalna usunięta) i 2026-07-26 (deck slajdowy usunięty pod SEO).
Reguła `motion-no-pinning-no-scroll-hijack` (BLOCKER). Skill nie nadpisuje decyzji produktowej.

### D.3 §5.B Horizontal-Pan: ZAKAZANE (jak wyżej)

_(SKILL.md, linie 427-473)_

> ### 5.B Horizontal-Pan - Canonical Skeleton
>
> ```tsx
> "use client";
> import { useRef, useEffect } from "react";
> import { gsap } from "gsap";
> import { ScrollTrigger } from "gsap/ScrollTrigger";
> import { useReducedMotion } from "motion/react";
>
> gsap.registerPlugin(ScrollTrigger);
>
> export function HorizontalPan({ children }: { children: React.ReactNode }) {
>   const wrap = useRef<HTMLDivElement>(null);
>   const track = useRef<HTMLDivElement>(null);
>   const reduce = useReducedMotion();
>
>   useEffect(() => {
>     if (reduce || !wrap.current || !track.current) return;
>     const ctx = gsap.context(() => {
>       const distance = track.current!.scrollWidth - window.innerWidth;
>       gsap.to(track.current, {
>         x: -distance,
>         ease: "none",
>         scrollTrigger: {
>           trigger: wrap.current,
>           start: "top top",                              // pin starts when section top hits viewport top
>           end: () => `+=${distance}`,                    // scroll distance = track width minus viewport
>           pin: true,
>           scrub: 1,
>           invalidateOnRefresh: true,
>         },
>       });
>     }, wrap);
>     return () => ctx.revert();
>   }, [reduce]);
>
>   return (
>     <section ref={wrap} className="relative overflow-hidden">
>       <div ref={track} className="flex h-[100dvh] items-center">
>         {children}
>       </div>
>     </section>
>   );
> }
> ```
>
> Critical points: `start: "top top"`, `pin: true`, `end: "+=${distance}"` (scroll length = horizontal travel needed), `scrub: 1`. The wrapper is pinned, the inner track slides horizontally as the user scrolls vertically.

**Klarow: ZAKAZ PRODUKTOWY** (jak D.2). Dodatkowo zakaz `overflow: hidden` na `html/body`, listenerów `wheel`/`touchmove`
przejmujących scroll, `window.scrollY` w stanie React.

### D.4 §5.C Scroll-Reveal Stagger: DOMYŚLNY wzorzec Klarow (z modyfikacjami)

_(SKILL.md, linie 475-507)_

> ### 5.C Scroll-Reveal Stagger - Canonical Skeleton (lighter alternative)
>
> For simple "items appear as they enter viewport" (no pinning), prefer Motion's `whileInView` over GSAP - lighter, no ScrollTrigger needed:
>
> ```tsx
> "use client";
> import { motion, useReducedMotion } from "motion/react";
>
> export function RevealStagger({ items }: { items: string[] }) {
>   const reduce = useReducedMotion();
>   return (
>     <ul className="grid gap-6">
>       {items.map((item, i) => (
>         <motion.li
>           key={item}
>           initial={reduce ? false : { opacity: 0, y: 24 }}
>           whileInView={{ opacity: 1, y: 0 }}
>           viewport={{ once: true, amount: 0.3 }}
>           transition={{
>             duration: 0.6,
>             delay: i * 0.06,
>             ease: [0.16, 1, 0.3, 1],
>           }}
>         >
>           {item}
>         </motion.li>
>       ))}
>     </ul>
>   );
> }
> ```
>
> Use this for: feature lists, testimonial grids, logo walls, anything that just needs "enter on scroll." Save GSAP for actual pin/scrub work.

**Klarow:** OBOWIĄZUJE Z MODYFIKACJĄ: `m.li` z `motion/react-m` pod `LazyMotion domAnimation strict` (nie `motion.li`;
`import { motion }` zakazany), warianty `fadeUp` z `src/motion/presets.ts` (y 12 px, 420 ms, stagger 50 ms,
`EASE_OUT [0.22, 1, 0.36, 1]`, `viewport { once: true, amount: .25 }`), maksymalnie 12 dzieci w kaskadzie.
**Nigdy na treści obecnej w shellu prerenderu** (H1, lead, CTA, liczby SSR): tam `initial={false}`, inaczej treść jest
niewidoczna bez JS i miga po podmianie shellu (`motion-no-initial-hidden-above-fold`). `"use client"` w Vite zbędne.

### D.5 §5.D Forbidden Animation Patterns

_(SKILL.md, linie 509-515)_

> ### 5.D Forbidden Animation Patterns
>
> * **`window.addEventListener("scroll", ...)`** is banned. It runs on every scroll frame, jank-prone, no batching. Use Motion's `useScroll()`, GSAP's `ScrollTrigger`, IntersectionObserver, or CSS `scroll-driven animations` (`animation-timeline: view()`).
> * **Custom scroll progress calculations using `window.scrollY`** in React state. Same reason. Re-renders on every frame.
> * **`requestAnimationFrame` loops that touch React state.** Use motion values (`useMotionValue` + `useTransform`) instead.
> * **Layout Transitions:** Use Motion's `layout` and `layoutId` props for visible state changes (re-ordering lists, expanding modals, shared elements between routes). Do not wrap static content in `layout` props "for safety" - it costs measurement work.
> * **Staggered Orchestration:** Use `staggerChildren` (Motion) or CSS cascade (`animation-delay: calc(var(--index) * 100ms)`) for reveal moments where sequence matters. For `staggerChildren`, parent (`variants`) and children MUST share the same Client Component tree.

**Klarow:** OBOWIĄZUJE. `layout`/`layoutId` dodatkowo ZAKAZANE do decyzji o `domMax` (+13,7 KB gz); `staggerChildren`
przez `delayChildren: stagger()` w presetach; rAF tylko w izolowanym tle (`glsl-hills.tsx`) bez dotykania stanu React.

## E. Performance & Accessibility Guardrails (§6)

_(SKILL.md, linie 519-548)_

> ## 6. PERFORMANCE & ACCESSIBILITY GUARDRAILS
>
> ### 6.A Hardware Acceleration
> * Animate ONLY `transform` and `opacity`. Never animate `top`, `left`, `width`, `height`.
> * Use `will-change: transform` sparingly - only on elements that will actually animate.
>
> ### 6.B Reduced Motion (mandatory)
> * **Any motion above `MOTION_INTENSITY > 3` MUST honor `prefers-reduced-motion`.** This is non-negotiable.
> * In Motion: wrap with `useReducedMotion()` and degrade to static.
> * In CSS: gate animations behind `@media (prefers-reduced-motion: no-preference)` or provide an override block under `@media (prefers-reduced-motion: reduce)` that disables.
> * Infinite loops, parallax, scroll-hijack, and magnetic physics MUST collapse to static / instant under reduced motion.
>
> ### 6.C Dark Mode (mandatory for any consumer-facing page)
> * Design for **both modes from the start**. Never ship light-only or dark-only without explicit user instruction.
> * Use Tailwind `dark:` variant OR CSS variables for tokens. Pick one strategy per project.
> * **Do not prescribe specific dark-mode colors here.** The brief decides. Maintain visual hierarchy, brand identity, and WCAG AA contrast (AAA for body) across both modes.
> * Respect `prefers-color-scheme: dark`. Default to system preference unless the brand insists on one mode.
>
> ### 6.D Core Web Vitals Targets
> * **LCP** < 2.5s. Hero image must be `next/image priority` or preloaded.
> * **INP** < 200ms. Heavy work off main thread.
> * **CLS** < 0.1. Reserve space for images, fonts, embeds.
> * Run Lighthouse before declaring a page done.
>
> ### 6.E DOM Cost
> * Apply grain / noise filters EXCLUSIVELY to fixed, `pointer-events-none` pseudo-elements (e.g., `fixed inset-0 z-[60] pointer-events-none`). NEVER on scrolling containers - continuous GPU repaints destroy mobile FPS.
> * Be aware of bundle size. Motion is not tiny. Three.js is large. Lazy-load anything that's not above-the-fold.
>
> ### 6.F Z-Index Restraint
> NEVER spam arbitrary `z-50` or `z-10`. Use z-index strictly for systemic layer contexts (sticky navbars, modals, overlays, grain). Document the z-index scale in a project constants file.

**Klarow:** OBOWIĄZUJE. Reduced-motion w 3 warstwach (`MotionConfig reducedMotion="user"` + `useReducedMotion` dla
wideo/canvasu/liczników + CSS `@media`), wideo i canvas nigdy na `pointer: coarse`. Dark mode: brand insists → dark lock
(patrz §F). CWV: LCP mobile < 2,5 s (poster preload), CLS < 0,1 (cel 0,05), INP < 200 ms; Lighthouse przed DoD.
Z-index: skala w `tokens.css` (`design-sticky-opaque`). Grain / noise: nie używamy.

## F. Dark Mode Protocol (§8)

_(SKILL.md, linie 572-591)_

> ## 8. DARK MODE PROTOCOL
>
> Dual-mode by default. Never assume light-only unless the brief is print-emulating editorial.
>
> ### 8.A Token Strategy (pick one, stick to it)
> * **Tailwind `dark:` variant** (default for utility-first projects): every color utility paired with its dark variant (`bg-white dark:bg-zinc-950`, `text-gray-900 dark:text-gray-100`).
> * **CSS variables** (for shadcn/ui, Radix Themes, or component libraries with theming): define semantic tokens (`--surface`, `--surface-elevated`, `--text-primary`, `--accent`) and swap values under `[data-theme="dark"]` or `@media (prefers-color-scheme: dark)`.
>
> ### 8.B Do Not Prescribe Specific Colors Here
> The brief and brand decide. This skill enforces only:
> * **Contrast** - WCAG AA minimum for body text, AAA target for hero copy.
> * **Hierarchy parity** - visual hierarchy that works in light must work in dark. If a CTA pops in light, it pops in dark.
> * **Brand fidelity** - primary brand color stays recognisable. Don't desaturate the brand into a dark mode.
> * **No pure `#000000` and no pure `#ffffff`** - use off-black (zinc-950, near-black warm gray) and off-white. Pure values kill depth.
>
> ### 8.C Default Mode
> Respect `prefers-color-scheme` unless the brand insists. Add a manual toggle if either mode would lose key brand expression.
>
> ### 8.D Test in Both Modes Before Finishing
> Open the page in both modes during development. Do not ship a page you've only seen in one mode.

**Klarow:** OBOWIĄZUJE Z MODYFIKACJĄ (8.C „unless the brand insists”): strategia = CSS variables (nie `dark:`), landing tylko
ciemny, komplet tokenów light od dnia 1 dla narzędzi / PDF / brandkitu, test obu motywów dotyczy dashboardów i kitu,
nie landingu. „No pure #000000 / #ffffff”: tło `#121212`, biel tylko `--cta-hover`. Kontrast: `design-contrast-aa`.

## G. Out of scope skilla (§13) = nasz tryb `tool`

_(SKILL.md, linie 896-906)_

> ## 13. OUT OF SCOPE
>
> This skill is NOT for:
> * Dashboards / dense product UI / admin panels (use Fluent, Carbon, Atlassian, or Polaris from Section 2.A).
> * Data tables (use TanStack Table or AG Grid).
> * Multi-step forms / wizards (use Form-specific patterns; this skill won't make them better).
> * Code editors (use Monaco / CodeMirror with their official skinning).
> * Native mobile (use Apple HIG / Material directly).
> * Realtime collab UIs (presence, cursors, OT-aware - different problem class).
>
> If the brief is one of the above, **say so explicitly**, point to the right tool, and only apply this skill's marketing-page / about-page / landing-page parts to the surfaces where they apply.

**Klarow:** dashboardy, tabele danych, kreatory (protokoły, kalkulator transz, obieg przelewów) są POZA zakresem
taste-skill; obowiązuje tam kit (`design-*` z rodziny tokens / shape / status / overflow / sticky / contrast / typography)
bez hero / eyebrow / layout-families. Tryb wykrywany po ścieżce (`components/dashboards/**`, `DemoReport.tsx`, `lib/**`,
`demo/**`) i po `data-surface="tool"`.

## H. Final Pre-Flight Check (§14)

_(SKILL.md, linie 910-979)_

> ## 14. FINAL PRE-FLIGHT CHECK
>
> Run this matrix before outputting code. This is the last filter.
>
> **THIS IS NOT OPTIONAL. Run every box. If any box fails, the output is not done.**
>
> - [ ] **Brief inference** declared (Section 0.B one-liner)?
> - [ ] **Dial values** explicit and reasoned from the brief, not silently using baseline?
> - [ ] **Design system** chosen from Section 2 if applicable, or aesthetic labeled honestly?
> - [ ] **Redesign mode** detected and audit performed (if applicable, Section 11)?
> - [ ] **ZERO em-dashes (`—`) anywhere on the page.** Headlines, eyebrows, pills, body, quotes, attribution, captions, buttons, alt text. Zero. (Section 9.G - non-negotiable.)
> - [ ] **Page Theme Lock**: ONE theme (light, dark, or auto) for the whole page. No section flips to inverted mode mid-page (Section 4.11)?
> - [ ] **Color Consistency Lock**: one accent color used identically across all sections (Section 4.2)?
> - [ ] **Shape Consistency Lock**: one corner-radius system applied consistently (Section 4.4)?
> - [ ] **Button Contrast Check**: every CTA text is readable against its background (no white-on-white, WCAG AA 4.5:1)?
> - [ ] **CTA Button Wrap**: no CTA label wraps to 2+ lines at desktop?
> - [ ] **Form Contrast Check**: form inputs, placeholders, focus rings, labels all pass WCAG AA against the section background?
> - [ ] **Serif discipline**: if a serif is used, it is NOT Fraunces or Instrument_Serif (or it is, with explicit brand justification)? Different serif from your previous project?
> - [ ] **Premium-consumer palette check**: if the brief is premium-consumer (cookware / wellness / artisan / luxury), the palette is NOT the AI-default beige+brass+oxblood+espresso family? Different family from your previous premium-consumer project?
> - [ ] **Italic descender clearance**: every italic word with `y g j p q` has `leading-[1.1]` min + `pb-1` reserve?
> - [ ] **Hero fits the viewport**: headline ≤ 2 lines, subtext ≤ 20 words AND ≤ 4 lines, CTA visible without scroll, font scale planned around image?
> - [ ] **Hero top padding**: max `pt-24` at desktop, hero content does not float halfway down the viewport?
> - [ ] **Hero stack discipline**: max 4 text elements in hero (eyebrow OR brand strip, headline, subtext, CTAs)? No tiny tagline below CTAs, no trust micro-strip in hero?
> - [ ] **EYEBROW COUNT (mechanical)**: count instances of `uppercase tracking` micro-labels above section headlines across all components. Count ≤ ceil(sectionCount / 3)? Hero counts as 1.
> - [ ] **Split-Header Ban**: no "left big headline + right small explainer paragraph" pattern as a section header (vertical stack instead)?
> - [ ] **Zigzag Alternation Cap**: no 3+ consecutive sections with the same image+text-split layout?
> - [ ] **No Duplicate CTA Intent**: no two CTAs with the same intent ("Get in touch" + "Let's talk" both on page = Fail)?
> - [ ] **Logo wall = logo only**: no industry / category labels printed below logos?
> - [ ] **Bento Background Diversity**: at least 2-3 bento cells have real visual variation (image, gradient, pattern), not all white-on-white text cards?
> - [ ] **"Used by / Trusted by" logo wall** lives UNDER the hero, not inside it, uses REAL SVG logos (Simple Icons / devicon) or generated SVG marks, NOT plain text wordmarks?
> - [ ] **Copy Self-Audit**: every visible string re-read, no grammatically-broken or AI-hallucinated phrases ("free on its past" type) shipped?
> - [ ] **Motion motivated**: every animation can be justified in one sentence (hierarchy / storytelling / feedback / state transition), no GSAP-for-show?
> - [ ] **Marquee max-one-per-page**: no two horizontal marquees on the same page?
> - [ ] **Navigation on ONE line** at desktop, height ≤ 80px?
> - [ ] **Section-Layout-Repetition** check: no two sections share the same layout family (at least 4 different families across 8 sections)?
> - [ ] **Bento has rhythm AND exact cell count** (N items → N cells, no empty cells in middle or at end)?
> - [ ] **Long lists use the right UI component** (not default `<ul>` with `divide-y` for > 5 items - see Section 4.9 alternatives)?
> - [ ] **Real images used** (gen-tool first, then Picsum-seed, then explicit placeholder slots) - NO div-based fake screenshots, NO hand-rolled decorative SVGs, NO pure-text minimalism?
> - [ ] **No pills/labels overlaid on images** (no `Plate · Brand`, no `Field notes - journal`)?
> - [ ] **No photo-credit captions as decoration** (`Field study no. 12 · Ines Caetano`)?
> - [ ] **No version footers** (`v1.4.2`, `Build 0048`) on marketing pages?
> - [ ] **No micro-meta-sentences** under eyebrows ("Each of these is a feature we ship today...")?
> - [ ] **No decoration text strip at hero bottom** (`BRAND. MOTION. SPATIAL.`)?
> - [ ] **No floating top-right sub-text** in section headings?
> - [ ] **No scoring/progress bars with filled background tracks** as comparison visuals?
> - [ ] **No locale / city-name / time / weather strips** unless brief is genuinely globally-distributed or place-focused?
> - [ ] **No scroll cues** (`Scroll`, `↓ scroll`, `Scroll to explore`)?
> - [ ] **No version labels in hero** (V0.6, BETA, INVITE-ONLY) unless the brief is a launch?
> - [ ] **No section-numbering eyebrows** (`00 / INDEX`, `001 · Capabilities`, `06 · how it works`)?
> - [ ] **No decorative dots** (zero by default, only for real semantic state)?
> - [ ] **No `border-t` + `border-b` on every row** of long lists / spec tables?
> - [ ] **Content density** sane: no 20-row data tables, no fake-precise specs without justification, ≤ 25-word sub-paragraphs by default?
> - [ ] **Quotes ≤ 3 lines** of body, attribution clean (no em-dash)?
> - [ ] **Motion claimed = motion shown**: if `MOTION_INTENSITY > 4`, page actually animates, not just claimed?
> - [ ] **GSAP sticky-stack / horizontal-pan** implemented per Section 5.A / 5.B canonical skeleton (`start: "top top"`, `pin: true`, correct scrub)?
> - [ ] **No `window.addEventListener('scroll')`** - using Motion `useScroll()` / ScrollTrigger / IntersectionObserver / CSS scroll-driven animations only?
> - [ ] **Reduced motion** wrapped for everything `MOTION_INTENSITY > 3`?
> - [ ] **Dark mode** tokens defined and tested in both modes?
> - [ ] **Mobile collapse** explicit (`w-full`, `px-4`, `max-w-7xl mx-auto`) for high-variance layouts?
> - [ ] **Viewport stability**: `min-h-[100dvh]`, never `h-screen`?
> - [ ] **`useEffect` animations** have strict cleanup functions?
> - [ ] **Empty / loading / error** states provided?
> - [ ] **Cards omitted** in favor of spacing where possible?
> - [ ] **Icons** from an allowed library only (Phosphor / HugeIcons / Radix / Tabler), no hand-rolled SVG paths?
> - [ ] **Motion** isolated in client-leaf components with `'use client'` at the top, memoized?
> - [ ] **No AI Tells** from Section 9 (Inter as default, AI-purple, three-equal cards, Jane Doe, Acme, "Quietly in use at")?
> - [ ] **Core Web Vitals** plausibly hit (LCP < 2.5s, INP < 200ms, CLS < 0.1)?
> - [ ] **One design system** per project (no Material + shadcn mixed)?
>
> If a single checkbox cannot be honestly ticked, the page is not done. Fix it before delivering.

**Klarow:** OBOWIĄZUJE jako część `checklists/preflight.md` (scalona z high-end, imagegen i pozycjami Klarow-specific).
Pozycje NIE DOTYCZĄ / ZAKAZANE u nas: GSAP sticky-stack / horizontal-pan (zakaz produktowy), serif discipline (zero serif),
premium-consumer palette, logo wall (dopiero po zgodach; nigdy w hero), Picsum-seed (zakaz w `dist`), Motion `'use client'`
(Vite). Pozycje ZAOSTRZONE: em-dash także w `data/*.ts`, `llms.txt` i PDF; eyebrow na home = 0; marquee = 0;
dark mode = lock zamiast dual.

Koniec pliku. Zmiana wersji pakietu taste-skill = ponowne wygenerowanie cytatów i aktualizacja nagłówka (commit, data).

