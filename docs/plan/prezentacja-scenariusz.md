# Prezentacja klarow.com — scenariusz v2 i pakiet promptów Higgsfield

> **Wersja 2 z 2026-09-13. Zastępuje v1 w całości.** v1 opowiadała o błędach w Excelu
> i kończyła się ścianą zrzutów z narzędzi. Founder odrzucił jedno i drugie:
> „Zły writing. Nie skupiamy się na błędach w excelu" oraz „Nie musimy przedstawiać
> już narzędzi które zrobiłem. Możemy o tym zapomnieć".
>
> Ten plik jest wiążący dla `site/src/data/presentation.ts`, komponentów scen
> i dla każdego zakupu kredytów w Higgsfield.

---

## 1. Skąd wziął się ten kierunek

Founder podał dwie referencje. Zbadane naprawdę, nie z opisu.

**Referencja treści: `automatyzacje.ai`** — wyrenderowana przeglądarką (zwykły `fetch`
zwraca pustą skorupę, bo to SPA). Ustalenia:

| Co | Jak jest u nich |
|---|---|
| Format | JEDNA długa strona, siedem numerowanych sekcji `01 / Kontekst` … `07 / Kontakt` |
| Objętość | ok. 1 900 słów. Nasza obecna prezentacja ma **65** |
| Nagłówki | dwa fragmenty zdania: „Firma rośnie. Procesy — niekoniecznie.", „Pięć etapów. Zero niespodzianek." |
| Tło | kremowy papier, nie czerń |
| Typografia | wysokokontrastowa szeryfowa antykwa, drugi fragment kursywą w akcencie |
| Akcent | JEDEN, ciepła terakota |
| Wideo | **zero.** Ani jednego pliku wideo, ani jednej animacji |
| Podstrony | brak. Blog, FAQ, case studies — brak |

Wniosek, który trzeba powiedzieć wprost: **„wysoko w SEO" u nich nie bierze się
z techniki, tylko z gęstości tekstu.** Jedna strona, 1 900 słów, wszystko w DOM.
My mamy lepszy prerender niż oni i 30× mniej treści. To jest cała różnica.

**Referencja ruchu: film „Claude + Higgsfield: How to Make Motion Graphics with AI"** —
sam film nie oddaje treści przez `fetch`, ale prowadzi do stylu, który platforma ma
skatalogowany pod nazwą **„Editorial Motion Graphics"**. Pobrałem jego oficjalny
podgląd i obejrzałem klatka po klatce.

**I tu jest rzecz najważniejsza w całym researchu: obie referencje to ten sam język
wizualny.** Kremowy papier z widocznym włóknem, szare wycinanki halftone jak ze
sztychu, JEDEN mocny akcent, ręcznie rysowane klamry i kółka, drobne etykiety.
Founder podał stronę i styl animacji niezależnie od siebie i trafił dwa razy w to samo.
To nie jest kompromis między dwiema referencjami — to jeden kierunek.

---

## 2. Co z tego wynika dla strony

| Decyzja | v1 (odrzucone) | v2 |
|---|---|---|
| Tło strony | czerń | **kremowy papier** |
| Akcent | stal `#A8B4C2` | **jeden kolor, propozycja: petrol blue** |
| Treść | 65 słów na osiem ekranów | **nagłówek na wideo + realny akapit pod nim**, cel 1 200–1 800 słów |
| Problem | błędy w arkuszach | **firma urosła, proces został ten sam** |
| Dowód | ściana 13 zrzutów | **rodzaje pracy, które umiemy przejąć** — bez zrzutów |
| Tło sceny | gradient zastępczy | **wideo pełnoekranowe pod każdą sceną** |

**Dwie decyzje należą do foundera, nie do mnie — wypisane w §6.** Kremowe tło łamie
`design-dark-only`, a kolorowy akcent łamie `brand-single-accent-steel`. Obie reguły
zapisują JEGO wcześniejsze decyzje, więc tylko on może je zdjąć.

---

## 3. Scenariusz — osiem scen

Zasada narracji: **problem zostaje, ale ani razu nie pada słowo „Excel"**.
Bohaterem nie jest plik, tylko **przekazywanie pracy między ludźmi**. To ta sama
prawda, tylko powiedziana bez pogardy dla narzędzia, którego klient używa.

