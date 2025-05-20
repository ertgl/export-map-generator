import {
  type Config,
  type ConfigProviderContext,
  defineConfig,
} from "../../../config";

export const SAMPLE_CONFIG_FUNCTION_ASYNC = defineConfig(
  async (
    context: ConfigProviderContext,
  // eslint-disable-next-line @typescript-eslint/require-await
  ): Promise<Config> =>
  {
    return {
      sample: {
        async: true,
      },
    };
  },
);

export default SAMPLE_CONFIG_FUNCTION_ASYNC;
