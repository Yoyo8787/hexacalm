import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  base: "/hexacalm/",
  plugins: [react(), tailwindcss()],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: "vendor",
              test: /node_modules/,
              entriesAware: true,
              maxSize: 500_000,
            },
          ],
        },
      },
    },
  },
});
