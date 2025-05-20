import { jest } from "@jest/globals";

import type { Config } from "../config";
import {
  type Context,
  resolveContext,
} from "../context";

import { TEST_DATA_CONFIGS_DIRECTORY_PATH } from "./__constants__/paths";

describe(
  "resolveContext",
  () =>
  {
    it(
      "should omit falsy extensions specified in the config",
      async () =>
      {
        const context = await resolveContext({
          config: {
            extensions: [
              false,
              null,
              undefined,
              {
                uid: "test:sample",
              },
            ],
          },
        });

        expect(context.extensions.length).toBeGreaterThan(0);

        for (const extension of context.extensions)
        {
          expect(extension).toBeDefined();
          expect(extension).not.toBe(false);
          expect(extension).not.toBe(null);
          expect(extension).not.toBe(undefined);
        }
      },
    );

    it(
      "should omit falsy presets specified in the config",
      async () =>
      {
        const context = await resolveContext({
          config: {
            presets: [
              false,
              null,
              undefined,
              {
                augmentContext(
                  context: Context,
                  config: Config,
                ): void
                {},
              },
            ],
          },
        });

        expect(context.presets.length).toBeGreaterThan(0);

        for (const preset of context.presets)
        {
          expect(preset).toBeDefined();
          expect(preset).not.toBe(false);
          expect(preset).not.toBe(null);
          expect(preset).not.toBe(undefined);
        }
      },
    );

    it(
      "should trigger augmentContext methods of the presets",
      async () =>
      {
        const augmentContextFn = jest.fn();

        const config: Config = {
          presets: [
            {
              augmentContext: augmentContextFn,
            },
          ],
        };

        await resolveContext({
          config,
        });

        expect(
          augmentContextFn,
        ).toHaveBeenCalledTimes(
          1,
        );
      },
    );

    it(
      "should load config definition from the `configLoaderOptions`",
      async () =>
      {
        const resolveConfigFn = jest.fn();

        const config = {
          extensions: [
            {
              resolveConfig: resolveConfigFn,
              uid: "test:sample",
            },
          ],
        };

        const context = await resolveContext({
          configLoaderOptions: {
            configDefinition: (configContext) =>
            {
              expect(
                configContext.cwd,
              ).toBe(
                TEST_DATA_CONFIGS_DIRECTORY_PATH,
              );

              return config;
            },
          },
          cwd: TEST_DATA_CONFIGS_DIRECTORY_PATH,
        });

        expect(resolveConfigFn).toHaveBeenCalledTimes(1);
        expect(resolveConfigFn).toHaveBeenCalledWith(
          context,
          config,
        );
      },
    );
  },
);

describe(
  "triggerContextHooks",
  () =>
  {
    it(
      "should trigger the context hooks",
      async () =>
      {
        const setupFn = jest.fn();
        const resolveConfigFn = jest.fn();
        const resolveContextFn = jest.fn();

        const config: Config = {
          extensions: [
            {
              resolveConfig: resolveConfigFn,
              resolveContext: resolveContextFn,
              setup: setupFn,
            },
          ],
        };

        const context = await resolveContext({
          config,
        });

        expect(
          setupFn,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          setupFn,
        ).toHaveBeenCalledWith(
          context,
        );

        expect(
          resolveConfigFn,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          resolveConfigFn,
        ).toHaveBeenCalledWith(
          context,
          config,
        );

        expect(
          resolveContextFn,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          resolveContextFn,
        ).toHaveBeenCalledWith(
          context,
        );
      },
    );
  },
);
