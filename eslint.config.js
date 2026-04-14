import js from "@eslint/js";
import svelte from "eslint-plugin-svelte";
import prettier from "eslint-config-prettier";
import svelteConfigFile from "./svelte.config.js";
import typescript from "typescript";
import tseslint from "typescript-eslint";

const svelteConfig = svelteConfigFile.default || svelteConfigFile;

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...svelte.configs["flat/recommended"],
  prettier,
  {
    files: ["**/*.svelte"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      parser: svelte.parser,
      parserOptions: {
        parser: tseslint.parser
      },
      globals: {
        browser: true,
        es2017: true,
        node: true,
        // Browser APIs
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        localStorage: "readonly",
        sessionStorage: "readonly",
        crypto: "readonly",
        fetch: "readonly",
        URL: "readonly",
        URLSearchParams: "readonly",
        // DOM types
        HTMLDivElement: "readonly",
        HTMLInputElement: "readonly",
        HTMLButtonElement: "readonly",
        HTMLAnchorElement: "readonly",
        HTMLTextAreaElement: "readonly",
        MouseEvent: "readonly",
        KeyboardEvent: "readonly",
        KeyboardEventInit: "readonly",
        InputEvent: "readonly",
        ClipboardEvent: "readonly",
        Node: "readonly",
        // Timing functions
        setTimeout: "readonly",
        setInterval: "readonly",
        clearTimeout: "readonly",
        clearInterval: "readonly",
        requestAnimationFrame: "readonly",
        cancelAnimationFrame: "readonly",
        // Encoding/Decoding
        btoa: "readonly",
        atob: "readonly",
        TextDecoder: "readonly",
        TextEncoder: "readonly",
        // User interaction
        confirm: "readonly",
        prompt: "readonly",
        alert: "readonly"
      }
    },
    settings: {
      "svelte/typescript": () => typescript,
      "svelte/ignore-styles": (attributes) =>
        attributes.some((attr) => attr.name === "lang" && attr.value === "postcss"),
      "svelte/compiler-options": {
        ...svelteConfig.compilerOptions
      }
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^(e|error|index|page)$",
          caughtErrorsIgnorePattern: "^e$"
        }
      ],
      "svelte/no-at-html-tags": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      // Relax some strict Svelte rules for this project
      "svelte/no-navigation-without-resolve": "off",
      "svelte/require-each-key": "off",
      "svelte/prefer-svelte-reactivity": "off",
      "svelte/prefer-writable-derived": "off"
    }
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: {
        browser: true,
        es2017: true,
        node: true
      }
    }
  },
  {
    files: ["**/*.test.ts", "**/*.spec.ts"],
    languageOptions: {
      globals: {
        describe: "readonly",
        it: "readonly",
        expect: "readonly",
        vi: "readonly"
      }
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^vi$" }
      ]
    }
  },
  {
    ignores: ["node_modules/", ".svelte-kit/", "build/", "dist/", "*.cjs"]
  }
];
