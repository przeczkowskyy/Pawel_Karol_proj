import { useEffect } from "react";
import {
  AREA_SERVED,
  EMAIL,
  ORG_NAME,
  ORIGIN,
  PHONE_E164,
  SAME_AS,
} from "@/data/contact";
import { MESSAGING } from "@/data/messaging";

/* SEO per trasa (SPA): tytuł, meta description, robots, canonical, Open Graph,
   Twitter, opcjonalny JSON-LD. Wartości biorą się z src/data/pagesSeo.ts
   i src/data/toolsSeo.ts, nigdy z literału w komponencie.

   Ten sam komplet wstrzykuje prerender (scripts/prerender.mjs) do statycznego
   HTML, więc scraper bez JS i użytkownik po nawigacji SPA widzą to samo.
   JSON-LD ma id „seo-jsonld”: prerender wstawia swój blok pod tym samym id,
   a ten komponent go zdejmuje przy montażu, żeby strona nie miała dwóch
   bloków naraz (ani nieaktualnego po nawigacji).

   sitemap.xml i llms.txt są generowane przy buildzie z tools.ts i listy tras
   (seo-sitemap-llms-generated), nie ma ich w public/. */

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function dropMeta(attr: "name" | "property", key: string) {
  document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)?.remove();
}

export default function Seo({
  title,
  description,
  path,
  jsonLd,
  noindex,
}: {
  title: string;
  description: string;
  path: string; // np. "/" albo "/narzedzia/raport-zarzadczy"
  /* pojedynczy obiekt albo tablica bloków (np. [SoftwareApplication, FAQPage]);
     Google akceptuje tablicę w jednym <script type="application/ld+json"> */
  jsonLd?: object | object[];
  /* trasa poza indeksem (/rodo do przeglądu radcy, 404) */
  noindex?: boolean;
}) {
  useEffect(() => {
    document.title = title;
    setMeta("name", "description", description);

    /* robots ustawiamy TYLKO na trasach noindex, a po wyjściu z nich
       kasujemy: inaczej po nawigacji SPA z /rodo cała reszta strony
       zostałaby z „noindex” w <head>. */
    if (noindex) setMeta("name", "robots", "noindex, follow");
    else dropMeta("name", "robots");

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
    setMeta("property", "og:site_name", ORG_NAME);
    setMeta("property", "og:locale", "pl_PL");
    setMeta("property", "og:locale:alternate", "en_US");
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
  }, [title, description, path, jsonLd, noindex]);

  return null;
}

/* JSON-LD organizacji: opis firmy bierze się ze zdań marki, NAP z contact.ts.
   sameAs pojawia się dopiero, gdy founderzy zdecydują o publicznych profilach
   (contact.ts, decyzja D-05); pusta tablica nie jest renderowana. */
export const ORG_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: ORG_NAME,
  url: ORIGIN,
  logo: `${ORIGIN}/klarow-logo-512.png`,
  email: EMAIL,
  telephone: PHONE_E164,
  description: `${MESSAGING.oneLiner.pl} ${MESSAGING.subtext.pl}`,
  areaServed: [...AREA_SERVED],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    email: EMAIL,
    telephone: PHONE_E164,
    areaServed: [...AREA_SERVED],
    availableLanguage: ["pl", "en"],
  },
  ...(SAME_AS.length ? { sameAs: [...SAME_AS] } : {}),
};

/* JSON-LD narzędzia (podstrona /narzedzia/:slug).
   Bez offers i bez systemu operacyjnego innego niż „Web”: demo liczy
   w przeglądarce, a cena 0 deklarowała Google darmową aplikację, której nie ma
   (seo-jsonld-per-kind). Rozdział SoftwareApplication vs Service per `kind`
   czeka na fazę, która przepisze podstronę narzędzia. */
export function toolJsonLd(name: string, description: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `${name} | ${ORG_NAME}`,
    description,
    url: ORIGIN + path,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    provider: { "@type": "Organization", name: ORG_NAME, url: ORIGIN },
  };
}

/* FAQPage JSON-LD (GEO): pytania-obiekcje z landingu i per narzędzie.
   Każde pytanie ma dosłowne pokrycie w treści strony. */
export function faqPageJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      /* cudzysłowy „obiekcji” zostają: tak brzmi naturalne pytanie klienta */
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
