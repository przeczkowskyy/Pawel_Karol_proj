// @ts-check
import { defineConfig } from "astro/config";

// Kontrakt z Cloudflare Pages: statyczny build z site/ do dist/.
// build.format 'file' daje /polityka-prywatnosci.html, które Pages serwuje pod /polityka-prywatnosci.
// compressHTML: true przywraca zachowanie sprzed Astro 7 — domyślne 'jsx' zjada spacje między elementami inline.
export default defineConfig({
  site: "https://klarow.com",
  output: "static",
  build: { format: "file" },
  trailingSlash: "never",
  compressHTML: true,
});
