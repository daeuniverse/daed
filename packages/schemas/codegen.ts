import { CodegenConfig } from "@graphql-codegen/cli";

// eslint-disable-next-line import/no-default-export
export default {
  overwrite: true,
  schema: process.env.SCHEMA_PATH,
  documents: "../../web/src/**/*.tsx",
  generates: {
    "gql/": {
      preset: "client",
    },
  },
  hooks: { afterOneFileWrite: ["prettier -w"] },
} as CodegenConfig;
