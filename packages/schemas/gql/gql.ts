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
  "\n        query HealthCheck {\n          healthCheck\n        }\n      ": types.HealthCheckDocument,
  "\n          query Nodes {\n            nodes {\n              edges {\n                id\n                link\n                name\n                address\n                protocol\n                tag\n              }\n            }\n          }\n        ":
    types.NodesDocument,
  "\n          query Subscriptions {\n            subscriptions {\n              id\n              tag\n              link\n              nodes {\n                edges {\n                  id\n                  link\n                  name\n                  protocol\n                  tag\n                }\n              }\n            }\n          }\n        ":
    types.SubscriptionsDocument,
  "\n          query Configs {\n            configs {\n              id\n              selected\n              name\n              global {\n                tproxyPort\n                logLevel\n                tcpCheckUrl\n                udpCheckDns\n                checkInterval\n                checkTolerance\n                lanInterface\n                wanInterface\n                allowInsecure\n                dialMode\n              }\n              routing {\n                string\n              }\n              dns {\n                string\n              }\n            }\n          }\n        ":
    types.ConfigsDocument,
  "\n          query Groups {\n            groups {\n              id\n              name\n              policy\n              policyParams {\n                key\n                val\n              }\n            }\n          }\n        ":
    types.GroupsDocument,
  "\n          mutation removeNodes($ids: [ID!]!) {\n            removeNodes(ids: $ids)\n          }\n        ":
    types.RemoveNodesDocument,
  "\n          mutation removeSubscriptions($ids: [ID!]!) {\n            removeSubscriptions(ids: $ids)\n          }\n        ":
    types.RemoveSubscriptionsDocument,
  "\n          mutation selectConfig($id: ID!) {\n            selectConfig(id: $id)\n          }\n        ":
    types.SelectConfigDocument,
  "\n          mutation removeConfig($id: ID!) {\n            removeConfig(id: $id)\n          }\n        ":
    types.RemoveConfigDocument,
  "\n          mutation removeGroup($id: ID!) {\n            removeGroup(id: $id)\n          }\n        ":
    types.RemoveGroupDocument,
  "\n          query Interfaces {\n            general {\n              interfaces {\n                name\n              }\n            }\n          }\n        ":
    types.InterfacesDocument,
  "\n          query Running {\n            general {\n              dae {\n                running\n              }\n            }\n          }\n        ":
    types.RunningDocument,
  "\n          mutation Run($dry: Boolean!) {\n            run(dry: $dry)\n          }\n        ": types.RunDocument,
  "\n          mutation importNodes($rollbackError: Boolean!, $args: [ImportArgument!]!) {\n            importNodes(rollbackError: $rollbackError, args: $args) {\n              link\n              error\n            }\n          }\n        ":
    types.ImportNodesDocument,
  "\n          mutation importSubscription($rollbackError: Boolean!, $arg: ImportArgument!) {\n            importSubscription(rollbackError: $rollbackError, arg: $arg) {\n              link\n            }\n          }\n        ":
    types.ImportSubscriptionDocument,
  "\n          mutation createConfig($name: String, $global: globalInput, $dns: String, $routing: String) {\n            createConfig(name: $name, global: $global, dns: $dns, routing: $routing) {\n              id\n            }\n          }\n        ":
    types.CreateConfigDocument,
  "\n          mutation createGroup($name: String!, $policy: Policy!, $policyParams: [PolicyParam!]) {\n            createGroup(name: $name, policy: $policy, policyParams: $policyParams) {\n              id\n            }\n          }\n        ":
    types.CreateGroupDocument,
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
  source: "\n        query HealthCheck {\n          healthCheck\n        }\n      "
): (typeof documents)["\n        query HealthCheck {\n          healthCheck\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n          query Nodes {\n            nodes {\n              edges {\n                id\n                link\n                name\n                address\n                protocol\n                tag\n              }\n            }\n          }\n        "
): (typeof documents)["\n          query Nodes {\n            nodes {\n              edges {\n                id\n                link\n                name\n                address\n                protocol\n                tag\n              }\n            }\n          }\n        "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n          query Subscriptions {\n            subscriptions {\n              id\n              tag\n              link\n              nodes {\n                edges {\n                  id\n                  link\n                  name\n                  protocol\n                  tag\n                }\n              }\n            }\n          }\n        "
): (typeof documents)["\n          query Subscriptions {\n            subscriptions {\n              id\n              tag\n              link\n              nodes {\n                edges {\n                  id\n                  link\n                  name\n                  protocol\n                  tag\n                }\n              }\n            }\n          }\n        "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n          query Configs {\n            configs {\n              id\n              selected\n              name\n              global {\n                tproxyPort\n                logLevel\n                tcpCheckUrl\n                udpCheckDns\n                checkInterval\n                checkTolerance\n                lanInterface\n                wanInterface\n                allowInsecure\n                dialMode\n              }\n              routing {\n                string\n              }\n              dns {\n                string\n              }\n            }\n          }\n        "
): (typeof documents)["\n          query Configs {\n            configs {\n              id\n              selected\n              name\n              global {\n                tproxyPort\n                logLevel\n                tcpCheckUrl\n                udpCheckDns\n                checkInterval\n                checkTolerance\n                lanInterface\n                wanInterface\n                allowInsecure\n                dialMode\n              }\n              routing {\n                string\n              }\n              dns {\n                string\n              }\n            }\n          }\n        "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n          query Groups {\n            groups {\n              id\n              name\n              policy\n              policyParams {\n                key\n                val\n              }\n            }\n          }\n        "
): (typeof documents)["\n          query Groups {\n            groups {\n              id\n              name\n              policy\n              policyParams {\n                key\n                val\n              }\n            }\n          }\n        "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n          mutation removeNodes($ids: [ID!]!) {\n            removeNodes(ids: $ids)\n          }\n        "
): (typeof documents)["\n          mutation removeNodes($ids: [ID!]!) {\n            removeNodes(ids: $ids)\n          }\n        "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n          mutation removeSubscriptions($ids: [ID!]!) {\n            removeSubscriptions(ids: $ids)\n          }\n        "
): (typeof documents)["\n          mutation removeSubscriptions($ids: [ID!]!) {\n            removeSubscriptions(ids: $ids)\n          }\n        "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n          mutation selectConfig($id: ID!) {\n            selectConfig(id: $id)\n          }\n        "
): (typeof documents)["\n          mutation selectConfig($id: ID!) {\n            selectConfig(id: $id)\n          }\n        "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n          mutation removeConfig($id: ID!) {\n            removeConfig(id: $id)\n          }\n        "
): (typeof documents)["\n          mutation removeConfig($id: ID!) {\n            removeConfig(id: $id)\n          }\n        "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n          mutation removeGroup($id: ID!) {\n            removeGroup(id: $id)\n          }\n        "
): (typeof documents)["\n          mutation removeGroup($id: ID!) {\n            removeGroup(id: $id)\n          }\n        "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n          query Interfaces {\n            general {\n              interfaces {\n                name\n              }\n            }\n          }\n        "
): (typeof documents)["\n          query Interfaces {\n            general {\n              interfaces {\n                name\n              }\n            }\n          }\n        "];
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
  source: "\n          mutation Run($dry: Boolean!) {\n            run(dry: $dry)\n          }\n        "
): (typeof documents)["\n          mutation Run($dry: Boolean!) {\n            run(dry: $dry)\n          }\n        "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n          mutation importNodes($rollbackError: Boolean!, $args: [ImportArgument!]!) {\n            importNodes(rollbackError: $rollbackError, args: $args) {\n              link\n              error\n            }\n          }\n        "
): (typeof documents)["\n          mutation importNodes($rollbackError: Boolean!, $args: [ImportArgument!]!) {\n            importNodes(rollbackError: $rollbackError, args: $args) {\n              link\n              error\n            }\n          }\n        "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n          mutation importSubscription($rollbackError: Boolean!, $arg: ImportArgument!) {\n            importSubscription(rollbackError: $rollbackError, arg: $arg) {\n              link\n            }\n          }\n        "
): (typeof documents)["\n          mutation importSubscription($rollbackError: Boolean!, $arg: ImportArgument!) {\n            importSubscription(rollbackError: $rollbackError, arg: $arg) {\n              link\n            }\n          }\n        "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n          mutation createConfig($name: String, $global: globalInput, $dns: String, $routing: String) {\n            createConfig(name: $name, global: $global, dns: $dns, routing: $routing) {\n              id\n            }\n          }\n        "
): (typeof documents)["\n          mutation createConfig($name: String, $global: globalInput, $dns: String, $routing: String) {\n            createConfig(name: $name, global: $global, dns: $dns, routing: $routing) {\n              id\n            }\n          }\n        "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n          mutation createGroup($name: String!, $policy: Policy!, $policyParams: [PolicyParam!]) {\n            createGroup(name: $name, policy: $policy, policyParams: $policyParams) {\n              id\n            }\n          }\n        "
): (typeof documents)["\n          mutation createGroup($name: String!, $policy: Policy!, $policyParams: [PolicyParam!]) {\n            createGroup(name: $name, policy: $policy, policyParams: $policyParams) {\n              id\n            }\n          }\n        "];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<
  infer TType,
  any
>
  ? TType
  : never;
