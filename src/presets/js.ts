import type { Context } from "../context";
import type {
  ConditionalImportPathExtension,
  ImportCondition,
  VirtualImportPathExtension,
} from "../entry";
import type { PathLike } from "../path";

import {
  GenericPreset,
  type GenericPresetOptions,
} from "./generic";

export const PRESET_UID_JS = "builtin:JS";

export type JSPresetOptions = GenericPresetOptions;

export class JSPreset extends GenericPreset
{
  uid = PRESET_UID_JS;

  getDefaultConditionsByExtension(
    extension: ConditionalImportPathExtension,
  ): ImportCondition[]
  {
    if (extension === ".cjs")
    {
      return [
        "require",
        "default",
      ];
    }

    if (extension === ".js")
    {
      return [
        "import",
        "require",
        "default",
      ];
    }

    if (extension === ".mjs")
    {
      return [
        "import",
        "default",
      ];
    }

    return [
      "default",
    ];
  }

  getDefaultDistExtension(): ConditionalImportPathExtension
  {
    return ".js";
  }

  getDefaultDistPath(
    context: Context,
  ): PathLike
  {
    return "dist";
  }

  getDefaultSrcExtension(): ConditionalImportPathExtension
  {
    return ".js";
  }

  getDefaultSrcPath(
    context: Context,
  ): PathLike
  {
    return "src";
  }

  getDefaultVirtualExtensions(): VirtualImportPathExtension[]
  {
    return [
      "",
      ".cjs",
      ".js",
      ".mjs",
    ];
  }
}

export function createJSPreset(
  options?: JSPresetOptions | null,
): JSPreset
{
  return new JSPreset(options);
}

export default createJSPreset;
