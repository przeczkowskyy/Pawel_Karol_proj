import { Component, type ReactNode } from "react";

/* Error boundary WYŁĄCZNIE dla ozdobnego tła WebGL. Bez niego wyjątek z
   three.js (brak kontekstu WebGL: iOS Lockdown Mode, wyczerpany limit
   kontekstów przy dziesiątkach kart, bloker treści tnący lazy-chunk)
   zdejmował CAŁE drzewo React — klasyczny objaw „strona tylko z tłem".
   Zreprodukowane na silniku WebKit 2026-07-23: pageerror „Error creating
   WebGL context" → #root pusty. Z boundary: tło znika, treść żyje
   (statyczny gradient .bg-layer zostaje). */
export default class BgBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(err: unknown) {
    console.warn("Tło WebGL wyłączone — strona działa dalej bez animacji:", err);
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
