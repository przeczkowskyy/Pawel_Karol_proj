import { Component, type ReactNode } from "react";

/* Uogólnienie BgBoundary (src/components/BgBoundary.tsx) na wszystko, co może się wywrócić
   poza rdzeniem strony: wideo hero, tło, lazy dashboard, generator PDF.
   Powód historyczny: 2026-07-23 wyjątek z warstwy tła zdejmował CAŁE drzewo Reacta
   i telefon pokazywał pustą stronę. Z granicą błędu psuje się tylko ozdoba, treść żyje.

   Fallback jest OBOWIĄZKOWY i ma być czymś sensownym (plakat, komunikat, nic),
   nigdy pustym ekranem. Granica łapie błędy renderu i efektów dzieci;
   nie łapie odrzuconych obietnic ani błędów w obsłudze zdarzeń (to bramkuje sam komponent). */
export class MediaBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(err: unknown) {
    if (import.meta.env.DEV) console.warn("MediaBoundary:", err);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
