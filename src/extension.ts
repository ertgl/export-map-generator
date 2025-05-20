import type { Config } from "./config";
import type { Context } from "./context";
import type { DirentRef } from "./dirent";
import type { Entry } from "./entry";
import type { ExportMap, ExportMapRef } from "./export-map";

export type AggregateExportMapAsyncFunction = (
  context: Context,
  exportMap: ExportMap,
  entry: Entry,
) => Promise<void>;

export type AggregateExportMapFunction = (
  | AggregateExportMapAsyncFunction
  | AggregateExportMapSyncFunction
);

export type AggregateExportMapSyncFunction = (
  context: Context,
  exportMap: ExportMap,
  entry: Entry,
) => void;

export type EmitDirentRefAsyncFunction = (
  direntRef: DirentRef,
) => Promise<void>;

export type EmitDirentRefFunction = (
  | EmitDirentRefAsyncFunction
  | EmitDirentRefSyncFunction
);

export type EmitDirentRefSyncFunction = (
  direntRef: DirentRef,
) => void;

export type EmitEntryAsyncFunction = (
  entry: Entry,
) => Promise<void>;

export type EmitEntryFunction = (
  | EmitEntryAsyncFunction
  | EmitEntrySyncFunction
);

export type EmitEntrySyncFunction = (
  entry: Entry,
) => void;

export type Extension = {
  readonly aggregateExportMap?: AggregateExportMapFunction | null;
  readonly handleEntry?: HandleEntryFunction | null;
  readonly handleEntryByDirentRef?: HandleEntryByDirentRefFunction | null;
  readonly produceDirentRefs?: null | ProduceDirentRefsFunction;
  readonly produceEntries?: null | ProduceEntriesFunction;
  readonly produceEntriesByDirentRef?: null | ProduceEntriesByDirentRefFunction;
  readonly reportExportMap?: null | ReportExportMapFunction;
  readonly resolveConfig?: null | ResolveConfigFunction;
  readonly resolveContext?: null | ResolveContextFunction;
  readonly setup?: null | SetupFunction;
  readonly sortExportMap?: null | SortExportMapFunction;
  readonly uid?: null | string;
};

export type HandleEntryAsyncFunction = (
  context: Context,
  entry: Entry,
  emitEntry: EmitEntryFunction,
) => Promise<void>;

export type HandleEntryByDirentRefAsyncFunction = (
  context: Context,
  direntRef: DirentRef,
  entry: Entry,
  emitEntry: EmitEntryFunction,
) => Promise<void>;

export type HandleEntryByDirentRefFunction = (
  | HandleEntryByDirentRefAsyncFunction
  | HandleEntryByDirentRefSyncFunction
);

export type HandleEntryByDirentRefSyncFunction = (
  context: Context,
  direntRef: DirentRef,
  entry: Entry,
  emitEntry: EmitEntryFunction,
) => void;

export type HandleEntryFunction = (
  | HandleEntryAsyncFunction
  | HandleEntrySyncFunction
);

export type HandleEntrySyncFunction = (
  context: Context,
  entry: Entry,
  emitEntry: EmitEntryFunction,
) => void;

export type ProduceDirentRefsAsyncFunction = (
  context: Context,
  emitDirentRef: EmitDirentRefFunction,
) => Promise<void>;

export type ProduceDirentRefsFunction = (
  | ProduceDirentRefsAsyncFunction
);

export type ProduceEntriesAsyncFunction = (
  context: Context,
  emitEntry: EmitEntryFunction,
) => Promise<void>;

export type ProduceEntriesByDirentRefAsyncFunction = (
  context: Context,
  direntRef: DirentRef,
  emitEntry: EmitEntryFunction,
) => Promise<void>;

export type ProduceEntriesByDirentRefFunction = (
  | ProduceEntriesByDirentRefAsyncFunction
);

export type ProduceEntriesFunction = (
  | ProduceEntriesAsyncFunction
);

export type ReportExportMapAsyncFunction = (
  context: Context,
  exportMap: ExportMap,
) => Promise<void>;

export type ReportExportMapFunction = (
  | ReportExportMapAsyncFunction
  | ReportExportMapSyncFunction
);

export type ReportExportMapSyncFunction = (
  context: Context,
  exportMap: ExportMap,
) => void;

export type ResolveConfigAsyncFunction = (
  context: Context,
  config: Config,
) => Promise<void>;

export type ResolveConfigFunction = (
  | ResolveConfigAsyncFunction
  | ResolveConfigSyncFunction
);

export type ResolveConfigSyncFunction = (
  context: Context,
  config: Config,
) => void;

