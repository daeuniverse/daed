import path from "path";

import react from "@vitejs/plugin-react-swc";
import autoImport from "unplugin-auto-import/vite";
import { defineConfig } from "vite";

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  resolve: {
    alias: {
      "~": path.resolve("src"),
    },
  },
  plugins: [
    react(),
    autoImport({
      dts: "src/typings/auto-imports.d.ts",
      imports: [
        "react",
        { react: ["Fragment"] },
        { from: "react", imports: ["ForwardedRef"], type: true },
        "react-i18next",
        { "@nanostores/react": ["useStore"] },
        { "react-hook-form": ["useForm", "Controller"] },
        { from: "react-hook-form", imports: ["UseFormReturn"], type: true },
      ],
      dirs: ["src", "src/store", "src/gql", "src/i18n"],
    }),
  ],
});
