# Hero, runda 1: trzy kierunki (still)

## Ustawienia rundy kierunków
- **Model:** Nano Banana Pro.
- **Kadr:** proporcje **9:16** ustawione ręcznie, rozdzielczość **2K**, **4 warianty** na kierunek, bez referencji.
- **Prompt:** tekst kierunku, pusta linia, cały blok STYLE.
- **Zwycięzca:** ta sama generacja jeszcze raz w **4K**, do `_mastery/`. Potem krok A w `03-pipeline-ffmpeg.md`.

---

## Blok STYLE (na końcu KAŻDEGO promptu obrazu)
```
STYLE: Flat 2.5D cartoon illustration, front-on orthographic view, no perspective, no vanishing points.
Chunky rounded shapes with bold near-black outlines (#05070A) of one constant width, flat fills, one soft drop shadow per object.
Every cable and every housing has one thin pale highlight line (#F2EDE3, low opacity) along its upper edge, so each silhouette separates from the dark background.
Slightly exaggerated proportions: thick patch cables of constant thickness, oversized plugs and jacks, rounded junction boxes with small LEDs, screws and cable ties.
No hairline details: even the thinnest fiber is drawn with a clearly visible bold stroke.
Shared module housing: a rounded dark graphite box (#1F262E) with a warm paper front panel (#F2EDE3), four corner screws, one round port on its left side and one small LED top-right; only the simple pictogram on the front panel differs. Paper anywhere shows thick grey bars instead of writing.
Background: solid flat deep graphite #0D1014, no vignette, no gradient, no texture.
Palette only: graphite cables #3A4450, paper #F2EDE3, amber glow #FFB938, sea-green light packets #39D0C0, coral accents #FF6A4D, lavender neural fibers #9B8CFF.
Light comes only from glowing packets and LEDs, as a soft flat halo.
Modular-synth patch bay meets metro-map clarity: dense but orderly routing with 45- and 90-degree bends.
NEVER include any text, letters, numbers, digits, labels, captions, logos, watermarks, color swatches or hex codes anywhere in the image.
No people, faces, hands, robots or brains. No photorealism, no glossy 3D or clay render, no depth of field, no bokeh, no film grain, no blue neon, no holograms.
```

---

## Kierunek GŁÓWNY: „maszynownia”
```
Vertical 9:16 illustration. One enormous, intricate machine of wiring fills the entire frame from edge to edge, drawn in three depth layers, and it grows brighter, bolder and denser toward the bottom.
Upper 60% of the frame: the machine continues but sinks into deep shadow: only dim lavender fibers and graphite cables drawn barely lighter than the background, an even, low-contrast tangle with no glowing lights, no paper panels and no large shapes.
Lower 40%: full-contrast machinery. Back layer: a lavender neural web of branching fibers and round nodes. Middle layer: at least forty thick graphite cables weaving between ten rounded junction boxes, bundled with cable ties. Front layer: six module housings whose paper panels show simple pictograms: a shelf with three plain boxes; a blank sheet with grey bars sliding into a slot; a speech bubble with three dots; a stack of sheets with grey bars; an empty grid of cells; a gear.
At about 75% height, near the center, the cables fray into a glowing lavender neural knot shaped like dendrites. Small sea-green packets of light sit inside the cables that lead into it.
From the knot, ONE thick main cable of constant width carries a single amber glow downward, turning with 45-degree bends; its last 15% runs perfectly straight and vertical and leaves the bottom edge at 20% of the frame width from the left. The bottom edge stays clear of other objects for a short distance on both sides of this cable.
```

