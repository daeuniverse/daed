/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly __VERSION__: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
