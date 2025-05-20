import {
  dirname,
  resolve as resolvePath,
} from "node:path";
import { fileURLToPath } from "node:url";

/**
 * @import { type TransformOptions } from "@babel/core";
 * @import { type Config } from "jest";
 */

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

const ROOT_DIR = __dirname;

/**
 * @satisfies {TransformOptions}
 */
const babelConfig = {
  babelrcRoots: [
    ROOT_DIR,
  ],
  configFile: resolvePath(
    ROOT_DIR,
    "babel.config.jest.mjs",
  ),
  cwd: ROOT_DIR,
  root: ROOT_DIR,
  sourceType: "unambiguous",
};

/**
 * @type {Config}
 */
const JEST_CONFIG = {
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*",
    "!src/bin/**/*",
    "!src/cli.ts",
    "!**/__tests__/**/*",
  ],
  extensionsToTreatAsEsm: [
    ".ts",
    ".mts",
    ".tsx",
    ".jsx",
    ".mtsx",
    ".mjsx",
  ],
  moduleFileExtensions: [
    "ts",
    "js",
    "mts",
    "mjs",
    "cts",
    "cjs",
    "tsx",
    "jsx",
    "mtsx",
    "mjsx",
    "ctsx",
    "cjsx",
    "json",
    "node",
  ],
  testPathIgnorePatterns: [
    /[\\/]dist[\\/]/iu.source,
    /[\\/]node_modules[\\/]/iu.source,
  ],
  testRegex: [
    /\.test\.[cm]?[jt]s[x]?$/iu.source,
  ],
  transform: {
    [/\.[cm]?[jt]s[x]?$/iu.source]: [
      "babel-jest",
      babelConfig,
    ],
  },
};

export default JEST_CONFIG;