## Kierunek ALT-1: „szafa krosowa w izometrii”
Pierwsze zdanie bloku STYLE zamieniamy na:
`STYLE: Flat 2.5D cartoon illustration in true isometric projection: parallel edges, no vanishing points, no perspective.`
```
Vertical 9:16 illustration in true isometric projection. A huge open patch-bay cabinet fills the entire frame from edge to edge: stacked rows of identical rounded module housings slotted into racks like drawers, hundreds of thick patch cables looping between their front ports in tidy bundles held by cable ties, and a small LED on every module.
Upper 60% of the frame: the upper racks sink into deep shadow, drawn barely lighter than the background, an even, low-contrast pattern with no glowing lights and no paper panels.
Lower 40%: full contrast. In one open bay near the center, at about 75% height, a glowing lavender neural knot of branching dendrite fibers is wired into every row; small sea-green packets of light sit inside the cables that lead into it. Six larger module housings stand in the front row, their paper panels showing simple pictograms: a shelf with three plain boxes; a blank sheet with grey bars sliding into a slot; a speech bubble with three dots; a stack of sheets with grey bars; an empty grid of cells; a gear.
All routes gather into ONE thick main cable of constant width that carries a single amber glow; it drops out of the cabinet, its last 15% runs perfectly vertical, and it leaves the bottom edge at 20% of the frame width from the left. The bottom edge stays clear of other objects near it.
```
**Dodatkowe odrzuty ALT-1:**
- zbieżna perspektywa;
- realistyczna serwerownia;
- numeracja U albo etykiety;
- wygląd rozdzielnicy elektrycznej;
- nieczytelny węzeł AI.

**Ryzyko:** odbiór „firma od okablowania albo IT”.

## Kierunek ALT-2: „neurony i organiczne kable”
W bloku STYLE zdanie o modular-synth zamieniamy na:
`Organic branching network meets patch-bay hardware: dense and flowing, yet every route stays readable.`
```
Vertical 9:16 illustration. A living network fills the entire frame from edge to edge: big cartoon neuron cells with round lavender bodies and long branching dendrites; toward their tips the dendrites turn into thick graphite patch cables that end in oversized plugs seated in the ports of module housings.
Upper 60% of the frame: fine branches sink into deep shadow, drawn barely lighter than the background, an even, low-contrast tangle with no glowing lights and no modules.
Lower 40%: full contrast. Three large neuron bodies interlock around one glowing lavender knot at about 75% height; small sea-green packets of light sit along the dendrites that lead into it. Around the knot, six module housings are plugged into dendrite tips; their paper panels show simple pictograms: a shelf with three plain boxes; a blank sheet with grey bars sliding into a slot; a speech bubble with three dots; a stack of sheets with grey bars; an empty grid of cells; a gear.
Dendrites curve organically; only the cables close to the modules use 45- and 90-degree bends.
From the knot, ONE thick main cable of constant width carries a single amber glow downward; its last 15% runs perfectly straight and vertical and leaves the bottom edge at 20% of the frame width from the left. The bottom edge stays clear of other objects near it.
```
**Dodatkowe odrzuty ALT-2:**
- kształt mózgu;
- wygląd anatomiczny lub medyczny;
- powierzchnie śliskie albo żelowe;
- skojarzenie z żyłami lub krwią;
- bloom przechodzący w neon.

**Ryzyko:** odbiór „biotech”.

---

## Twarde odrzuty stilla
Obraz oglądamy w powiększeniu 200%. Odrzucamy go, jeśli spełnia którykolwiek warunek:
1. Litery, cyfry, glify, kody hex, próbki kolorów. Dotyczy też każdego panelu, pudełka i opaski.
2. W górnych 60% kadru piksel jaśniejszy niż `#2A313A` albo cokolwiek bursztynowego, morskiego lub papierowego.
3. Pień:
   - nie jest pojedynczy,
   - zmienia grubość,
   - nie jest pionowy na ostatnich 15%,
   - wychodzi poza 17–23% szerokości,
   - albo przy dolnej krawędzi w promieniu ±8% szerokości leży inny obiekt.
4. Linie cieńsze niż ok. 2 px po zmniejszeniu do 720×1280.
5. Mózg, robot, twarz albo dłoń.
6. Zbieżna perspektywa.
7. Tło odbiega od `#0D1014` o więcej niż ±2 (sprawdzamy narożniki i środek górnej strefy).
8. Liczba modułów inna niż 6 albo różne obudowy.
9. Połysk, glina, render 3D albo neonowy bloom.
10. Bursztyn poza pniem.

## Wybór kierunku
Zapisujemy w `00-README.md` (dziennik), który kierunek wygrał i dlaczego.
Kryterium: test 3 s na makiecie (koncepcja §10, E1b). Liczy się to, czy nad obrazem nadal czytamy „automatyzacja”, a nie „sieci/IT”.
