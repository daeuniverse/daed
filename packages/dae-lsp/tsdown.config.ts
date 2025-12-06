import { defineConfig } from 'tsdown'

export default defineConfig([
  // Library build (with external dependencies for npm consumers)
  {
    entry: ['src/mod.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    clean: true,
    sourcemap: true,
    shims: true,
    outDir: 'dist',
  },
  // Server build (bundled, for VS Code extension)
  {
    entry: { 'server.bundled': 'src/server.ts' },
    format: ['cjs'],
    dts: false,
    sourcemap: true,
    shims: true,
    outDir: 'dist',
    // Bundle all dependencies for standalone server
    noExternal: [/.*/],
    platform: 'node',
    target: 'node18',
  },
  // Server build (external dependencies, for npm bin)
  {
    entry: ['src/server.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    sourcemap: true,
    shims: true,
    outDir: 'dist',
  },
])
