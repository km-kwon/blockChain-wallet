import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 1100,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/three") || id.includes("node_modules/troika-three")) {
            return "three-vendor";
          }

          if (id.includes("node_modules/@react-three")) {
            return "r3f-vendor";
          }

          if (id.includes("node_modules/alchemy-sdk") || id.includes("node_modules/@ethersproject")) {
            return "alchemy-vendor";
          }

          if (id.includes("node_modules/recharts")) {
            return "charts-vendor";
          }
        },
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
