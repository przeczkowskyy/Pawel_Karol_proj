import { useEffect, useRef, useState } from "react";
import { ChevronDown, Factory, Wallet, ShieldCheck, Dot } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { BrandMark } from "./BrandMark";

/** Nowy standard nawigacji Nuconic (kit v2.0): pływający launcher „N" w prawym
 *  dolnym rogu. Klik → rozwija listę GŁÓWNYCH KATEGORII; klik kategorii → jej
 *  border rośnie (jesteś „w" tej kategorii) i pod nią pojawiają się narzędzia.
 *  Na razie kategorie i narzędzia to placeholdery — routing dojdzie później. */

interface NcCategory {
  id: string;
  label: string;
  icon: LucideIcon;
  tools: string[];
}

/** placeholdery narzędzi — Place Holder 1..n */
const ph = (n: number) => Array.from({ length: n }, (_, i) => `Place Holder ${i + 1}`);

const NC_CATEGORIES: NcCategory[] = [
  { id: "produkcja", label: "Produkcja", icon: Factory, tools: ph(10) },
  { id: "finanse", label: "Finanse", icon: Wallet, tools: ph(10) },
  { id: "administracja", label: "Administracja", icon: ShieldCheck, tools: ph(10) },
];

export function NcLauncher() {
  const [open, setOpen] = useState(false);
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  // zamknij po Escape i po kliknięciu poza launcherem
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [open]);

  function toggleCat(id: string) {
    setActiveCat((cur) => (cur === id ? null : id));
    setActiveTool(null);
  }

  return (
    <div className={`nc-launcher${open ? " open" : ""}`} ref={rootRef}>
      <div className="nc-launcher-panel" role="menu" aria-hidden={!open}>
        <div className="nc-launcher-head">
          <span className="nc-launcher-title">Nuconic</span>
          <span className="nc-launcher-sub">Wybierz kategorię</span>
        </div>
        <div className="nc-cat-list">
          {NC_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCat === cat.id;
            return (
              <div key={cat.id} className={`nc-cat${isActive ? " active" : ""}`}>
                <button
                  type="button"
                  className="nc-cat-head"
                  aria-expanded={isActive}
                  onClick={() => toggleCat(cat.id)}
                >
                  <Icon className="nc-cat-ico" />
                  <span className="nc-cat-label">{cat.label}</span>
                  <ChevronDown className="nc-cat-chevron" />
                </button>
                <div className="nc-cat-tools" role="group" aria-label={cat.label}>
                  {cat.tools.map((tool) => (
                    <button
                      key={tool}
                      type="button"
                      className={`nc-tool${activeTool === `${cat.id}:${tool}` ? " active" : ""}`}
                      onClick={() => setActiveTool(`${cat.id}:${tool}`)}
                    >
                      <Dot className="nc-tool-ico" />
                      <span>{tool}</span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        className="nc-launcher-fab"
        aria-label={open ? "Zamknij menu Nuconic" : "Otwórz menu Nuconic"}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="nc-fab-mark">
          <BrandMark />
        </span>
      </button>
    </div>
  );
}
