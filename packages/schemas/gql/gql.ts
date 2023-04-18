/* eslint-disable */
import * as types from './graphql'
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'

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
  '\n            query NumberUsers {\n              numberUsers\n            }\n          ': types.NumberUsersDocument,
  '\n              mutation CreateUser($username: String!, $password: String!) {\n                createUser(username: $username, password: $password)\n              }\n            ':
    types.CreateUserDocument,
  '\n              query Token($username: String!, $password: String!) {\n                token(username: $username, password: $password)\n              }\n            ':
    types.TokenDocument,
  '\n        query JsonStorage($paths: [String!]) {\n          jsonStorage(paths: $paths)\n        }\n      ':
    types.JsonStorageDocument,
  '\n        query General($up: Boolean) {\n          general {\n            interfaces(up: $up) {\n              name\n              ifindex\n            }\n          }\n        }\n      ':
    types.GeneralDocument,
  '\n          mutation SetJsonStorage($paths: [String!]!, $values: [String!]!) {\n            setJsonStorage(paths: $paths, values: $values)\n          }\n        ':
    types.SetJsonStorageDocument,
  '\n          mutation CreateConfig($name: String, $global: globalInput) {\n            createConfig(name: $name, global: $global) {\n              id\n            }\n          }\n        ':
    types.CreateConfigDocument,
  '\n          mutation SelectConfig($id: ID!) {\n            selectConfig(id: $id)\n          }\n        ':
    types.SelectConfigDocument,
  '\n          mutation CreateRouting($name: String, $routing: String) {\n            createRouting(name: $name, routing: $routing) {\n              id\n            }\n          }\n        ':
    types.CreateRoutingDocument,
  '\n          mutation SelectRouting($id: ID!) {\n            selectRouting(id: $id)\n          }\n        ':
    types.SelectRoutingDocument,
  '\n          mutation CreateDNS($name: String, $dns: String) {\n            createDns(name: $name, dns: $dns) {\n              id\n            }\n          }\n        ':
    types.CreateDnsDocument,
  '\n          mutation SelectDNS($id: ID!) {\n            selectDns(id: $id)\n          }\n        ':
    types.SelectDnsDocument,
  '\n          mutation CreateGroup($name: String!, $policy: Policy!, $policyParams: [PolicyParam!]) {\n            createGroup(name: $name, policy: $policy, policyParams: $policyParams) {\n              id\n            }\n          }\n        ':
    types.CreateGroupDocument,
  '\n          mutation GroupAddNodes($id: ID!, $nodeIDs: [ID!]!) {\n            groupAddNodes(id: $id, nodeIDs: $nodeIDs)\n          }\n        ':
    types.GroupAddNodesDocument,
  '\n          mutation ImportNodes($rollbackError: Boolean!, $args: [ImportArgument!]!) {\n            importNodes(rollbackError: $rollbackError, args: $args) {\n              link\n              error\n              node {\n                id\n              }\n            }\n          }\n        ':
    types.ImportNodesDocument,
  '\n          mutation RemoveNodes($ids: [ID!]!) {\n            removeNodes(ids: $ids)\n          }\n        ':
    types.RemoveNodesDocument,
  '\n              mutation ImportSubscription($rollbackError: Boolean!, $arg: ImportArgument!) {\n                importSubscription(rollbackError: $rollbackError, arg: $arg) {\n                  link\n                  nodeImportResult {\n                    node {\n                      id\n                    }\n                  }\n                }\n              }\n            ':
    types.ImportSubscriptionDocument,
  '\n          query Running {\n            general {\n              dae {\n                running\n              }\n            }\n          }\n        ':
    types.RunningDocument,
  '\n          query Nodes {\n            nodes {\n              edges {\n                id\n                name\n              }\n            }\n          }\n        ':
    types.NodesDocument,
}

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
export function graphql(source: string): unknown

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n            query NumberUsers {\n              numberUsers\n            }\n          '
): (typeof documents)['\n            query NumberUsers {\n              numberUsers\n            }\n          ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n              mutation CreateUser($username: String!, $password: String!) {\n                createUser(username: $username, password: $password)\n              }\n            '
): (typeof documents)['\n              mutation CreateUser($username: String!, $password: String!) {\n                createUser(username: $username, password: $password)\n              }\n            ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n              query Token($username: String!, $password: String!) {\n                token(username: $username, password: $password)\n              }\n            '
): (typeof documents)['\n              query Token($username: String!, $password: String!) {\n                token(username: $username, password: $password)\n              }\n            ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n        query JsonStorage($paths: [String!]) {\n          jsonStorage(paths: $paths)\n        }\n      '
): (typeof documents)['\n        query JsonStorage($paths: [String!]) {\n          jsonStorage(paths: $paths)\n        }\n      ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n        query General($up: Boolean) {\n          general {\n            interfaces(up: $up) {\n              name\n              ifindex\n            }\n          }\n        }\n      '
): (typeof documents)['\n        query General($up: Boolean) {\n          general {\n            interfaces(up: $up) {\n              name\n              ifindex\n            }\n          }\n        }\n      ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n          mutation SetJsonStorage($paths: [String!]!, $values: [String!]!) {\n            setJsonStorage(paths: $paths, values: $values)\n          }\n        '
): (typeof documents)['\n          mutation SetJsonStorage($paths: [String!]!, $values: [String!]!) {\n            setJsonStorage(paths: $paths, values: $values)\n          }\n        ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n          mutation CreateConfig($name: String, $global: globalInput) {\n            createConfig(name: $name, global: $global) {\n              id\n            }\n          }\n        '
): (typeof documents)['\n          mutation CreateConfig($name: String, $global: globalInput) {\n            createConfig(name: $name, global: $global) {\n              id\n            }\n          }\n        ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n          mutation SelectConfig($id: ID!) {\n            selectConfig(id: $id)\n          }\n        '
): (typeof documents)['\n          mutation SelectConfig($id: ID!) {\n            selectConfig(id: $id)\n          }\n        ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n          mutation CreateRouting($name: String, $routing: String) {\n            createRouting(name: $name, routing: $routing) {\n              id\n            }\n          }\n        '
): (typeof documents)['\n          mutation CreateRouting($name: String, $routing: String) {\n            createRouting(name: $name, routing: $routing) {\n              id\n            }\n          }\n        ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n          mutation SelectRouting($id: ID!) {\n            selectRouting(id: $id)\n          }\n        '
): (typeof documents)['\n          mutation SelectRouting($id: ID!) {\n            selectRouting(id: $id)\n          }\n        ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n          mutation CreateDNS($name: String, $dns: String) {\n            createDns(name: $name, dns: $dns) {\n              id\n            }\n          }\n        '
): (typeof documents)['\n          mutation CreateDNS($name: String, $dns: String) {\n            createDns(name: $name, dns: $dns) {\n              id\n            }\n          }\n        ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n          mutation SelectDNS($id: ID!) {\n            selectDns(id: $id)\n          }\n        '
): (typeof documents)['\n          mutation SelectDNS($id: ID!) {\n            selectDns(id: $id)\n          }\n        ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n          mutation CreateGroup($name: String!, $policy: Policy!, $policyParams: [PolicyParam!]) {\n            createGroup(name: $name, policy: $policy, policyParams: $policyParams) {\n              id\n            }\n          }\n        '
): (typeof documents)['\n          mutation CreateGroup($name: String!, $policy: Policy!, $policyParams: [PolicyParam!]) {\n            createGroup(name: $name, policy: $policy, policyParams: $policyParams) {\n              id\n            }\n          }\n        ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n          mutation GroupAddNodes($id: ID!, $nodeIDs: [ID!]!) {\n            groupAddNodes(id: $id, nodeIDs: $nodeIDs)\n          }\n        '
): (typeof documents)['\n          mutation GroupAddNodes($id: ID!, $nodeIDs: [ID!]!) {\n            groupAddNodes(id: $id, nodeIDs: $nodeIDs)\n          }\n        ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n          mutation ImportNodes($rollbackError: Boolean!, $args: [ImportArgument!]!) {\n            importNodes(rollbackError: $rollbackError, args: $args) {\n              link\n              error\n              node {\n                id\n              }\n            }\n          }\n        '
): (typeof documents)['\n          mutation ImportNodes($rollbackError: Boolean!, $args: [ImportArgument!]!) {\n            importNodes(rollbackError: $rollbackError, args: $args) {\n              link\n              error\n              node {\n                id\n              }\n            }\n          }\n        ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n          mutation RemoveNodes($ids: [ID!]!) {\n            removeNodes(ids: $ids)\n          }\n        '
): (typeof documents)['\n          mutation RemoveNodes($ids: [ID!]!) {\n            removeNodes(ids: $ids)\n          }\n        ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n              mutation ImportSubscription($rollbackError: Boolean!, $arg: ImportArgument!) {\n                importSubscription(rollbackError: $rollbackError, arg: $arg) {\n                  link\n                  nodeImportResult {\n                    node {\n                      id\n                    }\n                  }\n                }\n              }\n            '
): (typeof documents)['\n              mutation ImportSubscription($rollbackError: Boolean!, $arg: ImportArgument!) {\n                importSubscription(rollbackError: $rollbackError, arg: $arg) {\n                  link\n                  nodeImportResult {\n                    node {\n                      id\n                    }\n                  }\n                }\n              }\n            ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n          query Running {\n            general {\n              dae {\n                running\n              }\n            }\n          }\n        '
): (typeof documents)['\n          query Running {\n            general {\n              dae {\n                running\n              }\n            }\n          }\n        ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n          query Nodes {\n            nodes {\n              edges {\n                id\n                name\n              }\n            }\n          }\n        '
): (typeof documents)['\n          query Nodes {\n            nodes {\n              edges {\n                id\n                name\n              }\n            }\n          }\n        ']

export function graphql(source: string) {
  return (documents as any)[source] ?? {}
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<
  infer TType,
  any
>
  ? TType
  : never
