import type { Config } from "../config";
import type { Context } from "../context";
import { resolvePathFromCWD } from "../cwd";
import type { CreateEntryFunction } from "../entry";
import {
  bindExtension,
  type EmitEntrySyncFunction,
} from "../extension";
import { createExtraEntryEmitterExtension } from "../extensions/extra";
import {
  type Path,
  type PathLike,
  relatePath,
} from "../path";
import { AbstractPreset } from "../preset";

export const PRESET_UID_PACKAGE_JSON = "builtin:PackageJSON";

export type PackageJSONPresetOptions = {
  path?: null | PathLike;
};

export type PackageJSONPresetResolvedOptions = {
  path: Path;
};

export class PackageJSONPreset extends AbstractPreset
{
  options: PackageJSONPresetOptions;

  uid = PRESET_UID_PACKAGE_JSON;

  constructor(
    options?: null | PackageJSONPresetOptions,
  )
  {
    super();

    this.options = options ?? {};
  }

  augmentContext(
    context: Context,
    config: Config,
  ): void
  {
    const resolvedOptions = this.resolveOptions(context);

    const packageJSONDefaultExportPath = relatePath(
      context.paths.cwd,
      resolvedOptions.path,
    );

    bindExtension(
      context,
      createExtraEntryEmitterExtension({
        produce: (
          context: Context,
          emit: EmitEntrySyncFunction,
          createEntry: CreateEntryFunction,
        ) =>
        {
          emit(
            createEntry(
              "package.json",
              {
                default: packageJSONDefaultExportPath,
              },
            ),
          );
        },
      }),
    );
  }

  getDefaultPackageJSONFilePath(): PathLike
  {
    return "package.json";
  }

  resolveOptions(
    context: Context,
  ): PackageJSONPresetResolvedOptions
  {
    return {
      path: resolvePathFromCWD(
        context.paths.cwd,
        (
          this.options.path
          ?? this.getDefaultPackageJSONFilePath()
        ),
      ),
    };
  }
}

export function createPackageJSONPreset(
  options?: null | PackageJSONPresetOptions,
): PackageJSONPreset
{
  return new PackageJSONPreset(options);
}

export default createPackageJSONPreset;
