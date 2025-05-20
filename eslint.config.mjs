import {
  dirname,
  relative as getRelativePath,
  join as joinPaths,
  resolve as resolvePath,
} from "node:path";
import { fileURLToPath } from "node:url";

import cspellPlugin from "@cspell/eslint-plugin";
import javascriptPlugin from "@eslint/js";
import jsonPlugin from "@eslint/json";
import markdownPlugin from "@eslint/markdown";
import stylisticPlugin from "@stylistic/eslint-plugin";
import jestPlugin from "eslint-plugin-jest";
import perfectionistPlugin from "eslint-plugin-perfectionist";
import ymlPlugin from "eslint-plugin-yml";
import globals from "globals";
import JEST_PACKAGE_JSON from "jest/package.json" with { type: "json" };
import typescriptPlugin from "typescript-eslint";

/**
 * @import { type StylisticCustomizeOptions } from "@stylistic/eslint-plugin";
 * @import { type Linter } from "eslint";
 * @import { type Config } from "typescript-eslint";
 */

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

const PATTERN_ALL = "**/*";

const PATTERN_CJS_JS_MJS = "**/*.{cjs,js,mjs}";

const PATTERN_CJSX_JSX_MJSX = `${PATTERN_CJS_JS_MJS}x`;

const PATTERN_CTS_MTS_TS = "**/*.{cts,mts,ts}";

const PATTERN_CTSX_MTSX_TSX = `${PATTERN_CTS_MTS_TS}x`;

const PATTERN_CJS_CJSX_CTS_CTSX = `**/*.{cjs,cjsx,cts,ctsx}`;

const PATTERN_TEST_CJS_CJSX_CTS_CTSX = `**/*.test.{cjs,cjsx,cts,ctsx}`;

const PATTERN_JS_JSX_TS_TSX = `**/*.{js,jsx,ts,tsx}`;

const PATTERN_TEST_JS_JSX_TS_TSX = `**/*.test.{js,jsx,ts,tsx}`;

const PATTERN_MJS_MJSX_MTS_MTSX = `**/*.{mjs,mjsx,mts,mtsx}`;

const PATTERN_TEST_MJS_MJSX_MTS_MTSX = `**/*.test.{mjs,mjsx,mts,mtsx}`;

const PATTERN_JSON = "**/*.json";

const PATTERN_MD = "**/*.md";

const PATTERN_YAML_YML = "**/*.{yaml,yml}";

/**
 * @type {Linter.Config["languageOptions"]}
 */
const eslintBaseLanguageOptions = {
  parserOptions: {
    projectService: true,
    tsconfigRootDir: __dirname,
    warnOnUnsupportedTypeScriptVersion: false,
  },
};

/**
 * @type {StylisticCustomizeOptions}
 */
const stylisticBaseCustomizationOptions = {
  arrowParens: true,
  blockSpacing: true,
  braceStyle: "allman",
  commaDangle: "always-multiline",
  indent: 2,
  jsx: false,
  quoteProps: "consistent-as-needed",
  quotes: "double",
  semi: true,
};

/**
 * @type {Config}
 */
