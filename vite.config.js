import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Em produção (build no GitHub Actions) servimos o app sob /claude/ (Pages do repo).
// No dev local, base = "/" para HMR funcionar normalmente.
const base = process.env.GITHUB_ACTIONS ? "/claude/" : "/";

export default defineConfig({
  base,
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
  build: {
    // Divide vendors em chunks próprios: melhora cache entre deploys e
    // permite carregar Leaflet em paralelo com o código do app.
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          leaflet: ["leaflet", "react-leaflet"],
        },
      },
    },
  },
});
