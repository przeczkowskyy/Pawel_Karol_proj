import { useState } from "react";
import { Menu, X } from "lucide-react";

/* Pływający navbar-pigułka (adaptacja MiniNavbar z 21st.dev) — brand KLAROW,
   stal zamiast bieli, bez logowania (landing v0.1). */

const LINKS = [
  { label: "Moduły", href: "#moduly" },
  { label: "Jak działamy", href: "#jak" },
  { label: "Dowód", href: "#dowod" },
  { label: "Kontakt", href: "#kontakt" },
];

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="group relative inline-block overflow-hidden h-5 flex items-center text-sm"
    >
      <div className="flex flex-col transition-transform duration-400 ease-out transform group-hover:-translate-y-1/2">
        <span className="text-[#b4b4b9]">{children}</span>
        <span className="text-white">{children}</span>
      </div>
    </a>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const cta = (
    <a
      href="mailto:kontakt@klarow.com?subject=Diagnoza%20automatyzacji"
      className="px-4 py-2 text-xs sm:text-sm font-bold text-[#171717] rounded-full
                 bg-gradient-to-b from-[#b9c4d1] via-[#a8b4c2] to-[#96a3b3]
                 hover:from-[#c7d0dc] hover:via-[#bfc9d6] hover:to-[#aab6c4]
                 transition-all duration-200 w-full sm:w-auto text-center whitespace-nowrap"
    >
      Umów diagnozę
    </a>
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
      <div className="flex items-center justify-between w-full gap-x-6 sm:gap-x-8">
        <a href="#top" className="brand-word" style={{ fontSize: 13 }}>
          KLAROW
        </a>

        <nav className="hidden sm:flex items-center space-x-4 sm:space-x-6 text-sm">
          {LINKS.map((link) => (
            <NavLink key={link.href} href={link.href}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden sm:flex items-center">{cta}</div>

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
                    ${isOpen ? "max-h-[400px] opacity-100 pt-4" : "max-h-0 opacity-0 pt-0 pointer-events-none"}`}
      >
        <nav className="flex flex-col items-center space-y-4 text-base w-full">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-[#b4b4b9] hover:text-white transition-colors w-full text-center"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex flex-col items-center mt-4 mb-2 w-full px-4">{cta}</div>
      </div>
    </header>
  );
}
