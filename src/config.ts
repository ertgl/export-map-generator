import {
  cosmiconfig,
  defaultLoaders,
  type PublicExplorer,
} from "cosmiconfig";

import { resolveCWD } from "./cwd";
import type { Extension } from "./extension";
import type { PartialCustomFileSystem } from "./fs";
import {
  isAbsolutePath,
  type PathLike,
  resolvePath,
} from "./path";
import type { Preset } from "./preset";

export const CONFIG_NAMESPACE = "exports";

export const CONFIG_NAMESPACE_FOR_PACKAGE_JSON = ["export-map-generator", "config"];

export type Config = {
  [key: string]: unknown;
  extensions?: (Extension | false | null | undefined)[] | null;
  fs?: null | PartialCustomFileSystem;
  presets?: (false | null | Preset | undefined)[] | null;
};

export type ConfigDefinition<
  C extends Config = Config,
> = (
  | C
  | ConfigProviderFunction<C>
);

export type ConfigDefinitionLoaderOptions = {
  configFilePath?: null | string;
  cwd?: null | PathLike;
};

export type ConfigDefinitionResolutionOptions = {
  configDefinition?: ConfigDefinition | null;
  configFilePath?: null | string;
  configProviderContext?: null | Partial<ConfigProviderContext>;
  cwd?: null | PathLike;
};

export type ConfigExplorer = PublicExplorer;

export type ConfigExplorerOptions = {
  cache?: boolean | null;
  namespace?: null | string;
  searchPlaces?: null | string[];
};

export type ConfigExplorerResolvedOptions = {
  cache: boolean;
  namespace: string;
  searchPlaces: string[];
};

export type ConfigLoaderOptions = {
  configDefinition?: ConfigDefinition | null;
  configFilePath?: null | string;
  configProviderContext?: null | Partial<ConfigProviderContext>;
  cwd?: null | PathLike;
};

export type ConfigProviderAsyncFunction<
  C extends Config = Config,
> = (
  context: ConfigProviderContext,
) => Promise<C>;

export type ConfigProviderContext = {
  cwd: string;
};

export type ConfigProviderFunction<
  C extends Config = Config,
> = (
  | ConfigProviderAsyncFunction<C>
  | ConfigProviderSyncFunction<C>
);

export type ConfigProviderSyncFunction<
  C extends Config = Config,
> = (
  context: ConfigProviderContext,
) => C;

export type ConfigSearchResult = (
  | ConfigSearchResultFound
  | ConfigSearchResultNotFound
);

export type ConfigSearchResultFound = {
  configDefinition: ConfigDefinition;
  filePath: string;
  found: true;
};

export type ConfigSearchResultNotFound = {
  configDefinition: null | undefined;
  filePath: "";
  found: false;
};

export function createConfigExplorer(
  options?: ConfigExplorerOptions | null,
): ConfigExplorer
{
  const resolvedOptions = resolveConfigExplorerOptions(options);

  return cosmiconfig(
    resolvedOptions.namespace,
    {
      cache: resolvedOptions.cache,
      loaders: {
        ".cts": defaultLoaders[".ts"],
        ".mts": defaultLoaders[".ts"],
        ...defaultLoaders,
      },
      packageProp: CONFIG_NAMESPACE_FOR_PACKAGE_JSON,
      searchPlaces: resolvedOptions.searchPlaces,
      searchStrategy: "project",
    },
  );
}

export function defineConfig<
  C extends Config,
  T extends ConfigDefinition<C> = ConfigDefinition<C>,
>(
  config: T,
): T
{
  return config;
}

