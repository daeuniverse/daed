import type { CodegenConfig } from '@graphql-codegen/cli'
import process from 'node:process'

export default {
  overwrite: true,
  schema: process.env.SCHEMA_PATH,
  documents: 'apps/web/src/**/*',
  generates: {
    'apps/web/src/schemas/gql/': {
      preset: 'client',
    },
  },
  hooks: { afterOneFileWrite: ['prettier -w'] },
} satisfies CodegenConfig
