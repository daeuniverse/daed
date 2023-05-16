import { CodegenConfig } from '@graphql-codegen/cli'

// eslint-disable-next-line import/no-default-export
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
