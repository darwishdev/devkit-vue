module.exports = {
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser", // or "babel-eslint" if you prefer
    extraFileExtensions: [".vue"],
  },
  plugins: ["vue"],
  extends: [
    "plugin:vue/vue3-recommended",
    // …any other extends you use
  ],
  rules: {
    // error if <template v-for="…"> doesn’t specify a :key
    "vue/require-v-for-key": "error",
  },
};
