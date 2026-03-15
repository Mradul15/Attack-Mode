import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),

  // ── Architecture guardrail: block lib/mock/* imports ──
  // ONLY lib/repositories/mockData.ts may import lib/mock/*.
  // All other code (including lib/api/, lib/auth/) uses the mockData gateway.
  // Test files are exempt.
  //
  // Two catch-all patterns cover ALL import depths/forms:
  //   **/lib/mock/**  — any path with lib/mock/ anywhere in it
  //   **/mock/*       — sibling-relative from inside lib/ (e.g. ../mock/foo)
  {
    name: "no-direct-mock-imports",
    files: [
      "app/**/*.ts",
      "app/**/*.tsx",
      "lib/**/*.ts",
      "lib/**/*.tsx",
    ],
    ignores: [
      "lib/repositories/mockData.ts",
      "**/__tests__/**",
      "**/*.test.ts",
      "**/*.test.tsx",
    ],
    rules: {
      "no-restricted-imports": ["error", {
        patterns: [
          {
            group: ["**/lib/mock/**", "**/lib/mock/*"],
            message:
              "Do not import lib/mock/* directly. Use @/lib/repositories/mockData instead.",
          },
          {
            group: ["**/mock/*", "**/mock/**"],
            message:
              "Do not import mock/* via relative path. Use @/lib/repositories/mockData instead.",
          },
          {
            group: ["@/lib/mock/*", "@/lib/mock/**"],
            message:
              "Do not import @/lib/mock/* directly. Use @/lib/repositories/mockData instead.",
          },
        ],
      }],
    },
  },

  // ── Allow _-prefixed unused params (stub placeholder convention) ──
  {
    name: "unused-var-underscores",
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      }],
    },
  },
]);

export default eslintConfig;

