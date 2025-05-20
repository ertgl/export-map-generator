export function orderStringsByLongestPrefix(
  strings: string[],
): void
{
  strings.sort(
    (
      a,
      b,
    ) =>
    {
      if (a.startsWith(b))
      {
        return -1;
      }

      if (b.startsWith(a))
      {
        return 1;
      }

      if (a < b)
      {
        return -1;
      }

      return 1;
    },
  );
}

export function replaceSuffix(
  str: string,
  suffix: string,
  replacement: string,
): string
{
  if ((replacement as string | undefined) == null)
  {
    return str;
  }

  if (!str.endsWith(suffix))
  {
    return str;
  }

  return str.substring(
    0,
    str.length - suffix.length,
  ) + replacement;
}
