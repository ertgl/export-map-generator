import type { Config } from "./config";
import type { Context } from "./context";
import { maybeAwait } from "./promise";

export type AugmentPresetContextAsyncFunction = (
  context: Context,
  config: Config,
) => Promise<void>;

export type AugmentPresetContextFunction = (
  | AugmentPresetContextAsyncFunction
  | AugmentPresetContextSyncFunction
);

export type AugmentPresetContextSyncFunction = (
  context: Context,
  config: Config,
) => void;

export type Preset = {
  augmentContext: AugmentPresetContextFunction;
  uid?: null | string;
};

export abstract class AbstractPreset implements Preset
{
  abstract readonly uid?: null | string;

  abstract augmentContext(
    context: Context,
    config: Config,
  ): Promise<void> | void;
}

export async function bindPreset(
  context: Context,
  config: Config,
  preset: Preset,
): Promise<void>
{
  context.presets.push(preset);

  await maybeAwait(
    preset.augmentContext(
      context,
      config,
    ),
  );
}

export async function bindPresets(
  context: Context,
  config: Config,
  presets: (false | null | Preset | undefined)[] | null | undefined,
): Promise<void>
{
  if (presets == null)
  {
    return;
  }

  for (const preset of presets)
  {
    if (preset)
    {
      await bindPreset(
        context,
        config,
        preset,
      );
    }
  }
}
