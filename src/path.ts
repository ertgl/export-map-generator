import type {
  PathLike as PathLike_,
} from "node:fs";
import {
  basename,
  dirname,
  relative as getRelativePath,
  isAbsolute as isAbsolutePath,
  normalize as normalizePath,
  sep as PATH_SEPARATOR,
  resolve as resolvePath,
} from "node:path";
export {
  isAbsolute as isAbsolutePath,
  join as joinPaths,
  type ParsedPath,
  parse as parsePath,
  sep as PATH_SEPARATOR,
  resolve as resolvePath,
} from "node:path";
import { sep as POSIX_PATH_SEPARATOR } from "node:path/posix";
import { fileURLToPath } from "node:url";
export { sep as POSIX_PATH_SEPARATOR } from "node:path/posix";

export type Path = string;

export type PathLike = PathLike_;

export function convertPathLikeToString(
  pathLike: PathLike,
): Path
{
  if (typeof pathLike === "string")
  {
    return normalizePath(pathLike);
  }

  if (pathLike instanceof URL)
  {
    return normalizePath(
      fileURLToPath(
        pathLike,
      ),
    );
  }

  return normalizePath(
    pathLike.toString(),
  );
}

export function convertPathToPOSIX(
  path: PathLike,
  basenameFunction?: null | typeof basename,
  dirnameFunction?: null | typeof dirname,
): Path
{
  return getPathSegments(
    path,
    basenameFunction,
    dirnameFunction,
  ).join(
    POSIX_PATH_SEPARATOR,
  );
}

export function enforceRelativePathSpecifier(
  pathLike: PathLike,
  separator?: null | string,
): Path
{
  separator ??= PATH_SEPARATOR;

  const path = convertPathLikeToString(pathLike);

  if (isAbsolutePath(path))
  {
    return path;
  }

  const currentDirectoryPrefix = `.${separator}`;
  const parentDirectoryPrefix = `..${separator}`;

  if (
    path === "."
    || path.startsWith(currentDirectoryPrefix)
    || path.startsWith(parentDirectoryPrefix)
  )
  {
    return path;
  }

  return `${currentDirectoryPrefix}${path}`;
}

export function getPathSegments(
  pathLike: PathLike,
  basenameFunction?: null | typeof basename,
  dirnameFunction?: null | typeof dirname,
): Path[]
{
  basenameFunction ??= basename;
  dirnameFunction ??= dirname;

  const path = convertPathLikeToString(pathLike);

  const reversedSegments: Path[] = [];

  let currentPath = path;
  let isRootReached = false;

  while (!isRootReached)
  {
    const segment = basenameFunction(currentPath);
    reversedSegments.push(segment);
    const parentPath = dirnameFunction(currentPath);
    isRootReached = (
      parentPath === currentPath
      || parentPath === "."
    );
    currentPath = parentPath;
  }

  return reversedSegments.reverse();
}

export function isPathLike(
  pathLike: unknown,
): pathLike is PathLike
{
  return (
    typeof pathLike === "string"
    || pathLike instanceof URL
    || Buffer.isBuffer(pathLike)
  );
}

export function maybeConvertPathLikeToString(
  pathLike?: null | PathLike,
): Path
{
  if (pathLike == null)
  {
    return "";
  }

  return convertPathLikeToString(pathLike);
}

export function rebasePath(
  rootPath: PathLike,
  currentBasePath: PathLike,
  newBasePath: PathLike,
  path: PathLike,
): Path
{
  return getRelativePath(
    convertPathLikeToString(rootPath),
    resolvePath(
      convertPathLikeToString(newBasePath),
      relatePath(
        currentBasePath,
        path,
      ),
    ),
  );
}

export function relatePath(
  from: PathLike,
  to: PathLike,
): Path
{
  return getRelativePath(
    convertPathLikeToString(from),
    convertPathLikeToString(to),
  );
}

export function resolvePathOrFallback(
  path: null | PathLike | undefined,
  fallbackPath: PathLike,
  ...fallbackSegments: PathLike[]
): Path
{
  const pathString = maybeConvertPathLikeToString(path);

  const fallbackPathString = convertPathLikeToString(fallbackPath);

  if (path != null)
  {
    if (isAbsolutePath(pathString))
    {
      return pathString;
    }

    return resolvePath(
      fallbackPathString,
      pathString,
    );
  }

  const fallbackSegmentsAsStrings = fallbackSegments.map(
    convertPathLikeToString,
  );

  return resolvePath(
    fallbackPathString,
    ...fallbackSegmentsAsStrings,
  );
}