export type ResolveContextAsyncFunction = (
  context: Context,
) => Promise<void>;

export type ResolveContextFunction = (
  | ResolveContextAsyncFunction
  | ResolveContextSyncFunction
);

export type ResolveContextSyncFunction = (
  context: Context,
) => void;

export type SetupAsyncFunction = (
  context: Context,
) => Promise<void>;

export type SetupFunction = (
  | SetupAsyncFunction
  | SetupSyncFunction
);

export type SetupSyncFunction = (
  context: Context,
) => void;

export type SortExportMapAsyncFunction = (
  context: Context,
  exportMapRef: ExportMapRef,
) => Promise<void>;

export type SortExportMapFunction = (
  | SortExportMapAsyncFunction
  | SortExportMapSyncFunction
);

export type SortExportMapSyncFunction = (
  context: Context,
  exportMapRef: ExportMapRef,
) => void;

export abstract class AbstractExtension implements Extension
{
  abstract readonly uid?: null | string;

  aggregateExportMap?(
    context: Context,
    exportMap: ExportMap,
    entry: Entry,
  ): Promise<void> | void;

  handleEntry?(
    context: Context,
    entry: Entry,
    emitEntry: EmitEntryFunction,
  ): Promise<void> | void;

  handleEntryByDirentRef?(
    context: Context,
    direntRef: DirentRef,
    entry: Entry,
    emitEntry: EmitEntryFunction,
  ): Promise<void> | void;

  produceDirentRefs?(
    context: Context,
    emit: EmitDirentRefFunction,
  ): Promise<void>;

  produceEntries?(
    context: Context,
    emit: EmitEntryFunction,
  ): Promise<void>;

  produceEntriesByDirentRef?(
    context: Context,
    direntRef: DirentRef,
    emit: EmitEntryFunction,
  ): Promise<void>;

  reportExportMap?(
    context: Context,
    exportMap: ExportMap,
  ): Promise<void> | void;

  resolveConfig?(
    context: Context,
    config: Config,
  ): Promise<void> | void;

  resolveContext?(
    context: Context,
  ): Promise<void> | void;

  setup?(
    context: Context,
  ): Promise<void> | void;

  sortExportMap?(
    context: Context,
    exportMapRef: ExportMapRef,
  ): Promise<void> | void;
}

export function bindExtension(
  context: Context,
  extension: Extension,
): void
{
  context.extensions.push(extension);

  if (extension.setup != null)
  {
    context.hooks.extension.setup.push(
      extension.setup.bind(
        extension,
      ),
    );
  }

  if (extension.resolveConfig != null)
  {
    context.hooks.extension.resolveConfig.push(
      extension.resolveConfig.bind(
        extension,
      ),
    );
  }

  if (extension.resolveContext != null)
  {
    context.hooks.extension.resolveContext.push(
      extension.resolveContext.bind(
        extension,
      ),
    );
  }

  if (extension.produceDirentRefs != null)
  {
    context.hooks.extension.produceDirentRefs.push(
      extension.produceDirentRefs.bind(
        extension,
      ),
    );
  }

  if (extension.produceEntriesByDirentRef != null)
  {
    context.hooks.extension.produceEntriesByDirentRef.push(
      extension.produceEntriesByDirentRef.bind(
        extension,
      ),
    );
  }

  if (extension.produceEntries != null)
  {
    context.hooks.extension.produceEntries.push(
      extension.produceEntries.bind(
        extension,
      ),
    );
  }

  if (extension.handleEntryByDirentRef != null)
  {
    context.hooks.extension.handleEntryByDirentRef.push(
      extension.handleEntryByDirentRef.bind(
        extension,
      ),
    );
  }

  if (extension.handleEntry != null)
  {
    context.hooks.extension.handleEntry.push(
      extension.handleEntry.bind(
        extension,
      ),
    );
  }

  if (extension.aggregateExportMap != null)
  {
    context.hooks.extension.aggregateExportMap.push(
      extension.aggregateExportMap.bind(
        extension,
      ),
    );
  }

  if (extension.sortExportMap != null)
  {
    context.hooks.extension.sortExportMap.push(
      extension.sortExportMap.bind(
        extension,
      ),
    );
  }

  if (extension.reportExportMap != null)
  {
    context.hooks.extension.reportExportMap.push(
      extension.reportExportMap.bind(
        extension,
      ),
    );
  }
}

export function bindExtensions(
  context: Context,
  extensions: (Extension | false | null | undefined)[] | null | undefined,
): void
{
  if (extensions == null)
  {
    return;
  }

  for (const extension of extensions)
  {
    if (extension)
    {
      bindExtension(
        context,
        extension,
      );
    }
  }
}
