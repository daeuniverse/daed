import path from 'node:path'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

export default defineConfig(() => {
  return {
    base: './',
    resolve: { alias: { '~': path.resolve('src') } },
    plugins: [react(), tailwindcss()],
    test: { globals: true },
  }
})
