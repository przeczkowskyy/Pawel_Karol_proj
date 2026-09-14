import type { ElementType } from "react";

/* ── SceneHeadline ──────────────────────────────────────────────────────────
   Nagłówek sceny z AKCENTEM NA DRUGIM FRAGMENCIE.

   DLACZEGO TAK. Nagłówki tej prezentacji są zbudowane z dwóch zdań-fragmentów
   („Firma urosła. Proces został ten sam."). To rytm wzięty z referencji
   Karola: pierwszy fragment stawia fakt, drugi go wywraca. Kolor na drugim
   fragmencie podkreśla dokładnie ten zwrot, zamiast malować całość.

   DLACZEGO KOLOR WCHODZI DOPIERO TERAZ. Ilustracja jest monochromatyczna —
   granat zszedł z kadru 2026-09-14, bo czytał się jak błąd generacji. Akcent
   marki musi więc żyć w typografii, inaczej na stronie nie ma go wcale.
   To nie jest złamanie zasady jednego akcentu, tylko przeniesienie go
   z obrazu na tekst: nadal jedna barwa, nadal `--accent-text`.

   PODZIAŁ JEST DETERMINISTYCZNY, NIE SŁOWNIKOWY: tniemy na pierwszej kropce,
   po której następuje spacja. Nagłówek jednozdaniowy („Ten etat ma kupować
   analizę.") nie ma czego akcentować i zostaje w całości w kolorze tekstu —
   to poprawne zachowanie, nie brak.

   DOSTĘPNOŚĆ: kolor nie niesie tu żadnej informacji, której nie ma w słowach,
   więc nie łamie `a11y-color-not-sole-meaning`. `--accent-text` ma na papierze
   7,24:1, czyli spełnia AA także dla małego stopnia. */

/** Dzieli nagłówek na fakt i zwrot. Zwrot może nie istnieć. */
export function splitHeadline(text: string): [string, string | null] {
  const at = text.indexOf(". ");
  if (at === -1) return [text, null];
  return [text.slice(0, at + 1), text.slice(at + 2)];
}

type Props = {
  text: string;
  /** `h1` wyłącznie w pierwszej scenie; reszta to `h2` */
  as?: ElementType;
  className?: string;
};

export function SceneHeadline({ text, as: Tag = "h2", className }: Props) {
  const [fakt, zwrot] = splitHeadline(text);
  return (
    <Tag className={className ? `pres-headline ${className}` : "pres-headline"}>
      {fakt}
      {zwrot ? <span className="pres-headline-turn"> {zwrot}</span> : null}
    </Tag>
  );
}

export default SceneHeadline;