Każda scena ma teraz DWIE warstwy:
- **nagłówek** — dwa fragmenty, ≤ 9 słów, leży na wideo;
- **akapit** — 60–120 słów, konkret, leży pod nagłówkiem i **wchodzi do prerenderu**.
  To jest ta warstwa, której nie było, i to ona robi SEO.

| # | id | Nagłówek PL | Rola |
|---|---|---|---|
| 1 | `hook` | Firma urosła. Proces został ten sam. | ustawia temat, zero oskarżeń |
| 2 | `handover` | Praca nie stoi u ludzi. Stoi między nimi. | prawdziwy problem: przekazania |
| 3 | `time` | Zamknięcie miesiąca. Liczone w tygodniach. | koszt czasu |
| 4 | `cost` | Ten etat ma kupować analizę. | koszt pieniędzy, liczba ze źródłem |
| 5 | `turn` | Zamiast opisać proces, budujemy go na nowo. | pierwszy raz o nas — dopiero w scenie 5 |
| 6 | `craft` | Różne działy. Ten sam sposób pracy. | przykłady co potrafimy, BEZ zrzutów |
| 7 | `outcome` | Co się zmienia. | efekt u klienta |
| 8 | `contact` | Pokaż nam proces, który boli. | zamknięcie |

Zmiany względem v1: scena 2 `scale` (88 % arkuszy z błędem) **wypada** — to była
narracja o Excelu. Scena 6 `proof` (ściana zrzutów) **wypada**. W ich miejsce
wchodzą `handover` i `craft`.

Liczba 121 000 zł w scenie 4 **zostaje**: ma źródło (Sedlak & Sedlak 2026 + ZUS 2026),
pokazuje działanie `8 350 × 12 × 1,2048` i nie mówi nic o Excelu. Ton bez zmian:
nigdy nie sugerujemy odjęcia etatu, tylko na co ma iść jego czas.

---

## 4. Pakiet promptów Higgsfield

Rzemiosło poniżej nie jest zgadywane — pochodzi z warsztatu produkcyjnego wbudowanego
w silnik (`faceless-video`, `references/style-editorial-collage.md`).

### 4.1 Cztery zasady, które trzymają osiem scen w jednym filmie

1. **Najpierw KLUCZ STYLU, potem sceny.** Generujemy JEDEN obraz-klucz i każda scena
   odwołuje się do niego jako `image_references`. Bez tego osiem scen to osiem różnych
   filmów. To jest jedyny powód, dla którego całość wygląda spójnie.
2. **Klucz stylu nigdy nie powstaje z samego tekstu.** Zawsze z obrazem-dawcą.
   Kanoniczny dawca tego stylu:
   `https://cdn.higgsfield.ai/youtube_faceless_preset_image/306ee0a1-58e7-43c8-9cee-0493702e5e6b.webp`
   Bierzemy z niego sposób renderowania i paletę, **nigdy** jego tematu.
3. **`aspect_ratio` podajemy jawnie przy każdym wywołaniu** — nie dziedziczy się z klucza.
4. **Zero tekstu w kadrze.** Styl tego zakazuje, a nam to rozwiązuje osobny problem:
   **film bez słów obsługuje i PL, i EN.** Jeden komplet materiału zamiast dwóch.

### 4.2 Jedno świadome odstępstwo od warsztatu

Warsztat każe budować blok jako **pięć twardych cięć po 2 s**. U nas to byłby błąd.
Nasze klipy nie lecą na osi czasu — są **przewijane scrollem**: to widz steruje
czasem. Twarde cięcie pod palcem czyta się jak zacięcie obrazu, nie jak montaż.

Dlatego nasze klipy są **ciągłe, bez cięć**, z trzema etapowanymi beatami i jednym
ruchem kamery. Wolne, bo widz może zatrzymać się w dowolnej klatce.

### 4.3 Parametry

| Parametr | Wartość | Dlaczego |
|---|---|---|
| Model klucza stylu | `seedream_v5_pro`, `resolution: "1k"` | zablokowany w warsztacie |
| Model klipów | `minimax_h3`, `resolution: "2K"` | zablokowany w warsztacie |
| Długość | 10 s | jedna scena = jeden klip |
| `aspect_ratio` | `16:9` | jawnie, przy każdym wywołaniu |
| Dźwięk | nieużywany | wideo leży pod treścią i jest wyciszone |
| AKCENT | **jeden na cały film** | mieszanie akcentów między scenami zabija spójność |

