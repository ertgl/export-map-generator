import {
  loadConfig,
  resolveConfigFilePath,
} from "../config";
import { resolvePath } from "../path";

import {
  CWD,
  TEST_DATA_CONFIGS_DIRECTORY_PATH,
} from "./__constants__/paths";

describe(
  "loadConfig",
  () =>
  {
    it(
      "should look for a config file in the specified working directory",
      async () =>
      {
        const config = await loadConfig({
          cwd: TEST_DATA_CONFIGS_DIRECTORY_PATH,
        });

        expect(
          (
            (
              config.sample as Record<string, unknown>
            ).packageJSON as Record<string, unknown>
          ),
        ).toBe(
          true,
        );
      },
    );

    it(
      "should load null config from a config file",
      async () =>
      {
        const config = await loadConfig({
          configFilePath: resolvePath(
            TEST_DATA_CONFIGS_DIRECTORY_PATH,
            "null.config.ts",
          ),
        });

        expect(config).toEqual({});
      },
    );

    it(
      "should load config from a config file exporting an async function",
      async () =>
      {
        const config = await loadConfig({
          configFilePath: resolvePath(
            TEST_DATA_CONFIGS_DIRECTORY_PATH,
            "function-async.config.ts",
          ),
        });

        expect(
          (
            (
              config.sample as Record<string, unknown>
            ).async as Record<string, unknown>
          ),
        ).toBe(
          true,
        );
      },
    );

    it(
      "should load config from a config file exporting an sync function",
      async () =>
      {
        const config = await loadConfig({
          configFilePath: resolvePath(
            TEST_DATA_CONFIGS_DIRECTORY_PATH,
            "function-sync.config.ts",
          ),
        });

        expect(
          (
            (
              config.sample as Record<string, unknown>
            ).sync as Record<string, unknown>
          ),
        ).toBe(
          true,
        );
      },
    );

    it(
      "should load config from a config file exporting an object",
      async () =>
      {
        const config = await loadConfig({
          configFilePath: resolvePath(
            TEST_DATA_CONFIGS_DIRECTORY_PATH,
            "object.config.ts",
          ),
        });

        expect(
          (
            (
              config.sample as Record<string, unknown>
            ).object as Record<string, unknown>
          ),
        ).toBe(
          true,
        );
      },
    );

    it(
      "should load config from a JSON file",
      async () =>
      {
        const config = await loadConfig({
          configFilePath: resolvePath(
            TEST_DATA_CONFIGS_DIRECTORY_PATH,
            "sample.config.json",
          ),
        });

        expect(
          (
            (
              config.sample as Record<string, unknown>
            ).json as Record<string, unknown>
          ),
        ).toBe(
          true,
        );
      },
    );

    it(
      "should load config from a YAML file",
      async () =>
      {
        const config = await loadConfig({
          configFilePath: resolvePath(
            TEST_DATA_CONFIGS_DIRECTORY_PATH,
            "sample.config.yml",
          ),
        });

        expect(
          (
            (
              config.sample as Record<string, unknown>
            ).yml as Record<string, unknown>
          ),
        ).toBe(
          true,
        );
      },
    );
  },
);

describe(
  "resolveConfigFilePath",
  () =>
  {
    it(
      "should resolve the config file path from the specified working directory",
      async () =>
      {
        const configFilePath = await resolveConfigFilePath(
          null,
          TEST_DATA_CONFIGS_DIRECTORY_PATH,
        );

        expect(
          configFilePath,
        ).toBe(
          resolvePath(
            TEST_DATA_CONFIGS_DIRECTORY_PATH,
            "package.json",
          ),
        );
      },
    );

    it(
      "should return empty string if no config file is found",
      async () =>
      {
        const configFilePath = await resolveConfigFilePath(
          null,
          "/non/existent/path",
        );

        expect(configFilePath).toBe("");
      },
    );

    it(
      "should return the config file path if it is absolute",
      async () =>
      {
        const configFilePath = resolvePath(
          TEST_DATA_CONFIGS_DIRECTORY_PATH,
          "object.config.ts",
        );

        const result = await resolveConfigFilePath(
          configFilePath,
          null,
        );

        expect(result).toBe(configFilePath);
      },
    );

    it(
      "should return the resolved config file path if it is relative",
      async () =>
      {
        const configFilePath = "config/exports.yml";

        const result = await resolveConfigFilePath(
          configFilePath,
          CWD,
        );

        expect(
          result,
        ).toBe(
          resolvePath(
            CWD,
            configFilePath,
          ),
        );
      },
    );
  },
);
