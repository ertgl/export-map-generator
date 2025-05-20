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
  GenericPreset,
  type GenericPresetOptions,
} from "./generic";

export const PRESET_UID_DTS = "builtin:DTS";

export type DTSPresetOptions = GenericPresetOptions;

export class DTSPreset extends GenericPreset
{
  uid = PRESET_UID_DTS;

  getDefaultConditionsByExtension(
    extension: ConditionalImportPathExtension,
  ): ImportCondition[]
  {
    if (extension === ".d.ts")
    {
      return [
        "types",
        "default",
      ];
    }

    return [
      "default",
    ];
  }

  getDefaultDistExtension(): ConditionalImportPathExtension
  {
    return ".d.ts";
  }

  getDefaultDistPath(
    context: Context,
  ): PathLike
  {
    return joinPaths(
      "dist",
      "types",
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
      ".d.ts",
      ".js",
      ".mjs",
    ];
  }
}

export function createDTSPreset(
  options?: DTSPresetOptions | null,
): DTSPreset
{
  return new DTSPreset(options);
}

export default createDTSPreset;