**Akcent — rekomendacja: `petrol blue`.** Styl dopuszcza: burnt orange, coral red,
mustard gold, petrol blue, deep crimson, forest green. Stalowy `#A8B4C2` **nie wejdzie
w ogóle** — jest szary, a w tym stylu cała reszta kadru też jest szara, więc akcent
by zniknął. Petrol blue jest najbliżej chłodnego, nie-hurraoptymistycznego charakteru
Klarow i nie wygląda jak terakota konkurencji.

### 4.4 FORMUŁA STYLU — wklejać bajt w bajt, wszędzie

> flat editorial documentary collage on a warm cream paper stage with subtle
> fiber grain: monochrome halftone archival photo cutouts with rough white
> keylines and a slightly offset petrol blue stroke behind each cutout, one
> single petrol blue accent color per video — a large flat petrol blue disc behind
> the main subject and exactly one color-popped hero element among the
> monochrome — torn paper edges and tape strips, soft paper drop shadows,
> hand-drawn petrol blue marker circles, arrows and underline strokes (abstract
> strokes only, never letters), abstract unlabeled data shapes and flat
> stylized maps, subtle print misregistration on inked elements, snappy
> staggered spring motion with slight overshoot, non-photorealistic
> illustrated collage, never live-action.

**PALETTE LOCK** (dopisywana do każdego promptu):

> warm cream paper base, monochrome halftone cutouts, ONE petrol blue accent
> (disc, strokes, one popped element) — no other colors, no gradients, no
> full-color scenes.

**NEGATIVE** (dopisywany do każdego promptu):

> readable text, letters, words, numbers, live-action footage, photographic
> realism, full-color scene, foreign accent colors, 3D render, hard cuts,
> scene changes, camera orbit.

`hard cuts, scene changes` w negatywie to nasz dopisek — konsekwencja §4.2.

### 4.5 Osiem promptów scen

Każdy do `minimax_h3`, `duration: 10`, `resolution: "2K"`, `aspect_ratio: "16:9"`,
`medias` = klucz stylu jako `image_references`. Do każdego doklejamy FORMUŁĘ STYLU,
PALETTE LOCK i NEGATIVE.

---

**S1 · `hook` — firma urosła, proces został ten sam**

> STAGE: a warm cream paper field with a faint graph-grid impression, locked for the
> whole shot. CHOREOGRAPHY, one continuous take, three staggered beats: (1) a single
> monochrome halftone cutout of a small workshop building stamps down slightly
> left of centre, with a thin hand-drawn petrol blue underline stroke drawing itself
> beneath it; (2) two identical building cutouts drop in beside it with a bounce,
> then four more, then a full row, each landing staggered with slight overshoot,
> the row extending to both edges of the frame; (3) the petrol blue underline
> beneath them does NOT extend — it stays exactly as long as it was under the first
> building, and a small petrol blue bracket snaps in at its end to mark where it
> stops. CAMERA: one very slow push-in, nothing else. SETTLE: the final frame rests
> on the long row above the short stroke, elements still micro-drifting.

---

**S2 · `handover` — praca stoi między ludźmi**

> STAGE: a locked cream paper plate with a soft newsprint strip running horizontally
> through the middle. CHOREOGRAPHY, one continuous take: (1) five monochrome halftone
> cutout desks stand in a row along the strip, each with a small white-bordered paper
> card resting on it; (2) an oversized monochrome photographic hand enters from the
> left and slides the first card to the second desk, then withdraws; a second hand
> enters and moves it on, then withdraws — the handoffs staggered, never overlapping;
> (3) between every pair of desks a petrol blue bracket draws itself in the empty gap
> and stays, so the row ends up with four blue brackets marking the spaces between
> the desks rather than the desks themselves. CAMERA: one slow lateral drift to the
> right. SETTLE: the card sits on the last desk, the four brackets hold.

---

**S3 · `time` — zamknięcie miesiąca liczone w tygodniach**

