import {
  orderStringsByLongestPrefix,
  replaceSuffix,
} from "../string";

import { shuffleArray } from "./__utils__/shuffle-array";

describe(
  "orderStringsByLongestPrefix",
  () =>
  {
    it(
      "should group file name extensions by common prefix alphabetically (asc), and sort the groups by length internally (desc)",
      () =>
      {
        const fileNameExtensions = Array.from(
          Object.keys(
            {
              "": true,
              ".d.ts": true,
              ".js": true,
              ".json": true,
              ".jsx": true,
              ".module.css": true,
              ".ts": true,
              ".tsx": true,
            },
          ),
        );

        fileNameExtensions.push(".ts");

        for (let i = 0; i < 100; i++)
        {
          fileNameExtensions.reverse();
          shuffleArray(fileNameExtensions);
          shuffleArray(fileNameExtensions);
          shuffleArray(fileNameExtensions);
          shuffleArray(fileNameExtensions);

          orderStringsByLongestPrefix(fileNameExtensions);

          expect(fileNameExtensions.length).toBe(9);

          expect(fileNameExtensions[0]).toBe(".d.ts");
          expect(fileNameExtensions[1]).toBe(".json");
          expect(fileNameExtensions[2]).toBe(".jsx");
          expect(fileNameExtensions[3]).toBe(".js");
          expect(fileNameExtensions[4]).toBe(".module.css");
          expect(fileNameExtensions[5]).toBe(".tsx");
          expect(fileNameExtensions[6]).toBe(".ts");
          expect(fileNameExtensions[7]).toBe(".ts");
          expect(fileNameExtensions[8]).toBe("");
        }
      },
    );
  },
);

describe(
  "replaceSuffix",
  () =>
  {
    it(
      "should replace the suffix with the replacement string",
      () =>
      {
        const base = "example";
        const suffix = ".d.ts";
        const name = `${base}${suffix}`;

        const replacement = ".ts";

        const expected = `${base}${replacement}`;

        const result = replaceSuffix(
          name,
          suffix,
          replacement as unknown as string,
        );

        expect(result).toBe(expected);
      },
    );

    it(
      "should return the original string if the suffix is not found",
      () =>
      {
        const suffix1 = ".md";
        const suffix2 = ".js";

        expect(suffix1).not.toBe(suffix2);

        const base = "example";
        const name = `${base}${suffix1}`;

        const result = replaceSuffix(
          name,
          suffix2,
          suffix1,
        );

        expect(result).toBe(name);
      },
    );

    it(
      "should not stringify undefined or null values",
      () =>
      {
        const base = "example";
        const suffix = ".md";
        const name = `${base}${suffix}`;

        const replacement = undefined;

        const result = replaceSuffix(
          name,
          suffix,
          replacement as unknown as string,
        );

        expect(result).toBe(name);
      },
    );
  },
);
