import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/green-api--telegram/",
  resolve: {
    alias: {
      "@app": path.resolve(__dirname, "src/app/"),
      "@entities": path.resolve(__dirname, "src/entities/"),
      "@features": path.resolve(__dirname, "src/features/"),
      "@pages": path.resolve(__dirname, "src/pages/"),
      "@shared": path.resolve(__dirname, "src/shared/"),
      "@widgets": path.resolve(__dirname, "src/widgets/"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@shared/styles/" as *;`,
      },
    },
  },
  // server: {
  //   host: true,
  //   port: 5173,
  // },
});
