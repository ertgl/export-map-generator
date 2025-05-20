import {
  resolveCWD,
  resolvePathFromCWD,
} from "../cwd";
import { resolvePath } from "../path";

const __cwd = process.cwd();

describe(
  "resolveCWD",
  () =>
  {
    it(
      "should return the current working directory from process when no path is given",
      () =>
      {
        const result = resolveCWD();

        expect(result).toBe(__cwd);
      },
    );

    it(
      "should return the given path when it is absolute",
      () =>
      {
        const absolutePath = "/absolute/path";
        const result = resolveCWD(absolutePath);

        expect(result).toBe(absolutePath);
      },
    );

    it(
      "should return the resolved path when it is relative",
      () =>
      {
        const relativePath = "./relative/path";
        const expected = resolvePath(__cwd, relativePath);
        const result = resolveCWD(relativePath);

        expect(result).toBe(expected);
      },
    );
  },
);

describe(
  "resolvePathFromCWD",
  () =>
  {
    it(
      "should return the resolved path from the current working directory",
      () =>
      {
        const relativePath = "./relative/path";
        const expected = resolvePath(__cwd, relativePath);
        const result = resolvePathFromCWD(__cwd, relativePath);

        expect(result).toBe(expected);
      },
    );

    it(
      "should return the absolute path when given an absolute path",
      () =>
      {
        const absolutePath = "/absolute/path";
        const result = resolvePathFromCWD(__cwd, absolutePath);

        expect(result).toBe(absolutePath);
      },
    );
  },
);
