import type { APIRoute } from "astro";
import { strony } from "../content/strona";

/**
 * Własna sitemapa zamiast integracji: mamy kilka stron i chcemy pełnej kontroli nad tym,
 * co w niej jest. Nie ma tu `/start` (noindex, adres z kodu QR) ani `/404`.
 *
 * Świadomie bez `lastmod`: Google używa go tylko wtedy, gdy jest „konsekwentnie i sprawdzalnie
 * dokładny". Ręcznie utrzymywana data, o której ktoś zapomni, jest gorsza niż jej brak.
 */
export const GET: APIRoute = () => {
  const adresy = strony
    .filter((s) => s.wSitemapie)
    .map((s) => `  <url><loc>https://klarow.com${s.url === "/" ? "/" : s.url}</loc></url>`)
    .join("\n");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${adresy}\n</urlset>\n`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } },
  );
};
