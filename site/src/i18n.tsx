import { createContext, useContext, useEffect, useState } from "react";

/* Lekki i18n PL/EN (v0.3): przełącznik w navbarze, wybór w localStorage.
   Teksty żyją przy komponentach (obiekt { pl, en } + pick()). Docelowo —
   przy przejściu na content-driven YAML — trasy /pl/ i /en/ build-time
   (zgodnie z planem strategicznym §4.2). */

export type Lang = "pl" | "en";

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: "pl",
  setLang: () => {},
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    try {
      const s = localStorage.getItem("klarow-lang");
      if (s === "en" || s === "pl") return s;
    } catch {
      /* noop */
    }
    return "pl";
  });

  useEffect(() => {
    try {
      localStorage.setItem("klarow-lang", lang);
    } catch {
      /* noop */
    }
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);

export function pick<T>(lang: Lang, v: { pl: T; en: T }): T {
  return lang === "pl" ? v.pl : v.en;
}
