/**
 * Standard Vite + TanStack Start configuration.
 *
 * Lovable-specific packages have been removed:
 *   ✗  @lovable.dev/vite-tanstack-config   (wrapper that added Lovable plugins)
 *   ✗  lovable-tagger                       (component highlighter / red borders)
 *   ✗  @lovable.dev/vite-plugin-hmr-gate    (Lovable sandbox HMR gate)
 *   ✗  @lovable.dev/vite-plugin-dev-server-bridge (Lovable sandbox bridge)
 *
 * Equivalent functionality is provided directly below using the standard
 * upstream packages that the Lovable wrapper was already depending on.
 */
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    // TanStack Start SSR/routing framework plugin — must be first
    tanstackStart({
      importProtection: {
        behavior: "error",
        client: {
          files: ["**/server/**"],
          specifiers: ["server-only"],
        },
      },
    }),

    // React JSX transform
    react(),

    // Tailwind CSS v4 via its official Vite plugin
    tailwindcss(),

    // Resolve TypeScript path aliases (@ → ./src) from tsconfig.json
    tsconfigPaths(),
  ],

  resolve: {
    // Explicit @ alias as a fallback (tsconfig paths covers this too)
    alias: {
      "@": `${process.cwd()}/src`,
    },
    // Deduplicate shared singletons across the module graph
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@tanstack/react-query",
      "@tanstack/query-core",
    ],
  },

  server: {
    // Standard Vite dev-server port (Lovable sandbox required 8080; we don't)
    port: 5173,
  },
});
