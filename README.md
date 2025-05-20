# export-map-generator

Automates the `exports` field in `package.json` for multi-format packages by
analyzing distribution files. Declarative, extensible, and build-tool agnostic.

## Table of Contents

- [Overview](#overview)
  - [Features](#features)
- [Installation](#installation)
  - [Optional Peer Dependencies](#optional-peer-dependencies)
- [Usage](#usage)
  - [CLI Usage](#cli-usage)
  - [Programmatic API](#programmatic-api)
- [Configuration](#configuration)
- [Extensions](#extensions)
- [Presets](#presets)
  - [CJS Preset](#cjs-preset)
  - [DTS Preset](#dts-preset)
  - [ESM Preset](#esm-preset)
  - [Generic Preset](#generic-preset)
  - [Package-JSON Preset](#package-json-preset)
  - [Standard Preset](#standard-preset)
- [Practical Example](#practical-example)
- [License](#license)

## Overview

`export-map-generator` provides a plugin-oriented pipeline that allows
developers to control, extend, or override every part of the `exports` field
generation process, usually for `package.json` files.

### Features

The generator is built around several core ideas, all designed to enhance the
developer experience.

#### Convention-first, plugin-friendly

Start with presets, extend or override as needed.

<details open>
  <summary>
    <b>
      Demonstration: Using the built-in presets
    </b>
  </summary>

  ```ts
  export default defineConfig({
    presets: [
      dts(),
      cjs(),
      esm(),
      standard(),
    ],
  });
  ```
</details>

#### Output-driven

Scans the distribution folders, not the source files.

<details open>
  <summary>
    <b>
      Demonstration: Sample distribution tree structure
    </b>
  </summary>

  ```text
  dist
    ├── cjs
    │   └── array.cjs
    ├── esm
    │   └── array.mjs
    └── types
        └── array.d.ts
  ```
</details>

#### Precise path resolution

Supports CJS, ESM, DTS, hybrid modules, and more.

<details open>
  <summary>
    <b>
      Demonstration: Generated exports structure with multiple formats
    </b>
  </summary>

  ```json
  {
    "exports": {
      "./array.js": {
        "types": "./dist/types/array.d.ts",
        "import": "./dist/esm/array.mjs",
        "require": "./dist/cjs/array.cjs",
        "default": "./src/array.ts"
      }
    }
  }
  ```
</details>

#### Path conflict prevention

Resolves path ambiguities by organizing the exports in correct order.

<details>
  <summary>
    <b>
      Demonstration: Multiple import paths for the same file
    </b>
  </summary>

  ```json
  {
    "exports": {
      "./array.d.ts": {
        "types": "./dist/types/array.d.ts",
        "default": "./src/array.ts"
      },
      "./array.js": {
        "types": "./dist/types/array.d.ts",
        "import": "./dist/esm/array.mjs",
        "require": "./dist/cjs/array.cjs",
        "default": "./src/array.ts"
      },
      "./array": {
        "types": "./dist/types/array.d.ts",
        "import": "./dist/esm/array.mjs",
        "require": "./dist/cjs/array.cjs",
        "default": "./src/array.ts"
      }
    }
  }
  ```
</details>

#### Built-in support for barrel files

Detects and generates exports for barrel files (index files) in directories.

<details>
  <summary>
    <b>
      Demonstration: Barrel file detection
    </b>
  </summary>

  ```ts
  export default defineConfig({
    extensions: [
      barrel(),
    ],
  });
  ```

  ```json
  {
    "exports": {
      "./index.js": {
        "types": "./dist/types/index.d.ts",
        "import": "./dist/esm/index.mjs",
        "require": "./dist/cjs/index.cjs",
        "default": "./src/index.ts"
      },
      ".": {
        "types": "./dist/types/index.d.ts",
        "import": "./dist/esm/index.mjs",
        "require": "./dist/cjs/index.cjs",
        "default": "./src/index.ts"
      }
    }
  }
  ```
</details>

#### CLI or programmatic API

Use via terminal or integrate into custom flows.

<details>
  <summary>
    <b>
      Demonstration: CLI usage
    </b>
  </summary>

  ```sh
  ⋊> export-map-generator
  Usage: export-map-generator [options] [command]

  Options:
    -V, --version        output the version number
    --cwd <PATH>         path to the working directory
    -c, --config <PATH>  path to the configuration file
    --dry-run            preview changes without writing to disk (default: false)
    -h, --help           display help for command

  Commands:
    config               configuration commands
    context              context commands
    generate [options]   generate export map
    help [command]       display help for command
  ```
</details>

## Installation

The package is available on npm and can be installed with any compatible
package manager.

```sh
npm install --save-dev export-map-generator
```

### Optional Peer Dependencies

The library uses several optional peer dependencies to provide additional
functionality. If you encounter issues with loading the configuration or
running the CLI commands, you may need to install these dependencies.

```sh
npm install --save-dev commander cosmiconfig pretty-format
```

## Usage

By default, the generator does not include any activated functionality. This
design ensures that the export strategy remains explicit and intentional. All
logic -from analyzing directories to writing the final export map- is handled
via extensions and presets.

The library includes a set of built-in presets that can be used to quickly set
up the export map generation without needing to define everything from scratch.

### CLI Usage

The CLI provides a convenient way to interact with the generator. You can
use it to generate the export map, preview changes, and inspect the context.

To preview the changes without writing to disk, you can use the `--dry-run` and
`--stdout` options together:

```sh
export-map-generator --dry-run generate --stdout
```

**Note:** The `--stdout` option does not prevent the generator from updating the
`package.json` file. To achieve that, you need to use the `--dry-run` option.

### Programmatic API

For programmatic usage, you can import the library and use it in your scripts:

```javascript
import { resolveContext } from "export-map-generator/context";
import { generateExportMapByContext } from "export-map-generator/export-map";

const context = await resolveContext({ dryRun: true });
const exportMap = await generateExportMapByContext(context);
```

## Configuration

The generator without any configuration cannot generate an `exports` map,
this is by design to ensure that the user explicitly defines how the exports
should be structured. The configuration allows you to specify presets, plugins,
and other options to customize the export map generation process.

The configuration for `export-map-generator` can be done via these files:

- `exports.config.cjs`
- `exports.config.js`
- `exports.config.mjs` (recommended)
- `exports.config.ts` (recommended)

The configuration file should export either a default object or a function that
returns an object.

```ts
import defineConfig from "export-map-generator/config";

export default defineConfig({});
```

## Extensions

Extensions are the plugins that provide core or additional functionalities to
the generator. An extension can implement any method listed in the table below.

<table>
  <thead>
    <tr>
      <th>Method</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>setup</td>
      <td>Initialize the extension and set up any necessary state.</td>
    </tr>
    <tr>
      <td>resolveConfig</td>
      <td>Resolve the configuration for the extension.</td>
    </tr>
    <tr>
      <td>resolveContext</td>
      <td>Resolve the context for the extension.</td>
    </tr>
    <tr>
      <td>produceDirentRefs</td>
      <td>Produce directory entries (e.g. matching a pattern).</td>
    </tr>
    <tr>
      <td>produceEntriesByDirentRef</td>
      <td>Produce export-map entries based on the given directory entry.</td>
    </tr>
    <tr>
      <td>produceEntries</td>
      <td>Produce export-map entries, (e.g. additional entries).</td>
    </tr>
    <tr>
      <td>handleEntryByDirentRef</td>
      <td>Handle the entry by directory entry.</td>
    </tr>
    <tr>
      <td>handleEntry</td>
      <td>Handle the entry (any entry).</td>
    </tr>
    <tr>
      <td>aggregateExportMap</td>
      <td>
        Consolidate the generated entries and produce the final export map.
      </td>
    </tr>
    <tr>
      <td>sortExportMap</td>
      <td>Sort the export map entries (e.g. to avoid conflicts).</td>
    </tr>
    <tr>
      <td>reportExportMap</td>
      <td>
        Report the generated export map (e.g. update the package.json file).
      </td>
    </tr>
  </tbody>
</table>

## Presets

Presets are predefined configurations that encapsulate common export patterns
and conventions. They can be used to quickly set up the export map generation
without needing to define everything from scratch. The library comes with a
set of built-in presets that can be used directly or extended as needed.

### CJS Preset

The CJS preset is designed for projects that distribute their code using the
CommonJS module format.

<details>
  <summary>
    <b>
      Example: Using the CJS preset
    </b>
  </summary>

  ```ts
  import defineConfig from "export-map-generator/config";
  import cjs from "export-map-generator/presets/cjs";

  export default defineConfig({
    presets: [
      cjs(),
    ],
  });
  ```
</details>

<details>
  <summary>
    <b>
      Example: Using the CJS preset for TypeScript source files
    </b>
  </summary>

  ```ts
  import defineConfig from "export-map-generator/config";
  import cjs from "export-map-generator/presets/cjs";

  export default defineConfig({
    presets: [
      cjs({
        src: {
          extension: ".ts",
        },
      }),
    ],
  });
  ```
</details>

### DTS Preset

The DTS preset is designed for projects that distribute TypeScript
declarations.

<details>
  <summary>
    <b>
      Example: Using the DTS preset
    </b>
  </summary>

  ```ts
  import defineConfig from "export-map-generator/config";
  import dts from "export-map-generator/presets/dts";

  export default defineConfig({
    presets: [
      dts(),
    ],
  });
  ```
</details>

<details>
  <summary>
    <b>
      Example: Using the DTS preset for TypeScript source files
    </b>
  </summary>

  ```ts
  import defineConfig from "export-map-generator/config";
  import dts from "export-map-generator/presets/dts";

  export default defineConfig({
    presets: [
      dts({
        src: {
          extension: ".ts",
        },
      }),
    ],
  });
  ```
</details>

### ESM Preset

The ESM preset is designed for projects that distribute their code using the
ECMAScript module format.

<details>
  <summary>
    <b>
      Example: Using the ESM preset
    </b>
  </summary>

  ```ts
  import defineConfig from "export-map-generator/config";
  import esm from "export-map-generator/presets/esm";

  export default defineConfig({
    presets: [
      esm(),
    ],
  });
  ```
</details>

<details>
  <summary>
    <b>
      Example: Using the ESM preset for TypeScript source files
    </b>
  </summary>

  ```ts
  import defineConfig from "export-map-generator/config";
  import esm from "export-map-generator/presets/esm";

  export default defineConfig({
    presets: [
      esm({
        src: {
          extension: ".ts",
        },
      }),
    ],
  });
  ```
</details>

### Generic Preset

The generic preset is designed to provide a flexible configuration for projects
that do not fit into the standard module formats. It allows defining custom
export patterns and conventions.

<details>
  <summary>
    <b>
      Example: Using the generic preset for arbitrary files
    </b>
  </summary>

  ```ts
  import defineConfig from "export-map-generator/config";
  import generic from "export-map-generator/presets/generic";

  export default defineConfig({
    presets: [
      generic({
        conditions: [
          "license",
        ],
        dist: {
          path: "licenses",
          extension: "",
        },
        filter: (direntRef) =>
        {
          return (
            direntRef.dirent.isFile()
            && ["", ".md", ".txt"].includes(direntRef.parsedPath.ext)
          );
        },
        virtual: {
          extension: ".license"
        },
      }),
    ],
  });
  ```
</details>

### Package-JSON Preset

The package-json preset ensures that `package.json` file is explicitly
specified in the `exports`, which is required by some environments to access
metadata safely.

<details>
  <summary>
    <b>
      Example: Using the Package-JSON preset
    </b>
  </summary>

  ```ts
  import defineConfig from "export-map-generator/config";
  import packageJSON from "export-map-generator/presets/package-json";

  export default defineConfig({
    presets: [
      packageJSON(),
    ],
  });
  ```
</details>

### Standard Preset

The standard preset provides a comprehensive configuration that combines
extensions that are responsible for these core functionalities:

- Analyzing the distribution for barrel files (index files)
- Generating exports from directories that contain barrel files
- Consolidating the export patterns per import path
- Preventing import path conflicts by organizing them in correct order
- Preventing runtime condition conflicts by organizing the exports in correct order
- Updating the `exports` field in the `package.json` file

<details>
  <summary>
    <b>
      Example: Using the standard preset
    </b>
  </summary>

  ```ts
  import defineConfig from "export-map-generator/config";
  import standard from "export-map-generator/presets/standard";

  export default defineConfig({
    presets: [
      standard(),
    ],
  });
  ```
</details>

## Practical Example

The work of `export-map-generator` can be seen in the
[`package.json`](package.json) file of this repository. The `exports` field is
generated based on the distribution files and the configuration provided in
the [`exports.config.ts`](exports.config.ts) file. The generator analyzes the
distribution files and generates the `exports` field based on the conventions
defined in the configuration.

## License

This project is licensed under the
[MIT License](https://opensource.org/license/mit).
See the [LICENSE](LICENSE) file for details.
