import type { Config } from "../config";
import type { Context } from "../context";
import { bindExtension } from "../extension";
import { createAggregatorExtension } from "../extensions/aggregator";
import createBarrelExtension from "../extensions/barrel";
import {
  createSorterExtension,
  type SorterExtensionOptions,
} from "../extensions/sorter";
import {
  createPackageJSONUpdaterExtension,
  type PackageJSONUpdaterExtensionOptions,
} from "../extensions/updater";
import { AbstractPreset } from "../preset";

export const PRESET_UID_STANDARD = "builtin:Standard";

export type StandardPresetOptions = {
  aggregator?: boolean | null;
  barrel?: boolean | null;
  sorter?: boolean | null | SorterExtensionOptions;
  updater?: boolean | null | PackageJSONUpdaterExtensionOptions;
};

export type StandardPresetResolvedOptions = {
  aggregator: boolean;
  barrel: boolean;
  sorter: false | SorterExtensionOptions;
  updater: false | PackageJSONUpdaterExtensionOptions;
};

export class StandardPreset extends AbstractPreset
{
  options: StandardPresetOptions;

  uid = PRESET_UID_STANDARD;

  constructor(
    options?: null | StandardPresetOptions,
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
    const resolvedOptions = this.resolveOptions();

    if (resolvedOptions.barrel)
    {
      bindExtension(
        context,
        createBarrelExtension(),
      );
    }

    if (resolvedOptions.aggregator)
    {
      bindExtension(
        context,
        createAggregatorExtension(),
      );
    }

    if (resolvedOptions.sorter)
    {
      bindExtension(
        context,
        createSorterExtension(
          resolvedOptions.sorter,
        ),
      );
    }

    if (resolvedOptions.updater)
    {
      bindExtension(
        context,
        createPackageJSONUpdaterExtension(
          resolvedOptions.updater,
        ),
      );
    }
  }

  resolveOptions(): StandardPresetResolvedOptions
  {
    return {
      aggregator: (
        this.options.aggregator
        ?? true
      ),
      barrel: (
        this.options.barrel
        ?? true
      ),
      sorter: (
        this.options.sorter === true
          ? {}
          : (
              this.options.sorter
              ?? {}
            )
      ),
      updater: (
        this.options.updater === true
          ? {}
          : (
              this.options.updater
              ?? {}
            )
      ),
    };
  }
}

export function createStandardPreset(
  options?: null | StandardPresetOptions,
): StandardPreset
{
  return new StandardPreset(options);
}

export default createStandardPreset;