export default typescriptPlugin.config([
  {
    files: [
      PATTERN_ALL,
    ],
    plugins: {
      "@cspell": cspellPlugin,
    },
    rules: {
      "@cspell/spellchecker": [
        "warn",
        {
          autoFix: false,
          checkComments: true,
          checkIdentifiers: true,
          checkJSXText: true,
          checkStrings: true,
          checkStringTemplates: true,
          configFile: resolvePath(
            __dirname,
            "cspell.config.yaml",
          ),
          generateSuggestions: true,
          ignoreImportProperties: false,
          ignoreImports: false,
          numSuggestions: Infinity,
        },
      ],
    },
  },

  {
    ...javascriptPlugin.configs.recommended,
    files: [
      PATTERN_CJS_JS_MJS,
      PATTERN_CJSX_JSX_MJSX,
    ],
  },

  {
    files: [
      PATTERN_CJS_JS_MJS,
      PATTERN_CJSX_JSX_MJSX,
    ],
    rules: {
      "no-unused-vars": [
        "warn",
        {
          args: "none",
        },
      ],
    },
  },

  ...typescriptPlugin.configs.strictTypeChecked.map(
    (config) =>
    {
      return {
        ...config,
        files: [
          PATTERN_CJS_CJSX_CTS_CTSX,
          PATTERN_JS_JSX_TS_TSX,
          PATTERN_MJS_MJSX_MTS_MTSX,
        ],
      };
    },
  ),

  {
    files: [
      PATTERN_CJS_CJSX_CTS_CTSX,
      PATTERN_JS_JSX_TS_TSX,
      PATTERN_MJS_MJSX_MTS_MTSX,
    ],
    rules: {
      "@typescript-eslint/ban-ts-comment": "warn",
      "@typescript-eslint/no-empty-object-type": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unnecessary-type-parameters": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          args: "none",
        },
      ],
    },
  },

  {
    files: [
      PATTERN_CJS_CJSX_CTS_CTSX,
    ],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },

  {
    files: [
      PATTERN_CJS_JS_MJS,
      PATTERN_CTS_MTS_TS,
    ],
    languageOptions: {
      ...eslintBaseLanguageOptions,
    },
  },

  {
    files: [
      PATTERN_CJSX_JSX_MJSX,
      PATTERN_CTSX_MTSX_TSX,
    ],
    languageOptions: {
      ...eslintBaseLanguageOptions,
      parserOptions: {
        ...eslintBaseLanguageOptions.parserOptions,
        ecmaFeatures: {
          ...eslintBaseLanguageOptions.parserOptions?.ecmaFeatures,
          jsx: true,
        },
      },
    },
  },

  {
    files: [
      PATTERN_CJS_CJSX_CTS_CTSX,
    ],
    languageOptions: {
      globals: {
        ...globals.builtin,
        ...globals.commonjs,
        ...globals.node,
        ...globals.nodeBuiltin,
      },
    },
  },

  {
    files: [
      PATTERN_JS_JSX_TS_TSX,
    ],
    languageOptions: {
      globals: {
        ...globals.builtin,
        ...globals.commonjs,
        ...globals.es2025,
      },
    },
  },

  {
    files: [
      PATTERN_MJS_MJSX_MTS_MTSX,
    ],
    languageOptions: {
      globals: {
        ...globals.builtin,
        ...globals.es2025,
      },
    },
  },

  {
    ...jestPlugin.configs["flat/recommended"],
    files: [
      `__tests__/${PATTERN_TEST_CJS_CJSX_CTS_CTSX}`,
      `__tests__/${PATTERN_TEST_JS_JSX_TS_TSX}`,
      `__tests__/${PATTERN_TEST_MJS_MJSX_MTS_MTSX}`,
    ],
  },

  {
    settings: {
      jest: {
        version: JEST_PACKAGE_JSON.version,
      },
    },
  },

  {
    ...stylisticPlugin.configs.customize({
      ...stylisticBaseCustomizationOptions,
    }),
    files: [
      PATTERN_CJS_JS_MJS,
      PATTERN_CTS_MTS_TS,
    ],
  },

  {
    ...stylisticPlugin.configs.customize({
      ...stylisticBaseCustomizationOptions,
      jsx: true,
    }),
    files: [
      PATTERN_CJSX_JSX_MJSX,
      PATTERN_CTSX_MTSX_TSX,
    ],
  },

  {
    ...perfectionistPlugin.configs["recommended-natural"],
    files: [
      PATTERN_CJS_CJSX_CTS_CTSX,
      PATTERN_JS_JSX_TS_TSX,
      PATTERN_MJS_MJSX_MTS_MTSX,
    ],
  },

  {
    files: [
      PATTERN_CJS_CJSX_CTS_CTSX,
      PATTERN_JS_JSX_TS_TSX,
      PATTERN_MJS_MJSX_MTS_MTSX,
    ],
    rules: {
      "perfectionist/sort-imports": [
        "error",
        {
          customGroups: {
            type: {
              "node-type": /^node:.+$/iu.source,
            },
            value: {
              node: /^node:.+$/iu.source,
            },
          },
          groups: [
            [
              "node-type",
              "node",
              "builtin",
            ],
            [
              "type",
              "external",
            ],
            [
              "internal-type",
              "internal",
            ],
            [
              "parent-type",
              "parent",
            ],
            [
              "sibling-type",
              "sibling",
            ],
            [
              "index-type",
              "index",
            ],
            ["object"],
            ["unknown"],
          ],
          ignoreCase: false,
          internalPattern: [
            /^export-map-generator(?:[\\/].*)?$/iu.source,
          ],
          newlinesBetween: "always",
          tsconfigRootDir: __dirname,
        },
      ],
    },
  },

  {
    ...jsonPlugin.configs.recommended,
    files: [
      PATTERN_JSON,
    ],
    language: "json/json",
  },

  ...markdownPlugin.configs.recommended.map(
    (
      /**
       * @type {Record<string, unknown>}
       */
      config,
    ) =>
    {
      return {
        ...config,
        files: [
          PATTERN_MD,
        ],
        language: "markdown/gfm",
      };
    },
  ),

  ...ymlPlugin.configs["flat/recommended"].map(
    (config) =>
    {
      return {
        ...config,
        files: [
          PATTERN_YAML_YML,
        ],
      };
    },
  ),

  {
    files: [
      PATTERN_YAML_YML,
    ],
    rules: {
      "yml/no-empty-mapping-value": "off",
    },
  },

  {
    ignores: [
      resolvePath(__dirname, ".husky", "_"),
      resolvePath(__dirname, ".yarn"),
      resolvePath(__dirname, "dist"),
      resolvePath(__dirname, "node_modules"),
    ].map(
      (absoluteIgnorePath) =>
      {
        return joinPaths(
          getRelativePath(__dirname, absoluteIgnorePath),
          "**",
          "*",
        );
      },
    ),
  },
]);
