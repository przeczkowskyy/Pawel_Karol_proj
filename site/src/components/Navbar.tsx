import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Phone, X } from "lucide-react";
import { PHONE_DISPLAY, PHONE_HREF } from "@/data/contact";
import { MESSAGING } from "@/data/messaging";
import { useLang, pick, type Lang } from "@/i18n";

/* Nawigacja KLAROW: JEDNA linia, 64 px na desktopie i 56 px na telefonie,
   tło nieprzezroczyste (--surface-overlay) z hairline u dołu.
   Świadome decyzje (plan v2 §5.6 i reguły strażnika):
   · zero `backdrop-blur` i zero pigułki na scrimie (design-no-glass-no-blur):
     sticky nawigacja nad tłem WebGL rozmywałaby kadr w każdej klatce scrolla,
   · wordmark tekstowy, płaski, jedyny znak marki (brand-wordmark-only),
   · dokładnie JEDEN primary CTA w pasku, etykieta z MESSAGING.cta.primary
     (design-one-cta-per-screen, copy-cta-labels); na telefonie ten sam CTA
     żyje w panelu, więc na ekranie nigdy nie ma dwóch białych przycisków,
   · kolory, promienie i linie wyłącznie tokenami; przyciski klasami kitu,
   · zamknięte menu mobilne jest wyjęte z kolejności tabulacji: `hidden`
     (twardy fallback dla baseline safari13) + `inert` + `aria-hidden`
     + `tabIndex={-1}` na kontrolkach (a11y-inert-hidden-menus),
   · fokus klawiatury widoczny na KAŻDYM elemencie: `.btn` bierze ring z kitu,
     linki i wordmark dostają go klasami focus-visible (a11y-focus-visible-everywhere).

   NAP (telefon) przychodzi z data/contact.ts; literał numeru w tym pliku
   byłby drugim źródłem prawdy (code-contact-single-source). */

const LINKS = [
  { to: "/narzedzia", label: { pl: "Realizacje i dema", en: "Work and demos" } },
  { to: "/oferta", label: { pl: "Oferta", en: "Offer" } },
  { to: "/faq", label: { pl: "FAQ", en: "FAQ" } },
] as const;

const T = {
  pl: {
    home: "KLAROW, strona główna",
    mainNav: "Nawigacja główna",
    mobileNav: "Nawigacja w menu",
    openMenu: "Otwórz menu",
    closeMenu: "Zamknij menu",
    switchLang: "Switch to English",
  },
  en: {
    home: "KLAROW, home page",
    mainNav: "Main navigation",
    mobileNav: "Menu navigation",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    switchLang: "Przełącz na polski",
  },
};

/* Pierścień fokusu dla elementów spoza kitu (kit daje go tylko klasom .btn).
   Kolor z tokenu --ring; 2 px zamiast 2,5 px, bo Tailwind ma skok całkowity,
   a wartość arbitralna łamałaby design-tokens-only. */
const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

/* Barwa linku siedzi na <span>, nie na <a>. Powód jest kaskadowy, nie estetyczny:
   `a{color:inherit}` z kitu stoi POZA warstwami, każde utility Tailwinda siedzi
   w @layer utilities, a reguła bez warstwy wygrywa niezależnie od specyficzności.
   Na kotwicy `text-foreground-muted` nie zadziałałoby. Ikona dziedziczy barwę
   przez currentColor. */
const LINK_TEXT = "text-foreground-muted hover:text-foreground-strong";

function LangToggle({
  lang,
  setLang,
  label,
  tabIndex,
}: {
  lang: Lang;
  setLang: (l: Lang) => void;
  label: string;
  tabIndex?: number;
}) {
  return (
    <button
      type="button"
      className="btn btn-ghost btn-sm"
      onClick={() => setLang(lang === "pl" ? "en" : "pl")}
      aria-label={label}
      tabIndex={tabIndex}
    >
      {lang === "pl" ? "EN" : "PL"}
    </button>
  );
}

