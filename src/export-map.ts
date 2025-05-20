import type { Context } from "./context";
import {
  type ConditionalExportPaths,
  type Entry,
  generateEntriesByContext,
  type VirtualImportPath,
} from "./entry";
import { maybeAwait } from "./promise";

export type ExportMap = {
  [virtualImportPath: VirtualImportPath]: ConditionalExportPaths;
};

export type ExportMapRef = {
  exportMap: ExportMap;
};

export async function generateExportMapByContext(
  context: Context,
): Promise<ExportMap>
{
  let exportMap: ExportMap = {};

  await generateEntriesByContext(
    context,
    async (
      entry: Entry,
    ): Promise<void> =>
    {
      await requestAggregatingExportMapByContext(
        context,
        exportMap,
        entry,
      );
    },
  );

  const exportMapRef: ExportMapRef = {
    exportMap,
  };

  await requestSortingExportMapByContext(
    context,
    exportMapRef,
  );

  exportMap = exportMapRef.exportMap;

  await reportExportMapByContext(
    context,
    exportMap,
  );

  return exportMap;
}

export async function reportExportMapByContext(
  context: Context,
  exportMap: ExportMap,
): Promise<void>
{
  for (const reportExportMap of context.hooks.extension.reportExportMap)
  {
    await maybeAwait(
      reportExportMap(
        context,
        exportMap,
      ),
    );
  }
}

export async function requestAggregatingExportMapByContext(
  context: Context,
  exportMap: ExportMap,
  entry: Entry,
): Promise<void>
{
  for (const aggregateExportMap of context.hooks.extension.aggregateExportMap)
  {
    await maybeAwait(
      aggregateExportMap(
        context,
        exportMap,
        entry,
      ),
    );
  }
}

export async function requestSortingExportMapByContext(
  context: Context,
  exportMapRef: ExportMapRef,
): Promise<void>
{
  for (const sortExportMap of context.hooks.extension.sortExportMap)
  {
    await maybeAwait(
      sortExportMap(
        context,
        exportMapRef,
      ),
    );
  }
}
