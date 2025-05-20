import type { Context } from "./context";
import {
  type DirentRef,
  requestDirentRefsByContext,
} from "./dirent";
import type { EmitEntryFunction } from "./extension";
import {
  convertPathToPOSIX,
  enforceRelativePathSpecifier,
  type PathLike,
  POSIX_PATH_SEPARATOR,
} from "./path";
import { maybeAwait } from "./promise";

export type ConditionalExportPath = string;

export type ConditionalExportPathAlternation = ConditionalExportPath[];

export type ConditionalExportPathOrAlternation = (
  | ConditionalExportPath
  | ConditionalExportPathAlternation
);

export type ConditionalExportPaths = {
  [importCondition: ImportCondition]: ConditionalExportPathOrAlternation;
};

export type ConditionalImportPathExtension = string;

export type CreateEntryFunction = typeof createEntry;

export type Entry = {
  conditionalExportPaths: ConditionalExportPaths;
  state: EntryState;
  virtualImportPath: VirtualImportPath;
};

export type EntryState = Record<string, unknown>;

export type ImportCondition = string;

export type VirtualImportPath = string;

export type VirtualImportPathExtension = string;

export function createEntry(
  virtualImportPath: VirtualImportPath,
  conditionalExportPaths?: ConditionalExportPaths | null,
  state?: EntryState | null,
): Entry
{
  return {
    conditionalExportPaths: deriveConditionalExportPaths(
      conditionalExportPaths
      ?? {},
    ),
    state: deriveEntryState(
      state
      ?? {},
    ),
    virtualImportPath,
  };
}

export function deriveConditionalExportPaths(
  conditionalExportPaths: ConditionalExportPaths,
  overrides?: ConditionalExportPaths | null,
): ConditionalExportPaths
{
  overrides ??= {};

  return new Set(
    Object.keys(
      conditionalExportPaths,
    ),
  ).union(
    new Set(
      Object.keys(
        overrides,
      ),
    ),
  ).keys().reduce<ConditionalExportPaths>(
    (
      acc,
      importCondition,
    ) =>
    {
      const finalConditionalExportPath = (
        overrides[importCondition]
        ?? conditionalExportPaths[importCondition]
      );

      acc[importCondition] = (
        Array.isArray(finalConditionalExportPath)
          ? finalConditionalExportPath.slice()
          : finalConditionalExportPath
      );
      return acc;
    },
    {},
  );
}

export function deriveEntry(
  entry: Entry,
  overrides?: null | Partial<Entry>,
): Entry
{
  overrides ??= {};

  return {
    conditionalExportPaths: deriveConditionalExportPaths(
      entry.conditionalExportPaths,
      overrides.conditionalExportPaths,
    ),
    state: deriveEntryState(
      entry.state,
      overrides.state,
    ),
    virtualImportPath: (
      overrides.virtualImportPath
      ?? entry.virtualImportPath
    ),
  };
}

export function deriveEntryState(
  state: EntryState,
  overrides?: EntryState | null,
): EntryState
{
  return {
    ...state,
    ...overrides,
  };
}

export async function generateEntriesByContext(
  context: Context,
  emitEntry: EmitEntryFunction,
): Promise<void>
{
  await requestDirentRefsByContext(
    context,
    async (
      direntRef: DirentRef,
    ): Promise<void> =>
    {
      const callback = async (
        entry: Entry,
      ): Promise<void> =>
      {
        await requestHandlingEntryForDirentRefByContext(
          context,
          direntRef,
          entry,
          callback,
        );

        await requestHandlingEntryByContext(
          context,
          entry,
          callback,
        );

        await maybeAwait(
          emitEntry(
            entry,
          ),
        );
      };

      await requestEntriesForDirentRefByContext(
        context,
        direntRef,
        callback,
      );
    },
  );

  const callback = async (
    entry: Entry,
  ): Promise<void> =>
  {
    await requestHandlingEntryByContext(
      context,
      entry,
      callback,
    );

    await maybeAwait(
      emitEntry(
        entry,
      ),
    );
  };

  await requestAdditionalEntriesByContext(
    context,
    callback,
  );
}

export function normalizeConditionalExportPath(
  path: PathLike,
): ConditionalExportPath
{
  return enforceRelativePathSpecifier(
    convertPathToPOSIX(path),
    POSIX_PATH_SEPARATOR,
  );
}

export function normalizeConditionalExportPathOrAlternation(
  conditionalExportPathOrAlternation: ConditionalExportPathOrAlternation,
): ConditionalExportPathOrAlternation
{
  return (
    Array.isArray(conditionalExportPathOrAlternation)
      ? conditionalExportPathOrAlternation.map(
          normalizeConditionalExportPath,
        )
      : normalizeConditionalExportPath(
          conditionalExportPathOrAlternation,
        )
  );
}

export function normalizeConditionalExportPaths(
  conditionalExportPaths: ConditionalExportPaths,
): ConditionalExportPaths
{
  return Object.fromEntries(
    Object.entries(
      conditionalExportPaths,
    ).map(
      (
        [
          importCondition,
          conditionalExportPathOrAlternation,
        ],
      ) =>
        [
          importCondition,
          normalizeConditionalExportPathOrAlternation(
            conditionalExportPathOrAlternation,
          ),
        ],
    ),
  );
}

export function normalizeEntry(
  entry: Entry,
): Entry
{
  return {
    conditionalExportPaths: normalizeConditionalExportPaths(
      entry.conditionalExportPaths,
    ),
    state: entry.state,
    virtualImportPath: normalizeVirtualImportPath(
      entry.virtualImportPath,
    ),
  };
}

export function normalizeVirtualImportPath(
  path: PathLike,
): VirtualImportPath
{
  return enforceRelativePathSpecifier(
    convertPathToPOSIX(path),
    POSIX_PATH_SEPARATOR,
  );
}

export async function requestAdditionalEntriesByContext(
  context: Context,
  emitEntry: EmitEntryFunction,
): Promise<void>
{
  for (const produceEntries of context.hooks.extension.produceEntries)
  {
    await maybeAwait(
      produceEntries(
        context,
        emitEntry,
      ),
    );
  }
}

export async function requestEntriesForDirentRefByContext(
  context: Context,
  direntRef: DirentRef,
  emitEntry: EmitEntryFunction,
): Promise<void>
{
  for (const produceEntriesByDirentRef of context.hooks.extension.produceEntriesByDirentRef)
  {
    await maybeAwait(
      produceEntriesByDirentRef(
        context,
        direntRef,
        emitEntry,
      ),
    );
  }
}

export async function requestHandlingEntryByContext(
  context: Context,
  entry: Entry,
  emitEntry: EmitEntryFunction,
): Promise<void>
{
  for (const handleEntry of context.hooks.extension.handleEntry)
  {
    await maybeAwait(
      handleEntry(
        context,
        entry,
        emitEntry,
      ),
    );
  }
}

export async function requestHandlingEntryForDirentRefByContext(
  context: Context,
  direntRef: DirentRef,
  entry: Entry,
  emitEntry: EmitEntryFunction,
): Promise<void>
{
  for (const handleEntryByDirentRef of context.hooks.extension.handleEntryByDirentRef)
  {
    await maybeAwait(
      handleEntryByDirentRef(
        context,
        direntRef,
        entry,
        emitEntry,
      ),
    );
  }
}
