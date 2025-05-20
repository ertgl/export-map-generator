import type { Context } from "../context";
import type {
  ConditionalImportPathExtension,
  ImportCondition,
  VirtualImportPathExtension,
} from "../entry";
import {
  joinPaths,
  type PathLike,
} from "../path";

import {
  JSPreset,
  type JSPresetOptions,
} from "./js";

export const PRESET_UID_CJS = "builtin:CJS";

export type CJSPresetOptions = JSPresetOptions;

export class CJSPreset extends JSPreset
{
  uid = PRESET_UID_CJS;

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

    return [
      "default",
    ];
  }

  getDefaultDistExtension(): ConditionalImportPathExtension
  {
    return ".cjs";
  }

  getDefaultDistPath(
    context: Context,
  ): PathLike
  {
    return joinPaths(
      "dist",
      "cjs",
    );
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

export function createCJSPreset(
  options?: CJSPresetOptions | null,
): CJSPreset
{
  return new CJSPreset(options);
}

export default createCJSPreset;
