import {
  basename,
  dirname,
  relative as getRelativePath,
} from "node:path";
import {
  join as joinPosixPaths,
  basename as posixBasename,
  dirname as posixDirname,
} from "node:path/posix";
import {
  join as joinWin32Paths,
  basename as win32Basename,
  dirname as win32Dirname,
} from "node:path/win32";
import { fileURLToPath } from "node:url";

import {
  convertPathLikeToString,
  convertPathToPOSIX,
  enforceRelativePathSpecifier,
  isPathLike,
  joinPaths,
  PATH_SEPARATOR,
  POSIX_PATH_SEPARATOR,
  rebasePath,
  relatePath,
  resolvePath,
  resolvePathOrFallback,
} from "../path";

const __cwd = process.cwd();

const __filename = fileURLToPath(import.meta.url);

describe(
  "convertPathLikeToString",
  () =>
  {
    it(
      "should return given string as is",
      () =>
      {
        const path = convertPathLikeToString(__filename);
        expect(path).toBe(__filename);
      },
    );

    it(
      "should convert a URL object to a string",
      () =>
      {
        const path = convertPathLikeToString(new URL(import.meta.url));
        expect(path).toBe(__filename);
      },
    );

    it(
      "should convert a Buffer to a string",
      () =>
      {
        const path = convertPathLikeToString(Buffer.from(__filename));
        expect(path).toBe(__filename);
      },
    );
  },
);

describe(
  "convertPathToPOSIX",
  () =>
  {
    it(
      "should convert native absolute path to POSIX path",
      () =>
      {
        const nativePath = __filename;
        const nativePathSegments = nativePath.split(PATH_SEPARATOR);

        const posixPath = convertPathToPOSIX(nativePath);
        const posixPathSegments = posixPath.split(POSIX_PATH_SEPARATOR);

        expect(nativePathSegments).toStrictEqual(posixPathSegments);
      },
    );

    it(
      "should convert native relative path to POSIX path",
      () =>
      {
        const nativePath = joinPaths(
          basename(dirname(__filename)),
          basename(__filename),
        );
        const nativePathSegments = nativePath.split(PATH_SEPARATOR);

        const posixPath = convertPathToPOSIX(nativePath);
        const posixPathSegments = posixPath.split(POSIX_PATH_SEPARATOR);

        expect(nativePathSegments).toStrictEqual(posixPathSegments);
      },
    );

    it(
      "should return POSIX absolute path as is",
      () =>
      {
        const nativePath = joinPosixPaths(
          "/",
          "a",
          "b",
          "c",
        );

        const posixPath = convertPathToPOSIX(
          nativePath,
          posixBasename,
          posixDirname,
        );

        expect(posixPath).toBe(nativePath);
      },
    );

    it(
      "should return POSIX relative path as is",
      () =>
      {
        const posixPath = joinPosixPaths(
          "a",
          "b",
          "c",
        );

        const result = convertPathToPOSIX(
          posixPath,
          posixBasename,
          posixDirname,
        );

        expect(result).toBe(posixPath);
      },
    );

    it(
      "should convert Win32 absolute path to POSIX path",
      () =>
      {
        const win32Path = joinWin32Paths(
          "\\",
          "a",
          "b",
          "c",
        );

        const posixPath = joinPosixPaths(
          "/",
          "a",
          "b",
          "c",
        );

        const result = convertPathToPOSIX(
          win32Path,
          win32Basename,
          win32Dirname,
        );

        expect(result).toBe(posixPath);
      },
    );

    it(
      "should convert Win32 absolute path with drive letter to POSIX path",
      () =>
      {
        const win32Path = joinWin32Paths(
          "C:\\",
          "a",
          "b",
          "c",
        );

        const posixPath = joinPosixPaths(
          "/",
          "a",
          "b",
          "c",
        );

        const result = convertPathToPOSIX(
          win32Path,
          win32Basename,
          win32Dirname,
        );

        expect(result).toBe(posixPath);
      },
    );

    it(
      "should convert Win32 relative path to POSIX path",
      () =>
      {
        const win32Path = joinWin32Paths(
          "a",
          "b",
          "c",
        );

        const posixPath = joinPosixPaths(
          "a",
          "b",
          "c",
        );

        const result = convertPathToPOSIX(
          win32Path,
          win32Basename,
          win32Dirname,
        );

        expect(result).toBe(posixPath);
      },
    );
  },
);

