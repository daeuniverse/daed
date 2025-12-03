import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/extension.ts'],
  format: ['cjs'],
  outDir: 'dist',
  clean: true,
  dts: false,
  sourcemap: true,
  external: ['vscode'],
  platform: 'node',
  target: 'node18',
  outExtensions: () => ({ js: '.js' }),
})
