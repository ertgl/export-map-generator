export function shuffleArray(
  array: unknown[],
): void
{
  array.sort(
    () =>
    {
      return Math.random() - 0.5;
    },
  );
}
