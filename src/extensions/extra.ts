import type { Context } from "../context";
import {
  createEntry as createEntryFunction,
  type CreateEntryFunction,
  type Entry,
  normalizeEntry,
} from "../entry";
import {
  AbstractExtension,
  type EmitEntryFunction,
  type EmitEntrySyncFunction,
} from "../extension";
import { maybeAwait } from "../promise";

export const EXTENSION_UID_EXTRA_ENTRY_EMITTER = "builtin:ExtraEntryEmitter";

export type ExtraEntryEmitterExtensionOptions = {
  produce?: ExtraEntryProducerFunction | null;
};

export type ExtraEntryProducerAsyncFunction = (
  context: Context,
  emit: EmitEntrySyncFunction,
  createEntry: CreateEntryFunction,
) => Promise<void>;

export type ExtraEntryProducerFunction = (
  | ExtraEntryProducerAsyncFunction
  | ExtraEntryProducerSyncFunction
);

export type ExtraEntryProducerSyncFunction = (
  context: Context,
  emit: EmitEntrySyncFunction,
  createEntry: CreateEntryFunction,
) => void;

export class ExtraEntryEmitterExtension extends AbstractExtension
{
  options: ExtraEntryEmitterExtensionOptions;

  uid = EXTENSION_UID_EXTRA_ENTRY_EMITTER;

  constructor(
    options?: ExtraEntryEmitterExtensionOptions | null,
  )
  {
    super();

    this.options = options ?? {};
  }

  async produceEntries(
    context: Context,
    emit: EmitEntryFunction,
  ): Promise<void>
  {
    const deferred: Entry[] = [];

    await maybeAwait(
      this.options.produce?.(
        context,
        deferred.push.bind(deferred),
        createEntryFunction,
      ),
    );

    for (const entry of deferred)
    {
      await maybeAwait(
        emit(
          normalizeEntry(
            entry,
          ),
        ),
      );
    }
  }
}

export function createExtraEntryEmitterExtension(
  options?: ExtraEntryEmitterExtensionOptions | null,
): ExtraEntryEmitterExtension
{
  return new ExtraEntryEmitterExtension(options);
}

export default createExtraEntryEmitterExtension;
