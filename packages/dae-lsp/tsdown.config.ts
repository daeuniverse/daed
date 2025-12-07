import { defineConfig } from 'tsdown'

export default defineConfig([
  // Library build (with external dependencies for npm consumers)
  {
    entry: ['src/mod.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    sourcemap: true,
    shims: true,
    outDir: 'dist',
    clean: false,
  },
  // Node.js server build (bundled, for VS Code extension)
  {
    entry: { 'server.bundled': 'src/server-node.ts' },
    format: ['cjs'],
    dts: false,
    sourcemap: true,
    shims: true,
    outDir: 'dist',
    // Bundle all dependencies for standalone server
    noExternal: [/.*/],
    platform: 'node',
    target: 'node18',
    clean: false,
  },
  // Node.js server build (external dependencies, for npm bin)
  {
    entry: { server: 'src/server-node.ts' },
    format: ['cjs', 'esm'],
    dts: true,
    sourcemap: true,
    shims: true,
    outDir: 'dist',
    clean: false,
  },
  // Browser server build (bundled, for web worker)
  {
    entry: { 'server.browser': 'src/browser-server.ts' },
    format: ['esm'],
    dts: false,
    sourcemap: true,
    shims: true,
    outDir: 'dist',
    // Bundle all dependencies for standalone browser worker
    noExternal: [/.*/],
    platform: 'browser',
    target: 'es2022',
    clean: false,
  },
])
