import {
  convertPathLikeToString,
  type Path,
  type PathLike,
  resolvePathOrFallback,
} from "./path";

export function resolveCWD(
  cwd?: null | PathLike,
  fallbackCWD?: null | PathLike,
): Path
{
  fallbackCWD ??= process.cwd();

  if (cwd == null)
  {
    return convertPathLikeToString(fallbackCWD);
  }

  return resolvePathOrFallback(
    cwd,
    fallbackCWD,
  );
}

export function resolvePathFromCWD(
  cwd: null | PathLike | undefined,
  path: null | PathLike | undefined,
  ...fallbackSegments: PathLike[]
): Path
{
  return resolvePathOrFallback(
    path,
    resolveCWD(cwd),
    ...fallbackSegments,
  );
}
