import {
  basename,
  dirname,
} from "node:path";

import { CWD } from "../../__constants__/paths";
import {
  type Dirent,
  type DirentRef,
  getDirentFullPath,
} from "../../../dirent";
import {
  parsePath,
  type Path,
} from "../../../path";

export function getSampleDirectoryDirent(
  path: Path,
): Dirent
{
  const parentPath = dirname(path);

  return {
    isBlockDevice: () => false,
    isCharacterDevice: () => false,
    isDirectory: () => true,
    isFIFO: () => false,
    isFile: () => false,
    isSocket: () => false,
    isSymbolicLink: () => false,
    name: basename(path),
    parentPath,
    path: parentPath,
  };
}

export function getSampleDirentRef(
  dirent: Dirent,
  rootPath: Path,
): DirentRef
{
  const fullPath = getDirentFullPath(dirent);

  return {
    cwd: CWD,
    dirent,
    fullPath,
    parsedPath: parsePath(fullPath),
    rootPath,
  };
}

export function getSampleFileDirent(
  path: Path,
): Dirent
{
  const parentPath = dirname(path);

  return {
    isBlockDevice: () => false,
    isCharacterDevice: () => false,
    isDirectory: () => false,
    isFIFO: () => false,
    isFile: () => true,
    isSocket: () => false,
    isSymbolicLink: () => false,
    name: basename(path),
    parentPath,
    path: parentPath,
  };
}
