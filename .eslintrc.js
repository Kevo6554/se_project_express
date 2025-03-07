module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: ["eslint:reccomend", "airbnb-base", "prettier"],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    camelcase: ["error", { allow: ["_id"] }],
    "no-console": ["warn", { allow: ["error"] }],
  },
};
