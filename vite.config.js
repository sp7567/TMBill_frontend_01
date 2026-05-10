import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      "/auth":        { target: "http://localhost:5001", changeOrigin: true },
      "/admin":       { target: "http://localhost:5001", changeOrigin: true },
      "/restaurants": { target: "http://localhost:5001", changeOrigin: true },
      "/orders":      { target: "http://localhost:5001", changeOrigin: true },
      "/socket.io":   { target: "http://localhost:5001", ws: true, changeOrigin: true },
    },
  },
  build: { outDir: "dist", sourcemap: false },
});
