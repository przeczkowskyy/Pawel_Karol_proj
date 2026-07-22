import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(dirname, "src") },
  },
  build: {
    /* Kompatybilność ze starszymi WebKitami (iPhone'y bez najnowszego iOS):
       - target JS: bez składni nowszej niż es2019/safari13,
       - cssTarget: Lightning CSS transpiluje nowoczesny CSS (oklch, color-mix,
         skróty typu `inset`) do postaci zrozumiałej dla starych Safari —
         domyślny target pozwalał minifierowi ZJADAĆ fallbacki (np. longhandy
         top/right/bottom/left sklejał z powrotem w samo `inset`), przez co
         telefon pokazywał „stronę tylko z tłem". */
    target: ["es2019", "safari13"],
    cssTarget: ["safari13"],
  },
});
