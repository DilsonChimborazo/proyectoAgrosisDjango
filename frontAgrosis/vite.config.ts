import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    host: true, 
    port: 5173,
  },
  preview: {
    host: true, 
    port: 4173,
  },
  build: {
    rollupOptions: {
      external: ['@rollup/rollup-linux-x64-musl'],
    },
    outDir: 'dist',
    sourcemap: false,
  },
});
