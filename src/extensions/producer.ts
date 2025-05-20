import type { readdir as readdirFunction } from "node:fs";

import type { Context } from "../context";
import { resolvePathFromCWD } from "../cwd";
import {
  type DirentRef,
  getDirentFullPath,
} from "../dirent";
import {
  AbstractExtension,
  type EmitDirentRefFunction,
} from "../extension";
import { readdirPromisified } from "../fs";
import {
  parsePath,
  type Path,
  type PathLike,
} from "../path";

export const EXTENSION_UID_DEPTH_FIRST_DIRENT_PRODUCER = "builtin:DepthFirstDirentProducer";

export type DepthFirstDirentProducerExtensionFS = {
  readdir?: null | typeof readdirFunction;
};

export type DepthFirstDirentProducerExtensionOptions = {
  fs?: DepthFirstDirentProducerExtensionFS | null;
  rootPath: PathLike;
};

export class DepthFirstDirentProducerExtension extends AbstractExtension
{
  options: DepthFirstDirentProducerExtensionOptions;

  uid = EXTENSION_UID_DEPTH_FIRST_DIRENT_PRODUCER;

  constructor(
    options: DepthFirstDirentProducerExtensionOptions,
  )
  {
    super();

    this.options = options;
  }

  async produceDirentRefs(
    context: Context,
    emit: EmitDirentRefFunction,
  ): Promise<void>
  {
    const resolvedRootPath = resolvePathFromCWD(
      context.paths.cwd,
      this.options.rootPath,
    );

    await this.traverse(
      (
        this.options.fs?.readdir
        ?? context.fs.readdir
      ),
      context.paths.cwd,
      resolvedRootPath,
      resolvedRootPath,
      emit,
    );
  }

  async traverse(
    readdir: null | typeof readdirFunction | undefined,
    cwd: Path,
    rootPath: Path,
    path: Path,
    callback: EmitDirentRefFunction,
  ): Promise<void>
  {
    const dirents = await readdirPromisified(
      readdir,
      path,
    );

    const deferredDirectories: DirentRef[] = [];
    const deferredFiles: DirentRef[] = [];

    for (const dirent of dirents)
    {
      const direntFullPath = getDirentFullPath(dirent);

      const direntRef: DirentRef = {
        cwd,
        dirent,
        fullPath: direntFullPath,
        parsedPath: parsePath(direntFullPath),
        rootPath,
      };

      if (dirent.isDirectory())
      {
        await this.traverse(
          readdir,
          cwd,
          rootPath,
          direntFullPath,
          callback,
        );

        deferredDirectories.push(direntRef);

        continue;
      }

      if (dirent.isFile())
      {
        deferredFiles.push(direntRef);
      }
    }

    for (const direntRef of deferredFiles)
    {
      await callback(direntRef);
    }

    for (const direntRef of deferredDirectories)
    {
      await callback(direntRef);
    }
  }
}

export function createDepthFirstDirentProducerExtension(
  options: DepthFirstDirentProducerExtensionOptions,
): DepthFirstDirentProducerExtension
{
  return new DepthFirstDirentProducerExtension(options);
}

export default createDepthFirstDirentProducerExtension;
