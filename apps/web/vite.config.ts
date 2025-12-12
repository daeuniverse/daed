import path from 'node:path'
import { fileURLToPath } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { version } from './package.json'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig(() => {
  return {
    base: './',
    resolve: {
      alias: {
        '~': path.resolve(__dirname, 'src'),
        '@daeuniverse/dae-node-parser': path.resolve(__dirname, '../../packages/dae-node-parser/src/index.ts'),
        '@daeuniverse/dae-editor': path.resolve(__dirname, '../../packages/dae-editor/src/index.ts'),
      },
    },
    plugins: [react(), tailwindcss()],
    build: {
      chunkSizeWarningLimit: 10 * 1024 * 1024,
    },
    define: {
      'import.meta.env.APP_VERSION': JSON.stringify(version),
    },
    server: {
      host: '0.0.0.0',
    },
    test: { globals: true },
  }
})
