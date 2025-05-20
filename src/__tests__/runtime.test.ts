import { suppressErrors } from "../runtime";

describe(
  "suppressErrors",
  () =>
  {
    it(
      "should suppress errors",
      async () =>
      {
        await expect(
          suppressErrors(
            // eslint-disable-next-line @typescript-eslint/require-await
            async () =>
            {
              throw new Error("Test error");
            },
          ),
        ).resolves.not.toThrow();
      },
    );
  },
);
