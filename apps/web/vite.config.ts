import path from 'node:path'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { version } from './package.json'

export default defineConfig(() => {
  return {
    base: './',
    resolve: { alias: { '~': path.resolve('src') } },
    plugins: [react(), tailwindcss()],
    build: {
      chunkSizeWarningLimit: 10 * 1024 * 1024,
      rolldownOptions: {
        external: ['zod/v4/core'],
      },
    },
    define: {
      'import.meta.env.APP_VERSION': JSON.stringify(version),
    },
    test: { globals: true },
  }
})
