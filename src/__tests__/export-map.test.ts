import { jest } from "@jest/globals";

import type { Config } from "../config";
import { type Context, type ContextResolutionOptions, resolveContext } from "../context";
import { generateExportMapByContext } from "../export-map";
import type { CustomFileSystem } from "../fs";
import { createCJSPreset } from "../presets/cjs";
import { createDTSPreset } from "../presets/dts";
import { createESMPreset } from "../presets/esm";
import { createJSPreset } from "../presets/js";
import { createPackageJSONPreset } from "../presets/package-json";
import { createStandardPreset } from "../presets/standard";

import { TEST_DATA_TREES_DIRECTORY_PATH } from "./__constants__/paths";
import { TREE_1_FS } from "./__data__/trees/tree-1";
import { TREE_2_FS } from "./__data__/trees/tree-2";

async function resolveTree1Context(
  options?: ContextResolutionOptions | null,
): Promise<Context>
{
  options ??= {};

  return await resolveContext({
    config: {
      ...options.config,
      fs: TREE_1_FS as unknown as CustomFileSystem,
      presets: [
        createStandardPreset({
          updater: {
            backup: true,
          },
        }),
        createJSPreset({
          dist: {
            path: "lib",
          },
          src: {
            path: "lib",
          },
        }),
        createPackageJSONPreset(),
        ...(options.config?.presets ?? []),
      ],
    },
    cwd: TEST_DATA_TREES_DIRECTORY_PATH,
  });
}

