import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import { PHONE_DISPLAY, PHONE_HREF } from "@/components/BookingModal";
import { useLang, pick } from "@/i18n";

/* Pływający navbar-pigułka (adaptacja MiniNavbar z 21st.dev) — brand KLAROW,
   stal zamiast bieli. CTA otwiera modal kalendarza; linki działają też
   z podstron modułów (router + hash). Przełącznik PL/EN. */

const LINKS_I18N = {
  pl: [
    { label: "Moduły", to: "/#moduly" },
    { label: "Wyróżniki", to: "/#wyrozniki" },
    { label: "Współpraca", to: "/#wspolpraca" },
    { label: "Dowód", to: "/#dowod" },
    { label: "FAQ", to: "/#faq" },
    { label: "Kontakt", to: "/#kontakt" },
  ],
  en: [
    { label: "Modules", to: "/#moduly" },
    { label: "Differentiators", to: "/#wyrozniki" },
    { label: "How we work", to: "/#wspolpraca" },
    { label: "Proof", to: "/#dowod" },
    { label: "FAQ", to: "/#faq" },
    { label: "Contact", to: "/#kontakt" },
  ],
};

const CTA_I18N = { pl: "Umów diagnozę", en: "Book a diagnosis" };

function NavLink({ to, children, onClick }: { to: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="group relative inline-block overflow-hidden h-5 flex items-center text-sm"
    >
      <div className="flex flex-col transition-transform duration-400 ease-out transform group-hover:-translate-y-1/2">
        <span className="text-[#b4b4b9]">{children}</span>
        <span className="text-white">{children}</span>
      </div>
    </Link>
  );
}

export default function Navbar({ onBook }: { onBook: () => void }) {
  const { lang, setLang } = useLang();
  const [isOpen, setIsOpen] = useState(false);
  const LINKS = pick(lang, LINKS_I18N);

  const langToggle = (
    <button
      type="button"
      onClick={() => setLang(lang === "pl" ? "en" : "pl")}
      className="px-2 py-1 text-[11px] font-extrabold tracking-widest rounded-full border border-[#3a3a3a] text-[#b4b4b9] hover:text-white hover:border-[#a8b4c2] transition-colors cursor-pointer"
      aria-label={lang === "pl" ? "Switch to English" : "Przełącz na polski"}
    >
      {lang === "pl" ? "EN" : "PL"}
    </button>
  );

  const cta = (
    <button
      type="button"
      onClick={() => {
        setIsOpen(false);
        onBook();
      }}
      className="px-4 py-2 text-xs sm:text-sm font-bold text-[#171717] rounded-full
                 bg-gradient-to-b from-[#b9c4d1] via-[#a8b4c2] to-[#96a3b3]
                 hover:from-[#c7d0dc] hover:via-[#bfc9d6] hover:to-[#aab6c4]
                 transition-all duration-200 w-full sm:w-auto text-center whitespace-nowrap cursor-pointer"
    >
      {pick(lang, CTA_I18N)}
    </button>
  );

  return (
    <header
      className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50
                  flex flex-col items-center
                  pl-6 pr-3 py-2.5 backdrop-blur-sm
                  ${isOpen ? "rounded-xl" : "rounded-full"}
                  border border-[#333] bg-[#17171799]
                  w-[calc(100%-2rem)] sm:w-auto`}
    >
      <div className="flex items-center justify-between w-full gap-x-5 sm:gap-x-7">
        <Link to="/" className="brand-word" style={{ fontSize: 13 }}>
          KLAROW
        </Link>

        <nav className="hidden sm:flex items-center space-x-4 sm:space-x-5 text-sm">
          {LINKS.map((link) => (
            <NavLink key={link.to} to={link.to}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden sm:flex items-center gap-3">
          <a
            href={PHONE_HREF}
            className="hidden lg:inline-flex items-center gap-1.5 text-xs font-bold text-[#b4b4b9] hover:text-white transition-colors whitespace-nowrap"
          >
            <Phone size={12} className="text-[#a8b4c2]" /> {PHONE_DISPLAY}
          </a>
          {langToggle}
          {cta}
        </div>

        <button
          className="sm:hidden flex items-center justify-center w-8 h-8 text-[#b4b4b9]"
          onClick={() => setIsOpen((o) => !o)}
          aria-label={isOpen ? "Zamknij menu" : "Otwórz menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div
        className={`sm:hidden flex flex-col items-center w-full transition-all ease-in-out duration-300 overflow-hidden
                    ${isOpen ? "max-h-[420px] opacity-100 pt-4" : "max-h-0 opacity-0 pt-0 pointer-events-none"}`}
      >
        <nav className="flex flex-col items-center space-y-4 text-base w-full">
          {LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setIsOpen(false)}
              className="text-[#b4b4b9] hover:text-white transition-colors w-full text-center"
            >
              {link.label}
            </Link>
          ))}
          <a href={PHONE_HREF} className="inline-flex items-center gap-2 text-sm font-bold text-[#b4b4b9]">
            <Phone size={14} className="text-[#a8b4c2]" /> {PHONE_DISPLAY}
          </a>
          {langToggle}
        </nav>
        <div className="flex flex-col items-center mt-4 mb-2 w-full px-4">{cta}</div>
      </div>
    </header>
  );
}
