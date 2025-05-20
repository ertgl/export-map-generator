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

export const PRESET_UID_CSS = "builtin:CSS";

export type CSSPresetOptions = GenericPresetOptions;

export class CSSPreset extends GenericPreset
{
  uid = PRESET_UID_CSS;

  getDefaultConditionsByExtension(
    extension: ConditionalImportPathExtension,
  ): ImportCondition[]
  {
    if (extension === ".css")
    {
      return [
        "style",
        "default",
      ];
    }

    if (extension === ".sass" || extension === ".scss")
    {
      return [
        "sass",
        "default",
      ];
    }

    return [
      "default",
    ];
  }

  getDefaultDistExtension(): ConditionalImportPathExtension
  {
    return ".css";
  }

  getDefaultDistPath(
    context: Context,
  ): PathLike
  {
    return "dist";
  }

  getDefaultSrcExtension(): ConditionalImportPathExtension
  {
    return ".css";
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
      ".css",
    ];
  }
}

export function createCSSPreset(
  options?: CSSPresetOptions | null,
): CSSPreset
{
  return new CSSPreset(options);
}

export default createCSSPreset;
