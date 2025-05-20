import { relative as getRelativePath } from "node:path";

import {
  getDirentFullPath,
  getRebasedDirentRelativePath,
} from "../dirent";
import { resolvePath } from "../path";

import { CWD } from "./__constants__/paths";
import {
  getSampleDirectoryDirent,
  getSampleDirentRef,
  getSampleFileDirent,
} from "./__data__/samples/dirent";

describe(
  "getDirentFullPath",
  () =>
  {
    it(
      "should iterate over directory entries in depth-first order",
      () =>
      {
        const path = resolvePath(
          CWD,
          "dist",
          "cjs",
        );

        const dirent = getSampleDirectoryDirent(path);

        const result = getDirentFullPath(dirent);

        expect(
          result,
        ).toBe(
          resolvePath(
            dirent.parentPath,
            dirent.name,
          ),
        );
      },
    );
  },
);

describe(
  "getRebasedDirentRelativePath",
  () =>
  {
    it(
      "should rebase the full path of a dirent to a new base path",
      () =>
      {
        const currentBasePath = resolvePath(
          CWD,
          "dist",
          "cjs",
        );

        const path = resolvePath(
          currentBasePath,
          "index.cjs",
        );

        const relativePath = getRelativePath(
          currentBasePath,
          path,
        );

        const newBasePath = resolvePath(
          CWD,
          "src",
        );

        const dirent = getSampleFileDirent(path);

        const direntRef = getSampleDirentRef(
          dirent,
          currentBasePath,
        );

        const result = getRebasedDirentRelativePath(
          direntRef,
          newBasePath,
        );

        const expected = getRelativePath(
          CWD,
          resolvePath(
            newBasePath,
            relativePath,
          ),
        );

        expect(result).toBe(expected);
      },
    );
  },
);
