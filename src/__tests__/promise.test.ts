import { maybeAwait } from "../promise";

describe(
  "maybeAwait",
  () =>
  {
    it(
      "should return the value if it's not a promise",
      async () =>
      {
        const value = 42;
        const result = await maybeAwait(value);

        expect(result).toBe(value);
      },
    );

    it(
      "should return the resolved value if it's a promise",
      async () =>
      {
        const value = 42;

        const result = await maybeAwait(
          new Promise(
            (resolve) =>
            {
              resolve(value);
            },
          ),
        );

        expect(result).toBe(value);
      },
    );
  },
);
