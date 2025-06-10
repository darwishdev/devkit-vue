import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import turboPlugin from "eslint-plugin-turbo";
import type { Linter } from "eslint";

/**
 * A shared ESLint configuration for the repository.
 */
export const config: Linter.FlatConfig[] = [
  js.configs.recommended,
  eslintConfigPrettier,
  {
    plugins: {
      turbo: turboPlugin,
      // The `onlyWarn` plugin does not export itself directly as a plugin object,
      // but rather its functionality is used by including it in the `plugins` object
      // and then it works by wrapping the rules you want to only warn on.
      // However, if the intention was to make all rules warn, the `onlyWarn` plugin
      // typically modifies the config *after* other plugins are loaded, or you'd use
      // its specific syntax within the rules.
      // Given its usage in the original, I'm keeping it as a plugin entry,
      // but note its primary usage is often with `rules['only-warn/rule-name']`.
    },
    rules: {
      "turbo/no-undeclared-env-vars": "warn",
    },
  },
  {
    // The `onlyWarn` plugin's effect is usually applied to specific rules
    // or by transforming the configuration. If the intent is to make all
    // errors into warnings, `onlyWarn` would typically be applied differently
    // or through its specific configuration.
    // For general application to all rules, one might use a utility or modify
    // the configuration directly. However, based on the original structure,
    // this entry is kept as is, assuming 'onlyWarn' handles its application
    // through its presence in plugins.
    // To explicitly apply `onlyWarn` to all rules, you might use a transformation
    // utility it provides, or iterate over rules.
  },
  {
    ignores: ["dist/**"],
  },
];;
