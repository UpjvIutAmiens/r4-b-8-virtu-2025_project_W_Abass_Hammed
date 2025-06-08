import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import stylisticTs from "@stylistic/eslint-plugin-ts";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";
import pluginJsdoc from "eslint-plugin-jsdoc";
import tseslint from "typescript-eslint";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const ignores = fs
  .readFileSync(path.join(__dirname, ".eslint-ignore"), "utf-8")
  .toString()
  .split(/\r?\n/) // Correctly splits by newline characters (cross-platform)
  .filter((line) => line && !line.startsWith("#"));

export default tseslint.config(
  importPlugin.flatConfigs.recommended,
  ...compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ),
  {
    ignores,
  },
  {
    languageOptions: {
      parser: tseslint.parser,
    },
    rules: {
      "constructor-super": "warn",
      curly: "warn",
      eqeqeq: "warn",
      "prefer-const": [
        "warn",
        {
          destructuring: "all",
        },
      ],
      "no-buffer-constructor": "warn",
      "no-caller": "warn",
      "no-case-declarations": "warn",
      "no-debugger": "warn",
      "no-duplicate-case": "warn",
      "no-duplicate-imports": "warn",
      "no-eval": "warn",
      "no-async-promise-executor": "warn",
      "no-extra-semi": "warn",
      "no-new-wrappers": "warn",
      "no-sparse-arrays": "warn",
      "no-throw-literal": "warn",
      "no-unsafe-finally": "warn",
      "no-unused-labels": "warn",
      "no-misleading-character-class": "warn",
      "no-restricted-globals": [
        "warn",
        "name",
        "length",
        "event",
        "closed",
        "external",
        "status",
        "origin",
        "orientation",
        "context",
      ],
      "no-var": "warn",
      semi: "off",
    },
  },
  // TS
  {
    files: ["**/*.{ts}"],
    languageOptions: {
      parser: tseslint.parser,
    },
    plugins: {
      "@stylistic/ts": stylisticTs,
      "@typescript-eslint": tseslint.plugin,
      jsdoc: pluginJsdoc,
    },
    rules: {
      "@stylistic/ts/semi": "warn",
      "@stylistic/ts/member-delimiter-style": "warn",
      "jsdoc/no-types": "warn",
    },
  },
  {
    plugins: {
      "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2020,
      sourceType: "module",

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    rules: {
      "import/no-dynamic-require": "warn",
      "import/no-cycle": "error",
      "import/no-unresolved": "off",
      "@typescript-eslint/no-explicit-any": "off",

      "no-console": [
        "error",
        {
          allow: ["warn", "error"],
        },
      ],

      curly: "warn",
      eqeqeq: "error",
      "no-eq-null": "error",
      "no-use-before-define": ["error", "nofunc"],

      "brace-style": [
        "error",
        "1tbs",
        {
          allowSingleLine: true,
        },
      ],

      "comma-dangle": ["error", "always-multiline"],
      "comma-spacing": "error",
      "comma-style": "error",
      "func-call-spacing": "error",

      indent: [
        "error",
        2,
        {
          SwitchCase: 1,
          MemberExpression: 1,
        },
      ],

      "key-spacing": [
        "error",
        {
          mode: "minimum",
        },
      ],

      "keyword-spacing": "error",
      "object-curly-spacing": ["error", "always"],
      "one-var": ["error", "never"],

      quotes: [
        "error",
        "single",
        {
          allowTemplateLiterals: true,
        },
      ],

      semi: ["error", "always"],

      "space-before-function-paren": [
        "error",
        {
          anonymous: "never",
          named: "never",
          asyncArrow: "always",
        },
      ],

      "space-infix-ops": "error",
      "arrow-body-style": ["error", "as-needed"],
      "arrow-parens": ["error", "as-needed"],
      "arrow-spacing": "error",
      "no-duplicate-imports": "error",
      "no-useless-constructor": "error",
      "no-var": "error",
      "prefer-const": "error",
      "prefer-template": "error",
    },
  }
);
