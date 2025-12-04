/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly APP_VERSION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
