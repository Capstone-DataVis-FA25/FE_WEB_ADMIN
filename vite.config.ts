import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5174,
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
        secure: false,
      },
      // Proxy Socket.IO websocket endpoint so client can connect to namespaces like /admin-activity
      "/socket.io": {
        target: "http://localhost:4000",
        ws: true,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
