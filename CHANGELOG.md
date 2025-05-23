# export-map-generator

## 2.1.1

### Patch Changes

- Add `import` and `require` conditions to the JSON preset to reduce risk of
  dual package hazard in CJS/ESM environments.

## 2.1.0

### Minor Changes

- Add `JSONPreset` class to support automatic entry generation for `.json`
  files.

## 2.0.1

### Patch Changes

- Fix a caching issue that could cause CI to publish stale code. Caching
  behavior is now deterministic to ensure correct code is always released.

## 2.0.0

### Major Changes

- Rename `backup` option of `PackageJSONUpdaterExtension` to `safe` for clearer
  intent.

### Minor Changes

- Add `trailingNewLine` option to `PackageJSONUpdaterExtension`.
