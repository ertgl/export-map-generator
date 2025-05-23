# export-map-generator

## 2.1.0

### Minor Changes

- Added `JSONPreset` class to support automatic entry generation for `.json`
  files.

## 2.0.1

### Patch Changes

- Fixed a caching issue that could cause CI to publish stale code. Caching
  behavior is now deterministic to ensure correct code is always released.

## 2.0.0

### Major Changes

- Renamed `backup` option of `PackageJSONUpdaterExtension` to `safe` for clearer
  intent.

### Minor Changes

- Added `trailingNewLine` option to `PackageJSONUpdaterExtension`.