describe(
  "generateExportMapByContext",
  () =>
  {
    it(
      "should trigger handleEntry methods of the extensions",
      async () =>
      {
        const handleEntryFn = jest.fn();

        const config: Config = {
          extensions: [
            {
              handleEntry: handleEntryFn,
            },
          ],
        };

        const context = await resolveTree1Context({
          config,
        });

        await generateExportMapByContext(context);

        expect(handleEntryFn).toHaveBeenCalled();
      },
    );

    it(
      "should trigger handleEntryByDirentRef methods of the extensions",
      async () =>
      {
        const handleEntryByDirentRefFn = jest.fn();

        const config: Config = {
          extensions: [
            {
              handleEntryByDirentRef: handleEntryByDirentRefFn,
            },
          ],
        };

        const context = await resolveTree1Context({
          config,
        });

        await generateExportMapByContext(context);

        expect(handleEntryByDirentRefFn).toHaveBeenCalled();
      },
    );

    it(
      "should trigger aggregateExportMap methods of the extensions",
      async () =>
      {
        const aggregateExportMapFn = jest.fn();

        const config: Config = {
          extensions: [
            {
              aggregateExportMap: aggregateExportMapFn,
            },
          ],
        };

        const context = await resolveTree1Context({
          config,
        });

        await generateExportMapByContext(context);

        expect(aggregateExportMapFn).toHaveBeenCalled();
      },
    );

    it(
      "should trigger reportExportMap methods of the extensions",
      async () =>
      {
        const reportExportMapFn = jest.fn();

        const config: Config = {
          extensions: [
            {
              reportExportMap: reportExportMapFn,
            },
          ],
        };

        const context = await resolveTree1Context({
          config,
        });

        await generateExportMapByContext(context);

        expect(reportExportMapFn).toHaveBeenCalled();
      },
    );

    it(
      "should generate export map for a tree with nested directories containing JS files",
      async () =>
      {
        const context = await resolveTree1Context();

        const exportMap = await generateExportMapByContext(context);

        const expected = {
          /* eslint-disable perfectionist/sort-objects */
          "./a/b.cjs": {
            import: "./lib/a/b.js",
            require: "./lib/a/b.js",
            default: "./lib/a/b.js",
          },
          "./a/b.js": {
            import: "./lib/a/b.js",
            require: "./lib/a/b.js",
            default: "./lib/a/b.js",
          },
          "./a/b.mjs": {
            import: "./lib/a/b.js",
            require: "./lib/a/b.js",
            default: "./lib/a/b.js",
          },
          "./a/b/c.cjs": {
            import: "./lib/a/b/c.js",
            require: "./lib/a/b/c.js",
            default: "./lib/a/b/c.js",
          },
          "./a/b/c.js": {
            import: "./lib/a/b/c.js",
            require: "./lib/a/b/c.js",
            default: "./lib/a/b/c.js",
          },
          "./a/b/c.mjs": {
            import: "./lib/a/b/c.js",
            require: "./lib/a/b/c.js",
            default: "./lib/a/b/c.js",
          },
          "./a/b/c/d.cjs": {
            import: "./lib/a/b/c/d.js",
            require: "./lib/a/b/c/d.js",
            default: "./lib/a/b/c/d.js",
          },
          "./a/b/c/d.js": {
            import: "./lib/a/b/c/d.js",
            require: "./lib/a/b/c/d.js",
            default: "./lib/a/b/c/d.js",
          },
          "./a/b/c/d.mjs": {
            import: "./lib/a/b/c/d.js",
            require: "./lib/a/b/c/d.js",
            default: "./lib/a/b/c/d.js",
          },
          "./a/b/c/d": {
            import: "./lib/a/b/c/d.js",
            require: "./lib/a/b/c/d.js",
            default: "./lib/a/b/c/d.js",
          },
          "./a/b/c": {
            import: "./lib/a/b/c.js",
            require: "./lib/a/b/c.js",
            default: "./lib/a/b/c.js",
          },
          "./a/b": {
            import: "./lib/a/b.js",
            require: "./lib/a/b.js",
            default: "./lib/a/b.js",
          },
          "./a/c.cjs": {
            import: "./lib/a/c.js",
            require: "./lib/a/c.js",
            default: "./lib/a/c.js",
          },
          "./a/c.js": {
            import: "./lib/a/c.js",
            require: "./lib/a/c.js",
            default: "./lib/a/c.js",
          },
          "./a/c.mjs": {
            import: "./lib/a/c.js",
            require: "./lib/a/c.js",
            default: "./lib/a/c.js",
          },
          "./a/c": {
            import: "./lib/a/c.js",
            require: "./lib/a/c.js",
            default: "./lib/a/c.js",
          },
          "./package.json": {
            default: "./package.json",
          },
          /* eslint-enable perfectionist/sort-objects */
        };

        expect(exportMap).toStrictEqual(expected);
        expect(Object.keys(exportMap)).toStrictEqual(Object.keys(expected));
      },
    );

    it(
      "should generate export map for a tree with nested directories containing CJS/ESM/DTS files",
      async () =>
      {
        const context = await resolveContext({
          config: {
            fs: TREE_2_FS as unknown as CustomFileSystem,
            presets: [
              createStandardPreset({
                updater: {
                  backup: true,
                },
              }),
              createDTSPreset({
                src: {
                  extension: ".ts",
                },
              }),
              createCJSPreset({
                src: {
                  extension: ".ts",
                },
              }),
              createESMPreset({
                src: {
                  extension: ".ts",
                },
              }),
              createPackageJSONPreset(),
            ],
          },
          cwd: TEST_DATA_TREES_DIRECTORY_PATH,
        });

        const exportMap = await generateExportMapByContext(context);

        const expected = {
          /* eslint-disable perfectionist/sort-objects */
          "./a/b.cjs": {
            types: "./dist/types/a/b.d.ts",
            import: "./dist/esm/a/b.mjs",
            require: "./dist/cjs/a/b.cjs",
            default: "./src/a/b.ts",
          },
          "./a/b.d.ts": {
            types: "./dist/types/a/b.d.ts",
            default: "./src/a/b.ts",
          },
          "./a/b.js": {
            types: "./dist/types/a/b.d.ts",
            import: "./dist/esm/a/b.mjs",
            require: "./dist/cjs/a/b.cjs",
            default: "./src/a/b.ts",
          },
          "./a/b.mjs": {
            types: "./dist/types/a/b.d.ts",
            import: "./dist/esm/a/b.mjs",
            require: "./dist/cjs/a/b.cjs",
            default: "./src/a/b.ts",
          },
          "./a/b/c.cjs": {
            types: "./dist/types/a/b/c.d.ts",
            import: "./dist/esm/a/b/c.mjs",
            require: "./dist/cjs/a/b/c.cjs",
            default: "./src/a/b/c.ts",
          },
          "./a/b/c.d.ts": {
            types: "./dist/types/a/b/c.d.ts",
            default: "./src/a/b/c.ts",
          },
          "./a/b/c.js": {
            types: "./dist/types/a/b/c.d.ts",
            import: "./dist/esm/a/b/c.mjs",
            require: "./dist/cjs/a/b/c.cjs",
            default: "./src/a/b/c.ts",
          },
          "./a/b/c.mjs": {
            types: "./dist/types/a/b/c.d.ts",
            import: "./dist/esm/a/b/c.mjs",
            require: "./dist/cjs/a/b/c.cjs",
            default: "./src/a/b/c.ts",
          },
          "./a/b/c/d.cjs": {
            types: "./dist/types/a/b/c/d.d.ts",
            import: "./dist/esm/a/b/c/d.mjs",
            require: "./dist/cjs/a/b/c/d.cjs",
            default: "./src/a/b/c/d.ts",
          },
          "./a/b/c/d.d.ts": {
            types: "./dist/types/a/b/c/d.d.ts",
            default: "./src/a/b/c/d.ts",
          },
          "./a/b/c/d.js": {
            types: "./dist/types/a/b/c/d.d.ts",
            import: "./dist/esm/a/b/c/d.mjs",
            require: "./dist/cjs/a/b/c/d.cjs",
            default: "./src/a/b/c/d.ts",
          },
          "./a/b/c/d.mjs": {
            types: "./dist/types/a/b/c/d.d.ts",
            import: "./dist/esm/a/b/c/d.mjs",
            require: "./dist/cjs/a/b/c/d.cjs",
            default: "./src/a/b/c/d.ts",
          },
          "./a/b/c/d": {
            types: "./dist/types/a/b/c/d.d.ts",
            import: "./dist/esm/a/b/c/d.mjs",
            require: "./dist/cjs/a/b/c/d.cjs",
            default: "./src/a/b/c/d.ts",
          },
          "./a/b/c": {
            types: "./dist/types/a/b/c.d.ts",
            import: "./dist/esm/a/b/c.mjs",
            require: "./dist/cjs/a/b/c.cjs",
            default: "./src/a/b/c.ts",
          },
          "./a/b": {
            types: "./dist/types/a/b.d.ts",
            import: "./dist/esm/a/b.mjs",
            require: "./dist/cjs/a/b.cjs",
            default: "./src/a/b.ts",
          },
          "./a/c.cjs": {
            types: "./dist/types/a/c.d.ts",
            import: "./dist/esm/a/c.mjs",
            require: "./dist/cjs/a/c.cjs",
            default: "./src/a/c.ts",
          },
          "./a/c.d.ts": {
            types: "./dist/types/a/c.d.ts",
            default: "./src/a/c.ts",
          },
          "./a/c.js": {
            types: "./dist/types/a/c.d.ts",
            import: "./dist/esm/a/c.mjs",
            require: "./dist/cjs/a/c.cjs",
            default: "./src/a/c.ts",
          },
          "./a/c.mjs": {
            types: "./dist/types/a/c.d.ts",
            import: "./dist/esm/a/c.mjs",
            require: "./dist/cjs/a/c.cjs",
            default: "./src/a/c.ts",
          },
          "./a/c": {
            types: "./dist/types/a/c.d.ts",
            import: "./dist/esm/a/c.mjs",
            require: "./dist/cjs/a/c.cjs",
            default: "./src/a/c.ts",
          },
          "./package.json": {
            default: "./package.json",
          },
          /* eslint-enable perfectionist/sort-objects */
        };

        expect(exportMap).toStrictEqual(expected);
        expect(Object.keys(exportMap)).toStrictEqual(Object.keys(expected));
      },
    );
  },
);
