/** @type {import('@graphql-codegen/cli').CodegenConfig} */
const config = {
  overwrite: true,
  schema: process.env.SCHEMA_PATH || "schema.graphql",
  documents: "src/**/*.tsx",
  prettier: true,
  generates: {
    "src/gql/": {
      preset: "client",
    },
  },
};

module.exports = config;