export default function Navbar({ onBook }: { onBook: () => void }) {
  const { lang, setLang } = useLang();
  const t = pick(lang, T);
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  /* zmiana trasy zamyka panel (kliknięcie w link i tak nawiguje) */
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  /* Esc zamyka panel; listener żyje tylko wtedy, gdy panel jest otwarty */
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const book = () => {
    setIsOpen(false);
    onBook();
  };
  const panelTabIndex = isOpen ? undefined : -1;

  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-b border-border bg-surface-overlay">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="flex h-14 items-center justify-between gap-4 sm:h-16">
          <Link to="/" aria-label={t.home} className={`inline-flex items-center ${FOCUS_RING}`}>
            <span className="brand-word" translate="no">
              KLAROW
            </span>
          </Link>

          <nav className="hidden items-center gap-6 sm:flex" aria-label={t.mainNav}>
            {LINKS.map((link) => (
              <Link key={link.to} to={link.to} className={`inline-flex ${FOCUS_RING}`}>
                <span className={`text-sm font-bold ${LINK_TEXT}`}>{pick(lang, link.label)}</span>
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 sm:flex">
            <a href={PHONE_HREF} className={`hidden lg:inline-flex ${FOCUS_RING}`}>
              <span
                className={`inline-flex items-center gap-2 text-xs font-bold whitespace-nowrap ${LINK_TEXT}`}
              >
                <Phone size={16} strokeWidth={1.75} aria-hidden="true" />
                {PHONE_DISPLAY}
              </span>
            </a>
            <LangToggle lang={lang} setLang={setLang} label={t.switchLang} />
            <button type="button" className="btn btn-primary whitespace-nowrap" onClick={book}>
              {pick(lang, MESSAGING.cta.primary)}
            </button>
          </div>

          <button
            type="button"
            className={`-mr-2 inline-flex h-11 w-11 items-center justify-center text-foreground-muted sm:hidden ${FOCUS_RING}`}
            onClick={() => setIsOpen((o) => !o)}
            aria-label={isOpen ? t.closeMenu : t.openMenu}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            {isOpen ? (
              <X size={24} strokeWidth={1.5} aria-hidden="true" />
            ) : (
              <Menu size={24} strokeWidth={1.5} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Panel mobilny. Zamknięty: `hidden` (działa na każdej przeglądarce
          z baseline projektu) + `inert` + `aria-hidden`, a kontrolki dostają
          tabIndex={-1}. Komplet, bo sam `inert` nie istnieje na safari13. */}
      <div
        id="mobile-menu"
        className="border-t border-border bg-surface-overlay sm:hidden"
        hidden={!isOpen}
        inert={!isOpen || undefined}
        aria-hidden={!isOpen}
      >
        <nav className="mx-auto flex w-full max-w-6xl flex-col px-4 py-2" aria-label={t.mobileNav}>
          {LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              tabIndex={panelTabIndex}
              onClick={() => setIsOpen(false)}
              className={`flex min-h-11 items-center ${FOCUS_RING}`}
            >
              <span className={`text-base font-bold ${LINK_TEXT}`}>{pick(lang, link.label)}</span>
            </Link>
          ))}
          <a
            href={PHONE_HREF}
            tabIndex={panelTabIndex}
            className={`flex min-h-11 items-center ${FOCUS_RING}`}
          >
            <span className={`inline-flex items-center gap-2 text-sm font-bold ${LINK_TEXT}`}>
              <Phone size={16} strokeWidth={1.75} aria-hidden="true" />
              {PHONE_DISPLAY}
            </span>
          </a>
          <div className="flex items-center gap-3 py-3">
            <LangToggle
              lang={lang}
              setLang={setLang}
              label={t.switchLang}
              tabIndex={panelTabIndex}
            />
            <button
              type="button"
              className="btn btn-primary flex-1 justify-center whitespace-nowrap"
              onClick={book}
              tabIndex={panelTabIndex}
            >
              {pick(lang, MESSAGING.cta.primary)}
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
