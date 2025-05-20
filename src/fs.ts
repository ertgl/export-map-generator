import {
  access as accessFunction,
  close as closeFunction,
  fsync as fsyncFunction,
  open as openFunction,
  type OpenMode,
  readdir as readdirFunction,
  readFile as readFileFunction,
  rename as renameFunction,
  unlink as unlinkFunction,
  write as writeFunction,
} from "node:fs";
import { dirname } from "node:path";
export type { OpenMode } from "node:fs";

import type { Dirent } from "./dirent";
import {
  convertPathLikeToString,
  parsePath,
  type PathLike,
  resolvePath,
} from "./path";
import { suppressErrors } from "./runtime";
import { replaceSuffix } from "./string";

export const STATE_FILE_PATH_EXTENSION = ".state";

export const SAFE_FILE_WRITER_DEFAULT_ENCODING: BufferEncoding = "utf-8";

export type CustomFileSystem = (
  & SafeFileWriterResolvedFS
  & UnsafeFileWriterResolvedFS
  & {
    readdir: typeof readdirFunction;
    readFile: typeof readFileFunction;
  }
);

export type PartialCustomFileSystem = (
  & SafeFileWriterFS
  & UnsafeFileWriterFS
  & {
    readdir?: null | typeof readdirFunction;
    readFile?: null | typeof readFileFunction;
  }
);

export type SafeFileWriterFS = {
  access?: null | typeof accessFunction;
  close?: null | typeof closeFunction;
  fsync?: null | typeof fsyncFunction;
  open?: null | typeof openFunction;
  rename?: null | typeof renameFunction;
  unlink?: null | typeof unlinkFunction;
  write?: null | typeof writeFunction;
};

export type SafeFileWriterOptions = {
  encoding?: BufferEncoding | null;
  filePathExtension?: null | string;
  fs?: null | SafeFileWriterFS;
  fsyncDirectory?: boolean | null;
  fsyncFile?: boolean | null;
  stateFilePathExtension?: null | string;
};

export type SafeFileWriterResolvedFS = {
  access: typeof accessFunction;
  close: typeof closeFunction;
  fsync: typeof fsyncFunction;
  open: typeof openFunction;
  rename: typeof renameFunction;
  unlink: typeof unlinkFunction;
  write: typeof writeFunction;
};

export type UnsafeFileWriterFS = {
  close?: null | typeof closeFunction;
  fsync?: null | typeof fsyncFunction;
  open?: null | typeof openFunction;
  write?: null | typeof writeFunction;
};

export type UnsafeFileWriterOptions = {
  encoding?: BufferEncoding | null;
  fs?: null | UnsafeFileWriterFS;
  fsync?: boolean | null;
};

export type UnsafeFileWriterResolvedFS = {
  close: typeof closeFunction;
  fsync: typeof fsyncFunction;
  open: typeof openFunction;
  write: typeof writeFunction;
};

export async function accessPromisified(
  access: typeof accessFunction,
  pathLike: PathLike,
  mode: number,
): Promise<void>
{
  const path = convertPathLikeToString(pathLike);

  return new Promise<void>(
    (
      resolve,
      reject,
    ) =>
    {
      access(
        path,
        mode,
        (
          err,
        ) =>
        {
          /* istanbul ignore else */
          if (err)
          {
            reject(err);
          }
          else
          {
            resolve();
          }
        },
      );
    },
  );
}

export async function closePromisified(
  close: typeof closeFunction,
  fd: number,
): Promise<void>
{
  return new Promise<void>(
    (
      resolve,
      reject,
    ) =>
    {
      close(
        fd,
        (err) =>
        {
          if (err)
          {
            reject(err);
          }
          else
          {
            resolve();
          }
        },
      );
    },
  );
}

export function createCustomFileSystem(
  overrides?: null | PartialCustomFileSystem,
): CustomFileSystem
{
  overrides ??= {};

  return {
    access: overrides.access ?? accessFunction,
    close: overrides.close ?? closeFunction,
    fsync: overrides.fsync ?? fsyncFunction,
    open: overrides.open ?? openFunction,
    readdir: overrides.readdir ?? readdirFunction,
    readFile: overrides.readFile ?? readFileFunction,
    rename: overrides.rename ?? renameFunction,
    unlink: overrides.unlink ?? unlinkFunction,
    write: overrides.write ?? writeFunction,
  };
}

