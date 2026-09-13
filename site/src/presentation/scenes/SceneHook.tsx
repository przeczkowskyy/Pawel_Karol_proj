import { pick, useLang } from "@/i18n";
import { scene } from "@/data/presentation";
import { SceneStep } from "./SceneStep";
import type { SceneContentProps } from "./types";

/* Scena 1: HAK.
   Jedno zdanie i nic więcej. Żadnego podtytułu, żadnej ikony, żadnego przycisku:
   pierwszy ekran ma ustawić temat, a nie sprzedać. Zdanie mówi o widzu, nie o nas,
   bo nikt nie kwestionuje, że działa na plikach, więc nie ma czego dowodzić.

   NAGŁÓWEK STRONY. To jedyna scena, która renderuje `h1`. Jeżeli silnik albo shell
   prerendera dokłada własny `h1`, ZDEJMIJ jeden z nich: dwa `h1` na stronie to
   sygnał dla wyszukiwarki, że strona nie wie, o czym jest. */
const DATA = scene("hook");

export function SceneHook({ progress }: SceneContentProps) {
  const { lang } = useLang();
  return (
    <div className="pres-scene">
      <SceneStep progress={progress}>
        <h1 className="pres-headline">{pick(lang, DATA.headline)}</h1>
      </SceneStep>
    </div>
  );
}

export default SceneHook;
