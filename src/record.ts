import { getSortedArrayByPattern } from "./array";

export function getSortedRecordByPattern<
  T_Data extends Record<string, unknown> = Record<string, unknown>,
>(
  data: T_Data,
  leadingPattern: Iterable<string>,
  trailingPattern: Iterable<string>,
): T_Data
{
  const newData: Record<string, unknown> = {};

  const sortedKeys = getSortedArrayByPattern<
    string,
    string,
    string
  >(
    Object.keys(data),
    leadingPattern,
    trailingPattern,
  );

  for (const key of sortedKeys)
  {
    if (key in data)
    {
      newData[key] = data[key];
    }
  }

  return newData as T_Data;
}

export function setRecordKeyInPlace<
  T extends Record<string, unknown>,
  K extends string,
  V,
  R extends Omit<T, K> & { [key in K]: V },
>(
  data: T,
  key: K,
  value: V,
): R
{
  const newData: Record<string, unknown> = {};

  let isValueUpdatedInTheLoop = false;

  for (const [currentKey, currentValue] of Object.entries(data))
  {
    if (currentKey === key)
    {
      newData[currentKey] = value;
      isValueUpdatedInTheLoop = true;
    }
    else
    {
      newData[currentKey] = currentValue;
    }
  }

  if (!isValueUpdatedInTheLoop)
  {
    newData[key] = value;
  }

  return newData as R;
}
