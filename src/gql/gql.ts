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
  "\n        query Configs {\n          configs {\n            id\n            selected\n            global {\n              tproxyPort\n              logLevel\n              tcpCheckUrl\n              udpCheckDns\n              checkInterval\n              checkTolerance\n              lanInterface\n              wanInterface\n              allowInsecure\n              dialMode\n            }\n          }\n        }\n      ":
    types.ConfigsDocument,
  "\n        query Groups {\n          groups {\n            id\n            name\n            policy\n            policyParams {\n              key\n              val\n            }\n          }\n        }\n      ":
    types.GroupsDocument,
  "\n          mutation selectConfig($id: ID!) {\n            selectConfig(id: $id)\n          }\n        ":
    types.SelectConfigDocument,
  "\n          mutation removeConfig($id: ID!) {\n            removeConfig(id: $id)\n          }\n        ":
    types.RemoveConfigDocument,
  "\n          mutation createConfig($global: globalInput, $dns: String, $routing: String) {\n            createConfig(global: $global, dns: $dns, routing: $routing) {\n              id\n            }\n          }\n        ":
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
  source: "\n        query Configs {\n          configs {\n            id\n            selected\n            global {\n              tproxyPort\n              logLevel\n              tcpCheckUrl\n              udpCheckDns\n              checkInterval\n              checkTolerance\n              lanInterface\n              wanInterface\n              allowInsecure\n              dialMode\n            }\n          }\n        }\n      "
): (typeof documents)["\n        query Configs {\n          configs {\n            id\n            selected\n            global {\n              tproxyPort\n              logLevel\n              tcpCheckUrl\n              udpCheckDns\n              checkInterval\n              checkTolerance\n              lanInterface\n              wanInterface\n              allowInsecure\n              dialMode\n            }\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n        query Groups {\n          groups {\n            id\n            name\n            policy\n            policyParams {\n              key\n              val\n            }\n          }\n        }\n      "
): (typeof documents)["\n        query Groups {\n          groups {\n            id\n            name\n            policy\n            policyParams {\n              key\n              val\n            }\n          }\n        }\n      "];
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
  source: "\n          mutation createConfig($global: globalInput, $dns: String, $routing: String) {\n            createConfig(global: $global, dns: $dns, routing: $routing) {\n              id\n            }\n          }\n        "
): (typeof documents)["\n          mutation createConfig($global: globalInput, $dns: String, $routing: String) {\n            createConfig(global: $global, dns: $dns, routing: $routing) {\n              id\n            }\n          }\n        "];
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
