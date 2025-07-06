import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "node:path";
import dts from "vite-plugin-dts"; // Plugin to generate .d.ts files
export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      outDir: "dist/types",
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // Define @ as src directory
    },
  },
  build: {
    cssCodeSplit: true,
    lib: {
      entry: "./src/index.ts", // Entry point for your library
      name: "DevkitForm", // Global variable name for your library
      fileName: (format) => `index.${format}.js`, // Output file name
      formats: ["es"], // Only output ESM format
    },
    rollupOptions: {
      external: [
        "vue",
        "vue-router",
        "primevue",
        "pinia",
        "@formkit/core",
        "@formkit/vue",
        "@tanstack/vue-query",
        "@tanstack/query-persist-client-core",
        "primevue/dialogservice",
        "primevue/toastservice",
        "vue-i18n",
        "vue-router",
        "tailwindcss",
        "primeicons",
        "@devkit/datalist",
        "@devkit/apiclient",
        "@devkit/base-components",
        "@devkit/config",
        "dexie",
        "tailwindcss",
        "tailwindcss-primeui",
        "vue-i18n",
        "vue-router",
      ],
      // Externalize Vue
      output: {
        globals: {
          vue: "Vue",
          primevue: "Primevue",
          "vue-router": "VueRouter",
          "@devkit/form": "DevkitForm",
          "@devkit/base-components": "DevkitBaseComponents",
        },
      },
    },
  },
});
