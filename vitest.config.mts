import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      exclude: [
        "node_modules/**",
        "src/setupTests.ts",
        "src/test-utils.tsx",
        "src/app/**",
        "src/components/Providers.tsx",
        "src/server.ts",
        "src/types/**",
        "src/lib/config.ts",
        "next.config.ts",
        "next-env.d.ts",
        "vitest.config.mts",
        "eslint.config.mjs",
        "postcss.config.mjs",
        "tsconfig.json",
        ".next/**",
        "coverage/**",
      ],
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});