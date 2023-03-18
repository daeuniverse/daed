/* eslint-disable */
import * as types from "./graphql";
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
  "\n          query HealthCheck {\n            healthCheck\n          }\n        ": types.HealthCheckDocument,
  "\n          mutation ImportNodes($rollbackError: Boolean!, $args: [ImportArgument!]!) {\n            importNodes(rollbackError: $rollbackError, args: $args) {\n              link\n              error\n            }\n          }\n        ":
    types.ImportNodesDocument,
  "\n              mutation ImportSubscription($rollbackError: Boolean!, $arg: ImportArgument!) {\n                importSubscription(rollbackError: $rollbackError, arg: $arg) {\n                  link\n                }\n              }\n            ":
    types.ImportSubscriptionDocument,
  "\n          query Running {\n            general {\n              dae {\n                running\n              }\n            }\n          }\n        ":
    types.RunningDocument,
  "\n          query Nodes {\n            nodes {\n              edges {\n                id\n                name\n              }\n            }\n          }\n        ":
    types.NodesDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n          query HealthCheck {\n            healthCheck\n          }\n        "
): (typeof documents)["\n          query HealthCheck {\n            healthCheck\n          }\n        "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n          mutation ImportNodes($rollbackError: Boolean!, $args: [ImportArgument!]!) {\n            importNodes(rollbackError: $rollbackError, args: $args) {\n              link\n              error\n            }\n          }\n        "
): (typeof documents)["\n          mutation ImportNodes($rollbackError: Boolean!, $args: [ImportArgument!]!) {\n            importNodes(rollbackError: $rollbackError, args: $args) {\n              link\n              error\n            }\n          }\n        "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n              mutation ImportSubscription($rollbackError: Boolean!, $arg: ImportArgument!) {\n                importSubscription(rollbackError: $rollbackError, arg: $arg) {\n                  link\n                }\n              }\n            "
): (typeof documents)["\n              mutation ImportSubscription($rollbackError: Boolean!, $arg: ImportArgument!) {\n                importSubscription(rollbackError: $rollbackError, arg: $arg) {\n                  link\n                }\n              }\n            "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n          query Running {\n            general {\n              dae {\n                running\n              }\n            }\n          }\n        "
): (typeof documents)["\n          query Running {\n            general {\n              dae {\n                running\n              }\n            }\n          }\n        "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n          query Nodes {\n            nodes {\n              edges {\n                id\n                name\n              }\n            }\n          }\n        "
): (typeof documents)["\n          query Nodes {\n            nodes {\n              edges {\n                id\n                name\n              }\n            }\n          }\n        "];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<
  infer TType,
  any
>
  ? TType
  : never;
