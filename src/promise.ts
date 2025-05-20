export async function maybeAwait<T>(
  value: Promise<T> | T,
): Promise<T>
{
  if (value instanceof Promise)
  {
    return await value;
  }

  return value;
}
