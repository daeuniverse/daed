import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  external: ['@monaco-editor/react', 'monaco-editor', 'shiki', '@shikijs/monaco'],
})
