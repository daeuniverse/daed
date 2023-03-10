import path from "path";

import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  clearScreen: false,
  resolve: {
    alias: {
      "~": path.resolve("src"),
    },
  },
  plugins: [react()],
});
