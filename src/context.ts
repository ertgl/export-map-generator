import {
  type Config,
  type ConfigLoaderOptions,
  loadConfig,
} from "./config";
import { resolveCWD } from "./cwd";
import {
  bindExtensions,
  type Extension,
} from "./extension";
import { createCustomFileSystem, type CustomFileSystem } from "./fs";
import {
  createHooks,
  type Hooks,
} from "./hook";
import {
  type Path,
  type PathLike,
  resolvePathOrFallback,
} from "./path";
import {
  bindPresets,
  type Preset,
} from "./preset";
import { maybeAwait } from "./promise";

export type Context = {
  dryRun: boolean;
  extensions: Extension[];
  fs: CustomFileSystem;
  hooks: Hooks;
  paths: ContextResolvedPaths;
  presets: Preset[];
};

export type ContextResolutionOptions = {
  config?: Config | null;
  configLoaderOptions?: ConfigLoaderOptions | null;
  cwd?: null | PathLike;
  dryRun?: boolean | null;
};

export type ContextResolvedPaths = {
  cwd: Path;
};

export async function resolveContext(
  options?: ContextResolutionOptions | null,
): Promise<Context>
{
  options ??= {};

  const cwd = resolveCWD(options.cwd);

  const config = (
    options.config
    ?? (
      await loadConfig({
        cwd: resolvePathOrFallback(
          options.configLoaderOptions?.cwd,
          cwd,
        ),
        ...options.configLoaderOptions,
      })
    )
  );

  const dryRun = options.dryRun ?? false;

  const extensions: Extension[] = [];

  const fs = createCustomFileSystem(config.fs);

  const hooks = createHooks();

  const paths: ContextResolvedPaths = {
    cwd,
  };

  const presets: Preset[] = [];

  const context: Context = {
    dryRun,
    extensions,
    fs,
    hooks,
    paths,
    presets,
  };

  bindExtensions(
    context,
    config.extensions,
  );

  await bindPresets(
    context,
    config,
    config.presets,
  );

  await triggerContextHooks(
    context,
    config,
  );

  return context;
}

export async function triggerContextHooks(
  context: Context,
  config: Config,
): Promise<void>
{
  for (const setupExtension of context.hooks.extension.setup)
  {
    await maybeAwait(
      setupExtension(
        context,
      ),
    );
  }

  for (const resolveExtensionConfig of context.hooks.extension.resolveConfig)
  {
    await maybeAwait(
      resolveExtensionConfig(
        context,
        config,
      ),
    );
  }

  for (const resolveExtensionContext of context.hooks.extension.resolveContext)
  {
    await maybeAwait(
      resolveExtensionContext(
        context,
      ),
    );
  }
}