> STAGE: a locked cream paper plate with a thin horizontal baseline ribbon carrying
> evenly spaced tick marks, no numerals. CHOREOGRAPHY, one continuous take: (1) a
> petrol blue marker settles onto the ribbon at the left and begins sliding right,
> tick by tick; (2) above the ribbon a column of monochrome halftone dots stacks
> upward in staggered groups, each group landing with a small bounce as the marker
> passes a tick; (3) the marker slides well past a hand-drawn petrol blue bracket
> that had marked an earlier point on the ribbon, and keeps going toward the right
> edge while the dot column keeps growing. CAMERA: static, locked off. SETTLE: the
> marker rests near the right edge, the dot column stands tall, both micro-moving.

---

**S4 · `cost` — ten etat ma kupować analizę**

> STAGE: a locked cream paper plate with a large flat petrol blue disc centred
> behind the subject. CHOREOGRAPHY, one continuous take: (1) a single monochrome
> halftone cutout of a seated office figure at a desk snaps into place in front of
> the disc, deadpan and still; (2) white-bordered paper cards drop onto the desk one
> after another in a staggered rhythm, each landing with a soft bounce, building into
> a tall leaning stack that rises past the figure's shoulder; (3) one single card near
> the bottom of the stack flips over and is rendered fully in petrol blue — the one
> colour-popped element in the frame — and a hand-drawn petrol blue marker circle
> draws itself around it, isolating it under the weight of all the monochrome cards
> above. CAMERA: one slow push-in toward the circled blue card. SETTLE: the stack
> holds, the circle holds.

---

**S5 · `turn` — zamiast opisać proces, budujemy go na nowo**

> STAGE: the same cream paper plate, carrying a scattered leaning pile of monochrome
> halftone paper cards. CHOREOGRAPHY, one continuous take, this is the pivot of the
> film and needs the hardest impact beat: (1) an oversized monochrome photographic
> hand sweeps in from the right and pushes the entire scattered pile off the left
> edge of the frame in one motion, leaving the cream stage briefly empty; (2) a clean
> geometric petrol blue frame — a simple open rectangle drawn in a single confident
> stroke — snaps into place at centre with a slight overshoot and stamps down; (3)
> the same cutouts return from off-frame one by one, staggered with spring
> entrances, and land in precise aligned positions INSIDE the blue frame, each
> arrival a small impact. CAMERA: static, locked off — the stage's calm carries the
> beat. SETTLE: the arrangement rests square inside the frame, still micro-moving.

---

**S6 · `craft` — różne działy, ten sam sposób pracy**

> STAGE: a locked cream paper plate, empty at the start, with a faint graph-grid
> impression. CHOREOGRAPHY, one continuous take: (1) an oversized monochrome
> photographic hand plants a white-bordered photo card onto the stage and presses a
> tape strip across its corner, then withdraws; the card carries an abstract
> unlabeled device — a dot-matrix semicircle gauge; (2) five more cards are planted
> in a loose grid in staggered succession, each taped down, each carrying a different
> abstract unlabeled device: a stack of halftone dot bars, a flat stylized route map
> with a pulsing pin, an arrow set, a pair of separating pie slices, a thin drawn
> line rising across a grid — no axis text, no numerals anywhere; (3) a single
> hand-drawn petrol blue stroke draws itself through all six cards in one continuous
> pass, linking them into one line. CAMERA: one slow pull-back that reveals all six
> cards in frame. SETTLE: the six cards hold, the blue stroke holds.

---

**S7 · `outcome` — co się zmienia**

> STAGE: a locked cream paper plate divided by nothing — one continuous field.
> CHOREOGRAPHY, one continuous take: (1) on the left half, a dense tangle of
> overlapping hand-drawn petrol blue strokes draws itself rapidly, crossing and
> doubling back on itself into a knot; (2) the tangle untwists in one smooth
> staggered motion, the strokes pulling apart and straightening; (3) they land as
> three clean parallel petrol blue lines running left to right across the frame,
> each snapping into alignment with slight overshoot, while a dot-matrix semicircle
> gauge at the right fills dot by dot in staggered steps. CAMERA: one gentle drift.
> SETTLE: three straight lines and the filled gauge, micro-moving.

---

**S8 · `contact` — pokaż nam proces, który boli**

