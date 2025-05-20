/**
 * @import { type TransformOptions } from "@babel/core";
 *
 * @import {
 *   type Options as ImportSourceTransformerPluginOptions,
 * } from "babel-plugin-transform-import-source";
 */

const TARGET_EXTENSION = ".mjs";

/**
 * @type {TransformOptions}
 */
module.exports = {
  presets: [
    [
      require.resolve("@babel/preset-env"),
      {
        modules: false,
      },
    ],

    [
      require.resolve("@babel/preset-typescript"),
      {},
    ],
  ],

  sourceMaps: false,
};

if (process.env.NODE_ENV !== "test")
{
  module.exports.plugins ??= [];

  /**
   * @type {ImportSourceTransformerPluginOptions}
   */
  const importSourceTransformerPluginOptions = {
    transform: {
      rules: [
        {
          find: /(?:\.[cm]?[jt]s[x]?)?$/iu,
          replace: TARGET_EXTENSION,
          resolveIndex: true,
          test: /^[.\\/]+.*$/,
        },
      ],
    },
  };

  module.exports.plugins.push(
    [
      require.resolve("babel-plugin-transform-import-source"),
      importSourceTransformerPluginOptions,
    ],
  );
}
