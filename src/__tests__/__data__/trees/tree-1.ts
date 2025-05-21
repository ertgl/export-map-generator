import {
  createFsFromVolume,
  type DirectoryJSON,
  Volume,
} from "memfs";

import { TEST_DATA_TREES_DIRECTORY_PATH } from "../../__constants__/paths";

export const TREE_1_DIRENTS = {
  [`${TEST_DATA_TREES_DIRECTORY_PATH}/lib/a/b.js`]: "",
  [`${TEST_DATA_TREES_DIRECTORY_PATH}/lib/a/b/c.js`]: "",
  [`${TEST_DATA_TREES_DIRECTORY_PATH}/lib/a/b/c/d.js`]: "",
  [`${TEST_DATA_TREES_DIRECTORY_PATH}/lib/a/c.js`]: "",
  [`${TEST_DATA_TREES_DIRECTORY_PATH}/package.json`]: "{}\n",
} as const satisfies DirectoryJSON;

export const TREE_1_VOLUME = Volume.fromJSON(
  TREE_1_DIRENTS,
);

export const TREE_1_FS = createFsFromVolume(
  TREE_1_VOLUME,
);
