import type {
  AggregateExportMapFunction,
  HandleEntryByDirentRefFunction,
  HandleEntryFunction,
  ProduceDirentRefsFunction,
  ProduceEntriesByDirentRefFunction,
  ProduceEntriesFunction,
  ReportExportMapFunction,
  ResolveConfigFunction,
  ResolveContextFunction,
  SetupFunction,
  SortExportMapFunction,
} from "./extension";

export type ExtensionHooks = {
  aggregateExportMap: AggregateExportMapFunction[];
  handleEntry: HandleEntryFunction[];
  handleEntryByDirentRef: HandleEntryByDirentRefFunction[];
  produceDirentRefs: ProduceDirentRefsFunction[];
  produceEntries: ProduceEntriesFunction[];
  produceEntriesByDirentRef: ProduceEntriesByDirentRefFunction[];
  reportExportMap: ReportExportMapFunction[];
  resolveConfig: ResolveConfigFunction[];
  resolveContext: ResolveContextFunction[];
  setup: SetupFunction[];
  sortExportMap: SortExportMapFunction[];
};

export type Hooks = {
  extension: ExtensionHooks;
};

export function createHooks(): Hooks
{
  return {
    extension: {
      /* eslint-disable perfectionist/sort-objects */
      setup: [],
      resolveConfig: [],
      resolveContext: [],
      produceDirentRefs: [],
      produceEntriesByDirentRef: [],
      produceEntries: [],
      handleEntryByDirentRef: [],
      handleEntry: [],
      aggregateExportMap: [],
      sortExportMap: [],
      reportExportMap: [],
      /* eslint-enable perfectionist/sort-objects */
    },
  };
}
