module.exports = {
  overwrite: true,
  schema: process.env.SCHEMA_PATH || "schema.graphql",
  documents: "src/**/*.tsx",
  generates: {
    "src/gql/": {
      preset: "client",
    },
  },
};
