# export-map-generator

## 2.0.1

### Patch Changes

- Fixed a caching issue that could cause CI to publish stale code. Caching
  behavior is now deterministic to ensure correct code is always released.

## 2.0.0

### Major Changes

- Rename `backup` option of `PackageJSONUpdaterExtension` to `safe` for clearer
  intent.

### Minor Changes

- Add `trailingNewLine` option to `PackageJSONUpdaterExtension`.
