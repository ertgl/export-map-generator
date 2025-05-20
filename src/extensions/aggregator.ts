import type { Context } from "../context";
import {
  type ConditionalExportPaths,
  deriveConditionalExportPaths,
  type Entry,
} from "../entry";
import type { ExportMap } from "../export-map";
import { AbstractExtension } from "../extension";

export const EXTENSION_UID_AGGREGATOR = "builtin:Aggregator";

export class AggregatorExtension extends AbstractExtension
{
  uid = EXTENSION_UID_AGGREGATOR;

  aggregateExportMap(
    context: Context,
    exportMap: ExportMap,
    entry: Entry,
  ): void
  {
    const existingConditionalExportPaths = (
      (exportMap[entry.virtualImportPath] as ConditionalExportPaths | undefined)
      ?? {}
    );

    exportMap[entry.virtualImportPath] = deriveConditionalExportPaths(
      existingConditionalExportPaths,
      entry.conditionalExportPaths,
    );
  }
}

export function createAggregatorExtension(): AggregatorExtension
{
  return new AggregatorExtension();
}

export default createAggregatorExtension;
