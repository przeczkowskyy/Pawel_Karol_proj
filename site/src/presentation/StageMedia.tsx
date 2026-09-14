import { pick, useLang } from "@/i18n";
import { SCENES, type SceneId } from "@/data/presentation";
import { sceneMedia } from "./sceneMedia";

/* ── StageMedia ─────────────────────────────────────────────────────────────
   Kolumna medialna ramy dzielonej: JEDYNE miejsce w prezentacji, w którym
   stoi obraz. Przykleja się do okna i zmienia zawartość wraz z tym, która
   scena zakryła środek ekranu.

   DLACZEGO OSOBNA KOLUMNA, A NIE TŁO POD TEKSTEM (decyzja 2026-09-14):
   zmierzyliśmy kontrast ciemnego tekstu na gęstej ilustracji — bezpieczna była
   wyłącznie dolna ćwiartka kadru, a od 55 % w górę od 2,5 do 8 % pikseli
   spadało poniżej progu czytelności. Tekst leżący na kadrze czynił zgodność
   z WCAG własnością WYGENEROWANEGO MATERIAŁU, a nie własnością kodu: każda
   regeneracja mogła ją zepsuć. Tutaj tekst leży na nieprzezroczystym papierze
   (15,46:1) i żadna klatka tego nie ruszy.

   Drugi zysk, mniej widoczny: osiem scen przyklejonych łamało regułę
   `motion-no-pinning-no-scroll-hijack` §B p.1 (najwyżej DWIE sceny sticky na
   trasę). Teraz przyklejona jest JEDNA rzecz na całej stronie — ta kolumna.

   DZIŚ GRA KADRAMI, NIE FILMEM. Materiał z Higgsfielda powstaje jako
   nieruchome kadry otwarcia (3 kredyty za sztukę wobec 17,5 za klip), więc
   founder zatwierdza kompozycję, zanim cokolwiek zostanie zanimowane. Gdy film
   powstanie, wchodzi DOKŁADNIE w to miejsce: `<video>` zamiast `<img>`, ta sama
   kolumna, ten sam `object-fit`. Nic poza tym plikiem się nie zmienia.

   WSZYSTKIE KADRY SĄ W DOM OD RAZU i przełączają się samą nieprzezroczystością.
   Powód jest wydajnościowy, nie stylistyczny: podmiana `src` przy każdej zmianie
   sceny kazałaby przeglądarce dekodować obraz w trakcie przewijania, co widać
   jako przycięcie. Osiem obrazów po ~45 KB mieści się w budżecie transferu,
   a `loading="lazy"` poza pierwszym trzyma start strony lekki. */

/** Kadr sceny; brak pliku = scena gra samym tłem zastępczym. */
function sceneStill(id: SceneId): string | undefined {
  return sceneMedia(id).still;
}

export function StageMedia({ activeId }: { activeId: SceneId | null }) {
  const { lang } = useLang();
  const active = activeId ?? SCENES[0].id;

  return (
    <div className="pr-media-col">
      <div className="pr-media-frame">
        {SCENES.map((s, i) => {
          const src = sceneStill(s.id);
          if (!src) return null;
          return (
            <img
              key={s.id}
              className="pr-media-shot"
              data-active={s.id === active ? "true" : "false"}
              src={src}
              /* Opis idzie z copy sceny, więc rośnie razem z narracją i nigdy
                 nie rozjedzie się z tym, co widać. Kadr NIE jest dekoracją:
                 niesie ten sam komunikat co nagłówek, tylko obrazem. */
              alt={pick(lang, s.headline)}
              width={1024}
              height={1024}
              decoding="async"
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : "auto"}
            />
          );
        })}
        {/* Wygaszenie przy szwie: kadr ma wyglądać na wydrukowany na tym samym
            arkuszu co tekst, a nie wklejony. Cień jest zakazany (Shape Lock). */}
        <div className="pr-media-seam" aria-hidden="true" />
      </div>
    </div>
  );
}

export default StageMedia;
