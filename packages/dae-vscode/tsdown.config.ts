import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'tsdown'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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
  exports: true,
  outExtensions: () => ({ js: '.cjs' }),
  onSuccess: async () => {
    // Copy bundled dae-lsp server to dist/server
    const lspDistDir = path.resolve(__dirname, '../dae-lsp/dist')
    const serverDir = path.resolve(__dirname, 'dist/server')

    if (!fs.existsSync(serverDir)) {
      fs.mkdirSync(serverDir, { recursive: true })
    }

    const bundledServer = path.join(lspDistDir, 'server.bundled.cjs')
    if (!fs.existsSync(bundledServer)) {
      console.warn('Warning: dae-lsp bundled server not found at', bundledServer)
      console.warn('Please build dae-lsp first: pnpm -F @daeuniverse/dae-lsp build')
      return
    }

    // Copy the bundled server (renamed to server.cjs)
    fs.copyFileSync(bundledServer, path.join(serverDir, 'server.cjs'))
    console.log('Copied server.bundled.cjs to dist/server/server.cjs')
  },
})
