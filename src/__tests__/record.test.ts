import {
  getSortedRecordByPattern,
  setRecordKeyInPlace,
} from "../record";

describe(
  "getSortedRecordByPattern",
  () =>
  {
    it(
      "should be testable with ordering equality",
      () =>
      {
        expect(
          Object.keys(
            {
              a: 1,
              b: 2,
            },
          ),
        ).not.toStrictEqual(
          Object.keys(
            {
              /* eslint-disable perfectionist/sort-objects */
              b: 2,
              a: 1,
              /* eslint-enable perfectionist/sort-objects */
            },
          ),
        );
      },
    );

    it(
      "should sort the keys by the pattern (leading)",
      () =>
      {
        const result = getSortedRecordByPattern(
          { a: 0, b: 1, c: 2, d: 3, e: 4, f: 5 },
          ["d", "b", "e", "c", "f"],
          [],
        );

        expect(
          Array.from(
            Object.keys(
              result,
            ),
          ),
        ).toStrictEqual(
          ["d", "b", "e", "c", "f", "a"],
        );
      },
    );

    it(
      "should sort the keys by the pattern (trailing)",
      () =>
      {
        const result = getSortedRecordByPattern(
          { a: 0, b: 1, c: 2, d: 3, e: 4, f: 5 },
          [],
          ["d", "b", "e", "c", "f"],
        );

        expect(
          Array.from(
            Object.keys(
              result,
            ),
          ),
        ).toStrictEqual(
          ["a", "d", "b", "e", "c", "f"],
        );
      },
    );

    it(
      "should sort the keys by the pattern (leading, trailing)",
      () =>
      {
        const result = getSortedRecordByPattern(
          { a: 0, b: 1, c: 2, d: 3, e: 4, f: 5 },
          ["d", "b", "e", "a"],
          ["e", "c", "f"],
        );

        expect(
          Array.from(
            Object.keys(
              result,
            ),
          ),
        ).toStrictEqual(
          ["d", "b", "e", "a", "c", "f"],
        );
      },
    );

    it(
      "should sort the keys by the pattern (leading, middle, trailing)",
      () =>
      {
        const result = getSortedRecordByPattern(
          { a: 0, b: 1, c: 2, d: 3, e: 4, f: 5 },
          ["d", "b", "e"],
          ["e", "c", "f"],
        );

        expect(
          Array.from(
            Object.keys(
              result,
            ),
          ),
        ).toStrictEqual(
          ["d", "b", "e", "a", "c", "f"],
        );
      },
    );
  },
);

describe(
  "setRecordKeyInPlace",
  () =>
  {
    it(
      "should update the key without moving it",
      () =>
      {
        const result = setRecordKeyInPlace(
          { a: 0, b: 1, c: 2, d: 3, e: 4, f: 5 },
          "d",
          4,
        );

        expect(result.d).toBe(4);

        expect(
          Array.from(
            Object.keys(
              result,
            ),
          ),
        ).toStrictEqual(
          ["a", "b", "c", "d", "e", "f"],
        );
      },
    );

    it(
      "should append the key if it does not exist",
      () =>
      {
        const result = setRecordKeyInPlace(
          { a: 0, b: 1, c: 2, d: 3, e: 4, f: 5 },
          "g",
          5,
        );

        expect(result.g).toBe(5);

        expect(
          Array.from(
            Object.keys(
              result,
            ),
          ),
        ).toStrictEqual(
          ["a", "b", "c", "d", "e", "f", "g"],
        );
      },
    );
  },
);
