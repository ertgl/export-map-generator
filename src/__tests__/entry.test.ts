import {
  type ConditionalExportPaths,
  createEntry,
  deriveConditionalExportPaths,
  deriveEntry,
  normalizeConditionalExportPath,
  normalizeConditionalExportPathOrAlternation,
  normalizeVirtualImportPath,
} from "../entry";

describe(
  "createEntry",
  () =>
  {
    it(
      "should create entry with empty conditional export paths",
      () =>
      {
        const virtualImportPath = "a/b/c";
        const entry = createEntry(virtualImportPath);

        expect(entry.virtualImportPath).toEqual(virtualImportPath);
        expect(entry.conditionalExportPaths).toEqual({});
        expect(entry.state).toEqual({});
      },
    );
  },
);

describe(
  "deriveEntry",
  () =>
  {
    it(
      "should copy entry",
      () =>
      {
        const entry = createEntry(
          "a/b/c",
          {
            condition0: "a/b/c/0",
            condition1: "a/b/c/1",
          },
        );

        const copiedEntry = deriveEntry(entry);

        expect(copiedEntry).toEqual(entry);
      },
    );

    it(
      "should copy entry and override given keys",
      () =>
      {
        const entry = createEntry(
          "a/b/c",
          {
            condition0: "a/b/c/0",
            condition1: "a/b/c/1",
          },
        );

        const copiedEntry = deriveEntry(
          entry,
          {
            state: {
              overridden: true,
            },
          },
        );

        expect(copiedEntry).not.toEqual(entry);
      },
    );
  },
);

describe(
  "deriveConditionalExportPaths",
  () =>
  {
    it(
      "should copy conditional export paths",
      () =>
      {
        const conditionalExportPaths: ConditionalExportPaths = {
          condition0: "a/b/c/0",
          condition1: [
            "a/b/c/1",
            "a/b/c/1.0",
            "a/b/c/1.1",
          ],
        };

        const copiedConditionalExportPaths = deriveConditionalExportPaths(
          conditionalExportPaths,
        );

        expect(
          copiedConditionalExportPaths,
        ).toEqual(
          conditionalExportPaths,
        );
      },
    );

    it(
      "should copy conditional export paths and override given keys",
      () =>
      {
        const conditionalExportPaths: ConditionalExportPaths = {
          condition0: "a/b/c/0",
          condition1: "a/b/c/1",
        };

        const copiedConditionalExportPaths = deriveConditionalExportPaths(
          conditionalExportPaths,
          {
            condition2: "a/b/c/2",
          },
        );

        expect(
          copiedConditionalExportPaths,
        ).not.toStrictEqual(
          conditionalExportPaths,
        );
      },
    );
  },
);

describe(
  "normalizeConditionalExportPath",
  () =>
  {
    it(
      "should enforce relative path specifier for empty conditional export paths",
      () =>
      {
        const path = "";
        const normalizedPath = normalizeConditionalExportPath(path);
        expect(normalizedPath).toBe(".");
      },
    );

    it(
      "should enforce relative path specifier for non-empty conditional export paths",
      () =>
      {
        const path = "a/b/c";
        const normalizedPath = normalizeConditionalExportPath(path);
        expect(normalizedPath).toBe(`./${path}`);
      },
    );
  },
);

describe(
  "normalizeConditionalExportPathOrAlternation",
  () =>
  {
    it(
      "should normalize single conditional export path",
      () =>
      {
        const path = "a/b/c";
        const normalizedPath = normalizeConditionalExportPathOrAlternation(path);

        expect(normalizedPath).toBe(`./${path}`);
      },
    );

    it(
      "should normalize single conditional empty export path",
      () =>
      {
        const path = "";
        const normalizedPath = normalizeConditionalExportPathOrAlternation(
          path,
        );

        expect(normalizedPath).toBe(".");
      },
    );

    it(
      "should normalize conditional export paths alternation",
      () =>
      {
        const paths = [
          "a/b/c",
          "a/b/d",
        ];

        const normalizedPaths = normalizeConditionalExportPathOrAlternation(
          paths,
        );

        expect(
          normalizedPaths,
        ).toEqual(
          paths.map(
            (path) => `./${path}`,
          ),
        );
      },
    );
  },
);

describe(
  "normalizeVirtualImportPath",
  () =>
  {
    it(
      "should enforce relative path specifier for empty conditional export paths",
      () =>
      {
        const path = "";
        const normalizedPath = normalizeVirtualImportPath(path);
        expect(normalizedPath).toBe(".");
      },
    );

    it(
      "should enforce relative path specifier for non-empty conditional export paths",
      () =>
      {
        const path = "a/b/c";
        const normalizedPath = normalizeVirtualImportPath(path);
        expect(normalizedPath).toBe(`./${path}`);
      },
    );
  },
);
