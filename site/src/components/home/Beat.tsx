import { pick, useLang } from "@/i18n";
import type { HomeBeat } from "@/data/homeSections";
import type { DashboardKey } from "@/data/tools";
import { DashboardMount } from "@/motion/DashboardMount";

/* ── Beat ───────────────────────────────────────────────────────────────────
   Jedno uderzenie dowodu: nagłówek, jedno zdanie, działające narzędzie.

   TRZY ELEMENTY, KONIEC. Poprzednia wersja tej sekcji miała jeszcze akapit
   60–140 słów i listę rzeczy sprawdzalnych. Karol: „Tekstu jest o tonę za
   dużo". Akapit opisywał to, co narzędzie pod spodem i tak pokazuje, więc
   czytelnik dostawał tę samą informację dwa razy, raz słowami i raz dowodem.

   ŚWIATŁO JEST TU TREŚCIĄ, NIE ODSTĘPEM. Research o odbiorze „premium" jest
   zgodny: whitespace czyta się jako pewność siebie, bo marka, która nie musi
   zapełnić każdego piksela, wygląda na taką, która ma czym płacić za miejsce.
   Stąd odstępy liczone w `clamp()` od 4 do 9 rem, a nie od 2,5 do 4,5. */

type BeatProps = {
  beat: HomeBeat;
  dashboard: DashboardKey;
};

export function Beat({ beat, dashboard }: BeatProps) {
  const { lang } = useLang();

  return (
    <section id={beat.id} className="hm-beat" aria-labelledby={`${beat.id}-title`}>
      <div className="hm-beat-head">
        <h2 id={`${beat.id}-title`} className="hm-beat-title">
          {pick(lang, beat.headline)}
        </h2>
        <p className="hm-beat-line">{pick(lang, beat.line)}</p>
      </div>

      {/* `autoStart` JEST WARUNKIEM TEJ SEKCJI, nie wygodą. Bez niego oba
          narzędzia pokazują pusty stan czekający na kliknięcie, więc ktoś, kto
          tylko przewija, widzi dwa puste prostokąty w miejscu dowodu — a cała
          strona ma dowodzić właśnie przewijaniem. Z nim audyt wchodzi od razu
          z czerwonym werdyktem, a uzgodnienie z zielonym PASS.

          Rama: jedna linia i nic więcej. Narzędzie montuje się dopiero, gdy
          zbliża się do ekranu, i rezerwuje wysokość, więc nic nie skacze. */}
      <div className="hm-beat-frame">
        <DashboardMount dashboard={dashboard} autoStart />
      </div>
    </section>
  );
}

export default Beat;
