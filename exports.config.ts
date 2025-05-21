import defineConfig from "export-map-generator/config";
import cjs from "export-map-generator/presets/cjs";
import dts from "export-map-generator/presets/dts";
import esm from "export-map-generator/presets/esm";
import packageJSON from "export-map-generator/presets/package-json";
import standard from "export-map-generator/presets/standard";

const EXPORTS_CONFIG = defineConfig({
  presets: [
    standard({
      updater: {
        safe: true,
      },
    }),

    packageJSON(),

    dts({
      src: {
        extension: ".ts",
      },
    }),

    cjs({
      src: {
        extension: ".ts",
      },
    }),

    esm({
      src: {
        extension: ".ts",
      },
    }),
  ],
});

export default EXPORTS_CONFIG;
