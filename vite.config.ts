import path from 'path'

import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import EnvironmentPlugin from 'vite-plugin-environment'

// eslint-disable-next-line import/no-default-export
export default defineConfig(async ({ mode }) => {
  const { $ } = await import('execa')
  const { stdout: hash } = await $`git rev-parse --short HEAD`

  return {
    base: './',
    resolve: {
      alias: {
        '~': path.resolve('src'),
      },
    },
    plugins: [
      react(),
      EnvironmentPlugin({ __VERSION__: mode === 'development' ? 'dev' : hash }, { defineOn: 'import.meta.env' }),
    ],
  }
})
