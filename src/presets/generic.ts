import type { Config } from "../config";
import type { Context } from "../context";
import { resolvePathFromCWD } from "../cwd";
import type {
  ConditionalImportPathExtension,
  ImportCondition,
  VirtualImportPathExtension,
} from "../entry";
import { bindExtension } from "../extension";
import { createDepthFirstDirentProducerExtension } from "../extensions/producer";
import {
  createRedirectorExtension,
  type RedirectRuleFilterFunction,
  type RedirectRuleRebaseDefinition,
} from "../extensions/redirector";
import type {
  Path,
  PathLike,
} from "../path";
import { AbstractPreset } from "../preset";

export const PRESET_UID_GENERIC = "builtin:Generic";

export type GenericPresetDistOptions = {
  extension?: ConditionalImportPathExtension | null;
  path?: null | PathLike;
};

export type GenericPresetDistResolvedOptions = {
  extension: ConditionalImportPathExtension;
  path: Path;
};

export type GenericPresetOptions = {
  conditions?: ImportCondition[] | null;
  dist?: GenericPresetDistOptions | null;
  filter?: null | RedirectRuleFilterFunction;
  rebase?: null | RedirectRuleRebaseDefinition;
  src?: GenericPresetSrcOptions | null;
  virtual?: GenericPresetVirtualOptions | null;
};

export type GenericPresetResolvedOptions = {
  conditions: ImportCondition[] | null | undefined;
  dist: GenericPresetDistResolvedOptions;
  filter: null | RedirectRuleFilterFunction | undefined;
  rebase: null | RedirectRuleRebaseDefinition | undefined;
  src: GenericPresetSrcResolvedOptions;
  virtual: GenericPresetVirtualResolvedOptions;
};

export type GenericPresetSrcOptions = {
  extension?: ConditionalImportPathExtension | null;
  path?: null | PathLike;
};

export type GenericPresetSrcResolvedOptions = {
  extension: ConditionalImportPathExtension;
  path: Path;
};

export type GenericPresetVirtualOptions = {
  extensions?: null | VirtualImportPathExtension[];
};

export type GenericPresetVirtualResolvedOptions = {
  extensions: VirtualImportPathExtension[];
};

export class GenericPreset extends AbstractPreset
{
  options: GenericPresetOptions;

  uid = PRESET_UID_GENERIC;

  constructor(
    options?: GenericPresetOptions | null,
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
    const resolvedOptions = this.resolveOptions(
      context,
      this.options,
    );

    bindExtension(
      context,
      createDepthFirstDirentProducerExtension({
        rootPath: resolvedOptions.dist.path,
      }),
    );

    for (const extension of resolvedOptions.virtual.extensions)
    {
      const conditions = (
        resolvedOptions.conditions
        ?? this.getDefaultConditionsByExtension(
          resolvedOptions.dist.extension,
        )
      );

      for (const condition of conditions)
      {
        let rebase = resolvedOptions.rebase;

        if (condition === "default" && rebase == null)
        {
          rebase = {
            extension: resolvedOptions.src.extension,
            path: resolvedOptions.src.path,
          };
        }

        bindExtension(
          context,
          createRedirectorExtension({
            rules: [
              {
                condition,
                dirent: {
                  extension: resolvedOptions.dist.extension,
                  path: resolvedOptions.dist.path,
                },
                filter: resolvedOptions.filter,
                rebase,
                virtual: {
                  extension,
                },
              },
            ],
          }),
        );
      }
    }
  }

  getDefaultConditionsByExtension(
    extension: ConditionalImportPathExtension,
  ): ImportCondition[]
  {
    return [];
  }

  getDefaultDistExtension(): ConditionalImportPathExtension
  {
    return "";
  }

  getDefaultDistPath(
    context: Context,
  ): PathLike
  {
    return "dist";
  }

  getDefaultSrcExtension(): ConditionalImportPathExtension
  {
    return "";
  }

  getDefaultSrcPath(
    context: Context,
  ): PathLike
  {
    return "src";
  }

  getDefaultVirtualExtensions(): VirtualImportPathExtension[]
  {
    return [];
  }

  resolveDistOptions(
    context: Context,
    options?: GenericPresetDistOptions | null,
  ): GenericPresetDistResolvedOptions
  {
    options ??= {};

    return {
      extension: (
        options.extension
        ?? this.getDefaultDistExtension()
      ),
      path: resolvePathFromCWD(
        context.paths.cwd,
        (
          options.path
          ?? this.getDefaultDistPath(
            context,
          )
        ),
      ),
    };
  }

  resolveOptions(
    context: Context,
    options?: GenericPresetOptions | null,
  ): GenericPresetResolvedOptions
  {
    options ??= {};

    return {
      conditions: options.conditions,
      dist: this.resolveDistOptions(
        context,
        options.dist,
      ),
      filter: options.filter,
      rebase: options.rebase,
      src: this.resolveSrcOptions(
        context,
        options.src,
      ),
      virtual: this.resolveVirtualOptions(
        context,
        options.virtual,
      ),
    };
  }

  resolveSrcOptions(
    context: Context,
    options?: GenericPresetSrcOptions | null,
  ): GenericPresetSrcResolvedOptions
  {
    options ??= {};

    return {
      extension: (
        options.extension
        ?? this.getDefaultSrcExtension()
      ),
      path: resolvePathFromCWD(
        context.paths.cwd,
        (
          options.path
          ?? this.getDefaultSrcPath(
            context,
          )
        ),
      ),
    };
  }

  resolveVirtualOptions(
    context: Context,
    options?: GenericPresetVirtualOptions | null,
  ): GenericPresetVirtualResolvedOptions
  {
    options ??= {};

    return {
      extensions: (
        options.extensions
        ?? this.getDefaultVirtualExtensions()
      ),
    };
  }
}

export function createGenericPreset(
  options?: GenericPresetOptions | null,
): GenericPreset
{
  return new GenericPreset(options);
}

export default createGenericPreset;
