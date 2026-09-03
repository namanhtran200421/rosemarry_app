const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: [".expo/**", "android/**", "dist/**", "ios/**"],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      "max-lines": ["error", { max: 300, skipBlankLines: true, skipComments: true }],
    },
  },
  {
    files: ["src/shared/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["**/application/**", "**/features/**"],
              message:
                "Shared code must stay independent of application and feature code.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/features/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["**/application/**"],
              message: "Feature code must not depend on the application shell.",
            },
          ],
        },
      ],
    },
  },
]);
