/** Znak marki KLAROW — TEKSTOWY wordmark (bez logo graficznego).
 *  Zmiana nazwy marki = podmiana domyślnej wartości `name` (jedno miejsce).
 *  Styl (metaliczny gradient stali na tekście) daje klasa `.brand-word` w kicie. */
export function BrandMark({ name = "KLAROW" }: { name?: string }) {
  return (
    <span className="brand-word" role="img" aria-label={name}>
      {name}
    </span>
  );
}