> STAGE: a cream paper plate, nearly empty, with a large flat petrol blue disc low
> behind centre. CHOREOGRAPHY, one continuous take: (1) the stage is bare except for
> the disc; (2) an oversized monochrome photographic hand enters from below and
> plants one single white-bordered paper card at centre in front of the disc, presses
> a tape strip across its corner and withdraws; the card is blank, textured paper,
> no writing; (3) a hand-drawn petrol blue marker circle draws itself around the card
> in one confident pass. CAMERA: one very slow push-in. SETTLE: the card and the
> circle hold at centre, micro-moving.

---

### 4.6 Kolejność produkcji

1. `media_import_url` na obrazie-dawcy → `media_id`.
2. `resolve_explainer_preset` na `56fc6472-33b7-45dc-83ff-80c71d40aec6` → drugi `media_id`.
3. **Klucz stylu**: `generate_image` / `seedream_v5_pro`, `resolution: "1k"`,
   oba `media_id` jako `image_references`, prompt = FORMUŁA STYLU + PALETTE LOCK.
   **Obejrzeć przed pójściem dalej.** Zły klucz = osiem złych scen.
4. **Osiem klipów**: `generate_video_batch` / `minimax_h3`, jedna pozycja na scenę,
   klucz stylu w `medias`. Warsztat ostrzega, że **pierwszy klip dryfuje najczęściej**,
   bo ma najmniej kontekstu — S1 porównać z kluczem, zanim przyjmiemy resztę.
5. Pobrać, przyciąć do pętli, zakodować WebM + MP4, wrzucić do `site/public/video/`.

### 4.7 Ile to kosztuje

**Nie wiem i nie mogę się dowiedzieć na obecnym planie.** Konto ma 0 kredytów i plan
`free`, a na nim katalog modeli wideo **w ogóle się nie wyświetla** — zapytanie o modele
zwraca jedną pozycję do cięcia klipów z YouTube, żadnego `minimax_h3`. Czyli nie da się
odczytać ani ceny, ani parametrów, dopóki nie ma płatnego planu.

Co z tego wynika praktycznie: **bez PLUS-a nie zobaczymy nawet cennika**, więc szacunek
„≈200 kredytów" z poprzedniej sesji trzeba traktować jako niepotwierdzony. Osiem klipów
10 s w 2K plus klucz stylu plus poprawki — realnie trzeba założyć jeden miesiąc PLUS
i przyjąć, że część klipów pójdzie do powtórki (styl potrafi zejść, warsztat wprost
każe planować retry).

**Zakup robi founder, nie agent** — karta, auto-odnowienie 49 $.

---

## 5. Co się zmienia w kodzie

| Plik | Zmiana |
|---|---|
| `src/data/presentation.ts` | nowe osiem scen; `scale` i `proof` wypadają, wchodzą `handover` i `craft`; każda scena dostaje pole `body` (akapit do SEO) |
| `src/presentation/scenes/` | `SceneScale`/`SceneProof` wypadają, wchodzą `SceneHandover`/`SceneCraft` |
| `src/styles/tokens.css` | paleta kremowa zamiast czarnej — **po decyzji D-36** |
| `src/presentation/sceneMedia.ts` | osiem wpisów `video` zamiast `fallback`, gdy materiał będzie |
| `src/prerender/entry.tsx` | akapity scen muszą wejść do statycznego HTML — inaczej cała praca nad SEO jest na nic |

---

## 6. Decyzje dla foundera

**D-36 — kremowe tło zamiast czarnego.** Obie referencje są jasne. Reguła
`design-dark-only` zapisuje wcześniejszą decyzję foundera i tylko on może ją zdjąć.
*Rekomendacja: zdjąć.* Ciemna strona z ciemnymi materiałami jest powodem, dla którego
cztery podejścia z rzędu wyglądały płasko.

**D-37 — kolorowy akcent zamiast stalowego.** W tym stylu szary akcent nie istnieje.
*Rekomendacja: petrol blue, jeden na całą witrynę.*

**D-38 — zakup Higgsfield PLUS na jeden miesiąc.** Bez tego nie ma ani materiału,
ani nawet cennika. *Rekomendacja: kupić, wykorzystać w jednym oknie, nie odnawiać.*

**D-39 — co z 13 podstronami narzędzi.** Żyją, są w mapie strony i łapią ruch, ale
zniknęły z nawigacji, a prezentacja już ich nie pokazuje. *Rekomendacja: zostawić
pod SEO, nie linkować z prezentacji.*
