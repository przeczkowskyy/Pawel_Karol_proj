/** Znak marki — TEKSTOWY wordmark-placeholder (bez logo graficznego).
 *  Po wyborze nazwy firmy podmień domyślną wartość `name` (jedno miejsce).
 *  Styl (metaliczny gradient stali na tekście) daje klasa `.brand-word` w kicie. */
export function BrandMark({ name = "YOUR COMPANY NAME" }: { name?: string }) {
  return (
    <span className="brand-word" role="img" aria-label={name}>
      {name}
    </span>
  );
}
