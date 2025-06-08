// vue.js
import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import tseslint from "@typescript-eslint/eslint-plugin";
import pluginVue from "eslint-plugin-vue";
import globals from "globals";
import { config as baseConfig } from "./base.js";

/**
 * A custom ESLint configuration for libraries that use Vue 3.
 *
 * @type {import("eslint").Linter.Config}
 */
export const vueConfig = [
  // 1) Always start by including your shared base rules:
  ...baseConfig,

  // 2) Core JS rules (ESLint’s recommended):
  js.configs.recommended,

  // 3) Prettier to disable formatting rules that conflict:
  eslintConfigPrettier,

  // 4) TypeScript ESLint rules:
  ...tseslint.configs.recommended,

  // 5) Vue plugin’s “recommended” configuration:
  {
    // Merge in the recommended “vue” flat config object
    ...pluginVue.configs["recommended"],
    languageOptions: {
      // Keep any languageOptions from “recommended” (e.g. TS parser),
      // plus add browser‐related globals if desired:
      ...pluginVue.configs["recommended"].languageOptions,
      globals: {
        // e.g. allow browser globals like window, document, etc.
        ...globals.browser,
        ...globals.es2021,
      },
    },
  },

  // 6) Explicitly register the plugin under “plugins” and optionally override rules.
  {
    plugins: {
      vue: pluginVue,
    },
    rules: {
      // Copy all recommended Vue rules (already included above),
      // then override or add any that you want. For example:
      ...pluginVue.configs["recommended"].rules,

      // Example overrides—you can pick/choose or remove these:
      "vue/html-indent": ["error", 2],                       // enforce 2-space indent in <template>
      "vue/max-attributes-per-line": ["error", {              // at most 3 attributes per line
        singleline: 3,
        multiline: {
          max: 1,
          allowFirstLine: false
        }
      }],
      "vue/require-default-prop": "off",                     // (optional) disable defaultProp requirement
      "vue/no-unused-vars": "warn",                           // warn on unused bindings in <template>
    },
  },

  // 7) (Optional) If you need to ignore build artifacts:
  {
    ignores: ["dist/**", "node_modules/**"],
  },
];
