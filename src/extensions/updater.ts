import { readFile as readFileFunction } from "node:fs";

import type { Context } from "../context";
import { resolvePathFromCWD } from "../cwd";
import type { ExportMap } from "../export-map";
import { AbstractExtension } from "../extension";
import {
  readFilePromisified,
  type SafeFileWriterFS,
  type SafeFileWriterOptions,
  writeFileSafe,
  writeFileUnsafe,
} from "../fs";
import { type PathLike } from "../path";
import { setRecordKeyInPlace } from "../record";

export const EXTENSION_UID_PACKAGE_JSON_UPDATER = "builtin:PackageJSONUpdater";

export type PackageJSON = Record<string, unknown>;

export type PackageJSONFileUpdaterExtensionFS = (
  & SafeFileWriterFS
  & {
    readFile?: null | typeof readFileFunction;
  }
);

export type PackageJSONUpdaterExtensionOptions = {
  encoding?: BufferEncoding | null;
  fs?: null | PackageJSONFileUpdaterExtensionFS;
  fsync?: boolean | null;
  indent?: null | number;
  packageJSONFilePath?: null | PathLike;
  safe?: boolean | null | Omit<SafeFileWriterOptions, "encoding" | "fs">;
  trailingNewLine?: "auto" | boolean | null;
};

export class PackageJSONUpdaterExtension extends AbstractExtension
{
  options: PackageJSONUpdaterExtensionOptions;

  uid = EXTENSION_UID_PACKAGE_JSON_UPDATER;

  constructor(
    options?: null | PackageJSONUpdaterExtensionOptions,
  )
  {
    super();

    this.options = options ?? {};
  }

  async reportExportMap(
    context: Context,
    exportMap: ExportMap,
  ): Promise<void>
  {
    if (context.dryRun)
    {
      return;
    }

    const fs = this.options.fs ?? {};

    const resolvedPackageJSONFilePath = resolvePathFromCWD(
      context.paths.cwd,
      (
        this.options.packageJSONFilePath
        ?? "package.json"
      ),
    );

    const packageJSONFileContent = await readFilePromisified(
      (
        fs.readFile
        ?? context.fs.readFile
      ),
      resolvedPackageJSONFilePath,
      this.options.encoding,
    );

    const packageJSON = JSON.parse(
      packageJSONFileContent,
    ) as PackageJSON;

    const newPackageJSON = setRecordKeyInPlace(
      packageJSON,
      "exports",
      exportMap,
    );

    let newPackageJSONFileContent = JSON.stringify(
      newPackageJSON,
      null,
      this.options.indent ?? 2,
    );

    const trailingNewLine = this.options.trailingNewLine ?? "auto";

    if (trailingNewLine === "auto")
    {
      if (packageJSONFileContent.endsWith("\n"))
      {
        newPackageJSONFileContent += "\n";
      }
    }
    else if (trailingNewLine)
    {
      newPackageJSONFileContent += "\n";
    }

    if (this.options.safe ?? false)
    {
      const safeFileWriterOptions = (
        this.options.safe === true
          ? {}
          : this.options.safe ?? {}
      );

      await writeFileSafe(
        resolvedPackageJSONFilePath,
        newPackageJSONFileContent,
        {
          ...safeFileWriterOptions,
          encoding: this.options.encoding ?? "utf-8",
          fs: {
            access: fs.access ?? context.fs.access,
            close: fs.close ?? context.fs.close,
            fsync: fs.fsync ?? context.fs.fsync,
            open: fs.open ?? context.fs.open,
            rename: fs.rename ?? context.fs.rename,
            unlink: fs.unlink ?? context.fs.unlink,
            write: fs.write ?? context.fs.write,
          },
        },
      );
    }
    else
    {
      await writeFileUnsafe(
        resolvedPackageJSONFilePath,
        newPackageJSONFileContent,
        {
          encoding: this.options.encoding ?? "utf-8",
          fs: {
            close: fs.close ?? context.fs.close,
            fsync: fs.fsync ?? context.fs.fsync,
            open: fs.open ?? context.fs.open,
            write: fs.write ?? context.fs.write,
          },
          fsync: this.options.fsync ?? false,
        },
      );
    }
  }
}

export function createPackageJSONUpdaterExtension(
  options?: null | PackageJSONUpdaterExtensionOptions,
): PackageJSONUpdaterExtension
{
  return new PackageJSONUpdaterExtension(options);
}

export default createPackageJSONUpdaterExtension;