export async function fsyncPromisified(
  fsync: typeof fsyncFunction,
  fd: number,
): Promise<void>
{
  return new Promise<void>(
    (
      resolve,
      reject,
    ) =>
    {
      fsync(
        fd,
        (err) =>
        {
          if (err)
          {
            reject(err);
          }
          else
          {
            resolve();
          }
        },
      );
    },
  );
}

export async function openPromisified(
  open: typeof openFunction,
  pathLike: PathLike,
  flags: OpenMode,
): Promise<number>
{
  const path = convertPathLikeToString(pathLike);

  return new Promise<number>(
    (
      resolve,
      reject,
    ) =>
    {
      open(
        path,
        flags,
        (
          err,
          fd,
        ) =>
        {
          if (err)
          {
            reject(err);
          }
          else
          {
            resolve(fd);
          }
        },
      );
    },
  );
}

export async function readdirPromisified(
  readdir: null | typeof readdirFunction | undefined,
  pathLike: PathLike,
): Promise<Dirent[]>
{
  readdir ??= readdirFunction;

  return await new Promise<Dirent[]>(
    (
      resolve,
      reject,
    ) =>
    {
      readdir(
        pathLike,
        {
          recursive: false,
          withFileTypes: true,
        },
        (
          err,
          dirents,
        ) =>
        {
          if (err)
          {
            reject(err);
          }
          else
          {
            resolve(dirents);
          }
        },
      );
    },
  );
}

export async function readFilePromisified(
  readFile: null | typeof readFileFunction | undefined,
  pathLike: PathLike,
  encoding?: BufferEncoding | null,
): Promise<string>
{
  readFile ??= readFileFunction;

  encoding ??= SAFE_FILE_WRITER_DEFAULT_ENCODING;

  const path = convertPathLikeToString(pathLike);

  return new Promise<string>(
    (
      resolve,
      reject,
    ) =>
    {
      readFile(
        path,
        encoding,
        (
          err,
          data,
        ) =>
        {
          if (err)
          {
            reject(err);
          }
          else
          {
            resolve(data);
          }
        },
      );
    },
  );
}

export async function renamePromisified(
  rename: typeof renameFunction,
  currentFilePathLike: PathLike,
  newFilePathLike: PathLike,
): Promise<void>
{
  const currentPath = convertPathLikeToString(currentFilePathLike);
  const newPath = convertPathLikeToString(newFilePathLike);

  return new Promise<void>(
    (
      resolve,
      reject,
    ) =>
    {
      rename(
        currentPath,
        newPath,
        (err) =>
        {
          if (err)
          {
            reject(err);
          }
          else
          {
            resolve();
          }
        },
      );
    },
  );
}

export function resolveSafeFileWriterFS(
  fs?: null | SafeFileWriterFS,
): SafeFileWriterResolvedFS
{
  fs ??= {};

  return {
    access: fs.access ?? accessFunction,
    close: fs.close ?? closeFunction,
    fsync: fs.fsync ?? fsyncFunction,
    open: fs.open ?? openFunction,
    rename: fs.rename ?? renameFunction,
    unlink: fs.unlink ?? unlinkFunction,
    write: fs.write ?? writeFunction,
  };
}

export function resolveUnsafeFileWriterFS(
  fs?: null | UnsafeFileWriterFS,
): UnsafeFileWriterResolvedFS
{
  fs ??= {};

  return {
    close: fs.close ?? closeFunction,
    fsync: fs.fsync ?? fsyncFunction,
    open: fs.open ?? openFunction,
    write: fs.write ?? writeFunction,
  };
}

export async function unlinkPromisified(
  unlink: typeof unlinkFunction,
  pathLike: PathLike,
): Promise<void>
{
  const path = convertPathLikeToString(pathLike);

  return new Promise<void>(
    (
      resolve,
      reject,
    ) =>
    {
      unlink(
        path,
        (
          err,
        ) =>
        {
          if (err)
          {
            reject(err);
          }
          else
          {
            resolve();
          }
        },
      );
    },
  );
}

