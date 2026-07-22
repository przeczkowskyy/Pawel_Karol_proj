import { useCallback, useEffect, useRef } from "react";

/* SlideDeck — motion-graphic landing: strona jest statyczna (zero scrolla
   dokumentu), gest scrolla / swipe / klawiatura przełącza SEKCJE-SLAJDY
   z przejściem „zoom + fade" (archetyp Premium ze skilla motion-design:
   wyjście przyspiesza, wejście łagodnie ląduje, zero overshootu).
   Slajd z treścią wyższą niż viewport scrolluje się WEWNĘTRZNIE
   (.slide-scroll) — deck przełącza sekcję dopiero od krawędzi treści.
   prefers-reduced-motion: przełączenia natychmiastowe (CSS w globals.css). */

export interface SlideDef {
  id: string;
  label: string;
  node: React.ReactNode;
}

const WHEEL_THRESHOLD = 80; /* skumulowana delta uruchamiająca przejście */
const SWIPE_THRESHOLD = 70; /* px pionowego swipe'a */
const LOCK_MS = 850; /* blokada po przejściu (czas tranzycji + oddech) */

export default function SlideDeck({
  slides,
  active,
  onNavigate,
  dotsLabel,
}: {
  slides: SlideDef[];
  active: number;
  onNavigate: (i: number) => void;
  dotsLabel: string;
}) {
  const lockUntil = useRef(0);
  const wheelAccum = useRef(0);
  const wheelIdleTimer = useRef<number | null>(null);
  const touchStart = useRef<{ y: number; edgeUp: boolean; edgeDown: boolean } | null>(null);

  const go = useCallback(
    (i: number) => {
      if (i < 0 || i >= slides.length || i === active) return;
      onNavigate(i);
      lockUntil.current = performance.now() + LOCK_MS;
      wheelAccum.current = 0;
    },
    [active, slides.length, onNavigate]
  );

  const step = useCallback((dir: 1 | -1) => go(active + dir), [go, active]);

  /* dokument nie scrolluje się wcale — strona jest statyczna */
  useEffect(() => {
    const html = document.documentElement;
    const prevHtml = html.style.overflow;
    const prevBody = document.body.style.overflow;
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      html.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };
  }, []);

  /* czy scroller aktywnego slajdu stoi na krawędzi w danym kierunku
     (jeśli nie — gest należy do wewnętrznego scrolla, nie do decka) */
  const scrollerAtEdge = (target: EventTarget | null, dir: 1 | -1): boolean => {
    const el = (target as HTMLElement | null)?.closest?.(".slide-scroll") as HTMLElement | null;
    if (!el) return true;
    const range = el.scrollHeight - el.clientHeight;
    if (range < 4) return true;
    return dir === 1 ? el.scrollTop >= range - 4 : el.scrollTop <= 4;
  };

  const onWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaY) < 2) return;
    const dir: 1 | -1 = e.deltaY > 0 ? 1 : -1;
    if (!scrollerAtEdge(e.target, dir)) {
      wheelAccum.current = 0;
      return; /* wewnętrzny scroll slajdu obsłuży gest natywnie */
    }
    if (performance.now() < lockUntil.current) return;
    wheelAccum.current += e.deltaY;
    if (wheelIdleTimer.current !== null) window.clearTimeout(wheelIdleTimer.current);
    wheelIdleTimer.current = window.setTimeout(() => {
      wheelAccum.current = 0;
    }, 160);
    if (Math.abs(wheelAccum.current) >= WHEEL_THRESHOLD) step(dir);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = {
      y: t.clientY,
      edgeUp: scrollerAtEdge(e.target, -1),
      edgeDown: scrollerAtEdge(e.target, 1),
    };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const st = touchStart.current;
    touchStart.current = null;
    if (!st) return;
    const dy = st.y - e.changedTouches[0].clientY; /* >0 = swipe w górę = następny */
    if (Math.abs(dy) < SWIPE_THRESHOLD) return;
    if (performance.now() < lockUntil.current) return;
    const dir: 1 | -1 = dy > 0 ? 1 : -1;
    /* krawędź sprawdzona na starcie gestu — środek listy = scroll wewnętrzny */
    if (dir === 1 ? st.edgeDown : st.edgeUp) step(dir);
  };

  /* klawiatura: strzałki / PageUp/Down / spacja / Home / End */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable)) return;
      if (document.querySelector(".modal-overlay-c.open")) return; /* modal ma pierwszeństwo */
      if (e.key === "ArrowDown" || e.key === "PageDown" || (e.key === " " && !e.shiftKey)) {
        e.preventDefault();
        step(1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp" || (e.key === " " && e.shiftKey)) {
        e.preventDefault();
        step(-1);
      } else if (e.key === "Home") {
        e.preventDefault();
        go(0);
      } else if (e.key === "End") {
        e.preventDefault();
        go(slides.length - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, go, slides.length]);

  return (
    <div className="deck" onWheel={onWheel} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      {slides.map((s, i) => (
        <section
          key={s.id}
          className={`slide ${i === active ? "active" : i < active ? "passed" : "ahead"}`}
          aria-hidden={i !== active}
          inert={i !== active}
        >
          <div className="slide-scroll">
            <div className="slide-inner">
              <div className="slide-content">{s.node}</div>
            </div>
          </div>
        </section>
      ))}

      <nav className="deck-dots" aria-label={dotsLabel}>
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            className={i === active ? "active" : ""}
            aria-label={s.label}
            aria-current={i === active}
            onClick={() => go(i)}
          />
        ))}
      </nav>
    </div>
  );
}
