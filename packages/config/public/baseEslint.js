import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,vue}"],
    plugins: { js },
    extends: ["js/recommended"],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,vue}"],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
  pluginVue.configs["flat/essential"],
  {
    files: ["**/*.vue"],
    languageOptions: { parserOptions: { parser: tseslint.parser } },
  },
  // 6. Override unused-vars to allow vars/args/catch starting with `_`
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,vue}"],
    rules: {
      // disable base rule (will use TS one)
      "no-unused-vars": "off",

      // TS-aware unused-vars
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          vars: "all",
          args: "after-used",
          ignoreRestSiblings: true,
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      // **allow Function** by disabling its ban in ban-types:
      "@typescript-eslint/no-unsafe-function-type": "off",
    },
  },
];