export async function writeFileSafe(
  pathLike: PathLike,
  data: string,
  options?: null | SafeFileWriterOptions,
): Promise<void>
{
  options ??= {};

  const fs = resolveSafeFileWriterFS(options.fs);

  const path = convertPathLikeToString(pathLike);
  const parsedPath = parsePath(path);

  const currentExtension = (
    options.filePathExtension
    ?? parsedPath.ext
  );

  const stateFilePathExtensionSuffix = (
    options.stateFilePathExtension
    ?? STATE_FILE_PATH_EXTENSION
  );

  const stateFilePathExtension = `${currentExtension}${stateFilePathExtensionSuffix}`;

  const stateFileName = replaceSuffix(
    parsedPath.base,
    currentExtension,
    stateFilePathExtension,
  );

  const stateFilePath = resolvePath(
    parsedPath.dir,
    stateFileName,
  );

  const encoding = (
    options.encoding
    ?? SAFE_FILE_WRITER_DEFAULT_ENCODING
  );

  const fd = await openPromisified(
    fs.open,
    stateFilePath,
    "w",
  );

  try
  {
    await writePromisified(
      fs.write,
      fd,
      data,
      encoding,
    );

    if (options.fsyncFile ?? true)
    {
      try
      {
        await fsyncPromisified(
          fs.fsync,
          fd,
        );
      }
      catch (err)
      {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (typeof global.process?.emitWarning === "function")
        {
          const err2 = new Error(`Failed to fsync file: ${stateFilePath}`);
          err2.cause = err;
          process.emitWarning(err2);
        }
      }
    }

    if (options.fsyncDirectory ?? false)
    {
      await suppressErrors(
        async () =>
        {
          const directoryPath = dirname(path);

          const fd2 = await openPromisified(
            fs.open,
            directoryPath,
            "r",
          );

          try
          {
            await fsyncPromisified(
              fs.fsync,
              fd2,
            );
          }
          catch (err)
          {
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            if (typeof global.process?.emitWarning === "function")
            {
              const err2 = new Error(`Failed to fsync directory: ${directoryPath}`);
              err2.cause = err;
              process.emitWarning(err2);
            }
          }
          finally
          {
            await closePromisified(
              fs.close,
              fd2,
            );
          }
        },
      );
    }
  }
  finally
  {
    await closePromisified(
      fs.close,
      fd,
    );

    await renamePromisified(
      fs.rename,
      stateFilePath,
      path,
    );

    await suppressErrors(
      async () =>
      {
        const stateFileExists = await accessPromisified(
          fs.access,
          stateFilePath,
          0,
        ).then(
          () => true,
          () => false,
        );

        if (!stateFileExists)
        {
          return;
        }

        try
        {
          await unlinkPromisified(
            fs.unlink,
            stateFilePath,
          );
        }
        catch (err)
        {
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          if (typeof global.process?.emitWarning === "function")
          {
            const err2 = new Error(`Failed to remove file: ${stateFilePath}`);
            err2.cause = err;
            process.emitWarning(err2);
          }
        }
      },
    );
  }
}

export async function writeFileUnsafe(
  pathLike: PathLike,
  data: string,
  options?: null | UnsafeFileWriterOptions,
): Promise<void>
{
  options ??= {};

  const fs = resolveSafeFileWriterFS(options.fs);

  const path = convertPathLikeToString(pathLike);

  const encoding = (
    options.encoding
    ?? SAFE_FILE_WRITER_DEFAULT_ENCODING
  );

  const fd = await openPromisified(
    fs.open,
    path,
    "w",
  );

  try
  {
    await writePromisified(
      fs.write,
      fd,
      data,
      encoding,
    );

    if (options.fsync ?? false)
    {
      try
      {
        await fsyncPromisified(
          fs.fsync,
          fd,
        );
      }
      catch (err)
      {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (typeof global.process?.emitWarning === "function")
        {
          const err2 = new Error(`Failed to fsync file: ${path}`);
          err2.cause = err;
          process.emitWarning(err2);
        }
      }
    }
  }
  finally
  {
    await closePromisified(
      fs.close,
      fd,
    );
  }
}

export async function writePromisified(
  write: typeof writeFunction,
  fd: number,
  data: string,
  encoding: BufferEncoding,
): Promise<void>
{
  return new Promise<void>(
    (
      resolve,
      reject,
    ) =>
    {
      write(
        fd,
        data,
        0,
        encoding,
        (
          err,
          written,
          buffer,
        ) =>
        {
          if (err)
          {
            reject(err);
          }
          else
          {
            resolve();
          }
        },
      );
    },
  );
}
