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
  '\n          mutation SetJsonStorage($paths: [String!]!, $values: [String!]!) {\n            setJsonStorage(paths: $paths, values: $values)\n          }\n        ':
    types.SetJsonStorageDocument,
  '\n          mutation SetMode($paths: [String!]!, $values: [String!]!) {\n            setJsonStorage(paths: $paths, values: $values)\n          }\n        ':
    types.SetModeDocument,
  '\n          mutation CreateConfig($name: String, $global: globalInput) {\n            createConfig(name: $name, global: $global) {\n              id\n            }\n          }\n        ':
    types.CreateConfigDocument,
  '\n          mutation UpdateConfig($id: ID!, $global: globalInput!) {\n            updateConfig(id: $id, global: $global) {\n              id\n            }\n          }\n        ':
    types.UpdateConfigDocument,
  '\n          mutation RemoveConfig($id: ID!) {\n            removeConfig(id: $id)\n          }\n        ':
    types.RemoveConfigDocument,
  '\n          mutation SelectConfig($id: ID!) {\n            selectConfig(id: $id)\n          }\n        ':
    types.SelectConfigDocument,
  '\n          mutation RenameConfig($id: ID!, $name: String!) {\n            renameConfig(id: $id, name: $name)\n          }\n        ':
    types.RenameConfigDocument,
  '\n          mutation CreateRouting($name: String, $routing: String) {\n            createRouting(name: $name, routing: $routing) {\n              id\n            }\n          }\n        ':
    types.CreateRoutingDocument,
  '\n          mutation UpdateRouting($id: ID!, $routing: String!) {\n            updateRouting(id: $id, routing: $routing) {\n              id\n            }\n          }\n        ':
    types.UpdateRoutingDocument,
  '\n          mutation RemoveRouting($id: ID!) {\n            removeRouting(id: $id)\n          }\n        ':
    types.RemoveRoutingDocument,
  '\n          mutation SelectRouting($id: ID!) {\n            selectRouting(id: $id)\n          }\n        ':
    types.SelectRoutingDocument,
  '\n          mutation RenameRouting($id: ID!, $name: String!) {\n            renameRouting(id: $id, name: $name)\n          }\n        ':
    types.RenameRoutingDocument,
  '\n          mutation CreateDNS($name: String, $dns: String) {\n            createDns(name: $name, dns: $dns) {\n              id\n            }\n          }\n        ':
    types.CreateDnsDocument,
  '\n          mutation UpdateDNS($id: ID!, $dns: String!) {\n            updateDns(id: $id, dns: $dns) {\n              id\n            }\n          }\n        ':
    types.UpdateDnsDocument,
  '\n          mutation RemoveDNS($id: ID!) {\n            removeDns(id: $id)\n          }\n        ':
    types.RemoveDnsDocument,
  '\n          mutation SelectDNS($id: ID!) {\n            selectDns(id: $id)\n          }\n        ':
    types.SelectDnsDocument,
  '\n          mutation RenameDNS($id: ID!, $name: String!) {\n            renameDns(id: $id, name: $name)\n          }\n        ':
    types.RenameDnsDocument,
  '\n          mutation CreateGroup($name: String!, $policy: Policy!, $policyParams: [PolicyParam!]) {\n            createGroup(name: $name, policy: $policy, policyParams: $policyParams) {\n              id\n            }\n          }\n        ':
    types.CreateGroupDocument,
  '\n          mutation RemoveGroup($id: ID!) {\n            removeGroup(id: $id)\n          }\n        ':
    types.RemoveGroupDocument,
  '\n          mutation GroupSetPolicy($id: ID!, $policy: Policy!, $policyParams: [PolicyParam!]) {\n            groupSetPolicy(id: $id, policy: $policy, policyParams: $policyParams)\n          }\n        ':
    types.GroupSetPolicyDocument,
  '\n          mutation RenameGroup($id: ID!, $name: String!) {\n            renameGroup(id: $id, name: $name)\n          }\n        ':
    types.RenameGroupDocument,
  '\n          mutation GroupAddNodes($id: ID!, $nodeIDs: [ID!]!) {\n            groupAddNodes(id: $id, nodeIDs: $nodeIDs)\n          }\n        ':
    types.GroupAddNodesDocument,
  '\n          mutation GroupDelNodes($id: ID!, $nodeIDs: [ID!]!) {\n            groupDelNodes(id: $id, nodeIDs: $nodeIDs)\n          }\n        ':
    types.GroupDelNodesDocument,
  '\n          mutation GroupAddSubscriptions($id: ID!, $subscriptionIDs: [ID!]!) {\n            groupAddSubscriptions(id: $id, subscriptionIDs: $subscriptionIDs)\n          }\n        ':
    types.GroupAddSubscriptionsDocument,
  '\n          mutation GroupDelSubscriptions($id: ID!, $subscriptionIDs: [ID!]!) {\n            groupDelSubscriptions(id: $id, subscriptionIDs: $subscriptionIDs)\n          }\n        ':
    types.GroupDelSubscriptionsDocument,
  '\n          mutation ImportNodes($rollbackError: Boolean!, $args: [ImportArgument!]!) {\n            importNodes(rollbackError: $rollbackError, args: $args) {\n              link\n              error\n              node {\n                id\n              }\n            }\n          }\n        ':
    types.ImportNodesDocument,
  '\n          mutation RemoveNodes($ids: [ID!]!) {\n            removeNodes(ids: $ids)\n          }\n        ':
    types.RemoveNodesDocument,
  '\n              mutation ImportSubscription($rollbackError: Boolean!, $arg: ImportArgument!) {\n                importSubscription(rollbackError: $rollbackError, arg: $arg) {\n                  link\n                  sub {\n                    id\n                  }\n                  nodeImportResult {\n                    node {\n                      id\n                    }\n                  }\n                }\n              }\n            ':
    types.ImportSubscriptionDocument,
  '\n              mutation UpdateSubscription($id: ID!) {\n                updateSubscription(id: $id) {\n                  id\n                }\n              }\n            ':
    types.UpdateSubscriptionDocument,
  '\n          mutation RemoveSubscriptions($ids: [ID!]!) {\n            removeSubscriptions(ids: $ids)\n          }\n        ':
    types.RemoveSubscriptionsDocument,
  '\n          mutation Run($dry: Boolean!) {\n            run(dry: $dry)\n          }\n        ': types.RunDocument,
  '\n          mutation UpdateAvatar($avatar: String) {\n            updateAvatar(avatar: $avatar)\n          }\n        ':
    types.UpdateAvatarDocument,
  '\n          mutation UpdateName($name: String) {\n            updateName(name: $name)\n          }\n        ':
    types.UpdateNameDocument,
  '\n        query Mode($paths: [String!]) {\n          jsonStorage(paths: $paths)\n        }\n      ':
    types.ModeDocument,
  '\n        query Defaults($paths: [String!]) {\n          jsonStorage(paths: $paths)\n        }\n      ':
    types.DefaultsDocument,
  '\n        query Interfaces($up: Boolean) {\n          general {\n            interfaces(up: $up) {\n              name\n              ifindex\n              ip\n              flag {\n                default {\n                  gateway\n                }\n              }\n            }\n          }\n        }\n      ':
    types.InterfacesDocument,
  '\n          query JsonStorage($paths: [String!]) {\n            jsonStorage(paths: $paths)\n          }\n        ':
    types.JsonStorageDocument,
  '\n          query General($up: Boolean) {\n            general {\n              dae {\n                running\n                modified\n                version\n              }\n              interfaces(up: $up) {\n                name\n                ifindex\n                ip\n                flag {\n                  default {\n                    gateway\n                  }\n                }\n              }\n            }\n          }\n        ':
    types.GeneralDocument,
  '\n          query Nodes {\n            nodes {\n              edges {\n                id\n                name\n                link\n                address\n                protocol\n                tag\n              }\n            }\n          }\n        ':
    types.NodesDocument,
  '\n          query Subscriptions {\n            subscriptions {\n              id\n              tag\n              status\n              link\n              info\n              updatedAt\n              nodes {\n                edges {\n                  id\n                  name\n                  protocol\n                  link\n                }\n              }\n            }\n          }\n        ':
    types.SubscriptionsDocument,
  '\n          query Configs {\n            configs {\n              id\n              name\n              selected\n              global {\n                logLevel\n                tproxyPort\n                allowInsecure\n                checkInterval\n                checkTolerance\n                lanInterface\n                wanInterface\n                udpCheckDns\n                tcpCheckUrl\n                dialMode\n                tcpCheckHttpMethod\n                disableWaitingNetwork\n                autoConfigKernelParameter\n                sniffingTimeout\n                tlsImplementation\n                utlsImitate\n                tproxyPortProtect\n                soMarkFromDae\n                pprofPort\n                enableLocalTcpFastRedirect\n                mptcp\n                bandwidthMaxTx\n                bandwidthMaxRx\n              }\n            }\n          }\n        ':
    types.ConfigsDocument,
  '\n          query Groups {\n            groups {\n              id\n              name\n              nodes {\n                id\n                link\n                name\n                address\n                protocol\n                tag\n                subscriptionID\n              }\n              subscriptions {\n                id\n                updatedAt\n                tag\n                link\n                status\n                info\n\n                nodes {\n                  edges {\n                    id\n                    link\n                    name\n                    address\n                    protocol\n                    tag\n                    subscriptionID\n                  }\n                }\n              }\n              policy\n              policyParams {\n                key\n                val\n              }\n            }\n          }\n        ':
    types.GroupsDocument,
  '\n          query Routings {\n            routings {\n              id\n              name\n              selected\n              routing {\n                string\n              }\n            }\n          }\n        ':
    types.RoutingsDocument,
  '\n          query DNSs {\n            dnss {\n              id\n              name\n              dns {\n                string\n\n                routing {\n                  request {\n                    string\n                  }\n                  response {\n                    string\n                  }\n                }\n              }\n              selected\n            }\n          }\n        ':
    types.DnSsDocument,
  '\n          query User {\n            user {\n              username\n              name\n              avatar\n            }\n          }\n        ':
    types.UserDocument,
  '\n      query NumberUsers {\n        numberUsers\n      }\n    ': types.NumberUsersDocument,
  '\n          mutation CreateUser($username: String!, $password: String!) {\n            createUser(username: $username, password: $password)\n          }\n        ':
    types.CreateUserDocument,
  '\n          query Token($username: String!, $password: String!) {\n            token(username: $username, password: $password)\n          }\n        ':
    types.TokenDocument,
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
  source: '\n          mutation SetJsonStorage($paths: [String!]!, $values: [String!]!) {\n            setJsonStorage(paths: $paths, values: $values)\n          }\n        ',
): (typeof documents)['\n          mutation SetJsonStorage($paths: [String!]!, $values: [String!]!) {\n            setJsonStorage(paths: $paths, values: $values)\n          }\n        ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n          mutation SetMode($paths: [String!]!, $values: [String!]!) {\n            setJsonStorage(paths: $paths, values: $values)\n          }\n        ',
): (typeof documents)['\n          mutation SetMode($paths: [String!]!, $values: [String!]!) {\n            setJsonStorage(paths: $paths, values: $values)\n          }\n        ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n          mutation CreateConfig($name: String, $global: globalInput) {\n            createConfig(name: $name, global: $global) {\n              id\n            }\n          }\n        ',
): (typeof documents)['\n          mutation CreateConfig($name: String, $global: globalInput) {\n            createConfig(name: $name, global: $global) {\n              id\n            }\n          }\n        ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n          mutation UpdateConfig($id: ID!, $global: globalInput!) {\n            updateConfig(id: $id, global: $global) {\n              id\n            }\n          }\n        ',
): (typeof documents)['\n          mutation UpdateConfig($id: ID!, $global: globalInput!) {\n            updateConfig(id: $id, global: $global) {\n              id\n            }\n          }\n        ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n          mutation RemoveConfig($id: ID!) {\n            removeConfig(id: $id)\n          }\n        ',
): (typeof documents)['\n          mutation RemoveConfig($id: ID!) {\n            removeConfig(id: $id)\n          }\n        ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n          mutation SelectConfig($id: ID!) {\n            selectConfig(id: $id)\n          }\n        ',
): (typeof documents)['\n          mutation SelectConfig($id: ID!) {\n            selectConfig(id: $id)\n          }\n        ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n          mutation RenameConfig($id: ID!, $name: String!) {\n            renameConfig(id: $id, name: $name)\n          }\n        ',
): (typeof documents)['\n          mutation RenameConfig($id: ID!, $name: String!) {\n            renameConfig(id: $id, name: $name)\n          }\n        ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n          mutation CreateRouting($name: String, $routing: String) {\n            createRouting(name: $name, routing: $routing) {\n              id\n            }\n          }\n        ',
): (typeof documents)['\n          mutation CreateRouting($name: String, $routing: String) {\n            createRouting(name: $name, routing: $routing) {\n              id\n            }\n          }\n        ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n          mutation UpdateRouting($id: ID!, $routing: String!) {\n            updateRouting(id: $id, routing: $routing) {\n              id\n            }\n          }\n        ',
): (typeof documents)['\n          mutation UpdateRouting($id: ID!, $routing: String!) {\n            updateRouting(id: $id, routing: $routing) {\n              id\n            }\n          }\n        ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n          mutation RemoveRouting($id: ID!) {\n            removeRouting(id: $id)\n          }\n        ',
): (typeof documents)['\n          mutation RemoveRouting($id: ID!) {\n            removeRouting(id: $id)\n          }\n        ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n          mutation SelectRouting($id: ID!) {\n            selectRouting(id: $id)\n          }\n        ',
): (typeof documents)['\n          mutation SelectRouting($id: ID!) {\n            selectRouting(id: $id)\n          }\n        ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n          mutation RenameRouting($id: ID!, $name: String!) {\n            renameRouting(id: $id, name: $name)\n          }\n        ',
): (typeof documents)['\n          mutation RenameRouting($id: ID!, $name: String!) {\n            renameRouting(id: $id, name: $name)\n          }\n        ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n          mutation CreateDNS($name: String, $dns: String) {\n            createDns(name: $name, dns: $dns) {\n              id\n            }\n          }\n        ',
): (typeof documents)['\n          mutation CreateDNS($name: String, $dns: String) {\n            createDns(name: $name, dns: $dns) {\n              id\n            }\n          }\n        ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n          mutation UpdateDNS($id: ID!, $dns: String!) {\n            updateDns(id: $id, dns: $dns) {\n              id\n            }\n          }\n        ',
): (typeof documents)['\n          mutation UpdateDNS($id: ID!, $dns: String!) {\n            updateDns(id: $id, dns: $dns) {\n              id\n            }\n          }\n        ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n          mutation RemoveDNS($id: ID!) {\n            removeDns(id: $id)\n          }\n        ',
): (typeof documents)['\n          mutation RemoveDNS($id: ID!) {\n            removeDns(id: $id)\n          }\n        ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n          mutation SelectDNS($id: ID!) {\n            selectDns(id: $id)\n          }\n        ',
): (typeof documents)['\n          mutation SelectDNS($id: ID!) {\n            selectDns(id: $id)\n          }\n        ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n          mutation RenameDNS($id: ID!, $name: String!) {\n            renameDns(id: $id, name: $name)\n          }\n        ',
): (typeof documents)['\n          mutation RenameDNS($id: ID!, $name: String!) {\n            renameDns(id: $id, name: $name)\n          }\n        ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n          mutation CreateGroup($name: String!, $policy: Policy!, $policyParams: [PolicyParam!]) {\n            createGroup(name: $name, policy: $policy, policyParams: $policyParams) {\n              id\n            }\n          }\n        ',
): (typeof documents)['\n          mutation CreateGroup($name: String!, $policy: Policy!, $policyParams: [PolicyParam!]) {\n            createGroup(name: $name, policy: $policy, policyParams: $policyParams) {\n              id\n            }\n          }\n        ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n          mutation RemoveGroup($id: ID!) {\n            removeGroup(id: $id)\n          }\n        ',
): (typeof documents)['\n          mutation RemoveGroup($id: ID!) {\n            removeGroup(id: $id)\n          }\n        ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n          mutation GroupSetPolicy($id: ID!, $policy: Policy!, $policyParams: [PolicyParam!]) {\n            groupSetPolicy(id: $id, policy: $policy, policyParams: $policyParams)\n          }\n        ',
): (typeof documents)['\n          mutation GroupSetPolicy($id: ID!, $policy: Policy!, $policyParams: [PolicyParam!]) {\n            groupSetPolicy(id: $id, policy: $policy, policyParams: $policyParams)\n          }\n        ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n          mutation RenameGroup($id: ID!, $name: String!) {\n            renameGroup(id: $id, name: $name)\n          }\n        ',
): (typeof documents)['\n          mutation RenameGroup($id: ID!, $name: String!) {\n            renameGroup(id: $id, name: $name)\n          }\n        ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n          mutation GroupAddNodes($id: ID!, $nodeIDs: [ID!]!) {\n            groupAddNodes(id: $id, nodeIDs: $nodeIDs)\n          }\n        ',
): (typeof documents)['\n          mutation GroupAddNodes($id: ID!, $nodeIDs: [ID!]!) {\n            groupAddNodes(id: $id, nodeIDs: $nodeIDs)\n          }\n        ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n          mutation GroupDelNodes($id: ID!, $nodeIDs: [ID!]!) {\n            groupDelNodes(id: $id, nodeIDs: $nodeIDs)\n          }\n        ',
): (typeof documents)['\n          mutation GroupDelNodes($id: ID!, $nodeIDs: [ID!]!) {\n            groupDelNodes(id: $id, nodeIDs: $nodeIDs)\n          }\n        ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n          mutation GroupAddSubscriptions($id: ID!, $subscriptionIDs: [ID!]!) {\n            groupAddSubscriptions(id: $id, subscriptionIDs: $subscriptionIDs)\n          }\n        ',
): (typeof documents)['\n          mutation GroupAddSubscriptions($id: ID!, $subscriptionIDs: [ID!]!) {\n            groupAddSubscriptions(id: $id, subscriptionIDs: $subscriptionIDs)\n          }\n        ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n          mutation GroupDelSubscriptions($id: ID!, $subscriptionIDs: [ID!]!) {\n            groupDelSubscriptions(id: $id, subscriptionIDs: $subscriptionIDs)\n          }\n        ',
): (typeof documents)['\n          mutation GroupDelSubscriptions($id: ID!, $subscriptionIDs: [ID!]!) {\n            groupDelSubscriptions(id: $id, subscriptionIDs: $subscriptionIDs)\n          }\n        ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n          mutation ImportNodes($rollbackError: Boolean!, $args: [ImportArgument!]!) {\n            importNodes(rollbackError: $rollbackError, args: $args) {\n              link\n              error\n              node {\n                id\n              }\n            }\n          }\n        ',
): (typeof documents)['\n          mutation ImportNodes($rollbackError: Boolean!, $args: [ImportArgument!]!) {\n            importNodes(rollbackError: $rollbackError, args: $args) {\n              link\n              error\n              node {\n                id\n              }\n            }\n          }\n        ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n          mutation RemoveNodes($ids: [ID!]!) {\n            removeNodes(ids: $ids)\n          }\n        ',
): (typeof documents)['\n          mutation RemoveNodes($ids: [ID!]!) {\n            removeNodes(ids: $ids)\n          }\n        ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n              mutation ImportSubscription($rollbackError: Boolean!, $arg: ImportArgument!) {\n                importSubscription(rollbackError: $rollbackError, arg: $arg) {\n                  link\n                  sub {\n                    id\n                  }\n                  nodeImportResult {\n                    node {\n                      id\n                    }\n                  }\n                }\n              }\n            ',
): (typeof documents)['\n              mutation ImportSubscription($rollbackError: Boolean!, $arg: ImportArgument!) {\n                importSubscription(rollbackError: $rollbackError, arg: $arg) {\n                  link\n                  sub {\n                    id\n                  }\n                  nodeImportResult {\n                    node {\n                      id\n                    }\n                  }\n                }\n              }\n            ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n              mutation UpdateSubscription($id: ID!) {\n                updateSubscription(id: $id) {\n                  id\n                }\n              }\n            ',
): (typeof documents)['\n              mutation UpdateSubscription($id: ID!) {\n                updateSubscription(id: $id) {\n                  id\n                }\n              }\n            ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n          mutation RemoveSubscriptions($ids: [ID!]!) {\n            removeSubscriptions(ids: $ids)\n          }\n        ',
): (typeof documents)['\n          mutation RemoveSubscriptions($ids: [ID!]!) {\n            removeSubscriptions(ids: $ids)\n          }\n        ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n          mutation Run($dry: Boolean!) {\n            run(dry: $dry)\n          }\n        ',
): (typeof documents)['\n          mutation Run($dry: Boolean!) {\n            run(dry: $dry)\n          }\n        ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n          mutation UpdateAvatar($avatar: String) {\n            updateAvatar(avatar: $avatar)\n          }\n        ',
): (typeof documents)['\n          mutation UpdateAvatar($avatar: String) {\n            updateAvatar(avatar: $avatar)\n          }\n        ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n          mutation UpdateName($name: String) {\n            updateName(name: $name)\n          }\n        ',
): (typeof documents)['\n          mutation UpdateName($name: String) {\n            updateName(name: $name)\n          }\n        ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n        query Mode($paths: [String!]) {\n          jsonStorage(paths: $paths)\n        }\n      ',
): (typeof documents)['\n        query Mode($paths: [String!]) {\n          jsonStorage(paths: $paths)\n        }\n      ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n        query Defaults($paths: [String!]) {\n          jsonStorage(paths: $paths)\n        }\n      ',
): (typeof documents)['\n        query Defaults($paths: [String!]) {\n          jsonStorage(paths: $paths)\n        }\n      ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n        query Interfaces($up: Boolean) {\n          general {\n            interfaces(up: $up) {\n              name\n              ifindex\n              ip\n              flag {\n                default {\n                  gateway\n                }\n              }\n            }\n          }\n        }\n      ',
): (typeof documents)['\n        query Interfaces($up: Boolean) {\n          general {\n            interfaces(up: $up) {\n              name\n              ifindex\n              ip\n              flag {\n                default {\n                  gateway\n                }\n              }\n            }\n          }\n        }\n      ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n          query JsonStorage($paths: [String!]) {\n            jsonStorage(paths: $paths)\n          }\n        ',
): (typeof documents)['\n          query JsonStorage($paths: [String!]) {\n            jsonStorage(paths: $paths)\n          }\n        ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n          query General($up: Boolean) {\n            general {\n              dae {\n                running\n                modified\n                version\n              }\n              interfaces(up: $up) {\n                name\n                ifindex\n                ip\n                flag {\n                  default {\n                    gateway\n                  }\n                }\n              }\n            }\n          }\n        ',
): (typeof documents)['\n          query General($up: Boolean) {\n            general {\n              dae {\n                running\n                modified\n                version\n              }\n              interfaces(up: $up) {\n                name\n                ifindex\n                ip\n                flag {\n                  default {\n                    gateway\n                  }\n                }\n              }\n            }\n          }\n        ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n          query Nodes {\n            nodes {\n              edges {\n                id\n                name\n                link\n                address\n                protocol\n                tag\n              }\n            }\n          }\n        ',
): (typeof documents)['\n          query Nodes {\n            nodes {\n              edges {\n                id\n                name\n                link\n                address\n                protocol\n                tag\n              }\n            }\n          }\n        ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n          query Subscriptions {\n            subscriptions {\n              id\n              tag\n              status\n              link\n              info\n              updatedAt\n              nodes {\n                edges {\n                  id\n                  name\n                  protocol\n                  link\n                }\n              }\n            }\n          }\n        ',
): (typeof documents)['\n          query Subscriptions {\n            subscriptions {\n              id\n              tag\n              status\n              link\n              info\n              updatedAt\n              nodes {\n                edges {\n                  id\n                  name\n                  protocol\n                  link\n                }\n              }\n            }\n          }\n        ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n          query Configs {\n            configs {\n              id\n              name\n              selected\n              global {\n                logLevel\n                tproxyPort\n                allowInsecure\n                checkInterval\n                checkTolerance\n                lanInterface\n                wanInterface\n                udpCheckDns\n                tcpCheckUrl\n                dialMode\n                tcpCheckHttpMethod\n                disableWaitingNetwork\n                autoConfigKernelParameter\n                sniffingTimeout\n                tlsImplementation\n                utlsImitate\n                tproxyPortProtect\n                soMarkFromDae\n                pprofPort\n                enableLocalTcpFastRedirect\n                mptcp\n                bandwidthMaxTx\n                bandwidthMaxRx\n              }\n            }\n          }\n        ',
): (typeof documents)['\n          query Configs {\n            configs {\n              id\n              name\n              selected\n              global {\n                logLevel\n                tproxyPort\n                allowInsecure\n                checkInterval\n                checkTolerance\n                lanInterface\n                wanInterface\n                udpCheckDns\n                tcpCheckUrl\n                dialMode\n                tcpCheckHttpMethod\n                disableWaitingNetwork\n                autoConfigKernelParameter\n                sniffingTimeout\n                tlsImplementation\n                utlsImitate\n                tproxyPortProtect\n                soMarkFromDae\n                pprofPort\n                enableLocalTcpFastRedirect\n                mptcp\n                bandwidthMaxTx\n                bandwidthMaxRx\n              }\n            }\n          }\n        ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n          query Groups {\n            groups {\n              id\n              name\n              nodes {\n                id\n                link\n                name\n                address\n                protocol\n                tag\n                subscriptionID\n              }\n              subscriptions {\n                id\n                updatedAt\n                tag\n                link\n                status\n                info\n\n                nodes {\n                  edges {\n                    id\n                    link\n                    name\n                    address\n                    protocol\n                    tag\n                    subscriptionID\n                  }\n                }\n              }\n              policy\n              policyParams {\n                key\n                val\n              }\n            }\n          }\n        ',
): (typeof documents)['\n          query Groups {\n            groups {\n              id\n              name\n              nodes {\n                id\n                link\n                name\n                address\n                protocol\n                tag\n                subscriptionID\n              }\n              subscriptions {\n                id\n                updatedAt\n                tag\n                link\n                status\n                info\n\n                nodes {\n                  edges {\n                    id\n                    link\n                    name\n                    address\n                    protocol\n                    tag\n                    subscriptionID\n                  }\n                }\n              }\n              policy\n              policyParams {\n                key\n                val\n              }\n            }\n          }\n        ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n          query Routings {\n            routings {\n              id\n              name\n              selected\n              routing {\n                string\n              }\n            }\n          }\n        ',
): (typeof documents)['\n          query Routings {\n            routings {\n              id\n              name\n              selected\n              routing {\n                string\n              }\n            }\n          }\n        ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n          query DNSs {\n            dnss {\n              id\n              name\n              dns {\n                string\n\n                routing {\n                  request {\n                    string\n                  }\n                  response {\n                    string\n                  }\n                }\n              }\n              selected\n            }\n          }\n        ',
): (typeof documents)['\n          query DNSs {\n            dnss {\n              id\n              name\n              dns {\n                string\n\n                routing {\n                  request {\n                    string\n                  }\n                  response {\n                    string\n                  }\n                }\n              }\n              selected\n            }\n          }\n        ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n          query User {\n            user {\n              username\n              name\n              avatar\n            }\n          }\n        ',
): (typeof documents)['\n          query User {\n            user {\n              username\n              name\n              avatar\n            }\n          }\n        ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      query NumberUsers {\n        numberUsers\n      }\n    ',
): (typeof documents)['\n      query NumberUsers {\n        numberUsers\n      }\n    ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n          mutation CreateUser($username: String!, $password: String!) {\n            createUser(username: $username, password: $password)\n          }\n        ',
): (typeof documents)['\n          mutation CreateUser($username: String!, $password: String!) {\n            createUser(username: $username, password: $password)\n          }\n        ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n          query Token($username: String!, $password: String!) {\n            token(username: $username, password: $password)\n          }\n        ',
): (typeof documents)['\n          query Token($username: String!, $password: String!) {\n            token(username: $username, password: $password)\n          }\n        ']

export function graphql(source: string) {
  return (documents as any)[source] ?? {}
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never
