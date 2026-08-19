import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  // The collection imports hundreds of generated image modules. Keeping
  // application modules out of Vite's dependency cache prevents stale cache
  // chunks from turning otherwise valid images into placeholders.
  optimizeDeps: {
    entries: [],
    include: [
      "@tanstack/react-query",
      "framer-motion",
      "i18next",
      "lucide-react",
      "react",
      "react-dom/client",
      "react-i18next",
      "react-router-dom",
      "sonner",
      "zod",
    ],
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
}));
