import { createRequire } from "node:module";

/**
 * @import { type UserConfig } from "@commitlint/types";
 */

const require = createRequire(import.meta.url);

/**
 * @type {UserConfig}
 */
export default {
  extends: [
    require.resolve("@commitlint/config-conventional"),
  ],
};
