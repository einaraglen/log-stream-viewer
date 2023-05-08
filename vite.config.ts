import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "log-viewer",
      filename: "remoteEntry.js",
      exposes: {
        "./Test": "./src/Test",
        "./LogViewer": "./src/LogViewer",
      },
      shared: ["react", "react-dom"],
    }),
  ],
  server: {
    port: 5001,
  },
  preview: {
    port: 5001,
  },
  build: {
    modulePreload: false,
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
});
