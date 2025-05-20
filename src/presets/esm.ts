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

export const PRESET_UID_ESM = "builtin:ESM";

export type ESMPresetOptions = JSPresetOptions;

export class ESMPreset extends JSPreset
{
  uid = PRESET_UID_ESM;

  getDefaultConditionsByExtension(
    extension: ConditionalImportPathExtension,
  ): ImportCondition[]
  {
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
    return ".mjs";
  }

  getDefaultDistPath(
    context: Context,
  ): PathLike
  {
    return joinPaths(
      "dist",
      "esm",
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

export function createESMPreset(
  options?: ESMPresetOptions | null,
): ESMPreset
{
  return new ESMPreset(options);
}

export default createESMPreset;