describe(
  "enforceRelativePathSpecifier",
  () =>
  {
    it(
      "should return the path as is if it already equals `.`",
      () =>
      {
        const path = ".";
        const result = enforceRelativePathSpecifier(path);
        expect(result).toBe(path);
      },
    );

    it(
      "should return the path as is if it already starts with a `./` prefix",
      () =>
      {
        const path = "./path/to/file";
        const result = enforceRelativePathSpecifier(path);
        expect(result).toBe(path);
      },
    );

    it(
      "should return the path prefixed with `./` if it is relative but does not start with `./`",
      () =>
      {
        const path = "path/to/file";
        const expected = `.${PATH_SEPARATOR}${path}`;
        const result = enforceRelativePathSpecifier(path);
        expect(result).toBe(expected);
      },
    );

    it(
      "should prepend the specifier to the path with custom separator if it is relative but does not start with the specifier",
      () =>
      {
        const path = "path/to/file";
        const expected = `.${POSIX_PATH_SEPARATOR}${path}`;

        const result = enforceRelativePathSpecifier(
          path,
          POSIX_PATH_SEPARATOR,
        );

        expect(result).toBe(expected);
      },
    );

    it(
      "should return the path as is if it is absolute",
      () =>
      {
        const result = enforceRelativePathSpecifier(__cwd);
        expect(result).toBe(__cwd);
      },
    );
  },
);

describe(
  "isPathLike",
  () =>
  {
    it(
      "should return true for string paths",
      () =>
      {
        const result = isPathLike(__filename);
        expect(result).toBe(true);
      },
    );

    it(
      "should return true for URL objects",
      () =>
      {
        const result = isPathLike(new URL(import.meta.url));
        expect(result).toBe(true);
      },
    );

    it(
      "should return true for Buffer objects",
      () =>
      {
        const result = isPathLike(Buffer.from(__filename));
        expect(result).toBe(true);
      },
    );

    it(
      "should return false for non-path-like objects",
      () =>
      {
        const result = isPathLike({ not: "a path" });
        expect(result).toBe(false);
      },
    );
  },
);

describe(
  "rebasePath",
  () =>
  {
    it(
      "should return the relative path from the base path to the target path",
      () =>
      {
        const currentBasePath = joinPaths(
          __cwd,
          "dist",
        );

        const newBasePath = joinPaths(
          __cwd,
          "src",
        );

        const relativePath = joinPaths(
          "a",
          "b.js",
        );

        const fullPath = joinPaths(
          currentBasePath,
          relativePath,
        );

        const rebasedFullPath = joinPaths(
          newBasePath,
          "a",
          "b.js",
        );

        const rebasedRelativePath = getRelativePath(
          __cwd,
          rebasedFullPath,
        );

        const expectedRebasedRelativePath = joinPaths(
          "src",
          "a",
          "b.js",
        );

        expect(rebasedRelativePath).toBe(expectedRebasedRelativePath);

        const result = rebasePath(
          __cwd,
          currentBasePath,
          newBasePath,
          fullPath,
        );

        expect(result).toBe(expectedRebasedRelativePath);
      },
    );
  },
);

describe(
  "relatePath",
  () =>
  {
    it(
      "should return the relative path from the base path to the target path",
      () =>
      {
        const relativePath = joinPaths(
          "dist",
          "file.js",
        );

        const fullPath = joinPaths(
          __cwd,
          relativePath,
        );

        const result = relatePath(
          __cwd,
          fullPath,
        );

        expect(result).toBe(relativePath);
      },
    );
  },
);

describe(
  "resolvePathOrFallback",
  () =>
  {
    it(
      "should return the fallback path if the path is null",
      () =>
      {
        const result = resolvePathOrFallback(
          undefined,
          __cwd,
        );

        expect(result).toBe(__cwd);
      },
    );

    it(
      "should return the resolved fallback path with the trailing fallback segments if the path is null",
      () =>
      {
        const trailing = [
          "folder1",
          "folder2",
          "file1",
        ];

        const expected = resolvePath(
          __cwd,
          ...trailing,
        );

        const result = resolvePathOrFallback(
          undefined,
          __cwd,
          ...trailing,
        );

        expect(result).toBe(expected);
      },
    );

    it(
      "should return the resolved path based on the fallback path if the path is relative",
      () =>
      {
        const path = "dist";

        const expected = resolvePath(
          __cwd,
          path,
        );

        const result = resolvePathOrFallback(
          path,
          __cwd,
        );

        expect(result).toBe(expected);
      },
    );

    it(
      "should return the given path if the path is absolute",
      () =>
      {
        const path = joinPaths(
          __cwd,
          "dist",
        );

        const result = resolvePathOrFallback(
          path,
          __cwd,
        );

        expect(result).toBe(path);
      },
    );

    it(
      "should return the resolved path based on the fallback path without the trailing fallback segments if the path is relative",
      () =>
      {
        const path = "dist";

        const trailing = [
          "folder1",
          "folder2",
          "file1",
        ];

        const expected = resolvePath(
          __cwd,
          path,
        );

        const result = resolvePathOrFallback(
          path,
          __cwd,
          ...trailing,
        );

        expect(result).toBe(expected);
      },
    );

    it(
      "should return the given path without the trailing fallback segments if the path is absolute",
      () =>
      {
        const path = joinPaths(
          __cwd,
          "dist",
        );

        const trailing = [
          "folder1",
          "folder2",
          "file1",
        ];

        const expected = resolvePath(
          __cwd,
          path,
        );

        const result = resolvePathOrFallback(
          path,
          __cwd,
          ...trailing,
        );

        expect(result).toBe(expected);
      },
    );
  },
);
