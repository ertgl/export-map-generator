import { TEST_DATA_TREES_DIRECTORY_PATH } from "../../__tests__/__constants__/paths";
import { TREE_1_FS } from "../../__tests__/__data__/trees/tree-1";
import { resolveContext } from "../../context";
import { generateExportMapByContext } from "../../export-map";
import type { CustomFileSystem } from "../../fs";
import { resolvePath } from "../../path";
import { createPackageJSONUpdaterExtension } from "../updater";

describe(
  "PackageJSONUpdaterExtension",
  () =>
  {
    it(
      "should respect the specified `trailingNewLine` option (auto)",
      async () =>
      {
        const context = await resolveContext({
          config: {
            extensions: [
              createPackageJSONUpdaterExtension({
                trailingNewLine: "auto",
              }),
            ],
            fs: TREE_1_FS as unknown as CustomFileSystem,
          },
          cwd: TEST_DATA_TREES_DIRECTORY_PATH,
        });

        await generateExportMapByContext(context);

        const packageJSONFilePath = resolvePath(
          TEST_DATA_TREES_DIRECTORY_PATH,
          "package.json",
        );

        const packageJSONFileContent = await TREE_1_FS.promises.readFile(
          packageJSONFilePath,
          "utf-8",
        ) as string;

        expect(
          packageJSONFileContent.endsWith(
            "}\n",
          ),
        ).toBe(
          true,
        );
      },
    );

    it(
      "should respect the specified `trailingNewLine` option (false)",
      async () =>
      {
        const context = await resolveContext({
          config: {
            extensions: [
              createPackageJSONUpdaterExtension({
                trailingNewLine: false,
              }),
            ],
            fs: TREE_1_FS as unknown as CustomFileSystem,
          },
          cwd: TEST_DATA_TREES_DIRECTORY_PATH,
        });

        await generateExportMapByContext(context);

        const packageJSONFilePath = resolvePath(
          TEST_DATA_TREES_DIRECTORY_PATH,
          "package.json",
        );

        const packageJSONFileContent = await TREE_1_FS.promises.readFile(
          packageJSONFilePath,
          "utf-8",
        ) as string;

        expect(
          packageJSONFileContent.endsWith(
            "}",
          ),
        ).toBe(
          true,
        );
      },
    );

    it(
      "should respect the specified `trailingNewLine` option (true)",
      async () =>
      {
        const context = await resolveContext({
          config: {
            extensions: [
              createPackageJSONUpdaterExtension({
                trailingNewLine: true,
              }),
            ],
            fs: TREE_1_FS as unknown as CustomFileSystem,
          },
          cwd: TEST_DATA_TREES_DIRECTORY_PATH,
        });

        await generateExportMapByContext(context);

        const packageJSONFilePath = resolvePath(
          TEST_DATA_TREES_DIRECTORY_PATH,
          "package.json",
        );

        const packageJSONFileContent = await TREE_1_FS.promises.readFile(
          packageJSONFilePath,
          "utf-8",
        ) as string;

        expect(
          packageJSONFileContent.endsWith(
            "}\n",
          ),
        ).toBe(
          true,
        );
      },
    );
  },
);
