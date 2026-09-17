import { pick, useLang } from "@/i18n";
import { HOME_BEATS, HOME_CLOSING } from "@/data/homeSections";
import { MESSAGING } from "@/data/messaging";
import { HeroV3 } from "@/components/home/HeroV3";
import { Beat } from "@/components/home/Beat";
import { Examples } from "@/components/home/Examples";
import "@/styles/home.css";

/* ── Strona główna v3 ───────────────────────────────────────────────────────
   Jedna rzecz do udowodnienia, dwa uderzenia, kilka nazw, jedno zamknięcie.

   OŚ (Karol 2026-09-17: „scrolując próbujmy coś udowodnić"):
   audyt pokazuje CZERWONY werdykt na danych z zasianymi błędami, uzgodnienie
   pokazuje ZIELONE PASS z równaniem zgadzającym się co do grosza. Dowodzi tego
   narzędzie, nie zdanie obok.

   DWA RÓŻNE NARZĘDZIA I TAK SĄ PODPISANE. Napisanie „te same dane przed i po"
   byłoby mocniejsze dramaturgicznie i nieprawdziwe, a `brand-honest-labels`
   nie pozwala kupować dramaturgii kłamstwem.

   TEKSTU JEST OKOŁO 120 SŁÓW, było 1272. Długi ogon przeniesiony na podstrony,
   które już go mają (`toolsSeo.ts`, `/oferta`, `/faq`). Shell prerendera
   wypisuje dokładnie te same zdania — inaczej byłby to cloaking.

   Ten plik jest wyłącznie montażem: copy w `data/homeSections.ts`, mechanika
   montażu w `motion/DashboardMount`, wygląd w `styles/home.css`. */

export default function HomeV3({ onBook }: { onBook: () => void }) {
  const { lang } = useLang();
  const [audyt, uzgodnienie] = HOME_BEATS;

  return (
    <>
      <HeroV3 onBook={onBook} />

      {/* CZERWONE: audyt jakości startuje na zestawie z czterema zasianymi
          błędami (ujemna estymata, saldo kontrolne, data poza tygodniem),
          więc werdykt „nie publikuj" widać bez jednego kliknięcia. */}
      <Beat beat={audyt} dashboard="quality" />

      {/* ZIELONE: uzgodnienie kończy się banerem PASS i równaniem rozpisanym
          na prawdziwych kwotach. To jedyny ekran na stronie, który mówi
          „sprawdź nas". */}
      <Beat beat={uzgodnienie} dashboard="reconciliation" />

      <Examples />

      <section className="hm-closing" aria-labelledby="closing-title">
        <h2 id="closing-title" className="hm-closing-title">
          {pick(lang, HOME_CLOSING.headline)}
        </h2>
        <p className="hm-closing-line">{pick(lang, HOME_CLOSING.line)}</p>
        <button type="button" className="btn btn-primary" onClick={onBook}>
          {pick(lang, MESSAGING.cta.primary)}
        </button>
      </section>
    </>
  );
}
