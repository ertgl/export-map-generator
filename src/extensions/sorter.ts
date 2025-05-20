import type { Context } from "../context";
import type {
  ExportMap,
  ExportMapRef,
} from "../export-map";
import { AbstractExtension } from "../extension";
import { getSortedRecordByPattern } from "../record";
import { orderStringsByLongestPrefix } from "../string";

export const EXTENSION_UID_SORTER = "builtin:Sorter";

export type SorterExtensionOptions = {
  leadingConditions?: null | string[];
  trailingConditions?: null | string[];
};

export type SorterExtensionResolvedOptions = {
  leadingConditions: string[];
  trailingConditions: string[];
};

export class SorterExtension extends AbstractExtension
{
  options: SorterExtensionResolvedOptions;

  uid = EXTENSION_UID_SORTER;

  constructor(
    options?: null | SorterExtensionOptions,
  )
  {
    super();

    this.options = resolveSorterExtensionOptions(
      options,
    );
  }

  sortExportMap(
    context: Context,
    exportMapRef: ExportMapRef,
  ): void
  {
    const sortedVirtualImportPaths = Array.from(
      Object.keys(
        exportMapRef.exportMap,
      ),
    );

    orderStringsByLongestPrefix(sortedVirtualImportPaths);

    const newExportMap: ExportMap = {};

    for (const virtualImportPath of sortedVirtualImportPaths)
    {
      newExportMap[virtualImportPath] = getSortedRecordByPattern(
        exportMapRef.exportMap[virtualImportPath],
        this.options.leadingConditions,
        this.options.trailingConditions,
      );
    }

    exportMapRef.exportMap = newExportMap;
  }
}

export function createSorterExtension(
  options?: null | SorterExtensionOptions,
): SorterExtension
{
  return new SorterExtension(options);
}

export function getSorterExtensionDefaultLeadingConditions(): string[]
{
  return [
    "sass",
    "style",
    "types",
    "import",
    "require",
  ];
}

export function getSorterExtensionDefaultTrailingConditions(): string[]
{
  return [
    "node",
    "browser",
    "default",
  ];
}

export function resolveSorterExtensionOptions(
  options?: null | SorterExtensionOptions,
): SorterExtensionResolvedOptions
{
  options ??= {};

  return {
    leadingConditions: (
      options.leadingConditions
      ?? getSorterExtensionDefaultLeadingConditions()
    ),
    trailingConditions: (
      options.trailingConditions
      ?? getSorterExtensionDefaultTrailingConditions()
    ),
  };
}

export default createSorterExtension;
