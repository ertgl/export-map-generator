import {
  dirname,
  resolve as resolvePath,
} from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

export const CWD = process.cwd();

export const TESTS_DIRECTORY_PATH = dirname(__dirname);

export const TEST_DATA_DIRECTORY_PATH = resolvePath(
  TESTS_DIRECTORY_PATH,
  "__data__",
);

export const TEST_DATA_CONFIGS_DIRECTORY_PATH = resolvePath(
  TEST_DATA_DIRECTORY_PATH,
  "configs",
);

export const TEST_DATA_TREES_DIRECTORY_PATH = resolvePath(
  TEST_DATA_DIRECTORY_PATH,
  "trees",
);
