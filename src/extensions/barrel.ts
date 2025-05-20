import type { Context } from "../context";
import type { DirentRef } from "../dirent";
import {
  deriveEntry,
  type Entry,
  normalizeVirtualImportPath,
  type VirtualImportPath,
} from "../entry";
import {
  AbstractExtension,
  type EmitEntryFunction,
} from "../extension";
import { relatePath } from "../path";
import { maybeAwait } from "../promise";

export const EXTENSION_UID_BARREL = "builtin:Barrel";

export const ENTRY_STATE_KEY_IS_DERIVED_FROM_BARREL_FILE = "isDerivedFromBarrelFile";

export const ENTRY_STATE_KEY_IS_DERIVED_FROM_BARREL_DIRECTORY = "isDerivedFromBarrelDirectory";

export class BarrelExtension extends AbstractExtension
{
  uid = EXTENSION_UID_BARREL;

  private registry: Record<VirtualImportPath, Entry>;

  constructor()
  {
    super();

    this.registry = {};
  }

  async handleEntryByDirentRef(
    context: Context,
    direntRef: DirentRef,
    entry: Entry,
    emitEntry: EmitEntryFunction,
  ): Promise<void>
  {
    if (entry.state[ENTRY_STATE_KEY_IS_DERIVED_FROM_BARREL_DIRECTORY])
    {
      return;
    }

    const virtualImportPath = relatePath(
      direntRef.rootPath,
      direntRef.fullPath,
    );

    if (virtualImportPath in this.registry)
    {
      const copiedEntry = this.registry[virtualImportPath];

      const normalizedVirtualBarrelImportPath = normalizeVirtualImportPath(
        virtualImportPath,
      );

      await maybeAwait(
        emitEntry(
          deriveEntry(
            copiedEntry,
            {
              conditionalExportPaths: entry.conditionalExportPaths,
              state: {
                ...entry.state,
                [ENTRY_STATE_KEY_IS_DERIVED_FROM_BARREL_DIRECTORY]: true,
              },
              virtualImportPath: normalizedVirtualBarrelImportPath,
            },
          ),
        ),
      );

      return;
    }

    if (entry.state[ENTRY_STATE_KEY_IS_DERIVED_FROM_BARREL_FILE])
    {
      return;
    }

    if (!direntRef.dirent.isFile())
    {
      return;
    }

    const isIndexFile = (
      direntRef.parsedPath.name === "index"
      || direntRef.parsedPath.name.startsWith("index.")
    );

    if (!isIndexFile)
    {
      return;
    }

    const virtualBarrelImportPath = relatePath(
      direntRef.rootPath,
      direntRef.dirent.parentPath,
    );

    this.registry[virtualBarrelImportPath] = deriveEntry(
      entry,
      {
        state: {
          [ENTRY_STATE_KEY_IS_DERIVED_FROM_BARREL_FILE]: true,
        },
      },
    );

    const normalizedVirtualBarrelImportPath = normalizeVirtualImportPath(
      virtualBarrelImportPath,
    );

    await maybeAwait(
      emitEntry(
        deriveEntry(
          entry,
          {
            state: {
              [ENTRY_STATE_KEY_IS_DERIVED_FROM_BARREL_FILE]: true,
            },
            virtualImportPath: normalizedVirtualBarrelImportPath,
          },
        ),
      ),
    );
  }
}

export function createBarrelExtension(): BarrelExtension
{
  return new BarrelExtension();
}

export default createBarrelExtension;
