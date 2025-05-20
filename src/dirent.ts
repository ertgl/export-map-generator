export type { Dirent } from "node:fs";
import type { Dirent } from "node:fs";

import type { Context } from "./context";
import type { EmitDirentRefFunction } from "./extension";
import {
  type ParsedPath,
  type Path,
  rebasePath,
  resolvePath,
} from "./path";
import { maybeAwait } from "./promise";

export type DirentRef = {
  cwd: Path;
  dirent: Dirent;
  fullPath: Path;
  parsedPath: ParsedPath;
  rootPath: Path;
};

export function getDirentFullPath(
  dirent: Dirent,
): Path
{
  return resolvePath(
    dirent.parentPath,
    dirent.name,
  );
}

export function getRebasedDirentRelativePath(
  direntRef: DirentRef,
  newBasePath: Path,
): Path
{
  return rebasePath(
    direntRef.cwd,
    direntRef.rootPath,
    newBasePath,
    direntRef.fullPath,
  );
}

export async function requestDirentRefsByContext(
  context: Context,
  emitDirentRef: EmitDirentRefFunction,
): Promise<void>
{
  for (const produceDirentRefs of context.hooks.extension.produceDirentRefs)
  {
    await maybeAwait(
      produceDirentRefs(
        context,
        emitDirentRef,
      ),
    );
  }
}
