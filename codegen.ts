import { CodegenConfig } from '@graphql-codegen/cli'

export default {
  overwrite: true,
  schema: process.env.SCHEMA_PATH,
  documents: 'src/**/*',
  generates: {
    'src/schemas/gql/': {
      preset: 'client',
    },
  },
  hooks: { afterOneFileWrite: ['prettier -w'] },
} satisfies CodegenConfig
