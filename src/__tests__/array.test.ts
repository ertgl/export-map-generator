import { getSortedArrayByPattern } from "../array";

describe(
  "getSortedArrayByPattern",
  () =>
  {
    it(
      "should be testable with ordering equality",
      () =>
      {
        expect([0, 1]).not.toStrictEqual([1, 0]);
      },
    );

    it(
      "should sort the array by the pattern (leading)",
      () =>
      {
        const result = getSortedArrayByPattern(
          [0, 1, 2, 3, 4, 5],
          [3, 1, 4, 2, 5],
          [],
        );

        expect(
          result,
        ).toStrictEqual(
          [3, 1, 4, 2, 5, 0],
        );
      },
    );

    it(
      "should sort the array by the pattern (trailing)",
      () =>
      {
        const result = getSortedArrayByPattern(
          [1, 2, 3, 4, 5, 0],
          [],
          [3, 1, 4, 2, 5],
        );

        expect(
          result,
        ).toStrictEqual(
          [0, 3, 1, 4, 2, 5],
        );
      },
    );

    it(
      "should sort the array by the pattern (leading, trailing)",
      () =>
      {
        const result = getSortedArrayByPattern(
          [1, 2, 3, 4, 5, 0],
          [3, 1, 4, 0],
          [4, 2, 5],
        );

        expect(
          result,
        ).toStrictEqual(
          [3, 1, 4, 0, 2, 5],
        );
      },
    );

    it(
      "should sort the array by the pattern (leading, middle, trailing)",
      () =>
      {
        const result = getSortedArrayByPattern(
          [1, 2, 3, 4, 5, 0],
          [3, 1, 4],
          [4, 2, 5],
        );

        expect(
          result,
        ).toStrictEqual(
          [3, 1, 4, 0, 2, 5],
        );
      },
    );
  },
);
