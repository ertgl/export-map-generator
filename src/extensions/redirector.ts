import type { Context } from "../context";
import {
  type DirentRef,
  getRebasedDirentRelativePath,
} from "../dirent";
import {
  type ConditionalImportPathExtension,
  type ImportCondition,
  normalizeConditionalExportPath,
  normalizeVirtualImportPath,
  type VirtualImportPathExtension,
} from "../entry";
import {
  AbstractExtension,
  type EmitEntryFunction,
} from "../extension";
import {
  type Path,
  relatePath,
} from "../path";
import { maybeAwait } from "../promise";
import { replaceSuffix } from "../string";

export const EXTENSION_UID_REDIRECTOR = "builtin:Redirector";

export type RedirectorExtensionOptions = {
  rules: RedirectRuleDefinition[];
};

export type RedirectRuleDefinition = {
  condition: ImportCondition;
  dirent?: null | RedirectRuleDirentDefinition;
  filter?: null | RedirectRuleFilterFunction;
  rebase?: null | RedirectRuleRebaseDefinition;
  virtual?: null | RedirectRuleVirtualDefinition;
};

export type RedirectRuleDirentDefinition = {
  extension?: ConditionalImportPathExtension | null;
  path?: null | Path;
};

export type RedirectRuleFilterAsyncFunction = (
  direntRef: DirentRef,
) => Promise<boolean>;

export type RedirectRuleFilterFunction = (
  | RedirectRuleFilterAsyncFunction
  | RedirectRuleFilterSyncFunction
);

export type RedirectRuleFilterSyncFunction = (
  direntRef: DirentRef,
) => boolean;

export type RedirectRuleRebaseDefinition = {
  extension?: ConditionalImportPathExtension | null;
  path?: null | Path;
};

export type RedirectRuleVirtualDefinition = {
  extension?: null | VirtualImportPathExtension;
};

export class RedirectorExtension extends AbstractExtension
{
  options: RedirectorExtensionOptions;

  uid = EXTENSION_UID_REDIRECTOR;

  constructor(
    options: RedirectorExtensionOptions,
  )
  {
    super();

    this.options = options;
  }

  async produceEntriesByDirentRef(
    context: Context,
    direntRef: DirentRef,
    emit: EmitEntryFunction,
  ): Promise<void>
  {
    if (!direntRef.dirent.isFile())
    {
      return;
    }

    for (const rule of this.options.rules)
    {
      if (rule.dirent != null)
      {
        if (rule.dirent.path != null)
        {
          if (!direntRef.fullPath.startsWith(rule.dirent.path))
          {
            continue;
          }
        }

        if (rule.dirent.extension != null)
        {
          if (!direntRef.fullPath.endsWith(rule.dirent.extension))
          {
            continue;
          }
        }
      }

      if (rule.filter)
      {
        const matched = await maybeAwait(
          rule.filter(
            direntRef,
          ),
        );

        if (!matched)
        {
          continue;
        }
      }

      const rootDirectoryPath = (
        rule.dirent?.path
        ?? direntRef.rootPath
      );

      let virtualImportPath = relatePath(
        rootDirectoryPath,
        direntRef.fullPath,
      );

      const direntExtension = (
        rule.dirent?.extension
        ?? direntRef.parsedPath.ext
      );

      if (rule.virtual?.extension != null)
      {
        virtualImportPath = replaceSuffix(
          virtualImportPath,
          direntExtension,
          rule.virtual.extension,
        );
      }

      let conditionalExportPath: null | Path = null;

      if (rule.rebase?.path != null)
      {
        conditionalExportPath = getRebasedDirentRelativePath(
          direntRef,
          rule.rebase.path,
        );
      }

      if (conditionalExportPath == null)
      {
        conditionalExportPath = getRebasedDirentRelativePath(
          direntRef,
          rootDirectoryPath,
        );
      }

      if (rule.rebase?.extension != null)
      {
        conditionalExportPath = replaceSuffix(
          conditionalExportPath,
          direntExtension,
          rule.rebase.extension,
        );
      }

      const normalizedVirtualImportPath = normalizeVirtualImportPath(
        virtualImportPath,
      );

      const normalizedConditionalExportPath = normalizeConditionalExportPath(
        conditionalExportPath,
      );

      const isRedirect = (
        normalizedVirtualImportPath !== normalizedConditionalExportPath
      );

      await maybeAwait(
        emit(
          {
            conditionalExportPaths: {
              [rule.condition]: normalizedConditionalExportPath,
            },
            state: {
              isRedirect,
            },
            virtualImportPath: normalizedVirtualImportPath,
          },
        ),
      );
    }
  }
}

export function createRedirectorExtension(
  options: RedirectorExtensionOptions,
): RedirectorExtension
{
  return new RedirectorExtension(options);
}

export default createRedirectorExtension;
