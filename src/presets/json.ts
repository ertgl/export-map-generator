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

export const PRESET_UID_JSON = "builtin:JSON";

export type JSONPresetOptions = GenericPresetOptions;

export class JSONPreset extends GenericPreset
{
  uid = PRESET_UID_JSON;

  getDefaultConditionsByExtension(
    extension: ConditionalImportPathExtension,
  ): ImportCondition[]
  {
    if (extension === ".json")
    {
      return [
        "import",
        "require",
        "default",
      ];
    }

    return [
      "default",
    ];
  }

  getDefaultDistExtension(): ConditionalImportPathExtension
  {
    return ".json";
  }

  getDefaultDistPath(
    context: Context,
  ): PathLike
  {
    return "dist";
  }

  getDefaultSrcExtension(): ConditionalImportPathExtension
  {
    return ".json";
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
      ".json",
    ];
  }
}

export function createJSONPreset(
  options?: JSONPresetOptions | null,
): JSONPreset
{
  return new JSONPreset(options);
}

export default createJSONPreset;
