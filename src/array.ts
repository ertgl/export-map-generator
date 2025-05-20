export function getSortedArrayByPattern<
  T_Segment = unknown,
  T_LeadingPatternSegment = unknown,
  T_TrailingPatternSegment = unknown,
  T_Data extends Iterable<T_Segment> = Iterable<T_Segment>,
  T_LeadingPattern extends Iterable<T_LeadingPatternSegment> = Iterable<T_LeadingPatternSegment>,
  T_TrailingPattern extends Iterable<T_TrailingPatternSegment> = Iterable<T_TrailingPatternSegment>,
  T_ReturnType extends Iterable<T_LeadingPatternSegment | T_Segment | T_TrailingPatternSegment> = Iterable<T_LeadingPatternSegment | T_Segment | T_TrailingPatternSegment>,
>(
  data: T_Data,
  leadingPattern: T_LeadingPattern,
  trailingPattern: T_TrailingPattern,
): T_ReturnType
{
  const leading = new Set<T_LeadingPatternSegment | T_Segment>(leadingPattern);
  const trailing = new Set<T_Segment | T_TrailingPatternSegment>(trailingPattern);
  const middle = new Set<T_Segment>();

  for (const segment of data)
  {
    if (!leading.has(segment) && !trailing.has(segment))
    {
      middle.add(segment);
    }
  }

  return Array.from(
    leading.union(
      middle,
    ).union(
      trailing,
    ),
  ) as unknown as T_ReturnType;
}
