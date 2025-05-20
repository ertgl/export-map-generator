import {
  Command,
  type OptionValues,
} from "commander";

import PACKAGE_JSON from "export-map-generator/package.json" with { type: "json" };

import {
  loadConfig,
  resolveConfigFilePath,
} from "./config";
import {
  type Context,
  resolveContext,
} from "./context";
import { resolveCWD } from "./cwd";
import { generateExportMapByContext } from "./export-map";
import type { Path } from "./path";

export type CLIProgramOptions = {
  configFilePath: Path;
  cwd: Path;
  dryRun: boolean;
};

export async function resolveCLIProgramOptions(
  options: OptionValues,
): Promise<CLIProgramOptions>
{
  const cwd = resolveCWD(
    options.cwd as Path | undefined,
  );

  const configFilePath = await resolveConfigFilePath(
    options.config as Path | undefined,
  );

  const dryRun = (
    (options.dryRun as (boolean | undefined))
    ?? false
  );

  return {
    configFilePath,
    cwd,
    dryRun,
  };
}

export async function resolveContextByCLIOptions(
  programOptions: OptionValues,
): Promise<Context>
{
  return await resolveContext({
    configLoaderOptions: {
      configFilePath: programOptions.config as string | undefined,
    },
    cwd: programOptions.cwd as string | undefined,
    dryRun: programOptions.dryRun as boolean | undefined,
  });
}

export async function runCLI(
  argv?: null | readonly string[],
): Promise<void>
{
  argv ??= process.argv;

  const program = new Command();

  program.name("export-map-generator");

  program.version(PACKAGE_JSON.version);

  program.option(
    "--cwd <PATH>",
    "path to the working directory",
    resolveCWD,
  );

  program.option(
    "-c, --config <PATH>",
    "path to the configuration file",
  );

  program.option(
    "--dry-run",
    "preview changes without writing to disk",
    false,
  );

  const configCommand = program.command("config");
  configCommand.description("configuration commands");

  const inspectConfigCommand = configCommand.command("inspect");
  inspectConfigCommand.description("inspect the config");
  inspectConfigCommand.action(
    async function ()
    {
      const {
        format,
      } = await import("pretty-format");

      const programOptions = program.opts();

      const config = await loadConfig({
        configFilePath: programOptions.config as string | undefined,
        cwd: programOptions.cwd as string | undefined,
      });

      console.log(
        format(
          config,
          {
            highlight: true,
            indent: 2,
            printFunctionName: true,
          },
        ),
      );
    },
  );

  const whichConfigCommand = configCommand.command("which");
  whichConfigCommand.description("display the configuration file path");
  whichConfigCommand.action(
    async function ()
    {
      const {
        configFilePath,
      } = await resolveCLIProgramOptions(
        program.opts(),
      );

      console.log(configFilePath);
    },
  );

  const contextCommand = program.command("context");
  contextCommand.description("context commands");

  const inspectContextCommand = contextCommand.command("inspect");
  inspectContextCommand.description("inspect the context");
  inspectContextCommand.action(
    async function ()
    {
      const {
        format,
      } = await import("pretty-format");

      const context = await resolveContextByCLIOptions(
        program.opts(),
      );

      console.log(
        format(
          context,
          {
            highlight: true,
            indent: 2,
            printFunctionName: true,
          },
        ),
      );
    },
  );

  const generateCommand = program.command("generate");
  generateCommand.description("generate export map");
  generateCommand.option(
    "--stdout",
    "output the export map to stdout",
    false,
  );
  generateCommand.action(
    async function ()
    {
      const commandOptions = this.opts();

      const stdout = commandOptions.stdout as boolean;

      const context = await resolveContextByCLIOptions(
        program.opts(),
      );

      const exportMap = await generateExportMapByContext(
        context,
      );

      if (stdout)
      {
        console.log(
          JSON.stringify(
            exportMap,
            null,
            2,
          ),
        );
      }
    },
  );

  await program.parseAsync(argv);
}
