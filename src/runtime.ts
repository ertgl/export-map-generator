import { maybeAwait } from "./promise";

export async function suppressErrors(
  f: () => Promise<void> | void,
): Promise<void>
{
  try
  {
    await maybeAwait(f());
  }
  catch
  {}
}