export function getDefaultConfigSearchPlaces(
  namespace?: null | string,
): string[]
{
  namespace ??= CONFIG_NAMESPACE;

  return [
    "package.json",
    `${namespace}.config.ts`,
    `${namespace}.config.js`,
    `${namespace}.config.mts`,
    `${namespace}.config.mjs`,
    `${namespace}.config.cts`,
    `${namespace}.config.cjs`,
    `.${namespace}rc.ts`,
    `.${namespace}rc.js`,
    `.${namespace}rc.mts`,
    `.${namespace}rc.mjs`,
    `.${namespace}rc.cts`,
    `.${namespace}rc.cjs`,
    `.${namespace}rc.json`,
    `.${namespace}rc.yml`,
    `.${namespace}rc.yaml`,
    `.${namespace}rc`,
    `.config/${namespace}rc.ts`,
    `.config/${namespace}rc.js`,
    `.config/${namespace}rc.mts`,
    `.config/${namespace}rc.mjs`,
    `.config/${namespace}rc.cts`,
    `.config/${namespace}rc.cjs`,
    `.config/${namespace}rc.json`,
    `.config/${namespace}rc.yml`,
    `.config/${namespace}rc.yaml`,
    `.config/${namespace}rc`,
  ];
}

export function isConfigProviderFunction(
  value: unknown,
): value is ConfigProviderFunction
{
  return typeof value === "function";
}

export async function loadConfig(
  options?: ConfigLoaderOptions | null,
): Promise<Config>
{
  options ??= {};

  return await resolveConfigDefinition({
    configDefinition: options.configDefinition,
    configFilePath: options.configFilePath,
    configProviderContext: options.configProviderContext,
    cwd: options.cwd,
  });
}

export async function loadConfigDefinition(
  options?: ConfigDefinitionLoaderOptions | null,
): Promise<ConfigDefinition>
{
  options ??= {};

  const configFilePath = options.configFilePath ?? "";

  const configSearchResult = await searchConfig(
    options.cwd,
    {
      searchPlaces: (
        configFilePath !== ""
          ? [configFilePath]
          : undefined
      ),
    },
  );

  return configSearchResult.configDefinition ?? {};
}

export async function resolveConfigDefinition(
  options?: ConfigDefinitionResolutionOptions | null,
): Promise<Config>
{
  options ??= {};

  const configDefinition = (
    options.configDefinition
    ?? (
      await loadConfigDefinition(
        {
          configFilePath: options.configFilePath,
          cwd: options.cwd,
        },
      )
    )
  );

  let config: Config;

  if (isConfigProviderFunction(configDefinition))
  {
    const configProviderContext = {
      cwd: resolveCWD(
        options.cwd,
      ),
      ...options.configProviderContext,
    };

    const maybePromise = configDefinition(configProviderContext);
    if (maybePromise instanceof Promise)
    {
      config = await maybePromise;
    }
    else
    {
      config = maybePromise;
    }
  }
  else
  {
    config = configDefinition;
  }

  return config;
}

export function resolveConfigExplorerOptions(
  options?: ConfigExplorerOptions | null,
): ConfigExplorerResolvedOptions
{
  options ??= {};

  const namespace = options.namespace ?? CONFIG_NAMESPACE;

  return {
    cache: options.cache ?? true,
    namespace,
    searchPlaces: (
      options.searchPlaces
      ?? getDefaultConfigSearchPlaces(namespace)
    ),
  };
}

export async function resolveConfigFilePath(
  configFilePath?: null | string,
  cwd?: null | PathLike,
): Promise<string>
{
  if (!configFilePath)
  {
    const result = await searchConfig(cwd);
    return result.filePath;
  }

  if (!isAbsolutePath(configFilePath))
  {
    const cwdString = resolveCWD(cwd);

    return resolvePath(
      cwdString,
      configFilePath,
    );
  }

  return configFilePath;
}

export async function searchConfig(
  cwd?: null | PathLike,
  options?: ConfigExplorerOptions | null,
): Promise<ConfigSearchResult>
{
  const cwdString = resolveCWD(cwd);

  const explorer = createConfigExplorer(options);

  const result = await explorer.search(cwdString);

  if (result == null)
  {
    return {
      configDefinition: null,
      filePath: "",
      found: false,
    };
  }

  return {
    configDefinition: result.config as ConfigDefinition,
    filePath: result.filepath,
    found: true,
  };
}

export default defineConfig;
