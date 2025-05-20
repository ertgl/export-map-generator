import {
  type Config,
  type ConfigProviderContext,
  defineConfig,
} from "../../../config";

export const SAMPLE_CONFIG_FUNCTION_SYNC = defineConfig(
  (
    context: ConfigProviderContext,
  ): Config =>
  {
    return {
      sample: {
        sync: true,
      },
    };
  },
);

export default SAMPLE_CONFIG_FUNCTION_SYNC;
