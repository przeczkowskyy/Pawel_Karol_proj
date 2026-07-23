import { useEffect } from "react";

/* SEO per podstrona (SPA): tytuł, meta description, canonical, Open Graph,
   opcjonalny JSON-LD. Wywoływany na landingu i na każdej podstronie
   narzędzia — podzakładki /narzedzia/:slug budują zaufanie i long-tail.
   Sitemap: public/sitemap.xml (aktualizuj przy dodaniu narzędzia!). */

const ORIGIN = "https://klarow.com";

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export default function Seo({
  title,
  description,
  path,
  jsonLd,
}: {
  title: string;
  description: string;
  path: string; // np. "/" albo "/narzedzia/raport-zarzadczy"
  /* pojedynczy obiekt albo tablica bloków (np. [SoftwareApplication, FAQPage]) —
     Google akceptuje tablicę w jednym <script type="application/ld+json"> */
  jsonLd?: object | object[];
}) {
  useEffect(() => {
    document.title = title;
    setMeta("name", "description", description);

    const url = ORIGIN + (path === "/" ? "/" : path);
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", url);

    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", url);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:site_name", "Klarow");
    setMeta("name", "twitter:card", "summary");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);

    const id = "seo-jsonld";
    document.getElementById(id)?.remove();
    if (jsonLd) {
      const s = document.createElement("script");
      s.type = "application/ld+json";
      s.id = id;
      s.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(s);
    }
  }, [title, description, path, jsonLd]);

  return null;
}

/* JSON-LD organizacji (landing) */
export const ORG_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Klarow",
  url: ORIGIN,
  email: "kontakt@klarow.com",
  telephone: "+48 786 296 426",
  description:
    "Automatyzacja, upraszczanie i porządek w danych dla firm 20–250 osób, które wyrosły na Excelu. Wdrożenie w dni, nie w miesiące — dane zostają u klienta (on-premise).",
  areaServed: ["PL", "US"],
};

/* JSON-LD narzędzia (podstrona /narzedzia/:slug) */
export function toolJsonLd(name: string, description: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `${name} — Klarow`,
    description,
    url: ORIGIN + path,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Windows",
    offers: { "@type": "Offer", priceCurrency: "PLN", price: "0", description: "Demo online" },
    provider: { "@type": "Organization", name: "Klarow", url: ORIGIN },
  };
}

/* FAQPage JSON-LD (GEO): pytania-obiekcje z landingu i per-narzędzie —
   materiał wprost cytowalny przez wyszukiwarki i LLM-y */
export function faqPageJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      /* cudzysłowy „obiekcji" zostają — tak brzmi naturalne pytanie klienta */
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
