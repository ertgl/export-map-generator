import {
  createFsFromVolume,
  type DirectoryJSON,
  Volume,
} from "memfs";

import { TEST_DATA_TREES_DIRECTORY_PATH } from "../../__constants__/paths";

export const TREE_2_DIRENTS = {
  [`${TEST_DATA_TREES_DIRECTORY_PATH}/dist/cjs/a/b.cjs`]: "",
  [`${TEST_DATA_TREES_DIRECTORY_PATH}/dist/cjs/a/b/c.cjs`]: "",
  [`${TEST_DATA_TREES_DIRECTORY_PATH}/dist/cjs/a/b/c/d.cjs`]: "",
  [`${TEST_DATA_TREES_DIRECTORY_PATH}/dist/cjs/a/c.cjs`]: "",
  [`${TEST_DATA_TREES_DIRECTORY_PATH}/dist/esm/a/b.mjs`]: "",
  [`${TEST_DATA_TREES_DIRECTORY_PATH}/dist/esm/a/b/c.mjs`]: "",
  [`${TEST_DATA_TREES_DIRECTORY_PATH}/dist/esm/a/b/c/d.mjs`]: "",
  [`${TEST_DATA_TREES_DIRECTORY_PATH}/dist/esm/a/c.mjs`]: "",
  [`${TEST_DATA_TREES_DIRECTORY_PATH}/dist/types/a/b.d.ts`]: "",
  [`${TEST_DATA_TREES_DIRECTORY_PATH}/dist/types/a/b/c.d.ts`]: "",
  [`${TEST_DATA_TREES_DIRECTORY_PATH}/dist/types/a/b/c/d.d.ts`]: "",
  [`${TEST_DATA_TREES_DIRECTORY_PATH}/dist/types/a/c.d.ts`]: "",
  [`${TEST_DATA_TREES_DIRECTORY_PATH}/package.json`]: "{}",
  [`${TEST_DATA_TREES_DIRECTORY_PATH}/src/a/b.ts`]: "",
  [`${TEST_DATA_TREES_DIRECTORY_PATH}/src/a/b/c.ts`]: "",
  [`${TEST_DATA_TREES_DIRECTORY_PATH}/src/a/b/c/d.ts`]: "",
  [`${TEST_DATA_TREES_DIRECTORY_PATH}/src/a/c.ts`]: "",
} as const satisfies DirectoryJSON;

export const TREE_2_VOLUME = Volume.fromJSON(
  TREE_2_DIRENTS,
);

export const TREE_2_FS = createFsFromVolume(
  TREE_2_VOLUME,
);
