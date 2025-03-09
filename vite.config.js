import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://develiveryapi-krxzvkex0-hamzagts-projects.vercel.app",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
